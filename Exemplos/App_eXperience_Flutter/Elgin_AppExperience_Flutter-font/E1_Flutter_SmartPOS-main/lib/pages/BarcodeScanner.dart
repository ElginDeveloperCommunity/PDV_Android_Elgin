import 'package:flutter/material.dart';
import 'package:flutter_smartpos/Widgets/widgets.dart';
import 'package:flutter_smartpos/services/service_barcodeScanner.dart';

class BarcodeScannerPage extends StatefulWidget {
  @override
  _BarcodeScannerPageState createState() => _BarcodeScannerPageState();
}

class _BarcodeScannerPageState extends State<BarcodeScannerPage> {
  TextEditingController barcodeResult = new TextEditingController(text: '');
  TextEditingController typeOfBarcode = new TextEditingController(text: '');

  BarcodeScannerService barcodeScannerService = new BarcodeScannerService();

  barCodeRead() async {
    String result = await barcodeScannerService.initializeScanner();
    print(result);
    if (result != "error") {
      setState(() {
        List<String> codeAndType = result.split(":+-");
        print(codeAndType);
        barcodeResult.text = codeAndType[0];
        typeOfBarcode.text = codeAndType[1];
      });
    }
  }

  emptyFields() {
    setState(() {
      barcodeResult.text = "";
      typeOfBarcode.text = "";
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
              GeneralWidgets.headerScreen("CÓDIGO DE BARRAS"),
              Padding(
                padding: const EdgeInsets.all(15.0),
                child: Container(
                  height: 200,
                  width: MediaQuery.of(context).size.width,
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: Colors.black,
                      width: 2,
                    ),
                    borderRadius: BorderRadius.all(Radius.circular(30)),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            width: MediaQuery.of(context).size.width - 34,
                            height: 50,
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: Colors.black,
                                width: 2,
                              ),
                              borderRadius:
                                  BorderRadius.all(Radius.circular(30)),
                            ),
                            child: TextFormField(
                              textAlign: TextAlign.center,
                              enabled: false,
                              controller: barcodeResult,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(
                        height: 25,
                      ),
                      Row(
                        children: [
                          Container(
                            width: MediaQuery.of(context).size.width - 34,
                            height: 50,
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: Colors.black,
                                width: 2,
                              ),
                              borderRadius:
                                  BorderRadius.all(Radius.circular(30)),
                            ),
                            child: TextFormField(
                              textAlign: TextAlign.center,
                              enabled: false,
                              controller: typeOfBarcode,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              Container(
                child: Column(
                  children: [
                    GeneralWidgets.personButton(
                      textButton: 'INICIAR LEITURA',
                      width: (MediaQuery.of(context).size.width) - 30,
                      callback: () => {barCodeRead()},
                    ),
                    SizedBox(
                      height: 5,
                    ),
                    GeneralWidgets.personButton(
                      textButton: 'LIMPAR CAMPO',
                      width: (MediaQuery.of(context).size.width) - 30,
                      callback: () => {emptyFields()},
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
}
