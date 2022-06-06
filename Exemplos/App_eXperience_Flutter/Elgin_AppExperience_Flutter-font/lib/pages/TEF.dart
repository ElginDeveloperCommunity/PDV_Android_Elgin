import 'dart:math';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_m8/Struct/enums.dart';
import 'package:flutter_m8/Utils/utils.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/components/components.dart';
import 'package:flutter_m8/services/service_printer.dart';
import 'package:flutter_m8/services/service_shipay.dart';
import 'package:flutter_m8/services/services_tef/sitefReturn.dart';
import 'package:flutter_m8/services/services_tef/sitefController.dart';
import 'package:flutter_m8/services/service_paygo.dart';

import 'dart:convert';

class SitefPage extends StatefulWidget {
  @override
  _SitefPageState createState() => _SitefPageState();
}

class _SitefPageState extends State<SitefPage> {
  TextEditingController inputValue = new TextEditingController(text: "2000");
  TextEditingController inputInstallments =
      new TextEditingController(text: "1");
  TextEditingController inputIp =
      new TextEditingController(text: "192.168.0.31");

  SitefController sitefController = new SitefController();

  String selectedPaymentMethod = "Crédito";
  String selectedInstallmentsMethod = "Avista";
  String selectedTefType = "PayGo";

  String boxText = '';
  String imageViaClientBase64Paygo = '';

  PayGoService paygoService = new PayGoService();
  PrinterService printerService = new PrinterService();

  ShipayService shipayService = new ShipayService();
  String accessTokenShipay = '';
  String statusSaleShipay = '';
  String orderIDShipay = '';
  String valueLastSale = '';
  String qrCodeViaClientBase64Shipay = '';

  @override
  void initState() {
    super.initState();
    printerService.connectInternalImp().then((value) => print(value));
  }

  onChangePaymentMethod(String value) {
    setState(() => selectedPaymentMethod = value);
  }

  onChangeInstallmentsMethod(String value) {
    setState(() => selectedInstallmentsMethod = value);
  }

  onChangeTypeTefMethod(String value) {
    setState(() => selectedTefType = value);
    if (selectedInstallmentsMethod == "Avista" && value == "M-Sitef") {
      onChangeInstallmentsMethod("Loja");
    }
  }

  startActionTEF(String function) {
    if (selectedTefType == "M-Sitef") {
      if (function == "SALE") {
        sendSitefParams(FunctionSitef.SALE);
      } else if (function == "CANCEL") {
        sendSitefParams(FunctionSitef.CANCELL);
      } else {
        sendSitefParams(FunctionSitef.CONFIGS);
      }
    } else {
      sendPaygoParams(function);
    }
  }

  sendPaygoParams(String function) async {
    Map<String, dynamic> resultMap;
    String result = "";

    if (function == "SALE") {
      result = await paygoService.sendOptionSale(
        valor: inputValue.text,
        parcelas: int.parse(inputInstallments.text),
        formaPagamento: selectedPaymentMethod,
        tipoParcelamento: selectedInstallmentsMethod,
      );
    } else if (function == "CANCEL") {
      result = await paygoService.sendOptionCancel(
        valor: inputValue.text,
        parcelas: int.parse(inputInstallments.text),
        formaPagamento: selectedPaymentMethod,
        tipoParcelamento: selectedInstallmentsMethod,
      );
    } else {
      result = await paygoService.sendOptionConfigs();
    }

    result = result.toString().replaceAll('\\r', "");
    result = result.toString().replaceAll('"{', "{ ");
    result = result.toString().replaceAll('}"', " }");
    var newResultJSON = json.decode(result);

    resultMap = Map<String, dynamic>.from(newResultJSON);

    optionsReturnPaygo(resultMap);
  }

  optionsReturnPaygo(Map resultMap) {
    if (resultMap["retorno"] == "Transacao autorizada") {
      Components.infoDialog(context: context, message: resultMap["retorno"]);

      setState(() {
        imageViaClientBase64Paygo = resultMap["via_cliente"];

        //A STRING RETORNA COM ESPAÇO ENTRE OS CARACTERES
        //AS SEGUINTES LINHAS REMOVEM ESSE ESPAÇO PARA APRESENTAR A IMAGEM DA VIA
        imageViaClientBase64Paygo =
            imageViaClientBase64Paygo.replaceAll(new RegExp(r"\s+"), "");
        imageViaClientBase64Paygo = imageViaClientBase64Paygo.trim();
      });

      printerService.printerCupomTEF(
        resultMap["via_cliente"],
      );

      printerService.jumpLine(10);
      printerService.cutPaper(10);
    } else {
      Components.infoDialog(context: context, message: resultMap["retorno"]);
    }
  }

  sendSitefParams(FunctionSitef function) async {
    // VALIDA ENTRADAS
    String validator = Utils.validaEntradasSitef(
      inputValue.text,
      inputIp.text,
      int.parse(inputInstallments.text),
    );

    // CASO O VALIDATOR ENCONTRE ALGUM ERRO, MOSTRA O ERRO
    if (validator.isNotEmpty) {
      Components.infoDialog(context: context, message: validator);
      return;
    }

    // CASO NÃO TENHA ERRO NAS ENTRADAS
    sitefController.entrys.installmentsMethod = selectedInstallmentsMethod;
    sitefController.entrys.ip = inputIp.text;
    sitefController.entrys.numberInstallments =
        int.parse(inputInstallments.text);
    sitefController.entrys.paymentMethod = selectedPaymentMethod;
    sitefController.entrys.value = inputValue.text;

    try {
      SitefReturn sitefReturn = await sitefController.sendParamsSitef(
        functionSitef: function,
      );

      if (function == FunctionSitef.SALE) {
        var dt = DateTime.now();
        String dateFormat = "Data: ${dt.day}/${dt.month}/${dt.year}\n\n";
        setState(() {
          boxText = dateFormat +
              sitefReturn.vIAESTABELECIMENTO +
              "-----------------------------\n\n" +
              boxText;
        });

        // IMPRIME A NOTA FISCAL
        printerService.sendPrinterText(
          text: sitefReturn.vIACLIENTE,
          align: "Centralizado",
          font: "FONT B",
          fontSize: 0,
          isBold: false,
        );

        printerService.jumpLine(10);
        printerService.cutPaper(10);
      }
    } catch (e) {
      Components.infoDialog(
          context: context, message: "Ocorreu um erro durante a operação!");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          height: MediaQuery.of(context).size.height,
          width: MediaQuery.of(context).size.width,
          child: Column(
            children: [
              SizedBox(height: 30),
              GeneralWidgets.headerScreen("TEF"),
              Row(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 40),
                    child: fieldsMsitef(),
                  ),
                  SizedBox(width: 30),
                  boxScreen(),
                ],
              ),
              GeneralWidgets.baseboard(),
            ],
          ),
        ),
      ),
    );
  }

  Widget imageViaClienteBase64Paygo() {
    if (imageViaClientBase64Paygo == "") return new Container();

    Uint8List bytes = Base64Codec().decode(imageViaClientBase64Paygo);

    return new Image.memory(bytes, fit: BoxFit.contain);
  }

  Widget boxScreen() {
    return Container(
      height: 400,
      width: 350,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.black, width: 3),
        borderRadius: BorderRadius.all(Radius.circular(20)),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(left: 15),
          child: Column(
            children: [
              if (selectedTefType == "PayGo" &&
                  imageViaClientBase64Paygo != "") ...{
                imageViaClienteBase64Paygo(),
              } else ...{
                Text(boxText)
              }
            ],
          ),
        ),
      ),
    );
  }

  Widget fieldsMsitef() {
    return Container(
      height: 410,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          typeOfTefMethodWidget(selectedTefType),
          GeneralWidgets.inputField(
            inputValue,
            'VALOR:  ',
            textSize: 14,
            iWidht: 350,
            textInputType: TextInputType.number,
          ),
          GeneralWidgets.inputField(
            inputInstallments,
            'Nº PARCELAS:  ',
            textSize: 14,
            iWidht: 350,
            textInputType: TextInputType.number,
          ),
          GeneralWidgets.inputField(
            inputIp,
            'IP:  ',
            textSize: 14,
            iWidht: 350,
            isEnable: selectedTefType == "M-Sitef",
            textInputType: TextInputType.number,
          ),
          Text("FORMAS DE PAGAMENTO:",
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          paymentsMethodsWidget(selectedPaymentMethod),
          Text("TIPO DE PARCELAMENTO:",
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          installmentsMethodsWidget(selectedInstallmentsMethod),
          Row(
            children: [
              GeneralWidgets.personButton(
                textButton: "ENVIAR TRANSAÇÃO",
                callback: () => startActionTEF("SALE"),
              ),
              SizedBox(width: 20),
              GeneralWidgets.personButton(
                textButton: "CANCELAR TRANSAÇÃO",
                callback: () => startActionTEF("CANCEL"),
              ),
            ],
          ),
          SizedBox(height: 10),
          GeneralWidgets.personButton(
            textButton: "CONFIGURAÇÃO",
            callback: () => startActionTEF("CONFIGS"),
          ),
        ],
      ),
    );
  }

  Widget paymentsMethodsWidget(String selectedPaymentMethod) {
    return Row(
      children: [
        GeneralWidgets.personSelectedButton(
          nameButton: 'Crédito',
          fontLabelSize: 12,
          assetImage: 'assets/images/card.png',
          isSelectedBtn: selectedPaymentMethod == 'Crédito',
          onSelected: () => onChangePaymentMethod('Crédito'),
        ),
        GeneralWidgets.personSelectedButton(
          nameButton: 'Débito',
          fontLabelSize: 12,
          assetImage: 'assets/images/card.png',
          isSelectedBtn: selectedPaymentMethod == 'Débito',
          onSelected: () => onChangePaymentMethod('Débito'),
        ),
        GeneralWidgets.personSelectedButton(
          nameButton: 'Todos',
          fontLabelSize: 12,
          assetImage: 'assets/images/voucher.png',
          isSelectedBtn: selectedPaymentMethod == 'Todos',
          onSelected: () => onChangePaymentMethod('Todos'),
        ),
      ],
    );
  }

  Widget typeOfTefMethodWidget(String selectedTefMethod) {
    return Row(
      children: [
        GeneralWidgets.personSelectedButton(
          nameButton: 'PayGo',
          fontLabelSize: 14,
          mWidth: 70,
          mHeight: 30,
          isSelectedBtn: selectedTefMethod == 'PayGo',
          onSelected: () => onChangeTypeTefMethod('PayGo'),
        ),
        SizedBox(width: 5),
        GeneralWidgets.personSelectedButton(
          nameButton: 'M-Sitef',
          fontLabelSize: 14,
          mWidth: 70,
          mHeight: 30,
          isSelectedBtn: selectedTefMethod == 'M-Sitef',
          onSelected: () => onChangeTypeTefMethod('M-Sitef'),
        ),
      ],
    );
  }

  Widget installmentsMethodsWidget(String selectedInstall) {
    return Row(
      children: [
        GeneralWidgets.personSelectedButton(
          nameButton: 'Loja',
          fontLabelSize: 12,
          isSelectedBtn: selectedInstall == 'Loja',
          assetImage: 'assets/images/store.png',
          onSelected: () => onChangeInstallmentsMethod('Loja'),
        ),
        GeneralWidgets.personSelectedButton(
          nameButton: 'Adm',
          fontLabelSize: 12,
          isSelectedBtn: selectedInstall == 'Adm',
          assetImage: 'assets/images/adm.png',
          onSelected: () => onChangeInstallmentsMethod('Adm'),
        ),
        if (selectedTefType != "M-Sitef") ...{
          GeneralWidgets.personSelectedButton(
            nameButton: 'A vista',
            fontLabelSize: 12,
            isSelectedBtn: selectedInstall == 'Avista',
            assetImage: 'assets/images/card.png',
            onSelected: () => onChangeInstallmentsMethod('Avista'),
          ),
        }
      ],
    );
  }
}
