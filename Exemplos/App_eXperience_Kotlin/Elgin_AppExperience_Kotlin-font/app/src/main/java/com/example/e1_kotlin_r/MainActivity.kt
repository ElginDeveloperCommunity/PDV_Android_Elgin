package com.example.e1_kotlin_r

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import br.com.daruma.framework.mobile.gne.nfce.xml.auxiliar.Aux_XmlNfce
import com.example.e1_kotlin_r.NFCE.NfcePage


class MainActivity : AppCompatActivity() {
    lateinit var buttonPrinterOption: LinearLayout
    lateinit var buttonTefOption: LinearLayout
    lateinit var buttonBarCodeReaderOption: LinearLayout
    lateinit var buttonSAT: LinearLayout
    lateinit var buttonShipay: LinearLayout
    lateinit var buttonBalancaOption: LinearLayout
    lateinit var buttonE1Bridge: LinearLayout
    lateinit var buttonNfce: LinearLayout
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        context = this
        buttonNfce = findViewById(R.id.buttonNfce)
        buttonPrinterOption = findViewById(R.id.buttonPrinterOption)
        buttonTefOption = findViewById(R.id.buttonTefOption)
        buttonBarCodeReaderOption = findViewById(R.id.buttonBarCodeReaderOption)
        buttonSAT = findViewById(R.id.buttonSAT)
        buttonShipay = findViewById(R.id.buttonShipay)
        buttonBalancaOption = findViewById(R.id.buttonBalancaOption)
        buttonE1Bridge = findViewById(R.id.buttonE1Bridge)
        buttonPrinterOption.setOnClickListener({ openPrinterScreen() })
        buttonTefOption.setOnClickListener({ openTefScreen() })
        buttonBarCodeReaderOption.setOnClickListener({ openBarCodeReaderScreen() })
        buttonSAT.setOnClickListener({ openSATScreen() })
        buttonShipay.setOnClickListener({ openShipayScreen() })
        buttonBalancaOption.setOnClickListener({ openBalancaScreen() })
        buttonE1Bridge.setOnClickListener({openBridgeScreen()})
        buttonNfce.setOnClickListener({openNfce()})

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

    companion object {
        var context: Context? = null
    }
}