using Android.Content;
using Android.Widget;
using System.Collections.Generic;
using BR.Com.Elgin;

namespace M8
{
    class ServiceSat
    {
        private readonly Context contextSat;

        public ServiceSat(Context context)
        {
            contextSat = context;
        }

        public string AtivarSAT(Dictionary<string, object> map)
        {
            int numSessao = (int)map["numSessao"];
            int subComando = (int)map["subComando"];
            string codeAtivacao = (string)map["codeAtivacao"];
            string cnpj = (string)map["cnpj"];
            int cUF = (int) map["cUF"];
            string retorno = Sat.AtivarSat(numSessao, subComando, codeAtivacao, cnpj, cUF);
            MostrarRetorno(retorno);
            return retorno;
        }

        public string AssociarAssinatura(Dictionary<string, object> map)
        {
            int numSessao = (int)map["numSessao"];
            string codeAtivacao = (string)map["codeAtivacao"];
            string cnpjSh = (string) map["cnpjSh"];
            string assinaturaAC = (string)map["assinaturaAC"];

            string retorno = Sat.AssociarAssinatura(numSessao, codeAtivacao, cnpjSh, assinaturaAC);
            MostrarRetorno(retorno);
            return retorno;
        }

        public string ConsultarSAT(Dictionary<string, object> map)
        {
            int numSessao = (int) map["numSessao"];

            string result = Sat.ConsultarSat(numSessao);
            MostrarRetorno(result);
            return result;
        }

        public string StatusOperacional(Dictionary<string, object> map)
        {
            int numSessao = (int)map["numSessao"];
            string codeAtivacao = (string)map["codeAtivacao"];

            string retorno = Sat.ConsultarStatusOperacional(numSessao, codeAtivacao);
            MostrarRetorno(retorno);
            return retorno;
        }

        public string EnviarVenda(Dictionary<string, object> map)
        {
            int numSessao = (int) map["numSessao"];
            string codeAtivacao = (string) map["codeAtivacao"];
            string xmlSale = (string) map["xmlSale"];

            string retorno = Sat.EnviarDadosVenda(numSessao, codeAtivacao, xmlSale);
            MostrarRetorno(retorno);
            return retorno;
        }

        public string CancelarVenda(Dictionary<string, object> map)
        {
            int numSessao = (int) map["numSessao"];
            string codeAtivacao = (string)map["codeAtivacao"];
            string cFeNumber = (string)map["cFeNumber"];
            string xmlCancelamento = (string) map["xmlCancelamento"];

            string retorno = Sat.CancelarUltimaVenda(numSessao, codeAtivacao, cFeNumber, xmlCancelamento);
            MostrarRetorno(retorno);
            return retorno;
        }

        private void MostrarRetorno(string retorno)
        {
            Toast.MakeText(contextSat, string.Format("Retorno: {0}", retorno), ToastLength.Long).Show();
        }
    }
}