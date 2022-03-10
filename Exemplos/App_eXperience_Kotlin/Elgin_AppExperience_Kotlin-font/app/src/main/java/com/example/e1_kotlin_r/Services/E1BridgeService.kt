package com.example.e1_kotlin_r.Services

import com.elgin.e1.Pagamento.Brigde.Bridge


class E1BridgeService {
    /**
     *
     * @param idTransacao é um valor que será utilizado para diferenciar uma transação da outra, é ideal que seja um valor diferente a cada nova transação.
     * @param pvd é uma String que serve como código identificador do pdv que enviou a operação.
     * @param valorTotal é o valor da transação em centavos, para R$ 15.60 deve ser passado a string "1560".
     * @return String o retorno de todas as funções é um string no formato JSON com os dados de retorno da operação.
     */
    fun IniciaVendaDebito(idTransacao: Int, pvd: String?, valorTotal: String?): String {
        return Bridge.IniciaVendaDebito(idTransacao, pvd, valorTotal)
    }

    fun IniciaVendaCredito(
        idTransacao: Int,
        pvd: String?,
        valorTotal: String?,
        tipoFinanciamento: Int,
        numeroParcelas: Int
    ): String {
        return Bridge.IniciaVendaCredito(
            idTransacao,
            pvd,
            valorTotal,
            tipoFinanciamento,
            numeroParcelas
        )
    }

    fun IniciaCancelamentoVenda(
        idTransacao: Int,
        pdv: String?,
        valorTotal: String?,
        dataHora: String?,
        nsu: String?
    ): String {
        return Bridge.IniciaCancelamentoVenda(idTransacao, pdv, valorTotal, dataHora, nsu)
    }

    fun IniciaOperacaoAdministrativa(idTransacao: Int, pvd: String?, operacao: Int): String {
        return Bridge.IniciaOperacaoAdministrativa(idTransacao, pvd, operacao)
    }

    fun ImprimirCupomNfce(xml: String?, indexcsc: Int, csc: String?): String {
        return Bridge.ImprimirCupomNfce(xml, indexcsc, csc)
    }

    fun ImprimirCupomSat(xml: String?): String {
        return Bridge.ImprimirCupomSat(xml)
    }

    fun ImprimirCupomSatCancelamento(xml: String?, assQRCode: String?): String {
        return Bridge.ImprimirCupomSatCancelamento(xml, assQRCode)
    }

    //Define uma senha e se esta deve ser enviada para tentar validar qualquer operacao
    fun SetSenha(senha: String?, habilitada: Boolean): String {
        return Bridge.SetSenha(senha, habilitada)
    }

    //Consulta Status do Terminal
    fun ConsultarStatus(): String {
        return Bridge.ConsultarStatus()
    }

    //Consulta timeout do Terminal
    fun GetTimeout(): String {
        return Bridge.GetTimeout()
    }

    //Consulta ultima transacao realizada pelo minipdv com a string de reconhecimento
    fun ConsultarUltimaTransacao(pvd: String?): String {
        return Bridge.ConsultarUltimaTransacao(pvd)
    }

    //Configura uma senha para o terminal, ou desabilite a senha do terminal
    fun SetSenhaServer(senha: String?, habilitada: Boolean): String {
        return Bridge.SetSenhaServer(senha, habilitada)
    }

    //Configurar Timeout para Transacces
    fun SetTimeout(timeout: Int): String {
        return Bridge.SetTimeout(timeout)
    }

    //Funcao reservada para consultar quais os dados atuais de configuracao para a conecao com o terminal SmartPOS ( ou consultar quais os parametros foram utilizados a ultima vez que Bridge.SetServer foi chamada)
    fun GetServer(): String {
        return Bridge.GetServer()
    }

    //Funcao utilizada para atualizar o Ip que o Bridge se conectara
    fun SetServer(ipTerminal: String?, portaTransacao: Int, portaStatus: Int) {
        Bridge.SetServer(ipTerminal, portaTransacao, portaStatus)
    }
}
