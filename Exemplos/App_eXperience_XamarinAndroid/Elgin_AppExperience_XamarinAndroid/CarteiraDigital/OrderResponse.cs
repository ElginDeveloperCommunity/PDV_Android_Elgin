using Newtonsoft.Json;


namespace M8
{
    class OrderResponse
    {
        [JsonProperty(PropertyName = "deep_link")]
        public string deepLink { get; set; }

        [JsonProperty(PropertyName = "order_id")]
        public string orderId { get; set; }

        [JsonProperty(PropertyName = "pix_dict_key")]
        public string pixDictKey { get; set; }

        [JsonProperty(PropertyName = "pix_psp")]
        public string pixPsp { get; set; }

        [JsonProperty(PropertyName = "qr_code")]
        public string qrCode { get; set; }

        [JsonProperty(PropertyName = "qr_code_text")]
        public string qrCodeText { get; set; }

        [JsonProperty(PropertyName = "status")]
        public string status { get; set; }

        [JsonProperty(PropertyName = "wallet")]
        public string wallet { get; set; }
    }
}