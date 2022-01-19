package com.elgin.elginexperience.shipay.requests;

import com.elgin.elginexperience.shipay.models.Buyer;
import com.elgin.elginexperience.shipay.models.OrderItem;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class CreateOrderRequest {
    public CreateOrderRequest(String order_ref, String wallet, float total, List<OrderItem> items, Buyer buyer) {
        this.order_ref = order_ref;
        this.wallet = wallet;
        this.total = total;
        this.items = items;
        this.buyer = buyer;
    }
    @SerializedName("order_ref")
    public String order_ref;

    @SerializedName("wallet")
    public String wallet;

    @SerializedName("total")
    public float total;

    @SerializedName("items")
    public List<OrderItem> items;

    @SerializedName("buyer")
    public Buyer buyer;
}
