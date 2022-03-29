import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/pages/printer_pages/printer_menu.dart';
import 'package:flutter_m8/services/service_printer.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';

class PrinteImagePage extends StatefulWidget {
  final double mWidth;
  final double mHeight;

  PrinteImagePage({this.mWidth = 200, this.mHeight = 200});
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
      final byteData = await rootBundle.load('assets/images/elgin_logo_default_print_image.png');
      await file.writeAsBytes(byteData.buffer.asUint8List(byteData.offsetInBytes, byteData.lengthInBytes));
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
    
    int result = await printerService.sendPrinterImage(pathImage: fileImage.path);
    //Invoca o comando de avança linha de acordo com o tipo de impressora conectada
    if(PrinterMenutPageState.selectedImp == 'IMP. INTERNA'){
      printerService.jumpLine(10);
    } else {
      printerService.jumpLine(5);
    }

    if (cutPaper) printerService.cutPaper(1);
    print(result);
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
              Text(
                "IMPRESSÃO DE IMAGEM",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold
                )
              ),
              preVisuImage(_imageSelected),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  "ESTILIZAÇÃO: ",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              estiloChecks(),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  GeneralWidgets.personButton(
                    textButton: 'SELECIONAR',
                    width: widget.mWidth / 2 - 50,
                    callback: () => getImage(),
                  ),
                  GeneralWidgets.personButton(
                    textButton: 'IMPRIMIR',
                    width: widget.mWidth / 2 - 50,
                    callback: () => sendPrinterImage(),
                  )
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget preVisuImage(File? imagePath) {
    return Column(
      children: [
        Text("PRÉ - VISUALIZAÇÃO", style: TextStyle(fontSize: 15)),
        Padding(
          padding: EdgeInsets.all(10),
          child: imagePath == null
              ? Image.asset(
                  "assets/images/elgin_logo.png",
                  height: 100,
                  fit: BoxFit.contain,
                )
              : Image.file(
                  imagePath,
                  height: 100,
                ),
        )
      ],
    );
  }

  Widget estiloChecks() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        GeneralWidgets.checkBox('CUT PAPER', cutPaper, (bool value) {
          setState(() {
            cutPaper = value;
          });
        }),
      ],
    );
  }
}
