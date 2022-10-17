part of './TefPage.dart';

//Ações disponíveis nos TEFs.
class Acao {
  static const Acao VENDA  = Acao._('venda');
  static const Acao CANCELAMENTO = Acao._('cancelamento');
  static const Acao CONFIGURACAO = Acao._('configuracao');

  //String rotulo utilizada para a decomposição do enum e captura do parâmetro na plataforma Android.
  final String _rotulo;

  const Acao._(this._rotulo);

  @override
  toString() => _rotulo;
}