package com.elgin.intent_digital_hub.IntentDigitalHubService.SAT;

import androidx.annotation.NonNull;

final public class AtivarSAT extends SatCommand {
    final private int numSessao;
    final private int subComando;
    final private String codAtivacao;
    final private String cnpj;
    final private int cUF;

    public AtivarSAT(int numSessao, int subComando, @NonNull String codAtivacao, @NonNull String cnpj, int cUF) {
        super("AtivarSAT");
        this.numSessao = numSessao;
        this.subComando = subComando;
        this.codAtivacao = codAtivacao;
        this.cnpj = cnpj;
        this.cUF = cUF;
    }

    @Override
    protected String functionParameters() {
        return  "\"numSessao\"" + ":" + this.numSessao + "," +
                "\"subComando\"" + ":" + this.subComando + "," +
                "\"codAtivacao\"" + ":" + "\"" + this.codAtivacao + "\"" + "," +
                "\"cnpj\"" + ":" + "\"" + this.cnpj + "\"" + "," +
                "\"cUF\"" + ":" + this.cUF;
    }
}
