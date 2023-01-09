package com.elgin.elginexperience.Services.Pix4;

public enum Framework {
    JAVA("https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Java"),
    DELPHI("https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_FireMonkey"),
    FLUTTER("https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Flutter"),
    XAMARIN_ANDROID("https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_XamarinAndroid"),
    XAMARIN_FORMS("https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_XamarinAndroid"),
    REACT_NATIVE("https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_ReactNative"),
    KOTLIN("https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Kotlin"),
    IONIC("https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Ionic");

    final String nome;
    final String githubLink;

    Framework(String githubLink) {
        this.nome = this.name();
        this.githubLink = githubLink;
    }

}
