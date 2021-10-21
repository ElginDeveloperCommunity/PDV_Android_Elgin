package com.elgin.elginexperience.shipay.models;

import com.google.gson.annotations.SerializedName;

public class BuyerInfo {

    @SerializedName("address")
    public String address;

    @SerializedName("city")
    public String city;

    @SerializedName("document")
    public String document;

    @SerializedName("email")
    public String email;

    @SerializedName("first_name")
    public String first_name;

    @SerializedName("last_name")
    public String last_name;

    @SerializedName("phone")
    public String phone;

    @SerializedName("state")
    public String state;
}
