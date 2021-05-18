import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_m8/Struct/enums.dart';
import 'package:flutter_m8/Utils/utils.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/components/components.dart';
import 'package:flutter_m8/services/service_printer.dart';
import 'package:flutter_m8/services/services_tef/sitefReturn.dart';
import 'package:flutter_m8/services/services_tef/sitefController.dart';
import 'package:flutter_m8/services/service_paygo.dart';

import 'dart:convert';
import 'dart:io' as Io;

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

  // String imageViaClientBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=';
  String imageViaClientBase64 =
      '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';
  // var fileImageViaCliente;

  PayGoService paygoService = new PayGoService();
  PrinterService printerService = new PrinterService();

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
        imageViaClientBase64 = resultMap["via_cliente"];

        //A STRING RETORNA COM ESPAÇO ENTRE OS CARACTERES
        //AS SEGUINTES LINHAS REMOVEM ESSE ESPAÇO PARA APRESENTAR A IMAGEM DA VIA
        imageViaClientBase64 = imageViaClientBase64.replaceAll(new RegExp(r"\s+"), "");
        imageViaClientBase64 = imageViaClientBase64.trim();
      });

      printerService.sendPrinterImage(
        resultMap["via_cliente"],
        true,
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

  Widget imageViaClienteBase64() {
    if (imageViaClientBase64 == "") return new Container();

    Uint8List bytes = Base64Codec().decode(imageViaClientBase64);

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
              if (selectedTefType == "PayGo" && imageViaClientBase64 != "") ...{
                imageViaClienteBase64(),
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
