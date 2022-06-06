package com.elginm8;

import android.app.Activity;
import android.graphics.Bitmap;
import android.util.Base64;
import android.graphics.BitmapFactory;

import com.elgin.e1.Impressora.Termica;

import java.io.File;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.systrace.SystraceMessage;

public class Printer {
    private static Activity mActivity;

    public static boolean isPrinterInternSelected;

    public Printer(Activity activity) {
        this.mActivity = activity;
        Termica.setContext(this.mActivity);
    }

    public static int printerInternalImpStart() {
        printerStop();
        int result = Termica.AbreConexaoImpressora(6, "M8", "", 0);

        if (result == 0) isPrinterInternSelected = true;

        return result;
    }

    public static int printerExternalImpIpStart(ReadableMap map) {
        printerStop();
        String model = (String) map.getString("printerModel");
        String ip = (String) map.getString("ip");
        int port = (Integer) map.getInt("port");


        try {
            int result = Termica.AbreConexaoImpressora(3, model, ip, port);
            System.out.println("result EXTERNA IP: " + result);
            if (result == 0) isPrinterInternSelected = false;

            return result;
        } catch (Exception e) {
            System.out.println("exception: " + e);
            return printerInternalImpStart();
        }

    }

    public static int printerExternalImpUsbStart(ReadableMap map) {
        printerStop();

        String model = (String) map.getString("printerModel");


        try {
            int result = Termica.AbreConexaoImpressora(1, model, "USB", 0);
            if (result == 0) isPrinterInternSelected = false;

            return result;
        } catch (Exception e) {

            return printerInternalImpStart();
        }
    }

    public static void printerStop() {
        Termica.FechaConexaoImpressora();
    }

    public static int AvancaLinhas(ReadableMap map) {
        int lines = (Integer) map.getInt("quant");

        return Termica.AvancaPapel(lines);
    }

    public static int cutPaper(ReadableMap map) {
        int lines = (Integer) map.getInt("quant");
        return Termica.Corte(lines);
    }

    public static int imprimeTexto(ReadableMap map) {
        String text = (String) map.getString("text");
        String align = (String) map.getString("align");
        String font = (String) map.getString("font");
        int fontSize = (Integer) map.getInt("fontSize");
        boolean isBold = (boolean) map.getBoolean("isBold");
        boolean isUnderline = (boolean) map.getBoolean("isUnderline");

        int result;

        int alignValue = 0;
        int styleValue = 0;

        // ALINHAMENTO VALUE
        if (align.equals("Esquerda")) {
            alignValue = 0;
        } else if (align.equals("Centralizado")) {
            alignValue = 1;
        } else {
            alignValue = 2;
        }
        //STILO VALUE
        if (font.equals("FONT B")) {
            styleValue += 1;
        }
        if ((boolean) map.getBoolean("isUnderline")) {
            styleValue += 2;
        }
        if ((boolean) map.getBoolean("isBold")) {
            styleValue += 8;
        }

        result = Termica.ImpressaoTexto(text, alignValue, styleValue, fontSize);
        return result;
    }

    private static int codeOfBarCode(String barCodeName) {
        if (barCodeName.equals("UPC-A"))
            return 0;
        else if (barCodeName.equals("UPC-E"))
            return 1;
        else if (barCodeName.equals("EAN 13") || barCodeName.equals("JAN 13"))
            return 2;

        else if (barCodeName.equals("EAN 8") || barCodeName.equals("JAN 8"))
            return 3;
        else if (barCodeName.equals("CODE 39"))
            return 4;
        else if (barCodeName.equals("ITF"))
            return 5;
        else if (barCodeName.equals("CODE BAR"))
            return 6;
        else if (barCodeName.equals("CODE 93"))
            return 7;
        else if (barCodeName.equals("CODE 128"))
            return 8;
        else return 0;
    }

    public static int imprimeBarCode(ReadableMap map) {
        int barCodeType = codeOfBarCode((String) map.getString("barCodeType"));
        String text = (String) map.getString("text");
        int height = (Integer) map.getInt("height");
        int width = (Integer) map.getInt("width");
        String align = (String) map.getString("align");

        int hri = 4; // NO PRINT
        int result;
        int alignValue;

        if (align.equals("Esquerda")) {
            alignValue = 0;
        } else if (align.equals("Centralizado")) {
            alignValue = 1;
        } else {
            alignValue = 2;
        }

        Termica.DefinePosicao(alignValue);

        result = Termica.ImpressaoCodigoBarras(barCodeType, text, height, width, hri);
        return result;
    }

    public static int imprimeQR_CODE(ReadableMap map) {
        int size = (Integer) map.getInt("qrSize");
        String text = (String) map.getString("text");
        String align = (String) map.getString("align");

        int nivelCorrecao = 2;
        int result;
        int alignValue;

        if (align.equals("Esquerda")) {
            alignValue = 0;
        } else if (align.equals("Centralizado")) {
            alignValue = 1;
        } else {
            alignValue = 2;
        }

        Termica.DefinePosicao(alignValue);

        result = Termica.ImpressaoQRCode(text, size, nivelCorrecao);
        return result;
    }

    public static int imprimeImagem(ReadableMap map) {

        int result=-1;

        System.out.println("IMPRIMINDO IMAGEM");
        String pathImage = (String) map.getString("pathImage");
        boolean isBase64 = (boolean) map.getBoolean("isBase64");



        File mSaveBit = new File(pathImage); // Your image file

        Bitmap bitmap;

        if (pathImage.equals("elgin")) {
            int id = 0;

            id = mActivity.getApplicationContext().getResources().getIdentifier(
                    pathImage,
                    "drawable",
                    mActivity.getApplicationContext().getPackageName()
            );
            System.out.println("id: " + id);

            bitmap = BitmapFactory.decodeResource(mActivity.getApplicationContext().getResources(), id);
        } else {
            if (isBase64) {
                byte[] decodedString = Base64.decode(pathImage, Base64.DEFAULT);
                bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);

            } else {
                String filePath = mSaveBit.getPath();
                bitmap = BitmapFactory.decodeFile(filePath);
            }
        }


        if (isPrinterInternSelected) result = Termica.ImprimeBitmap(bitmap);
        else {
            result=Termica.ImprimeImagem(bitmap);
        }
        return result;

    }


    public static int imprimeXMLNFCe(ReadableMap map){
        String xmlNFCe = (String) map.getString("xmlNFCe");
        int indexcsc = (int) map.getInt("indexcsc");
        String csc = (String) map.getString("csc");
        int param = (int) map.getInt("param");
        return Termica.ImprimeXMLNFCe(xmlNFCe, indexcsc, csc, param);
    }

    public static int imprimeXMLSAT(ReadableMap map){
        String xml = (String) map.getString("xmlSAT");
        int param = (int) map.getInt("param");
        return Termica.ImprimeXMLSAT(xml, param);
    }

    public static int imprimeCupomTEF(ReadableMap map){
        String base64 = (String) map.getString("base64");

        return Termica.ImprimeCupomTEF(base64);
    }

    public static int statusGaveta(){
        return Termica.StatusImpressora(1);
    }

    public static int abrirGaveta() { return Termica.AbreGavetaElgin(); }

    public static int statusSensorPapel(){
        return Termica.StatusImpressora(3);
    }
}
