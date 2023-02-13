import {NativeModules} from 'react-native';

var NativeModulesE1 = NativeModules.ToastModules;

export default class KioskService {
  sendFunctionToAndroid(mapParam) {
    NativeModulesE1.runKiosk(mapParam);
  }

  sendSwitchBarraNavegacao(value) {
    const mapParam = {
      typeKiosk: 'switchBarraNavegacao',
      value,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendSwitchBarraStatus(value) {
    const mapParam = {
      typeKiosk: 'switchBarraStatus',
      value,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendSwitchBotaoPower(value) {
    const mapParam = {
      typeKiosk: 'switchBotaoPower',
      value,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendResetKioskMode() {
    const mapParam = {
      typeKiosk: 'resetKioskMode',
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendSetFullKioskMode() {
    const mapParam = {
      typeKiosk: 'setFullKioskMode',
    };
    this.sendFunctionToAndroid(mapParam);
  }
}
