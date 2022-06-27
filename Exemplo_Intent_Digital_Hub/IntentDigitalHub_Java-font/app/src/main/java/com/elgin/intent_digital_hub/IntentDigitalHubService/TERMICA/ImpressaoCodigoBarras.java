package com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA;

import androidx.annotation.NonNull;

final public class ImpressaoCodigoBarras extends TermicaCommand {
    final private int tipo;
    final private String dados;
    final private int altura;
    final private int largura;
    final private int HRI;

    public ImpressaoCodigoBarras(int tipo, @NonNull String dados, int altura, int largura, int HRI) {
        super("ImpressaoCodigoBarras");
        this.tipo = tipo;
        this.dados = dados;
        this.altura = altura;
        this.largura = largura;
        this.HRI = HRI;
    }

    @Override
    protected String functionParameters() {
        return "\"tipo\"" + ":" + this.tipo + "," +
                "\"dados\"" + ":" + "\"" + this.dados + "\"" + "," +
                "\"altura\"" + ":" + this.altura + "," +
                "\"largura\"" + ":" + this.largura + "," +
                "\"HRI\"" + ":" + this.HRI;
    }
}
