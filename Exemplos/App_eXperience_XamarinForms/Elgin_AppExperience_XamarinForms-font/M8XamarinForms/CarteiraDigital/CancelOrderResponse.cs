using Newtonsoft.Json;

namespace M8XamarinForms
{
    public class CancelOrderResponse
    {
        [JsonProperty(PropertyName = "status")]
        public string status { get; set; }
    }
}