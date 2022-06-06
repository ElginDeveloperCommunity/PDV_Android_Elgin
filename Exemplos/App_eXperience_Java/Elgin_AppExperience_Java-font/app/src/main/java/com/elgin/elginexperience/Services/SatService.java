package com.elgin.elginexperience.Services;

import android.content.Context;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import java.io.File;
import java.io.FileWriter;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

import br.com.elgin.DeviceInfo;
import br.com.elgin.Sat;
import br.com.elgin.SatInitializer;

public class SatService {
    public static  SatInitializer satInitializer;
    private Context contextSat;

    //Diretório Raiz da aplicação
    private String BASE_ROOT_DIR;

    private final String SATLOG_ARCHIVE_NAME = "SatLog.txt";

    public SatService(Context context){
        satInitializer = new SatInitializer();
        contextSat = context;

        BASE_ROOT_DIR = "/Android/data/" + contextSat.getPackageName() + "/";
    }

    public String ativarSAT(Map map){
        String retorno = "...";

        int numSessao = (int) map.get("numSessao");
        int subComando = (int) map.get("subComando");
        String codeAtivacao = (String) map.get("codeAtivacao");
        String cnpj = (String) map.get("cnpj");
        int cUF = (int) map.get("cUF");

        retorno = Sat.ativarSat(numSessao, subComando, codeAtivacao, cnpj, cUF);
        mostrarRetorno(retorno);
        return  retorno;
    }

    public String associarAssinatura(Map map) {
        String retorno = "...";

        int numSessao = (int) map.get("numSessao");
        String codeAtivacao = (String) map.get("codeAtivacao");
        String cnpjSh = (String) map.get("cnpjSh");
        String assinaturaAC = (String) map.get("assinaturaAC");

        retorno = Sat.associarAssinatura(numSessao, codeAtivacao, cnpjSh, assinaturaAC);
        mostrarRetorno(retorno);
        return retorno;
    }

    public String consultarSAT(Map map) {
        String result = "...";

        int numSessao = (int) map.get("numSessao");

        result = Sat.consultarSat(numSessao);
        mostrarRetorno(result);
        return result;
    }

    public String statusOperacional(Map map){
        String retorno = "...";

        int numSessao = (int) map.get("numSessao");
        String codeAtivacao = (String) map.get("codeAtivacao");

        retorno = Sat.consultarStatusOperacional(numSessao, codeAtivacao);
        mostrarRetorno(retorno);
        return retorno;
    }

    public String enviarVenda(Map map){
        String retorno = "...";

        int numSessao = (int) map.get("numSessao");
        String codeAtivacao = (String) map.get("codeAtivacao");
        String xmlSale = (String) map.get("xmlSale");

        retorno = Sat.enviarDadosVenda(numSessao, codeAtivacao, xmlSale);
        mostrarRetorno(retorno);
        return retorno;
    }

    public String cancelarVenda(Map map){
        String retorno = "...";

        int numSessao = (int) map.get("numSessao");
        String codeAtivacao = (String) map.get("codeAtivacao");
        String cFeNumber = (String) map.get("cFeNumber");
        String xmlCancelamento = (String) map.get("xmlCancelamento");

        retorno = Sat.cancelarUltimaVenda(numSessao, codeAtivacao, cFeNumber, xmlCancelamento);
        mostrarRetorno(retorno);
        return retorno;
    }


    public String deviceInfo(){
        String retorno = "...";
        Optional<DeviceInfo> deviceInfo = Sat.getDeviceInfo();
        System.out.println(deviceInfo);
        return "aaa";
    }

    private void mostrarRetorno(String retorno) {
        Toast.makeText(contextSat, String.format("Retorno: %s", retorno), Toast.LENGTH_LONG).show();
    }

    public boolean extrairLog(Map map){
        int numSessao = (int) map.get("numSessao");
        String codeAtivacao = (String) map.get("codeAtivacao");

        String extractedLog = "";
        extractedLog = Sat.extrairLogs(numSessao, codeAtivacao);

        //Se o sat não estiver conectado ou algum outro problema tiver ocorrido, o retorno de Sat.extrairLogs()  será 'DeviceNotFound' e função não foi bem sucedida!
        if(extractedLog.equals("DeviceNotFound")){
            mostrarRetorno(extractedLog);
            return false;
        }

        //O texto a ser salvo está na 6° posição ao separar a String por '|'
        String extractedLogInArray[] = extractedLog.split("[|]");

        Log.d("DEBUG", extractedLogInArray[0]);

        //O texto a ser salvo está em base64 e deve ser decodificado antes de ser salvo no arquivo .txt
        byte[] byteArrayWithStringConverted = android.util.Base64.decode(extractedLogInArray[5], android.util.Base64.DEFAULT);

        String logtoBeSavedInStorage = new String(byteArrayWithStringConverted);

        //Tenta criar o dir ROOT onde a aplicação irá conseguir salvar o arquivo do logsat
        createRootDirectory(contextSat);
        writeFileOnStorage( SATLOG_ARCHIVE_NAME, logtoBeSavedInStorage);

        return true;
    }

    //Função que retorna o PATH absoluto do storage do Android, utilizada para criar o diretório root caso não exista
    //e para prover o PATH correto onde escrever o logSAT extraído
    private static String storagePathToAbsolutePath(String pathFromStorageRoot) {
        final StringBuffer buffer = new StringBuffer(255);

        buffer.append(Environment.getExternalStorageDirectory().getAbsolutePath());

        if (pathFromStorageRoot.charAt(0) != '/') {
            buffer.append('/');
        }

        buffer.append(pathFromStorageRoot);

        return buffer.toString();
    }

    //Função que cria o diretório root da aplicação (com.packagename) localizado em Android/data
    //diretório que será utilizado para salvar o arquivo de log do sat
    private boolean createRootDirectory(Context ctx) {
        // Constant, copied here: private static final String BASE_DIR = "/Android/data/";
        final String dataDir = storagePathToAbsolutePath(BASE_ROOT_DIR);
        Log.d("MADARA", dataDir);
        Log.d("MADARA", storagePathToAbsolutePath(BASE_ROOT_DIR));
        final File f = new File(dataDir);
        return f.mkdirs();
    }

    private void writeFileOnStorage(String fileNameWithExtension, String textToWrite){
        Log.d("MADARA", "oi2");
        File file = new File(storagePathToAbsolutePath(BASE_ROOT_DIR), "files");
        if(!file.exists()){
            Log.d("MADARA", "oi3");
            file.mkdir();
        }

        try{
            Log.d("MADARA", "oi4");
            File gpxfile = new File(file, fileNameWithExtension);
            FileWriter writer = new FileWriter(gpxfile);
            writer.append(textToWrite);
            writer.flush();
            writer.close();

            Toast.makeText(contextSat, "Saved your text in " + gpxfile.getPath(), Toast.LENGTH_LONG).show();
        }catch (Exception e){
            Log.d("MADARA", e.toString());
            e.printStackTrace();
        }
    }

    public String getBASE_ROOT_DIR(){
        return BASE_ROOT_DIR;
    }
}
