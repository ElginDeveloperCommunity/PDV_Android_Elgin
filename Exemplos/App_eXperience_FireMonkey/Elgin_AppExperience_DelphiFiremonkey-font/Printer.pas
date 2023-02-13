unit Printer;

interface
  uses
   Elgin.JNI.E1,
   Androidapi.Helpers,
   Androidapi.JNI.JavaTypes,
   Androidapi.JNI.GraphicsContentViewText,
   FMX.Graphics,
   FMX.Surfaces,
   FMX.Helpers.Android,
   System.SysUtils,
   FMX.Types,
   System.IOUtils, FMX.Dialogs;


  const
    QTD_LINHAS_I9 = 5;
    QTD_LINHAS_INTERNA = 10;


  type

      BARCODE_TYPE = (UPC_A,UPC_E,EAN_13,JAN_13, EAN_8, JAN_8,CODE_39,ITF, CODE_BAR, CODE_93, CODE_128,QR_CODE);

      TPrinter = class
      private

      context : JContext;
      qtd_linhas : integer;
      USBInitializer : JConUSB;

      function codeOfBarCode(barCodeName: BARCODE_TYPE): integer;

      public

      constructor Create(activity: JContext);
      function PrinterExternalImpStart(modelo, conexao: string; tipo, port: integer): integer;
      function printerInternalImpStart(): integer;
      procedure PrinterStop;
      function StatusSensorPapel(): integer;
      function StatusGaveta() : integer;
      function abrirGaveta() : integer;
      function AvancaLinhas(rbImpInterna:boolean): integer;
      function CutPaper(quantLinhas : integer) : integer;
      function ImprimeTexto(text, align, font: string; fontSize: integer;
             isCutPaper, isUnderline, isBold, rbImpInterna: boolean): integer;
      function ImprimeBarCode(barcodetype: BARCODE_TYPE; text, align: string; height,
  width: integer; isCutPaper, rbImpInterna: boolean): integer;
      function ImprimeQR_CODE(text, align : string; qrSize: integer; isCutPaper, rbImpInterna: boolean): integer;
      function ImprimeImagem(bitmap : TBitmap; isCutPaper, rbImpInterna: boolean) : integer;
      function ImprimeXMLNFCe(xmlNFCe, csc : string; indexcsc, param : integer; isCutPaper, rbImpInterna: boolean ): integer;
      function ImprimeXMLSAT(xmlSAT : string; param : integer; isCutPaper, rbImpInterna: boolean): integer;
      function IImprimeCupomTEF(viaCliente: string): integer;

    end;
  var
  Impressora : TPrinter;
implementation

{ TPrinter }

function TPrinter.AvancaLinhas(rbImpInterna:boolean): integer;
begin
   if rbImpInterna=True then TJTermica.JavaClass.AvancaPapel(50)
   else TJTermica.JavaClass.AvancaPapel(20);
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

   USBInitializer := TJConUSB.Create;
   USBInitializer.create(context);
end;

function TPrinter.CutPaper(quantLinhas: integer): integer;
begin
  Result := TJTermica.JavaClass.Corte(quantLinhas);
end;

function TPrinter.imprimeBarCode(barcodetype: BARCODE_TYPE; text, align: string; height,
  width: integer; isCutPaper, rbImpInterna: boolean): integer;
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

   AvancaLinhas(rbImpInterna);

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

function TPrinter.imprimeImagem(bitmap: TBitmap; isCutPaper, rbImpInterna: boolean): integer;
var
  scale, a: Double;
begin
  if rbImpInterna=True then
  begin
    if bitmap.Width > 600 then
    begin
      scale:= (bitmap.Width-600)/bitmap.Width;
      bitmap.Width:= Round(bitmap.Width * (1.0 - scale));
      bitmap.Height:= Round(bitmap.Height * (1.0 - scale));
    end;
    ShowMessage(inttostr(bitmap.Width));
    Result := TJTermica.JavaClass.ImprimeBitmap(BitmapToJBitmap(bitmap))
  end
  else Result := TJTermica.JavaClass.ImprimeImagem(BitmapToJBitmap(bitmap));

  //Result := TJTermica.JavaClass.ImprimeImagemMemoria(stringtojstring(System.IOUtils.TPath.GetDocumentsPath + PathDelim  + 'barcode_icon.png'),0);
  AvancaLinhas(rbImpInterna);

  if isCutPaper then
         CutPaper(qtd_linhas);
end;

function TPrinter.imprimeQR_CODE(text, align: string; qrSize: integer;
                                isCutPaper, rbImpInterna: boolean): integer;
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

  AvancaLinhas(rbImpInterna);

  if isCutPaper then
         CutPaper(qtd_linhas);
end;

function TPrinter.ImprimeTexto(text, align, font: string; fontSize: integer;
  isCutPaper, isUnderline, isBold, rbImpInterna: boolean): integer;
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

   AvancaLinhas(rbImpInterna);

   if isCutPaper then
         CutPaper(qtd_linhas);

end;

function TPrinter.imprimeXMLNFCe(xmlNFCe, csc: string; indexcsc,
  param: integer; isCutPaper, rbImpInterna: boolean): integer;
begin
   TJTermica.JavaClass.ImprimeXMLNFCe(StringToJString(xmlNFCe),indexcsc,StringToJString(csc), param);
   if isCutPaper then
         CutPaper(qtd_linhas);
end;

function TPrinter.imprimeXMLSAT(xmlSAT: string; param: integer; isCutPaper, rbImpInterna: boolean): integer;
begin
    TJTermica.JavaClass.ImprimeXMLSAT(StringToJString(xmlSAT), param);
    if isCutPaper then
         CutPaper(qtd_linhas);
end;

function TPrinter.printerExternalImpStart(modelo, conexao: string; tipo, port: integer): integer;
begin
    printerStop;
    qtd_linhas := QTD_LINHAS_I9;

    try
        Result := TJTermica.JavaClass.AbreConexaoImpressora(tipo, StringToJString(modelo), StringToJString(conexao), port);
        Log.d('Result: ' + inttostr(Result));
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

function TPrinter.abrirGaveta: integer;

begin
  Result := TJTermica.JavaClass.AbreGavetaElgin();
end;

function TPrinter.StatusGaveta: integer;

begin
  Result := TJTermica.JavaClass.StatusImpressora(1);
end;

function TPrinter.IImprimeCupomTEF(viaCliente: string): integer;

begin
    Result := TJTermica.JavaClass.ImprimeCupomTEF(StringToJString(viaCliente));
end;

function TPrinter.statusSensorPapel: integer;
begin
   Result := TJTermica.JavaClass.StatusImpressora(3);
end;

initialization

 Impressora := TPrinter.Create(TAndroidHelper.Context);

end.


