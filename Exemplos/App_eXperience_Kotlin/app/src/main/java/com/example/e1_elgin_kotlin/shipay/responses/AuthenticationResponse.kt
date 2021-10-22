package com.example.e1_elgin_kotlin.shipay.responses

import com.google.gson.annotations.SerializedName

data class AuthenticationResponse (
    @SerializedName("access_token")
    var access_token: String,

    @SerializedName("refresh_token")
    var refresh_token: String
)
