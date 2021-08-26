program Elgin;

uses
  System.StartUpCopy,
  FMX.Forms,
  untMain in 'untMain.pas' {Form1};

{$R *.res}

begin
  Application.Initialize;
  Application.CreateForm(TForm1, Form1);
  Application.Run;
end.
