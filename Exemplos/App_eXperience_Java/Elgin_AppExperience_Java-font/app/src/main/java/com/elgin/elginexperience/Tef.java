package com.elgin.elginexperience;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.content.res.AppCompatResources;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.elgin.elginexperience.Services.PrinterService;
import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import br.com.setis.interfaceautomacao.Operacoes;

public class Tef extends AppCompatActivity {
    Paygo paygo;
    static PrinterService printer;
    Intent intentToMsitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");
    Gson gson = new Gson();
    static Context context;

    //BUTTONS TYPE TEF
    Button buttonMsitefOption;
    Button buttonPaygoOption;

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
    Button buttonAvistaOption;

    //BUTTONS ACTIONS TEF
    Button buttonSendTransaction;
    Button buttonCancelTransaction;
    Button buttonConfigsTransaction;

    //IMAGE VIEW VIA PAYGO
    static ImageView imageViewViaPaygo;

    static TextView textViewViaMsitef;
    String viaClienteMsitef;

    //INIT DEFAULT OPTIONS
    String selectedPaymentMethod = "Crédito";
    String selectedInstallmentsMethod = "Avista";
    String selectedTefType = "PayGo";
    String selectedAction = "SALE";

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
        buttonMsitefOption = findViewById(R.id.buttonMsitefOption);
        buttonPaygoOption = findViewById(R.id.buttonPaygoOption);

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
        buttonAvistaOption = findViewById(R.id.buttonAvistaOption);

        //INIT BUTTONS ACTIONS TEF
        buttonSendTransaction = findViewById(R.id.buttonSendTransactionTEF);
        buttonCancelTransaction = findViewById(R.id.buttonCancelTransactionTEF);
        buttonConfigsTransaction = findViewById(R.id.buttonConfigsTEF);

        //INIT IMAGE VIEW VIA PAYGO
        imageViewViaPaygo = findViewById(R.id.imageViewViaPaygo);

        //INIT IMAGE VIEW VIA PAYGO
        textViewViaMsitef = findViewById(R.id.textViewViaMsitef);

        //SELECT INITIALS OPTIONS
        buttonPaygoOption.setBackgroundTintList( AppCompatResources.getColorStateList(context, R.color.verde));
        buttonCreditOption.setBackgroundTintList( AppCompatResources.getColorStateList(context, R.color.verde));
        buttonAvistaOption.setBackgroundTintList( AppCompatResources.getColorStateList(context, R.color.verde));

        //INIT DEFAULT INPUTS
        editTextValueTEF.setText("2000");
        editTextInstallmentsTEF.setText("1");
        editTextIpTEF.setText("192.168.0.31");

        editTextIpTEF.setEnabled(false);
        editTextIpTEF.setFocusableInTouchMode(false);
        textViewViaMsitef.setVisibility(View.GONE);

        //SELECT OPTION M-SITEF
        buttonMsitefOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedTefType = "M-Sitef";

                buttonMsitefOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.verde));
                buttonPaygoOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));

                editTextIpTEF.setEnabled(true);
                editTextIpTEF.setFocusableInTouchMode(true);
                buttonAvistaOption.setEnabled(false);

                if(selectedInstallmentsMethod.equals("Avista")){
                    selectedInstallmentsMethod = "Crédito";
                    buttonAvistaOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
                    buttonStoreOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.verde));
                }
                textViewViaMsitef.setVisibility(View.VISIBLE);

                buttonAvistaOption.setVisibility(View.GONE);
                imageViewViaPaygo.setVisibility(View.GONE);
            }
        });

        //SELECT OPTION PAYGO
        buttonPaygoOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedTefType = "PayGo";

                buttonMsitefOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
                buttonPaygoOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.verde));

                editTextIpTEF.setEnabled(false);
                editTextIpTEF.setFocusableInTouchMode(false);
                buttonAvistaOption.setEnabled(true);

                buttonAvistaOption.setVisibility(View.VISIBLE);
                textViewViaMsitef.setVisibility(View.GONE);
                imageViewViaPaygo.setVisibility(View.VISIBLE);
            }
        });

        //SELECT OPTION CREDIT PAYMENT
        buttonCreditOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedPaymentMethod = "Crédito";

                buttonCreditOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.verde));
                buttonDebitOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
                buttonVoucherOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
            }
        });

        //SELECT OPTION DEBIT PAYMENT
        buttonDebitOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedPaymentMethod = "Débito";

                buttonCreditOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
                buttonDebitOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.verde));
                buttonVoucherOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
            }
        });

        //SELECT OPTION VOUCHER PAYMENT
        buttonVoucherOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedPaymentMethod = "Todos";

                buttonCreditOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
                buttonDebitOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
                buttonVoucherOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.verde));
            }
        });

        //SELECT OPTION STORE INSTALLMENT
        buttonStoreOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedInstallmentsMethod = "Loja";

                buttonStoreOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.verde));
                buttonAdmOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
                buttonAvistaOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
            }
        });

        //SELECT OPTION ADM INSTALLMENT
        buttonAdmOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedInstallmentsMethod = "Adm";

                buttonStoreOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
                buttonAdmOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.verde));
                buttonAvistaOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
            }
        });

        //SELECT OPTION AVISTA INSTALLMENT
        buttonAvistaOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedInstallmentsMethod = "Avista";

                buttonStoreOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
                buttonAdmOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.black));
                buttonAvistaOption.setBackgroundTintList( AppCompatResources.getColorStateList(context,R.color.verde));
            }
        });

        //SELECT BUTTON SEND TRANSACTION
        buttonSendTransaction.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(isEntriesValid()){
                    startActionTEF("SALE");
                }
            }
        });

        //SELECT BUTTON CANCEL TRANSACTION
        buttonCancelTransaction.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(isEntriesValid()) {
                    startActionTEF("CANCEL");
                }
            }
        });

        //SELECT BUTTON CONFIGS TRANSACTION
        buttonConfigsTransaction.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(isEntriesValid()) {
                    startActionTEF("CONFIGS");
                }
            }
        });
    }

    public void startActionTEF(String action){
        selectedAction = action;
        if(selectedTefType.equals("M-Sitef")){
            sendSitefParams(action);
        }else{
            sendPaygoParams(action);
        }
    }

    public void sendPaygoParams(String action){
        Map<String, Object> mapValues = new HashMap<>();

        if(action.equals("SALE") || action.equals("CANCEL")){
            mapValues.put("valor", editTextValueTEF.getText().toString());
            mapValues.put("parcelas", Integer.parseInt(editTextInstallmentsTEF.getText().toString()));
            mapValues.put("formaPagamento", selectedPaymentMethod);
            mapValues.put("tipoParcelamento", selectedInstallmentsMethod);

            if(action.equals("SALE")){
                paygo.efetuaTransacao(Operacoes.VENDA, mapValues);
            }else if(action.equals("CANCEL")){
                paygo.efetuaTransacao(Operacoes.CANCELAMENTO, mapValues);
            }

        }else{
            paygo.efetuaTransacao(Operacoes.ADMINISTRATIVA, mapValues);
        }
    }

    public static void optionsReturnPaygo(Map map){
        Map<String, Object> mapValues = new HashMap<>();

        if(map.get("retorno").equals("Transacao autorizada")){
            String imageViaBase64 = (String) map.get("via_cliente");

            byte[] decodedString = Base64.decode(imageViaBase64, Base64.DEFAULT);
            Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
            imageViewViaPaygo.setImageBitmap(decodedByte);

            mapValues.put("quant", 10);
            mapValues.put("base64", imageViaBase64);

            printer.imprimeCupomTEF(mapValues);
            printer.AvancaLinhas(mapValues);
            printer.cutPaper(mapValues);

            alertMessageStatus("Alert", map.get("retorno").toString());
        }else{
            alertMessageStatus("Alert", map.get("retorno").toString());
        }
    }

    public boolean isEntriesValid(){
        if(isValueNotEmpty(editTextValueTEF.getText().toString())){
            if(isInstallmentEmptyOrLessThanZero(editTextInstallmentsTEF.getText().toString())){
                if(selectedTefType.equals("M-Sitef")){
                    if(isIpValid(editTextIpTEF.getText().toString())){
                        return true;
                    }else {
                        alertMessageStatus("Alerta", "Verifique seu endereço IP.");
                        return false;
                    }
                }else {
                    return true;
                }
            }else {
                alertMessageStatus("Alerta", "Digite um número de parcelas válido maior que 0.");
                return false;
            }
        }else {
            alertMessageStatus("Alerta", "Verifique a entrada de valor de pagamento!");
            return false;
        }
    }

    public void sendSitefParams(String action){
        //PARAMS DEFAULT TO ALL ACTION M-SITEF
        intentToMsitef.putExtra("empresaSitef", "00000000");
        intentToMsitef.putExtra("enderecoSitef", editTextIpTEF.getText().toString());
        intentToMsitef.putExtra("operador", "0001");
        intentToMsitef.putExtra("data", "20200324");
        intentToMsitef.putExtra("hora", "130358");
        intentToMsitef.putExtra("numeroCupom", String.valueOf(new Random().nextInt(99999)));
        intentToMsitef.putExtra("valor", editTextValueTEF.getText().toString());
        intentToMsitef.putExtra("CNPJ_CPF", "03654119000176");
        intentToMsitef.putExtra("comExterna", "0");

        if(action.equals("SALE")){
            intentToMsitef.putExtra("modalidade", paymentToYourCode(selectedPaymentMethod));

            if(selectedPaymentMethod.equals("Crédito")){
                if(editTextInstallmentsTEF.getText().toString().equals("0") || editTextInstallmentsTEF.getText().toString().equals("1")){
                    intentToMsitef.putExtra("transacoesHabilitadas", "26");
                    intentToMsitef.putExtra("numParcelas", "");

                }else if(selectedPaymentMethod.equals("Loja")){
                    intentToMsitef.putExtra("transacoesHabilitadas", "27");

                }else if(selectedPaymentMethod.equals("Adm")){
                    intentToMsitef.putExtra("transacoesHabilitadas", "28");
                }

                intentToMsitef.putExtra("numParcelas", editTextInstallmentsTEF.getText().toString());
            }

            if(selectedPaymentMethod.equals("Débito")){
                intentToMsitef.putExtra("transacoesHabilitadas", "16");
                intentToMsitef.putExtra("numParcelas", "");
            }

            if(selectedPaymentMethod.equals("Todos")){
                intentToMsitef.putExtra("restricoes", "transacoesHabilitadas=16");
                intentToMsitef.putExtra("transacoesHabilitadas", "");
                intentToMsitef.putExtra("numParcelas", "");
            }
        }

        if(action.equals("CANCEL")){
            intentToMsitef.putExtra("modalidade", "200");
            intentToMsitef.putExtra("transacoesHabilitadas", "");
            intentToMsitef.putExtra("isDoubleValidation", "0");
            intentToMsitef.putExtra("restricoes", "");
            intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm");
        }

        if(action.equals("CONFIGS")){
            intentToMsitef.putExtra("modalidade", "110");
            intentToMsitef.putExtra("isDoubleValidation", "0");
            intentToMsitef.putExtra("restricoes", "");
            intentToMsitef.putExtra("transacoesHabilitadas", "");
            intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm");
            intentToMsitef.putExtra("restricoes", "transacoesHabilitadas=16;26;27");
        }

        startActivityForResult(intentToMsitef, 4321);
    }

    public String paymentToYourCode(String payment) {
        switch (payment) {
            case "Crédito":
                return "3";
            case "Débito":
                return "2";
            case "Todos":
                return "0";
            default:
                return "0";
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 4321) {
            SitefReturn sitefReturn = null;
            try {
                sitefReturn = gson.fromJson(convertResultFromJSON(data), SitefReturn.class);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            if (resultCode == RESULT_OK || resultCode == RESULT_CANCELED && data != null) {
                if (Integer.parseInt(sitefReturn.cODRESP()) < 0 && sitefReturn.cODAUTORIZACAO().equals("")) {
                    alertMessageStatus("Alerta", "Ocorreu um erro durante a transação.");
                } else {
                    viaClienteMsitef = sitefReturn.vIACLIENTE();

                    textViewViaMsitef.setText(viaClienteMsitef);

                    if(!selectedAction.equals("CONFIGS")){
                        printerViaVlienteMsitef(sitefReturn.vIACLIENTE());
                    }

                    alertMessageStatus("Alerta", "Ação realizada com sucesso.");
                }
            } else {
                alertMessageStatus("Alerta", "Ocorreu um erro durante a transação.");
            }
        }
    }

    public String convertResultFromJSON(Intent receiveResult) throws JSONException {
        JSONObject convertJSON = new JSONObject();

        convertJSON.put("cODAUTORIZACAO", receiveResult.getStringExtra("COD_AUTORIZACAO"));
        convertJSON.put("vIAESTABELECIMENTO", receiveResult.getStringExtra("VIA_ESTABELECIMENTO"));
        convertJSON.put("cOMPDADOSCONF", receiveResult.getStringExtra("COMP_DADOS_CONF"));
        convertJSON.put("bANDEIRA", receiveResult.getStringExtra("BANDEIRA"));
        convertJSON.put("nUMPARC", receiveResult.getStringExtra("NUM_PARC"));
        convertJSON.put("cODTRANS", receiveResult.getStringExtra("CODTRANS"));
        convertJSON.put("rEDEAUT", receiveResult.getStringExtra("REDE_AUT"));
        convertJSON.put("nSUSITEF", receiveResult.getStringExtra("NSU_SITEF"));
        convertJSON.put("vIACLIENTE", receiveResult.getStringExtra("VIA_CLIENTE"));
        convertJSON.put("vLTROCO", receiveResult.getStringExtra("VLTROCO"));
        convertJSON.put("tIPOPARC", receiveResult.getStringExtra("TIPO_PARC"));
        convertJSON.put("cODRESP", receiveResult.getStringExtra("CODRESP"));
        convertJSON.put("nSUHOST", receiveResult.getStringExtra("NSU_HOST"));

        return convertJSON.toString();
    }

    public void printerViaVlienteMsitef(String viaCliente){
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


    public static void alertMessageStatus(String titleAlert, String messageAlert){
        AlertDialog alertDialog = new AlertDialog.Builder(context).create();
        alertDialog.setTitle(titleAlert);
        alertDialog.setMessage(messageAlert);
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
            new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                    dialog.dismiss();
                }
            });
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
        if(inputTextInstallment.equals("")){
            return false;
        }else {
            return Integer.parseInt(inputTextInstallment) > 0;
        }
    }
}