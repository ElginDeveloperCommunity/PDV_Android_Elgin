unit frmDialogOpAdm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.Objects,
  FMX.Layouts, FMX.Controls.Presentation, FMX.StdCtrls, FMX.Effects;

type
  TForm1 = class(TForm)
    Layout1: TLayout;
    recOpacity: TRectangle;
    recLayout: TRectangle;
    ShadowEffect1: TShadowEffect;
    lblTitulo: TLabel;
    layoutBtn: TLayout;
    Layout2: TLayout;
    Rectangle1: TRectangle;
    Rectangle2: TRectangle;
    Label1: TLabel;
    Label2: TLabel;
  private
    function FMainLayout: TLayout;
    { Private declarations }
  public
    { Public declarations }
    Property MainLayout:TLayout Read FMainLayout Write FMainLayout;
  end;

var
  Form1: TForm1;

implementation

{$R *.fmx}

{ TForm1 }

function TForm1.EMainLayout: TLayout;
begin

end;

end.
