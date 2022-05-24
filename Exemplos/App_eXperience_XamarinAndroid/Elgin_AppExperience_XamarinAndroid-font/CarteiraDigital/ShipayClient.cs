using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;

namespace M8
{
    class ShipayClient
    {
        HttpClient client;

        public ShipayClient()
        {
            client = new HttpClient();
        }

        public async Task<AuthenticationResponse> Authenticate(AuthenticationRequest request)
        {
            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            Uri uri = new Uri("https://api-staging.shipay.com.br/pdvauth");
            var result = await client.PostAsync(uri, content);
            // Se ocorrer um erro lança uma exceção
            result.EnsureSuccessStatusCode();
            // processa a resposta
            var resultString = await result.Content.ReadAsStringAsync();
            AuthenticationResponse responseJson = JsonConvert.DeserializeObject<AuthenticationResponse>(resultString);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", responseJson.accessToken);

            return responseJson;
        }

        public async Task<WalletsResponse> GetWallets()
        {
            Uri uri = new Uri("https://api-staging.shipay.com.br/wallets");
            var result = await client.GetAsync(uri);
            // Se ocorrer um erro lança uma exceção
            result.EnsureSuccessStatusCode();
            // processa a resposta
            var resultString = await result.Content.ReadAsStringAsync();
            WalletsResponse responseJson = JsonConvert.DeserializeObject<WalletsResponse>(resultString);
            return responseJson;
        }

        public async Task<OrderResponse> CreateOrder(OrderRequest request)
        {
            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            Uri uri = new Uri("https://api-staging.shipay.com.br/order");
            var result = await client.PostAsync(uri, content);
            // processa a resposta
            var resultString = await result.Content.ReadAsStringAsync();
            Console.WriteLine("[NEW ORDER] RESPONSE: " + resultString);
            // Se ocorrer um erro lança uma exceção
            result.EnsureSuccessStatusCode();
            OrderResponse responseJson = JsonConvert.DeserializeObject<OrderResponse>(resultString);
            return responseJson;
        }

        public async Task<CancelOrderResponse> CancelOrder(string orderId)
        {
            Uri uri = new Uri("https://api-staging.shipay.com.br/order/" + orderId);
            var result = await client.DeleteAsync(uri);
            // Se ocorrer um erro lança uma exceção
            result.EnsureSuccessStatusCode();
            // processa a resposta
            var resultString = await result.Content.ReadAsStringAsync();
            CancelOrderResponse responseJson = JsonConvert.DeserializeObject<CancelOrderResponse>(resultString);
            return responseJson;
        }

        public async Task<OrderStatusResponse> GetOrderStatus(string orderId)
        {
            Uri uri = new Uri("https://api-staging.shipay.com.br/order/" + orderId);
            var result = await client.GetAsync(uri);
            // Se ocorrer um erro lança uma exceção
            result.EnsureSuccessStatusCode();
            // processa a resposta
            var resultString = await result.Content.ReadAsStringAsync();
            OrderStatusResponse responseJson = JsonConvert.DeserializeObject<OrderStatusResponse>(resultString);
            return responseJson;
        }
    }
}