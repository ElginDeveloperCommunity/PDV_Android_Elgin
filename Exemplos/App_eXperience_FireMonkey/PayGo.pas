unit PayGo;

interface
  uses
    Elgin.JNI.InterfaceAutomacao,
    Androidapi.JNI.GraphicsContentViewText,
    Androidapi.JNI.JavaTypes,
    Androidapi.Helpers,
    Androidapi.JNIBridge,
    Androidapi.JNI.App,
    Androidapi.JNI.Os,
    System.Threading,
    System.Classes,
    FMX.Dialogs,
    FMX.Types,
    FMX.Platform,
    System.SysUtils,
    Tef.Types;

type

  TPayGo = class

    RetornoCallBack : TCallBack;

    mDadosAutomacao : JDadosAutomacao;
    mEntradaTransacao : JEntradaTransacao;
    mConfirmacao : JConfirmacoes;
    mSaidaTransacao : JSaidaTransacao;
    mTransacoes : JTransacoes;
    versoes : JVersoes;
    mPersonalizacao : JPersonalizacao;

    mConfManual : boolean;
    suportaViaDifer : boolean;
    suportaViaReduz : boolean;
    interfaceInvertida : boolean;
    valorDevido : boolean;
    troco : boolean;
    desconto : boolean;
    suportaViasDiferenciadas: boolean;
    suportaViasReduzidas : boolean;

    constructor Create;
    procedure EfetuaTransacao(operacao: JOperacoes; valor : string; numeroParcelas : integer; tipo_cartao : JCartoes; financiamento : JFinanciamentos);
    procedure Retorno;
    procedure Venda(valor: string; parcelas : integer; formaPagamento : FORMA_PAGAMENTO_TYPE ; tipoParcelamento : PARCELAMENTO_TYPE; Retorno : TCallBack );
    procedure Cancelamento(valor : string; formaPagamento : FORMA_PAGAMENTO_TYPE; Retorno : TCallBack );
    procedure Configurar(Retorno : TCallBack );
    function SetPersonalizacao(isInverse : boolean): JPersonalizacao;
    function AppEvent(AAppEvent: TApplicationEvent; AContext: TObject): Boolean;
  end;

var
 retorno_pendente : boolean;
 PayGo_instancia : TPayGo;

implementation

{ TPayGo }

procedure TPayGo.Venda(valor: string; parcelas : integer; formaPagamento : FORMA_PAGAMENTO_TYPE ; tipoParcelamento : PARCELAMENTO_TYPE; Retorno : TCallBack );
var
 tipo_cartao : JCartoes;
 financiamento : JFinanciamentos;
begin

  RetornoCallBack := Retorno;

  case formaPagamento of
    CREDITO : tipo_cartao := TJCartoes.JavaClass.CARTAO_CREDITO;
    DEBITO : tipo_cartao := TJCartoes.JavaClass.CARTAO_DEBITO;
    TODOS :  tipo_cartao := TJCartoes.JavaClass.CARTAO_DESCONHECIDO;
  end;

  case tipoParcelamento of
    LOJA: financiamento := TJFinanciamentos.JavaClass.PARCELADO_ESTABELECIMENTO;
    ADM: financiamento := TJFinanciamentos.JavaClass.PARCELADO_EMISSOR;
    NENHUM: financiamento := TJFinanciamentos.JavaClass.A_VISTA;
  end;

  EfetuaTransacao(TJOperacoes.JavaClass.VENDA,valor,parcelas,tipo_cartao,financiamento);

end;

procedure TPayGo.Cancelamento(valor : string; formaPagamento : FORMA_PAGAMENTO_TYPE; Retorno : TCallBack );
var
 tipo_cartao : JCartoes;
begin

  RetornoCallBack := Retorno;

  case formaPagamento of
    CREDITO : tipo_cartao := TJCartoes.JavaClass.CARTAO_CREDITO;
    DEBITO : tipo_cartao := TJCartoes.JavaClass.CARTAO_DEBITO;
    TODOS :  tipo_cartao := TJCartoes.JavaClass.CARTAO_DESCONHECIDO;
  end;
    EfetuaTransacao(TJOperacoes.JavaClass.CANCELAMENTO,valor,0,tipo_cartao,TJFinanciamentos.JavaClass.FINANCIAMENTO_NAO_DEFINIDO);
end;

procedure TPayGo.Configurar(Retorno : TCallBack );
begin

   RetornoCallBack := Retorno;

   EfetuaTransacao(TJOperacoes.JavaClass.ADMINISTRATIVA,'',0,TJCartoes.JavaClass.CARTAO_DESCONHECIDO,TJFinanciamentos.JavaClass.FINANCIAMENTO_NAO_DEFINIDO);
end;

constructor TPayGo.Create;
var
AppEventSvc: IFMXApplicationEventService;
begin

    retorno_pendente := False;

    if TPlatformServices.Current.SupportsPlatformService
    (IFMXApplicationEventService, IInterface(AppEventSvc)) then
    begin
       AppEventSvc.SetApplicationEventHandler(AppEvent);
    end;

    mPersonalizacao := SetPersonalizacao(false);
    mDadosAutomacao := TJDadosAutomacao.JavaClass.init(StringToJString('Automacao Demo'), StringToJString('Indisponivel'),StringToJString('SETIS'),
                troco, desconto, suportaViasDiferenciadas, suportaViasReduzidas, false, mPersonalizacao);

    mTransacoes := TJTransacoes.JavaClass.obtemInstancia(mDadosAutomacao, TAndroidHelper.Context);
    //versoes := mTransacoes.obtemVersoes();
end;

procedure TPayGo.EfetuaTransacao(operacao: JOperacoes; valor : string; numeroParcelas : integer; tipo_cartao : JCartoes; financiamento : JFinanciamentos);
begin

  mEntradaTransacao :=  TJEntradaTransacao.JavaClass.init(operacao, StringToJString('1'));

  if not (operacao = TJOperacoes.JavaClass.ADMINISTRATIVA) then
  begin

    mEntradaTransacao.informaValorTotal(StringToJString(valor));

    if operacao.equals(TJOperacoes.JavaClass.VENDA) then
    begin
      mEntradaTransacao.informaDocumentoFiscal(StringToJString('1000'));
    end;

    mEntradaTransacao.informaModalidadePagamento(TJModalidadesPagamento.JavaClass.PAGAMENTO_CARTAO);

    if not tipo_cartao.equals(TJCartoes.JavaClass.CARTAO_DESCONHECIDO) then
       mEntradaTransacao.informaTipoCartao(tipo_cartao);

    mEntradaTransacao.informaTipoFinanciamento(financiamento);

   if not financiamento.equals(TJFinanciamentos.JavaClass.A_VISTA) then
    begin
          mEntradaTransacao.informaNumeroParcelas(numeroParcelas);
    end;

    mEntradaTransacao.informaNomeProvedor(StringToJString('DEMO'));

    mEntradaTransacao.informaCodigoMoeda(StringToJString('986'));

  end;

  mConfirmacao := TJConfirmacoes.JavaClass.init;

  // Thread criada pois o método realizaTransacao é blocante e só retorna
  // ao fim da operação. Se este método for chamado fora da thread, a
  // aplicação pode ser finalizada pelo sistema operacional, por estar sem
  // responder.
  TThread.CreateAnonymousThread(procedure ()
  begin
      try


        try

         mDadosAutomacao.obtemPersonalizacaoCliente();
         mSaidaTransacao := mTransacoes.realizaTransacao(mEntradaTransacao);

          if not Assigned(mSaidaTransacao) then
          begin
           exit;
          end;

          mConfirmacao.informaIdentificadorConfirmacaoTransacao(mSaidaTransacao.obtemIdentificadorConfirmacaoTransacao());

          mEntradaTransacao := nil;

         except
          on e: Exception  do
           Log.d('erro: ' + e.Message);
        end;

      finally
        retorno_pendente := True;
      end;

   end).Start;



end;

function TPayGo.SetPersonalizacao(isInverse : boolean): JPersonalizacao;
var
pb : JPersonalizacao_Builder;
begin
        pb := TJPersonalizacao_Builder.JavaClass.init;
        try
            if isInverse then
            begin
                pb.informaCorFonte( StringToJString('#000000'));
                pb.informaCorFonteTeclado(StringToJString('#000000'));
                pb.informaCorFundoCaixaEdicao(StringToJString('#FFFFFF'));
                pb.informaCorFundoTela(StringToJString('#F4F4F4'));
                pb.informaCorFundoTeclado(StringToJString('#F4F4F4'));
                pb.informaCorFundoToolbar(StringToJString('#2F67F4'));
                pb.informaCorTextoCaixaEdicao(StringToJString('#000000'));
                pb.informaCorTeclaPressionadaTeclado(StringToJString('#e1e1e1'));
                pb.informaCorTeclaLiberadaTeclado(StringToJString('#dedede'));
                pb.informaCorSeparadorMenu(StringToJString('#2F67F4'));
            end;

        except
            ShowMessage
            ('Verifique valores de configuração');
        end;
        Result := pb.build();

end;


procedure TPayGo.Retorno;
var
 via_cliente, retorno : string;
 vias : JViasImpressao;
begin

   try

     retorno := JStringToString(mSaidaTransacao.obtemMensagemResultado());

     if mSaidaTransacao.obtemInformacaoConfirmacao() then
     begin
          mConfirmacao.informaStatusTransacao(TJStatusTransacao.JavaClass.CONFIRMADO_AUTOMATICO);
          mTransacoes.confirmaTransacao(mConfirmacao);

          vias := mSaidaTransacao.obtemViasImprimir();
            //Imprime a via do cliente
            if vias.equals(TJViasImpressao.JavaClass.VIA_CLIENTE) or vias.equals(TJViasImpressao.JavaClass.VIA_CLIENTE_E_ESTABELECIMENTO) then
                via_cliente := JStringToString(mSaidaTransacao.obtemComprovanteGraficoPortador);

          RetornoCallBack(Tef.Types.PAYGO,retorno,via_cliente);

     end;

   finally
     retorno_pendente := False;
   end;




end;

function TPayGo.AppEvent(AAppEvent: TApplicationEvent;
AContext: TObject): Boolean;
begin
  case AAppEvent of
    TApplicationEvent.BecameActive : begin
      Log.d('event: BecameActive');
      if Assigned(mSaidaTransacao) and (retorno_pendente = True) then
      begin
        Retorno();
      end;

    end;
  end;
end;

initialization

PayGo_instancia := TPayGo.Create;

end.
