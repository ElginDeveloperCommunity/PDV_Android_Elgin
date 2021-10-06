package com.example.e1_elgin_kotlin

import android.content.Context
import android.content.DialogInterface
import android.graphics.BitmapFactory
import android.os.Build
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.e1_elgin_kotlin.PrinterMenu.Companion.printer
import com.example.e1_elgin_kotlin.shipay.ShipayClient
import com.example.e1_elgin_kotlin.shipay.models.Buyer
import com.example.e1_elgin_kotlin.shipay.models.OrderItem
import com.example.e1_elgin_kotlin.shipay.models.wallet.Wallet
import com.example.e1_elgin_kotlin.shipay.requests.AuthenticationRequest
import com.example.e1_elgin_kotlin.shipay.requests.CreateOrderRequest
import com.example.e1_elgin_kotlin.shipay.responses.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.*
import kotlin.reflect.typeOf


class ShipayMenu : AppCompatActivity() {
    lateinit var status: String
    lateinit var valor: String
    lateinit var accessToken: String
    lateinit var context: Context
    lateinit var buttonShipayOption: Button

    // Campo VALOR
    lateinit var editTextValueShipay: EditText
    lateinit var buttonEnviarTransacao: Button
    lateinit var buttonCancelarTransacao: Button
    lateinit var buttonStatusVenda: Button
    lateinit var imgQrCode: ImageView
    lateinit var shipayClient: ShipayClient
    
    lateinit var textValorVenda: TextView
    lateinit var textDataVenda: TextView
    lateinit var textStatusVenda: TextView
    lateinit var textCarteiraVenda: TextView
    lateinit var responseContainer: View
     lateinit var printer: Printer

    lateinit var orderId: String
    var formattedDate = ""
    var wallet = ""




    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        context = this
        setContentView(R.layout.activity_shipay_menu)
        shipayClient = ShipayClient()
        printer = Printer(this)
        printer.printerInternalImpStart()
        authenticate()
        buttonShipayOption = findViewById(R.id.buttonShipayOption)
        editTextValueShipay = findViewById(R.id.editTextInputValueShipay)
        buttonEnviarTransacao = findViewById(R.id.buttonEnviarTransacao)
        buttonCancelarTransacao = findViewById(R.id.buttonCancelarTransacao)
        buttonStatusVenda = findViewById(R.id.buttonStatusVenda)
        responseContainer = findViewById(R.id.responseContainer)
        textValorVenda = findViewById(R.id.textValorVenda)
        textDataVenda = findViewById(R.id.textDataVenda)
        textStatusVenda = findViewById(R.id.textStatusVenda)
        textCarteiraVenda = findViewById(R.id.textCarteiraVenda)
        imgQrCode = findViewById(R.id.imgQrCode)
        buttonEnviarTransacao.setOnClickListener {if (this::accessToken.isInitialized) createOrder() }
        buttonCancelarTransacao.setOnClickListener { cancelOrder() }
        buttonStatusVenda.setOnClickListener { getOrderStatus() }
    }

    fun authenticate() {
        val accessToken = "HV8R8xc28hQbX4fq_jaK1A"
        val secretKey =
            "ZBD0yR5ybNuHPKqvH0YEiL-hXzfsd4mbot5NuZQ75ZqpMFVuTN__mkFnbl7E6QbXYhVlohnBQ7GQaoLckrrmAA"
        val clientId =
            "8HMB1egUeKI-h9s4I3gU_w1R6kYifrUfZRrauhvjvX9y2bVoBdpoH7vVm3FZOfFejKB-rEIRjVHBEQxrW93iE40ljPwcVEgfZnKN5SvObHxHvXrgfg87A7aUOeWroajczHNt6KUOwB4-YH90RidhzIJhQ0GEjKwpQt93XJeC1XE"
        val authData = AuthenticationRequest(accessToken, secretKey, clientId)
        shipayClient.getApiService().authenticate(authData)!!
            .enqueue(object : Callback<AuthenticationResponse?> {
                override fun onResponse(
                        call: Call<AuthenticationResponse?>,
                        response: Response<AuthenticationResponse?>
                ) {
                    val authResponse = response.body()
                    if (authResponse != null) {
                        Log.i("ACCESS_TOKEN", authResponse.access_token)
                        Log.i("REFRESH_TOKEN", authResponse.refresh_token)
                        this@ShipayMenu.accessToken =
                                java.lang.String.format("Bearer %s", authResponse.access_token)
                    }
                }

                override fun onFailure(call: Call<AuthenticationResponse?>, t: Throwable) {
                }

            })

    }


    fun createOrder() {

        val mapValues: MutableMap<String?, Any?> = HashMap()
        val orderRef = "shipaypag-stg-005"
        val wallet = "shipay-pagador"
        val total = editTextValueShipay.text.toString().toFloat()
        val items: MutableList<OrderItem> = ArrayList()
        items.add(OrderItem("Cerveja Heineken", total, 1))
        val buyer = Buyer("Shipay", "PDV", "000.000.000-00", "shipaypagador@shipay.com.br", "+55 11 99999-9999")
        val orderRequest = CreateOrderRequest(orderRef, wallet, total, items, buyer)
        val formatter = SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
        val formattedDate = formatter.format(Date())
        shipayClient.getApiService().createOrder(accessToken, orderRequest)!!.enqueue(object : Callback<CreateOrderResponse?> {
            override fun onFailure(call: Call<CreateOrderResponse?>, t: Throwable) {}
            override fun onResponse(call: Call<CreateOrderResponse?>, response: Response<CreateOrderResponse?>) {
                val orderResponse = response.body() as CreateOrderResponse?
                if (orderResponse != null) {
                    // Load Qr Code
                    val cleanImage = orderResponse.qr_code.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", "")
                    val decodedString = Base64.decode(cleanImage, Base64.DEFAULT)
                    val bitMap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
                    imgQrCode.setImageBitmap(bitMap)
                    textValorVenda.setText(String.format("Valor:\t\t\t\t\t\t\t\t\t\t%s", "R$ " + editTextValueShipay.text.toString()))
                    textDataVenda.setText(String.format("Data:\t\t\t\t\t\t\t\t\t\t\t%s", formattedDate))
                    textStatusVenda.setText(String.format("Status:\t\t\t\t\t\t\t\t\t%s", getFormattedStatus(orderResponse.status)))
                    textCarteiraVenda.setText(String.format("Carteira:\t\t\t\t\t\t\t\t%s", orderResponse.wallet))
                    orderId = orderResponse.order_id
                    this@ShipayMenu.valor = "R$ " + editTextValueShipay.text.toString()
                    this@ShipayMenu.wallet = orderResponse.wallet
                    this@ShipayMenu.formattedDate = formattedDate
                    this@ShipayMenu.status = getFormattedStatus(orderResponse.status)
                    responseContainer.setVisibility(View.VISIBLE)
                    mapValues["quant"] = 10
                    mapValues["base64"] = cleanImage
                    printer.imprimeCupomTEF(mapValues)
                    printer.AvancaLinhas(mapValues)
                    printer.cutPaper(mapValues)
                }
            }
        })
    }

    fun getWallets() {
        shipayClient.getApiService().getWallets(accessToken)!!.enqueue(object : Callback<GetWalletsResponse?> {
            override fun onFailure(call: Call<GetWalletsResponse?>, t: Throwable) {}
            override fun onResponse(call: Call<GetWalletsResponse?>, response: Response<GetWalletsResponse?>) {
                val walletsResponse = response.body() as GetWalletsResponse?
                if (walletsResponse != null) {
                    val wallets = walletsResponse.wallets
                    for ((_, _, _, name) in wallets) {
                        Log.i("WALLET", name)
                    }
                }
            }
        })
    }

    val wallets: Unit
        get() {
            shipayClient.getApiService()?.getWallets(accessToken)
                ?.enqueue(object : Callback<GetWalletsResponse?> {
                    override fun onFailure(call: Call<GetWalletsResponse?>, t: Throwable) {}
                    override fun onResponse(
                            call: Call<GetWalletsResponse?>,
                            response: Response<GetWalletsResponse?>
                    ) {
                        val walletsResponse: GetWalletsResponse? =
                                response.body() as GetWalletsResponse?
                        if (walletsResponse != null) {
                            val wallets: List<Wallet>? = walletsResponse.wallets
                            if (wallets != null) {
                                for (wallet in wallets) {
                                    wallet.name?.let { Log.i("WALLET", it) }
                                }
                            }
                        }
                    }
                })
        }

    fun cancelOrder() {
        AlertDialog.Builder(context)
            .setTitle("Cancelar transação")
            .setMessage("Tem certeza de que quer cancelar a transação?") // Specifying a listener allows you to take an action before dismissing the dialog.
            // The dialog is automatically dismissed when a dialog button is clicked.
            .setPositiveButton(
                    android.R.string.yes
            ) { dialog: DialogInterface?, which: Int ->
                shipayClient.getApiService()?.cancelOrder(accessToken, orderId)
                    ?.enqueue(object : Callback<CancelOrderResponse?> {
                        override fun onFailure(call: Call<CancelOrderResponse?>, t: Throwable) {}
                        override fun onResponse(
                                call: Call<CancelOrderResponse?>,
                                response: Response<CancelOrderResponse?>
                        ) {
                            val orderResponse: CancelOrderResponse? =
                                    response.body() as CancelOrderResponse?

                            if (orderResponse != null) {
                                textStatusVenda.text = String.format("Status:\t\t\t\t\t\t\t\t\t%s", getFormattedStatus(orderResponse.status))
                            }
                        }
                    })
            } // A null listener allows the button to dismiss the dialog and take no further action.
            .setNegativeButton(android.R.string.no, null)
            .setIcon(android.R.drawable.ic_dialog_alert)
            .show()
    }


    fun getOrderStatus() {
        shipayClient.getApiService()!!.getOrderStatus(accessToken, orderId)
            ?.enqueue(object : Callback<GetOrderStatusResponse?> {
                override fun onFailure(call: Call<GetOrderStatusResponse?>, t: Throwable) {
                }

                override fun onResponse(
                        call: Call<GetOrderStatusResponse?>,
                        response: Response<GetOrderStatusResponse?>
                ) {
                    val orderResponse = response.body() as GetOrderStatusResponse?
                    Log.i("tok", response.toString())
                    if (orderResponse != null) {
                        try {
                            textStatusVenda.text = String.format("Status:\t\t\t\t\t\t\t\t\t%s", getFormattedStatus(orderResponse.status))
                        } catch (e: ParseException) {
                            e.printStackTrace()
                        }
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
            else -> "Desconhecido"
        }
    }
}