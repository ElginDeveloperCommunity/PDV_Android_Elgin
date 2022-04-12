import 'package:flutter/material.dart';
import 'package:flutter_smartpos/Utils/utils.dart';
import 'package:flutter_smartpos/Widgets/widgets.dart';
import 'package:flutter_smartpos/components/components.dart';
import 'package:flutter_smartpos/pages/printer_pages/printer_barCode.dart';
import 'package:flutter_smartpos/pages/printer_pages/printer_image.dart';
import 'package:flutter_smartpos/pages/printer_pages/printer_text.dart';
import 'package:flutter_smartpos/services/service_printer.dart';

class PrinterMenuPage extends StatefulWidget {
  @override
  _PrinterMenuPageState createState() => _PrinterMenuPageState();
}

class _PrinterMenuPageState extends State<PrinterMenuPage>
    with WidgetsBindingObserver {
  TextEditingController inputIp =
      new TextEditingController(text: "192.168.0.31:9100");

  @mustCallSuper
  @protected
  void dispose() {
    WidgetsBinding.instance?.removeObserver(this);

    print('dispose called.............');
    super.dispose();
  }

  String selectedModulePrinter = "text";
  String selectedImp = "IMP. INTERNA";

  double mBoxScreenSizeW = 580;
  double mBoxScreenSizeH = 450;

  Widget? mActualScreenSelected;

  PrinterService printerService = new PrinterService();

  @override
  void initState() {
    super.initState();

    connectInternalImp();
  }

  selectScreen(Widget selected) {
    Components.goToScreen(context, selected);
  }

  onChangeModulePrinter(String selected) {
    setState(() {
      selectedModulePrinter = selected;
    });
    setState(() {
      switch (selectedModulePrinter) {
        case "text":
          mActualScreenSelected = PrinterTextPage(
            selectedImp: this.selectedImp,
            mWidth: mBoxScreenSizeW,
            mHeight: mBoxScreenSizeH,
          );
          break;
        case "barcode":
          mActualScreenSelected = PrinterBarCodePage(
            selectedImp: this.selectedImp,
            mWidth: mBoxScreenSizeW,
            mHeight: mBoxScreenSizeH,
          );
          break;
        case "image":
          mActualScreenSelected = PrinteImagePage(
            selectedImp: this.selectedImp,
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
      body: SafeArea(
        child: Container(
          height: MediaQuery.of(context).size.height,
          width: MediaQuery.of(context).size.width,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              GeneralWidgets.headerScreen("IMPRESSORA"),
              Container(
                child: Column(
                  children: [
                    rowExternalImp(),
                    modulesPrinter(),
                  ],
                ),
              ),
              Container(
                child: Column(
                  children: [GeneralWidgets.baseboard()],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget rowExternalImp() {
    return Container(
      child: Column(
        children: [
          Container(
              child: Row(
            children: [
              GeneralWidgets.radioBtn(
                  'IMP. INTERNA', selectedImp, onChangedImp),
              GeneralWidgets.radioBtn(
                  'IMP. EXTERNA', selectedImp, onChangedImp),
            ],
          )),
          GeneralWidgets.formFieldPerson(
            inputIp,
            width: 250,
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
    return Container(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          GeneralWidgets.personSelectedButton(
            nameButton: 'IMPRESSÃO\nDE TEXTO',
            assetImage: 'assets/images/printerText.png',
            mHeight: 90,
            iconSize: 40,
            mWidth: 250,
            fontLabelSize: 12,
            onSelected: () => selectScreen(PrinterTextPage(
              selectedImp: this.selectedImp,
            )),
          ),
          GeneralWidgets.personSelectedButton(
            nameButton: 'IMPRESSÃO DE\nCÓDIGO DE BARRAS',
            assetImage: 'assets/images/printerBarCode.png',
            mHeight: 90,
            mWidth: 250,
            iconSize: 40,
            fontLabelSize: 12,
            onSelected: () => selectScreen(PrinterBarCodePage(
              selectedImp: this.selectedImp,
            )),
          ),
          GeneralWidgets.personSelectedButton(
            nameButton: 'IMPRESSÃO\nDE IMAGEM',
            mHeight: 90,
            mWidth: 250,
            iconSize: 40,
            fontLabelSize: 12,
            assetImage: 'assets/images/printerImage.png',
            onSelected: () => selectScreen(PrinteImagePage(
              selectedImp: this.selectedImp,
            )),
          ),
          GeneralWidgets.personSelectedButtonStatus(
            nameButton: "STATUS IMPRESSORA",
            mHeight: 45,
            mWidth: 250,
            onSelected: () => getImpStatus(),
          ),
          GeneralWidgets.personSelectedButtonStatus(
            nameButton: "STATUS GAVETA",
            mHeight: 45,
            mWidth: 250,
            onSelected: () => getGavetaStatus(),
          ),
          GeneralWidgets.personButton(
            textButton: 'ABRIR GAVETA',
            height: 35,
            width: 250,
            callback: () => sendAbrirGaveta(),
          ),
        ],
      ),
    );
  }
}
