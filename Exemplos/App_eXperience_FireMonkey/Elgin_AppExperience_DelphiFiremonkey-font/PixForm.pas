unit PixForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs, FMX.Layouts,
  FMX.Objects, FMX.Controls.Presentation, FMX.StdCtrls,
  System.Permissions,
  Androidapi.Helpers,
  Androidapi.JNI.OS,
  System.IOUtils,
  Androidapi.JNI.JavaTypes,
  AndroidAPI.JNIBridge, Pix4;

type
  TFrmPix4 = class(TForm)
    LayoutMain: TLayout;
    LayoutHeading: TLayout;
    Titulo: TLabel;
    Logo: TImage;
    LayoutContent: TLayout;
    LayoutFooter: TLayout;
    Label1: TLabel;
    GridPanelLayout1: TGridPanelLayout;
    Layout1: TLayout;
    Layout2: TLayout;
    Label2: TLabel;
    Label3: TLabel;
    GridPanelLayout2: TGridPanelLayout;
    rectJava: TRectangle;
    Image2: TImage;
    Label4: TLabel;
    recDelphi: TRectangle;
    Image1: TImage;
    Label5: TLabel;
    recFlutter: TRectangle;
    Image3: TImage;
    Label6: TLabel;
    recAndroid: TRectangle;
    Image4: TImage;
    Label7: TLabel;
    recForms: TRectangle;
    Image5: TImage;
    Label8: TLabel;
    recNative: TRectangle;
    Image6: TImage;
    Label9: TLabel;
    recKotlin: TRectangle;
    Image7: TImage;
    Label10: TLabel;
    recIonic: TRectangle;
    Image8: TImage;
    Label11: TLabel;
    GridPanelLayout3: TGridPanelLayout;
    GridPanelLayout4: TGridPanelLayout;
    recAbacaxi: TRectangle;
    Image9: TImage;
    Label12: TLabel;
    Label22: TLabel;
    recBanana: TRectangle;
    Image10: TImage;
    Label13: TLabel;
    Label14: TLabel;
    recChocolate: TRectangle;
    Image11: TImage;
    Label15: TLabel;
    Label16: TLabel;
    recDetergente: TRectangle;
    Image12: TImage;
    Label17: TLabel;
    Label18: TLabel;
    recErvilha: TRectangle;
    Image13: TImage;
    Label19: TLabel;
    Label20: TLabel;
    recFeijao: TRectangle;
    Image14: TImage;
    Label21: TLabel;
    Label23: TLabel;
    recGoiabada: TRectangle;
    Image15: TImage;
    Label24: TLabel;
    Label25: TLabel;
    recHamburguer: TRectangle;
    Image16: TImage;
    Label26: TLabel;
    Label27: TLabel;
    recIorgute: TRectangle;
    Image17: TImage;
    Label28: TLabel;
    Label29: TLabel;
    recJaca: TRectangle;
    Image18: TImage;
    Label30: TLabel;
    Label31: TLabel;
    btnApresentar: TRectangle;
    Label32: TLabel;
    recCarregar: TRectangle;
    Label33: TLabel;
    Image19: TImage;
    procedure FormActivate(Sender: TObject);
    procedure btnApresentarClick(Sender: TObject);
    procedure rectJavaClick(Sender: TObject);
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);

    procedure recDelphiClick(Sender: TObject);
    procedure recFlutterClick(Sender: TObject);
    procedure recAndroidClick(Sender: TObject);
    procedure recFormsClick(Sender: TObject);
    procedure recNativeClick(Sender: TObject);
    procedure recKotlinClick(Sender: TObject);
    procedure recIonicClick(Sender: TObject);
    procedure recCarregarClick(Sender: TObject);
    procedure recAbacaxiClick(Sender: TObject);
    procedure recBananaClick(Sender: TObject);
    procedure recChocolateClick(Sender: TObject);
    procedure recDetergenteClick(Sender: TObject);
    procedure recErvilhaClick(Sender: TObject);
    procedure recFeijaoClick(Sender: TObject);
    procedure recGoiabadaClick(Sender: TObject);
    procedure recHamburguerClick(Sender: TObject);
    procedure recIorguteClick(Sender: TObject);
    procedure recJacaClick(Sender: TObject);  private
    { Private declarations }
    procedure StorageImg(filename_delphi, filename_dispositivo: string);
    procedure UploadData();
  public
    { Public declarations }
  end;

var
  FrmPix4: TFrmPix4;
  img_delphi: array[0..9] of string;
  carrinho: array of string;
  img_dispositivo: array[0..9] of string;
  img_preco: array[0..9] of string;
  img_name: array[0..9] of string;
  carregar: boolean;

implementation

{$R *.fmx}

uses ToastMessage;


procedure TFrmPix4.botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 0.7;
end;

procedure TFrmPix4.botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 1.0;
end;

procedure TFrmPix4.btnApresentarClick(Sender: TObject);
var
  i, j, index: Integer;
begin
  Pix.InicializaDisplay;
  log.d('PIX4_Biblioteca_ANDROID: LENGTH ' + IntToStr(Length(carrinho)));

  if (Length(carrinho)) = 0 then
    TToastMessage.show('Não existe produtos no carrinho. Selecione os produtos acima!',3,40,TToastPosition.tpBottom)

  else
  begin

    for i := 0 to Length(carrinho)-1 do
    begin

      if carrinho[i] <> '' then
      begin

        for j := 0 to Length(img_preco)-1 do
        begin
          if img_name[j] = carrinho[i] then index := j

        end;
        Pix.ApresentaLista(carrinho[i], img_preco[index]);
      end;
    end;
  end;





end;

procedure TFrmPix4.FormActivate(Sender: TObject);
begin
  PermissionsService.RequestPermissions([JStringToString(TJManifest_permission.JavaClass.READ_EXTERNAL_STORAGE),
                                           JStringToString(TJManifest_permission.JavaClass.WRITE_EXTERNAL_STORAGE)],


  {$IF CompilerVersion > 34.0}   {Delphi 11+}
    procedure(const APermissions: TClassicStringDynArray; const AGrantResults: TClassicPermissionStatusDynArray)
      begin
        if (Length(AGrantResults) = 2)
          and (AGrantResults[0] = TPermissionStatus.Granted)
          and (AGrantResults[1] = TPermissionStatus.Granted) then
        else
          begin
            ShowMessage('Permissões para acesso a Biblioteca não concedida!');
          end;
      end)
    {$ELSE} {Delphi 10-}
      procedure(const APermissions: TArray<string>; const AGrantResults: TArray<TPermissionStatus>)
      begin
        if (Length(AGrantResults) = 2)
          and (AGrantResults[0] = TPermissionStatus.Granted)
          and (AGrantResults[1] = TPermissionStatus.Granted) then
        else
          begin
            ShowMessage('Permissões para acesso a Biblioteca não concedida!');
          end;
      end);
    {$ENDIF}

  UploadData;

  Pix.AbreConexaoDisplay;
  Pix.InicializaDisplay;

  carregar := True;

end;

procedure TFrmPix4.recAbacaxiClick(Sender: TObject);
begin
  log.d('PIX4_Biblioteca_ANDROID: TAMANHO ANTES' + IntToStr(Length(carrinho)));
  SetLength(carrinho, Length(carrinho) + 1);

  log.d('PIX4_Biblioteca_ANDROID: TAMANHO DEPOIS' + IntToStr(Length(carrinho)));
  carrinho[Length(carrinho) - 1]:= 'ABACAXI';
  log.d('PIX4_Biblioteca_ANDROID: CARRINHO' + (carrinho[Length(carrinho) - 1]));

  Pix.ApresentaProduto('ABACAXI', img_dispositivo[0], img_preco[0], carrinho);
end;

procedure TFrmPix4.recAndroidClick(Sender: TObject);
begin
  Pix.apresentaQrCodeLinkGihtub('XAMARIN ANDROID', 'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_XamarinAndroid');
end;

procedure TFrmPix4.recBananaClick(Sender: TObject);
begin
  SetLength(carrinho, Length(carrinho) + 1);
  carrinho[Length(carrinho) - 1]:= 'BANANA';

  Pix.ApresentaProduto('BANANA', img_dispositivo[1], img_preco[1], carrinho);
end;

procedure TFrmPix4.recCarregarClick(Sender: TObject);
var
//  t: TThread;
  res: integer;
  handle: JHandler;
begin
  if carregar = True then
  begin
    carregar:= False;
    recCarregar.Enabled:= False;
    TToastMessage.show('O carregamento das imagens começou, aguarde até a mensagem de término do carregamento!',3,40,TToastPosition.tpBottom);
    TThread.CreateAnonymousThread(procedure
    var
      i, res: Integer;
      path, produto: string;
    begin
      try

        try

          for i := 0 to 9 do
          begin
            path:= TPath.GetDownloadsPath + TPath.DirectorySeparatorChar + img_dispositivo[i];
            produto:= img_dispositivo[i];
            res:= Pix.CarregarImagens(produto, path);

            TThread.Sleep(500);

  //          TThread.Queue()  envia pra fila da trhead principal o codigo dentro da queue

            TThread.Synchronize(nil, procedure     // envia pra thread principal e espera ser executado, para poder executar o restante do codigo
            begin
              if res = 0 then
                TToastMessage.show('A imagem do produto: ' + img_name[i] + ' carregou com sucesso!' ,3,40,TToastPosition.tpBottom)
              else
              begin
                TToastMessage.show('Ocorreu um erro no carregamento da imagem do produto: ' + img_name[i] + '.  Tente novamente em algusn minutos!',3,40,TToastPosition.tpBottom);
                carregar:= True;
              end;
            end);


          end;

        except
          on e: Exception  do
            Log.d('erro: ' + e.Message);
        end;

      finally
      begin
        TToastMessage.show('O carregamento das imagens dos produtos terminou !',3,40,TToastPosition.tpBottom);
        recCarregar.Enabled:= True;
      end;
      end;
    end).Start;

  end
  else
    TToastMessage.show('As imagens ja estão na memória do dispositivo PIX4',3,40,TToastPosition.tpBottom);

end;

procedure TFrmPix4.recChocolateClick(Sender: TObject);
begin
  SetLength(carrinho, Length(carrinho) + 1);
  carrinho[Length(carrinho) - 1]:= 'CHOCOLATE';
  Pix.ApresentaProduto('CHOCOLATE', img_dispositivo[2], img_preco[2], carrinho);
end;

procedure TFrmPix4.recDelphiClick(Sender: TObject);
begin
  Pix.apresentaQrCodeLinkGihtub('DELPHI', 'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_FireMonkey');
end;

procedure TFrmPix4.recDetergenteClick(Sender: TObject);
begin
  SetLength(carrinho, Length(carrinho) + 1);
  carrinho[Length(carrinho) - 1]:= 'DETERGENTE';
  Pix.ApresentaProduto('DETERGENTE', img_dispositivo[3], img_preco[3], carrinho);
end;

procedure TFrmPix4.recErvilhaClick(Sender: TObject);
begin
  SetLength(carrinho, Length(carrinho) + 1);
  carrinho[Length(carrinho) - 1]:= 'ERVILHA';
  Pix.ApresentaProduto('ERVILHA', img_dispositivo[4], img_preco[4], carrinho);
end;

procedure TFrmPix4.rectJavaClick(Sender: TObject);
begin
  Pix.apresentaQrCodeLinkGihtub('JAVA', 'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Java');
end;

procedure TFrmPix4.StorageImg(filename_delphi, filename_dispositivo: string);
var
  dir: string;
  picture_file: JFile;
  output: JOutputStream;
  byte_array: JByteArrayOutputStream;
  buffer: TJavaArray<Byte>;
  length: integer;

  file_output:JFile;
  input: JInputStream;
  image: TImage;
  bitmap: TBitmap;
begin


  file_output:=  TJFile.JavaClass.init(StringToJString(System.IOUtils.TPath.GetDocumentsPath + PathDelim + filename_delphi));
  input := TJFileInputStream.JavaClass.init(file_output);

  dir:= TPath.GetDownloadsPath + TPath.DirectorySeparatorChar + filename_dispositivo;
  picture_file:= TJfile.JavaClass.init(StringToJString(dir));

  try
    try
      output:= TJFileOutputStream.JavaClass.init(picture_file);
      buffer:= TJavaArray<Byte>.Create(1024);

      // set DPI = 70
      buffer[13] := 1;
      buffer[14] := byte(70 shr 8);
      buffer[15] := byte(70 and 256);
      buffer[16] := byte(70 shr 8);
      buffer[17] := byte(70 and 256);

      length:= input.read(buffer);
      while (length > 0) do
      begin
        output.write(buffer, 0, length);
        length:= input.read(buffer);
      end;
    finally

      output.close;
      input.close;

    end;
  except
    on E:Exception do ShowMessage('Não foi possível trasnferir o buffer da imagem !');
  end;

  // resize every img
  Image19.Bitmap.LoadFromFile(dir);
  Image19.Height:= 480;
  Image19.Width:= 320;
  Image19.Bitmap.SaveToFile(dir);

end;

procedure TFrmPix4.UploadData;
var
  i: integer;
begin
  // imgs nno diretorio do delphi
  img_delphi[0]:= 'pix4_image_abacaxi.jpg';
  img_delphi[1]:= 'pix4_image_banana.jpg';
  img_delphi[2]:= 'pix4_image_chocolate.jpg';
  img_delphi[3]:= 'pix4_image_detergente.jpg';
  img_delphi[4]:= 'pix4_image_ervilha.jpg';
  img_delphi[5]:= 'pix4_image_feijao.jpg';
  img_delphi[6]:= 'pix4_image_goiabada.jpg';
  img_delphi[7]:= 'pix4_image_hamburguer.jpg';
  img_delphi[8]:= 'pix4_image_iogurte.jpg';
  img_delphi[9]:= 'pix4_image_jaca.jpg';

  // imgs no diretorio do dispositivo
  img_dispositivo[0]:= 'p1.jpg';
  img_dispositivo[1]:= 'p2.jpg';
  img_dispositivo[2]:= 'p3.jpg';
  img_dispositivo[3]:= 'p4.jpg';
  img_dispositivo[4]:= 'p5.jpg';
  img_dispositivo[5]:= 'p6.jpg';
  img_dispositivo[6]:= 'p7.jpg';
  img_dispositivo[7]:= 'p8.jpg';
  img_dispositivo[8]:= 'p9.jpg';
  img_dispositivo[9]:= 'p10.jpg';

  // preço dos produtos
  img_preco[0]:= '7.00';
  img_preco[1]:= '8.50';
  img_preco[2]:= '10.00';
  img_preco[3]:= '6.00';
  img_preco[4]:= '4.00';
  img_preco[5]:= '8.00';
  img_preco[6]:= '9.00';
  img_preco[7]:= '14.00';
  img_preco[8]:= '11.00';
  img_preco[9]:= '9.00';

  // preço dos produtos
  img_name[0]:= 'ABACAXI';
  img_name[1]:= 'BANANA';
  img_name[2]:= 'CHOCOLATE';
  img_name[3]:= 'DETERGENTE';
  img_name[4]:= 'ERVILHA';
  img_name[5]:= 'FEIJÃO';
  img_name[6]:= 'GOIABADA';
  img_name[7]:= 'HAMBURGUER';
  img_name[8]:= 'IOGURTE';
  img_name[9]:= 'JACA';

  for i := 0 to 9 do
  begin
    StorageImg(img_delphi[i], img_dispositivo[i]);
  end;


end;

procedure TFrmPix4.recFeijaoClick(Sender: TObject);
begin
  SetLength(carrinho, Length(carrinho) + 1);
  carrinho[Length(carrinho) - 1]:= 'FEIJÃO';
  Pix.ApresentaProduto('FEIJÃO', img_dispositivo[5], img_preco[5], carrinho);
end;

procedure TFrmPix4.recFlutterClick(Sender: TObject);
begin
  Pix.apresentaQrCodeLinkGihtub('FLUTTER', 'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Flutter');
end;

procedure TFrmPix4.recFormsClick(Sender: TObject);
begin
  Pix.apresentaQrCodeLinkGihtub('XAMARIN FORMS', 'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_XamarinAndroid');
end;

procedure TFrmPix4.recGoiabadaClick(Sender: TObject);
begin
  SetLength(carrinho, Length(carrinho) + 1);
  carrinho[Length(carrinho) - 1]:= 'GOIABADA';
  Pix.ApresentaProduto('GOIABADA', img_dispositivo[6], img_preco[6], carrinho);
end;

procedure TFrmPix4.recHamburguerClick(Sender: TObject);
begin
  SetLength(carrinho, Length(carrinho) + 1);
  carrinho[Length(carrinho) - 1]:= 'HAMBURGUER';
  Pix.ApresentaProduto('HAMBURGUER', img_dispositivo[7], img_preco[7], carrinho);
end;

procedure TFrmPix4.recIonicClick(Sender: TObject);
begin
  Pix.apresentaQrCodeLinkGihtub('IONIC', 'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Ionic');
end;

procedure TFrmPix4.recIorguteClick(Sender: TObject);
begin
  SetLength(carrinho, Length(carrinho) + 1);
  carrinho[Length(carrinho) - 1]:= 'IOGURTE';
  Pix.ApresentaProduto('IOGURTE', img_dispositivo[8], img_preco[8], carrinho);
end;

procedure TFrmPix4.recJacaClick(Sender: TObject);
begin

  SetLength(carrinho, Length(carrinho) + 1);
  carrinho[Length(carrinho) - 1]:= 'JACA';
  Pix.ApresentaProduto('JACA', img_dispositivo[9], img_preco[9], carrinho);
end;

procedure TFrmPix4.recKotlinClick(Sender: TObject);
begin
  Pix.apresentaQrCodeLinkGihtub('KOTLIN', 'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Kotlin');
end;

procedure TFrmPix4.recNativeClick(Sender: TObject);
begin
  Pix.apresentaQrCodeLinkGihtub('REACT NATIVE', 'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_ReactNative');
end;

end.
