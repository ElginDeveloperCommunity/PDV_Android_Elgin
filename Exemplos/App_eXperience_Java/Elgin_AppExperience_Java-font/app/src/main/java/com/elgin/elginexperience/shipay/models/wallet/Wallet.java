package com.elgin.elginexperience.shipay.models.wallet;

import com.google.gson.annotations.SerializedName;

public class Wallet {
    @SerializedName("active")
    public boolean active;
    @SerializedName("form")
    public WalletForm form;
    @SerializedName("minimum_payment")
    public float minimum_payment;
    @SerializedName("name")
    public String name;
    @SerializedName("wallet_fee")
    public float wallet_fee;
}
