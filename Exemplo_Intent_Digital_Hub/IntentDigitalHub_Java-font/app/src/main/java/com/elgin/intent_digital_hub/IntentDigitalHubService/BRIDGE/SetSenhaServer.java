package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

import androidx.annotation.NonNull;

final public class SetSenhaServer extends BridgeCommand {
    final private String senha;
    final private boolean habilitada;

    public SetSenhaServer(@NonNull String senha, @NonNull boolean habilitada) {
        super("SetSenhaServer");
        this.senha = senha;
        this.habilitada = habilitada;
    }

    @Override
    protected String functionParameters() {
        return "\"senha\"" + ":" + "\"" + this.senha + "\"" + "," +
                "\"habilitada\"" + ":" + this.habilitada;
    }
}
