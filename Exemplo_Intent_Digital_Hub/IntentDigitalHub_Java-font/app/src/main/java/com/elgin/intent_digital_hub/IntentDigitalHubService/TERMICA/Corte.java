package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

final public class Corte extends TermicaCommand {
    final private int avanco;

    public Corte(int avanco) {
        super("Corte");
        this.avanco = avanco;
    }

    @Override
    protected String functionParameters() {
        return "\"avanco\"" + ":" + this.avanco;
    }
}
