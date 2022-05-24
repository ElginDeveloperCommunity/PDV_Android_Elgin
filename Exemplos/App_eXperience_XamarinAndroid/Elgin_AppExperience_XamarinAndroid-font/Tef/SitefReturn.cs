using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace M8
{

    class SitefReturn
    {
        public String CODAUTORIZACAO;
        public String VIAESTABELECIMENTO;
        public String COMPDADOSCONF;
        public String BANDEIRA;
        public String NUMPARC;
        public String CODTRANS;
        public String REDEAUT;
        public String NSUSITEF;
        public String VIACLIENTE;
        public String VLTROCO;
        public String TIPOPARC;
        public String CODRESP;
        public String NSUHOST;
       
       
        public String nUMPARC()
        {
            if (this.NUMPARC != null) return this.NUMPARC;
            return "";
        }

        public String NAMETRANSCODE()
        {
            String retorno = "Valor invalido";
            switch (this.TIPOPARC)
            {
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
}