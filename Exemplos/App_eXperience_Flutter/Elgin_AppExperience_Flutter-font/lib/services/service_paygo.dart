import 'package:flutter/services.dart';
import 'package:flutter_m8/pages/tef/TefPage.dart';

class PayGoService {
  static const _platform =
      const MethodChannel('samples.flutter.elgin/ElginServices');

  static Future<String> _sendFunctionToAndroid(
      Map<String, dynamic> args) async {
    return await _platform.invokeMethod("TEF", {"args": args});
  }

  static Future<String> sendOptionSale({
    String valor = "10",
    int parcelas = 1,
    required FormaPagamento formaPagamento,
    required FormaFinanciamento tipoParcelamento,
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['opcaoTef'] = TEF.PAY_GO.toString();
    mapParam['acaoTef'] = Acao.VENDA.toString();
    mapParam['valor'] = valor;
    mapParam['parcelas'] = parcelas;
    mapParam['formaPagamento'] = formaPagamento.toString();
    mapParam['formaFinanciamento'] = tipoParcelamento.toString();

    return await _sendFunctionToAndroid(mapParam);
  }

  static Future<String> sendOptionCancel({
    required String valor,
    required int parcelas,
    required FormaPagamento formaPagamento,
    required FormaFinanciamento tipoParcelamento,
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['opcaoTef'] = TEF.PAY_GO.toString();
    mapParam['acaoTef'] = Acao.CANCELAMENTO.toString();
    mapParam['valor'] = valor;
    mapParam['parcelas'] = parcelas;
    mapParam['formaPagamento'] = formaPagamento.toString();
    mapParam['formaFinanciamento'] = tipoParcelamento.toString();

    return await _sendFunctionToAndroid(mapParam);
  }

  static Future<String> sendOptionConfigs() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['opcaoTef'] = TEF.PAY_GO.toString();
    mapParam['acaoTef'] = Acao.CONFIGURACAO.toString();

    return await _sendFunctionToAndroid(mapParam);
  }
}
