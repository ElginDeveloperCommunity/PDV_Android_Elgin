part of './TefPage.dart';

//Formas de pagamento disponíveis.
class FormaPagamento {
  static const FormaPagamento CREDITO = FormaPagamento._('credito');
  static const FormaPagamento DEBITO = FormaPagamento._('debito');
  static const FormaPagamento TODOS = FormaPagamento._('todos');

  final String _rotulo;

  const FormaPagamento._(this._rotulo);

  @override
  toString() => this._rotulo;
}