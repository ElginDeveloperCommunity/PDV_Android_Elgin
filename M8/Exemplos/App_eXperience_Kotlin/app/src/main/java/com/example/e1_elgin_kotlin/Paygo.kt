package com.example.e1_elgin_kotlin

import android.annotation.SuppressLint
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Handler
import android.widget.Toast
import java.io.File
import java.util.HashMap
import org.json.JSONException
import org.json.JSONObject
import br.com.setis.interfaceautomacao.Cartoes
import br.com.setis.interfaceautomacao.Confirmacoes
import br.com.setis.interfaceautomacao.DadosAutomacao
import br.com.setis.interfaceautomacao.Financiamentos
import br.com.setis.interfaceautomacao.ModalidadesPagamento
import br.com.setis.interfaceautomacao.Operacoes
import br.com.setis.interfaceautomacao.EntradaTransacao
import br.com.setis.interfaceautomacao.Personalizacao
import br.com.setis.interfaceautomacao.SaidaTransacao
import br.com.setis.interfaceautomacao.StatusTransacao
import br.com.setis.interfaceautomacao.Transacoes
import br.com.setis.interfaceautomacao.Versoes
import br.com.setis.interfaceautomacao.ViasImpressao


class Paygo(activity: Activity) {
    private var mainActivity: Activity? = null

    private var mSaidaTransacao: SaidaTransacao? = null
    private var mDadosAutomacao: DadosAutomacao? = null
    private lateinit var mTransacoes: Transacoes
    private var mConfirmacao: Confirmacoes? = null
    private var mEntradaTransacao: EntradaTransacao? = null
    private var mPersonalizacao: Personalizacao? = null
    private var versoes: Versoes? = null
    private var mHandler: Handler? = null

    init {
        mainActivity = activity
        IniciaClassesInterface(false, false, false, false)
        mHandler = Handler()
    }

    private val mostraJanelaResultado = Runnable{
        val mapValues: MutableMap<String, Any> = HashMap()
        val tef = Tef()

        val retorno = mSaidaTransacao!!.obtemMensagemResultado()
        var via_cliente = ""

        if (mSaidaTransacao!!.obtemInformacaoConfirmacao()) {
            mConfirmacao!!.informaStatusTransacao(StatusTransacao.CONFIRMADO_AUTOMATICO)
            mTransacoes.confirmaTransacao(mConfirmacao!!)
            val vias = mSaidaTransacao!!.obtemViasImprimir()

            //Imprime a via do cliente
            if (vias == ViasImpressao.VIA_CLIENTE || vias == ViasImpressao.VIA_CLIENTE_E_ESTABELECIMENTO) {
                via_cliente = mSaidaTransacao!!.obtemComprovanteGraficoPortador()
            }
            mapValues["retorno"] = retorno
            mapValues["via_cliente"] = via_cliente
            tef.optionReturnPaygo(activity, mapValues)
        }
    }

    fun mostraResultadoTransacao() {
        var retorno: String? = ""
        retorno = mSaidaTransacao!!.obtemMensagemResultado()
        if (mSaidaTransacao!!.obtemInformacaoConfirmacao()) {
            mConfirmacao!!.informaStatusTransacao(StatusTransacao.CONFIRMADO_AUTOMATICO)
            mTransacoes!!.confirmaTransacao(mConfirmacao!!)
            val vias = mSaidaTransacao!!.obtemViasImprimir()

            //Imprime a via do cliente
            if (vias == ViasImpressao.VIA_CLIENTE || vias == ViasImpressao.VIA_CLIENTE_E_ESTABELECIMENTO) {
                val via_cliente = mSaidaTransacao!!.obtemComprovanteGraficoPortador()
                retorno = via_cliente
            }
        }
    }


    fun efetuaTransacao(operacao: Operacoes, map: Map<*, *>) {
        mEntradaTransacao = EntradaTransacao(operacao, "1")
        if (operacao != Operacoes.ADMINISTRATIVA) {
            val valor = map["valor"] as String?
            val parcelas = map["parcelas"] as Int
            val formaPagamento = map["formaPagamento"] as String?
            val tipoParcelamento = map["tipoParcelamento"] as String?
            mEntradaTransacao!!.informaValorTotal(valor)
            if (operacao == Operacoes.VENDA) {
                mEntradaTransacao!!.informaDocumentoFiscal("1000")
            }
            mEntradaTransacao!!.informaModalidadePagamento(ModalidadesPagamento.PAGAMENTO_CARTAO)
            if (formaPagamento == "Crédito") {
                mEntradaTransacao!!.informaTipoCartao(Cartoes.CARTAO_CREDITO)
                mEntradaTransacao!!.informaNumeroParcelas(parcelas)
            } else if (formaPagamento == "Débito") {
                mEntradaTransacao!!.informaTipoCartao(Cartoes.CARTAO_DEBITO)
                mEntradaTransacao!!.informaNumeroParcelas(parcelas)
            } else {
                mEntradaTransacao!!.informaTipoCartao(Cartoes.CARTAO_DESCONHECIDO)
            }
            if (tipoParcelamento == "Loja") {
                mEntradaTransacao!!.informaTipoFinanciamento(Financiamentos.PARCELADO_ESTABELECIMENTO)
            } else if (tipoParcelamento == "Adm") {
                mEntradaTransacao!!.informaTipoFinanciamento(Financiamentos.PARCELADO_EMISSOR)
            } else {
                mEntradaTransacao!!.informaTipoFinanciamento(Financiamentos.A_VISTA)
            }
            mEntradaTransacao!!.informaNomeProvedor("DEMO")
            mEntradaTransacao!!.informaCodigoMoeda("986")
        }
        mConfirmacao = Confirmacoes()
        Thread(label@ Runnable {
            try {
                mDadosAutomacao!!.obtemPersonalizacaoCliente()
                mSaidaTransacao = mTransacoes!!.realizaTransacao(mEntradaTransacao!!)
                if (mSaidaTransacao == null) return@Runnable

                mConfirmacao!!.informaIdentificadorConfirmacaoTransacao(
                    mSaidaTransacao!!.obtemIdentificadorConfirmacaoTransacao()
                )
                mEntradaTransacao = null
            } catch (e: Exception) {
                println("Exception$e")
            } finally {
                mEntradaTransacao = null
                if (mSaidaTransacao != null) {
                    mHandler!!.post(mostraJanelaResultado)
                }
            }
        }).start()
    }

    private fun IniciaClassesInterface(
        suportaViasDiferenciadas: Boolean,
        suportaViasReduzidas: Boolean,
        troco: Boolean,
        desconto: Boolean
    ) {
        val versaoAutomacao: String?
        versaoAutomacao = try {
            mainActivity!!.packageManager.getPackageInfo(
                mainActivity!!.packageName, 0
            ).versionName
        } catch (e: PackageManager.NameNotFoundException) {
            "Indisponivel"
        }
        mPersonalizacao = setPersonalizacao(false)
        mDadosAutomacao = DadosAutomacao(
            "Automacao Demo", versaoAutomacao!!, "SETIS",
            troco, desconto, suportaViasDiferenciadas, suportaViasReduzidas, true, mPersonalizacao
        )
       mTransacoes = Transacoes.obtemInstancia(mDadosAutomacao, mainActivity)
        versoes = mTransacoes.obtemVersoes()
    }

    private fun setPersonalizacao(isInverse: Boolean): Personalizacao? {
        val pb = Personalizacao.Builder()
        try {
            if (isInverse) {
                pb.informaCorFonte("#000000")
                pb.informaCorFonteTeclado("#000000")
                pb.informaCorFundoCaixaEdicao("#FFFFFF")
                pb.informaCorFundoTela("#F4F4F4")
                pb.informaCorFundoTeclado("#F4F4F4")
                pb.informaCorFundoToolbar("#2F67F4")
                pb.informaCorTextoCaixaEdicao("#000000")
                pb.informaCorTeclaPressionadaTeclado("#e1e1e1")
                pb.informaCorTeclaLiberadaTeclado("#dedede")
                pb.informaCorSeparadorMenu("#2F67F4")
            }
        } catch (e: IllegalArgumentException) {
            Toast.makeText(mainActivity, "Verifique valores de\nconfiguração", Toast.LENGTH_SHORT)
                .show()
        }
        return pb.build()
    }
}