unit DialogOpAdmForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.Objects,
  FMX.Layouts, FMX.Controls.Presentation, FMX.StdCtrls, FMX.Effects, Bridge.Types;

type
    TfrmDialogOpAdm = class(TForm)
      layoutMain: TLayout;
      recOpacity: TRectangle;
      recLayout: TRectangle;
      ShadowEffect1: TShadowEffect;
      lblTitulo: TLabel;
      layoutPrincipal: TLayout;
      GridPanelLayout1: TGridPanelLayout;
      lblOpAdministrativa: TLabel;
      lblOpInstalacao: TLabel;
      lblOpConfiguracao: TLabel;
      lblOpManutencao: TLabel;
      lblTesteComunicacao: TLabel;
      lblReimpressao: TLabel;
      procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
      procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
      procedure lblOpAdministrativaClick(Sender: TObject);
      procedure lblOpInstalacaoClick(Sender: TObject);
      procedure lblOpConfiguracaoClick(Sender: TObject);
      procedure lblOpManutencaoClick(Sender: TObject);
      procedure lblTesteComunicacaoClick(Sender: TObject);
      procedure lblReimpressaoClick(Sender: TObject);
      procedure layoutMainClick(Sender: TObject);
    private
      FMainLayout: TLayout;
      { Private declarations }
    public
      { Public declarations }
      Op: FORMA_OPERACAO;
      ProcOp: TProc;
      Property MainLayout:TLayout Read FMainLayout Write FMainLayout;
      procedure EscolherOperacao(aProc: TProc);
    end;

var
  frmDialogOpAdm: TfrmDialogOpAdm;

implementation

{$R *.fmx}

{ TForm1 }


{ TfrmDialogOpAdm }



procedure TfrmDialogOpAdm.botaoEfeitoMouseDown(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 0.7;
end;

procedure TfrmDialogOpAdm.botaoEfeitoMouseUp(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 1.0;
end;

procedure TfrmDialogOpAdm.EscolherOperacao(aProc: TProc);
begin
  ProcOp:= aProc;

  layoutMain.Parent:= FMainLayout;
  layoutMain.Align:= TAlignLayout.Contents;
end;

procedure TfrmDialogOpAdm.layoutMainClick(Sender: TObject);
begin
  layoutMain.Parent:= nil;
end;

procedure TfrmDialogOpAdm.lblOpAdministrativaClick(Sender: TObject);
begin
  Op:= ADMINISTRACAO;
  layoutMain.Parent:= nil;
  ProcOp;
end;

procedure TfrmDialogOpAdm.lblOpConfiguracaoClick(Sender: TObject);
begin
  Op:= CONFIGURACAO;
  layoutMain.Parent:= nil;
  ProcOp;
end;

procedure TfrmDialogOpAdm.lblOpInstalacaoClick(Sender: TObject);
begin
  Op:= INSTALACAO;
  layoutMain.Parent:= nil;
  ProcOp;
end;

procedure TfrmDialogOpAdm.lblOpManutencaoClick(Sender: TObject);
begin
  Op:= MANUTENCAO;
  layoutMain.Parent:= nil;
  ProcOp;
end;

procedure TfrmDialogOpAdm.lblReimpressaoClick(Sender: TObject);
begin
  Op:= COMPROVANTE;
  layoutMain.Parent:= nil;
  ProcOp;
end;

procedure TfrmDialogOpAdm.lblTesteComunicacaoClick(Sender: TObject);
begin
  Op:= COMUNICACAO;
  layoutMain.Parent:= nil;
  ProcOp;
end;

end.
