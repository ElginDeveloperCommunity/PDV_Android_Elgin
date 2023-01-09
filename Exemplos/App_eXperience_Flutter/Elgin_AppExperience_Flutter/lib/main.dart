import 'package:flutter/material.dart';
import 'package:flutter_m8/pages/menu.dart';
import 'package:flutter_m8/pages/pix4/pix4.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter M8 Elgin',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MenuPage(),
    );
  }
}
