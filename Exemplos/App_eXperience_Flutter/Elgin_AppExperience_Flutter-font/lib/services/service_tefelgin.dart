import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:flutter_m8/services/TEFReturn.dart';

import '../pages/tef/TefPage.dart';

class TefElgin {
  static const _platform =
      const MethodChannel('samples.flutter.elgin/ElginServices');

  static Future<String> _sendFunctionToAndroid(
      Map<String, dynamic> args) async {
    return await _platform.invokeMethod("TEF", {"args": args});
  }

  //Constante que representa um possível erro que o android jogará caso a transação não tenha ocorrido corretamente.
  static const String _ERROR = "transaction_error";

  static Future<TEFReturn?> sendOptionSale({
    required String valor,
    required String parcelas,
    required FormaPagamento formaPagamento,
    required FormaFinanciamento tipoParcelamento,
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['opcaoTef'] = TEF.ELGIN_TEF.toString();
    mapParam['acaoTef'] = Acao.VENDA.toString();
    mapParam['valor'] = valor;
    mapParam['numParcelas'] = parcelas;
    mapParam['formaPagamento'] = formaPagamento.toString();
    mapParam['formaFinanciamento'] = tipoParcelamento.toString();

    String retorno = await _sendFunctionToAndroid(mapParam);

    return retorno == _ERROR ? null : TEFReturn.fromJson(jsonDecode(retorno));
  }

  static Future<TEFReturn?> sendOptionCancel(
      {required String valor,
      required String data,
      required String nsuSitef}) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['opcaoTef'] = TEF.ELGIN_TEF.toString();
    mapParam['acaoTef'] = Acao.CANCELAMENTO.toString();
    mapParam['valor'] = valor;
    mapParam['ultimoNSU'] = nsuSitef;

    String retorno = await _sendFunctionToAndroid(mapParam);

    return retorno == _ERROR ? null : TEFReturn.fromJson(jsonDecode(retorno));
  }
}
