import 'package:flutter/services.dart';
import 'package:flutter_m8/pages/pix4/pix4.dart';

class Pix4Service {
  final _platform = const MethodChannel('samples.flutter.elgin/ElginServices');

  Future<void> _sendFunctionToAndroid(Map<String, dynamic> args) async {
    return await _platform.invokeMethod("pix4", {"args": args});
  }

  Future<void> openDisplayConnection() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['acao'] = 'OpenDisplayConnection';

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<void> executeStoreImage() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['acao'] = 'ExecuteStoreImage';

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<void> loadImagesOnPix4() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['acao'] = 'LoadImagesOnPix4';

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<void> addProductAndShowImage(Produto produto) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['acao'] = 'AddProductAndShowImage';
    mapParam['produto'] = produto.name;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<void> showQrCodeFramework(Framework framework) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['acao'] = 'ShowQrCodeFramework';
    mapParam['framework'] = framework.name;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<void> showShoppingList() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['acao'] = 'ShowShoppingList';

    return await _sendFunctionToAndroid(mapParam);
  }
}
