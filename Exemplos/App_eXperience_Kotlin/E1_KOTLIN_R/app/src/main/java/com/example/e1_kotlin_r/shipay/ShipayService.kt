package com.example.e1_elgin_kotlin.shipay

import com.example.e1_elgin_kotlin.shipay.requests.AuthenticationRequest
import com.example.e1_elgin_kotlin.shipay.requests.CreateOrderRequest
import com.example.e1_elgin_kotlin.shipay.responses.*
import retrofit2.Call
import retrofit2.http.*

interface ShipayService {
    @POST(Constants.AUTH_URL)
    fun authenticate(@Body request: AuthenticationRequest?): Call<AuthenticationResponse?>?

    @POST(Constants.CREATE_ORDER_URL)
    fun createOrder(
        @Header("Authorization") token: String?,
        @Body request: CreateOrderRequest?
    ): Call<CreateOrderResponse?>?

    @GET(Constants.GET_WALLETS)
    fun getWallets(@Header("Authorization") token: String?): Call<GetWalletsResponse?>?

    @DELETE(Constants.CANCEL_ORDER)
    fun cancelOrder(
        @Header("Authorization") token: String?,
        @Path("order_id") orderId: String?
    ): Call<CancelOrderResponse?>?

    @GET(Constants.GET_ORDER_STATUS)
    fun getOrderStatus(
        @Header("Authorization") token: String?,
        @Path("order_id") orderId: String?
    ): Call<GetOrderStatusResponse?>?
}