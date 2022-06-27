package com.elgin.intent_digital_hub;


import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.os.Environment;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Classe que utilidades que todas as atividades podem utilizar, reduzindo a repetição de código em funcionalidades com processos similares
 */

final public class ActivityUtils {
    //Classe utilitária, não deve ser possível instãnciar
    private ActivityUtils() {}

    /**
     * Função utilitária que inicia uma nova atividade
     *
     * @param sourceActivity       Contexto necessário da atividade que irá invocar a atividade alvo
     * @param activityClassToStart Classe que representa a Ativity alvos
     */
    public static void startNewActivity(Activity sourceActivity, Class<?> activityClassToStart) {
        final Intent intent = new Intent(sourceActivity, activityClassToStart);
        sourceActivity.startActivity(intent);
    }

    /**
     * Função utilitária que cria um alert e os mostra
     *
     * @param activityContext Contexto necessário para a função
     * @param alertTitle      Título do Alert
     * @param alertMessage    Texto corpo do Alert
     */

    public static void showAlertMessage(Context activityContext, String alertTitle, String alertMessage) {
        AlertDialog alertDialog = new AlertDialog.Builder(activityContext).create();
        alertDialog.setTitle(alertTitle);
        alertDialog.setMessage(alertMessage);
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                (dialog, which) -> dialog.dismiss());
        alertDialog.show();
    }

    /**
     * Cria, caso não exista, o diretório raiz da aplicação que será ultilizado para salvar os XMLs e a imagem no módulo de impressão de imagem, fornece como retorno do path do diretório (Android/data/com.elgin.intent_digital_hub/files/)
     *
     * @param activity Contexto necessário para a função
     * @return String path do diretório da aplicação
     */
    public static String getRootDirectoryPATH(Activity activity) {
        final File mediaStorageDir = new File(Environment.getExternalStorageDirectory()
                + "/Android/data/"
                + activity.getApplicationContext().getPackageName()
                + "/files");

        //Cria o diretório que a aplicação utilizara para salvar as mídias, caso não exista
        if (!mediaStorageDir.exists()) {
            if (!mediaStorageDir.mkdirs()) {
                //Se não foi possível criar o diretório, a exceção será lançada
                throw new SecurityException("Permissão não garantida para a criação do diretório externo da aplicação!");
            }
        }

        return mediaStorageDir.getPath();
    }

    /**
     * Função facilitadora utilizada para retornar o PATH dos arquivos para o Intent Digital Hub para as funções que utilizaram o caminho dos arquivos como método de entrada.
     * Para o Intent Digital Hub não é necessário enviar o PATH absoluto dos arquivos, o caminho inicial já parte do diretório externo do dispositivo, ou seja, para apontarmos para os arquivos salvos e usados pela aplicação basta passar o caminho a partir do diretório externo
     *
     * @param activityForReference  Contexto necessário para a função
     * @param filenameWithExtension Nome do arquivo buscado, com a sua extensão
     */
    public static String getFilePathForIDH(Activity activityForReference, String filenameWithExtension) {
        //Comandos por meio de PATH devem iniciar com "path=" antes do argumento do caminho de arquivo
        return "path=" + "/Android/data/" + activityForReference.getApplicationContext().getPackageName() + "/files/" + filenameWithExtension;
    }

    /**
     * Função utilizada para ler os XMLs do projeto e então salvá-los dentro da diretório externo raiz da aplicação (Android/data/com.elgin.intent_digital_hub/files/)
     *
     * @param activityForReference Contexto necessário para a função
     * @param xmlFileName          Nome do arquivo .XMl, é o nome do XML encontrado em res/raw do projeto e também será o mesmo nome com o qual o XMl será salvo dentro do diretório da aplicação
     */
    public static void loadXMLFileAndStoreItOnApplicationRootDir(Activity activityForReference, String xmlFileName) {
        //Carrega o conteúdo do XML do projeto em String
        final String xmlContent = readXmlFileAsString(activityForReference, xmlFileName);

        //Em seguida, cria e salva no diretório da aplicação um arquivo .XML a partir da String com o mesmo do xml procurado
        storeXmlFile(activityForReference, xmlContent, xmlFileName);
    }

    /**
     * Lẽ os XMLs do projeto, que estão salvos em res/raw, e retorna o seu conteúdo em String
     *
     * @param activityForReference Contexto necessário para a função
     * @param xmlFileName          Nome do arquivo .XML a ser lido de dentro do projeto
     * @return xmlReadInString String contendo o texto do arquivo XMl lido
     */
    public static String readXmlFileAsString(Activity activityForReference, String xmlFileName) {
        final String xmlReadInString;

        //Todos os .XMLs advindos do projeto estão em res/raw
        InputStream ins = activityForReference.getResources().openRawResource(
                activityForReference.getResources().getIdentifier(
                        xmlFileName,
                        "raw",
                        activityForReference.getPackageName()
                )
        );

        BufferedReader br = new BufferedReader(new InputStreamReader(ins));
        StringBuilder sb = new StringBuilder();
        String line = null;

        try {
            line = br.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        }

        while (line != null) {
            sb.append(line);
            sb.append(System.lineSeparator());
            try {
                line = br.readLine();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        xmlReadInString = sb.toString();

        return xmlReadInString;
    }

    /**
     * Cria arquivo .XML no diretório raiz da aplicação
     *
     * @param activity           Contexto necessário para a função
     * @param xmlContentInString Conteúdo do .XML a ser salvo
     * @param xmlFileName        Nome do arquivo xml
     */
    private static void storeXmlFile(Activity activity, String xmlContentInString, String xmlFileName) {
        File newXmlArchive = new File(getRootDirectoryPATH(activity) + File.separator + xmlFileName + ".xml");

        //Não é necessário criar novamente o arquivo, caso o mesmo já exista
        if (!newXmlArchive.exists()) {
            try {
                FileWriter fileWriter = new FileWriter(newXmlArchive);
                fileWriter.append(xmlContentInString);
                fileWriter.flush();
                fileWriter.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
