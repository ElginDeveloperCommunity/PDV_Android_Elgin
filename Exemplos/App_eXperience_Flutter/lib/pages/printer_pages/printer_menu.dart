import 'package:flutter/material.dart';
import 'package:flutter_m8/Utils/utils.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/components/components.dart';
import 'package:flutter_m8/pages/printer_pages/printer_barCode.dart';
import 'package:flutter_m8/pages/printer_pages/printer_image.dart';
import 'package:flutter_m8/pages/printer_pages/printer_text.dart';
import 'package:flutter_m8/services/service_printer.dart';

class PrinterMenutPage extends StatefulWidget {
  @override
  _PrinterMenutPageState createState() => _PrinterMenutPageState();
}

class _PrinterMenutPageState extends State<PrinterMenutPage> {
  TextEditingController inputIp =
      new TextEditingController(text: "192.168.0.31:9100");

  String selectedModulePrinter = "text";
  String selectedImp = "IMP. INTERNA";

  double mBoxScreenSizeW = 580;
  double mBoxScreenSizeH = 450;

  Widget? mActualScreenSelected;

  PrinterService printerService = new PrinterService();

  @override
  void initState() {
    super.initState();
    mActualScreenSelected = PrinterTextPage(
      mWidth: mBoxScreenSizeW,
      mHeight: mBoxScreenSizeH,
    );
    connectInternalImp();
  }

  onChangeModulePrinter(String selected) {
    setState(() {
      selectedModulePrinter = selected;
    });
    setState(() {
      switch (selectedModulePrinter) {
        case "text":
          mActualScreenSelected = PrinterTextPage(
            mWidth: mBoxScreenSizeW,
            mHeight: mBoxScreenSizeH,
          );
          break;
        case "barcode":
          mActualScreenSelected = PrinterBarCodePage(
            mWidth: mBoxScreenSizeW,
            mHeight: mBoxScreenSizeH,
          );
          break;
        case "image":
          mActualScreenSelected = PrinteImagePage(
            mWidth: mBoxScreenSizeW,
            mHeight: mBoxScreenSizeH,
          );
          break;
        default:
      }
    });
  }

  onChangedImp(String value) {
    if (value == "IMP. EXTERNA") {
      if (Utils.validaIpWithPort(inputIp.text)) {
        connectExternalImp();
        setState(() {
          selectedImp = "IMP. EXTERNA";
        });
      } else {
        Components.infoDialog(
            context: context, message: "Digite um IP valido.");
      }
    } else if (value == "IMP. INTERNA") {
      connectInternalImp();
      setState(() {
        selectedImp = "IMP. INTERNA";
      });
    }
  }

  getImpStatus() async {
    String result = await printerService.getStatusPrinter();
    Components.infoDialog(context: context, message: result.toUpperCase());
  }

  getGavetaStatus() async {
    String result = await printerService.getStatusGaveta();
    Components.infoDialog(context: context, message: result.toUpperCase());
  }

  sendAbrirGaveta() async {
    int result = await printerService.sendOpenGaveta();
    print("Gaveta: " + result.toString());
  }

  connectInternalImp() async {
    int result = await printerService.connectInternalImp();
    print("Internal: " + result.toString());
  }

  connectExternalImp() async {
    String ip = inputIp.text.substring(0, inputIp.text.indexOf(":"));
    String port = inputIp.text.substring(ip.length + 1);

    int result = await printerService.connectExternalImp(ip, int.parse(port));
    print("External: " + result.toString());
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
              GeneralWidgets.headerScreen("IMPRESSORA"),
              Row(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 20),
                    child: Container(
                      height: mBoxScreenSizeH - 50,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: modulesPrinter(),
                      ),
                    ),
                  ),
                  Column(
                    children: [
                      Container(
                        width: mBoxScreenSizeW,
                        child: rowExternalImp(),
                      ),
                      Container(
                        height: 350,
                        width: mBoxScreenSizeW,
                        child: boxScreen(),
                      ),
                    ],
                  ),
                ],
              ),
              GeneralWidgets.baseboard(),
            ],
          ),
        ),
      ),
    );
  }

  Widget rowExternalImp() {
    return Container(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          GeneralWidgets.radioBtn('IMP. INTERNA', selectedImp, onChangedImp),
          GeneralWidgets.radioBtn('IMP. EXTERNA', selectedImp, onChangedImp),
          GeneralWidgets.formFieldPerson(
            inputIp,
            width: 180,
            label: "IP: ",
          ),
        ],
      ),
    );
  }

  Widget boxScreen() {
    return Container(
      height: mBoxScreenSizeH,
      width: mBoxScreenSizeW,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.black, width: 3),
        borderRadius: BorderRadius.all(Radius.circular(16)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: mActualScreenSelected,
      ),
    );
  }

  Widget modulesPrinter() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        GeneralWidgets.personSelectedButton(
          nameButton: 'IMPRESSÃO\nDE TEXTO',
          assetImage: 'assets/images/printerText.png',
          mHeight: 80,
          iconSize: 40,
          mWidth: 140,
          fontLabelSize: 12,
          color: Color(0xFF0069A5),
          isSelectedBtn: selectedModulePrinter == "text",
          onSelected: () => onChangeModulePrinter("text"),
        ),
        GeneralWidgets.personSelectedButton(
          nameButton: 'IMPRESSÃO DE\nCÓDIGO DE BARRAS',
          assetImage: 'assets/images/printerBarCode.png',
          mHeight: 80,
          mWidth: 140,
          iconSize: 40,
          fontLabelSize: 12,
          color: Color(0xFF0069A5),
          isSelectedBtn: selectedModulePrinter == "barcode",
          onSelected: () => onChangeModulePrinter("barcode"),
        ),
        GeneralWidgets.personSelectedButton(
          nameButton: 'IMPRESSÃO\nDE IMAGEM',
          mHeight: 80,
          mWidth: 140,
          iconSize: 40,
          fontLabelSize: 12,
          color: Color(0xFF0069A5),
          assetImage: 'assets/images/printerImage.png',
          isSelectedBtn: selectedModulePrinter == "image",
          onSelected: () => onChangeModulePrinter("image"),
        ),
        GeneralWidgets.personSelectedButtonStatus(
          nameButton: "STATUS IMPRESSORA",
          mHeight: 45,
          mWidth: 140,
          onSelected: () => getImpStatus(),
        ),
        GeneralWidgets.personSelectedButtonStatus(
          nameButton: "STATUS GAVETA",
          mHeight: 45,
          mWidth: 140,
          onSelected: () => getGavetaStatus(),
        ),
        GeneralWidgets.personButton(
          textButton: 'ABRIR GAVETA',
          height: 35,
          width: 140,
          callback: () => sendAbrirGaveta(),
        ),
      ],
    );
  }
}
