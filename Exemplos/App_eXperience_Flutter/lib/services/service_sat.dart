import 'dart:math';

import 'package:flutter/services.dart';

class SatService {
  final _platform = const MethodChannel('samples.flutter.elgin/Printer');

  Future<String> _sendFunctionToAndroid(Map<String, dynamic> args) async {
    return await _platform.invokeMethod("sat", {"args": args});
  }

  Future<String> sendSatActive({
    required int subComando,
    required String codeAtivacao,
    required String cnpj,
    required int cUF,
  }) async {

    Map<String, dynamic> mapParam = new Map();

    mapParam['numSessao'] = Random().nextInt(99999);
    mapParam['subComando'] = subComando;
    mapParam['codeAtivacao'] = codeAtivacao;
    mapParam['cnpj'] = cnpj;
    mapParam['cUF'] = cUF;
    mapParam['typeSatCommand'] = "ativarSat";

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendSatAssociar({
    required String codeAtivacao,
    required String cnpjSh,
    required String assinaturaAC,
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['numSessao'] = Random().nextInt(99999);
    mapParam['codeAtivacao'] = codeAtivacao;
    mapParam['cnpjSh'] = cnpjSh;
    mapParam['assinaturaAC'] = assinaturaAC;
    mapParam['typeSatCommand'] = "associarSat";

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendConsultarSAT() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['numSessao'] = Random().nextInt(99999);
    mapParam['typeSatCommand'] = "consultarSat";

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendStatusOperacionalSAT({
    required String codeAtivacao,
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['numSessao'] = Random().nextInt(99999);
    mapParam['codeAtivacao'] = codeAtivacao;
    mapParam['typeSatCommand'] = "statusOperacionalSat";

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendEnviarVendaSAT({
    required String codeAtivacao,
    required String xmlSale
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['numSessao'] = Random().nextInt(99999);
    mapParam['codeAtivacao'] = codeAtivacao;
    mapParam['xmlSale'] = xmlSale;
    mapParam['typeSatCommand'] = "enviarVendaSat";

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendCancelarVendaSAT({
    required String xmlCancelamento,
    required String cFeNumber,
    required String codeAtivacao,
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['numSessao'] = Random().nextInt(99999);
    mapParam['codeAtivacao'] = codeAtivacao;    
    mapParam['cFeNumber'] = cFeNumber;
    mapParam['xmlCancelamento'] = xmlCancelamento;
    mapParam['typeSatCommand'] = "cancelarVendaSat";

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendExtrairLogSAT({
    required String codeAtivacao,
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['numSessao'] = Random().nextInt(99999);
    mapParam['codeAtivacao'] = codeAtivacao;
    mapParam['typeSatCommand'] = "extrairLogSat";

    return await _sendFunctionToAndroid(mapParam);
  }
}
