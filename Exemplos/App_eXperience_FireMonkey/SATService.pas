unit SATService;

interface

uses
  System.Android.Service;

  type

  TSATService = class
    ConexaoServico : TLocalServiceConnection;
    public
   procedure StartService;

  end;

var

 SATConection : TSATService;

implementation



{ TSATService }

procedure TSATService.StartService;
begin
   ConexaoServico := TLocalServiceConnection.Create;
   ConexaoServico.StartService('USBService');
   ConexaoServico.BindService('USBService');
end;

initialization

   SATConection := TSATService.Create;

end.
