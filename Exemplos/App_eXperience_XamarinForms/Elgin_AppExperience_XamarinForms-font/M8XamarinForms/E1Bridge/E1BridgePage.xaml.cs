﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class E1BridgePage : ContentPage
    {
        //Objeto da classe E1BridgeService para uso das funções Bridge
        IE1Bridge bridgeService = DependencyService.Get<IE1Bridge>();

        //OpçÕes selecionadas
        private string selectedPaymentMethod;
        private int selectedInstallmentType;

        //Definindo tipo de pagamento
        public const string PAGAMENTO_CREDITO = "Crédito";
        public const string PAGAMENTO_DEBITO = "Débito";

        //Definindo tipos de financiamento
        public const int FINANCIAMENTO_A_VISTA = 1;
        public const int FINANCIAMENTO_PARCELADO_EMISSOR = 2;
        public const int FINANCIAMENTO_PARCELADO_ESTABELECIMENTO = 3;

        //Código que identifica PDV que está se conectando (usado para as operações de vendaCredito,vendaDebito,cancelamentoVenda, operacaoAdm)
        public const string PDV = "PDV1";

        //Número de parcelas em int
        private int numberOfInstallments = 1;

        //Boolean que guarda se o Bridge deve ou não enviar uma senha ao tentar qualquer transação
        private bool sendPassword = false;

        //String reservada para receber os dados carregados dos xmls de exemplo utilizados na funcao de impressao de cupom
        private string xmlNFCeInString;
        private string xmlSatInString;
        private string xmlSatCancellationInString;

        public E1BridgePage()
        {
            InitializeComponent();

            //Valores iniciais
            ipEntry.Text ="192.168.0.104";
            valueEntry.Text ="2000";

            //O padrão da aplicação é iniciar com a opção de pagamento por crédito com parcelamento a vista, portanto o número de parcelas deve ser obrigatoriamente 1
            numberOfInstallmentsEntry.Text ="1";
            numberOfInstallments = 1;
            numberOfInstallmentsEntry.IsEnabled = false;

            //Valores padrões para as portas
            transactionPortEntry.Text ="3000";
            statusPortEntry.Text ="3001";

            //Senha vazia
            passwordEntry.Text = "";
            passwordEntry.IsEnabled = false;

            //Seleção inicial dos tipo de pagamento / forma de parcelamento
            selectedPaymentMethod = PAGAMENTO_CREDITO;
            selectedInstallmentType = FINANCIAMENTO_A_VISTA;

            btnCreditOptionBridge.BorderColor = Color.FromHex("23F600");
            btnAvistaOptionBridge.BorderColor = Color.FromHex("23F600");

            checkboxSendPassword.CheckedChanged += CheckboxSendPassword_CheckedChanged;

            btnCreditOptionBridge.Clicked += delegate (object sender, EventArgs e) {
                //Mudando tipo de pagamento escolhido/redecorando botões/ reabilitando layout de parcelamento e número de parcelas
                btnCreditOptionBridge.BorderColor = Color.FromHex("23F600");
                btnDebitOptionBridge.BorderColor = Color.Black;

                stackParcelas.IsVisible = true;
                stackTypeInstallments.IsVisible = true;

                selectedPaymentMethod = PAGAMENTO_CREDITO;
            };

            btnDebitOptionBridge.Clicked += delegate (object sender, EventArgs e) {
                //Mudando tipo de pagamento escolhido/redecorando botões/ reabilitando layout de parcelamento e número de parcelas
                btnCreditOptionBridge.BorderColor = Color.Black;
                btnDebitOptionBridge.BorderColor = Color.FromHex("23F600");

                stackParcelas.IsVisible = false;
                stackTypeInstallments.IsVisible = false;

                selectedPaymentMethod = PAGAMENTO_DEBITO;
            };

            btnStoreOptionBridge.Clicked += delegate (object sender, EventArgs e)
            {
                //Muda a decoração dos botões e atribuindo tipo de parcelamento
                btnStoreOptionBridge.BorderColor = Color.FromHex("23F600");
                btnAdmOptionBridge.BorderColor = Color.Black;
                btnAvistaOptionBridge.BorderColor = Color.Black;

                selectedInstallmentType = FINANCIAMENTO_PARCELADO_ESTABELECIMENTO;

                numberOfInstallmentsEntry.Text = "2";
                numberOfInstallments = 1;
                numberOfInstallmentsEntry.IsEnabled = true;
            };

            btnAdmOptionBridge.Clicked += delegate (object sender, EventArgs e)
            {
                //Muda a decoração dos botões e atribuindo tipo de parcelamento
                btnStoreOptionBridge.BorderColor = Color.Black;
                btnAdmOptionBridge.BorderColor = Color.FromHex("23F600");
                btnAvistaOptionBridge.BorderColor = Color.Black;

                selectedInstallmentType = FINANCIAMENTO_PARCELADO_EMISSOR;

                numberOfInstallmentsEntry.Text = "2";
                numberOfInstallments = 1;
                numberOfInstallmentsEntry.IsEnabled = true;
            };

            btnAvistaOptionBridge.Clicked += delegate (object sender, EventArgs e)
            {
                //Muda a decoração dos botões e atribuindo tipo de parcelamento
                btnStoreOptionBridge.BorderColor = Color.Black;
                btnAdmOptionBridge.BorderColor = Color.Black;
                btnAvistaOptionBridge.BorderColor = Color.FromHex("23F600");

                selectedInstallmentType = FINANCIAMENTO_A_VISTA;

                numberOfInstallmentsEntry.Text = "1";
                numberOfInstallments = 1;
                numberOfInstallmentsEntry.IsEnabled = false;
            };

            btnSendTransaction.Clicked += delegate (object sender, EventArgs e)
            {
                /**
                 * Valida e tenta atualizar a configuração de IP e Portas Transação/Status
                 * Valida campo de Valor
                 * Valida número de parcelas
                 */
                if (TryToUpdateBridgeServer() && IsValueValidToElginPay() && IsInstallmentsFieldValid())
                {
                    //Habilita/Desabilita o envio de senha para validação no terminal
                    ShouldSendPassword();

                    //o valor da transação deve ser passado em centavos; a virgula é removida.
                    string totalValue = valueEntry.Text.Replace(",", "");


                    //Crédito ou Débito
                    /**
                     * @param generateRandomForBridgeTransactions() é um int aletório no que pode estar entre o valor 0 e 999999 para servir como id da transação; afim de diferenciar uma transação da outra.
                     * @param PVD é uma String que serve como código identificador do pdv que enviou a operação.
                     */
                    if (selectedPaymentMethod.Equals(PAGAMENTO_CREDITO))
                    {
                        string resultadoOperacao = bridgeService.IniciaVendaCredito(GenerateRandomForBridgeTransactions(), PDV, totalValue, selectedInstallmentType, numberOfInstallments);
                        AlertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao);
                    }
                    else
                    {
                        string resultadoOperacao = bridgeService.IniciaVendaDebito(GenerateRandomForBridgeTransactions(), PDV, totalValue);
                        AlertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao);
                    }

                }
            };

            // A operacao de cancelameno de vende requer uma data, para fins de simplicação, usaremos apenas a data do mesmo dia
            // uma vez que as transações são fantasias
            btnCancelTransaction.Clicked += async delegate(object sender, EventArgs e) {
                //Aplicando formatação
                string todayDate = DateTime.Now.ToString("dd/MM/yyyy");

                //o valor da transação deve ser passado em centavos; a virgula é removida.
                string totalValue = valueEntry.Text.Replace(",", "");

                // Alert com Entry para pegar o input do usuário na caixa de diálogo
                string saleRef = await DisplayPromptAsync("Alerta", "Código de Referência:", "OK", "CANCELAR", keyboard: Keyboard.Numeric);
                if (saleRef == null) return;

                if (saleRef.Equals(""))
                {
                    AlertMessageStatus("Alerta", "O campo código de referência da transação não pode ser vazio! Digite algum valor.");
                    return;
                }
                else
                {
                    if (TryToUpdateBridgeServer())
                    {
                        //Habilita/Desabilita o envio de senha para validação no terminal
                        ShouldSendPassword();

                        string resultadoOperacao = bridgeService.IniciaCancelamentoVenda(GenerateRandomForBridgeTransactions(), PDV, totalValue, todayDate, saleRef);
                        AlertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao);
                    }
                }
            };

            btnAdministrativeOperation.Clicked += async delegate (object sender, EventArgs e) {
                string[] operations = { "Operação Administrativa", "Operação de Instalação", "Operação de Configuração", "Operação de Manutenção", "Teste de Comunicação", "Reimpressão de Comprovante" };
                string option = await DisplayActionSheet("ESCOLHA A OPERAÇÃO ADMINISTRATIVA", "CANCELAR", null, operations);
                if (option == null) return;

                if (TryToUpdateBridgeServer())
                {
                    //Habilita/Desabilita o envio de senha para validação no terminal
                    ShouldSendPassword();

                    //Neste caso o int index que é um parametro fornecido assim que uma opção é selecionada corresponde diretamente aos valores da documentação.
                    int index = Array.IndexOf(operations, option);
                    string resultadoOperacao = bridgeService.IniciaOperacaoAdministrativa(GenerateRandomForBridgeTransactions(), PDV, index);
                    AlertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao);
                }
            };

            btnPrintTestCoupon.Clicked += async delegate (object sender, EventArgs e) {
                //IniciaOperaçãoAdministrativa de acordo com qual operação foi selecionada.
                
                string[] couponTypes = { "Imprimir Cupom NFCe", "Imprimir Cupom Sat", "Imprimir Cupom Sat Cancelamento" };
                string option = await DisplayActionSheet("ESCOLHA O TIPO DE CUPOM", "CANCELAR", null, couponTypes);
                if (option == null) return;

                if (TryToUpdateBridgeServer())
                {
                    //Habilita/Desabilita o envio de senha para validação no terminal
                    ShouldSendPassword();

                    //Variaveis para comparacao do tipo selecionado
                    const int NFCE_COUPON = 0;
                    const int SAT_COUPON = 1;
                    const int SAT_CANCELLATION_COUPON = 2;

                    int selected = Array.IndexOf(couponTypes, option);
                    if (selected == NFCE_COUPON)
                    {
                        const string XML_EXEMPLO_CUPOM_NFCE = "<?xml version='1.0' encoding='utf-8'?><NFe xmlns=\"http://www.portalfiscal.inf.br/nfe\"><infNFe Id=\"NFe13220114200166000166650070000001029870832698\" versao=\"4.00\"><ide><cUF>13</cUF><cNF>87083269</cNF><natOp>venda</natOp><mod>65</mod><serie>7</serie><nNF>102</nNF><dhEmi>2022-01-26T11:38:37-03:00</dhEmi><tpNF>1</tpNF><idDest>1</idDest><cMunFG>1302603</cMunFG><tpImp>4</tpImp><tpEmis>1</tpEmis><cDV>8</cDV><tpAmb>2</tpAmb><finNFe>1</finNFe><indFinal>1</indFinal><indPres>1</indPres><procEmi>0</procEmi><verProc>pynota 0.1.0</verProc><dhCont>2022-01-26T11:38:38-03:00</dhCont><xJust>Conexão com a sefaz indisponível</xJust></ide><emit><CNPJ>14200166000166</CNPJ><xNome>NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xNome><xFant>Elgin S/A</xFant><enderEmit><xLgr>Avenida Manaus Dois Mil</xLgr><nro>1</nro><xBairro>Japiim</xBairro><cMun>1302603</cMun><xMun>Manaus</xMun><UF>AM</UF><CEP>69076448</CEP><cPais>1058</cPais><xPais>Brasil</xPais><fone>1133835816</fone></enderEmit><IE>062012991</IE><IM>793</IM><CNAE>6202300</CNAE><CRT>3</CRT></emit><det nItem=\"1\"><prod><cProd>123</cProd><cEAN>SEM GTIN</cEAN><xProd>NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xProd><NCM>22030000</NCM><CEST>0302100</CEST><indEscala>S</indEscala><CFOP>5102</CFOP><uCom>UN</uCom><qCom>1</qCom><vUnCom>1</vUnCom><vProd>1.00</vProd><cEANTrib>5000000000357</cEANTrib><uTrib>UN</uTrib><qTrib>1</qTrib><vUnTrib>1</vUnTrib><indTot>1</indTot></prod><imposto><ICMS><ICMS40><orig>0</orig><CST>41</CST></ICMS40></ICMS><PIS><PISAliq><CST>01</CST><vBC>1.00</vBC><pPIS>1.6500</pPIS><vPIS>0.02</vPIS></PISAliq></PIS><COFINS><COFINSAliq><CST>01</CST><vBC>1.00</vBC><pCOFINS>7.6000</pCOFINS><vCOFINS>0.08</vCOFINS></COFINSAliq></COFINS></imposto></det><total><ICMSTot><vBC>0.00</vBC><vICMS>0.00</vICMS><vICMSDeson>0.00</vICMSDeson><vFCP>0.00</vFCP><vBCST>0.00</vBCST><vST>0.00</vST><vFCPST>0.00</vFCPST><vFCPSTRet>0.00</vFCPSTRet><vProd>1.00</vProd><vFrete>0.00</vFrete><vSeg>0.00</vSeg><vDesc>0.00</vDesc><vII>0.00</vII><vIPI>0.00</vIPI><vIPIDevol>0.00</vIPIDevol><vPIS>0.02</vPIS><vCOFINS>0.08</vCOFINS><vOutro>0.00</vOutro><vNF>1.00</vNF><vTotTrib>0.00</vTotTrib></ICMSTot></total><transp><modFrete>9</modFrete><vol><qVol>12</qVol><esp>VOL</esp><marca>Elgin SA</marca><nVol>0 A 0</nVol><pesoL>20.123</pesoL><pesoB>30.123</pesoB><lacres><nLacre>3000</nLacre></lacres></vol></transp><pag><detPag><indPag>0</indPag><tPag>01</tPag><vPag>1.00</vPag></detPag><vTroco>0.00</vTroco></pag><infRespTec><CNPJ>29604796000173</CNPJ><xContato>riosoft</xContato><email>contato@veraciti.com.br</email><fone>92998745445</fone><idCSRT>12</idCSRT><hashCSRT>qvTGHdzF6KLavt4PO0gs2a6pQ00=</hashCSRT></infRespTec></infNFe><infNFeSupl><qrCode>https://sistemas.sefaz.am.gov.br/nfceweb-hom/consultarNFCe.jsp?p=13220114200166000166650070000001029870832698|2|2|26|1.00|6c4e62336b4d4f33365966626f4f4168556473767244695233674d3d|1|CCE5214E1F0BB8B6AB4F14B348C65F61C90551E2</qrCode><urlChave>www.sefaz.am.gov.br/nfce/consulta</urlChave></infNFeSupl><Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#\"><SignedInfo><CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/><SignatureMethod Algorithm=\"http://www.w3.org/2000/09/xmldsig#rsa-sha1\"/><Reference URI=\"#NFe13220114200166000166650070000001029870832698\"><Transforms><Transform Algorithm=\"http://www.w3.org/2000/09/xmldsig#enveloped-signature\"/><Transform Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/></Transforms><DigestMethod Algorithm=\"http://www.w3.org/2000/09/xmldsig#sha1\"/><DigestValue>lNb3kMO36YfboOAhUdsvrDiR3gM=</DigestValue></Reference></SignedInfo><SignatureValue>ImcjGhmNZQDDfahkYGHecWYBk4/LwNql3JscIK3wz5igswa5YA3q9RSqbvP4hUhubN8KowfvRqtvpteCteYp1afxWlBAkPx5CmVDMiweyya5CRlfZlDF37sE6deHQkI3kQ9hOKCNsZn2lmanPeiV1YJkwjMhiY3GnLVQDxeu8fJqr9MALXa5gaOe7WWFyCTd/B+9MQjhEKAnf4SdmyC7VLbBIY5lYWVvjPvoisThAShVZdn7IDI2AzKAIEmAl7QJWHplKZ1oylRti+l/DUVQzvG8xNq3pzHHeXIcmlgIONG+HSNeaQZ8OLJ2r9RgpRy+H+mHIEyjS/qtCPG1Bi70ow==</SignatureValue><KeyInfo><X509Data><X509Certificate>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</X509Certificate></X509Data></KeyInfo></Signature></NFe>";
                        const int INDEXCSC_EXEMPLO = 1;
                        const string CSC_EXEMPLO = "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES";


                        string resultadoOperacao = bridgeService.ImprimirCupomNfce(XML_EXEMPLO_CUPOM_NFCE, INDEXCSC_EXEMPLO, CSC_EXEMPLO);
                        AlertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao);
                    }
                    else if (selected == SAT_COUPON)
                    {
                        const string XML_CUPOM_EXEMPLO_SAT = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><CFe><infCFe Id=\"CFe13190814200166000166599000178400000148075811\" versao=\"0.07\" versaoDadosEnt=\"0.07\" versaoSB=\"010103\"><ide><cUF>13</cUF><cNF>807581</cNF><mod>59</mod><nserieSAT>900017840</nserieSAT><nCFe>000014</nCFe><dEmi>20190814</dEmi><hEmi>163227</hEmi><cDV>1</cDV><tpAmb>2</tpAmb><CNPJ>16716114000172</CNPJ><signAC>SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT</signAC><assinaturaQRCODE>kAmMUV2AFOP11vsbAwb4S1MrcnzIm8o6trefwjpRvpJaNGeXXcM2GKbs+aALc3WDxrimeOf9BdgoZl29RvtC1DmvqZ56oVEoRz0ymia1tHUdGPzuO035OuiEseEj3+gU+8NzGzqWQIJgqdgLOZgnmUP2aBOkC0QcokhHPVfwm9tJFQnQkzGzu4692+LtpxhLwEhnFjoZh+1hpBXn5AEcbMS4Lx751qvFlfZX0hsYJf5pKcFH88E3byU82MU8UD5p9fyX2qL5Ae+Uql1VLPqoJOsQmC2BCBkMW7oQRCCR0osz6eLX1DHHJU+stxKCkITlQnz6XJd4LKXifGZuZ25+Uw==</assinaturaQRCODE><numeroCaixa>001</numeroCaixa></ide><emit><CNPJ>14200166000166</CNPJ><xNome>ELGIN INDUSTRIAL DA AMAZONIA LTDA</xNome><enderEmit><xLgr>AVENIDA ABIURANA</xLgr><nro>579</nro><xBairro>DIST INDUSTRIAL</xBairro><xMun>MANAUS</xMun><CEP>69075010</CEP></enderEmit><IE>111111111111</IE><cRegTrib>3</cRegTrib><indRatISSQN>N</indRatISSQN></emit><dest><CPF>14808815893</CPF></dest><det nItem=\"1\"><prod><cProd>0000000000001</cProd><xProd>PRODUTO NFCE 1</xProd><NCM>94034000</NCM><CFOP>5102</CFOP><uCom>UN</uCom><qCom>1.0000</qCom><vUnCom>3.51</vUnCom><vProd>3.51</vProd><indRegra>T</indRegra><vItem>3.00</vItem><vRatDesc>0.51</vRatDesc></prod><imposto><ICMS><ICMS00><Orig>0</Orig><CST>00</CST><pICMS>7.00</pICMS><vICMS>0.21</vICMS></ICMS00></ICMS><PIS><PISAliq><CST>01</CST><vBC>6.51</vBC><pPIS>0.0165</pPIS><vPIS>0.11</vPIS></PISAliq></PIS><COFINS><COFINSAliq><CST>01</CST><vBC>6.51</vBC><pCOFINS>0.0760</pCOFINS><vCOFINS>0.49</vCOFINS></COFINSAliq></COFINS></imposto></det><total><ICMSTot><vICMS>0.21</vICMS><vProd>3.51</vProd><vDesc>0.00</vDesc><vPIS>0.11</vPIS><vCOFINS>0.49</vCOFINS><vPISST>0.00</vPISST><vCOFINSST>0.00</vCOFINSST><vOutro>0.00</vOutro></ICMSTot><vCFe>3.00</vCFe><DescAcrEntr><vDescSubtot>0.51</vDescSubtot></DescAcrEntr><vCFeLei12741>0.56</vCFeLei12741></total><pgto><MP><cMP>01</cMP><vMP>6.51</vMP></MP><vTroco>3.51</vTroco></pgto><infAdic><infCpl>Trib aprox R$ 0,36 federal, R$ 1,24 estadual e R$ 0,00 municipal&lt;br&gt;CAIXA: 001 OPERADOR: ROOT</infCpl><obsFisco xCampo=\"04.04.05.04\"><xTexto>Comete crime quem sonega</xTexto></obsFisco></infAdic></infCFe><Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#\"><SignedInfo><CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/><SignatureMethod Algorithm=\"http://www.w3.org/2001/04/xmldsig-more#rsa-sha256\"/><Reference URI=\"#CFe13190814200166000166599000178400000148075811\"><Transforms><Transform Algorithm=\"http://www.w3.org/2000/09/xmldsig#enveloped-signature\"/><Transform Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/></Transforms><DigestMethod Algorithm=\"http://www.w3.org/2001/04/xmlenc#sha256\"/><DigestValue>rozf1i6JehNUqx8tfP1FG3QVUIxlrcHgozaB4LAjkDM=</DigestValue></Reference></SignedInfo><SignatureValue>cAiGHfx3QxIhrmz3b36Z1EBs/TzLXKQkE5Ykn3Q1HOEKpshyZRaOLKlg6LiHjFgaZNKZnwWkKLQav2Af342Xc3XIkIjOF72vmLZxd/u6naZ3lYVWcf/G2YYdMpUAoqfpihLilVZZMqAIQQ/SW76mGstSI743lc0FL1NuMXSvAT3b9X1JcaC1r4uHezYGp/iSrX/lxfdnu4ZP2gzJ7KEnRvrTm9TCF3mA0zhDF5iem4vJC8bS/+OjhKhKfDeyxkrPDQc8+n7brALOYWbR3RUleMMKCIQf/nxaEy9XEsb53rC4KXLe5JL15YCxQ8TRYU6vvLoqFecd72HebFQ/C2BvgA==</SignatureValue><KeyInfo><X509Data>\n" +
                                "<X509Certificate>MIIFzTCCBLWgAwIBAgICH9owDQYJKoZIhvcNAQENBQAwaDELMAkGA1UEBhMCQlIxEjAQBgNVBAgMCVNBTyBQQVVMTzESMBAGA1UEBwwJU0FPIFBBVUxPMQ8wDQYDVQQKDAZBQ0ZVU1AxDzANBgNVBAsMBkFDRlVTUDEPMA0GA1UEAwwGQUNGVVNQMB4XDTE5MDUxNjEyMjU1NFoXDTI0MDUxNDEyMjU1NFowgbIxCzAJBgNVBAYTAkJSMREwDwYDVQQIDAhBbWF6b25hczERMA8GA1UECgwIU0VGQVotU1AxGDAWBgNVBAsMD0FDIFNBVCBTRUZBWiBTUDEoMCYGA1UECwwfQXV0b3JpZGFkZSBkZSBSZWdpc3RybyBTRUZBWiBTUDE5MDcGA1UEAwwwRUxHSU4gSU5EVVNUUklBTCBEQSBBTUFaT05JQSBMVERBOjE0MjAwMTY2MDAwMTY2MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuKdsN2mi5OserALssgKyPBZBnt3TeytHObTV2xboIeZ8nQ3qDbzovkpxwvBLEKCI1+5sWkZUBmQAqDXTv4Zu/oVPmgVAjLOQszH9mEkyrhlT5tRxyptGKCN58nfx150rHPvov9ct9uizR4S5+nDvMSLNVFpcpbT2y+vnfmMPQzOec8SbKdSPy1dytHl+id9r4XD/s/fXc19URb9XXtMui+praC9vWasiJsFScnTJScIdLwqZsCAmDQeRFHX1e57vCLNxFNCfKzgCRd9VhCQE03kXrz+xo7nJGdXP2baABvh3mi6ifHeuqPXw5JBwjemS0KkRZ5PhE5Ndkih86ZAeIwIDAQABo4ICNDCCAjAwCQYDVR0TBAIwADAOBgNVHQ8BAf8EBAMCBeAwLAYJYIZIAYb4QgENBB8WHU9wZW5TU0wgR2VuZXJhdGVkIENlcnRpZmljYXRlMB0GA1UdDgQWBBRS6g1qRE9lsk/8dfDlVjhISI/1wTAfBgNVHSMEGDAWgBQVtOORhiQs6jNPBR4tL5O3SJfHeDATBgNVHSUEDDAKBggrBgEFBQcDAjBDBgNVHR8EPDA6MDigNqA0hjJodHRwOi8vYWNzYXQuZmF6ZW5kYS5zcC5nb3YuYnIvYWNzYXRzZWZhenNwY3JsLmNybDCBpwYIKwYBBQUHAQEEgZowgZcwNQYIKwYBBQUHMAGGKWh0dHA6Ly9vY3NwLXBpbG90LmltcHJlbnNhb2ZpY2lhbC5jb20uYnIvMF4GCCsGAQUFBzAChlJodHRwOi8vYWNzYXQtdGVzdGUuaW1wcmVuc2FvZmljaWFsLmNvbS5ici9yZXBvc2l0b3Jpby9jZXJ0aWZpY2Fkb3MvYWNzYXQtdGVzdGUucDdjMHsGA1UdIAR0MHIwcAYJKwYBBAGB7C0DMGMwYQYIKwYBBQUHAgEWVWh0dHA6Ly9hY3NhdC5pbXByZW5zYW9maWNpYWwuY29tLmJyL3JlcG9zaXRvcmlvL2RwYy9hY3NhdHNlZmF6c3AvZHBjX2Fjc2F0c2VmYXpzcC5wZGYwJAYDVR0RBB0wG6AZBgVgTAEDA6AQDA4xNDIwMDE2NjAwMDE2NjANBgkqhkiG9w0BAQ0FAAOCAQEArHy8y6T6ZMX6qzZaTiTRqIN6ZkjOknVCFWTBFfEO/kUc1wFBTG5oIx4SDeas9+kxZzUqjk6cSsysH8jpwRupqrJ38wZir1OgPRBuGAPz9lcah8IL4tUQkWzOIXqqGVxDJ8e91MjIMWextZuy212E8Dzn3NNMdbqyOynd7O0O5p6wPS5nuTeEsm3wcw0aLu0bbIy+Mb/nHIqFKaoZEZ8LSYn2TfmP+z9AhOC1vj3swxuRTKf1xLcNvVbq/r+SAwwBC/IGRpgeMAzELLPLPUHrBeSO+26YWwXdxaq29SmEo77KkUpUXPlt9hS2MPagCLsE6ZwDSmc8x1h3Hv+MW8zxyg==</X509Certificate>\n" +
                                "</X509Data></KeyInfo></Signature></CFe>";

                        string resultadoOperacao = bridgeService.ImprimirCupomSat(XML_CUPOM_EXEMPLO_SAT);
                        AlertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao);
                    }
                    else
                    {
                        const string XML_CUPOM_EXEMPLO_SAT_CANCELAMENTO = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><CFeCanc><infCFe Id=\"CFe13180314200166000166599000108160001324252883\" chCanc=\"CFe13180314200166000166599000108160001316693175\" versao=\"0.07\"><dEmi>20180305</dEmi><hEmi>142819</hEmi><ide><cUF>13</cUF><cNF>425288</cNF><mod>59</mod><nserieSAT>900010816</nserieSAT><nCFe>000132</nCFe><dEmi>20180305</dEmi><hEmi>142846</hEmi><cDV>3</cDV><CNPJ>16716114000172</CNPJ><signAC>SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT</signAC><assinaturaQRCODE>Q5DLkpdRijIRGY6YSSNsTWK1TztHL1vD0V1Jc4spo/CEUqICEb9SFy82ym8EhBRZjbh3btsZhF+sjHqEMR159i4agru9x6KsepK/q0E2e5xlU5cv3m1woYfgHyOkWDNcSdMsS6bBh2Bpq6s89yJ9Q6qh/J8YHi306ce9Tqb/drKvN2XdE5noRSS32TAWuaQEVd7u+TrvXlOQsE3fHR1D5f1saUwQLPSdIv01NF6Ny7jZwjCwv1uNDgGZONJdlTJ6p0ccqnZvuE70aHOI09elpjEO6Cd+orI7XHHrFCwhFhAcbalc+ZfO5b/+vkyAHS6CYVFCDtYR9Hi5qgdk31v23w==</assinaturaQRCODE><numeroCaixa>001</numeroCaixa></ide><emit><CNPJ>14200166000166</CNPJ><xNome>ELGIN INDUSTRIAL DA AMAZONIA LTDA</xNome><enderEmit><xLgr>AVENIDA ABIURANA</xLgr><nro>579</nro><xBairro>DIST INDUSTRIAL</xBairro><xMun>MANAUS</xMun><CEP>69075010</CEP></enderEmit><IE>111111111111</IE><IM>111111</IM></emit><dest><CPF>14808815893</CPF></dest><total><vCFe>3.00</vCFe></total><infAdic><obsFisco xCampo=\"xCampo1\"><xTexto>xTexto1</xTexto></obsFisco></infAdic></infCFe><Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#\"><SignedInfo><CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/><SignatureMethod Algorithm=\"http://www.w3.org/2001/04/xmldsig-more#rsa-sha256\"/><Reference URI=\"#CFe13180314200166000166599000108160001324252883\"><Transforms><Transform Algorithm=\"http://www.w3.org/2000/09/xmldsig#enveloped-signature\"/><Transform Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/></Transforms><DigestMethod Algorithm=\"http://www.w3.org/2001/04/xmlenc#sha256\"/><DigestValue>pePcOYfIU+b59qGayJiJj492D9fTVhqbHEqFLDUi1Wc=</DigestValue></Reference></SignedInfo><SignatureValue>og35vHuErSOCB29ME4WRwdVPwps/mOUQJvk3nA4Oy//CVPIt0X/iGUZHMnJhQa4aS4c7dq5YUaE2yf8H9FY8xPkY9vDQW62ZzuM/6qSHeh9Ft09iP55T76h7iLY+QLl9FZL4WINmCikv/kzmCCi4+8miVwx1MnFiTNsgSMmzRnvAv1iVkhBogbAZES03iQIi7wZGzZDo7bFmWyXVdtNnjOke0WS0gTLhJbftpDT3gi0Muu8J+AfNjaziBMFQB3i1oN96EkpCKsT78o5Sb+uBux/bV3r79nrFk4MXzaFOgBoTqv1HF5RVNx2nWSoZrbpAV8zPB1icnAnfb4Qfh1oJdA==</SignatureValue><KeyInfo><X509Data><X509Certificate>MIIFzTCCBLWgAwIBAgICESswDQYJKoZIhvcNAQENBQAwaDELMAkGA1UEBhMCQlIxEjAQBgNVBAgMCVNBTyBQQVVMTzESMBAGA1UEBwwJU0FPIFBBVUxPMQ8wDQYDVQQKDAZBQ0ZVU1AxDzANBgNVBAsMBkFDRlVTUDEPMA0GA1UEAwwGQUNGVVNQMB4XDTE3MDEyNzEzMzMyMloXDTIyMDEyNjEzMzMyMlowgbIxCzAJBgNVBAYTAkJSMREwDwYDVQQIDAhBbWF6b25hczERMA8GA1UECgwIU0VGQVotU1AxGDAWBgNVBAsMD0FDIFNBVCBTRUZBWiBTUDEoMCYGA1UECwwfQXV0b3JpZGFkZSBkZSBSZWdpc3RybyBTRUZBWiBTUDE5MDcGA1UEAwwwRUxHSU4gSU5EVVNUUklBTCBEQSBBTUFaT05JQSBMVERBOjE0MjAwMTY2MDAwMTY2MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtyLG8URyX8fqjOQa+rj3Rl6Z6eIX/dndhNe0rw6inNAXt06HtXQslBqnReuSanN3ssgpV6oev0ikfXA7hhmpZM7qVigTJp3+h1K9vKUlPZ5ELT36yAokpxakIyYRy5ELjP4KwFrAjQUgB6xu5X/MOoUmBKRLIiwm3wh7kUA9jZArQGD4pRknuvFuQ99ot3y6u3lI7Oa2ZqJ1P2E7NBmfdswQL8VG51by0Weivugsv3xWAHvdXZmmOrmv2W5C2U2VnsTjA3p2zQVwitZBEh6JxqLE3KljXlokbhHb1m2moSbzRLCdAJHIq/6eWL8kl2OVWViECODGoYA0Qz0wSgk/vwIDAQABo4ICNDCCAjAwCQYDVR0TBAIwADAOBgNVHQ8BAf8EBAMCBeAwLAYJYIZIAYb4QgENBB8WHU9wZW5TU0wgR2VuZXJhdGVkIENlcnRpZmljYXRlMB0GA1UdDgQWBBTIeTKrUS19raxSgeeIHYSXclNYkDAfBgNVHSMEGDAWgBQVtOORhiQs6jNPBR4tL5O3SJfHeDATBgNVHSUEDDAKBggrBgEFBQcDAjBDBgNVHR8EPDA6MDigNqA0hjJodHRwOi8vYWNzYXQuZmF6ZW5kYS5zcC5nb3YuYnIvYWNzYXRzZWZhenNwY3JsLmNybDCBpwYIKwYBBQUHAQEEgZowgZcwNQYIKwYBBQUHMAGGKWh0dHA6Ly9vY3NwLXBpbG90LmltcHJlbnNhb2ZpY2lhbC5jb20uYnIvMF4GCCsGAQUFBzAChlJodHRwOi8vYWNzYXQtdGVzdGUuaW1wcmVuc2FvZmljaWFsLmNvbS5ici9yZXBvc2l0b3Jpby9jZXJ0aWZpY2Fkb3MvYWNzYXQtdGVzdGUucDdjMHsGA1UdIAR0MHIwcAYJKwYBBAGB7C0DMGMwYQYIKwYBBQUHAgEWVWh0dHA6Ly9hY3NhdC5pbXByZW5zYW9maWNpYWwuY29tLmJyL3JlcG9zaXRvcmlvL2RwYy9hY3NhdHNlZmF6c3AvZHBjX2Fjc2F0c2VmYXpzcC5wZGYwJAYDVR0RBB0wG6AZBgVgTAEDA6AQDA4xNDIwMDE2NjAwMDE2NjANBgkqhkiG9w0BAQ0FAAOCAQEAAhF7TLbDABp5MH0qTDWA73xEPt20Ohw28gnqdhUsQAII2gGSLt7D+0hvtr7X8K8gDS0hfEkv34sZ+YS9nuLQ7S1LbKGRUymphUZhAfOomYvGS56RIG3NMKnjLIxAPOHiuzauX1b/OwDRmHThgPVF4s+JZYt6tQLESEWtIjKadIr4ozUXI2AcWJZL1cKc/NI7Vx7l6Ji/66f8l4Qx704evTqN+PjzZbFNFvbdCeC3H3fKhVSj/75tmK2TBnqzdc6e1hrjwqQuxNCopUSV1EJSiW/LR+t3kfSoIuQCPhaiccJdAUMIqethyyfo0ie7oQSn9IfSms8aI4lh2BYNR1mf5w==</X509Certificate></X509Data></KeyInfo></Signature></CFeCanc>";
                        const string ASS_QR_CODE_EXEMPLO = "Q5DLkpdRijIRGY6YSSNsTWK1TztHL1vD0V1Jc4spo/CEUqICEb9SFy82ym8EhBRZjbh3btsZhF+sjHqEMR159i4agru9x6KsepK/q0E2e5xlU5cv3m1woYfgHyOkWDNcSdMsS6bBh2Bpq6s89yJ9Q6qh/J8YHi306ce9Tqb/drKvN2XdE5noRSS32TAWuaQEVd7u+TrvXlOQsE3fHR1D5f1saUwQLPSdIv01NF6Ny7jZwjCwv1uNDgGZONJdlTJ6p0ccqnZvuE70aHOI09elpjEO6Cd+orI7XHHrFCwhFhAcbalc+ZfO5b/+vkyAHS6CYVFCDtYR9Hi5qgdk31v23w==";

                        string resultadoOperacao = bridgeService.ImprimirCupomSatCancelamento(XML_CUPOM_EXEMPLO_SAT_CANCELAMENTO, ASS_QR_CODE_EXEMPLO);
                        AlertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao);
                    }
                }
            };

            btnGetTerminalStatus.Clicked += delegate (object sender, EventArgs e) {
                if (TryToUpdateBridgeServer())
                {
                    //Habilita/Desabilita o envio de senha para validação no terminal
                    ShouldSendPassword();

                    string resultadoFuncao = bridgeService.ConsultarStatus();
                    AlertMessageStatus("Retorno E1 - BRIDGE", resultadoFuncao);
                }
            };

            btnGetConfiguredTimeout.Clicked += delegate (object sender, EventArgs e) {
                if (TryToUpdateBridgeServer())
                {
                    //Habilita/Desabilita o envio de senha para validação no terminal
                    ShouldSendPassword();

                    string resultadoFuncao = bridgeService.GetTimeout();
                    AlertMessageStatus("Retorno E1 - BRIDGE", resultadoFuncao);
                }
            };

            btnGetLastTransaction.Clicked += delegate (object sender, EventArgs e) {
                if (TryToUpdateBridgeServer())
                {
                    //Habilita/Desabilita o envio de senha para validação no terminal
                    ShouldSendPassword();

                    string resultadoFuncao = bridgeService.ConsultarUltimaTransacao(PDV);
                    AlertMessageStatus("Retorno E1 - BRIDGE", resultadoFuncao);
                }
            };

            btnSetTransactionTimeout.Clicked += async delegate (object sender, EventArgs e) {
                string newTimeoutInSeconds = await DisplayPromptAsync("Alerta", "DEFINA UM NOVO TIMEOUT PARA TRANSAÇÃO (em segundos):", "OK", "CANCELAR", keyboard: Keyboard.Numeric);
                if (newTimeoutInSeconds == null) return; 

                newTimeoutInSeconds = newTimeoutInSeconds.Trim();

                if (newTimeoutInSeconds.Equals(""))
                {
                    AlertMessageStatus("Alerta", "O campo que representa a quantidade timeout a ser configurado não pode ser vazio! Digite algum valor.");
                    return;
                }
                else
                {
                    if (TryToUpdateBridgeServer())
                    {
                        //Habilita/Desabilita o envio de senha para validação no terminal
                        ShouldSendPassword();

                        //O valor do editText deve ser convetido para inteiro
                        string resultadoOperacao = bridgeService.SetTimeout(int.Parse(newTimeoutInSeconds));
                        AlertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao);
                    }
                }
            };

            btnSetTerminalPassword.Clicked += async delegate (object sender, EventArgs e)
            {
                string[] enableOrDisable = { "Habilitar Senha no Terminal", "Desabilitar Senha no Terminal" };
                string option = await DisplayActionSheet("ESCOLHA COMO CONFIGURAR A SENHA", "CANCELAR", null, enableOrDisable);
                if (option == null) return;

                //De acordo com a opção escolhida no alert exterior, será definida se operacao irã habilitar ou desabilitar a senha
                bool enable = Array.IndexOf(enableOrDisable, option) == 0;

                if (enable)
                {
                    string passwordEntered = await DisplayPromptAsync("Alerta", "DIGITE A SENHA A SER HABILITADA:", "OK", "CANCELAR", keyboard: Keyboard.Text);
                    if (passwordEntered == null) return;
                    if (passwordEntered.Equals(""))
                    {
                        AlertMessageStatus("Alerta", "O campo de senha a ser habilitada não pode ser vazio!");
                    }
                    else
                    {
                        const bool HABILITAR_SENHA_TERMINAL = true;

                        if (TryToUpdateBridgeServer())
                        {
                            //Habilita/Desabilita o envio de senha para validação no terminal
                            ShouldSendPassword();

                            //Se, Senão ; Opcao de habilitar senha

                            string resultadoOperacao = bridgeService.SetSenhaServer(passwordEntered, HABILITAR_SENHA_TERMINAL);
                            AlertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao);
                        }
                    }
                } else if (!sendPassword)
                {
                    AlertMessageStatus("Alerta", "Habilite a opção de envio de senha e envie a senha mais atual para desabilitar a senha do terminal!");
                }
                else {
                    //Habilita/Desabilita o envio de senha para validação no terminal
                    ShouldSendPassword();

                    const bool DESABILITAR_SENHA_TERMINAL = false;

                    //Deve ser passado um string vazia para deletar a senha no terminal, pois é mais intuitivo desabilitar a senha atual e deleta-la do que desabilitar e atualizar com uma nova
                    string resultadoOperacao = bridgeService.SetSenhaServer("", DESABILITAR_SENHA_TERMINAL);
                    AlertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao);
                }
            };
        }

        private int GenerateRandomForBridgeTransactions()
        {
            Random random = new Random();
            int int_random = random.Next(1000000);

            return int_random;
        }

        private async void AlertMessageStatus(string v, string resultadoOperacao)
        {
            await DisplayAlert(v, resultadoOperacao, "OK");
        }

        private void ShouldSendPassword()
        {
            const bool HABILITAR_ENVIO_SENHA = true;
            const bool DESABILITAR_ENVIO_SENHA = false;

            string enteredPassword = passwordEntry.Text;

            //Se a opção de envio de senha estiver marcada : habilite o envio de senha e set a senha que o Bridge ira enviar
            if (sendPassword)
            {
                bridgeService.SetSenha(enteredPassword, HABILITAR_ENVIO_SENHA);
            }
            else
            {
                bridgeService.SetSenha(enteredPassword, DESABILITAR_ENVIO_SENHA);
            }
        }

        private bool IsInstallmentsFieldValid()
        {
            try
            {
                int intNumberOfInstallments = int.Parse(numberOfInstallmentsEntry.Text);

                //Se o parcelamento não for a vista, o número mínimo de parcelas para se iniciar uma transação é 2
                if ((selectedInstallmentType == FINANCIAMENTO_PARCELADO_EMISSOR || selectedInstallmentType == FINANCIAMENTO_PARCELADO_ESTABELECIMENTO) && intNumberOfInstallments < 2)
                {
                    AlertMessageStatus("Alerta", "O número mínimo de parcelas para esse tipo de parcelamento é 2!");
                    return false;
                }

                //Como não há nenhum problema com o valor do campo de parcelas, atualizamos a váriavel:
                numberOfInstallments = intNumberOfInstallments;

                return true;
            }
            catch (FormatException)
            {
                //Como o inputType do campo está setado como "number" a única exception possível para este catch é de o campo estar vazio, uma vez que não é possível inserir quaisquer cacteres alem dos digitos [0-9].
                AlertMessageStatus("Alerta", "O campo número de parcelas não pode ser vazio! Digite algum valor.");

                return false;
            }
        }

        private bool IsValueValidToElginPay()
        {
            string s = valueEntry.Text.Replace(",", ".");
            double value = double.Parse(s);
            bool isValid = value >= 1.00;
            if (!isValid)
            {
                AlertMessageStatus("Alerta", "O valor mínimo para a transação é de R$1.00!");
            }
            return isValid;
        }

        private bool TryToUpdateBridgeServer()
        {
            //Se o valor inseridos no campo IP e nas portas transação/status forem válidos, atualize as configurações do Server e
            if (IsIpValid() && IsTransactionPortValid() && IsStatusPortValid())
            {
                bridgeService.SetServer(ipEntry.Text, int.Parse(transactionPortEntry.Text), int.Parse(statusPortEntry.Text));
                return true;
            }
            return false;
        }

        private bool IsStatusPortValid()
        {
            try
            {
                int statusPortInInt = int.Parse(statusPortEntry.Text);

                if (statusPortInInt > 65535)
                {
                    AlertMessageStatus("Alerta", "O valor inserido na porta de status excede o limite esbelecido de 65535!");
                    return false;
                }
                else return true;
            }
            catch (FormatException)
            {
                AlertMessageStatus("Alerta", "O valor inserido na porta de status não pode estar vazio!");
                return false;
            }
        }

        private bool IsTransactionPortValid()
        {
            try
            {
                int transactionPortInInt = int.Parse(transactionPortEntry.Text);

                if (transactionPortInInt > 65535)
                {
                    AlertMessageStatus("Alerta", "O valor inserido na porta de transação excede o limite esbelecido de 65535!");
                    return false;
                }
                else return true;
            }
            catch (FormatException)
            {
                AlertMessageStatus("Alerta", "O valor inserido na porta de transação não pode estar vazio");
                return false;
            }
        }

        private bool IsIpValid()
        {
            string IP = ipEntry.Text;

            Regex regexIP = new Regex(@"^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$");

            bool isIpValid = regexIP.Match(IP).Success;

            if (isIpValid) return true;

            AlertMessageStatus("Alerta", "Insira um IP válido para a conexão Bridge!");
            return false;
        }

        private void CheckboxSendPassword_CheckedChanged(object sender, CheckedChangedEventArgs e)
        {
            if (e.Value)
            {
                passwordEntry.IsEnabled = true;
                sendPassword = true;
            }
            else
            {
                passwordEntry.Text = "";
                passwordEntry.IsEnabled = false;
                sendPassword = false;
            }
        }
    }
}