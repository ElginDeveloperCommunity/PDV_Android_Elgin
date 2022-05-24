using Newtonsoft.Json;
using System.Collections.Generic;

namespace M8
{
    class OrderRequest
    {
        [JsonProperty(PropertyName = "order_ref")]
        public string orderRef { get; set; }

        [JsonProperty(PropertyName = "wallet")]
        public string wallet { get; set; }

        [JsonProperty(PropertyName = "total")]
        public float total { get; set; }

        [JsonProperty(PropertyName = "items")]
        public List<OrderItem> items { get; set; }

        [JsonProperty(PropertyName = "buyer")]
        public Buyer buyer { get; set; }
    }
}