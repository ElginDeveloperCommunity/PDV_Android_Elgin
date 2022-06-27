package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

import androidx.annotation.NonNull;

final public class AbreConexaoImpressora extends TermicaCommand {
    final private int tipo;
    final private String modelo;
    final private String conexao;
    final private int parametro;

    public AbreConexaoImpressora(int tipo, @NonNull String modelo, @NonNull String conexao, int parametro) {
        super("AbreConexaoImpressora");
        this.tipo = tipo;
        this.modelo = modelo;
        this.conexao = conexao;
        this.parametro = parametro;
    }

    @Override
    protected String functionParameters() {
        return "\"tipo\"" + ":" + tipo + "," +
                "\"modelo\"" + ":" + "\"" + modelo + "\"" + "," +
                "\"conexao\"" + ":" + "\"" + conexao + "\"" + "," +
                "\"parametro\"" + ":" + parametro;
    }
}
