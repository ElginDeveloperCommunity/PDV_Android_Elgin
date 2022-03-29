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
  PrinterMenutPageState createState() => PrinterMenutPageState();
}

class PrinterMenutPageState extends State<PrinterMenutPage> {
  TextEditingController inputIp =
      new TextEditingController(text: "192.168.0.104:9100");

  String selectedModulePrinter = "text";
  static String selectedImp = "IMP. INTERNA";

  double mBoxScreenSizeW = 580;
  double mBoxScreenSizeH = 450;

  Widget? mActualScreenSelected;

  PrinterService printerService = new PrinterService();

  //Modelos de impressora 
  static const String EXTERNAL_PRINTER_MODEL_I9 = "i9";
  static const String EXTERNAL_PRINTER_MODEL_I8 = "i8";

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

  onChangedImp(String value) async {
    //Se qualquer erro ocorrer durante a tentativa de conexão com uma impressora externa: retorne o tipo de impressão pra impressora interna
    if(value != "IMP. INTERNA"){
      List<String> externalPrinterModels = [EXTERNAL_PRINTER_MODEL_I9, EXTERNAL_PRINTER_MODEL_I8];
      String selectedModel = '';

      onExternalPrinterModelTapped(int indexOfTapped){
        const int MODEL_I9_TAPPED = 0;
        Navigator.of(context).pop();
        if(indexOfTapped == MODEL_I9_TAPPED){
          selectedModel = EXTERNAL_PRINTER_MODEL_I9;
        } else{
          selectedModel = EXTERNAL_PRINTER_MODEL_I8;
        }

      }

      await GeneralWidgets.showAlertDialogWithSelectableOptions(mainWidgetContext: context, alertTitle: 'Selecione o modelo de impressora a ser conectado', listOfOptions: externalPrinterModels, onTap: onExternalPrinterModelTapped);
      if(value == "IMP. EXTERNA - USB"){
        //Tenta a conexão por impressora externa via USB
        if(await connectExternalImpByUSB(selectedModel)){
          setState(() {
            selectedImp = 'IMP. EXTERNA - USB';
          });
        }
        else{
          Components.infoDialog(context: context, message: 'A tentativa de conexão por USB não foi bem sucedida!');
          connectInternalImp();
        }
      }
      else{
        //Valida IP
        if(Utils.validaIpWithPort(inputIp.text)){
          //Tenta a conexão por impressora externa via IP
          if(await connectExternalImpByIP(selectedModel)){
            setState(() {
              selectedImp = 'IMP. EXTERNA - IP';
            });
          }
          else{
            Components.infoDialog(context: context, message: 'A tentativa de conexão por IP não foi bem sucedida!');
            connectInternalImp();
          }
        }
        else{
          Components.infoDialog(context: context, message: "Digite um IP valido.");
          connectInternalImp();
        }

      }
    }
    else {
      connectInternalImp();
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
    setState(() {
            selectedImp = 'IMP. INTERNA';
    });
  }

  Future<bool> connectExternalImpByIP(String model) async {
    String ip = inputIp.text.substring(0, inputIp.text.indexOf(":"));
    String port = inputIp.text.substring(ip.length + 1);

    int result = await printerService.connectExternalImpByIP(model: model, ip: ip, port: int.parse(port));
    print("External: " + result.toString());
    //Retorna true se a conexão foi estabelecida com sucesso
    return result == 0;
  }

  Future<bool> connectExternalImpByUSB(String model) async {

    int result = await printerService.connectExternalImpByUSB(model: model);
    print("External: " + result.toString());
    return result == 0;
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
      child: IntrinsicWidth(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Radio<String>(
                  value: 'IMP. INTERNA',
                  groupValue: selectedImp,
                  onChanged: (String? value) => onChangedImp(value!),
                ),
                Text('IMP. INTERNA',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)
                ),
                 Radio<String>(
                  value: 'IMP. EXTERNA - USB',
                  groupValue: selectedImp,
                  onChanged: (String? value) => onChangedImp(value!),
                ),
                Text('IMP. EXTERNA - USB',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)
                ),
                Radio<String>(
                  value: 'IMP. EXTERNA - IP',
                  groupValue: selectedImp,
                  onChanged: (String? value) => onChangedImp(value!),
                ),
                Text('IMP. EXTERNA - IP',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)
                ),
              ],
            ),
            SizedBox(
              width: 170,
              child: TextFormField(
                textAlign: TextAlign.center,
                controller: inputIp,
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                keyboardType: TextInputType.text,
                decoration: InputDecoration(
                  prefixText: 'IP: ',
                  isDense: true,
                  hintStyle: TextStyle(fontSize: 14),
                  border: new OutlineInputBorder(
                    borderRadius: const BorderRadius.all(
                      const Radius.circular(10.0),
                    ),
                  ),
                  filled: false,
                  contentPadding: EdgeInsets.all(10),
                ),
              ),
            )
          ],
        ),
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
