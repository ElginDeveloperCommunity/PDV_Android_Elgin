unit ShipayForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs,
  FMX.Controls.Presentation, FMX.StdCtrls, FMX.Layouts, FMX.Objects, FMX.Edit,
  REST.Types, FireDAC.Stan.Intf, FireDAC.Stan.Option, FireDAC.Stan.Param,
  FireDAC.Stan.Error, FireDAC.DatS, FireDAC.Phys.Intf, FireDAC.DApt.Intf,
  Data.DB, FireDAC.Comp.DataSet, FireDAC.Comp.Client, REST.Response.Adapter,
  REST.Client, Data.Bind.Components, Data.Bind.ObjectScope, Soap.EncdDecd,
  System.RegularExpressions, Androidapi.JNI.GraphicsContentViewText, FMX.Platform,
  Androidapi.helpers, DialogForm;

type
  TStringArray = array of string;
  TfrmShipay = class(TForm)
    LayoutFooter: TLayout;
    Label1: TLabel;
    LayoutHeading: TLayout;
    Titulo: TLabel;
    Logo: TImage;
    LayoutMain: TLayout;
    GridPanelLayout1: TGridPanelLayout;
    LayoutLeft: TLayout;
    LayoutCarteiras: TLayout;
    opMsitef: TRectangle;
    Label15: TLabel;
    LayoutQRCode: TLayout;
    Rectangle1: TRectangle;
    LayoutValor: TLayout;
    LayoutOpcoes: TLayout;
    LayoutLine: TLayout;
    Rectangle2: TRectangle;
    LayoutQR: TLayout;
    LayoutVenda: TLayout;
    img_qr_code: TImage;
    edtValor: TEdit;
    Label14: TLabel;
    rec_cancelar: TRectangle;
    lbl_cancelar: TLabel;
    rec_pagar: TRectangle;
    lbl_pagar: TLabel;
    rec_enviar: TRectangle;
    lbl_enviar: TLabel;
    GridPanelLayout2: TGridPanelLayout;
    Label2: TLabel;
    Label4: TLabel;
    lbl_valor: TLabel;
    Label6: TLabel;
    lbl_dt: TLabel;
    Label8: TLabel;
    lbl_status: TLabel;
    RESTClientAuth: TRESTClient;
    RESTRequestAuth: TRESTRequest;
    RESTResponseAuth: TRESTResponse;
    RESTResponseDataSetAdapterAuth: TRESTResponseDataSetAdapter;
    FDMemTableAuth: TFDMemTable;
    RESTClientOrder: TRESTClient;
    RESTRequestOrder: TRESTRequest;
    RESTResponseOrder: TRESTResponse;
    RESTResponseDataSetAdapterOrder: TRESTResponseDataSetAdapter;
    FDMemTableOrder: TFDMemTable;
    RESTClientStatus: TRESTClient;
    RESTRequestStatus: TRESTRequest;
    RESTResponseStatus: TRESTResponse;
    RESTResponseDataSetAdStatuster1: TRESTResponseDataSetAdapter;
    FDMemTableStatus: TFDMemTable;
    timer_status: TTimer;
    RESTClientCancel: TRESTClient;
    RESTRequestCancel: TRESTRequest;
    RESTResponseCancel: TRESTResponse;
    RESTResponseDataSetAdapCancel: TRESTResponseDataSetAdapter;
    FDMemTableCancel: TFDMemTable;
    GridPanelLayout3: TGridPanelLayout;
    rec_pix: TRectangle;
    Label7: TLabel;
    rec_shipay: TRectangle;
    Label9: TLabel;
    RESTClient1: TRESTClient;
    RESTRequest1: TRESTRequest;
    RESTResponse1: TRESTResponse;
    RESTResponseDataSetAdapter1: TRESTResponseDataSetAdapter;
    FDMemTable1: TFDMemTable;
    rec_mercado: TRectangle;
    Label3: TLabel;
    procedure FormShow(Sender: TObject);
    procedure rec_enviarClick(Sender: TObject);
    procedure timer_statusTimer(Sender: TObject);
    procedure rec_cancelarClick(Sender: TObject);
    procedure FormClose(Sender: TObject; var Action: TCloseAction);
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure rec_pagarClick(Sender: TObject);
    procedure rec_mercadoClick(Sender: TObject);
    procedure rec_pixClick(Sender: TObject);
    procedure rec_shipayClick(Sender: TObject);
  private
    procedure Auth2(access_key, secret_key, client_id:string);
    function BitmapFromBase64(const base64: string): TBitmap;
    procedure SelecionarFormaDePagamento(tipo: integer);
    function change_status(status: string): string;

    { Private declarations }
  public
    { Public declarations }
  end;

var
  frmShipay: TfrmShipay;
  access_token: string;
  order_id: string;
  shipay: string;
  qr_code_text: string;
  deep_link: string;

implementation

{$R *.fmx}


procedure TfrmShipay.botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 0.7;
end;

procedure TfrmShipay.botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 1.0;
end;

procedure TfrmShipay.Auth2(access_key, secret_key, client_id:string);
var
  x: string;
begin
  RESTRequestAuth.Execute;
  if RESTRequestAuth.Response.StatusCode = 200 then
  begin
    with FDMemTableAuth do
    begin
      access_token:= FieldByName('access_token').AsString;
    end;
  end;

end;

function TfrmShipay.BitmapFromBase64(const base64: string): TBitmap;
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

procedure TfrmShipay.SelecionarFormaDePagamento(tipo: integer);
begin
  if order_id = '' then
    begin
    rec_mercado.Stroke.Color := TAlphaColors.Black;
    rec_pix.Stroke.Color := TAlphaColors.Black;
    rec_shipay.Stroke.Color := TAlphaColors.Black;

    // 1 - mercado pago
    // 2 - pix
    // 3 - shipay
    case tipo of
      1:begin
          rec_mercado.Stroke.Color := TAlphaColors.Greenyellow;
          shipay:='mercadopago';
          lbl_pagar.Text:='Abrir Mercado Pago';
          rec_pagar.Visible:= True;
        end;
      2:begin
          rec_pix.Stroke.Color := TAlphaColors.Greenyellow;
          shipay:='pix';
          lbl_pagar.Text:='Copiar Pagamento Pix';
          rec_pagar.Visible:= True;
        end;
      3:begin
          rec_shipay.Stroke.Color := TAlphaColors.Greenyellow;
          shipay:='shipay-pagador';
          lbl_pagar.Text:='';
          rec_pagar.Visible:= False;
        end;

    end;
  end
  else
    showmessage('Existem ordem pendentes');

end;

procedure TfrmShipay.rec_cancelarClick(Sender: TObject);
begin
  if order_id <> '' then
  begin
   DialogForm.FrmDialog.MsgDialog('Cancelar', 'Deseja realmente cancelar a ordem?',
   Procedure
   Begin
        RESTRequestCancel.Params.ParameterByName('Authorization').Value:= 'Bearer ' + access_token;
        RESTRequestCancel.Resource:= '/' + order_id;
        RESTRequestCancel.Execute;

        if RESTRequestCancel.Response.StatusCode = 200 then
        begin
          with FDMemTableCancel do
          begin
            order_id := '';
            qr_code_text:= '';
            deep_link:= '';
            lbl_status.Text:= change_status(FieldByName('status').AsString);

            // Labels
            Label2.Visible:= False;
            Label4.Visible:= False;
            Label6.Visible:= False;
            Label8.Visible:= False;

            // Values
            lbl_valor.Text:= '';
            lbl_valor.Visible:= False;

            lbl_dt.Text:= '';
            lbl_dt.Visible:= False;

            lbl_status.Text:= '';
            lbl_status.Visible:= False;


            img_qr_code.Bitmap :=nil;

            deep_link:= '';
            qr_code_text:= '';
          end;
        end
        else
          showmessage('Erro ao cancelar');

   End);
  end
  else
    showmessage('Não existe orderm a ser cancelada');
end;

function TfrmShipay.change_status(status:string): string;
var res:string;
begin
  if status='approved' then
    res:='Aprovado'
  else if status='expired' then
    res:='Expirado'
  else if status='cancelled' then
    res:='Cancelado'
  else if status='refunded' then
    res:='Devolvido'
  else if status='pending' then
    res:='Pendente'
  else if status='refund_pending' then
    res:='Estorno Pendente'
  else
    res:='Desconhecido';

  Result:=res;
end;

procedure TfrmShipay.rec_enviarClick(Sender: TObject);
var
  str: string;
  json: string;
begin
  if TRegEx.IsMatch(edtValor.Text, '^(\d{1,3}(\,\d{3})*|\d+)(\.\d{1,2})?$') then
  begin
    json:='{"order_ref":"shipaypag-stg-006","wallet":"'+shipay+'","total": '+ edtValor.Text +',"items":[{"item_title": "Produto Teste","unit_price":'+ edtValor.Text +',"quantity": 1}]}';

    RESTRequestOrder.Params.ParameterByName('Authorization').Value:= 'Bearer ' + access_token;
    RESTRequestOrder.Params.ParameterByName('body06A08D4C7DD341F5B73BBF926289E556').Value:= json;
    RESTRequestOrder.Execute;

    if RESTRequestOrder.Response.StatusCode = 200 then
    begin
      with FDMemTableOrder do
      begin
        order_id:= FieldByName('order_id').AsString;

        // Labels
        Label2.Visible:= True;
        Label4.Visible:= True;
        Label6.Visible:= True;
        Label8.Visible:= True;

        // Values
        lbl_valor.Text:= edtValor.Text;
        lbl_valor.Visible:= True;

        lbl_dt.Text:= DateTimeToStr(date);
        lbl_dt.Visible:= True;

        lbl_status.Text:= change_status(FieldByName('status').AsString);
        lbl_status.Visible:= True;

        str:= FieldByName('qr_code').AsString;
        // data:image/png;base64,
        str:= str.Remove(0,22);
        img_qr_code.Bitmap := BitmapFromBase64(str);

        deep_link:= FieldByName('deep_link').AsString;
        qr_code_text:= FieldByName('qr_code_text').AsString;

      end;
    end
        else
          showmessage('Erro ao Enviar Transação');
  end
  else
    showmessage('Digite um valor válido: Ex: 18.99 / 1,070.56');
end;

procedure TfrmShipay.rec_mercadoClick(Sender: TObject);
begin
  SelecionarFormaDePagamento(1);
end;

procedure TfrmShipay.rec_pagarClick(Sender: TObject);
var
  Intent: JIntent;
  URL: string;
  clip: IFMXClipboardService;
begin
  if order_id <> '' then
  begin

      if shipay='pix' then
      begin
        if TPlatformServices.Current.SupportsPlatformService(IFMXClipboardService, clip) then
          clip.SetClipboard(qr_code_text);
          showmessage('Link copiado com sucesso!');
      end;

      if shipay='mercadopago' then
      begin
        URL:= deep_link;
        Intent := TJIntent.Create;
        Intent.setAction(TJIntent.JavaClass.ACTION_VIEW);
        Intent.setData(StrToJURI(URL));
        TAndroidHelper.Activity.startActivity(Intent);
        // SharedActivity.startActivity(Intent);
      end;
  end
  else
    showmessage('Não existe ordem a ser paga!');
end;

procedure TfrmShipay.rec_pixClick(Sender: TObject);
begin
  SelecionarFormaDePagamento(2);
end;

procedure TfrmShipay.rec_shipayClick(Sender: TObject);
begin
  SelecionarFormaDePagamento(3);
end;

procedure TfrmShipay.FormClose(Sender: TObject; var Action: TCloseAction);
begin
  // Labels
  Label2.Visible:= False;
  Label4.Visible:= False;
  Label6.Visible:= False;
  Label8.Visible:= False;

  // Values
  lbl_valor.Text:= '';
  lbl_valor.Visible:= False;

  lbl_dt.Text:= '';
  lbl_dt.Visible:= False;

  lbl_status.Text:= '';
  lbl_status.Visible:= False;

  img_qr_code.Bitmap := nil;
end;

procedure TfrmShipay.FormShow(Sender: TObject);
var
  access_key: string;
  secret_key: string;
  client_id: string;

begin
  access_key:= 'HV8R8xc28hQbX4fq_jaK1A';
	secret_key:= 'ZBD0yR5ybNuHPKqvH0YEiL-hXzfsd4mbot5NuZQ75ZqpMFVuTN__mkFnbl7E6QbXYhVlohnBQ7GQaoLckrrmAA';
	client_id:= '8HMB1egUeKI-h9s4I3gU_w1R6kYifrUfZRrauhvjvX9y2bVoBdpoH7vVm3FZOfFejKB-rEIRjVHBEQxrW93iE40ljPwcVEgfZnKN5SvObHxHvXrgfg87A7aUOeWroajczHNt6KUOwB4-YH90RidhzIJhQ0GEjKwpQt93XJeC1XE';

  Auth2(access_key, secret_key, client_id);

  SelecionarFormaDePagamento(3);

  edtValor.Text:= '4.99';

  DialogForm.FrmDialog.MainLayout:= layoutLeft;
end;

procedure TfrmShipay.timer_statusTimer(Sender: TObject);
begin
  if order_id <> '' then
  begin
    timer_status.Enabled := False;
    try
        RESTRequestStatus.Params.ParameterByName('Authorization').Value:= 'Bearer ' + access_token;
        RESTRequestStatus.Resource:= '/' + order_id;
        RESTRequestStatus.Execute;

        if RESTRequestStatus.Response.StatusCode = 200 then
        begin
          with FDMemTableStatus do
            begin
              lbl_status.Text:= FieldByName('status').AsString;
          end;
        end;
      finally
        timer_status.Enabled := True;
      end;

    end;

end;

end.
