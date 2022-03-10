package com.example.e1_kotlin_r


import android.annotation.SuppressLint
import android.content.*
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.util.TypedValue
import android.view.View
import android.widget.*
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.content.res.AppCompatResources
import androidx.appcompat.widget.AppCompatButton
import androidx.core.content.ContextCompat
import androidx.core.content.res.ResourcesCompat
import com.example.e1_elgin_kotlin.shipay.ShipayClient
import com.example.e1_elgin_kotlin.shipay.models.Buyer
import com.example.e1_elgin_kotlin.shipay.models.OrderItem
import com.example.e1_elgin_kotlin.shipay.requests.AuthenticationRequest
import com.example.e1_elgin_kotlin.shipay.requests.CreateOrderRequest
import com.example.e1_elgin_kotlin.shipay.responses.AuthenticationResponse
import com.example.e1_elgin_kotlin.shipay.responses.CancelOrderResponse
import com.example.e1_elgin_kotlin.shipay.responses.CreateOrderResponse
import com.example.e1_elgin_kotlin.shipay.responses.GetOrderStatusResponse
import com.example.e1_elgin_kotlin.shipay.responses.GetWalletsResponse
import com.example.e1_kotlin_r.Services.PrinterService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.*


class ShipayMenu : AppCompatActivity() {
    var context: Context? = null
    var buttonShipayProviderOption: Button? = null
    var layoutWalletOptions: LinearLayout? = null

    // Campo VALOR
    lateinit var editTextValueShipay: EditText
    lateinit var buttonEnviarTransacao: Button
    lateinit var buttonCancelarTransacao: Button
    lateinit var buttonStatusVenda: Button
    lateinit var buttonCopiarPix: Button
    lateinit var buttonMercadoPago: Button
    var responseContainer: View? = null
    var textRetorno: TextView? = null
    var textValorVenda: TextView? = null
    var textDataVenda: TextView? = null
    var textStatusVenda: TextView? = null
    var textCarteiraVenda: TextView? = null
    var imgQrCode: ImageView? = null
    var shipayClient: ShipayClient? = null
    var accessToken: String? = null
    var orderId: String? = null
    var formattedDate = ""
    var valor = ""
    var selectedWallet = "shipay-pagador"
    var status = ""
    var alreadyCanceled: Boolean = false
    var qrCodeTextOut: String = ""
    var deepLinkOut: String = ""

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        context = this
        setContentView(R.layout.activity_shipay_menu)
        shipayClient = ShipayClient()
        printer = PrinterService(this)
        printer!!.printerInternalImpStart()
        authenticate()
        buttonShipayProviderOption = findViewById(R.id.buttonShipayOption)
        layoutWalletOptions = findViewById(R.id.layoutWalletOptions)
        editTextValueShipay = findViewById(R.id.editTextInputValueShipay)
        buttonEnviarTransacao = findViewById(R.id.buttonEnviarTransacao)
        buttonCancelarTransacao = findViewById(R.id.buttonCancelarTransacao)
        buttonStatusVenda = findViewById(R.id.buttonStatusTransacao)
        responseContainer = findViewById(R.id.responseContainer)
        textRetorno = findViewById(R.id.textRetorno)
        textValorVenda = findViewById(R.id.textValorVenda)
        textDataVenda = findViewById(R.id.textDataVenda)
        textStatusVenda = findViewById(R.id.textStatusVenda)
        textCarteiraVenda = findViewById(R.id.textCarteiraVenda)
        imgQrCode = findViewById(R.id.imgQrCode)
        buttonEnviarTransacao.setOnClickListener { createOrder() }
        buttonCancelarTransacao.setOnClickListener { cancelOrder() }
        buttonStatusVenda.setOnClickListener { orderStatus }
        buttonCopiarPix = findViewById(R.id.buttonCopiarPix)
        buttonMercadoPago = findViewById(R.id.buttonAbrirMercado)
        buttonCopiarPix.setOnClickListener { copy() }
        buttonMercadoPago.setOnClickListener { openLink() }
        buttonMercadoPago.visibility = View.GONE
        buttonCopiarPix.visibility = View.GONE
        editTextValueShipay.setText("2000")

    }

    override fun onDestroy() {
        super.onDestroy()
        printer!!.printerStop()
    }


    fun authenticate() {
        val accessToken = "HV8R8xc28hQbX4fq_jaK1A"
        val secretKey =
            "ZBD0yR5ybNuHPKqvH0YEiL-hXzfsd4mbot5NuZQ75ZqpMFVuTN__mkFnbl7E6QbXYhVlohnBQ7GQaoLckrrmAA"
        val clientId =
            "8HMB1egUeKI-h9s4I3gU_w1R6kYifrUfZRrauhvjvX9y2bVoBdpoH7vVm3FZOfFejKB-rEIRjVHBEQxrW93iE40ljPwcVEgfZnKN5SvObHxHvXrgfg87A7aUOeWroajczHNt6KUOwB4-YH90RidhzIJhQ0GEjKwpQt93XJeC1XE"
        val authData = AuthenticationRequest(accessToken, secretKey, clientId)
        shipayClient!!.getApiService().authenticate(authData)!!
            .enqueue(object : Callback<AuthenticationResponse?> {
                override fun onFailure(call: Call<AuthenticationResponse?>, t: Throwable) {}
                override fun onResponse(
                    call: Call<AuthenticationResponse?>,
                    response: Response<AuthenticationResponse?>
                ) {
                    val authResponse = response.body() as AuthenticationResponse?
                    if (authResponse != null) {
                        Log.i("ACCESS_TOKEN", authResponse.access_token)
                        Log.i("REFRESH_TOKEN", authResponse.refresh_token)
                        this@ShipayMenu.accessToken =
                            java.lang.String.format("Bearer %s", authResponse.access_token)
                        wallets
                    }
                }
            })
    }

    fun createOrder() {
        if (editTextValueShipay!!.text.toString() == "") {
            alertMessage()
        } else {
            val mapValues: MutableMap<String?, Any?> = HashMap()
            val orderRef = "shipaypag-stg-005"
            val total = editTextValueShipay!!.text.toString().replace(",", ".").toFloat()
            val items: MutableList<OrderItem> = ArrayList()
            items.add(OrderItem("Produto Teste", total, 1))
            val buyer = Buyer(
                "Shipay",
                "PDV",
                "000.000.000-00",
                "shipaypagador@shipay.com.br",
                "+55 11 99999-9999"
            )
            val orderRequest = CreateOrderRequest(orderRef, selectedWallet, total, items, buyer)
            val formatter = SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
            val formattedDate = formatter.format(Date())
            shipayClient!!.getApiService().createOrder(accessToken, orderRequest)!!
                .enqueue(object : Callback<CreateOrderResponse?> {
                    override fun onFailure(call: Call<CreateOrderResponse?>, t: Throwable) {}
                    override fun onResponse(
                        call: Call<CreateOrderResponse?>,
                        response: Response<CreateOrderResponse?>
                    ) {
                        val orderResponse = response.body() as CreateOrderResponse?
                        if (orderResponse != null) {
                            alreadyCanceled = false
                            qrCodeTextOut = orderResponse.qr_code_text
                            buttonMercadoPago.visibility = View.GONE
                            buttonCopiarPix.visibility = View.GONE

                            Log.i("deep_link", "" + orderResponse.deep_link)
                            Log.i("order_id", orderResponse.order_id)
                            Log.i("pix_dict_key", "" + orderResponse.pix_dict_key)
                            Log.i("pix_psp", "" + orderResponse.pix_psp)
                            Log.i("qr_code", orderResponse.qr_code)
                            Log.i("qr_code_text", orderResponse.qr_code_text)
                            Log.i("status", orderResponse.status)
                            Log.i("wallet", orderResponse.wallet)

                            if(orderResponse.wallet == "pix"){
                                buttonCopiarPix.visibility = View.VISIBLE
                            }
                            if(orderResponse.wallet == "mercadopago"){
                                deepLinkOut = orderResponse.deep_link
                                buttonMercadoPago.visibility = View.VISIBLE
                            }

                            // Load Qr Code
                            val cleanImage =
                                orderResponse.qr_code.replace("data:image/png;base64,", "")
                                    .replace("data:image/jpeg;base64,", "")
                            val decodedString = Base64.decode(cleanImage, Base64.DEFAULT)
                            val bitMap =
                                BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
                            imgQrCode!!.setImageBitmap(bitMap)
                            textValorVenda!!.text =
                                String.format(
                                    "Valor:\t\t\t\t\t\t\t\t\t\t%s",
                                    "R$ " + editTextValueShipay!!.text.toString()
                                )
                            textDataVenda!!.text =
                                String.format("Data:\t\t\t\t\t\t\t\t\t\t\t%s", formattedDate)
                            textStatusVenda!!.text =
                                String.format(
                                    "Status:\t\t\t\t\t\t\t\t\t%s",
                                    getFormattedStatus(orderResponse.status)

                                )
                            textCarteiraVenda!!.text =
                                java.lang.String.format(
                                    "Carteira:\t\t\t\t\t\t\t\t%s",
                                    orderResponse.wallet
                                )
                            orderId = orderResponse.order_id
                            valor = "R$ " + editTextValueShipay!!.text.toString()
                            this@ShipayMenu.formattedDate = formattedDate
                            status = getFormattedStatus(orderResponse.status)
                            responseContainer!!.visibility = View.VISIBLE
                            mapValues["quant"] = 10
                            mapValues["qrSize"] = 4
                            mapValues["text"] = orderResponse.qr_code_text
                            mapValues["align"] = "Centralizado"
                            System.out.println(orderResponse.qr_code_text + orderResponse.qr_code)
                            printer!!.imprimeQR_CODE(mapValues)
                            printer!!.AvancaLinhas(mapValues)
                            printer!!.cutPaper(mapValues);
                        }
                    }
                })
        }
    }// Colocar na cor verde & set wallet selecionada

    // Colocar outros botões na cor preto
    //Dimensões
    @get:SuppressLint("RestrictedApi")
    val wallets: Unit

    // Borda

    // Texto

        // Fonte do texto
        get() {
            shipayClient!!.getApiService().getWallets(accessToken)!!
                .enqueue(object : Callback<GetWalletsResponse?> {
                    override fun onFailure(call: Call<GetWalletsResponse?>, t: Throwable) {}
                    override fun onResponse(
                        call: Call<GetWalletsResponse?>,
                        response: Response<GetWalletsResponse?>
                    ) {
                        val walletsResponse = response.body() as GetWalletsResponse?
                        if (walletsResponse != null) {
                            val wallets = walletsResponse.wallets
                            val walletOptions = ArrayList<AppCompatButton>(wallets.size)
                            for ((_, _, _, name) in wallets) {
                                val buttonWalletOption = AppCompatButton(context!!)

                                //Dimensões
                                val scale = resources.displayMetrics.density
                                buttonWalletOption.layoutParams = LinearLayout.LayoutParams(
                                    LinearLayout.LayoutParams.WRAP_CONTENT,
                                    (30 * scale).toInt()
                                )
                                buttonWalletOption.setPadding(20, 0, 20, 0)


                                // Borda
                                buttonWalletOption.background =
                                    ContextCompat.getDrawable(context!!, R.drawable.box)
                                buttonWalletOption.supportBackgroundTintList =
                                    AppCompatResources.getColorStateList(
                                        context!!, R.color.black
                                    )
                                if (name.equals("shipay-pagador")) {
                                    buttonWalletOption.supportBackgroundTintList =
                                        AppCompatResources.getColorStateList(
                                            context!!, R.color.verde
                                        )
                                }

                                // Texto
                                buttonWalletOption.setTextSize(TypedValue.COMPLEX_UNIT_SP, 10f)
                                buttonWalletOption.setTextColor(resources.getColor(R.color.black))
                                buttonWalletOption.text = name

                                // Fonte do texto
                                val typeface = ResourcesCompat.getFont(context!!, R.font.robotobold)
                                buttonWalletOption.setTypeface(typeface)
                                Log.i("WALLET", name)
                                buttonWalletOption.setOnClickListener { view: View? ->
                                    // Colocar na cor verde & set wallet selecionada
                                    buttonWalletOption.supportBackgroundTintList =
                                        AppCompatResources.getColorStateList(
                                            context!!, R.color.verde
                                        )
                                    selectedWallet = name

                                    if(selectedWallet == "pix"){
                                        buttonMercadoPago.visibility = View.GONE
                                    }
                                    if(selectedWallet == "mercadopago"){
                                        buttonCopiarPix.visibility = View.GONE
                                    }
                                    if(selectedWallet == "shipay-pagador"){
                                        buttonMercadoPago.visibility = View.GONE
                                        buttonCopiarPix.visibility = View.GONE

                                    }

                                    // Colocar outros botões na cor preto
                                    for (button in walletOptions) {
                                        if (button != buttonWalletOption) {
                                            button.supportBackgroundTintList =
                                                AppCompatResources.getColorStateList(
                                                    context!!, R.color.black
                                                )
                                        }
                                    }
                                }
                                layoutWalletOptions!!.addView(buttonWalletOption)
                                walletOptions.add(buttonWalletOption)
                            }
                        }
                    }
                })
        }

    fun cancelOrder() {
        if (!alreadyCanceled){
            AlertDialog.Builder(context!!)
                .setTitle("Cancelar transação")
                .setMessage("Tem certeza de que quer cancelar a transação?")
                .setPositiveButton(
                    android.R.string.yes
                ) { dialog: DialogInterface?, which: Int ->
                    shipayClient!!.getApiService().cancelOrder(accessToken, orderId)!!
                        .enqueue(object : Callback<CancelOrderResponse?> {
                            override fun onFailure(call: Call<CancelOrderResponse?>, t: Throwable) {}
                            override fun onResponse(
                                call: Call<CancelOrderResponse?>,
                                response: Response<CancelOrderResponse?>
                            ) {

                                buttonMercadoPago.visibility = View.GONE
                                buttonCopiarPix.visibility = View.GONE

                                val orderResponse =
                                    response.body()
                                Log.i("tok", response.toString())
                                if (orderResponse != null) {
                                    Log.i("order_id", orderResponse.order_id)
                                    Log.i(
                                        "status",
                                        getFormattedStatus(orderResponse.status)
                                    )
                                    textStatusVenda!!.text = String.format(
                                        "Status:\t\t\t\t\t\t\t\t\t%s",
                                        getFormattedStatus(orderResponse.status)
                                    )
                                    alreadyCanceled = true
                                }
                            }
                        })
                } // A null listener allows the button to dismiss the dialog and take no further action.
                .setNegativeButton(android.R.string.no, null)
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show()
        }
        else{
            val alertDialog = android.app.AlertDialog.Builder(this).create()
            alertDialog.setTitle("Alert")
            alertDialog.setMessage("Operação já cancelada .")
            alertDialog.setButton(
                android.app.AlertDialog.BUTTON_NEUTRAL, "OK"
            ) { dialog, which -> dialog.dismiss() }
            alertDialog.show()
        }
    }

    val orderStatus: Unit
        get() {
            shipayClient!!.getApiService().getOrderStatus(accessToken, orderId)!!
                .enqueue(object : Callback<GetOrderStatusResponse?> {
                    override fun onFailure(call: Call<GetOrderStatusResponse?>, t: Throwable) {}
                    override fun onResponse(
                        call: Call<GetOrderStatusResponse?>,
                        response: Response<GetOrderStatusResponse?>
                    ) {
                        val orderResponse = response.body() as GetOrderStatusResponse?
                        Log.i("tok", response.toString())
                        if (orderResponse != null) {
                            Log.i("created_at", orderResponse.created_at)
                            Log.i("external_id", orderResponse.external_id)
                            Log.i("order_id", orderResponse.order_id)
                            Log.i(
                                "paid_amount",
                                java.lang.String.valueOf(orderResponse.paid_amount)
                            )
                            Log.i("payment_date", " " + orderResponse.payment_date)
                            Log.i("pix_psp", " " + orderResponse.pix_psp)
                            Log.i("status", orderResponse.status)
                            Log.i(
                                "total_order",
                                java.lang.String.valueOf(orderResponse.total_order)
                            )
                            Log.i("updated_at", orderResponse.updated_at)
                            Log.i("wallet", orderResponse.wallet)
                            Log.i("wallet_payment_id", " " + orderResponse.wallet_payment_id)
                            textDataVenda!!.text =
                                String.format("Data:\t\t\t\t\t\t\t\t\t\t\t%s", formattedDate)
                            textStatusVenda!!.text =
                                String.format(
                                    "Status:\t\t\t\t\t\t\t\t\t%s",
                                    getFormattedStatus(orderResponse.status)
                                )
                        }
                    }
                })
        }


    fun getFormattedStatus(status: String?): String {
        return when (status) {
            "approved" -> "Aprovado"
            "expired" -> "Expirado"
            "cancelled" -> "Cancelado"
            "refunded" -> "Devolvido"
            "pending" -> "Pendente"
            "refund_pending" -> "estorno pendente"
            else -> status.toString()
        }
    }

    fun copy() {

        var clipboard = getSystemService(CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("label",  qrCodeTextOut )
        clipboard.setPrimaryClip(clip);
        Toast.makeText(this, "copiado", Toast.LENGTH_LONG).show()
    }

    fun openLink(){
        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(deepLinkOut)))
    }

    private fun alertMessage() {
        val alertDialog = android.app.AlertDialog.Builder(this).create()
        alertDialog.setTitle("Alert")
        alertDialog.setMessage("Campo Valor vazio.")
        alertDialog.setButton(
            android.app.AlertDialog.BUTTON_NEUTRAL, "OK"
        ) { dialog, which -> dialog.dismiss() }
        alertDialog.show()
    }

    companion object {
        var printer: PrinterService? = null
    }
}