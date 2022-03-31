unit DialogConfigSenhaForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.Layouts,
  FMX.Objects, FMX.Effects, FMX.Controls.Presentation, FMX.StdCtrls,
  FMX.TabControl, FMX.Edit, System.Actions, FMX.ActnList;

type
  TfrmDialogConfigSenha = class(TForm)
    layoutMain: TLayout;
    recOpacity: TRectangle;
    recLayout: TRectangle;
    ShadowEffect1: TShadowEffect;
    lblTitulo: TLabel;
    NavConfigSenha: TTabControl;
    tabItens: TTabItem;
    tabSenha: TTabItem;
    Layout1: TLayout;
    recHabilitar: TRectangle;
    recDesabilitar: TRectangle;
    Label1: TLabel;
    Label2: TLabel;
    Layout2: TLayout;
    edtSenha: TEdit;
    recOk: TRectangle;
    lblOk: TLabel;
    GridPanelLayout1: TGridPanelLayout;
    ActionList1: TActionList;
    actItens: TChangeTabAction;
    actSenha: TChangeTabAction;
    procedure layoutMainClick(Sender: TObject);
    procedure recHabilitarClick(Sender: TObject);
    procedure recOkClick(Sender: TObject);
    procedure recDesabilitarClick(Sender: TObject);

    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
  private
    { Private declarations }
    FMainLayout: TLayout;
  public
    ProcHabilitar: TProc;
    ProcDesabilitar: TProc;
    { Public declarations }
    Property MainLayout:TLayout Read FMainLayout Write FMainLayout;
    procedure EscolherItem(aProcHabilitar, aProcDesabilitar: TProc);
  end;

var
  frmDialogConfigSenha: TfrmDialogConfigSenha;

implementation

{$R *.fmx}

procedure TfrmDialogConfigSenha.botaoEfeitoMouseDown(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 0.7;
end;

procedure TfrmDialogConfigSenha.botaoEfeitoMouseUp(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 1.0;
end;

procedure TfrmDialogConfigSenha.EscolherItem(aProcHabilitar, aProcDesabilitar: TProc);
begin
  ProcHabilitar  := aProcHabilitar;
  ProcDesabilitar:= aProcDesabilitar;

  layoutMain.Parent:= FMainLayout;
  layoutMain.Align:= TAlignLayout.Contents;
end;


procedure TfrmDialogConfigSenha.layoutMainClick(Sender: TObject);
begin
  actItens.Execute;
  layoutMain.Parent:= nil;
end;
procedure TfrmDialogConfigSenha.recDesabilitarClick(Sender: TObject);
begin
  layoutMain.Parent:= nil;
  ProcDesabilitar;
end;

procedure TfrmDialogConfigSenha.recHabilitarClick(Sender: TObject);
begin
  actSenha.Execute;
end;

procedure TfrmDialogConfigSenha.recOkClick(Sender: TObject);
begin
  if edtSenha.Text = '' then ShowMessage('Informe uma senha!!')
  else
  begin
    layoutMain.Parent:= nil;
    actItens.Execute;
    ProcHabilitar;
  end;
end;



end.
