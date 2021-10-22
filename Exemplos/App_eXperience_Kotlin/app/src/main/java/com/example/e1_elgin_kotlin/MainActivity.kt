package com.example.e1_elgin_kotlin

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    lateinit var buttonPrinterOption: Button
    lateinit var buttonTefOption: Button
    lateinit var buttonBarCodeReaderOption: Button
    lateinit var buttonSAT: Button
    lateinit var buttonBalancaOption: Button
    lateinit var buttonShipay: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        buttonPrinterOption = findViewById(R.id.buttonPrinterOption)
        buttonTefOption = findViewById(R.id.buttonTefOption)
        buttonBarCodeReaderOption = findViewById(R.id.buttonBarCodeReaderOption)
        buttonSAT = findViewById(R.id.buttonSAT)
        buttonBalancaOption = findViewById(R.id.buttonBalancaOption);
        buttonShipay = findViewById(R.id.buttonShipay);


        buttonPrinterOption.setOnClickListener {
            val intent = Intent(this, PrinterMenu::class.java)
            startActivity(intent)
        }

        buttonTefOption.setOnClickListener {
            val intent = Intent(this, Tef::class.java)
            startActivity(intent)
        }

        buttonBalancaOption.setOnClickListener {
            val intent = Intent(this, BalancaPage::class.java)
            startActivity(intent)
        }

        buttonBarCodeReaderOption.setOnClickListener {
            val intent = Intent(this, BarCodeReader::class.java)
            startActivity(intent)
        }
        buttonSAT.setOnClickListener {
            val intent = Intent(this, SatPage::class.java)
            startActivity(intent)
        }
        buttonShipay.setOnClickListener {
            val intent = Intent(this, ShipayMenu::class.java)
            startActivity(intent)
        }
    }
}



