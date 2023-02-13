package com.elginm8;

import android.app.Activity;
import com.elgin.e1.Core.Utils;

public class KioskService {
    private static Utils utils;

    public KioskService(Activity activity) {
        utils = new Utils(activity);
    }

    public enum KIOSK_CONFIG {
        BARRA_STATUS, BARRA_NAVEGACAO, BOTAO_POWER
    }

    // Desabilita todas as configurações de Kiosk.
    public static void resetKioskMode() {
        executeKioskOperation(KIOSK_CONFIG.BARRA_STATUS, true);
        executeKioskOperation(KIOSK_CONFIG.BARRA_NAVEGACAO, true);
        executeKioskOperation(KIOSK_CONFIG.BOTAO_POWER, true);
    }

    public static void setFullKioskMode() {
        executeKioskOperation(KIOSK_CONFIG.BARRA_STATUS, false);
        executeKioskOperation(KIOSK_CONFIG.BARRA_NAVEGACAO, false);
        executeKioskOperation(KIOSK_CONFIG.BOTAO_POWER, false);
    }

    public static void executeKioskOperation(KIOSK_CONFIG kioskConfig, boolean enable) {
        try {
            kioskOperation(kioskConfig, enable);
        } catch (Exception e) {
            throw new AssertionError("Exceção inesperada ao executar operação kiosk: " + e);
        }
    }

    private static void kioskOperation(KIOSK_CONFIG kioskConfig, boolean enable) throws Exception {
        switch (kioskConfig) {
            case BARRA_STATUS:
                toggleBarraStatus(enable);
                break;
            case BARRA_NAVEGACAO:
                toggleBarraNavegacao(enable);
                break;
            case BOTAO_POWER:
                toggleBotaoPower(enable);
                break;
            default:
                throw new IllegalStateException("Operação inesperada: " + kioskConfig);
        }
    }

    private static void toggleBotaoPower(boolean enable) {
        if (enable) {
            utils.habilitaBotaoPower();
        } else {
            utils.desabilitaBotaoPower();
        }
    }

    private static void toggleBarraNavegacao(boolean enable) throws Exception {
        if (enable) {
            utils.habilitaBarraNavegacao();
        } else {
            utils.desabilitaBarraNavegacao();
        }
    }

    private static void toggleBarraStatus(boolean enable) throws Exception {
        if (enable) {
            utils.habilitaBarraStatus();
        } else {
            utils.desabilitaBarraStatus();
        }
    }
}
