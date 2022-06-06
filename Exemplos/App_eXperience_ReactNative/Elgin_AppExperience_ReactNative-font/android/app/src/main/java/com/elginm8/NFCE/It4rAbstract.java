package com.elginm8.NFCE;

import androidx.annotation.NonNull;

import br.com.daruma.framework.mobile.DarumaMobile;

public abstract class It4rAbstract {
    protected DarumaMobile dmf;

    protected It4rAbstract(@NonNull DarumaMobile dmfObject) {
        this.dmf = dmfObject;
    }

    public abstract void venderItem(String descricao, String valor, String Codigo);

    public abstract void encerrarVenda(String valorTotal, String formaPagamento);

    public abstract void configurarXmlNfce() throws InterruptedException;
}
