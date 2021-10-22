import 'package:flutter/material.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/services/service_balanca.dart';

class BalancaPage extends StatefulWidget {
  @override
  _BalancaPageState createState() => _BalancaPageState();
}

class _BalancaPageState extends State<BalancaPage> {
  TextEditingController valueBalanca = new TextEditingController(text: "00.00");

  String modelBalanca = "DP30CK";
  String protocolBalanca = "PROTOCOLO 0";

  BalancaService balancaService = new BalancaService();

  onChangeTypeBalanca(String value) {
    setState(() {
      modelBalanca = value;
    });
  }

  sendConfigBalanca() async {
    String result = await balancaService.sendConfigBalanca(
      modelBalanca: modelBalanca,
      protocolBalanca: protocolBalanca,
    );
    //print(result);
  }

  sendLerPeso() async {
    String result = await balancaService.sendLerPeso();
    valueBalanca.text = result;
    //print(result);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(height: 30),
            GeneralWidgets.headerScreen("BALANÇA"),
            SizedBox(height: 30),
            Container(
              height: 350,
              width: MediaQuery.of(context).size.width - 150,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Container(
                    width: 600,
                    child: Column(
                      children: [
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "VALOR BALANÇA: ",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        GeneralWidgets.formFieldPerson(
                          valueBalanca,
                          width: 600,
                          isEnable: false,
                          label: "",
                        ),
                      ],
                    ),
                  ),

                  Container(
                     width: 600,
                    child: Column(
                      children: [
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "MODELOS: ",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        typesModelsRadios(),
                      ],
                    )
                  ),

                  Container(
                     width: 600,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "PROTOCOLOS: ",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        dropDownProtocol(),
                      ],
                    )
                  ),

                  Container(
                     width: 600,
                    child: buttonsOptionBalanca(),
                  ),                                  
                ],
              ),
            ),                        
            SizedBox(height: 10),
            GeneralWidgets.baseboard(),
          ],
        ),
      ),
    );
  }

  Widget typesModelsRadios() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 200,
          child: GeneralWidgets.radioBtn(
            'DP30CK',
            modelBalanca,
            onChangeTypeBalanca,
          ),
        ),
        GeneralWidgets.radioBtn(
          'SA110',
          modelBalanca,
          onChangeTypeBalanca,
        ),
        Container(
          width: 165,
          child: GeneralWidgets.radioBtn(
            'DPSC',
            modelBalanca,
            onChangeTypeBalanca,
          ),
        ),
      ],
    );
  }

  Widget dropDownProtocol() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        GeneralWidgets.dropDown(
          '', protocolBalanca, [
            'PROTOCOLO 0',
            'PROTOCOLO 1',
            'PROTOCOLO 2',
            'PROTOCOLO 3',
            'PROTOCOLO 4',
            'PROTOCOLO 5',
            'PROTOCOLO 6',
            'PROTOCOLO 7',
          ], (String value) {
          setState(() {
            protocolBalanca = value;
          });
        }),        
      ],
    );
  }

  Widget buttonsOptionBalanca() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          children: [
            GeneralWidgets.personButton(
              textButton: "CONFIGURAR MODELO BALANÇA",
              width: 250,
              callback: () => sendConfigBalanca(),
            ),            
          ],
        ),
        SizedBox(height: 10),
        Column(
          children: [
            GeneralWidgets.personButton(
              textButton: "LER PESO",
              width: 250,
              callback: () => sendLerPeso(),
            ),            
          ],
        ),
      ],
    );
  }
}
