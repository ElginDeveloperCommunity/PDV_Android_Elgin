package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

final public class GetTimeout extends BridgeCommand {
    public GetTimeout() {
        super("GetTimeout");
    }

    @Override
    protected String functionParameters() {
        return "";
    }
}
