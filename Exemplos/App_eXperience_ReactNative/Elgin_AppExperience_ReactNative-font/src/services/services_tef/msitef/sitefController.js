import {NativeModules} from 'react-native';

var NativeModulesE1 = NativeModules.ToastModules;

import SitefEntrys from './sitefEntrys';
import SitefFormat from './sitefFormat';

export default class SitefController {
  sitefFormat = new SitefFormat();
  sitefEntrys = new SitefEntrys();

  sendFunctionsToAndroid(mapParam) {
    //CHAMADA AO TOASTMODULES
    NativeModulesE1.runMsiTef(mapParam);
  }

  sendParamsSitef(functionSitef) {
    var jsonSitef = this.sitefFormat.formatSitefEntrysToJson(
      functionSitef,
      this.sitefEntrys,
    );

    this.sendFunctionsToAndroid(jsonSitef);
  }
}
