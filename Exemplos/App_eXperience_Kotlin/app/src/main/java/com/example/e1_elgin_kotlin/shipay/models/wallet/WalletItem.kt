package com.example.e1_elgin_kotlin.shipay.models.wallet

import com.google.gson.annotations.SerializedName

data class WalletItem (
    @SerializedName("item_title")
    var item_title: WalletItemItemTitle?,

    @SerializedName("quantity")
    var quantity: WalletItemQuantity,

    @SerializedName("type")
    var type: WalletItemType
)
