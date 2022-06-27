package com.elgin.intent_digital_hub.IntentDigitalHubService.SAT;

import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommand;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubModule;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Classe que generaliza todos os comandos SAT definindo o módulo do comando e o seu tipo de retorno
 */

public abstract class SatCommand extends IntentDigitalHubCommand implements Serializable {
    //O retorno dos comandos SAT é sempre uma String
    @SerializedName("resultado")
    private String resultado;

    protected SatCommand(String functionName) {
        super(functionName, IntentDigitalHubModule.SAT);
    }

    public String getResultado() {
        return this.resultado;
    }
}
