package com.example.e1_elgin_kotlin.shipay.requests

import com.google.gson.annotations.SerializedName

data class AuthenticationRequest(
    @field:SerializedName("access_key") var access_key: String,
    @field:SerializedName("secret_key") var secret_key: String,
    @field:SerializedName("client_id") var client_id: String
)
