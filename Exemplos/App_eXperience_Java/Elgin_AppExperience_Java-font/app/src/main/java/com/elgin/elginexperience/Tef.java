package com.elgin.elginexperience;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.content.res.AppCompatResources;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.elgin.elginexperience.InputMasks.InputMaskMoney;
import com.elgin.elginexperience.Services.PrinterService;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import br.com.setis.interfaceautomacao.Operacoes;

public class Tef extends AppCompatActivity {
    Paygo paygo;
    static PrinterService printer;

    //Intent para o TEF M-SITEF.
    final Intent intentToMsitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");
    final int REQUEST_CODE_MSITEF = 4321;

    //Intent para o TEF ELGIN.
    final Intent intentToElginTef = new Intent("com.elgin.e1.digitalhub.TEF");
    final int REQUEST_CODE_ELGINTEF = 1234;

    //Ultima referência de venda, necessária para o cancelamento de venda no TEF ELGIN.
    String lastElginTefNSU = "";

    static Context context;

    //BUTTONS TYPE TEF
    Button buttonPaygoOption;
    Button buttonMsitefOption;
    Button buttonElginTefOption;

    //EDIT TEXTs
    EditText editTextValueTEF;
    EditText editTextInstallmentsTEF;
    EditText editTextIpTEF;
    //BUTTONS TYPE OF PAYMENTS
    Button buttonCreditOption;
    Button buttonDebitOption;
    Button buttonVoucherOption;

    //BUTTONS TYPE OF INSTALLMENTS
    Button buttonStoreOption;
    Button buttonAdmOption;
    Button buttonCashOption;

    //BUTTONS ACTIONS TEF
    Button buttonSendTransaction;
    Button buttonCancelTransaction;
    Button buttonConfigsTransaction;

    //IMAGE VIEW VIA PAYGO
    static ImageView imageViewViaPaygo;

    //TextView Via TEFs
    static TextView textViewViaTef;
    String viaClienteMsitef;

    //Captura o layout referente aos botoões de financiamento, para aplicar a lógica de sumir estas opções caso o pagamento por débito seja selecionado.
    private LinearLayout linearLayoutInstallmentsMethodsTEF;

    //Captura o layout referente ao campo de "número de parcelas", para aplicar a loǵica de sumir este campo caso o pagamento por débito seja selecionado.
    private LinearLayout linearLayoutNumberOfInstallmentsTEF;

    //TEFs de pagamento disponíveis.
    public enum TEF {
        PAY_GO, M_SITEF, ELGIN_TEF;
    }

    //Formas de pagamento disponíveis.
    public enum FormaPagamento {
        CREDITO, DEBITO, TODOS
    }

    //Formas de financiamento disponíveis.
    public enum FormaFinanciamento {
        LOJA, ADM, A_VISTA
    }

    //Ações disponíveis, correspondente aos botões na tela.
    public enum Acao {
        VENDA, CANCELAMENTO, CONFIGURACAO;
    }

    //Opções selecionadas ao abrir da tela.
    private TEF opcaoTefSelecionada;
    private FormaPagamento formaPagamentoSelecionada;
    private FormaFinanciamento formaFinanciamentoSelecionada;

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tef);
        context = this;
        paygo = new Paygo(this);
        printer = new PrinterService(this);
        printer.printerInternalImpStart();

        //INIT BUTTONS TYPE TEF
        buttonPaygoOption = findViewById(R.id.buttonPaygoOption);
        buttonMsitefOption = findViewById(R.id.buttonMsitefOption);
        buttonElginTefOption = findViewById(R.id.buttonElginTefOption);

        //INIT EDIT TEXTs
        editTextValueTEF = findViewById(R.id.editTextInputValueTEF);
        editTextInstallmentsTEF = findViewById(R.id.editTextInputInstallmentsTEF);
        editTextIpTEF = findViewById(R.id.editTextInputIPTEF);

        //INIT BUTTONS TYPES PAYMENTS
        buttonCreditOption = findViewById(R.id.buttonCreditOption);
        buttonDebitOption = findViewById(R.id.buttonDebitOption);
        buttonVoucherOption = findViewById(R.id.buttonVoucherOption);

        //INIT BUTTONS TYPE INSTALLMENTS
        buttonStoreOption = findViewById(R.id.buttonStoreOption);
        buttonAdmOption = findViewById(R.id.buttonAdmOption);
        buttonCashOption = findViewById(R.id.buttonCashOption);

        //INIT BUTTONS ACTIONS TEF
        buttonSendTransaction = findViewById(R.id.buttonSendTransactionTEF);
        buttonCancelTransaction = findViewById(R.id.buttonCancelTransactionTEF);
        buttonConfigsTransaction = findViewById(R.id.buttonConfigsTEF);

        imageViewViaPaygo = findViewById(R.id.imageViewViaPaygo);

        textViewViaTef = findViewById(R.id.textViewViaTef);

        linearLayoutNumberOfInstallmentsTEF = findViewById(R.id.linearLayoutNumberOfInstallmentsTEF);
        linearLayoutInstallmentsMethodsTEF = findViewById(R.id.linearLayoutInstallmentsMethodsTEF);

        //INIT DEFAULT INPUTS
        //Aplica a máscara de moeda ao campo de valor, para melhor formatação do valor entrado.
        editTextValueTEF.addTextChangedListener(new InputMaskMoney(editTextValueTEF));
        //Valor inicial de 20 reais.
        editTextValueTEF.setText("2000");

        editTextIpTEF.setText("192.168.0.31");

        //Aplica regras iniciais da tela.
        initialBusinessRule();

        //SELECT OPTION PAYGO
        buttonPaygoOption.setOnClickListener(v -> updateTEFMethodBusinessRule(TEF.PAY_GO));

        //SELECT OPTION M-SITEF
        buttonMsitefOption.setOnClickListener(v -> updateTEFMethodBusinessRule(TEF.M_SITEF));

        buttonElginTefOption.setOnClickListener(v -> updateTEFMethodBusinessRule(TEF.ELGIN_TEF));

        //SELECT OPTION CREDIT PAYMENT
        buttonCreditOption.setOnClickListener(v -> updatePaymentMethodBusinessRule(FormaPagamento.CREDITO));

        //SELECT OPTION DEBIT PAYMENT
        buttonDebitOption.setOnClickListener(v -> updatePaymentMethodBusinessRule(FormaPagamento.DEBITO));

        //SELECT OPTION VOUCHER PAYMENT
        buttonVoucherOption.setOnClickListener(v -> updatePaymentMethodBusinessRule(FormaPagamento.TODOS));

        //SELECT OPTION STORE INSTALLMENT
        buttonStoreOption.setOnClickListener(v -> updateInstallmentMethodBusinessRule(FormaFinanciamento.LOJA));

        //SELECT OPTION ADM INSTALLMENT
        buttonAdmOption.setOnClickListener(v -> updateInstallmentMethodBusinessRule(FormaFinanciamento.ADM));

        //SELECT OPTION AVISTA INSTALLMENT
        buttonCashOption.setOnClickListener(v -> updateInstallmentMethodBusinessRule(FormaFinanciamento.A_VISTA));

        //SELECT BUTTON SEND TRANSACTION
        buttonSendTransaction.setOnClickListener(v -> {
            if (isEntriesValid()) {
                startActionTEF(Acao.VENDA);
            }
        });

        //SELECT BUTTON CANCEL TRANSACTION
        buttonCancelTransaction.setOnClickListener(v -> {
            if (isEntriesValid()) {
                startActionTEF(Acao.CANCELAMENTO);
            }
        });

        //SELECT BUTTON CONFIGS TRANSACTION
        buttonConfigsTransaction.setOnClickListener(v -> {
            if (isEntriesValid()) {
                startActionTEF(Acao.CONFIGURACAO);
            }
        });
    }

    //Aplica as escolhas iniciais ao abrir da tela.
    private void initialBusinessRule() {
        //TEF escolhido é o PayGo.
        updateTEFMethodBusinessRule(TEF.PAY_GO);
    }

    //Atualiza as regras e decoração de tela, de acordo com o TEF selecionado
    private void updateTEFMethodBusinessRule(TEF opcaoTefSelecionada) {
        //Atualiza a váriavel de controle.
        this.opcaoTefSelecionada = opcaoTefSelecionada;

        //1.Apenas o TEF M-Sitef possuí configuração de IP.
        editTextIpTEF.setEnabled(opcaoTefSelecionada == TEF.M_SITEF);
        editTextIpTEF.setFocusableInTouchMode(opcaoTefSelecionada == TEF.M_SITEF);

        //2.M-Sitef não possuí pagamento a vista via crédito.
        buttonCashOption.setVisibility(opcaoTefSelecionada == TEF.M_SITEF ? View.INVISIBLE : View.VISIBLE);

        //3.A opção "todos" não está disponível para o TEF ELGIN.
        buttonVoucherOption.setVisibility(opcaoTefSelecionada == TEF.ELGIN_TEF ? View.INVISIBLE : View.VISIBLE);

        //4.Os TEFS M-Sitef e TEF ELGIN possuem retorno textual(TextView), enquanto o PayGo retorna uma Imagem(ImageView).
        textViewViaTef.setVisibility((opcaoTefSelecionada == TEF.M_SITEF || opcaoTefSelecionada == TEF.ELGIN_TEF) ? View.VISIBLE : View.GONE);
        imageViewViaPaygo.setVisibility(opcaoTefSelecionada == TEF.PAY_GO ? View.VISIBLE : View.GONE);

        //5.O TEF ELGIN ainda não possuí a opçaõ "configuração".
        buttonConfigsTransaction.setVisibility(opcaoTefSelecionada == TEF.ELGIN_TEF ? View.INVISIBLE : View.VISIBLE);

        //6.Atualiza a decoração da opção TEF selecionada.
        buttonPaygoOption.setBackgroundTintList(AppCompatResources.getColorStateList(this, opcaoTefSelecionada == TEF.PAY_GO ? R.color.verde : R.color.black));
        buttonMsitefOption.setBackgroundTintList(AppCompatResources.getColorStateList(this, opcaoTefSelecionada == TEF.M_SITEF ? R.color.verde : R.color.black));
        buttonElginTefOption.setBackgroundTintList(AppCompatResources.getColorStateList(this, opcaoTefSelecionada == TEF.ELGIN_TEF ? R.color.verde : R.color.black));

        //7.Sempre que um novo TEF for selecionado, a configuração de pagamento será atualizada para pagamento via crédito e parcelamento via loja.
        updatePaymentMethodBusinessRule(FormaPagamento.CREDITO);
        updateInstallmentMethodBusinessRule(FormaFinanciamento.LOJA);
    }

    //Atualiza as regras e decoração de tela, de acordo com a forma de pagamento selecionada.
    private void updatePaymentMethodBusinessRule(FormaPagamento formaPagamentoSelecionada) {
        //Atualiza a váriavel de controle.
        this.formaPagamentoSelecionada = formaPagamentoSelecionada;

        //1. Caso a opção de débito seja seleciona, o campo "número de parcelas" devem sumir, caso a opção selecionada seja a de crédito, o campo deve reaparecer.
        linearLayoutNumberOfInstallmentsTEF.setVisibility(formaPagamentoSelecionada == FormaPagamento.DEBITO ? View.INVISIBLE : View.VISIBLE);

        //2. Caso a opção de débito seja selecionada, os botões "tipos de parcelamento" devem sumir, caso a opção de crédito seja selecionada, devem reaparecer.
        linearLayoutInstallmentsMethodsTEF.setVisibility(formaPagamentoSelecionada == FormaPagamento.DEBITO ? View.INVISIBLE : View.VISIBLE);

        //3. Muda a coloração da borda dos botões de formas de pagamento, conforme o método seleciondo.
        buttonCreditOption.setBackgroundTintList(AppCompatResources.getColorStateList(this, formaPagamentoSelecionada == FormaPagamento.CREDITO ? R.color.verde : R.color.black));
        buttonDebitOption.setBackgroundTintList(AppCompatResources.getColorStateList(this, formaPagamentoSelecionada == FormaPagamento.DEBITO ? R.color.verde : R.color.black));
        buttonVoucherOption.setBackgroundTintList(AppCompatResources.getColorStateList(this, formaPagamentoSelecionada == FormaPagamento.TODOS ? R.color.verde : R.color.black));
    }

    //Atualiza as regras e decoração de tela, de acordo com a forma de parcelamento selecionada.
    private void updateInstallmentMethodBusinessRule(FormaFinanciamento formaFinanciamentoSelecionada) {
        //Atualiza a variável de controle.
        this.formaFinanciamentoSelecionada = formaFinanciamentoSelecionada;

        //1. Caso a forma de parcelamento selecionada seja a vista, o campo "número de parcelas" deve ser "travado" em "1", caso contrário o campo deve ser destravado e inserido "2", pois é o minimo de parcelas para as outras modalidades.
        editTextInstallmentsTEF.setEnabled(formaFinanciamentoSelecionada != FormaFinanciamento.A_VISTA);
        editTextInstallmentsTEF.setText(formaFinanciamentoSelecionada == FormaFinanciamento.A_VISTA ? "1" : "2");

        //2. Muda a coloração da borda dos botões de formas de parcelamento, conforme o método seleciondo.
        buttonStoreOption.setBackgroundTintList(AppCompatResources.getColorStateList(this, formaFinanciamentoSelecionada == FormaFinanciamento.LOJA ? R.color.verde : R.color.black));
        buttonAdmOption.setBackgroundTintList(AppCompatResources.getColorStateList(this, formaFinanciamentoSelecionada == FormaFinanciamento.ADM ? R.color.verde : R.color.black));
        buttonCashOption.setBackgroundTintList(AppCompatResources.getColorStateList(this, formaFinanciamentoSelecionada == FormaFinanciamento.A_VISTA ? R.color.verde : R.color.black));
    }

    public void startActionTEF(Acao acao) {
        switch (opcaoTefSelecionada) {
            case PAY_GO:
                sendPaygoParams(acao);
                break;
            case M_SITEF:
                sendMSitefParams(acao);
                break;
            case ELGIN_TEF:
                sendElginTefParams(acao);
                break;
        }
    }

    //Retorna o valor monetário inserido, de maneira limpa. (Os TEFs devem receber o valor em centavos, 2000 para 20 reais, por exemplo).
    private String getTextValueTEFClean() {
        //As vírgulas e pontos inseridas pelas máscaras são retiradas.
        return editTextValueTEF.getText().toString().replaceAll(",", "").replaceAll("\\.", "");
    }

    public void sendPaygoParams(Acao acao) {
        Map<String, Object> mapValues = new HashMap<>();

        //Se for uma venda ou cancelamento, deve ser feito a configuração a seguir para a classe que lidará com o pagamento via paygo.
        if (acao != Acao.CONFIGURACAO) {
            mapValues.put("valor", "2.00");
            mapValues.put("parcelas", Integer.parseInt(editTextInstallmentsTEF.getText().toString()));
            mapValues.put("formaPagamento", formaPagamentoSelecionada);
            mapValues.put("tipoParcelamento", formaFinanciamentoSelecionada);

            switch (acao) {
                case VENDA:
                    paygo.efetuaTransacao(Operacoes.VENDA, mapValues);
                    break;
                case CANCELAMENTO:
                    paygo.efetuaTransacao(Operacoes.CANCELAMENTO, mapValues);
                    break;
            }
        } else {
            paygo.efetuaTransacao(Operacoes.ADMINISTRATIVA, mapValues);
        }
    }

    public void sendMSitefParams(Acao acao) {
        //Parâmetros de configuração do M-Sitef.
        intentToMsitef.putExtra("empresaSitef", "00000000");
        intentToMsitef.putExtra("enderecoSitef", editTextIpTEF.getText().toString());
        intentToMsitef.putExtra("operador", "0001");
        intentToMsitef.putExtra("data", "20200324");
        intentToMsitef.putExtra("hora", "130358");
        intentToMsitef.putExtra("numeroCupom", String.valueOf(new Random().nextInt(99999)));
        intentToMsitef.putExtra("valor", getTextValueTEFClean());
        intentToMsitef.putExtra("CNPJ_CPF", "03654119000176");
        intentToMsitef.putExtra("comExterna", "0");

        switch (acao) {
            case VENDA:
                intentToMsitef.putExtra("modalidade", getSelectedPaymentCode());
                switch (formaPagamentoSelecionada) {
                    case CREDITO:
                        intentToMsitef.putExtra("numParcelas", editTextInstallmentsTEF.getText().toString());
                        switch (formaFinanciamentoSelecionada) {
                            case A_VISTA:
                                intentToMsitef.putExtra("transacoesHabilitadas", "26");
                                break;
                            case LOJA:
                                intentToMsitef.putExtra("transacoesHabilitadas", "27");
                                break;
                            case ADM:
                                intentToMsitef.putExtra("transacoesHabilitadas", "28");
                                break;
                        }
                        break;
                    case DEBITO:
                        intentToMsitef.putExtra("transacoesHabilitadas", "16");
                        intentToMsitef.putExtra("numParcelas", "");
                        break;
                }
                break;
            case CANCELAMENTO:
                intentToMsitef.putExtra("modalidade", "200");
                intentToMsitef.putExtra("transacoesHabilitadas", "");
                intentToMsitef.putExtra("isDoubleValidation", "0");
                intentToMsitef.putExtra("restricoes", "");
                intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm");
                break;
            case CONFIGURACAO:
                intentToMsitef.putExtra("modalidade", "110");
                intentToMsitef.putExtra("isDoubleValidation", "0");
                intentToMsitef.putExtra("restricoes", "");
                intentToMsitef.putExtra("transacoesHabilitadas", "");
                intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm");
                intentToMsitef.putExtra("restricoes", "transacoesHabilitadas=16;26;27");
                break;
        }
        startActivityForResult(intentToMsitef, REQUEST_CODE_MSITEF);
    }

    private void sendElginTefParams(Acao acao) {
        //Configura o valor da transação.
        intentToElginTef.putExtra("valor", "2.00");

        switch (acao) {
            case VENDA:
                intentToElginTef.putExtra("modalidade", getSelectedPaymentCode());
                switch (formaPagamentoSelecionada) {
                    case CREDITO:
                        intentToElginTef.putExtra("numParcelas", editTextInstallmentsTEF.getText().toString());
                        switch (formaFinanciamentoSelecionada) {
                            case A_VISTA:
                                intentToElginTef.putExtra("transacoesHabilitadas", "26");
                                break;
                            case LOJA:
                                intentToElginTef.putExtra("transacoesHabilitadas", "27");
                                break;
                            case ADM:
                                intentToElginTef.putExtra("transacoesHabilitadas", "28");
                                break;
                        }
                        break;
                    case DEBITO:
                        intentToElginTef.putExtra("transacoesHabilitadas", "16");
                        intentToElginTef.putExtra("numParcelas", "");
                        break;
                }
                break;
            case CANCELAMENTO:
                if (lastElginTefNSU.isEmpty()) {
                    alertMessageStatus("Alert", "É necessário realizar uma transação antes para realizar o cancelamento no TEF ELGIN!");
                    return;
                }

                intentToElginTef.putExtra("modalidade", "200");

                //Data do dia de hoje, usada como um dos parâmetros necessário para o cancelamento de transação no TEF Elgin.
                Date todayDate = new Date();

                //Objeto capaz de formatar a date para o formato aceito pelo Elgin TEF ("aaaaMMdd") (20220923).
                SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyyMMdd");

                final String todayDateAsString = dateFormatter.format(todayDate);

                intentToElginTef.putExtra("data", todayDateAsString);
                intentToElginTef.putExtra("NSU_SITEF", lastElginTefNSU);
                break;
        }
        startActivityForResult(intentToElginTef, REQUEST_CODE_ELGINTEF);
    }

    public static void optionsReturnPaygo(Map map) {
        Map<String, Object> mapValues = new HashMap<>();

        if (map.get("retorno").equals("Transacao autorizada")) {
            String imageViaBase64 = (String) map.get("via_cliente");

            byte[] decodedString = Base64.decode(imageViaBase64, Base64.DEFAULT);
            Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
            imageViewViaPaygo.setImageBitmap(decodedByte);

            mapValues.put("quant", 10);
            mapValues.put("base64", imageViaBase64);

            printer.imprimeCupomTEF(mapValues);
            printer.AvancaLinhas(mapValues);
            printer.cutPaper(mapValues);

        }
        alertMessageStatus("Alert", map.get("retorno").toString());
    }

    //Validação das entradas.
    public boolean isEntriesValid() {
        if (isValueNotEmpty(editTextValueTEF.getText().toString())) {
            if (isInstallmentEmptyOrLessThanZero(editTextInstallmentsTEF.getText().toString())) {
                if (opcaoTefSelecionada == TEF.M_SITEF) { //Somente se o TEF escolhido for MSitef é necessário validar o IP.
                    if (isIpValid(editTextIpTEF.getText().toString())) {
                        return true;
                    } else {
                        alertMessageStatus("Alerta", "Verifique seu endereço IP.");
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                alertMessageStatus("Alerta", "Digite um número de parcelas válido maior que 0.");
                return false;
            }
        } else {
            alertMessageStatus("Alerta", "Verifique a entrada de valor de pagamento!");
            return false;
        }
    }

    //Còdigo para a forma de pagamento selecionada.
    public String getSelectedPaymentCode() {
        switch (formaPagamentoSelecionada) {
            case CREDITO:
                return "3";
            case DEBITO:
                return "2";
            default: //case "Todos"
                return "0";
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        //Os TEFs MSitef e TEF Elgin possuem o mesmo retorno.
        if (requestCode == REQUEST_CODE_MSITEF || requestCode == REQUEST_CODE_ELGINTEF) {

            //Se resultCode da intent for OK então a transação obteve sucesso.
            //Caso o resultCode da intent for de atividade cancelada e a data estiver diferente de nulo, é possível obter um retorno também.
            if (resultCode == RESULT_OK || (resultCode == RESULT_CANCELED && data != null)) {

                //O campos são os mesmos para ambos os TEFs.
                final String COD_AUTORIZACAO = data.getStringExtra("COD_AUTORIZACAO");
                final String VIA_ESTABELECIMENTO = data.getStringExtra("VIA_ESTABELECIMENTO");
                final String COMP_DADOS_CONF = data.getStringExtra("COMP_DADOS_CONF");
                final String BANDEIRA = data.getStringExtra("BANDEIRA");
                final String NUM_PARC = data.getStringExtra("NUM_PARC");
                final String RELATORIO_TRANS = data.getStringExtra("RELATORIO_TRANS");
                final String REDE_AUT = data.getStringExtra("REDE_AUT");
                final String NSU_SITEF = data.getStringExtra("NSU_SITEF");
                final String VIA_CLIENTE = data.getStringExtra("VIA_CLIENTE");
                final String TIPO_PARC = data.getStringExtra("TIPO_PARC");
                final String CODRESP = data.getStringExtra("CODRESP");
                final String NSU_HOST = data.getStringExtra("NSU_HOST");

                //Se o código de resposta estiver nulo ou tiver valor inteiro inferior a 0, a transação não ocorreu como esperado.
                if (CODRESP == null || Integer.parseInt(CODRESP) < 0) {
                    alertMessageStatus("Alerta", "Ocorreu um erro durante a transação.");
                } else {
                    //Atualiza a via cliente com a via atual recebida.
                    this.viaClienteMsitef = VIA_CLIENTE;

                    //Atualiza a caixa de visualização na tela com a via do cliente.
                    textViewViaTef.setText(viaClienteMsitef);

                    //Atualiza o NSU de cancelamento de acordo, necessário para o cancelamento, caso requisitado, desta ultima venda.
                    this.lastElginTefNSU = NSU_SITEF;

                    //Se a via não estiver nula, significando uma operação com completo sucesso, é feita a impressão da via.
                    if (viaClienteMsitef != null) {
                        printerViaClienteMsitef(viaClienteMsitef);
                    }

                    //Alerta na tela o sucesso da operação.
                    alertMessageStatus("Alerta", "Ação realizada com sucesso.");
                }
            } else {
                alertMessageStatus("Alerta", "Ocorreu um erro durante a transação.");
            }
        }
    }

    public void printerViaClienteMsitef(String viaCliente) {
        Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("text", viaCliente);
        mapValues.put("align", "Centralizado");
        mapValues.put("font", "FONT B");
        mapValues.put("fontSize", 0);
        mapValues.put("isBold", false);
        mapValues.put("isUnderline", false);
        mapValues.put("quant", 10);

        printer.imprimeTexto(mapValues);
        printer.AvancaLinhas(mapValues);
        printer.cutPaper(mapValues);
    }

    public static void alertMessageStatus(String titleAlert, String messageAlert) {
        AlertDialog alertDialog = new AlertDialog.Builder(context).create();
        alertDialog.setTitle(titleAlert);
        alertDialog.setMessage(messageAlert);
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                (dialog, which) -> dialog.dismiss());
        alertDialog.show();
    }

    public static boolean isIpValid(String ip) {
        Pattern pattern = Pattern.compile("^(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))$");
        Matcher matcher = pattern.matcher(ip);
        return matcher.matches();
    }

    public static boolean isValueNotEmpty(String inputTextValue) {
        return !inputTextValue.equals("");
    }

    public static boolean isInstallmentEmptyOrLessThanZero(String inputTextInstallment) {
        if (inputTextInstallment.equals("")) {
            return false;
        } else {
            return Integer.parseInt(inputTextInstallment) > 0;
        }
    }
}