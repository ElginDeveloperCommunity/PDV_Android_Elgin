package com.elgin.flutter_m8;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;

import androidx.annotation.NonNull;

import com.google.zxing.integration.android.IntentIntegrator;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import io.flutter.embedding.android.FlutterActivity;
import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.plugin.common.BinaryMessenger;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugins.GeneratedPluginRegistrant;

import br.com.setis.interfaceautomacao.Operacoes;

public class MainActivity extends FlutterActivity {
    public static MethodChannel.Result resultFlutter;

    Bundle bundle = new Bundle();
    Printer printer;
    Balanca balanca;
    Paygo paygo;
    ServiceSat serviceSat;
    Activity activity;
    private IntentIntegrator qrScan;

    Intent intentSitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");
    private String CHANNEL = "samples.flutter.elgin/Printer";

    @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
        GeneratedPluginRegistrant.registerWith(flutterEngine);

        activity = this;
        printer = new Printer(activity);
        paygo = new Paygo(activity);
        balanca = new Balanca(activity);
        serviceSat = new ServiceSat(activity);

        BinaryMessenger binaryMessenger = flutterEngine.getDartExecutor().getBinaryMessenger();
        new MethodChannel(binaryMessenger, CHANNEL).setMethodCallHandler((call, result) -> {
            bundle = new Bundle();
            resultFlutter = result;
            if (call.method.equals("mSitef")) {
                runMsitef(call);
            }
            if (call.method.equals("printer")) {
                HashMap map = call.argument("args");
                formatActionPrinter(map);
            }
            if (call.method.equals("sat")) {
                Map map = call.argument("args");
                formatActionSat(map);
            }
            if(call.method.equals("paygo")){
                Map map = call.argument("args");
                runPayGo(map);
            }
            if(call.method.equals("balanca")){
                Map map = call.argument("args");
                formatActionBalanca(map);
            }
        });
    }

    public void formatActionSat(Map map) {    
       String resultSat = "...";

       if(Objects.equals(map.get("typeSatCommand"), "ativarSat")){
           resultSat = serviceSat.ativarSAT(map);
       }else if(Objects.equals(map.get("typeSatCommand"), "associarSat")){
           resultSat = serviceSat.associarAssinatura(map);
       }else if(Objects.equals(map.get("typeSatCommand"), "consultarSat")){
            resultSat = serviceSat.consultarSAT(map);
       }else if(Objects.equals(map.get("typeSatCommand"), "statusOperacionalSat")){
            resultSat = serviceSat.statusOperacional(map);
        }else if(Objects.equals(map.get("typeSatCommand"), "enviarVendaSat")){
           resultSat = serviceSat.enviarVenda(map);
       }else if(Objects.equals(map.get("typeSatCommand"), "cancelarVendaSat")){
           resultSat = serviceSat.cancelarVenda(map);
       }else if(Objects.equals(map.get("typeSatCommand"), "extrairLogSat")){
           resultSat = serviceSat.extrairLog(map);
       }else{
           resultFlutter.notImplemented();
           return;
       }

       resultFlutter.success(resultSat);
    }

    public void formatActionBalanca(Map map){
        String result = "...";
        if(Objects.equals(map.get("typeOption"), "configBalanca")){
            result = balanca.configBalanca(map);
        }else if(Objects.equals(map.get("typeOption"), "lerPesoBalanca")){
            result = balanca.lerPesoBalanca();
        }else {
            resultFlutter.notImplemented();
            return;
        }
        resultFlutter.success(result);
    }

    public void formatActionPrinter(Map map) {
        int result = -1;
        if (Objects.equals(map.get("typePrinter"), "printerText")) {
            result = printer.imprimeTexto(map);

        } else if(Objects.equals(map.get("typePrinter"), "printerCupomTEF")){
            result = printer.imprimeCupomTEF(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerBarCode")) {
            result = printer.imprimeBarCode(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerQrCode")) {
            result = printer.imprimeQR_CODE(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerImage")) {
            result = printer.imprimeImagem(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerNFCe")) {
            result = printer.imprimeXMLNFCe(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerSAT")) {
            result = printer.imprimeXMLSAT(map);

        } else if (Objects.equals(map.get("typePrinter"), "jumpLine")) {
            result = printer.AvancaLinhas(map);

        } else if (Objects.equals(map.get("typePrinter"), "gavetaStatus")) {
            result = printer.statusGaveta();

        } else if (Objects.equals(map.get("typePrinter"), "abrirGaveta")) {
            result = printer.abrirGaveta();

        } else if (Objects.equals(map.get("typePrinter"), "printerStatus")) {
            result = printer.statusSensorPapel();

        } else if (Objects.equals(map.get("typePrinter"), "cutPaper")) {
            result = printer.cutPaper(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerConnectExternal")) {
            String ip = (String) map.get("ip");
            int port = (int) map.get("port");
            result = printer.printerExternalImpStart(ip, port);
        } else if (Objects.equals(map.get("typePrinter"), "printerConnectInternal")) {
            result = printer.printerInternalImpStart();
        } else {
            resultFlutter.notImplemented();
            return;
        }
        resultFlutter.success(result);
    }

    public void runPayGo(Map map){
        if(Objects.equals(map.get("typeOption"), "VENDA")){
            paygo.efetuaTransacao(Operacoes.VENDA, map);

        }else if(Objects.equals(map.get("typeOption"), "CANCELAMENTO")){
            paygo.efetuaTransacao(Operacoes.CANCELAMENTO, map);

        }else {
            paygo.efetuaTransacao(Operacoes.ADMINISTRATIVA, map);
        }
    }

    public void runMsitef(MethodCall call) {
        Map<String, String> map = call.argument("args");
        for (String key : map.keySet()) {
            if (map.get(key).equals("")) map.put(key, null);
            bundle.putString(key, map.get(key));
        }
        intentSitef.putExtras(bundle);
        startActivityForResult(intentSitef, 4321);
    }

    public String bundleToJson(Intent dataSitef) {
        JSONObject json = new JSONObject();
        Bundle bundle = dataSitef.getExtras();
        Set<String> keys = bundle.keySet();
        for (String key : keys) {
            try {
                json.put(key, JSONObject.wrap(bundle.get(key)));
            } catch (JSONException e) {
            }
        }
        return json.toString();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 4321) {
            if (resultCode == RESULT_OK || resultCode == RESULT_CANCELED && data != null) {
                resultFlutter.success(bundleToJson(data));
            } else {
                resultFlutter.notImplemented();
            }
        }
        if (requestCode == 3) {
            if (data.getStringExtra("retorno").equals("0")) {
                if(data.getStringExtra("erro") != null){
                    resultFlutter.success(data.getStringExtra("erro"));
                }else{
                    System.out.println("RETORNO: " + data.getStringExtra("mensagem"));
                    resultFlutter.success("ERRO");
                }
            } else {
                resultFlutter.success(data.getStringExtra("mensagem"));
            }
        }
    }
}
