using Newtonsoft.Json;

namespace M8
{
    public class Wallet
    {
        [JsonProperty(PropertyName = "name")]
        public string name { get; set; }
    }
}