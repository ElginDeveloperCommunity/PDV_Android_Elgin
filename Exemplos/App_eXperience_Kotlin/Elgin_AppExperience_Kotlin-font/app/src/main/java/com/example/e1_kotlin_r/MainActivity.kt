package com.example.e1_kotlin_r

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.example.e1_kotlin_r.NFCE.NfcePage


class MainActivity : AppCompatActivity() {

    //LinearLayout foram escolhidos em vez de button para simplificar a decoração.
    lateinit var buttonPrinterOption: LinearLayout
    lateinit var buttonTefOption: LinearLayout
    lateinit var buttonBarCodeReaderOption: LinearLayout
    lateinit var buttonSAT: LinearLayout
    lateinit var buttonShipay: LinearLayout
    lateinit var buttonBalancaOption: LinearLayout
    lateinit var buttonE1Bridge: LinearLayout
    lateinit var buttonNfce: LinearLayout
    lateinit var buttonPix4: LinearLayout

    private val REQUEST_CODE_WRITE_EXTERNAL_STORAGE = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        buttonNfce = findViewById(R.id.buttonNfce)
        buttonPrinterOption = findViewById(R.id.buttonPrinterOption)
        buttonTefOption = findViewById(R.id.buttonTefOption)
        buttonBarCodeReaderOption = findViewById(R.id.buttonBarCodeReaderOption)
        buttonSAT = findViewById(R.id.buttonSAT)
        buttonShipay = findViewById(R.id.buttonShipay)
        buttonBalancaOption = findViewById(R.id.buttonBalancaOption)
        buttonE1Bridge = findViewById(R.id.buttonE1Bridge)
        buttonPix4 = findViewById(R.id.buttonPix4)

        buttonPrinterOption.setOnClickListener({ openPrinterScreen() })
        buttonTefOption.setOnClickListener({ openTefScreen() })
        buttonBarCodeReaderOption.setOnClickListener({ openBarCodeReaderScreen() })
        buttonSAT.setOnClickListener({ openSATScreen() })
        buttonShipay.setOnClickListener({ openShipayScreen() })
        buttonBalancaOption.setOnClickListener({ openBalancaScreen() })
        buttonE1Bridge.setOnClickListener({openBridgeScreen()})
        buttonNfce.setOnClickListener({openNfce()})
        buttonPix4.setOnClickListener ({openPix4Screen()})

        askWriteExternalStoragePermission();
    }

    //Pede a permissão de escrita no diretório externo
    private fun askWriteExternalStoragePermission() {
        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
            REQUEST_CODE_WRITE_EXTERNAL_STORAGE
        )
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        //Impede que a aplicação continue caso a permissão seja negada, uma vez que vários módulos dependem da permissão de acesso ao armazenamento
        if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.size > 0 && grantResults[0] == PackageManager.PERMISSION_DENIED) {
            Toast.makeText(
                this,
                "É necessário conceder a permissão para as funcionalidades NFC-e e PIX 4!",
                Toast.LENGTH_LONG
            ).show()
            closeApplication()
        }
    }

    //Força o fechamento da aplicação
    private fun closeApplication() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) finishAffinity() else finish()
    }

    fun openPrinterScreen() {
        val intent = Intent(this, PrinterMenu::class.java)
        startActivity(intent)
    }

    fun openNfce() {
        val intent = Intent(this, NfcePage::class.java)
        startActivity(intent)
    }

    fun openTefScreen() {
        val intent = Intent(this, Tef::class.java)
        startActivity(intent)
    }

    fun openBarCodeReaderScreen() {
        val intent = Intent(this, BarCodeReader::class.java)
        startActivity(intent)
    }

    fun openSATScreen() {
        val intent = Intent(this, SatPage::class.java)
        startActivity(intent)
    }

    fun openShipayScreen() {
        val intent = Intent(this, ShipayMenu::class.java)
        startActivity(intent)
    }

    fun openBalancaScreen() {
        val intent = Intent(this, BalancaPage::class.java)
        startActivity(intent)
    }

    fun openBridgeScreen() {
        val intent = Intent( this, E1BridgePage::class.java)
        startActivity(intent)
    }

    fun openPix4Screen() {
        val intent = Intent(this, Pix4Page::class.java)
        startActivity(intent)
    }

}