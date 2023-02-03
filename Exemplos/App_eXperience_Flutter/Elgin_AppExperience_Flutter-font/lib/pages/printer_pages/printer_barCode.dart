import 'package:flutter/material.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/components/components.dart';
import 'package:flutter_m8/pages/printer_pages/printer_menu.dart';
import 'package:flutter_m8/services/service_printer.dart';

class PrinterBarCodePage extends StatefulWidget {
  final double mWidth;
  final double mHeight;

  PrinterBarCodePage({this.mWidth = 200, this.mHeight = 200});
  @override
  _PrinterBarCodePageState createState() => _PrinterBarCodePageState();
}

class _PrinterBarCodePageState extends State<PrinterBarCodePage> {
  TextEditingController inputCode = new TextEditingController(text: '40170725');

  PrinterService printerService = new PrinterService();

  bool cutPaper = false;

  String alignPrint = "Esquerda";
  String heightImp = '120';
  String widthImp = '6';
  String barCodeType = 'EAN 8';

  onChangeAlign(String value) {
    setState(() {
      alignPrint = value;
    });
  }

  sendPrinterBarCode() async {
    // VALIDA ENTRADA DE TEXTO
    if (inputCode.text.isEmpty) {
      Components.infoDialog(
          context: context,
          message: "A entrada de código não pode estar vazia!");
      return;
    }
    print(barCodeType);
    print(inputCode.text);

    int result = await printerService.sendPrinterBarCode(
      barCodeType: barCodeType,
      align: alignPrint,
      text: inputCode.text,
      height: int.parse(heightImp),
      width: int.parse(widthImp),
    );
    print(result);
    //Invoca o comando de avança linha de acordo com o tipo de impressora conectada
    if(PrinterMenutPageState.selectedImp == 'IMP. INTERNA'){
      printerService.jumpLine(10);
    } else {
      printerService.jumpLine(5);
    }

    if (cutPaper) printerService.cutPaper(1);
  }

  sendPrinterQrCode() async {
    int result = await printerService.sendPrinterQrCode(
      qrSize: int.parse(widthImp),
      align: alignPrint,
      text: inputCode.text,
    );
    print(result);
    //Invoca o comando de avança linha de acordo com o tipo de impressora conectada
    if(PrinterMenutPageState.selectedImp == 'IMP. INTERNA'){
      printerService.jumpLine(10);
    } else {
      printerService.jumpLine(5);
    }

    if (cutPaper) printerService.cutPaper(1);
  }

  onChangeBarCodeType(String barCodeType) {
    String defaultValueInput = "";
    switch (barCodeType) {
      case 'EAN 8':
        defaultValueInput = '40170725';
        break;
      case 'EAN 13':
        defaultValueInput = '0123456789012';
        break;
      case 'QR_CODE':
        defaultValueInput = 'ELGIN DEVELOPERS COMMUNITY';
        break;
      case 'UPC-A':
        defaultValueInput = '123601057072';
        break;
      case 'CODE 39':
        defaultValueInput = 'CODE39';
        break;
      case 'ITF':
        defaultValueInput = '05012345678900';
        break;
      case 'CODE BAR':
        defaultValueInput = 'A3419500A';
        break;
      case 'CODE 93':
        defaultValueInput = 'CODE93';
        break;
      case 'CODE 128':
        defaultValueInput = '{C1233';
        break;
      default:
        defaultValueInput = '';
    }
    setState(() {
      inputCode.text = defaultValueInput;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          height: widget.mHeight,
          width: widget.mWidth - 20,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              SizedBox(height: 5),
              Text(
                "IMPRESSÃO DE CÓDIGO DE BARRAS",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              GeneralWidgets.inputField(
                inputCode,
                'CÓDIGO: ',
                iWidht: widget.mWidth - 20,
                textSize: 16,
              ),
              SizedBox(height: 5),
              GeneralWidgets.dropDown(
                  'TIPO DE CÓDIGO DE BARRAS: ', barCodeType, [
                'EAN 8',
                'EAN 13',
                'QR_CODE',
                'UPC-A',
                'CODE 39',
                'ITF',
                'CODE BAR',
                'CODE 93',
                'CODE 128',
              ], (String value) {
                barCodeType = value;
                onChangeBarCodeType(value);
              }),
              SizedBox(height: 5),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  "ALINHAMENTO",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              alignRadios(),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  "ESTILIZAÇÃO",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              estiloChecks(),
              SizedBox(height: 5),
              GeneralWidgets.personButton(
                textButton: 'IMPRIMIR CÓDIGO DE BARRAS',
                width: widget.mWidth,
                callback: () {
                  if (barCodeType == "QR_CODE") {
                    sendPrinterQrCode();
                  } else {
                    sendPrinterBarCode();
                  }
                },
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget alignRadios() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 165,
          child: GeneralWidgets.radioBtn('Esquerda', alignPrint, onChangeAlign),
        ),
        GeneralWidgets.radioBtn('Centralizado', alignPrint, onChangeAlign),
        Container(
          width: 160,
          child: GeneralWidgets.radioBtn('Direita', alignPrint, onChangeAlign),
        ),
      ],
    );
  }

  Widget estiloChecks() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        if (barCodeType != "QR_CODE") ...{
          GeneralWidgets.dropDown(
              'HEIGHT: ', heightImp, ['20', '60', '120', '200'],
              (String value) {
            setState(() {
              heightImp = value;
            });
          }),
        },
        if (barCodeType == "QR_CODE") ...{
          GeneralWidgets.dropDown(
              'SQUARE: ', widthImp, ['1', '2', '3', '4', '5', '6'],
              (String value) {
            setState(() {
              widthImp = value;
            });
          }),
        },
        if (barCodeType != "QR_CODE") ...{
          GeneralWidgets.dropDown(
              'WIDTH: ', widthImp, ['1', '2', '3', '4', '5', '6'],
              (String value) {
            setState(() {
              widthImp = value;
            });
          }),
        },
        GeneralWidgets.checkBox('CUT PAPER', cutPaper, (bool value) {
          setState(() {
            cutPaper = value;
          });
        }),
      ],
    );
  }
}
