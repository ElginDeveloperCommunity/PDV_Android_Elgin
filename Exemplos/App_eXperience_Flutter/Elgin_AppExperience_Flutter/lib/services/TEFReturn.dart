class TEFReturn {
  final String? COD_AUTORIZACAO;
  final String? VIA_ESTABELECIMENTO;
  final String? COMP_DADOS_CONF;
  final String? BANDEIRA;
  final String? NUM_PARC;
  final String? RELATORIO;
  final String? REDE_AUT;
  final String? NSU_SITEF;
  final String? VIA_CLIENTE;
  final String? TIPO_PARC;
  final String? CODRESP;
  final String? NSU_HOST;

  TEFReturn._(
      this.COD_AUTORIZACAO,
      this.VIA_ESTABELECIMENTO,
      this.COMP_DADOS_CONF,
      this.BANDEIRA,
      this.NUM_PARC,
      this.RELATORIO,
      this.REDE_AUT,
      this.NSU_SITEF,
      this.VIA_CLIENTE,
      this.TIPO_PARC,
      this.CODRESP,
      this.NSU_HOST);

  factory TEFReturn.fromJson(Map<String, dynamic> json) {
    return TEFReturn._(
      json['COD_AUTORIZACAO'],
      json['VIA_ESTABELECIMENTO'],
      json['COMP_DADOS_CONF'],
      json['BANDEIRA'],
      json['NUM_PARC'],
      json['RELATORIO'],
      json['REDE_AUT'],
      json['NSU_SITEF'],
      json['VIA_CLIENTE'],
      json['TIPO_PARC'],
      json['CODRESP'],
      json['NSU_HOST'],
    );
  }
}
