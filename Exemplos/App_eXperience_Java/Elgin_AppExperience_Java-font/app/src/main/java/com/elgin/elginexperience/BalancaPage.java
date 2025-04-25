package com.elgin.elginexperience;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;

import com.elgin.elginexperience.Services.BalancaService;

import java.util.HashMap;
import java.util.Map;

public class BalancaPage extends AppCompatActivity {
    public BalancaService balanca;

    TextView textReturnValueBalanca;

    RadioGroup radioGroupModels;
    RadioButton radioButtonDP30CK;

    Spinner spinnerProtocols;

    Button buttonConfigurarBalanca;
    Button buttonLerPeso;

    String typeModel = "DP30CK";
    String typeProtocol = "PROTOCOL 0";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_balanca_page);

        balanca = new BalancaService(this);

        textReturnValueBalanca = findViewById(R.id.textReturnValueBalanca);
        radioButtonDP30CK = findViewById(R.id.radioButtonDP30CK);
        spinnerProtocols = findViewById(R.id.spinnerProtocols);
        buttonConfigurarBalanca = findViewById(R.id.buttonConfigurarBalanca);
        buttonLerPeso = findViewById(R.id.buttonLerPeso);


        //CONFIGS MODEL BALANÇA
        radioButtonDP30CK.setChecked(true);
        radioGroupModels = findViewById(R.id.radioGroupModels);
        radioGroupModels.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @SuppressLint("NonConstantResourceId")
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                if (checkedId == R.id.radioButtonDP30CK) {
                    typeModel = "DP30CK";
                } else if (checkedId == R.id.radioButtonSA110) {
                    typeModel = "SA110";
                } else if (checkedId == R.id.radioButtonDPSC) {
                    typeModel = "DPSC";
                }
            }
        });

        //CONFIGS PROTOCOLS
        spinnerProtocols.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onNothingSelected(AdapterView<?> parent) { }

            @Override
            public void onItemSelected(AdapterView adapter, View v, int i, long lng) {
                typeProtocol = adapter.getItemAtPosition(i).toString();
            }
        });

        buttonConfigurarBalanca.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendConfigBalanca();
            }
        });

        buttonLerPeso.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { sendLerPesoBalanca(); }
        });
    }

    public void sendConfigBalanca(){
        Map<String, Object> mapValues = new HashMap<>();
        mapValues.put("model", typeModel);
        mapValues.put("protocol", typeProtocol);
        
        balanca.configBalanca(mapValues);
    }

    public void sendLerPesoBalanca(){
        String retorno = balanca.lerPesoBalanca();
        textReturnValueBalanca.setText(retorno);
    }
}