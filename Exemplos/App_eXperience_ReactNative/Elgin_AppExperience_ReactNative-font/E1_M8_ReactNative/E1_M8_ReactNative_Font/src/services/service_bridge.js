import { NativeModules } from 'react-native';


var NativeModulesE1 = NativeModules.ToastModules;

export default class BridgeService{

    sendFunctionToAndroid(mapParam){
        NativeModulesE1.runBridge(mapParam);
    };

    sendIniciaVendaCredito(idTransacao,pdv,valorTotal,tipoFinanciamento,numParcelas){
        const mapParam = {
            "typeBridge":"vendaCredito",
            "idTransaction": idTransacao,
            "pdv": pdv,
            "totalValue":valorTotal,
            "installmentType":tipoFinanciamento,
            "installmentNum":numParcelas,
        }

        this.sendFunctionToAndroid(mapParam);
    }
    sendIniciaVendaDebito(idTransacao,pdv,valorTotal){
        const mapParam = {
            "typeBridge": "vendaDebito",
            "idTransaction": idTransacao,
            "pdv": pdv,
            "totalValue":valorTotal,
        }
        this.sendFunctionToAndroid(mapParam);
    }

    sendIniciaCancelamentoVenda(idTransacao,pdv,valorTotal,dataHora,saleRef){
        const mapParam = {
            "typeBridge": "cancelamentoVenda",
            "idTransaction": idTransacao,
            "pdv": pdv,
            "totalValue":valorTotal,
            "actualDate":dataHora,
            "nsu":saleRef,
        }
        this.sendFunctionToAndroid(mapParam);
    }

    sendIniciaOperacaoAdministrativa(idTransacao,pdv,operacao){
        const mapParam={
            "typeBridge": "operacaoAdministrativa",
            "idTransaction": idTransacao,
            "pdv": pdv,
            "selectedOperation":operacao,
        }

        this.sendFunctionToAndroid(mapParam);
    }

    sendBridgeNFCe(){
        const mapParam={
            "typeBridge":"bridgeNFCe",
            

       }

       this.sendFunctionToAndroid(mapParam);
    }

    sendBridgeSAT(){
        const mapParam = {
            "typeBridge":"bridgeSAT",
        
        }

        this.sendFunctionToAndroid(mapParam);
    }

    sendBridgeCancelation(){
        const mapParam = {
            "typeBridge":"bridgeCancelation",
           
        }

        this.sendFunctionToAndroid(mapParam);
    }

    sendSetSenha(senha,habilitada){
        const mapParam={
            "typeBridge":"setSenha",
            "password":senha,
            "enabled":habilitada,
        }
   
        this.sendFunctionToAndroid(mapParam);
    }

    sendConsultarStatus(){
        const mapParam={
            "typeBridge":"consultarStatus",
        }

        this.sendFunctionToAndroid(mapParam);
    }

    sendGetTimeOut(){
        const mapParam={
            "typeBridge":"getTimeOut",
        }

        this.sendFunctionToAndroid(mapParam);
    }

    sendConsultarUltimaTransacao(pdv){
        const mapParam={
            "typeBridge":"consultarUltimaTransacao",
            "pdv":pdv,
        }

        this.sendFunctionToAndroid(mapParam);
    }

    sendSetSenhaServer(senha,habilitada){
        const mapParam={
            "typeBridge":"setSenhaServer",
            "password":senha,
            "enabled":habilitada,
        }

        this.sendFunctionToAndroid(mapParam);
    }

    sendSetTimeOut(timeOut){
        const mapParam={
            "typeBridge":"setTimeOut",
            "timeOut":timeOut,
        }

        this.sendFunctionToAndroid(mapParam);
    }

    sendGetServer(){
        const mapParam={
            "typeBridge":"getServer",
        }

        this.sendFunctionToAndroid(mapParam);
    }

    sendSetServer(ipTerminal,portaTransacao,portaStatus){
        const mapParam={
            "typeBridge":"setServer",
            "terminalIP":ipTerminal,
            "transactionPort":portaTransacao,
            "transactionStatus":portaStatus,
        }
        console.log(mapParam);
        this.sendFunctionToAndroid(mapParam);
    }
    
};