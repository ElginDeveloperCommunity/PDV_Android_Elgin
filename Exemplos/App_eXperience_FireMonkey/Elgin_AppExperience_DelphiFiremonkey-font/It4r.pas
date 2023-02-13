unit It4r;

interface
  uses Elgin.JNI.Daruma,
//    System.Threading,
    System.Classes,
    System.SysUtils,
    FMX.Types,
    Androidapi.Helpers,
    Androidapi.JNIBridge,
    Androidapi.JNI.JavaTypes,
    System.DateUtils;
  type
    TIt4r = class
      private

      public
        function configurarXmlNfce():integer;
        function adjustNfceNumber():integer;
        function getNumeroNota(): string;
        function getNumeroSerie(): string;
        function venderItem(descricao, valor, codigo: string) : integer;
        function encerrarVenda(total, formaDePagamento: string): integer;
    constructor Create;
    end;

var
  Drm: TIt4r;
  timeElapsedInLastEmission: integer;
  dmfObject: TJDarumaMobile;
  dmf: JDarumaMobile;
  dDiff: Double;

implementation

{ TIt4r }


function TIt4r.adjustNfceNumber: integer;
var
  retorno: TJavaArray<Char>;
  retornoAjustado: JString;
  notaMaisAlta: JString;
  notaMaisAltaInt, resultt: integer;
  proximaNota: String;
begin
  retorno:= TJavaArray<Char>.Create(50);
  resultt:= dmf.rRetornarInformacao_NFCe(StringToJString('NUM'), StringToJString('0'),
                                StringToJString('0'),
                                StringToJString('133'),
                                StringToJString(''),
                                StringToJString('9'),
                                retorno);
  log.d('config - rRetornarInformacao_NFCe ~> ' + IntToStr(resultt));

  retornoAjustado := TJString.JavaClass.init(retorno);
  retornoAjustado:= retornoAjustado.trim();

  notaMaisAlta := retornoAjustado.replaceAll(StringToJString('\D+'), StringToJString(''));
  notaMaisAltaInt := StrToInt(JStringToString(notaMaisAlta)) + 1;
  proximaNota := (inttoStr(notaMaisAltaInt));

  resultt:= dmf.RegAlterarValor_NFCe(StringToJString('IDE\nNF'), StringToJString(proximaNota), False);
  log.d('config - nNF ~> ' + IntToStr(resultt));
  resultt:= dmf.RegPersistirXML_NFCe();
  log.d('config - Persiste_NumberNFCe ~> ' + IntToStr(resultt));

  Result:= resultt;

end;

function TIt4r.configurarXmlNfce: integer;
var
  resultt: integer;
  t: TThread;
begin
  t:= TThread.CreateAnonymousThread(procedure ()
  begin
    log.d('config - Resultados');
    resultt:= (dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\EmpPK'), StringToJString('<INSIRA SUA CHAVE AQUI>'), False));
    log.d('config - EmpPK ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\EmpCK'), StringToJString('<INSIRA SUA CHAVE AQUI>'), False);
    log.d('config - EmpCK ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('IDE\cUF'), StringToJString('43'), False);
    log.d('config - cUF ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('EMIT\CNPJ'), StringToJString('06354976000149'), False);
    log.d('config - CNPJ ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('EMIT\IE'), StringToJString('1470049241'), False);
    log.d('config - IE ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('EMIT\xNome'), StringToJString('ITFast'), False);
    log.d('config - xNome ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('EMIT\ENDEREMIT\UF'), StringToJString('RS'), False);
    log.d('config - ENDEREMIT\UF ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('EMIT\CRT'), StringToJString('3'), False);
    log.d('config - CRT ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\TipoAmbiente'), StringToJString('2'), False);
    log.d('config - TipoAmbiente ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\Impressora'), StringToJString('EPSON'), False);
    log.d('config - Impressora ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\AvisoContingencia'), StringToJString('1'), False);
    log.d('config - AvisoContingencia ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\ImpressaoCompleta'), StringToJString('2'), False);
    log.d('config - ImpressaoCompleta ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\NumeracaoAutomatica'), StringToJString('1'), False);
    log.d('config - NumeracaoAutomatica ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\HabilitarSAT'), StringToJString('0'), False);
    log.d('config - HabilitarSAT ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\IdToken'), StringToJString('000001'), False);
    log.d('config - IdToken ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\Token'), StringToJString('1A451E99-0FE0-4C13-B97E-67D698FFBC37'), False);
    log.d('config - Token ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('IDE\Serie'), StringToJString('133'), False);
    log.d('config - Serie ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\NT\VersaoNT'), StringToJString('400'), False);
    log.d('config - VersaoNT ~> ' + IntToStr(resultt));
    resultt:= dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\EstadoCFe'), StringToJString('0'), False);
    log.d('config - EstadoCFe ~> ' + IntToStr(resultt));
    resultt:= dmf.RegPersistirXML_NFCe();
    log.d('config - PersisteXML ~> ' + IntToStr(resultt));

    resultt:= adjustNfceNumber();
   end);

   t.Start;
   t.WaitFor;

   Result:= resultt;
end;

constructor TIt4r.Create();
begin
   dmf := TJDarumaMobile.JavaClass.inicializar(TAndroidHelper.Context,
              StringToJString('@FRAMEWORK(LOGMEMORIA=200;TRATAEXCECAO=FALSE;TIMEOUTWS=8000;SATNATIVO=FALSE);@SOCKET(HOST=192.168.210.94;PORT=9100;)'));
end;

function TIt4r.encerrarVenda(total, formaDePagamento: string): integer;
var
  resultt: integer;
  t: TThread;
  dBeforte, dAfter: TDateTime;
  dDiv: Double;
begin
  t:= TThread.CreateAnonymousThread(procedure ()
  begin
    log.d('venda - Encerrar');
    resultt:=  dmf.aCFTotalizar_NFCe(StringToJString('D$'), StringToJString('0.00'));
    log.d('venda - aCFTotalizar_NFCe ~> ' + IntToStr(resultt));
    resultt:=  dmf.aCFEfetuarPagamento_NFCe(StringToJString(formaDePagamento), StringToJString(total));
    log.d('venda - aCFEfetuarPagamento_NFCe ~> ' + IntToStr(resultt));
    dBeforte:= MilliSecondsBetween(Now, 0);
    resultt:=  dmf.tCFEncerrar_NFCe(StringToJString('ELGIN DEVELOPERS COMMUNITY'));
    dAfter:= MilliSecondsBetween(Now, 0);
    log.d('venda - tCFEncerrar_NFCe ~> ' + IntToStr(resultt));
    resultt:=  dmf.RegAlterarValor_NFCe(StringToJString('CONFIGURACAO\EstadoCFe'), StringToJString('0'));
    log.d('venda - RegAlterarValor_NFCe ~> ' + IntToStr(resultt));

    dDiv:= 1000;
    dDiff:= (dAfter - dBeforte) / dDiv;
  end);

  t.Start;
  t.WaitFor;

  Result:= resultt;
end;

function TIt4r.getNumeroNota: string;
var
  retorno: TJavaArray<Char>;
  res: JString;
  resultt: integer;
begin
  retorno:= TJavaArray<Char>.Create(50);
  resultt:= dmf.rInfoEstendida_NFCe(StringToJString('2'), retorno);
  log.d('venda - rInfoEstendida_NFCe ~> ' + IntToStr(resultt));

  res := TJString.JavaClass.init(retorno);
  result:= JStringToString(res.trim());
end;

function TIt4r.getNumeroSerie: string;
var
  retorno: TJavaArray<Char>;
  res: JString;
  resultt: integer;
begin
  retorno:= TJavaArray<Char>.Create(50);
  resultt:= dmf.rInfoEstendida_NFCe(StringToJString('5'), retorno);
  log.d('venda - rInfoEstendida_NFCe ~> ' + IntToStr(resultt));

  res := TJString.JavaClass.init(retorno);
  result:= JStringToString(res.trim());
end;

function TIt4r.venderItem(descricao, valor, codigo: string): integer;
var
  str_vazia:JString;
  resultt: integer;
  t: TThread;
begin
  t:= TThread.CreateAnonymousThread(procedure ()
  begin
    log.d('venda - Item');
    str_vazia:= StringToJString('');
    resultt:= dmf.rCFVerificarStatus_NFCe();
    log.d('venda - rCFVerificarStatus_NFCe ~> ' + IntToStr(resultt));
    if resultt < 2 then
    begin
      resultt:= dmf.aCFAbrir_NFCe(str_vazia, str_vazia,str_vazia, str_vazia, str_vazia, str_vazia, str_vazia, str_vazia, str_vazia);
      log.d('venda - aCFAbrir_NFCe ~> ' + IntToStr(resultt));
    end;

    resultt:= dmf.aCFConfICMS00_NFCe(StringToJString('0'), StringToJString('00'), StringToJString('3'), StringToJString('17.50'));
    log.d('venda - aCFConfICMS00_NFCe ~> ' + IntToStr(resultt));
    resultt:= dmf.aCFConfPisAliq_NFCe(StringToJString('01'), StringToJString('10.00'));
    log.d('venda - aCFConfPisAliq_NFCe ~> ' + IntToStr(resultt));
    resultt:= dmf.aCFConfCofinsAliq_NFCe(StringToJString('01'), StringToJString('10.00'));
    log.d('venda - aCFConfCofinsAliq_NFCe ~> ' + IntToStr(resultt));
    resultt:= dmf.aCFVenderCompleto_NFCe(StringToJString('17.50'),
                                     StringToJString('1.00'),
                                     StringToJString(valor),
                                     StringToJString('D$'),
                                     StringToJString('0.00'),
                                     StringToJString(codigo),
                                     StringToJString('21050010'),
                                     StringToJString('5102'),
                                     StringToJString('UN'),
                                     StringToJString(descricao),
                                     StringToJString('CEST=2300100;cEAN=SEM GTIN;cEANTrib=SEM GTIN;'));
    log.d('venda - aCFVenderCompleto_NFCe ~> ' + IntToStr(resultt));
//    resultt:= dmf.aCFTotalizar_NFCe(StringToJString('D$'), StringToJString('0.00'));
//    log.d('venda - aCFTotalizar_NFCe ~> ' + IntToStr(resultt));
//    resultt:= dmf.aCFEfetuarPagamento_NFCe(StringToJString('Dinheiro'), StringToJString(valor));
//    log.d('venda - aCFEfetuarPagamento_NFCe ~> ' + IntToStr(resultt));
  end);

  t.Start;
  t.WaitFor;

  Result:= resultt;
end;

initialization
  Drm:= TIt4r.Create;
end.
