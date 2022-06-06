package com.elgin.elginexperience;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;

import com.elgin.elginexperience.NFCE.NfcePage;

public class MainActivity extends AppCompatActivity {
    static Context context;

    //LinearLayout foram escolhidos em vez de button para simplificar a decoração.
    LinearLayout buttonE1Bridge;
    LinearLayout buttonNfce;
    LinearLayout buttonPrinterOption;
    LinearLayout buttonTefOption;
    LinearLayout buttonBarCodeReaderOption;
    LinearLayout buttonSAT;
    LinearLayout buttonShipay;
    LinearLayout buttonBalancaOption;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        context = this;

        buttonE1Bridge = findViewById(R.id.buttonE1Bridge);
        buttonNfce = findViewById(R.id.buttonNfce);
        buttonPrinterOption = findViewById(R.id.buttonPrinterOption);
        buttonBalancaOption = findViewById(R.id.buttonBalancaOption);
        buttonTefOption = findViewById(R.id.buttonTefOption);
        buttonShipay = findViewById(R.id.buttonShipay);
        buttonSAT = findViewById(R.id.buttonSAT);
        buttonBarCodeReaderOption = findViewById(R.id.buttonBarCodeReaderOption);

        buttonE1Bridge.setOnClickListener(view -> openE1BridgeScreen());

        buttonNfce.setOnClickListener(view -> openNfceScreen());

        buttonPrinterOption.setOnClickListener(v -> openPrinterScreen());

        buttonTefOption.setOnClickListener(v -> openTefScreen());

        buttonBarCodeReaderOption.setOnClickListener(v -> openBarCodeReaderScreen());

        buttonSAT.setOnClickListener(v -> openSATScreen());

        buttonShipay.setOnClickListener(v -> openShipayScreen());

        buttonBalancaOption.setOnClickListener(v -> openBalancaScreen());
    }

    public void openE1BridgeScreen() {
        Intent intent = new Intent(this, E1BridgePage.class);
        startActivity(intent);
    }

    public void openNfceScreen() {
        Intent intent = new Intent(this, NfcePage.class);
        startActivity(intent);
    }

    public void openPrinterScreen() {
        Intent intent = new Intent(this, PrinterMenu.class);
        startActivity(intent);
    }

    public void openTefScreen() {
        Intent intent = new Intent(this, Tef.class);
        startActivity(intent);
    }

    public void openBarCodeReaderScreen() {
        Intent intent = new Intent(this, BarCodeReader.class);
        startActivity(intent);
    }

    public void openSATScreen() {
        Intent intent = new Intent(this, SatPage.class);
        startActivity(intent);
    }

    public void openShipayScreen() {
        Intent intent = new Intent(this, ShipayMenu.class);
        startActivity(intent);
    }

    public void openBalancaScreen() {
        Intent intent = new Intent(this, BalancaPage.class);
        startActivity(intent);
    }
}