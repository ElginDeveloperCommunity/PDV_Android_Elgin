unit DialogTimeoutForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.Layouts,
  FMX.Objects, FMX.Effects, FMX.Controls.Presentation, FMX.StdCtrls, FMX.Edit;

type
  TfrmDialogTimeout = class(TForm)
    layoutMain: TLayout;
    recOpacity: TRectangle;
    recLayout: TRectangle;
    ShadowEffect1: TShadowEffect;
    layoutPrincipal: TLayout;
    lblTitulo: TLabel;
    recOk: TRectangle;
    lblOk: TLabel;
    Layout2: TLayout;
    edtValor: TEdit;
    procedure recOkClick(Sender: TObject);
    procedure layoutMainClick(Sender: TObject);
  private
    FMainLayout: TLayout;
    { Private declarations }
  public
    ProcOp: TProc;
    ValorTimeout: string;
    { Public declarations }
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);

    Property MainLayout:TLayout Read FMainLayout Write FMainLayout;
    procedure AlterarValor(aProc: TProc);
  end;

var
  frmDialogTimeout: TfrmDialogTimeout;

implementation

{$R *.fmx}

{ TfrmDialogTimeout }

procedure TfrmDialogTimeout.AlterarValor(aProc: TProc);
begin
  ProcOp:= aProc;

  layoutMain.Parent:= FMainLayout;
  layoutMain.Align:= TAlignLayout.Contents;
end;

procedure TfrmDialogTimeout.botaoEfeitoMouseDown(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 0.7;
end;

procedure TfrmDialogTimeout.botaoEfeitoMouseUp(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 1.0;
end;

procedure TfrmDialogTimeout.layoutMainClick(Sender: TObject);
begin
  layoutMain.Parent:= nil;
end;

procedure TfrmDialogTimeout.recOkClick(Sender: TObject);
begin
  ValorTimeout := edtValor.Text;
  if ValorTimeout = '' then Showmessage('Informe um valor!')
  else
  begin
    edtValor.Text:= '';
    layoutMain.Parent:= nil;
    ProcOp;
  end;
end;

end.
