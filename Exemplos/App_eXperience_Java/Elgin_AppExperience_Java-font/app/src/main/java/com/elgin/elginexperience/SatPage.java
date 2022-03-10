package com.elgin.elginexperience;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import com.elgin.elginexperience.Services.SatService;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class SatPage extends AppCompatActivity {
    static Context context;
    public SatService serviceSat;

    TextView textRetorno;

    EditText editTextInputCodeAtivacao;
    RadioGroup radioGroupModelsSAT;
    RadioButton radioButtonSMARTSAT;

    Button buttonConsultarSAT;
    Button buttonStatusOperacionalSAT;
    Button buttonRealizarVendaSAT;
    Button buttonCancelamentoSAT;
    Button buttonAtivarSAT;
    Button buttonAssociarSAT;

    String xmlEnviaDadosVenda = "xmlenviadadosvendasat";
    String xmlCancelamento = "cancelamentosatgo";

    String cfeCancelamento = "";
    String typeModelSAT = "SMART SAT";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sat_page);
        context = this;
        serviceSat = new SatService(context);

        textRetorno = findViewById(R.id.textRetorno);

        radioButtonSMARTSAT = findViewById(R.id.radioButtonSMARTSAT);
        editTextInputCodeAtivacao = findViewById(R.id.editTextInputCodeAtivacao);
        editTextInputCodeAtivacao.setText("123456789");

        buttonConsultarSAT = findViewById(R.id.buttonConsultarSAT);
        buttonStatusOperacionalSAT = findViewById(R.id.buttonStatusOperacionalSAT);
        buttonRealizarVendaSAT = findViewById(R.id.buttonRealizarVendaSAT);
        buttonCancelamentoSAT = findViewById(R.id.buttonCancelamentoSAT);
        buttonAtivarSAT = findViewById(R.id.buttonAtivarSAT);
        buttonAssociarSAT = findViewById(R.id.buttonAssociarSAT);

        //CONFIGS MODEL BALANÇA
        radioButtonSMARTSAT.setChecked(true);
        radioGroupModelsSAT = findViewById(R.id.radioGroupModelsSAT);
        radioGroupModelsSAT.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @SuppressLint("NonConstantResourceId")
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                switch (checkedId) {
                    case R.id.radioButtonSMARTSAT:
                        typeModelSAT = "SMART SAT";
                        break;
                    case R.id.radioButtonSATGO:
                        typeModelSAT = "SATGO";
                        break;
                }
            }
        });

        buttonConsultarSAT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { sendConsultarSAT(); }
        });

        buttonStatusOperacionalSAT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { sendStatusOperacionalSAT(); }
        });

        buttonRealizarVendaSAT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    sendEnviarVendasSAT();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });

        buttonCancelamentoSAT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    sendCancelarVendaSAT();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });

        buttonAtivarSAT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { sendAtivarSAT(); }
        });

        buttonAssociarSAT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { sendAssociarSAT(); }
        });
    }

    public void sendAtivarSAT(){
        String retorno = "...";
        Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("numSessao", getNumeroSessao());
        mapValues.put("subComando", 2);
        mapValues.put("codeAtivacao", editTextInputCodeAtivacao.getText().toString());
        mapValues.put("cnpj", "14200166000166");
        mapValues.put("cUF", 15);

        retorno = serviceSat.ativarSAT(mapValues);
        textRetorno.setText(retorno);
    }

    public void sendAssociarSAT(){
        String retorno = "...";
        Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("numSessao", getNumeroSessao());
        mapValues.put("codeAtivacao", editTextInputCodeAtivacao.getText().toString());
        mapValues.put("cnpjSh", "16716114000172");
        mapValues.put("assinaturaAC", "SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT");

        retorno = serviceSat.associarAssinatura(mapValues);
        textRetorno.setText(retorno);
    }

    public void sendConsultarSAT(){
        String retorno = "...";
        Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("numSessao", getNumeroSessao());

        retorno = serviceSat.consultarSAT(mapValues);
        textRetorno.setText(retorno);
    }

    public void sendStatusOperacionalSAT(){
        String retorno = "...";
        Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("numSessao", getNumeroSessao());
        mapValues.put("codeAtivacao", editTextInputCodeAtivacao.getText().toString());

        retorno = serviceSat.statusOperacional(mapValues);
        textRetorno.setText(retorno);
    }

    public void sendEnviarVendasSAT() throws IOException {
        String retorno = "...";
        String stringXMLSat;

        cfeCancelamento = "";

        if(typeModelSAT.equals("SMART SAT")){
            xmlEnviaDadosVenda = "xmlenviadadosvendasat";
        }else{
            xmlEnviaDadosVenda = "satgo3";
        }

        InputStream ins = MainActivity.context.getResources().openRawResource(
                MainActivity.context.getResources().getIdentifier(
                        xmlEnviaDadosVenda,
                        "raw",
                        MainActivity.context.getPackageName()
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
            line = br.readLine();
        }
        stringXMLSat = sb.toString();

        Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("numSessao", getNumeroSessao());
        mapValues.put("codeAtivacao", editTextInputCodeAtivacao.getText().toString());
        mapValues.put("xmlSale", stringXMLSat);

        retorno = serviceSat.enviarVenda(mapValues);

        List<String> newRetorno = Arrays.asList(retorno.split("\\|"));
        if(newRetorno.size() > 8){
            cfeCancelamento = newRetorno.get(8);
        }

        textRetorno.setText(retorno);
    }

    public void sendCancelarVendaSAT() throws IOException {
        String retorno = "...";
        String stringXMLSat;

        InputStream ins = MainActivity.context.getResources().openRawResource(
                MainActivity.context.getResources().getIdentifier(
                        xmlCancelamento,
                        "raw",
                        MainActivity.context.getPackageName()
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
            line = br.readLine();
        }
        stringXMLSat = sb.toString();
        stringXMLSat = stringXMLSat.replace("novoCFe", cfeCancelamento);

        Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("numSessao", getNumeroSessao());
        mapValues.put("codeAtivacao", editTextInputCodeAtivacao.getText().toString());
        mapValues.put("xmlCancelamento", stringXMLSat);
        mapValues.put("cFeNumber", cfeCancelamento);

        retorno = serviceSat.cancelarVenda(mapValues);
        textRetorno.setText(retorno);
    }

    private int getNumeroSessao() {
        return new Random().nextInt(1_000_000);
    }
}