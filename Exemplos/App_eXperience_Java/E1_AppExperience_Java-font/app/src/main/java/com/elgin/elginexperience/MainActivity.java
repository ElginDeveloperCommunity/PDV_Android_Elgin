package com.elgin.elginexperience;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.google.zxing.oned.CodaBarReader;

public class MainActivity extends AppCompatActivity {
    static Context context;

    Button buttonPrinterOption;
    Button buttonTefOption;
    Button buttonBarCodeReaderOption;
    Button buttonSAT;
    Button buttonShipay;
    Button buttonBalancaOption;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        context = this;

        buttonPrinterOption = findViewById(R.id.buttonPrinterOption);
        buttonTefOption = findViewById(R.id.buttonTefOption);
        buttonBarCodeReaderOption = findViewById(R.id.buttonBarCodeReaderOption);
        buttonSAT = findViewById(R.id.buttonSAT);
        buttonShipay = findViewById(R.id.buttonShipay);
        buttonBalancaOption = findViewById(R.id.buttonBalancaOption);

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