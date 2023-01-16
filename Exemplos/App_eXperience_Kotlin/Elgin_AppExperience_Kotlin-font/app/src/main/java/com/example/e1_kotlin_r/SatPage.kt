package com.example.e1_kotlin_r

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.example.e1_kotlin_r.Services.SatService
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.lang.StringBuilder
import java.util.*


class SatPage : AppCompatActivity() {
    lateinit var serviceSat: SatService
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
    lateinit var buttonExtrairLogSat: Button
    var xmlEnviaDadosVenda = "xmlenviadadosvendasat"
    var xmlCancelamento = "cancelamentosatgo"
    var cfeCancelamento = ""
    var typeModelSAT = "SMART SAT"
    var logSavedMessage: String? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sat_page)
        context = this
        serviceSat = SatService(context as SatPage)
        logSavedMessage = "Log Sat Salvo em \n" + serviceSat.getBASE_ROOT_DIR() + "files/SatLog.txt"
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
        buttonExtrairLogSat = findViewById(R.id.buttonExtrairLogSat)

        //CONFIGS MODEL BALANÇA
        radioButtonSMARTSAT.setChecked(true)
        radioGroupModelsSAT = findViewById(R.id.radioGroupModelsSAT)
        radioGroupModelsSAT.setOnCheckedChangeListener(RadioGroup.OnCheckedChangeListener { group, checkedId ->
            when (checkedId) {
                R.id.radioButtonSMARTSAT -> typeModelSAT = "SMART SAT"
                R.id.radioButtonSATGO -> typeModelSAT = "SATGO"
            }
        })
        buttonConsultarSAT.setOnClickListener(View.OnClickListener { sendConsultarSAT() })
        buttonStatusOperacionalSAT.setOnClickListener(View.OnClickListener { sendStatusOperacionalSAT() })
        buttonRealizarVendaSAT.setOnClickListener(View.OnClickListener {
            try {
                sendEnviarVendasSAT()
            } catch (e: IOException) {
                e.printStackTrace()
            }
        })
        buttonCancelamentoSAT.setOnClickListener(View.OnClickListener {
            try {
                sendCancelarVendaSAT()
            } catch (e: IOException) {
                e.printStackTrace()
            }
        })
        buttonAtivarSAT.setOnClickListener(View.OnClickListener { sendAtivarSAT() })
        buttonAssociarSAT.setOnClickListener(View.OnClickListener { sendAssociarSAT() })
        buttonExtrairLogSat.setOnClickListener(View.OnClickListener {
            //Checa se a permissão necessária esta garantida e se não, a mesma deve ser pedida para continuar com a função
            if (isStoragePermissionGranted) {
                val mapValues: MutableMap<String, Any> = HashMap()
                mapValues["numSessao"] = numeroSessao
                mapValues["codeAtivacao"] = editTextInputCodeAtivacao.getText().toString()

                //Verifica se a extração de log foi bem-sucedida ou não
                val wasExtractedLogSucessful: Boolean = serviceSat.extrairLog(mapValues)

                //Se a extração de log foi bem sucedida, exibir a mensagem de salvamento no campo de retorno
                if (wasExtractedLogSucessful) textRetorno.setText(logSavedMessage) else {
                    textRetorno.setText("DeviceNotFound")
                }
            }
        })
    }

    fun sendAtivarSAT() {
        var retorno = "..."
        val mapValues: MutableMap<String, Any> = HashMap()
        mapValues["numSessao"] = numeroSessao
        mapValues["subComando"] = 2
        mapValues["codeAtivacao"] = editTextInputCodeAtivacao!!.text.toString()
        mapValues["cnpj"] = "14200166000166"
        mapValues["cUF"] = 15
        retorno = serviceSat.ativarSAT(mapValues)
        textRetorno!!.text = retorno
    }

    fun sendAssociarSAT() {
        var retorno = "..."
        val mapValues: MutableMap<String, Any> = HashMap()
        mapValues["numSessao"] = numeroSessao
        mapValues["codeAtivacao"] = editTextInputCodeAtivacao!!.text.toString()
        mapValues["cnpjSh"] = "16716114000172"
        mapValues["assinaturaAC"] = "SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT"
        retorno = serviceSat.associarAssinatura(mapValues)
        textRetorno!!.text = retorno
    }

    fun sendConsultarSAT() {
        var retorno = "..."
        val mapValues: MutableMap<String, Any> = HashMap()
        mapValues["numSessao"] = numeroSessao
        retorno = serviceSat.consultarSAT(mapValues)
        textRetorno!!.text = retorno
    }

    fun sendStatusOperacionalSAT() {
        var retorno = "..."
        val mapValues: MutableMap<String, Any> = HashMap()
        mapValues["numSessao"] = numeroSessao
        mapValues["codeAtivacao"] = editTextInputCodeAtivacao!!.text.toString()
        retorno = serviceSat.statusOperacional(mapValues)
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
        val ins = this.resources.openRawResource(
            this.resources.getIdentifier(
                xmlEnviaDadosVenda,
                "raw",
                this.packageName
            )
        )
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
        val mapValues: MutableMap<String, Any> = HashMap()
        mapValues["numSessao"] = numeroSessao
        mapValues["codeAtivacao"] = editTextInputCodeAtivacao!!.text.toString()
        mapValues["xmlSale"] = stringXMLSat
        retorno = serviceSat.enviarVenda(mapValues)
        val newRetorno = retorno.split("|")
        if (newRetorno.size > 8) {
            cfeCancelamento = newRetorno[8]
        }
        textRetorno!!.text = retorno
    }

    @Throws(IOException::class)
    fun sendCancelarVendaSAT() {
        var retorno = "..."
        var stringXMLSat: String
        val ins = this.resources.openRawResource(
            this.resources.getIdentifier(
                xmlCancelamento,
                "raw",
                this.packageName
            )
        )
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
        stringXMLSat = stringXMLSat.replace("novoCFe", cfeCancelamento)
        val mapValues: MutableMap<String, Any> = HashMap()
        mapValues["numSessao"] = numeroSessao
        mapValues["codeAtivacao"] = editTextInputCodeAtivacao!!.text.toString()
        mapValues["xmlCancelamento"] = stringXMLSat
        mapValues["cFeNumber"] = cfeCancelamento
        retorno = serviceSat.cancelarVenda(mapValues)
        textRetorno!!.text = retorno
    }

    private val numeroSessao: Int
        private get() = Random().nextInt(1000000)//A permissão é automaticamente concecida em sdk > 23 na instalação//Pedindo permissão

    //Checa se a permissão para escrever arquivos em diretórios externos foi garantida, se não tiver ; peça novamente
    val isStoragePermissionGranted: Boolean
        get() = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                Log.v("DEBUG", "A permissão está garantida!")
                true
            } else {
                Log.v("DEBUG", "A permissão está negada!")
                //Pedindo permissão
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
                    1
                )
                false
            }
        } else { //A permissão é automaticamente concecida em sdk > 23 na instalação
            Log.v("DEBUG", "A permissão está garantida!")
            true
        }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.size > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            Log.v("DEBUG", "Permission: " + permissions[0] + "was " + grantResults[0])
            //A permissão necessária acabou de ser garantida, continue com a operação em questão
            val mapValues: MutableMap<String, Any> = HashMap()
            mapValues["numSessao"] = numeroSessao
            mapValues["codeAtivacao"] = editTextInputCodeAtivacao!!.text.toString()
            serviceSat.extrairLog(mapValues)

            //Verifica se a extração de log foi bem-sucedida ou não
            val wasExtractedLogSucessful: Boolean = serviceSat.extrairLog(mapValues)

            //Se a extração de log foi bem sucedida, exibir a mensagem de salvamento no campo de retorno
            if (wasExtractedLogSucessful) textRetorno!!.text = logSavedMessage else {
                textRetorno!!.text = "DeviceNotFound"
            }
        } else if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE) {
            Toast.makeText(
                context,
                "O log da SAT é salvo em um arquivo .txt no storage do dispositivo e é necessário garantir a permissão para tal operação!",
                Toast.LENGTH_LONG
            ).show()
        }
    }

    companion object {
        var context: Context? = null
        private const val REQUEST_CODE_WRITE_EXTERNAL_STORAGE = 1234
    }
}