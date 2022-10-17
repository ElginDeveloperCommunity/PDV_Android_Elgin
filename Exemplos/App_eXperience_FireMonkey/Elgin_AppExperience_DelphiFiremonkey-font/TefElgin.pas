unit TefElgin;

interface
  uses
   Androidapi.Helpers,
   Androidapi.JNI.JavaTypes,
   Androidapi.JNI.GraphicsContentViewText,
   FMX.Graphics,
   FMX.Surfaces,
   FMX.Helpers.Android,
   System.SysUtils,
   FMX.Types,
   System.Messaging,
   Androidapi.Jni.App,
   System.IOUtils,
   System.StrUtils,
   AndroidAPI.JNIBridge,
   Tef.Types,
   FMX.Dialogs;

type

  TTefElgin = class
    RetornoCallBack       : TCallBack;
    FMessageSubscriptionID: integer;
    private
      { private declarations }
      procedure HandleActivityMessage(const Sender: TObject;const msg: TMessage);
      procedure longlong(str: string);
      procedure respostaTefElgin(dados: JIntent; sucesso: boolean);
      function paymentCode(pagamento: FORMA_PAGAMENTO_TYPE): string;
    protected
      { protected declarations }
    public
    { public declarations }
      procedure Action(valor, parcelas, nsu: string;
                        transacao: TRANSACAO_TYPE;
                        pagamento: FORMA_PAGAMENTO_TYPE;
                        parcelamento: PARCELAMENTO_TYPE;
                        Retorno: TCallBack);
  end;

var
  tefelgin_instance: TTefElgin;

implementation

{ TTefElgin }

procedure TTefElgin.HandleActivityMessage(const Sender: TObject;
  const msg: TMessage);
begin

  try
    if msg is TMessageResultNotification then
    begin
      TMessageManager.DefaultManager.Unsubscribe(TMessageResultNotification, FMessageSubscriptionID);
      FMessageSubscriptionID := 0;
      if TMessageResultNotification(msg).RequestCode = 4321 then
      begin
         if TMessageResultNotification(msg).ResultCode = TJActivity.JavaClass.RESULT_OK then
          respostaTefElgin(TMessageResultNotification(msg).Value, True)
         else if TMessageResultNotification(msg).ResultCode =  TJActivity.JavaClass.RESULT_CANCELED then
              respostaTefElgin(TMessageResultNotification(msg).Value, True)
         else
              ShowMessage('Erro resposta TEF Elgin');

      end;
    end;

  except
      on e: exception do
        ShowMessage('Erro resposta Sat: ' + e.Message);
  end;

end;

procedure TTefElgin.longlong(str: string);
begin
  if str.Length > 4000 then
  begin
    log.d(str.Substring(0,4000));
    longlong(str.Substring(4000));
  end
  else
    log.d(str);

end;

function TTefElgin.paymentCode(pagamento: FORMA_PAGAMENTO_TYPE): string;
begin
  case pagamento of
    CREDITO: result:= '3';
    DEBITO: result:= '2';
    TODOS: result:= '0';
  end;
end;

procedure TTefElgin.respostaTefElgin(dados: JIntent; sucesso: boolean);
var
  via_cliente, retono, codresp, nsu : string;
begin
   if sucesso and Assigned(dados) then
   begin
       codresp :=  JStringToString(dados.getStringExtra(StringToJString('CODRESP')));
       if (codresp = '') or (StrToInt(codresp) < 0) then
          retono := 'Alerta! ' + sLineBreak + sLineBreak +  'Ocorreu um erro de transação'

       else
       begin
          via_cliente :=  JStringToString(dados.getStringExtra(StringToJString('VIA_CLIENTE')));
          nsu :=  JStringToString(dados.getStringExtra(StringToJString('NSU_SITEF')));

          // 'retorno' vaireceber NSU caso operação ocorra com sucesso
          retono := nsu;
       end;


   end else
   begin
      retono := 'Alerta! ' + sLineBreak + sLineBreak +  'Ocorreu um erro de transação';
   end;
     RetornoCallBack(Tef.Types.TEFELGIN,retono,via_cliente);

end;

procedure TTefElgin.Action(valor, parcelas, nsu: string;
  transacao: TRANSACAO_TYPE;
  pagamento: FORMA_PAGAMENTO_TYPE;
  parcelamento: PARCELAMENTO_TYPE;
  Retorno: TCallBack);
var
  IntentTefElgin: JIntent;
begin
   RetornoCallBack := Retorno;

   IntentTefElgin := TJIntent.JavaClass.init(StringToJString('com.elgin.e1.digitalhub.TEF'));

   IntentTefElgin.putExtra(StringToJString('valor'), StringToJString(valor));

   case transacao of
      VENDA:
      begin
        IntentTefElgin.putExtra(StringToJString('modalidade'), StringToJString(paymentCode(pagamento)));

        case pagamento of
          CREDITO:
          begin
            IntentTefElgin.putExtra(StringToJString('numParcelas'), StringToJString(parcelas));

            case parcelamento of
              NENHUM: IntentTefElgin.putExtra(StringToJString('transacoesHabilitadas'), StringToJString('26'));
              LOJA: IntentTefElgin.putExtra(StringToJString('transacoesHabilitadas'), StringToJString('27'));
              ADM: IntentTefElgin.putExtra(StringToJString('transacoesHabilitadas'), StringToJString('28'));
            end;
          end;

          DEBITO:
          begin
            IntentTefElgin.putExtra(StringToJString('transacoesHabilitadas'), StringToJString('16'));
            IntentTefElgin.putExtra(StringToJString('numParcelas'), StringToJString(''));
          end;
        end;

      end;

      CANCELAMENTO:
      begin
        log.d('NSU:' + nsu);
        log.d('NSU:' + FormatDateTime('YYYYMMDD', Date));
        log.d('NSU:' + valor);
        IntentTefElgin.putExtra(StringToJString('modalidade'), StringToJString('200'));
        IntentTefElgin.putExtra(StringToJString('data'), StringToJString(FormatDateTime('YYYYMMDD', Date)));
        IntentTefElgin.putExtra(StringToJString('NSU_SITEF'), StringToJString(nsu));
      end;
   end;

   log.d('intent: ' + JStringToString(IntentTefElgin.toURI()));

   FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);
   TAndroidHelper.Activity.startActivityForResult(IntentTefElgin, 4321);
end;

initialization

tefelgin_instance := TTefElgin.Create;

end.
