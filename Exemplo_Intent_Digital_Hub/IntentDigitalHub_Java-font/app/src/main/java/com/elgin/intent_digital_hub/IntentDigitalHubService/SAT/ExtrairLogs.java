package com.elgin.intent_digital_hub.IntentDigitalHubService.SAT;

import androidx.annotation.NonNull;

final public class ExtrairLogs extends SatCommand {
    final private int numSessao;
    final private String codAtivacao;

    public ExtrairLogs(int numSessao, @NonNull String codAtivacao) {
        super("ExtrairLogs");
        this.numSessao = numSessao;
        this.codAtivacao = codAtivacao;
    }

    @Override
    protected String functionParameters() {
        return  "\"numSessao\"" + ":" + this.numSessao + "," +
                "\"codAtivacao\"" + ":" + "\"" + this.codAtivacao + "\"";
    }
}
