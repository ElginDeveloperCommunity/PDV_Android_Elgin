unit Kioski;

interface
  uses
    Elgin.JNI.E1,
    Androidapi.Helpers,
    Androidapi.JNI.JavaTypes,
    Androidapi.JNI.App,
    FMX.Objects,
    System.IOUtils,
    SysUtils,
    Androidapi.JNI.GraphicsContentViewText,
    System.Classes;

  type
    KIOSK_CONFIG  = (BARRA_STATUS, BARRA_NAVEGACAO, BOTAO_POWER);
    TKioski = class
    private
      constructor Create(context: JContext);

    public
      procedure resetKioskiMode;
      procedure executeKioskiOperacao(modo: KIOSK_CONFIG; enable: boolean);
      procedure toggleStatus(enable: boolean);
      procedure toggleNavegacao(enable: boolean);
      procedure togglePower(enable: boolean);
      procedure fullKioski(enable: boolean);
    end;

var
  instance_kioski: TKioski;
  kiosk: JCore_Utils;
implementation

{ TPix4 }

uses ToastMessage;


constructor TKioski.Create(context: JContext);
begin
  kiosk:= TJCore_Utils.JavaClass.init(context);
end;



procedure TKioski.executeKioskiOperacao(modo: KIOSK_CONFIG; enable: boolean);
begin
  case modo of
    BARRA_STATUS:
    begin
      toggleStatus(enable);
    end;

    BARRA_NAVEGACAO:
    begin
      toggleNavegacao(enable);
    end;

    BOTAO_POWER:
    begin
      togglePower(enable);
    end;
  end;
end;

procedure TKioski.fullKioski(enable: boolean);
begin
  executeKioskiOperacao(BARRA_STATUS, enable);
  executeKioskiOperacao(BARRA_NAVEGACAO, enable);
  executeKioskiOperacao(BOTAO_POWER, enable);
end;

procedure TKioski.resetKioskiMode;
begin
  executeKioskiOperacao(BARRA_STATUS, True);
  executeKioskiOperacao(BARRA_NAVEGACAO, True);
  executeKioskiOperacao(BOTAO_POWER, True);
end;

procedure TKioski.toggleNavegacao(enable: boolean);
begin

  if enable = True then kiosk.habilitaBarraNavegacao()
  else kiosk.desabilitaBarraNavegacao();

  end;

procedure TKioski.togglePower(enable: boolean);
begin

  if enable = True then kiosk.habilitaBotaoPower()
  else kiosk.desabilitaBotaoPower();

end;

procedure TKioski.toggleStatus(enable: boolean);
begin

  if enable = True then kiosk.habilitaBarraStatus()
  else kiosk.desabilitaBarraStatus();

end;

initialization

 instance_kioski := TKioski.Create(TAndroidHelper.Context);

end.
