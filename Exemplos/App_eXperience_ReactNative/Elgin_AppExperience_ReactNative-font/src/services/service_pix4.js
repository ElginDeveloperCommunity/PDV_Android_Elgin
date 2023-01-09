import {NativeModules} from 'react-native';

var NativeModulesE1 = NativeModules.ToastModules;

export default class Pix4Service {
  sendFunctionToAndroid(mapParam) {
    NativeModulesE1.runPix4(mapParam);
  }

  sendExecuteStoreImages() {
    const mapParam = {
      typePix4: 'executeStoreImages',
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendAbreConexaoDisplay() {
    const mapParam = {
      typePix4: 'abreConexaoDisplay',
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendApresentaQrCodeLinkGihtub(nome, githubLink) {
    const mapParam = {
      typePix4: 'apresentaQrCodeLinkGihtub',
      nome,
      githubLink,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendAdicionaProdutoApresenta(nome, preco, assetFileName, outputFileName) {
    const mapParam = {
      typePix4: 'adicionaProdutoApresenta',
      nome,
      preco,
      assetFileName,
      outputFileName,
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendCarregarImagens() {
    const mapParam = {
      typePix4: 'carregarImagens',
    };
    this.sendFunctionToAndroid(mapParam);
  }

  sendApresentaListaCompras() {
    const mapParam = {
      typePix4: 'apresentaListaCompras',
    };
    this.sendFunctionToAndroid(mapParam);
  }
}
