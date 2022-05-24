using Com.Elgin.E1.Pagamento.Brigde;

namespace M8
{
    class E1BridgeService
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

        //Define uma senha e se esta deve ser enviada para tentar validar qualquer operacao
        public string SetSenha(string senha, bool habilitada)
        {
            return Bridge.SetSenha(senha, habilitada);
        }

        //Consulta Status do Terminal
        public string ConsultarStatus()
        {
            return Bridge.ConsultarStatus();
        }

        //Consulta timeout do Terminal
        public string GetTimeout()
        {
            return Bridge.Timeout;
        }

        //Consulta ultima transacao realizada pelo minipdv com a string de reconhecimento
        public string ConsultarUltimaTransacao(string pvd)
        {
            return Bridge.ConsultarUltimaTransacao(pvd);
        }

        //Configura uma senha para o terminal, ou desabilite a senha do terminal
        public string SetSenhaServer(string senha, bool habilitada)
        {
            return Bridge.SetSenhaServer(senha, habilitada);
        }

        //Configurar Timeout para Transacces
        public string SetTimeout(int timeout)
        {
            return Bridge.SetTimeout(timeout);
        }

        //Funcao reservada para consultar quais os dados atuais de configuracao para a conecao com o terminal SmartPOS ( ou consultar quais os parametros foram utilizados a ultima vez que Bridge.SetServer foi chamada)
        public string GetServer()
        {
            return Bridge.Server;
        }

        //Funcao utilizada para atualizar o Ip que o Bridge se conectara
        public void SetServer(string ipTerminal, int portaTransacao, int portaStatus)
        {
            Bridge.SetServer(ipTerminal, portaTransacao, portaStatus);
        }
    }
}