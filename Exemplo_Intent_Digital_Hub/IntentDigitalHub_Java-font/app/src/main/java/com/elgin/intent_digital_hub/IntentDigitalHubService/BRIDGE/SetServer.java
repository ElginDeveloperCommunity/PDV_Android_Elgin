package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

final public class SetServer extends BridgeCommand {
    final String ipTerminal;
    final int portaTransacao;
    final int portaStatus;

    public SetServer(String ipTerminal, int portaTransacao, int portaStatus) {
        super("SetServer");
        this.ipTerminal = ipTerminal;
        this.portaTransacao = portaTransacao;
        this.portaStatus = portaStatus;
    }

    @Override
    protected String functionParameters() {
        return "\"ipTerminal\"" + ":" + "\"" + this.ipTerminal + "\"" + "," +
                "\"portaTransacao\"" + ":" + this.portaTransacao + "," +
                "\"portaStatus\"" + ":" + this.portaStatus;
    }
}
