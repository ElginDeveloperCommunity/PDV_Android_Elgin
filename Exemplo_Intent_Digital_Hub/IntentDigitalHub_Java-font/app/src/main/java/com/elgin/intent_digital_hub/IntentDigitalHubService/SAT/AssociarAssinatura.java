package com.elgin.intent_digital_hub.IntentDigitalHubService.SAT;

import androidx.annotation.NonNull;

final public class AssociarAssinatura extends SatCommand {
    final private int numSessao;
    final private String codAtivacao;
    final private String cnpjSH;
    final private String assinaturaAC;

    public AssociarAssinatura(int numSessao, @NonNull String codAtivacao, @NonNull String cnpjSH, @NonNull String assinaturaAC) {
        super("AssociarAssinatura");
        this.numSessao = numSessao;
        this.codAtivacao = codAtivacao;
        this.cnpjSH = cnpjSH;
        this.assinaturaAC = assinaturaAC;
    }

    @Override
    protected String functionParameters() {
        return  "\"numSessao\"" + ":" + this.numSessao + "," +
                "\"codAtivacao\"" + ":" + "\"" + this.codAtivacao + "\"" + "," +
                "\"cnpjSH\"" + ":" + "\"" + this.cnpjSH + "\"" + "," +
                "\"assinaturaAC\"" + ":" + "\"" + this.assinaturaAC + "\"";
    }
}
