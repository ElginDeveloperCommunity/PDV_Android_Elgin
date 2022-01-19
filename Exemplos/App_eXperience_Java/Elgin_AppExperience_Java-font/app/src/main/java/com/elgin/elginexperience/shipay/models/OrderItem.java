package com.elgin.elginexperience.shipay.models;

import com.google.gson.annotations.SerializedName;

public class OrderItem {
    public OrderItem(String item_title, float unit_price, int quantity) {
        this.item_title = item_title;
        this.unit_price = unit_price;
        this.quantity = quantity;
    }

    @SerializedName("item_title")
    public String item_title;
    @SerializedName("unit_price")
    public float unit_price;
    @SerializedName("quantity")
    public int quantity;
}
