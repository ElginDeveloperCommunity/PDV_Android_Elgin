package com.example.e1_kotlin_r


import android.content.Context
import android.graphics.Bitmap
import com.elgin.e1.Impressora.Termica
import java.lang.Exception


class Printer(var mContext: Context) {
    lateinit var mActivity: Context

    fun printerInternalImpStart(): Int {
        printerStop()
        return Termica.AbreConexaoImpressora(6, "M8", "", 0)
    }

    fun printerExternalImpStart(ip: String?, port: Int): Int {
        printerStop()
        return try {
            Termica.AbreConexaoImpressora(3, "I9", ip, port)
        } catch (e: Exception) {
            printerInternalImpStart()
        }
    }

    fun printerStop() {
        Termica.FechaConexaoImpressora()
    }

    fun AvancaLinhas(map: Map<*, *>): Int {
        val lines = map["quant"] as Int
        return Termica.AvancaPapel(lines)
    }

    fun cutPaper(map: Map<*, *>): Int {
        val lines = map["quant"] as Int
        return Termica.Corte(lines)
    }

    fun imprimeTexto(map: Map<*, *>): Int {
        val text = map["text"] as String?
        val align = map["align"] as String?
        val font = map["font"] as String?
        val fontSize = map["fontSize"] as Int

        //System.out.println(text + " " + align + " " + font + " " + String.valueOf(fontSize));
        var result = 0
        var alignValue = 0
        var styleValue = 0

        // ALINHAMENTO VALUE
        alignValue = if (align == "Esquerda") {
            0
        } else if (align == "Centralizado") {
            1
        } else {
            2
        }
        //STILO VALUE
        if (font == "FONT B") {
            styleValue += 1
        }
        if (map["isUnderline"] as Boolean) {
            styleValue += 2
        }
        if (map["isBold"] as Boolean) {
            styleValue += 8
        }
        result = Termica.ImpressaoTexto(text, alignValue, styleValue, fontSize)
        return result
    }

    private fun codeOfBarCode(barCodeName: String?): Int {
        return if (barCodeName == "UPC-A") 0 else if (barCodeName == "UPC-E") 1 else if (barCodeName == "EAN 13" || barCodeName == "JAN 13") 2 else if (barCodeName == "EAN 8" || barCodeName == "JAN 8") 3 else if (barCodeName == "CODE 39") 4 else if (barCodeName == "ITF") 5 else if (barCodeName == "CODE BAR") 6 else if (barCodeName == "CODE 93") 7 else if (barCodeName == "CODE 128") 8 else 0
    }

    fun imprimeBarCode(map: Map<*, *>): Int {
        val barCodeType = codeOfBarCode(map["barCodeType"] as String?)
        val text = map["text"] as String?
        val height = map["height"] as Int
        val width = map["width"] as Int
        val align = map["align"] as String?
        val hri = 4 // NO PRINT
        val result: Int
        val alignValue: Int

        // ALINHAMENTO VALUE
        alignValue = if (align == "Esquerda") {
            0
        } else if (align == "Centralizado") {
            1
        } else {
            2
        }
        Termica.DefinePosicao(alignValue)
        result = Termica.ImpressaoCodigoBarras(barCodeType, text, height, width, hri)
        return result
    }

    fun imprimeQR_CODE(map: Map<*, *>): Int {
        val size = map["qrSize"] as Int
        val text = map["text"] as String?
        val align = map["align"] as String?
        val nivelCorrecao = 2
        val result: Int
        val alignValue: Int

        // ALINHAMENTO VALUE
        alignValue = if (align == "Esquerda") {
            0
        } else if (align == "Centralizado") {
            1
        } else {
            2
        }
        Termica.DefinePosicao(alignValue)
        result = Termica.ImpressaoQRCode(text, size, nivelCorrecao)
        return result
    }

    fun imprimeImagem(bitmap: Bitmap?): Int {
        val result: Int
        result = Termica.ImprimeBitmap(bitmap)
        return result
    }

    fun imprimeXMLNFCe(map: Map<*, *>): Int {
        val xmlNFCe = map["xmlNFCe"] as String?
        println(xmlNFCe)
        val indexcsc = map["indexcsc"] as Int
        val csc = map["csc"] as String?
        val param = map["param"] as Int
        return Termica.ImprimeXMLNFCe(xmlNFCe, indexcsc, csc, param)
    }

    fun imprimeXMLSAT(map: Map<*, *>): Int {
        val xml = map["xmlSAT"] as String?
        val param = map["param"] as Int
        return Termica.ImprimeXMLSAT(xml, param)
    }

    fun imprimeCupomTEF(map: Map<*, *>): Int {
        val base64 = map["base64"] as String?
        return Termica.ImprimeCupomTEF(base64)
    }

    fun statusGaveta(): Int {
        return Termica.StatusImpressora(1)
    }

    fun abrirGaveta(): Int {
        return Termica.AbreGavetaElgin()
    }

    fun statusSensorPapel(): Int {
        return Termica.StatusImpressora(3)
    }

    fun statusSensorPapelSmartPOS(): Int {
        return Termica.StatusImpressora(0)
    }

    init {
        Termica.setContext(mContext)
    }
}
