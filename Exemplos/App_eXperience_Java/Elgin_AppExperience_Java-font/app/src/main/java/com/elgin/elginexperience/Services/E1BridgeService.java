package com.elgin.elginexperience.Services;

import android.util.Log;

import com.elgin.e1.Pagamento.Brigde.Bridge;


public class E1BridgeService {

    public E1BridgeService() {}

    /**
     *
     * @param idTransacao é um valor que será utilizado para diferenciar uma transação da outra, é ideal que seja um valor diferente a cada nova transação.
     * @param pvd é uma String que serve como código identificador do pdv que enviou a operação.
     * @param valorTotal é o valor da transação em centavos, para R$ 15.60 deve ser passado a string "1560".
     * @return String o retorno de todas as funções é um string no formato JSON com os dados de retorno da operação.
     */
    public String IniciaVendaDebito(int idTransacao, String pvd, String valorTotal){
        return Bridge.IniciaVendaDebito(idTransacao, pvd, valorTotal);
    }

    public String IniciaVendaCredito(int idTransacao, String pvd, String valorTotal,int tipoFinanciamento, int numeroParcelas){
        String retornoOperacao =  Bridge.IniciaVendaCredito(idTransacao, pvd, valorTotal, tipoFinanciamento, numeroParcelas);
        return retornoOperacao;
    }

    public String IniciaCancelamentoVenda(int idTransacao, String pdv, String valorTotal, String dataHora, String nsu){
        return Bridge.IniciaCancelamentoVenda(idTransacao, pdv, valorTotal, dataHora, nsu);
    }

    public String IniciaOperacaoAdministrativa(int idTransacao, String pvd, int operacao){
        return Bridge.IniciaOperacaoAdministrativa(idTransacao, pvd, operacao);
    }

    public String ImprimirCupomNfce(String xml, int indexcsc, String csc){
        return Bridge.ImprimirCupomNfce(xml, indexcsc, csc);
    }

    public String ImprimirCupomSat(String xml){
        return Bridge.ImprimirCupomSat(xml);
    }

    public String ImprimirCupomSatCancelamento(String xml, String assQRCode){
        return Bridge.ImprimirCupomSatCancelamento(xml, assQRCode);
    }

    //Define uma senha e se esta deve ser enviada para tentar validar qualquer operacao
    public String SetSenha(String senha, boolean habilitada){
        return Bridge.SetSenha(senha, habilitada);
    }

    //Consulta Status do Terminal
    public String ConsultarStatus(){
        return Bridge.ConsultarStatus();
    }

    //Consulta timeout do Terminal
    public String GetTimeout(){
        return Bridge.GetTimeout();
    }

    //Consulta ultima transacao realizada pelo minipdv com a string de reconhecimento
    public String ConsultarUltimaTransacao(String pvd){
        return Bridge.ConsultarUltimaTransacao(pvd);
    }

    //Configura uma senha para o terminal, ou desabilite a senha do terminal
    public String SetSenhaServer(String senha, boolean habilitada){
        return Bridge.SetSenhaServer(senha, habilitada);
    }

    //Configurar Timeout para Transacces
    public String SetTimeout(int timeout){
        return Bridge.SetTimeout(timeout);
    }

    //Funcao reservada para consultar quais os dados atuais de configuracao para a conecao com o terminal SmartPOS ( ou consultar quais os parametros foram utilizados a ultima vez que Bridge.SetServer foi chamada)
    public String GetServer(){
        return Bridge.GetServer();
    }

    //Funcao utilizada para atualizar o Ip que o Bridge se conectara
    public void SetServer(String ipTerminal, int portaTransacao, int portaStatus){
        Bridge.SetServer(ipTerminal, portaTransacao, portaStatus);
    }
}
