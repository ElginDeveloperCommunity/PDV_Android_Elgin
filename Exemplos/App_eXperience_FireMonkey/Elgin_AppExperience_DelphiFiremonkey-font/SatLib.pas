unit SatLib;

interface

uses
  Elgin.JNI.SAT,
  Androidapi.JNI.GraphicsContentViewText,
  Androidapi.Helpers,
  Androidapi.JNI.JavaTypes,
  System.Classes, FMX.Dialogs;

type
  TSatLib = class
             SatInitializer : JSatInitializer;

            private
              { private declarations }
            protected
              { protected declarations }
            public
              { public declarations }
              constructor Create;
              function ConsultarSat(numSessao: Integer): String;
              function associarAssinatura(numSessao: Integer; codAtivacao: String; cnpjSH: String; assinaturaAC : String): String;
              function ativarSat(numSessao: Integer; subComando: Integer; codAtivacao: String; cnpj: String; cUF : Integer): String;
              function atualizarSoftwareSat(numSessao: Integer; codAtivacao : String): String;
              function bloquearSat(numSessao: Integer; codAtivacao : String): String;
              function cancelarUltimaVenda(numSessao: Integer; codAtivacao: String; numeroCFe: String; dadosCancelamento : String): String;
              function configurarInterfaceDeRede(numSessao: Integer; codAtivacao: String; dadosConfiguracao : String): String;
              function consultarNumeroSessao(numSessao: Integer; codAtivacao: String; cNumeroDeSessao: Integer): String;
              function consultarStatusOperacional(numSessao: Integer; codAtivacao: String): String;
              function consultarUltimaSessaoFiscal(numSessao: Integer; codAtivacao: String): String;
              function desbloquearSat(numSessao: Integer; codAtivacao: String): String;
              function enviarDadosVenda(numSessao: Integer; codAtivacao: String; dadosVenda: String): String;
              function extrairLogs(numSessao: Integer; codAtivacao: String): String;
              function gerarNumeroSessao: Integer;
              function testeFimAFim(numSessao: Integer; codAtivacao: String; dadosVenda: String): String;
              function trocarCodigoDeAtivacao(numSessao: Integer; codAtivacao: String; opcao: Integer; novoCodigo: String; confNovoCodigo: String): String;
            end;

var
  Sat : TSatLib;
implementation

function TSatLib.associarAssinatura(numSessao: Integer; codAtivacao, cnpjSH,
  assinaturaAC: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.associarAssinatura(numSessao, StringToJString( codAtivacao ), StringToJString( cnpjSH ), StringToJString( assinaturaAC )));
end;

function TSatLib.ativarSat(numSessao, subComando: Integer; codAtivacao,
  cnpj: String; cUF: Integer): String;
begin
   Result := JStringToString(TJSat.JavaClass.ativarSat(numSessao,subComando, StringToJString( codAtivacao ), StringToJString( cnpj ), cUF));
end;

function TSatLib.atualizarSoftwareSat(numSessao: Integer;
  codAtivacao: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.atualizarSoftwareSat(numSessao, StringToJString( codAtivacao )));
end;

function TSatLib.bloquearSat(numSessao: Integer; codAtivacao: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.bloquearSat(numSessao, StringToJString( codAtivacao )));
end;

function TSatLib.cancelarUltimaVenda(numSessao: Integer; codAtivacao, numeroCFe,
  dadosCancelamento: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.cancelarUltimaVenda(numSessao, StringToJString( codAtivacao ), StringToJString( numeroCFe ) , StringToJString( dadosCancelamento )));
end;

function TSatLib.configurarInterfaceDeRede(numSessao: Integer; codAtivacao,
  dadosConfiguracao: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.configurarInterfaceDeRede(numSessao, StringToJString( codAtivacao ), StringToJString( dadosConfiguracao )));
end;

function TSatLib.consultarNumeroSessao(numSessao: Integer; codAtivacao: String;
  cNumeroDeSessao: Integer): String;
begin
  Result := JStringToString(TJSat.JavaClass.consultarNumeroSessao(numSessao, StringToJString( codAtivacao ),  cNumeroDeSessao));
end;

function TSatLib.ConsultarSat(numSessao: Integer): String;
begin
   Result := JStringToString(TJSat.JavaClass.consultarSat(numSessao));
end;

function TSatLib.consultarStatusOperacional(numSessao: Integer;
  codAtivacao: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.consultarStatusOperacional(numSessao, StringToJString( codAtivacao )));
end;

function TSatLib.consultarUltimaSessaoFiscal(numSessao: Integer;
  codAtivacao: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.consultarUltimaSessaoFiscal(numSessao, StringToJString( codAtivacao )));
end;

constructor TSatLib.Create;
begin
    SatInitializer := TJSatInitializer.Create;
    SatInitializer.create(TAndroidHelper.Context);
end;

function TSatLib.desbloquearSat(numSessao: Integer;
  codAtivacao: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.desbloquearSat(numSessao, StringToJString( codAtivacao )));
end;

function TSatLib.enviarDadosVenda(numSessao: Integer; codAtivacao,
  dadosVenda: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.enviarDadosVenda(numSessao, StringToJString( codAtivacao ),StringToJString( dadosVenda )));
end;

function TSatLib.extrairLogs(numSessao: Integer; codAtivacao: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.extrairLogs(numSessao, StringToJString( codAtivacao )));
end;

function TSatLib.gerarNumeroSessao: Integer;
begin
   Result := TJSat.JavaClass.gerarNumeroSessao;
end;

function TSatLib.testeFimAFim(numSessao: Integer; codAtivacao,
  dadosVenda: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.testeFimAFim(numSessao, StringToJString( codAtivacao ),StringToJString( dadosVenda )));
end;

function TSatLib.trocarCodigoDeAtivacao(numSessao: Integer; codAtivacao: String;
  opcao: Integer; novoCodigo, confNovoCodigo: String): String;
begin
   Result := JStringToString(TJSat.JavaClass.trocarCodigoDeAtivacao(numSessao, StringToJString( codAtivacao ), opcao, StringToJString( novoCodigo ), StringToJString( confNovoCodigo )));
end;

initialization

 Sat := TSatLib.Create;

end.
