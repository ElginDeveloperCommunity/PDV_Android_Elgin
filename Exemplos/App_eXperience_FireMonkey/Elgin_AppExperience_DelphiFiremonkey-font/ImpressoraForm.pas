unit ImpressoraForm;

interface

uses
  System.SysUtils,System.IOUtils, System.Types, System.UITypes, System.Classes,
  System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.ListBox,
  FMX.StdCtrls, FMX.Edit, FMX.TabControl, FMX.Objects, FMX.Layouts,
  FMX.Controls.Presentation, System.Math.Vectors, FMX.Controls3D,
  FMX.Layers3D,
  Printer,
  System.Actions, FMX.ActnList, FMX.StdActns, FMX.MediaLibrary.Actions,
  System.Permissions,
  Androidapi.JNI.App,
  Androidapi.JNI.OS,Androidapi.Helpers,System.RegularExpressions,
  Androidapi.JNI.JavaTypes;

type
  TfrmImpressora = class(TForm)
    LayoutMain: TLayout;
    LayoutHeading: TLayout;
    Titulo: TLabel;
    Logo: TImage;
    LayoutContent: TLayout;
    GridPanelLayout1: TGridPanelLayout;
    menuImpressaoTexto: TRectangle;
    Image1: TImage;
    btnLabel: TLabel;
    menuImpressaoBarcode: TRectangle;
    Image2: TImage;
    Label2: TLabel;
    menuImpressaoImagem: TRectangle;
    Image3: TImage;
    Label3: TLabel;
    menuStatusImpressora: TRectangle;
    Image4: TImage;
    Label4: TLabel;
    LayoutPrincipal: TLayout;
    rec: TRectangle;
    TabNavegacao: TTabControl;
    tabImpressaoTexto: TTabItem;
    Label5: TLabel;
    LayoutContainer: TLayout;
    btnImprimirTexto: TRectangle;
    Label9: TLabel;
    btnImprimirNFCE: TRectangle;
    Label10: TLabel;
    btnImprimirSAT: TRectangle;
    Label11: TLabel;
    cbNegrito: TCheckBox;
    cbSublinhado: TCheckBox;
    cbCutPaper: TCheckBox;
    Label12: TLabel;
    Label13: TLabel;
    Label14: TLabel;
    edtMensagem: TEdit;
    rbEsquerda: TRadioButton;
    rbCentralizado: TRadioButton;
    rbDireita: TRadioButton;
    Label15: TLabel;
    Label16: TLabel;
    cbFontSize: TComboBox;
    cbItem17: TListBoxItem;
    cbFontFamily: TComboBox;
    cbItemFontA: TListBoxItem;
    tabImpressaoBarcode: TTabItem;
    Label7: TLabel;
    Layout1: TLayout;
    btnImprimirCodigoBarras: TRectangle;
    Label17: TLabel;
    cbCodigoBarrasCutPaper: TCheckBox;
    Label20: TLabel;
    Label22: TLabel;
    edtCodigo: TEdit;
    labelHeightBarcode: TLabel;
    labelWidthBarcode: TLabel;
    cbWidthCodigoBarras: TComboBox;
    ListBoxItemW1: TListBoxItem;
    cbHeightCodigoBarras: TComboBox;
    ListBoxItemH20: TListBoxItem;
    tabImpressaoImagem: TTabItem;
    Label6: TLabel;
    Layout2: TLayout;
    btnSelecionar: TRectangle;
    Label18: TLabel;
    cbImageCutPaper: TCheckBox;
    Label19: TLabel;
    Label25: TLabel;
    ImagePreVisualizacao: TImage;
    btnImprimir: TRectangle;
    Label26: TLabel;
    LayoutConectar: TLayout;
    edtIP: TEdit;
    LayoutFooter: TLayout;
    Label1: TLabel;
    Layout3: TLayout;
    Layout4: TLayout;
    Layout5: TLayout;
    cbItemFontB: TListBoxItem;
    cbItem34: TListBoxItem;
    cbItem51: TListBoxItem;
    cbItem68: TListBoxItem;
    Label21: TLabel;
    cbTipoCodigoBarras: TComboBox;
    ListBoxEAN8: TListBoxItem;
    ListBoxEAN13: TListBoxItem;
    ListBoxQRCODE: TListBoxItem;
    ListBoxItemW2: TListBoxItem;
    ListBoxItemW3: TListBoxItem;
    ListBoxItemW4: TListBoxItem;
    ListBoxItemW5: TListBoxItem;
    ListBoxItemW6: TListBoxItem;
    ListBoxItemH60: TListBoxItem;
    ListBoxItemH120: TListBoxItem;
    ListBoxItemH200: TListBoxItem;
    ActionList1: TActionList;
    TakePhotoFromLibraryAction1: TTakePhotoFromLibraryAction;
    rbCBDireita: TRadioButton;
    rbCBCentralizado: TRadioButton;
    rbCBEsquerda: TRadioButton;
    Label27: TLabel;
    ListBoxUPCA: TListBoxItem;
    ListBoxCODE39: TListBoxItem;
    ListBoxITF: TListBoxItem;
    ListBoxCODEBAR: TListBoxItem;
    ListBoxCODE93: TListBoxItem;
    ListBoxCODE128: TListBoxItem;
    rbImpInterna: TRadioButton;
    rdImpExterna: TRadioButton;
    menuStatusMenuGaveta: TRectangle;
    Image5: TImage;
    menuAbrirGaveta: TRectangle;
    btnAbrirGaveta: TLabel;
    rdImpUSB: TRadioButton;
    layoutImpressora: TLayout;
    cbImpressora: TComboBox;
    Label23: TLabel;
    listI9: TListBoxItem;
    listI8: TListBoxItem;
    procedure menuImpressaoTextoClick(Sender: TObject);
    procedure menuImpressaoBarcodeClick(Sender: TObject);
    procedure menuImpressaoImagemClick(Sender: TObject);
    procedure menuStatusImpressoraClick(Sender: TObject);
    procedure menuStatusMenuGavetaClick(Sender: TObject);
    procedure btnImprimirTextoClick(Sender: TObject);
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure FormActivate(Sender: TObject);
    procedure btnImprimirCodigoBarrasClick(Sender: TObject);
    procedure btnSelecionarClick(Sender: TObject);
    procedure TakePhotoFromLibraryAction1DidFinishTaking(Image: TBitmap);
    procedure btnImprimirClick(Sender: TObject);
    procedure cbImpressoraExternaChange(Sender: TObject);
    procedure cbTipoCodigoBarrasChange(Sender: TObject);
    procedure btnImprimirSATClick(Sender: TObject);
    procedure btnImprimirNFCEClick(Sender: TObject);
    procedure btnAbrirGavetaClick(Sender: TObject);
    procedure rdImpExternaChange(Sender: TObject);
    procedure cbImpressoraChange(Sender: TObject);
    procedure rbImpInternaClick(Sender: TObject);
    procedure rdImpExternaClick(Sender: TObject);
    procedure rdImpUSBChange(Sender: TObject);
  private
    { Private declarations }
    procedure MudarCorBotao(codigo: integer);
    function FileToString(arquivo : string): string;
  public
    { Public declarations }
  end;

var
  frmImpressora: TfrmImpressora;
  modelo: string;

implementation

{$R *.fmx}

procedure TfrmImpressora.botaoEfeitoMouseDown(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
     TRectangle(Sender).Opacity := 0.7;
end;

procedure TfrmImpressora.botaoEfeitoMouseUp(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 1.0;
end;

procedure TfrmImpressora.btnImprimirTextoClick(Sender: TObject);
var
Alinhamento, Font, Texto : string;
FontSize : integer;
begin
  Alinhamento := 'Centralizado';

  if rbEsquerda.IsChecked then
      Alinhamento := 'Esquerda'
  else if rbCentralizado.IsChecked then
      Alinhamento := 'Centralizado'
  else
      Alinhamento := 'Direita';

  case cbFontFamily.ItemIndex of
     0 : Font := 'FONT A';
     1 : Font := 'FONT B';
  end;

  case cbFontSize.ItemIndex of
    0 : FontSize := 17;
    1 : FontSize := 34;
    2 : FontSize := 51;
    3 : FontSize := 68;
  end;

  if edtMensagem.Text = '' then
  begin
    ShowMessage('Digite uma Mensagem!');
    exit;
  end;

  Impressora.ImprimeTexto(edtMensagem.Text,Alinhamento,Font,FontSize,cbCutPaper.IsChecked,cbSublinhado.IsChecked,cbNegrito.IsChecked, rbImpInterna.IsChecked);
end;

procedure TfrmImpressora.btnSelecionarClick(Sender: TObject);
begin
    TAction(ActionList1.Actions[0]).Execute;
end;

procedure TfrmImpressora.cbImpressoraChange(Sender: TObject);
begin
  case cbImpressora.ItemIndex of
      0: modelo := 'i9';
      1: modelo := 'i8';
  end;
  if rdImpUSB.IsChecked then
    rdImpUSBChange(Sender)
  else if rdImpExterna.IsChecked then
    rdImpExternaClick(Sender)
  else if rbImpInterna.IsChecked then
    rbImpInternaClick(Sender);
       
end;

procedure TfrmImpressora.cbImpressoraExternaChange(Sender: TObject);
begin
   if TCheckBox(Sender).IsChecked then
      edtIP.Enabled := True
   else
      edtIP.Enabled := False;
end;

procedure TfrmImpressora.cbTipoCodigoBarrasChange(Sender: TObject);
begin
   if cbTipoCodigoBarras.ItemIndex = 2 then
   begin
      labelHeightBarcode.Visible := False;
      cbHeightCodigoBarras.Visible := False;

      labelWidthBarcode.Visible := True;
      cbWidthCodigoBarras.Visible := True;
   end
   else if cbTipoCodigoBarras.ItemIndex = 8 then
   begin
      labelHeightBarcode.Visible := True;
      cbHeightCodigoBarras.Visible := True;

      labelWidthBarcode.Visible := True;
      cbWidthCodigoBarras.Visible := True;
   end
   else
   begin
      labelHeightBarcode.Visible := False;
      cbHeightCodigoBarras.Visible := False;

      labelWidthBarcode.Visible := False;
      cbWidthCodigoBarras.Visible := False;
   end;

    case cbTipoCodigoBarras.ItemIndex of
       0 : edtCodigo.Text := '40170725';
       1 : edtCodigo.Text := '0123456789012';
       2 : edtCodigo.Text := 'ELGIN DEVELOPERS COMMUNITY';
       3 : edtCodigo.Text := '123601057072';
       //4 : edtCodigo.Text := 'UPC_E'; // lib nao funciona
       4 : edtCodigo.Text := 'CODE39';
       5 : edtCodigo.Text := '05012345678900';
       6 : edtCodigo.Text := 'A3419500A';
       7 : edtCodigo.Text := 'CODE93';
       8 : edtCodigo.Text := '{C1233';
   end;


end;

procedure TfrmImpressora.FormActivate(Sender: TObject);
begin
    Impressora.printerInternalImpStart();
    rbImpInterna.IsChecked := True;
    cbImpressora.ItemIndex := 0;
    modelo:= 'i9';

    rbEsquerda.IsChecked:= True;
    cbFontFamily.ItemIndex := 0;
    cbFontSize.ItemIndex := 2;
    edtMensagem.Text := 'ELGIN DEVELOPER COMMUNITY';
    rbCentralizado.IsChecked := True;
    rbCBCentralizado.IsChecked := True;

    cbTipoCodigoBarras.ItemIndex := 0;
    cbHeightCodigoBarras.ItemIndex := 2;
    cbWidthCodigoBarras.ItemIndex := 2;

    tabnavegacao.ActiveTab := tabImpressaoTexto;
    MudarCorBotao(0);


    PermissionsService.RequestPermissions([JStringToString(TJManifest_permission.JavaClass.READ_EXTERNAL_STORAGE),
                                           JStringToString(TJManifest_permission.JavaClass.WRITE_EXTERNAL_STORAGE)],
    procedure(const APermissions: TArray<string>; const AGrantResults: TArray<TPermissionStatus>)
    begin
      if (Length(AGrantResults) = 2)
      and (AGrantResults[0] = TPermissionStatus.Granted)
      and (AGrantResults[1] = TPermissionStatus.Granted) then
      else
        begin
          ShowMessage('Permiss�es para acesso a Biblioteca n�o concedida!');
        end;
    end)



end;

procedure TfrmImpressora.btnAbrirGavetaClick(Sender: TObject);
begin
  impressora.abrirGaveta();
end;

procedure TfrmImpressora.menuImpressaoBarcodeClick(Sender: TObject);
begin
  tabnavegacao.ActiveTab := tabImpressaoBarcode;
  MudarCorBotao(1);
end;

procedure TfrmImpressora.menuImpressaoImagemClick(Sender: TObject);
begin
  tabnavegacao.ActiveTab := tabImpressaoImagem;
  MudarCorBotao(2);
end;

procedure TfrmImpressora.menuImpressaoTextoClick(Sender: TObject);
begin
   tabnavegacao.ActiveTab := tabImpressaoTexto;
   MudarCorBotao(0);
end;

  procedure TfrmImpressora.menuStatusMenuGavetaClick(Sender: TObject);

var msgStatusGaveta : string;

begin
   case Impressora.StatusGaveta of
      1 : msgStatusGaveta := 'Gaveta Aberta';
      2 : msgStatusGaveta := 'Gaveta Fechada';
      else
        msgStatusGaveta := 'Status Desconhecido!'
   end;

   ShowMessage('Status: ' + msgStatusGaveta);
end;

procedure TfrmImpressora.menuStatusImpressoraClick(Sender: TObject);
var
 msg : string;
begin

   case Impressora.statusSensorPapel of
      5 : msg := 'Papel est� presente e n�o est� pr�ximo!';
      6 : msg := 'Papel est� pr�ximo do fim!';
      7 : msg := 'Papel ausente!';
      else
         msg := 'Status Desconhecido!'
   end;

   ShowMessage('Status: ' + msg);
end;

procedure TfrmImpressora.MudarCorBotao(codigo: integer);
var
 cor_ativo: TAlphaColorRec;
begin
  cor_ativo.R := 0;
  cor_ativo.G := 105;
  cor_ativo.B := 165;
  cor_ativo.A := 255;


  menuImpressaoTexto.Stroke.Color := TAlphaColors.Black;
  menuImpressaoBarcode.Stroke.Color := TAlphaColors.Black;
  menuImpressaoImagem.Stroke.Color := TAlphaColors.Black;

  case codigo of
     0 : menuImpressaoTexto.Stroke.Color := TAlphaColor(cor_ativo);
     1 : menuImpressaoBarcode.Stroke.Color := TAlphaColor(cor_ativo);
     2 : menuImpressaoImagem.Stroke.Color := TAlphaColor(cor_ativo);
  end;
end;

procedure TfrmImpressora.rdImpExternaChange(Sender: TObject);
var
config : TStringList;
tipoImp, Result: integer;
begin
//   if TCheckBox(Sender).IsChecked then
//      edtIP.Enabled := True
//   else
//      edtIP.Enabled := False;

  if rdImpExterna.IsChecked then
  begin
    if TRegEx.IsMatch(edtIP.Text,'^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$') then
    begin
      config := TStringList.Create;
      config.StrictDelimiter:= True;
      config.Delimiter := ':';
      config.DelimitedText := edtIP.Text;
      tipoImp := 3;

      Log.d('Imp: \nmodelo: ' + modelo + '\t ip : ' + config[0] + '\t conx�o: ' + inttostr(tipoImp) + '\t port: ' + config[1]);

      Result:= Impressora.PrinterExternalImpStart(modelo, config[0], tipoImp, strtoint(config[1]));
      if Result <> 0 then
      begin
        rbImpInterna.IsChecked := True;
        showmessage('Impressora IP n�o conectada');
      end;
    end else
    begin
      ShowMessage('Ip Inv�lido!');
      rbImpInterna.IsChecked := True;
    end;
  end;

end;

procedure TfrmImpressora.rdImpExternaClick(Sender: TObject);
var
config : TStringList;
tipoImp, Result: integer;
begin
  if TRegEx.IsMatch(edtIP.Text,'^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$') then
  begin
    config := TStringList.Create;
    config.StrictDelimiter:= True;
    config.Delimiter := ':';
    config.DelimitedText := edtIP.Text;
    tipoImp := 3;

    Log.d('Imp: \nmodelo: ' + modelo + '\t ip : ' + config[0] + '\t conx�o: ' + inttostr(tipoImp) + '\t port: ' + config[1]);

    Result:= Impressora.PrinterExternalImpStart(modelo, config[0], tipoImp, strtoint(config[1]));
    if Result <> 0 then
    begin
      rbImpInterna.IsChecked := True;
      showmessage('Impressora IP n�o conectada');
    end;
  end else
  begin
    ShowMessage('Ip Inv�lido!');
    rbImpInterna.IsChecked := True;
  end;
end;

procedure TfrmImpressora.rdImpUSBChange(Sender: TObject);
var
tipoImp, Result:integer;
conexao:string;
begin
  if rdImpUSB.IsChecked = True then
  begin
    tipoImp:= 1;
    conexao:= 'USB';

    Log.d('Imp: modelo: ' + modelo +
            '    tipo: ' + inttostr(tipoImp) +
            '  conx�o: ' + conexao);

    Result:= Impressora.PrinterExternalImpStart(modelo, conexao, tipoImp, 0);
    if Result <> 0 then
    begin
      rbImpInterna.IsChecked := True;
      showmessage('Impressora USB n�o conectada');
    end;
  end;
end;

procedure TfrmImpressora.rbImpInternaClick(Sender: TObject);
begin
  Log.d('Imp: interna');
  rbImpInterna.IsChecked := True;
  Impressora.printerInternalImpStart()
end;


procedure TfrmImpressora.TakePhotoFromLibraryAction1DidFinishTaking(
  Image: TBitmap);
begin
     ImagePreVisualizacao.Bitmap := Image;
end;

procedure TfrmImpressora.btnImprimirClick(Sender: TObject);
begin
   Impressora.imprimeImagem(ImagePreVisualizacao.Bitmap,cbImageCutPaper.IsChecked, rbImpInterna.IsChecked);
end;

procedure TfrmImpressora.btnImprimirCodigoBarrasClick(Sender: TObject);
var
Alinhamento : string;
barcodeType : BARCODE_TYPE;
width, height : integer;
begin

   Alinhamento := 'Centralizado';

  if rbCBEsquerda.IsChecked then
      Alinhamento := 'Esquerda'
  else if rbCBCentralizado.IsChecked then
      Alinhamento := 'Centralizado'
  else
      Alinhamento := 'Direita';

   case cbTipoCodigoBarras.ItemIndex of
       0 : barcodeType := EAN_8;
       1 : barcodeType := EAN_13;
       2 : barcodeType :=  QR_CODE;
       3 : barcodeType :=  UPC_A;
       //4 : barcodeType :=  UPC_E; // lib nao funcionar
       4 : barcodeType :=  CODE_39;
       5 : barcodeType :=  ITF;
       6 : barcodeType :=  CODE_BAR;
       7 : barcodeType :=  CODE_93;
       8 : barcodeType :=  CODE_128;

   end;

   width := cbWidthCodigoBarras.ItemIndex + 1;

   case cbHeightCodigoBarras.ItemIndex of
       0 : height := 20;
       1 : height := 60;
       2 : height := 120;
       3 : height := 200;
   end;

   if not (barcodeType = QR_CODE) then
      Impressora.imprimeBarCode(barcodeType,edtCodigo.Text,Alinhamento,height,width, cbCodigoBarrasCutPaper.IsChecked, rbImpInterna.IsChecked)
   else
      Impressora.imprimeQR_CODE(edtCodigo.Text,Alinhamento,width,cbCodigoBarrasCutPaper.IsChecked, rbImpInterna.IsChecked);
end;

procedure TfrmImpressora.btnImprimirNFCEClick(Sender: TObject);
var
xml : string;
begin
   xml := FileToString('xmlNFCe.xml');
   Impressora.ImprimeXMLNFCe(xml,'CODIGO-CSC-CONTRIBUINTE-36-CARACTERES',1,0,cbCutPaper.IsChecked, rbImpInterna.IsChecked);
end;

procedure TfrmImpressora.btnImprimirSATClick(Sender: TObject);
var
xml : string;

begin
   xml := FileToString('xmlSAT.xml');
   Impressora.ImprimeXMLSAT(xml,0,cbCutPaper.IsChecked, rbImpInterna.IsChecked);
end;

function TfrmImpressora.FileToString(arquivo: string): string;
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

    on E:Exception do ShowMessage('N�o foi poss�vel abrir o arquivo!');
  end;
end;

end.
