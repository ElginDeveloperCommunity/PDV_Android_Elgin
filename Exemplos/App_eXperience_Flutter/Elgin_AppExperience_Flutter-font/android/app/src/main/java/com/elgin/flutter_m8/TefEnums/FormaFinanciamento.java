package com.elgin.flutter_m8.TefEnums;

public enum FormaFinanciamento {
    LOJA("loja"), ADM("adm"), A_VISTA("a_vista");

    //String rotulo utilizado para aferir os parâmetros enviados a partir da plataforma Flutter.
    private final String rotulo;

    FormaFinanciamento(String rotulo) {
        this.rotulo = rotulo;
    }

    public static FormaFinanciamento fromRotulo(String rotulo) {
        for(FormaFinanciamento formaFinanciamento : values()) {
            if(formaFinanciamento.rotulo.equals(rotulo)) {
                return formaFinanciamento;
            }
        }
        throw new IllegalArgumentException("Nenhuma forma de financiamento válida enviada!");
    }
}
