import 'package:flutter/material.dart';

class Components extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }

  static goToScreen(BuildContext context, Widget screen) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => screen),
    );
  }

  static void infoDialog({required BuildContext context, required String message}) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: new Text("Alerta"),
          content: new Text(message),
          actions: <Widget>[
            new TextButton(
              child: new Text("Ok"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}
