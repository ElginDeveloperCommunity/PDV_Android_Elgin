package com.example.e1_elgin_kotlin.shipay.models

import com.google.gson.annotations.SerializedName

data class BuyerInfo (
    @SerializedName("address")
    var address: String,

    @SerializedName("city")
    var city: String,

    @SerializedName("document")
    var document: String,

    @SerializedName("email")
    var email: String,

    @SerializedName("first_name")
    var first_name: String,

    @SerializedName("last_name")
    var last_name: String,

    @SerializedName("phone")
    var phone: String,

    @SerializedName("state")
    var state: String
)
