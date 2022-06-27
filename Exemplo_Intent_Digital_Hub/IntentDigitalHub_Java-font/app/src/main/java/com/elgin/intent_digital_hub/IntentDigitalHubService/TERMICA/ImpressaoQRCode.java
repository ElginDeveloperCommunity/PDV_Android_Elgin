package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

import androidx.annotation.NonNull;

final public class ImpressaoQRCode extends TermicaCommand {
    final private String dados;
    final private int tamanho;
    final private int nivelCorrecao;

    public ImpressaoQRCode(@NonNull String dados, int tamanho, int nivelCorrecao) {
        super("ImpressaoQRCode");
        this.dados = dados;
        this.tamanho = tamanho;
        this.nivelCorrecao = nivelCorrecao;
    }

    @Override
    protected String functionParameters() {
        return "\"dados\"" + ":" + "\"" + this.dados + "\"" + "," +
                "\"tamanho\"" + ":" + this.tamanho + "," +
                "\"nivelCorrecao\"" + ":" + this.nivelCorrecao;
    }
}
