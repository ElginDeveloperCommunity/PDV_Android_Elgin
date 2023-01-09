package com.elgin.elginexperience;

import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import static org.junit.Assert.*;

import android.util.Log;

import com.elgin.elginexperience.Services.PrinterService;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Consumer;
import java.util.stream.Collectors;

public class PrinterTest {

    private static final PrinterService printerServiceObj = new PrinterService();

    @Test
    public void testPrinterExternalImpStartByIP() {
        // Case 1.
        String model = null;
        String ip = "192.168.0.101";

        NullPointerException throwException = Assert.assertThrows(NullPointerException.class, () -> printerServiceObj.printerExternalImpStartByIP(model, ip, 0));
        assertEquals("model", throwException.getMessage());

        // Case 2.
        String model2 = "i8";
        String ip2 = null;

        throwException = Assert.assertThrows(NullPointerException.class, () -> printerServiceObj.printerExternalImpStartByIP(model2, ip2, 0));
        assertEquals("ip", throwException.getMessage());
    }

    @Test
    public void testAvancaLinhas() {
        final Map<String, Object> mapValues = new HashMap<>();

        final int quant = 10;

        mapValues.put("quant", quant);

        assertThrowsExceptionWithCorrectMessage(mapValues, "quant", printerServiceObj::AvancaLinhas);
    }

    @Test
    public void testCutpaper() {
        final Map<String, Object> mapValues = new HashMap<>();

        final int quant = 10;

        mapValues.put("quant", quant);

        assertThrowsExceptionWithCorrectMessage(mapValues, "quant", printerServiceObj::cutPaper);
    }

    @Test
    public void testImprimeTexto() {
        final Map<String, Object> mapValues = new HashMap<>();

        final String text = "TestMessage";
        final String align = "Esquerda";
        final String font = "FONT A";
        final int fontSize = 27;

        mapValues.put("text", text);
        mapValues.put("align", align);
        mapValues.put("font", font);
        mapValues.put("fontSize", fontSize);

        // Testa a função com cada parâmetro faltando, para assegurar de se qualquer um que falte a mesma lançará NullPointerException para aquele parâmetro.
        assertThrowsExceptionWithCorrectMessage(mapValues, "text", printerServiceObj::imprimeTexto);
        assertThrowsExceptionWithCorrectMessage(mapValues, "align", printerServiceObj::imprimeTexto);
        assertThrowsExceptionWithCorrectMessage(mapValues, "font", printerServiceObj::imprimeTexto);
        assertThrowsExceptionWithCorrectMessage(mapValues, "fontSize", printerServiceObj::imprimeTexto);
    }

    @Test
    public void testImprimeBarCode() {
        final Map<String, Object> mapValues = new HashMap<>();

        final String barCodeType = "UPC-A";
        final String text = "123456789012";
        final int height = 6;
        final int width = 12;
        final String align = "Esquerda";

        mapValues.put("barCodeType", barCodeType);
        mapValues.put("text", text);
        mapValues.put("height", height);
        mapValues.put("width", width);
        mapValues.put("align", align);

        assertThrowsExceptionWithCorrectMessage(mapValues, "barCodeType", printerServiceObj::imprimeBarCode);
        assertThrowsExceptionWithCorrectMessage(mapValues, "text", printerServiceObj::imprimeBarCode);
        assertThrowsExceptionWithCorrectMessage(mapValues, "height", printerServiceObj::imprimeBarCode);
        assertThrowsExceptionWithCorrectMessage(mapValues, "width", printerServiceObj::imprimeBarCode);
        assertThrowsExceptionWithCorrectMessage(mapValues, "align", printerServiceObj::imprimeBarCode);
    }

    @Test
    public void testImprimeQR_CODE() {
        final Map<String, Object> mapValues = new HashMap<>();

        final int qrSize = 30;
        final String text = "TestMessage";
        final String align = "Esquerda";

        mapValues.put("qrSize", qrSize);
        mapValues.put("text", text);
        mapValues.put("align", align);

        assertThrowsExceptionWithCorrectMessage(mapValues, "qrSize", printerServiceObj::imprimeQR_CODE);
        assertThrowsExceptionWithCorrectMessage(mapValues, "text", printerServiceObj::imprimeQR_CODE);
        assertThrowsExceptionWithCorrectMessage(mapValues, "align", printerServiceObj::imprimeQR_CODE);
    }

    @Test
    public void imprimeXMLNFCe() {
        final Map<String, Object> mapValues = new HashMap<>();

        final String xmlNFCe = "TestXMl";
        final int indexcsc = 1;
        final String csc = "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES";
        final int param = 0;

        mapValues.put("xmlNFCe", xmlNFCe);
        mapValues.put("indexcsc", indexcsc);
        mapValues.put("csc", csc);
        mapValues.put("param", param);

        assertThrowsExceptionWithCorrectMessage(mapValues, "xmlNFCe", printerServiceObj::imprimeXMLNFCe);
        assertThrowsExceptionWithCorrectMessage(mapValues, "indexcsc", printerServiceObj::imprimeXMLNFCe);
        assertThrowsExceptionWithCorrectMessage(mapValues, "csc", printerServiceObj::imprimeXMLNFCe);
        assertThrowsExceptionWithCorrectMessage(mapValues, "param", printerServiceObj::imprimeXMLNFCe);
    }

    @Test
    public void testImprimeXMLSAT() {
        final Map<String, Object> mapValues = new HashMap<>();

        final String xml = "TestXML";
        final int param = 0;

        mapValues.put("xmlSAT", xml);
        mapValues.put("param", param);

        assertThrowsExceptionWithCorrectMessage(mapValues, "xmlSAT", printerServiceObj::imprimeXMLSAT);
        assertThrowsExceptionWithCorrectMessage(mapValues, "param", printerServiceObj::imprimeXMLSAT);
    }


    /**
     * Garante que ocorre uma exceção NullPointerException ao fornecer para a função o parâmetro Map com uma chave faltando.
     *
     * @param mapValues                O Map de valores a ser fornecido para a função.
     * @param keyToRemove              A chave a qual a entrada será removida do Map.
     * @param functionToApplyAssertion A função a qual será executada com o Map com parâmetro removido faltando.
     */
    private void assertThrowsExceptionWithCorrectMessage(Map<String, Object> mapValues, String keyToRemove, Consumer<Map<String, Object>> functionToApplyAssertion) {
        NullPointerException throwException = Assert.assertThrows(NullPointerException.class, () -> functionToApplyAssertion.accept(newMapWithMissingKey(mapValues, keyToRemove)));
        assertEquals(keyToRemove, throwException.getMessage()); // Garante, adicionalmente, que a exceção possuí exatamente o nome do parâmetro que está faltando, ou seja, verifica que é exatamente a exceção que
    }

    // Cria um novo Map a partir do fornecido, removendo a entrada com a chave fornecida, se ela existir.
    private Map<String, Object> newMapWithMissingKey(Map<String, Object> mapValues, String keyToRemove) {
        return mapValues.entrySet().stream().filter(entry -> !entry.getKey().equals(keyToRemove)).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}