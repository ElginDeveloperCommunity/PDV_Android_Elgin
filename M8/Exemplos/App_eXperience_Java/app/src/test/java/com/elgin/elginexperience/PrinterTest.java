package com.elgin.elginexperience;

import org.junit.Test;
import static org.junit.Assert.*;

public class PrinterTest {
    @Test
    public void testIpParamOfConnectionPrinterExternal(){
        String ipParamsCorrect = "192.168.0.31:9100";
        String ipParamsInvalid = "192.168.0..31:9100n/";

        boolean isIpParamsCorrect = PrinterMenu.isIpValid(ipParamsCorrect);
        boolean isIpParamsInvalid = PrinterMenu.isIpValid(ipParamsInvalid);

        assertTrue(isIpParamsCorrect);
        assertFalse(isIpParamsInvalid);
    }

    @Test
    public void testParamsOfPrinterXMLNFCeAndSAT(){
        int INDEXCSC = FragmentPrinterText.INDEXCSC;
        String CSC = FragmentPrinterText.CSC;
        int PARAM = FragmentPrinterText.PARAM;

        assertEquals(INDEXCSC, 1);
        assertEquals(CSC, "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES");
        assertEquals(PARAM, 0);
    }

    @Test
    public void testNameOfPathAndFileImageDefault(){
        String NAME_IMAGE_DEFAULT = FragmentPrinterImage.NAME_IMAGE;
        String PATH_DEF_TYPE = FragmentPrinterImage.DEF_TYPE;

        assertEquals(NAME_IMAGE_DEFAULT, "elgin");
        assertEquals(PATH_DEF_TYPE, "drawable");
    }
}