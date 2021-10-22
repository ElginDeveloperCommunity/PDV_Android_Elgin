package com.example.e1_elgin_kotlin.shipay.models.wallet

import com.google.gson.annotations.SerializedName

data class Wallet (

    @SerializedName("active")
    var active: Boolean,

    @SerializedName("form")
    var form: WalletForm,

    @SerializedName("minimum_payment")
    var minimum_payment : Float,

    @SerializedName("name")
    var name: String,

    @SerializedName("wallet_fee")
    var wallet_fee : Float
)