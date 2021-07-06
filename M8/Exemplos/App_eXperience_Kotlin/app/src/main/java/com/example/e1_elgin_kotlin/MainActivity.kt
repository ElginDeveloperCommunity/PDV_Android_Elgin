package com.example.e1_elgin_kotlin

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    lateinit var buttonPrinterOption: Button
    lateinit var buttonTefOption: Button
    lateinit var buttonBarCodeReaderOption: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        buttonPrinterOption = findViewById(R.id.buttonPrinterOption)
        buttonTefOption = findViewById(R.id.buttonTefOption)
        buttonBarCodeReaderOption = findViewById(R.id.buttonBarCodeReaderOption)

        buttonPrinterOption.setOnClickListener {
            val intent = Intent(this, PrinterMenu::class.java)
            startActivity(intent)
        }

        buttonTefOption.setOnClickListener {
            val intent = Intent(this, Tef::class.java)
            startActivity(intent)
        }

        buttonBarCodeReaderOption.setOnClickListener {
            val intent = Intent(this, BarCodeReader::class.java)
            startActivity(intent)
        }
    }
}



