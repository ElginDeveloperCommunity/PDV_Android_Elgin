unit ToastMessage;

interface

uses System.SysUtils, System.UITypes, System.Classes, System.DateUtils,
     FMX.Ani, FMX.Types, FMX.Forms, FMX.Layouts, FMX.Objects;

type
  TToastPosition = (tpTop, tpBottom);

  TToastMessage = class
  published
    class procedure show(text : String; Second : Integer = 3; Height : Integer = 40; position : TToastPosition = TToastPosition.tpTop);
  end;

implementation

Var lyContainer : TLayout;
    lyBorder    : TRoundRect;
    flAnimation : TFloatAnimation;
    txMessage   : TText;
{ TToastMessage }

class procedure TToastMessage.show(text: String; Second: Integer; Height : Integer; position : TToastPosition);
const
    TextCollor    : TAlphaColor = TAlphaColorRec.White;
    BalloonCollor : TAlphaColor = TAlphaColorRec.Black;
Var
    thr : TThread;
    timeNow, timeFinish : TTime;
begin
  if (screen.ActiveForm <> nil) then
  begin
     //HIDE CONTROLS IF EXISTS
     if (assigned(lyBorder)) then
        lyBorder.Visible         := false;
     if (assigned(lyContainer)) then
        lyContainer.Visible      := false;

     //CREATE NOTIFICATION
     if not assigned(lyContainer) then
        lyContainer              := TLayout.Create(screen.ActiveForm);
     lyContainer.Parent          := screen.ActiveForm;
     lyContainer.Width           := screen.ActiveForm.ClientWidth;
     lyContainer.Height          := Height;
     lyContainer.Position.X      := 0;
     lyContainer.Tag             := 0; {0 = ABRINDO NOVA MENSAGEM | 1 = AINDA EM EXECUCAO}

     if (position = TToastPosition.tpTop) then
        lyContainer.Position.Y   := 5
     else if (position = TToastPosition.tpBottom) then
        lyContainer.Position.Y   := screen.ActiveForm.ClientHeight - lyContainer.Height - 20;

     lyContainer.Visible         := true;
     if not (assigned(lyBorder)) then
        lyBorder                 := TRoundRect.Create(lyContainer);
     lyBorder.Parent             := lyContainer;
     lyBorder.Align              := TAlignLayout.Center;
     lyBorder.Stroke.Thickness   := 2;
     lyBorder.Stroke.Color       := TAlphaColorRec.White;
     lyBorder.fill.Color         := BalloonCollor;
     lyBorder.Height             := lyContainer.Height;
     lyBorder.Visible            := true;

     if not (assigned(flAnimation)) then
        flAnimation := TFloatAnimation.Create(lyBorder);
     flAnimation.Enabled         := false;
     flAnimation.Inverse         := false;
     flAnimation.Parent          := lyBorder;
     flAnimation.AnimationType   := TAnimationType.InOut;
     flAnimation.Interpolation   := TInterpolationType.Exponential;
     flAnimation.PropertyName    := 'Width';
     flAnimation.Duration        := 0.5;
     flAnimation.StartValue      := 40;
     flAnimation.StopValue       := lyContainer.Width - 10;
     flAnimation.Start;

     if not (Assigned(txMessage)) then
        txMessage                      := TText.Create(lyBorder);
     txMessage.Visible                 := false;
     txMessage.Parent                  := lyBorder;
     txMessage.Align                   := TAlignLayout.Client;
     txMessage.TextSettings.FontColor  := TextCollor;
     txMessage.TextSettings.Font.Size  := 14;
     txMessage.TextSettings.Font.Style := [];
     txMessage.TextSettings.WordWrap   := true;
     txMessage.Text                    := text;

     thr := TThread.CreateAnonymousThread(procedure
         begin
            Sleep(300);
            TThread.Synchronize(nil, procedure begin txMessage.Visible := true; end);

            timeNow := time;
            timeFinish := time;
            timeFinish := IncSecond(timeFinish, Second);
            lyContainer.Tag := 1;
            while (timeFinish >= timeNow) and (lyContainer.Tag = 1) do
            begin
               Sleep(100);
               timeNow := time;
            end;

            if (lyContainer.Tag = 1) then {S� FINALIZA O COMPONENTE SE N�O FOI SOBREPOSTO POR OUTRA MENSAGEM}
            begin
               TThread.Synchronize(nil, procedure
                       begin
                          flAnimation.Inverse := true;
                          flAnimation.Start;
                          txMessage.Visible := false;
                       end);

               Sleep( 350 );
               TThread.Synchronize(nil, procedure
                       begin
                          lyContainer.Visible := false;
                       end);
             end;
         end);
     thr.FreeOnTerminate := true;
     thr.Start;
  end else
     raise Exception.Create('Desculpe, não foi possível exibir a notificação pois não existe nenhum formulário acessível no momento.');
end;

end.
