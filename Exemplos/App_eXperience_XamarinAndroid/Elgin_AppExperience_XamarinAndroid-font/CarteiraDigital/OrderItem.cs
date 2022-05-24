using Newtonsoft.Json;


namespace M8
{
    class OrderItem
    {
        [JsonProperty(PropertyName = "item_title")]
        public string itemTitle { get; set; }

        [JsonProperty(PropertyName = "unit_price")]
        public float unitPrice { get; set; }

        [JsonProperty(PropertyName = "quantity")]
        public int quantity { get; set; }
    }
}