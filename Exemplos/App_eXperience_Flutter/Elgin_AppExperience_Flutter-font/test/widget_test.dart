// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility that Flutter provides. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

// import 'package:flutter_test/flutter_test.dart';

import 'package:flutter/cupertino.dart';
import 'package:flutter_m8/main.dart';
import 'package:flutter_m8/services/counter.dart';
import 'package:flutter_m8/services/service_paygo.dart';
import 'package:test/test.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  test("Teste Paygo", () {
    PayGoService paygo_service = PayGoService();

    String valor = "100";
    String formaPagamento = "Crédito";
    String tipoParcelamento = "Avista";

    List<String> tiposPagamentoValidos = ["Crédito", "Débito", "Todos"];
    List<String> tiposParcelamentoValidos = ["Adm", "Loja", "Avista"];

    testTiposPagamentos(String value) => value.contains(formaPagamento);
    bool formaPagamentoIsValid = tiposPagamentoValidos.any(testTiposPagamentos);

    testTiposParcelamentos(String value) => value.contains(tipoParcelamento);
    bool formaParcelamentoIsValid =
        tiposParcelamentoValidos.any(testTiposParcelamentos);

    paygo_service.sendOptionSale(
      valor: valor,
      formaPagamento: formaPagamento,
      parcelas: 2,
      tipoParcelamento: tipoParcelamento,
    );

    print('\nTIPO DE PAGAMENTO DEVE RETORNAR TRUE: R: $formaPagamentoIsValid');
    print('TIPO DE PARCELAMENTOS DEVE RETORNAR TRUE: R: $formaParcelamentoIsValid \n');

    expect(formaPagamentoIsValid, true);
    expect(formaParcelamentoIsValid, true);
  });
}
