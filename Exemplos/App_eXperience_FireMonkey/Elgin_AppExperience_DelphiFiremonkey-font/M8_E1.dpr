program M8_E1;

{$R *.dres}

uses
  System.StartUpCopy,
  FMX.Forms,
  MainForm in 'MainForm.pas' {frmMain},
  TefForm in 'TefForm.pas' {frmTEF},
  SatForm in 'SatForm.pas' {frmSAT},
  ImpressoraForm in 'ImpressoraForm.pas' {frmImpressora},
  Printer in 'Printer.pas',
  BarcodeForm in 'BarcodeForm.pas' {frmBarcode},
  PayGo in 'PayGo.pas',
  Tef.Types in 'Tef.Types.pas',
  MsiTef in 'MsiTef.pas',
  ShipayForm in 'ShipayForm.pas' {frmShipay},
  BalancaForm in 'BalancaForm.pas' {frmBalanca},
  ToastMessage in 'ToastMessage.pas',
  DialogForm in 'DialogForm.pas' {FrmDialog},
  SatLib in 'SatLib.pas',
  BridgeForm in 'BridgeForm.pas' {FrmBridge},
  Bridge in 'Bridge.pas',
  DialogOpAdmForm in 'DialogOpAdmForm.pas' {frmDialogOpAdm},
  Bridge.Types in 'Bridge.Types.pas',
  DialogCupomForm in 'DialogCupomForm.pas' {frmDialogCupom},
  DialogTimeoutForm in 'DialogTimeoutForm.pas' {frmDialogTimeout},
  DialogConfigSenhaForm in 'DialogConfigSenhaForm.pas' {frmDialogConfigSenha},
  NFCeForm in 'NFCeForm.pas' {FrmNFCe},
  It4r in 'It4r.pas',
  TefElgin in 'TefElgin.pas',
  Elgin.JNI.Daruma in 'libs\Elgin.JNI.Daruma.pas',
  Elgin.JNI.Sat in 'libs\Elgin.JNI.Sat.pas',
  PixForm in 'PixForm.pas' {FrmPix4},
  Pix4 in 'Pix4.pas',
  KioskiForm in 'KioskiForm.pas' {FrmKioski},
  Kioski in 'Kioski.pas',
  Elgin.JNI.E1 in 'libs\Elgin.JNI.E1.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.CreateForm(TfrmMain, frmMain);
  Application.CreateForm(TFrmNFCe, FrmNFCe);
  Application.CreateForm(TFrmDialog, FrmDialog);
  Application.CreateForm(TfrmTEF, frmTEF);
  Application.CreateForm(TfrmImpressora, frmImpressora);
  Application.CreateForm(TfrmBarcode, frmBarcode);
  Application.CreateForm(TfrmShipay, frmShipay);
  Application.CreateForm(TfrmBalanca, frmBalanca);
  Application.CreateForm(TfrmSAT, frmSAT);
  Application.CreateForm(TFrmBridge, FrmBridge);
  Application.CreateForm(TfrmDialogOpAdm, frmDialogOpAdm);
  Application.CreateForm(TfrmDialogCupom, frmDialogCupom);
  Application.CreateForm(TfrmDialogTimeout, frmDialogTimeout);
  Application.CreateForm(TfrmDialogConfigSenha, frmDialogConfigSenha);
  Application.CreateForm(TFrmPix4, FrmPix4);
  Application.CreateForm(TFrmKioski, FrmKioski);
  Application.Run;
end.
