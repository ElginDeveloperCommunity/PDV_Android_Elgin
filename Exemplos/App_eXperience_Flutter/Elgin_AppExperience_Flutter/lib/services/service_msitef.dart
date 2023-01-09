import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:flutter_m8/pages/tef/TefPage.dart';
import 'package:flutter_m8/services/TEFReturn.dart';

class MSitefService {
  static const _platform =
      const MethodChannel('samples.flutter.elgin/ElginServices');

  static Future<String> _sendFunctionToAndroid(
      Map<String, dynamic> args) async {
    return await _platform.invokeMethod("TEF", {"args": args});
  }

  //Constante que representa um possível erro que o android jogará caso a transação não tenha ocorrido corretamente.
  static const String _ERROR = "transaction_error";

  static Future<TEFReturn?> sendOptionSale(
      {required String enderecoSitef,
      required String valor,
      required FormaPagamento formaPagamento,
      required FormaFinanciamento
          formaFinanciamento, //No caso de uma venda a débito não seŕa necessário passar o tipo de parcelamento..
      required String numParcelas}) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['opcaoTef'] = TEF.M_SITEF.toString();
    mapParam['acaoTef'] = Acao.VENDA.toString();
    mapParam['enderecoSitef'] = enderecoSitef;
    mapParam['valor'] = valor;
    mapParam['formaPagamento'] = formaPagamento.toString();
    mapParam['formaFinanciamento'] = formaFinanciamento.toString();
    mapParam['numParcelas'] = numParcelas;

    String retorno = await _sendFunctionToAndroid(mapParam);

    return retorno == _ERROR ? null : TEFReturn.fromJson(jsonDecode(retorno));
  }

  static Future<TEFReturn?> sendOptionCancel({
    required String enderecoSitef,
    required String valor,
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['opcaoTef'] = TEF.M_SITEF.toString();
    mapParam['acaoTef'] = Acao.CANCELAMENTO.toString();
    mapParam['enderecoSitef'] = enderecoSitef;
    mapParam['valor'] = valor;

    String retorno = await _sendFunctionToAndroid(mapParam);

    return retorno == _ERROR ? null : TEFReturn.fromJson(jsonDecode(retorno));
  }

  static Future<TEFReturn?> sendOptionConfigs({
    required String enderecoSitef,
    required String valor,
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['opcaoTef'] = TEF.M_SITEF.toString();
    mapParam['acaoTef'] = Acao.CONFIGURACAO.toString();
    mapParam['enderecoSitef'] = enderecoSitef;
    mapParam['valor'] = valor;

    String retorno = await _sendFunctionToAndroid(mapParam);

    return retorno == _ERROR ? null : TEFReturn.fromJson(jsonDecode(retorno));
  }
}
