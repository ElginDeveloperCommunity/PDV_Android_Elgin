unit MainForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs,
  FMX.Controls.Presentation, FMX.StdCtrls, FMX.Layouts,
  FMX.Objects,TefForm,SatForm, ImpressoraForm, BarcodeForm, ShipayForm,
  BalancaForm;

type
  TfrmMain = class(TForm)
    Layout1: TLayout;
    Image1: TImage;
    GridPanelLayout1: TGridPanelLayout;
    rectMenuImpressora: TRectangle;
    icon: TImage;
    text: TLabel;
    rectMenuBarCode: TRectangle;
    Image2: TImage;
    Label2: TLabel;
    rectMenuTEF: TRectangle;
    Image3: TImage;
    Label3: TLabel;
    rectMenuSAT: TRectangle;
    Image4: TImage;
    Label4: TLabel;
    Layout2: TLayout;
    Label1: TLabel;
    recBalanca: TRectangle;
    Image5: TImage;
    Label5: TLabel;
    redCarteiraDigital: TRectangle;
    Image6: TImage;
    Label6: TLabel;
    LayoutGP_01: TLayout;
    LayoutGP_02: TLayout;
    LayoutGP_03: TLayout;
    LayoutGP_04: TLayout;
    GridPanelLayoutGP_2: TGridPanelLayout;
    GridPanelLayout2: TGridPanelLayout;
    recBridge: TRectangle;
    Image7: TImage;
    BRIDGE: TLabel;
    GridPanelLayout4: TGridPanelLayout;
    procedure rectMenuTEFClick(Sender: TObject);
    procedure rectMenuSATClick(Sender: TObject);
    procedure rectMenuShipayClick(Sender: TObject);
    procedure rectMenuImpressoraClick(Sender: TObject);
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure rectMenuBarCodeClick(Sender: TObject);
    procedure recBalancaClick(Sender: TObject);
    procedure recBridgeClick(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  frmMain: TfrmMain;

implementation

{$R *.fmx}

uses BridgeForm;
{$R *.LgXhdpiTb.fmx ANDROID}
{$R *.XLgXhdpiTb.fmx ANDROID}



procedure TfrmMain.recBalancaClick(Sender: TObject);
begin
  frmBalanca.Show;
end;

procedure TfrmMain.recBridgeClick(Sender: TObject);
begin
  FrmBridge.Show;
end;

procedure TfrmMain.rectMenuBarCodeClick(Sender: TObject);
begin
   frmBarcode.Show;
end;

procedure TfrmMain.rectMenuImpressoraClick(Sender: TObject);
begin
  frmImpressora.Show;
end;

procedure TfrmMain.rectMenuShipayClick(Sender: TObject);
begin
  frmShipay.Show;
end;

procedure TfrmMain.rectMenuSATClick(Sender: TObject);
begin
  frmSAT.Show;
end;

procedure TfrmMain.rectMenuTEFClick(Sender: TObject);
begin
   frmTEF.Show;
end;

procedure TfrmMain.botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 0.7;
end;

procedure TfrmMain.botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 1.0;
end;

end.
