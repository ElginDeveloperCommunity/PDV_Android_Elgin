using Newtonsoft.Json;
using System.Collections.Generic;

namespace M8
{
    class WalletsResponse
    {
        [JsonProperty(PropertyName = "wallets")]
        public List<Wallet> wallets { get; set; }
    }
}