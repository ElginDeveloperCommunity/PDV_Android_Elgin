package com.example.e1_elgin_kotlin.shipay.requests

import com.google.gson.annotations.SerializedName

data class CreateEmployeeRequest(
    @field:SerializedName("name") var name: String,
    @field:SerializedName("salary") var salary: Float,
    @field:SerializedName("age") var age: Int
)
