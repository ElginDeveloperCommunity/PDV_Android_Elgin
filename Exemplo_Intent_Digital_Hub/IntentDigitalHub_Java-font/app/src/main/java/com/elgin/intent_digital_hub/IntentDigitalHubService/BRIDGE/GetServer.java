package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

final public class GetServer extends BridgeCommand {

    public GetServer() {
        super("GetServer");
    }

    @Override
    protected String functionParameters() {
        return "";
    }
}
