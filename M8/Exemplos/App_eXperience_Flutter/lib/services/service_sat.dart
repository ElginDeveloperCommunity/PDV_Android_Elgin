import 'dart:math';

import 'package:flutter/services.dart';

class SatService {
  final _platform = const MethodChannel('samples.flutter.elgin/Printer');

  Future<String> _sendFunctionToAndroid(Map<String, dynamic> args) async {
    return await _platform.invokeMethod("sat", {"args": args});
  }

  Future<String> sendSatActive(int subCmd, String codeAtivacao, String cnpj, int cUF) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['numSess'] = Random().nextInt(99999);
    mapParam['subCmd'] = subCmd;
    mapParam['codeAtivacao'] = codeAtivacao;
    mapParam['cnpj'] = cnpj;
    mapParam['cUF'] = cUF;
    mapParam['typeSatComand'] = "satAtivar";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendSatAssociar(String codeAtivacao, String cnpjSh, int assinaturaAC) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['numSess'] = Random().nextInt(99999);
    mapParam['codeAtivacao'] = codeAtivacao;
    mapParam['cnpjSh'] = cnpjSh;
    mapParam['assinaturaAC'] = assinaturaAC;
    mapParam['typeSatComand'] = "satAssociar";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendSatSale(String xmlSale, String codeAtivacao) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['xmlSale'] = xmlSale;
    mapParam['codeAtivacao'] = codeAtivacao;
    mapParam['typeSatComand'] = "satSale";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendSatCancel(String xmlCancelamento, String cFeNumber, String codeAtivacao) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['xmlCancelamento'] = xmlCancelamento;
    mapParam['cFeNumber'] = cFeNumber;
    mapParam['codeAtivacao'] = codeAtivacao;
    mapParam['typeSatComand'] = "satCancel";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> getSatStatus(String codeAtivacao) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['codeAtivacao'] = codeAtivacao;
    mapParam['typeSatComand'] = "satSatus";
    return await _sendFunctionToAndroid(mapParam);
  }
}
