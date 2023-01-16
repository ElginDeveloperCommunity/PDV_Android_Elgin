package com.example.e1_kotlin_r

import android.app.AlertDialog
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.RadioButton
import android.widget.RadioGroup
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.content.res.AppCompatResources
import com.example.e1_kotlin_r.Services.PrinterService
import java.util.regex.Pattern


class PrinterMenu : AppCompatActivity() {
    lateinit var mContext: Context
    lateinit var buttonPrinterTextSelected: Button
    lateinit var buttonPrinterBarCodeSelected: Button
    lateinit var buttonPrinterImageSelected: Button
    lateinit var buttonStatusPrinter: Button
    lateinit var buttonStatusGaveta: Button
    lateinit var buttonAbrirGaveta: Button
    lateinit var radioGroupConnectPrinterIE: RadioGroup
    lateinit var radioButtonConnectPrinterIntern: RadioButton
    lateinit var editTextInputIP: EditText
    lateinit var selectedPrinterModel: String
    private val EXTERNAL_PRINTER_MODEL_I9 = "i9"
    private val EXTERNAL_PRINTER_MODEL_I8 = "i8"
    private val EXTERNAL_PRINTER_MODEL_I7_PLUS = "i7 PLUS"

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mContext = this
        setContentView(R.layout.activity_printer_menu)

        //Inicializa a impressora interna selecionada inicialmente e ajusta a variavel de controle booleana que verifica se a impressora interna esta em uso
        printer = PrinterService(this)
        printer!!.printerInternalImpStart()
        showPrinterTextScreen()
        editTextInputIP = findViewById(R.id.editTextInputIP)
        editTextInputIP.setText("192.168.0.103:9100")
        buttonPrinterTextSelected = findViewById(R.id.buttonPrinterTextSelect)
        buttonPrinterImageSelected = findViewById(R.id.buttonPrinterImageSelect)
        buttonPrinterBarCodeSelected = findViewById(R.id.buttonPrinterBarCodeSelect)
        buttonStatusPrinter = findViewById(R.id.buttonStatus)
        buttonStatusGaveta = findViewById(R.id.buttonStatusGaveta)
        buttonAbrirGaveta = findViewById(R.id.buttonAbrirGaveta)
        radioButtonConnectPrinterIntern = findViewById(R.id.radioButtonConnectPrinterIntern)
        radioButtonConnectPrinterIntern.setChecked(true)
        radioGroupConnectPrinterIE = findViewById(R.id.radioGroupConnectPrinterIE)
        radioGroupConnectPrinterIE.setOnCheckedChangeListener(RadioGroup.OnCheckedChangeListener { group, checkedId ->
            val EXTERNAL_CONNECTION_METHOD_USB = "USB"
            val EXTERNAL_CONNECTION_METHOD_IP = "IP"
            when (checkedId) {
                R.id.radioButtonConnectPrinterIntern -> printer!!.printerInternalImpStart()
                R.id.radioButtonConnectPrinterExternByIP -> if (isIpValid(
                        editTextInputIP.getText().toString()
                    )
                ) {
                    //Invoca o alertDialog que permite a escolha do modelo de impressora antes da tentativa de iniciar a conexão por IP
                    alertDialogSetSelectedPrinterModelThenConnect(EXTERNAL_CONNECTION_METHOD_IP)
                } else {
                    //Se não foi possível validar o ip antes da chama da função, retorne para a conexão com impressora interna
                    alertMessageStatus("Digite um IP válido.")
                    radioButtonConnectPrinterIntern.setChecked(true)
                }
                R.id.radioButtonConnectPrinterExternByUSB ->                         //Invoca o alertDialog que permite a escolha do modelo de impressora antes da tentativa de iniciar a conexão por IP
                    alertDialogSetSelectedPrinterModelThenConnect(EXTERNAL_CONNECTION_METHOD_USB)
            }
        })
        buttonPrinterTextSelected.setBackgroundTintList(
            AppCompatResources.getColorStateList(
                mContext,
                R.color.azul
            )
        )
        buttonPrinterTextSelected.setOnClickListener(View.OnClickListener {
            buttonPrinterTextSelected.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.azul
                )
            )
            buttonPrinterBarCodeSelected.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            buttonPrinterImageSelected.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            showPrinterTextScreen()
        })
        buttonPrinterBarCodeSelected.setOnClickListener(View.OnClickListener {
            buttonPrinterTextSelected.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            buttonPrinterBarCodeSelected.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.azul
                )
            )
            buttonPrinterImageSelected.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            showPrinterBarCodeScreen()
        })
        buttonPrinterImageSelected.setOnClickListener(View.OnClickListener {
            buttonPrinterTextSelected.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            buttonPrinterBarCodeSelected.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            buttonPrinterImageSelected.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.azul
                )
            )
            showPrinterImageScreen()
        })
        buttonStatusPrinter.setOnClickListener(View.OnClickListener { statusPrinter() })
        buttonStatusGaveta.setOnClickListener(View.OnClickListener { statusGaveta() })
        buttonAbrirGaveta.setOnClickListener(View.OnClickListener { abrirGaveta() })
    }

    fun connectExternPrinterByIP(ip: String) {
        val ipAndPort = ip.split(":").toTypedArray()
        val result: Int = printer.printerExternalImpStartByIP(
            selectedPrinterModel,
            ipAndPort[0], ipAndPort[1].toInt()
        )
        println("RESULT EXTERN - IP: $result")
        if (result != 0) {
            alertMessageStatus("A tentativa de conexão por IP não foi bem sucedida!")
            printer.printerInternalImpStart()
            radioButtonConnectPrinterIntern!!.isChecked = true
        }
    }

    fun connectExternPrinterByUSB(model: String?) {
        val result: Int = printer.printerExternalImpStartByUSB(model)
        println("RESULT EXTERN - USB: $result")
        if (result != 0) {
            alertMessageStatus("A tentativa de conexão por USB não foi bem sucedida!")
            printer.printerInternalImpStart()
            radioButtonConnectPrinterIntern!!.isChecked = true
        }
    }

    //Dialogo usado para escolher definir o modelo de impressora externa que sera estabelecida a conexao
    fun alertDialogSetSelectedPrinterModelThenConnect(externalConnectionMethod: String) {
        val operations = if (externalConnectionMethod.equals("USB")) arrayOf(
            EXTERNAL_PRINTER_MODEL_I9,
            EXTERNAL_PRINTER_MODEL_I8,
            EXTERNAL_PRINTER_MODEL_I7_PLUS
        ) else arrayOf(EXTERNAL_PRINTER_MODEL_I9, EXTERNAL_PRINTER_MODEL_I8)
        val builder = AlertDialog.Builder(mContext)
        builder.setTitle("Selecione o modelo de impressora a ser conectado")

        //Tornando o dialógo não-cancelável
        builder.setCancelable(false)
        builder.setNegativeButton(
            "CANCELAR"
        ) { dialog, which -> //Se a opção de cancelamento tiver sido escolhida, retorne sempre à opção de impressão por impressora interna
            printer.printerInternalImpStart()
            radioButtonConnectPrinterIntern!!.isChecked = true
            dialog.dismiss()
        }
        builder.setItems(
            operations
        ) { dialog, which -> //Envia o parâmetro escolhido para a função que atualiza o modelo de impressora selecionado
            setSelectedPrinterModel(which)

            //inicializa depois da seleção do modelo a conexão de impressora, levando em contra o parâmetro que define se a conexão deve ser via IP ou USB
            if (externalConnectionMethod == "USB") {
                connectExternPrinterByUSB(selectedPrinterModel)
            } else connectExternPrinterByIP(editTextInputIP!!.text.toString())
        }
        builder.show()
    }

    fun setSelectedPrinterModel(whichSelected: Int) {
        if (whichSelected == 0) {
            selectedPrinterModel =
                EXTERNAL_PRINTER_MODEL_I9
        } else if (whichSelected == 1) {
            selectedPrinterModel = EXTERNAL_PRINTER_MODEL_I8
        } else {
            selectedPrinterModel = EXTERNAL_PRINTER_MODEL_I7_PLUS
        }

        Log.d("DEBUG", selectedPrinterModel);
    }

    fun showPrinterTextScreen() {
        val firstFragment = FragmentPrinterText()
        val transaction = fragmentManager.beginTransaction()
        transaction.replace(R.id.containerFragments, firstFragment)
        transaction.commit()
    }

    fun showPrinterBarCodeScreen() {
        val barCodeFragment = FragmentPrinterBarCode()
        val transaction = fragmentManager.beginTransaction()
        transaction.replace(R.id.containerFragments, barCodeFragment)
        transaction.commit()
    }

    fun showPrinterImageScreen() {
        val barCodeFragment = FragmentPrinterImage()
        val transaction = fragmentManager.beginTransaction()
        transaction.replace(R.id.containerFragments, barCodeFragment)
        transaction.commit()
    }

    fun statusPrinter() {
        var statusPrinter = ""
        val resultStatus: Int = printer.statusSensorPapel()
        System.out.println("STATUS GAVETA: " + printer.statusGaveta())
        statusPrinter = if (resultStatus == 5) {
            "Papel está presente e não está próximo do fim!"
        } else if (resultStatus == 6) {
            "Papel próximo do fim!"
        } else if (resultStatus == 7) {
            "Papel ausente!"
        } else {
            "Status Desconhecido!"
        }
        alertMessageStatus(statusPrinter)
    }

    private fun statusGaveta() {
        var statusGaveta = ""
        val resultStatusGaveta: Int = printer.statusGaveta()
        statusGaveta = if (resultStatusGaveta == 1) {
            "Gaveta aberta!"
        } else if (resultStatusGaveta == 2) {
            "Gaveta fechada!"
        } else {
            "Status Desconhecido!"
        }
        alertMessageStatus(statusGaveta)
    }

    private fun abrirGaveta(): Int {
        return printer.abrirGaveta()
    }

    fun alertMessageStatus(messageAlert: String?) {
        val alertDialog = AlertDialog.Builder(printer.mActivity).create()
        alertDialog.setTitle("Alert")
        alertDialog.setMessage(messageAlert)
        alertDialog.setButton(
            AlertDialog.BUTTON_NEUTRAL, "OK"
        ) { dialog, which -> dialog.dismiss() }
        alertDialog.show()
    }

    companion object {
        lateinit var printer: PrinterService
        fun isIpValid(ip: String?): Boolean {
            val pattern =
                Pattern.compile("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$")
            val matcher = pattern.matcher(ip)
            return matcher.matches()
        }

        /**
         * Funções da impressora, que serão chamadas pelos fragments que invocaram as impressões
         */
        //Esta função aplica um AvancaPapel na impressão de acordo com o tipo de impressora em uso
        fun jumpLine() {
            val mapValues: MutableMap<String, Any> = HashMap()

            //Se a impressão for por impressora externa, 5 é o suficiente; 10 caso contrário
            if (!printer.isPrinterInternSelected) {
                mapValues["quant"] = 5
            } else mapValues["quant"] = 10
            printer.AvancaLinhas(mapValues)
        }

        //O valor enviado ao corte de papél corresponde também a um avancaLinhas, como utilizamos jumpLine(), enviaremos o valor mínimo
        fun cutPaper() {
            val mapValues: MutableMap<String, Any> = HashMap()
            mapValues["quant"] = 1
            printer.cutPaper(mapValues)
        }
    }
}