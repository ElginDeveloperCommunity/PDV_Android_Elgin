export interface m8PluginPlugin {

    printerInternalImpStart(): Promise<{
        response: number;
    }>;

    printerExternalImpStart(params : {
        Ip: string;
    }): Promise <{
        response: number;
    }>;

    printerStop() : Promise <{}>;

    printerStatus() : Promise <{
        response: string;
    }>;

    drawerStatus() : Promise <{
        response: string;
    }>;

    openDrawer() : Promise <{
        response: string;
    }>;

    printText(options: {
        message: string,
        alignment: string,
        font: string,
        fontSize: number,
        isBold: boolean,
        isUnderline: boolean,
        cutPaper: boolean,
    }):  Promise<{
        response: number;
    }>;

    printXmlSat(params : {
        xmlSAT: string,
        cutPaper: boolean
    }): Promise<{
        response: number;
    }>;

    printXmlNFCe(params : {
        xmlNFCe: string,
        cutPaper: boolean
    }): Promise<{
        response: number;
    }>;

    printBarcode(params : {
        barCodeType: string;
        code: string;
        height: number;
        width: number;
        alignment: string;
        cutPaper: boolean;
    }): Promise <{
        response: number;
    }>;

    printImage(options: {
        cutPaper: boolean;
    }): Promise<{
        response: number
    }>;

    sendSitefParams(params :{
        action: string;
        ip: string;
        value: string;
        paymentMethod: string;
        installments: string;
    }): Promise <{
        response: number
    }>;

    sendPaygoParams(params :{
        action: string;
        valor: string;
        parcelas: number;
        formaPagamento: string;
        tipoParcelamento: string;
    }):Promise <{
        response: string;
    }>;
    
    testePrint(): Promise<{
        response: number;  
    }>;

    chooseImage() : Promise<{
        response : string;
    }>;

    resetDefaultImage();

    sendAtivarSAT(params :{
        codeAtivacao : string;
    }): Promise <{
        response : string;
    }>;

    sendAssociarSAT(params :{
        codeAtivacao : string;
    }): Promise <{
        response : string;
    }>;

    sendConsultarSAT() : Promise <{
        response : string;
    }>;

    sendStatusOperacionalSAT(params :{
        codeAtivacao : string;
    }) : Promise <{
        response : string;
    }>;

    sendEnviarVendasSAT( params : {
        codeAtivacao : string;
        stringXMLSat : string;
    }) : Promise <{
        response : string;
    }>;

    sendCancelarVendaSAT( params : {
        codeAtivacao : string;
        stringXMLCancelamentoSat : string;
    }) : Promise <{
        response : string;
    }>;

    sendConfigBalanca( params :{
        model : string;
        protocol : string;
    });

    sendLerPesoBalanca() : Promise <{
        response: string;
    }>;
}
