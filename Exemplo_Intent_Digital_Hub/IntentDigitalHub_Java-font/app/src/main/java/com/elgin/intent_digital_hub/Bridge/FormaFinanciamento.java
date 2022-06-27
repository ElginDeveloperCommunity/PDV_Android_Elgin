package com.elgin.intent_digital_hub.Bridge;

/**
 * Formas de financiamento e o valor a ser enviado em cada opção para os comandos
 */

public enum FormaFinanciamento {
    FINANCIAMENTO_A_VISTA(1),
    FINANCIAMENTO_PARCELADO_EMISSOR(2),
    FINANCIAMENTO_PARCELADO_ESTABELECIMENTO(3);

    private final int codigoFormaParcelamento;

    FormaFinanciamento(int codigoFormaParcelamento) {
        this.codigoFormaParcelamento = codigoFormaParcelamento;
    }

    public int getCodigoFormaParcelamento() {
        return codigoFormaParcelamento;
    }
}
