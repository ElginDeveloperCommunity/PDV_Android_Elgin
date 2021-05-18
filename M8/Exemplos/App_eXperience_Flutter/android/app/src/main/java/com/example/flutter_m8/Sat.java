package com.example.flutter_m8;

import com.elgin.e1.Fiscal.SAT;

import java.util.Map;
import java.util.Random;

import br.com.elgin.sat.ElginSATMainActivity;

public class Sat extends ElginSATMainActivity {

    public Sat() {    }

    public String ativarSat(Map map) {
        int numSess = (int) map.get("numSess");
        int subCmd = (int) map.get("subCmd");
        String codeAtivacao = (String) map.get("codeAtivacao");
        String cnpj = (String) map.get("cnpj");
        int cUF = (int) map.get("cUF");
        System.out.println(numSess + " " + subCmd + " " + codeAtivacao + " " + cnpj + " " + cUF);
        return SAT.AtivarSAT(numSess, subCmd, codeAtivacao, cnpj, cUF);
    }

    public String associarAssinatura(Map map) {
        int numSess = (int) map.get("numSess");
        String codeAtivacao = (String) map.get("codeAtivacao");
        String cnpjSh = (String) map.get("cnpjSh");
        String assinaturaAC = (String) map.get("assinaturaAC");
        return SAT.AssociarAssinatura(numSess, codeAtivacao, cnpjSh, assinaturaAC);
    }

    public String enviarVenda(Map map) {
        Random r = new Random();
        String xmlVenda = (String) map.get("xmlSale");
        String codeAtivacao = (String) map.get("codeAtivacao");
        String result = "";
        return SAT.EnviarDadosVenda(r.nextInt(99999), codeAtivacao, xmlVenda);
    }

    public String cancelarVenda(Map map) {
        Random r = new Random();
        String codeAtivacao = (String) map.get("codeAtivacao");
        String cFeNumber = (String) map.get("cFeNumber");
        String xmlCancelamento = (String) map.get("xmlCancelamento");
        return SAT.CancelarUltimaVenda(r.nextInt(99999), codeAtivacao, cFeNumber, xmlCancelamento);
    }

    public String statusOperacional(Map map) {
        Random r = new Random();
        String codeAtivacao = (String) map.get("codeAtivacao");
        return SAT.ConsultarStatusOperacional(r.nextInt(99999), codeAtivacao);
    }
}
