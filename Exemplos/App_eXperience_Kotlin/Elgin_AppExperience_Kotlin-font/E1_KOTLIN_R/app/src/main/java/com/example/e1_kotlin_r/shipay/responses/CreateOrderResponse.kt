package com.example.e1_elgin_kotlin.shipay.responses

import com.google.gson.annotations.SerializedName

data class CreateOrderResponse (
    @SerializedName("deep_link")
    var deep_link: String,

    @SerializedName("order_id")
    var order_id: String,

    @SerializedName("pix_dict_key")
    var pix_dict_key: String,

    @SerializedName("pix_psp")
    var pix_psp: String,

    @SerializedName("qr_code")
    var qr_code: String,

    @SerializedName("qr_code_text")
    var qr_code_text: String,

    @SerializedName("status")
    var status: String,

    @SerializedName("wallet")
    var wallet: String
)
