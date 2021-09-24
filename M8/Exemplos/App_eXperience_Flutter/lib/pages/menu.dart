import 'package:flutter/material.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/components/components.dart';
import 'package:flutter_m8/pages/Balanca.dart';
import 'package:flutter_m8/pages/CarteiraDigital.dart';

import 'barCodeReader.dart';
import 'printer_pages/printer_menu.dart';
import 'sat.dart';
import 'TEF.dart';

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
      body: Column(
        children: [
          SizedBox(height: 40),
          Image.asset("assets/images/ElginDeveloperCommunity.png", height: 130),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              moduleButton(
                nameButton: "IMPRESSORA",
                assetImage: "assets/images/printer.png",
                screen: PrinterMenutPage(),
              ),
              SizedBox(width: 10),
              Container(
                height: 130,
                width: 220,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    moduleButton(
                      nameButton: "CÓDIGO DE BARRAS",
                      assetImage: "assets/images/printerBarCode.png",
                      width: 105,
                      screen: BarCodePage(),
                    ),
                    moduleButton(
                      nameButton: "BALANÇA",
                      assetImage: "assets/images/balanca.png",
                      width: 105,
                      screen: BalancaPage(),
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                height: 130,
                width: 220,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    moduleButton(
                      nameButton: "TEF\n",
                      assetImage: "assets/images/msitef.png",
                      width: 105,
                      screen: SitefPage(),
                    ),         
                    moduleButton(
                      nameButton: "CARTEIRA\nDIGITAL",
                      assetImage: "assets/images/msitef.png",
                      width: 105,
                      screen: DigitalWalletPage(),
                    ),         
                  ],
                ),
              ),
              SizedBox(width: 10),
              moduleButton(
                nameButton: "SAT",
                assetImage: "assets/images/sat.png",
                screen: SatPage(),
              ),
            ],
          ),
          SizedBox(height: 20),
          GeneralWidgets.baseboard(),
        ],
      ),
    );
  }

  // Constroe o Widget de botões de seleção de modulo Elgin One
  // Recebe como parâmetro o Texto do Botão, Imagem e a tela de destino ao pressiona-lo
  Widget moduleButton({
    String nameButton = "",
    String assetImage = "",
    Widget? screen,
    double height = 130,
    double width = 220,
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
            Image.asset(assetImage, height: 50),
            SizedBox(height: 5,),
            Text(
              nameButton,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: Colors.black,
                fontWeight: FontWeight.bold
              ),
            ),
          ],
        ),
      ),
    );
  }
}
