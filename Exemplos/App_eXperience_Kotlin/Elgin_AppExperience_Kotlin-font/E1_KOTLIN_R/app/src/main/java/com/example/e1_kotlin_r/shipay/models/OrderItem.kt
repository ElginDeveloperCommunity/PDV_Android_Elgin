package com.example.e1_elgin_kotlin.shipay.models

import com.google.gson.annotations.SerializedName

data class OrderItem(
    @field:SerializedName("item_title") var item_title: String,
    @field:SerializedName("unit_price") var unit_price: Float,
    @field:SerializedName("quantity") var quantity: Int
)
