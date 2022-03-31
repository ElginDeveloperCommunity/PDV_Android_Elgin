unit DialogForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs,
  FMX.Controls.Presentation, FMX.StdCtrls, FMX.Objects, FMX.Layouts, FMX.Effects;

type
  TFrmDialog = class(TForm)
    Rectangle1: TRectangle;
    lblTitulo: TLabel;
    lblTexto: TLabel;
    Layout1: TLayout;
    Rectangle2: TRectangle;
    Rectangle3: TRectangle;
    lblOk: TLabel;
    lblCancel: TLabel;
    LayDialog: TLayout;
    Rectangle4: TRectangle;
    Rectangle5: TRectangle;
    ShadowEffect1: TShadowEffect;
    procedure Rectangle2Click(Sender: TObject);
    procedure Rectangle3Click(Sender: TObject);
    procedure LayDialogClick(Sender: TObject);
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
  private
    FMainLayout: TLayout;
    ProcOk: TProc;
    { Private declarations }
  public
    Property MainLayout:TLayout Read FMainLayout Write FMainLayout;
    procedure MsgDialog(title, texto:string; aProdOk: TProc);
    { Public declarations }
  end;

var
  FrmDialog: TFrmDialog;

implementation

{$R *.fmx}

{ TForm1 }

procedure TFrmDialog.botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 0.7;
end;

procedure TFrmDialog.botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 1.0;
end;

procedure TFrmDialog.LayDialogClick(Sender: TObject);
begin
  LayDialog.Parent:= nil;
end;

procedure TFrmDialog.MsgDialog(title, texto: string; aProdOk: TProc);
begin

  ProcOk:= aProdOk;
  lblTitulo.Text:= title;
  lblTexto.Text:= texto;

  LayDialog.Parent:=FMainLayout;
  LayDialog.Align:= TAlignLayout.Contents;
end;

procedure TFrmDialog.Rectangle2Click(Sender: TObject);
begin
  LayDialog.Parent:= nil;
  ProcOk;
end;

procedure TFrmDialog.Rectangle3Click(Sender: TObject);
begin
  LayDialog.Parent:= nil;
end;

end.
