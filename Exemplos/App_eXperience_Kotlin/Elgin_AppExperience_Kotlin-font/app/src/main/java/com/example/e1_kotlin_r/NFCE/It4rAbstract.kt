package com.example.e1_kotlin_r.NFCE

import br.com.daruma.framework.mobile.DarumaMobile


abstract class It4rAbstract protected constructor(protected var dmf: DarumaMobile) {
    abstract fun venderItem(descricao: String?, valor: String?, Codigo: String?)
    abstract fun encerrarVenda(valorTotal: String?, formaPagamento: String?)

    abstract fun configurarXmlNfce()
}
