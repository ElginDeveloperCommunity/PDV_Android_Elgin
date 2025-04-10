unit TefForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.Objects,
  FMX.Controls.Presentation, FMX.StdCtrls, FMX.Layouts, FMX.Edit, FMX.ScrollBox,
  FMX.Memo,
  Androidapi.JNI.GraphicsContentViewText,
  Androidapi.Helpers,
  Androidapi.Jni.App,
  System.Messaging,
  Printer,
  Tef.Types,
  PayGo,
  MsiTef,
  TefElgin,
  Soap.EncdDecd,
  System.RegularExpressions, FMX.Memo.Types;

type



  TfrmTEF = class(TForm)
    LayoutMain: TLayout;
    LayoutHeading: TLayout;
    Titulo: TLabel;
    Logo: TImage;
    LayoutContent: TLayout;
    LayoutFooter: TLayout;
    GridPanelLayout1: TGridPanelLayout;
    LayoutLeft: TLayout;
    LayoutRight: TLayout;
    edtValor: TEdit;
    Label14: TLabel;
    edtParcelas: TEdit;
    Label2: TLabel;
    Rectangle1: TRectangle;
    Label3: TLabel;
    memoRetornoTef: TMemo;
    Label4: TLabel;
    edtIP: TEdit;
    Label5: TLabel;
    opLoja: TRectangle;
    Image1: TImage;
    btnLabel: TLabel;
    opTodos: TRectangle;
    Image2: TImage;
    Label6: TLabel;
    opDebito: TRectangle;
    Image3: TImage;
    Label7: TLabel;
    Label8: TLabel;
    opCredito: TRectangle;
    Image4: TImage;
    Label9: TLabel;
    opADM: TRectangle;
    Image5: TImage;
    Label10: TLabel;
    btnEnviarTransacao: TRectangle;
    Label11: TLabel;
    btnCancelarTransacao: TRectangle;
    Label12: TLabel;
    btnConfigurar: TRectangle;
    Label13: TLabel;
    Label1: TLabel;
    opMsitef: TRectangle;
    Label15: TLabel;
    opPaygo: TRectangle;
    Label16: TLabel;
    opAVista: TRectangle;
    Image6: TImage;
    Label17: TLabel;
    retornoImage: TImage;
    opTefElgin: TRectangle;
    Label18: TLabel;
    procedure btnConfigurarClick(Sender: TObject);
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure SelecionarFormaDePagamento(forma : FORMA_PAGAMENTO_TYPE);
    procedure SelecionarTipoDeParcelamento(forma : PARCELAMENTO_TYPE);
    procedure SelecionarSolucaoPagamento(solucao: SOLUCAO_PAGAMENTO_TYPE);
    procedure opCreditoClick(Sender: TObject);
    procedure opDebitoClick(Sender: TObject);
    procedure opTodosClick(Sender: TObject);
    procedure opLojaClick(Sender: TObject);
    procedure opADMClick(Sender: TObject);
    procedure FormActivate(Sender: TObject);
    procedure btnEnviarTransacaoClick(Sender: TObject);
    procedure btnCancelarTransacaoClick(Sender: TObject);
    procedure FormDeactivate(Sender: TObject);
    procedure opPaygoClick(Sender: TObject);
    procedure opMsitefClick(Sender: TObject);
    procedure Retorno(pagadora : SOLUCAO_PAGAMENTO_TYPE; Retorno: string; ViaCliente: string = '');
    procedure opAVistaClick(Sender: TObject);
    procedure opTefElginClick(Sender: TObject);
  private
    { Private declarations }
    function BitmapFromBase64(const base64: string): TBitmap;
  public
    { Public declarations }
  end;

var
  frmTEF: TfrmTEF;
  FormaDePagamento : FORMA_PAGAMENTO_TYPE;
  TipoDeParcelamento : PARCELAMENTO_TYPE;
  TIPO_TRANSACAO : TRANSACAO_TYPE;
  SolucaoPagamento: SOLUCAO_PAGAMENTO_TYPE;
  FMessageSubscriptionID : integer;
  NSU: string = '';

implementation

{$R *.fmx}


function FormataValor(str : string) : string;
var
    x : integer;
begin
    Result := '';
    for x := 0 to Length(str) - 1 do
        if (str.Chars[x] In ['0'..'9']) then
            Result := Result + str.Chars[x];
end;


procedure TfrmTEF.btnCancelarTransacaoClick(Sender: TObject);
var
IntentMsiTef: JIntent;
valor : string;
begin

   TIPO_TRANSACAO := CANCELAMENTO;

   valor := FormataValor(edtValor.Text);


   if SolucaoPagamento = Tef.Types.PAYGO then
      PayGo_instancia.Cancelamento(valor,FormaDePagamento,Retorno)
   else if SolucaoPagamento = Tef.Types.TEFELGIN then
      if NSU <> '' then
          tefelgin_instance.Action(valor,'', NSU, TIPO_TRANSACAO, FormaDePagamento, TipoDeParcelamento, Retorno)
      else
          ShowMessage('� necess�rio realizar uma transa��o antes para realizar o cancelamento no TEF ELGIN!')
   else
   begin
     if not TRegEx.IsMatch(edtIP.Text,'^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$') then
     begin
       ShowMessage('Digite um IP v�lido!');
       exit;
     end;

     MsiTef_instancia.Cancelamento(valor,edtIP.Text,Retorno);
   end;

end;

procedure TfrmTEF.btnConfigurarClick(Sender: TObject);
var
IntentMsiTef: JIntent;
begin

   TIPO_TRANSACAO := CONFIGURACAO;


   if SolucaoPagamento = Tef.Types.PAYGO then
   begin
      PayGo_instancia.Configurar(Retorno);
   end
   else
   begin
     if not TRegEx.IsMatch(edtIP.Text,'^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$') then
     begin
       ShowMessage('Digite um IP v�lido!');
       exit;
     end;

     MsiTef_instancia.Configuracao('',edtIP.Text,Retorno);
   end;
end;

procedure TfrmTEF.btnEnviarTransacaoClick(Sender: TObject);
var
IntentMsiTef: JIntent;
numero_parcelas, valor : string;
begin

   TIPO_TRANSACAO := VENDA;


   valor := FormataValor(edtValor.Text);

   numero_parcelas := edtParcelas.Text;

   if FormaDePagamento = DEBITO then
   begin
      SelecionarTipoDeParcelamento(NENHUM);
   end;


   if SolucaoPagamento = Tef.Types.PAYGO then
   begin
      PayGo_instancia.Venda(valor,strtoint(numero_parcelas),FormaDePagamento,TipoDeParcelamento,Retorno);
   end

   else if SolucaoPagamento = Tef.Types.MSITEF then
   begin

     if not TRegEx.IsMatch(edtIP.Text,'^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$') then
     begin
       ShowMessage('Digite um IP v�lido!');
       exit;
     end;

     MsiTef_instancia.Venda(valor,edtIP.Text,numero_parcelas,FormaDePagamento,TipoDeParcelamento,Retorno);
   end

   else
   begin
      tefelgin_instance.Action(valor,numero_parcelas, NSU, TIPO_TRANSACAO, FormaDePagamento, TipoDeParcelamento, Retorno);
   end;
end;


procedure TfrmTEF.FormActivate(Sender: TObject);
begin
    SelecionarTipoDeParcelamento(LOJA);
    SelecionarFormaDePagamento(CREDITO);
    SelecionarSolucaoPagamento(Tef.Types.PAYGO);
    edtValor.Text := '20,00';
    edtParcelas.Text := '2';
    edtIP.Enabled:= False;

    Impressora.printerInternalImpStart;
    TIPO_TRANSACAO := NONE;
end;

procedure TfrmTEF.FormDeactivate(Sender: TObject);
begin
  Impressora.PrinterStop;
end;



procedure TfrmTEF.opADMClick(Sender: TObject);
begin
  SelecionarTipoDeParcelamento(ADM);
end;

procedure TfrmTEF.opAVistaClick(Sender: TObject);
begin
   SelecionarTipoDeParcelamento(NENHUM);
end;

procedure TfrmTEF.opCreditoClick(Sender: TObject);
begin
   SelecionarFormaDePagamento(CREDITO);
end;

procedure TfrmTEF.opDebitoClick(Sender: TObject);
begin
   SelecionarFormaDePagamento(DEBITO);
end;

procedure TfrmTEF.opLojaClick(Sender: TObject);
begin
   SelecionarTipoDeParcelamento(LOJA);
end;

procedure TfrmTEF.opMsitefClick(Sender: TObject);
begin
   SelecionarSolucaoPagamento(Tef.Types.MSITEF);
   SelecionarTipoDeParcelamento(LOJA);
   SelecionarFormaDePagamento(CREDITO);
   opTodos.Visible := True;
   edtIP.Enabled := True;
   btnConfigurar.Visible:= True;
   opAVista.Visible := False;
   edtParcelas.Text := '2';
end;

procedure TfrmTEF.opPaygoClick(Sender: TObject);
begin
   SelecionarSolucaoPagamento(Tef.Types.PAYGO);
   SelecionarTipoDeParcelamento(NENHUM);
   SelecionarFormaDePagamento(CREDITO);
   opTodos.Visible := True;
   edtIP.Enabled := False;
   opAVista.Visible := True;
   btnConfigurar.Visible:= True;
end;

procedure TfrmTEF.opTefElginClick(Sender: TObject);
begin
   SelecionarSolucaoPagamento(Tef.Types.TEFELGIN);
   SelecionarTipoDeParcelamento(NENHUM);
   SelecionarFormaDePagamento(CREDITO);
   edtIP.Enabled := False;
   edtParcelas.Enabled := False;
   opTodos.Visible := False;
   opAVista.Visible := True;
   btnConfigurar.Visible:= False;
end;

procedure TfrmTEF.opTodosClick(Sender: TObject);
begin
   SelecionarFormaDePagamento(TODOS);
end;


procedure TfrmTEF.Retorno(pagadora : SOLUCAO_PAGAMENTO_TYPE; Retorno, ViaCliente: string);
begin

      if ViaCliente = '' then
        ShowMessage(Retorno)
      else if (TIPO_TRANSACAO = Tef.Types.VENDA) then
       begin

        if pagadora = Tef.Types.MSITEF then
          begin
            memoRetornoTef.Visible := True;
            retornoImage.Visible := False;

            memoRetornoTef.Text := ViaCliente;
            Impressora.ImprimeTexto(ViaCliente,'Centralizado','FONT B',0,True,False,False, False);
        end

        else if pagadora = Tef.Types.TEFELGIN then
        begin
            memoRetornoTef.Visible := True;
            retornoImage.Visible := False;

            memoRetornoTef.Text := ViaCliente;
            NSU:= Retorno;
            Impressora.ImprimeTexto(ViaCliente,'Centralizado','FONT B',0,True,False,False, False);
        end

        else
        begin
            Impressora.IImprimeCupomTEF(ViaCliente);
            memoRetornoTef.Visible := False;
            retornoImage.Visible := True;
            retornoImage.Bitmap := BitmapFromBase64(ViaCliente);
         end
       end

     else if (TIPO_TRANSACAO = Tef.Types.CANCELAMENTO) then
       begin
          if pagadora = Tef.Types.TEFELGIN then
          begin
              memoRetornoTef.Visible := True;
              retornoImage.Visible := False;

              memoRetornoTef.Text := ViaCliente;
              Impressora.ImprimeTexto(ViaCliente,'Centralizado','FONT B',0,True,False,False, False);
          end;
       end;


end;

procedure TfrmTEF.SelecionarSolucaoPagamento(solucao: SOLUCAO_PAGAMENTO_TYPE);
begin

  opMsitef.Stroke.Color := TAlphaColors.Black;
  opPayGo.Stroke.Color := TAlphaColors.Black;
  opTefElgin.Stroke.Color := TAlphaColors.Black;

  SolucaoPagamento := solucao;

  case solucao of
    Tef.Types.MSITEF: opMsitef.Stroke.Color := TAlphaColors.Greenyellow;
    Tef.Types.PAYGO: opPayGo.Stroke.Color := TAlphaColors.Greenyellow;
    Tef.Types.TEFELGIN: opTefElgin.Stroke.Color := TAlphaColors.Greenyellow;
  end;

end;


procedure TfrmTEF.SelecionarFormaDePagamento(forma: FORMA_PAGAMENTO_TYPE);
begin

  opCredito.Stroke.Color := TAlphaColors.Black;
  opDebito.Stroke.Color := TAlphaColors.Black;
  opTodos.Stroke.Color := TAlphaColors.Black;

  FormaDePagamento := forma;

  case forma of
    CREDITO:
    begin
      opCredito.Stroke.Color := TAlphaColors.Greenyellow;

      edtParcelas.Enabled := True;

      label8.Visible:= True;
      opAVista.Visible:= True;
      opADM.Visible:= True;
      opLoja.Visible:= True;
    end;

    DEBITO:
    begin
      opDebito.Stroke.Color := TAlphaColors.Greenyellow;

      edtParcelas.Enabled := False;

      label8.Visible:= False;
      opAVista.Visible:= False;
      opADM.Visible:= False;
      opLoja.Visible:= False;
    end;

    TODOS:
    begin
      opTodos.Stroke.Color := TAlphaColors.Greenyellow;

      edtParcelas.Enabled := True;

      label8.Visible:= True;
      opAVista.Visible:= True;
      opADM.Visible:= True;
      opLoja.Visible:= True;
    end;
  end;

end;

procedure TfrmTEF.SelecionarTipoDeParcelamento(forma: PARCELAMENTO_TYPE);
begin

  opAVista.Stroke.Color := TAlphaColors.Black;
  opLoja.Stroke.Color := TAlphaColors.Black;
  opAdm.Stroke.Color := TAlphaColors.Black;

  TipoDeParcelamento := forma;

  case forma of
    NENHUM :
    begin
      opAVista.Stroke.Color := TAlphaColors.Greenyellow;

      edtParcelas.Text := '1';
      edtParcelas.Enabled:= False;
    end;

    LOJA:
    begin
      opLoja.Stroke.Color := TAlphaColors.Greenyellow;

      edtParcelas.Text := '2';
      edtParcelas.Enabled:= True;
    end;

    ADM:
    begin
      opAdm.Stroke.Color := TAlphaColors.Greenyellow;

      edtParcelas.Text := '2';
      edtParcelas.Enabled:= True;
    end;
  end;

end;

procedure TfrmTEF.botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 0.7;
end;

procedure TfrmTEF.botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 1.0;
end;

//https://stackoverflow.com/questions/21909096/convert-base64-to-bitmap
function TfrmTEF.BitmapFromBase64(const base64: string): TBitmap;
var
  Input: TStringStream;
  Output: TBytesStream;
begin
  Input := TStringStream.Create(base64, TEncoding.ASCII);
  try
    Output := TBytesStream.Create;
    try
      Soap.EncdDecd.DecodeStream(Input, Output);
      Output.Position := 0;
      Result := TBitmap.Create;
      try
        Result.LoadFromStream(Output);
      except
        Result.Free;
        raise;
      end;
    finally
      Output.Free;
    end;
  finally
    Input.Free;
  end;
end;


end.
