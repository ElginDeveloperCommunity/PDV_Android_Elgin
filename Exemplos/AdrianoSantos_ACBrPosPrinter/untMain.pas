
unit untMain;

interface

uses
  ACBrBase,
  ACBrConsts,
  ACBrPosPrinter,
  ACBrPosPrinterElginE1Lib,
  ACBrPosPrinterElginE1Service,

  FMX.ActnList,
  FMX.Controls,
  FMX.Controls.Presentation,
  FMX.Dialogs,
  FMX.Edit,
  FMX.EditBox,
  FMX.Forms,
  FMX.Graphics,
  FMX.Layouts,
  FMX.ListBox,
  FMX.Memo,
  FMX.Memo.Types,
  FMX.Objects,
  FMX.ScrollBox,
  FMX.SpinBox,
  FMX.StdCtrls,
  FMX.TabControl,
  FMX.Types,

  System.Actions,
  System.Classes,
  System.IOUtils,
  System.StrUtils,
  System.SysUtils,
  System.TypInfo,
  System.Types,
  System.UITypes,
  System.Variants;

type
  TModoImpressao = (mdiTexto, mdiCodBarra, mdiImagem);

  TForm1 = class(TForm)
    ACBrPosPrinter1: TACBrPosPrinter;
    gridLabelModeloPagina: TGridPanelLayout;
    lblTitModelo: TLabel;
    lblTigPagCod: TLabel;
    gridModeloPagina: TGridPanelLayout;
    cbxModelo: TComboBox;
    cbxPagCodigo: TComboBox;
    gpConfPrinterLarguraEspacejamento: TGridPanelLayout;
    Label16: TLabel;
    Label17: TLabel;
    lblTitLinha: TLabel;
    seColunas: TSpinBox;
    seEspLinhas: TSpinBox;
    seLinhasPular: TSpinBox;
    lytImpGeral: TLayout;
    lytBarraLateral: TLayout;
    lytTabImp: TLayout;
    imgLogo: TImage;
    lytImage: TLayout;
    rdLogo1: TRadioButton;
    rdLogo2: TRadioButton;
    cbTipoCodigoBarras: TComboBox;
    tbcPrincipal: TTabControl;
    tbiImpressora: TTabItem;
    tbiConfig: TTabItem;
    lytToolImpressora: TLayout;
    lytTop: TLayout;
    Image1: TImage;
    Label1: TLabel;
    recBkImpressora: TRectangle;
    lytLeftImg: TLayout;
    swtCortarPapel: TSwitch;
    tbiMain: TTabItem;
    lytGeralMain: TLayout;
    lytLogoSupMain: TLayout;
    lytMenu: TLayout;
    flwMenu: TFlowLayout;
    imgLogSupMain: TImage;
    lytBtnImp: TLayout;
    lytBkCodBarra: TLayout;
    lytBtnConfig: TLayout;
    lytBtnSobre: TLayout;
    recBtnImp: TRectangle;
    recBtnCod: TRectangle;
    recBtnConfig: TRectangle;
    recBtnSobre: TRectangle;
    imgBtnImp: TImage;
    imgBtnCodBarra: TImage;
    lblBtnImp: TLabel;
    imgBtnConfig: TImage;
    lblBtnCodBarra: TLabel;
    lblBtnConfig: TLabel;
    imgBtnSobre: TImage;
    lblBtnSobre: TLabel;
    recBkFundoMenu: TRectangle;
    lytImpressora: TLayout;
    lytCodBarra: TLayout;
    lytConfig: TLayout;
    actAcoes: TActionList;
    actMudarAba: TChangeTabAction;
    tbiCodBarraLer: TTabItem;
    lytBkImpToMain: TLayout;
    speBkImpToMain: TSpeedButton;
    lytToolConfig: TLayout;
    lytToolBkConfig: TLayout;
    imgToolConfig: TImage;
    lblToolConfig: TLabel;
    lytBtnToolConfig: TLayout;
    speToolConfig: TSpeedButton;
    lytToolCodBarra: TLayout;
    lytBkToolCodBarra: TLayout;
    imgLogoCodBarra: TImage;
    lblTitToolCodBarra: TLabel;
    lytBtnBackCodToMain: TLayout;
    speBtnBackCodToMain: TSpeedButton;
    lblPubAdriano: TLabel;
    lytBkBtnTexto: TLayout;
    recBtnTexto: TRectangle;
    lblBtnTexto: TLabel;
    lytBtnTexto: TLayout;
    imgBtnTexto: TImage;
    tbcImpCodImg: TTabControl;
    tbiTexto: TTabItem;
    tbiCodBarraImp: TTabItem;
    tbiImagem: TTabItem;
    lblTitTexto: TLabel;
    recFrameTexto: TRectangle;
    lytBoxTexto: TLayout;
    lstBoxTexto: TListBox;
    lsitemBoxMsg: TListBoxItem;
    lblTit: TLabel;
    Label13: TLabel;
    recFrameCodBarra: TRectangle;
    lblTitSquareCodBarra: TLabel;
    lytBoxCodBarra: TLayout;
    lstBoxCodBarra: TListBox;
    lsitemCodigo: TListBoxItem;
    lblTitCodEdt: TLabel;
    edtCodigo: TEdit;
    lsitemTitEstiloCodBarra: TListBoxItem;
    recFrameImagem: TRectangle;
    lblTitImagem: TLabel;
    lytBoxImagem: TLayout;
    FlowLayout1: TFlowLayout;
    lytBkBtnImagem: TLayout;
    recBtnImage: TRectangle;
    lblTitBtnImage: TLabel;
    imgIcoBtnImage: TImage;
    lytBtnImagem: TLayout;
    lytBkBtnCodBarra: TLayout;
    recBtnCodBarra: TRectangle;
    lblTitBtnCodBarra: TLabel;
    imgIcoCodBarra: TImage;
    lytBtnCodBarra: TLayout;
    lytSobre: TLayout;
    recFundoConfig: TRectangle;
    lytConfigGeral: TLayout;
    lytModeloPagina: TLayout;
    lytBtnAtivar: TLayout;
    recBtnAtivar: TRectangle;
    lblBtnAtivar: TLabel;
    speAtivarImpressora: TSpeedButton;
    lytExtras: TLayout;
    lblTitModeloImp: TLabel;
    lytBtnImpTexto: TLayout;
    recBtnImpTexto: TRectangle;
    lblBtnImpTexto: TLabel;
    speBtnImpTexto: TSpeedButton;
    rdEsquerda: TRadioButton;
    rdCentro: TRadioButton;
    rdDireita: TRadioButton;
    lsitemTipoCod: TListBoxItem;
    lblTitTipoCodigo: TLabel;
    lsitemWidthHeigth: TListBoxItem;
    lytBtnImpCodBarra: TLayout;
    recBtnImpCodBarra: TRectangle;
    lblBtnImpCodBarra: TLabel;
    speBtnImpCodBarra: TSpeedButton;
    cbHeightCodigoBarras: TComboBox;
    ListBoxItemH20: TListBoxItem;
    ListBoxItemH60: TListBoxItem;
    ListBoxItemH120: TListBoxItem;
    ListBoxItemH200: TListBoxItem;
    labelHeightBarcode: TLabel;
    cbWidthCodigoBarras: TComboBox;
    ListBoxItemW1: TListBoxItem;
    ListBoxItemW2: TListBoxItem;
    ListBoxItemW3: TListBoxItem;
    ListBoxItemW4: TListBoxItem;
    ListBoxItemW5: TListBoxItem;
    ListBoxItemW6: TListBoxItem;
    lblWidth: TLabel;
    lytConfigComum: TLayout;
    Layout3: TLayout;
    lblTitEstiloCodBarra: TLabel;
    Layout5: TLayout;
    Label9: TLabel;
    edtMensagem: TEdit;
    lsitemEstiloMsg: TListBoxItem;
    lsiemFontFamily: TListBoxItem;
    lsitemNegSub: TListBoxItem;
    lblEstiloTexto: TLabel;
    lblTitFontF: TLabel;
    cbFontFamily: TComboBox;
    lblTitNeg: TLabel;
    swtNegrito: TSwitch;
    lblTitSub: TLabel;
    swtSublinhado: TSwitch;
    lytImpTipoCodBarra: TLayout;
    lytBkImpTipoCodBarra: TLayout;
    recImpTipoCodBarra: TRectangle;
    lblImpTipoCodBarra: TLabel;
    speImpTipoCodBarra: TSpeedButton;
    lytBtnImpImagem: TLayout;
    recBtnImpImage: TRectangle;
    lblBtnImpImagem: TLabel;
    speBtnImpImagem: TSpeedButton;
    lytBkBtnStatus: TLayout;
    Rectangle5: TRectangle;
    lblTitStatus: TLabel;
    SpeedButton6: TSpeedButton;
    lytBtnExemplosQRCode: TLayout;
    recBtnExemplosQRCode: TRectangle;
    lblBtnExemplosQRCode: TLabel;
    speBtnExemplosQRCode: TSpeedButton;
    recBackCodBarra: TRectangle;
    lytGeralCodeBarra: TLayout;
    lytBarraLateralCodBarras: TLayout;
    lytBtnQRCode: TLayout;
    recQRCode: TRectangle;
    lblTitQRCode: TLabel;
    lytBtCodBarra: TLayout;
    recCodBarra: TRectangle;
    lblTitCodBarra: TLabel;
    recFrameCodBarrasLer: TRectangle;
    lytCodigosBarras: TLayout;
    lstCodigosBarras: TListBox;
    lsitemTextCodBarra01: TListBoxItem;
    edtCodBarra_1: TEdit;
    lytBtnLimparCodBarras: TLayout;
    recBtnLimparCodBarras: TRectangle;
    lblBtnLimparCodBarras: TLabel;
    speBtnLimparCodBarras: TSpeedButton;
    imgQRCode: TImage;
    imgCodBarra: TImage;
    lsitemTextCodBarra02: TListBoxItem;
    edtCodBarra_2: TEdit;
    lsitemTextCodBarra03: TListBoxItem;
    edtCodBarra_3: TEdit;
    lsitemTextCodBarra04: TListBoxItem;
    edtCodBarra_4: TEdit;
    lsitemTextCodBarra05: TListBoxItem;
    edtCodBarra_5: TEdit;
    lsitemTextCodBarra06: TListBoxItem;
    edtCodBarra_6: TEdit;
    lsitemTextCodBarra07: TListBoxItem;
    edtCodBarra_7: TEdit;
    lsitemTextCodBarra08: TListBoxItem;
    edtCodBarra_8: TEdit;
    lsitemTextCodBarra09: TListBoxItem;
    edtCodBarra_9: TEdit;
    lsitemTextCodBarra10: TListBoxItem;
    edtCodBarra_10: TEdit;
    lytButtonsBottom: TLayout;
    lytBtnIniciarCaptura: TLayout;
    recBtnIniciarCaptura: TRectangle;
    lblBtnIniciarCaptura: TLabel;
    speBtnIniciarCaptura: TSpeedButton;
    tbiAbout: TTabItem;
    lytToolAbout: TLayout;
    lytBkToolAbout: TLayout;
    imbBtnAbout: TImage;
    lblToolAbout: TLabel;
    lytBtnBackAboutToMain: TLayout;
    speBtnBackAboutToMain: TSpeedButton;
    lytAboutGeral: TLayout;
    recBkAbout: TRectangle;
    recBackCornerAbout: TRectangle;
    flowAbout: TFlowLayout;
    lytFlowAbout: TLayout;
    recAdrianoSantos: TRectangle;
    lblTitAdriano: TLabel;
    Rectangle1: TRectangle;
    Layout1: TLayout;
    Rectangle2: TRectangle;
    Label2: TLabel;
    procedure cbTipoCodigoBarrasChange(Sender: TObject);
    procedure FormActivate(Sender: TObject);
    procedure FormDestroy(Sender: TObject);
    procedure FormCreate(Sender: TObject);
    procedure FormDeactivate(Sender: TObject);
    procedure FormKeyDown(Sender: TObject; var Key: Word; var KeyChar: Char; Shift:
        TShiftState);
    procedure lytBtnTextoClick(Sender: TObject);
    procedure lytBtnImagemClick(Sender: TObject);
    procedure lytBtnCodBarraClick(Sender: TObject);
    procedure lytCodBarraClick(Sender: TObject);
    procedure lytConfigClick(Sender: TObject);
    procedure lytImpressoraClick(Sender: TObject);
    procedure lytSobreClick(Sender: TObject);
    procedure speAtivarImpressoraClick(Sender: TObject);
    procedure speBkImpToMainClick(Sender: TObject);
    procedure speBtnImpTextoClick(Sender: TObject);
    procedure speToolConfigClick(Sender: TObject);
    procedure speBtnBackCodToMainClick(Sender: TObject);
    procedure speBtnImpCodBarraClick(Sender: TObject);
    procedure speImpTipoCodBarraClick(Sender: TObject);
    procedure speBtnImpImagemClick(Sender: TObject);
    procedure SpeedButton6Click(Sender: TObject);
    procedure speBtnExemplosQRCodeClick(Sender: TObject);
    procedure speBtnIniciarCapturaClick(Sender: TObject);
    procedure speBtnLimparCodBarrasClick(Sender: TObject);
    procedure speBtnBackAboutToMainClick(Sender: TObject);
    procedure TrocarFoto(Sender: TObject);
  private
    { Private declarations }
    FE1Printer    : TACBrPosPrinterElginE1Service;
    FE1Lib        : TACBrPosPrinterElginE1Lib;
    FArquivo      : String;
    FModImpressao : TModoImpressao;
    FTexto        : TStringList;

    procedure ExibirErroImpressaoE1(const MsgErro: string);
    procedure CarregarModelosExternos;
    procedure ConfigurarACBrPosPrinter;
    procedure MudarAba(ATabItem: TTabItem; Sender: TObject);
    procedure SelecionarBotao(AModoImpressao: TModoImpressao);
    procedure Next;
  public
    { Public declarations }
    FIndexCampoAtual : Integer;
  end;

  procedure Toast(const AMsg: string; ShortDuration: Boolean = True);

var
  Form1: TForm1;

implementation

uses
  {$IfDef ANDROID}
    Androidapi.Helpers,
    Androidapi.JNI.Os,
    Androidapi.JNI.JavaTypes,
    Androidapi.IOUtils,
    Androidapi.JNI.Widget,
    FMX.Helpers.Android;
  {$EndIf}

{$R *.fmx}

procedure Toast(const AMsg: string; ShortDuration: Boolean = True);
var
  ToastLength: Integer;
begin
  {$IfNDef ANDROID}
   TDialogServiceAsync.ShowMessage(AMsg);
  {$Else}
   if ShortDuration then
     ToastLength := TJToast.JavaClass.LENGTH_SHORT
   else
     ToastLength := TJToast.JavaClass.LENGTH_LONG;

   TJToast.JavaClass.makeText(SharedActivityContext, StrToJCharSequence(AMsg), ToastLength).show;
   Application.ProcessMessages;
  {$EndIf}
end;

procedure TForm1.FormDestroy(Sender: TObject);
begin
  FE1Printer.Free;
  FE1Lib.Free;
  FTexto.Free;
end;

procedure TForm1.ExibirErroImpressaoE1(const MsgErro: string);
begin
  Toast(MsgErro, False);
end;

procedure TForm1.FormCreate(Sender: TObject);
var
  N : TACBrPosPrinterModelo;
begin
  FTexto := TStringList.Create;

  tbcPrincipal.ActiveTab   := tbiMain;
  tbcPrincipal.TabPosition := TTabPosition.None;

  tbcImpCodImg.ActiveTab   := tbiTexto;
  tbcImpCodImg.TabPosition := TTabPosition.None;

  SelecionarBotao(mdiCodBarra);

  FE1Printer := TACBrPosPrinterElginE1Service.Create(ACBrPosPrinter1);
  FE1Lib     := TACBrPosPrinterElginE1Lib.Create(ACBrPosPrinter1);

  {$IFDEF ANDROID}
    FE1Printer.Modelo          := TElginE1Printers.prnSmartPOS; // TElginE1Printers.prnM8
    FE1Printer.OnErroImpressao := ExibirErroImpressaoE1;

    FE1Lib.Modelo := TElginE1LibPrinters.prnM8;
  {$ENDIF}

  //Criando Classes de Impressoras Externas
  CarregarModelosExternos;

  lytBtnImp.Enabled     := False;
  lytBkCodBarra.Enabled := False;

  TrocarFoto(Sender);
end;

procedure TForm1.CarregarModelosExternos;
var
  P : TACBrPosPaginaCodigo;
begin
  cbxModelo.Items.Clear;
  cbxModelo.Items.Add('Elgin E1 Lib');
  cbxModelo.ItemIndex    := 0;

  cbxPagCodigo.Items.Clear;
  for P := Low(TACBrPosPaginaCodigo) to High(TACBrPosPaginaCodigo) do
    cbxPagCodigo.Items.Add(GetEnumName(TypeInfo(TACBrPosPaginaCodigo), Integer(P)));

  cbxPagCodigo.ItemIndex := 5;
end;

procedure TForm1.cbTipoCodigoBarrasChange(Sender: TObject);
begin
  case cbTipoCodigoBarras.ItemIndex of
    0 : edtCodigo.Text := '40170725';
    1 : edtCodigo.Text := '0123456789012';
    2 : edtCodigo.Text := 'ADRIANO SANTOS TREINAMENTOS';
    3 : edtCodigo.Text := '12345678901';
    4 : edtCodigo.Text := '01234565';
    5 : edtCodigo.Text := 'ABCDE12345';
    6 : edtCodigo.Text := '05012345678900';
    7 : edtCodigo.Text := 'A123456789012345A';
    8 : edtCodigo.Text := 'ABC123abc';
    9 : edtCodigo.Text := 'CODE_128';
  end;
end;

procedure TForm1.ConfigurarACBrPosPrinter;
begin
  ACBrPosPrinter1.ModeloExterno := fE1Lib;

  if Assigned(cbxPagCodigo.Selected) then
    ACBrPosPrinter1.PaginaDeCodigo := TACBrPosPaginaCodigo(cbxPagCodigo.ItemIndex);

  ACBrPosPrinter1.ColunasFonteNormal  := Trunc(seColunas.Value);
  ACBrPosPrinter1.EspacoEntreLinhas   := Trunc(seEspLinhas.Value);
  ACBrPosPrinter1.LinhasEntreCupons   := Trunc(seLinhasPular.Value);
  ACBrPosPrinter1.ConfigLogo.KeyCode1 := 1;
  ACBrPosPrinter1.ConfigLogo.KeyCode2 := 0;
  ACBrPosPrinter1.ControlePorta       := True;
end;

procedure TForm1.FormActivate(Sender: TObject);
begin
  VKAutoShowMode   := TVKAutoShowMode.Never;
  FIndexCampoAtual := 1;
end;

procedure TForm1.FormDeactivate(Sender: TObject);
begin
  VKAutoShowMode := TVKAutoShowMode.Always;
end;

procedure TForm1.FormKeyDown(Sender: TObject; var Key: Word; var KeyChar: Char;
    Shift: TShiftState);
begin
  if Key = vkReturn then
     Next();
end;

procedure TForm1.Next;
begin
   Inc(FIndexCampoAtual);
   if FIndexCampoAtual > 10 then
       FIndexCampoAtual := 1;
   TEdit(FindComponent('edtCodBarra_' + inttostr(FIndexCampoAtual))).SetFocus;
end;

procedure TForm1.lytBtnTextoClick(Sender: TObject);
begin
  MudarAba(tbiTexto, Sender);
  SelecionarBotao(mdiTexto);
end;

procedure TForm1.lytBtnImagemClick(Sender: TObject);
begin
  MudarAba(tbiImagem, Sender);
  SelecionarBotao(mdiImagem);
end;

procedure TForm1.lytBtnCodBarraClick(Sender: TObject);
begin
  MudarAba(tbiCodBarraImp, Sender);
  SelecionarBotao(mdiCodBarra);
end;

procedure TForm1.lytCodBarraClick(Sender: TObject);
begin
  MudarAba(tbiCodBarraLer, Sender);
end;

procedure TForm1.lytConfigClick(Sender: TObject);
begin
  MudarAba(tbiConfig, Sender);
end;

procedure TForm1.lytImpressoraClick(Sender: TObject);
begin
  MudarAba(tbiImpressora, Sender);
end;

procedure TForm1.lytSobreClick(Sender: TObject);
begin
  MudarAba(tbiAbout, Sender);
end;

procedure TForm1.MudarAba(ATabItem: TTabItem; Sender: TObject);
begin
  actMudarAba.Tab := ATabItem;
  actMudarAba.ExecuteTarget(Sender);
end;

procedure TForm1.speBkImpToMainClick(Sender: TObject);
begin
  MudarAba(tbiMain, Sender);
end;

procedure TForm1.speToolConfigClick(Sender: TObject);
begin
  MudarAba(tbiMain, Sender);
end;

procedure TForm1.speBtnBackCodToMainClick(Sender: TObject);
begin
  MudarAba(tbiMain, Sender);
end;

procedure TForm1.TrocarFoto(Sender: TObject);
var
  LArquivo : string;
  LDir      : string;
begin
  LDir := TPath.GetDocumentsPath;

  if rdLogo1.IsChecked then
  begin
    LArquivo := 'LogoEmAlta.bmp';
    imgLogo.Bitmap.LoadFromFile(TPath.Combine(LDir, LArquivo));
    FArquivo := TPath.Combine(LDir, LArquivo);
  end
  else if rdLogo2.IsChecked then
  begin
    LArquivo := 'LogoEmAlta_Azul.bmp';
    imgLogo.Bitmap.LoadFromFile(TPath.Combine(LDir, LArquivo));
    FArquivo := TPath.Combine(LDir, LArquivo);
  end;
end;

procedure TForm1.SelecionarBotao(AModoImpressao: TModoImpressao);
begin
  case AModoImpressao of
    mdiTexto :
      begin
        recBtnTexto.Stroke.Color    := TAlphaColorRec.Blue;
        recBtnCodBarra.Stroke.Color := TAlphaColorRec.Black;
        recBtnImage.Stroke.Color    := TAlphaColorRec.Black;
      end;
    mdiCodBarra :
      begin
        recBtnTexto.Stroke.Color    := TAlphaColorRec.Black;
        recBtnCodBarra.Stroke.Color := TAlphaColorRec.Blue;
        recBtnImage.Stroke.Color    := TAlphaColorRec.Black;
      end;
    mdiImagem :
      begin
        recBtnTexto.Stroke.Color    := TAlphaColorRec.Black;
        recBtnCodBarra.Stroke.Color := TAlphaColorRec.Black;
        recBtnImage.Stroke.Color    := TAlphaColorRec.Blue;
      end;
  end;
end;

procedure TForm1.speAtivarImpressoraClick(Sender: TObject);
begin
  try
    if (cbxPagCodigo.ItemIndex < 0) or (cbxModelo.ItemIndex < 0) then
    begin
      ShowMessage('Modelo de impressora e/ou página de código não selecionada!');
      exit;
    end;

    ConfigurarACBrPosPrinter;
    ACBrPosPrinter1.Ativar;
    lytBtnImp.Enabled     := True;
    lytBkCodBarra.Enabled := True;
    ShowMessage('Impressora Ativada com sucesso!');
  except on E:Exception do
    begin
      lytBtnImp.Enabled      := False;
      lytBtnCodBarra.Enabled := False;
      ShowMessage(E.Message);
    end;
  end;
end;

procedure TForm1.speBtnImpTextoClick(Sender: TObject);
begin
  FTexto.Clear;
  FTexto.Add('</zera>');

  if rdEsquerda.IsChecked then
    FTexto.Add('</ae>')
  else if rdCentro.IsChecked then
    FTexto.Add('</ce>')
  else if rdDireita.IsChecked then
    FTexto.Add('</ad>');

  if swtNegrito.IsChecked then
    FTexto.Add(cTagLigaNegrito);

  if swtSublinhado.IsChecked then
    FTexto.Add(cTagLigaSublinhado);

  case cbFontFamily.ItemIndex of
    0: FTexto.Add(cTagFonteNormal);
    1: FTexto.Add(cTagFonteA);
    2: FTexto.Add(cTagFonteB);
  end;

  FTexto.Add(edtMensagem.Text);

  if swtNegrito.IsChecked then
    FTexto.Add(cTagDesligaNegrito);

  if swtSublinhado.IsChecked then
    FTexto.Add(cTagDesligaSublinhado);

  ACBrPosPrinter1.PularLinhas(10);

  if swtCortarPapel.IsChecked then
    FTexto.Add('</corte_total>');

  ACBrPosPrinter1.Buffer.Text := FTexto.Text;
  ACBrPosPrinter1.Imprimir();
end;

procedure TForm1.speBtnImpCodBarraClick(Sender: TObject);
begin
  FTexto.Clear;

  FTexto.Add('</zera>');
  FTexto.Add('<barra_mostrar>1</barra_mostrar>');
  FTexto.Add('<barra_largura>' + cbWidthCodigoBarras.Items[cbWidthCodigoBarras.ItemIndex] + '</barra_largura>');
  FTexto.Add('<barra_altura>' + cbHeightCodigoBarras.Items[cbHeightCodigoBarras.ItemIndex] + '</barra_altura>');

  if rdEsquerda.IsChecked then
    FTexto.Add('</ae>')
  else if rdCentro.IsChecked then
    FTexto.Add('</ce>')
  else if rdDireita.IsChecked then
    FTexto.Add('</ad>');

  case cbTipoCodigoBarras.ItemIndex of
    0 :
      begin
        //EAN8
        FTexto.Add('EAN 8: 40170725');
        FTexto.Add('<ean8>40170725</ean8>');
        edtCodigo.Text := '40170725';
      end;
    1 :
      begin
        //EAN13
        FTexto.Add('EAN13: 123456789012');
        FTexto.Add('<ean13>123456789012</ean13>');
        edtCodigo.Text := '0123456789012';
      end;
    2 :
      begin
        //QRCode
        FTexto.Add('QRCode: Adriano Santos');
        FTexto.Add('<qrcode_tipo>2</qrcode_tipo>');
        FTexto.Add('<qrcode_largura>' + ACBrPosPrinter1.ConfigQRCode.LarguraModulo.ToString + '</qrcode_largura>');
        FTexto.Add('<qrcode_error>' + IntToStr(ACBrPosPrinter1.ConfigQRCode.ErrorLevel) + '</qrcode_error>');
        FTexto.Add('<qrcode>ADRIANO SANTOS TREINAMENTOS</qrcode>');
        FTexto.Add('</ce>');
      end;
    3 :
      begin
        //UPC-A
        FTexto.Add('UPCA: 12345678901');
        FTexto.Add('<upca>12345678901</upca>');
        edtCodigo.Text :=  '12345678901';
      end;
    4 :
      begin
        //UPC-E
        FTexto.Add('UPCE: 01234565');
        FTexto.Add('<upce>01234565</upce>');
        edtCodigo.Text :=  '01234565';
      end;
    5 :
      begin
        //CODE 39
        FTexto.Add('CODE39: ABCDE12345');
        FTexto.Add('<code39>ABCDE12345</code39>');
        edtCodigo.Text :=  'ABCDE12345';
      end;
    6 :
      begin
        //ITF
        FTexto.Add('INT25: 05012345678900');
        FTexto.Add('<inter>05012345678900</inter>');
        edtCodigo.Text :=  '05012345678900';
      end;
    7 :
      begin
        //CODE BAR
        FTexto.Add('CODABAR: A123456789012345A');
        FTexto.Add('<codabar>A123456789012345A</codabar>');
        edtCodigo.Text :=  'A123456789012345A';
      end;
    8 :
      begin
        //CODE 93
        FTexto.Add('CODE93: ABC123abc');
        FTexto.Add('<code93>ABC123abc</code93>');
        edtCodigo.Text :=  'ABC123abc';
      end;
    9 :
      begin
        FTexto.Add('<c>code128a: 123456ABCDE</c>');
        FTexto.Add('<code128a>123456ABCDE</code128a>');

        FTexto.Add('<c>CODE128B: 123456ABCDE</c>');
        FTexto.Add('<code128B>123456ABCDE</code128B>');

        FTexto.Add('<c>CODE128C: 123456ABCDE</c>');
        FTexto.Add('<code128c>123456ABCDE</code128c>');

        edtCodigo.Text :=  'CODE_128';
      end;
  end;

  FTexto.Add('</pular_linhas>');
  FTexto.Add('</corte_total>');

  ACBrPosPrinter1.Buffer.Text := FTexto.Text;
  ACBrPosPrinter1.Imprimir;
end;

procedure TForm1.speImpTipoCodBarraClick(Sender: TObject);
begin
  FTexto.Clear;

  FTexto.Add('</zera>');
  FTexto.Add('</linha_dupla>');
  FTexto.Add('FONTE NORMAL: '+IntToStr(ACBrPosPrinter1.ColunasFonteNormal)+' Colunas');
  FTexto.Add(LeftStr('....+....1....+....2....+....3....+....4....+....5....+....6....+....7....+....8', ACBrPosPrinter1.ColunasFonteNormal));
  FTexto.Add('<e>EXPANDIDO: '+IntToStr(ACBrPosPrinter1.ColunasFonteExpandida)+' Colunas');
  FTexto.Add(LeftStr('....+....1....+....2....+....3....+....4....+....5....+....6....+....7....+....8', ACBrPosPrinter1.ColunasFonteExpandida));
  FTexto.Add('</e><c>CONDENSADO: '+IntToStr(ACBrPosPrinter1.ColunasFonteCondensada)+' Colunas');
  FTexto.Add(LeftStr('....+....1....+....2....+....3....+....4....+....5....+....6....+....7....+....8', ACBrPosPrinter1.ColunasFonteCondensada));
  FTexto.Add('</c><n>FONTE NEGRITO</N>');
  FTexto.Add('<in>FONTE INVERTIDA');
  FTexto.Add('</in><S>FONTE SUBLINHADA</s>');
  FTexto.Add('<i>FONTE ITALICO</i>');
  FTexto.Add('FONTE NORMAL');
  FTexto.Add('</linha_simples>');
  FTexto.Add('<n>LIGA NEGRITO');
  FTexto.Add('<i>LIGA ITALICO');
  FTexto.Add('<S>LIGA SUBLINHADA');
  FTexto.Add('<c>LIGA CONDENSADA');
  FTexto.Add('<e>LIGA EXPANDIDA');
  FTexto.Add('<a>LIGA ALTURA DUPLA');
  FTexto.Add('</fn>FONTE NORMAL');
  FTexto.Add('</linha_simples>');
  FTexto.Add('<e><n>NEGRITO E EXPANDIDA</n></e>');
  FTexto.Add('<c><n>NEGRITO E CONDENSADA</n></c>');
  FTexto.Add('<e><a>EXPANDIDA E ALT.DUPLA</a></e>');
  FTexto.Add('</fn>FONTE NORMAL');
  FTexto.Add('</linha_simples>');
  FTexto.Add('</FB>FONTE TIPO B');
  FTexto.Add('<n>FONTE NEGRITO</N>');
  FTexto.Add('<e>FONTE EXPANDIDA</e>');
  FTexto.Add('<a>FONTE ALT.DUPLA</a>');
  FTexto.Add('<in>FONTE INVERTIDA');
  FTexto.Add('</in><S>FONTE SUBLINHADA</s>');
  FTexto.Add('<i>FONTE ITALICO</i>');
  FTexto.Add('</FA>FONTE TIPO A');
  FTexto.Add('</FN>FONTE NORMAL');

  if swtCortarPapel.IsChecked then
    FTexto.Add('</corte_total>');

  ACBrPosPrinter1.Buffer.Text := FTexto.Text;
  ACBrPosPrinter1.Imprimir();
end;

procedure TForm1.speBtnImpImagemClick(Sender: TObject);
begin
  FTexto.Clear;

  if rdEsquerda.IsChecked then
    FTexto.Add('</ae>')
  else if rdCentro.IsChecked then
    FTexto.Add('</ce>')
  else if rdDireita.IsChecked then
    FTexto.Add('</ad>');

  FTexto.Add('</zera>');
  FTexto.Add('<bmp>');
  FTexto.Add(FArquivo);
  FTexto.Add('</bmp>');
  FTexto.Add('</linha_simples>');

  if swtCortarPapel.IsChecked then
    FTexto.Add('</corte_total>');

  ACBrPosPrinter1.Buffer.Text := FTexto.Text;
  ACBrPosPrinter1.Imprimir;
end;

procedure TForm1.SpeedButton6Click(Sender: TObject);
var
  Status : TACBrPosPrinterStatus;
  I      : TACBrPosTipoStatus;
  AStr: String;
begin
  Status := ACBrPosPrinter1.LerStatusImpressora;

  if Status = [] then
    ShowMessage('Nennhum Erro encontrado')
  else
  begin
    AStr := '';
    for i := Low(TACBrPosTipoStatus) to High(TACBrPosTipoStatus) do
    begin
      if i in Status then
        AStr := AStr + GetEnumName(TypeInfo(TACBrPosTipoStatus), integer(i) )+ ', ';
    end;

    ShowMessage(AStr);
  end;

end;

procedure TForm1.speBtnExemplosQRCodeClick(Sender: TObject);
begin
  FTexto.Add('</zera>');
  FTexto.Add('</linha_dupla>');
  FTexto.Add('<qrcode_tipo>'+IntToStr(ACBrPosPrinter1.ConfigQRCode.Tipo)+'</qrcode_tipo>');
  FTexto.Add('<qrcode_largura>'+IntToStr(ACBrPosPrinter1.ConfigQRCode.LarguraModulo)+'</qrcode_largura>');
  FTexto.Add('<qrcode_error>'+IntToStr(ACBrPosPrinter1.ConfigQRCode.ErrorLevel)+'</qrcode_error>');
  FTexto.Add('<qrcode>http://projetoacbr.com.br</qrcode>');
  FTexto.Add('</ce>');
  FTexto.Add('<qrcode>http://www.projetoacbr.com.br/forum/index.php?/page/SAC/sobre_o_sac.html</qrcode>');
  FTexto.Add('</ad>');
  FTexto.Add('<qrcode>http://www.projetoacbr.com.br/forum/index.php?/page/SAC/questoes_importantes.html</qrcode>');
  FTexto.Add('</ce>');
  FTexto.Add('Exemplo de QRCode para NFCe');
  FTexto.Add('<qrcode_error>0</qrcode_error><qrcode>https://www.homologacao.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx?'+
           'chNFe=35150805481336000137650220000000711000001960&nVersao=100&tpAmb=2&dhEmi=323031352D30382D31395432323A33333A32352D30333A3030&vNF=3.00&'+
           'vICMS=0.12&digVal=776967396F2B665861706673396878776E64594C396F61654C35493D&cIdToken=000001&cHashQRCode=9BD312D558823E1EC68CEDB338A39B6150B0480E</qrcode>');
  FTexto.Add('Exemplo de QRCode para SAT');
  FTexto.Add('<qrcode_error>0</qrcode_error><qrcode>35150811111111111111591234567890001672668828|20150820201736|118.72|05481336000137|'+
           'TCbeD81ePUpMvso4VjFqRTvs4ovqmR1ZG3bwSCumzHtW8bbMedVJjVnww103v3LxKfgckAyuizcR/9pXaKay6M4Gu8kyDef+6VH5qONIZV1cB+mFfXiaCgeZ'+
           'ALuRDCH1PRyb6hoBeRUkUk6lOdXSczRW9Y83GJMXdOFroEbzFmpf4+WOhe2BZ3mEdXKKGMfl1EB0JWnAThkGT+1Er9Jh/3En5YI4hgQP3NC2BiJVJ6oCEbKb'+
           '85s5915DSZAw4qB/MlESWViDsDVYEnS/FQgA2kP2A9pR4+agdHmgWiz30MJYqX5Ng9XEYvvOMzl1Y6+7/frzsocOxfuQyFsnfJzogw==</qrcode>');
  FTexto.Add('</corte_total>');
  ACBrPosPrinter1.Buffer.Text := FTexto.Text;
  ACBrPosPrinter1.Imprimir();
end;

procedure TForm1.speBtnIniciarCapturaClick(Sender: TObject);
var
  I : Integer;
begin
 for I := 1 to 10 do
  begin
    if TEdit(FindComponent('edtCodBarra_' + inttostr(i))).Text = EmptyStr then
    begin
       TEdit(FindComponent('edtCodBarra_' + inttostr(i))).SetFocus;
       FIndexCampoAtual := I;
       break;
    end;
  end;
end;

procedure TForm1.speBtnLimparCodBarrasClick(Sender: TObject);
begin
  edtCodBarra_1.Text  := EmptyStr;
  edtCodBarra_2.Text  := EmptyStr;
  edtCodBarra_3.Text  := EmptyStr;
  edtCodBarra_4.Text  := EmptyStr;
  edtCodBarra_5.Text  := EmptyStr;
  edtCodBarra_6.Text  := EmptyStr;
  edtCodBarra_7.Text  := EmptyStr;
  edtCodBarra_8.Text  := EmptyStr;
  edtCodBarra_9.Text  := EmptyStr;
  edtCodBarra_10.Text := EmptyStr;
end;

procedure TForm1.speBtnBackAboutToMainClick(Sender: TObject);
begin
  MudarAba(tbiMain, Sender);
end;



end.
