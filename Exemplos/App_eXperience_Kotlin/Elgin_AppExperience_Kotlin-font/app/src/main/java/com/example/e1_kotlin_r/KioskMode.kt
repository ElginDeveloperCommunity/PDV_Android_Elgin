package com.example.e1_kotlin_r

import android.os.Bundle
import android.os.PersistableBundle
import android.view.View
import android.widget.Button
import android.widget.CompoundButton
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SwitchCompat
import com.elgin.elginexperience.Services.KioskModeService
import com.elgin.elginexperience.Services.KioskModeService.KIOSK_CONFIG

class KioskMode : AppCompatActivity() {

    private var kioskServiceObj: KioskModeService? = null

    private var switchNavigationBar: SwitchCompat? = null
    private var switchStatusBar: SwitchCompat? = null
    private var switchPowerButton: SwitchCompat? = null

    private lateinit var buttonBack : Button
    private lateinit var buttonFullKioskMode : Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_kiosk_mode)

        kioskServiceObj = KioskModeService(this)

        viewsAssignment()
    }


    // Registra que ao sair da aplicação quaisquer configuração aplicadas sejam desfeitas, para impedir que o dispositivo perca alguma funcionalidade essencial para a navegação/configuração.
    override fun onPause() {
        super.onPause()
        kioskServiceObj?.resetKioskMode()
    }

    private fun viewsAssignment() {
        switchNavigationBar = findViewById<SwitchCompat>(R.id.switchNavigationBar)
        switchStatusBar = findViewById<SwitchCompat>(R.id.switchStatusBar)
        switchPowerButton = findViewById<SwitchCompat>(R.id.switchPowerButtonr)
        switchNavigationBar?.setOnCheckedChangeListener(CompoundButton.OnCheckedChangeListener { compoundButton: CompoundButton?, isChecked: Boolean ->
            kioskServiceObj!!.executeKioskOperation(
                KIOSK_CONFIG.BARRA_NAVEGACAO,
                isChecked
            )
        })
        switchStatusBar?.setOnCheckedChangeListener(CompoundButton.OnCheckedChangeListener { compoundButton: CompoundButton?, isChecked: Boolean ->
            kioskServiceObj!!.executeKioskOperation(
                KIOSK_CONFIG.BARRA_STATUS,
                isChecked
            )
        })
        switchPowerButton?.setOnCheckedChangeListener(CompoundButton.OnCheckedChangeListener { compoundButton: CompoundButton?, isChecked: Boolean ->
            kioskServiceObj!!.executeKioskOperation(
                KIOSK_CONFIG.BOTAO_POWER,
                isChecked
            )
        })
        buttonBack = findViewById<Button>(R.id.buttonBack)
        buttonBack.setOnClickListener(View.OnClickListener { v: View? -> finish() })
        buttonFullKioskMode = findViewById<Button>(R.id.buttonFullKioskMode)
        buttonFullKioskMode.setOnClickListener(View.OnClickListener { v: View? -> setFullKioskMode() })
    }

    // Ao forçar o "descheque" de todos os switches, todos os callbacks serão executados, logo, todas as operações de kiosk disponíveis serão executadas.
    private fun setFullKioskMode() {
        switchNavigationBar!!.setChecked(false)
        switchStatusBar!!.setChecked(false)
        switchPowerButton!!.setChecked(false)
    }

}