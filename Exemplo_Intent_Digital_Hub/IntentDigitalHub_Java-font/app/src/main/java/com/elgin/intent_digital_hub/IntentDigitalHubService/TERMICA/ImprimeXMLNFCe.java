package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

import androidx.annotation.NonNull;

public class ImprimeXMLNFCe extends TermicaCommand {
    final private String dados;
    final private int indexcsc;
    final private String csc;
    final private int param;

    public ImprimeXMLNFCe(@NonNull String dados, int indexcsc, @NonNull String csc, int param) {
        super("ImprimeXMLNFCe");
        this.dados = dados;
        this.indexcsc = indexcsc;
        this.csc = csc;
        this.param = param;
    }

    @Override
    protected String functionParameters() {
        return "\"dados\"" + ":" + "\"" + this.dados + "\"" + "," +
                "\"indexcsc\"" + ":" + this.indexcsc + "," +
                "\"csc\"" + ":" + "\"" + this.csc + "\"" + "," +
                "\"param\"" + ":" + this.param;
    }

}
