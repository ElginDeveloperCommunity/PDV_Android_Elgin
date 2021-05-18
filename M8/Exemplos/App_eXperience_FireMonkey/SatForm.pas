unit SatForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.ScrollBox,
  FMX.Memo, FMX.Objects, FMX.Edit, FMX.Layouts, FMX.Controls.Presentation,
  FMX.StdCtrls,  System.Permissions,Androidapi.JNI.App,
  Androidapi.JNI.OS,Androidapi.Helpers,
  SATService
  ;

type
  TfrmSAT = class(TForm)
    LayoutMain: TLayout;
    LayoutHeading: TLayout;
    Titulo: TLabel;
    Logo: TImage;
    LayoutContent: TLayout;
    GridPanelLayout1: TGridPanelLayout;
    LayoutLeft: TLayout;
    btnEnviarTransacao: TRectangle;
    Label11: TLabel;
    btnCancelarTransacao: TRectangle;
    Label12: TLabel;
    btnConfigurar: TRectangle;
    Label13: TLabel;
    LayoutRight: TLayout;
    LayoutFooter: TLayout;
    Rectangle1: TRectangle;
    Label3: TLabel;
    Memo1: TMemo;
    Layout1: TLayout;
    Label1: TLabel;
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
  procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
    procedure FormActivate(Sender: TObject);
  private
    { Private declarations }

  public
    { Public declarations }

  end;

var
  frmSAT: TfrmSAT;

implementation

{$R *.fmx}

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

procedure TfrmSAT.FormActivate(Sender: TObject);
begin

  //SATConection.StartService;

  // PermissionsService.RequestPermissions(['com.android.example.USB_PERMISSION'],
  //  procedure(const APermissions: TArray<string>; const AGrantResults: TArray<TPermissionStatus>)
  //  begin
  //    if (Length(AGrantResults) = 1)
  //    and (AGrantResults[0] = TPermissionStatus.Granted) then
       //SatConnection := TSAT.Create
  //    else
  //      begin
  //        ShowMessage('Permissões para acesso ao USB não concedida!');
  //      end;
  //  end)

end;

end.
