using System;
using System.Collections.Generic;
using System.Text;

namespace M8XamarinForms
{
    public interface ITef
    {
        void SendSitefParams(Dictionary<string,string> parametros);

        void SetPrintTrue();

        void SetPrintFalse();

        void SendPaygoParams(Dictionary<string, string> parametros);
    }
}
