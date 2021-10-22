package com.elgin.elginexperience;

import android.widget.EditText;

import org.junit.Test;
import static org.junit.Assert.*;

public class TefTest {
    @Test
    public void testInputValueEmpty(){
        String inputValueValid = "20000";
        String inputValueInvalid = "";

        boolean isValueValid = Tef.isValueNotEmpty(inputValueValid);
        boolean isValueInvalid = Tef.isValueNotEmpty(inputValueInvalid);

        assertTrue(isValueValid);
        assertFalse(isValueInvalid);
    }

    @Test
    public void testInputInstallmentEmptyOrLessThanZero(){
        String installmentValid = "3";
        String installmentLessThanZero = "-5";
        String installmentInvalidEmpty = "";

        boolean isInstallmentValid;
        isInstallmentValid = Tef.isInstallmentEmptyOrLessThanZero(installmentValid);

        boolean isInstallmentLessThanZero;
        isInstallmentLessThanZero = Tef.isInstallmentEmptyOrLessThanZero(installmentLessThanZero);

        boolean isInstallmentEmpty;
        isInstallmentEmpty = Tef.isInstallmentEmptyOrLessThanZero(installmentInvalidEmpty);

        assertTrue(isInstallmentValid);
        assertFalse(isInstallmentLessThanZero);
        assertFalse(isInstallmentEmpty);
    }

    @Test
    public void testIpParamOfConnectionMsitef(){
        String ipParamsCorrect = "192.168.0.31";
        String ipParamsInvalid = "192.168.00..31n/";

        boolean isIpParamsValid = Tef.isIpValid(ipParamsCorrect);
        boolean isIpParamsInvalid = Tef.isIpValid(ipParamsInvalid);

        assertTrue(isIpParamsValid);
        assertFalse(isIpParamsInvalid);
    }
}
