import 'package:flutter/services.dart';

class KioskModeService {
  final _platform = const MethodChannel('samples.flutter.elgin/ElginServices');

  Future<void> _sendFunctionToAndroid(Map<String, dynamic> args) async {
    return await _platform.invokeMethod("kiosk", {"args": args});
  }

  Future<void> toggleBarraNavagacao(bool isChecked) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['acao'] = 'navegacao';
    mapParam['isChecked'] = isChecked;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<void> toggleBarraStatus(bool isChecked) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['acao'] = 'status';
    mapParam['isChecked'] = isChecked;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<void> toggleBotaoPower(bool isChecked) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['acao'] = 'power';
    mapParam['isChecked'] = isChecked;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<void> fullModoKiosk() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['acao'] = 'full';

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<void> undoFullModoKiosk() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['acao'] = 'undo_full';

    return await _sendFunctionToAndroid(mapParam);
  }
}
