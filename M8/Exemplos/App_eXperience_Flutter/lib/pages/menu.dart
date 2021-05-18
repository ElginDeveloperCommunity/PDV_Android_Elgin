import 'package:flutter/material.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/components/components.dart';

import 'barCodeReader.dart';
import 'printer_pages/printer_menu.dart';
import 'sat.dart';
import 'TEF.dart';

class MenuPage extends StatefulWidget {
  @override
  _MenuPageState createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  // Recebe um Widget(Uma determinada Tela) e inicia a função de abrir-la
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
              SizedBox(width: 5),
              moduleButton(
                nameButton: "CÓDIGO DE BARRAS",
                assetImage: "assets/images/printerBarCode.png",
                screen: BarCodePage(),
              ),
            ],
          ),
          SizedBox(height: 5),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              moduleButton(
                nameButton: "TEF",
                assetImage: "assets/images/msitef.png",
                screen: SitefPage(),
              ),
              SizedBox(width: 5),
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
  }) {
    return TextButton(
      onPressed: () => selectScreen(screen!),
      child: Container(
        height: 130,
        width: 220,
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
