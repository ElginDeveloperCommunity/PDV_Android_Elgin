package com.elgin.elginexperience;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

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

import br.com.elgin.Sat;

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
    Button buttonExtrairLogSat;

    String xmlEnviaDadosVenda = "xmlenviadadosvendasat";
    String xmlCancelamento = "cancelamentosatgo";

    String cfeCancelamento = "";
    String typeModelSAT = "SMART SAT";

    public String logSavedMessage;

    private static final int REQUEST_CODE_WRITE_EXTERNAL_STORAGE = 1234;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sat_page);
        context = this;
        serviceSat = new SatService(context);

        logSavedMessage = "Log Sat Salvo em " + serviceSat.getBASE_ROOT_DIR();

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
        buttonExtrairLogSat = findViewById(R.id.buttonExtrairLogSat);

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

        buttonExtrairLogSat.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
               //Checa se a permissão necessária esta garantida e se não, a mesma deve ser pedida para continuar com a função
               if(isStoragePermissionGranted()){
                   Map<String, Object> mapValues = new HashMap<>();

                   mapValues.put("numSessao", getNumeroSessao());
                   mapValues.put("codeAtivacao", editTextInputCodeAtivacao.getText().toString());

                   //Verifica se a extração de log foi bem-sucedida ou não
                   boolean wasExtractedLogSucessful = serviceSat.extrairLog(mapValues);

                   //Se a extração de log foi bem sucedida, exibir a mensagem de salvamento no campo de retorno
                   if(wasExtractedLogSucessful) textRetorno.setText(logSavedMessage);
                   //Caso contrário, exiba a mensagem padrão de retorno de Sat não conectado/encontrado
                   else { textRetorno.setText("DeviceNotFound"); }

               }
            }
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

    //Checa se a permissão para escrever arquivos em diretórios externos foi garantida, se não tiver ; peça novamente
    public  boolean isStoragePermissionGranted() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                Log.v("DEBUG","A permissão está garantida!");
                return true;
            } else {
                Log.v("DEBUG","A permissão está negada!");
                //Pedindo permissão
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
                return false;
            }
        }
        else { //A permissão é automaticamente concecida em sdk > 23 na instalação
            Log.v("DEBUG","A permissão está garantida!");
            return true;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if(requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
            Log.v("DEBUG","Permission: "+permissions[0]+ "was "+grantResults[0]);
            //A permissão necessária acabou de ser garantida, continue com a operação em questão
            Map<String, Object> mapValues = new HashMap<>();

            mapValues.put("numSessao", getNumeroSessao());
            mapValues.put("codeAtivacao", editTextInputCodeAtivacao.getText().toString());

            serviceSat.extrairLog(mapValues);

            //Verifica se a extração de log foi bem-sucedida ou não
            boolean wasExtractedLogSucessful = serviceSat.extrairLog(mapValues);

            //Se a extração de log foi bem sucedida, exibir a mensagem de salvamento no campo de retorno
            if(wasExtractedLogSucessful) textRetorno.setText(logSavedMessage);
                //Caso contrário, exiba a mensagem padrão de retorno de Sat não conectado/encontrado
            else { textRetorno.setText("DeviceNotFound"); }

        }else if(requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE){
            Toast.makeText(context, "O log da SAT é salvo em um arquivo .txt no storage do dispositivo e é necessário garantir a permissão para tal operação!", Toast.LENGTH_LONG).show();
        }
    }


}