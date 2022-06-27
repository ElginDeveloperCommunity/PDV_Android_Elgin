package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

import androidx.annotation.NonNull;

final public class ImprimirCupomSat extends BridgeCommand {
    final private String xml;

    public ImprimirCupomSat(@NonNull String xml) {
        super("ImprimirCupomSat");
        this.xml = xml;
    }

    @Override
    protected String functionParameters() {
        return "\"xml\"" + ":" + "\"" + this.xml + "\"";
    }
}
