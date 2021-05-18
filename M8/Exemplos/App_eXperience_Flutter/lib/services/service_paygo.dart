import 'package:flutter/services.dart';

class PayGoService {
  final _platform = const MethodChannel('samples.flutter.elgin/Printer');

  Future<String> _sendFunctionToAndroid(Map<String, dynamic> args) async {
    return await _platform.invokeMethod("paygo", {"args": args});
  }

  Future<String> sendOptionSale({
    String valor = "10",
    int parcelas = 1,
    String formaPagamento = "Crédito",
    String tipoParcelamento = "Avista",
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeOption'] = "VENDA";
    mapParam['valor'] = valor;
    mapParam['parcelas'] = parcelas;
    mapParam['formaPagamento'] = formaPagamento;
    mapParam['tipoParcelamento'] = tipoParcelamento;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendOptionCancel({
    String valor = "10",
    int parcelas = 1,
    String formaPagamento = "Crédito",
    String tipoParcelamento = "Avista",
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeOption'] = "CANCELAMENTO";
    mapParam['valor'] = valor;
    mapParam['parcelas'] = parcelas;
    mapParam['formaPagamento'] = formaPagamento;
    mapParam['tipoParcelamento'] = tipoParcelamento;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> sendOptionConfigs() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeOption'] = "ADMINISTRATIVA";

    return await _sendFunctionToAndroid(mapParam);
  }
}
