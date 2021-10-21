package com.elgin.elginexperience.shipay.models.wallet;

import com.google.gson.annotations.SerializedName;

public class WalletItems {
    @SerializedName("items")
    public WalletItem items;
    @SerializedName("type")
    public String type;
}
