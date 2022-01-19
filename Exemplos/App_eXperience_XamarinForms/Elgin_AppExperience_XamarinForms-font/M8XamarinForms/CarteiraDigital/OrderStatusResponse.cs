using Newtonsoft.Json;

namespace M8XamarinForms
{
    public class OrderStatusResponse
    {
        [JsonProperty(PropertyName = "status")]
        public string status { get; set; }
    }
}