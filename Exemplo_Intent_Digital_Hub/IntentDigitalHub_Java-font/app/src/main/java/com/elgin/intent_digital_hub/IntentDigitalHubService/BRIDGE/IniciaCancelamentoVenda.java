package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

import androidx.annotation.NonNull;

final public class IniciaCancelamentoVenda extends BridgeCommand {
    final private int idTransacao;
    final private String pdv;
    final private String valorTotal;
    final private String dataHora;
    final private String nsu;

    public IniciaCancelamentoVenda(int idTransacao, @NonNull String pdv, @NonNull String valorTotal, @NonNull String dataHora, @NonNull String nsu) {
        super("IniciaCancelamentoVenda");
        this.idTransacao = idTransacao;
        this.pdv = pdv;
        this.valorTotal = valorTotal;
        this.dataHora = dataHora;
        this.nsu = nsu;
    }

    @Override
    protected String functionParameters() {
        return "\"idTransacao\"" + ":" + this.idTransacao + "," +
                "\"pdv\"" + ":" + "\"" + this.pdv + "\"" + "," +
                "\"valorTotal\"" + ":" + "\"" + this.valorTotal + "\"" + "," +
                "\"dataHora\"" + ":" + "\"" + this.dataHora + "\"" + "," +
                "\"nsu\"" + ":" + "\"" + this.nsu + "\"";
    }
}
