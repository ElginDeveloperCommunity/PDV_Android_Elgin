import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_m8/services/service_pix4.dart';

import '../../Widgets/widgets.dart';

part './framework.dart';
part './produto.dart';

class Pix4Page extends StatefulWidget {
  @override
  _Pix4PageState createState() => _Pix4PageState();
}

class _Pix4PageState extends State<Pix4Page> {
  Pix4Service pix4serviceObj = Pix4Service();

  @override
  void initState() {
    super.initState();

    pix4serviceObj.executeStoreImage();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
          child: Column(
        children: [
          GeneralWidgets.headerScreen("PIX 4"),
          Container(
            margin: const EdgeInsets.only(top: 20.0),
            child: Row(
              children: [
                Text(
                  'QRCODE/LINK PARA OUTROS EXEMPLOS EM NOSSO GITHUB:',
                  overflow: TextOverflow.clip,
                  textAlign: TextAlign.right,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 22),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                for (Framework framework in Framework.values) ...{
                  frameworkButton(framework),
                  SizedBox(
                    width: 5,
                  )
                }
              ],
            ),
          ),
          Container(
            margin: const EdgeInsets.only(top: 10.0),
            child: Row(
              children: [
                Text(
                  'PRODUTOS:',
                  overflow: TextOverflow.clip,
                  textAlign: TextAlign.right,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 22),
                ),
              ],
            ),
          ),
          Padding(
            padding: EdgeInsets.only(top: 10.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                for (Produto produto in Produto.values
                    .sublist(0, (Produto.values.length / 2).round())) ...{
                  productButton(produto),
                  SizedBox(
                    width: 5,
                  )
                }
              ],
            ),
          ),
          Padding(
            padding: EdgeInsets.only(top: 5.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                for (Produto produto in Produto.values
                    .sublist((Produto.values.length / 2).round())) ...{
                  productButton(produto),
                  SizedBox(
                    width: 5,
                  )
                }
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 5.0),
            child: Container(
              width: 400,
              child: Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => pix4serviceObj.showShoppingList(),
                      child: Text("APRESENTAR LISTA DE COMPRAS"),
                    ),
                  )
                ],
              ),
            ),
          ),
          Container(
            width: 400,
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => pix4serviceObj.loadImagesOnPix4(),
                    child: Text("CARREGAR IMAGENS NO PIX4"),
                  ),
                )
              ],
            ),
          ),
        ],
      )),
    );
  }

  Widget frameworkButton(Framework framework) {
    return GeneralWidgets.personSelectedButton(
        isThereTopMsg: true,
        topMessage: framework.nameForButton,
        fontLabelSize: 12,
        mHeight: 80,
        mWidth: 80,
        iconSize: 45,
        onSelected: () => pix4serviceObj.showQrCodeFramework(framework),
        assetImage: framework.asset);
  }

  Widget productButton(Produto produto) {
    return GeneralWidgets.personSelectedButton(
        isThereTopMsg: true,
        topMessage: produto.nameForButton,
        nameButton: produto.price,
        fontLabelSize: 12,
        mHeight: 80,
        mWidth: 80,
        iconSize: 45,
        onSelected: () => pix4serviceObj.addProductAndShowImage(produto),
        assetImage: produto.asset);
  }
}
