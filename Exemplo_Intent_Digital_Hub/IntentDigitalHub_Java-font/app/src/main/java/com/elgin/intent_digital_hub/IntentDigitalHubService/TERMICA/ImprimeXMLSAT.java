package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

final public class ImprimeXMLSAT extends TermicaCommand {
    final private String dados;
    final private int param;

    public ImprimeXMLSAT(String dados, int param) {
        super("ImprimeXMLSAT");
        this.dados = dados;
        this.param = param;
    }

    @Override
    protected String functionParameters() {
        return "\"dados\"" + ":" + "\"" + this.dados + "\"" + "," +
                "\"param\"" + ":" + this.param;
    }
}
