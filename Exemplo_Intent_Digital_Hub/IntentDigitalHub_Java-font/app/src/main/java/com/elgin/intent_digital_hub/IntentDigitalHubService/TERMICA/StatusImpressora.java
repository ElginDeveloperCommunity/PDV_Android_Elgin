package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

final public class StatusImpressora extends TermicaCommand {
    final private int param;

    public StatusImpressora(int param) {
        super("StatusImpressora");
        this.param = param;
    }

    @Override
    protected String functionParameters() {
        return "\"param\"" + ":" + this.param;
    }
}
