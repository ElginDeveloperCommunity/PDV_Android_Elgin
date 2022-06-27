package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

import androidx.annotation.NonNull;

final public class IniciaOperacaoAdministrativa extends BridgeCommand {
    final private int idTransacao;
    final private String pdv;
    final private int operacao;

    public IniciaOperacaoAdministrativa(int idTransacao, @NonNull String pdv, int operacao) {
        super("IniciaOperacaoAdministrativa");
        this.idTransacao = idTransacao;
        this.pdv = pdv;
        this.operacao = operacao;
    }

    @Override
    protected String functionParameters() {
        return "\"idTransacao\"" + ":" + this.idTransacao + "," +
                "\"pdv\"" + ":" + "\"" + this.pdv + "\"" + "," +
                "\"operacao\"" + ":" + this.operacao;
    }
}
