package com.elgin.elginexperience.shipay.models.wallet;

import com.google.gson.annotations.SerializedName;

public class WalletItem {
    @SerializedName("item_title")
    public WalletItemItemTitle item_title;
    @SerializedName("quantity")
    public WalletItemQuantity quantity;
    @SerializedName("type")
    public WalletItemType type;
}
