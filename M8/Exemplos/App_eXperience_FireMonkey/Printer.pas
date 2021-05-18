unit Printer;

interface
  uses
   Elgin.JNI.E1,Androidapi.Helpers,Androidapi.JNI.JavaTypes,Androidapi.JNI.GraphicsContentViewText,
   FMX.Graphics,FMX.Surfaces,FMX.Helpers.Android,System.SysUtils,System.IOUtils;


  const
    QTD_LINHAS_I9 = 10;
    QTD_LINHAS_INTERNA = 40;


  type

      BARCODE_TYPE = (UPC_A,UPC_E,EAN_13,JAN_13, EAN_8, JAN_8,CODE_39,ITF, CODE_BAR, CODE_93, CODE_128,QR_CODE);

      TPrinter = class
      private

      context : JContext;
      qtd_linhas : integer;

      function codeOfBarCode(barCodeName: BARCODE_TYPE): integer;

      public

      constructor Create(activity: JContext);
      function PrinterExternalImpStart(ip: string; port: integer): integer;
      function printerInternalImpStart(): integer;
      procedure PrinterStop;
      function  StatusSensorPapel(): integer;
      function  StatusGaveta() : integer;
      function  AvancaLinhas(quantLinhas : integer) : integer;
      function  CutPaper(quantLinhas : integer) : integer;
      function  ImprimeTexto(text, align, font: string; fontSize: integer;
             isCutPaper, isUnderline, isBold: boolean): integer;
      function ImprimeBarCode(barcodetype: BARCODE_TYPE; text, align: string; height,
  width: integer; isCutPaper: boolean): integer;
      function ImprimeQR_CODE(text, align : string; qrSize: integer; isCutPaper: boolean): integer;
      function ImprimeImagem(bitmap : TBitmap; isCutPaper: boolean) : integer;
      function ImprimeXMLNFCe(xmlNFCe, csc : string; indexcsc, param : integer; isCutPaper : boolean ): integer;
      function ImprimeXMLSAT(xmlSAT : string; param : integer; isCutPaper : boolean): integer;

    end;
  var
  Impressora : TPrinter;
implementation

{ TPrinter }

function TPrinter.AvancaLinhas(quantLinhas: integer): integer;
begin
   Result := TJTermica.JavaClass.AvancaPapel(quantLinhas);
end;

function TPrinter.codeOfBarCode(barCodeName: BARCODE_TYPE): integer;
begin
  case barCodeName of
    UPC_A: Result := 0;
    UPC_E: Result := 1;
    EAN_13: Result := 2;
    JAN_13: Result := 2;
    EAN_8: Result := 3;
    JAN_8: Result := 3;
    CODE_39: Result := 4;
    ITF: Result := 5;
    CODE_BAR: Result := 6;
    CODE_93: Result := 7;
    CODE_128: Result := 8;
    else
        Result := 0;
  end;
end;

constructor TPrinter.Create(activity: JContext);
begin
   context := activity;
   TJTermica.JavaClass.setContext(context);
end;

function TPrinter.CutPaper(quantLinhas: integer): integer;
begin
  Result := TJTermica.JavaClass.Corte(quantLinhas);
end;

function TPrinter.imprimeBarCode(barcodetype: BARCODE_TYPE; text, align: string; height,
  width: integer; isCutPaper: boolean): integer;
var
hri,alignValue : integer;
begin
 hri := 4; //NO PRINT

 alignValue := 0;

   if align = 'Esquerda' then
      alignValue := 0
   else if align = 'Centralizado' then
      alignValue := 1
   else
     alignValue := 2;

   TJTermica.JavaClass.DefinePosicao(alignValue);

   Result := TJTermica.JavaClass.ImpressaoCodigoBarras(codeOfBarCode(barCodeType),StringToJString(text), height, width, hri);

   if isCutPaper then
         CutPaper(qtd_linhas);

end;

// converte delphi bitmap para java bitmap
function BitmapToJBitmap(const ABitmap: TBitmap): JBitmap;
var
  LSurface: TBitmapSurface;
begin
  Result := TJBitmap.JavaClass.createBitmap(ABitmap.Width, ABitmap.Height, TJBitmap_Config.JavaClass.ARGB_8888);
  LSurface := TBitmapSurface.Create;
  try
    LSurface.Assign(ABitmap);
    SurfaceToJBitmap(LSurface, Result);
  finally
    LSurface.Free;
  end;
end;

function TPrinter.imprimeImagem(bitmap: TBitmap; isCutPaper: boolean): integer;
begin

  Result := TJTermica.JavaClass.ImprimeBitmap(BitmapToJBitmap(bitmap));

  //Result := TJTermica.JavaClass.ImprimeImagemMemoria(stringtojstring(System.IOUtils.TPath.GetDocumentsPath + PathDelim  + 'barcode_icon.png'),0);

  if isCutPaper then
         CutPaper(qtd_linhas);
end;

function TPrinter.imprimeQR_CODE(text, align: string; qrSize: integer;
  isCutPaper: boolean): integer;
var
alignValue : integer;
begin

    alignValue := 0;

   if align = 'Esquerda' then
      alignValue := 0
   else if align = 'Centralizado' then
      alignValue := 1
   else
     alignValue := 2;

   TJTermica.JavaClass.DefinePosicao(alignValue);

  Result := TJTermica.JavaClass.ImpressaoQRCode(StringToJString(text), qrSize, 2);

  if isCutPaper then
         CutPaper(qtd_linhas);
end;

function TPrinter.ImprimeTexto(text, align, font: string; fontSize: integer;
  isCutPaper, isUnderline, isBold: boolean): integer;
var
 alignValue,styleValue : integer;
begin
   alignValue := 0;
   styleValue := 0;

   if align = 'Esquerda' then
      alignValue := 0
   else if align = 'Centralizado' then
      alignValue := 1
   else
     alignValue := 2;

   if font = 'FONT B' then
      styleValue := 1;

   if isUnderline then
      styleValue := styleValue + 2;

   if isBold then
      styleValue := styleValue + 8;

   Result := TJTermica.JavaClass.ImpressaoTexto(StringToJString(text), alignValue, styleValue, fontSize);

   TJTermica.JavaClass.AvancaPapel(1);

   if isCutPaper then
         CutPaper(qtd_linhas);

end;

function TPrinter.imprimeXMLNFCe(xmlNFCe, csc: string; indexcsc,
  param: integer; isCutPaper : boolean): integer;
begin
   TJTermica.JavaClass.ImprimeXMLNFCe(StringToJString(xmlNFCe),indexcsc,StringToJString(csc), param);
   if isCutPaper then
         CutPaper(qtd_linhas);
end;

function TPrinter.imprimeXMLSAT(xmlSAT: string; param: integer; isCutPaper : boolean): integer;
begin
    TJTermica.JavaClass.ImprimeXMLSAT(StringToJString(xmlSAT), param);
    if isCutPaper then
         CutPaper(qtd_linhas);
end;

function TPrinter.printerExternalImpStart(ip: string; port: integer): integer;
begin
    printerStop;
    qtd_linhas := QTD_LINHAS_I9;
    try
        Result := TJTermica.JavaClass.AbreConexaoImpressora(3,StringToJString('i9'),StringToJString(ip), port);
    except
      on e: exception do
         printerInternalImpStart;
    end;

end;

function TPrinter.printerInternalImpStart;
begin
    printerStop;
    qtd_linhas := QTD_LINHAS_INTERNA;
    Result := TJTermica.JavaClass.AbreConexaoImpressora(6, StringToJString('M8'),StringToJString('USB'), 0);

end;

procedure TPrinter.printerStop;
begin
   TJTermica.JavaClass.FechaConexaoImpressora();
end;

function TPrinter.StatusGaveta: integer;
begin
  Result := TJTermica.JavaClass.StatusImpressora(1);
end;

function TPrinter.statusSensorPapel: integer;
begin
   Result := TJTermica.JavaClass.StatusImpressora(3);
end;



initialization

 Impressora := TPrinter.Create(TAndroidHelper.Context);

end.


