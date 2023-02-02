package com.elgin.elginexperience;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SwitchCompat;

import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.Toast;
import android.widget.ToggleButton;

import com.elgin.elginexperience.Services.KioskModeService;

import static com.elgin.elginexperience.Services.KioskModeService.KIOSK_CONFIG.*;

public class KioskMode extends AppCompatActivity {

    private static KioskModeService kioskServiceObj;

    private SwitchCompat switchNavigationBar, switchStatusBar, switchPowerButton;

    private Button buttonBack, buttonFullKioskMode;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_kiosk_mode);

        kioskServiceObj = new KioskModeService(this);

        viewsAssignment();
    }

    // Registra que ao sair da aplicação quaisquer configuração aplicadas sejam desfeitas, para impedir que o dispositivo perca alguma funcionalidade essencial para a navegação/configuração.
    @Override
    protected void onPause() {
        super.onPause();

        kioskServiceObj.resetKioskMode();
    }

    private void viewsAssignment() {
        switchNavigationBar = findViewById(R.id.switchNavigationBar);
        switchStatusBar = findViewById(R.id.switchStatusBar);
        switchPowerButton = findViewById(R.id.switchPowerButtonr);

        switchNavigationBar.setOnCheckedChangeListener((compoundButton, isChecked) -> kioskServiceObj.executeKioskOperation(BARRA_NAVEGACAO, isChecked));

        switchStatusBar.setOnCheckedChangeListener((compoundButton, isChecked) -> kioskServiceObj.executeKioskOperation(BARRA_STATUS, isChecked));

        switchPowerButton.setOnCheckedChangeListener((compoundButton, isChecked) -> kioskServiceObj.executeKioskOperation(BOTAO_POWER, isChecked));

        buttonBack = findViewById(R.id.buttonBack);
        buttonBack.setOnClickListener(v -> finish());

        buttonFullKioskMode = findViewById(R.id.buttonFullKioskMode);
        buttonFullKioskMode.setOnClickListener(v -> setFullKioskMode());
    }

    // Ao forçar o "descheque" de todos os switches, todos os callbacks serão executados, logo, todas as operações de kiosk disponíveis serão executadas.
    private void setFullKioskMode() {
        switchNavigationBar.setChecked(false);
        switchStatusBar.setChecked(false);
        switchPowerButton.setChecked(false);
    }

}