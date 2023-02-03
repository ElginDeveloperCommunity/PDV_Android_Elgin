part of './TefPage.dart';

//Formas de ficnanciamento disponíveis.
class FormaFinanciamento {
  static const FormaFinanciamento LOJA = FormaFinanciamento._('loja');
  static const FormaFinanciamento ADM = FormaFinanciamento._('adm');
  static const FormaFinanciamento A_VISTA = FormaFinanciamento._('a_vista');

  final String _rotulo;

  const FormaFinanciamento._(this._rotulo);

  @override
  toString() => this._rotulo;
}

