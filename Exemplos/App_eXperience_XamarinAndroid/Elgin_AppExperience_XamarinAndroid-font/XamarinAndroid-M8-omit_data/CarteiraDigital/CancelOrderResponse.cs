using Newtonsoft.Json;

namespace M8
{
    public class CancelOrderResponse
    {
        [JsonProperty(PropertyName = "status")]
        public string status { get; set; }
    }
}