package com.example.e1_elgin_kotlin.shipay.responses

import com.google.gson.annotations.SerializedName

data class CancelOrderResponse (
    @SerializedName("order_id")
    var order_id: String,

    @SerializedName("status")
    var status: String
)
