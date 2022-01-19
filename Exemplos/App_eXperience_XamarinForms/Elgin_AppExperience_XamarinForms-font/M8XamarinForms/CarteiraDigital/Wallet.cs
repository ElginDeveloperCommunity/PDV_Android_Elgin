using Newtonsoft.Json;

namespace M8XamarinForms
{
    public class Wallet
    {
        [JsonProperty(PropertyName = "name")]
        public string name { get; set; }
    }
}