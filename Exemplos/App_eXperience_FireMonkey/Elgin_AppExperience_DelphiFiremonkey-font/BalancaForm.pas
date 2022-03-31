unit BalancaForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.Objects,
  FMX.Controls.Presentation, FMX.StdCtrls, FMX.Layouts, FMX.Edit, FMX.ListBox, Elgin.JNI.E1,
  Androidapi.Helpers;

type
  TfrmBalanca = class(TForm)
    LayoutHeading: TLayout;
    Titulo: TLabel;
    Logo: TImage;
    LayoutFooter: TLayout;
    Label1: TLabel;
    LayoutMain: TLayout;
    LayoutCabecalho: TLayout;
    Label2: TLabel;
    LayoutValor: TLayout;
    LayoutModelos: TLayout;
    Label3: TLabel;
    lbl_valor: TLabel;
    GridPanelLayout1: TGridPanelLayout;
    Rectangle1: TRectangle;
    Rectangle2: TRectangle;
    Rectangle3: TRectangle;
    rd_DP30CK: TRadioButton;
    rd_SA110: TRadioButton;
    rd_DPSC: TRadioButton;
    LayoutProtocolos: TLayout;
    Label4: TLabel;
    GridPanelLayout2: TGridPanelLayout;
    Rectangle6: TRectangle;
    Layout1: TLayout;
    GridPanelLayout3: TGridPanelLayout;
    btn_condigurar: TRectangle;
    Label5: TLabel;
    btn_ler_peso: TRectangle;
    Label6: TLabel;
    cb_protocol: TComboBox;
    cb_protocol_0: TListBoxItem;
    cb_protocol_1: TListBoxItem;
    cb_protocol_2: TListBoxItem;
    cb_protocol_3: TListBoxItem;
    cb_protocol_4: TListBoxItem;
    cb_protocol_5: TListBoxItem;
    cb_protocol_6: TListBoxItem;
    cb_protocol_7: TListBoxItem;
    procedure btn_condigurarClick(Sender: TObject);
    procedure btn_ler_pesoClick(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  frmBalanca: TfrmBalanca;

implementation

{$R *.fmx}

uses ToastMessage;

procedure TfrmBalanca.btn_condigurarClick(Sender: TObject);
var
  modelo, protocolo: integer;
  retorno1, retorno2: integer;
  msg: string;
begin
  if rd_DP30CK.IsChecked then
    modelo:= 3
  else if rd_SA110.IsChecked then
    modelo:= 1
  else if rd_DPSC.IsChecked then
    modelo:= 2
  else
    modelo:= 0;

  case cb_protocol.ItemIndex of
    0 : protocolo:= 0;
    1 : protocolo:= 1;
    2 : protocolo:= 2;
    3 : protocolo:= 3;
    4 : protocolo:= 4;
    5 : protocolo:= 5;
    6 : protocolo:= 6;
    7 : protocolo:= 7;
  end;

  retorno1 := TJBalancaE1.JavaClass.ConfigurarModeloBalanca(modelo);
  retorno2 := TJBalancaE1.JavaClass.ConfigurarProtocoloComunicacao(protocolo);
  msg:= 'Retorno: ConfigurarModeloBalança: ' + IntToStr(retorno1) + '  ConfigurarProtocoloComunicação:' +IntToStr(retorno2);
  TToastMessage.show(msg,3,40,TToastPosition.tpBottom);
end;

procedure TfrmBalanca.btn_ler_pesoClick(Sender: TObject);
var
  retorno1, retorno3 : integer;
  retorno2, msg : string;
begin
  retorno1:= TJBalancaE1.JavaClass.AbrirSerial(2400, 8, 'n', 1);
  retorno2:= JStringToString(TJBalancaE1.JavaClass.LerPeso(1));
  retorno3:= TJBalancaE1.JavaClass.Fechar();

  lbl_valor.Text:= retorno2;
  msg:= 'Retorno: AbrirSerial: '+IntToStr(retorno1) +'  LerPes: '+(retorno2)+'  Fechar: ' + IntToStr(retorno3);
  TToastMessage.show(msg,3,40,TToastPosition.tpBottom);
end;

end.
