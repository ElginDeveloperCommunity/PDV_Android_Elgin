package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

import androidx.annotation.NonNull;

final public class IniciaVendaCredito extends BridgeCommand {
    final private int idTransacao;
    final private String pdv;
    final private String valorTotal;
    final private int tipoFinanciamento;
    final private int numeroParcelas;

    public IniciaVendaCredito(int idTransacao, @NonNull String pdv, @NonNull String valorTotal, int tipoFinanciamento, int numeroParcelas) {
        super("IniciaVendaCredito");
        this.idTransacao = idTransacao;
        this.pdv = pdv;
        this.valorTotal = valorTotal;
        this.tipoFinanciamento = tipoFinanciamento;
        this.numeroParcelas = numeroParcelas;
    }

    @Override
    protected String functionParameters() {
        return  "\"idTransacao\"" + ":" + this.idTransacao + "," +
                "\"pdv\"" + ":" + "\"" + this.pdv + "\"" + "," +
                "\"valorTotal\"" + ":" + "\"" + this.valorTotal + "\"" + "," +
                "\"tipoFinanciamento\"" + ":" + this.tipoFinanciamento + "," +
                "\"numeroParcelas\"" + ":" + this.numeroParcelas;
    }
}
