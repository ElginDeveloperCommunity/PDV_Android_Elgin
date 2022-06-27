package com.elgin.intent_digital_hub.SAT;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.elgin.intent_digital_hub.ActivityUtils;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommandStarter;
import com.elgin.intent_digital_hub.IntentDigitalHubService.SAT.AssociarAssinatura;
import com.elgin.intent_digital_hub.IntentDigitalHubService.SAT.AtivarSAT;
import com.elgin.intent_digital_hub.IntentDigitalHubService.SAT.CancelarUltimaVenda;
import com.elgin.intent_digital_hub.IntentDigitalHubService.SAT.ConsultarSAT;
import com.elgin.intent_digital_hub.IntentDigitalHubService.SAT.ConsultarStatusOperacional;
import com.elgin.intent_digital_hub.IntentDigitalHubService.SAT.EnviarDadosVenda;
import com.elgin.intent_digital_hub.IntentDigitalHubService.SAT.ExtrairLogs;
import com.elgin.intent_digital_hub.R;
import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class SATActivity extends AppCompatActivity {

    private static final int ATIVAR_SAT_REQUESTCODE = 1;
    private static final int ASSOCIAR_ASSINATURA_REQUESTCODE = 2;
    private static final int CONSULTAR_SAT_REQUESTCODE = 3;
    private static final int CONSULTAR_STATUS_OPERACIONAL_REQUESTCODE = 4;
    private static final int ENVIAR_DADOS_VENDA_REQUESTCODE = 5;
    private static final int CANCELAR_ULTIMA_VENDA_REQUESTCODE = 6;
    private static final int EXTRAIR_LOGS_REQUESTCODE = 7;
    //Nome do arquivo utilizado para fazer o cancelamento de venda, no drietório res/raw/
    final private String XML_CANCELLATION_ARCHIVE_NAME = "sat_cancelamento";
    private final String XML_EXTENSION = ".xml";
    //Views
    private TextView textRetorno;
    private EditText editTextInputCodeAtivacao;
    private RadioGroup radioGroupModelsSAT;
    private RadioButton radioButtonSMARTSAT;
    private Button buttonConsultarSAT;
    private Button buttonConsultarStatusOperacionalSAT;
    private Button buttonRealizarVendaSAT;
    private Button buttonCancelamentoSAT;
    private Button buttonAtivarSAT;
    private Button buttonAssociarSAT;
    private Button buttonExtrairLogSat;
    //Váriavel utilizada para fazer a substituição da tag CFE, necessária para a montagem do xml de cancelamento
    private String cfeCancelamento = "";
    //Modelo de SAT selecionado
    private SatModel selectedSatModel = SatModel.SMART_SAT;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_satactivity);

        textRetorno = findViewById(R.id.textRetorno);

        radioGroupModelsSAT = findViewById(R.id.radioGroupModelsSAT);
        radioButtonSMARTSAT = findViewById(R.id.radioButtonSMARTSAT);

        editTextInputCodeAtivacao = findViewById(R.id.editTextInputCodeAtivacao);
        editTextInputCodeAtivacao.setText("123456789");

        buttonConsultarSAT = findViewById(R.id.buttonConsultarSAT);
        buttonConsultarStatusOperacionalSAT = findViewById(R.id.buttonConsultarStatusOperacionalSAT);
        buttonRealizarVendaSAT = findViewById(R.id.buttonRealizarVendaSAT);
        buttonCancelamentoSAT = findViewById(R.id.buttonCancelamentoSAT);
        buttonAtivarSAT = findViewById(R.id.buttonAtivarSAT);
        buttonAssociarSAT = findViewById(R.id.buttonAssociarSAT);
        buttonExtrairLogSat = findViewById(R.id.buttonExtrairLogSat);

        //Modelo do SAT escolhido inicialmente e funcionalidade do radioButton de seleção
        radioButtonSMARTSAT.setChecked(true);

        radioGroupModelsSAT.setOnCheckedChangeListener((group, checkedId) -> {
            selectedSatModel = (checkedId == R.id.radioButtonSMARTSAT) ? SatModel.SMART_SAT : SatModel.SAT_GO;
        });

        buttonAtivarSAT.setOnClickListener(this::buttonAtivarSATFunction);

        buttonAssociarSAT.setOnClickListener(this::buttonAssociarSatFunction);

        buttonConsultarSAT.setOnClickListener(this::buttonConsultarSATFunction);

        buttonConsultarStatusOperacionalSAT.setOnClickListener(this::buttonConsultarStatusOperacionalSATFunction);

        buttonRealizarVendaSAT.setOnClickListener(this::buttonRealizarVendaSATFunction);

        buttonCancelamentoSAT.setOnClickListener(this::buttonCancelamentoSATFunction);

        buttonExtrairLogSat.setOnClickListener(this::buttonExtrairLogSatFunction);
    }

    private void buttonAtivarSATFunction(View v) {
        final int numSessao = generateNumberForSatSession();
        final int subComando = 2;
        final String codAtivacao = editTextInputCodeAtivacao.getText().toString();
        final String cnpj = "14200166000166";
        final int cUF = 15;

        AtivarSAT ativarSatCommand = new AtivarSAT(numSessao,
                subComando,
                codAtivacao,
                cnpj,
                cUF);

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, ativarSatCommand, ATIVAR_SAT_REQUESTCODE);
    }

    private void buttonAssociarSatFunction(View v) {
        final int numSessao = generateNumberForSatSession();
        final String codAtivacao = editTextInputCodeAtivacao.getText().toString();
        final String cnpjSh = "16716114000172";
        final String assinaturaAC = "SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT";

        AssociarAssinatura associarAssinaturaCommand = new AssociarAssinatura(numSessao,
                codAtivacao,
                cnpjSh,
                assinaturaAC);

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, associarAssinaturaCommand, ASSOCIAR_ASSINATURA_REQUESTCODE);
    }

    private void buttonConsultarSATFunction(View v) {
        final int numSessao = generateNumberForSatSession();

        ConsultarSAT consultarSATCommand = new ConsultarSAT(numSessao);

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, consultarSATCommand, CONSULTAR_SAT_REQUESTCODE);
    }

    private void buttonConsultarStatusOperacionalSATFunction(View v) {
        final int numSessao = generateNumberForSatSession();
        final String codAtivacao = editTextInputCodeAtivacao.getText().toString();

        ConsultarStatusOperacional consultarStatusOperacionalCommand = new ConsultarStatusOperacional(numSessao, codAtivacao);

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, consultarStatusOperacionalCommand, CONSULTAR_STATUS_OPERACIONAL_REQUESTCODE);
    }

    private void buttonRealizarVendaSATFunction(View v) {
        //Como uma nova venda será realizada, o cfeCancelamento utilizado para cancelamento deve ser sobrescrito
        cfeCancelamento = "";

        final int numSessao = generateNumberForSatSession();
        final String codAtivacao = editTextInputCodeAtivacao.getText().toString();

        //O envio de venda SAT será realizo por PATH, por isso é necessário salvar o XMl do projeto dentro do diretório da aplicação, para depois referenciar seu caminho
        ActivityUtils.loadXMLFileAndStoreItOnApplicationRootDir(this, selectedSatModel.getSALE_XML_ARCHIVE_NAME());

        final String dadosVenda = ActivityUtils.getFilePathForIDH(this, selectedSatModel.getSALE_XML_ARCHIVE_NAME() + XML_EXTENSION);

        EnviarDadosVenda enviarDadosVendaCommand = new EnviarDadosVenda(numSessao, codAtivacao, dadosVenda);

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, enviarDadosVendaCommand, ENVIAR_DADOS_VENDA_REQUESTCODE);
    }

    private void buttonCancelamentoSATFunction(View v) {
        final int numSessao = generateNumberForSatSession();
        final String codAtivacao = editTextInputCodeAtivacao.getText().toString();
        final String numeroCFe = cfeCancelamento;

        if (cfeCancelamento.isEmpty()) {
            ActivityUtils.showAlertMessage(this, "Alerta", "Não foi feita uma venda para cancelar!");
            return;
        }

        final String dadosCancelamento = generateXmlForSatCancellation();

        CancelarUltimaVenda cancelarUltimaVendaCommand = new CancelarUltimaVenda(numSessao, codAtivacao, numeroCFe, dadosCancelamento);

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, cancelarUltimaVendaCommand, CANCELAR_ULTIMA_VENDA_REQUESTCODE);
    }

    private void buttonExtrairLogSatFunction(View v) {
        final int numSessao = generateNumberForSatSession();
        final String codAtivacao = editTextInputCodeAtivacao.getText().toString();

        ExtrairLogs extrairLogsCommand = new ExtrairLogs(numSessao, codAtivacao);

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, extrairLogsCommand, EXTRAIR_LOGS_REQUESTCODE);
    }

    //Gera número aleatório para diferenciar as sessões com o dispositivo
    private int generateNumberForSatSession() {
        return new Random().nextInt(1_000_000);
    }

    /**
     * Utiliza o XML em res/raw/sat_cancelamento como base para gerar um XML de cancelamento de venda SAT
     *
     * @return String já formatada para envio no JSON de comando
     */

    private String generateXmlForSatCancellation() {
        //Lẽ o XMl base usado para cancelamento de venda SAT
        String baseXmlForCacellation = ActivityUtils.readXmlFileAsString(this, XML_CANCELLATION_ARCHIVE_NAME);
        //Troca o valor do cfe do XMl base pelo valor do cfeCancelamento mais atual e formata a String com os escapes necessários para o funcionamento
        return baseXmlForCacellation.replace("novoCFe", cfeCancelamento).replaceAll("\"", "\\\\\"");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == RESULT_OK) {
            final String retorno = data.getStringExtra("retorno");
            Log.d("retorno", retorno);
            /**
             * No módulo SAT apenas um comando é executa por vez, portanto o retorno do comando mais recente está sempre na primeira posição do arrayJSON de retorno
             */
            try {
                JSONArray jsonArray = new JSONArray(retorno);
                JSONObject jsonObjectReturn = jsonArray.getJSONObject(0);

                switch (requestCode) {
                    case ATIVAR_SAT_REQUESTCODE:
                        AtivarSAT ativarSATCommand = new Gson().fromJson(jsonObjectReturn.toString(), AtivarSAT.class);
                        textRetorno.setText(ativarSATCommand.getResultado());
                        break;
                    case ASSOCIAR_ASSINATURA_REQUESTCODE:
                        AssociarAssinatura associarAssinaturaCommand = new Gson().fromJson(jsonObjectReturn.toString(), AssociarAssinatura.class);
                        textRetorno.setText(associarAssinaturaCommand.getResultado());
                        break;
                    case CONSULTAR_SAT_REQUESTCODE:
                        ConsultarSAT consultarSATCommand = new Gson().fromJson(jsonObjectReturn.toString(), ConsultarSAT.class);
                        textRetorno.setText(consultarSATCommand.getResultado());
                        break;
                    case CONSULTAR_STATUS_OPERACIONAL_REQUESTCODE:
                        ConsultarStatusOperacional consultarStatusOperacionalCommand = new Gson().fromJson(jsonObjectReturn.toString(), ConsultarStatusOperacional.class);
                        textRetorno.setText(consultarStatusOperacionalCommand.getResultado());
                        break;
                    case ENVIAR_DADOS_VENDA_REQUESTCODE:
                        EnviarDadosVenda enviarDadosVendaCommand = new Gson().fromJson(jsonObjectReturn.toString(), EnviarDadosVenda.class);
                        textRetorno.setText(enviarDadosVendaCommand.getResultado());

                        //Se a venda ocorreu com sucesso, atualizar o cfe de cancelamento
                        List<String> saleReturn = Arrays.asList(enviarDadosVendaCommand.getResultado().split("\\|"));

                        if (saleReturn.size() > 8) {
                            this.cfeCancelamento = saleReturn.get(8);
                        }

                        break;
                    case CANCELAR_ULTIMA_VENDA_REQUESTCODE:
                        CancelarUltimaVenda cancelarUltimaVendaCommand = new Gson().fromJson(jsonObjectReturn.toString(), CancelarUltimaVenda.class);
                        textRetorno.setText(cancelarUltimaVendaCommand.getResultado());
                        break;
                    case EXTRAIR_LOGS_REQUESTCODE:
                        ExtrairLogs extrairLogsCommand = new Gson().fromJson(jsonObjectReturn.toString(), ExtrairLogs.class);

                        /*
                        Se o dispositivo não tiver sido encontrado, simplesmente exiba o retorno 'DeviceNotFound' na tela
                        caso contrário, indique que o log foi salvo no caminho
                        */

                        if (extrairLogsCommand.getResultado().equals("DeviceNotFound"))
                            textRetorno.setText(extrairLogsCommand.getResultado());
                        else {
                            textRetorno.setText("Log SAT salvo em " + extrairLogsCommand.getResultado());
                        }
                        break;
                    default:
                        ActivityUtils.showAlertMessage(this, "Alerta", "Código de comando não encontrado");
                }
            } catch (JSONException e) {
                e.printStackTrace();
                ActivityUtils.showAlertMessage(this, "Alerta", "O retorno não está no formato esperado!");
            }
        }
    }
}