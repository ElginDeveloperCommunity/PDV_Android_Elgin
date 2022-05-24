package com.example.e1_kotlin_r.NFCE


import br.com.daruma.framework.mobile.DarumaMobile
import br.com.daruma.framework.mobile.exception.DarumaException
import java.util.concurrent.atomic.AtomicLong

/**
 * A implementação dos métodos da DarumaMobileFramework exigem que os métodos que possuem requisição aos webservices sejam executados em threads
 * e por isto, para que possíveis exceções jogadas dentro da threads sejam capturadas foi criada um objeto de controle, que externaliza os exceções
 * para tratamentos de erro e/ou mensagens de erro.
 */
class It4r(dmfObject: DarumaMobile) : It4rAbstract(dmfObject) {
    @Throws(DarumaException::class)
    override fun venderItem(descricao: String?, valor: String?, codigo: String?) {
        val sellItemThread = Thread {
            try {
                if (dmf.rCFVerificarStatus_NFCe() < 2) dmf.aCFAbrir_NFCe(
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                )
                dmf.aCFConfICMS00_NFCe("0", "00", "3", "17.50")
                dmf.aCFConfPisAliq_NFCe("01", "10.00")
                dmf.aCFConfCofinsAliq_NFCe("01", "10.00")
                dmf.aCFVenderCompleto_NFCe(
                    "17.50",
                    "1.00",
                    valor,
                    "D$",
                    "0.00",
                    codigo,
                    "21050010",
                    "5102",
                    "UN",
                    descricao,
                    "CEST=2300100;cEAN=SEM GTIN;cEANTrib=SEM GTIN;"
                )
            } catch (darumaException: DarumaException) {
                darumaException.printStackTrace()
                capturedException = darumaException
            }
        }
        sellItemThread.start()
        try {
            sellItemThread.join()
        } catch (e: InterruptedException) {
            e.printStackTrace()
        }
        if (capturedException != null) throwExceptionAndResetCapture()
    }

    override fun encerrarVenda(valorTotal: String?, formaPagamento: String?) {
        val finishSaleThread = Thread {
            try {
                if (valorTotal != null) {
                    require(valorTotal.toFloat() >= 0.01f) { "Valor não aceito para o encerramento de venda!" }
                }
                dmf.aCFTotalizar_NFCe("D$", "0.00")
                dmf.aCFEfetuarPagamento_NFCe(formaPagamento, valorTotal)
                It4r.timeElapsedInLastEmission = AtomicLong(0)
                val startTime = System.currentTimeMillis()
                dmf.tCFEncerrar_NFCe("ELGIN DEVELOPERS COMMUNITY")
                val endTime = System.currentTimeMillis()
                It4r.timeElapsedInLastEmission =
                    AtomicLong(endTime - startTime)
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\EstadoCFe", "0")
            } catch (darumaException: DarumaException) {
                darumaException.printStackTrace()
                capturedException = darumaException
            }
        }
        finishSaleThread.start()
        try {
            finishSaleThread.join()
        } catch (e: InterruptedException) {
            e.printStackTrace()
        }
        if (capturedException != null) throwExceptionAndResetCapture()
    }




    @Throws(DarumaException::class)
    override fun configurarXmlNfce() {
        val configurateXmlNfceThread = Thread {
            try {
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\EmpPK", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe(
                    "CONFIGURACAO\\EmpCK",
                    "<INSERIR SEUS DADOS>",
                    false
                )
                dmf.RegAlterarValor_NFCe("IDE\\cUF", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("EMIT\\CNPJ", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("EMIT\\IE", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("EMIT\\xNome", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("EMIT\\ENDEREMIT\\UF", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("EMIT\\CRT", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("EMIT\\CRT", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\TipoAmbiente", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\Impressora", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\AvisoContingencia", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\ImpressaoCompleta", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\NumeracaoAutomatica", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\HabilitarSAT", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\IdToken", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe(
                    "CONFIGURACAO\\Token",
                    "<INSERIR SEUS DADOS>",
                    false
                )
                dmf.RegAlterarValor_NFCe("IDE\\Serie", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\NT\\VersaoNT", "<INSERIR SEUS DADOS>", false)
                dmf.RegAlterarValor_NFCe("CONFIGURACAO\\EstadoCFe", "<INSERIR SEUS DADOS>", false)
                dmf.RegPersistirXML_NFCe()

                adjustNfceNumber();
            } catch (darumaException: DarumaException) {
                darumaException.printStackTrace()
                capturedException = darumaException
            }
        }
        configurateXmlNfceThread.start()
        try {
            configurateXmlNfceThread.join()
        } catch (e: InterruptedException) {
            e.printStackTrace()
        }
        if (capturedException != null) throwExceptionAndResetCapture()
    }

    @Throws(DarumaException::class)
    private fun throwExceptionAndResetCapture() {
        val lastException = capturedException
        capturedException = null
        throw lastException!!
    }

    fun numeroNota(): String? {
        val numeroNota = CharArray(50)
        dmf.rInfoEstendida_NFCe("2", numeroNota)
        return String(numeroNota).trim { it <= ' ' }
    }

    fun numeroSerie(): String? {
        val serieNota = CharArray(50)
        dmf.rInfoEstendida_NFCe("5", serieNota)
        return String(serieNota).trim { it <= ' ' }
    }



    val timeElapsedInLastEmission: AtomicLong
        get() = Companion.timeElapsedInLastEmission

    //Função que busca a informação da nota mais alta pra série já escrita NFC-e para envio em cache, impedindo erro de duplicidade de NFC-e
    @Throws(DarumaException::class)
    fun adjustNfceNumber() {
        val retorno = CharArray(50)
        dmf.rRetornarInformacao_NFCe("NUM", "0", "0", "133", "", "9", retorno)
        val retornoAjustado = String(retorno).trim { it <= ' ' }
        val notaMaisAlta = retornoAjustado.replace("\\D+".toRegex(), "")
        val notaMaisAltaInt = notaMaisAlta.toInt() + 1
        val proximaNota = notaMaisAltaInt.toString()
        dmf.RegAlterarValor_NFCe("IDE\\nNF", proximaNota)
        dmf.RegPersistirXML_NFCe()
    }

    companion object {
        //Valor utilizado para guardar o valor do tempo de emissão
        private var timeElapsedInLastEmission = AtomicLong(0)

        //Obtejo utilizada para verificar se houve alguma exceção nas threads que executam as funções DarumaMobile
        @Volatile
        private var capturedException: DarumaException? = null
    }
}
