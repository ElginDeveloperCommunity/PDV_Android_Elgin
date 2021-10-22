package com.elgin.elginexperience.shipay.requests;

import com.google.gson.annotations.SerializedName;

public class CreateEmployeeRequest {
    public CreateEmployeeRequest(String name, float salary, int age) {
        this.name = name;
        this.salary = salary;
        this.age = age;
    }
    @SerializedName("name")
    public String name;

    @SerializedName("salary")
    public float salary;

    @SerializedName("age")
    public int age;
}
