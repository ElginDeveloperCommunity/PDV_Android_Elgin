unit MsiTef;

interface

uses
  Androidapi.JNI.GraphicsContentViewText,
  Androidapi.Helpers,
  Androidapi.Jni.App,
  System.Messaging,
  System.SysUtils,
  System.Types,
  FMX.Dialogs,
  Tef.Types;

type

  TMsiTef = class

    RetornoCallBack : TCallBack;

    FMessageSubscriptionID : integer;
    tipo_transacao : TRANSACAO_TYPE;

    procedure Venda(valor, ip, parcelas: string; formaPagamento : FORMA_PAGAMENTO_TYPE ; tipoParcelamento : PARCELAMENTO_TYPE; Retorno : TCallBack );
    procedure Cancelamento(valor,ip : string; Retorno : TCallBack );
    procedure Configuracao(valor,ip : string; Retorno : TCallBack );

    procedure HandleActivityMessage(const Sender: TObject;const msg: TMessage);
    procedure respostaMsitef(dados: JIntent; sucesso : boolean);

    private
    function GetMsitefIntent(valor,ip: string): JIntent;

  end;

var
MsiTef_instancia : TMsiTef;

implementation

procedure TMsiTef.Cancelamento(valor,ip : string; Retorno : TCallBack );
var
IntentMsiTef : JIntent;
begin

   RetornoCallBack := Retorno;

   IntentMsiTef :=  GetMsitefIntent(valor,ip);


   IntentMsiTef.putExtra(StringToJString('modalidade'), StringToJString('200'));

   FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);
   TAndroidHelper.Activity.startActivityForResult(IntentMsiTef, 4321);
end;

procedure TMsiTef.Configuracao(valor,ip : string; Retorno : TCallBack );
var
  IntentMsiTef : JIntent;
begin

   RetornoCallBack := Retorno;

   IntentMsiTef :=  GetMsitefIntent(valor,ip);

   IntentMsiTef.putExtra(StringToJString('modalidade'), StringToJString('110'));
   IntentMsiTef.putExtra(StringToJString('restricoes'), StringToJString('transacoesHabilitadas=16;26;27'));

   FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);
   TAndroidHelper.Activity.startActivityForResult(IntentMsiTef, 4321);
end;

function TMsiTef.GetMsitefIntent(valor,ip: string): JIntent;
var
IntentMsiTef: JIntent;

begin

   IntentMsiTef := TJIntent.JavaClass.init
    (StringToJString('br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF'));

   IntentMsiTef.putExtra(StringToJString('empresaSitef'), StringToJString('00000000'));
   IntentMsiTef.putExtra(StringToJString('enderecoSitef'), StringToJString(ip));
   IntentMsiTef.putExtra(StringToJString('operador'), StringToJString('0001'));
   IntentMsiTef.putExtra(StringToJString('data'), StringToJString(FormatDateTime('yyyyMMdd', Date)));
   IntentMsiTef.putExtra(StringToJString('hora'), StringToJString(FormatDateTime('hhmmss', Time)));
   IntentMsiTef.putExtra(StringToJString('numeroCupom'), StringToJString('1234'));
   IntentMsiTef.putExtra(StringToJString('valor'), StringToJString(valor));
   IntentMsiTef.putExtra(StringToJString('CNPJ_CPF'), StringToJString('11111111111'));
   IntentMsiTef.putExtra(StringToJString('comExterna'), StringToJString('0'));
   IntentMsiTef.putExtra(StringToJString('isDoubleValidation'), StringToJString('0'));
   IntentMsiTef.putExtra(StringToJString('caminhoCertificadoCA'), StringToJString('ca_cert_perm'));

   Result := IntentMsiTef;

end;

procedure TMsiTef.Venda(valor, ip, parcelas: string; formaPagamento : FORMA_PAGAMENTO_TYPE ; tipoParcelamento : PARCELAMENTO_TYPE; Retorno : TCallBack );
var
IntentMsiTef: JIntent;
begin

   RetornoCallBack := Retorno;

   TIPO_TRANSACAO := Tef.Types.VENDA;

   IntentMsiTef :=  GetMsitefIntent(valor,ip);

   case formaPagamento of
       CREDITO :
          begin
             IntentMsiTef.putExtra(StringToJString('modalidade'), StringToJString('3'));

             if strtoint(parcelas) < 2 then
                tipoParcelamento := NENHUM;

             case tipoParcelamento of
                 NENHUM : IntentMsiTef.putExtra(StringToJString('transacoesHabilitadas'), StringToJString('26'));
                 LOJA : IntentMsiTef.putExtra(StringToJString('transacoesHabilitadas'), StringToJString('27'));
                 ADM: IntentMsiTef.putExtra(StringToJString('transacoesHabilitadas'), StringToJString('28'));
             end;
             IntentMsiTef.putExtra(StringToJString('numParcelas'),StringToJString(parcelas));
          end;
       DEBITO :
          begin
            IntentMsiTef.putExtra(StringToJString('modalidade'), StringToJString('2'));
            IntentMsiTef.putExtra(StringToJString('transacoesHabilitadas'), StringToJString('16'));
          end;
       TODOS :
          begin
            IntentMsiTef.putExtra(StringToJString('modalidade'), StringToJString('0'));
            IntentMsiTef.putExtra(StringToJString('restricoes'), StringToJString('transacoesHabilitadas=16'));
          end;
   end;


   FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);
   TAndroidHelper.Activity.startActivityForResult(IntentMsiTef, 4321);
end;

procedure TMsiTef.HandleActivityMessage(const Sender: TObject;
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
             respostaMsitef(TMessageResultNotification(msg).Value, True)
         else if TMessageResultNotification(msg).ResultCode =  TJActivity.JavaClass.RESULT_CANCELED then
              respostaMsitef(TMessageResultNotification(msg).Value, False)
         else
              ShowMessage('Erro resposta Msitef');

      end;

    end;

  except
      on e: exception do
        ShowMessage('Erro resposta Msitef: ' + e.Message);
  end;

end;

procedure TMsiTef.respostaMsitef(dados: JIntent; sucesso: boolean);
var
via_cliente, retono : string;
begin
   if sucesso and Assigned(dados) then
   begin
       via_cliente :=  JStringToString(dados.getStringExtra(StringToJString('VIA_CLIENTE')));
       retono := 'Ação realizada com sucesso!';


   end else
   begin
      retono := 'Alerta! ' + sLineBreak + sLineBreak +  'Ocorreu um erro de transação';
   end;
     TIPO_TRANSACAO := NONE;

     RetornoCallBack(Tef.Types.MSITEF,retono,via_cliente);
end;

initialization

MsiTef_instancia := TMsiTef.Create;

end.
