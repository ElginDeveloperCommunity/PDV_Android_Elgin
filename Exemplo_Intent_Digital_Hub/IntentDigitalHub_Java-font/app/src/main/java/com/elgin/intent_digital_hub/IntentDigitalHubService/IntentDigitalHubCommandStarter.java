package com.elgin.intent_digital_hub.IntentDigitalHubService;

import android.app.Activity;
import android.content.Intent;

import java.util.List;

/**
 * Classe service utilizada para iniciar os comandos do Intent Digital Hub
 */

final public class IntentDigitalHubCommandStarter {

    //Classe service, não deve ser possível instânciar
    private IntentDigitalHubCommandStarter() {}

    /**
     * Função que inicializa um comando do IDH, reduz a repetição no start da intent
     *
     * @param activity                Contexto necessário da atividade que irá invocar a intent
     * @param intentDigitalHubCommand O comando parâmetrizado a ser iniciado
     * @param requestCode             O código de requisição que será utilizado para iniciar a intent, para filtro de retorno numa atividade com múltiplos comandos separados iniciados inidividualmente
     */

    public static void startHubCommandActivity(Activity activity, IntentDigitalHubCommand intentDigitalHubCommand, int requestCode) {
        //Captura o módulo intent correspondente da função
        final String modulePathOfCommand = intentDigitalHubCommand.correspondingIntentModule.getIntentPath();

        Intent intent = new Intent(modulePathOfCommand);
        intent.putExtra("comando", intentDigitalHubCommand.getCommandJSON());

        activity.startActivityForResult(intent, requestCode);
    }

    /**
     * Overload da função de inicio de comando, permitindo a inicialização de vários comandos, basta fornecer uma List com todos os comandos
     *
     * @param activity                    Contexto necessário da atividade que irá invocar a intent
     * @param intentDigitalHubCommandList A lista de comandos que será tranformada em um só comando através da concatenação de todos os comandos da lista formando um arrayJSon contendo todos os comandos enviados
     * @param requestCode                 O código de requisição que será utilizado para iniciar a intent, para filtro de retorno numa atividade com múltiplos comandos separados iniciados inidividualmente
     */

    public static void startHubCommandActivity(Activity activity, List<IntentDigitalHubCommand> intentDigitalHubCommandList, int requestCode) throws IllegalArgumentException {
        //A lista de comandos não pode estar vazia
        if (intentDigitalHubCommandList.isEmpty())
            throw new IllegalArgumentException("A lista de comandos a serem concatenadas não pode estar vazia!");

        if (!validateCommandList(intentDigitalHubCommandList))
            throw new IllegalArgumentException("Todos os comandos da lista devem pertencer ao mesmo módulo!");

        //Verifica de qual modulo são os comandos da lista
        final String modulePathOfCommand = intentDigitalHubCommandList.get(0).correspondingIntentModule.getIntentPath();

        final String digitalHubCommandJSON = concatenateDigitalHubCommands(intentDigitalHubCommandList);

        Intent intent = new Intent(modulePathOfCommand);
        intent.putExtra("comando", digitalHubCommandJSON);

        activity.startActivityForResult(intent, requestCode);
    }

    /**
     * Cria o comando JSON com todos os comandos da lista formatado
     */

    private static String concatenateDigitalHubCommands(List<IntentDigitalHubCommand> intentDigitalHubCommandList) {
        StringBuilder concatenatedDigitalHubCommand = new StringBuilder();

        for (IntentDigitalHubCommand intentDigitalHubCommand : intentDigitalHubCommandList) {
            //Remove o fechamento de parênteses de todos os comandos
            String actualDigitalHubCommandJSON = intentDigitalHubCommand.getCommandJSON().substring(1, intentDigitalHubCommand.getCommandJSON().length() - 1);
            //Adiciona uma virgula para separar uma nova função
            concatenatedDigitalHubCommand.append(actualDigitalHubCommandJSON).append(",");
        }

        //Remove a ultima vírgula inserida
        concatenatedDigitalHubCommand.deleteCharAt(concatenatedDigitalHubCommand.length() - 1);

        //Fecha o JSON concatenado com os parênteses []
        concatenatedDigitalHubCommand.insert(0, "[");
        concatenatedDigitalHubCommand.insert(concatenatedDigitalHubCommand.length(), "]");

        return concatenatedDigitalHubCommand.toString().trim();
    }

    /**
     * Os comandos na lista a serem concatenados em um só comando não podem diferir entre módulo, um comando com múltiplas funções devem sempre fazer parte do mesmo módulo
     */

    private static boolean validateCommandList(List<IntentDigitalHubCommand> intentDigitalHubCommandList) {
        //Checa o modulo do primeiro comando da lista para comparação com todos posteriores
        IntentDigitalHubModule intentDigitalHubModuleBase = intentDigitalHubCommandList.get(0).correspondingIntentModule;

        for (IntentDigitalHubCommand intentDigitalHubCommand : intentDigitalHubCommandList)
            if (intentDigitalHubCommand.correspondingIntentModule != intentDigitalHubModuleBase)
                return false;
        return true;
    }
}
