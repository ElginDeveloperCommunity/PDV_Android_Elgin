package com.elgin.elginexperience.shipay.responses;

import com.elgin.elginexperience.shipay.models.wallet.Wallet;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class GetWalletsResponse {
    @SerializedName("wallets")
    public List<Wallet> wallets;
}
