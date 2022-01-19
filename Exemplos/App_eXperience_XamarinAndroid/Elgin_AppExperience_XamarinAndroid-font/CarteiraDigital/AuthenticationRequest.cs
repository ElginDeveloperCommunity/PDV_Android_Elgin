using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;


namespace M8
{
    class AuthenticationRequest
    {
        [JsonProperty(PropertyName = "access_key")]
        public string accessKey { get; set; }

        [JsonProperty(PropertyName = "client_id")]
        public string clientId { get; set; }

        [JsonProperty(PropertyName = "secret_key")]
        public string secretKey { get; set; }
    }
}