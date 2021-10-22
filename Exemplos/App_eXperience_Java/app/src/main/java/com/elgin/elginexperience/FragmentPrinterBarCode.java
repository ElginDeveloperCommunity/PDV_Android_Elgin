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

import java.util.HashMap;
import java.util.Map;

public class FragmentPrinterBarCode extends Fragment {
    //DECLARE EDIT TEXT
    EditText editTextInputBarCode;

    //DECLARE SPINNER
    Spinner spinnerBarCodeType;
    Spinner spinnerBarCodeWidth;
    Spinner spinnerBarCodeHeight;

    //DECLARE RADIO BUTTONS
    RadioGroup radioGroupAlignBarCode;
    RadioButton buttonRadioAlignCenter;

    //DECLARE CHECKBOX;
    CheckBox checkBoxIsCutPaperBarCode;

    //DECLARE BUTTONS
    Button buttonPrinterBarCode;

    //DECLARE VALUES CONFIGS
    String typeOfBarCode = "EAN 8";
    String typAlignOfBarCode = "Centralizado";
    int widthOfBarCode = 1;
    int heightOfBarCode = 20;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.activity_fragment_printer_bar_code, container, false);

        //INIT EDIT TEXT
        editTextInputBarCode = v.findViewById(R.id.editTextInputBarCode);
        editTextInputBarCode.setText("40170725");

        //INIT RADIOS, SPINNER AND BUTTONS
        spinnerBarCodeType = v.findViewById(R.id.spinnerBarCodeType);
        buttonRadioAlignCenter = v.findViewById(R.id.radioButtonBarCodeAlignCenter);
        spinnerBarCodeWidth = v.findViewById(R.id.spinnerBarCodeWidth);
        spinnerBarCodeHeight = v.findViewById(R.id.spinnerBarCodeHeight);
        checkBoxIsCutPaperBarCode = v.findViewById(R.id.checkBoxCutPaper);
        buttonPrinterBarCode = v.findViewById(R.id.buttonPrintBarCode);

        //CONFIGS FONT FAMILY
        spinnerBarCodeType.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onNothingSelected(AdapterView<?> parent) { }

            @Override
            public void onItemSelected(AdapterView adapter, View v, int i, long lng) {
                typeOfBarCode = adapter.getItemAtPosition(i).toString();
                setTypeCodeMessage(typeOfBarCode);
            }
        });

        //CONFIGS ALIGN BAR CODE
        buttonRadioAlignCenter.setChecked(true);
        radioGroupAlignBarCode = v.findViewById(R.id.radioGroupAlignBarCode);
        radioGroupAlignBarCode.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @SuppressLint("NonConstantResourceId")
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                switch (checkedId) {
                    case R.id.radioButtonBarCodeAlignLeft:
                        typAlignOfBarCode = "Esquerda";
                        System.out.println(typAlignOfBarCode);
                        break;
                    case R.id.radioButtonBarCodeAlignCenter:
                        typAlignOfBarCode = "Centralizado";
                        System.out.println(typAlignOfBarCode);
                        break;
                    case R.id.radioButtonBarCodeAlignRight:
                        typAlignOfBarCode = "Direita";
                        System.out.println(typAlignOfBarCode);
                        break;
                }
            }
        });

        //CONFIGS WIDTH BAR CODE
        spinnerBarCodeWidth.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onNothingSelected(AdapterView<?> parent) { }

            @Override
            public void onItemSelected(AdapterView adapter, View v, int i, long lng) {
                widthOfBarCode = Integer.parseInt(adapter.getItemAtPosition(i).toString());
            }
        });

        //CONFIGS HEIGHT BAR CODE
        spinnerBarCodeHeight.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onNothingSelected(AdapterView<?> parent) { }

            @Override
            public void onItemSelected(AdapterView adapter, View v, int i, long lng) {
                heightOfBarCode = Integer.parseInt(adapter.getItemAtPosition(i).toString());
            }
        });

        //BUTTON PRINT BAR CODE CLICKED
        buttonPrinterBarCode.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(typeOfBarCode.equals("QR CODE")){
                    sendPrinterQrCode();
                }else{
                    sendPrinterBarCode();
                }
            }
        });

        return v;
    }

    public void setTypeCodeMessage(String typeActual){
        switch(typeActual){
            case "EAN 8":
                editTextInputBarCode.setText("40170725");
                break;
            case "EAN 13":
                editTextInputBarCode.setText("0123456789012");
                break;
            case "QR CODE":
                editTextInputBarCode.setText("ELGIN DEVELOPERS COMMUNITY");
                break;
            case "UPC-A":
                editTextInputBarCode.setText("123601057072");
                break;
            case "UPC-E":
                editTextInputBarCode.setText("00123457");
                break;
            case "CODE 39":
                editTextInputBarCode.setText("*ABC123*");
                break;
            case "ITF":
                editTextInputBarCode.setText("05012345678900");
                break;
            case "CODE BAR":
                editTextInputBarCode.setText("A3419500A");
                break;
            case "CODE 93":
                editTextInputBarCode.setText("ABC123456789");
                break;
            case "CODE 128":
                editTextInputBarCode.setText("{C1233");
                break;
        }
    }

    public void sendPrinterBarCode(){
        Map<String, Object> mapValues = new HashMap<>();

        if(editTextInputBarCode.getText().toString().equals("")) {
            alertMessage();
        }else{
            mapValues.put("barCodeType", typeOfBarCode);
            mapValues.put("text", editTextInputBarCode.getText().toString());
            mapValues.put("height", heightOfBarCode);
            mapValues.put("width", widthOfBarCode);
            mapValues.put("align", typAlignOfBarCode);

            int result = PrinterMenu.printer.imprimeBarCode(mapValues);
            System.out.println("RESULT BAR CODE: " + result);
            jumpLine();
            if (checkBoxIsCutPaperBarCode.isChecked()) cutPaper();
        }
    }

    public void sendPrinterQrCode(){
        Map<String, Object> mapValues = new HashMap<>();

        if(editTextInputBarCode.getText().toString().equals("")) {
            alertMessage();
        }else{
            mapValues.put("qrSize", widthOfBarCode);
            mapValues.put("text", editTextInputBarCode.getText().toString());
            mapValues.put("align", typAlignOfBarCode);

            PrinterMenu.printer.imprimeQR_CODE(mapValues);
            jumpLine();
            if (checkBoxIsCutPaperBarCode.isChecked()) cutPaper();
        }
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
        alertDialog.setMessage("Campo código vazio.");
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
        alertDialog.show();
    }
}