import 'package:flutter/material.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/services/service_sat.dart';

class SatPage extends StatefulWidget {
  @override
  _SatPageState createState() => _SatPageState();
}

class _SatPageState extends State<SatPage> {
  SatService satService = new SatService();

  sendSaleSAT(String xmlSale, String codeAtivacao) async {
    String result = await satService.sendSatSale(xmlSale, codeAtivacao);
    print(result);
  }

  sendSaleCancel(String xmlCancell, String cfeNumbert, String codeAtivacao) async {
    String result = await satService.sendSatCancel(xmlCancell, cfeNumbert, codeAtivacao);
    print(result);
  }

  getOperationalStatus(String codeAtivacao) async {
    String result = await satService.getSatStatus("123456789");
    print(result);
  }

  sendAtivar() async {
    String result = await satService.sendSatActive(0, "123456789", "14200166000166", 15);
    print(result);
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
              GeneralWidgets.headerScreen("SAT"),
              SizedBox(height: 30),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  boxScreen(),
                  SizedBox(width: 40),
                  buttons(),
                ],
              ),
              GeneralWidgets.baseboard(),
            ],
          ),
        ),
      ),
    );
  }

  Widget buttons() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        GeneralWidgets.personButton(textButton: "REALIZAR VENDA", width: 200, callback: () {}),
        SizedBox(height: 10),
        GeneralWidgets.personButton(textButton: "CONSULTAR STATUS", width: 200, callback: () {}),
        SizedBox(height: 10),
        GeneralWidgets.personButton(textButton: "CANCELAMENTO", width: 200, callback: () {}),
        SizedBox(height: 10),
        GeneralWidgets.personButton(textButton: "ATIVAR", width: 200, callback: () {}),
        SizedBox(height: 10),
        GeneralWidgets.personButton(textButton: "ASSOCIAR", width: 200, callback: () {}),
      ],
    );
  }

  Widget boxScreen() {
    return Container(
      height: 370,
      width: 500,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.black, width: 3),
        borderRadius: BorderRadius.all(Radius.circular(20)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Text("RETORNO"),
      ),
    );
  }
}
