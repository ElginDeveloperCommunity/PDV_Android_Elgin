package com.elginm8;

import static android.app.Activity.RESULT_CANCELED;
import static android.app.Activity.RESULT_OK;
import static com.elginm8.MainActivity.it4rObj;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;

import com.elginm8.Pix4.Framework;
import com.elginm8.Pix4.Pix4Service;
import com.elginm8.Pix4.Produto;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;

import br.com.daruma.framework.mobile.exception.DarumaException;
import br.com.setis.interfaceautomacao.Operacoes;

public class ToastModules extends ReactContextBaseJavaModule implements ActivityEventListener {
    public static ReactApplicationContext reactContext;

    Bundle instanceBundle = new Bundle();

    ToastModules(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        reactContext.addActivityEventListener(this);
    }

    public static void configurateXmlNfce() {
        try {
            it4rObj.configurarXmlNfce();
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventConfigurateXmlNfce", "NFC-e configurada com sucesso!");
        } catch (DarumaException e) {
            e.printStackTrace();
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventConfigurateXmlNfce", "Erro na configuração de NFC-e!");
        }
    }

    @Override
    public String getName() {
        return "ToastModules";
    }

    public void onNewIntent(Intent intent) {
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

        if (requestCode == 4321 || requestCode == 4322) {
            if (resultCode == RESULT_OK || resultCode == RESULT_CANCELED && data != null) {
                try {
                    WritableMap result = Arguments.createMap();
                    
                    String jsonString = convertResultFromJSON(data);
                    Log.d("onActivityResult_TEF", "oxe " + jsonString);
                    result.putString("restultMsitef", jsonString);
                    reactContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("eventResultSitef", result);

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            } else {
                Toast.makeText(reactContext.getApplicationContext(), "Transação cancelada!", Toast.LENGTH_LONG).show();
            }
        }
    }

    public String convertResultFromJSON(Intent receiveResult) throws JSONException {
        JSONObject convertJSON = new JSONObject();

        convertJSON.put("COD_AUTORIZACAO", receiveResult.getStringExtra("COD_AUTORIZACAO"));
        convertJSON.put("VIA_ESTABELECIMENTO", receiveResult.getStringExtra("VIA_ESTABELECIMENTO"));
        convertJSON.put("COMP_DADOS_CONF", receiveResult.getStringExtra("COMP_DADOS_CONF"));
        convertJSON.put("BANDEIRA", receiveResult.getStringExtra("BANDEIRA"));
        convertJSON.put("RELATORIO_TRANS", receiveResult.getStringExtra("RELATORIO_TRANS"));
        convertJSON.put("NUM_PARC", receiveResult.getStringExtra("NUM_PARC"));
        convertJSON.put("REDE_AUT", receiveResult.getStringExtra("REDE_AUT"));
        convertJSON.put("NSU_SITEF", receiveResult.getStringExtra("NSU_SITEF"));
        convertJSON.put("VIA_CLIENTE", receiveResult.getStringExtra("VIA_CLIENTE"));
        convertJSON.put("TIPO_PARC", receiveResult.getStringExtra("TIPO_PARC"));
        convertJSON.put("CODRESP", receiveResult.getStringExtra("CODRESP"));
        convertJSON.put("CODTRANS", receiveResult.getStringExtra("CODTRANS"));
        convertJSON.put("NSU_HOST", receiveResult.getStringExtra("NSU_HOST"));
        convertJSON.put("VLTROCO", receiveResult.getStringExtra("VLTROCO"));

        return convertJSON.toString();
    }

    @ReactMethod
    public void runMsiTef(ReadableMap configsReceived) {
        Intent intentToMsitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");
        Activity thisActivity = getCurrentActivity();

        instanceBundle = new Bundle();

        ReadableMapKeySetIterator iterator = configsReceived.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            instanceBundle.putString(key, configsReceived.getString(key));
        }

        intentToMsitef.putExtras(instanceBundle);

        thisActivity.startActivityForResult(intentToMsitef, 4321);
    }

    @ReactMethod
    public void runPayGo(ReadableMap configsReceived) {
        if (configsReceived.getString("typeOption").equals("VENDA")) {
            PayGo.efetuaTransacao(Operacoes.VENDA, configsReceived);

        } else if (configsReceived.getString("typeOption").equals("CANCELAMENTO")) {
            PayGo.efetuaTransacao(Operacoes.CANCELAMENTO, configsReceived);

        } else {
            PayGo.efetuaTransacao(Operacoes.ADMINISTRATIVA, configsReceived);
        }
    }

    @ReactMethod
    public void runTefElgin(ReadableMap configsReceived) {
        Intent intentToTefElgin = new Intent("com.elgin.e1.digitalhub.TEF");
        Activity thisActivity = getCurrentActivity();

        instanceBundle = new Bundle();

        ReadableMapKeySetIterator iterator = configsReceived.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            instanceBundle.putString(key, configsReceived.getString(key));
        }

        intentToTefElgin.putExtras(instanceBundle);

        Bundle bundle = intentToTefElgin.getExtras();
        if (bundle != null) {
            for (String key : bundle.keySet()) {
                Log.e("MADARA", key + " : " + (bundle.get(key) != null ? bundle.get(key) : "NULL"));
            }
        }

        thisActivity.startActivityForResult(intentToTefElgin, 4322);
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    @ReactMethod
    public void sendOptionsClassPrinter(ReadableMap configsReceived) {
        WritableMap result = Arguments.createMap();

        if (configsReceived.getString("typePrinter").equals("printerConnectInternal")) {
            Printer.printerInternalImpStart();

        } else if (configsReceived.getString("typePrinter").equals("connectionPrinterExternIp")) {
            Printer.printerExternalImpIpStart(configsReceived);
        } else if (configsReceived.getString("typePrinter").equals("connectionPrinterExternUsb")) {
            Printer.printerExternalImpUsbStart(configsReceived);
        } else if (configsReceived.getString("typePrinter").equals("printerCupomTEF")) {
            Printer.imprimeCupomTEF(configsReceived);
        } else if (configsReceived.getString("typePrinter").equals("printerText")) {
            Printer.imprimeTexto(configsReceived);

        } else if (configsReceived.getString("typePrinter").equals("printerBarCode")) {
            Printer.imprimeBarCode(configsReceived);

        } else if (configsReceived.getString("typePrinter").equals("printerBarCodeTypeQrCode")) {
            Printer.imprimeQR_CODE(configsReceived);

        } else if (configsReceived.getString("typePrinter").equals("printerImage")) {
            Printer.imprimeImagem(configsReceived);

        } else if (configsReceived.getString("typePrinter").equals("printerNFCe")) {
            Printer.imprimeXMLNFCe(configsReceived);

        } else if (configsReceived.getString("typePrinter").equals("printerSAT")) {
            Printer.imprimeXMLSAT(configsReceived);

        } else if (configsReceived.getString("typePrinter").equals("gavetaStatus")) {
            result.putString("statusGaveta", String.valueOf(Printer.statusGaveta()));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventStatusGaveta", result);

        } else if (configsReceived.getString("typePrinter").equals("abrirGaveta")) {
            Printer.abrirGaveta();

        } else if (configsReceived.getString("typePrinter").equals("jumpLine")) {
            Printer.AvancaLinhas(configsReceived);

        } else if (configsReceived.getString("typePrinter").equals("cutPaper")) {
            Printer.cutPaper(configsReceived);

        } else if (configsReceived.getString("typePrinter").equals("statusPrinter")) {
            result.putString("statusPrinter", String.valueOf(Printer.statusSensorPapel()));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventStatusPrinter", result);
        } else if (configsReceived.getString("typePrinter").equals("printerStop")) {
            Printer.printerStop();
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    @ReactMethod
    public void runSat(ReadableMap configsReceived) {
        WritableMap result = Arguments.createMap();

        if (configsReceived.getString("typeSat").equals("activateSat")) {
            result.putString("resultAtivarSat", String.valueOf(ServiceSat.ativarSAT(configsReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventAtivarSat", result);

        } else if (configsReceived.getString("typeSat").equals("associateSignature")) {
            result.putString("resultAssociateSignature", String.valueOf(ServiceSat.associarAssinatura(configsReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventAssociateSignature", result);

        } else if (configsReceived.getString("typeSat").equals("consultSat")) {
            result.putString("resultConsultSat", ServiceSat.consultarSAT(configsReceived));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventConsultSat", result);

        } else if (configsReceived.getString("typeSat").equals("statusSat")) {
            result.putString("resultStatusOperacional", ServiceSat.statusOperacional(configsReceived));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventStatusOperacional", result);

        } else if (configsReceived.getString("typeSat").equals("sendSell")) {
            result.putString("resultSendSell", String.valueOf(ServiceSat.enviarVenda(configsReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventSendSell", result);


        } else if (configsReceived.getString("typeSat").equals("cancelSell")) {
            result.putString("resultCancelSell", String.valueOf(ServiceSat.cancelarVenda(configsReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventCancelSell", result);


        } else if (configsReceived.getString("typeSat").equals("getLogs")) {
            result.putString("resultGetLog", String.valueOf(ServiceSat.extrairLog(configsReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventGetLog", result);
        }
    }

    @ReactMethod
    public void runBalanca(ReadableMap configsReceived) {
        WritableMap result = Arguments.createMap();

        if (configsReceived.getString("typeBalanca").equals("configBalanca")) {
            Balanca.configBalanca(configsReceived);

        } else if (configsReceived.getString("typeBalanca").equals("lerPeso")) {
            String returnValue = Balanca.lerPesoBalanca();
            System.out.println(returnValue);

            result.putString("resultLerPeso", returnValue);

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventLerPeso", result);
        }
    }

    @ReactMethod
    public void runPix4(ReadableMap configsReceived) {
        WritableMap result = Arguments.createMap();

        if (configsReceived.getString("typePix4").equals("executeStoreImages")) {
            Pix4Service.executeStoreImages();
        } else if (configsReceived.getString("typePix4").equals("abreConexaoDisplay")) {
            Pix4Service.abreConexaoDisplay();
        } else if (configsReceived.getString("typePix4").equals("apresentaQrCodeLinkGihtub")) {
            Framework framework = new Framework(configsReceived.getString("nome"), configsReceived.getString("githubLink"));
            Pix4Service.apresentaQrCodeLinkGihtub(framework);
        } else if (configsReceived.getString("typePix4").equals("adicionaProdutoApresenta")) {
            Produto produto = new Produto(configsReceived.getString("nome"), configsReceived.getString("preco"), configsReceived.getString("assetFileName"), configsReceived.getString("outputFileName"));
            Pix4Service.adicionaProdutoApresenta(produto);
        } else if (configsReceived.getString("typePix4").equals("carregarImagens")) {
            Pix4Service.carregarImagens();
        } else if (configsReceived.getString("typePix4").equals("apresentaListaCompras")) {
            Pix4Service.apresentaListaCompras();
        }
    }

    @ReactMethod
    public void runKiosk(ReadableMap configsReceived) {
        WritableMap result = Arguments.createMap();

        if (configsReceived.getString("typeKiosk").equals("switchBarraNavegacao")) {
            KioskService.executeKioskOperation(KioskService.KIOSK_CONFIG.BARRA_NAVEGACAO, configsReceived.getBoolean("value"));
        } else if (configsReceived.getString("typeKiosk").equals("switchBarraStatus")) {
            KioskService.executeKioskOperation(KioskService.KIOSK_CONFIG.BARRA_STATUS, configsReceived.getBoolean("value"));
        } else if (configsReceived.getString("typeKiosk").equals("switchBotaoPower")) {
            KioskService.executeKioskOperation(KioskService.KIOSK_CONFIG.BOTAO_POWER, configsReceived.getBoolean("value"));
        } else if (configsReceived.getString("typeKiosk").equals("resetKioskMode")) {
            KioskService.resetKioskMode();
        } else if (configsReceived.getString("typeKiosk").equals("setFullKioskMode")) {
            KioskService.setFullKioskMode();
        }
    }

    @ReactMethod
    public void runBridge(ReadableMap configReceived) {
        WritableMap result = Arguments.createMap();

        if (configReceived.getString("typeBridge").equals("vendaCredito")) {
            result.putString("resultVendaCredito", String.valueOf(BridgeService.IniciaVendaCredito(configReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventVendaCredito", result);

        } else if (configReceived.getString("typeBridge").equals("vendaDebito")) {
            result.putString("resultVendaDebito", String.valueOf(BridgeService.IniciaVendaDebito(configReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventVendaDebito", result);

        } else if (configReceived.getString("typeBridge").equals("cancelamentoVenda")) {
            result.putString("resultCancelamentoVenda", String.valueOf(BridgeService.IniciaCancelamentoVenda(configReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventCancelamentoVenda", result);

        } else if (configReceived.getString("typeBridge").equals("operacaoAdministrativa")) {
            result.putString("resultOperacaoAdministrativa", String.valueOf(BridgeService.IniciaOperacaoAdministrativa(configReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventOperacaoAdministrativa", result);

        } else if (configReceived.getString("typeBridge").equals("bridgeNFCe")) {
            result.putString("resultBridgeNFCe", String.valueOf(BridgeService.bridgeXmlNFCe()));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventBridgeNFCe", result);
        } else if (configReceived.getString("typeBridge").equals("bridgeSAT")) {
            result.putString("resultBridgeSAT", String.valueOf(BridgeService.bridgeXmlSAT()));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventBridgeSAT", result);

        } else if (configReceived.getString("typeBridge").equals("bridgeCancelation")) {
            result.putString("resultBridgeCancelation", String.valueOf(BridgeService.bridgeCancelation()));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventBridgeCancelation", result);

        } else if (configReceived.getString("typeBridge").equals("setSenha")) {
            BridgeService.SetSenha(configReceived);

        } else if (configReceived.getString("typeBridge").equals("consultarStatus")) {
            result.putString("resultConsultarStatus", String.valueOf(BridgeService.ConsultarStatus()));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventConsultarStatus", result);

        } else if (configReceived.getString("typeBridge").equals("getTimeOut")) {
            result.putString("resultGetTimeOut", String.valueOf(BridgeService.GetTimeout()));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventGetTimeOut", result);

        } else if (configReceived.getString("typeBridge").equals("consultarUltimaTransacao")) {
            result.putString("resultUltimaTransacao", String.valueOf(BridgeService.ConsultarUltimaTransacao(configReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventUltimaTransacao", result);

        } else if (configReceived.getString("typeBridge").equals("setSenhaServer")) {
            result.putString("resultSetSenhaServer", String.valueOf(BridgeService.SetSenhaServer(configReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventSetSenhaServer", result);

        } else if (configReceived.getString("typeBridge").equals("setTimeOut")) {
            result.putString("resultSetTimeOut", String.valueOf(BridgeService.SetTimeout(configReceived)));

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventSetTimeOut", result);


        } else if (configReceived.getString("typeBridge").equals("getServer")) {
            BridgeService.GetServer();
        } else if (configReceived.getString("typeBridge").equals("setServer")) {
            BridgeService.SetServer(configReceived);
        }
    }

    @ReactMethod
    public void sendNfceOption(ReadableMap map) {
        Log.d("DEBUG", "oxe " + map.toString());

        if (map.getString("typeNfce").equals("CONFIGURATE_XML_NFCE"))
            configurateXmlNfce();
        else
            sendSaleNfce(map);
    }

    private void sendSaleNfce(ReadableMap map) {
        final String productName = map.getString("productName");
        final String productPrice = map.getString("productPrice");

        //É feita uma venda antes da venda antes para que a nossa venda não seja omitida, isso é necessário em servidor de homologação
        preSale();

        //Configuramos a venda com os dados da tela
        try {
            it4rObj.venderItem(productName, productPrice, "123456789012");
        } catch (DarumaException e) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventSendSaleNfce", "Erro na configuração da venda " + e.getMessage());
            e.printStackTrace();
            return;
        }

        //Variável para guardar o status da emissão, caso seja offline o tempo de emissão não deve ser passado
        boolean wasNfceEmittedOnline = true;

        //Encerramos a venda emitindo a nota para o servidor
        try {
            it4rObj.encerrarVenda(productPrice, "Dinheiro");
        } catch (DarumaException e) {
            wasNfceEmittedOnline = false;
        }

        StringBuilder returnSendSaleNfce = new StringBuilder();

        if (wasNfceEmittedOnline)
            returnSendSaleNfce.append("NFC-e emitida com sucesso!" + "|" + (it4rObj.getTimeElapsedInLastEmission().get() / 1000) + "|" + it4rObj.getNumeroNota() + "|" + it4rObj.getNumeroSerie());
        else
            returnSendSaleNfce.append("Erro ao emitir NFC-e online, a impressão será da nota em contingência!" + "|" + it4rObj.getNumeroNota() + "|" + it4rObj.getNumeroSerie());

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("eventSendSaleNfce", returnSendSaleNfce.toString());

        //Impressão da NFC-e
        final WritableMap mapValues = Arguments.createMap();

        mapValues.putString("xmlNFCe", getTextOfFile());
        mapValues.putInt("indexcsc", 1);
        mapValues.putString("csc", "1A451E99-0FE0-4C13-B97E-67D698FFBC37");
        mapValues.putInt("param", 0);
        mapValues.putInt("quant", 10);

        final int printerReturn = Printer.imprimeXMLNFCe(mapValues);
        Printer.cutPaper(mapValues);
        Log.d("DEBUG", String.valueOf(printerReturn));
    }

    //Função que lê o xml que representa a nota NFC-e emitida e retorna uma String com o conteúdo
    private String getTextOfFile() {
        String strFile = "";

        strFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/EnvioWS.xml";

        String strFileContent = "";
        File file = new File(strFile);

        if (file.exists()) {
            FileInputStream fis2 = null;
            try {
                fis2 = new FileInputStream(file);
                char current;
                while (fis2.available() > 0) {
                    current = ((char) fis2.read());
                    strFileContent = strFileContent + String.valueOf(current);
                }

            } catch (Exception e) {
                Log.d("TourGuide", e.toString());
            } finally {
                if (fis2 != null) try {
                    fis2.close();
                } catch (Exception e) {

                }
            }
        }
        return strFileContent;
    }

    private void preSale() {
        try {
            it4rObj.venderItem("I", "0.00", "123456789011");
        } catch (DarumaException e) {
            e.printStackTrace();
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventSendSaleNfce", "Erro na configuração da venda " + e.getMessage());
            return;
        }
    }
}