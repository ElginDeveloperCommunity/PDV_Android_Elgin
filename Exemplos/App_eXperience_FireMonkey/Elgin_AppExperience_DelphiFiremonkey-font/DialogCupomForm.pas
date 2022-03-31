unit DialogCupomForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.Layouts,
  FMX.Objects, FMX.Effects, FMX.Controls.Presentation, FMX.StdCtrls, Bridge.Types;

type
  TfrmDialogCupom = class(TForm)
    layoutMain: TLayout;
    recOpacity: TRectangle;
    recLayout: TRectangle;
    layoutPrincipal: TLayout;
    ShadowEffect1: TShadowEffect;
    lblTitulo: TLabel;
    GridPanelLayout1: TGridPanelLayout;
    lblNFCe: TLabel;
    lblSat: TLabel;
    lblSatCancel: TLabel;
    procedure lblNFCeClick(Sender: TObject);
    procedure lblSatClick(Sender: TObject);
    procedure lblSatCancelClick(Sender: TObject);
    procedure layoutMainClick(Sender: TObject);
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
  private
    { Private declarations }
    FMainLayout: TLayout;
  public
    Cupom: CUPOM_TYPE;
    ProcOp: TProc;
    { Public declarations }

    Property MainLayout:TLayout Read FMainLayout Write FMainLayout;
    procedure EscolherCupom(aProc: TProc);
  end;

var
  frmDialogCupom: TfrmDialogCupom;

implementation

{$R *.fmx}

{ TfrmDialogCupom }

procedure TfrmDialogCupom.botaoEfeitoMouseDown(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 0.7;
end;

procedure TfrmDialogCupom.botaoEfeitoMouseUp(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 1.0;
end;

procedure TfrmDialogCupom.EscolherCupom(aProc: TProc);
begin
  ProcOp:= aProc;

  layoutMain.Parent:= FMainLayout;
  layoutMain.Align:= TAlignLayout.Contents;
end;

procedure TfrmDialogCupom.layoutMainClick(Sender: TObject);
begin
  layoutMain.Parent:= nil;
end;

procedure TfrmDialogCupom.lblNFCeClick(Sender: TObject);
begin
  Cupom := NFCE;
  layoutMain.Parent:= nil;
  ProcOp;
end;

procedure TfrmDialogCupom.lblSatCancelClick(Sender: TObject);
begin
  Cupom := SATCANCEL;
  layoutMain.Parent:= nil;
  ProcOp;
end;

procedure TfrmDialogCupom.lblSatClick(Sender: TObject);
begin
  Cupom := SAT;
  layoutMain.Parent:= nil;
  ProcOp;
end;

end.
