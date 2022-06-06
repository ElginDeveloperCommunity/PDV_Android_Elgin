import { NativeModules } from 'react-native'

var NativeModulesE1 = NativeModules.ToastModules;


export default class NfceService {

    static CONFIGURATE_XML_NFCE = "CONFIGURATE_XML_NFCE";
    static SEND_SALE_NFCE = "SEND_SALE_NFCE";

    sendFunctionToAndroid(mapParam) {
        NativeModulesE1.sendNfceOption(mapParam);
    }

    sendConfigurateXmlNfce() {
        const mapParam = {
            typeNfce : "CONFIGURATE_XML_NFCE",
        }

        this.sendFunctionToAndroid(mapParam);
    }

    sendSaleNfce(productName, productPrice) {
        const mapParam = {
            typeNfce : "SEND_SALE_NFCE",
            productName : productName,
            productPrice : productPrice
        }

        this.sendFunctionToAndroid(mapParam);
    }
}