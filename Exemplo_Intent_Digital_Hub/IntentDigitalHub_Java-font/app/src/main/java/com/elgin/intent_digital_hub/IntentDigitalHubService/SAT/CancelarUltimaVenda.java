package com.elgin.intent_digital_hub.IntentDigitalHubService.SAT;

import androidx.annotation.NonNull;

public class CancelarUltimaVenda extends SatCommand {
    final private int numSessao;
    final private String codAtivacao;
    final private String numeroCFe;
    final private String dadosCancelamento;

    public CancelarUltimaVenda(int numSessao, @NonNull String codAtivacao, @NonNull String numeroCFe, @NonNull String dadosCancelamento) {
        super("CancelarUltimaVenda");
        this.numSessao = numSessao;
        this.codAtivacao = codAtivacao;
        this.numeroCFe = numeroCFe;
        this.dadosCancelamento = dadosCancelamento;
    }

    @Override
    protected String functionParameters() {
        return "\"numSessao\"" + ":" + this.numSessao + "," +
                "\"codAtivacao\"" + ":" + "\"" + this.codAtivacao + "\"" + "," +
                "\"numeroCFe\"" + ":" + "\"" + this.numeroCFe + "\"" + "," +
                "\"dadosCancelamento\"" + ":" + "\"" + this.dadosCancelamento + "\"";
    }
}
