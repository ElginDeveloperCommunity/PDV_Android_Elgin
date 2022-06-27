package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommand;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubModule;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Classe que generaliza todos os comandos do módulo TERMICA, definindo o módulo do comando e o seu tipo de retorno
 */

public abstract class TermicaCommand extends IntentDigitalHubCommand implements Serializable {
    //O retorno dos comandos de impressora é sempre um int
    @SerializedName("resultado")
    private int resultado;

    protected TermicaCommand(String functionName) {
        super(functionName, IntentDigitalHubModule.TERMICA);
    }

    public int getResultado() {
        return this.resultado;
    }
}
