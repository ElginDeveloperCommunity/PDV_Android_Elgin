package com.elgin.elginexperience.shipay.responses;

import com.google.gson.annotations.SerializedName;

public class AuthenticationResponse {

    @SerializedName("access_token")
    public String access_token;

    @SerializedName("refresh_token")
    public String refresh_token;
}
