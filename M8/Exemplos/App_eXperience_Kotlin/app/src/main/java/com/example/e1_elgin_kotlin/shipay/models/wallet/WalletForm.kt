package com.example.e1_elgin_kotlin.shipay.models.wallet

import com.google.gson.annotations.SerializedName

data class WalletForm (
    @SerializedName("items")
    var items: WalletItems,

    @SerializedName("order_ref")
    var order_ref: WalletOrderRef,

    @SerializedName("total")
    var total: WalletTotal,

    @SerializedName("wallet")
    var wallet: WalletInfo
)
