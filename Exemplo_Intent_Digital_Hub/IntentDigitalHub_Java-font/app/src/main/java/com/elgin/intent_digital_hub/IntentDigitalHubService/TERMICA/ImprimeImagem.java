package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

import androidx.annotation.NonNull;

final public class ImprimeImagem extends TermicaCommand {
    final private String path;

    public ImprimeImagem(@NonNull String path) {
        super("ImprimeImagem");
        this.path = path;
    }

    @Override
    protected String functionParameters() {
        return "\"path\"" + ":" + "\"" + this.path + "\"";
    }
}
