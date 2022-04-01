namespace M8XamarinForms
{
    public interface IE1Bridge
    {
        /// <sumary>
        /// <param name="idTransacao"> É um valor que será utilizado para diferenciar uma transação da outra, é ideal que seja um valor diferente a cada nova transação.</param>
        /// <param name="pvd"> É uma String que serve como código identificador do pdv que enviou a operação.</param>
        /// <param name="valorTotal"> É o valor da transação em centavos, para R$ 15.60 deve ser passado a string "1560".</param>
        /// <returns>O retorno de todas as funções é um string no formato JSON com os dados de retorno da operação.</returns>
        /// </sumary>
        string IniciaVendaDebito(int idTransacao, string pvd, string valorTotal);

        string IniciaVendaCredito(int idTransacao, string pvd, string valorTotal, int tipoFinanciamento, int numeroParcelas);

        string IniciaCancelamentoVenda(int idTransacao, string pdv, string valorTotal, string dataHora, string nsu);

        string IniciaOperacaoAdministrativa(int idTransacao, string pvd, int operacao);

        string ImprimirCupomNfce(string xml, int indexcsc, string csc);

        string ImprimirCupomSat(string xml);

        string ImprimirCupomSatCancelamento(string xml, string assQRCode);

        //Define uma senha e se esta deve ser enviada para tentar validar qualquer operacao
        string SetSenha(string senha, bool habilitada);

        //Consulta Status do Terminal
        string ConsultarStatus();

        //Consulta timeout do Terminal
        string GetTimeout();

        //Consulta ultima transacao realizada pelo minipdv com a string de reconhecimento
        string ConsultarUltimaTransacao(string pvd);

        //Configura uma senha para o terminal, ou desabilite a senha do terminal
        string SetSenhaServer(string senha, bool habilitada);

        //Configurar Timeout para Transacces
        string SetTimeout(int timeout);

        //Funcao reservada para consultar quais os dados atuais de configuracao para a conecao com o terminal SmartPOS ( ou consultar quais os parametros foram utilizados a ultima vez que Bridge.SetServer foi chamada)
        string GetServer();

        // Funcao utilizada para atualizar o Ip que o Bridge se conectara
        void SetServer(string ipTerminal, int portaTransacao, int portaStatus);
    }
}
