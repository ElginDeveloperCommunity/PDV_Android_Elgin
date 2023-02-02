package com.elgin.elginexperience.Services;

import android.content.Context;

import com.elgin.e1.Core.Utils;

public class KioskModeService {

    private final Utils utils;

    public KioskModeService(Context context) {
        this.utils = new Utils(context);
    }

    public enum KIOSK_CONFIG {
        BARRA_STATUS, BARRA_NAVEGACAO, BOTAO_POWER
    }

    // Desabilita todas as configurações de Kiosk.
    public void resetKioskMode() {
        executeKioskOperation(KIOSK_CONFIG.BARRA_STATUS, true);
        executeKioskOperation(KIOSK_CONFIG.BARRA_NAVEGACAO, true);
        executeKioskOperation(KIOSK_CONFIG.BOTAO_POWER, true);
    }

    public void executeKioskOperation(KIOSK_CONFIG kioskConfig, boolean enable) {
        try {
            kioskOperation(kioskConfig, enable);
        } catch (Exception e) {
            throw new AssertionError("Exceção inesperada ao executar operação kiosk: " + e);
        }
    }

    private void kioskOperation(KIOSK_CONFIG kioskConfig, boolean enable) throws Exception {
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

    private void toggleBotaoPower(boolean enable) {
        if (enable) {
            utils.habilitaBotaoPower();
        } else {
            utils.desabilitaBotaoPower();
        }
    }

    private void toggleBarraNavegacao(boolean enable) throws Exception {
        if (enable) {
            utils.habilitaBarraNavegacao();
        } else {
            utils.desabilitaBarraNavegacao();
        }
    }

    private void toggleBarraStatus(boolean enable) throws Exception {
        if (enable) {
            utils.habilitaBarraStatus();
        } else {
            utils.desabilitaBarraStatus();
        }
    }
}
