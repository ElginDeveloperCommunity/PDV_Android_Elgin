import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:flutter_m8/Struct/enums.dart';
import 'package:flutter_m8/services/services_tef/siteFormat.dart';
import 'package:flutter_m8/services/services_tef/sitefReturn.dart';

//* CLASSE QUE CONTÉM OS VALORES(INPUT) QUE SERÃO ENVIADOS PARA O SITEF
class SitefEntrys {
  String value = "2000";
  int numberInstallments = 0;
  String ip = "192.168.0.14";
  String paymentMethod = "Crédito";
  String installmentsMethod = "Adm";
  SitefEntrys();
}

//* CLASSE PRINCIPAL DO SERVICE SITEF
// FORMATA AS ENTRADAS [SitefEntrys] PARA SEREM ENVIADAS PARA O SITEF
// AO RETORNAR VALORES DO SITEF VERIFICA SE HOUVE ERRO NA TRANSACAO
class SitefController {
  final _platform = const MethodChannel('samples.flutter.elgin/Printer');
  SitefEntrys entrys = new SitefEntrys();
  SitefFormat _sitefFormat = new SitefFormat();

  // ENVIA OS VALORES PARA O METHOD CHANNEL - ANDROID
  Future<String> _sendFunctionToAndroid(String method, Map<String, dynamic> args) async {
    return await _platform.invokeMethod(method, {"args": args});
  }

  // FORMATA E ENVIA OS VALORES PARA O SITEF
  Future<SitefReturn> sendParamsSitef({required FunctionSitef functionSitef}) async {
    // [formatSitefEntrysToJsonf()] FORMATA OS VALORES DAS ENTRADAS DO USUARIO
    // PARA ENVIAR PARA O SITEF
    var jsonSitef = _sitefFormat.formatSitefEntrysToJsonf(
      mSitefEntrys: entrys,
      mFunctionSitef: functionSitef,
    );

    // ENVIA OS VALORES FORMATADOS PARA O SITEF E AGUARDA O RETORNO
    String resultJson = await _sendFunctionToAndroid("mSitef", jsonSitef);

    // DESSERIALIZA O RETORNO(JSON) EM UM CLASSE [SitefReturn]
    SitefReturn sitefReturn = SitefReturn.fromJson(jsonDecode(resultJson));

    // VERIFICA SE HOUVE UM ERRO NO RETORNO DA TRANSACAO
    // SE O CODIGO DE RETORNO É NEGATIVO OU SE NAO HA CODIGO DE AUTORIZACAO
    if (int.parse(sitefReturn.cODRESP) < 0 && sitefReturn.cODAUTORIZACAO.isEmpty) {
      throw 'Transação Com Erro';
    }

    // SE A TRANSACAO OCORREU COM SUCESSO RETORNA UM OBJETO [SitefReturn]
    return sitefReturn;
  }
}
