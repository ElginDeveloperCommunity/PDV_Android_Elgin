import 'package:flutter/services.dart';

//Funções ElginPay
enum FunctionsElginPay {
  INICIA_VENDA_DEBITO,
  INICIA_VENDA_CREDITO,
  INICIA_CANCELAMENTO_VENDA,
  INICIA_OPERACAO_ADMINISTRATIVA,
  SET_CUSTOM_LAYOUT_ON,
  SET_CUSTOM_LAYOUT_OFF
}

class ElginpayService {
  final _platform = const MethodChannel('samples.flutter.elgin/ElginServices');

  setHandler(_methodCallHandler) async {
    _platform.setMethodCallHandler(_methodCallHandler);
  }

  Future<String> iniciaVendaDebito({required String value}) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeElginpay'] = FunctionsElginPay.INICIA_VENDA_DEBITO.name;

    mapParam['value'] = value;

    return await _platform.invokeMethod("elginpay", {"args": mapParam});
  }

  Future<String> iniciaVendaCredito(
      {required String value,
      required String installmentMethod,
      required int numberOfInstallments}) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeElginpay'] = FunctionsElginPay.INICIA_VENDA_CREDITO.name;

    mapParam['value'] = value;
    mapParam['installmentMethod'] = installmentMethod;
    mapParam['numberOfInstallments'] = numberOfInstallments;

    return await _platform.invokeMethod("elginpay", {"args": mapParam});
  }

  Future<String> iniciaCancelamentoVenda(
      {required String value,
      required String saleRef,
      required String date}) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeElginpay'] = FunctionsElginPay.INICIA_CANCELAMENTO_VENDA.name;

    mapParam['value'] = value;
    mapParam['saleRef'] = saleRef;
    mapParam['date'] = date;

    return await _platform.invokeMethod("elginpay", {"args": mapParam});
  }

  Future<String> iniciaOperacaoAdministrativa() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeElginpay'] =
        FunctionsElginPay.INICIA_OPERACAO_ADMINISTRATIVA.name;

    return await _platform.invokeMethod("elginpay", {"args": mapParam});
  }

  Future<String> setCustomLayoutOn() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeElginpay'] = FunctionsElginPay.SET_CUSTOM_LAYOUT_ON.name;

    return await _platform.invokeMethod("elginpay", {"args": mapParam});
  }

  Future<String> setCustomLayoutOff() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeElginpay'] = FunctionsElginPay.SET_CUSTOM_LAYOUT_OFF.name;

    return await _platform.invokeMethod("elginpay", {"args": mapParam});
  }
}
