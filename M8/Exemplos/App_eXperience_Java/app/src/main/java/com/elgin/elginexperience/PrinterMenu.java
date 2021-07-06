package com.elgin.elginexperience;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.content.res.AppCompatResources;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
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

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PrinterMenu extends AppCompatActivity {
    Context context;

    Button buttonPrinterTextSelected;
    Button buttonPrinterBarCodeSelected;
    Button buttonPrinterImageSelected;
    Button buttonStatusPrinter;
    Button buttonStatusGaveta;
    Button buttonAbrirGaveta;

    RadioGroup radioGroupConnectPrinterIE;
    RadioButton radioButtonConnectPrinterIntern;

    EditText editTextInputIP;

    static Printer printer;

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        context = this;
        setContentView(R.layout.activity_printer_menu);

        printer = new Printer(this);
        printer.printerInternalImpStart();

        showPrinterTextScreen();

        editTextInputIP = findViewById(R.id.editTextInputIP);
        editTextInputIP.setText("192.168.0.31:9100");

        buttonPrinterTextSelected = findViewById(R.id.buttonPrinterTextSelect);
        buttonPrinterImageSelected = findViewById(R.id.buttonPrinterImageSelect);
        buttonPrinterBarCodeSelected = findViewById(R.id.buttonPrinterBarCodeSelect);
        buttonStatusPrinter = findViewById(R.id.buttonStatus);
        buttonStatusGaveta = findViewById(R.id.buttonStatusGaveta);
        buttonAbrirGaveta = findViewById(R.id.buttonAbrirGaveta);

        radioButtonConnectPrinterIntern = findViewById(R.id.radioButtonConnectPrinterIntern);

        radioButtonConnectPrinterIntern.setChecked(true);
        radioGroupConnectPrinterIE = findViewById(R.id.radioGroupConnectPrinterIE);
        radioGroupConnectPrinterIE.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @SuppressLint("NonConstantResourceId")
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                switch (checkedId) {
                    case R.id.radioButtonConnectPrinterIntern:
                        printer.printerInternalImpStart();
                        break;

                    case R.id.radioButtonConnectPrinterExtern:
                        if(isIpValid(editTextInputIP.getText().toString())){
                            connectExternPrinter(editTextInputIP.getText().toString());
                        }else{
                            alertMessageStatus("Digite um IP válido.");
                            radioButtonConnectPrinterIntern.setChecked(true);
                        }
                        break;
                }
            }
        });

        buttonPrinterTextSelected.setBackgroundTintList(AppCompatResources.getColorStateList(context, R.color.azul));

        buttonPrinterTextSelected.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                buttonPrinterTextSelected.setBackgroundTintList(AppCompatResources.getColorStateList(context, R.color.azul));
                buttonPrinterBarCodeSelected.setBackgroundTintList(AppCompatResources.getColorStateList(context, R.color.black));
                buttonPrinterImageSelected.setBackgroundTintList(AppCompatResources.getColorStateList(context, R.color.black));
                showPrinterTextScreen();
            }
        });

        buttonPrinterBarCodeSelected.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                buttonPrinterTextSelected.setBackgroundTintList(AppCompatResources.getColorStateList(context, R.color.black));
                buttonPrinterBarCodeSelected.setBackgroundTintList(AppCompatResources.getColorStateList(context, R.color.azul));
                buttonPrinterImageSelected.setBackgroundTintList(AppCompatResources.getColorStateList(context, R.color.black));
                showPrinterBarCodeScreen();
            }
        });

        buttonPrinterImageSelected.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                buttonPrinterTextSelected.setBackgroundTintList(AppCompatResources.getColorStateList(context, R.color.black));
                buttonPrinterBarCodeSelected.setBackgroundTintList(AppCompatResources.getColorStateList(context, R.color.black));
                buttonPrinterImageSelected.setBackgroundTintList(AppCompatResources.getColorStateList(context, R.color.azul));
                showPrinterImageScreen();
            }
        });

        buttonStatusPrinter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                statusPrinter();
            }
        });

        buttonStatusGaveta.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { statusGaveta(); }
        });

        buttonAbrirGaveta.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { abrirGaveta(); }
        });
    }

    public void connectExternPrinter(String ip){
        String[] ipAndPort = ip.split(":");
        int result = printer.printerExternalImpStart(ipAndPort[0], Integer.parseInt(ipAndPort[1]));
        System.out.println("RESULT EXTERN: " + result);
    }

    public void showPrinterTextScreen(){
        FragmentPrinterText firstFragment = new FragmentPrinterText();
        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        transaction.replace(R.id.containerFragments, firstFragment);
        transaction.commit();
    }

    public void showPrinterBarCodeScreen(){
        FragmentPrinterBarCode barCodeFragment = new FragmentPrinterBarCode();
        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        transaction.replace(R.id.containerFragments, barCodeFragment);
        transaction.commit();
    }

    public void showPrinterImageScreen(){
        FragmentPrinterImage barCodeFragment = new FragmentPrinterImage();
        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        transaction.replace(R.id.containerFragments, barCodeFragment);
        transaction.commit();
    }

    public void statusPrinter(){
        String statusPrinter = "";
        int resultStatus = printer.statusSensorPapel();
        System.out.println("STATUS GAVETA: " + printer.statusGaveta());

        if(resultStatus == 5){
            statusPrinter = "Papel está presente e não está próximo do fim!";
        }else if(resultStatus == 6){
            statusPrinter = "Papel próximo do fim!";
        }else if(resultStatus == 7){
            statusPrinter = "Papel ausente!";
        }else {
            statusPrinter = "Status Desconhecido!";
        }

        alertMessageStatus(statusPrinter);
    }

    private void statusGaveta(){
        String statusGaveta = "";

        int resultStatusGaveta = printer.statusGaveta();

        if(resultStatusGaveta == 1){
            statusGaveta = "Gaveta aberta!";
        }else if(resultStatusGaveta == 2){
            statusGaveta = "Gaveta fechada!";
        }else {
            statusGaveta = "Status Desconhecido!";
        }

        alertMessageStatus(statusGaveta);
    }

    private int abrirGaveta(){
        int resultStatusGaveta = printer.abrirGaveta();
        return resultStatusGaveta;
    }

    public void alertMessageStatus(String messageAlert){
        AlertDialog alertDialog = new AlertDialog.Builder(PrinterMenu.printer.mActivity).create();
        alertDialog.setTitle("Alert");
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
        Pattern pattern = Pattern.compile("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$");

        Matcher matcher = pattern.matcher(ip);

        return matcher.matches();
    }

}