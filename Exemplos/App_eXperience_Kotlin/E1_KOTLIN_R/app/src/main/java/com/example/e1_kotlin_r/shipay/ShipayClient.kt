package com.example.e1_elgin_kotlin.shipay

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory


class ShipayClient {

    private lateinit var apiService: ShipayService

    fun getApiService() : ShipayService{

        if (!::apiService.isInitialized) {
            val retrofit = Retrofit.Builder()
                .baseUrl(Constants.BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
            apiService = retrofit.create(ShipayService::class.java)
        }

        return apiService


    }


}

