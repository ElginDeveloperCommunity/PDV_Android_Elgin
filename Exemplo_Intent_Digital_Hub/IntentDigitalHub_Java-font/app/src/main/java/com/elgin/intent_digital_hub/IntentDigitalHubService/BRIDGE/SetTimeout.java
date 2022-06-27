package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

final public class SetTimeout extends BridgeCommand {
    final private int timeout;

    public SetTimeout(int timeout) {
        super("SetTimeout");
        this.timeout = timeout;
    }

    @Override
    protected String functionParameters() {
        return "\"timeout\"" + ":" + this.timeout;
    }
}
