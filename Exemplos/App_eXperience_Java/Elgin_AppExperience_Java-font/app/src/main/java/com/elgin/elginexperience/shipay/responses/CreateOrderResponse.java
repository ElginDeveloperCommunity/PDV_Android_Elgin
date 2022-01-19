package com.elgin.elginexperience.shipay.responses;

import com.google.gson.annotations.SerializedName;

public class CreateOrderResponse {
    @SerializedName("deep_link")
    public String deep_link;

    @SerializedName("order_id")
    public String order_id;

    @SerializedName("pix_dict_key")
    public String pix_dict_key;

    @SerializedName("pix_psp")
    public String pix_psp;

    @SerializedName("qr_code")
    public String qr_code;

    @SerializedName("qr_code_text")
    public String qr_code_text;

    @SerializedName("status")
    public String status;

    @SerializedName("wallet")
    public String wallet;
}
