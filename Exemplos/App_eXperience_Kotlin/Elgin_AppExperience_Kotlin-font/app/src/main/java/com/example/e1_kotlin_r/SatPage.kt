package com.example.e1_kotlin_r

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStream
import java.io.InputStreamReader
import java.util.*


class SatPage : AppCompatActivity() {
    lateinit var context: Context
    lateinit var serviceSat: ServiceSat
    lateinit var textRetorno: TextView

    lateinit var editTextInputCodeAtivacao: EditText
    lateinit var radioGroupModelsSAT: RadioGroup
    lateinit var radioButtonSMARTSAT: RadioButton

    lateinit var buttonConsultarSAT: Button
    lateinit var buttonStatusOperacionalSAT: Button
    lateinit var buttonRealizarVendaSAT: Button
    lateinit var buttonCancelamentoSAT: Button
    lateinit var buttonAtivarSAT: Button
    lateinit var buttonAssociarSAT: Button

    var xmlEnviaDadosVenda = "xmlenviadadosvendasat"
    var xmlCancelamento = "cancelamentosatgo"

    var cfeCancelamento = ""
    var typeModelSAT = "SMART SAT"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sat_page)

        context = this
        serviceSat = ServiceSat(context)
        textRetorno = findViewById(R.id.textRetorno)

        radioButtonSMARTSAT = findViewById(R.id.radioButtonSMARTSAT)
        editTextInputCodeAtivacao = findViewById(R.id.editTextInputCodeAtivacao)
        editTextInputCodeAtivacao.setText("123456789")

        buttonConsultarSAT = findViewById(R.id.buttonConsultarSAT)
        buttonStatusOperacionalSAT = findViewById(R.id.buttonStatusOperacionalSAT)
        buttonRealizarVendaSAT = findViewById(R.id.buttonRealizarVendaSAT)
        buttonCancelamentoSAT = findViewById(R.id.buttonCancelamentoSAT)
        buttonAtivarSAT = findViewById(R.id.buttonAtivarSAT)
        buttonAssociarSAT = findViewById(R.id.buttonAssociarSAT)

        //CONFIGS MODEL BALANÇA

        //CONFIGS MODEL BALANÇA
        radioButtonSMARTSAT.isChecked = true
        radioGroupModelsSAT = findViewById(R.id.radioGroupModelsSAT)
        radioGroupModelsSAT.setOnCheckedChangeListener { group, checkedId ->
            when (checkedId) {
                R.id.radioButtonSMARTSAT -> typeModelSAT = "SMART SAT"
                R.id.radioButtonSATGO -> typeModelSAT = "SATGO"
            }
        }

        buttonConsultarSAT.setOnClickListener { sendConsultarSAT() }

        buttonStatusOperacionalSAT.setOnClickListener { sendStatusOperacionalSAT() }

        buttonRealizarVendaSAT.setOnClickListener {
            try {
                sendEnviarVendasSAT()
            } catch (e: IOException) {
                e.printStackTrace()
            }
        }

        buttonCancelamentoSAT.setOnClickListener {
            try {
                sendCancelarVendaSAT()
            } catch (e: IOException) {
                e.printStackTrace()
            }
        }

        buttonAtivarSAT.setOnClickListener { sendAtivarSAT() }
        buttonAssociarSAT.setOnClickListener { sendAssociarSAT() }

    }


    fun sendAtivarSAT() {
        var retorno = "..."
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["numSessao"] = getNumeroSessao()
        mapValues["subComando"] = 2
        mapValues["codeAtivacao"] = editTextInputCodeAtivacao.text.toString()
        mapValues["cnpj"] = "14200166000166"
        mapValues["cUF"] = 15
        retorno = serviceSat!!.ativarSAT(mapValues)
        textRetorno!!.text = retorno
    }

    fun sendAssociarSAT() {
        var retorno = "..."
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["numSessao"] = getNumeroSessao()
        mapValues["codeAtivacao"] = editTextInputCodeAtivacao.text.toString()
        mapValues["cnpjSh"] = "16716114000172"
        mapValues["assinaturaAC"] = "SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT"
        retorno = serviceSat!!.associarAssinatura(mapValues)
        textRetorno!!.text = retorno
    }

    fun sendConsultarSAT() {
        var retorno = "..."
        val mapValues: MutableMap<String, Any> = HashMap()
        mapValues["numSessao"] = getNumeroSessao()
        retorno = serviceSat.consultarSAT(mapValues)
        textRetorno.setText(retorno)
    }

    fun sendStatusOperacionalSAT() {
        Log.d("TAG", editTextInputCodeAtivacao.text.toString())

        var retorno = "..."
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["numSessao"] = getNumeroSessao()
        mapValues["codeAtivacao"] = editTextInputCodeAtivacao.text.toString()
        retorno = serviceSat!!.statusOperacional(mapValues)
        textRetorno!!.text = retorno
    }


    @Throws(IOException::class)
    fun sendEnviarVendasSAT() {
        var retorno = "..."
        val stringXMLSat: String
        cfeCancelamento = ""

        xmlEnviaDadosVenda = if (typeModelSAT == "SMART SAT") {
            "xmlenviadadosvendasat"
        } else {
            "satgo3"
        }

        val ins: InputStream = context?.resources?.openRawResource(
            resources.getIdentifier(
                xmlEnviaDadosVenda,
                "raw",
                context.packageName
            )
        )!!

        val br = BufferedReader(InputStreamReader(ins))
        val sb = StringBuilder()
        var line: String? = null
        try {
            line = br.readLine()
        } catch (e: IOException) {
            e.printStackTrace()
        }
        while (line != null) {
            sb.append(line)
            sb.append(System.lineSeparator())
            line = br.readLine()
        }
        stringXMLSat = sb.toString()

        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["numSessao"] = getNumeroSessao()
        mapValues["codeAtivacao"] = editTextInputCodeAtivacao.text.toString()
        mapValues["xmlSale"] = stringXMLSat
        retorno = serviceSat!!.enviarVenda(mapValues)

        val newRetorno = Arrays.asList(*retorno.split("\\|".toRegex()).toTypedArray())
        if (newRetorno.size > 8) {
            cfeCancelamento = newRetorno[8]
        }

        textRetorno!!.text = retorno
    }

    @Throws(IOException::class)
    fun sendCancelarVendaSAT() {
        var retorno = "..."
        var stringXMLSat: String

        val ins: InputStream = context.getResources().openRawResource(
            context.getResources().getIdentifier(
                xmlCancelamento,
                "raw",
                context.getPackageName()
            )
        )
        val br = BufferedReader(InputStreamReader(ins))
        val sb = java.lang.StringBuilder()
        var line: String? = null
        try {
            line = br.readLine()
        } catch (e: IOException) {
            e.printStackTrace()
        }
        while (line != null) {
            sb.append(line)
            sb.append(System.lineSeparator())
            line = br.readLine()
        }
        stringXMLSat = sb.toString()
        stringXMLSat = stringXMLSat.replace("novoCFe", cfeCancelamento)

        val mapValues: MutableMap<String?, Any?> = HashMap()

        mapValues["numSessao"] = getNumeroSessao()
        mapValues["codeAtivacao"] = editTextInputCodeAtivacao.text.toString()
        mapValues["xmlCancelamento"] = stringXMLSat
        mapValues["cFeNumber"] = cfeCancelamento
        retorno = serviceSat.cancelarVenda(mapValues)

        textRetorno.text = retorno
    }

    fun getNumeroSessao(): Int {
        return Random().nextInt(1000000)
    }
}