part of './pix4.dart';

enum Produto {
  ABACAXI,
  BANANA,
  CHOCOLATE,
  DETERGENTE,
  ERVILHA,
  FEIJAO,
  GOIABADA,
  HAMBURGUER,
  IOGURTE,
  JACA
}

extension ProdutoEnumExtension on Produto {
  String get nameForButton {
    // ignore: sdk_version_since
    return '${this.name[0].toUpperCase()}${this.name.substring(1).toLowerCase()}';
  }

  String get asset {
    switch (this) {
      case Produto.ABACAXI:
        return 'assets/images/pix4_abacaxi.png';
      case Produto.BANANA:
        return 'assets/images/pix4_banana.png';
      case Produto.CHOCOLATE:
        return 'assets/images/pix4_chocolate.png';
      case Produto.DETERGENTE:
        return 'assets/images/pix4_detergente.png';
      case Produto.ERVILHA:
        return 'assets/images/pix4_ervilha.png';
      case Produto.FEIJAO:
        return 'assets/images/pix4_feijao.png';
      case Produto.GOIABADA:
        return 'assets/images/pix4_goiabada.png';
      case Produto.HAMBURGUER:
        return 'assets/images/pix4_hamburguer.png';
      case Produto.IOGURTE:
        return 'assets/images/pix4_iogurte.png';
      case Produto.JACA:
        return 'assets/images/pix4_jaca.png';
    }
  }

  String get price {
    switch (this) {
      case Produto.ABACAXI:
        return 'R\$ 7.00';
      case Produto.BANANA:
        return 'R\$ 12.00';
      case Produto.CHOCOLATE:
        return 'R\$ 10.00';
      case Produto.DETERGENTE:
        return 'R\$ 6.00';
      case Produto.ERVILHA:
        return 'R\$ 4.00';
      case Produto.FEIJAO:
        return 'R\$ 8.00';
      case Produto.GOIABADA:
        return 'R\$ 9.00';
      case Produto.HAMBURGUER:
        return 'R\$ 14.00';
      case Produto.IOGURTE:
        return 'R\$ 11.00';
      case Produto.JACA:
        return 'R\$ 9.00';
    }
  }
}
