package com.elginm8;

import android.content.Context;
import android.os.Build;
import android.widget.Toast;

import androidx.annotation.RequiresApi;

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

    public  ServiceSat (Context context){
        satInitializer = new SatInitializer();
        contextSat = context;
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

    private static void mostrarRetorno(String retorno) {
        Toast.makeText(contextSat, String.format("Retorno: %s", retorno), Toast.LENGTH_LONG).show();
    }

    private static int getNumeroSessao() {
        return new Random().nextInt(1_000_000);
    }
}
