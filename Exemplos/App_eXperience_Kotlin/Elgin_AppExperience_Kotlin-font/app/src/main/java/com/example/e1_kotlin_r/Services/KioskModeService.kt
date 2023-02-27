package com.elgin.elginexperience.Services

import android.content.Context
import com.elgin.e1.Core.Utils

class KioskModeService(context: Context) {

    private var utils: Utils? = null

    init {
        utils = Utils(context)
    }

    enum class KIOSK_CONFIG {
        BARRA_STATUS, BARRA_NAVEGACAO, BOTAO_POWER
    }

    // Desabilita todas as configurações de Kiosk.
    fun resetKioskMode() {
        executeKioskOperation(KIOSK_CONFIG.BARRA_STATUS, true)
        executeKioskOperation(KIOSK_CONFIG.BARRA_NAVEGACAO, true)
        executeKioskOperation(KIOSK_CONFIG.BOTAO_POWER, true)
    }

    fun executeKioskOperation(kioskConfig: KIOSK_CONFIG, enable: Boolean) {
        try {
            kioskOperation(kioskConfig, enable)
        } catch (e: Exception) {
            throw AssertionError("Exceção inesperada ao executar operação kiosk: $e")
        }
    }

    @Throws(Exception::class)
    private fun kioskOperation(kioskConfig: KIOSK_CONFIG, enable: Boolean) {
        when (kioskConfig) {
            KIOSK_CONFIG.BARRA_STATUS -> toggleBarraStatus(enable)
            KIOSK_CONFIG.BARRA_NAVEGACAO -> toggleBarraNavegacao(enable)
            KIOSK_CONFIG.BOTAO_POWER -> toggleBotaoPower(enable)
            else -> throw IllegalStateException("Operação inesperada: $kioskConfig")
        }
    }

    private fun toggleBotaoPower(enable: Boolean) {
        if (enable) {
            utils?.habilitaBotaoPower()
        } else {
            utils?.desabilitaBotaoPower()
        }
    }

    @Throws(Exception::class)
    private fun toggleBarraNavegacao(enable: Boolean) {
        if (enable) {
            utils?.habilitaBarraNavegacao()
        } else {
            utils?.desabilitaBarraNavegacao()
        }
    }

    @Throws(Exception::class)
    private fun toggleBarraStatus(enable: Boolean) {
        if (enable) {
            utils?.habilitaBarraStatus()
        } else {
            utils?.desabilitaBarraStatus()
        }
    }
}