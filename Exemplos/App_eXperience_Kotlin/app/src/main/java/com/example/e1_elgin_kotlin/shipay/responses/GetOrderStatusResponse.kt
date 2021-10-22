package com.example.e1_elgin_kotlin.shipay.responses

import com.example.e1_elgin_kotlin.shipay.models.BuyerInfo
import com.example.e1_elgin_kotlin.shipay.models.OrderItem
import com.google.gson.annotations.SerializedName

data class GetOrderStatusResponse (
    @SerializedName("buyer_info")
    var buyer_info: BuyerInfo,

    @SerializedName("created_at")
    var created_at: String,

    @SerializedName("external_id")
    var external_id: String,

    @SerializedName("items")
    var items: List<OrderItem>,

    @SerializedName("order_id")
    var order_id: String,

    @SerializedName("paid_amount")
    var paid_amount: Float,

    @SerializedName("payment_date")
    var payment_date: String,

    @SerializedName("pix_psp")
    var pix_psp: String,

    @SerializedName("status")
    var status: String,

    @SerializedName("total_order")
    var total_order: Float,

    @SerializedName("updated_at")
    var updated_at: String,

    @SerializedName("wallet")
    var wallet: String,

    @SerializedName("wallet_payment_id")
    var wallet_payment_id: String
)
