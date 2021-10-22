package com.elginm8;

import android.app.Activity;
import android.content.Context;
import android.widget.Toast;

import com.elgin.e1.Balanca.BalancaE1;
import com.facebook.react.bridge.ReadableMap;



import java.util.Map;

public class Balanca {
    private static Context mContext;

    public Balanca(Activity activity) {
        mContext = activity;
    }

    public static String configBalanca(ReadableMap map) {
        String modelBalanca = (String) map.getString("model");
        String protocol = (String) map.getString("protocol");

        int MODEL = 0;
        int PROTOCOL = 0;

        switch (modelBalanca) {
            case "DP30CK":
                MODEL = 0;
                break;
            case "SA110":
                MODEL = 1;
                break;
            case "DPSC":
                MODEL = 2;
                break;
            default:
                MODEL = 0;
        }

        switch (protocol) {
            case "PROTOCOLO 0":
                PROTOCOL = 0;
                break;
            case "PROTOCOLO 1":
                PROTOCOL = 1;
                break;
            case "PROTOCOLO 2":
                PROTOCOL = 2;
                break;
            case "PROTOCOLO 3":
                PROTOCOL = 3;
                break;
            case "PROTOCOLO 4":
                PROTOCOL = 4;
                break;
            case "PROTOCOLO 5":
                PROTOCOL = 5;
                break;
            case "PROTOCOLO 6":
                PROTOCOL = 6;
                break;
            case "PROTOCOLO 7":
                PROTOCOL = 7;
                break;
            default:
                PROTOCOL = 0;
        }

        int retorno1 = BalancaE1.ConfigurarModeloBalanca(MODEL);
        int retorno2 = BalancaE1.ConfigurarProtocoloComunicacao(PROTOCOL);
        mostrarRetorno(String.format("\nConfigurarModeloBalanca: %d\nConfigurarProtocoloComunicacao: %d", retorno1, retorno2));

        return  String.valueOf(retorno1);
    }

    public static String lerPesoBalanca() {
        int retorno1 = BalancaE1.AbrirSerial(2400, 8, 'n', 1); // Configuracao serial da balanca...
        String retorno2 = BalancaE1.LerPeso(1);
        int retorno3 = BalancaE1.Fechar();
        mostrarRetorno(String.format("\nAbrirSerial: %d\nLerPeso: %s\nFechar: %d", retorno1, retorno2, retorno3));

        return  retorno2;
    }

    private static void mostrarRetorno(String retorno) {
        Toast.makeText(mContext, String.format("Retorno: %s", retorno), Toast.LENGTH_SHORT).show();
    }
}
