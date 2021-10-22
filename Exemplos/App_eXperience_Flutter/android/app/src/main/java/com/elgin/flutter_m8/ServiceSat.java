package com.elgin.flutter_m8;

import android.content.Context;
import android.widget.Toast;

import java.util.Map;
import java.util.Optional;
import java.util.Random;

import br.com.elgin.DeviceInfo;
import br.com.elgin.Sat;
import br.com.elgin.SatInitializer;

public class ServiceSat {
    public static  SatInitializer satInitializer;
    private Context contextSat;

    public ServiceSat(Context context){
        satInitializer = new SatInitializer();
        contextSat = context;
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

    public String extrairLog(Map map){
        String retorno = "...";

        int numSessao = (int) map.get("numSessao");
        String codeAtivacao = (String) map.get("codeAtivacao");

        retorno = Sat.extrairLogs(numSessao, codeAtivacao);
        return retorno;
    }


    private void mostrarRetorno(String retorno) {
        Toast.makeText(contextSat, String.format("Retorno: %s", retorno), Toast.LENGTH_LONG).show();
    }
}
