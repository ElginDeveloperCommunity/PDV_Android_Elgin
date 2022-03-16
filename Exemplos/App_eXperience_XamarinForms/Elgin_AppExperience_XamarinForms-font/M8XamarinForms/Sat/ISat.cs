using System.Collections.Generic;

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

        string CarregarArquivo(string nomeArquivo);
        void MostrarRetorno(string retorno);
    }
}
