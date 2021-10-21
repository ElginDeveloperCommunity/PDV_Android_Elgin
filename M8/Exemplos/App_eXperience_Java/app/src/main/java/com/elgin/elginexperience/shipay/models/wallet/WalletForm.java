package com.elgin.elginexperience.shipay.models.wallet;

import com.google.gson.annotations.SerializedName;

public class WalletForm {
    @SerializedName("items")
    public WalletItems items;
    @SerializedName("order_ref")
    public WalletOrderRef order_ref;
    @SerializedName("total")
    public WalletTotal total;
    @SerializedName("wallet")
    public WalletInfo wallet;
}
