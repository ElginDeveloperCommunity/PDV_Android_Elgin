package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

import androidx.annotation.NonNull;

final public class ImprimeImagemMemoria extends TermicaCommand{
    final private String key;
    final private int scala;

    public ImprimeImagemMemoria(@NonNull String key, int scala) {
        super("ImprimeImagemMemoria");
        this.key = key;
        this.scala = scala;
    }

    @Override
    protected String functionParameters() {
        return "\"key\"" + ":" + "\"" + this.key + "\"" + "," +
                "\"scala\"" + ":" + this.scala;
    }
}
