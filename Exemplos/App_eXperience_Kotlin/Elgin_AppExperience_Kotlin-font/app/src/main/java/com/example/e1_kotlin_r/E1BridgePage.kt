package com.example.e1_kotlin_r

import android.content.Context
import android.content.DialogInterface
import android.graphics.Typeface
import android.icu.text.SimpleDateFormat
import android.os.Build
import android.os.Bundle
import android.text.InputType
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.LinearLayout
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.content.res.AppCompatResources
import com.example.e1_kotlin_r.InputMasks.InputMaskMoney
import com.example.e1_kotlin_r.Services.E1BridgeService
import java.math.BigDecimal
import java.util.*
import java.util.regex.Pattern


class E1BridgePage : AppCompatActivity() {
    //Objeto da classe E1BridgeService para uso das funções Bridge
    lateinit var bridgeService: E1BridgeService

    //EditTexts
    lateinit var editTextIpBridge: EditText
    lateinit var editTextValueBridge: EditText
    lateinit var editTextNumberOfInstallmentsBridge: EditText
    lateinit var editTextTransactionPort: EditText
    lateinit var editTextStatusPort: EditText
    lateinit var editTextPassword: EditText

    //LinearLayout que agem como botão
    lateinit var buttonCreditOptionBridge: LinearLayout
    lateinit var buttonDebitOptionBridge: LinearLayout
    lateinit var buttonStoreOptionBridge: LinearLayout
    lateinit var buttonAdmOptionBridge: LinearLayout
    lateinit var buttonAvistaOption: LinearLayout

    //Buttons
    lateinit var buttonSendTransactionBridge: Button
    lateinit var buttonCancelTransactionBridge: Button
    lateinit var buttonAdministrativeOperation: Button
    lateinit var buttonPrintTestCoupon: Button
    lateinit var buttonConsultTerminalStatus: Button
    lateinit var buttonConsultConfiguredTimeout: Button
    lateinit var buttonConsultLastTransaction: Button
    lateinit var buttonSetTerminalPassword: Button
    lateinit var buttonSetTransactionTimeout: Button

    //Layout que devem ficar invisiveis para determinadas operações
    lateinit var linearLayoutNumberOfInstallments: LinearLayout
    lateinit var linearLayoutTypeInstallments: LinearLayout

    //Checkbox enviar senha
    lateinit var checkboxSendPassword: CheckBox
    lateinit private var mContext: Context

    //OpçÕes selecionadas
    private var selectedPaymentMethod: String? = null
    private var selectedInstallmentType = 0

    //Definindo tipo de pagamento
    val PAGAMENTO_CREDITO = "Crédito"
    val PAGAMENTO_DEBITO = "Débito"

    //Código que identifica PDV que está se conectando (usado para as operações de vendaCredito,vendaDebito,cancelamentoVenda, operacaoAdm)
    val PDV = "PDV1"

    //Número de parcelas em int
    private var numberOfInstallments = 0

    //Boolean que guarda se o Bridge deve ou não enviar uma senha ao tentar qualquer transação
    private var sendPassword = false

    //String reservada para receber os dados carregados dos xmls de exemplo utilizados na funcao de impressao de cupom
    private val xmlNFCeInString: String? = null
    private val xmlSatInString: String? = null
    private val xmlSatCancellationInString: String? = null

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_e1_bridge_page)

        //Salvando referencia do contexto
        mContext = this

        //Intanciando objeto da classe E1BridgeService
        bridgeService = E1BridgeService()

        //Atribuição das Views

        //Checkbox
        checkboxSendPassword = findViewById(R.id.checkboxSendPassword)

        //EditTexts
        editTextIpBridge = findViewById(R.id.editTextIpBridge)
        editTextValueBridge = findViewById(R.id.editTextValueBridge)
        editTextNumberOfInstallmentsBridge = findViewById(R.id.editTextNumberOfInstallmentsBridge)
        editTextTransactionPort = findViewById(R.id.editTextTransactionPort)
        editTextStatusPort = findViewById(R.id.editTextStatusPort)
        editTextPassword = findViewById(R.id.editTextPassword)

        //Aplicando Mask ao Valor
       // editTextValueBridge.addTextChangedListener(InputMaskMoney(editTextValueBridge))

        //Formas de pagamento
        buttonCreditOptionBridge = findViewById(R.id.buttonCreditOptionBridge)
        buttonDebitOptionBridge = findViewById(R.id.buttonDebitOptionBridge)


        //Tipos de Parcelamento
        buttonStoreOptionBridge = findViewById(R.id.buttonStoreOptionBridge)
        buttonAdmOptionBridge = findViewById(R.id.buttonAdmOptionBridge)
        buttonAvistaOption = findViewById(R.id.buttonAvistaOptionBridge)

        //Botões
        buttonSendTransactionBridge = findViewById(R.id.buttonSendTransactionBridge)
        buttonCancelTransactionBridge = findViewById(R.id.buttonCancelTransactionBridge)
        buttonAdministrativeOperation = findViewById(R.id.buttonAdministrativeOperation)
        buttonPrintTestCoupon = findViewById(R.id.buttonPrintTestCoupon)
        buttonConsultTerminalStatus = findViewById(R.id.buttonConsultTerminalStatus)
        buttonConsultConfiguredTimeout = findViewById(R.id.buttonConsultConfiguredTimeout)
        buttonConsultLastTransaction = findViewById(R.id.buttonConsultLastTransaction)
        buttonSetTerminalPassword = findViewById(R.id.buttonSetTerminalPassword)
        buttonSetTransactionTimeout = findViewById(R.id.buttonSetTransactionTimeout)

        //Layout atribuídos para se tornarem invisivesi/visiveis conforme o tipo de pagamento selecionado
        linearLayoutNumberOfInstallments = findViewById(R.id.linearLayoutNumberOfInstallments)
        linearLayoutTypeInstallments = findViewById(R.id.linearLayoutTypeInstallments)

        //Valores iniciais
        editTextIpBridge.setText("192.168.0.104")
        editTextValueBridge.setText("2000")

        //O padrão da aplicação é iniciar com a opção de pagamento por crédito com parcelamento a vista, portanto o número de parcelas deve ser obrigatoriamente 1
        editTextNumberOfInstallmentsBridge.setText("1")
        numberOfInstallments = 1
        editTextNumberOfInstallmentsBridge.setEnabled(false)


        //Valores padrões para as portas
        editTextTransactionPort.setText("3000")
        editTextStatusPort.setText("3001")

        //Senha vazia
        editTextPassword.setText("")

        //Seleção inicial dos tipo de pagamento / forma de parcelamento
        selectedPaymentMethod = PAGAMENTO_CREDITO
        selectedInstallmentType = FINANCIAMENTO_A_VISTA
        buttonCreditOptionBridge.setBackgroundTintList(
            AppCompatResources.getColorStateList(
                this,
                R.color.verde
            )
        )
        buttonAvistaOption.setBackgroundTintList(
            AppCompatResources.getColorStateList(
                this,
                R.color.verde
            )
        )
        checkboxSendPassword.setOnClickListener(View.OnClickListener {
            if (checkboxSendPassword.isChecked()) {
                editTextPassword.setEnabled(true)
                sendPassword = true
            } else {
                editTextPassword.setText("")
                editTextPassword.setEnabled(false)
                sendPassword = false
            }
        })

        //Botões tipos de pagamento
        buttonCreditOptionBridge.setOnClickListener(View.OnClickListener { //Mudando tipo de pagamento escolhido/redecorando botões/ reabilitando layout de parcelamento e número de parcelas
            buttonCreditOptionBridge.setBackgroundTintList(
                (AppCompatResources.getColorStateList(
                    mContext,
                    R.color.verde
                ))
            )
            buttonDebitOptionBridge.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            linearLayoutNumberOfInstallments.setVisibility(View.VISIBLE)
            linearLayoutTypeInstallments.setVisibility(View.VISIBLE)
            selectedPaymentMethod = PAGAMENTO_CREDITO
        })
        buttonDebitOptionBridge.setOnClickListener(View.OnClickListener { //Mudando tipo de pagamento escolhido/redecorando botões/ desabilitando layout de parcelamento e número de parcelas
            buttonDebitOptionBridge.setBackgroundTintList(
                (AppCompatResources.getColorStateList(
                    mContext,
                    R.color.verde
                ))
            )
            buttonCreditOptionBridge.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            linearLayoutNumberOfInstallments.setVisibility(View.INVISIBLE)
            linearLayoutTypeInstallments.setVisibility(View.INVISIBLE)
            selectedPaymentMethod = PAGAMENTO_DEBITO
        })

        //Botóes tipo de parcelamento
        buttonStoreOptionBridge.setOnClickListener(View.OnClickListener { //Muda a decoração dos botões e atribuindo tipo de parcelamento
            buttonStoreOptionBridge.setBackgroundTintList(
                (AppCompatResources.getColorStateList(
                    mContext,
                    R.color.verde
                ))
            )
            buttonAdmOptionBridge.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            buttonAvistaOption.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            selectedInstallmentType = FINANCIAMENTO_PARCELADO_ESTABELECIMENTO
            editTextNumberOfInstallmentsBridge.setText("2")
            numberOfInstallments = 1
            editTextNumberOfInstallmentsBridge.setEnabled(true)
        })
        buttonAdmOptionBridge.setOnClickListener(View.OnClickListener { //Muda a decoração dos botões e atribuindo tipo de parcelamento
            buttonStoreOptionBridge.setBackgroundTintList(
                (AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                ))
            )
            buttonAdmOptionBridge.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.verde
                )
            )
            buttonAvistaOption.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            selectedInstallmentType = FINANCIAMENTO_PARCELADO_EMISSOR
            editTextNumberOfInstallmentsBridge.setText("2")
            numberOfInstallments = 1
            editTextNumberOfInstallmentsBridge.setEnabled(true)
        })
        buttonAvistaOption.setOnClickListener(View.OnClickListener { //Muda a decoração dos botões e atribuindo tipo de parcelamento
            buttonStoreOptionBridge.setBackgroundTintList(
                (AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                ))
            )
            buttonAdmOptionBridge.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.black
                )
            )
            buttonAvistaOption.setBackgroundTintList(
                AppCompatResources.getColorStateList(
                    mContext,
                    R.color.verde
                )
            )
            selectedInstallmentType = FINANCIAMENTO_A_VISTA
            editTextNumberOfInstallmentsBridge.setText("1")
            numberOfInstallments = 1
            editTextNumberOfInstallmentsBridge.setEnabled(false)
        })

        //Botões Transações/Operações E1Bridge
        buttonSendTransactionBridge.setOnClickListener(View.OnClickListener {
            /**
             * Valida e tenta atualizar a configuração de IP e Portas Transação/Status
             * Valida campo de Valor
             * Valida número de parcelas
             */
            /**
             * Valida e tenta atualizar a configuração de IP e Portas Transação/Status
             * Valida campo de Valor
             * Valida número de parcelas
             */
            if (tryToUpdateBridgeServer() && isValueValidToElginPay && isInstallmentsFieldValid) {
                //Habilita/Desabilita o envio de senha para validação no terminal
                shouldSendPassword()


                //o valor da transação deve ser passado em centavos; a virgula é removida.
                val totalValue = editTextValueBridge.getText().toString().replace(",".toRegex(), "")


                //Crédito ou Débito
                /**
                 * @param generateRandomForBridgeTransactions() é um int aletório no que pode estar entre o valor 0 e 999999 para servir como id da transação; afim de diferenciar uma transação da outra.
                 * @param PVD é uma String que serve como código identificador do pdv que enviou a operação.
                 */
                /**
                 * @param generateRandomForBridgeTransactions() é um int aletório no que pode estar entre o valor 0 e 999999 para servir como id da transação; afim de diferenciar uma transação da outra.
                 * @param PVD é uma String que serve como código identificador do pdv que enviou a operação.
                 */
                if ((selectedPaymentMethod == PAGAMENTO_CREDITO)) {
                    val resultadoOperacao: String = bridgeService.IniciaVendaCredito(
                        generateRandomForBridgeTransactions(),
                        PDV,
                        totalValue,
                        selectedInstallmentType,
                        numberOfInstallments
                    )
                    alertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao)
                } else {
                    val resultadoOperacao: String = bridgeService.IniciaVendaDebito(
                        generateRandomForBridgeTransactions(),
                        PDV,
                        totalValue
                    )
                    alertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao)
                }
            }
        })

        //A operacao de cancelameno de vende requer uma data, para fins de simplicação, usaremos apenas a data do mesmo dia
        //uma vez que as transações são fantasias
        buttonCancelTransactionBridge.setOnClickListener(View.OnClickListener { //Data do dia de hoje, usada como um dos parâmetros necessário para o cancelamento de transação no Elgin Pay
            val date = Date()

            //Objeto capaz de formatar a date para o formato aceito pelo Elgin Pay ("dd/mm/aa")
            val dateFormat = SimpleDateFormat("dd/MM/yy")

            //Aplicando formatação
            val todayDate = dateFormat.format(date)
            val builder = AlertDialog.Builder(mContext)

            //Definindo título do AlertDialog
            builder.setTitle("Código de Referência:")

            // Criando um EditText para pegar o input do usuário na caixa de diálogo
            val input = EditText(mContext)

            //Configurando o EditText para negrito e configurando o tipo de inserção para apenas número
            input.setTypeface(null, Typeface.BOLD)
            input.inputType = InputType.TYPE_CLASS_NUMBER

            //Tornando o dialógo não-cancelável
            builder.setCancelable(false)
            builder.setView(input)
            builder.setNegativeButton(
                "CANCELAR"
            ) { dialog, which -> dialog.dismiss() }

            //o valor da transação deve ser passado em centavos; a virgula é removida.
            val totalValue = editTextValueBridge.getText().toString().replace(",".toRegex(), "")
            builder.setPositiveButton("OK",
                DialogInterface.OnClickListener { dialog, whichButton ->
                    val saleRef = input.text.toString()

                    //Setando o foco de para o input do dialógo
                    input.requestFocus()
                    val imm = mContext.getSystemService(INPUT_METHOD_SERVICE) as InputMethodManager
                    imm.showSoftInput(input, InputMethodManager.SHOW_IMPLICIT)
                    if ((saleRef == "")) {
                        alertMessageStatus(
                            "Alerta",
                            "O campo código de referência da transação não pode ser vazio! Digite algum valor."
                        )
                        return@OnClickListener
                    } else {
                        if (tryToUpdateBridgeServer()) {
                            //Habilita/Desabilita o envio de senha para validação no terminal
                            shouldSendPassword()
                            val resultadoOperacao: String = bridgeService.IniciaCancelamentoVenda(
                                generateRandomForBridgeTransactions(),
                                PDV,
                                totalValue,
                                todayDate,
                                saleRef
                            )
                            alertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao)
                        }
                    }
                })
            builder.show()
        })
        buttonAdministrativeOperation.setOnClickListener(View.OnClickListener {
            val operations = arrayOf(
                "Operação Administrativa",
                "Operação de Instalação",
                "Operação de Configuração",
                "Operação de Manutenção",
                "Teste de Comunicação",
                "Reimpressão de Comprovante"
            )
            val builder = AlertDialog.Builder(mContext)
            builder.setTitle("ESCOLHA A OPERAÇÃO ADMINISTRATIVA")

            //Tornando o dialógo não-cancelável
            builder.setCancelable(false)
            builder.setNegativeButton(
                "CANCELAR"
            ) { dialog, which -> dialog.dismiss() }
            builder.setItems(
                operations
            ) { dialog, which ->
                //IniciaOperaçãoAdministrativa de acordo com qual operação foi selecionada.
                if (tryToUpdateBridgeServer()) {
                    //Habilita/Desabilita o envio de senha para validação no terminal
                    shouldSendPassword()

                    //Neste caso o int which que é um parametro fornecido assim que uma opção é selecionada corresponde diretamente aos valores da documentação.
                    val resultadoOperacao: String =
                        bridgeService.IniciaOperacaoAdministrativa(
                            generateRandomForBridgeTransactions(),
                            PDV,
                            which
                        )
                    alertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao)
                }
            }
            builder.show()
        })
        buttonPrintTestCoupon.setOnClickListener(View.OnClickListener {
            val couponTypes = arrayOf(
                "Imprimir Cupom NFCe",
                "Imprimir Cupom Sat",
                "Imprimir Cupom Sat Cancelamento"
            )
            val builder = AlertDialog.Builder(mContext)
            builder.setTitle("ESCOLHA O TIPO DE CUPOM")
            builder.setNegativeButton(
                "CANCELAR"
            ) { dialog, which -> dialog.dismiss() }
            builder.setItems(
                couponTypes
            ) { dialog, selected ->
                //IniciaOperaçãoAdministrativa de acordo com qual operação foi selecionada.
                if (tryToUpdateBridgeServer()) {
                    //Habilita/Desabilita o envio de senha para validação no terminal
                    shouldSendPassword()

                    //Variaveis para comparacao do tipo selecionado
                    val NFCE_COUPON = 0
                    val SAT_COUPON = 1
                    val SAT_CANCELLATION_COUPON = 2
                    if (selected == NFCE_COUPON) {
                        val XML_EXEMPLO_CUPOM_NFCE =
                            "<?xml version='1.0' encoding='utf-8'?><NFe xmlns=\"http://www.portalfiscal.inf.br/nfe\"><infNFe Id=\"NFe13220114200166000166650070000001029870832698\" versao=\"4.00\"><ide><cUF>13</cUF><cNF>87083269</cNF><natOp>venda</natOp><mod>65</mod><serie>7</serie><nNF>102</nNF><dhEmi>2022-01-26T11:38:37-03:00</dhEmi><tpNF>1</tpNF><idDest>1</idDest><cMunFG>1302603</cMunFG><tpImp>4</tpImp><tpEmis>1</tpEmis><cDV>8</cDV><tpAmb>2</tpAmb><finNFe>1</finNFe><indFinal>1</indFinal><indPres>1</indPres><procEmi>0</procEmi><verProc>pynota 0.1.0</verProc><dhCont>2022-01-26T11:38:38-03:00</dhCont><xJust>Conexão com a sefaz indisponível</xJust></ide><emit><CNPJ>14200166000166</CNPJ><xNome>NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xNome><xFant>Elgin S/A</xFant><enderEmit><xLgr>Avenida Manaus Dois Mil</xLgr><nro>1</nro><xBairro>Japiim</xBairro><cMun>1302603</cMun><xMun>Manaus</xMun><UF>AM</UF><CEP>69076448</CEP><cPais>1058</cPais><xPais>Brasil</xPais><fone>1133835816</fone></enderEmit><IE>062012991</IE><IM>793</IM><CNAE>6202300</CNAE><CRT>3</CRT></emit><det nItem=\"1\"><prod><cProd>123</cProd><cEAN>SEM GTIN</cEAN><xProd>NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xProd><NCM>22030000</NCM><CEST>0302100</CEST><indEscala>S</indEscala><CFOP>5102</CFOP><uCom>UN</uCom><qCom>1</qCom><vUnCom>1</vUnCom><vProd>1.00</vProd><cEANTrib>5000000000357</cEANTrib><uTrib>UN</uTrib><qTrib>1</qTrib><vUnTrib>1</vUnTrib><indTot>1</indTot></prod><imposto><ICMS><ICMS40><orig>0</orig><CST>41</CST></ICMS40></ICMS><PIS><PISAliq><CST>01</CST><vBC>1.00</vBC><pPIS>1.6500</pPIS><vPIS>0.02</vPIS></PISAliq></PIS><COFINS><COFINSAliq><CST>01</CST><vBC>1.00</vBC><pCOFINS>7.6000</pCOFINS><vCOFINS>0.08</vCOFINS></COFINSAliq></COFINS></imposto></det><total><ICMSTot><vBC>0.00</vBC><vICMS>0.00</vICMS><vICMSDeson>0.00</vICMSDeson><vFCP>0.00</vFCP><vBCST>0.00</vBCST><vST>0.00</vST><vFCPST>0.00</vFCPST><vFCPSTRet>0.00</vFCPSTRet><vProd>1.00</vProd><vFrete>0.00</vFrete><vSeg>0.00</vSeg><vDesc>0.00</vDesc><vII>0.00</vII><vIPI>0.00</vIPI><vIPIDevol>0.00</vIPIDevol><vPIS>0.02</vPIS><vCOFINS>0.08</vCOFINS><vOutro>0.00</vOutro><vNF>1.00</vNF><vTotTrib>0.00</vTotTrib></ICMSTot></total><transp><modFrete>9</modFrete><vol><qVol>12</qVol><esp>VOL</esp><marca>Elgin SA</marca><nVol>0 A 0</nVol><pesoL>20.123</pesoL><pesoB>30.123</pesoB><lacres><nLacre>3000</nLacre></lacres></vol></transp><pag><detPag><indPag>0</indPag><tPag>01</tPag><vPag>1.00</vPag></detPag><vTroco>0.00</vTroco></pag><infRespTec><CNPJ>29604796000173</CNPJ><xContato>riosoft</xContato><email>contato@veraciti.com.br</email><fone>92998745445</fone><idCSRT>12</idCSRT><hashCSRT>qvTGHdzF6KLavt4PO0gs2a6pQ00=</hashCSRT></infRespTec></infNFe><infNFeSupl><qrCode>https://sistemas.sefaz.am.gov.br/nfceweb-hom/consultarNFCe.jsp?p=13220114200166000166650070000001029870832698|2|2|26|1.00|6c4e62336b4d4f33365966626f4f4168556473767244695233674d3d|1|CCE5214E1F0BB8B6AB4F14B348C65F61C90551E2</qrCode><urlChave>www.sefaz.am.gov.br/nfce/consulta</urlChave></infNFeSupl><Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#\"><SignedInfo><CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/><SignatureMethod Algorithm=\"http://www.w3.org/2000/09/xmldsig#rsa-sha1\"/><Reference URI=\"#NFe13220114200166000166650070000001029870832698\"><Transforms><Transform Algorithm=\"http://www.w3.org/2000/09/xmldsig#enveloped-signature\"/><Transform Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/></Transforms><DigestMethod Algorithm=\"http://www.w3.org/2000/09/xmldsig#sha1\"/><DigestValue>lNb3kMO36YfboOAhUdsvrDiR3gM=</DigestValue></Reference></SignedInfo><SignatureValue>ImcjGhmNZQDDfahkYGHecWYBk4/LwNql3JscIK3wz5igswa5YA3q9RSqbvP4hUhubN8KowfvRqtvpteCteYp1afxWlBAkPx5CmVDMiweyya5CRlfZlDF37sE6deHQkI3kQ9hOKCNsZn2lmanPeiV1YJkwjMhiY3GnLVQDxeu8fJqr9MALXa5gaOe7WWFyCTd/B+9MQjhEKAnf4SdmyC7VLbBIY5lYWVvjPvoisThAShVZdn7IDI2AzKAIEmAl7QJWHplKZ1oylRti+l/DUVQzvG8xNq3pzHHeXIcmlgIONG+HSNeaQZ8OLJ2r9RgpRy+H+mHIEyjS/qtCPG1Bi70ow==</SignatureValue><KeyInfo><X509Data><X509Certificate>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</X509Certificate></X509Data></KeyInfo></Signature></NFe>"
                        val INDEXCSC_EXEMPLO = 1
                        val CSC_EXEMPLO = "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES"
                        val resultadoOperacao: String = bridgeService.ImprimirCupomNfce(
                            XML_EXEMPLO_CUPOM_NFCE,
                            INDEXCSC_EXEMPLO,
                            CSC_EXEMPLO
                        )
                        alertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao)
                    } else if (selected == SAT_COUPON) {
                        val XML_CUPOM_EXEMPLO_SAT =
                            ("<?xml version=\"1.0\" encoding=\"UTF-8\"?><CFe><infCFe Id=\"CFe13190814200166000166599000178400000148075811\" versao=\"0.07\" versaoDadosEnt=\"0.07\" versaoSB=\"010103\"><ide><cUF>13</cUF><cNF>807581</cNF><mod>59</mod><nserieSAT>900017840</nserieSAT><nCFe>000014</nCFe><dEmi>20190814</dEmi><hEmi>163227</hEmi><cDV>1</cDV><tpAmb>2</tpAmb><CNPJ>16716114000172</CNPJ><signAC>SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT</signAC><assinaturaQRCODE>kAmMUV2AFOP11vsbAwb4S1MrcnzIm8o6trefwjpRvpJaNGeXXcM2GKbs+aALc3WDxrimeOf9BdgoZl29RvtC1DmvqZ56oVEoRz0ymia1tHUdGPzuO035OuiEseEj3+gU+8NzGzqWQIJgqdgLOZgnmUP2aBOkC0QcokhHPVfwm9tJFQnQkzGzu4692+LtpxhLwEhnFjoZh+1hpBXn5AEcbMS4Lx751qvFlfZX0hsYJf5pKcFH88E3byU82MU8UD5p9fyX2qL5Ae+Uql1VLPqoJOsQmC2BCBkMW7oQRCCR0osz6eLX1DHHJU+stxKCkITlQnz6XJd4LKXifGZuZ25+Uw==</assinaturaQRCODE><numeroCaixa>001</numeroCaixa></ide><emit><CNPJ>14200166000166</CNPJ><xNome>ELGIN INDUSTRIAL DA AMAZONIA LTDA</xNome><enderEmit><xLgr>AVENIDA ABIURANA</xLgr><nro>579</nro><xBairro>DIST INDUSTRIAL</xBairro><xMun>MANAUS</xMun><CEP>69075010</CEP></enderEmit><IE>111111111111</IE><cRegTrib>3</cRegTrib><indRatISSQN>N</indRatISSQN></emit><dest><CPF>14808815893</CPF></dest><det nItem=\"1\"><prod><cProd>0000000000001</cProd><xProd>PRODUTO NFCE 1</xProd><NCM>94034000</NCM><CFOP>5102</CFOP><uCom>UN</uCom><qCom>1.0000</qCom><vUnCom>3.51</vUnCom><vProd>3.51</vProd><indRegra>T</indRegra><vItem>3.00</vItem><vRatDesc>0.51</vRatDesc></prod><imposto><ICMS><ICMS00><Orig>0</Orig><CST>00</CST><pICMS>7.00</pICMS><vICMS>0.21</vICMS></ICMS00></ICMS><PIS><PISAliq><CST>01</CST><vBC>6.51</vBC><pPIS>0.0165</pPIS><vPIS>0.11</vPIS></PISAliq></PIS><COFINS><COFINSAliq><CST>01</CST><vBC>6.51</vBC><pCOFINS>0.0760</pCOFINS><vCOFINS>0.49</vCOFINS></COFINSAliq></COFINS></imposto></det><total><ICMSTot><vICMS>0.21</vICMS><vProd>3.51</vProd><vDesc>0.00</vDesc><vPIS>0.11</vPIS><vCOFINS>0.49</vCOFINS><vPISST>0.00</vPISST><vCOFINSST>0.00</vCOFINSST><vOutro>0.00</vOutro></ICMSTot><vCFe>3.00</vCFe><DescAcrEntr><vDescSubtot>0.51</vDescSubtot></DescAcrEntr><vCFeLei12741>0.56</vCFeLei12741></total><pgto><MP><cMP>01</cMP><vMP>6.51</vMP></MP><vTroco>3.51</vTroco></pgto><infAdic><infCpl>Trib aprox R$ 0,36 federal, R$ 1,24 estadual e R$ 0,00 municipal&lt;br&gt;CAIXA: 001 OPERADOR: ROOT</infCpl><obsFisco xCampo=\"04.04.05.04\"><xTexto>Comete crime quem sonega</xTexto></obsFisco></infAdic></infCFe><Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#\"><SignedInfo><CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/><SignatureMethod Algorithm=\"http://www.w3.org/2001/04/xmldsig-more#rsa-sha256\"/><Reference URI=\"#CFe13190814200166000166599000178400000148075811\"><Transforms><Transform Algorithm=\"http://www.w3.org/2000/09/xmldsig#enveloped-signature\"/><Transform Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/></Transforms><DigestMethod Algorithm=\"http://www.w3.org/2001/04/xmlenc#sha256\"/><DigestValue>rozf1i6JehNUqx8tfP1FG3QVUIxlrcHgozaB4LAjkDM=</DigestValue></Reference></SignedInfo><SignatureValue>cAiGHfx3QxIhrmz3b36Z1EBs/TzLXKQkE5Ykn3Q1HOEKpshyZRaOLKlg6LiHjFgaZNKZnwWkKLQav2Af342Xc3XIkIjOF72vmLZxd/u6naZ3lYVWcf/G2YYdMpUAoqfpihLilVZZMqAIQQ/SW76mGstSI743lc0FL1NuMXSvAT3b9X1JcaC1r4uHezYGp/iSrX/lxfdnu4ZP2gzJ7KEnRvrTm9TCF3mA0zhDF5iem4vJC8bS/+OjhKhKfDeyxkrPDQc8+n7brALOYWbR3RUleMMKCIQf/nxaEy9XEsb53rC4KXLe5JL15YCxQ8TRYU6vvLoqFecd72HebFQ/C2BvgA==</SignatureValue><KeyInfo><X509Data>\n" +
                                    "<X509Certificate>MIIFzTCCBLWgAwIBAgICH9owDQYJKoZIhvcNAQENBQAwaDELMAkGA1UEBhMCQlIxEjAQBgNVBAgMCVNBTyBQQVVMTzESMBAGA1UEBwwJU0FPIFBBVUxPMQ8wDQYDVQQKDAZBQ0ZVU1AxDzANBgNVBAsMBkFDRlVTUDEPMA0GA1UEAwwGQUNGVVNQMB4XDTE5MDUxNjEyMjU1NFoXDTI0MDUxNDEyMjU1NFowgbIxCzAJBgNVBAYTAkJSMREwDwYDVQQIDAhBbWF6b25hczERMA8GA1UECgwIU0VGQVotU1AxGDAWBgNVBAsMD0FDIFNBVCBTRUZBWiBTUDEoMCYGA1UECwwfQXV0b3JpZGFkZSBkZSBSZWdpc3RybyBTRUZBWiBTUDE5MDcGA1UEAwwwRUxHSU4gSU5EVVNUUklBTCBEQSBBTUFaT05JQSBMVERBOjE0MjAwMTY2MDAwMTY2MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuKdsN2mi5OserALssgKyPBZBnt3TeytHObTV2xboIeZ8nQ3qDbzovkpxwvBLEKCI1+5sWkZUBmQAqDXTv4Zu/oVPmgVAjLOQszH9mEkyrhlT5tRxyptGKCN58nfx150rHPvov9ct9uizR4S5+nDvMSLNVFpcpbT2y+vnfmMPQzOec8SbKdSPy1dytHl+id9r4XD/s/fXc19URb9XXtMui+praC9vWasiJsFScnTJScIdLwqZsCAmDQeRFHX1e57vCLNxFNCfKzgCRd9VhCQE03kXrz+xo7nJGdXP2baABvh3mi6ifHeuqPXw5JBwjemS0KkRZ5PhE5Ndkih86ZAeIwIDAQABo4ICNDCCAjAwCQYDVR0TBAIwADAOBgNVHQ8BAf8EBAMCBeAwLAYJYIZIAYb4QgENBB8WHU9wZW5TU0wgR2VuZXJhdGVkIENlcnRpZmljYXRlMB0GA1UdDgQWBBRS6g1qRE9lsk/8dfDlVjhISI/1wTAfBgNVHSMEGDAWgBQVtOORhiQs6jNPBR4tL5O3SJfHeDATBgNVHSUEDDAKBggrBgEFBQcDAjBDBgNVHR8EPDA6MDigNqA0hjJodHRwOi8vYWNzYXQuZmF6ZW5kYS5zcC5nb3YuYnIvYWNzYXRzZWZhenNwY3JsLmNybDCBpwYIKwYBBQUHAQEEgZowgZcwNQYIKwYBBQUHMAGGKWh0dHA6Ly9vY3NwLXBpbG90LmltcHJlbnNhb2ZpY2lhbC5jb20uYnIvMF4GCCsGAQUFBzAChlJodHRwOi8vYWNzYXQtdGVzdGUuaW1wcmVuc2FvZmljaWFsLmNvbS5ici9yZXBvc2l0b3Jpby9jZXJ0aWZpY2Fkb3MvYWNzYXQtdGVzdGUucDdjMHsGA1UdIAR0MHIwcAYJKwYBBAGB7C0DMGMwYQYIKwYBBQUHAgEWVWh0dHA6Ly9hY3NhdC5pbXByZW5zYW9maWNpYWwuY29tLmJyL3JlcG9zaXRvcmlvL2RwYy9hY3NhdHNlZmF6c3AvZHBjX2Fjc2F0c2VmYXpzcC5wZGYwJAYDVR0RBB0wG6AZBgVgTAEDA6AQDA4xNDIwMDE2NjAwMDE2NjANBgkqhkiG9w0BAQ0FAAOCAQEArHy8y6T6ZMX6qzZaTiTRqIN6ZkjOknVCFWTBFfEO/kUc1wFBTG5oIx4SDeas9+kxZzUqjk6cSsysH8jpwRupqrJ38wZir1OgPRBuGAPz9lcah8IL4tUQkWzOIXqqGVxDJ8e91MjIMWextZuy212E8Dzn3NNMdbqyOynd7O0O5p6wPS5nuTeEsm3wcw0aLu0bbIy+Mb/nHIqFKaoZEZ8LSYn2TfmP+z9AhOC1vj3swxuRTKf1xLcNvVbq/r+SAwwBC/IGRpgeMAzELLPLPUHrBeSO+26YWwXdxaq29SmEo77KkUpUXPlt9hS2MPagCLsE6ZwDSmc8x1h3Hv+MW8zxyg==</X509Certificate>\n" +
                                    "</X509Data></KeyInfo></Signature></CFe>")
                        val resultadoOperacao: String =
                            bridgeService.ImprimirCupomSat(XML_CUPOM_EXEMPLO_SAT)
                        alertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao)
                    } else {
                        val XML_CUPOM_EXEMPLO_SAT_CANCELAMENTO =
                            "<?xml version=\"1.0\" encoding=\"UTF-8\"?><CFeCanc><infCFe Id=\"CFe13180314200166000166599000108160001324252883\" chCanc=\"CFe13180314200166000166599000108160001316693175\" versao=\"0.07\"><dEmi>20180305</dEmi><hEmi>142819</hEmi><ide><cUF>13</cUF><cNF>425288</cNF><mod>59</mod><nserieSAT>900010816</nserieSAT><nCFe>000132</nCFe><dEmi>20180305</dEmi><hEmi>142846</hEmi><cDV>3</cDV><CNPJ>16716114000172</CNPJ><signAC>SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT</signAC><assinaturaQRCODE>Q5DLkpdRijIRGY6YSSNsTWK1TztHL1vD0V1Jc4spo/CEUqICEb9SFy82ym8EhBRZjbh3btsZhF+sjHqEMR159i4agru9x6KsepK/q0E2e5xlU5cv3m1woYfgHyOkWDNcSdMsS6bBh2Bpq6s89yJ9Q6qh/J8YHi306ce9Tqb/drKvN2XdE5noRSS32TAWuaQEVd7u+TrvXlOQsE3fHR1D5f1saUwQLPSdIv01NF6Ny7jZwjCwv1uNDgGZONJdlTJ6p0ccqnZvuE70aHOI09elpjEO6Cd+orI7XHHrFCwhFhAcbalc+ZfO5b/+vkyAHS6CYVFCDtYR9Hi5qgdk31v23w==</assinaturaQRCODE><numeroCaixa>001</numeroCaixa></ide><emit><CNPJ>14200166000166</CNPJ><xNome>ELGIN INDUSTRIAL DA AMAZONIA LTDA</xNome><enderEmit><xLgr>AVENIDA ABIURANA</xLgr><nro>579</nro><xBairro>DIST INDUSTRIAL</xBairro><xMun>MANAUS</xMun><CEP>69075010</CEP></enderEmit><IE>111111111111</IE><IM>111111</IM></emit><dest><CPF>14808815893</CPF></dest><total><vCFe>3.00</vCFe></total><infAdic><obsFisco xCampo=\"xCampo1\"><xTexto>xTexto1</xTexto></obsFisco></infAdic></infCFe><Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#\"><SignedInfo><CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/><SignatureMethod Algorithm=\"http://www.w3.org/2001/04/xmldsig-more#rsa-sha256\"/><Reference URI=\"#CFe13180314200166000166599000108160001324252883\"><Transforms><Transform Algorithm=\"http://www.w3.org/2000/09/xmldsig#enveloped-signature\"/><Transform Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/></Transforms><DigestMethod Algorithm=\"http://www.w3.org/2001/04/xmlenc#sha256\"/><DigestValue>pePcOYfIU+b59qGayJiJj492D9fTVhqbHEqFLDUi1Wc=</DigestValue></Reference></SignedInfo><SignatureValue>og35vHuErSOCB29ME4WRwdVPwps/mOUQJvk3nA4Oy//CVPIt0X/iGUZHMnJhQa4aS4c7dq5YUaE2yf8H9FY8xPkY9vDQW62ZzuM/6qSHeh9Ft09iP55T76h7iLY+QLl9FZL4WINmCikv/kzmCCi4+8miVwx1MnFiTNsgSMmzRnvAv1iVkhBogbAZES03iQIi7wZGzZDo7bFmWyXVdtNnjOke0WS0gTLhJbftpDT3gi0Muu8J+AfNjaziBMFQB3i1oN96EkpCKsT78o5Sb+uBux/bV3r79nrFk4MXzaFOgBoTqv1HF5RVNx2nWSoZrbpAV8zPB1icnAnfb4Qfh1oJdA==</SignatureValue><KeyInfo><X509Data><X509Certificate>MIIFzTCCBLWgAwIBAgICESswDQYJKoZIhvcNAQENBQAwaDELMAkGA1UEBhMCQlIxEjAQBgNVBAgMCVNBTyBQQVVMTzESMBAGA1UEBwwJU0FPIFBBVUxPMQ8wDQYDVQQKDAZBQ0ZVU1AxDzANBgNVBAsMBkFDRlVTUDEPMA0GA1UEAwwGQUNGVVNQMB4XDTE3MDEyNzEzMzMyMloXDTIyMDEyNjEzMzMyMlowgbIxCzAJBgNVBAYTAkJSMREwDwYDVQQIDAhBbWF6b25hczERMA8GA1UECgwIU0VGQVotU1AxGDAWBgNVBAsMD0FDIFNBVCBTRUZBWiBTUDEoMCYGA1UECwwfQXV0b3JpZGFkZSBkZSBSZWdpc3RybyBTRUZBWiBTUDE5MDcGA1UEAwwwRUxHSU4gSU5EVVNUUklBTCBEQSBBTUFaT05JQSBMVERBOjE0MjAwMTY2MDAwMTY2MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtyLG8URyX8fqjOQa+rj3Rl6Z6eIX/dndhNe0rw6inNAXt06HtXQslBqnReuSanN3ssgpV6oev0ikfXA7hhmpZM7qVigTJp3+h1K9vKUlPZ5ELT36yAokpxakIyYRy5ELjP4KwFrAjQUgB6xu5X/MOoUmBKRLIiwm3wh7kUA9jZArQGD4pRknuvFuQ99ot3y6u3lI7Oa2ZqJ1P2E7NBmfdswQL8VG51by0Weivugsv3xWAHvdXZmmOrmv2W5C2U2VnsTjA3p2zQVwitZBEh6JxqLE3KljXlokbhHb1m2moSbzRLCdAJHIq/6eWL8kl2OVWViECODGoYA0Qz0wSgk/vwIDAQABo4ICNDCCAjAwCQYDVR0TBAIwADAOBgNVHQ8BAf8EBAMCBeAwLAYJYIZIAYb4QgENBB8WHU9wZW5TU0wgR2VuZXJhdGVkIENlcnRpZmljYXRlMB0GA1UdDgQWBBTIeTKrUS19raxSgeeIHYSXclNYkDAfBgNVHSMEGDAWgBQVtOORhiQs6jNPBR4tL5O3SJfHeDATBgNVHSUEDDAKBggrBgEFBQcDAjBDBgNVHR8EPDA6MDigNqA0hjJodHRwOi8vYWNzYXQuZmF6ZW5kYS5zcC5nb3YuYnIvYWNzYXRzZWZhenNwY3JsLmNybDCBpwYIKwYBBQUHAQEEgZowgZcwNQYIKwYBBQUHMAGGKWh0dHA6Ly9vY3NwLXBpbG90LmltcHJlbnNhb2ZpY2lhbC5jb20uYnIvMF4GCCsGAQUFBzAChlJodHRwOi8vYWNzYXQtdGVzdGUuaW1wcmVuc2FvZmljaWFsLmNvbS5ici9yZXBvc2l0b3Jpby9jZXJ0aWZpY2Fkb3MvYWNzYXQtdGVzdGUucDdjMHsGA1UdIAR0MHIwcAYJKwYBBAGB7C0DMGMwYQYIKwYBBQUHAgEWVWh0dHA6Ly9hY3NhdC5pbXByZW5zYW9maWNpYWwuY29tLmJyL3JlcG9zaXRvcmlvL2RwYy9hY3NhdHNlZmF6c3AvZHBjX2Fjc2F0c2VmYXpzcC5wZGYwJAYDVR0RBB0wG6AZBgVgTAEDA6AQDA4xNDIwMDE2NjAwMDE2NjANBgkqhkiG9w0BAQ0FAAOCAQEAAhF7TLbDABp5MH0qTDWA73xEPt20Ohw28gnqdhUsQAII2gGSLt7D+0hvtr7X8K8gDS0hfEkv34sZ+YS9nuLQ7S1LbKGRUymphUZhAfOomYvGS56RIG3NMKnjLIxAPOHiuzauX1b/OwDRmHThgPVF4s+JZYt6tQLESEWtIjKadIr4ozUXI2AcWJZL1cKc/NI7Vx7l6Ji/66f8l4Qx704evTqN+PjzZbFNFvbdCeC3H3fKhVSj/75tmK2TBnqzdc6e1hrjwqQuxNCopUSV1EJSiW/LR+t3kfSoIuQCPhaiccJdAUMIqethyyfo0ie7oQSn9IfSms8aI4lh2BYNR1mf5w==</X509Certificate></X509Data></KeyInfo></Signature></CFeCanc>"
                        val ASS_QR_CODE_EXEMPLO =
                            "Q5DLkpdRijIRGY6YSSNsTWK1TztHL1vD0V1Jc4spo/CEUqICEb9SFy82ym8EhBRZjbh3btsZhF+sjHqEMR159i4agru9x6KsepK/q0E2e5xlU5cv3m1woYfgHyOkWDNcSdMsS6bBh2Bpq6s89yJ9Q6qh/J8YHi306ce9Tqb/drKvN2XdE5noRSS32TAWuaQEVd7u+TrvXlOQsE3fHR1D5f1saUwQLPSdIv01NF6Ny7jZwjCwv1uNDgGZONJdlTJ6p0ccqnZvuE70aHOI09elpjEO6Cd+orI7XHHrFCwhFhAcbalc+ZfO5b/+vkyAHS6CYVFCDtYR9Hi5qgdk31v23w=="
                        val resultadoOperacao: String =
                            bridgeService.ImprimirCupomSatCancelamento(
                                XML_CUPOM_EXEMPLO_SAT_CANCELAMENTO,
                                ASS_QR_CODE_EXEMPLO
                            )
                        alertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao)
                    }
                }
            }
            builder.show()
        })
        buttonConsultTerminalStatus.setOnClickListener(View.OnClickListener {
            if (tryToUpdateBridgeServer()) {
                //Habilita/Desabilita o envio de senha para validação no terminal
                shouldSendPassword()
                val resultadoFuncao: String = bridgeService.ConsultarStatus()
                alertMessageStatus("Retorno E1 - BRIDGE", resultadoFuncao)
            }
        })
        buttonConsultConfiguredTimeout.setOnClickListener(View.OnClickListener {
            if (tryToUpdateBridgeServer()) {
                //Habilita/Desabilita o envio de senha para validação no terminal
                shouldSendPassword()
                val resultadoFuncao: String = bridgeService.GetTimeout()
                alertMessageStatus("Retorno E1 - BRIDGE", resultadoFuncao)
            }
        })
        buttonConsultLastTransaction.setOnClickListener(View.OnClickListener {
            if (tryToUpdateBridgeServer()) {
                //Habilita/Desabilita o envio de senha para validação no terminal
                shouldSendPassword()
                val resultadoFuncao: String = bridgeService.ConsultarUltimaTransacao(PDV)
                alertMessageStatus("Retorno E1 - BRIDGE", resultadoFuncao)
            }
        })
        buttonSetTransactionTimeout.setOnClickListener(View.OnClickListener {
            val builder = AlertDialog.Builder(mContext)

            //Definindo título do AlertDialog
            builder.setTitle("DEFINA UM NOVO TIMEOUT PARA TRANSAÇÃO (em segundos):")

            // Criando um EditText para pegar o input do usuário na caixa de diálogo
            val input = EditText(mContext)

            //Configurando o EditText para negrito e configurando o tipo de inserção para apenas número
            input.setTypeface(null, Typeface.BOLD)
            input.inputType = InputType.TYPE_CLASS_NUMBER

            //Tornando o dialógo não-cancelável
            builder.setCancelable(false)
            builder.setView(input)
            builder.setNegativeButton(
                "CANCELAR"
            ) { dialog, which -> dialog.dismiss() }
            builder.setPositiveButton("OK",
                DialogInterface.OnClickListener { dialog, whichButton ->
                    val newTimeoutInSeconds = input.text.toString().trim { it <= ' ' }

                    //Setando o foco de para o input do dialógo
                    input.requestFocus()
                    val imm = mContext.getSystemService(INPUT_METHOD_SERVICE) as InputMethodManager
                    imm.showSoftInput(input, InputMethodManager.SHOW_IMPLICIT)
                    if ((newTimeoutInSeconds == "")) {
                        alertMessageStatus(
                            "Alerta",
                            "O campo que representa a quantidade timeout a ser configurado não pode ser vazio! Digite algum valor."
                        )
                        return@OnClickListener
                    } else {
                        if (tryToUpdateBridgeServer()) {
                            //Habilita/Desabilita o envio de senha para validação no terminal
                            shouldSendPassword()

                            //O valor do editText deve ser convetido para inteiro
                            val resultadoOperacao: String =
                                bridgeService.SetTimeout(newTimeoutInSeconds.toInt())
                            alertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao)
                        }
                    }
                })
            builder.show()
        })
        buttonSetTerminalPassword.setOnClickListener(View.OnClickListener {
            val enableOrDisable =
                arrayOf("Habilitar Senha no Terminal", "Desabilitar Senha no Terminal")
            val builder = AlertDialog.Builder(mContext)
            builder.setTitle("ESCOLHA COMO CONFIGURAR A SENHA")
            //Diálogo cancelável somente por botão
            builder.setCancelable(false)
            builder.setNegativeButton(
                "CANCELAR"
            ) { dialog, which -> dialog.dismiss() }
            builder.setItems(
                enableOrDisable
            ) { dialog, which ->
                //De acordo com a opção escolhida no alert exterior, será definida se operacao irã habilitar ou desabilitar a senha
                val enable: Boolean
                enable = (which == 0)
                /**
                 * Alert com input requerindo a senha a ser definida para o terminal ; caso a opcao escolhida tenha sido "Habilitar Senha no Terminal"
                 */
                /**
                 * Alert com input requerindo a senha a ser definida para o terminal ; caso a opcao escolhida tenha sido "Habilitar Senha no Terminal"
                 */
                /**
                 * Alert com input requerindo a senha a ser definida para o terminal ; caso a opcao escolhida tenha sido "Habilitar Senha no Terminal"
                 */
                /**
                 * Alert com input requerindo a senha a ser definida para o terminal ; caso a opcao escolhida tenha sido "Habilitar Senha no Terminal"
                 */


                //Builder interno para alertDialog que sera chamado caso ao opcao de habilitar senha tenha
                val enableOptionSelectedBuilder = AlertDialog.Builder(mContext)

                //Define o titulo de acordo com a opcao escolhida
                enableOptionSelectedBuilder.setTitle("DIGITE A SENHA A SER HABILITADA:")
                //else enableOptionSelectedBuilder.setTitle("DIGITE A SENHA ATUAL PARA DESABILITAR A SENHA:");

                // Criando um EditText para pegar o input do usuário na caixa de diálogo
                val innerInput = EditText(mContext)

                //Configurando o EditText para negrito e configurando o tipo de inserção para tipo text_password
                innerInput.setTypeface(null, Typeface.BOLD)
                innerInput.inputType = InputType.TYPE_TEXT_VARIATION_PASSWORD
                enableOptionSelectedBuilder.setCancelable(false)
                enableOptionSelectedBuilder.setView(innerInput)
                enableOptionSelectedBuilder.setNegativeButton(
                    "CANCELAR"
                ) { dialog, which -> dialog.dismiss() }
                enableOptionSelectedBuilder.setPositiveButton(
                    "OK"
                ) { dialog, whichButton ->
                    val passwordEntered = innerInput.text.toString()

                    //Setando o foco de para o input do dialógo
                    innerInput.requestFocus()
                    val imm =
                        mContext.getSystemService(INPUT_METHOD_SERVICE) as InputMethodManager
                    imm.showSoftInput(
                        innerInput,
                        InputMethodManager.SHOW_IMPLICIT
                    )
                    if ((passwordEntered == "")) {
                        alertMessageStatus(
                            "Alerta",
                            "O campo de senha a ser habilitada não pode ser vazio!"
                        )
                    } else {
                        val HABILITAR_SENHA_TERMINAL = true
                        if (tryToUpdateBridgeServer()) {
                            //Habilita/Desabilita o envio de senha para validação no terminal
                            shouldSendPassword()

                            //Se, Senão ; Opcao de habilitar senha
                            val resultadoOperacao: String =
                                bridgeService.SetSenhaServer(
                                    passwordEntered,
                                    HABILITAR_SENHA_TERMINAL
                                )
                            alertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao)
                        }
                    }
                }
                /**
                 * Se a opcao escolhida for "Habilitar Senha do Terminal", mostre o alert acima, caso contrario tente desabilitar a senha do terminal enviando uma String vazia, pois a funcao SetSenhaServer() com parametro booleano falso apenas
                 * desabilitara a requisicao de senha e nao sobrescrevera a senha ja salva no terminal
                 *
                 */
                /**
                 * Se a opcao escolhida for "Habilitar Senha do Terminal", mostre o alert acima, caso contrario tente desabilitar a senha do terminal enviando uma String vazia, pois a funcao SetSenhaServer() com parametro booleano falso apenas
                 * desabilitara a requisicao de senha e nao sobrescrevera a senha ja salva no terminal
                 *
                 */
                /**
                 * Se a opcao escolhida for "Habilitar Senha do Terminal", mostre o alert acima, caso contrario tente desabilitar a senha do terminal enviando uma String vazia, pois a funcao SetSenhaServer() com parametro booleano falso apenas
                 * desabilitara a requisicao de senha e nao sobrescrevera a senha ja salva no terminal
                 *
                 */
                /**
                 * Se a opcao escolhida for "Habilitar Senha do Terminal", mostre o alert acima, caso contrario tente desabilitar a senha do terminal enviando uma String vazia, pois a funcao SetSenhaServer() com parametro booleano falso apenas
                 * desabilitara a requisicao de senha e nao sobrescrevera a senha ja salva no terminal
                 *
                 */
                if (enable) enableOptionSelectedBuilder.show() else {
                    if (!sendPassword) {
                        alertMessageStatus(
                            "Alerta",
                            "Habilite a opção de envio de senha e envie a senha mais atual para desabilitar a senha do terminal!"
                        )
                    } else {
                        if (tryToUpdateBridgeServer()) {
                            //Habilita/Desabilita o envio de senha para validação no terminal
                            shouldSendPassword()
                            val DESABILITAR_SENHA_TERMINAL = false

                            //Deve ser passado um string vazia para deletar a senha no terminal, pois é mais intuitivo desabilitar a senha atual e deleta-la do que desabilitar e atualizar com uma nova
                            val resultadoOperacao: String =
                                bridgeService.SetSenhaServer("", DESABILITAR_SENHA_TERMINAL)
                            alertMessageStatus("Retorno E1 - BRIDGE", resultadoOperacao)
                        }
                    }
                }
            }
            builder.show()
        })
    }

    /**
     * Funcao que deve ser chamada antes de qualquer funcao Bridge pois valida os campos de IP e as portas; e se todos os campos forem validos, atualiza com esses dados a conexao que o bridge utilizara para se conectar ao terminal
     * @return true se todos os campos forem validos, false caso contrario
     */
    fun tryToUpdateBridgeServer(): Boolean {
        //Se o valor inseridos no campo IP e nas portas transação/status forem válidos, atualize as configurações do Server e
        if (isIpValid && isTransactionPortValid && isStatusPortValid) {
            bridgeService.SetServer(
                editTextIpBridge!!.text.toString(),
                editTextTransactionPort!!.text.toString().toInt(),
                editTextStatusPort!!.text.toString().toInt()
            )
            return true
        }
        return false
    }

    /**
     * Funcao que deve ser chamada antes de qualquer funcao Bridge pois configura se deve ser enviado senha para validação com o terminal ou não, de acordo com o valor da checkBox reservada para isso
     */
    fun shouldSendPassword() {
        val HABILITAR_ENVIO_SENHA = true
        val DESABILITAR_ENVIO_SENHA = false
        val enteredPassword = editTextPassword!!.text.toString()

        //Se a opção de envio de senha estiver marcada : habilite o envio de senha e set a senha que o Bridge ira enviar
        if (sendPassword) {
            bridgeService.SetSenha(enteredPassword, HABILITAR_ENVIO_SENHA)
        } else {
            bridgeService.SetSenha(enteredPassword, DESABILITAR_ENVIO_SENHA)
        }
    }

    //Valida o formato de IP
    private val isIpValid: Boolean
        private get() {
            val IP = editTextIpBridge!!.text.toString()
            val pattern =
                Pattern.compile("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]){1}$")
            val matcher = pattern.matcher(IP)
            val isIpValid = matcher.matches()
            if (isIpValid) return true
            alertMessageStatus("Alerta", "Insira um IP válido para a conexão Bridge!")
            return false
        }

    //Valida a porta de transacao
    private val isTransactionPortValid: Boolean
        private get() = try {
            val transactionPortInInt = editTextTransactionPort!!.text.toString().toInt()
            if (transactionPortInInt > 65535) {
                alertMessageStatus(
                    "Alerta",
                    "O valor inserido na porta de transação excede o limite esbelecido de 65535!"
                )
                false
            } else true
        } catch (numberFormatException: NumberFormatException) {
            alertMessageStatus(
                "Alerta",
                "O valor inserido na porta de transação não pode estar vazio"
            )
            false
        }

    //Valida a porta de status
    private val isStatusPortValid: Boolean
        private get() {
            return try {
                val statusPortInInt = editTextStatusPort!!.text.toString().toInt()
                if (statusPortInInt > 65535) {
                    alertMessageStatus(
                        "Alerta",
                        "O valor inserido na porta de status excede o limite esbelecido de 65535!"
                    )
                    false
                } else true
            } catch (numberFormatException: NumberFormatException) {
                alertMessageStatus(
                    "Alerta",
                    "O valor inserido na porta de status não pode estar vazio!"
                )
                false
            }
        }//Valor do campo formatado par a criação do BigDecimal formatado

    //BigDecimal utilizado para comparar com 1.00 real (valor mínimo para transação ElginPay) com maior precisão

    //Checa se o valor é menor que 1 real

    //Valida se o valor inserido é igual ou superior ao mínimo exigido pelo ElginPay de R$ 1.00 (um real)
    private val isValueValidToElginPay: Boolean
        private get() {
            //Valor do campo formatado par a criação do BigDecimal formatado
            val valueFormatted = editTextValueBridge!!.text.toString().replace(",".toRegex(), "\\.")
                .trim { it <= ' ' }

            //BigDecimal utilizado para comparar com 1.00 real (valor mínimo para transação ElginPay) com maior precisão
            val actualValueInBigDecimal = BigDecimal(valueFormatted)

            //Checa se o valor é menor que 1 real
            return if (actualValueInBigDecimal.compareTo(BigDecimal("1.00")) == -1) {
                alertMessageStatus("Alerta", "O valor mínimo para a transação é de R$1.00!")
                false
            } else {
                true
            }
        }//Como o inputType do campo está setado como "number" a única exception possível para este catch é de o campo estar vazio, uma vez que não é possível inserir quaisquer cacteres alem dos digitos [0-9].//Se o parcelamento não for a vista, o número mínimo de parcelas para se iniciar uma transação é 2

    //Como não há nenhum problema com o valor do campo de parcelas, atualizamos a váriavel:

    //Valida o campo de parcelas
    private val isInstallmentsFieldValid: Boolean
        private get() {
            return try {
                val intNumberOfInstallments =
                    editTextNumberOfInstallmentsBridge!!.text.toString().toInt()

                //Se o parcelamento não for a vista, o número mínimo de parcelas para se iniciar uma transação é 2
                if ((selectedInstallmentType == FINANCIAMENTO_PARCELADO_EMISSOR || selectedInstallmentType == FINANCIAMENTO_PARCELADO_ESTABELECIMENTO) && intNumberOfInstallments < 2) {
                    alertMessageStatus(
                        "Alerta",
                        "O número mínimo de parcelas para esse tipo de parcelamento é 2!"
                    )
                    return false
                }

                //Como não há nenhum problema com o valor do campo de parcelas, atualizamos a váriavel:
                numberOfInstallments = intNumberOfInstallments
                true
            } catch (numberFormatException: NumberFormatException) {
                //Como o inputType do campo está setado como "number" a única exception possível para este catch é de o campo estar vazio, uma vez que não é possível inserir quaisquer cacteres alem dos digitos [0-9].
                alertMessageStatus(
                    "Alerta",
                    "O campo número de parcelas não pode ser vazio! Digite algum valor."
                )
                false
            }
        }

    //Random entre 0 e 999999. Usado para gerar um idTransação diferente para cada operação.
    fun generateRandomForBridgeTransactions(): Int {
        val random = Random()
        return random.nextInt(1000000)
    }

    fun alertMessageStatus(alertName: String?, messageAlert: String?) {
        val alertDialog = AlertDialog.Builder(this).create()
        alertDialog.setTitle(alertName)
        alertDialog.setMessage(messageAlert)
        alertDialog.setButton(
            AlertDialog.BUTTON_NEUTRAL, "OK"
        ) { dialog, which -> dialog.dismiss() }
        alertDialog.show()
    }

    companion object {
        //Definindo tipos de financiamento
        const val FINANCIAMENTO_A_VISTA = 1
        const val FINANCIAMENTO_PARCELADO_EMISSOR = 2
        const val FINANCIAMENTO_PARCELADO_ESTABELECIMENTO = 3
    }
}