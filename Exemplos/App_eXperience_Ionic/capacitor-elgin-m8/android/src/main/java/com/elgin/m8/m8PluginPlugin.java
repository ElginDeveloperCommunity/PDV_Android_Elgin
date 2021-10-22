package com.elgin.m8;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.net.Uri;
import android.provider.MediaStore;

import android.util.Base64;
import android.util.Log;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import br.com.setis.interfaceautomacao.Operacoes;


@CapacitorPlugin(name = "m8Plugin")
public class m8PluginPlugin extends Plugin {

    public static Activity mActivity;
    public static Context mContext;

    private m8Plugin implementation = new m8Plugin();

    //Printer Object
    public static Printer printerInstance;

    //Intent MSiTef
    Intent intentToMsitef;

    //Paygo Object
    private Paygo paygo;

    //Sat Object
    public ServiceSat serviceSat;

    //Balança Object
    public Balanca balanca;

    @Override
    public void load() {
        super.load();
        //Inicializando objetos que necessitam de referencias de atividade/contexto

        mActivity = this.getActivity();
        mContext = this.getContext();

        printerInstance = new Printer(mActivity);
        printerInstance.setDefaultImage();


        paygo = new Paygo(mActivity);

        serviceSat = new ServiceSat(mContext);

        balanca = new Balanca(mActivity);

        //MSitef
        intentToMsitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");
    }

    @PluginMethod
    public void resetDefaultImage(PluginCall call){
        this.printerInstance.setDefaultImage();
        call.resolve();
    }

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");
        JSObject ret = new JSObject();
        Map<String, Object > map = new HashMap<String, Object>();

        map.put("quant", 10);
        int result = this.printerInstance.imprimeImagem();

        ret.put("response", result);

        printerInstance.AvancaLinhas(map);
        if(call.getBoolean("cutPaper")) printerInstance.cutPaper(map);

        call.resolve(ret);
    }

    @PluginMethod
    public void printImage(PluginCall call){
        JSObject ret = new JSObject();
        Map<String, Object > map = new HashMap<String, Object>();

        map.put("quant", 10);
        int result = this.printerInstance.imprimeImagem();

        ret.put("response", result);

        printerInstance.AvancaLinhas(map);
        if(call.getBoolean("cutPaper")) printerInstance.cutPaper(map);

        call.resolve(ret);

    }

    @PluginMethod
    public void printerStop(PluginCall call){
        try{
            printerInstance.printerStop();
            call.resolve();
        }catch (Exception e){
            call.reject("printerStop error: "  + e.toString());
        }
    }


    @PluginMethod
    public void printerInternalImpStart(PluginCall call) {

        JSObject ret = new JSObject();
        try{
            int result = printerInstance.printerInternalImpStart();
            ret.put("response", result);
            call.resolve(ret);
        }catch (Exception e){
            call.reject("printerInternalImpStart error:" + e.toString());
        }
    }

    @PluginMethod
    public void printerExternalImpStart(PluginCall call){
        JSObject ret = new JSObject();

        Map<String, Object > map = new HashMap<String, Object>();
        try{
            String Ip = call.getString("Ip");


            int dividerIndex = Ip.indexOf(':');
            String ip = Ip.substring(0, dividerIndex);
            String port = Ip.substring(dividerIndex + 1);

            int portAsInt = Integer.parseInt(port);

            map.put("ip", ip);
            map.put("port", portAsInt);

            int result = this.printerInstance.printerExternalImpStart(map);

            ret.put("response", result);
            call.resolve(ret);
        }catch (Exception e){
            call.reject("printerExternalImpStart error:" + e.toString());
        }
    }

    @PluginMethod
    public void printXmlSat(PluginCall call){
        JSObject ret = new JSObject();


        Map<String, Object > map = new HashMap<String, Object>();

        try{
            map.put("xmlSAT",  call.getString( "xmlSAT"));
            map.put("param", 0);
            map.put("quant", 10);

            int result = printerInstance.imprimeXMLSAT(map);
            printerInstance.AvancaLinhas(map);

            if(call.getBoolean("cutPaper")) printerInstance.cutPaper(map);


            ret.put("response", result);
            call.resolve(ret);
        }catch (Exception e){
            call.reject("printXmlSat error:"  + e.toString());
        }

    }

    @PluginMethod
    public void printXmlNFCe(PluginCall call){
        JSObject ret = new JSObject();


        Map<String, Object > map = new HashMap<String, Object>();

        try{
            map.put("xmlNFCe",  call.getString( "xmlNFCe"));
            map.put("indexcsc", 1);
            map.put("csc", "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES" );
            map.put("param", 0);
            map.put("quant", 10);

            int result = printerInstance.imprimeXMLNFCe(map);
            printerInstance.AvancaLinhas(map);

            if(call.getBoolean("cutPaper")) printerInstance.cutPaper(map);

            ret.put("response", result);
            call.resolve(ret);
        }catch (Exception e){

            call.reject("printXmlSat error:"  + e.toString());
        }

    }

    @PluginMethod
    public void printText(PluginCall call){
        JSObject ret = new JSObject();

        Map<String, Object > map = new HashMap<String, Object>();

        try{
            map.put("text", call.getString("message"));
            map.put("align", call.getString("alignment"));
            map.put("font", call.getString("font"));
            map.put("fontSize", call.getInt("fontSize"));
            map.put("quant", 10);
            map.put("isBold", call.getBoolean("isBold"));
            map.put("isUnderline", call.getBoolean("isUnderline"));


            int result = printerInstance.imprimeTexto(map);
            printerInstance.AvancaLinhas(map);

            if(call.getBoolean("cutPaper")) printerInstance.cutPaper(map);

            ret.put("response", result);
            call.resolve(ret);
        }catch (Exception e){
            call.reject("printText error:" + e.toString());
        }

    }

    @PluginMethod
    public void printerStatus(PluginCall call){
        JSObject ret = new JSObject();

        int statusSensorPapel = this.printerInstance.statusSensorPapel();


        if(statusSensorPapel == 5) ret.put("response", "Papel está presente e não está próximo do fim!");
        else if (statusSensorPapel == 6) ret.put("reponse" , "Papel próximo do fim!" );
        else if (statusSensorPapel == 7) ret.put("response", "Papel ausente!");
        else ret.put("response", "Status Desconhecido");

        call.resolve(ret);
    }

    @PluginMethod
    public void drawerStatus(PluginCall call){
        JSObject ret = new JSObject();

        int statusGaveta = this.printerInstance.statusGaveta();

        if(statusGaveta == 1) ret.put("response", "Gaveta aberta!");
        else if(statusGaveta == 2) ret.put("response", "Gaveta fechada!");
        else ret.put("response", "Status Desconhecido!");

        call.resolve(ret);
    }

    @PluginMethod
    public void openDrawer(PluginCall call){
        JSObject ret = new JSObject();

        int resultadoAbrirGaveta = this.printerInstance.abrirGaveta();

        ret.put("response", resultadoAbrirGaveta);

        call.resolve(ret);
    }

    @PluginMethod
    public void printBarcode(PluginCall call){
        JSObject ret = new JSObject();

        Map<String, Object > map = new HashMap<String, Object>();

        try{
            if(call.getString("barCodeType").equals("QR CODE")){

                map.put("text", call.getString("code"));
                map.put("qrSize", call.getInt("width"));
                map.put("align", call.getString("alignment"));
                map.put("quant", 10);


                int result = printerInstance.imprimeQR_CODE(map);
                printerInstance.AvancaLinhas(map);

                if(call.getBoolean("cutPaper")) printerInstance.cutPaper(map);

                ret.put("response", result);
            }
            else {

                map.put("barCodeType", call.getString("barCodeType"));
                map.put("text", call.getString("code"));
                map.put("height", call.getInt("height"));
                map.put("width", call.getInt("width"));
                map.put("align", call.getString("alignment"));
                map.put("quant", 10);


                int result = printerInstance.imprimeBarCode(map);
                printerInstance.AvancaLinhas(map);


                if(call.getBoolean("cutPaper")) printerInstance.cutPaper(map);


                ret.put("response", result);
            }
            call.resolve(ret);
        }catch (Exception e){
            call.reject("printBarcode error" + e.toString());
        }
    }

    @PluginMethod
    public void chooseImage(PluginCall call){
        Intent intent = new Intent((Intent.ACTION_PICK));
        intent.setType("image/*");
        startActivityForResult(call, intent, "chooseImageResult");
    }

    @ActivityCallback
    private void chooseImageResult(PluginCall call, ActivityResult result) throws IOException {
            if (result.getResultCode() == Activity.RESULT_CANCELED) {
                   call.reject("Activity canceled");
                } else {
                   Intent intent = result.getData();

                   if(intent != null){
                       final Uri uri = intent.getData();
                       JSObject ret = new JSObject();
                       ret.put("imageAsBase64", getBase64FromUri(uri));

                       printerInstance.selectedImageBitmap =  MediaStore.Images.Media.getBitmap(this.getContext().getContentResolver(), uri);
                       call.resolve(ret);
                   }



                    call.reject("Houve um erro durante a seleção de imagem!");

                }
    }

    private String getBase64FromUri(Uri uri) throws IOException {
        Bitmap bitmap = MediaStore.Images.Media.getBitmap(this.getContext().getContentResolver(), uri);

        Bitmap useThis = getResizedBitmap(bitmap,150,150);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        useThis.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream .toByteArray();

        return Base64.encodeToString(byteArray, Base64.DEFAULT).replaceAll("\\s","");
    }

    public static Bitmap getResizedBitmap(Bitmap bm, int newWidth, int newHeight) {
        int width = bm.getWidth();
        int height = bm.getHeight();
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;
        // CREATE A MATRIX FOR THE MANIPULATION
        Matrix matrix = new Matrix();
        // RESIZE THE BIT MAP
        matrix.postScale(scaleWidth, scaleHeight);

        // "RECREATE" THE NEW BITMAP
        Bitmap resizedBitmap = Bitmap.createBitmap(
                bm, 0, 0, width, height, matrix, false);
        bm.recycle();
        return resizedBitmap;
    }

    @PluginMethod
    public void sendSitefParams(PluginCall call){

        //getting values from Ionic
        try{
            String action = call.getString("action");

            String ip = call.getString("ip");
            String value = call.getString("value");

            String paymentMethod = call.getString("paymentMethod");
            String installments = call.getString("installments");

            //PARAMS DEFAULT TO ALL ACTIONS OF M-SITEF
            intentToMsitef.putExtra("empresaSitef", "00000000");
            intentToMsitef.putExtra("enderecoSitef", ip);
            intentToMsitef.putExtra("operador", "0001");
            intentToMsitef.putExtra("data", "20200324");
            intentToMsitef.putExtra("hora", "130358");
            intentToMsitef.putExtra("numeroCupom",  Integer.toString(new Random().nextInt(99999)));
            intentToMsitef.putExtra("valor", value);
            intentToMsitef.putExtra("CNPJ_CPF", "14200166000166");
            intentToMsitef.putExtra("comExterna", "0");

            if(action.equals("SALE")){
                intentToMsitef.putExtra("modalidade", PaymentToYourCode(paymentMethod));

                if(paymentMethod.equals("Crédito")){
                    if(installments.equals("0") || installments.equals("1")){
                        intentToMsitef.putExtra("transacoesHabilitadas", "26");
                        intentToMsitef.putExtra("numParcelas", "");
                    }
                    else if(paymentMethod.equals("Loja")){
                        intentToMsitef.putExtra("transacoesHabilitadas", "27");

                    }else if(paymentMethod.equals("Adm")){
                        intentToMsitef.putExtra("transacoesHabilitadas", "28");
                    }

                    intentToMsitef.putExtra("numParcelas", installments);
                }

                if(paymentMethod.equals("Débito")){
                    intentToMsitef.putExtra("transacoesHabilitadas", "16");
                    intentToMsitef.putExtra("numParcelas", "");
                }

                if(paymentMethod.equals("Todos")){
                    intentToMsitef.putExtra("restricoes", "transacoesHabilitadas=16");
                    intentToMsitef.putExtra("transacoesHabilitadas", "");
                    intentToMsitef.putExtra("numParcelas", "");
                }

            }

            if(action.equals("CANCEL")){
                intentToMsitef.putExtra("modalidade", "200");
                intentToMsitef.putExtra("transacoesHabilitadas", "");
                intentToMsitef.putExtra("isDoubleValidation", "0");
                intentToMsitef.putExtra("restricoes", "");
                intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm");
            }

            if(action.equals("CONFIGS")){
                intentToMsitef.putExtra("modalidade", "110");
                intentToMsitef.putExtra("isDoubleValidation", "0");
                intentToMsitef.putExtra("restricoes", "");
                intentToMsitef.putExtra("transacoesHabilitadas", "");
                intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm");
                intentToMsitef.putExtra("restricoes", "transacoesHabilitadas=16;26;27");
            }

            startActivityForResult(call, intentToMsitef, "MsitefResult");

        }catch(Exception e){
            call.reject("Houve um erro com a passagem de parâmetros do M-Sitef" + e.toString());
        }

    }

    @ActivityCallback
    private void MsitefResult(PluginCall call, ActivityResult result) throws IOException {
        if (result.getResultCode() == Activity.RESULT_CANCELED) {
            call.reject("Activity canceled");
        } else {
            Intent data = result.getData();

            if(data != null){
                if (Integer.parseInt(data.getStringExtra("CODRESP")) < 0 && data.getStringExtra("COD_AUTORIZACAO").equals("")) {

                    alertMessageStatus("Alerta", "Ocorreu um erro durante a transação.");
                    call.reject("Ocorreu um erro durante a transação.");
                }
                else{
                    JSObject ret = new JSObject();

                    String viaClienteMsitef = data.getStringExtra("VIA_CLIENTE");
                    ret.put("VIA_CLIENTE", viaClienteMsitef);

                    printerViaVlienteMsitef(viaClienteMsitef);
                    alertMessageStatus("Alerta", "Ação realizada com sucesso.");
                    call.resolve(ret);
                }


            } else{
                alertMessageStatus("Alerta", "Ocorreu um erro durante a transação.");
                call.reject("Ocorreu um erro durante a transação.");
            }




            call.reject("Ocorreu um erro durante a transação.");
        }
    }

    @PluginMethod
    public void sendPaygoParams(PluginCall call){
        Map<String, Object > map = new HashMap<String, Object>();

        try{
            paygo.setPluginCall(call);

            String action = call.getString("action");


            if (action.equals("SALE") || action.equals("CANCEL") ){
                String valor = call.getString("valor");

                map.put("valor", valor);

                int parcelas = call.getInt("parcelas");

                map.put("parcelas", parcelas);

                String formaPagamento = call.getString("formaPagamento");

                map.put("formaPagamento", formaPagamento);

                String tipoParcelamento = call.getString("tipoParcelamento");

                map.put("tipoParcelamento", tipoParcelamento);

                if(action.equals("SALE")){
                    paygo.efetuaTransacao(Operacoes.VENDA, map);
                }else if(action.equals("CANCEL")){
                    paygo.efetuaTransacao(Operacoes.CANCELAMENTO, map);
                }
            }
            else{
                paygo.efetuaTransacao(Operacoes.ADMINISTRATIVA, map);
            }
        }catch (Exception e){
            call.reject("sendPaygoParmserror : " + e.toString());
        }

    }


    //SAT METHODS

    @PluginMethod
    public void sendAtivarSAT(PluginCall call){
        String retorno = "...";

        Map<String, Object> mapValues = new HashMap<>();
        JSObject ret = new JSObject();

        try {
            String codeAtivacao = call.getString("codeAtivacao");

            mapValues.put("numSessao", getNumeroSessao());
            mapValues.put("subComando", 2);
            mapValues.put("codeAtivacao", codeAtivacao);
            mapValues.put("cnpj", "14200166000166");
            mapValues.put("cUF", 15);

            retorno = serviceSat.ativarSAT(mapValues);

            ret.put("satReturn", retorno);

            call.resolve(ret);
        }catch (Exception e){
            call.reject("sendAtivarSAT error" + e.toString());
        }
    }

    @PluginMethod
    public void sendAssociarSAT(PluginCall call){
        String retorno = "...";

        Map<String, Object> mapValues = new HashMap<>();
        JSObject ret = new JSObject();

        try{
            String codeAtivacao = call.getString("codeAtivacao");

            mapValues.put("numSessao", getNumeroSessao());
            mapValues.put("codeAtivacao", codeAtivacao);
            mapValues.put("cnpjSh", "16716114000172");
            mapValues.put("assinaturaAC", "SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT");

            retorno = serviceSat.associarAssinatura(mapValues);

            ret.put("satReturn", retorno);

            call.resolve(ret);

        }catch (Exception e){
            call.reject("sendAssociarSAT error" + e.toString());
        }
    }

    @PluginMethod
    public void sendConsultarSAT(PluginCall call){
        String retorno = "...";

        Map<String, Object> mapValues = new HashMap<>();
        JSObject ret = new JSObject();

        try{
            mapValues.put("numSessao", getNumeroSessao());

            retorno = serviceSat.consultarSAT(mapValues);

            ret.put("satReturn", retorno);

            call.resolve(ret);
        }catch (Exception e){
            call.reject("sendConsultarSAT error" + e.toString());
        }
    }

    @PluginMethod
    public void sendStatusOperacionalSAT(PluginCall call){
        String retorno = "...";

        Map<String, Object> mapValues = new HashMap<>();
        JSObject ret = new JSObject();

        try{
            String codeAtivacao = call.getString("codeAtivacao");

            mapValues.put("numSessao", getNumeroSessao());
            mapValues.put("codeAtivacao", codeAtivacao);

            retorno = serviceSat.statusOperacional(mapValues);

            ret.put("satReturn", retorno);

            call.resolve(ret);
        }catch (Exception e){
            call.reject("sendSatusOperacionalSAT error" + e.toString());
        }
    }

    @PluginMethod
    public void sendEnviarVendasSAT(PluginCall call){
        String retorno = "...";

        Map<String, Object> mapValues = new HashMap<>();
        JSObject ret = new JSObject();

        try{
            String stringXMLSat = call.getString("stringXMLSat");
            String codeAtivacao = call.getString("codeAtivacao");

            mapValues.put("numSessao", getNumeroSessao());
            mapValues.put("codeAtivacao", codeAtivacao);
            mapValues.put("xmlSale", stringXMLSat);

            retorno = serviceSat.enviarVenda(mapValues);

            ret.put("satReturn", retorno);

            call.resolve(ret);

        }catch (Exception e){
            call.reject("sendEnviarVendasSAT error" + e.toString());
        }
    }

    @PluginMethod
    public void sendCancelarVendaSAT(PluginCall call){
        String retorno = "...";

        Map<String, Object> mapValues = new HashMap<>();
        JSObject ret = new JSObject();

        try{
            String stringXMLCancelamentoSat = call.getString("stringXMLCancelamentoSat");
            String codeAtivacao = call.getString("codeAtivacao");

            String stringXmlCancelamentoSatTreated = stringXMLCancelamentoSat.replace("novoCFe", serviceSat.cfeCancelamento);

            mapValues.put("numSessao", getNumeroSessao());
            mapValues.put("codeAtivacao", codeAtivacao);
            mapValues.put("xmlSale", stringXmlCancelamentoSatTreated);
            mapValues.put("cFeNumber", "CFe13181114200166000166599000162500104927318337");

            retorno = serviceSat.cancelarVenda(mapValues);

            ret.put("satReturn", retorno);

            call.resolve(ret);

        }catch (Exception e){
            call.reject("sendCancelarVendaSAT error" + e.toString());
        }
    }

    //END OF SAT METHODS

    //BALANCE METHODS

    @PluginMethod
    public void sendConfigBalanca(PluginCall call){
        Map<String, Object> mapValues = new HashMap<>();

        try {
            mapValues.put("model", call.getString("model"));
            mapValues.put("protocol", call.getString("protocol"));

            balanca.configBalanca(mapValues);
            call.resolve();
        }catch(Exception e){
            call.reject("sendConfigBalanca error" + e.toString());
        }
    }

    @PluginMethod
    public void sendLerPesoBalanca(PluginCall call){
        JSObject ret = new JSObject();

        try{
            String retorno = balanca.lerPesoBalanca();

            ret.put("balancaReturn", retorno);

            call.resolve(ret);
        }catch (Exception e) {
            call.reject("sendLerPesoBalanca error" + e.toString());
        }
    }




    //Funções adicionais
    public void printerViaVlienteMsitef(String viaCliente){

        Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("text", viaCliente);
        mapValues.put("align", "Centralizado");
        mapValues.put("font", "FONT B");
        mapValues.put("fontSize", 0);
        mapValues.put("isBold", false);
        mapValues.put("isUnderline", false);
        mapValues.put("quant", 10);



        this.printerInstance.imprimeTexto(mapValues);
        this.printerInstance.AvancaLinhas(mapValues);
        this.printerInstance.cutPaper(mapValues);

    }


    public String PaymentToYourCode(String payment)
    {
        switch (payment)
        {
            case "Crédito":
                return "3";
            case "Débito":
                return "2";
            case "Todos":
                return "0";
            default:
                return "0";
        }
    }

    public static void alertMessageStatus(String titleAlert, String messageAlert){
        AlertDialog alertDialog = new AlertDialog.Builder(mContext).create();
        alertDialog.setTitle(titleAlert);
        alertDialog.setMessage(messageAlert);
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
        alertDialog.show();
        Log.d("hi","oi");
    }

    private int getNumeroSessao() {
        return new Random().nextInt(1_000_000);
    }
}
