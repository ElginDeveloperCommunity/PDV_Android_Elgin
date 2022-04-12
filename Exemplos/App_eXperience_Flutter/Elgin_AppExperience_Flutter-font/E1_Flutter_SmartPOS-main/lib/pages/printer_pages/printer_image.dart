import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_smartpos/Widgets/widgets.dart';
import 'package:flutter_smartpos/services/service_printer.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';

class PrinteImagePage extends StatefulWidget {
  final double mWidth;
  final double mHeight;
  final String selectedImp;

  PrinteImagePage(
      {required this.selectedImp, this.mWidth = 200, this.mHeight = 200});
  @override
  _PrinteImagePageState createState() => _PrinteImagePageState();
}

class _PrinteImagePageState extends State<PrinteImagePage> {
  TextEditingController inputCode = new TextEditingController();

  PrinterService printerService = new PrinterService();

  bool cutPaper = false;

  File? _imageSelected;
  final picker = ImagePicker();

  getImage() async {
    Fluttertoast.showToast(
        msg: "Selecione uma imagem com no máximo 400 pixels de largura!",
        toastLength: Toast.LENGTH_LONG,
        gravity: ToastGravity.BOTTOM,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.grey,
        textColor: Colors.white,
        fontSize: 16.0);

    final pickedFile = await picker.getImage(source: ImageSource.gallery);

    setState(() {
      if (pickedFile != null) {
        _imageSelected = File(pickedFile.path);
      } else {
        print('No image selected.');
      }
    });
  }

  // CRIA UM PATH NO DEVICE COM A IMAGEM PADRÃO(ELGIN) PARA SER IMPRESSA
  Future<File> getImageDefault() async {
    Directory tempPath = await getTemporaryDirectory();

    File file = File('${tempPath.path}/elgin_logo_default_print_image.png');

    if (file.existsSync()) {
      return file;
    } else {
      final byteData =
          await rootBundle.load('assets/images/elgin_logo_default_print_image.png');
      await file.writeAsBytes(byteData.buffer
          .asUint8List(byteData.offsetInBytes, byteData.lengthInBytes));
      return file;
    }
  }

  sendPrinterImage() async {
    File fileImage;
    // VERIFICA SE ALGUMA IMAGEM FOI SELECIONADA, CASO NÃO IMPRIME A DEFAULT
    if (_imageSelected != null) {
      fileImage = _imageSelected!;
    } else {
      fileImage = await getImageDefault();
    }
    int result = await printerService.sendPrinterImage(fileImage.path, false);
    printerService.jumpLine(10);
    if (cutPaper) printerService.cutPaper(10);
    print(result);
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
                      Text("IMPRESSÃO DE IMAGEM",
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold))
                    ],
                  ),
                  SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("PRÉ-VISUZALIZAÇÃO",
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold))
                    ],
                  ),
                  SizedBox(height: 30),
                  preVisuImage(_imageSelected),
                  SizedBox(
                    height: 10,
                  ),
                  SizedBox(height: 30),
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      GeneralWidgets.personButton(
                        textButton: 'SELECIONAR',
                        width: (MediaQuery.of(context).size.width / 2) - 10,
                        callback: () => getImage(),
                      ),
                      GeneralWidgets.personButton(
                        textButton: 'IMPRIMIR',
                        width: (MediaQuery.of(context).size.width / 2) - 10,
                        callback: () => sendPrinterImage(),
                      )
                    ],
                  ),
                ],
              ),
            ),
            GeneralWidgets.baseboard(),
          ],
        ),
      ),
    ));
  }

  Widget preVisuImage(File? imagePath) {
    return Column(
      children: [
        imagePath == null
            ? Image.asset(
                "assets/images/elgin_logo.png",
                height: 100,
                fit: BoxFit.contain,
              )
            : Image.file(
                imagePath,
                height: 100,
              )
      ],
    );
  }
}
