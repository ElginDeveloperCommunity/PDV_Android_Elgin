package com.elgin.flutter_m8.TefEnums;

public enum TEF {
    PAY_GO("pay_go"), M_SITEF("m_sitef"), ELGIN_TEF("elgin_tef");

    //String rotulo utilizado para aferir os parâmetros enviados a partir da plataforma Flutter.
    private final String rotulo;

    TEF(String rotulo) {
        this.rotulo = rotulo;
    }

    public static TEF fromRotulo(String rotulo) {
        for(TEF tef : values()) {
            if(tef.rotulo.equals(rotulo)) {
                return tef;
            }
        }
        throw new IllegalArgumentException("Nenhuma opção de TEF válida enviada!");
    }
}
