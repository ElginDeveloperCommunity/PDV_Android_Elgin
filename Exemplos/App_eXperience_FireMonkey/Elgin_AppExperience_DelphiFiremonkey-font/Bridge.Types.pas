unit Bridge.Types;

interface

type

  FORMA_OPERACAO = (ADMINISTRACAO,
                    INSTALACAO,
                    CONFIGURACAO,
                    MANUTENCAO,
                    COMUNICACAO,
                    COMPROVANTE);

  CUPOM_TYPE = (NFCE,
                SAT,
                SATCANCEL);

  FORMA_PAGAMENTO_TYPE = (CREDITO,
                          DEBITO);

  PARCELAMENTO_TYPE = (LOJA,
                        ADM,
                        AVISTA);

implementation

end.
