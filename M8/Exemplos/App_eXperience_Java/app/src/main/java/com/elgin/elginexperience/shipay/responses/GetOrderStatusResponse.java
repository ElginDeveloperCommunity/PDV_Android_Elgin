package com.elgin.elginexperience.shipay.responses;

import com.elgin.elginexperience.shipay.models.BuyerInfo;
import com.elgin.elginexperience.shipay.models.OrderItem;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class GetOrderStatusResponse {
    @SerializedName("buyer_info")
    public BuyerInfo buyer_info;

    @SerializedName("created_at")
    public String created_at;

    @SerializedName("external_id")
    public String external_id;

    @SerializedName("items")
    public List<OrderItem> items;

    @SerializedName("order_id")
    public String order_id;

    @SerializedName("paid_amount")
    public float paid_amount;

    @SerializedName("payment_date")
    public String payment_date;

    @SerializedName("pix_psp")
    public String pix_psp;

    @SerializedName("status")
    public String status;

    @SerializedName("total_order")
    public float total_order;

    @SerializedName("updated_at")
    public String updated_at;

    @SerializedName("wallet")
    public String wallet;

    @SerializedName("wallet_payment_id")
    public String wallet_payment_id;
}
