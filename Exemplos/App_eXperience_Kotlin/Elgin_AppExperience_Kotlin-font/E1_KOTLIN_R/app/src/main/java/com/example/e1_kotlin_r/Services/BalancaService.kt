package com.example.e1_kotlin_r.Services
import android.app.Activity
import android.content.Context
import android.widget.Toast
import com.elgin.e1.Balanca.BalancaE1

class Balanca(activity: Activity) {
    private val mContext: Context
    fun configBalanca(map: Map<*, *>): String {
        val modelBalanca = map["model"] as String?
        val protocol = map["protocol"] as String?
        var MODEL = 0
        var PROTOCOL = 0
        MODEL = when (modelBalanca) {
            "DP30CK" -> 0
            "SA110" -> 1
            "DPSC" -> 2
            else -> 0
        }
        PROTOCOL = when (protocol) {
            "PROTOCOLO 0" -> 0
            "PROTOCOLO 1" -> 1
            "PROTOCOLO 2" -> 2
            "PROTOCOLO 3" -> 3
            "PROTOCOLO 4" -> 4
            "PROTOCOLO 5" -> 5
            "PROTOCOLO 6" -> 6
            "PROTOCOLO 7" -> 7
            else -> 0
        }
        val retorno1 = BalancaE1.ConfigurarModeloBalanca(MODEL)
        val retorno2 = BalancaE1.ConfigurarProtocoloComunicacao(PROTOCOL)
        mostrarRetorno(
            String.format(
                "\nConfigurarModeloBalanca: %d\nConfigurarProtocoloComunicacao: %d",
                retorno1,
                retorno2
            )
        )
        return retorno1.toString()
    }

    fun lerPesoBalanca(): String {
        val retorno1 = BalancaE1.AbrirSerial(2400, 8, 'n', 1) // Configuracao serial da balanca...
        val retorno2 = BalancaE1.LerPeso(1)
        val retorno3 = BalancaE1.Fechar()
        mostrarRetorno(
            String.format(
                "\nAbrirSerial: %d\nLerPeso: %s\nFechar: %d",
                retorno1,
                retorno2,
                retorno3
            )
        )
        return retorno2.toString()
    }

    private fun mostrarRetorno(retorno: String) {
        Toast.makeText(mContext, String.format("Retorno: %s", retorno), Toast.LENGTH_SHORT).show()
    }

    init {
        mContext = activity
    }
}