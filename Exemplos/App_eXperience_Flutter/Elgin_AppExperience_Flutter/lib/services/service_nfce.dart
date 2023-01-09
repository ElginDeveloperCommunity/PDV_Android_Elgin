import 'package:flutter/services.dart';

enum FunctionsNfce { CONFIGURATE_XML_NFCE, SEND_SALE_NFCE }

class NfceService {
  final _platform = const MethodChannel('samples.flutter.elgin/ElginServices');

  Future<String> configurateXmlNFCE() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeNFCE'] = FunctionsNfce.CONFIGURATE_XML_NFCE.name;

    return await _platform.invokeMethod("NFCE", {"args": mapParam});
  }

  Future<String> sendSaleNFCE(
      {required String productName, required String productPrice}) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeNFCE'] = FunctionsNfce.SEND_SALE_NFCE.name;

    mapParam['productName'] = productName;
    mapParam['productPrice'] = productPrice;

    return await _platform.invokeMethod("NFCE", {"args": mapParam});
  }
}
