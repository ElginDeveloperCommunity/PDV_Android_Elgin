//SITEF
enum FunctionSitef { SALE, CANCELL, CONFIGS }

//Bridge

//Const contructors tornam a comparação entre classes possível uma vez que todos os campos são conhecidos em compile-time.
 
class PaymentMethod{
  static const PaymentMethod DEBITO = PaymentMethod._("DEBITO");
  static const PaymentMethod CREDITO = PaymentMethod._("CREDITO");

  final String _label;

  const PaymentMethod._(this._label);

  @override
  String toString(){
    return _label;
  }
}

class InstallmentMethod{
  static const InstallmentMethod FINANCIAMENTO_A_VISTA = InstallmentMethod._(1);
  static const InstallmentMethod FINANCIAMENTO_PARCELADO_EMISSOR = InstallmentMethod._(2);
  static const InstallmentMethod FINANCIAMENTO_PARCELADO_ESTABELECIMENTO = InstallmentMethod._(3);

  final int _correspondingValue;

  const InstallmentMethod._(this._correspondingValue);

  int correspondingValue(){
    return _correspondingValue;
  }
}

