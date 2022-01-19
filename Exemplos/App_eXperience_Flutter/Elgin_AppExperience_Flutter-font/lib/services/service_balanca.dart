import 'package:flutter/services.dart';

class BalancaService {
  final _platform = const MethodChannel('samples.flutter.elgin/Printer');

  Future<String> _sendFunctionToAndroid(Map<String, dynamic> args) async {
    return await _platform.invokeMethod("balanca", {"args": args});
  }

  Future<String> sendConfigBalanca({
    String modelBalanca = "DP30CK",
    String protocolBalanca = "PROTOCOLO 0",
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeOption'] = "configBalanca";  
    mapParam['model'] = modelBalanca;
    mapParam['protocol'] = protocolBalanca;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendLerPeso() async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['typeOption'] = "lerPesoBalanca";
    return await _sendFunctionToAndroid(mapParam);
  }
}
