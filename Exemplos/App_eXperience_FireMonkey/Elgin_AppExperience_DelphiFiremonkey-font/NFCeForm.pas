unit NFCeForm;

interface

uses
  System.SysUtils,System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.Objects,
  Androidapi.Helpers, FMX.Controls.Presentation, FMX.StdCtrls, FMX.Layouts,
  FMX.Edit, Androidapi.JNI.OS, System.Permissions, System.IOUtils,System.StrUtils,
  ToastMessage;

type
  TFrmNFCe = class(TForm)
    layoutFooter: TLayout;
    Label1: TLabel;
    GridPanelLayout1: TGridPanelLayout;
    Layout1: TLayout;
    Layout2: TLayout;
    Layout3: TLayout;
    Rectangle3: TRectangle;
    Rectangle1: TRectangle;
    Rectangle2: TRectangle;
    Label2: TLabel;
    edtTempo: TEdit;
    Layout4: TLayout;
    Layout5: TLayout;
    Label3: TLabel;
    edtNota: TEdit;
    Label4: TLabel;
    edtSerie: TEdit;
    Layout6: TLayout;
    Layout7: TLayout;
    Layout8: TLayout;
    Label5: TLabel;
    edtNome: TEdit;
    Label6: TLabel;
    edtPreco: TEdit;
    recConfigurar: TRectangle;
    Label7: TLabel;
    recEnviar: TRectangle;
    Label8: TLabel;

    procedure FormActivate(Sender: TObject);
    procedure recConfigurarClick(Sender: TObject);
    procedure FormDestroy(Sender: TObject);
    procedure recEnviarClick(Sender: TObject);
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
  private
    function FileToString(arquivo: string): string;
    procedure gerarNumeroNotaSerie();
    { Private declarations }
  public
    { Public declarations }
  end;

var
  FrmNFCe: TFrmNFCe;

implementation

{$R *.fmx}

uses Printer, It4r;

procedure TFrmNFCe.FormActivate(Sender: TObject);
begin
    PermissionsService.RequestPermissions([JStringToString(TJManifest_permission.JavaClass.READ_EXTERNAL_STORAGE),
                                           JStringToString(TJManifest_permission.JavaClass.WRITE_EXTERNAL_STORAGE)],
    procedure(const APermissions: TArray<string>; const AGrantResults: TArray<TPermissionStatus>)
    begin
      if (Length(AGrantResults) = 2)
      and (AGrantResults[0] = TPermissionStatus.Granted)
      and (AGrantResults[1] = TPermissionStatus.Granted) then
      else
        begin
          ShowMessage('Permissões para acesso a Biblioteca não concedida!');
        end;
    end);

    edtNome.Text:= 'Café';
    edtPreco.Text:= '9.90';
    Impressora.printerInternalImpStart();
end;

procedure TFrmNFCe.FormDestroy(Sender: TObject);
begin
  Impressora.PrinterStop;
end;

procedure TFrmNFCe.gerarNumeroNotaSerie;
begin
  edtNota.Text:= Drm.getNumeroNota;
  edtSerie.Text:= Drm.getNumeroSerie;
  edtTempo.Text:= It4r.dDiff.ToString + 's';
end;

procedure TFrmNFCe.recConfigurarClick(Sender: TObject);
var
  res: integer;
begin
  res:= Drm.configurarXmlNfce;
  if res = 1 then
  begin
    recEnviar.Enabled:= True;
    recConfigurar.Enabled:= False;
    TToastMessage.show('NFCe configurado',3,40,TToastPosition.tpBottom);
//    Showmessage('NFCe configurado!');
  end
  else
    ShowMessage('Erro ao configurar a NFCe!');

end;

procedure TFrmNFCe.recEnviarClick(Sender: TObject);
var
  xml,arquivo : string;
//  listaarquivos: TStringDynArray;
  res: integer;
begin
  res:= Drm.venderItem('I', '0.00', '123456789011');
  if res <> 1 then
    ShowMessage('Erro ao vender Item 1! ~> ' + IntToStr(res));

  res:= Drm.venderItem(edtNome.Text, edtPreco.Text, '123456789012');
  if res <> 1 then
    ShowMessage('Erro ao vender Item 2! ~> ' + IntToStr(res));

  res:= Drm.encerrarVenda(edtPreco.Text, 'Dinheiro');
  if res <> 1 then
    ShowMessage('Erro ao encerrar venda!');

  log.d(ReplaceStr(System.IOUtils.TPath.GetSharedDownloadsPath,'/Download',''));
//  listaarquivos := TDirectory.GetFiles(ReplaceStr(System.IOUtils.TPath.GetSharedDownloadsPath,'/Download',''));
//  for arquivo in listaarquivos do
//  begin
//    log.d(ExtractFileName(arquivo));
//  end;
//
//  log.d('LOGS');
  arquivo := ReplaceStr(System.IOUtils.TPath.GetSharedDownloadsPath,'/Download','/EnvioWS.xml');

  xml := FileToString(arquivo);
  Impressora.ImprimeXMLNFCe(xml,'CODIGO-CSC-CONTRIBUINTE-36-CARACTERES',1,0,True, True);

  gerarNumeroNotaSerie;
end;

procedure TFrmNFCe.botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 0.7;
end;

procedure TFrmNFCe.botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 1.0;
end;

function TFrmNFCe.FileToString(arquivo: string): string;
 var
      TextFile: TStringList;
begin

//  arquivo := System.IOUtils.TPath.GetDocumentsPath + PathDelim + arquivo;
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
