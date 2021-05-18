package com.elginm8;

import androidx.appcompat.app.AppCompatActivity;

import com.elgin.e1.Fiscal.SAT;

import com.facebook.react.bridge.ReadableMap;
import java.util.Random;

import br.com.elgin.sat.ElginSATMainActivity;

public class Sat extends ElginSATMainActivity {

    public Sat() {
    }

    public String enviarVenda(ReadableMap map) {
        Random r = new Random();
        String xmlVenda = (String) map.getString("xmlSale");
        String codeAtivacao = (String) map.getString("codeAtivacao");
        String result = "";
        return SAT.EnviarDadosVenda(r.nextInt(99999), codeAtivacao, xmlVenda);
    }

    public String cancelarVenda(ReadableMap map) {
        Random r = new Random();
        String codeAtivacao = (String) map.getString("codeAtivacao");
        String cFeNumber = (String) map.getString("cFeNumber");
        String xmlCancelamento = (String) map.getString("xmlCancelamento");
        return SAT.CancelarUltimaVenda(r.nextInt(99999), codeAtivacao, cFeNumber, xmlCancelamento);
    }

    public String statusOperacional(ReadableMap map) {
        Random r = new Random();
        String codeAtivacao = (String) map.getString("codeAtivacao");
        return SAT.ConsultarStatusOperacional(r.nextInt(99999), codeAtivacao);
    }
}
