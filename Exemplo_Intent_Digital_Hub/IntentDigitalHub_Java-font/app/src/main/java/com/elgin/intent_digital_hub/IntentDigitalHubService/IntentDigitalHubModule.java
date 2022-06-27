package com.elgin.intent_digital_hub.IntentDigitalHubService;

/**
 * Módulo disponíveis no Intent Digital Hub
 */

public enum IntentDigitalHubModule {
    BRIDGE("com.elgin.e1.digitalhub.BRIDGE"),
    SAT("com.elgin.e1.digitalhub.SAT"),
    TERMICA("com.elgin.e1.digitalhub.TERMICA");

    private final String intentPath;

    IntentDigitalHubModule(String intentPath) {
        this.intentPath = intentPath;
    }

    public String getIntentPath() {
        return this.intentPath;
    }
}
