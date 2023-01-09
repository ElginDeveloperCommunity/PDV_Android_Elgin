package com.elgin.flutter_m8.TefEnums;

//Ações disponíveis, correspondente aos botões na tela.
public enum Acao {
    VENDA("venda"), CANCELAMENTO("cancelamento"), CONFIGURACAO("configuracao");

    //String rotulo utilizado para aferir os parâmetros enviados a partir da plataforma Flutter.
    private final String rotulo;

    Acao(String rotulo) {
        this.rotulo = rotulo;
    }

    public static Acao fromRotulo(String rotulo) {
        for (Acao acao : values()) {
            if (acao.rotulo.equals(rotulo)) {
                return acao;
            }
        }
        throw new IllegalArgumentException("Nenhuma ação válida enviada!");
    }
}
