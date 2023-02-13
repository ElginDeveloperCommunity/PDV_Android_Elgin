import {NativeModules} from 'react-native';

var NativeModulesE1 = NativeModules.ToastModules;

export default class BalancaService {
  sendFunctionToAndroid(mapParam) {
    NativeModulesE1.runBalanca(mapParam);
  }

  sendConfigBalanca(modelBalanca, protocolBalanca) {
    const mapParam = {
      typeBalanca: 'configBalanca',
      model: modelBalanca,
      protocol: protocolBalanca,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendLerPeso() {
    const mapParam = {
      typeBalanca: 'lerPeso',
    };

    this.sendFunctionToAndroid(mapParam);
  }
}
