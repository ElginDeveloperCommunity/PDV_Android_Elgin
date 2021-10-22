package com.example.e1_elgin_kotlin

class SitefReturn {
    private val cODAUTORIZACAO: String? = null
    private val vIAESTABELECIMENTO: String? = null
    private val cOMPDADOSCONF: String? = null
    private val bANDEIRA: String? = null
    private val nUMPARC: String? = null
    private var cODTRANS: String? = null
    private val rEDEAUT: String? = null
    private val nSUSITEF: String? = null
    private val vIACLIENTE: String? = null
    private val vLTROCO: String? = null
    private val tIPOPARC: String? = null
    private val cODRESP: String? = null
    private val nSUHOST: String? = null

    fun vIAESTABELECIMENTO(): String? {
        return vIAESTABELECIMENTO
    }

    fun setCODTRANS(CODTRANS: String?) {
        cODTRANS = CODTRANS
    }

    fun cODAUTORIZACAO(): String? {
        return cODAUTORIZACAO
    }

    fun cOMPDADOSCONF(): String? {
        return cOMPDADOSCONF
    }

    fun vIACLIENTE(): String? {
        return vIACLIENTE
    }

    fun bANDEIRA(): String? {
        return bANDEIRA
    }

    fun cODTRANS(): String? {
        return cODTRANS
    }

    fun rEDEAUT(): String? {
        return rEDEAUT
    }

    fun nSUSITEF(): String? {
        return nSUSITEF
    }

    fun vLTROCO(): String? {
        return vLTROCO
    }

    fun tIPOPARC(): String? {
        return tIPOPARC
    }

    fun cODRESP(): String? {
        return cODRESP
    }

    fun nSUHOST(): String? {
        return nSUHOST
    }

    fun nUMPARC(): String? {
        return nUMPARC ?: ""
    }

    fun NAMETRANSCODE(): String? {
        var retorno = "Valor invalido"
        when (tIPOPARC) {
            "00" -> retorno = "A vista"
            "01" -> retorno = "Pré-Datado"
            "02" -> retorno = "Parcelado Loja"
            "03" -> retorno = "Parcelado Adm"
        }
        return retorno
    }
}