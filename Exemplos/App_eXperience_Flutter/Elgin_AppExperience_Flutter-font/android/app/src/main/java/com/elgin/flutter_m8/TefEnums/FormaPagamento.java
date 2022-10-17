package com.elgin.flutter_m8.TefEnums;

import java.text.Normalizer;

public enum FormaPagamento {
    CREDITO("credito"), DEBITO("debito"), TODOS("todos");

    //String rotulo utilizado para aferir os parâmetros enviados a partir da plataforma Flutter.
    private final String rotulo;

    FormaPagamento(String rotulo) {
        this.rotulo = rotulo;
    }

    public static FormaPagamento fromRotulo(String rotulo) {
        for (FormaPagamento formaPagamento : values()) {
            if (formaPagamento.rotulo.equals(rotulo)) {
                return formaPagamento;
            }
        }
        throw new IllegalArgumentException("Nenhuma forma de pagamento válida enviada!");
    }
}
