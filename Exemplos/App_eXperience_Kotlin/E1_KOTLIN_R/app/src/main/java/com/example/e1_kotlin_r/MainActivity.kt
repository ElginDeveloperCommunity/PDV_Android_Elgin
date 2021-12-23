package com.example.e1_kotlin_r

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity


class MainActivity : AppCompatActivity() {
    lateinit var buttonPrinterOption: Button
    lateinit var buttonTefOption: Button
    lateinit var buttonBarCodeReaderOption: Button
    lateinit var buttonSAT: Button
    lateinit var buttonShipay: Button
    lateinit var buttonBalancaOption: Button
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        context = this
        buttonPrinterOption = findViewById(R.id.buttonPrinterOption)
        buttonTefOption = findViewById(R.id.buttonTefOption)
        buttonBarCodeReaderOption = findViewById(R.id.buttonBarCodeReaderOption)
        buttonSAT = findViewById(R.id.buttonSAT)
        buttonShipay = findViewById(R.id.buttonShipay)
        buttonBalancaOption = findViewById(R.id.buttonBalancaOption)
        buttonPrinterOption.setOnClickListener({ openPrinterScreen() })
        buttonTefOption.setOnClickListener({ openTefScreen() })
        buttonBarCodeReaderOption.setOnClickListener({ openBarCodeReaderScreen() })
        buttonSAT.setOnClickListener({ openSATScreen() })
        buttonShipay.setOnClickListener({ openShipayScreen() })
        buttonBalancaOption.setOnClickListener({ openBalancaScreen() })
    }

    fun openPrinterScreen() {
        val intent = Intent(this, PrinterMenu::class.java)
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

    companion object {
        var context: Context? = null
    }
}