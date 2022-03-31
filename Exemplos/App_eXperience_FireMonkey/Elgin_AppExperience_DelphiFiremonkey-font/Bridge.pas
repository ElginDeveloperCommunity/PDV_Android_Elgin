unit Bridge;

interface

uses
  Elgin.JNI.E1,
  Androidapi.JNI.GraphicsContentViewText,
  Androidapi.Helpers,
  Androidapi.JNI.JavaTypes,
  System.Classes, System.IOUtils, System.SysUtils,
  FMX.Dialogs;

type
  TBridge = class
    private
      ConfigFileInitializer : JConfigFileInitializer;
      { private declarations }
      function FileToString(arquivo : string): string;
    protected
      { protected declarations }
    public
      constructor Create(activity: JContext);
      function getServer: string;
      function ConsultarStatus: string;
      function ConsultarTimeout: string;
      function ConsultarUltimaTransacao(pdv: string): string;
      function AtualizarTimeout(seconds: integer): string;
      function IniciaVendaCredito(idTransacao, tipoFinanciamento, numeroParcelas: integer; pdv, valorTotal: string): string;
      function setServer(Ip: string; transacao, status: integer): string;
      function IniciaVendaDebito(idTransacao: integer; pdv,
        valorTotal: string): string;
      function IniciaCancelamentoVenda(idTransacao: integer; pdv, valorTotal,
        dataHora, nsu: string): string;
      function IniciaOperacaoAdministrativa(idTransacao, op: integer; pdv:string): string;
      function ImprimirCupomSat: string;
      function ImprimirCupomSatCancelamento(assQrCode: string): string;
      function ImprimirCupomNfce(csc: string; indexcsc: integer): string;
      function SetSenhaServer(senha: string; habilitada: boolean):string;
      function SetSenha(senha: string; habilitada: boolean):string;
      { public declarations }
      end;

var
  bridge_instance: TBridge;

implementation

constructor TBridge.Create(activity: JContext);
begin
   ConfigFileInitializer := TJConfigFileInitializer.Create;
   ConfigFileInitializer.create(activity);
end;

function TBridge.FileToString(arquivo: string): string;
var
  TextFile: TStringList;
begin

  arquivo := System.IOUtils.TPath.GetDocumentsPath + PathDelim + arquivo;
  TextFile := TStringList.Create;
  try
    try
      TextFile.LoadFromFile(arquivo);

      Result := TextFile.Text;

    finally
      FreeAndNil(TextFile);
    end
  except

    on E:Exception do ShowMessage('Não foi possível abrir o arquivo XML!');
  end;
end;

function TBridge.getServer:string;
begin
  Result:= JStringToString(TJBridge.JavaClass.GetServer());
end;

function TBridge.setServer(Ip:string; transacao, status:integer):string;
begin
  Result:= JStringToString(TJBridge.JavaClass.SetServer(StringToJString(Ip),
                                                        transacao,
                                                        status));
end;

function TBridge.IniciaVendaCredito(idTransacao, tipoFinanciamento, numeroParcelas: integer;
                                    pdv, valorTotal: string):string;
begin
  Result:= JStringToString(TJBridge.JavaClass.IniciaVendaCredito(idTransacao,
                                                 StringToJString(pdv),
                                                 StringToJString(valorTotal),
                                                 tipoFinanciamento,
                                                 numeroParcelas));
end;

function TBridge.IniciaVendaDebito(idTransacao: integer; pdv, valorTotal:string):string;
begin
  Result:= JStringToString(TJBridge.JavaClass.IniciaVendaDebito(idTransacao,
                                                 StringToJString(pdv),
                                                 StringToJString(valorTotal)));

end;

function TBridge.SetSenha(senha: string; habilitada: boolean): string;
begin
  Result:= JStringToString(TJBridge.JavaClass.SetSenha(StringToJString(senha),
                                                    habilitada));
end;

function TBridge.SetSenhaServer(senha: string; habilitada: boolean): string;
begin
  Result:= JStringToString(TJBridge.JavaClass.SetSenhaServer(StringToJString(senha),
                                                    habilitada));
end;

function TBridge.ImprimirCupomNfce(csc: string; indexcsc: integer): string;
var
  xml: string;
begin
  xml := FileToString('cupomNFCe.xml');
  Result:= JStringToString(TJBridge.JavaClass.ImprimirCupomNfce(StringToJString(xml),
                                                                indexcsc,
                                                                StringToJString(csc)));
end;

function TBridge.ImprimirCupomSat: string;
var
  xml: string;
begin
  xml := FileToString('cupomSat.xml');
  Result:= JStringToString(TJBridge.JavaClass.ImprimirCupomSat(StringToJString(xml)));
end;

function TBridge.ImprimirCupomSatCancelamento(assQrCode: string): string;
var
  xml: string;
begin
  xml := FileToString('cupomSatCancelamento.xml');
  Result:= JStringToString(TJBridge.JavaClass.ImprimirCupomSatCancelamento(
                                                      StringToJString(xml),
                                                      StringToJString(assQrCode)));
end;

function TBridge.IniciaCancelamentoVenda(idTransacao:integer; pdv,
                                         valorTotal, dataHora, nsu:string):string;
begin
  Result:= JStringToString(TJBridge.JavaClass.IniciaCancelamentoVenda
                                                (idTransacao,
                                                 StringToJString(pdv),
                                                 StringToJString(valorTotal),
                                                 StringToJString(dataHora),
                                                 StringToJString(nsu)));
end;

function TBridge.IniciaOperacaoAdministrativa(idTransacao, op: integer;
  pdv: string): string;
begin
  Result:= JStringToString(TJBridge.JavaClass.IniciaOperacaoAdministrativa(idTransacao,
                                                                           StringToJString(pdv),
                                                                           op));
end;

function TBridge.ConsultarStatus:string;
begin
  Result:= JStringToString(TJBridge.JavaClass.ConsultarStatus);
end;

function TBridge.ConsultarTimeout:string;
begin
  Result:= JStringToString(TJBridge.JavaClass.GetTimeout);
end;

function TBridge.AtualizarTimeout(seconds:integer):string;
begin
  Result:= JStringToString(TJBridge.JavaClass.SetTimeout(seconds));
end;

function TBridge.ConsultarUltimaTransacao(pdv:string):string;
begin
  Result:= JStringToString(TJBridge.JavaClass.ConsultarUltimaTransacao(StringToJString(pdv)));
end;

initialization
 bridge_instance := TBridge.Create(TAndroidHelper.Context);

end.
