package com.elginm8;

import android.content.Context;
import android.os.Build;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.RequiresApi;

import java.io.File;
import java.io.FileWriter;

import java.util.Arrays;
import java.util.Optional;
import java.util.Random;

import java.util.concurrent.atomic.AtomicReference;

import br.com.elgin.DeviceInfo;
import br.com.elgin.Sat;
import br.com.elgin.SatInitializer;
import com.facebook.react.bridge.ReadableMap;

public class ServiceSat {
    public static SatInitializer satInitializer;
    private static Context contextSat;

    private static String BASE_ROOT_DIR;

    private static final String SATLOG_ARCHIVE_NAME = "SatLog.txt";

    public  ServiceSat (Context context){
        satInitializer = new SatInitializer();
        contextSat = context;

        BASE_ROOT_DIR = "/Android/data/" + contextSat.getPackageName() + "/";
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    public static String ativarSAT(ReadableMap map){
        int numSessao = getNumeroSessao();
        int subComando = map.getInt("subComando");
        String codeAtivacao = map.getString("codeAtivacao");
        String cnpj = map.getString("cnpj");
        int cUF = map.getInt("cUF");

        StringBuilder valueRetorn = new StringBuilder(Sat.ativarSat(numSessao, subComando, codeAtivacao, cnpj, cUF));
        if (valueRetorn.toString().contains("NomParsing")) {
            valueRetorn = new StringBuilder(valueRetorn.toString().replace("NomParsing(", "").replace(", Digit)", ""));

            int[] arr = Arrays.stream(valueRetorn.substring(1, valueRetorn.length() - 1).split(","))
                    .map(String::trim).mapToInt(Integer::parseInt).toArray();

            valueRetorn = new StringBuilder();
            for (int item : arr) {
                valueRetorn.append((char) item);
            }
        }

        mostrarRetorno(valueRetorn.toString());
        return valueRetorn.toString();
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    public static String associarAssinatura(ReadableMap map) {
        int numSessao = getNumeroSessao();
        String codeAtivacao = map.getString("codeAtivacao");
        String cnpjSh = map.getString("cnpjSh");
        String assinaturaAC = map.getString("assinaturaAC");

        StringBuilder valueRetorn = new StringBuilder(Sat.associarAssinatura(numSessao, codeAtivacao, cnpjSh, assinaturaAC));
        if (valueRetorn.toString().contains("NomParsing")) {
            valueRetorn = new StringBuilder(valueRetorn.toString().replace("NomParsing(", "").replace(", Digit)", ""));

            int[] arr = Arrays.stream(valueRetorn.substring(1, valueRetorn.length() - 1).split(","))
                    .map(String::trim).mapToInt(Integer::parseInt).toArray();

            valueRetorn = new StringBuilder();
            for (int item : arr) {
                valueRetorn.append((char) item);
            }
        }

        mostrarRetorno(valueRetorn.toString());
        return valueRetorn.toString();
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    public static String consultarSAT(ReadableMap map) {
        int numSessao = getNumeroSessao();

        StringBuilder valueRetorn = new StringBuilder(Sat.consultarSat((Integer) numSessao));
        if (valueRetorn.toString().contains("NomParsing")) {
            valueRetorn = new StringBuilder(valueRetorn.toString().replace("NomParsing(", "").replace(", Digit)", ""));

            int[] arr = Arrays.stream(valueRetorn.substring(1, valueRetorn.length() - 1).split(","))
                    .map(String::trim).mapToInt(Integer::parseInt).toArray();

            valueRetorn = new StringBuilder();
            for (int item : arr) {
                valueRetorn.append((char) item);
            }
        }

        mostrarRetorno(valueRetorn.toString());
        return valueRetorn.toString();
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    public static String statusOperacional(ReadableMap map){
        int numSessao = getNumeroSessao();
        String codeAtivacao = map.getString("codeAtivacao");

        StringBuilder valueRetorn = new StringBuilder(Sat.consultarStatusOperacional(numSessao,codeAtivacao));
        if (valueRetorn.toString().contains("NomParsing")) {
            valueRetorn = new StringBuilder(valueRetorn.toString().replace("NomParsing(", "").replace(", Digit)", ""));

            int[] arr = Arrays.stream(valueRetorn.substring(1, valueRetorn.length() - 1).split(","))
                    .map(String::trim).mapToInt(Integer::parseInt).toArray();

            valueRetorn = new StringBuilder();
            for (int item : arr) {
                valueRetorn.append((char) item);
            }
        }

        mostrarRetorno(valueRetorn.toString());

        return valueRetorn.toString();
    }


    @RequiresApi(api = Build.VERSION_CODES.N)
    public static String enviarVenda(ReadableMap map){
        int numSessao = getNumeroSessao();
        String codeAtivacao = map.getString("codeAtivacao");
        String xmlSale = map.getString("xmlSale");

        StringBuilder valueRetorn = new StringBuilder(Sat.enviarDadosVenda(numSessao, codeAtivacao, xmlSale));
        if (valueRetorn.toString().contains("NomParsing")) {
            valueRetorn = new StringBuilder(valueRetorn.toString().replace("NomParsing(", "").replace(", Digit)", ""));

            int[] arr = Arrays.stream(valueRetorn.substring(1, valueRetorn.length() - 1).split(","))
                    .map(String::trim).mapToInt(Integer::parseInt).toArray();

            valueRetorn = new StringBuilder();
            for (int item : arr) {
                valueRetorn.append((char) item);
            }
        }

        mostrarRetorno(valueRetorn.toString());
        return valueRetorn.toString();
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    public static String cancelarVenda(ReadableMap map){
        int numSessao = getNumeroSessao();
        String codeAtivacao = map.getString("codeAtivacao");
        String cFeNumber = map.getString("cFeNumber");
        String xmlCancelamento = map.getString("xmlCancelamento");

        StringBuilder valueRetorn = new StringBuilder(Sat.cancelarUltimaVenda(numSessao, codeAtivacao, cFeNumber, xmlCancelamento));
        if (valueRetorn.toString().contains("NomParsing")) {
            valueRetorn = new StringBuilder(valueRetorn.toString().replace("NomParsing(", "").replace(", Digit)", ""));

            int[] arr = Arrays.stream(valueRetorn.substring(1, valueRetorn.length() - 1).split(","))
                    .map(String::trim).mapToInt(Integer::parseInt).toArray();

            valueRetorn = new StringBuilder();
            for (int item : arr) {
                valueRetorn.append((char) item);
            }
        }

        mostrarRetorno(valueRetorn.toString());
        return valueRetorn.toString();
    }

    public static String extrairLog(ReadableMap map){
        int numSessao = (Integer) map.getInt("numSessao");
        String codeAtivacao = (String) map.getString("codeAtivacao");

        String extractedLog = "";
        extractedLog = Sat.extrairLogs(numSessao,codeAtivacao);

        if(extractedLog.equals("DeviceNotFound")){
            return extractedLog;
        }

        String extractedLogInArray[] = extractedLog.split("[|]");

        byte[] byteArrayWithStringConverted = android.util.Base64.decode(extractedLogInArray[5],android.util.Base64.DEFAULT);

        String logtoBeSavedInStorage = new String(byteArrayWithStringConverted);
        System.out.println("LOG SAT:"+logtoBeSavedInStorage);

        return logtoBeSavedInStorage;
    }


    private static void mostrarRetorno(String retorno) {
        Toast.makeText(contextSat, String.format("Retorno: %s", retorno), Toast.LENGTH_LONG).show();
    }

    private static int getNumeroSessao() {
        return new Random().nextInt(1_000_000);
    }

    private static String storagePathToAbsolutePath(String pathFromStorageRoot) {
        final StringBuffer buffer = new StringBuffer(255);

        buffer.append(Environment.getExternalStorageDirectory().getAbsolutePath());

        if (pathFromStorageRoot.charAt(0) != '/') {
            buffer.append('/');
        }

        buffer.append(pathFromStorageRoot);

        return buffer.toString();
    }

    private static boolean createRootDirectory(Context ctx) {
        // Constant, copied here: private static final String BASE_DIR = "/Android/data/";
        final String dataDir = storagePathToAbsolutePath(BASE_ROOT_DIR);
        System.out.println("SAT DIR"+dataDir);
        System.out.println("SAT DIR"+storagePathToAbsolutePath(BASE_ROOT_DIR));

        final File f = new File(dataDir);
        return f.mkdirs();
    }
    private static void writeFileOnStorage(String fileNameWithExtension, String textToWrite){
        File file = new File(storagePathToAbsolutePath(BASE_ROOT_DIR), "files");


        if(!file.exists()){
            file.mkdir();
        }

        try{
            File gpxfile = new File(file, fileNameWithExtension);
            FileWriter writer = new FileWriter(gpxfile);
            writer.append(textToWrite);
            writer.flush();
            writer.close();

        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
