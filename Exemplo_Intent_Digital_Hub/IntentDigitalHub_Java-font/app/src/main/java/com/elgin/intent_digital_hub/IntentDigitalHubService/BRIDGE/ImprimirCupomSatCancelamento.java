package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

import androidx.annotation.NonNull;

final public class ImprimirCupomSatCancelamento extends BridgeCommand {
    final private String xml;
    final private String assQRCode;

    public ImprimirCupomSatCancelamento(@NonNull String xml, @NonNull String assQRCode) {
        super("ImprimirCupomSatCancelamento");
        this.xml = xml;
        this.assQRCode = assQRCode;
    }

    @Override
    protected String functionParameters() {
        return "\"xml\"" + ":" + "\"" + this.xml + "\"" + "," +
                "\"assQRCode\"" + ":" + "\"" + this.assQRCode + "\"";
    }
}
