package com.elgin.intent_digital_hub.IntentDigitalHubService.SAT;

import androidx.annotation.NonNull;

final public class ConsultarStatusOperacional extends SatCommand {
    final private int numSessao;
    final private String codAtivacao;

    public ConsultarStatusOperacional(int numSessao, @NonNull String codAtivacao) {
        super("ConsultarStatusOperacional");
        this.numSessao = numSessao;
        this.codAtivacao = codAtivacao;
    }

    @Override
    protected String functionParameters() {
        return  "\"numSessao\"" + ":" + this.numSessao + "," +
                "\"codAtivacao\"" + ":" + "\"" + this.codAtivacao + "\"";
    }
}
