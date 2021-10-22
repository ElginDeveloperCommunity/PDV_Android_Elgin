class SitefReturn {
  String cODAUTORIZACAO = '';
  String vIAESTABELECIMENTO = '';
  String cOMPDADOSCONF = '';
  String bANDEIRA = '';
  String nUMPARC = '';
  String cODTRANS = '';
  String rEDEAUT = '';
  String nSUSITEF = '';
  String vIACLIENTE = '';
  String vLTROCO = '';
  String tIPOPARC = '';
  String cODRESP = '';
  String nSUHOST = '';

  SitefReturn({
    this.cODAUTORIZACAO = '',
    this.vIAESTABELECIMENTO = '',
    this.cOMPDADOSCONF = '',
    this.bANDEIRA = '',
    this.nUMPARC = '',
    this.cODTRANS = '',
    this.rEDEAUT = '',
    this.nSUSITEF = '',
    this.vIACLIENTE = '',
    this.vLTROCO = '',
    this.tIPOPARC = '',
    this.cODRESP = '',
    this.nSUHOST = '',
  });

  SitefReturn.fromJson(Map<String, dynamic> json) {
    cODAUTORIZACAO = json['COD_AUTORIZACAO'] ?? '';
    vIAESTABELECIMENTO = json['VIA_ESTABELECIMENTO'] ?? '';
    cOMPDADOSCONF = json['COMP_DADOS_CONF'] ?? '';
    bANDEIRA = json['BANDEIRA'] ?? '';
    nUMPARC = json['NUM_PARC'] ?? '';
    cODTRANS = json['CODTRANS'] ?? '';
    rEDEAUT = json['REDE_AUT'] ?? '';
    nSUSITEF = json['NSU_SITEF'] ?? '';
    vIACLIENTE = json['VIA_CLIENTE'] ?? '';
    vLTROCO = json['VLTROCO'] ?? '';
    tIPOPARC = json['TIPO_PARC'] ?? '';
    cODRESP = json['CODRESP'] ?? '';
    nSUHOST = json['NSU_HOST'] ?? '';
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['COD_AUTORIZACAO'] = this.cODAUTORIZACAO;
    data['VIA_ESTABELECIMENTO'] = this.vIAESTABELECIMENTO;
    data['COMP_DADOS_CONF'] = this.cOMPDADOSCONF;
    data['BANDEIRA'] = this.bANDEIRA;
    data['NUM_PARC'] = this.nUMPARC;
    data['CODTRANS'] = this.cODTRANS;
    data['REDE_AUT'] = this.rEDEAUT;
    data['NSU_SITEF'] = this.nSUSITEF;
    data['VIA_CLIENTE'] = this.vIACLIENTE;
    data['VLTROCO'] = this.vLTROCO;
    data['TIPO_PARC'] = this.tIPOPARC;
    data['CODRESP'] = this.cODRESP;
    data['NSU_HOST'] = this.nSUHOST;
    return data;
  }
}
