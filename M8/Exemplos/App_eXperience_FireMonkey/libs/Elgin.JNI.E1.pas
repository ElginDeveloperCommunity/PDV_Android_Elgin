
unit Elgin.JNI.E1;

interface

uses
  Androidapi.JNIBridge,
  Androidapi.JNI.App,
  Androidapi.JNI.Bluetooth,
  Androidapi.JNI.GraphicsContentViewText,
  Androidapi.JNI.Java.Net,
  Androidapi.JNI.JavaTypes,
  Androidapi.JNI.Os,
  Androidapi.JNI.Util;

type
// ===== Forward declarations =====

  JAnimator = interface;//android.animation.Animator
  JAnimator_AnimatorListener = interface;//android.animation.Animator$AnimatorListener
  JAnimator_AnimatorPauseListener = interface;//android.animation.Animator$AnimatorPauseListener
  JKeyframe = interface;//android.animation.Keyframe
  JLayoutTransition = interface;//android.animation.LayoutTransition
  JLayoutTransition_TransitionListener = interface;//android.animation.LayoutTransition$TransitionListener
  JPropertyValuesHolder = interface;//android.animation.PropertyValuesHolder
  JStateListAnimator = interface;//android.animation.StateListAnimator
  JTimeInterpolator = interface;//android.animation.TimeInterpolator
  JTypeConverter = interface;//android.animation.TypeConverter
  JTypeEvaluator = interface;//android.animation.TypeEvaluator
  JValueAnimator = interface;//android.animation.ValueAnimator
  JValueAnimator_AnimatorUpdateListener = interface;//android.animation.ValueAnimator$AnimatorUpdateListener
  JPathMotion = interface;//android.transition.PathMotion
  JScene = interface;//android.transition.Scene
  JTransition = interface;//android.transition.Transition
  JTransition_EpicenterCallback = interface;//android.transition.Transition$EpicenterCallback
  JTransition_TransitionListener = interface;//android.transition.Transition$TransitionListener
  JTransitionManager = interface;//android.transition.TransitionManager
  JTransitionPropagation = interface;//android.transition.TransitionPropagation
  JTransitionValues = interface;//android.transition.TransitionValues
  JInterpolator = interface;//android.view.animation.Interpolator
  JToolbar_LayoutParams = interface;//android.widget.Toolbar$LayoutParams
  JBalanca = interface;//com.elgin.e1.Balanca.Balanca
  JBalanca_Config = interface;//com.elgin.e1.Balanca.Balanca$Config
  JBalanca_ConfigAltValues = interface;//com.elgin.e1.Balanca.Balanca$ConfigAltValues
  JBalanca_ModeloBalanca = interface;//com.elgin.e1.Balanca.Balanca$ModeloBalanca
  JBalanca_ProtocoloComunicacao = interface;//com.elgin.e1.Balanca.Balanca$ProtocoloComunicacao
  JBalancaE1 = interface;//com.elgin.e1.Balanca.BalancaE1
  JBalancas = interface;//com.elgin.e1.Balanca.Balancas
  JComm = interface;//com.elgin.e1.Balanca.Comm
  JComm_1 = interface;//com.elgin.e1.Balanca.Comm$1
  JComm_TipoConexao = interface;//com.elgin.e1.Balanca.Comm$TipoConexao
  JCommSerial = interface;//com.elgin.e1.Balanca.CommSerial
  JCommTCP = interface;//com.elgin.e1.Balanca.CommTCP
  JCommTCP_Timeouts = interface;//com.elgin.e1.Balanca.CommTCP$Timeouts
  JInterfaceBalanca = interface;//com.elgin.e1.Balanca.InterfaceBalanca
  JImplementacaoBalanca = interface;//com.elgin.e1.Balanca.ImplementacaoBalanca
  JImplementacaoBalanca_1 = interface;//com.elgin.e1.Balanca.ImplementacaoBalanca$1
  Je1_BuildConfig = interface;//com.elgin.e1.BuildConfig
  JConexao = interface;//com.elgin.e1.Comunicacao.Conexao
  JConBluetooth = interface;//com.elgin.e1.Comunicacao.ConBluetooth
  JConBluetooth_1GetBluetoothData = interface;//com.elgin.e1.Comunicacao.ConBluetooth$1GetBluetoothData
  JConBluetooth_1GetPrinterBluetooth = interface;//com.elgin.e1.Comunicacao.ConBluetooth$1GetPrinterBluetooth
  JConBluetooth_1SendData = interface;//com.elgin.e1.Comunicacao.ConBluetooth$1SendData
  JConM8 = interface;//com.elgin.e1.Comunicacao.ConM8
  JPrinterManager_PrinterManagerListener = interface;//com.elgin.minipdvm8.PrinterManager$PrinterManagerListener
  JConM8_1 = interface;//com.elgin.e1.Comunicacao.ConM8$1
  JConSerial = interface;//com.elgin.e1.Comunicacao.ConSerial
  JConService = interface;//com.elgin.e1.Comunicacao.ConService
  JConService_1GetData = interface;//com.elgin.e1.Comunicacao.ConService$1GetData
  JConService_1GetPrinter = interface;//com.elgin.e1.Comunicacao.ConService$1GetPrinter
  JConService_1SendData = interface;//com.elgin.e1.Comunicacao.ConService$1SendData
  JConService_2GetData = interface;//com.elgin.e1.Comunicacao.ConService$2GetData
  JConSmartPOS = interface;//com.elgin.e1.Comunicacao.ConSmartPOS
  JConTCP_IP = interface;//com.elgin.e1.Comunicacao.ConTCP_IP
  JConTCP_IP_1GetData = interface;//com.elgin.e1.Comunicacao.ConTCP_IP$1GetData
  JConTCP_IP_1GetPrinter = interface;//com.elgin.e1.Comunicacao.ConTCP_IP$1GetPrinter
  JConTCP_IP_1SendData = interface;//com.elgin.e1.Comunicacao.ConTCP_IP$1SendData
  JConUSB = interface;//com.elgin.e1.Comunicacao.ConUSB
  JInterfaceFactoryXMLSAT = interface;//com.elgin.e1.Fiscal.InterfaceFactoryXMLSAT
  JImplementacaoFactoryXMLSAT = interface;//com.elgin.e1.Fiscal.ImplementacaoFactoryXMLSAT
  JInterfaceSAT = interface;//com.elgin.e1.Fiscal.InterfaceSAT
  JImplementacaoSAT = interface;//com.elgin.e1.Fiscal.ImplementacaoSAT
  JMFe = interface;//com.elgin.e1.Fiscal.MFe
  JNFCe = interface;//com.elgin.e1.Fiscal.NFCe
  JSAT = interface;//com.elgin.e1.Fiscal.SAT
  JAndroid = interface;//com.elgin.e1.Impressora.Android
  JdsImpressora = interface;//com.elgin.e1.Impressora.Config.dsImpressora
  JdsImpressora_1 = interface;//com.elgin.e1.Impressora.Config.dsImpressora$1
  JdsImpressora_infoHW = interface;//com.elgin.e1.Impressora.Config.dsImpressora$infoHW
  JdsSAT = interface;//com.elgin.e1.Impressora.Config.dsSAT
  JdsSAT_1 = interface;//com.elgin.e1.Impressora.Config.dsSAT$1
  JdsSAT_ChaveDePesquisa = interface;//com.elgin.e1.Impressora.Config.dsSAT$ChaveDePesquisa
  JEtiqueta = interface;//com.elgin.e1.Impressora.Etiqueta
  JInterfaceAndroid = interface;//com.elgin.e1.Impressora.Impressoras.InterfaceAndroid
  JImplementacaoAndroid = interface;//com.elgin.e1.Impressora.Impressoras.ImplementacaoAndroid
  JImplementacaoAndroid_IIImpressaoTexto = interface;//com.elgin.e1.Impressora.Impressoras.ImplementacaoAndroid$IIImpressaoTexto
  JInterfaceBematech = interface;//com.elgin.e1.Impressora.Impressoras.InterfaceBematech
  JImplementacaoBematech = interface;//com.elgin.e1.Impressora.Impressoras.ImplementacaoBematech
  JInterfaceEtiqueta = interface;//com.elgin.e1.Impressora.Impressoras.InterfaceEtiqueta
  JImplementacaoEtiqueta = interface;//com.elgin.e1.Impressora.Impressoras.ImplementacaoEtiqueta
  JImplementacaoM8 = interface;//com.elgin.e1.Impressora.Impressoras.ImplementacaoM8
  JImplementacaoM8_1 = interface;//com.elgin.e1.Impressora.Impressoras.ImplementacaoM8$1
  JImplementacaoSmartPOS = interface;//com.elgin.e1.Impressora.Impressoras.ImplementacaoSmartPOS
  JImplementacaoSmartPOS_1 = interface;//com.elgin.e1.Impressora.Impressoras.ImplementacaoSmartPOS$1
  JInterfaceTermica = interface;//com.elgin.e1.Impressora.Impressoras.InterfaceTermica
  JImplementacaoTermica = interface;//com.elgin.e1.Impressora.Impressoras.ImplementacaoTermica
  JInterfaceM8 = interface;//com.elgin.e1.Impressora.Impressoras.InterfaceM8
  JInterfaceSmartPOS = interface;//com.elgin.e1.Impressora.Impressoras.InterfaceSmartPOS
  JMiniPDVM8 = interface;//com.elgin.e1.Impressora.MiniPDVM8
  JSmart = interface;//com.elgin.e1.Impressora.Smart
  JTermica = interface;//com.elgin.e1.Impressora.Termica
  JCodigoErro = interface;//com.elgin.e1.Impressora.Utilidades.CodigoErro
  JESCPOS = interface;//com.elgin.e1.Impressora.Utilidades.ESCPOS
  JInteiro = interface;//com.elgin.e1.Impressora.Utilidades.Inteiro
  JPPLA = interface;//com.elgin.e1.Impressora.Utilidades.PPLA
  JUtilidades = interface;//com.elgin.e1.Impressora.Utilidades.Utilidades
  JNodeList = interface;//org.w3c.dom.NodeList
  JUtilidades_1 = interface;//com.elgin.e1.Impressora.Utilidades.Utilidades$1
  JInterfaceOBJXMLPRODUTO = interface;//com.elgin.e1.Impressora.XML.InterfaceOBJXMLPRODUTO
  JImplementacaoOBJXMLPRODUTO = interface;//com.elgin.e1.Impressora.XML.ImplementacaoOBJXMLPRODUTO
  JImplementacaoOBJPRODUTOXMLNFCE = interface;//com.elgin.e1.Impressora.XML.ImplementacaoOBJPRODUTOXMLNFCE
  JImplementacaoOBJPRODUTOXMLSAT = interface;//com.elgin.e1.Impressora.XML.ImplementacaoOBJPRODUTOXMLSAT
  JInterfaceOBJXML = interface;//com.elgin.e1.Impressora.XML.InterfaceOBJXML
  JImplementacaoOBJXML = interface;//com.elgin.e1.Impressora.XML.ImplementacaoOBJXML
  JImplementacaoOBJXML_1 = interface;//com.elgin.e1.Impressora.XML.ImplementacaoOBJXML$1
  JImplementacaoOBJXML_infoPag = interface;//com.elgin.e1.Impressora.XML.ImplementacaoOBJXML$infoPag
  JImplementacaoOBJXMLCANCELAMENTO = interface;//com.elgin.e1.Impressora.XML.ImplementacaoOBJXMLCANCELAMENTO
  JImplementacaoOBJXMLNFCE = interface;//com.elgin.e1.Impressora.XML.ImplementacaoOBJXMLNFCE
  JImplementacaoOBJXMLSAT = interface;//com.elgin.e1.Impressora.XML.ImplementacaoOBJXMLSAT
  JInterfaceOBJPRODUTOXMLNFCE = interface;//com.elgin.e1.Impressora.XML.InterfaceOBJPRODUTOXMLNFCE
  JInterfaceOBJPRODUTOXMLSAT = interface;//com.elgin.e1.Impressora.XML.InterfaceOBJPRODUTOXMLSAT
  JInterfaceOBJXMLCANCELAMENTO = interface;//com.elgin.e1.Impressora.XML.InterfaceOBJXMLCANCELAMENTO
  JInterfaceOBJXMLNFCE = interface;//com.elgin.e1.Impressora.XML.InterfaceOBJXMLNFCE
  JInterfaceOBJXMLSAT = interface;//com.elgin.e1.Impressora.XML.InterfaceOBJXMLSAT
  JScanner_Scanner = interface;//com.elgin.e1.Scanner.Scanner
  JAssinaturas = interface;//com.elgin.e1.Servico.Assinaturas
  JParametros = interface;//com.elgin.e1.Servico.Parametros
  JServicoE1 = interface;//com.elgin.e1.Servico.ServicoE1
  JServicoE1_Etiqueta = interface;//com.elgin.e1.Servico.ServicoE1$Etiqueta
  JServicoE1_SAT = interface;//com.elgin.e1.Servico.ServicoE1$SAT
  JServicoE1_Termica = interface;//com.elgin.e1.Servico.ServicoE1$Termica
  Jminipdvm8_BuildConfig = interface;//com.elgin.minipdvm8.BuildConfig
  JPrinterManager = interface;//com.elgin.minipdvm8.PrinterManager
  JPrinterManager_1 = interface;//com.elgin.minipdvm8.PrinterManager$1
  JIPrinterCallback_Stub = interface;//com.xcheng.printerservice.IPrinterCallback$Stub
  JPrinterManager_2 = interface;//com.elgin.minipdvm8.PrinterManager$2
  Jcloudpossdk_aar_slim_BuildConfig = interface;//com.example.cloudpossdk_aar_slim.BuildConfig
  JCommSerialAPI = interface;//com.xc.comportdemo.CommSerialAPI
  JComportNative = interface;//com.xc.comportdemo.ComportNative
  JIPrinterCallback = interface;//com.xcheng.printerservice.IPrinterCallback
  JIPrinterCallback_Stub_Proxy = interface;//com.xcheng.printerservice.IPrinterCallback$Stub$Proxy
  JIPrinterService = interface;//com.xcheng.printerservice.IPrinterService
  JIPrinterService_Stub = interface;//com.xcheng.printerservice.IPrinterService$Stub
  JIPrinterService_Stub_Proxy = interface;//com.xcheng.printerservice.IPrinterService$Stub$Proxy
  JNode = interface;//org.w3c.dom.Node
  JAttr = interface;//org.w3c.dom.Attr
  JCharacterData = interface;//org.w3c.dom.CharacterData
  JText = interface;//org.w3c.dom.Text
  JCDATASection = interface;//org.w3c.dom.CDATASection
  JComment = interface;//org.w3c.dom.Comment
  JDOMConfiguration = interface;//org.w3c.dom.DOMConfiguration
  JDOMImplementation = interface;//org.w3c.dom.DOMImplementation
  JDOMStringList = interface;//org.w3c.dom.DOMStringList
  JDocument = interface;//org.w3c.dom.Document
  JDocumentFragment = interface;//org.w3c.dom.DocumentFragment
  JDocumentType = interface;//org.w3c.dom.DocumentType
  JElement = interface;//org.w3c.dom.Element
  JEntityReference = interface;//org.w3c.dom.EntityReference
  JNamedNodeMap = interface;//org.w3c.dom.NamedNodeMap
  JProcessingInstruction = interface;//org.w3c.dom.ProcessingInstruction
  JTypeInfo = interface;//org.w3c.dom.TypeInfo
  JUserDataHandler = interface;//org.w3c.dom.UserDataHandler

// ===== Interface declarations =====

  JAnimatorClass = interface(JObjectClass)
    ['{3F76A5DF-389E-4BD3-9861-04C5B00CEADE}']
    {class} function init: JAnimator; cdecl;//Deprecated
    {class} function clone: JAnimator; cdecl;//Deprecated
    {class} procedure &end; cdecl;//Deprecated
    {class} function getDuration: Int64; cdecl;//Deprecated
    {class} function isPaused: Boolean; cdecl;
    {class} function isRunning: Boolean; cdecl;
    {class} function isStarted: Boolean; cdecl;
    {class} procedure removePauseListener(listener: JAnimator_AnimatorPauseListener); cdecl;
    {class} procedure resume; cdecl;
    {class} function setDuration(duration: Int64): JAnimator; cdecl;
    {class} procedure setupEndValues; cdecl;
    {class} procedure setupStartValues; cdecl;
    {class} procedure start; cdecl;
  end;

  [JavaSignature('android/animation/Animator')]
  JAnimator = interface(JObject)
    ['{FA13E56D-1B6D-4A3D-8327-9E5BA785CF21}']
    procedure addListener(listener: JAnimator_AnimatorListener); cdecl;//Deprecated
    procedure addPauseListener(listener: JAnimator_AnimatorPauseListener); cdecl;//Deprecated
    procedure cancel; cdecl;//Deprecated
    function getInterpolator: JTimeInterpolator; cdecl;
    function getListeners: JArrayList; cdecl;
    function getStartDelay: Int64; cdecl;
    procedure pause; cdecl;
    procedure removeAllListeners; cdecl;
    procedure removeListener(listener: JAnimator_AnimatorListener); cdecl;
    procedure setInterpolator(value: JTimeInterpolator); cdecl;
    procedure setStartDelay(startDelay: Int64); cdecl;
    procedure setTarget(target: JObject); cdecl;
  end;
  TJAnimator = class(TJavaGenericImport<JAnimatorClass, JAnimator>) end;

  JAnimator_AnimatorListenerClass = interface(IJavaClass)
    ['{5ED6075A-B997-469C-B8D9-0AA8FB7E4798}']
    {class} procedure onAnimationCancel(animation: JAnimator); cdecl;//Deprecated
  end;

  [JavaSignature('android/animation/Animator$AnimatorListener')]
  JAnimator_AnimatorListener = interface(IJavaInstance)
    ['{E2DE8DD6-628B-4D84-AA46-8A1E3F00FF13}']
    procedure onAnimationEnd(animation: JAnimator); cdecl;//Deprecated
    procedure onAnimationRepeat(animation: JAnimator); cdecl;//Deprecated
    procedure onAnimationStart(animation: JAnimator); cdecl;//Deprecated
  end;
  TJAnimator_AnimatorListener = class(TJavaGenericImport<JAnimator_AnimatorListenerClass, JAnimator_AnimatorListener>) end;

  JAnimator_AnimatorPauseListenerClass = interface(IJavaClass)
    ['{CB0DC3F0-63BC-4284-ADD0-2ED367AE11E5}']
  end;

  [JavaSignature('android/animation/Animator$AnimatorPauseListener')]
  JAnimator_AnimatorPauseListener = interface(IJavaInstance)
    ['{43C9C106-65EA-4A7D-A958-FAB9E43FA4A6}']
    procedure onAnimationPause(animation: JAnimator); cdecl;//Deprecated
    procedure onAnimationResume(animation: JAnimator); cdecl;//Deprecated
  end;
  TJAnimator_AnimatorPauseListener = class(TJavaGenericImport<JAnimator_AnimatorPauseListenerClass, JAnimator_AnimatorPauseListener>) end;

  JKeyframeClass = interface(JObjectClass)
    ['{D383116E-5CCF-48D8-9EA1-B26FBF24BA39}']
    {class} function init: JKeyframe; cdecl;//Deprecated
    {class} function getType: Jlang_Class; cdecl;
    {class} function getValue: JObject; cdecl;
    {class} function hasValue: Boolean; cdecl;
    {class} function ofFloat(fraction: Single; value: Single): JKeyframe; cdecl; overload;
    {class} function ofFloat(fraction: Single): JKeyframe; cdecl; overload;
    {class} function ofInt(fraction: Single; value: Integer): JKeyframe; cdecl; overload;
    {class} function ofInt(fraction: Single): JKeyframe; cdecl; overload;
    {class} function ofObject(fraction: Single; value: JObject): JKeyframe; cdecl; overload;
    {class} function ofObject(fraction: Single): JKeyframe; cdecl; overload;
  end;

  [JavaSignature('android/animation/Keyframe')]
  JKeyframe = interface(JObject)
    ['{9D0687A4-669E-440F-8290-154739405019}']
    function clone: JKeyframe; cdecl;
    function getFraction: Single; cdecl;
    function getInterpolator: JTimeInterpolator; cdecl;
    procedure setFraction(fraction: Single); cdecl;//Deprecated
    procedure setInterpolator(interpolator: JTimeInterpolator); cdecl;//Deprecated
    procedure setValue(value: JObject); cdecl;//Deprecated
  end;
  TJKeyframe = class(TJavaGenericImport<JKeyframeClass, JKeyframe>) end;

  JLayoutTransitionClass = interface(JObjectClass)
    ['{433C5359-0A96-4796-AD7B-8084EF7EF7C4}']
    {class} function _GetAPPEARING: Integer; cdecl;
    {class} function _GetCHANGE_APPEARING: Integer; cdecl;
    {class} function _GetCHANGE_DISAPPEARING: Integer; cdecl;
    {class} function _GetCHANGING: Integer; cdecl;
    {class} function _GetDISAPPEARING: Integer; cdecl;
    {class} function init: JLayoutTransition; cdecl;//Deprecated
    {class} procedure addChild(parent: JViewGroup; child: JView); cdecl;//Deprecated
    {class} function getAnimator(transitionType: Integer): JAnimator; cdecl;
    {class} function getDuration(transitionType: Integer): Int64; cdecl;
    {class} function getInterpolator(transitionType: Integer): JTimeInterpolator; cdecl;
    {class} procedure hideChild(parent: JViewGroup; child: JView); cdecl; overload;//Deprecated
    {class} procedure hideChild(parent: JViewGroup; child: JView; newVisibility: Integer); cdecl; overload;
    {class} function isChangingLayout: Boolean; cdecl;
    {class} procedure removeTransitionListener(listener: JLayoutTransition_TransitionListener); cdecl;
    {class} procedure setAnimateParentHierarchy(animateParentHierarchy: Boolean); cdecl;
    {class} procedure setAnimator(transitionType: Integer; animator: JAnimator); cdecl;
    {class} procedure setStagger(transitionType: Integer; duration: Int64); cdecl;
    {class} procedure setStartDelay(transitionType: Integer; delay: Int64); cdecl;
    {class} procedure showChild(parent: JViewGroup; child: JView); cdecl; overload;//Deprecated
    {class} property APPEARING: Integer read _GetAPPEARING;
    {class} property CHANGE_APPEARING: Integer read _GetCHANGE_APPEARING;
    {class} property CHANGE_DISAPPEARING: Integer read _GetCHANGE_DISAPPEARING;
    {class} property CHANGING: Integer read _GetCHANGING;
    {class} property DISAPPEARING: Integer read _GetDISAPPEARING;
  end;

  [JavaSignature('android/animation/LayoutTransition')]
  JLayoutTransition = interface(JObject)
    ['{42450BEE-EBF2-4954-B9B7-F8DAE7DF0EC1}']
    procedure addTransitionListener(listener: JLayoutTransition_TransitionListener); cdecl;
    procedure disableTransitionType(transitionType: Integer); cdecl;
    procedure enableTransitionType(transitionType: Integer); cdecl;
    function getStagger(transitionType: Integer): Int64; cdecl;
    function getStartDelay(transitionType: Integer): Int64; cdecl;
    function getTransitionListeners: JList; cdecl;
    function isRunning: Boolean; cdecl;
    function isTransitionTypeEnabled(transitionType: Integer): Boolean; cdecl;
    procedure removeChild(parent: JViewGroup; child: JView); cdecl;
    procedure setDuration(duration: Int64); cdecl; overload;
    procedure setDuration(transitionType: Integer; duration: Int64); cdecl; overload;
    procedure setInterpolator(transitionType: Integer; interpolator: JTimeInterpolator); cdecl;
    procedure showChild(parent: JViewGroup; child: JView; oldVisibility: Integer); cdecl; overload;//Deprecated
  end;
  TJLayoutTransition = class(TJavaGenericImport<JLayoutTransitionClass, JLayoutTransition>) end;

  JLayoutTransition_TransitionListenerClass = interface(IJavaClass)
    ['{9FA6F1EC-8EDB-4A05-AF58-B55A525AE114}']
  end;

  [JavaSignature('android/animation/LayoutTransition$TransitionListener')]
  JLayoutTransition_TransitionListener = interface(IJavaInstance)
    ['{0FBE048F-FCDA-4692-B6F1-DE0F07FAE885}']
    procedure endTransition(transition: JLayoutTransition; container: JViewGroup; view: JView; transitionType: Integer); cdecl;
    procedure startTransition(transition: JLayoutTransition; container: JViewGroup; view: JView; transitionType: Integer); cdecl;
  end;
  TJLayoutTransition_TransitionListener = class(TJavaGenericImport<JLayoutTransition_TransitionListenerClass, JLayoutTransition_TransitionListener>) end;

  JPropertyValuesHolderClass = interface(JObjectClass)
    ['{36C77AFF-9C3F-42B6-88F3-320FE8CF9B25}']
    {class} function ofMultiFloat(propertyName: JString; values: TJavaBiArray<Single>): JPropertyValuesHolder; cdecl; overload;//Deprecated
    {class} function ofMultiFloat(propertyName: JString; path: JPath): JPropertyValuesHolder; cdecl; overload;//Deprecated
    {class} function ofMultiInt(propertyName: JString; values: TJavaBiArray<Integer>): JPropertyValuesHolder; cdecl; overload;
    {class} function ofMultiInt(propertyName: JString; path: JPath): JPropertyValuesHolder; cdecl; overload;
    {class} function ofObject(propertyName: JString; converter: JTypeConverter; path: JPath): JPropertyValuesHolder; cdecl; overload;
    {class} function ofObject(property_: JProperty; converter: JTypeConverter; path: JPath): JPropertyValuesHolder; cdecl; overload;
    {class} procedure setConverter(converter: JTypeConverter); cdecl;
    {class} procedure setEvaluator(evaluator: JTypeEvaluator); cdecl;
    {class} procedure setProperty(property_: JProperty); cdecl;
    {class} procedure setPropertyName(propertyName: JString); cdecl;
  end;

  [JavaSignature('android/animation/PropertyValuesHolder')]
  JPropertyValuesHolder = interface(JObject)
    ['{12B4ABFD-CBCA-4636-AF2D-C386EF895DC3}']
    function clone: JPropertyValuesHolder; cdecl;//Deprecated
    function getPropertyName: JString; cdecl;//Deprecated
    function toString: JString; cdecl;
  end;
  TJPropertyValuesHolder = class(TJavaGenericImport<JPropertyValuesHolderClass, JPropertyValuesHolder>) end;

  JStateListAnimatorClass = interface(JObjectClass)
    ['{109E4067-E218-47B1-93EB-65B8916A98D8}']
    {class} function init: JStateListAnimator; cdecl;//Deprecated
    {class} procedure jumpToCurrentState; cdecl;//Deprecated
  end;

  [JavaSignature('android/animation/StateListAnimator')]
  JStateListAnimator = interface(JObject)
    ['{CA2A9587-26AA-4DC2-8DFF-A1305A37608F}']
    procedure addState(specs: TJavaArray<Integer>; animator: JAnimator); cdecl;//Deprecated
    function clone: JStateListAnimator; cdecl;//Deprecated
  end;
  TJStateListAnimator = class(TJavaGenericImport<JStateListAnimatorClass, JStateListAnimator>) end;

  JTimeInterpolatorClass = interface(IJavaClass)
    ['{1E682A1C-9102-461D-A3CA-5596683F1D66}']
  end;

  [JavaSignature('android/animation/TimeInterpolator')]
  JTimeInterpolator = interface(IJavaInstance)
    ['{639F8A83-7D9B-49AF-A19E-96B27E46D2AB}']
    function getInterpolation(input: Single): Single; cdecl;
  end;
  TJTimeInterpolator = class(TJavaGenericImport<JTimeInterpolatorClass, JTimeInterpolator>) end;

  JTypeConverterClass = interface(JObjectClass)
    ['{BE2DD177-6D79-4B0C-B4F5-4E4CD9D7436D}']
    {class} function init(fromClass: Jlang_Class; toClass: Jlang_Class): JTypeConverter; cdecl;//Deprecated
    {class} function convert(value: JObject): JObject; cdecl;
  end;

  [JavaSignature('android/animation/TypeConverter')]
  JTypeConverter = interface(JObject)
    ['{BFEA4116-0766-4AD9-AA8F-4C15A583EB2E}']
  end;
  TJTypeConverter = class(TJavaGenericImport<JTypeConverterClass, JTypeConverter>) end;

  JTypeEvaluatorClass = interface(IJavaClass)
    ['{15B67CAF-6F50-4AA3-A88F-C5AF78D62FD4}']
  end;

  [JavaSignature('android/animation/TypeEvaluator')]
  JTypeEvaluator = interface(IJavaInstance)
    ['{F436383D-6F44-40D8-ACDD-9057777691FC}']
    function evaluate(fraction: Single; startValue: JObject; endValue: JObject): JObject; cdecl;
  end;
  TJTypeEvaluator = class(TJavaGenericImport<JTypeEvaluatorClass, JTypeEvaluator>) end;

  JValueAnimatorClass = interface(JAnimatorClass)
    ['{FF3B71ED-5A33-45B0-8500-7672B0B98E2C}']
    {class} function _GetINFINITE: Integer; cdecl;
    {class} function _GetRESTART: Integer; cdecl;
    {class} function _GetREVERSE: Integer; cdecl;
    {class} function init: JValueAnimator; cdecl;//Deprecated
    {class} procedure &end; cdecl;//Deprecated
    {class} function getAnimatedFraction: Single; cdecl;//Deprecated
    {class} function getAnimatedValue: JObject; cdecl; overload;
    {class} function getAnimatedValue(propertyName: JString): JObject; cdecl; overload;
    {class} function getCurrentPlayTime: Int64; cdecl;
    {class} function getFrameDelay: Int64; cdecl;//Deprecated
    {class} function getRepeatCount: Integer; cdecl;//Deprecated
    {class} function getRepeatMode: Integer; cdecl;//Deprecated
    {class} function getStartDelay: Int64; cdecl;//Deprecated
    {class} procedure removeAllUpdateListeners; cdecl;//Deprecated
    {class} procedure removeUpdateListener(listener: JValueAnimator_AnimatorUpdateListener); cdecl;//Deprecated
    {class} procedure resume; cdecl;//Deprecated
    {class} procedure setCurrentPlayTime(playTime: Int64); cdecl;//Deprecated
    {class} function setDuration(duration: Int64): JValueAnimator; cdecl;//Deprecated
    {class} procedure setEvaluator(value: JTypeEvaluator); cdecl;//Deprecated
    {class} procedure setFrameDelay(frameDelay: Int64); cdecl;
    {class} procedure setInterpolator(value: JTimeInterpolator); cdecl;
    {class} procedure setRepeatCount(value: Integer); cdecl;
    {class} procedure start; cdecl;
    {class} function toString: JString; cdecl;
    {class} property INFINITE: Integer read _GetINFINITE;
    {class} property RESTART: Integer read _GetRESTART;
    {class} property REVERSE: Integer read _GetREVERSE;
  end;

  [JavaSignature('android/animation/ValueAnimator')]
  JValueAnimator = interface(JAnimator)
    ['{70F92B14-EFD4-4DC7-91DE-6617417AE194}']
    procedure addUpdateListener(listener: JValueAnimator_AnimatorUpdateListener); cdecl;//Deprecated
    procedure cancel; cdecl;//Deprecated
    function clone: JValueAnimator; cdecl;//Deprecated
    function getDuration: Int64; cdecl;//Deprecated
    function getInterpolator: JTimeInterpolator; cdecl;//Deprecated
    function getValues: TJavaObjectArray<JPropertyValuesHolder>; cdecl;//Deprecated
    function isRunning: Boolean; cdecl;//Deprecated
    function isStarted: Boolean; cdecl;//Deprecated
    procedure pause; cdecl;//Deprecated
    procedure reverse; cdecl;//Deprecated
    procedure setCurrentFraction(fraction: Single); cdecl;//Deprecated
    procedure setRepeatMode(value: Integer); cdecl;
    procedure setStartDelay(startDelay: Int64); cdecl;
  end;
  TJValueAnimator = class(TJavaGenericImport<JValueAnimatorClass, JValueAnimator>) end;

  JValueAnimator_AnimatorUpdateListenerClass = interface(IJavaClass)
    ['{9CA50CBF-4462-4445-82CD-13CE985E2DE4}']
    {class} procedure onAnimationUpdate(animation: JValueAnimator); cdecl;//Deprecated
  end;

  [JavaSignature('android/animation/ValueAnimator$AnimatorUpdateListener')]
  JValueAnimator_AnimatorUpdateListener = interface(IJavaInstance)
    ['{0F883491-52EF-4A40-B7D2-FC23E11E46FE}']
  end;
  TJValueAnimator_AnimatorUpdateListener = class(TJavaGenericImport<JValueAnimator_AnimatorUpdateListenerClass, JValueAnimator_AnimatorUpdateListener>) end;

  JPathMotionClass = interface(JObjectClass)
    ['{E1CD1A94-115C-492C-A490-37F0E72956EB}']
    {class} function init: JPathMotion; cdecl; overload;//Deprecated
    {class} function init(context: JContext; attrs: JAttributeSet): JPathMotion; cdecl; overload;//Deprecated
    {class} function getPath(startX: Single; startY: Single; endX: Single; endY: Single): JPath; cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/PathMotion')]
  JPathMotion = interface(JObject)
    ['{BDC08353-C9FB-42D7-97CC-C35837D2F536}']
  end;
  TJPathMotion = class(TJavaGenericImport<JPathMotionClass, JPathMotion>) end;

  JSceneClass = interface(JObjectClass)
    ['{8B9120CA-AEEA-4DE3-BDC9-15CFD23A7B07}']
    {class} function init(sceneRoot: JViewGroup): JScene; cdecl; overload;//Deprecated
    {class} function init(sceneRoot: JViewGroup; layout: JView): JScene; cdecl; overload;//Deprecated
    {class} function init(sceneRoot: JViewGroup; layout: JViewGroup): JScene; cdecl; overload;//Deprecated
    {class} procedure enter; cdecl;
    {class} procedure exit; cdecl;
    {class} function getSceneForLayout(sceneRoot: JViewGroup; layoutId: Integer; context: JContext): JScene; cdecl;//Deprecated
    {class} procedure setExitAction(action: JRunnable); cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/Scene')]
  JScene = interface(JObject)
    ['{85A60B99-5837-4F1F-A344-C627DD586B82}']
    function getSceneRoot: JViewGroup; cdecl;//Deprecated
    procedure setEnterAction(action: JRunnable); cdecl;//Deprecated
  end;
  TJScene = class(TJavaGenericImport<JSceneClass, JScene>) end;

  JTransitionClass = interface(JObjectClass)
    ['{60EC06BC-8F7A-4416-A04B-5B57987EB18E}']
    {class} function _GetMATCH_ID: Integer; cdecl;
    {class} function _GetMATCH_INSTANCE: Integer; cdecl;
    {class} function _GetMATCH_ITEM_ID: Integer; cdecl;
    {class} function _GetMATCH_NAME: Integer; cdecl;
    {class} function init: JTransition; cdecl; overload;//Deprecated
    {class} function init(context: JContext; attrs: JAttributeSet): JTransition; cdecl; overload;//Deprecated
    {class} function addTarget(targetType: Jlang_Class): JTransition; cdecl; overload;//Deprecated
    {class} function addTarget(target: JView): JTransition; cdecl; overload;//Deprecated
    {class} function canRemoveViews: Boolean; cdecl;//Deprecated
    {class} function createAnimator(sceneRoot: JViewGroup; startValues: JTransitionValues; endValues: JTransitionValues): JAnimator; cdecl;//Deprecated
    {class} function excludeChildren(targetId: Integer; exclude: Boolean): JTransition; cdecl; overload;//Deprecated
    {class} function excludeChildren(target: JView; exclude: Boolean): JTransition; cdecl; overload;//Deprecated
    {class} function excludeTarget(target: JView; exclude: Boolean): JTransition; cdecl; overload;
    {class} function excludeTarget(type_: Jlang_Class; exclude: Boolean): JTransition; cdecl; overload;
    {class} function getDuration: Int64; cdecl;
    {class} function getInterpolator: JTimeInterpolator; cdecl;
    {class} function getName: JString; cdecl;
    {class} function getPathMotion: JPathMotion; cdecl;
    {class} function getTargetNames: JList; cdecl;
    {class} function getTargetTypes: JList; cdecl;
    {class} function getTargets: JList; cdecl;
    {class} function removeListener(listener: JTransition_TransitionListener): JTransition; cdecl;
    {class} function removeTarget(targetId: Integer): JTransition; cdecl; overload;
    {class} function removeTarget(targetName: JString): JTransition; cdecl; overload;
    {class} procedure setEpicenterCallback(epicenterCallback: JTransition_EpicenterCallback); cdecl;//Deprecated
    {class} function setInterpolator(interpolator: JTimeInterpolator): JTransition; cdecl;//Deprecated
    {class} function toString: JString; cdecl;//Deprecated
    {class} property MATCH_ID: Integer read _GetMATCH_ID;
    {class} property MATCH_INSTANCE: Integer read _GetMATCH_INSTANCE;
    {class} property MATCH_ITEM_ID: Integer read _GetMATCH_ITEM_ID;
    {class} property MATCH_NAME: Integer read _GetMATCH_NAME;
  end;

  [JavaSignature('android/transition/Transition')]
  JTransition = interface(JObject)
    ['{C2F8200F-1C83-40AE-8C5B-C0C8BFF17F88}']
    function addListener(listener: JTransition_TransitionListener): JTransition; cdecl;//Deprecated
    function addTarget(targetId: Integer): JTransition; cdecl; overload;//Deprecated
    function addTarget(targetName: JString): JTransition; cdecl; overload;//Deprecated
    procedure captureEndValues(transitionValues: JTransitionValues); cdecl;//Deprecated
    procedure captureStartValues(transitionValues: JTransitionValues); cdecl;//Deprecated
    function clone: JTransition; cdecl;//Deprecated
    function excludeChildren(type_: Jlang_Class; exclude: Boolean): JTransition; cdecl; overload;
    function excludeTarget(targetId: Integer; exclude: Boolean): JTransition; cdecl; overload;
    function excludeTarget(targetName: JString; exclude: Boolean): JTransition; cdecl; overload;
    function getEpicenter: JRect; cdecl;
    function getEpicenterCallback: JTransition_EpicenterCallback; cdecl;
    function getPropagation: JTransitionPropagation; cdecl;
    function getStartDelay: Int64; cdecl;
    function getTargetIds: JList; cdecl;
    function getTransitionProperties: TJavaObjectArray<JString>; cdecl;
    function getTransitionValues(view: JView; start: Boolean): JTransitionValues; cdecl;
    function isTransitionRequired(startValues: JTransitionValues; endValues: JTransitionValues): Boolean; cdecl;
    function removeTarget(target: JView): JTransition; cdecl; overload;//Deprecated
    function removeTarget(target: Jlang_Class): JTransition; cdecl; overload;//Deprecated
    function setDuration(duration: Int64): JTransition; cdecl;//Deprecated
    procedure setPathMotion(pathMotion: JPathMotion); cdecl;//Deprecated
    procedure setPropagation(transitionPropagation: JTransitionPropagation); cdecl;//Deprecated
    function setStartDelay(startDelay: Int64): JTransition; cdecl;//Deprecated
  end;
  TJTransition = class(TJavaGenericImport<JTransitionClass, JTransition>) end;

  JTransition_EpicenterCallbackClass = interface(JObjectClass)
    ['{8141257A-130B-466C-A08D-AA3A00946F4C}']
    {class} function init: JTransition_EpicenterCallback; cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/Transition$EpicenterCallback')]
  JTransition_EpicenterCallback = interface(JObject)
    ['{CE004917-266F-4076-8913-F23184824FBA}']
    function onGetEpicenter(transition: JTransition): JRect; cdecl;//Deprecated
  end;
  TJTransition_EpicenterCallback = class(TJavaGenericImport<JTransition_EpicenterCallbackClass, JTransition_EpicenterCallback>) end;

  JTransition_TransitionListenerClass = interface(IJavaClass)
    ['{D5083752-E8A6-46DF-BE40-AE11073C387E}']
    {class} procedure onTransitionCancel(transition: JTransition); cdecl;//Deprecated
    {class} procedure onTransitionEnd(transition: JTransition); cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/Transition$TransitionListener')]
  JTransition_TransitionListener = interface(IJavaInstance)
    ['{C32BE107-6E05-4898-AF0A-FAD970D66E29}']
    procedure onTransitionPause(transition: JTransition); cdecl;
    procedure onTransitionResume(transition: JTransition); cdecl;
    procedure onTransitionStart(transition: JTransition); cdecl;
  end;
  TJTransition_TransitionListener = class(TJavaGenericImport<JTransition_TransitionListenerClass, JTransition_TransitionListener>) end;

  JTransitionManagerClass = interface(JObjectClass)
    ['{4160EFA0-3499-4964-817E-46497BB5B957}']
    {class} function init: JTransitionManager; cdecl;//Deprecated
    {class} procedure beginDelayedTransition(sceneRoot: JViewGroup); cdecl; overload;
    {class} procedure beginDelayedTransition(sceneRoot: JViewGroup; transition: JTransition); cdecl; overload;
    {class} procedure endTransitions(sceneRoot: JViewGroup); cdecl;
    {class} procedure go(scene: JScene); cdecl; overload;
    {class} procedure go(scene: JScene; transition: JTransition); cdecl; overload;
    {class} procedure setTransition(scene: JScene; transition: JTransition); cdecl; overload;
    {class} procedure setTransition(fromScene: JScene; toScene: JScene; transition: JTransition); cdecl; overload;
  end;

  [JavaSignature('android/transition/TransitionManager')]
  JTransitionManager = interface(JObject)
    ['{FF5E1210-1F04-4F81-9CAC-3D7A5C4E972B}']
    procedure transitionTo(scene: JScene); cdecl;//Deprecated
  end;
  TJTransitionManager = class(TJavaGenericImport<JTransitionManagerClass, JTransitionManager>) end;

  JTransitionPropagationClass = interface(JObjectClass)
    ['{A881388A-C877-4DD9-9BAD-1BA4F56133EE}']
    {class} function init: JTransitionPropagation; cdecl;//Deprecated
    {class} procedure captureValues(transitionValues: JTransitionValues); cdecl;//Deprecated
    {class} function getPropagationProperties: TJavaObjectArray<JString>; cdecl;//Deprecated
    {class} function getStartDelay(sceneRoot: JViewGroup; transition: JTransition; startValues: JTransitionValues; endValues: JTransitionValues): Int64; cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/TransitionPropagation')]
  JTransitionPropagation = interface(JObject)
    ['{7595B7EF-6BCE-4281-BC67-335E2FB6C091}']
  end;
  TJTransitionPropagation = class(TJavaGenericImport<JTransitionPropagationClass, JTransitionPropagation>) end;

  JTransitionValuesClass = interface(JObjectClass)
    ['{3BF98CFA-6A4D-4815-8D42-15E97C916D91}']
    {class} function _Getvalues: JMap; cdecl;
    {class} function _Getview: JView; cdecl;
    {class} procedure _Setview(Value: JView); cdecl;
    {class} function init: JTransitionValues; cdecl;//Deprecated
    {class} property values: JMap read _Getvalues;
    {class} property view: JView read _Getview write _Setview;
  end;

  [JavaSignature('android/transition/TransitionValues')]
  JTransitionValues = interface(JObject)
    ['{178E09E6-D32C-48A9-ADCF-8CCEA804052A}']
    function equals(other: JObject): Boolean; cdecl;//Deprecated
    function hashCode: Integer; cdecl;//Deprecated
    function toString: JString; cdecl;//Deprecated
  end;
  TJTransitionValues = class(TJavaGenericImport<JTransitionValuesClass, JTransitionValues>) end;

  JInterpolatorClass = interface(JTimeInterpolatorClass)
    ['{A575B46A-E489-409C-807A-1B8F2BE092E8}']
  end;

  [JavaSignature('android/view/animation/Interpolator')]
  JInterpolator = interface(JTimeInterpolator)
    ['{F1082403-52DA-4AF0-B017-DAB334325FC7}']
  end;
  TJInterpolator = class(TJavaGenericImport<JInterpolatorClass, JInterpolator>) end;

  JToolbar_LayoutParamsClass = interface(JActionBar_LayoutParamsClass)
    ['{6D43796C-C163-4084-BB30-6FE68AFD7ABB}']
    {class} function init(c: JContext; attrs: JAttributeSet): JToolbar_LayoutParams; cdecl; overload;//Deprecated
    {class} function init(width: Integer; height: Integer): JToolbar_LayoutParams; cdecl; overload;//Deprecated
    {class} function init(width: Integer; height: Integer; gravity: Integer): JToolbar_LayoutParams; cdecl; overload;//Deprecated
    {class} function init(gravity: Integer): JToolbar_LayoutParams; cdecl; overload;//Deprecated
    {class} function init(source: JToolbar_LayoutParams): JToolbar_LayoutParams; cdecl; overload;//Deprecated
    {class} function init(source: JActionBar_LayoutParams): JToolbar_LayoutParams; cdecl; overload;//Deprecated
    {class} function init(source: JViewGroup_MarginLayoutParams): JToolbar_LayoutParams; cdecl; overload;//Deprecated
    {class} function init(source: JViewGroup_LayoutParams): JToolbar_LayoutParams; cdecl; overload;//Deprecated
  end;

  [JavaSignature('android/widget/Toolbar$LayoutParams')]
  JToolbar_LayoutParams = interface(JActionBar_LayoutParams)
    ['{BCD101F9-B7B7-4B2F-9460-056B3EA7B9F0}']
  end;
  TJToolbar_LayoutParams = class(TJavaGenericImport<JToolbar_LayoutParamsClass, JToolbar_LayoutParams>) end;

  JBalancaClass = interface(JObjectClass)
    ['{C3BBCD1B-74D4-4D32-9EFB-EC01C4135C24}']
  end;

  [JavaSignature('com/elgin/e1/Balanca/Balanca')]
  JBalanca = interface(JObject)
    ['{64A833C7-1AB6-4BC1-A68A-953EA8606002}']
  end;
  TJBalanca = class(TJavaGenericImport<JBalancaClass, JBalanca>) end;

  JBalanca_ConfigClass = interface(JObjectClass)
    ['{2B2DA864-BC43-4118-8FBD-B712DA2D9010}']
    {class} function init(P1: Integer; P2: Integer; P3: Integer; P4: Integer): JBalanca_Config; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Balanca/Balanca$Config')]
  JBalanca_Config = interface(JObject)
    ['{393CCA8C-4DBA-423D-A790-A7CE19CFD6C5}']
    function _Getlength: Integer; cdecl;
    function _Getparity: Integer; cdecl;
    function _Getstopbits: Integer; cdecl;
    property length: Integer read _Getlength;
    property parity: Integer read _Getparity;
    property stopbits: Integer read _Getstopbits;
  end;
  TJBalanca_Config = class(TJavaGenericImport<JBalanca_ConfigClass, JBalanca_Config>) end;

  JBalanca_ConfigAltValuesClass = interface(JEnumClass)
    ['{E9F2333B-8DDB-45E9-8602-85CA66A10784}']
    {class} function _GetEvenParity: JBalanca_ConfigAltValues; cdecl;
    {class} function _GetNenhum: JBalanca_ConfigAltValues; cdecl;
    {class} function _GetNoParity: JBalanca_ConfigAltValues; cdecl;
    {class} function _GetOddParity: JBalanca_ConfigAltValues; cdecl;
    {class} function _GetQualquer: JBalanca_ConfigAltValues; cdecl;
    {class} function valueOf(P1: JString): JBalanca_ConfigAltValues; cdecl;
    {class} function values: TJavaObjectArray<JBalanca_ConfigAltValues>; cdecl;
    {class} property EvenParity: JBalanca_ConfigAltValues read _GetEvenParity;
    {class} property Nenhum: JBalanca_ConfigAltValues read _GetNenhum;
    {class} property NoParity: JBalanca_ConfigAltValues read _GetNoParity;
    {class} property OddParity: JBalanca_ConfigAltValues read _GetOddParity;
    {class} property Qualquer: JBalanca_ConfigAltValues read _GetQualquer;
  end;

  [JavaSignature('com/elgin/e1/Balanca/Balanca$ConfigAltValues')]
  JBalanca_ConfigAltValues = interface(JEnum)
    ['{0A53FA6D-0518-4D1F-8C0D-9CFEA0399A48}']
    function _Getvalor: Integer; cdecl;
    property valor: Integer read _Getvalor;
  end;
  TJBalanca_ConfigAltValues = class(TJavaGenericImport<JBalanca_ConfigAltValuesClass, JBalanca_ConfigAltValues>) end;

  JBalanca_ModeloBalancaClass = interface(JEnumClass)
    ['{004F2FFD-7B99-4F0A-9DBE-795FA327CE1C}']
    {class} function _GetDP3005: JBalanca_ModeloBalanca; cdecl;
    {class} function _GetDPSC: JBalanca_ModeloBalanca; cdecl;
    {class} function _GetSA110: JBalanca_ModeloBalanca; cdecl;
    {class} function _GetSemBalanca: JBalanca_ModeloBalanca; cdecl;
    {class} function valueOf(P1: JString): JBalanca_ModeloBalanca; cdecl;
    {class} function values: TJavaObjectArray<JBalanca_ModeloBalanca>; cdecl;
    {class} property DP3005: JBalanca_ModeloBalanca read _GetDP3005;
    {class} property DPSC: JBalanca_ModeloBalanca read _GetDPSC;
    {class} property SA110: JBalanca_ModeloBalanca read _GetSA110;
    {class} property SemBalanca: JBalanca_ModeloBalanca read _GetSemBalanca;
  end;

  [JavaSignature('com/elgin/e1/Balanca/Balanca$ModeloBalanca')]
  JBalanca_ModeloBalanca = interface(JEnum)
    ['{61F57B43-AF44-4018-8D40-264A13836121}']
    function _Getvalor: Integer; cdecl;
    property valor: Integer read _Getvalor;
  end;
  TJBalanca_ModeloBalanca = class(TJavaGenericImport<JBalanca_ModeloBalancaClass, JBalanca_ModeloBalanca>) end;

  JBalanca_ProtocoloComunicacaoClass = interface(JEnumClass)
    ['{D0E64D22-381D-4E8B-AB90-1157F8894CF3}']
    {class} function _GetProtocolo0: JBalanca_ProtocoloComunicacao; cdecl;
    {class} function _GetProtocolo1: JBalanca_ProtocoloComunicacao; cdecl;
    {class} function _GetProtocolo2: JBalanca_ProtocoloComunicacao; cdecl;
    {class} function _GetProtocolo3: JBalanca_ProtocoloComunicacao; cdecl;
    {class} function _GetProtocolo4: JBalanca_ProtocoloComunicacao; cdecl;
    {class} function _GetProtocolo5: JBalanca_ProtocoloComunicacao; cdecl;
    {class} function _GetProtocolo7: JBalanca_ProtocoloComunicacao; cdecl;
    {class} function _GetSemProtocolo: JBalanca_ProtocoloComunicacao; cdecl;
    {class} function valueOf(P1: JString): JBalanca_ProtocoloComunicacao; cdecl;
    {class} function values: TJavaObjectArray<JBalanca_ProtocoloComunicacao>; cdecl;
    {class} property Protocolo0: JBalanca_ProtocoloComunicacao read _GetProtocolo0;
    {class} property Protocolo1: JBalanca_ProtocoloComunicacao read _GetProtocolo1;
    {class} property Protocolo2: JBalanca_ProtocoloComunicacao read _GetProtocolo2;
    {class} property Protocolo3: JBalanca_ProtocoloComunicacao read _GetProtocolo3;
    {class} property Protocolo4: JBalanca_ProtocoloComunicacao read _GetProtocolo4;
    {class} property Protocolo5: JBalanca_ProtocoloComunicacao read _GetProtocolo5;
    {class} property Protocolo7: JBalanca_ProtocoloComunicacao read _GetProtocolo7;
    {class} property SemProtocolo: JBalanca_ProtocoloComunicacao read _GetSemProtocolo;
  end;

  [JavaSignature('com/elgin/e1/Balanca/Balanca$ProtocoloComunicacao')]
  JBalanca_ProtocoloComunicacao = interface(JEnum)
    ['{AB0D76D5-41E5-4CAA-A662-7CB98FF566FA}']
    function _Getvalor: Integer; cdecl;
    property valor: Integer read _Getvalor;
  end;
  TJBalanca_ProtocoloComunicacao = class(TJavaGenericImport<JBalanca_ProtocoloComunicacaoClass, JBalanca_ProtocoloComunicacao>) end;

  JBalancaE1Class = interface(JObjectClass)
    ['{652F0D17-F4F0-4CD8-830D-FA162CBA22C3}']
    {class} function AbrirSerial(P1: Integer; P2: Integer; P3: Char; P4: Integer): Integer; cdecl;//Deprecated
    {class} function ConfigurarModeloBalanca(P1: Integer): Integer; cdecl;//Deprecated
    {class} function ConfigurarProtocoloComunicacao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function DirectIO(P1: TJavaArray<Byte>; P2: Integer; P3: TJavaArray<Byte>; P4: Integer; P5: Boolean): Integer; cdecl;//Deprecated
    {class} function Fechar: Integer; cdecl;//Deprecated
    {class} function GetContinuousReadTime: Integer; cdecl;//Deprecated
    {class} function LerPeso(P1: Integer): JString; cdecl;//Deprecated
    {class} function LerPreco(P1: Integer): JString; cdecl;//Deprecated
    {class} function LerTara: JString; cdecl;//Deprecated
    {class} function LerTotal(P1: Double): JString; cdecl;//Deprecated
    {class} function LigarDesligarDisplay: Integer; cdecl;//Deprecated
    {class} function ObterModeloBalanca: Integer; cdecl;//Deprecated
    {class} function ObterProtocoloComunicacao: Integer; cdecl;//Deprecated
    {class} function ObterTipoConexao: Integer; cdecl;//Deprecated
    {class} procedure SetContinuousReadTime(P1: Integer); cdecl;//Deprecated
    {class} function TararBalanca: Integer; cdecl;//Deprecated
    {class} function ZerarBalanca: Integer; cdecl;//Deprecated
    {class} function init: JBalancaE1; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Balanca/BalancaE1')]
  JBalancaE1 = interface(JObject)
    ['{1B8ADB03-3A98-474A-A501-90A8540B2C3D}']
  end;
  TJBalancaE1 = class(TJavaGenericImport<JBalancaE1Class, JBalancaE1>) end;

  JBalancasClass = interface(JObjectClass)
    ['{45AAE47A-EAF3-4226-AEF2-97EDA8D790AF}']
  end;

  [JavaSignature('com/elgin/e1/Balanca/Balancas')]
  JBalancas = interface(JObject)
    ['{21727A53-99C9-4C6D-B5BE-A108466A3554}']
  end;
  TJBalancas = class(TJavaGenericImport<JBalancasClass, JBalancas>) end;

  JCommClass = interface(JObjectClass)
    ['{914322EC-C47E-45C3-881D-31FC64336F0C}']
  end;

  [JavaSignature('com/elgin/e1/Balanca/Comm')]
  JComm = interface(JObject)
    ['{CE711072-69FF-42FB-9F8B-C4AF91F70FB7}']
  end;
  TJComm = class(TJavaGenericImport<JCommClass, JComm>) end;

  JComm_1Class = interface(JObjectClass)
    ['{BB99ADB8-3A2A-4697-BB98-9ED8284F550E}']
  end;

  [JavaSignature('com/elgin/e1/Balanca/Comm$1')]
  JComm_1 = interface(JObject)
    ['{FDB52A20-97BC-4CD7-9E22-007C0FFE8F5D}']
  end;
  TJComm_1 = class(TJavaGenericImport<JComm_1Class, JComm_1>) end;

  JComm_TipoConexaoClass = interface(JEnumClass)
    ['{DDA016E2-2BF3-4BC7-BD00-E2DE0624BE62}']
    {class} function _GetConexaoSerial: JComm_TipoConexao; cdecl;
    {class} function _GetConexaoTCP: JComm_TipoConexao; cdecl;
    {class} function _GetSemConexao: JComm_TipoConexao; cdecl;
    {class} function valueOf(P1: JString): JComm_TipoConexao; cdecl;
    {class} function values: TJavaObjectArray<JComm_TipoConexao>; cdecl;
    {class} property ConexaoSerial: JComm_TipoConexao read _GetConexaoSerial;
    {class} property ConexaoTCP: JComm_TipoConexao read _GetConexaoTCP;
    {class} property SemConexao: JComm_TipoConexao read _GetSemConexao;
  end;

  [JavaSignature('com/elgin/e1/Balanca/Comm$TipoConexao')]
  JComm_TipoConexao = interface(JEnum)
    ['{7B3C1547-6C17-42D6-995D-AEE44CDA6341}']
    function _Getvalor: Integer; cdecl;
    property valor: Integer read _Getvalor;
  end;
  TJComm_TipoConexao = class(TJavaGenericImport<JComm_TipoConexaoClass, JComm_TipoConexao>) end;

  JCommSerialClass = interface(JObjectClass)
    ['{23AD5E8C-C583-48B6-B9AA-6AA410483514}']
    {class} function isAuthAPI: Boolean; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Balanca/CommSerial')]
  JCommSerial = interface(JObject)
    ['{018F6043-2DAC-49C4-B780-6562FADE1014}']
  end;
  TJCommSerial = class(TJavaGenericImport<JCommSerialClass, JCommSerial>) end;

  JCommTCPClass = interface(JObjectClass)
    ['{49DA3FEE-C57F-4AC5-B285-3080C8003482}']
  end;

  [JavaSignature('com/elgin/e1/Balanca/CommTCP')]
  JCommTCP = interface(JObject)
    ['{937A7CB6-4AC7-4CB3-B039-FFDC90BD0E81}']
  end;
  TJCommTCP = class(TJavaGenericImport<JCommTCPClass, JCommTCP>) end;

  JCommTCP_TimeoutsClass = interface(JEnumClass)
    ['{0BE56B0B-CC91-48F6-A0A4-99E4D5DA9026}']
    {class} function _GetTCPReadTimeout: JCommTCP_Timeouts; cdecl;
    {class} function _GetTCPWriteTimeout: JCommTCP_Timeouts; cdecl;
    {class} function valueOf(P1: JString): JCommTCP_Timeouts; cdecl;
    {class} function values: TJavaObjectArray<JCommTCP_Timeouts>; cdecl;
    {class} property TCPReadTimeout: JCommTCP_Timeouts read _GetTCPReadTimeout;
    {class} property TCPWriteTimeout: JCommTCP_Timeouts read _GetTCPWriteTimeout;
  end;

  [JavaSignature('com/elgin/e1/Balanca/CommTCP$Timeouts')]
  JCommTCP_Timeouts = interface(JEnum)
    ['{3221A84B-35CA-4A08-9239-5857CD406CCA}']
    function _Getvalor: Integer; cdecl;
    property valor: Integer read _Getvalor;
  end;
  TJCommTCP_Timeouts = class(TJavaGenericImport<JCommTCP_TimeoutsClass, JCommTCP_Timeouts>) end;

  JInterfaceBalancaClass = interface(IJavaClass)
    ['{BEE07FA6-7C2B-4CBF-9A84-9B8104E99018}']
    {class} function abrir(P1: JString; P2: Integer): Integer; cdecl; overload;//Deprecated
    {class} function abrir(P1: Integer; P2: Integer; P3: Char; P4: Integer): Integer; cdecl; overload;//Deprecated
    {class} function configurarModeloBalanca(P1: Integer): Integer; cdecl;//Deprecated
    {class} function configurarProtocoloComunicacao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function directIO(P1: TJavaArray<Byte>; P2: Integer; P3: TJavaArray<Byte>; P4: Integer; P5: Boolean): Integer; cdecl;//Deprecated
    {class} function fechar: Integer; cdecl;//Deprecated
    {class} function getContinuousReadTime: Integer; cdecl;//Deprecated
    {class} function lerPeso(P1: Integer): JString; cdecl;//Deprecated
    {class} function lerPreco(P1: Integer): JString; cdecl;//Deprecated
    {class} function lerTara: JString; cdecl;//Deprecated
    {class} function lerTotal(P1: Double): JString; cdecl;//Deprecated
    {class} function ligarDesligarDisplay: Integer; cdecl;//Deprecated
    {class} function obterModeloBalanca: Integer; cdecl;//Deprecated
    {class} function obterProtocoloComunicacao: Integer; cdecl;//Deprecated
    {class} function obterTipoConexao: Integer; cdecl;//Deprecated
    {class} procedure setContinuousReadTime(P1: Integer); cdecl;//Deprecated
    {class} function tararBalanca: Integer; cdecl;//Deprecated
    {class} function zerarBalanca: Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Balanca/InterfaceBalanca')]
  JInterfaceBalanca = interface(IJavaInstance)
    ['{FD48A1CE-4710-47C4-859A-E54B25B8BD43}']
  end;
  TJInterfaceBalanca = class(TJavaGenericImport<JInterfaceBalancaClass, JInterfaceBalanca>) end;

  JImplementacaoBalancaClass = interface(JInterfaceBalancaClass)
    ['{C98709F0-A17C-422E-88A0-94867A64F8E5}']
    {class} function abrir(P1: JString; P2: Integer): Integer; cdecl; overload;//Deprecated
    {class} function abrir(P1: Integer; P2: Integer; P3: Char; P4: Integer): Integer; cdecl; overload;//Deprecated
    {class} function configurarModeloBalanca(P1: Integer): Integer; cdecl;//Deprecated
    {class} function configurarProtocoloComunicacao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function directIO(P1: TJavaArray<Byte>; P2: Integer; P3: TJavaArray<Byte>; P4: Integer; P5: Boolean): Integer; cdecl;//Deprecated
    {class} function fechar: Integer; cdecl;//Deprecated
    {class} function getContinuousReadTime: Integer; cdecl;//Deprecated
    {class} function lerPeso(P1: Integer): JString; cdecl;//Deprecated
    {class} function lerPreco(P1: Integer): JString; cdecl;//Deprecated
    {class} function lerTara: JString; cdecl;//Deprecated
    {class} function lerTotal(P1: Double): JString; cdecl;//Deprecated
    {class} function ligarDesligarDisplay: Integer; cdecl;//Deprecated
    {class} function obterModeloBalanca: Integer; cdecl;//Deprecated
    {class} function obterProtocoloComunicacao: Integer; cdecl;//Deprecated
    {class} function obterTipoConexao: Integer; cdecl;//Deprecated
    {class} procedure setContinuousReadTime(P1: Integer); cdecl;//Deprecated
    {class} function tararBalanca: Integer; cdecl;//Deprecated
    {class} function zerarBalanca: Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Balanca/ImplementacaoBalanca')]
  JImplementacaoBalanca = interface(JInterfaceBalanca)
    ['{0D4CE8B9-87BC-4667-9671-FFA71E42B1B9}']
  end;
  TJImplementacaoBalanca = class(TJavaGenericImport<JImplementacaoBalancaClass, JImplementacaoBalanca>) end;

  JImplementacaoBalanca_1Class = interface(JObjectClass)
    ['{12690966-D03A-43A9-9582-2B2046CF796F}']
  end;

  [JavaSignature('com/elgin/e1/Balanca/ImplementacaoBalanca$1')]
  JImplementacaoBalanca_1 = interface(JObject)
    ['{CB5B2543-7261-4874-9996-155B2DD906DC}']
  end;
  TJImplementacaoBalanca_1 = class(TJavaGenericImport<JImplementacaoBalanca_1Class, JImplementacaoBalanca_1>) end;

  Je1_BuildConfigClass = interface(JObjectClass)
    ['{CD1BAD5F-52E1-4585-B3F0-950F52FFB7A2}']
    {class} function _GetAPPLICATION_ID: JString; cdecl;
    {class} function _GetBUILD_TYPE: JString; cdecl;
    {class} function _GetDEBUG: Boolean; cdecl;
    {class} function _GetFLAVOR: JString; cdecl;
    {class} function _GetVERSION_CODE: Integer; cdecl;
    {class} function _GetVERSION_NAME: JString; cdecl;
    {class} function init: Je1_BuildConfig; cdecl;
    {class} property APPLICATION_ID: JString read _GetAPPLICATION_ID;
    {class} property BUILD_TYPE: JString read _GetBUILD_TYPE;
    {class} property DEBUG: Boolean read _GetDEBUG;
    {class} property FLAVOR: JString read _GetFLAVOR;
    {class} property VERSION_CODE: Integer read _GetVERSION_CODE;
    {class} property VERSION_NAME: JString read _GetVERSION_NAME;
  end;

  [JavaSignature('com/elgin/e1/BuildConfig')]
  Je1_BuildConfig = interface(JObject)
    ['{C387C3DF-FD01-4541-8304-A8112C629405}']
  end;
  TJe1_BuildConfig = class(TJavaGenericImport<Je1_BuildConfigClass, Je1_BuildConfig>) end;

  JConexaoClass = interface(JObjectClass)
    ['{1591CA3A-B573-4F2C-85BA-90327BD5F9FC}']
    {class} function _GetBLUETOOTH_MAX_RETURN_LENGTH: Integer; cdecl;
    {class} function _GetBLUETOOTH_WTIMEOUT: Integer; cdecl;
    {class} function _GetCONEXAO_BLUETOOTH: Integer; cdecl;
    {class} function _GetCONEXAO_M8: Integer; cdecl;
    {class} function _GetCONEXAO_SERIAL: Integer; cdecl;
    {class} function _GetCONEXAO_SERVICO: Integer; cdecl;
    {class} function _GetCONEXAO_SMARTPOS: Integer; cdecl;
    {class} function _GetCONEXAO_TCP_IP: Integer; cdecl;
    {class} function _GetCONEXAO_USB: Integer; cdecl;
    {class} function _GetMAX_RECONNECTIONS: Integer; cdecl;
    {class} function _GetSEM_CONEXAO: Integer; cdecl;
    {class} function _GetSERVICO_DELAY_TIME: Integer; cdecl;
    {class} function _GetSERVICO_MAX_RETURN_LENGTH: Integer; cdecl;
    {class} function _GetSERVICO_RTIMEOUT: Integer; cdecl;
    {class} function _GetSERVICO_WTIMEOUT: Integer; cdecl;
    {class} function _GetSMARTPOS_MAX_RETURN_LENGTH: Integer; cdecl;
    {class} function _GetSMARTPOS_RTIMEOUT: Integer; cdecl;
    {class} function _GetTCP_IP_MAX_RETURN_LENGTH: Integer; cdecl;
    {class} function _GetTCP_IP_RTIMEOUT: Integer; cdecl;
    {class} function _GetTCP_IP_WTIMEOUT: Integer; cdecl;
    {class} function getNextBluetoothSocket: Integer; cdecl;
    {class} function getNextPrintDevice: Integer; cdecl;
    {class} function getNextService: Integer; cdecl;
    {class} function getNextSocket: Integer; cdecl;
    {class} function getPrtData: TJavaArray<Byte>; cdecl;
    {class} function getTipo: Integer; cdecl;
    {class} function init: JConexao; cdecl;
    {class} procedure setNextBluetoothSocket(P1: Integer); cdecl;
    {class} procedure setNextPrintDevice(P1: Integer); cdecl;
    {class} procedure setNextService(P1: Integer); cdecl;
    {class} procedure setNextSocket(P1: Integer); cdecl;
    {class} procedure setPrtData(P1: TJavaArray<Byte>); cdecl;
    {class} procedure setTipo(P1: Integer); cdecl;
    {class} property BLUETOOTH_MAX_RETURN_LENGTH: Integer read _GetBLUETOOTH_MAX_RETURN_LENGTH;
    {class} property BLUETOOTH_WTIMEOUT: Integer read _GetBLUETOOTH_WTIMEOUT;
    {class} property CONEXAO_BLUETOOTH: Integer read _GetCONEXAO_BLUETOOTH;
    {class} property CONEXAO_M8: Integer read _GetCONEXAO_M8;
    {class} property CONEXAO_SERIAL: Integer read _GetCONEXAO_SERIAL;
    {class} property CONEXAO_SERVICO: Integer read _GetCONEXAO_SERVICO;
    {class} property CONEXAO_SMARTPOS: Integer read _GetCONEXAO_SMARTPOS;
    {class} property CONEXAO_TCP_IP: Integer read _GetCONEXAO_TCP_IP;
    {class} property CONEXAO_USB: Integer read _GetCONEXAO_USB;
    {class} property MAX_RECONNECTIONS: Integer read _GetMAX_RECONNECTIONS;
    {class} property SEM_CONEXAO: Integer read _GetSEM_CONEXAO;
    {class} property SERVICO_DELAY_TIME: Integer read _GetSERVICO_DELAY_TIME;
    {class} property SERVICO_MAX_RETURN_LENGTH: Integer read _GetSERVICO_MAX_RETURN_LENGTH;
    {class} property SERVICO_RTIMEOUT: Integer read _GetSERVICO_RTIMEOUT;
    {class} property SERVICO_WTIMEOUT: Integer read _GetSERVICO_WTIMEOUT;
    {class} property SMARTPOS_MAX_RETURN_LENGTH: Integer read _GetSMARTPOS_MAX_RETURN_LENGTH;
    {class} property SMARTPOS_RTIMEOUT: Integer read _GetSMARTPOS_RTIMEOUT;
    {class} property TCP_IP_MAX_RETURN_LENGTH: Integer read _GetTCP_IP_MAX_RETURN_LENGTH;
    {class} property TCP_IP_RTIMEOUT: Integer read _GetTCP_IP_RTIMEOUT;
    {class} property TCP_IP_WTIMEOUT: Integer read _GetTCP_IP_WTIMEOUT;
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/Conexao')]
  JConexao = interface(JObject)
    ['{B181FFE6-CC25-42F0-A84D-F3A2B0926256}']
    function Abrir(P1: JContext; P2: Integer; P3: JString; P4: JString; P5: Integer): Integer; cdecl;
    function Escrever(P1: TJavaArray<Byte>): Integer; cdecl;
    function Fechar: Integer; cdecl;
    function Ler(P1: TJavaArray<Byte>): Integer; cdecl;
    function ReceberDados(P1: JInteiro; P2: Integer): TJavaArray<Byte>; cdecl;
    function getConM8: JConM8; cdecl;
  end;
  TJConexao = class(TJavaGenericImport<JConexaoClass, JConexao>) end;

  JConBluetoothClass = interface(JConexaoClass)
    ['{E5956C33-1D61-459A-98C6-0BF2CC067FF3}']
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConBluetooth')]
  JConBluetooth = interface(JConexao)
    ['{16FB82EC-0994-49E9-B6AE-55C10E72EE54}']
  end;
  TJConBluetooth = class(TJavaGenericImport<JConBluetoothClass, JConBluetooth>) end;

  JConBluetooth_1GetBluetoothDataClass = interface(JRunnableClass)
    ['{7EAAFC1C-E492-4456-A879-411319A53F7E}']
    {class} function getData: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function getError: Integer; cdecl;//Deprecated
    {class} procedure run; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConBluetooth$1GetBluetoothData')]
  JConBluetooth_1GetBluetoothData = interface(JRunnable)
    ['{3F947FCB-E74C-44AE-97C1-AF4B297338F3}']
  end;
  TJConBluetooth_1GetBluetoothData = class(TJavaGenericImport<JConBluetooth_1GetBluetoothDataClass, JConBluetooth_1GetBluetoothData>) end;

  JConBluetooth_1GetPrinterBluetoothClass = interface(JRunnableClass)
    ['{13D1BC52-F94C-488A-8894-E001F83FDB37}']
    {class} function init: JConBluetooth_1GetPrinterBluetooth; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConBluetooth$1GetPrinterBluetooth')]
  JConBluetooth_1GetPrinterBluetooth = interface(JRunnable)
    ['{9A185239-4036-4672-B44C-7CAB7CB7E735}']
    function _GetvalMacAddress: JString; cdecl;
    function getBluetoothSocket: JBluetoothSocket; cdecl;
    function getError: Integer; cdecl;
    procedure run; cdecl;
    property valMacAddress: JString read _GetvalMacAddress;
  end;
  TJConBluetooth_1GetPrinterBluetooth = class(TJavaGenericImport<JConBluetooth_1GetPrinterBluetoothClass, JConBluetooth_1GetPrinterBluetooth>) end;

  JConBluetooth_1SendDataClass = interface(JRunnableClass)
    ['{B97C6E4D-839E-48D9-AF12-A210BD382035}']
    {class} function init: JConBluetooth_1SendData; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConBluetooth$1SendData')]
  JConBluetooth_1SendData = interface(JRunnable)
    ['{DA338913-7865-40E6-9810-52C8964B0B41}']
    function getError: Integer; cdecl;
    function getSz: Integer; cdecl;
    procedure run; cdecl;
  end;
  TJConBluetooth_1SendData = class(TJavaGenericImport<JConBluetooth_1SendDataClass, JConBluetooth_1SendData>) end;

  JConM8Class = interface(JObjectClass)
    ['{7963FD90-7FCF-4BC0-B6A7-086C232695FD}']
    {class} function getPrinterManager: JPrinterManager; cdecl;//Deprecated
    {class} function init: JConM8; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConM8')]
  JConM8 = interface(JObject)
    ['{E092F854-0E16-4F39-8269-0339F31BFE49}']
  end;
  TJConM8 = class(TJavaGenericImport<JConM8Class, JConM8>) end;

  JPrinterManager_PrinterManagerListenerClass = interface(IJavaClass)
    ['{CF9C1F18-DA4F-40EE-A715-2476FF3A92D0}']
    {class} procedure onServiceConnected; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/minipdvm8/PrinterManager$PrinterManagerListener')]
  JPrinterManager_PrinterManagerListener = interface(IJavaInstance)
    ['{4575C89E-872C-4D68-BB1C-65613849D8BC}']
  end;
  TJPrinterManager_PrinterManagerListener = class(TJavaGenericImport<JPrinterManager_PrinterManagerListenerClass, JPrinterManager_PrinterManagerListener>) end;

  JConM8_1Class = interface(JPrinterManager_PrinterManagerListenerClass)
    ['{544CC8C2-7677-41BE-B027-88A53B30BB32}']
    {class} function init(P1: JConM8): JConM8_1; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConM8$1')]
  JConM8_1 = interface(JPrinterManager_PrinterManagerListener)
    ['{4BF46D46-6136-4CA8-82A0-3C7145851786}']
    procedure onServiceConnected; cdecl;
  end;
  TJConM8_1 = class(TJavaGenericImport<JConM8_1Class, JConM8_1>) end;

  JConSerialClass = interface(JConexaoClass)
    ['{ED1AA179-5CFF-4BF8-854F-317D994661AC}']
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConSerial')]
  JConSerial = interface(JConexao)
    ['{C11AC377-813D-44A3-80F9-AE2BA8F0E8F0}']
  end;
  TJConSerial = class(TJavaGenericImport<JConSerialClass, JConSerial>) end;

  JConServiceClass = interface(JConexaoClass)
    ['{A8E9F0E0-EA8D-49FE-8C1E-8D7D8CDD4A1D}']
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConService')]
  JConService = interface(JConexao)
    ['{EB046DE4-007A-4A1D-92FB-41535576FC5D}']
  end;
  TJConService = class(TJavaGenericImport<JConServiceClass, JConService>) end;

  JConService_1GetDataClass = interface(JRunnableClass)
    ['{F2A8A468-0A57-4E4C-85C3-F4EDF79C84B2}']
    {class} function getError: Integer; cdecl;//Deprecated
    {class} function getNumReadTotal: Integer; cdecl;//Deprecated
    {class} function getRdBuffer: TJavaArray<Byte>; cdecl;//Deprecated
    {class} procedure run; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConService$1GetData')]
  JConService_1GetData = interface(JRunnable)
    ['{5A9D4419-200E-4976-BD08-AE66B1988FFC}']
  end;
  TJConService_1GetData = class(TJavaGenericImport<JConService_1GetDataClass, JConService_1GetData>) end;

  JConService_1GetPrinterClass = interface(JRunnableClass)
    ['{FED9B89F-FFB1-409C-BFA8-A36F91A5530A}']
    {class} function init: JConService_1GetPrinter; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConService$1GetPrinter')]
  JConService_1GetPrinter = interface(JRunnable)
    ['{E80E6358-20C9-4172-8966-E9C077F27D73}']
    function _Getvalparametro: Integer; cdecl;
    function getError: Integer; cdecl;
    function getSocket: JSocket; cdecl;
    procedure run; cdecl;
    property valparametro: Integer read _Getvalparametro;
  end;
  TJConService_1GetPrinter = class(TJavaGenericImport<JConService_1GetPrinterClass, JConService_1GetPrinter>) end;

  JConService_1SendDataClass = interface(JRunnableClass)
    ['{A8F1BD99-DA19-4646-8B06-75E604E46124}']
    {class} function init: JConService_1SendData; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConService$1SendData')]
  JConService_1SendData = interface(JRunnable)
    ['{C90960FD-254D-4EC1-BC21-705C01DE38D0}']
    function getError: Integer; cdecl;
    function getSz: Integer; cdecl;
    procedure run; cdecl;
  end;
  TJConService_1SendData = class(TJavaGenericImport<JConService_1SendDataClass, JConService_1SendData>) end;

  JConService_2GetDataClass = interface(JRunnableClass)
    ['{E9E61EBF-AF1D-488D-9A2D-5CB86B30BFEC}']
    {class} function init: JConService_2GetData; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConService$2GetData')]
  JConService_2GetData = interface(JRunnable)
    ['{9AAF816D-ED92-46B4-AC7A-3F46A08F449C}']
    function getError: Integer; cdecl;
    function getNumReadTotal: Integer; cdecl;
    function getRdBuffer: TJavaArray<Byte>; cdecl;
    procedure run; cdecl;
  end;
  TJConService_2GetData = class(TJavaGenericImport<JConService_2GetDataClass, JConService_2GetData>) end;

  JConSmartPOSClass = interface(JConexaoClass)
    ['{5EF50CB6-EB3C-4C03-8D04-7F0A5084F789}']
    {class} //function getPrinterDevice(P1: Integer): JPrinterDevice; cdecl;//Deprecated
    {class} function init: JConSmartPOS; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConSmartPOS')]
  JConSmartPOS = interface(JConexao)
    ['{F83352D0-BA5B-4FE5-93B5-7BFC28A67F3C}']
  end;
  TJConSmartPOS = class(TJavaGenericImport<JConSmartPOSClass, JConSmartPOS>) end;

  JConTCP_IPClass = interface(JConexaoClass)
    ['{A1941494-D177-4C9B-A093-18D9664DD25E}']
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConTCP_IP')]
  JConTCP_IP = interface(JConexao)
    ['{C67837D6-279A-4975-97C2-3FC6229D5B5F}']
  end;
  TJConTCP_IP = class(TJavaGenericImport<JConTCP_IPClass, JConTCP_IP>) end;

  JConTCP_IP_1GetDataClass = interface(JRunnableClass)
    ['{D9C0426A-8B2B-4399-ADD5-8632A4FB2DD6}']
    {class} function getData: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function getError: Integer; cdecl;//Deprecated
    {class} procedure run; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConTCP_IP$1GetData')]
  JConTCP_IP_1GetData = interface(JRunnable)
    ['{05D00EF3-1F5B-4EA4-8168-EB5BDE048336}']
  end;
  TJConTCP_IP_1GetData = class(TJavaGenericImport<JConTCP_IP_1GetDataClass, JConTCP_IP_1GetData>) end;

  JConTCP_IP_1GetPrinterClass = interface(JRunnableClass)
    ['{37746E39-2814-43C6-A1EE-22435FA2D074}']
    {class} function init: JConTCP_IP_1GetPrinter; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConTCP_IP$1GetPrinter')]
  JConTCP_IP_1GetPrinter = interface(JRunnable)
    ['{70DB5EC3-CF36-47F6-8DA4-FD543435840A}']
    function _Getvalparametro: Integer; cdecl;
    function getError: Integer; cdecl;
    function getSocket: JSocket; cdecl;
    procedure run; cdecl;
    property valparametro: Integer read _Getvalparametro;
  end;
  TJConTCP_IP_1GetPrinter = class(TJavaGenericImport<JConTCP_IP_1GetPrinterClass, JConTCP_IP_1GetPrinter>) end;

  JConTCP_IP_1SendDataClass = interface(JRunnableClass)
    ['{89D3D29A-E139-4F56-B7AC-9F97D2A5F13A}']
    {class} function init: JConTCP_IP_1SendData; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConTCP_IP$1SendData')]
  JConTCP_IP_1SendData = interface(JRunnable)
    ['{35E1059A-86B8-42F4-8A0C-1C42B97934AE}']
    function getError: Integer; cdecl;
    function getSz: Integer; cdecl;
    procedure run; cdecl;
  end;
  TJConTCP_IP_1SendData = class(TJavaGenericImport<JConTCP_IP_1SendDataClass, JConTCP_IP_1SendData>) end;

  JConUSBClass = interface(JConexaoClass)
    ['{C8EC5040-ECB6-4900-8E05-3A5C2D03DF19}']
  end;

  [JavaSignature('com/elgin/e1/Comunicacao/ConUSB')]
  JConUSB = interface(JConexao)
    ['{2FCDF4AA-1262-4E17-9B64-9E3FBA256A27}']
  end;
  TJConUSB = class(TJavaGenericImport<JConUSBClass, JConUSB>) end;

  JInterfaceFactoryXMLSATClass = interface(IJavaClass)
    ['{1629307B-14D6-496A-A374-5EA9563C9DC5}']
    {class} function AbreCupomCancelamento(P1: JString; P2: JString; P3: JString; P4: JString; P5: Integer): Integer; cdecl;//Deprecated
    {class} function AbreCupomVenda(P1: JString; P2: JString; P3: JString; P4: JString; P5: Integer; P6: JString; P7: JString; P8: JString; P9: JString; P10: JString; P11: JString; P12: JString; P13: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSAliq(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSNT(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSOutr(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString; P6: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSQtde(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSSN(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSST(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaEntrega(P1: JString; P2: JString; P3: JString; P4: JString; P5: JString; P6: JString; P7: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMS00(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMS40(P1: JString; P2: Integer; P3: Integer; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMSSN102(P1: JString; P2: Integer; P3: Integer; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMSSN900(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaISSQN(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString; P6: JString; P7: JString; P8: JString; P9: JString): Integer; cdecl;//Deprecated
    {class} function InformaImposto(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaObsFiscoDet(P1: JString; P2: Integer; P3: JString; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISAliq(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISNT(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISOutr(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString; P6: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISQtde(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISSN(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISST(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaProduto(P1: JString; P2: JString; P3: JString; P4: JString; P5: JString; P6: JString; P7: JString; P8: JString; P9: JString; P10: JString; P11: JString; P12: JString; P13: JString): Integer; cdecl;//Deprecated
    {class} function InformaTotal(P1: JString; P2: JString; P3: JString; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformainfAdProd(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformainfAdic(P1: JString; P2: JString): Integer; cdecl;//Deprecated
    {class} function Informapgto(P1: JString; P2: JString; P3: JString; P4: JString): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Fiscal/InterfaceFactoryXMLSAT')]
  JInterfaceFactoryXMLSAT = interface(IJavaInstance)
    ['{C499C273-5F56-4F95-B2D6-A04ADE466211}']
  end;
  TJInterfaceFactoryXMLSAT = class(TJavaGenericImport<JInterfaceFactoryXMLSATClass, JInterfaceFactoryXMLSAT>) end;

  JImplementacaoFactoryXMLSATClass = interface(JInterfaceFactoryXMLSATClass)
    ['{36C4DF3C-A08C-41AE-993D-699E5E58AD62}']
    {class} function AbreCupomCancelamento(P1: JString; P2: JString; P3: JString; P4: JString; P5: Integer): Integer; cdecl;//Deprecated
    {class} function AbreCupomVenda(P1: JString; P2: JString; P3: JString; P4: JString; P5: Integer; P6: JString; P7: JString; P8: JString; P9: JString; P10: JString; P11: JString; P12: JString; P13: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSAliq(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSNT(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSOutr(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString; P6: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSQtde(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSSN(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSST(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaEntrega(P1: JString; P2: JString; P3: JString; P4: JString; P5: JString; P6: JString; P7: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMS00(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMS40(P1: JString; P2: Integer; P3: Integer; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMSSN102(P1: JString; P2: Integer; P3: Integer; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMSSN900(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaISSQN(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString; P6: JString; P7: JString; P8: JString; P9: JString): Integer; cdecl;//Deprecated
    {class} function InformaImposto(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaObsFiscoDet(P1: JString; P2: Integer; P3: JString; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISAliq(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISNT(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISOutr(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString; P6: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISQtde(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISSN(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISST(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaProduto(P1: JString; P2: JString; P3: JString; P4: JString; P5: JString; P6: JString; P7: JString; P8: JString; P9: JString; P10: JString; P11: JString; P12: JString; P13: JString): Integer; cdecl;//Deprecated
    {class} function InformaTotal(P1: JString; P2: JString; P3: JString; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformainfAdProd(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformainfAdic(P1: JString; P2: JString): Integer; cdecl;//Deprecated
    {class} function Informapgto(P1: JString; P2: JString; P3: JString; P4: JString): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Fiscal/ImplementacaoFactoryXMLSAT')]
  JImplementacaoFactoryXMLSAT = interface(JInterfaceFactoryXMLSAT)
    ['{2D372364-0468-4232-B8F9-45138ECFB260}']
  end;
  TJImplementacaoFactoryXMLSAT = class(TJavaGenericImport<JImplementacaoFactoryXMLSATClass, JImplementacaoFactoryXMLSAT>) end;

  JInterfaceSATClass = interface(IJavaClass)
    ['{A335F466-E99C-4D2D-BECE-A2BD33D90ED3}']
    {class} function AssociarAssinatura(P1: Integer; P2: JString; P3: JString; P4: JString): JString; cdecl;//Deprecated
    {class} function AtivarSAT(P1: Integer; P2: Integer; P3: JString; P4: JString; P5: Integer): JString; cdecl;//Deprecated
    {class} function AtualizarSoftwareSAT(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function BloquearSAT(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function CancelaVendaImpressaSAT(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: JString; P6: JString): JString; cdecl;//Deprecated
    {class} function CancelarUltimaVenda(P1: Integer; P2: JString; P3: JString; P4: JString): JString; cdecl;//Deprecated
    {class} function ConfigurarInterfaceDeRede(P1: Integer; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function ConsultarNumeroSessao(P1: Integer; P2: JString; P3: Integer): JString; cdecl;//Deprecated
    {class} function ConsultarSat(P1: Integer): JString; cdecl;//Deprecated
    {class} function ConsultarStatusEspecifico(P1: Integer; P2: Integer; P3: JString): JString; cdecl;//Deprecated
    {class} function ConsultarStatusOperacional(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function ConsultarUltimaSessaoFiscal(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function CriaXMLCancelamentoSAT(P1: JString; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function DecodificaBase64(P1: JString): JString; cdecl;//Deprecated
    {class} function DesbloquearSAT(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function EnviarDadosVenda(P1: Integer; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function ExtrairLogs(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function GetVersaoDLL: JString; cdecl;//Deprecated
    {class} function TesteFimAFim(P1: Integer; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function TrocarCodigoDeAtivacao(P1: Integer; P2: JString; P3: Integer; P4: JString; P5: JString): JString; cdecl;//Deprecated
    {class} function VendaImpressaSAT(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: JString; P7: JString): JString; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Fiscal/InterfaceSAT')]
  JInterfaceSAT = interface(IJavaInstance)
    ['{0C84FFAE-8A4F-4915-B336-5467D492161D}']
  end;
  TJInterfaceSAT = class(TJavaGenericImport<JInterfaceSATClass, JInterfaceSAT>) end;

  JImplementacaoSATClass = interface(JInterfaceSATClass)
    ['{F12C6B43-D8C8-4352-A6CC-5CC7D0C30CCD}']
    {class} function AssociarAssinatura(P1: Integer; P2: JString; P3: JString; P4: JString): JString; cdecl;//Deprecated
    {class} function AtivarSAT(P1: Integer; P2: Integer; P3: JString; P4: JString; P5: Integer): JString; cdecl;//Deprecated
    {class} function AtualizarSoftwareSAT(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function BloquearSAT(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function CancelaVendaImpressaSAT(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: JString; P6: JString): JString; cdecl;//Deprecated
    {class} function CancelarUltimaVenda(P1: Integer; P2: JString; P3: JString; P4: JString): JString; cdecl;//Deprecated
    {class} function ConfigurarInterfaceDeRede(P1: Integer; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function ConsultarNumeroSessao(P1: Integer; P2: JString; P3: Integer): JString; cdecl;//Deprecated
    {class} function ConsultarSat(P1: Integer): JString; cdecl;//Deprecated
    {class} function ConsultarStatusEspecifico(P1: Integer; P2: Integer; P3: JString): JString; cdecl;//Deprecated
    {class} function ConsultarStatusOperacional(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function ConsultarUltimaSessaoFiscal(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function CriaXMLCancelamentoSAT(P1: JString; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function DecodificaBase64(P1: JString): JString; cdecl;//Deprecated
    {class} function DesbloquearSAT(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function EnviarDadosVenda(P1: Integer; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function ExtrairLogs(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function GetVersaoDLL: JString; cdecl;//Deprecated
    {class} function TesteFimAFim(P1: Integer; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function TrocarCodigoDeAtivacao(P1: Integer; P2: JString; P3: Integer; P4: JString; P5: JString): JString; cdecl;//Deprecated
    {class} function VendaImpressaSAT(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: JString; P7: JString): JString; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Fiscal/ImplementacaoSAT')]
  JImplementacaoSAT = interface(JInterfaceSAT)
    ['{0C8339FC-1E4F-4A01-8B98-0201E9979699}']
  end;
  TJImplementacaoSAT = class(TJavaGenericImport<JImplementacaoSATClass, JImplementacaoSAT>) end;

  JMFeClass = interface(JObjectClass)
    ['{7E86673A-70A8-4658-912E-C3070B3F717A}']
    {class} function init: JMFe; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Fiscal/MFe')]
  JMFe = interface(JObject)
    ['{DFF8A378-6977-4C7C-A782-46354C2F8DCC}']
  end;
  TJMFe = class(TJavaGenericImport<JMFeClass, JMFe>) end;

  JNFCeClass = interface(JObjectClass)
    ['{BAF7543E-EEF0-4494-BBFC-D609D1C97A9F}']
    {class} function init: JNFCe; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Fiscal/NFCe')]
  JNFCe = interface(JObject)
    ['{A4E7FACF-639A-4FF9-9FAC-A94876AD20DB}']
  end;
  TJNFCe = class(TJavaGenericImport<JNFCeClass, JNFCe>) end;

  JSATClass = interface(JObjectClass)
    ['{B15E47D2-4DBC-4040-94FD-C7B3B8135A7A}']
    {class} function AbreCupomCancelamento(P1: JString; P2: JString; P3: JString; P4: JString; P5: Integer): Integer; cdecl;//Deprecated
    {class} function AbreCupomVenda(P1: JString; P2: JString; P3: JString; P4: JString; P5: Integer; P6: JString; P7: JString; P8: JString; P9: JString; P10: JString; P11: JString; P12: JString; P13: JString): Integer; cdecl;//Deprecated
    {class} function AssociarAssinatura(P1: Integer; P2: JString; P3: JString; P4: JString): JString; cdecl;//Deprecated
    {class} function AtivarSAT(P1: Integer; P2: Integer; P3: JString; P4: JString; P5: Integer): JString; cdecl;//Deprecated
    {class} function AtualizarSoftwareSAT(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function BloquearSAT(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function CancelaVendaImpressaSAT(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: JString; P6: JString): JString; cdecl;//Deprecated
    {class} function CancelarUltimaVenda(P1: Integer; P2: JString; P3: JString; P4: JString): JString; cdecl;//Deprecated
    {class} function ConfigurarInterfaceDeRede(P1: Integer; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function ConsultarNumeroSessao(P1: Integer; P2: JString; P3: Integer): JString; cdecl;//Deprecated
    {class} function ConsultarSat(P1: Integer): JString; cdecl;//Deprecated
    {class} function ConsultarStatusEspecifico(P1: Integer; P2: Integer; P3: JString): JString; cdecl;//Deprecated
    {class} function ConsultarStatusOperacional(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function ConsultarUltimaSessaoFiscal(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function CriaXMLCancelamentoSAT(P1: JString; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function DecodificaBase64(P1: JString): JString; cdecl;//Deprecated
    {class} function DesbloquearSAT(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function EnviarDadosVenda(P1: Integer; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function ExtrairLogs(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function GetVersaoDLL: JString; cdecl;//Deprecated
    {class} function InformaCOFINSAliq(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSNT(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSOutr(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString; P6: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSQtde(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSSN(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaCOFINSST(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaEntrega(P1: JString; P2: JString; P3: JString; P4: JString; P5: JString; P6: JString; P7: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMS00(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMS40(P1: JString; P2: Integer; P3: Integer; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMSSN102(P1: JString; P2: Integer; P3: Integer; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformaICMSSN900(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaISSQN(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString; P6: JString; P7: JString; P8: JString; P9: JString): Integer; cdecl;//Deprecated
    {class} function InformaImposto(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaInfAdProd(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaInfAdic(P1: JString; P2: JString): Integer; cdecl;//Deprecated
    {class} function InformaObsFiscoDet(P1: JString; P2: Integer; P3: JString; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISAliq(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISNT(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISOutr(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString; P6: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISQtde(P1: JString; P2: Integer; P3: JString; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISSN(P1: JString; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function InformaPISST(P1: JString; P2: Integer; P3: Integer; P4: JString; P5: JString): Integer; cdecl;//Deprecated
    {class} function InformaPgto(P1: JString; P2: JString; P3: JString; P4: JString): Integer; cdecl;//Deprecated
    {class} function InformaProduto(P1: JString; P2: JString; P3: JString; P4: JString; P5: JString; P6: JString; P7: JString; P8: JString; P9: JString; P10: JString; P11: JString; P12: JString; P13: JString): Integer; cdecl;//Deprecated
    {class} function InformaTotal(P1: JString; P2: JString; P3: JString; P4: JString): Integer; cdecl;//Deprecated
    {class} function TesteFimAFim(P1: Integer; P2: JString; P3: JString): JString; cdecl;//Deprecated
    {class} function TrocarCodigoDeAtivacao(P1: Integer; P2: JString; P3: Integer; P4: JString; P5: JString): JString; cdecl;//Deprecated
    {class} function VendaImpressaSAT(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: JString; P7: JString): JString; cdecl;//Deprecated
    {class} function getServiceResult: Integer; cdecl;//Deprecated
    {class} function init: JSAT; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Fiscal/SAT')]
  JSAT = interface(JObject)
    ['{6E7D6D26-8DA4-4AAA-B94E-5E042E85A95A}']
  end;
  TJSAT = class(TJavaGenericImport<JSATClass, JSAT>) end;

  JAndroidClass = interface(JObjectClass)
    ['{2BF9F246-BE29-4BAA-8DFD-B90AD86E9649}']
    {class} function GetNumeroSerie: JString; cdecl;//Deprecated
    {class} function init: JAndroid; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Android')]
  JAndroid = interface(JObject)
    ['{63F32E6E-D7C1-4C16-A9DD-F130B60EEC01}']
  end;
  TJAndroid = class(TJavaGenericImport<JAndroidClass, JAndroid>) end;

  JdsImpressoraClass = interface(JObjectClass)
    ['{8AE620E3-5049-47D5-9EB6-15B728F69972}']
    {class} function _GettimeoutLeitura: Integer; cdecl;
    {class} function init: JdsImpressora; cdecl;
    {class} property timeoutLeitura: Integer read _GettimeoutLeitura;
  end;

  [JavaSignature('com/elgin/e1/Impressora/Config/dsImpressora')]
  JdsImpressora = interface(JObject)
    ['{39F49DF9-4422-4927-87E6-74DD4C344AAF}']
    function getIDHardwareImpressora(P1: Integer): JdsImpressora_infoHW; cdecl;
    function getIDHardwareImpressoraSize: Integer; cdecl;
    function getVersoesNFCSuportada(P1: Integer): JString; cdecl;
    function getVersoesNFCSuportadaSize: Integer; cdecl;
  end;
  TJdsImpressora = class(TJavaGenericImport<JdsImpressoraClass, JdsImpressora>) end;

  JdsImpressora_1Class = interface(JObjectClass)
    ['{A629FF05-E0CC-49BF-B9F0-697A507D9FC2}']
  end;

  [JavaSignature('com/elgin/e1/Impressora/Config/dsImpressora$1')]
  JdsImpressora_1 = interface(JObject)
    ['{84739736-2527-4E6B-A229-CB2D215F3037}']
  end;
  TJdsImpressora_1 = class(TJavaGenericImport<JdsImpressora_1Class, JdsImpressora_1>) end;

  JdsImpressora_infoHWClass = interface(JObjectClass)
    ['{092C17E7-96CE-4EBC-823E-73751F95968B}']
    {class} function _Getid: Integer; cdecl;
    {class} function init(P1: JdsImpressora; P2: Integer; P3: JString; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer; P9: Integer; P10: Integer; P11: JdsImpressora_1): JdsImpressora_infoHW; cdecl;
    {class} property id: Integer read _Getid;
  end;

  [JavaSignature('com/elgin/e1/Impressora/Config/dsImpressora$infoHW')]
  JdsImpressora_infoHW = interface(JObject)
    ['{FB18470C-400D-4A65-AA51-165007570251}']
    function _GetPID: Integer; cdecl;
    function _GetVID: Integer; cdecl;
    function _GetalinhamentoQRCodeModoPaginaH: Integer; cdecl;
    function _GetalinhamentoQRCodeModoPaginaL: Integer; cdecl;
    function _GetcodPage: Integer; cdecl;
    function _Getmodelo: JString; cdecl;
    function _GetnumColunaA: Integer; cdecl;
    function _GetnumColunaB: Integer; cdecl;
    function _Getthis0: JdsImpressora; cdecl;
    property PID: Integer read _GetPID;
    property VID: Integer read _GetVID;
    property alinhamentoQRCodeModoPaginaH: Integer read _GetalinhamentoQRCodeModoPaginaH;
    property alinhamentoQRCodeModoPaginaL: Integer read _GetalinhamentoQRCodeModoPaginaL;
    property codPage: Integer read _GetcodPage;
    property modelo: JString read _Getmodelo;
    property numColunaA: Integer read _GetnumColunaA;
    property numColunaB: Integer read _GetnumColunaB;
    property this0: JdsImpressora read _Getthis0;
  end;
  TJdsImpressora_infoHW = class(TJavaGenericImport<JdsImpressora_infoHWClass, JdsImpressora_infoHW>) end;

  JdsSATClass = interface(JObjectClass)
    ['{52629B4F-749F-4052-B315-53D1B83DF4EA}']
    {class} function getChaves(P1: Integer): JdsSAT_ChaveDePesquisa; cdecl;//Deprecated
    {class} function getChavesSize: Integer; cdecl;//Deprecated
    {class} function init: JdsSAT; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Config/dsSAT')]
  JdsSAT = interface(JObject)
    ['{20ADA798-55C6-4639-B5C7-2AA982E63F07}']
  end;
  TJdsSAT = class(TJavaGenericImport<JdsSATClass, JdsSAT>) end;

  JdsSAT_1Class = interface(JObjectClass)
    ['{4D85AEDE-4713-4A2A-8D68-05F03A0B338E}']
  end;

  [JavaSignature('com/elgin/e1/Impressora/Config/dsSAT$1')]
  JdsSAT_1 = interface(JObject)
    ['{06F8962F-DFF4-4320-ABD7-1B1D974AFA60}']
  end;
  TJdsSAT_1 = class(TJavaGenericImport<JdsSAT_1Class, JdsSAT_1>) end;

  JdsSAT_ChaveDePesquisaClass = interface(JObjectClass)
    ['{FBA65BF3-68BD-43AC-B222-A7EE88E770AE}']
    {class} function _Getindex: Integer; cdecl;
    {class} function init(P1: JdsSAT; P2: Integer; P3: TJavaObjectArray<JString>; P4: JdsSAT_1): JdsSAT_ChaveDePesquisa; cdecl;
    {class} property index: Integer read _Getindex;
  end;

  [JavaSignature('com/elgin/e1/Impressora/Config/dsSAT$ChaveDePesquisa')]
  JdsSAT_ChaveDePesquisa = interface(JObject)
    ['{4C6CE88B-2133-40D0-9B69-379C0B6913F5}']
    function _Getchave: TJavaObjectArray<JString>; cdecl;
    function _Getthis0: JdsSAT; cdecl;
    property chave: TJavaObjectArray<JString> read _Getchave;
    property this0: JdsSAT read _Getthis0;
  end;
  TJdsSAT_ChaveDePesquisa = class(TJavaGenericImport<JdsSAT_ChaveDePesquisaClass, JdsSAT_ChaveDePesquisa>) end;

  JEtiquetaClass = interface(JObjectClass)
    ['{58A39179-4A8F-4AFE-8A96-9C57AD3B4388}']
    {class} function DespejarArquivo(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: JString): Integer; cdecl;//Deprecated
    {class} function DirectIO(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: TJavaArray<Byte>; P6: Integer; P7: TJavaArray<Byte>; P8: Integer): TJavaArray<Integer>; cdecl;//Deprecated
    {class} function EnviaImagem(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: Integer; P7: JString; P8: JString): Integer; cdecl;//Deprecated
    {class} function ExcluiImagem(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: JString): Integer; cdecl;//Deprecated
    {class} function Feed(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function GerarBarCode1D(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: Integer): Integer; cdecl;//Deprecated
    {class} function GerarBox(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer): Integer; cdecl;//Deprecated
    {class} function GerarDataBar(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: JString): Integer; cdecl;//Deprecated
    {class} function GerarDataBarExpanded(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: JString): Integer; cdecl;//Deprecated
    {class} function GerarDataMatrix(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;//Deprecated
    {class} function GerarImagem(P1: Integer; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function GerarLinha(P1: Integer; P2: Integer; P3: Integer; P4: Integer): Integer; cdecl;//Deprecated
    {class} function GerarMaxiCode(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString): Integer; cdecl;//Deprecated
    {class} function GerarPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer; P9: Integer; P10: Integer; P11: JString): Integer; cdecl;//Deprecated
    {class} function GerarQRCodeAuto(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: JString): Integer; cdecl;//Deprecated
    {class} function GerarQRCodeManual(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer; P9: Integer; P10: Integer; P11: JString): Integer; cdecl;//Deprecated
    {class} function GerarTexto(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;//Deprecated
    {class} function GerarTextoASD(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;//Deprecated
    {class} function GerarTextoCourier(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;//Deprecated
    {class} function GetVersaoDLL: JString; cdecl;//Deprecated
    {class} function Imprime(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function Limpa(P1: Integer): Integer; cdecl;//Deprecated
    {class} function LimpaMemoria(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function LimpaModulo(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function MemoryStatus(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): JString; cdecl;//Deprecated
    {class} function Reset(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function SetAlturaGap(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function SetBackfeed(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetBaudrate(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer): Integer; cdecl;//Deprecated
    {class} function SetCalor(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetCortarZero(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetLength(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetLogicImgMode(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetMedidas(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetMirror(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetModoContinuo(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetOffsetColuna(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetOffsetLinha(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetPrintStPos(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetQtde(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetSensor(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetSymbolASD(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function SetTamPixel(P1: Integer; P2: Integer): Integer; cdecl;//Deprecated
    {class} function SetTipoTransferencia(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function SetVelImpressao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function Status(P1: Integer; P2: JString; P3: JString; P4: Integer): JString; cdecl;//Deprecated
    {class} function StatusEPL(P1: Integer; P2: JString; P3: JString; P4: Integer): JString; cdecl;//Deprecated
    {class} function Teste(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function init: JEtiqueta; cdecl;//Deprecated
    {class} function setContext(P1: JContext): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Etiqueta')]
  JEtiqueta = interface(JObject)
    ['{E1E2FB87-22FE-4128-8847-AE22A8CB4CF6}']
  end;
  TJEtiqueta = class(TJavaGenericImport<JEtiquetaClass, JEtiqueta>) end;

  JInterfaceAndroidClass = interface(IJavaClass)
    ['{F66430C7-EFE8-490B-BC25-C79884743CB5}']
    {class} function EnviaDadosNFCeImpressao(P1: JImplementacaoOBJXMLNFCE; P2: Integer; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function GetNumeroSerie: JString; cdecl;//Deprecated
    {class} function IImprimeXMLCancelamentoSAT(P1: JString; P2: JString; P3: Integer): Integer; cdecl;//Deprecated
    {class} function IImprimeXMLSAT(P1: JString; P2: Integer): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/InterfaceAndroid')]
  JInterfaceAndroid = interface(IJavaInstance)
    ['{7EBD3047-F065-4523-8A05-F3F355B8BD84}']
  end;
  TJInterfaceAndroid = class(TJavaGenericImport<JInterfaceAndroidClass, JInterfaceAndroid>) end;

  JImplementacaoAndroidClass = interface(JInterfaceAndroidClass)
    ['{BC9AEBFE-AA15-4AB1-A8A0-09B4E94E67D8}']
    {class} function _GetGAVETA_ABERTA: Integer; cdecl;
    {class} function _GetGAVETA_FECHADA: Integer; cdecl;
    {class} function _GetID_M8: Integer; cdecl;
    {class} function _GetPAPEL_AUSENTE: Integer; cdecl;
    {class} function _GetPAPEL_PRESENTE: Integer; cdecl;
    {class} function init: JImplementacaoAndroid; cdecl; overload;
    {class} function init(P1: Integer; P2: JConexao; P3: JImplementacaoTermica): JImplementacaoAndroid; cdecl; overload;
    {class} property GAVETA_ABERTA: Integer read _GetGAVETA_ABERTA;
    {class} property GAVETA_FECHADA: Integer read _GetGAVETA_FECHADA;
    {class} property ID_M8: Integer read _GetID_M8;
    {class} property PAPEL_AUSENTE: Integer read _GetPAPEL_AUSENTE;
    {class} property PAPEL_PRESENTE: Integer read _GetPAPEL_PRESENTE;
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/ImplementacaoAndroid')]
  JImplementacaoAndroid = interface(JInterfaceAndroid)
    ['{089A141A-63BC-4812-9238-242C0ED1FDBD}']
    function _Getcon: JConexao; cdecl;
    function EnviaDadosNFCeImpressao(P1: JImplementacaoOBJXMLNFCE; P2: Integer; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;
    function GetBarCodeBitmap(P1: Integer; P2: JString; P3: Integer; P4: Integer): JBitmap; cdecl;
    function GetCode128Bitmap(P1: JString; P2: Integer; P3: Integer): JBitmap; cdecl;
    function GetNumeroSerie: JString; cdecl;
    function GetPDF417Bitmap(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): JBitmap; cdecl;
    function GetQRCodeBitmap(P1: JString; P2: Integer; P3: Integer): JBitmap; cdecl;
    function IImprimeXMLCancelamentoSAT(P1: JString; P2: JString; P3: Integer): Integer; cdecl;
    function IImprimeXMLSAT(P1: JString; P2: Integer): Integer; cdecl;
    procedure setImpTexto(P1: JImplementacaoAndroid_IIImpressaoTexto); cdecl;
    property con: JConexao read _Getcon;
  end;
  TJImplementacaoAndroid = class(TJavaGenericImport<JImplementacaoAndroidClass, JImplementacaoAndroid>) end;

  JImplementacaoAndroid_IIImpressaoTextoClass = interface(IJavaClass)
    ['{E1BBDFE8-D981-4E40-97CA-F2A45C3E2B73}']
    {class} function IImpressaoTexto(P1: JString): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/ImplementacaoAndroid$IIImpressaoTexto')]
  JImplementacaoAndroid_IIImpressaoTexto = interface(IJavaInstance)
    ['{AA416AAA-643F-4E21-B566-F87AEE963A9C}']
  end;
  TJImplementacaoAndroid_IIImpressaoTexto = class(TJavaGenericImport<JImplementacaoAndroid_IIImpressaoTextoClass, JImplementacaoAndroid_IIImpressaoTexto>) end;

  JInterfaceBematechClass = interface(IJavaClass)
    ['{FDD885A7-0DB8-4F56-8933-64EE1D86B8AC}']
    {class} function FormatarMoeda(P1: JString): JString; cdecl;//Deprecated
    {class} function LinhaProduto(P1: Integer; P2: JImplementacaoOBJPRODUTOXMLNFCE): TJavaArray<Char>; cdecl;//Deprecated
    {class} function PreencheLegendaProduto(P1: Integer): TJavaArray<Char>; cdecl;//Deprecated
    {class} function imprimeCode128(P1: JString): Integer; cdecl;//Deprecated
    {class} function imprimeQRCodeBema(P1: JString; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/InterfaceBematech')]
  JInterfaceBematech = interface(IJavaInstance)
    ['{C33F0DB0-A397-4106-B831-40FF638C4BEF}']
  end;
  TJInterfaceBematech = class(TJavaGenericImport<JInterfaceBematechClass, JInterfaceBematech>) end;

  JImplementacaoBematechClass = interface(JInterfaceBematechClass)
    ['{849487CD-26EF-42C0-9A0B-FF9649575B93}']
    {class} function FormatarMoeda(P1: JString): JString; cdecl;//Deprecated
    {class} function LinhaProduto(P1: Integer; P2: JImplementacaoOBJPRODUTOXMLNFCE): TJavaArray<Char>; cdecl;//Deprecated
    {class} function PreencheLegendaProduto(P1: Integer): TJavaArray<Char>; cdecl;//Deprecated
    {class} function imprimeCode128(P1: JString): Integer; cdecl;//Deprecated
    {class} function imprimeQRCodeBema(P1: JString; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function init(P1: JConexao): JImplementacaoBematech; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/ImplementacaoBematech')]
  JImplementacaoBematech = interface(JInterfaceBematech)
    ['{7087873D-44DB-47B8-95B7-D6A837A915B3}']
  end;
  TJImplementacaoBematech = class(TJavaGenericImport<JImplementacaoBematechClass, JImplementacaoBematech>) end;

  JInterfaceEtiquetaClass = interface(IJavaClass)
    ['{5579CAAC-E578-4558-B2BE-0B90F04B6AF4}']
    {class} function DespejarArquivo(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: JString): Integer; cdecl;//Deprecated
    {class} function DirectIO(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: TJavaArray<Byte>; P6: Integer; P7: TJavaArray<Byte>; P8: Integer; P9: Boolean): TJavaArray<Integer>; cdecl;//Deprecated
    {class} function EnviaImagem(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: Integer; P7: JString; P8: JString): Integer; cdecl;//Deprecated
    {class} function ExcluiImagem(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: JString): Integer; cdecl;//Deprecated
    {class} function Feed(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function GerarBarCode1D(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: Integer): Integer; cdecl;//Deprecated
    {class} function GerarBox(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer): Integer; cdecl;//Deprecated
    {class} function GerarDataBar(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: JString): Integer; cdecl;//Deprecated
    {class} function GerarDataBarExpanded(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: JString): Integer; cdecl;//Deprecated
    {class} function GerarDataMatrix(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;//Deprecated
    {class} function GerarImagem(P1: Integer; P2: Integer; P3: JString): Integer; cdecl;//Deprecated
    {class} function GerarLinha(P1: Integer; P2: Integer; P3: Integer; P4: Integer): Integer; cdecl;//Deprecated
    {class} function GerarMaxiCode(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString): Integer; cdecl;//Deprecated
    {class} function GerarPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer; P9: Integer; P10: Integer; P11: JString): Integer; cdecl;//Deprecated
    {class} function GerarQRCodeAuto(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: JString): Integer; cdecl;//Deprecated
    {class} function GerarQRCodeManual(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer; P9: Integer; P10: Integer; P11: JString): Integer; cdecl;//Deprecated
    {class} function GerarTexto(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;//Deprecated
    {class} function GerarTextoASD(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;//Deprecated
    {class} function GerarTextoCourier(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;//Deprecated
    {class} function GetVersaoDLL: JString; cdecl;//Deprecated
    {class} function Imprime(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function Limpa(P1: Integer): Integer; cdecl;//Deprecated
    {class} function LimpaMemoria(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function LimpaModulo(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function MemoryStatus(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): JString; cdecl;//Deprecated
    {class} function Reset(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function SetAlturaGap(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function SetBackfeed(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetBaudrate(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer): Integer; cdecl;//Deprecated
    {class} function SetCalor(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetCortarZero(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetLength(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetLogicImgMode(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetMedidas(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetMirror(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetModoContinuo(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetOffsetColuna(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetOffsetLinha(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetPrintStPos(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetQtde(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetSensor(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SetSymbolASD(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function SetTamPixel(P1: Integer; P2: Integer): Integer; cdecl;//Deprecated
    {class} function SetTipoTransferencia(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function SetVelImpressao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function Status(P1: Integer; P2: JString; P3: JString; P4: Integer): JString; cdecl;//Deprecated
    {class} function StatusEPL(P1: Integer; P2: JString; P3: JString; P4: Integer): JString; cdecl;//Deprecated
    {class} function Teste(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/InterfaceEtiqueta')]
  JInterfaceEtiqueta = interface(IJavaInstance)
    ['{3B7EE708-9F31-4720-B34B-A76A2EA159A1}']
  end;
  TJInterfaceEtiqueta = class(TJavaGenericImport<JInterfaceEtiquetaClass, JInterfaceEtiqueta>) end;

  JImplementacaoEtiquetaClass = interface(JInterfaceEtiquetaClass)
    ['{AA9C17FC-B984-4493-801F-D9C89242D53B}']
    {class} function _GettContext: JContext; cdecl;
    {class} function init: JImplementacaoEtiqueta; cdecl;
    {class} property tContext: JContext read _GettContext;
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/ImplementacaoEtiqueta')]
  JImplementacaoEtiqueta = interface(JInterfaceEtiqueta)
    ['{72643586-2223-4C16-B1B7-51AFB1872976}']
    function DespejarArquivo(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: JString): Integer; cdecl;
    function DirectIO(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: TJavaArray<Byte>; P6: Integer; P7: TJavaArray<Byte>; P8: Integer; P9: Boolean): TJavaArray<Integer>; cdecl;
    function EnviaImagem(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: Integer; P7: JString; P8: JString): Integer; cdecl;
    function ExcluiImagem(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: JString): Integer; cdecl;
    function Feed(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;
    function GerarBarCode1D(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: Integer): Integer; cdecl;
    function GerarBox(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer): Integer; cdecl;
    function GerarDataBar(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: JString): Integer; cdecl;
    function GerarDataBarExpanded(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: JString): Integer; cdecl;
    function GerarDataMatrix(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;
    function GerarImagem(P1: Integer; P2: Integer; P3: JString): Integer; cdecl;
    function GerarLinha(P1: Integer; P2: Integer; P3: Integer; P4: Integer): Integer; cdecl;
    function GerarMaxiCode(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString): Integer; cdecl;
    function GerarPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer; P9: Integer; P10: Integer; P11: JString): Integer; cdecl;
    function GerarQRCodeAuto(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: JString): Integer; cdecl;
    function GerarQRCodeManual(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer; P9: Integer; P10: Integer; P11: JString): Integer; cdecl;
    function GerarTexto(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;
    function GerarTextoASD(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;
    function GerarTextoCourier(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;
    function GetVersaoDLL: JString; cdecl;
    function Imprime(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;
    function Limpa(P1: Integer): Integer; cdecl;
    function LimpaMemoria(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;
    function LimpaModulo(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;
    function MemoryStatus(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): JString; cdecl;
    function Reset(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;
    function SetAlturaGap(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;
    function SetBackfeed(P1: Integer): Integer; cdecl;
    function SetBaudrate(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer): Integer; cdecl;
    function SetCalor(P1: Integer): Integer; cdecl;
    function SetCortarZero(P1: Integer): Integer; cdecl;
    function SetLength(P1: Integer): Integer; cdecl;
    function SetLogicImgMode(P1: Integer): Integer; cdecl;
    function SetMedidas(P1: Integer): Integer; cdecl;
    function SetMirror(P1: Integer): Integer; cdecl;
    function SetModoContinuo(P1: Integer): Integer; cdecl;
    function SetOffsetColuna(P1: Integer): Integer; cdecl;
    function SetOffsetLinha(P1: Integer): Integer; cdecl;
    function SetPrintStPos(P1: Integer): Integer; cdecl;
    function SetQtde(P1: Integer): Integer; cdecl;
    function SetSensor(P1: Integer): Integer; cdecl;
    function SetSymbolASD(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;
    function SetTamPixel(P1: Integer; P2: Integer): Integer; cdecl;
    function SetTipoTransferencia(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): Integer; cdecl;
    function SetVelImpressao(P1: Integer): Integer; cdecl;
    function Status(P1: Integer; P2: JString; P3: JString; P4: Integer): JString; cdecl;
    function StatusEPL(P1: Integer; P2: JString; P3: JString; P4: Integer): JString; cdecl;
    function Teste(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;
    function getServiceResult: Integer; cdecl;
  end;
  TJImplementacaoEtiqueta = class(TJavaGenericImport<JImplementacaoEtiquetaClass, JImplementacaoEtiqueta>) end;

  JImplementacaoM8Class = interface(JImplementacaoAndroidClass)
    ['{A5080C33-1B74-41B1-B17F-2E019068FCBC}']
    {class} function IAbreGaveta(P1: Integer; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function IAbreGavetaElgin: Integer; cdecl;//Deprecated
    {class} function IDefinePosicao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function IDirectIO(P1: TJavaArray<Byte>; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoCodigoBarras(P1: Integer; P2: JString; P3: Integer; P4: Integer; P5: Integer; P6: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString; P8: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoQRCode(P1: JString; P2: Integer; P3: Integer; P4: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoTexto(P1: JString): Integer; cdecl;//Deprecated
    {class} function IImprimeBitmap(P1: JBitmap; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IImprimeImagemMemoria(P1: JString; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IStatusImpressora(P1: Integer): Integer; cdecl;//Deprecated
    {class} function init(P1: JConexao; P2: JImplementacaoTermica): JImplementacaoM8; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/ImplementacaoM8')]
  JImplementacaoM8 = interface(JImplementacaoAndroid)
    ['{B40E4FB3-A49A-48FB-980C-A491854271E9}']
  end;
  TJImplementacaoM8 = class(TJavaGenericImport<JImplementacaoM8Class, JImplementacaoM8>) end;

  JImplementacaoM8_1Class = interface(JImplementacaoAndroid_IIImpressaoTextoClass)
    ['{B8A6CEC9-E6F4-4DD4-ACEF-847FA8C39E84}']
    {class} function init(P1: JImplementacaoM8): JImplementacaoM8_1; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/ImplementacaoM8$1')]
  JImplementacaoM8_1 = interface(JImplementacaoAndroid_IIImpressaoTexto)
    ['{FB77F70E-02B1-4CE6-B339-072D609D2F3A}']
    function IImpressaoTexto(P1: JString): Integer; cdecl;
  end;
  TJImplementacaoM8_1 = class(TJavaGenericImport<JImplementacaoM8_1Class, JImplementacaoM8_1>) end;

  JImplementacaoSmartPOSClass = interface(JImplementacaoAndroidClass)
    ['{CFD7183E-E68E-4517-AA1D-07EFB67CC41A}']
    {class} function IDefinePosicao(P1: Integer): JString; cdecl;//Deprecated
    {class} function IDirectIO(P1: TJavaArray<Byte>; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoCodigoBarras(P1: Integer; P2: JString; P3: Integer; P4: Integer; P5: Integer; P6: JString): Integer; cdecl;//Deprecated
    {class} function IImpressaoPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString; P8: JString): Integer; cdecl;//Deprecated
    {class} function IImpressaoQRCode(P1: JString; P2: Integer; P3: Integer; P4: JString): Integer; cdecl;//Deprecated
    {class} function IImpressaoTexto(P1: JString): Integer; cdecl;//Deprecated
    {class} function IImprimeBitmap(P1: JBitmap; P2: JString): Integer; cdecl;//Deprecated
    {class} function IImprimeImagemMemoria(P1: JString; P2: JString): Integer; cdecl;//Deprecated
    {class} function IStatusImpressora(P1: Integer): Integer; cdecl;//Deprecated
    {class} function init(P1: JConexao; P2: JImplementacaoTermica): JImplementacaoSmartPOS; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/ImplementacaoSmartPOS')]
  JImplementacaoSmartPOS = interface(JImplementacaoAndroid)
    ['{D47E8878-D4F9-432B-B002-D1EAD4147DD4}']
  end;
  TJImplementacaoSmartPOS = class(TJavaGenericImport<JImplementacaoSmartPOSClass, JImplementacaoSmartPOS>) end;

  JImplementacaoSmartPOS_1Class = interface(JImplementacaoAndroid_IIImpressaoTextoClass)
    ['{4ED6135E-D1EF-4C18-BF76-9D7B5304BAB2}']
    {class} function init(P1: JImplementacaoSmartPOS): JImplementacaoSmartPOS_1; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/ImplementacaoSmartPOS$1')]
  JImplementacaoSmartPOS_1 = interface(JImplementacaoAndroid_IIImpressaoTexto)
    ['{40054D65-8D7D-4A38-ADA7-58E6FAA11123}']
    function IImpressaoTexto(P1: JString): Integer; cdecl;
  end;
  TJImplementacaoSmartPOS_1 = class(TJavaGenericImport<JImplementacaoSmartPOS_1Class, JImplementacaoSmartPOS_1>) end;

  JInterfaceTermicaClass = interface(IJavaClass)
    ['{6B72197C-F747-44FA-B36B-D9888540F1FA}']
    {class} function IAbreConexaoImpressora(P1: JContext; P2: Integer; P3: JString; P4: JString; P5: Integer): Integer; cdecl;//Deprecated
    {class} function IAbreGaveta(P1: Integer; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function IAbreGavetaElgin: Integer; cdecl;//Deprecated
    {class} function IAvancaPapel(P1: Integer): Integer; cdecl;//Deprecated
    {class} function ICorte(P1: Integer): Integer; cdecl;//Deprecated
    {class} function IDefineAreaImpressao(P1: Integer; P2: Integer; P3: Integer; P4: Integer): Integer; cdecl;//Deprecated
    {class} function IDefinePosicao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function IDirecaoImpressao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function IDirectIO(P1: TJavaArray<Byte>; P2: Integer; P3: TJavaArray<Byte>; P4: JInteiro): Integer; cdecl;//Deprecated
    {class} function IFechaConexaoImpressora: Integer; cdecl;//Deprecated
    {class} function IGetVersaoDLL: JString; cdecl;//Deprecated
    {class} function IImpressaoCodigoBarras(P1: Integer; P2: JString; P3: Integer; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;//Deprecated
    {class} function IImpressaoQRCode(P1: JString; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoTexto(P1: JString; P2: Integer; P3: Integer; P4: Integer): Integer; cdecl;//Deprecated
    {class} function IImprimeBitmap(P1: JBitmap): Integer; cdecl;//Deprecated
    {class} function IImprimeCupomTEF(P1: JString): Integer; cdecl;//Deprecated
    {class} function IImprimeImagemMemoria(P1: JString; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IImprimeMPeRetornaPadrao: Integer; cdecl;//Deprecated
    {class} function IImprimeModoPagina: Integer; cdecl;//Deprecated
    {class} function IImprimeXMLCancelamentoSAT(P1: JString; P2: JString; P3: Integer): Integer; cdecl;//Deprecated
    {class} function IImprimeXMLNFCe(P1: JString; P2: Integer; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function IImprimeXMLSAT(P1: JString; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IInicializaImpressora: Integer; cdecl;//Deprecated
    {class} function ILimpaBufferModoPagina: Integer; cdecl;//Deprecated
    {class} function IModoPadrao: Integer; cdecl;//Deprecated
    {class} function IModoPagina: Integer; cdecl;//Deprecated
    {class} function IPosicaoImpressaoHorizontal(P1: Integer): Integer; cdecl;//Deprecated
    {class} function IPosicaoImpressaoVertical(P1: Integer): Integer; cdecl;//Deprecated
    {class} function ISinalSonoro(P1: Integer; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function IStatusImpressora(P1: Integer): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/InterfaceTermica')]
  JInterfaceTermica = interface(IJavaInstance)
    ['{425B7E01-3741-46A4-B12D-1672B4EB8E02}']
  end;
  TJInterfaceTermica = class(TJavaGenericImport<JInterfaceTermicaClass, JInterfaceTermica>) end;

  JImplementacaoTermicaClass = interface(JInterfaceTermicaClass)
    ['{60DCB1CA-0D68-4F4E-AE5D-E6F3238D848E}']
    {class} function IAbreConexaoImpressora(P1: JContext; P2: Integer; P3: JString; P4: JString; P5: Integer): Integer; cdecl;//Deprecated
    {class} function IAbreGaveta(P1: Integer; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function IAbreGavetaElgin: Integer; cdecl;//Deprecated
    {class} function IAvancaPapel(P1: Integer): Integer; cdecl;//Deprecated
    {class} function ICorte(P1: Integer): Integer; cdecl;//Deprecated
    {class} function IDefineAreaImpressao(P1: Integer; P2: Integer; P3: Integer; P4: Integer): Integer; cdecl;//Deprecated
    {class} function IDefinePosicao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function IDirecaoImpressao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function IDirectIO(P1: TJavaArray<Byte>; P2: Integer; P3: TJavaArray<Byte>; P4: JInteiro): Integer; cdecl;//Deprecated
    {class} function IFechaConexaoImpressora: Integer; cdecl;//Deprecated
    {class} function IGetVersaoDLL: JString; cdecl;//Deprecated
    {class} function IImpressaoCodigoBarras(P1: Integer; P2: JString; P3: Integer; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;//Deprecated
    {class} function IImpressaoQRCode(P1: JString; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoTexto(P1: JString; P2: Integer; P3: Integer; P4: Integer): Integer; cdecl;//Deprecated
    {class} function IImprimeBitmap(P1: JBitmap): Integer; cdecl;//Deprecated
    {class} function IImprimeCupomTEF(P1: JString): Integer; cdecl;//Deprecated
    {class} function IImprimeImagemMemoria(P1: JString; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IImprimeMPeRetornaPadrao: Integer; cdecl;//Deprecated
    {class} function IImprimeModoPagina: Integer; cdecl;//Deprecated
    {class} function IImprimeXMLCancelamentoSAT(P1: JString; P2: JString; P3: Integer): Integer; cdecl;//Deprecated
    {class} function IImprimeXMLNFCe(P1: JString; P2: Integer; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function IImprimeXMLSAT(P1: JString; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IInicializaImpressora: Integer; cdecl;//Deprecated
    {class} function ILimpaBufferModoPagina: Integer; cdecl;//Deprecated
    {class} function IModoPadrao: Integer; cdecl;//Deprecated
    {class} function IModoPagina: Integer; cdecl;//Deprecated
    {class} function IPosicaoImpressaoHorizontal(P1: Integer): Integer; cdecl;//Deprecated
    {class} function IPosicaoImpressaoVertical(P1: Integer): Integer; cdecl;//Deprecated
    {class} function ISinalSonoro(P1: Integer; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function IStatusImpressora(P1: Integer): Integer; cdecl;//Deprecated
    {class} function getServiceResult: Integer; cdecl;//Deprecated
    {class} function init: JImplementacaoTermica; cdecl;//Deprecated
    {class} function printText(P1: JString): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/ImplementacaoTermica')]
  JImplementacaoTermica = interface(JInterfaceTermica)
    ['{EBC7D234-2A67-44FF-90DB-1246EF8D2393}']
  end;
  TJImplementacaoTermica = class(TJavaGenericImport<JImplementacaoTermicaClass, JImplementacaoTermica>) end;

  JInterfaceM8Class = interface(IJavaClass)
    ['{3CAB3F8F-5BFB-43B5-BF9A-BD55FCCECC72}']
    {class} function IAbreGaveta(P1: Integer; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function IAbreGavetaElgin: Integer; cdecl;//Deprecated
    {class} function IDefinePosicao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function IDirectIO(P1: TJavaArray<Byte>; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoCodigoBarras(P1: Integer; P2: JString; P3: Integer; P4: Integer; P5: Integer; P6: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString; P8: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoQRCode(P1: JString; P2: Integer; P3: Integer; P4: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoTexto(P1: JString): Integer; cdecl;//Deprecated
    {class} function IImprimeBitmap(P1: JBitmap; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IImprimeImagemMemoria(P1: JString; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IStatusImpressora(P1: Integer): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/InterfaceM8')]
  JInterfaceM8 = interface(IJavaInstance)
    ['{5ACF98AA-4E1C-4983-BED9-529C671E71AF}']
  end;
  TJInterfaceM8 = class(TJavaGenericImport<JInterfaceM8Class, JInterfaceM8>) end;

  JInterfaceSmartPOSClass = interface(IJavaClass)
    ['{4A4F6408-34C9-40CB-8BA5-4B9CB37ED484}']
    {class} function IDefinePosicao(P1: Integer): JString; cdecl;//Deprecated
    {class} function IDirectIO(P1: TJavaArray<Byte>; P2: Integer): Integer; cdecl;//Deprecated
    {class} function IImpressaoCodigoBarras(P1: Integer; P2: JString; P3: Integer; P4: Integer; P5: Integer; P6: JString): Integer; cdecl;//Deprecated
    {class} function IImpressaoPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString; P8: JString): Integer; cdecl;//Deprecated
    {class} function IImpressaoQRCode(P1: JString; P2: Integer; P3: Integer; P4: JString): Integer; cdecl;//Deprecated
    {class} function IImpressaoTexto(P1: JString): Integer; cdecl;//Deprecated
    {class} function IImprimeBitmap(P1: JBitmap; P2: JString): Integer; cdecl;//Deprecated
    {class} function IImprimeImagemMemoria(P1: JString; P2: JString): Integer; cdecl;//Deprecated
    {class} function IStatusImpressora(P1: Integer): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Impressoras/InterfaceSmartPOS')]
  JInterfaceSmartPOS = interface(IJavaInstance)
    ['{1CB27010-F9BC-4107-8322-14480AABFD07}']
  end;
  TJInterfaceSmartPOS = class(TJavaGenericImport<JInterfaceSmartPOSClass, JInterfaceSmartPOS>) end;

  JMiniPDVM8Class = interface(JObjectClass)
    ['{5FF09D78-EA42-4736-AC41-F5B6375CACC9}']
    {class} function GetNumeroSerie: JString; cdecl;//Deprecated
    {class} function init: JMiniPDVM8; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/MiniPDVM8')]
  JMiniPDVM8 = interface(JObject)
    ['{47660AB1-286B-48B4-A73C-3999E7F22716}']
  end;
  TJMiniPDVM8 = class(TJavaGenericImport<JMiniPDVM8Class, JMiniPDVM8>) end;

  JSmartClass = interface(JObjectClass)
    ['{596B85E7-3C4F-493B-9851-947EC7B10D2B}']
    {class} function GetNumeroSerie: JString; cdecl;//Deprecated
    {class} function init: JSmart; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Smart')]
  JSmart = interface(JObject)
    ['{D915AAF5-76C6-48DB-97C9-1E233756228D}']
  end;
  TJSmart = class(TJavaGenericImport<JSmartClass, JSmart>) end;

  JTermicaClass = interface(JObjectClass)
    ['{7BAEBC62-9D0E-41F1-987B-8F02672285FA}']
    {class} function AbreConexaoImpressora(P1: Integer; P2: JString; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function AbreGaveta(P1: Integer; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function AbreGavetaElgin: Integer; cdecl;//Deprecated
    {class} function AvancaPapel(P1: Integer): Integer; cdecl;//Deprecated
    {class} function Corte(P1: Integer): Integer; cdecl;//Deprecated
    {class} function DefineAreaImpressao(P1: Integer; P2: Integer; P3: Integer; P4: Integer): Integer; cdecl;//Deprecated
    {class} function DefinePosicao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function DirecaoImpressao(P1: Integer): Integer; cdecl;//Deprecated
    {class} function DirectIO(P1: TJavaArray<Byte>; P2: Integer; P3: TJavaArray<Byte>; P4: JInteiro): Integer; cdecl;//Deprecated
    {class} function FechaConexaoImpressora: Integer; cdecl;//Deprecated
    {class} function GetVersaoDLL: JString; cdecl;//Deprecated
    {class} function ImpressaoCodigoBarras(P1: Integer; P2: JString; P3: Integer; P4: Integer; P5: Integer): Integer; cdecl;//Deprecated
    {class} function ImpressaoPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): Integer; cdecl;//Deprecated
    {class} function ImpressaoQRCode(P1: JString; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function ImpressaoTexto(P1: JString; P2: Integer; P3: Integer; P4: Integer): Integer; cdecl;//Deprecated
    {class} function ImprimeBitmap(P1: JBitmap): Integer; cdecl;//Deprecated
    {class} function ImprimeCupomTEF(P1: JString): Integer; cdecl;//Deprecated
    {class} function ImprimeImagemMemoria(P1: JString; P2: Integer): Integer; cdecl;//Deprecated
    {class} function ImprimeMPeRetornaPadrao: Integer; cdecl;//Deprecated
    {class} function ImprimeModoPagina: Integer; cdecl;//Deprecated
    {class} function ImprimeXMLCancelamentoSAT(P1: JString; P2: JString; P3: Integer): Integer; cdecl;//Deprecated
    {class} function ImprimeXMLNFCe(P1: JString; P2: Integer; P3: JString; P4: Integer): Integer; cdecl;//Deprecated
    {class} function ImprimeXMLSAT(P1: JString; P2: Integer): Integer; cdecl;//Deprecated
    {class} function InicializaImpressora: Integer; cdecl;//Deprecated
    {class} function LimpaBufferModoPagina: Integer; cdecl;//Deprecated
    {class} function ModoPadrao: Integer; cdecl;//Deprecated
    {class} function ModoPagina: Integer; cdecl;//Deprecated
    {class} function PosicaoImpressaoHorizontal(P1: Integer): Integer; cdecl;//Deprecated
    {class} function PosicaoImpressaoVertical(P1: Integer): Integer; cdecl;//Deprecated
    {class} function SinalSonoro(P1: Integer; P2: Integer; P3: Integer): Integer; cdecl;//Deprecated
    {class} function StatusImpressora(P1: Integer): Integer; cdecl;//Deprecated
    {class} function init: JTermica; cdecl;//Deprecated
    {class} function setContext(P1: JContext): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Termica')]
  JTermica = interface(JObject)
    ['{E4B09845-DF9A-4309-B170-7DC4019F3F3F}']
  end;
  TJTermica = class(TJavaGenericImport<JTermicaClass, JTermica>) end;

  JCodigoErroClass = interface(JObjectClass)
    ['{68E2CD11-26F7-4A29-AF92-2CB821F192F3}']
    {class} function _GetALIQUOTA_IMPOSTO_INVALIDA: Integer; cdecl;
    {class} function _GetALIQUOTA_ISSQN_INVALIDA: Integer; cdecl;
    {class} function _GetARQUIVO_NAO_ENCONTRADO: Integer; cdecl;
    {class} function _GetARQUIVO_NAO_EXISTE: Integer; cdecl;
    {class} function _GetARQUIVO_NAO_PODE_SER_ABERTO: Integer; cdecl;
    {class} function _GetASSINATURA_QRCODE_INVALIDA: Integer; cdecl;
    {class} function _GetBAIRRO_INVALIDO: Integer; cdecl;
    {class} function _GetBAL_BALANCA_EM_USO: Integer; cdecl;
    {class} function _GetBAL_BALANCA_INVALIDA: Integer; cdecl;
    {class} function _GetBAL_BAUDRATE_INVALIDO: Integer; cdecl;
    {class} function _GetBAL_BAUDRATE_NAO_SUPORTADO: Integer; cdecl;
    {class} function _GetBAL_COMANDO_NAO_SUPORTADO_PELA_BALANCA: Integer; cdecl;
    {class} function _GetBAL_COMANDO_NAO_SUPORTADO_PELO_PROTOCOLO: Integer; cdecl;
    {class} function _GetBAL_COMBINACAO_DE_PARAMETROS_INVALIDA: Integer; cdecl;
    {class} function _GetBAL_CONEXAO_ATIVA: Integer; cdecl;
    {class} function _GetBAL_CONFIGS_SERIAIS_NAO_SUPORTADAS_PELO_PROTOCOLO: Integer; cdecl;
    {class} function _GetBAL_FALHA_AO_ENVIAR_PRECO: Integer; cdecl;
    {class} function _GetBAL_FALHA_NA_LEITURA_DO_PESO: Integer; cdecl;
    {class} function _GetBAL_LENGTH_INVALIDO: Integer; cdecl;
    {class} function _GetBAL_LENGTH_NAO_SUPORTADO: Integer; cdecl;
    {class} function _GetBAL_NENHUMA_BALANCA_EM_USO: Integer; cdecl;
    {class} function _GetBAL_NENHUM_PROTOCOLO_EM_USO: Integer; cdecl;
    {class} function _GetBAL_PARITY_INVALIDO: Integer; cdecl;
    {class} function _GetBAL_PARITY_NAO_SUPORTADO: Integer; cdecl;
    {class} function _GetBAL_PRECO_INVALIDO: Integer; cdecl;
    {class} function _GetBAL_PROTOCOLO_EM_USO: Integer; cdecl;
    {class} function _GetBAL_PROTOCOLO_INVALIDO: Integer; cdecl;
    {class} function _GetBAL_PROTOCOLO_NAO_SUPORTADO: Integer; cdecl;
    {class} function _GetBAL_PROTOCOLO_NAO_SUPORTADO_PELAS_CONFIGS_SERIAIS: Integer; cdecl;
    {class} function _GetBAL_QTD_LEITURAS_INVALIDA: Integer; cdecl;
    {class} function _GetBAL_STOPBITS_INVALIDO: Integer; cdecl;
    {class} function _GetBAL_STOPBITS_NAO_SUPORTADO: Integer; cdecl;
    {class} function _GetBARCODE1D_ALTURA_INVALIDA: Integer; cdecl;
    {class} function _GetBARCODE1D_CARACTERE_INVALIDO: Integer; cdecl;
    {class} function _GetBARCODE1D_CODIGO_INVALIDO: Integer; cdecl;
    {class} function _GetBARCODE1D_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetBARCODE1D_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetBARCODE1D_LARGURA_BARRAS_ESTREITAS_INVALIDA: Integer; cdecl;
    {class} function _GetBARCODE1D_LARGURA_BARRAS_LARGAS_INVALIDA: Integer; cdecl;
    {class} function _GetBARCODE1D_ROTACAO_INVALIDA: Integer; cdecl;
    {class} function _GetBARCODE1D_TAMANHO_INVALIDO: Integer; cdecl;
    {class} function _GetBARCODE1D_TIPO_INVALIDO: Integer; cdecl;
    {class} function _GetBASE_CALCULO_INVALIDA: Integer; cdecl;
    {class} function _GetBAUDRATE_INVALIDO: Integer; cdecl;
    {class} function _GetBLUETOOTH_DESATIVADO: Integer; cdecl;
    {class} function _GetBOX_ALTURA_INVALIDA: Integer; cdecl;
    {class} function _GetBOX_COMPRIMENTO_INVALIDO: Integer; cdecl;
    {class} function _GetBOX_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetBOX_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetBOX_GROSSURA_BORDAS_HORIZONTAIS_INVALIDA: Integer; cdecl;
    {class} function _GetBOX_GROSSURA_BORDAS_VERTICAIS_INVALIDA: Integer; cdecl;
    {class} function _GetCB_ALTURA_INVALIDA: Integer; cdecl;
    {class} function _GetCB_AREA_DE_IMPRESSAO_EXCEDIDA: Integer; cdecl;
    {class} function _GetCB_DADOS_INVALIDOS: Integer; cdecl;
    {class} function _GetCB_HRI_INVALIDO: Integer; cdecl;
    {class} function _GetCB_LARGURA_INVALIDA: Integer; cdecl;
    {class} function _GetCB_TIPO_INVALIDO: Integer; cdecl;
    {class} function _GetCEST_INVALIDO: Integer; cdecl;
    {class} function _GetCFOP_INVALIDO: Integer; cdecl;
    {class} function _GetCHAMADA_NAO_PERMITIDA: Integer; cdecl;
    {class} function _GetCHAVE_CANCELAMENTO_INVALIDA: Integer; cdecl;
    {class} function _GetCNPJ_INVALIDO: Integer; cdecl;
    {class} function _GetCODIGO_MEIO_PAGAMENTO_INVALIDO: Integer; cdecl;
    {class} function _GetCODIGO_MUNICIPIO_FATO_GERADOR_INVALIDO: Integer; cdecl;
    {class} function _GetCODIGO_PRODUTO_INVALIDO: Integer; cdecl;
    {class} function _GetCODIGO_TRIBUTACAO_ISSQN_INVALIDO: Integer; cdecl;
    {class} function _GetCOMANDO_INVALIDO: Integer; cdecl;
    {class} function _GetCOMPLEMENTO_INVALIDO: Integer; cdecl;
    {class} function _GetCONEXAO_ATIVA: Integer; cdecl;
    {class} function _GetCONEXAO_ATIVA_OUTRO: Integer; cdecl;
    {class} function _GetCONEXAO_NEGADA: Integer; cdecl;
    {class} function _GetCONTEUDO_CAMPO_INVALIDO: Integer; cdecl;
    {class} function _GetCPF_INVALIDO: Integer; cdecl;
    {class} function _GetCREDENCIADORA_CARTAO_INVALIDO: Integer; cdecl;
    {class} function _GetCREGTRIBISSQN_INVALIDO: Integer; cdecl;
    {class} function _GetCSOSN_INVALIDO: Integer; cdecl;
    {class} function _GetCST_INVALIDO: Integer; cdecl;
    {class} function _GetDADOS_PDF_INVALIDOS: Integer; cdecl;
    {class} function _GetDADOS_QR_INVALIDOS: Integer; cdecl;
    {class} function _GetDATABAREXPANDED_ALPHANUMERIC_CARACTERE_INVALIDO: Integer; cdecl;
    {class} function _GetDATABAREXPANDED_ALPHANUMERIC_TAMANHO_INVALIDO: Integer; cdecl;
    {class} function _GetDATABAREXPANDED_ALTURA_INVALIDA: Integer; cdecl;
    {class} function _GetDATABAREXPANDED_BAR_RATIO_INVALIDO: Integer; cdecl;
    {class} function _GetDATABAREXPANDED_CODIGO_INVALIDO: Integer; cdecl;
    {class} function _GetDATABAREXPANDED_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetDATABAREXPANDED_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetDATABAREXPANDED_PIXEL_MULTIPLIER_INVALIDO: Integer; cdecl;
    {class} function _GetDATABAREXPANDED_ROTACAO_INVALIDA: Integer; cdecl;
    {class} function _GetDATABAREXPANDED_SEGMENTS_PER_ROW_INVALIDO: Integer; cdecl;
    {class} function _GetDATABAR_ALTURA_INVALIDA: Integer; cdecl;
    {class} function _GetDATABAR_BAR_RATIO_INVALIDO: Integer; cdecl;
    {class} function _GetDATABAR_CODIGO_INVALIDO: Integer; cdecl;
    {class} function _GetDATABAR_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetDATABAR_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetDATABAR_NUMERIC_LINEAR_DATA_CARACTERE_INVALIDO: Integer; cdecl;
    {class} function _GetDATABAR_NUMERIC_LINEAR_DATA_TAMANHO_INVALIDO: Integer; cdecl;
    {class} function _GetDATABAR_PIXEL_MULTIPLIER_INVALIDO: Integer; cdecl;
    {class} function _GetDATABAR_ROTACAO_INVALIDA: Integer; cdecl;
    {class} function _GetDATABAR_TIPO_INVALIDO: Integer; cdecl;
    {class} function _GetDATAMATRIX_CODIGO_INVALIDO: Integer; cdecl;
    {class} function _GetDATAMATRIX_COLUMNS_INVALIDAS: Integer; cdecl;
    {class} function _GetDATAMATRIX_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetDATAMATRIX_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetDATAMATRIX_MULTIPLICADOR_INVALIDO: Integer; cdecl;
    {class} function _GetDATAMATRIX_ROTACAO_INVALIDA: Integer; cdecl;
    {class} function _GetDATAMATRIX_ROWS_INVALIDAS: Integer; cdecl;
    {class} function _GetDESCRICAO_PRODUTO_INVALIDA: Integer; cdecl;
    {class} function _GetDIRECAO_INVALIDA: Integer; cdecl;
    {class} function _GetDISPOSITIVO_NAO_ENCONTRADO: Integer; cdecl;
    {class} function _GetDISPOSITIVO_NAO_EXISTE: Integer; cdecl;
    {class} function _GetDISPOSITIVO_NAO_PAREADO: Integer; cdecl;
    {class} function _GetDISPOSITIVO_NAO_SUPORTA_BT: Integer; cdecl;
    {class} function _GetERROR_CORRECTION_LEVEL_INVALIDO: Integer; cdecl;
    {class} function _GetERRO_ABERTURA_NAO_AUTORIZADA: Integer; cdecl;
    {class} function _GetERRO_ABERTURA_PORTA: Integer; cdecl;
    {class} function _GetERRO_ALTURA_GAP: Integer; cdecl;
    {class} function _GetERRO_AO_CARREGAR_BIBLIOTECA_DA_ETIQUETA: Integer; cdecl;
    {class} function _GetERRO_AO_CARREGAR_BIBLIOTECA_DA_IMPRESSORA: Integer; cdecl;
    {class} function _GetERRO_AO_CARREGAR_BIBLIOTECA_DO_E1SAT: Integer; cdecl;
    {class} function _GetERRO_AO_CARREGAR_BIBLIOTECA_DO_SAT: Integer; cdecl;
    {class} function _GetERRO_BACKFEED: Integer; cdecl;
    {class} function _GetERRO_BAUDRATE_BAUDRATE: Integer; cdecl;
    {class} function _GetERRO_BAUDRATE_DATA_LENGTH: Integer; cdecl;
    {class} function _GetERRO_BAUDRATE_PARITY: Integer; cdecl;
    {class} function _GetERRO_BAUDRATE_STOP_BIT: Integer; cdecl;
    {class} function _GetERRO_CALOR: Integer; cdecl;
    {class} function _GetERRO_CAMPOS_OVERFLOW: Integer; cdecl;
    {class} function _GetERRO_CLAIM_UL: Integer; cdecl;
    {class} function _GetERRO_CONEXAO_BLUETOOTH: Integer; cdecl;
    {class} function _GetERRO_CORTAR_ZERO: Integer; cdecl;
    {class} function _GetERRO_DESCONHECIDO: Integer; cdecl;
    {class} function _GetERRO_DE_ABERTURA_PORTA_USB: Integer; cdecl;
    {class} function _GetERRO_ENVIA_IMAGEM_ARQUIVO: Integer; cdecl;
    {class} function _GetERRO_ENVIA_IMAGEM_FORMATO: Integer; cdecl;
    {class} function _GetERRO_ENVIA_IMAGEM_MODULO: Integer; cdecl;
    {class} function _GetERRO_ENVIA_IMAGEM_NOME_CARACTERE: Integer; cdecl;
    {class} function _GetERRO_ENVIA_IMAGEM_NOME_TAMANHO: Integer; cdecl;
    {class} function _GetERRO_ESCRITA: Integer; cdecl;
    {class} function _GetERRO_ESCRITA_PORTA: Integer; cdecl;
    {class} function _GetERRO_EXCLUI_IMAGEM_MODULO: Integer; cdecl;
    {class} function _GetERRO_EXCLUI_IMAGEM_NOME_CARACTERE: Integer; cdecl;
    {class} function _GetERRO_EXCLUI_IMAGEM_NOME_TAMANHO: Integer; cdecl;
    {class} function _GetERRO_FECHAMENTO_NAO_AUTORIZADO: Integer; cdecl;
    {class} function _GetERRO_FECHAMENTO_PORTA: Integer; cdecl;
    {class} function _GetERRO_FUNCAO_NAO_CHAMADA_PELO_SERVICO: Integer; cdecl;
    {class} function _GetERRO_FUNCAO_NAO_DISPONIVEL_VIA_SERVICO: Integer; cdecl;
    {class} function _GetERRO_FUNCAO_NAO_SUPORTADA: Integer; cdecl;
    {class} function _GetERRO_LEITURA_PORTA: Integer; cdecl;
    {class} function _GetERRO_LENGTH: Integer; cdecl;
    {class} function _GetERRO_LIMPAR: Integer; cdecl;
    {class} function _GetERRO_LIMPA_MODULO_MODULO: Integer; cdecl;
    {class} function _GetERRO_LOGIC_IMG_MODE: Integer; cdecl;
    {class} function _GetERRO_MEDIDA: Integer; cdecl;
    {class} function _GetERRO_MEMORY_STATUS_TIPO_DADOS: Integer; cdecl;
    {class} function _GetERRO_MIRROR: Integer; cdecl;
    {class} function _GetERRO_MODO_CONTINUO: Integer; cdecl;
    {class} function _GetERRO_NENHUM_BYTE_ENVIADO: Integer; cdecl;
    {class} function _GetERRO_NOT_ACTIVITY: Integer; cdecl;
    {class} function _GetERRO_OFFSET_COLUNA: Integer; cdecl;
    {class} function _GetERRO_OFFSET_LINHA: Integer; cdecl;
    {class} function _GetERRO_PDF_DESCONHECIDO: Integer; cdecl;
    {class} function _GetERRO_PRINT_ST_POS: Integer; cdecl;
    {class} function _GetERRO_QTDE: Integer; cdecl;
    {class} function _GetERRO_SENSOR: Integer; cdecl;
    {class} function _GetERRO_SERIAL_DESCONHECIDO: Integer; cdecl;
    {class} function _GetERRO_SERVICO_NAO_INICIADO: Integer; cdecl;
    {class} function _GetERRO_SYMBOL: Integer; cdecl;
    {class} function _GetERRO_TAM_PIXEL: Integer; cdecl;
    {class} function _GetERRO_TIPO_TRANSFERENCIA: Integer; cdecl;
    {class} function _GetERRO_VEL_IMPRESSAO: Integer; cdecl;
    {class} function _GetERRO_XSD: Integer; cdecl;
    {class} function _GetESTE_JSON_NAO_E_UM_OBJETO: Integer; cdecl;
    {class} function _GetGRUPO_INVALIDO: Integer; cdecl;
    {class} function _GetGTIN_INVALIDO: Integer; cdecl;
    {class} function _GetHEIGHT_INVALIDO: Integer; cdecl;
    {class} function _GetIDENTIFICADOR_CAMPO_INVALIDO: Integer; cdecl;
    {class} function _GetIE_INVALIDO: Integer; cdecl;
    {class} function _GetIMAGEM_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetIMAGEM_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetIMAGEM_NOME_CARACTERE_INVALIDO: Integer; cdecl;
    {class} function _GetIMAGEM_NOME_TAMANHO_INVALIDO: Integer; cdecl;
    {class} function _GetIM_INVALIDO: Integer; cdecl;
    {class} function _GetINDICADOR_INCETIVO_FISCAL_ISSQN_INVALIDO: Integer; cdecl;
    {class} function _GetINDRATISSQN_INVALIDO: Integer; cdecl;
    {class} function _GetINFORMACOES_ADICIONAIS_PRODUTO_INVALIDA: Integer; cdecl;
    {class} function _GetITEM_LISTA_SERVICO_INVALIDO: Integer; cdecl;
    {class} function _GetKEY_INVALIDO: Integer; cdecl;
    {class} function _GetLINHA_ALTURA_INVALIDA: Integer; cdecl;
    {class} function _GetLINHA_COMPRIMENTO_INVALIDO: Integer; cdecl;
    {class} function _GetLINHA_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetLINHA_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetLOGRADOURO_INVALIDO: Integer; cdecl;
    {class} function _GetMAC_ADDRESS_INVALIDO: Integer; cdecl;
    {class} function _GetMAXICODE_CLASS_OF_SERVICE_INVALIDA: Integer; cdecl;
    {class} function _GetMAXICODE_CODIGO_INVALIDO: Integer; cdecl;
    {class} function _GetMAXICODE_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetMAXICODE_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetMAXICODE_COUNTRY_INVALIDO: Integer; cdecl;
    {class} function _GetMAXICODE_PRIMARY_ZIP_INVALIDO: Integer; cdecl;
    {class} function _GetMAXICODE_ROTACAO_INVALIDA: Integer; cdecl;
    {class} function _GetMAXICODE_SECONDARY_ZIP_INVALIDO: Integer; cdecl;
    {class} function _GetMODELO_INVALIDO: Integer; cdecl;
    {class} function _GetMODULO_FUNCAO_NAO_ENCONTRADO: Integer; cdecl;
    {class} function _GetMUNICIPIO_INVALIDO: Integer; cdecl;
    {class} function _GetNAO_FOI_POSSIVEL_INICIAR_O_SERVICO: Integer; cdecl;
    {class} function _GetNATUREZA_OPERACAO_INVALIDA: Integer; cdecl;
    {class} function _GetNCM_INVALIDO: Integer; cdecl;
    {class} function _GetNENHUM_DADO_RETORNADO: Integer; cdecl;
    {class} function _GetNIVEL_DE_CORRECAO_INVALIDO: Integer; cdecl;
    {class} function _GetNOME_DESTINARIO_INVALIDO: Integer; cdecl;
    {class} function _GetNUMBER_COLUMNS_INVALIDO: Integer; cdecl;
    {class} function _GetNUMBER_ROWS_INVALIDO: Integer; cdecl;
    {class} function _GetNUMERO_CAIXA_INVALIDO: Integer; cdecl;
    {class} function _GetNUMERO_INVALIDO: Integer; cdecl;
    {class} function _GetNUMERO_ITEM_INVALIDO: Integer; cdecl;
    {class} function _GetOPERACAO_INVALIDA: Integer; cdecl;
    {class} function _GetOPTIONS_INVALIDO: Integer; cdecl;
    {class} function _GetORIGEM_MERCADORIA_INVALIDA: Integer; cdecl;
    {class} function _GetPARAMETRO_CONF_INVALIDO: Integer; cdecl;
    {class} function _GetPARAMETRO_NAO_ENCONTRADO: Integer; cdecl;
    {class} function _GetPARAMETRO_TIPO_STATUS_INVALIDO: Integer; cdecl;
    {class} function _GetPDF417_CODIGO_INVALIDO: Integer; cdecl;
    {class} function _GetPDF417_COLUMN_NUMBER_INVALIDO: Integer; cdecl;
    {class} function _GetPDF417_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetPDF417_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetPDF417_MULTIPLICADOR_HORIZONTAL_INVALIDO: Integer; cdecl;
    {class} function _GetPDF417_MULTIPLICADOR_VERTICAL_INVALIDO: Integer; cdecl;
    {class} function _GetPDF417_ROTACAO_INVALIDA: Integer; cdecl;
    {class} function _GetPDF417_ROW_NUMBER_INVALIDO: Integer; cdecl;
    {class} function _GetPDF417_SECURITY_LEVEL_INVALIDO: Integer; cdecl;
    {class} function _GetPDF417_TIPO_INVALIDO: Integer; cdecl;
    {class} function _GetPDF_417_ASPECT_RATIO_INVALIDO: Integer; cdecl;
    {class} function _GetPERCENTUAL_ALIQUOTA_COFINS_INVALIDA: Integer; cdecl;
    {class} function _GetPERCENTUAL_ALIQUOTA_PIS_INVALIDA: Integer; cdecl;
    {class} function _GetPERMISSAO_NEGADA: Integer; cdecl;
    {class} function _GetPINO_INVALIDO: Integer; cdecl;
    {class} function _GetPORTA_FECHADA: Integer; cdecl;
    {class} function _GetPORTA_TCP_INVALIDA: Integer; cdecl;
    {class} function _GetPOSICAO_INVALIDA: Integer; cdecl;
    {class} function _GetPOS_IMP_HORIZONTAL_INVALIDA: Integer; cdecl;
    {class} function _GetPRINTTEXT_ATRIBUTO_INVALIDO: Integer; cdecl;
    {class} function _GetQRCODEAUTO_CODIGO_INVALIDO: Integer; cdecl;
    {class} function _GetQRCODEAUTO_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetQRCODEAUTO_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetQRCODEAUTO_MULTIPLICADOR_INVALIDO: Integer; cdecl;
    {class} function _GetQRCODEAUTO_ROTACAO_INVALIDA: Integer; cdecl;
    {class} function _GetQRCODEMANUAL_CODIGO_INVALIDO: Integer; cdecl;
    {class} function _GetQRCODEMANUAL_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetQRCODEMANUAL_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetQRCODEMANUAL_INPUT_CONFIG_INVALIDO: Integer; cdecl;
    {class} function _GetQRCODEMANUAL_INPUT_INVALIDO: Integer; cdecl;
    {class} function _GetQRCODEMANUAL_MULTIPLICADOR_INVALIDO: Integer; cdecl;
    {class} function _GetQRCODEMANUAL_NUM_CHARS_8BIT_INVALIDO: Integer; cdecl;
    {class} function _GetQRCODEMANUAL_NUM_MASCARA_INVALIDO: Integer; cdecl;
    {class} function _GetQRCODEMANUAL_NUM_MODELO_INVALIDO: Integer; cdecl;
    {class} function _GetQRCODEMANUAL_NVL_COR_ERRO_INVALIDO: Integer; cdecl;
    {class} function _GetQRCODEMANUAL_ROTACAO_INVALIDA: Integer; cdecl;
    {class} function _GetQUANTIDADE_COMERCIAL_INVALIDA: Integer; cdecl;
    {class} function _GetQUANTIDADE_ELEMENTO_EXCEDIDA: Integer; cdecl;
    {class} function _GetQUANTIDADE_FORA_INTERVALO: Integer; cdecl;
    {class} function _GetQUANTIDADE_INVALIDA: Integer; cdecl;
    {class} function _GetQUANTIDADE_MEIO_PAGAMENTO_EXCEDIDA: Integer; cdecl;
    {class} function _GetQUANTIDADE_VENDIDA_COFINS_INVALIDA: Integer; cdecl;
    {class} function _GetQUANTIDADE_VENDIDA_PIS_INVALIDA: Integer; cdecl;
    {class} function _GetRECONEXOES_ESGOTADAS: Integer; cdecl;
    {class} function _GetREGRA_CALCULO_INVALIDA: Integer; cdecl;
    {class} function _GetSCALA_INVALIDA: Integer; cdecl;
    {class} function _GetSERVICO_OCUPADO: Integer; cdecl;
    {class} function _GetSIGNAC_INVALIDA: Integer; cdecl;
    {class} function _GetSTATEPRINTER_QSESEMPAPEL: Integer; cdecl;
    {class} function _GetSTATEPRINTER_QSESEMPAPELETAMPA: Integer; cdecl;
    {class} function _GetSTATEPRINTER_SEMPAPEL: Integer; cdecl;
    {class} function _GetSTATEPRINTER_SUCESSO: Integer; cdecl;
    {class} function _GetSTATEPRINTER_TAMPAABERTA: Integer; cdecl;
    {class} function _GetSTATEPRINTER_TAMPAEPAPEL: Integer; cdecl;
    {class} function _GetSTATUS_NAO_SUPORTADO: Integer; cdecl;
    {class} function _GetSTILO_INVALIDO: Integer; cdecl;
    {class} function _GetSUCESSO: Integer; cdecl;
    {class} function _GetTAMANHO_INFORMACOES_COMPLEMENTARES_INVALIDO: Integer; cdecl;
    {class} function _GetTAMANHO_INVALIDO: Integer; cdecl;
    {class} function _GetTAMANHO_QR_INVALIDO: Integer; cdecl;
    {class} function _GetTEMPO_FORA_LIMITE: Integer; cdecl;
    {class} function _GetTEMPO_INVALIDO: Integer; cdecl;
    {class} function _GetTEXTOASD_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetTEXTOASD_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetTEXTOASD_MULTIPLICADOR_HORIZONTAL_INVALIDO: Integer; cdecl;
    {class} function _GetTEXTOASD_MULTIPLICADOR_VERTICAL_INVALIDO: Integer; cdecl;
    {class} function _GetTEXTOASD_ROTACAO_INVALIDA: Integer; cdecl;
    {class} function _GetTEXTOASD_TAMANHO_INVALIDO: Integer; cdecl;
    {class} function _GetTEXTOASD_TEXTO_INVALIDO: Integer; cdecl;
    {class} function _GetTEXTOCOURIER_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetTEXTOCOURIER_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetTEXTOCOURIER_MULTIPLICADOR_HORIZONTAL_INVALIDO: Integer; cdecl;
    {class} function _GetTEXTOCOURIER_MULTIPLICADOR_VERTICAL_INVALIDO: Integer; cdecl;
    {class} function _GetTEXTOCOURIER_ROTACAO_INVALIDA: Integer; cdecl;
    {class} function _GetTEXTOCOURIER_SYMBOL_INVALIDO: Integer; cdecl;
    {class} function _GetTEXTOCOURIER_TEXTO_INVALIDO: Integer; cdecl;
    {class} function _GetTEXTO_COORDENADA_X_INVALIDA: Integer; cdecl;
    {class} function _GetTEXTO_COORDENADA_Y_INVALIDA: Integer; cdecl;
    {class} function _GetTEXTO_FONTE_INVALIDA: Integer; cdecl;
    {class} function _GetTEXTO_MULTIPLICADOR_HORIZONTAL_INVALIDO: Integer; cdecl;
    {class} function _GetTEXTO_MULTIPLICADOR_VERTICAL_INVALIDO: Integer; cdecl;
    {class} function _GetTEXTO_ROTACAO_INVALIDA: Integer; cdecl;
    {class} function _GetTEXTO_TEXTO_INVALIDO: Integer; cdecl;
    {class} function _GetTHREAD_EXECUTION_EXCEPTION: Integer; cdecl;
    {class} function _GetTHREAD_INTERRUPTED_EXCEPTION: Integer; cdecl;
    {class} function _GetTIPO_EMISSAO_INDEFINIDA: Integer; cdecl;
    {class} function _GetTIPO_INVALIDO: Integer; cdecl;
    {class} function _GetTIPO_PARAMETRO_INVALIDO: Integer; cdecl;
    {class} function _GetUF_INVALIDO: Integer; cdecl;
    {class} function _GetUNIDADE_COMERCIAL_INVALIDA: Integer; cdecl;
    {class} function _GetVALOR_ACRESCIMO_INVALIDO: Integer; cdecl;
    {class} function _GetVALOR_ACRESCIMO_SUBTOTAL_INVALIDO: Integer; cdecl;
    {class} function _GetVALOR_ALIQUOTA_COFINS_INVALIDA: Integer; cdecl;
    {class} function _GetVALOR_ALIQUOTA_PIS_INVALIDA: Integer; cdecl;
    {class} function _GetVALOR_DEDUCOES_ISSQN_INVALIDA: Integer; cdecl;
    {class} function _GetVALOR_DESCONTO_INVALIDO: Integer; cdecl;
    {class} function _GetVALOR_DESCONTO_SUBTOTAL_INVALIDO: Integer; cdecl;
    {class} function _GetVALOR_MEIO_PAGAMENTO_INVALIDO: Integer; cdecl;
    {class} function _GetVALOR_UNITARIO_INVALIDO: Integer; cdecl;
    {class} function _GetVALOR_VCFELEI12741_INVALIDO: Integer; cdecl;
    {class} function _GetVERSAO_DADOS_ENT_INVALIDO: Integer; cdecl;
    {class} function _GetVERSAO_XMLNFCE_INDEFINIDA: Integer; cdecl;
    {class} function _GetVERSAO_XMLNFCE_NAO_SUPORTADA: Integer; cdecl;
    {class} function _GetVITEM12741_INVALIDO: Integer; cdecl;
    {class} function _GetWIDTH_INVALIDO: Integer; cdecl;
    {class} function _GetXSD_NAO_ENCONTRADO: Integer; cdecl;
    {class} function _Get__ERRO_AO_CARREGAR_DLL_IMPRESSORA: JString; cdecl;
    {class} function _Get__ERRO_AO_CARREGAR_DLL_SAT: JString; cdecl;
    {class} function _Get__ERRO_AO_VALIDAR_DLL_SAL: JString; cdecl;
    {class} function _Get__ERRO_CANCELAR_VENDA_SAT: JString; cdecl;
    {class} function _Get__SUCESSO: JString; cdecl;
    {class} function init: JCodigoErro; cdecl;
    {class} property ALIQUOTA_IMPOSTO_INVALIDA: Integer read _GetALIQUOTA_IMPOSTO_INVALIDA;
    {class} property ALIQUOTA_ISSQN_INVALIDA: Integer read _GetALIQUOTA_ISSQN_INVALIDA;
    {class} property ARQUIVO_NAO_ENCONTRADO: Integer read _GetARQUIVO_NAO_ENCONTRADO;
    {class} property ARQUIVO_NAO_EXISTE: Integer read _GetARQUIVO_NAO_EXISTE;
    {class} property ARQUIVO_NAO_PODE_SER_ABERTO: Integer read _GetARQUIVO_NAO_PODE_SER_ABERTO;
    {class} property ASSINATURA_QRCODE_INVALIDA: Integer read _GetASSINATURA_QRCODE_INVALIDA;
    {class} property BAIRRO_INVALIDO: Integer read _GetBAIRRO_INVALIDO;
    {class} property BAL_BALANCA_EM_USO: Integer read _GetBAL_BALANCA_EM_USO;
    {class} property BAL_BALANCA_INVALIDA: Integer read _GetBAL_BALANCA_INVALIDA;
    {class} property BAL_BAUDRATE_INVALIDO: Integer read _GetBAL_BAUDRATE_INVALIDO;
    {class} property BAL_BAUDRATE_NAO_SUPORTADO: Integer read _GetBAL_BAUDRATE_NAO_SUPORTADO;
    {class} property BAL_COMANDO_NAO_SUPORTADO_PELA_BALANCA: Integer read _GetBAL_COMANDO_NAO_SUPORTADO_PELA_BALANCA;
    {class} property BAL_COMANDO_NAO_SUPORTADO_PELO_PROTOCOLO: Integer read _GetBAL_COMANDO_NAO_SUPORTADO_PELO_PROTOCOLO;
    {class} property BAL_COMBINACAO_DE_PARAMETROS_INVALIDA: Integer read _GetBAL_COMBINACAO_DE_PARAMETROS_INVALIDA;
    {class} property BAL_CONEXAO_ATIVA: Integer read _GetBAL_CONEXAO_ATIVA;
    {class} property BAL_CONFIGS_SERIAIS_NAO_SUPORTADAS_PELO_PROTOCOLO: Integer read _GetBAL_CONFIGS_SERIAIS_NAO_SUPORTADAS_PELO_PROTOCOLO;
    {class} property BAL_FALHA_AO_ENVIAR_PRECO: Integer read _GetBAL_FALHA_AO_ENVIAR_PRECO;
    {class} property BAL_FALHA_NA_LEITURA_DO_PESO: Integer read _GetBAL_FALHA_NA_LEITURA_DO_PESO;
    {class} property BAL_LENGTH_INVALIDO: Integer read _GetBAL_LENGTH_INVALIDO;
    {class} property BAL_LENGTH_NAO_SUPORTADO: Integer read _GetBAL_LENGTH_NAO_SUPORTADO;
    {class} property BAL_NENHUMA_BALANCA_EM_USO: Integer read _GetBAL_NENHUMA_BALANCA_EM_USO;
    {class} property BAL_NENHUM_PROTOCOLO_EM_USO: Integer read _GetBAL_NENHUM_PROTOCOLO_EM_USO;
    {class} property BAL_PARITY_INVALIDO: Integer read _GetBAL_PARITY_INVALIDO;
    {class} property BAL_PARITY_NAO_SUPORTADO: Integer read _GetBAL_PARITY_NAO_SUPORTADO;
    {class} property BAL_PRECO_INVALIDO: Integer read _GetBAL_PRECO_INVALIDO;
    {class} property BAL_PROTOCOLO_EM_USO: Integer read _GetBAL_PROTOCOLO_EM_USO;
    {class} property BAL_PROTOCOLO_INVALIDO: Integer read _GetBAL_PROTOCOLO_INVALIDO;
    {class} property BAL_PROTOCOLO_NAO_SUPORTADO: Integer read _GetBAL_PROTOCOLO_NAO_SUPORTADO;
    {class} property BAL_PROTOCOLO_NAO_SUPORTADO_PELAS_CONFIGS_SERIAIS: Integer read _GetBAL_PROTOCOLO_NAO_SUPORTADO_PELAS_CONFIGS_SERIAIS;
    {class} property BAL_QTD_LEITURAS_INVALIDA: Integer read _GetBAL_QTD_LEITURAS_INVALIDA;
    {class} property BAL_STOPBITS_INVALIDO: Integer read _GetBAL_STOPBITS_INVALIDO;
    {class} property BAL_STOPBITS_NAO_SUPORTADO: Integer read _GetBAL_STOPBITS_NAO_SUPORTADO;
    {class} property BARCODE1D_ALTURA_INVALIDA: Integer read _GetBARCODE1D_ALTURA_INVALIDA;
    {class} property BARCODE1D_CARACTERE_INVALIDO: Integer read _GetBARCODE1D_CARACTERE_INVALIDO;
    {class} property BARCODE1D_CODIGO_INVALIDO: Integer read _GetBARCODE1D_CODIGO_INVALIDO;
    {class} property BARCODE1D_COORDENADA_X_INVALIDA: Integer read _GetBARCODE1D_COORDENADA_X_INVALIDA;
    {class} property BARCODE1D_COORDENADA_Y_INVALIDA: Integer read _GetBARCODE1D_COORDENADA_Y_INVALIDA;
    {class} property BARCODE1D_LARGURA_BARRAS_ESTREITAS_INVALIDA: Integer read _GetBARCODE1D_LARGURA_BARRAS_ESTREITAS_INVALIDA;
    {class} property BARCODE1D_LARGURA_BARRAS_LARGAS_INVALIDA: Integer read _GetBARCODE1D_LARGURA_BARRAS_LARGAS_INVALIDA;
    {class} property BARCODE1D_ROTACAO_INVALIDA: Integer read _GetBARCODE1D_ROTACAO_INVALIDA;
    {class} property BARCODE1D_TAMANHO_INVALIDO: Integer read _GetBARCODE1D_TAMANHO_INVALIDO;
    {class} property BARCODE1D_TIPO_INVALIDO: Integer read _GetBARCODE1D_TIPO_INVALIDO;
    {class} property BASE_CALCULO_INVALIDA: Integer read _GetBASE_CALCULO_INVALIDA;
    {class} property BAUDRATE_INVALIDO: Integer read _GetBAUDRATE_INVALIDO;
    {class} property BLUETOOTH_DESATIVADO: Integer read _GetBLUETOOTH_DESATIVADO;
    {class} property BOX_ALTURA_INVALIDA: Integer read _GetBOX_ALTURA_INVALIDA;
    {class} property BOX_COMPRIMENTO_INVALIDO: Integer read _GetBOX_COMPRIMENTO_INVALIDO;
    {class} property BOX_COORDENADA_X_INVALIDA: Integer read _GetBOX_COORDENADA_X_INVALIDA;
    {class} property BOX_COORDENADA_Y_INVALIDA: Integer read _GetBOX_COORDENADA_Y_INVALIDA;
    {class} property BOX_GROSSURA_BORDAS_HORIZONTAIS_INVALIDA: Integer read _GetBOX_GROSSURA_BORDAS_HORIZONTAIS_INVALIDA;
    {class} property BOX_GROSSURA_BORDAS_VERTICAIS_INVALIDA: Integer read _GetBOX_GROSSURA_BORDAS_VERTICAIS_INVALIDA;
    {class} property CB_ALTURA_INVALIDA: Integer read _GetCB_ALTURA_INVALIDA;
    {class} property CB_AREA_DE_IMPRESSAO_EXCEDIDA: Integer read _GetCB_AREA_DE_IMPRESSAO_EXCEDIDA;
    {class} property CB_DADOS_INVALIDOS: Integer read _GetCB_DADOS_INVALIDOS;
    {class} property CB_HRI_INVALIDO: Integer read _GetCB_HRI_INVALIDO;
    {class} property CB_LARGURA_INVALIDA: Integer read _GetCB_LARGURA_INVALIDA;
    {class} property CB_TIPO_INVALIDO: Integer read _GetCB_TIPO_INVALIDO;
    {class} property CEST_INVALIDO: Integer read _GetCEST_INVALIDO;
    {class} property CFOP_INVALIDO: Integer read _GetCFOP_INVALIDO;
    {class} property CHAMADA_NAO_PERMITIDA: Integer read _GetCHAMADA_NAO_PERMITIDA;
    {class} property CHAVE_CANCELAMENTO_INVALIDA: Integer read _GetCHAVE_CANCELAMENTO_INVALIDA;
    {class} property CNPJ_INVALIDO: Integer read _GetCNPJ_INVALIDO;
    {class} property CODIGO_MEIO_PAGAMENTO_INVALIDO: Integer read _GetCODIGO_MEIO_PAGAMENTO_INVALIDO;
    {class} property CODIGO_MUNICIPIO_FATO_GERADOR_INVALIDO: Integer read _GetCODIGO_MUNICIPIO_FATO_GERADOR_INVALIDO;
    {class} property CODIGO_PRODUTO_INVALIDO: Integer read _GetCODIGO_PRODUTO_INVALIDO;
    {class} property CODIGO_TRIBUTACAO_ISSQN_INVALIDO: Integer read _GetCODIGO_TRIBUTACAO_ISSQN_INVALIDO;
    {class} property COMANDO_INVALIDO: Integer read _GetCOMANDO_INVALIDO;
    {class} property COMPLEMENTO_INVALIDO: Integer read _GetCOMPLEMENTO_INVALIDO;
    {class} property CONEXAO_ATIVA: Integer read _GetCONEXAO_ATIVA;
    {class} property CONEXAO_ATIVA_OUTRO: Integer read _GetCONEXAO_ATIVA_OUTRO;
    {class} property CONEXAO_NEGADA: Integer read _GetCONEXAO_NEGADA;
    {class} property CONTEUDO_CAMPO_INVALIDO: Integer read _GetCONTEUDO_CAMPO_INVALIDO;
    {class} property CPF_INVALIDO: Integer read _GetCPF_INVALIDO;
    {class} property CREDENCIADORA_CARTAO_INVALIDO: Integer read _GetCREDENCIADORA_CARTAO_INVALIDO;
    {class} property CREGTRIBISSQN_INVALIDO: Integer read _GetCREGTRIBISSQN_INVALIDO;
    {class} property CSOSN_INVALIDO: Integer read _GetCSOSN_INVALIDO;
    {class} property CST_INVALIDO: Integer read _GetCST_INVALIDO;
    {class} property DADOS_PDF_INVALIDOS: Integer read _GetDADOS_PDF_INVALIDOS;
    {class} property DADOS_QR_INVALIDOS: Integer read _GetDADOS_QR_INVALIDOS;
    {class} property DATABAREXPANDED_ALPHANUMERIC_CARACTERE_INVALIDO: Integer read _GetDATABAREXPANDED_ALPHANUMERIC_CARACTERE_INVALIDO;
    {class} property DATABAREXPANDED_ALPHANUMERIC_TAMANHO_INVALIDO: Integer read _GetDATABAREXPANDED_ALPHANUMERIC_TAMANHO_INVALIDO;
    {class} property DATABAREXPANDED_ALTURA_INVALIDA: Integer read _GetDATABAREXPANDED_ALTURA_INVALIDA;
    {class} property DATABAREXPANDED_BAR_RATIO_INVALIDO: Integer read _GetDATABAREXPANDED_BAR_RATIO_INVALIDO;
    {class} property DATABAREXPANDED_CODIGO_INVALIDO: Integer read _GetDATABAREXPANDED_CODIGO_INVALIDO;
    {class} property DATABAREXPANDED_COORDENADA_X_INVALIDA: Integer read _GetDATABAREXPANDED_COORDENADA_X_INVALIDA;
    {class} property DATABAREXPANDED_COORDENADA_Y_INVALIDA: Integer read _GetDATABAREXPANDED_COORDENADA_Y_INVALIDA;
    {class} property DATABAREXPANDED_PIXEL_MULTIPLIER_INVALIDO: Integer read _GetDATABAREXPANDED_PIXEL_MULTIPLIER_INVALIDO;
    {class} property DATABAREXPANDED_ROTACAO_INVALIDA: Integer read _GetDATABAREXPANDED_ROTACAO_INVALIDA;
    {class} property DATABAREXPANDED_SEGMENTS_PER_ROW_INVALIDO: Integer read _GetDATABAREXPANDED_SEGMENTS_PER_ROW_INVALIDO;
    {class} property DATABAR_ALTURA_INVALIDA: Integer read _GetDATABAR_ALTURA_INVALIDA;
    {class} property DATABAR_BAR_RATIO_INVALIDO: Integer read _GetDATABAR_BAR_RATIO_INVALIDO;
    {class} property DATABAR_CODIGO_INVALIDO: Integer read _GetDATABAR_CODIGO_INVALIDO;
    {class} property DATABAR_COORDENADA_X_INVALIDA: Integer read _GetDATABAR_COORDENADA_X_INVALIDA;
    {class} property DATABAR_COORDENADA_Y_INVALIDA: Integer read _GetDATABAR_COORDENADA_Y_INVALIDA;
    {class} property DATABAR_NUMERIC_LINEAR_DATA_CARACTERE_INVALIDO: Integer read _GetDATABAR_NUMERIC_LINEAR_DATA_CARACTERE_INVALIDO;
    {class} property DATABAR_NUMERIC_LINEAR_DATA_TAMANHO_INVALIDO: Integer read _GetDATABAR_NUMERIC_LINEAR_DATA_TAMANHO_INVALIDO;
    {class} property DATABAR_PIXEL_MULTIPLIER_INVALIDO: Integer read _GetDATABAR_PIXEL_MULTIPLIER_INVALIDO;
    {class} property DATABAR_ROTACAO_INVALIDA: Integer read _GetDATABAR_ROTACAO_INVALIDA;
    {class} property DATABAR_TIPO_INVALIDO: Integer read _GetDATABAR_TIPO_INVALIDO;
    {class} property DATAMATRIX_CODIGO_INVALIDO: Integer read _GetDATAMATRIX_CODIGO_INVALIDO;
    {class} property DATAMATRIX_COLUMNS_INVALIDAS: Integer read _GetDATAMATRIX_COLUMNS_INVALIDAS;
    {class} property DATAMATRIX_COORDENADA_X_INVALIDA: Integer read _GetDATAMATRIX_COORDENADA_X_INVALIDA;
    {class} property DATAMATRIX_COORDENADA_Y_INVALIDA: Integer read _GetDATAMATRIX_COORDENADA_Y_INVALIDA;
    {class} property DATAMATRIX_MULTIPLICADOR_INVALIDO: Integer read _GetDATAMATRIX_MULTIPLICADOR_INVALIDO;
    {class} property DATAMATRIX_ROTACAO_INVALIDA: Integer read _GetDATAMATRIX_ROTACAO_INVALIDA;
    {class} property DATAMATRIX_ROWS_INVALIDAS: Integer read _GetDATAMATRIX_ROWS_INVALIDAS;
    {class} property DESCRICAO_PRODUTO_INVALIDA: Integer read _GetDESCRICAO_PRODUTO_INVALIDA;
    {class} property DIRECAO_INVALIDA: Integer read _GetDIRECAO_INVALIDA;
    {class} property DISPOSITIVO_NAO_ENCONTRADO: Integer read _GetDISPOSITIVO_NAO_ENCONTRADO;
    {class} property DISPOSITIVO_NAO_EXISTE: Integer read _GetDISPOSITIVO_NAO_EXISTE;
    {class} property DISPOSITIVO_NAO_PAREADO: Integer read _GetDISPOSITIVO_NAO_PAREADO;
    {class} property DISPOSITIVO_NAO_SUPORTA_BT: Integer read _GetDISPOSITIVO_NAO_SUPORTA_BT;
    {class} property ERROR_CORRECTION_LEVEL_INVALIDO: Integer read _GetERROR_CORRECTION_LEVEL_INVALIDO;
    {class} property ERRO_ABERTURA_NAO_AUTORIZADA: Integer read _GetERRO_ABERTURA_NAO_AUTORIZADA;
    {class} property ERRO_ABERTURA_PORTA: Integer read _GetERRO_ABERTURA_PORTA;
    {class} property ERRO_ALTURA_GAP: Integer read _GetERRO_ALTURA_GAP;
    {class} property ERRO_AO_CARREGAR_BIBLIOTECA_DA_ETIQUETA: Integer read _GetERRO_AO_CARREGAR_BIBLIOTECA_DA_ETIQUETA;
    {class} property ERRO_AO_CARREGAR_BIBLIOTECA_DA_IMPRESSORA: Integer read _GetERRO_AO_CARREGAR_BIBLIOTECA_DA_IMPRESSORA;
    {class} property ERRO_AO_CARREGAR_BIBLIOTECA_DO_E1SAT: Integer read _GetERRO_AO_CARREGAR_BIBLIOTECA_DO_E1SAT;
    {class} property ERRO_AO_CARREGAR_BIBLIOTECA_DO_SAT: Integer read _GetERRO_AO_CARREGAR_BIBLIOTECA_DO_SAT;
    {class} property ERRO_BACKFEED: Integer read _GetERRO_BACKFEED;
    {class} property ERRO_BAUDRATE_BAUDRATE: Integer read _GetERRO_BAUDRATE_BAUDRATE;
    {class} property ERRO_BAUDRATE_DATA_LENGTH: Integer read _GetERRO_BAUDRATE_DATA_LENGTH;
    {class} property ERRO_BAUDRATE_PARITY: Integer read _GetERRO_BAUDRATE_PARITY;
    {class} property ERRO_BAUDRATE_STOP_BIT: Integer read _GetERRO_BAUDRATE_STOP_BIT;
    {class} property ERRO_CALOR: Integer read _GetERRO_CALOR;
    {class} property ERRO_CAMPOS_OVERFLOW: Integer read _GetERRO_CAMPOS_OVERFLOW;
    {class} property ERRO_CLAIM_UL: Integer read _GetERRO_CLAIM_UL;
    {class} property ERRO_CONEXAO_BLUETOOTH: Integer read _GetERRO_CONEXAO_BLUETOOTH;
    {class} property ERRO_CORTAR_ZERO: Integer read _GetERRO_CORTAR_ZERO;
    {class} property ERRO_DESCONHECIDO: Integer read _GetERRO_DESCONHECIDO;
    {class} property ERRO_DE_ABERTURA_PORTA_USB: Integer read _GetERRO_DE_ABERTURA_PORTA_USB;
    {class} property ERRO_ENVIA_IMAGEM_ARQUIVO: Integer read _GetERRO_ENVIA_IMAGEM_ARQUIVO;
    {class} property ERRO_ENVIA_IMAGEM_FORMATO: Integer read _GetERRO_ENVIA_IMAGEM_FORMATO;
    {class} property ERRO_ENVIA_IMAGEM_MODULO: Integer read _GetERRO_ENVIA_IMAGEM_MODULO;
    {class} property ERRO_ENVIA_IMAGEM_NOME_CARACTERE: Integer read _GetERRO_ENVIA_IMAGEM_NOME_CARACTERE;
    {class} property ERRO_ENVIA_IMAGEM_NOME_TAMANHO: Integer read _GetERRO_ENVIA_IMAGEM_NOME_TAMANHO;
    {class} property ERRO_ESCRITA: Integer read _GetERRO_ESCRITA;
    {class} property ERRO_ESCRITA_PORTA: Integer read _GetERRO_ESCRITA_PORTA;
    {class} property ERRO_EXCLUI_IMAGEM_MODULO: Integer read _GetERRO_EXCLUI_IMAGEM_MODULO;
    {class} property ERRO_EXCLUI_IMAGEM_NOME_CARACTERE: Integer read _GetERRO_EXCLUI_IMAGEM_NOME_CARACTERE;
    {class} property ERRO_EXCLUI_IMAGEM_NOME_TAMANHO: Integer read _GetERRO_EXCLUI_IMAGEM_NOME_TAMANHO;
    {class} property ERRO_FECHAMENTO_NAO_AUTORIZADO: Integer read _GetERRO_FECHAMENTO_NAO_AUTORIZADO;
    {class} property ERRO_FECHAMENTO_PORTA: Integer read _GetERRO_FECHAMENTO_PORTA;
    {class} property ERRO_FUNCAO_NAO_CHAMADA_PELO_SERVICO: Integer read _GetERRO_FUNCAO_NAO_CHAMADA_PELO_SERVICO;
    {class} property ERRO_FUNCAO_NAO_DISPONIVEL_VIA_SERVICO: Integer read _GetERRO_FUNCAO_NAO_DISPONIVEL_VIA_SERVICO;
    {class} property ERRO_FUNCAO_NAO_SUPORTADA: Integer read _GetERRO_FUNCAO_NAO_SUPORTADA;
    {class} property ERRO_LEITURA_PORTA: Integer read _GetERRO_LEITURA_PORTA;
    {class} property ERRO_LENGTH: Integer read _GetERRO_LENGTH;
    {class} property ERRO_LIMPAR: Integer read _GetERRO_LIMPAR;
    {class} property ERRO_LIMPA_MODULO_MODULO: Integer read _GetERRO_LIMPA_MODULO_MODULO;
    {class} property ERRO_LOGIC_IMG_MODE: Integer read _GetERRO_LOGIC_IMG_MODE;
    {class} property ERRO_MEDIDA: Integer read _GetERRO_MEDIDA;
    {class} property ERRO_MEMORY_STATUS_TIPO_DADOS: Integer read _GetERRO_MEMORY_STATUS_TIPO_DADOS;
    {class} property ERRO_MIRROR: Integer read _GetERRO_MIRROR;
    {class} property ERRO_MODO_CONTINUO: Integer read _GetERRO_MODO_CONTINUO;
    {class} property ERRO_NENHUM_BYTE_ENVIADO: Integer read _GetERRO_NENHUM_BYTE_ENVIADO;
    {class} property ERRO_NOT_ACTIVITY: Integer read _GetERRO_NOT_ACTIVITY;
    {class} property ERRO_OFFSET_COLUNA: Integer read _GetERRO_OFFSET_COLUNA;
    {class} property ERRO_OFFSET_LINHA: Integer read _GetERRO_OFFSET_LINHA;
    {class} property ERRO_PDF_DESCONHECIDO: Integer read _GetERRO_PDF_DESCONHECIDO;
    {class} property ERRO_PRINT_ST_POS: Integer read _GetERRO_PRINT_ST_POS;
    {class} property ERRO_QTDE: Integer read _GetERRO_QTDE;
    {class} property ERRO_SENSOR: Integer read _GetERRO_SENSOR;
    {class} property ERRO_SERIAL_DESCONHECIDO: Integer read _GetERRO_SERIAL_DESCONHECIDO;
    {class} property ERRO_SERVICO_NAO_INICIADO: Integer read _GetERRO_SERVICO_NAO_INICIADO;
    {class} property ERRO_SYMBOL: Integer read _GetERRO_SYMBOL;
    {class} property ERRO_TAM_PIXEL: Integer read _GetERRO_TAM_PIXEL;
    {class} property ERRO_TIPO_TRANSFERENCIA: Integer read _GetERRO_TIPO_TRANSFERENCIA;
    {class} property ERRO_VEL_IMPRESSAO: Integer read _GetERRO_VEL_IMPRESSAO;
    {class} property ERRO_XSD: Integer read _GetERRO_XSD;
    {class} property ESTE_JSON_NAO_E_UM_OBJETO: Integer read _GetESTE_JSON_NAO_E_UM_OBJETO;
    {class} property GRUPO_INVALIDO: Integer read _GetGRUPO_INVALIDO;
    {class} property GTIN_INVALIDO: Integer read _GetGTIN_INVALIDO;
    {class} property HEIGHT_INVALIDO: Integer read _GetHEIGHT_INVALIDO;
    {class} property IDENTIFICADOR_CAMPO_INVALIDO: Integer read _GetIDENTIFICADOR_CAMPO_INVALIDO;
    {class} property IE_INVALIDO: Integer read _GetIE_INVALIDO;
    {class} property IMAGEM_COORDENADA_X_INVALIDA: Integer read _GetIMAGEM_COORDENADA_X_INVALIDA;
    {class} property IMAGEM_COORDENADA_Y_INVALIDA: Integer read _GetIMAGEM_COORDENADA_Y_INVALIDA;
    {class} property IMAGEM_NOME_CARACTERE_INVALIDO: Integer read _GetIMAGEM_NOME_CARACTERE_INVALIDO;
    {class} property IMAGEM_NOME_TAMANHO_INVALIDO: Integer read _GetIMAGEM_NOME_TAMANHO_INVALIDO;
    {class} property IM_INVALIDO: Integer read _GetIM_INVALIDO;
    {class} property INDICADOR_INCETIVO_FISCAL_ISSQN_INVALIDO: Integer read _GetINDICADOR_INCETIVO_FISCAL_ISSQN_INVALIDO;
    {class} property INDRATISSQN_INVALIDO: Integer read _GetINDRATISSQN_INVALIDO;
    {class} property INFORMACOES_ADICIONAIS_PRODUTO_INVALIDA: Integer read _GetINFORMACOES_ADICIONAIS_PRODUTO_INVALIDA;
    {class} property ITEM_LISTA_SERVICO_INVALIDO: Integer read _GetITEM_LISTA_SERVICO_INVALIDO;
    {class} property KEY_INVALIDO: Integer read _GetKEY_INVALIDO;
    {class} property LINHA_ALTURA_INVALIDA: Integer read _GetLINHA_ALTURA_INVALIDA;
    {class} property LINHA_COMPRIMENTO_INVALIDO: Integer read _GetLINHA_COMPRIMENTO_INVALIDO;
    {class} property LINHA_COORDENADA_X_INVALIDA: Integer read _GetLINHA_COORDENADA_X_INVALIDA;
    {class} property LINHA_COORDENADA_Y_INVALIDA: Integer read _GetLINHA_COORDENADA_Y_INVALIDA;
    {class} property LOGRADOURO_INVALIDO: Integer read _GetLOGRADOURO_INVALIDO;
    {class} property MAC_ADDRESS_INVALIDO: Integer read _GetMAC_ADDRESS_INVALIDO;
    {class} property MAXICODE_CLASS_OF_SERVICE_INVALIDA: Integer read _GetMAXICODE_CLASS_OF_SERVICE_INVALIDA;
    {class} property MAXICODE_CODIGO_INVALIDO: Integer read _GetMAXICODE_CODIGO_INVALIDO;
    {class} property MAXICODE_COORDENADA_X_INVALIDA: Integer read _GetMAXICODE_COORDENADA_X_INVALIDA;
    {class} property MAXICODE_COORDENADA_Y_INVALIDA: Integer read _GetMAXICODE_COORDENADA_Y_INVALIDA;
    {class} property MAXICODE_COUNTRY_INVALIDO: Integer read _GetMAXICODE_COUNTRY_INVALIDO;
    {class} property MAXICODE_PRIMARY_ZIP_INVALIDO: Integer read _GetMAXICODE_PRIMARY_ZIP_INVALIDO;
    {class} property MAXICODE_ROTACAO_INVALIDA: Integer read _GetMAXICODE_ROTACAO_INVALIDA;
    {class} property MAXICODE_SECONDARY_ZIP_INVALIDO: Integer read _GetMAXICODE_SECONDARY_ZIP_INVALIDO;
    {class} property MODELO_INVALIDO: Integer read _GetMODELO_INVALIDO;
    {class} property MODULO_FUNCAO_NAO_ENCONTRADO: Integer read _GetMODULO_FUNCAO_NAO_ENCONTRADO;
    {class} property MUNICIPIO_INVALIDO: Integer read _GetMUNICIPIO_INVALIDO;
    {class} property NAO_FOI_POSSIVEL_INICIAR_O_SERVICO: Integer read _GetNAO_FOI_POSSIVEL_INICIAR_O_SERVICO;
    {class} property NATUREZA_OPERACAO_INVALIDA: Integer read _GetNATUREZA_OPERACAO_INVALIDA;
    {class} property NCM_INVALIDO: Integer read _GetNCM_INVALIDO;
    {class} property NENHUM_DADO_RETORNADO: Integer read _GetNENHUM_DADO_RETORNADO;
    {class} property NIVEL_DE_CORRECAO_INVALIDO: Integer read _GetNIVEL_DE_CORRECAO_INVALIDO;
    {class} property NOME_DESTINARIO_INVALIDO: Integer read _GetNOME_DESTINARIO_INVALIDO;
    {class} property NUMBER_COLUMNS_INVALIDO: Integer read _GetNUMBER_COLUMNS_INVALIDO;
    {class} property NUMBER_ROWS_INVALIDO: Integer read _GetNUMBER_ROWS_INVALIDO;
    {class} property NUMERO_CAIXA_INVALIDO: Integer read _GetNUMERO_CAIXA_INVALIDO;
    {class} property NUMERO_INVALIDO: Integer read _GetNUMERO_INVALIDO;
    {class} property NUMERO_ITEM_INVALIDO: Integer read _GetNUMERO_ITEM_INVALIDO;
    {class} property OPERACAO_INVALIDA: Integer read _GetOPERACAO_INVALIDA;
    {class} property OPTIONS_INVALIDO: Integer read _GetOPTIONS_INVALIDO;
    {class} property ORIGEM_MERCADORIA_INVALIDA: Integer read _GetORIGEM_MERCADORIA_INVALIDA;
    {class} property PARAMETRO_CONF_INVALIDO: Integer read _GetPARAMETRO_CONF_INVALIDO;
    {class} property PARAMETRO_NAO_ENCONTRADO: Integer read _GetPARAMETRO_NAO_ENCONTRADO;
    {class} property PARAMETRO_TIPO_STATUS_INVALIDO: Integer read _GetPARAMETRO_TIPO_STATUS_INVALIDO;
    {class} property PDF417_CODIGO_INVALIDO: Integer read _GetPDF417_CODIGO_INVALIDO;
    {class} property PDF417_COLUMN_NUMBER_INVALIDO: Integer read _GetPDF417_COLUMN_NUMBER_INVALIDO;
    {class} property PDF417_COORDENADA_X_INVALIDA: Integer read _GetPDF417_COORDENADA_X_INVALIDA;
    {class} property PDF417_COORDENADA_Y_INVALIDA: Integer read _GetPDF417_COORDENADA_Y_INVALIDA;
    {class} property PDF417_MULTIPLICADOR_HORIZONTAL_INVALIDO: Integer read _GetPDF417_MULTIPLICADOR_HORIZONTAL_INVALIDO;
    {class} property PDF417_MULTIPLICADOR_VERTICAL_INVALIDO: Integer read _GetPDF417_MULTIPLICADOR_VERTICAL_INVALIDO;
    {class} property PDF417_ROTACAO_INVALIDA: Integer read _GetPDF417_ROTACAO_INVALIDA;
    {class} property PDF417_ROW_NUMBER_INVALIDO: Integer read _GetPDF417_ROW_NUMBER_INVALIDO;
    {class} property PDF417_SECURITY_LEVEL_INVALIDO: Integer read _GetPDF417_SECURITY_LEVEL_INVALIDO;
    {class} property PDF417_TIPO_INVALIDO: Integer read _GetPDF417_TIPO_INVALIDO;
    {class} property PDF_417_ASPECT_RATIO_INVALIDO: Integer read _GetPDF_417_ASPECT_RATIO_INVALIDO;
    {class} property PERCENTUAL_ALIQUOTA_COFINS_INVALIDA: Integer read _GetPERCENTUAL_ALIQUOTA_COFINS_INVALIDA;
    {class} property PERCENTUAL_ALIQUOTA_PIS_INVALIDA: Integer read _GetPERCENTUAL_ALIQUOTA_PIS_INVALIDA;
    {class} property PERMISSAO_NEGADA: Integer read _GetPERMISSAO_NEGADA;
    {class} property PINO_INVALIDO: Integer read _GetPINO_INVALIDO;
    {class} property PORTA_FECHADA: Integer read _GetPORTA_FECHADA;
    {class} property PORTA_TCP_INVALIDA: Integer read _GetPORTA_TCP_INVALIDA;
    {class} property POSICAO_INVALIDA: Integer read _GetPOSICAO_INVALIDA;
    {class} property POS_IMP_HORIZONTAL_INVALIDA: Integer read _GetPOS_IMP_HORIZONTAL_INVALIDA;
    {class} property PRINTTEXT_ATRIBUTO_INVALIDO: Integer read _GetPRINTTEXT_ATRIBUTO_INVALIDO;
    {class} property QRCODEAUTO_CODIGO_INVALIDO: Integer read _GetQRCODEAUTO_CODIGO_INVALIDO;
    {class} property QRCODEAUTO_COORDENADA_X_INVALIDA: Integer read _GetQRCODEAUTO_COORDENADA_X_INVALIDA;
    {class} property QRCODEAUTO_COORDENADA_Y_INVALIDA: Integer read _GetQRCODEAUTO_COORDENADA_Y_INVALIDA;
    {class} property QRCODEAUTO_MULTIPLICADOR_INVALIDO: Integer read _GetQRCODEAUTO_MULTIPLICADOR_INVALIDO;
    {class} property QRCODEAUTO_ROTACAO_INVALIDA: Integer read _GetQRCODEAUTO_ROTACAO_INVALIDA;
    {class} property QRCODEMANUAL_CODIGO_INVALIDO: Integer read _GetQRCODEMANUAL_CODIGO_INVALIDO;
    {class} property QRCODEMANUAL_COORDENADA_X_INVALIDA: Integer read _GetQRCODEMANUAL_COORDENADA_X_INVALIDA;
    {class} property QRCODEMANUAL_COORDENADA_Y_INVALIDA: Integer read _GetQRCODEMANUAL_COORDENADA_Y_INVALIDA;
    {class} property QRCODEMANUAL_INPUT_CONFIG_INVALIDO: Integer read _GetQRCODEMANUAL_INPUT_CONFIG_INVALIDO;
    {class} property QRCODEMANUAL_INPUT_INVALIDO: Integer read _GetQRCODEMANUAL_INPUT_INVALIDO;
    {class} property QRCODEMANUAL_MULTIPLICADOR_INVALIDO: Integer read _GetQRCODEMANUAL_MULTIPLICADOR_INVALIDO;
    {class} property QRCODEMANUAL_NUM_CHARS_8BIT_INVALIDO: Integer read _GetQRCODEMANUAL_NUM_CHARS_8BIT_INVALIDO;
    {class} property QRCODEMANUAL_NUM_MASCARA_INVALIDO: Integer read _GetQRCODEMANUAL_NUM_MASCARA_INVALIDO;
    {class} property QRCODEMANUAL_NUM_MODELO_INVALIDO: Integer read _GetQRCODEMANUAL_NUM_MODELO_INVALIDO;
    {class} property QRCODEMANUAL_NVL_COR_ERRO_INVALIDO: Integer read _GetQRCODEMANUAL_NVL_COR_ERRO_INVALIDO;
    {class} property QRCODEMANUAL_ROTACAO_INVALIDA: Integer read _GetQRCODEMANUAL_ROTACAO_INVALIDA;
    {class} property QUANTIDADE_COMERCIAL_INVALIDA: Integer read _GetQUANTIDADE_COMERCIAL_INVALIDA;
    {class} property QUANTIDADE_ELEMENTO_EXCEDIDA: Integer read _GetQUANTIDADE_ELEMENTO_EXCEDIDA;
    {class} property QUANTIDADE_FORA_INTERVALO: Integer read _GetQUANTIDADE_FORA_INTERVALO;
    {class} property QUANTIDADE_INVALIDA: Integer read _GetQUANTIDADE_INVALIDA;
    {class} property QUANTIDADE_MEIO_PAGAMENTO_EXCEDIDA: Integer read _GetQUANTIDADE_MEIO_PAGAMENTO_EXCEDIDA;
    {class} property QUANTIDADE_VENDIDA_COFINS_INVALIDA: Integer read _GetQUANTIDADE_VENDIDA_COFINS_INVALIDA;
    {class} property QUANTIDADE_VENDIDA_PIS_INVALIDA: Integer read _GetQUANTIDADE_VENDIDA_PIS_INVALIDA;
    {class} property RECONEXOES_ESGOTADAS: Integer read _GetRECONEXOES_ESGOTADAS;
    {class} property REGRA_CALCULO_INVALIDA: Integer read _GetREGRA_CALCULO_INVALIDA;
    {class} property SCALA_INVALIDA: Integer read _GetSCALA_INVALIDA;
    {class} property SERVICO_OCUPADO: Integer read _GetSERVICO_OCUPADO;
    {class} property SIGNAC_INVALIDA: Integer read _GetSIGNAC_INVALIDA;
    {class} property STATEPRINTER_QSESEMPAPEL: Integer read _GetSTATEPRINTER_QSESEMPAPEL;
    {class} property STATEPRINTER_QSESEMPAPELETAMPA: Integer read _GetSTATEPRINTER_QSESEMPAPELETAMPA;
    {class} property STATEPRINTER_SEMPAPEL: Integer read _GetSTATEPRINTER_SEMPAPEL;
    {class} property STATEPRINTER_SUCESSO: Integer read _GetSTATEPRINTER_SUCESSO;
    {class} property STATEPRINTER_TAMPAABERTA: Integer read _GetSTATEPRINTER_TAMPAABERTA;
    {class} property STATEPRINTER_TAMPAEPAPEL: Integer read _GetSTATEPRINTER_TAMPAEPAPEL;
    {class} property STATUS_NAO_SUPORTADO: Integer read _GetSTATUS_NAO_SUPORTADO;
    {class} property STILO_INVALIDO: Integer read _GetSTILO_INVALIDO;
    {class} property SUCESSO: Integer read _GetSUCESSO;
    {class} property TAMANHO_INFORMACOES_COMPLEMENTARES_INVALIDO: Integer read _GetTAMANHO_INFORMACOES_COMPLEMENTARES_INVALIDO;
    {class} property TAMANHO_INVALIDO: Integer read _GetTAMANHO_INVALIDO;
    {class} property TAMANHO_QR_INVALIDO: Integer read _GetTAMANHO_QR_INVALIDO;
    {class} property TEMPO_FORA_LIMITE: Integer read _GetTEMPO_FORA_LIMITE;
    {class} property TEMPO_INVALIDO: Integer read _GetTEMPO_INVALIDO;
    {class} property TEXTOASD_COORDENADA_X_INVALIDA: Integer read _GetTEXTOASD_COORDENADA_X_INVALIDA;
    {class} property TEXTOASD_COORDENADA_Y_INVALIDA: Integer read _GetTEXTOASD_COORDENADA_Y_INVALIDA;
    {class} property TEXTOASD_MULTIPLICADOR_HORIZONTAL_INVALIDO: Integer read _GetTEXTOASD_MULTIPLICADOR_HORIZONTAL_INVALIDO;
    {class} property TEXTOASD_MULTIPLICADOR_VERTICAL_INVALIDO: Integer read _GetTEXTOASD_MULTIPLICADOR_VERTICAL_INVALIDO;
    {class} property TEXTOASD_ROTACAO_INVALIDA: Integer read _GetTEXTOASD_ROTACAO_INVALIDA;
    {class} property TEXTOASD_TAMANHO_INVALIDO: Integer read _GetTEXTOASD_TAMANHO_INVALIDO;
    {class} property TEXTOASD_TEXTO_INVALIDO: Integer read _GetTEXTOASD_TEXTO_INVALIDO;
    {class} property TEXTOCOURIER_COORDENADA_X_INVALIDA: Integer read _GetTEXTOCOURIER_COORDENADA_X_INVALIDA;
    {class} property TEXTOCOURIER_COORDENADA_Y_INVALIDA: Integer read _GetTEXTOCOURIER_COORDENADA_Y_INVALIDA;
    {class} property TEXTOCOURIER_MULTIPLICADOR_HORIZONTAL_INVALIDO: Integer read _GetTEXTOCOURIER_MULTIPLICADOR_HORIZONTAL_INVALIDO;
    {class} property TEXTOCOURIER_MULTIPLICADOR_VERTICAL_INVALIDO: Integer read _GetTEXTOCOURIER_MULTIPLICADOR_VERTICAL_INVALIDO;
    {class} property TEXTOCOURIER_ROTACAO_INVALIDA: Integer read _GetTEXTOCOURIER_ROTACAO_INVALIDA;
    {class} property TEXTOCOURIER_SYMBOL_INVALIDO: Integer read _GetTEXTOCOURIER_SYMBOL_INVALIDO;
    {class} property TEXTOCOURIER_TEXTO_INVALIDO: Integer read _GetTEXTOCOURIER_TEXTO_INVALIDO;
    {class} property TEXTO_COORDENADA_X_INVALIDA: Integer read _GetTEXTO_COORDENADA_X_INVALIDA;
    {class} property TEXTO_COORDENADA_Y_INVALIDA: Integer read _GetTEXTO_COORDENADA_Y_INVALIDA;
    {class} property TEXTO_FONTE_INVALIDA: Integer read _GetTEXTO_FONTE_INVALIDA;
    {class} property TEXTO_MULTIPLICADOR_HORIZONTAL_INVALIDO: Integer read _GetTEXTO_MULTIPLICADOR_HORIZONTAL_INVALIDO;
    {class} property TEXTO_MULTIPLICADOR_VERTICAL_INVALIDO: Integer read _GetTEXTO_MULTIPLICADOR_VERTICAL_INVALIDO;
    {class} property TEXTO_ROTACAO_INVALIDA: Integer read _GetTEXTO_ROTACAO_INVALIDA;
    {class} property TEXTO_TEXTO_INVALIDO: Integer read _GetTEXTO_TEXTO_INVALIDO;
    {class} property THREAD_EXECUTION_EXCEPTION: Integer read _GetTHREAD_EXECUTION_EXCEPTION;
    {class} property THREAD_INTERRUPTED_EXCEPTION: Integer read _GetTHREAD_INTERRUPTED_EXCEPTION;
    {class} property TIPO_EMISSAO_INDEFINIDA: Integer read _GetTIPO_EMISSAO_INDEFINIDA;
    {class} property TIPO_INVALIDO: Integer read _GetTIPO_INVALIDO;
    {class} property TIPO_PARAMETRO_INVALIDO: Integer read _GetTIPO_PARAMETRO_INVALIDO;
    {class} property UF_INVALIDO: Integer read _GetUF_INVALIDO;
    {class} property UNIDADE_COMERCIAL_INVALIDA: Integer read _GetUNIDADE_COMERCIAL_INVALIDA;
    {class} property VALOR_ACRESCIMO_INVALIDO: Integer read _GetVALOR_ACRESCIMO_INVALIDO;
    {class} property VALOR_ACRESCIMO_SUBTOTAL_INVALIDO: Integer read _GetVALOR_ACRESCIMO_SUBTOTAL_INVALIDO;
    {class} property VALOR_ALIQUOTA_COFINS_INVALIDA: Integer read _GetVALOR_ALIQUOTA_COFINS_INVALIDA;
    {class} property VALOR_ALIQUOTA_PIS_INVALIDA: Integer read _GetVALOR_ALIQUOTA_PIS_INVALIDA;
    {class} property VALOR_DEDUCOES_ISSQN_INVALIDA: Integer read _GetVALOR_DEDUCOES_ISSQN_INVALIDA;
    {class} property VALOR_DESCONTO_INVALIDO: Integer read _GetVALOR_DESCONTO_INVALIDO;
    {class} property VALOR_DESCONTO_SUBTOTAL_INVALIDO: Integer read _GetVALOR_DESCONTO_SUBTOTAL_INVALIDO;
    {class} property VALOR_MEIO_PAGAMENTO_INVALIDO: Integer read _GetVALOR_MEIO_PAGAMENTO_INVALIDO;
    {class} property VALOR_UNITARIO_INVALIDO: Integer read _GetVALOR_UNITARIO_INVALIDO;
    {class} property VALOR_VCFELEI12741_INVALIDO: Integer read _GetVALOR_VCFELEI12741_INVALIDO;
    {class} property VERSAO_DADOS_ENT_INVALIDO: Integer read _GetVERSAO_DADOS_ENT_INVALIDO;
    {class} property VERSAO_XMLNFCE_INDEFINIDA: Integer read _GetVERSAO_XMLNFCE_INDEFINIDA;
    {class} property VERSAO_XMLNFCE_NAO_SUPORTADA: Integer read _GetVERSAO_XMLNFCE_NAO_SUPORTADA;
    {class} property VITEM12741_INVALIDO: Integer read _GetVITEM12741_INVALIDO;
    {class} property WIDTH_INVALIDO: Integer read _GetWIDTH_INVALIDO;
    {class} property XSD_NAO_ENCONTRADO: Integer read _GetXSD_NAO_ENCONTRADO;
    {class} property __ERRO_AO_CARREGAR_DLL_IMPRESSORA: JString read _Get__ERRO_AO_CARREGAR_DLL_IMPRESSORA;
    {class} property __ERRO_AO_CARREGAR_DLL_SAT: JString read _Get__ERRO_AO_CARREGAR_DLL_SAT;
    {class} property __ERRO_AO_VALIDAR_DLL_SAL: JString read _Get__ERRO_AO_VALIDAR_DLL_SAL;
    {class} property __ERRO_CANCELAR_VENDA_SAT: JString read _Get__ERRO_CANCELAR_VENDA_SAT;
    {class} property __SUCESSO: JString read _Get__SUCESSO;
  end;

  [JavaSignature('com/elgin/e1/Impressora/Utilidades/CodigoErro')]
  JCodigoErro = interface(JObject)
    ['{46A186A2-C83C-43F1-8741-2751021C8D00}']
  end;
  TJCodigoErro = class(TJavaGenericImport<JCodigoErroClass, JCodigoErro>) end;

  JESCPOSClass = interface(JObjectClass)
    ['{0B2CBE67-DCEB-4194-BCDE-5AED924A6177}']
    {class} function _GetABRE_GAVETA: TJavaArray<Byte>; cdecl;
    {class} function _GetABRE_GAVETA_ELGIN: TJavaArray<Byte>; cdecl;
    {class} function _GetALTURA_CODIGO_BARRAS: TJavaArray<Byte>; cdecl;
    {class} function _GetAVANCA_PAPEL: TJavaArray<Byte>; cdecl;
    {class} function _GetCANC_DATA_MODO_PAGINA: TJavaArray<Byte>; cdecl;
    {class} function _GetCANC_MINIFONT: TJavaArray<Byte>; cdecl;
    {class} function _GetCANC_NEGRITO: TJavaArray<Byte>; cdecl;
    {class} function _GetCANC_SUBLINHADO: TJavaArray<Byte>; cdecl;
    {class} function _GetCODE_PAGE: TJavaArray<Byte>; cdecl;
    {class} function _GetCORTE_PARCIAL: TJavaArray<Byte>; cdecl;
    {class} function _GetCORTE_TOTAL: TJavaArray<Byte>; cdecl;
    {class} function _GetDEF_AREA_IMPRESSAO: TJavaArray<Byte>; cdecl;
    {class} function _GetDEF_POS_HORIZONTAL_MODO_PAGINA: TJavaArray<Byte>; cdecl;
    {class} function _GetDEF_POS_VERTICAL_MODO_PAGINA: TJavaArray<Byte>; cdecl;
    {class} function _GetDESABILITA_INVERSO: TJavaArray<Byte>; cdecl;
    {class} function _GetDES_STATUSASB: TJavaArray<Byte>; cdecl;
    {class} function _GetDES_STATUSASB_BKT: TJavaArray<Byte>; cdecl;
    {class} function _GetERROR_CORRECTION_LEVEL: TJavaArray<Byte>; cdecl;
    {class} function _GetESPACAMENTO_ENTRE_LINHA: TJavaArray<Byte>; cdecl;
    {class} function _GetHEIGHT: TJavaArray<Byte>; cdecl;
    {class} function _GetHRI_CODIGO_BARRAS: TJavaArray<Byte>; cdecl;
    {class} function _GetHRI_CODIGO_BARRAS_DARUMA: TJavaArray<Byte>; cdecl;
    {class} function _GetIMPRIME_INFO_MODO_PAGINA: TJavaArray<Byte>; cdecl;
    {class} function _GetIMPRIME_INFO_MODO_PAGINA_RET_MODO_PADRAO: TJavaArray<Byte>; cdecl;
    {class} function _GetIMPRIME_QRCODE: TJavaArray<Byte>; cdecl;
    {class} function _GetIMPRIME_QRCODE_BEMA: TJavaArray<Byte>; cdecl;
    {class} function _GetIMPRIME_QRCODE_BKT: TJavaArray<Byte>; cdecl;
    {class} function _GetINICIALIZAR: TJavaArray<Byte>; cdecl;
    {class} function _GetImprimeImage: TJavaArray<Byte>; cdecl;
    {class} function _GetJUSTIFICATIVA_TEXTO: TJavaArray<Byte>; cdecl;
    {class} function _GetLARGURA_CODIGO_BARRAS: TJavaArray<Byte>; cdecl;
    {class} function _GetLIMPA_BUFFER_MODO_PAGINA: TJavaArray<Byte>; cdecl;
    {class} function _GetMINIFONT: TJavaArray<Byte>; cdecl;
    {class} function _GetMODO_INVERSO: TJavaArray<Byte>; cdecl;
    {class} function _GetMODO_PADRAO: TJavaArray<Byte>; cdecl;
    {class} function _GetNEGRITO: TJavaArray<Byte>; cdecl;
    {class} function _GetNIVEL_CORRECAO: TJavaArray<Byte>; cdecl;
    {class} function _GetNUMBER_COLUMNS: TJavaArray<Byte>; cdecl;
    {class} function _GetNUMBER_ROWS: TJavaArray<Byte>; cdecl;
    {class} function _GetOPTIONS: TJavaArray<Byte>; cdecl;
    {class} function _GetPOS_IMP_HORIZONTAL: TJavaArray<Byte>; cdecl;
    {class} function _GetPRINT_PDF417: TJavaArray<Byte>; cdecl;
    {class} function _GetSEL_DIRECAO_MODO_PAGINA_BC_IE: TJavaArray<Byte>; cdecl;
    {class} function _GetSEL_DIRECAO_MODO_PAGINA_CB_SD: TJavaArray<Byte>; cdecl;
    {class} function _GetSEL_DIRECAO_MODO_PAGINA_DE_ID: TJavaArray<Byte>; cdecl;
    {class} function _GetSEL_DIRECAO_MODO_PAGINA_ED_SE: TJavaArray<Byte>; cdecl;
    {class} function _GetSEL_MODO_PADRAO: TJavaArray<Byte>; cdecl;
    {class} function _GetSEL_MODO_PAGINA: TJavaArray<Byte>; cdecl;
    {class} function _GetSEL_MODO_PAGINA_BKT: TJavaArray<Byte>; cdecl;
    {class} function _GetSINAL_SONORO: TJavaArray<Byte>; cdecl;
    {class} function _GetSTATUS: TJavaArray<Byte>; cdecl;
    {class} function _GetSUBLINHADO: TJavaArray<Byte>; cdecl;
    {class} function _GetTAMANHO_QRCODE: TJavaArray<Byte>; cdecl;
    {class} function _GetTAMANHO_QRCODE_BKT: TJavaArray<Byte>; cdecl;
    {class} function _GetTAMANHO_TEXTO: TJavaArray<Byte>; cdecl;
    {class} function _GetWIDTH: TJavaArray<Byte>; cdecl;
    {class} function init: JESCPOS; cdecl;
    {class} property ABRE_GAVETA: TJavaArray<Byte> read _GetABRE_GAVETA;
    {class} property ABRE_GAVETA_ELGIN: TJavaArray<Byte> read _GetABRE_GAVETA_ELGIN;
    {class} property ALTURA_CODIGO_BARRAS: TJavaArray<Byte> read _GetALTURA_CODIGO_BARRAS;
    {class} property AVANCA_PAPEL: TJavaArray<Byte> read _GetAVANCA_PAPEL;
    {class} property CANC_DATA_MODO_PAGINA: TJavaArray<Byte> read _GetCANC_DATA_MODO_PAGINA;
    {class} property CANC_MINIFONT: TJavaArray<Byte> read _GetCANC_MINIFONT;
    {class} property CANC_NEGRITO: TJavaArray<Byte> read _GetCANC_NEGRITO;
    {class} property CANC_SUBLINHADO: TJavaArray<Byte> read _GetCANC_SUBLINHADO;
    {class} property CODE_PAGE: TJavaArray<Byte> read _GetCODE_PAGE;
    {class} property CORTE_PARCIAL: TJavaArray<Byte> read _GetCORTE_PARCIAL;
    {class} property CORTE_TOTAL: TJavaArray<Byte> read _GetCORTE_TOTAL;
    {class} property DEF_AREA_IMPRESSAO: TJavaArray<Byte> read _GetDEF_AREA_IMPRESSAO;
    {class} property DEF_POS_HORIZONTAL_MODO_PAGINA: TJavaArray<Byte> read _GetDEF_POS_HORIZONTAL_MODO_PAGINA;
    {class} property DEF_POS_VERTICAL_MODO_PAGINA: TJavaArray<Byte> read _GetDEF_POS_VERTICAL_MODO_PAGINA;
    {class} property DESABILITA_INVERSO: TJavaArray<Byte> read _GetDESABILITA_INVERSO;
    {class} property DES_STATUSASB: TJavaArray<Byte> read _GetDES_STATUSASB;
    {class} property DES_STATUSASB_BKT: TJavaArray<Byte> read _GetDES_STATUSASB_BKT;
    {class} property ERROR_CORRECTION_LEVEL: TJavaArray<Byte> read _GetERROR_CORRECTION_LEVEL;
    {class} property ESPACAMENTO_ENTRE_LINHA: TJavaArray<Byte> read _GetESPACAMENTO_ENTRE_LINHA;
    {class} property HEIGHT: TJavaArray<Byte> read _GetHEIGHT;
    {class} property HRI_CODIGO_BARRAS: TJavaArray<Byte> read _GetHRI_CODIGO_BARRAS;
    {class} property HRI_CODIGO_BARRAS_DARUMA: TJavaArray<Byte> read _GetHRI_CODIGO_BARRAS_DARUMA;
    {class} property IMPRIME_INFO_MODO_PAGINA: TJavaArray<Byte> read _GetIMPRIME_INFO_MODO_PAGINA;
    {class} property IMPRIME_INFO_MODO_PAGINA_RET_MODO_PADRAO: TJavaArray<Byte> read _GetIMPRIME_INFO_MODO_PAGINA_RET_MODO_PADRAO;
    {class} property IMPRIME_QRCODE: TJavaArray<Byte> read _GetIMPRIME_QRCODE;
    {class} property IMPRIME_QRCODE_BEMA: TJavaArray<Byte> read _GetIMPRIME_QRCODE_BEMA;
    {class} property IMPRIME_QRCODE_BKT: TJavaArray<Byte> read _GetIMPRIME_QRCODE_BKT;
    {class} property INICIALIZAR: TJavaArray<Byte> read _GetINICIALIZAR;
    {class} property ImprimeImage: TJavaArray<Byte> read _GetImprimeImage;
    {class} property JUSTIFICATIVA_TEXTO: TJavaArray<Byte> read _GetJUSTIFICATIVA_TEXTO;
    {class} property LARGURA_CODIGO_BARRAS: TJavaArray<Byte> read _GetLARGURA_CODIGO_BARRAS;
    {class} property LIMPA_BUFFER_MODO_PAGINA: TJavaArray<Byte> read _GetLIMPA_BUFFER_MODO_PAGINA;
    {class} property MINIFONT: TJavaArray<Byte> read _GetMINIFONT;
    {class} property MODO_INVERSO: TJavaArray<Byte> read _GetMODO_INVERSO;
    {class} property MODO_PADRAO: TJavaArray<Byte> read _GetMODO_PADRAO;
    {class} property NEGRITO: TJavaArray<Byte> read _GetNEGRITO;
    {class} property NIVEL_CORRECAO: TJavaArray<Byte> read _GetNIVEL_CORRECAO;
    {class} property NUMBER_COLUMNS: TJavaArray<Byte> read _GetNUMBER_COLUMNS;
    {class} property NUMBER_ROWS: TJavaArray<Byte> read _GetNUMBER_ROWS;
    {class} property OPTIONS: TJavaArray<Byte> read _GetOPTIONS;
    {class} property POS_IMP_HORIZONTAL: TJavaArray<Byte> read _GetPOS_IMP_HORIZONTAL;
    {class} property PRINT_PDF417: TJavaArray<Byte> read _GetPRINT_PDF417;
    {class} property SEL_DIRECAO_MODO_PAGINA_BC_IE: TJavaArray<Byte> read _GetSEL_DIRECAO_MODO_PAGINA_BC_IE;
    {class} property SEL_DIRECAO_MODO_PAGINA_CB_SD: TJavaArray<Byte> read _GetSEL_DIRECAO_MODO_PAGINA_CB_SD;
    {class} property SEL_DIRECAO_MODO_PAGINA_DE_ID: TJavaArray<Byte> read _GetSEL_DIRECAO_MODO_PAGINA_DE_ID;
    {class} property SEL_DIRECAO_MODO_PAGINA_ED_SE: TJavaArray<Byte> read _GetSEL_DIRECAO_MODO_PAGINA_ED_SE;
    {class} property SEL_MODO_PADRAO: TJavaArray<Byte> read _GetSEL_MODO_PADRAO;
    {class} property SEL_MODO_PAGINA: TJavaArray<Byte> read _GetSEL_MODO_PAGINA;
    {class} property SEL_MODO_PAGINA_BKT: TJavaArray<Byte> read _GetSEL_MODO_PAGINA_BKT;
    {class} property SINAL_SONORO: TJavaArray<Byte> read _GetSINAL_SONORO;
    {class} property STATUS: TJavaArray<Byte> read _GetSTATUS;
    {class} property SUBLINHADO: TJavaArray<Byte> read _GetSUBLINHADO;
    {class} property TAMANHO_QRCODE: TJavaArray<Byte> read _GetTAMANHO_QRCODE;
    {class} property TAMANHO_QRCODE_BKT: TJavaArray<Byte> read _GetTAMANHO_QRCODE_BKT;
    {class} property TAMANHO_TEXTO: TJavaArray<Byte> read _GetTAMANHO_TEXTO;
    {class} property WIDTH: TJavaArray<Byte> read _GetWIDTH;
  end;

  [JavaSignature('com/elgin/e1/Impressora/Utilidades/ESCPOS')]
  JESCPOS = interface(JObject)
    ['{8CFEC99B-D2EB-45E5-B83B-BAC62DDE0CE4}']
  end;
  TJESCPOS = class(TJavaGenericImport<JESCPOSClass, JESCPOS>) end;

  JInteiroClass = interface(JObjectClass)
    ['{2AFDACD6-3EE1-4ECD-A20F-C92D183BACF1}']
    {class} function getValor: Integer; cdecl;//Deprecated
    {class} function init: JInteiro; cdecl; overload;//Deprecated
    {class} function init(P1: Integer): JInteiro; cdecl; overload;//Deprecated
    {class} procedure setValor(P1: Integer); cdecl;//Deprecated
    {class} function toString: JString; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Utilidades/Inteiro')]
  JInteiro = interface(JObject)
    ['{7D6273A6-700F-44EE-95C0-26FB117BA13B}']
  end;
  TJInteiro = class(TJavaGenericImport<JInteiroClass, JInteiro>) end;

  JPPLAClass = interface(JObjectClass)
    ['{13488D70-2150-4A23-854B-7C8A2A8DB0B3}']
    {class} function _GetALTURA_GAP: TJavaArray<Byte>; cdecl;
    {class} function _GetBACKFEED: TJavaArray<Byte>; cdecl;
    {class} function _GetBAUDRATE: TJavaArray<Byte>; cdecl;
    {class} function _GetCALOR: TJavaArray<Byte>; cdecl;
    {class} function _GetCR: TJavaArray<Byte>; cdecl;
    {class} function _GetDISABLE: TJavaArray<Byte>; cdecl;
    {class} function _GetENVIA_IMAGEM: TJavaArray<Byte>; cdecl;
    {class} function _GetESC: TJavaArray<Byte>; cdecl;
    {class} function _GetEXCLUI_IMAGEM: TJavaArray<Byte>; cdecl;
    {class} function _GetEXIT: TJavaArray<Byte>; cdecl;
    {class} function _GetFEED: TJavaArray<Byte>; cdecl;
    {class} function _GetLABEL: TJavaArray<Byte>; cdecl;
    {class} function _GetLENGTH: TJavaArray<Byte>; cdecl;
    {class} function _GetLF: TJavaArray<Byte>; cdecl;
    {class} function _GetLIMPA_MEMORIA: TJavaArray<Byte>; cdecl;
    {class} function _GetLIMPA_MODULO: TJavaArray<Byte>; cdecl;
    {class} function _GetLOGIC_IMG_MODE: TJavaArray<Byte>; cdecl;
    {class} function _GetMEMORY_STATUS: TJavaArray<Byte>; cdecl;
    {class} function _GetMIRROR: TJavaArray<Byte>; cdecl;
    {class} function _GetMODO_CONTINUO: TJavaArray<Byte>; cdecl;
    {class} function _GetNAO_CORTAR_ZERO: TJavaArray<Byte>; cdecl;
    {class} function _GetOFFSET_COLUNA: TJavaArray<Byte>; cdecl;
    {class} function _GetOFFSET_LINHA: TJavaArray<Byte>; cdecl;
    {class} function _GetPRINT_ST_POS: TJavaArray<Byte>; cdecl;
    {class} function _GetQTDE: TJavaArray<Byte>; cdecl;
    {class} function _GetRESET: TJavaArray<Byte>; cdecl;
    {class} function _GetSENSOR_REFLEXIVO: TJavaArray<Byte>; cdecl;
    {class} function _GetSENSOR_TRANSMISSIVO: TJavaArray<Byte>; cdecl;
    {class} function _GetSOH: TJavaArray<Byte>; cdecl;
    {class} function _GetSTATUS: TJavaArray<Byte>; cdecl;
    {class} function _GetSTATUS_EPL: TJavaArray<Byte>; cdecl;
    {class} function _GetSTX: TJavaArray<Byte>; cdecl;
    {class} function _GetSYMBOL_ASD: TJavaArray<Byte>; cdecl;
    {class} function _GetTAM_PIXEL: TJavaArray<Byte>; cdecl;
    {class} function _GetTESTE: TJavaArray<Byte>; cdecl;
    {class} function _GetTIPO_TRANSFERENCIA: TJavaArray<Byte>; cdecl;
    {class} function _GetUSAR_IMPERIAL: TJavaArray<Byte>; cdecl;
    {class} function _GetUSAR_METRICO: TJavaArray<Byte>; cdecl;
    {class} function _GetVEL_IMPRESSAO: TJavaArray<Byte>; cdecl;
    {class} function init: JPPLA; cdecl;
    {class} property ALTURA_GAP: TJavaArray<Byte> read _GetALTURA_GAP;
    {class} property BACKFEED: TJavaArray<Byte> read _GetBACKFEED;
    {class} property BAUDRATE: TJavaArray<Byte> read _GetBAUDRATE;
    {class} property CALOR: TJavaArray<Byte> read _GetCALOR;
    {class} property CR: TJavaArray<Byte> read _GetCR;
    {class} property DISABLE: TJavaArray<Byte> read _GetDISABLE;
    {class} property ENVIA_IMAGEM: TJavaArray<Byte> read _GetENVIA_IMAGEM;
    {class} property ESC: TJavaArray<Byte> read _GetESC;
    {class} property EXCLUI_IMAGEM: TJavaArray<Byte> read _GetEXCLUI_IMAGEM;
    {class} property EXIT: TJavaArray<Byte> read _GetEXIT;
    {class} property FEED: TJavaArray<Byte> read _GetFEED;
    {class} property &LABEL: TJavaArray<Byte> read _GetLABEL;
    {class} property LENGTH: TJavaArray<Byte> read _GetLENGTH;
    {class} property LF: TJavaArray<Byte> read _GetLF;
    {class} property LIMPA_MEMORIA: TJavaArray<Byte> read _GetLIMPA_MEMORIA;
    {class} property LIMPA_MODULO: TJavaArray<Byte> read _GetLIMPA_MODULO;
    {class} property LOGIC_IMG_MODE: TJavaArray<Byte> read _GetLOGIC_IMG_MODE;
    {class} property MEMORY_STATUS: TJavaArray<Byte> read _GetMEMORY_STATUS;
    {class} property MIRROR: TJavaArray<Byte> read _GetMIRROR;
    {class} property MODO_CONTINUO: TJavaArray<Byte> read _GetMODO_CONTINUO;
    {class} property NAO_CORTAR_ZERO: TJavaArray<Byte> read _GetNAO_CORTAR_ZERO;
    {class} property OFFSET_COLUNA: TJavaArray<Byte> read _GetOFFSET_COLUNA;
    {class} property OFFSET_LINHA: TJavaArray<Byte> read _GetOFFSET_LINHA;
    {class} property PRINT_ST_POS: TJavaArray<Byte> read _GetPRINT_ST_POS;
    {class} property QTDE: TJavaArray<Byte> read _GetQTDE;
    {class} property RESET: TJavaArray<Byte> read _GetRESET;
    {class} property SENSOR_REFLEXIVO: TJavaArray<Byte> read _GetSENSOR_REFLEXIVO;
    {class} property SENSOR_TRANSMISSIVO: TJavaArray<Byte> read _GetSENSOR_TRANSMISSIVO;
    {class} property SOH: TJavaArray<Byte> read _GetSOH;
    {class} property STATUS: TJavaArray<Byte> read _GetSTATUS;
    {class} property STATUS_EPL: TJavaArray<Byte> read _GetSTATUS_EPL;
    {class} property STX: TJavaArray<Byte> read _GetSTX;
    {class} property SYMBOL_ASD: TJavaArray<Byte> read _GetSYMBOL_ASD;
    {class} property TAM_PIXEL: TJavaArray<Byte> read _GetTAM_PIXEL;
    {class} property TESTE: TJavaArray<Byte> read _GetTESTE;
    {class} property TIPO_TRANSFERENCIA: TJavaArray<Byte> read _GetTIPO_TRANSFERENCIA;
    {class} property USAR_IMPERIAL: TJavaArray<Byte> read _GetUSAR_IMPERIAL;
    {class} property USAR_METRICO: TJavaArray<Byte> read _GetUSAR_METRICO;
    {class} property VEL_IMPRESSAO: TJavaArray<Byte> read _GetVEL_IMPRESSAO;
  end;

  [JavaSignature('com/elgin/e1/Impressora/Utilidades/PPLA')]
  JPPLA = interface(JObject)
    ['{2F7C1937-9F27-44BC-B021-B020D4670885}']
  end;
  TJPPLA = class(TJavaGenericImport<JPPLAClass, JPPLA>) end;

  JUtilidadesClass = interface(JObjectClass)
    ['{59024CEE-4D3A-4D8A-A32D-08F7FFCD0F3B}']
    {class} function appendChild(P1: JNode; P2: JNode): JNode; cdecl;//Deprecated
    {class} function arg1(P1: JString; P2: Integer; P3: Char): JString; cdecl;//Deprecated
    {class} function array2bytes(P1: Boolean; P2: JArrayList): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function attribute(P1: JNode; P2: JString): JString; cdecl;//Deprecated
    {class} function doc2string(P1: JDocument): JString; cdecl;//Deprecated
    {class} function elementsByTagName(P1: JNode; P2: JString): JNodeList; cdecl;//Deprecated
    {class} function getInt(P1: JString): Integer; cdecl;//Deprecated
    {class} function init: JUtilidades; cdecl;//Deprecated
    {class} function insert(P1: JString; P2: Integer; P3: JString): JString; cdecl;//Deprecated
    {class} function insertAfter(P1: JNode; P2: JNode; P3: JNode): JNode; cdecl;//Deprecated
    {class} function insertBefore(P1: JNode; P2: JNode; P3: JNode): JNode; cdecl;//Deprecated
    {class} function intToBits(P1: Integer): JBitSet; cdecl;//Deprecated
    {class} function larg2px(P1: Integer; P2: JString): Integer; cdecl;//Deprecated
    {class} function left(P1: JString; P2: Integer): JString; cdecl;//Deprecated
    {class} function leftJustified(P1: JString; P2: Integer; P3: Char; P4: Boolean): JString; cdecl;//Deprecated
    {class} function mid(P1: JString; P2: Integer; P3: Integer): JString; cdecl;//Deprecated
    {class} function namedItem(P1: JNode; P2: JString; P3: Boolean): JNode; cdecl;//Deprecated
    {class} function newDocument: JDocument; cdecl;//Deprecated
    {class} function numFmt(P1: Double): JString; cdecl;//Deprecated
    {class} function prepend(P1: JString; P2: JString): JString; cdecl;//Deprecated
    {class} function removeChild(P1: JNode; P2: JNode): JNode; cdecl;//Deprecated
    {class} function replaceChild(P1: JNode; P2: JNode; P3: JNode): JNode; cdecl;//Deprecated
    {class} function right(P1: JString; P2: Integer): JString; cdecl;//Deprecated
    {class} function rightJustified(P1: JString; P2: Integer; P3: Char; P4: Boolean): JString; cdecl;//Deprecated
    {class} function tam2px(P1: Integer; P2: JString): Integer; cdecl;//Deprecated
    {class} function toHex(P1: TJavaArray<Byte>; P2: Boolean): JString; cdecl;//Deprecated
    {class} function trimBitmap(P1: JBitmap; P2: Integer): JBitmap; cdecl;//Deprecated
    {class} function truncate(P1: JString; P2: Integer): JString; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Utilidades/Utilidades')]
  JUtilidades = interface(JObject)
    ['{C0960CDD-0051-4455-ADED-A560FE3FB806}']
  end;
  TJUtilidades = class(TJavaGenericImport<JUtilidadesClass, JUtilidades>) end;

  JNodeListClass = interface(IJavaClass)
    ['{6F6D0FED-4199-4F79-ABA2-C93007B65A8C}']
  end;

  [JavaSignature('org/w3c/dom/NodeList')]
  JNodeList = interface(IJavaInstance)
    ['{E6AE0711-1F43-4D8B-A153-47286455EFAF}']
    function getLength: Integer; cdecl;
    function item(index: Integer): JNode; cdecl;
  end;
  TJNodeList = class(TJavaGenericImport<JNodeListClass, JNodeList>) end;

  JUtilidades_1Class = interface(JNodeListClass)
    ['{BFCD6616-3DF5-49F0-BDF3-BD20B58C98B1}']
    {class} function getLength: Integer; cdecl;//Deprecated
    {class} function item(P1: Integer): JNode; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/Utilidades/Utilidades$1')]
  JUtilidades_1 = interface(JNodeList)
    ['{695A9DBD-AD5F-48D0-998D-F966EE4592B7}']
  end;
  TJUtilidades_1 = class(TJavaGenericImport<JUtilidades_1Class, JUtilidades_1>) end;

  JInterfaceOBJXMLPRODUTOClass = interface(IJavaClass)
    ['{08C46EEA-209F-4720-BD9E-8E91E15615B8}']
    {class} function GetCodProduto: JString; cdecl;//Deprecated
    {class} function GetDescricao: JString; cdecl;//Deprecated
    {class} function GetNItem: JString; cdecl;//Deprecated
    {class} function GetQTD: JString; cdecl;//Deprecated
    {class} function GetUnidadeMed: JString; cdecl;//Deprecated
    {class} function GetVDesc: JString; cdecl;//Deprecated
    {class} function GetVDescProd: JString; cdecl;//Deprecated
    {class} function GetVOutros: JString; cdecl;//Deprecated
    {class} function GetVOutrosProd: JString; cdecl;//Deprecated
    {class} function GetValorBrutoProduto: JString; cdecl;//Deprecated
    {class} function GetValorUnit: JString; cdecl;//Deprecated
    {class} procedure SetCodProduto(P1: JString); cdecl;//Deprecated
    {class} procedure SetDescricao(P1: JString); cdecl;//Deprecated
    {class} procedure SetNItem(P1: JString); cdecl;//Deprecated
    {class} procedure SetQTD(P1: JString); cdecl;//Deprecated
    {class} procedure SetUnidadeMed(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDesc(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDescProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetVOutros(P1: JString); cdecl;//Deprecated
    {class} procedure SetVOutrosProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetValorBrutoProduto(P1: JString); cdecl;//Deprecated
    {class} procedure SetValorUnit(P1: JString); cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/InterfaceOBJXMLPRODUTO')]
  JInterfaceOBJXMLPRODUTO = interface(IJavaInstance)
    ['{D8466476-EA39-4BC0-83E6-89FCA01D4BD8}']
  end;
  TJInterfaceOBJXMLPRODUTO = class(TJavaGenericImport<JInterfaceOBJXMLPRODUTOClass, JInterfaceOBJXMLPRODUTO>) end;

  JImplementacaoOBJXMLPRODUTOClass = interface(JInterfaceOBJXMLPRODUTOClass)
    ['{4E0B1CFF-E9DF-49FC-83C1-3927D36AE87A}']
    {class} function GetCodProduto: JString; cdecl;//Deprecated
    {class} function GetDescricao: JString; cdecl;//Deprecated
    {class} function GetNItem: JString; cdecl;//Deprecated
    {class} function GetQTD: JString; cdecl;//Deprecated
    {class} function GetUnidadeMed: JString; cdecl;//Deprecated
    {class} function GetVDesc: JString; cdecl;//Deprecated
    {class} function GetVDescProd: JString; cdecl;//Deprecated
    {class} function GetVOutros: JString; cdecl;//Deprecated
    {class} function GetVOutrosProd: JString; cdecl;//Deprecated
    {class} function GetValorBrutoProduto: JString; cdecl;//Deprecated
    {class} function GetValorUnit: JString; cdecl;//Deprecated
    {class} procedure SetCodProduto(P1: JString); cdecl;//Deprecated
    {class} procedure SetDescricao(P1: JString); cdecl;//Deprecated
    {class} procedure SetNItem(P1: JString); cdecl;//Deprecated
    {class} procedure SetQTD(P1: JString); cdecl;//Deprecated
    {class} procedure SetUnidadeMed(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDesc(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDescProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetVOutros(P1: JString); cdecl;//Deprecated
    {class} procedure SetVOutrosProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetValorBrutoProduto(P1: JString); cdecl;//Deprecated
    {class} procedure SetValorUnit(P1: JString); cdecl;//Deprecated
    {class} function init: JImplementacaoOBJXMLPRODUTO; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/ImplementacaoOBJXMLPRODUTO')]
  JImplementacaoOBJXMLPRODUTO = interface(JInterfaceOBJXMLPRODUTO)
    ['{04FD195C-7A22-4F26-89B3-DA7211AB755D}']
  end;
  TJImplementacaoOBJXMLPRODUTO = class(TJavaGenericImport<JImplementacaoOBJXMLPRODUTOClass, JImplementacaoOBJXMLPRODUTO>) end;

  JImplementacaoOBJPRODUTOXMLNFCEClass = interface(JImplementacaoOBJXMLPRODUTOClass)
    ['{EE918C63-75C9-440E-8E0F-DB61EC4AAD72}']
    {class} function GetEAN13: JString; cdecl;//Deprecated
    {class} procedure SetEAN13(P1: JString); cdecl;//Deprecated
    {class} function init: JImplementacaoOBJPRODUTOXMLNFCE; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/ImplementacaoOBJPRODUTOXMLNFCE')]
  JImplementacaoOBJPRODUTOXMLNFCE = interface(JImplementacaoOBJXMLPRODUTO)
    ['{4A86ACFD-2FFE-488B-9135-F5DA6B9DCC44}']
  end;
  TJImplementacaoOBJPRODUTOXMLNFCE = class(TJavaGenericImport<JImplementacaoOBJPRODUTOXMLNFCEClass, JImplementacaoOBJPRODUTOXMLNFCE>) end;

  JImplementacaoOBJPRODUTOXMLSATClass = interface(JImplementacaoOBJXMLPRODUTOClass)
    ['{EF05D65A-0B47-40E4-A0F1-5C459C5597E0}']
    {class} function GetVBC: JString; cdecl;//Deprecated
    {class} function GetVDeducISSQN: JString; cdecl;//Deprecated
    {class} function GetVDescProd: JString; cdecl;//Deprecated
    {class} function GetVOutrasProd: JString; cdecl;//Deprecated
    {class} function GetVRatAcr: JString; cdecl;//Deprecated
    {class} function GetVRatDesc: JString; cdecl;//Deprecated
    {class} function GetValorAproxTributos: JString; cdecl;//Deprecated
    {class} procedure SetVBC(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDeducISSQN(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDescProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetVOutrasProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetVRatAcr(P1: JString); cdecl;//Deprecated
    {class} procedure SetVRatDesc(P1: JString); cdecl;//Deprecated
    {class} procedure SetValorAproxTributos(P1: JString); cdecl;//Deprecated
    {class} function init: JImplementacaoOBJPRODUTOXMLSAT; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/ImplementacaoOBJPRODUTOXMLSAT')]
  JImplementacaoOBJPRODUTOXMLSAT = interface(JImplementacaoOBJXMLPRODUTO)
    ['{13B032B2-740E-48D0-AD73-94CD353EDC16}']
  end;
  TJImplementacaoOBJPRODUTOXMLSAT = class(TJavaGenericImport<JImplementacaoOBJPRODUTOXMLSATClass, JImplementacaoOBJPRODUTOXMLSAT>) end;

  JInterfaceOBJXMLClass = interface(IJavaClass)
    ['{EEFC5284-7C02-40BE-9399-B1BCB687133A}']
    {class} function ConverterQString(P1: JString): TJavaArray<Char>; cdecl;//Deprecated
    {class} function FormatarData(P1: JString): TJavaArray<Char>; cdecl;//Deprecated
    {class} function FormatarDataSAT(P1: JString): TJavaArray<Char>; cdecl;//Deprecated
    {class} function FormatarMoeda(P1: JString): JString; cdecl;//Deprecated
    {class} function GetStatusXML: JString; cdecl;//Deprecated
    {class} function ObtemUF(P1: Integer): JString; cdecl;//Deprecated
    {class} procedure SetStatusXML(P1: JString); cdecl;//Deprecated
    {class} function getList(P1: JString): JNodeList; cdecl;//Deprecated
    {class} function getProp(P1: JString): JString; cdecl;//Deprecated
    {class} function getValue(P1: JString): JString; cdecl;//Deprecated
    {class} procedure imprimirLogo(P1: JString; P2: Integer; P3: JConexao; P4: JImplementacaoTermica); cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/InterfaceOBJXML')]
  JInterfaceOBJXML = interface(IJavaInstance)
    ['{BCF39669-6D9E-4591-80C8-35DD20FFCAE3}']
  end;
  TJInterfaceOBJXML = class(TJavaGenericImport<JInterfaceOBJXMLClass, JInterfaceOBJXML>) end;

  JImplementacaoOBJXMLClass = interface(JInterfaceOBJXMLClass)
    ['{94DEC02D-A0A4-4A80-AB1A-B69BC8181813}']
    {class} function _Getcon: JConexao; cdecl;
    {class} function init(P1: TJavaArray<Byte>): JImplementacaoOBJXML; cdecl;
    {class} property con: JConexao read _Getcon;
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/ImplementacaoOBJXML')]
  JImplementacaoOBJXML = interface(JInterfaceOBJXML)
    ['{4B8499BD-C7E3-470E-A7E6-6960F813E189}']
    function _Getib: JImplementacaoBematech; cdecl;
    function ConverterQString(P1: JString): TJavaArray<Char>; cdecl;
    function FormatarData(P1: JString): TJavaArray<Char>; cdecl;
    function FormatarDataSAT(P1: JString): TJavaArray<Char>; cdecl;
    function FormatarMoeda(P1: JString): JString; cdecl;
    function GetStatusXML: JString; cdecl;
    function ObtemUF(P1: Integer): JString; cdecl;
    procedure SetStatusXML(P1: JString); cdecl;
    function getList(P1: JString): JNodeList; cdecl;
    function getProp(P1: JString): JString; cdecl;
    function getValue(P1: JString): JString; cdecl;
    procedure imprimirLogo(P1: JString; P2: Integer; P3: JConexao; P4: JImplementacaoTermica); cdecl;
    property ib: JImplementacaoBematech read _Getib;
  end;
  TJImplementacaoOBJXML = class(TJavaGenericImport<JImplementacaoOBJXMLClass, JImplementacaoOBJXML>) end;

  JImplementacaoOBJXML_1Class = interface(JNodeListClass)
    ['{470EDBE4-0EFA-4327-885E-6ECF8B47D120}']
    {class} function init(P1: JImplementacaoOBJXML): JImplementacaoOBJXML_1; cdecl;
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/ImplementacaoOBJXML$1')]
  JImplementacaoOBJXML_1 = interface(JNodeList)
    ['{589CF683-291D-4373-A88D-3C138E685E43}']
    function getLength: Integer; cdecl;
    function item(P1: Integer): JNode; cdecl;
  end;
  TJImplementacaoOBJXML_1 = class(TJavaGenericImport<JImplementacaoOBJXML_1Class, JImplementacaoOBJXML_1>) end;

  JImplementacaoOBJXML_infoPagClass = interface(JObjectClass)
    ['{539DEF23-9040-4374-B98C-240F5CF84C0C}']
    {class} function _GetmeioPgto: JString; cdecl;
    {class} function init(P1: JImplementacaoOBJXML): JImplementacaoOBJXML_infoPag; cdecl; overload;
    {class} function init(P1: JImplementacaoOBJXML; P2: JString; P3: Double): JImplementacaoOBJXML_infoPag; cdecl; overload;
    {class} property meioPgto: JString read _GetmeioPgto;
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/ImplementacaoOBJXML$infoPag')]
  JImplementacaoOBJXML_infoPag = interface(JObject)
    ['{21920B82-3B41-4224-ACD2-1FA0E12FDB28}']
    function _Getthis0: JImplementacaoOBJXML; cdecl;
    function _GetvalorPago: Double; cdecl;
    property this0: JImplementacaoOBJXML read _Getthis0;
    property valorPago: Double read _GetvalorPago;
  end;
  TJImplementacaoOBJXML_infoPag = class(TJavaGenericImport<JImplementacaoOBJXML_infoPagClass, JImplementacaoOBJXML_infoPag>) end;

  JImplementacaoOBJXMLCANCELAMENTOClass = interface(JImplementacaoOBJXMLClass)
    ['{E369F2F7-EC34-4670-B2ED-FD83F64DDB16}']
    {class} function ConstroiObj: Boolean; cdecl;//Deprecated
    {class} function GetAssQRCode: JString; cdecl;//Deprecated
    {class} function GetCNPJ: JString; cdecl;//Deprecated
    {class} function GetCPF_CNPJ: JString; cdecl;//Deprecated
    {class} function GetChaveAcesso: JString; cdecl;//Deprecated
    {class} function GetChaveAcessoACancelar: JString; cdecl;//Deprecated
    {class} function GetDtHrCupomACancelar: JString; cdecl;//Deprecated
    {class} function GetDtHrEmissao: JString; cdecl;//Deprecated
    {class} function GetEndereco: JString; cdecl;//Deprecated
    {class} function GetIE: JString; cdecl;//Deprecated
    {class} function GetIM: JString; cdecl;//Deprecated
    {class} function GetNCfe: JString; cdecl;//Deprecated
    {class} function GetNomeFantasia: JString; cdecl;//Deprecated
    {class} function GetNumSerieSAT: JString; cdecl;//Deprecated
    {class} function GetRazaoSocial: JString; cdecl;//Deprecated
    {class} function GetVCfe: JString; cdecl;//Deprecated
    {class} function PreencheOBJ(P1: Integer): Boolean; cdecl;//Deprecated
    {class} procedure SetAssQRCode(P1: JString); cdecl;//Deprecated
    {class} procedure SetCNPJ(P1: JString); cdecl;//Deprecated
    {class} procedure SetCPF_CNPJ(P1: JString); cdecl;//Deprecated
    {class} procedure SetChaveAcesso(P1: JString); cdecl;//Deprecated
    {class} procedure SetChaveAcessoACancelar(P1: JString); cdecl;//Deprecated
    {class} procedure SetDtHrCupomACancelar(P1: JString); cdecl;//Deprecated
    {class} procedure SetDtHrEmissao(P1: JString); cdecl;//Deprecated
    {class} procedure SetEndereco(P1: JString); cdecl;//Deprecated
    {class} procedure SetIE(P1: JString); cdecl;//Deprecated
    {class} procedure SetIM(P1: JString); cdecl;//Deprecated
    {class} procedure SetNCfe(P1: JString); cdecl;//Deprecated
    {class} procedure SetNomeFantasia(P1: JString); cdecl;//Deprecated
    {class} procedure SetNumSeriaSAT(P1: JString); cdecl;//Deprecated
    {class} procedure SetRazaoSocial(P1: JString); cdecl;//Deprecated
    {class} procedure SetVCfe(P1: JString); cdecl;//Deprecated
    {class} function init(P1: TJavaArray<Byte>): JImplementacaoOBJXMLCANCELAMENTO; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/ImplementacaoOBJXMLCANCELAMENTO')]
  JImplementacaoOBJXMLCANCELAMENTO = interface(JImplementacaoOBJXML)
    ['{5FE94580-DAC0-49EB-ADA4-67319C5FC378}']
  end;
  TJImplementacaoOBJXMLCANCELAMENTO = class(TJavaGenericImport<JImplementacaoOBJXMLCANCELAMENTOClass, JImplementacaoOBJXMLCANCELAMENTO>) end;

  JImplementacaoOBJXMLNFCEClass = interface(JImplementacaoOBJXMLClass)
    ['{EA8A7A9D-1E6E-4461-9912-87596C751A87}']
    {class} function ConstroiInfQRCode(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function ConstroiOBJ: Boolean; cdecl;//Deprecated
    {class} function GetCNPJConsumidor: JString; cdecl;//Deprecated
    {class} function GetCNPJEmit: JString; cdecl;//Deprecated
    {class} function GetCPFConsumidor: JString; cdecl;//Deprecated
    {class} function GetChaveConsulta: JString; cdecl;//Deprecated
    {class} function GetDHEmi: JString; cdecl;//Deprecated
    {class} function GetDHRecpto: JString; cdecl;//Deprecated
    {class} function GetDigestValue: JString; cdecl;//Deprecated
    {class} function GetEndereco: JString; cdecl;//Deprecated
    {class} function GetEnderecoDest: JString; cdecl;//Deprecated
    {class} function GetEnderecoEntrega: JString; cdecl;//Deprecated
    {class} function GetIDEstrConsumidor: JString; cdecl;//Deprecated
    {class} function GetIE: JString; cdecl;//Deprecated
    {class} function GetInfAdFisco: JString; cdecl;//Deprecated
    {class} function GetInfCpl: JString; cdecl;//Deprecated
    {class} function GetInfoPag: JArrayList; cdecl;//Deprecated
    {class} function GetNNF: JString; cdecl;//Deprecated
    {class} function GetNProtocolo: JString; cdecl;//Deprecated
    {class} function GetNomeDest: JString; cdecl;//Deprecated
    {class} function GetProdutos: JArrayList; cdecl;//Deprecated
    {class} function GetRazaoSocial: JString; cdecl;//Deprecated
    {class} function GetSerie: JString; cdecl;//Deprecated
    {class} function GetTpAmb: JString; cdecl;//Deprecated
    {class} function GetTpEmis: JString; cdecl;//Deprecated
    {class} function GetVDesc: JString; cdecl;//Deprecated
    {class} function GetVFrete: JString; cdecl;//Deprecated
    {class} function GetVNF: JString; cdecl;//Deprecated
    {class} function GetVOutros: JString; cdecl;//Deprecated
    {class} function GetVProd: JString; cdecl;//Deprecated
    {class} function GetVSeg: JString; cdecl;//Deprecated
    {class} function GetVTotTrib: JString; cdecl;//Deprecated
    {class} function GetVTroco: JString; cdecl;//Deprecated
    {class} function ObtemURL(P1: Integer; P2: Integer): JString; cdecl;//Deprecated
    {class} function PreencheCabecalho(P1: Integer; P2: Boolean): TJavaArray<Char>; cdecl;//Deprecated
    {class} function PreencheLegendaProduto(P1: Integer; P2: Integer): TJavaArray<Char>; cdecl;//Deprecated
    {class} function PreencheLinhaProduto(P1: JImplementacaoOBJPRODUTOXMLNFCE; P2: Integer; P3: Integer): TJavaArray<Char>; cdecl;//Deprecated
    {class} function PreencheOBJ(P1: Integer): Boolean; cdecl;//Deprecated
    {class} procedure SetCNPJConsumidor(P1: JString); cdecl;//Deprecated
    {class} procedure SetCNPJEmit(P1: JString); cdecl;//Deprecated
    {class} procedure SetCPFConsumidor(P1: JString); cdecl;//Deprecated
    {class} procedure SetChaveConsulta(P1: JString); cdecl;//Deprecated
    {class} procedure SetDHEmi(P1: JString); cdecl;//Deprecated
    {class} procedure SetDHRecpto(P1: JString); cdecl;//Deprecated
    {class} procedure SetDigestValue(P1: JString); cdecl;//Deprecated
    {class} procedure SetEndereco(P1: JString); cdecl;//Deprecated
    {class} procedure SetEnderecoDest(P1: JString); cdecl;//Deprecated
    {class} procedure SetEnderecoEntrega(P1: JString); cdecl;//Deprecated
    {class} procedure SetIDEstrConsumidor(P1: JString); cdecl;//Deprecated
    {class} procedure SetIE(P1: JString); cdecl;//Deprecated
    {class} procedure SetInfAdFisco(P1: JString); cdecl;//Deprecated
    {class} procedure SetInfCpl(P1: JString); cdecl;//Deprecated
    {class} procedure SetNNF(P1: JString); cdecl;//Deprecated
    {class} procedure SetNProtocolo(P1: JString); cdecl;//Deprecated
    {class} procedure SetNomeDest(P1: JString); cdecl;//Deprecated
    {class} procedure SetRazaoSocial(P1: JString); cdecl;//Deprecated
    {class} procedure SetSerie(P1: JString); cdecl;//Deprecated
    {class} procedure SetTpAmb(P1: JString); cdecl;//Deprecated
    {class} procedure SetTpEmis(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDesc(P1: JString); cdecl;//Deprecated
    {class} procedure SetVFrete(P1: JString); cdecl;//Deprecated
    {class} procedure SetVNF(P1: JString); cdecl;//Deprecated
    {class} procedure SetVOutros(P1: JString); cdecl;//Deprecated
    {class} procedure SetVProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetVSeg(P1: JString); cdecl;//Deprecated
    {class} procedure SetVTotTrib(P1: JString); cdecl;//Deprecated
    {class} procedure SetVTroco(P1: JString); cdecl;//Deprecated
    {class} function init(P1: TJavaArray<Byte>): JImplementacaoOBJXMLNFCE; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/ImplementacaoOBJXMLNFCE')]
  JImplementacaoOBJXMLNFCE = interface(JImplementacaoOBJXML)
    ['{DF6E9A87-FCFF-4971-A672-9A4F3B70BB1D}']
  end;
  TJImplementacaoOBJXMLNFCE = class(TJavaGenericImport<JImplementacaoOBJXMLNFCEClass, JImplementacaoOBJXMLNFCE>) end;

  JImplementacaoOBJXMLSATClass = interface(JImplementacaoOBJXMLClass)
    ['{0F443FE6-1B95-48C2-A31D-2F71A3F485EE}']
    {class} function ConstruirObj: Boolean; cdecl;//Deprecated
    {class} function GetCNPJ: JString; cdecl;//Deprecated
    {class} function GetCNPJSH: JString; cdecl;//Deprecated
    {class} function GetCodQRCode: JString; cdecl;//Deprecated
    {class} function GetCodigoBarras: JString; cdecl;//Deprecated
    {class} function GetDocDest: JString; cdecl;//Deprecated
    {class} function GetDocDestRaw: JString; cdecl;//Deprecated
    {class} function GetDtHrEmissao: JString; cdecl;//Deprecated
    {class} function GetEndDest: JString; cdecl;//Deprecated
    {class} function GetEndereco: JString; cdecl;//Deprecated
    {class} function GetIE: JString; cdecl;//Deprecated
    {class} function GetIM: JString; cdecl;//Deprecated
    {class} function GetInfCpl: JString; cdecl;//Deprecated
    {class} function GetNomeDest: JString; cdecl;//Deprecated
    {class} function GetNomeFantasia: JString; cdecl;//Deprecated
    {class} function GetNumDoc: JString; cdecl;//Deprecated
    {class} function GetNumSerieSAT: JString; cdecl;//Deprecated
    {class} function GetPagamentos: JArrayList; cdecl;//Deprecated
    {class} function GetProdutos: JArrayList; cdecl;//Deprecated
    {class} function GetRazaoSocial: JString; cdecl;//Deprecated
    {class} function GetSignAC: JString; cdecl;//Deprecated
    {class} function GetVAcresSubtot: JString; cdecl;//Deprecated
    {class} function GetVCFeLei12741: JString; cdecl;//Deprecated
    {class} function GetVDesc: JString; cdecl;//Deprecated
    {class} function GetVDescSubtot: JString; cdecl;//Deprecated
    {class} function GetVOutras: JString; cdecl;//Deprecated
    {class} function GetVProd: JString; cdecl;//Deprecated
    {class} function GetVTroco: JString; cdecl;//Deprecated
    {class} function GetValorCfe: JString; cdecl;//Deprecated
    {class} function GetXCampo: JString; cdecl;//Deprecated
    {class} function GetXTexto: JString; cdecl;//Deprecated
    {class} function PreencheLinhaProduto(P1: JImplementacaoOBJPRODUTOXMLSAT; P2: Integer; P3: Integer): TJavaArray<Char>; cdecl;//Deprecated
    {class} function PreencheOBJ(P1: Integer): Boolean; cdecl;//Deprecated
    {class} procedure SetCNPJ(P1: JString); cdecl;//Deprecated
    {class} procedure SetCNPJSH(P1: JString); cdecl;//Deprecated
    {class} procedure SetCodQRCode(P1: JString); cdecl;//Deprecated
    {class} procedure SetCodigoBarras(P1: JString); cdecl;//Deprecated
    {class} procedure SetDocDest(P1: JString); cdecl;//Deprecated
    {class} procedure SetDocDestRaw(P1: JString); cdecl;//Deprecated
    {class} procedure SetDtHrEmissao(P1: JString); cdecl;//Deprecated
    {class} procedure SetEndDest(P1: JString); cdecl;//Deprecated
    {class} procedure SetEndereco(P1: JString); cdecl;//Deprecated
    {class} procedure SetIE(P1: JString); cdecl;//Deprecated
    {class} procedure SetIM(P1: JString); cdecl;//Deprecated
    {class} procedure SetInfCpl(P1: JString); cdecl;//Deprecated
    {class} procedure SetNomeDest(P1: JString); cdecl;//Deprecated
    {class} procedure SetNomeFantasia(P1: JString); cdecl;//Deprecated
    {class} procedure SetNumDoc(P1: JString); cdecl;//Deprecated
    {class} procedure SetNumSerieSAT(P1: JString); cdecl;//Deprecated
    {class} procedure SetProdutos(P1: JImplementacaoOBJPRODUTOXMLSAT); cdecl;//Deprecated
    {class} procedure SetRazaoSocial(P1: JString); cdecl;//Deprecated
    {class} procedure SetSignAC(P1: JString); cdecl;//Deprecated
    {class} procedure SetVAcresSubtot(P1: JString); cdecl;//Deprecated
    {class} procedure SetVCFeLei12741(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDesc(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDescSubtot(P1: JString); cdecl;//Deprecated
    {class} procedure SetVOutras(P1: JString); cdecl;//Deprecated
    {class} procedure SetVProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetVTroco(P1: JString); cdecl;//Deprecated
    {class} procedure SetValorCfe(P1: JString); cdecl;//Deprecated
    {class} procedure SetXCampo(P1: JString); cdecl;//Deprecated
    {class} procedure SetXTexto(P1: JString); cdecl;//Deprecated
    {class} function init(P1: TJavaArray<Byte>): JImplementacaoOBJXMLSAT; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/ImplementacaoOBJXMLSAT')]
  JImplementacaoOBJXMLSAT = interface(JImplementacaoOBJXML)
    ['{E1F60D53-A7FF-4971-9F35-3085971FE000}']
  end;
  TJImplementacaoOBJXMLSAT = class(TJavaGenericImport<JImplementacaoOBJXMLSATClass, JImplementacaoOBJXMLSAT>) end;

  JInterfaceOBJPRODUTOXMLNFCEClass = interface(JInterfaceOBJXMLPRODUTOClass)
    ['{28F7AC94-3058-49E1-8023-4B998E01BA1C}']
    {class} function GetEAN13: JString; cdecl;//Deprecated
    {class} procedure SetEAN13(P1: JString); cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/InterfaceOBJPRODUTOXMLNFCE')]
  JInterfaceOBJPRODUTOXMLNFCE = interface(JInterfaceOBJXMLPRODUTO)
    ['{13BBABE3-1299-4B4C-A7CD-1E1B36435344}']
  end;
  TJInterfaceOBJPRODUTOXMLNFCE = class(TJavaGenericImport<JInterfaceOBJPRODUTOXMLNFCEClass, JInterfaceOBJPRODUTOXMLNFCE>) end;

  JInterfaceOBJPRODUTOXMLSATClass = interface(JInterfaceOBJXMLPRODUTOClass)
    ['{B915C992-F1F7-457C-A8C0-87DAD03DB5AD}']
    {class} function GetVBC: JString; cdecl;//Deprecated
    {class} function GetVDeducISSQN: JString; cdecl;//Deprecated
    {class} function GetVDescProd: JString; cdecl;//Deprecated
    {class} function GetVOutrasProd: JString; cdecl;//Deprecated
    {class} function GetVRatAcr: JString; cdecl;//Deprecated
    {class} function GetVRatDesc: JString; cdecl;//Deprecated
    {class} function GetValorAproxTributos: JString; cdecl;//Deprecated
    {class} procedure SetVBC(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDeducISSQN(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDescProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetVOutrasProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetVRatAcr(P1: JString); cdecl;//Deprecated
    {class} procedure SetVRatDesc(P1: JString); cdecl;//Deprecated
    {class} procedure SetValorAproxTributos(P1: JString); cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/InterfaceOBJPRODUTOXMLSAT')]
  JInterfaceOBJPRODUTOXMLSAT = interface(JInterfaceOBJXMLPRODUTO)
    ['{1E6A2138-9014-468C-9404-674256481470}']
  end;
  TJInterfaceOBJPRODUTOXMLSAT = class(TJavaGenericImport<JInterfaceOBJPRODUTOXMLSATClass, JInterfaceOBJPRODUTOXMLSAT>) end;

  JInterfaceOBJXMLCANCELAMENTOClass = interface(JInterfaceOBJXMLClass)
    ['{8E162996-FB3C-4386-A1D8-B80F14E48816}']
    {class} function ConstroiObj: Boolean; cdecl;//Deprecated
    {class} function GetAssQRCode: JString; cdecl;//Deprecated
    {class} function GetCNPJ: JString; cdecl;//Deprecated
    {class} function GetCPF_CNPJ: JString; cdecl;//Deprecated
    {class} function GetChaveAcesso: JString; cdecl;//Deprecated
    {class} function GetChaveAcessoACancelar: JString; cdecl;//Deprecated
    {class} function GetDtHrCupomACancelar: JString; cdecl;//Deprecated
    {class} function GetDtHrEmissao: JString; cdecl;//Deprecated
    {class} function GetEndereco: JString; cdecl;//Deprecated
    {class} function GetIE: JString; cdecl;//Deprecated
    {class} function GetIM: JString; cdecl;//Deprecated
    {class} function GetNCfe: JString; cdecl;//Deprecated
    {class} function GetNomeFantasia: JString; cdecl;//Deprecated
    {class} function GetNumSerieSAT: JString; cdecl;//Deprecated
    {class} function GetRazaoSocial: JString; cdecl;//Deprecated
    {class} function GetVCfe: JString; cdecl;//Deprecated
    {class} function PreencheOBJ(P1: Integer): Boolean; cdecl;//Deprecated
    {class} procedure SetAssQRCode(P1: JString); cdecl;//Deprecated
    {class} procedure SetCNPJ(P1: JString); cdecl;//Deprecated
    {class} procedure SetCPF_CNPJ(P1: JString); cdecl;//Deprecated
    {class} procedure SetChaveAcesso(P1: JString); cdecl;//Deprecated
    {class} procedure SetChaveAcessoACancelar(P1: JString); cdecl;//Deprecated
    {class} procedure SetDtHrCupomACancelar(P1: JString); cdecl;//Deprecated
    {class} procedure SetDtHrEmissao(P1: JString); cdecl;//Deprecated
    {class} procedure SetEndereco(P1: JString); cdecl;//Deprecated
    {class} procedure SetIE(P1: JString); cdecl;//Deprecated
    {class} procedure SetIM(P1: JString); cdecl;//Deprecated
    {class} procedure SetNCfe(P1: JString); cdecl;//Deprecated
    {class} procedure SetNomeFantasia(P1: JString); cdecl;//Deprecated
    {class} procedure SetNumSeriaSAT(P1: JString); cdecl;//Deprecated
    {class} procedure SetRazaoSocial(P1: JString); cdecl;//Deprecated
    {class} procedure SetVCfe(P1: JString); cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/InterfaceOBJXMLCANCELAMENTO')]
  JInterfaceOBJXMLCANCELAMENTO = interface(JInterfaceOBJXML)
    ['{E68ECB3E-117A-4A94-AE5D-D425914E9997}']
  end;
  TJInterfaceOBJXMLCANCELAMENTO = class(TJavaGenericImport<JInterfaceOBJXMLCANCELAMENTOClass, JInterfaceOBJXMLCANCELAMENTO>) end;

  JInterfaceOBJXMLNFCEClass = interface(JInterfaceOBJXMLClass)
    ['{16E0EC91-2B3D-472A-B526-7AA3CA729E4A}']
    {class} function ConstroiInfQRCode(P1: Integer; P2: JString): JString; cdecl;//Deprecated
    {class} function ConstroiOBJ: Boolean; cdecl;//Deprecated
    {class} function GetCNPJConsumidor: JString; cdecl;//Deprecated
    {class} function GetCNPJEmit: JString; cdecl;//Deprecated
    {class} function GetCPFConsumidor: JString; cdecl;//Deprecated
    {class} function GetChaveConsulta: JString; cdecl;//Deprecated
    {class} function GetDHEmi: JString; cdecl;//Deprecated
    {class} function GetDHRecpto: JString; cdecl;//Deprecated
    {class} function GetDigestValue: JString; cdecl;//Deprecated
    {class} function GetEndereco: JString; cdecl;//Deprecated
    {class} function GetEnderecoDest: JString; cdecl;//Deprecated
    {class} function GetEnderecoEntrega: JString; cdecl;//Deprecated
    {class} function GetIDEstrConsumidor: JString; cdecl;//Deprecated
    {class} function GetIE: JString; cdecl;//Deprecated
    {class} function GetInfAdFisco: JString; cdecl;//Deprecated
    {class} function GetInfCpl: JString; cdecl;//Deprecated
    {class} function GetInfoPag: JArrayList; cdecl;//Deprecated
    {class} function GetNNF: JString; cdecl;//Deprecated
    {class} function GetNProtocolo: JString; cdecl;//Deprecated
    {class} function GetNomeDest: JString; cdecl;//Deprecated
    {class} function GetProdutos: JArrayList; cdecl;//Deprecated
    {class} function GetRazaoSocial: JString; cdecl;//Deprecated
    {class} function GetSerie: JString; cdecl;//Deprecated
    {class} function GetTpAmb: JString; cdecl;//Deprecated
    {class} function GetTpEmis: JString; cdecl;//Deprecated
    {class} function GetVDesc: JString; cdecl;//Deprecated
    {class} function GetVFrete: JString; cdecl;//Deprecated
    {class} function GetVNF: JString; cdecl;//Deprecated
    {class} function GetVOutros: JString; cdecl;//Deprecated
    {class} function GetVProd: JString; cdecl;//Deprecated
    {class} function GetVSeg: JString; cdecl;//Deprecated
    {class} function GetVTotTrib: JString; cdecl;//Deprecated
    {class} function GetVTroco: JString; cdecl;//Deprecated
    {class} function ObtemURL(P1: Integer; P2: Integer): JString; cdecl;//Deprecated
    {class} function PreencheCabecalho(P1: Integer; P2: Boolean): TJavaArray<Char>; cdecl;//Deprecated
    {class} function PreencheLegendaProduto(P1: Integer; P2: Integer): TJavaArray<Char>; cdecl;//Deprecated
    {class} function PreencheLinhaProduto(P1: JImplementacaoOBJPRODUTOXMLNFCE; P2: Integer; P3: Integer): TJavaArray<Char>; cdecl;//Deprecated
    {class} function PreencheOBJ(P1: Integer): Boolean; cdecl;//Deprecated
    {class} procedure SetCNPJConsumidor(P1: JString); cdecl;//Deprecated
    {class} procedure SetCNPJEmit(P1: JString); cdecl;//Deprecated
    {class} procedure SetCPFConsumidor(P1: JString); cdecl;//Deprecated
    {class} procedure SetChaveConsulta(P1: JString); cdecl;//Deprecated
    {class} procedure SetDHEmi(P1: JString); cdecl;//Deprecated
    {class} procedure SetDHRecpto(P1: JString); cdecl;//Deprecated
    {class} procedure SetDigestValue(P1: JString); cdecl;//Deprecated
    {class} procedure SetEndereco(P1: JString); cdecl;//Deprecated
    {class} procedure SetEnderecoDest(P1: JString); cdecl;//Deprecated
    {class} procedure SetEnderecoEntrega(P1: JString); cdecl;//Deprecated
    {class} procedure SetIDEstrConsumidor(P1: JString); cdecl;//Deprecated
    {class} procedure SetIE(P1: JString); cdecl;//Deprecated
    {class} procedure SetInfAdFisco(P1: JString); cdecl;//Deprecated
    {class} procedure SetInfCpl(P1: JString); cdecl;//Deprecated
    {class} procedure SetNNF(P1: JString); cdecl;//Deprecated
    {class} procedure SetNProtocolo(P1: JString); cdecl;//Deprecated
    {class} procedure SetNomeDest(P1: JString); cdecl;//Deprecated
    {class} procedure SetRazaoSocial(P1: JString); cdecl;//Deprecated
    {class} procedure SetSerie(P1: JString); cdecl;//Deprecated
    {class} procedure SetTpAmb(P1: JString); cdecl;//Deprecated
    {class} procedure SetTpEmis(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDesc(P1: JString); cdecl;//Deprecated
    {class} procedure SetVFrete(P1: JString); cdecl;//Deprecated
    {class} procedure SetVNF(P1: JString); cdecl;//Deprecated
    {class} procedure SetVOutros(P1: JString); cdecl;//Deprecated
    {class} procedure SetVProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetVSeg(P1: JString); cdecl;//Deprecated
    {class} procedure SetVTotTrib(P1: JString); cdecl;//Deprecated
    {class} procedure SetVTroco(P1: JString); cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/InterfaceOBJXMLNFCE')]
  JInterfaceOBJXMLNFCE = interface(JInterfaceOBJXML)
    ['{4FBE89F1-0C0D-40D2-B8A2-A6626A518FA5}']
  end;
  TJInterfaceOBJXMLNFCE = class(TJavaGenericImport<JInterfaceOBJXMLNFCEClass, JInterfaceOBJXMLNFCE>) end;

  JInterfaceOBJXMLSATClass = interface(JInterfaceOBJXMLClass)
    ['{BA20C860-E4F1-4BCB-8B1E-A4180B35F5AE}']
    {class} function ConstruirObj: Boolean; cdecl;//Deprecated
    {class} function GetCNPJ: JString; cdecl;//Deprecated
    {class} function GetCNPJSH: JString; cdecl;//Deprecated
    {class} function GetCodQRCode: JString; cdecl;//Deprecated
    {class} function GetCodigoBarras: JString; cdecl;//Deprecated
    {class} function GetDocDest: JString; cdecl;//Deprecated
    {class} function GetDocDestRaw: JString; cdecl;//Deprecated
    {class} function GetDtHrEmissao: JString; cdecl;//Deprecated
    {class} function GetEndDest: JString; cdecl;//Deprecated
    {class} function GetEndereco: JString; cdecl;//Deprecated
    {class} function GetIE: JString; cdecl;//Deprecated
    {class} function GetIM: JString; cdecl;//Deprecated
    {class} function GetInfCpl: JString; cdecl;//Deprecated
    {class} function GetNomeDest: JString; cdecl;//Deprecated
    {class} function GetNomeFantasia: JString; cdecl;//Deprecated
    {class} function GetNumDoc: JString; cdecl;//Deprecated
    {class} function GetNumSerieSAT: JString; cdecl;//Deprecated
    {class} function GetPagamentos: JArrayList; cdecl;//Deprecated
    {class} function GetProdutos: JArrayList; cdecl;//Deprecated
    {class} function GetRazaoSocial: JString; cdecl;//Deprecated
    {class} function GetSignAC: JString; cdecl;//Deprecated
    {class} function GetVAcresSubtot: JString; cdecl;//Deprecated
    {class} function GetVCFeLei12741: JString; cdecl;//Deprecated
    {class} function GetVDesc: JString; cdecl;//Deprecated
    {class} function GetVDescSubtot: JString; cdecl;//Deprecated
    {class} function GetVOutras: JString; cdecl;//Deprecated
    {class} function GetVProd: JString; cdecl;//Deprecated
    {class} function GetVTroco: JString; cdecl;//Deprecated
    {class} function GetValorCfe: JString; cdecl;//Deprecated
    {class} function GetXCampo: JString; cdecl;//Deprecated
    {class} function GetXTexto: JString; cdecl;//Deprecated
    {class} function PreencheLinhaProduto(P1: JImplementacaoOBJPRODUTOXMLSAT; P2: Integer; P3: Integer): TJavaArray<Char>; cdecl;//Deprecated
    {class} function PreencheOBJ(P1: Integer): Boolean; cdecl;//Deprecated
    {class} procedure SetCNPJ(P1: JString); cdecl;//Deprecated
    {class} procedure SetCNPJSH(P1: JString); cdecl;//Deprecated
    {class} procedure SetCodQRCode(P1: JString); cdecl;//Deprecated
    {class} procedure SetCodigoBarras(P1: JString); cdecl;//Deprecated
    {class} procedure SetDocDest(P1: JString); cdecl;//Deprecated
    {class} procedure SetDocDestRaw(P1: JString); cdecl;//Deprecated
    {class} procedure SetDtHrEmissao(P1: JString); cdecl;//Deprecated
    {class} procedure SetEndDest(P1: JString); cdecl;//Deprecated
    {class} procedure SetEndereco(P1: JString); cdecl;//Deprecated
    {class} procedure SetIE(P1: JString); cdecl;//Deprecated
    {class} procedure SetIM(P1: JString); cdecl;//Deprecated
    {class} procedure SetInfCpl(P1: JString); cdecl;//Deprecated
    {class} procedure SetNomeDest(P1: JString); cdecl;//Deprecated
    {class} procedure SetNomeFantasia(P1: JString); cdecl;//Deprecated
    {class} procedure SetNumDoc(P1: JString); cdecl;//Deprecated
    {class} procedure SetNumSerieSAT(P1: JString); cdecl;//Deprecated
    {class} procedure SetProdutos(P1: JImplementacaoOBJPRODUTOXMLSAT); cdecl;//Deprecated
    {class} procedure SetRazaoSocial(P1: JString); cdecl;//Deprecated
    {class} procedure SetSignAC(P1: JString); cdecl;//Deprecated
    {class} procedure SetVAcresSubtot(P1: JString); cdecl;//Deprecated
    {class} procedure SetVCFeLei12741(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDesc(P1: JString); cdecl;//Deprecated
    {class} procedure SetVDescSubtot(P1: JString); cdecl;//Deprecated
    {class} procedure SetVOutras(P1: JString); cdecl;//Deprecated
    {class} procedure SetVProd(P1: JString); cdecl;//Deprecated
    {class} procedure SetVTroco(P1: JString); cdecl;//Deprecated
    {class} procedure SetValorCfe(P1: JString); cdecl;//Deprecated
    {class} procedure SetXCampo(P1: JString); cdecl;//Deprecated
    {class} procedure SetXTexto(P1: JString); cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Impressora/XML/InterfaceOBJXMLSAT')]
  JInterfaceOBJXMLSAT = interface(JInterfaceOBJXML)
    ['{AA257560-BBA5-4702-A501-55CFCDD985C9}']
  end;
  TJInterfaceOBJXMLSAT = class(TJavaGenericImport<JInterfaceOBJXMLSATClass, JInterfaceOBJXMLSAT>) end;

  JScanner_ScannerClass = interface(JObjectClass)
    ['{65EC32B5-0F1C-4548-9A2C-4B52ECB2C712}']
    {class} function getScanner(P1: JContext): JIntent; cdecl;//Deprecated
    {class} function init: JScanner_Scanner; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Scanner/Scanner')]
  JScanner_Scanner = interface(JObject)
    ['{FCFDA060-72AA-455A-B19E-B4ED05913FBC}']
  end;
  TJScanner_Scanner = class(TJavaGenericImport<JScanner_ScannerClass, JScanner_Scanner>) end;

  JAssinaturasClass = interface(JObjectClass)
    ['{3DA936B3-5954-4449-B3AE-DE178DF3984F}']
    {class} function _GetBOOLEAN: Integer; cdecl;
    {class} function _GetBYTE: Integer; cdecl;
    {class} function _GetCHAR: Integer; cdecl;
    {class} function _GetDOUBLE: Integer; cdecl;
    {class} function _GetFLOAT: Integer; cdecl;
    {class} function _GetINT: Integer; cdecl;
    {class} function _GetLONG: Integer; cdecl;
    {class} function _GetSHORT: Integer; cdecl;
    {class} function _GetSTRING: Integer; cdecl;
    {class} function getAssinaturasEtiqueta: JHashMap; cdecl;
    {class} function getAssinaturasSAT: JHashMap; cdecl;
    {class} function getAssinaturasTermica: JHashMap; cdecl;
    {class} function init: JAssinaturas; cdecl;
    {class} property BOOLEAN: Integer read _GetBOOLEAN;
    {class} property BYTE: Integer read _GetBYTE;
    {class} property CHAR: Integer read _GetCHAR;
    {class} property DOUBLE: Integer read _GetDOUBLE;
    {class} property FLOAT: Integer read _GetFLOAT;
    {class} property INT: Integer read _GetINT;
    {class} property LONG: Integer read _GetLONG;
    {class} property SHORT: Integer read _GetSHORT;
    {class} property &STRING: Integer read _GetSTRING;
  end;

  [JavaSignature('com/elgin/e1/Servico/Assinaturas')]
  JAssinaturas = interface(JObject)
    ['{B1AB549D-4911-470E-80FB-53659FDF2788}']
  end;
  TJAssinaturas = class(TJavaGenericImport<JAssinaturasClass, JAssinaturas>) end;

  JParametrosClass = interface(JObjectClass)
    ['{4015A2F6-84B9-488B-BBF2-6E8B4292DBF8}']
  end;

  [JavaSignature('com/elgin/e1/Servico/Parametros')]
  JParametros = interface(JObject)
    ['{B0F2D4D4-4FD6-4EC5-8757-6F5EB570774A}']
  end;
  TJParametros = class(TJavaGenericImport<JParametrosClass, JParametros>) end;

  JServicoE1Class = interface(JObjectClass)
    ['{83B1006B-2F9B-4C26-8307-F33FAB658F05}']
    {class} function _GetCOMANDO_DELIMITADO: Integer; cdecl;
    {class} function _GetCOMANDO_JSON: Integer; cdecl;
    {class} function _GetMODULO_ETIQUETA: JString; cdecl;
    {class} function _GetMODULO_IMPRESSOR: JString; cdecl;
    {class} function _GetMODULO_SAT: JString; cdecl;
    {class} function Abrir(P1: JString; P2: Integer): Integer; cdecl;
    {class} function Fechar: Integer; cdecl;
    {class} function GetSepValores: JString; cdecl;
    {class} function GetTipoComando: Integer; cdecl;
    {class} function ReceberDados(P1: JInteiro): TJavaArray<Byte>; cdecl; overload;
    {class} function ReceberDados(P1: JInteiro; P2: Integer): TJavaArray<Byte>; cdecl; overload;
    {class} function SetSepValores(P1: JString): Integer; cdecl;
    {class} function SetTipoComando(P1: Integer): Integer; cdecl;
    {class} function getServiceTimeout: Integer; cdecl;
    {class} function init: JServicoE1; cdecl;
    {class} function isAberto: Boolean; cdecl;
    {class} function isAutServico: Boolean; cdecl;
    {class} function setContext(P1: JContext): Integer; cdecl;
    {class} property COMANDO_DELIMITADO: Integer read _GetCOMANDO_DELIMITADO;
    {class} property COMANDO_JSON: Integer read _GetCOMANDO_JSON;
    {class} property MODULO_ETIQUETA: JString read _GetMODULO_ETIQUETA;
    {class} property MODULO_IMPRESSOR: JString read _GetMODULO_IMPRESSOR;
    {class} property MODULO_SAT: JString read _GetMODULO_SAT;
  end;

  [JavaSignature('com/elgin/e1/Servico/ServicoE1')]
  JServicoE1 = interface(JObject)
    ['{DB1BB745-FC38-40C0-8208-B3E70329F251}']
  end;
  TJServicoE1 = class(TJavaGenericImport<JServicoE1Class, JServicoE1>) end;

  JServicoE1_EtiquetaClass = interface(JObjectClass)
    ['{710612A2-3FEF-4907-8D32-E6A079D0621A}']
    {class} function DespejarArquivo(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function EnviaImagem(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: Integer; P7: JString; P8: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ExcluiImagem(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function Feed(P1: Integer; P2: JString; P3: JString; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarBarCode1D(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarBox(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarDataBar(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarDataBarExpanded(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString; P9: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarDataMatrix(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarImagem(P1: Integer; P2: Integer; P3: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarLinha(P1: Integer; P2: Integer; P3: Integer; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarMaxiCode(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer; P9: Integer; P10: Integer; P11: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarQRCodeAuto(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarQRCodeManual(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer; P9: Integer; P10: Integer; P11: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarTexto(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarTextoASD(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GerarTextoCourier(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GetVersaoDLL: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function Imprime(P1: Integer; P2: JString; P3: JString; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function Limpa(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function LimpaMemoria(P1: Integer; P2: JString; P3: JString; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function LimpaModulo(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function MemoryStatus(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function Reset(P1: Integer; P2: JString; P3: JString; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetAlturaGap(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetBackfeed(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetBaudrate(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: Integer; P7: Integer; P8: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetCalor(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetCortarZero(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetLength(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetLogicImgMode(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetMedidas(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetMirror(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetModoContinuo(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetOffsetColuna(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetOffsetLinha(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetPrintStPos(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetQtde(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetSensor(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetSymbolASD(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetTamPixel(P1: Integer; P2: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetTipoTransferencia(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SetVelImpressao(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function Status(P1: Integer; P2: JString; P3: JString; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function StatusEPL(P1: Integer; P2: JString; P3: JString; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function Teste(P1: Integer; P2: JString; P3: JString; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function init: JServicoE1_Etiqueta; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Servico/ServicoE1$Etiqueta')]
  JServicoE1_Etiqueta = interface(JObject)
    ['{2E081BE9-CBFF-4B6D-9925-3B68D64EF46B}']
  end;
  TJServicoE1_Etiqueta = class(TJavaGenericImport<JServicoE1_EtiquetaClass, JServicoE1_Etiqueta>) end;

  JServicoE1_SATClass = interface(JObjectClass)
    ['{EBD51332-5699-4DAA-B366-236474FE2055}']
    {class} function AssociarAssinatura(P1: Integer; P2: JString; P3: JString; P4: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function AtivarSAT(P1: Integer; P2: Integer; P3: JString; P4: JString; P5: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function AtualizarSoftwareSAT(P1: Integer; P2: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function BloquearSAT(P1: Integer; P2: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function CancelaVendaImpressaSAT(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: JString; P6: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function CancelarUltimaVenda(P1: Integer; P2: JString; P3: JString; P4: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ConfigurarInterfaceDeRede(P1: Integer; P2: JString; P3: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ConsultarNumeroSessao(P1: Integer; P2: JString; P3: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ConsultarSat(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ConsultarStatusEspecifico(P1: Integer; P2: Integer; P3: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ConsultarStatusOperacional(P1: Integer; P2: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ConsultarUltimaSessaoFiscal(P1: Integer; P2: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function CriaXMLCancelamentoSAT(P1: JString; P2: JString; P3: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function DecodificaBase64(P1: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function DesbloquearSAT(P1: Integer; P2: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function EnviarDadosVenda(P1: Integer; P2: JString; P3: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ExtrairLogs(P1: Integer; P2: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GetVersaoDLL: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function TesteFimAFim(P1: Integer; P2: JString; P3: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function TrocarCodigoDeAtivacao(P1: Integer; P2: JString; P3: Integer; P4: JString; P5: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function VendaImpressaSAT(P1: Integer; P2: JString; P3: JString; P4: Integer; P5: Integer; P6: JString; P7: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function init: JServicoE1_SAT; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Servico/ServicoE1$SAT')]
  JServicoE1_SAT = interface(JObject)
    ['{5EDB8BFD-1941-469E-873C-46B6BEF823E2}']
  end;
  TJServicoE1_SAT = class(TJavaGenericImport<JServicoE1_SATClass, JServicoE1_SAT>) end;

  JServicoE1_TermicaClass = interface(JObjectClass)
    ['{E0392D92-0ECB-4E20-8AEF-8A98E7F743C0}']
    {class} function AbreConexaoImpressora(P1: Integer; P2: JString; P3: JString; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function AbreGaveta(P1: Integer; P2: Integer; P3: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function AbreGavetaElgin: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function AvancaPapel(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function Corte(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function DefineAreaImpressao(P1: Integer; P2: Integer; P3: Integer; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function DefinePosicao(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function DirecaoImpressao(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function FechaConexaoImpressora: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function GetVersaoDLL: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ImpressaoCodigoBarras(P1: Integer; P2: JString; P3: Integer; P4: Integer; P5: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ImpressaoPDF417(P1: Integer; P2: Integer; P3: Integer; P4: Integer; P5: Integer; P6: Integer; P7: JString): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ImpressaoQRCode(P1: JString; P2: Integer; P3: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ImpressaoTexto(P1: JString; P2: Integer; P3: Integer; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ImprimeImagemMemoria(P1: JString; P2: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ImprimeMPeRetornaPadrao: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ImprimeModoPagina: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ImprimeXMLCancelamentoSAT(P1: JString; P2: JString; P3: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ImprimeXMLNFCe(P1: JString; P2: Integer; P3: JString; P4: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ImprimeXMLSAT(P1: JString; P2: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function InicializaImpressora: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function LimpaBufferModoPagina: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ModoPadrao: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function ModoPagina: TJavaArray<Byte>; cdecl;//Deprecated
    {class} function PosicaoImpressaoHorizontal(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function PosicaoImpressaoVertical(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function SinalSonoro(P1: Integer; P2: Integer; P3: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function StatusImpressora(P1: Integer): TJavaArray<Byte>; cdecl;//Deprecated
    {class} function init: JServicoE1_Termica; cdecl;//Deprecated
  end;

  [JavaSignature('com/elgin/e1/Servico/ServicoE1$Termica')]
  JServicoE1_Termica = interface(JObject)
    ['{FCED04F8-90BF-410B-9FD6-89A0CFD578FA}']
  end;
  TJServicoE1_Termica = class(TJavaGenericImport<JServicoE1_TermicaClass, JServicoE1_Termica>) end;

  Jminipdvm8_BuildConfigClass = interface(JObjectClass)
    ['{42787BDB-18AC-468F-A2C8-DF7E72AE0B4A}']
    {class} function _GetAPPLICATION_ID: JString; cdecl;
    {class} function _GetBUILD_TYPE: JString; cdecl;
    {class} function _GetDEBUG: Boolean; cdecl;
    {class} function _GetFLAVOR: JString; cdecl;
    {class} function _GetVERSION_CODE: Integer; cdecl;
    {class} function _GetVERSION_NAME: JString; cdecl;
    {class} function init: Jminipdvm8_BuildConfig; cdecl;
    {class} property APPLICATION_ID: JString read _GetAPPLICATION_ID;
    {class} property BUILD_TYPE: JString read _GetBUILD_TYPE;
    {class} property DEBUG: Boolean read _GetDEBUG;
    {class} property FLAVOR: JString read _GetFLAVOR;
    {class} property VERSION_CODE: Integer read _GetVERSION_CODE;
    {class} property VERSION_NAME: JString read _GetVERSION_NAME;
  end;

  [JavaSignature('com/elgin/minipdvm8/BuildConfig')]
  Jminipdvm8_BuildConfig = interface(JObject)
    ['{3180CE76-80EE-44E1-B254-2666431077EB}']
  end;
  TJminipdvm8_BuildConfig = class(TJavaGenericImport<Jminipdvm8_BuildConfigClass, Jminipdvm8_BuildConfig>) end;

  JPrinterManagerClass = interface(JObjectClass)
    ['{5C471287-4D06-4DD5-B508-77E256EB30A1}']
    {class} function _GetALIGN_CENTER: Integer; cdecl;
    {class} function _GetALIGN_LEFT: Integer; cdecl;
    {class} function _GetALIGN_RIGHT: Integer; cdecl;
    {class} function _GetARIAL: Integer; cdecl;
    {class} function _GetBOLD: Integer; cdecl;
    {class} function _GetKEY_ALIGN: JString; cdecl;
    {class} function _GetKEY_LINESPACE: JString; cdecl;
    {class} function _GetKEY_MARGINBOTTOM: JString; cdecl;
    {class} function _GetKEY_MARGINLEFT: JString; cdecl;
    {class} function _GetKEY_MARGINRIGHT: JString; cdecl;
    {class} function _GetKEY_MARGINTOP: JString; cdecl;
    {class} function _GetKEY_TEXTSIZE: JString; cdecl;
    {class} function _GetKEY_TYPEFACE: JString; cdecl;
    {class} function _GetKEY_WEIGHT: JString; cdecl;
    {class} function _GetNORMAL: Integer; cdecl;
    {class} function _GetSERIF: Integer; cdecl;
    {class} function _GetsCurrentLength: Int64; cdecl;
    {class} function _GetsTotalLength: Int64; cdecl;
    {class} function init(P1: JActivity; P2: JPrinterManager_PrinterManagerListener): JPrinterManager; cdecl;
    {class} property ALIGN_CENTER: Integer read _GetALIGN_CENTER;
    {class} property ALIGN_LEFT: Integer read _GetALIGN_LEFT;
    {class} property ALIGN_RIGHT: Integer read _GetALIGN_RIGHT;
    {class} property ARIAL: Integer read _GetARIAL;
    {class} property BOLD: Integer read _GetBOLD;
    {class} property KEY_ALIGN: JString read _GetKEY_ALIGN;
    {class} property KEY_LINESPACE: JString read _GetKEY_LINESPACE;
    {class} property KEY_MARGINBOTTOM: JString read _GetKEY_MARGINBOTTOM;
    {class} property KEY_MARGINLEFT: JString read _GetKEY_MARGINLEFT;
    {class} property KEY_MARGINRIGHT: JString read _GetKEY_MARGINRIGHT;
    {class} property KEY_MARGINTOP: JString read _GetKEY_MARGINTOP;
    {class} property KEY_TEXTSIZE: JString read _GetKEY_TEXTSIZE;
    {class} property KEY_TYPEFACE: JString read _GetKEY_TYPEFACE;
    {class} property KEY_WEIGHT: JString read _GetKEY_WEIGHT;
    {class} property NORMAL: Integer read _GetNORMAL;
    {class} property SERIF: Integer read _GetSERIF;
    {class} property sCurrentLength: Int64 read _GetsCurrentLength;
    {class} property sTotalLength: Int64 read _GetsTotalLength;
  end;

  [JavaSignature('com/elgin/minipdvm8/PrinterManager')]
  JPrinterManager = interface(JObject)
    ['{A2254878-9F9B-490D-9C62-F2AEE34A0027}']
    function getBootloaderVersion: JString; cdecl;
    function getFirmwareVersion: JString; cdecl;
    function hasXChengPrinter(P1: JContext): Boolean; cdecl;
    procedure onPrinterStart; cdecl;
    procedure onPrinterStop(P1: Boolean); cdecl;
    procedure printBarCode(P1: JString; P2: Integer; P3: Integer; P4: Integer; P5: Boolean); cdecl;
    procedure printBitmap(P1: JBitmap); cdecl; overload;
    procedure printBitmap(P1: JBitmap; P2: JMap); cdecl; overload;
    procedure printColumnsTextWithAttributes(P1: TJavaObjectArray<JString>; P2: JList); cdecl;
    procedure printQRCode(P1: JString; P2: Integer; P3: Integer); cdecl;
    procedure printText(P1: JString); cdecl;
    procedure printTextWithAttributes(P1: JString; P2: JMap); cdecl;
    procedure printWrapPaper(P1: Integer); cdecl;
    procedure printerInit; cdecl;
    function printerPaper: Boolean; cdecl;
    procedure printerReset; cdecl;
    function printerTemperature(P1: JActivity): Integer; cdecl;
    procedure sendRAWData(P1: TJavaArray<Byte>); cdecl;
    procedure setPrinterSpeed(P1: Integer); cdecl;
    procedure upgradePrinter; cdecl;
  end;
  TJPrinterManager = class(TJavaGenericImport<JPrinterManagerClass, JPrinterManager>) end;

  JPrinterManager_1Class = interface(JServiceConnectionClass)
    ['{1449C43E-FDEC-4964-8AAA-0F80BACA5C3B}']
    {class} function init(P1: JPrinterManager): JPrinterManager_1; cdecl;
  end;

  [JavaSignature('com/elgin/minipdvm8/PrinterManager$1')]
  JPrinterManager_1 = interface(JServiceConnection)
    ['{189EFBF8-9DC9-4C28-AFEC-82E2F7E693BF}']
    procedure onServiceConnected(P1: JComponentName; P2: JIBinder); cdecl;
    procedure onServiceDisconnected(P1: JComponentName); cdecl;
  end;
  TJPrinterManager_1 = class(TJavaGenericImport<JPrinterManager_1Class, JPrinterManager_1>) end;

  JIPrinterCallback_StubClass = interface(JBinderClass)
    ['{504B86A2-F18D-4427-B48E-8A0B3B50A019}']
    {class} function _GetTRANSACTION_onComplete: Integer; cdecl;
    {class} function _GetTRANSACTION_onLength: Integer; cdecl;
    {class} function asInterface(P1: JIBinder): JIPrinterCallback; cdecl;
    {class} function init: JIPrinterCallback_Stub; cdecl;
    {class} property TRANSACTION_onComplete: Integer read _GetTRANSACTION_onComplete;
    {class} property TRANSACTION_onLength: Integer read _GetTRANSACTION_onLength;
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterCallback$Stub')]
  JIPrinterCallback_Stub = interface(JBinder)
    ['{02E6AA2E-C6C4-4673-A850-AE5A5A772012}']
    function asBinder: JIBinder; cdecl;
    function onTransact(P1: Integer; P2: JParcel; P3: JParcel; P4: Integer): Boolean; cdecl;
  end;
  TJIPrinterCallback_Stub = class(TJavaGenericImport<JIPrinterCallback_StubClass, JIPrinterCallback_Stub>) end;

  JPrinterManager_2Class = interface(JIPrinterCallback_StubClass)
    ['{EF8287E8-7409-4C69-90D8-8882ED0112DA}']
    {class} function init(P1: JPrinterManager): JPrinterManager_2; cdecl;
  end;

  [JavaSignature('com/elgin/minipdvm8/PrinterManager$2')]
  JPrinterManager_2 = interface(JIPrinterCallback_Stub)
    ['{EC163A75-1DD8-4202-8F67-4E86782173D0}']
    procedure onComplete; cdecl;
    procedure onException(P1: Integer; P2: JString); cdecl;
    procedure onLength(P1: Int64; P2: Int64); cdecl;
  end;
  TJPrinterManager_2 = class(TJavaGenericImport<JPrinterManager_2Class, JPrinterManager_2>) end;

  Jcloudpossdk_aar_slim_BuildConfigClass = interface(JObjectClass)
    ['{5BF6550C-571F-4498-BA10-00412ABD0BB8}']
    {class} function _GetAPPLICATION_ID: JString; cdecl;
    {class} function _GetBUILD_TYPE: JString; cdecl;
    {class} function _GetDEBUG: Boolean; cdecl;
    {class} function _GetFLAVOR: JString; cdecl;
    {class} function _GetVERSION_CODE: Integer; cdecl;
    {class} function _GetVERSION_NAME: JString; cdecl;
    {class} function init: Jcloudpossdk_aar_slim_BuildConfig; cdecl;
    {class} property APPLICATION_ID: JString read _GetAPPLICATION_ID;
    {class} property BUILD_TYPE: JString read _GetBUILD_TYPE;
    {class} property DEBUG: Boolean read _GetDEBUG;
    {class} property FLAVOR: JString read _GetFLAVOR;
    {class} property VERSION_CODE: Integer read _GetVERSION_CODE;
    {class} property VERSION_NAME: JString read _GetVERSION_NAME;
  end;

  [JavaSignature('com/example/cloudpossdk_aar_slim/BuildConfig')]
  Jcloudpossdk_aar_slim_BuildConfig = interface(JObject)
    ['{0EE5210E-6973-4644-8B88-A161DB1483D3}']
  end;
  TJcloudpossdk_aar_slim_BuildConfig = class(TJavaGenericImport<Jcloudpossdk_aar_slim_BuildConfigClass, Jcloudpossdk_aar_slim_BuildConfig>) end;

  JCommSerialAPIClass = interface(JObjectClass)
    ['{F6DD53E2-C077-48FC-9F0A-C4A4E2689478}']
    {class} function comPortClose(P1: Integer): Integer; cdecl;//Deprecated
    {class} function comPortOpen(P1: JString; P2: Integer; P3: Integer; P4: Char; P5: Integer): Integer; cdecl;//Deprecated
    {class} function comPortRead(P1: Integer): JString; cdecl;//Deprecated
    {class} function comPortWrite(P1: JString; P2: Integer): Boolean; cdecl;//Deprecated
    {class} function init: JCommSerialAPI; cdecl;//Deprecated
  end;

  [JavaSignature('com/xc/comportdemo/CommSerialAPI')]
  JCommSerialAPI = interface(JObject)
    ['{D5028DDE-5D1C-4D24-8115-F8CEC0720773}']
  end;
  TJCommSerialAPI = class(TJavaGenericImport<JCommSerialAPIClass, JCommSerialAPI>) end;

  JComportNativeClass = interface(JObjectClass)
    ['{E0382B30-5FF7-4A85-B8E5-5C5FCC0BCA85}']
  end;

  [JavaSignature('com/xc/comportdemo/ComportNative')]
  JComportNative = interface(JObject)
    ['{FBAEF213-D737-4DEC-85F2-AA2498827D94}']
  end;
  TJComportNative = class(TJavaGenericImport<JComportNativeClass, JComportNative>) end;

  JIPrinterCallbackClass = interface(JIInterfaceClass)
    ['{FB91C065-D585-44AA-B6BC-D74B6493DEFA}']
    {class} procedure onComplete; cdecl;//Deprecated
    {class} procedure onException(P1: Integer; P2: JString); cdecl;//Deprecated
    {class} procedure onLength(P1: Int64; P2: Int64); cdecl;//Deprecated
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterCallback')]
  JIPrinterCallback = interface(JIInterface)
    ['{898C966D-7C97-4D61-9621-68899281F8FA}']
  end;
  TJIPrinterCallback = class(TJavaGenericImport<JIPrinterCallbackClass, JIPrinterCallback>) end;

  JIPrinterCallback_Stub_ProxyClass = interface(JIPrinterCallbackClass)
    ['{B5D77BDF-7B0F-4852-A700-FDB4BB5D790C}']
    {class} function asBinder: JIBinder; cdecl;//Deprecated
    {class} function getInterfaceDescriptor: JString; cdecl;//Deprecated
    {class} procedure onComplete; cdecl;//Deprecated
    {class} procedure onException(P1: Integer; P2: JString); cdecl;//Deprecated
    {class} procedure onLength(P1: Int64; P2: Int64); cdecl;//Deprecated
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterCallback$Stub$Proxy')]
  JIPrinterCallback_Stub_Proxy = interface(JIPrinterCallback)
    ['{2FA3864C-B19A-4FE8-A56B-FCF54BD16AAF}']
  end;
  TJIPrinterCallback_Stub_Proxy = class(TJavaGenericImport<JIPrinterCallback_Stub_ProxyClass, JIPrinterCallback_Stub_Proxy>) end;

  JIPrinterServiceClass = interface(JIInterfaceClass)
    ['{0445EEC3-6ABB-4632-AA9E-86AFCCE131A9}']
    {class} function getBootloaderVersion: JString; cdecl;//Deprecated
    {class} function getFirmwareVersion: JString; cdecl;//Deprecated
    {class} procedure printBarCode(P1: JString; P2: Integer; P3: Integer; P4: Integer; P5: Boolean; P6: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printBitmap(P1: JBitmap; P2: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printBitmapWithAttributes(P1: JBitmap; P2: JMap; P3: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printColumnsTextWithAttributes(P1: TJavaObjectArray<JString>; P2: JList; P3: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printQRCode(P1: JString; P2: Integer; P3: Integer; P4: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printText(P1: JString; P2: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printTextWithAttributes(P1: JString; P2: JMap; P3: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printWrapPaper(P1: Integer; P2: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printerInit(P1: JIPrinterCallback); cdecl;//Deprecated
    {class} function printerPaper(P1: JIPrinterCallback): Boolean; cdecl;//Deprecated
    {class} procedure printerReset(P1: JIPrinterCallback); cdecl;//Deprecated
    {class} function printerTemperature(P1: JIPrinterCallback): Integer; cdecl;//Deprecated
    {class} procedure sendRAWData(P1: TJavaArray<Byte>; P2: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure setPrinterSpeed(P1: Integer; P2: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure upgradePrinter; cdecl;//Deprecated
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterService')]
  JIPrinterService = interface(JIInterface)
    ['{C93CE08A-0108-45A7-A44B-63B5F7747528}']
  end;
  TJIPrinterService = class(TJavaGenericImport<JIPrinterServiceClass, JIPrinterService>) end;

  JIPrinterService_StubClass = interface(JBinderClass)
    ['{2BDA0674-9075-49C0-9BCD-DFC39A9393D0}']
    {class} function _GetTRANSACTION_getBootloaderVersion: Integer; cdecl;
    {class} function _GetTRANSACTION_getFirmwareVersion: Integer; cdecl;
    {class} function _GetTRANSACTION_printBarCode: Integer; cdecl;
    {class} function _GetTRANSACTION_printBitmap: Integer; cdecl;
    {class} function _GetTRANSACTION_printBitmapWithAttributes: Integer; cdecl;
    {class} function _GetTRANSACTION_printColumnsTextWithAttributes: Integer; cdecl;
    {class} function _GetTRANSACTION_printQRCode: Integer; cdecl;
    {class} function _GetTRANSACTION_printText: Integer; cdecl;
    {class} function _GetTRANSACTION_printTextWithAttributes: Integer; cdecl;
    {class} function _GetTRANSACTION_printWrapPaper: Integer; cdecl;
    {class} function _GetTRANSACTION_printerInit: Integer; cdecl;
    {class} function _GetTRANSACTION_printerPaper: Integer; cdecl;
    {class} function _GetTRANSACTION_printerReset: Integer; cdecl;
    {class} function _GetTRANSACTION_printerTemperature: Integer; cdecl;
    {class} function _GetTRANSACTION_sendRAWData: Integer; cdecl;
    {class} function _GetTRANSACTION_setPrinterSpeed: Integer; cdecl;
    {class} function asInterface(P1: JIBinder): JIPrinterService; cdecl;
    {class} function init: JIPrinterService_Stub; cdecl;
    {class} property TRANSACTION_getBootloaderVersion: Integer read _GetTRANSACTION_getBootloaderVersion;
    {class} property TRANSACTION_getFirmwareVersion: Integer read _GetTRANSACTION_getFirmwareVersion;
    {class} property TRANSACTION_printBarCode: Integer read _GetTRANSACTION_printBarCode;
    {class} property TRANSACTION_printBitmap: Integer read _GetTRANSACTION_printBitmap;
    {class} property TRANSACTION_printBitmapWithAttributes: Integer read _GetTRANSACTION_printBitmapWithAttributes;
    {class} property TRANSACTION_printColumnsTextWithAttributes: Integer read _GetTRANSACTION_printColumnsTextWithAttributes;
    {class} property TRANSACTION_printQRCode: Integer read _GetTRANSACTION_printQRCode;
    {class} property TRANSACTION_printText: Integer read _GetTRANSACTION_printText;
    {class} property TRANSACTION_printTextWithAttributes: Integer read _GetTRANSACTION_printTextWithAttributes;
    {class} property TRANSACTION_printWrapPaper: Integer read _GetTRANSACTION_printWrapPaper;
    {class} property TRANSACTION_printerInit: Integer read _GetTRANSACTION_printerInit;
    {class} property TRANSACTION_printerPaper: Integer read _GetTRANSACTION_printerPaper;
    {class} property TRANSACTION_printerReset: Integer read _GetTRANSACTION_printerReset;
    {class} property TRANSACTION_printerTemperature: Integer read _GetTRANSACTION_printerTemperature;
    {class} property TRANSACTION_sendRAWData: Integer read _GetTRANSACTION_sendRAWData;
    {class} property TRANSACTION_setPrinterSpeed: Integer read _GetTRANSACTION_setPrinterSpeed;
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterService$Stub')]
  JIPrinterService_Stub = interface(JBinder)
    ['{66952A97-40AF-4E3C-A37C-03F91EDFF72D}']
    function asBinder: JIBinder; cdecl;
    function onTransact(P1: Integer; P2: JParcel; P3: JParcel; P4: Integer): Boolean; cdecl;
  end;
  TJIPrinterService_Stub = class(TJavaGenericImport<JIPrinterService_StubClass, JIPrinterService_Stub>) end;

  JIPrinterService_Stub_ProxyClass = interface(JIPrinterServiceClass)
    ['{CE7F9BEA-2786-478F-A45E-71F08A496C2A}']
    {class} function asBinder: JIBinder; cdecl;//Deprecated
    {class} function getBootloaderVersion: JString; cdecl;//Deprecated
    {class} function getFirmwareVersion: JString; cdecl;//Deprecated
    {class} function getInterfaceDescriptor: JString; cdecl;//Deprecated
    {class} procedure printBarCode(P1: JString; P2: Integer; P3: Integer; P4: Integer; P5: Boolean; P6: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printBitmap(P1: JBitmap; P2: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printBitmapWithAttributes(P1: JBitmap; P2: JMap; P3: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printColumnsTextWithAttributes(P1: TJavaObjectArray<JString>; P2: JList; P3: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printQRCode(P1: JString; P2: Integer; P3: Integer; P4: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printText(P1: JString; P2: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printTextWithAttributes(P1: JString; P2: JMap; P3: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printWrapPaper(P1: Integer; P2: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure printerInit(P1: JIPrinterCallback); cdecl;//Deprecated
    {class} function printerPaper(P1: JIPrinterCallback): Boolean; cdecl;//Deprecated
    {class} procedure printerReset(P1: JIPrinterCallback); cdecl;//Deprecated
    {class} function printerTemperature(P1: JIPrinterCallback): Integer; cdecl;//Deprecated
    {class} procedure sendRAWData(P1: TJavaArray<Byte>; P2: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure setPrinterSpeed(P1: Integer; P2: JIPrinterCallback); cdecl;//Deprecated
    {class} procedure upgradePrinter; cdecl;//Deprecated
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterService$Stub$Proxy')]
  JIPrinterService_Stub_Proxy = interface(JIPrinterService)
    ['{F8C0BA87-8B3C-485C-B0C5-C17A268B0275}']
  end;
  TJIPrinterService_Stub_Proxy = class(TJavaGenericImport<JIPrinterService_Stub_ProxyClass, JIPrinterService_Stub_Proxy>) end;

  JNodeClass = interface(IJavaClass)
    ['{4FF9B265-CEE8-4AB9-B74A-5F2D9CED8981}']
    {class} function _GetATTRIBUTE_NODE: SmallInt; cdecl;
    {class} function _GetCDATA_SECTION_NODE: SmallInt; cdecl;
    {class} function _GetCOMMENT_NODE: SmallInt; cdecl;
    {class} function _GetDOCUMENT_FRAGMENT_NODE: SmallInt; cdecl;
    {class} function _GetDOCUMENT_NODE: SmallInt; cdecl;
    {class} function _GetDOCUMENT_POSITION_CONTAINED_BY: SmallInt; cdecl;
    {class} function _GetDOCUMENT_POSITION_CONTAINS: SmallInt; cdecl;
    {class} function _GetDOCUMENT_POSITION_DISCONNECTED: SmallInt; cdecl;
    {class} function _GetDOCUMENT_POSITION_FOLLOWING: SmallInt; cdecl;
    {class} function _GetDOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: SmallInt; cdecl;
    {class} function _GetDOCUMENT_POSITION_PRECEDING: SmallInt; cdecl;
    {class} function _GetDOCUMENT_TYPE_NODE: SmallInt; cdecl;
    {class} function _GetELEMENT_NODE: SmallInt; cdecl;
    {class} function _GetENTITY_NODE: SmallInt; cdecl;
    {class} function _GetENTITY_REFERENCE_NODE: SmallInt; cdecl;
    {class} function _GetNOTATION_NODE: SmallInt; cdecl;
    {class} function _GetPROCESSING_INSTRUCTION_NODE: SmallInt; cdecl;
    {class} function _GetTEXT_NODE: SmallInt; cdecl;
    {class} function getAttributes: JNamedNodeMap; cdecl;
    {class} function getBaseURI: JString; cdecl;
    {class} function getChildNodes: JNodeList; cdecl;
    {class} function getLocalName: JString; cdecl;
    {class} function getNamespaceURI: JString; cdecl;
    {class} function getNextSibling: JNode; cdecl;
    {class} function getOwnerDocument: JDocument; cdecl;//Deprecated
    {class} function getParentNode: JNode; cdecl;//Deprecated
    {class} function getPrefix: JString; cdecl;//Deprecated
    {class} function hasAttributes: Boolean; cdecl;//Deprecated
    {class} function hasChildNodes: Boolean; cdecl;//Deprecated
    {class} function insertBefore(newChild: JNode; refChild: JNode): JNode; cdecl;//Deprecated
    {class} function isSupported(feature: JString; version: JString): Boolean; cdecl;//Deprecated
    {class} function lookupNamespaceURI(prefix: JString): JString; cdecl;//Deprecated
    {class} function replaceChild(newChild: JNode; oldChild: JNode): JNode; cdecl;//Deprecated
    {class} procedure setNodeValue(nodeValue: JString); cdecl;//Deprecated
    {class} procedure setPrefix(prefix: JString); cdecl;//Deprecated
    {class} property ATTRIBUTE_NODE: SmallInt read _GetATTRIBUTE_NODE;
    {class} property CDATA_SECTION_NODE: SmallInt read _GetCDATA_SECTION_NODE;
    {class} property COMMENT_NODE: SmallInt read _GetCOMMENT_NODE;
    {class} property DOCUMENT_FRAGMENT_NODE: SmallInt read _GetDOCUMENT_FRAGMENT_NODE;
    {class} property DOCUMENT_NODE: SmallInt read _GetDOCUMENT_NODE;
    {class} property DOCUMENT_POSITION_CONTAINED_BY: SmallInt read _GetDOCUMENT_POSITION_CONTAINED_BY;
    {class} property DOCUMENT_POSITION_CONTAINS: SmallInt read _GetDOCUMENT_POSITION_CONTAINS;
    {class} property DOCUMENT_POSITION_DISCONNECTED: SmallInt read _GetDOCUMENT_POSITION_DISCONNECTED;
    {class} property DOCUMENT_POSITION_FOLLOWING: SmallInt read _GetDOCUMENT_POSITION_FOLLOWING;
    {class} property DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: SmallInt read _GetDOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    {class} property DOCUMENT_POSITION_PRECEDING: SmallInt read _GetDOCUMENT_POSITION_PRECEDING;
    {class} property DOCUMENT_TYPE_NODE: SmallInt read _GetDOCUMENT_TYPE_NODE;
    {class} property ELEMENT_NODE: SmallInt read _GetELEMENT_NODE;
    {class} property ENTITY_NODE: SmallInt read _GetENTITY_NODE;
    {class} property ENTITY_REFERENCE_NODE: SmallInt read _GetENTITY_REFERENCE_NODE;
    {class} property NOTATION_NODE: SmallInt read _GetNOTATION_NODE;
    {class} property PROCESSING_INSTRUCTION_NODE: SmallInt read _GetPROCESSING_INSTRUCTION_NODE;
    {class} property TEXT_NODE: SmallInt read _GetTEXT_NODE;
  end;

  [JavaSignature('org/w3c/dom/Node')]
  JNode = interface(IJavaInstance)
    ['{35CFF397-04C8-489D-9C62-607EFFA8B051}']
    function appendChild(newChild: JNode): JNode; cdecl;
    function cloneNode(deep: Boolean): JNode; cdecl;
    function compareDocumentPosition(other: JNode): SmallInt; cdecl;
    function getFeature(feature: JString; version: JString): JObject; cdecl;
    function getFirstChild: JNode; cdecl;
    function getLastChild: JNode; cdecl;
    function getNodeName: JString; cdecl;//Deprecated
    function getNodeType: SmallInt; cdecl;//Deprecated
    function getNodeValue: JString; cdecl;//Deprecated
    function getPreviousSibling: JNode; cdecl;//Deprecated
    function getTextContent: JString; cdecl;//Deprecated
    function getUserData(key: JString): JObject; cdecl;//Deprecated
    function isDefaultNamespace(namespaceURI: JString): Boolean; cdecl;//Deprecated
    function isEqualNode(arg: JNode): Boolean; cdecl;//Deprecated
    function isSameNode(other: JNode): Boolean; cdecl;//Deprecated
    function lookupPrefix(namespaceURI: JString): JString; cdecl;//Deprecated
    procedure normalize; cdecl;//Deprecated
    function removeChild(oldChild: JNode): JNode; cdecl;//Deprecated
    procedure setTextContent(textContent: JString); cdecl;
    function setUserData(key: JString; data: JObject; handler: JUserDataHandler): JObject; cdecl;
  end;
  TJNode = class(TJavaGenericImport<JNodeClass, JNode>) end;

  JAttrClass = interface(JNodeClass)
    ['{5FB044B8-0031-4520-B87A-3CDB994277D7}']
    {class} function getName: JString; cdecl;//Deprecated
    {class} function getValue: JString; cdecl;
    {class} function isId: Boolean; cdecl;
    {class} procedure setValue(value: JString); cdecl;
  end;

  [JavaSignature('org/w3c/dom/Attr')]
  JAttr = interface(JNode)
    ['{F9FC2FA5-CCAD-4D11-8B8D-3958C5F55273}']
    function getOwnerElement: JElement; cdecl;
    function getSchemaTypeInfo: JTypeInfo; cdecl;
    function getSpecified: Boolean; cdecl;
  end;
  TJAttr = class(TJavaGenericImport<JAttrClass, JAttr>) end;

  JCharacterDataClass = interface(JNodeClass)
    ['{2C17F389-87C1-444E-957E-9F54C1531B5A}']
    {class} procedure appendData(arg: JString); cdecl;
    {class} procedure deleteData(offset: Integer; count: Integer); cdecl;
    {class} procedure replaceData(offset: Integer; count: Integer; arg: JString); cdecl;
    {class} procedure setData(data: JString); cdecl;
    {class} function substringData(offset: Integer; count: Integer): JString; cdecl;
  end;

  [JavaSignature('org/w3c/dom/CharacterData')]
  JCharacterData = interface(JNode)
    ['{10B18FAD-C168-4834-9BF9-996C53B31D9E}']
    function getData: JString; cdecl;
    function getLength: Integer; cdecl;
    procedure insertData(offset: Integer; arg: JString); cdecl;
  end;
  TJCharacterData = class(TJavaGenericImport<JCharacterDataClass, JCharacterData>) end;

  JTextClass = interface(JCharacterDataClass)
    ['{A1698F81-D2B1-4131-A464-3E6A6ADD1D56}']
    {class} function getWholeText: JString; cdecl;
    {class} function isElementContentWhitespace: Boolean; cdecl;
    {class} function replaceWholeText(content: JString): JText; cdecl;
  end;

  [JavaSignature('org/w3c/dom/Text')]
  JText = interface(JCharacterData)
    ['{FAE4042A-1DDA-4B7D-BCFC-3C629B2818A4}']
    function splitText(offset: Integer): JText; cdecl;//Deprecated
  end;
  TJText = class(TJavaGenericImport<JTextClass, JText>) end;

  JCDATASectionClass = interface(JTextClass)
    ['{7CBFD045-12AF-4D98-A080-469281E3B4DA}']
  end;

  [JavaSignature('org/w3c/dom/CDATASection')]
  JCDATASection = interface(JText)
    ['{58B470DE-13D3-4B4A-A9B7-5F03E4D4CD75}']
  end;
  TJCDATASection = class(TJavaGenericImport<JCDATASectionClass, JCDATASection>) end;

  JCommentClass = interface(JCharacterDataClass)
    ['{44667247-E701-4F4A-A4A6-1B2C2249BD0E}']
  end;

  [JavaSignature('org/w3c/dom/Comment')]
  JComment = interface(JCharacterData)
    ['{4E3A4920-FC80-4A44-A6A8-DBCC5D94A473}']
  end;
  TJComment = class(TJavaGenericImport<JCommentClass, JComment>) end;

  JDOMConfigurationClass = interface(IJavaClass)
    ['{DECB79BC-0125-4589-A7F9-4515540AE6A2}']
    {class} function getParameter(name: JString): JObject; cdecl;//Deprecated
    {class} function getParameterNames: JDOMStringList; cdecl;//Deprecated
    {class} procedure setParameter(name: JString; value: JObject); cdecl;//Deprecated
  end;

  [JavaSignature('org/w3c/dom/DOMConfiguration')]
  JDOMConfiguration = interface(IJavaInstance)
    ['{E8ABF7F9-F6D5-41BB-939D-8012C99B087D}']
    function canSetParameter(name: JString; value: JObject): Boolean; cdecl;//Deprecated
  end;
  TJDOMConfiguration = class(TJavaGenericImport<JDOMConfigurationClass, JDOMConfiguration>) end;

  JDOMImplementationClass = interface(IJavaClass)
    ['{B1E4F8D3-F1BD-4F6C-B4ED-0310907DF7A4}']
    {class} function createDocument(namespaceURI: JString; qualifiedName: JString; doctype: JDocumentType): JDocument; cdecl;//Deprecated
    {class} function createDocumentType(qualifiedName: JString; publicId: JString; systemId: JString): JDocumentType; cdecl;//Deprecated
  end;

  [JavaSignature('org/w3c/dom/DOMImplementation')]
  JDOMImplementation = interface(IJavaInstance)
    ['{B1DCFB4D-AA66-4B31-A161-7E7D420C0BD4}']
    function getFeature(feature: JString; version: JString): JObject; cdecl;//Deprecated
    function hasFeature(feature: JString; version: JString): Boolean; cdecl;//Deprecated
  end;
  TJDOMImplementation = class(TJavaGenericImport<JDOMImplementationClass, JDOMImplementation>) end;

  JDOMStringListClass = interface(IJavaClass)
    ['{07E16943-A1B1-457E-B687-6BF0DC8A0B2B}']
    {class} function &contains(str: JString): Boolean; cdecl;
  end;

  [JavaSignature('org/w3c/dom/DOMStringList')]
  JDOMStringList = interface(IJavaInstance)
    ['{429D640E-1DB3-442F-9ABF-98965BDEF484}']
    function getLength: Integer; cdecl;
    function item(index: Integer): JString; cdecl;
  end;
  TJDOMStringList = class(TJavaGenericImport<JDOMStringListClass, JDOMStringList>) end;

  JDocumentClass = interface(JNodeClass)
    ['{D6F13E91-584B-40E3-98D4-A49B673E1FAA}']
    {class} function adoptNode(source: JNode): JNode; cdecl;
    {class} function createComment(data: JString): JComment; cdecl;//Deprecated
    {class} function createDocumentFragment: JDocumentFragment; cdecl;//Deprecated
    {class} function createElement(tagName: JString): JElement; cdecl;//Deprecated
    {class} function createTextNode(data: JString): JText; cdecl;//Deprecated
    {class} function getDoctype: JDocumentType; cdecl;//Deprecated
    {class} function getElementById(elementId: JString): JElement; cdecl;//Deprecated
    {class} function getElementsByTagName(tagname: JString): JNodeList; cdecl;//Deprecated
    {class} function getElementsByTagNameNS(namespaceURI: JString; localName: JString): JNodeList; cdecl;//Deprecated
    {class} function getXmlEncoding: JString; cdecl;//Deprecated
    {class} function getXmlStandalone: Boolean; cdecl;//Deprecated
    {class} function getXmlVersion: JString; cdecl;//Deprecated
    {class} procedure setDocumentURI(documentURI: JString); cdecl;
    {class} procedure setStrictErrorChecking(strictErrorChecking: Boolean); cdecl;
    {class} procedure setXmlStandalone(xmlStandalone: Boolean); cdecl;
  end;

  [JavaSignature('org/w3c/dom/Document')]
  JDocument = interface(JNode)
    ['{A1A54941-AF47-44E3-9987-16699E7D7AE8}']
    function createAttribute(name: JString): JAttr; cdecl;//Deprecated
    function createAttributeNS(namespaceURI: JString; qualifiedName: JString): JAttr; cdecl;//Deprecated
    function createCDATASection(data: JString): JCDATASection; cdecl;//Deprecated
    function createElementNS(namespaceURI: JString; qualifiedName: JString): JElement; cdecl;//Deprecated
    function createEntityReference(name: JString): JEntityReference; cdecl;//Deprecated
    function createProcessingInstruction(target: JString; data: JString): JProcessingInstruction; cdecl;//Deprecated
    function getDocumentElement: JElement; cdecl;//Deprecated
    function getDocumentURI: JString; cdecl;//Deprecated
    function getDomConfig: JDOMConfiguration; cdecl;//Deprecated
    function getImplementation: JDOMImplementation; cdecl;//Deprecated
    function getInputEncoding: JString; cdecl;//Deprecated
    function getStrictErrorChecking: Boolean; cdecl;//Deprecated
    function importNode(importedNode: JNode; deep: Boolean): JNode; cdecl;
    procedure normalizeDocument; cdecl;
    function renameNode(n: JNode; namespaceURI: JString; qualifiedName: JString): JNode; cdecl;
    procedure setXmlVersion(xmlVersion: JString); cdecl;
  end;
  TJDocument = class(TJavaGenericImport<JDocumentClass, JDocument>) end;

  JDocumentFragmentClass = interface(JNodeClass)
    ['{C7329109-13F5-4DAF-9B1D-67C135CA426E}']
  end;

  [JavaSignature('org/w3c/dom/DocumentFragment')]
  JDocumentFragment = interface(JNode)
    ['{58188EC9-6A2F-4B05-B94E-0DF20D5C2214}']
  end;
  TJDocumentFragment = class(TJavaGenericImport<JDocumentFragmentClass, JDocumentFragment>) end;

  JDocumentTypeClass = interface(JNodeClass)
    ['{0A107FFB-8693-4B27-9422-07B0ACCAD242}']
    {class} function getName: JString; cdecl;
    {class} function getNotations: JNamedNodeMap; cdecl;
  end;

  [JavaSignature('org/w3c/dom/DocumentType')]
  JDocumentType = interface(JNode)
    ['{CFD608DB-450E-45EA-BEC6-B680E662E816}']
    function getEntities: JNamedNodeMap; cdecl;
    function getInternalSubset: JString; cdecl;
    function getPublicId: JString; cdecl;
    function getSystemId: JString; cdecl;
  end;
  TJDocumentType = class(TJavaGenericImport<JDocumentTypeClass, JDocumentType>) end;

  JElementClass = interface(JNodeClass)
    ['{02A52262-29B4-4297-859E-FDCE017479D5}']
    {class} function getAttribute(name: JString): JString; cdecl;
    {class} function getAttributeNS(namespaceURI: JString; localName: JString): JString; cdecl;
    {class} function getAttributeNode(name: JString): JAttr; cdecl;
    {class} function getSchemaTypeInfo: JTypeInfo; cdecl;
    {class} function getTagName: JString; cdecl;
    {class} function hasAttribute(name: JString): Boolean; cdecl;
    {class} function removeAttributeNode(oldAttr: JAttr): JAttr; cdecl;
    {class} procedure setAttribute(name: JString; value: JString); cdecl;
    {class} procedure setAttributeNS(namespaceURI: JString; qualifiedName: JString; value: JString); cdecl;
    {class} procedure setIdAttributeNS(namespaceURI: JString; localName: JString; isId: Boolean); cdecl;//Deprecated
    {class} procedure setIdAttributeNode(idAttr: JAttr; isId: Boolean); cdecl;//Deprecated
  end;

  [JavaSignature('org/w3c/dom/Element')]
  JElement = interface(JNode)
    ['{953C1ADD-28E2-4725-95C9-B2E518AE79F9}']
    function getAttributeNodeNS(namespaceURI: JString; localName: JString): JAttr; cdecl;
    function getElementsByTagName(name: JString): JNodeList; cdecl;
    function getElementsByTagNameNS(namespaceURI: JString; localName: JString): JNodeList; cdecl;
    function hasAttributeNS(namespaceURI: JString; localName: JString): Boolean; cdecl;
    procedure removeAttribute(name: JString); cdecl;
    procedure removeAttributeNS(namespaceURI: JString; localName: JString); cdecl;
    function setAttributeNode(newAttr: JAttr): JAttr; cdecl;//Deprecated
    function setAttributeNodeNS(newAttr: JAttr): JAttr; cdecl;//Deprecated
    procedure setIdAttribute(name: JString; isId: Boolean); cdecl;//Deprecated
  end;
  TJElement = class(TJavaGenericImport<JElementClass, JElement>) end;

  JEntityReferenceClass = interface(JNodeClass)
    ['{EDE635BA-9CEC-473C-BF75-163686CB36BB}']
  end;

  [JavaSignature('org/w3c/dom/EntityReference')]
  JEntityReference = interface(JNode)
    ['{47BBF06F-638E-47A8-8BE2-1FC93F0A2067}']
  end;
  TJEntityReference = class(TJavaGenericImport<JEntityReferenceClass, JEntityReference>) end;

  JNamedNodeMapClass = interface(IJavaClass)
    ['{FD563D08-BB75-461A-B13C-8C7DF3E00CC5}']
    {class} function getNamedItemNS(namespaceURI: JString; localName: JString): JNode; cdecl;//Deprecated
    {class} function item(index: Integer): JNode; cdecl;//Deprecated
    {class} function removeNamedItem(name: JString): JNode; cdecl;//Deprecated
  end;

  [JavaSignature('org/w3c/dom/NamedNodeMap')]
  JNamedNodeMap = interface(IJavaInstance)
    ['{92F9509D-82EA-4290-A970-7BB551F08679}']
    function getLength: Integer; cdecl;//Deprecated
    function getNamedItem(name: JString): JNode; cdecl;//Deprecated
    function removeNamedItemNS(namespaceURI: JString; localName: JString): JNode; cdecl;//Deprecated
    function setNamedItem(arg: JNode): JNode; cdecl;//Deprecated
    function setNamedItemNS(arg: JNode): JNode; cdecl;//Deprecated
  end;
  TJNamedNodeMap = class(TJavaGenericImport<JNamedNodeMapClass, JNamedNodeMap>) end;

  JProcessingInstructionClass = interface(JNodeClass)
    ['{9B71FB69-7682-435D-9031-529E15076309}']
    {class} function getData: JString; cdecl;
    {class} function getTarget: JString; cdecl;
    {class} procedure setData(data: JString); cdecl;
  end;

  [JavaSignature('org/w3c/dom/ProcessingInstruction')]
  JProcessingInstruction = interface(JNode)
    ['{50F37F5A-E5A2-4190-B19F-820997AF3D4C}']
  end;
  TJProcessingInstruction = class(TJavaGenericImport<JProcessingInstructionClass, JProcessingInstruction>) end;

  JTypeInfoClass = interface(IJavaClass)
    ['{532BAFC7-6829-43E4-9478-E739B90EE1FC}']
    {class} function _GetDERIVATION_EXTENSION: Integer; cdecl;
    {class} function _GetDERIVATION_LIST: Integer; cdecl;
    {class} function _GetDERIVATION_RESTRICTION: Integer; cdecl;
    {class} function _GetDERIVATION_UNION: Integer; cdecl;
    {class} function getTypeName: JString; cdecl;//Deprecated
    {class} property DERIVATION_EXTENSION: Integer read _GetDERIVATION_EXTENSION;
    {class} property DERIVATION_LIST: Integer read _GetDERIVATION_LIST;
    {class} property DERIVATION_RESTRICTION: Integer read _GetDERIVATION_RESTRICTION;
    {class} property DERIVATION_UNION: Integer read _GetDERIVATION_UNION;
  end;

  [JavaSignature('org/w3c/dom/TypeInfo')]
  JTypeInfo = interface(IJavaInstance)
    ['{876A11F9-8450-45FF-8F4F-F9D68333BDEF}']
    function getTypeNamespace: JString; cdecl;//Deprecated
    function isDerivedFrom(typeNamespaceArg: JString; typeNameArg: JString; derivationMethod: Integer): Boolean; cdecl;//Deprecated
  end;
  TJTypeInfo = class(TJavaGenericImport<JTypeInfoClass, JTypeInfo>) end;

  JUserDataHandlerClass = interface(IJavaClass)
    ['{AD3B738E-675E-4B2E-869D-6888E7959C0B}']
    {class} function _GetNODE_ADOPTED: SmallInt; cdecl;
    {class} function _GetNODE_CLONED: SmallInt; cdecl;
    {class} function _GetNODE_DELETED: SmallInt; cdecl;
    {class} function _GetNODE_IMPORTED: SmallInt; cdecl;
    {class} function _GetNODE_RENAMED: SmallInt; cdecl;
    {class} procedure handle(operation: SmallInt; key: JString; data: JObject; src: JNode; dst: JNode); cdecl;//Deprecated
    {class} property NODE_ADOPTED: SmallInt read _GetNODE_ADOPTED;
    {class} property NODE_CLONED: SmallInt read _GetNODE_CLONED;
    {class} property NODE_DELETED: SmallInt read _GetNODE_DELETED;
    {class} property NODE_IMPORTED: SmallInt read _GetNODE_IMPORTED;
    {class} property NODE_RENAMED: SmallInt read _GetNODE_RENAMED;
  end;

  [JavaSignature('org/w3c/dom/UserDataHandler')]
  JUserDataHandler = interface(IJavaInstance)
    ['{F3E555E4-F55C-4228-B9D6-4494A3E32FDF}']
  end;
  TJUserDataHandler = class(TJavaGenericImport<JUserDataHandlerClass, JUserDataHandler>) end;

implementation

procedure RegisterTypes;
begin
  TRegTypes.RegisterType('Elgin.JNI.E1.JAnimator', TypeInfo(Elgin.JNI.E1.JAnimator));
  TRegTypes.RegisterType('Elgin.JNI.E1.JAnimator_AnimatorListener', TypeInfo(Elgin.JNI.E1.JAnimator_AnimatorListener));
  TRegTypes.RegisterType('Elgin.JNI.E1.JAnimator_AnimatorPauseListener', TypeInfo(Elgin.JNI.E1.JAnimator_AnimatorPauseListener));
  TRegTypes.RegisterType('Elgin.JNI.E1.JKeyframe', TypeInfo(Elgin.JNI.E1.JKeyframe));
  TRegTypes.RegisterType('Elgin.JNI.E1.JLayoutTransition', TypeInfo(Elgin.JNI.E1.JLayoutTransition));
  TRegTypes.RegisterType('Elgin.JNI.E1.JLayoutTransition_TransitionListener', TypeInfo(Elgin.JNI.E1.JLayoutTransition_TransitionListener));
  TRegTypes.RegisterType('Elgin.JNI.E1.JPropertyValuesHolder', TypeInfo(Elgin.JNI.E1.JPropertyValuesHolder));
  TRegTypes.RegisterType('Elgin.JNI.E1.JStateListAnimator', TypeInfo(Elgin.JNI.E1.JStateListAnimator));
  TRegTypes.RegisterType('Elgin.JNI.E1.JTimeInterpolator', TypeInfo(Elgin.JNI.E1.JTimeInterpolator));
  TRegTypes.RegisterType('Elgin.JNI.E1.JTypeConverter', TypeInfo(Elgin.JNI.E1.JTypeConverter));
  TRegTypes.RegisterType('Elgin.JNI.E1.JTypeEvaluator', TypeInfo(Elgin.JNI.E1.JTypeEvaluator));
  TRegTypes.RegisterType('Elgin.JNI.E1.JValueAnimator', TypeInfo(Elgin.JNI.E1.JValueAnimator));
  TRegTypes.RegisterType('Elgin.JNI.E1.JValueAnimator_AnimatorUpdateListener', TypeInfo(Elgin.JNI.E1.JValueAnimator_AnimatorUpdateListener));
  TRegTypes.RegisterType('Elgin.JNI.E1.JPathMotion', TypeInfo(Elgin.JNI.E1.JPathMotion));
  TRegTypes.RegisterType('Elgin.JNI.E1.JScene', TypeInfo(Elgin.JNI.E1.JScene));
  TRegTypes.RegisterType('Elgin.JNI.E1.JTransition', TypeInfo(Elgin.JNI.E1.JTransition));
  TRegTypes.RegisterType('Elgin.JNI.E1.JTransition_EpicenterCallback', TypeInfo(Elgin.JNI.E1.JTransition_EpicenterCallback));
  TRegTypes.RegisterType('Elgin.JNI.E1.JTransition_TransitionListener', TypeInfo(Elgin.JNI.E1.JTransition_TransitionListener));
  TRegTypes.RegisterType('Elgin.JNI.E1.JTransitionManager', TypeInfo(Elgin.JNI.E1.JTransitionManager));
  TRegTypes.RegisterType('Elgin.JNI.E1.JTransitionPropagation', TypeInfo(Elgin.JNI.E1.JTransitionPropagation));
  TRegTypes.RegisterType('Elgin.JNI.E1.JTransitionValues', TypeInfo(Elgin.JNI.E1.JTransitionValues));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterpolator', TypeInfo(Elgin.JNI.E1.JInterpolator));
  TRegTypes.RegisterType('Elgin.JNI.E1.JToolbar_LayoutParams', TypeInfo(Elgin.JNI.E1.JToolbar_LayoutParams));
  TRegTypes.RegisterType('Elgin.JNI.E1.JBalanca', TypeInfo(Elgin.JNI.E1.JBalanca));
  TRegTypes.RegisterType('Elgin.JNI.E1.JBalanca_Config', TypeInfo(Elgin.JNI.E1.JBalanca_Config));
  TRegTypes.RegisterType('Elgin.JNI.E1.JBalanca_ConfigAltValues', TypeInfo(Elgin.JNI.E1.JBalanca_ConfigAltValues));
  TRegTypes.RegisterType('Elgin.JNI.E1.JBalanca_ModeloBalanca', TypeInfo(Elgin.JNI.E1.JBalanca_ModeloBalanca));
  TRegTypes.RegisterType('Elgin.JNI.E1.JBalanca_ProtocoloComunicacao', TypeInfo(Elgin.JNI.E1.JBalanca_ProtocoloComunicacao));
  TRegTypes.RegisterType('Elgin.JNI.E1.JBalancaE1', TypeInfo(Elgin.JNI.E1.JBalancaE1));
  TRegTypes.RegisterType('Elgin.JNI.E1.JBalancas', TypeInfo(Elgin.JNI.E1.JBalancas));
  TRegTypes.RegisterType('Elgin.JNI.E1.JComm', TypeInfo(Elgin.JNI.E1.JComm));
  TRegTypes.RegisterType('Elgin.JNI.E1.JComm_1', TypeInfo(Elgin.JNI.E1.JComm_1));
  TRegTypes.RegisterType('Elgin.JNI.E1.JComm_TipoConexao', TypeInfo(Elgin.JNI.E1.JComm_TipoConexao));
  TRegTypes.RegisterType('Elgin.JNI.E1.JCommSerial', TypeInfo(Elgin.JNI.E1.JCommSerial));
  TRegTypes.RegisterType('Elgin.JNI.E1.JCommTCP', TypeInfo(Elgin.JNI.E1.JCommTCP));
  TRegTypes.RegisterType('Elgin.JNI.E1.JCommTCP_Timeouts', TypeInfo(Elgin.JNI.E1.JCommTCP_Timeouts));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceBalanca', TypeInfo(Elgin.JNI.E1.JInterfaceBalanca));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoBalanca', TypeInfo(Elgin.JNI.E1.JImplementacaoBalanca));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoBalanca_1', TypeInfo(Elgin.JNI.E1.JImplementacaoBalanca_1));
  TRegTypes.RegisterType('Elgin.JNI.E1.Je1_BuildConfig', TypeInfo(Elgin.JNI.E1.Je1_BuildConfig));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConexao', TypeInfo(Elgin.JNI.E1.JConexao));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConBluetooth', TypeInfo(Elgin.JNI.E1.JConBluetooth));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConBluetooth_1GetBluetoothData', TypeInfo(Elgin.JNI.E1.JConBluetooth_1GetBluetoothData));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConBluetooth_1GetPrinterBluetooth', TypeInfo(Elgin.JNI.E1.JConBluetooth_1GetPrinterBluetooth));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConBluetooth_1SendData', TypeInfo(Elgin.JNI.E1.JConBluetooth_1SendData));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConM8', TypeInfo(Elgin.JNI.E1.JConM8));
  TRegTypes.RegisterType('Elgin.JNI.E1.JPrinterManager_PrinterManagerListener', TypeInfo(Elgin.JNI.E1.JPrinterManager_PrinterManagerListener));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConM8_1', TypeInfo(Elgin.JNI.E1.JConM8_1));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConSerial', TypeInfo(Elgin.JNI.E1.JConSerial));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConService', TypeInfo(Elgin.JNI.E1.JConService));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConService_1GetData', TypeInfo(Elgin.JNI.E1.JConService_1GetData));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConService_1GetPrinter', TypeInfo(Elgin.JNI.E1.JConService_1GetPrinter));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConService_1SendData', TypeInfo(Elgin.JNI.E1.JConService_1SendData));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConService_2GetData', TypeInfo(Elgin.JNI.E1.JConService_2GetData));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConSmartPOS', TypeInfo(Elgin.JNI.E1.JConSmartPOS));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConTCP_IP', TypeInfo(Elgin.JNI.E1.JConTCP_IP));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConTCP_IP_1GetData', TypeInfo(Elgin.JNI.E1.JConTCP_IP_1GetData));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConTCP_IP_1GetPrinter', TypeInfo(Elgin.JNI.E1.JConTCP_IP_1GetPrinter));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConTCP_IP_1SendData', TypeInfo(Elgin.JNI.E1.JConTCP_IP_1SendData));
  TRegTypes.RegisterType('Elgin.JNI.E1.JConUSB', TypeInfo(Elgin.JNI.E1.JConUSB));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceFactoryXMLSAT', TypeInfo(Elgin.JNI.E1.JInterfaceFactoryXMLSAT));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoFactoryXMLSAT', TypeInfo(Elgin.JNI.E1.JImplementacaoFactoryXMLSAT));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceSAT', TypeInfo(Elgin.JNI.E1.JInterfaceSAT));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoSAT', TypeInfo(Elgin.JNI.E1.JImplementacaoSAT));
  TRegTypes.RegisterType('Elgin.JNI.E1.JMFe', TypeInfo(Elgin.JNI.E1.JMFe));
  TRegTypes.RegisterType('Elgin.JNI.E1.JNFCe', TypeInfo(Elgin.JNI.E1.JNFCe));
  TRegTypes.RegisterType('Elgin.JNI.E1.JSAT', TypeInfo(Elgin.JNI.E1.JSAT));
  TRegTypes.RegisterType('Elgin.JNI.E1.JAndroid', TypeInfo(Elgin.JNI.E1.JAndroid));
  TRegTypes.RegisterType('Elgin.JNI.E1.JdsImpressora', TypeInfo(Elgin.JNI.E1.JdsImpressora));
  TRegTypes.RegisterType('Elgin.JNI.E1.JdsImpressora_1', TypeInfo(Elgin.JNI.E1.JdsImpressora_1));
  TRegTypes.RegisterType('Elgin.JNI.E1.JdsImpressora_infoHW', TypeInfo(Elgin.JNI.E1.JdsImpressora_infoHW));
  TRegTypes.RegisterType('Elgin.JNI.E1.JdsSAT', TypeInfo(Elgin.JNI.E1.JdsSAT));
  TRegTypes.RegisterType('Elgin.JNI.E1.JdsSAT_1', TypeInfo(Elgin.JNI.E1.JdsSAT_1));
  TRegTypes.RegisterType('Elgin.JNI.E1.JdsSAT_ChaveDePesquisa', TypeInfo(Elgin.JNI.E1.JdsSAT_ChaveDePesquisa));
  TRegTypes.RegisterType('Elgin.JNI.E1.JEtiqueta', TypeInfo(Elgin.JNI.E1.JEtiqueta));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceAndroid', TypeInfo(Elgin.JNI.E1.JInterfaceAndroid));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoAndroid', TypeInfo(Elgin.JNI.E1.JImplementacaoAndroid));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoAndroid_IIImpressaoTexto', TypeInfo(Elgin.JNI.E1.JImplementacaoAndroid_IIImpressaoTexto));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceBematech', TypeInfo(Elgin.JNI.E1.JInterfaceBematech));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoBematech', TypeInfo(Elgin.JNI.E1.JImplementacaoBematech));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceEtiqueta', TypeInfo(Elgin.JNI.E1.JInterfaceEtiqueta));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoEtiqueta', TypeInfo(Elgin.JNI.E1.JImplementacaoEtiqueta));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoM8', TypeInfo(Elgin.JNI.E1.JImplementacaoM8));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoM8_1', TypeInfo(Elgin.JNI.E1.JImplementacaoM8_1));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoSmartPOS', TypeInfo(Elgin.JNI.E1.JImplementacaoSmartPOS));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoSmartPOS_1', TypeInfo(Elgin.JNI.E1.JImplementacaoSmartPOS_1));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceTermica', TypeInfo(Elgin.JNI.E1.JInterfaceTermica));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoTermica', TypeInfo(Elgin.JNI.E1.JImplementacaoTermica));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceM8', TypeInfo(Elgin.JNI.E1.JInterfaceM8));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceSmartPOS', TypeInfo(Elgin.JNI.E1.JInterfaceSmartPOS));
  TRegTypes.RegisterType('Elgin.JNI.E1.JMiniPDVM8', TypeInfo(Elgin.JNI.E1.JMiniPDVM8));
  TRegTypes.RegisterType('Elgin.JNI.E1.JSmart', TypeInfo(Elgin.JNI.E1.JSmart));
  TRegTypes.RegisterType('Elgin.JNI.E1.JTermica', TypeInfo(Elgin.JNI.E1.JTermica));
  TRegTypes.RegisterType('Elgin.JNI.E1.JCodigoErro', TypeInfo(Elgin.JNI.E1.JCodigoErro));
  TRegTypes.RegisterType('Elgin.JNI.E1.JESCPOS', TypeInfo(Elgin.JNI.E1.JESCPOS));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInteiro', TypeInfo(Elgin.JNI.E1.JInteiro));
  TRegTypes.RegisterType('Elgin.JNI.E1.JPPLA', TypeInfo(Elgin.JNI.E1.JPPLA));
  TRegTypes.RegisterType('Elgin.JNI.E1.JUtilidades', TypeInfo(Elgin.JNI.E1.JUtilidades));
  TRegTypes.RegisterType('Elgin.JNI.E1.JNodeList', TypeInfo(Elgin.JNI.E1.JNodeList));
  TRegTypes.RegisterType('Elgin.JNI.E1.JUtilidades_1', TypeInfo(Elgin.JNI.E1.JUtilidades_1));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceOBJXMLPRODUTO', TypeInfo(Elgin.JNI.E1.JInterfaceOBJXMLPRODUTO));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoOBJXMLPRODUTO', TypeInfo(Elgin.JNI.E1.JImplementacaoOBJXMLPRODUTO));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoOBJPRODUTOXMLNFCE', TypeInfo(Elgin.JNI.E1.JImplementacaoOBJPRODUTOXMLNFCE));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoOBJPRODUTOXMLSAT', TypeInfo(Elgin.JNI.E1.JImplementacaoOBJPRODUTOXMLSAT));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceOBJXML', TypeInfo(Elgin.JNI.E1.JInterfaceOBJXML));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoOBJXML', TypeInfo(Elgin.JNI.E1.JImplementacaoOBJXML));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoOBJXML_1', TypeInfo(Elgin.JNI.E1.JImplementacaoOBJXML_1));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoOBJXML_infoPag', TypeInfo(Elgin.JNI.E1.JImplementacaoOBJXML_infoPag));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoOBJXMLCANCELAMENTO', TypeInfo(Elgin.JNI.E1.JImplementacaoOBJXMLCANCELAMENTO));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoOBJXMLNFCE', TypeInfo(Elgin.JNI.E1.JImplementacaoOBJXMLNFCE));
  TRegTypes.RegisterType('Elgin.JNI.E1.JImplementacaoOBJXMLSAT', TypeInfo(Elgin.JNI.E1.JImplementacaoOBJXMLSAT));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceOBJPRODUTOXMLNFCE', TypeInfo(Elgin.JNI.E1.JInterfaceOBJPRODUTOXMLNFCE));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceOBJPRODUTOXMLSAT', TypeInfo(Elgin.JNI.E1.JInterfaceOBJPRODUTOXMLSAT));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceOBJXMLCANCELAMENTO', TypeInfo(Elgin.JNI.E1.JInterfaceOBJXMLCANCELAMENTO));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceOBJXMLNFCE', TypeInfo(Elgin.JNI.E1.JInterfaceOBJXMLNFCE));
  TRegTypes.RegisterType('Elgin.JNI.E1.JInterfaceOBJXMLSAT', TypeInfo(Elgin.JNI.E1.JInterfaceOBJXMLSAT));
  TRegTypes.RegisterType('Elgin.JNI.E1.JScanner_Scanner', TypeInfo(Elgin.JNI.E1.JScanner_Scanner));
  TRegTypes.RegisterType('Elgin.JNI.E1.JAssinaturas', TypeInfo(Elgin.JNI.E1.JAssinaturas));
  TRegTypes.RegisterType('Elgin.JNI.E1.JParametros', TypeInfo(Elgin.JNI.E1.JParametros));
  TRegTypes.RegisterType('Elgin.JNI.E1.JServicoE1', TypeInfo(Elgin.JNI.E1.JServicoE1));
  TRegTypes.RegisterType('Elgin.JNI.E1.JServicoE1_Etiqueta', TypeInfo(Elgin.JNI.E1.JServicoE1_Etiqueta));
  TRegTypes.RegisterType('Elgin.JNI.E1.JServicoE1_SAT', TypeInfo(Elgin.JNI.E1.JServicoE1_SAT));
  TRegTypes.RegisterType('Elgin.JNI.E1.JServicoE1_Termica', TypeInfo(Elgin.JNI.E1.JServicoE1_Termica));
  TRegTypes.RegisterType('Elgin.JNI.E1.Jminipdvm8_BuildConfig', TypeInfo(Elgin.JNI.E1.Jminipdvm8_BuildConfig));
  TRegTypes.RegisterType('Elgin.JNI.E1.JPrinterManager', TypeInfo(Elgin.JNI.E1.JPrinterManager));
  TRegTypes.RegisterType('Elgin.JNI.E1.JPrinterManager_1', TypeInfo(Elgin.JNI.E1.JPrinterManager_1));
  TRegTypes.RegisterType('Elgin.JNI.E1.JIPrinterCallback_Stub', TypeInfo(Elgin.JNI.E1.JIPrinterCallback_Stub));
  TRegTypes.RegisterType('Elgin.JNI.E1.JPrinterManager_2', TypeInfo(Elgin.JNI.E1.JPrinterManager_2));
  TRegTypes.RegisterType('Elgin.JNI.E1.Jcloudpossdk_aar_slim_BuildConfig', TypeInfo(Elgin.JNI.E1.Jcloudpossdk_aar_slim_BuildConfig));
  TRegTypes.RegisterType('Elgin.JNI.E1.JCommSerialAPI', TypeInfo(Elgin.JNI.E1.JCommSerialAPI));
  TRegTypes.RegisterType('Elgin.JNI.E1.JComportNative', TypeInfo(Elgin.JNI.E1.JComportNative));
  TRegTypes.RegisterType('Elgin.JNI.E1.JIPrinterCallback', TypeInfo(Elgin.JNI.E1.JIPrinterCallback));
  TRegTypes.RegisterType('Elgin.JNI.E1.JIPrinterCallback_Stub_Proxy', TypeInfo(Elgin.JNI.E1.JIPrinterCallback_Stub_Proxy));
  TRegTypes.RegisterType('Elgin.JNI.E1.JIPrinterService', TypeInfo(Elgin.JNI.E1.JIPrinterService));
  TRegTypes.RegisterType('Elgin.JNI.E1.JIPrinterService_Stub', TypeInfo(Elgin.JNI.E1.JIPrinterService_Stub));
  TRegTypes.RegisterType('Elgin.JNI.E1.JIPrinterService_Stub_Proxy', TypeInfo(Elgin.JNI.E1.JIPrinterService_Stub_Proxy));
  TRegTypes.RegisterType('Elgin.JNI.E1.JNode', TypeInfo(Elgin.JNI.E1.JNode));
  TRegTypes.RegisterType('Elgin.JNI.E1.JAttr', TypeInfo(Elgin.JNI.E1.JAttr));
  TRegTypes.RegisterType('Elgin.JNI.E1.JCharacterData', TypeInfo(Elgin.JNI.E1.JCharacterData));
  TRegTypes.RegisterType('Elgin.JNI.E1.JText', TypeInfo(Elgin.JNI.E1.JText));
  TRegTypes.RegisterType('Elgin.JNI.E1.JCDATASection', TypeInfo(Elgin.JNI.E1.JCDATASection));
  TRegTypes.RegisterType('Elgin.JNI.E1.JComment', TypeInfo(Elgin.JNI.E1.JComment));
  TRegTypes.RegisterType('Elgin.JNI.E1.JDOMConfiguration', TypeInfo(Elgin.JNI.E1.JDOMConfiguration));
  TRegTypes.RegisterType('Elgin.JNI.E1.JDOMImplementation', TypeInfo(Elgin.JNI.E1.JDOMImplementation));
  TRegTypes.RegisterType('Elgin.JNI.E1.JDOMStringList', TypeInfo(Elgin.JNI.E1.JDOMStringList));
  TRegTypes.RegisterType('Elgin.JNI.E1.JDocument', TypeInfo(Elgin.JNI.E1.JDocument));
  TRegTypes.RegisterType('Elgin.JNI.E1.JDocumentFragment', TypeInfo(Elgin.JNI.E1.JDocumentFragment));
  TRegTypes.RegisterType('Elgin.JNI.E1.JDocumentType', TypeInfo(Elgin.JNI.E1.JDocumentType));
  TRegTypes.RegisterType('Elgin.JNI.E1.JElement', TypeInfo(Elgin.JNI.E1.JElement));
  TRegTypes.RegisterType('Elgin.JNI.E1.JEntityReference', TypeInfo(Elgin.JNI.E1.JEntityReference));
  TRegTypes.RegisterType('Elgin.JNI.E1.JNamedNodeMap', TypeInfo(Elgin.JNI.E1.JNamedNodeMap));
  TRegTypes.RegisterType('Elgin.JNI.E1.JProcessingInstruction', TypeInfo(Elgin.JNI.E1.JProcessingInstruction));
  TRegTypes.RegisterType('Elgin.JNI.E1.JTypeInfo', TypeInfo(Elgin.JNI.E1.JTypeInfo));
  TRegTypes.RegisterType('Elgin.JNI.E1.JUserDataHandler', TypeInfo(Elgin.JNI.E1.JUserDataHandler));
end;

initialization
  RegisterTypes;
end.

