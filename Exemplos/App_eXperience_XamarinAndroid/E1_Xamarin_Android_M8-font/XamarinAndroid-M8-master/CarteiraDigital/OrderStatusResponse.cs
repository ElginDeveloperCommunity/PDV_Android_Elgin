using Newtonsoft.Json;

namespace M8
{
    public class OrderStatusResponse
    {
        [JsonProperty(PropertyName = "status")]
        public string status { get; set; }
    }
}