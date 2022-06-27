package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

final public class DefinePosicao extends TermicaCommand {
    final private int posicao;

    public DefinePosicao(int posicao) {
        super("DefinePosicao");
        this.posicao = posicao;
    }

    @Override
    protected String functionParameters() {
        return "\"posicao\"" + ":" + this.posicao;
    }
}
