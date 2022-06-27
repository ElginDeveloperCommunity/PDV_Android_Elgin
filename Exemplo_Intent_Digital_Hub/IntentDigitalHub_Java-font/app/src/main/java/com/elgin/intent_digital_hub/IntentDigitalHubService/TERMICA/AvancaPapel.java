package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

final public class AvancaPapel extends TermicaCommand {
    final private int linhas;

    public AvancaPapel(int linhas) {
        super("AvancaPapel");
        this.linhas = linhas;
    }

    @Override
    protected String functionParameters() {
        return "\"linhas\"" + ":" + this.linhas;
    }
}
