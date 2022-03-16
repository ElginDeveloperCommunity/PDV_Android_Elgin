import 'package:flutter/material.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/components/components.dart';
import 'package:flutter_m8/pages/Balanca.dart';
import 'package:flutter_m8/pages/Bridge.dart';
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
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          
          SizedBox(height: 20,),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 150),
            child:  Image.asset("assets/images/elgin_logo.png"),
          ),
          Column(
            children: [
              Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                moduleButton(
                  nameButton: "E1 - BRIDGE",
                  assetImage: "assets/images/elginpay_logo.png",
                  horizonalPaddingAssetImage: 10,
                  screen: BridgePage()
                ),
                SizedBox(width: 10),
                Container(
                  height: 130,
                  width: 230,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      moduleButton(
                        nameButton: "IMPRESSORA",
                        assetImage: "assets/images/printer.png",
                        width: 110,
                        screen: PrinterMenutPage(),
                      ),
                      moduleButton(
                        nameButton: "BALANÇA",
                        assetImage: "assets/images/balanca.png",
                        width: 110,
                        screen: BalancaPage(),
                      ),
                    ],
                  ),
                ),

              ],
              ),
              SizedBox(height: 10,),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    height: 130,
                    width: 470,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        moduleButton(
                          nameButton: "TEF\n",
                          assetImage: "assets/images/msitef.png",
                          width: 110,
                          screen: SitefPage(),
                        ),
                        SizedBox(width: 10,),
                        moduleButton(
                          nameButton: "CARTEIRA\nDIGITAL",
                          assetImage: "assets/images/msitef.png",
                          width: 110,
                          screen: DigitalWalletPage(),
                        ),
                        SizedBox(width: 10,),
                        moduleButton(
                          nameButton: "SAT",
                          assetImage: "assets/images/sat.png",
                          width: 110,
                          screen: SatPage(),
                        ),
                        SizedBox(width: 10,),
                        moduleButton(
                          nameButton: "CÓDIGO DE BARRAS",
                          width: 110,
                          assetImage: "assets/images/printerBarCode.png",
                          screen: BarCodePage(),
                        ),

                      ],
                    ),
                  ),
                  
                  
                ],
              ),
         
            ],
          ),
          
          GeneralWidgets.baseboard(),
          SizedBox(height: 10),
        ],
      ),
    );
  }

  // Constroe o Widget de botões de seleção de modulo Elgin One
  // Recebe como parâmetro o Texto do Botão, Imagem e a tela de destino ao pressiona-lo
  Widget moduleButton({
    required String nameButton,
    required String assetImage,
    double horizonalPaddingAssetImage = 0, 
    Widget? screen,
    double height = 130,
    double width = 230,
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
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            SizedBox(height: 5,),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: horizonalPaddingAssetImage),
              child: Image.asset(assetImage, height: 50)),
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
            SizedBox(height: 5,)
          ],
        ),
      ),
    );
  }
}
