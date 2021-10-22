unit SAT;

interface
uses
  Androidapi.JNI.GraphicsContentViewText,
  Androidapi.JNI.JavaTypes,
  Androidapi.Helpers,
  Androidapi.JNIBridge,
  Androidapi.JNI.App,
  Androidapi.JNI.Os,
  FMX.Platform,
  FMX.Platform.Android,
  System.Messaging,
  Elgin.JNI.SAT,
  FMX.Graphics,
  FMX.Dialogs
;

type

  TSAT = class(TJavaLocal, JServiceConnection)
  FServiceConn: JServiceConnection;
  usbService : JUSBService;
  handler : JHandler;
  AppEventService: IFMXApplicationEventService;

  constructor Create;
  function HandleAppEvent(AAppEvent: TApplicationEvent; AContext: TObject): Boolean;
  function HandleIntentAction(const Data: JIntent): Boolean;
  procedure HandleActivityMessage(const Sender: TObject; const M: TMessage);
  procedure Start();

  private
  public

  procedure onBindingDied(name: JComponentName); cdecl;
  procedure onServiceConnected(name: JComponentName; service: JIBinder); cdecl;
  procedure onServiceDisconnected(name: JComponentName); cdecl;


  end;



  var
  SatConnection : TSAT;

implementation

{ TSAT }


constructor TSAT.Create;
var
  Intent,ServiceIntent: JIntent;
begin

 // if TPlatformServices.Current.SupportsPlatformService(IFMXApplicationEventService, AppEventService) then
      //AppEventService.SetApplicationEventHandler(HandleAppEvent);

  
    MainActivity.registerIntentAction(StringToJString('com.felhr.usbservice.USB_PERMISSION_GRANTED'));
    MainActivity.registerIntentAction(StringToJString('com.felhr.usbservice.NO_USB'));
    MainActivity.registerIntentAction(StringToJString('com.felhr.usbservice.USB_DISCONNECTED'));
    MainActivity.registerIntentAction(StringToJString('com.felhr.usbservice.USB_NOT_SUPPORTED'));
    MainActivity.registerIntentAction(StringToJString('com.felhr.usbservice.USB_PERMISSION_NOT_GRANTED'));
    TMessageManager.DefaultManager.SubscribeToMessage(TMessageReceivedNotification, HandleActivityMessage);


  handler := TJHandler.Create;

  FServiceConn := TJServiceConnection.Wrap((Self as ILocalObject).GetObjectID);

  Intent := TJIntent.JavaClass.init(StringToJString('br.com.elgin.sat.USBService'));
  Intent.setPackage(StringtoJString('br.com.elgin.sat'));

 // if not TJUSBService.JavaClass.isServiceConnected then
 // begin
 //    TAndroidHelper.Context.getApplicationContext.startService(Intent);
  //end;

  //Intent := TJIntent.JavaClass.init(StringToJString('br.com.elgin.sat.USBService'));
 // Intent.setPackage(StringtoJString('br.com.elgin.sat'));

   //TAndroidHelper.Context.getApplicationContext.bindService(Intent,FServiceConn, TJContext.JavaClass.BIND_AUTO_CREATE);



end;

procedure TSAT.onBindingDied(name: JComponentName);
begin
  //
end;

procedure TSAT.onServiceConnected(name: JComponentName; service: JIBinder);
begin
   //usbService := (service as JUSBService_UsbBinder).getService;
   //usbService.setHandler(handler);
end;

procedure TSAT.onServiceDisconnected(name: JComponentName);
begin
   usbService := nil;
end;

procedure TSAT.Start;
begin

end;

procedure TSAT.HandleActivityMessage(const Sender: TObject; const M: TMessage);
begin
  if M is TMessageReceivedNotification then
    HandleIntentAction(TMessageReceivedNotification(M).Value);
end;

function TSAT.HandleAppEvent(AAppEvent: TApplicationEvent; AContext: TObject): Boolean;
var
  StartupIntent: JIntent;
begin
  Result := False;
  if AAppEvent = TApplicationEvent.BecameActive then
  begin
    StartupIntent := MainActivity.getIntent;
    if StartupIntent <> nil then
      HandleIntentAction(StartupIntent);
  end;
end;

function TSAT.HandleIntentAction(const Data: JIntent): Boolean;
var
  JStr: JString;
begin
  Result := False;
  if (Data <> nil)
  and Data.getAction.equals(StringToJString('com.felhr.usbservice.USB_PERMISSION_GRANTED')) then
  begin
     // TJUSBController.JavaClass.usbService := usbService;
      //ShowMessage('aqui');
  end
  else if (Data <> nil)
  and Data.getAction.equals(StringToJString('com.felhr.usbservice.NO_USB')) then
  begin
    //ShowMessage('aqui');
  end
  else if (Data <> nil)
  and Data.getAction.equals(StringToJString('com.felhr.usbservice.USB_DISCONNECTED')) then
  begin
    // ShowMessage('aqui');
  end
  else if (Data <> nil)
  and Data.getAction.equals(StringToJString('com.felhr.usbservice.USB_NOT_SUPPORTED')) then
  begin
    // ShowMessage('aqui');
  end
  else if (Data <> nil)
  and Data.getAction.equals(StringToJString('com.felhr.usbservice.USB_PERMISSION_NOT_GRANTED')) then
  begin
    //ShowMessage('aqui');
  end;
end;

 initialization

  //SatConnection := TSAT.Create;

end.
