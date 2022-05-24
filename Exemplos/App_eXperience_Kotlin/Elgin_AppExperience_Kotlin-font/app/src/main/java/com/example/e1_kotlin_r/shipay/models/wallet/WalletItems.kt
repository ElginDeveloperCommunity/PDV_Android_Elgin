package com.example.e1_elgin_kotlin.shipay.models.wallet

import com.google.gson.annotations.SerializedName

data class WalletItems (
    @SerializedName("items")
    var items: WalletItem,

    @SerializedName("type")
    var type: String
)
