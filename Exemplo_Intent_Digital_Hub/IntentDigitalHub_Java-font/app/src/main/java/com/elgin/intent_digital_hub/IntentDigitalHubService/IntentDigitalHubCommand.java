package com.elgin.intent_digital_hub.IntentDigitalHubService;

/**
 * Classe abstrata que generaliza as carecterísticas comuns à todos os comandos do Intent Digital Hub, as classes que herdam desta implementam cada comando de maneira específica servindo como Wrapper
 */

public abstract class IntentDigitalHubCommand {
    //Nome da função
    final protected String functionName;
    //Módulo a qual a função pertence
    final protected IntentDigitalHubModule correspondingIntentModule;

    protected IntentDigitalHubCommand(String functionName, IntentDigitalHubModule correspondingIntentModule) {
        this.functionName = functionName;
        this.correspondingIntentModule = correspondingIntentModule;
    }

    //Formata o JSON de acordo com os parâmetros definidos por cada subclasse, o modificador de acesso protected impede a exposição do método que sera usado somente em DigitalHubUtils para o start da intent
    final protected String getCommandJSON() {
        return "[{" +
                "\"funcao\"" + ":" + "\"" + this.functionName + "\"" + "," +
                "\"parametros\"" + ":" + "{" + this.functionParameters() + "}" +
                "}]";
    }

    //Função que deve ser implementada por cada subclasse definindo a formatação dos parâmetros da função específica
    protected abstract String functionParameters();
}
