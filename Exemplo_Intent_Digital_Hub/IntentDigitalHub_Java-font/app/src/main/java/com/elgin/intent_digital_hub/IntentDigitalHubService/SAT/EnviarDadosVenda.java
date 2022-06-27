package com.elgin.intent_digital_hub.IntentDigitalHubService.SAT;

import androidx.annotation.NonNull;

public class EnviarDadosVenda extends SatCommand {
    final private int numSessao;
    final private String codAtivacao;
    final private String dadosVenda;

    public EnviarDadosVenda(int numSessao, @NonNull String codAtivacao, @NonNull String dadosVenda) {
        super("EnviarDadosVenda");
        this.numSessao = numSessao;
        this.codAtivacao = codAtivacao;
        this.dadosVenda = dadosVenda;
    }

    @Override
    protected String functionParameters() {
        return "\"numSessao\"" + ":" + this.numSessao + "," +
                "\"codAtivacao\"" + ":" + "\"" + this.codAtivacao + "\"" + "," +
                "\"dadosVenda\"" + ":" + "\"" + this.dadosVenda + "\"";
    }
}
