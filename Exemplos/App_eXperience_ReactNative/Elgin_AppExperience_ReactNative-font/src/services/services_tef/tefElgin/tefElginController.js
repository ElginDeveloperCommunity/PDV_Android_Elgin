import {NativeModules} from 'react-native';

var NativeModulesE1 = NativeModules.ToastModules;

import TefElginEntrys from './tefElginEntrys';
import TefElginFormat from './tefElginFormat';

export default class TefElginController {
  tefelginFormat = new TefElginFormat();
  tefelginEntrys = new TefElginEntrys();

  sendFunctionsToAndroid(mapParam) {
    //CHAMADA AO TOASTMODULES
    NativeModulesE1.runTefElgin(mapParam);
  }

  sendParamsTefElgin(functionTefElgin) {
    var jsonTefElgin = this.tefelginFormat.formatTefElginEntrysToJson(
      functionTefElgin,
      this.tefelginEntrys,
    );

    this.sendFunctionsToAndroid(jsonTefElgin);
  }
}
