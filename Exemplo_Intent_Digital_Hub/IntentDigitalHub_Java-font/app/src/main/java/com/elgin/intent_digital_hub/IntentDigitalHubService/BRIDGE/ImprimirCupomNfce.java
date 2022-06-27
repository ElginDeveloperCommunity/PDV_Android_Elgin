package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

import androidx.annotation.NonNull;

final public class ImprimirCupomNfce extends BridgeCommand{
    final private String xml;
    final private int indexcsc;
    final private String csc;

    public ImprimirCupomNfce(@NonNull String xml, int indexcsc, @NonNull String csc) {
        super("ImprimirCupomNfce");
        this.xml = xml;
        this.indexcsc = indexcsc;
        this.csc = csc;
    }

    @Override
    protected String functionParameters() {
        return "\"xml\"" + ":" + "\"" + this.xml + "\"" + "," +
                "\"indexcsc\"" + ":" + this.indexcsc + "," +
                "\"csc\"" + ":" + "\"" + this.csc + "\"";
    }
}
