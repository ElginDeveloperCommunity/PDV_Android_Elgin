using System;
using System.Collections.Generic;
using System.Text;

namespace M8XamarinForms
{
    public interface IBalanca
    {
        string ConfigBalanca(Dictionary<String, Object> map);

        string LerPesoBalanca();

        void MostrarRetorno(String retorno);

        string MyFormat(string source, params object[] args);
    }
}
