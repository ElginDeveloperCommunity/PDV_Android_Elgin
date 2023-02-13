unit KioskiForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.Layouts,
  FMX.Objects, FMX.Controls.Presentation, FMX.StdCtrls,FMX.Platform;

type
  KIOSK_CONFIG  = (BARRA_STATUS, BARRA_NAVEGACAO, BOTAO_POWER);
  TFrmKioski = class(TForm)
    LayoutMain: TLayout;
    LayoutHeading: TLayout;
    Titulo: TLabel;
    Logo: TImage;
    LayoutContent: TLayout;
    LayoutFooter: TLayout;
    Label1: TLabel;
    GridPanelLayout1: TGridPanelLayout;
    Layout1: TLayout;
    recCarregar: TRectangle;
    Label33: TLabel;
    Rectangle1: TRectangle;
    Label2: TLabel;
    Layout2: TLayout;
    Layout3: TLayout;
    Layout4: TLayout;
    Label3: TLabel;
    Label4: TLabel;
    Label5: TLabel;
    switch_status: TSwitch;
    switch_power: TSwitch;
    switch_navegacao: TSwitch;
    procedure FormActivate(Sender: TObject);
    procedure switch_navegacaoClick(Sender: TObject);
    procedure switch_statusClick(Sender: TObject);
    procedure switch_powerClick(Sender: TObject);
    procedure Rectangle1Click(Sender: TObject);
    procedure recCarregarClick(Sender: TObject);
  private
    { Private declarations }
  public
    function AppEvent (AAppEvent: TApplicationEvent; AContext: TObject) : Boolean;
    { Public declarations }
  end;

var
  FrmKioski: TFrmKioski;

implementation

{$R *.fmx}

uses Kioski;

function TFrmKioski.AppEvent(AAppEvent: TApplicationEvent;
  AContext: TObject): Boolean;
begin
//  if AAppEvent = TApplicationEvent.aeEnteredBackground then begin
//    switch_navegacao.IsChecked:= True;
//  end;
//  Result := True;
end;


procedure TFrmKioski.FormActivate(Sender: TObject);
begin
  instance_kioski.resetKioskiMode;
  switch_navegacao.IsChecked:= True;
  switch_status.IsChecked:= True;
  switch_power.IsChecked:= True;
end;

procedure TFrmKioski.recCarregarClick(Sender: TObject);
begin
  instance_kioski.fullKioski(True);
  switch_navegacao.IsChecked:= True;
  switch_status.IsChecked:= True;
  switch_power.IsChecked:= True;
  close;
end;

procedure TFrmKioski.Rectangle1Click(Sender: TObject);
begin
  instance_kioski.fullKioski(False);
  switch_navegacao.IsChecked:= False;
  switch_status.IsChecked:= False;
  switch_power.IsChecked:= False;
end;

procedure TFrmKioski.switch_navegacaoClick(Sender: TObject);
begin
  if switch_navegacao.IsChecked = True then
  begin
    instance_kioski.toggleNavegacao(True);
    switch_navegacao.IsChecked:= True;
  end
  else
  begin
    instance_kioski.toggleNavegacao(False);
    switch_navegacao.IsChecked:= False;
  end;
end;

procedure TFrmKioski.switch_powerClick(Sender: TObject);
begin
  if switch_power.IsChecked = True then
  begin
    instance_kioski.togglePower(True);
    switch_power.IsChecked:= True;
  end
  else
  begin
    instance_kioski.togglePower(False);
    switch_power.IsChecked:= False;
  end;
end;

procedure TFrmKioski.switch_statusClick(Sender: TObject);
begin
  if switch_status.IsChecked = True then
  begin
    instance_kioski.toggleStatus(True);
    switch_status.IsChecked:= True;
  end
  else
  begin
    instance_kioski.toggleStatus(False);
    switch_status.IsChecked:= False;
    end
end;

end.
