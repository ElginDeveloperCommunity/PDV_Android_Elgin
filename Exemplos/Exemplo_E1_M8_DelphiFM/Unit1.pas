unit Unit1;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs,
  System.Math.Vectors, FMX.Controls.Presentation, FMX.StdCtrls, FMX.Controls3D,
  FMX.Layers3D, Androidapi.JNI.GraphicsContentViewText, FMX.Platform.Android,
  Androidapi.Helpers, Androidapi.JNI.JavaTypes, Androidapi.JNI.App, FMX.Layouts,
  System.Messaging, System.IOUtils, System.JSON;

type
  TForm1 = class(TForm)
    Layout1: TLayout;
    btnScanner: TButton;
    btnImpressaoJSONDireta: TButton;
    btnImpressaoJSONArquivo: TButton;
    btnPagamentoCredito: TButton;
    btnPagamentoVoucher: TButton;
    btnPagamentoDebito: TButton;
    btnPagamentoCreditoPar: TButton;
    btnReimpCliente: TButton;
    btnReimpEstab: TButton;
    btnCancela: TButton;
    procedure btnScannerClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);
    procedure btnImpressaoJSONDiretaClick(Sender: TObject);
    procedure btnImpressaoJSONArquivoClick(Sender: TObject);
    procedure btnPagamentoCreditoClick(Sender: TObject);
    procedure btnPagamentoVoucherClick(Sender: TObject);
    procedure btnPagamentoDebitoClick(Sender: TObject);
    procedure btnPagamentoCreditoParClick(Sender: TObject);
    procedure btnReimpEstabClick(Sender: TObject);
    procedure btnReimpClienteClick(Sender: TObject);
    procedure btnCancelaClick(Sender: TObject);
  private
    JSON: String;
    FMessageSubscriptionID, requestCodeScanner, requestCodeImpressora,
    requestCodePagamento, requestCodeReimpEstab, requestCodeReimpCliente,
    requestCodeCancelamento: Integer;

    procedure HandleActivityMessage(const Sender: TObject; const M: TMessage);
  public
    { Public declarations }
  end;

var
  Form1: TForm1;

implementation

{$R *.fmx}
{$R *.LgXhdpiPh.fmx ANDROID}

procedure TForm1.HandleActivityMessage(const Sender: TObject; const M: TMessage);
var
  resultIntent: JIntent;
  requestCode, resultCode: Integer;
  aux: String;
  saidaTransacao: TJSONObject;
  cupom: TJSONArray;
begin
  if M is TMessageResultNotification then
  begin
    TMessageManager.DefaultManager.Unsubscribe(TMessageResultNotification, FMessageSubscriptionID);
    FMessageSubscriptionID := 0;

    resultIntent := TMessageResultNotification(M).Value;
    requestCode := TMessageResultNotification(M).RequestCode;
    resultCode := TMessageResultNotification(M).ResultCode;

    if( requestCode = requestCodeScanner ) then
    begin

      if resultCode = TJActivity.JavaClass.RESULT_OK then
      begin
        if( resultIntent.getStringExtra(StringToJString('retorno')).equals(StringToJString('1')) ) then
        begin
          ShowMessage(
            'Leitura realizada com sucesso:' + sLineBreak + sLineBreak +
            'Tipo: ' + JStringToString(resultIntent.getStringExtra(StringToJString('tipo'))) + sLineBreak +
            'Código: ' + JStringToString(resultIntent.getStringExtra(StringToJString('codigobarras')))
          );
        end
        else
          ShowMessage('Erro na leitura.');
      end
      else
        ShowMessage('Leitura cancelada.');
    end
    else if( requestCode = requestCodeImpressora ) then
    begin
      if ResultCode = TJActivity.JavaClass.RESULT_OK then
      begin
        if( resultIntent.getStringExtra(StringToJString('retorno')).equals(StringToJString('1')) ) then
          ShowMessage('Impressão realizada com sucesso!')
        else
        begin
          if( Not resultIntent.hasExtra(StringToJString('erro')) ) then
            ShowMessage('Erro na impressão.')
          else
            ShowMessage(
              'Erro na impressão:' + sLineBreak + sLineBreak +
              JStringToString(resultIntent.getStringExtra(StringToJString('erro')))
            );
        end;
      end;
    end
    else if (requestCode = requestCodePagamento) Or (requestCode = requestCodeCancelamento) then
    begin
      if ResultCode = TJActivity.JavaClass.RESULT_OK then
      begin
        if( resultIntent.getStringExtra(StringToJString('retorno')).equals(StringToJString('1')) ) then
        begin
          aux := JStringToString(resultIntent.getStringExtra(StringToJString('mensagem')));

          saidaTransacao := TJSONObject.ParseJSONValue(JStringToString(resultIntent.getStringExtra(StringToJString('saidatransacao')))) as TJSONObject;

          if( requestCode = requestCodePagamento ) then
            ShowMessage('Autorizada (' + aux + '):' + sLineBreak + sLineBreak +
            saidaTransacao.Get('comprovanteDiferenciadoLoja').JsonValue.ToString)
          else
            ShowMessage('Autorizada (' + aux + '):' + sLineBreak + sLineBreak +
            JStringToString(resultIntent.getStringExtra(StringToJString('saidatransacao'))));
        end
        else
          aux := JStringToString(resultIntent.getStringExtra(StringToJString('erro')));

        if( resultIntent.getStringExtra(StringToJString('retorno')).equals(StringToJString('0')) ) then
            ShowMessage('Erro na transação:' + sLineBreak + sLineBreak + aux);
      end
      else
        ShowMessage('Pagamento cancelado!');
    end
    else if (requestCode = requestCodeReimpEstab) Or (requestCode = requestCodeReimpCliente) then
    begin
      if ResultCode = TJActivity.JavaClass.RESULT_OK then
      begin
        if( resultIntent.getStringExtra(StringToJString('retorno')).equals(StringToJString('1')) ) then
          ShowMessage('Impressão realizada com sucesso!')
        else
            ShowMessage('Erro:' + sLineBreak + sLineBreak +
            JStringToString(resultIntent.getStringExtra(StringToJString('erro'))));
      end
    end;
  end;
end;

procedure TForm1.FormCreate(Sender: TObject);
begin
  requestCodeScanner := 20;
  requestCodeImpressora := 30;
  requestCodePagamento := 40;
  requestCodeReimpEstab := 50;
  requestCodeReimpCliente := 51;

  JSON :=
    '{"Modulo":"Impressor","Comando":[' +
    '{"Funcao":"AbreConexaoImpressora","Parametros":[{"tipo":5,"modelo":"SmartPOS","conexao":"","parametro":0}]},' +
    '{"Funcao":"AvancaPapel","Parametros":[{"linhas":1}]},' +
    '{"Funcao":"ImpressaoTexto","Parametros":[{"dados":"Impressao Texto","posicao":1,"stilo":1,"tamanho":0}]},' +
    '{"Funcao":"DefinePosicao","Parametros":[{"posicao":1}]},' +
    '{"Funcao":"ImpressaoCodigoBarras","Parametros":[{"tipo":8,"dados":"{C0123456789","altura":20,"largura":1,"HRI":2}]},' +
    '{"Funcao":"DefinePosicao","Parametros":[{"posicao":1}]},' +
    '{"Funcao":"ImpressaoQRCode","Parametros":[{"dados":"www.clubeautomacaoelgin.com.br","tamanho":5,"nivelCorrecao":2}]},' +
    '{"Funcao":"AvancaPapel","Parametros":[{"linhas":3}]},' +
    '{"Funcao":"FechaConexaoImpressora"}]}';
end;

procedure TForm1.btnScannerClick(Sender: TObject);
var
  intentScanner: JIntent;
begin
  FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);

  intentScanner := TJIntent.JavaClass.init(StringToJString('com.elgin.e1.intentservice.LEITOR'));
  TAndroidHelper.Activity.startActivityForResult(intentScanner, requestCodeScanner);
end;

procedure TForm1.btnImpressaoJSONDiretaClick(Sender: TObject);
var
  intentImpressora: JIntent;
begin
  FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);

  intentImpressora := TJIntent.JavaClass.init(StringToJString('com.elgin.e1.intentservice.IMPRESSAO'));
  intentImpressora.putExtra(StringToJString('direta'), StringToJString(JSON));
  TAndroidHelper.Activity.startActivityForResult(intentImpressora, requestCodeImpressora);
end;

procedure TForm1.btnImpressaoJSONArquivoClick(Sender: TObject);
var
  caminhoarquivo: String;
  slist: TStringList;
  intentImpressora: JIntent;
begin
  slist := TStringList.Create;
  try
    try
      caminhoarquivo := System.IOUtils.TPath.GetTempPath + '/impressao.json';
      slist.Add(JSON);
      slist.SaveToFile(caminhoarquivo);
    except on E: Exception do
    begin
      ShowMessage('Erro ao salvar o arquivo.');
      exit;
    end;
    end;
  finally
    slist.Free;
  end;

  FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);

  intentImpressora := TJIntent.JavaClass.init(StringToJString('com.elgin.e1.intentservice.IMPRESSAO'));
  intentImpressora.putExtra(StringToJString('arquivo'), StringToJString(caminhoarquivo));
  TAndroidHelper.Activity.startActivityForResult(intentImpressora, requestCodeImpressora);
end;

procedure TForm1.btnPagamentoCreditoClick(Sender: TObject);
var
  intentPagamento: JIntent;
  entradatransacao, dadosautomacao, personalizacao: String;
begin
  FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);

  entradatransacao := '{"operacao":1,"identificadortransacaoautomacao":"1","tipocartao":1,"tipofinanciamento":1,"valortotal":10.01}';
  dadosautomacao := '{"nomeautomacao":"ELGIN S/A","versaoautomacao":"1.0","empresaautomacao":"Empresa Elgin","suportatroco":false,"suportadesconto":false,"suportaviasdiferenciadas":true,"suportaviareduzida":false,"suportaabatimentosaldovoucher":false}';
  personalizacao := '{"corfundotela":"#0099CC","corfundotoolbar":"#F6F6F6","corfonte":"#F6F6F6"}';

  intentPagamento := TJIntent.JavaClass.init(StringToJString('com.elgin.e1.intentservice.PAGAMENTO'));

  intentPagamento.putExtra(StringToJString('acao'), StringToJString('1'));
  intentPagamento.putExtra(StringToJString('entradatransacao'), StringToJString(entradatransacao));
  intentPagamento.putExtra(StringToJString('dadosautomacao'), StringToJString(dadosautomacao));
  intentPagamento.putExtra(StringToJString('personalizacao'), StringToJString(personalizacao));

  TAndroidHelper.Activity.startActivityForResult(intentPagamento, requestCodePagamento);
end;

procedure TForm1.btnPagamentoCreditoParClick(Sender: TObject);
var
  intentPagamento: JIntent;
  entradatransacao, dadosautomacao, personalizacao: String;
begin
  FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);

  entradatransacao := '{"operacao":1,"identificadortransacaoautomacao":"1","tipocartao":1,"tipofinanciamento":2,"numeroparcelas":3,"valortotal":100}';
  dadosautomacao := '{"nomeautomacao":"ELGIN S/A","versaoautomacao":"1.0","empresaautomacao":"Empresa Elgin","suportatroco":false,"suportadesconto":false,"suportaviasdiferenciadas":true,"suportaviareduzida":false,"suportaabatimentosaldovoucher":false}';
  personalizacao := '{"corfundotela":"#0099CC","corfundotoolbar":"#F6F6F6","corfonte":"#F6F6F6"}';

  intentPagamento := TJIntent.JavaClass.init(StringToJString('com.elgin.e1.intentservice.PAGAMENTO'));

  intentPagamento.putExtra(StringToJString('acao'), StringToJString('1'));
  intentPagamento.putExtra(StringToJString('entradatransacao'), StringToJString(entradatransacao));
  intentPagamento.putExtra(StringToJString('dadosautomacao'), StringToJString(dadosautomacao));
  intentPagamento.putExtra(StringToJString('personalizacao'), StringToJString(personalizacao));

  TAndroidHelper.Activity.startActivityForResult(intentPagamento, requestCodePagamento);
end;

procedure TForm1.btnPagamentoVoucherClick(Sender: TObject);
var
  intentPagamento: JIntent;
  entradatransacao, dadosautomacao, personalizacao: String;
begin
  FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);

  entradatransacao := '{"operacao":1,"identificadortransacaoautomacao":"1","tipocartao":3,"valortotal":10.01}';
  dadosautomacao := '{"nomeautomacao":"ELGIN S/A","versaoautomacao":"1.0","empresaautomacao":"Empresa Elgin","suportatroco":false,"suportadesconto":false,"suportaviasdiferenciadas":true,"suportaviareduzida":false,"suportaabatimentosaldovoucher":false}';
  personalizacao := '{"corfundotela":"#0099CC","corfundotoolbar":"#F6F6F6","corfonte":"#F6F6F6"}';

  intentPagamento := TJIntent.JavaClass.init(StringToJString('com.elgin.e1.intentservice.PAGAMENTO'));

  intentPagamento.putExtra(StringToJString('acao'), StringToJString('1'));
  intentPagamento.putExtra(StringToJString('entradatransacao'), StringToJString(entradatransacao));
  intentPagamento.putExtra(StringToJString('dadosautomacao'), StringToJString(dadosautomacao));
  intentPagamento.putExtra(StringToJString('personalizacao'), StringToJString(personalizacao));

  TAndroidHelper.Activity.startActivityForResult(intentPagamento, requestCodePagamento);
end;

procedure TForm1.btnPagamentoDebitoClick(Sender: TObject);
var
  intentPagamento: JIntent;
  entradatransacao, dadosautomacao, personalizacao: String;
begin
  FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);

  entradatransacao := '{"operacao":1,"identificadortransacaoautomacao":"1","tipocartao":2,"valortotal":10.01}';
  dadosautomacao := '{"nomeautomacao":"ELGIN S/A","versaoautomacao":"1.0","empresaautomacao":"Empresa Elgin","suportatroco":false,"suportadesconto":false,"suportaviasdiferenciadas":true,"suportaviareduzida":false,"suportaabatimentosaldovoucher":false}';
  personalizacao := '{"corfundotela":"#0099CC","corfundotoolbar":"#F6F6F6","corfonte":"#F6F6F6"}';

  intentPagamento := TJIntent.JavaClass.init(StringToJString('com.elgin.e1.intentservice.PAGAMENTO'));

  intentPagamento.putExtra(StringToJString('acao'), StringToJString('1'));
  intentPagamento.putExtra(StringToJString('entradatransacao'), StringToJString(entradatransacao));
  intentPagamento.putExtra(StringToJString('dadosautomacao'), StringToJString(dadosautomacao));
  intentPagamento.putExtra(StringToJString('personalizacao'), StringToJString(personalizacao));

  TAndroidHelper.Activity.startActivityForResult(intentPagamento, requestCodePagamento);
end;

procedure TForm1.btnReimpEstabClick(Sender: TObject);
var
  intentPagamento: JIntent;
begin
  FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);

  intentPagamento := TJIntent.JavaClass.init(StringToJString('com.elgin.e1.intentservice.PAGAMENTO'));

  intentPagamento.putExtra(StringToJString('acao'), StringToJString('3'));

  TAndroidHelper.Activity.startActivityForResult(intentPagamento, requestCodeReimpEstab);
end;

procedure TForm1.btnReimpClienteClick(Sender: TObject);
var
  intentPagamento: JIntent;
begin
  FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);

  intentPagamento := TJIntent.JavaClass.init(StringToJString('com.elgin.e1.intentservice.PAGAMENTO'));

  intentPagamento.putExtra(StringToJString('acao'), StringToJString('4'));

  TAndroidHelper.Activity.startActivityForResult(intentPagamento, requestCodeReimpCliente);
end;

procedure TForm1.btnCancelaClick(Sender: TObject);
var
  intentPagamento: JIntent;
  entradatransacao, dadosautomacao, personalizacao: String;
begin
  FMessageSubscriptionID := TMessageManager.DefaultManager.SubscribeToMessage(TMessageResultNotification, HandleActivityMessage);

  entradatransacao := '{"operacao":4,"identificadortransacaoautomacao":"1","tipocartao":1,"tipofinanciamento":1,"valortotal":10.01}';
  dadosautomacao := '{"nomeautomacao":"ELGIN S/A","versaoautomacao":"1.0","empresaautomacao":"Empresa Elgin","suportatroco":false,"suportadesconto":false,"suportaviasdiferenciadas":true,"suportaviareduzida":false,"suportaabatimentosaldovoucher":false}';
  personalizacao := '{"corfundotela":"#0099CC","corfundotoolbar":"#F6F6F6","corfonte":"#F6F6F6"}';

  intentPagamento := TJIntent.JavaClass.init(StringToJString('com.elgin.e1.intentservice.PAGAMENTO'));

  intentPagamento.putExtra(StringToJString('acao'), StringToJString('1'));
  intentPagamento.putExtra(StringToJString('entradatransacao'), StringToJString(entradatransacao));
  intentPagamento.putExtra(StringToJString('dadosautomacao'), StringToJString(dadosautomacao));
  intentPagamento.putExtra(StringToJString('personalizacao'), StringToJString(personalizacao));

  TAndroidHelper.Activity.startActivityForResult(intentPagamento, requestCodeCancelamento);
end;

end.
