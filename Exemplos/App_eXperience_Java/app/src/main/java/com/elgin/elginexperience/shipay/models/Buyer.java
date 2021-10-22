package com.elgin.elginexperience.shipay.models;

import com.google.gson.annotations.SerializedName;

public class Buyer {
    public Buyer(String first_name, String last_name, String cpf, String email, String phone) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.cpf = cpf;
        this.email = email;
        this.phone = phone;
    }

    @SerializedName("first_name")
    public String first_name;
    @SerializedName("last_name")
    public String last_name;
    @SerializedName("cpf")
    public String cpf;
    @SerializedName("email")
    public String email;
    @SerializedName("phone")
    public String phone;
}
