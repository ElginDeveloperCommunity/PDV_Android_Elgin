import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/components/components.dart';
import 'package:flutter_m8/pages/printer_pages/printer_menu.dart';
import 'package:flutter_m8/services/service_printer.dart';

class PrinterTextPage extends StatefulWidget {
  final double mWidth;
  final double mHeight;

  PrinterTextPage({this.mWidth = 200, this.mHeight = 200});

  @override
  _PrinterTextPageState createState() => _PrinterTextPageState();
}

class _PrinterTextPageState extends State<PrinterTextPage> {
  TextEditingController inputMessage =
      new TextEditingController(text: "ELGIN DEVELOPERS COMMUNITY");

  PrinterService printerService = new PrinterService();

  String alignPrint = "Esquerda";

  String fontFamily = "FONT A";
  String fontSize = "34";

  bool isNegrito = false;
  bool isItalic = false;
  bool isUnderline = false;
  bool cutPaper = false;

  onChangeAlign(String value) {
    setState(() {
      alignPrint = value;
    });
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

    //Invoca o comando de avança linha de acordo com o tipo de impressora conectada
    if(PrinterMenutPageState.selectedImp == 'IMP. INTERNA'){
      printerService.jumpLine(10);
    } else {
      printerService.jumpLine(5);
    }

    if (cutPaper) printerService.cutPaper(1);
  }

  sendPrinterNFCe() async {
    String xml = await rootBundle.loadString('assets/xml/xmlNFCe.xml');
    int result = await printerService.sendPrinterNFCe(
        xml, 1, "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES", 0);
    print(result);

    //Invoca o comando de avança linha de acordo com o tipo de impressora conectada
    if(PrinterMenutPageState.selectedImp == 'IMP. INTERNA'){
      printerService.jumpLine(10);
    } else {
      printerService.jumpLine(5);
    }

    if (cutPaper) printerService.cutPaper(1);
  }

  sendPrinterSAT() async {
    String xml = await rootBundle.loadString('assets/xml/xmlSAT.xml');
    int result = await printerService.sendPrinterSAT(xml, 0);
    print(result);

   //Invoca o comando de avança linha de acordo com o tipo de impressora conectada
    if(PrinterMenutPageState.selectedImp == 'IMP. INTERNA'){
      printerService.jumpLine(10);
    } else {
      printerService.jumpLine(5);
    }

    if (cutPaper) printerService.cutPaper(1);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          height: widget.mHeight,
          width: widget.mWidth - 20,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(height: 5),
              Text("IMPRESSÃO DE TEXTO",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              GeneralWidgets.inputField(
                inputMessage,
                'MENSAGEM: ',
                iWidht: widget.mWidth - 20,
                textSize: 16,
              ),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  "ALINHAMENTO: ",
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
                  "ESTILIZAÇÃO: ",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              dropDownsEstilo(),
              estiloChecks(),
              buttonsActionWidget(),
            ],
          ),
        ),
      ),
    );
  }

  Widget alignRadios() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Container(
          width: 165,
          child: GeneralWidgets.radioBtn('Esquerda', alignPrint, onChangeAlign),
        ),
        GeneralWidgets.radioBtn('Centralizado', alignPrint, onChangeAlign),
        Container(
          width: 165,
          child: GeneralWidgets.radioBtn('Direita', alignPrint, onChangeAlign),
        ),
      ],
    );
  }

  Widget dropDownsEstilo() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        GeneralWidgets.dropDown(
            'FONT FAMILY: ', fontFamily, ['FONT B', 'FONT A'], (String value) {
          setState(() {
            fontFamily = value;
          });
        }),
        SizedBox(width: 20),
        GeneralWidgets.dropDown(
            "FONT SIZE: ", fontSize, ["17", "34", "51", "68"], (String value) {
          setState(() {
            fontSize = value;
          });
        }),
      ],
    );
  }

  Widget estiloChecks() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Container(
          width: 165,
          child: GeneralWidgets.checkBox('NEGRITO', isNegrito, (bool value) {
            setState(() {
              isNegrito = value;
            });
          }),
        ),
        Container(
          width: 200,
          child:
              GeneralWidgets.checkBox('SUBLINHADO', isUnderline, (bool value) {
            setState(() {
              isUnderline = value;
            });
          }),
        ),
        Container(
          width: 180,
          child: GeneralWidgets.checkBox('CUT PAPER', cutPaper, (bool value) {
            setState(() {
              cutPaper = value;
            });
          }),
        ),
      ],
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
