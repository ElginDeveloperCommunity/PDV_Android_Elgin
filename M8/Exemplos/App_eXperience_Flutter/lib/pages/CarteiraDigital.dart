import 'dart:math';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/components/components.dart';
import 'package:flutter_m8/services/service_printer.dart';
import 'package:flutter_m8/services/service_shipay.dart';

import 'dart:convert';

class DigitalWalletPage extends StatefulWidget {
  @override
  _SitefPageState createState() => _SitefPageState();
}

class _SitefPageState extends State<DigitalWalletPage> {
  TextEditingController inputValue = new TextEditingController(text: "19.99");

  String selectedTefType = "Shipay";
  String selectedWalletType = "shipay-pagador";
  PrinterService printerService = new PrinterService();

  ShipayService shipayService = new ShipayService();
  String accessTokenShipay = '';
  String statusSaleShipay = '';
  String orderIDShipay = '';
  String valueLastSale = '';
  String qrCodeViaClientBase64Shipay = '';
  String dateLastSaleShipay = '';
  String walletLastSaleShipay = '';

  List<dynamic> wallets = [];

  @override
  void initState() {
    super.initState();
    printerService.connectInternalImp().then((value) => print(value));
    authenticationShipay();
  }

  onChangeTypeTefMethod(String value) {
    setState(() => selectedTefType = value);
  }

  onChangeTypeWallet(String value) {
    setState(() => selectedWalletType = value);
  }

  startActionTEF(String function) {
    if (inputValue.text.isEmpty || double.parse(inputValue.text) <= 0) {
      Components.infoDialog(
        context: context,
        message: "Valor da transação menor que 0 ou vazio!",
      );
    } else {
      if (selectedTefType == "Shipay") {
        if (function == "SALE") {
          sendParamsOrderShipay(inputValue.text);
        } else if (function == "CANCEL") {
          sendParamsDeleteOrderShipay();
        }
      }
    }
  }

  authenticationShipay() async {
    final json = await shipayService.authentication();
    accessTokenShipay = json['access_token'];

    print(json['access_token']);
    getWallets();
  }

  getWallets() async {
    final json = await shipayService.getWallets(token: accessTokenShipay);
    setState(() {
      wallets = json['wallets'].map((e) => e["name"]).toList();
    });
  }

  sendParamsOrderShipay(String value) async {
    statusSaleShipay = 'Pendente';
    valueLastSale = value;
    String orderRef = new Random().nextInt(9999999).toString();

    final json = await shipayService.sendOrder(
      orderRef: orderRef,
      wallet: selectedWalletType,
      total: double.parse(inputValue.text),
      token: accessTokenShipay,
    );

    orderIDShipay = json['order_id'];

    setState(() {
      String returnQrCodeBase64 = json['qr_code'];
      var returnQrCodeBase64Split =
          returnQrCodeBase64.split('data:image/png;base64,');
      qrCodeViaClientBase64Shipay = returnQrCodeBase64Split[1];
    });

    printerService.printerCupomTEF(
      qrCodeViaClientBase64Shipay,
    );

    printerService.jumpLine(10);
    printerService.cutPaper(10);
    dateLastSaleShipay = formatCurrentTime();
    walletLastSaleShipay = json['wallet'];
  }

  sendParamsDeleteOrderShipay() async {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: new Text("Alerta"),
          content: new Text("Deseja cancelar última venda?"),
          actions: <Widget>[
            new TextButton(
              child: new Text("Não"),
              onPressed: () async {
                Navigator.of(context).pop();
              },
            ),
            new TextButton(
              child: new Text("Sim"),
              onPressed: () async {
                final json = await shipayService.deleteOrder(
                  orderId: orderIDShipay,
                  accessToken: accessTokenShipay,
                );
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  getStatusOrder() async {
    final json = await shipayService.getStatusOrder(
      orderId: orderIDShipay,
      accessToken: accessTokenShipay,
    );

    String actualStatus = '';

    print(json['status']);

    if (json['status'] == 'approved') {
      actualStatus = "Aprovado";
    } else if (json['status'] == 'expired') {
      actualStatus = "Expirado";
    } else if (json['status'] == 'cancelled') {
      actualStatus = "Cancelado";
    } else if (json['status'] == 'refunded') {
      actualStatus = "Devolvido";
    } else if (json['status'] == 'pending') {
      actualStatus = "Pendente";
    } else {
      actualStatus = "Desconhecido";
    }

    setState(() {
      statusSaleShipay = actualStatus;
      valueLastSale = json['total_order'].toString();
    });

    print(json);
  }

  formatCurrentTime() {
    DateTime now = DateTime.now();
    return '${now.day}/${now.month}/${now.year} às ${now.hour}:${now.minute}:${now.second}';
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
              GeneralWidgets.headerScreen("CARTEIRA DIGITAL"),
              Row(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 40),
                    child: fieldsDigitalWallets(),
                  ),
                  SizedBox(width: 30),
                  boxScreen(),
                ],
              ),
              GeneralWidgets.baseboard(),
            ],
          ),
        ),
      ),
    );
  }

  Widget qrCodeBase64Shipay() {
    if (qrCodeViaClientBase64Shipay == "") return new Container();

    Uint8List bytes = Base64Codec().decode(qrCodeViaClientBase64Shipay);
    print(statusSaleShipay);

    return new Column(children: [
      Image.memory(bytes, fit: BoxFit.contain, width: 250, height: 250),
      SizedBox(height: 10),
      if (statusSaleShipay != '') ...{
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Dados da Venda',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                Text('Valor:', style: TextStyle(fontWeight: FontWeight.bold)),
                Text('Data:', style: TextStyle(fontWeight: FontWeight.bold)),
                Text('Status da Venda:',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                Text('Wallet:', style: TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(''),
                Text('R\$ $valueLastSale'),
                Text('$dateLastSaleShipay'),
                Text('$statusSaleShipay'),
                Text('$walletLastSaleShipay'),
              ],
            )
          ],
        ),
      },
    ]);
  }

  Widget boxScreen() {
    return Container(
      height: 400,
      width: 350,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.black, width: 3),
        borderRadius: BorderRadius.all(Radius.circular(20)),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(left: 15),
          child: Column(
            children: [
              if (selectedTefType == "Shipay" &&
                  qrCodeViaClientBase64Shipay != "") ...{
                qrCodeBase64Shipay(),
              }
            ],
          ),
        ),
      ),
    );
  }

  Widget fieldsDigitalWallets() {
    return Container(
      height: 410,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          typeOfTefMethodWidget(selectedTefType),
          if (wallets != []) _buildColumn(wallets),
          GeneralWidgets.inputField(
            inputValue,
            'VALOR:  ',
            textSize: 14,
            iWidht: 350,
            textInputType: TextInputType.number,
          ),
          SizedBox(height: 20),
          GeneralWidgets.personButton(
            width: 350,
            textButton: "ENVIAR TRANSAÇÃO",
            callback: () => startActionTEF("SALE"),
          ),
          SizedBox(height: 10),
          GeneralWidgets.personButton(
            width: 350,
            textButton: "CANCELAR TRANSAÇÃO",
            callback: () => startActionTEF("CANCEL"),
          ),
          SizedBox(height: 10),
          GeneralWidgets.personButton(
            width: 350,
            textButton: "STATUS DA VENDA",
            callback: () => getStatusOrder(),
          ),
        ],
      ),
    );
  }

  Widget typeOfTefMethodWidget(String selectedTefMethod) {
    return Row(
      children: [
        GeneralWidgets.personSelectedButton(
          nameButton: 'Shipay',
          fontLabelSize: 14,
          mWidth: 70,
          mHeight: 30,
          isSelectedBtn: selectedTefMethod == 'Shipay',
          onSelected: () => {
            authenticationShipay(),
            onChangeTypeTefMethod('Shipay'),
          },
        ),
      ],
    );
  }

  Widget _buildColumn(List<dynamic> wallets) {
    var textList = wallets
        .map<TextButton>((s) => TextButton(
              onPressed: () => onChangeTypeWallet(s),
              style: TextButton.styleFrom(
                padding: EdgeInsets.zero,
              ),
              child: Container(
                margin: EdgeInsets.all(0),
                padding: EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  border: Border.all(
                    color:
                        selectedWalletType == s ? Colors.green : Colors.black,
                    width: 3,
                  ),
                  borderRadius: BorderRadius.all(Radius.circular(15)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      s,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          fontSize: 14,
                          color: Colors.black,
                          fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ))
        .toList();

    // use that list however you want!
    return Row(children: textList);
  }
}
