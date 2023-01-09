import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_m8/Widgets/widgets.dart';
import 'package:flutter_m8/components/components.dart';
import 'package:flutter_m8/pages/Balanca.dart';
import 'package:flutter_m8/pages/Bridge.dart';
import 'package:flutter_m8/pages/CarteiraDigital.dart';
import 'package:flutter_m8/pages/NFCe.dart';
import 'package:flutter_m8/pages/pix4/pix4.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'barCodeReader.dart';
import 'printer_pages/printer_menu.dart';
import 'sat.dart';
import 'tef/TefPage.dart';

class MenuPage extends StatefulWidget {
  @override
  _MenuPageState createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  selectScreen(Widget selected) {
    Components.goToScreen(context, selected);
  }

  @override
  void initState() {
    super.initState();

    askExternalStoragePermission();
  }

  //Assinatura do methodChannel
  static const _platform = MethodChannel('samples.flutter.elgin/ElginServices');

  //Se a permissão for negada, a aplicação deve ser encerrada, uma vez que vários módulos dependem da permissão de acesso ao armazenamento
  askExternalStoragePermission() async {
    bool wasPermissionGranted =
        await _platform.invokeMethod("askExternalStoragePermission");

    if (!wasPermissionGranted) {
      Fluttertoast.showToast(
          msg:
              'É necessário conceder a permissão para as funcionalidades NFC-e e PIX 4!',
          toastLength: Toast.LENGTH_LONG,
          gravity: ToastGravity.BOTTOM,
          timeInSecForIosWeb: 1,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 16.0);
      //Encerra a aplicação
      SystemChannels.platform.invokeMethod('SystemNavigator.pop');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 150),
                child: Image.asset("assets/images/elgin_logo.png"),
              ),
            ),
            Container(
              margin: const EdgeInsets.only(bottom: 80.0),
              height: 150,
              child: Card(
                color: Color(0xffe7f6fe),
                elevation: 20,
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      moduleButton(
                          nameButton: "E1 - BRIDGE",
                          assetImage: "assets/images/elginpay_logo.png",
                          horizonalPaddingAssetImage: 10,
                          width: 110,
                          screen: BridgePage()),
                      SizedBox(
                        width: 10,
                      ),
                      moduleButton(
                          nameButton: "NFC-e",
                          assetImage: "assets/images/nfce.png",
                          horizonalPaddingAssetImage: 10,
                          width: 110,
                          screen: NFCePage()),
                      SizedBox(
                        width: 10,
                      ),
                      moduleButton(
                        nameButton: "IMPRESSORA",
                        assetImage: "assets/images/printer.png",
                        width: 110,
                        screen: PrinterMenutPage(),
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      moduleButton(
                        nameButton: "BALANÇA",
                        assetImage: "assets/images/balanca.png",
                        width: 110,
                        screen: BalancaPage(),
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      moduleButton(
                        nameButton: "TEF\n",
                        assetImage: "assets/images/msitef.png",
                        width: 110,
                        screen: SitefPage(),
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      moduleButton(
                        nameButton: "CARTEIRA\nDIGITAL",
                        assetImage: "assets/images/msitef.png",
                        width: 110,
                        screen: DigitalWalletPage(),
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      moduleButton(
                        nameButton: "SAT",
                        assetImage: "assets/images/sat.png",
                        width: 110,
                        screen: SatPage(),
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      moduleButton(
                        nameButton: "CÓDIGO DE BARRAS",
                        width: 110,
                        assetImage: "assets/images/printerBarCode.png",
                        screen: BarCodePage(),
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      moduleButton(
                          nameButton: "PIX 4",
                          assetImage: "assets/images/pix4.png",
                          horizonalPaddingAssetImage: 10,
                          width: 110,
                          screen: Pix4Page()),
                    ],
                  ),
                ),
              ),
            ),
            GeneralWidgets.baseboard(),
          ],
        ),
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
            SizedBox(
              height: 5,
            ),
            Padding(
                padding: EdgeInsets.symmetric(
                    horizontal: horizonalPaddingAssetImage),
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
            SizedBox(
              height: 5,
            )
          ],
        ),
      ),
    );
  }
}
