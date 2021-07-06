package com.elginm8;

 // replace com.your-app-name with your app’s name
 import com.facebook.react.bridge.NativeModule;
 import com.facebook.react.bridge.ReactApplicationContext;
 import com.facebook.react.bridge.ReactContext;
 import com.facebook.react.bridge.ReactContextBaseJavaModule;
 import com.facebook.react.bridge.ReactMethod;
 import java.util.Map;
 import java.util.HashMap;

 //IMPORTAÇÕES PARA FUNCIONALIDADE M-SITEF
import org.json.JSONObject;
import android.widget.Toast;
import org.json.JSONException;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import static android.app.Activity.RESULT_OK;
import static android.app.Activity.RESULT_CANCELED;
import com.facebook.react.bridge.ActivityEventListener;
import com.google.zxing.integration.android.IntentResult;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.google.zxing.integration.android.IntentIntegrator;

//LIBS QUE PERMITER ENVIAR OS DADOS PARA APLICAÇÃO EM JAVASCRIPT 
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import br.com.setis.interfaceautomacao.Operacoes;

import com.elginm8.PayGo;
import com.elginm8.Printer;


public class ToastModules extends ReactContextBaseJavaModule implements ActivityEventListener {
    public static ReactApplicationContext reactContext;

    Bundle instanceBundle = new Bundle();

    ToastModules(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "ToastModules";
    }

    public void onNewIntent(Intent intent){}

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data){
        IntentResult resultIntent = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);

        if(requestCode == 4321) {
            if (resultCode == RESULT_OK || resultCode == RESULT_CANCELED && data != null) {
                try {
                    WritableMap result = Arguments.createMap();

                    result.putString("restultMsitef", convertResultFromJSON(data));
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

        convertJSON.put("CODRESP", receiveResult.getStringExtra("CODRESP"));
        convertJSON.put("COMP_DADOS_CONF", receiveResult.getStringExtra("COMP_DADOS_CONF"));
        convertJSON.put("CODTRANS", receiveResult.getStringExtra("CODTRANS"));
        convertJSON.put("VLTROCO", receiveResult.getStringExtra("VLTROCO"));
        convertJSON.put("REDE_AUT", receiveResult.getStringExtra("REDE_AUT"));
        convertJSON.put("BANDEIRA", receiveResult.getStringExtra("BANDEIRA"));
        convertJSON.put("NSU_SITEF", receiveResult.getStringExtra("NSU_SITEF"));
        convertJSON.put("NSU_HOST", receiveResult.getStringExtra("NSU_HOST"));
        convertJSON.put("COD_AUTORIZACAO", receiveResult.getStringExtra("COD_AUTORIZACAO"));
        convertJSON.put("NUM_PARC", receiveResult.getStringExtra("NUM_PARC"));
        convertJSON.put("TIPO_PARC", receiveResult.getStringExtra("TIPO_PARC"));
        convertJSON.put("VIA_ESTABELECIMENTO", receiveResult.getStringExtra("VIA_ESTABELECIMENTO"));
        convertJSON.put("VIA_CLIENTE", receiveResult.getStringExtra("VIA_CLIENTE"));

        return convertJSON.toString();
    }

    @ReactMethod
    public void runMsiTef(ReadableMap configsReceived){
        Intent intentToMsitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");
        Activity thisActivity = getCurrentActivity();

        instanceBundle = new Bundle();

        ReadableMapKeySetIterator iterator = configsReceived.keySetIterator();
        while(iterator.hasNextKey()){
            String key = iterator.nextKey();
            instanceBundle.putString(key, configsReceived.getString(key));
        }

        intentToMsitef.putExtras(instanceBundle);

        thisActivity.startActivityForResult(intentToMsitef, 4321);
    }

    @ReactMethod
    public void runPayGo(ReadableMap configsReceived){
        if(configsReceived.getString("typeOption").equals("VENDA")){
            PayGo.efetuaTransacao(Operacoes.VENDA, configsReceived);

        }else if(configsReceived.getString("typeOption").equals("CANCELAMENTO")){
            PayGo.efetuaTransacao(Operacoes.CANCELAMENTO, configsReceived);

        }else {
            PayGo.efetuaTransacao(Operacoes.ADMINISTRATIVA, configsReceived);
        }
    }

    @ReactMethod
    public void sendOptionsClassPrinter(ReadableMap configsReceived){
        WritableMap result = Arguments.createMap();

        if(configsReceived.getString("typePrinter").equals("printerConnectInternal")){
            Printer.printerInternalImpStart();

        }else if(configsReceived.getString("typePrinter").equals("connectPrinterExtern")){
            Printer.printerExternalImpStart(configsReceived);

        }else if(configsReceived.getString("typePrinter").equals("printerCupomTEF")){
            Printer.imprimeCupomTEF(configsReceived);

        }else if(configsReceived.getString("typePrinter").equals("printerText")){
            Printer.imprimeTexto(configsReceived);

        }else if(configsReceived.getString("typePrinter").equals("printerBarCode")){
            Printer.imprimeBarCode(configsReceived);

        }else if(configsReceived.getString("typePrinter").equals("printerBarCodeTypeQrCode")){
            Printer.imprimeQR_CODE(configsReceived);

        }else if(configsReceived.getString("typePrinter").equals("printerImage")){
            Printer.imprimeImagem(configsReceived); 

        }else if(configsReceived.getString("typePrinter").equals("printerNFCe")){
            Printer.imprimeXMLNFCe(configsReceived);

        }else if(configsReceived.getString("typePrinter").equals("printerSAT")){
            Printer.imprimeXMLSAT(configsReceived);

        }else if(configsReceived.getString("typePrinter").equals("gavetaStatus")){
            result.putString("statusGaveta", String.valueOf(Printer.statusGaveta()));

            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("eventStatusGaveta", result);

        }else if(configsReceived.getString("typePrinter").equals("abrirGaveta")){
            Printer.abrirGaveta();

        }else if(configsReceived.getString("typePrinter").equals("jumpLine")){
            Printer.AvancaLinhas(configsReceived);

        }else if(configsReceived.getString("typePrinter").equals("cutPaper")){
            Printer.cutPaper(configsReceived);

        }else if(configsReceived.getString("typePrinter").equals("statusPrinter")){
            result.putString("statusPrinter", String.valueOf(Printer.statusSensorPapel()));

            reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("eventStatusPrinter", result);
        }
    }
}