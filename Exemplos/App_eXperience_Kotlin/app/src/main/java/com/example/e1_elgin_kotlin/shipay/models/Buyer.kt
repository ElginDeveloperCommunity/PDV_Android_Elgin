package com.example.e1_elgin_kotlin.shipay.models

import com.google.gson.annotations.SerializedName

data class Buyer(
    @field:SerializedName("first_name") var first_name: String,
    @field:SerializedName("last_name") var last_name: String,
    @field:SerializedName("cpf") var cpf: String,
    @field:SerializedName("email") var email: String,
    @field:SerializedName("phone") var phone: String
)
