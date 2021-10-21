package com.elgin.elginexperience.shipay;

import com.elgin.elginexperience.shipay.requests.AuthenticationRequest;
import com.elgin.elginexperience.shipay.requests.CreateOrderRequest;
import com.elgin.elginexperience.shipay.responses.AuthenticationResponse;
import com.elgin.elginexperience.shipay.responses.CancelOrderResponse;
import com.elgin.elginexperience.shipay.responses.CreateOrderResponse;
import com.elgin.elginexperience.shipay.responses.GetOrderStatusResponse;
import com.elgin.elginexperience.shipay.responses.GetWalletsResponse;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ShipayService {
    @POST(Constants.AUTH_URL)
    Call<AuthenticationResponse> authenticate(@Body AuthenticationRequest request);

    @POST(Constants.CREATE_ORDER_URL)
    Call<CreateOrderResponse> createOrder(@Header("Authorization") String token, @Body CreateOrderRequest request);

    @GET(Constants.GET_WALLETS)
    Call<GetWalletsResponse> getWallets(@Header("Authorization") String token);

    @DELETE(Constants.CANCEL_ORDER)
    Call<CancelOrderResponse> cancelOrder(@Header("Authorization") String token, @Path("order_id") String orderId);

    @GET(Constants.GET_ORDER_STATUS)
    Call<GetOrderStatusResponse> getOrderStatus(@Header("Authorization") String token, @Path("order_id") String orderId);
}
