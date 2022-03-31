
unit Elgin.JNI.Sat;

interface

uses
  Androidapi.JNIBridge,
  Androidapi.JNI.GraphicsContentViewText,
  Androidapi.JNI.JavaTypes,
  Androidapi.JNI.Net,
  Androidapi.JNI.Os;

type
// ===== Forward declarations =====

  JUsbConfiguration = interface;//android.hardware.usb.UsbConfiguration
  JUsbDevice = interface;//android.hardware.usb.UsbDevice
  JUsbDeviceConnection = interface;//android.hardware.usb.UsbDeviceConnection
  JUsbEndpoint = interface;//android.hardware.usb.UsbEndpoint
  JUsbInterface = interface;//android.hardware.usb.UsbInterface
  JUsbRequest = interface;//android.hardware.usb.UsbRequest
  JAppInitializer = interface;//androidx.startup.AppInitializer
  JInitializationProvider = interface;//androidx.startup.InitializationProvider
  JInitializer = interface;//androidx.startup.Initializer
  JStartupException = interface;//androidx.startup.StartupException
  JStartupLogger = interface;//androidx.startup.StartupLogger
  JDeviceInfo = interface;//br.com.elgin.DeviceInfo
  JInternalPointerMarker = interface;//br.com.elgin.InternalPointerMarker
  JJNIReachabilityFence = interface;//br.com.elgin.JNIReachabilityFence
  JSat = interface;//br.com.elgin.Sat
  JSatInitializer = interface;//br.com.elgin.SatInitializer
  JSatInitializer_1 = interface;//br.com.elgin.SatInitializer$1
  JSatInitializer_2 = interface;//br.com.elgin.SatInitializer$2
  JSatInitializer_Tuple = interface;//br.com.elgin.SatInitializer$Tuple
  Jsat_BuildConfig = interface;//br.com.elgin.sat.BuildConfig
  JCH34xIds = interface;//com.felhr.deviceids.CH34xIds
  JCH34xIds_ConcreteDevice = interface;//com.felhr.deviceids.CH34xIds$ConcreteDevice
  JCP210xIds = interface;//com.felhr.deviceids.CP210xIds
  JCP210xIds_ConcreteDevice = interface;//com.felhr.deviceids.CP210xIds$ConcreteDevice
  JCP2130Ids = interface;//com.felhr.deviceids.CP2130Ids
  JCP2130Ids_ConcreteDevice = interface;//com.felhr.deviceids.CP2130Ids$ConcreteDevice
  JFTDISioIds = interface;//com.felhr.deviceids.FTDISioIds
  JFTDISioIds_ConcreteDevice = interface;//com.felhr.deviceids.FTDISioIds$ConcreteDevice
  JPL2303Ids = interface;//com.felhr.deviceids.PL2303Ids
  JPL2303Ids_ConcreteDevice = interface;//com.felhr.deviceids.PL2303Ids$ConcreteDevice
  JXdcVcpIds = interface;//com.felhr.deviceids.XdcVcpIds
  JXdcVcpIds_ConcreteDevice = interface;//com.felhr.deviceids.XdcVcpIds$ConcreteDevice
  JUsbSerialInterface = interface;//com.felhr.usbserial.UsbSerialInterface
  JUsbSerialDevice = interface;//com.felhr.usbserial.UsbSerialDevice
  JBLED112SerialDevice = interface;//com.felhr.usbserial.BLED112SerialDevice
  Jusbserial_BuildConfig = interface;//com.felhr.usbserial.BuildConfig
  JCDCSerialDevice = interface;//com.felhr.usbserial.CDCSerialDevice
  JCH34xSerialDevice = interface;//com.felhr.usbserial.CH34xSerialDevice
  JCH34xSerialDevice_FlowControlThread = interface;//com.felhr.usbserial.CH34xSerialDevice$FlowControlThread
  JCP2102SerialDevice = interface;//com.felhr.usbserial.CP2102SerialDevice
  JCP2102SerialDevice_FlowControlThread = interface;//com.felhr.usbserial.CP2102SerialDevice$FlowControlThread
  JUsbSpiInterface = interface;//com.felhr.usbserial.UsbSpiInterface
  JUsbSpiDevice = interface;//com.felhr.usbserial.UsbSpiDevice
  JCP2130SpiDevice = interface;//com.felhr.usbserial.CP2130SpiDevice
  JFTDISerialDevice = interface;//com.felhr.usbserial.FTDISerialDevice
  JFTDISerialDevice_FTDIUtilities = interface;//com.felhr.usbserial.FTDISerialDevice$FTDIUtilities
  JPL2303SerialDevice = interface;//com.felhr.usbserial.PL2303SerialDevice
  JSerialBuffer = interface;//com.felhr.usbserial.SerialBuffer
  JSerialBuffer_SynchronizedBuffer = interface;//com.felhr.usbserial.SerialBuffer$SynchronizedBuffer
  JSerialInputStream = interface;//com.felhr.usbserial.SerialInputStream
  JSerialOutputStream = interface;//com.felhr.usbserial.SerialOutputStream
  JUsbSerialDebugger = interface;//com.felhr.usbserial.UsbSerialDebugger
  JUsbSerialDevice_ReadThread = interface;//com.felhr.usbserial.UsbSerialDevice$ReadThread
  JUsbSerialDevice_WorkerThread = interface;//com.felhr.usbserial.UsbSerialDevice$WorkerThread
  JUsbSerialDevice_WriteThread = interface;//com.felhr.usbserial.UsbSerialDevice$WriteThread
  JUsbSerialInterface_UsbBreakCallback = interface;//com.felhr.usbserial.UsbSerialInterface$UsbBreakCallback
  JUsbSerialInterface_UsbCTSCallback = interface;//com.felhr.usbserial.UsbSerialInterface$UsbCTSCallback
  JUsbSerialInterface_UsbDSRCallback = interface;//com.felhr.usbserial.UsbSerialInterface$UsbDSRCallback
  JUsbSerialInterface_UsbFrameCallback = interface;//com.felhr.usbserial.UsbSerialInterface$UsbFrameCallback
  JUsbSerialInterface_UsbOverrunCallback = interface;//com.felhr.usbserial.UsbSerialInterface$UsbOverrunCallback
  JUsbSerialInterface_UsbParityCallback = interface;//com.felhr.usbserial.UsbSerialInterface$UsbParityCallback
  JUsbSerialInterface_UsbReadCallback = interface;//com.felhr.usbserial.UsbSerialInterface$UsbReadCallback
  JUsbSpiDevice_ReadThread = interface;//com.felhr.usbserial.UsbSpiDevice$ReadThread
  JUsbSpiDevice_WriteThread = interface;//com.felhr.usbserial.UsbSpiDevice$WriteThread
  JUsbSpiInterface_UsbMISOCallback = interface;//com.felhr.usbserial.UsbSpiInterface$UsbMISOCallback
  JXdcVcpSerialDevice = interface;//com.felhr.usbserial.XdcVcpSerialDevice
  JHexData = interface;//com.felhr.utils.HexData
  JAbstractQueue = interface;//java.util.AbstractQueue
  JArrayBlockingQueue = interface;//java.util.concurrent.ArrayBlockingQueue

// ===== Interface declarations =====

  JUsbConfigurationClass = interface(JObjectClass)
    ['{98469519-6EAB-4A27-9B06-2C4A07DC51C8}']
    {class} function _GetCREATOR: JParcelable_Creator; cdecl;
    {class} function getInterface(index: Integer): JUsbInterface; cdecl;//Deprecated
    {class} function getInterfaceCount: Integer; cdecl;//Deprecated
    {class} function getMaxPower: Integer; cdecl;//Deprecated
    {class} function toString: JString; cdecl;//Deprecated
    {class} procedure writeToParcel(parcel: JParcel; flags: Integer); cdecl;//Deprecated
    {class} property CREATOR: JParcelable_Creator read _GetCREATOR;
  end;

  [JavaSignature('android/hardware/usb/UsbConfiguration')]
  JUsbConfiguration = interface(JObject)
    ['{3CAF57A3-D977-4A31-BD15-1CFDE08316F5}']
    function describeContents: Integer; cdecl;//Deprecated
    function getId: Integer; cdecl;//Deprecated
    function getName: JString; cdecl;//Deprecated
    function isRemoteWakeup: Boolean; cdecl;//Deprecated
    function isSelfPowered: Boolean; cdecl;//Deprecated
  end;
  TJUsbConfiguration = class(TJavaGenericImport<JUsbConfigurationClass, JUsbConfiguration>) end;

  JUsbDeviceClass = interface(JObjectClass)
    ['{23359F82-699F-48E1-B1DD-43DD18455D2D}']
    {class} function _GetCREATOR: JParcelable_Creator; cdecl;
    {class} function describeContents: Integer; cdecl;//Deprecated
    {class} function equals(o: JObject): Boolean; cdecl;//Deprecated
    {class} function getDeviceId: Integer; cdecl; overload;//Deprecated
    {class} function getDeviceId(name: JString): Integer; cdecl; overload;//Deprecated
    {class} function getDeviceName: JString; cdecl; overload;//Deprecated
    {class} function getDeviceName(id: Integer): JString; cdecl; overload;//Deprecated
    {class} function getInterface(index: Integer): JUsbInterface; cdecl;//Deprecated
    {class} function getInterfaceCount: Integer; cdecl;//Deprecated
    {class} function getSerialNumber: JString; cdecl;//Deprecated
    {class} function getVendorId: Integer; cdecl;//Deprecated
    {class} function getVersion: JString; cdecl;//Deprecated
    {class} property CREATOR: JParcelable_Creator read _GetCREATOR;
  end;

  [JavaSignature('android/hardware/usb/UsbDevice')]
  JUsbDevice = interface(JObject)
    ['{EAD5113C-AC54-4131-BED2-46F449FFD4B7}']
    function getConfiguration(index: Integer): JUsbConfiguration; cdecl;//Deprecated
    function getConfigurationCount: Integer; cdecl;//Deprecated
    function getDeviceClass: Integer; cdecl;//Deprecated
    function getDeviceProtocol: Integer; cdecl;//Deprecated
    function getDeviceSubclass: Integer; cdecl;//Deprecated
    function getManufacturerName: JString; cdecl;//Deprecated
    function getProductId: Integer; cdecl;//Deprecated
    function getProductName: JString; cdecl;//Deprecated
    function hashCode: Integer; cdecl;
    function toString: JString; cdecl;
    procedure writeToParcel(parcel: JParcel; flags: Integer); cdecl;
  end;
  TJUsbDevice = class(TJavaGenericImport<JUsbDeviceClass, JUsbDevice>) end;

  JUsbDeviceConnectionClass = interface(JObjectClass)
    ['{83888555-657F-42A1-9BC1-8B23E2F69899}']
    {class} procedure close; cdecl;
    {class} function controlTransfer(requestType: Integer; request: Integer; value: Integer; index: Integer; buffer: TJavaArray<Byte>; length: Integer; timeout: Integer): Integer; cdecl; overload;
    {class} function controlTransfer(requestType: Integer; request: Integer; value: Integer; index: Integer; buffer: TJavaArray<Byte>; offset: Integer; length: Integer; timeout: Integer): Integer; cdecl; overload;
    {class} function releaseInterface(intf: JUsbInterface): Boolean; cdecl;
    {class} function requestWait: JUsbRequest; cdecl;
    {class} function setConfiguration(configuration: JUsbConfiguration): Boolean; cdecl;
  end;

  [JavaSignature('android/hardware/usb/UsbDeviceConnection')]
  JUsbDeviceConnection = interface(JObject)
    ['{6CC94621-8592-4C7F-B28A-2E644692B85A}']
    function bulkTransfer(endpoint: JUsbEndpoint; buffer: TJavaArray<Byte>; length: Integer; timeout: Integer): Integer; cdecl; overload;
    function bulkTransfer(endpoint: JUsbEndpoint; buffer: TJavaArray<Byte>; offset: Integer; length: Integer; timeout: Integer): Integer; cdecl; overload;
    function claimInterface(intf: JUsbInterface; force: Boolean): Boolean; cdecl;
    function getFileDescriptor: Integer; cdecl;
    function getRawDescriptors: TJavaArray<Byte>; cdecl;
    function getSerial: JString; cdecl;
    function setInterface(intf: JUsbInterface): Boolean; cdecl;//Deprecated
  end;
  TJUsbDeviceConnection = class(TJavaGenericImport<JUsbDeviceConnectionClass, JUsbDeviceConnection>) end;

  JUsbEndpointClass = interface(JObjectClass)
    ['{53DC559E-4126-4589-9CDF-681B6A461496}']
    {class} function _GetCREATOR: JParcelable_Creator; cdecl;
    {class} function getAddress: Integer; cdecl;//Deprecated
    {class} function getAttributes: Integer; cdecl;//Deprecated
    {class} function getDirection: Integer; cdecl;//Deprecated
    {class} function getType: Integer; cdecl;
    {class} function toString: JString; cdecl;
    {class} procedure writeToParcel(parcel: JParcel; flags: Integer); cdecl;
    {class} property CREATOR: JParcelable_Creator read _GetCREATOR;
  end;

  [JavaSignature('android/hardware/usb/UsbEndpoint')]
  JUsbEndpoint = interface(JObject)
    ['{A9A1F612-B537-4C37-8523-1B7AEADB1D43}']
    function describeContents: Integer; cdecl;//Deprecated
    function getEndpointNumber: Integer; cdecl;
    function getInterval: Integer; cdecl;
    function getMaxPacketSize: Integer; cdecl;
  end;
  TJUsbEndpoint = class(TJavaGenericImport<JUsbEndpointClass, JUsbEndpoint>) end;

  JUsbInterfaceClass = interface(JObjectClass)
    ['{59313EE2-7603-4BBC-ACBC-4BC863D31B6C}']
    {class} function _GetCREATOR: JParcelable_Creator; cdecl;
    {class} function describeContents: Integer; cdecl;
    {class} function getAlternateSetting: Integer; cdecl;
    {class} function getInterfaceClass: Integer; cdecl;
    {class} function getInterfaceProtocol: Integer; cdecl;
    {class} function getInterfaceSubclass: Integer; cdecl;
    {class} procedure writeToParcel(parcel: JParcel; flags: Integer); cdecl;
    {class} property CREATOR: JParcelable_Creator read _GetCREATOR;
  end;

  [JavaSignature('android/hardware/usb/UsbInterface')]
  JUsbInterface = interface(JObject)
    ['{026556E6-07DF-422D-AF28-BC06795B91E7}']
    function getEndpoint(index: Integer): JUsbEndpoint; cdecl;
    function getEndpointCount: Integer; cdecl;
    function getId: Integer; cdecl;
    function getName: JString; cdecl;
    function toString: JString; cdecl;
  end;
  TJUsbInterface = class(TJavaGenericImport<JUsbInterfaceClass, JUsbInterface>) end;

  JUsbRequestClass = interface(JObjectClass)
    ['{8A8E6489-7B33-4CCC-B25E-2847FD29DA80}']
    {class} function init: JUsbRequest; cdecl;
    {class} procedure close; cdecl;
    {class} function getClientData: JObject; cdecl;
    {class} function getEndpoint: JUsbEndpoint; cdecl;
  end;

  [JavaSignature('android/hardware/usb/UsbRequest')]
  JUsbRequest = interface(JObject)
    ['{C192EBAE-64F9-46FD-9E81-CB44E9D42FB1}']
    function cancel: Boolean; cdecl;
    function initialize(connection: JUsbDeviceConnection; endpoint: JUsbEndpoint): Boolean; cdecl;
    function queue(buffer: JByteBuffer; length: Integer): Boolean; cdecl;
    procedure setClientData(data: JObject); cdecl;
  end;
  TJUsbRequest = class(TJavaGenericImport<JUsbRequestClass, JUsbRequest>) end;

  JAppInitializerClass = interface(JObjectClass)
    ['{A7A685EE-6B70-48FC-9EE8-1D22BDA9CBC8}']
    {class} function getInstance(context: JContext): JAppInitializer; cdecl;
  end;

  [JavaSignature('androidx/startup/AppInitializer')]
  JAppInitializer = interface(JObject)
    ['{8AF54DF2-6A9B-4B8F-97C3-EB70B14713C6}']
    function initializeComponent(class_: Jlang_Class): JObject; cdecl;
    function isEagerlyInitialized(class_: Jlang_Class): Boolean; cdecl;
  end;
  TJAppInitializer = class(TJavaGenericImport<JAppInitializerClass, JAppInitializer>) end;

  JInitializationProviderClass = interface(JContentProviderClass)
    ['{492E1B85-FCD3-4171-BDC0-73ADE9E816E5}']
    {class} function init: JInitializationProvider; cdecl;
  end;

  [JavaSignature('androidx/startup/InitializationProvider')]
  JInitializationProvider = interface(JContentProvider)
    ['{8433AC14-6BA5-4EBA-AD4E-E82A78015D01}']
    function delete(uri: Jnet_Uri; string_: JString; string_1: TJavaObjectArray<JString>): Integer; cdecl;
    function getType(uri: Jnet_Uri): JString; cdecl;
    function insert(uri: Jnet_Uri; contentValues: JContentValues): Jnet_Uri; cdecl;
    function onCreate: Boolean; cdecl;
    function query(uri: Jnet_Uri; string_: TJavaObjectArray<JString>; string_1: JString; string_2: TJavaObjectArray<JString>; string_3: JString): JCursor; cdecl;
    function update(uri: Jnet_Uri; contentValues: JContentValues; string_: JString; string_1: TJavaObjectArray<JString>): Integer; cdecl;
  end;
  TJInitializationProvider = class(TJavaGenericImport<JInitializationProviderClass, JInitializationProvider>) end;

  JInitializerClass = interface(IJavaClass)
    ['{5161E267-F586-41C2-B116-6F55B0581131}']
  end;

  [JavaSignature('androidx/startup/Initializer')]
  JInitializer = interface(IJavaInstance)
    ['{69FBA8B2-2F6B-4E0E-B9BB-17E81795EFAF}']
    function create(context: JContext): JObject; cdecl;
    function dependencies: JList; cdecl;
  end;
  TJInitializer = class(TJavaGenericImport<JInitializerClass, JInitializer>) end;

  JStartupExceptionClass = interface(JRuntimeExceptionClass)
    ['{3663883C-54BA-4A7B-943D-E1DC2B10E5A0}']
    {class} function init(throwable: JThrowable): JStartupException; cdecl; overload;
    {class} function init(string_: JString): JStartupException; cdecl; overload;
    {class} function init(string_: JString; throwable: JThrowable): JStartupException; cdecl; overload;
  end;

  [JavaSignature('androidx/startup/StartupException')]
  JStartupException = interface(JRuntimeException)
    ['{0FF514B3-A4D3-4828-8959-9670D0F1AEFF}']
  end;
  TJStartupException = class(TJavaGenericImport<JStartupExceptionClass, JStartupException>) end;

  JStartupLoggerClass = interface(JObjectClass)
    ['{64013467-56F0-48B1-95E4-FC6EB5DDDAF4}']
    {class} procedure e(string_: JString; throwable: JThrowable); cdecl;
    {class} procedure i(string_: JString); cdecl;
  end;

  [JavaSignature('androidx/startup/StartupLogger')]
  JStartupLogger = interface(JObject)
    ['{752D58B0-63C9-4CB9-B34C-8EB36B4F73DA}']
  end;
  TJStartupLogger = class(TJavaGenericImport<JStartupLoggerClass, JStartupLogger>) end;

  JDeviceInfoClass = interface(JObjectClass)
    ['{E56A991F-BB9E-40E8-B499-08706F4D95E8}']
    {class} function init: JDeviceInfo; cdecl; overload;//Deprecated
  end;

  [JavaSignature('br/com/elgin/DeviceInfo')]
  JDeviceInfo = interface(JObject)
    ['{FFBD501A-8DD2-4721-A745-7738CD2DA897}']
    function asJson: JString; cdecl;
    procedure delete; cdecl;
    function getBus: SmallInt; cdecl;
    function getDeviceModel: JString; cdecl;
    function getPort: SmallInt; cdecl;
    function getSerial: JString; cdecl;
    function toString: JString; cdecl;
  end;
  TJDeviceInfo = class(TJavaGenericImport<JDeviceInfoClass, JDeviceInfo>) end;

  JInternalPointerMarkerClass = interface(JEnumClass)
    ['{575431D4-72F2-4E24-B4ED-8BC3AA49CAAE}']
    {class} function _GetRAW_PTR: JInternalPointerMarker; cdecl;
    {class} function valueOf(string_: JString): JInternalPointerMarker; cdecl;
    {class} function values: TJavaObjectArray<JInternalPointerMarker>; cdecl;
    {class} property RAW_PTR: JInternalPointerMarker read _GetRAW_PTR;
  end;

  [JavaSignature('br/com/elgin/InternalPointerMarker')]
  JInternalPointerMarker = interface(JEnum)
    ['{B1827AB7-4B81-4870-AFCC-7DF06C0D3371}']
  end;
  TJInternalPointerMarker = class(TJavaGenericImport<JInternalPointerMarkerClass, JInternalPointerMarker>) end;

  JJNIReachabilityFenceClass = interface(JObjectClass)
    ['{48AE5551-E623-4169-B603-A877D4157515}']
  end;

  [JavaSignature('br/com/elgin/JNIReachabilityFence')]
  JJNIReachabilityFence = interface(JObject)
    ['{A747D332-B247-47D0-8C6D-895EE4461BD0}']
  end;
  TJJNIReachabilityFence = class(TJavaGenericImport<JJNIReachabilityFenceClass, JJNIReachabilityFence>) end;

  JSatClass = interface(JObjectClass)
    ['{0FA0FED2-9F19-4468-9CA5-3A95841736E3}']
    {class} function associarAssinatura(i: Integer; string_: JString; string_1: JString; string_2: JString): JString; cdecl;
    {class} function ativarSat(i: Integer; i1: Integer; string_: JString; string_1: JString; i2: Integer): JString; cdecl;
    {class} function atualizarSoftwareSat(i: Integer; string_: JString): JString; cdecl;
    {class} function bloquearSat(i: Integer; string_: JString): JString; cdecl;
    {class} function cancelarUltimaVenda(i: Integer; string_: JString; string_1: JString; string_2: JString): JString; cdecl;
    {class} function clearFiltersSat: Integer; cdecl;
    {class} function comunicarCertificadoIcpbrasil(i: Integer; string_: JString; string_1: JString): JString; cdecl;
    {class} function configurarInterfaceDeRede(i: Integer; string_: JString; string_1: JString): JString; cdecl;
    {class} function consultarNumeroSessao(i: Integer; string_: JString; i1: Integer): JString; cdecl;
    {class} function consultarSat(i: Integer): JString; cdecl;
    {class} function consultarStatusOperacional(i: Integer; string_: JString): JString; cdecl;
    {class} function consultarUltimaSessaoFiscal(i: Integer; string_: JString): JString; cdecl;
    {class} function desbloquearSat(i: Integer; string_: JString): JString; cdecl;
    {class} procedure disableContinuousConnection; cdecl;
    {class} procedure disableProtocolCompression; cdecl;
    {class} procedure enableContinuousConnection; cdecl;
    {class} procedure enableProtocolCompression; cdecl;
    {class} function enviarDadosVenda(i: Integer; string_: JString; string_1: JString): JString; cdecl;
    {class} function extrairLogs(i: Integer; string_: JString): JString; cdecl;
    {class} function filterSatSerialNumber(string_: JString): Integer; cdecl;
    {class} function filterSatUsb(l: Int64; l1: Int64): Integer; cdecl;
    {class} function gerarNumeroSessao: Integer; cdecl;
    {class} function getDeviceInfo: JDeviceInfo; cdecl;
    {class} function init: JSat; cdecl; overload;//Deprecated
    {class} function listAvailableSat: TJavaObjectArray<JDeviceInfo>; cdecl;
    {class} procedure loadLibrary; cdecl;
    {class} procedure pushDeviceDescriptor(i: Integer); cdecl;
    {class} function testeFimAFim(i: Integer; string_: JString; string_1: JString): JString; cdecl;
    {class} function trocarCodigoDeAtivacao(i: Integer; string_: JString; i1: Integer; string_1: JString; string_2: JString): JString; cdecl;
  end;

  [JavaSignature('br/com/elgin/Sat')]
  JSat = interface(JObject)
    ['{52879937-20F2-4181-8815-D3C751ED0297}']
    procedure delete; cdecl;
  end;
  TJSat = class(TJavaGenericImport<JSatClass, JSat>) end;

  JSatInitializerClass = interface(JInitializerClass)
    ['{7618D44E-C880-430F-A155-A308A732D368}']
    {class} function init: JSatInitializer; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/elgin/SatInitializer')]
  JSatInitializer = interface(JInitializer)
    ['{1F7D817F-5859-40E7-8C18-E8E3BE4DD678}']
    function create(context: JContext): JSat; cdecl;
    function dependencies: JList; cdecl;
  end;
  TJSatInitializer = class(TJavaGenericImport<JSatInitializerClass, JSatInitializer>) end;

  JSatInitializer_1Class = interface(JBroadcastReceiverClass)
    ['{D4C61F80-BAA8-4329-BF22-DFD91A23A8D9}']
  end;

  [JavaSignature('br/com/elgin/SatInitializer$1')]
  JSatInitializer_1 = interface(JBroadcastReceiver)
    ['{DB280956-C67A-4E8C-89D2-181731D0F0F8}']
    procedure onReceive(context: JContext; intent: JIntent); cdecl;
  end;
  TJSatInitializer_1 = class(TJavaGenericImport<JSatInitializer_1Class, JSatInitializer_1>) end;

  JSatInitializer_2Class = interface(JBroadcastReceiverClass)
    ['{C86D6184-9C1E-4890-B1C7-782F22049E99}']
  end;

  [JavaSignature('br/com/elgin/SatInitializer$2')]
  JSatInitializer_2 = interface(JBroadcastReceiver)
    ['{FFB75E26-CA63-4794-A8E4-73BBE26E9B7C}']
    procedure onReceive(context: JContext; intent: JIntent); cdecl;
  end;
  TJSatInitializer_2 = class(TJavaGenericImport<JSatInitializer_2Class, JSatInitializer_2>) end;

  JSatInitializer_TupleClass = interface(JObjectClass)
    ['{5E67992A-BB97-4DB2-8D7A-CE9E9C0A985C}']
    {class} function init(i: Integer; i1: Integer): JSatInitializer_Tuple; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/elgin/SatInitializer$Tuple')]
  JSatInitializer_Tuple = interface(JObject)
    ['{8B37A464-DF93-444D-AC8C-448DB9C12F8A}']
    function equals(object_: JObject): Boolean; cdecl;
  end;
  TJSatInitializer_Tuple = class(TJavaGenericImport<JSatInitializer_TupleClass, JSatInitializer_Tuple>) end;

  Jsat_BuildConfigClass = interface(JObjectClass)
    ['{1BD05204-BC6B-4660-B651-2E0198D1CFC6}']
    {class} function _GetBUILD_TYPE: JString; cdecl;
    {class} function _GetDEBUG: Boolean; cdecl;
    {class} function _GetLIBRARY_PACKAGE_NAME: JString; cdecl;
    {class} function init: Jsat_BuildConfig; cdecl;//Deprecated
    {class} property BUILD_TYPE: JString read _GetBUILD_TYPE;
    {class} property DEBUG: Boolean read _GetDEBUG;
    {class} property LIBRARY_PACKAGE_NAME: JString read _GetLIBRARY_PACKAGE_NAME;
  end;

  [JavaSignature('br/com/elgin/sat/BuildConfig')]
  Jsat_BuildConfig = interface(JObject)
    ['{DAA6E56D-ED79-4A24-B4C0-AA135645481B}']
  end;
  TJsat_BuildConfig = class(TJavaGenericImport<Jsat_BuildConfigClass, Jsat_BuildConfig>) end;

  JCH34xIdsClass = interface(JObjectClass)
    ['{DBB66E8D-0ECF-4BB0-A87E-8C067FA0382A}']
    {class} function isDeviceSupported(i: Integer; i1: Integer): Boolean; cdecl;
  end;

  [JavaSignature('com/felhr/deviceids/CH34xIds')]
  JCH34xIds = interface(JObject)
    ['{2A4E129A-7165-4E32-939C-D3044AE2206D}']
  end;
  TJCH34xIds = class(TJavaGenericImport<JCH34xIdsClass, JCH34xIds>) end;

  JCH34xIds_ConcreteDeviceClass = interface(JObjectClass)
    ['{A43D7A57-17AC-439C-AAF7-E7899B18CF08}']
    {class} function init(i: Integer; i1: Integer): JCH34xIds_ConcreteDevice; cdecl;//Deprecated
  end;

  [JavaSignature('com/felhr/deviceids/CH34xIds$ConcreteDevice')]
  JCH34xIds_ConcreteDevice = interface(JObject)
    ['{7FD6E801-E0D2-46A4-BD2A-C49C56957A43}']
    function _GetproductId: Integer; cdecl;
    procedure _SetproductId(Value: Integer); cdecl;
    function _GetvendorId: Integer; cdecl;
    procedure _SetvendorId(Value: Integer); cdecl;
    property productId: Integer read _GetproductId write _SetproductId;
    property vendorId: Integer read _GetvendorId write _SetvendorId;
  end;
  TJCH34xIds_ConcreteDevice = class(TJavaGenericImport<JCH34xIds_ConcreteDeviceClass, JCH34xIds_ConcreteDevice>) end;

  JCP210xIdsClass = interface(JObjectClass)
    ['{F0020A64-6F9F-49B5-88DC-8831366EC01C}']
    {class} function init: JCP210xIds; cdecl;
    {class} function isDeviceSupported(i: Integer; i1: Integer): Boolean; cdecl;
  end;

  [JavaSignature('com/felhr/deviceids/CP210xIds')]
  JCP210xIds = interface(JObject)
    ['{EC01A54D-466A-4B38-BF96-93E4B88F21BD}']
  end;
  TJCP210xIds = class(TJavaGenericImport<JCP210xIdsClass, JCP210xIds>) end;

  JCP210xIds_ConcreteDeviceClass = interface(JObjectClass)
    ['{C55B2E6E-5A90-4945-BF92-2CF3953A707D}']
    {class} function init(i: Integer; i1: Integer): JCP210xIds_ConcreteDevice; cdecl;//Deprecated
  end;

  [JavaSignature('com/felhr/deviceids/CP210xIds$ConcreteDevice')]
  JCP210xIds_ConcreteDevice = interface(JObject)
    ['{EEE9DBD4-A0F2-412E-86EE-DDD4F0DBE204}']
    function _GetproductId: Integer; cdecl;
    procedure _SetproductId(Value: Integer); cdecl;
    function _GetvendorId: Integer; cdecl;
    procedure _SetvendorId(Value: Integer); cdecl;
    property productId: Integer read _GetproductId write _SetproductId;
    property vendorId: Integer read _GetvendorId write _SetvendorId;
  end;
  TJCP210xIds_ConcreteDevice = class(TJavaGenericImport<JCP210xIds_ConcreteDeviceClass, JCP210xIds_ConcreteDevice>) end;

  JCP2130IdsClass = interface(JObjectClass)
    ['{1EAFBBC5-5C66-4AA7-8776-2EF13A907441}']
    {class} function init: JCP2130Ids; cdecl;
    {class} function isDeviceSupported(i: Integer; i1: Integer): Boolean; cdecl;
  end;

  [JavaSignature('com/felhr/deviceids/CP2130Ids')]
  JCP2130Ids = interface(JObject)
    ['{34F3B244-4B54-46EE-8A33-72840BFC4B66}']
  end;
  TJCP2130Ids = class(TJavaGenericImport<JCP2130IdsClass, JCP2130Ids>) end;

  JCP2130Ids_ConcreteDeviceClass = interface(JObjectClass)
    ['{C982D13A-4C7F-48A1-B7FB-C8FD0790B0F4}']
    {class} function init(i: Integer; i1: Integer): JCP2130Ids_ConcreteDevice; cdecl;//Deprecated
  end;

  [JavaSignature('com/felhr/deviceids/CP2130Ids$ConcreteDevice')]
  JCP2130Ids_ConcreteDevice = interface(JObject)
    ['{97875FFC-F2BB-4232-9199-9B37EEB8EF35}']
    function _GetproductId: Integer; cdecl;
    procedure _SetproductId(Value: Integer); cdecl;
    function _GetvendorId: Integer; cdecl;
    procedure _SetvendorId(Value: Integer); cdecl;
    property productId: Integer read _GetproductId write _SetproductId;
    property vendorId: Integer read _GetvendorId write _SetvendorId;
  end;
  TJCP2130Ids_ConcreteDevice = class(TJavaGenericImport<JCP2130Ids_ConcreteDeviceClass, JCP2130Ids_ConcreteDevice>) end;

  JFTDISioIdsClass = interface(JObjectClass)
    ['{9643A68E-0170-432E-99FF-B6CD36F8333E}']
    {class} function isDeviceSupported(i: Integer; i1: Integer): Boolean; cdecl;
  end;

  [JavaSignature('com/felhr/deviceids/FTDISioIds')]
  JFTDISioIds = interface(JObject)
    ['{907E6789-46C6-4BEA-9F31-93DC984C97E0}']
  end;
  TJFTDISioIds = class(TJavaGenericImport<JFTDISioIdsClass, JFTDISioIds>) end;

  JFTDISioIds_ConcreteDeviceClass = interface(JObjectClass)
    ['{B1CD47AE-4A5D-461C-B2AE-C21279413637}']
    {class} function init(i: Integer; i1: Integer): JFTDISioIds_ConcreteDevice; cdecl;//Deprecated
  end;

  [JavaSignature('com/felhr/deviceids/FTDISioIds$ConcreteDevice')]
  JFTDISioIds_ConcreteDevice = interface(JObject)
    ['{B6E246B5-CBE0-4918-8EF2-BB6569814D6F}']
    function _GetproductId: Integer; cdecl;
    procedure _SetproductId(Value: Integer); cdecl;
    function _GetvendorId: Integer; cdecl;
    procedure _SetvendorId(Value: Integer); cdecl;
    property productId: Integer read _GetproductId write _SetproductId;
    property vendorId: Integer read _GetvendorId write _SetvendorId;
  end;
  TJFTDISioIds_ConcreteDevice = class(TJavaGenericImport<JFTDISioIds_ConcreteDeviceClass, JFTDISioIds_ConcreteDevice>) end;

  JPL2303IdsClass = interface(JObjectClass)
    ['{5ABA3724-E5EA-43F2-A551-4FA5D554EC13}']
    {class} function isDeviceSupported(i: Integer; i1: Integer): Boolean; cdecl;
  end;

  [JavaSignature('com/felhr/deviceids/PL2303Ids')]
  JPL2303Ids = interface(JObject)
    ['{E81E729E-35BE-4A68-8C3C-8816DCA04B2A}']
  end;
  TJPL2303Ids = class(TJavaGenericImport<JPL2303IdsClass, JPL2303Ids>) end;

  JPL2303Ids_ConcreteDeviceClass = interface(JObjectClass)
    ['{21F28A9E-B1F8-4833-9521-EA74781DE7AC}']
    {class} function init(i: Integer; i1: Integer): JPL2303Ids_ConcreteDevice; cdecl;//Deprecated
  end;

  [JavaSignature('com/felhr/deviceids/PL2303Ids$ConcreteDevice')]
  JPL2303Ids_ConcreteDevice = interface(JObject)
    ['{3FFCB943-8512-4BDF-AED0-E4A596C88849}']
    function _GetproductId: Integer; cdecl;
    procedure _SetproductId(Value: Integer); cdecl;
    function _GetvendorId: Integer; cdecl;
    procedure _SetvendorId(Value: Integer); cdecl;
    property productId: Integer read _GetproductId write _SetproductId;
    property vendorId: Integer read _GetvendorId write _SetvendorId;
  end;
  TJPL2303Ids_ConcreteDevice = class(TJavaGenericImport<JPL2303Ids_ConcreteDeviceClass, JPL2303Ids_ConcreteDevice>) end;

  JXdcVcpIdsClass = interface(JObjectClass)
    ['{D7537847-AFE3-4C51-B9F0-4A4078D7DBE7}']
    {class} function init: JXdcVcpIds; cdecl;
    {class} function isDeviceSupported(i: Integer; i1: Integer): Boolean; cdecl;
  end;

  [JavaSignature('com/felhr/deviceids/XdcVcpIds')]
  JXdcVcpIds = interface(JObject)
    ['{2F086BB0-8639-4C52-81DC-AD154EE9CE98}']
  end;
  TJXdcVcpIds = class(TJavaGenericImport<JXdcVcpIdsClass, JXdcVcpIds>) end;

  JXdcVcpIds_ConcreteDeviceClass = interface(JObjectClass)
    ['{77FEB5BA-F54C-4321-A0D0-D5C48DE9D605}']
    {class} function init(i: Integer; i1: Integer): JXdcVcpIds_ConcreteDevice; cdecl;//Deprecated
  end;

  [JavaSignature('com/felhr/deviceids/XdcVcpIds$ConcreteDevice')]
  JXdcVcpIds_ConcreteDevice = interface(JObject)
    ['{369BBC1A-5102-456E-92FD-C033BCB1B1CA}']
    function _GetproductId: Integer; cdecl;
    procedure _SetproductId(Value: Integer); cdecl;
    function _GetvendorId: Integer; cdecl;
    procedure _SetvendorId(Value: Integer); cdecl;
    property productId: Integer read _GetproductId write _SetproductId;
    property vendorId: Integer read _GetvendorId write _SetvendorId;
  end;
  TJXdcVcpIds_ConcreteDevice = class(TJavaGenericImport<JXdcVcpIds_ConcreteDeviceClass, JXdcVcpIds_ConcreteDevice>) end;

  JUsbSerialInterfaceClass = interface(IJavaClass)
    ['{5BB1E337-6247-4C41-8863-2DFCD4BF6B4C}']
    {class} function _GetDATA_BITS_5: Integer; cdecl;
    {class} function _GetDATA_BITS_6: Integer; cdecl;
    {class} function _GetDATA_BITS_7: Integer; cdecl;
    {class} function _GetDATA_BITS_8: Integer; cdecl;
    {class} function _GetFLOW_CONTROL_DSR_DTR: Integer; cdecl;
    {class} function _GetFLOW_CONTROL_OFF: Integer; cdecl;
    {class} function _GetFLOW_CONTROL_RTS_CTS: Integer; cdecl;
    {class} function _GetFLOW_CONTROL_XON_XOFF: Integer; cdecl;
    {class} function _GetPARITY_EVEN: Integer; cdecl;
    {class} function _GetPARITY_MARK: Integer; cdecl;
    {class} function _GetPARITY_NONE: Integer; cdecl;
    {class} function _GetPARITY_ODD: Integer; cdecl;
    {class} function _GetPARITY_SPACE: Integer; cdecl;
    {class} function _GetSTOP_BITS_1: Integer; cdecl;
    {class} function _GetSTOP_BITS_15: Integer; cdecl;
    {class} function _GetSTOP_BITS_2: Integer; cdecl;
    {class} function open: Boolean; cdecl;//Deprecated
    {class} property DATA_BITS_5: Integer read _GetDATA_BITS_5;
    {class} property DATA_BITS_6: Integer read _GetDATA_BITS_6;
    {class} property DATA_BITS_7: Integer read _GetDATA_BITS_7;
    {class} property DATA_BITS_8: Integer read _GetDATA_BITS_8;
    {class} property FLOW_CONTROL_DSR_DTR: Integer read _GetFLOW_CONTROL_DSR_DTR;
    {class} property FLOW_CONTROL_OFF: Integer read _GetFLOW_CONTROL_OFF;
    {class} property FLOW_CONTROL_RTS_CTS: Integer read _GetFLOW_CONTROL_RTS_CTS;
    {class} property FLOW_CONTROL_XON_XOFF: Integer read _GetFLOW_CONTROL_XON_XOFF;
    {class} property PARITY_EVEN: Integer read _GetPARITY_EVEN;
    {class} property PARITY_MARK: Integer read _GetPARITY_MARK;
    {class} property PARITY_NONE: Integer read _GetPARITY_NONE;
    {class} property PARITY_ODD: Integer read _GetPARITY_ODD;
    {class} property PARITY_SPACE: Integer read _GetPARITY_SPACE;
    {class} property STOP_BITS_1: Integer read _GetSTOP_BITS_1;
    {class} property STOP_BITS_15: Integer read _GetSTOP_BITS_15;
    {class} property STOP_BITS_2: Integer read _GetSTOP_BITS_2;
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialInterface')]
  JUsbSerialInterface = interface(IJavaInstance)
    ['{7325FC4A-54A0-4516-8017-E17BCB78A42C}']
    procedure close; cdecl;
    procedure getBreak(usbBreakCallback: JUsbSerialInterface_UsbBreakCallback); cdecl;
    procedure getCTS(usbCTSCallback: JUsbSerialInterface_UsbCTSCallback); cdecl;
    procedure getDSR(usbDSRCallback: JUsbSerialInterface_UsbDSRCallback); cdecl;
    procedure getFrame(usbFrameCallback: JUsbSerialInterface_UsbFrameCallback); cdecl;
    procedure getOverrun(usbOverrunCallback: JUsbSerialInterface_UsbOverrunCallback); cdecl;
    procedure getParity(usbParityCallback: JUsbSerialInterface_UsbParityCallback); cdecl;
    function read(usbReadCallback: JUsbSerialInterface_UsbReadCallback): Integer; cdecl;
    procedure setBaudRate(i: Integer); cdecl;
    procedure setDTR(b: Boolean); cdecl;
    procedure setDataBits(i: Integer); cdecl;
    procedure setFlowControl(i: Integer); cdecl;
    procedure setParity(i: Integer); cdecl;
    procedure setRTS(b: Boolean); cdecl;
    procedure setStopBits(i: Integer); cdecl;
    procedure syncClose; cdecl;
    function syncOpen: Boolean; cdecl;
    function syncRead(b: TJavaArray<Byte>; i: Integer): Integer; cdecl;
    function syncWrite(b: TJavaArray<Byte>; i: Integer): Integer; cdecl;
    procedure write(b: TJavaArray<Byte>); cdecl;
  end;
  TJUsbSerialInterface = class(TJavaGenericImport<JUsbSerialInterfaceClass, JUsbSerialInterface>) end;

  JUsbSerialDeviceClass = interface(JUsbSerialInterfaceClass)
    ['{FAF72EF1-594C-416F-A5D6-A1AB278A277F}']
    {class} function _Getdevice: JUsbDevice; cdecl;
    {class} function createUsbSerialDevice(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JUsbSerialDevice; cdecl; overload;
    {class} function createUsbSerialDevice(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection; i: Integer): JUsbSerialDevice; cdecl; overload;
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JUsbSerialDevice; cdecl;//Deprecated
    {class} function isCdcDevice(usbDevice: JUsbDevice): Boolean; cdecl;
    {class} function isSupported(usbDevice: JUsbDevice): Boolean; cdecl;
    {class} property device: JUsbDevice read _Getdevice;
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialDevice')]
  JUsbSerialDevice = interface(JUsbSerialInterface)
    ['{469C1E39-2E4D-4583-AA65-7D35963FFABD}']
    procedure close; cdecl;
    procedure debug(b: Boolean); cdecl;
    function open: Boolean; cdecl;
    function read(usbReadCallback: JUsbSerialInterface_UsbReadCallback): Integer; cdecl;
    procedure setBaudRate(i: Integer); cdecl;
    procedure setDataBits(i: Integer); cdecl;
    procedure setFlowControl(i: Integer); cdecl;
    procedure setParity(i: Integer); cdecl;
    procedure setStopBits(i: Integer); cdecl;
    procedure syncClose; cdecl;
    function syncOpen: Boolean; cdecl;
    function syncRead(b: TJavaArray<Byte>; i: Integer): Integer; cdecl;
    function syncWrite(b: TJavaArray<Byte>; i: Integer): Integer; cdecl;
    procedure write(b: TJavaArray<Byte>); cdecl;
  end;
  TJUsbSerialDevice = class(TJavaGenericImport<JUsbSerialDeviceClass, JUsbSerialDevice>) end;

  JBLED112SerialDeviceClass = interface(JUsbSerialDeviceClass)
    ['{8A433770-0F02-4B67-88FB-17CEBF6C549E}']
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JBLED112SerialDevice; cdecl;
  end;

  [JavaSignature('com/felhr/usbserial/BLED112SerialDevice')]
  JBLED112SerialDevice = interface(JUsbSerialDevice)
    ['{15743100-0337-4801-A3BD-F7C142A274F3}']
    procedure close; cdecl;
    procedure getBreak(usbBreakCallback: JUsbSerialInterface_UsbBreakCallback); cdecl;
    procedure getCTS(usbCTSCallback: JUsbSerialInterface_UsbCTSCallback); cdecl;
    procedure getDSR(usbDSRCallback: JUsbSerialInterface_UsbDSRCallback); cdecl;
    procedure getFrame(usbFrameCallback: JUsbSerialInterface_UsbFrameCallback); cdecl;
    procedure getOverrun(usbOverrunCallback: JUsbSerialInterface_UsbOverrunCallback); cdecl;
    procedure getParity(usbParityCallback: JUsbSerialInterface_UsbParityCallback); cdecl;
    function open: Boolean; cdecl;
    procedure setBaudRate(i: Integer); cdecl;
    procedure setDTR(b: Boolean); cdecl;
    procedure setDataBits(i: Integer); cdecl;
    procedure setFlowControl(i: Integer); cdecl;
    procedure setParity(i: Integer); cdecl;
    procedure setRTS(b: Boolean); cdecl;
    procedure setStopBits(i: Integer); cdecl;
    procedure syncClose; cdecl;
    function syncOpen: Boolean; cdecl;
  end;
  TJBLED112SerialDevice = class(TJavaGenericImport<JBLED112SerialDeviceClass, JBLED112SerialDevice>) end;

  Jusbserial_BuildConfigClass = interface(JObjectClass)
    ['{53541BF2-C69D-489A-8AE8-4E70829F2455}']
    {class} function _GetAPPLICATION_ID: JString; cdecl;
    {class} function _GetBUILD_TYPE: JString; cdecl;
    {class} function _GetDEBUG: Boolean; cdecl;
    {class} function _GetFLAVOR: JString; cdecl;
    {class} function _GetVERSION_CODE: Integer; cdecl;
    {class} function _GetVERSION_NAME: JString; cdecl;
    {class} function init: Jusbserial_BuildConfig; cdecl;//Deprecated
    {class} property APPLICATION_ID: JString read _GetAPPLICATION_ID;
    {class} property BUILD_TYPE: JString read _GetBUILD_TYPE;
    {class} property DEBUG: Boolean read _GetDEBUG;
    {class} property FLAVOR: JString read _GetFLAVOR;
    {class} property VERSION_CODE: Integer read _GetVERSION_CODE;
    {class} property VERSION_NAME: JString read _GetVERSION_NAME;
  end;

  [JavaSignature('com/felhr/usbserial/BuildConfig')]
  Jusbserial_BuildConfig = interface(JObject)
    ['{5F05D46D-89F6-4530-A5A5-3FC71F895EB8}']
  end;
  TJusbserial_BuildConfig = class(TJavaGenericImport<Jusbserial_BuildConfigClass, Jusbserial_BuildConfig>) end;

  JCDCSerialDeviceClass = interface(JUsbSerialDeviceClass)
    ['{6ADCB3BB-7BE1-4DBD-8859-3B6EE722FBB9}']
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JCDCSerialDevice; cdecl; overload;
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection; i: Integer): JCDCSerialDevice; cdecl; overload;
  end;

  [JavaSignature('com/felhr/usbserial/CDCSerialDevice')]
  JCDCSerialDevice = interface(JUsbSerialDevice)
    ['{835DD914-8C14-430A-8554-92B5AEADF848}']
    procedure close; cdecl;
    procedure getBreak(usbBreakCallback: JUsbSerialInterface_UsbBreakCallback); cdecl;
    procedure getCTS(usbCTSCallback: JUsbSerialInterface_UsbCTSCallback); cdecl;
    procedure getDSR(usbDSRCallback: JUsbSerialInterface_UsbDSRCallback); cdecl;
    procedure getFrame(usbFrameCallback: JUsbSerialInterface_UsbFrameCallback); cdecl;
    procedure getOverrun(usbOverrunCallback: JUsbSerialInterface_UsbOverrunCallback); cdecl;
    procedure getParity(usbParityCallback: JUsbSerialInterface_UsbParityCallback); cdecl;
    function open: Boolean; cdecl;
    procedure setBaudRate(i: Integer); cdecl;
    procedure setDTR(b: Boolean); cdecl;
    procedure setDataBits(i: Integer); cdecl;
    procedure setFlowControl(i: Integer); cdecl;
    procedure setParity(i: Integer); cdecl;
    procedure setRTS(b: Boolean); cdecl;
    procedure setStopBits(i: Integer); cdecl;
    procedure syncClose; cdecl;
    function syncOpen: Boolean; cdecl;
  end;
  TJCDCSerialDevice = class(TJavaGenericImport<JCDCSerialDeviceClass, JCDCSerialDevice>) end;

  JCH34xSerialDeviceClass = interface(JUsbSerialDeviceClass)
    ['{1263C7A6-4C13-44C0-A19F-F3B63E7B66DF}']
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JCH34xSerialDevice; cdecl; overload;
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection; i: Integer): JCH34xSerialDevice; cdecl; overload;
  end;

  [JavaSignature('com/felhr/usbserial/CH34xSerialDevice')]
  JCH34xSerialDevice = interface(JUsbSerialDevice)
    ['{D08837D5-B3B2-4F3B-8522-F277610221E5}']
    procedure close; cdecl;
    procedure getBreak(usbBreakCallback: JUsbSerialInterface_UsbBreakCallback); cdecl;
    procedure getCTS(usbCTSCallback: JUsbSerialInterface_UsbCTSCallback); cdecl;
    procedure getDSR(usbDSRCallback: JUsbSerialInterface_UsbDSRCallback); cdecl;
    procedure getFrame(usbFrameCallback: JUsbSerialInterface_UsbFrameCallback); cdecl;
    procedure getOverrun(usbOverrunCallback: JUsbSerialInterface_UsbOverrunCallback); cdecl;
    procedure getParity(usbParityCallback: JUsbSerialInterface_UsbParityCallback); cdecl;
    function open: Boolean; cdecl;
    procedure setBaudRate(i: Integer); cdecl;
    procedure setDTR(b: Boolean); cdecl;
    procedure setDataBits(i: Integer); cdecl;
    procedure setFlowControl(i: Integer); cdecl;
    procedure setParity(i: Integer); cdecl;
    procedure setRTS(b: Boolean); cdecl;
    procedure setStopBits(i: Integer); cdecl;
    procedure syncClose; cdecl;
    function syncOpen: Boolean; cdecl;
  end;
  TJCH34xSerialDevice = class(TJavaGenericImport<JCH34xSerialDeviceClass, JCH34xSerialDevice>) end;

  JCH34xSerialDevice_FlowControlThreadClass = interface(JThreadClass)
    ['{C91CFC66-4688-4C3D-84EE-264628360FAB}']
    {class} function init(cH34xSerialDevice: JCH34xSerialDevice): JCH34xSerialDevice_FlowControlThread; cdecl;
  end;

  [JavaSignature('com/felhr/usbserial/CH34xSerialDevice$FlowControlThread')]
  JCH34xSerialDevice_FlowControlThread = interface(JThread)
    ['{12AB54EA-D620-46E5-8C62-E027F3D54D47}']
    function pollForCTS: Boolean; cdecl;
    function pollForDSR: Boolean; cdecl;
    procedure run; cdecl;
    procedure stopThread; cdecl;
  end;
  TJCH34xSerialDevice_FlowControlThread = class(TJavaGenericImport<JCH34xSerialDevice_FlowControlThreadClass, JCH34xSerialDevice_FlowControlThread>) end;

  JCP2102SerialDeviceClass = interface(JUsbSerialDeviceClass)
    ['{0FB769B2-27DB-4FB9-A14F-64D59D455393}']
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JCP2102SerialDevice; cdecl; overload;
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection; i: Integer): JCP2102SerialDevice; cdecl; overload;
  end;

  [JavaSignature('com/felhr/usbserial/CP2102SerialDevice')]
  JCP2102SerialDevice = interface(JUsbSerialDevice)
    ['{ECA9C5BF-B81E-448E-A889-F5459EED0793}']
    procedure close; cdecl;
    procedure getBreak(usbBreakCallback: JUsbSerialInterface_UsbBreakCallback); cdecl;
    procedure getCTS(usbCTSCallback: JUsbSerialInterface_UsbCTSCallback); cdecl;
    procedure getDSR(usbDSRCallback: JUsbSerialInterface_UsbDSRCallback); cdecl;
    procedure getFrame(usbFrameCallback: JUsbSerialInterface_UsbFrameCallback); cdecl;
    procedure getOverrun(usbOverrunCallback: JUsbSerialInterface_UsbOverrunCallback); cdecl;
    procedure getParity(usbParityCallback: JUsbSerialInterface_UsbParityCallback); cdecl;
    function open: Boolean; cdecl;
    procedure setBaudRate(i: Integer); cdecl;
    procedure setDTR(b: Boolean); cdecl;
    procedure setDataBits(i: Integer); cdecl;
    procedure setFlowControl(i: Integer); cdecl;
    procedure setParity(i: Integer); cdecl;
    procedure setRTS(b: Boolean); cdecl;
    procedure setStopBits(i: Integer); cdecl;
    procedure syncClose; cdecl;
    function syncOpen: Boolean; cdecl;
  end;
  TJCP2102SerialDevice = class(TJavaGenericImport<JCP2102SerialDeviceClass, JCP2102SerialDevice>) end;

  JCP2102SerialDevice_FlowControlThreadClass = interface(JThreadClass)
    ['{C1668E21-7FD9-4128-A108-EF4B98D18123}']
    {class} function init(cP2102SerialDevice: JCP2102SerialDevice): JCP2102SerialDevice_FlowControlThread; cdecl;
  end;

  [JavaSignature('com/felhr/usbserial/CP2102SerialDevice$FlowControlThread')]
  JCP2102SerialDevice_FlowControlThread = interface(JThread)
    ['{E113348A-E633-4EF8-8E64-E2A633AEC3F4}']
    procedure run; cdecl;
    procedure stopThread; cdecl;
  end;
  TJCP2102SerialDevice_FlowControlThread = class(TJavaGenericImport<JCP2102SerialDevice_FlowControlThreadClass, JCP2102SerialDevice_FlowControlThread>) end;

  JUsbSpiInterfaceClass = interface(IJavaClass)
    ['{A2685C92-77B6-49EC-9753-5C9702A55976}']
    {class} function _GetDIVIDER_128: Integer; cdecl;
    {class} function _GetDIVIDER_16: Integer; cdecl;
    {class} function _GetDIVIDER_2: Integer; cdecl;
    {class} function _GetDIVIDER_32: Integer; cdecl;
    {class} function _GetDIVIDER_4: Integer; cdecl;
    {class} function _GetDIVIDER_64: Integer; cdecl;
    {class} function _GetDIVIDER_8: Integer; cdecl;
    {class} function connectSPI: Boolean; cdecl;//Deprecated
    {class} property DIVIDER_128: Integer read _GetDIVIDER_128;
    {class} property DIVIDER_16: Integer read _GetDIVIDER_16;
    {class} property DIVIDER_2: Integer read _GetDIVIDER_2;
    {class} property DIVIDER_32: Integer read _GetDIVIDER_32;
    {class} property DIVIDER_4: Integer read _GetDIVIDER_4;
    {class} property DIVIDER_64: Integer read _GetDIVIDER_64;
    {class} property DIVIDER_8: Integer read _GetDIVIDER_8;
  end;

  [JavaSignature('com/felhr/usbserial/UsbSpiInterface')]
  JUsbSpiInterface = interface(IJavaInstance)
    ['{4B22B01A-4C63-4111-8669-B755CA886D9A}']
    procedure closeSPI; cdecl;
    function getClockDivider: Integer; cdecl;
    function getSelectedSlave: Integer; cdecl;
    procedure readMISO(i: Integer); cdecl;
    procedure selectSlave(i: Integer); cdecl;
    procedure setClock(i: Integer); cdecl;
    procedure setMISOCallback(usbMISOCallback: JUsbSpiInterface_UsbMISOCallback); cdecl;
    procedure writeMOSI(b: TJavaArray<Byte>); cdecl;
    procedure writeRead(b: TJavaArray<Byte>; i: Integer); cdecl;
  end;
  TJUsbSpiInterface = class(TJavaGenericImport<JUsbSpiInterfaceClass, JUsbSpiInterface>) end;

  JUsbSpiDeviceClass = interface(JUsbSpiInterfaceClass)
    ['{3D001AC3-18B7-4E77-B972-6448C56DACB6}']
    {class} function _GetUSB_TIMEOUT: Integer; cdecl;
    {class} function createUsbSerialDevice(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JUsbSpiDevice; cdecl; overload;
    {class} function createUsbSerialDevice(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection; i: Integer): JUsbSpiDevice; cdecl; overload;
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JUsbSpiDevice; cdecl;//Deprecated
    {class} property USB_TIMEOUT: Integer read _GetUSB_TIMEOUT;
  end;

  [JavaSignature('com/felhr/usbserial/UsbSpiDevice')]
  JUsbSpiDevice = interface(JUsbSpiInterface)
    ['{E3350E83-829F-4E26-816D-F6617F18711A}']
    procedure closeSPI; cdecl;
    function connectSPI: Boolean; cdecl;
    function getClockDivider: Integer; cdecl;
    function getSelectedSlave: Integer; cdecl;
    procedure readMISO(i: Integer); cdecl;
    procedure selectSlave(i: Integer); cdecl;
    procedure setClock(i: Integer); cdecl;
    procedure setMISOCallback(usbMISOCallback: JUsbSpiInterface_UsbMISOCallback); cdecl;
    procedure writeMOSI(b: TJavaArray<Byte>); cdecl;
    procedure writeRead(b: TJavaArray<Byte>; i: Integer); cdecl;
  end;
  TJUsbSpiDevice = class(TJavaGenericImport<JUsbSpiDeviceClass, JUsbSpiDevice>) end;

  JCP2130SpiDeviceClass = interface(JUsbSpiDeviceClass)
    ['{BF441939-CF6A-4387-AAC1-D22AEF62EECF}']
    {class} function _GetCLOCK_12MHz: Integer; cdecl;
    {class} function _GetCLOCK_187_5KHz: Integer; cdecl;
    {class} function _GetCLOCK_1_5MHz: Integer; cdecl;
    {class} function _GetCLOCK_375KHz: Integer; cdecl;
    {class} function _GetCLOCK_3MHz: Integer; cdecl;
    {class} function _GetCLOCK_6MHz: Integer; cdecl;
    {class} function _GetCLOCK_750KHz: Integer; cdecl;
    {class} function _GetCLOCK_93_75KHz: Integer; cdecl;
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JCP2130SpiDevice; cdecl; overload;//Deprecated
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection; i: Integer): JCP2130SpiDevice; cdecl; overload;
    {class} property CLOCK_12MHz: Integer read _GetCLOCK_12MHz;
    {class} property CLOCK_187_5KHz: Integer read _GetCLOCK_187_5KHz;
    {class} property CLOCK_1_5MHz: Integer read _GetCLOCK_1_5MHz;
    {class} property CLOCK_375KHz: Integer read _GetCLOCK_375KHz;
    {class} property CLOCK_3MHz: Integer read _GetCLOCK_3MHz;
    {class} property CLOCK_6MHz: Integer read _GetCLOCK_6MHz;
    {class} property CLOCK_750KHz: Integer read _GetCLOCK_750KHz;
    {class} property CLOCK_93_75KHz: Integer read _GetCLOCK_93_75KHz;
  end;

  [JavaSignature('com/felhr/usbserial/CP2130SpiDevice')]
  JCP2130SpiDevice = interface(JUsbSpiDevice)
    ['{CB3E76A6-3B98-455D-9731-34C8907FB30E}']
    procedure closeSPI; cdecl;
    function connectSPI: Boolean; cdecl;
    function getClockDivider: Integer; cdecl;
    function getSelectedSlave: Integer; cdecl;
    procedure readMISO(i: Integer); cdecl;
    procedure selectSlave(i: Integer); cdecl;
    procedure setClock(i: Integer); cdecl;
    procedure writeMOSI(b: TJavaArray<Byte>); cdecl;
    procedure writeRead(b: TJavaArray<Byte>; i: Integer); cdecl;
  end;
  TJCP2130SpiDevice = class(TJavaGenericImport<JCP2130SpiDeviceClass, JCP2130SpiDevice>) end;

  JFTDISerialDeviceClass = interface(JUsbSerialDeviceClass)
    ['{23ACC6E5-09F9-41C6-8007-0FCF110904D0}']
    {class} function _GetFTDI_BAUDRATE_115200: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_1200: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_19200: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_230400: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_2400: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_300: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_38400: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_460800: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_4800: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_57600: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_600: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_921600: Integer; cdecl;
    {class} function _GetFTDI_BAUDRATE_9600: Integer; cdecl;
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JFTDISerialDevice; cdecl; overload;//Deprecated
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection; i: Integer): JFTDISerialDevice; cdecl; overload;
    {class} property FTDI_BAUDRATE_115200: Integer read _GetFTDI_BAUDRATE_115200;
    {class} property FTDI_BAUDRATE_1200: Integer read _GetFTDI_BAUDRATE_1200;
    {class} property FTDI_BAUDRATE_19200: Integer read _GetFTDI_BAUDRATE_19200;
    {class} property FTDI_BAUDRATE_230400: Integer read _GetFTDI_BAUDRATE_230400;
    {class} property FTDI_BAUDRATE_2400: Integer read _GetFTDI_BAUDRATE_2400;
    {class} property FTDI_BAUDRATE_300: Integer read _GetFTDI_BAUDRATE_300;
    {class} property FTDI_BAUDRATE_38400: Integer read _GetFTDI_BAUDRATE_38400;
    {class} property FTDI_BAUDRATE_460800: Integer read _GetFTDI_BAUDRATE_460800;
    {class} property FTDI_BAUDRATE_4800: Integer read _GetFTDI_BAUDRATE_4800;
    {class} property FTDI_BAUDRATE_57600: Integer read _GetFTDI_BAUDRATE_57600;
    {class} property FTDI_BAUDRATE_600: Integer read _GetFTDI_BAUDRATE_600;
    {class} property FTDI_BAUDRATE_921600: Integer read _GetFTDI_BAUDRATE_921600;
    {class} property FTDI_BAUDRATE_9600: Integer read _GetFTDI_BAUDRATE_9600;
  end;

  [JavaSignature('com/felhr/usbserial/FTDISerialDevice')]
  JFTDISerialDevice = interface(JUsbSerialDevice)
    ['{39B597AE-8BFC-4F0C-9A12-69ADCFBA1F85}']
    function _GetftdiUtilities: JFTDISerialDevice_FTDIUtilities; cdecl;
    procedure _SetftdiUtilities(Value: JFTDISerialDevice_FTDIUtilities); cdecl;
    procedure close; cdecl;
    procedure getBreak(usbBreakCallback: JUsbSerialInterface_UsbBreakCallback); cdecl;
    procedure getCTS(usbCTSCallback: JUsbSerialInterface_UsbCTSCallback); cdecl;
    procedure getDSR(usbDSRCallback: JUsbSerialInterface_UsbDSRCallback); cdecl;
    procedure getFrame(usbFrameCallback: JUsbSerialInterface_UsbFrameCallback); cdecl;
    procedure getOverrun(usbOverrunCallback: JUsbSerialInterface_UsbOverrunCallback); cdecl;
    procedure getParity(usbParityCallback: JUsbSerialInterface_UsbParityCallback); cdecl;
    function open: Boolean; cdecl;
    procedure setBaudRate(i: Integer); cdecl;
    procedure setDTR(b: Boolean); cdecl;
    procedure setDataBits(i: Integer); cdecl;
    procedure setFlowControl(i: Integer); cdecl;
    procedure setParity(i: Integer); cdecl;
    procedure setRTS(b: Boolean); cdecl;
    procedure setStopBits(i: Integer); cdecl;
    procedure syncClose; cdecl;
    function syncOpen: Boolean; cdecl;
    function syncRead(b: TJavaArray<Byte>; i: Integer): Integer; cdecl;
    property ftdiUtilities: JFTDISerialDevice_FTDIUtilities read _GetftdiUtilities write _SetftdiUtilities;
  end;
  TJFTDISerialDevice = class(TJavaGenericImport<JFTDISerialDeviceClass, JFTDISerialDevice>) end;

  JFTDISerialDevice_FTDIUtilitiesClass = interface(JObjectClass)
    ['{68B6A8B4-5E3E-40EF-A0BD-B4584874ED3E}']
    {class} function init(fTDISerialDevice: JFTDISerialDevice): JFTDISerialDevice_FTDIUtilities; cdecl;
  end;

  [JavaSignature('com/felhr/usbserial/FTDISerialDevice$FTDIUtilities')]
  JFTDISerialDevice_FTDIUtilities = interface(JObject)
    ['{536BAEDE-7A3B-4830-882A-0D15E9195FC7}']
    function adaptArray(b: TJavaArray<Byte>): TJavaArray<Byte>; cdecl;
    procedure checkModemStatus(b: TJavaArray<Byte>); cdecl;
  end;
  TJFTDISerialDevice_FTDIUtilities = class(TJavaGenericImport<JFTDISerialDevice_FTDIUtilitiesClass, JFTDISerialDevice_FTDIUtilities>) end;

  JPL2303SerialDeviceClass = interface(JUsbSerialDeviceClass)
    ['{F10965E3-5228-43F9-A085-C72396DC75E8}']
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JPL2303SerialDevice; cdecl; overload;
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection; i: Integer): JPL2303SerialDevice; cdecl; overload;
  end;

  [JavaSignature('com/felhr/usbserial/PL2303SerialDevice')]
  JPL2303SerialDevice = interface(JUsbSerialDevice)
    ['{546C909C-682A-448E-951E-DACDBA5FA812}']
    procedure close; cdecl;
    procedure getBreak(usbBreakCallback: JUsbSerialInterface_UsbBreakCallback); cdecl;
    procedure getCTS(usbCTSCallback: JUsbSerialInterface_UsbCTSCallback); cdecl;
    procedure getDSR(usbDSRCallback: JUsbSerialInterface_UsbDSRCallback); cdecl;
    procedure getFrame(usbFrameCallback: JUsbSerialInterface_UsbFrameCallback); cdecl;
    procedure getOverrun(usbOverrunCallback: JUsbSerialInterface_UsbOverrunCallback); cdecl;
    procedure getParity(usbParityCallback: JUsbSerialInterface_UsbParityCallback); cdecl;
    function open: Boolean; cdecl;
    procedure setBaudRate(i: Integer); cdecl;
    procedure setDTR(b: Boolean); cdecl;
    procedure setDataBits(i: Integer); cdecl;
    procedure setFlowControl(i: Integer); cdecl;
    procedure setParity(i: Integer); cdecl;
    procedure setRTS(b: Boolean); cdecl;
    procedure setStopBits(i: Integer); cdecl;
    procedure syncClose; cdecl;
    function syncOpen: Boolean; cdecl;
  end;
  TJPL2303SerialDevice = class(TJavaGenericImport<JPL2303SerialDeviceClass, JPL2303SerialDevice>) end;

  JSerialBufferClass = interface(JObjectClass)
    ['{0DAF69B3-E121-4A15-971F-8CF3093CC7EC}']
    {class} function _GetDEFAULT_READ_BUFFER_SIZE: Integer; cdecl;
    {class} function _GetDEFAULT_WRITE_BUFFER_SIZE: Integer; cdecl;
    {class} function init(b: Boolean): JSerialBuffer; cdecl;//Deprecated
    {class} property DEFAULT_READ_BUFFER_SIZE: Integer read _GetDEFAULT_READ_BUFFER_SIZE;
    {class} property DEFAULT_WRITE_BUFFER_SIZE: Integer read _GetDEFAULT_WRITE_BUFFER_SIZE;
  end;

  [JavaSignature('com/felhr/usbserial/SerialBuffer')]
  JSerialBuffer = interface(JObject)
    ['{D3995F8A-853E-4DA7-8717-38EC27892546}']
    procedure clearReadBuffer; cdecl;
    procedure debug(b: Boolean); cdecl;
    function getBufferCompatible: TJavaArray<Byte>; cdecl;
    function getDataReceived: TJavaArray<Byte>; cdecl;
    function getDataReceivedCompatible(i: Integer): TJavaArray<Byte>; cdecl;
    function getReadBuffer: JByteBuffer; cdecl;
    function getWriteBuffer: TJavaArray<Byte>; cdecl;
    procedure putReadBuffer(byteBuffer: JByteBuffer); cdecl;
    procedure putWriteBuffer(b: TJavaArray<Byte>); cdecl;
    procedure resetWriteBuffer; cdecl;
  end;
  TJSerialBuffer = class(TJavaGenericImport<JSerialBufferClass, JSerialBuffer>) end;

  JSerialBuffer_SynchronizedBufferClass = interface(JObjectClass)
    ['{A8D8003E-FA4A-47D3-8BB9-F1E1C48AC5C4}']
    {class} function init(serialBuffer: JSerialBuffer): JSerialBuffer_SynchronizedBuffer; cdecl;
  end;

  [JavaSignature('com/felhr/usbserial/SerialBuffer$SynchronizedBuffer')]
  JSerialBuffer_SynchronizedBuffer = interface(JObject)
    ['{593416E4-3553-484F-9466-6A065E825DF0}']
    function &get: TJavaArray<Byte>; cdecl;
    procedure put(b: TJavaArray<Byte>); cdecl;
    procedure reset; cdecl;
  end;
  TJSerialBuffer_SynchronizedBuffer = class(TJavaGenericImport<JSerialBuffer_SynchronizedBufferClass, JSerialBuffer_SynchronizedBuffer>) end;

  JSerialInputStreamClass = interface(JInputStreamClass)
    ['{A95B900C-7CD6-45E4-AF4C-A51CD15D05F8}']
    {class} function _Getdevice: JUsbSerialInterface; cdecl;
    {class} function init(usbSerialInterface: JUsbSerialInterface): JSerialInputStream; cdecl;//Deprecated
    {class} property device: JUsbSerialInterface read _Getdevice;
  end;

  [JavaSignature('com/felhr/usbserial/SerialInputStream')]
  JSerialInputStream = interface(JInputStream)
    ['{398894C2-08E8-4C92-96B1-2938385A2B62}']
    procedure close; cdecl;
    procedure onReceivedData(b: TJavaArray<Byte>); cdecl;
    function read: Integer; cdecl;
  end;
  TJSerialInputStream = class(TJavaGenericImport<JSerialInputStreamClass, JSerialInputStream>) end;

  JSerialOutputStreamClass = interface(JOutputStreamClass)
    ['{BFD7DDD3-9F37-431C-AE62-82EFA38EE3B5}']
    {class} function init(usbSerialInterface: JUsbSerialInterface): JSerialOutputStream; cdecl;
  end;

  [JavaSignature('com/felhr/usbserial/SerialOutputStream')]
  JSerialOutputStream = interface(JOutputStream)
    ['{87AED129-494F-4291-934C-53A105C0F762}']
    procedure write(b: TJavaArray<Byte>); cdecl; overload;
    procedure write(i: Integer); cdecl; overload;
  end;
  TJSerialOutputStream = class(TJavaGenericImport<JSerialOutputStreamClass, JSerialOutputStream>) end;

  JUsbSerialDebuggerClass = interface(JObjectClass)
    ['{1BED5D85-2B9F-487F-899A-5A50188F67C8}']
    {class} function _GetENCODING: JString; cdecl;
    {class} procedure printLogGet(b: TJavaArray<Byte>; b1: Boolean); cdecl;
    {class} procedure printLogPut(b: TJavaArray<Byte>; b1: Boolean); cdecl;
    {class} procedure printReadLogGet(b: TJavaArray<Byte>; b1: Boolean); cdecl;
    {class} procedure printReadLogPut(b: TJavaArray<Byte>; b1: Boolean); cdecl;
    {class} property ENCODING: JString read _GetENCODING;
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialDebugger')]
  JUsbSerialDebugger = interface(JObject)
    ['{DF80D19A-D53D-4020-9045-CB6F986DF6B2}']
  end;
  TJUsbSerialDebugger = class(TJavaGenericImport<JUsbSerialDebuggerClass, JUsbSerialDebugger>) end;

  JUsbSerialDevice_ReadThreadClass = interface(JThreadClass)
    ['{7514566E-FAAF-48B3-81C6-68B7AE63D8D5}']
    {class} function init(usbSerialDevice: JUsbSerialDevice; usbSerialDevice1: JUsbSerialDevice): JUsbSerialDevice_ReadThread; cdecl;
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialDevice$ReadThread')]
  JUsbSerialDevice_ReadThread = interface(JThread)
    ['{56259DC7-28E6-43C0-81F9-B08ED1C57A55}']
    procedure run; cdecl;
    procedure setCallback(usbReadCallback: JUsbSerialInterface_UsbReadCallback); cdecl;
    procedure setUsbEndpoint(usbEndpoint: JUsbEndpoint); cdecl;
    procedure stopReadThread; cdecl;
  end;
  TJUsbSerialDevice_ReadThread = class(TJavaGenericImport<JUsbSerialDevice_ReadThreadClass, JUsbSerialDevice_ReadThread>) end;

  JUsbSerialDevice_WorkerThreadClass = interface(JThreadClass)
    ['{6C1F2171-B434-409E-815E-C859C2F23733}']
    {class} function init(usbSerialDevice: JUsbSerialDevice; usbSerialDevice1: JUsbSerialDevice): JUsbSerialDevice_WorkerThread; cdecl;
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialDevice$WorkerThread')]
  JUsbSerialDevice_WorkerThread = interface(JThread)
    ['{36452A7C-AE49-41F9-A060-355610B211C0}']
    function getUsbRequest: JUsbRequest; cdecl;
    procedure run; cdecl;
    procedure setCallback(usbReadCallback: JUsbSerialInterface_UsbReadCallback); cdecl;
    procedure setUsbRequest(usbRequest: JUsbRequest); cdecl;
    procedure stopWorkingThread; cdecl;
  end;
  TJUsbSerialDevice_WorkerThread = class(TJavaGenericImport<JUsbSerialDevice_WorkerThreadClass, JUsbSerialDevice_WorkerThread>) end;

  JUsbSerialDevice_WriteThreadClass = interface(JThreadClass)
    ['{B22A7884-CE89-438B-BB72-18BB706C35EE}']
    {class} function init(usbSerialDevice: JUsbSerialDevice): JUsbSerialDevice_WriteThread; cdecl;
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialDevice$WriteThread')]
  JUsbSerialDevice_WriteThread = interface(JThread)
    ['{531986C5-700E-4FD0-811B-856CE441AA3F}']
    procedure run; cdecl;
    procedure setUsbEndpoint(usbEndpoint: JUsbEndpoint); cdecl;
    procedure stopWriteThread; cdecl;
  end;
  TJUsbSerialDevice_WriteThread = class(TJavaGenericImport<JUsbSerialDevice_WriteThreadClass, JUsbSerialDevice_WriteThread>) end;

  JUsbSerialInterface_UsbBreakCallbackClass = interface(IJavaClass)
    ['{9FF761DF-6C99-4060-8390-EA11FBA794C4}']
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialInterface$UsbBreakCallback')]
  JUsbSerialInterface_UsbBreakCallback = interface(IJavaInstance)
    ['{9645075D-2CE4-46C8-8813-812B266EE80D}']
    procedure onBreakInterrupt; cdecl;
  end;
  TJUsbSerialInterface_UsbBreakCallback = class(TJavaGenericImport<JUsbSerialInterface_UsbBreakCallbackClass, JUsbSerialInterface_UsbBreakCallback>) end;

  JUsbSerialInterface_UsbCTSCallbackClass = interface(IJavaClass)
    ['{3503FE70-0D48-42BF-8524-97EB3FF06F15}']
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialInterface$UsbCTSCallback')]
  JUsbSerialInterface_UsbCTSCallback = interface(IJavaInstance)
    ['{22B8BF07-4B8E-49C5-934D-1CBE1DE211B4}']
    procedure onCTSChanged(b: Boolean); cdecl;
  end;
  TJUsbSerialInterface_UsbCTSCallback = class(TJavaGenericImport<JUsbSerialInterface_UsbCTSCallbackClass, JUsbSerialInterface_UsbCTSCallback>) end;

  JUsbSerialInterface_UsbDSRCallbackClass = interface(IJavaClass)
    ['{3DBBC43E-9ADA-45DD-90DB-D1A9341C8261}']
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialInterface$UsbDSRCallback')]
  JUsbSerialInterface_UsbDSRCallback = interface(IJavaInstance)
    ['{435BAC8B-1CAA-40E7-9EA6-089E3B2DE007}']
    procedure onDSRChanged(b: Boolean); cdecl;
  end;
  TJUsbSerialInterface_UsbDSRCallback = class(TJavaGenericImport<JUsbSerialInterface_UsbDSRCallbackClass, JUsbSerialInterface_UsbDSRCallback>) end;

  JUsbSerialInterface_UsbFrameCallbackClass = interface(IJavaClass)
    ['{6E2B5389-44F5-4171-8011-7A2D0DCDDC0D}']
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialInterface$UsbFrameCallback')]
  JUsbSerialInterface_UsbFrameCallback = interface(IJavaInstance)
    ['{ED855125-3AED-46F8-BECB-CAB8486D7B69}']
    procedure onFramingError; cdecl;
  end;
  TJUsbSerialInterface_UsbFrameCallback = class(TJavaGenericImport<JUsbSerialInterface_UsbFrameCallbackClass, JUsbSerialInterface_UsbFrameCallback>) end;

  JUsbSerialInterface_UsbOverrunCallbackClass = interface(IJavaClass)
    ['{A9AE5F1C-4CBD-454E-B40E-224F6D987647}']
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialInterface$UsbOverrunCallback')]
  JUsbSerialInterface_UsbOverrunCallback = interface(IJavaInstance)
    ['{05965CB3-3F52-403B-B643-A58B0C252B1A}']
    procedure onOverrunError; cdecl;
  end;
  TJUsbSerialInterface_UsbOverrunCallback = class(TJavaGenericImport<JUsbSerialInterface_UsbOverrunCallbackClass, JUsbSerialInterface_UsbOverrunCallback>) end;

  JUsbSerialInterface_UsbParityCallbackClass = interface(IJavaClass)
    ['{F8309E7E-BE31-481A-A53D-4C0C53845F75}']
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialInterface$UsbParityCallback')]
  JUsbSerialInterface_UsbParityCallback = interface(IJavaInstance)
    ['{DA1194E5-EE6F-4731-9FD5-9C65E4A82D52}']
    procedure onParityError; cdecl;
  end;
  TJUsbSerialInterface_UsbParityCallback = class(TJavaGenericImport<JUsbSerialInterface_UsbParityCallbackClass, JUsbSerialInterface_UsbParityCallback>) end;

  JUsbSerialInterface_UsbReadCallbackClass = interface(IJavaClass)
    ['{3B328F0D-DA5F-4F36-8D85-62B340692643}']
  end;

  [JavaSignature('com/felhr/usbserial/UsbSerialInterface$UsbReadCallback')]
  JUsbSerialInterface_UsbReadCallback = interface(IJavaInstance)
    ['{70B805C4-1D76-4B78-A5DA-9AD6AD8B4C7C}']
    procedure onReceivedData(b: TJavaArray<Byte>); cdecl;
  end;
  TJUsbSerialInterface_UsbReadCallback = class(TJavaGenericImport<JUsbSerialInterface_UsbReadCallbackClass, JUsbSerialInterface_UsbReadCallback>) end;

  JUsbSpiDevice_ReadThreadClass = interface(JThreadClass)
    ['{6FC1BFF0-6BF8-4298-AD9C-EBA6A5D45478}']
    {class} function init(usbSpiDevice: JUsbSpiDevice): JUsbSpiDevice_ReadThread; cdecl;
  end;

  [JavaSignature('com/felhr/usbserial/UsbSpiDevice$ReadThread')]
  JUsbSpiDevice_ReadThread = interface(JThread)
    ['{D1B8AB14-FC0E-468C-915D-30BDFD4AA411}']
    procedure run; cdecl;
    procedure setCallback(usbMISOCallback: JUsbSpiInterface_UsbMISOCallback); cdecl;
    procedure setUsbEndpoint(usbEndpoint: JUsbEndpoint); cdecl;
    procedure stopReadThread; cdecl;
  end;
  TJUsbSpiDevice_ReadThread = class(TJavaGenericImport<JUsbSpiDevice_ReadThreadClass, JUsbSpiDevice_ReadThread>) end;

  JUsbSpiDevice_WriteThreadClass = interface(JThreadClass)
    ['{4B28A6EB-BC92-4B34-BBF4-FBED74E2F6CB}']
    {class} function init(usbSpiDevice: JUsbSpiDevice): JUsbSpiDevice_WriteThread; cdecl;
  end;

  [JavaSignature('com/felhr/usbserial/UsbSpiDevice$WriteThread')]
  JUsbSpiDevice_WriteThread = interface(JThread)
    ['{956068DB-D511-485F-A953-61B2BF00BA5B}']
    procedure run; cdecl;
    procedure setUsbEndpoint(usbEndpoint: JUsbEndpoint); cdecl;
    procedure stopWriteThread; cdecl;
  end;
  TJUsbSpiDevice_WriteThread = class(TJavaGenericImport<JUsbSpiDevice_WriteThreadClass, JUsbSpiDevice_WriteThread>) end;

  JUsbSpiInterface_UsbMISOCallbackClass = interface(IJavaClass)
    ['{BF632820-9A24-4080-A95E-7CF8B88DDF63}']
  end;

  [JavaSignature('com/felhr/usbserial/UsbSpiInterface$UsbMISOCallback')]
  JUsbSpiInterface_UsbMISOCallback = interface(IJavaInstance)
    ['{BE2F86F9-5E2C-4F0A-B1C0-35C57105F8F1}']
    function onReceivedData(b: TJavaArray<Byte>): Integer; cdecl;
  end;
  TJUsbSpiInterface_UsbMISOCallback = class(TJavaGenericImport<JUsbSpiInterface_UsbMISOCallbackClass, JUsbSpiInterface_UsbMISOCallback>) end;

  JXdcVcpSerialDeviceClass = interface(JUsbSerialDeviceClass)
    ['{55F1056A-5841-4E25-862A-E0A5DCFE2D09}']
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection): JXdcVcpSerialDevice; cdecl; overload;
    {class} function init(usbDevice: JUsbDevice; usbDeviceConnection: JUsbDeviceConnection; i: Integer): JXdcVcpSerialDevice; cdecl; overload;
  end;

  [JavaSignature('com/felhr/usbserial/XdcVcpSerialDevice')]
  JXdcVcpSerialDevice = interface(JUsbSerialDevice)
    ['{F47A5413-844C-4B43-8C60-9654D5903F35}']
    procedure close; cdecl;
    procedure getBreak(usbBreakCallback: JUsbSerialInterface_UsbBreakCallback); cdecl;
    procedure getCTS(usbCTSCallback: JUsbSerialInterface_UsbCTSCallback); cdecl;
    procedure getDSR(usbDSRCallback: JUsbSerialInterface_UsbDSRCallback); cdecl;
    procedure getFrame(usbFrameCallback: JUsbSerialInterface_UsbFrameCallback); cdecl;
    procedure getOverrun(usbOverrunCallback: JUsbSerialInterface_UsbOverrunCallback); cdecl;
    procedure getParity(usbParityCallback: JUsbSerialInterface_UsbParityCallback); cdecl;
    function open: Boolean; cdecl;
    procedure setBaudRate(i: Integer); cdecl;
    procedure setDTR(b: Boolean); cdecl;
    procedure setDataBits(i: Integer); cdecl;
    procedure setFlowControl(i: Integer); cdecl;
    procedure setParity(i: Integer); cdecl;
    procedure setRTS(b: Boolean); cdecl;
    procedure setStopBits(i: Integer); cdecl;
    procedure syncClose; cdecl;
    function syncOpen: Boolean; cdecl;
  end;
  TJXdcVcpSerialDevice = class(TJavaGenericImport<JXdcVcpSerialDeviceClass, JXdcVcpSerialDevice>) end;

  JHexDataClass = interface(JObjectClass)
    ['{394ADE29-A245-4291-97B0-138EBAADFF1E}']
    {class} function hex4digits(string_: JString): JString; cdecl;
    {class} function hexToString(b: TJavaArray<Byte>): JString; cdecl;
    {class} function stringTobytes(string_: JString): TJavaArray<Byte>; cdecl;
  end;

  [JavaSignature('com/felhr/utils/HexData')]
  JHexData = interface(JObject)
    ['{14467383-763B-40F0-B0A7-0952FD3336AD}']
  end;
  TJHexData = class(TJavaGenericImport<JHexDataClass, JHexData>) end;

  JAbstractQueueClass = interface(JAbstractCollectionClass)
    ['{8DB55313-D71D-4956-A1D3-090FF0FF4998}']
    {class} function addAll(c: JCollection): Boolean; cdecl;
    {class} procedure clear; cdecl;
    {class} function element: JObject; cdecl;
  end;

  [JavaSignature('java/util/AbstractQueue')]
  JAbstractQueue = interface(JAbstractCollection)
    ['{954DD6B0-AF78-4938-92AE-4985F7EE7EF1}']
    function add(e: JObject): Boolean; cdecl;
    function remove: JObject; cdecl;
  end;
  TJAbstractQueue = class(TJavaGenericImport<JAbstractQueueClass, JAbstractQueue>) end;

  JArrayBlockingQueueClass = interface(JAbstractQueueClass)
    ['{49E55D90-B4AF-4C6C-9B9C-DE35873B349C}']
    {class} function init(capacity: Integer): JArrayBlockingQueue; cdecl; overload;
    {class} function init(capacity: Integer; fair: Boolean): JArrayBlockingQueue; cdecl; overload;
    {class} function init(capacity: Integer; fair: Boolean; c: JCollection): JArrayBlockingQueue; cdecl; overload;
    {class} function add(e: JObject): Boolean; cdecl;//Deprecated
    {class} procedure clear; cdecl;//Deprecated
    {class} function &contains(o: JObject): Boolean; cdecl;//Deprecated
    {class} function offer(e: JObject): Boolean; cdecl; overload;//Deprecated
    {class} function offer(e: JObject; timeout: Int64; unit_: JTimeUnit): Boolean; cdecl; overload;//Deprecated
    {class} function peek: JObject; cdecl;//Deprecated
    {class} function remainingCapacity: Integer; cdecl;//Deprecated
    {class} function remove(o: JObject): Boolean; cdecl;//Deprecated
    {class} function size: Integer; cdecl;//Deprecated
    {class} function toString: JString; cdecl;//Deprecated
  end;

  [JavaSignature('java/util/concurrent/ArrayBlockingQueue')]
  JArrayBlockingQueue = interface(JAbstractQueue)
    ['{23CA7FCE-5F7A-47B2-AC8C-E0AEE4D40D51}']
    function drainTo(c: JCollection): Integer; cdecl; overload;//Deprecated
    function drainTo(c: JCollection; maxElements: Integer): Integer; cdecl; overload;//Deprecated
    function iterator: JIterator; cdecl;//Deprecated
    function poll: JObject; cdecl; overload;//Deprecated
    function poll(timeout: Int64; unit_: JTimeUnit): JObject; cdecl; overload;//Deprecated
    procedure put(e: JObject); cdecl;//Deprecated
    function take: JObject; cdecl;//Deprecated
    function toArray: TJavaObjectArray<JObject>; cdecl; overload;//Deprecated
    function toArray(a: TJavaObjectArray<JObject>): TJavaObjectArray<JObject>; cdecl; overload;//Deprecated
  end;
  TJArrayBlockingQueue = class(TJavaGenericImport<JArrayBlockingQueueClass, JArrayBlockingQueue>) end;

implementation

procedure RegisterTypes;
begin
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbConfiguration', TypeInfo(Elgin.JNI.Sat.JUsbConfiguration));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbDevice', TypeInfo(Elgin.JNI.Sat.JUsbDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbDeviceConnection', TypeInfo(Elgin.JNI.Sat.JUsbDeviceConnection));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbEndpoint', TypeInfo(Elgin.JNI.Sat.JUsbEndpoint));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbInterface', TypeInfo(Elgin.JNI.Sat.JUsbInterface));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbRequest', TypeInfo(Elgin.JNI.Sat.JUsbRequest));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JAppInitializer', TypeInfo(Elgin.JNI.Sat.JAppInitializer));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JInitializationProvider', TypeInfo(Elgin.JNI.Sat.JInitializationProvider));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JInitializer', TypeInfo(Elgin.JNI.Sat.JInitializer));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JStartupException', TypeInfo(Elgin.JNI.Sat.JStartupException));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JStartupLogger', TypeInfo(Elgin.JNI.Sat.JStartupLogger));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JDeviceInfo', TypeInfo(Elgin.JNI.Sat.JDeviceInfo));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JInternalPointerMarker', TypeInfo(Elgin.JNI.Sat.JInternalPointerMarker));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JJNIReachabilityFence', TypeInfo(Elgin.JNI.Sat.JJNIReachabilityFence));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JSat', TypeInfo(Elgin.JNI.Sat.JSat));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JSatInitializer', TypeInfo(Elgin.JNI.Sat.JSatInitializer));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JSatInitializer_1', TypeInfo(Elgin.JNI.Sat.JSatInitializer_1));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JSatInitializer_2', TypeInfo(Elgin.JNI.Sat.JSatInitializer_2));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JSatInitializer_Tuple', TypeInfo(Elgin.JNI.Sat.JSatInitializer_Tuple));
  TRegTypes.RegisterType('Elgin.JNI.Sat.Jsat_BuildConfig', TypeInfo(Elgin.JNI.Sat.Jsat_BuildConfig));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCH34xIds', TypeInfo(Elgin.JNI.Sat.JCH34xIds));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCH34xIds_ConcreteDevice', TypeInfo(Elgin.JNI.Sat.JCH34xIds_ConcreteDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCP210xIds', TypeInfo(Elgin.JNI.Sat.JCP210xIds));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCP210xIds_ConcreteDevice', TypeInfo(Elgin.JNI.Sat.JCP210xIds_ConcreteDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCP2130Ids', TypeInfo(Elgin.JNI.Sat.JCP2130Ids));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCP2130Ids_ConcreteDevice', TypeInfo(Elgin.JNI.Sat.JCP2130Ids_ConcreteDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JFTDISioIds', TypeInfo(Elgin.JNI.Sat.JFTDISioIds));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JFTDISioIds_ConcreteDevice', TypeInfo(Elgin.JNI.Sat.JFTDISioIds_ConcreteDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JPL2303Ids', TypeInfo(Elgin.JNI.Sat.JPL2303Ids));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JPL2303Ids_ConcreteDevice', TypeInfo(Elgin.JNI.Sat.JPL2303Ids_ConcreteDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JXdcVcpIds', TypeInfo(Elgin.JNI.Sat.JXdcVcpIds));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JXdcVcpIds_ConcreteDevice', TypeInfo(Elgin.JNI.Sat.JXdcVcpIds_ConcreteDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialInterface', TypeInfo(Elgin.JNI.Sat.JUsbSerialInterface));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialDevice', TypeInfo(Elgin.JNI.Sat.JUsbSerialDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JBLED112SerialDevice', TypeInfo(Elgin.JNI.Sat.JBLED112SerialDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.Jusbserial_BuildConfig', TypeInfo(Elgin.JNI.Sat.Jusbserial_BuildConfig));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCDCSerialDevice', TypeInfo(Elgin.JNI.Sat.JCDCSerialDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCH34xSerialDevice', TypeInfo(Elgin.JNI.Sat.JCH34xSerialDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCH34xSerialDevice_FlowControlThread', TypeInfo(Elgin.JNI.Sat.JCH34xSerialDevice_FlowControlThread));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCP2102SerialDevice', TypeInfo(Elgin.JNI.Sat.JCP2102SerialDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCP2102SerialDevice_FlowControlThread', TypeInfo(Elgin.JNI.Sat.JCP2102SerialDevice_FlowControlThread));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSpiInterface', TypeInfo(Elgin.JNI.Sat.JUsbSpiInterface));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSpiDevice', TypeInfo(Elgin.JNI.Sat.JUsbSpiDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JCP2130SpiDevice', TypeInfo(Elgin.JNI.Sat.JCP2130SpiDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JFTDISerialDevice', TypeInfo(Elgin.JNI.Sat.JFTDISerialDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JFTDISerialDevice_FTDIUtilities', TypeInfo(Elgin.JNI.Sat.JFTDISerialDevice_FTDIUtilities));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JPL2303SerialDevice', TypeInfo(Elgin.JNI.Sat.JPL2303SerialDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JSerialBuffer', TypeInfo(Elgin.JNI.Sat.JSerialBuffer));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JSerialBuffer_SynchronizedBuffer', TypeInfo(Elgin.JNI.Sat.JSerialBuffer_SynchronizedBuffer));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JSerialInputStream', TypeInfo(Elgin.JNI.Sat.JSerialInputStream));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JSerialOutputStream', TypeInfo(Elgin.JNI.Sat.JSerialOutputStream));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialDebugger', TypeInfo(Elgin.JNI.Sat.JUsbSerialDebugger));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialDevice_ReadThread', TypeInfo(Elgin.JNI.Sat.JUsbSerialDevice_ReadThread));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialDevice_WorkerThread', TypeInfo(Elgin.JNI.Sat.JUsbSerialDevice_WorkerThread));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialDevice_WriteThread', TypeInfo(Elgin.JNI.Sat.JUsbSerialDevice_WriteThread));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialInterface_UsbBreakCallback', TypeInfo(Elgin.JNI.Sat.JUsbSerialInterface_UsbBreakCallback));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialInterface_UsbCTSCallback', TypeInfo(Elgin.JNI.Sat.JUsbSerialInterface_UsbCTSCallback));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialInterface_UsbDSRCallback', TypeInfo(Elgin.JNI.Sat.JUsbSerialInterface_UsbDSRCallback));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialInterface_UsbFrameCallback', TypeInfo(Elgin.JNI.Sat.JUsbSerialInterface_UsbFrameCallback));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialInterface_UsbOverrunCallback', TypeInfo(Elgin.JNI.Sat.JUsbSerialInterface_UsbOverrunCallback));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialInterface_UsbParityCallback', TypeInfo(Elgin.JNI.Sat.JUsbSerialInterface_UsbParityCallback));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSerialInterface_UsbReadCallback', TypeInfo(Elgin.JNI.Sat.JUsbSerialInterface_UsbReadCallback));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSpiDevice_ReadThread', TypeInfo(Elgin.JNI.Sat.JUsbSpiDevice_ReadThread));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSpiDevice_WriteThread', TypeInfo(Elgin.JNI.Sat.JUsbSpiDevice_WriteThread));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JUsbSpiInterface_UsbMISOCallback', TypeInfo(Elgin.JNI.Sat.JUsbSpiInterface_UsbMISOCallback));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JXdcVcpSerialDevice', TypeInfo(Elgin.JNI.Sat.JXdcVcpSerialDevice));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JHexData', TypeInfo(Elgin.JNI.Sat.JHexData));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JAbstractQueue', TypeInfo(Elgin.JNI.Sat.JAbstractQueue));
  TRegTypes.RegisterType('Elgin.JNI.Sat.JArrayBlockingQueue', TypeInfo(Elgin.JNI.Sat.JArrayBlockingQueue));
end;

initialization
  RegisterTypes;
end.

