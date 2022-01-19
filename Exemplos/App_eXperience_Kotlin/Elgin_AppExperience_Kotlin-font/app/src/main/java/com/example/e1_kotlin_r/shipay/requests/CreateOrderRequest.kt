package com.example.e1_elgin_kotlin.shipay.requests

import com.example.e1_elgin_kotlin.shipay.models.Buyer
import com.example.e1_elgin_kotlin.shipay.models.OrderItem
import com.google.gson.annotations.SerializedName

data class CreateOrderRequest(
    @field:SerializedName("order_ref") var order_ref: String,
    @field:SerializedName("wallet") var wallet: String,
    @field:SerializedName("total") var total: Float,
    @field:SerializedName("items") var items: List<OrderItem>,
    @field:SerializedName("buyer") var buyer: Buyer
)
