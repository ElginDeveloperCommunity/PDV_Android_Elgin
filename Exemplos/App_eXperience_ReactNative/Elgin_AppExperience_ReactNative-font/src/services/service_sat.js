import {NativeModules} from 'react-native';

var NativeModulesE1 = NativeModules.ToastModules;

export default class SatService {
  sendFunctionToAndroid(mapParam) {
    NativeModulesE1.runSat(mapParam);
  }

  sendActivateSat(numSession, subComand, activationCode, cnpj, cUF) {
    const mapParam = {
      typeSat: 'activateSat',
      numSessao: numSession,
      subComando: subComand,
      codeAtivacao: activationCode,
      cnpj: cnpj,
      cUF: cUF,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendAssociateSignature(numSession, activationCode, cnpjSh, acSignature) {
    const mapParam = {
      typeSat: 'associateSignature',
      numSessao: numSession,
      codeAtivacao: activationCode,
      cnpjSh: cnpjSh,
      assinaturaAC: acSignature,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendconsultSat(numSession) {
    const mapParam = {
      typeSat: 'consultSat',
      numSessao: numSession,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendStatusSat(numSession, activationCode) {
    const mapParam = {
      typeSat: 'statusSat',
      numSessao: numSession,
      codeAtivacao: activationCode,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendSendSell(numSession, activationCode, saleXml) {
    const mapParam = {
      typeSat: 'sendSell',
      numSessao: numSession,
      codeAtivacao: activationCode,
      xmlSale: saleXml,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendCancelSell(numSession, activationCode, cFeNumber, cancelXml) {
    const mapParam = {
      typeSat: 'cancelSell',
      numSessao: numSession,
      codeAtivacao: activationCode,
      cFeNumber: cFeNumber,
      xmlCancelamento: cancelXml,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendGetLogs(numSession, activationCode) {
    const mapParam = {
      typeSat: 'getLogs',
      numSessao: numSession,
      codeAtivacao: activationCode,
    };

    this.sendFunctionToAndroid(mapParam);
  }

  sendDeviceInfo() {
    const mapParam = {
      typeSat: 'deviceInfo',
    };
    this.sendFunctionToAndroid(mapParam);
  }
}
