unit Pix4;

interface
  uses
    Elgin.JNI.E1,
    Androidapi.Helpers,
    Androidapi.JNI.JavaTypes,
    Androidapi.JNI.App,
    FMX.Objects,
    System.IOUtils,
    SysUtils,
    System.Classes;

  type

    TPix4 = class
    private
//      Pix4Initializer: JPIX4;
      constructor Create(activity: JActivity);

    public
      procedure AbreConexaoDisplay;
      procedure ApresentaQrCodeLinkGihtub(framework, link: string);
      procedure InicializaDisplay;
      procedure ReinicializaDisplay;
      procedure DesconectarDisplay;
      procedure ObtemVersãoFirmware;
      function CarregarImagens(name, filename: string): integer;
      procedure ApresentaProduto(name, filename, preco: string; carrinho: array of string);
      procedure ApresentaLista(nome, preco: string);
    end;

  var
    Pix: TPix4;
implementation

{ TPix4 }

uses ToastMessage;

procedure TPix4.AbreConexaoDisplay;
var
  res: integer;
  msg: string;
begin
  res:= TJPIX4.JavaClass.AbreConexaoDisplay;


  case res of
    0:begin
      msg:= 'Conexão com o dispositivo PIX4 bem sucedida!';
    end;

    -12:begin
      msg:= 'Dispositivo não existe!';
    end;

    13:begin
      msg:= 'Permissão negada!';
    end;

    -14:begin
      msg:= 'Erro desconhecido!';
    end;

    -19:begin
      msg:= 'Dispositivo removido inesperadamente!';
    end;

    -1:begin
      msg:= 'Conexão mal sucedida';
    end;
  end;

  TToastMessage.show(msg,3,40,TToastPosition.tpBottom);
end;

procedure TPix4.ApresentaLista(nome, preco: string);
begin
  TJPIX4.JavaClass.ApresentaListaCompras(StringToJString(nome), StringToJString(preco))
end;

procedure TPix4.ApresentaProduto(name, filename, preco: string; carrinho: array of string);
var
  nomePreco, separador, qntTotal: string;
  total: double;
  i, cont: integer;
  FormatBr: TFormatSettings;
begin
  FormatBr:= TFormatSettings.Create;
  FormatBr.DecimalSeparator:= '.';

  InicializaDisplay;
  total:= 0.0;
  cont:=0;
  for i := 0 to Length(carrinho)-1 do
  begin
    if carrinho[i] = name then
    begin
      total:= total +  StrToFloat(preco, FormatBr);
      cont:= cont + 1;
    end;
  end;


  separador:= '────────────────────────────────';
  nomePreco:= 'Item: ' + name + ' R$' + preco;
  qntTotal:= 'Qnt: '+ IntToStr(cont) +' / Total: ' + FloatToStr(total);

  TJPIX4.JavaClass.ApresentaImagemDisplay(StringToJString(filename), 0, 0, 0);
  TJPIX4.JavaClass.ApresentaTextoColorido(StringToJString(separador), 17, 22, 400, 0, StringToJString('#005344'));
  TJPIX4.JavaClass.ApresentaTextoColorido(StringToJString(nomePreco), 18, 20, 420, 0, StringToJString('#005344'));
  TJPIX4.JavaClass.ApresentaTextoColorido(StringToJString(qntTotal), 19, 20, 450, 0, StringToJString('#005344'));
end;

procedure TPix4.apresentaQrCodeLinkGihtub(framework, link: string);
var
  msg, separador: string;
  msgPart1, msgPart2, msgPart3, msgPart4: string;
begin
  InicializaDisplay;

  msg:= 'Visite o exemplo do framework de desenvolvimento  mobile: ' + framework + ' através do QR code acima!';
  separador:= '────────────────────────────────';

  msgPart1:= copy(msg, 1,26);
  msgPart2:= copy(msg, 27, 26);
  msgPart3:= copy(msg, 53, 25);
  msgPart4:= copy(msg, 78, Length(msg) - (26+26+25));

  TJPIX4.JavaClass.ApresentaQrCode(StringToJString(link), 200, 80, 50);
  TJPIX4.JavaClass.ApresentaTextoColorido(StringToJString(separador), 5, 20, 340, 0, StringToJString('#005344'));
  TJPIX4.JavaClass.ApresentaTextoColorido(StringToJString(msgPart1), 6, 20, 360, 0, StringToJString('#005344'));
  TJPIX4.JavaClass.ApresentaTextoColorido(StringToJString(msgPart2), 7, 20, 390, 0, StringToJString('#005344'));
  TJPIX4.JavaClass.ApresentaTextoColorido(StringToJString(msgPart3), 8, 20, 420, 0, StringToJString('#005344'));
  TJPIX4.JavaClass.ApresentaTextoColorido(StringToJString(msgPart4), 9, 22, 450, 0, StringToJString('#005344'));

end;


function TPix4.CarregarImagens(name, filename: string): integer;
begin
  Result:= TJPIX4.JavaClass.CarregaImagemDisplay(StringToJString(name), StringToJString(filename), 320, 480);
end;

constructor TPix4.Create(activity: JActivity);
begin
  TJPIX4.JavaClass.setActivity(activity);
end;

procedure TPix4.DesconectarDisplay;
begin
  TJPIX4.JavaClass.DesconectarDisplay();
end;

procedure TPix4.InicializaDisplay;
begin
  TJPIX4.JavaClass.InicializaDisplay();
end;

procedure TPix4.ObtemVersãoFirmware;
begin
  TJPIX4.JavaClass.ObtemVersaoFirmware();
end;

procedure TPix4.ReinicializaDisplay;
begin
  TJPIX4.JavaClass.ReinicializaDisplay();
end;

initialization

 Pix := TPix4.Create(TAndroidHelper.Activity);

end.
