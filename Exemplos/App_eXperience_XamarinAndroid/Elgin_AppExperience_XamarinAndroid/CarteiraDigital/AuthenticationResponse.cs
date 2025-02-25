﻿using Newtonsoft.Json;


namespace M8
{
    class AuthenticationResponse
    {
        [JsonProperty(PropertyName = "access_token")]
        public string accessToken { get; set; }

        [JsonProperty(PropertyName = "refresh_token")]
        public string refreshToken { get; set; }
    }
}