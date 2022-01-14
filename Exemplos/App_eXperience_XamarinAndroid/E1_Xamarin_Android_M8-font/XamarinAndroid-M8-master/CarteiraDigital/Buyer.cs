using Newtonsoft.Json;


namespace M8
{
    class Buyer
    {
        [JsonProperty(PropertyName = "first_name")]
        public string firstName { get; set; }

        [JsonProperty(PropertyName = "last_name")]
        public string lastName { get; set; }

        [JsonProperty(PropertyName = "cpf")]
        public string cpf { get; set; }

        [JsonProperty(PropertyName = "email")]
        public string email { get; set; }

        [JsonProperty(PropertyName = "phone")]
        public string phone { get; set; }
    }
}