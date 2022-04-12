import 'package:flutter/material.dart';
import 'package:flutter_smartpos/Widgets/widgets.dart';
import 'package:flutter_smartpos/components/components.dart';
import 'package:flutter_smartpos/pages/CarteiraDigital.dart';
import 'package:flutter_smartpos/pages/BarcodeScanner.dart';
import 'printer_pages/printer_menu.dart';
import 'ElginPay.dart';

class MenuPage extends StatefulWidget {
  @override
  _MenuPageState createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  selectScreen(Widget selected) {
    Components.goToScreen(context, selected);
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Image.asset("assets/images/elgin_logo.png",
                    height: 80),
              ),
              Container(
                  child: Column(
                children: [
                  moduleButton(
                    nameButton: "IMPRESSORA",
                    assetImage: "assets/images/printer.png",
                    screen: PrinterMenuPage(),
                  ),
                  SizedBox(height: 10),
                  moduleButton(
                    nameButton: "ELGIN PAY",
                    assetImage: "assets/images/elginpay_logo.png",
                    screen: ElginPayPage(),
                    paddingValue: 40
                  ),
                  SizedBox(height: 10),
                  moduleButton(
                    nameButton: "CARTEIRA\nDIGITAL",
                    assetImage: "assets/images/msitef.png",
                    screen: DigitalWalletPage(),
                  ),
                  SizedBox(height: 10),
                  moduleButton(
                    nameButton: "CÓDIGO DE BARRAS",
                    assetImage: "assets/images/printerBarCode.png",
                    screen: BarcodeScannerPage(),
                  ),
                ],
              )),
              GeneralWidgets.baseboard(),
            ],
          ),
        ),
      ),
    );
  }

  // Constroe o Widget de botões de seleção de modulo Elgin One
  // Recebe como parâmetro o Texto do Botão, Imagem e a tela de destino ao pressiona-lo
  Widget moduleButton({
    String nameButton = "",
    String assetImage = "",
    Widget? screen,
    double height = 100,
    double width = 250,
    double paddingValue = 0
  }) {
    return TextButton(
      onPressed: () => selectScreen(screen!),
      style: TextButton.styleFrom(
        padding: EdgeInsets.zero,
      ),
      child: Container(
        height: height,
        width: width,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.black, width: 3),
          borderRadius: BorderRadius.all(Radius.circular(20)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: EdgeInsets.symmetric(horizontal: paddingValue),
              child: Image.asset(assetImage, height: 50),
            ),
            SizedBox(
              height: 5,
            ),
            Text(
              nameButton,
              textAlign: TextAlign.center,
              style: TextStyle(
                  fontSize: 16,
                  color: Colors.black,
                  fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
