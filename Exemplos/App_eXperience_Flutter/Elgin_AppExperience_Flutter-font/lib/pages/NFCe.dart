import 'dart:async';

import 'package:currency_text_input_formatter/currency_text_input_formatter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_keyboard_visibility/flutter_keyboard_visibility.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:fluttertoast/fluttertoast.dart';

import '../services/service_nfce.dart';
import '../services/service_printer.dart';

class NFCePage extends StatefulWidget {
  @override
  _NFCePageState createState() => _NFCePageState();
}

class _NFCePageState extends State<NFCePage> {
  final NfceService nfceService = new NfceService();
  final PrinterService printerService = new PrinterService();

  final TextEditingController productName =
      new TextEditingController(text: "CAFE");
  final TextEditingController productPrice =
      new TextEditingController(text: "8,00");
  final TextEditingController emitionTime = new TextEditingController(text: "");
  final TextEditingController nfceNumber = new TextEditingController(text: "");
  final TextEditingController nfceSerie = new TextEditingController(text: "");
  bool isNfceButtonEnabled = false;

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
    keyboardSubscription =
        _keyboardVisibilityController.onChange.listen((isVisible) {
      if (!isVisible) FocusManager.instance.primaryFocus?.unfocus();
    });
    connectInternalImp();
  }

  connectInternalImp() async {
    int result = await printerService.connectInternalImp();
    print("Internal: " + result.toString());
  }

  stopInternalPrinter() async {
    await printerService.printerStop();
  }

  @override
  void dispose() {
    keyboardSubscription.cancel();
    stopInternalPrinter();
    super.dispose();
  }

  void sendConfigurateXmlNFCe() async {
    final String configurateXmlNFCeResult =
        await nfceService.configurateXmlNFCE();

    if (configurateXmlNFCeResult == 'Success') {
      setState(() {
        isNfceButtonEnabled = true;
      });

      Fluttertoast.showToast(
          msg: "NFC-e configurada com sucesso!",
          toastLength: Toast.LENGTH_LONG,
          gravity: ToastGravity.BOTTOM,
          timeInSecForIosWeb: 1,
          backgroundColor: Colors.green,
          textColor: Colors.white,
          fontSize: 16.0);
    } else
      Fluttertoast.showToast(
          msg: "Erro na configuração de NFC-e!",
          toastLength: Toast.LENGTH_LONG,
          gravity: ToastGravity.BOTTOM,
          timeInSecForIosWeb: 1,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 16.0);
  }

  void sendSaleNfce() async {
    print(productName.text.toString() + " " + getProductPriceFormatted());
    final String sendSaleNfceResult = await nfceService.sendSaleNFCE(
        productName: productName.text.toString(),
        productPrice: getProductPriceFormatted());

    if (sendSaleNfceResult == "ERROR_SALE_CONFIGURATION")
      Fluttertoast.showToast(
          msg: "Erro na configuração de venda!",
          toastLength: Toast.LENGTH_LONG,
          gravity: ToastGravity.BOTTOM,
          timeInSecForIosWeb: 1,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 16.0);

    //Se nao ocorreu erro na configuração da venda, os únicos cenários possíveis são a nota foi emitida online ou em contigência, em ambos os casos deve-se expor o número e série da nota
    //Se a nota foi emitida online deverá ser exposto o tempo em segundos que a emissão levou.
    final List<String> it4rResponses = sendSaleNfceResult.split('|');

    if (it4rResponses[0] == "SUCCESS_CONTINGENCY") {
      GeneralWidgets.showAlertDialog(
          mainWidgetContext: context,
          dialogTitle: "NFC-e",
          dialogText:
              "Erro ao emitir NFC-e online, a impressão será da nota em contigência!");
      setState(() {
        this.nfceNumber.text = it4rResponses[1];
        this.nfceSerie.text = it4rResponses[2];
      });
    } else {
      GeneralWidgets.showAlertDialog(
          mainWidgetContext: context,
          dialogTitle: "NFC-e",
          dialogText: "NFC-e emitida com sucesso!");

      print(it4rResponses);
      setState(() {
        this.emitionTime.text =
            (it4rResponses[0] != "0") ? it4rResponses[0] + " SEGUNDOS" : "";
        this.nfceNumber.text = it4rResponses[1];
        this.nfceSerie.text = it4rResponses[2];
      });
    }
  }

  String getProductPriceFormatted() {
    return this.productPrice.text.toString().replaceAll(',', '.');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
            child: Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        GeneralWidgets.headerScreen("NFC-e"),
        Column(
          children: [
            mainBox(),
            SizedBox(
              height: 5,
            ),
            nfceInfoRow()
          ],
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: GeneralWidgets.baseboard(),
        ),
      ],
    )));
  }

  Widget mainBox() {
    final CurrencyTextInputFormatter _formatter =
        new CurrencyTextInputFormatter(
            decimalDigits: 2,
            locale: 'pt_BR',
            symbol: '',
            turnOffGrouping: true);

    return Container(
      width: 500,
      height: 160,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.black, width: 5),
        borderRadius: BorderRadius.all(Radius.circular(16)),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              children: [
                GeneralWidgets.inputField(productName, 'NOME DO PRODUTO:',
                    textSize: 14,
                    iWidht: 500,
                    textInputType: TextInputType.text),
                GeneralWidgets.inputFieldWithFormatter(
                    productPrice, 'PREÇO DO PRODUTO:', _formatter,
                    textSize: 14,
                    iWidht: 500,
                    textInputType: TextInputType.number),
              ],
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  GeneralWidgets.personButton(
                      textButton: 'CONFIGURAR NFCE',
                      width: (500 - 50) / 2,
                      height: 35,
                      callback: () => sendConfigurateXmlNFCe()),
                  GeneralWidgets.personButton(
                      textButton: 'ENVIAR VENDA NFCE',
                      width: (500 - 50) / 2,
                      height: 35,
                      callback: () => sendSaleNfce(),
                      isButtonEnabled: isNfceButtonEnabled),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget nfceInfoRow() {
    return Container(
      width: 500,
      height: 50,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          Container(
            width: 240,
            height: 50,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.black, width: 5),
              borderRadius: BorderRadius.all(Radius.circular(16)),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 5),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "TEMPO DE EMISSÃO:",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    emitionTime.text,
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ),
          VerticalDivider(
            thickness: 5,
          ),
          Container(
            height: 50,
            width: 240,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.black, width: 5),
              borderRadius: BorderRadius.all(Radius.circular(16)),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 5),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "NOTA N°:",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    nfceNumber.text,
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    "SÉRIE N°:",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    nfceSerie.text,
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
