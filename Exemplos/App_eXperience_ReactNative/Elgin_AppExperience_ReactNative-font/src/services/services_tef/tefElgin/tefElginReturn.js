export default class TefElginReturn {
  convertJSONtoTEFELGIN(json) {
    this.cODAUTORIZACAO = json.COD_AUTORIZACAO;
    this.viaESTABELECIMENTO = json.VIA_ESTABELECIMENTO;
    this.cOMPDADOSCONF = json.COMP_DADOS_CONF;
    this.bANDEIRA = json.BANDEIRA;
    this.numPARC = json.NUM_PARC;
    this.cODTRANS = json.CODTRANS;
    this.rEDEAUT = json.REDE_AUT;
    this.nsuSITEF = json.NSU_SITEF;
    this.viaCLIENTE = json.VIA_CLIENTE;
    this.vLTROCO = json.VLTROCO;
    this.tipoPARC = json.TIPO_PARC;
    this.cODRESP = json.CODRESP;
    this.nSUHOST = json.NSU_HOST;

    return json;
  }

  receiveResultInJSON(jsonString) {
    console.log(jsonString);
    var resultParsed = JSON.parse(jsonString);

    this.convertJSONtoTEFELGIN(resultParsed);
  }

  vIAESTABELECIMENTO() {
    return this.viaESTABELECIMENTO ? this.viaESTABELECIMENTO : '';
  }

  setCodTrans(cODTRANS) {
    this.cODTRANS = cODTRANS;
  }

  getcODAUTORIZACAO() {
    return this.cODAUTORIZACAO ? this.cODAUTORIZACAO : '';
  }
  cOMPDADOSCONF() {
    return this.cOMPDADOSCONF ? this.cOMPDADOSCONF : '';
  }
  bANDEIRA() {
    return this.bANDEIRA ? this.bANDEIRA : '';
  }
  nUMPARC() {
    if (this.numPARC != null) {
      return this.numPARC;
    }
    return '';
  }
  cODTRANS() {
    return this.cODTRANS ? this.cODTRANS : '';
  }
  rEDEAUT() {
    return this.rEDEAUT ? this.rEDEAUT : '';
  }
  nSUSITEF() {
    return this.nsuSITEF ? this.nsuSITEF : '';
  }
  vIACLIENTE() {
    return this.viaCLIENTE ? this.viaCLIENTE : '';
  }
  vLTROCO() {
    return this.vLTROCO;
  }
  tipoPARC() {
    return this.tipoPARC;
  }
  getcODRESP() {
    return this.cODRESP ? this.cODRESP : '';
  }
  nSUHOST() {
    return this.nSUHOST;
  }

  getNameTransCod() {
    var retorno = 'Valor invalido';

    switch (parseInt(this.tipoPARC, 10)) {
      case 0:
        retorno = 'A vista';
        break;
      case 1:
        retorno = 'Pré-Datado';
        break;
      case 2:
        retorno = 'Parcelado Loja';
        break;
      case 3:
        retorno = 'Parcelado Adm';
        break;
    }

    return retorno;
  }
}
