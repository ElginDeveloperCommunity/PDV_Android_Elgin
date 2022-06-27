package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

import androidx.annotation.NonNull;

final public class SetSenha extends BridgeCommand {
    final private String senha;
    final private boolean habilitada;

    public SetSenha(@NonNull String senha, boolean habilitada) {
        super("SetSenha");
        this.senha = senha;
        this.habilitada = habilitada;
    }

    @Override
    protected String functionParameters() {
        return "\"senha\"" + ":" + "\"" + this.senha + "\"" + "," +
                "\"habilitada\"" + ":" + this.habilitada;
    }
}
