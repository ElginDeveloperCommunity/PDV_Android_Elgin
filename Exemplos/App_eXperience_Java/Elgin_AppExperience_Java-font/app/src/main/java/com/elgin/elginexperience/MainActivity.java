package com.elgin.elginexperience;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

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
    LinearLayout buttonPix4;
    LinearLayout buttonKiosk;

    private final static int REQUEST_CODE_WRITE_EXTERNAL_STORAGE = 1;

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
        buttonPix4 = findViewById(R.id.buttonPix4);
        buttonKiosk = findViewById(R.id.buttonKioskMode);

        buttonE1Bridge.setOnClickListener(view -> openE1BridgeScreen());

        buttonNfce.setOnClickListener(view -> openNfceScreen());

        buttonPrinterOption.setOnClickListener(v -> openPrinterScreen());

        buttonTefOption.setOnClickListener(v -> openTefScreen());

        buttonBarCodeReaderOption.setOnClickListener(v -> openBarCodeReaderScreen());

        buttonSAT.setOnClickListener(v -> openSATScreen());

        buttonShipay.setOnClickListener(v -> openShipayScreen());

        buttonBalancaOption.setOnClickListener(v -> openBalancaScreen());

        buttonPix4.setOnClickListener(v -> openPix4Screen());

        buttonKiosk.setOnClickListener(v -> openKioskMode());

        initializeArrowsFunctionality();

        // Para o módulo do PIX 4 é necessário a permissão para salvar imagens no diretório externo do dispositivo.
        askWriteExternalStoragePermission();
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

    public void openPix4Screen() {
        Intent intent = new Intent(this, Pix4Page.class);
        startActivity(intent);
    }

    public void openKioskMode() {
        Intent intent = new Intent(this, KioskMode.class);
        startActivity(intent);
    }

    // Inicia o funcionamento das setas na scroll view.
    private void initializeArrowsFunctionality() {
        final ImageView leftArrow = findViewById(R.id.leftArrow);
        final ImageView rightArrow = findViewById(R.id.rightArrow);

        final HorizontalScrollView hs = findViewById(R.id.modulesScrollList);
        hs.setOnScrollChangeListener(
                (horizontalScrollerRef, newX, newY, oldX, oldY) -> {
                    final int maxScrollValue = ((HorizontalScrollView) horizontalScrollerRef).getChildAt(0).getMeasuredWidth() - horizontalScrollerRef.getMeasuredWidth();
                    final int minScrollValue = 0;

                    if (newX >= maxScrollValue) {
                        // Mostrar apenas a seta para esquerda.
                        leftArrow.setVisibility(View.VISIBLE);
                        rightArrow.setVisibility(View.INVISIBLE);
                    } else if (newX == minScrollValue) {
                        // Mostrar apenas a seta para direita.
                        leftArrow.setVisibility(View.INVISIBLE);
                        rightArrow.setVisibility(View.VISIBLE);
                    } else {
                        // Mostrar ambas as setas.
                        leftArrow.setVisibility(View.VISIBLE);
                        rightArrow.setVisibility(View.VISIBLE);
                    }
                }
        );
    }

    // Pede a permissão de escrita no diretório externo.
    private void askWriteExternalStoragePermission() {
        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_CODE_WRITE_EXTERNAL_STORAGE);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        // Impede que a aplicação continue caso a permissão seja negada, uma vez que vários módulos dependem da permissão de acesso ao armazenamento.
        if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_DENIED) {
            Toast.makeText(this, "É necessário conceder a permissão para as funcionalidades NFC-e e PIX 4!", Toast.LENGTH_LONG).show();
            closeApplication();
        }
    }

    // Força o fechamento da aplicação.
    private void closeApplication() {
        finishAffinity();
    }
}