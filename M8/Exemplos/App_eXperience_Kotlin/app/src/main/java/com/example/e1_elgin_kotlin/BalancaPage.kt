package com.example.e1_elgin_kotlin

import android.os.Bundle
import android.view.View
import android.widget.*
import android.widget.AdapterView.OnItemSelectedListener
import androidx.appcompat.app.AppCompatActivity
import java.util.*


class BalancaPage : AppCompatActivity() {
    var balanca: Balanca? = null
    var textReturnValueBalanca: TextView? = null
    lateinit var radioGroupModels: RadioGroup
    lateinit var radioButtonDP30CK: RadioButton
    lateinit var spinnerProtocols: Spinner
    lateinit var buttonConfigurarBalanca: Button
    lateinit var buttonLerPeso: Button
    var typeModel = "DP30CK"
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
        radioButtonDP30CK.setChecked(true)
        radioGroupModels = findViewById(R.id.radioGroupModels)
        radioGroupModels.setOnCheckedChangeListener(RadioGroup.OnCheckedChangeListener { group, checkedId ->
            when (checkedId) {
                R.id.radioButtonDP30CK -> typeModel = "DP30CK"
                R.id.radioButtonSA110 -> typeModel = "SA110"
                R.id.radioButtonDPSC -> typeModel = "DPSC"
            }
        })

        //CONFIGS PROTOCOLS
        spinnerProtocols.setOnItemSelectedListener(object : OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {}
            override fun onItemSelected(adapter: AdapterView<*>, v: View, i: Int, lng: Long) {
                typeProtocol = adapter.getItemAtPosition(i).toString()
            }
        })
        buttonConfigurarBalanca.setOnClickListener(View.OnClickListener { sendConfigBalanca() })
        buttonLerPeso.setOnClickListener(View.OnClickListener { sendLerPesoBalanca() })
    }

    fun sendConfigBalanca() {
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["model"] = typeModel
        mapValues["protocol"] = typeProtocol
        balanca!!.configBalanca(mapValues)
    }

    fun sendLerPesoBalanca() {
        val retorno = balanca!!.lerPesoBalanca()
        textReturnValueBalanca!!.text = retorno
    }
}