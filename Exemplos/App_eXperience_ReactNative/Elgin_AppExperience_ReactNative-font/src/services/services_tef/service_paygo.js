import {NativeModules} from 'react-native';

var NativeModulesE1 = NativeModules.ToastModules;

export default class PayGoService {
  sendFunctionToAndroid(mapParam) {
    NativeModulesE1.runPayGo(mapParam);
  }

  sendOptionSale(valor, parcelas, formaPagamento, tipoParcelamento) {
    const mapParam = {
      typeOption: 'VENDA',
      valor: valor,
      parcelas: parcelas,
      formaPagamento: formaPagamento,
      tipoParcelamento: tipoParcelamento,
    };

    this.sendFunctionToAndroid(mapParam);
  }

  sendOptionCancel(valor, parcelas, formaPagamento, tipoParcelamento) {
    const mapParam = {
      typeOption: 'CANCELAMENTO',
      valor: valor,
      parcelas: parcelas,
      formaPagamento: formaPagamento,
      tipoParcelamento: tipoParcelamento,
    };

    this.sendFunctionToAndroid(mapParam);
  }

  sendOptionConfigs() {
    const mapParam = {
      typeOption: 'ADMINISTRATIVA',
    };

    this.sendFunctionToAndroid(mapParam);
  }
}
