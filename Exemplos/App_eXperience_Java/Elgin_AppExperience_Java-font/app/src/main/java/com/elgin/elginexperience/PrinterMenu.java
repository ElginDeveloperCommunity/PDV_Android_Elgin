package com.elgin.elginexperience;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.content.res.AppCompatResources;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Fragment;
import android.app.FragmentTransaction;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import com.elgin.elginexperience.Services.PrinterService;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PrinterMenu extends AppCompatActivity {
    public Context mContext;

    Button buttonPrinterTextSelected;
    Button buttonPrinterBarCodeSelected;
    Button buttonPrinterImageSelected;
    Button buttonStatusPrinter;
    Button buttonStatusGaveta;
    Button buttonAbrirGaveta;

    RadioGroup radioGroupConnectPrinterIE;
    RadioButton radioButtonConnectPrinterIntern;

    EditText editTextInputIP;

    static PrinterService printer;

    private String selectedPrinterModel;

    private static final String EXTERNAL_PRINTER_MODEL_I9 = "i9";
    private static final String EXTERNAL_PRINTER_MODEL_I8 = "i8";
    private static final String EXTERNAL_PRINTER_MODEL_I7_PLUS = "i7 PLUS";

    private static final String EXTERNAL_PRINTER_MODEL_MP4200 = "MP-4200";

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = this;
        setContentView(R.layout.activity_printer_menu);

        //Inicializa a impressora interna selecionada inicialmente e ajusta a variavel de controle booleana que verifica se a impressora interna esta em uso
        printer = new PrinterService(this);
        printer.printerInternalImpStart();

        showPrinterTextScreen();

        editTextInputIP = findViewById(R.id.editTextInputIP);
        editTextInputIP.setText("192.168.0.103:9100");

        buttonPrinterTextSelected = findViewById(R.id.buttonPrinterTextSelect);
        buttonPrinterImageSelected = findViewById(R.id.buttonPrinterImageSelect);
        buttonPrinterBarCodeSelected = findViewById(R.id.buttonPrinterBarCodeSelect);
        buttonStatusPrinter = findViewById(R.id.buttonStatus);
        buttonStatusGaveta = findViewById(R.id.buttonStatusGaveta);
        buttonAbrirGaveta = findViewById(R.id.buttonAbrirGaveta);

        radioButtonConnectPrinterIntern = findViewById(R.id.radioButtonConnectPrinterIntern);

        radioButtonConnectPrinterIntern.setChecked(true);
        radioGroupConnectPrinterIE = findViewById(R.id.radioGroupConnectPrinterIE);
        radioGroupConnectPrinterIE.setOnCheckedChangeListener((group, checkedId) -> {
            final String EXTERNAL_CONNECTION_METHOD_USB = "USB";
            final String EXTERNAL_CONNECTION_METHOD_IP = "IP";

            if (checkedId == R.id.radioButtonConnectPrinterIntern) {
                printer.printerInternalImpStart();
            } else if (checkedId == R.id.radioButtonConnectPrinterExternByIP) {
                if (isIpValid(editTextInputIP.getText().toString())) {
                    // Invoca o alertDialog que permite a escolha do modelo de impressora antes da tentativa de iniciar a conexão por IP
                    alertDialogSetSelectedPrinterModelThenConnect(EXTERNAL_CONNECTION_METHOD_IP);
                } else {
                    // Se não foi possível validar o ip antes da chama da função, retorne para a conexão com impressora interna
                    alertMessageStatus("Digite um IP válido.");
                    radioButtonConnectPrinterIntern.setChecked(true);
                }
            } else if (checkedId == R.id.radioButtonConnectPrinterExternByUSB) {
                // Invoca o alertDialog que permite a escolha do modelo de impressora antes da tentativa de iniciar a conexão por USB
                alertDialogSetSelectedPrinterModelThenConnect(EXTERNAL_CONNECTION_METHOD_USB);
            }
        });


        buttonPrinterTextSelected.setBackgroundTintList(AppCompatResources.getColorStateList(mContext, R.color.azul));

        buttonPrinterTextSelected.setOnClickListener(v -> {
            buttonPrinterTextSelected.setBackgroundTintList(AppCompatResources.getColorStateList(mContext, R.color.azul));
            buttonPrinterBarCodeSelected.setBackgroundTintList(AppCompatResources.getColorStateList(mContext, R.color.black));
            buttonPrinterImageSelected.setBackgroundTintList(AppCompatResources.getColorStateList(mContext, R.color.black));
            showPrinterTextScreen();
        });

        buttonPrinterBarCodeSelected.setOnClickListener(v -> {
            buttonPrinterTextSelected.setBackgroundTintList(AppCompatResources.getColorStateList(mContext, R.color.black));
            buttonPrinterBarCodeSelected.setBackgroundTintList(AppCompatResources.getColorStateList(mContext, R.color.azul));
            buttonPrinterImageSelected.setBackgroundTintList(AppCompatResources.getColorStateList(mContext, R.color.black));
            showPrinterBarCodeScreen();
        });

        buttonPrinterImageSelected.setOnClickListener(v -> {
            buttonPrinterTextSelected.setBackgroundTintList(AppCompatResources.getColorStateList(mContext, R.color.black));
            buttonPrinterBarCodeSelected.setBackgroundTintList(AppCompatResources.getColorStateList(mContext, R.color.black));
            buttonPrinterImageSelected.setBackgroundTintList(AppCompatResources.getColorStateList(mContext, R.color.azul));
            showPrinterImageScreen();
        });

        buttonStatusPrinter.setOnClickListener(v -> statusPrinter());

        buttonStatusGaveta.setOnClickListener(v -> statusGaveta());

        buttonAbrirGaveta.setOnClickListener(v -> abrirGaveta());
    }

    public void connectExternPrinterByIP(String ip) {
        String[] ipAndPort = ip.split(":");
        int result = printer.printerExternalImpStartByIP(selectedPrinterModel, ipAndPort[0], Integer.parseInt(ipAndPort[1]));
        System.out.println("RESULT EXTERN - IP: " + result);

        if (result != 0) {
            alertMessageStatus("A tentativa de conexão por IP não foi bem sucedida!");
            printer.printerInternalImpStart();
            radioButtonConnectPrinterIntern.setChecked(true);
        }

    }

    public void connectExternPrinterByUSB(String model) {
        int result = printer.printerExternalImpStartByUSB(model);
        System.out.println("RESULT EXTERN - USB: " + result);

        if (result != 0) {
            alertMessageStatus("A tentativa de conexão por USB não foi bem sucedida!");
            printer.printerInternalImpStart();
            radioButtonConnectPrinterIntern.setChecked(true);
        }
    }

    //Dialogo usado para escolher definir o modelo de impressora externa que sera estabelecida a conexao
    public void alertDialogSetSelectedPrinterModelThenConnect(String externalConnectionMethod) {
        // A impressora de modelo i7 plus só possuí conexão via porta USB, portanto a mesma só deverá aparecer para este caso.

        final String[] operations;
        if (externalConnectionMethod.equals("USB")) {
            operations = new String[]{EXTERNAL_PRINTER_MODEL_I9, EXTERNAL_PRINTER_MODEL_I8, EXTERNAL_PRINTER_MODEL_I7_PLUS, EXTERNAL_PRINTER_MODEL_MP4200};
        } else {
            operations = new String[]{EXTERNAL_PRINTER_MODEL_I9, EXTERNAL_PRINTER_MODEL_I8};
        }

        AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
        builder.setTitle("Selecione o modelo de impressora a ser conectado");

        //Tornando o dialógo não-cancelável
        builder.setCancelable(false);

        builder.setNegativeButton("CANCELAR", (dialog, which) -> {
            //Se a opção de cancelamento tiver sido escolhida, retorne sempre à opção de impressão por impressora interna
            printer.printerInternalImpStart();
            radioButtonConnectPrinterIntern.setChecked(true);
            dialog.dismiss();
        });

        builder.setItems(operations, (dialog, which) -> {
            //Envia o parâmetro escolhido para a função que atualiza o modelo de impressora selecionado
            setSelectedPrinterModel(which);

            //inicializa depois da seleção do modelo a conexão de impressora, levando em contra o parâmetro que define se a conexão deve ser via IP ou USB
            if (externalConnectionMethod.equals("USB")) {
                connectExternPrinterByUSB(selectedPrinterModel);
            } else {
                connectExternPrinterByIP(editTextInputIP.getText().toString());
            }
        });
        builder.show();
    }

    public void setSelectedPrinterModel(int whichSelected) {
        switch (whichSelected) {
            case 0:
                selectedPrinterModel = EXTERNAL_PRINTER_MODEL_I9;
                break;
            case 1:
                selectedPrinterModel = EXTERNAL_PRINTER_MODEL_I8;
                break;
            case 2:
                selectedPrinterModel = EXTERNAL_PRINTER_MODEL_I7_PLUS;
                break;
            case 3:
                selectedPrinterModel = EXTERNAL_PRINTER_MODEL_MP4200;
                break;
            default:
                throw new AssertionError(whichSelected); // Todos os índices para modelos disponibilizados no alert foram cobertos, algum caso deve ter ocorrido.
        }
    }


    public void showPrinterTextScreen() {
        FragmentPrinterText firstFragment = new FragmentPrinterText();
        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        transaction.replace(R.id.containerFragments, firstFragment);
        transaction.commit();
    }

    public void showPrinterBarCodeScreen() {
        FragmentPrinterBarCode barCodeFragment = new FragmentPrinterBarCode();
        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        transaction.replace(R.id.containerFragments, barCodeFragment);
        transaction.commit();
    }

    public void showPrinterImageScreen() {
        FragmentPrinterImage barCodeFragment = new FragmentPrinterImage();
        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        transaction.replace(R.id.containerFragments, barCodeFragment);
        transaction.commit();
    }

    public void statusPrinter() {
        String statusPrinter = "";
        int resultStatus = printer.statusSensorPapel();
        System.out.println("STATUS GAVETA: " + printer.statusGaveta());

        if (resultStatus == 5) {
            statusPrinter = "Papel está presente e não está próximo do fim!";
        } else if (resultStatus == 6) {
            statusPrinter = "Papel próximo do fim!";
        } else if (resultStatus == 7) {
            statusPrinter = "Papel ausente!";
        } else {
            statusPrinter = "Status Desconhecido!";
        }

        alertMessageStatus(statusPrinter);
    }

    private void statusGaveta() {
        String statusGaveta = "";

        int resultStatusGaveta = printer.statusGaveta();

        if (resultStatusGaveta == 1) {
            statusGaveta = "Gaveta aberta!";
        } else if (resultStatusGaveta == 2) {
            statusGaveta = "Gaveta fechada!";
        } else {
            statusGaveta = "Status Desconhecido!";
        }

        alertMessageStatus(statusGaveta);
    }

    private int abrirGaveta() {
        return printer.abrirGaveta();
    }

    public void alertMessageStatus(String messageAlert) {
        AlertDialog alertDialog = new AlertDialog.Builder(PrinterMenu.printer.mActivity).create();
        alertDialog.setTitle("Alert");
        alertDialog.setMessage(messageAlert);
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK", (dialog, which) -> dialog.dismiss());
        alertDialog.show();
    }

    public static boolean isIpValid(String ip) {
        Pattern pattern = Pattern.compile("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$");

        Matcher matcher = pattern.matcher(ip);

        return matcher.matches();
    }

    /**
     * Funções da impressora, que serão chamadas pelos fragments que invocaram as impressões
     */

    //Esta função aplica um AvancaPapel na impressão de acordo com o tipo de impressora em uso
    public static void jumpLine() {
        Map<String, Object> mapValues = new HashMap<>();

        //Se a impressão for por impressora externa, 5 é o suficiente; 10 caso contrário

        if (!printer.isPrinterInternSelected) {
            mapValues.put("quant", 5);
        } else mapValues.put("quant", 10);

        printer.AvancaLinhas(mapValues);
    }

    //O valor enviado ao corte de papél corresponde também a um avancaLinhas, como utilizamos jumpLine(), enviaremos o valor mínimo
    public static void cutPaper() {
        Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("quant", 1);

        PrinterMenu.printer.cutPaper(mapValues);
    }
}