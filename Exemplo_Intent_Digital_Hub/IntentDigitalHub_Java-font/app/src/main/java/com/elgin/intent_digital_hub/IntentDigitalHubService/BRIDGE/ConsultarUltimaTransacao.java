package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

import androidx.annotation.NonNull;

final public class ConsultarUltimaTransacao extends BridgeCommand {
    final private String pdv;

    public ConsultarUltimaTransacao(@NonNull String pdv) {
        super("ConsultarUltimaTransacao");
        this.pdv = pdv;
    }

    @Override
    protected String functionParameters() {
        return "\"pdv\"" + ":" + "\"" + this.pdv + "\"";
    }
}
