package com.elgin.elginexperience;

public class SitefReturn {
    private String cODAUTORIZACAO;
    private String vIAESTABELECIMENTO;
    private String cOMPDADOSCONF;
    private String bANDEIRA;
    private String nUMPARC;
    private String cODTRANS;
    private String rEDEAUT;
    private String nSUSITEF;
    private String vIACLIENTE;
    private String vLTROCO;
    private String tIPOPARC;
    private String cODRESP;
    private String nSUHOST;

    public String vIAESTABELECIMENTO () { return this.vIAESTABELECIMENTO; }
    public void setCODTRANS (String CODTRANS){ this.cODTRANS = CODTRANS; }
    public String cODAUTORIZACAO (){ return this.cODAUTORIZACAO; }
    public String cOMPDADOSCONF (){return this.cOMPDADOSCONF; }
    public String vIACLIENTE () { return this.vIACLIENTE;}
    public String bANDEIRA(){ return this.bANDEIRA; }
    public String cODTRANS(){ return this.cODTRANS; }
    public String rEDEAUT (){ return this.rEDEAUT; }
    public String nSUSITEF(){ return this.nSUSITEF; }
    public String vLTROCO (){ return this.vLTROCO; }
    public String tIPOPARC(){ return this.tIPOPARC; }
    public String cODRESP (){ return this.cODRESP; }
    public String nSUHOST (){ return this.nSUHOST; }
    public String nUMPARC (){
        if (this.nUMPARC != null) return this.nUMPARC;
        return "";
    }
    public String NAMETRANSCODE (){
        String retorno = "Valor invalido";
        switch (this.tIPOPARC) {
            case "00":
                retorno = "A vista";
                break;
            case "01":
                retorno = "Pré-Datado";
                break;
            case "02":
                retorno = "Parcelado Loja";
                break;
            case "03":
                retorno = "Parcelado Adm";
                break;
        }
        return retorno;
    }
}
