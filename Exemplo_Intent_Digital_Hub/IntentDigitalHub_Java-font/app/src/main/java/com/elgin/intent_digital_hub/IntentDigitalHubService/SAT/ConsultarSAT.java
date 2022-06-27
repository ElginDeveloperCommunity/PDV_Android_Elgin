package com.elgin.intent_digital_hub.IntentDigitalHubService.SAT;

public class ConsultarSAT extends SatCommand {
    final private int numSessao;

    public ConsultarSAT(int numSessao) {
        super("ConsultarSat");
        this.numSessao = numSessao;
    }

    @Override
    protected String functionParameters() {
        return "\"numSessao\"" + ":" + this.numSessao;
    }
}
