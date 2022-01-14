using Android.Content;
using System;
using System.Collections.Generic;
using System.Text;

namespace M8XamarinForms
{
    public interface ISat
    {
        string AtivarSAT(Dictionary<string, object> map);

        string AssociarAssinatura(Dictionary<string, object> map);

        string ConsultarSAT(Dictionary<string, object> map);

        string StatusOperacional(Dictionary<string, object> map);

        string EnviarVenda(Dictionary<string, object> map);

        string CancelarVenda(Dictionary<string, object> map);

        void MostrarRetorno(string retorno);
    }
}
