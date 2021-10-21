package com.elgin.elginexperience.shipay.responses;

import com.google.gson.annotations.SerializedName;

public class CancelOrderResponse {
    @SerializedName("order_id")
    public String order_id;

    @SerializedName("status")
    public String status;
}
