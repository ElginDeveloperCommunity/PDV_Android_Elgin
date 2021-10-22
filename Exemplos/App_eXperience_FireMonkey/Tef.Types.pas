unit Tef.Types;

interface

type

  FORMA_PAGAMENTO_TYPE = (CREDITO,DEBITO,TODOS);
  PARCELAMENTO_TYPE = (LOJA,ADM,NENHUM);
  TRANSACAO_TYPE =(VENDA,CANCELAMENTO,CONFIGURACAO,NONE);
  SOLUCAO_PAGAMENTO_TYPE = (MSITEF,PAYGO);

  TCallBack = reference to procedure(Pagadora : SOLUCAO_PAGAMENTO_TYPE;Retorno: string; ViaCliente: string = '');

implementation

end.
