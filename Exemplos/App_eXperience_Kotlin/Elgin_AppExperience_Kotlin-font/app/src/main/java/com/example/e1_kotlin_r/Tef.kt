package com.example.e1_kotlin_r

import android.app.Activity
import android.app.AlertDialog.Builder
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.os.Build
import android.os.Bundle
import android.util.Base64
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.content.res.AppCompatResources
import br.com.setis.interfaceautomacao.Operacoes
import com.example.e1_kotlin_r.InputMasks.InputMaskMoney
import com.example.e1_kotlin_r.Services.PrinterService
import com.google.gson.Gson
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Random
import java.util.regex.Pattern

class Tef : AppCompatActivity() {
    lateinit var paygo: Paygo
    lateinit var printer: PrinterService

    //Intent para o TEF M-SITEF.
    var intentToMsitef = Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF")
    var gson: Gson = Gson()
    val REQUEST_CODE_MSITEF = 4321

    //Intent para o TEF ELGIN.
    val intentToElginTef = Intent("com.elgin.e1.digitalhub.TEF")
    val REQUEST_CODE_ELGINTEF = 1234

    //Ultima referência de venda, necessária para o cancelamento de venda no TEF ELGIN.
    var lastElginTefNSU = ""

    lateinit var context: Context

    //BUTTONS TYPE TEF
    lateinit var buttonMsitefOption: Button
    lateinit var buttonPaygoOption: Button
    lateinit var buttonElginTefOption: Button

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
    lateinit var buttonCashOption: Button

    //BUTTONS ACTIONS TEF
    lateinit var buttonSendTransaction: Button
    lateinit var buttonCancelTransaction: Button
    lateinit var buttonConfigsTransaction: Button

    //TextView Via TEFs
    lateinit var textViewViaTef: TextView
    lateinit var viaClienteMsitef: String

    //Captura o layout referente aos botoões de financiamento, para aplicar a lógica de sumir estas opções caso o pagamento por débito seja selecionado.
    private lateinit var linearLayoutInstallmentsMethodsTEF: LinearLayout

    //Captura o layout referente ao campo de "número de parcelas", para aplicar a loǵica de sumir este campo caso o pagamento por débito seja selecionado.
    private lateinit var linearLayoutNumberOfInstallmentsTEF: LinearLayout

    //TEFs de pagamento disponíveis.
    enum class TEF {
        PAY_GO, M_SITEF, ELGIN_TEF
    }

    //Formas de pagamento disponíveis.
    enum class FormaPagamento {
        CREDITO, DEBITO, TODOS
    }

    //Formas de financiamento disponíveis.
    enum class FormaFinanciamento {
        LOJA, ADM, A_VISTA
    }

    //Ações disponíveis, correspondente aos botões na tela.
    enum class Acao {
        VENDA, CANCELAMENTO, CONFIGURACAO
    }

    //Opções selecionadas ao abrir da tela.
    private lateinit var opcaoTefSelecionada: TEF
    private lateinit var formaPagamentoSelecionada: FormaPagamento
    private lateinit var formaFinanciamentoSelecionada: FormaFinanciamento

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_tef)
        context = this
        paygo = Paygo(this)
        printer = PrinterService(this)
        printer.printerInternalImpStart()

        //INIT BUTTONS TYPE TEF
        buttonMsitefOption = findViewById(R.id.buttonMsitefOption)
        buttonPaygoOption = findViewById(R.id.buttonPaygoOption)
        buttonElginTefOption = findViewById(R.id.buttonElginTefOption)

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
        buttonCashOption = findViewById(R.id.buttonCashOption)

        //INIT BUTTONS ACTIONS TEF
        buttonSendTransaction = findViewById(R.id.buttonSendTransactionTEF)
        buttonCancelTransaction = findViewById(R.id.buttonCancelTransactionTEF)
        buttonConfigsTransaction = findViewById(R.id.buttonConfigsTEF)

        //INIT IMAGE VIEW VIA PAYGO
        imageViewViaPaygo = findViewById(R.id.imageViewViaPaygo)
        //INIT IMAGE VIEW VIA PAYGO
        textViewViaTef = findViewById(R.id.textViewViaTef)

        linearLayoutNumberOfInstallmentsTEF =
            findViewById(R.id.linearLayoutNumberOfInstallmentsTEF)
        linearLayoutInstallmentsMethodsTEF = findViewById(R.id.linearLayoutInstallmentsMethodsTEF)

        //INIT DEFAULT INPUTS
        //Aplica a máscara de moeda ao campo de valor, para melhor formatação do valor entrado.
        editTextValueTEF.addTextChangedListener(InputMaskMoney(editTextValueTEF))
        //Valor inicial de 20 reais.
        editTextValueTEF.setText("2000")

        editTextIpTEF.setText("192.168.0.31")

        //Aplica regras iniciais da tela.
        initialBusinessRule()

        //SELECT OPTION PAYGO
        buttonPaygoOption.setOnClickListener { v: View? ->
            updateTEFMethodBusinessRule(
                TEF.PAY_GO
            )
        }

        //SELECT OPTION M-SITEF
        buttonMsitefOption.setOnClickListener { v: View? ->
            updateTEFMethodBusinessRule(
                TEF.M_SITEF
            )
        }

        buttonElginTefOption.setOnClickListener { v: View? ->
            updateTEFMethodBusinessRule(
                TEF.ELGIN_TEF
            )
        }

        //SELECT OPTION CREDIT PAYMENT
        buttonCreditOption.setOnClickListener { v: View? ->
            updatePaymentMethodBusinessRule(
                FormaPagamento.CREDITO
            )
        }

        //SELECT OPTION DEBIT PAYMENT
        buttonDebitOption.setOnClickListener { v: View? ->
            updatePaymentMethodBusinessRule(
                FormaPagamento.DEBITO
            )
        }

        //SELECT OPTION VOUCHER PAYMENT
        buttonVoucherOption.setOnClickListener { v: View? ->
            updatePaymentMethodBusinessRule(
                FormaPagamento.TODOS
            )
        }

        //SELECT OPTION STORE INSTALLMENT
        buttonStoreOption.setOnClickListener { v: View? ->
            updateInstallmentMethodBusinessRule(
                FormaFinanciamento.LOJA
            )
        }

        //SELECT OPTION ADM INSTALLMENT
        buttonAdmOption.setOnClickListener { v: View? ->
            updateInstallmentMethodBusinessRule(
                FormaFinanciamento.ADM
            )
        }

        //SELECT OPTION AVISTA INSTALLMENT
        buttonCashOption.setOnClickListener { v: View? ->
            updateInstallmentMethodBusinessRule(
                FormaFinanciamento.A_VISTA
            )
        }

        //SELECT BUTTON SEND TRANSACTION
        buttonSendTransaction.setOnClickListener { v: View? ->
            if (isEntriesValid()) {
                startActionTEF(Acao.VENDA)
            }
        }

        //SELECT BUTTON CANCEL TRANSACTION
        buttonCancelTransaction.setOnClickListener { v: View? ->
            if (isEntriesValid()) {
                startActionTEF(Acao.CANCELAMENTO)
            }
        }

        //SELECT BUTTON CONFIGS TRANSACTION
        buttonConfigsTransaction.setOnClickListener { v: View? ->
            if (isEntriesValid()) {
                startActionTEF(Acao.CONFIGURACAO)
            }
        }
    }

    //Aplica as escolhas iniciais ao abrir da tela.
    private fun initialBusinessRule() {
        //TEF escolhido é o PayGo.
        updateTEFMethodBusinessRule(TEF.PAY_GO)
    }

    //Atualiza as regras e decoração de tela, de acordo com o TEF selecionado
    private fun updateTEFMethodBusinessRule(opcaoTefSelecionada: TEF) {
        //Atualiza a váriavel de controle.
        this.opcaoTefSelecionada = opcaoTefSelecionada

        //1.Apenas o TEF M-Sitef possuí configuração de IP.
        editTextIpTEF.isEnabled = opcaoTefSelecionada === TEF.M_SITEF
        editTextIpTEF.isFocusableInTouchMode = opcaoTefSelecionada === TEF.M_SITEF

        //2.M-Sitef não possuí pagamento a vista via crédito.
        buttonCashOption.visibility =
            if (opcaoTefSelecionada === TEF.M_SITEF) View.INVISIBLE else View.VISIBLE

        //3.A opção "todos" não está disponível para o TEF ELGIN.
        buttonVoucherOption.visibility =
            if (opcaoTefSelecionada === TEF.ELGIN_TEF) View.INVISIBLE else View.VISIBLE

        //4.Os TEFS M-Sitef e TEF ELGIN possuem retorno textual(TextView), enquanto o PayGo retorna uma Imagem(ImageView).
        textViewViaTef.visibility =
            if (opcaoTefSelecionada === TEF.M_SITEF || opcaoTefSelecionada === TEF.ELGIN_TEF) View.VISIBLE else View.GONE
        imageViewViaPaygo!!.visibility =
            if (opcaoTefSelecionada === TEF.PAY_GO) View.VISIBLE else View.GONE

        //5.O TEF ELGIN ainda não possuí a opçaõ "configuração".
        buttonConfigsTransaction.visibility =
            if (opcaoTefSelecionada === TEF.ELGIN_TEF) View.INVISIBLE else View.VISIBLE

        //6.Atualiza a decoração da opção TEF selecionada.
        buttonPaygoOption.backgroundTintList = AppCompatResources.getColorStateList(
            this,
            if (opcaoTefSelecionada === TEF.PAY_GO) R.color.verde else R.color.black
        )
        buttonMsitefOption.backgroundTintList = AppCompatResources.getColorStateList(
            this,
            if (opcaoTefSelecionada === TEF.M_SITEF) R.color.verde else R.color.black
        )
        buttonElginTefOption.backgroundTintList = AppCompatResources.getColorStateList(
            this,
            if (opcaoTefSelecionada === TEF.ELGIN_TEF) R.color.verde else R.color.black
        )

        //7.Sempre que um novo TEF for selecionado, a configuração de pagamento será atualizada para pagamento via crédito e parcelamento via loja.
        updatePaymentMethodBusinessRule(FormaPagamento.CREDITO)
        updateInstallmentMethodBusinessRule(FormaFinanciamento.LOJA)
    }

    //Atualiza as regras e decoração de tela, de acordo com a forma de parcelamento selecionada.
    private fun updateInstallmentMethodBusinessRule(formaFinanciamentoSelecionada: FormaFinanciamento) {
        //Atualiza a variável de controle.
        this.formaFinanciamentoSelecionada = formaFinanciamentoSelecionada

        //1. Caso a forma de parcelamento selecionada seja a vista, o campo "número de parcelas" deve ser "travado" em "1", caso contrário o campo deve ser destravado e inserido "2", pois é o minimo de parcelas para as outras modalidades.
        editTextInstallmentsTEF.isEnabled =
            formaFinanciamentoSelecionada !== FormaFinanciamento.A_VISTA
        editTextInstallmentsTEF.setText(if (formaFinanciamentoSelecionada === FormaFinanciamento.A_VISTA) "1" else "2")

        //2. Muda a coloração da borda dos botões de formas de parcelamento, conforme o método seleciondo.
        buttonStoreOption.backgroundTintList = AppCompatResources.getColorStateList(
            this,
            if (formaFinanciamentoSelecionada === FormaFinanciamento.LOJA) R.color.verde else R.color.black
        )
        buttonAdmOption.backgroundTintList = AppCompatResources.getColorStateList(
            this,
            if (formaFinanciamentoSelecionada === FormaFinanciamento.ADM) R.color.verde else R.color.black
        )
        buttonCashOption.backgroundTintList = AppCompatResources.getColorStateList(
            this,
            if (formaFinanciamentoSelecionada === FormaFinanciamento.A_VISTA) R.color.verde else R.color.black
        )
    }

    //Atualiza as regras e decoração de tela, de acordo com a forma de pagamento selecionada.
    private fun updatePaymentMethodBusinessRule(formaPagamentoSelecionada: FormaPagamento) {
        //Atualiza a váriavel de controle.
        this.formaPagamentoSelecionada = formaPagamentoSelecionada

        //1. Caso a opção de débito seja seleciona, o campo "número de parcelas" devem sumir, caso a opção selecionada seja a de crédito, o campo deve reaparecer.
        linearLayoutNumberOfInstallmentsTEF.visibility =
            if (formaPagamentoSelecionada === FormaPagamento.DEBITO) View.INVISIBLE else View.VISIBLE

        //2. Caso a opção de débito seja selecionada, os botões "tipos de parcelamento" devem sumir, caso a opção de crédito seja selecionada, devem reaparecer.
        linearLayoutInstallmentsMethodsTEF.visibility =
            if (formaPagamentoSelecionada === FormaPagamento.DEBITO) View.INVISIBLE else View.VISIBLE

        //3. Muda a coloração da borda dos botões de formas de pagamento, conforme o método seleciondo.
        buttonCreditOption.backgroundTintList = AppCompatResources.getColorStateList(
            this,
            if (formaPagamentoSelecionada === FormaPagamento.CREDITO) R.color.verde else R.color.black
        )
        buttonDebitOption.backgroundTintList = AppCompatResources.getColorStateList(
            this,
            if (formaPagamentoSelecionada === FormaPagamento.DEBITO) R.color.verde else R.color.black
        )
        buttonVoucherOption.backgroundTintList = AppCompatResources.getColorStateList(
            this,
            if (formaPagamentoSelecionada === FormaPagamento.TODOS) R.color.verde else R.color.black
        )
    }

    private fun startActionTEF(acao: Acao?) {
        when (opcaoTefSelecionada) {
            TEF.PAY_GO -> sendPaygoParams(acao!!)
            TEF.M_SITEF -> sendMSitefParams(acao!!)
            TEF.ELGIN_TEF -> sendElginTefParams(acao!!)
        }
    }

    //Retorna o valor monetário inserido, de maneira limpa. (Os TEFs devem receber o valor em centavos, 2000 para 20 reais, por exemplo).
    private fun getTextValueTEFClean(): String? {
        //As vírgulas e pontos inseridas pelas máscaras são retiradas.
        return editTextValueTEF.text.toString().replace(",".toRegex(), "")
            .replace("\\.".toRegex(), "")
    }

    private fun sendElginTefParams(acao: Acao) {
        //Configura o valor da transação.
        intentToElginTef.putExtra("valor", getTextValueTEFClean())
        when (acao) {
            Acao.VENDA -> {
                intentToElginTef.putExtra("modalidade", getSelectedPaymentCode())
                when (formaPagamentoSelecionada) {
                    FormaPagamento.CREDITO -> {
                        intentToElginTef.putExtra(
                            "numParcelas",
                            editTextInstallmentsTEF.text.toString()
                        )
                        when (formaFinanciamentoSelecionada) {
                            FormaFinanciamento.A_VISTA -> intentToElginTef.putExtra(
                                "transacoesHabilitadas",
                                "26"
                            )
                            FormaFinanciamento.LOJA -> intentToElginTef.putExtra(
                                "transacoesHabilitadas",
                                "27"
                            )
                            FormaFinanciamento.ADM -> intentToElginTef.putExtra(
                                "transacoesHabilitadas",
                                "28"
                            )
                        }
                    }

                    FormaPagamento.DEBITO -> {
                        intentToElginTef.putExtra("transacoesHabilitadas", "16")
                        intentToElginTef.putExtra("numParcelas", "")
                    }
                }
            }
            Acao.CANCELAMENTO -> {
                if (lastElginTefNSU.isEmpty()) {
                    alertMessageStatus(
                        "Alert",
                        "É necessário realizar uma transação antres para realizar o cancelamento no TEF ELGIN!"
                    )
                    return
                }
                intentToElginTef.putExtra("modalidade", "200")

                //Data do dia de hoje, usada como um dos parâmetros necessário para o cancelamento de transação no TEF Elgin.
                val todayDate = Date()

                //Objeto capaz de formatar a date para o formato aceito pelo Elgin TEF ("aaaaMMdd") (20220923).
                val dateFormatter = SimpleDateFormat("yyyyMMdd")
                val todayDateAsString: String = dateFormatter.format(todayDate)
                intentToElginTef.putExtra("data", todayDateAsString)
                intentToElginTef.putExtra("NSU_SITEF", lastElginTefNSU)
            }
        }
        startActivityForResult(intentToElginTef, REQUEST_CODE_ELGINTEF)
    }

    fun sendPaygoParams(acao: Acao) {
        val mapValues: MutableMap<String?, Any?> = HashMap()

        //Se for uma venda ou cancelamento, deve ser feito a configuração a seguir para a classe que lidará com o pagamento via paygo.
        if (acao !== Acao.CONFIGURACAO) {
            mapValues["valor"] = getTextValueTEFClean()
            mapValues["parcelas"] = editTextInstallmentsTEF.text.toString().toInt()
            mapValues["formaPagamento"] = formaPagamentoSelecionada
            mapValues["tipoParcelamento"] = formaFinanciamentoSelecionada
            when (acao) {
                Acao.VENDA -> paygo.efetuaTransacao(Operacoes.VENDA, mapValues)
                Acao.CANCELAMENTO -> paygo.efetuaTransacao(Operacoes.CANCELAMENTO, mapValues)
            }
        } else {
            paygo.efetuaTransacao(Operacoes.ADMINISTRATIVA, mapValues)
        }
    }

    fun optionReturnPaygo(mcontext: Activity, map: Map<*, *>) {
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
        alertDialog.setPositiveButton("OK") { dialog, which -> dialog.dismiss() }
        alertDialog.create()
        alertDialog.show()

        println("imageViewViaPaygo: " + Companion.imageViewViaPaygo)
    }

    private fun setImageViaPaygo(imageViaBase64: String) {
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

    fun isEntriesValid(): Boolean {
        return if (isValueNotEmpty(editTextValueTEF.text.toString())) {
            if (isInstallmentEmptyOrLessThanZero(editTextInstallmentsTEF.text.toString())) {
                if (opcaoTefSelecionada === TEF.M_SITEF) { //Somente se o TEF escolhido for MSitef é necessário validar o IP.
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

    //Còdigo para a forma de pagamento selecionada.
    fun getSelectedPaymentCode(): String? {
        return when (formaPagamentoSelecionada) {
            FormaPagamento.CREDITO -> "3"
            FormaPagamento.DEBITO -> "2"
            else -> "0"
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        //Os TEFs MSitef e TEF Elgin possuem o mesmo retorno.
        if (requestCode == REQUEST_CODE_MSITEF || requestCode == REQUEST_CODE_ELGINTEF) {

            //Se resultCode da intent for OK então a transação obteve sucesso.
            //Caso o resultCode da intent for de atividade cancelada e a data estiver diferente de nulo, é possível obter um retorno também.
            if (resultCode == RESULT_OK || resultCode == RESULT_CANCELED && data != null) {

                //O campos são os mesmos para ambos os TEFs.
                val COD_AUTORIZACAO = data?.getStringExtra("COD_AUTORIZACAO")
                val VIA_ESTABELECIMENTO = data?.getStringExtra("VIA_ESTABELECIMENTO")
                val COMP_DADOS_CONF = data?.getStringExtra("COMP_DADOS_CONF")
                val BANDEIRA = data?.getStringExtra("BANDEIRA")
                val NUM_PARC = data?.getStringExtra("NUM_PARC")
                val RELATORIO_TRANS = data?.getStringExtra("RELATORIO_TRANS")
                val REDE_AUT = data?.getStringExtra("REDE_AUT")
                val NSU_SITEF = data?.getStringExtra("NSU_SITEF")
                val VIA_CLIENTE = data?.getStringExtra("VIA_CLIENTE")
                val TIPO_PARC = data?.getStringExtra("TIPO_PARC")
                val CODRESP = data?.getStringExtra("CODRESP")
                val NSU_HOT = data?.getStringExtra("NSU_HOST")

                //Se o código de resposta estiver nulo ou tiver valor inteiro inferior a 0, a transação não ocorreu como esperado.
                if (CODRESP == null || CODRESP.toInt() < 0) {
                    alertMessageStatus("Alerta", "Ocorreu um erro durante a transação.")
                } else {
                    //Atualiza a via cliente com a via atual recebida.
                    viaClienteMsitef = VIA_CLIENTE!!

                    //Atualiza a caixa de visualização na tela com a via do cliente.
                    textViewViaTef.text = viaClienteMsitef

                    //Atualiza o NSU de cancelamento de acordo, necessário para o cancelamento, caso requisitado, desta ultima venda.
                    lastElginTefNSU = NSU_SITEF!!

                    //Se a via não estiver nula, significando uma operação com completo sucesso, é feita a impressão da via.
                    if (viaClienteMsitef != null) {
                        printerViaClienteMsitef(viaClienteMsitef)
                    }

                    //Alerta na tela o sucesso da operação.
                    alertMessageStatus("Alerta", "Ação realizada com sucesso.")
                }
            } else {
                alertMessageStatus("Alerta", "Ocorreu um erro durante a transação.")
            }
        }
    }

    fun sendMSitefParams(acao: Acao) {
        //Parâmetros de configuração do M-Sitef.
        intentToMsitef.putExtra("empresaSitef", "00000000")
        intentToMsitef.putExtra("enderecoSitef", editTextIpTEF.text.toString())
        intentToMsitef.putExtra("operador", "0001")
        intentToMsitef.putExtra("data", "20200324")
        intentToMsitef.putExtra("hora", "130358")
        intentToMsitef.putExtra("numeroCupom", java.lang.String.valueOf(Random().nextInt(99999)))
        intentToMsitef.putExtra("valor", getTextValueTEFClean())
        intentToMsitef.putExtra("CNPJ_CPF", "03654119000176")
        intentToMsitef.putExtra("comExterna", "0")
        when (acao) {
            Acao.VENDA -> {
                intentToMsitef.putExtra("modalidade", getSelectedPaymentCode())
                when (formaPagamentoSelecionada) {
                    FormaPagamento.CREDITO -> {
                        intentToMsitef.putExtra(
                            "numParcelas",
                            editTextInstallmentsTEF.text.toString()
                        )
                        when (formaFinanciamentoSelecionada) {
                            FormaFinanciamento.A_VISTA -> intentToMsitef.putExtra(
                                "transacoesHabilitadas",
                                "26"
                            )
                            FormaFinanciamento.LOJA -> intentToMsitef.putExtra(
                                "transacoesHabilitadas",
                                "27"
                            )
                            FormaFinanciamento.ADM -> intentToMsitef.putExtra(
                                "transacoesHabilitadas",
                                "28"
                            )
                        }
                    }

                    FormaPagamento.DEBITO -> {
                        intentToMsitef.putExtra("transacoesHabilitadas", "16")
                        intentToMsitef.putExtra("numParcelas", "")
                    }
                }
            }

            Acao.CANCELAMENTO -> {
                intentToMsitef.putExtra("modalidade", "200")
                intentToMsitef.putExtra("transacoesHabilitadas", "")
                intentToMsitef.putExtra("isDoubleValidation", "0")
                intentToMsitef.putExtra("restricoes", "")
                intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm")
            }

            Acao.CONFIGURACAO -> {
                intentToMsitef.putExtra("modalidade", "110")
                intentToMsitef.putExtra("isDoubleValidation", "0")
                intentToMsitef.putExtra("restricoes", "")
                intentToMsitef.putExtra("transacoesHabilitadas", "")
                intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm")
                intentToMsitef.putExtra("restricoes", "transacoesHabilitadas=16;26;27")
            }
        }
        startActivityForResult(intentToMsitef, REQUEST_CODE_MSITEF)
    }

    fun printerViaClienteMsitef(viaCliente: String?) {
        val mapValues: MutableMap<String?, Any?> = HashMap()
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
        alertDialog.setPositiveButton("OK") { dialog, _ -> dialog.dismiss() }
        alertDialog.create()
        alertDialog.show()
    }

    private fun isIpValid(ip: String): Boolean {
        val pattern =
            Pattern.compile("^(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))$")
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