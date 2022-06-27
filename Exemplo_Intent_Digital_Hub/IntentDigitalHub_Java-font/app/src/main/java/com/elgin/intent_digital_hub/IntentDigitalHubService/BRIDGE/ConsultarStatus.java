package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

final public class ConsultarStatus extends BridgeCommand {

    public ConsultarStatus() {
        super("ConsultarStatus");
    }

    @Override
    protected String functionParameters() {
        return "";
    }
}
