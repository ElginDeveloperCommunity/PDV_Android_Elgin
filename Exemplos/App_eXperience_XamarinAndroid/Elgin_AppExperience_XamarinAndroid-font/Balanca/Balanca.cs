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


using Com.Elgin.E1.Balanca;
using System.Text.RegularExpressions;

namespace M8
{
    public class Balanca
    {
        private Context mContext;

        public Balanca(Activity activity)
        {
            this.mContext = activity;
        }

        public string ConfigBalanca(Dictionary<String, Object> map)
        {
            string modelBalanca = (String) map["model"];
            string protocol = (String)map["protocol"];

            int MODEL = 0;
            int PROTOCOL = 0;

            switch (modelBalanca)
            {
                case "DP30CK":
                    MODEL = 0;
                    break;
                case "SA110":
                    MODEL = 1;
                    break;
                case "DPSC":
                    MODEL = 2;
                    break;
                default:
                    MODEL = 0;
                    break;
            }

            switch (protocol)
            {
                case "PROTOCOLO 0":
                    PROTOCOL = 0;
                    break;
                case "PROTOCOLO 1":
                    PROTOCOL = 1;
                    break;
                case "PROTOCOLO 2":
                    PROTOCOL = 2;
                    break;
                case "PROTOCOLO 3":
                    PROTOCOL = 3;
                    break;
                case "PROTOCOLO 4":
                    PROTOCOL = 4;
                    break;
                case "PROTOCOLO 5":
                    PROTOCOL = 5;
                    break;
                case "PROTOCOLO 6":
                    PROTOCOL = 6;
                    break;
                case "PROTOCOLO 7":
                    PROTOCOL = 7;
                    break;
                default:
                    PROTOCOL = 0;
                    break;
            }

            int retorno1 = BalancaE1.ConfigurarModeloBalanca(MODEL);
            int retorno2 = BalancaE1.ConfigurarProtocoloComunicacao(PROTOCOL);

            string returnToToaster = String.Format(MyFormat("\nConfigurarModeloBalanca: %d", retorno1) + MyFormat("\nConfigurarProtocoloComunicacao: %d", retorno2));

            MostrarRetorno(returnToToaster);


            return retorno1.ToString();
        }

        public string LerPesoBalanca()
        {
            int retorno1 = BalancaE1.AbrirSerial(2400, 8, 'n', 1);
            string retorno2 = BalancaE1.LerPeso(1);
            int retorno3 = BalancaE1.Fechar();

            string returnToToaster = String.Format( MyFormat("\nAbrirSerial: %d", retorno1) + MyFormat("\nLerPeso: %s", retorno2) + MyFormat("\nFechar: %d", retorno3) );
       
            MostrarRetorno(returnToToaster);
            
            return retorno2.ToString();
        }
       
        private void MostrarRetorno(String retorno)
        {
            Toast.MakeText(mContext, MyFormat("Retorno: %s", retorno) , ToastLength.Short).Show();
        }

        private static string MyFormat(string source, params object[] args)
        {
            int index = 0;

            return Regex.Replace(source, "%[isdf]", match => args[index++]?.ToString());
        }
    }
}