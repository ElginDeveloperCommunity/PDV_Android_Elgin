package com.elgin.elginexperience.shipay;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ShipayClient {
    private ShipayService apiService;

    public ShipayService getApiService() {

        // Initialize ApiService if not initialized yet
        if (apiService == null) {
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl(Constants.BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            apiService = retrofit.create(ShipayService.class);
        }

        return apiService;
    }
}
