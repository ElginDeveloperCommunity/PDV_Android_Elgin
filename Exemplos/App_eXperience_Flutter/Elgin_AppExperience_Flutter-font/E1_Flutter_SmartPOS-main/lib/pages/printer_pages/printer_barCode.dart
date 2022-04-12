import 'package:flutter/material.dart';
import 'package:flutter_smartpos/Widgets/widgets.dart';
import 'package:flutter_smartpos/components/components.dart';
import 'package:flutter_smartpos/services/service_printer.dart';

class PrinterBarCodePage extends StatefulWidget {
  final double mWidth;
  final double mHeight;
  final String selectedImp;

  PrinterBarCodePage(
      {required this.selectedImp, this.mWidth = 200, this.mHeight = 200});
  @override
  _PrinterBarCodePageState createState() => _PrinterBarCodePageState();
}

class _PrinterBarCodePageState extends State<PrinterBarCodePage> {
  TextEditingController inputCode = new TextEditingController(text: '40170725');

  PrinterService printerService = new PrinterService();

  bool cutPaper = false;

  String alignPrint = "Centralizado";
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
    printerService.jumpLine(10);
    if (cutPaper) printerService.cutPaper(10);
  }

  sendPrinterQrCode() async {
    int result = await printerService.sendPrinterQrCode(
      qrSize: int.parse(widthImp),
      align: alignPrint,
      text: inputCode.text,
    );
    print(result);
    printerService.jumpLine(10);
    if (cutPaper) printerService.cutPaper(10);
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
      body: SafeArea(
        child: Container(
          height: MediaQuery.of(context).size.height,
          width: MediaQuery.of(context).size.width,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              GeneralWidgets.headerScreen("IMPRESSORA"),
              Container(
                height: 520,
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text("IMPRESSÃO DE CÓDIGO DE BARRAS",
                            style: TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold))
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        GeneralWidgets.inputField(
                          inputCode,
                          'CÓDIGO: ',
                          iWidht: MediaQuery.of(context).size.width - 120,
                          textSize: 16,
                        ),
                      ],
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [dropDownBarcodeType()],
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Text(
                          "ALINHAMENTO: ",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        GeneralWidgets.radioButton(
                            'Esquerda', alignPrint, onChangeAlign),
                        GeneralWidgets.radioButton(
                            'Centralizado', alignPrint, onChangeAlign),
                        GeneralWidgets.radioButton(
                            'Direita', alignPrint, onChangeAlign)
                      ],
                    ),
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Text(
                          "ESTILIZAÇÃO: ",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [dropDownWidth()],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [dropDownHeight()],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        if (widget.selectedImp == "IMP. EXTERNA") ...{
                          GeneralWidgets.checkBox("CUT PAPER", cutPaper,
                              (bool value) {
                            setState(() {
                              cutPaper = value;
                            });
                          })
                        }
                      ],
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Row(
                      children: [
                        GeneralWidgets.personButton(
                          textButton: 'IMPRIMIR CÓDIGO DE BARRAS',
                          width: MediaQuery.of(context).size.width,
                          callback: () {
                            if (barCodeType == "QR_CODE") {
                              sendPrinterQrCode();
                            } else {
                              sendPrinterBarCode();
                            }
                          },
                        )
                      ],
                    )
                  ],
                ),
              ),
              GeneralWidgets.baseboard()
            ],
          ),
        ),
      ),
    );
  }

  Widget alignRadios() {
    return Column(
      children: [
        GeneralWidgets.radioBtn('Esquerda', alignPrint, onChangeAlign),
        GeneralWidgets.radioBtn('Centralizado', alignPrint, onChangeAlign),
        GeneralWidgets.radioBtn('Direita', alignPrint, onChangeAlign),
      ],
    );
  }

  Widget dropDownBarcodeType() {
    return Container(
      width: MediaQuery.of(context).size.width,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            "TIPO DE CÓDIGO DE BARRAS: ",
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          GeneralWidgets.dropDown(barCodeType, [
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
            setState(() {
              barCodeType = value;
            });
            onChangeBarCodeType(value);
          })
        ],
      ),
    );
  }

  Widget dropDownWidth() {
    return Container(
      width: MediaQuery.of(context).size.width,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            "WIDTH: ",
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          GeneralWidgets.dropDown(widthImp, ['1', '2', '3', '4', '5', '6'],
              (String value) {
            setState(() {
              widthImp = value;
            });
          })
        ],
      ),
    );
  }

  Widget dropDownHeight() {
    return Container(
      width: MediaQuery.of(context).size.width,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            "HEIGHT: ",
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          GeneralWidgets.dropDown(heightImp, ['20', '60', '120', '200'],
              (String value) {
            setState(() {
              heightImp = value;
            });
          })
        ],
      ),
    );
  }
  // Widget estiloChecks() {
  // return Row(
  // mainAxisAlignment: MainAxisAlignment.spaceAround,
  //     children: [
  //     if (barCodeType != "QR_CODE") ...{
  //    GeneralWidgets.dropDown(
  //      'HEIGHT: ', heightImp, ['20', '60', '120', '200'],
  //       (String value) {
  //       setState(() {
  //       heightImp = value;
  //      });
  //    }),
  //  },
  //   GeneralWidgets.dropDown(
  //       'WIDTH: ', widthImp, ['1', '2', '3', '4', '5', '6'],
  //        (String value) {
  //     setState(() {
  //         widthImp = value;
  //     });
  //  }),
  //     GeneralWidgets.checkBox('CUT PAPER', cutPaper, (bool value) {
  //       setState(() {
  //        cutPaper = value;
  //    });
  //   }),
  // ],
  // );
//  }
//}
}
