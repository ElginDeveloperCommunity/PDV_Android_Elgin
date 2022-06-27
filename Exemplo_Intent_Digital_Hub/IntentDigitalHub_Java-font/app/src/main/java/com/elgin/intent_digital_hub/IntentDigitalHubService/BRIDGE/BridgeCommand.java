package com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE;

import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommand;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubModule;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Classe que generaliza todos os comandos do módulo BRIDGE, definindo o módulo do comando e o seu tipo de retorno
 */

public abstract class BridgeCommand extends IntentDigitalHubCommand implements Serializable {
    //O retorno dos comandos bridge é sempre um JSON em String
    @SerializedName("resultado")
    private String resultado;

    protected BridgeCommand(String functionName) {
        super(functionName, IntentDigitalHubModule.BRIDGE);
    }

    public String getResultado() {
        return this.resultado;
    }
}
