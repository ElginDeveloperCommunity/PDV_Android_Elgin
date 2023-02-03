part of './TefPage.dart';

//TEFs de pagamento disponíveis.
class TEF {
  static const TEF PAY_GO = TEF._('pay_go');
  static const TEF M_SITEF = TEF._('m_sitef');
  static const TEF ELGIN_TEF = TEF._('elgin_tef');

  final String _rotulo;

  const TEF._(this._rotulo);

  @override
  toString() => this._rotulo;
}

