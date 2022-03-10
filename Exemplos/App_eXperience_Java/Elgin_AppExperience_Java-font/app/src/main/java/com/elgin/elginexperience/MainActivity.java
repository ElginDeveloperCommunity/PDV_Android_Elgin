package com.elgin.elginexperience;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import com.google.zxing.oned.CodaBarReader;

public class MainActivity extends AppCompatActivity {
    static Context context;

    //LinearLayout foram escolhidos em vez de button para simplificar a decoração.
    LinearLayout buttonE1Bridge;
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
        buttonPrinterOption = findViewById(R.id.buttonPrinterOption);
        buttonBalancaOption = findViewById(R.id.buttonBalancaOption);
        buttonTefOption = findViewById(R.id.buttonTefOption);
        buttonShipay = findViewById(R.id.buttonShipay);
        buttonSAT = findViewById(R.id.buttonSAT);
        buttonBarCodeReaderOption = findViewById(R.id.buttonBarCodeReaderOption);

        buttonE1Bridge.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) { openE1BridgeScreen(); }
        });

        buttonPrinterOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { openPrinterScreen(); }
        });

        buttonTefOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { openTefScreen(); }
        });

        buttonBarCodeReaderOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { openBarCodeReaderScreen(); }
        });

        buttonSAT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { openSATScreen(); }
        });

        buttonShipay.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { openShipayScreen(); }
        });

        buttonBalancaOption.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { openBalancaScreen(); }
        });
    }

    public void openE1BridgeScreen(){
        Intent intent = new Intent(this, E1BridgePage.class);
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

    public void openBarCodeReaderScreen(){
        Intent intent = new Intent(this, BarCodeReader.class);
        startActivity(intent);
    }

    public void openSATScreen(){
        Intent intent = new Intent(this, SatPage.class);
        startActivity(intent);
    }

    public void openShipayScreen() {
        Intent intent = new Intent(this, ShipayMenu.class);
            startActivity(intent);
    }

    public void openBalancaScreen(){
        Intent intent = new Intent(this, BalancaPage.class);
        startActivity(intent);
    }
}