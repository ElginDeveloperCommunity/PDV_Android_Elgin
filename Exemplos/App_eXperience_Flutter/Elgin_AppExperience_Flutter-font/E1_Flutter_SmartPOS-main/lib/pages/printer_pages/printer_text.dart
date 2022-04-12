import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_smartpos/Widgets/widgets.dart';
import 'package:flutter_smartpos/components/components.dart';
import 'package:flutter_smartpos/services/service_printer.dart';

class PrinterTextPage extends StatefulWidget {
  final double mWidth;
  final double mHeight;
  final String selectedImp;

  PrinterTextPage(
      {Key? key,
      required this.selectedImp,
      this.mWidth = 200,
      this.mHeight = 200})
      : super(key: key);

  //PrinterTextPage({this.mWidth = 200, this.mHeight = 200});

  @override
  _PrinterTextPageState createState() => _PrinterTextPageState();
}

class _PrinterTextPageState extends State<PrinterTextPage>
    with WidgetsBindingObserver {
  TextEditingController inputMessage =
      new TextEditingController(text: "ELGIN DEVELOPERS COMMUNITY");

  PrinterService printerService = new PrinterService();

  String alignPrint = "Centralizado";

  String fontFamily = "FONT A";
  String fontSize = "17";

  bool isImpExternal = true;

  bool isNegrito = false;
  bool isItalic = false;
  bool isUnderline = false;
  bool cutPaper = false;

  onChangeAlign(String value) {
    setState(() {
      alignPrint = value;
    });
  }

  @override
  void initState() {
    super.initState();
    print(widget.selectedImp);
  }

  sendPrinterText() async {
    // VALIDA ENTRADA DE TEXTO
    if (inputMessage.text.isEmpty) {
      Components.infoDialog(
          context: context,
          message: "A entrada de Texto não pode estar vazia!");
      return;
    }

    int result = await printerService.sendPrinterText(
      text: inputMessage.text,
      align: alignPrint,
      isBold: isNegrito,
      isUnderline: isUnderline,
      font: fontFamily,
      fontSize: int.parse(fontSize),
    );
    print(result);
    printerService.jumpLine(10);
    if (cutPaper) printerService.cutPaper(10);
  }

  sendPrinterNFCe() async {
    String xml = await rootBundle.loadString('assets/xml/xmlNFCe.xml');
    int result = await printerService.sendPrinterNFCe(
        xml, 1, "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES", 0);
    print(result);
    printerService.jumpLine(10);
    if (cutPaper) printerService.cutPaper(10);
  }

  sendPrinterSAT() async {
    String xml = await rootBundle.loadString('assets/xml/xmlSAT.xml');
    int result = await printerService.sendPrinterSAT(xml, 0);
    print(result);
    printerService.jumpLine(10);
    if (cutPaper) printerService.cutPaper(10);
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
                        Text("IMPRESSÃO DE TEXTO",
                            style: TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold))
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        GeneralWidgets.inputField(
                          inputMessage,
                          'MENSAGEM: ',
                          iWidht: MediaQuery.of(context).size.width - 20,
                          textSize: 16,
                        ),
                      ],
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
                    SizedBox(height: 80),
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
                    SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [dropDownFontFamily()],
                    ),
                    Row(
                      children: [dropDownFontSize()],
                    ),
                    Container(
                      width: MediaQuery.of(context).size.width,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          if (fontFamily == 'FONT A') ...{
                            GeneralWidgets.checkBox("NEGRITO", isNegrito,
                                (bool value) {
                              setState(() {
                                isNegrito = value;
                              });
                            })
                          },
                          GeneralWidgets.checkBox("SUBLINHADO", isUnderline,
                              (bool value) {
                            setState(() {
                              isUnderline = value;
                            });
                          }),
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
                    ),
                    Row(
                      children: [
                        GeneralWidgets.personButton(
                          textButton: 'IMPRIMIR TEXTO',
                          width: MediaQuery.of(context).size.width,
                          height: 35,
                          callback: () => sendPrinterText(),
                        )
                      ],
                    ),
                    SizedBox(
                      height: 5,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        GeneralWidgets.personButton(
                          textButton: 'NFCE',
                          height: 35,
                          width: (MediaQuery.of(context).size.width / 2) - 10,
                          callback: () => sendPrinterNFCe(),
                        ),
                        GeneralWidgets.personButton(
                          textButton: 'SAT',
                          height: 35,
                          width: (MediaQuery.of(context).size.width / 2) - 10,
                          callback: () => sendPrinterSAT(),
                        ),
                      ],
                    )
                  ],
                ),
              ),
              GeneralWidgets.baseboard(),
            ],
          ),
        ),
      ),
    );
  }

  Widget dropDownFontFamily() {
    return Container(
      width: MediaQuery.of(context).size.width,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            "FONT FAMILY: ",
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          GeneralWidgets.dropDown(fontFamily, ['FONT B', 'FONT A'],
              (String value) {
            setState(() {
              fontFamily = value;
              if (fontFamily == 'FONT B') {
                isNegrito = false;
              }
            });
          })
        ],
      ),
    );
  }

  Widget dropDownFontSize() {
    return Container(
      width: MediaQuery.of(context).size.width,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            "FONT SIZE: ",
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          GeneralWidgets.dropDown(fontSize, ["17", "34", "51", "68"],
              (String value) {
            setState(() {
              fontSize = value;
            });
          })
        ],
      ),
    );
  }

  Widget buttonsActionWidget() {
    return Column(
      children: [
        GeneralWidgets.personButton(
          textButton: 'IMPRIMIR TEXTO',
          width: widget.mWidth,
          height: 35,
          callback: () => sendPrinterText(),
        ),
        SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            GeneralWidgets.personButton(
              textButton: 'NFCE',
              height: 35,
              width: widget.mWidth / 2 - 30,
              callback: () => sendPrinterNFCe(),
            ),
            GeneralWidgets.personButton(
              textButton: 'SAT',
              height: 35,
              width: widget.mWidth / 2 - 30,
              callback: () => sendPrinterSAT(),
            ),
          ],
        )
      ],
    );
  }
}
