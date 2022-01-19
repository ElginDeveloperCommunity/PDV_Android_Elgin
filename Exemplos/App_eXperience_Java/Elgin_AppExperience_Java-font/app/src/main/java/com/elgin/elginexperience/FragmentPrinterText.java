package com.elgin.elginexperience;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.Fragment;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

public class FragmentPrinterText extends Fragment {
    //DECLARE BUTTONS
    Button buttonPrinter;
    Button buttonPrinterXMLNFCe;
    Button buttonPrinterXMLSAT;

    //DECLARE RADIO BUTTONS
    RadioGroup radioGroupAlign;
    RadioButton buttonRadioCenter;

    //DECLARE EDIT TEXT
    EditText editTextInputMessage;

    //DECLARE SPINNER
    Spinner spinnerFontFamily;
    Spinner spinnerFontSize;

    //DECLARE CHECKBOX
    CheckBox checkBoxIsBold;
    CheckBox checkBoxIsUnderLine;
    CheckBox checkBoxIsCutPaper;

    String typeOfAlignment = "Centralizado";
    String typeOfFontFamily = "FONT A";
    int typeOfFontSize = 17;
    String xmlNFCe = "xmlnfce";
    String xmlSAT = "xmlsat";

    //PARAMS DEFAULT TO PRINT XML NFCe AND SAT
    public static int INDEXCSC = 1;
    public static String CSC = "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES";
    public static int PARAM = 0;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.activity_fragment_printer_text, container, false);

        //INIT EDIT TEXT
        editTextInputMessage = v.findViewById(R.id.editTextInputMessage);
        editTextInputMessage.setText("ELGIN DEVELOPERS COMMUNITY");

        //INIT RADIOS, SPINNER AND BUTTONS
        radioGroupAlign = v.findViewById(R.id.radioGroupAlign);
        buttonRadioCenter = v.findViewById(R.id.radioButtonCenter);
        spinnerFontFamily = v.findViewById(R.id.spinnerFontFamily);
        spinnerFontSize = v.findViewById(R.id.spinnerFontSize);
        checkBoxIsBold = v.findViewById(R.id.checkBoxBold);
        checkBoxIsUnderLine = v.findViewById(R.id.checkBoxUnderline);
        checkBoxIsCutPaper = v.findViewById(R.id.checkBoxCutPaper);
        buttonPrinter = v.findViewById(R.id.buttonPrinterText);
        buttonPrinterXMLNFCe = v.findViewById(R.id.buttonPrinterNFCe);
        buttonPrinterXMLSAT = v.findViewById(R.id.buttonPrinterSAT);

        //BUTTON PRINT TEXT CLICKED
        buttonPrinter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { printText(); }
        });

        //BUTTON PRINT XML NFCe
        buttonPrinterXMLNFCe.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    printXmlNFCe();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });

        //BUTTON PRINT XML NFCe
        buttonPrinterXMLSAT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    printXmlSAT();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });

        //CONFIGS ALIGN TEXT
        buttonRadioCenter.setChecked(true);
        radioGroupAlign = v.findViewById(R.id.radioGroupAlign);
        radioGroupAlign.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @SuppressLint("NonConstantResourceId")
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                switch (checkedId) {
                    case R.id.radioButtonLeft:
                        typeOfAlignment = "Esquerda";
                        break;
                    case R.id.radioButtonCenter:
                        typeOfAlignment = "Centralizado";
                        break;
                    case R.id.radioButtonRight:
                        typeOfAlignment = "Direita";
                        break;
                }
            }
        });

        //CONFIGS FONT FAMILY
        spinnerFontFamily.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onNothingSelected(AdapterView<?> parent) { }

            @Override
            public void onItemSelected(AdapterView adapter, View v, int i, long lng) {
                typeOfFontFamily = adapter.getItemAtPosition(i).toString();
                System.out.println("FONT FAMILY: " + typeOfFontFamily + " " + String.valueOf(checkBoxIsUnderLine.isChecked()));
            }
        });

        //CONFIGS FONT SIZE
        spinnerFontSize.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onNothingSelected(AdapterView<?> parent) { }

            @Override
            public void onItemSelected(AdapterView adapter, View v, int i, long lng) {
                typeOfFontSize = Integer.parseInt(adapter.getItemAtPosition(i).toString());
            }
        });

        return v;
    }

    public void printText(){
        Map<String, Object> mapValues = new HashMap<>();

        if(editTextInputMessage.getText().toString().equals("")) {
            alertMessage();
        }else{
            mapValues.put("text", editTextInputMessage.getText().toString());
            mapValues.put("align", typeOfAlignment);
            mapValues.put("font", typeOfFontFamily);
            mapValues.put("fontSize", typeOfFontSize);
            mapValues.put("isBold", checkBoxIsBold.isChecked());
            mapValues.put("isUnderline", checkBoxIsUnderLine.isChecked());

            PrinterMenu.printer.imprimeTexto(mapValues);
            jumpLine();
            if (checkBoxIsCutPaper.isChecked()) cutPaper();
        }
    }

    public void printXmlNFCe() throws IOException {
        String stringXMLNFCe;

        InputStream ins = MainActivity.context.getResources().openRawResource(
                MainActivity.context.getResources().getIdentifier(
                        xmlNFCe,
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
        stringXMLNFCe = sb.toString();

        Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("xmlNFCe", stringXMLNFCe);
        mapValues.put("indexcsc", INDEXCSC);
        mapValues.put("csc", CSC);
        mapValues.put("param", PARAM);

        PrinterMenu.printer.imprimeXMLNFCe(mapValues);

        System.out.println("XML NFCE: " + stringXMLNFCe);
        jumpLine();
        if (checkBoxIsCutPaper.isChecked()) cutPaper();
    }

    public void printXmlSAT() throws IOException {
        String stringXMLSat;

        InputStream ins = MainActivity.context.getResources().openRawResource(
                MainActivity.context.getResources().getIdentifier(
                        xmlSAT,
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

        mapValues.put("xmlSAT", stringXMLSat);
        mapValues.put("param", PARAM);

        PrinterMenu.printer.imprimeXMLSAT(mapValues);

        jumpLine();
        if (checkBoxIsCutPaper.isChecked()) cutPaper();
    }

    public void jumpLine(){
        Map<String, Object> mapValues = new HashMap<>();
        mapValues.put("quant", 10);
        PrinterMenu.printer.AvancaLinhas(mapValues);
    }

    public void cutPaper(){
        Map<String, Object> mapValues = new HashMap<>();
        mapValues.put("quant", 10);
        PrinterMenu.printer.cutPaper(mapValues);
    }

    public void alertMessage(){
        AlertDialog alertDialog = new AlertDialog.Builder(PrinterMenu.printer.mActivity).create();
        alertDialog.setTitle("Alert");
        alertDialog.setMessage("Campo Mensagem vazio.");
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
        alertDialog.show();
    }
}