import 'package:flutter/material.dart';
import 'package:flutter_m8/Widgets/widgets.dart';

class BarCodePage extends StatefulWidget {
  @override
  _BarCodePageState createState() => _BarCodePageState();
}

class _BarCodePageState extends State<BarCodePage> {
  var _focusNodes = List.generate(10, (index) => FocusNode());

  int focusController = 0;

  List<TextEditingController> _listInputs = List.generate(
    10,
    (index) => new TextEditingController(),
  );

  initReader() {
    if (_listInputs[0].text.isEmpty) {
      _focusNodes[0].requestFocus();
    } else {
      _focusNodes[focusController].requestFocus();
    }
  }

  clearInputs() {
    setState(() {
      _listInputs = List.generate(
        10,
        (index) => new TextEditingController(),
      );
      focusController = 0;
    });
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          height: MediaQuery.of(context).size.height,
          width: MediaQuery.of(context).size.width,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(height: 30),
              GeneralWidgets.headerScreen("CÓDIGO DE BARRAS"),
              SizedBox(height: 30),
              Container(
                width: 750,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    boxScreen(),
                    barCodesExample(),
                  ],
                ),
              ),
              SizedBox(height: 10),
              Container(
                width: 750,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    GeneralWidgets.personButton(
                      textButton: "INICIAR LEITURA",
                      height: 40,
                      width: 350,
                      callback: () => initReader(),
                    ),
                    GeneralWidgets.personButton(
                      textButton: "LIMPAR CAMPOS",
                      height: 40,
                      width: 350,
                      callback: () => clearInputs(),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 10),
              GeneralWidgets.baseboard(),
            ],
          ),
        ),
      ),
    );
  }

  Widget barCodesExample() {
    return Container(
      height: 320,
      width: 150,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            "QR CODE",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold
            ),
          ),
          Image.asset(
            'assets/images/QRCode_GithubElgin.png',
            height: 110,
          ),
          SizedBox(height: 10),
          Text(
            "EAN 13",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold
            )
          ),
          Image.asset(
            'assets/images/ean13.png',
            height: 110,
          ),
        ],
      ),
    );
  }

  Widget boxScreen() {
    return Container(
      height: 330,
      width: 570,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.black, width: 3),
        borderRadius: BorderRadius.all(Radius.circular(20)),
      ),
      child: listViewBarCodes(),
    );
  }

  Widget listViewBarCodes() {
    return ListView.builder(
      padding: EdgeInsets.all(0),
      itemCount: 10,
      itemBuilder: (context, index) {
        return elementList(index);
      },
    );
  }

  Widget elementList(int index) {
    return Padding(
      padding: const EdgeInsets.only(top: 2, left: 10),
      child: Row(
        children: [
          _listInputs[index].text.length > 0
            ? Image.asset(
                'assets/images/scannedBarCode.png',
                height: 30,
              )
            : SizedBox(
                height: 30,
                width: 30,
              ),
          SizedBox(width: 10),
          Container(
            height: 30,
            width: 300,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.black, width: 3),
              borderRadius: BorderRadius.all(Radius.circular(10)),
            ),
            child: _listInputs[index].text.length == 0 ? focusFormField(index) : Text(_listInputs[index].text),
          ),
          SizedBox(width: 10),
          _listInputs[index].text.length > 0
              ? Text(
                  "Leitura realizada com sucesso!",
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                    fontWeight: FontWeight.bold
                  ),
                )
              : Container(),
        ],
      ),
    );
  }

  Widget focusFormField(int index) {
    return TextFormField(
      controller: _listInputs[index],
      maxLines: 1,
      focusNode: _focusNodes[index],
      onEditingComplete: () {
        FocusScope.of(context).unfocus();
        Future.delayed(const Duration(milliseconds: 1000), () {
          focusController++;
          _focusNodes[focusController].requestFocus();
        });
      },
    );
  }
}
