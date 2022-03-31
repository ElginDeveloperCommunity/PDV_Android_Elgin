unit BridgeForm;

interface

uses
  System.SysUtils,
  System.Types,
  System.UITypes,
  System.Classes,
  System.Variants,
  System.JSON,
  FMX.Types,
  FMX.Controls,
  FMX.Forms,
  FMX.Graphics,
  FMX.Dialogs,
  FMX.Memo.Types,
  FMX.ScrollBox,
  FMX.Memo,
  FMX.Objects,
  FMX.Edit,
  FMX.Layouts,
  FMX.Controls.Presentation,
  FMX.StdCtrls,
  System.RegularExpressions,
  DialogOpAdmForm,
  DialogCupomForm,
  DialogTimeoutForm,
  DialogConfigSenhaForm,
  Bridge,
  Bridge.Types,
  System.DateUtils;

type
  TFrmBridge = class(TForm)
    LayoutMain: TLayout;
    LayoutHeading: TLayout;
    Titulo: TLabel;
    Logo: TImage;
    LayoutContent: TLayout;
    GridPanelLayout1: TGridPanelLayout;
    LayoutLeft: TLayout;
    Label14: TLabel;
    Label2: TLabel;
    Label4: TLabel;
    Label5: TLabel;
    opLoja: TRectangle;
    Image1: TImage;
    btnLabel: TLabel;
    opVista: TRectangle;
    Image2: TImage;
    Label6: TLabel;
    opDebito: TRectangle;
    Image3: TImage;
    Label7: TLabel;
    Label8: TLabel;
    opCredito: TRectangle;
    Image4: TImage;
    Label9: TLabel;
    opADM: TRectangle;
    Image5: TImage;
    Label10: TLabel;
    btnEnviar: TRectangle;
    Label11: TLabel;
    btnCancelar: TRectangle;
    Label12: TLabel;
    btnConfigurar: TRectangle;
    Label13: TLabel;
    Image6: TImage;
    Label17: TLabel;
    LayoutRight: TLayout;
    LayoutFooter: TLayout;
    Label1: TLabel;
    GridPanelLayout2: TGridPanelLayout;
    layoutLabels: TLayout;
    layoutPagamento: TLayout;
    layoutEdits: TLayout;
    layoutOpcoes_01: TLayout;
    layoutOpcoes_02: TLayout;
    btnImprimir: TRectangle;
    Label15: TLabel;
    GridPanelLayout3: TGridPanelLayout;
    layoutPorta: TLayout;
    layoutSenha: TLayout;
    GridPanelLayout4: TGridPanelLayout;
    Label3: TLabel;
    Label16: TLabel;
    Label18: TLabel;
    bntConsultarStatus: TRectangle;
    Label19: TLabel;
    btnConsultarTimeout: TRectangle;
    Label20: TLabel;
    btnConsultarUltimaTransacao: TRectangle;
    Label21: TLabel;
    btnConfigurarSenha: TRectangle;
    Label22: TLabel;
    btnConfigurarTimeout: TRectangle;
    Label23: TLabel;
    edtTrasacao: TEdit;
    edtStatus: TEdit;
    edtSenha: TEdit;
    edtValor: TEdit;
    edtIP: TEdit;
    edtParcelas: TEdit;
    chckCancelamento: TCheckBox;
    chckSenha: TCheckBox;
    procedure bntConsultarStatusClick(Sender: TObject);
    procedure FormActivate(Sender: TObject);
    procedure btnEnviarClick(Sender: TObject);
    procedure botaoEfeitoMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure botaoEfeitoMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Single);
    procedure opCreditoClick(Sender: TObject);
    procedure opDebitoClick(Sender: TObject);
    procedure opLojaClick(Sender: TObject);
    procedure opADMClick(Sender: TObject);
    procedure opVistaClick(Sender: TObject);
    procedure chckCancelamentoChange(Sender: TObject);
    procedure btnCancelarClick(Sender: TObject);
    procedure btnConsultarTimeoutClick(Sender: TObject);
    procedure btnConsultarUltimaTransacaoClick(Sender: TObject);
    procedure btnConfigurarTimeoutClick(Sender: TObject);
    procedure btnConfigurarClick(Sender: TObject);
    procedure FormShow(Sender: TObject);
    procedure btnImprimirClick(Sender: TObject);
    procedure btnConfigurarSenhaClick(Sender: TObject);
    procedure chckSenhaChange(Sender: TObject);
  private
    function checkParameters:boolean;
    procedure SelecionarFormaDePagamento(forma: FORMA_PAGAMENTO_TYPE);
    procedure SelecionarTipoDeParcelamento(forma: PARCELAMENTO_TYPE);
    function tipoFinanciamentoInt(forma: PARCELAMENTO_TYPE): integer;
    procedure connectServe;
    { Private declarations }
  public
    { Public declarations }
  end;

var
  FrmBridge     : TFrmBridge;

  formaDePagamento   : FORMA_PAGAMENTO_TYPE;
  tipoDeParcelamento : PARCELAMENTO_TYPE;
  senhaHabilitada    : boolean;
const
  IdTransacao     = 0;
  INDEXCSC_EXEMPLO = 1;
  PDV             ='pfvDelphi';
  CSC_EXEMPLO     = 'CODIGO-CSC-CONTRIBUINTE-36-CARACTERES';
  ASS_QR_CODE_EXEMPLO = 'Q5DLkpdRijIRGY6YSSNsTWK1TztHL1vD0V1Jc4spo/CEUqICEb9SFy'+
                        '82ym8EhBRZjbh3btsZhF+sjHqEMR159i4agru9x6KsepK/q0E2e5xl'+
                        'U5cv3m1woYfgHyOkWDNcSdMsS6bBh2Bpq6s89yJ9Q6qh/J8YHi306c'+
                        'e9Tqb/drKvN2XdE5noRSS32TAWuaQEVd7u+TrvXlOQsE3fHR1D5f1s'+
                        'aUwQLPSdIv01NF6Ny7jZwjCwv1uNDgGZONJdlTJ6p0ccqnZvuE70aH'+
                        'OI09elpjEO6Cd+orI7XHHrFCwhFhAcbalc+ZfO5b/+vkyAHS6CYVFC'+
                        'DtYR9Hi5qgdk31v23w==';

implementation

{$R *.fmx}

procedure TFrmBridge.botaoEfeitoMouseDown(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
     TRectangle(Sender).Opacity := 0.7;
end;

procedure TFrmBridge.botaoEfeitoMouseUp(Sender: TObject;
  Button: TMouseButton; Shift: TShiftState; X, Y: Single);
begin
  TRectangle(Sender).Opacity := 1.0;
end;

procedure TFrmBridge.bntConsultarStatusClick(Sender: TObject);
begin
//  bridge_instance.setServer(edtIP.Text,
//                                strtoint(edtTrasacao.Text),
//                                strtoint(edtStatus.Text));
  connectServe();
  ShowMessage(bridge_instance.ConsultarStatus);
end;

function TFrmBridge.tipoFinanciamentoInt(forma: PARCELAMENTO_TYPE):integer;
begin
  // 1 - A vista
  // 2 - ADM
  // 3 - Loja

  Result := 1;
  if forma = LOJA  then
    Result:= 3
  else if forma = ADM then
    Result:= 2

end;

procedure TFrmBridge.btnCancelarClick(Sender: TObject);
var
  data, novo_valor:string;
begin
  data := DateToStr(Date);

  novo_valor := StringReplace(edtValor.Text, ',', '', [rfReplaceAll, rfIgnoreCase]);
  novo_valor := StringReplace(novo_valor, '.', '', [rfReplaceAll, rfIgnoreCase]);

  Log.d('DATETIME: ' +  FormatDateTime('DD/MM/YY', Date));
  Log.d('DATETIME: ' +  FormatDateTime('yyyy-mm-dd"T"hh:nn:ss"Z"', Now));

   {  É necessário declarar DateUtils,
     versões unidoce declare System.DateUtils }
  Log.d('DATETIME: ' + FormatDateTime('dd.mm.yyyy', Today) );

  {  É necessário declarar SysUtils,
     versões unidoce declare System.SysUtils }
  Log.d('DATETIME: ' + FormatDateTime('dd.mm.yyyy', Date) );

  {  É necessário declarar SysUtils,
     versões unidoce declare System.DateUtils }
  //  Aqui vem a hora atual também.
  Log.d('DATETIME: ' + FormatDateTime('dd.mm.yyyy hh:MM:ss', Now) );
  connectServe();
  if TRegEx.IsMatch(edtValor.Text, '^([1-9]\d+)(\,\d{1,2})?$') then
    ShowMessage(bridge_instance.IniciaCancelamentoVenda(IdTransacao,
                                                        PDV,
                                                        novo_valor,
                                                        FormatDateTime('DD/MM/YYYY', Date),
                                                        edtParcelas.Text))
  else
    showmessage('Insira um valor válido - Ex: 18.99 ou 1899 / 1070.56 ou 107056');
end;

procedure TFrmBridge.btnConfigurarClick(Sender: TObject);
begin
  frmDialogOpAdm.EscolherOperacao(
  Procedure
  begin
//    bridge_instance.setServer(edtIP.Text,
//                                strtoint(edtTrasacao.Text),
//                                strtoint(edtStatus.Text));
    connectServe();
    case frmDialogOpAdm.Op of
      ADMINISTRACAO:
        ShowMessage(bridge_instance.IniciaOperacaoAdministrativa(idTransacao, 0, PDV));
      INSTALACAO:
        ShowMessage(bridge_instance.IniciaOperacaoAdministrativa(idTransacao, 1, PDV));
      CONFIGURACAO:
        ShowMessage(bridge_instance.IniciaOperacaoAdministrativa(idTransacao, 2, PDV));
      MANUTENCAO:
        ShowMessage(bridge_instance.IniciaOperacaoAdministrativa(idTransacao, 3, PDV));
      COMUNICACAO:
        ShowMessage(bridge_instance.IniciaOperacaoAdministrativa(idTransacao, 4, PDV));
      COMPROVANTE:
        ShowMessage(bridge_instance.IniciaOperacaoAdministrativa(idTransacao, 5, PDV));
    end;
  end);
end;

procedure TFrmBridge.btnConfigurarSenhaClick(Sender: TObject);
begin
  connectServe();

  frmDialogConfigSenha.EscolherItem(
    Procedure
    begin
      senhaHabilitada:= True;
      ShowMessage(bridge_instance.SetSenhaServer(frmDialogConfigSenha.edtSenha.Text, senhaHabilitada));
      frmDialogConfigSenha.edtSenha.Text := '';
    end,
    Procedure
    begin
      senhaHabilitada:= False;
      ShowMessage(bridge_instance.SetSenhaServer('', senhaHabilitada));
      chckSenha.IsChecked := False;
      edtSenha.text := '';
    end);
end;

procedure TFrmBridge.btnConfigurarTimeoutClick(Sender: TObject);
begin
  frmDialogTimeout.AlterarValor(
  Procedure
  begin
//    bridge_instance.setServer(edtIP.Text,
//                              strtoint(edtTrasacao.Text),
//                              strtoint(edtStatus.Text));
    connectServe();
    ShowMessage(bridge_instance.AtualizarTimeout(strtoint(frmDialogTimeout.ValorTimeout)));
  end);

end;

procedure TFrmBridge.btnConsultarTimeoutClick(Sender: TObject);
begin
//  bridge_instance.setServer(edtIP.Text,
//                                strtoint(edtTrasacao.Text),
//                                strtoint(edtStatus.Text));
  connectServe();
  ShowMessage(bridge_instance.ConsultarTimeout);
end;

procedure TFrmBridge.btnConsultarUltimaTransacaoClick(Sender: TObject);
begin
//  bridge_instance.setServer(edtIP.Text,
//                                strtoint(edtTrasacao.Text),
//                                strtoint(edtStatus.Text));

  connectServe();
  ShowMessage(bridge_instance.ConsultarUltimaTransacao(PDV));
end;

procedure TFrmBridge.btnEnviarClick(Sender: TObject);
var
  novo_valor: string;
begin
  if checkParameters then
  begin
//      bridge_instance.setServer(edtIP.Text,
//                                strtoint(edtTrasacao.Text),
//                                strtoint(edtStatus.Text));

      connectServe();
      novo_valor := StringReplace(edtValor.Text, ',', '', [rfReplaceAll, rfIgnoreCase]);
      novo_valor := StringReplace(novo_valor, '.', '', [rfReplaceAll, rfIgnoreCase]);

      if formaDePagamento = CREDITO then
      begin
        ShowMessage(bridge_instance.IniciaVendaCredito(IdTransacao, tipoFinanciamentoInt(TipoDeParcelamento),
                                                      strtoint(edtParcelas.Text),
                                                      PDV, novo_valor));
      end

      else
      begin
        ShowMessage(bridge_instance.IniciaVendaDebito(IdTransacao,
                                                      PDV, novo_valor));
      end;
  end;

end;

procedure TFrmBridge.btnImprimirClick(Sender: TObject);
begin
  frmDialogCupom.EscolherCupom(
  Procedure
  begin
//    bridge_instance.setServer(edtIP.Text,
//                                strtoint(edtTrasacao.Text),
//                                strtoint(edtStatus.Text));

    connectServe();
    case frmDialogCupom.Cupom of
      NFCE:
        ShowMessage(bridge_instance.ImprimirCupomNfce(CSC_EXEMPLO, INDEXCSC_EXEMPLO));
      SAT:
        ShowMessage(bridge_instance.ImprimirCupomSat());
      SATCANCEL:
        ShowMessage(bridge_instance.ImprimirCupomSatCancelamento(ASS_QR_CODE_EXEMPLO));
    end;
  end);
end;

procedure TFrmBridge.chckCancelamentoChange(Sender: TObject);
begin
  if chckCancelamento.IsChecked = true then
  begin
      Label2.Text := 'CÓDIGO:';
      edtParcelas.Text := '';
      edtParcelas.TextPrompt := '';
      edtParcelas.Enabled:= true;
      btnCancelar.Enabled:= true;
  end
  else if chckCancelamento.IsChecked = false then
  begin
      Label2.Text := 'Nº PARCELAS:';

      if TipoDeParcelamento = AVISTA then edtParcelas.Text := '1'
      else edtParcelas.Text := '2';

      edtParcelas.Enabled:= false;
      btnCancelar.Enabled:= false;
  end;
end;

procedure TFrmBridge.chckSenhaChange(Sender: TObject);
begin
  if chckSenha.IsChecked = True then edtSenha.Enabled := True
  else
  begin
    edtSenha.Text   := '';
    edtSenha.Enabled:=False;;
  end;

end;

function  TFrmBridge.checkParameters:boolean;
begin
  if (edtIP.Text = '') or (edtTrasacao.Text = '') or (edtStatus.Text = '') or
      (edtValor.Text = '') or (edtParcelas.Text = '') then
  begin
    ShowMessage('Informe todos os campos obrigatórios');
         if edtIP.Text = ''       then edtIP.SetFocus
    else if edtTrasacao.Text = '' then edtTrasacao.SetFocus
    else if edtStatus.Text = ''   then edtStatus.SetFocus
    else if edtValor.Text = ''    then edtValor.SetFocus
    else if edtParcelas.Text = '' then edtParcelas.SetFocus;
    Result:= False;
  end

  else if not TRegEx.IsMatch(edtIP.Text,'^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$') then
  begin
    ShowMessage('Digite um IP válido!');
    Result:= False
  end

  else if not TRegEx.IsMatch(edtValor.Text, '^(\d{1,3}(\.\d{3})*|\d+)(\,\d{1,2})?$')then
  begin
    Showmessage('Digite um valor válido: Ex: 18,99 / 1.070,56');
    Result:= False
  end

  else if not strtoint(edtParcelas.Text) > 0 then
  begin
    Showmessage('Insira um nº de parcelas maior que zero!');
    Result:= False
  end
  else
    Result := True
end;

procedure TFrmBridge.connectServe;
begin
  bridge_instance.setServer(edtIP.Text,
                                strtoint(edtTrasacao.Text),
                                strtoint(edtStatus.Text));

  if edtSenha.Text <> '' then
    bridge_instance.SetSenha(edtSenha.Text, True);

end;

procedure TFrmBridge.FormActivate(Sender: TObject);
begin
  SelecionarTipoDeParcelamento(AVISTA);
  SelecionarFormaDePagamento(CREDITO);

  edtValor.Text       := '10,00';
  edtParcelas.Text    := '1';
  edtParcelas.Enabled := False;
  edtIP.Text          := '192.168.0.28';
  edtTrasacao.Text    := '3000';
  edtStatus.Text      := '3001';
  edtSenha.Enabled    := False;
end;

procedure TFrmBridge.FormShow(Sender: TObject);
begin
  frmDialogOpAdm.MainLayout:= LayoutContent;
  frmDialogOpAdm.layoutMain.Parent:= nil;

  frmDialogCupom.MainLayout:= LayoutContent;
  frmDialogCupom.layoutMain.Parent:= nil;

  frmDialogTimeout.MainLayout:= LayoutContent;
  frmDialogTimeout.layoutMain.Parent:= nil;

  frmDialogConfigSenha.MainLayout:= LayoutContent;
  frmDialogConfigSenha.layoutMain.Parent:= nil;
end;

procedure TFrmBridge.opADMClick(Sender: TObject);
begin
  edtParcelas.Text := '2';
  edtParcelas.Enabled:= True;
  SelecionarTipoDeParcelamento(ADM);
end;

procedure TFrmBridge.opCreditoClick(Sender: TObject);
begin
  opLoja.Enabled:= True;
  opADM.Enabled:= True;
  opVista.Enabled:= True;
  SelecionarFormaDePagamento(CREDITO);
end;

procedure TFrmBridge.opDebitoClick(Sender: TObject);
begin
  opLoja.Enabled:= False;
  opADM.Enabled:= False;
  opVista.Enabled:= False;
  SelecionarFormaDePagamento(DEBITO);
end;

procedure TFrmBridge.opLojaClick(Sender: TObject);
begin
  edtParcelas.Text := '2';
  edtParcelas.Enabled:= True;
  SelecionarTipoDeParcelamento(LOJA);
end;

procedure TFrmBridge.opVistaClick(Sender: TObject);
begin
  edtParcelas.Text := '1';
  SelecionarTipoDeParcelamento(AVISTA);
end;

procedure TFrmBridge.SelecionarTipoDeParcelamento(forma: PARCELAMENTO_TYPE);
begin

  opVista.Stroke.Color := TAlphaColors.Black;
  opLoja.Stroke.Color := TAlphaColors.Black;
  opAdm.Stroke.Color := TAlphaColors.Black;

  TipoDeParcelamento := forma;

  case forma of
    AVISTA: opVista.Stroke.Color := TAlphaColors.Greenyellow;
    LOJA: opLoja.Stroke.Color := TAlphaColors.Greenyellow;
    ADM: opADM.Stroke.Color := TAlphaColors.Greenyellow;
  end;

end;


procedure TFrmBridge.SelecionarFormaDePagamento(forma: FORMA_PAGAMENTO_TYPE);
begin
  opCredito.Stroke.Color := TAlphaColors.Black;
  opDebito.Stroke.Color := TAlphaColors.Black;

  formaDePagamento := forma;

  case forma of
    CREDITO: opCredito.Stroke.Color := TAlphaColors.Greenyellow;
    DEBITO: opDebito.Stroke.Color := TAlphaColors.Greenyellow;
  end;

end;

end.
