package com.elgin.elginexperience.Services;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.util.Base64;

import com.elgin.e1.Impressora.Termica;

import java.io.File;
import java.util.Map;
import java.util.Objects;

public class PrinterService {
    public Activity mActivity;

    //Variavel utilizada para a verificação de se a conexão atual é por impressora interna ou não
    public boolean isPrinterInternSelected;

    public PrinterService(Activity activity) {
        this.mActivity = activity;
        Termica.setContext(mActivity);
    }

    // Construtor sem argumento utilizado apenas para a criação de testes de validaçõ dos parâmetros.
    public PrinterService() {

    }

    public int printerInternalImpStart() {
        printerStop();
        int result = Termica.AbreConexaoImpressora(6, "M8", "", 0);

        if (result == 0) this.isPrinterInternSelected = true;

        return result;
    }

    public int printerExternalImpStartByIP(String model, String ip, int port) {
        Objects.requireNonNull(model, "model");
        Objects.requireNonNull(ip, "ip");

        printerStop();
        try {
            int result = Termica.AbreConexaoImpressora(3, model, ip, port);

            if (result == 0) this.isPrinterInternSelected = false;

            return result;
        } catch (Exception e) {
            return printerInternalImpStart();
        }
    }

    public int printerExternalImpStartByUSB(String model) {
        Objects.requireNonNull(model);

        printerStop();
        try {
            int result = Termica.AbreConexaoImpressora(1, model, "USB", 0);

            if (result == 0) this.isPrinterInternSelected = false;

            return result;
        } catch (Exception e) {
            return printerInternalImpStart();
        }
    }

    public void printerStop() {
        Termica.FechaConexaoImpressora();
    }

    public int AvancaLinhas(Map<String, Object> map) {
        final int lines = (Integer) Objects.requireNonNull(map.get("quant"), "quant");

        return Termica.AvancaPapel(lines);
    }

    public int cutPaper(Map<String, Object> map) {
        final int lines = (Integer) Objects.requireNonNull(map.get("quant"), "quant");

        return Termica.Corte(lines);
    }

    public int imprimeTexto(Map<String, Object> map) {
        final String text = (String) Objects.requireNonNull(map.get("text"), "text");
        final String align = (String) Objects.requireNonNull(map.get("align"), "align");
        final String font = (String) Objects.requireNonNull(map.get("font"), "font");
        final int fontSize = (Integer) Objects.requireNonNull(map.get("fontSize"), "fontSize");

        int result = 0;
        int alignValue = 0;
        int styleValue = 0;

        // ALINHAMENTO VALUE
        switch (align) {
            case "Esquerda":
                alignValue = 0;
                break;
            case "Centralizado":
                alignValue = 1;
                break;
            default:
                alignValue = 2;
                break;
        }

        //STILO VALUE
        if (font.equals("FONT B")) {
            styleValue += 1;
        }
        if ((boolean) Objects.requireNonNull(map.get("isUnderline"))) {
            styleValue += 2;
        }
        if ((boolean) Objects.requireNonNull(map.get("isBold"))) {
            styleValue += 8;
        }

        result = Termica.ImpressaoTexto(text, alignValue, styleValue, fontSize);
        return result;
    }

    private int codeOfBarCode(String barCodeName) {
        switch (barCodeName) {
            case "UPC-A":
                return 0;
            case "UPC-E":
                return 1;
            case "EAN 13":
            case "JAN 13":
                return 2;
            case "EAN 8":
            case "JAN 8":
                return 3;
            case "CODE 39":
                return 4;
            case "ITF":
                return 5;
            case "CODE BAR":
                return 6;
            case "CODE 93":
                return 7;
            case "CODE 128":
                return 8;
            default:
                throw new AssertionError(barCodeName);
        }
    }

    public int imprimeBarCode(Map<String, Object> map) {
        final int barCodeType = codeOfBarCode((String) Objects.requireNonNull(map.get("barCodeType"), "barCodeType"));
        final String text = (String) Objects.requireNonNull(map.get("text"), "text");
        final int height = (Integer) Objects.requireNonNull(map.get("height"), "height");
        final int width = (Integer) Objects.requireNonNull(map.get("width"), "width");
        final String align = (String) Objects.requireNonNull(map.get("align"), "align");

        final int hri = 4; // NO PRINT
        final int result;
        final int alignValue;

        // ALINHAMENTO VALUE
        switch (align) {
            case "Esquerda":
                alignValue = 0;
                break;
            case "Centralizado":
                alignValue = 1;
                break;
            default:
                alignValue = 2;
                break;
        }

        Termica.DefinePosicao(alignValue);

        result = Termica.ImpressaoCodigoBarras(barCodeType, text, height, width, hri);

        return result;
    }

    public int imprimeQR_CODE(Map<String, Object> map) {
        final int size = (Integer) Objects.requireNonNull(map.get("qrSize"), "qrSize");
        final String text = (String) Objects.requireNonNull(map.get("text"), "text");
        final String align = (String) Objects.requireNonNull(map.get("align"), "align");

        final int nivelCorrecao = 2;
        final int result;
        final int alignValue;

        // ALINHAMENTO VALUE
        switch (align) {
            case "Esquerda":
                alignValue = 0;
                break;
            case "Centralizado":
                alignValue = 1;
                break;
            default:
                alignValue = 2;
                break;
        }

        Termica.DefinePosicao(alignValue);

        result = Termica.ImpressaoQRCode(text, size, nivelCorrecao);
        return result;
    }

    public int imprimeImagem(Bitmap bitmap) {
        //Verifica se o método de impressão atual é por impressora interna ou externa e utiliza a função adequada para cada um
        return isPrinterInternSelected ? Termica.ImprimeBitmap(bitmap) : Termica.ImprimeImagem(bitmap);
    }

    public int imprimeXMLNFCe(Map<String, Object> map) {
        final String xmlNFCe = (String) Objects.requireNonNull(map.get("xmlNFCe"), "xmlNFCe");
        final int indexcsc = (int) Objects.requireNonNull(map.get("indexcsc"), "indexcsc");
        final String csc = (String) Objects.requireNonNull(map.get("csc"), "csc");
        final int param = (int) Objects.requireNonNull(map.get("param"), "param");

        return Termica.ImprimeXMLNFCe(xmlNFCe, indexcsc, csc, param);
    }

    public int imprimeXMLSAT(Map<String, Object> map) {
        final String xml = (String) Objects.requireNonNull(map.get("xmlSAT"), "xmlSAT");
        final int param = (int) Objects.requireNonNull(map.get("param"), "param");

        return Termica.ImprimeXMLSAT(xml, param);
    }

    public int imprimeCupomTEF(Map<String, Object> map) {
        final String base64 = (String) Objects.requireNonNull(map.get("base64"));

        return Termica.ImprimeCupomTEF(base64);
    }

    public int statusGaveta() {return Termica.StatusImpressora(1);}

    public int abrirGaveta() {return Termica.AbreGavetaElgin();}

    public int statusSensorPapel() {
        return Termica.StatusImpressora(3);
    }
}
