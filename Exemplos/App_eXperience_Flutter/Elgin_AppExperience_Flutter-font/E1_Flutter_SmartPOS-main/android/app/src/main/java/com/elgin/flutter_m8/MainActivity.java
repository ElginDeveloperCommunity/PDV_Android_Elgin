package com.elgin.flutter_m8;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.elgin.e1.Pagamento.ElginPay;
import com.elgin.e1.Scanner.Scanner;
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


    ElginPayService elginPayService;
    //ServiceSat serviceSat;
    Activity activity;
    MethodChannel methodChannel;
    public static Context mContext;
    private IntentIntegrator qrScan;

    Intent intentSitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");
    private String CHANNEL = "samples.flutter.elgin/ElginServices";

    @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
        GeneratedPluginRegistrant.registerWith(flutterEngine);

        activity = this;
        mContext = this;

        elginPayService = new ElginPayService(this);


        printer = new Printer(activity);

        BinaryMessenger binaryMessenger = flutterEngine.getDartExecutor().getBinaryMessenger();
        methodChannel = new MethodChannel(binaryMessenger, CHANNEL);
        elginPayService.methodChannel = methodChannel;
        methodChannel.setMethodCallHandler((call, result) -> {
            bundle = new Bundle();
            resultFlutter = result;

            if (call.method.equals("printer")) {
                HashMap map = call.argument("args");
                formatActionPrinter(map);
            }

            if(call.method.equals("scanner")){
                Intent in = Scanner.getScanner(this);
                startActivityForResult(in, 1);
            }

            if(call.method.equals("elginpay")){

                Map map = call.argument("args");
                formatActionElginPay(map);
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if(printer.statusGaveta() != -4){
            Log.d("DEBUG", "PRINTER INITIALIZED, STOPPING IT...");
            printer.printerStop();
        }
        else{
            Log.d("DEBUG", "PRINTER NOT INITIALIZED, DOING NOTHING ON ONDESTROY()..");
        }
    }


    public int finaciamentoValue(String financiamento){
        if(financiamento.equals("Avista")){
            return 1;
        }
        else if(financiamento.equals("Adm")){
            return 2;
        }
        else{
            return 3;
        }
    }


    //ElginPay enumerator for action formatting
    public enum FunctionsElginPay{
        INICIA_VENDA_DEBITO,
        INICIA_VENDA_CREDITO,
        INICIA_CANCELAMENTO_VENDA,
        INICIA_OPERACAO_ADMINISTRATIVA,
        SET_CUSTOM_LAYOUT_ON,
        SET_CUSTOM_LAYOUT_OFF
    }

    public void formatActionElginPay(Map map){

        try {
            String valor = (String) map.get("value");
            String typeElginpay = (String) map.get("typeElginpay");

            if(typeElginpay.equals(FunctionsElginPay.INICIA_VENDA_DEBITO.name())){
                elginPayService.iniciaVendaDebito(valor);
                resultFlutter.success("success");
            }
            else if(typeElginpay.equals(FunctionsElginPay.INICIA_VENDA_CREDITO.name())){
                int tipoFinanciamento = finaciamentoValue((String) map.get("installmentMethod"));
                int numeroParcelas = (int) map.get("numberOfInstallments");

                elginPayService.iniciaVendaCredito(valor, tipoFinanciamento, numeroParcelas);
                resultFlutter.success("success");
            }
            else if(typeElginpay.equals(FunctionsElginPay.INICIA_CANCELAMENTO_VENDA.name())){
                String saleRef = (String) map.get("saleRef");
                String date = (String) map.get("date");

                elginPayService.iniciaCancelamentoVenda(valor, saleRef, date);

                resultFlutter.success("success");
            } else if(typeElginpay.equals(FunctionsElginPay.INICIA_OPERACAO_ADMINISTRATIVA.name())){
                elginPayService.iniciaOperacaoAdministrativa();

                resultFlutter.success("success");
            } else if (typeElginpay.equals(FunctionsElginPay.SET_CUSTOM_LAYOUT_ON.name())) {
                elginPayService.setCustomLayoutOn();

                resultFlutter.success("success");
            } else if(typeElginpay.equals(FunctionsElginPay.SET_CUSTOM_LAYOUT_OFF.name())){
                elginPayService.setCustomLayoutOff();

                resultFlutter.success("success");
            }
            else {
                resultFlutter.notImplemented();
            }
        }catch (NullPointerException nullPointerException){
            Log.d("Error ", nullPointerException.toString());
            resultFlutter.notImplemented();
        }
    }

    //Funções da impressora
    public enum PrinterFunctions{
        PRINTER_TEXT,
        PRINTER_BAR_CODE,
        PRINTER_QR_CODE,
        PRINTER_IMAGE,
        PRINTER_NFCE,
        PRINTER_SAT,
        PRINTER_STATUS,
        GAVETA_STATUS,
        PRINTER_CUPOM_TEF,
        PRINTER_CONNECT_EXTERNAL,
        PRINTER_CONNECT_INTERNAL,
        ABRIR_GAVETA,
        JUMP_LINE,
        CUT_PAPER
    }

    public void formatActionPrinter(Map map) {
        int result = -1;

        try{
            String typePrinter = (String) map.get("typePrinter");

            if (typePrinter.equals(PrinterFunctions.PRINTER_TEXT.name())) result = printer.imprimeTexto(map);
            else if (typePrinter.equals(PrinterFunctions.PRINTER_CUPOM_TEF.name())) result = printer.imprimeCupomTEF(map);
            else if (typePrinter.equals(PrinterFunctions.PRINTER_BAR_CODE.name())) result = printer.imprimeBarCode(map);
            else if (typePrinter.equals(PrinterFunctions.PRINTER_QR_CODE.name())) result = printer.imprimeQR_CODE(map);
            else if (typePrinter.equals(PrinterFunctions.PRINTER_IMAGE.name())) result = printer.imprimeImagem(map);
            else if (typePrinter.equals(PrinterFunctions.PRINTER_NFCE.name())) result = printer.imprimeXMLNFCe(map);
            else if (typePrinter.equals(PrinterFunctions.PRINTER_SAT.name())) result = printer.imprimeXMLSAT(map);
            else if (typePrinter.equals(PrinterFunctions.JUMP_LINE.name())) result = printer.AvancaLinhas(map);
            else if (typePrinter.equals(PrinterFunctions.GAVETA_STATUS.name())) result = printer.statusGaveta();
            else if (typePrinter.equals(PrinterFunctions.ABRIR_GAVETA.name())) result = printer.abrirGaveta();
            else if (typePrinter.equals(PrinterFunctions.PRINTER_STATUS.name())) result = printer.statusSensorPapel();
            else if (typePrinter.equals(PrinterFunctions.CUT_PAPER.name())) result = printer.cutPaper(map);
            else if (typePrinter.equals(PrinterFunctions.PRINTER_CONNECT_EXTERNAL.name())){
                String ip = (String) map.get("ip");
                int port = (int) map.get("port");

                result = printer.printerExternalImpStart(ip, port);
            }
            else if (typePrinter.equals(PrinterFunctions.PRINTER_CONNECT_INTERNAL.name())) result = printer.printerInternalImpStart();
            else{
                resultFlutter.notImplemented();
                return;
            }
            resultFlutter.success(result);
        }catch (NullPointerException nullPointerException){
            Log.d("Error ", nullPointerException.toString());
            resultFlutter.notImplemented();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

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
        if(requestCode == 1){
            if (resultCode == 2) {
                String[] result = data.getStringArrayExtra("result");
                CharSequence cs;

                if (result[0].equals("1")) {
                    cs =  result[1] + ":+-" + result[3];
                    resultFlutter.success(cs);
                } else {
                    cs = "Erro # " + result[0] + " na leitura do código.";
                    Toast.makeText(this, cs, Toast.LENGTH_LONG).show();
                    resultFlutter.success("error");
                }
            }
        }
    }

    public void alertMessageStatus(String titleAlert, String messageAlert){
        AlertDialog alertDialog = new AlertDialog.Builder(this).create();
        alertDialog.setTitle(titleAlert);
        alertDialog.setMessage(messageAlert);
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
        alertDialog.show();
    }
}
