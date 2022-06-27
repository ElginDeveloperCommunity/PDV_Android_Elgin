package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

import androidx.annotation.NonNull;

final public class IniciaVendaDebito extends BridgeCommand {
    final private int idTransacao;
    final private String pdv;
    final private String valorTotal;

    public IniciaVendaDebito(int idTransacao, @NonNull String pdv, @NonNull String valorTotal) {
        super("IniciaVendaDebito");
        this.idTransacao = idTransacao;
        this.pdv = pdv;
        this.valorTotal = valorTotal;
    }

    @Override
    protected String functionParameters() {
        return "\"idTransacao\"" + ":" + this.idTransacao + "," +
                "\"pdv\"" + ":" + "\"" + this.pdv + "\"" + "," +
                "\"valorTotal\"" + ":" + "\"" + this.valorTotal + "\"";
    }
}
