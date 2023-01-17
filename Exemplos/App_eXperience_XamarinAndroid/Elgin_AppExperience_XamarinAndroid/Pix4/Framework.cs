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

namespace M8
{
    public class Framework
    {
        public Framework(string nome, string githubLink)
        {
            Nome = nome;
            GithubLink = githubLink;
        }

        public string Nome { get; private set; }
        public string GithubLink { get; private set; }

        public static Framework JAVA = new Framework("JAVA", "https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Java");
        public static Framework DELPHI = new Framework("DELPHI", "https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_FireMonkey");
        public static Framework FLUTTER = new Framework("FLUTTER", "https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Flutter");
        public static Framework XAMARIN_ANDROID = new Framework("XAMARIN_ANDROID", "https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_XamarinAndroid");
        public static Framework XAMARIN_FORMS = new Framework("XAMARIN_FORMS", "https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_XamarinForms");
        public static Framework REACT_NATIVE = new Framework("REACT_NATIVE", "https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_ReactNative");
        public static Framework KOTLIN = new Framework("KOTLIN", "https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Kotlin");
        public static Framework IONIC = new Framework("IONIC", "https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Ionic");
    }
}
