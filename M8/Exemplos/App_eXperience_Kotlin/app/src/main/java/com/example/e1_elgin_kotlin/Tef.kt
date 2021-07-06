package com.example.e1_elgin_kotlin

import android.app.Activity
import android.app.AlertDialog.Builder
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.content.res.AppCompatResources
import br.com.setis.interfaceautomacao.Operacoes
import com.google.gson.Gson
import org.json.JSONException
import org.json.JSONObject
import java.util.*
import java.util.regex.Pattern

class Tef : AppCompatActivity() {
    lateinit var paygo: Paygo
    var printer: Printer = Printer(this)
    var intentToMsitef = Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF")
    var gson: Gson = Gson()
    var context: Context = this

    //BUTTONS TYPE TEF
    lateinit var buttonMsitefOption: Button
    lateinit var buttonPaygoOption: Button

    //EDIT TEXTs
    lateinit var editTextValueTEF: EditText
    lateinit var editTextInstallmentsTEF: EditText
    lateinit var editTextIpTEF: EditText

    //BUTTONS TYPE OF PAYMENTS
    lateinit var buttonCreditOption: Button
    lateinit var buttonDebitOption: Button
    lateinit var buttonVoucherOption: Button

    //BUTTONS TYPE OF INSTALLMENTS
    lateinit var buttonStoreOption: Button
    lateinit var buttonAdmOption: Button
    lateinit var buttonAvistaOption: Button

    //BUTTONS ACTIONS TEF
    lateinit var buttonSendTransaction: Button
    lateinit var buttonCancelTransaction: Button
    lateinit var buttonConfigsTransaction: Button

    lateinit var textViewViaMsitef: TextView
    lateinit var viaClienteMsitef: String

    //INIT DEFAULT OPTIONS
    var selectedPaymentMethod = "Crédito"
    var selectedInstallmentsMethod = "Avista"
    var selectedTefType = "PayGo"
    var selectedAction = "SALE"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_tef)

        paygo = Paygo(this)
        printer.printerInternalImpStart()

        //INIT BUTTONS TYPE TEF
        buttonMsitefOption = findViewById(R.id.buttonMsitefOption)
        buttonPaygoOption = findViewById(R.id.buttonPaygoOption)

        //INIT EDIT TEXTs
        editTextValueTEF = findViewById(R.id.editTextInputValueTEF)
        editTextInstallmentsTEF = findViewById(R.id.editTextInputInstallmentsTEF)
        editTextIpTEF = findViewById(R.id.editTextInputIPTEF)

        //INIT BUTTONS TYPES PAYMENTS
        buttonCreditOption = findViewById(R.id.buttonCreditOption)
        buttonDebitOption = findViewById(R.id.buttonDebitOption)
        buttonVoucherOption = findViewById(R.id.buttonVoucherOption)

        //INIT BUTTONS TYPE INSTALLMENTS
        buttonStoreOption = findViewById(R.id.buttonStoreOption)
        buttonAdmOption = findViewById(R.id.buttonAdmOption)
        buttonAvistaOption = findViewById(R.id.buttonAvistaOption)

        //INIT BUTTONS ACTIONS TEF
        buttonSendTransaction = findViewById(R.id.buttonSendTransactionTEF)
        buttonCancelTransaction = findViewById(R.id.buttonCancelTransactionTEF)
        buttonConfigsTransaction = findViewById(R.id.buttonConfigsTEF)

        //INIT IMAGE VIEW VIA PAYGO
        Companion.imageViewViaPaygo = findViewById(R.id.imageViewViaPaygo)
        //INIT IMAGE VIEW VIA PAYGO
        textViewViaMsitef = findViewById(R.id.textViewViaMsitef)

        //SELECT INITIALS OPTIONS

        //SELECT INITIALS OPTIONS
        buttonPaygoOption.backgroundTintList = AppCompatResources.getColorStateList(
            context as Tef,
            R.color.verde
        )
        buttonCreditOption.backgroundTintList = AppCompatResources.getColorStateList(
            context as Tef,
            R.color.verde
        )
        buttonAvistaOption.backgroundTintList = AppCompatResources.getColorStateList(
            context as Tef,
            R.color.verde
        )

        //INIT DEFAULT INPUTS
        editTextValueTEF.setText("2000")
        editTextInstallmentsTEF.setText("1")
        editTextIpTEF.setText("192.168.0.31")

        editTextIpTEF.isEnabled = false
        editTextIpTEF.isFocusableInTouchMode = false
        textViewViaMsitef.setVisibility(View.GONE)

        //SELECT OPTION M-SITEF
        buttonMsitefOption.setOnClickListener {
            selectedTefType = "M-Sitef"

            buttonMsitefOption.backgroundTintList =  AppCompatResources.getColorStateList(
                context,
                R.color.verde
            )
            buttonPaygoOption.backgroundTintList =  AppCompatResources.getColorStateList(
                context,
                R.color.black
            )

            editTextIpTEF.isEnabled = true
            editTextIpTEF.isFocusableInTouchMode = true
            buttonAvistaOption.isEnabled = false

            if (selectedInstallmentsMethod == "Avista") {
                selectedInstallmentsMethod = "Crédito"
                buttonAvistaOption.backgroundTintList =  AppCompatResources.getColorStateList(
                    context,
                    R.color.black
                )
                buttonStoreOption.backgroundTintList =  AppCompatResources.getColorStateList(
                    context,
                    R.color.verde
                )
            }
            textViewViaMsitef.setVisibility(View.VISIBLE)

            buttonAvistaOption.visibility = View.GONE
            Companion.imageViewViaPaygo!!.setVisibility(View.GONE)
        }

        //SELECT OPTION PAYGO
        buttonPaygoOption.setOnClickListener {
            selectedTefType = "PayGo"

            buttonMsitefOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
            buttonPaygoOption.backgroundTintList =  AppCompatResources.getColorStateList(
                context,
                R.color.verde
            )

            editTextIpTEF.isEnabled = false
            editTextIpTEF.isFocusableInTouchMode = false
            buttonAvistaOption.isEnabled = true
            buttonAvistaOption.visibility = View.VISIBLE

            textViewViaMsitef.setVisibility(View.GONE)
            Companion.imageViewViaPaygo!!.setVisibility(View.VISIBLE)
        }

        //SELECT OPTION CREDIT PAYMENT
        buttonCreditOption.setOnClickListener {
            selectedPaymentMethod = "Crédito"
            buttonCreditOption.backgroundTintList =  AppCompatResources.getColorStateList(
                context,
                R.color.verde
            )
            buttonDebitOption.backgroundTintList =  AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
            buttonVoucherOption.backgroundTintList =  AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
        }

        //SELECT OPTION DEBIT PAYMENT
        buttonDebitOption.setOnClickListener {
            selectedPaymentMethod = "Débito"
            buttonCreditOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
            buttonDebitOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.verde
            )
            buttonVoucherOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
        }

        //SELECT OPTION VOUCHER PAYMENT
        buttonVoucherOption.setOnClickListener {
            selectedPaymentMethod = "Todos"
            buttonCreditOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
            buttonDebitOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
            buttonVoucherOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.verde
            )
        }

        //SELECT OPTION STORE INSTALLMENT
        buttonStoreOption.setOnClickListener {
            selectedInstallmentsMethod = "Loja"
            buttonStoreOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.verde
            )
            buttonAdmOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
            buttonAvistaOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
        }

        //SELECT OPTION ADM INSTALLMENT
        buttonAdmOption.setOnClickListener {
            selectedInstallmentsMethod = "Adm"
            buttonStoreOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
            buttonAdmOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.verde
            )
            buttonAvistaOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
        }

        //SELECT OPTION AVISTA INSTALLMENT
        buttonAvistaOption.setOnClickListener {
            selectedInstallmentsMethod = "Avista"
            buttonStoreOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
            buttonAdmOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.black
            )
            buttonAvistaOption.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.verde
            )
        }

        //SELECT BUTTON SEND TRANSACTION
        buttonSendTransaction.setOnClickListener {
            if (isEntriesValid()) {
                startActionTEF("SALE")
            }
        }

        //SELECT BUTTON CANCEL TRANSACTION
        buttonCancelTransaction.setOnClickListener {
            if (isEntriesValid()) {
                startActionTEF("CANCEL")
            }
        }

        //SELECT BUTTON CONFIGS TRANSACTION
        buttonConfigsTransaction.setOnClickListener {
            if (isEntriesValid()) {
                startActionTEF("CONFIGS")
            }
        }
    }

    fun startActionTEF(action: String) {
        selectedAction = action
        if (selectedTefType == "M-Sitef") {
            sendSitefParams(action)
        } else {
            sendPaygoParams(action)
        }
    }

    fun sendPaygoParams(action: String) {
        val mapValues: MutableMap<String?, Any?> = HashMap()

        if (action == "SALE" || action == "CANCEL") {
            mapValues["valor"] = editTextValueTEF.text.toString()
            mapValues["parcelas"] = editTextInstallmentsTEF.text.toString().toInt()
            mapValues["formaPagamento"] = selectedPaymentMethod
            mapValues["tipoParcelamento"] = selectedInstallmentsMethod

            if (action == "SALE") {
                paygo.efetuaTransacao(Operacoes.VENDA, mapValues)
            } else if (action == "CANCEL") {
                paygo.efetuaTransacao(Operacoes.CANCELAMENTO, mapValues)
            }

        } else {
            paygo.efetuaTransacao(Operacoes.ADMINISTRATIVA, mapValues)
        }
    }

    fun optionReturnPaygo(mcontext: Activity, map: Map<*, *>){
        var retorno = ""
        var imageViaBase64 = ""
        if (map["retorno"] == "Transacao autorizada") {
            imageViaBase64 = map["via_cliente"].toString()
            retorno = map["retorno"].toString()

            setImageViaPaygo(imageViaBase64)
        } else {
            retorno = map["retorno"].toString()
        }

        val alertDialog = Builder(mcontext)
        alertDialog.setTitle("Alert")
        alertDialog.setMessage(retorno)
        alertDialog.setPositiveButton("OK"){ dialog, which -> dialog.dismiss()}
        alertDialog.create()
        alertDialog.show()

        println("imageViewViaPaygo: " + Companion.imageViewViaPaygo)
    }

    private fun setImageViaPaygo(imageViaBase64: String){
        val mapValues: MutableMap<String, Any?> = HashMap()

        val decodedString = Base64.decode(imageViaBase64, Base64.DEFAULT)
        val decodedByte = BitmapFactory.decodeByteArray(
            decodedString,
            0,
            decodedString.size
        )

        mapValues["quant"] = 10
        mapValues["base64"] = imageViaBase64

        printer.imprimeCupomTEF(mapValues)
        printer.AvancaLinhas(mapValues)
        printer.cutPaper(mapValues)

        Companion.imageViewViaPaygo?.setImageBitmap(decodedByte)
    }

    private fun isEntriesValid(): Boolean {
        return if (isValueNotEmpty(editTextValueTEF.text.toString())) {
            if (isInstallmentEmptyOrLessThanZero(editTextInstallmentsTEF.text.toString())) {
                if (selectedTefType == "M-Sitef") {
                    if (isIpValid(editTextIpTEF.text.toString())) {
                        true
                    } else {
                        alertMessageStatus("Alerta", "Verifique seu endereço IP.")
                        false
                    }
                } else {
                    true
                }
            } else {
                alertMessageStatus("Alerta", "Digite um número de parcelas válido maior que 0.")
                false
            }
        } else {
            alertMessageStatus("Alerta", "Verifique a entrada de valor de pagamento!")
            false
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 4321) {
            var sitefReturn: SitefReturn? = null
            try {
                sitefReturn = gson.fromJson(convertResultFromJSON(data!!), SitefReturn::class.java)
            } catch (e: JSONException) {
                e.printStackTrace()
            }
            if (resultCode == RESULT_OK || resultCode == RESULT_CANCELED && data != null) {
                if (sitefReturn!!.cODRESP()!!.toInt() < 0 && sitefReturn.cODAUTORIZACAO()
                        .equals("")
                ) {
                    alertMessageStatus("Alerta", "Ocorreu um erro durante a transação.")
                } else {
                    viaClienteMsitef = sitefReturn.vIACLIENTE()!!

                    textViewViaMsitef.setText(viaClienteMsitef)

                    if(selectedAction != "CONFIGS"){
                        printerViaVlienteMsitef(sitefReturn.vIACLIENTE()!!)
                    }

                    alertMessageStatus("Alerta", "Ação realizada com sucesso.")
                }
            } else {
                alertMessageStatus("Alerta", "Ocorreu um erro durante a transação.")
            }
        }
    }

    fun sendSitefParams(action: String) {
        //PARAMS DEFAULT TO ALL ACTION M-SITEF
        intentToMsitef.putExtra("empresaSitef", "00000000")
        intentToMsitef.putExtra("enderecoSitef", editTextIpTEF.text.toString())
        intentToMsitef.putExtra("operador", "0001")
        intentToMsitef.putExtra("data", "20200324")
        intentToMsitef.putExtra("hora", "130358")
        intentToMsitef.putExtra("numeroCupom", Random().nextInt(99999).toString())
        intentToMsitef.putExtra("valor", editTextValueTEF.text.toString())
        intentToMsitef.putExtra("CNPJ_CPF", "03654119000176")
        intentToMsitef.putExtra("comExterna", "0")
        if (action == "SALE") {
            intentToMsitef.putExtra("modalidade", paymentToYourCode(selectedPaymentMethod))
            if (selectedPaymentMethod == "Crédito") {
                if (editTextInstallmentsTEF.text.toString() == "0" || editTextInstallmentsTEF.text.toString() == "1") {
                    intentToMsitef.putExtra("transacoesHabilitadas", "26")
                    intentToMsitef.putExtra("numParcelas", "")
                } else if (selectedPaymentMethod == "Loja") {
                    intentToMsitef.putExtra("transacoesHabilitadas", "27")
                } else if (selectedPaymentMethod == "Adm") {
                    intentToMsitef.putExtra("transacoesHabilitadas", "28")
                }
                intentToMsitef.putExtra("numParcelas", editTextInstallmentsTEF.text.toString())
            }
            if (selectedPaymentMethod == "Débito") {
                intentToMsitef.putExtra("transacoesHabilitadas", "16")
                intentToMsitef.putExtra("numParcelas", "")
            }
            if (selectedPaymentMethod == "Todos") {
                intentToMsitef.putExtra("restricoes", "transacoesHabilitadas=16")
                intentToMsitef.putExtra("transacoesHabilitadas", "")
                intentToMsitef.putExtra("numParcelas", "")
            }
        }
        if (action == "CANCEL") {
            intentToMsitef.putExtra("modalidade", "200")
            intentToMsitef.putExtra("transacoesHabilitadas", "")
            intentToMsitef.putExtra("isDoubleValidation", "0")
            intentToMsitef.putExtra("restricoes", "")
            intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm")
        }
        if (action == "CONFIGS") {
            intentToMsitef.putExtra("modalidade", "110")
            intentToMsitef.putExtra("isDoubleValidation", "0")
            intentToMsitef.putExtra("restricoes", "")
            intentToMsitef.putExtra("transacoesHabilitadas", "")
            intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm")
            intentToMsitef.putExtra("restricoes", "transacoesHabilitadas=16;26;27")
        }
        startActivityForResult(intentToMsitef, 4321)
    }

    fun paymentToYourCode(payment: String?): String? {
        return when (payment) {
            "Crédito" -> "3"
            "Débito" -> "2"
            "Todos" -> "0"
            else -> "0"
        }
    }

    @Throws(JSONException::class)
    fun convertResultFromJSON(receiveResult: Intent): String? {
        val convertJSON = JSONObject()
        convertJSON.put("cODAUTORIZACAO", receiveResult.getStringExtra("COD_AUTORIZACAO"))
        convertJSON.put("vIAESTABELECIMENTO", receiveResult.getStringExtra("VIA_ESTABELECIMENTO"))
        convertJSON.put("cOMPDADOSCONF", receiveResult.getStringExtra("COMP_DADOS_CONF"))
        convertJSON.put("bANDEIRA", receiveResult.getStringExtra("BANDEIRA"))
        convertJSON.put("nUMPARC", receiveResult.getStringExtra("NUM_PARC"))
        convertJSON.put("cODTRANS", receiveResult.getStringExtra("CODTRANS"))
        convertJSON.put("rEDEAUT", receiveResult.getStringExtra("REDE_AUT"))
        convertJSON.put("nSUSITEF", receiveResult.getStringExtra("NSU_SITEF"))
        convertJSON.put("vIACLIENTE", receiveResult.getStringExtra("VIA_CLIENTE"))
        convertJSON.put("vLTROCO", receiveResult.getStringExtra("VLTROCO"))
        convertJSON.put("tIPOPARC", receiveResult.getStringExtra("TIPO_PARC"))
        convertJSON.put("cODRESP", receiveResult.getStringExtra("CODRESP"))
        convertJSON.put("nSUHOST", receiveResult.getStringExtra("NSU_HOST"))
        return convertJSON.toString()
    }

    fun printerViaVlienteMsitef(viaCliente: String) {
        val mapValues: MutableMap<String, Any> = HashMap()

        mapValues["text"] = viaCliente
        mapValues["align"] = "Centralizado"
        mapValues["font"] = "FONT B"
        mapValues["fontSize"] = 0
        mapValues["isBold"] = false
        mapValues["isUnderline"] = false
        mapValues["quant"] = 10

        printer.imprimeTexto(mapValues)
        printer.AvancaLinhas(mapValues)
        printer.cutPaper(mapValues)
    }

    private fun alertMessageStatus(titleAlert: String, messageAlert: String) {
        val alertDialog = Builder(context)

        alertDialog.setTitle(titleAlert)
        alertDialog.setMessage(messageAlert)
        alertDialog.setPositiveButton("OK"){ dialog, which -> dialog.dismiss()}
        alertDialog.create()
        alertDialog.show()
    }

    private fun isIpValid(ip: String): Boolean {
        val pattern = Pattern.compile("^(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))$")
        val matcher = pattern.matcher(ip)
        return matcher.matches()
    }

    private fun isValueNotEmpty(inputTextValue: String): Boolean {
        return inputTextValue != ""
    }

    fun isInstallmentEmptyOrLessThanZero(inputTextInstallment: String): Boolean {
        return if (inputTextInstallment == "") {
            false
        } else {
            inputTextInstallment.toInt() > 0
        }
    }

    companion object {
        //IMAGE VIEW VIA PAYGO
        var imageViewViaPaygo: ImageView? = null
    }
}