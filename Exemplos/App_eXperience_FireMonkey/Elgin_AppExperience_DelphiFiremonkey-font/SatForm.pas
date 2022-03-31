unit SatForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.ScrollBox,
  FMX.Memo, FMX.Objects, FMX.Edit, FMX.Layouts, FMX.Controls.Presentation,
  FMX.StdCtrls,  System.Permissions,Androidapi.JNI.App,
  Androidapi.JNI.OS,Androidapi.Helpers,
  SATService, FMX.Memo.Types, Elgin.JNI.E1,
  Androidapi.JNI.JavaTypes, System.Threading, System.IOUtils, System.NetEncoding;

type
  TfrmSAT = class(TForm)
    LayoutMain: TLayout;
    LayoutHeading: TLayout;
    Titulo: TLabel;
    Logo: TImage;
    LayoutContent: TLayout;
    GridPanelLayout1: TGridPanelLayout;
    LayoutLeft: TLayout;
    LayoutRight: TLayout;
    LayoutFooter: TLayout;
    Rectangle1: TRectangle;
    Label3: TLabel;
    Memo1: TMemo;
    Label1: TLabel;
    GridPanelLayout2: TGridPanelLayout;
    rd_smart: TRadioButton;
    rd_satgo: TRadioButton;
    Label2: TLabel;
    LayoutLine: TLayout;
    Edit1: TEdit;
    rec_consultar: TRectangle;
    lbl_consultar: TLabel;
    rec_cancelar: TRectangle;
    lbl_cancelamento: TLabel;
    rec_status: TRectangle;
    lbl_status: TLabel;
    rec_ativar: TRectangle;
    lbl_ativar: TLabel;
    rec_venda: TRectangle;
    lbl_realiza_venda: TLabel;
    rec_associar: TRectangle;
    lbl_associar: TLabel;
    rec_extrair_logs: TRectangle;
    Label4: TLabel;
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
  procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
    procedure rec_consultarClick(Sender: TObject);
    procedure rec_cancelarClick(Sender: TObject);
    procedure rec_statusClick(Sender: TObject);
    procedure rec_ativarClick(Sender: TObject);
    procedure rec_associarClick(Sender: TObject);
    procedure FormShow(Sender: TObject);
    procedure rd_satgoChange(Sender: TObject);
    procedure rec_vendaClick(Sender: TObject);
    procedure rec_extrair_logsClick(Sender: TObject);
  private
    function FileToString(arquivo: string): string;
    { Private declarations }

  public
    { Public declarations }

  end;

var
  frmSAT: TfrmSAT;
  xmlEnviaDadosVenda:string;
  xmlCancelamento: string;

  cfeCancelamento:string;


implementation

{$R *.fmx}

uses SatLib;

procedure TfrmSAT.botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 0.7;
end;

procedure TfrmSAT.botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 1.0;
end;

procedure TfrmSAT.FormShow(Sender: TObject);
begin
  xmlEnviaDadosVenda:= 'xmlenviadadosvendasat.xml';
  xmlCancelamento:= 'cupomSatCancelamento.xml';
  cfeCancelamento:= '';

  rd_smart.IsChecked:= true;
end;

procedure TfrmSAT.rd_satgoChange(Sender: TObject);
begin
  if rd_smart.IsChecked=true then
  begin
    xmlEnviaDadosVenda:= 'xmlenviadadosvendasat.xml';
    xmlCancelamento:= 'cupomSatCancelamento.xml';
  end
  else
  begin
    xmlEnviaDadosVenda:= 'satgo3.xml';
    xmlCancelamento:='cancelamentosatgo.xml';
  end;

end;

procedure TfrmSAT.rec_consultarClick(Sender: TObject);
var
  res, mimo: string;
  i: integer;
begin
  res:= Sat.ConsultarSat(Sat.gerarNumeroSessao());
  Memo1.Lines.Clear;
  for i := 0 to length(res)- 1 do
  begin
    mimo:= mimo + res[i];
    if i mod 40 = 0 then mimo:= mimo + #13#10;
  end;
  Memo1.Lines.Add(mimo);
end;

procedure TfrmSAT.rec_extrair_logsClick(Sender: TObject);
var
  TextFile: TStringList;
  dir, res, path:string;
  charArray : Array[0..0] of Char;
  i: integer;
begin
  res:= Sat.extrairLogs(Sat.gerarNumeroSessao(), Edit1.Text);

  dir:= 'logs_SAT.txt';
  dir:= TPath.GetDownloadsPath + TPath.DirectorySeparatorChar + dir;
//  dir:= TPath.GetTempPath +TPath.DirectorySeparatorChar + dir;

  charArray[0] := '|';
  res:= (res.Split(charArray))[5];
  res:= TNetEncoding.Base64.Decode(res);
  TextFile := TStringList.Create;
  TextFile.Text:= res;
  TextFile.SaveToFile(dir);

  Memo1.Lines.Clear;
  Memo1.Lines.Add('Log Sat salvo em ');
  for i := 0 to length(dir) do
  begin
    path:= path + dir[i];
    if i mod 40 = 0 then path:= path + #13#10;
  end;
  Memo1.Lines.Add(path);

//  log.d(TPath.GetTempPath +TPath.DirectorySeparatorChar);
//  log.d(TPath.GetHomePath +TPath.DirectorySeparatorChar);
//  log.d(TPath.GetDocumentsPath +TPath.DirectorySeparatorChar);
//  log.d(TPath.GetDownloadsPath +TPath.DirectorySeparatorChar);
end;

procedure TfrmSAT.rec_cancelarClick(Sender: TObject);
var
  res, xml, mimo: string;
  i: integer;
begin
  xml := FileToString(xmlCancelamento);
  res:= Sat.cancelarUltimaVenda(Sat.gerarNumeroSessao(), cfeCancelamento, Edit1.TExt , xml);
  Memo1.Lines.Clear;
  for i := 0 to length(res)- 1 do
  begin
    mimo:= mimo + res[i];
    if i mod 40 = 0 then mimo:= mimo + #13#10;
  end;
  Memo1.Lines.Add(mimo);
end;


procedure TfrmSAT.rec_statusClick(Sender: TObject);
var
  res, mimo:string;
  i: integer;
begin
  res:= Sat.consultarStatusOperacional(Sat.gerarNumeroSessao(), Edit1.Text);
  Memo1.Lines.Clear;
  for i := 0 to length(res)- 1 do
  begin
    mimo:= mimo + res[i];
    if i mod 40 = 0 then mimo:= mimo + #13#10;
  end;
  Memo1.Lines.Add(mimo);
end;

procedure TfrmSAT.rec_vendaClick(Sender: TObject);
var
  res, xml, mimo: string;
  i: integer;
begin
  xml:= FileToString(xmlEnviaDadosVenda);
  res:= Sat.enviarDadosVenda(Sat.gerarNumeroSessao(), Edit1.Text, xml);
  Memo1.Lines.Clear;

  for i := 0 to length(res)- 1 do
  begin
    mimo:= mimo + res[i];
    if i mod 40 = 0 then mimo:= mimo + #13#10;
  end;
  Memo1.Lines.Add(mimo);
end;

procedure TfrmSAT.rec_ativarClick(Sender: TObject);
var
  res, mimo:string;
  i: integer;
begin
  res:= (Sat.ativarSat(Sat.gerarNumeroSessao(), 2, Edit1.Text, '14200166000166', 15));
  Memo1.Lines.Clear;
  for i := 0 to length(res)- 1 do
  begin
    mimo:= mimo + res[i];
    if i mod 40 = 0 then mimo:= mimo + #13#10;
  end;
  Memo1.Lines.Add(mimo);
end;

procedure TfrmSAT.rec_associarClick(Sender: TObject);
var
  res, mimo:string;
  i: integer;
begin
  res:= Sat.associarAssinatura(SAt.gerarNumeroSessao(), Edit1.Text, '16716114000172', 'SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT');
  Memo1.Lines.Clear;

  for i := 0 to length(res)- 1 do
  begin
    mimo:= mimo + res[i];
    if i mod 40 = 0 then mimo:= mimo + #13#10;
  end;
  Memo1.Lines.Add(mimo);

end;

function TfrmSAT.FileToString(arquivo: string): string;
 var
      TextFile: TStringList;
begin

  arquivo := System.IOUtils.TPath.GetDocumentsPath + PathDelim + arquivo;
  TextFile := TStringList.Create;
  try
    try
      TextFile.LoadFromFile(arquivo);

      Result := TextFile.Text;

    finally
      FreeAndNil(TextFile);
    end
  except

    on E:Exception do ShowMessage('Não foi possível abrir o arquivo!');
  end;
end;

end.
