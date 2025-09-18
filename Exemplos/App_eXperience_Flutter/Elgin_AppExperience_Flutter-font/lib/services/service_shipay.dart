import 'dart:convert';
import 'package:http/http.dart' as http;

class ShipayService {
  Future<Map> authentication() async {
    var url = "https://api-staging.shipay.com.br/pdvauth";

    var response = await http.post(
      Uri.parse(url),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        "access_key": "",
        "secret_key":
            "",
        "client_id":
            ""
      }),
    );

    var jsonResponse = jsonDecode(response.body);
    return jsonResponse;
  }

  Future<Map> getWallets({
    required String token,
  }) async {
    var url = "https://api-staging.shipay.com.br/wallets";

    var response = await http.get(
      Uri.parse(url),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
    );

    var jsonResponse = jsonDecode(response.body);
    return jsonResponse;
  }

  Future<Map> sendOrder({required String orderRef,
    required String wallet,
    required double total,
    required String token,
  }) async {
    var url = "https://api-staging.shipay.com.br/order";

    var response = await http.post(
      Uri.parse(url),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(<String, Object>{
        "order_ref": orderRef,
        "wallet": wallet,
        "total": total,
        "items": [
          {"item_title": "Item 01", "unit_price": total, "quantity": 1}
        ],
        "buyer": {
          "first_name": "Shipay",
          "last_name": "PDV",
          "cpf": "000.000.000-00",
          "email": "shipaypagador@shipay.com.br",
          "phone": "+55 11 99999-9999"
        }
      }),
    );

    var jsonResponse = jsonDecode(response.body);
    return jsonResponse;
  }

  Future<Map> getStatusOrder({
    required String orderId,
    required String accessToken,
  }) async {
    var url = "https://api-staging.shipay.com.br/order/$orderId";

    var response = await http.get(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    var json = jsonDecode(response.body);
    return json;
  }

  Future<Map> deleteOrder({
    required String orderId,
    required String accessToken,
  }) async {
    var url = "https://api-staging.shipay.com.br/order/$orderId";

    var response = await http.delete(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    var json = jsonDecode(response.body);
    return json;
  }
}
