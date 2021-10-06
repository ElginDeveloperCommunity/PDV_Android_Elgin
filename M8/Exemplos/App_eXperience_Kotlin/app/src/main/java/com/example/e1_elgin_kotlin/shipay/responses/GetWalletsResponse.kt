package com.example.e1_elgin_kotlin.shipay.responses

import com.example.e1_elgin_kotlin.shipay.models.wallet.Wallet
import com.google.gson.annotations.SerializedName

data class GetWalletsResponse (
    @SerializedName("wallets")
    var wallets: List<Wallet>
)
