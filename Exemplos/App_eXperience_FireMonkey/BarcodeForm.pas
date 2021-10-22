unit BarcodeForm;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs,
  FMX.Controls.Presentation, FMX.StdCtrls, FMX.Ani, FMX.Objects, FMX.Layouts,
  FMX.Edit, FMX.VirtualKeyboard, FMX.Platform,System.IOUtils;

type
  TfrmBarcode = class(TForm)
    LayoutHeading: TLayout;
    Titulo: TLabel;
    Logo: TImage;
    LayoutFooter: TLayout;
    Label1: TLabel;
    GridPanelLayout1: TGridPanelLayout;
    Rectangle1: TRectangle;
    GridPanelLayout2: TGridPanelLayout;
    Layout1: TLayout;
    Label2: TLabel;
    Image1: TImage;
    Layout2: TLayout;
    Label3: TLabel;
    Image2: TImage;
    GridPanelLayout3: TGridPanelLayout;
    LayoutBotoes: TLayout;
    btnIniciarLeitura: TRectangle;
    Label10: TLabel;
    btnLimparCampos: TRectangle;
    Label4: TLabel;
    campos1: TLayout;
    Field_Image_1: TImage;
    Field_Edit_1: TEdit;
    Field_Label_1: TLabel;
    campos2: TLayout;
    Field_Image_2: TImage;
    Field_Edit_2: TEdit;
    Field_Label_2: TLabel;
    campos3: TLayout;
    Field_Image_3: TImage;
    Field_Edit_3: TEdit;
    Field_Label_3: TLabel;
    campos4: TLayout;
    Field_Image_4: TImage;
    Field_Edit_4: TEdit;
    Field_Label_4: TLabel;
    campos5: TLayout;
    Field_Image_5: TImage;
    Field_Edit_5: TEdit;
    Field_Label_5: TLabel;
    campos6: TLayout;
    Field_Image_6: TImage;
    Field_Edit_6: TEdit;
    Field_Label_6: TLabel;
    campos7: TLayout;
    Field_Image_7: TImage;
    Field_Edit_7: TEdit;
    Field_Label_7: TLabel;
    campos8: TLayout;
    Field_Image_8: TImage;
    Field_Edit_8: TEdit;
    Field_Label_8: TLabel;
    campos9: TLayout;
    Field_Image_9: TImage;
    Field_Edit_9: TEdit;
    Field_Label_9: TLabel;
    campos10: TLayout;
    Field_Image_10: TImage;
    Field_Edit_10: TEdit;
    Field_Label_10: TLabel;
    procedure Rectangle1MouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure Rectangle1MouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure FormKeyDown(Sender: TObject; var Key: Word; var KeyChar: Char;
      Shift: TShiftState);
    procedure FormActivate(Sender: TObject);
    procedure btnIniciarLeituraClick(Sender: TObject);
    procedure btnLimparCamposClick(Sender: TObject);
    procedure FormDeactivate(Sender: TObject);
    procedure botaoEfeitoMouseDown(Sender: TObject;
      Button: TMouseButton; Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject;
      Button: TMouseButton; Shift: TShiftState; X, Y: Single);
  private
    { Private declarations }
    procedure AtualizaCampos(index : integer);
    procedure Next;
  public
    { Public declarations }
    IndexCampoAtual : integer;
  end;

var
  frmBarcode: TfrmBarcode;

implementation

{$R *.fmx}

procedure TfrmBarcode.AtualizaCampos(index: integer);

begin
   TLabel(FindComponent('Field_Label_' + inttostr(index))).Text := 'Leitura realizada com sucesso!';
   TImage(FindComponent('Field_Image_' + inttostr(index))).Bitmap.LoadFromFile( System.IOUtils.TPath.GetDocumentsPath + PathDelim  + 'barcode_icon.png');

end;

procedure TfrmBarcode.btnIniciarLeituraClick(Sender: TObject);
var
i : integer;
begin

 for i:= 1 to 10 do
  begin
   if TEdit(FindComponent('Field_Edit_' + inttostr(i))).Text = '' then
   begin
      TEdit(FindComponent('Field_Edit_' + inttostr(i))).SetFocus;
      IndexCampoAtual := i;
      break;
   end;
  end;
end;

procedure TfrmBarcode.btnLimparCamposClick(Sender: TObject);
var
i : integer;
begin
  for i:= 1 to 10 do
  begin
   TLabel(FindComponent('Field_Label_' + inttostr(i))).Text := '';
   TEdit(FindComponent('Field_Edit_' + inttostr(i))).Text := '';
   TImage(FindComponent('Field_Image_' + inttostr(i))).Bitmap := nil;
  end;
end;


procedure TfrmBarcode.FormActivate(Sender: TObject);
begin
  VKAutoShowMode := TVKAutoShowMode.Never;
  IndexCampoAtual := 1;

end;

procedure TfrmBarcode.FormDeactivate(Sender: TObject);
begin
  VKAutoShowMode := TVKAutoShowMode.Always;
end;

procedure TfrmBarcode.FormKeyDown(Sender: TObject; var Key: Word;
  var KeyChar: Char; Shift: TShiftState);
begin
  if Key = vkReturn then begin

     AtualizaCampos(IndexCampoAtual);
     Next();

  end;
end;

procedure TfrmBarcode.Next;
begin
   IndexCampoAtual := IndexCampoAtual + 1;
   if IndexCampoAtual > 10 then
       IndexCampoAtual := 1;
   TEdit(FindComponent('Field_Edit_' + inttostr(IndexCampoAtual))).SetFocus;
end;

procedure TfrmBarcode.Rectangle1MouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 0.8;
end;

procedure TfrmBarcode.Rectangle1MouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Single);
begin
   TRectangle(Sender).Opacity := 1.0;
end;

procedure TfrmBarcode.botaoEfeitoMouseDown(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
     TRectangle(Sender).Opacity := 0.7;
end;

procedure TfrmBarcode.botaoEfeitoMouseUp(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 1.0;
end;

end.
