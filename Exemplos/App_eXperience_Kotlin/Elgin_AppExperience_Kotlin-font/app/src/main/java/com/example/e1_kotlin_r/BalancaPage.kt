package com.example.e1_kotlin_r

import android.os.Bundle
import android.view.View
import android.widget.*
import android.widget.AdapterView.OnItemSelectedListener
import androidx.appcompat.app.AppCompatActivity
import com.example.e1_kotlin_r.Services.Balanca
import java.util.*


class BalancaPage : AppCompatActivity() {
    private var balanca: Balanca? = null
    private var textReturnValueBalanca: TextView? = null
    private lateinit var radioGroupModels: RadioGroup
    private lateinit var radioButtonDP30CK: RadioButton
    private lateinit var spinnerProtocols: Spinner
    private lateinit var buttonConfigurarBalanca: Button
    private lateinit var buttonLerPeso: Button
    private var typeModel = "DP30CK"
    var typeProtocol = "PROTOCOL 0"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_balanca_page)
        balanca = Balanca(this)
        textReturnValueBalanca = findViewById(R.id.textReturnValueBalanca)
        radioButtonDP30CK = findViewById(R.id.radioButtonDP30CK)
        spinnerProtocols = findViewById(R.id.spinnerProtocols)
        buttonConfigurarBalanca = findViewById(R.id.buttonConfigurarBalanca)
        buttonLerPeso = findViewById(R.id.buttonLerPeso)


        //CONFIGS MODEL BALANÇA
        radioButtonDP30CK.isChecked = true
        radioGroupModels = findViewById(R.id.radioGroupModels)
        radioGroupModels.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.radioButtonDP30CK -> typeModel = "DP30CK"
                R.id.radioButtonSA110 -> typeModel = "SA110"
                R.id.radioButtonDPSC -> typeModel = "DPSC"
            }
        }

        //CONFIGS PROTOCOLS
        spinnerProtocols.onItemSelectedListener = object : OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {}
            override fun onItemSelected(adapter: AdapterView<*>, v: View, i: Int, lng: Long) {
                typeProtocol = adapter.getItemAtPosition(i).toString()
            }
        }
        buttonConfigurarBalanca.setOnClickListener { sendConfigBalanca() }
        buttonLerPeso.setOnClickListener { sendLerPesoBalanca() }
    }

    private fun sendConfigBalanca() {
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["model"] = typeModel
        mapValues["protocol"] = typeProtocol
        balanca!!.configBalanca(mapValues)
    }

    private fun sendLerPesoBalanca() {
        val retorno = balanca!!.lerPesoBalanca()
        textReturnValueBalanca!!.text = retorno
    }
}