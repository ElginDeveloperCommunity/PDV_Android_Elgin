package com.elgin.intent_digital_hub.Bridge;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.InputType;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.content.res.AppCompatResources;

import com.elgin.intent_digital_hub.ActivityUtils;
import com.elgin.intent_digital_hub.InputMasks.InputMaskMoney;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.BridgeCommand;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.ConsultarStatus;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.ConsultarUltimaTransacao;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.GetTimeout;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.ImprimirCupomNfce;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.ImprimirCupomSat;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.ImprimirCupomSatCancelamento;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.IniciaCancelamentoVenda;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.IniciaOperacaoAdministrativa;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.IniciaVendaCredito;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.IniciaVendaDebito;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.SetSenha;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.SetSenhaServer;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.SetServer;
import com.elgin.intent_digital_hub.IntentDigitalHubService.BRIDGE.SetTimeout;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommand;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommandStarter;
import com.elgin.intent_digital_hub.R;
import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BridgeActivity extends AppCompatActivity {

    //Valores de requestCode para o filtro das intents em @ActivityResult
    private static final int SET_SERVER_REQUEST_CODE = 1;
    private static final int SET_SENHA_REQUEST_CODE = 2;
    private static final int INICIA_VENDA_CREDITO_REQUEST_CODE = 3;
    private static final int INICIA_VENDA_DEBITO_REQUEST_CODE = 4;
    private static final int INICIA_CANCELAMENTO_VENDA_REQUEST_CODE = 5;
    private static final int INICIA_OPERACAO_ADMINISTRATIVA_REQUEST_CODE = 6;
    private static final int IMPRIMIR_CUPOM_NFCE_REQUEST_CODE = 7;
    private static final int IMPRIMIR_CUPOM_SAT_REQUEST_CODE = 8;
    private static final int IMPRIMIR_CUPOM_SAT_CANCELAMENTO_REQUEST_CODE = 9;
    private static final int CONSULTAR_STATUS_REQUEST_CODE = 10;
    private static final int GET_TIMEOUT_REQUEST_CODE = 11;
    private static final int CONSULTAR_ULTIMA_TRANSACAO_REQUEST_CODE = 12;
    private static final int SET_SENHA_SERVER_REQUEST_CODE = 13;
    private static final int SET_TIMEOUT_REQUEST_CODE = 14;
    //Opções escolhidas no início da atividade
    private static FormaPagamento formaPagamentoSelecionada;
    private static FormaFinanciamento formaFinanciamentoSelecionada;
    private final String XML_EXTENSION = ".xml";
    private final String XML_NFCE_ARCHIVE_NAME = "xmlnfce";
    private final String XML_SAT_ARCHIVE_NAME = "xmlsat";
    private final String XML_SAT_CANCELLATION_ARCHIVE_NAME = "xmlsatcancelamento";
    //Nome do equipamento PDV para operações Bridge
    private final String PDV_NAME = "PDV";
    //EditTexts
    protected EditText editTextIpBridge, editTextValueBridge, editTextNumberOfInstallmentsBridge, editTextTransactionPort, editTextStatusPort, editTextPassword;
    //LinearLayout que agem como botão
    LinearLayout buttonCreditOptionBridge, buttonDebitOptionBridge, buttonStoreOptionBridge, buttonAdmOptionBridge, buttonInCashOptionBridge;
    //Buttons
    Button buttonSendTransactionBridge, buttonCancelTransactionBridge, buttonAdministrativeOperation, buttonPrintTestCoupon, buttonConsultTerminalStatus, buttonConsultConfiguredTimeout, buttonConsultLastTransaction, buttonSetTerminalPassword, buttonSetTransactionTimeout;
    //Layout que devem ficar invisiveis para determinadas operações
    LinearLayout linearLayoutNumberOfInstallments, linearLayoutTypeInstallments;
    //Checkbox enviar senha
    CheckBox checkboxSendPassword;


    //Gera número aleatório entre 0 e 999999 para as transações bridge
    private static int generateRandomForBridgeTransactions() {
        Random random = new Random();
        return random.nextInt(1000000);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bridge);

        //Atribuição das Views
        viewsAtribuitions();

        //Valores iniciais
        initialValues();

        //Atribuição de funcionalidade ás views
        viewsFunctionalityAtribution();

        //Colorindo borda das formas de pagamento/parcelamento selecionadas
        updatePaymentMethodsBorderColors();
        updateInstallmentMethodBorderColors();
    }

    //Valores iniciais
    private void initialValues() {
        editTextIpBridge.setText("192.168.0.104");
        editTextValueBridge.setText("2000");

        formaPagamentoSelecionada = FormaPagamento.CREDITO;
        formaFinanciamentoSelecionada = FormaFinanciamento.FINANCIAMENTO_A_VISTA;

        //O padrão da aplicação é iniciar com a opção de pagamento por crédito com parcelamento a vista, portanto o número de parcelas deve ser obrigatoriamente 1
        editTextNumberOfInstallmentsBridge.setText("1");
        editTextNumberOfInstallmentsBridge.setEnabled(false);

        //Valores padrões para as portas de transação/status
        editTextTransactionPort.setText("3000");
        editTextStatusPort.setText("3001");

        //Senha vazia
        editTextPassword.setText("");
    }

    //Atribuição das Views
    private void viewsAtribuitions() {
        //Checkbox
        checkboxSendPassword = findViewById(R.id.checkboxSendPassword);

        //EditTexts
        editTextIpBridge = findViewById(R.id.editTextIpBridge);
        editTextValueBridge = findViewById(R.id.editTextValueBridge);
        editTextNumberOfInstallmentsBridge = findViewById(R.id.editTextNumberOfInstallmentsBridge);
        editTextTransactionPort = findViewById(R.id.editTextTransactionPort);
        editTextStatusPort = findViewById(R.id.editTextStatusPort);
        editTextPassword = findViewById(R.id.editTextPassword);

        //Aplicando Mask ao Valor
        editTextValueBridge.addTextChangedListener(new InputMaskMoney(editTextValueBridge));

        //Formas de pagamento
        buttonCreditOptionBridge = findViewById(R.id.buttonCreditOptionBridge);
        buttonDebitOptionBridge = findViewById(R.id.buttonDebitOptionBridge);

        //Tipos de Parcelamento
        buttonStoreOptionBridge = findViewById(R.id.buttonStoreOptionBridge);
        buttonAdmOptionBridge = findViewById(R.id.buttonAdmOptionBridge);
        buttonInCashOptionBridge = findViewById(R.id.buttonInCashOptionBridge);

        //Botões
        buttonSendTransactionBridge = findViewById(R.id.buttonSendTransactionBridge);
        buttonCancelTransactionBridge = findViewById(R.id.buttonCancelTransactionBridge);
        buttonAdministrativeOperation = findViewById(R.id.buttonAdministrativeOperation);
        buttonPrintTestCoupon = findViewById(R.id.buttonPrintTestCoupon);

        buttonConsultTerminalStatus = findViewById(R.id.buttonConsultTerminalStatus);
        buttonConsultConfiguredTimeout = findViewById(R.id.buttonConsultConfiguredTimeout);
        buttonConsultLastTransaction = findViewById(R.id.buttonConsultLastTransaction);
        buttonSetTerminalPassword = findViewById(R.id.buttonSetTerminalPassword);
        buttonSetTransactionTimeout = findViewById(R.id.buttonSetTransactionTimeout);

        //Layout atribuídos para se tornarem invisivesi/visiveis conforme o tipo de pagamento selecionado
        linearLayoutNumberOfInstallments = findViewById(R.id.linearLayoutNumberOfInstallments);
        linearLayoutTypeInstallments = findViewById(R.id.linearLayoutTypeInstallments);
    }

    //Atribuição de funcionalidade ás views
    private void viewsFunctionalityAtribution() {

        //No click do checkbox de envio de senha o campo de senha deve ser habilitado/desabilitado de acordo com o estado
        checkboxSendPassword.setOnClickListener(v -> {
            editTextPassword.setEnabled(checkboxSendPassword.isChecked());
        });

        //Na mudança das formas de pagamento além da redecoração das bordas deve ser habilitar/desabilitar as formas de financiamento

        buttonCreditOptionBridge.setOnClickListener(v -> {
            formaPagamentoSelecionada = FormaPagamento.CREDITO;
            updatePaymentMethodsBorderColors();
            fadeInInstallmentsOptionsLayout();
        });

        buttonDebitOptionBridge.setOnClickListener(v -> {
            formaPagamentoSelecionada = FormaPagamento.DEBITO;
            updatePaymentMethodsBorderColors();
            fadeOutInstallmentOptionsLayout();
        });

        //Na mudança das formas de parcelamento além da redecoração das bordas deve ser travado em 1 para a vista, ou destravado caso outra forma de parcelamento seja selecionada

        buttonStoreOptionBridge.setOnClickListener(v -> {
            formaFinanciamentoSelecionada = FormaFinanciamento.FINANCIAMENTO_PARCELADO_ESTABELECIMENTO;
            updateInstallmentMethodBorderColors();
            editTextNumberOfInstallmentsBridge.setEnabled(true);
        });

        buttonAdmOptionBridge.setOnClickListener(v -> {
            formaFinanciamentoSelecionada = FormaFinanciamento.FINANCIAMENTO_PARCELADO_EMISSOR;
            updateInstallmentMethodBorderColors();
            editTextNumberOfInstallmentsBridge.setEnabled(true);
        });

        buttonInCashOptionBridge.setOnClickListener(v -> {
            formaFinanciamentoSelecionada = FormaFinanciamento.FINANCIAMENTO_A_VISTA;
            updateInstallmentMethodBorderColors();
            editTextNumberOfInstallmentsBridge.setText("1");
            editTextNumberOfInstallmentsBridge.setEnabled(false);
        });

        buttonSendTransactionBridge.setOnClickListener(this::buttonSendTransactionFunction);

        buttonCancelTransactionBridge.setOnClickListener(this::buttonCancelTransactionFunction);

        buttonAdministrativeOperation.setOnClickListener(this::buttonAdministrativeOperationFunction);

        buttonPrintTestCoupon.setOnClickListener(this::buttonPrintTestCouponFunction);

        buttonConsultTerminalStatus.setOnClickListener(this::buttonConsultTerminalStatusFunction);

        buttonConsultConfiguredTimeout.setOnClickListener(this::buttonConsultConfiguredTimeoutFunction);

        buttonConsultLastTransaction.setOnClickListener(this::buttonConsultLastTransactionFunction);

        buttonSetTerminalPassword.setOnClickListener(this::buttonSetTerminalPasswordFunction);

        buttonSetTransactionTimeout.setOnClickListener(this::buttonSetTransactionTimeoutFunction);
    }

    //Atualiza a decoração da borda das opções de pagamento
    private void updatePaymentMethodsBorderColors() {
        buttonCreditOptionBridge.setBackgroundTintList(
                (formaPagamentoSelecionada == FormaPagamento.CREDITO) ?
                        AppCompatResources.getColorStateList(this, R.color.verde) :
                        AppCompatResources.getColorStateList(this, R.color.black));

        buttonDebitOptionBridge.setBackgroundTintList(
                (formaPagamentoSelecionada == FormaPagamento.DEBITO) ?
                        AppCompatResources.getColorStateList(this, R.color.verde) :
                        AppCompatResources.getColorStateList(this, R.color.black));
    }

    //Atualiza a decoração da borda das opções de parcelamento
    private void updateInstallmentMethodBorderColors() {
        buttonStoreOptionBridge.setBackgroundTintList(
                (formaFinanciamentoSelecionada == FormaFinanciamento.FINANCIAMENTO_PARCELADO_ESTABELECIMENTO) ?
                        AppCompatResources.getColorStateList(this, R.color.verde) :
                        AppCompatResources.getColorStateList(this, R.color.black));

        buttonAdmOptionBridge.setBackgroundTintList(
                (formaFinanciamentoSelecionada == FormaFinanciamento.FINANCIAMENTO_PARCELADO_EMISSOR) ?
                        AppCompatResources.getColorStateList(this, R.color.verde) :
                        AppCompatResources.getColorStateList(this, R.color.black));

        buttonInCashOptionBridge.setBackgroundTintList(
                (formaFinanciamentoSelecionada == FormaFinanciamento.FINANCIAMENTO_A_VISTA) ?
                        AppCompatResources.getColorStateList(this, R.color.verde) :
                        AppCompatResources.getColorStateList(this, R.color.black));
    }

    //Desalibita as opções de parcelamento, caso a opção de débito seja selecionada
    private void fadeOutInstallmentOptionsLayout() {
        linearLayoutNumberOfInstallments.setVisibility(View.INVISIBLE);
        linearLayoutTypeInstallments.setVisibility(View.INVISIBLE);
    }

    //Habilita as opções de parcelamento, caso a opção de crédito seja selecionada
    private void fadeInInstallmentsOptionsLayout() {
        linearLayoutNumberOfInstallments.setVisibility(View.VISIBLE);
        linearLayoutTypeInstallments.setVisibility(View.VISIBLE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == RESULT_OK) {
            final String retorno = data.getStringExtra("retorno");
            Log.d("retorno", retorno);
            /**
             * O retorno é sempre um arrayJSON, seguindo o fluxo para todas as operações descrito em startBridgeCommand() o retorno da operação estará após o retorno das funções SetServer e SetSenha, ou seja, na 3° posição do array
             */
            try {
                JSONArray jsonArray = new JSONArray(retorno);
                JSONObject jsonObjectReturn = jsonArray.getJSONObject(2);

                //Somente algumas operações teram retorno em tela
                switch (requestCode) {
                    case SET_SERVER_REQUEST_CODE:
                    case SET_SENHA_REQUEST_CODE:
                        break;
                    case INICIA_VENDA_CREDITO_REQUEST_CODE:
                        IniciaVendaCredito iniciaVendaCreditoReturn = new Gson().fromJson(jsonObjectReturn.toString(), IniciaVendaCredito.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", iniciaVendaCreditoReturn.getResultado());
                        break;
                    case INICIA_VENDA_DEBITO_REQUEST_CODE:
                        IniciaVendaDebito iniciaVendaDebitoReturn = new Gson().fromJson(jsonObjectReturn.toString(), IniciaVendaDebito.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", iniciaVendaDebitoReturn.getResultado());
                        break;
                    case INICIA_CANCELAMENTO_VENDA_REQUEST_CODE:
                        IniciaCancelamentoVenda iniciaCancelamentoVendaReturn = new Gson().fromJson(jsonObjectReturn.toString(), IniciaCancelamentoVenda.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", iniciaCancelamentoVendaReturn.getResultado());
                        break;
                    case INICIA_OPERACAO_ADMINISTRATIVA_REQUEST_CODE:
                        IniciaOperacaoAdministrativa iniciaOperacaoAdministrativaReturn = new Gson().fromJson(jsonObjectReturn.toString(), IniciaOperacaoAdministrativa.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", iniciaOperacaoAdministrativaReturn.getResultado());
                        break;
                    case IMPRIMIR_CUPOM_NFCE_REQUEST_CODE:
                        ImprimirCupomNfce imprimirCupomNfceReturn = new Gson().fromJson(jsonObjectReturn.toString(), ImprimirCupomNfce.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", imprimirCupomNfceReturn.getResultado());
                        break;
                    case IMPRIMIR_CUPOM_SAT_REQUEST_CODE:
                        ImprimirCupomSat imprimirCupomSatReturn = new Gson().fromJson(jsonObjectReturn.toString(), ImprimirCupomSat.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", imprimirCupomSatReturn.getResultado());
                        break;
                    case IMPRIMIR_CUPOM_SAT_CANCELAMENTO_REQUEST_CODE:
                        ImprimirCupomSatCancelamento imprimirCupomSatCancelamento = new Gson().fromJson(jsonObjectReturn.toString(), ImprimirCupomSatCancelamento.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", imprimirCupomSatCancelamento.getResultado());
                        break;
                    case CONSULTAR_STATUS_REQUEST_CODE:
                        ConsultarStatus consultarStatusReturn = new Gson().fromJson(jsonObjectReturn.toString(), ConsultarStatus.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", consultarStatusReturn.getResultado());
                        break;
                    case GET_TIMEOUT_REQUEST_CODE:
                        GetTimeout getTimeoutReturn = new Gson().fromJson(jsonObjectReturn.toString(), GetTimeout.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", getTimeoutReturn.getResultado());
                        break;
                    case CONSULTAR_ULTIMA_TRANSACAO_REQUEST_CODE:
                        ConsultarUltimaTransacao consultarUltimaTransacaoReturn = new Gson().fromJson(jsonObjectReturn.toString(), ConsultarUltimaTransacao.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", consultarUltimaTransacaoReturn.getResultado());
                        break;
                    case SET_SENHA_SERVER_REQUEST_CODE:
                        SetSenhaServer setSenhaServerReturn = new Gson().fromJson(jsonObjectReturn.toString(), SetSenhaServer.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", setSenhaServerReturn.getResultado());
                        break;
                    case SET_TIMEOUT_REQUEST_CODE:
                        SetTimeout setTimeoutReturn = new Gson().fromJson(jsonObjectReturn.toString(), SetTimeout.class);
                        ActivityUtils.showAlertMessage(this, "Retorno E1 - BRIDGE", setTimeoutReturn.getResultado());
                        break;
                    default:
                        ActivityUtils.showAlertMessage(this, "Alerta", "A intent iniciada não foi encontrada!");
                        break;
                }
            } catch (JSONException e) {
                e.printStackTrace();
                ActivityUtils.showAlertMessage(this, "Alerta", "O comando " + requestCode + " não foi encontrado!");
            }
        } else {
            ActivityUtils.showAlertMessage(this, "Alerta", "O comando não foi bem sucedido!");
        }
    }

    //Retorna o valor inserido no formato necessário para o pagemento elgin pay, o valor deve ser inserido em centavos, a vírgula é removida
    private String getEditTextValueBridgeFormatted() {
        return editTextValueBridge.getText().toString().replace(",", "").trim();
    }

    //Validações

    //Valida de os campos de conexão (ip, portaTransacao e portaStatus) do bridge inseridos estão nos conformes aceitos, se estiverem, atualize server bridge
    private boolean updateBridgeServer() {
        if (isIpValid() && isTransactionPortValid() && isStatusPortValid()) {
            return true;
        }
        return false;
    }

    //Valida o formato de IP
    private boolean isIpValid() {
        String IP = editTextIpBridge.getText().toString();

        Pattern pattern = Pattern.compile("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
        Matcher matcher = pattern.matcher(IP);

        boolean isIpValid = matcher.matches();

        if (isIpValid)
            return true;

        ActivityUtils.showAlertMessage(this, "Alerta", "Insira um Ip válido para a conexão Bridge!");
        return false;
    }

    //Valida a porta de transacao
    private boolean isTransactionPortValid() {
        try {
            int transactionPortInInt = Integer.parseInt(editTextTransactionPort.getText().toString());

            if (transactionPortInInt > 65535) {
                ActivityUtils.showAlertMessage(this, "Alerta", "O valor inserido na porta de transação excede o limite esbelecido de 65535!");
                return false;
            } else
                return true;
        } catch (NumberFormatException numberFormatException) {
            ActivityUtils.showAlertMessage(this, "Alerta", "O valor inserido na porta de transação não pode estar vazio");
            return false;
        }
    }

    //Valida a porta de status
    private boolean isStatusPortValid() {
        try {
            int statusPortInInt = Integer.parseInt(editTextStatusPort.getText().toString());

            if (statusPortInInt > 65535) {
                ActivityUtils.showAlertMessage(this, "Alerta", "O valor inserido na porta de status excede o limite esbelecido de 65535!");
                return false;
            } else
                return true;
        } catch (NumberFormatException numberFormatException) {
            ActivityUtils.showAlertMessage(this, "Alerta", "O valor inserido na porta de status não pode estar vazio!");
            return false;
        }
    }

    private boolean validateInstallmentsField() {
        final String numberOfInstallments = editTextNumberOfInstallmentsBridge.getText().toString();

        if (numberOfInstallments.equals("")) {
            ActivityUtils.showAlertMessage(this, "Alerta", "O campo de parcelas não pode estar vazio!");
            return false;
        } else if ((Integer.parseInt(editTextNumberOfInstallmentsBridge.getText().toString()) < 2) && formaFinanciamentoSelecionada != FormaFinanciamento.FINANCIAMENTO_A_VISTA) {
            ActivityUtils.showAlertMessage(this, "Alerta", "O número de parcelas não é valido para esta forma de financiamento");
            return false;
        }

        return true;
    }

    // O valor mínimo para a transação do elgin pay é de R$ 1,00
    private boolean isValueValidToElginPay() {
        try {
            final String valueInString = editTextValueBridge.getText().toString().replace(",", ".").trim();

            final BigDecimal bigDecimalForComparation = new BigDecimal(valueInString);

            if (bigDecimalForComparation.compareTo(new BigDecimal("1.00")) < 0) {
                ActivityUtils.showAlertMessage(this, "Alerta", "O valor deve ser maior que 1 real para uma pagamento via elgin pay!");
                return false;
            }
            return true;
        } catch (NumberFormatException numberFormatException) {
            numberFormatException.printStackTrace();
            ActivityUtils.showAlertMessage(this, "Alerta", "O campo de valor não pode estar vazio!");
            return false;
        }
    }

    /**
     * Função utilizada para iniciar quaisquer operações Bridge com o fluxo : recebe um comando e o concatena com as funções SetServer e SetSenha, evitando a repetição em todas as funcionalidades e assegurando que as ultimas alterações nos campos de entrada sejam efetivadas antes da excução da operação
     *
     * @param bridgeCommand o operação a ser iniciada
     * @param requestCode   código da intent para filtro de retorno em onActivityResult()
     */
    private void startBridgeCommand(BridgeCommand bridgeCommand, int requestCode) {
        List<IntentDigitalHubCommand> listOfCommands = new ArrayList<>();

        //Adiciona o comando de configuração do servidor SetServer
        listOfCommands.add(new SetServer(this.editTextIpBridge.getText().toString(), Integer.parseInt(this.editTextTransactionPort.getText().toString()), Integer.parseInt(this.editTextStatusPort.getText().toString())));

        //Adiciciona o comando de configuração da senha SetSenha
        listOfCommands.add(new SetSenha(editTextPassword.getText().toString(), checkboxSendPassword.isChecked()));

        //Adiciona o comando atual
        listOfCommands.add(bridgeCommand);

        //Inicial a atividade através da classe utilitaŕia
        IntentDigitalHubCommandStarter.startHubCommandActivity(this, listOfCommands, requestCode);
    }

    //Funcionalidade dos botões

    private void buttonSendTransactionFunction(View v) {
        //Valida os campos de servidor
        if (updateBridgeServer()) {
            //Valida o valor inserido
            if (isValueValidToElginPay()) {

                if (formaPagamentoSelecionada == FormaPagamento.CREDITO) {
                    //Valida número de parcelas inserido
                    if (validateInstallmentsField()) {
                        //Numero de parcelas em inteiro
                        final int numberOfInstallments = Integer.parseInt(editTextNumberOfInstallmentsBridge.getText().toString());

                        IniciaVendaCredito iniciaVendaCreditoCommand = new IniciaVendaCredito(generateRandomForBridgeTransactions(),
                                PDV_NAME,
                                getEditTextValueBridgeFormatted(),
                                formaFinanciamentoSelecionada.getCodigoFormaParcelamento(),
                                numberOfInstallments);

                        startBridgeCommand(iniciaVendaCreditoCommand, INICIA_VENDA_CREDITO_REQUEST_CODE);
                    }
                } else {
                    IniciaVendaDebito iniciaVendaDebitoCommand = new IniciaVendaDebito(generateRandomForBridgeTransactions(),
                            PDV_NAME,
                            getEditTextValueBridgeFormatted());

                    startBridgeCommand(iniciaVendaDebitoCommand, INICIA_VENDA_DEBITO_REQUEST_CODE);
                }
            }
        }
    }

    private void buttonCancelTransactionFunction(View v) {
        //Data do dia atual, usada como um dos parâmetros necessário para o cancelamento de transação no Elgin Pay
        Date date = new Date();

        //Objeto capaz de formatar a date para o formato aceito pelo Elgin Pay ("dd/mm/aa")
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yy");

        //Aplicando formatação
        String todayDate = dateFormat.format(date);

        final AlertDialog.Builder builder = new AlertDialog.Builder(this);

        //Definindo título do AlertDialog
        builder.setTitle("Código de Referência:");

        // Criando um EditText para pegar o input do usuário na caixa de diálogo
        final EditText input = new EditText(this);

        //Configurando o EditText para negrito e configurando o tipo de inserção para apenas número
        input.setTypeface(null, Typeface.BOLD);
        input.setInputType(InputType.TYPE_CLASS_NUMBER);

        //Tornando o dialógo não-cancelável
        builder.setCancelable(false);

        builder.setView(input);

        builder.setNegativeButton("CANCELAR", (dialog, which) -> dialog.dismiss());

        builder.setPositiveButton("OK",
                (dialog, whichButton) -> {
                    String saleRef = input.getText().toString();
                    //Setando o foco de para o input do dialógo
                    input.requestFocus();
                    InputMethodManager imm = (InputMethodManager) this.getSystemService(Context.INPUT_METHOD_SERVICE);
                    imm.showSoftInput(input, InputMethodManager.SHOW_IMPLICIT);

                    if (saleRef.equals("")) {
                        ActivityUtils.showAlertMessage(this, "Alerta", "O campo código de referência da transação não pode ser vazio! Digite algum valor.");
                    } else {
                        if (updateBridgeServer()) {
                            IniciaCancelamentoVenda iniciaCancelamentoVendaCommand = new IniciaCancelamentoVenda(generateRandomForBridgeTransactions(),
                                    PDV_NAME,
                                    getEditTextValueBridgeFormatted(),
                                    todayDate,
                                    saleRef);

                            startBridgeCommand(iniciaCancelamentoVendaCommand, INICIA_CANCELAMENTO_VENDA_REQUEST_CODE);
                        }
                    }
                });

        builder.show();
    }

    private void buttonAdministrativeOperationFunction(View v) {
        final String[] operations = {"Operação Administrativa", "Operação de Instalação", "Operação de Configuração", "Operação de Manutenção", "Teste de Comunicação", "Reimpressão de Comprovante"};

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("ESCOLHA A OPERAÇÃO ADMINISTRATIVA");

        //Tornando o dialógo não-cancelável
        builder.setCancelable(false);

        builder.setNegativeButton("CANCELAR", (dialog, which) -> dialog.dismiss());

        builder.setItems(operations, (dialog, which) -> {
            //IniciaOperaçãoAdministrativa de acordo com qual operação foi selecionada.
            if (updateBridgeServer()) {
                //Neste caso o int which que é um parametro fornecido assim que uma opção é selecionada corresponde diretamente aos valores da documentação da função de operação administrativa
                IniciaOperacaoAdministrativa iniciaOperacaoAdministrativaCommand = new IniciaOperacaoAdministrativa(generateRandomForBridgeTransactions(),
                        PDV_NAME,
                        which);

                startBridgeCommand(iniciaOperacaoAdministrativaCommand, INICIA_OPERACAO_ADMINISTRATIVA_REQUEST_CODE);
            }
        });
        builder.show();
    }

    private void buttonPrintTestCouponFunction(View v) {
        String[] couponTypes = {"Imprimir Cupom NFCe", "Imprimir Cupom Sat", "Imprimir Cupom Sat Cancelamento"};

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("ESCOLHA O TIPO DE CUPOM");

        builder.setNegativeButton("CANCELAR", (dialog, which) -> dialog.dismiss());

        builder.setItems(couponTypes, (dialog, selected) -> {
            //IniciaOperaçãoAdministrativa de acordo com qual operação foi selecionada.
            if (updateBridgeServer()) {

                //Variaveis para comparacao do tipo selecionado
                final int NFCE_COUPON = 0;
                final int SAT_COUPON = 1;
                final int SAT_CANCELLATION_COUPON = 2;

                switch (selected) {
                    case NFCE_COUPON: {
                        //O impressão dos XMLs será feita por PATH, por isso é necessário salvar o XMl do projeto dentro do diretório da aplicação, para depois referenciar seu caminho
                        ActivityUtils.loadXMLFileAndStoreItOnApplicationRootDir(this, XML_NFCE_ARCHIVE_NAME);

                        final String xml = ActivityUtils.getFilePathForIDH(this, XML_NFCE_ARCHIVE_NAME + XML_EXTENSION);
                        final int indexcsc = 1;
                        final String csc = "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES";

                        ImprimirCupomNfce imprimirCupomNfceCommand = new ImprimirCupomNfce(xml, indexcsc, csc);

                        startBridgeCommand(imprimirCupomNfceCommand, IMPRIMIR_CUPOM_NFCE_REQUEST_CODE);
                        break;
                    }
                    case SAT_COUPON: {
                        //O impressão dos XMLs será feita por PATH, por isso é necessário salvar o XMl do projeto dentro do diretório da aplicação, para depois referenciar seu caminho
                        ActivityUtils.loadXMLFileAndStoreItOnApplicationRootDir(this, XML_SAT_ARCHIVE_NAME);

                        final String xml = ActivityUtils.getFilePathForIDH(this, XML_SAT_ARCHIVE_NAME + XML_EXTENSION);

                        ImprimirCupomSat imprimirCupomSatCommand = new ImprimirCupomSat(xml);

                        startBridgeCommand(imprimirCupomSatCommand, IMPRIMIR_CUPOM_SAT_REQUEST_CODE);
                        break;
                    }
                    case SAT_CANCELLATION_COUPON: {
                        //O impressão dos XMLs será feita por PATH, por isso é necessário salvar o XMl do projeto dentro do diretório da aplicação, para depois referenciar seu caminho
                        ActivityUtils.loadXMLFileAndStoreItOnApplicationRootDir(this, XML_SAT_CANCELLATION_ARCHIVE_NAME);

                        final String xml = ActivityUtils.getFilePathForIDH(this, XML_SAT_CANCELLATION_ARCHIVE_NAME + XML_EXTENSION);
                        final String assQRCode = "Q5DLkpdRijIRGY6YSSNsTWK1TztHL1vD0V1Jc4spo/CEUqICEb9SFy82ym8EhBRZjbh3btsZhF+sjHqEMR159i4agru9x6KsepK/q0E2e5xlU5cv3m1woYfgHyOkWDNcSdMsS6bBh2Bpq6s89yJ9Q6qh/J8YHi306ce9Tqb/drKvN2XdE5noRSS32TAWuaQEVd7u+TrvXlOQsE3fHR1D5f1saUwQLPSdIv01NF6Ny7jZwjCwv1uNDgGZONJdlTJ6p0ccqnZvuE70aHOI09elpjEO6Cd+orI7XHHrFCwhFhAcbalc+ZfO5b/+vkyAHS6CYVFCDtYR9Hi5qgdk31v23w==";

                        ImprimirCupomSatCancelamento imprimirCupomSatCancelamentoCommand = new ImprimirCupomSatCancelamento(xml, assQRCode);

                        startBridgeCommand(imprimirCupomSatCancelamentoCommand, IMPRIMIR_CUPOM_SAT_CANCELAMENTO_REQUEST_CODE);
                        break;
                    }
                }
            }
        });
        builder.show();
    }

    private void buttonConsultTerminalStatusFunction(View v) {
        if (updateBridgeServer()) {
            ConsultarStatus consultarStatusCommand = new ConsultarStatus();

            startBridgeCommand(consultarStatusCommand, CONSULTAR_STATUS_REQUEST_CODE);
        }
    }

    private void buttonConsultConfiguredTimeoutFunction(View v) {
        if (updateBridgeServer()) {
            GetTimeout getTimeoutCommand = new GetTimeout();

            startBridgeCommand(getTimeoutCommand, GET_TIMEOUT_REQUEST_CODE);
        }
    }

    private void buttonConsultLastTransactionFunction(View v) {
        if (updateBridgeServer()) {
            ConsultarUltimaTransacao consultarUltimaTransacaoCommand = new ConsultarUltimaTransacao(PDV_NAME);

            startBridgeCommand(consultarUltimaTransacaoCommand, CONSULTAR_ULTIMA_TRANSACAO_REQUEST_CODE);
        }
    }

    private void buttonSetTerminalPasswordFunction(View v) {
        String[] enableOrDisable = {"Habilitar Senha no Terminal", "Desabilitar Senha no Terminal"};

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("ESCOLHA COMO CONFIGURAR A SENHA");
        //Diálogo cancelável somente por botão
        builder.setCancelable(false);

        builder.setNegativeButton("CANCELAR", (dialog, which) -> dialog.dismiss());

        builder.setItems(enableOrDisable, (dialog, which) -> {

            //De acordo com a opção escolhida no alert exterior, será definida se operacao irã habilitar ou desabilitar a senha
            final boolean enable = (which == 0);

            /**
             * Alert com input requerindo a senha a ser definida para o terminal ; caso a opcao escolhida tenha sido "Habilitar Senha no Terminal"
             */

            //Builder interno para alertDialog que sera chamado caso ao opcao de habilitar senha tenha
            final AlertDialog.Builder enableOptionSelectedBuilder = new AlertDialog.Builder(this);

            //Define o titulo de acordo com a opcao escolhida
            enableOptionSelectedBuilder.setTitle("DIGITE A SENHA A SER HABILITADA:");

            // Criando um EditText para pegar o input do usuário na caixa de diálogo
            final EditText innerInput = new EditText(this);

            //Configurando o EditText para negrito e configurando o tipo de inserção para tipo text_password
            innerInput.setTypeface(null, Typeface.BOLD);
            innerInput.setInputType(InputType.TYPE_TEXT_VARIATION_PASSWORD);

            enableOptionSelectedBuilder.setCancelable(false);

            enableOptionSelectedBuilder.setView(innerInput);

            enableOptionSelectedBuilder.setNegativeButton("CANCELAR", (dialog1, which1) -> dialog1.dismiss());

            enableOptionSelectedBuilder.setPositiveButton("OK",
                    (dialog12, whichButton) -> {
                        String passwordEntered = innerInput.getText().toString();

                        //Setando o foco de para o input do dialógo
                        innerInput.requestFocus();
                        InputMethodManager imm = (InputMethodManager) this.getSystemService(Context.INPUT_METHOD_SERVICE);
                        imm.showSoftInput(innerInput, InputMethodManager.SHOW_IMPLICIT);

                        if (passwordEntered.equals("")) {
                            ActivityUtils.showAlertMessage(this, "Alerta", "O campo de senha a ser habilitada não pode ser vazio!");
                        } else {
                            final boolean HABILITAR_SENHA_TERMINAL = true;

                            if (updateBridgeServer()) {
                                //Se, Senão ; Opcao de habilitar senha
                                SetSenhaServer setSenhaServerCommand = new SetSenhaServer(passwordEntered,
                                        HABILITAR_SENHA_TERMINAL);

                                startBridgeCommand(setSenhaServerCommand, SET_SENHA_SERVER_REQUEST_CODE);
                            }
                        }
                    });

            /**
             * Se a opcao escolhida for "Habilitar Senha do Terminal", mostre o alert acima, caso contrario tente desabilitar a senha do terminal enviando uma String vazia, pois a funcao SetSenhaServer() com parametro booleano falso apenas
             * desabilitara a requisicao de senha e nao sobrescrevera a senha ja salva no terminal
             */

            if (enable)
                enableOptionSelectedBuilder.show();
            else {
                if (!checkboxSendPassword.isChecked())
                    ActivityUtils.showAlertMessage(this, "Alerta", "Habilite a opção de envio de senha e envie a senha mais atual para desabilitar a senha do terminal!");
                else {
                    if (updateBridgeServer()) {

                        final boolean DESABILITAR_SENHA_TERMINAL = false;

                        //Deve ser passado um string vazia para deletar a senha no terminal, pois é mais intuitivo desabilitar a senha atual e deleta-la do que desabilitar e atualizar com uma nova
                        SetSenhaServer setSenhaServerCommand = new SetSenhaServer("",
                                DESABILITAR_SENHA_TERMINAL);

                        startBridgeCommand(setSenhaServerCommand, SET_SENHA_REQUEST_CODE);
                    }
                }
            }
        });
        builder.show();
    }

    private void buttonSetTransactionTimeoutFunction(View v) {
        final AlertDialog.Builder builder = new AlertDialog.Builder(this);

        //Definindo título do AlertDialog
        builder.setTitle("DEFINA UM NOVO TIMEOUT PARA TRANSAÇÃO (em segundos):");

        // Criando um EditText para pegar o input do usuário na caixa de diálogo
        final EditText input = new EditText(this);

        //Configurando o EditText para negrito e configurando o tipo de inserção para apenas número
        input.setTypeface(null, Typeface.BOLD);
        input.setInputType(InputType.TYPE_CLASS_NUMBER);

        //Tornando o dialógo não-cancelável
        builder.setCancelable(false);

        builder.setView(input);

        builder.setNegativeButton("CANCELAR", (dialog, which) -> dialog.dismiss());


        builder.setPositiveButton("OK",
                (dialog, whichButton) -> {
                    String newTimeoutInSeconds = input.getText().toString().trim();

                    //Setando o foco de para o input do dialógo
                    input.requestFocus();
                    InputMethodManager imm = (InputMethodManager) this.getSystemService(Context.INPUT_METHOD_SERVICE);
                    imm.showSoftInput(input, InputMethodManager.SHOW_IMPLICIT);

                    if (newTimeoutInSeconds.equals(""))
                        ActivityUtils.showAlertMessage(this, "Alerta", "O campo que representa a quantidade timeout a ser configurado não pode ser vazio! Digite algum valor.");
                    else {
                        if (updateBridgeServer()) {
                            //O valor do editText deve ser convetido para inteiro
                            SetTimeout setTimeoutCommand = new SetTimeout(Integer.parseInt(newTimeoutInSeconds));

                            startBridgeCommand(setTimeoutCommand, SET_TIMEOUT_REQUEST_CODE);
                        }
                    }
                });
        builder.show();
    }
}