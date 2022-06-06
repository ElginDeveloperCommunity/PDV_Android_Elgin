import { NativeModules } from 'react-native';

var NativeModulesE1 = NativeModules.ToastModules;

export default class PrinterService{
    sendFunctionToAndroid(mapParam){
        NativeModulesE1.sendOptionsClassPrinter(mapParam);
    };

    sendStartConnectionPrinterIntern(){
        const mapParam = {
            "typePrinter": "printerConnectInternal",
        };

        this.sendFunctionToAndroid(mapParam);
    }

    sendStartConnectionPrinterExternIp(printerModel,ip, port){
        const mapParam = {
            "typePrinter": "connectionPrinterExternIp",
            "printerModel":printerModel,
            "ip": ip,
            "port": port,
        };
        
        this.sendFunctionToAndroid(mapParam);
    }

    sendStartConnectionPrinterExternUsb(printerModel){
        const mapParam={
            "typePrinter":"connectionPrinterExternUsb",
            "printerModel":printerModel,
        };
        
        this.sendFunctionToAndroid(mapParam);
    }

    sendPrinterText(text, align, isBold, isUnderline, fontFamily, fontSize){
        const mapParam = {
            "typePrinter": "printerText",
            "text": text,
            "align": align,
            "isBold": isBold,
            "isUnderline": isUnderline,
            "font": fontFamily,
            "fontSize": fontSize,
        };
        this.sendFunctionToAndroid(mapParam);
    };

    sendPrinterBarCode(barCodeType, text, height, width, align){
        const mapParam = {
            "typePrinter": "printerBarCode",
            "barCodeType": barCodeType,
            "text": text,
            "height": height,
            "width": width,
            "align": align,
        };

        this.sendFunctionToAndroid(mapParam);
    };

    sendPrinterQrCode(qrSize, text, align){
        const mapParam = {
            "typePrinter": "printerBarCodeTypeQrCode",
            "qrSize": qrSize,
            "text": text,
            "align": align,
        };

        this.sendFunctionToAndroid(mapParam);
    };

    sendPrinterImage(pathImage, isBase64){
        const mapParam = {
            "typePrinter": "printerImage",
            "pathImage": pathImage,
            "isBase64": isBase64,
        };
        console.log(mapParam);
        this.sendFunctionToAndroid(mapParam);
    };

    sendPrinterNFCe(xmlNFCe, indexcsc, csc, param){
        const mapParam = {
            "typePrinter": "printerNFCe",
            "xmlNFCe": xmlNFCe,
            "indexcsc": indexcsc,
            "csc": csc,
            "param": param,
        };
        this.sendFunctionToAndroid(mapParam);
    };

    sendPrinterSAT(xmlSAT, param){
        const mapParam = {
            "typePrinter": "printerSAT",
            "xmlSAT": xmlSAT,
            "param": param,
        };
        this.sendFunctionToAndroid(mapParam);
    };

    sendPrinterCupomTEF(base64){
        const mapParam = {
            "typePrinter": "printerCupomTEF",
            "base64": base64,
        };

        this.sendFunctionToAndroid(mapParam);
    }

    getStatusPrinter(){
        const mapParam = {
            "typePrinter": "statusPrinter",
        };

        this.sendFunctionToAndroid(mapParam);
    };

    getStatusGaveta(){
        const mapParam = {
            "typePrinter": "gavetaStatus",
        };

        this.sendFunctionToAndroid(mapParam);
    };

    sendOpenGaveta(){
        const mapParam = {
            "typePrinter": "abrirGaveta",
        };

        this.sendFunctionToAndroid(mapParam);
    };

    jumpLine(quant){
        const mapParam = {
            "typePrinter": "jumpLine",
            "quant": quant,
        };
        this.sendFunctionToAndroid(mapParam);
    };

    cutPaper(quant){
        const mapParam = {
            "typePrinter": "cutPaper",
            "quant": quant,
        };
        this.sendFunctionToAndroid(mapParam);
    }

    printerStop(){
        const mapParam = {
          typePrinter: 'printerStop',
        }
    
        this.sendFunctionToAndroid(mapParam);
    }
}