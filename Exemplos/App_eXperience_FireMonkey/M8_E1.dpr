program M8_E1;

{$R *.dres}

uses
  System.StartUpCopy,
  FMX.Forms,
  MainForm in 'MainForm.pas' {frmMain},
  TefForm in 'TefForm.pas' {frmTEF},
  SatForm in 'SatForm.pas' {frmSAT},
  Elgin.JNI.SAT in 'libs\Elgin.JNI.SAT.pas',
  Elgin.JNI.E1 in 'libs\Elgin.JNI.E1.pas',
  ImpressoraForm in 'ImpressoraForm.pas' {frmImpressora},
  Printer in 'Printer.pas',
  BarcodeForm in 'BarcodeForm.pas' {frmBarcode},
  SAT in 'SAT.pas',
  SATService in 'SATService.pas',
  Elgin.JNI.InterfaceAutomacao in 'libs\Elgin.JNI.InterfaceAutomacao.pas',
  PayGo in 'PayGo.pas',
  Tef.Types in 'Tef.Types.pas',
  MsiTef in 'MsiTef.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.CreateForm(TfrmMain, frmMain);
  Application.CreateForm(TfrmTEF, frmTEF);
  Application.CreateForm(TfrmSAT, frmSAT);
  Application.CreateForm(TfrmImpressora, frmImpressora);
  Application.CreateForm(TfrmBarcode, frmBarcode);
  Application.Run;
end.
