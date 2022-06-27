package com.elgin.intent_digital_hub;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.elgin.intent_digital_hub.Bridge.BridgeActivity;
import com.elgin.intent_digital_hub.Printer.PrinterActivity;
import com.elgin.intent_digital_hub.SAT.SATActivity;

public class MainActivity extends AppCompatActivity {

    private final static int REQUEST_CODE_WRITE_EXTERNAL_STORAGE = 1;
    private LinearLayout buttonBridge;
    private LinearLayout buttonPrinter;
    private LinearLayout buttonSat;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        buttonBridge = findViewById(R.id.buttonBridge);
        buttonPrinter = findViewById(R.id.buttonPrinter);
        buttonSat = findViewById(R.id.buttonSAT);

        buttonBridge.setOnClickListener(v -> ActivityUtils.startNewActivity(this, BridgeActivity.class));
        buttonPrinter.setOnClickListener(v -> ActivityUtils.startNewActivity(this, PrinterActivity.class));
        buttonSat.setOnClickListener(v -> ActivityUtils.startNewActivity(this, SATActivity.class));

        //Pede a permissão ao início da aplicação
        askWriteExternalStoragePermission();
    }

    //Pede a permissão de escrita no diretório externo
    private void askWriteExternalStoragePermission() {
        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_CODE_WRITE_EXTERNAL_STORAGE);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        //Impede que a aplicação continue caso a permissão seja negada, uma vez que vários módulos dependem da permissão de acesso ao armazenamento
        if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_DENIED) {
            Toast.makeText(this, "É necessário conceder a permissão para várias funcionalidades da aplicação!", Toast.LENGTH_LONG).show();
            closeApplication();
        }
    }

    //Força o fechamento da aplicação
    private void closeApplication() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN)
            finishAffinity();
        else
            finish();
    }

}