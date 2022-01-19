package com.elgin.elginexperience.shipay.requests;

import com.google.gson.annotations.SerializedName;

public class AuthenticationRequest {
    public AuthenticationRequest(String access_key, String secret_key, String client_id) {
        this.access_key = access_key;
        this.secret_key = secret_key;
        this.client_id = client_id;
    }
    @SerializedName("access_key")
    public String access_key;

    @SerializedName("secret_key")
    public String secret_key;

    @SerializedName("client_id")
    public String client_id;
}
