import 'dart:async';
import 'dart:ffi';
import 'dart:math';

import 'package:currency_text_input_formatter/currency_text_input_formatter.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_keyboard_visibility/flutter_keyboard_visibility.dart';
import 'package:flutter_m8/Struct/enums.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/components/components.dart';
import 'package:flutter_m8/services/service_bridge.dart';
import 'package:intl/intl.dart';

class BridgePage extends StatefulWidget{
  @override
  _BridgePageState createState() => _BridgePageState();

}

class _BridgePageState extends State<BridgePage>{
  //Objeto utilizado para o uso das funções do Bridge
  BridgeService bridgeService = new BridgeService();

  //Formatar do plugin currencyInputFormatter para a máscara de valor da transação
  final CurrencyTextInputFormatter _formatter = new CurrencyTextInputFormatter(decimalDigits: 2, locale: 'pt_BR', symbol: '', turnOffGrouping: true);
 
  
  //Controllers para os formsFields
  TextEditingController controllerIpBridge = new TextEditingController(text: "192.168.0.100");
  TextEditingController controllerTransactionPort = new TextEditingController(text: "3000");
  TextEditingController controllerStatusPort = new TextEditingController(text: "3001");
  TextEditingController controllerTransactionValue = new TextEditingController(text: "20,00");
  TextEditingController controllerNumberOfInstallments = new TextEditingController(text: "1");
  TextEditingController controllerPassword = new TextEditingController(text: "");

  //Se a forma de pagamento for por crédito
  bool isCreditPaymentMethodSelected = true;

  //Se deve enviar senha nas transações
  bool sendPassword = false;



  //Forma de pagemento selecionada inicialmente
  PaymentMethod selectedPaymentMethod = PaymentMethod.CREDITO;

  //Forma de parcelamento selecionada inicialmente
  InstallmentMethod selectedInstallmentMethod = InstallmentMethod.FINANCIAMENTO_A_VISTA;

  //String utilizada nas transações para identificar o PVD
  static const String PDV_CODE = "PDV";

  ///A implementação da remoção de foco foi feita para que os dialogs que aparecerão na tela não invoquem novamente o teclado após o seu término
  ///pois nenhum input terá o foco após o teclado ser fechado com o pressionamento do botão de voltar (backButton)
    
  //Parametros para implementação da remoção do focus() em inputs quando a tecla backButton for pressionada no teclado
  late final KeyboardVisibilityController _keyboardVisibilityController;
  late StreamSubscription<bool> keyboardSubscription;
 
  //Quando a página iniciar adiciona um listener que escutará quando a tecla backButton for apertada e removerá o focos de qualquer input que ainda esteja com o focus()
  @override
  void initState() {
    super.initState();
    _keyboardVisibilityController = KeyboardVisibilityController();
    keyboardSubscription = _keyboardVisibilityController.onChange.listen((isVisible) {
      if (!isVisible) FocusManager.instance.primaryFocus?.unfocus();
    });
  }

  @override
  void dispose() {
    keyboardSubscription.cancel();
    super.dispose();
  }

  //Mudança de forma de pagamento
  onPaymentMethodChanged(PaymentMethod paymentMethodSelected) {
    setState(
      () =>
       {
          selectedPaymentMethod = paymentMethodSelected,
          isCreditPaymentMethodSelected = (paymentMethodSelected == PaymentMethod.CREDITO)
        }
      );
  }

  //Mudança de forma de parcelamento
  onInstallmentMethodChanged(InstallmentMethod installmentMethodSelected) {
    setState(
      () => 
      {
        selectedInstallmentMethod = installmentMethodSelected,
        if(installmentMethodSelected == InstallmentMethod.FINANCIAMENTO_A_VISTA){
          controllerNumberOfInstallments.text = '1',
        } else controllerNumberOfInstallments.text = '2' 
      }
    );
  }

  //Checkbox de envio de senha
  void onShouldSendPasswordChanged(bool value){
    this.sendPassword = value;
    print(sendPassword);
    setState(() {
      this.sendPassword = value;
    });
  }


  //Antes de quaisquer operações Bridge, atualizar o Ip e portas por onde a conexão será feita tryToUpdateBridgeServer(), validando todos os campos e retornando se foi possível atualizar com os dados valores.
  //Logo em seguida, verificar se o envio de senha deve ser feito shouldSendPassword()
  onConsultTerminalStatusPressed() async {
    //Variavel utilizada para receber o retorno do Bridge
    String bridgeReturn = '';

    if(tryToUpdateBridgeServer()){
      shouldSendPassword();

      bridgeReturn = await bridgeService.consultarStatus();

      await GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: bridgeReturn );
    }
  }

  onConsultConfiguredTimeoutPressed() async {
    String bridgeReturn = '';

    if(tryToUpdateBridgeServer()){
      shouldSendPassword();

      bridgeReturn = await bridgeService.getTimeout();

      await GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: bridgeReturn );
    }
  }

  onConsultLastTransactionPressed() async {
   String bridgeReturn = '';

    if(tryToUpdateBridgeServer()){
      shouldSendPassword();

      bridgeReturn = await bridgeService.consultarUltimaTransacao(pdv: PDV_CODE);

      await GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: bridgeReturn );
    }
  }

  //Sempre que uma operação que envolva o campo de valor for chamada, validar este campo para o pagamento com isValueValiToElginPay()
  onSendTransactionPressed() async {
    if(tryToUpdateBridgeServer() && isValueValidToElginPay()){
      shouldSendPassword();

      //O valor da transação deve ser enviado ao Bridge em centavos (ex R$ 20,00 deve ser passado 2000), portanto removemos a ',' antes da passagem do parametro valorTotal
      String transactionValueFormatted = controllerTransactionValue.text.replaceAll(',', '');

      String bridgeReturn = '';


      if(selectedPaymentMethod == PaymentMethod.DEBITO){
        bridgeReturn = await bridgeService.iniciaVendaDebito(idTransacao: generateRandomIntForBridgeTransaction(), pdv: PDV_CODE, valorTotal: transactionValueFormatted);
          
        await GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: bridgeReturn );
      }
      else{
        //Se o pagamento for por crédito, valida o número de parcelas inserido:
        if(isInstallmentsFieldValid()){
          bridgeReturn = await bridgeService.iniciaVendaCredito(idTransacao: generateRandomIntForBridgeTransaction(), pdv: PDV_CODE, valorTotal: transactionValueFormatted, tipoFinanciamento: selectedInstallmentMethod, numeroParcelas: int.parse(controllerNumberOfInstallments.text));

          await GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: bridgeReturn );
        }
      }
    }
  }
  

  onCancelTransactionPressed() async{
    if(tryToUpdateBridgeServer()){
      shouldSendPassword();

      String inputRef = '';
    //aceitar apenas caractéres numéricos de 0 a 9
    FilteringTextInputFormatter cancelTrasanctionFilterToOnlyDigits = FilteringTextInputFormatter.allow(RegExp('[0-9]'));


    OnInputRefChanged(String newInputRef){
      inputRef = newInputRef;
    }

    OnPressedAction(int pressedAction) {
      Navigator.of(context).pop();

      
      //Se a opção OK foi selecionada
      if(pressedAction == 1) {
        //No app APP Experience, para fins de simplificação, faremos cancelamento apenas de vendas do mesmo dia, mas como pode ser inspecionado abaixo e na função no methodChannel no Java, podemos passar a data de cancelamento diretamente pra função de cancelamento
        DateTime now = DateTime.now();
        String formattedDate = DateFormat('dd/MM/yy').format(now);

        //O valor da transação deve ser enviado ao Bridge em centavos (ex R$ 20,00 deve ser passado 2000), portanto removemos a ',' antes da passagem do parametro valorTotal
        String transactionValueFormatted = controllerTransactionValue.text.replaceAll(',', '');

        String bridgeReturn = '';

        bridgeService.iniciaCancelamentoVenda(idTransacao: generateRandomIntForBridgeTransaction(), pdv: PDV_CODE, valorTotal: transactionValueFormatted, dataHora: formattedDate, nsu: inputRef).then(
          (stringRetornoCancelamentoVenda){
            GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: stringRetornoCancelamentoVenda);
          });
      }
    }


    GeneralWidgets.showAlertDialogWithInputField(mainWidgetContext: context, dialogTitle: 'Código de Referência: ', onTextInput: OnInputRefChanged, onPressedAction: OnPressedAction, textInputType: TextInputType.number, filteringTextInputFormatter: cancelTrasanctionFilterToOnlyDigits);
    }
  }

  onSetTerminalPasswordPressed(){
    if(tryToUpdateBridgeServer()){
      shouldSendPassword();

      List<String> enableOrDisablePasswordOptions = ["Habilitar Senha no Terminal", "Desabilitar Senha no Terminal"];

      onEnableOrDisablePasswordOptionTapped(int indexOfTapped){
        Navigator.of(context).pop();

        const int PRESSED_ACTION_ENABLEPASSWORD = 0;
        const int PRESSED_ACTION_DISABLEPASSWORD = 1;

        //Função e String utilizada para o recebimento do input no campo de diálogo
        String passwordToBeSet = '';
        onPasswordToBeSetChanged(String newPasswordToBeSet){
          passwordToBeSet = newPasswordToBeSet;
        }

        //Se a opção escolhida foi Habilitar senha no terminal
        if(indexOfTapped == PRESSED_ACTION_ENABLEPASSWORD){
          

          onPressedAction(int pressedAction){
            Navigator.of(context).pop();
            if(pressedAction == 1){
              const bool HABILITAR_SENHA_TERMINAL = true;

              //Valida se o usuario não entrou com uma senha vazia
              if(passwordToBeSet.isEmpty){
                GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'ALERTA', dialogText: 'O campo de senha a ser habilitada não pode ser vazio!');
              }
              else{
                bridgeService.setSenhaServer(senha: passwordToBeSet, habilitada: HABILITAR_SENHA_TERMINAL).then(
                  (stringRetornoSetSenhaServer){
                    GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: stringRetornoSetSenhaServer);
                  }
                );
              }
            }

          }

          GeneralWidgets.showAlertDialogWithInputField(mainWidgetContext: context, dialogTitle: 'DIGITE A SENHA A SER HABILITADA' , onTextInput: onPasswordToBeSetChanged, onPressedAction: onPressedAction);
        }
        //Se a opção selecionada for de desabilite de senha
        else{
          //Para o desabilite de senha no terminal deve ser passado o booleano false
          const bool DESABILITAR_SENHA_TERMINAL = false;
          //Para apagar a senha no terminal deve-se enviar uma String vazia
          const String ERASE_TERMINAL_PASSWORD = '';

          bridgeService.setSenhaServer(senha: ERASE_TERMINAL_PASSWORD, habilitada: DESABILITAR_SENHA_TERMINAL).then(
                  (stringRetornoSetSenhaServer){
                    GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: stringRetornoSetSenhaServer);
                  }
                );
        }
      }
      GeneralWidgets.showAlertDialogWithSelectableOptions(mainWidgetContext: context, alertTitle: 'ESCOLHA COMO CONFIGURAR A SENHA', listOfOptions: enableOrDisablePasswordOptions, onTap: onEnableOrDisablePasswordOptionTapped);
    }
  }

  onAdministrativeOperationPressed(){
    if(tryToUpdateBridgeServer()){
      shouldSendPassword();

      List<String> administrativeOperationsList = ["Operação Administrativa", "Operação de Instalação", "Operação de Configuração", "Operação de Manutenção", "Teste de Comunicação", "Reimpressão de Comprovante"];
      
      onAdministrativeOptionTapped(int indexOfTapped) {
        Navigator.of(context).pop();
        //Neste caso o indice da opção escolhida corresponde diretamente ao valor que deve ser enviado para a escolha da operação a ser executada, pois a lista esta na ordem como especificada na documentação da Lib E1 (0-5)
        bridgeService.iniciaOperacaoAdministrativa(idTransacao: generateRandomIntForBridgeTransaction(), pdv: PDV_CODE, operacao: indexOfTapped).then((
          (stringRetornoOperacaoAdministrativa){
            GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: stringRetornoOperacaoAdministrativa);
          }
        ));
      }
      
      GeneralWidgets.showAlertDialogWithSelectableOptions(mainWidgetContext: context, alertTitle: 'ESCOLHA A OPERAÇÃO ADMINISTRATIVA', listOfOptions: administrativeOperationsList, onTap: onAdministrativeOptionTapped);
    }
  }

  onPrintTestCouponPressed(){
    if(tryToUpdateBridgeServer()){
      shouldSendPassword();

      List<String> couponOptions = ["Imprimir Cupom NFCe", "Imprimir Cupom Sat", "Imprimir Cupom Sat Cancelamento"];
      onCouponOptionTapped(int indexOfTapped){
        Navigator.of(context).pop();
        
        //Todos os valores abaixo são exemplos
        switch(indexOfTapped){
          case 0:
            const String XML_EXEMPLO_CUPOM_NFCE = "<?xml version='1.0' encoding='utf-8'?><NFe xmlns=\"http://www.portalfiscal.inf.br/nfe\"><infNFe Id=\"NFe13220114200166000166650070000001029870832698\" versao=\"4.00\"><ide><cUF>13</cUF><cNF>87083269</cNF><natOp>venda</natOp><mod>65</mod><serie>7</serie><nNF>102</nNF><dhEmi>2022-01-26T11:38:37-03:00</dhEmi><tpNF>1</tpNF><idDest>1</idDest><cMunFG>1302603</cMunFG><tpImp>4</tpImp><tpEmis>1</tpEmis><cDV>8</cDV><tpAmb>2</tpAmb><finNFe>1</finNFe><indFinal>1</indFinal><indPres>1</indPres><procEmi>0</procEmi><verProc>pynota 0.1.0</verProc><dhCont>2022-01-26T11:38:38-03:00</dhCont><xJust>Conexão com a sefaz indisponível</xJust></ide><emit><CNPJ>14200166000166</CNPJ><xNome>NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xNome><xFant>Elgin S/A</xFant><enderEmit><xLgr>Avenida Manaus Dois Mil</xLgr><nro>1</nro><xBairro>Japiim</xBairro><cMun>1302603</cMun><xMun>Manaus</xMun><UF>AM</UF><CEP>69076448</CEP><cPais>1058</cPais><xPais>Brasil</xPais><fone>1133835816</fone></enderEmit><IE>062012991</IE><IM>793</IM><CNAE>6202300</CNAE><CRT>3</CRT></emit><det nItem=\"1\"><prod><cProd>123</cProd><cEAN>SEM GTIN</cEAN><xProd>NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xProd><NCM>22030000</NCM><CEST>0302100</CEST><indEscala>S</indEscala><CFOP>5102</CFOP><uCom>UN</uCom><qCom>1</qCom><vUnCom>1</vUnCom><vProd>1.00</vProd><cEANTrib>5000000000357</cEANTrib><uTrib>UN</uTrib><qTrib>1</qTrib><vUnTrib>1</vUnTrib><indTot>1</indTot></prod><imposto><ICMS><ICMS40><orig>0</orig><CST>41</CST></ICMS40></ICMS><PIS><PISAliq><CST>01</CST><vBC>1.00</vBC><pPIS>1.6500</pPIS><vPIS>0.02</vPIS></PISAliq></PIS><COFINS><COFINSAliq><CST>01</CST><vBC>1.00</vBC><pCOFINS>7.6000</pCOFINS><vCOFINS>0.08</vCOFINS></COFINSAliq></COFINS></imposto></det><total><ICMSTot><vBC>0.00</vBC><vICMS>0.00</vICMS><vICMSDeson>0.00</vICMSDeson><vFCP>0.00</vFCP><vBCST>0.00</vBCST><vST>0.00</vST><vFCPST>0.00</vFCPST><vFCPSTRet>0.00</vFCPSTRet><vProd>1.00</vProd><vFrete>0.00</vFrete><vSeg>0.00</vSeg><vDesc>0.00</vDesc><vII>0.00</vII><vIPI>0.00</vIPI><vIPIDevol>0.00</vIPIDevol><vPIS>0.02</vPIS><vCOFINS>0.08</vCOFINS><vOutro>0.00</vOutro><vNF>1.00</vNF><vTotTrib>0.00</vTotTrib></ICMSTot></total><transp><modFrete>9</modFrete><vol><qVol>12</qVol><esp>VOL</esp><marca>Elgin SA</marca><nVol>0 A 0</nVol><pesoL>20.123</pesoL><pesoB>30.123</pesoB><lacres><nLacre>3000</nLacre></lacres></vol></transp><pag><detPag><indPag>0</indPag><tPag>01</tPag><vPag>1.00</vPag></detPag><vTroco>0.00</vTroco></pag><infRespTec><CNPJ>29604796000173</CNPJ><xContato>riosoft</xContato><email>contato@veraciti.com.br</email><fone>92998745445</fone><idCSRT>12</idCSRT><hashCSRT>qvTGHdzF6KLavt4PO0gs2a6pQ00=</hashCSRT></infRespTec></infNFe><infNFeSupl><qrCode>https://sistemas.sefaz.am.gov.br/nfceweb-hom/consultarNFCe.jsp?p=13220114200166000166650070000001029870832698|2|2|26|1.00|6c4e62336b4d4f33365966626f4f4168556473767244695233674d3d|1|CCE5214E1F0BB8B6AB4F14B348C65F61C90551E2</qrCode><urlChave>www.sefaz.am.gov.br/nfce/consulta</urlChave></infNFeSupl><Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#\"><SignedInfo><CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/><SignatureMethod Algorithm=\"http://www.w3.org/2000/09/xmldsig#rsa-sha1\"/><Reference URI=\"#NFe13220114200166000166650070000001029870832698\"><Transforms><Transform Algorithm=\"http://www.w3.org/2000/09/xmldsig#enveloped-signature\"/><Transform Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/></Transforms><DigestMethod Algorithm=\"http://www.w3.org/2000/09/xmldsig#sha1\"/><DigestValue>lNb3kMO36YfboOAhUdsvrDiR3gM=</DigestValue></Reference></SignedInfo><SignatureValue>ImcjGhmNZQDDfahkYGHecWYBk4/LwNql3JscIK3wz5igswa5YA3q9RSqbvP4hUhubN8KowfvRqtvpteCteYp1afxWlBAkPx5CmVDMiweyya5CRlfZlDF37sE6deHQkI3kQ9hOKCNsZn2lmanPeiV1YJkwjMhiY3GnLVQDxeu8fJqr9MALXa5gaOe7WWFyCTd/B+9MQjhEKAnf4SdmyC7VLbBIY5lYWVvjPvoisThAShVZdn7IDI2AzKAIEmAl7QJWHplKZ1oylRti+l/DUVQzvG8xNq3pzHHeXIcmlgIONG+HSNeaQZ8OLJ2r9RgpRy+H+mHIEyjS/qtCPG1Bi70ow==</SignatureValue><KeyInfo><X509Data><X509Certificate>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</X509Certificate></X509Data></KeyInfo></Signature></NFe>";
            const int INDEXCSC_EXEMPLO = 1;
            const String CSC_EXEMPLO = "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES";

            bridgeService.imprimirCupomNfce(xml: XML_EXEMPLO_CUPOM_NFCE, indexcsc: INDEXCSC_EXEMPLO, csc: CSC_EXEMPLO).then(
              (stringRetornoImprimirCupomNfce){
                GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: stringRetornoImprimirCupomNfce);
              }
            );

            break;        
          case 1:
            const String XML_CUPOM_EXEMPLO_SAT = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><CFe><infCFe Id=\"CFe13190814200166000166599000178400000148075811\" versao=\"0.07\" versaoDadosEnt=\"0.07\" versaoSB=\"010103\"><ide><cUF>13</cUF><cNF>807581</cNF><mod>59</mod><nserieSAT>900017840</nserieSAT><nCFe>000014</nCFe><dEmi>20190814</dEmi><hEmi>163227</hEmi><cDV>1</cDV><tpAmb>2</tpAmb><CNPJ>16716114000172</CNPJ><signAC>SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT</signAC><assinaturaQRCODE>kAmMUV2AFOP11vsbAwb4S1MrcnzIm8o6trefwjpRvpJaNGeXXcM2GKbs+aALc3WDxrimeOf9BdgoZl29RvtC1DmvqZ56oVEoRz0ymia1tHUdGPzuO035OuiEseEj3+gU+8NzGzqWQIJgqdgLOZgnmUP2aBOkC0QcokhHPVfwm9tJFQnQkzGzu4692+LtpxhLwEhnFjoZh+1hpBXn5AEcbMS4Lx751qvFlfZX0hsYJf5pKcFH88E3byU82MU8UD5p9fyX2qL5Ae+Uql1VLPqoJOsQmC2BCBkMW7oQRCCR0osz6eLX1DHHJU+stxKCkITlQnz6XJd4LKXifGZuZ25+Uw==</assinaturaQRCODE><numeroCaixa>001</numeroCaixa></ide><emit><CNPJ>14200166000166</CNPJ><xNome>ELGIN INDUSTRIAL DA AMAZONIA LTDA</xNome><enderEmit><xLgr>AVENIDA ABIURANA</xLgr><nro>579</nro><xBairro>DIST INDUSTRIAL</xBairro><xMun>MANAUS</xMun><CEP>69075010</CEP></enderEmit><IE>111111111111</IE><cRegTrib>3</cRegTrib><indRatISSQN>N</indRatISSQN></emit><dest><CPF>14808815893</CPF></dest><det nItem=\"1\"><prod><cProd>0000000000001</cProd><xProd>PRODUTO NFCE 1</xProd><NCM>94034000</NCM><CFOP>5102</CFOP><uCom>UN</uCom><qCom>1.0000</qCom><vUnCom>3.51</vUnCom><vProd>3.51</vProd><indRegra>T</indRegra><vItem>3.00</vItem><vRatDesc>0.51</vRatDesc></prod><imposto><ICMS><ICMS00><Orig>0</Orig><CST>00</CST><pICMS>7.00</pICMS><vICMS>0.21</vICMS></ICMS00></ICMS><PIS><PISAliq><CST>01</CST><vBC>6.51</vBC><pPIS>0.0165</pPIS><vPIS>0.11</vPIS></PISAliq></PIS><COFINS><COFINSAliq><CST>01</CST><vBC>6.51</vBC><pCOFINS>0.0760</pCOFINS><vCOFINS>0.49</vCOFINS></COFINSAliq></COFINS></imposto></det><total><ICMSTot><vICMS>0.21</vICMS><vProd>3.51</vProd><vDesc>0.00</vDesc><vPIS>0.11</vPIS><vCOFINS>0.49</vCOFINS><vPISST>0.00</vPISST><vCOFINSST>0.00</vCOFINSST><vOutro>0.00</vOutro></ICMSTot><vCFe>3.00</vCFe><DescAcrEntr><vDescSubtot>0.51</vDescSubtot></DescAcrEntr><vCFeLei12741>0.56</vCFeLei12741></total><pgto><MP><cMP>01</cMP><vMP>6.51</vMP></MP><vTroco>3.51</vTroco></pgto><infAdic><infCpl>Trib aprox R\$ 0,36 federal, R\$ 1,24 estadual e R\$ 0,00 municipal&lt;br&gt;CAIXA: 001 OPERADOR: ROOT</infCpl><obsFisco xCampo=\"04.04.05.04\"><xTexto>Comete crime quem sonega</xTexto></obsFisco></infAdic></infCFe><Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#\"><SignedInfo><CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/><SignatureMethod Algorithm=\"http://www.w3.org/2001/04/xmldsig-more#rsa-sha256\"/><Reference URI=\"#CFe13190814200166000166599000178400000148075811\"><Transforms><Transform Algorithm=\"http://www.w3.org/2000/09/xmldsig#enveloped-signature\"/><Transform Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/></Transforms><DigestMethod Algorithm=\"http://www.w3.org/2001/04/xmlenc#sha256\"/><DigestValue>rozf1i6JehNUqx8tfP1FG3QVUIxlrcHgozaB4LAjkDM=</DigestValue></Reference></SignedInfo><SignatureValue>cAiGHfx3QxIhrmz3b36Z1EBs/TzLXKQkE5Ykn3Q1HOEKpshyZRaOLKlg6LiHjFgaZNKZnwWkKLQav2Af342Xc3XIkIjOF72vmLZxd/u6naZ3lYVWcf/G2YYdMpUAoqfpihLilVZZMqAIQQ/SW76mGstSI743lc0FL1NuMXSvAT3b9X1JcaC1r4uHezYGp/iSrX/lxfdnu4ZP2gzJ7KEnRvrTm9TCF3mA0zhDF5iem4vJC8bS/+OjhKhKfDeyxkrPDQc8+n7brALOYWbR3RUleMMKCIQf/nxaEy9XEsb53rC4KXLe5JL15YCxQ8TRYU6vvLoqFecd72HebFQ/C2BvgA==</SignatureValue><KeyInfo><X509Data>\n" +
                                          "<X509Certificate>MIIFzTCCBLWgAwIBAgICH9owDQYJKoZIhvcNAQENBQAwaDELMAkGA1UEBhMCQlIxEjAQBgNVBAgMCVNBTyBQQVVMTzESMBAGA1UEBwwJU0FPIFBBVUxPMQ8wDQYDVQQKDAZBQ0ZVU1AxDzANBgNVBAsMBkFDRlVTUDEPMA0GA1UEAwwGQUNGVVNQMB4XDTE5MDUxNjEyMjU1NFoXDTI0MDUxNDEyMjU1NFowgbIxCzAJBgNVBAYTAkJSMREwDwYDVQQIDAhBbWF6b25hczERMA8GA1UECgwIU0VGQVotU1AxGDAWBgNVBAsMD0FDIFNBVCBTRUZBWiBTUDEoMCYGA1UECwwfQXV0b3JpZGFkZSBkZSBSZWdpc3RybyBTRUZBWiBTUDE5MDcGA1UEAwwwRUxHSU4gSU5EVVNUUklBTCBEQSBBTUFaT05JQSBMVERBOjE0MjAwMTY2MDAwMTY2MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuKdsN2mi5OserALssgKyPBZBnt3TeytHObTV2xboIeZ8nQ3qDbzovkpxwvBLEKCI1+5sWkZUBmQAqDXTv4Zu/oVPmgVAjLOQszH9mEkyrhlT5tRxyptGKCN58nfx150rHPvov9ct9uizR4S5+nDvMSLNVFpcpbT2y+vnfmMPQzOec8SbKdSPy1dytHl+id9r4XD/s/fXc19URb9XXtMui+praC9vWasiJsFScnTJScIdLwqZsCAmDQeRFHX1e57vCLNxFNCfKzgCRd9VhCQE03kXrz+xo7nJGdXP2baABvh3mi6ifHeuqPXw5JBwjemS0KkRZ5PhE5Ndkih86ZAeIwIDAQABo4ICNDCCAjAwCQYDVR0TBAIwADAOBgNVHQ8BAf8EBAMCBeAwLAYJYIZIAYb4QgENBB8WHU9wZW5TU0wgR2VuZXJhdGVkIENlcnRpZmljYXRlMB0GA1UdDgQWBBRS6g1qRE9lsk/8dfDlVjhISI/1wTAfBgNVHSMEGDAWgBQVtOORhiQs6jNPBR4tL5O3SJfHeDATBgNVHSUEDDAKBggrBgEFBQcDAjBDBgNVHR8EPDA6MDigNqA0hjJodHRwOi8vYWNzYXQuZmF6ZW5kYS5zcC5nb3YuYnIvYWNzYXRzZWZhenNwY3JsLmNybDCBpwYIKwYBBQUHAQEEgZowgZcwNQYIKwYBBQUHMAGGKWh0dHA6Ly9vY3NwLXBpbG90LmltcHJlbnNhb2ZpY2lhbC5jb20uYnIvMF4GCCsGAQUFBzAChlJodHRwOi8vYWNzYXQtdGVzdGUuaW1wcmVuc2FvZmljaWFsLmNvbS5ici9yZXBvc2l0b3Jpby9jZXJ0aWZpY2Fkb3MvYWNzYXQtdGVzdGUucDdjMHsGA1UdIAR0MHIwcAYJKwYBBAGB7C0DMGMwYQYIKwYBBQUHAgEWVWh0dHA6Ly9hY3NhdC5pbXByZW5zYW9maWNpYWwuY29tLmJyL3JlcG9zaXRvcmlvL2RwYy9hY3NhdHNlZmF6c3AvZHBjX2Fjc2F0c2VmYXpzcC5wZGYwJAYDVR0RBB0wG6AZBgVgTAEDA6AQDA4xNDIwMDE2NjAwMDE2NjANBgkqhkiG9w0BAQ0FAAOCAQEArHy8y6T6ZMX6qzZaTiTRqIN6ZkjOknVCFWTBFfEO/kUc1wFBTG5oIx4SDeas9+kxZzUqjk6cSsysH8jpwRupqrJ38wZir1OgPRBuGAPz9lcah8IL4tUQkWzOIXqqGVxDJ8e91MjIMWextZuy212E8Dzn3NNMdbqyOynd7O0O5p6wPS5nuTeEsm3wcw0aLu0bbIy+Mb/nHIqFKaoZEZ8LSYn2TfmP+z9AhOC1vj3swxuRTKf1xLcNvVbq/r+SAwwBC/IGRpgeMAzELLPLPUHrBeSO+26YWwXdxaq29SmEo77KkUpUXPlt9hS2MPagCLsE6ZwDSmc8x1h3Hv+MW8zxyg==</X509Certificate>\n" +
                                          "</X509Data></KeyInfo></Signature></CFe>";

            bridgeService.imprimirCupomSat(xml: XML_CUPOM_EXEMPLO_SAT).then(
              (stringRetornoImprimirCupomSat){
                GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: stringRetornoImprimirCupomSat);
              }
            );

            break;
          case 2:
            const String XML_CUPOM_EXEMPLO_SAT_CANCELAMENTO = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><CFeCanc><infCFe Id=\"CFe13180314200166000166599000108160001324252883\" chCanc=\"CFe13180314200166000166599000108160001316693175\" versao=\"0.07\"><dEmi>20180305</dEmi><hEmi>142819</hEmi><ide><cUF>13</cUF><cNF>425288</cNF><mod>59</mod><nserieSAT>900010816</nserieSAT><nCFe>000132</nCFe><dEmi>20180305</dEmi><hEmi>142846</hEmi><cDV>3</cDV><CNPJ>16716114000172</CNPJ><signAC>SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT</signAC><assinaturaQRCODE>Q5DLkpdRijIRGY6YSSNsTWK1TztHL1vD0V1Jc4spo/CEUqICEb9SFy82ym8EhBRZjbh3btsZhF+sjHqEMR159i4agru9x6KsepK/q0E2e5xlU5cv3m1woYfgHyOkWDNcSdMsS6bBh2Bpq6s89yJ9Q6qh/J8YHi306ce9Tqb/drKvN2XdE5noRSS32TAWuaQEVd7u+TrvXlOQsE3fHR1D5f1saUwQLPSdIv01NF6Ny7jZwjCwv1uNDgGZONJdlTJ6p0ccqnZvuE70aHOI09elpjEO6Cd+orI7XHHrFCwhFhAcbalc+ZfO5b/+vkyAHS6CYVFCDtYR9Hi5qgdk31v23w==</assinaturaQRCODE><numeroCaixa>001</numeroCaixa></ide><emit><CNPJ>14200166000166</CNPJ><xNome>ELGIN INDUSTRIAL DA AMAZONIA LTDA</xNome><enderEmit><xLgr>AVENIDA ABIURANA</xLgr><nro>579</nro><xBairro>DIST INDUSTRIAL</xBairro><xMun>MANAUS</xMun><CEP>69075010</CEP></enderEmit><IE>111111111111</IE><IM>111111</IM></emit><dest><CPF>14808815893</CPF></dest><total><vCFe>3.00</vCFe></total><infAdic><obsFisco xCampo=\"xCampo1\"><xTexto>xTexto1</xTexto></obsFisco></infAdic></infCFe><Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#\"><SignedInfo><CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/><SignatureMethod Algorithm=\"http://www.w3.org/2001/04/xmldsig-more#rsa-sha256\"/><Reference URI=\"#CFe13180314200166000166599000108160001324252883\"><Transforms><Transform Algorithm=\"http://www.w3.org/2000/09/xmldsig#enveloped-signature\"/><Transform Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/></Transforms><DigestMethod Algorithm=\"http://www.w3.org/2001/04/xmlenc#sha256\"/><DigestValue>pePcOYfIU+b59qGayJiJj492D9fTVhqbHEqFLDUi1Wc=</DigestValue></Reference></SignedInfo><SignatureValue>og35vHuErSOCB29ME4WRwdVPwps/mOUQJvk3nA4Oy//CVPIt0X/iGUZHMnJhQa4aS4c7dq5YUaE2yf8H9FY8xPkY9vDQW62ZzuM/6qSHeh9Ft09iP55T76h7iLY+QLl9FZL4WINmCikv/kzmCCi4+8miVwx1MnFiTNsgSMmzRnvAv1iVkhBogbAZES03iQIi7wZGzZDo7bFmWyXVdtNnjOke0WS0gTLhJbftpDT3gi0Muu8J+AfNjaziBMFQB3i1oN96EkpCKsT78o5Sb+uBux/bV3r79nrFk4MXzaFOgBoTqv1HF5RVNx2nWSoZrbpAV8zPB1icnAnfb4Qfh1oJdA==</SignatureValue><KeyInfo><X509Data><X509Certificate>MIIFzTCCBLWgAwIBAgICESswDQYJKoZIhvcNAQENBQAwaDELMAkGA1UEBhMCQlIxEjAQBgNVBAgMCVNBTyBQQVVMTzESMBAGA1UEBwwJU0FPIFBBVUxPMQ8wDQYDVQQKDAZBQ0ZVU1AxDzANBgNVBAsMBkFDRlVTUDEPMA0GA1UEAwwGQUNGVVNQMB4XDTE3MDEyNzEzMzMyMloXDTIyMDEyNjEzMzMyMlowgbIxCzAJBgNVBAYTAkJSMREwDwYDVQQIDAhBbWF6b25hczERMA8GA1UECgwIU0VGQVotU1AxGDAWBgNVBAsMD0FDIFNBVCBTRUZBWiBTUDEoMCYGA1UECwwfQXV0b3JpZGFkZSBkZSBSZWdpc3RybyBTRUZBWiBTUDE5MDcGA1UEAwwwRUxHSU4gSU5EVVNUUklBTCBEQSBBTUFaT05JQSBMVERBOjE0MjAwMTY2MDAwMTY2MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtyLG8URyX8fqjOQa+rj3Rl6Z6eIX/dndhNe0rw6inNAXt06HtXQslBqnReuSanN3ssgpV6oev0ikfXA7hhmpZM7qVigTJp3+h1K9vKUlPZ5ELT36yAokpxakIyYRy5ELjP4KwFrAjQUgB6xu5X/MOoUmBKRLIiwm3wh7kUA9jZArQGD4pRknuvFuQ99ot3y6u3lI7Oa2ZqJ1P2E7NBmfdswQL8VG51by0Weivugsv3xWAHvdXZmmOrmv2W5C2U2VnsTjA3p2zQVwitZBEh6JxqLE3KljXlokbhHb1m2moSbzRLCdAJHIq/6eWL8kl2OVWViECODGoYA0Qz0wSgk/vwIDAQABo4ICNDCCAjAwCQYDVR0TBAIwADAOBgNVHQ8BAf8EBAMCBeAwLAYJYIZIAYb4QgENBB8WHU9wZW5TU0wgR2VuZXJhdGVkIENlcnRpZmljYXRlMB0GA1UdDgQWBBTIeTKrUS19raxSgeeIHYSXclNYkDAfBgNVHSMEGDAWgBQVtOORhiQs6jNPBR4tL5O3SJfHeDATBgNVHSUEDDAKBggrBgEFBQcDAjBDBgNVHR8EPDA6MDigNqA0hjJodHRwOi8vYWNzYXQuZmF6ZW5kYS5zcC5nb3YuYnIvYWNzYXRzZWZhenNwY3JsLmNybDCBpwYIKwYBBQUHAQEEgZowgZcwNQYIKwYBBQUHMAGGKWh0dHA6Ly9vY3NwLXBpbG90LmltcHJlbnNhb2ZpY2lhbC5jb20uYnIvMF4GCCsGAQUFBzAChlJodHRwOi8vYWNzYXQtdGVzdGUuaW1wcmVuc2FvZmljaWFsLmNvbS5ici9yZXBvc2l0b3Jpby9jZXJ0aWZpY2Fkb3MvYWNzYXQtdGVzdGUucDdjMHsGA1UdIAR0MHIwcAYJKwYBBAGB7C0DMGMwYQYIKwYBBQUHAgEWVWh0dHA6Ly9hY3NhdC5pbXByZW5zYW9maWNpYWwuY29tLmJyL3JlcG9zaXRvcmlvL2RwYy9hY3NhdHNlZmF6c3AvZHBjX2Fjc2F0c2VmYXpzcC5wZGYwJAYDVR0RBB0wG6AZBgVgTAEDA6AQDA4xNDIwMDE2NjAwMDE2NjANBgkqhkiG9w0BAQ0FAAOCAQEAAhF7TLbDABp5MH0qTDWA73xEPt20Ohw28gnqdhUsQAII2gGSLt7D+0hvtr7X8K8gDS0hfEkv34sZ+YS9nuLQ7S1LbKGRUymphUZhAfOomYvGS56RIG3NMKnjLIxAPOHiuzauX1b/OwDRmHThgPVF4s+JZYt6tQLESEWtIjKadIr4ozUXI2AcWJZL1cKc/NI7Vx7l6Ji/66f8l4Qx704evTqN+PjzZbFNFvbdCeC3H3fKhVSj/75tmK2TBnqzdc6e1hrjwqQuxNCopUSV1EJSiW/LR+t3kfSoIuQCPhaiccJdAUMIqethyyfo0ie7oQSn9IfSms8aI4lh2BYNR1mf5w==</X509Certificate></X509Data></KeyInfo></Signature></CFeCanc>";
            const String ASS_QR_CODE_EXEMPLO = "Q5DLkpdRijIRGY6YSSNsTWK1TztHL1vD0V1Jc4spo/CEUqICEb9SFy82ym8EhBRZjbh3btsZhF+sjHqEMR159i4agru9x6KsepK/q0E2e5xlU5cv3m1woYfgHyOkWDNcSdMsS6bBh2Bpq6s89yJ9Q6qh/J8YHi306ce9Tqb/drKvN2XdE5noRSS32TAWuaQEVd7u+TrvXlOQsE3fHR1D5f1saUwQLPSdIv01NF6Ny7jZwjCwv1uNDgGZONJdlTJ6p0ccqnZvuE70aHOI09elpjEO6Cd+orI7XHHrFCwhFhAcbalc+ZfO5b/+vkyAHS6CYVFCDtYR9Hi5qgdk31v23w==";

            bridgeService.imprimirCupomSatCancelamento(xml: XML_CUPOM_EXEMPLO_SAT_CANCELAMENTO, assQRCode: ASS_QR_CODE_EXEMPLO).then(
              (stringRetornoImprimirCupomSatCancelamento){
                GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: stringRetornoImprimirCupomSatCancelamento);
              }
            );

            break;       
        }
      }

      GeneralWidgets.showAlertDialogWithSelectableOptions(mainWidgetContext: context, alertTitle: "ESCOLHA O TIPO DE CUPOM", listOfOptions: couponOptions, onTap: onCouponOptionTapped);
    }
  }

  

  onSetTransactionTimeoutPressed(){
    if(tryToUpdateBridgeServer()){
      shouldSendPassword();

      String transactionTimeoutInSeconds = '';
      //aceitar apenas caractéres numéricos de 0 a 9
      FilteringTextInputFormatter setTrasanctionTimeoutFilterToOnlyDigits = FilteringTextInputFormatter.allow(RegExp('[0-9]'));

      onTransactionTimeoutInSecondsChanged(String newTransactionTimeoutInSeconds){
        transactionTimeoutInSeconds = newTransactionTimeoutInSeconds;
      }

      onPressedAction(int pressedAction){
        Navigator.of(context).pop();

        const int PRESSED_ACTION_OK = 1;
        if(pressedAction == PRESSED_ACTION_OK){
          //Valida se foi inserido um valor válido para timeout
          try{
            int newTransactionTimetouInSeconds = int.parse(transactionTimeoutInSeconds);

            bridgeService.setTimeout(timeout: newTransactionTimetouInSeconds).then(
              (stringRetornoSetTimeout){
                GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Retorno E1 - BRIDGE', dialogText: stringRetornoSetTimeout);
              }
            );
          }on FormatException catch(e){
            GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'Alerta', dialogText: 'Insira um valor válido para a configuração do novo timeout!');
          }
        }
      }
      
      GeneralWidgets.showAlertDialogWithInputField(mainWidgetContext: context, dialogTitle: 'DEFINA UM NOVO TIMEOUT PARA TRANSAÇÃO (em segundos):', onTextInput: onTransactionTimeoutInSecondsChanged, onPressedAction: onPressedAction, textInputType: TextInputType.number, filteringTextInputFormatter: setTrasanctionTimeoutFilterToOnlyDigits);
    }
  }
  

  

//Função que valida o IP e as portas de comunicação e transação do Bridge
  bool tryToUpdateBridgeServer ()  {
    //Verifica se todos os campos inseridos estão em um formato válido antes de tentar atualizar o servidor por onde o Bridge se conectará
    if(isIpValid() && isTransactionPortValid() && isStatusPortValid()){
      bridgeService.setServer(ipTerminal: controllerIpBridge.text, portaTransacao: int.parse(controllerTransactionPort.text), portaStatus: int.parse(controllerStatusPort.text));
      return true;
    }
    return false;
  }

  //Trata da validação de IP
  bool isIpValid(){
    RegExp regexIpValidation = RegExp(r"^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]){1}$");

    bool isIpValid = regexIpValidation.hasMatch(controllerIpBridge.text);

    if(!isIpValid) {
      GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'ALERTA', dialogText: 'Insira um IP válido para a conexão Bridge!');
      return false;
    }
    return true;
  }

  //Trata da validação do valor inserido na porta de transação
  bool isTransactionPortValid(){
    try{
      int portValueInInteger = int.parse(controllerTransactionPort.text);
      
      if(portValueInInteger < 65535) return true;
      GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'ALERTA', dialogText: 'O valor inserido na porta de transação excede o limite esbelecido de 65535!');
      return false;
    }on FormatException catch(e){
      print(e);
    }
    GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'ALERTA', dialogText: 'O valor inserido na porta de transação não pode estar vazio!');
    return false;
  }

  //Trata da validação do valor inserido na porta de transação
  bool isStatusPortValid(){
    try{
      int portValueInInteger = int.parse(controllerStatusPort.text);
      
      if(portValueInInteger < 65535) return true;
      GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'ALERTA', dialogText: 'O valor inserido na porta de status excede o limite esbelecido de 65535!');
      return false;
    }on FormatException catch(e){
      print(e);
    }
    GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'ALERTA', dialogText: 'O valor inserido na porta de status não pode estar vazio!');
    return false;
  }

  //Trata da validação de valor (O valor para transação não deve ser inferior a R$ 1,00)
  bool isValueValidToElginPay(){
    try{
      //A máscara utilizada para o campo valor utilizar o padrão ',' para representação monetária, o que deve ser substiuído por '.' antes da conversão para Double
      double transactionValueInInteger = double.parse(controllerTransactionValue.text.replaceAll(',', '.'));

      if(transactionValueInInteger < 1.00){
        GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'ALERTA', dialogText: 'O valor mínimo para a transação é de 1.00!');
        return false;
      }
      return true;
    }on FormatException catch(e){
      print(e);
    }
    GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'ALERTA', dialogText: 'O valor para a transação não pode estar vazio!');
    return false;
  }

  //Trata da validação do número de parcelas (Caso o parcelamento por ADM ou LOJA estejam selecionados, uma vez que para o parcelamento a vista o número de parcelas é travado em 1)
  bool isInstallmentsFieldValid(){
    try{
      int numberOfInstallmentsInInteger = int.parse(controllerNumberOfInstallments.text);

      if( (selectedInstallmentMethod != InstallmentMethod.FINANCIAMENTO_A_VISTA) && (numberOfInstallmentsInInteger < 2) ){
        GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'ALERTA', dialogText: 'O número mínimo de parcelas para esse tipo de parcelamento é 2!');
        return false;
      }
      return true;
    }on FormatException catch(e){
      print(e);
    }
    GeneralWidgets.showAlertDialog(mainWidgetContext: context, dialogTitle: 'ALERTA', dialogText: 'O campo de parcelas não pode estar vazio!');
    return false;
  }

  shouldSendPassword(){
    //Se a opção de envio estiver marcada, enviar a senha inserida, caso contrário desabilite o envio de senha
    String passwordEntered = controllerPassword.text.toString();
    print(passwordEntered);
    
    if(sendPassword){
      const bool ENABLE_PASSWORD_SUBMISSION = true;

      bridgeService.setSenha(senha: passwordEntered, habilitada: ENABLE_PASSWORD_SUBMISSION);
    }
    else{
      const bool DISABLE_PASSWORD_SUBMISSION = false;

      bridgeService.setSenha(senha: passwordEntered, habilitada: DISABLE_PASSWORD_SUBMISSION);
    }
  }

  //Função que gera um Int aleatório para alimentar as transações do Bridge
  int generateRandomIntForBridgeTransaction(){
    var random = new Random();
    return random.nextInt(999999);
  }

  Future<bool> _onBackPressed() async {
    // Your back press code here...
    Components.infoDialog(context: context, message: 'backPressed');
    return true;
  }

  

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          SizedBox(height: 25),
          GeneralWidgets.headerScreen("E1 - BRIDGE"),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 10),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              'IP:',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                          ),
                          Expanded(
                            child: TextFormField(
                              controller: controllerIpBridge,
                              keyboardType: TextInputType.number,
                              textAlign: TextAlign.center,
                            ),
                          )
          
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Text(
                            'PORTAS TRANSAÇÕES/STATUS:',
                            overflow: TextOverflow.clip,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                          SizedBox(
                            width: 50,
                            child: TextFormField(
                              controller: controllerTransactionPort,
                              inputFormatters: [FilteringTextInputFormatter.allow(RegExp('[0-9]'))],
                              keyboardType: TextInputType.number,
                              textAlign: TextAlign.center,
                            ),
                          ),
                          SizedBox(
                            width: 50,
                            child: TextFormField(
                              controller: controllerStatusPort,
                              inputFormatters: [FilteringTextInputFormatter.allow(RegExp('[0-9]'))],
                              keyboardType: TextInputType.number,
                              textAlign: TextAlign.center,
                            ),
                          )
                        ],
                      ),
                    )
                  ],
                ),
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    'VALOR:',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                  ),
                                ),
                                Expanded(
                                  child: TextFormField(
                                    controller: controllerTransactionValue,
                                    keyboardType: TextInputType.number,
                                    inputFormatters: [_formatter],
                                    textAlign: TextAlign.center,
                                  ),
                                )
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          Expanded(
                            child: ListTile(
                              title: Text(
                                "ENVIAR SENHA NAS TRANSAÇÕES",
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              leading: Checkbox(
                                value: sendPassword,
                                onChanged: (bool? value)  => onShouldSendPasswordChanged(value!),
                          
                              ),
                            ),
                          )
                        ],
                      ),
                    )
                  ],
                ),
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          if(selectedPaymentMethod == PaymentMethod.CREDITO) ... {
                            Expanded(
                              child: Text(
                                      'N° PARCELAS:',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                    ),
                                  ),
                            Expanded(
                              child: TextFormField(
                                controller: controllerNumberOfInstallments,
                                inputFormatters: [FilteringTextInputFormatter.allow(RegExp('[0-9]'))],
                                textAlign: TextAlign.center,
                                keyboardType: TextInputType.number,
                                enabled: isCreditPaymentMethodSelected && (selectedInstallmentMethod != InstallmentMethod.FINANCIAMENTO_A_VISTA),
                              ),
                            )
                          }
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Text(
                                'SENHA:',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                          SizedBox(
                            width: 250,
                            child: Align(
                              alignment: Alignment.topRight,
                              child: TextFormField(
                                controller: controllerPassword,
                                textAlign: TextAlign.center,
                                obscureText: true,
                                enableSuggestions: false,
                                autocorrect: false,
                                enabled: sendPassword,
                              ),
                            ),
                          )
                        ],
                      ),
                    )
                  ],
                ),
                SizedBox(height: 5,),
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          Text(
                                'FORMAS DE PAGAMENTO:',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                           Text(
                                'FUNÇÕES E1-BRIDGE:',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                        ],
                      ),
                    )
                  ],
                ),
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          GeneralWidgets.personSelectedButton(
                            nameButton: 'Crédito',
                            fontLabelSize: 12,
                            assetImage: 'assets/images/card.png',
                            isSelectedBtn: selectedPaymentMethod == PaymentMethod.CREDITO,
                            onSelected: () => onPaymentMethodChanged(PaymentMethod.CREDITO),
                          ),
                          GeneralWidgets.personSelectedButton(
                            nameButton: 'Débito',
                            fontLabelSize: 12,
                            assetImage: 'assets/images/card.png',
                            isSelectedBtn: selectedPaymentMethod == PaymentMethod.DEBITO,
                            onSelected: () => onPaymentMethodChanged(PaymentMethod.DEBITO),
                          )
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () => onConsultTerminalStatusPressed(),
                              child: Text("CONSULTAR STATUS DO TERMINAL"),
                            ),
                          )
                        ],
                      ),
                    )
                  ],
                ),
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          if(selectedPaymentMethod == PaymentMethod.CREDITO) ... {
                            Text(
                                  'FORMAS DE PARCELAMENTO:',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                          }
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                           Expanded(
                            child: ElevatedButton(
                              onPressed: () => onConsultConfiguredTimeoutPressed(),
                              child: Text("CONSULTAR TIMEOUT CONFIGURADO"),
                            ),
                          )
                        ],
                      ),
                    )
                  ],
                ),
                
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          if(selectedPaymentMethod == PaymentMethod.CREDITO) ... {
                            GeneralWidgets.personSelectedButton(
                            nameButton: 'Loja',
                            fontLabelSize: 12,
                            isSelectedBtn: selectedInstallmentMethod == InstallmentMethod.FINANCIAMENTO_PARCELADO_ESTABELECIMENTO,
                            assetImage: 'assets/images/store.png',
                            onSelected: () => onInstallmentMethodChanged(InstallmentMethod.FINANCIAMENTO_PARCELADO_ESTABELECIMENTO),
                            ),
                            GeneralWidgets.personSelectedButton(
                              nameButton: 'Adm',
                              fontLabelSize: 12,
                              isSelectedBtn: selectedInstallmentMethod == InstallmentMethod.FINANCIAMENTO_PARCELADO_EMISSOR,
                              assetImage: 'assets/images/adm.png',
                              onSelected: () => onInstallmentMethodChanged(InstallmentMethod.FINANCIAMENTO_PARCELADO_EMISSOR),
                            ),
                            GeneralWidgets.personSelectedButton(
                              nameButton: 'A vista',
                              fontLabelSize: 12,
                              isSelectedBtn: selectedInstallmentMethod == InstallmentMethod.FINANCIAMENTO_A_VISTA,
                              assetImage: 'assets/images/card.png',
                              onSelected: () => onInstallmentMethodChanged(InstallmentMethod.FINANCIAMENTO_A_VISTA),
                            ),
                          }
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () => onConsultLastTransactionPressed(),
                              child: Text("CONSULTAR ULTIMA TRANSAÇÃO"),
                            ),
                          )
                        ],
                      ),
                    )
                  ],
                ),
                SizedBox(height: 5,),
                Row(
                  children: [
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 3),
                        child: Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () => onSendTransactionPressed(),
                                child: Text("ENVIAR TRANSAÇÃO"),
                              ),
                            ),
                            SizedBox(width: 5,),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () => onCancelTransactionPressed(),
                                child: Text("CANCELAR TRANSAÇÃO"),
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () => onSetTerminalPasswordPressed(),
                              child: Text("CONFIGURAR SENHA DO TERMINAL"),
                            ),
                          )
                        ],
                      ),
                    )
                  ],
                ),
                Row(
                  children: [
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 3),
                        child: Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () => onAdministrativeOperationPressed(),
                                child: Text("OPERAÇÃO ADM"),
                              ),
                            ),
                            SizedBox(width: 5,),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () => onPrintTestCouponPressed(),
                                child: Text("IMPRIMIR CUPOM TESTE",
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () => onSetTransactionTimeoutPressed(),
                              child: Text("CONFIGURAR TIMEOUT PARA TRANSAÇÕES"),
                            ),
                          )
                        ],
                      ),
                    )
                  ],
                )
              ],
            ),
          ),
           
          Padding(
            padding: EdgeInsets.only(bottom: 5),
            child: GeneralWidgets.baseboard()),
        ],
      )
    );
  }
  
  
}