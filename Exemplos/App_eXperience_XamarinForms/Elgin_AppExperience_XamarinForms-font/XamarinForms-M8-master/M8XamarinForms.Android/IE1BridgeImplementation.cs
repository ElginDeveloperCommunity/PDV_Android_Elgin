using Xamarin.Forms;
using Com.Elgin.E1.Pagamento.Brigde;

[assembly: Dependency(typeof(M8XamarinForms.Droid.IE1BridgeImplementation))]
namespace M8XamarinForms.Droid
{
    class IE1BridgeImplementation : IE1Bridge
    {

        public string IniciaVendaDebito(int idTransacao, string pvd, string valorTotal)
        {
            return Bridge.IniciaVendaDebito(idTransacao, pvd, valorTotal);
        }

        public string IniciaVendaCredito(int idTransacao, string pvd, string valorTotal, int tipoFinanciamento, int numeroParcelas)
        {
            string retornoOperacao = Bridge.IniciaVendaCredito(idTransacao, pvd, valorTotal, tipoFinanciamento, numeroParcelas);
            return retornoOperacao;
        }

        public string IniciaCancelamentoVenda(int idTransacao, string pdv, string valorTotal, string dataHora, string nsu)
        {
            return Bridge.IniciaCancelamentoVenda(idTransacao, pdv, valorTotal, dataHora, nsu);
        }

        public string IniciaOperacaoAdministrativa(int idTransacao, string pvd, int operacao)
        {
            return Bridge.IniciaOperacaoAdministrativa(idTransacao, pvd, operacao);
        }

        public string ImprimirCupomNfce(string xml, int indexcsc, string csc)
        {
            return Bridge.ImprimirCupomNfce(xml, indexcsc, csc);
        }

        public string ImprimirCupomSat(string xml)
        {
            return Bridge.ImprimirCupomSat(xml);
        }

        public string ImprimirCupomSatCancelamento(string xml, string assQRCode)
        {
            return Bridge.ImprimirCupomSatCancelamento(xml, assQRCode);
        }

        public string SetSenha(string senha, bool habilitada)
        {
            return Bridge.SetSenha(senha, habilitada);
        }

        public string ConsultarStatus()
        {
            return Bridge.ConsultarStatus();
        }

        public string GetTimeout()
        {
            return Bridge.Timeout;
        }

        public string ConsultarUltimaTransacao(string pvd)
        {
            return Bridge.ConsultarUltimaTransacao(pvd);
        }

        public string SetSenhaServer(string senha, bool habilitada)
        {
            return Bridge.SetSenhaServer(senha, habilitada);
        }

        public string SetTimeout(int timeout)
        {
            return Bridge.SetTimeout(timeout);
        }

        public string GetServer()
        {
            return Bridge.Server;
        }

        public void SetServer(string ipTerminal, int portaTransacao, int portaStatus)
        {
            Bridge.SetServer(ipTerminal, portaTransacao, portaStatus);
        }
    }
}