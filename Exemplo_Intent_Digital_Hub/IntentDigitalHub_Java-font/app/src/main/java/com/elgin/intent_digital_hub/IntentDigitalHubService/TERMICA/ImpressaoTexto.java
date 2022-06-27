package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

import androidx.annotation.NonNull;

final public class ImpressaoTexto extends TermicaCommand {
    final private String dados;
    final private int posicao;
    final private int stilo;
    final private int tamanho;

    public ImpressaoTexto(@NonNull String dados, int posicao, int stilo, int tamanho) {
        super("ImpressaoTexto");
        this.dados = dados;
        this.posicao = posicao;
        this.stilo = stilo;
        this.tamanho = tamanho;
    }

    @Override
    protected String functionParameters() {
        return "\"dados\"" + ":" + "\"" + this.dados + "\"" + "," +
                "\"posicao\"" + ":" + this.posicao + "," +
                "\"stilo\"" + ":" + this.stilo + "," +
                "\"tamanho\"" + ":" + this.tamanho;
    }
}
