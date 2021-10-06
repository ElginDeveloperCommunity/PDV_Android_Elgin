package com.example.e1_elgin_kotlin


import android.content.Context
import android.widget.Toast
import br.com.elgin.Sat
import br.com.elgin.SatInitializer

class ServiceSat(context: Context) {
    private val contextSat: Context
    fun ativarSAT(map: Map<*, *>): String {
        var retorno = "..."
        val numSessao = map["numSessao"] as Int
        val subComando = map["subComando"] as Int
        val codeAtivacao = map["codeAtivacao"] as String?
        val cnpj = map["cnpj"] as String?
        val cUF = map["cUF"] as Int
        retorno = Sat.ativarSat(numSessao, subComando, codeAtivacao, cnpj, cUF)
        mostrarRetorno(retorno)
        return retorno
    }

    fun associarAssinatura(map: Map<*, *>): String {
        var retorno = "..."
        val numSessao = map["numSessao"] as Int
        val codeAtivacao = map["codeAtivacao"] as String?
        val cnpjSh = map["cnpjSh"] as String?
        val assinaturaAC = map["assinaturaAC"] as String?
        retorno = Sat.associarAssinatura(numSessao, codeAtivacao, cnpjSh, assinaturaAC)
        mostrarRetorno(retorno)
        return retorno
    }

    fun consultarSAT(map: Map<*, *>): String {
        var result = "..."
        val numSessao = map["numSessao"] as Int
        result = Sat.consultarSat(numSessao)
        mostrarRetorno(result)
        return result
    }

    fun statusOperacional(map: Map<*, *>): String {
        var retorno = "..."
        val numSessao = map["numSessao"] as Int
        val codeAtivacao = map["codeAtivacao"] as String?
        retorno = Sat.consultarStatusOperacional(numSessao, codeAtivacao)
        mostrarRetorno(retorno)
        return retorno
    }

    fun enviarVenda(map: Map<*, *>): String {
        var retorno = "..."
        val numSessao = map["numSessao"] as Int
        val codeAtivacao = map["codeAtivacao"] as String?
        val xmlSale = map["xmlSale"] as String?
        retorno = Sat.enviarDadosVenda(numSessao, codeAtivacao, xmlSale)
        mostrarRetorno(retorno)
        return retorno
    }

    fun cancelarVenda(map: Map<*, *>): String {
        var retorno = "..."
        val numSessao = map["numSessao"] as Int
        val codeAtivacao = map["codeAtivacao"] as String?
        val cFeNumber = map["cFeNumber"] as String?
        val xmlCancelamento = map["xmlCancelamento"] as String?
        retorno = Sat.cancelarUltimaVenda(numSessao, codeAtivacao, cFeNumber, xmlCancelamento)
        mostrarRetorno(retorno)
        return retorno
    }

    fun deviceInfo(): String {
        val retorno = "..."
        val deviceInfo = Sat.getDeviceInfo()
        return "aaa"
    }

    private fun mostrarRetorno(retorno: String) {
        Toast.makeText(contextSat, String.format("Retorno: %s", retorno), Toast.LENGTH_LONG).show()
    }

    companion object {
        lateinit var satInitializer: SatInitializer
    }

    init {
        satInitializer = SatInitializer()
        contextSat = context
    }
}
