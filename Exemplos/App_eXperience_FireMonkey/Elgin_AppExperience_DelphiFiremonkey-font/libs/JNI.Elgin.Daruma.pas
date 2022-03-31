
unit JNI.Elgin.Daruma;

interface

uses
  Androidapi.JNIBridge,
  Androidapi.JNI.App,
  Androidapi.JNI.GraphicsContentViewText,
  Androidapi.JNI.Hardware,
  Androidapi.JNI.Java.Net,
  Androidapi.JNI.Java.Security,
  Androidapi.JNI.JavaTypes,
  Androidapi.JNI.Media,
  Androidapi.JNI.Net,
  Androidapi.JNI.Os,
  Androidapi.JNI.Util,
  Androidapi.JNI.Widget;

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
  JUsbAccessory = interface;//android.hardware.usb.UsbAccessory
  JUsbConfiguration = interface;//android.hardware.usb.UsbConfiguration
  JUsbDevice = interface;//android.hardware.usb.UsbDevice
  JUsbDeviceConnection = interface;//android.hardware.usb.UsbDeviceConnection
  JUsbEndpoint = interface;//android.hardware.usb.UsbEndpoint
  JUsbInterface = interface;//android.hardware.usb.UsbInterface
  JUsbManager = interface;//android.hardware.usb.UsbManager
  JUsbRequest = interface;//android.hardware.usb.UsbRequest
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
  JAppInitializer = interface;//androidx.startup.AppInitializer
  JInitializationProvider = interface;//androidx.startup.InitializationProvider
  JInitializer = interface;//androidx.startup.Initializer
  JStartupException = interface;//androidx.startup.StartupException
  JStartupLogger = interface;//androidx.startup.StartupLogger
  JPrinterManager_PrinterManagerListener = interface;//br.com.daruma.framework.mobile.PrinterManager$PrinterManagerListener
  JDarumaMobile = interface;//br.com.daruma.framework.mobile.DarumaMobile
  JDarumaMobile_1 = interface;//br.com.daruma.framework.mobile.DarumaMobile$1
  JDarumaMobile_2 = interface;//br.com.daruma.framework.mobile.DarumaMobile$2
  JDarumaMobile_3 = interface;//br.com.daruma.framework.mobile.DarumaMobile$3
  JITraceListener = interface;//br.com.daruma.framework.mobile.log.listeners.ITraceListener
  JDarumaMobile_LogMemoria = interface;//br.com.daruma.framework.mobile.DarumaMobile$LogMemoria
  JPrinterManager = interface;//br.com.daruma.framework.mobile.PrinterManager
  JPrinterManager_1 = interface;//br.com.daruma.framework.mobile.PrinterManager$1
  JIPrinterCallback_Stub = interface;//com.xcheng.printerservice.IPrinterCallback$Stub
  JPrinterManager_2 = interface;//br.com.daruma.framework.mobile.PrinterManager$2
  JThreadPoolManager = interface;//br.com.daruma.framework.mobile.ThreadPoolManager
  JZXingLibConfig = interface;//br.com.daruma.framework.mobile.camera.dependencies.config.ZXingLibConfig
  JDarumaConfigScanner = interface;//br.com.daruma.framework.mobile.camera.DarumaConfigScanner
  JDarumaDecoder = interface;//br.com.daruma.framework.mobile.camera.DarumaDecoder
  JDarumaScanResult = interface;//br.com.daruma.framework.mobile.camera.DarumaScanResult
  JISendHandler = interface;//br.com.daruma.framework.mobile.camera.dependencies.ISendHandler
  JDarumaScanner = interface;//br.com.daruma.framework.mobile.camera.DarumaScanner
  JDarumaScannerHandler = interface;//br.com.daruma.framework.mobile.camera.DarumaScannerHandler
  JDarumaScannerHandler_State = interface;//br.com.daruma.framework.mobile.camera.DarumaScannerHandler$State
  JBeepManager = interface;//br.com.daruma.framework.mobile.camera.dependencies.BeepManager
  JBeepManager_1 = interface;//br.com.daruma.framework.mobile.camera.dependencies.BeepManager$1
//  JDecodeAsyncTask = interface;//br.com.daruma.framework.mobile.camera.dependencies.DecodeAsyncTask
  JDecodeFormatManager = interface;//br.com.daruma.framework.mobile.camera.dependencies.DecodeFormatManager
  JDecodeHandler = interface;//br.com.daruma.framework.mobile.camera.dependencies.DecodeHandler
  JDecodeThread = interface;//br.com.daruma.framework.mobile.camera.dependencies.DecodeThread
  JFinishListener = interface;//br.com.daruma.framework.mobile.camera.dependencies.FinishListener
  JInactivityTimer = interface;//br.com.daruma.framework.mobile.camera.dependencies.InactivityTimer
  JInactivityTimer_1 = interface;//br.com.daruma.framework.mobile.camera.dependencies.InactivityTimer$1
  JInactivityTimer_DaemonThreadFactory = interface;//br.com.daruma.framework.mobile.camera.dependencies.InactivityTimer$DaemonThreadFactory
  JInactivityTimer_PowerStatusReceiver = interface;//br.com.daruma.framework.mobile.camera.dependencies.InactivityTimer$PowerStatusReceiver
  JIntents = interface;//br.com.daruma.framework.mobile.camera.dependencies.Intents
  JIntents_Scan = interface;//br.com.daruma.framework.mobile.camera.dependencies.Intents$Scan
  //JViewfinderResultPointCallback = interface;//br.com.daruma.framework.mobile.camera.dependencies.ViewfinderResultPointCallback
  JViewfinderView = interface;//br.com.daruma.framework.mobile.camera.dependencies.ViewfinderView
  JAutoFocusCallback = interface;//br.com.daruma.framework.mobile.camera.dependencies.camera.AutoFocusCallback
  JCameraConfigurationManager = interface;//br.com.daruma.framework.mobile.camera.dependencies.camera.CameraConfigurationManager
  Jcamera_CameraManager = interface;//br.com.daruma.framework.mobile.camera.dependencies.camera.CameraManager
  JFlashlightManager = interface;//br.com.daruma.framework.mobile.camera.dependencies.camera.FlashlightManager
  //JPlanarYUVLuminanceSource = interface;//br.com.daruma.framework.mobile.camera.dependencies.camera.PlanarYUVLuminanceSource
  JPreviewCallback = interface;//br.com.daruma.framework.mobile.camera.dependencies.camera.PreviewCallback
  JIVariaveisScaner = interface;//br.com.daruma.framework.mobile.camera.dependencies.integrator.IVariaveisScaner
  JAComunicacao = interface;//br.com.daruma.framework.mobile.comunicacao.AComunicacao
  Jexception_DarumaException = interface;//br.com.daruma.framework.mobile.comunicacao.exception.DarumaException
  Jexception_DarumaComunicacaoException = interface;//br.com.daruma.framework.mobile.comunicacao.exception.DarumaComunicacaoException
  JDarumaECFException = interface;//br.com.daruma.framework.mobile.comunicacao.exception.DarumaECFException
  JBluetoothDaruma = interface;//br.com.daruma.framework.mobile.comunicacao.impl.BluetoothDaruma
  JBluetoothDaruma_ReadTask = interface;//br.com.daruma.framework.mobile.comunicacao.impl.BluetoothDaruma$ReadTask
  JComunicacaoNaoImpl = interface;//br.com.daruma.framework.mobile.comunicacao.impl.ComunicacaoNaoImpl
  JSerialDaruma = interface;//br.com.daruma.framework.mobile.comunicacao.impl.SerialDaruma
  JSocketDaruma = interface;//br.com.daruma.framework.mobile.comunicacao.impl.SocketDaruma
  JUsbDaruma = interface;//br.com.daruma.framework.mobile.comunicacao.impl.UsbDaruma
  JConstantesFramework = interface;//br.com.daruma.framework.mobile.constantes.ConstantesFramework
  JConstantesGenerico = interface;//br.com.daruma.framework.mobile.constantes.ConstantesGenerico
  JConstantesSocket = interface;//br.com.daruma.framework.mobile.constantes.ConstantesSocket
  JIConstantesComunicacao = interface;//br.com.daruma.framework.mobile.constantes.IConstantesComunicacao
  JDarumaCheckedException = interface;//br.com.daruma.framework.mobile.exception.DarumaCheckedException
  JDarumaException = interface;//br.com.daruma.framework.mobile.exception.DarumaException
  JDarumaComunicacaoException = interface;//br.com.daruma.framework.mobile.exception.DarumaComunicacaoException
  Jexception_DarumaECFException = interface;//br.com.daruma.framework.mobile.exception.DarumaECFException
  JDarumaSatException = interface;//br.com.daruma.framework.mobile.exception.DarumaSatException
  JDarumaScanException = interface;//br.com.daruma.framework.mobile.exception.DarumaScanException
  JDarumaWebServiceException = interface;//br.com.daruma.framework.mobile.exception.DarumaWebServiceException
  Jgne_Utils = interface;//br.com.daruma.framework.mobile.gne.Utils
  JBMP = interface;//br.com.daruma.framework.mobile.gne.BMP
  JOp_XmlConsulta = interface;//br.com.daruma.framework.mobile.gne.Op_XmlConsulta
  JPersistencia = interface;//br.com.daruma.framework.mobile.gne.Persistencia
  JPersistenciaAuxiliar = interface;//br.com.daruma.framework.mobile.gne.PersistenciaAuxiliar
  JProcessos = interface;//br.com.daruma.framework.mobile.gne.Processos
  JTags = interface;//br.com.daruma.framework.mobile.gne.Tags
  JFormatacao = interface;//br.com.daruma.framework.mobile.gne.imp.Formatacao
  JDaruma = interface;//br.com.daruma.framework.mobile.gne.imp.Daruma
  JDaruma_2100 = interface;//br.com.daruma.framework.mobile.gne.imp.Daruma_2100
  JDaruma_250 = interface;//br.com.daruma.framework.mobile.gne.imp.Daruma_250
  JDaruma_350 = interface;//br.com.daruma.framework.mobile.gne.imp.Daruma_350
  JDascom = interface;//br.com.daruma.framework.mobile.gne.imp.Dascom
  JDatec_250 = interface;//br.com.daruma.framework.mobile.gne.imp.Datec_250
  JDatec_350 = interface;//br.com.daruma.framework.mobile.gne.imp.Datec_350
  JEPSON = interface;//br.com.daruma.framework.mobile.gne.imp.EPSON
  JFormatacaoAscii = interface;//br.com.daruma.framework.mobile.gne.imp.FormatacaoAscii
  JM10 = interface;//br.com.daruma.framework.mobile.gne.imp.M10
  JNonus = interface;//br.com.daruma.framework.mobile.gne.imp.Nonus
  JAberturaNfce = interface;//br.com.daruma.framework.mobile.gne.nfce.AberturaNfce
  JAcrescimo = interface;//br.com.daruma.framework.mobile.gne.nfce.Acrescimo
  JConfiguraCofinsAliq = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraCofinsAliq
  JConfiguraCofinsNT = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraCofinsNT
  JConfiguraCofinsOutr = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraCofinsOutr
  JConfiguraCofinsQtde = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraCofinsQtde
  JConfiguraCofinsSn = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraCofinsSn
  JConfiguraCombustivel = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraCombustivel
  JConfiguraICMS00 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMS00
  JConfiguraICMS10 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMS10
  JConfiguraICMS20 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMS20
  JConfiguraICMS30 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMS30
  JConfiguraICMS40 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMS40
  JConfiguraICMS51 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMS51
  JConfiguraICMS60 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMS60
  JConfiguraICMS70 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMS70
  JConfiguraICMS90 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMS90
  JConfiguraICMSPart = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMSPart
  JConfiguraICMSSN101 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMSSN101
  JConfiguraICMSSN102 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMSSN102
  JConfiguraICMSSN201 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMSSN201
  JConfiguraICMSSN202 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMSSN202
  JConfiguraICMSSN500 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMSSN500
  JConfiguraICMSSN900 = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMSSN900
  JConfiguraICMSST = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraICMSST
  JConfiguraLeiImposto = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraLeiImposto
  JConfiguraPisAliq = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraPisAliq
  JConfiguraPisNT = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraPisNT
  JConfiguraPisOutr = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraPisOutr
  JConfiguraPisQtde = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraPisQtde
  JConfiguraPisSn = interface;//br.com.daruma.framework.mobile.gne.nfce.ConfiguraPisSn
  JDescontos = interface;//br.com.daruma.framework.mobile.gne.nfce.Descontos
  JEncerramento = interface;//br.com.daruma.framework.mobile.gne.nfce.Encerramento
  JIdentificarConsumidor = interface;//br.com.daruma.framework.mobile.gne.nfce.IdentificarConsumidor
  Jnfce_Item = interface;//br.com.daruma.framework.mobile.gne.nfce.Item
  JOp_XmlRetorno = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.Op_XmlRetorno
  Jnfce_Layout = interface;//br.com.daruma.framework.mobile.gne.nfce.Layout
  JNFCe = interface;//br.com.daruma.framework.mobile.gne.nfce.NFCe
  JPagamento = interface;//br.com.daruma.framework.mobile.gne.nfce.Pagamento
  JPagar = interface;//br.com.daruma.framework.mobile.gne.nfce.Pagar
  JPagarComCartao = interface;//br.com.daruma.framework.mobile.gne.nfce.PagarComCartao
  JTiposNFCe = interface;//br.com.daruma.framework.mobile.gne.nfce.TiposNFCe
  JTotalizacao = interface;//br.com.daruma.framework.mobile.gne.nfce.Totalizacao
  JTransportadora = interface;//br.com.daruma.framework.mobile.gne.nfce.Transportadora
  JVendeItem = interface;//br.com.daruma.framework.mobile.gne.nfce.VendeItem
  JVendeItemCompleto = interface;//br.com.daruma.framework.mobile.gne.nfce.VendeItemCompleto
  JObjetos = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.Objetos
  JOp_XmlAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.Op_XmlAuxiliar
  JOp_XmlCanc = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.Op_XmlCanc
  Jxml_Op_XmlConsulta = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.Op_XmlConsulta
  JOp_XmlContingencia = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.Op_XmlContingencia
  JOp_XmlInutilizacao = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.Op_XmlInutilizacao
  JXml_ElementosEnvioNFCe = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.Xml_ElementosEnvioNFCe
  JAux_XmlAvisoServ = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.auxiliar.Aux_XmlAvisoServ
  JAux_XmlIde = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.auxiliar.Aux_XmlIde
  JAux_XmlInfIntermed = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.auxiliar.Aux_XmlInfIntermed
  JAux_XmlNfce = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.auxiliar.Aux_XmlNfce
  JAux_XmlTransp = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.auxiliar.Aux_XmlTransp
  JAC = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.AC
  JAL = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.AL
  JAM = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.AM
  JAP = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.AP
  JBA = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.BA
  JCE = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.CE
  JCideAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.CideAuxiliar
  JCofinsAliqAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.CofinsAliqAuxiliar
  JCofinsNtAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.CofinsNtAuxiliar
  JCofinsOutrAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.CofinsOutrAuxiliar
  JCofinsQtdeAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.CofinsQtdeAuxiliar
  JCofinsSnAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.CofinsSnAuxiliar
  JCofinsStAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.CofinsStAuxiliar
  JCombAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.CombAuxiliar
  JConfiguracaoAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.ConfiguracaoAuxiliar
  JDF = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.DF
  JES = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.ES
  JElementosXMLContingencia = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.ElementosXMLContingencia
  JElementosXMlInutilizacao = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.ElementosXMlInutilizacao
  JElementosXmlAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.ElementosXmlAuxiliar
  JElementosXmlCancelamento = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.ElementosXmlCancelamento
  JEmail = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.Email
  JEmitAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.EmitAuxiliar
  JEnderEmitAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.EnderEmitAuxiliar
  JGO = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.GO
  JIcms00Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.Icms00Auxiliar
  JIcms10Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.Icms10Auxiliar
  JIcms20Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.Icms20Auxiliar
  JIcms30Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.Icms30Auxiliar
  JIcms40Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.Icms40Auxiliar
  JIcms51Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.Icms51Auxiliar
  JIcms60Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.Icms60Auxiliar
  JIcms70Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.Icms70Auxiliar
  JIcms90Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.Icms90Auxiliar
  JIcmsPartAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.IcmsPartAuxiliar
  JIcmsSn101Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.IcmsSn101Auxiliar
  JIcmsSn102Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.IcmsSn102Auxiliar
  JIcmsSn201Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.IcmsSn201Auxiliar
  JIcmsSn202Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.IcmsSn202Auxiliar
  JIcmsSn500Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.IcmsSn500Auxiliar
  JIcmsSn900Auxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.IcmsSn900Auxiliar
  JIcmsStAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.IcmsStAuxiliar
  JInfRespTecAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.InfRespTecAuxiliar
  JIssQnAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.IssQnAuxiliar
  JLeiImposto = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.LeiImposto
  JMA = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.MA
  JMG = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.MG
  JMS = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.MS
  JMT = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.MT
  JMedAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.MedAuxiliar
  JMsgPromocional = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.MsgPromocional
  JNT = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.NT
  JPA = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.PA
  JPB = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.PB
  JPE = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.PE
  JPI = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.PI
  JPR = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.PR
  JPisAliqAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.PisAliqAuxiliar
  JPisNtAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.PisNtAuxiliar
  JPisOutrAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.PisOutrAuxiliar
  JPisQtdeAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.PisQtdeAuxiliar
  JPisSnAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.PisSnAuxiliar
  JPisStAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.PisStAuxiliar
  JProdAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.ProdAuxiliar
  JRJ = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.RJ
  JRN = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.RN
  JRO = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.RO
  JRR = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.RR
  JRS = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.RS
  JSC = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.SC
  JSE = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.SE
  JSP = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.SP
  JTO = interface;//br.com.daruma.framework.mobile.gne.nfce.xml.classes.TO
  JAberturaNfse = interface;//br.com.daruma.framework.mobile.gne.nfse.AberturaNfse
  JEncerrarNFSe = interface;//br.com.daruma.framework.mobile.gne.nfse.EncerrarNFSe
  Jxml_Op_XmlRetorno = interface;//br.com.daruma.framework.mobile.gne.nfse.xml.Op_XmlRetorno
  Jnfse_Layout = interface;//br.com.daruma.framework.mobile.gne.nfse.Layout
  JNFSe = interface;//br.com.daruma.framework.mobile.gne.nfse.NFSe
  JTiposNFSe = interface;//br.com.daruma.framework.mobile.gne.nfse.TiposNFSe
  JVendeServNFSe = interface;//br.com.daruma.framework.mobile.gne.nfse.VendeServNFSe
  Jxml_ElementosXmlAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfse.xml.ElementosXmlAuxiliar
  JElementosXmlConsulta = interface;//br.com.daruma.framework.mobile.gne.nfse.xml.ElementosXmlConsulta
  JEnderPrest = interface;//br.com.daruma.framework.mobile.gne.nfse.xml.EnderPrest
  JNfseAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfse.xml.NfseAuxiliar
  Jxml_Objetos = interface;//br.com.daruma.framework.mobile.gne.nfse.xml.Objetos
  Jxml_Op_XmlAuxiliar = interface;//br.com.daruma.framework.mobile.gne.nfse.xml.Op_XmlAuxiliar
  Jnfse_xml_Op_XmlConsulta = interface;//br.com.daruma.framework.mobile.gne.nfse.xml.Op_XmlConsulta
  JPrestador = interface;//br.com.daruma.framework.mobile.gne.nfse.xml.Prestador
  JXml_ElementosEnvioNFSe = interface;//br.com.daruma.framework.mobile.gne.nfse.xml.Xml_ElementosEnvioNFSe
  JInterface_Sat = interface;//br.com.daruma.framework.mobile.gne.sat.Interface_Sat
  Jsat_Daruma = interface;//br.com.daruma.framework.mobile.gne.sat.Daruma
  Jsat_xml_Op_XmlRetorno = interface;//br.com.daruma.framework.mobile.gne.sat.xml.Op_XmlRetorno
  Jsat_Layout = interface;//br.com.daruma.framework.mobile.gne.sat.Layout
  JParseNFCe_2_SAT = interface;//br.com.daruma.framework.mobile.gne.sat.ParseNFCe_2_SAT
  JSat = interface;//br.com.daruma.framework.mobile.gne.sat.Sat
  JSatCr = interface;//br.com.daruma.framework.mobile.gne.sat.SatCr
  //JSatCrComunicacao = interface;//br.com.daruma.framework.mobile.gne.sat.SatCrComunicacao
  JSatCrComunicacao_UsbPermission = interface;//br.com.daruma.framework.mobile.gne.sat.SatCrComunicacao$UsbPermission
  JUrano = interface;//br.com.daruma.framework.mobile.gne.sat.Urano
  JCONFIGURACAO = interface;//br.com.daruma.framework.mobile.gne.sat.xml.CONFIGURACAO
  JEMIT = interface;//br.com.daruma.framework.mobile.gne.sat.xml.EMIT
  JIDENTIFICACAO_CFE = interface;//br.com.daruma.framework.mobile.gne.sat.xml.IDENTIFICACAO_CFE
  JISSQN = interface;//br.com.daruma.framework.mobile.gne.sat.xml.ISSQN
  Jsat_xml_Objetos = interface;//br.com.daruma.framework.mobile.gne.sat.xml.Objetos
  Jsat_xml_Op_XmlAuxiliar = interface;//br.com.daruma.framework.mobile.gne.sat.xml.Op_XmlAuxiliar
  JPROD = interface;//br.com.daruma.framework.mobile.gne.sat.xml.PROD
  JXml_ElementosAux = interface;//br.com.daruma.framework.mobile.gne.sat.xml.Xml_ElementosAux
  JDarumaLogger = interface;//br.com.daruma.framework.mobile.log.DarumaLogger
  JDarumaLogger_LoggerDispatcherTrace = interface;//br.com.daruma.framework.mobile.log.DarumaLogger$LoggerDispatcherTrace
  JDarumaLoggerConst = interface;//br.com.daruma.framework.mobile.log.DarumaLoggerConst
  JPersistenciaJSON = interface;//br.com.daruma.framework.mobile.sat.PersistenciaJSON
  JPersistenciaXML = interface;//br.com.daruma.framework.mobile.sat.PersistenciaXML
  JSatNativo = interface;//br.com.daruma.framework.mobile.sat.SatNativo
  JDescAcrEntr = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.DescAcrEntr
  JDest = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.Dest
  JDet = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.Det
  JelementosCFe_Emit = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.Emit
  JEntrega = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.Entrega
  JIde = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.Ide
  JInfAdic = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.InfAdic
  JInfCFe = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.InfCFe
  JMeioDePagamento = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.MeioDePagamento
  JPgto = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.Pgto
  JelementosCFe_Prod = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.Prod
  JTotal = interface;//br.com.daruma.framework.mobile.sat.elementosCFe.Total
  JCofins = interface;//br.com.daruma.framework.mobile.sat.impostos.Cofins
  JCofinsaliq = interface;//br.com.daruma.framework.mobile.sat.impostos.Cofinsaliq
  JCofinsnt = interface;//br.com.daruma.framework.mobile.sat.impostos.Cofinsnt
  JCofinsoutr = interface;//br.com.daruma.framework.mobile.sat.impostos.Cofinsoutr
  JCofinsqtde = interface;//br.com.daruma.framework.mobile.sat.impostos.Cofinsqtde
  JCofinssn = interface;//br.com.daruma.framework.mobile.sat.impostos.Cofinssn
  JCofinsst = interface;//br.com.daruma.framework.mobile.sat.impostos.Cofinsst
  JIcms = interface;//br.com.daruma.framework.mobile.sat.impostos.Icms
  JIcms00 = interface;//br.com.daruma.framework.mobile.sat.impostos.Icms00
  JIcms40 = interface;//br.com.daruma.framework.mobile.sat.impostos.Icms40
  JIcmssn102 = interface;//br.com.daruma.framework.mobile.sat.impostos.Icmssn102
  JIcmssn900 = interface;//br.com.daruma.framework.mobile.sat.impostos.Icmssn900
  Jimpostos_Issqn = interface;//br.com.daruma.framework.mobile.sat.impostos.Issqn
  JPis = interface;//br.com.daruma.framework.mobile.sat.impostos.Pis
  JPisaliq = interface;//br.com.daruma.framework.mobile.sat.impostos.Pisaliq
  JPisnt = interface;//br.com.daruma.framework.mobile.sat.impostos.Pisnt
  JPisoutr = interface;//br.com.daruma.framework.mobile.sat.impostos.Pisoutr
  JPisqtde = interface;//br.com.daruma.framework.mobile.sat.impostos.Pisqtde
  JPissn = interface;//br.com.daruma.framework.mobile.sat.impostos.Pissn
  JPisst = interface;//br.com.daruma.framework.mobile.sat.impostos.Pisst
  JxmlConfiguracao_Configuracao = interface;//br.com.daruma.framework.mobile.sat.xmlConfiguracao.Configuracao
  JxmlConfiguracao_Emit = interface;//br.com.daruma.framework.mobile.sat.xmlConfiguracao.Emit
  JIdentificacaoCFe = interface;//br.com.daruma.framework.mobile.sat.xmlConfiguracao.IdentificacaoCFe
  JImposto = interface;//br.com.daruma.framework.mobile.sat.xmlConfiguracao.Imposto
  JxmlConfiguracao_Prod = interface;//br.com.daruma.framework.mobile.sat.xmlConfiguracao.Prod
  JSAT_Framework_XML = interface;//br.com.daruma.framework.mobile.sat.xmlConfiguracao.SAT_Framework_XML
  JComunicacaoWS = interface;//br.com.daruma.framework.mobile.webservice.ComunicacaoWS
  JITServiceWs = interface;//br.com.daruma.framework.mobile.webservice.ITServiceWs
  JTrustedManagerManipulator = interface;//br.com.daruma.framework.mobile.webservice.TrustedManagerManipulator
  JTrustedManagerManipulator_1 = interface;//br.com.daruma.framework.mobile.webservice.TrustedManagerManipulator$1
  JDadosConsulta = interface;//br.com.daruma.framework.mobile.webservice.modelo.DadosConsulta
  JInfoEmissao = interface;//br.com.daruma.framework.mobile.webservice.modelo.InfoEmissao
  JIPrinterCallback = interface;//com.xcheng.printerservice.IPrinterCallback
  JIPrinterCallback_Default = interface;//com.xcheng.printerservice.IPrinterCallback$Default
  JIPrinterCallback_Stub_Proxy = interface;//com.xcheng.printerservice.IPrinterCallback$Stub$Proxy
  JIPrinterService = interface;//com.xcheng.printerservice.IPrinterService
  JIPrinterService_Default = interface;//com.xcheng.printerservice.IPrinterService$Default
  JIPrinterService_Stub = interface;//com.xcheng.printerservice.IPrinterService$Stub
  JIPrinterService_Stub_Proxy = interface;//com.xcheng.printerservice.IPrinterService$Stub$Proxy
  Jdarumamobile_BuildConfig = interface;//daruma.com.br.darumamobile.BuildConfig
  JDataInput = interface;//java.io.DataInput
  JFilterInputStream = interface;//java.io.FilterInputStream
  JDataInputStream = interface;//java.io.DataInputStream
  JIllegalArgumentException = interface;//java.lang.IllegalArgumentException
  JVoid = interface;//java.lang.Void
  JVector = interface;//java.util.Vector
  JSAXParser = interface;//javax.xml.parsers.SAXParser
  JSAXParserFactory = interface;//javax.xml.parsers.SAXParserFactory
  JResult = interface;//javax.xml.transform.Result
  JSource = interface;//javax.xml.transform.Source
  JSAXResult = interface;//javax.xml.transform.sax.SAXResult
  JSAXSource = interface;//javax.xml.transform.sax.SAXSource
  JSchema = interface;//javax.xml.validation.Schema
  JSchemaFactory = interface;//javax.xml.validation.SchemaFactory
  JTypeInfoProvider = interface;//javax.xml.validation.TypeInfoProvider
  JValidator = interface;//javax.xml.validation.Validator
  JValidatorHandler = interface;//javax.xml.validation.ValidatorHandler
  JCloneBase = interface;//org.jdom2.CloneBase
  JAttribute = interface;//org.jdom2.Attribute
  Jjdom2_AttributeList = interface;//org.jdom2.AttributeList
  JAttributeList_1 = interface;//org.jdom2.AttributeList$1
  JAttributeList_ALIterator = interface;//org.jdom2.AttributeList$ALIterator
  JAttributeType = interface;//org.jdom2.AttributeType
  JContent = interface;//org.jdom2.Content
  Jjdom2_Text = interface;//org.jdom2.Text
  JCDATA = interface;//org.jdom2.CDATA
  Jjdom2_Comment = interface;//org.jdom2.Comment
  JContent_CType = interface;//org.jdom2.Content$CType
  JContentList = interface;//org.jdom2.ContentList
  JContentList_1 = interface;//org.jdom2.ContentList$1
  JContentList_CLIterator = interface;//org.jdom2.ContentList$CLIterator
  JContentList_CLListIterator = interface;//org.jdom2.ContentList$CLListIterator
  JContentList_FilterList = interface;//org.jdom2.ContentList$FilterList
  JContentList_FilterListIterator = interface;//org.jdom2.ContentList$FilterListIterator
  JJDOMException = interface;//org.jdom2.JDOMException
  JDataConversionException = interface;//org.jdom2.DataConversionException
  JJDOMFactory = interface;//org.jdom2.JDOMFactory
  JDefaultJDOMFactory = interface;//org.jdom2.DefaultJDOMFactory
  JIteratorIterable = interface;//org.jdom2.util.IteratorIterable
  JDescendantIterator = interface;//org.jdom2.DescendantIterator
  JDocType = interface;//org.jdom2.DocType
  Jjdom2_Document = interface;//org.jdom2.Document
  Jjdom2_Element = interface;//org.jdom2.Element
  JEntityRef = interface;//org.jdom2.EntityRef
  JFilterIterator = interface;//org.jdom2.FilterIterator
  JIllegalAddException = interface;//org.jdom2.IllegalAddException
  JIllegalDataException = interface;//org.jdom2.IllegalDataException
  JIllegalNameException = interface;//org.jdom2.IllegalNameException
  JIllegalTargetException = interface;//org.jdom2.IllegalTargetException
  JJDOMConstants = interface;//org.jdom2.JDOMConstants
  JNamespace = interface;//org.jdom2.Namespace
  JNamespace_NamespaceSerializationProxy = interface;//org.jdom2.Namespace$NamespaceSerializationProxy
  JNamespaceAware = interface;//org.jdom2.NamespaceAware
  JParent = interface;//org.jdom2.Parent
  Jjdom2_ProcessingInstruction = interface;//org.jdom2.ProcessingInstruction
  JSlimJDOMFactory = interface;//org.jdom2.SlimJDOMFactory
  JStringBin = interface;//org.jdom2.StringBin
  JUncheckedJDOMFactory = interface;//org.jdom2.UncheckedJDOMFactory
  JVerifier = interface;//org.jdom2.Verifier
  JDOMAdapter = interface;//org.jdom2.adapters.DOMAdapter
  JAbstractDOMAdapter = interface;//org.jdom2.adapters.AbstractDOMAdapter
  JJAXPDOMAdapter = interface;//org.jdom2.adapters.JAXPDOMAdapter
  Jfilter_Filter = interface;//org.jdom2.filter.Filter
  JAbstractFilter = interface;//org.jdom2.filter.AbstractFilter
  JAndFilter = interface;//org.jdom2.filter.AndFilter
  JAttributeFilter = interface;//org.jdom2.filter.AttributeFilter
  JClassFilter = interface;//org.jdom2.filter.ClassFilter
  JContentFilter = interface;//org.jdom2.filter.ContentFilter
  JElementFilter = interface;//org.jdom2.filter.ElementFilter
  Jfilter_Filters = interface;//org.jdom2.filter.Filters
  JNegateFilter = interface;//org.jdom2.filter.NegateFilter
  JOrFilter = interface;//org.jdom2.filter.OrFilter
  JPassThroughFilter = interface;//org.jdom2.filter.PassThroughFilter
  JTextOnlyFilter = interface;//org.jdom2.filter.TextOnlyFilter
  JDOMBuilder = interface;//org.jdom2.input.DOMBuilder
  JJDOMParseException = interface;//org.jdom2.input.JDOMParseException
  JSAXEngine = interface;//org.jdom2.input.sax.SAXEngine
  JSAXBuilder = interface;//org.jdom2.input.SAXBuilder
  JStAXEventBuilder = interface;//org.jdom2.input.StAXEventBuilder
  JStAXStreamBuilder = interface;//org.jdom2.input.StAXStreamBuilder
  JXMLReaderJDOMFactory = interface;//org.jdom2.input.sax.XMLReaderJDOMFactory
  JAbstractReaderSchemaFactory = interface;//org.jdom2.input.sax.AbstractReaderSchemaFactory
  JAbstractReaderXSDFactory = interface;//org.jdom2.input.sax.AbstractReaderXSDFactory
  JAbstractReaderXSDFactory_SchemaFactoryProvider = interface;//org.jdom2.input.sax.AbstractReaderXSDFactory$SchemaFactoryProvider
  JErrorHandler = interface;//org.xml.sax.ErrorHandler
  JBuilderErrorHandler = interface;//org.jdom2.input.sax.BuilderErrorHandler
  JSAXHandlerFactory = interface;//org.jdom2.input.sax.SAXHandlerFactory
  JDefaultSAXHandlerFactory = interface;//org.jdom2.input.sax.DefaultSAXHandlerFactory
  JDefaultHandler = interface;//org.xml.sax.helpers.DefaultHandler
  JSAXHandler = interface;//org.jdom2.input.sax.SAXHandler
  JDefaultSAXHandlerFactory_DefaultSAXHandler = interface;//org.jdom2.input.sax.DefaultSAXHandlerFactory$DefaultSAXHandler
  JSAXBuilderEngine = interface;//org.jdom2.input.sax.SAXBuilderEngine
  JTextBuffer = interface;//org.jdom2.input.sax.TextBuffer
  JXMLReaderJAXPFactory = interface;//org.jdom2.input.sax.XMLReaderJAXPFactory
  JXMLReaderSAX2Factory = interface;//org.jdom2.input.sax.XMLReaderSAX2Factory
  JXMLReaderSchemaFactory = interface;//org.jdom2.input.sax.XMLReaderSchemaFactory
  JXMLReaderXSDFactory = interface;//org.jdom2.input.sax.XMLReaderXSDFactory
  JXMLReaderXSDFactory_1 = interface;//org.jdom2.input.sax.XMLReaderXSDFactory$1
  JXMLReaders = interface;//org.jdom2.input.sax.XMLReaders
  JXMLReaders_DTDSingleton = interface;//org.jdom2.input.sax.XMLReaders$DTDSingleton
  JXMLReaders_FactorySupplier = interface;//org.jdom2.input.sax.XMLReaders$FactorySupplier
  JXMLReaders_NONSingleton = interface;//org.jdom2.input.sax.XMLReaders$NONSingleton
  JXMLReaders_XSDSingleton = interface;//org.jdom2.input.sax.XMLReaders$XSDSingleton
  Jpackage_info = interface;//org.jdom2.input.sax.package-info
  JDTDParser = interface;//org.jdom2.input.stax.DTDParser
  JStAXFilter = interface;//org.jdom2.input.stax.StAXFilter
  JDefaultStAXFilter = interface;//org.jdom2.input.stax.DefaultStAXFilter
  Jstax_package_info = interface;//org.jdom2.input.stax.package-info
  JArrayCopy = interface;//org.jdom2.internal.ArrayCopy
  JReflectionConstructor = interface;//org.jdom2.internal.ReflectionConstructor
  JSystemProperty = interface;//org.jdom2.internal.SystemProperty
  JLocated = interface;//org.jdom2.located.Located
  JLocatedCDATA = interface;//org.jdom2.located.LocatedCDATA
  JLocatedComment = interface;//org.jdom2.located.LocatedComment
  JLocatedDocType = interface;//org.jdom2.located.LocatedDocType
  JLocatedElement = interface;//org.jdom2.located.LocatedElement
  JLocatedEntityRef = interface;//org.jdom2.located.LocatedEntityRef
  JLocatedJDOMFactory = interface;//org.jdom2.located.LocatedJDOMFactory
  JLocatedProcessingInstruction = interface;//org.jdom2.located.LocatedProcessingInstruction
  JLocatedText = interface;//org.jdom2.located.LocatedText
  JDOMOutputter = interface;//org.jdom2.output.DOMOutputter
  JDOMOutputter_1 = interface;//org.jdom2.output.DOMOutputter$1
  JAbstractOutputProcessor = interface;//org.jdom2.output.support.AbstractOutputProcessor
  JAbstractDOMOutputProcessor = interface;//org.jdom2.output.support.AbstractDOMOutputProcessor
  JDOMOutputter_DefaultDOMOutputProcessor = interface;//org.jdom2.output.DOMOutputter$DefaultDOMOutputProcessor
  JEscapeStrategy = interface;//org.jdom2.output.EscapeStrategy
  Joutput_Format = interface;//org.jdom2.output.Format
  JFormat_1 = interface;//org.jdom2.output.Format$1
  JFormat_DefaultCharsetEscapeStrategy = interface;//org.jdom2.output.Format$DefaultCharsetEscapeStrategy
  JFormat_EscapeStrategy7Bits = interface;//org.jdom2.output.Format$EscapeStrategy7Bits
  JFormat_EscapeStrategy8Bits = interface;//org.jdom2.output.Format$EscapeStrategy8Bits
  JFormat_EscapeStrategyUTF = interface;//org.jdom2.output.Format$EscapeStrategyUTF
  JFormat_TextMode = interface;//org.jdom2.output.Format$TextMode
  JLocator = interface;//org.xml.sax.Locator
  JJDOMLocator = interface;//org.jdom2.output.JDOMLocator
  JLineSeparator = interface;//org.jdom2.output.LineSeparator
  JSAXOutputter = interface;//org.jdom2.output.SAXOutputter
  JSAXOutputter_1 = interface;//org.jdom2.output.SAXOutputter$1
  JAbstractSAXOutputProcessor = interface;//org.jdom2.output.support.AbstractSAXOutputProcessor
  JSAXOutputter_DefaultSAXOutputProcessor = interface;//org.jdom2.output.SAXOutputter$DefaultSAXOutputProcessor
  JStAXEventOutputter = interface;//org.jdom2.output.StAXEventOutputter
  JStAXEventOutputter_1 = interface;//org.jdom2.output.StAXEventOutputter$1
  JAbstractStAXEventProcessor = interface;//org.jdom2.output.support.AbstractStAXEventProcessor
  JStAXEventOutputter_DefaultStAXEventProcessor = interface;//org.jdom2.output.StAXEventOutputter$DefaultStAXEventProcessor
  JStAXStreamOutputter = interface;//org.jdom2.output.StAXStreamOutputter
  JStAXStreamOutputter_1 = interface;//org.jdom2.output.StAXStreamOutputter$1
  JAbstractStAXStreamProcessor = interface;//org.jdom2.output.support.AbstractStAXStreamProcessor
  JStAXStreamOutputter_DefaultStAXStreamProcessor = interface;//org.jdom2.output.StAXStreamOutputter$DefaultStAXStreamProcessor
  JXMLOutputter = interface;//org.jdom2.output.XMLOutputter
  JXMLOutputter_1 = interface;//org.jdom2.output.XMLOutputter$1
  JAbstractXMLOutputProcessor = interface;//org.jdom2.output.support.AbstractXMLOutputProcessor
  JXMLOutputter_DefaultXMLProcessor = interface;//org.jdom2.output.XMLOutputter$DefaultXMLProcessor
  JAbstractDOMOutputProcessor_1 = interface;//org.jdom2.output.support.AbstractDOMOutputProcessor$1
  JWalker = interface;//org.jdom2.output.support.Walker
  JAbstractFormattedWalker = interface;//org.jdom2.output.support.AbstractFormattedWalker
  JAbstractFormattedWalker_1 = interface;//org.jdom2.output.support.AbstractFormattedWalker$1
  JAbstractFormattedWalker_2 = interface;//org.jdom2.output.support.AbstractFormattedWalker$2
  JAbstractFormattedWalker_MultiText = interface;//org.jdom2.output.support.AbstractFormattedWalker$MultiText
  JAbstractFormattedWalker_Trim = interface;//org.jdom2.output.support.AbstractFormattedWalker$Trim
  JAbstractOutputProcessor_1 = interface;//org.jdom2.output.support.AbstractOutputProcessor$1
  JAbstractSAXOutputProcessor_1 = interface;//org.jdom2.output.support.AbstractSAXOutputProcessor$1
  JAbstractStAXEventProcessor_1 = interface;//org.jdom2.output.support.AbstractStAXEventProcessor$1
  JAbstractStAXEventProcessor_AttIterator = interface;//org.jdom2.output.support.AbstractStAXEventProcessor$AttIterator
  JAbstractStAXEventProcessor_NSIterator = interface;//org.jdom2.output.support.AbstractStAXEventProcessor$NSIterator
  JAbstractStAXStreamProcessor_1 = interface;//org.jdom2.output.support.AbstractStAXStreamProcessor$1
  JAbstractXMLOutputProcessor_1 = interface;//org.jdom2.output.support.AbstractXMLOutputProcessor$1
  JDOMOutputProcessor = interface;//org.jdom2.output.support.DOMOutputProcessor
  JFormatStack = interface;//org.jdom2.output.support.FormatStack
  JFormatStack_1 = interface;//org.jdom2.output.support.FormatStack$1
  JSAXOutputProcessor = interface;//org.jdom2.output.support.SAXOutputProcessor
  JSAXTarget = interface;//org.jdom2.output.support.SAXTarget
  JSAXTarget_SAXLocator = interface;//org.jdom2.output.support.SAXTarget$SAXLocator
  JStAXEventProcessor = interface;//org.jdom2.output.support.StAXEventProcessor
  JStAXStreamProcessor = interface;//org.jdom2.output.support.StAXStreamProcessor
  JWalkerNORMALIZE = interface;//org.jdom2.output.support.WalkerNORMALIZE
  JWalkerNORMALIZE_1 = interface;//org.jdom2.output.support.WalkerNORMALIZE$1
  JWalkerPRESERVE = interface;//org.jdom2.output.support.WalkerPRESERVE
  JWalkerPRESERVE_1 = interface;//org.jdom2.output.support.WalkerPRESERVE$1
  JWalkerTRIM = interface;//org.jdom2.output.support.WalkerTRIM
  JWalkerTRIM_1 = interface;//org.jdom2.output.support.WalkerTRIM$1
  JWalkerTRIM_FULL_WHITE = interface;//org.jdom2.output.support.WalkerTRIM_FULL_WHITE
  JWalkerTRIM_FULL_WHITE_1 = interface;//org.jdom2.output.support.WalkerTRIM_FULL_WHITE$1
  JXMLOutputProcessor = interface;//org.jdom2.output.support.XMLOutputProcessor
  JJDOMResult = interface;//org.jdom2.transform.JDOMResult
  JXMLFilterImpl = interface;//org.xml.sax.helpers.XMLFilterImpl
  JJDOMResult_DocumentBuilder = interface;//org.jdom2.transform.JDOMResult$DocumentBuilder
  JJDOMResult_FragmentHandler = interface;//org.jdom2.transform.JDOMResult$FragmentHandler
  JJDOMSource = interface;//org.jdom2.transform.JDOMSource
  JJDOMSource_DocumentReader = interface;//org.jdom2.transform.JDOMSource$DocumentReader
  JInputSource = interface;//org.xml.sax.InputSource
  JJDOMSource_JDOMInputSource = interface;//org.jdom2.transform.JDOMSource$JDOMInputSource
  JXSLTransformException = interface;//org.jdom2.transform.XSLTransformException
  JXSLTransformer = interface;//org.jdom2.transform.XSLTransformer
  JNamespaceStack = interface;//org.jdom2.util.NamespaceStack
  JNamespaceStack_1 = interface;//org.jdom2.util.NamespaceStack$1
  JNamespaceStack_BackwardWalker = interface;//org.jdom2.util.NamespaceStack$BackwardWalker
  JNamespaceStack_EmptyIterable = interface;//org.jdom2.util.NamespaceStack$EmptyIterable
  JNamespaceStack_ForwardWalker = interface;//org.jdom2.util.NamespaceStack$ForwardWalker
  JNamespaceStack_NamespaceIterable = interface;//org.jdom2.util.NamespaceStack$NamespaceIterable
  Jxpath_XPath = interface;//org.jdom2.xpath.XPath
  JXPath_XPathString = interface;//org.jdom2.xpath.XPath$XPathString
  JXPathBuilder = interface;//org.jdom2.xpath.XPathBuilder
  JXPathDiagnostic = interface;//org.jdom2.xpath.XPathDiagnostic
  Jxpath_XPathExpression = interface;//org.jdom2.xpath.XPathExpression
  Jxpath_XPathFactory = interface;//org.jdom2.xpath.XPathFactory
  JXPathHelper = interface;//org.jdom2.xpath.XPathHelper
  //JJDOMCoreNavigator = interface;//org.jdom2.xpath.jaxen.JDOMCoreNavigator
  //JJDOM2Navigator = interface;//org.jdom2.xpath.jaxen.JDOM2Navigator
  //JJDOMNavigator = interface;//org.jdom2.xpath.jaxen.JDOMNavigator
  JJDOMXPath = interface;//org.jdom2.xpath.jaxen.JDOMXPath
  JAbstractXPathCompiled = interface;//org.jdom2.xpath.util.AbstractXPathCompiled
  JJaxenCompiled = interface;//org.jdom2.xpath.jaxen.JaxenCompiled
  JJaxenXPathFactory = interface;//org.jdom2.xpath.jaxen.JaxenXPathFactory
  JNamespaceContainer = interface;//org.jdom2.xpath.jaxen.NamespaceContainer
  JAbstractXPathCompiled_1 = interface;//org.jdom2.xpath.util.AbstractXPathCompiled$1
  JAbstractXPathCompiled_NamespaceComparator = interface;//org.jdom2.xpath.util.AbstractXPathCompiled$NamespaceComparator
  JXPathDiagnosticImpl = interface;//org.jdom2.xpath.util.XPathDiagnosticImpl
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
  JNodeList = interface;//org.w3c.dom.NodeList
  JProcessingInstruction = interface;//org.w3c.dom.ProcessingInstruction
  JTypeInfo = interface;//org.w3c.dom.TypeInfo
  JUserDataHandler = interface;//org.w3c.dom.UserDataHandler
  JLSInput = interface;//org.w3c.dom.ls.LSInput
  JLSResourceResolver = interface;//org.w3c.dom.ls.LSResourceResolver
  JAttributeList = interface;//org.xml.sax.AttributeList
  JAttributes = interface;//org.xml.sax.Attributes
  JContentHandler = interface;//org.xml.sax.ContentHandler
  JDTDHandler = interface;//org.xml.sax.DTDHandler
  JDocumentHandler = interface;//org.xml.sax.DocumentHandler
  JEntityResolver = interface;//org.xml.sax.EntityResolver
  JHandlerBase = interface;//org.xml.sax.HandlerBase
  JParser = interface;//org.xml.sax.Parser
  JSAXException = interface;//org.xml.sax.SAXException
  JSAXParseException = interface;//org.xml.sax.SAXParseException
  JXMLReader = interface;//org.xml.sax.XMLReader
  JXMLFilter = interface;//org.xml.sax.XMLFilter
  JDeclHandler = interface;//org.xml.sax.ext.DeclHandler
  JLexicalHandler = interface;//org.xml.sax.ext.LexicalHandler

// ===== Interface declarations =====

  JAnimatorClass = interface(JObjectClass)
    ['{3F76A5DF-389E-4BD3-9861-04C5B00CEADE}']
    {class} function init: JAnimator; cdecl;
    {class} procedure addListener(listener: JAnimator_AnimatorListener); cdecl;//Deprecated
    {class} procedure addPauseListener(listener: JAnimator_AnimatorPauseListener); cdecl;//Deprecated
    {class} function getDuration: Int64; cdecl;//Deprecated
    {class} function getInterpolator: JTimeInterpolator; cdecl;//Deprecated
    {class} function getListeners: JArrayList; cdecl;//Deprecated
    {class} function isStarted: Boolean; cdecl;
    {class} procedure pause; cdecl;
    {class} procedure removeAllListeners; cdecl;
    {class} procedure resume; cdecl;
    {class} function setDuration(duration: Int64): JAnimator; cdecl;
    {class} procedure setInterpolator(value: JTimeInterpolator); cdecl;
    {class} procedure setupStartValues; cdecl;
    {class} procedure start; cdecl;
  end;

  [JavaSignature('android/animation/Animator')]
  JAnimator = interface(JObject)
    ['{FA13E56D-1B6D-4A3D-8327-9E5BA785CF21}']
    procedure cancel; cdecl;//Deprecated
    function clone: JAnimator; cdecl;//Deprecated
    procedure &end; cdecl;//Deprecated
    function getStartDelay: Int64; cdecl;
    function isPaused: Boolean; cdecl;
    function isRunning: Boolean; cdecl;
    procedure removeListener(listener: JAnimator_AnimatorListener); cdecl;
    procedure removePauseListener(listener: JAnimator_AnimatorPauseListener); cdecl;
    procedure setStartDelay(startDelay: Int64); cdecl;
    procedure setTarget(target: JObject); cdecl;
    procedure setupEndValues; cdecl;
  end;
  TJAnimator = class(TJavaGenericImport<JAnimatorClass, JAnimator>) end;

  JAnimator_AnimatorListenerClass = interface(IJavaClass)
    ['{5ED6075A-B997-469C-B8D9-0AA8FB7E4798}']
    {class} procedure onAnimationCancel(animation: JAnimator); cdecl;//Deprecated
    {class} procedure onAnimationEnd(animation: JAnimator); cdecl;//Deprecated
    {class} procedure onAnimationRepeat(animation: JAnimator); cdecl;//Deprecated
  end;

  [JavaSignature('android/animation/Animator$AnimatorListener')]
  JAnimator_AnimatorListener = interface(IJavaInstance)
    ['{E2DE8DD6-628B-4D84-AA46-8A1E3F00FF13}']
    procedure onAnimationStart(animation: JAnimator); cdecl;//Deprecated
  end;
  TJAnimator_AnimatorListener = class(TJavaGenericImport<JAnimator_AnimatorListenerClass, JAnimator_AnimatorListener>) end;

  JAnimator_AnimatorPauseListenerClass = interface(IJavaClass)
    ['{CB0DC3F0-63BC-4284-ADD0-2ED367AE11E5}']
    {class} procedure onAnimationPause(animation: JAnimator); cdecl;//Deprecated
  end;

  [JavaSignature('android/animation/Animator$AnimatorPauseListener')]
  JAnimator_AnimatorPauseListener = interface(IJavaInstance)
    ['{43C9C106-65EA-4A7D-A958-FAB9E43FA4A6}']
    procedure onAnimationResume(animation: JAnimator); cdecl;//Deprecated
  end;
  TJAnimator_AnimatorPauseListener = class(TJavaGenericImport<JAnimator_AnimatorPauseListenerClass, JAnimator_AnimatorPauseListener>) end;

  JKeyframeClass = interface(JObjectClass)
    ['{D383116E-5CCF-48D8-9EA1-B26FBF24BA39}']
    {class} function init: JKeyframe; cdecl;
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
    procedure setFraction(fraction: Single); cdecl;
    procedure setInterpolator(interpolator: JTimeInterpolator); cdecl;
    procedure setValue(value: JObject); cdecl;
  end;
  TJKeyframe = class(TJavaGenericImport<JKeyframeClass, JKeyframe>) end;

  JLayoutTransitionClass = interface(JObjectClass)
    ['{433C5359-0A96-4796-AD7B-8084EF7EF7C4}']
    {class} function _GetAPPEARING: Integer; cdecl;
    {class} function _GetCHANGE_APPEARING: Integer; cdecl;
    {class} function _GetCHANGE_DISAPPEARING: Integer; cdecl;
    {class} function _GetCHANGING: Integer; cdecl;
    {class} function _GetDISAPPEARING: Integer; cdecl;
    {class} function init: JLayoutTransition; cdecl;
    {class} procedure addChild(parent: JViewGroup; child: JView); cdecl;//Deprecated
    {class} function getAnimator(transitionType: Integer): JAnimator; cdecl;//Deprecated
    {class} function getDuration(transitionType: Integer): Int64; cdecl;//Deprecated
    {class} function getInterpolator(transitionType: Integer): JTimeInterpolator; cdecl;//Deprecated
    {class} procedure hideChild(parent: JViewGroup; child: JView); cdecl; overload;//Deprecated
    {class} procedure hideChild(parent: JViewGroup; child: JView; newVisibility: Integer); cdecl; overload;//Deprecated
    {class} function isChangingLayout: Boolean; cdecl;//Deprecated
    {class} procedure removeTransitionListener(listener: JLayoutTransition_TransitionListener); cdecl;
    {class} procedure setAnimateParentHierarchy(animateParentHierarchy: Boolean); cdecl;
    {class} procedure setAnimator(transitionType: Integer; animator: JAnimator); cdecl;
    {class} procedure setInterpolator(transitionType: Integer; interpolator: JTimeInterpolator); cdecl;
    {class} procedure setStagger(transitionType: Integer; duration: Int64); cdecl;
    {class} procedure setStartDelay(transitionType: Integer; delay: Int64); cdecl;
    {class} property APPEARING: Integer read _GetAPPEARING;
    {class} property CHANGE_APPEARING: Integer read _GetCHANGE_APPEARING;
    {class} property CHANGE_DISAPPEARING: Integer read _GetCHANGE_DISAPPEARING;
    {class} property CHANGING: Integer read _GetCHANGING;
    {class} property DISAPPEARING: Integer read _GetDISAPPEARING;
  end;

  [JavaSignature('android/animation/LayoutTransition')]
  JLayoutTransition = interface(JObject)
    ['{42450BEE-EBF2-4954-B9B7-F8DAE7DF0EC1}']
    procedure addTransitionListener(listener: JLayoutTransition_TransitionListener); cdecl;//Deprecated
    procedure disableTransitionType(transitionType: Integer); cdecl;//Deprecated
    procedure enableTransitionType(transitionType: Integer); cdecl;//Deprecated
    function getStagger(transitionType: Integer): Int64; cdecl;//Deprecated
    function getStartDelay(transitionType: Integer): Int64; cdecl;//Deprecated
    function getTransitionListeners: JList; cdecl;//Deprecated
    function isRunning: Boolean; cdecl;
    function isTransitionTypeEnabled(transitionType: Integer): Boolean; cdecl;
    procedure removeChild(parent: JViewGroup; child: JView); cdecl;
    procedure setDuration(duration: Int64); cdecl; overload;
    procedure setDuration(transitionType: Integer; duration: Int64); cdecl; overload;
    procedure showChild(parent: JViewGroup; child: JView); cdecl; overload;//Deprecated
    procedure showChild(parent: JViewGroup; child: JView; oldVisibility: Integer); cdecl; overload;
  end;
  TJLayoutTransition = class(TJavaGenericImport<JLayoutTransitionClass, JLayoutTransition>) end;

  JLayoutTransition_TransitionListenerClass = interface(IJavaClass)
    ['{9FA6F1EC-8EDB-4A05-AF58-B55A525AE114}']
    {class} procedure endTransition(transition: JLayoutTransition; container: JViewGroup; view: JView; transitionType: Integer); cdecl;
  end;

  [JavaSignature('android/animation/LayoutTransition$TransitionListener')]
  JLayoutTransition_TransitionListener = interface(IJavaInstance)
    ['{0FBE048F-FCDA-4692-B6F1-DE0F07FAE885}']
    procedure startTransition(transition: JLayoutTransition; container: JViewGroup; view: JView; transitionType: Integer); cdecl;
  end;
  TJLayoutTransition_TransitionListener = class(TJavaGenericImport<JLayoutTransition_TransitionListenerClass, JLayoutTransition_TransitionListener>) end;

  JPropertyValuesHolderClass = interface(JObjectClass)
    ['{36C77AFF-9C3F-42B6-88F3-320FE8CF9B25}']
    {class} function ofMultiFloat(propertyName: JString; values: TJavaBiArray<Single>): JPropertyValuesHolder; cdecl; overload;//Deprecated
    {class} function ofMultiFloat(propertyName: JString; path: JPath): JPropertyValuesHolder; cdecl; overload;//Deprecated
    {class} function ofMultiInt(propertyName: JString; values: TJavaBiArray<Integer>): JPropertyValuesHolder; cdecl; overload;//Deprecated
    {class} function ofMultiInt(propertyName: JString; path: JPath): JPropertyValuesHolder; cdecl; overload;//Deprecated
    {class} function ofObject(propertyName: JString; converter: JTypeConverter; path: JPath): JPropertyValuesHolder; cdecl; overload;
    {class} function ofObject(property_: JProperty; converter: JTypeConverter; path: JPath): JPropertyValuesHolder; cdecl; overload;
    {class} procedure setConverter(converter: JTypeConverter); cdecl;
    {class} procedure setProperty(property_: JProperty); cdecl;
  end;

  [JavaSignature('android/animation/PropertyValuesHolder')]
  JPropertyValuesHolder = interface(JObject)
    ['{12B4ABFD-CBCA-4636-AF2D-C386EF895DC3}']
    function clone: JPropertyValuesHolder; cdecl;//Deprecated
    function getPropertyName: JString; cdecl;//Deprecated
    procedure setEvaluator(evaluator: JTypeEvaluator); cdecl;
    procedure setPropertyName(propertyName: JString); cdecl;
    function toString: JString; cdecl;
  end;
  TJPropertyValuesHolder = class(TJavaGenericImport<JPropertyValuesHolderClass, JPropertyValuesHolder>) end;

  JStateListAnimatorClass = interface(JObjectClass)
    ['{109E4067-E218-47B1-93EB-65B8916A98D8}']
    {class} function init: JStateListAnimator; cdecl;
    {class} function clone: JStateListAnimator; cdecl;//Deprecated
    {class} procedure jumpToCurrentState; cdecl;//Deprecated
  end;

  [JavaSignature('android/animation/StateListAnimator')]
  JStateListAnimator = interface(JObject)
    ['{CA2A9587-26AA-4DC2-8DFF-A1305A37608F}']
    procedure addState(specs: TJavaArray<Integer>; animator: JAnimator); cdecl;//Deprecated
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
    {class} function init(fromClass: Jlang_Class; toClass: Jlang_Class): JTypeConverter; cdecl;
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
    {class} function init: JValueAnimator; cdecl;
    {class} function clone: JValueAnimator; cdecl;
    {class} procedure &end; cdecl;
    {class} function getAnimatedFraction: Single; cdecl;
    {class} function getDuration: Int64; cdecl;//Deprecated
    {class} function getFrameDelay: Int64; cdecl;//Deprecated
    {class} function getInterpolator: JTimeInterpolator; cdecl;//Deprecated
    {class} function getStartDelay: Int64; cdecl;//Deprecated
    {class} function getValues: TJavaObjectArray<JPropertyValuesHolder>; cdecl;//Deprecated
    {class} function isRunning: Boolean; cdecl;//Deprecated
    {class} procedure resume; cdecl;//Deprecated
    {class} procedure reverse; cdecl;//Deprecated
    {class} procedure setCurrentFraction(fraction: Single); cdecl;//Deprecated
    {class} procedure setFrameDelay(frameDelay: Int64); cdecl;
    {class} procedure setRepeatMode(value: Integer); cdecl;
    {class} procedure setStartDelay(startDelay: Int64); cdecl;
    {class} property INFINITE: Integer read _GetINFINITE;
    {class} property RESTART: Integer read _GetRESTART;
    {class} property REVERSE: Integer read _GetREVERSE;
  end;

  [JavaSignature('android/animation/ValueAnimator')]
  JValueAnimator = interface(JAnimator)
    ['{70F92B14-EFD4-4DC7-91DE-6617417AE194}']
    procedure addUpdateListener(listener: JValueAnimator_AnimatorUpdateListener); cdecl;
    procedure cancel; cdecl;
    function getAnimatedValue: JObject; cdecl; overload;//Deprecated
    function getAnimatedValue(propertyName: JString): JObject; cdecl; overload;//Deprecated
    function getCurrentPlayTime: Int64; cdecl;//Deprecated
    function getRepeatCount: Integer; cdecl;//Deprecated
    function getRepeatMode: Integer; cdecl;//Deprecated
    function isStarted: Boolean; cdecl;//Deprecated
    procedure pause; cdecl;//Deprecated
    procedure removeAllUpdateListeners; cdecl;//Deprecated
    procedure removeUpdateListener(listener: JValueAnimator_AnimatorUpdateListener); cdecl;//Deprecated
    procedure setCurrentPlayTime(playTime: Int64); cdecl;
    function setDuration(duration: Int64): JValueAnimator; cdecl;
    procedure setEvaluator(value: JTypeEvaluator); cdecl;
    procedure setInterpolator(value: JTimeInterpolator); cdecl;
    procedure setRepeatCount(value: Integer); cdecl;
    procedure start; cdecl;
    function toString: JString; cdecl;
  end;
  TJValueAnimator = class(TJavaGenericImport<JValueAnimatorClass, JValueAnimator>) end;

  JValueAnimator_AnimatorUpdateListenerClass = interface(IJavaClass)
    ['{9CA50CBF-4462-4445-82CD-13CE985E2DE4}']
  end;

  [JavaSignature('android/animation/ValueAnimator$AnimatorUpdateListener')]
  JValueAnimator_AnimatorUpdateListener = interface(IJavaInstance)
    ['{0F883491-52EF-4A40-B7D2-FC23E11E46FE}']
    procedure onAnimationUpdate(animation: JValueAnimator); cdecl;//Deprecated
  end;
  TJValueAnimator_AnimatorUpdateListener = class(TJavaGenericImport<JValueAnimator_AnimatorUpdateListenerClass, JValueAnimator_AnimatorUpdateListener>) end;

  JUsbAccessoryClass = interface(JObjectClass)
    ['{1D9B9887-3355-48AD-9E48-30EA6B124537}']
    {class} function _GetCREATOR: JParcelable_Creator; cdecl;
    {class} function equals(obj: JObject): Boolean; cdecl;
    {class} function getDescription: JString; cdecl;
    {class} function getManufacturer: JString; cdecl;
    {class} function getVersion: JString; cdecl;
    {class} function hashCode: Integer; cdecl;
    {class} function toString: JString; cdecl;
    {class} property CREATOR: JParcelable_Creator read _GetCREATOR;
  end;

  [JavaSignature('android/hardware/usb/UsbAccessory')]
  JUsbAccessory = interface(JObject)
    ['{083B13FB-2A1A-4659-BECD-9C245475B724}']
    function describeContents: Integer; cdecl;
    function getModel: JString; cdecl;
    function getSerial: JString; cdecl;
    function getUri: JString; cdecl;
    procedure writeToParcel(parcel: JParcel; flags: Integer); cdecl;
  end;
  TJUsbAccessory = class(TJavaGenericImport<JUsbAccessoryClass, JUsbAccessory>) end;

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

  JUsbManagerClass = interface(JObjectClass)
    ['{1048A6E9-E1B5-4DA5-A168-ED91E8DE5284}']
    {class} function _GetACTION_USB_ACCESSORY_ATTACHED: JString; cdecl;
    {class} function _GetACTION_USB_ACCESSORY_DETACHED: JString; cdecl;
    {class} function _GetACTION_USB_DEVICE_ATTACHED: JString; cdecl;
    {class} function _GetACTION_USB_DEVICE_DETACHED: JString; cdecl;
    {class} function _GetEXTRA_ACCESSORY: JString; cdecl;
    {class} function _GetEXTRA_DEVICE: JString; cdecl;
    {class} function _GetEXTRA_PERMISSION_GRANTED: JString; cdecl;
    {class} function getAccessoryList: TJavaObjectArray<JUsbAccessory>; cdecl;//Deprecated
    {class} function getDeviceList: JHashMap; cdecl;//Deprecated
    {class} function hasPermission(device: JUsbDevice): Boolean; cdecl; overload;//Deprecated
    {class} procedure requestPermission(device: JUsbDevice; pi: JPendingIntent); cdecl; overload;//Deprecated
    {class} procedure requestPermission(accessory: JUsbAccessory; pi: JPendingIntent); cdecl; overload;//Deprecated
    {class} property ACTION_USB_ACCESSORY_ATTACHED: JString read _GetACTION_USB_ACCESSORY_ATTACHED;
    {class} property ACTION_USB_ACCESSORY_DETACHED: JString read _GetACTION_USB_ACCESSORY_DETACHED;
    {class} property ACTION_USB_DEVICE_ATTACHED: JString read _GetACTION_USB_DEVICE_ATTACHED;
    {class} property ACTION_USB_DEVICE_DETACHED: JString read _GetACTION_USB_DEVICE_DETACHED;
    {class} property EXTRA_ACCESSORY: JString read _GetEXTRA_ACCESSORY;
    {class} property EXTRA_DEVICE: JString read _GetEXTRA_DEVICE;
    {class} property EXTRA_PERMISSION_GRANTED: JString read _GetEXTRA_PERMISSION_GRANTED;
  end;

  [JavaSignature('android/hardware/usb/UsbManager')]
  JUsbManager = interface(JObject)
    ['{6F603A25-E816-4012-9B23-054B428A4A75}']
    function hasPermission(accessory: JUsbAccessory): Boolean; cdecl; overload;//Deprecated
    function openAccessory(accessory: JUsbAccessory): JParcelFileDescriptor; cdecl;//Deprecated
    function openDevice(device: JUsbDevice): JUsbDeviceConnection; cdecl;//Deprecated
  end;
  TJUsbManager = class(TJavaGenericImport<JUsbManagerClass, JUsbManager>) end;

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

  JPathMotionClass = interface(JObjectClass)
    ['{E1CD1A94-115C-492C-A490-37F0E72956EB}']
    {class} function init: JPathMotion; cdecl; overload;
    {class} function init(context: JContext; attrs: JAttributeSet): JPathMotion; cdecl; overload;
    {class} function getPath(startX: Single; startY: Single; endX: Single; endY: Single): JPath; cdecl;
  end;

  [JavaSignature('android/transition/PathMotion')]
  JPathMotion = interface(JObject)
    ['{BDC08353-C9FB-42D7-97CC-C35837D2F536}']
  end;
  TJPathMotion = class(TJavaGenericImport<JPathMotionClass, JPathMotion>) end;

  JSceneClass = interface(JObjectClass)
    ['{8B9120CA-AEEA-4DE3-BDC9-15CFD23A7B07}']
    {class} function init(sceneRoot: JViewGroup): JScene; cdecl; overload;
    {class} function init(sceneRoot: JViewGroup; layout: JView): JScene; cdecl; overload;
    {class} function init(sceneRoot: JViewGroup; layout: JViewGroup): JScene; cdecl; overload;//Deprecated
    {class} procedure enter; cdecl;//Deprecated
    {class} function getSceneForLayout(sceneRoot: JViewGroup; layoutId: Integer; context: JContext): JScene; cdecl;//Deprecated
    {class} procedure setEnterAction(action: JRunnable); cdecl;//Deprecated
    {class} procedure setExitAction(action: JRunnable); cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/Scene')]
  JScene = interface(JObject)
    ['{85A60B99-5837-4F1F-A344-C627DD586B82}']
    procedure exit; cdecl;//Deprecated
    function getSceneRoot: JViewGroup; cdecl;//Deprecated
  end;
  TJScene = class(TJavaGenericImport<JSceneClass, JScene>) end;

  JTransitionClass = interface(JObjectClass)
    ['{60EC06BC-8F7A-4416-A04B-5B57987EB18E}']
    {class} function _GetMATCH_ID: Integer; cdecl;
    {class} function _GetMATCH_INSTANCE: Integer; cdecl;
    {class} function _GetMATCH_ITEM_ID: Integer; cdecl;
    {class} function _GetMATCH_NAME: Integer; cdecl;
    {class} function init: JTransition; cdecl; overload;
    {class} function init(context: JContext; attrs: JAttributeSet): JTransition; cdecl; overload;
    {class} function addTarget(targetType: Jlang_Class): JTransition; cdecl; overload;//Deprecated
    {class} function addTarget(target: JView): JTransition; cdecl; overload;//Deprecated
    {class} function clone: JTransition; cdecl;
    {class} function createAnimator(sceneRoot: JViewGroup; startValues: JTransitionValues; endValues: JTransitionValues): JAnimator; cdecl;
    {class} function excludeChildren(targetId: Integer; exclude: Boolean): JTransition; cdecl; overload;
    {class} function excludeTarget(targetName: JString; exclude: Boolean): JTransition; cdecl; overload;
    {class} function excludeTarget(target: JView; exclude: Boolean): JTransition; cdecl; overload;
    {class} function excludeTarget(type_: Jlang_Class; exclude: Boolean): JTransition; cdecl; overload;
    {class} function getInterpolator: JTimeInterpolator; cdecl;
    {class} function getName: JString; cdecl;
    {class} function getPathMotion: JPathMotion; cdecl;
    {class} function getTargetNames: JList; cdecl;
    {class} function getTargetTypes: JList; cdecl;
    {class} function getTargets: JList; cdecl;
    {class} function removeListener(listener: JTransition_TransitionListener): JTransition; cdecl;//Deprecated
    {class} function removeTarget(targetId: Integer): JTransition; cdecl; overload;//Deprecated
    {class} function removeTarget(targetName: JString): JTransition; cdecl; overload;//Deprecated
    {class} function setDuration(duration: Int64): JTransition; cdecl;//Deprecated
    {class} procedure setEpicenterCallback(epicenterCallback: JTransition_EpicenterCallback); cdecl;//Deprecated
    {class} function setInterpolator(interpolator: JTimeInterpolator): JTransition; cdecl;//Deprecated
    {class} function setStartDelay(startDelay: Int64): JTransition; cdecl;//Deprecated
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
    function canRemoveViews: Boolean; cdecl;
    procedure captureEndValues(transitionValues: JTransitionValues); cdecl;
    procedure captureStartValues(transitionValues: JTransitionValues); cdecl;
    function excludeChildren(target: JView; exclude: Boolean): JTransition; cdecl; overload;
    function excludeChildren(type_: Jlang_Class; exclude: Boolean): JTransition; cdecl; overload;
    function excludeTarget(targetId: Integer; exclude: Boolean): JTransition; cdecl; overload;
    function getDuration: Int64; cdecl;
    function getEpicenter: JRect; cdecl;
    function getEpicenterCallback: JTransition_EpicenterCallback; cdecl;
    function getPropagation: JTransitionPropagation; cdecl;
    function getStartDelay: Int64; cdecl;
    function getTargetIds: JList; cdecl;
    function getTransitionProperties: TJavaObjectArray<JString>; cdecl;//Deprecated
    function getTransitionValues(view: JView; start: Boolean): JTransitionValues; cdecl;//Deprecated
    function isTransitionRequired(startValues: JTransitionValues; endValues: JTransitionValues): Boolean; cdecl;//Deprecated
    function removeTarget(target: JView): JTransition; cdecl; overload;//Deprecated
    function removeTarget(target: Jlang_Class): JTransition; cdecl; overload;//Deprecated
    procedure setPathMotion(pathMotion: JPathMotion); cdecl;//Deprecated
    procedure setPropagation(transitionPropagation: JTransitionPropagation); cdecl;//Deprecated
  end;
  TJTransition = class(TJavaGenericImport<JTransitionClass, JTransition>) end;

  JTransition_EpicenterCallbackClass = interface(JObjectClass)
    ['{8141257A-130B-466C-A08D-AA3A00946F4C}']
    {class} function init: JTransition_EpicenterCallback; cdecl;
  end;

  [JavaSignature('android/transition/Transition$EpicenterCallback')]
  JTransition_EpicenterCallback = interface(JObject)
    ['{CE004917-266F-4076-8913-F23184824FBA}']
    function onGetEpicenter(transition: JTransition): JRect; cdecl;//Deprecated
  end;
  TJTransition_EpicenterCallback = class(TJavaGenericImport<JTransition_EpicenterCallbackClass, JTransition_EpicenterCallback>) end;

  JTransition_TransitionListenerClass = interface(IJavaClass)
    ['{D5083752-E8A6-46DF-BE40-AE11073C387E}']
    {class} procedure onTransitionEnd(transition: JTransition); cdecl;//Deprecated
    {class} procedure onTransitionPause(transition: JTransition); cdecl;//Deprecated
    {class} procedure onTransitionResume(transition: JTransition); cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/Transition$TransitionListener')]
  JTransition_TransitionListener = interface(IJavaInstance)
    ['{C32BE107-6E05-4898-AF0A-FAD970D66E29}']
    procedure onTransitionCancel(transition: JTransition); cdecl;//Deprecated
    procedure onTransitionStart(transition: JTransition); cdecl;
  end;
  TJTransition_TransitionListener = class(TJavaGenericImport<JTransition_TransitionListenerClass, JTransition_TransitionListener>) end;

  JTransitionManagerClass = interface(JObjectClass)
    ['{4160EFA0-3499-4964-817E-46497BB5B957}']
    {class} function init: JTransitionManager; cdecl;
    {class} procedure beginDelayedTransition(sceneRoot: JViewGroup); cdecl; overload;
    {class} procedure beginDelayedTransition(sceneRoot: JViewGroup; transition: JTransition); cdecl; overload;
    {class} procedure endTransitions(sceneRoot: JViewGroup); cdecl;
    {class} procedure go(scene: JScene); cdecl; overload;
    {class} procedure go(scene: JScene; transition: JTransition); cdecl; overload;
    {class} procedure setTransition(fromScene: JScene; toScene: JScene; transition: JTransition); cdecl; overload;
    {class} procedure transitionTo(scene: JScene); cdecl;
  end;

  [JavaSignature('android/transition/TransitionManager')]
  JTransitionManager = interface(JObject)
    ['{FF5E1210-1F04-4F81-9CAC-3D7A5C4E972B}']
    procedure setTransition(scene: JScene; transition: JTransition); cdecl; overload;
  end;
  TJTransitionManager = class(TJavaGenericImport<JTransitionManagerClass, JTransitionManager>) end;

  JTransitionPropagationClass = interface(JObjectClass)
    ['{A881388A-C877-4DD9-9BAD-1BA4F56133EE}']
    {class} function init: JTransitionPropagation; cdecl;
    {class} function getPropagationProperties: TJavaObjectArray<JString>; cdecl;//Deprecated
    {class} function getStartDelay(sceneRoot: JViewGroup; transition: JTransition; startValues: JTransitionValues; endValues: JTransitionValues): Int64; cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/TransitionPropagation')]
  JTransitionPropagation = interface(JObject)
    ['{7595B7EF-6BCE-4281-BC67-335E2FB6C091}']
    procedure captureValues(transitionValues: JTransitionValues); cdecl;//Deprecated
  end;
  TJTransitionPropagation = class(TJavaGenericImport<JTransitionPropagationClass, JTransitionPropagation>) end;

  JTransitionValuesClass = interface(JObjectClass)
    ['{3BF98CFA-6A4D-4815-8D42-15E97C916D91}']
    {class} function _Getvalues: JMap; cdecl;
    {class} function _Getview: JView; cdecl;
    {class} function init: JTransitionValues; cdecl;
    {class} property values: JMap read _Getvalues;
    {class} property view: JView read _Getview;
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
    {class} function init(c: JContext; attrs: JAttributeSet): JToolbar_LayoutParams; cdecl; overload;
    {class} function init(width: Integer; height: Integer): JToolbar_LayoutParams; cdecl; overload;
    {class} function init(width: Integer; height: Integer; gravity: Integer): JToolbar_LayoutParams; cdecl; overload;
    {class} function init(gravity: Integer): JToolbar_LayoutParams; cdecl; overload;
    {class} function init(source: JToolbar_LayoutParams): JToolbar_LayoutParams; cdecl; overload;
    {class} function init(source: JActionBar_LayoutParams): JToolbar_LayoutParams; cdecl; overload;
    {class} function init(source: JViewGroup_MarginLayoutParams): JToolbar_LayoutParams; cdecl; overload;
    {class} function init(source: JViewGroup_LayoutParams): JToolbar_LayoutParams; cdecl; overload;
  end;

  [JavaSignature('android/widget/Toolbar$LayoutParams')]
  JToolbar_LayoutParams = interface(JActionBar_LayoutParams)
    ['{BCD101F9-B7B7-4B2F-9460-056B3EA7B9F0}']
  end;
  TJToolbar_LayoutParams = class(TJavaGenericImport<JToolbar_LayoutParamsClass, JToolbar_LayoutParams>) end;

  JAppInitializerClass = interface(JObjectClass)
    ['{63CD56F5-6490-4D6C-9B3D-B20D5C84E625}']
    {class} function getInstance(context: JContext): JAppInitializer; cdecl;
  end;

  [JavaSignature('androidx/startup/AppInitializer')]
  JAppInitializer = interface(JObject)
    ['{EAB4F623-4C47-4BF1-AE73-94F9F07E65D5}']
    function initializeComponent(class_: Jlang_Class): JObject; cdecl;
    function isEagerlyInitialized(class_: Jlang_Class): Boolean; cdecl;
  end;
  TJAppInitializer = class(TJavaGenericImport<JAppInitializerClass, JAppInitializer>) end;

  JInitializationProviderClass = interface(JContentProviderClass)
    ['{1182BF3D-4C31-4063-998F-AEBCF593D865}']
    {class} function init: JInitializationProvider; cdecl;
  end;

  [JavaSignature('androidx/startup/InitializationProvider')]
  JInitializationProvider = interface(JContentProvider)
    ['{377326A1-A2DE-4B17-AF92-545EFBC8C12C}']
    function delete(uri: Jnet_Uri; string_: JString; string_1: TJavaObjectArray<JString>): Integer; cdecl;
    function getType(uri: Jnet_Uri): JString; cdecl;
    function insert(uri: Jnet_Uri; contentValues: JContentValues): Jnet_Uri; cdecl;
    function onCreate: Boolean; cdecl;
    function query(uri: Jnet_Uri; string_: TJavaObjectArray<JString>; string_1: JString; string_2: TJavaObjectArray<JString>; string_3: JString): JCursor; cdecl;
    function update(uri: Jnet_Uri; contentValues: JContentValues; string_: JString; string_1: TJavaObjectArray<JString>): Integer; cdecl;
  end;
  TJInitializationProvider = class(TJavaGenericImport<JInitializationProviderClass, JInitializationProvider>) end;

  JInitializerClass = interface(IJavaClass)
    ['{E5B7B95C-AC94-4146-8993-16C93ABF21A9}']
  end;

  [JavaSignature('androidx/startup/Initializer')]
  JInitializer = interface(IJavaInstance)
    ['{968B1D6E-9B16-46FB-835D-76E9DF82AFF2}']
    function create(context: JContext): JObject; cdecl;
    function dependencies: JList; cdecl;
  end;
  TJInitializer = class(TJavaGenericImport<JInitializerClass, JInitializer>) end;

  JStartupExceptionClass = interface(JRuntimeExceptionClass)
    ['{CDD0C727-FB10-4D95-A136-CAA2DF0EB4C3}']
    {class} function init(throwable: JThrowable): JStartupException; cdecl; overload;
    {class} function init(string_: JString): JStartupException; cdecl; overload;
    {class} function init(string_: JString; throwable: JThrowable): JStartupException; cdecl; overload;
  end;

  [JavaSignature('androidx/startup/StartupException')]
  JStartupException = interface(JRuntimeException)
    ['{D3C7F524-205D-4234-B926-868B7B2916EE}']
  end;
  TJStartupException = class(TJavaGenericImport<JStartupExceptionClass, JStartupException>) end;

  JStartupLoggerClass = interface(JObjectClass)
    ['{8A710C2C-2DB9-448F-8049-2AC74211EA79}']
    {class} procedure e(string_: JString; throwable: JThrowable); cdecl;
    {class} procedure i(string_: JString); cdecl;
  end;

  [JavaSignature('androidx/startup/StartupLogger')]
  JStartupLogger = interface(JObject)
    ['{9F2B4DCE-C22B-4653-8566-501ACFDAC238}']
  end;
  TJStartupLogger = class(TJavaGenericImport<JStartupLoggerClass, JStartupLogger>) end;

  JPrinterManager_PrinterManagerListenerClass = interface(IJavaClass)
    ['{17C424B8-7ADB-4E06-9F31-8075719D8A5F}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/PrinterManager$PrinterManagerListener')]
  JPrinterManager_PrinterManagerListener = interface(IJavaInstance)
    ['{65C51FC1-87FA-4F45-ACD0-01211E14E57A}']
    procedure onServiceConnected; cdecl;
  end;
  TJPrinterManager_PrinterManagerListener = class(TJavaGenericImport<JPrinterManager_PrinterManagerListenerClass, JPrinterManager_PrinterManagerListener>) end;

  JDarumaMobileClass = interface(JPrinterManager_PrinterManagerListenerClass)
    ['{991CD444-2153-4DC8-9323-921CD9163ACE}']
    {class} function _GetnumInstances: Integer; cdecl;
    {class} procedure _SetnumInstances(Value: Integer); cdecl;
    {class} function _GetsatNativo: JSatNativo; cdecl;
    {class} procedure _SetsatNativo(Value: JSatNativo); cdecl;
    {class} function _GetthVersaoNT: JRunnable; cdecl;
    {class} procedure _SetthVersaoNT(Value: JRunnable); cdecl;
    {class} function inicializar(string_: JString): JDarumaMobile; cdecl; overload;
    {class} function inicializar(string_: JString; string_1: JString): JDarumaMobile; cdecl; overload;
    {class} function inicializar(context: JContext; string_: JString): JDarumaMobile; cdecl; overload;
    {class} function inicializar(context: JContext; string_: JString; string_1: JString): JDarumaMobile; cdecl; overload;
    {class} function init(context: JContext; string_: JString; string_1: JString): JDarumaMobile; cdecl;//Deprecated
    {class} function isSatNativo: Boolean; cdecl;
    {class} function retornaDispositivosBluetooth: JList; cdecl;
    {class} function retornaVersao: JString; cdecl;
    {class} property numInstances: Integer read _GetnumInstances write _SetnumInstances;
    {class} property satNativo: JSatNativo read _GetsatNativo write _SetsatNativo;
    {class} property thVersaoNT: JRunnable read _GetthVersaoNT write _SetthVersaoNT;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/DarumaMobile')]
  JDarumaMobile = interface(JPrinterManager_PrinterManagerListener)
    ['{50F76824-F4AF-4441-8097-4EFA6A0068FA}']
    function ImprimeCodBarras(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function RegAlterarValor_NFCe(string_: JString; string_1: JString): Integer; cdecl; overload;
    function RegAlterarValor_NFCe(string_: JString; string_1: JString; b: Boolean): Integer; cdecl; overload;
    function RegAlterarValor_NFSe(string_: JString; string_1: JString): Integer; cdecl;
    function RegAlterarValor_SAT(string_: JString; string_1: JString): Integer; cdecl;
    function RegPersistirXML_NFCe: Integer; cdecl;
    function RegRetornarValor_NFSe(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    function RegRetornarValor_SAT(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    function aCFAbrirNumSerie_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString): Integer; cdecl;
    function aCFAbrir_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString): Integer; cdecl;
    function aCFAbrir_NFSe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString; string_11: JString): Integer; cdecl;
    function aCFAbrir_SAT(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString): Integer; cdecl;
    function aCFCancelarAcrescimoItem_SAT(string_: JString): Integer; cdecl;
    function aCFCancelarAcrescimo_NFCe(string_: JString): Integer; cdecl;
    function aCFCancelarDescontoItem_NFCe(string_: JString): Integer; cdecl;
    function aCFCancelarDescontoItem_SAT(string_: JString): Integer; cdecl;
    function aCFCancelarItemParcial_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function aCFCancelarItem_NFCe(string_: JString): Integer; cdecl;
    function aCFCancelarItem_SAT(string_: JString): Integer; cdecl;
    function aCFConfCofinsAliq_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function aCFConfCofinsNT_NFCe(string_: JString): Integer; cdecl;
    function aCFConfCofinsOutr_NFCe(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function aCFConfCofinsQtde_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function aCFConfCofinsSn_SAT(string_: JString): Integer; cdecl;
    function aCFConfCombustivel_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString; string_11: JString; string_12: JString; string_13: JString): Integer; cdecl;
    function aCFConfICMS00_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function aCFConfICMS10_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString): Integer; cdecl;
    function aCFConfICMS20_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString): Integer; cdecl;
    function aCFConfICMS30_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString): Integer; cdecl;
    function aCFConfICMS40_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function aCFConfICMS51_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString): Integer; cdecl;
    function aCFConfICMS60_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function aCFConfICMS70_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString; string_11: JString): Integer; cdecl;
    function aCFConfICMS90_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString; string_11: JString): Integer; cdecl;
    function aCFConfICMSPart_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString; string_11: JString): Integer; cdecl;
    function aCFConfICMSSN101_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function aCFConfICMSSN102_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function aCFConfICMSSN201_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString): Integer; cdecl;
    function aCFConfICMSSN202_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString): Integer; cdecl;
    function aCFConfICMSSN500_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function aCFConfICMSSN900_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString; string_11: JString): Integer; cdecl;
    function aCFConfICMSST_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString): Integer; cdecl;
    function aCFConfImposto_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function aCFConfImposto_SAT(string_: JString; string_1: JString): Integer; cdecl;
    function aCFConfLeiImposto_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString): Integer; cdecl;
    function aCFConfPisAliq_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function aCFConfPisNT_NFCe(string_: JString): Integer; cdecl;
    function aCFConfPisOutr_NFCe(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function aCFConfPisQtde_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function aCFConfPisSn_SAT(string_: JString): Integer; cdecl;
    function aCFConfRastro_NFCe(string_: JString): Integer; cdecl;
    function aCFEfetuarPagamentoCartao_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString): Integer; cdecl;
    function aCFEfetuarPagamento_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function aCFEfetuarPagamento_SAT(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function aCFEstornarPagamento_NFCe(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function aCFEstornarPagamento_SAT(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function aCFIdentificarConsumidor_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString): Integer; cdecl;
    function aCFIdentificarTransportadora_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString): Integer; cdecl;
    function aCFLancarAcrescimoItem_NFCe(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function aCFLancarAcrescimoItem_SAT(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function aCFLancarDescontoItem_NFCe(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function aCFLancarDescontoItem_SAT(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function aCFMsgPromocional_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function aCFTotalizar_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function aCFTotalizar_SAT(string_: JString; string_1: JString): Integer; cdecl;
    function aCFValorLeiImposto_NFCe(string_: JString): Integer; cdecl;
    function aCFVenderCompleto_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString): Integer; cdecl;
    function aCFVenderCompleto_SAT(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString): Integer; cdecl;
    function aCFVenderXml_NFCe(string_: JString): Integer; cdecl;
    function aCFVender_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString): Integer; cdecl;
    function aCFVender_SAT(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString): Integer; cdecl;
    function aCFeCancelarFormaPagamento_SAT(string_: JString): Integer; cdecl;
    function acfVender_NFSe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString; string_11: JString; string_12: JString): Integer; cdecl;
    function checkSum(string_: JString): JString; cdecl;
    function confNumSeriesNF_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function confParametros(string_: JString): Integer; cdecl;
    function eAtualizarEnviarXML_NFCe_Daruma(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    procedure eCarregarBitmapPromocional_ECF(string_: JString; string_1: JString; string_2: JString); cdecl;
    function eCarregarLogoBMP(string_: JString): Integer; cdecl;
    function eCompararDataHora_NFCe(c: TJavaArray<Char>): Integer; cdecl;
    function eGerarQrCode_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function enviarComando(string_: JString): Integer; cdecl;
    function enviarComandoDual(string_: JString): Integer; cdecl;
    function enviarComando_FS(string_: JString; string_1: JString; c: TJavaArray<Char>): Integer; cdecl;
    function enviarComando_FS_C(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    function enviarComando_FS_F(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    function enviarComando_FS_R(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    function enviarResponderComando(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    function fecharComunicacao: Integer; cdecl;
    function getTimeout: Integer; cdecl;
    function iCFImprimirParametrizado_NFCe(string_: JString; string_1: JString; string_2: JString; i: Integer; i1: Integer; string_3: JString): Integer; cdecl;
    function iCFImprimir_NFCe(string_: JString; string_1: JString; string_2: JString; i: Integer; i1: Integer): Integer; cdecl;
    function iCFReImprimir_NFCe(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function iImprimirCFe_SAT(string_: JString; string_1: JString): Integer; cdecl;
    function iImprimirTexto_DUAL(string_: JString): Integer; cdecl;
    function iTEF_ImprimirResposta_NFCe(string_: JString; i: Integer; i1: Integer; i2: Integer): Integer; cdecl;
    function iniciarComunicacao: Integer; cdecl;
    function mostrarLog(string_: TJavaObjectArray<JString>): Integer; cdecl;
    procedure onServiceConnected; cdecl;
    function rAvisoErro_NFCe(c: TJavaArray<Char>; c1: TJavaArray<Char>): Integer; cdecl;
    function rCFVerificarStatus_NFCe: Integer; cdecl;
    function rInfoEstendida_NFCe(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    function rInfoEstendida_SAT_Daruma(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    function rNumDocsContingenciaCanc_NFCe: Integer; cdecl;
    function rNumDocsContingencia_NFCe: Integer; cdecl;
    function rNumDocsContingencia_SAT: Integer; cdecl;
    function rRecuperarXML_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function rRetornarInformacaoArq_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString): Integer; cdecl;
    function rRetornarInformacaoContingencia_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; c: TJavaArray<Char>): Integer; cdecl;
    function rRetornarInformacao_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; c: TJavaArray<Char>): Integer; cdecl;
    function rStatusImpressora_NFCe: Integer; cdecl;
    function rStatusWS_NFCe: Integer; cdecl;
    function rURLQrcode_NFCe(c: TJavaArray<Char>): Integer; cdecl;
    function rValidadeCertificado_NFCe(c: TJavaArray<Char>; c1: TJavaArray<Char>): Integer; cdecl;
    function regRetornarValor_NFCe(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    function resetarLog: Integer; cdecl;
    function respostaComando(c: TJavaArray<Char>): Integer; cdecl;
    function retornarParametroComunicacao(string_: JString): JString; cdecl;
    function retornarParametroFramework(string_: JString): JString; cdecl;
    function retornarParametros(string_: JString; string_1: TJavaObjectArray<JString>): Integer; cdecl;
    function retornarStatusConexao: Integer; cdecl;
    procedure setContext(context: JContext); cdecl;
    procedure setTimeout(i: Integer); cdecl;
    function tCFCancelarOffLine_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function tCFCancelar_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString): Integer; cdecl;
    function tCFEncerrarConfigMsg_NFCe(string_: JString; string_1: JString): Integer; cdecl;
    function tCFEncerrar_NFCe(string_: JString): Integer; cdecl;
    function tCFEncerrar_SAT(string_: JString; string_1: JString): Integer; cdecl;
    function tCFInutilizar_NFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function tCFeCancelar_SAT: Integer; cdecl;
    function tCFeEnviar_SAT(string_: JString): Integer; cdecl;
    function tDescartarNota_NFCe(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function tEnviarContingenciaCancOffline_NFCe(i: Integer): Integer; cdecl;
    function tEnviarContingenciaOffline_NFCe(i: Integer): Integer; cdecl;
    function tEnviarContingencia_SAT(i: Integer): Integer; cdecl;
    function tEnviarEmail_NFCe(string_: JString): Integer; cdecl;
    function tEnviarXML_SAT_Daruma(string_: JString): Integer; cdecl;
    function tEnviar_NFCe(string_: JString; string_1: JString; i: Integer; i1: Integer; c: TJavaArray<Char>): Integer; cdecl;
    function tEnvioUnitContingenciaCancOffLine_NFCe(c: TJavaArray<Char>; c1: TJavaArray<Char>; c2: TJavaArray<Char>; c3: TJavaArray<Char>; c4: TJavaArray<Char>; c5: TJavaArray<Char>): Integer; cdecl;
    function tEnvioUnitContingenciaOffLine_NFCe(c: TJavaArray<Char>; c1: TJavaArray<Char>; c2: TJavaArray<Char>; c3: TJavaArray<Char>; c4: TJavaArray<Char>; c5: TJavaArray<Char>): Integer; cdecl;
    function tcfEncerrar_NFSe(string_: JString): Integer; cdecl;
  end;
  TJDarumaMobile = class(TJavaGenericImport<JDarumaMobileClass, JDarumaMobile>) end;

  JDarumaMobile_1Class = interface(JRunnableClass)
    ['{C8FD3028-F8E1-41B1-9CCC-12D8674151FA}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/DarumaMobile$1')]
  JDarumaMobile_1 = interface(JRunnable)
    ['{264983AA-302A-477F-94BC-32A6C8188257}']
    procedure run; cdecl;
  end;
  TJDarumaMobile_1 = class(TJavaGenericImport<JDarumaMobile_1Class, JDarumaMobile_1>) end;

  JDarumaMobile_2Class = interface(JRunnableClass)
    ['{430BCD8B-EE47-4996-B7FF-189F2159322F}']
    {class} function _Getthis: JDarumaMobile; cdecl;
    {class} function _Getvalctg: Boolean; cdecl;
    {class} function _GetvalfinalPszBufferAntesQrcode2: JString; cdecl;
    {class} function _GetvalfinalPszBufferDepoisQrcode1: JString; cdecl;
    {class} function _GetvalfinalPszBufferDepoisQrcode2: JString; cdecl;
    {class} function init(darumaMobile: JDarumaMobile; string_: JString; string_1: JString; string_2: JString; b: Boolean; string_3: JString; string_4: JString; string_5: JString): JDarumaMobile_2; cdecl;//Deprecated
    {class} property this: JDarumaMobile read _Getthis;
    {class} property valctg: Boolean read _Getvalctg;
    {class} property valfinalPszBufferAntesQrcode2: JString read _GetvalfinalPszBufferAntesQrcode2;
    {class} property valfinalPszBufferDepoisQrcode1: JString read _GetvalfinalPszBufferDepoisQrcode1;
    {class} property valfinalPszBufferDepoisQrcode2: JString read _GetvalfinalPszBufferDepoisQrcode2;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/DarumaMobile$2')]
  JDarumaMobile_2 = interface(JRunnable)
    ['{44313E1E-3E94-4E12-9381-1037C90840A1}']
    procedure run; cdecl;
  end;
  TJDarumaMobile_2 = class(TJavaGenericImport<JDarumaMobile_2Class, JDarumaMobile_2>) end;

  JDarumaMobile_3Class = interface(JRunnableClass)
    ['{30E275D0-68FF-4E32-B1A1-B2C35D25DB47}']
    {class} function init(darumaMobile: JDarumaMobile; string_: JString): JDarumaMobile_3; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/DarumaMobile$3')]
  JDarumaMobile_3 = interface(JRunnable)
    ['{A160F45D-C644-4F7B-97ED-E86E4B867303}']
    procedure run; cdecl;
  end;
  TJDarumaMobile_3 = class(TJavaGenericImport<JDarumaMobile_3Class, JDarumaMobile_3>) end;

  JITraceListenerClass = interface(IJavaClass)
    ['{5F0951A6-8468-418E-936F-F4CF6137A259}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/log/listeners/ITraceListener')]
  JITraceListener = interface(IJavaInstance)
    ['{A5D12A2B-8291-49F9-BC4E-B1137A4F2D19}']
    function check(i: Integer; string_: JString): Boolean; cdecl;
    procedure traceOcurred(i: Integer; string_: JString; string_1: JString; date: JDate); cdecl;
  end;
  TJITraceListener = class(TJavaGenericImport<JITraceListenerClass, JITraceListener>) end;

  JDarumaMobile_LogMemoriaClass = interface(JITraceListenerClass)
    ['{82098823-D0A2-44F0-BEF3-2324A97635D3}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/DarumaMobile$LogMemoria')]
  JDarumaMobile_LogMemoria = interface(JITraceListener)
    ['{91B04C97-2D83-4DA1-B39D-78F5234DF3DA}']
    function check(i: Integer; string_: JString): Boolean; cdecl;
    procedure traceOcurred(i: Integer; string_: JString; string_1: JString; date: JDate); cdecl;
  end;
  TJDarumaMobile_LogMemoria = class(TJavaGenericImport<JDarumaMobile_LogMemoriaClass, JDarumaMobile_LogMemoria>) end;

  JPrinterManagerClass = interface(JObjectClass)
    ['{92C868A8-38EA-4E39-B41A-BA3838947B32}']
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
    {class} procedure _SetsCurrentLength(Value: Int64); cdecl;
    {class} function _GetsTotalLength: Int64; cdecl;
    {class} procedure _SetsTotalLength(Value: Int64); cdecl;
    {class} function init(context: JContext; printerManagerListener: JPrinterManager_PrinterManagerListener): JPrinterManager; cdecl;//Deprecated
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
    {class} property sCurrentLength: Int64 read _GetsCurrentLength write _SetsCurrentLength;
    {class} property sTotalLength: Int64 read _GetsTotalLength write _SetsTotalLength;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/PrinterManager')]
  JPrinterManager = interface(JObject)
    ['{379B0F1D-D554-4FFF-BA2F-01F877C8A923}']
    function getBootloaderVersion: JString; cdecl;
    function getFirmwareVersion: JString; cdecl;
    function hasXChengPrinter(context: JContext): Boolean; cdecl;
    procedure onPrinterStart; cdecl;
    procedure onPrinterStop; cdecl;
    procedure printBarCode(string_: JString; i: Integer; i1: Integer; i2: Integer; b: Boolean); cdecl;
    procedure printBitmap(bitmap: JBitmap); cdecl; overload;
    procedure printBitmap(bitmap: JBitmap; map: JMap); cdecl; overload;
    procedure printColumnsTextWithAttributes(string_: TJavaObjectArray<JString>; list: JList); cdecl;
    procedure printQRCode(string_: JString; i: Integer; i1: Integer); cdecl;
    function printStatus: Boolean; cdecl;
    procedure printText(string_: JString); cdecl;
    procedure printTextWithAttributes(string_: JString; map: JMap); cdecl;
    procedure printWrapPaper(i: Integer); cdecl;
    procedure printerInit; cdecl;
    function printerPaper: Boolean; cdecl;
    procedure printerReset; cdecl;
    function printerTemperature(activity: JActivity): Integer; cdecl;
    procedure sendRAWData(b: TJavaArray<Byte>); cdecl;
    procedure sendRAWDataWil(b: TJavaArray<Byte>; string_: JString; b1: TJavaArray<Byte>); cdecl;
    procedure setPrinterSpeed(i: Integer); cdecl;
    procedure upgradePrinter; cdecl;
  end;
  TJPrinterManager = class(TJavaGenericImport<JPrinterManagerClass, JPrinterManager>) end;

  JPrinterManager_1Class = interface(JServiceConnectionClass)
    ['{102F8808-EB3E-4BE8-B860-D5DFA4BA86FF}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/PrinterManager$1')]
  JPrinterManager_1 = interface(JServiceConnection)
    ['{C048C27A-66F0-4D9C-8481-87CD7C884789}']
    procedure onServiceConnected(componentName: JComponentName; iBinder: JIBinder); cdecl;
    procedure onServiceDisconnected(componentName: JComponentName); cdecl;
  end;
  TJPrinterManager_1 = class(TJavaGenericImport<JPrinterManager_1Class, JPrinterManager_1>) end;

  JIPrinterCallback_StubClass = interface(JBinderClass)
    ['{DF5B0CC3-6813-41C7-980E-AD09FFB9858D}']
    {class} function asInterface(iBinder: JIBinder): JIPrinterCallback; cdecl;
    {class} function getDefaultImpl: JIPrinterCallback; cdecl;
    {class} function init: JIPrinterCallback_Stub; cdecl;
    {class} function setDefaultImpl(iPrinterCallback: JIPrinterCallback): Boolean; cdecl;
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterCallback$Stub')]
  JIPrinterCallback_Stub = interface(JBinder)
    ['{E725869F-BD57-47F4-B2AF-5169A4F0C46B}']
    function asBinder: JIBinder; cdecl;
    function onTransact(i: Integer; parcel: JParcel; parcel1: JParcel; i1: Integer): Boolean; cdecl;
  end;
  TJIPrinterCallback_Stub = class(TJavaGenericImport<JIPrinterCallback_StubClass, JIPrinterCallback_Stub>) end;

  JPrinterManager_2Class = interface(JIPrinterCallback_StubClass)
    ['{0495F509-DA56-48E0-AEAE-6A29A6B57C76}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/PrinterManager$2')]
  JPrinterManager_2 = interface(JIPrinterCallback_Stub)
    ['{A2D7BF52-AF53-4BCD-AEB8-3AA23ACDFC2D}']
    procedure onComplete; cdecl;
    procedure onException(i: Integer; string_: JString); cdecl;
    procedure onLength(l: Int64; l1: Int64); cdecl;
  end;
  TJPrinterManager_2 = class(TJavaGenericImport<JPrinterManager_2Class, JPrinterManager_2>) end;

  JThreadPoolManagerClass = interface(JObjectClass)
    ['{CAB12944-5EE6-43E3-A9C4-FBBB3DAD66DA}']
    {class} function getInstance: JThreadPoolManager; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/ThreadPoolManager')]
  JThreadPoolManager = interface(JObject)
    ['{8449002A-5CFE-44A0-83D3-77FCF67FABC9}']
    procedure executeTask(runnable: JRunnable); cdecl;
  end;
  TJThreadPoolManager = class(TJavaGenericImport<JThreadPoolManagerClass, JThreadPoolManager>) end;

  JZXingLibConfigClass = interface(JSerializableClass)
    ['{F52DFF19-D2C4-4162-975C-36732A14CB2C}']
    {class} function _GetINTENT_KEY: JString; cdecl;
    {class} function _GetplayBeepOnDecoded: Boolean; cdecl;
    {class} procedure _SetplayBeepOnDecoded(Value: Boolean); cdecl;
    {class} function _GetuseFrontCam: Boolean; cdecl;
    {class} procedure _SetuseFrontCam(Value: Boolean); cdecl;
    {class} function _GetuseFrontLight: Boolean; cdecl;
    {class} procedure _SetuseFrontLight(Value: Boolean); cdecl;
    {class} function _GetvibrateOnDecoded: Boolean; cdecl;
    {class} procedure _SetvibrateOnDecoded(Value: Boolean); cdecl;
    {class} function init: JZXingLibConfig; cdecl;//Deprecated
    {class} property INTENT_KEY: JString read _GetINTENT_KEY;
    {class} property playBeepOnDecoded: Boolean read _GetplayBeepOnDecoded write _SetplayBeepOnDecoded;
    {class} property useFrontCam: Boolean read _GetuseFrontCam write _SetuseFrontCam;
    {class} property useFrontLight: Boolean read _GetuseFrontLight write _SetuseFrontLight;
    {class} property vibrateOnDecoded: Boolean read _GetvibrateOnDecoded write _SetvibrateOnDecoded;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/config/ZXingLibConfig')]
  JZXingLibConfig = interface(JSerializable)
    ['{7A1C994B-FEDC-47B3-AC0C-285E1934CAE9}']
    function _GetcopyToClipboard: Boolean; cdecl;
    procedure _SetcopyToClipboard(Value: Boolean); cdecl;
    function _GetreverseImage: Boolean; cdecl;
    procedure _SetreverseImage(Value: Boolean); cdecl;
    property copyToClipboard: Boolean read _GetcopyToClipboard write _SetcopyToClipboard;
    property reverseImage: Boolean read _GetreverseImage write _SetreverseImage;
  end;
  TJZXingLibConfig = class(TJavaGenericImport<JZXingLibConfigClass, JZXingLibConfig>) end;

  JDarumaConfigScannerClass = interface(JZXingLibConfigClass)
    ['{8B3C1259-940A-4E7C-AF04-CCA6CC5EC1FC}']
    {class} function _GetINTENT_KEY: JString; cdecl;
    {class} function _GetidBeepCode: Integer; cdecl;
    {class} procedure _SetidBeepCode(Value: Integer); cdecl;
    {class} function _GettimeoutLeitura: Integer; cdecl;
    {class} procedure _SettimeoutLeitura(Value: Integer); cdecl;
    {class} function _GettipoCodigo: JString; cdecl;
    {class} procedure _SettipoCodigo(Value: JString); cdecl;
    {class} function init: JDarumaConfigScanner; cdecl;
    {class} //INTENT_KEY is defined in parent interface
    {class} property idBeepCode: Integer read _GetidBeepCode write _SetidBeepCode;
    {class} property timeoutLeitura: Integer read _GettimeoutLeitura write _SettimeoutLeitura;
    {class} property tipoCodigo: JString read _GettipoCodigo write _SettipoCodigo;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/DarumaConfigScanner')]
  JDarumaConfigScanner = interface(JZXingLibConfig)
    ['{537FB16F-184C-4CE4-A356-A7A8AC85785E}']
    function _GettrataExcecao: Boolean; cdecl;
    procedure _SettrataExcecao(Value: Boolean); cdecl;
    procedure defineConfiguracao(string_: JString; string_1: JString); cdecl;
    function isTrataExcecao: Boolean; cdecl;
    property trataExcecao: Boolean read _GettrataExcecao write _SettrataExcecao;
  end;
  TJDarumaConfigScanner = class(TJavaGenericImport<JDarumaConfigScannerClass, JDarumaConfigScanner>) end;

  JDarumaDecoderClass = interface(JObjectClass)
    ['{86CA4323-81A1-492D-8C6F-E4B34AB1862B}']
    {class} function init(darumaScanner: JDarumaScanner; darumaConfigScanner: JDarumaConfigScanner): JDarumaDecoder; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/DarumaDecoder')]
  JDarumaDecoder = interface(JObject)
    ['{8B1B7292-B0F0-4020-A172-35B4E3E078A2}']
    function getHandler: JHandler; cdecl;
    //procedure handleDecode(result: Jzxing_Result; bitmap: JBitmap); cdecl;
    function isDecoding: Boolean; cdecl;
    procedure startDecoding; cdecl;
    procedure stopDecoding; cdecl;
  end;
  TJDarumaDecoder = class(TJavaGenericImport<JDarumaDecoderClass, JDarumaDecoder>) end;

  JDarumaScanResultClass = interface(JObjectClass)
    ['{7CC401DB-89EE-4D1B-B45B-1E29C1A27057}']
    {class} function init(string_: JString; string_1: JString): JDarumaScanResult; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/DarumaScanResult')]
  JDarumaScanResult = interface(JObject)
    ['{DBAF3B2D-6376-4F19-BACC-ABF0332B2072}']
    function getContents: JString; cdecl;
    function getFormatName: JString; cdecl;
    function toString: JString; cdecl;
  end;
  TJDarumaScanResult = class(TJavaGenericImport<JDarumaScanResultClass, JDarumaScanResult>) end;

  JISendHandlerClass = interface(IJavaClass)
    ['{E234FFFB-6BE1-4346-8E4F-A958086499D4}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/ISendHandler')]
  JISendHandler = interface(IJavaInstance)
    ['{E05B1202-CB0A-4D4E-8397-32B125CEF557}']
    function getHandler: JHandler; cdecl;
  end;
  TJISendHandler = class(TJavaGenericImport<JISendHandlerClass, JISendHandler>) end;

  JDarumaScannerClass = interface(JISendHandlerClass)
    ['{8963DF96-558A-422D-9851-0C3B0DACA78A}']
    {class} function inicializar(activity: JActivity; frameLayout: JFrameLayout): JDarumaScanner; cdecl; overload;//Deprecated
    {class} function inicializar(activity: JActivity; frameLayout: JFrameLayout; string_: JString): JDarumaScanner; cdecl; overload;
    {class} function inicializar(activity: JActivity; frameLayout: JFrameLayout; string_: JString; string_1: JString): JDarumaScanner; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/DarumaScanner')]
  JDarumaScanner = interface(JISendHandler)
    ['{760963CC-D869-4DB0-A7B8-18CAE7A7F551}']
    function confParametros(string_: JString): Integer; cdecl;
    function finalizarLeitura: Integer; cdecl;
    function getHandler: JHandler; cdecl;
    function lerCodigoDeBarrasAssincrono(handler: JHandler): Integer; cdecl;
    procedure surfaceChanged(surfaceHolder: JSurfaceHolder; i: Integer; i1: Integer; i2: Integer); cdecl;
    procedure surfaceCreated(surfaceHolder: JSurfaceHolder); cdecl;
    procedure surfaceDestroyed(surfaceHolder: JSurfaceHolder); cdecl;
  end;
  TJDarumaScanner = class(TJavaGenericImport<JDarumaScannerClass, JDarumaScanner>) end;

  JDarumaScannerHandlerClass = interface(JHandlerClass)
    ['{EE7F0EF3-B9B1-47DC-A7D8-9248017C8DF5}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/DarumaScannerHandler')]
  JDarumaScannerHandler = interface(JHandler)
    ['{3361BBD8-B50A-413C-A9A7-5EC16A4A2BF4}']
    procedure handleMessage(message: JMessage); cdecl;
    procedure quitSynchronously; cdecl;
  end;
  TJDarumaScannerHandler = class(TJavaGenericImport<JDarumaScannerHandlerClass, JDarumaScannerHandler>) end;

  JDarumaScannerHandler_StateClass = interface(JEnumClass)
    ['{52E13F22-AEF9-4367-96B1-59297F8C15A5}']
    {class} function _GetDONE: JDarumaScannerHandler_State; cdecl;
    {class} function _GetPREVIEW: JDarumaScannerHandler_State; cdecl;
    {class} function _GetSUCCESS: JDarumaScannerHandler_State; cdecl;
    {class} function valueOf(string_: JString): JDarumaScannerHandler_State; cdecl;
    {class} function values: TJavaObjectArray<JDarumaScannerHandler_State>; cdecl;//Deprecated
    {class} property DONE: JDarumaScannerHandler_State read _GetDONE;
    {class} property PREVIEW: JDarumaScannerHandler_State read _GetPREVIEW;
    {class} property SUCCESS: JDarumaScannerHandler_State read _GetSUCCESS;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/DarumaScannerHandler$State')]
  JDarumaScannerHandler_State = interface(JEnum)
    ['{2D2F039F-5096-4E7F-A144-0393E169770E}']
  end;
  TJDarumaScannerHandler_State = class(TJavaGenericImport<JDarumaScannerHandler_StateClass, JDarumaScannerHandler_State>) end;

  JBeepManagerClass = interface(JObjectClass)
    ['{8A7BBE18-347C-4584-B31D-274AEC76CDB3}']
    {class} function init(activity: JActivity; i: Integer; zXingLibConfig: JZXingLibConfig): JBeepManager; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/BeepManager')]
  JBeepManager = interface(JObject)
    ['{4DB80B09-1B78-4793-92A4-DE4FAEF58D15}']
    procedure playBeepSoundAndVibrate; cdecl;
    procedure updatePrefs; cdecl;
  end;
  TJBeepManager = class(TJavaGenericImport<JBeepManagerClass, JBeepManager>) end;

  JBeepManager_1Class = interface(JMediaPlayer_OnCompletionListenerClass)
    ['{5CC63759-62C9-4C87-BCA6-CFA4F8384A13}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/BeepManager$1')]
  JBeepManager_1 = interface(JMediaPlayer_OnCompletionListener)
    ['{C388217A-528A-4697-BC60-CA0434855A7B}']
    procedure onCompletion(mediaPlayer: JMediaPlayer); cdecl;
  end;
  TJBeepManager_1 = class(TJavaGenericImport<JBeepManager_1Class, JBeepManager_1>) end;

//  JDecodeAsyncTaskClass = interface(JAsyncTaskClass)
//    ['{DD97CE42-F6CA-47AF-8645-2130D3D6AC29}']
//    {class} function _GetBARCODE_BITMAP: JString; cdecl;
//    {class} //function init(iSendHandler: JISendHandler; vector: JVector; string_: JString; resultPointCallback: JResultPointCallback): JDecodeAsyncTask; cdecl;
//    {class} property BARCODE_BITMAP: JString read _GetBARCODE_BITMAP;
//  end;

//  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/DecodeAsyncTask')]
//  JDecodeAsyncTask = interface(JAsyncTask)
//    ['{18069BBF-BDFD-45F0-A1D0-CE9B31D1F4AA}']
//    function getHandler: JHandler; cdecl;
//  end;
//  TJDecodeAsyncTask = class(TJavaGenericImport<JDecodeAsyncTaskClass, JDecodeAsyncTask>) end;

  JDecodeFormatManagerClass = interface(JObjectClass)
    ['{F4BB9550-2496-4751-AFE4-35DABC3A4A03}']
    {class} function parseDecodeFormats(intent: JIntent): JVector; cdecl; overload;//Deprecated
    {class} function parseDecodeFormats(uri: Jnet_Uri): JVector; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/DecodeFormatManager')]
  JDecodeFormatManager = interface(JObject)
    ['{D3468556-13DC-49EE-A7E5-F48B3111051D}']
  end;
  TJDecodeFormatManager = class(TJavaGenericImport<JDecodeFormatManagerClass, JDecodeFormatManager>) end;

  JDecodeHandlerClass = interface(JHandlerClass)
    ['{A3FC36F7-E74A-41A9-B310-041B98D6E869}']
    {class} function init(iSendHandler: JISendHandler; hashtable: JHashtable): JDecodeHandler; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/DecodeHandler')]
  JDecodeHandler = interface(JHandler)
    ['{B0AA8D30-FC65-4C23-8892-2FAB48772494}']
    procedure handleMessage(message: JMessage); cdecl;
  end;
  TJDecodeHandler = class(TJavaGenericImport<JDecodeHandlerClass, JDecodeHandler>) end;

  JDecodeThreadClass = interface(JThreadClass)
    ['{A6AE853C-0858-4D99-9DBE-98E5196F985A}']
    {class} function _GetBARCODE_BITMAP: JString; cdecl;
    {class} //function init(iSendHandler: JISendHandler; vector: JVector; string_: JString; resultPointCallback: JResultPointCallback): JDecodeThread; cdecl;
    {class} property BARCODE_BITMAP: JString read _GetBARCODE_BITMAP;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/DecodeThread')]
  JDecodeThread = interface(JThread)
    ['{44CCE689-5B1D-4290-8FBA-4E77D79FE1A1}']
    function getHandler: JHandler; cdecl;
    procedure run; cdecl;
  end;
  TJDecodeThread = class(TJavaGenericImport<JDecodeThreadClass, JDecodeThread>) end;

  JFinishListenerClass = interface(JDialogInterface_OnClickListenerClass)
    ['{FE442B22-6142-4029-8920-2255A137BEF0}']
    {class} function init(activity: JActivity): JFinishListener; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/FinishListener')]
  JFinishListener = interface(JDialogInterface_OnClickListener)
    ['{E5E2B7A7-FB37-49B2-925F-3258715D4C25}']
    procedure onCancel(dialogInterface: JDialogInterface); cdecl;
    procedure onClick(dialogInterface: JDialogInterface; i: Integer); cdecl;
    procedure run; cdecl;
  end;
  TJFinishListener = class(TJavaGenericImport<JFinishListenerClass, JFinishListener>) end;

  JInactivityTimerClass = interface(JObjectClass)
    ['{59A1613B-92AE-4DB0-9A16-48812336928C}']
    {class} function init(activity: JActivity): JInactivityTimer; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/InactivityTimer')]
  JInactivityTimer = interface(JObject)
    ['{A525DDB4-95B0-455D-AAAD-38C84E87FC54}']
    procedure onActivity; cdecl;
    procedure onPause; cdecl;
    procedure onResume; cdecl;
    procedure shutdown; cdecl;
  end;
  TJInactivityTimer = class(TJavaGenericImport<JInactivityTimerClass, JInactivityTimer>) end;

  JInactivityTimer_1Class = interface(JObjectClass)
    ['{680D0984-3721-4A98-B831-FB0808BB441F}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/InactivityTimer$1')]
  JInactivityTimer_1 = interface(JObject)
    ['{7DBB27B6-1D94-4B3D-AE35-077F8B6C0AB3}']
  end;
  TJInactivityTimer_1 = class(TJavaGenericImport<JInactivityTimer_1Class, JInactivityTimer_1>) end;

  JInactivityTimer_DaemonThreadFactoryClass = interface(JThreadFactoryClass)
    ['{EF82E7B1-C52E-4511-AA23-F2F14AE1B7C2}']
    {class} function newThread(runnable: JRunnable): JThread; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/InactivityTimer$DaemonThreadFactory')]
  JInactivityTimer_DaemonThreadFactory = interface(JThreadFactory)
    ['{43A495DD-9BC7-4492-95FA-536E00318559}']
  end;
  TJInactivityTimer_DaemonThreadFactory = class(TJavaGenericImport<JInactivityTimer_DaemonThreadFactoryClass, JInactivityTimer_DaemonThreadFactory>) end;

  JInactivityTimer_PowerStatusReceiverClass = interface(JBroadcastReceiverClass)
    ['{1172F881-DD06-4CC5-97BC-D71048765C8A}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/InactivityTimer$PowerStatusReceiver')]
  JInactivityTimer_PowerStatusReceiver = interface(JBroadcastReceiver)
    ['{6A0BE292-079D-4DBE-AF0E-EF1DF5096904}']
    procedure onReceive(context: JContext; intent: JIntent); cdecl;
  end;
  TJInactivityTimer_PowerStatusReceiver = class(TJavaGenericImport<JInactivityTimer_PowerStatusReceiverClass, JInactivityTimer_PowerStatusReceiver>) end;

  JIntentsClass = interface(JObjectClass)
    ['{0C3A1D87-8A03-4491-99DE-F36C1A594AEA}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/Intents')]
  JIntents = interface(JObject)
    ['{2219210B-875D-4627-9590-8E86903D35F1}']
  end;
  TJIntents = class(TJavaGenericImport<JIntentsClass, JIntents>) end;

  JIntents_ScanClass = interface(JObjectClass)
    ['{B7812A21-6A50-4D38-ADB5-BC9D3737F6B2}']
    {class} function _GetCHARACTER_SET: JString; cdecl;
    {class} function _GetDATA_MATRIX_MODE: JString; cdecl;
    {class} function _GetFORMATS: JString; cdecl;
    {class} function _GetHEIGHT: JString; cdecl;
    {class} function _GetMODE: JString; cdecl;
    {class} function _GetONE_D_MODE: JString; cdecl;
    {class} function _GetPRODUCT_MODE: JString; cdecl;
    {class} function _GetQR_CODE_MODE: JString; cdecl;
    {class} function _GetRESULT: JString; cdecl;
    {class} function _GetRESULT_BYTES: JString; cdecl;
    {class} function _GetRESULT_FORMAT: JString; cdecl;
    {class} function _GetSAVE_HISTORY: JString; cdecl;
    {class} function _GetWIDTH: JString; cdecl;
    {class} property CHARACTER_SET: JString read _GetCHARACTER_SET;
    {class} property DATA_MATRIX_MODE: JString read _GetDATA_MATRIX_MODE;
    {class} property FORMATS: JString read _GetFORMATS;
    {class} property HEIGHT: JString read _GetHEIGHT;
    {class} property MODE: JString read _GetMODE;
    {class} property ONE_D_MODE: JString read _GetONE_D_MODE;
    {class} property PRODUCT_MODE: JString read _GetPRODUCT_MODE;
    {class} property QR_CODE_MODE: JString read _GetQR_CODE_MODE;
    {class} property RESULT: JString read _GetRESULT;
    {class} property RESULT_BYTES: JString read _GetRESULT_BYTES;
    {class} property RESULT_FORMAT: JString read _GetRESULT_FORMAT;
    {class} property SAVE_HISTORY: JString read _GetSAVE_HISTORY;
    {class} property WIDTH: JString read _GetWIDTH;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/Intents$Scan')]
  JIntents_Scan = interface(JObject)
    ['{BD13615F-D1BB-4D57-A304-40CF7967EFF8}']
  end;
  TJIntents_Scan = class(TJavaGenericImport<JIntents_ScanClass, JIntents_Scan>) end;

  // br.com.daruma.framework.mobile.camera.dependencies.ViewfinderResultPointCallback
  JViewfinderViewClass = interface(JViewClass)
    ['{B4E62C7C-DFF7-4E34-B4B5-13405483B933}']
    {class} function init(context: JContext): JViewfinderView; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/ViewfinderView')]
  JViewfinderView = interface(JView)
    ['{04777666-DB97-45BF-90F4-255E851325B4}']
    //procedure addPossibleResultPoint(resultPoint: JResultPoint); cdecl;
    procedure drawResultBitmap(bitmap: JBitmap); cdecl;
    procedure drawViewfinder; cdecl;
    procedure onDraw(canvas: JCanvas); cdecl;
  end;
  TJViewfinderView = class(TJavaGenericImport<JViewfinderViewClass, JViewfinderView>) end;

  JAutoFocusCallbackClass = interface(JCamera_AutoFocusCallbackClass)
    ['{74B4B8ED-DC79-4687-A631-86BBD4A5506F}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/camera/AutoFocusCallback')]
  JAutoFocusCallback = interface(JCamera_AutoFocusCallback)
    ['{097D7295-8010-4F4E-82F5-CD147CFB7F58}']
    procedure onAutoFocus(b: Boolean; camera: JCamera); cdecl;
  end;
  TJAutoFocusCallback = class(TJavaGenericImport<JAutoFocusCallbackClass, JAutoFocusCallback>) end;

  JCameraConfigurationManagerClass = interface(JObjectClass)
    ['{C13AE782-BE02-4CF6-AF33-006E6F7BEA4F}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/camera/CameraConfigurationManager')]
  JCameraConfigurationManager = interface(JObject)
    ['{29E942DB-8869-4DAD-BAD9-F83DBD7F3BB1}']
  end;
  TJCameraConfigurationManager = class(TJavaGenericImport<JCameraConfigurationManagerClass, JCameraConfigurationManager>) end;

  Jcamera_CameraManagerClass = interface(JObjectClass)
    ['{885F4D3E-42CD-4873-BD05-438433E2375E}']
    {class} function _GetSDK_INT: Integer; cdecl;
    {class} function &get: Jcamera_CameraManager; cdecl;
    {class} property SDK_INT: Integer read _GetSDK_INT;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/camera/CameraManager')]
  Jcamera_CameraManager = interface(JObject)
    ['{1DE363E2-7E17-42AA-99F7-23DA9E216DEF}']
    //function buildLuminanceSource(b: TJavaArray<Byte>; i: Integer; i1: Integer): JPlanarYUVLuminanceSource; cdecl;
    procedure closeDriver; cdecl;
    function getFramingRect: JRect; cdecl;
    function getFramingRectInPreview: JRect; cdecl;
    function getSurfaceRotation: Integer; cdecl;
    procedure openDriver(i: Integer; surfaceHolder: JSurfaceHolder); cdecl;
    procedure requestAutoFocus(handler: JHandler; i: Integer); cdecl;
    procedure requestPreviewFrame(handler: JHandler; i: Integer); cdecl;
    procedure setManualFramingRect(i: Integer; i1: Integer); cdecl;
    procedure startPreview; cdecl;
    procedure stopPreview; cdecl;
  end;
  TJcamera_CameraManager = class(TJavaGenericImport<Jcamera_CameraManagerClass, Jcamera_CameraManager>) end;

  JFlashlightManagerClass = interface(JObjectClass)
    ['{841F2F67-F5AF-44A8-8248-5C94A22DEAA5}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/camera/FlashlightManager')]
  JFlashlightManager = interface(JObject)
    ['{5138EB5D-0351-45AA-96F6-BFE3E1C84EB7}']
  end;
  TJFlashlightManager = class(TJavaGenericImport<JFlashlightManagerClass, JFlashlightManager>) end;

  // br.com.daruma.framework.mobile.camera.dependencies.camera.PlanarYUVLuminanceSource
  JPreviewCallbackClass = interface(JCamera_PreviewCallbackClass)
    ['{85DC3AE1-C87A-44A2-876D-F707279CD060}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/camera/PreviewCallback')]
  JPreviewCallback = interface(JCamera_PreviewCallback)
    ['{12279A07-BDC4-4B23-B781-BF28B186A43B}']
    procedure onPreviewFrame(b: TJavaArray<Byte>; camera: JCamera); cdecl;
  end;
  TJPreviewCallback = class(TJavaGenericImport<JPreviewCallbackClass, JPreviewCallback>) end;

  JIVariaveisScanerClass = interface(JObjectClass)
    ['{A340FADF-8725-45BF-A8CE-57B095D37B29}']
    {class} function _GetautoFocus: Integer; cdecl;
    {class} procedure _SetautoFocus(Value: Integer); cdecl;
    {class} function _Getdecode: Integer; cdecl;
    {class} procedure _Setdecode(Value: Integer); cdecl;
    {class} function _GetdecodeFailed: Integer; cdecl;
    {class} procedure _SetdecodeFailed(Value: Integer); cdecl;
    {class} function _GetdecodeSucceeded: Integer; cdecl;
    {class} procedure _SetdecodeSucceeded(Value: Integer); cdecl;
    {class} function _Getquit: Integer; cdecl;
    {class} procedure _Setquit(Value: Integer); cdecl;
    {class} function _GetreturnScanResult: Integer; cdecl;
    {class} procedure _SetreturnScanResult(Value: Integer); cdecl;
    {class} function init: JIVariaveisScaner; cdecl;//Deprecated
    {class} property autoFocus: Integer read _GetautoFocus write _SetautoFocus;
    {class} property decode: Integer read _Getdecode write _Setdecode;
    {class} property decodeFailed: Integer read _GetdecodeFailed write _SetdecodeFailed;
    {class} property decodeSucceeded: Integer read _GetdecodeSucceeded write _SetdecodeSucceeded;
    {class} property quit: Integer read _Getquit write _Setquit;
    {class} property returnScanResult: Integer read _GetreturnScanResult write _SetreturnScanResult;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/integrator/IVariaveisScaner')]
  JIVariaveisScaner = interface(JObject)
    ['{611CC4F7-EC25-4468-A058-180746CCC491}']
  end;
  TJIVariaveisScaner = class(TJavaGenericImport<JIVariaveisScanerClass, JIVariaveisScaner>) end;

  JAComunicacaoClass = interface(JObjectClass)
    ['{543B5CE5-4C76-47C4-AB16-DED4E35EEB74}']
    {class} function _GetCOMUNICACAO_PADRAO: JAComunicacao; cdecl;
    {class} function _Getproduto: Integer; cdecl;
    {class} procedure _Setproduto(Value: Integer); cdecl;
    {class} function getComunicacao(context: JContext; map: JMap): JAComunicacao; cdecl;
    {class} function init: JAComunicacao; cdecl;//Deprecated
    {class} property COMUNICACAO_PADRAO: JAComunicacao read _GetCOMUNICACAO_PADRAO;
    {class} property produto: Integer read _Getproduto write _Setproduto;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/AComunicacao')]
  JAComunicacao = interface(JObject)
    ['{F2D1B89C-007A-40D9-A705-35AC72DF8949}']
    function _GetoriginLog: JString; cdecl;
    procedure _SetoriginLog(Value: JString); cdecl;
    function escreverDados(b: TJavaArray<Byte>): Boolean; cdecl; overload;
    function escreverDados(string_: JString): Boolean; cdecl; overload;
    procedure escreverQrCode(string_: JString); cdecl;
    procedure fechar; cdecl;
    function fnAguardarTerminoImpressao: Integer; cdecl;
    function getParameter(string_: JString): JString; cdecl;
    function getPszTipoComunicacao: JString; cdecl;
    procedure iniciar; cdecl;
    function isConnected: Boolean; cdecl;
    function lerDados(c: TJavaArray<Char>): Boolean; cdecl;
    procedure setContext(context: JContext); cdecl;
    procedure setParameter(string_: JString; string_1: JString); cdecl;
    property originLog: JString read _GetoriginLog write _SetoriginLog;
  end;
  TJAComunicacao = class(TJavaGenericImport<JAComunicacaoClass, JAComunicacao>) end;

  Jexception_DarumaExceptionClass = interface(JRuntimeExceptionClass)
    ['{CBE9ED47-CBDF-4A58-8305-463EDFF488FC}']
    {class} function init(string_: JString): Jexception_DarumaException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/exception/DarumaException')]
  Jexception_DarumaException = interface(JRuntimeException)
    ['{46B5B864-437B-470D-BAF2-5F443A03240A}']
  end;
  TJexception_DarumaException = class(TJavaGenericImport<Jexception_DarumaExceptionClass, Jexception_DarumaException>) end;

  Jexception_DarumaComunicacaoExceptionClass = interface(Jexception_DarumaExceptionClass)
    ['{D4DA6980-36B7-44A5-BD46-C58E8C21C4CF}']
    {class} function init(string_: JString): Jexception_DarumaComunicacaoException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/exception/DarumaComunicacaoException')]
  Jexception_DarumaComunicacaoException = interface(Jexception_DarumaException)
    ['{C45DB7D2-DBDC-4DD0-ADFA-3F9B379B00B3}']
  end;
  TJexception_DarumaComunicacaoException = class(TJavaGenericImport<Jexception_DarumaComunicacaoExceptionClass, Jexception_DarumaComunicacaoException>) end;

  JDarumaECFExceptionClass = interface(Jexception_DarumaExceptionClass)
    ['{751A0943-5BA7-41B1-A5EC-3239995C613D}']
    {class} function init(i: Integer; string_: JString): JDarumaECFException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/exception/DarumaECFException')]
  JDarumaECFException = interface(Jexception_DarumaException)
    ['{4E1E003B-6756-4FA6-A4DC-25ACCCC9060A}']
    function getCode: Integer; cdecl;
  end;
  TJDarumaECFException = class(TJavaGenericImport<JDarumaECFExceptionClass, JDarumaECFException>) end;

  JBluetoothDarumaClass = interface(JAComunicacaoClass)
    ['{AFF91979-B1D3-4520-B935-0DF11A979EC8}']
    {class} function init(context: JContext; map: JMap): JBluetoothDaruma; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/BluetoothDaruma')]
  JBluetoothDaruma = interface(JAComunicacao)
    ['{3B9D1EF9-7644-4423-8AE9-3D9CF846E053}']
    function escreverDados(b: TJavaArray<Byte>): Boolean; cdecl; overload;
    function escreverDados(string_: JString): Boolean; cdecl; overload;
    procedure escreverQrCode(string_: JString); cdecl;
    procedure fechar; cdecl;
    function getParameter(string_: JString): JString; cdecl;
    procedure iniciar; cdecl;
    function isConnected: Boolean; cdecl;
    function lerDados(c: TJavaArray<Char>): Boolean; cdecl;
    procedure setContext(context: JContext); cdecl;
    procedure setParameter(string_: JString; string_1: JString); cdecl;
  end;
  TJBluetoothDaruma = class(TJavaGenericImport<JBluetoothDarumaClass, JBluetoothDaruma>) end;

  JBluetoothDaruma_ReadTaskClass = interface(JRunnableClass)
    ['{5F85BC08-AC17-4840-BD96-4EEFFA2119B6}']
    {class} function init(bluetoothDaruma: JBluetoothDaruma; dataInputStream: JDataInputStream): JBluetoothDaruma_ReadTask; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/BluetoothDaruma$ReadTask')]
  JBluetoothDaruma_ReadTask = interface(JRunnable)
    ['{EC600DFB-91A1-4D29-8740-4A25788480CA}']
    procedure run; cdecl;
  end;
  TJBluetoothDaruma_ReadTask = class(TJavaGenericImport<JBluetoothDaruma_ReadTaskClass, JBluetoothDaruma_ReadTask>) end;

  JComunicacaoNaoImplClass = interface(JAComunicacaoClass)
    ['{9F119A49-172C-4342-995F-7460713CCDCB}']
    {class} function init: JComunicacaoNaoImpl; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/ComunicacaoNaoImpl')]
  JComunicacaoNaoImpl = interface(JAComunicacao)
    ['{0827718E-EC7A-437F-BDA7-7D574B901D94}']
    function escreverDados(b: TJavaArray<Byte>): Boolean; cdecl; overload;
    function escreverDados(string_: JString): Boolean; cdecl; overload;
    procedure escreverQrCode(string_: JString); cdecl;
    procedure fechar; cdecl;
    function getParameter(string_: JString): JString; cdecl;
    procedure iniciar; cdecl;
    function isConnected: Boolean; cdecl;
    function lerDados(c: TJavaArray<Char>): Boolean; cdecl;
    procedure setContext(context: JContext); cdecl;
    procedure setParameter(string_: JString; string_1: JString); cdecl;
  end;
  TJComunicacaoNaoImpl = class(TJavaGenericImport<JComunicacaoNaoImplClass, JComunicacaoNaoImpl>) end;

  JSerialDarumaClass = interface(JAComunicacaoClass)
    ['{2A99DF5C-84BC-4635-BB6B-B5AB5644460F}']
    {class} function init(context: JContext; map: JMap): JSerialDaruma; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/SerialDaruma')]
  JSerialDaruma = interface(JAComunicacao)
    ['{3007ADC5-E53C-4C4E-A8DB-DA3F668BC6E4}']
    function escreverDados(b: TJavaArray<Byte>): Boolean; cdecl; overload;
    function escreverDados(string_: JString): Boolean; cdecl; overload;
    procedure escreverQrCode(string_: JString); cdecl;
    procedure fechar; cdecl;
    function getParameter(string_: JString): JString; cdecl;
    procedure iniciar; cdecl;
    function isConnected: Boolean; cdecl;
    function lerDados(c: TJavaArray<Char>): Boolean; cdecl;
    procedure setContext(context: JContext); cdecl;
    procedure setParameter(string_: JString; string_1: JString); cdecl;
  end;
  TJSerialDaruma = class(TJavaGenericImport<JSerialDarumaClass, JSerialDaruma>) end;

  JSocketDarumaClass = interface(JAComunicacaoClass)
    ['{A85E2B86-D77B-4C70-A966-E59612314294}']
    {class} function init(context: JContext; map: JMap): JSocketDaruma; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/SocketDaruma')]
  JSocketDaruma = interface(JAComunicacao)
    ['{1EA8D5B6-50E2-4A3D-B7FE-6515DE19C544}']
    function escreverDados(b: TJavaArray<Byte>): Boolean; cdecl; overload;
    function escreverDados(string_: JString): Boolean; cdecl; overload;
    procedure escreverQrCode(string_: JString); cdecl;
    procedure fechar; cdecl;
    function getParameter(string_: JString): JString; cdecl;
    procedure iniciar; cdecl;
    function isConnected: Boolean; cdecl;
    function lerDados(c: TJavaArray<Char>): Boolean; cdecl;
    procedure setContext(context: JContext); cdecl;
    procedure setParameter(string_: JString; string_1: JString); cdecl;
  end;
  TJSocketDaruma = class(TJavaGenericImport<JSocketDarumaClass, JSocketDaruma>) end;

  JUsbDarumaClass = interface(JAComunicacaoClass)
    ['{C1E440E2-2816-43A6-8563-ACE51C3AC1E2}']
    {class} function _GetmReadBuffer: TJavaArray<Byte>; cdecl;
    {class} procedure _SetmReadBuffer(Value: TJavaArray<Byte>); cdecl;
    {class} function _GetmWriteBuffer: TJavaArray<Byte>; cdecl;
    {class} procedure _SetmWriteBuffer(Value: TJavaArray<Byte>); cdecl;
    {class} function _GetmWriteBufferLock: JObject; cdecl;
    {class} function init(context: JContext; map: JMap): JUsbDaruma; cdecl;//Deprecated
    {class} property mReadBuffer: TJavaArray<Byte> read _GetmReadBuffer write _SetmReadBuffer;
    {class} property mWriteBuffer: TJavaArray<Byte> read _GetmWriteBuffer write _SetmWriteBuffer;
    {class} property mWriteBufferLock: JObject read _GetmWriteBufferLock;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/UsbDaruma')]
  JUsbDaruma = interface(JAComunicacao)
    ['{C8168435-E6B0-42C6-ACA5-8D03E6F992AD}']
    function escreverDados(b: TJavaArray<Byte>): Boolean; cdecl; overload;
    function escreverDados(string_: JString): Boolean; cdecl; overload;
    procedure escreverQrCode(string_: JString); cdecl;
    procedure fechar; cdecl;
    procedure fnListarDispositivoUSB(usbManager: JUsbManager); cdecl;
    function getParameter(string_: JString): JString; cdecl;
    procedure iniciar; cdecl;
    function isConnected: Boolean; cdecl;
    function lerDados(c: TJavaArray<Char>): Boolean; cdecl;
    procedure setContext(context: JContext); cdecl;
    procedure setParameter(string_: JString; string_1: JString); cdecl;
  end;
  TJUsbDaruma = class(TJavaGenericImport<JUsbDarumaClass, JUsbDaruma>) end;

  JConstantesFrameworkClass = interface(JEnumClass)
    ['{F4F32DF2-2F3E-437E-BFC8-EFF59DAED380}']
    {class} function _GetFECHAMENTO_AUTOMATICO: JConstantesFramework; cdecl;
    {class} function _GetNOME: JConstantesFramework; cdecl;
    {class} function valueOf(string_: JString): JConstantesFramework; cdecl;
    {class} function values: TJavaObjectArray<JConstantesFramework>; cdecl;//Deprecated
    {class} property FECHAMENTO_AUTOMATICO: JConstantesFramework read _GetFECHAMENTO_AUTOMATICO;
    {class} property NOME: JConstantesFramework read _GetNOME;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/constantes/ConstantesFramework')]
  JConstantesFramework = interface(JEnum)
    ['{B3267931-A020-44EF-B6A7-B63CB02C0A8C}']
  end;
  TJConstantesFramework = class(TJavaGenericImport<JConstantesFrameworkClass, JConstantesFramework>) end;

  JConstantesGenericoClass = interface(JEnumClass)
    ['{D1C5D800-D54E-49D8-987D-585FF0FC0BD9}']
    {class} function _GetNOME: JConstantesGenerico; cdecl;
    {class} function valueOf(string_: JString): JConstantesGenerico; cdecl;
    {class} function values: TJavaObjectArray<JConstantesGenerico>; cdecl;
    {class} property NOME: JConstantesGenerico read _GetNOME;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/constantes/ConstantesGenerico')]
  JConstantesGenerico = interface(JEnum)
    ['{8332B6C1-698E-407D-A634-9A930A330DF7}']
    function getTagNome: JIConstantesComunicacao; cdecl;
  end;
  TJConstantesGenerico = class(TJavaGenericImport<JConstantesGenericoClass, JConstantesGenerico>) end;

  JConstantesSocketClass = interface(JEnumClass)
    ['{1173CAE8-5C2F-4741-90CD-7733144BE2DD}']
    {class} function _GetHOST: JConstantesSocket; cdecl;
    {class} function _GetNOME: JConstantesSocket; cdecl;
    {class} function _GetPORT: JConstantesSocket; cdecl;
    {class} function _GetTIMEOUT: JConstantesSocket; cdecl;
    {class} function valueOf(string_: JString): JConstantesSocket; cdecl;
    {class} function values: TJavaObjectArray<JConstantesSocket>; cdecl;//Deprecated
    {class} property HOST: JConstantesSocket read _GetHOST;
    {class} property NOME: JConstantesSocket read _GetNOME;
    {class} property PORT: JConstantesSocket read _GetPORT;
    {class} property TIMEOUT: JConstantesSocket read _GetTIMEOUT;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/constantes/ConstantesSocket')]
  JConstantesSocket = interface(JEnum)
    ['{D759C0C5-3183-4555-827A-6DE5E38936FC}']
    function getTagNome: JIConstantesComunicacao; cdecl;
  end;
  TJConstantesSocket = class(TJavaGenericImport<JConstantesSocketClass, JConstantesSocket>) end;

  JIConstantesComunicacaoClass = interface(IJavaClass)
    ['{481C6821-C872-4890-83C7-507ED4689D9B}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/constantes/IConstantesComunicacao')]
  JIConstantesComunicacao = interface(IJavaInstance)
    ['{BD2EEABC-12AE-4334-BA86-E438B2CE29E8}']
    function getTagNome: JIConstantesComunicacao; cdecl;
  end;
  TJIConstantesComunicacao = class(TJavaGenericImport<JIConstantesComunicacaoClass, JIConstantesComunicacao>) end;

  JDarumaCheckedExceptionClass = interface(JExceptionClass)
    ['{C231A99A-AF65-49DD-B4FD-3D511309EEC2}']
    {class} function init(i: Integer; string_: JString): JDarumaCheckedException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaCheckedException')]
  JDarumaCheckedException = interface(JException)
    ['{F8D12B46-3199-4234-AA23-C51F10CB83ED}']
    function getCode: Integer; cdecl;
  end;
  TJDarumaCheckedException = class(TJavaGenericImport<JDarumaCheckedExceptionClass, JDarumaCheckedException>) end;

  JDarumaExceptionClass = interface(JRuntimeExceptionClass)
    ['{D2D78F0C-EBAF-418B-A74F-3C3E48442238}']
    {class} function init(string_: JString): JDarumaException; cdecl; overload;
    {class} function init(i: Integer; string_: JString): JDarumaException; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaException')]
  JDarumaException = interface(JRuntimeException)
    ['{E4B8874E-A9E6-46F9-B4F5-73E0A53AAB90}']
    function getCode: Integer; cdecl;
  end;
  TJDarumaException = class(TJavaGenericImport<JDarumaExceptionClass, JDarumaException>) end;

  JDarumaComunicacaoExceptionClass = interface(JDarumaExceptionClass)
    ['{19C30AD4-6377-43E2-9592-D5400B5A9DA0}']
    {class} function init(string_: JString): JDarumaComunicacaoException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaComunicacaoException')]
  JDarumaComunicacaoException = interface(JDarumaException)
    ['{A586BC9D-8476-41EC-B426-15EA46961C9E}']
  end;
  TJDarumaComunicacaoException = class(TJavaGenericImport<JDarumaComunicacaoExceptionClass, JDarumaComunicacaoException>) end;

  Jexception_DarumaECFExceptionClass = interface(JDarumaExceptionClass)
    ['{A19D127B-61BE-4500-9326-EA659A131044}']
    {class} function init(i: Integer; string_: JString): Jexception_DarumaECFException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaECFException')]
  Jexception_DarumaECFException = interface(JDarumaException)
    ['{2795B875-50A6-4111-ACD1-FBA9CA5F9FD3}']
    function getCode: Integer; cdecl;
  end;
  TJexception_DarumaECFException = class(TJavaGenericImport<Jexception_DarumaECFExceptionClass, Jexception_DarumaECFException>) end;

  JDarumaSatExceptionClass = interface(JDarumaExceptionClass)
    ['{0A806CFA-4148-45D3-AAFB-0951B1CBEA12}']
    {class} function init(i: Integer; string_: JString): JDarumaSatException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaSatException')]
  JDarumaSatException = interface(JDarumaException)
    ['{BCB26682-E20F-4902-8C6A-13D304C312C9}']
    function getCode: Integer; cdecl;
  end;
  TJDarumaSatException = class(TJavaGenericImport<JDarumaSatExceptionClass, JDarumaSatException>) end;

  JDarumaScanExceptionClass = interface(JDarumaExceptionClass)
    ['{747B43E0-3966-46DD-883D-6E022808AA51}']
    {class} function init(string_: JString): JDarumaScanException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaScanException')]
  JDarumaScanException = interface(JDarumaException)
    ['{A3847C9A-3C8F-41F0-B187-7BA8E88E09B9}']
  end;
  TJDarumaScanException = class(TJavaGenericImport<JDarumaScanExceptionClass, JDarumaScanException>) end;

  JDarumaWebServiceExceptionClass = interface(JDarumaExceptionClass)
    ['{D19AB5D9-AA28-4A6B-B527-BBA5F6F3F8A4}']
    {class} function init(string_: JString): JDarumaWebServiceException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaWebServiceException')]
  JDarumaWebServiceException = interface(JDarumaException)
    ['{7A7FFB6D-9D9C-4DBC-AE6F-F676D88CE9B8}']
  end;
  TJDarumaWebServiceException = class(TJavaGenericImport<JDarumaWebServiceExceptionClass, JDarumaWebServiceException>) end;

  Jgne_UtilsClass = interface(JObjectClass)
    ['{1A62D65C-FB61-48EF-9059-E67BD38B0ED7}']
    {class} function _GetCFE_ESRADO_CANCELAMENTO_ITEM: Integer; cdecl;
    {class} function _GetCFE_ESTADO_ABERTO: Integer; cdecl;
    {class} function _GetCFE_ESTADO_CANCELAMENTO: Integer; cdecl;
    {class} function _GetCFE_ESTADO_CANCELAMENTO_DESC_ACRESC_ITEM: Integer; cdecl;
    {class} function _GetCFE_ESTADO_CANCELAMENTO_OFF: Integer; cdecl;
    {class} function _GetCFE_ESTADO_CANCELAMENTO_PARCIAL_ITEM: Integer; cdecl;
    {class} function _GetCFE_ESTADO_CONF_IMPOSTO: Integer; cdecl;
    {class} function _GetCFE_ESTADO_ENCERRADO: Integer; cdecl;
    {class} function _GetCFE_ESTADO_INATIVO: Integer; cdecl;
    {class} function _GetCFE_ESTADO_LANCAR_DESC_ACRESC_ITEM: Integer; cdecl;
    {class} function _GetCFE_ESTADO_PAGAMENTO: Integer; cdecl;
    {class} function _GetCFE_ESTADO_TOTALIZACAO: Integer; cdecl;
    {class} function _GetCFE_ESTADO_VENDA_ITEM: Integer; cdecl;
    {class} function _GetD_ASTERISCO: JString; cdecl;
    {class} function _GetD_CERQUILHA: JString; cdecl;
    {class} function _GetD_PIPE: JString; cdecl;
    {class} function _GetD_RET_CONT_OFFLINE: Integer; cdecl;
    {class} function _GetD_RET_CONT_ONLINE: Integer; cdecl;
    {class} function _GetD_RET_ERRO: Integer; cdecl;
    {class} function _GetD_RET_ERRO_ABERTURA: Integer; cdecl;
    {class} function _GetD_RET_ERRO_ARQUIVO: Integer; cdecl;
    {class} function _GetD_RET_ERRO_CHAVE_INVALIDA: Integer; cdecl;
    {class} function _GetD_RET_ERRO_CONEXAO: Integer; cdecl;
    {class} function _GetD_RET_ERRO_DESCACRES_APLIC: Integer; cdecl;
    {class} function _GetD_RET_ERRO_DESCACRES_CANC: Integer; cdecl;
    {class} function _GetD_RET_ERRO_DESC_ACRESC: Integer; cdecl;
    {class} function _GetD_RET_ERRO_ENCERRAMENTO: Integer; cdecl;
    {class} function _GetD_RET_ERRO_ESTADO_INVALIDO: Integer; cdecl;
    {class} function _GetD_RET_ERRO_FALHA_SCHEMA: Integer; cdecl;
    {class} function _GetD_RET_ERRO_IDE_TRANSP: Integer; cdecl;
    {class} function _GetD_RET_ERRO_INDICE_NULL: Integer; cdecl;
    {class} function _GetD_RET_ERRO_METODO: Integer; cdecl;
    {class} function _GetD_RET_ERRO_NCFE_JA_ABERTA: Integer; cdecl;
    {class} function _GetD_RET_ERRO_PADRAO_XML: Integer; cdecl;
    {class} function _GetD_RET_ERRO_PAGAMENTO: Integer; cdecl;
    {class} function _GetD_RET_ERRO_QTD_ITEM: Integer; cdecl;
    {class} function _GetD_RET_ERRO_TAG_INVALIDA: Integer; cdecl;
    {class} function _GetD_RET_ERRO_TAG_NAO_INFORMADA: Integer; cdecl;
    {class} function _GetD_RET_ERRO_TAG_OBRIGATORIA: Integer; cdecl;
    {class} function _GetD_RET_ERRO_TAG_SERIE: Integer; cdecl;
    {class} function _GetD_RET_ERRO_TAG_SERIE_CTG: Integer; cdecl;
    {class} function _GetD_RET_ERRO_TIMEOUT_SAT: Integer; cdecl;
    {class} function _GetD_RET_ERRO_TOTALIZACAO: Integer; cdecl;
    {class} function _GetD_RET_ERRO_USER_AUTORIZED: Integer; cdecl;
    {class} function _GetD_RET_ERRO_USER_LICENCE: Integer; cdecl;
    {class} function _GetD_RET_ERRO_VENDA: Integer; cdecl;
    {class} function _GetD_RET_OK: Integer; cdecl;
    {class} function _GetD_RET_PONTEIRO_NULO: Integer; cdecl;
    {class} function _GetGERAR_ABERTURA: Integer; cdecl;
    {class} function _GetGERAR_ENCERRAMENTO: Integer; cdecl;
    {class} function _GetGERAR_PAGAMENTO: Integer; cdecl;
    {class} function _GetGERAR_TOTALIZACAO: Integer; cdecl;
    {class} function _GetGERAR_TRANSPORTE: Integer; cdecl;
    {class} function _GetGERAR_VENDA_ITEM: Integer; cdecl;
    {class} function _GetIMPRESSORA_DARUMA: Integer; cdecl;
    {class} function _GetIMPRESSORA_DARUMA250: Integer; cdecl;
    {class} function _GetIMPRESSORA_DARUMA350: Integer; cdecl;
    {class} function _GetIMPRESSORA_DARUMADR2100: Integer; cdecl;
    {class} function _GetIMPRESSORA_DASCOM: Integer; cdecl;
    {class} function _GetIMPRESSORA_DATEC250: Integer; cdecl;
    {class} function _GetIMPRESSORA_DATEC350: Integer; cdecl;
    {class} function _GetIMPRESSORA_EPSON: Integer; cdecl;
    {class} function _GetIMPRESSORA_M10: Integer; cdecl;
    {class} function _GetIMPRESSORA_NONUS: Integer; cdecl;
    {class} function _GetTIPO_NFCE: Integer; cdecl;
    {class} function _GetTIPO_NFSE: Integer; cdecl;
    {class} function _GetTIPO_SAT: Integer; cdecl;
    {class} function _GetbConfiguracaoCombistivel: Boolean; cdecl;
    {class} procedure _SetbConfiguracaoCombistivel(Value: Boolean); cdecl;
    {class} function _GetbConfiguradoImpostoMetodoEspecificoCOFINS: Boolean; cdecl;
    {class} procedure _SetbConfiguradoImpostoMetodoEspecificoCOFINS(Value: Boolean); cdecl;
    {class} function _GetbConfiguradoImpostoMetodoEspecificoICMS: Boolean; cdecl;
    {class} procedure _SetbConfiguradoImpostoMetodoEspecificoICMS(Value: Boolean); cdecl;
    {class} function _GetbConfiguradoImpostoMetodoEspecificoPIS: Boolean; cdecl;
    {class} procedure _SetbConfiguradoImpostoMetodoEspecificoPIS(Value: Boolean); cdecl;
    {class} function _GetbImpostoCOFINS: Boolean; cdecl;
    {class} procedure _SetbImpostoCOFINS(Value: Boolean); cdecl;
    {class} function _GetbImpostoICMS: Boolean; cdecl;
    {class} procedure _SetbImpostoICMS(Value: Boolean); cdecl;
    {class} function _GetbImpostoPIS: Boolean; cdecl;
    {class} procedure _SetbImpostoPIS(Value: Boolean); cdecl;
    {class} function _GetbLeiImposto: Boolean; cdecl;
    {class} procedure _SetbLeiImposto(Value: Boolean); cdecl;
    {class} function _GetbLerGNE: Boolean; cdecl;
    {class} procedure _SetbLerGNE(Value: Boolean); cdecl;
    {class} function _GetcontadorItens: Integer; cdecl;
    {class} procedure _SetcontadorItens(Value: Integer); cdecl;
    {class} function _Geterro: Integer; cdecl;
    {class} procedure _Seterro(Value: Integer); cdecl;
    {class} function _Getescolha_cofins: JString; cdecl;
    {class} procedure _Setescolha_cofins(Value: JString); cdecl;
    {class} function _Getescolha_icms: JString; cdecl;
    {class} procedure _Setescolha_icms(Value: JString); cdecl;
    {class} function _Getescolha_iss: JString; cdecl;
    {class} procedure _Setescolha_iss(Value: JString); cdecl;
    {class} function _Getescolha_pis: JString; cdecl;
    {class} procedure _Setescolha_pis(Value: JString); cdecl;
    {class} function _GetindicesInfoEst: TJavaObjectArray<JString>; cdecl;
    {class} procedure _SetindicesInfoEst(Value: TJavaObjectArray<JString>); cdecl;
    {class} function _GetindicesInfoEstSAT: TJavaObjectArray<JString>; cdecl;
    {class} procedure _SetindicesInfoEstSAT(Value: TJavaObjectArray<JString>); cdecl;
    {class} function _GetpszConfiguracaoCombustivel: JString; cdecl;
    {class} procedure _SetpszConfiguracaoCombustivel(Value: JString); cdecl;
    {class} function _GetpszGuardaValorpICMS: JString; cdecl;
    {class} procedure _SetpszGuardaValorpICMS(Value: JString); cdecl;
    {class} function _GetpszImpostoCOFINS: JString; cdecl;
    {class} procedure _SetpszImpostoCOFINS(Value: JString); cdecl;
    {class} function _GetpszImpostoICMS: JString; cdecl;
    {class} procedure _SetpszImpostoICMS(Value: JString); cdecl;
    {class} function _GetpszImpostoPIS: JString; cdecl;
    {class} procedure _SetpszImpostoPIS(Value: JString); cdecl;
    {class} function _GetpszLeiImposto: JString; cdecl;
    {class} procedure _SetpszLeiImposto(Value: JString); cdecl;
    {class} function _GetpszRetornoSAT: JString; cdecl;
    {class} procedure _SetpszRetornoSAT(Value: JString); cdecl;
    {class} function _GetpszTipoDescAcres: JString; cdecl;
    {class} procedure _SetpszTipoDescAcres(Value: JString); cdecl;
    {class} function _GetpszValorImpostoMemoria: JString; cdecl;
    {class} procedure _SetpszValorImpostoMemoria(Value: JString); cdecl;
    {class} function _GetretWS: TJavaObjectArray<JString>; cdecl;
    {class} procedure _SetretWS(Value: TJavaObjectArray<JString>); cdecl;
    {class} function _GettextoPersistencia: JString; cdecl;
    {class} procedure _SettextoPersistencia(Value: JString); cdecl;
    {class} function _GettotalInfoEst: Double; cdecl;
    {class} procedure _SettotalInfoEst(Value: Double); cdecl;
    {class} function _GetvalorPago: Double; cdecl;
    {class} procedure _SetvalorPago(Value: Double); cdecl;
    {class} function _GetvaloresConfCombustivel: JArrayList; cdecl;
    {class} function ImprimeCodBarras(string_: JString; string_1: JString; string_2: JString; string_3: JString): JString; cdecl;
    {class} function RegAlterarValor(string_: JString; string_1: JString; i: Integer; context: JContext): Integer; cdecl; overload;
    {class} function RegAlterarValor(string_: JString; string_1: JString; i: Integer; b: Boolean; context: JContext): Integer; cdecl; overload;
    {class} function RegPersistirXML(context: JContext): Integer; cdecl;
    {class} procedure apagarArquivo(string_: JString; context: JContext); cdecl;
    {class} function arredondarTruncar(d: Double; i: Integer; context: JContext): Double; cdecl;
    {class} function converterMarcaImpressora(string_: JString): JString; cdecl;
    {class} function converterMarcaSAT(string_: JString): JString; cdecl;
    {class} function criptografarTag(string_: JString): JString; cdecl;
    {class} function descriptografarTag(string_: JString): JString; cdecl;
    {class} procedure escreveRestante(i: Integer; i1: Integer; string_: JString; stringBuffer: JStringBuffer); cdecl;
    {class} procedure escrever(string_: JString; stringBuffer: JStringBuffer; i: Integer; context: JContext); cdecl;
    {class} procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer; i: Integer); cdecl;
    {class} procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer; i: Integer; i1: Integer); cdecl;
    {class} function fnAlterarValorTagXML(string_: JString; string_1: JString; string_2: JString): JString; cdecl;
    {class} procedure fnApagarLocalArquivo(string_: JString; context: JContext); cdecl;
    {class} procedure fnCharToChar(c: TJavaArray<Char>; c1: TJavaArray<Char>); cdecl;
    {class} function fnCharToString(c: TJavaArray<Char>): JString; cdecl;
    {class} function fnGerarQrCode(string_: JString; string_1: JString; i: Integer; i1: Integer; context: JContext): JBitmap; cdecl;
    {class} function fnGravarLocalArquivo(string_: JString; string_1: JString; string_2: JString; string_3: JString; i: Integer; context: JContext): Integer; cdecl;
    {class} function fnLerArquivoIBPTAX(string_: JString; context: JContext): JString; cdecl;
    {class} function fnLerArquivoTexto(string_: JString; context: JContext): JString; cdecl;
    {class} function fnLerLocalArquivo(string_: JString; string_1: JString; i: Integer; context: JContext): JString; cdecl;
    {class} function fnLerLocalArquivoRetornaFile(string_: JString; string_1: JString; i: Integer; context: JContext): JFile; cdecl;
    {class} procedure fnProcuraImpostoGNE_COFINS(nFCe: JNFCe; context: JContext); cdecl;
    {class} procedure fnProcuraImpostoGNE_COFINSST(nFCe: JNFCe; context: JContext); cdecl;
    {class} procedure fnProcuraImpostoGNE_ICMS(nFCe: JNFCe; string_: JString; context: JContext); cdecl;
    {class} procedure fnProcuraImpostoGNE_ISS(nFCe: JNFCe; string_: JString; context: JContext); cdecl;
    {class} procedure fnProcuraImpostoGNE_PIS(nFCe: JNFCe; context: JContext); cdecl;
    {class} procedure fnProcuraImpostoGNE_PISST(nFCe: JNFCe; context: JContext); cdecl;
    {class} function fnRetiraCaracteresEspeciais(string_: JString): JString; cdecl;
    {class} function fnRetornarValorTagXML(string_: JString; string_1: JString): JString; cdecl;
    {class} function fnStatusImpressora(string_: JString; context: JContext): JString; cdecl;
    {class} procedure fnStringToChar(string_: JString; c: TJavaArray<Char>); cdecl;
    {class} function fnTratarCaracteresEspeciais(string_: JString; i: Integer): JString; cdecl;
    {class} function fnTratarStringCaminhoNomeArquivo(string_: JString): TJavaObjectArray<JString>; cdecl;
    {class} function fnVerificarPathArquivoXML(string_: JString; i: Integer; context: JContext): JString; cdecl;
    {class} procedure gerarArquivo(string_: JString; string_1: JString; context: JContext); cdecl;
    {class} procedure gerarArquivoSAT(string_: JString; string_1: JString; context: JContext); cdecl;
    {class} procedure gerarPdf(string_: JString; string_1: JString; context: JContext); cdecl; overload;
    {class} procedure gerarPdf(string_: JString; string_1: JString; string_2: JString; i: Integer; context: JContext); cdecl; overload;
    {class} function gravarArquivoXml(string_: JString; document: Jjdom2_Document; context: JContext): JString; cdecl; overload;
    {class} function gravarArquivoXml(element: Jjdom2_Element; string_: JString; context: JContext): JString; cdecl; overload;
    {class} function identificaTags(string_: JString): JHashMap; cdecl;
    {class} function identificaTagsReg(string_: JString): JHashMap; cdecl;
    {class} function indicesPagamento(string_: JString): Integer; cdecl; overload;
    {class} function init: Jgne_Utils; cdecl;//Deprecated
    {class} function lerArquivoBytes(string_: JString; context: JContext): TJavaArray<Byte>; cdecl;
    {class} function lerArquivosMesmaExt(string_: JString; arrayList: JArrayList; context: JContext): TJavaObjectArray<JString>; cdecl;
    {class} function maiorMenorByte(string_: JString): TJavaArray<Char>; cdecl;
    {class} function maiorMenorByteDR2100(string_: JString): TJavaArray<Char>; cdecl;
    {class} function montaQrCode(string_: JString; string_1: JString; string_2: JString): JString; cdecl;
    {class} function pesquisarValor(string_: JString; i: Integer; context: JContext): JString; cdecl;
    {class} function procurarTagPersistencia(string_: JString; string_1: TJavaObjectArray<JString>): JString; cdecl;
    {class} function retirarAcentuacao(string_: JString): JString; cdecl;
    {class} function retornarValorTag(string_: JString; c: TJavaArray<Char>; i: Integer; context: JContext): Integer; cdecl;
    {class} procedure sendEmail(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString); cdecl;
    {class} function tratarDigValue(string_: JString): JString; cdecl;
    {class} procedure verificaArqErro(string_: JString; context: JContext); cdecl;
    {class} function verificaInicio(string_: JString; string_1: JString; stringBuffer: JStringBuffer; i: Integer): Integer; cdecl;
    {class} property CFE_ESRADO_CANCELAMENTO_ITEM: Integer read _GetCFE_ESRADO_CANCELAMENTO_ITEM;
    {class} property CFE_ESTADO_ABERTO: Integer read _GetCFE_ESTADO_ABERTO;
    {class} property CFE_ESTADO_CANCELAMENTO: Integer read _GetCFE_ESTADO_CANCELAMENTO;
    {class} property CFE_ESTADO_CANCELAMENTO_DESC_ACRESC_ITEM: Integer read _GetCFE_ESTADO_CANCELAMENTO_DESC_ACRESC_ITEM;
    {class} property CFE_ESTADO_CANCELAMENTO_OFF: Integer read _GetCFE_ESTADO_CANCELAMENTO_OFF;
    {class} property CFE_ESTADO_CANCELAMENTO_PARCIAL_ITEM: Integer read _GetCFE_ESTADO_CANCELAMENTO_PARCIAL_ITEM;
    {class} property CFE_ESTADO_CONF_IMPOSTO: Integer read _GetCFE_ESTADO_CONF_IMPOSTO;
    {class} property CFE_ESTADO_ENCERRADO: Integer read _GetCFE_ESTADO_ENCERRADO;
    {class} property CFE_ESTADO_INATIVO: Integer read _GetCFE_ESTADO_INATIVO;
    {class} property CFE_ESTADO_LANCAR_DESC_ACRESC_ITEM: Integer read _GetCFE_ESTADO_LANCAR_DESC_ACRESC_ITEM;
    {class} property CFE_ESTADO_PAGAMENTO: Integer read _GetCFE_ESTADO_PAGAMENTO;
    {class} property CFE_ESTADO_TOTALIZACAO: Integer read _GetCFE_ESTADO_TOTALIZACAO;
    {class} property CFE_ESTADO_VENDA_ITEM: Integer read _GetCFE_ESTADO_VENDA_ITEM;
    {class} property D_ASTERISCO: JString read _GetD_ASTERISCO;
    {class} property D_CERQUILHA: JString read _GetD_CERQUILHA;
    {class} property D_PIPE: JString read _GetD_PIPE;
    {class} property D_RET_CONT_OFFLINE: Integer read _GetD_RET_CONT_OFFLINE;
    {class} property D_RET_CONT_ONLINE: Integer read _GetD_RET_CONT_ONLINE;
    {class} property D_RET_ERRO: Integer read _GetD_RET_ERRO;
    {class} property D_RET_ERRO_ABERTURA: Integer read _GetD_RET_ERRO_ABERTURA;
    {class} property D_RET_ERRO_ARQUIVO: Integer read _GetD_RET_ERRO_ARQUIVO;
    {class} property D_RET_ERRO_CHAVE_INVALIDA: Integer read _GetD_RET_ERRO_CHAVE_INVALIDA;
    {class} property D_RET_ERRO_CONEXAO: Integer read _GetD_RET_ERRO_CONEXAO;
    {class} property D_RET_ERRO_DESCACRES_APLIC: Integer read _GetD_RET_ERRO_DESCACRES_APLIC;
    {class} property D_RET_ERRO_DESCACRES_CANC: Integer read _GetD_RET_ERRO_DESCACRES_CANC;
    {class} property D_RET_ERRO_DESC_ACRESC: Integer read _GetD_RET_ERRO_DESC_ACRESC;
    {class} property D_RET_ERRO_ENCERRAMENTO: Integer read _GetD_RET_ERRO_ENCERRAMENTO;
    {class} property D_RET_ERRO_ESTADO_INVALIDO: Integer read _GetD_RET_ERRO_ESTADO_INVALIDO;
    {class} property D_RET_ERRO_FALHA_SCHEMA: Integer read _GetD_RET_ERRO_FALHA_SCHEMA;
    {class} property D_RET_ERRO_IDE_TRANSP: Integer read _GetD_RET_ERRO_IDE_TRANSP;
    {class} property D_RET_ERRO_INDICE_NULL: Integer read _GetD_RET_ERRO_INDICE_NULL;
    {class} property D_RET_ERRO_METODO: Integer read _GetD_RET_ERRO_METODO;
    {class} property D_RET_ERRO_NCFE_JA_ABERTA: Integer read _GetD_RET_ERRO_NCFE_JA_ABERTA;
    {class} property D_RET_ERRO_PADRAO_XML: Integer read _GetD_RET_ERRO_PADRAO_XML;
    {class} property D_RET_ERRO_PAGAMENTO: Integer read _GetD_RET_ERRO_PAGAMENTO;
    {class} property D_RET_ERRO_QTD_ITEM: Integer read _GetD_RET_ERRO_QTD_ITEM;
    {class} property D_RET_ERRO_TAG_INVALIDA: Integer read _GetD_RET_ERRO_TAG_INVALIDA;
    {class} property D_RET_ERRO_TAG_NAO_INFORMADA: Integer read _GetD_RET_ERRO_TAG_NAO_INFORMADA;
    {class} property D_RET_ERRO_TAG_OBRIGATORIA: Integer read _GetD_RET_ERRO_TAG_OBRIGATORIA;
    {class} property D_RET_ERRO_TAG_SERIE: Integer read _GetD_RET_ERRO_TAG_SERIE;
    {class} property D_RET_ERRO_TAG_SERIE_CTG: Integer read _GetD_RET_ERRO_TAG_SERIE_CTG;
    {class} property D_RET_ERRO_TIMEOUT_SAT: Integer read _GetD_RET_ERRO_TIMEOUT_SAT;
    {class} property D_RET_ERRO_TOTALIZACAO: Integer read _GetD_RET_ERRO_TOTALIZACAO;
    {class} property D_RET_ERRO_USER_AUTORIZED: Integer read _GetD_RET_ERRO_USER_AUTORIZED;
    {class} property D_RET_ERRO_USER_LICENCE: Integer read _GetD_RET_ERRO_USER_LICENCE;
    {class} property D_RET_ERRO_VENDA: Integer read _GetD_RET_ERRO_VENDA;
    {class} property D_RET_OK: Integer read _GetD_RET_OK;
    {class} property D_RET_PONTEIRO_NULO: Integer read _GetD_RET_PONTEIRO_NULO;
    {class} property GERAR_ABERTURA: Integer read _GetGERAR_ABERTURA;
    {class} property GERAR_ENCERRAMENTO: Integer read _GetGERAR_ENCERRAMENTO;
    {class} property GERAR_PAGAMENTO: Integer read _GetGERAR_PAGAMENTO;
    {class} property GERAR_TOTALIZACAO: Integer read _GetGERAR_TOTALIZACAO;
    {class} property GERAR_TRANSPORTE: Integer read _GetGERAR_TRANSPORTE;
    {class} property GERAR_VENDA_ITEM: Integer read _GetGERAR_VENDA_ITEM;
    {class} property IMPRESSORA_DARUMA: Integer read _GetIMPRESSORA_DARUMA;
    {class} property IMPRESSORA_DARUMA250: Integer read _GetIMPRESSORA_DARUMA250;
    {class} property IMPRESSORA_DARUMA350: Integer read _GetIMPRESSORA_DARUMA350;
    {class} property IMPRESSORA_DARUMADR2100: Integer read _GetIMPRESSORA_DARUMADR2100;
    {class} property IMPRESSORA_DASCOM: Integer read _GetIMPRESSORA_DASCOM;
    {class} property IMPRESSORA_DATEC250: Integer read _GetIMPRESSORA_DATEC250;
    {class} property IMPRESSORA_DATEC350: Integer read _GetIMPRESSORA_DATEC350;
    {class} property IMPRESSORA_EPSON: Integer read _GetIMPRESSORA_EPSON;
    {class} property IMPRESSORA_M10: Integer read _GetIMPRESSORA_M10;
    {class} property IMPRESSORA_NONUS: Integer read _GetIMPRESSORA_NONUS;
    {class} property TIPO_NFCE: Integer read _GetTIPO_NFCE;
    {class} property TIPO_NFSE: Integer read _GetTIPO_NFSE;
    {class} property TIPO_SAT: Integer read _GetTIPO_SAT;
    {class} property bConfiguracaoCombistivel: Boolean read _GetbConfiguracaoCombistivel write _SetbConfiguracaoCombistivel;
    {class} property bConfiguradoImpostoMetodoEspecificoCOFINS: Boolean read _GetbConfiguradoImpostoMetodoEspecificoCOFINS write _SetbConfiguradoImpostoMetodoEspecificoCOFINS;
    {class} property bConfiguradoImpostoMetodoEspecificoICMS: Boolean read _GetbConfiguradoImpostoMetodoEspecificoICMS write _SetbConfiguradoImpostoMetodoEspecificoICMS;
    {class} property bConfiguradoImpostoMetodoEspecificoPIS: Boolean read _GetbConfiguradoImpostoMetodoEspecificoPIS write _SetbConfiguradoImpostoMetodoEspecificoPIS;
    {class} property bImpostoCOFINS: Boolean read _GetbImpostoCOFINS write _SetbImpostoCOFINS;
    {class} property bImpostoICMS: Boolean read _GetbImpostoICMS write _SetbImpostoICMS;
    {class} property bImpostoPIS: Boolean read _GetbImpostoPIS write _SetbImpostoPIS;
    {class} property bLeiImposto: Boolean read _GetbLeiImposto write _SetbLeiImposto;
    {class} property bLerGNE: Boolean read _GetbLerGNE write _SetbLerGNE;
    {class} property contadorItens: Integer read _GetcontadorItens write _SetcontadorItens;
    {class} property erro: Integer read _Geterro write _Seterro;
    {class} property escolha_cofins: JString read _Getescolha_cofins write _Setescolha_cofins;
    {class} property escolha_icms: JString read _Getescolha_icms write _Setescolha_icms;
    {class} property escolha_iss: JString read _Getescolha_iss write _Setescolha_iss;
    {class} property escolha_pis: JString read _Getescolha_pis write _Setescolha_pis;
    {class} property indicesInfoEst: TJavaObjectArray<JString> read _GetindicesInfoEst write _SetindicesInfoEst;
    {class} property indicesInfoEstSAT: TJavaObjectArray<JString> read _GetindicesInfoEstSAT write _SetindicesInfoEstSAT;
    {class} property pszConfiguracaoCombustivel: JString read _GetpszConfiguracaoCombustivel write _SetpszConfiguracaoCombustivel;
    {class} property pszGuardaValorpICMS: JString read _GetpszGuardaValorpICMS write _SetpszGuardaValorpICMS;
    {class} property pszImpostoCOFINS: JString read _GetpszImpostoCOFINS write _SetpszImpostoCOFINS;
    {class} property pszImpostoICMS: JString read _GetpszImpostoICMS write _SetpszImpostoICMS;
    {class} property pszImpostoPIS: JString read _GetpszImpostoPIS write _SetpszImpostoPIS;
    {class} property pszLeiImposto: JString read _GetpszLeiImposto write _SetpszLeiImposto;
    {class} property pszRetornoSAT: JString read _GetpszRetornoSAT write _SetpszRetornoSAT;
    {class} property pszTipoDescAcres: JString read _GetpszTipoDescAcres write _SetpszTipoDescAcres;
    {class} property pszValorImpostoMemoria: JString read _GetpszValorImpostoMemoria write _SetpszValorImpostoMemoria;
    {class} property retWS: TJavaObjectArray<JString> read _GetretWS write _SetretWS;
    {class} property textoPersistencia: JString read _GettextoPersistencia write _SettextoPersistencia;
    {class} property totalInfoEst: Double read _GettotalInfoEst write _SettotalInfoEst;
    {class} property valorPago: Double read _GetvalorPago write _SetvalorPago;
    {class} property valoresConfCombustivel: JArrayList read _GetvaloresConfCombustivel;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/Utils')]
  Jgne_Utils = interface(JObject)
    ['{E2DF2993-FBC5-4F8B-B27C-ACC101F65F07}']
    function XmlBase64ParaUtf_Completo(string_: JString; context: JContext): TJavaObjectArray<JString>; cdecl;
    function fnRetornarMetaparametro(string_: JString; string_1: JString): JString; cdecl;
    function fnTratarSeparadorDecimais(string_: JString): JString; cdecl;
    procedure gerarArquivoBytes(b: TJavaArray<Byte>; string_: JString; context: JContext); cdecl;
    function gerarMD5(string_: JString; string_1: JString): JString; cdecl;
    function gerarXmlInfo(context: JContext; i: Integer; i1: Integer; i2: Integer; i3: Integer; context1: JContext): JString; cdecl;
    procedure gravarArquivoTXTXml(string_: JString; string_1: JString; b: Boolean; context: JContext); cdecl;
    procedure lerPersistenciaPorLinha(arrayList: JArrayList; context: JContext); cdecl;
    procedure preencherInfoRetSAT(context: JContext); cdecl;
    procedure preencherInfoRetWS(string_: JString; i: Integer; i1: Integer; context: JContext); cdecl;
    function separarXmlRet64(string_: JString; context: JContext): TJavaObjectArray<JString>; cdecl;
    function xmlBase64ParaUTF(string_: JString; context: JContext): JHashMap; cdecl;
  end;
  TJgne_Utils = class(TJavaGenericImport<Jgne_UtilsClass, Jgne_Utils>) end;

  JBMPClass = interface(Jgne_UtilsClass)
    ['{E5E9C1E8-6333-4787-AD0F-33668FAF1413}']
    {class} function init: JBMP; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/BMP')]
  JBMP = interface(Jgne_Utils)
    ['{222CA17D-F1E6-444A-9193-F1CB5A89FF69}']
    function fnCarregarLogoBMP(string_: JString; b: TJavaArray<Byte>): Integer; cdecl;
    function fnGerarQrcodeBMP(string_: JString): JBitmap; cdecl;
    function getBitsImageData(bitmap: JBitmap): JBitSet; cdecl;
  end;
  TJBMP = class(TJavaGenericImport<JBMPClass, JBMP>) end;

  JOp_XmlConsultaClass = interface(JObjectClass)
    ['{66110847-A9BA-4416-BA84-82FFC4764326}']
    {class} function init: JOp_XmlConsulta; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/Op_XmlConsulta')]
  JOp_XmlConsulta = interface(JObject)
    ['{9CD4EA54-426E-4D30-B83B-56BF17293359}']
    function gerarXmlConsulta(context: JContext): JString; cdecl;
    function preencherXmlConsultaNFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; context: JContext): JString; cdecl;
  end;
  TJOp_XmlConsulta = class(TJavaGenericImport<JOp_XmlConsultaClass, JOp_XmlConsulta>) end;

  JPersistenciaClass = interface(Jgne_UtilsClass)
    ['{4D61810C-5938-41E7-9877-AB8F10E2D338}']
    {class} function init: JPersistencia; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/Persistencia')]
  JPersistencia = interface(Jgne_Utils)
    ['{FE8AC5CA-D91D-4BFB-B55D-AFB7CB1D9592}']
    procedure fnApagaArquivoPersistencia; cdecl;
    function fnPersistenciaMemoria(string_: JString): Integer; cdecl;
    function fnValidarParametro(string_: TJavaObjectArray<JString>; string_1: TJavaObjectArray<JString>; i: TJavaArray<Integer>; i1: TJavaArray<Integer>): JString; cdecl;
    function fnVerificaCargaPersistencia: Integer; cdecl;
    function fnVerificaPersistenciaMemoria: Integer; cdecl;
    function fnZerarPersistenciaMemoria: Integer; cdecl;
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure processar(string_: TJavaObjectArray<JString>; string_1: TJavaObjectArray<JString>; i: Integer; i1: TJavaArray<Integer>; i2: TJavaArray<Integer>; context: JContext); cdecl;
    function validarParametros(string_: TJavaObjectArray<JString>; string_1: TJavaObjectArray<JString>; i: TJavaArray<Integer>; i1: TJavaArray<Integer>): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
    procedure verificarlerPersistencia(i: Integer; context: JContext); cdecl;
  end;
  TJPersistencia = class(TJavaGenericImport<JPersistenciaClass, JPersistencia>) end;

  JPersistenciaAuxiliarClass = interface(Jgne_UtilsClass)
    ['{27420616-F1B5-4F72-9653-0228C8F5CDB0}']
    {class} function init: JPersistenciaAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/PersistenciaAuxiliar')]
  JPersistenciaAuxiliar = interface(Jgne_Utils)
    ['{83712C32-E584-479A-BA6A-8FBDF49344DF}']
    function fnAlterarLinhaPersistencia(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function fnAlterarValorPersistencia(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function fnApagaArquivoPersistencia: Integer; cdecl;
    function fnAtualizarPersistencia(context: JContext): Integer; cdecl;
    function fnGerarPersistencia(string_: TJavaObjectArray<JString>; i: Integer; context: JContext): Integer; cdecl;
    function fnGravarPersistencia(string_: JString; string_1: JString; context: JContext): Integer; cdecl;
    function fnLerPersistencia: Integer; cdecl;
    function fnRemoverLinhaPersistencia(string_: JString; string_1: JString): Integer; cdecl;
    function fnRemoverValorPersistencia(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function fnRetornarLinhaPersistencia(string_: JString; string_1: JString): JString; cdecl;
    function fnRetornarValorPersistencia(string_: JString; string_1: JString; string_2: JString): JString; cdecl;
    function fnVerificarPersistencia(context: JContext): Integer; cdecl;
    function fnVerificarPersistenciaMemoria: Integer; cdecl;
    function fnZerarPersistenciaMemoria: Integer; cdecl;
  end;
  TJPersistenciaAuxiliar = class(TJavaGenericImport<JPersistenciaAuxiliarClass, JPersistenciaAuxiliar>) end;

  JProcessosClass = interface(Jgne_UtilsClass)
    ['{1F6FF011-E417-42EA-8183-4FFD0005D5D6}']
    {class} function init: JProcessos; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/Processos')]
  JProcessos = interface(Jgne_Utils)
    ['{D1F407B4-14FC-40C2-9313-1E28CCF214EE}']
    procedure cancelar(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure gerarDescAcrescItem(string_: JString; string_1: JString; string_2: JString; context: JContext); cdecl;
    function separarValorTag(string_: JString; string_1: JString): JString; cdecl;
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJProcessos = class(TJavaGenericImport<JProcessosClass, JProcessos>) end;

  JTagsClass = interface(Jgne_UtilsClass)
    ['{4F3FF80E-08AC-464D-9297-C60341C722DA}']
    {class} function init: JTags; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/Tags')]
  JTags = interface(Jgne_Utils)
    ['{38C5997A-95F4-49F8-BA92-16676AB8E913}']
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
  end;
  TJTags = class(TJavaGenericImport<JTagsClass, JTags>) end;

  JFormatacaoClass = interface(JObjectClass)
    ['{0021A369-A94E-45E5-AE15-F7337D11A2D0}']
    {class} function _GetcentDesliga: JString; cdecl;
    {class} function _GetcentLiga: JString; cdecl;
    {class} function _GetexpandidoDesl: JString; cdecl;
    {class} function _Getjustificado: JString; cdecl;
    {class} function _GetlogoDesliga: JString; cdecl;
    {class} function _GetlogoLiga: JString; cdecl;
    {class} function _GetnegritoDesliga: JString; cdecl;
    {class} function _GetnegritoLiga: JString; cdecl;
    {class} function _Getstatus: JString; cdecl;
    {class} function _GetsublinhadoDesl: JString; cdecl;
    {class} function init: JFormatacao; cdecl;//Deprecated
    {class} property centDesliga: JString read _GetcentDesliga;
    {class} property centLiga: JString read _GetcentLiga;
    {class} property expandidoDesl: JString read _GetexpandidoDesl;
    {class} property justificado: JString read _Getjustificado;
    {class} property logoDesliga: JString read _GetlogoDesliga;
    {class} property logoLiga: JString read _GetlogoLiga;
    {class} property negritoDesliga: JString read _GetnegritoDesliga;
    {class} property negritoLiga: JString read _GetnegritoLiga;
    {class} property status: JString read _Getstatus;
    {class} property sublinhadoDesl: JString read _GetsublinhadoDesl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Formatacao')]
  JFormatacao = interface(JObject)
    ['{458C9B16-5DE5-4E40-9536-E4E54CADBDBF}']
    function _GetcondDesl: JString; cdecl;
    procedure _SetcondDesl(Value: JString); cdecl;
    function _GetcondLiga: JString; cdecl;
    procedure _SetcondLiga(Value: JString); cdecl;
    function _GetexpandidoLiga: JString; cdecl;
    procedure _SetexpandidoLiga(Value: JString); cdecl;
    function _Getreiniciar: JString; cdecl;
    procedure _Setreiniciar(Value: JString); cdecl;
    function _GetsublinhadoLiga: JString; cdecl;
    procedure _SetsublinhadoLiga(Value: JString); cdecl;
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    property condDesl: JString read _GetcondDesl write _SetcondDesl;
    property condLiga: JString read _GetcondLiga write _SetcondLiga;
    property expandidoLiga: JString read _GetexpandidoLiga write _SetexpandidoLiga;
    property reiniciar: JString read _Getreiniciar write _Setreiniciar;
    property sublinhadoLiga: JString read _GetsublinhadoLiga write _SetsublinhadoLiga;
  end;
  TJFormatacao = class(TJavaGenericImport<JFormatacaoClass, JFormatacao>) end;

  JDarumaClass = interface(JFormatacaoClass)
    ['{F5F12326-F6C5-491E-9E5A-548E53934D7A}']
    {class} function init(context: JContext): JDaruma; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Daruma')]
  JDaruma = interface(JFormatacao)
    ['{407A8CB1-6456-4F2F-BAC0-41FEA8EF9366}']
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
  end;
  TJDaruma = class(TJavaGenericImport<JDarumaClass, JDaruma>) end;

  JDaruma_2100Class = interface(JFormatacaoClass)
    ['{4E17DE40-C7C0-4831-B7F1-6E581D2E4945}']
    {class} function init(context: JContext): JDaruma_2100; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Daruma_2100')]
  JDaruma_2100 = interface(JFormatacao)
    ['{5DFA10D7-A8A8-4E2E-B58C-9DC497B294BA}']
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarCodBarras(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
  end;
  TJDaruma_2100 = class(TJavaGenericImport<JDaruma_2100Class, JDaruma_2100>) end;

  JDaruma_250Class = interface(JFormatacaoClass)
    ['{474A3772-042E-4510-A81A-23BD94854FBB}']
    {class} function init(context: JContext): JDaruma_250; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Daruma_250')]
  JDaruma_250 = interface(JFormatacao)
    ['{9A39D2D8-550C-4AE5-9B28-9271E1A19080}']
    function _GetpszTexto: JString; cdecl;
    procedure _SetpszTexto(Value: JString); cdecl;
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function getCentralizado: Boolean; cdecl;
    function getTexto: JString; cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure setCentralizado(b: Boolean); cdecl;
    procedure setTexto(string_: JString); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    property pszTexto: JString read _GetpszTexto write _SetpszTexto;
  end;
  TJDaruma_250 = class(TJavaGenericImport<JDaruma_250Class, JDaruma_250>) end;

  JDaruma_350Class = interface(JFormatacaoClass)
    ['{DEDE54FB-A658-494D-ACF5-F6C938278E3B}']
    {class} function init(context: JContext): JDaruma_350; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Daruma_350')]
  JDaruma_350 = interface(JFormatacao)
    ['{0AE5759E-7A78-4E89-B16B-6181052F3B69}']
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
  end;
  TJDaruma_350 = class(TJavaGenericImport<JDaruma_350Class, JDaruma_350>) end;

  JDascomClass = interface(JFormatacaoClass)
    ['{075526E0-B512-4E91-85DE-821815B325BD}']
    {class} function init(context: JContext): JDascom; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Dascom')]
  JDascom = interface(JFormatacao)
    ['{D4A76497-4862-4150-9D8C-F0C0B5EE3E31}']
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
  end;
  TJDascom = class(TJavaGenericImport<JDascomClass, JDascom>) end;

  JDatec_250Class = interface(JFormatacaoClass)
    ['{FC1B5546-B004-49FB-9E87-BC873C72385F}']
    {class} function init(context: JContext): JDatec_250; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Datec_250')]
  JDatec_250 = interface(JFormatacao)
    ['{C6F67DA2-A633-40DF-9DD1-A1266CFEC74C}']
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
  end;
  TJDatec_250 = class(TJavaGenericImport<JDatec_250Class, JDatec_250>) end;

  JDatec_350Class = interface(JFormatacaoClass)
    ['{CCAEC981-64FE-438D-B1CD-4DACFFDBB8C4}']
    {class} function init(context: JContext): JDatec_350; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Datec_350')]
  JDatec_350 = interface(JFormatacao)
    ['{48894B1A-4472-45C7-BE7B-5EEC56E5F02C}']
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
  end;
  TJDatec_350 = class(TJavaGenericImport<JDatec_350Class, JDatec_350>) end;

  JEPSONClass = interface(JFormatacaoClass)
    ['{747EDE50-1B2E-4B46-AF67-60B1AF713682}']
    {class} function init(context: JContext): JEPSON; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/EPSON')]
  JEPSON = interface(JFormatacao)
    ['{C0481813-D303-4341-8E6A-6B8754C40866}']
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarCodBarras(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
  end;
  TJEPSON = class(TJavaGenericImport<JEPSONClass, JEPSON>) end;

  JFormatacaoAsciiClass = interface(JFormatacaoClass)
    ['{839B5BA0-2F93-41F8-A80F-E9006CD88299}']
    {class} function init(context: JContext): JFormatacaoAscii; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/FormatacaoAscii')]
  JFormatacaoAscii = interface(JFormatacao)
    ['{B269F69C-97C8-4809-BD28-F1FD51D18147}']
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
  end;
  TJFormatacaoAscii = class(TJavaGenericImport<JFormatacaoAsciiClass, JFormatacaoAscii>) end;

  JM10Class = interface(JFormatacaoClass)
    ['{B4ABCEAA-9BAE-4D1A-9137-AF21695D0AC1}']
    {class} function init(context: JContext): JM10; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/M10')]
  JM10 = interface(JFormatacao)
    ['{A490B13F-2841-4C86-B2D0-6C2425CA7E24}']
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarCodBarras(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
  end;
  TJM10 = class(TJavaGenericImport<JM10Class, JM10>) end;

  JNonusClass = interface(JFormatacaoClass)
    ['{148BB5D4-1D19-4AA2-A3FB-E645689CD256}']
    {class} function init(context: JContext): JNonus; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Nonus')]
  JNonus = interface(JFormatacao)
    ['{5C3FF201-6CBC-41F3-A204-EB26927832EB}']
    procedure centralizar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure condensado(stringBuffer: JStringBuffer; b: Boolean; b1: Boolean); cdecl;
    procedure escreverPadrao(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure escreverVenda(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure expandido(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure gerarQrCode(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function identificaStatus(string_: JString): JHashMap; cdecl;
    procedure justificar(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure linhaDivisoria(stringBuffer: JStringBuffer); cdecl;
    procedure logotipo(stringBuffer: JStringBuffer; b: Boolean); cdecl;
    procedure negrito(stringBuffer: JStringBuffer; string_: JString; b: Boolean); cdecl;
    procedure reiniciarParam(stringBuffer: JStringBuffer); cdecl;
    procedure sublinhado(stringBuffer: JStringBuffer; b: Boolean); cdecl;
  end;
  TJNonus = class(TJavaGenericImport<JNonusClass, JNonus>) end;

  JAberturaNfceClass = interface(JPersistenciaClass)
    ['{21436651-D008-4246-93FC-318C178D0743}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/AberturaNfce')]
  JAberturaNfce = interface(JPersistencia)
    ['{4404ECC3-E3EA-4C39-9CCF-38EF5A63C3FE}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJAberturaNfce = class(TJavaGenericImport<JAberturaNfceClass, JAberturaNfce>) end;

  JAcrescimoClass = interface(JProcessosClass)
    ['{E66C715B-89FC-401B-89A9-E93C9ABA1166}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Acrescimo')]
  JAcrescimo = interface(JProcessos)
    ['{35DF0D40-4A1F-4BEE-9685-38127B8C9E2A}']
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJAcrescimo = class(TJavaGenericImport<JAcrescimoClass, JAcrescimo>) end;

  JConfiguraCofinsAliqClass = interface(JPersistenciaClass)
    ['{CCD6D0DA-7806-4605-8C1A-DDC361217149}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCofinsAliq')]
  JConfiguraCofinsAliq = interface(JPersistencia)
    ['{90783079-9A9D-492E-82EC-16A7A38DCB30}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCofinsAliq = class(TJavaGenericImport<JConfiguraCofinsAliqClass, JConfiguraCofinsAliq>) end;

  JConfiguraCofinsNTClass = interface(JPersistenciaClass)
    ['{BB19B841-253D-4469-8DB5-6B2C05AB799F}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCofinsNT')]
  JConfiguraCofinsNT = interface(JPersistencia)
    ['{B3681C38-1E77-4EEE-A4B2-9FE9630D3205}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCofinsNT = class(TJavaGenericImport<JConfiguraCofinsNTClass, JConfiguraCofinsNT>) end;

  JConfiguraCofinsOutrClass = interface(JPersistenciaClass)
    ['{C2D4D06F-8E44-43B6-B4C0-329F1015D7B8}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCofinsOutr')]
  JConfiguraCofinsOutr = interface(JPersistencia)
    ['{174B8E21-6067-4B6B-AA4D-05E60D22A3AE}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCofinsOutr = class(TJavaGenericImport<JConfiguraCofinsOutrClass, JConfiguraCofinsOutr>) end;

  JConfiguraCofinsQtdeClass = interface(JPersistenciaClass)
    ['{C89BFF7A-497C-4E5A-8B28-9E19E1EA1917}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCofinsQtde')]
  JConfiguraCofinsQtde = interface(JPersistencia)
    ['{786FC7DF-E7E1-4164-B636-A51FD9AB5EE1}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCofinsQtde = class(TJavaGenericImport<JConfiguraCofinsQtdeClass, JConfiguraCofinsQtde>) end;

  JConfiguraCofinsSnClass = interface(JPersistenciaClass)
    ['{73396C01-879B-442F-B3AD-F466B2B33A0F}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCofinsSn')]
  JConfiguraCofinsSn = interface(JPersistencia)
    ['{6D5A46BF-D824-4093-8ED4-CEC2FD19CF8E}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCofinsSn = class(TJavaGenericImport<JConfiguraCofinsSnClass, JConfiguraCofinsSn>) end;

  JConfiguraCombustivelClass = interface(JPersistenciaClass)
    ['{B5596F5A-242C-42CC-8F38-EF4231EE0A5D}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCombustivel')]
  JConfiguraCombustivel = interface(JPersistencia)
    ['{9D51D1B0-318D-4DB3-AFB7-783FD48AEB70}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCombustivel = class(TJavaGenericImport<JConfiguraCombustivelClass, JConfiguraCombustivel>) end;

  JConfiguraICMS00Class = interface(JPersistenciaClass)
    ['{6959B9F9-A882-49A7-B309-1BE52CD62F34}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS00')]
  JConfiguraICMS00 = interface(JPersistencia)
    ['{70303C6D-B776-4422-B4CA-302EA0D37399}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS00 = class(TJavaGenericImport<JConfiguraICMS00Class, JConfiguraICMS00>) end;

  JConfiguraICMS10Class = interface(JPersistenciaClass)
    ['{88376C66-8D9F-49CC-8535-DDA67910E6B0}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS10')]
  JConfiguraICMS10 = interface(JPersistencia)
    ['{F35E0091-F7D3-4E9D-A6C7-8B8320CCC71B}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS10 = class(TJavaGenericImport<JConfiguraICMS10Class, JConfiguraICMS10>) end;

  JConfiguraICMS20Class = interface(JPersistenciaClass)
    ['{5CD8CC37-3A3E-4C45-A4F5-BA7329AFF887}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS20')]
  JConfiguraICMS20 = interface(JPersistencia)
    ['{C934D810-2447-4CD6-B022-7734C62309B5}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS20 = class(TJavaGenericImport<JConfiguraICMS20Class, JConfiguraICMS20>) end;

  JConfiguraICMS30Class = interface(JPersistenciaClass)
    ['{2CD7957B-7CC9-4748-B2FE-AEF786F51BB3}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS30')]
  JConfiguraICMS30 = interface(JPersistencia)
    ['{1B31F60C-FFA5-4484-96B8-295BF8CDF9A2}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS30 = class(TJavaGenericImport<JConfiguraICMS30Class, JConfiguraICMS30>) end;

  JConfiguraICMS40Class = interface(JPersistenciaClass)
    ['{EFA49CF5-46D4-44F5-9FE6-A17062C4BEEF}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS40')]
  JConfiguraICMS40 = interface(JPersistencia)
    ['{F4F27182-2135-4FC6-A2AF-C2DAC0D2461C}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS40 = class(TJavaGenericImport<JConfiguraICMS40Class, JConfiguraICMS40>) end;

  JConfiguraICMS51Class = interface(JPersistenciaClass)
    ['{27556B87-4762-4017-A0DC-D9C4A78A2F09}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS51')]
  JConfiguraICMS51 = interface(JPersistencia)
    ['{1712F1C9-1A2E-45E4-B170-E256F282D434}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS51 = class(TJavaGenericImport<JConfiguraICMS51Class, JConfiguraICMS51>) end;

  JConfiguraICMS60Class = interface(JPersistenciaClass)
    ['{3568174F-62C3-489C-9EE3-1573D482B6D3}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS60')]
  JConfiguraICMS60 = interface(JPersistencia)
    ['{9849365F-DEC1-440C-AB98-81CE3EFE6125}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS60 = class(TJavaGenericImport<JConfiguraICMS60Class, JConfiguraICMS60>) end;

  JConfiguraICMS70Class = interface(JPersistenciaClass)
    ['{9826E53F-8B2C-4B0C-AF26-9E86CA25C35E}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS70')]
  JConfiguraICMS70 = interface(JPersistencia)
    ['{B80A58D2-9661-4910-9FD8-F4FF22362427}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS70 = class(TJavaGenericImport<JConfiguraICMS70Class, JConfiguraICMS70>) end;

  JConfiguraICMS90Class = interface(JPersistenciaClass)
    ['{A838F04A-E29A-4A52-92F9-2AE3D27C75DA}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS90')]
  JConfiguraICMS90 = interface(JPersistencia)
    ['{6826BBF3-486E-47E7-A242-B96539E6AEC0}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS90 = class(TJavaGenericImport<JConfiguraICMS90Class, JConfiguraICMS90>) end;

  JConfiguraICMSPartClass = interface(JPersistenciaClass)
    ['{3C9B4256-DF9B-48C0-AF65-DB2509DD4F80}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSPart')]
  JConfiguraICMSPart = interface(JPersistencia)
    ['{EC862A03-98BE-4A35-AAB7-4F66E2B1C54E}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSPart = class(TJavaGenericImport<JConfiguraICMSPartClass, JConfiguraICMSPart>) end;

  JConfiguraICMSSN101Class = interface(JPersistenciaClass)
    ['{09352875-E591-4BC2-A7A0-C4FF48AD8A67}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN101')]
  JConfiguraICMSSN101 = interface(JPersistencia)
    ['{6AAE791A-9CF4-401F-A0A0-B772D15E7731}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN101 = class(TJavaGenericImport<JConfiguraICMSSN101Class, JConfiguraICMSSN101>) end;

  JConfiguraICMSSN102Class = interface(JPersistenciaClass)
    ['{5D352176-E00B-4001-869A-FBE73EE6379E}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN102')]
  JConfiguraICMSSN102 = interface(JPersistencia)
    ['{A79DFD0E-CB0C-4FD3-96A9-AEAA7E48629A}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN102 = class(TJavaGenericImport<JConfiguraICMSSN102Class, JConfiguraICMSSN102>) end;

  JConfiguraICMSSN201Class = interface(JPersistenciaClass)
    ['{D9DCA8E4-6910-457E-A5DE-D856BEE57665}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN201')]
  JConfiguraICMSSN201 = interface(JPersistencia)
    ['{BBDF323B-650C-4284-A625-C23D817EFD14}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN201 = class(TJavaGenericImport<JConfiguraICMSSN201Class, JConfiguraICMSSN201>) end;

  JConfiguraICMSSN202Class = interface(JPersistenciaClass)
    ['{F747181F-AD0A-43E7-A2C8-CD0F1C6656FA}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN202')]
  JConfiguraICMSSN202 = interface(JPersistencia)
    ['{FA13C7CC-0E61-4921-A48C-85968E2464B1}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN202 = class(TJavaGenericImport<JConfiguraICMSSN202Class, JConfiguraICMSSN202>) end;

  JConfiguraICMSSN500Class = interface(JPersistenciaClass)
    ['{C7E96ADE-985E-4E05-99A3-31EEE9C7D1A7}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN500')]
  JConfiguraICMSSN500 = interface(JPersistencia)
    ['{0507E7CB-16B2-4D83-908C-F252722F3198}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN500 = class(TJavaGenericImport<JConfiguraICMSSN500Class, JConfiguraICMSSN500>) end;

  JConfiguraICMSSN900Class = interface(JPersistenciaClass)
    ['{F689F2BD-7128-4DD0-BC05-4655F994B5FA}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN900')]
  JConfiguraICMSSN900 = interface(JPersistencia)
    ['{167C9DF3-38C1-4487-ABC8-A98682D24D6A}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN900 = class(TJavaGenericImport<JConfiguraICMSSN900Class, JConfiguraICMSSN900>) end;

  JConfiguraICMSSTClass = interface(JPersistenciaClass)
    ['{40B00F19-3062-498E-B5FD-3CB85CB4018D}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSST')]
  JConfiguraICMSST = interface(JPersistencia)
    ['{F95F750C-9DA8-4A64-99D6-BEF508D71E94}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSST = class(TJavaGenericImport<JConfiguraICMSSTClass, JConfiguraICMSST>) end;

  JConfiguraLeiImpostoClass = interface(JPersistenciaClass)
    ['{93B6FC86-6529-4CDB-A976-F35E2A779BAC}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraLeiImposto')]
  JConfiguraLeiImposto = interface(JPersistencia)
    ['{15F0E523-FF11-4A5A-8609-CF0C1A14D527}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraLeiImposto = class(TJavaGenericImport<JConfiguraLeiImpostoClass, JConfiguraLeiImposto>) end;

  JConfiguraPisAliqClass = interface(JPersistenciaClass)
    ['{509ED743-7D31-4E23-B511-A95437855F86}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraPisAliq')]
  JConfiguraPisAliq = interface(JPersistencia)
    ['{5480589C-7D63-475F-89CD-94B5B1E07F4C}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraPisAliq = class(TJavaGenericImport<JConfiguraPisAliqClass, JConfiguraPisAliq>) end;

  JConfiguraPisNTClass = interface(JPersistenciaClass)
    ['{42E377DE-432F-441A-A66C-045FFD5025CF}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraPisNT')]
  JConfiguraPisNT = interface(JPersistencia)
    ['{1041DB40-0529-45FF-9885-42BE1F34D2B7}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraPisNT = class(TJavaGenericImport<JConfiguraPisNTClass, JConfiguraPisNT>) end;

  JConfiguraPisOutrClass = interface(JPersistenciaClass)
    ['{B4F4ADD4-296D-463D-8B46-436BB7120584}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraPisOutr')]
  JConfiguraPisOutr = interface(JPersistencia)
    ['{40CD10EF-EEB7-4178-BE9F-289E2A5D62F9}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraPisOutr = class(TJavaGenericImport<JConfiguraPisOutrClass, JConfiguraPisOutr>) end;

  JConfiguraPisQtdeClass = interface(JPersistenciaClass)
    ['{914E69FD-15CA-4F75-BA06-892CF12E0BCF}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraPisQtde')]
  JConfiguraPisQtde = interface(JPersistencia)
    ['{9319DC48-87F7-4986-A675-64C0D37CD90B}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraPisQtde = class(TJavaGenericImport<JConfiguraPisQtdeClass, JConfiguraPisQtde>) end;

  JConfiguraPisSnClass = interface(JPersistenciaClass)
    ['{C06C79D7-FC4C-49DB-99E4-7B713C310928}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraPisSn')]
  JConfiguraPisSn = interface(JPersistencia)
    ['{47FF29D3-B717-474A-B2EA-5D541598C88D}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraPisSn = class(TJavaGenericImport<JConfiguraPisSnClass, JConfiguraPisSn>) end;

  JDescontosClass = interface(JProcessosClass)
    ['{714F32AF-BA70-4CDE-A738-44FB8A5956FB}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Descontos')]
  JDescontos = interface(JProcessos)
    ['{A2FADAA5-B161-43B6-BED3-2F823A037FAA}']
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJDescontos = class(TJavaGenericImport<JDescontosClass, JDescontos>) end;

  JEncerramentoClass = interface(JPersistenciaClass)
    ['{73C2CFF6-E981-499E-A729-0FB193AAF43E}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Encerramento')]
  JEncerramento = interface(JPersistencia)
    ['{DB0291A0-2011-4D93-B913-BA0449C28522}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJEncerramento = class(TJavaGenericImport<JEncerramentoClass, JEncerramento>) end;

  JIdentificarConsumidorClass = interface(JProcessosClass)
    ['{186481D2-06F3-4666-BBE0-30D63CE07705}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/IdentificarConsumidor')]
  JIdentificarConsumidor = interface(JProcessos)
    ['{2CDEF0FC-CCB5-4DC9-90FE-CBA2980E0F3F}']
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJIdentificarConsumidor = class(TJavaGenericImport<JIdentificarConsumidorClass, JIdentificarConsumidor>) end;

  Jnfce_ItemClass = interface(JProcessosClass)
    ['{B5EBDDB7-819A-4BF3-BDB7-C987AA1846E0}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Item')]
  Jnfce_Item = interface(JProcessos)
    ['{C0C21922-4470-4676-9299-77742D1B56C6}']
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJnfce_Item = class(TJavaGenericImport<Jnfce_ItemClass, Jnfce_Item>) end;

  JOp_XmlRetornoClass = interface(Jgne_UtilsClass)
    ['{489218BE-6D5C-48A4-B041-EF60FDA6F5B8}']
    {class} function _GetlistaPag: JArrayList; cdecl;
    {class} function _GetlistaVendas: JArrayList; cdecl;
    {class} function _GetretDest: JArrayList; cdecl;
    {class} function _GetretDet: JArrayList; cdecl;
    {class} function _GetretEnderDest: JArrayList; cdecl;
    {class} function _GetretIde: JArrayList; cdecl;
    {class} function _GetretInfNFeSupl: JArrayList; cdecl;
    {class} function _GetretPag: JArrayList; cdecl;
    {class} function _GetretTroco: JArrayList; cdecl;
    {class} procedure armazenarDigestValueEChave(string_: JString; string_1: JString; context: JContext); cdecl;
    {class} function init: JOp_XmlRetorno; cdecl;//Deprecated
    {class} property listaPag: JArrayList read _GetlistaPag;
    {class} property listaVendas: JArrayList read _GetlistaVendas;
    {class} property retDest: JArrayList read _GetretDest;
    {class} property retDet: JArrayList read _GetretDet;
    {class} property retEnderDest: JArrayList read _GetretEnderDest;
    {class} property retIde: JArrayList read _GetretIde;
    {class} property retInfNFeSupl: JArrayList read _GetretInfNFeSupl;
    {class} property retPag: JArrayList read _GetretPag;
    {class} property retTroco: JArrayList read _GetretTroco;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Op_XmlRetorno')]
  JOp_XmlRetorno = interface(Jgne_Utils)
    ['{E19CA2F4-9BA6-43AF-850E-624F820AEDCE}']
    procedure lerXMlVendaDaruma(string_: JString; string_1: JString; context: JContext); cdecl;
    function preencherInfoRetWS(string_: JString; context: JContext): Integer; cdecl;
  end;
  TJOp_XmlRetorno = class(TJavaGenericImport<JOp_XmlRetornoClass, JOp_XmlRetorno>) end;

  Jnfce_LayoutClass = interface(JOp_XmlRetornoClass)
    ['{C076B44A-2002-4137-BD71-D4F5072E76A6}']
    {class} function init: Jnfce_Layout; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Layout')]
  Jnfce_Layout = interface(JOp_XmlRetorno)
    ['{61552A37-E31A-4031-8859-BA8DF359AA90}']
    function _Getformat: JFormatacao; cdecl;
    procedure _Setformat(Value: JFormatacao); cdecl;
    function fnGerarLayoutCancelamentoNFCe(stringBuffer: JStringBuffer; string_: JString; string_1: JString; string_2: JString; string_3: JString; b: Boolean; context: JContext): Integer; cdecl;
    function fnGerarLayoutCancelamentoNFCePDF(stringBuffer: JStringBuffer; string_: JString; string_1: JString; string_2: JString; string_3: JString; b: Boolean; context: JContext): Integer; cdecl;
    function fnGerarLayoutNFCe(stringBuffer: JStringBuffer; hashMap: JHashMap; i: Integer; b: Boolean; context: JContext): Integer; cdecl;
    function fnGerarLayoutNFCePDF(stringBuffer: JStringBuffer; hashMap: JHashMap; i: Integer; b: Boolean; context: JContext): Integer; cdecl;
    function inicializaProcesso(string_: JString; context: JContext): JFormatacao; cdecl; overload;
    function inicializaProcesso(string_: JString; string_1: JString; string_2: JString; string_3: JString; context: JContext): Integer; cdecl; overload;
    property format: JFormatacao read _Getformat write _Setformat;
  end;
  TJnfce_Layout = class(TJavaGenericImport<Jnfce_LayoutClass, Jnfce_Layout>) end;

  JNFCeClass = interface(Jgne_UtilsClass)
    ['{C3F5ABEA-7EBE-40CA-AC4C-5CDABD1BA433}']
    {class} function _GetlistCOFINSvBC: JArrayList; cdecl;
    {class} function _GetlistISSQNvBC: JArrayList; cdecl;
    {class} function _GetlistPISvBC: JArrayList; cdecl;
    {class} function _GetobjPersistenciaAuxiliar: JPersistenciaAuxiliar; cdecl;
    {class} function _Getobjlay: Jnfce_Layout; cdecl;
    {class} function _GetxmlAuxi: JOp_XmlAuxiliar; cdecl;
    {class} procedure _SetxmlAuxi(Value: JOp_XmlAuxiliar); cdecl;
    {class} function _GetxmlContingencia: JOp_XmlContingencia; cdecl;
    {class} function fnDescriptografarContOff(b: TJavaArray<Byte>; string_: JString): JString; cdecl;
    {class} function fnTrataRetornoNFCe(string_: JString): Integer; cdecl;
    {class} function init(context: JContext): JNFCe; cdecl;
    {class} function retInfoNcm(string_: TJavaObjectArray<JString>): JHashMap; cdecl; overload;
    {class} function retInfoNcm(string_: JString; string_1: TJavaObjectBiArray<JString>; string_2: TJavaObjectArray<JString>): JHashMap; cdecl; overload;
    {class} property listCOFINSvBC: JArrayList read _GetlistCOFINSvBC;
    {class} property listISSQNvBC: JArrayList read _GetlistISSQNvBC;
    {class} property listPISvBC: JArrayList read _GetlistPISvBC;
    {class} property objPersistenciaAuxiliar: JPersistenciaAuxiliar read _GetobjPersistenciaAuxiliar;
    {class} property objlay: Jnfce_Layout read _Getobjlay;
    {class} property xmlAuxi: JOp_XmlAuxiliar read _GetxmlAuxi write _SetxmlAuxi;
    {class} property xmlContingencia: JOp_XmlContingencia read _GetxmlContingencia;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/NFCe')]
  JNFCe = interface(Jgne_Utils)
    ['{021838DE-056C-45B2-B652-F9C8161DAA9A}']
    function _GetbEnvioContingenciaOffline: Boolean; cdecl;
    procedure _SetbEnvioContingenciaOffline(Value: Boolean); cdecl;
    procedure GerarXmlAuxiliar; cdecl;
    function atualizarXML(string_: JString; string_1: JString): JString; cdecl;
    function cancelarNFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; stringBuffer: JStringBuffer; string_4: JString; b: Boolean): Integer; cdecl;
    function consultaInfoRetorno(string_: JString; string_1: JString; b: Boolean): TJavaArray<Char>; cdecl;
    function consultaNFCe_ReImprimir(string_: JString; string_1: JString; string_2: JString): JString; cdecl;
    function contingenciaCanc(string_: JString): JString; cdecl;
    function fnAbrirNFCePersistencia(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnAbrirNumSeriePersistencia(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnAtualizarSerieNNF(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function fnAvisoErro(stringBuilder: JStringBuilder; stringBuilder1: JStringBuilder): Integer; cdecl;
    function fnCancelarDescAcresItemPersistencia(string_: JString; string_1: JString): Integer; cdecl;
    function fnCancelarItemNFCePersistencia(string_: JString): Integer; cdecl;
    function fnCancelarItemParcialNFCePersistencia(string_: JString; string_1: JString): Integer; cdecl;
    function fnConfCombustivel(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfImposto(string_: JString; string_1: JString): Integer; cdecl;
    function fnConfLeiImposto(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfRastro(string_: JString): Integer; cdecl;
    function fnConfigCofinsAliq(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigCofinsNT(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigCofinsOutr(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigCofinsQtde(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigCofinssn(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigCofinsst(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcms00(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcms10(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcms20(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcms30(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcms40(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcms51(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcms60(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcms70(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcms90(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcmsPart(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcmsSN101(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcmsSN102(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcmsSN201(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcmsSN202(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcmsSN500(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcmsSN900(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIcmsST(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigIssqn(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigPisAliq(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigPisNT(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigPisOutr(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigPisQtde(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigPissn(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConfigPisst(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnConsultarContingencia(string_: JString; string_1: JString; string_2: JString): JString; cdecl;
    procedure fnCriptografarContOff(string_: JString; string_1: JString; string_2: JString); cdecl;
    function fnEncerrarNFCeConfigMsgPersistencia(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnEncerrarNFCePersistencia(string_: JString): Integer; cdecl;
    function fnEnviarEmail(string_: JString): Integer; cdecl;
    function fnEstornarPagamentoNFCePersistencia(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function fnGerarCancelamento(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString): JString; cdecl;
    function fnGerarCancelamentoContingencia(string_: JString; string_1: JString; string_2: JString; string_3: JString): JString; cdecl;
    function fnGerarConsulta(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; i: Integer): JString; cdecl;
    function fnGerarDescarte(string_: JString; string_1: JString): JString; cdecl;
    function fnGerarDescarteSubstituicao(string_: JString; string_1: JString): JString; cdecl;
    function fnGerarInutilizacao(string_: JString; string_1: JString; string_2: JString; string_3: JString): JString; cdecl;
    function fnGerarQRCodeNT(string_: JString): JString; cdecl;
    function fnGerarQRCodeNT2(string_: JString): JString; cdecl;
    function fnGerarXMLCancelamento(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; b: Boolean): JString; cdecl;
    function fnGerarXMLEnvio(i: Integer): JString; cdecl;
    function fnIdentificarConsumidorNFCePersistencia(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnIdentificarTranspNFCePersistencia(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnIniciarContingencia(b: Boolean): JString; cdecl;
    function fnLancarDescAcresItemNFCePersistencia(string_: JString; string_1: JString; string_2: JString): Integer; cdecl;
    function fnLerXmlVenda(string_: JString): Integer; cdecl;
    function fnMensagemPromocional(string_: JString; string_1: JString): Integer; cdecl;
    function fnPagarCartaoNFCePersistencia(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnPagarNFCePersistencia(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnPreencherInfoEstendida: Integer; cdecl;
    function fnRetornarDescarteSubstituicao: JString; cdecl;
    function fnRetornarEstadoNFCe: Integer; cdecl;
    function fnRetornarInfoEstendida(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    function fnRetornarInformacao(string_: JString; string_1: JString): JString; cdecl;
    function fnSeparaInformacaoCancelamento(string_: JString; string_1: JString; i: Integer; c: TJavaArray<Char>; c1: TJavaArray<Char>; c2: TJavaArray<Char>; c3: TJavaArray<Char>; c4: TJavaArray<Char>; c5: TJavaArray<Char>): Integer; cdecl;
    function fnSepararInfoContingenciaUnit(string_: JString; c: TJavaArray<Char>; c1: TJavaArray<Char>; c2: TJavaArray<Char>; c3: TJavaArray<Char>; c4: TJavaArray<Char>; c5: TJavaArray<Char>): Integer; cdecl;
    function fnStatusImpressora(string_: JString; string_1: JString): Integer; cdecl;
    function fnTotalizarNFCePersistencia(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnTotalizarSATPersistencia(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function fnTratarTabelaNCM: TJavaObjectBiArray<JString>; cdecl;
    function fnUrlQrCode(c: TJavaArray<Char>): Integer; cdecl;
    function fnValidarParamentrosImpressao(string_: JString; string_1: JString; string_2: JString; i: Integer; string_3: JString; i1: Integer; string_4: JString): JString; cdecl;
    function fnVenderCompletoNFCePersistencia(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString): Integer; cdecl;
    function fnVerificarRetornoContingencia(string_: JString; string_1: JString; string_2: JString; i: Integer): Integer; cdecl; overload;
    function fnVerificarRetornoContingencia(i: Integer; i1: Integer; string_: TJavaObjectArray<JString>; string_1: TJavaObjectArray<JString>; stringBuffer: JStringBuffer): Integer; cdecl; overload;
    function fnVerificarSeries(string_: JString; string_1: JString): Integer; cdecl;
    function geraLayoutTef(string_: JString; i: Integer): JString; cdecl;
    function gerarArquivoFormatadoCancNFCe(string_: JString; string_1: JString; stringBuffer: JStringBuffer; string_2: JString; b: Boolean): Integer; cdecl;
    function gerarArquivoFormatadoPDF_Nfce(string_: JString; string_1: JString; stringBuffer: JStringBuffer): JString; cdecl;
    procedure gerarArquivoFormatado_Nfce(string_: JString; string_1: JString; stringBuffer: JStringBuffer; string_2: JString; string_3: JString; i: Integer); cdecl;
    function gerarQRCodeNFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString): JString; cdecl;
    function procuraDescripto(string_: JString): TJavaObjectArray<JString>; cdecl; overload;
    function procuraDescripto(i: Integer; string_: JString): JArrayList; cdecl; overload;
    procedure retornaConfHora(string_: JString; c: TJavaArray<Char>); cdecl;
    function separarCod(i: Integer; string_: JString): JString; cdecl;
    function separarCodCont(i: Integer; string_: JString): JString; cdecl;
    procedure separarInfoCont(string_: JString; string_1: JString; i: Integer; c: TJavaArray<Char>; c1: TJavaArray<Char>; c2: TJavaArray<Char>; c3: TJavaArray<Char>; c4: TJavaArray<Char>; c5: TJavaArray<Char>); cdecl;
    function statusImp(string_: JString): JString; cdecl;
    function trataLayoutNonus(string_: JString): TJavaObjectArray<JString>; cdecl;
    function verificaCodigo(i: Integer; string_: JString): Integer; cdecl;
    property bEnvioContingenciaOffline: Boolean read _GetbEnvioContingenciaOffline write _SetbEnvioContingenciaOffline;
  end;
  TJNFCe = class(TJavaGenericImport<JNFCeClass, JNFCe>) end;

  JPagamentoClass = interface(JProcessosClass)
    ['{CCFF4771-0600-459E-93BC-D8B3BF73672F}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Pagamento')]
  JPagamento = interface(JProcessos)
    ['{F372EFEF-E850-46E5-B875-9C02AF2890C1}']
    procedure estornarPagamento(string_: JString; string_1: JString; string_2: JString; context: JContext); cdecl;
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJPagamento = class(TJavaGenericImport<JPagamentoClass, JPagamento>) end;

  JPagarClass = interface(JPersistenciaClass)
    ['{2921C057-7ACB-45C7-B6FB-EBE4A03F7FC0}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Pagar')]
  JPagar = interface(JPersistencia)
    ['{F5388067-4D81-4A10-9C3B-1D0DBA7659FD}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJPagar = class(TJavaGenericImport<JPagarClass, JPagar>) end;

  JPagarComCartaoClass = interface(JPersistenciaClass)
    ['{5C7D60C6-9681-4AAF-A4BC-D14C365AC980}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/PagarComCartao')]
  JPagarComCartao = interface(JPersistencia)
    ['{ED34EABD-D877-4E00-824B-D904F6E99257}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJPagarComCartao = class(TJavaGenericImport<JPagarComCartaoClass, JPagarComCartao>) end;

  JTiposNFCeClass = interface(JObjectClass)
    ['{B9B7D439-7C63-497F-B0A9-B4AEDD187205}']
    {class} function init: JTiposNFCe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/TiposNFCe')]
  JTiposNFCe = interface(JObject)
    ['{91804050-A4E4-490B-8FA9-F89B43CA9F2E}']
  end;
  TJTiposNFCe = class(TJavaGenericImport<JTiposNFCeClass, JTiposNFCe>) end;

  JTotalizacaoClass = interface(JPersistenciaClass)
    ['{7C1104C2-CB8B-4D69-A076-D6407F2F57E9}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Totalizacao')]
  JTotalizacao = interface(JPersistencia)
    ['{5F3D2E98-EFDE-4177-9F76-7C3340403022}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJTotalizacao = class(TJavaGenericImport<JTotalizacaoClass, JTotalizacao>) end;

  JTransportadoraClass = interface(JPersistenciaClass)
    ['{B3E7BE06-0B99-4113-BDB2-B171F1AFC86C}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Transportadora')]
  JTransportadora = interface(JPersistencia)
    ['{C8ED7E20-A643-4926-A0B9-956B881B416D}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJTransportadora = class(TJavaGenericImport<JTransportadoraClass, JTransportadora>) end;

  JVendeItemClass = interface(JPersistenciaClass)
    ['{A9C2DB54-9318-487F-9B92-701E1BF5B2CF}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/VendeItem')]
  JVendeItem = interface(JPersistencia)
    ['{8FEE9523-D81B-45F2-BB1E-80828215D71A}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJVendeItem = class(TJavaGenericImport<JVendeItemClass, JVendeItem>) end;

  JVendeItemCompletoClass = interface(JPersistenciaClass)
    ['{B49F0B2B-C5DA-45EE-9724-1501D071E1A1}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/VendeItemCompleto')]
  JVendeItemCompleto = interface(JPersistencia)
    ['{9C3C262D-5B0B-4E9B-A3C8-090E37450134}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJVendeItemCompleto = class(TJavaGenericImport<JVendeItemCompletoClass, JVendeItemCompleto>) end;

  JObjetosClass = interface(JObjectClass)
    ['{C21F5E7E-0731-488F-A6C2-A496B8BC3C77}']
    {class} function _Getgs: JElementosXmlAuxiliar; cdecl;
    {class} function _Getgs_canc: JElementosXmlCancelamento; cdecl;
    {class} function _Getgs_cont: JElementosXMLContingencia; cdecl;
    {class} function _Getgs_inut: JElementosXMlInutilizacao; cdecl;
    {class} function _Geto_00: JIcms00Auxiliar; cdecl;
    {class} function _Geto_10: JIcms10Auxiliar; cdecl;
    {class} function _Geto_101: JIcmsSn101Auxiliar; cdecl;
    {class} function _Geto_102: JIcmsSn102Auxiliar; cdecl;
    {class} function _Geto_20: JIcms20Auxiliar; cdecl;
    {class} function _Geto_201: JIcmsSn201Auxiliar; cdecl;
    {class} function _Geto_202: JIcmsSn202Auxiliar; cdecl;
    {class} function _Geto_30: JIcms30Auxiliar; cdecl;
    {class} function _Geto_40: JIcms40Auxiliar; cdecl;
    {class} function _Geto_500: JIcmsSn500Auxiliar; cdecl;
    {class} function _Geto_51: JIcms51Auxiliar; cdecl;
    {class} function _Geto_60: JIcms60Auxiliar; cdecl;
    {class} function _Geto_70: JIcms70Auxiliar; cdecl;
    {class} function _Geto_90: JIcms90Auxiliar; cdecl;
    {class} function _Geto_900: JIcmsSn900Auxiliar; cdecl;
    {class} function _Geto_ac: JAC; cdecl;
    {class} function _Geto_al: JAL; cdecl;
    {class} function _Geto_aliq: JPisAliqAuxiliar; cdecl;
    {class} function _Geto_ap: JAP; cdecl;
    {class} function _Geto_avisoServ: JAux_XmlAvisoServ; cdecl;
    {class} function _Geto_ba: JBA; cdecl;
    {class} function _Geto_caliq: JCofinsAliqAuxiliar; cdecl;
    {class} function _Geto_ce: JCE; cdecl;
    {class} function _Geto_cide: JCideAuxiliar; cdecl;
    {class} function _Geto_comb: JCombAuxiliar; cdecl;
    {class} function _Geto_coutr: JCofinsOutrAuxiliar; cdecl;
    {class} function _Geto_cqtde: JCofinsQtdeAuxiliar; cdecl;
    {class} function _Geto_csn: JCofinsSnAuxiliar; cdecl;
    {class} function _Geto_cst: JCofinsStAuxiliar; cdecl;
    {class} function _Geto_df: JDF; cdecl;
    {class} function _Geto_em: JEmitAuxiliar; cdecl;
    {class} function _Geto_email: JEmail; cdecl;
    {class} function _Geto_endem: JEnderEmitAuxiliar; cdecl;
    {class} function _Geto_go: JGO; cdecl;
    {class} function _Geto_i: JAux_XmlIde; cdecl;
    {class} function _Geto_ii: JAux_XmlInfIntermed; cdecl;
    {class} function _Geto_imp: JLeiImposto; cdecl;
    {class} function _Geto_infRespTec: JInfRespTecAuxiliar; cdecl;
    {class} function _Geto_m: JMsgPromocional; cdecl;
    {class} function _Geto_ma: JMA; cdecl;
    {class} function _Geto_med: JMedAuxiliar; cdecl;
    {class} function _Geto_mg: JMG; cdecl;
    {class} function _Geto_ms: JMS; cdecl;
    {class} function _Geto_mt: JMT; cdecl;
    {class} function _Geto_n: JAux_XmlNfce; cdecl;
    {class} function _Geto_nt: JPisNtAuxiliar; cdecl;
    {class} function _Geto_ntAuxi: JNT; cdecl;
    {class} function _Geto_outr: JPisOutrAuxiliar; cdecl;
    {class} function _Geto_p: JProdAuxiliar; cdecl;
    {class} function _Geto_pa: JPA; cdecl;
    {class} function _Geto_part: JIcmsPartAuxiliar; cdecl;
    {class} function _Geto_pb: JPB; cdecl;
    {class} function _Geto_pe: JPE; cdecl;
    {class} function _Geto_pi: JPI; cdecl;
    {class} function _Geto_pr: JPR; cdecl;
    {class} function _Geto_qn: JIssQnAuxiliar; cdecl;
    {class} function _Geto_qtde: JPisQtdeAuxiliar; cdecl;
    {class} function _Geto_rj: JRJ; cdecl;
    {class} function _Geto_rn: JRN; cdecl;
    {class} function _Geto_ro: JRO; cdecl;
    {class} function _Geto_rr: JRR; cdecl;
    {class} function _Geto_rs: JRS; cdecl;
    {class} function _Geto_se: JSE; cdecl;
    {class} function _Geto_sn: JPisSnAuxiliar; cdecl;
    {class} function _Geto_sp: JSP; cdecl;
    {class} function _Geto_st: JPisStAuxiliar; cdecl;
    {class} function _Geto_to: JTO; cdecl;
    {class} function _Getop_xmlAuxi: JOp_XmlAuxiliar; cdecl;
    {class} function getInstance(i: Integer): JObject; cdecl;
    {class} function init: JObjetos; cdecl;//Deprecated
    {class} procedure renovarGsDanfe; cdecl;
    {class} property gs: JElementosXmlAuxiliar read _Getgs;
    {class} property gs_canc: JElementosXmlCancelamento read _Getgs_canc;
    {class} property gs_cont: JElementosXMLContingencia read _Getgs_cont;
    {class} property gs_inut: JElementosXMlInutilizacao read _Getgs_inut;
    {class} property o_00: JIcms00Auxiliar read _Geto_00;
    {class} property o_10: JIcms10Auxiliar read _Geto_10;
    {class} property o_101: JIcmsSn101Auxiliar read _Geto_101;
    {class} property o_102: JIcmsSn102Auxiliar read _Geto_102;
    {class} property o_20: JIcms20Auxiliar read _Geto_20;
    {class} property o_201: JIcmsSn201Auxiliar read _Geto_201;
    {class} property o_202: JIcmsSn202Auxiliar read _Geto_202;
    {class} property o_30: JIcms30Auxiliar read _Geto_30;
    {class} property o_40: JIcms40Auxiliar read _Geto_40;
    {class} property o_500: JIcmsSn500Auxiliar read _Geto_500;
    {class} property o_51: JIcms51Auxiliar read _Geto_51;
    {class} property o_60: JIcms60Auxiliar read _Geto_60;
    {class} property o_70: JIcms70Auxiliar read _Geto_70;
    {class} property o_90: JIcms90Auxiliar read _Geto_90;
    {class} property o_900: JIcmsSn900Auxiliar read _Geto_900;
    {class} property o_ac: JAC read _Geto_ac;
    {class} property o_al: JAL read _Geto_al;
    {class} property o_aliq: JPisAliqAuxiliar read _Geto_aliq;
    {class} property o_ap: JAP read _Geto_ap;
    {class} property o_avisoServ: JAux_XmlAvisoServ read _Geto_avisoServ;
    {class} property o_ba: JBA read _Geto_ba;
    {class} property o_caliq: JCofinsAliqAuxiliar read _Geto_caliq;
    {class} property o_ce: JCE read _Geto_ce;
    {class} property o_cide: JCideAuxiliar read _Geto_cide;
    {class} property o_comb: JCombAuxiliar read _Geto_comb;
    {class} property o_coutr: JCofinsOutrAuxiliar read _Geto_coutr;
    {class} property o_cqtde: JCofinsQtdeAuxiliar read _Geto_cqtde;
    {class} property o_csn: JCofinsSnAuxiliar read _Geto_csn;
    {class} property o_cst: JCofinsStAuxiliar read _Geto_cst;
    {class} property o_df: JDF read _Geto_df;
    {class} property o_em: JEmitAuxiliar read _Geto_em;
    {class} property o_email: JEmail read _Geto_email;
    {class} property o_endem: JEnderEmitAuxiliar read _Geto_endem;
    {class} property o_go: JGO read _Geto_go;
    {class} property o_i: JAux_XmlIde read _Geto_i;
    {class} property o_ii: JAux_XmlInfIntermed read _Geto_ii;
    {class} property o_imp: JLeiImposto read _Geto_imp;
    {class} property o_infRespTec: JInfRespTecAuxiliar read _Geto_infRespTec;
    {class} property o_m: JMsgPromocional read _Geto_m;
    {class} property o_ma: JMA read _Geto_ma;
    {class} property o_med: JMedAuxiliar read _Geto_med;
    {class} property o_mg: JMG read _Geto_mg;
    {class} property o_ms: JMS read _Geto_ms;
    {class} property o_mt: JMT read _Geto_mt;
    {class} property o_n: JAux_XmlNfce read _Geto_n;
    {class} property o_nt: JPisNtAuxiliar read _Geto_nt;
    {class} property o_ntAuxi: JNT read _Geto_ntAuxi;
    {class} property o_outr: JPisOutrAuxiliar read _Geto_outr;
    {class} property o_p: JProdAuxiliar read _Geto_p;
    {class} property o_pa: JPA read _Geto_pa;
    {class} property o_part: JIcmsPartAuxiliar read _Geto_part;
    {class} property o_pb: JPB read _Geto_pb;
    {class} property o_pe: JPE read _Geto_pe;
    {class} property o_pi: JPI read _Geto_pi;
    {class} property o_pr: JPR read _Geto_pr;
    {class} property o_qn: JIssQnAuxiliar read _Geto_qn;
    {class} property o_qtde: JPisQtdeAuxiliar read _Geto_qtde;
    {class} property o_rj: JRJ read _Geto_rj;
    {class} property o_rn: JRN read _Geto_rn;
    {class} property o_ro: JRO read _Geto_ro;
    {class} property o_rr: JRR read _Geto_rr;
    {class} property o_rs: JRS read _Geto_rs;
    {class} property o_se: JSE read _Geto_se;
    {class} property o_sn: JPisSnAuxiliar read _Geto_sn;
    {class} property o_sp: JSP read _Geto_sp;
    {class} property o_st: JPisStAuxiliar read _Geto_st;
    {class} property o_to: JTO read _Geto_to;
    {class} property op_xmlAuxi: JOp_XmlAuxiliar read _Getop_xmlAuxi;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Objetos')]
  JObjetos = interface(JObject)
    ['{0BDD42DA-0716-4EBA-835F-819145AABD73}']
  end;
  TJObjetos = class(TJavaGenericImport<JObjetosClass, JObjetos>) end;

  JOp_XmlAuxiliarClass = interface(JObjectClass)
    ['{5AA03DAF-A05B-4B3D-B318-BFA32D6A73A9}']
    {class} function _GetCOFINS_aliq_aux: JCofinsAliqAuxiliar; cdecl;
    {class} function _GetCOFINS_nt_aux: JCofinsNtAuxiliar; cdecl;
    {class} function _GetCOFINS_outr_aux: JCofinsOutrAuxiliar; cdecl;
    {class} function _GetCOFINS_qtde_aux: JCofinsQtdeAuxiliar; cdecl;
    {class} function _GetCOFINS_sn_aux: JCofinsSnAuxiliar; cdecl;
    {class} function _GetCOFINS_st_aux: JCofinsStAuxiliar; cdecl;
    {class} function _GetICMS_00_aux: JIcms00Auxiliar; cdecl;
    {class} function _GetICMS_101_aux: JIcmsSn101Auxiliar; cdecl;
    {class} function _GetICMS_102_aux: JIcmsSn102Auxiliar; cdecl;
    {class} function _GetICMS_10_aux: JIcms10Auxiliar; cdecl;
    {class} function _GetICMS_201_aux: JIcmsSn201Auxiliar; cdecl;
    {class} function _GetICMS_202_aux: JIcmsSn202Auxiliar; cdecl;
    {class} function _GetICMS_20_aux: JIcms20Auxiliar; cdecl;
    {class} function _GetICMS_30_aux: JIcms30Auxiliar; cdecl;
    {class} function _GetICMS_40_aux: JIcms40Auxiliar; cdecl;
    {class} function _GetICMS_500_aux: JIcmsSn500Auxiliar; cdecl;
    {class} function _GetICMS_51_aux: JIcms51Auxiliar; cdecl;
    {class} function _GetICMS_60_aux: JIcms60Auxiliar; cdecl;
    {class} function _GetICMS_70_aux: JIcms70Auxiliar; cdecl;
    {class} function _GetICMS_900_aux: JIcmsSn900Auxiliar; cdecl;
    {class} function _GetICMS_90_aux: JIcms90Auxiliar; cdecl;
    {class} function _GetICMS_part_aux: JIcmsPartAuxiliar; cdecl;
    {class} function _GetICMS_sst_aux: JIcmsStAuxiliar; cdecl;
    {class} function _GetPIS_aliq_aux: JPisAliqAuxiliar; cdecl;
    {class} function _GetPIS_nt_aux: JPisNtAuxiliar; cdecl;
    {class} function _GetPIS_outr_aux: JPisOutrAuxiliar; cdecl;
    {class} function _GetPIS_qtde_aux: JPisQtdeAuxiliar; cdecl;
    {class} function _GetPIS_sn_aux: JPisSnAuxiliar; cdecl;
    {class} function _GetPIS_st_aux: JPisStAuxiliar; cdecl;
    {class} function _Getgs: JElementosXmlAuxiliar; cdecl;
    {class} procedure _Setgs(Value: JElementosXmlAuxiliar); cdecl;
    {class} function _GetlistaPag: JArrayList; cdecl;
    {class} function _GetlistaVendas: JArrayList; cdecl;
    {class} function _Geto_00: JIcms00Auxiliar; cdecl;
    {class} function _Geto_10: JIcms10Auxiliar; cdecl;
    {class} function _Geto_101: JIcmsSn101Auxiliar; cdecl;
    {class} function _Geto_102: JIcmsSn102Auxiliar; cdecl;
    {class} function _Geto_20: JIcms20Auxiliar; cdecl;
    {class} function _Geto_201: JIcmsSn201Auxiliar; cdecl;
    {class} function _Geto_202: JIcmsSn202Auxiliar; cdecl;
    {class} function _Geto_30: JIcms30Auxiliar; cdecl;
    {class} function _Geto_40: JIcms40Auxiliar; cdecl;
    {class} function _Geto_500: JIcmsSn500Auxiliar; cdecl;
    {class} function _Geto_51: JIcms51Auxiliar; cdecl;
    {class} function _Geto_60: JIcms60Auxiliar; cdecl;
    {class} function _Geto_70: JIcms70Auxiliar; cdecl;
    {class} function _Geto_90: JIcms90Auxiliar; cdecl;
    {class} function _Geto_900: JIcmsSn900Auxiliar; cdecl;
    {class} function _Geto_ac: JAC; cdecl;
    {class} function _Geto_al: JAL; cdecl;
    {class} function _Geto_aliq: JPisAliqAuxiliar; cdecl;
    {class} function _Geto_am: JAM; cdecl;
    {class} function _Geto_ap: JAP; cdecl;
    {class} function _Geto_avisoServ: JAux_XmlAvisoServ; cdecl;
    {class} function _Geto_ba: JBA; cdecl;
    {class} function _Geto_c: JConfiguracaoAuxiliar; cdecl;
    {class} function _Geto_caliq: JCofinsAliqAuxiliar; cdecl;
    {class} function _Geto_ce: JCE; cdecl;
    {class} function _Geto_cide: JCideAuxiliar; cdecl;
    {class} function _Geto_cnt: JCofinsNtAuxiliar; cdecl;
    {class} procedure _Seto_cnt(Value: JCofinsNtAuxiliar); cdecl;
    {class} function _Geto_comb: JCombAuxiliar; cdecl;
    {class} function _Geto_coutr: JCofinsOutrAuxiliar; cdecl;
    {class} function _Geto_cqtde: JCofinsQtdeAuxiliar; cdecl;
    {class} function _Geto_csn: JCofinsSnAuxiliar; cdecl;
    {class} function _Geto_cst: JCofinsStAuxiliar; cdecl;
    {class} function _Geto_df: JDF; cdecl;
    {class} function _Geto_e: JEmail; cdecl;
    {class} function _Geto_em: JEmitAuxiliar; cdecl;
    {class} function _Geto_endem: JEnderEmitAuxiliar; cdecl;
    {class} function _Geto_es: JES; cdecl;
    {class} function _Geto_go: JGO; cdecl;
    {class} function _Geto_i: JAux_XmlIde; cdecl;
    {class} function _Geto_ii: JAux_XmlInfIntermed; cdecl;
    {class} procedure _Seto_ii(Value: JAux_XmlInfIntermed); cdecl;
    {class} function _Geto_imp: JLeiImposto; cdecl;
    {class} function _Geto_infRespTec: JInfRespTecAuxiliar; cdecl;
    {class} function _Geto_m: JMsgPromocional; cdecl;
    {class} procedure _Seto_m(Value: JMsgPromocional); cdecl;
    {class} function _Geto_ma: JMA; cdecl;
    {class} function _Geto_med: JMedAuxiliar; cdecl;
    {class} function _Geto_mg: JMG; cdecl;
    {class} function _Geto_ms: JMS; cdecl;
    {class} function _Geto_mt: JMT; cdecl;
    {class} function _Geto_n: JAux_XmlNfce; cdecl;
    {class} function _Geto_nt: JPisNtAuxiliar; cdecl;
    {class} function _Geto_ntAuxi: JNT; cdecl;
    {class} function _Geto_outr: JPisOutrAuxiliar; cdecl;
    {class} function _Geto_p: JProdAuxiliar; cdecl;
    {class} function _Geto_pa: JPA; cdecl;
    {class} function _Geto_part: JIcmsPartAuxiliar; cdecl;
    {class} procedure _Seto_part(Value: JIcmsPartAuxiliar); cdecl;
    {class} function _Geto_pb: JPB; cdecl;
    {class} function _Geto_pe: JPE; cdecl;
    {class} function _Geto_pi: JPI; cdecl;
    {class} function _Geto_pr: JPR; cdecl;
    {class} procedure _Seto_pr(Value: JPR); cdecl;
    {class} function _Geto_qn: JIssQnAuxiliar; cdecl;
    {class} function _Geto_qtde: JPisQtdeAuxiliar; cdecl;
    {class} function _Geto_rj: JRJ; cdecl;
    {class} function _Geto_rn: JRN; cdecl;
    {class} function _Geto_ro: JRO; cdecl;
    {class} function _Geto_rr: JRR; cdecl;
    {class} function _Geto_rs: JRS; cdecl;
    {class} function _Geto_sc: JSC; cdecl;
    {class} function _Geto_se: JSE; cdecl;
    {class} function _Geto_sn: JPisSnAuxiliar; cdecl;
    {class} function _Geto_sp: JSP; cdecl;
    {class} function _Geto_sst: JIcmsStAuxiliar; cdecl;
    {class} function _Geto_st: JPisStAuxiliar; cdecl;
    {class} function _Geto_to: JTO; cdecl;
    {class} function _Geto_transp: JAux_XmlTransp; cdecl;
    {class} function _GetretDest: JArrayList; cdecl;
    {class} function _GetretDet: JArrayList; cdecl;
    {class} function _GetretIde: JArrayList; cdecl;
    {class} function _GetretImp: JArrayList; cdecl;
    {class} function escolherObj(string_: JString): JTags; cdecl;
    {class} function init: JOp_XmlAuxiliar; cdecl;//Deprecated
    {class} procedure lerXmlAuxiliar(context: JContext); cdecl;
    {class} procedure registrarInfoXmlAuxiliar(b: Boolean; context: JContext); cdecl;
    {class} property COFINS_aliq_aux: JCofinsAliqAuxiliar read _GetCOFINS_aliq_aux;
    {class} property COFINS_nt_aux: JCofinsNtAuxiliar read _GetCOFINS_nt_aux;
    {class} property COFINS_outr_aux: JCofinsOutrAuxiliar read _GetCOFINS_outr_aux;
    {class} property COFINS_qtde_aux: JCofinsQtdeAuxiliar read _GetCOFINS_qtde_aux;
    {class} property COFINS_sn_aux: JCofinsSnAuxiliar read _GetCOFINS_sn_aux;
    {class} property COFINS_st_aux: JCofinsStAuxiliar read _GetCOFINS_st_aux;
    {class} property ICMS_00_aux: JIcms00Auxiliar read _GetICMS_00_aux;
    {class} property ICMS_101_aux: JIcmsSn101Auxiliar read _GetICMS_101_aux;
    {class} property ICMS_102_aux: JIcmsSn102Auxiliar read _GetICMS_102_aux;
    {class} property ICMS_10_aux: JIcms10Auxiliar read _GetICMS_10_aux;
    {class} property ICMS_201_aux: JIcmsSn201Auxiliar read _GetICMS_201_aux;
    {class} property ICMS_202_aux: JIcmsSn202Auxiliar read _GetICMS_202_aux;
    {class} property ICMS_20_aux: JIcms20Auxiliar read _GetICMS_20_aux;
    {class} property ICMS_30_aux: JIcms30Auxiliar read _GetICMS_30_aux;
    {class} property ICMS_40_aux: JIcms40Auxiliar read _GetICMS_40_aux;
    {class} property ICMS_500_aux: JIcmsSn500Auxiliar read _GetICMS_500_aux;
    {class} property ICMS_51_aux: JIcms51Auxiliar read _GetICMS_51_aux;
    {class} property ICMS_60_aux: JIcms60Auxiliar read _GetICMS_60_aux;
    {class} property ICMS_70_aux: JIcms70Auxiliar read _GetICMS_70_aux;
    {class} property ICMS_900_aux: JIcmsSn900Auxiliar read _GetICMS_900_aux;
    {class} property ICMS_90_aux: JIcms90Auxiliar read _GetICMS_90_aux;
    {class} property ICMS_part_aux: JIcmsPartAuxiliar read _GetICMS_part_aux;
    {class} property ICMS_sst_aux: JIcmsStAuxiliar read _GetICMS_sst_aux;
    {class} property PIS_aliq_aux: JPisAliqAuxiliar read _GetPIS_aliq_aux;
    {class} property PIS_nt_aux: JPisNtAuxiliar read _GetPIS_nt_aux;
    {class} property PIS_outr_aux: JPisOutrAuxiliar read _GetPIS_outr_aux;
    {class} property PIS_qtde_aux: JPisQtdeAuxiliar read _GetPIS_qtde_aux;
    {class} property PIS_sn_aux: JPisSnAuxiliar read _GetPIS_sn_aux;
    {class} property PIS_st_aux: JPisStAuxiliar read _GetPIS_st_aux;
    {class} property gs: JElementosXmlAuxiliar read _Getgs write _Setgs;
    {class} property listaPag: JArrayList read _GetlistaPag;
    {class} property listaVendas: JArrayList read _GetlistaVendas;
    {class} property o_00: JIcms00Auxiliar read _Geto_00;
    {class} property o_10: JIcms10Auxiliar read _Geto_10;
    {class} property o_101: JIcmsSn101Auxiliar read _Geto_101;
    {class} property o_102: JIcmsSn102Auxiliar read _Geto_102;
    {class} property o_20: JIcms20Auxiliar read _Geto_20;
    {class} property o_201: JIcmsSn201Auxiliar read _Geto_201;
    {class} property o_202: JIcmsSn202Auxiliar read _Geto_202;
    {class} property o_30: JIcms30Auxiliar read _Geto_30;
    {class} property o_40: JIcms40Auxiliar read _Geto_40;
    {class} property o_500: JIcmsSn500Auxiliar read _Geto_500;
    {class} property o_51: JIcms51Auxiliar read _Geto_51;
    {class} property o_60: JIcms60Auxiliar read _Geto_60;
    {class} property o_70: JIcms70Auxiliar read _Geto_70;
    {class} property o_90: JIcms90Auxiliar read _Geto_90;
    {class} property o_900: JIcmsSn900Auxiliar read _Geto_900;
    {class} property o_ac: JAC read _Geto_ac;
    {class} property o_al: JAL read _Geto_al;
    {class} property o_aliq: JPisAliqAuxiliar read _Geto_aliq;
    {class} property o_am: JAM read _Geto_am;
    {class} property o_ap: JAP read _Geto_ap;
    {class} property o_avisoServ: JAux_XmlAvisoServ read _Geto_avisoServ;
    {class} property o_ba: JBA read _Geto_ba;
    {class} property o_c: JConfiguracaoAuxiliar read _Geto_c;
    {class} property o_caliq: JCofinsAliqAuxiliar read _Geto_caliq;
    {class} property o_ce: JCE read _Geto_ce;
    {class} property o_cide: JCideAuxiliar read _Geto_cide;
    {class} property o_cnt: JCofinsNtAuxiliar read _Geto_cnt write _Seto_cnt;
    {class} property o_comb: JCombAuxiliar read _Geto_comb;
    {class} property o_coutr: JCofinsOutrAuxiliar read _Geto_coutr;
    {class} property o_cqtde: JCofinsQtdeAuxiliar read _Geto_cqtde;
    {class} property o_csn: JCofinsSnAuxiliar read _Geto_csn;
    {class} property o_cst: JCofinsStAuxiliar read _Geto_cst;
    {class} property o_df: JDF read _Geto_df;
    {class} property o_e: JEmail read _Geto_e;
    {class} property o_em: JEmitAuxiliar read _Geto_em;
    {class} property o_endem: JEnderEmitAuxiliar read _Geto_endem;
    {class} property o_es: JES read _Geto_es;
    {class} property o_go: JGO read _Geto_go;
    {class} property o_i: JAux_XmlIde read _Geto_i;
    {class} property o_ii: JAux_XmlInfIntermed read _Geto_ii write _Seto_ii;
    {class} property o_imp: JLeiImposto read _Geto_imp;
    {class} property o_infRespTec: JInfRespTecAuxiliar read _Geto_infRespTec;
    {class} property o_m: JMsgPromocional read _Geto_m write _Seto_m;
    {class} property o_ma: JMA read _Geto_ma;
    {class} property o_med: JMedAuxiliar read _Geto_med;
    {class} property o_mg: JMG read _Geto_mg;
    {class} property o_ms: JMS read _Geto_ms;
    {class} property o_mt: JMT read _Geto_mt;
    {class} property o_n: JAux_XmlNfce read _Geto_n;
    {class} property o_nt: JPisNtAuxiliar read _Geto_nt;
    {class} property o_ntAuxi: JNT read _Geto_ntAuxi;
    {class} property o_outr: JPisOutrAuxiliar read _Geto_outr;
    {class} property o_p: JProdAuxiliar read _Geto_p;
    {class} property o_pa: JPA read _Geto_pa;
    {class} property o_part: JIcmsPartAuxiliar read _Geto_part write _Seto_part;
    {class} property o_pb: JPB read _Geto_pb;
    {class} property o_pe: JPE read _Geto_pe;
    {class} property o_pi: JPI read _Geto_pi;
    {class} property o_pr: JPR read _Geto_pr write _Seto_pr;
    {class} property o_qn: JIssQnAuxiliar read _Geto_qn;
    {class} property o_qtde: JPisQtdeAuxiliar read _Geto_qtde;
    {class} property o_rj: JRJ read _Geto_rj;
    {class} property o_rn: JRN read _Geto_rn;
    {class} property o_ro: JRO read _Geto_ro;
    {class} property o_rr: JRR read _Geto_rr;
    {class} property o_rs: JRS read _Geto_rs;
    {class} property o_sc: JSC read _Geto_sc;
    {class} property o_se: JSE read _Geto_se;
    {class} property o_sn: JPisSnAuxiliar read _Geto_sn;
    {class} property o_sp: JSP read _Geto_sp;
    {class} property o_sst: JIcmsStAuxiliar read _Geto_sst;
    {class} property o_st: JPisStAuxiliar read _Geto_st;
    {class} property o_to: JTO read _Geto_to;
    {class} property o_transp: JAux_XmlTransp read _Geto_transp;
    {class} property retDest: JArrayList read _GetretDest;
    {class} property retDet: JArrayList read _GetretDet;
    {class} property retIde: JArrayList read _GetretIde;
    {class} property retImp: JArrayList read _GetretImp;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Op_XmlAuxiliar')]
  JOp_XmlAuxiliar = interface(JObject)
    ['{80F69CCA-703B-492B-B547-BE90F2EEBBDF}']
    function _GetretEmit: JArrayList; cdecl;
    procedure _SetretEmit(Value: JArrayList); cdecl;
    procedure GerarXmlAuxiliar(context: JContext); cdecl;
    procedure alteraImpVenda(string_: TJavaObjectArray<JString>; string_1: TJavaObjectArray<JString>; string_2: JString; i: Integer; xml_ElementosEnvioNFCe: JXml_ElementosEnvioNFCe; string_3: JString; context: JContext); cdecl;
    procedure fnAtualizaGNE; cdecl;
    procedure fnLimparEstruturaAuxiliar; cdecl;
    function gerarChaveAcesso(context: JContext): JString; cdecl;
    procedure maquinaStatus(string_: JString); cdecl;
    property retEmit: JArrayList read _GetretEmit write _SetretEmit;
  end;
  TJOp_XmlAuxiliar = class(TJavaGenericImport<JOp_XmlAuxiliarClass, JOp_XmlAuxiliar>) end;

  JOp_XmlCancClass = interface(JObjectClass)
    ['{0B5483B3-AFEA-48CA-83EB-A5C1E425E506}']
    {class} function init: JOp_XmlCanc; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Op_XmlCanc')]
  JOp_XmlCanc = interface(JObject)
    ['{D499A3B3-669D-4B61-9FDC-D70D21C64E12}']
    function fnLerXmlCanc(string_: JString; context: JContext): Jjdom2_Document; cdecl;
    function gerarXmlcancelamento(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; b: Boolean; context: JContext): JString; cdecl;
    function separarInfo(document: Jjdom2_Document): TJavaObjectArray<JString>; cdecl;
  end;
  TJOp_XmlCanc = class(TJavaGenericImport<JOp_XmlCancClass, JOp_XmlCanc>) end;

  Jxml_Op_XmlConsultaClass = interface(JObjectClass)
    ['{D7098D11-2CC1-40BD-8755-1CECDA048975}']
    {class} function _GetChaveAcesso: Jjdom2_Element; cdecl;
    {class} function _GetCnpjEmissor: Jjdom2_Element; cdecl;
    {class} function _GetDataEmissaoFinal: Jjdom2_Element; cdecl;
    {class} function _GetNumeroFinal: Jjdom2_Element; cdecl;
    {class} function _GetSerie: Jjdom2_Element; cdecl;
    {class} function _GetVersao: Jjdom2_Element; cdecl;
    {class} function _GetdhUF: Jjdom2_Element; cdecl;
    {class} function _GettpAmb: Jjdom2_Element; cdecl;
    {class} function init: Jxml_Op_XmlConsulta; cdecl;//Deprecated
    {class} property ChaveAcesso: Jjdom2_Element read _GetChaveAcesso;
    {class} property CnpjEmissor: Jjdom2_Element read _GetCnpjEmissor;
    {class} property DataEmissaoFinal: Jjdom2_Element read _GetDataEmissaoFinal;
    {class} property NumeroFinal: Jjdom2_Element read _GetNumeroFinal;
    {class} property Serie: Jjdom2_Element read _GetSerie;
    {class} property Versao: Jjdom2_Element read _GetVersao;
    {class} property dhUF: Jjdom2_Element read _GetdhUF;
    {class} property tpAmb: Jjdom2_Element read _GettpAmb;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Op_XmlConsulta')]
  Jxml_Op_XmlConsulta = interface(JObject)
    ['{F0DA871E-4A92-4F56-B776-71E07C102CEA}']
    function gerarXmlConsulta(context: JContext): JString; cdecl;
    function preencherXmlConsultaNFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; context: JContext): JString; cdecl;
  end;
  TJxml_Op_XmlConsulta = class(TJavaGenericImport<Jxml_Op_XmlConsultaClass, Jxml_Op_XmlConsulta>) end;

  JOp_XmlContingenciaClass = interface(JObjectClass)
    ['{6EC867A5-D267-4427-86B1-80F1F83EDBA3}']
    {class} function _GetlistaPag: JArrayList; cdecl;
    {class} function _GetlistaVendas: JArrayList; cdecl;
    {class} function _GetretDest: JArrayList; cdecl;
    {class} function _GetretEnderDest: JArrayList; cdecl;
    {class} function _GetretEnderEmit: JArrayList; cdecl;
    {class} function _GetretIde: JArrayList; cdecl;
    {class} function _GetretImp: JArrayList; cdecl;
    {class} function _GetretPag: JArrayList; cdecl;
    {class} function init(context: JContext): JOp_XmlContingencia; cdecl;//Deprecated
    {class} property listaPag: JArrayList read _GetlistaPag;
    {class} property listaVendas: JArrayList read _GetlistaVendas;
    {class} property retDest: JArrayList read _GetretDest;
    {class} property retEnderDest: JArrayList read _GetretEnderDest;
    {class} property retEnderEmit: JArrayList read _GetretEnderEmit;
    {class} property retIde: JArrayList read _GetretIde;
    {class} property retImp: JArrayList read _GetretImp;
    {class} property retPag: JArrayList read _GetretPag;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Op_XmlContingencia')]
  JOp_XmlContingencia = interface(JObject)
    ['{3DD91F50-52B4-4988-8E03-11767E854E10}']
    function _Getgs_cont: JElementosXMLContingencia; cdecl;
    procedure _Setgs_cont(Value: JElementosXMLContingencia); cdecl;
    function lerXMlVendaCont(string_: JString; c: TJavaArray<Char>; c1: TJavaArray<Char>; string_1: JString): JString; cdecl;
    procedure sepraraInfoXML(string_: JString; c: TJavaArray<Char>; c1: TJavaArray<Char>; c2: TJavaArray<Char>); cdecl;
    property gs_cont: JElementosXMLContingencia read _Getgs_cont write _Setgs_cont;
  end;
  TJOp_XmlContingencia = class(TJavaGenericImport<JOp_XmlContingenciaClass, JOp_XmlContingencia>) end;

  JOp_XmlInutilizacaoClass = interface(JOp_XmlAuxiliarClass)
    ['{F3690F65-F2E0-4D90-BB51-EB2ACA5FB068}']
    {class} function init: JOp_XmlInutilizacao; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Op_XmlInutilizacao')]
  JOp_XmlInutilizacao = interface(JOp_XmlAuxiliar)
    ['{0362725D-7144-487C-9AC0-EC71F89A98BC}']
    function gerarXmlInutilizacao(string_: JString; string_1: JString; string_2: JString; string_3: JString; context: JContext): JString; cdecl;
    procedure preencherXml(string_: JString; string_1: JString; string_2: JString; string_3: JString; context: JContext); cdecl;
  end;
  TJOp_XmlInutilizacao = class(TJavaGenericImport<JOp_XmlInutilizacaoClass, JOp_XmlInutilizacao>) end;

  JXml_ElementosEnvioNFCeClass = interface(Jgne_UtilsClass)
    ['{CA24CF63-DEDB-4FFD-A879-5C341325BC61}']
    {class} function init: JXml_ElementosEnvioNFCe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Xml_ElementosEnvioNFCe')]
  JXml_ElementosEnvioNFCe = interface(Jgne_Utils)
    ['{56BAE7E6-3558-4540-AE1F-649BA1F41BB0}']
    function fnGerarCombustivel(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarDest(string_: TJavaObjectArray<JString>): JString; cdecl;
    function fnGerarDet(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarEmit(context: JContext): JString; cdecl;
    function fnGerarEncerramento(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMS00(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMS10(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMS20(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMS30(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMS40(string_: TJavaObjectArray<JString>): JString; cdecl;
    function fnGerarICMS51(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMS60(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMS70(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMS90(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMSPart(string_: TJavaObjectArray<JString>): JString; cdecl;
    function fnGerarICMSSN101(string_: TJavaObjectArray<JString>): JString; cdecl;
    function fnGerarICMSSN102(string_: TJavaObjectArray<JString>): JString; cdecl;
    function fnGerarICMSSN201(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMSSN202(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMSSN500(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMSSN900(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarICMSST(string_: TJavaObjectArray<JString>): JString; cdecl;
    function fnGerarIde(context: JContext): JString; cdecl;
    function fnGerarInfIntermed(context: JContext): JString; cdecl;
    function fnGerarInfRespTec(context: JContext): JString; cdecl;
    function fnGerarPag(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarProd(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarRastro(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarTotal(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnGerarTransp(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function fnTratarICMS(string_: TJavaObjectArray<JString>; context: JContext): JString; cdecl;
    function getTotalFCPST: JString; cdecl;
    procedure setTotalFCPST(string_: JString); cdecl;
  end;
  TJXml_ElementosEnvioNFCe = class(TJavaGenericImport<JXml_ElementosEnvioNFCeClass, JXml_ElementosEnvioNFCe>) end;

  JAux_XmlAvisoServClass = interface(JTagsClass)
    ['{8A586A36-B297-454B-B183-A3F69B3F2C52}']
    {class} function init: JAux_XmlAvisoServ; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/auxiliar/Aux_XmlAvisoServ')]
  JAux_XmlAvisoServ = interface(JTags)
    ['{957F7B28-504C-495E-9A62-07C51ACAE65B}']
    function getDias: JString; cdecl;
    function getEmail: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setDias(string_: JString); cdecl;
    procedure setEmail(string_: JString); cdecl;
  end;
  TJAux_XmlAvisoServ = class(TJavaGenericImport<JAux_XmlAvisoServClass, JAux_XmlAvisoServ>) end;

  JAux_XmlIdeClass = interface(JTagsClass)
    ['{47F61375-A6A4-4316-9560-E8FDEE98524E}']
    {class} function init: JAux_XmlIde; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/auxiliar/Aux_XmlIde')]
  JAux_XmlIde = interface(JTags)
    ['{1DF7848A-C55A-4F4F-825E-227DB9899891}']
    function getCtgNNF: JString; cdecl;
    function getCtgSerie: JString; cdecl;
    function getFinNfe: JString; cdecl;
    function getIdDest: JString; cdecl;
    function getIndFinal: JString; cdecl;
    function getIndIntermed: JString; cdecl;
    function getIndPag: JString; cdecl;
    function getIndPres: JString; cdecl;
    function getMod: JString; cdecl;
    function getNatOP: JString; cdecl;
    function getSerie: JString; cdecl;
    function getTpEmis: JString; cdecl;
    function getTpImp: JString; cdecl;
    function getTpNF: JString; cdecl;
    function getVerProc: JString; cdecl;
    function getcMunFG: JString; cdecl;
    function getcNF: JString; cdecl;
    function getcUF: JString; cdecl;
    function getnNF: JString; cdecl;
    function getxJust: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCtgNNF(string_: JString); cdecl;
    procedure setCtgSerie(string_: JString); cdecl;
    procedure setFinNfe(string_: JString); cdecl;
    procedure setIdDest(string_: JString); cdecl;
    procedure setIndFinal(string_: JString); cdecl;
    procedure setIndIntermed(string_: JString); cdecl;
    procedure setIndPag(string_: JString); cdecl;
    procedure setIndPres(string_: JString); cdecl;
    procedure setMod(string_: JString); cdecl;
    procedure setNatOP(string_: JString); cdecl;
    procedure setSerie(string_: JString); cdecl;
    procedure setTpEmis(string_: JString); cdecl;
    procedure setTpImp(string_: JString); cdecl;
    procedure setTpNF(string_: JString); cdecl;
    procedure setVerProc(string_: JString); cdecl;
    procedure setcMunFG(string_: JString); cdecl;
    procedure setcNF(string_: JString); cdecl;
    procedure setcUF(string_: JString); cdecl;
    procedure setnNF(string_: JString); cdecl;
    procedure setxJust(string_: JString); cdecl;
  end;
  TJAux_XmlIde = class(TJavaGenericImport<JAux_XmlIdeClass, JAux_XmlIde>) end;

  JAux_XmlInfIntermedClass = interface(JTagsClass)
    ['{8D8DD91D-DE6B-47C0-B576-257A9B7238F1}']
    {class} function init: JAux_XmlInfIntermed; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/auxiliar/Aux_XmlInfIntermed')]
  JAux_XmlInfIntermed = interface(JTags)
    ['{1709BCFA-49BB-4DE9-BB2C-A00CCF6543D5}']
    function getCNPJ: JString; cdecl;
    function getIdCadIntTran: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCNPJ(string_: JString); cdecl;
    procedure setIdCadIntTran(string_: JString); cdecl;
  end;
  TJAux_XmlInfIntermed = class(TJavaGenericImport<JAux_XmlInfIntermedClass, JAux_XmlInfIntermed>) end;

  JAux_XmlNfceClass = interface(JTagsClass)
    ['{3084FC42-D34F-447A-83B7-271CDD3380E6}']
    {class} function init: JAux_XmlNfce; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/auxiliar/Aux_XmlNfce')]
  JAux_XmlNfce = interface(JTags)
    ['{2B69EDBD-220A-4966-9DBD-D6A456E1B5D5}']
    function getChaveAcesso: JString; cdecl;
    function getEmissaoOff: JString; cdecl;
    function getMsgLeiImposto: JString; cdecl;
    function getNaoReenvioCont: JString; cdecl;
    function getProtocolo: JString; cdecl;
    function getRangeCtg: JString; cdecl;
    function getUrlQRCode: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveAcesso(string_: JString); cdecl;
    procedure setEmissaoOff(string_: JString); cdecl;
    procedure setMsgLeiImposto(string_: JString); cdecl;
    procedure setNaoReenvioCont(string_: JString); cdecl;
    procedure setProtocolo(string_: JString); cdecl;
    procedure setRangeCtg(string_: JString); cdecl;
    procedure setUrlQRCode(string_: JString); cdecl;
  end;
  TJAux_XmlNfce = class(TJavaGenericImport<JAux_XmlNfceClass, JAux_XmlNfce>) end;

  JAux_XmlTranspClass = interface(JTagsClass)
    ['{6A919B1C-B1C8-4733-BFB2-8B5D56413078}']
    {class} function init: JAux_XmlTransp; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/auxiliar/Aux_XmlTransp')]
  JAux_XmlTransp = interface(JTags)
    ['{300D0B11-6B44-4147-9D0C-6CBCEAD9C88E}']
    function getModFrete: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setModFrete(string_: JString); cdecl;
  end;
  TJAux_XmlTransp = class(TJavaGenericImport<JAux_XmlTranspClass, JAux_XmlTransp>) end;

  JACClass = interface(JTagsClass)
    ['{0072D4E8-CCB0-4594-BBDE-4256072F50AA}']
    {class} function init: JAC; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/AC')]
  JAC = interface(JTags)
    ['{51E36EF6-F225-4DCB-9A72-185AC6310C5F}']
    function getChaveConHomoAC: JString; cdecl;
    function getChaveConProdAC: JString; cdecl;
    function getHomoAC: JString; cdecl;
    function getProdAC: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoAC(string_: JString); cdecl;
    procedure setChaveConProdAC(string_: JString); cdecl;
    procedure setHomoAC(string_: JString); cdecl;
    procedure setProdAC(string_: JString); cdecl;
  end;
  TJAC = class(TJavaGenericImport<JACClass, JAC>) end;

  JALClass = interface(JTagsClass)
    ['{AD361E5E-0ED5-47FA-BA82-0864015D2432}']
    {class} function init: JAL; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/AL')]
  JAL = interface(JTags)
    ['{D3079DD6-B23F-4CE2-9C02-D24B997C9671}']
    function getChaveConHomoAL: JString; cdecl;
    function getChaveConProdAL: JString; cdecl;
    function getHomoAL: JString; cdecl;
    function getProdAL: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoAL(string_: JString); cdecl;
    procedure setChaveConProdAL(string_: JString); cdecl;
    procedure setHomoAL(string_: JString); cdecl;
    procedure setProdAL(string_: JString); cdecl;
  end;
  TJAL = class(TJavaGenericImport<JALClass, JAL>) end;

  JAMClass = interface(JTagsClass)
    ['{29E9CC68-58BF-4467-9B0E-B1F10D0AC388}']
    {class} function init: JAM; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/AM')]
  JAM = interface(JTags)
    ['{11DB3704-983B-423C-8F38-E94EB82F4699}']
    function getChaveConHomoAM: JString; cdecl;
    function getChaveConProdAM: JString; cdecl;
    function getHomoAM: JString; cdecl;
    function getProdAM: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoAM(string_: JString); cdecl;
    procedure setChaveConProdAM(string_: JString); cdecl;
    procedure setHomoAM(string_: JString); cdecl;
    procedure setProdAM(string_: JString); cdecl;
  end;
  TJAM = class(TJavaGenericImport<JAMClass, JAM>) end;

  JAPClass = interface(JTagsClass)
    ['{1E6C0DAE-A771-43BB-B275-98F185A751F7}']
    {class} function init: JAP; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/AP')]
  JAP = interface(JTags)
    ['{6D46F8E6-F7AF-48C5-99BE-C7D90BD4C081}']
    function getChaveConHomoAP: JString; cdecl;
    function getChaveConProdAP: JString; cdecl;
    function getHomoAP: JString; cdecl;
    function getProdAP: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoAP(string_: JString); cdecl;
    procedure setChaveConProdAP(string_: JString); cdecl;
    procedure setHomoAP(string_: JString); cdecl;
    procedure setProdAP(string_: JString); cdecl;
  end;
  TJAP = class(TJavaGenericImport<JAPClass, JAP>) end;

  JBAClass = interface(JTagsClass)
    ['{CE4E1B63-0DDF-49C8-AD6A-E74C293E3FD2}']
    {class} function init: JBA; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/BA')]
  JBA = interface(JTags)
    ['{E1F2D505-11C8-43C9-A40C-E08C0146641C}']
    function getChaveConHomoBA: JString; cdecl;
    function getChaveConProdBA: JString; cdecl;
    function getHomoBA: JString; cdecl;
    function getProdBA: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoBA(string_: JString); cdecl;
    procedure setChaveConProdBA(string_: JString); cdecl;
    procedure setHomoBA(string_: JString); cdecl;
    procedure setProdBA(string_: JString); cdecl;
  end;
  TJBA = class(TJavaGenericImport<JBAClass, JBA>) end;

  JCEClass = interface(JTagsClass)
    ['{37F1A5FA-D481-4E0A-B6E5-D2C7F017D6AB}']
    {class} function init: JCE; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CE')]
  JCE = interface(JTags)
    ['{896DC15D-A6C7-45B4-9DD3-3213CC11BFAE}']
    function getChaveConHomoCE: JString; cdecl;
    function getChaveConProdCE: JString; cdecl;
    function getHomoCE: JString; cdecl;
    function getProdCE: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoCE(string_: JString); cdecl;
    procedure setChaveConProdCE(string_: JString); cdecl;
    procedure setHomoCE(string_: JString); cdecl;
    procedure setProdCE(string_: JString); cdecl;
  end;
  TJCE = class(TJavaGenericImport<JCEClass, JCE>) end;

  JCideAuxiliarClass = interface(JTagsClass)
    ['{D998C3C2-9D0B-4727-B4C3-771A8F1681A2}']
    {class} function init: JCideAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CideAuxiliar')]
  JCideAuxiliar = interface(JTags)
    ['{5F5666CF-0F12-4D10-B7B0-DC02EF60D6C0}']
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    function getvCIDE: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
    procedure setvCIDE(string_: JString); cdecl;
  end;
  TJCideAuxiliar = class(TJavaGenericImport<JCideAuxiliarClass, JCideAuxiliar>) end;

  JCofinsAliqAuxiliarClass = interface(JTagsClass)
    ['{8FE9AD99-3C19-4D77-B464-2A4AA1242673}']
    {class} function init: JCofinsAliqAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsAliqAuxiliar')]
  JCofinsAliqAuxiliar = interface(JTags)
    ['{FE015500-9029-4D84-9C23-70C91744120B}']
    function getCST: JString; cdecl;
    function getpCOFINS: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvCOFINS: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setpCOFINS(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvCOFINS(string_: JString); cdecl;
  end;
  TJCofinsAliqAuxiliar = class(TJavaGenericImport<JCofinsAliqAuxiliarClass, JCofinsAliqAuxiliar>) end;

  JCofinsNtAuxiliarClass = interface(JTagsClass)
    ['{95E12925-07B0-4B09-B314-29E0A42A26B9}']
    {class} function init: JCofinsNtAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsNtAuxiliar')]
  JCofinsNtAuxiliar = interface(JTags)
    ['{73E32CA4-B43D-4E25-A857-E362DBE5E56C}']
    function getCST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJCofinsNtAuxiliar = class(TJavaGenericImport<JCofinsNtAuxiliarClass, JCofinsNtAuxiliar>) end;

  JCofinsOutrAuxiliarClass = interface(JTagsClass)
    ['{8D74D5BE-E073-43A1-96E5-57B4EA0C1E21}']
    {class} function init: JCofinsOutrAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsOutrAuxiliar')]
  JCofinsOutrAuxiliar = interface(JTags)
    ['{9B78BDEA-2354-45E7-908F-774DEE8C75D5}']
    function getCST: JString; cdecl;
    function getpCOFINS: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvCOFINS: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setpCOFINS(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvCOFINS(string_: JString); cdecl;
  end;
  TJCofinsOutrAuxiliar = class(TJavaGenericImport<JCofinsOutrAuxiliarClass, JCofinsOutrAuxiliar>) end;

  JCofinsQtdeAuxiliarClass = interface(JTagsClass)
    ['{DE9FED72-C29F-42C6-BF51-A4666ACA1760}']
    {class} function init: JCofinsQtdeAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsQtdeAuxiliar')]
  JCofinsQtdeAuxiliar = interface(JTags)
    ['{76165F52-EBEE-4256-A57C-5AF0AAF6AD6C}']
    function getCST: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    function getvCOFINS: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
    procedure setvCOFINS(string_: JString); cdecl;
  end;
  TJCofinsQtdeAuxiliar = class(TJavaGenericImport<JCofinsQtdeAuxiliarClass, JCofinsQtdeAuxiliar>) end;

  JCofinsSnAuxiliarClass = interface(JTagsClass)
    ['{F3C4B1EA-0C5B-4208-B93F-7907DE14AB8B}']
    {class} function init: JCofinsSnAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsSnAuxiliar')]
  JCofinsSnAuxiliar = interface(JTags)
    ['{C6F6C913-39DB-4094-88E2-2C5095656D1C}']
    function getCST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJCofinsSnAuxiliar = class(TJavaGenericImport<JCofinsSnAuxiliarClass, JCofinsSnAuxiliar>) end;

  JCofinsStAuxiliarClass = interface(JTagsClass)
    ['{55AA10EF-7277-44AC-AE55-0FB7E30BCC40}']
    {class} function init: JCofinsStAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsStAuxiliar')]
  JCofinsStAuxiliar = interface(JTags)
    ['{07A915FE-3761-40FE-A6B7-D47099BBEDF4}']
    function getpCOFINS: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvCOFINS: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setpCOFINS(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvCOFINS(string_: JString); cdecl;
  end;
  TJCofinsStAuxiliar = class(TJavaGenericImport<JCofinsStAuxiliarClass, JCofinsStAuxiliar>) end;

  JCombAuxiliarClass = interface(JTagsClass)
    ['{0A0BE384-8FC1-42BD-8D32-92241CDE3D14}']
    {class} function init: JCombAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CombAuxiliar')]
  JCombAuxiliar = interface(JTags)
    ['{7BDFD241-4FF2-46CB-8EFE-2BE5F2839484}']
    function getCODIF: JString; cdecl;
    function getDescANP: JString; cdecl;
    function getUFCons: JString; cdecl;
    function getcProdANP: JString; cdecl;
    function getpGLP: JString; cdecl;
    function getpGNi: JString; cdecl;
    function getpGNn: JString; cdecl;
    function getqTemp: JString; cdecl;
    function getvPart: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCODIF(string_: JString); cdecl;
    procedure setDescANP(string_: JString); cdecl;
    procedure setUFCons(string_: JString); cdecl;
    procedure setcProdANP(string_: JString); cdecl;
    procedure setpGLP(string_: JString); cdecl;
    procedure setpGNi(string_: JString); cdecl;
    procedure setpGNn(string_: JString); cdecl;
    procedure setqTemp(string_: JString); cdecl;
    procedure setvPart(string_: JString); cdecl;
  end;
  TJCombAuxiliar = class(TJavaGenericImport<JCombAuxiliarClass, JCombAuxiliar>) end;

  JConfiguracaoAuxiliarClass = interface(JTagsClass)
    ['{3E6F8496-AA0D-4909-AF29-33E9AF0DF342}']
    {class} function init: JConfiguracaoAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ConfiguracaoAuxiliar')]
  JConfiguracaoAuxiliar = interface(JTags)
    ['{614C41AB-724E-4A1C-9BB8-AD459BDC4450}']
    function getAjustarValor: JString; cdecl;
    function getArredondarTruncar: JString; cdecl;
    function getAvisoCont: JString; cdecl;
    function getCancInutiliza: JString; cdecl;
    function getCodImpressaoSEFAZ: JString; cdecl;
    function getEmpCK: JString; cdecl;
    function getEmpCO: JString; cdecl;
    function getEmpPK: JString; cdecl;
    function getEndServ: JString; cdecl;
    function getEstadoCFe: JString; cdecl;
    function getHabSat: JString; cdecl;
    function getHistoricoXML: JString; cdecl;
    function getIdToken: JString; cdecl;
    function getImpCompleta: JString; cdecl;
    function getImpressora: JString; cdecl;
    function getLayoutImpressao: JString; cdecl;
    function getLocalArquivos: JString; cdecl;
    function getLocalLogo: JString; cdecl;
    function getModelo: JString; cdecl;
    function getNumAuto: JString; cdecl;
    function getQrcodeBMP: JString; cdecl;
    function getSalvarPDF: JString; cdecl;
    function getSalvarXML: JString; cdecl;
    function getSerieContingencia: JString; cdecl;
    function getTipoAmbiente: JString; cdecl;
    function getTipoNF: JString; cdecl;
    function getToken: JString; cdecl;
    function getTroco: JString; cdecl;
    function getValidadeServ: JString; cdecl;
    function getVersaoQRCode: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setAjustarValor(string_: JString); cdecl;
    procedure setArredondarTruncar(string_: JString); cdecl;
    procedure setAvisoCont(string_: JString); cdecl;
    procedure setCancInutiliza(string_: JString); cdecl;
    procedure setCodImpressaoSEFAZ(string_: JString); cdecl;
    procedure setEmpCK(string_: JString); cdecl;
    procedure setEmpCO(string_: JString); cdecl;
    procedure setEmpPK(string_: JString); cdecl;
    procedure setEndServ(string_: JString); cdecl;
    procedure setEstadoCFe(string_: JString); cdecl;
    procedure setHabSat(string_: JString); cdecl;
    procedure setHistoricoXML(string_: JString); cdecl;
    procedure setIdToken(string_: JString); cdecl;
    procedure setImpCompleta(string_: JString); cdecl;
    procedure setImpressora(string_: JString); cdecl;
    procedure setLayoutImpressao(string_: JString); cdecl;
    procedure setLocalArquivos(string_: JString); cdecl;
    procedure setLocalLogo(string_: JString); cdecl;
    procedure setModelo(string_: JString); cdecl;
    procedure setNumAuto(string_: JString); cdecl;
    procedure setQrcodeBMP(string_: JString); cdecl;
    procedure setSalvarPDF(string_: JString); cdecl;
    procedure setSalvarXML(string_: JString); cdecl;
    procedure setSerieContingencia(string_: JString); cdecl;
    procedure setTipoAmbiente(string_: JString); cdecl;
    procedure setTipoNF(string_: JString); cdecl;
    procedure setToken(string_: JString); cdecl;
    procedure setTroco(string_: JString); cdecl;
    procedure setValidadeServ(string_: JString); cdecl;
    procedure setVersaoQRCode(string_: JString); cdecl;
  end;
  TJConfiguracaoAuxiliar = class(TJavaGenericImport<JConfiguracaoAuxiliarClass, JConfiguracaoAuxiliar>) end;

  JDFClass = interface(JTagsClass)
    ['{4F6644C8-CD8E-475D-946E-200BFA604C9F}']
    {class} function init: JDF; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/DF')]
  JDF = interface(JTags)
    ['{18177E73-DF3C-4721-8053-AC53B093F4A1}']
    function getChaveConHomoDF: JString; cdecl;
    function getChaveConProdDF: JString; cdecl;
    function getHomoDF: JString; cdecl;
    function getProdDF: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoDF(string_: JString); cdecl;
    procedure setChaveConProdDF(string_: JString); cdecl;
    procedure setHomoDF(string_: JString); cdecl;
    procedure setProdDF(string_: JString); cdecl;
  end;
  TJDF = class(TJavaGenericImport<JDFClass, JDF>) end;

  JESClass = interface(JTagsClass)
    ['{23F33F55-B746-4B73-88A3-881487DC7CA7}']
    {class} function init: JES; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ES')]
  JES = interface(JTags)
    ['{573C137B-1B97-4283-A6C4-F6D7F0E0A5DD}']
    function getChaveConHomoES: JString; cdecl;
    function getChaveConProdES: JString; cdecl;
    function getHomoES: JString; cdecl;
    function getProdES: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoES(string_: JString); cdecl;
    procedure setChaveConProdES(string_: JString); cdecl;
    procedure setHomoES(string_: JString); cdecl;
    procedure setProdES(string_: JString); cdecl;
  end;
  TJES = class(TJavaGenericImport<JESClass, JES>) end;

  JElementosXMLContingenciaClass = interface(JObjectClass)
    ['{27DF9DFD-E201-4763-A2F1-D96CA3DA4805}']
    {class} function _Getserie: Jjdom2_Element; cdecl;
    {class} function init: JElementosXMLContingencia; cdecl;//Deprecated
    {class} property serie: Jjdom2_Element read _Getserie;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ElementosXMLContingencia')]
  JElementosXMLContingencia = interface(JObject)
    ['{F1B3B962-4189-48E1-B431-81BA71F97BE5}']
    function _GetSubstituirDocumento: Jjdom2_Element; cdecl;
    procedure _SetSubstituirDocumento(Value: Jjdom2_Element); cdecl;
    function _GetnNF: Jjdom2_Element; cdecl;
    procedure _SetnNF(Value: Jjdom2_Element); cdecl;
    procedure vinculaXml; cdecl;
    property SubstituirDocumento: Jjdom2_Element read _GetSubstituirDocumento write _SetSubstituirDocumento;
    property nNF: Jjdom2_Element read _GetnNF write _SetnNF;
  end;
  TJElementosXMLContingencia = class(TJavaGenericImport<JElementosXMLContingenciaClass, JElementosXMLContingencia>) end;

  JElementosXMlInutilizacaoClass = interface(JObjectClass)
    ['{A56D57E0-AFED-4B07-B8C9-643687F6C9BC}']
    {class} function _Getambiente: Jjdom2_Element; cdecl;
    {class} function _GetcnpjEmissor: Jjdom2_Element; cdecl;
    {class} function _Getjustificativa: Jjdom2_Element; cdecl;
    {class} function _GetnumeroFinal: Jjdom2_Element; cdecl;
    {class} function _Getserie: Jjdom2_Element; cdecl;
    {class} function _Getversao: Jjdom2_Element; cdecl;
    {class} function init: JElementosXMlInutilizacao; cdecl;
    {class} property ambiente: Jjdom2_Element read _Getambiente;
    {class} property cnpjEmissor: Jjdom2_Element read _GetcnpjEmissor;
    {class} property justificativa: Jjdom2_Element read _Getjustificativa;
    {class} property numeroFinal: Jjdom2_Element read _GetnumeroFinal;
    {class} property serie: Jjdom2_Element read _Getserie;
    {class} property versao: Jjdom2_Element read _Getversao;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ElementosXMlInutilizacao')]
  JElementosXMlInutilizacao = interface(JObject)
    ['{48DA118E-B580-4C25-93F8-AA5E1CBCCBA0}']
    function _Getinutilizacao: Jjdom2_Element; cdecl;
    procedure _Setinutilizacao(Value: Jjdom2_Element); cdecl;
    function _GetmodeloDocumento: Jjdom2_Element; cdecl;
    procedure _SetmodeloDocumento(Value: Jjdom2_Element); cdecl;
    function _GetnumeroInicial: Jjdom2_Element; cdecl;
    procedure _SetnumeroInicial(Value: Jjdom2_Element); cdecl;
    procedure vinculaXml; cdecl;
    property inutilizacao: Jjdom2_Element read _Getinutilizacao write _Setinutilizacao;
    property modeloDocumento: Jjdom2_Element read _GetmodeloDocumento write _SetmodeloDocumento;
    property numeroInicial: Jjdom2_Element read _GetnumeroInicial write _SetnumeroInicial;
  end;
  TJElementosXMlInutilizacao = class(TJavaGenericImport<JElementosXMlInutilizacaoClass, JElementosXMlInutilizacao>) end;

  JElementosXmlAuxiliarClass = interface(JObjectClass)
    ['{A724792D-EB19-4DF6-B653-05760329AD82}']
    {class} function _GetAC: Jjdom2_Element; cdecl;
    {class} function _GetAL: Jjdom2_Element; cdecl;
    {class} function _GetAM: Jjdom2_Element; cdecl;
    {class} function _GetAP: Jjdom2_Element; cdecl;
    {class} function _GetAVISO_SERV: Jjdom2_Element; cdecl;
    {class} function _GetAjustarValorFPgto: Jjdom2_Element; cdecl;
    {class} function _GetArredondarTruncar: Jjdom2_Element; cdecl;
    {class} function _GetAvisoContingencia: Jjdom2_Element; cdecl;
    {class} function _GetBA: Jjdom2_Element; cdecl;
    {class} function _GetCE: Jjdom2_Element; cdecl;
    {class} function _GetCEP: Jjdom2_Element; cdecl;
    {class} function _GetCEST: Jjdom2_Element; cdecl;
    {class} function _GetCFOP: Jjdom2_Element; cdecl;
    {class} function _GetCIDE: Jjdom2_Element; cdecl;
    {class} function _GetCNPJ: Jjdom2_Element; cdecl;
    {class} function _GetCNPJFab: Jjdom2_Element; cdecl;
    {class} function _GetCNPJ_Intermed: Jjdom2_Element; cdecl;
    {class} function _GetCODIF: Jjdom2_Element; cdecl;
    {class} function _GetCOFINS: Jjdom2_Element; cdecl;
    {class} procedure _SetCOFINS(Value: Jjdom2_Element); cdecl;
    {class} function _GetCOFINSALIQ: Jjdom2_Element; cdecl;
    {class} procedure _SetCOFINSALIQ(Value: Jjdom2_Element); cdecl;
    {class} function _GetCOFINSNT: Jjdom2_Element; cdecl;
    {class} procedure _SetCOFINSNT(Value: Jjdom2_Element); cdecl;
    {class} function _GetCOFINSOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetCOFINSOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetCOFINSQTDE: Jjdom2_Element; cdecl;
    {class} procedure _SetCOFINSQTDE(Value: Jjdom2_Element); cdecl;
    {class} function _GetCOFINSST: Jjdom2_Element; cdecl;
    {class} procedure _SetCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} function _GetCOMB: Jjdom2_Element; cdecl;
    {class} function _GetCPF: Jjdom2_Element; cdecl;
    {class} function _GetCRT: Jjdom2_Element; cdecl;
    {class} function _GetCSOSN102: Jjdom2_Element; cdecl;
    {class} procedure _SetCSOSN102(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSOSNSN101: Jjdom2_Element; cdecl;
    {class} procedure _SetCSOSNSN101(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSOSNSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetCSOSNSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSOSNSN202: Jjdom2_Element; cdecl;
    {class} procedure _SetCSOSNSN202(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSOSNSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetCSOSNSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSOSNSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetCSOSNSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetCST: Jjdom2_Element; cdecl;
    {class} function _GetCST10: Jjdom2_Element; cdecl;
    {class} function _GetCST20: Jjdom2_Element; cdecl;
    {class} procedure _SetCST20(Value: Jjdom2_Element); cdecl;
    {class} function _GetCST30: Jjdom2_Element; cdecl;
    {class} procedure _SetCST30(Value: Jjdom2_Element); cdecl;
    {class} function _GetCST40: Jjdom2_Element; cdecl;
    {class} procedure _SetCST40(Value: Jjdom2_Element); cdecl;
    {class} function _GetCST51: Jjdom2_Element; cdecl;
    {class} procedure _SetCST51(Value: Jjdom2_Element); cdecl;
    {class} function _GetCST60: Jjdom2_Element; cdecl;
    {class} procedure _SetCST60(Value: Jjdom2_Element); cdecl;
    {class} function _GetCST70: Jjdom2_Element; cdecl;
    {class} procedure _SetCST70(Value: Jjdom2_Element); cdecl;
    {class} function _GetCST90: Jjdom2_Element; cdecl;
    {class} procedure _SetCST90(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSTALIQ: Jjdom2_Element; cdecl;
    {class} procedure _SetCSTALIQ(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSTCOFINOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetCSTCOFINOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSTCOFINSALIQ: Jjdom2_Element; cdecl;
    {class} procedure _SetCSTCOFINSALIQ(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSTCOFINSNT: Jjdom2_Element; cdecl;
    {class} procedure _SetCSTCOFINSNT(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSTCOFINSQTDE: Jjdom2_Element; cdecl;
    {class} procedure _SetCSTCOFINSQTDE(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSTPART: Jjdom2_Element; cdecl;
    {class} procedure _SetCSTPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSTPISOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetCSTPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSTQTDE: Jjdom2_Element; cdecl;
    {class} procedure _SetCSTQTDE(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSTSNT: Jjdom2_Element; cdecl;
    {class} procedure _SetCSTSNT(Value: Jjdom2_Element); cdecl;
    {class} function _GetCSTST: Jjdom2_Element; cdecl;
    {class} procedure _SetCSTST(Value: Jjdom2_Element); cdecl;
    {class} function _GetChaveConHomoAC: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoAL: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoAM: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoAP: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoBA: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoCE: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoDF: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoES: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoGO: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoMA: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoMG: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoMS: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoMT: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoPA: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoPB: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoPE: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoPI: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoPR: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoRJ: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoRN: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoRO: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoRR: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoRS: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoSC: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoSE: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoSP: Jjdom2_Element; cdecl;
    {class} function _GetChaveConHomoTO: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdAC: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdAL: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdAM: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdAP: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdBA: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdCE: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdDF: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdES: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdGO: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdMA: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdMG: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdMS: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdMT: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdPA: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdPB: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdPE: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdPI: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdPR: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdRJ: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdRN: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdRO: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdRR: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdRS: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdSC: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdSE: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdSP: Jjdom2_Element; cdecl;
    {class} function _GetChaveConProdTO: Jjdom2_Element; cdecl;
    {class} function _GetCodImpressaoSEFAZ: Jjdom2_Element; cdecl;
    {class} function _GetColunasArquivo: Jjdom2_Element; cdecl;
    {class} function _GetDF: Jjdom2_Element; cdecl;
    {class} function _GetEMAIL: Jjdom2_Element; cdecl;
    {class} function _GetEMIT: Jjdom2_Element; cdecl;
    {class} function _GetENDEREMIT: Jjdom2_Element; cdecl;
    {class} function _GetES: Jjdom2_Element; cdecl;
    {class} function _GetEmissaoOffLine: Jjdom2_Element; cdecl;
    {class} function _GetEmpCO: Jjdom2_Element; cdecl;
    {class} function _GetEmpPK: Jjdom2_Element; cdecl;
    {class} function _GetEnderecoServidor: Jjdom2_Element; cdecl;
    {class} function _GetEstadoCFe: Jjdom2_Element; cdecl;
    {class} function _GetGO: Jjdom2_Element; cdecl;
    {class} function _GetHabilitar: Jjdom2_Element; cdecl;
    {class} function _GetHabilitarSAT: Jjdom2_Element; cdecl;
    {class} function _GetICMS: Jjdom2_Element; cdecl;
    {class} function _GetICMS00: Jjdom2_Element; cdecl;
    {class} function _GetICMS10: Jjdom2_Element; cdecl;
    {class} function _GetICMS20: Jjdom2_Element; cdecl;
    {class} function _GetICMS30: Jjdom2_Element; cdecl;
    {class} procedure _SetICMS30(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMS40: Jjdom2_Element; cdecl;
    {class} procedure _SetICMS40(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMS51: Jjdom2_Element; cdecl;
    {class} procedure _SetICMS51(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMS60: Jjdom2_Element; cdecl;
    {class} procedure _SetICMS60(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMS70: Jjdom2_Element; cdecl;
    {class} procedure _SetICMS70(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMS90: Jjdom2_Element; cdecl;
    {class} procedure _SetICMS90(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMSPART: Jjdom2_Element; cdecl;
    {class} procedure _SetICMSPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMSSN101: Jjdom2_Element; cdecl;
    {class} procedure _SetICMSSN101(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMSSN102: Jjdom2_Element; cdecl;
    {class} procedure _SetICMSSN102(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMSSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetICMSSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMSSN202: Jjdom2_Element; cdecl;
    {class} procedure _SetICMSSN202(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMSSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetICMSSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMSSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetICMSSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetICMSST: Jjdom2_Element; cdecl;
    {class} procedure _SetICMSST(Value: Jjdom2_Element); cdecl;
    {class} function _GetIDE: Jjdom2_Element; cdecl;
    {class} function _GetIE: Jjdom2_Element; cdecl;
    {class} function _GetIM: Jjdom2_Element; cdecl;
    {class} function _GetIMPOSTO: Jjdom2_Element; cdecl;
    {class} function _GetISSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetISSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetImpressaoCompleta: Jjdom2_Element; cdecl;
    {class} function _GetImprimir: Jjdom2_Element; cdecl;
    {class} function _GetLEIDOIMPOSTO: Jjdom2_Element; cdecl;
    {class} function _GetLayoutImpressao: Jjdom2_Element; cdecl;
    {class} function _GetLocalArquivoNCM: Jjdom2_Element; cdecl;
    {class} function _GetLocalArquivos: Jjdom2_Element; cdecl;
    {class} function _GetLocalLogo: Jjdom2_Element; cdecl;
    {class} function _GetMA: Jjdom2_Element; cdecl;
    {class} function _GetMED: Jjdom2_Element; cdecl;
    {class} function _GetMG: Jjdom2_Element; cdecl;
    {class} function _GetMSGPROMOCIONAL: Jjdom2_Element; cdecl;
    {class} function _GetMT: Jjdom2_Element; cdecl;
    {class} function _GetMod: Jjdom2_Element; cdecl;
    {class} function _GetModelo: Jjdom2_Element; cdecl;
    {class} function _GetMsgLeiDoImposto: Jjdom2_Element; cdecl;
    {class} function _GetNCM: Jjdom2_Element; cdecl;
    {class} function _GetNFCE: Jjdom2_Element; cdecl;
    {class} function _GetNT: Jjdom2_Element; cdecl;
    {class} function _GetNaoReenvioCont: Jjdom2_Element; cdecl;
    {class} function _GetNro: Jjdom2_Element; cdecl;
    {class} function _GetNumeracaoAutomatica: Jjdom2_Element; cdecl;
    {class} function _GetPA: Jjdom2_Element; cdecl;
    {class} function _GetPB: Jjdom2_Element; cdecl;
    {class} function _GetPE: Jjdom2_Element; cdecl;
    {class} function _GetPI: Jjdom2_Element; cdecl;
    {class} function _GetPIS: Jjdom2_Element; cdecl;
    {class} procedure _SetPIS(Value: Jjdom2_Element); cdecl;
    {class} function _GetPISALIQ: Jjdom2_Element; cdecl;
    {class} procedure _SetPISALIQ(Value: Jjdom2_Element); cdecl;
    {class} function _GetPISNT: Jjdom2_Element; cdecl;
    {class} procedure _SetPISNT(Value: Jjdom2_Element); cdecl;
    {class} function _GetPISOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetPISQTDE: Jjdom2_Element; cdecl;
    {class} procedure _SetPISQTDE(Value: Jjdom2_Element); cdecl;
    {class} function _GetPISST: Jjdom2_Element; cdecl;
    {class} procedure _SetPISST(Value: Jjdom2_Element); cdecl;
    {class} function _GetPR: Jjdom2_Element; cdecl;
    {class} function _GetPROD: Jjdom2_Element; cdecl;
    {class} function _GetPorta: Jjdom2_Element; cdecl;
    {class} function _GetQrcodeBMP: Jjdom2_Element; cdecl;
    {class} function _GetQtdLinhas: Jjdom2_Element; cdecl;
    {class} function _GetRJ: Jjdom2_Element; cdecl;
    {class} function _GetRN: Jjdom2_Element; cdecl;
    {class} function _GetRO: Jjdom2_Element; cdecl;
    {class} function _GetRR: Jjdom2_Element; cdecl;
    {class} function _GetRS: Jjdom2_Element; cdecl;
    {class} function _GetRangeCtg: Jjdom2_Element; cdecl;
    {class} function _GetSC: Jjdom2_Element; cdecl;
    {class} function _GetSE: Jjdom2_Element; cdecl;
    {class} function _GetSP: Jjdom2_Element; cdecl;
    {class} function _GetSalvarDanfePDF: Jjdom2_Element; cdecl;
    {class} function _GetSalvarXMLPDF: Jjdom2_Element; cdecl;
    {class} function _GetSenha: Jjdom2_Element; cdecl;
    {class} function _GetSeparadorArquivo: Jjdom2_Element; cdecl;
    {class} function _GetSerie: Jjdom2_Element; cdecl;
    {class} function _GetSerieContingencia: Jjdom2_Element; cdecl;
    {class} function _GetServidorSMTP: Jjdom2_Element; cdecl;
    {class} function _GetTO: Jjdom2_Element; cdecl;
    {class} function _GetTRANSP: Jjdom2_Element; cdecl;
    {class} function _GetTipoNF: Jjdom2_Element; cdecl;
    {class} function _GetTitulo: Jjdom2_Element; cdecl;
    {class} function _GetToken: Jjdom2_Element; cdecl;
    {class} function _GetUF: Jjdom2_Element; cdecl;
    {class} function _GetUFCons: Jjdom2_Element; cdecl;
    {class} function _GetUFSTPART: Jjdom2_Element; cdecl;
    {class} procedure _SetUFSTPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetURLS: Jjdom2_Element; cdecl;
    {class} function _GetValidadeServ: Jjdom2_Element; cdecl;
    {class} function _GetVersaoQRCode: Jjdom2_Element; cdecl;
    {class} function _GetcBarra: Jjdom2_Element; cdecl;
    {class} function _GetcBarraTrib: Jjdom2_Element; cdecl;
    {class} function _GetcBenef: Jjdom2_Element; cdecl;
    {class} function _GetcEAN: Jjdom2_Element; cdecl;
    {class} function _GetcEANTrib: Jjdom2_Element; cdecl;
    {class} function _GetcListServSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetcListServSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetcMun: Jjdom2_Element; cdecl;
    {class} function _GetcMunFG: Jjdom2_Element; cdecl;
    {class} function _GetcMunFgSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetcMunFgSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetcMunSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetcMunSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetcNF: Jjdom2_Element; cdecl;
    {class} function _GetcPaisSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetcPaisSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetcProdANP: Jjdom2_Element; cdecl;
    {class} function _GetcProdANVISA: Jjdom2_Element; cdecl;
    {class} function _GetcServicoSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetcServicoSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetcUF: Jjdom2_Element; cdecl;
    {class} function _GetchaveAcesso: Jjdom2_Element; cdecl;
    {class} function _GetctgNNF: Jjdom2_Element; cdecl;
    {class} function _GetctgSerie: Jjdom2_Element; cdecl;
    {class} function _GetdFab: Jjdom2_Element; cdecl;
    {class} function _GetdVal: Jjdom2_Element; cdecl;
    {class} function _Getdias: Jjdom2_Element; cdecl;
//    {class} function _Getemail: Jjdom2_Element; cdecl;
    {class} function _GetfinNfe: Jjdom2_Element; cdecl;
    {class} function _GethistoricoXML: Jjdom2_Element; cdecl;
    {class} function _GethomoAL: Jjdom2_Element; cdecl;
    {class} function _GethomoAM: Jjdom2_Element; cdecl;
    {class} function _GethomoAP: Jjdom2_Element; cdecl;
    {class} function _GethomoBA: Jjdom2_Element; cdecl;
    {class} function _GethomoCE: Jjdom2_Element; cdecl;
    {class} function _GethomoDF: Jjdom2_Element; cdecl;
    {class} function _GethomoES: Jjdom2_Element; cdecl;
    {class} function _GethomoGO: Jjdom2_Element; cdecl;
    {class} function _GethomoMA: Jjdom2_Element; cdecl;
    {class} function _GethomoMG: Jjdom2_Element; cdecl;
    {class} function _GethomoMS: Jjdom2_Element; cdecl;
    {class} function _GethomoMT: Jjdom2_Element; cdecl;
    {class} function _GethomoPA: Jjdom2_Element; cdecl;
    {class} function _GethomoPB: Jjdom2_Element; cdecl;
    {class} function _GethomoPE: Jjdom2_Element; cdecl;
    {class} function _GethomoPI: Jjdom2_Element; cdecl;
    {class} function _GethomoPR: Jjdom2_Element; cdecl;
    {class} function _GethomoRJ: Jjdom2_Element; cdecl;
    {class} function _GethomoRN: Jjdom2_Element; cdecl;
    {class} function _GethomoRO: Jjdom2_Element; cdecl;
    {class} function _GethomoRR: Jjdom2_Element; cdecl;
    {class} function _GethomoRS: Jjdom2_Element; cdecl;
    {class} function _GethomoSC: Jjdom2_Element; cdecl;
    {class} function _GethomoSE: Jjdom2_Element; cdecl;
    {class} function _GethomoSP: Jjdom2_Element; cdecl;
    {class} function _GethomoTO: Jjdom2_Element; cdecl;
    {class} function _GetidCadIntTran: Jjdom2_Element; cdecl;
    {class} function _GetidDest: Jjdom2_Element; cdecl;
    {class} function _GetidToken: Jjdom2_Element; cdecl;
    {class} function _Getimpressora: Jjdom2_Element; cdecl;
    {class} function _GetindEscala: Jjdom2_Element; cdecl;
    {class} function _GetindFinal: Jjdom2_Element; cdecl;
    {class} function _GetindISSSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetindISSSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetindIncentivoSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetindIncentivoSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetindIntermed: Jjdom2_Element; cdecl;
    {class} function _GetindPag: Jjdom2_Element; cdecl;
    {class} function _GetindPres: Jjdom2_Element; cdecl;
    {class} function _GetindTot: Jjdom2_Element; cdecl;
    {class} function _GetinfIntermed: Jjdom2_Element; cdecl;
    {class} function _GetinfRespTec: Jjdom2_Element; cdecl;
    {class} function _GetirtCNPJ: Jjdom2_Element; cdecl;
    {class} function _GetirtCSRT: Jjdom2_Element; cdecl;
    {class} function _GetirtFone: Jjdom2_Element; cdecl;
    {class} function _Getirtemail: Jjdom2_Element; cdecl;
    {class} function _GetirtidCSRT: Jjdom2_Element; cdecl;
    {class} function _GetirtxContato: Jjdom2_Element; cdecl;
    {class} function _GetmodBC: Jjdom2_Element; cdecl;
    {class} function _GetmodBC10: Jjdom2_Element; cdecl;
    {class} function _GetmodBC20: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBC20(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBC51: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBC51(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBC70: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBC70(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBC90: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBC90(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBCPART: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBCPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBCSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBCSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBCST10: Jjdom2_Element; cdecl;
    {class} function _GetmodBCST30: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBCST30(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBCST70: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBCST70(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBCST90: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBCST90(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBCSTPART: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBCSTPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBCSTSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBCSTSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBCSTSN202: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBCSTSN202(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodBCSTSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetmodBCSTSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetmodFrete: Jjdom2_Element; cdecl;
    {class} function _GetmotDesICMS20: Jjdom2_Element; cdecl;
    {class} procedure _SetmotDesICMS20(Value: Jjdom2_Element); cdecl;
    {class} function _GetmotDesICMS30: Jjdom2_Element; cdecl;
    {class} procedure _SetmotDesICMS30(Value: Jjdom2_Element); cdecl;
    {class} function _GetmotDesICMS40: Jjdom2_Element; cdecl;
    {class} procedure _SetmotDesICMS40(Value: Jjdom2_Element); cdecl;
    {class} function _GetmotDesICMS70: Jjdom2_Element; cdecl;
    {class} procedure _SetmotDesICMS70(Value: Jjdom2_Element); cdecl;
    {class} function _GetmotDesICMS90: Jjdom2_Element; cdecl;
    {class} procedure _SetmotDesICMS90(Value: Jjdom2_Element); cdecl;
    {class} function _GetnLote: Jjdom2_Element; cdecl;
    {class} function _GetnNF: Jjdom2_Element; cdecl;
    {class} function _GetnProcessoSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetnProcessoSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetnatOP: Jjdom2_Element; cdecl;
    {class} function _Getorig: Jjdom2_Element; cdecl;
    {class} function _Getorig10: Jjdom2_Element; cdecl;
    {class} function _Getorig20: Jjdom2_Element; cdecl;
    {class} procedure _Setorig20(Value: Jjdom2_Element); cdecl;
    {class} function _Getorig202: Jjdom2_Element; cdecl;
    {class} procedure _Setorig202(Value: Jjdom2_Element); cdecl;
    {class} function _Getorig30: Jjdom2_Element; cdecl;
    {class} procedure _Setorig30(Value: Jjdom2_Element); cdecl;
    {class} function _Getorig40: Jjdom2_Element; cdecl;
    {class} procedure _Setorig40(Value: Jjdom2_Element); cdecl;
    {class} function _Getorig51: Jjdom2_Element; cdecl;
    {class} procedure _Setorig51(Value: Jjdom2_Element); cdecl;
    {class} function _Getorig60: Jjdom2_Element; cdecl;
    {class} procedure _Setorig60(Value: Jjdom2_Element); cdecl;
    {class} function _Getorig70: Jjdom2_Element; cdecl;
    {class} procedure _Setorig70(Value: Jjdom2_Element); cdecl;
    {class} function _Getorig90: Jjdom2_Element; cdecl;
    {class} procedure _Setorig90(Value: Jjdom2_Element); cdecl;
    {class} function _GetorigPART: Jjdom2_Element; cdecl;
    {class} procedure _SetorigPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetorigSN101: Jjdom2_Element; cdecl;
    {class} procedure _SetorigSN101(Value: Jjdom2_Element); cdecl;
    {class} function _GetorigSN102: Jjdom2_Element; cdecl;
    {class} procedure _SetorigSN102(Value: Jjdom2_Element); cdecl;
    {class} function _GetorigSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetorigSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetorigSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetorigSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetorigSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetorigSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetorigST: Jjdom2_Element; cdecl;
    {class} procedure _SetorigST(Value: Jjdom2_Element); cdecl;
    {class} function _GetpBCOpPART: Jjdom2_Element; cdecl;
    {class} procedure _SetpBCOpPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetpCOFINSCOFINSALIQ: Jjdom2_Element; cdecl;
    {class} procedure _SetpCOFINSCOFINSALIQ(Value: Jjdom2_Element); cdecl;
    {class} function _GetpCOFINSCOFINSOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetpCOFINSCOFINSOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetpCOFINSCOFINSST: Jjdom2_Element; cdecl;
    {class} procedure _SetpCOFINSCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} function _GetpCredSNSN101: Jjdom2_Element; cdecl;
    {class} procedure _SetpCredSNSN101(Value: Jjdom2_Element); cdecl;
    {class} function _GetpCredSNSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetpCredSNSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetpCredSNSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetpCredSNSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetpDif51: Jjdom2_Element; cdecl;
    {class} procedure _SetpDif51(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCP: Jjdom2_Element; cdecl;
    {class} function _GetpFCP10: Jjdom2_Element; cdecl;
    {class} function _GetpFCP20: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCP20(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCP51: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCP51(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCP70: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCP70(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCP90: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCP90(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCPST10: Jjdom2_Element; cdecl;
    {class} function _GetpFCPST30: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCPST30(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCPST70: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCPST70(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCPST90: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCPST90(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCPSTRet60: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCPSTRet60(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCPSTRetSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCPSTRetSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCPSTSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCPSTSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCPSTSN202: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCPSTSN202(Value: Jjdom2_Element); cdecl;
    {class} function _GetpFCPSTSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetpFCPSTSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetpGLP: Jjdom2_Element; cdecl;
    {class} function _GetpGNi: Jjdom2_Element; cdecl;
    {class} function _GetpGNn: Jjdom2_Element; cdecl;
    {class} function _GetpICMS: Jjdom2_Element; cdecl;
    {class} function _GetpICMS10: Jjdom2_Element; cdecl;
    {class} function _GetpICMS20: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMS20(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMS51: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMS51(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMS70: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMS70(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMS90: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMS90(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMSEfet60: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMSEfet60(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMSEfetSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMSEfetSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMSPART: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMSPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMSSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMSSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMSST10: Jjdom2_Element; cdecl;
    {class} function _GetpICMSST30: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMSST30(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMSST70: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMSST70(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMSST90: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMSST90(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMSSTPART: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMSSTPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMSSTSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMSSTSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMSSTSN202: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMSSTSN202(Value: Jjdom2_Element); cdecl;
    {class} function _GetpICMSSTSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetpICMSSTSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetpMVAST10: Jjdom2_Element; cdecl;
    {class} function _GetpMVAST30: Jjdom2_Element; cdecl;
    {class} procedure _SetpMVAST30(Value: Jjdom2_Element); cdecl;
    {class} function _GetpMVAST70: Jjdom2_Element; cdecl;
    {class} procedure _SetpMVAST70(Value: Jjdom2_Element); cdecl;
    {class} function _GetpMVAST90: Jjdom2_Element; cdecl;
    {class} procedure _SetpMVAST90(Value: Jjdom2_Element); cdecl;
    {class} function _GetpMVASTPART: Jjdom2_Element; cdecl;
    {class} procedure _SetpMVASTPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetpMVASTSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetpMVASTSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetpMVASTSN202: Jjdom2_Element; cdecl;
    {class} procedure _SetpMVASTSN202(Value: Jjdom2_Element); cdecl;
    {class} function _GetpMVASTSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetpMVASTSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetpPISALIQ: Jjdom2_Element; cdecl;
    {class} procedure _SetpPISALIQ(Value: Jjdom2_Element); cdecl;
    {class} function _GetpPISPISOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetpPISPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetpPISPISST: Jjdom2_Element; cdecl;
    {class} procedure _SetpPISPISST(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBC20: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBC20(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBC51: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBC51(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBC70: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBC70(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBC90: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBC90(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBCEfet60: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBCEfet60(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBCEfetSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBCEfetSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBCPART: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBCPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBCSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBCSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBCST10: Jjdom2_Element; cdecl;
    {class} function _GetpRedBCST30: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBCST30(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBCST70: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBCST70(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBCST90: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBCST90(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBCSTPART: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBCSTPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBCSTSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBCSTSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBCSTSN202: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBCSTSN202(Value: Jjdom2_Element); cdecl;
    {class} function _GetpRedBCSTSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetpRedBCSTSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetpST60: Jjdom2_Element; cdecl;
    {class} procedure _SetpST60(Value: Jjdom2_Element); cdecl;
    {class} function _GetpSTSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetpSTSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetprodAC: Jjdom2_Element; cdecl;
    {class} function _GetprodAL: Jjdom2_Element; cdecl;
    {class} function _GetprodAP: Jjdom2_Element; cdecl;
    {class} function _GetprodBA: Jjdom2_Element; cdecl;
    {class} function _GetprodCE: Jjdom2_Element; cdecl;
    {class} function _GetprodDF: Jjdom2_Element; cdecl;
    {class} function _GetprodES: Jjdom2_Element; cdecl;
    {class} function _GetprodGO: Jjdom2_Element; cdecl;
    {class} function _GetprodMA: Jjdom2_Element; cdecl;
    {class} function _GetprodMG: Jjdom2_Element; cdecl;
    {class} function _GetprodMS: Jjdom2_Element; cdecl;
    {class} function _GetprodMT: Jjdom2_Element; cdecl;
    {class} function _GetprodPA: Jjdom2_Element; cdecl;
    {class} function _GetprodPB: Jjdom2_Element; cdecl;
    {class} function _GetprodPE: Jjdom2_Element; cdecl;
    {class} function _GetprodPI: Jjdom2_Element; cdecl;
    {class} function _GetprodPR: Jjdom2_Element; cdecl;
    {class} function _GetprodRJ: Jjdom2_Element; cdecl;
    {class} function _GetprodRN: Jjdom2_Element; cdecl;
    {class} function _GetprodRO: Jjdom2_Element; cdecl;
    {class} function _GetprodRS: Jjdom2_Element; cdecl;
    {class} function _GetprodSC: Jjdom2_Element; cdecl;
    {class} function _GetprodSE: Jjdom2_Element; cdecl;
    {class} function _GetprodSP: Jjdom2_Element; cdecl;
    {class} function _GetprodTO: Jjdom2_Element; cdecl;
    {class} function _Getprotocolo: Jjdom2_Element; cdecl;
    {class} function _GetqBCProd: Jjdom2_Element; cdecl;
    {class} function _GetqBCProdCOFINSOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetqBCProdCOFINSOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetqBCProdCOFINSQTDE: Jjdom2_Element; cdecl;
    {class} procedure _SetqBCProdCOFINSQTDE(Value: Jjdom2_Element); cdecl;
    {class} function _GetqBCProdCOFINSST: Jjdom2_Element; cdecl;
    {class} procedure _SetqBCProdCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} function _GetqBCProdPISOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetqBCProdPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetqBCProdPISST: Jjdom2_Element; cdecl;
    {class} procedure _SetqBCProdPISST(Value: Jjdom2_Element); cdecl;
    {class} function _GetqBCProdQTDE: Jjdom2_Element; cdecl;
    {class} procedure _SetqBCProdQTDE(Value: Jjdom2_Element); cdecl;
    {class} function _GetqLote: Jjdom2_Element; cdecl;
    {class} function _GetqTemp: Jjdom2_Element; cdecl;
    {class} function _GettpEmis: Jjdom2_Element; cdecl;
    {class} function _GettpImp: Jjdom2_Element; cdecl;
    {class} function _GettpNF: Jjdom2_Element; cdecl;
    {class} function _GettrocoNFCe: Jjdom2_Element; cdecl;
    {class} function _GetvAliqProd: Jjdom2_Element; cdecl;
    {class} function _GetvAliqProdCOFINSOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetvAliqProdCOFINSOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetvAliqProdCOFINSST: Jjdom2_Element; cdecl;
    {class} procedure _SetvAliqProdCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} function _GetvAliqProdCONFISQTDE: Jjdom2_Element; cdecl;
    {class} procedure _SetvAliqProdCONFISQTDE(Value: Jjdom2_Element); cdecl;
    {class} function _GetvAliqProdPISOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetvAliqProdPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetvAliqProdPISST: Jjdom2_Element; cdecl;
    {class} procedure _SetvAliqProdPISST(Value: Jjdom2_Element); cdecl;
    {class} function _GetvAliqProdQTDE: Jjdom2_Element; cdecl;
    {class} procedure _SetvAliqProdQTDE(Value: Jjdom2_Element); cdecl;
    {class} function _GetvAliqSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetvAliqSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBC: Jjdom2_Element; cdecl;
    {class} function _GetvBC10: Jjdom2_Element; cdecl;
    {class} function _GetvBC20: Jjdom2_Element; cdecl;
    {class} procedure _SetvBC20(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBC51: Jjdom2_Element; cdecl;
    {class} procedure _SetvBC51(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBC70: Jjdom2_Element; cdecl;
    {class} procedure _SetvBC70(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBC90: Jjdom2_Element; cdecl;
    {class} procedure _SetvBC90(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCALIQ: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCALIQ(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCCOFINOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCCOFINOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCCOFINSALIQ: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCCOFINSALIQ(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCCOFINSST: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCEfet60: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCEfet60(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCEfetSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCEfetSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCP10: Jjdom2_Element; cdecl;
    {class} function _GetvBCFCP20: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCP20(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCP51: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCP51(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCP70: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCP70(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCP90: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCP90(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCPST10: Jjdom2_Element; cdecl;
    {class} function _GetvBCFCPST30: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCPST30(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCPST70: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCPST70(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCPST90: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCPST90(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCPSTRet60: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCPSTRet60(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCPSTRetSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCPSTRetSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCPSTSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCPSTSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCPSTSN202: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCPSTSN202(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCFCPSTSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCFCPSTSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCPART: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCPISOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCPISST: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCPISST(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCST10: Jjdom2_Element; cdecl;
    {class} function _GetvBCST30: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCST30(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCST70: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCST70(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCST90: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCST90(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCSTDestST: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCSTDestST(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCSTPART: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCSTPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCSTRet60: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCSTRet60(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCSTRetSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCSTRetSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCSTRetST: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCSTRetST(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCSTSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCSTSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCSTSN202: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCSTSN202(Value: Jjdom2_Element); cdecl;
    {class} function _GetvBCSTSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetvBCSTSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetvCIDE: Jjdom2_Element; cdecl;
    {class} function _GetvCOFINSCOFINSALIQ: Jjdom2_Element; cdecl;
    {class} procedure _SetvCOFINSCOFINSALIQ(Value: Jjdom2_Element); cdecl;
    {class} function _GetvCOFINSCOFINSQTDE: Jjdom2_Element; cdecl;
    {class} procedure _SetvCOFINSCOFINSQTDE(Value: Jjdom2_Element); cdecl;
    {class} function _GetvCOFINSCOFINSST: Jjdom2_Element; cdecl;
    {class} procedure _SetvCOFINSCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} function _GetvCONFISCONFISOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetvCONFISCONFISOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetvCredICMSSNSN101: Jjdom2_Element; cdecl;
    {class} procedure _SetvCredICMSSNSN101(Value: Jjdom2_Element); cdecl;
    {class} function _GetvCredICMSSNSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetvCredICMSSNSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetvCredICMSSNSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetvCredICMSSNSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetvDeducaoSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetvDeducaoSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetvDescCondSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetvDescCondSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetvDescIncondSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetvDescIncondSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetvFCP: Jjdom2_Element; cdecl;
    {class} function _GetvFCP10: Jjdom2_Element; cdecl;
    {class} function _GetvFCP20: Jjdom2_Element; cdecl;
    {class} procedure _SetvFCP20(Value: Jjdom2_Element); cdecl;
    {class} function _GetvFCP51: Jjdom2_Element; cdecl;
    {class} procedure _SetvFCP51(Value: Jjdom2_Element); cdecl;
    {class} function _GetvFCP70: Jjdom2_Element; cdecl;
    {class} procedure _SetvFCP70(Value: Jjdom2_Element); cdecl;
    {class} function _GetvFCP90: Jjdom2_Element; cdecl;
    {class} procedure _SetvFCP90(Value: Jjdom2_Element); cdecl;
    {class} function _GetvFCPST10: Jjdom2_Element; cdecl;
    {class} function _GetvFCPST30: Jjdom2_Element; cdecl;
    {class} procedure _SetvFCPST30(Value: Jjdom2_Element); cdecl;
    {class} function _GetvFCPST90: Jjdom2_Element; cdecl;
    {class} procedure _SetvFCPST90(Value: Jjdom2_Element); cdecl;
    {class} function _GetvFCPSTRet60: Jjdom2_Element; cdecl;
    {class} procedure _SetvFCPSTRet60(Value: Jjdom2_Element); cdecl;
    {class} function _GetvFCPSTRetSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetvFCPSTRetSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetvFCPSTSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetvFCPSTSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetvFCPSTSN202: Jjdom2_Element; cdecl;
    {class} procedure _SetvFCPSTSN202(Value: Jjdom2_Element); cdecl;
    {class} function _GetvFCPSTSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetvFCPSTSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMS: Jjdom2_Element; cdecl;
    {class} function _GetvICMS10: Jjdom2_Element; cdecl;
    {class} function _GetvICMS20: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMS20(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMS51: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMS51(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMS70: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMS70(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMS90: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMS90(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSDeson20: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSDeson20(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSDeson30: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSDeson30(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSDeson40: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSDeson40(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSDeson70: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSDeson70(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSDeson90: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSDeson90(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSDif: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSDif(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSEfet60: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSEfet60(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSEfetSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSEfetSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSOp51: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSOp51(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSPART: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSST10: Jjdom2_Element; cdecl;
    {class} function _GetvICMSST30: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSST30(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSST70: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSST70(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSST90: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSST90(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSSTDestST: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSSTDestST(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSSTPART: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSSTPART(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSSTRet60: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSSTRet60(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSSTRetSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSSTRetSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSSTRetST: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSSTRetST(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSSTSN201: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSSTSN201(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSSTSN202: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSSTSN202(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSSTSN900: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSSTSN900(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSSubstituto60: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSSubstituto60(Value: Jjdom2_Element); cdecl;
    {class} function _GetvICMSSubstitutoSN500: Jjdom2_Element; cdecl;
    {class} procedure _SetvICMSSubstitutoSN500(Value: Jjdom2_Element); cdecl;
    {class} function _GetvISSQNSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetvISSQNSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetvISSRetSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetvISSRetSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetvOutroSQN: Jjdom2_Element; cdecl;
    {class} procedure _SetvOutroSQN(Value: Jjdom2_Element); cdecl;
    {class} function _GetvPISALIQ: Jjdom2_Element; cdecl;
    {class} procedure _SetvPISALIQ(Value: Jjdom2_Element); cdecl;
    {class} function _GetvPISPISOUTR: Jjdom2_Element; cdecl;
    {class} procedure _SetvPISPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} function _GetvPISPISST: Jjdom2_Element; cdecl;
    {class} procedure _SetvPISPISST(Value: Jjdom2_Element); cdecl;
    {class} function _GetvPISQTDE: Jjdom2_Element; cdecl;
    {class} procedure _SetvPISQTDE(Value: Jjdom2_Element); cdecl;
    {class} function _GetvPMC: Jjdom2_Element; cdecl;
    {class} function _GetvPart: Jjdom2_Element; cdecl;
    {class} function _GetverProc: Jjdom2_Element; cdecl;
    {class} function _GetversaoNT: Jjdom2_Element; cdecl;
    {class} function _GetxBairro: Jjdom2_Element; cdecl;
    {class} function _GetxJust: Jjdom2_Element; cdecl;
    {class} function _GetxLgr: Jjdom2_Element; cdecl;
    {class} function _GetxMun: Jjdom2_Element; cdecl;
    {class} function _GetxNome: Jjdom2_Element; cdecl;
    {class} function init: JElementosXmlAuxiliar; cdecl;//Deprecated
    {class} property AC: Jjdom2_Element read _GetAC;
    {class} property AL: Jjdom2_Element read _GetAL;
    {class} property AM: Jjdom2_Element read _GetAM;
    {class} property AP: Jjdom2_Element read _GetAP;
    {class} property AVISO_SERV: Jjdom2_Element read _GetAVISO_SERV;
    {class} property AjustarValorFPgto: Jjdom2_Element read _GetAjustarValorFPgto;
    {class} property ArredondarTruncar: Jjdom2_Element read _GetArredondarTruncar;
    {class} property AvisoContingencia: Jjdom2_Element read _GetAvisoContingencia;
    {class} property BA: Jjdom2_Element read _GetBA;
    {class} property CE: Jjdom2_Element read _GetCE;
    {class} property CEP: Jjdom2_Element read _GetCEP;
    {class} property CEST: Jjdom2_Element read _GetCEST;
    {class} property CFOP: Jjdom2_Element read _GetCFOP;
    {class} property CIDE: Jjdom2_Element read _GetCIDE;
    {class} property CNPJ: Jjdom2_Element read _GetCNPJ;
    {class} property CNPJFab: Jjdom2_Element read _GetCNPJFab;
    {class} property CNPJ_Intermed: Jjdom2_Element read _GetCNPJ_Intermed;
    {class} property CODIF: Jjdom2_Element read _GetCODIF;
    {class} property COFINS: Jjdom2_Element read _GetCOFINS write _SetCOFINS;
    {class} property COFINSALIQ: Jjdom2_Element read _GetCOFINSALIQ write _SetCOFINSALIQ;
    {class} property COFINSNT: Jjdom2_Element read _GetCOFINSNT write _SetCOFINSNT;
    {class} property COFINSOUTR: Jjdom2_Element read _GetCOFINSOUTR write _SetCOFINSOUTR;
    {class} property COFINSQTDE: Jjdom2_Element read _GetCOFINSQTDE write _SetCOFINSQTDE;
    {class} property COFINSST: Jjdom2_Element read _GetCOFINSST write _SetCOFINSST;
    {class} property COMB: Jjdom2_Element read _GetCOMB;
    {class} property CPF: Jjdom2_Element read _GetCPF;
    {class} property CRT: Jjdom2_Element read _GetCRT;
    {class} property CSOSN102: Jjdom2_Element read _GetCSOSN102 write _SetCSOSN102;
    {class} property CSOSNSN101: Jjdom2_Element read _GetCSOSNSN101 write _SetCSOSNSN101;
    {class} property CSOSNSN201: Jjdom2_Element read _GetCSOSNSN201 write _SetCSOSNSN201;
    {class} property CSOSNSN202: Jjdom2_Element read _GetCSOSNSN202 write _SetCSOSNSN202;
    {class} property CSOSNSN500: Jjdom2_Element read _GetCSOSNSN500 write _SetCSOSNSN500;
    {class} property CSOSNSN900: Jjdom2_Element read _GetCSOSNSN900 write _SetCSOSNSN900;
    {class} property CST: Jjdom2_Element read _GetCST;
    {class} property CST10: Jjdom2_Element read _GetCST10;
    {class} property CST20: Jjdom2_Element read _GetCST20 write _SetCST20;
    {class} property CST30: Jjdom2_Element read _GetCST30 write _SetCST30;
    {class} property CST40: Jjdom2_Element read _GetCST40 write _SetCST40;
    {class} property CST51: Jjdom2_Element read _GetCST51 write _SetCST51;
    {class} property CST60: Jjdom2_Element read _GetCST60 write _SetCST60;
    {class} property CST70: Jjdom2_Element read _GetCST70 write _SetCST70;
    {class} property CST90: Jjdom2_Element read _GetCST90 write _SetCST90;
    {class} property CSTALIQ: Jjdom2_Element read _GetCSTALIQ write _SetCSTALIQ;
    {class} property CSTCOFINOUTR: Jjdom2_Element read _GetCSTCOFINOUTR write _SetCSTCOFINOUTR;
    {class} property CSTCOFINSALIQ: Jjdom2_Element read _GetCSTCOFINSALIQ write _SetCSTCOFINSALIQ;
    {class} property CSTCOFINSNT: Jjdom2_Element read _GetCSTCOFINSNT write _SetCSTCOFINSNT;
    {class} property CSTCOFINSQTDE: Jjdom2_Element read _GetCSTCOFINSQTDE write _SetCSTCOFINSQTDE;
    {class} property CSTPART: Jjdom2_Element read _GetCSTPART write _SetCSTPART;
    {class} property CSTPISOUTR: Jjdom2_Element read _GetCSTPISOUTR write _SetCSTPISOUTR;
    {class} property CSTQTDE: Jjdom2_Element read _GetCSTQTDE write _SetCSTQTDE;
    {class} property CSTSNT: Jjdom2_Element read _GetCSTSNT write _SetCSTSNT;
    {class} property CSTST: Jjdom2_Element read _GetCSTST write _SetCSTST;
    {class} property ChaveConHomoAC: Jjdom2_Element read _GetChaveConHomoAC;
    {class} property ChaveConHomoAL: Jjdom2_Element read _GetChaveConHomoAL;
    {class} property ChaveConHomoAM: Jjdom2_Element read _GetChaveConHomoAM;
    {class} property ChaveConHomoAP: Jjdom2_Element read _GetChaveConHomoAP;
    {class} property ChaveConHomoBA: Jjdom2_Element read _GetChaveConHomoBA;
    {class} property ChaveConHomoCE: Jjdom2_Element read _GetChaveConHomoCE;
    {class} property ChaveConHomoDF: Jjdom2_Element read _GetChaveConHomoDF;
    {class} property ChaveConHomoES: Jjdom2_Element read _GetChaveConHomoES;
    {class} property ChaveConHomoGO: Jjdom2_Element read _GetChaveConHomoGO;
    {class} property ChaveConHomoMA: Jjdom2_Element read _GetChaveConHomoMA;
    {class} property ChaveConHomoMG: Jjdom2_Element read _GetChaveConHomoMG;
    {class} property ChaveConHomoMS: Jjdom2_Element read _GetChaveConHomoMS;
    {class} property ChaveConHomoMT: Jjdom2_Element read _GetChaveConHomoMT;
    {class} property ChaveConHomoPA: Jjdom2_Element read _GetChaveConHomoPA;
    {class} property ChaveConHomoPB: Jjdom2_Element read _GetChaveConHomoPB;
    {class} property ChaveConHomoPE: Jjdom2_Element read _GetChaveConHomoPE;
    {class} property ChaveConHomoPI: Jjdom2_Element read _GetChaveConHomoPI;
    {class} property ChaveConHomoPR: Jjdom2_Element read _GetChaveConHomoPR;
    {class} property ChaveConHomoRJ: Jjdom2_Element read _GetChaveConHomoRJ;
    {class} property ChaveConHomoRN: Jjdom2_Element read _GetChaveConHomoRN;
    {class} property ChaveConHomoRO: Jjdom2_Element read _GetChaveConHomoRO;
    {class} property ChaveConHomoRR: Jjdom2_Element read _GetChaveConHomoRR;
    {class} property ChaveConHomoRS: Jjdom2_Element read _GetChaveConHomoRS;
    {class} property ChaveConHomoSC: Jjdom2_Element read _GetChaveConHomoSC;
    {class} property ChaveConHomoSE: Jjdom2_Element read _GetChaveConHomoSE;
    {class} property ChaveConHomoSP: Jjdom2_Element read _GetChaveConHomoSP;
    {class} property ChaveConHomoTO: Jjdom2_Element read _GetChaveConHomoTO;
    {class} property ChaveConProdAC: Jjdom2_Element read _GetChaveConProdAC;
    {class} property ChaveConProdAL: Jjdom2_Element read _GetChaveConProdAL;
    {class} property ChaveConProdAM: Jjdom2_Element read _GetChaveConProdAM;
    {class} property ChaveConProdAP: Jjdom2_Element read _GetChaveConProdAP;
    {class} property ChaveConProdBA: Jjdom2_Element read _GetChaveConProdBA;
    {class} property ChaveConProdCE: Jjdom2_Element read _GetChaveConProdCE;
    {class} property ChaveConProdDF: Jjdom2_Element read _GetChaveConProdDF;
    {class} property ChaveConProdES: Jjdom2_Element read _GetChaveConProdES;
    {class} property ChaveConProdGO: Jjdom2_Element read _GetChaveConProdGO;
    {class} property ChaveConProdMA: Jjdom2_Element read _GetChaveConProdMA;
    {class} property ChaveConProdMG: Jjdom2_Element read _GetChaveConProdMG;
    {class} property ChaveConProdMS: Jjdom2_Element read _GetChaveConProdMS;
    {class} property ChaveConProdMT: Jjdom2_Element read _GetChaveConProdMT;
    {class} property ChaveConProdPA: Jjdom2_Element read _GetChaveConProdPA;
    {class} property ChaveConProdPB: Jjdom2_Element read _GetChaveConProdPB;
    {class} property ChaveConProdPE: Jjdom2_Element read _GetChaveConProdPE;
    {class} property ChaveConProdPI: Jjdom2_Element read _GetChaveConProdPI;
    {class} property ChaveConProdPR: Jjdom2_Element read _GetChaveConProdPR;
    {class} property ChaveConProdRJ: Jjdom2_Element read _GetChaveConProdRJ;
    {class} property ChaveConProdRN: Jjdom2_Element read _GetChaveConProdRN;
    {class} property ChaveConProdRO: Jjdom2_Element read _GetChaveConProdRO;
    {class} property ChaveConProdRR: Jjdom2_Element read _GetChaveConProdRR;
    {class} property ChaveConProdRS: Jjdom2_Element read _GetChaveConProdRS;
    {class} property ChaveConProdSC: Jjdom2_Element read _GetChaveConProdSC;
    {class} property ChaveConProdSE: Jjdom2_Element read _GetChaveConProdSE;
    {class} property ChaveConProdSP: Jjdom2_Element read _GetChaveConProdSP;
    {class} property ChaveConProdTO: Jjdom2_Element read _GetChaveConProdTO;
    {class} property CodImpressaoSEFAZ: Jjdom2_Element read _GetCodImpressaoSEFAZ;
    {class} property ColunasArquivo: Jjdom2_Element read _GetColunasArquivo;
    {class} property DF: Jjdom2_Element read _GetDF;
    {class} property EMAIL: Jjdom2_Element read _GetEMAIL;
    {class} property EMIT: Jjdom2_Element read _GetEMIT;
    {class} property ENDEREMIT: Jjdom2_Element read _GetENDEREMIT;
    {class} property ES: Jjdom2_Element read _GetES;
    {class} property EmissaoOffLine: Jjdom2_Element read _GetEmissaoOffLine;
    {class} property EmpCO: Jjdom2_Element read _GetEmpCO;
    {class} property EmpPK: Jjdom2_Element read _GetEmpPK;
    {class} property EnderecoServidor: Jjdom2_Element read _GetEnderecoServidor;
    {class} property EstadoCFe: Jjdom2_Element read _GetEstadoCFe;
    {class} property GO: Jjdom2_Element read _GetGO;
    {class} property Habilitar: Jjdom2_Element read _GetHabilitar;
    {class} property HabilitarSAT: Jjdom2_Element read _GetHabilitarSAT;
    {class} property ICMS: Jjdom2_Element read _GetICMS;
    {class} property ICMS00: Jjdom2_Element read _GetICMS00;
    {class} property ICMS10: Jjdom2_Element read _GetICMS10;
    {class} property ICMS20: Jjdom2_Element read _GetICMS20;
    {class} property ICMS30: Jjdom2_Element read _GetICMS30 write _SetICMS30;
    {class} property ICMS40: Jjdom2_Element read _GetICMS40 write _SetICMS40;
    {class} property ICMS51: Jjdom2_Element read _GetICMS51 write _SetICMS51;
    {class} property ICMS60: Jjdom2_Element read _GetICMS60 write _SetICMS60;
    {class} property ICMS70: Jjdom2_Element read _GetICMS70 write _SetICMS70;
    {class} property ICMS90: Jjdom2_Element read _GetICMS90 write _SetICMS90;
    {class} property ICMSPART: Jjdom2_Element read _GetICMSPART write _SetICMSPART;
    {class} property ICMSSN101: Jjdom2_Element read _GetICMSSN101 write _SetICMSSN101;
    {class} property ICMSSN102: Jjdom2_Element read _GetICMSSN102 write _SetICMSSN102;
    {class} property ICMSSN201: Jjdom2_Element read _GetICMSSN201 write _SetICMSSN201;
    {class} property ICMSSN202: Jjdom2_Element read _GetICMSSN202 write _SetICMSSN202;
    {class} property ICMSSN500: Jjdom2_Element read _GetICMSSN500 write _SetICMSSN500;
    {class} property ICMSSN900: Jjdom2_Element read _GetICMSSN900 write _SetICMSSN900;
    {class} property ICMSST: Jjdom2_Element read _GetICMSST write _SetICMSST;
    {class} property IDE: Jjdom2_Element read _GetIDE;
    {class} property IE: Jjdom2_Element read _GetIE;
    {class} property IM: Jjdom2_Element read _GetIM;
    {class} property IMPOSTO: Jjdom2_Element read _GetIMPOSTO;
    {class} property ISSQN: Jjdom2_Element read _GetISSQN write _SetISSQN;
    {class} property ImpressaoCompleta: Jjdom2_Element read _GetImpressaoCompleta;
    {class} property Imprimir: Jjdom2_Element read _GetImprimir;
    {class} property LEIDOIMPOSTO: Jjdom2_Element read _GetLEIDOIMPOSTO;
    {class} property LayoutImpressao: Jjdom2_Element read _GetLayoutImpressao;
    {class} property LocalArquivoNCM: Jjdom2_Element read _GetLocalArquivoNCM;
    {class} property LocalArquivos: Jjdom2_Element read _GetLocalArquivos;
    {class} property LocalLogo: Jjdom2_Element read _GetLocalLogo;
    {class} property MA: Jjdom2_Element read _GetMA;
    {class} property MED: Jjdom2_Element read _GetMED;
    {class} property MG: Jjdom2_Element read _GetMG;
    {class} property MSGPROMOCIONAL: Jjdom2_Element read _GetMSGPROMOCIONAL;
    {class} property MT: Jjdom2_Element read _GetMT;
    {class} property &Mod: Jjdom2_Element read _GetMod;
    {class} property Modelo: Jjdom2_Element read _GetModelo;
    {class} property MsgLeiDoImposto: Jjdom2_Element read _GetMsgLeiDoImposto;
    {class} property NCM: Jjdom2_Element read _GetNCM;
    {class} property NFCE: Jjdom2_Element read _GetNFCE;
    {class} property NT: Jjdom2_Element read _GetNT;
    {class} property NaoReenvioCont: Jjdom2_Element read _GetNaoReenvioCont;
    {class} property Nro: Jjdom2_Element read _GetNro;
    {class} property NumeracaoAutomatica: Jjdom2_Element read _GetNumeracaoAutomatica;
    {class} property PA: Jjdom2_Element read _GetPA;
    {class} property PB: Jjdom2_Element read _GetPB;
    {class} property PE: Jjdom2_Element read _GetPE;
    {class} property PI: Jjdom2_Element read _GetPI;
    {class} property PIS: Jjdom2_Element read _GetPIS write _SetPIS;
    {class} property PISALIQ: Jjdom2_Element read _GetPISALIQ write _SetPISALIQ;
    {class} property PISNT: Jjdom2_Element read _GetPISNT write _SetPISNT;
    {class} property PISOUTR: Jjdom2_Element read _GetPISOUTR write _SetPISOUTR;
    {class} property PISQTDE: Jjdom2_Element read _GetPISQTDE write _SetPISQTDE;
    {class} property PISST: Jjdom2_Element read _GetPISST write _SetPISST;
    {class} property PR: Jjdom2_Element read _GetPR;
    {class} property PROD: Jjdom2_Element read _GetPROD;
    {class} property Porta: Jjdom2_Element read _GetPorta;
    {class} property QrcodeBMP: Jjdom2_Element read _GetQrcodeBMP;
    {class} property QtdLinhas: Jjdom2_Element read _GetQtdLinhas;
    {class} property RJ: Jjdom2_Element read _GetRJ;
    {class} property RN: Jjdom2_Element read _GetRN;
    {class} property RO: Jjdom2_Element read _GetRO;
    {class} property RR: Jjdom2_Element read _GetRR;
    {class} property RS: Jjdom2_Element read _GetRS;
    {class} property RangeCtg: Jjdom2_Element read _GetRangeCtg;
    {class} property SC: Jjdom2_Element read _GetSC;
    {class} property SE: Jjdom2_Element read _GetSE;
    {class} property SP: Jjdom2_Element read _GetSP;
    {class} property SalvarDanfePDF: Jjdom2_Element read _GetSalvarDanfePDF;
    {class} property SalvarXMLPDF: Jjdom2_Element read _GetSalvarXMLPDF;
    {class} property Senha: Jjdom2_Element read _GetSenha;
    {class} property SeparadorArquivo: Jjdom2_Element read _GetSeparadorArquivo;
    {class} property Serie: Jjdom2_Element read _GetSerie;
    {class} property SerieContingencia: Jjdom2_Element read _GetSerieContingencia;
    {class} property ServidorSMTP: Jjdom2_Element read _GetServidorSMTP;
    {class} property &TO: Jjdom2_Element read _GetTO;
    {class} property TRANSP: Jjdom2_Element read _GetTRANSP;
    {class} property TipoNF: Jjdom2_Element read _GetTipoNF;
    {class} property Titulo: Jjdom2_Element read _GetTitulo;
    {class} property Token: Jjdom2_Element read _GetToken;
    {class} property UF: Jjdom2_Element read _GetUF;
    {class} property UFCons: Jjdom2_Element read _GetUFCons;
    {class} property UFSTPART: Jjdom2_Element read _GetUFSTPART write _SetUFSTPART;
    {class} property URLS: Jjdom2_Element read _GetURLS;
    {class} property ValidadeServ: Jjdom2_Element read _GetValidadeServ;
    {class} property VersaoQRCode: Jjdom2_Element read _GetVersaoQRCode;
    {class} property cBarra: Jjdom2_Element read _GetcBarra;
    {class} property cBarraTrib: Jjdom2_Element read _GetcBarraTrib;
    {class} property cBenef: Jjdom2_Element read _GetcBenef;
    {class} property cEAN: Jjdom2_Element read _GetcEAN;
    {class} property cEANTrib: Jjdom2_Element read _GetcEANTrib;
    {class} property cListServSQN: Jjdom2_Element read _GetcListServSQN write _SetcListServSQN;
    {class} property cMun: Jjdom2_Element read _GetcMun;
    {class} property cMunFG: Jjdom2_Element read _GetcMunFG;
    {class} property cMunFgSQN: Jjdom2_Element read _GetcMunFgSQN write _SetcMunFgSQN;
    {class} property cMunSQN: Jjdom2_Element read _GetcMunSQN write _SetcMunSQN;
    {class} property cNF: Jjdom2_Element read _GetcNF;
    {class} property cPaisSQN: Jjdom2_Element read _GetcPaisSQN write _SetcPaisSQN;
    {class} property cProdANP: Jjdom2_Element read _GetcProdANP;
    {class} property cProdANVISA: Jjdom2_Element read _GetcProdANVISA;
    {class} property cServicoSQN: Jjdom2_Element read _GetcServicoSQN write _SetcServicoSQN;
    {class} property cUF: Jjdom2_Element read _GetcUF;
    {class} property chaveAcesso: Jjdom2_Element read _GetchaveAcesso;
    {class} property ctgNNF: Jjdom2_Element read _GetctgNNF;
    {class} property ctgSerie: Jjdom2_Element read _GetctgSerie;
    {class} property dFab: Jjdom2_Element read _GetdFab;
    {class} property dVal: Jjdom2_Element read _GetdVal;
    {class} property dias: Jjdom2_Element read _Getdias;
    {class} property email: Jjdom2_Element read _Getemail;
    {class} property finNfe: Jjdom2_Element read _GetfinNfe;
    {class} property historicoXML: Jjdom2_Element read _GethistoricoXML;
    {class} property homoAL: Jjdom2_Element read _GethomoAL;
    {class} property homoAM: Jjdom2_Element read _GethomoAM;
    {class} property homoAP: Jjdom2_Element read _GethomoAP;
    {class} property homoBA: Jjdom2_Element read _GethomoBA;
    {class} property homoCE: Jjdom2_Element read _GethomoCE;
    {class} property homoDF: Jjdom2_Element read _GethomoDF;
    {class} property homoES: Jjdom2_Element read _GethomoES;
    {class} property homoGO: Jjdom2_Element read _GethomoGO;
    {class} property homoMA: Jjdom2_Element read _GethomoMA;
    {class} property homoMG: Jjdom2_Element read _GethomoMG;
    {class} property homoMS: Jjdom2_Element read _GethomoMS;
    {class} property homoMT: Jjdom2_Element read _GethomoMT;
    {class} property homoPA: Jjdom2_Element read _GethomoPA;
    {class} property homoPB: Jjdom2_Element read _GethomoPB;
    {class} property homoPE: Jjdom2_Element read _GethomoPE;
    {class} property homoPI: Jjdom2_Element read _GethomoPI;
    {class} property homoPR: Jjdom2_Element read _GethomoPR;
    {class} property homoRJ: Jjdom2_Element read _GethomoRJ;
    {class} property homoRN: Jjdom2_Element read _GethomoRN;
    {class} property homoRO: Jjdom2_Element read _GethomoRO;
    {class} property homoRR: Jjdom2_Element read _GethomoRR;
    {class} property homoRS: Jjdom2_Element read _GethomoRS;
    {class} property homoSC: Jjdom2_Element read _GethomoSC;
    {class} property homoSE: Jjdom2_Element read _GethomoSE;
    {class} property homoSP: Jjdom2_Element read _GethomoSP;
    {class} property homoTO: Jjdom2_Element read _GethomoTO;
    {class} property idCadIntTran: Jjdom2_Element read _GetidCadIntTran;
    {class} property idDest: Jjdom2_Element read _GetidDest;
    {class} property idToken: Jjdom2_Element read _GetidToken;
    {class} property impressora: Jjdom2_Element read _Getimpressora;
    {class} property indEscala: Jjdom2_Element read _GetindEscala;
    {class} property indFinal: Jjdom2_Element read _GetindFinal;
    {class} property indISSSQN: Jjdom2_Element read _GetindISSSQN write _SetindISSSQN;
    {class} property indIncentivoSQN: Jjdom2_Element read _GetindIncentivoSQN write _SetindIncentivoSQN;
    {class} property indIntermed: Jjdom2_Element read _GetindIntermed;
    {class} property indPag: Jjdom2_Element read _GetindPag;
    {class} property indPres: Jjdom2_Element read _GetindPres;
    {class} property indTot: Jjdom2_Element read _GetindTot;
    {class} property infIntermed: Jjdom2_Element read _GetinfIntermed;
    {class} property infRespTec: Jjdom2_Element read _GetinfRespTec;
    {class} property irtCNPJ: Jjdom2_Element read _GetirtCNPJ;
    {class} property irtCSRT: Jjdom2_Element read _GetirtCSRT;
    {class} property irtFone: Jjdom2_Element read _GetirtFone;
    {class} property irtemail: Jjdom2_Element read _Getirtemail;
    {class} property irtidCSRT: Jjdom2_Element read _GetirtidCSRT;
    {class} property irtxContato: Jjdom2_Element read _GetirtxContato;
    {class} property modBC: Jjdom2_Element read _GetmodBC;
    {class} property modBC10: Jjdom2_Element read _GetmodBC10;
    {class} property modBC20: Jjdom2_Element read _GetmodBC20 write _SetmodBC20;
    {class} property modBC51: Jjdom2_Element read _GetmodBC51 write _SetmodBC51;
    {class} property modBC70: Jjdom2_Element read _GetmodBC70 write _SetmodBC70;
    {class} property modBC90: Jjdom2_Element read _GetmodBC90 write _SetmodBC90;
    {class} property modBCPART: Jjdom2_Element read _GetmodBCPART write _SetmodBCPART;
    {class} property modBCSN900: Jjdom2_Element read _GetmodBCSN900 write _SetmodBCSN900;
    {class} property modBCST10: Jjdom2_Element read _GetmodBCST10;
    {class} property modBCST30: Jjdom2_Element read _GetmodBCST30 write _SetmodBCST30;
    {class} property modBCST70: Jjdom2_Element read _GetmodBCST70 write _SetmodBCST70;
    {class} property modBCST90: Jjdom2_Element read _GetmodBCST90 write _SetmodBCST90;
    {class} property modBCSTPART: Jjdom2_Element read _GetmodBCSTPART write _SetmodBCSTPART;
    {class} property modBCSTSN201: Jjdom2_Element read _GetmodBCSTSN201 write _SetmodBCSTSN201;
    {class} property modBCSTSN202: Jjdom2_Element read _GetmodBCSTSN202 write _SetmodBCSTSN202;
    {class} property modBCSTSN900: Jjdom2_Element read _GetmodBCSTSN900 write _SetmodBCSTSN900;
    {class} property modFrete: Jjdom2_Element read _GetmodFrete;
    {class} property motDesICMS20: Jjdom2_Element read _GetmotDesICMS20 write _SetmotDesICMS20;
    {class} property motDesICMS30: Jjdom2_Element read _GetmotDesICMS30 write _SetmotDesICMS30;
    {class} property motDesICMS40: Jjdom2_Element read _GetmotDesICMS40 write _SetmotDesICMS40;
    {class} property motDesICMS70: Jjdom2_Element read _GetmotDesICMS70 write _SetmotDesICMS70;
    {class} property motDesICMS90: Jjdom2_Element read _GetmotDesICMS90 write _SetmotDesICMS90;
    {class} property nLote: Jjdom2_Element read _GetnLote;
    {class} property nNF: Jjdom2_Element read _GetnNF;
    {class} property nProcessoSQN: Jjdom2_Element read _GetnProcessoSQN write _SetnProcessoSQN;
    {class} property natOP: Jjdom2_Element read _GetnatOP;
    {class} property orig: Jjdom2_Element read _Getorig;
    {class} property orig10: Jjdom2_Element read _Getorig10;
    {class} property orig20: Jjdom2_Element read _Getorig20 write _Setorig20;
    {class} property orig202: Jjdom2_Element read _Getorig202 write _Setorig202;
    {class} property orig30: Jjdom2_Element read _Getorig30 write _Setorig30;
    {class} property orig40: Jjdom2_Element read _Getorig40 write _Setorig40;
    {class} property orig51: Jjdom2_Element read _Getorig51 write _Setorig51;
    {class} property orig60: Jjdom2_Element read _Getorig60 write _Setorig60;
    {class} property orig70: Jjdom2_Element read _Getorig70 write _Setorig70;
    {class} property orig90: Jjdom2_Element read _Getorig90 write _Setorig90;
    {class} property origPART: Jjdom2_Element read _GetorigPART write _SetorigPART;
    {class} property origSN101: Jjdom2_Element read _GetorigSN101 write _SetorigSN101;
    {class} property origSN102: Jjdom2_Element read _GetorigSN102 write _SetorigSN102;
    {class} property origSN201: Jjdom2_Element read _GetorigSN201 write _SetorigSN201;
    {class} property origSN500: Jjdom2_Element read _GetorigSN500 write _SetorigSN500;
    {class} property origSN900: Jjdom2_Element read _GetorigSN900 write _SetorigSN900;
    {class} property origST: Jjdom2_Element read _GetorigST write _SetorigST;
    {class} property pBCOpPART: Jjdom2_Element read _GetpBCOpPART write _SetpBCOpPART;
    {class} property pCOFINSCOFINSALIQ: Jjdom2_Element read _GetpCOFINSCOFINSALIQ write _SetpCOFINSCOFINSALIQ;
    {class} property pCOFINSCOFINSOUTR: Jjdom2_Element read _GetpCOFINSCOFINSOUTR write _SetpCOFINSCOFINSOUTR;
    {class} property pCOFINSCOFINSST: Jjdom2_Element read _GetpCOFINSCOFINSST write _SetpCOFINSCOFINSST;
    {class} property pCredSNSN101: Jjdom2_Element read _GetpCredSNSN101 write _SetpCredSNSN101;
    {class} property pCredSNSN201: Jjdom2_Element read _GetpCredSNSN201 write _SetpCredSNSN201;
    {class} property pCredSNSN900: Jjdom2_Element read _GetpCredSNSN900 write _SetpCredSNSN900;
    {class} property pDif51: Jjdom2_Element read _GetpDif51 write _SetpDif51;
    {class} property pFCP: Jjdom2_Element read _GetpFCP;
    {class} property pFCP10: Jjdom2_Element read _GetpFCP10;
    {class} property pFCP20: Jjdom2_Element read _GetpFCP20 write _SetpFCP20;
    {class} property pFCP51: Jjdom2_Element read _GetpFCP51 write _SetpFCP51;
    {class} property pFCP70: Jjdom2_Element read _GetpFCP70 write _SetpFCP70;
    {class} property pFCP90: Jjdom2_Element read _GetpFCP90 write _SetpFCP90;
    {class} property pFCPST10: Jjdom2_Element read _GetpFCPST10;
    {class} property pFCPST30: Jjdom2_Element read _GetpFCPST30 write _SetpFCPST30;
    {class} property pFCPST70: Jjdom2_Element read _GetpFCPST70 write _SetpFCPST70;
    {class} property pFCPST90: Jjdom2_Element read _GetpFCPST90 write _SetpFCPST90;
    {class} property pFCPSTRet60: Jjdom2_Element read _GetpFCPSTRet60 write _SetpFCPSTRet60;
    {class} property pFCPSTRetSN500: Jjdom2_Element read _GetpFCPSTRetSN500 write _SetpFCPSTRetSN500;
    {class} property pFCPSTSN201: Jjdom2_Element read _GetpFCPSTSN201 write _SetpFCPSTSN201;
    {class} property pFCPSTSN202: Jjdom2_Element read _GetpFCPSTSN202 write _SetpFCPSTSN202;
    {class} property pFCPSTSN900: Jjdom2_Element read _GetpFCPSTSN900 write _SetpFCPSTSN900;
    {class} property pGLP: Jjdom2_Element read _GetpGLP;
    {class} property pGNi: Jjdom2_Element read _GetpGNi;
    {class} property pGNn: Jjdom2_Element read _GetpGNn;
    {class} property pICMS: Jjdom2_Element read _GetpICMS;
    {class} property pICMS10: Jjdom2_Element read _GetpICMS10;
    {class} property pICMS20: Jjdom2_Element read _GetpICMS20 write _SetpICMS20;
    {class} property pICMS51: Jjdom2_Element read _GetpICMS51 write _SetpICMS51;
    {class} property pICMS70: Jjdom2_Element read _GetpICMS70 write _SetpICMS70;
    {class} property pICMS90: Jjdom2_Element read _GetpICMS90 write _SetpICMS90;
    {class} property pICMSEfet60: Jjdom2_Element read _GetpICMSEfet60 write _SetpICMSEfet60;
    {class} property pICMSEfetSN500: Jjdom2_Element read _GetpICMSEfetSN500 write _SetpICMSEfetSN500;
    {class} property pICMSPART: Jjdom2_Element read _GetpICMSPART write _SetpICMSPART;
    {class} property pICMSSN900: Jjdom2_Element read _GetpICMSSN900 write _SetpICMSSN900;
    {class} property pICMSST10: Jjdom2_Element read _GetpICMSST10;
    {class} property pICMSST30: Jjdom2_Element read _GetpICMSST30 write _SetpICMSST30;
    {class} property pICMSST70: Jjdom2_Element read _GetpICMSST70 write _SetpICMSST70;
    {class} property pICMSST90: Jjdom2_Element read _GetpICMSST90 write _SetpICMSST90;
    {class} property pICMSSTPART: Jjdom2_Element read _GetpICMSSTPART write _SetpICMSSTPART;
    {class} property pICMSSTSN201: Jjdom2_Element read _GetpICMSSTSN201 write _SetpICMSSTSN201;
    {class} property pICMSSTSN202: Jjdom2_Element read _GetpICMSSTSN202 write _SetpICMSSTSN202;
    {class} property pICMSSTSN900: Jjdom2_Element read _GetpICMSSTSN900 write _SetpICMSSTSN900;
    {class} property pMVAST10: Jjdom2_Element read _GetpMVAST10;
    {class} property pMVAST30: Jjdom2_Element read _GetpMVAST30 write _SetpMVAST30;
    {class} property pMVAST70: Jjdom2_Element read _GetpMVAST70 write _SetpMVAST70;
    {class} property pMVAST90: Jjdom2_Element read _GetpMVAST90 write _SetpMVAST90;
    {class} property pMVASTPART: Jjdom2_Element read _GetpMVASTPART write _SetpMVASTPART;
    {class} property pMVASTSN201: Jjdom2_Element read _GetpMVASTSN201 write _SetpMVASTSN201;
    {class} property pMVASTSN202: Jjdom2_Element read _GetpMVASTSN202 write _SetpMVASTSN202;
    {class} property pMVASTSN900: Jjdom2_Element read _GetpMVASTSN900 write _SetpMVASTSN900;
    {class} property pPISALIQ: Jjdom2_Element read _GetpPISALIQ write _SetpPISALIQ;
    {class} property pPISPISOUTR: Jjdom2_Element read _GetpPISPISOUTR write _SetpPISPISOUTR;
    {class} property pPISPISST: Jjdom2_Element read _GetpPISPISST write _SetpPISPISST;
    {class} property pRedBC20: Jjdom2_Element read _GetpRedBC20 write _SetpRedBC20;
    {class} property pRedBC51: Jjdom2_Element read _GetpRedBC51 write _SetpRedBC51;
    {class} property pRedBC70: Jjdom2_Element read _GetpRedBC70 write _SetpRedBC70;
    {class} property pRedBC90: Jjdom2_Element read _GetpRedBC90 write _SetpRedBC90;
    {class} property pRedBCEfet60: Jjdom2_Element read _GetpRedBCEfet60 write _SetpRedBCEfet60;
    {class} property pRedBCEfetSN500: Jjdom2_Element read _GetpRedBCEfetSN500 write _SetpRedBCEfetSN500;
    {class} property pRedBCPART: Jjdom2_Element read _GetpRedBCPART write _SetpRedBCPART;
    {class} property pRedBCSN900: Jjdom2_Element read _GetpRedBCSN900 write _SetpRedBCSN900;
    {class} property pRedBCST10: Jjdom2_Element read _GetpRedBCST10;
    {class} property pRedBCST30: Jjdom2_Element read _GetpRedBCST30 write _SetpRedBCST30;
    {class} property pRedBCST70: Jjdom2_Element read _GetpRedBCST70 write _SetpRedBCST70;
    {class} property pRedBCST90: Jjdom2_Element read _GetpRedBCST90 write _SetpRedBCST90;
    {class} property pRedBCSTPART: Jjdom2_Element read _GetpRedBCSTPART write _SetpRedBCSTPART;
    {class} property pRedBCSTSN201: Jjdom2_Element read _GetpRedBCSTSN201 write _SetpRedBCSTSN201;
    {class} property pRedBCSTSN202: Jjdom2_Element read _GetpRedBCSTSN202 write _SetpRedBCSTSN202;
    {class} property pRedBCSTSN900: Jjdom2_Element read _GetpRedBCSTSN900 write _SetpRedBCSTSN900;
    {class} property pST60: Jjdom2_Element read _GetpST60 write _SetpST60;
    {class} property pSTSN500: Jjdom2_Element read _GetpSTSN500 write _SetpSTSN500;
    {class} property prodAC: Jjdom2_Element read _GetprodAC;
    {class} property prodAL: Jjdom2_Element read _GetprodAL;
    {class} property prodAP: Jjdom2_Element read _GetprodAP;
    {class} property prodBA: Jjdom2_Element read _GetprodBA;
    {class} property prodCE: Jjdom2_Element read _GetprodCE;
    {class} property prodDF: Jjdom2_Element read _GetprodDF;
    {class} property prodES: Jjdom2_Element read _GetprodES;
    {class} property prodGO: Jjdom2_Element read _GetprodGO;
    {class} property prodMA: Jjdom2_Element read _GetprodMA;
    {class} property prodMG: Jjdom2_Element read _GetprodMG;
    {class} property prodMS: Jjdom2_Element read _GetprodMS;
    {class} property prodMT: Jjdom2_Element read _GetprodMT;
    {class} property prodPA: Jjdom2_Element read _GetprodPA;
    {class} property prodPB: Jjdom2_Element read _GetprodPB;
    {class} property prodPE: Jjdom2_Element read _GetprodPE;
    {class} property prodPI: Jjdom2_Element read _GetprodPI;
    {class} property prodPR: Jjdom2_Element read _GetprodPR;
    {class} property prodRJ: Jjdom2_Element read _GetprodRJ;
    {class} property prodRN: Jjdom2_Element read _GetprodRN;
    {class} property prodRO: Jjdom2_Element read _GetprodRO;
    {class} property prodRS: Jjdom2_Element read _GetprodRS;
    {class} property prodSC: Jjdom2_Element read _GetprodSC;
    {class} property prodSE: Jjdom2_Element read _GetprodSE;
    {class} property prodSP: Jjdom2_Element read _GetprodSP;
    {class} property prodTO: Jjdom2_Element read _GetprodTO;
    {class} property protocolo: Jjdom2_Element read _Getprotocolo;
    {class} property qBCProd: Jjdom2_Element read _GetqBCProd;
    {class} property qBCProdCOFINSOUTR: Jjdom2_Element read _GetqBCProdCOFINSOUTR write _SetqBCProdCOFINSOUTR;
    {class} property qBCProdCOFINSQTDE: Jjdom2_Element read _GetqBCProdCOFINSQTDE write _SetqBCProdCOFINSQTDE;
    {class} property qBCProdCOFINSST: Jjdom2_Element read _GetqBCProdCOFINSST write _SetqBCProdCOFINSST;
    {class} property qBCProdPISOUTR: Jjdom2_Element read _GetqBCProdPISOUTR write _SetqBCProdPISOUTR;
    {class} property qBCProdPISST: Jjdom2_Element read _GetqBCProdPISST write _SetqBCProdPISST;
    {class} property qBCProdQTDE: Jjdom2_Element read _GetqBCProdQTDE write _SetqBCProdQTDE;
    {class} property qLote: Jjdom2_Element read _GetqLote;
    {class} property qTemp: Jjdom2_Element read _GetqTemp;
    {class} property tpEmis: Jjdom2_Element read _GettpEmis;
    {class} property tpImp: Jjdom2_Element read _GettpImp;
    {class} property tpNF: Jjdom2_Element read _GettpNF;
    {class} property trocoNFCe: Jjdom2_Element read _GettrocoNFCe;
    {class} property vAliqProd: Jjdom2_Element read _GetvAliqProd;
    {class} property vAliqProdCOFINSOUTR: Jjdom2_Element read _GetvAliqProdCOFINSOUTR write _SetvAliqProdCOFINSOUTR;
    {class} property vAliqProdCOFINSST: Jjdom2_Element read _GetvAliqProdCOFINSST write _SetvAliqProdCOFINSST;
    {class} property vAliqProdCONFISQTDE: Jjdom2_Element read _GetvAliqProdCONFISQTDE write _SetvAliqProdCONFISQTDE;
    {class} property vAliqProdPISOUTR: Jjdom2_Element read _GetvAliqProdPISOUTR write _SetvAliqProdPISOUTR;
    {class} property vAliqProdPISST: Jjdom2_Element read _GetvAliqProdPISST write _SetvAliqProdPISST;
    {class} property vAliqProdQTDE: Jjdom2_Element read _GetvAliqProdQTDE write _SetvAliqProdQTDE;
    {class} property vAliqSQN: Jjdom2_Element read _GetvAliqSQN write _SetvAliqSQN;
    {class} property vBC: Jjdom2_Element read _GetvBC;
    {class} property vBC10: Jjdom2_Element read _GetvBC10;
    {class} property vBC20: Jjdom2_Element read _GetvBC20 write _SetvBC20;
    {class} property vBC51: Jjdom2_Element read _GetvBC51 write _SetvBC51;
    {class} property vBC70: Jjdom2_Element read _GetvBC70 write _SetvBC70;
    {class} property vBC90: Jjdom2_Element read _GetvBC90 write _SetvBC90;
    {class} property vBCALIQ: Jjdom2_Element read _GetvBCALIQ write _SetvBCALIQ;
    {class} property vBCCOFINOUTR: Jjdom2_Element read _GetvBCCOFINOUTR write _SetvBCCOFINOUTR;
    {class} property vBCCOFINSALIQ: Jjdom2_Element read _GetvBCCOFINSALIQ write _SetvBCCOFINSALIQ;
    {class} property vBCCOFINSST: Jjdom2_Element read _GetvBCCOFINSST write _SetvBCCOFINSST;
    {class} property vBCEfet60: Jjdom2_Element read _GetvBCEfet60 write _SetvBCEfet60;
    {class} property vBCEfetSN500: Jjdom2_Element read _GetvBCEfetSN500 write _SetvBCEfetSN500;
    {class} property vBCFCP10: Jjdom2_Element read _GetvBCFCP10;
    {class} property vBCFCP20: Jjdom2_Element read _GetvBCFCP20 write _SetvBCFCP20;
    {class} property vBCFCP51: Jjdom2_Element read _GetvBCFCP51 write _SetvBCFCP51;
    {class} property vBCFCP70: Jjdom2_Element read _GetvBCFCP70 write _SetvBCFCP70;
    {class} property vBCFCP90: Jjdom2_Element read _GetvBCFCP90 write _SetvBCFCP90;
    {class} property vBCFCPST10: Jjdom2_Element read _GetvBCFCPST10;
    {class} property vBCFCPST30: Jjdom2_Element read _GetvBCFCPST30 write _SetvBCFCPST30;
    {class} property vBCFCPST70: Jjdom2_Element read _GetvBCFCPST70 write _SetvBCFCPST70;
    {class} property vBCFCPST90: Jjdom2_Element read _GetvBCFCPST90 write _SetvBCFCPST90;
    {class} property vBCFCPSTRet60: Jjdom2_Element read _GetvBCFCPSTRet60 write _SetvBCFCPSTRet60;
    {class} property vBCFCPSTRetSN500: Jjdom2_Element read _GetvBCFCPSTRetSN500 write _SetvBCFCPSTRetSN500;
    {class} property vBCFCPSTSN201: Jjdom2_Element read _GetvBCFCPSTSN201 write _SetvBCFCPSTSN201;
    {class} property vBCFCPSTSN202: Jjdom2_Element read _GetvBCFCPSTSN202 write _SetvBCFCPSTSN202;
    {class} property vBCFCPSTSN900: Jjdom2_Element read _GetvBCFCPSTSN900 write _SetvBCFCPSTSN900;
    {class} property vBCPART: Jjdom2_Element read _GetvBCPART write _SetvBCPART;
    {class} property vBCPISOUTR: Jjdom2_Element read _GetvBCPISOUTR write _SetvBCPISOUTR;
    {class} property vBCPISST: Jjdom2_Element read _GetvBCPISST write _SetvBCPISST;
    {class} property vBCSN900: Jjdom2_Element read _GetvBCSN900 write _SetvBCSN900;
    {class} property vBCSQN: Jjdom2_Element read _GetvBCSQN write _SetvBCSQN;
    {class} property vBCST10: Jjdom2_Element read _GetvBCST10;
    {class} property vBCST30: Jjdom2_Element read _GetvBCST30 write _SetvBCST30;
    {class} property vBCST70: Jjdom2_Element read _GetvBCST70 write _SetvBCST70;
    {class} property vBCST90: Jjdom2_Element read _GetvBCST90 write _SetvBCST90;
    {class} property vBCSTDestST: Jjdom2_Element read _GetvBCSTDestST write _SetvBCSTDestST;
    {class} property vBCSTPART: Jjdom2_Element read _GetvBCSTPART write _SetvBCSTPART;
    {class} property vBCSTRet60: Jjdom2_Element read _GetvBCSTRet60 write _SetvBCSTRet60;
    {class} property vBCSTRetSN500: Jjdom2_Element read _GetvBCSTRetSN500 write _SetvBCSTRetSN500;
    {class} property vBCSTRetST: Jjdom2_Element read _GetvBCSTRetST write _SetvBCSTRetST;
    {class} property vBCSTSN201: Jjdom2_Element read _GetvBCSTSN201 write _SetvBCSTSN201;
    {class} property vBCSTSN202: Jjdom2_Element read _GetvBCSTSN202 write _SetvBCSTSN202;
    {class} property vBCSTSN900: Jjdom2_Element read _GetvBCSTSN900 write _SetvBCSTSN900;
    {class} property vCIDE: Jjdom2_Element read _GetvCIDE;
    {class} property vCOFINSCOFINSALIQ: Jjdom2_Element read _GetvCOFINSCOFINSALIQ write _SetvCOFINSCOFINSALIQ;
    {class} property vCOFINSCOFINSQTDE: Jjdom2_Element read _GetvCOFINSCOFINSQTDE write _SetvCOFINSCOFINSQTDE;
    {class} property vCOFINSCOFINSST: Jjdom2_Element read _GetvCOFINSCOFINSST write _SetvCOFINSCOFINSST;
    {class} property vCONFISCONFISOUTR: Jjdom2_Element read _GetvCONFISCONFISOUTR write _SetvCONFISCONFISOUTR;
    {class} property vCredICMSSNSN101: Jjdom2_Element read _GetvCredICMSSNSN101 write _SetvCredICMSSNSN101;
    {class} property vCredICMSSNSN201: Jjdom2_Element read _GetvCredICMSSNSN201 write _SetvCredICMSSNSN201;
    {class} property vCredICMSSNSN900: Jjdom2_Element read _GetvCredICMSSNSN900 write _SetvCredICMSSNSN900;
    {class} property vDeducaoSQN: Jjdom2_Element read _GetvDeducaoSQN write _SetvDeducaoSQN;
    {class} property vDescCondSQN: Jjdom2_Element read _GetvDescCondSQN write _SetvDescCondSQN;
    {class} property vDescIncondSQN: Jjdom2_Element read _GetvDescIncondSQN write _SetvDescIncondSQN;
    {class} property vFCP: Jjdom2_Element read _GetvFCP;
    {class} property vFCP10: Jjdom2_Element read _GetvFCP10;
    {class} property vFCP20: Jjdom2_Element read _GetvFCP20 write _SetvFCP20;
    {class} property vFCP51: Jjdom2_Element read _GetvFCP51 write _SetvFCP51;
    {class} property vFCP70: Jjdom2_Element read _GetvFCP70 write _SetvFCP70;
    {class} property vFCP90: Jjdom2_Element read _GetvFCP90 write _SetvFCP90;
    {class} property vFCPST10: Jjdom2_Element read _GetvFCPST10;
    {class} property vFCPST30: Jjdom2_Element read _GetvFCPST30 write _SetvFCPST30;
    {class} property vFCPST90: Jjdom2_Element read _GetvFCPST90 write _SetvFCPST90;
    {class} property vFCPSTRet60: Jjdom2_Element read _GetvFCPSTRet60 write _SetvFCPSTRet60;
    {class} property vFCPSTRetSN500: Jjdom2_Element read _GetvFCPSTRetSN500 write _SetvFCPSTRetSN500;
    {class} property vFCPSTSN201: Jjdom2_Element read _GetvFCPSTSN201 write _SetvFCPSTSN201;
    {class} property vFCPSTSN202: Jjdom2_Element read _GetvFCPSTSN202 write _SetvFCPSTSN202;
    {class} property vFCPSTSN900: Jjdom2_Element read _GetvFCPSTSN900 write _SetvFCPSTSN900;
    {class} property vICMS: Jjdom2_Element read _GetvICMS;
    {class} property vICMS10: Jjdom2_Element read _GetvICMS10;
    {class} property vICMS20: Jjdom2_Element read _GetvICMS20 write _SetvICMS20;
    {class} property vICMS51: Jjdom2_Element read _GetvICMS51 write _SetvICMS51;
    {class} property vICMS70: Jjdom2_Element read _GetvICMS70 write _SetvICMS70;
    {class} property vICMS90: Jjdom2_Element read _GetvICMS90 write _SetvICMS90;
    {class} property vICMSDeson20: Jjdom2_Element read _GetvICMSDeson20 write _SetvICMSDeson20;
    {class} property vICMSDeson30: Jjdom2_Element read _GetvICMSDeson30 write _SetvICMSDeson30;
    {class} property vICMSDeson40: Jjdom2_Element read _GetvICMSDeson40 write _SetvICMSDeson40;
    {class} property vICMSDeson70: Jjdom2_Element read _GetvICMSDeson70 write _SetvICMSDeson70;
    {class} property vICMSDeson90: Jjdom2_Element read _GetvICMSDeson90 write _SetvICMSDeson90;
    {class} property vICMSDif: Jjdom2_Element read _GetvICMSDif write _SetvICMSDif;
    {class} property vICMSEfet60: Jjdom2_Element read _GetvICMSEfet60 write _SetvICMSEfet60;
    {class} property vICMSEfetSN500: Jjdom2_Element read _GetvICMSEfetSN500 write _SetvICMSEfetSN500;
    {class} property vICMSOp51: Jjdom2_Element read _GetvICMSOp51 write _SetvICMSOp51;
    {class} property vICMSPART: Jjdom2_Element read _GetvICMSPART write _SetvICMSPART;
    {class} property vICMSSN900: Jjdom2_Element read _GetvICMSSN900 write _SetvICMSSN900;
    {class} property vICMSST10: Jjdom2_Element read _GetvICMSST10;
    {class} property vICMSST30: Jjdom2_Element read _GetvICMSST30 write _SetvICMSST30;
    {class} property vICMSST70: Jjdom2_Element read _GetvICMSST70 write _SetvICMSST70;
    {class} property vICMSST90: Jjdom2_Element read _GetvICMSST90 write _SetvICMSST90;
    {class} property vICMSSTDestST: Jjdom2_Element read _GetvICMSSTDestST write _SetvICMSSTDestST;
    {class} property vICMSSTPART: Jjdom2_Element read _GetvICMSSTPART write _SetvICMSSTPART;
    {class} property vICMSSTRet60: Jjdom2_Element read _GetvICMSSTRet60 write _SetvICMSSTRet60;
    {class} property vICMSSTRetSN500: Jjdom2_Element read _GetvICMSSTRetSN500 write _SetvICMSSTRetSN500;
    {class} property vICMSSTRetST: Jjdom2_Element read _GetvICMSSTRetST write _SetvICMSSTRetST;
    {class} property vICMSSTSN201: Jjdom2_Element read _GetvICMSSTSN201 write _SetvICMSSTSN201;
    {class} property vICMSSTSN202: Jjdom2_Element read _GetvICMSSTSN202 write _SetvICMSSTSN202;
    {class} property vICMSSTSN900: Jjdom2_Element read _GetvICMSSTSN900 write _SetvICMSSTSN900;
    {class} property vICMSSubstituto60: Jjdom2_Element read _GetvICMSSubstituto60 write _SetvICMSSubstituto60;
    {class} property vICMSSubstitutoSN500: Jjdom2_Element read _GetvICMSSubstitutoSN500 write _SetvICMSSubstitutoSN500;
    {class} property vISSQNSQN: Jjdom2_Element read _GetvISSQNSQN write _SetvISSQNSQN;
    {class} property vISSRetSQN: Jjdom2_Element read _GetvISSRetSQN write _SetvISSRetSQN;
    {class} property vOutroSQN: Jjdom2_Element read _GetvOutroSQN write _SetvOutroSQN;
    {class} property vPISALIQ: Jjdom2_Element read _GetvPISALIQ write _SetvPISALIQ;
    {class} property vPISPISOUTR: Jjdom2_Element read _GetvPISPISOUTR write _SetvPISPISOUTR;
    {class} property vPISPISST: Jjdom2_Element read _GetvPISPISST write _SetvPISPISST;
    {class} property vPISQTDE: Jjdom2_Element read _GetvPISQTDE write _SetvPISQTDE;
    {class} property vPMC: Jjdom2_Element read _GetvPMC;
    {class} property vPart: Jjdom2_Element read _GetvPart;
    {class} property verProc: Jjdom2_Element read _GetverProc;
    {class} property versaoNT: Jjdom2_Element read _GetversaoNT;
    {class} property xBairro: Jjdom2_Element read _GetxBairro;
    {class} property xJust: Jjdom2_Element read _GetxJust;
    {class} property xLgr: Jjdom2_Element read _GetxLgr;
    {class} property xMun: Jjdom2_Element read _GetxMun;
    {class} property xNome: Jjdom2_Element read _GetxNome;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ElementosXmlAuxiliar')]
  JElementosXmlAuxiliar = interface(JObject)
    ['{3F2DAE3F-07ED-4C35-AEA6-5F754A0439BD}']
    function _GetCONFIGURACAO: Jjdom2_Element; cdecl;
    procedure _SetCONFIGURACAO(Value: Jjdom2_Element); cdecl;
    function _GetCancInutilizaAutomatico: Jjdom2_Element; cdecl;
    procedure _SetCancInutilizaAutomatico(Value: Jjdom2_Element); cdecl;
    function _GetConta: Jjdom2_Element; cdecl;
    procedure _SetConta(Value: Jjdom2_Element); cdecl;
    function _GetEmpCK: Jjdom2_Element; cdecl;
    procedure _SetEmpCK(Value: Jjdom2_Element); cdecl;
    function _GetFRAMEWORKGNE: Jjdom2_Element; cdecl;
    procedure _SetFRAMEWORKGNE(Value: Jjdom2_Element); cdecl;
    function _GetMS: Jjdom2_Element; cdecl;
    procedure _SetMS(Value: Jjdom2_Element); cdecl;
    function _GetTipoAmbiente: Jjdom2_Element; cdecl;
    procedure _SetTipoAmbiente(Value: Jjdom2_Element); cdecl;
    function _GetdescANP: Jjdom2_Element; cdecl;
    procedure _SetdescANP(Value: Jjdom2_Element); cdecl;
    function _GethomoAC: Jjdom2_Element; cdecl;
    procedure _SethomoAC(Value: Jjdom2_Element); cdecl;
    function _GetprodAM: Jjdom2_Element; cdecl;
    procedure _SetprodAM(Value: Jjdom2_Element); cdecl;
    function _GetprodRR: Jjdom2_Element; cdecl;
    procedure _SetprodRR(Value: Jjdom2_Element); cdecl;
    function _GeturlQRCode: Jjdom2_Element; cdecl;
    procedure _SeturlQRCode(Value: Jjdom2_Element); cdecl;
    function _GetvFCPST70: Jjdom2_Element; cdecl;
    procedure _SetvFCPST70(Value: Jjdom2_Element); cdecl;
    procedure vinculaxml; cdecl;
    property CONFIGURACAO: Jjdom2_Element read _GetCONFIGURACAO write _SetCONFIGURACAO;
    property CancInutilizaAutomatico: Jjdom2_Element read _GetCancInutilizaAutomatico write _SetCancInutilizaAutomatico;
    property Conta: Jjdom2_Element read _GetConta write _SetConta;
    property EmpCK: Jjdom2_Element read _GetEmpCK write _SetEmpCK;
    property FRAMEWORKGNE: Jjdom2_Element read _GetFRAMEWORKGNE write _SetFRAMEWORKGNE;
    property MS: Jjdom2_Element read _GetMS write _SetMS;
    property TipoAmbiente: Jjdom2_Element read _GetTipoAmbiente write _SetTipoAmbiente;
    property descANP: Jjdom2_Element read _GetdescANP write _SetdescANP;
    property homoAC: Jjdom2_Element read _GethomoAC write _SethomoAC;
    property prodAM: Jjdom2_Element read _GetprodAM write _SetprodAM;
    property prodRR: Jjdom2_Element read _GetprodRR write _SetprodRR;
    property urlQRCode: Jjdom2_Element read _GeturlQRCode write _SeturlQRCode;
    property vFCPST70: Jjdom2_Element read _GetvFCPST70 write _SetvFCPST70;
  end;
  TJElementosXmlAuxiliar = class(TJavaGenericImport<JElementosXmlAuxiliarClass, JElementosXmlAuxiliar>) end;

  JElementosXmlCancelamentoClass = interface(JObjectClass)
    ['{81F5DCEB-DA80-492A-8BA8-EB81FFE8C25D}']
    {class} function _GetChaAcesso: Jjdom2_Element; cdecl;
    {class} procedure _SetChaAcesso(Value: Jjdom2_Element); cdecl;
    {class} function _GetEveDesc: Jjdom2_Element; cdecl;
    {class} procedure _SetEveDesc(Value: Jjdom2_Element); cdecl;
    {class} function _GetEveDh: Jjdom2_Element; cdecl;
    {class} procedure _SetEveDh(Value: Jjdom2_Element); cdecl;
    {class} function _GetEveFusoHorario: Jjdom2_Element; cdecl;
    {class} procedure _SetEveFusoHorario(Value: Jjdom2_Element); cdecl;
    {class} function _GetEveTp: Jjdom2_Element; cdecl;
    {class} procedure _SetEveTp(Value: Jjdom2_Element); cdecl;
    {class} function _GetEvedet: Jjdom2_Element; cdecl;
    {class} procedure _SetEvedet(Value: Jjdom2_Element); cdecl;
    {class} function _GetEvenProt: Jjdom2_Element; cdecl;
    {class} procedure _SetEvenProt(Value: Jjdom2_Element); cdecl;
    {class} function _GetEvento: Jjdom2_Element; cdecl;
    {class} procedure _SetEvento(Value: Jjdom2_Element); cdecl;
    {class} function _GetEvexJust: Jjdom2_Element; cdecl;
    {class} procedure _SetEvexJust(Value: Jjdom2_Element); cdecl;
    {class} function _GetNtfCnpjEmissor: Jjdom2_Element; cdecl;
    {class} procedure _SetNtfCnpjEmissor(Value: Jjdom2_Element); cdecl;
    {class} function _GetNtfSerie: Jjdom2_Element; cdecl;
    {class} procedure _SetNtfSerie(Value: Jjdom2_Element); cdecl;
    {class} function _GetVersao: Jjdom2_Element; cdecl;
    {class} procedure _SetVersao(Value: Jjdom2_Element); cdecl;
    {class} function _GettpAmb: Jjdom2_Element; cdecl;
    {class} procedure _SettpAmb(Value: Jjdom2_Element); cdecl;
    {class} function init: JElementosXmlCancelamento; cdecl;//Deprecated
    {class} property ChaAcesso: Jjdom2_Element read _GetChaAcesso write _SetChaAcesso;
    {class} property EveDesc: Jjdom2_Element read _GetEveDesc write _SetEveDesc;
    {class} property EveDh: Jjdom2_Element read _GetEveDh write _SetEveDh;
    {class} property EveFusoHorario: Jjdom2_Element read _GetEveFusoHorario write _SetEveFusoHorario;
    {class} property EveTp: Jjdom2_Element read _GetEveTp write _SetEveTp;
    {class} property Evedet: Jjdom2_Element read _GetEvedet write _SetEvedet;
    {class} property EvenProt: Jjdom2_Element read _GetEvenProt write _SetEvenProt;
    {class} property Evento: Jjdom2_Element read _GetEvento write _SetEvento;
    {class} property EvexJust: Jjdom2_Element read _GetEvexJust write _SetEvexJust;
    {class} property NtfCnpjEmissor: Jjdom2_Element read _GetNtfCnpjEmissor write _SetNtfCnpjEmissor;
    {class} property NtfSerie: Jjdom2_Element read _GetNtfSerie write _SetNtfSerie;
    {class} property Versao: Jjdom2_Element read _GetVersao write _SetVersao;
    {class} property tpAmb: Jjdom2_Element read _GettpAmb write _SettpAmb;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ElementosXmlCancelamento')]
  JElementosXmlCancelamento = interface(JObject)
    ['{279FB913-E650-460D-9EC5-8195FA6504B7}']
    function _GetEnvioEvento: Jjdom2_Element; cdecl;
    procedure _SetEnvioEvento(Value: Jjdom2_Element); cdecl;
    function _GetEveInf: Jjdom2_Element; cdecl;
    procedure _SetEveInf(Value: Jjdom2_Element); cdecl;
    function _GetEvenSeq: Jjdom2_Element; cdecl;
    procedure _SetEvenSeq(Value: Jjdom2_Element); cdecl;
    function _GetModeloDocumento: Jjdom2_Element; cdecl;
    procedure _SetModeloDocumento(Value: Jjdom2_Element); cdecl;
    function _GetNtfNumero: Jjdom2_Element; cdecl;
    procedure _SetNtfNumero(Value: Jjdom2_Element); cdecl;
    function retirarElemento(element: Jjdom2_Element): Boolean; cdecl;
    procedure vincularXml(b: Boolean); cdecl;
    property EnvioEvento: Jjdom2_Element read _GetEnvioEvento write _SetEnvioEvento;
    property EveInf: Jjdom2_Element read _GetEveInf write _SetEveInf;
    property EvenSeq: Jjdom2_Element read _GetEvenSeq write _SetEvenSeq;
    property ModeloDocumento: Jjdom2_Element read _GetModeloDocumento write _SetModeloDocumento;
    property NtfNumero: Jjdom2_Element read _GetNtfNumero write _SetNtfNumero;
  end;
  TJElementosXmlCancelamento = class(TJavaGenericImport<JElementosXmlCancelamentoClass, JElementosXmlCancelamento>) end;

  JEmailClass = interface(JTagsClass)
    ['{B8F29E10-CAD8-43DD-9612-27CED028CA9C}']
    {class} function init: JEmail; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Email')]
  JEmail = interface(JTags)
    ['{2256A715-AD2D-417B-B6BC-13EECE490684}']
    function getConta: JString; cdecl;
    function getPorta: JString; cdecl;
    function getSenha: JString; cdecl;
    function getServidor: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setConta(string_: JString); cdecl;
    procedure setPorta(string_: JString); cdecl;
    procedure setSenha(string_: JString); cdecl;
    procedure setServidor(string_: JString); cdecl;
  end;
  TJEmail = class(TJavaGenericImport<JEmailClass, JEmail>) end;

  JEmitAuxiliarClass = interface(JTagsClass)
    ['{89853662-2B52-47C3-AE86-BC5911F52132}']
    {class} function init: JEmitAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/EmitAuxiliar')]
  JEmitAuxiliar = interface(JTags)
    ['{7AE4764E-0C10-4C45-9628-07E29EC9FCC7}']
    function getCNPJ: JString; cdecl;
    function getCPF: JString; cdecl;
    function getCRT: JString; cdecl;
    function getIE: JString; cdecl;
    function getIM: JString; cdecl;
    function getxNome: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCNPJ(string_: JString); cdecl;
    procedure setCPF(string_: JString); cdecl;
    procedure setCRT(string_: JString); cdecl;
    procedure setIE(string_: JString); cdecl;
    procedure setIM(string_: JString); cdecl;
    procedure setxNome(string_: JString); cdecl;
  end;
  TJEmitAuxiliar = class(TJavaGenericImport<JEmitAuxiliarClass, JEmitAuxiliar>) end;

  JEnderEmitAuxiliarClass = interface(JTagsClass)
    ['{432613FA-C526-4F34-BF3A-CA41CD5FB76F}']
    {class} function init: JEnderEmitAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/EnderEmitAuxiliar')]
  JEnderEmitAuxiliar = interface(JTags)
    ['{DDAD79FC-0E75-4E7F-8686-B1CCA644B1B7}']
    function getCEP: JString; cdecl;
    function getNro: JString; cdecl;
    function getUF: JString; cdecl;
    function getcMun: JString; cdecl;
    function getxBairro: JString; cdecl;
    function getxLgr: JString; cdecl;
    function getxMun: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCEP(string_: JString); cdecl;
    procedure setNro(string_: JString); cdecl;
    procedure setUF(string_: JString); cdecl;
    procedure setcMun(string_: JString); cdecl;
    procedure setxBairro(string_: JString); cdecl;
    procedure setxLgr(string_: JString); cdecl;
    procedure setxMun(string_: JString); cdecl;
  end;
  TJEnderEmitAuxiliar = class(TJavaGenericImport<JEnderEmitAuxiliarClass, JEnderEmitAuxiliar>) end;

  JGOClass = interface(JTagsClass)
    ['{8E311B73-59D4-46D7-87EE-E3E9714FC5FB}']
    {class} function init: JGO; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/GO')]
  JGO = interface(JTags)
    ['{EF9D3694-C869-431D-8045-BAF78FDDCECF}']
    function getChaveConHomoGO: JString; cdecl;
    function getChaveConProdGO: JString; cdecl;
    function getHomoGO: JString; cdecl;
    function getProdGO: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoGO(string_: JString); cdecl;
    procedure setChaveConProdGO(string_: JString); cdecl;
    procedure setHomoGO(string_: JString); cdecl;
    procedure setProdGO(string_: JString); cdecl;
  end;
  TJGO = class(TJavaGenericImport<JGOClass, JGO>) end;

  JIcms00AuxiliarClass = interface(JTagsClass)
    ['{9137CAC0-4B44-44CB-9BA9-6E638A3DE40C}']
    {class} function init: JIcms00Auxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms00Auxiliar')]
  JIcms00Auxiliar = interface(JTags)
    ['{0C6CB680-87B7-48F3-9D1B-33CFEC2C3318}']
    function getCST: JString; cdecl;
    function getModBC: JString; cdecl;
    function getorig: JString; cdecl;
    function getpFCP: JString; cdecl;
    function getpICMS: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvFCP: JString; cdecl;
    function getvICMS: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setModBC(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpFCP(string_: JString); cdecl;
    procedure setpICMS(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvFCP(string_: JString); cdecl;
    procedure setvICMS(string_: JString); cdecl;
  end;
  TJIcms00Auxiliar = class(TJavaGenericImport<JIcms00AuxiliarClass, JIcms00Auxiliar>) end;

  JIcms10AuxiliarClass = interface(JTagsClass)
    ['{0F00D5A3-8EB4-494B-9C98-A5F6B69EC643}']
    {class} function _GetmodBC: JString; cdecl;
    {class} procedure _SetmodBC(Value: JString); cdecl;
    {class} function _GetpFCP: JString; cdecl;
    {class} procedure _SetpFCP(Value: JString); cdecl;
    {class} function _GetpFCPST: JString; cdecl;
    {class} procedure _SetpFCPST(Value: JString); cdecl;
    {class} function _GetpICMS: JString; cdecl;
    {class} procedure _SetpICMS(Value: JString); cdecl;
    {class} function _GetpMVAST: JString; cdecl;
    {class} procedure _SetpMVAST(Value: JString); cdecl;
    {class} function _GetpRedBCST: JString; cdecl;
    {class} procedure _SetpRedBCST(Value: JString); cdecl;
    {class} function _GetvBC: JString; cdecl;
    {class} procedure _SetvBC(Value: JString); cdecl;
    {class} function _GetvBCFCP: JString; cdecl;
    {class} procedure _SetvBCFCP(Value: JString); cdecl;
    {class} function _GetvBCFCPST: JString; cdecl;
    {class} procedure _SetvBCFCPST(Value: JString); cdecl;
    {class} function _GetvBCST: JString; cdecl;
    {class} procedure _SetvBCST(Value: JString); cdecl;
    {class} function _GetvFCP: JString; cdecl;
    {class} procedure _SetvFCP(Value: JString); cdecl;
    {class} function _GetvFCPST: JString; cdecl;
    {class} procedure _SetvFCPST(Value: JString); cdecl;
    {class} function _GetvICMSST: JString; cdecl;
    {class} procedure _SetvICMSST(Value: JString); cdecl;
    {class} function init: JIcms10Auxiliar; cdecl;//Deprecated
    {class} property modBC: JString read _GetmodBC write _SetmodBC;
    {class} property pFCP: JString read _GetpFCP write _SetpFCP;
    {class} property pFCPST: JString read _GetpFCPST write _SetpFCPST;
    {class} property pICMS: JString read _GetpICMS write _SetpICMS;
    {class} property pMVAST: JString read _GetpMVAST write _SetpMVAST;
    {class} property pRedBCST: JString read _GetpRedBCST write _SetpRedBCST;
    {class} property vBC: JString read _GetvBC write _SetvBC;
    {class} property vBCFCP: JString read _GetvBCFCP write _SetvBCFCP;
    {class} property vBCFCPST: JString read _GetvBCFCPST write _SetvBCFCPST;
    {class} property vBCST: JString read _GetvBCST write _SetvBCST;
    {class} property vFCP: JString read _GetvFCP write _SetvFCP;
    {class} property vFCPST: JString read _GetvFCPST write _SetvFCPST;
    {class} property vICMSST: JString read _GetvICMSST write _SetvICMSST;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms10Auxiliar')]
  JIcms10Auxiliar = interface(JTags)
    ['{77D16D51-73C4-443C-91F4-2457E0E5DCB8}']
    function getCST: JString; cdecl;
    function getModBC: JString; cdecl;
    function getModBCST: JString; cdecl;
    function getorig: JString; cdecl;
    function getpFCP: JString; cdecl;
    function getpFCPST: JString; cdecl;
    function getpICMS: JString; cdecl;
    function getpICMSST: JString; cdecl;
    function getpMVAST: JString; cdecl;
    function getpRedBCST: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvBCFCP: JString; cdecl;
    function getvBCFCPST: JString; cdecl;
    function getvBCST: JString; cdecl;
    function getvFCP: JString; cdecl;
    function getvFCPST: JString; cdecl;
    function getvICMS: JString; cdecl;
    function getvICMSST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setModBC(string_: JString); cdecl;
    procedure setModBCST(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpFCP(string_: JString); cdecl;
    procedure setpFCPST(string_: JString); cdecl;
    procedure setpICMS(string_: JString); cdecl;
    procedure setpICMSST(string_: JString); cdecl;
    procedure setpMVAST(string_: JString); cdecl;
    procedure setpRedBCST(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvBCFCP(string_: JString); cdecl;
    procedure setvBCFCPST(string_: JString); cdecl;
    procedure setvBCST(string_: JString); cdecl;
    procedure setvFCP(string_: JString); cdecl;
    procedure setvFCPST(string_: JString); cdecl;
    procedure setvICMS(string_: JString); cdecl;
    procedure setvICMSST(string_: JString); cdecl;
  end;
  TJIcms10Auxiliar = class(TJavaGenericImport<JIcms10AuxiliarClass, JIcms10Auxiliar>) end;

  JIcms20AuxiliarClass = interface(JTagsClass)
    ['{30E15FAA-4AA4-4F6D-BAF2-FBE9527DA10E}']
    {class} function _GetmodBC: JString; cdecl;
    {class} procedure _SetmodBC(Value: JString); cdecl;
    {class} function _GetmotDesICMS: JString; cdecl;
    {class} procedure _SetmotDesICMS(Value: JString); cdecl;
    {class} function _GetpFCP: JString; cdecl;
    {class} procedure _SetpFCP(Value: JString); cdecl;
    {class} function _GetpRedBC20: JString; cdecl;
    {class} procedure _SetpRedBC20(Value: JString); cdecl;
    {class} function _GetvBC: JString; cdecl;
    {class} procedure _SetvBC(Value: JString); cdecl;
    {class} function _GetvBCFCP: JString; cdecl;
    {class} procedure _SetvBCFCP(Value: JString); cdecl;
    {class} function _GetvICMS: JString; cdecl;
    {class} procedure _SetvICMS(Value: JString); cdecl;
    {class} function _GetvICMSDeson: JString; cdecl;
    {class} procedure _SetvICMSDeson(Value: JString); cdecl;
    {class} function init: JIcms20Auxiliar; cdecl;//Deprecated
    {class} property modBC: JString read _GetmodBC write _SetmodBC;
    {class} property motDesICMS: JString read _GetmotDesICMS write _SetmotDesICMS;
    {class} property pFCP: JString read _GetpFCP write _SetpFCP;
    {class} property pRedBC20: JString read _GetpRedBC20 write _SetpRedBC20;
    {class} property vBC: JString read _GetvBC write _SetvBC;
    {class} property vBCFCP: JString read _GetvBCFCP write _SetvBCFCP;
    {class} property vICMS: JString read _GetvICMS write _SetvICMS;
    {class} property vICMSDeson: JString read _GetvICMSDeson write _SetvICMSDeson;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms20Auxiliar')]
  JIcms20Auxiliar = interface(JTags)
    ['{37E25042-53D6-4DDA-BB2D-1CDE387935F9}']
    function getCST: JString; cdecl;
    function getModBC: JString; cdecl;
    function getmotDesICMS: JString; cdecl;
    function getorig: JString; cdecl;
    function getpFCP: JString; cdecl;
    function getpICMS: JString; cdecl;
    function getpRedBC20: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvBCFCP: JString; cdecl;
    function getvFCP: JString; cdecl;
    function getvICMS: JString; cdecl;
    function getvICMSDeson: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setModBC(string_: JString); cdecl;
    procedure setmotDesICMS(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpFCP(string_: JString); cdecl;
    procedure setpICMS(string_: JString); cdecl;
    procedure setpRedBC20(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvBCFCP(string_: JString); cdecl;
    procedure setvFCP(string_: JString); cdecl;
    procedure setvICMS(string_: JString); cdecl;
    procedure setvICMSDeson(string_: JString); cdecl;
  end;
  TJIcms20Auxiliar = class(TJavaGenericImport<JIcms20AuxiliarClass, JIcms20Auxiliar>) end;

  JIcms30AuxiliarClass = interface(JTagsClass)
    ['{0AFED840-F3F7-43B4-911A-51B9FBC72AD8}']
    {class} function _GetmodBCST: JString; cdecl;
    {class} procedure _SetmodBCST(Value: JString); cdecl;
    {class} function _GetmotDesICMS: JString; cdecl;
    {class} procedure _SetmotDesICMS(Value: JString); cdecl;
    {class} function _GetpICMSST: JString; cdecl;
    {class} procedure _SetpICMSST(Value: JString); cdecl;
    {class} function _GetpMVAST: JString; cdecl;
    {class} procedure _SetpMVAST(Value: JString); cdecl;
    {class} function _GetpRedBCST: JString; cdecl;
    {class} procedure _SetpRedBCST(Value: JString); cdecl;
    {class} function _GetvBCFCPST: JString; cdecl;
    {class} procedure _SetvBCFCPST(Value: JString); cdecl;
    {class} function _GetvFCPST: JString; cdecl;
    {class} procedure _SetvFCPST(Value: JString); cdecl;
    {class} function _GetvICMSDeson: JString; cdecl;
    {class} procedure _SetvICMSDeson(Value: JString); cdecl;
    {class} function _GetvICMSST: JString; cdecl;
    {class} procedure _SetvICMSST(Value: JString); cdecl;
    {class} function init: JIcms30Auxiliar; cdecl;
    {class} property modBCST: JString read _GetmodBCST write _SetmodBCST;
    {class} property motDesICMS: JString read _GetmotDesICMS write _SetmotDesICMS;
    {class} property pICMSST: JString read _GetpICMSST write _SetpICMSST;
    {class} property pMVAST: JString read _GetpMVAST write _SetpMVAST;
    {class} property pRedBCST: JString read _GetpRedBCST write _SetpRedBCST;
    {class} property vBCFCPST: JString read _GetvBCFCPST write _SetvBCFCPST;
    {class} property vFCPST: JString read _GetvFCPST write _SetvFCPST;
    {class} property vICMSDeson: JString read _GetvICMSDeson write _SetvICMSDeson;
    {class} property vICMSST: JString read _GetvICMSST write _SetvICMSST;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms30Auxiliar')]
  JIcms30Auxiliar = interface(JTags)
    ['{A01D2223-A059-4F54-9644-B8A93018984C}']
    function getCST: JString; cdecl;
    function getModBCST: JString; cdecl;
    function getmotDesICMS: JString; cdecl;
    function getorig: JString; cdecl;
    function getpFCPST: JString; cdecl;
    function getpICMSST: JString; cdecl;
    function getpMVAST: JString; cdecl;
    function getpRedBCST: JString; cdecl;
    function getvBCFCPST: JString; cdecl;
    function getvBCST: JString; cdecl;
    function getvFCPST: JString; cdecl;
    function getvICMSDeson: JString; cdecl;
    function getvICMSST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setModBCST(string_: JString); cdecl;
    procedure setmotDesICMS(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpFCPST(string_: JString); cdecl;
    procedure setpICMSST(string_: JString); cdecl;
    procedure setpMVAST(string_: JString); cdecl;
    procedure setpRedBCST(string_: JString); cdecl;
    procedure setvBCFCPST(string_: JString); cdecl;
    procedure setvBCST(string_: JString); cdecl;
    procedure setvFCPST(string_: JString); cdecl;
    procedure setvICMSDeson(string_: JString); cdecl;
    procedure setvICMSST(string_: JString); cdecl;
  end;
  TJIcms30Auxiliar = class(TJavaGenericImport<JIcms30AuxiliarClass, JIcms30Auxiliar>) end;

  JIcms40AuxiliarClass = interface(JTagsClass)
    ['{9E649AE9-7032-4CC9-8CCC-E02C08B257B7}']
    {class} function _GetmotDesICMS: JString; cdecl;
    {class} procedure _SetmotDesICMS(Value: JString); cdecl;
    {class} function _GetvICMSDeson: JString; cdecl;
    {class} procedure _SetvICMSDeson(Value: JString); cdecl;
    {class} function init: JIcms40Auxiliar; cdecl;//Deprecated
    {class} property motDesICMS: JString read _GetmotDesICMS write _SetmotDesICMS;
    {class} property vICMSDeson: JString read _GetvICMSDeson write _SetvICMSDeson;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms40Auxiliar')]
  JIcms40Auxiliar = interface(JTags)
    ['{959F8410-3E64-46A0-BC3F-E4E789F85541}']
    function getCST: JString; cdecl;
    function getMotDesICMS: JString; cdecl;
    function getorig: JString; cdecl;
    function getvICMSDeson: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setMotDesICMS(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setvICMSDeson(string_: JString); cdecl;
  end;
  TJIcms40Auxiliar = class(TJavaGenericImport<JIcms40AuxiliarClass, JIcms40Auxiliar>) end;

  JIcms51AuxiliarClass = interface(JTagsClass)
    ['{1496E517-D472-45DD-9A1D-8E62624F5C2E}']
    {class} function _GetmodBC: JString; cdecl;
    {class} procedure _SetmodBC(Value: JString); cdecl;
    {class} function _GetpDif: JString; cdecl;
    {class} procedure _SetpDif(Value: JString); cdecl;
    {class} function _GetpFCP: JString; cdecl;
    {class} procedure _SetpFCP(Value: JString); cdecl;
    {class} function _GetpRedBC: JString; cdecl;
    {class} procedure _SetpRedBC(Value: JString); cdecl;
    {class} function _GetvBC: JString; cdecl;
    {class} procedure _SetvBC(Value: JString); cdecl;
    {class} function _GetvBCFCP: JString; cdecl;
    {class} procedure _SetvBCFCP(Value: JString); cdecl;
    {class} function _GetvFCP: JString; cdecl;
    {class} procedure _SetvFCP(Value: JString); cdecl;
    {class} function _GetvICMSDif: JString; cdecl;
    {class} procedure _SetvICMSDif(Value: JString); cdecl;
    {class} function _GetvICMSOp: JString; cdecl;
    {class} procedure _SetvICMSOp(Value: JString); cdecl;
    {class} function init: JIcms51Auxiliar; cdecl;
    {class} property modBC: JString read _GetmodBC write _SetmodBC;
    {class} property pDif: JString read _GetpDif write _SetpDif;
    {class} property pFCP: JString read _GetpFCP write _SetpFCP;
    {class} property pRedBC: JString read _GetpRedBC write _SetpRedBC;
    {class} property vBC: JString read _GetvBC write _SetvBC;
    {class} property vBCFCP: JString read _GetvBCFCP write _SetvBCFCP;
    {class} property vFCP: JString read _GetvFCP write _SetvFCP;
    {class} property vICMSDif: JString read _GetvICMSDif write _SetvICMSDif;
    {class} property vICMSOp: JString read _GetvICMSOp write _SetvICMSOp;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms51Auxiliar')]
  JIcms51Auxiliar = interface(JTags)
    ['{3F7737B5-4AA9-4918-9452-787452D2B807}']
    function getCST: JString; cdecl;
    function getModBC: JString; cdecl;
    function getorig: JString; cdecl;
    function getpDif: JString; cdecl;
    function getpFCP: JString; cdecl;
    function getpICMS: JString; cdecl;
    function getpRedBC: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvBCFCP: JString; cdecl;
    function getvFCP: JString; cdecl;
    function getvICMS: JString; cdecl;
    function getvICMSDif: JString; cdecl;
    function getvICMSOp: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setModBC(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpDif(string_: JString); cdecl;
    procedure setpFCP(string_: JString); cdecl;
    procedure setpICMS(string_: JString); cdecl;
    procedure setpRedBC(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvBCFCP(string_: JString); cdecl;
    procedure setvFCP(string_: JString); cdecl;
    procedure setvICMS(string_: JString); cdecl;
    procedure setvICMSDif(string_: JString); cdecl;
    procedure setvICMSOp(string_: JString); cdecl;
  end;
  TJIcms51Auxiliar = class(TJavaGenericImport<JIcms51AuxiliarClass, JIcms51Auxiliar>) end;

  JIcms60AuxiliarClass = interface(JTagsClass)
    ['{4A073294-EAD0-4600-931A-C11D51ECD95F}']
    {class} function _GetpFCPSTRet: JString; cdecl;
    {class} procedure _SetpFCPSTRet(Value: JString); cdecl;
    {class} function _GetpICMSEfet: JString; cdecl;
    {class} procedure _SetpICMSEfet(Value: JString); cdecl;
    {class} function _GetpST: JString; cdecl;
    {class} procedure _SetpST(Value: JString); cdecl;
    {class} function _GetvBCEfet: JString; cdecl;
    {class} procedure _SetvBCEfet(Value: JString); cdecl;
    {class} function _GetvBCFCPSTRet: JString; cdecl;
    {class} procedure _SetvBCFCPSTRet(Value: JString); cdecl;
    {class} function _GetvBCSTRet: JString; cdecl;
    {class} procedure _SetvBCSTRet(Value: JString); cdecl;
    {class} function _GetvFCPSTRet: JString; cdecl;
    {class} procedure _SetvFCPSTRet(Value: JString); cdecl;
    {class} function _GetvICMSEfet: JString; cdecl;
    {class} procedure _SetvICMSEfet(Value: JString); cdecl;
    {class} function _GetvICMSSubstituto: JString; cdecl;
    {class} procedure _SetvICMSSubstituto(Value: JString); cdecl;
    {class} function init: JIcms60Auxiliar; cdecl;
    {class} property pFCPSTRet: JString read _GetpFCPSTRet write _SetpFCPSTRet;
    {class} property pICMSEfet: JString read _GetpICMSEfet write _SetpICMSEfet;
    {class} property pST: JString read _GetpST write _SetpST;
    {class} property vBCEfet: JString read _GetvBCEfet write _SetvBCEfet;
    {class} property vBCFCPSTRet: JString read _GetvBCFCPSTRet write _SetvBCFCPSTRet;
    {class} property vBCSTRet: JString read _GetvBCSTRet write _SetvBCSTRet;
    {class} property vFCPSTRet: JString read _GetvFCPSTRet write _SetvFCPSTRet;
    {class} property vICMSEfet: JString read _GetvICMSEfet write _SetvICMSEfet;
    {class} property vICMSSubstituto: JString read _GetvICMSSubstituto write _SetvICMSSubstituto;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms60Auxiliar')]
  JIcms60Auxiliar = interface(JTags)
    ['{29D82E42-045B-44B7-A5CB-BCB45A980291}']
    function getCST: JString; cdecl;
    function getorig: JString; cdecl;
    function getpFCPSTRet: JString; cdecl;
    function getpICMSEfet: JString; cdecl;
    function getpRedBCEfet: JString; cdecl;
    function getpST: JString; cdecl;
    function getvBCEfet: JString; cdecl;
    function getvBCFCPSTRet: JString; cdecl;
    function getvBCSTRet: JString; cdecl;
    function getvFCPSTRet: JString; cdecl;
    function getvICMSEfet: JString; cdecl;
    function getvICMSSTRet: JString; cdecl;
    function getvICMSSubstituto: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpFCPSTRet(string_: JString); cdecl;
    procedure setpICMSEfet(string_: JString); cdecl;
    procedure setpRedBCEfet(string_: JString); cdecl;
    procedure setpST(string_: JString); cdecl;
    procedure setvBCEfet(string_: JString); cdecl;
    procedure setvBCFCPSTRet(string_: JString); cdecl;
    procedure setvBCSTRet(string_: JString); cdecl;
    procedure setvFCPSTRet(string_: JString); cdecl;
    procedure setvICMSEfet(string_: JString); cdecl;
    procedure setvICMSSTRet(string_: JString); cdecl;
    procedure setvICMSSubstituto(string_: JString); cdecl;
  end;
  TJIcms60Auxiliar = class(TJavaGenericImport<JIcms60AuxiliarClass, JIcms60Auxiliar>) end;

  JIcms70AuxiliarClass = interface(JTagsClass)
    ['{A77EAC75-0716-4163-BA7A-5A8DB2DD956F}']
    {class} function init: JIcms70Auxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms70Auxiliar')]
  JIcms70Auxiliar = interface(JTags)
    ['{BAD8B5D7-A33B-4E31-9118-FA2679537D50}']
    function getCST: JString; cdecl;
    function getModBC: JString; cdecl;
    function getModBCST: JString; cdecl;
    function getmotDesICMS: JString; cdecl;
    function getorig: JString; cdecl;
    function getpFCP: JString; cdecl;
    function getpFCPST: JString; cdecl;
    function getpICMS: JString; cdecl;
    function getpICMSST: JString; cdecl;
    function getpMVAST: JString; cdecl;
    function getpRedBC: JString; cdecl;
    function getpRedBCST: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvBCFCP: JString; cdecl;
    function getvBCFCPST: JString; cdecl;
    function getvBCST: JString; cdecl;
    function getvFCP: JString; cdecl;
    function getvFCPST: JString; cdecl;
    function getvICMS: JString; cdecl;
    function getvICMSDeson: JString; cdecl;
    function getvICMSST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setModBC(string_: JString); cdecl;
    procedure setModBCST(string_: JString); cdecl;
    procedure setmotDesICMS(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpFCP(string_: JString); cdecl;
    procedure setpFCPST(string_: JString); cdecl;
    procedure setpICMS(string_: JString); cdecl;
    procedure setpICMSST(string_: JString); cdecl;
    procedure setpMVAST(string_: JString); cdecl;
    procedure setpRedBC(string_: JString); cdecl;
    procedure setpRedBCST(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvBCFCP(string_: JString); cdecl;
    procedure setvBCFCPST(string_: JString); cdecl;
    procedure setvBCST(string_: JString); cdecl;
    procedure setvFCP(string_: JString); cdecl;
    procedure setvFCPST(string_: JString); cdecl;
    procedure setvICMS(string_: JString); cdecl;
    procedure setvICMSDeson(string_: JString); cdecl;
    procedure setvICMSST(string_: JString); cdecl;
  end;
  TJIcms70Auxiliar = class(TJavaGenericImport<JIcms70AuxiliarClass, JIcms70Auxiliar>) end;

  JIcms90AuxiliarClass = interface(JTagsClass)
    ['{14D0FC18-99A1-4903-89E7-67E12A16E15B}']
    {class} function init: JIcms90Auxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms90Auxiliar')]
  JIcms90Auxiliar = interface(JTags)
    ['{5457FD60-30C3-449B-ADA5-630F6ADBAE63}']
    function getCST: JString; cdecl;
    function getModBC: JString; cdecl;
    function getModBCST: JString; cdecl;
    function getmotDesICMS: JString; cdecl;
    function getorig: JString; cdecl;
    function getpFCP: JString; cdecl;
    function getpFCPST: JString; cdecl;
    function getpICMS: JString; cdecl;
    function getpICMSST: JString; cdecl;
    function getpMVAST: JString; cdecl;
    function getpRedBC: JString; cdecl;
    function getpRedBCST: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvBCFCP: JString; cdecl;
    function getvBCFCPST: JString; cdecl;
    function getvBCST: JString; cdecl;
    function getvFCP: JString; cdecl;
    function getvFCPST: JString; cdecl;
    function getvICMS: JString; cdecl;
    function getvICMSDeson: JString; cdecl;
    function getvICMSST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setModBC(string_: JString); cdecl;
    procedure setModBCST(string_: JString); cdecl;
    procedure setmotDesICMS(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpFCP(string_: JString); cdecl;
    procedure setpFCPST(string_: JString); cdecl;
    procedure setpICMS(string_: JString); cdecl;
    procedure setpICMSST(string_: JString); cdecl;
    procedure setpMVAST(string_: JString); cdecl;
    procedure setpRedBC(string_: JString); cdecl;
    procedure setpRedBCST(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvBCFCP(string_: JString); cdecl;
    procedure setvBCFCPST(string_: JString); cdecl;
    procedure setvBCST(string_: JString); cdecl;
    procedure setvFCP(string_: JString); cdecl;
    procedure setvFCPST(string_: JString); cdecl;
    procedure setvICMS(string_: JString); cdecl;
    procedure setvICMSDeson(string_: JString); cdecl;
    procedure setvICMSST(string_: JString); cdecl;
  end;
  TJIcms90Auxiliar = class(TJavaGenericImport<JIcms90AuxiliarClass, JIcms90Auxiliar>) end;

  JIcmsPartAuxiliarClass = interface(JTagsClass)
    ['{399C8E5A-378A-4AC7-8AA6-7E106F614BE5}']
    {class} function init: JIcmsPartAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsPartAuxiliar')]
  JIcmsPartAuxiliar = interface(JTags)
    ['{430641C3-136C-47AE-9C9A-E0B1E788BA1A}']
    function getCST: JString; cdecl;
    function getModBC: JString; cdecl;
    function getModBCST: JString; cdecl;
    function getUFST: JString; cdecl;
    function getorig: JString; cdecl;
    function getpBCOp: JString; cdecl;
    function getpICMS: JString; cdecl;
    function getpICMSST: JString; cdecl;
    function getpMVAST: JString; cdecl;
    function getpRedBC: JString; cdecl;
    function getpRedBCST: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvBCST: JString; cdecl;
    function getvICMS: JString; cdecl;
    function getvICMSST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setModBC(string_: JString); cdecl;
    procedure setModBCST(string_: JString); cdecl;
    procedure setUFST(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpBCOp(string_: JString); cdecl;
    procedure setpICMS(string_: JString); cdecl;
    procedure setpICMSST(string_: JString); cdecl;
    procedure setpMVAST(string_: JString); cdecl;
    procedure setpRedBC(string_: JString); cdecl;
    procedure setpRedBCST(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvBCST(string_: JString); cdecl;
    procedure setvICMS(string_: JString); cdecl;
    procedure setvICMSST(string_: JString); cdecl;
  end;
  TJIcmsPartAuxiliar = class(TJavaGenericImport<JIcmsPartAuxiliarClass, JIcmsPartAuxiliar>) end;

  JIcmsSn101AuxiliarClass = interface(JTagsClass)
    ['{C1B26470-42AB-43B8-BB4B-96766E202F5D}']
    {class} function init: JIcmsSn101Auxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn101Auxiliar')]
  JIcmsSn101Auxiliar = interface(JTags)
    ['{A0E340FF-49C9-478E-805A-194F7945B793}']
    function getCSOSN: JString; cdecl;
    function getorig: JString; cdecl;
    function getpCredSN: JString; cdecl;
    function getvCredICMSSN: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCSOSN(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpCredSN(string_: JString); cdecl;
    procedure setvCredICMSSN(string_: JString); cdecl;
  end;
  TJIcmsSn101Auxiliar = class(TJavaGenericImport<JIcmsSn101AuxiliarClass, JIcmsSn101Auxiliar>) end;

  JIcmsSn102AuxiliarClass = interface(JTagsClass)
    ['{91C687EF-A874-495E-8E1C-3E4E3C6E9746}']
    {class} function init: JIcmsSn102Auxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn102Auxiliar')]
  JIcmsSn102Auxiliar = interface(JTags)
    ['{9E7265CC-0CC7-4E37-9F2E-141139E3BC7E}']
    function getCSOSN: JString; cdecl;
    function getorig: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCSOSN(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
  end;
  TJIcmsSn102Auxiliar = class(TJavaGenericImport<JIcmsSn102AuxiliarClass, JIcmsSn102Auxiliar>) end;

  JIcmsSn201AuxiliarClass = interface(JTagsClass)
    ['{2A0A0D26-03FE-46C1-8418-F29172417089}']
    {class} function init: JIcmsSn201Auxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn201Auxiliar')]
  JIcmsSn201Auxiliar = interface(JTags)
    ['{1B8F2509-150C-4083-9E46-44E716596416}']
    function getCSOSN: JString; cdecl;
    function getModBCST: JString; cdecl;
    function getorig: JString; cdecl;
    function getpCredSN: JString; cdecl;
    function getpFCPST: JString; cdecl;
    function getpICMSST: JString; cdecl;
    function getpMVAST: JString; cdecl;
    function getpRedBCST: JString; cdecl;
    function getvBCFCPST: JString; cdecl;
    function getvBCST: JString; cdecl;
    function getvCredICMSSN: JString; cdecl;
    function getvFCPST: JString; cdecl;
    function getvICMSST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCSOSN(string_: JString); cdecl;
    procedure setModBCST(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpCredSN(string_: JString); cdecl;
    procedure setpFCPST(string_: JString); cdecl;
    procedure setpICMSST(string_: JString); cdecl;
    procedure setpMVAST(string_: JString); cdecl;
    procedure setpRedBCST(string_: JString); cdecl;
    procedure setvBCFCPST(string_: JString); cdecl;
    procedure setvBCST(string_: JString); cdecl;
    procedure setvCredICMSSN(string_: JString); cdecl;
    procedure setvFCPST(string_: JString); cdecl;
    procedure setvICMSST(string_: JString); cdecl;
  end;
  TJIcmsSn201Auxiliar = class(TJavaGenericImport<JIcmsSn201AuxiliarClass, JIcmsSn201Auxiliar>) end;

  JIcmsSn202AuxiliarClass = interface(JTagsClass)
    ['{26AA9D27-6231-4A2D-AA9A-148DF8EBE14B}']
    {class} function _GetmodBCST: JString; cdecl;
    {class} procedure _SetmodBCST(Value: JString); cdecl;
    {class} function _GetvFCPST: JString; cdecl;
    {class} procedure _SetvFCPST(Value: JString); cdecl;
    {class} function init: JIcmsSn202Auxiliar; cdecl;//Deprecated
    {class} property modBCST: JString read _GetmodBCST write _SetmodBCST;
    {class} property vFCPST: JString read _GetvFCPST write _SetvFCPST;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn202Auxiliar')]
  JIcmsSn202Auxiliar = interface(JTags)
    ['{A48DEA7E-4EE6-47F2-8D5E-4F7E9B7425CE}']
    function getCSOSN: JString; cdecl;
    function getModBCST: JString; cdecl;
    function getorig: JString; cdecl;
    function getpFCPST: JString; cdecl;
    function getpICMSST: JString; cdecl;
    function getpMVAST: JString; cdecl;
    function getpRedBCST: JString; cdecl;
    function getvBCFCPST: JString; cdecl;
    function getvBCST: JString; cdecl;
    function getvFCPST: JString; cdecl;
    function getvICMSST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCSOSN(string_: JString); cdecl;
    procedure setModBCST(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpFCPST(string_: JString); cdecl;
    procedure setpICMSST(string_: JString); cdecl;
    procedure setpMVAST(string_: JString); cdecl;
    procedure setpRedBCST(string_: JString); cdecl;
    procedure setvBCFCPST(string_: JString); cdecl;
    procedure setvBCST(string_: JString); cdecl;
    procedure setvFCPST(string_: JString); cdecl;
    procedure setvICMSST(string_: JString); cdecl;
  end;
  TJIcmsSn202Auxiliar = class(TJavaGenericImport<JIcmsSn202AuxiliarClass, JIcmsSn202Auxiliar>) end;

  JIcmsSn500AuxiliarClass = interface(JTagsClass)
    ['{351C58F0-107B-446E-8E94-5441890BB030}']
    {class} function _GetpFCPSTRet: JString; cdecl;
    {class} procedure _SetpFCPSTRet(Value: JString); cdecl;
    {class} function _GetpICMSEfet: JString; cdecl;
    {class} procedure _SetpICMSEfet(Value: JString); cdecl;
    {class} function _GetpST: JString; cdecl;
    {class} procedure _SetpST(Value: JString); cdecl;
    {class} function _GetvBCEfet: JString; cdecl;
    {class} procedure _SetvBCEfet(Value: JString); cdecl;
    {class} function _GetvBCFCPSTRet: JString; cdecl;
    {class} procedure _SetvBCFCPSTRet(Value: JString); cdecl;
    {class} function _GetvBCSTRet: JString; cdecl;
    {class} procedure _SetvBCSTRet(Value: JString); cdecl;
    {class} function _GetvFCPSTRet: JString; cdecl;
    {class} procedure _SetvFCPSTRet(Value: JString); cdecl;
    {class} function _GetvICMSEfet: JString; cdecl;
    {class} procedure _SetvICMSEfet(Value: JString); cdecl;
    {class} function _GetvICMSSubstituto: JString; cdecl;
    {class} procedure _SetvICMSSubstituto(Value: JString); cdecl;
    {class} function init: JIcmsSn500Auxiliar; cdecl;
    {class} property pFCPSTRet: JString read _GetpFCPSTRet write _SetpFCPSTRet;
    {class} property pICMSEfet: JString read _GetpICMSEfet write _SetpICMSEfet;
    {class} property pST: JString read _GetpST write _SetpST;
    {class} property vBCEfet: JString read _GetvBCEfet write _SetvBCEfet;
    {class} property vBCFCPSTRet: JString read _GetvBCFCPSTRet write _SetvBCFCPSTRet;
    {class} property vBCSTRet: JString read _GetvBCSTRet write _SetvBCSTRet;
    {class} property vFCPSTRet: JString read _GetvFCPSTRet write _SetvFCPSTRet;
    {class} property vICMSEfet: JString read _GetvICMSEfet write _SetvICMSEfet;
    {class} property vICMSSubstituto: JString read _GetvICMSSubstituto write _SetvICMSSubstituto;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn500Auxiliar')]
  JIcmsSn500Auxiliar = interface(JTags)
    ['{2DF08F57-BA3F-47D2-AADF-C14172386680}']
    function getCSOSN: JString; cdecl;
    function getOrig: JString; cdecl;
    function getpFCPSTRet: JString; cdecl;
    function getpICMSEfet: JString; cdecl;
    function getpRedBCEfet: JString; cdecl;
    function getpST: JString; cdecl;
    function getvBCEfet: JString; cdecl;
    function getvBCFCPSTRet: JString; cdecl;
    function getvBCSTRet: JString; cdecl;
    function getvFCPSTRet: JString; cdecl;
    function getvICMSEfet: JString; cdecl;
    function getvICMSSTRet: JString; cdecl;
    function getvICMSSubstituto: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCSOSN(string_: JString); cdecl;
    procedure setOrig(string_: JString); cdecl;
    procedure setpFCPSTRet(string_: JString); cdecl;
    procedure setpICMSEfet(string_: JString); cdecl;
    procedure setpRedBCEfet(string_: JString); cdecl;
    procedure setpST(string_: JString); cdecl;
    procedure setvBCEfet(string_: JString); cdecl;
    procedure setvBCFCPSTRet(string_: JString); cdecl;
    procedure setvBCSTRet(string_: JString); cdecl;
    procedure setvFCPSTRet(string_: JString); cdecl;
    procedure setvICMSEfet(string_: JString); cdecl;
    procedure setvICMSSTRet(string_: JString); cdecl;
    procedure setvICMSSubstituto(string_: JString); cdecl;
  end;
  TJIcmsSn500Auxiliar = class(TJavaGenericImport<JIcmsSn500AuxiliarClass, JIcmsSn500Auxiliar>) end;

  JIcmsSn900AuxiliarClass = interface(JTagsClass)
    ['{E0DA15EB-3BDF-40E6-BEA9-9DB28FEC188E}']
    {class} function _GetmodBC: JString; cdecl;
    {class} procedure _SetmodBC(Value: JString); cdecl;
    {class} function _GetpRedBC: JString; cdecl;
    {class} procedure _SetpRedBC(Value: JString); cdecl;
    {class} function _GetvBC: JString; cdecl;
    {class} procedure _SetvBC(Value: JString); cdecl;
    {class} function init: JIcmsSn900Auxiliar; cdecl;//Deprecated
    {class} property modBC: JString read _GetmodBC write _SetmodBC;
    {class} property pRedBC: JString read _GetpRedBC write _SetpRedBC;
    {class} property vBC: JString read _GetvBC write _SetvBC;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn900Auxiliar')]
  JIcmsSn900Auxiliar = interface(JTags)
    ['{8C08FABE-6E00-4D45-BD88-3D8D161C2CA2}']
    function getCSOSN: JString; cdecl;
    function getModBC: JString; cdecl;
    function getModBCST: JString; cdecl;
    function getorig: JString; cdecl;
    function getpCredSN: JString; cdecl;
    function getpFCPST: JString; cdecl;
    function getpICMS: JString; cdecl;
    function getpICMSST: JString; cdecl;
    function getpMVAST: JString; cdecl;
    function getpRedBC: JString; cdecl;
    function getpRedBCST: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvBCFCPST: JString; cdecl;
    function getvBCST: JString; cdecl;
    function getvCredICMSSN: JString; cdecl;
    function getvFCPST: JString; cdecl;
    function getvICMS: JString; cdecl;
    function getvICMSST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCSOSN(string_: JString); cdecl;
    procedure setModBC(string_: JString); cdecl;
    procedure setModBCST(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setpCredSN(string_: JString); cdecl;
    procedure setpFCPST(string_: JString); cdecl;
    procedure setpICMS(string_: JString); cdecl;
    procedure setpICMSST(string_: JString); cdecl;
    procedure setpMVAST(string_: JString); cdecl;
    procedure setpRedBC(string_: JString); cdecl;
    procedure setpRedBCST(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvBCFCPST(string_: JString); cdecl;
    procedure setvBCST(string_: JString); cdecl;
    procedure setvCredICMSSN(string_: JString); cdecl;
    procedure setvFCPST(string_: JString); cdecl;
    procedure setvICMS(string_: JString); cdecl;
    procedure setvICMSST(string_: JString); cdecl;
  end;
  TJIcmsSn900Auxiliar = class(TJavaGenericImport<JIcmsSn900AuxiliarClass, JIcmsSn900Auxiliar>) end;

  JIcmsStAuxiliarClass = interface(JTagsClass)
    ['{642D5E70-0313-43CA-A482-6BC9F2FA632F}']
    {class} function init: JIcmsStAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsStAuxiliar')]
  JIcmsStAuxiliar = interface(JTags)
    ['{91FE1723-7B9F-49EF-A46F-E724BA315EAC}']
    function getCST: JString; cdecl;
    function getorig: JString; cdecl;
    function getvBCSTDest: JString; cdecl;
    function getvBCSTRet: JString; cdecl;
    function getvICMSSTDest: JString; cdecl;
    function getvICMSSTRet: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
    procedure setvBCSTDest(string_: JString); cdecl;
    procedure setvBCSTRet(string_: JString); cdecl;
    procedure setvICMSSTDest(string_: JString); cdecl;
    procedure setvICMSSTRet(string_: JString); cdecl;
  end;
  TJIcmsStAuxiliar = class(TJavaGenericImport<JIcmsStAuxiliarClass, JIcmsStAuxiliar>) end;

  JInfRespTecAuxiliarClass = interface(JTagsClass)
    ['{FA716ABB-EA96-45D7-975C-9AE7322B61F5}']
    {class} function init: JInfRespTecAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/InfRespTecAuxiliar')]
  JInfRespTecAuxiliar = interface(JTags)
    ['{058A9142-8263-4F37-9E38-F97C2754069D}']
    function getCNPJ: JString; cdecl;
    function getCSRT: JString; cdecl;
    function getContato: JString; cdecl;
    function getEmail: JString; cdecl;
    function getFone: JString; cdecl;
    function getIdCSRT: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCNPJ(string_: JString); cdecl;
    procedure setCSRT(string_: JString); cdecl;
    procedure setContato(string_: JString); cdecl;
    procedure setEmail(string_: JString); cdecl;
    procedure setFone(string_: JString); cdecl;
    procedure setIdCSRT(string_: JString); cdecl;
  end;
  TJInfRespTecAuxiliar = class(TJavaGenericImport<JInfRespTecAuxiliarClass, JInfRespTecAuxiliar>) end;

  JIssQnAuxiliarClass = interface(JTagsClass)
    ['{FE69620E-54E8-4D60-AB50-AE77708E7F70}']
    {class} function init: JIssQnAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IssQnAuxiliar')]
  JIssQnAuxiliar = interface(JTags)
    ['{90456077-6C64-49B0-AEEA-1B7F442B6BD7}']
    function getIndISS: JString; cdecl;
    function getIndIncentivo: JString; cdecl;
    function getcListServ: JString; cdecl;
    function getcMun: JString; cdecl;
    function getcMunFG: JString; cdecl;
    function getcPais: JString; cdecl;
    function getcServico: JString; cdecl;
    function getnProcesso: JString; cdecl;
    function getvAliq: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvDeducao: JString; cdecl;
    function getvDescCond: JString; cdecl;
    function getvDescIncond: JString; cdecl;
    function getvISSQN: JString; cdecl;
    function getvISSRet: JString; cdecl;
    function getvOutro: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setIndISS(string_: JString); cdecl;
    procedure setIndIncentivo(string_: JString); cdecl;
    procedure setcListServ(string_: JString); cdecl;
    procedure setcMun(string_: JString); cdecl;
    procedure setcMunFG(string_: JString); cdecl;
    procedure setcPais(string_: JString); cdecl;
    procedure setcServico(string_: JString); cdecl;
    procedure setnProcesso(string_: JString); cdecl;
    procedure setvAliq(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvDeducao(string_: JString); cdecl;
    procedure setvDescCond(string_: JString); cdecl;
    procedure setvDescIncond(string_: JString); cdecl;
    procedure setvISSQN(string_: JString); cdecl;
    procedure setvISSRet(string_: JString); cdecl;
    procedure setvOutro(string_: JString); cdecl;
  end;
  TJIssQnAuxiliar = class(TJavaGenericImport<JIssQnAuxiliarClass, JIssQnAuxiliar>) end;

  JLeiImpostoClass = interface(JTagsClass)
    ['{28C9A4F2-68F2-447C-9F7A-0BA09FB78B1F}']
    {class} function init: JLeiImposto; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/LeiImposto')]
  JLeiImposto = interface(JTags)
    ['{4403A7F4-4862-4EBC-9419-C556A3D3340B}']
    function getColunasArq: JString; cdecl;
    function getHabilitar: JString; cdecl;
    function getLocalArq: JString; cdecl;
    function getSepadorArq: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setColunasArq(string_: JString); cdecl;
    procedure setHabilitar(string_: JString); cdecl;
    procedure setLocalArq(string_: JString); cdecl;
    procedure setSepadorArq(string_: JString); cdecl;
  end;
  TJLeiImposto = class(TJavaGenericImport<JLeiImpostoClass, JLeiImposto>) end;

  JMAClass = interface(JTagsClass)
    ['{43A1E38D-DC27-4567-820E-8D32BA746943}']
    {class} function init: JMA; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MA')]
  JMA = interface(JTags)
    ['{9DCE9958-7B9B-4482-84E4-1B8922E9ED7E}']
    function getChaveConHomoMA: JString; cdecl;
    function getChaveConProdMA: JString; cdecl;
    function getHomoMA: JString; cdecl;
    function getProdMA: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoMA(string_: JString); cdecl;
    procedure setChaveConProdMA(string_: JString); cdecl;
    procedure setHomoMA(string_: JString); cdecl;
    procedure setProdMA(string_: JString); cdecl;
  end;
  TJMA = class(TJavaGenericImport<JMAClass, JMA>) end;

  JMGClass = interface(JTagsClass)
    ['{F4A4E2D8-F791-4984-AC8E-7C5D6B4C0765}']
    {class} function init: JMG; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MG')]
  JMG = interface(JTags)
    ['{B7D034EF-6E91-40CB-B978-5BC5E358309B}']
    function getChaveConHomoMG: JString; cdecl;
    function getChaveConProdMG: JString; cdecl;
    function getHomoMG: JString; cdecl;
    function getProdMG: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoMG(string_: JString); cdecl;
    procedure setChaveConProdMG(string_: JString); cdecl;
    procedure setHomoMG(string_: JString); cdecl;
    procedure setProdMG(string_: JString); cdecl;
  end;
  TJMG = class(TJavaGenericImport<JMGClass, JMG>) end;

  JMSClass = interface(JTagsClass)
    ['{811E04F2-205A-405A-B232-1B3FEF494ADC}']
    {class} function init: JMS; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MS')]
  JMS = interface(JTags)
    ['{A2A7C68C-8B41-4A85-91E9-CE7E5B96C12E}']
    function getChaveConHomoMS: JString; cdecl;
    function getChaveConProdMS: JString; cdecl;
    function getHomoMS: JString; cdecl;
    function getProdMS: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoMS(string_: JString); cdecl;
    procedure setChaveConProdMS(string_: JString); cdecl;
    procedure setHomoMS(string_: JString); cdecl;
    procedure setProdMS(string_: JString); cdecl;
  end;
  TJMS = class(TJavaGenericImport<JMSClass, JMS>) end;

  JMTClass = interface(JTagsClass)
    ['{0BFE7274-3886-4025-99CF-CA48BF0CA678}']
    {class} function init: JMT; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MT')]
  JMT = interface(JTags)
    ['{7465CEFE-45F4-4E44-86BE-EA61FA9DF485}']
    function getChaveConHomoMT: JString; cdecl;
    function getChaveConProdMT: JString; cdecl;
    function getHomoMT: JString; cdecl;
    function getProdMT: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoMT(string_: JString); cdecl;
    procedure setChaveConProdMT(string_: JString); cdecl;
    procedure setHomoMT(string_: JString); cdecl;
    procedure setProdMT(string_: JString); cdecl;
  end;
  TJMT = class(TJavaGenericImport<JMTClass, JMT>) end;

  JMedAuxiliarClass = interface(JTagsClass)
    ['{496A15FD-2206-4762-BE10-C1F73E7082A7}']
    {class} function init: JMedAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MedAuxiliar')]
  JMedAuxiliar = interface(JTags)
    ['{125651A9-50FC-4CE1-92AE-0AAAEFC46E5F}']
    function getcProdANVISA: JString; cdecl;
    function getdFab: JString; cdecl;
    function getdVal: JString; cdecl;
    function getnLote: JString; cdecl;
    function getqLote: JString; cdecl;
    function getvPMC: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setcProdANVISA(string_: JString); cdecl;
    procedure setdFab(string_: JString); cdecl;
    procedure setdVal(string_: JString); cdecl;
    procedure setnLote(string_: JString); cdecl;
    procedure setqLote(string_: JString); cdecl;
    procedure setvPMC(string_: JString); cdecl;
  end;
  TJMedAuxiliar = class(TJavaGenericImport<JMedAuxiliarClass, JMedAuxiliar>) end;

  JMsgPromocionalClass = interface(JTagsClass)
    ['{DDFA42EC-130A-49AE-923D-3D3F9996FC4C}']
    {class} function init: JMsgPromocional; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MsgPromocional')]
  JMsgPromocional = interface(JTags)
    ['{7E5F64C1-5E5F-42B4-A94F-B9B6EE0D3002}']
    function getImprimir: JString; cdecl;
    function getQtdLinhas: JString; cdecl;
    function getTitulo: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setImprimir(string_: JString); cdecl;
    procedure setQtdLinhas(string_: JString); cdecl;
    procedure setTitulo(string_: JString); cdecl;
  end;
  TJMsgPromocional = class(TJavaGenericImport<JMsgPromocionalClass, JMsgPromocional>) end;

  JNTClass = interface(JTagsClass)
    ['{9CE627E2-12D6-43CF-9DC3-1BF3C5E69418}']
    {class} function init: JNT; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/NT')]
  JNT = interface(JTags)
    ['{C72CFB2E-4FEB-4025-8583-CB41CAF1E124}']
    function getVersaoNT: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setVersaoNT(string_: JString); cdecl;
  end;
  TJNT = class(TJavaGenericImport<JNTClass, JNT>) end;

  JPAClass = interface(JTagsClass)
    ['{DD78A8D2-FB55-4936-A4E5-7ECE3A836BFE}']
    {class} function init: JPA; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PA')]
  JPA = interface(JTags)
    ['{F04EA160-226D-45ED-A581-520122262A04}']
    function getChaveConHomoPA: JString; cdecl;
    function getChaveConProdPA: JString; cdecl;
    function getHomoPA: JString; cdecl;
    function getProdPA: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoPA(string_: JString); cdecl;
    procedure setChaveConProdPA(string_: JString); cdecl;
    procedure setHomoPA(string_: JString); cdecl;
    procedure setProdPA(string_: JString); cdecl;
  end;
  TJPA = class(TJavaGenericImport<JPAClass, JPA>) end;

  JPBClass = interface(JTagsClass)
    ['{A8F59467-5C8C-405D-9C35-1F4D58706F00}']
    {class} function init: JPB; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PB')]
  JPB = interface(JTags)
    ['{3F6F6772-F01B-4A26-99A3-26ED753EB2F4}']
    function getChaveConHomoPB: JString; cdecl;
    function getChaveConProdPB: JString; cdecl;
    function getHomoPB: JString; cdecl;
    function getProdPB: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoPB(string_: JString); cdecl;
    procedure setChaveConProdPB(string_: JString); cdecl;
    procedure setHomoPB(string_: JString); cdecl;
    procedure setProdPB(string_: JString); cdecl;
  end;
  TJPB = class(TJavaGenericImport<JPBClass, JPB>) end;

  JPEClass = interface(JTagsClass)
    ['{503D1C80-886F-441E-AB4D-FCC467C2B38A}']
    {class} function init: JPE; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PE')]
  JPE = interface(JTags)
    ['{E3A06056-DB59-45AC-A91E-D867251E4A50}']
    function getChaveConHomoPE: JString; cdecl;
    function getChaveConProdPE: JString; cdecl;
    function getHomoPE: JString; cdecl;
    function getProdPE: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoPE(string_: JString); cdecl;
    procedure setChaveConProdPE(string_: JString); cdecl;
    procedure setHomoPE(string_: JString); cdecl;
    procedure setProdPE(string_: JString); cdecl;
  end;
  TJPE = class(TJavaGenericImport<JPEClass, JPE>) end;

  JPIClass = interface(JTagsClass)
    ['{B6B3A08A-2D5E-4884-9D7D-14F3BC890C02}']
    {class} function init: JPI; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PI')]
  JPI = interface(JTags)
    ['{2D62EF7F-3FF8-439B-A040-E82F7EC29C5B}']
    function getChaveConHomoPI: JString; cdecl;
    function getChaveConProdPI: JString; cdecl;
    function getHomoPI: JString; cdecl;
    function getProdPI: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoPI(string_: JString); cdecl;
    procedure setChaveConProdPI(string_: JString); cdecl;
    procedure setHomoPI(string_: JString); cdecl;
    procedure setProdPI(string_: JString); cdecl;
  end;
  TJPI = class(TJavaGenericImport<JPIClass, JPI>) end;

  JPRClass = interface(JTagsClass)
    ['{14B142CB-DF81-4701-8DF5-9A3501616671}']
    {class} function init: JPR; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PR')]
  JPR = interface(JTags)
    ['{68DF5486-803E-430E-9331-8779ED26AC01}']
    function getChaveConHomoPR: JString; cdecl;
    function getChaveConProdPR: JString; cdecl;
    function getHomoPR: JString; cdecl;
    function getProdPR: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoPR(string_: JString); cdecl;
    procedure setChaveConProdPR(string_: JString); cdecl;
    procedure setHomoPR(string_: JString); cdecl;
    procedure setProdPR(string_: JString); cdecl;
  end;
  TJPR = class(TJavaGenericImport<JPRClass, JPR>) end;

  JPisAliqAuxiliarClass = interface(JTagsClass)
    ['{A50600C5-914E-4E9C-A089-21EE451035A1}']
    {class} function _GetvPIS: JString; cdecl;
    {class} function init: JPisAliqAuxiliar; cdecl;//Deprecated
    {class} property vPIS: JString read _GetvPIS;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisAliqAuxiliar')]
  JPisAliqAuxiliar = interface(JTags)
    ['{5644781F-AA62-45B9-9341-A84E2385467E}']
    function getCST: JString; cdecl;
    function getpPIS: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvPIS: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setpPIS(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvPIS(string_: JString); cdecl;
  end;
  TJPisAliqAuxiliar = class(TJavaGenericImport<JPisAliqAuxiliarClass, JPisAliqAuxiliar>) end;

  JPisNtAuxiliarClass = interface(JTagsClass)
    ['{F118D69F-8C00-496D-B6D0-D3FA6A56BDC9}']
    {class} function init: JPisNtAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisNtAuxiliar')]
  JPisNtAuxiliar = interface(JTags)
    ['{0487083F-E8F3-4C7A-B186-EFC9BB47EEE8}']
    function getCST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJPisNtAuxiliar = class(TJavaGenericImport<JPisNtAuxiliarClass, JPisNtAuxiliar>) end;

  JPisOutrAuxiliarClass = interface(JTagsClass)
    ['{7DF937DB-1587-4A9E-856A-9730DB0C76D3}']
    {class} function _GetpPIS: JString; cdecl;
    {class} function _GetqBCProd: JString; cdecl;
    {class} function _GetvAliqProd: JString; cdecl;
    {class} function init: JPisOutrAuxiliar; cdecl;//Deprecated
    {class} property pPIS: JString read _GetpPIS;
    {class} property qBCProd: JString read _GetqBCProd;
    {class} property vAliqProd: JString read _GetvAliqProd;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisOutrAuxiliar')]
  JPisOutrAuxiliar = interface(JTags)
    ['{DE9CA224-95F8-49ED-B431-B561F58807F0}']
    function getCST: JString; cdecl;
    function getpPIS: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvPIS: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setpPIS(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvPIS(string_: JString); cdecl;
  end;
  TJPisOutrAuxiliar = class(TJavaGenericImport<JPisOutrAuxiliarClass, JPisOutrAuxiliar>) end;

  JPisQtdeAuxiliarClass = interface(JTagsClass)
    ['{50550DF1-63A4-4903-9992-405F96D8D6A9}']
    {class} function _GetvAliqProd: JString; cdecl;
    {class} function _GetvPIS: JString; cdecl;
    {class} function init: JPisQtdeAuxiliar; cdecl;//Deprecated
    {class} property vAliqProd: JString read _GetvAliqProd;
    {class} property vPIS: JString read _GetvPIS;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisQtdeAuxiliar')]
  JPisQtdeAuxiliar = interface(JTags)
    ['{BAB70912-9A3F-43E9-94F5-E35B9BF88257}']
    function getCST: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    function getvPIS: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
    procedure setvPIS(string_: JString); cdecl;
  end;
  TJPisQtdeAuxiliar = class(TJavaGenericImport<JPisQtdeAuxiliarClass, JPisQtdeAuxiliar>) end;

  JPisSnAuxiliarClass = interface(JTagsClass)
    ['{A3527FCE-2B96-448F-987C-A21CD56E9173}']
    {class} function init: JPisSnAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisSnAuxiliar')]
  JPisSnAuxiliar = interface(JTags)
    ['{F6E2AE37-03D6-4384-AD8D-73F8C2BE7A61}']
    function getCST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJPisSnAuxiliar = class(TJavaGenericImport<JPisSnAuxiliarClass, JPisSnAuxiliar>) end;

  JPisStAuxiliarClass = interface(JTagsClass)
    ['{7ABA0EA8-0A8D-4F6B-873B-E2961A565957}']
    {class} function _GetqBCProd: JString; cdecl;
    {class} function _GetvAliqProd: JString; cdecl;
    {class} function _GetvPIS: JString; cdecl;
    {class} function init: JPisStAuxiliar; cdecl;
    {class} property qBCProd: JString read _GetqBCProd;
    {class} property vAliqProd: JString read _GetvAliqProd;
    {class} property vPIS: JString read _GetvPIS;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisStAuxiliar')]
  JPisStAuxiliar = interface(JTags)
    ['{6EBE901A-E8B8-40CF-BBE7-97E53CECE63A}']
    function getpPIS: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvPIS: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setpPIS(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvPIS(string_: JString); cdecl;
  end;
  TJPisStAuxiliar = class(TJavaGenericImport<JPisStAuxiliarClass, JPisStAuxiliar>) end;

  JProdAuxiliarClass = interface(JTagsClass)
    ['{8197C8C5-064E-4A0A-B2F7-2FDFDA92C99F}']
    {class} function _GetCNPJFab: JString; cdecl;
    {class} function _GetcBarraTrib: JString; cdecl;
    {class} function _GetcBenef: JString; cdecl;
    {class} function _GetcEAN: JString; cdecl;
    {class} function _GetcEANTrib: JString; cdecl;
    {class} function _GetindEscala: JString; cdecl;
    {class} function _GetindTot: JString; cdecl;
    {class} function init: JProdAuxiliar; cdecl;//Deprecated
    {class} property CNPJFab: JString read _GetCNPJFab;
    {class} property cBarraTrib: JString read _GetcBarraTrib;
    {class} property cBenef: JString read _GetcBenef;
    {class} property cEAN: JString read _GetcEAN;
    {class} property cEANTrib: JString read _GetcEANTrib;
    {class} property indEscala: JString read _GetindEscala;
    {class} property indTot: JString read _GetindTot;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ProdAuxiliar')]
  JProdAuxiliar = interface(JTags)
    ['{8F691297-3206-496F-9B49-813BC6B83CB3}']
    function getCEST: JString; cdecl;
    function getCFOP: JString; cdecl;
    function getCNPJFab: JString; cdecl;
    function getIndEscala: JString; cdecl;
    function getIndTot: JString; cdecl;
    function getNCM: JString; cdecl;
    function getcBarra: JString; cdecl;
    function getcBarraTrib: JString; cdecl;
    function getcBenef: JString; cdecl;
    function getcEAN: JString; cdecl;
    function getcEANTrib: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCEST(string_: JString); cdecl;
    procedure setCFOP(string_: JString); cdecl;
    procedure setCNPJFab(string_: JString); cdecl;
    procedure setIndEscala(string_: JString); cdecl;
    procedure setIndTot(string_: JString); cdecl;
    procedure setNCM(string_: JString); cdecl;
    procedure setcBarra(string_: JString); cdecl;
    procedure setcBarraTrib(string_: JString); cdecl;
    procedure setcBenef(string_: JString); cdecl;
    procedure setcEAN(string_: JString); cdecl;
    procedure setcEANTrib(string_: JString); cdecl;
  end;
  TJProdAuxiliar = class(TJavaGenericImport<JProdAuxiliarClass, JProdAuxiliar>) end;

  JRJClass = interface(JTagsClass)
    ['{71562324-7A81-4426-96AF-7E81F161A836}']
    {class} function init: JRJ; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/RJ')]
  JRJ = interface(JTags)
    ['{B9BC0DB5-C7FB-4289-B7ED-B391F9813649}']
    function getChaveConHomoRJ: JString; cdecl;
    function getChaveConProdRJ: JString; cdecl;
    function getHomoRJ: JString; cdecl;
    function getProdRJ: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoRJ(string_: JString); cdecl;
    procedure setChaveConProdRJ(string_: JString); cdecl;
    procedure setHomoRJ(string_: JString); cdecl;
    procedure setProdRJ(string_: JString); cdecl;
  end;
  TJRJ = class(TJavaGenericImport<JRJClass, JRJ>) end;

  JRNClass = interface(JTagsClass)
    ['{5D82CF6D-6CCF-4E6B-83D9-443903408E0B}']
    {class} function init: JRN; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/RN')]
  JRN = interface(JTags)
    ['{988572B7-CCA9-460E-ADB5-C4294A21B134}']
    function getChaveConHomoRN: JString; cdecl;
    function getChaveConProdRN: JString; cdecl;
    function getHomoRN: JString; cdecl;
    function getProdRN: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoRN(string_: JString); cdecl;
    procedure setChaveConProdRN(string_: JString); cdecl;
    procedure setHomoRN(string_: JString); cdecl;
    procedure setProdRN(string_: JString); cdecl;
  end;
  TJRN = class(TJavaGenericImport<JRNClass, JRN>) end;

  JROClass = interface(JTagsClass)
    ['{446612C8-6E13-46F1-9DAE-768EED54B5F9}']
    {class} function init: JRO; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/RO')]
  JRO = interface(JTags)
    ['{C76F6CB9-D192-4790-915A-EB3E7C70D481}']
    function getChaveConHomoRO: JString; cdecl;
    function getChaveConProdRO: JString; cdecl;
    function getHomoRO: JString; cdecl;
    function getProdRO: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoRO(string_: JString); cdecl;
    procedure setChaveConProdRO(string_: JString); cdecl;
    procedure setHomoRO(string_: JString); cdecl;
    procedure setProdRO(string_: JString); cdecl;
  end;
  TJRO = class(TJavaGenericImport<JROClass, JRO>) end;

  JRRClass = interface(JTagsClass)
    ['{2A3490B6-87C1-4809-A450-64AB183DAB0B}']
    {class} function init: JRR; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/RR')]
  JRR = interface(JTags)
    ['{D04AC415-1C70-4CF7-9F68-9D37420C3D5C}']
    function getChaveConHomoRR: JString; cdecl;
    function getChaveConProdRR: JString; cdecl;
    function getHomoRR: JString; cdecl;
    function getProdRR: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoRR(string_: JString); cdecl;
    procedure setChaveConProdRR(string_: JString); cdecl;
    procedure setHomoRR(string_: JString); cdecl;
    procedure setProdRR(string_: JString); cdecl;
  end;
  TJRR = class(TJavaGenericImport<JRRClass, JRR>) end;

  JRSClass = interface(JTagsClass)
    ['{DC0153F5-0D98-40C1-AB03-6EFB94EC0F49}']
    {class} function init: JRS; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/RS')]
  JRS = interface(JTags)
    ['{08987E12-30DA-4DEE-9299-6A947CDE8ACB}']
    function getChaveConHomoRS: JString; cdecl;
    function getChaveConProdRS: JString; cdecl;
    function getHomoRS: JString; cdecl;
    function getProdRS: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoRS(string_: JString); cdecl;
    procedure setChaveConProdRS(string_: JString); cdecl;
    procedure setHomoRS(string_: JString); cdecl;
    procedure setProdRS(string_: JString); cdecl;
  end;
  TJRS = class(TJavaGenericImport<JRSClass, JRS>) end;

  JSCClass = interface(JTagsClass)
    ['{E028E80C-8441-4D48-A29E-70BCA205CEF2}']
    {class} function init: JSC; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/SC')]
  JSC = interface(JTags)
    ['{197DFDFD-0BFC-4FB6-8D18-6E9C4E7928E0}']
    function getChaveConHomoSC: JString; cdecl;
    function getChaveConProdSC: JString; cdecl;
    function getHomoSC: JString; cdecl;
    function getProdSC: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoSC(string_: JString); cdecl;
    procedure setChaveConProdSC(string_: JString); cdecl;
    procedure setHomoSC(string_: JString); cdecl;
    procedure setProdSC(string_: JString); cdecl;
  end;
  TJSC = class(TJavaGenericImport<JSCClass, JSC>) end;

  JSEClass = interface(JTagsClass)
    ['{DE1E2A6F-66E1-4BCB-9425-9805BF4D4FDC}']
    {class} function init: JSE; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/SE')]
  JSE = interface(JTags)
    ['{4C3D7985-AD91-426C-9179-885534A0F7A1}']
    function getChaveConHomoSE: JString; cdecl;
    function getChaveConProdSE: JString; cdecl;
    function getHomoSE: JString; cdecl;
    function getProdSE: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoSE(string_: JString); cdecl;
    procedure setChaveConProdSE(string_: JString); cdecl;
    procedure setHomoSE(string_: JString); cdecl;
    procedure setProdSE(string_: JString); cdecl;
  end;
  TJSE = class(TJavaGenericImport<JSEClass, JSE>) end;

  JSPClass = interface(JTagsClass)
    ['{A8630F94-B961-4AAB-812F-9BF8953BD239}']
    {class} function init: JSP; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/SP')]
  JSP = interface(JTags)
    ['{36F6245B-1E18-4409-8F92-7A91E3099CB4}']
    function getChaveConHomoSP: JString; cdecl;
    function getChaveConProdSP: JString; cdecl;
    function getHomoSP: JString; cdecl;
    function getProdSP: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoSP(string_: JString); cdecl;
    procedure setChaveConProdSP(string_: JString); cdecl;
    procedure setHomoSP(string_: JString); cdecl;
    procedure setProdSP(string_: JString); cdecl;
  end;
  TJSP = class(TJavaGenericImport<JSPClass, JSP>) end;

  JTOClass = interface(JTagsClass)
    ['{84F845D2-8872-4324-9265-FF37B4696348}']
    {class} function init: JTO; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/TO')]
  JTO = interface(JTags)
    ['{CFEEBB0C-AAD3-40BB-9FF0-5102E8690B02}']
    function getChaveConHomoTO: JString; cdecl;
    function getChaveConProdTO: JString; cdecl;
    function getHomoTO: JString; cdecl;
    function getProdTO: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setChaveConHomoTO(string_: JString); cdecl;
    procedure setChaveConProdTO(string_: JString); cdecl;
    procedure setHomoTO(string_: JString); cdecl;
    procedure setProdTO(string_: JString); cdecl;
  end;
  TJTO = class(TJavaGenericImport<JTOClass, JTO>) end;

  JAberturaNfseClass = interface(JPersistenciaClass)
    ['{EFE8BC36-4320-4332-8E7E-D2D4F54885F3}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/AberturaNfse')]
  JAberturaNfse = interface(JPersistencia)
    ['{8A2EA978-2A14-4776-A268-FACA16F8F14B}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJAberturaNfse = class(TJavaGenericImport<JAberturaNfseClass, JAberturaNfse>) end;

  JEncerrarNFSeClass = interface(JPersistenciaClass)
    ['{7E0DE28D-9835-405F-9E51-835B6999EEFE}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/EncerrarNFSe')]
  JEncerrarNFSe = interface(JPersistencia)
    ['{2A912547-7506-4E9A-9F20-CDEDC7815A1F}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJEncerrarNFSe = class(TJavaGenericImport<JEncerrarNFSeClass, JEncerrarNFSe>) end;

  Jxml_Op_XmlRetornoClass = interface(Jgne_UtilsClass)
    ['{A4F5CED6-6EF4-4DD6-9F2C-01622916BD72}']
    {class} function init: Jxml_Op_XmlRetorno; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Op_XmlRetorno')]
  Jxml_Op_XmlRetorno = interface(Jgne_Utils)
    ['{B0D81FAD-8F94-4EAE-AE9B-2DDB7CF99556}']
  end;
  TJxml_Op_XmlRetorno = class(TJavaGenericImport<Jxml_Op_XmlRetornoClass, Jxml_Op_XmlRetorno>) end;

  Jnfse_LayoutClass = interface(Jxml_Op_XmlRetornoClass)
    ['{FF8FC3B9-B828-419A-8E7B-0DD5F552CAF7}']
    {class} function init: Jnfse_Layout; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/Layout')]
  Jnfse_Layout = interface(Jxml_Op_XmlRetorno)
    ['{9D8204B8-61F2-4135-BF41-E74329AB1885}']
    function _Getformat: JFormatacao; cdecl;
    procedure _Setformat(Value: JFormatacao); cdecl;
    procedure inicializaProcesso(string_: JString; string_1: JString; string_2: JString; context: JContext); cdecl;
    property format: JFormatacao read _Getformat write _Setformat;
  end;
  TJnfse_Layout = class(TJavaGenericImport<Jnfse_LayoutClass, Jnfse_Layout>) end;

  JNFSeClass = interface(Jgne_UtilsClass)
    ['{72274A8C-3AA2-4567-8654-109F4140013F}']
    {class} function _GetxmlAuxi: Jxml_Op_XmlAuxiliar; cdecl;
    {class} procedure _SetxmlAuxi(Value: Jxml_Op_XmlAuxiliar); cdecl;
    {class} function init(context: JContext): JNFSe; cdecl;
    {class} property xmlAuxi: Jxml_Op_XmlAuxiliar read _GetxmlAuxi write _SetxmlAuxi;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/NFSe')]
  JNFSe = interface(Jgne_Utils)
    ['{A4A6EA00-664D-4825-B016-0059C4CBF0ED}']
    procedure GerarXmlAuxiliar; cdecl;
    function abrirNFSePersistencia(string_: TJavaObjectArray<JString>): Integer; cdecl;
    function consultaNFSe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString): JString; cdecl;
    function encerrarNFSePersistencia(string_: JString): Integer; cdecl;
    function fnVerificarRetornoWebServiceNFSe(string_: JString; string_1: TJavaObjectArray<JString>): Integer; cdecl;
    function gerarArquivoFormatado_Nfse: JStringBuffer; cdecl;
    function gerarXmlEnvio: JString; cdecl;
    function venderNFCePersistencia(string_: TJavaObjectArray<JString>): Integer; cdecl;
  end;
  TJNFSe = class(TJavaGenericImport<JNFSeClass, JNFSe>) end;

  JTiposNFSeClass = interface(JObjectClass)
    ['{B89BDE92-4CEF-4F52-9749-4F4ABF423027}']
    {class} function init: JTiposNFSe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/TiposNFSe')]
  JTiposNFSe = interface(JObject)
    ['{C1655CE6-DC56-4D9E-AF3B-AEB595CAF6E6}']
  end;
  TJTiposNFSe = class(TJavaGenericImport<JTiposNFSeClass, JTiposNFSe>) end;

  JVendeServNFSeClass = interface(JPersistenciaClass)
    ['{7FE5D5E6-C625-4A22-BDA4-B226B6D20D0F}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/VendeServNFSe')]
  JVendeServNFSe = interface(JPersistencia)
    ['{198376A8-1246-444B-91C0-568CA8306CE5}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJVendeServNFSe = class(TJavaGenericImport<JVendeServNFSeClass, JVendeServNFSe>) end;

  Jxml_ElementosXmlAuxiliarClass = interface(JObjectClass)
    ['{7DC705DD-D002-4D3A-A87B-8A5FC001F6F4}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/ElementosXmlAuxiliar')]
  Jxml_ElementosXmlAuxiliar = interface(JObject)
    ['{B0B9CDFB-E3E4-47E8-A1A1-9ED865801EB4}']
    procedure vinculaXml; cdecl;
  end;
  TJxml_ElementosXmlAuxiliar = class(TJavaGenericImport<Jxml_ElementosXmlAuxiliarClass, Jxml_ElementosXmlAuxiliar>) end;

  JElementosXmlConsultaClass = interface(JObjectClass)
    ['{072B058E-9906-4354-A3B3-C22BCEA7A7DA}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/ElementosXmlConsulta')]
  JElementosXmlConsulta = interface(JObject)
    ['{3A865564-BC54-4C03-85DF-4BB8DDBDC7AD}']
    procedure vinculaXml; cdecl;
  end;
  TJElementosXmlConsulta = class(TJavaGenericImport<JElementosXmlConsultaClass, JElementosXmlConsulta>) end;

  JEnderPrestClass = interface(JTagsClass)
    ['{3705AE82-5153-4285-8F01-F9BB9F00BAFF}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/EnderPrest')]
  JEnderPrest = interface(JTags)
    ['{874C3983-082C-4869-B733-F931425EFDF3}']
    function getCep: JString; cdecl;
    function getEmail: JString; cdecl;
    function getNro: JString; cdecl;
    function getTpEnd: JString; cdecl;
    function getUf: JString; cdecl;
    function getcMun: JString; cdecl;
    function getxBairro: JString; cdecl;
    function getxLgr: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCep(string_: JString); cdecl;
    procedure setEmail(string_: JString); cdecl;
    procedure setNro(string_: JString); cdecl;
    procedure setTpEnd(string_: JString); cdecl;
    procedure setUf(string_: JString); cdecl;
    procedure setcMun(string_: JString); cdecl;
    procedure setxBairro(string_: JString); cdecl;
    procedure setxLgr(string_: JString); cdecl;
  end;
  TJEnderPrest = class(TJavaGenericImport<JEnderPrestClass, JEnderPrest>) end;

  JNfseAuxiliarClass = interface(JTagsClass)
    ['{196D8A4D-FC2C-49C1-B22E-5B7E01EAEF3C}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/NfseAuxiliar')]
  JNfseAuxiliar = interface(JTags)
    ['{140493F8-0105-4D49-A7EC-BF2C56D5E450}']
    function getAliqIss: JString; cdecl;
    function getCnae: JString; cdecl;
    function getEmpck: JString; cdecl;
    function getEmpco: JString; cdecl;
    function getEmppk: JString; cdecl;
    function getEstadoCfe: JString; cdecl;
    function getHistoricoXML: JString; cdecl;
    function getImpressaoCompleta: JString; cdecl;
    function getIncCult: JString; cdecl;
    function getIteListServ: JString; cdecl;
    function getLocalArquivos: JString; cdecl;
    function getNatOp: JString; cdecl;
    function getOPtSn: JString; cdecl;
    function getOperacao: JString; cdecl;
    function getRespRet: JString; cdecl;
    function getRpsNumero: JString; cdecl;
    function getRpsSerie: JString; cdecl;
    function getRpsTipo: JString; cdecl;
    function getStatus: JString; cdecl;
    function getTimeOut: JString; cdecl;
    function getTpAmb: JString; cdecl;
    function getTributMun: JString; cdecl;
    function getTributavel: JString; cdecl;
    function getXml: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setAliqIss(string_: JString); cdecl;
    procedure setCnae(string_: JString); cdecl;
    procedure setEmpck(string_: JString); cdecl;
    procedure setEmpco(string_: JString); cdecl;
    procedure setEmppk(string_: JString); cdecl;
    procedure setEstadoCfe(string_: JString); cdecl;
    procedure setHistoricoXML(string_: JString); cdecl;
    procedure setImpressaoCompleta(string_: JString); cdecl;
    procedure setIncCult(string_: JString); cdecl;
    procedure setIteListServ(string_: JString); cdecl;
    procedure setLocalArquivos(string_: JString); cdecl;
    procedure setNatOp(string_: JString); cdecl;
    procedure setOPtSn(string_: JString); cdecl;
    procedure setOperacao(string_: JString); cdecl;
    procedure setRespRet(string_: JString); cdecl;
    procedure setRpsNumero(string_: JString); cdecl;
    procedure setRpsSerie(string_: JString); cdecl;
    procedure setRpsTipo(string_: JString); cdecl;
    procedure setStatus(string_: JString); cdecl;
    procedure setTimeOut(string_: JString); cdecl;
    procedure setTpAmb(string_: JString); cdecl;
    procedure setTributMun(string_: JString); cdecl;
    procedure setTributavel(string_: JString); cdecl;
    procedure setXml(string_: JString); cdecl;
  end;
  TJNfseAuxiliar = class(TJavaGenericImport<JNfseAuxiliarClass, JNfseAuxiliar>) end;

  Jxml_ObjetosClass = interface(JObjectClass)
    ['{C1F64085-F9D3-4274-B907-8E8ACFFB2FB5}']
    {class} function getInstance(i: Integer): JObject; cdecl;
    {class} function init: Jxml_Objetos; cdecl;
    {class} procedure renovarGsDanfe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Objetos')]
  Jxml_Objetos = interface(JObject)
    ['{63926F30-5E85-48EA-BE83-79DFDAA160AA}']
  end;
  TJxml_Objetos = class(TJavaGenericImport<Jxml_ObjetosClass, Jxml_Objetos>) end;

  Jxml_Op_XmlAuxiliarClass = interface(JObjectClass)
    ['{6EB13DCC-8A72-4672-AAD4-E76FB4DAB311}']
    {class} function _Getobj_nfse: Jxml_ElementosXmlAuxiliar; cdecl;
    {class} procedure _Setobj_nfse(Value: Jxml_ElementosXmlAuxiliar); cdecl;
    {class} function escolherObj(string_: JString): JTags; cdecl;
    {class} function init: Jxml_Op_XmlAuxiliar; cdecl;//Deprecated
    {class} procedure lerXmlAuxiliar; cdecl;
    {class} procedure registrarInfoXmlAuxiliar(context: JContext); cdecl;
    {class} property obj_nfse: Jxml_ElementosXmlAuxiliar read _Getobj_nfse write _Setobj_nfse;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Op_XmlAuxiliar')]
  Jxml_Op_XmlAuxiliar = interface(JObject)
    ['{C1F65538-1CD7-41F7-A06A-31671094C2B9}']
    procedure GerarXmlAuxiliar(context: JContext); cdecl;
    procedure maquinaStatus(string_: JString); cdecl;
  end;
  TJxml_Op_XmlAuxiliar = class(TJavaGenericImport<Jxml_Op_XmlAuxiliarClass, Jxml_Op_XmlAuxiliar>) end;

  Jnfse_xml_Op_XmlConsultaClass = interface(Jxml_Op_XmlAuxiliarClass)
    ['{B4BFC875-A2EC-42DF-9F61-126AF838752F}']
    {class} function init: Jnfse_xml_Op_XmlConsulta; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Op_XmlConsulta')]
  Jnfse_xml_Op_XmlConsulta = interface(Jxml_Op_XmlAuxiliar)
    ['{D3E519DF-7E22-4BBD-A9EC-6F393D010860}']
    function gerarXmlConsulta(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString): JString; cdecl;
    procedure preencherXmlConsultaNFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString); cdecl;
  end;
  TJnfse_xml_Op_XmlConsulta = class(TJavaGenericImport<Jnfse_xml_Op_XmlConsultaClass, Jnfse_xml_Op_XmlConsulta>) end;

  JPrestadorClass = interface(JTagsClass)
    ['{84F8A0B2-5F13-4445-9629-030F3D69D82E}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Prestador')]
  JPrestador = interface(JTags)
    ['{E2583B50-D5B2-4632-863C-06C876EDC5BB}']
    function getCnpj: JString; cdecl;
    function getCpf: JString; cdecl;
    function getIe: JString; cdecl;
    function getIm: JString; cdecl;
    function getxFant: JString; cdecl;
    function getxNome: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCnpj(string_: JString); cdecl;
    procedure setCpf(string_: JString); cdecl;
    procedure setIe(string_: JString); cdecl;
    procedure setIm(string_: JString); cdecl;
    procedure setxFant(string_: JString); cdecl;
    procedure setxNome(string_: JString); cdecl;
  end;
  TJPrestador = class(TJavaGenericImport<JPrestadorClass, JPrestador>) end;

  JXml_ElementosEnvioNFSeClass = interface(JObjectClass)
    ['{8BDBF294-D774-4D2F-A380-C33DF25BEEA5}']
    {class} function _GetTransp: Jjdom2_Element; cdecl;
    {class} function _Getded: Jjdom2_Element; cdecl;
    {class} function _GetdedSeq: Jjdom2_Element; cdecl;
    {class} function _GetdedTipo: Jjdom2_Element; cdecl;
    {class} function _GetdedValPer: Jjdom2_Element; cdecl;
    {class} function _GetdedValor: Jjdom2_Element; cdecl;
    {class} function _Getenvio: Jjdom2_Element; cdecl;
    {class} function _GetlistaDed: Jjdom2_Element; cdecl;
    {class} function _GetmatQtd: Jjdom2_Element; cdecl;
    {class} function _GetmatUndMedSig: Jjdom2_Element; cdecl;
    {class} function _GetmatVlrTot: Jjdom2_Element; cdecl;
    {class} function _GettraNome: Jjdom2_Element; cdecl;
    {class} function init: JXml_ElementosEnvioNFSe; cdecl;//Deprecated
    {class} property Transp: Jjdom2_Element read _GetTransp;
    {class} property ded: Jjdom2_Element read _Getded;
    {class} property dedSeq: Jjdom2_Element read _GetdedSeq;
    {class} property dedTipo: Jjdom2_Element read _GetdedTipo;
    {class} property dedValPer: Jjdom2_Element read _GetdedValPer;
    {class} property dedValor: Jjdom2_Element read _GetdedValor;
    {class} property envio: Jjdom2_Element read _Getenvio;
    {class} property listaDed: Jjdom2_Element read _GetlistaDed;
    {class} property matQtd: Jjdom2_Element read _GetmatQtd;
    {class} property matUndMedSig: Jjdom2_Element read _GetmatUndMedSig;
    {class} property matVlrTot: Jjdom2_Element read _GetmatVlrTot;
    {class} property traNome: Jjdom2_Element read _GettraNome;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Xml_ElementosEnvioNFSe')]
  JXml_ElementosEnvioNFSe = interface(JObject)
    ['{9C5BFE7F-CD53-4AEF-8C86-19A9337CBC90}']
    procedure vinculaAbertura; cdecl;
    procedure vinculaTot(string_: TJavaObjectArray<JString>; string_1: TJavaObjectArray<JString>); cdecl;
    procedure vinculaVenda(string_: TJavaObjectArray<JString>); cdecl;
  end;
  TJXml_ElementosEnvioNFSe = class(TJavaGenericImport<JXml_ElementosEnvioNFSeClass, JXml_ElementosEnvioNFSe>) end;

  JInterface_SatClass = interface(Jgne_UtilsClass)
    ['{52B1065B-A1CE-4BB7-B985-69289957C7A7}']
    {class} function init: JInterface_Sat; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/Interface_Sat')]
  JInterface_Sat = interface(Jgne_Utils)
    ['{B22CF57D-34A4-40E7-A9B4-D4AE0532E9C1}']
    function ConsultarStatusOperacional: Integer; cdecl;
    function abreComunicacao(context: JContext): Boolean; cdecl;
    function cancelaUltimaVenda(string_: JString): JString; cdecl;
    function enviaDados(string_: JString; i: Integer): JString; cdecl;
    function numeroSessao(context: JContext): Integer; cdecl;
  end;
  TJInterface_Sat = class(TJavaGenericImport<JInterface_SatClass, JInterface_Sat>) end;

  Jsat_DarumaClass = interface(JInterface_SatClass)
    ['{5DC2A34A-B62C-45D2-866B-028403F33FC0}']
    {class} function init(context: JContext): Jsat_Daruma; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/Daruma')]
  Jsat_Daruma = interface(JInterface_Sat)
    ['{4BA31181-E951-4FCB-8218-AE43CF8E6B9C}']
    function ConsultarStatusOperacional: Integer; cdecl;
    function abreComunicacao(context: JContext): Boolean; cdecl;
    function cancelaUltimaVenda(string_: JString): JString; cdecl;
    function enviaDados(string_: JString; i: Integer): JString; cdecl;
  end;
  TJsat_Daruma = class(TJavaGenericImport<Jsat_DarumaClass, Jsat_Daruma>) end;

  Jsat_xml_Op_XmlRetornoClass = interface(Jgne_UtilsClass)
    ['{BEE8B1D8-B457-4493-9C7C-08A1574BC513}']
    {class} function _GetinfoEstendida: TJavaObjectArray<JString>; cdecl;
    {class} function _GetlistaDetArray: JArrayList; cdecl;
    {class} function _GetlistaPagArray: JArrayList; cdecl;
    {class} function _GetretDest: JHashMap; cdecl;
    {class} function _GetretEntrega: JHashMap; cdecl;
    {class} function _GetretSignature: JHashMap; cdecl;
    {class} function _GetretTotal: JHashMap; cdecl;
    {class} function init: Jsat_xml_Op_XmlRetorno; cdecl;//Deprecated
    {class} property infoEstendida: TJavaObjectArray<JString> read _GetinfoEstendida;
    {class} property listaDetArray: JArrayList read _GetlistaDetArray;
    {class} property listaPagArray: JArrayList read _GetlistaPagArray;
    {class} property retDest: JHashMap read _GetretDest;
    {class} property retEntrega: JHashMap read _GetretEntrega;
    {class} property retSignature: JHashMap read _GetretSignature;
    {class} property retTotal: JHashMap read _GetretTotal;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/Op_XmlRetorno')]
  Jsat_xml_Op_XmlRetorno = interface(Jgne_Utils)
    ['{2A1FA963-E49F-4242-A375-F5A23BB889DF}']
    function _GetvTroco: JString; cdecl;
    procedure _SetvTroco(Value: JString); cdecl;
    property vTroco: JString read _GetvTroco write _SetvTroco;
  end;
  TJsat_xml_Op_XmlRetorno = class(TJavaGenericImport<Jsat_xml_Op_XmlRetornoClass, Jsat_xml_Op_XmlRetorno>) end;

  Jsat_LayoutClass = interface(Jsat_xml_Op_XmlRetornoClass)
    ['{142A66AF-0E51-46CD-94C5-D968A39FEA24}']
    {class} function init: Jsat_Layout; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/Layout')]
  Jsat_Layout = interface(Jsat_xml_Op_XmlRetorno)
    ['{6EB536A3-348F-4986-B9A6-278CF5D664D6}']
    function _Getformat: JFormatacao; cdecl;
    procedure _Setformat(Value: JFormatacao); cdecl;
    procedure inicializaProcesso(string_: JString; string_1: JString; i: Integer; context: JContext); cdecl;
    procedure xmlCancelamento(stringBuffer: JStringBuffer; context: JContext); cdecl;
    property format: JFormatacao read _Getformat write _Setformat;
  end;
  TJsat_Layout = class(TJavaGenericImport<Jsat_LayoutClass, Jsat_Layout>) end;

  JParseNFCe_2_SATClass = interface(JObjectClass)
    ['{9B5833C2-2F19-4F34-9E58-DD9B8051231D}']
    {class} function init: JParseNFCe_2_SAT; cdecl;
    {class} function parseNFCe2Sat(string_: JString; context: JContext): JString; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/ParseNFCe_2_SAT')]
  JParseNFCe_2_SAT = interface(JObject)
    ['{6168CDB4-3A44-44BC-B0DA-DDDE9FB9C9F8}']
  end;
  TJParseNFCe_2_SAT = class(TJavaGenericImport<JParseNFCe_2_SATClass, JParseNFCe_2_SAT>) end;

  JSatClass = interface(Jgne_UtilsClass)
    ['{174749C4-45A5-43AF-9CBC-43DA231035EF}']
    {class} function _GetxmlAuxi: Jsat_xml_Op_XmlAuxiliar; cdecl;
    {class} procedure _SetxmlAuxi(Value: Jsat_xml_Op_XmlAuxiliar); cdecl;
    {class} function init(context: JContext): JSat; cdecl;
    {class} property xmlAuxi: Jsat_xml_Op_XmlAuxiliar read _GetxmlAuxi write _SetxmlAuxi;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/Sat')]
  JSat = interface(Jgne_Utils)
    ['{7CA42F5E-F170-453B-9CF3-8E04669B918D}']
    function ConsultarStatusOperacional: Integer; cdecl;
    procedure GerarXmlAuxiliar; cdecl;
    function abrirComunicacao(context: JContext): Boolean; cdecl;
    function cancelarUltimaVenda(string_: JString): JString; cdecl;
    function enviarDados(string_: JString; i: Integer): JString; cdecl;
    function fnEnviarXML_SAT(string_: JString; context: JContext; i: Integer): Integer; cdecl;
    function fnInfoEstendida_SAT(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    procedure fnVerificaRetornoCont_SAT(i: Integer; i1: Integer; string_: TJavaObjectArray<JString>); cdecl;
    procedure fnVersaoDadosEnt_SAT_Daruma; cdecl;
    procedure gerarArquivoFormatadoCanc_Sat(string_: JString; stringBuffer: JStringBuffer); cdecl;
    procedure gerarArquivoFormatado_Sat(string_: JString; stringBuffer: JStringBuffer); cdecl;
    function gerarXmlCancelamentoUltimaVenda(string_: JString): JString; cdecl;
    function getObjLayout: Jsat_Layout; cdecl;
    function retornarInfoEstendida(string_: JString): JString; cdecl;
    procedure setObjLayout(layout: Jsat_Layout); cdecl;
  end;
  TJSat = class(TJavaGenericImport<JSatClass, JSat>) end;

  JSatCrClass = interface(JInterface_SatClass)
    ['{74CCE1A4-44D0-4901-B31E-7B2C93E31C2C}']
    {class} function init(context: JContext): JSatCr; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/SatCr')]
  JSatCr = interface(JInterface_Sat)
    ['{5E661871-9DD4-486C-B4F7-12DFF4DFA9E2}']
    function ConsultarStatusOperacional: Integer; cdecl;
    function abreComunicacao(context: JContext): Boolean; cdecl;
    function cancelaUltimaVenda(string_: JString): JString; cdecl;
    function enviaDados(string_: JString; i: Integer): JString; cdecl;
  end;
  TJSatCr = class(TJavaGenericImport<JSatCrClass, JSatCr>) end;

  // br.com.daruma.framework.mobile.gne.sat.SatCrComunicacao
  JSatCrComunicacao_UsbPermissionClass = interface(JEnumClass)
    ['{128F778A-9D3D-48F0-9378-613EAA81E46E}']
    {class} function _GetDenied: JSatCrComunicacao_UsbPermission; cdecl;
    {class} function _GetGranted: JSatCrComunicacao_UsbPermission; cdecl;
    {class} function _GetRequested: JSatCrComunicacao_UsbPermission; cdecl;
    {class} function _GetUnknown: JSatCrComunicacao_UsbPermission; cdecl;
    {class} function valueOf(string_: JString): JSatCrComunicacao_UsbPermission; cdecl;
    {class} function values: TJavaObjectArray<JSatCrComunicacao_UsbPermission>; cdecl;//Deprecated
    {class} property Denied: JSatCrComunicacao_UsbPermission read _GetDenied;
    {class} property Granted: JSatCrComunicacao_UsbPermission read _GetGranted;
    {class} property Requested: JSatCrComunicacao_UsbPermission read _GetRequested;
    {class} property Unknown: JSatCrComunicacao_UsbPermission read _GetUnknown;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/SatCrComunicacao$UsbPermission')]
  JSatCrComunicacao_UsbPermission = interface(JEnum)
    ['{21EDB792-1207-4E89-A777-E854CA6513BF}']
  end;
  TJSatCrComunicacao_UsbPermission = class(TJavaGenericImport<JSatCrComunicacao_UsbPermissionClass, JSatCrComunicacao_UsbPermission>) end;

  JUranoClass = interface(JInterface_SatClass)
    ['{EF9C8D3F-8BE3-4F95-A3CD-8EE3B468107F}']
    {class} function init(context: JContext): JUrano; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/Urano')]
  JUrano = interface(JInterface_Sat)
    ['{C5149F9C-64CF-4773-BA7D-226CB037CE9F}']
    function ConsultarStatusOperacional: Integer; cdecl;
    function abreComunicacao(context: JContext): Boolean; cdecl;
    function cancelaUltimaVenda(string_: JString): JString; cdecl;
    function enviaDados(string_: JString; i: Integer): JString; cdecl;
  end;
  TJUrano = class(TJavaGenericImport<JUranoClass, JUrano>) end;

  JCONFIGURACAOClass = interface(JTagsClass)
    ['{E78605EE-FC67-4F76-8015-13D018989125}']
    {class} function _GetpszCPF: JString; cdecl;
    {class} function _GetpszChaveConsulta: JString; cdecl;
    {class} function _GetpszCodigoDeAtivacao: JString; cdecl;
    {class} function _GetpszConcentrador: JString; cdecl;
    {class} function _GetpszCopiaSeguranca: JString; cdecl;
    {class} function _GetpszImpressora: JString; cdecl;
    {class} function _GetpszLocalArquivos: JString; cdecl;
    {class} function init: JCONFIGURACAO; cdecl;//Deprecated
    {class} property pszCPF: JString read _GetpszCPF;
    {class} property pszChaveConsulta: JString read _GetpszChaveConsulta;
    {class} property pszCodigoDeAtivacao: JString read _GetpszCodigoDeAtivacao;
    {class} property pszConcentrador: JString read _GetpszConcentrador;
    {class} property pszCopiaSeguranca: JString read _GetpszCopiaSeguranca;
    {class} property pszImpressora: JString read _GetpszImpressora;
    {class} property pszLocalArquivos: JString read _GetpszLocalArquivos;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/CONFIGURACAO')]
  JCONFIGURACAO = interface(JTags)
    ['{4F2E8ABE-078B-4804-A4FB-E71E9CC8D226}']
    function getCPF: JString; cdecl;
    function getChaveConsulta: JString; cdecl;
    function getCodigoDeAtivacao: JString; cdecl;
    function getConcentrador: JString; cdecl;
    function getCopiaSeguranca: JString; cdecl;
    function getEnviarXML: JString; cdecl;
    function getImpressora: JString; cdecl;
    function getLocalArquivos: JString; cdecl;
    function getMarcaSAT: JString; cdecl;
    function getNumeroSessao: JString; cdecl;
    function getVersaoDadosEnt: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCPF(string_: JString); cdecl;
    procedure setChaveConsulta(string_: JString); cdecl;
    procedure setCodigoDeAtivacao(string_: JString); cdecl;
    procedure setConcentrador(string_: JString); cdecl;
    procedure setCopiaSeguranca(string_: JString); cdecl;
    procedure setEnviarXML(string_: JString); cdecl;
    procedure setImpressora(string_: JString); cdecl;
    procedure setLocalArquivos(string_: JString); cdecl;
    procedure setMarcaSAT(string_: JString); cdecl;
    procedure setNumeroSessao(string_: JString); cdecl;
    procedure setVersaoDadosEnt(string_: JString); cdecl;
  end;
  TJCONFIGURACAO = class(TJavaGenericImport<JCONFIGURACAOClass, JCONFIGURACAO>) end;

  JEMITClass = interface(JTagsClass)
    ['{159CF848-CA60-4394-9CBE-5911ABF4C08D}']
    {class} function _GetpszIM: JString; cdecl;
    {class} function _GetpszIndRatISSQN: JString; cdecl;
    {class} function _GetpszcRegTribISSQN: JString; cdecl;
    {class} property pszIM: JString read _GetpszIM;
    {class} property pszIndRatISSQN: JString read _GetpszIndRatISSQN;
    {class} property pszcRegTribISSQN: JString read _GetpszcRegTribISSQN;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/EMIT')]
  JEMIT = interface(JTags)
    ['{A5D7C52B-2BA3-4446-A37F-36B76C14A9D1}']
    function getCNPJ: JString; cdecl;
    function getIE: JString; cdecl;
    function getIM: JString; cdecl;
    function getIndRatISSQN: JString; cdecl;
    function getcRegTribISSQN: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCNPJ(string_: JString); cdecl;
    procedure setIE(string_: JString); cdecl;
    procedure setIM(string_: JString); cdecl;
    procedure setIndRatISSQN(string_: JString); cdecl;
    procedure setcRegTribISSQN(string_: JString); cdecl;
  end;
  TJEMIT = class(TJavaGenericImport<JEMITClass, JEMIT>) end;

  JIDENTIFICACAO_CFEClass = interface(JTagsClass)
    ['{BB8AFD72-AE6D-4F39-8B7B-7FE7690006EB}']
    {class} function _GetpszNumeroCaixa: JString; cdecl;
    {class} function _GetstrnNF: JString; cdecl;
    {class} function _GetstrnSerie: JString; cdecl;
    {class} function _GetstrvTotalCfe: JString; cdecl;
    {class} function init: JIDENTIFICACAO_CFE; cdecl;//Deprecated
    {class} property pszNumeroCaixa: JString read _GetpszNumeroCaixa;
    {class} property strnNF: JString read _GetstrnNF;
    {class} property strnSerie: JString read _GetstrnSerie;
    {class} property strvTotalCfe: JString read _GetstrvTotalCfe;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/IDENTIFICACAO_CFE')]
  JIDENTIFICACAO_CFE = interface(JTags)
    ['{F6791D2C-C9F7-42CC-BB83-8C8DE13849F3}']
    function getCNPJ: JString; cdecl;
    function getDataHoraEmissao: JString; cdecl;
    function getNumeroCaixa: JString; cdecl;
    function getSignAC: JString; cdecl;
    function getnNF: JString; cdecl;
    function getnSerie: JString; cdecl;
    function getvTotalCfe: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCNPJ(string_: JString); cdecl;
    procedure setDataHoraEmissao(string_: JString); cdecl;
    procedure setNumeroCaixa(string_: JString); cdecl;
    procedure setSignAC(string_: JString); cdecl;
    procedure setnNF(string_: JString); cdecl;
    procedure setnSerie(string_: JString); cdecl;
    procedure setvTotalCfe(string_: JString); cdecl;
  end;
  TJIDENTIFICACAO_CFE = class(TJavaGenericImport<JIDENTIFICACAO_CFEClass, JIDENTIFICACAO_CFE>) end;

  JISSQNClass = interface(JTagsClass)
    ['{C5B042CA-64A0-4860-B2B6-3A9AD7364419}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/ISSQN')]
  JISSQN = interface(JTags)
    ['{2359D1E4-F4E2-4EE5-946D-A5E14507D2EE}']
    function getcNatOp: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setcNatOp(string_: JString); cdecl;
  end;
  TJISSQN = class(TJavaGenericImport<JISSQNClass, JISSQN>) end;

  Jsat_xml_ObjetosClass = interface(JObjectClass)
    ['{54A3461D-3302-4497-B5B7-97D40869B0B5}']
    {class} function getInstance(i: Integer): JObject; cdecl;
    {class} function init: Jsat_xml_Objetos; cdecl;
    {class} procedure renovarGsDanfe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/Objetos')]
  Jsat_xml_Objetos = interface(JObject)
    ['{60B84525-12DB-45EA-A665-00BC1BA67AD4}']
  end;
  TJsat_xml_Objetos = class(TJavaGenericImport<Jsat_xml_ObjetosClass, Jsat_xml_Objetos>) end;

  Jsat_xml_Op_XmlAuxiliarClass = interface(JObjectClass)
    ['{C8C3ED3E-EF63-4973-B327-C76FF468ADF4}']
    {class} function escolherObj(string_: JString): JTags; cdecl;
    {class} procedure fnGravarValorXML(context: JContext); cdecl;
    {class} function init: Jsat_xml_Op_XmlAuxiliar; cdecl;
    {class} procedure lerXmlAuxiliar(context: JContext); cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/Op_XmlAuxiliar')]
  Jsat_xml_Op_XmlAuxiliar = interface(JObject)
    ['{0F51A6F9-B6FF-435B-8CFD-C1808805F340}']
    procedure GerarXmlAuxiliar(context: JContext); cdecl;
  end;
  TJsat_xml_Op_XmlAuxiliar = class(TJavaGenericImport<Jsat_xml_Op_XmlAuxiliarClass, Jsat_xml_Op_XmlAuxiliar>) end;

  JPRODClass = interface(JTagsClass)
    ['{F05EF540-278E-43DD-955C-01F3FE26DC4A}']
    {class} function init: JPROD; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/PROD')]
  JPROD = interface(JTags)
    ['{8323B1E7-4CD5-4F23-B327-6289E97580DA}']
    function getIndRegra: JString; cdecl;
    function getUrlQRCode: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setIndRegra(string_: JString); cdecl;
    procedure setUrlQRCode(string_: JString); cdecl;
  end;
  TJPROD = class(TJavaGenericImport<JPRODClass, JPROD>) end;

  JXml_ElementosAuxClass = interface(JObjectClass)
    ['{6C44F3B1-84A9-4194-A2AD-227E65A4E277}']
    {class} function _GetCNPJEmit: Jjdom2_Element; cdecl;
    {class} function _GetCNPJIden: Jjdom2_Element; cdecl;
    {class} function _GetCPFDest: Jjdom2_Element; cdecl;
    {class} function _GetConcentrador: Jjdom2_Element; cdecl;
    {class} function _GetCopiaSeguranca: Jjdom2_Element; cdecl;
    {class} function _GetDataHoraEmissao: Jjdom2_Element; cdecl;
    {class} function _GetEMIT: Jjdom2_Element; cdecl;
    {class} function _GetEnviarXML: Jjdom2_Element; cdecl;
    {class} function _GetIEEmit: Jjdom2_Element; cdecl;
    {class} function _GetIMEmit: Jjdom2_Element; cdecl;
    {class} function _GetIMPOSTO: Jjdom2_Element; cdecl;
    {class} function _GetISSQN: Jjdom2_Element; cdecl;
    {class} function _GetImpressora: Jjdom2_Element; cdecl;
    {class} function _GetPROD: Jjdom2_Element; cdecl;
    {class} function _GetVersaoDadosEnt: Jjdom2_Element; cdecl;
    {class} function _GetcNatOp: Jjdom2_Element; cdecl;
    {class} function _GetcRegTribISSQN: Jjdom2_Element; cdecl;
    {class} function _GetcodigoDeAtivacao: Jjdom2_Element; cdecl;
    {class} function _GetindRatISSQN: Jjdom2_Element; cdecl;
    {class} function _GetindRegra: Jjdom2_Element; cdecl;
    {class} function _GetmarcaSAT: Jjdom2_Element; cdecl;
    {class} function _GetnNF: Jjdom2_Element; cdecl;
    {class} function _GetnSerie: Jjdom2_Element; cdecl;
    {class} function _GetnumeroCaixa: Jjdom2_Element; cdecl;
    {class} function _GetnumeroSessao: Jjdom2_Element; cdecl;
    {class} function _GetsignAC: Jjdom2_Element; cdecl;
    {class} function _GetvTotalCfe: Jjdom2_Element; cdecl;
    {class} function init: JXml_ElementosAux; cdecl;//Deprecated
    {class} property CNPJEmit: Jjdom2_Element read _GetCNPJEmit;
    {class} property CNPJIden: Jjdom2_Element read _GetCNPJIden;
    {class} property CPFDest: Jjdom2_Element read _GetCPFDest;
    {class} property Concentrador: Jjdom2_Element read _GetConcentrador;
    {class} property CopiaSeguranca: Jjdom2_Element read _GetCopiaSeguranca;
    {class} property DataHoraEmissao: Jjdom2_Element read _GetDataHoraEmissao;
    {class} property EMIT: Jjdom2_Element read _GetEMIT;
    {class} property EnviarXML: Jjdom2_Element read _GetEnviarXML;
    {class} property IEEmit: Jjdom2_Element read _GetIEEmit;
    {class} property IMEmit: Jjdom2_Element read _GetIMEmit;
    {class} property IMPOSTO: Jjdom2_Element read _GetIMPOSTO;
    {class} property ISSQN: Jjdom2_Element read _GetISSQN;
    {class} property Impressora: Jjdom2_Element read _GetImpressora;
    {class} property PROD: Jjdom2_Element read _GetPROD;
    {class} property VersaoDadosEnt: Jjdom2_Element read _GetVersaoDadosEnt;
    {class} property cNatOp: Jjdom2_Element read _GetcNatOp;
    {class} property cRegTribISSQN: Jjdom2_Element read _GetcRegTribISSQN;
    {class} property codigoDeAtivacao: Jjdom2_Element read _GetcodigoDeAtivacao;
    {class} property indRatISSQN: Jjdom2_Element read _GetindRatISSQN;
    {class} property indRegra: Jjdom2_Element read _GetindRegra;
    {class} property marcaSAT: Jjdom2_Element read _GetmarcaSAT;
    {class} property nNF: Jjdom2_Element read _GetnNF;
    {class} property nSerie: Jjdom2_Element read _GetnSerie;
    {class} property numeroCaixa: Jjdom2_Element read _GetnumeroCaixa;
    {class} property numeroSessao: Jjdom2_Element read _GetnumeroSessao;
    {class} property signAC: Jjdom2_Element read _GetsignAC;
    {class} property vTotalCfe: Jjdom2_Element read _GetvTotalCfe;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/Xml_ElementosAux')]
  JXml_ElementosAux = interface(JObject)
    ['{63C6C6FA-6009-4FF1-950F-204824817CFA}']
    procedure fnAdicionarTagsXML; cdecl;
  end;
  TJXml_ElementosAux = class(TJavaGenericImport<JXml_ElementosAuxClass, JXml_ElementosAux>) end;

  JDarumaLoggerClass = interface(JObjectClass)
    ['{FE419192-DF34-402F-9427-E6E8290D0D94}']
    {class} function getReference: JDarumaLogger; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/log/DarumaLogger')]
  JDarumaLogger = interface(JObject)
    ['{8C180BEC-6426-4315-AB33-3A7A6358DA50}']
    procedure addTraceListener(iTraceListener: JITraceListener); cdecl;
    function getTraceListeners: JList; cdecl;
    procedure log(i: Integer; string_: JString; string_1: JString); cdecl;
    procedure removeAllTraceListeners; cdecl;
    function removeTraceListener(iTraceListener: JITraceListener): Boolean; cdecl;
    procedure setActive(b: Boolean); cdecl;
  end;
  TJDarumaLogger = class(TJavaGenericImport<JDarumaLoggerClass, JDarumaLogger>) end;

  JDarumaLogger_LoggerDispatcherTraceClass = interface(JRunnableClass)
    ['{19A5F89F-99B2-438D-A39C-F8CAA4F29324}']
    {class} function init(darumaLogger: JDarumaLogger; i: Integer; string_: JString; string_1: JString): JDarumaLogger_LoggerDispatcherTrace; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/log/DarumaLogger$LoggerDispatcherTrace')]
  JDarumaLogger_LoggerDispatcherTrace = interface(JRunnable)
    ['{517422CE-15B3-4368-8907-D2893462611D}']
    procedure run; cdecl;
  end;
  TJDarumaLogger_LoggerDispatcherTrace = class(TJavaGenericImport<JDarumaLogger_LoggerDispatcherTraceClass, JDarumaLogger_LoggerDispatcherTrace>) end;

  JDarumaLoggerConstClass = interface(IJavaClass)
    ['{7FA911EC-0628-4A09-98EB-161CBCDA9CEE}']
    {class} function _GetBLUETOOTH: JString; cdecl;
    {class} function _GetCOMUNICACAO: JString; cdecl;
    {class} function _GetFRAMEWORK: JString; cdecl;
    {class} function _GetLVL_API: Integer; cdecl;
    {class} function _GetLVL_DEBUG: Integer; cdecl;
    {class} function _GetLVL_ENTRADA: Integer; cdecl;
    {class} function _GetLVL_ERRO: Integer; cdecl;
    {class} function _GetLVL_SAIDA: Integer; cdecl;
    {class} function _GetNAO_IMPLEMENTADA: JString; cdecl;
    {class} function _GetSCANNER: JString; cdecl;
    {class} function _GetSERIAL: JString; cdecl;
    {class} function _GetSOCKET: JString; cdecl;
    {class} function _GetUSB: JString; cdecl;
    {class} property BLUETOOTH: JString read _GetBLUETOOTH;
    {class} property COMUNICACAO: JString read _GetCOMUNICACAO;
    {class} property FRAMEWORK: JString read _GetFRAMEWORK;
    {class} property LVL_API: Integer read _GetLVL_API;
    {class} property LVL_DEBUG: Integer read _GetLVL_DEBUG;
    {class} property LVL_ENTRADA: Integer read _GetLVL_ENTRADA;
    {class} property LVL_ERRO: Integer read _GetLVL_ERRO;
    {class} property LVL_SAIDA: Integer read _GetLVL_SAIDA;
    {class} property NAO_IMPLEMENTADA: JString read _GetNAO_IMPLEMENTADA;
    {class} property SCANNER: JString read _GetSCANNER;
    {class} property SERIAL: JString read _GetSERIAL;
    {class} property SOCKET: JString read _GetSOCKET;
    {class} property USB: JString read _GetUSB;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/log/DarumaLoggerConst')]
  JDarumaLoggerConst = interface(IJavaInstance)
    ['{94543D01-8024-482E-BB05-AD5E792383AA}']
  end;
  TJDarumaLoggerConst = class(TJavaGenericImport<JDarumaLoggerConstClass, JDarumaLoggerConst>) end;

  JPersistenciaJSONClass = interface(JObjectClass)
    ['{D8AAF490-5E75-42CC-907F-10D52A9CF734}']
    {class} function carrega(context: JContext): JInfCFe; cdecl;
    {class} procedure excluiPersistencia(context: JContext); cdecl;
    {class} function init: JPersistenciaJSON; cdecl;
    {class} procedure persiste(infCFe: JInfCFe); cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/PersistenciaJSON')]
  JPersistenciaJSON = interface(JObject)
    ['{9F0BF337-B273-460D-918E-639162EBFD74}']
  end;
  TJPersistenciaJSON = class(TJavaGenericImport<JPersistenciaJSONClass, JPersistenciaJSON>) end;

  JPersistenciaXMLClass = interface(JObjectClass)
    ['{F0212656-FEA5-402B-98A1-E295F33D65BA}']
    {class} function carrega(context: JContext): JSAT_Framework_XML; cdecl;
    {class} function init: JPersistenciaXML; cdecl;
    {class} procedure persiste(sAT_Framework_XML: JSAT_Framework_XML); cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/PersistenciaXML')]
  JPersistenciaXML = interface(JObject)
    ['{E8CC1712-8205-485E-A4CB-89BF72F58D74}']
  end;
  TJPersistenciaXML = class(TJavaGenericImport<JPersistenciaXMLClass, JPersistenciaXML>) end;

  JSatNativoClass = interface(JObjectClass)
    ['{E40C0D5C-6E24-48C1-BB9D-AF9E6D449805}']
    {class} function init(context: JContext): JSatNativo; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/SatNativo')]
  JSatNativo = interface(JObject)
    ['{C477CEA3-B0B7-43E3-94F1-A70BE3ACA0B1}']
    procedure LimpaInfCFe; cdecl;
    procedure RegAlterarValor_SAT(string_: JString; string_1: JString); cdecl;
    function RegRetornarValor_SAT(string_: JString): JString; cdecl;
    procedure aCFAbrir_SAT_Backend(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString); cdecl;
    procedure aCFCancelarAcrescimoItem_SAT_Backend(string_: JString); cdecl;
    procedure aCFCancelarDescontoItem_SAT_Backend(string_: JString); cdecl;
    procedure aCFCancelarItem_SAT_Backend(string_: JString); cdecl;
    procedure aCFConfImposto_SAT_Backend(string_: JString; string_1: JString); cdecl;
    procedure aCFEfetuarPagamento_SAT_Backend(string_: JString; string_1: JString; string_2: JString); cdecl;
    procedure aCFEstornarPagamento_SAT_Backend(string_: JString; string_1: JString; string_2: JString); cdecl;
    procedure aCFLancarAcrescimoItem_SAT_Backend(string_: JString; string_1: JString; string_2: JString); cdecl;
    procedure aCFLancarDescontoItem_SAT_Backend(string_: JString; string_1: JString; string_2: JString); cdecl;
    procedure aCFTotalizar_SAT_Backend(string_: JString; string_1: JString); cdecl;
    procedure aCFVender_SAT_Backend(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString); cdecl;
    procedure aCFeCancelarFormaPagamento_SAT_Backend(string_: JString); cdecl;
    function getEstadoVenda: Integer; cdecl;
    function getSatFrameworkXml: JSAT_Framework_XML; cdecl;
    function rInfoEstendida_SAT_Backend(string_: JString; context: JContext): JString; cdecl;
    function tCFEncerrar_SAT_Backend(string_: JString; string_1: JString; i: Integer; context: JContext): JString; cdecl;
    procedure tCFeCancelar_SAT_Backend; cdecl;
  end;
  TJSatNativo = class(TJavaGenericImport<JSatNativoClass, JSatNativo>) end;

  JDescAcrEntrClass = interface(JObjectClass)
    ['{1FF20458-CACE-4B40-AEF6-02390C2E1654}']
    {class} function init(string_: JString; string_1: JString): JDescAcrEntr; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/DescAcrEntr')]
  JDescAcrEntr = interface(JObject)
    ['{DE8A2C66-A6F7-412A-8908-13E7AC15EFC9}']
    function getvAcresSubtot: JString; cdecl;
    function getvDescSubtot: JString; cdecl;
    procedure setvAcresSubtot(string_: JString); cdecl;
    procedure setvDescSubtot(string_: JString); cdecl;
  end;
  TJDescAcrEntr = class(TJavaGenericImport<JDescAcrEntrClass, JDescAcrEntr>) end;

  JDestClass = interface(JObjectClass)
    ['{C98830FE-1E13-471A-B3AE-9F2DCCD68FD2}']
    {class} function init(string_: JString; string_1: JString): JDest; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Dest')]
  JDest = interface(JObject)
    ['{79ECD11C-E710-4F69-A24F-8D7DF51AD651}']
  end;
  TJDest = class(TJavaGenericImport<JDestClass, JDest>) end;

  JDetClass = interface(JObjectClass)
    ['{25F4D94C-10A2-42A5-BF44-6F04B02BA508}']
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString; i: Integer): JDet; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Det')]
  JDet = interface(JObject)
    ['{DB40FB18-9022-41DE-8E57-C5C5CBCE2A0E}']
    function getProd: JelementosCFe_Prod; cdecl;
    function getValorTotalSemRateio: JDouble; cdecl;
    function getnItem: JString; cdecl;
    function getqCom: JString; cdecl;
    function getvItem: JString; cdecl;
    function getvUnCom: JString; cdecl;
    procedure limpaAuxiliares; cdecl;
    procedure setCOFINS(cofins: JCofins); cdecl;
    procedure setDescAcresc(string_: JString; string_1: JString; string_2: JString); cdecl;
    procedure setICMS(icms: JIcms); cdecl;
    procedure setISSQN(issqn: Jimpostos_Issqn); cdecl;
    procedure setPIS(pis: JPis); cdecl;
    procedure setRateio(double: JDouble; string_: JString; string_1: JString); cdecl;
    procedure setnItem(i: Integer); cdecl;
  end;
  TJDet = class(TJavaGenericImport<JDetClass, JDet>) end;

  JelementosCFe_EmitClass = interface(JObjectClass)
    ['{A48D73D1-4A3B-4102-9AC8-1E5728C0290C}']
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString): JelementosCFe_Emit; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Emit')]
  JelementosCFe_Emit = interface(JObject)
    ['{113DB215-CCBD-4339-AD3B-9458E523F741}']
  end;
  TJelementosCFe_Emit = class(TJavaGenericImport<JelementosCFe_EmitClass, JelementosCFe_Emit>) end;

  JEntregaClass = interface(JObjectClass)
    ['{51D5F612-4437-4E45-825F-8021241273FD}']
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString): JEntrega; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Entrega')]
  JEntrega = interface(JObject)
    ['{FA108AA9-2FDC-45E7-877F-26640EDFF2FA}']
  end;
  TJEntrega = class(TJavaGenericImport<JEntregaClass, JEntrega>) end;

  JIdeClass = interface(JObjectClass)
    ['{6B21F828-436F-47F0-A3D9-5E98EE0AED21}']
    {class} function init(string_: JString; string_1: JString; string_2: JString): JIde; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Ide')]
  JIde = interface(JObject)
    ['{9D2EFC1D-0DDC-4017-A4CE-D789CF11C589}']
  end;
  TJIde = class(TJavaGenericImport<JIdeClass, JIde>) end;

  JInfAdicClass = interface(JObjectClass)
    ['{F65EE6A0-E623-46CC-B5E7-AA2E63B2A440}']
    {class} function init(string_: JString): JInfAdic; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/InfAdic')]
  JInfAdic = interface(JObject)
    ['{E394DDD0-48A8-4C8F-BFC2-A2A381235667}']
  end;
  TJInfAdic = class(TJavaGenericImport<JInfAdicClass, JInfAdic>) end;

  JInfCFeClass = interface(JObjectClass)
    ['{9282AC71-0AB1-4AA7-B069-9328E633846C}']
    {class} function init: JInfCFe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/InfCFe')]
  JInfCFe = interface(JObject)
    ['{B700ACC4-9F4A-451F-A944-E2423BE050C1}']
    function _GetversaoDadosEnt: JString; cdecl;
    procedure _SetversaoDadosEnt(Value: JString); cdecl;
    procedure cancelaItem(string_: JString); cdecl;
    procedure estornaPagamento(string_: JString; string_1: JString; string_2: JString); cdecl;
    function getCOFINS: JCofins; cdecl;
    function getDest: JDest; cdecl;
    function getDet: JList; cdecl;
    function getEstadoVenda: Byte; cdecl;
    function getICMS: JIcms; cdecl;
    function getISSQN: Jimpostos_Issqn; cdecl;
    function getPIS: JPis; cdecl;
    function getPgto: JPgto; cdecl;
    function getTotal: JTotal; cdecl;
    procedure limpaDescontoAcrescimo(string_: JString); cdecl;
    procedure removePagamentoSat(string_: JString); cdecl;
    procedure setAcrescimoItem(string_: JString; string_1: JString; string_2: JString; string_3: JString); cdecl;
    procedure setCOFINS(cofins: JCofins); cdecl;
    procedure setDescontoItem(string_: JString; string_1: JString; string_2: JString; string_3: JString); cdecl;
    procedure setDest(string_: JString; string_1: JString); cdecl;
    procedure setDet(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString); cdecl;
    procedure setEncerramento(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString); cdecl;
    procedure setEntrega(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString); cdecl;
    procedure setICMS(icms: JIcms); cdecl;
    procedure setISSQN(issqn: Jimpostos_Issqn); cdecl;
    procedure setPIS(pis: JPis); cdecl;
    procedure setPagamentoSat(string_: JString; string_1: JString; string_2: JString); cdecl;
    procedure setTotalizacao(string_: JString; string_1: JString; string_2: JString); cdecl;
    property versaoDadosEnt: JString read _GetversaoDadosEnt write _SetversaoDadosEnt;
  end;
  TJInfCFe = class(TJavaGenericImport<JInfCFeClass, JInfCFe>) end;

  JMeioDePagamentoClass = interface(JObjectClass)
    ['{1919522C-0C09-4F8D-B25D-C2FDC5CEA114}']
    {class} function init(string_: JString; string_1: JString; string_2: JString): JMeioDePagamento; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/MeioDePagamento')]
  JMeioDePagamento = interface(JObject)
    ['{D0EE1DEF-A1AA-4398-8BF8-F4BE316151BF}']
    function getcAdmC: JString; cdecl;
    function getcMP: JString; cdecl;
    function getvMP: JString; cdecl;
    procedure setcAdmC(string_: JString); cdecl;
    procedure setcMP(string_: JString); cdecl;
    procedure setvMP(string_: JString); cdecl;
  end;
  TJMeioDePagamento = class(TJavaGenericImport<JMeioDePagamentoClass, JMeioDePagamento>) end;

  JPgtoClass = interface(JObjectClass)
    ['{741008F4-502D-46FC-9B2B-0B493AC66581}']
    {class} function init: JPgto; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Pgto')]
  JPgto = interface(JObject)
    ['{0966CAC3-1FBA-4D2A-928D-05359E812D7E}']
    procedure add(meioDePagamento: JMeioDePagamento); cdecl;
    function getPagamentosEfetuados: Integer; cdecl;
    function getTotalPago: JString; cdecl;
    procedure remove(i: Integer); cdecl;
    procedure removeUltimo; cdecl;
    procedure setTotalPago(string_: JString); cdecl;
  end;
  TJPgto = class(TJavaGenericImport<JPgtoClass, JPgto>) end;

  JelementosCFe_ProdClass = interface(JObjectClass)
    ['{090AF19B-9F60-4F34-BEBD-B2F3846D19D9}']
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString): JelementosCFe_Prod; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Prod')]
  JelementosCFe_Prod = interface(JObject)
    ['{2E68A4BC-F5DB-4251-B33F-322C6A5D4B6C}']
    function getTipoDescAcr: JString; cdecl;
    function getValorTotalSemRateio: Double; cdecl;
    function getqCom: JString; cdecl;
    function getvDesc: JString; cdecl;
    function getvItem: JString; cdecl;
    function getvOutro: JString; cdecl;
    function getvUnCom: JString; cdecl;
    procedure limpaAuxiliares; cdecl;
    procedure setDescAcresc(string_: JString; string_1: JString; string_2: JString); cdecl;
    procedure setRateio(d: Double; string_: JString; string_1: JString); cdecl;
  end;
  TJelementosCFe_Prod = class(TJavaGenericImport<JelementosCFe_ProdClass, JelementosCFe_Prod>) end;

  JTotalClass = interface(JObjectClass)
    ['{6BDAF18B-9504-4358-8282-53CD0AF88A62}']
    {class} function init(string_: JString; descAcrEntr: JDescAcrEntr): JTotal; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Total')]
  JTotal = interface(JObject)
    ['{B0005B33-79B2-4708-B7F2-46F59CB8DDCC}']
    function getvCFe: JString; cdecl;
    procedure setvCFe(string_: JString); cdecl;
  end;
  TJTotal = class(TJavaGenericImport<JTotalClass, JTotal>) end;

  JCofinsClass = interface(JObjectClass)
    ['{58FE99CB-37E0-4FB6-9D8D-5FA84D666675}']
    {class} function init: JCofins; cdecl; overload;
    {class} function init(cofinsnt: JCofinsnt): JCofins; cdecl; overload;
    {class} function init(cofinsqtde: JCofinsqtde): JCofins; cdecl; overload;
    {class} function init(cofinsaliq: JCofinsaliq): JCofins; cdecl; overload;
    {class} function init(cofinssn: JCofinssn): JCofins; cdecl; overload;
    {class} function init(cofinsst: JCofinsst): JCofins; cdecl; overload;
    {class} function init(b: Boolean): JCofins; cdecl; overload;
    {class} function init(cofinsoutr: JCofinsoutr): JCofins; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofins')]
  JCofins = interface(JObject)
    ['{638AB6E6-46BB-4227-8AAC-7B76F7C28F3A}']
    procedure completaDadosImposto(string_: JString; string_1: JString); cdecl;
    procedure completaXml; cdecl;
    function getCOFINSALIQ: JCofinsaliq; cdecl;
    function getCOFINSNT: JCofinsnt; cdecl;
    function getCOFINSOUTR: JCofinsoutr; cdecl;
    function getCOFINSQTDE: JCofinsqtde; cdecl;
    function getCOFINSSN: JCofinssn; cdecl;
    function getCOFINSST: JCofinsst; cdecl;
    procedure setCOFINSALIQ(cofinsaliq: JCofinsaliq); cdecl;
    procedure setCOFINSNT(cofinsnt: JCofinsnt); cdecl;
    procedure setCOFINSOUTR(cofinsoutr: JCofinsoutr); cdecl;
    procedure setCOFINSQTDE(cofinsqtde: JCofinsqtde); cdecl;
    procedure setCOFINSSN(cofinssn: JCofinssn); cdecl;
    procedure setCOFINSST(cofinsst: JCofinsst); cdecl;
  end;
  TJCofins = class(TJavaGenericImport<JCofinsClass, JCofins>) end;

  JCofinsaliqClass = interface(JObjectClass)
    ['{52486B57-9028-47A1-994E-A35CA449E00A}']
    {class} function init: JCofinsaliq; cdecl; overload;
    {class} function init(b: Boolean): JCofinsaliq; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JCofinsaliq; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinsaliq')]
  JCofinsaliq = interface(JObject)
    ['{F595BFE4-6225-4A08-A2FD-BF127FAE6088}']
    procedure completaDadosImposto(string_: JString); cdecl;
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    function getpCOFINS: JString; cdecl;
    function getvBC: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setpCOFINS(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
  end;
  TJCofinsaliq = class(TJavaGenericImport<JCofinsaliqClass, JCofinsaliq>) end;

  JCofinsntClass = interface(JObjectClass)
    ['{4904EDE9-3913-43A2-9AD4-4610C1BC5FFC}']
    {class} function init: JCofinsnt; cdecl; overload;
    {class} function init(b: Boolean): JCofinsnt; cdecl; overload;
    {class} function init(string_: JString): JCofinsnt; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinsnt')]
  JCofinsnt = interface(JObject)
    ['{F83E7C2B-501A-41C6-B81A-9006CC1A8416}']
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJCofinsnt = class(TJavaGenericImport<JCofinsntClass, JCofinsnt>) end;

  JCofinsoutrClass = interface(JObjectClass)
    ['{ED41C478-0361-4F1D-A69A-4CE97DA0E084}']
    {class} function init: JCofinsoutr; cdecl; overload;
    {class} function init(b: Boolean): JCofinsoutr; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JCofinsoutr; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinsoutr')]
  JCofinsoutr = interface(JObject)
    ['{54F99838-F17D-4559-A661-8B8481CD8F7B}']
    procedure completaDadosImposto(string_: JString; string_1: JString); cdecl;
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    function getpCOFINS: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    function getvBC: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setpCOFINS(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
  end;
  TJCofinsoutr = class(TJavaGenericImport<JCofinsoutrClass, JCofinsoutr>) end;

  JCofinsqtdeClass = interface(JObjectClass)
    ['{70C9A4C1-EC0E-4CC2-8702-35CD486A154F}']
    {class} function init: JCofinsqtde; cdecl; overload;
    {class} function init(b: Boolean): JCofinsqtde; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JCofinsqtde; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinsqtde')]
  JCofinsqtde = interface(JObject)
    ['{76326EC1-B4F6-4CCA-88B8-97E0DD594532}']
    procedure completaDadosImposto(string_: JString); cdecl;
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
  end;
  TJCofinsqtde = class(TJavaGenericImport<JCofinsqtdeClass, JCofinsqtde>) end;

  JCofinssnClass = interface(JObjectClass)
    ['{E9FDE504-D689-4C66-9FBD-1709BC952235}']
    {class} function init: JCofinssn; cdecl; overload;
    {class} function init(string_: JString): JCofinssn; cdecl; overload;
    {class} function init(b: Boolean): JCofinssn; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinssn')]
  JCofinssn = interface(JObject)
    ['{4046EFFC-D0A9-4D24-B5B0-DE30A4C0047A}']
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJCofinssn = class(TJavaGenericImport<JCofinssnClass, JCofinssn>) end;

  JCofinsstClass = interface(JObjectClass)
    ['{44D06C16-87A1-498D-A96C-50694FB5F35A}']
    {class} function init: JCofinsst; cdecl; overload;
    {class} function init(b: Boolean): JCofinsst; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JCofinsst; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinsst')]
  JCofinsst = interface(JObject)
    ['{99D0A6F4-D6D6-4840-891C-2E1E6C5D5A74}']
    procedure completaDadosImposto(string_: JString; string_1: JString); cdecl;
    procedure completaXml; cdecl;
    function getpCOFINS: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    function getvBC: JString; cdecl;
    procedure setpCOFINS(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
  end;
  TJCofinsst = class(TJavaGenericImport<JCofinsstClass, JCofinsst>) end;

  JIcmsClass = interface(JObjectClass)
    ['{F026ADBC-1964-4382-B24A-CBD9819CEEA2}']
    {class} function init: JIcms; cdecl; overload;
    {class} function init(icms00: JIcms00): JIcms; cdecl; overload;
    {class} function init(icms40: JIcms40): JIcms; cdecl; overload;
    {class} function init(icmssn102: JIcmssn102): JIcms; cdecl; overload;
    {class} function init(b: Boolean): JIcms; cdecl; overload;
    {class} function init(icmssn900: JIcmssn900): JIcms; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Icms')]
  JIcms = interface(JObject)
    ['{3BC93BD8-BB39-4777-91EA-A6C0B5CE60C2}']
    procedure completaXml; cdecl;
    function getICMS00: JIcms00; cdecl;
    function getICMS40: JIcms40; cdecl;
    function getICMSSN102: JIcmssn102; cdecl;
    function getICMSSN900: JIcmssn900; cdecl;
    procedure setICMS00(icms00: JIcms00); cdecl;
    procedure setICMS40(icms40: JIcms40); cdecl;
    procedure setICMSSN102(icmssn102: JIcmssn102); cdecl;
    procedure setICMSSN900(icmssn900: JIcmssn900); cdecl;
  end;
  TJIcms = class(TJavaGenericImport<JIcmsClass, JIcms>) end;

  JIcms00Class = interface(JObjectClass)
    ['{91F4CA94-D470-469D-ABF7-E9279C8FEEC6}']
    {class} function init: JIcms00; cdecl; overload;
    {class} function init(b: Boolean): JIcms00; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JIcms00; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Icms00')]
  JIcms00 = interface(JObject)
    ['{90AB9D4B-777F-4264-9470-0487962D2490}']
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    function getOrig: JString; cdecl;
    function getpICMS: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setOrig(string_: JString); cdecl;
    procedure setpICMS(string_: JString); cdecl;
  end;
  TJIcms00 = class(TJavaGenericImport<JIcms00Class, JIcms00>) end;

  JIcms40Class = interface(JObjectClass)
    ['{58CF41A3-7D09-47EF-B0E5-E841C2F08F91}']
    {class} function init: JIcms40; cdecl; overload;
    {class} function init(b: Boolean): JIcms40; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JIcms40; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Icms40')]
  JIcms40 = interface(JObject)
    ['{6FB68EEE-10F9-4986-B574-648AF55D9891}']
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    function getOrig: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setOrig(string_: JString); cdecl;
  end;
  TJIcms40 = class(TJavaGenericImport<JIcms40Class, JIcms40>) end;

  JIcmssn102Class = interface(JObjectClass)
    ['{F9F0B415-62A8-4A03-8579-65B21790A431}']
    {class} function init: JIcmssn102; cdecl; overload;
    {class} function init(b: Boolean): JIcmssn102; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JIcmssn102; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Icmssn102')]
  JIcmssn102 = interface(JObject)
    ['{61E93C3F-2C5D-45C7-9DB5-B7EC3C019947}']
    procedure completaXml; cdecl;
    function getCSOSN: JString; cdecl;
    function getOrig: JString; cdecl;
    procedure setCSOSN(string_: JString); cdecl;
    procedure setOrig(string_: JString); cdecl;
  end;
  TJIcmssn102 = class(TJavaGenericImport<JIcmssn102Class, JIcmssn102>) end;

  JIcmssn900Class = interface(JObjectClass)
    ['{60F1C4A0-991B-4A2A-B7B2-5D52858D20A3}']
    {class} function init: JIcmssn900; cdecl; overload;
    {class} function init(b: Boolean): JIcmssn900; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JIcmssn900; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Icmssn900')]
  JIcmssn900 = interface(JObject)
    ['{A542DE43-C23E-45C7-AB38-014C0DCC247E}']
    procedure completaXml; cdecl;
    function getCSOSN: JString; cdecl;
    function getOrig: JString; cdecl;
    function getpICMS: JString; cdecl;
    procedure setCSOSN(string_: JString); cdecl;
    procedure setOrig(string_: JString); cdecl;
    procedure setpICMS(string_: JString); cdecl;
  end;
  TJIcmssn900 = class(TJavaGenericImport<JIcmssn900Class, JIcmssn900>) end;

  Jimpostos_IssqnClass = interface(JObjectClass)
    ['{0B520A5C-7C90-41EC-BB91-9FA635C31028}']
    {class} function init: Jimpostos_Issqn; cdecl; overload;
    {class} function init(b: Boolean): Jimpostos_Issqn; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString): Jimpostos_Issqn; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Issqn')]
  Jimpostos_Issqn = interface(JObject)
    ['{98D72237-5016-4F17-A2D0-517784CB67B1}']
    procedure completaXml; cdecl;
    function getIndIncFisc: JString; cdecl;
    function getcListServ: JString; cdecl;
    function getcMunFG: JString; cdecl;
    function getcNatOp: JString; cdecl;
    function getcServTribMun: JString; cdecl;
    function getvAliq: JString; cdecl;
    function getvBC: JString; cdecl;
    function getvDeducISSQN: JString; cdecl;
    procedure setIndIncFisc(string_: JString); cdecl;
    procedure setcListServ(string_: JString); cdecl;
    procedure setcMunFG(string_: JString); cdecl;
    procedure setcNatOp(string_: JString); cdecl;
    procedure setcServTribMun(string_: JString); cdecl;
    procedure setvAliq(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
    procedure setvDeducISSQN(string_: JString); cdecl;
  end;
  TJimpostos_Issqn = class(TJavaGenericImport<Jimpostos_IssqnClass, Jimpostos_Issqn>) end;

  JPisClass = interface(JObjectClass)
    ['{561C9A49-6E30-4E15-A679-42CCF36F7A7C}']
    {class} function init: JPis; cdecl; overload;
    {class} function init(pisnt: JPisnt): JPis; cdecl; overload;
    {class} function init(pisqtde: JPisqtde): JPis; cdecl; overload;
    {class} function init(pisaliq: JPisaliq): JPis; cdecl; overload;
    {class} function init(pissn: JPissn): JPis; cdecl; overload;
    {class} function init(pisst: JPisst): JPis; cdecl; overload;
    {class} function init(b: Boolean): JPis; cdecl; overload;
    {class} function init(pisoutr: JPisoutr): JPis; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pis')]
  JPis = interface(JObject)
    ['{3758D170-52BE-40FA-8DDE-8826BA4CA06B}']
    procedure completaDadosImposto(string_: JString; string_1: JString); cdecl;
    procedure completaXml; cdecl;
    function getPISALIQ: JPisaliq; cdecl;
    function getPISNT: JPisnt; cdecl;
    function getPISOUTR: JPisoutr; cdecl;
    function getPISQTDE: JPisqtde; cdecl;
    function getPISSN: JPissn; cdecl;
    function getPISST: JPisst; cdecl;
    procedure setPISALIQ(pisaliq: JPisaliq); cdecl;
    procedure setPISNT(pisnt: JPisnt); cdecl;
    procedure setPISOUTR(pisoutr: JPisoutr); cdecl;
    procedure setPISQTDE(pisqtde: JPisqtde); cdecl;
    procedure setPISSN(pissn: JPissn); cdecl;
    procedure setPISST(pisst: JPisst); cdecl;
  end;
  TJPis = class(TJavaGenericImport<JPisClass, JPis>) end;

  JPisaliqClass = interface(JObjectClass)
    ['{A26D485E-F558-4ED0-B043-140274BCCEE7}']
    {class} function init: JPisaliq; cdecl; overload;
    {class} function init(b: Boolean): JPisaliq; cdecl; overload;
    {class} function init(string_: JString): JPisaliq; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JPisaliq; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pisaliq')]
  JPisaliq = interface(JObject)
    ['{55B7927A-33F5-4CCF-80A1-6B53F55590BD}']
    procedure completaDadosImposto(string_: JString); cdecl;
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    function getpPIS: JString; cdecl;
    function getvBC: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setpPIS(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
  end;
  TJPisaliq = class(TJavaGenericImport<JPisaliqClass, JPisaliq>) end;

  JPisntClass = interface(JObjectClass)
    ['{363CB288-288F-41E2-9511-5934ECCCA685}']
    {class} function init: JPisnt; cdecl; overload;
    {class} function init(b: Boolean): JPisnt; cdecl; overload;
    {class} function init(string_: JString): JPisnt; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pisnt')]
  JPisnt = interface(JObject)
    ['{194EE17C-5F43-4481-A1F4-DEC545645C9E}']
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJPisnt = class(TJavaGenericImport<JPisntClass, JPisnt>) end;

  JPisoutrClass = interface(JObjectClass)
    ['{DC91B9C3-4B13-41CA-9867-BEA5FBF74044}']
    {class} function init: JPisoutr; cdecl; overload;
    {class} function init(b: Boolean): JPisoutr; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JPisoutr; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pisoutr')]
  JPisoutr = interface(JObject)
    ['{FAA45B92-7AC0-438C-A7E9-AF52AB8C84BA}']
    procedure completaDadosImposto(string_: JString; string_1: JString); cdecl;
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    function getpPIS: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    function getvBC: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setpPIS(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
  end;
  TJPisoutr = class(TJavaGenericImport<JPisoutrClass, JPisoutr>) end;

  JPisqtdeClass = interface(JObjectClass)
    ['{9C3F5748-F69F-43E1-B907-B5A6B0F61BB3}']
    {class} function init: JPisqtde; cdecl; overload;
    {class} function init(b: Boolean): JPisqtde; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JPisqtde; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pisqtde')]
  JPisqtde = interface(JObject)
    ['{0624F0C8-CB0C-4401-BF18-CFAB3813A04C}']
    procedure completaDadosImposto(string_: JString); cdecl;
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
  end;
  TJPisqtde = class(TJavaGenericImport<JPisqtdeClass, JPisqtde>) end;

  JPissnClass = interface(JObjectClass)
    ['{94E7E748-C2E8-469F-9949-7EB31F336E1C}']
    {class} function init: JPissn; cdecl; overload;
    {class} function init(string_: JString): JPissn; cdecl; overload;
    {class} function init(b: Boolean): JPissn; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pissn')]
  JPissn = interface(JObject)
    ['{A86637EB-FB94-4141-92F6-07F098B3F1AD}']
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJPissn = class(TJavaGenericImport<JPissnClass, JPissn>) end;

  JPisstClass = interface(JObjectClass)
    ['{EB801273-1E55-4642-BE66-6F41760BEF98}']
    {class} function init: JPisst; cdecl; overload;
    {class} function init(b: Boolean): JPisst; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JPisst; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pisst')]
  JPisst = interface(JObject)
    ['{A9886246-C2F6-4D64-AAEF-646C217BE30B}']
    procedure completaDadosImposto(string_: JString; string_1: JString); cdecl;
    procedure completaXml; cdecl;
    function getpPIS: JString; cdecl;
    function getqBCProd: JString; cdecl;
    function getvAliqProd: JString; cdecl;
    function getvBC: JString; cdecl;
    procedure setpPIS(string_: JString); cdecl;
    procedure setqBCProd(string_: JString); cdecl;
    procedure setvAliqProd(string_: JString); cdecl;
    procedure setvBC(string_: JString); cdecl;
  end;
  TJPisst = class(TJavaGenericImport<JPisstClass, JPisst>) end;

  JxmlConfiguracao_ConfiguracaoClass = interface(JObjectClass)
    ['{649BC792-111E-438E-96C2-B8DCD1C882DA}']
    {class} function init: JxmlConfiguracao_Configuracao; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/Configuracao')]
  JxmlConfiguracao_Configuracao = interface(JObject)
    ['{B9D934B1-51CE-4110-92B4-F7A043929BC7}']
    procedure completaXml; cdecl;
    function getCPF: JString; cdecl;
    function getCaracterSeparador: JString; cdecl;
    function getChaveConsulta: JString; cdecl;
    function getCodigoDeAtivacao: JString; cdecl;
    function getConcentrador: JString; cdecl;
    function getCopiaSeguranca: JString; cdecl;
    function getEnviarXML: JString; cdecl;
    function getImpressaoCompleta: JString; cdecl;
    function getImpressora: JString; cdecl;
    function getLocalArquivos: JString; cdecl;
    function getLocalLogo: JString; cdecl;
    function getMarcaSAT: JString; cdecl;
    function getNumeroSessao: JString; cdecl;
    function getQrcodeBMP: JString; cdecl;
    function getVersaoDadosEnt: JString; cdecl;
    procedure setCPF(string_: JString); cdecl;
    procedure setCaracterSeparador(string_: JString); cdecl;
    procedure setChaveConsulta(string_: JString); cdecl;
    procedure setCodigoDeAtivacao(string_: JString); cdecl;
    procedure setConcentrador(string_: JString); cdecl;
    procedure setCopiaSeguranca(string_: JString); cdecl;
    procedure setEnviarXML(string_: JString); cdecl;
    procedure setImpressaoCompleta(string_: JString); cdecl;
    procedure setImpressora(string_: JString); cdecl;
    procedure setLocalArquivos(string_: JString); cdecl;
    procedure setLocalLogo(string_: JString); cdecl;
    procedure setMarcaSAT(string_: JString); cdecl;
    procedure setNumeroSessao(string_: JString); cdecl;
    procedure setQrcodeBMP(string_: JString); cdecl;
    procedure setVersaoDadosEnt(string_: JString); cdecl;
  end;
  TJxmlConfiguracao_Configuracao = class(TJavaGenericImport<JxmlConfiguracao_ConfiguracaoClass, JxmlConfiguracao_Configuracao>) end;

  JxmlConfiguracao_EmitClass = interface(JObjectClass)
    ['{73D24ED3-E5CE-4195-B063-3390E43DD4D8}']
    {class} function init: JxmlConfiguracao_Emit; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/Emit')]
  JxmlConfiguracao_Emit = interface(JObject)
    ['{733C28C4-0665-49C2-AE6B-0492D92E5E6B}']
    procedure completaXml; cdecl;
    function getCNPJ: JString; cdecl;
    function getIE: JString; cdecl;
    function getIM: JString; cdecl;
    function getIndRatISSQN: JString; cdecl;
    function getcRegTribISSQN: JString; cdecl;
    procedure setCNPJ(string_: JString); cdecl;
    procedure setIE(string_: JString); cdecl;
    procedure setIM(string_: JString); cdecl;
    procedure setIndRatISSQN(string_: JString); cdecl;
    procedure setcRegTribISSQN(string_: JString); cdecl;
  end;
  TJxmlConfiguracao_Emit = class(TJavaGenericImport<JxmlConfiguracao_EmitClass, JxmlConfiguracao_Emit>) end;

  JIdentificacaoCFeClass = interface(JObjectClass)
    ['{23B1E849-F903-4DD9-8900-299A22CE76E6}']
    {class} function init: JIdentificacaoCFe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/IdentificacaoCFe')]
  JIdentificacaoCFe = interface(JObject)
    ['{C4B3F9FB-996B-408B-B6A8-42B3AC862065}']
    procedure completaXml; cdecl;
    function getCNPJ: JString; cdecl;
    function getDataHoraEmissao: JString; cdecl;
    function getNumeroCaixa: JString; cdecl;
    function getSignAC: JString; cdecl;
    function getnNF: JString; cdecl;
    function getnSerie: JString; cdecl;
    function getvTotalCfe: JString; cdecl;
    procedure setCNPJ(string_: JString); cdecl;
    procedure setDataHoraEmissao(string_: JString); cdecl;
    procedure setNumeroCaixa(string_: JString); cdecl;
    procedure setSignAC(string_: JString); cdecl;
    procedure setnNF(string_: JString); cdecl;
    procedure setnSerie(string_: JString); cdecl;
    procedure setvTotalCfe(string_: JString); cdecl;
  end;
  TJIdentificacaoCFe = class(TJavaGenericImport<JIdentificacaoCFeClass, JIdentificacaoCFe>) end;

  JImpostoClass = interface(JObjectClass)
    ['{22691650-5C6D-4BE0-83FE-625A9BC9AD77}']
    {class} function init: JImposto; cdecl; overload;
    {class} function init(b: Boolean): JImposto; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/Imposto')]
  JImposto = interface(JObject)
    ['{8CB79A04-ACFC-42D4-B652-A2EF1825B256}']
    procedure completaXml; cdecl;
    function getCOFINS: JCofins; cdecl;
    function getICMS: JIcms; cdecl;
    function getISSQN: Jimpostos_Issqn; cdecl;
    function getPIS: JPis; cdecl;
    procedure setCOFINS(cofins: JCofins); cdecl;
    procedure setICMS(icms: JIcms); cdecl;
    procedure setISSQN(issqn: Jimpostos_Issqn); cdecl;
    procedure setPIS(pis: JPis); cdecl;
  end;
  TJImposto = class(TJavaGenericImport<JImpostoClass, JImposto>) end;

  JxmlConfiguracao_ProdClass = interface(JObjectClass)
    ['{9603CC31-BA11-4198-BDDC-F67AB09A40D1}']
    {class} function init: JxmlConfiguracao_Prod; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/Prod')]
  JxmlConfiguracao_Prod = interface(JObject)
    ['{5A6CA01D-2117-4E06-A48D-77F5A9519B4B}']
    procedure completaXml; cdecl;
    function getCFOP: JString; cdecl;
    function getIndRegra: JString; cdecl;
    function getNCM: JString; cdecl;
    function getUrlQRCode: JString; cdecl;
    procedure setCFOP(string_: JString); cdecl;
    procedure setIndRegra(string_: JString); cdecl;
    procedure setNCM(string_: JString); cdecl;
    procedure setUrlQRCode(string_: JString); cdecl;
  end;
  TJxmlConfiguracao_Prod = class(TJavaGenericImport<JxmlConfiguracao_ProdClass, JxmlConfiguracao_Prod>) end;

  JSAT_Framework_XMLClass = interface(JObjectClass)
    ['{B25927BD-C0CF-46E1-9D33-04974A4B904E}']
    {class} function init: JSAT_Framework_XML; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/SAT_Framework_XML')]
  JSAT_Framework_XML = interface(JObject)
    ['{25E4983E-F8CD-4044-BA12-BA74C603052B}']
    procedure RegAlterarValor_SAT(string_: JString; string_1: JString); cdecl;
    function RegRetornarValor_SAT(string_: JString): JString; cdecl;
    procedure completaXml; cdecl;
  end;
  TJSAT_Framework_XML = class(TJavaGenericImport<JSAT_Framework_XMLClass, JSAT_Framework_XML>) end;

  JComunicacaoWSClass = interface(Jgne_UtilsClass)
    ['{53693652-A03F-4F14-841C-B9B84A590D99}']
    {class} function init: JComunicacaoWS; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/ComunicacaoWS')]
  JComunicacaoWS = interface(Jgne_Utils)
    ['{4C638000-850C-4D2F-AEBE-EFDBB47797EB}']
    function fnEnviarXmlSat(string_: JString; context: JContext; i: Integer): Integer; cdecl;
  end;
  TJComunicacaoWS = class(TJavaGenericImport<JComunicacaoWSClass, JComunicacaoWS>) end;

  JITServiceWsClass = interface(JObjectClass)
    ['{4FC51FCE-95B5-4FF3-B3CE-87B7C05A188E}']
    {class} function getInstancia: JITServiceWs; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/ITServiceWs')]
  JITServiceWs = interface(JObject)
    ['{91D53C77-6314-4FA3-9EE4-29032D4E4C9C}']
    function enviarDadosEmissao(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; context: JContext): Integer; cdecl;
    function enviarDadosEmissaoCtg(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; context: JContext): Integer; cdecl;
    function verificarWs(string_: JString; string_1: JString; string_2: JString; context: JContext): Integer; cdecl;
  end;
  TJITServiceWs = class(TJavaGenericImport<JITServiceWsClass, JITServiceWs>) end;

  JTrustedManagerManipulatorClass = interface(JX509TrustManagerClass)
    ['{7ADBB221-3F0F-44E3-8952-EBDE5BCCE8A9}']
    {class} procedure allowAllSSL; cdecl;
    {class} function init: JTrustedManagerManipulator; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/TrustedManagerManipulator')]
  JTrustedManagerManipulator = interface(JX509TrustManager)
    ['{13D5942D-5191-4468-B5E0-026819A3F480}']
    procedure checkClientTrusted(x509Certificate: TJavaObjectArray<JX509Certificate>; string_: JString); cdecl;
    procedure checkServerTrusted(x509Certificate: TJavaObjectArray<JX509Certificate>; string_: JString); cdecl;
    function getAcceptedIssuers: TJavaObjectArray<JX509Certificate>; cdecl;
    function isClientTrusted(x509Certificate: TJavaObjectArray<JX509Certificate>): Boolean; cdecl;
    function isServerTrusted(x509Certificate: TJavaObjectArray<JX509Certificate>): Boolean; cdecl;
  end;
  TJTrustedManagerManipulator = class(TJavaGenericImport<JTrustedManagerManipulatorClass, JTrustedManagerManipulator>) end;

  JTrustedManagerManipulator_1Class = interface(JHostnameVerifierClass)
    ['{B6EC0613-D559-4A83-B61D-DEE102FEA5DF}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/TrustedManagerManipulator$1')]
  JTrustedManagerManipulator_1 = interface(JHostnameVerifier)
    ['{92920022-B557-4671-A935-5A6F76141FA5}']
    function verify(string_: JString; sSLSession: JSSLSession): Boolean; cdecl;
  end;
  TJTrustedManagerManipulator_1 = class(TJavaGenericImport<JTrustedManagerManipulator_1Class, JTrustedManagerManipulator_1>) end;

  JDadosConsultaClass = interface(JObjectClass)
    ['{B32063B6-9352-460D-A17E-E2B3A8E6F9D2}']
    {class} function init(string_: JString; string_1: JString; string_2: JString): JDadosConsulta; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/modelo/DadosConsulta')]
  JDadosConsulta = interface(JObject)
    ['{6754A653-65FA-4163-BE17-F783A93A1E01}']
    function getCnpj: JString; cdecl;
    function getMarcaImpressora: JString; cdecl;
    function getMarcaSat: JString; cdecl;
    procedure setCnpj(string_: JString); cdecl;
    procedure setMarcaImpressora(string_: JString); cdecl;
    procedure setMarcaSat(string_: JString); cdecl;
    function toJsonByteArray: TJavaArray<Byte>; cdecl;
  end;
  TJDadosConsulta = class(TJavaGenericImport<JDadosConsultaClass, JDadosConsulta>) end;

  JInfoEmissaoClass = interface(JObjectClass)
    ['{61B38BE0-534C-46C9-B942-549E6B9FD9F2}']
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString; string_11: JString): JInfoEmissao; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/modelo/InfoEmissao')]
  JInfoEmissao = interface(JObject)
    ['{5AF1BB26-9F80-4170-BD37-A1D5BB61A36A}']
    procedure setCnpj(string_: JString); cdecl;
    procedure setDataHora(string_: JString); cdecl;
    procedure setEmpPk(string_: JString); cdecl;
    procedure setFirmwareImpressora(string_: JString); cdecl;
    procedure setMarcaImpressora(string_: JString); cdecl;
    procedure setMarcaSat(string_: JString); cdecl;
    procedure setRazaoSocial(string_: JString); cdecl;
    procedure setTipoAmbiente(string_: JString); cdecl;
    procedure setTipoDocumento(string_: JString); cdecl;
    procedure setVersaoDriver(string_: JString); cdecl;
    function toJsonByteArray: TJavaArray<Byte>; cdecl;
  end;
  TJInfoEmissao = class(TJavaGenericImport<JInfoEmissaoClass, JInfoEmissao>) end;

  JIPrinterCallbackClass = interface(JIInterfaceClass)
    ['{A863D925-2260-4C1E-8689-7CD143D9402F}']
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterCallback')]
  JIPrinterCallback = interface(JIInterface)
    ['{F3DD2A4C-3503-4E2E-8267-4C13AD2B6E8B}']
    procedure onComplete; cdecl;
    procedure onException(i: Integer; string_: JString); cdecl;
    procedure onLength(l: Int64; l1: Int64); cdecl;
  end;
  TJIPrinterCallback = class(TJavaGenericImport<JIPrinterCallbackClass, JIPrinterCallback>) end;

  JIPrinterCallback_DefaultClass = interface(JIPrinterCallbackClass)
    ['{259042F2-12CA-413E-9973-40BD85B6A70B}']
    {class} function init: JIPrinterCallback_Default; cdecl;//Deprecated
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterCallback$Default')]
  JIPrinterCallback_Default = interface(JIPrinterCallback)
    ['{6F7E2754-0C86-4937-811F-058F336AAFA0}']
    function asBinder: JIBinder; cdecl;
    procedure onComplete; cdecl;
    procedure onException(i: Integer; string_: JString); cdecl;
    procedure onLength(l: Int64; l1: Int64); cdecl;
  end;
  TJIPrinterCallback_Default = class(TJavaGenericImport<JIPrinterCallback_DefaultClass, JIPrinterCallback_Default>) end;

  JIPrinterCallback_Stub_ProxyClass = interface(JIPrinterCallbackClass)
    ['{3B43A80C-FFAE-4BB4-97DE-38A37AE887FC}']
    {class} function _GetsDefaultImpl: JIPrinterCallback; cdecl;
    {class} procedure _SetsDefaultImpl(Value: JIPrinterCallback); cdecl;
    {class} property sDefaultImpl: JIPrinterCallback read _GetsDefaultImpl write _SetsDefaultImpl;
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterCallback$Stub$Proxy')]
  JIPrinterCallback_Stub_Proxy = interface(JIPrinterCallback)
    ['{23D05B04-F2EF-4102-A0C6-5CCF0305638A}']
    function asBinder: JIBinder; cdecl;
    function getInterfaceDescriptor: JString; cdecl;
    procedure onComplete; cdecl;
    procedure onException(i: Integer; string_: JString); cdecl;
    procedure onLength(l: Int64; l1: Int64); cdecl;
  end;
  TJIPrinterCallback_Stub_Proxy = class(TJavaGenericImport<JIPrinterCallback_Stub_ProxyClass, JIPrinterCallback_Stub_Proxy>) end;

  JIPrinterServiceClass = interface(JIInterfaceClass)
    ['{086C6F18-2444-40BD-9DC3-1DB83F4A3442}']
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterService')]
  JIPrinterService = interface(JIInterface)
    ['{92A0CEF3-F65D-42DF-9E61-4D23679E7B28}']
    function getBootloaderVersion: JString; cdecl;
    function getFirmwareVersion: JString; cdecl;
    procedure printBarCode(string_: JString; i: Integer; i1: Integer; i2: Integer; b: Boolean; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printBitmap(bitmap: JBitmap; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printBitmapWithAttributes(bitmap: JBitmap; map: JMap; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printColumnsTextWithAttributes(string_: TJavaObjectArray<JString>; list: JList; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printQRCode(string_: JString; i: Integer; i1: Integer; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printText(string_: JString; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printTextWithAttributes(string_: JString; map: JMap; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printWrapPaper(i: Integer; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printerInit(iPrinterCallback: JIPrinterCallback); cdecl;
    function printerPaper(iPrinterCallback: JIPrinterCallback): Boolean; cdecl;
    procedure printerReset(iPrinterCallback: JIPrinterCallback); cdecl;
    function printerTemperature(iPrinterCallback: JIPrinterCallback): Integer; cdecl;
    procedure sendRAWData(b: TJavaArray<Byte>; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure setPrinterSpeed(i: Integer; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure upgradePrinter; cdecl;
  end;
  TJIPrinterService = class(TJavaGenericImport<JIPrinterServiceClass, JIPrinterService>) end;

  JIPrinterService_DefaultClass = interface(JIPrinterServiceClass)
    ['{18885168-85DE-459A-A937-51AA081E147D}']
    {class} function init: JIPrinterService_Default; cdecl;//Deprecated
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterService$Default')]
  JIPrinterService_Default = interface(JIPrinterService)
    ['{7991669B-2582-4CAC-B047-BA4ABB1B7FB0}']
    function asBinder: JIBinder; cdecl;
    function getBootloaderVersion: JString; cdecl;
    function getFirmwareVersion: JString; cdecl;
    procedure printBarCode(string_: JString; i: Integer; i1: Integer; i2: Integer; b: Boolean; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printBitmap(bitmap: JBitmap; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printBitmapWithAttributes(bitmap: JBitmap; map: JMap; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printColumnsTextWithAttributes(string_: TJavaObjectArray<JString>; list: JList; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printQRCode(string_: JString; i: Integer; i1: Integer; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printText(string_: JString; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printTextWithAttributes(string_: JString; map: JMap; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printWrapPaper(i: Integer; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printerInit(iPrinterCallback: JIPrinterCallback); cdecl;
    function printerPaper(iPrinterCallback: JIPrinterCallback): Boolean; cdecl;
    procedure printerReset(iPrinterCallback: JIPrinterCallback); cdecl;
    function printerTemperature(iPrinterCallback: JIPrinterCallback): Integer; cdecl;
    procedure sendRAWData(b: TJavaArray<Byte>; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure setPrinterSpeed(i: Integer; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure upgradePrinter; cdecl;
  end;
  TJIPrinterService_Default = class(TJavaGenericImport<JIPrinterService_DefaultClass, JIPrinterService_Default>) end;

  JIPrinterService_StubClass = interface(JBinderClass)
    ['{BC6D6AD1-B829-4AED-B39D-62E865D7662B}']
    {class} function asInterface(iBinder: JIBinder): JIPrinterService; cdecl;
    {class} function getDefaultImpl: JIPrinterService; cdecl;
    {class} function init: JIPrinterService_Stub; cdecl;
    {class} function setDefaultImpl(iPrinterService: JIPrinterService): Boolean; cdecl;
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterService$Stub')]
  JIPrinterService_Stub = interface(JBinder)
    ['{901FF2AF-77BB-49AC-88B0-96743246AA68}']
    function asBinder: JIBinder; cdecl;
    function onTransact(i: Integer; parcel: JParcel; parcel1: JParcel; i1: Integer): Boolean; cdecl;
  end;
  TJIPrinterService_Stub = class(TJavaGenericImport<JIPrinterService_StubClass, JIPrinterService_Stub>) end;

  JIPrinterService_Stub_ProxyClass = interface(JIPrinterServiceClass)
    ['{3687C3C3-B56D-4D9E-A536-4AAFE84382D5}']
    {class} function _GetsDefaultImpl: JIPrinterService; cdecl;
    {class} procedure _SetsDefaultImpl(Value: JIPrinterService); cdecl;
    {class} property sDefaultImpl: JIPrinterService read _GetsDefaultImpl write _SetsDefaultImpl;
  end;

  [JavaSignature('com/xcheng/printerservice/IPrinterService$Stub$Proxy')]
  JIPrinterService_Stub_Proxy = interface(JIPrinterService)
    ['{415CE72A-D82B-41B8-A499-1FD6A1667F9F}']
    function asBinder: JIBinder; cdecl;
    function getBootloaderVersion: JString; cdecl;
    function getFirmwareVersion: JString; cdecl;
    function getInterfaceDescriptor: JString; cdecl;
    procedure printBarCode(string_: JString; i: Integer; i1: Integer; i2: Integer; b: Boolean; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printBitmap(bitmap: JBitmap; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printBitmapWithAttributes(bitmap: JBitmap; map: JMap; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printColumnsTextWithAttributes(string_: TJavaObjectArray<JString>; list: JList; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printQRCode(string_: JString; i: Integer; i1: Integer; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printText(string_: JString; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printTextWithAttributes(string_: JString; map: JMap; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printWrapPaper(i: Integer; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure printerInit(iPrinterCallback: JIPrinterCallback); cdecl;
    function printerPaper(iPrinterCallback: JIPrinterCallback): Boolean; cdecl;
    procedure printerReset(iPrinterCallback: JIPrinterCallback); cdecl;
    function printerTemperature(iPrinterCallback: JIPrinterCallback): Integer; cdecl;
    procedure sendRAWData(b: TJavaArray<Byte>; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure setPrinterSpeed(i: Integer; iPrinterCallback: JIPrinterCallback); cdecl;
    procedure upgradePrinter; cdecl;
  end;
  TJIPrinterService_Stub_Proxy = class(TJavaGenericImport<JIPrinterService_Stub_ProxyClass, JIPrinterService_Stub_Proxy>) end;

  Jdarumamobile_BuildConfigClass = interface(JObjectClass)
    ['{EFE3FC32-C06E-47DC-8304-F8A83C6BE4F5}']
    {class} function _GetBUILD_TYPE: JString; cdecl;
    {class} function _GetDEBUG: Boolean; cdecl;
    {class} function _GetLIBRARY_PACKAGE_NAME: JString; cdecl;
    {class} function init: Jdarumamobile_BuildConfig; cdecl;
    {class} property BUILD_TYPE: JString read _GetBUILD_TYPE;
    {class} property DEBUG: Boolean read _GetDEBUG;
    {class} property LIBRARY_PACKAGE_NAME: JString read _GetLIBRARY_PACKAGE_NAME;
  end;

  [JavaSignature('daruma/com/br/darumamobile/BuildConfig')]
  Jdarumamobile_BuildConfig = interface(JObject)
    ['{D89D230D-818B-426D-B0C2-BAF0CA6B1AE2}']
  end;
  TJdarumamobile_BuildConfig = class(TJavaGenericImport<Jdarumamobile_BuildConfigClass, Jdarumamobile_BuildConfig>) end;

  JDataInputClass = interface(IJavaClass)
    ['{DE6CE794-6EE2-4768-AA83-2B4831F9E318}']
    {class} function readDouble: Double; cdecl;//Deprecated
    {class} function readFloat: Single; cdecl;//Deprecated
    {class} procedure readFully(dst: TJavaArray<Byte>); cdecl; overload;//Deprecated
    {class} function readLong: Int64; cdecl;//Deprecated
    {class} function readShort: SmallInt; cdecl;//Deprecated
    {class} function readUTF: JString; cdecl;//Deprecated
    {class} function skipBytes(count: Integer): Integer; cdecl;//Deprecated
  end;

  [JavaSignature('java/io/DataInput')]
  JDataInput = interface(IJavaInstance)
    ['{531D4DB8-9C0C-435C-938F-91007288CE8D}']
    function readBoolean: Boolean; cdecl;//Deprecated
    function readByte: Byte; cdecl;//Deprecated
    function readChar: Char; cdecl;//Deprecated
    procedure readFully(dst: TJavaArray<Byte>; offset: Integer; byteCount: Integer); cdecl; overload;//Deprecated
    function readInt: Integer; cdecl;//Deprecated
    function readLine: JString; cdecl;//Deprecated
    function readUnsignedByte: Integer; cdecl;//Deprecated
    function readUnsignedShort: Integer; cdecl;//Deprecated
  end;
  TJDataInput = class(TJavaGenericImport<JDataInputClass, JDataInput>) end;

  JFilterInputStreamClass = interface(JInputStreamClass)
    ['{F86EBD21-681A-43DA-BDF9-A28ACD4A7EE5}']
    {class} procedure close; cdecl;//Deprecated
    {class} procedure mark(readlimit: Integer); cdecl;//Deprecated
    {class} function markSupported: Boolean; cdecl;//Deprecated
    {class} function skip(byteCount: Int64): Int64; cdecl;//Deprecated
  end;

  [JavaSignature('java/io/FilterInputStream')]
  JFilterInputStream = interface(JInputStream)
    ['{9F9FA98A-C38C-4DDE-9600-073E9DA3BA85}']
    function available: Integer; cdecl;//Deprecated
    function read: Integer; cdecl; overload;//Deprecated
    function read(buffer: TJavaArray<Byte>; byteOffset: Integer; byteCount: Integer): Integer; cdecl; overload;//Deprecated
    procedure reset; cdecl;//Deprecated
  end;
  TJFilterInputStream = class(TJavaGenericImport<JFilterInputStreamClass, JFilterInputStream>) end;

  JDataInputStreamClass = interface(JFilterInputStreamClass)
    ['{63A3E0C6-D830-4711-8A5B-563F95DEDBD5}']
    {class} function init(in_: JInputStream): JDataInputStream; cdecl;
    {class} function read(buffer: TJavaArray<Byte>; byteOffset: Integer; byteCount: Integer): Integer; cdecl; overload;
    {class} function readBoolean: Boolean; cdecl;
    {class} function readByte: Byte; cdecl;
    {class} procedure readFully(dst: TJavaArray<Byte>); cdecl; overload;//Deprecated
    {class} procedure readFully(dst: TJavaArray<Byte>; offset: Integer; byteCount: Integer); cdecl; overload;//Deprecated
    {class} function readShort: SmallInt; cdecl;//Deprecated
    {class} function readUTF: JString; cdecl; overload;//Deprecated
    {class} function readUTF(in_: JDataInput): JString; cdecl; overload;//Deprecated
  end;

  [JavaSignature('java/io/DataInputStream')]
  JDataInputStream = interface(JFilterInputStream)
    ['{76AFD071-40B2-49D6-9C88-FBDE64374D14}']
    function read(buffer: TJavaArray<Byte>): Integer; cdecl; overload;
    function readChar: Char; cdecl;//Deprecated
    function readDouble: Double; cdecl;//Deprecated
    function readFloat: Single; cdecl;//Deprecated
    function readInt: Integer; cdecl;//Deprecated
    function readLine: JString; cdecl;//Deprecated
    function readLong: Int64; cdecl;//Deprecated
    function readUnsignedByte: Integer; cdecl;//Deprecated
    function readUnsignedShort: Integer; cdecl;//Deprecated
    function skipBytes(count: Integer): Integer; cdecl;//Deprecated
  end;
  TJDataInputStream = class(TJavaGenericImport<JDataInputStreamClass, JDataInputStream>) end;

  JIllegalArgumentExceptionClass = interface(JRuntimeExceptionClass)
    ['{8C41615A-9F8E-4E2E-A50E-72A0C37D97CD}']
    {class} function init: JIllegalArgumentException; cdecl; overload;
    {class} function init(detailMessage: JString): JIllegalArgumentException; cdecl; overload;
    {class} function init(message: JString; cause: JThrowable): JIllegalArgumentException; cdecl; overload;
    {class} function init(cause: JThrowable): JIllegalArgumentException; cdecl; overload;
  end;

  [JavaSignature('java/lang/IllegalArgumentException')]
  JIllegalArgumentException = interface(JRuntimeException)
    ['{C36869F7-1905-46E5-AF8F-F6054D5A3AE2}']
  end;
  TJIllegalArgumentException = class(TJavaGenericImport<JIllegalArgumentExceptionClass, JIllegalArgumentException>) end;

  JVoidClass = interface(JObjectClass)
    ['{E5AB6B2B-2580-469B-BBF6-C226984DFEBE}']
    {class} function _GetTYPE: Jlang_Class; cdecl;
    {class} property &TYPE: Jlang_Class read _GetTYPE;
  end;

  [JavaSignature('java/lang/Void')]
  JVoid = interface(JObject)
    ['{013CC63A-938C-46BE-ACAC-BA854F2F6AC8}']
  end;
  TJVoid = class(TJavaGenericImport<JVoidClass, JVoid>) end;

  JVectorClass = interface(JAbstractListClass)
    ['{AF3067AC-4EA6-496A-9A93-E5D96BDDDECD}']
    {class} function init: JVector; cdecl; overload;
    {class} function init(capacity: Integer): JVector; cdecl; overload;
    {class} function init(capacity: Integer; capacityIncrement: Integer): JVector; cdecl; overload;
    {class} function init(collection: JCollection): JVector; cdecl; overload;
    {class} procedure add(location: Integer; object_: JObject); cdecl; overload;
    {class} procedure addElement(object_: JObject); cdecl;
    {class} function capacity: Integer; cdecl;
    {class} procedure clear; cdecl;
    {class} procedure copyInto(elements: TJavaObjectArray<JObject>); cdecl;
    {class} function elementAt(location: Integer): JObject; cdecl;
    {class} function elements: JEnumeration; cdecl;
    {class} function &get(location: Integer): JObject; cdecl;//Deprecated
    {class} function hashCode: Integer; cdecl;//Deprecated
    {class} function indexOf(object_: JObject): Integer; cdecl; overload;//Deprecated
    {class} function lastElement: JObject; cdecl;//Deprecated
    {class} function lastIndexOf(object_: JObject): Integer; cdecl; overload;//Deprecated
    {class} function lastIndexOf(object_: JObject; location: Integer): Integer; cdecl; overload;//Deprecated
    {class} procedure removeAllElements; cdecl;//Deprecated
    {class} function removeElement(object_: JObject): Boolean; cdecl;//Deprecated
    {class} procedure setElementAt(object_: JObject; location: Integer); cdecl;//Deprecated
    {class} procedure setSize(length: Integer); cdecl;//Deprecated
    {class} function size: Integer; cdecl;//Deprecated
    {class} function toString: JString; cdecl;
    {class} procedure trimToSize; cdecl;
  end;

  [JavaSignature('java/util/Vector')]
  JVector = interface(JAbstractList)
    ['{CC07A8CD-E311-453A-B3D5-2786E688CEFD}']
    function add(object_: JObject): Boolean; cdecl; overload;
    function addAll(location: Integer; collection: JCollection): Boolean; cdecl; overload;
    function addAll(collection: JCollection): Boolean; cdecl; overload;
    function clone: JObject; cdecl;
    function &contains(object_: JObject): Boolean; cdecl;
    function containsAll(collection: JCollection): Boolean; cdecl;
    procedure ensureCapacity(minimumCapacity: Integer); cdecl;//Deprecated
    function equals(object_: JObject): Boolean; cdecl;//Deprecated
    function firstElement: JObject; cdecl;//Deprecated
    function indexOf(object_: JObject; location: Integer): Integer; cdecl; overload;//Deprecated
    procedure insertElementAt(object_: JObject; location: Integer); cdecl;//Deprecated
    function isEmpty: Boolean; cdecl;//Deprecated
    function remove(location: Integer): JObject; cdecl; overload;//Deprecated
    function remove(object_: JObject): Boolean; cdecl; overload;//Deprecated
    function removeAll(collection: JCollection): Boolean; cdecl;//Deprecated
    procedure removeElementAt(location: Integer); cdecl;//Deprecated
    function retainAll(collection: JCollection): Boolean; cdecl;//Deprecated
    function &set(location: Integer; object_: JObject): JObject; cdecl;//Deprecated
    function subList(start: Integer; end_: Integer): JList; cdecl;
    function toArray: TJavaObjectArray<JObject>; cdecl; overload;
    function toArray(contents: TJavaObjectArray<JObject>): TJavaObjectArray<JObject>; cdecl; overload;
  end;
  TJVector = class(TJavaGenericImport<JVectorClass, JVector>) end;

  JSAXParserClass = interface(JObjectClass)
    ['{E1DD0AEC-FD03-48D4-8D47-D349213BF1CA}']
    {class} function getXMLReader: JXMLReader; cdecl;
    {class} function isNamespaceAware: Boolean; cdecl;
    {class} procedure parse(is_: JInputStream; hb: JHandlerBase; systemId: JString); cdecl; overload;
    {class} procedure parse(is_: JInputStream; dh: JDefaultHandler); cdecl; overload;
    {class} procedure parse(is_: JInputStream; dh: JDefaultHandler; systemId: JString); cdecl; overload;
    {class} procedure parse(f: JFile; dh: JDefaultHandler); cdecl; overload;
    {class} procedure parse(is_: JInputSource; hb: JHandlerBase); cdecl; overload;
    {class} procedure parse(is_: JInputSource; dh: JDefaultHandler); cdecl; overload;
  end;

  [JavaSignature('javax/xml/parsers/SAXParser')]
  JSAXParser = interface(JObject)
    ['{73E1F455-92C2-4F5C-A9E0-89C80F54EFFF}']
    function getParser: JParser; cdecl;
    function getProperty(name: JString): JObject; cdecl;
    function getSchema: JSchema; cdecl;
    function isValidating: Boolean; cdecl;
    function isXIncludeAware: Boolean; cdecl;
    procedure parse(is_: JInputStream; hb: JHandlerBase); cdecl; overload;
    procedure parse(uri: JString; hb: JHandlerBase); cdecl; overload;
    procedure parse(uri: JString; dh: JDefaultHandler); cdecl; overload;
    procedure parse(f: JFile; hb: JHandlerBase); cdecl; overload;
    procedure reset; cdecl;//Deprecated
    procedure setProperty(name: JString; value: JObject); cdecl;//Deprecated
  end;
  TJSAXParser = class(TJavaGenericImport<JSAXParserClass, JSAXParser>) end;

  JSAXParserFactoryClass = interface(JObjectClass)
    ['{338BC811-5BCE-4899-9D1D-DA0FEF7E741F}']
    {class} function isValidating: Boolean; cdecl;
    {class} function isXIncludeAware: Boolean; cdecl;
    {class} function newInstance: JSAXParserFactory; cdecl; overload;
    {class} function newInstance(factoryClassName: JString; classLoader: JClassLoader): JSAXParserFactory; cdecl; overload;//Deprecated
    {class} procedure setNamespaceAware(awareness: Boolean); cdecl;//Deprecated
    {class} procedure setSchema(schema: JSchema); cdecl;//Deprecated
    {class} procedure setValidating(validating: Boolean); cdecl;//Deprecated
  end;

  [JavaSignature('javax/xml/parsers/SAXParserFactory')]
  JSAXParserFactory = interface(JObject)
    ['{BA46CA0C-7A3E-4347-ADB9-D5ADD12FC707}']
    function getFeature(name: JString): Boolean; cdecl;
    function getSchema: JSchema; cdecl;
    function isNamespaceAware: Boolean; cdecl;
    function newSAXParser: JSAXParser; cdecl;//Deprecated
    procedure setFeature(name: JString; value: Boolean); cdecl;//Deprecated
    procedure setXIncludeAware(state: Boolean); cdecl;//Deprecated
  end;
  TJSAXParserFactory = class(TJavaGenericImport<JSAXParserFactoryClass, JSAXParserFactory>) end;

  JResultClass = interface(IJavaClass)
    ['{BC744147-60B7-4609-93E3-CCFA1EB19EDF}']
    {class} function _GetPI_DISABLE_OUTPUT_ESCAPING: JString; cdecl;
    {class} function _GetPI_ENABLE_OUTPUT_ESCAPING: JString; cdecl;
    {class} function getSystemId: JString; cdecl;//Deprecated
    {class} property PI_DISABLE_OUTPUT_ESCAPING: JString read _GetPI_DISABLE_OUTPUT_ESCAPING;
    {class} property PI_ENABLE_OUTPUT_ESCAPING: JString read _GetPI_ENABLE_OUTPUT_ESCAPING;
  end;

  [JavaSignature('javax/xml/transform/Result')]
  JResult = interface(IJavaInstance)
    ['{A9093B94-2C87-4EC8-9608-9242340A02BC}']
    procedure setSystemId(systemId: JString); cdecl;//Deprecated
  end;
  TJResult = class(TJavaGenericImport<JResultClass, JResult>) end;

  JSourceClass = interface(IJavaClass)
    ['{118C29F1-5718-4BFF-A954-5BF50E5DE38F}']
    {class} function getSystemId: JString; cdecl;//Deprecated
    {class} procedure setSystemId(systemId: JString); cdecl;//Deprecated
  end;

  [JavaSignature('javax/xml/transform/Source')]
  JSource = interface(IJavaInstance)
    ['{28B64456-97BD-4DEE-8B93-99BC68C95D72}']
  end;
  TJSource = class(TJavaGenericImport<JSourceClass, JSource>) end;

  JSAXResultClass = interface(JObjectClass)
    ['{368CAB21-A5ED-4525-9AC4-4AB2BA7FA907}']
    {class} function _GetFEATURE: JString; cdecl;
    {class} function init: JSAXResult; cdecl; overload;
    {class} function init(handler: JContentHandler): JSAXResult; cdecl; overload;
    {class} procedure setHandler(handler: JContentHandler); cdecl;
    {class} procedure setLexicalHandler(handler: JLexicalHandler); cdecl;
    {class} procedure setSystemId(systemId: JString); cdecl;
    {class} property FEATURE: JString read _GetFEATURE;
  end;

  [JavaSignature('javax/xml/transform/sax/SAXResult')]
  JSAXResult = interface(JObject)
    ['{6A9EF2C6-9AFE-4C4C-9B77-34FB44A1CD30}']
    function getHandler: JContentHandler; cdecl;
    function getLexicalHandler: JLexicalHandler; cdecl;
    function getSystemId: JString; cdecl;
  end;
  TJSAXResult = class(TJavaGenericImport<JSAXResultClass, JSAXResult>) end;

  JSAXSourceClass = interface(JObjectClass)
    ['{C0FFB4F2-B6A7-46BE-BE8E-B1B021F2680C}']
    {class} function _GetFEATURE: JString; cdecl;
    {class} function init: JSAXSource; cdecl; overload;
    {class} function init(reader: JXMLReader; inputSource: JInputSource): JSAXSource; cdecl; overload;
    {class} function init(inputSource: JInputSource): JSAXSource; cdecl; overload;
    {class} function getInputSource: JInputSource; cdecl;
    {class} function getSystemId: JString; cdecl;
    {class} procedure setXMLReader(reader: JXMLReader); cdecl;
    {class} function sourceToInputSource(source: JSource): JInputSource; cdecl;
    {class} property FEATURE: JString read _GetFEATURE;
  end;

  [JavaSignature('javax/xml/transform/sax/SAXSource')]
  JSAXSource = interface(JObject)
    ['{2F71D679-BC64-48ED-8EE1-54D2353F615C}']
    function getXMLReader: JXMLReader; cdecl;
    procedure setInputSource(inputSource: JInputSource); cdecl;
    procedure setSystemId(systemId: JString); cdecl;
  end;
  TJSAXSource = class(TJavaGenericImport<JSAXSourceClass, JSAXSource>) end;

  JSchemaClass = interface(JObjectClass)
    ['{E805A80F-0442-4CFB-A2EA-676D67D87A82}']
    {class} function newValidatorHandler: JValidatorHandler; cdecl;
  end;

  [JavaSignature('javax/xml/validation/Schema')]
  JSchema = interface(JObject)
    ['{524289E1-01B1-45DD-8000-8B7210315238}']
    function newValidator: JValidator; cdecl;
  end;
  TJSchema = class(TJavaGenericImport<JSchemaClass, JSchema>) end;

  JSchemaFactoryClass = interface(JObjectClass)
    ['{F7846245-D4EC-452E-9E93-6FF0318F38B8}']
    {class} function getErrorHandler: JErrorHandler; cdecl;
    {class} function getFeature(name: JString): Boolean; cdecl;
    {class} function newInstance(schemaLanguage: JString): JSchemaFactory; cdecl; overload;
    {class} function newInstance(schemaLanguage: JString; factoryClassName: JString; classLoader: JClassLoader): JSchemaFactory; cdecl; overload;
    {class} function newSchema(schema: JSource): JSchema; cdecl; overload;
    {class} function newSchema(schemas: TJavaObjectArray<JSource>): JSchema; cdecl; overload;//Deprecated
    {class} function newSchema: JSchema; cdecl; overload;//Deprecated
    {class} procedure setErrorHandler(errorHandler: JErrorHandler); cdecl;//Deprecated
  end;

  [JavaSignature('javax/xml/validation/SchemaFactory')]
  JSchemaFactory = interface(JObject)
    ['{FD991CF5-C62A-4FFC-84B8-4A0EF2980E8F}']
    function getProperty(name: JString): JObject; cdecl;
    function getResourceResolver: JLSResourceResolver; cdecl;
    function isSchemaLanguageSupported(schemaLanguage: JString): Boolean; cdecl;
    function newSchema(schema: JFile): JSchema; cdecl; overload;//Deprecated
    function newSchema(schema: JURL): JSchema; cdecl; overload;//Deprecated
    procedure setFeature(name: JString; value: Boolean); cdecl;//Deprecated
    procedure setProperty(name: JString; object_: JObject); cdecl;//Deprecated
    procedure setResourceResolver(resourceResolver: JLSResourceResolver); cdecl;//Deprecated
  end;
  TJSchemaFactory = class(TJavaGenericImport<JSchemaFactoryClass, JSchemaFactory>) end;

  JTypeInfoProviderClass = interface(JObjectClass)
    ['{3B767BF3-B4E6-4FDB-B631-66A0CC5A1394}']
    {class} function getAttributeTypeInfo(index: Integer): JTypeInfo; cdecl;
  end;

  [JavaSignature('javax/xml/validation/TypeInfoProvider')]
  JTypeInfoProvider = interface(JObject)
    ['{A1852E2F-820A-4849-B6DF-5EF0EB01C74D}']
    function getElementTypeInfo: JTypeInfo; cdecl;//Deprecated
    function isIdAttribute(index: Integer): Boolean; cdecl;//Deprecated
    function isSpecified(index: Integer): Boolean; cdecl;//Deprecated
  end;
  TJTypeInfoProvider = class(TJavaGenericImport<JTypeInfoProviderClass, JTypeInfoProvider>) end;

  JValidatorClass = interface(JObjectClass)
    ['{11B82091-0974-4751-862A-FB51CAC932DB}']
    {class} function getResourceResolver: JLSResourceResolver; cdecl;//Deprecated
    {class} procedure reset; cdecl;//Deprecated
    {class} procedure setErrorHandler(errorHandler: JErrorHandler); cdecl;//Deprecated
    {class} procedure validate(source: JSource); cdecl; overload;//Deprecated
    {class} procedure validate(source: JSource; result: JResult); cdecl; overload;//Deprecated
  end;

  [JavaSignature('javax/xml/validation/Validator')]
  JValidator = interface(JObject)
    ['{920F6E5A-7E6D-44B6-8295-964D52F1CB3A}']
    function getErrorHandler: JErrorHandler; cdecl;//Deprecated
    function getFeature(name: JString): Boolean; cdecl;//Deprecated
    function getProperty(name: JString): JObject; cdecl;//Deprecated
    procedure setFeature(name: JString; value: Boolean); cdecl;//Deprecated
    procedure setProperty(name: JString; object_: JObject); cdecl;//Deprecated
    procedure setResourceResolver(resourceResolver: JLSResourceResolver); cdecl;//Deprecated
  end;
  TJValidator = class(TJavaGenericImport<JValidatorClass, JValidator>) end;

  JValidatorHandlerClass = interface(JObjectClass)
    ['{39BBA2FA-DA9C-455F-96D9-34B469811ABA}']
    {class} function getErrorHandler: JErrorHandler; cdecl;
    {class} function getFeature(name: JString): Boolean; cdecl;
    {class} function getProperty(name: JString): JObject; cdecl;
    {class} procedure setErrorHandler(errorHandler: JErrorHandler); cdecl;//Deprecated
    {class} procedure setFeature(name: JString; value: Boolean); cdecl;//Deprecated
  end;

  [JavaSignature('javax/xml/validation/ValidatorHandler')]
  JValidatorHandler = interface(JObject)
    ['{76B74903-8C5A-4B1B-B953-BCE7D14CFDA3}']
    function getContentHandler: JContentHandler; cdecl;
    function getResourceResolver: JLSResourceResolver; cdecl;//Deprecated
    function getTypeInfoProvider: JTypeInfoProvider; cdecl;//Deprecated
    procedure setContentHandler(receiver: JContentHandler); cdecl;//Deprecated
    procedure setProperty(name: JString; object_: JObject); cdecl;//Deprecated
    procedure setResourceResolver(resourceResolver: JLSResourceResolver); cdecl;//Deprecated
  end;
  TJValidatorHandler = class(TJavaGenericImport<JValidatorHandlerClass, JValidatorHandler>) end;

  JCloneBaseClass = interface(JCloneableClass)
    ['{D235161E-E8BC-44DE-9A3E-D6B071FBFD91}']
    {class} function init: JCloneBase; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/CloneBase')]
  JCloneBase = interface(JCloneable)
    ['{ED650065-99E0-4829-BED3-E284B8BD306D}']
  end;
  TJCloneBase = class(TJavaGenericImport<JCloneBaseClass, JCloneBase>) end;

  JAttributeClass = interface(JCloneBaseClass)
    ['{A6FCEAA3-6078-4A40-B33C-50EDFAAC8A54}']
    {class} function _GetCDATA_TYPE: JAttributeType; cdecl;
    {class} function _GetENTITIES_TYPE: JAttributeType; cdecl;
    {class} function _GetENTITY_TYPE: JAttributeType; cdecl;
    {class} function _GetENUMERATED_TYPE: JAttributeType; cdecl;
    {class} function _GetIDREFS_TYPE: JAttributeType; cdecl;
    {class} function _GetIDREF_TYPE: JAttributeType; cdecl;
    {class} function _GetID_TYPE: JAttributeType; cdecl;
    {class} function _GetNMTOKENS_TYPE: JAttributeType; cdecl;
    {class} function _GetNMTOKEN_TYPE: JAttributeType; cdecl;
    {class} function _GetNOTATION_TYPE: JAttributeType; cdecl;
    {class} function _GetUNDECLARED_TYPE: JAttributeType; cdecl;
    {class} function init(string_: JString; string_1: JString): JAttribute; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; i: Integer): JAttribute; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; attributeType: JAttributeType): JAttribute; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; namespace: JNamespace): JAttribute; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; attributeType: JAttributeType; namespace: JNamespace): JAttribute; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; i: Integer; namespace: JNamespace): JAttribute; cdecl; overload;
    {class} property CDATA_TYPE: JAttributeType read _GetCDATA_TYPE;
    {class} property ENTITIES_TYPE: JAttributeType read _GetENTITIES_TYPE;
    {class} property ENTITY_TYPE: JAttributeType read _GetENTITY_TYPE;
    {class} property ENUMERATED_TYPE: JAttributeType read _GetENUMERATED_TYPE;
    {class} property IDREFS_TYPE: JAttributeType read _GetIDREFS_TYPE;
    {class} property IDREF_TYPE: JAttributeType read _GetIDREF_TYPE;
    {class} property ID_TYPE: JAttributeType read _GetID_TYPE;
    {class} property NMTOKENS_TYPE: JAttributeType read _GetNMTOKENS_TYPE;
    {class} property NMTOKEN_TYPE: JAttributeType read _GetNMTOKEN_TYPE;
    {class} property NOTATION_TYPE: JAttributeType read _GetNOTATION_TYPE;
    {class} property UNDECLARED_TYPE: JAttributeType read _GetUNDECLARED_TYPE;
  end;

  [JavaSignature('org/jdom2/Attribute')]
  JAttribute = interface(JCloneBase)
    ['{CAC71FB0-4B18-4E6E-8714-1CEA5C674E61}']
    function clone: JAttribute; cdecl;
    function detach: JAttribute; cdecl;
    function getAttributeType: JAttributeType; cdecl;
    function getBooleanValue: Boolean; cdecl;
    function getDocument: Jjdom2_Document; cdecl;
    function getDoubleValue: Double; cdecl;
    function getFloatValue: Single; cdecl;
    function getIntValue: Integer; cdecl;
    function getLongValue: Int64; cdecl;
    function getName: JString; cdecl;
    function getNamespace: JNamespace; cdecl;
    function getNamespacePrefix: JString; cdecl;
    function getNamespaceURI: JString; cdecl;
    function getNamespacesInScope: JList; cdecl;
    function getNamespacesInherited: JList; cdecl;
    function getNamespacesIntroduced: JList; cdecl;
    function getParent: Jjdom2_Element; cdecl;
    function getQualifiedName: JString; cdecl;
    function getValue: JString; cdecl;
    function isSpecified: Boolean; cdecl;
    function setAttributeType(i: Integer): JAttribute; cdecl; overload;
    function setAttributeType(attributeType: JAttributeType): JAttribute; cdecl; overload;
    function setName(string_: JString): JAttribute; cdecl;
    function setNamespace(namespace: JNamespace): JAttribute; cdecl;
    procedure setSpecified(b: Boolean); cdecl;
    function setValue(string_: JString): JAttribute; cdecl;
    function toString: JString; cdecl;
  end;
  TJAttribute = class(TJavaGenericImport<JAttributeClass, JAttribute>) end;

  Jjdom2_AttributeListClass = interface(JAbstractListClass)
    ['{599BA8A7-92DF-4653-807A-1C890ED3F635}']
    {class} function init(element: Jjdom2_Element): Jjdom2_AttributeList; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/AttributeList')]
  Jjdom2_AttributeList = interface(JAbstractList)
    ['{FAD9F86D-A9E8-4866-A143-DAA2A2839DB8}']
    function add(object_: JObject): Boolean; cdecl; overload;
    function add(attribute: JAttribute): Boolean; cdecl; overload;
    procedure add(i: Integer; attribute: JAttribute); cdecl; overload;
    procedure add(i: Integer; object_: JObject); cdecl; overload;
    function addAll(collection: JCollection): Boolean; cdecl; overload;
    function addAll(i: Integer; collection: JCollection): Boolean; cdecl; overload;
    procedure clear; cdecl;
    function &get(i: Integer): JAttribute; cdecl; overload;
    function isEmpty: Boolean; cdecl;
    function iterator: JIterator; cdecl;
    function remove(i: Integer): JAttribute; cdecl; overload;
    function &set(i: Integer; object_: JObject): JObject; cdecl; overload;
    function &set(i: Integer; attribute: JAttribute): JAttribute; cdecl; overload;
    function size: Integer; cdecl;
    procedure sort(comparator: JComparator); cdecl;
    function toString: JString; cdecl;
  end;
  TJjdom2_AttributeList = class(TJavaGenericImport<Jjdom2_AttributeListClass, Jjdom2_AttributeList>) end;

  JAttributeList_1Class = interface(JComparatorClass)
    ['{D22E38A2-D59A-470F-B9F1-076084C3437E}']
    {class} function init: JAttributeList_1; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/AttributeList$1')]
  JAttributeList_1 = interface(JComparator)
    ['{4A421985-ED66-464C-99C5-A99CA320972D}']
    function compare(object_: JObject; object_1: JObject): Integer; cdecl; overload;
    function compare(attribute: JAttribute; attribute1: JAttribute): Integer; cdecl; overload;
  end;
  TJAttributeList_1 = class(TJavaGenericImport<JAttributeList_1Class, JAttributeList_1>) end;

  JAttributeList_ALIteratorClass = interface(JIteratorClass)
    ['{61A22A43-45D1-4529-AA31-43D98E6F9F49}']
    {class} function _Getthis: Jjdom2_AttributeList; cdecl;
    {class} property this: Jjdom2_AttributeList read _Getthis;
  end;

  [JavaSignature('org/jdom2/AttributeList$ALIterator')]
  JAttributeList_ALIterator = interface(JIterator)
    ['{E113368D-FE9D-4F8D-B3AD-F7B9179CBC65}']
    function hasNext: Boolean; cdecl;
    function next: JAttribute; cdecl;
    procedure remove; cdecl;
  end;
  TJAttributeList_ALIterator = class(TJavaGenericImport<JAttributeList_ALIteratorClass, JAttributeList_ALIterator>) end;

  JAttributeTypeClass = interface(JEnumClass)
    ['{C9947E82-0931-4BA7-80ED-6446A271850E}']
    {class} function _GetCDATA: JAttributeType; cdecl;
    {class} function _GetENTITIES: JAttributeType; cdecl;
    {class} function _GetENTITY: JAttributeType; cdecl;
    {class} function _GetENUMERATION: JAttributeType; cdecl;
    {class} function _GetID: JAttributeType; cdecl;
    {class} function _GetIDREF: JAttributeType; cdecl;
    {class} function _GetIDREFS: JAttributeType; cdecl;
    {class} function _GetNMTOKEN: JAttributeType; cdecl;
    {class} function _GetNMTOKENS: JAttributeType; cdecl;
    {class} function _GetNOTATION: JAttributeType; cdecl;
    {class} function _GetUNDECLARED: JAttributeType; cdecl;
    {class} function byIndex(i: Integer): JAttributeType; cdecl;
    {class} function getAttributeType(string_: JString): JAttributeType; cdecl;
    {class} function valueOf(string_: JString): JAttributeType; cdecl;
    {class} function values: TJavaObjectArray<JAttributeType>; cdecl;//Deprecated
    {class} property CDATA: JAttributeType read _GetCDATA;
    {class} property ENTITIES: JAttributeType read _GetENTITIES;
    {class} property ENTITY: JAttributeType read _GetENTITY;
    {class} property ENUMERATION: JAttributeType read _GetENUMERATION;
    {class} property ID: JAttributeType read _GetID;
    {class} property IDREF: JAttributeType read _GetIDREF;
    {class} property IDREFS: JAttributeType read _GetIDREFS;
    {class} property NMTOKEN: JAttributeType read _GetNMTOKEN;
    {class} property NMTOKENS: JAttributeType read _GetNMTOKENS;
    {class} property NOTATION: JAttributeType read _GetNOTATION;
    {class} property UNDECLARED: JAttributeType read _GetUNDECLARED;
  end;

  [JavaSignature('org/jdom2/AttributeType')]
  JAttributeType = interface(JEnum)
    ['{222CB385-DB13-4AA8-B6E0-F77E50B975BC}']
  end;
  TJAttributeType = class(TJavaGenericImport<JAttributeTypeClass, JAttributeType>) end;

  JContentClass = interface(JCloneBaseClass)
    ['{B4503A21-869B-48FD-89B1-8E3E6A82EC55}']
  end;

  [JavaSignature('org/jdom2/Content')]
  JContent = interface(JCloneBase)
    ['{0CC80B79-B7C5-487C-A5B8-4A1B91BA1643}']
    function clone: JContent; cdecl;
    function detach: JContent; cdecl;
    function equals(object_: JObject): Boolean; cdecl;
    function getCType: JContent_CType; cdecl;
    function getDocument: Jjdom2_Document; cdecl;
    function getNamespacesInScope: JList; cdecl;
    function getNamespacesInherited: JList; cdecl;
    function getNamespacesIntroduced: JList; cdecl;
    function getParent: JParent; cdecl;
    function getParentElement: Jjdom2_Element; cdecl;
    function getValue: JString; cdecl;
    function hashCode: Integer; cdecl;
  end;
  TJContent = class(TJavaGenericImport<JContentClass, JContent>) end;

  Jjdom2_TextClass = interface(JContentClass)
    ['{6422EF3F-4EA9-4B28-8BF9-ABD2CB35E519}']
    {class} function init(string_: JString): Jjdom2_Text; cdecl; overload;
    {class} function normalizeString(string_: JString): JString; cdecl;
  end;

  [JavaSignature('org/jdom2/Text')]
  Jjdom2_Text = interface(JContent)
    ['{CCD3F177-7DB5-4F9E-8389-77756F0765C0}']
    procedure append(string_: JString); cdecl; overload;
    procedure append(text: Jjdom2_Text); cdecl; overload;
    function clone: Jjdom2_Text; cdecl;
    function detach: Jjdom2_Text; cdecl;
    function getParent: Jjdom2_Element; cdecl;
    function getText: JString; cdecl;
    function getTextNormalize: JString; cdecl;
    function getTextTrim: JString; cdecl;
    function getValue: JString; cdecl;
    function setText(string_: JString): Jjdom2_Text; cdecl;
    function toString: JString; cdecl;
  end;
  TJjdom2_Text = class(TJavaGenericImport<Jjdom2_TextClass, Jjdom2_Text>) end;

  JCDATAClass = interface(Jjdom2_TextClass)
    ['{3CFCCDDA-2051-4CDD-8D6B-F49CF75AACF6}']
    {class} function init(string_: JString): JCDATA; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/CDATA')]
  JCDATA = interface(Jjdom2_Text)
    ['{B2F35B64-B444-49FB-B82C-430E45B44800}']
    procedure append(text: Jjdom2_Text); cdecl; overload;
    procedure append(string_: JString); cdecl; overload;
    function clone: JCDATA; cdecl;
    function detach: JCDATA; cdecl;
    function setText(string_: JString): JCDATA; cdecl;
    function toString: JString; cdecl;
  end;
  TJCDATA = class(TJavaGenericImport<JCDATAClass, JCDATA>) end;

  Jjdom2_CommentClass = interface(JContentClass)
    ['{615DA826-42E5-444A-92EF-5364FC907B3A}']
    {class} function init(string_: JString): Jjdom2_Comment; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/Comment')]
  Jjdom2_Comment = interface(JContent)
    ['{66DF537C-D7E4-4EBB-8FEE-0F8C71D7F520}']
    function clone: Jjdom2_Comment; cdecl;
    function detach: Jjdom2_Comment; cdecl;
    function getText: JString; cdecl;
    function getValue: JString; cdecl;
    function setText(string_: JString): Jjdom2_Comment; cdecl;
    function toString: JString; cdecl;
  end;
  TJjdom2_Comment = class(TJavaGenericImport<Jjdom2_CommentClass, Jjdom2_Comment>) end;

  JContent_CTypeClass = interface(JEnumClass)
    ['{A0B02882-C06E-48D5-B9FD-A76BF3A53A93}']
    {class} function _GetCDATA: JContent_CType; cdecl;
    {class} function _GetComment: JContent_CType; cdecl;
    {class} function _GetDocType: JContent_CType; cdecl;
    {class} function _GetElement: JContent_CType; cdecl;
    {class} function _GetEntityRef: JContent_CType; cdecl;
    {class} function _GetProcessingInstruction: JContent_CType; cdecl;
    {class} function _GetText: JContent_CType; cdecl;
    {class} function valueOf(string_: JString): JContent_CType; cdecl;
    {class} function values: TJavaObjectArray<JContent_CType>; cdecl;//Deprecated
    {class} property CDATA: JContent_CType read _GetCDATA;
    {class} property Comment: JContent_CType read _GetComment;
    {class} property DocType: JContent_CType read _GetDocType;
    {class} property Element: JContent_CType read _GetElement;
    {class} property EntityRef: JContent_CType read _GetEntityRef;
    {class} property ProcessingInstruction: JContent_CType read _GetProcessingInstruction;
    {class} property Text: JContent_CType read _GetText;
  end;

  [JavaSignature('org/jdom2/Content$CType')]
  JContent_CType = interface(JEnum)
    ['{598F69F1-BBA9-44AE-8C16-59FBB53F1EF9}']
  end;
  TJContent_CType = class(TJavaGenericImport<JContent_CTypeClass, JContent_CType>) end;

  JContentListClass = interface(JAbstractListClass)
    ['{D3980CCD-AEB6-47F0-8611-0E556F1F091D}']
    {class} function init(parent: JParent): JContentList; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/ContentList')]
  JContentList = interface(JAbstractList)
    ['{E0444370-B290-4235-AB18-8EB756359ED3}']
    procedure add(i: Integer; object_: JObject); cdecl; overload;
    procedure add(i: Integer; content: JContent); cdecl; overload;
    function addAll(collection: JCollection): Boolean; cdecl; overload;
    function addAll(i: Integer; collection: JCollection): Boolean; cdecl; overload;
    procedure clear; cdecl;
    function &get(i: Integer): JContent; cdecl;
    function iterator: JIterator; cdecl;
    function listIterator: JListIterator; cdecl; overload;
    function listIterator(i: Integer): JListIterator; cdecl; overload;
    function remove(i: Integer): JContent; cdecl;
    function &set(i: Integer; content: JContent): JContent; cdecl; overload;
    function &set(i: Integer; object_: JObject): JObject; cdecl; overload;
    function size: Integer; cdecl;
    procedure sort(comparator: JComparator); cdecl;
    function toString: JString; cdecl;
  end;
  TJContentList = class(TJavaGenericImport<JContentListClass, JContentList>) end;

  JContentList_1Class = interface(JObjectClass)
    ['{9B40D80C-824D-4D8C-B587-2416B9E90724}']
  end;

  [JavaSignature('org/jdom2/ContentList$1')]
  JContentList_1 = interface(JObject)
    ['{60194EEC-1D4F-47D5-AC39-A283247574DC}']
  end;
  TJContentList_1 = class(TJavaGenericImport<JContentList_1Class, JContentList_1>) end;

  JContentList_CLIteratorClass = interface(JIteratorClass)
    ['{7C8CF2F0-99FC-4B94-9582-F621537D2324}']
    {class} function _Getthis: JContentList; cdecl;
    {class} property this: JContentList read _Getthis;
  end;

  [JavaSignature('org/jdom2/ContentList$CLIterator')]
  JContentList_CLIterator = interface(JIterator)
    ['{3FA439B0-E37F-48DC-9AD2-C3502C8C5119}']
    function hasNext: Boolean; cdecl;
    function next: JContent; cdecl;
    procedure remove; cdecl;
  end;
  TJContentList_CLIterator = class(TJavaGenericImport<JContentList_CLIteratorClass, JContentList_CLIterator>) end;

  JContentList_CLListIteratorClass = interface(JListIteratorClass)
    ['{5E0DF063-9D72-4A1F-8D8F-F74D2D2EE1BD}']
    {class} function _Getthis: JContentList; cdecl;
    {class} property this: JContentList read _Getthis;
  end;

  [JavaSignature('org/jdom2/ContentList$CLListIterator')]
  JContentList_CLListIterator = interface(JListIterator)
    ['{035B027C-22BE-4B8D-806D-9BE73FC2DA34}']
    procedure add(content: JContent); cdecl; overload;
    procedure add(object_: JObject); cdecl; overload;
    function hasNext: Boolean; cdecl;
    function hasPrevious: Boolean; cdecl;
    function next: JContent; cdecl;
    function nextIndex: Integer; cdecl;
    function previous: JContent; cdecl;
    function previousIndex: Integer; cdecl;
    procedure remove; cdecl;
    procedure &set(content: JContent); cdecl; overload;
    procedure &set(object_: JObject); cdecl; overload;
  end;
  TJContentList_CLListIterator = class(TJavaGenericImport<JContentList_CLListIteratorClass, JContentList_CLListIterator>) end;

  JContentList_FilterListClass = interface(JAbstractListClass)
    ['{B8071C35-A1A2-467E-B6A8-2F7D3EC50511}']
  end;

  [JavaSignature('org/jdom2/ContentList$FilterList')]
  JContentList_FilterList = interface(JAbstractList)
    ['{AAC62FD0-6BA4-4F0C-93BC-8E4E64C94799}']
    procedure add(i: Integer; object_: JObject); cdecl; overload;
    procedure add(i: Integer; content: JContent); cdecl; overload;
    function addAll(i: Integer; collection: JCollection): Boolean; cdecl;
    function &get(i: Integer): JContent; cdecl;
    function isEmpty: Boolean; cdecl;
    function iterator: JIterator; cdecl;
    function listIterator: JListIterator; cdecl; overload;
    function listIterator(i: Integer): JListIterator; cdecl; overload;
    function remove(i: Integer): JContent; cdecl;
    function &set(i: Integer; object_: JObject): JObject; cdecl; overload;
    function &set(i: Integer; content: JContent): JContent; cdecl; overload;
    function size: Integer; cdecl;
    procedure sort(comparator: JComparator); cdecl;
  end;
  TJContentList_FilterList = class(TJavaGenericImport<JContentList_FilterListClass, JContentList_FilterList>) end;

  JContentList_FilterListIteratorClass = interface(JListIteratorClass)
    ['{9A23CC1B-2A38-478E-8111-7F86B2484AF4}']
    {class} function _Getthis: JContentList; cdecl;
    {class} property this: JContentList read _Getthis;
  end;

  [JavaSignature('org/jdom2/ContentList$FilterListIterator')]
  JContentList_FilterListIterator = interface(JListIterator)
    ['{7C1E3EDD-B6E2-409F-9FF6-13370E374232}']
    procedure add(content: JContent); cdecl; overload;
    procedure add(object_: JObject); cdecl; overload;
    function hasNext: Boolean; cdecl;
    function hasPrevious: Boolean; cdecl;
    function next: JContent; cdecl;
    function nextIndex: Integer; cdecl;
    function previous: JContent; cdecl;
    function previousIndex: Integer; cdecl;
    procedure remove; cdecl;
    procedure &set(content: JContent); cdecl; overload;
    procedure &set(object_: JObject); cdecl; overload;
  end;
  TJContentList_FilterListIterator = class(TJavaGenericImport<JContentList_FilterListIteratorClass, JContentList_FilterListIterator>) end;

  JJDOMExceptionClass = interface(JExceptionClass)
    ['{C932B0AC-AF7E-4E73-B933-F1C5022F7F07}']
    {class} function init: JJDOMException; cdecl; overload;
    {class} function init(string_: JString): JJDOMException; cdecl; overload;
    {class} function init(string_: JString; throwable: JThrowable): JJDOMException; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/JDOMException')]
  JJDOMException = interface(JException)
    ['{6195A4D8-21E3-4C3B-B5D0-E2F59B0093CB}']
  end;
  TJJDOMException = class(TJavaGenericImport<JJDOMExceptionClass, JJDOMException>) end;

  JDataConversionExceptionClass = interface(JJDOMExceptionClass)
    ['{610326D3-21C8-4C3B-9303-8EDC83C429EA}']
    {class} function init(string_: JString; string_1: JString): JDataConversionException; cdecl;
  end;

  [JavaSignature('org/jdom2/DataConversionException')]
  JDataConversionException = interface(JJDOMException)
    ['{FCA8A62F-FB98-4795-A8C6-706A1BFA975D}']
  end;
  TJDataConversionException = class(TJavaGenericImport<JDataConversionExceptionClass, JDataConversionException>) end;

  JJDOMFactoryClass = interface(IJavaClass)
    ['{AB55474D-80E1-4F0D-9036-1D235A6DFFF6}']
  end;

  [JavaSignature('org/jdom2/JDOMFactory')]
  JJDOMFactory = interface(IJavaInstance)
    ['{283E3DE8-C832-4A0F-9E32-FB66E66A4377}']
    procedure addContent(parent: JParent; content: JContent); cdecl;
    procedure addNamespaceDeclaration(element: Jjdom2_Element; namespace: JNamespace); cdecl;
    function attribute(string_: JString; string_1: JString): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; attributeType: JAttributeType): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; i: Integer): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; namespace: JNamespace): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; i: Integer; namespace: JNamespace): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; attributeType: JAttributeType; namespace: JNamespace): JAttribute; cdecl; overload;
    function cdata(string_: JString): JCDATA; cdecl; overload;
    function cdata(i: Integer; i1: Integer; string_: JString): JCDATA; cdecl; overload;
    function comment(string_: JString): Jjdom2_Comment; cdecl; overload;
    function comment(i: Integer; i1: Integer; string_: JString): Jjdom2_Comment; cdecl; overload;
    function docType(string_: JString): JDocType; cdecl; overload;
    function docType(string_: JString; string_1: JString): JDocType; cdecl; overload;
    function docType(string_: JString; string_1: JString; string_2: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString; string_1: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): JDocType; cdecl; overload;
    function document(element: Jjdom2_Element): Jjdom2_Document; cdecl; overload;
    function document(element: Jjdom2_Element; docType: JDocType): Jjdom2_Document; cdecl; overload;
    function document(element: Jjdom2_Element; docType: JDocType; string_: JString): Jjdom2_Document; cdecl; overload;
    function element(string_: JString): Jjdom2_Element; cdecl; overload;
    function element(string_: JString; string_1: JString): Jjdom2_Element; cdecl; overload;
    function element(string_: JString; namespace: JNamespace): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString): Jjdom2_Element; cdecl; overload;
    function element(string_: JString; string_1: JString; string_2: JString): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; namespace: JNamespace): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; string_1: JString): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): Jjdom2_Element; cdecl; overload;
    function entityRef(string_: JString): JEntityRef; cdecl; overload;
    function entityRef(string_: JString; string_1: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString): JEntityRef; cdecl; overload;
    function entityRef(string_: JString; string_1: JString; string_2: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString; string_1: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): JEntityRef; cdecl; overload;
    function processingInstruction(string_: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(string_: JString; map: JMap): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(string_: JString; string_1: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString; map: JMap): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString; string_1: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    procedure setAttribute(element: Jjdom2_Element; attribute: JAttribute); cdecl;
    procedure setRoot(document: Jjdom2_Document; element: Jjdom2_Element); cdecl;
    function text(string_: JString): Jjdom2_Text; cdecl; overload;
    function text(i: Integer; i1: Integer; string_: JString): Jjdom2_Text; cdecl; overload;
  end;
  TJJDOMFactory = class(TJavaGenericImport<JJDOMFactoryClass, JJDOMFactory>) end;

  JDefaultJDOMFactoryClass = interface(JJDOMFactoryClass)
    ['{C79862BA-96A6-483A-B6BD-4E754EEAB6BE}']
    {class} function init: JDefaultJDOMFactory; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/DefaultJDOMFactory')]
  JDefaultJDOMFactory = interface(JJDOMFactory)
    ['{4DE65811-3F3A-4639-833C-A706C7CE1052}']
    procedure addContent(parent: JParent; content: JContent); cdecl;
    procedure addNamespaceDeclaration(element: Jjdom2_Element; namespace: JNamespace); cdecl;
    function attribute(string_: JString; string_1: JString): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; i: Integer): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; attributeType: JAttributeType): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; namespace: JNamespace): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; i: Integer; namespace: JNamespace): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; attributeType: JAttributeType; namespace: JNamespace): JAttribute; cdecl; overload;
    function cdata(string_: JString): JCDATA; cdecl; overload;
    function cdata(i: Integer; i1: Integer; string_: JString): JCDATA; cdecl; overload;
    function comment(string_: JString): Jjdom2_Comment; cdecl; overload;
    function comment(i: Integer; i1: Integer; string_: JString): Jjdom2_Comment; cdecl; overload;
    function docType(string_: JString): JDocType; cdecl; overload;
    function docType(string_: JString; string_1: JString): JDocType; cdecl; overload;
    function docType(string_: JString; string_1: JString; string_2: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString; string_1: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): JDocType; cdecl; overload;
    function document(element: Jjdom2_Element): Jjdom2_Document; cdecl; overload;
    function document(element: Jjdom2_Element; docType: JDocType): Jjdom2_Document; cdecl; overload;
    function document(element: Jjdom2_Element; docType: JDocType; string_: JString): Jjdom2_Document; cdecl; overload;
    function element(string_: JString): Jjdom2_Element; cdecl; overload;
    function element(string_: JString; string_1: JString): Jjdom2_Element; cdecl; overload;
    function element(string_: JString; namespace: JNamespace): Jjdom2_Element; cdecl; overload;
    function element(string_: JString; string_1: JString; string_2: JString): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; namespace: JNamespace): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; string_1: JString): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): Jjdom2_Element; cdecl; overload;
    function entityRef(string_: JString): JEntityRef; cdecl; overload;
    function entityRef(string_: JString; string_1: JString): JEntityRef; cdecl; overload;
    function entityRef(string_: JString; string_1: JString; string_2: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString; string_1: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): JEntityRef; cdecl; overload;
    function processingInstruction(string_: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(string_: JString; map: JMap): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(string_: JString; string_1: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString; string_1: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString; map: JMap): Jjdom2_ProcessingInstruction; cdecl; overload;
    procedure setAttribute(element: Jjdom2_Element; attribute: JAttribute); cdecl;
    procedure setRoot(document: Jjdom2_Document; element: Jjdom2_Element); cdecl;
    function text(string_: JString): Jjdom2_Text; cdecl; overload;
    function text(i: Integer; i1: Integer; string_: JString): Jjdom2_Text; cdecl; overload;
  end;
  TJDefaultJDOMFactory = class(TJavaGenericImport<JDefaultJDOMFactoryClass, JDefaultJDOMFactory>) end;

  JIteratorIterableClass = interface(JIterableClass)
    ['{55B4379D-0EE5-4D2A-9A85-8AFFE4619980}']
  end;

  [JavaSignature('org/jdom2/util/IteratorIterable')]
  JIteratorIterable = interface(JIterable)
    ['{08CB1E1B-FC60-4BBE-8A22-AF9F59ACA0EF}']
  end;
  TJIteratorIterable = class(TJavaGenericImport<JIteratorIterableClass, JIteratorIterable>) end;

  JDescendantIteratorClass = interface(JIteratorIterableClass)
    ['{40841076-84CA-46C3-A201-E7DF482CD32E}']
    {class} function init(parent: JParent): JDescendantIterator; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/DescendantIterator')]
  JDescendantIterator = interface(JIteratorIterable)
    ['{B664C24C-AE98-4078-9588-438538D0503C}']
    function hasNext: Boolean; cdecl;
    function iterator: JDescendantIterator; cdecl;
    function next: JContent; cdecl;
    procedure remove; cdecl;
  end;
  TJDescendantIterator = class(TJavaGenericImport<JDescendantIteratorClass, JDescendantIterator>) end;

  JDocTypeClass = interface(JContentClass)
    ['{C98447B4-115B-4980-B921-51DF60E5A217}']
    {class} function _GetinternalSubset: JString; cdecl;
    {class} procedure _SetinternalSubset(Value: JString); cdecl;
    {class} function _GetsystemID: JString; cdecl;
    {class} procedure _SetsystemID(Value: JString); cdecl;
    {class} function init: JDocType; cdecl; overload;//Deprecated
    {class} function init(string_: JString): JDocType; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JDocType; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JDocType; cdecl; overload;
    {class} property internalSubset: JString read _GetinternalSubset write _SetinternalSubset;
    {class} property systemID: JString read _GetsystemID write _SetsystemID;
  end;

  [JavaSignature('org/jdom2/DocType')]
  JDocType = interface(JContent)
    ['{AF5A528D-A1A0-4278-A9EA-73FFE4202C45}']
    function clone: JDocType; cdecl;
    function detach: JDocType; cdecl;
    function getElementName: JString; cdecl;
    function getInternalSubset: JString; cdecl;
    function getParent: Jjdom2_Document; cdecl;
    function getPublicID: JString; cdecl;
    function getSystemID: JString; cdecl;
    function getValue: JString; cdecl;
    function setElementName(string_: JString): JDocType; cdecl;
    procedure setInternalSubset(string_: JString); cdecl;
    function setPublicID(string_: JString): JDocType; cdecl;
    function setSystemID(string_: JString): JDocType; cdecl;
    function toString: JString; cdecl;
  end;
  TJDocType = class(TJavaGenericImport<JDocTypeClass, JDocType>) end;

  Jjdom2_DocumentClass = interface(JCloneBaseClass)
    ['{5967468E-08E6-47C0-B8AC-4822D6ED60AD}']
    {class} function _Getcontent: JContentList; cdecl;
    {class} function init: Jjdom2_Document; cdecl; overload;//Deprecated
    {class} function init(element: Jjdom2_Element): Jjdom2_Document; cdecl; overload;
    {class} function init(list: JList): Jjdom2_Document; cdecl; overload;
    {class} function init(element: Jjdom2_Element; docType: JDocType): Jjdom2_Document; cdecl; overload;
    {class} function init(element: Jjdom2_Element; docType: JDocType; string_: JString): Jjdom2_Document; cdecl; overload;
    {class} property content: JContentList read _Getcontent;
  end;

  [JavaSignature('org/jdom2/Document')]
  Jjdom2_Document = interface(JCloneBase)
    ['{E7D0613F-5B01-4242-9D0E-23E34012057D}']
    function addContent(content: JContent): Jjdom2_Document; cdecl; overload;
    function addContent(collection: JCollection): Jjdom2_Document; cdecl; overload;
    function addContent(i: Integer; content: JContent): Jjdom2_Document; cdecl; overload;
    function addContent(i: Integer; collection: JCollection): Jjdom2_Document; cdecl; overload;
    procedure canContainContent(content: JContent; i: Integer; b: Boolean); cdecl;
    function clone: Jjdom2_Document; cdecl;
    function cloneContent: JList; cdecl;
    function detachRootElement: Jjdom2_Element; cdecl;
    function equals(object_: JObject): Boolean; cdecl;
    function getBaseURI: JString; cdecl;
    function getContent: JList; cdecl; overload;
    function getContent(i: Integer): JContent; cdecl; overload;
    function getContent(filter: Jfilter_Filter): JList; cdecl; overload;
    function getContentSize: Integer; cdecl;
    function getDescendants: JIteratorIterable; cdecl; overload;
    function getDescendants(filter: Jfilter_Filter): JIteratorIterable; cdecl; overload;
    function getDocType: JDocType; cdecl;
    function getDocument: Jjdom2_Document; cdecl;
    function getNamespacesInScope: JList; cdecl;
    function getNamespacesInherited: JList; cdecl;
    function getNamespacesIntroduced: JList; cdecl;
    function getParent: JParent; cdecl;
    function getProperty(string_: JString): JObject; cdecl;
    function getRootElement: Jjdom2_Element; cdecl;
    function hasRootElement: Boolean; cdecl;
    function hashCode: Integer; cdecl;
    function indexOf(content: JContent): Integer; cdecl;
    function removeContent: JList; cdecl; overload;
    function removeContent(content: JContent): Boolean; cdecl; overload;
    function removeContent(i: Integer): JContent; cdecl; overload;
    function removeContent(filter: Jfilter_Filter): JList; cdecl; overload;
    procedure setBaseURI(string_: JString); cdecl;
    function setContent(collection: JCollection): Jjdom2_Document; cdecl; overload;
    function setContent(content: JContent): Jjdom2_Document; cdecl; overload;
    function setContent(i: Integer; collection: JCollection): Jjdom2_Document; cdecl; overload;
    function setContent(i: Integer; content: JContent): Jjdom2_Document; cdecl; overload;
    function setDocType(docType: JDocType): Jjdom2_Document; cdecl;
    procedure setProperty(string_: JString; object_: JObject); cdecl;
    function setRootElement(element: Jjdom2_Element): Jjdom2_Document; cdecl;
    function toString: JString; cdecl;
  end;
  TJjdom2_Document = class(TJavaGenericImport<Jjdom2_DocumentClass, Jjdom2_Document>) end;

  Jjdom2_ElementClass = interface(JContentClass)
    ['{E7A9EA4B-F783-4590-A44E-748CD2F54224}']
    {class} function _GetadditionalNamespaces: JList; cdecl;
    {class} procedure _SetadditionalNamespaces(Value: JList); cdecl;
    {class} function _Getattributes: Jjdom2_AttributeList; cdecl;
    {class} procedure _Setattributes(Value: Jjdom2_AttributeList); cdecl;
    {class} function _Getcontent: JContentList; cdecl;
    {class} procedure _Setcontent(Value: JContentList); cdecl;
    {class} function _Getname: JString; cdecl;
    {class} function init(string_: JString): Jjdom2_Element; cdecl; overload;
    {class} function init(string_: JString; namespace: JNamespace): Jjdom2_Element; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): Jjdom2_Element; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): Jjdom2_Element; cdecl; overload;
    {class} property additionalNamespaces: JList read _GetadditionalNamespaces write _SetadditionalNamespaces;
    {class} property attributes: Jjdom2_AttributeList read _Getattributes write _Setattributes;
    {class} property content: JContentList read _Getcontent write _Setcontent;
    {class} property name: JString read _Getname;
  end;

  [JavaSignature('org/jdom2/Element')]
  Jjdom2_Element = interface(JContent)
    ['{758AD7E9-B6CF-4E2A-BAD4-3377226BA0A2}']
    function addContent(content: JContent): Jjdom2_Element; cdecl; overload;
    function addContent(string_: JString): Jjdom2_Element; cdecl; overload;
    function addContent(collection: JCollection): Jjdom2_Element; cdecl; overload;
    function addContent(i: Integer; content: JContent): Jjdom2_Element; cdecl; overload;
    function addContent(i: Integer; collection: JCollection): Jjdom2_Element; cdecl; overload;
    function addNamespaceDeclaration(namespace: JNamespace): Boolean; cdecl;
    procedure canContainContent(content: JContent; i: Integer; b: Boolean); cdecl;
    function clone: Jjdom2_Element; cdecl;
    function cloneContent: JList; cdecl;
    function coalesceText(b: Boolean): Boolean; cdecl;
    function detach: Jjdom2_Element; cdecl;
    function getAdditionalNamespaces: JList; cdecl;
    function getAttribute(string_: JString): JAttribute; cdecl; overload;
    function getAttribute(string_: JString; namespace: JNamespace): JAttribute; cdecl; overload;
    function getAttributeValue(string_: JString): JString; cdecl; overload;
    function getAttributeValue(string_: JString; namespace: JNamespace): JString; cdecl; overload;
    function getAttributeValue(string_: JString; string_1: JString): JString; cdecl; overload;
    function getAttributeValue(string_: JString; namespace: JNamespace; string_1: JString): JString; cdecl; overload;
    function getAttributes: JList; cdecl;
    function getChild(string_: JString): Jjdom2_Element; cdecl; overload;
    function getChild(string_: JString; namespace: JNamespace): Jjdom2_Element; cdecl; overload;
    function getChildText(string_: JString): JString; cdecl; overload;
    function getChildText(string_: JString; namespace: JNamespace): JString; cdecl; overload;
    function getChildTextNormalize(string_: JString): JString; cdecl; overload;
    function getChildTextNormalize(string_: JString; namespace: JNamespace): JString; cdecl; overload;
    function getChildTextTrim(string_: JString): JString; cdecl; overload;
    function getChildTextTrim(string_: JString; namespace: JNamespace): JString; cdecl; overload;
    function getChildren: JList; cdecl; overload;
    function getChildren(string_: JString): JList; cdecl; overload;
    function getChildren(string_: JString; namespace: JNamespace): JList; cdecl; overload;
    function getContent: JList; cdecl; overload;
    function getContent(i: Integer): JContent; cdecl; overload;
    function getContent(filter: Jfilter_Filter): JList; cdecl; overload;
    function getContentSize: Integer; cdecl;
    function getDescendants: JIteratorIterable; cdecl; overload;
    function getDescendants(filter: Jfilter_Filter): JIteratorIterable; cdecl; overload;
    function getName: JString; cdecl;
    function getNamespace: JNamespace; cdecl; overload;
    function getNamespace(string_: JString): JNamespace; cdecl; overload;
    function getNamespacePrefix: JString; cdecl;
    function getNamespaceURI: JString; cdecl;
    function getNamespacesInScope: JList; cdecl;
    function getNamespacesInherited: JList; cdecl;
    function getNamespacesIntroduced: JList; cdecl;
    function getQualifiedName: JString; cdecl;
    function getText: JString; cdecl;
    function getTextNormalize: JString; cdecl;
    function getTextTrim: JString; cdecl;
    function getValue: JString; cdecl;
    function getXMLBaseURI: JURI; cdecl;
    function hasAdditionalNamespaces: Boolean; cdecl;
    function hasAttributes: Boolean; cdecl;
    function indexOf(content: JContent): Integer; cdecl;
    function isAncestor(element: Jjdom2_Element): Boolean; cdecl;
    function isRootElement: Boolean; cdecl;
    function removeAttribute(string_: JString): Boolean; cdecl; overload;
    function removeAttribute(attribute: JAttribute): Boolean; cdecl; overload;
    function removeAttribute(string_: JString; namespace: JNamespace): Boolean; cdecl; overload;
    function removeChild(string_: JString): Boolean; cdecl; overload;
    function removeChild(string_: JString; namespace: JNamespace): Boolean; cdecl; overload;
    function removeChildren(string_: JString): Boolean; cdecl; overload;
    function removeChildren(string_: JString; namespace: JNamespace): Boolean; cdecl; overload;
    function removeContent: JList; cdecl; overload;
    function removeContent(i: Integer): JContent; cdecl; overload;
    function removeContent(filter: Jfilter_Filter): JList; cdecl; overload;
    function removeContent(content: JContent): Boolean; cdecl; overload;
    procedure removeNamespaceDeclaration(namespace: JNamespace); cdecl;
    function setAttribute(attribute: JAttribute): Jjdom2_Element; cdecl; overload;
    function setAttribute(string_: JString; string_1: JString): Jjdom2_Element; cdecl; overload;
    function setAttribute(string_: JString; string_1: JString; namespace: JNamespace): Jjdom2_Element; cdecl; overload;
    function setAttributes(collection: JCollection): Jjdom2_Element; cdecl;
    function setContent(collection: JCollection): Jjdom2_Element; cdecl; overload;
    function setContent(content: JContent): Jjdom2_Element; cdecl; overload;
    function setContent(i: Integer; content: JContent): Jjdom2_Element; cdecl; overload;
    function setContent(i: Integer; collection: JCollection): JParent; cdecl; overload;
    function setName(string_: JString): Jjdom2_Element; cdecl;
    function setNamespace(namespace: JNamespace): Jjdom2_Element; cdecl;
    function setText(string_: JString): Jjdom2_Element; cdecl;
    procedure sortAttributes(comparator: JComparator); cdecl;
    procedure sortChildren(comparator: JComparator); cdecl;
    procedure sortContent(comparator: JComparator); cdecl; overload;
    procedure sortContent(filter: Jfilter_Filter; comparator: JComparator); cdecl; overload;
    function toString: JString; cdecl;
  end;
  TJjdom2_Element = class(TJavaGenericImport<Jjdom2_ElementClass, Jjdom2_Element>) end;

  JEntityRefClass = interface(JContentClass)
    ['{C1107A83-1D84-4091-B72A-789B000CB760}']
    {class} function _GetsystemID: JString; cdecl;
    {class} procedure _SetsystemID(Value: JString); cdecl;
    {class} function init: JEntityRef; cdecl; overload;//Deprecated
    {class} function init(string_: JString): JEntityRef; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JEntityRef; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JEntityRef; cdecl; overload;
    {class} property systemID: JString read _GetsystemID write _SetsystemID;
  end;

  [JavaSignature('org/jdom2/EntityRef')]
  JEntityRef = interface(JContent)
    ['{0102381C-8D04-4884-87A1-14E457771498}']
    function clone: JEntityRef; cdecl;
    function detach: JEntityRef; cdecl;
    function getName: JString; cdecl;
    function getParent: Jjdom2_Element; cdecl;
    function getPublicID: JString; cdecl;
    function getSystemID: JString; cdecl;
    function getValue: JString; cdecl;
    function setName(string_: JString): JEntityRef; cdecl;
    function setPublicID(string_: JString): JEntityRef; cdecl;
    function setSystemID(string_: JString): JEntityRef; cdecl;
    function toString: JString; cdecl;
  end;
  TJEntityRef = class(TJavaGenericImport<JEntityRefClass, JEntityRef>) end;

  JFilterIteratorClass = interface(JIteratorIterableClass)
    ['{1C0DAEB1-691D-42F6-9971-654AE8B55AF2}']
    {class} function init(descendantIterator: JDescendantIterator; filter: Jfilter_Filter): JFilterIterator; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/FilterIterator')]
  JFilterIterator = interface(JIteratorIterable)
    ['{7C95810F-95A1-48A5-B7D1-FEFE19E5B352}']
    function hasNext: Boolean; cdecl;
    function iterator: JIterator; cdecl;
    function next: JObject; cdecl;
    procedure remove; cdecl;
  end;
  TJFilterIterator = class(TJavaGenericImport<JFilterIteratorClass, JFilterIterator>) end;

  JIllegalAddExceptionClass = interface(JIllegalArgumentExceptionClass)
    ['{179066DC-48DC-43B5-8F44-A654DA474C03}']
    {class} function init(string_: JString): JIllegalAddException; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/IllegalAddException')]
  JIllegalAddException = interface(JIllegalArgumentException)
    ['{52B0AEA6-9826-4F00-BE20-42F7D7CA2E6D}']
  end;
  TJIllegalAddException = class(TJavaGenericImport<JIllegalAddExceptionClass, JIllegalAddException>) end;

  JIllegalDataExceptionClass = interface(JIllegalArgumentExceptionClass)
    ['{E29E1D81-FA3F-4E33-8EF1-BD54EC7DC91B}']
    {class} function init(string_: JString): JIllegalDataException; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/IllegalDataException')]
  JIllegalDataException = interface(JIllegalArgumentException)
    ['{5491A75A-9722-4D43-8F3A-2EAB28C8ACCB}']
  end;
  TJIllegalDataException = class(TJavaGenericImport<JIllegalDataExceptionClass, JIllegalDataException>) end;

  JIllegalNameExceptionClass = interface(JIllegalArgumentExceptionClass)
    ['{86AE2E8E-5C96-46B1-B7F5-CB307B299A0A}']
    {class} function init(string_: JString): JIllegalNameException; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/IllegalNameException')]
  JIllegalNameException = interface(JIllegalArgumentException)
    ['{D921D239-1D07-463D-AADE-C8FB0957380B}']
  end;
  TJIllegalNameException = class(TJavaGenericImport<JIllegalNameExceptionClass, JIllegalNameException>) end;

  JIllegalTargetExceptionClass = interface(JIllegalArgumentExceptionClass)
    ['{FBB358AE-63BA-4BED-8575-066EB29AE4FD}']
    {class} function init(string_: JString): JIllegalTargetException; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/IllegalTargetException')]
  JIllegalTargetException = interface(JIllegalArgumentException)
    ['{0A3B781D-0815-4866-804B-0B8C1FC68D90}']
  end;
  TJIllegalTargetException = class(TJavaGenericImport<JIllegalTargetExceptionClass, JIllegalTargetException>) end;

  JJDOMConstantsClass = interface(JObjectClass)
    ['{121FA78E-092A-48ED-92FC-208F91CE9821}']
    {class} function _GetJDOM2_FEATURE_JDOMRESULT: JString; cdecl;
    {class} function _GetJDOM2_FEATURE_JDOMSOURCE: JString; cdecl;
    {class} function _GetJDOM2_PROPERTY_LINE_SEPARATOR: JString; cdecl;
    {class} function _GetJDOM2_PROPERTY_XPATH_FACTORY: JString; cdecl;
    {class} function _GetNS_PREFIX_DEFAULT: JString; cdecl;
    {class} function _GetNS_PREFIX_XML: JString; cdecl;
    {class} function _GetNS_PREFIX_XMLNS: JString; cdecl;
    {class} function _GetNS_URI_DEFAULT: JString; cdecl;
    {class} function _GetNS_URI_XML: JString; cdecl;
    {class} function _GetNS_URI_XMLNS: JString; cdecl;
    {class} function _GetSAX_FEATURE_EXTERNAL_ENT: JString; cdecl;
    {class} function _GetSAX_FEATURE_NAMESPACES: JString; cdecl;
    {class} function _GetSAX_FEATURE_NAMESPACE_PREFIXES: JString; cdecl;
    {class} function _GetSAX_FEATURE_VALIDATION: JString; cdecl;
    {class} function _GetSAX_PROPERTY_DECLARATION_HANDLER: JString; cdecl;
    {class} function _GetSAX_PROPERTY_DECLARATION_HANDLER_ALT: JString; cdecl;
    {class} function _GetSAX_PROPERTY_LEXICAL_HANDLER: JString; cdecl;
    {class} function _GetSAX_PROPERTY_LEXICAL_HANDLER_ALT: JString; cdecl;
    {class} property JDOM2_FEATURE_JDOMRESULT: JString read _GetJDOM2_FEATURE_JDOMRESULT;
    {class} property JDOM2_FEATURE_JDOMSOURCE: JString read _GetJDOM2_FEATURE_JDOMSOURCE;
    {class} property JDOM2_PROPERTY_LINE_SEPARATOR: JString read _GetJDOM2_PROPERTY_LINE_SEPARATOR;
    {class} property JDOM2_PROPERTY_XPATH_FACTORY: JString read _GetJDOM2_PROPERTY_XPATH_FACTORY;
    {class} property NS_PREFIX_DEFAULT: JString read _GetNS_PREFIX_DEFAULT;
    {class} property NS_PREFIX_XML: JString read _GetNS_PREFIX_XML;
    {class} property NS_PREFIX_XMLNS: JString read _GetNS_PREFIX_XMLNS;
    {class} property NS_URI_DEFAULT: JString read _GetNS_URI_DEFAULT;
    {class} property NS_URI_XML: JString read _GetNS_URI_XML;
    {class} property NS_URI_XMLNS: JString read _GetNS_URI_XMLNS;
    {class} property SAX_FEATURE_EXTERNAL_ENT: JString read _GetSAX_FEATURE_EXTERNAL_ENT;
    {class} property SAX_FEATURE_NAMESPACES: JString read _GetSAX_FEATURE_NAMESPACES;
    {class} property SAX_FEATURE_NAMESPACE_PREFIXES: JString read _GetSAX_FEATURE_NAMESPACE_PREFIXES;
    {class} property SAX_FEATURE_VALIDATION: JString read _GetSAX_FEATURE_VALIDATION;
    {class} property SAX_PROPERTY_DECLARATION_HANDLER: JString read _GetSAX_PROPERTY_DECLARATION_HANDLER;
    {class} property SAX_PROPERTY_DECLARATION_HANDLER_ALT: JString read _GetSAX_PROPERTY_DECLARATION_HANDLER_ALT;
    {class} property SAX_PROPERTY_LEXICAL_HANDLER: JString read _GetSAX_PROPERTY_LEXICAL_HANDLER;
    {class} property SAX_PROPERTY_LEXICAL_HANDLER_ALT: JString read _GetSAX_PROPERTY_LEXICAL_HANDLER_ALT;
  end;

  [JavaSignature('org/jdom2/JDOMConstants')]
  JJDOMConstants = interface(JObject)
    ['{626EC987-1699-4BCA-B063-CE799016075B}']
  end;
  TJJDOMConstants = class(TJavaGenericImport<JJDOMConstantsClass, JJDOMConstants>) end;

  JNamespaceClass = interface(JSerializableClass)
    ['{EEB47594-1A91-4B23-A5AD-C0DBF8E8DCF8}']
    {class} function _GetNO_NAMESPACE: JNamespace; cdecl;
    {class} function _GetXML_NAMESPACE: JNamespace; cdecl;
    {class} function getNamespace(string_: JString): JNamespace; cdecl; overload;
    {class} function getNamespace(string_: JString; string_1: JString): JNamespace; cdecl; overload;//Deprecated
    {class} property NO_NAMESPACE: JNamespace read _GetNO_NAMESPACE;
    {class} property XML_NAMESPACE: JNamespace read _GetXML_NAMESPACE;
  end;

  [JavaSignature('org/jdom2/Namespace')]
  JNamespace = interface(JSerializable)
    ['{E89E106B-BFE1-44F4-A813-615D699E1F43}']
    function equals(object_: JObject): Boolean; cdecl;
    function getPrefix: JString; cdecl;
    function getURI: JString; cdecl;
    function hashCode: Integer; cdecl;
    function toString: JString; cdecl;
  end;
  TJNamespace = class(TJavaGenericImport<JNamespaceClass, JNamespace>) end;

  JNamespace_NamespaceSerializationProxyClass = interface(JSerializableClass)
    ['{B186A112-BE9A-47D8-8663-25B16170E4C4}']
    {class} function init(string_: JString; string_1: JString): JNamespace_NamespaceSerializationProxy; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/Namespace$NamespaceSerializationProxy')]
  JNamespace_NamespaceSerializationProxy = interface(JSerializable)
    ['{14132FD7-12ED-4A73-9608-2B6DBFE0DCDA}']
  end;
  TJNamespace_NamespaceSerializationProxy = class(TJavaGenericImport<JNamespace_NamespaceSerializationProxyClass, JNamespace_NamespaceSerializationProxy>) end;

  JNamespaceAwareClass = interface(IJavaClass)
    ['{DE842634-E267-4314-8313-AAA05A6F5FC0}']
  end;

  [JavaSignature('org/jdom2/NamespaceAware')]
  JNamespaceAware = interface(IJavaInstance)
    ['{3A7EBFE6-F826-48B0-936F-DA556DDADB99}']
    function getNamespacesInScope: JList; cdecl;
    function getNamespacesInherited: JList; cdecl;
    function getNamespacesIntroduced: JList; cdecl;
  end;
  TJNamespaceAware = class(TJavaGenericImport<JNamespaceAwareClass, JNamespaceAware>) end;

  JParentClass = interface(JCloneableClass)
    ['{3B8DE141-FD57-4260-805C-0F9C3A6C3FF1}']
  end;

  [JavaSignature('org/jdom2/Parent')]
  JParent = interface(JCloneable)
    ['{FEE77BA0-136F-4949-BC0E-C7304B6F18BE}']
    function addContent(collection: JCollection): JParent; cdecl; overload;
    function addContent(content: JContent): JParent; cdecl; overload;
    function addContent(i: Integer; collection: JCollection): JParent; cdecl; overload;
    function addContent(i: Integer; content: JContent): JParent; cdecl; overload;
    procedure canContainContent(content: JContent; i: Integer; b: Boolean); cdecl;
    function clone: JObject; cdecl;
    function cloneContent: JList; cdecl;
    function getContent: JList; cdecl; overload;
    function getContent(filter: Jfilter_Filter): JList; cdecl; overload;
    function getContent(i: Integer): JContent; cdecl; overload;
    function getContentSize: Integer; cdecl;
    function getDescendants: JIteratorIterable; cdecl; overload;
    function getDescendants(filter: Jfilter_Filter): JIteratorIterable; cdecl; overload;
    function getDocument: Jjdom2_Document; cdecl;
    function getParent: JParent; cdecl;
    function indexOf(content: JContent): Integer; cdecl;
    function removeContent: JList; cdecl; overload;
    function removeContent(filter: Jfilter_Filter): JList; cdecl; overload;
    function removeContent(content: JContent): Boolean; cdecl; overload;
    function removeContent(i: Integer): JContent; cdecl; overload;
  end;
  TJParent = class(TJavaGenericImport<JParentClass, JParent>) end;

  Jjdom2_ProcessingInstructionClass = interface(JContentClass)
    ['{067C7B93-836C-4528-B28A-77D2DF1382F7}']
    {class} function init(string_: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    {class} function init(string_: JString; map: JMap): Jjdom2_ProcessingInstruction; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/ProcessingInstruction')]
  Jjdom2_ProcessingInstruction = interface(JContent)
    ['{E762E47C-852A-4D64-86C1-22010FFFAA8C}']
    function clone: Jjdom2_ProcessingInstruction; cdecl;
    function detach: Jjdom2_ProcessingInstruction; cdecl;
    function getData: JString; cdecl;
    function getPseudoAttributeNames: JList; cdecl;
    function getPseudoAttributeValue(string_: JString): JString; cdecl;
    function getTarget: JString; cdecl;
    function getValue: JString; cdecl;
    function removePseudoAttribute(string_: JString): Boolean; cdecl;
    function setData(string_: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function setData(map: JMap): Jjdom2_ProcessingInstruction; cdecl; overload;
    function setPseudoAttribute(string_: JString; string_1: JString): Jjdom2_ProcessingInstruction; cdecl;
    function setTarget(string_: JString): Jjdom2_ProcessingInstruction; cdecl;
    function toString: JString; cdecl;
  end;
  TJjdom2_ProcessingInstruction = class(TJavaGenericImport<Jjdom2_ProcessingInstructionClass, Jjdom2_ProcessingInstruction>) end;

  JSlimJDOMFactoryClass = interface(JDefaultJDOMFactoryClass)
    ['{355EF951-0A02-4AFE-9243-392592D2B508}']
    {class} function init: JSlimJDOMFactory; cdecl; overload;
    {class} function init(b: Boolean): JSlimJDOMFactory; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/SlimJDOMFactory')]
  JSlimJDOMFactory = interface(JDefaultJDOMFactory)
    ['{9B5F3024-6518-4F9D-8DBE-4E9B971382B9}']
    function attribute(string_: JString; string_1: JString): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; namespace: JNamespace): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; attributeType: JAttributeType): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; i: Integer): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; attributeType: JAttributeType; namespace: JNamespace): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; i: Integer; namespace: JNamespace): JAttribute; cdecl; overload;
    function cdata(i: Integer; i1: Integer; string_: JString): JCDATA; cdecl;
    procedure clearCache; cdecl;
    function comment(i: Integer; i1: Integer; string_: JString): Jjdom2_Comment; cdecl;
    function docType(i: Integer; i1: Integer; string_: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString; string_1: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): JDocType; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; namespace: JNamespace): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; string_1: JString): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): Jjdom2_Element; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString; string_1: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): JEntityRef; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString; map: JMap): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString; string_1: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function text(i: Integer; i1: Integer; string_: JString): Jjdom2_Text; cdecl;
  end;
  TJSlimJDOMFactory = class(TJavaGenericImport<JSlimJDOMFactoryClass, JSlimJDOMFactory>) end;

  JStringBinClass = interface(JObjectClass)
    ['{277B745E-6CBB-4E6D-8D9F-645011AD3011}']
    {class} function init: JStringBin; cdecl; overload;
    {class} function init(i: Integer): JStringBin; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/StringBin')]
  JStringBin = interface(JObject)
    ['{37FC5FB1-8706-43E1-9B05-9839D04136C5}']
    function reuse(string_: JString): JString; cdecl;
    function size: Integer; cdecl;
  end;
  TJStringBin = class(TJavaGenericImport<JStringBinClass, JStringBin>) end;

  JUncheckedJDOMFactoryClass = interface(JDefaultJDOMFactoryClass)
    ['{A45DB9A4-CCFE-40A4-8E7E-DDE45ED564F9}']
    {class} function init: JUncheckedJDOMFactory; cdecl;
  end;

  [JavaSignature('org/jdom2/UncheckedJDOMFactory')]
  JUncheckedJDOMFactory = interface(JDefaultJDOMFactory)
    ['{272406E7-8F01-41C1-BBBF-D13D63EDC0DE}']
    procedure addContent(parent: JParent; content: JContent); cdecl;
    procedure addNamespaceDeclaration(element: Jjdom2_Element; namespace: JNamespace); cdecl;
    function attribute(string_: JString; string_1: JString): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; namespace: JNamespace): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; i: Integer): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; attributeType: JAttributeType): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; attributeType: JAttributeType; namespace: JNamespace): JAttribute; cdecl; overload;
    function attribute(string_: JString; string_1: JString; i: Integer; namespace: JNamespace): JAttribute; cdecl; overload;
    function cdata(i: Integer; i1: Integer; string_: JString): JCDATA; cdecl;
    function comment(i: Integer; i1: Integer; string_: JString): Jjdom2_Comment; cdecl;
    function docType(i: Integer; i1: Integer; string_: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString; string_1: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): JDocType; cdecl; overload;
    function document(element: Jjdom2_Element): Jjdom2_Document; cdecl; overload;
    function document(element: Jjdom2_Element; docType: JDocType): Jjdom2_Document; cdecl; overload;
    function document(element: Jjdom2_Element; docType: JDocType; string_: JString): Jjdom2_Document; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; string_1: JString): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; namespace: JNamespace): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): Jjdom2_Element; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString; string_1: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): JEntityRef; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString; string_1: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString; map: JMap): Jjdom2_ProcessingInstruction; cdecl; overload;
    procedure setAttribute(element: Jjdom2_Element; attribute: JAttribute); cdecl;
    procedure setRoot(document: Jjdom2_Document; element: Jjdom2_Element); cdecl;
    function text(i: Integer; i1: Integer; string_: JString): Jjdom2_Text; cdecl;
  end;
  TJUncheckedJDOMFactory = class(TJavaGenericImport<JUncheckedJDOMFactoryClass, JUncheckedJDOMFactory>) end;

  JVerifierClass = interface(JObjectClass)
    ['{A7E4DE1F-9205-4AD3-A0E3-395BBE41ED25}']
    {class} function checkAttributeName(string_: JString): JString; cdecl;
    {class} function checkCDATASection(string_: JString): JString; cdecl;
    {class} function checkCharacterData(string_: JString): JString; cdecl;
    {class} function checkCommentData(string_: JString): JString; cdecl;
    {class} function checkElementName(string_: JString): JString; cdecl;
    {class} function checkNamespaceCollision(namespace: JNamespace; list: JList): JString; cdecl; overload;
    {class} function checkNamespaceCollision(namespace: JNamespace; element: Jjdom2_Element): JString; cdecl; overload;
    {class} function checkNamespaceCollision(attribute: JAttribute; element: Jjdom2_Element): JString; cdecl; overload;
    {class} function checkNamespaceCollision(namespace: JNamespace; namespace1: JNamespace): JString; cdecl; overload;
    {class} function checkNamespaceCollision(namespace: JNamespace; attribute: JAttribute): JString; cdecl; overload;
    {class} function checkNamespaceCollision(namespace: JNamespace; list: JList; i: Integer): JString; cdecl; overload;
    {class} function checkNamespaceCollision(attribute: JAttribute; element: Jjdom2_Element; i: Integer): JString; cdecl; overload;
    {class} function checkNamespaceCollision(namespace: JNamespace; element: Jjdom2_Element; i: Integer): JString; cdecl; overload;
    {class} function checkNamespacePrefix(string_: JString): JString; cdecl;
    {class} function checkNamespaceURI(string_: JString): JString; cdecl;
    {class} function checkProcessingInstructionData(string_: JString): JString; cdecl;
    {class} function checkProcessingInstructionTarget(string_: JString): JString; cdecl;
    {class} function checkPublicID(string_: JString): JString; cdecl;
    {class} function checkSystemLiteral(string_: JString): JString; cdecl;
    {class} function checkURI(string_: JString): JString; cdecl;
    {class} function checkXMLName(string_: JString): JString; cdecl;
    {class} function decodeSurrogatePair(c: Char; c1: Char): Integer; cdecl;
    {class} function isAllXMLWhitespace(string_: JString): Boolean; cdecl;
    {class} function isHexDigit(c: Char): Boolean; cdecl;
    {class} function isHighSurrogate(c: Char): Boolean; cdecl;
    {class} function isLowSurrogate(c: Char): Boolean; cdecl;
    {class} function isURICharacter(c: Char): Boolean; cdecl;
    {class} function isXMLCharacter(i: Integer): Boolean; cdecl;
    {class} function isXMLCombiningChar(c: Char): Boolean; cdecl;
    {class} function isXMLDigit(c: Char): Boolean; cdecl;
    {class} function isXMLExtender(c: Char): Boolean; cdecl;
    {class} function isXMLLetter(c: Char): Boolean; cdecl;
    {class} function isXMLLetterOrDigit(c: Char): Boolean; cdecl;
    {class} function isXMLNameCharacter(c: Char): Boolean; cdecl;
    {class} function isXMLNameStartCharacter(c: Char): Boolean; cdecl;
    {class} function isXMLPublicIDCharacter(c: Char): Boolean; cdecl;
    {class} function isXMLWhitespace(c: Char): Boolean; cdecl;
  end;

  [JavaSignature('org/jdom2/Verifier')]
  JVerifier = interface(JObject)
    ['{D6A6AAED-2C69-47E9-9156-675BEBB8D3C1}']
  end;
  TJVerifier = class(TJavaGenericImport<JVerifierClass, JVerifier>) end;

  JDOMAdapterClass = interface(IJavaClass)
    ['{F949752E-42AD-4D63-945F-3F4791057283}']
  end;

  [JavaSignature('org/jdom2/adapters/DOMAdapter')]
  JDOMAdapter = interface(IJavaInstance)
    ['{E6322AD1-3795-4A08-BAEA-A8CDECE9B52F}']
    function createDocument: JDocument; cdecl; overload;
    function createDocument(docType: JDocType): JDocument; cdecl; overload;
  end;
  TJDOMAdapter = class(TJavaGenericImport<JDOMAdapterClass, JDOMAdapter>) end;

  JAbstractDOMAdapterClass = interface(JDOMAdapterClass)
    ['{2EBC15EB-1A59-4BF1-BF81-80FCAF3FB262}']
    {class} function init: JAbstractDOMAdapter; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/adapters/AbstractDOMAdapter')]
  JAbstractDOMAdapter = interface(JDOMAdapter)
    ['{717FF0C3-9C99-425D-A965-6F36E95CF993}']
    function createDocument(docType: JDocType): JDocument; cdecl;
  end;
  TJAbstractDOMAdapter = class(TJavaGenericImport<JAbstractDOMAdapterClass, JAbstractDOMAdapter>) end;

  JJAXPDOMAdapterClass = interface(JAbstractDOMAdapterClass)
    ['{00D82035-8E6C-4818-A656-4EC214ED8A37}']
    {class} function init: JJAXPDOMAdapter; cdecl;
  end;

  [JavaSignature('org/jdom2/adapters/JAXPDOMAdapter')]
  JJAXPDOMAdapter = interface(JAbstractDOMAdapter)
    ['{EE570826-0F44-4709-9111-A31C061283C6}']
    function createDocument: JDocument; cdecl;
  end;
  TJJAXPDOMAdapter = class(TJavaGenericImport<JJAXPDOMAdapterClass, JJAXPDOMAdapter>) end;

  Jfilter_FilterClass = interface(JSerializableClass)
    ['{54AB9488-DAFA-46F5-B999-09158F3F2F79}']
  end;

  [JavaSignature('org/jdom2/filter/Filter')]
  Jfilter_Filter = interface(JSerializable)
    ['{6B9F90B4-997A-4276-9DE1-9BBCE85B3557}']
    function &and(filter: Jfilter_Filter): Jfilter_Filter; cdecl;
    function filter(object_: JObject): JObject; cdecl; overload;
    function filter(list: JList): JList; cdecl; overload;
    function matches(object_: JObject): Boolean; cdecl;
    function negate: Jfilter_Filter; cdecl;
    function &or(filter: Jfilter_Filter): Jfilter_Filter; cdecl;
    function refine(filter: Jfilter_Filter): Jfilter_Filter; cdecl;
  end;
  TJfilter_Filter = class(TJavaGenericImport<Jfilter_FilterClass, Jfilter_Filter>) end;

  JAbstractFilterClass = interface(Jfilter_FilterClass)
    ['{6D5BF1E1-E3E1-44A8-AAD4-65994DCAB01C}']
    {class} function init: JAbstractFilter; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/filter/AbstractFilter')]
  JAbstractFilter = interface(Jfilter_Filter)
    ['{971D5D15-8C92-4539-9031-4894FA797747}']
    function &and(filter: Jfilter_Filter): Jfilter_Filter; cdecl;
    function filter(list: JList): JList; cdecl;
    function matches(object_: JObject): Boolean; cdecl;
    function negate: Jfilter_Filter; cdecl;
    function &or(filter: Jfilter_Filter): Jfilter_Filter; cdecl;
    function refine(filter: Jfilter_Filter): Jfilter_Filter; cdecl;
  end;
  TJAbstractFilter = class(TJavaGenericImport<JAbstractFilterClass, JAbstractFilter>) end;

  JAndFilterClass = interface(JAbstractFilterClass)
    ['{8E4F7CA5-BB3A-4C1D-BD6A-E291084479A0}']
    {class} function init(filter: Jfilter_Filter; filter1: Jfilter_Filter): JAndFilter; cdecl;
  end;

  [JavaSignature('org/jdom2/filter/AndFilter')]
  JAndFilter = interface(JAbstractFilter)
    ['{2676A6B7-B448-4472-9FAD-6BD6621A82D5}']
    function equals(object_: JObject): Boolean; cdecl;
    function filter(object_: JObject): JObject; cdecl;
    function hashCode: Integer; cdecl;
    function toString: JString; cdecl;
  end;
  TJAndFilter = class(TJavaGenericImport<JAndFilterClass, JAndFilter>) end;

  JAttributeFilterClass = interface(JAbstractFilterClass)
    ['{641E38B6-7809-4E47-ADB0-09753B4D0195}']
    {class} function init: JAttributeFilter; cdecl; overload;
    {class} function init(namespace: JNamespace): JAttributeFilter; cdecl; overload;
    {class} function init(string_: JString): JAttributeFilter; cdecl; overload;
    {class} function init(string_: JString; namespace: JNamespace): JAttributeFilter; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/filter/AttributeFilter')]
  JAttributeFilter = interface(JAbstractFilter)
    ['{B199CB6D-7AEF-4F3E-B71D-596C200928BF}']
    function equals(object_: JObject): Boolean; cdecl;
    function filter(object_: JObject): JAttribute; cdecl;
    function hashCode: Integer; cdecl;
  end;
  TJAttributeFilter = class(TJavaGenericImport<JAttributeFilterClass, JAttributeFilter>) end;

  JClassFilterClass = interface(JAbstractFilterClass)
    ['{490A7E44-D95B-400C-8A14-610AABED0D35}']
    {class} function init(class_: Jlang_Class): JClassFilter; cdecl;
  end;

  [JavaSignature('org/jdom2/filter/ClassFilter')]
  JClassFilter = interface(JAbstractFilter)
    ['{CC12C75B-5F73-4873-8292-B438975D8A19}']
    function equals(object_: JObject): Boolean; cdecl;
    function filter(object_: JObject): JObject; cdecl;
    function hashCode: Integer; cdecl;
    function toString: JString; cdecl;
  end;
  TJClassFilter = class(TJavaGenericImport<JClassFilterClass, JClassFilter>) end;

  JContentFilterClass = interface(JAbstractFilterClass)
    ['{22F3988C-203D-4098-BBA4-F4CC748DAA8C}']
    {class} function _GetCDATA: Integer; cdecl;
    {class} function _GetCOMMENT: Integer; cdecl;
    {class} function _GetDOCTYPE: Integer; cdecl;
    {class} function _GetDOCUMENT: Integer; cdecl;
    {class} function _GetELEMENT: Integer; cdecl;
    {class} function _GetENTITYREF: Integer; cdecl;
    {class} function _GetPI: Integer; cdecl;
    {class} function _GetTEXT: Integer; cdecl;
    {class} function init: JContentFilter; cdecl; overload;//Deprecated
    {class} function init(b: Boolean): JContentFilter; cdecl; overload;
    {class} function init(i: Integer): JContentFilter; cdecl; overload;
    {class} property CDATA: Integer read _GetCDATA;
    {class} property COMMENT: Integer read _GetCOMMENT;
    {class} property DOCTYPE: Integer read _GetDOCTYPE;
    {class} property DOCUMENT: Integer read _GetDOCUMENT;
    {class} property ELEMENT: Integer read _GetELEMENT;
    {class} property ENTITYREF: Integer read _GetENTITYREF;
    {class} property PI: Integer read _GetPI;
    {class} property TEXT: Integer read _GetTEXT;
  end;

  [JavaSignature('org/jdom2/filter/ContentFilter')]
  JContentFilter = interface(JAbstractFilter)
    ['{045BB965-DBE3-4DC2-8687-A21331F9F8F1}']
    function equals(object_: JObject): Boolean; cdecl;
    function filter(object_: JObject): JContent; cdecl;
    function getFilterMask: Integer; cdecl;
    function hashCode: Integer; cdecl;
    procedure setCDATAVisible(b: Boolean); cdecl;
    procedure setCommentVisible(b: Boolean); cdecl;
    procedure setDefaultMask; cdecl;
    procedure setDocTypeVisible(b: Boolean); cdecl;
    procedure setDocumentContent; cdecl;
    procedure setElementContent; cdecl;
    procedure setElementVisible(b: Boolean); cdecl;
    procedure setEntityRefVisible(b: Boolean); cdecl;
    procedure setFilterMask(i: Integer); cdecl;
    procedure setPIVisible(b: Boolean); cdecl;
    procedure setTextVisible(b: Boolean); cdecl;
  end;
  TJContentFilter = class(TJavaGenericImport<JContentFilterClass, JContentFilter>) end;

  JElementFilterClass = interface(JAbstractFilterClass)
    ['{3C87ECB7-B43B-4BF9-908B-0367F81C11EC}']
    {class} function init: JElementFilter; cdecl; overload;
    {class} function init(namespace: JNamespace): JElementFilter; cdecl; overload;
    {class} function init(string_: JString): JElementFilter; cdecl; overload;
    {class} function init(string_: JString; namespace: JNamespace): JElementFilter; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/filter/ElementFilter')]
  JElementFilter = interface(JAbstractFilter)
    ['{2149B055-E2A4-4F3E-AB09-B7FD016B2A35}']
    function equals(object_: JObject): Boolean; cdecl;
    function filter(object_: JObject): Jjdom2_Element; cdecl;
    function hashCode: Integer; cdecl;
    function toString: JString; cdecl;
  end;
  TJElementFilter = class(TJavaGenericImport<JElementFilterClass, JElementFilter>) end;

  Jfilter_FiltersClass = interface(JObjectClass)
    ['{AF8285F4-C9C4-40AE-AF6B-A77F13E69610}']
    {class} function attribute: Jfilter_Filter; cdecl; overload;
    {class} function attribute(namespace: JNamespace): Jfilter_Filter; cdecl; overload;
    {class} function attribute(string_: JString): Jfilter_Filter; cdecl; overload;
    {class} function attribute(string_: JString; namespace: JNamespace): Jfilter_Filter; cdecl; overload;
    {class} function cdata: Jfilter_Filter; cdecl;
    {class} function comment: Jfilter_Filter; cdecl;
    {class} function content: Jfilter_Filter; cdecl;
    {class} function doctype: Jfilter_Filter; cdecl;
    {class} function document: Jfilter_Filter; cdecl;
    {class} function element: Jfilter_Filter; cdecl; overload;
    {class} function element(namespace: JNamespace): Jfilter_Filter; cdecl; overload;
    {class} function element(string_: JString): Jfilter_Filter; cdecl; overload;
    {class} function element(string_: JString; namespace: JNamespace): Jfilter_Filter; cdecl; overload;
    {class} function entityref: Jfilter_Filter; cdecl;
    {class} function fboolean: Jfilter_Filter; cdecl;
    {class} function fclass(class_: Jlang_Class): Jfilter_Filter; cdecl;
    {class} function fdouble: Jfilter_Filter; cdecl;
    {class} function fpassthrough: Jfilter_Filter; cdecl;
    {class} function fstring: Jfilter_Filter; cdecl;
    {class} function processinginstruction: Jfilter_Filter; cdecl;
    {class} function text: Jfilter_Filter; cdecl;
    {class} function textOnly: Jfilter_Filter; cdecl;
  end;

  [JavaSignature('org/jdom2/filter/Filters')]
  Jfilter_Filters = interface(JObject)
    ['{13F28C87-CA09-4622-A8F2-425B3751B8E3}']
  end;
  TJfilter_Filters = class(TJavaGenericImport<Jfilter_FiltersClass, Jfilter_Filters>) end;

  JNegateFilterClass = interface(JAbstractFilterClass)
    ['{660BE31D-FCB8-4DB1-8954-73EC22A41A98}']
    {class} function init(filter: Jfilter_Filter): JNegateFilter; cdecl;
  end;

  [JavaSignature('org/jdom2/filter/NegateFilter')]
  JNegateFilter = interface(JAbstractFilter)
    ['{A7D6955C-F8E0-4FD1-97DE-DE2FAFA72D99}']
    function equals(object_: JObject): Boolean; cdecl;
    function filter(object_: JObject): JObject; cdecl;
    function hashCode: Integer; cdecl;
    function toString: JString; cdecl;
  end;
  TJNegateFilter = class(TJavaGenericImport<JNegateFilterClass, JNegateFilter>) end;

  JOrFilterClass = interface(JAbstractFilterClass)
    ['{44F3536F-8E38-4378-BB6D-9D45283F21BA}']
    {class} function init(filter: Jfilter_Filter; filter1: Jfilter_Filter): JOrFilter; cdecl;
  end;

  [JavaSignature('org/jdom2/filter/OrFilter')]
  JOrFilter = interface(JAbstractFilter)
    ['{952517FE-39FA-4A59-9A8D-4B37D77AF9E5}']
    function equals(object_: JObject): Boolean; cdecl;
    function filter(object_: JObject): JContent; cdecl;
    function hashCode: Integer; cdecl;
    function toString: JString; cdecl;
  end;
  TJOrFilter = class(TJavaGenericImport<JOrFilterClass, JOrFilter>) end;

  JPassThroughFilterClass = interface(JAbstractFilterClass)
    ['{7A92E42F-359E-47B0-907C-4899B4C0D5AF}']
  end;

  [JavaSignature('org/jdom2/filter/PassThroughFilter')]
  JPassThroughFilter = interface(JAbstractFilter)
    ['{E26D630A-9933-4EEE-81F7-BE1C9BBEEFB5}']
    function filter(list: JList): JList; cdecl; overload;
    function filter(object_: JObject): JObject; cdecl; overload;
  end;
  TJPassThroughFilter = class(TJavaGenericImport<JPassThroughFilterClass, JPassThroughFilter>) end;

  JTextOnlyFilterClass = interface(JAbstractFilterClass)
    ['{DD6394D2-1092-4578-92C1-D3265BE21B8C}']
  end;

  [JavaSignature('org/jdom2/filter/TextOnlyFilter')]
  JTextOnlyFilter = interface(JAbstractFilter)
    ['{5806994B-2343-46E0-9C97-30F7052270F5}']
    function equals(object_: JObject): Boolean; cdecl;
    function filter(object_: JObject): Jjdom2_Text; cdecl;
    function hashCode: Integer; cdecl;
  end;
  TJTextOnlyFilter = class(TJavaGenericImport<JTextOnlyFilterClass, JTextOnlyFilter>) end;

  JDOMBuilderClass = interface(JObjectClass)
    ['{36D57B66-BB07-4792-B1F5-8CF636D7AFC1}']
    {class} function init: JDOMBuilder; cdecl;
  end;

  [JavaSignature('org/jdom2/input/DOMBuilder')]
  JDOMBuilder = interface(JObject)
    ['{BBF2A8F0-D242-499F-BBBC-75EF09EA1F4A}']
    function build(text: JText): Jjdom2_Text; cdecl; overload;
    function build(comment: JComment): Jjdom2_Comment; cdecl; overload;
    function build(processingInstruction: JProcessingInstruction): Jjdom2_ProcessingInstruction; cdecl; overload;
    function build(entityReference: JEntityReference): JEntityRef; cdecl; overload;
    function build(documentType: JDocumentType): JDocType; cdecl; overload;
    function build(cDATASection: JCDATASection): JCDATA; cdecl; overload;
    function build(element: JElement): Jjdom2_Element; cdecl; overload;
    function build(document: JDocument): Jjdom2_Document; cdecl; overload;
    function getFactory: JJDOMFactory; cdecl;
    procedure setFactory(jDOMFactory: JJDOMFactory); cdecl;
  end;
  TJDOMBuilder = class(TJavaGenericImport<JDOMBuilderClass, JDOMBuilder>) end;

  JJDOMParseExceptionClass = interface(JJDOMExceptionClass)
    ['{82A56B51-F05D-4B39-A55E-8B30BAA21367}']
    {class} function init(string_: JString; throwable: JThrowable): JJDOMParseException; cdecl; overload;
    {class} function init(string_: JString; throwable: JThrowable; document: Jjdom2_Document): JJDOMParseException; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/input/JDOMParseException')]
  JJDOMParseException = interface(JJDOMException)
    ['{E4E90E3C-BD3D-417D-AB70-AD142A573F3B}']
    function getColumnNumber: Integer; cdecl;
    function getLineNumber: Integer; cdecl;
    function getPartialDocument: Jjdom2_Document; cdecl;
    function getPublicId: JString; cdecl;
    function getSystemId: JString; cdecl;
  end;
  TJJDOMParseException = class(TJavaGenericImport<JJDOMParseExceptionClass, JJDOMParseException>) end;

  JSAXEngineClass = interface(IJavaClass)
    ['{FDF218AA-843F-4CDF-9C48-40BD71CE7B86}']
  end;

  [JavaSignature('org/jdom2/input/sax/SAXEngine')]
  JSAXEngine = interface(IJavaInstance)
    ['{8376DDAD-2A88-4B40-9880-ED01CE3A8D92}']
    function build(reader: JReader): Jjdom2_Document; cdecl; overload;
    function build(uRL: JURL): Jjdom2_Document; cdecl; overload;
    function build(inputSource: JInputSource): Jjdom2_Document; cdecl; overload;
    function build(inputStream: JInputStream): Jjdom2_Document; cdecl; overload;
    function build(file_: JFile): Jjdom2_Document; cdecl; overload;
    function build(string_: JString): Jjdom2_Document; cdecl; overload;
    function build(reader: JReader; string_: JString): Jjdom2_Document; cdecl; overload;
    function build(inputStream: JInputStream; string_: JString): Jjdom2_Document; cdecl; overload;
    function getDTDHandler: JDTDHandler; cdecl;
    function getEntityResolver: JEntityResolver; cdecl;
    function getErrorHandler: JErrorHandler; cdecl;
    function getExpandEntities: Boolean; cdecl;
    function getIgnoringBoundaryWhitespace: Boolean; cdecl;
    function getIgnoringElementContentWhitespace: Boolean; cdecl;
    function getJDOMFactory: JJDOMFactory; cdecl;
    function isValidating: Boolean; cdecl;
  end;
  TJSAXEngine = class(TJavaGenericImport<JSAXEngineClass, JSAXEngine>) end;

  JSAXBuilderClass = interface(JSAXEngineClass)
    ['{57289636-6E6A-42BB-A3C7-4AB4ECBC61BC}']
    {class} function init: JSAXBuilder; cdecl; overload;//Deprecated
    {class} function init(string_: JString): JSAXBuilder; cdecl; overload;
    {class} function init(xMLReaderJDOMFactory: JXMLReaderJDOMFactory): JSAXBuilder; cdecl; overload;
    {class} function init(b: Boolean): JSAXBuilder; cdecl; overload;
    {class} function init(string_: JString; b: Boolean): JSAXBuilder; cdecl; overload;
    {class} function init(xMLReaderJDOMFactory: JXMLReaderJDOMFactory; sAXHandlerFactory: JSAXHandlerFactory; jDOMFactory: JJDOMFactory): JSAXBuilder; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/input/SAXBuilder')]
  JSAXBuilder = interface(JSAXEngine)
    ['{68A5DB46-28A9-4E87-868D-6F914498FEB8}']
    function build(inputSource: JInputSource): Jjdom2_Document; cdecl; overload;
    function build(reader: JReader): Jjdom2_Document; cdecl; overload;
    function build(string_: JString): Jjdom2_Document; cdecl; overload;
    function build(inputStream: JInputStream): Jjdom2_Document; cdecl; overload;
    function build(file_: JFile): Jjdom2_Document; cdecl; overload;
    function build(uRL: JURL): Jjdom2_Document; cdecl; overload;
    function build(reader: JReader; string_: JString): Jjdom2_Document; cdecl; overload;
    function build(inputStream: JInputStream; string_: JString): Jjdom2_Document; cdecl; overload;
    function buildEngine: JSAXEngine; cdecl;
    function getDTDHandler: JDTDHandler; cdecl;
    function getDriverClass: JString; cdecl;
    function getEntityResolver: JEntityResolver; cdecl;
    function getErrorHandler: JErrorHandler; cdecl;
    function getExpandEntities: Boolean; cdecl;
    function getFactory: JJDOMFactory; cdecl;
    function getIgnoringBoundaryWhitespace: Boolean; cdecl;
    function getIgnoringElementContentWhitespace: Boolean; cdecl;
    function getJDOMFactory: JJDOMFactory; cdecl;
    function getReuseParser: Boolean; cdecl;
    function getSAXHandlerFactory: JSAXHandlerFactory; cdecl;
    function getValidation: Boolean; cdecl;
    function getXMLFilter: JXMLFilter; cdecl;
    function getXMLReaderFactory: JXMLReaderJDOMFactory; cdecl;
    function isValidating: Boolean; cdecl;
    procedure setDTDHandler(dTDHandler: JDTDHandler); cdecl;
    procedure setEntityResolver(entityResolver: JEntityResolver); cdecl;
    procedure setErrorHandler(errorHandler: JErrorHandler); cdecl;
    procedure setExpandEntities(b: Boolean); cdecl;
    procedure setFactory(jDOMFactory: JJDOMFactory); cdecl;
    procedure setFastReconfigure(b: Boolean); cdecl;
    procedure setFeature(string_: JString; b: Boolean); cdecl;
    procedure setIgnoringBoundaryWhitespace(b: Boolean); cdecl;
    procedure setIgnoringElementContentWhitespace(b: Boolean); cdecl;
    procedure setJDOMFactory(jDOMFactory: JJDOMFactory); cdecl;
    procedure setProperty(string_: JString; object_: JObject); cdecl;
    procedure setReuseParser(b: Boolean); cdecl;
    procedure setSAXHandlerFactory(sAXHandlerFactory: JSAXHandlerFactory); cdecl;
    procedure setValidation(b: Boolean); cdecl;
    procedure setXMLFilter(xMLFilter: JXMLFilter); cdecl;
    procedure setXMLReaderFactory(xMLReaderJDOMFactory: JXMLReaderJDOMFactory); cdecl;
  end;
  TJSAXBuilder = class(TJavaGenericImport<JSAXBuilderClass, JSAXBuilder>) end;

  JStAXEventBuilderClass = interface(JObjectClass)
    ['{776B8637-8582-456E-B4DE-E93636213A86}']
    {class} function init: JStAXEventBuilder; cdecl;
  end;

  [JavaSignature('org/jdom2/input/StAXEventBuilder')]
  JStAXEventBuilder = interface(JObject)
    ['{6E23A0C0-2360-460F-BF0D-04782CDEDDBC}']
    //function build(xMLEventReader: JXMLEventReader): Jjdom2_Document; cdecl;
    function getFactory: JJDOMFactory; cdecl;
    procedure setFactory(jDOMFactory: JJDOMFactory); cdecl;
  end;
  TJStAXEventBuilder = class(TJavaGenericImport<JStAXEventBuilderClass, JStAXEventBuilder>) end;

  JStAXStreamBuilderClass = interface(JObjectClass)
    ['{3EFA5ED6-6697-4DE7-8F51-BE10D4C97461}']
    {class} function init: JStAXStreamBuilder; cdecl;
  end;

  [JavaSignature('org/jdom2/input/StAXStreamBuilder')]
  JStAXStreamBuilder = interface(JObject)
    ['{3D9CE1E3-79C4-4F1F-BE92-234C07D265CE}']
    //function build(xMLStreamReader: JXMLStreamReader): Jjdom2_Document; cdecl;
    //function buildFragments(xMLStreamReader: JXMLStreamReader; stAXFilter: JStAXFilter): JList; cdecl;
    //function fragment(xMLStreamReader: JXMLStreamReader): JContent; cdecl;
    function getFactory: JJDOMFactory; cdecl;
    procedure setFactory(jDOMFactory: JJDOMFactory); cdecl;
  end;
  TJStAXStreamBuilder = class(TJavaGenericImport<JStAXStreamBuilderClass, JStAXStreamBuilder>) end;

  JXMLReaderJDOMFactoryClass = interface(IJavaClass)
    ['{1F905A54-DD5E-4607-967F-0185F415621A}']
  end;

  [JavaSignature('org/jdom2/input/sax/XMLReaderJDOMFactory')]
  JXMLReaderJDOMFactory = interface(IJavaInstance)
    ['{BAB26614-DE83-43BD-8C91-047A91CE8C16}']
    function createXMLReader: JXMLReader; cdecl;
    function isValidating: Boolean; cdecl;
  end;
  TJXMLReaderJDOMFactory = class(TJavaGenericImport<JXMLReaderJDOMFactoryClass, JXMLReaderJDOMFactory>) end;

  JAbstractReaderSchemaFactoryClass = interface(JXMLReaderJDOMFactoryClass)
    ['{4284A15D-EB31-4431-80D2-11C6F0CC2035}']
    {class} function init(sAXParserFactory: JSAXParserFactory; schema: JSchema): JAbstractReaderSchemaFactory; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/input/sax/AbstractReaderSchemaFactory')]
  JAbstractReaderSchemaFactory = interface(JXMLReaderJDOMFactory)
    ['{E2F5825E-EEE4-4BB8-AECF-4D0C8E6C57F0}']
    function createXMLReader: JXMLReader; cdecl;
    function isValidating: Boolean; cdecl;
  end;
  TJAbstractReaderSchemaFactory = class(TJavaGenericImport<JAbstractReaderSchemaFactoryClass, JAbstractReaderSchemaFactory>) end;

  JAbstractReaderXSDFactoryClass = interface(JAbstractReaderSchemaFactoryClass)
    ['{CECA9B14-9B56-4FC6-B3C9-EB9281CFC742}']
  end;

  [JavaSignature('org/jdom2/input/sax/AbstractReaderXSDFactory')]
  JAbstractReaderXSDFactory = interface(JAbstractReaderSchemaFactory)
    ['{C80446BB-48F6-435C-A561-D68227F5B2EC}']
  end;
  TJAbstractReaderXSDFactory = class(TJavaGenericImport<JAbstractReaderXSDFactoryClass, JAbstractReaderXSDFactory>) end;

  JAbstractReaderXSDFactory_SchemaFactoryProviderClass = interface(IJavaClass)
    ['{295CA7E5-4573-46F9-BE43-97CFE5EC6C62}']
  end;

  [JavaSignature('org/jdom2/input/sax/AbstractReaderXSDFactory$SchemaFactoryProvider')]
  JAbstractReaderXSDFactory_SchemaFactoryProvider = interface(IJavaInstance)
    ['{9FB53898-4FE1-422D-A9F7-ADB471D26B45}']
    function getSchemaFactory: JSchemaFactory; cdecl;
  end;
  TJAbstractReaderXSDFactory_SchemaFactoryProvider = class(TJavaGenericImport<JAbstractReaderXSDFactory_SchemaFactoryProviderClass, JAbstractReaderXSDFactory_SchemaFactoryProvider>) end;

  JErrorHandlerClass = interface(IJavaClass)
    ['{B8997CA0-3875-4E76-9D55-B1C2C38749FC}']
    {class} procedure error(exception: JSAXParseException); cdecl;
    {class} procedure fatalError(exception: JSAXParseException); cdecl;
    {class} procedure warning(exception: JSAXParseException); cdecl;
  end;

  [JavaSignature('org/xml/sax/ErrorHandler')]
  JErrorHandler = interface(IJavaInstance)
    ['{D89801A6-E0B3-4195-B82F-165E19B4F6B9}']
  end;
  TJErrorHandler = class(TJavaGenericImport<JErrorHandlerClass, JErrorHandler>) end;

  JBuilderErrorHandlerClass = interface(JErrorHandlerClass)
    ['{E09E6F39-9541-429E-B0E2-427AB207A34E}']
    {class} function init: JBuilderErrorHandler; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/input/sax/BuilderErrorHandler')]
  JBuilderErrorHandler = interface(JErrorHandler)
    ['{597BA2D5-1D9D-4E7D-AAD0-7BCF0E97180C}']
    procedure error(sAXParseException: JSAXParseException); cdecl;
    procedure fatalError(sAXParseException: JSAXParseException); cdecl;
    procedure warning(sAXParseException: JSAXParseException); cdecl;
  end;
  TJBuilderErrorHandler = class(TJavaGenericImport<JBuilderErrorHandlerClass, JBuilderErrorHandler>) end;

  JSAXHandlerFactoryClass = interface(IJavaClass)
    ['{C2248BD3-E312-4D6D-A58C-A3A2596CC1BE}']
  end;

  [JavaSignature('org/jdom2/input/sax/SAXHandlerFactory')]
  JSAXHandlerFactory = interface(IJavaInstance)
    ['{FD5DADE2-607E-428E-BD94-2E89B8E4961C}']
    function createSAXHandler(jDOMFactory: JJDOMFactory): JSAXHandler; cdecl;
  end;
  TJSAXHandlerFactory = class(TJavaGenericImport<JSAXHandlerFactoryClass, JSAXHandlerFactory>) end;

  JDefaultSAXHandlerFactoryClass = interface(JSAXHandlerFactoryClass)
    ['{D3EC5B24-1E2C-4047-BEC2-775F1A7FB9ED}']
    {class} function init: JDefaultSAXHandlerFactory; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/input/sax/DefaultSAXHandlerFactory')]
  JDefaultSAXHandlerFactory = interface(JSAXHandlerFactory)
    ['{85CC66B5-0859-4254-AC56-D17DD3DE8B7F}']
    function createSAXHandler(jDOMFactory: JJDOMFactory): JSAXHandler; cdecl;
  end;
  TJDefaultSAXHandlerFactory = class(TJavaGenericImport<JDefaultSAXHandlerFactoryClass, JDefaultSAXHandlerFactory>) end;

  JDefaultHandlerClass = interface(JObjectClass)
    ['{6124B23B-4C45-40DB-B122-422EEE001E9F}']
    {class} function init: JDefaultHandler; cdecl;
    {class} procedure endDocument; cdecl;//Deprecated
    {class} procedure endElement(uri: JString; localName: JString; qName: JString); cdecl;//Deprecated
    {class} procedure endPrefixMapping(prefix: JString); cdecl;//Deprecated
    {class} procedure notationDecl(name: JString; publicId: JString; systemId: JString); cdecl;//Deprecated
    {class} procedure processingInstruction(target: JString; data: JString); cdecl;//Deprecated
    {class} function resolveEntity(publicId: JString; systemId: JString): JInputSource; cdecl;//Deprecated
    {class} procedure startElement(uri: JString; localName: JString; qName: JString; attributes: JAttributes); cdecl;//Deprecated
    {class} procedure startPrefixMapping(prefix: JString; uri: JString); cdecl;//Deprecated
    {class} procedure unparsedEntityDecl(name: JString; publicId: JString; systemId: JString; notationName: JString); cdecl;//Deprecated
  end;

  [JavaSignature('org/xml/sax/helpers/DefaultHandler')]
  JDefaultHandler = interface(JObject)
    ['{C366A349-8EC6-4063-95A5-EE381F5A47C7}']
    procedure characters(ch: TJavaArray<Char>; start: Integer; length: Integer); cdecl;//Deprecated
    procedure error(e: JSAXParseException); cdecl;//Deprecated
    procedure fatalError(e: JSAXParseException); cdecl;//Deprecated
    procedure ignorableWhitespace(ch: TJavaArray<Char>; start: Integer; length: Integer); cdecl;//Deprecated
    procedure setDocumentLocator(locator: JLocator); cdecl;//Deprecated
    procedure skippedEntity(name: JString); cdecl;//Deprecated
    procedure startDocument; cdecl;//Deprecated
    procedure warning(e: JSAXParseException); cdecl;//Deprecated
  end;
  TJDefaultHandler = class(TJavaGenericImport<JDefaultHandlerClass, JDefaultHandler>) end;

  JSAXHandlerClass = interface(JDefaultHandlerClass)
    ['{D78BF1CC-39F4-42F4-BA8E-B58839C6289C}']
    {class} function init: JSAXHandler; cdecl; overload;//Deprecated
    {class} function init(jDOMFactory: JJDOMFactory): JSAXHandler; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/input/sax/SAXHandler')]
  JSAXHandler = interface(JDefaultHandler)
    ['{4EB83C6E-5E12-4E42-BA08-D4E1853EDCDE}']
    procedure attributeDecl(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString); cdecl;
    procedure characters(c: TJavaArray<Char>; i: Integer; i1: Integer); cdecl;
    procedure comment(c: TJavaArray<Char>; i: Integer; i1: Integer); cdecl;
    procedure elementDecl(string_: JString; string_1: JString); cdecl;
    procedure endCDATA; cdecl;
    procedure endDTD; cdecl;
    procedure endElement(string_: JString; string_1: JString; string_2: JString); cdecl;
    procedure endEntity(string_: JString); cdecl;
    procedure externalEntityDecl(string_: JString; string_1: JString; string_2: JString); cdecl;
    function getCurrentElement: Jjdom2_Element; cdecl;
    function getDocument: Jjdom2_Document; cdecl;
    function getDocumentLocator: JLocator; cdecl;
    function getExpandEntities: Boolean; cdecl;
    function getFactory: JJDOMFactory; cdecl;
    function getIgnoringBoundaryWhitespace: Boolean; cdecl;
    function getIgnoringElementContentWhitespace: Boolean; cdecl;
    procedure ignorableWhitespace(c: TJavaArray<Char>; i: Integer; i1: Integer); cdecl;
    procedure internalEntityDecl(string_: JString; string_1: JString); cdecl;
    procedure notationDecl(string_: JString; string_1: JString; string_2: JString); cdecl;
    procedure processingInstruction(string_: JString; string_1: JString); cdecl;
    procedure reset; cdecl;
    procedure setDocumentLocator(locator: JLocator); cdecl;
    procedure setExpandEntities(b: Boolean); cdecl;
    procedure setIgnoringBoundaryWhitespace(b: Boolean); cdecl;
    procedure setIgnoringElementContentWhitespace(b: Boolean); cdecl;
    procedure skippedEntity(string_: JString); cdecl;
    procedure startCDATA; cdecl;
    procedure startDTD(string_: JString; string_1: JString; string_2: JString); cdecl;
    procedure startDocument; cdecl;
    procedure startElement(string_: JString; string_1: JString; string_2: JString; attributes: JAttributes); cdecl;
    procedure startEntity(string_: JString); cdecl;
    procedure startPrefixMapping(string_: JString; string_1: JString); cdecl;
    procedure unparsedEntityDecl(string_: JString; string_1: JString; string_2: JString; string_3: JString); cdecl;
  end;
  TJSAXHandler = class(TJavaGenericImport<JSAXHandlerClass, JSAXHandler>) end;

  JDefaultSAXHandlerFactory_DefaultSAXHandlerClass = interface(JSAXHandlerClass)
    ['{7CA71064-9ED9-4303-B8E1-D95953AF561C}']
    {class} function init(jDOMFactory: JJDOMFactory): JDefaultSAXHandlerFactory_DefaultSAXHandler; cdecl;
  end;

  [JavaSignature('org/jdom2/input/sax/DefaultSAXHandlerFactory$DefaultSAXHandler')]
  JDefaultSAXHandlerFactory_DefaultSAXHandler = interface(JSAXHandler)
    ['{632752C8-95A6-440C-B9FC-7CF604AC7D8D}']
  end;
  TJDefaultSAXHandlerFactory_DefaultSAXHandler = class(TJavaGenericImport<JDefaultSAXHandlerFactory_DefaultSAXHandlerClass, JDefaultSAXHandlerFactory_DefaultSAXHandler>) end;

  JSAXBuilderEngineClass = interface(JSAXEngineClass)
    ['{929E753C-ECF7-4196-9885-53C09E0267D5}']
    {class} function init(xMLReader: JXMLReader; sAXHandler: JSAXHandler; b: Boolean): JSAXBuilderEngine; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/input/sax/SAXBuilderEngine')]
  JSAXBuilderEngine = interface(JSAXEngine)
    ['{9FB5AE60-9DDC-419D-A7A4-00CA4423FDF4}']
    function build(inputSource: JInputSource): Jjdom2_Document; cdecl; overload;
    function build(file_: JFile): Jjdom2_Document; cdecl; overload;
    function build(uRL: JURL): Jjdom2_Document; cdecl; overload;
    function build(inputStream: JInputStream): Jjdom2_Document; cdecl; overload;
    function build(reader: JReader): Jjdom2_Document; cdecl; overload;
    function build(string_: JString): Jjdom2_Document; cdecl; overload;
    function build(inputStream: JInputStream; string_: JString): Jjdom2_Document; cdecl; overload;
    function build(reader: JReader; string_: JString): Jjdom2_Document; cdecl; overload;
    function getDTDHandler: JDTDHandler; cdecl;
    function getEntityResolver: JEntityResolver; cdecl;
    function getErrorHandler: JErrorHandler; cdecl;
    function getExpandEntities: Boolean; cdecl;
    function getIgnoringBoundaryWhitespace: Boolean; cdecl;
    function getIgnoringElementContentWhitespace: Boolean; cdecl;
    function getJDOMFactory: JJDOMFactory; cdecl;
    function isValidating: Boolean; cdecl;
  end;
  TJSAXBuilderEngine = class(TJavaGenericImport<JSAXBuilderEngineClass, JSAXBuilderEngine>) end;

  JTextBufferClass = interface(JObjectClass)
    ['{648566B8-013A-47AF-8A34-01269A17CB34}']
  end;

  [JavaSignature('org/jdom2/input/sax/TextBuffer')]
  JTextBuffer = interface(JObject)
    ['{12C40CFF-3E10-407C-8407-70EB5AC372DD}']
    function toString: JString; cdecl;
  end;
  TJTextBuffer = class(TJavaGenericImport<JTextBufferClass, JTextBuffer>) end;

  JXMLReaderJAXPFactoryClass = interface(JXMLReaderJDOMFactoryClass)
    ['{EC1CD84B-E211-407A-BD41-E5498D8DFC4C}']
    {class} function init(string_: JString; classLoader: JClassLoader; b: Boolean): JXMLReaderJAXPFactory; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/input/sax/XMLReaderJAXPFactory')]
  JXMLReaderJAXPFactory = interface(JXMLReaderJDOMFactory)
    ['{C0E5B2DB-4D51-40CA-AA77-5C6C31FC3EDF}']
    function createXMLReader: JXMLReader; cdecl;
    function isValidating: Boolean; cdecl;
  end;
  TJXMLReaderJAXPFactory = class(TJavaGenericImport<JXMLReaderJAXPFactoryClass, JXMLReaderJAXPFactory>) end;

  JXMLReaderSAX2FactoryClass = interface(JXMLReaderJDOMFactoryClass)
    ['{55BB6EB7-923E-4A86-AB27-CB479940421C}']
    {class} function init(b: Boolean): JXMLReaderSAX2Factory; cdecl; overload;//Deprecated
    {class} function init(b: Boolean; string_: JString): JXMLReaderSAX2Factory; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/input/sax/XMLReaderSAX2Factory')]
  JXMLReaderSAX2Factory = interface(JXMLReaderJDOMFactory)
    ['{EBFD29B9-1C98-437B-BCDA-A73D39FEAE83}']
    function createXMLReader: JXMLReader; cdecl;
    function getDriverClassName: JString; cdecl;
    function isValidating: Boolean; cdecl;
  end;
  TJXMLReaderSAX2Factory = class(TJavaGenericImport<JXMLReaderSAX2FactoryClass, JXMLReaderSAX2Factory>) end;

  JXMLReaderSchemaFactoryClass = interface(JAbstractReaderSchemaFactoryClass)
    ['{4AAE396A-FBEF-4AB0-92DB-2B552307D8BC}']
    {class} function init(schema: JSchema): JXMLReaderSchemaFactory; cdecl; overload;
    {class} function init(string_: JString; classLoader: JClassLoader; schema: JSchema): JXMLReaderSchemaFactory; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/input/sax/XMLReaderSchemaFactory')]
  JXMLReaderSchemaFactory = interface(JAbstractReaderSchemaFactory)
    ['{F970BDBE-09FA-4D3A-9E9B-81878F265CD4}']
  end;
  TJXMLReaderSchemaFactory = class(TJavaGenericImport<JXMLReaderSchemaFactoryClass, JXMLReaderSchemaFactory>) end;

  JXMLReaderXSDFactoryClass = interface(JAbstractReaderXSDFactoryClass)
    ['{F24AFEFB-DFEE-4AD8-B11D-973A8BB13D17}']
  end;

  [JavaSignature('org/jdom2/input/sax/XMLReaderXSDFactory')]
  JXMLReaderXSDFactory = interface(JAbstractReaderXSDFactory)
    ['{62B0B7F9-F30A-4071-94A6-3FA583490C36}']
  end;
  TJXMLReaderXSDFactory = class(TJavaGenericImport<JXMLReaderXSDFactoryClass, JXMLReaderXSDFactory>) end;

  JXMLReaderXSDFactory_1Class = interface(JAbstractReaderXSDFactory_SchemaFactoryProviderClass)
    ['{B33EE326-CED9-4897-92B1-E478295436A5}']
    {class} function init: JXMLReaderXSDFactory_1; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/input/sax/XMLReaderXSDFactory$1')]
  JXMLReaderXSDFactory_1 = interface(JAbstractReaderXSDFactory_SchemaFactoryProvider)
    ['{7AE4D050-5A6C-4B07-B196-243FC025EF7F}']
    function getSchemaFactory: JSchemaFactory; cdecl;
  end;
  TJXMLReaderXSDFactory_1 = class(TJavaGenericImport<JXMLReaderXSDFactory_1Class, JXMLReaderXSDFactory_1>) end;

  JXMLReadersClass = interface(JEnumClass)
    ['{FE7FFE87-67CF-40FF-B9FB-6DD1B702942E}']
    {class} function _GetDTDVALIDATING: JXMLReaders; cdecl;
    {class} function _GetNONVALIDATING: JXMLReaders; cdecl;
    {class} function _GetXSDVALIDATING: JXMLReaders; cdecl;
    {class} function valueOf(string_: JString): JXMLReaders; cdecl;
    {class} function values: TJavaObjectArray<JXMLReaders>; cdecl;//Deprecated
    {class} property DTDVALIDATING: JXMLReaders read _GetDTDVALIDATING;
    {class} property NONVALIDATING: JXMLReaders read _GetNONVALIDATING;
    {class} property XSDVALIDATING: JXMLReaders read _GetXSDVALIDATING;
  end;

  [JavaSignature('org/jdom2/input/sax/XMLReaders')]
  JXMLReaders = interface(JEnum)
    ['{A7C0E413-C0EF-4D8B-B810-F9A45365B08B}']
    function createXMLReader: JXMLReader; cdecl;
    function isValidating: Boolean; cdecl;
  end;
  TJXMLReaders = class(TJavaGenericImport<JXMLReadersClass, JXMLReaders>) end;

  JXMLReaders_DTDSingletonClass = interface(JEnumClass)
    ['{8DCB83CF-9C85-454A-ADBA-85D849F14DD9}']
    {class} function _GetINSTANCE: JXMLReaders_DTDSingleton; cdecl;
    {class} function valueOf(string_: JString): JXMLReaders_DTDSingleton; cdecl;
    {class} function values: TJavaObjectArray<JXMLReaders_DTDSingleton>; cdecl;
    {class} property INSTANCE: JXMLReaders_DTDSingleton read _GetINSTANCE;
  end;

  [JavaSignature('org/jdom2/input/sax/XMLReaders$DTDSingleton')]
  JXMLReaders_DTDSingleton = interface(JEnum)
    ['{0702EA8E-C844-402A-B3AE-44419D309EEC}']
    function supply: JSAXParserFactory; cdecl;
    function validates: Boolean; cdecl;
  end;
  TJXMLReaders_DTDSingleton = class(TJavaGenericImport<JXMLReaders_DTDSingletonClass, JXMLReaders_DTDSingleton>) end;

  JXMLReaders_FactorySupplierClass = interface(IJavaClass)
    ['{944DD812-5C82-4621-B78D-C2CBDAD49E2F}']
  end;

  [JavaSignature('org/jdom2/input/sax/XMLReaders$FactorySupplier')]
  JXMLReaders_FactorySupplier = interface(IJavaInstance)
    ['{E9A59DA8-0150-477E-AA8E-35FBAC4B381A}']
    function supply: JSAXParserFactory; cdecl;
    function validates: Boolean; cdecl;
  end;
  TJXMLReaders_FactorySupplier = class(TJavaGenericImport<JXMLReaders_FactorySupplierClass, JXMLReaders_FactorySupplier>) end;

  JXMLReaders_NONSingletonClass = interface(JEnumClass)
    ['{8E49CA9C-198B-499D-B18C-435ACC2073B9}']
    {class} function _GetINSTANCE: JXMLReaders_NONSingleton; cdecl;
    {class} function valueOf(string_: JString): JXMLReaders_NONSingleton; cdecl;
    {class} function values: TJavaObjectArray<JXMLReaders_NONSingleton>; cdecl;
    {class} property INSTANCE: JXMLReaders_NONSingleton read _GetINSTANCE;
  end;

  [JavaSignature('org/jdom2/input/sax/XMLReaders$NONSingleton')]
  JXMLReaders_NONSingleton = interface(JEnum)
    ['{1A89126D-D01D-4D41-B505-DB90788DA81F}']
    function supply: JSAXParserFactory; cdecl;
    function validates: Boolean; cdecl;
  end;
  TJXMLReaders_NONSingleton = class(TJavaGenericImport<JXMLReaders_NONSingletonClass, JXMLReaders_NONSingleton>) end;

  JXMLReaders_XSDSingletonClass = interface(JEnumClass)
    ['{245D881E-6EC2-489C-A110-26E7102EFFCA}']
    {class} function _GetINSTANCE: JXMLReaders_XSDSingleton; cdecl;
    {class} function valueOf(string_: JString): JXMLReaders_XSDSingleton; cdecl;
    {class} function values: TJavaObjectArray<JXMLReaders_XSDSingleton>; cdecl;
    {class} property INSTANCE: JXMLReaders_XSDSingleton read _GetINSTANCE;
  end;

  [JavaSignature('org/jdom2/input/sax/XMLReaders$XSDSingleton')]
  JXMLReaders_XSDSingleton = interface(JEnum)
    ['{8A79911C-08E9-438F-BA4E-709A61FF25A4}']
    function supply: JSAXParserFactory; cdecl;
    function validates: Boolean; cdecl;
  end;
  TJXMLReaders_XSDSingleton = class(TJavaGenericImport<JXMLReaders_XSDSingletonClass, JXMLReaders_XSDSingleton>) end;

  Jpackage_infoClass = interface(IJavaClass)
    ['{F4B8BE75-86D6-4299-A6ED-E3F596DE2B7D}']
  end;

  [JavaSignature('org/jdom2/input/sax/package-info')]
  Jpackage_info = interface(IJavaInstance)
    ['{156429B5-BE7C-4E02-80F1-522263F599D6}']
  end;
  TJpackage_info = class(TJavaGenericImport<Jpackage_infoClass, Jpackage_info>) end;

  JDTDParserClass = interface(JObjectClass)
    ['{7BBB2716-B991-44B4-AA9C-DD9FF3B01ADB}']
    {class} function parse(string_: JString; jDOMFactory: JJDOMFactory): JDocType; cdecl;
  end;

  [JavaSignature('org/jdom2/input/stax/DTDParser')]
  JDTDParser = interface(JObject)
    ['{33FC083E-3BAA-4D88-ADCB-5AA454A77285}']
  end;
  TJDTDParser = class(TJavaGenericImport<JDTDParserClass, JDTDParser>) end;

  JStAXFilterClass = interface(IJavaClass)
    ['{3B257DE5-7242-46E2-AC1B-22F9B7277302}']
  end;

  [JavaSignature('org/jdom2/input/stax/StAXFilter')]
  JStAXFilter = interface(IJavaInstance)
    ['{553ADCB1-F03A-430A-81F8-BBA8C552FCA4}']
    function includeCDATA(i: Integer; string_: JString): JString; cdecl;
    function includeComment(i: Integer; string_: JString): JString; cdecl;
    function includeDocType: Boolean; cdecl;
    function includeElement(i: Integer; string_: JString; namespace: JNamespace): Boolean; cdecl;
    function includeEntityRef(i: Integer; string_: JString): Boolean; cdecl;
    function includeProcessingInstruction(i: Integer; string_: JString): Boolean; cdecl;
    function includeText(i: Integer; string_: JString): JString; cdecl;
    function pruneCDATA(i: Integer; string_: JString): JString; cdecl;
    function pruneComment(i: Integer; string_: JString): JString; cdecl;
    function pruneElement(i: Integer; string_: JString; namespace: JNamespace): Boolean; cdecl;
    function pruneEntityRef(i: Integer; string_: JString): Boolean; cdecl;
    function pruneProcessingInstruction(i: Integer; string_: JString): Boolean; cdecl;
    function pruneText(i: Integer; string_: JString): JString; cdecl;
  end;
  TJStAXFilter = class(TJavaGenericImport<JStAXFilterClass, JStAXFilter>) end;

  JDefaultStAXFilterClass = interface(JStAXFilterClass)
    ['{90676C95-96E1-4D47-BC72-2C4018C98EA0}']
    {class} function init: JDefaultStAXFilter; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/input/stax/DefaultStAXFilter')]
  JDefaultStAXFilter = interface(JStAXFilter)
    ['{68AC86A1-8C36-43A7-93FC-F45FED8E8E74}']
    function includeCDATA(i: Integer; string_: JString): JString; cdecl;
    function includeComment(i: Integer; string_: JString): JString; cdecl;
    function includeDocType: Boolean; cdecl;
    function includeElement(i: Integer; string_: JString; namespace: JNamespace): Boolean; cdecl;
    function includeEntityRef(i: Integer; string_: JString): Boolean; cdecl;
    function includeProcessingInstruction(i: Integer; string_: JString): Boolean; cdecl;
    function includeText(i: Integer; string_: JString): JString; cdecl;
    function pruneCDATA(i: Integer; string_: JString): JString; cdecl;
    function pruneComment(i: Integer; string_: JString): JString; cdecl;
    function pruneElement(i: Integer; string_: JString; namespace: JNamespace): Boolean; cdecl;
    function pruneEntityRef(i: Integer; string_: JString): Boolean; cdecl;
    function pruneProcessingInstruction(i: Integer; string_: JString): Boolean; cdecl;
    function pruneText(i: Integer; string_: JString): JString; cdecl;
  end;
  TJDefaultStAXFilter = class(TJavaGenericImport<JDefaultStAXFilterClass, JDefaultStAXFilter>) end;

  Jstax_package_infoClass = interface(IJavaClass)
    ['{49D524FE-EDAF-49B9-B2FE-1D5552BF6851}']
  end;

  [JavaSignature('org/jdom2/input/stax/package-info')]
  Jstax_package_info = interface(IJavaInstance)
    ['{3C372167-F808-45CB-BFAB-7A8AA1DA9AA9}']
  end;
  TJstax_package_info = class(TJavaGenericImport<Jstax_package_infoClass, Jstax_package_info>) end;

  JArrayCopyClass = interface(JObjectClass)
    ['{D6D6ECF7-197F-4894-B408-4E1CCDF59962}']
    {class} function copyOf(b: TJavaArray<Boolean>; i: Integer): TJavaArray<Boolean>; cdecl; overload;
    {class} function copyOf(i: TJavaArray<Integer>; i1: Integer): TJavaArray<Integer>; cdecl; overload;
    {class} function copyOf(c: TJavaArray<Char>; i: Integer): TJavaArray<Char>; cdecl; overload;
    {class} function copyOf(object_: TJavaObjectArray<JObject>; i: Integer): TJavaObjectArray<JObject>; cdecl; overload;
    {class} function copyOfRange(object_: TJavaObjectArray<JObject>; i: Integer; i1: Integer): TJavaObjectArray<JObject>; cdecl;
  end;

  [JavaSignature('org/jdom2/internal/ArrayCopy')]
  JArrayCopy = interface(JObject)
    ['{89C456CC-F790-4F7F-B0C9-62C1DD30E05D}']
  end;
  TJArrayCopy = class(TJavaGenericImport<JArrayCopyClass, JArrayCopy>) end;

  JReflectionConstructorClass = interface(JObjectClass)
    ['{62737C91-B4A9-4A49-9869-835C17C1CE44}']
    {class} function construct(string_: JString; class_: Jlang_Class): JObject; cdecl;
    {class} function init: JReflectionConstructor; cdecl;
  end;

  [JavaSignature('org/jdom2/internal/ReflectionConstructor')]
  JReflectionConstructor = interface(JObject)
    ['{4EA00F4B-DA0D-439E-A0DE-0AC966E02B8B}']
  end;
  TJReflectionConstructor = class(TJavaGenericImport<JReflectionConstructorClass, JReflectionConstructor>) end;

  JSystemPropertyClass = interface(JObjectClass)
    ['{86A942D6-5A6D-4990-8F68-2A4CBC22EAC8}']
    {class} function &get(string_: JString; string_1: JString): JString; cdecl;
    {class} function init: JSystemProperty; cdecl;
  end;

  [JavaSignature('org/jdom2/internal/SystemProperty')]
  JSystemProperty = interface(JObject)
    ['{A1624027-D7E0-4E51-88EB-55C1027E9AED}']
  end;
  TJSystemProperty = class(TJavaGenericImport<JSystemPropertyClass, JSystemProperty>) end;

  JLocatedClass = interface(IJavaClass)
    ['{FD2B06D2-5A7D-4F9A-B8EF-43B16D5FEE7C}']
  end;

  [JavaSignature('org/jdom2/located/Located')]
  JLocated = interface(IJavaInstance)
    ['{EDE60A7D-D58E-49F9-9D90-A48172536F77}']
    function getColumn: Integer; cdecl;
    function getLine: Integer; cdecl;
    procedure setColumn(i: Integer); cdecl;
    procedure setLine(i: Integer); cdecl;
  end;
  TJLocated = class(TJavaGenericImport<JLocatedClass, JLocated>) end;

  JLocatedCDATAClass = interface(JCDATAClass)
    ['{0B81400A-0E07-4D01-A84F-9C157AA46EE7}']
    {class} function init(string_: JString): JLocatedCDATA; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/located/LocatedCDATA')]
  JLocatedCDATA = interface(JCDATA)
    ['{6569166B-DA26-4E84-BE0A-27E51AFDEFFF}']
    function getColumn: Integer; cdecl;
    function getLine: Integer; cdecl;
    procedure setColumn(i: Integer); cdecl;
    procedure setLine(i: Integer); cdecl;
  end;
  TJLocatedCDATA = class(TJavaGenericImport<JLocatedCDATAClass, JLocatedCDATA>) end;

  JLocatedCommentClass = interface(Jjdom2_CommentClass)
    ['{6C72E8A4-421C-4EF0-965C-D59DF9A56496}']
    {class} function init(string_: JString): JLocatedComment; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/located/LocatedComment')]
  JLocatedComment = interface(Jjdom2_Comment)
    ['{1E6AD4BA-645F-4245-A63A-B558896BACBF}']
    function getColumn: Integer; cdecl;
    function getLine: Integer; cdecl;
    procedure setColumn(i: Integer); cdecl;
    procedure setLine(i: Integer); cdecl;
  end;
  TJLocatedComment = class(TJavaGenericImport<JLocatedCommentClass, JLocatedComment>) end;

  JLocatedDocTypeClass = interface(JDocTypeClass)
    ['{F4E81D44-0F1B-4EC3-8159-40CF5981586A}']
    {class} function init(string_: JString): JLocatedDocType; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JLocatedDocType; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JLocatedDocType; cdecl; overload;//Deprecated
  end;

  [JavaSignature('org/jdom2/located/LocatedDocType')]
  JLocatedDocType = interface(JDocType)
    ['{B989C364-737B-4A6C-B832-19953AF689D0}']
    function getColumn: Integer; cdecl;
    function getLine: Integer; cdecl;
    procedure setColumn(i: Integer); cdecl;
    procedure setLine(i: Integer); cdecl;
  end;
  TJLocatedDocType = class(TJavaGenericImport<JLocatedDocTypeClass, JLocatedDocType>) end;

  JLocatedElementClass = interface(Jjdom2_ElementClass)
    ['{70E5A41E-8E54-45DA-896B-EC1964FD6147}']
    {class} function init(string_: JString): JLocatedElement; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JLocatedElement; cdecl; overload;
    {class} function init(string_: JString; namespace: JNamespace): JLocatedElement; cdecl; overload;//Deprecated
    {class} function init(string_: JString; string_1: JString; string_2: JString): JLocatedElement; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/located/LocatedElement')]
  JLocatedElement = interface(Jjdom2_Element)
    ['{0D99BB47-3E7D-4A72-825A-0D734E38F25A}']
    function getColumn: Integer; cdecl;
    function getLine: Integer; cdecl;
    procedure setColumn(i: Integer); cdecl;
    procedure setLine(i: Integer); cdecl;
  end;
  TJLocatedElement = class(TJavaGenericImport<JLocatedElementClass, JLocatedElement>) end;

  JLocatedEntityRefClass = interface(JEntityRefClass)
    ['{660B4988-364B-4206-87AC-CF732BE33A88}']
    {class} function init(string_: JString): JLocatedEntityRef; cdecl; overload;//Deprecated
    {class} function init(string_: JString; string_1: JString): JLocatedEntityRef; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JLocatedEntityRef; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/located/LocatedEntityRef')]
  JLocatedEntityRef = interface(JEntityRef)
    ['{BBFB1E08-43D2-4046-A038-0EEC66376948}']
    function getColumn: Integer; cdecl;
    function getLine: Integer; cdecl;
    procedure setColumn(i: Integer); cdecl;
    procedure setLine(i: Integer); cdecl;
  end;
  TJLocatedEntityRef = class(TJavaGenericImport<JLocatedEntityRefClass, JLocatedEntityRef>) end;

  JLocatedJDOMFactoryClass = interface(JDefaultJDOMFactoryClass)
    ['{B604FFC0-5DC0-4FA3-9ECD-3F98887D8669}']
    {class} function init: JLocatedJDOMFactory; cdecl;
  end;

  [JavaSignature('org/jdom2/located/LocatedJDOMFactory')]
  JLocatedJDOMFactory = interface(JDefaultJDOMFactory)
    ['{B7D0FE56-2F00-4FE1-BE7F-45F9D2AFF4B5}']
    function cdata(i: Integer; i1: Integer; string_: JString): JCDATA; cdecl;
    function comment(i: Integer; i1: Integer; string_: JString): Jjdom2_Comment; cdecl;
    function docType(i: Integer; i1: Integer; string_: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString; string_1: JString): JDocType; cdecl; overload;
    function docType(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): JDocType; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; string_1: JString): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; namespace: JNamespace): Jjdom2_Element; cdecl; overload;
    function element(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): Jjdom2_Element; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString; string_1: JString): JEntityRef; cdecl; overload;
    function entityRef(i: Integer; i1: Integer; string_: JString; string_1: JString; string_2: JString): JEntityRef; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString; map: JMap): Jjdom2_ProcessingInstruction; cdecl; overload;
    function processingInstruction(i: Integer; i1: Integer; string_: JString; string_1: JString): Jjdom2_ProcessingInstruction; cdecl; overload;
    function text(i: Integer; i1: Integer; string_: JString): Jjdom2_Text; cdecl;
  end;
  TJLocatedJDOMFactory = class(TJavaGenericImport<JLocatedJDOMFactoryClass, JLocatedJDOMFactory>) end;

  JLocatedProcessingInstructionClass = interface(Jjdom2_ProcessingInstructionClass)
    ['{E20C664D-8734-40F6-97E9-ED931A971D3E}']
    {class} function init(string_: JString): JLocatedProcessingInstruction; cdecl; overload;//Deprecated
    {class} function init(string_: JString; string_1: JString): JLocatedProcessingInstruction; cdecl; overload;
    {class} function init(string_: JString; map: JMap): JLocatedProcessingInstruction; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/located/LocatedProcessingInstruction')]
  JLocatedProcessingInstruction = interface(Jjdom2_ProcessingInstruction)
    ['{44CA3D22-85D9-456E-9C05-5B073C0DB0E2}']
    function getColumn: Integer; cdecl;
    function getLine: Integer; cdecl;
    procedure setColumn(i: Integer); cdecl;
    procedure setLine(i: Integer); cdecl;
  end;
  TJLocatedProcessingInstruction = class(TJavaGenericImport<JLocatedProcessingInstructionClass, JLocatedProcessingInstruction>) end;

  JLocatedTextClass = interface(Jjdom2_TextClass)
    ['{EC9F523D-5DF5-4AF0-A543-34641E01BCAF}']
    {class} function init(string_: JString): JLocatedText; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/located/LocatedText')]
  JLocatedText = interface(Jjdom2_Text)
    ['{3CCEA354-B15A-4D63-AF49-FDBCECC63EB1}']
    function getColumn: Integer; cdecl;
    function getLine: Integer; cdecl;
    procedure setColumn(i: Integer); cdecl;
    procedure setLine(i: Integer); cdecl;
  end;
  TJLocatedText = class(TJavaGenericImport<JLocatedTextClass, JLocatedText>) end;

  JDOMOutputterClass = interface(JObjectClass)
    ['{11140490-CAD7-448B-BA53-2F7005165D2A}']
    {class} function init: JDOMOutputter; cdecl; overload;
    {class} function init(dOMOutputProcessor: JDOMOutputProcessor): JDOMOutputter; cdecl; overload;
    {class} function init(dOMAdapter: JDOMAdapter): JDOMOutputter; cdecl; overload;
    {class} function init(string_: JString): JDOMOutputter; cdecl; overload;
    {class} function init(dOMAdapter: JDOMAdapter; format: Joutput_Format; dOMOutputProcessor: JDOMOutputProcessor): JDOMOutputter; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/output/DOMOutputter')]
  JDOMOutputter = interface(JObject)
    ['{87A03F99-B676-4057-A97D-E5D06570A502}']
    function getDOMAdapter: JDOMAdapter; cdecl;
    function getDOMOutputProcessor: JDOMOutputProcessor; cdecl;
    function getForceNamespaceAware: Boolean; cdecl;
    function getFormat: Joutput_Format; cdecl;
    function output(processingInstruction: Jjdom2_ProcessingInstruction): JProcessingInstruction; cdecl; overload;
    function output(cDATA: JCDATA): JCDATASection; cdecl; overload;
    function output(text: Jjdom2_Text): JText; cdecl; overload;
    function output(list: JList): JList; cdecl; overload;
    function output(attribute: JAttribute): JAttr; cdecl; overload;
    function output(entityRef: JEntityRef): JEntityReference; cdecl; overload;
    function output(comment: Jjdom2_Comment): JComment; cdecl; overload;
    function output(document: Jjdom2_Document): JDocument; cdecl; overload;
    function output(docType: JDocType): JDocumentType; cdecl; overload;
    function output(element: Jjdom2_Element): JElement; cdecl; overload;
    function output(document: JDocument; comment: Jjdom2_Comment): JComment; cdecl; overload;
    function output(document: JDocument; processingInstruction: Jjdom2_ProcessingInstruction): JProcessingInstruction; cdecl; overload;
    function output(document: JDocument; cDATA: JCDATA): JCDATASection; cdecl; overload;
    function output(document: JDocument; list: JList): JList; cdecl; overload;
    function output(document: JDocument; attribute: JAttribute): JAttr; cdecl; overload;
    function output(document: JDocument; entityRef: JEntityRef): JEntityReference; cdecl; overload;
    function output(document: JDocument; text: Jjdom2_Text): JText; cdecl; overload;
    function output(document: JDocument; element: Jjdom2_Element): JElement; cdecl; overload;
    procedure setDOMAdapter(dOMAdapter: JDOMAdapter); cdecl;
    procedure setDOMOutputProcessor(dOMOutputProcessor: JDOMOutputProcessor); cdecl;
    procedure setForceNamespaceAware(b: Boolean); cdecl;
    procedure setFormat(format: Joutput_Format); cdecl;
  end;
  TJDOMOutputter = class(TJavaGenericImport<JDOMOutputterClass, JDOMOutputter>) end;

  JDOMOutputter_1Class = interface(JObjectClass)
    ['{348826E0-B6D2-4710-B452-8760628E84F8}']
  end;

  [JavaSignature('org/jdom2/output/DOMOutputter$1')]
  JDOMOutputter_1 = interface(JObject)
    ['{06CE2BB6-4AE4-4A48-919D-3DBBFE0EF225}']
  end;
  TJDOMOutputter_1 = class(TJavaGenericImport<JDOMOutputter_1Class, JDOMOutputter_1>) end;

  JAbstractOutputProcessorClass = interface(JObjectClass)
    ['{646674DB-B719-49BA-8CE3-9156C6CC48F6}']
    {class} function init: JAbstractOutputProcessor; cdecl;
  end;

  [JavaSignature('org/jdom2/output/support/AbstractOutputProcessor')]
  JAbstractOutputProcessor = interface(JObject)
    ['{C2F2B5C2-6825-4112-9923-394540324583}']
  end;
  TJAbstractOutputProcessor = class(TJavaGenericImport<JAbstractOutputProcessorClass, JAbstractOutputProcessor>) end;

  JAbstractDOMOutputProcessorClass = interface(JAbstractOutputProcessorClass)
    ['{AE967AC5-D9FE-4DF1-9FEA-2D4F694F26D8}']
    {class} function init: JAbstractDOMOutputProcessor; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/support/AbstractDOMOutputProcessor')]
  JAbstractDOMOutputProcessor = interface(JAbstractOutputProcessor)
    ['{4A12C257-82F9-4CF3-83EE-DE151DE50D41}']
    function process(document: JDocument; format: Joutput_Format; cDATA: JCDATA): JCDATASection; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; list: JList): JList; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; element: Jjdom2_Element): JElement; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; document1: Jjdom2_Document): JDocument; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; text: Jjdom2_Text): JText; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; attribute: JAttribute): JAttr; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; entityRef: JEntityRef): JEntityReference; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; processingInstruction: Jjdom2_ProcessingInstruction): JProcessingInstruction; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; comment: Jjdom2_Comment): JComment; cdecl; overload;
  end;
  TJAbstractDOMOutputProcessor = class(TJavaGenericImport<JAbstractDOMOutputProcessorClass, JAbstractDOMOutputProcessor>) end;

  JDOMOutputter_DefaultDOMOutputProcessorClass = interface(JAbstractDOMOutputProcessorClass)
    ['{B7678193-3F7F-4D6E-B196-5CA936EF70E4}']
  end;

  [JavaSignature('org/jdom2/output/DOMOutputter$DefaultDOMOutputProcessor')]
  JDOMOutputter_DefaultDOMOutputProcessor = interface(JAbstractDOMOutputProcessor)
    ['{B96EE5FE-AF63-435D-A1FB-F346CE7CB07E}']
  end;
  TJDOMOutputter_DefaultDOMOutputProcessor = class(TJavaGenericImport<JDOMOutputter_DefaultDOMOutputProcessorClass, JDOMOutputter_DefaultDOMOutputProcessor>) end;

  JEscapeStrategyClass = interface(IJavaClass)
    ['{0C7E4E7D-52D4-45CA-811B-C19CB1FB5D68}']
  end;

  [JavaSignature('org/jdom2/output/EscapeStrategy')]
  JEscapeStrategy = interface(IJavaInstance)
    ['{9121BD76-8645-48CB-A4C4-8C57AF4130B5}']
    function shouldEscape(c: Char): Boolean; cdecl;
  end;
  TJEscapeStrategy = class(TJavaGenericImport<JEscapeStrategyClass, JEscapeStrategy>) end;

  Joutput_FormatClass = interface(JCloneableClass)
    ['{2281E3E9-6999-4BA2-917A-508F67092246}']
    {class} function _Getindent: JString; cdecl;
    {class} function compact(string_: JString): JString; cdecl;
    {class} function escapeAttribute(escapeStrategy: JEscapeStrategy; string_: JString): JString; cdecl;
    {class} function escapeText(escapeStrategy: JEscapeStrategy; string_: JString; string_1: JString): JString; cdecl;
    {class} function getCompactFormat: Joutput_Format; cdecl;
    {class} function getPrettyFormat: Joutput_Format; cdecl;
    {class} function getRawFormat: Joutput_Format; cdecl;//Deprecated
    {class} function trimBoth(string_: JString): JString; cdecl;
    {class} function trimLeft(string_: JString): JString; cdecl;
    {class} function trimRight(string_: JString): JString; cdecl;
    {class} property indent: JString read _Getindent;
  end;

  [JavaSignature('org/jdom2/output/Format')]
  Joutput_Format = interface(JCloneable)
    ['{563534EF-C265-45D9-AEF7-92C753225E4D}']
    function clone: Joutput_Format; cdecl;
    function getEncoding: JString; cdecl;
    function getEscapeStrategy: JEscapeStrategy; cdecl;
    function getExpandEmptyElements: Boolean; cdecl;
    function getIgnoreTrAXEscapingPIs: Boolean; cdecl;
    function getIndent: JString; cdecl;
    function getLineSeparator: JString; cdecl;
    function getOmitDeclaration: Boolean; cdecl;
    function getOmitEncoding: Boolean; cdecl;
    function getTextMode: JFormat_TextMode; cdecl;
    function isSpecifiedAttributesOnly: Boolean; cdecl;
    function setEncoding(string_: JString): Joutput_Format; cdecl;
    function setEscapeStrategy(escapeStrategy: JEscapeStrategy): Joutput_Format; cdecl;
    function setExpandEmptyElements(b: Boolean): Joutput_Format; cdecl;
    procedure setIgnoreTrAXEscapingPIs(b: Boolean); cdecl;
    function setIndent(string_: JString): Joutput_Format; cdecl;
    function setLineSeparator(lineSeparator: JLineSeparator): Joutput_Format; cdecl; overload;
    function setLineSeparator(string_: JString): Joutput_Format; cdecl; overload;
    function setOmitDeclaration(b: Boolean): Joutput_Format; cdecl;
    function setOmitEncoding(b: Boolean): Joutput_Format; cdecl;
    procedure setSpecifiedAttributesOnly(b: Boolean); cdecl;
    function setTextMode(textMode: JFormat_TextMode): Joutput_Format; cdecl;
  end;
  TJoutput_Format = class(TJavaGenericImport<Joutput_FormatClass, Joutput_Format>) end;

  JFormat_1Class = interface(JEscapeStrategyClass)
    ['{4D15FC06-E1DA-4272-B5F5-E661FF57CC8D}']
    {class} function init: JFormat_1; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/Format$1')]
  JFormat_1 = interface(JEscapeStrategy)
    ['{151D8CA0-0FC6-439B-B469-CB88A9B4F7A1}']
    function shouldEscape(c: Char): Boolean; cdecl;
  end;
  TJFormat_1 = class(TJavaGenericImport<JFormat_1Class, JFormat_1>) end;

  JFormat_DefaultCharsetEscapeStrategyClass = interface(JEscapeStrategyClass)
    ['{32F01FBF-EDB7-4E85-8E54-D20B14E130C6}']
    {class} function init(charsetEncoder: JCharsetEncoder): JFormat_DefaultCharsetEscapeStrategy; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/Format$DefaultCharsetEscapeStrategy')]
  JFormat_DefaultCharsetEscapeStrategy = interface(JEscapeStrategy)
    ['{F6D148A2-03EB-47B7-977D-BD37AB46E529}']
    function shouldEscape(c: Char): Boolean; cdecl;
  end;
  TJFormat_DefaultCharsetEscapeStrategy = class(TJavaGenericImport<JFormat_DefaultCharsetEscapeStrategyClass, JFormat_DefaultCharsetEscapeStrategy>) end;

  JFormat_EscapeStrategy7BitsClass = interface(JEscapeStrategyClass)
    ['{0472D496-8A22-4127-BF0D-C601E170182A}']
    {class} function shouldEscape(c: Char): Boolean; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/Format$EscapeStrategy7Bits')]
  JFormat_EscapeStrategy7Bits = interface(JEscapeStrategy)
    ['{FA36F70A-E63A-48FA-A269-94AC0176A920}']
  end;
  TJFormat_EscapeStrategy7Bits = class(TJavaGenericImport<JFormat_EscapeStrategy7BitsClass, JFormat_EscapeStrategy7Bits>) end;

  JFormat_EscapeStrategy8BitsClass = interface(JEscapeStrategyClass)
    ['{EF333392-8CF4-4EEE-A2D5-0D6CDC2249A7}']
    {class} function shouldEscape(c: Char): Boolean; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/Format$EscapeStrategy8Bits')]
  JFormat_EscapeStrategy8Bits = interface(JEscapeStrategy)
    ['{8F7E39DF-0F3B-4786-A9D7-95D1A6CC33E4}']
  end;
  TJFormat_EscapeStrategy8Bits = class(TJavaGenericImport<JFormat_EscapeStrategy8BitsClass, JFormat_EscapeStrategy8Bits>) end;

  JFormat_EscapeStrategyUTFClass = interface(JEscapeStrategyClass)
    ['{6C834620-3F20-4D20-8E8B-787BFB44FE65}']
    {class} function shouldEscape(c: Char): Boolean; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/Format$EscapeStrategyUTF')]
  JFormat_EscapeStrategyUTF = interface(JEscapeStrategy)
    ['{7DFAB399-3D59-42F6-8FC7-39DD1E327304}']
  end;
  TJFormat_EscapeStrategyUTF = class(TJavaGenericImport<JFormat_EscapeStrategyUTFClass, JFormat_EscapeStrategyUTF>) end;

  JFormat_TextModeClass = interface(JEnumClass)
    ['{A83E032F-878D-40E6-9364-8F9BE78B2FE3}']
    {class} function _GetNORMALIZE: JFormat_TextMode; cdecl;
    {class} function _GetPRESERVE: JFormat_TextMode; cdecl;
    {class} function _GetTRIM: JFormat_TextMode; cdecl;
    {class} function _GetTRIM_FULL_WHITE: JFormat_TextMode; cdecl;
    {class} function valueOf(string_: JString): JFormat_TextMode; cdecl;
    {class} function values: TJavaObjectArray<JFormat_TextMode>; cdecl;//Deprecated
    {class} property NORMALIZE: JFormat_TextMode read _GetNORMALIZE;
    {class} property PRESERVE: JFormat_TextMode read _GetPRESERVE;
    {class} property TRIM: JFormat_TextMode read _GetTRIM;
    {class} property TRIM_FULL_WHITE: JFormat_TextMode read _GetTRIM_FULL_WHITE;
  end;

  [JavaSignature('org/jdom2/output/Format$TextMode')]
  JFormat_TextMode = interface(JEnum)
    ['{F44B9D46-1CF0-40AA-92C8-1C5EB8FC8BA7}']
  end;
  TJFormat_TextMode = class(TJavaGenericImport<JFormat_TextModeClass, JFormat_TextMode>) end;

  JLocatorClass = interface(IJavaClass)
    ['{9A2F9D3E-BC80-4D17-9D5C-F04B6B640F79}']
    {class} function getColumnNumber: Integer; cdecl;//Deprecated
    {class} function getLineNumber: Integer; cdecl;//Deprecated
  end;

  [JavaSignature('org/xml/sax/Locator')]
  JLocator = interface(IJavaInstance)
    ['{C97AB330-209B-4A50-B0B9-97D7F8A7E5AF}']
    function getPublicId: JString; cdecl;
    function getSystemId: JString; cdecl;
  end;
  TJLocator = class(TJavaGenericImport<JLocatorClass, JLocator>) end;

  JJDOMLocatorClass = interface(JLocatorClass)
    ['{E6157725-1C42-4664-B985-922ECC570C16}']
  end;

  [JavaSignature('org/jdom2/output/JDOMLocator')]
  JJDOMLocator = interface(JLocator)
    ['{06433D35-3B62-40BD-81FC-FBAE058C8EAF}']
    function getNode: JObject; cdecl;
  end;
  TJJDOMLocator = class(TJavaGenericImport<JJDOMLocatorClass, JJDOMLocator>) end;

  JLineSeparatorClass = interface(JEnumClass)
    ['{E3E36546-6925-4A90-8F07-03493D15B02F}']
    {class} function _GetCR: JLineSeparator; cdecl;
    {class} function _GetCRNL: JLineSeparator; cdecl;
    {class} function _GetDEFAULT: JLineSeparator; cdecl;
    {class} function _GetDOS: JLineSeparator; cdecl;
    {class} function _GetNL: JLineSeparator; cdecl;
    {class} function _GetNONE: JLineSeparator; cdecl;
    {class} function _GetSYSTEM: JLineSeparator; cdecl;
    {class} function _GetUNIX: JLineSeparator; cdecl;
    {class} function valueOf(string_: JString): JLineSeparator; cdecl;
    {class} function values: TJavaObjectArray<JLineSeparator>; cdecl;//Deprecated
    {class} property CR: JLineSeparator read _GetCR;
    {class} property CRNL: JLineSeparator read _GetCRNL;
    {class} property DEFAULT: JLineSeparator read _GetDEFAULT;
    {class} property DOS: JLineSeparator read _GetDOS;
    {class} property NL: JLineSeparator read _GetNL;
    {class} property NONE: JLineSeparator read _GetNONE;
    {class} property SYSTEM: JLineSeparator read _GetSYSTEM;
    {class} property UNIX: JLineSeparator read _GetUNIX;
  end;

  [JavaSignature('org/jdom2/output/LineSeparator')]
  JLineSeparator = interface(JEnum)
    ['{CE5A4E2C-170E-48A4-A89F-1D94035FB10B}']
    function value: JString; cdecl;
  end;
  TJLineSeparator = class(TJavaGenericImport<JLineSeparatorClass, JLineSeparator>) end;

  JSAXOutputterClass = interface(JObjectClass)
    ['{4FA0BA08-BE7E-4B8C-A569-2BC30F7D2F8D}']
    {class} function init: JSAXOutputter; cdecl; overload;
    {class} function init(contentHandler: JContentHandler): JSAXOutputter; cdecl; overload;
    {class} function init(contentHandler: JContentHandler; errorHandler: JErrorHandler; dTDHandler: JDTDHandler; entityResolver: JEntityResolver): JSAXOutputter; cdecl; overload;
    {class} function init(contentHandler: JContentHandler; errorHandler: JErrorHandler; dTDHandler: JDTDHandler; entityResolver: JEntityResolver; lexicalHandler: JLexicalHandler): JSAXOutputter; cdecl; overload;
    {class} function init(sAXOutputProcessor: JSAXOutputProcessor; format: Joutput_Format; contentHandler: JContentHandler; errorHandler: JErrorHandler; dTDHandler: JDTDHandler; entityResolver: JEntityResolver; lexicalHandler: JLexicalHandler): JSAXOutputter; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/output/SAXOutputter')]
  JSAXOutputter = interface(JObject)
    ['{5EC23AA1-EE97-40ED-B5EB-23A4569A2FFF}']
    function getContentHandler: JContentHandler; cdecl;
    function getDTDHandler: JDTDHandler; cdecl;
    function getDeclHandler: JDeclHandler; cdecl;
    function getEntityResolver: JEntityResolver; cdecl;
    function getErrorHandler: JErrorHandler; cdecl;
    function getFeature(string_: JString): Boolean; cdecl;
    function getFormat: Joutput_Format; cdecl;
    function getLexicalHandler: JLexicalHandler; cdecl;
    function getLocator: JJDOMLocator; cdecl;
    function getProperty(string_: JString): JObject; cdecl;
    function getReportDTDEvents: Boolean; cdecl;
    function getReportNamespaceDeclarations: Boolean; cdecl;
    function getSAXOutputProcessor: JSAXOutputProcessor; cdecl;
    procedure output(list: JList); cdecl; overload;
    procedure output(document: Jjdom2_Document); cdecl; overload;
    procedure output(element: Jjdom2_Element); cdecl; overload;
    procedure outputFragment(content: JContent); cdecl; overload;
    procedure outputFragment(list: JList); cdecl; overload;
    procedure setContentHandler(contentHandler: JContentHandler); cdecl;
    procedure setDTDHandler(dTDHandler: JDTDHandler); cdecl;
    procedure setDeclHandler(declHandler: JDeclHandler); cdecl;
    procedure setEntityResolver(entityResolver: JEntityResolver); cdecl;
    procedure setErrorHandler(errorHandler: JErrorHandler); cdecl;
    procedure setFeature(string_: JString; b: Boolean); cdecl;
    procedure setFormat(format: Joutput_Format); cdecl;
    procedure setLexicalHandler(lexicalHandler: JLexicalHandler); cdecl;
    procedure setProperty(string_: JString; object_: JObject); cdecl;
    procedure setReportDTDEvents(b: Boolean); cdecl;
    procedure setReportNamespaceDeclarations(b: Boolean); cdecl;
    procedure setSAXOutputProcessor(sAXOutputProcessor: JSAXOutputProcessor); cdecl;
  end;
  TJSAXOutputter = class(TJavaGenericImport<JSAXOutputterClass, JSAXOutputter>) end;

  JSAXOutputter_1Class = interface(JObjectClass)
    ['{E1AD441C-B96C-4E01-8EDA-C0B74A040171}']
  end;

  [JavaSignature('org/jdom2/output/SAXOutputter$1')]
  JSAXOutputter_1 = interface(JObject)
    ['{03AD0003-4F27-41E0-A2F1-88FB01DCD066}']
  end;
  TJSAXOutputter_1 = class(TJavaGenericImport<JSAXOutputter_1Class, JSAXOutputter_1>) end;

  JAbstractSAXOutputProcessorClass = interface(JAbstractOutputProcessorClass)
    ['{0E2A18DF-87F9-4458-AA99-973E26F9CC77}']
    {class} function init: JAbstractSAXOutputProcessor; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/support/AbstractSAXOutputProcessor')]
  JAbstractSAXOutputProcessor = interface(JAbstractOutputProcessor)
    ['{EF0EEB8D-13D2-4BC0-9BEB-F36A1AC8E518}']
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; list: JList); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; element: Jjdom2_Element); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; docType: JDocType); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; document: Jjdom2_Document); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; cDATA: JCDATA); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; entityRef: JEntityRef); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; processingInstruction: Jjdom2_ProcessingInstruction); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; comment: Jjdom2_Comment); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; text: Jjdom2_Text); cdecl; overload;
    procedure processAsDocument(sAXTarget: JSAXTarget; format: Joutput_Format; element: Jjdom2_Element); cdecl; overload;
    procedure processAsDocument(sAXTarget: JSAXTarget; format: Joutput_Format; list: JList); cdecl; overload;
  end;
  TJAbstractSAXOutputProcessor = class(TJavaGenericImport<JAbstractSAXOutputProcessorClass, JAbstractSAXOutputProcessor>) end;

  JSAXOutputter_DefaultSAXOutputProcessorClass = interface(JAbstractSAXOutputProcessorClass)
    ['{CD35E471-7FC1-451C-8847-5C41C99D5DA6}']
  end;

  [JavaSignature('org/jdom2/output/SAXOutputter$DefaultSAXOutputProcessor')]
  JSAXOutputter_DefaultSAXOutputProcessor = interface(JAbstractSAXOutputProcessor)
    ['{7CAB3042-9E07-4B8E-8EAF-375BEEEF96C3}']
  end;
  TJSAXOutputter_DefaultSAXOutputProcessor = class(TJavaGenericImport<JSAXOutputter_DefaultSAXOutputProcessorClass, JSAXOutputter_DefaultSAXOutputProcessor>) end;

  JStAXEventOutputterClass = interface(JCloneableClass)
    ['{FD328562-0AE8-4FC7-989C-86AAE4453748}']
    {class} function init: JStAXEventOutputter; cdecl; overload;
    {class} function init(format: Joutput_Format): JStAXEventOutputter; cdecl; overload;
    {class} //function init(xMLEventFactory: JXMLEventFactory): JStAXEventOutputter; cdecl; overload;
    {class} function init(stAXEventProcessor: JStAXEventProcessor): JStAXEventOutputter; cdecl; overload;
    {class} //function init(format: Joutput_Format; stAXEventProcessor: JStAXEventProcessor; xMLEventFactory: JXMLEventFactory): JStAXEventOutputter; cdecl; overload;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/StAXEventOutputter')]
  JStAXEventOutputter = interface(JCloneable)
    ['{D0D14AC0-3A6E-4108-A4A9-93059CF99DAB}']
    function clone: JStAXEventOutputter; cdecl;
    //function getEventFactory: JXMLEventFactory; cdecl;
    function getFormat: Joutput_Format; cdecl;
    function getStAXStream: JStAXEventProcessor; cdecl;
    //procedure output(text: Jjdom2_Text; xMLEventConsumer: JXMLEventConsumer); cdecl; overload;
    //procedure output(cDATA: JCDATA; xMLEventConsumer: JXMLEventConsumer); cdecl; overload;
    //procedure output(list: JList; xMLEventConsumer: JXMLEventConsumer); cdecl; overload;
    //procedure output(entityRef: JEntityRef; xMLEventConsumer: JXMLEventConsumer); cdecl; overload;
    //procedure output(processingInstruction: Jjdom2_ProcessingInstruction; xMLEventConsumer: JXMLEventConsumer); cdecl; overload;
    //procedure output(comment: Jjdom2_Comment; xMLEventConsumer: JXMLEventConsumer); cdecl; overload;
    //procedure output(document: Jjdom2_Document; xMLEventConsumer: JXMLEventConsumer); cdecl; overload;
    //procedure output(docType: JDocType; xMLEventConsumer: JXMLEventConsumer); cdecl; overload;
    //procedure output(element: Jjdom2_Element; xMLEventConsumer: JXMLEventConsumer); cdecl; overload;
    //procedure outputElementContent(element: Jjdom2_Element; xMLEventConsumer: JXMLEventConsumer); cdecl;
    //procedure setEventFactory(xMLEventFactory: JXMLEventFactory); cdecl;
    procedure setFormat(format: Joutput_Format); cdecl;
    procedure setStAXEventProcessor(stAXEventProcessor: JStAXEventProcessor); cdecl;
    function toString: JString; cdecl;
  end;
  TJStAXEventOutputter = class(TJavaGenericImport<JStAXEventOutputterClass, JStAXEventOutputter>) end;

  JStAXEventOutputter_1Class = interface(JObjectClass)
    ['{803BBD52-D866-45E8-9DE7-550623D95AC3}']
  end;

  [JavaSignature('org/jdom2/output/StAXEventOutputter$1')]
  JStAXEventOutputter_1 = interface(JObject)
    ['{3C41620E-7F47-4617-90C7-A3B0EE72D14E}']
  end;
  TJStAXEventOutputter_1 = class(TJavaGenericImport<JStAXEventOutputter_1Class, JStAXEventOutputter_1>) end;

  JAbstractStAXEventProcessorClass = interface(JAbstractOutputProcessorClass)
    ['{EE4AD246-100E-43F9-AAC5-32A8E1095A29}']
    {class} function init: JAbstractStAXEventProcessor; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/support/AbstractStAXEventProcessor')]
  JAbstractStAXEventProcessor = interface(JAbstractOutputProcessor)
    ['{90E5D9C8-83E0-4542-A94D-1C2F8D11A9E1}']
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; list: JList); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; element: Jjdom2_Element); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; docType: JDocType); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; document: Jjdom2_Document); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; cDATA: JCDATA); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; entityRef: JEntityRef); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; processingInstruction: Jjdom2_ProcessingInstruction); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; comment: Jjdom2_Comment); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; text: Jjdom2_Text); cdecl; overload;
  end;
  TJAbstractStAXEventProcessor = class(TJavaGenericImport<JAbstractStAXEventProcessorClass, JAbstractStAXEventProcessor>) end;

  JStAXEventOutputter_DefaultStAXEventProcessorClass = interface(JAbstractStAXEventProcessorClass)
    ['{978DDB12-514B-472D-A6B3-5633B3942801}']
  end;

  [JavaSignature('org/jdom2/output/StAXEventOutputter$DefaultStAXEventProcessor')]
  JStAXEventOutputter_DefaultStAXEventProcessor = interface(JAbstractStAXEventProcessor)
    ['{ED5B20AE-198C-4D03-9DE6-0070967CED98}']
  end;
  TJStAXEventOutputter_DefaultStAXEventProcessor = class(TJavaGenericImport<JStAXEventOutputter_DefaultStAXEventProcessorClass, JStAXEventOutputter_DefaultStAXEventProcessor>) end;

  JStAXStreamOutputterClass = interface(JCloneableClass)
    ['{BF1C0D25-435E-4957-81FF-413F00BBC8C3}']
    {class} function init: JStAXStreamOutputter; cdecl; overload;
    {class} function init(stAXStreamProcessor: JStAXStreamProcessor): JStAXStreamOutputter; cdecl; overload;
    {class} function init(format: Joutput_Format): JStAXStreamOutputter; cdecl; overload;
    {class} function init(format: Joutput_Format; stAXStreamProcessor: JStAXStreamProcessor): JStAXStreamOutputter; cdecl; overload;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/StAXStreamOutputter')]
  JStAXStreamOutputter = interface(JCloneable)
    ['{F19A367C-B7E4-4980-A6C7-3E5B1B9A33BE}']
    function clone: JStAXStreamOutputter; cdecl;
    function getFormat: Joutput_Format; cdecl;
    function getStAXStream: JStAXStreamProcessor; cdecl;
    //procedure output(text: Jjdom2_Text; xMLStreamWriter: JXMLStreamWriter); cdecl; overload;
    //procedure output(cDATA: JCDATA; xMLStreamWriter: JXMLStreamWriter); cdecl; overload;
    //procedure output(comment: Jjdom2_Comment; xMLStreamWriter: JXMLStreamWriter); cdecl; overload;
    //procedure output(processingInstruction: Jjdom2_ProcessingInstruction; xMLStreamWriter: JXMLStreamWriter); cdecl; overload;
    //procedure output(entityRef: JEntityRef; xMLStreamWriter: JXMLStreamWriter); cdecl; overload;
    //procedure output(list: JList; xMLStreamWriter: JXMLStreamWriter); cdecl; overload;
    //procedure output(document: Jjdom2_Document; xMLStreamWriter: JXMLStreamWriter); cdecl; overload;
    //procedure output(docType: JDocType; xMLStreamWriter: JXMLStreamWriter); cdecl; overload;
    //procedure output(element: Jjdom2_Element; xMLStreamWriter: JXMLStreamWriter); cdecl; overload;
    //procedure outputElementContent(element: Jjdom2_Element; xMLStreamWriter: JXMLStreamWriter); cdecl;
    procedure setFormat(format: Joutput_Format); cdecl;
    procedure setStAXStreamProcessor(stAXStreamProcessor: JStAXStreamProcessor); cdecl;
    function toString: JString; cdecl;
  end;
  TJStAXStreamOutputter = class(TJavaGenericImport<JStAXStreamOutputterClass, JStAXStreamOutputter>) end;

  JStAXStreamOutputter_1Class = interface(JObjectClass)
    ['{DBFA893B-122D-4444-A6B3-BDEC5B959F86}']
  end;

  [JavaSignature('org/jdom2/output/StAXStreamOutputter$1')]
  JStAXStreamOutputter_1 = interface(JObject)
    ['{EF8A4FA4-0F2F-4DF4-8E5D-55AD7A4048EB}']
  end;
  TJStAXStreamOutputter_1 = class(TJavaGenericImport<JStAXStreamOutputter_1Class, JStAXStreamOutputter_1>) end;

  JAbstractStAXStreamProcessorClass = interface(JAbstractOutputProcessorClass)
    ['{756C09A0-B1C2-48AB-8F98-3E379C83ACB5}']
    {class} function init: JAbstractStAXStreamProcessor; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/support/AbstractStAXStreamProcessor')]
  JAbstractStAXStreamProcessor = interface(JAbstractOutputProcessor)
    ['{3A415C7A-5E05-4C03-91EE-4E191BD5581F}']
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; docType: JDocType); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; element: Jjdom2_Element); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; document: Jjdom2_Document); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; entityRef: JEntityRef); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; processingInstruction: Jjdom2_ProcessingInstruction); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; comment: Jjdom2_Comment); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; list: JList); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; cDATA: JCDATA); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; text: Jjdom2_Text); cdecl; overload;
  end;
  TJAbstractStAXStreamProcessor = class(TJavaGenericImport<JAbstractStAXStreamProcessorClass, JAbstractStAXStreamProcessor>) end;

  JStAXStreamOutputter_DefaultStAXStreamProcessorClass = interface(JAbstractStAXStreamProcessorClass)
    ['{58825E24-817B-4337-8DE1-AA20938B357A}']
  end;

  [JavaSignature('org/jdom2/output/StAXStreamOutputter$DefaultStAXStreamProcessor')]
  JStAXStreamOutputter_DefaultStAXStreamProcessor = interface(JAbstractStAXStreamProcessor)
    ['{8AD61A9A-16A8-41BE-A52C-69F06BC9E205}']
  end;
  TJStAXStreamOutputter_DefaultStAXStreamProcessor = class(TJavaGenericImport<JStAXStreamOutputter_DefaultStAXStreamProcessorClass, JStAXStreamOutputter_DefaultStAXStreamProcessor>) end;

  JXMLOutputterClass = interface(JCloneableClass)
    ['{B1841DB3-AE9E-4C3E-AE35-541C03C5AFAA}']
    {class} function init: JXMLOutputter; cdecl; overload;
    {class} function init(xMLOutputProcessor: JXMLOutputProcessor): JXMLOutputter; cdecl; overload;
    {class} function init(format: Joutput_Format): JXMLOutputter; cdecl; overload;
    {class} function init(xMLOutputter: JXMLOutputter): JXMLOutputter; cdecl; overload;
    {class} function init(format: Joutput_Format; xMLOutputProcessor: JXMLOutputProcessor): JXMLOutputter; cdecl; overload;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/XMLOutputter')]
  JXMLOutputter = interface(JCloneable)
    ['{636D0DC7-6816-408F-B274-6FD7350C32A0}']
    function clone: JXMLOutputter; cdecl;
    function escapeAttributeEntities(string_: JString): JString; cdecl;
    function escapeElementEntities(string_: JString): JString; cdecl;
    function getFormat: Joutput_Format; cdecl;
    function getXMLOutputProcessor: JXMLOutputProcessor; cdecl;
    procedure output(text: Jjdom2_Text; writer: JWriter); cdecl; overload;
    procedure output(comment: Jjdom2_Comment; writer: JWriter); cdecl; overload;
    procedure output(processingInstruction: Jjdom2_ProcessingInstruction; writer: JWriter); cdecl; overload;
    procedure output(entityRef: JEntityRef; writer: JWriter); cdecl; overload;
    procedure output(docType: JDocType; writer: JWriter); cdecl; overload;
    procedure output(document: Jjdom2_Document; writer: JWriter); cdecl; overload;
    procedure output(element: Jjdom2_Element; writer: JWriter); cdecl; overload;
    procedure output(list: JList; writer: JWriter); cdecl; overload;
    procedure output(cDATA: JCDATA; writer: JWriter); cdecl; overload;
    procedure output(list: JList; outputStream: JOutputStream); cdecl; overload;
    procedure output(element: Jjdom2_Element; outputStream: JOutputStream); cdecl; overload;
    procedure output(docType: JDocType; outputStream: JOutputStream); cdecl; overload;
    procedure output(document: Jjdom2_Document; outputStream: JOutputStream); cdecl; overload;
    procedure output(cDATA: JCDATA; outputStream: JOutputStream); cdecl; overload;
    procedure output(comment: Jjdom2_Comment; outputStream: JOutputStream); cdecl; overload;
    procedure output(processingInstruction: Jjdom2_ProcessingInstruction; outputStream: JOutputStream); cdecl; overload;
    procedure output(entityRef: JEntityRef; outputStream: JOutputStream); cdecl; overload;
    procedure output(text: Jjdom2_Text; outputStream: JOutputStream); cdecl; overload;
    procedure outputElementContent(element: Jjdom2_Element; writer: JWriter); cdecl; overload;
    procedure outputElementContent(element: Jjdom2_Element; outputStream: JOutputStream); cdecl; overload;
    function outputElementContentString(element: Jjdom2_Element): JString; cdecl;
    function outputString(list: JList): JString; cdecl; overload;
    function outputString(element: Jjdom2_Element): JString; cdecl; overload;
    function outputString(docType: JDocType): JString; cdecl; overload;
    function outputString(document: Jjdom2_Document): JString; cdecl; overload;
    function outputString(cDATA: JCDATA): JString; cdecl; overload;
    function outputString(entityRef: JEntityRef): JString; cdecl; overload;
    function outputString(processingInstruction: Jjdom2_ProcessingInstruction): JString; cdecl; overload;
    function outputString(text: Jjdom2_Text): JString; cdecl; overload;
    function outputString(comment: Jjdom2_Comment): JString; cdecl; overload;
    procedure setFormat(format: Joutput_Format); cdecl;
    procedure setXMLOutputProcessor(xMLOutputProcessor: JXMLOutputProcessor); cdecl;
    function toString: JString; cdecl;
  end;
  TJXMLOutputter = class(TJavaGenericImport<JXMLOutputterClass, JXMLOutputter>) end;

  JXMLOutputter_1Class = interface(JObjectClass)
    ['{8FEBA799-A773-4676-BB7C-515BDA37A613}']
  end;

  [JavaSignature('org/jdom2/output/XMLOutputter$1')]
  JXMLOutputter_1 = interface(JObject)
    ['{95197E90-9145-4B21-AF07-09B19C8ED5B4}']
  end;
  TJXMLOutputter_1 = class(TJavaGenericImport<JXMLOutputter_1Class, JXMLOutputter_1>) end;

  JAbstractXMLOutputProcessorClass = interface(JAbstractOutputProcessorClass)
    ['{B5CE007A-903A-43F8-A612-8E184A77A711}']
    {class} function _GetCDATAPRE: JString; cdecl;
    {class} function init: JAbstractXMLOutputProcessor; cdecl;//Deprecated
    {class} property CDATAPRE: JString read _GetCDATAPRE;
  end;

  [JavaSignature('org/jdom2/output/support/AbstractXMLOutputProcessor')]
  JAbstractXMLOutputProcessor = interface(JAbstractOutputProcessor)
    ['{0AFB113F-4CFB-4E78-8BDD-0B12FC2DC88A}']
    procedure process(writer: JWriter; format: Joutput_Format; comment: Jjdom2_Comment); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; text: Jjdom2_Text); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; element: Jjdom2_Element); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; processingInstruction: Jjdom2_ProcessingInstruction); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; cDATA: JCDATA); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; document: Jjdom2_Document); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; list: JList); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; entityRef: JEntityRef); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; docType: JDocType); cdecl; overload;
  end;
  TJAbstractXMLOutputProcessor = class(TJavaGenericImport<JAbstractXMLOutputProcessorClass, JAbstractXMLOutputProcessor>) end;

  JXMLOutputter_DefaultXMLProcessorClass = interface(JAbstractXMLOutputProcessorClass)
    ['{33A77ABD-EEF0-47B2-8367-F0C51374547E}']
  end;

  [JavaSignature('org/jdom2/output/XMLOutputter$DefaultXMLProcessor')]
  JXMLOutputter_DefaultXMLProcessor = interface(JAbstractXMLOutputProcessor)
    ['{A7422AB2-1DC7-4102-86A3-697E7E6AA1DC}']
    function escapeAttributeEntities(string_: JString; format: Joutput_Format): JString; cdecl;
    function escapeElementEntities(string_: JString; format: Joutput_Format): JString; cdecl;
  end;
  TJXMLOutputter_DefaultXMLProcessor = class(TJavaGenericImport<JXMLOutputter_DefaultXMLProcessorClass, JXMLOutputter_DefaultXMLProcessor>) end;

  JAbstractDOMOutputProcessor_1Class = interface(JObjectClass)
    ['{27469660-30BF-4749-B63B-F63ACF4FF546}']
  end;

  [JavaSignature('org/jdom2/output/support/AbstractDOMOutputProcessor$1')]
  JAbstractDOMOutputProcessor_1 = interface(JObject)
    ['{817A3E81-6DC7-43B0-A3C9-F7AB0F5DC8BC}']
  end;
  TJAbstractDOMOutputProcessor_1 = class(TJavaGenericImport<JAbstractDOMOutputProcessor_1Class, JAbstractDOMOutputProcessor_1>) end;

  JWalkerClass = interface(IJavaClass)
    ['{3DD81AAC-EAD3-4200-A59C-C1AFF227150E}']
  end;

  [JavaSignature('org/jdom2/output/support/Walker')]
  JWalker = interface(IJavaInstance)
    ['{30A72835-C53E-4816-B174-1794AC2A25BD}']
    function hasNext: Boolean; cdecl;
    function isAllText: Boolean; cdecl;
    function isAllWhitespace: Boolean; cdecl;
    function isCDATA: Boolean; cdecl;
    function next: JContent; cdecl;
    function text: JString; cdecl;
  end;
  TJWalker = class(TJavaGenericImport<JWalkerClass, JWalker>) end;

  JAbstractFormattedWalkerClass = interface(JWalkerClass)
    ['{ABC4A349-A4CC-49EE-9B29-CC86A5602AD5}']
    {class} function init(list: JList; formatStack: JFormatStack; b: Boolean): JAbstractFormattedWalker; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/support/AbstractFormattedWalker')]
  JAbstractFormattedWalker = interface(JWalker)
    ['{A23AB173-6087-471F-A2AE-0537D5455065}']
    function hasNext: Boolean; cdecl;
    function isAllText: Boolean; cdecl;
    function isAllWhitespace: Boolean; cdecl;
    function isCDATA: Boolean; cdecl;
    function next: JContent; cdecl;
    function text: JString; cdecl;
  end;
  TJAbstractFormattedWalker = class(TJavaGenericImport<JAbstractFormattedWalkerClass, JAbstractFormattedWalker>) end;

  JAbstractFormattedWalker_1Class = interface(JIteratorClass)
    ['{D5284BD2-ADEA-4DF1-BA79-25025BA3547A}']
    {class} function init: JAbstractFormattedWalker_1; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/support/AbstractFormattedWalker$1')]
  JAbstractFormattedWalker_1 = interface(JIterator)
    ['{781BE89D-39BD-4426-A662-F0084D2C9A26}']
    function hasNext: Boolean; cdecl;
    function next: JContent; cdecl;
    procedure remove; cdecl;
  end;
  TJAbstractFormattedWalker_1 = class(TJavaGenericImport<JAbstractFormattedWalker_1Class, JAbstractFormattedWalker_1>) end;

  JAbstractFormattedWalker_2Class = interface(JObjectClass)
    ['{AA8F84C0-4737-4588-AE27-B0811C39BC64}']
  end;

  [JavaSignature('org/jdom2/output/support/AbstractFormattedWalker$2')]
  JAbstractFormattedWalker_2 = interface(JObject)
    ['{A76DC58B-8103-47B8-A97E-8B91B2215B1A}']
  end;
  TJAbstractFormattedWalker_2 = class(TJavaGenericImport<JAbstractFormattedWalker_2Class, JAbstractFormattedWalker_2>) end;

  JAbstractFormattedWalker_MultiTextClass = interface(JObjectClass)
    ['{F20443C8-F3A2-47C7-87D6-CF759FC20EC0}']
  end;

  [JavaSignature('org/jdom2/output/support/AbstractFormattedWalker$MultiText')]
  JAbstractFormattedWalker_MultiText = interface(JObject)
    ['{FEB663C7-F403-4D87-B9A9-9174BE9146FE}']
    procedure appendCDATA(trim: JAbstractFormattedWalker_Trim; string_: JString); cdecl;
    procedure appendRaw(content: JContent); cdecl;
    procedure appendText(trim: JAbstractFormattedWalker_Trim; string_: JString); cdecl;
    procedure done; cdecl;
  end;
  TJAbstractFormattedWalker_MultiText = class(TJavaGenericImport<JAbstractFormattedWalker_MultiTextClass, JAbstractFormattedWalker_MultiText>) end;

  JAbstractFormattedWalker_TrimClass = interface(JEnumClass)
    ['{921B157F-4CAD-4391-BE25-0A28E06EB299}']
    {class} function _GetBOTH: JAbstractFormattedWalker_Trim; cdecl;
    {class} function _GetCOMPACT: JAbstractFormattedWalker_Trim; cdecl;
    {class} function _GetLEFT: JAbstractFormattedWalker_Trim; cdecl;
    {class} function _GetNONE: JAbstractFormattedWalker_Trim; cdecl;
    {class} function _GetRIGHT: JAbstractFormattedWalker_Trim; cdecl;
    {class} function valueOf(string_: JString): JAbstractFormattedWalker_Trim; cdecl;
    {class} function values: TJavaObjectArray<JAbstractFormattedWalker_Trim>; cdecl;
    {class} property BOTH: JAbstractFormattedWalker_Trim read _GetBOTH;
    {class} property COMPACT: JAbstractFormattedWalker_Trim read _GetCOMPACT;
    {class} property LEFT: JAbstractFormattedWalker_Trim read _GetLEFT;
    {class} property NONE: JAbstractFormattedWalker_Trim read _GetNONE;
    {class} property RIGHT: JAbstractFormattedWalker_Trim read _GetRIGHT;
  end;

  [JavaSignature('org/jdom2/output/support/AbstractFormattedWalker$Trim')]
  JAbstractFormattedWalker_Trim = interface(JEnum)
    ['{F2B739E7-9A31-435E-B1B3-7C6B773BF075}']
  end;
  TJAbstractFormattedWalker_Trim = class(TJavaGenericImport<JAbstractFormattedWalker_TrimClass, JAbstractFormattedWalker_Trim>) end;

  JAbstractOutputProcessor_1Class = interface(JObjectClass)
    ['{51FEDDE1-1C60-4DE3-9B6F-441FD6DB58DA}']
  end;

  [JavaSignature('org/jdom2/output/support/AbstractOutputProcessor$1')]
  JAbstractOutputProcessor_1 = interface(JObject)
    ['{41E27BB6-3FEE-4E9F-8B8F-29423E489658}']
  end;
  TJAbstractOutputProcessor_1 = class(TJavaGenericImport<JAbstractOutputProcessor_1Class, JAbstractOutputProcessor_1>) end;

  JAbstractSAXOutputProcessor_1Class = interface(JObjectClass)
    ['{0048C669-391D-44CF-842C-99D45944C988}']
  end;

  [JavaSignature('org/jdom2/output/support/AbstractSAXOutputProcessor$1')]
  JAbstractSAXOutputProcessor_1 = interface(JObject)
    ['{C60C188E-5395-41CB-8342-5760BAB304C4}']
  end;
  TJAbstractSAXOutputProcessor_1 = class(TJavaGenericImport<JAbstractSAXOutputProcessor_1Class, JAbstractSAXOutputProcessor_1>) end;

  JAbstractStAXEventProcessor_1Class = interface(JObjectClass)
    ['{CAC9F2D7-56FF-4307-9E11-44D040046CA3}']
  end;

  [JavaSignature('org/jdom2/output/support/AbstractStAXEventProcessor$1')]
  JAbstractStAXEventProcessor_1 = interface(JObject)
    ['{B04DCCEC-FBD0-45A8-8965-4E7C1301C66D}']
  end;
  TJAbstractStAXEventProcessor_1 = class(TJavaGenericImport<JAbstractStAXEventProcessor_1Class, JAbstractStAXEventProcessor_1>) end;

  JAbstractStAXEventProcessor_AttIteratorClass = interface(JIteratorClass)
    ['{3116560A-C6F9-4064-9DD0-B5A0341CC749}']
    {class} //function init(iterator: JIterator; xMLEventFactory: JXMLEventFactory; b: Boolean): JAbstractStAXEventProcessor_AttIterator; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/support/AbstractStAXEventProcessor$AttIterator')]
  JAbstractStAXEventProcessor_AttIterator = interface(JIterator)
    ['{47166C71-E724-4573-80B1-D45A7758732C}']
    function hasNext: Boolean; cdecl;
    //function next: Jevents_Attribute; cdecl;
    procedure remove; cdecl;
  end;
  TJAbstractStAXEventProcessor_AttIterator = class(TJavaGenericImport<JAbstractStAXEventProcessor_AttIteratorClass, JAbstractStAXEventProcessor_AttIterator>) end;

  JAbstractStAXEventProcessor_NSIteratorClass = interface(JIteratorClass)
    ['{D9A0356A-B923-4988-8EB0-6A90F17A08D1}']
    {class} //function init(iterator: JIterator; xMLEventFactory: JXMLEventFactory): JAbstractStAXEventProcessor_NSIterator; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/support/AbstractStAXEventProcessor$NSIterator')]
  JAbstractStAXEventProcessor_NSIterator = interface(JIterator)
    ['{DD33BBF3-3A90-4D83-A5CC-4CBCE327C414}']
    function hasNext: Boolean; cdecl;
    //function next: Jevents_Namespace; cdecl;
    procedure remove; cdecl;
  end;
  TJAbstractStAXEventProcessor_NSIterator = class(TJavaGenericImport<JAbstractStAXEventProcessor_NSIteratorClass, JAbstractStAXEventProcessor_NSIterator>) end;

  JAbstractStAXStreamProcessor_1Class = interface(JObjectClass)
    ['{8C5D16C8-18A6-480A-A350-D300FECF398A}']
  end;

  [JavaSignature('org/jdom2/output/support/AbstractStAXStreamProcessor$1')]
  JAbstractStAXStreamProcessor_1 = interface(JObject)
    ['{B67A26BD-5A47-49B6-A2B0-03B5FA59E44B}']
  end;
  TJAbstractStAXStreamProcessor_1 = class(TJavaGenericImport<JAbstractStAXStreamProcessor_1Class, JAbstractStAXStreamProcessor_1>) end;

  JAbstractXMLOutputProcessor_1Class = interface(JObjectClass)
    ['{1B8B0EE6-580B-4CCB-9ACB-BDA03EBCCFB8}']
  end;

  [JavaSignature('org/jdom2/output/support/AbstractXMLOutputProcessor$1')]
  JAbstractXMLOutputProcessor_1 = interface(JObject)
    ['{DD09C4B1-3458-4C05-9CF1-5145BC0CBAEC}']
  end;
  TJAbstractXMLOutputProcessor_1 = class(TJavaGenericImport<JAbstractXMLOutputProcessor_1Class, JAbstractXMLOutputProcessor_1>) end;

  JDOMOutputProcessorClass = interface(IJavaClass)
    ['{0570E04A-77F4-478B-B194-6F0027C7292A}']
  end;

  [JavaSignature('org/jdom2/output/support/DOMOutputProcessor')]
  JDOMOutputProcessor = interface(IJavaInstance)
    ['{ACA30279-B19E-4425-B0BF-97DE7DC9A57D}']
    function process(document: JDocument; format: Joutput_Format; comment: Jjdom2_Comment): JComment; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; processingInstruction: Jjdom2_ProcessingInstruction): JProcessingInstruction; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; entityRef: JEntityRef): JEntityReference; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; attribute: JAttribute): JAttr; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; text: Jjdom2_Text): JText; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; document1: Jjdom2_Document): JDocument; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; element: Jjdom2_Element): JElement; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; list: JList): JList; cdecl; overload;
    function process(document: JDocument; format: Joutput_Format; cDATA: JCDATA): JCDATASection; cdecl; overload;
  end;
  TJDOMOutputProcessor = class(TJavaGenericImport<JDOMOutputProcessorClass, JDOMOutputProcessor>) end;

  JFormatStackClass = interface(JObjectClass)
    ['{BA51FE4E-EDF8-40F9-98CB-E3FEC0F3F27F}']
    {class} function init(format: Joutput_Format): JFormatStack; cdecl;
  end;

  [JavaSignature('org/jdom2/output/support/FormatStack')]
  JFormatStack = interface(JObject)
    ['{35E60A12-CBD0-404B-A1A9-BC1F063AD66B}']
    function getDefaultMode: JFormat_TextMode; cdecl;
    function getEncoding: JString; cdecl;
    function getEscapeOutput: Boolean; cdecl;
    function getEscapeStrategy: JEscapeStrategy; cdecl;
    function getIndent: JString; cdecl;
    function getLevelEOL: JString; cdecl;
    function getLevelIndent: JString; cdecl;
    function getLineSeparator: JString; cdecl;
    function getPadBetween: JString; cdecl;
    function getPadLast: JString; cdecl;
    function getTextMode: JFormat_TextMode; cdecl;
    function isExpandEmptyElements: Boolean; cdecl;
    function isIgnoreTrAXEscapingPIs: Boolean; cdecl;
    function isOmitDeclaration: Boolean; cdecl;
    function isOmitEncoding: Boolean; cdecl;
    function isSpecifiedAttributesOnly: Boolean; cdecl;
    procedure pop; cdecl;
    procedure push; cdecl;
    procedure setEscapeOutput(b: Boolean); cdecl;
    procedure setIgnoreTrAXEscapingPIs(b: Boolean); cdecl;
    procedure setLevelEOL(string_: JString); cdecl;
    procedure setLevelIndent(string_: JString); cdecl;
    procedure setTextMode(textMode: JFormat_TextMode); cdecl;
  end;
  TJFormatStack = class(TJavaGenericImport<JFormatStackClass, JFormatStack>) end;

  JFormatStack_1Class = interface(JObjectClass)
    ['{FCE5DCF1-0804-4C2A-8DD3-0439486BCE8E}']
  end;

  [JavaSignature('org/jdom2/output/support/FormatStack$1')]
  JFormatStack_1 = interface(JObject)
    ['{0A7E3D64-14D3-4CA2-9947-6BAD0FCBEE04}']
  end;
  TJFormatStack_1 = class(TJavaGenericImport<JFormatStack_1Class, JFormatStack_1>) end;

  JSAXOutputProcessorClass = interface(IJavaClass)
    ['{3C0A0C2C-2E32-4AB4-BABB-217E5E53B622}']
  end;

  [JavaSignature('org/jdom2/output/support/SAXOutputProcessor')]
  JSAXOutputProcessor = interface(IJavaInstance)
    ['{B198D0CC-5CD2-4829-828D-DAD1F58843C9}']
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; processingInstruction: Jjdom2_ProcessingInstruction); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; cDATA: JCDATA); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; text: Jjdom2_Text); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; comment: Jjdom2_Comment); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; list: JList); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; document: Jjdom2_Document); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; docType: JDocType); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; element: Jjdom2_Element); cdecl; overload;
    procedure process(sAXTarget: JSAXTarget; format: Joutput_Format; entityRef: JEntityRef); cdecl; overload;
    procedure processAsDocument(sAXTarget: JSAXTarget; format: Joutput_Format; list: JList); cdecl; overload;
    procedure processAsDocument(sAXTarget: JSAXTarget; format: Joutput_Format; element: Jjdom2_Element); cdecl; overload;
  end;
  TJSAXOutputProcessor = class(TJavaGenericImport<JSAXOutputProcessorClass, JSAXOutputProcessor>) end;

  JSAXTargetClass = interface(JObjectClass)
    ['{A0DC5985-6DEC-4837-A72B-FB93643FC9D1}']
    {class} function init(contentHandler: JContentHandler; errorHandler: JErrorHandler; dTDHandler: JDTDHandler; entityResolver: JEntityResolver; lexicalHandler: JLexicalHandler; declHandler: JDeclHandler; b: Boolean; b1: Boolean; string_: JString; string_1: JString): JSAXTarget; cdecl;
  end;

  [JavaSignature('org/jdom2/output/support/SAXTarget')]
  JSAXTarget = interface(JObject)
    ['{C677B5DB-D5E4-425F-903E-8468AC98B427}']
    function getContentHandler: JContentHandler; cdecl;
    function getDTDHandler: JDTDHandler; cdecl;
    function getDeclHandler: JDeclHandler; cdecl;
    function getEntityResolver: JEntityResolver; cdecl;
    function getErrorHandler: JErrorHandler; cdecl;
    function getLexicalHandler: JLexicalHandler; cdecl;
    function getLocator: JSAXTarget_SAXLocator; cdecl;
    function isDeclareNamespaces: Boolean; cdecl;
    function isReportDTDEvents: Boolean; cdecl;
  end;
  TJSAXTarget = class(TJavaGenericImport<JSAXTargetClass, JSAXTarget>) end;

  JSAXTarget_SAXLocatorClass = interface(JJDOMLocatorClass)
    ['{55B4BA57-5BC9-4A97-92C4-091B0B56AFB7}']
    {class} function init(string_: JString; string_1: JString): JSAXTarget_SAXLocator; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/support/SAXTarget$SAXLocator')]
  JSAXTarget_SAXLocator = interface(JJDOMLocator)
    ['{D82F6B46-092D-4CF0-A7BC-04CFE02B6F97}']
    function getColumnNumber: Integer; cdecl;
    function getLineNumber: Integer; cdecl;
    function getNode: JObject; cdecl;
    function getPublicId: JString; cdecl;
    function getSystemId: JString; cdecl;
    procedure setNode(object_: JObject); cdecl;
  end;
  TJSAXTarget_SAXLocator = class(TJavaGenericImport<JSAXTarget_SAXLocatorClass, JSAXTarget_SAXLocator>) end;

  JStAXEventProcessorClass = interface(IJavaClass)
    ['{40331140-7046-4302-B1D5-8A2666ED146D}']
  end;

  [JavaSignature('org/jdom2/output/support/StAXEventProcessor')]
  JStAXEventProcessor = interface(IJavaInstance)
    ['{BCE6894E-CB83-4E29-A49F-9B92B474B3CA}']
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; text: Jjdom2_Text); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; comment: Jjdom2_Comment); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; processingInstruction: Jjdom2_ProcessingInstruction); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; entityRef: JEntityRef); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; cDATA: JCDATA); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; document: Jjdom2_Document); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; docType: JDocType); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; element: Jjdom2_Element); cdecl; overload;
    //procedure process(xMLEventConsumer: JXMLEventConsumer; format: Joutput_Format; xMLEventFactory: JXMLEventFactory; list: JList); cdecl; overload;
  end;
  TJStAXEventProcessor = class(TJavaGenericImport<JStAXEventProcessorClass, JStAXEventProcessor>) end;

  JStAXStreamProcessorClass = interface(IJavaClass)
    ['{02A2681D-D1AD-4ABF-9620-2D73CEE9FABB}']
  end;

  [JavaSignature('org/jdom2/output/support/StAXStreamProcessor')]
  JStAXStreamProcessor = interface(IJavaInstance)
    ['{F02E01D6-4999-4B41-88F9-79B763F996B2}']
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; text: Jjdom2_Text); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; comment: Jjdom2_Comment); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; processingInstruction: Jjdom2_ProcessingInstruction); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; entityRef: JEntityRef); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; cDATA: JCDATA); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; document: Jjdom2_Document); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; docType: JDocType); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; element: Jjdom2_Element); cdecl; overload;
    //procedure process(xMLStreamWriter: JXMLStreamWriter; format: Joutput_Format; list: JList); cdecl; overload;
  end;
  TJStAXStreamProcessor = class(TJavaGenericImport<JStAXStreamProcessorClass, JStAXStreamProcessor>) end;

  JWalkerNORMALIZEClass = interface(JAbstractFormattedWalkerClass)
    ['{38918A67-7C25-410A-9A62-9AE6009B8AC2}']
    {class} function init(list: JList; formatStack: JFormatStack; b: Boolean): JWalkerNORMALIZE; cdecl;
  end;

  [JavaSignature('org/jdom2/output/support/WalkerNORMALIZE')]
  JWalkerNORMALIZE = interface(JAbstractFormattedWalker)
    ['{B276B326-B7BF-45E3-AC86-EE8F6D911995}']
  end;
  TJWalkerNORMALIZE = class(TJavaGenericImport<JWalkerNORMALIZEClass, JWalkerNORMALIZE>) end;

  JWalkerNORMALIZE_1Class = interface(JObjectClass)
    ['{5664CBA6-F7AE-42A4-AB44-A95CA5BF08C2}']
  end;

  [JavaSignature('org/jdom2/output/support/WalkerNORMALIZE$1')]
  JWalkerNORMALIZE_1 = interface(JObject)
    ['{4E260657-A5F7-4A66-8525-B75CB0F580D2}']
  end;
  TJWalkerNORMALIZE_1 = class(TJavaGenericImport<JWalkerNORMALIZE_1Class, JWalkerNORMALIZE_1>) end;

  JWalkerPRESERVEClass = interface(JWalkerClass)
    ['{61B9B9A2-139E-4981-9538-54FD34ABEC0A}']
    {class} function init(list: JList): JWalkerPRESERVE; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/support/WalkerPRESERVE')]
  JWalkerPRESERVE = interface(JWalker)
    ['{D916D14F-EE01-4FB0-94D6-43559F9FB839}']
    function hasNext: Boolean; cdecl;
    function isAllText: Boolean; cdecl;
    function isAllWhitespace: Boolean; cdecl;
    function isCDATA: Boolean; cdecl;
    function next: JContent; cdecl;
    function text: JString; cdecl;
  end;
  TJWalkerPRESERVE = class(TJavaGenericImport<JWalkerPRESERVEClass, JWalkerPRESERVE>) end;

  JWalkerPRESERVE_1Class = interface(JIteratorClass)
    ['{BA833EAF-DB39-488D-B0D5-6CA6FCC8206C}']
    {class} function init: JWalkerPRESERVE_1; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/output/support/WalkerPRESERVE$1')]
  JWalkerPRESERVE_1 = interface(JIterator)
    ['{B3E4DD8E-CD50-4201-A11A-887D685194CB}']
    function hasNext: Boolean; cdecl;
    function next: JContent; cdecl;
    procedure remove; cdecl;
  end;
  TJWalkerPRESERVE_1 = class(TJavaGenericImport<JWalkerPRESERVE_1Class, JWalkerPRESERVE_1>) end;

  JWalkerTRIMClass = interface(JAbstractFormattedWalkerClass)
    ['{49DC3DED-AFB7-4750-8F69-37ACA047A7DC}']
    {class} function init(list: JList; formatStack: JFormatStack; b: Boolean): JWalkerTRIM; cdecl;
  end;

  [JavaSignature('org/jdom2/output/support/WalkerTRIM')]
  JWalkerTRIM = interface(JAbstractFormattedWalker)
    ['{D18526B9-B16D-4609-ACF6-F9C8C0250312}']
  end;
  TJWalkerTRIM = class(TJavaGenericImport<JWalkerTRIMClass, JWalkerTRIM>) end;

  JWalkerTRIM_1Class = interface(JObjectClass)
    ['{602D85C8-72FA-4D30-91D3-45048A8AD117}']
  end;

  [JavaSignature('org/jdom2/output/support/WalkerTRIM$1')]
  JWalkerTRIM_1 = interface(JObject)
    ['{E2BD238B-A1C3-49A0-85AB-B8667B7FDA55}']
  end;
  TJWalkerTRIM_1 = class(TJavaGenericImport<JWalkerTRIM_1Class, JWalkerTRIM_1>) end;

  JWalkerTRIM_FULL_WHITEClass = interface(JAbstractFormattedWalkerClass)
    ['{C466D061-9548-4644-BB0D-93A51E2D4F4F}']
    {class} function init(list: JList; formatStack: JFormatStack; b: Boolean): JWalkerTRIM_FULL_WHITE; cdecl;
  end;

  [JavaSignature('org/jdom2/output/support/WalkerTRIM_FULL_WHITE')]
  JWalkerTRIM_FULL_WHITE = interface(JAbstractFormattedWalker)
    ['{8D806CBB-AFC2-48A0-8A65-04BC82AD0C35}']
  end;
  TJWalkerTRIM_FULL_WHITE = class(TJavaGenericImport<JWalkerTRIM_FULL_WHITEClass, JWalkerTRIM_FULL_WHITE>) end;

  JWalkerTRIM_FULL_WHITE_1Class = interface(JObjectClass)
    ['{F00220B1-3920-46CA-A5EB-32D61BA689E1}']
  end;

  [JavaSignature('org/jdom2/output/support/WalkerTRIM_FULL_WHITE$1')]
  JWalkerTRIM_FULL_WHITE_1 = interface(JObject)
    ['{5853A235-6751-4E1F-8173-EAE0FF2F83E3}']
  end;
  TJWalkerTRIM_FULL_WHITE_1 = class(TJavaGenericImport<JWalkerTRIM_FULL_WHITE_1Class, JWalkerTRIM_FULL_WHITE_1>) end;

  JXMLOutputProcessorClass = interface(IJavaClass)
    ['{D8BDA5B1-CD0C-4779-8C7E-C0F580C2E552}']
  end;

  [JavaSignature('org/jdom2/output/support/XMLOutputProcessor')]
  JXMLOutputProcessor = interface(IJavaInstance)
    ['{D66553CA-0CF8-46AA-BF79-9CB4BA647D17}']
    procedure process(writer: JWriter; format: Joutput_Format; text: Jjdom2_Text); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; comment: Jjdom2_Comment); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; processingInstruction: Jjdom2_ProcessingInstruction); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; entityRef: JEntityRef); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; cDATA: JCDATA); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; document: Jjdom2_Document); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; docType: JDocType); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; element: Jjdom2_Element); cdecl; overload;
    procedure process(writer: JWriter; format: Joutput_Format; list: JList); cdecl; overload;
  end;
  TJXMLOutputProcessor = class(TJavaGenericImport<JXMLOutputProcessorClass, JXMLOutputProcessor>) end;

  JJDOMResultClass = interface(JSAXResultClass)
    ['{274222DF-AD35-4D7C-A0BE-0F5419252B26}']
    {class} function _GetJDOM_FEATURE: JString; cdecl;
    {class} function init: JJDOMResult; cdecl;
    {class} property JDOM_FEATURE: JString read _GetJDOM_FEATURE;
  end;

  [JavaSignature('org/jdom2/transform/JDOMResult')]
  JJDOMResult = interface(JSAXResult)
    ['{791666BB-70A6-44A6-AA5F-3753CB0D5B42}']
    function getDocument: Jjdom2_Document; cdecl;
    function getFactory: JJDOMFactory; cdecl;
    function getResult: JList; cdecl;
    procedure setDocument(document: Jjdom2_Document); cdecl;
    procedure setFactory(jDOMFactory: JJDOMFactory); cdecl;
    procedure setHandler(contentHandler: JContentHandler); cdecl;
    procedure setLexicalHandler(lexicalHandler: JLexicalHandler); cdecl;
    procedure setResult(list: JList); cdecl;
  end;
  TJJDOMResult = class(TJavaGenericImport<JJDOMResultClass, JJDOMResult>) end;

  JXMLFilterImplClass = interface(JObjectClass)
    ['{1F61EE7C-CDDE-487D-8CFC-9CF63443A5A9}']
    {class} function init: JXMLFilterImpl; cdecl; overload;
    {class} function init(parent: JXMLReader): JXMLFilterImpl; cdecl; overload;
    {class} procedure endPrefixMapping(prefix: JString); cdecl;//Deprecated
    {class} procedure error(e: JSAXParseException); cdecl;//Deprecated
    {class} procedure fatalError(e: JSAXParseException); cdecl;//Deprecated
    {class} function getErrorHandler: JErrorHandler; cdecl;//Deprecated
    {class} function getFeature(name: JString): Boolean; cdecl;//Deprecated
    {class} function getParent: JXMLReader; cdecl;//Deprecated
    {class} procedure parse(input: JInputSource); cdecl; overload;
    {class} procedure parse(systemId: JString); cdecl; overload;
    {class} procedure processingInstruction(target: JString; data: JString); cdecl;
    {class} procedure setDocumentLocator(locator: JLocator); cdecl;
    {class} procedure setEntityResolver(resolver: JEntityResolver); cdecl;
    {class} procedure setProperty(name: JString; value: JObject); cdecl;
    {class} procedure skippedEntity(name: JString); cdecl;
    {class} procedure startDocument; cdecl;
    {class} procedure warning(e: JSAXParseException); cdecl;
  end;

  [JavaSignature('org/xml/sax/helpers/XMLFilterImpl')]
  JXMLFilterImpl = interface(JObject)
    ['{15BFC897-3716-4217-A357-BAF5B2A29BC3}']
    procedure characters(ch: TJavaArray<Char>; start: Integer; length: Integer); cdecl;//Deprecated
    procedure endDocument; cdecl;//Deprecated
    procedure endElement(uri: JString; localName: JString; qName: JString); cdecl;//Deprecated
    function getContentHandler: JContentHandler; cdecl;//Deprecated
    function getDTDHandler: JDTDHandler; cdecl;//Deprecated
    function getEntityResolver: JEntityResolver; cdecl;//Deprecated
    function getProperty(name: JString): JObject; cdecl;
    procedure ignorableWhitespace(ch: TJavaArray<Char>; start: Integer; length: Integer); cdecl;
    procedure notationDecl(name: JString; publicId: JString; systemId: JString); cdecl;
    function resolveEntity(publicId: JString; systemId: JString): JInputSource; cdecl;
    procedure setContentHandler(handler: JContentHandler); cdecl;
    procedure setDTDHandler(handler: JDTDHandler); cdecl;
    procedure setErrorHandler(handler: JErrorHandler); cdecl;
    procedure setFeature(name: JString; value: Boolean); cdecl;
    procedure setParent(parent: JXMLReader); cdecl;
    procedure startElement(uri: JString; localName: JString; qName: JString; atts: JAttributes); cdecl;
    procedure startPrefixMapping(prefix: JString; uri: JString); cdecl;
    procedure unparsedEntityDecl(name: JString; publicId: JString; systemId: JString; notationName: JString); cdecl;
  end;
  TJXMLFilterImpl = class(TJavaGenericImport<JXMLFilterImplClass, JXMLFilterImpl>) end;

  JJDOMResult_DocumentBuilderClass = interface(JXMLFilterImplClass)
    ['{C443D858-B862-4F03-B19B-BD5D87FF0054}']
    {class} function _Getthis: JJDOMResult; cdecl;
    {class} function init(jDOMResult: JJDOMResult): JJDOMResult_DocumentBuilder; cdecl;
    {class} property this: JJDOMResult read _Getthis;
  end;

  [JavaSignature('org/jdom2/transform/JDOMResult$DocumentBuilder')]
  JJDOMResult_DocumentBuilder = interface(JXMLFilterImpl)
    ['{C2616F10-D5D0-42BC-B937-95F096C4E50E}']
    procedure characters(c: TJavaArray<Char>; i: Integer; i1: Integer); cdecl;
    procedure comment(c: TJavaArray<Char>; i: Integer; i1: Integer); cdecl;
    procedure endCDATA; cdecl;
    procedure endDTD; cdecl;
    procedure endEntity(string_: JString); cdecl;
    function getResult: JList; cdecl;
    procedure ignorableWhitespace(c: TJavaArray<Char>; i: Integer; i1: Integer); cdecl;
    procedure processingInstruction(string_: JString; string_1: JString); cdecl;
    procedure skippedEntity(string_: JString); cdecl;
    procedure startCDATA; cdecl;
    procedure startDTD(string_: JString; string_1: JString; string_2: JString); cdecl;
    procedure startDocument; cdecl;
    procedure startElement(string_: JString; string_1: JString; string_2: JString; attributes: JAttributes); cdecl;
    procedure startEntity(string_: JString); cdecl;
    procedure startPrefixMapping(string_: JString; string_1: JString); cdecl;
  end;
  TJJDOMResult_DocumentBuilder = class(TJavaGenericImport<JJDOMResult_DocumentBuilderClass, JJDOMResult_DocumentBuilder>) end;

  JJDOMResult_FragmentHandlerClass = interface(JSAXHandlerClass)
    ['{DADCF166-BD78-450E-8492-B37B5D9B8D54}']
    {class} function init(jDOMFactory: JJDOMFactory): JJDOMResult_FragmentHandler; cdecl;
  end;

  [JavaSignature('org/jdom2/transform/JDOMResult$FragmentHandler')]
  JJDOMResult_FragmentHandler = interface(JSAXHandler)
    ['{0A5CFAF5-E5D8-43D2-BF7D-0816F2D655B3}']
    function getResult: JList; cdecl;
  end;
  TJJDOMResult_FragmentHandler = class(TJavaGenericImport<JJDOMResult_FragmentHandlerClass, JJDOMResult_FragmentHandler>) end;

  JJDOMSourceClass = interface(JSAXSourceClass)
    ['{6D273C18-A555-43BD-99B3-35EEC313FAA3}']
    {class} function _GetJDOM_FEATURE: JString; cdecl;
    {class} function init(document: Jjdom2_Document): JJDOMSource; cdecl; overload;
    {class} function init(list: JList): JJDOMSource; cdecl; overload;
    {class} function init(element: Jjdom2_Element): JJDOMSource; cdecl; overload;
    {class} function init(document: Jjdom2_Document; entityResolver: JEntityResolver): JJDOMSource; cdecl; overload;
    {class} property JDOM_FEATURE: JString read _GetJDOM_FEATURE;
  end;

  [JavaSignature('org/jdom2/transform/JDOMSource')]
  JJDOMSource = interface(JSAXSource)
    ['{FB89893C-7329-44E2-A7AE-E641E6A901B0}']
    function getDocument: Jjdom2_Document; cdecl;
    function getNodes: JList; cdecl;
    function getXMLReader: JXMLReader; cdecl;
    procedure setDocument(document: Jjdom2_Document); cdecl;
    procedure setInputSource(inputSource: JInputSource); cdecl;
    procedure setNodes(list: JList); cdecl;
    procedure setXMLReader(xMLReader: JXMLReader); cdecl;
  end;
  TJJDOMSource = class(TJavaGenericImport<JJDOMSourceClass, JJDOMSource>) end;

  JJDOMSource_DocumentReaderClass = interface(JSAXOutputterClass)
    ['{471EBC95-7627-4FD9-812C-5CA82A2E4BC3}']
    {class} function init: JJDOMSource_DocumentReader; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/transform/JDOMSource$DocumentReader')]
  JJDOMSource_DocumentReader = interface(JSAXOutputter)
    ['{361B21C6-D951-4AF3-9F74-E19133B6D0C7}']
    procedure parse(inputSource: JInputSource); cdecl; overload;
    procedure parse(string_: JString); cdecl; overload;
  end;
  TJJDOMSource_DocumentReader = class(TJavaGenericImport<JJDOMSource_DocumentReaderClass, JJDOMSource_DocumentReader>) end;

  JInputSourceClass = interface(JObjectClass)
    ['{FAC2FE74-F190-4198-8CC9-EC36D8178976}']
    {class} function init: JInputSource; cdecl; overload;
    {class} function init(systemId: JString): JInputSource; cdecl; overload;
    {class} function init(byteStream: JInputStream): JInputSource; cdecl; overload;
    {class} function init(characterStream: JReader): JInputSource; cdecl; overload;
    {class} function getByteStream: JInputStream; cdecl;//Deprecated
    {class} function getCharacterStream: JReader; cdecl;//Deprecated
    {class} function getEncoding: JString; cdecl;//Deprecated
    {class} procedure setByteStream(byteStream: JInputStream); cdecl;//Deprecated
    {class} procedure setCharacterStream(characterStream: JReader); cdecl;//Deprecated
    {class} procedure setEncoding(encoding: JString); cdecl;//Deprecated
  end;

  [JavaSignature('org/xml/sax/InputSource')]
  JInputSource = interface(JObject)
    ['{11A3F2D0-0A34-40F2-9F79-C838D30AB977}']
    function getPublicId: JString; cdecl;//Deprecated
    function getSystemId: JString; cdecl;//Deprecated
    procedure setPublicId(publicId: JString); cdecl;//Deprecated
    procedure setSystemId(systemId: JString); cdecl;//Deprecated
  end;
  TJInputSource = class(TJavaGenericImport<JInputSourceClass, JInputSource>) end;

  JJDOMSource_JDOMInputSourceClass = interface(JInputSourceClass)
    ['{219BAF6F-3642-4E87-ADC1-209BAF0E7C4B}']
    {class} function init(document: Jjdom2_Document): JJDOMSource_JDOMInputSource; cdecl; overload;
    {class} function init(list: JList): JJDOMSource_JDOMInputSource; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/transform/JDOMSource$JDOMInputSource')]
  JJDOMSource_JDOMInputSource = interface(JInputSource)
    ['{D8AD1B35-36B8-499B-9168-9FAF9D51BA0A}']
    function getCharacterStream: JReader; cdecl;
    function getDocumentSource: Jjdom2_Document; cdecl;
    function getListSource: JList; cdecl;
    function getSource: JObject; cdecl;
    procedure setByteStream(inputStream: JInputStream); cdecl;
    procedure setCharacterStream(reader: JReader); cdecl;
  end;
  TJJDOMSource_JDOMInputSource = class(TJavaGenericImport<JJDOMSource_JDOMInputSourceClass, JJDOMSource_JDOMInputSource>) end;

  JXSLTransformExceptionClass = interface(JJDOMExceptionClass)
    ['{945C8E71-E35C-4E2F-8CCC-E90CAD2DF7BB}']
    {class} function init: JXSLTransformException; cdecl; overload;
    {class} function init(string_: JString): JXSLTransformException; cdecl; overload;
    {class} function init(string_: JString; exception: JException): JXSLTransformException; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/transform/XSLTransformException')]
  JXSLTransformException = interface(JJDOMException)
    ['{A572F428-E97E-434F-8C28-B4B27F3A7919}']
  end;
  TJXSLTransformException = class(TJavaGenericImport<JXSLTransformExceptionClass, JXSLTransformException>) end;

  JXSLTransformerClass = interface(JObjectClass)
    ['{A04A4DA2-5669-4CA4-AC6A-F3824871F07E}']
    {class} function init(file_: JFile): JXSLTransformer; cdecl; overload;
    {class} function init(document: Jjdom2_Document): JXSLTransformer; cdecl; overload;
    {class} function init(string_: JString): JXSLTransformer; cdecl; overload;
    {class} function init(inputStream: JInputStream): JXSLTransformer; cdecl; overload;
    {class} function init(reader: JReader): JXSLTransformer; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/transform/XSLTransformer')]
  JXSLTransformer = interface(JObject)
    ['{3CD386CF-2ABE-4455-B310-96C7DC05F5CD}']
    function getFactory: JJDOMFactory; cdecl;
    procedure setFactory(jDOMFactory: JJDOMFactory); cdecl;
    function transform(list: JList): JList; cdecl; overload;
    function transform(document: Jjdom2_Document): Jjdom2_Document; cdecl; overload;
    function transform(document: Jjdom2_Document; entityResolver: JEntityResolver): Jjdom2_Document; cdecl; overload;
  end;
  TJXSLTransformer = class(TJavaGenericImport<JXSLTransformerClass, JXSLTransformer>) end;

  JNamespaceStackClass = interface(JIterableClass)
    ['{B1B9ABC1-C90B-4062-8123-29C22FF2A6D7}']
    {class} function init: JNamespaceStack; cdecl; overload;//Deprecated
    {class} function init(namespace: TJavaObjectArray<JNamespace>): JNamespaceStack; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/util/NamespaceStack')]
  JNamespaceStack = interface(JIterable)
    ['{84CB225C-5FB5-4BB1-9ED4-F61338E0DF8E}']
    function addedForward: JIterable; cdecl;
    function addedReverse: JIterable; cdecl;
    function getScope: TJavaObjectArray<JNamespace>; cdecl;
    function isInScope(namespace: JNamespace): Boolean; cdecl;
    function iterator: JIterator; cdecl;
    procedure pop; cdecl;
    procedure push(element: Jjdom2_Element); cdecl; overload;
    procedure push(attribute: JAttribute); cdecl; overload;
  end;
  TJNamespaceStack = class(TJavaGenericImport<JNamespaceStackClass, JNamespaceStack>) end;

  JNamespaceStack_1Class = interface(JComparatorClass)
    ['{A5D0E444-F92A-4B4A-A834-E11BDBBD1749}']
    {class} function init: JNamespaceStack_1; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/util/NamespaceStack$1')]
  JNamespaceStack_1 = interface(JComparator)
    ['{5FD71243-708A-4DAF-B168-15CF155B998C}']
    function compare(object_: JObject; object_1: JObject): Integer; cdecl; overload;
    function compare(namespace: JNamespace; namespace1: JNamespace): Integer; cdecl; overload;
  end;
  TJNamespaceStack_1 = class(TJavaGenericImport<JNamespaceStack_1Class, JNamespaceStack_1>) end;

  JNamespaceStack_BackwardWalkerClass = interface(JIteratorClass)
    ['{63C48440-CF50-4C81-B63C-BAA7EB2FC839}']
    {class} function _Getcursor: Integer; cdecl;
    {class} function init(namespace: TJavaObjectArray<JNamespace>): JNamespaceStack_BackwardWalker; cdecl;
    {class} property cursor: Integer read _Getcursor;
  end;

  [JavaSignature('org/jdom2/util/NamespaceStack$BackwardWalker')]
  JNamespaceStack_BackwardWalker = interface(JIterator)
    ['{1B52E841-3728-4FCB-A744-9015604AD9C7}']
    function hasNext: Boolean; cdecl;
    function next: JNamespace; cdecl;
    procedure remove; cdecl;
  end;
  TJNamespaceStack_BackwardWalker = class(TJavaGenericImport<JNamespaceStack_BackwardWalkerClass, JNamespaceStack_BackwardWalker>) end;

  JNamespaceStack_EmptyIterableClass = interface(JIterableClass)
    ['{C47E1469-1BB0-4DEE-BAA6-ECD01EEBEA20}']
    {class} function iterator: JIterator; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/util/NamespaceStack$EmptyIterable')]
  JNamespaceStack_EmptyIterable = interface(JIterable)
    ['{9573A88D-E4DF-4758-BAAE-B1800A946E13}']
    function hasNext: Boolean; cdecl;
    function next: JNamespace; cdecl;
    procedure remove; cdecl;
  end;
  TJNamespaceStack_EmptyIterable = class(TJavaGenericImport<JNamespaceStack_EmptyIterableClass, JNamespaceStack_EmptyIterable>) end;

  JNamespaceStack_ForwardWalkerClass = interface(JIteratorClass)
    ['{A3F701FD-0AB0-4994-A23A-7652B62EC701}']
    {class} function _Getcursor: Integer; cdecl;
    {class} function init(namespace: TJavaObjectArray<JNamespace>): JNamespaceStack_ForwardWalker; cdecl;
    {class} property cursor: Integer read _Getcursor;
  end;

  [JavaSignature('org/jdom2/util/NamespaceStack$ForwardWalker')]
  JNamespaceStack_ForwardWalker = interface(JIterator)
    ['{3822C7CF-9B0E-4D85-BB4E-777BD5056304}']
    function hasNext: Boolean; cdecl;
    function next: JNamespace; cdecl;
    procedure remove; cdecl;
  end;
  TJNamespaceStack_ForwardWalker = class(TJavaGenericImport<JNamespaceStack_ForwardWalkerClass, JNamespaceStack_ForwardWalker>) end;

  JNamespaceStack_NamespaceIterableClass = interface(JIterableClass)
    ['{E2B6263A-8F0B-4D64-876D-1D8F68017A51}']
    {class} function init(namespace: TJavaObjectArray<JNamespace>; b: Boolean): JNamespaceStack_NamespaceIterable; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/util/NamespaceStack$NamespaceIterable')]
  JNamespaceStack_NamespaceIterable = interface(JIterable)
    ['{DDA881F1-75A2-4D73-B207-AA6EE7AC6924}']
    function iterator: JIterator; cdecl;
  end;
  TJNamespaceStack_NamespaceIterable = class(TJavaGenericImport<JNamespaceStack_NamespaceIterableClass, JNamespaceStack_NamespaceIterable>) end;

  Jxpath_XPathClass = interface(JSerializableClass)
    ['{77BAEBBF-3B89-48C7-B25E-D675D2E13542}']
    {class} function _GetJDOM_OBJECT_MODEL_URI: JString; cdecl;
    {class} function init: Jxpath_XPath; cdecl;
    {class} function newInstance(string_: JString): Jxpath_XPath; cdecl;
    {class} function selectNodes(object_: JObject; string_: JString): JList; cdecl; overload;
    {class} function selectSingleNode(object_: JObject; string_: JString): JObject; cdecl; overload;
    {class} procedure setXPathClass(class_: Jlang_Class); cdecl;
    {class} property JDOM_OBJECT_MODEL_URI: JString read _GetJDOM_OBJECT_MODEL_URI;
  end;

  [JavaSignature('org/jdom2/xpath/XPath')]
  Jxpath_XPath = interface(JSerializable)
    ['{DC775C5A-86C9-4FE5-9884-A44C0967310D}']
    procedure addNamespace(namespace: JNamespace); cdecl; overload;
    procedure addNamespace(string_: JString; string_1: JString); cdecl; overload;
    function getXPath: JString; cdecl;
    function numberValueOf(object_: JObject): JNumber; cdecl;
    function selectNodes(object_: JObject): JList; cdecl; overload;
    function selectSingleNode(object_: JObject): JObject; cdecl; overload;
    procedure setVariable(string_: JString; object_: JObject); cdecl;
    function valueOf(object_: JObject): JString; cdecl;
  end;
  TJxpath_XPath = class(TJavaGenericImport<Jxpath_XPathClass, Jxpath_XPath>) end;

  JXPath_XPathStringClass = interface(JSerializableClass)
    ['{89CAC4A1-1E48-4FBF-A6A8-5877D09C6211}']
    {class} function init(string_: JString): JXPath_XPathString; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/xpath/XPath$XPathString')]
  JXPath_XPathString = interface(JSerializable)
    ['{93FCF7F6-6E26-4858-BF2D-907E8F6A4B48}']
  end;
  TJXPath_XPathString = class(TJavaGenericImport<JXPath_XPathStringClass, JXPath_XPathString>) end;

  JXPathBuilderClass = interface(JObjectClass)
    ['{8F149608-C880-4312-AE15-4AF8420FD4EC}']
    {class} function init(string_: JString; filter: Jfilter_Filter): JXPathBuilder; cdecl;
  end;

  [JavaSignature('org/jdom2/xpath/XPathBuilder')]
  JXPathBuilder = interface(JObject)
    ['{96D8EC81-9347-4FF0-A6BA-6D1F91F8D476}']
    function compileWith(xPathFactory: Jxpath_XPathFactory): Jxpath_XPathExpression; cdecl;
    function getExpression: JString; cdecl;
    function getFilter: Jfilter_Filter; cdecl;
    function getNamespace(string_: JString): JNamespace; cdecl;
    function getVariable(string_: JString): JObject; cdecl;
    function setNamespace(namespace: JNamespace): Boolean; cdecl; overload;
    function setNamespace(string_: JString; string_1: JString): Boolean; cdecl; overload;
    function setNamespaces(collection: JCollection): Boolean; cdecl;
    function setVariable(string_: JString; object_: JObject): Boolean; cdecl;
  end;
  TJXPathBuilder = class(TJavaGenericImport<JXPathBuilderClass, JXPathBuilder>) end;

  JXPathDiagnosticClass = interface(IJavaClass)
    ['{A40F2005-155E-45BC-AD38-E0FACA3AE1E4}']
  end;

  [JavaSignature('org/jdom2/xpath/XPathDiagnostic')]
  JXPathDiagnostic = interface(IJavaInstance)
    ['{96D018B3-63DD-404A-8796-7574839C2173}']
    function getContext: JObject; cdecl;
    function getFilteredResults: JList; cdecl;
    function getRawResults: JList; cdecl;
    function getResult: JList; cdecl;
    function getXPathExpression: Jxpath_XPathExpression; cdecl;
    function isFirstOnly: Boolean; cdecl;
  end;
  TJXPathDiagnostic = class(TJavaGenericImport<JXPathDiagnosticClass, JXPathDiagnostic>) end;

  Jxpath_XPathExpressionClass = interface(JCloneableClass)
    ['{AF2DD5C3-5145-480F-B39C-F7FEE23ACC35}']
  end;

  [JavaSignature('org/jdom2/xpath/XPathExpression')]
  Jxpath_XPathExpression = interface(JCloneable)
    ['{2E08254D-85DA-4D9D-8709-7646D0F34E4A}']
    function clone: Jxpath_XPathExpression; cdecl;
    function diagnose(object_: JObject; b: Boolean): JXPathDiagnostic; cdecl;
    function evaluate(object_: JObject): JList; cdecl;
    function evaluateFirst(object_: JObject): JObject; cdecl;
    function getExpression: JString; cdecl;
    function getFilter: Jfilter_Filter; cdecl;
    function getNamespace(string_: JString): JNamespace; cdecl;
    function getNamespaces: TJavaObjectArray<JNamespace>; cdecl;
    function getVariable(string_: JString): JObject; cdecl; overload;
    function getVariable(string_: JString; namespace: JNamespace): JObject; cdecl; overload;
    function setVariable(string_: JString; object_: JObject): JObject; cdecl; overload;
    function setVariable(string_: JString; namespace: JNamespace; object_: JObject): JObject; cdecl; overload;
  end;
  TJxpath_XPathExpression = class(TJavaGenericImport<Jxpath_XPathExpressionClass, Jxpath_XPathExpression>) end;

  Jxpath_XPathFactoryClass = interface(JObjectClass)
    ['{E18C4338-2189-4254-9391-AA94B5E735D1}']
    {class} function init: Jxpath_XPathFactory; cdecl;
    {class} function instance: Jxpath_XPathFactory; cdecl;
    {class} function newInstance(string_: JString): Jxpath_XPathFactory; cdecl;
  end;

  [JavaSignature('org/jdom2/xpath/XPathFactory')]
  Jxpath_XPathFactory = interface(JObject)
    ['{E239CB47-416C-47C4-BB07-87A57530922C}']
    function compile(string_: JString): Jxpath_XPathExpression; cdecl; overload;
    function compile(string_: JString; filter: Jfilter_Filter): Jxpath_XPathExpression; cdecl; overload;
    function compile(string_: JString; filter: Jfilter_Filter; map: JMap; collection: JCollection): Jxpath_XPathExpression; cdecl; overload;
  end;
  TJxpath_XPathFactory = class(TJavaGenericImport<Jxpath_XPathFactoryClass, Jxpath_XPathFactory>) end;

  JXPathHelperClass = interface(JObjectClass)
    ['{EA332B9C-DCC4-4DD3-8589-6611FD97FA83}']
    {class} function getAbsolutePath(content: JContent): JString; cdecl; overload;
    {class} function getAbsolutePath(attribute: JAttribute): JString; cdecl; overload;
    {class} function getRelativePath(attribute: JAttribute; content: JContent): JString; cdecl; overload;
    {class} function getRelativePath(content: JContent; content1: JContent): JString; cdecl; overload;
    {class} function getRelativePath(content: JContent; attribute: JAttribute): JString; cdecl; overload;
    {class} function getRelativePath(attribute: JAttribute; attribute1: JAttribute): JString; cdecl; overload;
  end;

  [JavaSignature('org/jdom2/xpath/XPathHelper')]
  JXPathHelper = interface(JObject)
    ['{555E3266-ECB2-428C-8A9D-901FD4D48C94}']
  end;
  TJXPathHelper = class(TJavaGenericImport<JXPathHelperClass, JXPathHelper>) end;

  // org.jdom2.xpath.jaxen.JDOMCoreNavigator
  // org.jdom2.xpath.jaxen.JDOM2Navigator
  // org.jdom2.xpath.jaxen.JDOMNavigator
  JJDOMXPathClass = interface(Jxpath_XPathClass)
    ['{DC7491BA-2E28-48FE-9660-08FFEFC88461}']
    {class} function init(string_: JString): JJDOMXPath; cdecl;
  end;

  [JavaSignature('org/jdom2/xpath/jaxen/JDOMXPath')]
  JJDOMXPath = interface(Jxpath_XPath)
    ['{C8DAAD9A-3571-4558-B470-FEC2F10C741E}']
    procedure addNamespace(namespace: JNamespace); cdecl;
    function getXPath: JString; cdecl;
    function numberValueOf(object_: JObject): JNumber; cdecl;
    function selectNodes(object_: JObject): JList; cdecl;
    function selectSingleNode(object_: JObject): JObject; cdecl;
    procedure setVariable(string_: JString; object_: JObject); cdecl;
    function toString: JString; cdecl;
    function valueOf(object_: JObject): JString; cdecl;
  end;
  TJJDOMXPath = class(TJavaGenericImport<JJDOMXPathClass, JJDOMXPath>) end;

  JAbstractXPathCompiledClass = interface(Jxpath_XPathExpressionClass)
    ['{AEBE2819-0B3E-4554-A55C-BF24544E304A}']
    {class} function init(string_: JString; filter: Jfilter_Filter; map: JMap; namespace: TJavaObjectArray<JNamespace>): JAbstractXPathCompiled; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/xpath/util/AbstractXPathCompiled')]
  JAbstractXPathCompiled = interface(Jxpath_XPathExpression)
    ['{6AE83226-F056-43A9-9E92-39A9157BB331}']
    function clone: Jxpath_XPathExpression; cdecl;
    function diagnose(object_: JObject; b: Boolean): JXPathDiagnostic; cdecl;
    function evaluate(object_: JObject): JList; cdecl;
    function evaluateFirst(object_: JObject): JObject; cdecl;
    function getExpression: JString; cdecl;
    function getFilter: Jfilter_Filter; cdecl;
    function getNamespace(string_: JString): JNamespace; cdecl;
    function getNamespaces: TJavaObjectArray<JNamespace>; cdecl;
    function getVariable(string_: JString): JObject; cdecl; overload;
    function getVariable(string_: JString; namespace: JNamespace): JObject; cdecl; overload;
    function setVariable(string_: JString; object_: JObject): JObject; cdecl; overload;
    function setVariable(string_: JString; namespace: JNamespace; object_: JObject): JObject; cdecl; overload;
    function toString: JString; cdecl;
  end;
  TJAbstractXPathCompiled = class(TJavaGenericImport<JAbstractXPathCompiledClass, JAbstractXPathCompiled>) end;

  JJaxenCompiledClass = interface(JAbstractXPathCompiledClass)
    ['{B9D01560-80CA-4F1E-B73E-1DA7406EA16D}']
    {class} function init(string_: JString; filter: Jfilter_Filter; map: JMap; namespace: TJavaObjectArray<JNamespace>): JJaxenCompiled; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/xpath/jaxen/JaxenCompiled')]
  JJaxenCompiled = interface(JAbstractXPathCompiled)
    ['{E2B6507B-1B0B-43CF-B7D6-AFBD0F6E89F7}']
    function clone: JJaxenCompiled; cdecl;
    function getVariableValue(string_: JString; string_1: JString; string_2: JString): JObject; cdecl;
    function translateNamespacePrefixToUri(string_: JString): JString; cdecl;
  end;
  TJJaxenCompiled = class(TJavaGenericImport<JJaxenCompiledClass, JJaxenCompiled>) end;

  JJaxenXPathFactoryClass = interface(Jxpath_XPathFactoryClass)
    ['{1F1730F5-DDDB-486D-B901-B342133DCD73}']
    {class} function init: JJaxenXPathFactory; cdecl;
  end;

  [JavaSignature('org/jdom2/xpath/jaxen/JaxenXPathFactory')]
  JJaxenXPathFactory = interface(Jxpath_XPathFactory)
    ['{65BF0F4E-2921-406E-B082-0C0932A98A43}']
  end;
  TJJaxenXPathFactory = class(TJavaGenericImport<JJaxenXPathFactoryClass, JJaxenXPathFactory>) end;

  JNamespaceContainerClass = interface(JObjectClass)
    ['{3D74F0A3-B774-4611-88B2-BFAE77EFCE7C}']
    {class} function init(namespace: JNamespace; element: Jjdom2_Element): JNamespaceContainer; cdecl;
  end;

  [JavaSignature('org/jdom2/xpath/jaxen/NamespaceContainer')]
  JNamespaceContainer = interface(JObject)
    ['{ABBC797E-2EF0-4A3D-800C-D2BA84AD659A}']
    function getNamespace: JNamespace; cdecl;
    function getParentElement: Jjdom2_Element; cdecl;
    function toString: JString; cdecl;
  end;
  TJNamespaceContainer = class(TJavaGenericImport<JNamespaceContainerClass, JNamespaceContainer>) end;

  JAbstractXPathCompiled_1Class = interface(JObjectClass)
    ['{63B02573-FB4E-4451-80D9-A553BAB17F4D}']
  end;

  [JavaSignature('org/jdom2/xpath/util/AbstractXPathCompiled$1')]
  JAbstractXPathCompiled_1 = interface(JObject)
    ['{27C27C7C-C88F-4100-B6F0-F0CB0C909D43}']
  end;
  TJAbstractXPathCompiled_1 = class(TJavaGenericImport<JAbstractXPathCompiled_1Class, JAbstractXPathCompiled_1>) end;

  JAbstractXPathCompiled_NamespaceComparatorClass = interface(JComparatorClass)
    ['{7BD33A11-84AE-4F48-9AEF-D5EF1F57A034}']
    {class} function compare(namespace: JNamespace; namespace1: JNamespace): Integer; cdecl; overload;//Deprecated
  end;

  [JavaSignature('org/jdom2/xpath/util/AbstractXPathCompiled$NamespaceComparator')]
  JAbstractXPathCompiled_NamespaceComparator = interface(JComparator)
    ['{9C543A5B-BBA2-4662-BD03-E87BE9D4C235}']
    function compare(object_: JObject; object_1: JObject): Integer; cdecl; overload;
  end;
  TJAbstractXPathCompiled_NamespaceComparator = class(TJavaGenericImport<JAbstractXPathCompiled_NamespaceComparatorClass, JAbstractXPathCompiled_NamespaceComparator>) end;

  JXPathDiagnosticImplClass = interface(JXPathDiagnosticClass)
    ['{E2FEA937-EBE2-47EB-9E5D-E8274919B483}']
    {class} function init(object_: JObject; xPathExpression: Jxpath_XPathExpression; list: JList; b: Boolean): JXPathDiagnosticImpl; cdecl;//Deprecated
  end;

  [JavaSignature('org/jdom2/xpath/util/XPathDiagnosticImpl')]
  JXPathDiagnosticImpl = interface(JXPathDiagnostic)
    ['{18C99430-5B67-4EAF-923B-C837CB7DE9AA}']
    function getContext: JObject; cdecl;
    function getFilteredResults: JList; cdecl;
    function getRawResults: JList; cdecl;
    function getResult: JList; cdecl;
    function getXPathExpression: Jxpath_XPathExpression; cdecl;
    function isFirstOnly: Boolean; cdecl;
    function toString: JString; cdecl;
  end;
  TJXPathDiagnosticImpl = class(TJavaGenericImport<JXPathDiagnosticImplClass, JXPathDiagnosticImpl>) end;

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
    {class} function appendChild(newChild: JNode): JNode; cdecl;
    {class} function cloneNode(deep: Boolean): JNode; cdecl;
    {class} function getChildNodes: JNodeList; cdecl;
    {class} function getFeature(feature: JString; version: JString): JObject; cdecl;
    {class} function getFirstChild: JNode; cdecl;
    {class} function getNextSibling: JNode; cdecl;
    {class} function getNodeName: JString; cdecl;
    {class} function getNodeType: SmallInt; cdecl;
    {class} function getPrefix: JString; cdecl;//Deprecated
    {class} function getPreviousSibling: JNode; cdecl;//Deprecated
    {class} function getTextContent: JString; cdecl;//Deprecated
    {class} function insertBefore(newChild: JNode; refChild: JNode): JNode; cdecl;//Deprecated
    {class} function isDefaultNamespace(namespaceURI: JString): Boolean; cdecl;//Deprecated
    {class} function lookupNamespaceURI(prefix: JString): JString; cdecl;//Deprecated
    {class} function lookupPrefix(namespaceURI: JString): JString; cdecl;//Deprecated
    {class} procedure normalize; cdecl;//Deprecated
    {class} procedure setPrefix(prefix: JString); cdecl;//Deprecated
    {class} procedure setTextContent(textContent: JString); cdecl;//Deprecated
    {class} function setUserData(key: JString; data: JObject; handler: JUserDataHandler): JObject; cdecl;//Deprecated
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
    function compareDocumentPosition(other: JNode): SmallInt; cdecl;
    function getAttributes: JNamedNodeMap; cdecl;
    function getBaseURI: JString; cdecl;
    function getLastChild: JNode; cdecl;
    function getLocalName: JString; cdecl;
    function getNamespaceURI: JString; cdecl;
    function getNodeValue: JString; cdecl;//Deprecated
    function getOwnerDocument: JDocument; cdecl;//Deprecated
    function getParentNode: JNode; cdecl;//Deprecated
    function getUserData(key: JString): JObject; cdecl;//Deprecated
    function hasAttributes: Boolean; cdecl;//Deprecated
    function hasChildNodes: Boolean; cdecl;//Deprecated
    function isEqualNode(arg: JNode): Boolean; cdecl;//Deprecated
    function isSameNode(other: JNode): Boolean; cdecl;//Deprecated
    function isSupported(feature: JString; version: JString): Boolean; cdecl;//Deprecated
    function removeChild(oldChild: JNode): JNode; cdecl;//Deprecated
    function replaceChild(newChild: JNode; oldChild: JNode): JNode; cdecl;//Deprecated
    procedure setNodeValue(nodeValue: JString); cdecl;//Deprecated
  end;
  TJNode = class(TJavaGenericImport<JNodeClass, JNode>) end;

  JAttrClass = interface(JNodeClass)
    ['{5FB044B8-0031-4520-B87A-3CDB994277D7}']
    {class} function getName: JString; cdecl;//Deprecated
    {class} function getValue: JString; cdecl;//Deprecated
    {class} function isId: Boolean; cdecl;//Deprecated
    {class} procedure setValue(value: JString); cdecl;//Deprecated
  end;

  [JavaSignature('org/w3c/dom/Attr')]
  JAttr = interface(JNode)
    ['{F9FC2FA5-CCAD-4D11-8B8D-3958C5F55273}']
    function getOwnerElement: JElement; cdecl;//Deprecated
    function getSchemaTypeInfo: JTypeInfo; cdecl;//Deprecated
    function getSpecified: Boolean; cdecl;//Deprecated
  end;
  TJAttr = class(TJavaGenericImport<JAttrClass, JAttr>) end;

  JCharacterDataClass = interface(JNodeClass)
    ['{2C17F389-87C1-444E-957E-9F54C1531B5A}']
    {class} procedure appendData(arg: JString); cdecl;//Deprecated
    {class} procedure deleteData(offset: Integer; count: Integer); cdecl;//Deprecated
    {class} procedure insertData(offset: Integer; arg: JString); cdecl;
    {class} procedure replaceData(offset: Integer; count: Integer; arg: JString); cdecl;
    {class} procedure setData(data: JString); cdecl;
  end;

  [JavaSignature('org/w3c/dom/CharacterData')]
  JCharacterData = interface(JNode)
    ['{10B18FAD-C168-4834-9BF9-996C53B31D9E}']
    function getData: JString; cdecl;
    function getLength: Integer; cdecl;
    function substringData(offset: Integer; count: Integer): JString; cdecl;
  end;
  TJCharacterData = class(TJavaGenericImport<JCharacterDataClass, JCharacterData>) end;

  JTextClass = interface(JCharacterDataClass)
    ['{A1698F81-D2B1-4131-A464-3E6A6ADD1D56}']
    {class} function replaceWholeText(content: JString): JText; cdecl;
    {class} function splitText(offset: Integer): JText; cdecl;
  end;

  [JavaSignature('org/w3c/dom/Text')]
  JText = interface(JCharacterData)
    ['{FAE4042A-1DDA-4B7D-BCFC-3C629B2818A4}']
    function getWholeText: JString; cdecl;
    function isElementContentWhitespace: Boolean; cdecl;
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
    {class} function hasFeature(feature: JString; version: JString): Boolean; cdecl;//Deprecated
  end;

  [JavaSignature('org/w3c/dom/DOMImplementation')]
  JDOMImplementation = interface(IJavaInstance)
    ['{B1DCFB4D-AA66-4B31-A161-7E7D420C0BD4}']
    function createDocument(namespaceURI: JString; qualifiedName: JString; doctype: JDocumentType): JDocument; cdecl;//Deprecated
    function createDocumentType(qualifiedName: JString; publicId: JString; systemId: JString): JDocumentType; cdecl;//Deprecated
    function getFeature(feature: JString; version: JString): JObject; cdecl;//Deprecated
  end;
  TJDOMImplementation = class(TJavaGenericImport<JDOMImplementationClass, JDOMImplementation>) end;

  JDOMStringListClass = interface(IJavaClass)
    ['{07E16943-A1B1-457E-B687-6BF0DC8A0B2B}']
    {class} function item(index: Integer): JString; cdecl;
  end;

  [JavaSignature('org/w3c/dom/DOMStringList')]
  JDOMStringList = interface(IJavaInstance)
    ['{429D640E-1DB3-442F-9ABF-98965BDEF484}']
    function &contains(str: JString): Boolean; cdecl;
    function getLength: Integer; cdecl;
  end;
  TJDOMStringList = class(TJavaGenericImport<JDOMStringListClass, JDOMStringList>) end;

  JDocumentClass = interface(JNodeClass)
    ['{D6F13E91-584B-40E3-98D4-A49B673E1FAA}']
    {class} function createAttributeNS(namespaceURI: JString; qualifiedName: JString): JAttr; cdecl;
    {class} function createCDATASection(data: JString): JCDATASection; cdecl;
    {class} function createComment(data: JString): JComment; cdecl;
    {class} function createEntityReference(name: JString): JEntityReference; cdecl;
    {class} function createProcessingInstruction(target: JString; data: JString): JProcessingInstruction; cdecl;
    {class} function createTextNode(data: JString): JText; cdecl;
    {class} function getDomConfig: JDOMConfiguration; cdecl;//Deprecated
    {class} function getElementById(elementId: JString): JElement; cdecl;//Deprecated
    {class} function getInputEncoding: JString; cdecl;//Deprecated
    {class} function getStrictErrorChecking: Boolean; cdecl;//Deprecated
    {class} function getXmlEncoding: JString; cdecl;//Deprecated
    {class} procedure normalizeDocument; cdecl;//Deprecated
    {class} function renameNode(n: JNode; namespaceURI: JString; qualifiedName: JString): JNode; cdecl;//Deprecated
    {class} procedure setDocumentURI(documentURI: JString); cdecl;//Deprecated
  end;

  [JavaSignature('org/w3c/dom/Document')]
  JDocument = interface(JNode)
    ['{A1A54941-AF47-44E3-9987-16699E7D7AE8}']
    function adoptNode(source: JNode): JNode; cdecl;
    function createAttribute(name: JString): JAttr; cdecl;
    function createDocumentFragment: JDocumentFragment; cdecl;
    function createElement(tagName: JString): JElement; cdecl;
    function createElementNS(namespaceURI: JString; qualifiedName: JString): JElement; cdecl;
    function getDoctype: JDocumentType; cdecl;//Deprecated
    function getDocumentElement: JElement; cdecl;//Deprecated
    function getDocumentURI: JString; cdecl;//Deprecated
    function getElementsByTagName(tagname: JString): JNodeList; cdecl;//Deprecated
    function getElementsByTagNameNS(namespaceURI: JString; localName: JString): JNodeList; cdecl;//Deprecated
    function getImplementation: JDOMImplementation; cdecl;//Deprecated
    function getXmlStandalone: Boolean; cdecl;//Deprecated
    function getXmlVersion: JString; cdecl;//Deprecated
    function importNode(importedNode: JNode; deep: Boolean): JNode; cdecl;//Deprecated
    procedure setStrictErrorChecking(strictErrorChecking: Boolean); cdecl;//Deprecated
    procedure setXmlStandalone(xmlStandalone: Boolean); cdecl;//Deprecated
    procedure setXmlVersion(xmlVersion: JString); cdecl;//Deprecated
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
    {class} function getEntities: JNamedNodeMap; cdecl;//Deprecated
    {class} function getInternalSubset: JString; cdecl;//Deprecated
    {class} function getName: JString; cdecl;//Deprecated
  end;

  [JavaSignature('org/w3c/dom/DocumentType')]
  JDocumentType = interface(JNode)
    ['{CFD608DB-450E-45EA-BEC6-B680E662E816}']
    function getNotations: JNamedNodeMap; cdecl;//Deprecated
    function getPublicId: JString; cdecl;//Deprecated
    function getSystemId: JString; cdecl;//Deprecated
  end;
  TJDocumentType = class(TJavaGenericImport<JDocumentTypeClass, JDocumentType>) end;

  JElementClass = interface(JNodeClass)
    ['{02A52262-29B4-4297-859E-FDCE017479D5}']
    {class} function getAttribute(name: JString): JString; cdecl;//Deprecated
    {class} function getElementsByTagName(name: JString): JNodeList; cdecl;
    {class} function getElementsByTagNameNS(namespaceURI: JString; localName: JString): JNodeList; cdecl;
    {class} function getSchemaTypeInfo: JTypeInfo; cdecl;
    {class} procedure removeAttribute(name: JString); cdecl;
    {class} procedure removeAttributeNS(namespaceURI: JString; localName: JString); cdecl;
    {class} function removeAttributeNode(oldAttr: JAttr): JAttr; cdecl;
    {class} function setAttributeNodeNS(newAttr: JAttr): JAttr; cdecl;
    {class} procedure setIdAttribute(name: JString; isId: Boolean); cdecl;
    {class} procedure setIdAttributeNS(namespaceURI: JString; localName: JString; isId: Boolean); cdecl;
  end;

  [JavaSignature('org/w3c/dom/Element')]
  JElement = interface(JNode)
    ['{953C1ADD-28E2-4725-95C9-B2E518AE79F9}']
    function getAttributeNS(namespaceURI: JString; localName: JString): JString; cdecl;
    function getAttributeNode(name: JString): JAttr; cdecl;
    function getAttributeNodeNS(namespaceURI: JString; localName: JString): JAttr; cdecl;
    function getTagName: JString; cdecl;
    function hasAttribute(name: JString): Boolean; cdecl;
    function hasAttributeNS(namespaceURI: JString; localName: JString): Boolean; cdecl;
    procedure setAttribute(name: JString; value: JString); cdecl;
    procedure setAttributeNS(namespaceURI: JString; qualifiedName: JString; value: JString); cdecl;
    function setAttributeNode(newAttr: JAttr): JAttr; cdecl;
    procedure setIdAttributeNode(idAttr: JAttr; isId: Boolean); cdecl;
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
    {class} function getLength: Integer; cdecl;//Deprecated
    {class} function removeNamedItem(name: JString): JNode; cdecl;//Deprecated
    {class} function removeNamedItemNS(namespaceURI: JString; localName: JString): JNode; cdecl;//Deprecated
    {class} function setNamedItem(arg: JNode): JNode; cdecl;//Deprecated
  end;

  [JavaSignature('org/w3c/dom/NamedNodeMap')]
  JNamedNodeMap = interface(IJavaInstance)
    ['{92F9509D-82EA-4290-A970-7BB551F08679}']
    function getNamedItem(name: JString): JNode; cdecl;//Deprecated
    function getNamedItemNS(namespaceURI: JString; localName: JString): JNode; cdecl;//Deprecated
    function item(index: Integer): JNode; cdecl;//Deprecated
    function setNamedItemNS(arg: JNode): JNode; cdecl;//Deprecated
  end;
  TJNamedNodeMap = class(TJavaGenericImport<JNamedNodeMapClass, JNamedNodeMap>) end;

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

  JProcessingInstructionClass = interface(JNodeClass)
    ['{9B71FB69-7682-435D-9031-529E15076309}']
    {class} procedure setData(data: JString); cdecl;
  end;

  [JavaSignature('org/w3c/dom/ProcessingInstruction')]
  JProcessingInstruction = interface(JNode)
    ['{50F37F5A-E5A2-4190-B19F-820997AF3D4C}']
    function getData: JString; cdecl;
    function getTarget: JString; cdecl;
  end;
  TJProcessingInstruction = class(TJavaGenericImport<JProcessingInstructionClass, JProcessingInstruction>) end;

  JTypeInfoClass = interface(IJavaClass)
    ['{532BAFC7-6829-43E4-9478-E739B90EE1FC}']
    {class} function _GetDERIVATION_EXTENSION: Integer; cdecl;
    {class} function _GetDERIVATION_LIST: Integer; cdecl;
    {class} function _GetDERIVATION_RESTRICTION: Integer; cdecl;
    {class} function _GetDERIVATION_UNION: Integer; cdecl;
    {class} function getTypeName: JString; cdecl;//Deprecated
    {class} function getTypeNamespace: JString; cdecl;//Deprecated
    {class} function isDerivedFrom(typeNamespaceArg: JString; typeNameArg: JString; derivationMethod: Integer): Boolean; cdecl;
    {class} property DERIVATION_EXTENSION: Integer read _GetDERIVATION_EXTENSION;
    {class} property DERIVATION_LIST: Integer read _GetDERIVATION_LIST;
    {class} property DERIVATION_RESTRICTION: Integer read _GetDERIVATION_RESTRICTION;
    {class} property DERIVATION_UNION: Integer read _GetDERIVATION_UNION;
  end;

  [JavaSignature('org/w3c/dom/TypeInfo')]
  JTypeInfo = interface(IJavaInstance)
    ['{876A11F9-8450-45FF-8F4F-F9D68333BDEF}']
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

  JLSInputClass = interface(IJavaClass)
    ['{343EBCC3-A455-42D0-BE5F-27458EF73A6D}']
    {class} function getBaseURI: JString; cdecl;
    {class} function getByteStream: JInputStream; cdecl;
    {class} function getPublicId: JString; cdecl;
    {class} function getStringData: JString; cdecl;
    {class} procedure setCertifiedText(certifiedText: Boolean); cdecl;//Deprecated
    {class} procedure setCharacterStream(characterStream: JReader); cdecl;//Deprecated
    {class} procedure setEncoding(encoding: JString); cdecl;//Deprecated
  end;

  [JavaSignature('org/w3c/dom/ls/LSInput')]
  JLSInput = interface(IJavaInstance)
    ['{120CFA0A-2195-4509-9ED3-9A8C9FA0C265}']
    function getCertifiedText: Boolean; cdecl;
    function getCharacterStream: JReader; cdecl;
    function getEncoding: JString; cdecl;
    function getSystemId: JString; cdecl;//Deprecated
    procedure setBaseURI(baseURI: JString); cdecl;//Deprecated
    procedure setByteStream(byteStream: JInputStream); cdecl;//Deprecated
    procedure setPublicId(publicId: JString); cdecl;//Deprecated
    procedure setStringData(stringData: JString); cdecl;//Deprecated
    procedure setSystemId(systemId: JString); cdecl;//Deprecated
  end;
  TJLSInput = class(TJavaGenericImport<JLSInputClass, JLSInput>) end;

  JLSResourceResolverClass = interface(IJavaClass)
    ['{E87E6CB0-9D8B-4457-927D-CE1A6D9F1A1C}']
  end;

  [JavaSignature('org/w3c/dom/ls/LSResourceResolver')]
  JLSResourceResolver = interface(IJavaInstance)
    ['{BC252BD6-C48A-4E24-80D4-9A091E2EB08C}']
    function resolveResource(type_: JString; namespaceURI: JString; publicId: JString; systemId: JString; baseURI: JString): JLSInput; cdecl;//Deprecated
  end;
  TJLSResourceResolver = class(TJavaGenericImport<JLSResourceResolverClass, JLSResourceResolver>) end;

  JAttributeListClass = interface(IJavaClass)
    ['{A5AE29C8-C9E3-403D-A7FA-E4B978DB4EB1}']
    {class} function getLength: Integer; cdecl;//Deprecated
    {class} function getName(i: Integer): JString; cdecl;//Deprecated
    {class} function getValue(name: JString): JString; cdecl; overload;//Deprecated
  end;

  [JavaSignature('org/xml/sax/AttributeList')]
  JAttributeList = interface(IJavaInstance)
    ['{3791AD5E-7C24-4970-8683-E834DE13B677}']
    function getType(i: Integer): JString; cdecl; overload;//Deprecated
    function getType(name: JString): JString; cdecl; overload;//Deprecated
    function getValue(i: Integer): JString; cdecl; overload;//Deprecated
  end;
  TJAttributeList = class(TJavaGenericImport<JAttributeListClass, JAttributeList>) end;

  JAttributesClass = interface(IJavaClass)
    ['{70024680-B111-4DD0-AD72-B5969DE3BB2A}']
    {class} function getIndex(uri: JString; localName: JString): Integer; cdecl; overload;//Deprecated
    {class} function getIndex(qName: JString): Integer; cdecl; overload;//Deprecated
    {class} function getLength: Integer; cdecl;//Deprecated
    {class} function getType(uri: JString; localName: JString): JString; cdecl; overload;
    {class} function getType(qName: JString): JString; cdecl; overload;
    {class} function getURI(index: Integer): JString; cdecl;
  end;

  [JavaSignature('org/xml/sax/Attributes')]
  JAttributes = interface(IJavaInstance)
    ['{9C3EDF11-0DB1-49AA-ADCA-23D64CB8DA1F}']
    function getLocalName(index: Integer): JString; cdecl;
    function getQName(index: Integer): JString; cdecl;
    function getType(index: Integer): JString; cdecl; overload;
    function getValue(index: Integer): JString; cdecl; overload;
    function getValue(uri: JString; localName: JString): JString; cdecl; overload;
    function getValue(qName: JString): JString; cdecl; overload;
  end;
  TJAttributes = class(TJavaGenericImport<JAttributesClass, JAttributes>) end;

  JContentHandlerClass = interface(IJavaClass)
    ['{BF81BC91-2D02-47BA-996E-FD19E94ABAF4}']
    {class} procedure endPrefixMapping(prefix: JString); cdecl;//Deprecated
    {class} procedure ignorableWhitespace(ch: TJavaArray<Char>; start: Integer; length: Integer); cdecl;//Deprecated
    {class} procedure processingInstruction(target: JString; data: JString); cdecl;//Deprecated
    {class} procedure startElement(uri: JString; localName: JString; qName: JString; atts: JAttributes); cdecl;//Deprecated
    {class} procedure startPrefixMapping(prefix: JString; uri: JString); cdecl;//Deprecated
  end;

  [JavaSignature('org/xml/sax/ContentHandler')]
  JContentHandler = interface(IJavaInstance)
    ['{1BBBA63E-CA11-4A2C-895A-0818230C8267}']
    procedure characters(ch: TJavaArray<Char>; start: Integer; length: Integer); cdecl;//Deprecated
    procedure endDocument; cdecl;//Deprecated
    procedure endElement(uri: JString; localName: JString; qName: JString); cdecl;//Deprecated
    procedure setDocumentLocator(locator: JLocator); cdecl;//Deprecated
    procedure skippedEntity(name: JString); cdecl;//Deprecated
    procedure startDocument; cdecl;//Deprecated
  end;
  TJContentHandler = class(TJavaGenericImport<JContentHandlerClass, JContentHandler>) end;

  JDTDHandlerClass = interface(IJavaClass)
    ['{9A4A5637-2A46-4816-BF52-4A17F86F47AC}']
  end;

  [JavaSignature('org/xml/sax/DTDHandler')]
  JDTDHandler = interface(IJavaInstance)
    ['{579ACA02-9490-4B1B-B60E-C219C64F8195}']
    procedure notationDecl(name: JString; publicId: JString; systemId: JString); cdecl;
    procedure unparsedEntityDecl(name: JString; publicId: JString; systemId: JString; notationName: JString); cdecl;
  end;
  TJDTDHandler = class(TJavaGenericImport<JDTDHandlerClass, JDTDHandler>) end;

  JDocumentHandlerClass = interface(IJavaClass)
    ['{7BE40631-6CAE-4B8A-88EA-05F91C456636}']
    {class} procedure ignorableWhitespace(ch: TJavaArray<Char>; start: Integer; length: Integer); cdecl;//Deprecated
    {class} procedure processingInstruction(target: JString; data: JString); cdecl;//Deprecated
    {class} procedure setDocumentLocator(locator: JLocator); cdecl;//Deprecated
  end;

  [JavaSignature('org/xml/sax/DocumentHandler')]
  JDocumentHandler = interface(IJavaInstance)
    ['{96CA0CA4-F827-4891-897C-72950A6EEA87}']
    procedure characters(ch: TJavaArray<Char>; start: Integer; length: Integer); cdecl;//Deprecated
    procedure endDocument; cdecl;//Deprecated
    procedure endElement(name: JString); cdecl;//Deprecated
    procedure startDocument; cdecl;//Deprecated
    procedure startElement(name: JString; atts: JAttributeList); cdecl;//Deprecated
  end;
  TJDocumentHandler = class(TJavaGenericImport<JDocumentHandlerClass, JDocumentHandler>) end;

  JEntityResolverClass = interface(IJavaClass)
    ['{9ED79F16-E4F0-42DE-AD6B-11127EC3AFF5}']
    {class} function resolveEntity(publicId: JString; systemId: JString): JInputSource; cdecl;
  end;

  [JavaSignature('org/xml/sax/EntityResolver')]
  JEntityResolver = interface(IJavaInstance)
    ['{2E130660-20A4-4747-A8EF-C0A4C1D53325}']
  end;
  TJEntityResolver = class(TJavaGenericImport<JEntityResolverClass, JEntityResolver>) end;

  JHandlerBaseClass = interface(JObjectClass)
    ['{8ED4A719-3D0B-4AAC-86B7-98F8F7E606D9}']
    {class} function init: JHandlerBase; cdecl;
    {class} procedure characters(ch: TJavaArray<Char>; start: Integer; length: Integer); cdecl;//Deprecated
    {class} procedure fatalError(e: JSAXParseException); cdecl;//Deprecated
    {class} procedure ignorableWhitespace(ch: TJavaArray<Char>; start: Integer; length: Integer); cdecl;//Deprecated
    {class} procedure notationDecl(name: JString; publicId: JString; systemId: JString); cdecl;//Deprecated
    {class} procedure startDocument; cdecl;//Deprecated
    {class} procedure startElement(name: JString; attributes: JAttributeList); cdecl;//Deprecated
    {class} procedure unparsedEntityDecl(name: JString; publicId: JString; systemId: JString; notationName: JString); cdecl;//Deprecated
  end;

  [JavaSignature('org/xml/sax/HandlerBase')]
  JHandlerBase = interface(JObject)
    ['{9F9F25A3-F85D-4EDC-85D1-5B5EC738BC7B}']
    procedure endDocument; cdecl;//Deprecated
    procedure endElement(name: JString); cdecl;//Deprecated
    procedure error(e: JSAXParseException); cdecl;//Deprecated
    procedure processingInstruction(target: JString; data: JString); cdecl;//Deprecated
    function resolveEntity(publicId: JString; systemId: JString): JInputSource; cdecl;//Deprecated
    procedure setDocumentLocator(locator: JLocator); cdecl;//Deprecated
    procedure warning(e: JSAXParseException); cdecl;//Deprecated
  end;
  TJHandlerBase = class(TJavaGenericImport<JHandlerBaseClass, JHandlerBase>) end;

  JParserClass = interface(IJavaClass)
    ['{1D6552DD-8E4E-4EC5-8939-BEDC5CB5653D}']
    {class} procedure parse(systemId: JString); cdecl; overload;
    {class} procedure setDTDHandler(handler: JDTDHandler); cdecl;
    {class} procedure setDocumentHandler(handler: JDocumentHandler); cdecl;
  end;

  [JavaSignature('org/xml/sax/Parser')]
  JParser = interface(IJavaInstance)
    ['{9FB4AD85-A040-43C5-9D48-826BFA51D7BC}']
    procedure parse(source: JInputSource); cdecl; overload;
    procedure setEntityResolver(resolver: JEntityResolver); cdecl;
    procedure setErrorHandler(handler: JErrorHandler); cdecl;
    procedure setLocale(locale: JLocale); cdecl;
  end;
  TJParser = class(TJavaGenericImport<JParserClass, JParser>) end;

  JSAXExceptionClass = interface(JExceptionClass)
    ['{12038E66-45B5-4356-AB90-52318A7B0E28}']
    {class} function init: JSAXException; cdecl; overload;
    {class} function init(message: JString): JSAXException; cdecl; overload;
    {class} function init(e: JException): JSAXException; cdecl; overload;
    {class} function init(message: JString; e: JException): JSAXException; cdecl; overload;
    {class} function getMessage: JString; cdecl;//Deprecated
    {class} function toString: JString; cdecl;//Deprecated
  end;

  [JavaSignature('org/xml/sax/SAXException')]
  JSAXException = interface(JException)
    ['{0308093C-445D-486E-81E0-DD54A53C7727}']
    function getException: JException; cdecl;//Deprecated
  end;
  TJSAXException = class(TJavaGenericImport<JSAXExceptionClass, JSAXException>) end;

  JSAXParseExceptionClass = interface(JSAXExceptionClass)
    ['{D4B1EAE3-6FFA-49A8-B007-B5FADF26474B}']
    {class} function init(message: JString; locator: JLocator): JSAXParseException; cdecl; overload;
    {class} function init(message: JString; locator: JLocator; e: JException): JSAXParseException; cdecl; overload;
    {class} function init(message: JString; publicId: JString; systemId: JString; lineNumber: Integer; columnNumber: Integer): JSAXParseException; cdecl; overload;
    {class} function init(message: JString; publicId: JString; systemId: JString; lineNumber: Integer; columnNumber: Integer; e: JException): JSAXParseException; cdecl; overload;
    {class} function getPublicId: JString; cdecl;//Deprecated
    {class} function getSystemId: JString; cdecl;//Deprecated
  end;

  [JavaSignature('org/xml/sax/SAXParseException')]
  JSAXParseException = interface(JSAXException)
    ['{A33B7A72-C4B9-458C-9D4B-ED31C0DEE7BD}']
    function getColumnNumber: Integer; cdecl;//Deprecated
    function getLineNumber: Integer; cdecl;//Deprecated
  end;
  TJSAXParseException = class(TJavaGenericImport<JSAXParseExceptionClass, JSAXParseException>) end;

  JXMLReaderClass = interface(IJavaClass)
    ['{2097436D-47DC-4D22-B9BA-A66A1BC2379E}']
    {class} function getDTDHandler: JDTDHandler; cdecl;
    {class} function getEntityResolver: JEntityResolver; cdecl;
    {class} function getErrorHandler: JErrorHandler; cdecl;
    {class} procedure parse(systemId: JString); cdecl; overload;//Deprecated
    {class} procedure setContentHandler(handler: JContentHandler); cdecl;//Deprecated
    {class} procedure setDTDHandler(handler: JDTDHandler); cdecl;//Deprecated
    {class} procedure setProperty(name: JString; value: JObject); cdecl;//Deprecated
  end;

  [JavaSignature('org/xml/sax/XMLReader')]
  JXMLReader = interface(IJavaInstance)
    ['{37490628-0A7F-46EF-8DE2-18E5F2C04A60}']
    function getContentHandler: JContentHandler; cdecl;
    function getFeature(name: JString): Boolean; cdecl;//Deprecated
    function getProperty(name: JString): JObject; cdecl;//Deprecated
    procedure parse(input: JInputSource); cdecl; overload;//Deprecated
    procedure setEntityResolver(resolver: JEntityResolver); cdecl;//Deprecated
    procedure setErrorHandler(handler: JErrorHandler); cdecl;//Deprecated
    procedure setFeature(name: JString; value: Boolean); cdecl;//Deprecated
  end;
  TJXMLReader = class(TJavaGenericImport<JXMLReaderClass, JXMLReader>) end;

  JXMLFilterClass = interface(JXMLReaderClass)
    ['{E7B71D66-2472-4BDD-9639-917D44EDB196}']
    {class} function getParent: JXMLReader; cdecl;
  end;

  [JavaSignature('org/xml/sax/XMLFilter')]
  JXMLFilter = interface(JXMLReader)
    ['{4A29831A-3F13-466C-81C0-79018E0EB094}']
    procedure setParent(parent: JXMLReader); cdecl;
  end;
  TJXMLFilter = class(TJavaGenericImport<JXMLFilterClass, JXMLFilter>) end;

  JDeclHandlerClass = interface(IJavaClass)
    ['{7FE18957-CEC7-415E-9EDA-35EC7252830E}']
    {class} procedure attributeDecl(eName: JString; aName: JString; type_: JString; mode: JString; value: JString); cdecl;
  end;

  [JavaSignature('org/xml/sax/ext/DeclHandler')]
  JDeclHandler = interface(IJavaInstance)
    ['{BDD385A0-ED9A-402B-9043-61D9A5D0804C}']
    procedure elementDecl(name: JString; model: JString); cdecl;//Deprecated
    procedure externalEntityDecl(name: JString; publicId: JString; systemId: JString); cdecl;//Deprecated
    procedure internalEntityDecl(name: JString; value: JString); cdecl;//Deprecated
  end;
  TJDeclHandler = class(TJavaGenericImport<JDeclHandlerClass, JDeclHandler>) end;

  JLexicalHandlerClass = interface(IJavaClass)
    ['{7DD72F8F-2322-4989-AADF-053BE3337682}']
    {class} procedure comment(ch: TJavaArray<Char>; start: Integer; length: Integer); cdecl;//Deprecated
    {class} procedure endCDATA; cdecl;//Deprecated
    {class} procedure endDTD; cdecl;//Deprecated
    {class} procedure startEntity(name: JString); cdecl;//Deprecated
  end;

  [JavaSignature('org/xml/sax/ext/LexicalHandler')]
  JLexicalHandler = interface(IJavaInstance)
    ['{889CF2C7-742F-4835-B451-A9C0E81C8348}']
    procedure endEntity(name: JString); cdecl;//Deprecated
    procedure startCDATA; cdecl;//Deprecated
    procedure startDTD(name: JString; publicId: JString; systemId: JString); cdecl;//Deprecated
  end;
  TJLexicalHandler = class(TJavaGenericImport<JLexicalHandlerClass, JLexicalHandler>) end;

implementation

procedure RegisterTypes;
begin
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAnimator', TypeInfo(JNI.Elgin.Daruma.JAnimator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAnimator_AnimatorListener', TypeInfo(JNI.Elgin.Daruma.JAnimator_AnimatorListener));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAnimator_AnimatorPauseListener', TypeInfo(JNI.Elgin.Daruma.JAnimator_AnimatorPauseListener));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JKeyframe', TypeInfo(JNI.Elgin.Daruma.JKeyframe));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLayoutTransition', TypeInfo(JNI.Elgin.Daruma.JLayoutTransition));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLayoutTransition_TransitionListener', TypeInfo(JNI.Elgin.Daruma.JLayoutTransition_TransitionListener));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPropertyValuesHolder', TypeInfo(JNI.Elgin.Daruma.JPropertyValuesHolder));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStateListAnimator', TypeInfo(JNI.Elgin.Daruma.JStateListAnimator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTimeInterpolator', TypeInfo(JNI.Elgin.Daruma.JTimeInterpolator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTypeConverter', TypeInfo(JNI.Elgin.Daruma.JTypeConverter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTypeEvaluator', TypeInfo(JNI.Elgin.Daruma.JTypeEvaluator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JValueAnimator', TypeInfo(JNI.Elgin.Daruma.JValueAnimator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JValueAnimator_AnimatorUpdateListener', TypeInfo(JNI.Elgin.Daruma.JValueAnimator_AnimatorUpdateListener));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUsbAccessory', TypeInfo(JNI.Elgin.Daruma.JUsbAccessory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUsbConfiguration', TypeInfo(JNI.Elgin.Daruma.JUsbConfiguration));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUsbDevice', TypeInfo(JNI.Elgin.Daruma.JUsbDevice));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUsbDeviceConnection', TypeInfo(JNI.Elgin.Daruma.JUsbDeviceConnection));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUsbEndpoint', TypeInfo(JNI.Elgin.Daruma.JUsbEndpoint));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUsbInterface', TypeInfo(JNI.Elgin.Daruma.JUsbInterface));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUsbManager', TypeInfo(JNI.Elgin.Daruma.JUsbManager));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUsbRequest', TypeInfo(JNI.Elgin.Daruma.JUsbRequest));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPathMotion', TypeInfo(JNI.Elgin.Daruma.JPathMotion));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JScene', TypeInfo(JNI.Elgin.Daruma.JScene));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTransition', TypeInfo(JNI.Elgin.Daruma.JTransition));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTransition_EpicenterCallback', TypeInfo(JNI.Elgin.Daruma.JTransition_EpicenterCallback));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTransition_TransitionListener', TypeInfo(JNI.Elgin.Daruma.JTransition_TransitionListener));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTransitionManager', TypeInfo(JNI.Elgin.Daruma.JTransitionManager));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTransitionPropagation', TypeInfo(JNI.Elgin.Daruma.JTransitionPropagation));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTransitionValues', TypeInfo(JNI.Elgin.Daruma.JTransitionValues));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInterpolator', TypeInfo(JNI.Elgin.Daruma.JInterpolator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JToolbar_LayoutParams', TypeInfo(JNI.Elgin.Daruma.JToolbar_LayoutParams));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAppInitializer', TypeInfo(JNI.Elgin.Daruma.JAppInitializer));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInitializationProvider', TypeInfo(JNI.Elgin.Daruma.JInitializationProvider));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInitializer', TypeInfo(JNI.Elgin.Daruma.JInitializer));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStartupException', TypeInfo(JNI.Elgin.Daruma.JStartupException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStartupLogger', TypeInfo(JNI.Elgin.Daruma.JStartupLogger));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPrinterManager_PrinterManagerListener', TypeInfo(JNI.Elgin.Daruma.JPrinterManager_PrinterManagerListener));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaMobile', TypeInfo(JNI.Elgin.Daruma.JDarumaMobile));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaMobile_1', TypeInfo(JNI.Elgin.Daruma.JDarumaMobile_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaMobile_2', TypeInfo(JNI.Elgin.Daruma.JDarumaMobile_2));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaMobile_3', TypeInfo(JNI.Elgin.Daruma.JDarumaMobile_3));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JITraceListener', TypeInfo(JNI.Elgin.Daruma.JITraceListener));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaMobile_LogMemoria', TypeInfo(JNI.Elgin.Daruma.JDarumaMobile_LogMemoria));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPrinterManager', TypeInfo(JNI.Elgin.Daruma.JPrinterManager));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPrinterManager_1', TypeInfo(JNI.Elgin.Daruma.JPrinterManager_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIPrinterCallback_Stub', TypeInfo(JNI.Elgin.Daruma.JIPrinterCallback_Stub));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPrinterManager_2', TypeInfo(JNI.Elgin.Daruma.JPrinterManager_2));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JThreadPoolManager', TypeInfo(JNI.Elgin.Daruma.JThreadPoolManager));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JZXingLibConfig', TypeInfo(JNI.Elgin.Daruma.JZXingLibConfig));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaConfigScanner', TypeInfo(JNI.Elgin.Daruma.JDarumaConfigScanner));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaDecoder', TypeInfo(JNI.Elgin.Daruma.JDarumaDecoder));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaScanResult', TypeInfo(JNI.Elgin.Daruma.JDarumaScanResult));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JISendHandler', TypeInfo(JNI.Elgin.Daruma.JISendHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaScanner', TypeInfo(JNI.Elgin.Daruma.JDarumaScanner));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaScannerHandler', TypeInfo(JNI.Elgin.Daruma.JDarumaScannerHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaScannerHandler_State', TypeInfo(JNI.Elgin.Daruma.JDarumaScannerHandler_State));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JBeepManager', TypeInfo(JNI.Elgin.Daruma.JBeepManager));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JBeepManager_1', TypeInfo(JNI.Elgin.Daruma.JBeepManager_1));
//  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDecodeAsyncTask', TypeInfo(JNI.Elgin.Daruma.JDecodeAsyncTask));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDecodeFormatManager', TypeInfo(JNI.Elgin.Daruma.JDecodeFormatManager));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDecodeHandler', TypeInfo(JNI.Elgin.Daruma.JDecodeHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDecodeThread', TypeInfo(JNI.Elgin.Daruma.JDecodeThread));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFinishListener', TypeInfo(JNI.Elgin.Daruma.JFinishListener));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInactivityTimer', TypeInfo(JNI.Elgin.Daruma.JInactivityTimer));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInactivityTimer_1', TypeInfo(JNI.Elgin.Daruma.JInactivityTimer_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInactivityTimer_DaemonThreadFactory', TypeInfo(JNI.Elgin.Daruma.JInactivityTimer_DaemonThreadFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInactivityTimer_PowerStatusReceiver', TypeInfo(JNI.Elgin.Daruma.JInactivityTimer_PowerStatusReceiver));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIntents', TypeInfo(JNI.Elgin.Daruma.JIntents));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIntents_Scan', TypeInfo(JNI.Elgin.Daruma.JIntents_Scan));
  //TRegTypes.RegisterType('JNI.Elgin.Daruma.JViewfinderResultPointCallback', TypeInfo(JNI.Elgin.Daruma.JViewfinderResultPointCallback));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JViewfinderView', TypeInfo(JNI.Elgin.Daruma.JViewfinderView));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAutoFocusCallback', TypeInfo(JNI.Elgin.Daruma.JAutoFocusCallback));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCameraConfigurationManager', TypeInfo(JNI.Elgin.Daruma.JCameraConfigurationManager));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jcamera_CameraManager', TypeInfo(JNI.Elgin.Daruma.Jcamera_CameraManager));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFlashlightManager', TypeInfo(JNI.Elgin.Daruma.JFlashlightManager));
  //TRegTypes.RegisterType('JNI.Elgin.Daruma.JPlanarYUVLuminanceSource', TypeInfo(JNI.Elgin.Daruma.JPlanarYUVLuminanceSource));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPreviewCallback', TypeInfo(JNI.Elgin.Daruma.JPreviewCallback));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIVariaveisScaner', TypeInfo(JNI.Elgin.Daruma.JIVariaveisScaner));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAComunicacao', TypeInfo(JNI.Elgin.Daruma.JAComunicacao));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jexception_DarumaException', TypeInfo(JNI.Elgin.Daruma.Jexception_DarumaException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jexception_DarumaComunicacaoException', TypeInfo(JNI.Elgin.Daruma.Jexception_DarumaComunicacaoException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaECFException', TypeInfo(JNI.Elgin.Daruma.JDarumaECFException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JBluetoothDaruma', TypeInfo(JNI.Elgin.Daruma.JBluetoothDaruma));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JBluetoothDaruma_ReadTask', TypeInfo(JNI.Elgin.Daruma.JBluetoothDaruma_ReadTask));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JComunicacaoNaoImpl', TypeInfo(JNI.Elgin.Daruma.JComunicacaoNaoImpl));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSerialDaruma', TypeInfo(JNI.Elgin.Daruma.JSerialDaruma));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSocketDaruma', TypeInfo(JNI.Elgin.Daruma.JSocketDaruma));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUsbDaruma', TypeInfo(JNI.Elgin.Daruma.JUsbDaruma));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConstantesFramework', TypeInfo(JNI.Elgin.Daruma.JConstantesFramework));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConstantesGenerico', TypeInfo(JNI.Elgin.Daruma.JConstantesGenerico));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConstantesSocket', TypeInfo(JNI.Elgin.Daruma.JConstantesSocket));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIConstantesComunicacao', TypeInfo(JNI.Elgin.Daruma.JIConstantesComunicacao));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaCheckedException', TypeInfo(JNI.Elgin.Daruma.JDarumaCheckedException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaException', TypeInfo(JNI.Elgin.Daruma.JDarumaException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaComunicacaoException', TypeInfo(JNI.Elgin.Daruma.JDarumaComunicacaoException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jexception_DarumaECFException', TypeInfo(JNI.Elgin.Daruma.Jexception_DarumaECFException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaSatException', TypeInfo(JNI.Elgin.Daruma.JDarumaSatException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaScanException', TypeInfo(JNI.Elgin.Daruma.JDarumaScanException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaWebServiceException', TypeInfo(JNI.Elgin.Daruma.JDarumaWebServiceException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jgne_Utils', TypeInfo(JNI.Elgin.Daruma.Jgne_Utils));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JBMP', TypeInfo(JNI.Elgin.Daruma.JBMP));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JOp_XmlConsulta', TypeInfo(JNI.Elgin.Daruma.JOp_XmlConsulta));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPersistencia', TypeInfo(JNI.Elgin.Daruma.JPersistencia));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPersistenciaAuxiliar', TypeInfo(JNI.Elgin.Daruma.JPersistenciaAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JProcessos', TypeInfo(JNI.Elgin.Daruma.JProcessos));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTags', TypeInfo(JNI.Elgin.Daruma.JTags));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFormatacao', TypeInfo(JNI.Elgin.Daruma.JFormatacao));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDaruma', TypeInfo(JNI.Elgin.Daruma.JDaruma));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDaruma_2100', TypeInfo(JNI.Elgin.Daruma.JDaruma_2100));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDaruma_250', TypeInfo(JNI.Elgin.Daruma.JDaruma_250));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDaruma_350', TypeInfo(JNI.Elgin.Daruma.JDaruma_350));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDascom', TypeInfo(JNI.Elgin.Daruma.JDascom));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDatec_250', TypeInfo(JNI.Elgin.Daruma.JDatec_250));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDatec_350', TypeInfo(JNI.Elgin.Daruma.JDatec_350));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEPSON', TypeInfo(JNI.Elgin.Daruma.JEPSON));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFormatacaoAscii', TypeInfo(JNI.Elgin.Daruma.JFormatacaoAscii));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JM10', TypeInfo(JNI.Elgin.Daruma.JM10));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNonus', TypeInfo(JNI.Elgin.Daruma.JNonus));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAberturaNfce', TypeInfo(JNI.Elgin.Daruma.JAberturaNfce));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAcrescimo', TypeInfo(JNI.Elgin.Daruma.JAcrescimo));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraCofinsAliq', TypeInfo(JNI.Elgin.Daruma.JConfiguraCofinsAliq));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraCofinsNT', TypeInfo(JNI.Elgin.Daruma.JConfiguraCofinsNT));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraCofinsOutr', TypeInfo(JNI.Elgin.Daruma.JConfiguraCofinsOutr));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraCofinsQtde', TypeInfo(JNI.Elgin.Daruma.JConfiguraCofinsQtde));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraCofinsSn', TypeInfo(JNI.Elgin.Daruma.JConfiguraCofinsSn));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraCombustivel', TypeInfo(JNI.Elgin.Daruma.JConfiguraCombustivel));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMS00', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMS00));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMS10', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMS10));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMS20', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMS20));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMS30', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMS30));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMS40', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMS40));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMS51', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMS51));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMS60', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMS60));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMS70', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMS70));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMS90', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMS90));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMSPart', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMSPart));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMSSN101', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMSSN101));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMSSN102', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMSSN102));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMSSN201', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMSSN201));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMSSN202', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMSSN202));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMSSN500', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMSSN500));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMSSN900', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMSSN900));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraICMSST', TypeInfo(JNI.Elgin.Daruma.JConfiguraICMSST));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraLeiImposto', TypeInfo(JNI.Elgin.Daruma.JConfiguraLeiImposto));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraPisAliq', TypeInfo(JNI.Elgin.Daruma.JConfiguraPisAliq));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraPisNT', TypeInfo(JNI.Elgin.Daruma.JConfiguraPisNT));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraPisOutr', TypeInfo(JNI.Elgin.Daruma.JConfiguraPisOutr));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraPisQtde', TypeInfo(JNI.Elgin.Daruma.JConfiguraPisQtde));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguraPisSn', TypeInfo(JNI.Elgin.Daruma.JConfiguraPisSn));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDescontos', TypeInfo(JNI.Elgin.Daruma.JDescontos));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEncerramento', TypeInfo(JNI.Elgin.Daruma.JEncerramento));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIdentificarConsumidor', TypeInfo(JNI.Elgin.Daruma.JIdentificarConsumidor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jnfce_Item', TypeInfo(JNI.Elgin.Daruma.Jnfce_Item));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JOp_XmlRetorno', TypeInfo(JNI.Elgin.Daruma.JOp_XmlRetorno));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jnfce_Layout', TypeInfo(JNI.Elgin.Daruma.Jnfce_Layout));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNFCe', TypeInfo(JNI.Elgin.Daruma.JNFCe));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPagamento', TypeInfo(JNI.Elgin.Daruma.JPagamento));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPagar', TypeInfo(JNI.Elgin.Daruma.JPagar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPagarComCartao', TypeInfo(JNI.Elgin.Daruma.JPagarComCartao));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTiposNFCe', TypeInfo(JNI.Elgin.Daruma.JTiposNFCe));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTotalizacao', TypeInfo(JNI.Elgin.Daruma.JTotalizacao));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTransportadora', TypeInfo(JNI.Elgin.Daruma.JTransportadora));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JVendeItem', TypeInfo(JNI.Elgin.Daruma.JVendeItem));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JVendeItemCompleto', TypeInfo(JNI.Elgin.Daruma.JVendeItemCompleto));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JObjetos', TypeInfo(JNI.Elgin.Daruma.JObjetos));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JOp_XmlAuxiliar', TypeInfo(JNI.Elgin.Daruma.JOp_XmlAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JOp_XmlCanc', TypeInfo(JNI.Elgin.Daruma.JOp_XmlCanc));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jxml_Op_XmlConsulta', TypeInfo(JNI.Elgin.Daruma.Jxml_Op_XmlConsulta));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JOp_XmlContingencia', TypeInfo(JNI.Elgin.Daruma.JOp_XmlContingencia));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JOp_XmlInutilizacao', TypeInfo(JNI.Elgin.Daruma.JOp_XmlInutilizacao));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXml_ElementosEnvioNFCe', TypeInfo(JNI.Elgin.Daruma.JXml_ElementosEnvioNFCe));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAux_XmlAvisoServ', TypeInfo(JNI.Elgin.Daruma.JAux_XmlAvisoServ));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAux_XmlIde', TypeInfo(JNI.Elgin.Daruma.JAux_XmlIde));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAux_XmlInfIntermed', TypeInfo(JNI.Elgin.Daruma.JAux_XmlInfIntermed));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAux_XmlNfce', TypeInfo(JNI.Elgin.Daruma.JAux_XmlNfce));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAux_XmlTransp', TypeInfo(JNI.Elgin.Daruma.JAux_XmlTransp));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAC', TypeInfo(JNI.Elgin.Daruma.JAC));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAL', TypeInfo(JNI.Elgin.Daruma.JAL));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAM', TypeInfo(JNI.Elgin.Daruma.JAM));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAP', TypeInfo(JNI.Elgin.Daruma.JAP));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JBA', TypeInfo(JNI.Elgin.Daruma.JBA));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCE', TypeInfo(JNI.Elgin.Daruma.JCE));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCideAuxiliar', TypeInfo(JNI.Elgin.Daruma.JCideAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinsAliqAuxiliar', TypeInfo(JNI.Elgin.Daruma.JCofinsAliqAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinsNtAuxiliar', TypeInfo(JNI.Elgin.Daruma.JCofinsNtAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinsOutrAuxiliar', TypeInfo(JNI.Elgin.Daruma.JCofinsOutrAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinsQtdeAuxiliar', TypeInfo(JNI.Elgin.Daruma.JCofinsQtdeAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinsSnAuxiliar', TypeInfo(JNI.Elgin.Daruma.JCofinsSnAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinsStAuxiliar', TypeInfo(JNI.Elgin.Daruma.JCofinsStAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCombAuxiliar', TypeInfo(JNI.Elgin.Daruma.JCombAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JConfiguracaoAuxiliar', TypeInfo(JNI.Elgin.Daruma.JConfiguracaoAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDF', TypeInfo(JNI.Elgin.Daruma.JDF));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JES', TypeInfo(JNI.Elgin.Daruma.JES));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JElementosXMLContingencia', TypeInfo(JNI.Elgin.Daruma.JElementosXMLContingencia));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JElementosXMlInutilizacao', TypeInfo(JNI.Elgin.Daruma.JElementosXMlInutilizacao));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JElementosXmlAuxiliar', TypeInfo(JNI.Elgin.Daruma.JElementosXmlAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JElementosXmlCancelamento', TypeInfo(JNI.Elgin.Daruma.JElementosXmlCancelamento));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEmail', TypeInfo(JNI.Elgin.Daruma.JEmail));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEmitAuxiliar', TypeInfo(JNI.Elgin.Daruma.JEmitAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEnderEmitAuxiliar', TypeInfo(JNI.Elgin.Daruma.JEnderEmitAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JGO', TypeInfo(JNI.Elgin.Daruma.JGO));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms00Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcms00Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms10Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcms10Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms20Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcms20Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms30Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcms30Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms40Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcms40Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms51Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcms51Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms60Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcms60Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms70Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcms70Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms90Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcms90Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcmsPartAuxiliar', TypeInfo(JNI.Elgin.Daruma.JIcmsPartAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcmsSn101Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcmsSn101Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcmsSn102Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcmsSn102Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcmsSn201Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcmsSn201Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcmsSn202Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcmsSn202Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcmsSn500Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcmsSn500Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcmsSn900Auxiliar', TypeInfo(JNI.Elgin.Daruma.JIcmsSn900Auxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcmsStAuxiliar', TypeInfo(JNI.Elgin.Daruma.JIcmsStAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInfRespTecAuxiliar', TypeInfo(JNI.Elgin.Daruma.JInfRespTecAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIssQnAuxiliar', TypeInfo(JNI.Elgin.Daruma.JIssQnAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLeiImposto', TypeInfo(JNI.Elgin.Daruma.JLeiImposto));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JMA', TypeInfo(JNI.Elgin.Daruma.JMA));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JMG', TypeInfo(JNI.Elgin.Daruma.JMG));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JMS', TypeInfo(JNI.Elgin.Daruma.JMS));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JMT', TypeInfo(JNI.Elgin.Daruma.JMT));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JMedAuxiliar', TypeInfo(JNI.Elgin.Daruma.JMedAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JMsgPromocional', TypeInfo(JNI.Elgin.Daruma.JMsgPromocional));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNT', TypeInfo(JNI.Elgin.Daruma.JNT));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPA', TypeInfo(JNI.Elgin.Daruma.JPA));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPB', TypeInfo(JNI.Elgin.Daruma.JPB));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPE', TypeInfo(JNI.Elgin.Daruma.JPE));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPI', TypeInfo(JNI.Elgin.Daruma.JPI));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPR', TypeInfo(JNI.Elgin.Daruma.JPR));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPisAliqAuxiliar', TypeInfo(JNI.Elgin.Daruma.JPisAliqAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPisNtAuxiliar', TypeInfo(JNI.Elgin.Daruma.JPisNtAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPisOutrAuxiliar', TypeInfo(JNI.Elgin.Daruma.JPisOutrAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPisQtdeAuxiliar', TypeInfo(JNI.Elgin.Daruma.JPisQtdeAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPisSnAuxiliar', TypeInfo(JNI.Elgin.Daruma.JPisSnAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPisStAuxiliar', TypeInfo(JNI.Elgin.Daruma.JPisStAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JProdAuxiliar', TypeInfo(JNI.Elgin.Daruma.JProdAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JRJ', TypeInfo(JNI.Elgin.Daruma.JRJ));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JRN', TypeInfo(JNI.Elgin.Daruma.JRN));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JRO', TypeInfo(JNI.Elgin.Daruma.JRO));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JRR', TypeInfo(JNI.Elgin.Daruma.JRR));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JRS', TypeInfo(JNI.Elgin.Daruma.JRS));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSC', TypeInfo(JNI.Elgin.Daruma.JSC));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSE', TypeInfo(JNI.Elgin.Daruma.JSE));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSP', TypeInfo(JNI.Elgin.Daruma.JSP));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTO', TypeInfo(JNI.Elgin.Daruma.JTO));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAberturaNfse', TypeInfo(JNI.Elgin.Daruma.JAberturaNfse));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEncerrarNFSe', TypeInfo(JNI.Elgin.Daruma.JEncerrarNFSe));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jxml_Op_XmlRetorno', TypeInfo(JNI.Elgin.Daruma.Jxml_Op_XmlRetorno));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jnfse_Layout', TypeInfo(JNI.Elgin.Daruma.Jnfse_Layout));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNFSe', TypeInfo(JNI.Elgin.Daruma.JNFSe));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTiposNFSe', TypeInfo(JNI.Elgin.Daruma.JTiposNFSe));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JVendeServNFSe', TypeInfo(JNI.Elgin.Daruma.JVendeServNFSe));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jxml_ElementosXmlAuxiliar', TypeInfo(JNI.Elgin.Daruma.Jxml_ElementosXmlAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JElementosXmlConsulta', TypeInfo(JNI.Elgin.Daruma.JElementosXmlConsulta));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEnderPrest', TypeInfo(JNI.Elgin.Daruma.JEnderPrest));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNfseAuxiliar', TypeInfo(JNI.Elgin.Daruma.JNfseAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jxml_Objetos', TypeInfo(JNI.Elgin.Daruma.Jxml_Objetos));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jxml_Op_XmlAuxiliar', TypeInfo(JNI.Elgin.Daruma.Jxml_Op_XmlAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jnfse_xml_Op_XmlConsulta', TypeInfo(JNI.Elgin.Daruma.Jnfse_xml_Op_XmlConsulta));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPrestador', TypeInfo(JNI.Elgin.Daruma.JPrestador));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXml_ElementosEnvioNFSe', TypeInfo(JNI.Elgin.Daruma.JXml_ElementosEnvioNFSe));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInterface_Sat', TypeInfo(JNI.Elgin.Daruma.JInterface_Sat));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jsat_Daruma', TypeInfo(JNI.Elgin.Daruma.Jsat_Daruma));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jsat_xml_Op_XmlRetorno', TypeInfo(JNI.Elgin.Daruma.Jsat_xml_Op_XmlRetorno));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jsat_Layout', TypeInfo(JNI.Elgin.Daruma.Jsat_Layout));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JParseNFCe_2_SAT', TypeInfo(JNI.Elgin.Daruma.JParseNFCe_2_SAT));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSat', TypeInfo(JNI.Elgin.Daruma.JSat));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSatCr', TypeInfo(JNI.Elgin.Daruma.JSatCr));
  //TRegTypes.RegisterType('JNI.Elgin.Daruma.JSatCrComunicacao', TypeInfo(JNI.Elgin.Daruma.JSatCrComunicacao));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSatCrComunicacao_UsbPermission', TypeInfo(JNI.Elgin.Daruma.JSatCrComunicacao_UsbPermission));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUrano', TypeInfo(JNI.Elgin.Daruma.JUrano));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCONFIGURACAO', TypeInfo(JNI.Elgin.Daruma.JCONFIGURACAO));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEMIT', TypeInfo(JNI.Elgin.Daruma.JEMIT));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIDENTIFICACAO_CFE', TypeInfo(JNI.Elgin.Daruma.JIDENTIFICACAO_CFE));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JISSQN', TypeInfo(JNI.Elgin.Daruma.JISSQN));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jsat_xml_Objetos', TypeInfo(JNI.Elgin.Daruma.Jsat_xml_Objetos));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jsat_xml_Op_XmlAuxiliar', TypeInfo(JNI.Elgin.Daruma.Jsat_xml_Op_XmlAuxiliar));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPROD', TypeInfo(JNI.Elgin.Daruma.JPROD));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXml_ElementosAux', TypeInfo(JNI.Elgin.Daruma.JXml_ElementosAux));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaLogger', TypeInfo(JNI.Elgin.Daruma.JDarumaLogger));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaLogger_LoggerDispatcherTrace', TypeInfo(JNI.Elgin.Daruma.JDarumaLogger_LoggerDispatcherTrace));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDarumaLoggerConst', TypeInfo(JNI.Elgin.Daruma.JDarumaLoggerConst));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPersistenciaJSON', TypeInfo(JNI.Elgin.Daruma.JPersistenciaJSON));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPersistenciaXML', TypeInfo(JNI.Elgin.Daruma.JPersistenciaXML));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSatNativo', TypeInfo(JNI.Elgin.Daruma.JSatNativo));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDescAcrEntr', TypeInfo(JNI.Elgin.Daruma.JDescAcrEntr));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDest', TypeInfo(JNI.Elgin.Daruma.JDest));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDet', TypeInfo(JNI.Elgin.Daruma.JDet));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JelementosCFe_Emit', TypeInfo(JNI.Elgin.Daruma.JelementosCFe_Emit));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEntrega', TypeInfo(JNI.Elgin.Daruma.JEntrega));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIde', TypeInfo(JNI.Elgin.Daruma.JIde));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInfAdic', TypeInfo(JNI.Elgin.Daruma.JInfAdic));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInfCFe', TypeInfo(JNI.Elgin.Daruma.JInfCFe));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JMeioDePagamento', TypeInfo(JNI.Elgin.Daruma.JMeioDePagamento));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPgto', TypeInfo(JNI.Elgin.Daruma.JPgto));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JelementosCFe_Prod', TypeInfo(JNI.Elgin.Daruma.JelementosCFe_Prod));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTotal', TypeInfo(JNI.Elgin.Daruma.JTotal));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofins', TypeInfo(JNI.Elgin.Daruma.JCofins));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinsaliq', TypeInfo(JNI.Elgin.Daruma.JCofinsaliq));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinsnt', TypeInfo(JNI.Elgin.Daruma.JCofinsnt));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinsoutr', TypeInfo(JNI.Elgin.Daruma.JCofinsoutr));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinsqtde', TypeInfo(JNI.Elgin.Daruma.JCofinsqtde));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinssn', TypeInfo(JNI.Elgin.Daruma.JCofinssn));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCofinsst', TypeInfo(JNI.Elgin.Daruma.JCofinsst));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms', TypeInfo(JNI.Elgin.Daruma.JIcms));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms00', TypeInfo(JNI.Elgin.Daruma.JIcms00));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcms40', TypeInfo(JNI.Elgin.Daruma.JIcms40));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcmssn102', TypeInfo(JNI.Elgin.Daruma.JIcmssn102));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIcmssn900', TypeInfo(JNI.Elgin.Daruma.JIcmssn900));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jimpostos_Issqn', TypeInfo(JNI.Elgin.Daruma.Jimpostos_Issqn));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPis', TypeInfo(JNI.Elgin.Daruma.JPis));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPisaliq', TypeInfo(JNI.Elgin.Daruma.JPisaliq));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPisnt', TypeInfo(JNI.Elgin.Daruma.JPisnt));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPisoutr', TypeInfo(JNI.Elgin.Daruma.JPisoutr));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPisqtde', TypeInfo(JNI.Elgin.Daruma.JPisqtde));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPissn', TypeInfo(JNI.Elgin.Daruma.JPissn));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPisst', TypeInfo(JNI.Elgin.Daruma.JPisst));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JxmlConfiguracao_Configuracao', TypeInfo(JNI.Elgin.Daruma.JxmlConfiguracao_Configuracao));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JxmlConfiguracao_Emit', TypeInfo(JNI.Elgin.Daruma.JxmlConfiguracao_Emit));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIdentificacaoCFe', TypeInfo(JNI.Elgin.Daruma.JIdentificacaoCFe));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JImposto', TypeInfo(JNI.Elgin.Daruma.JImposto));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JxmlConfiguracao_Prod', TypeInfo(JNI.Elgin.Daruma.JxmlConfiguracao_Prod));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAT_Framework_XML', TypeInfo(JNI.Elgin.Daruma.JSAT_Framework_XML));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JComunicacaoWS', TypeInfo(JNI.Elgin.Daruma.JComunicacaoWS));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JITServiceWs', TypeInfo(JNI.Elgin.Daruma.JITServiceWs));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTrustedManagerManipulator', TypeInfo(JNI.Elgin.Daruma.JTrustedManagerManipulator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTrustedManagerManipulator_1', TypeInfo(JNI.Elgin.Daruma.JTrustedManagerManipulator_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDadosConsulta', TypeInfo(JNI.Elgin.Daruma.JDadosConsulta));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInfoEmissao', TypeInfo(JNI.Elgin.Daruma.JInfoEmissao));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIPrinterCallback', TypeInfo(JNI.Elgin.Daruma.JIPrinterCallback));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIPrinterCallback_Default', TypeInfo(JNI.Elgin.Daruma.JIPrinterCallback_Default));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIPrinterCallback_Stub_Proxy', TypeInfo(JNI.Elgin.Daruma.JIPrinterCallback_Stub_Proxy));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIPrinterService', TypeInfo(JNI.Elgin.Daruma.JIPrinterService));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIPrinterService_Default', TypeInfo(JNI.Elgin.Daruma.JIPrinterService_Default));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIPrinterService_Stub', TypeInfo(JNI.Elgin.Daruma.JIPrinterService_Stub));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIPrinterService_Stub_Proxy', TypeInfo(JNI.Elgin.Daruma.JIPrinterService_Stub_Proxy));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jdarumamobile_BuildConfig', TypeInfo(JNI.Elgin.Daruma.Jdarumamobile_BuildConfig));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDataInput', TypeInfo(JNI.Elgin.Daruma.JDataInput));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFilterInputStream', TypeInfo(JNI.Elgin.Daruma.JFilterInputStream));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDataInputStream', TypeInfo(JNI.Elgin.Daruma.JDataInputStream));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIllegalArgumentException', TypeInfo(JNI.Elgin.Daruma.JIllegalArgumentException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JVoid', TypeInfo(JNI.Elgin.Daruma.JVoid));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JVector', TypeInfo(JNI.Elgin.Daruma.JVector));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXParser', TypeInfo(JNI.Elgin.Daruma.JSAXParser));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXParserFactory', TypeInfo(JNI.Elgin.Daruma.JSAXParserFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JResult', TypeInfo(JNI.Elgin.Daruma.JResult));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSource', TypeInfo(JNI.Elgin.Daruma.JSource));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXResult', TypeInfo(JNI.Elgin.Daruma.JSAXResult));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXSource', TypeInfo(JNI.Elgin.Daruma.JSAXSource));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSchema', TypeInfo(JNI.Elgin.Daruma.JSchema));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSchemaFactory', TypeInfo(JNI.Elgin.Daruma.JSchemaFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTypeInfoProvider', TypeInfo(JNI.Elgin.Daruma.JTypeInfoProvider));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JValidator', TypeInfo(JNI.Elgin.Daruma.JValidator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JValidatorHandler', TypeInfo(JNI.Elgin.Daruma.JValidatorHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCloneBase', TypeInfo(JNI.Elgin.Daruma.JCloneBase));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAttribute', TypeInfo(JNI.Elgin.Daruma.JAttribute));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jjdom2_AttributeList', TypeInfo(JNI.Elgin.Daruma.Jjdom2_AttributeList));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAttributeList_1', TypeInfo(JNI.Elgin.Daruma.JAttributeList_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAttributeList_ALIterator', TypeInfo(JNI.Elgin.Daruma.JAttributeList_ALIterator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAttributeType', TypeInfo(JNI.Elgin.Daruma.JAttributeType));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JContent', TypeInfo(JNI.Elgin.Daruma.JContent));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jjdom2_Text', TypeInfo(JNI.Elgin.Daruma.Jjdom2_Text));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCDATA', TypeInfo(JNI.Elgin.Daruma.JCDATA));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jjdom2_Comment', TypeInfo(JNI.Elgin.Daruma.Jjdom2_Comment));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JContent_CType', TypeInfo(JNI.Elgin.Daruma.JContent_CType));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JContentList', TypeInfo(JNI.Elgin.Daruma.JContentList));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JContentList_1', TypeInfo(JNI.Elgin.Daruma.JContentList_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JContentList_CLIterator', TypeInfo(JNI.Elgin.Daruma.JContentList_CLIterator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JContentList_CLListIterator', TypeInfo(JNI.Elgin.Daruma.JContentList_CLListIterator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JContentList_FilterList', TypeInfo(JNI.Elgin.Daruma.JContentList_FilterList));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JContentList_FilterListIterator', TypeInfo(JNI.Elgin.Daruma.JContentList_FilterListIterator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMException', TypeInfo(JNI.Elgin.Daruma.JJDOMException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDataConversionException', TypeInfo(JNI.Elgin.Daruma.JDataConversionException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMFactory', TypeInfo(JNI.Elgin.Daruma.JJDOMFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDefaultJDOMFactory', TypeInfo(JNI.Elgin.Daruma.JDefaultJDOMFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIteratorIterable', TypeInfo(JNI.Elgin.Daruma.JIteratorIterable));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDescendantIterator', TypeInfo(JNI.Elgin.Daruma.JDescendantIterator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDocType', TypeInfo(JNI.Elgin.Daruma.JDocType));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jjdom2_Document', TypeInfo(JNI.Elgin.Daruma.Jjdom2_Document));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jjdom2_Element', TypeInfo(JNI.Elgin.Daruma.Jjdom2_Element));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEntityRef', TypeInfo(JNI.Elgin.Daruma.JEntityRef));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFilterIterator', TypeInfo(JNI.Elgin.Daruma.JFilterIterator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIllegalAddException', TypeInfo(JNI.Elgin.Daruma.JIllegalAddException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIllegalDataException', TypeInfo(JNI.Elgin.Daruma.JIllegalDataException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIllegalNameException', TypeInfo(JNI.Elgin.Daruma.JIllegalNameException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JIllegalTargetException', TypeInfo(JNI.Elgin.Daruma.JIllegalTargetException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMConstants', TypeInfo(JNI.Elgin.Daruma.JJDOMConstants));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNamespace', TypeInfo(JNI.Elgin.Daruma.JNamespace));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNamespace_NamespaceSerializationProxy', TypeInfo(JNI.Elgin.Daruma.JNamespace_NamespaceSerializationProxy));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNamespaceAware', TypeInfo(JNI.Elgin.Daruma.JNamespaceAware));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JParent', TypeInfo(JNI.Elgin.Daruma.JParent));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jjdom2_ProcessingInstruction', TypeInfo(JNI.Elgin.Daruma.Jjdom2_ProcessingInstruction));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSlimJDOMFactory', TypeInfo(JNI.Elgin.Daruma.JSlimJDOMFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStringBin', TypeInfo(JNI.Elgin.Daruma.JStringBin));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUncheckedJDOMFactory', TypeInfo(JNI.Elgin.Daruma.JUncheckedJDOMFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JVerifier', TypeInfo(JNI.Elgin.Daruma.JVerifier));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDOMAdapter', TypeInfo(JNI.Elgin.Daruma.JDOMAdapter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractDOMAdapter', TypeInfo(JNI.Elgin.Daruma.JAbstractDOMAdapter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJAXPDOMAdapter', TypeInfo(JNI.Elgin.Daruma.JJAXPDOMAdapter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jfilter_Filter', TypeInfo(JNI.Elgin.Daruma.Jfilter_Filter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractFilter', TypeInfo(JNI.Elgin.Daruma.JAbstractFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAndFilter', TypeInfo(JNI.Elgin.Daruma.JAndFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAttributeFilter', TypeInfo(JNI.Elgin.Daruma.JAttributeFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JClassFilter', TypeInfo(JNI.Elgin.Daruma.JClassFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JContentFilter', TypeInfo(JNI.Elgin.Daruma.JContentFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JElementFilter', TypeInfo(JNI.Elgin.Daruma.JElementFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jfilter_Filters', TypeInfo(JNI.Elgin.Daruma.Jfilter_Filters));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNegateFilter', TypeInfo(JNI.Elgin.Daruma.JNegateFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JOrFilter', TypeInfo(JNI.Elgin.Daruma.JOrFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JPassThroughFilter', TypeInfo(JNI.Elgin.Daruma.JPassThroughFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTextOnlyFilter', TypeInfo(JNI.Elgin.Daruma.JTextOnlyFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDOMBuilder', TypeInfo(JNI.Elgin.Daruma.JDOMBuilder));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMParseException', TypeInfo(JNI.Elgin.Daruma.JJDOMParseException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXEngine', TypeInfo(JNI.Elgin.Daruma.JSAXEngine));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXBuilder', TypeInfo(JNI.Elgin.Daruma.JSAXBuilder));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStAXEventBuilder', TypeInfo(JNI.Elgin.Daruma.JStAXEventBuilder));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStAXStreamBuilder', TypeInfo(JNI.Elgin.Daruma.JStAXStreamBuilder));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReaderJDOMFactory', TypeInfo(JNI.Elgin.Daruma.JXMLReaderJDOMFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractReaderSchemaFactory', TypeInfo(JNI.Elgin.Daruma.JAbstractReaderSchemaFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractReaderXSDFactory', TypeInfo(JNI.Elgin.Daruma.JAbstractReaderXSDFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractReaderXSDFactory_SchemaFactoryProvider', TypeInfo(JNI.Elgin.Daruma.JAbstractReaderXSDFactory_SchemaFactoryProvider));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JErrorHandler', TypeInfo(JNI.Elgin.Daruma.JErrorHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JBuilderErrorHandler', TypeInfo(JNI.Elgin.Daruma.JBuilderErrorHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXHandlerFactory', TypeInfo(JNI.Elgin.Daruma.JSAXHandlerFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDefaultSAXHandlerFactory', TypeInfo(JNI.Elgin.Daruma.JDefaultSAXHandlerFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDefaultHandler', TypeInfo(JNI.Elgin.Daruma.JDefaultHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXHandler', TypeInfo(JNI.Elgin.Daruma.JSAXHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDefaultSAXHandlerFactory_DefaultSAXHandler', TypeInfo(JNI.Elgin.Daruma.JDefaultSAXHandlerFactory_DefaultSAXHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXBuilderEngine', TypeInfo(JNI.Elgin.Daruma.JSAXBuilderEngine));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTextBuffer', TypeInfo(JNI.Elgin.Daruma.JTextBuffer));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReaderJAXPFactory', TypeInfo(JNI.Elgin.Daruma.JXMLReaderJAXPFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReaderSAX2Factory', TypeInfo(JNI.Elgin.Daruma.JXMLReaderSAX2Factory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReaderSchemaFactory', TypeInfo(JNI.Elgin.Daruma.JXMLReaderSchemaFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReaderXSDFactory', TypeInfo(JNI.Elgin.Daruma.JXMLReaderXSDFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReaderXSDFactory_1', TypeInfo(JNI.Elgin.Daruma.JXMLReaderXSDFactory_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReaders', TypeInfo(JNI.Elgin.Daruma.JXMLReaders));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReaders_DTDSingleton', TypeInfo(JNI.Elgin.Daruma.JXMLReaders_DTDSingleton));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReaders_FactorySupplier', TypeInfo(JNI.Elgin.Daruma.JXMLReaders_FactorySupplier));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReaders_NONSingleton', TypeInfo(JNI.Elgin.Daruma.JXMLReaders_NONSingleton));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReaders_XSDSingleton', TypeInfo(JNI.Elgin.Daruma.JXMLReaders_XSDSingleton));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jpackage_info', TypeInfo(JNI.Elgin.Daruma.Jpackage_info));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDTDParser', TypeInfo(JNI.Elgin.Daruma.JDTDParser));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStAXFilter', TypeInfo(JNI.Elgin.Daruma.JStAXFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDefaultStAXFilter', TypeInfo(JNI.Elgin.Daruma.JDefaultStAXFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jstax_package_info', TypeInfo(JNI.Elgin.Daruma.Jstax_package_info));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JArrayCopy', TypeInfo(JNI.Elgin.Daruma.JArrayCopy));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JReflectionConstructor', TypeInfo(JNI.Elgin.Daruma.JReflectionConstructor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSystemProperty', TypeInfo(JNI.Elgin.Daruma.JSystemProperty));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLocated', TypeInfo(JNI.Elgin.Daruma.JLocated));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLocatedCDATA', TypeInfo(JNI.Elgin.Daruma.JLocatedCDATA));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLocatedComment', TypeInfo(JNI.Elgin.Daruma.JLocatedComment));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLocatedDocType', TypeInfo(JNI.Elgin.Daruma.JLocatedDocType));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLocatedElement', TypeInfo(JNI.Elgin.Daruma.JLocatedElement));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLocatedEntityRef', TypeInfo(JNI.Elgin.Daruma.JLocatedEntityRef));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLocatedJDOMFactory', TypeInfo(JNI.Elgin.Daruma.JLocatedJDOMFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLocatedProcessingInstruction', TypeInfo(JNI.Elgin.Daruma.JLocatedProcessingInstruction));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLocatedText', TypeInfo(JNI.Elgin.Daruma.JLocatedText));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDOMOutputter', TypeInfo(JNI.Elgin.Daruma.JDOMOutputter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDOMOutputter_1', TypeInfo(JNI.Elgin.Daruma.JDOMOutputter_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractOutputProcessor', TypeInfo(JNI.Elgin.Daruma.JAbstractOutputProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractDOMOutputProcessor', TypeInfo(JNI.Elgin.Daruma.JAbstractDOMOutputProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDOMOutputter_DefaultDOMOutputProcessor', TypeInfo(JNI.Elgin.Daruma.JDOMOutputter_DefaultDOMOutputProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEscapeStrategy', TypeInfo(JNI.Elgin.Daruma.JEscapeStrategy));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Joutput_Format', TypeInfo(JNI.Elgin.Daruma.Joutput_Format));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFormat_1', TypeInfo(JNI.Elgin.Daruma.JFormat_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFormat_DefaultCharsetEscapeStrategy', TypeInfo(JNI.Elgin.Daruma.JFormat_DefaultCharsetEscapeStrategy));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFormat_EscapeStrategy7Bits', TypeInfo(JNI.Elgin.Daruma.JFormat_EscapeStrategy7Bits));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFormat_EscapeStrategy8Bits', TypeInfo(JNI.Elgin.Daruma.JFormat_EscapeStrategy8Bits));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFormat_EscapeStrategyUTF', TypeInfo(JNI.Elgin.Daruma.JFormat_EscapeStrategyUTF));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFormat_TextMode', TypeInfo(JNI.Elgin.Daruma.JFormat_TextMode));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLocator', TypeInfo(JNI.Elgin.Daruma.JLocator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMLocator', TypeInfo(JNI.Elgin.Daruma.JJDOMLocator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLineSeparator', TypeInfo(JNI.Elgin.Daruma.JLineSeparator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXOutputter', TypeInfo(JNI.Elgin.Daruma.JSAXOutputter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXOutputter_1', TypeInfo(JNI.Elgin.Daruma.JSAXOutputter_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractSAXOutputProcessor', TypeInfo(JNI.Elgin.Daruma.JAbstractSAXOutputProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXOutputter_DefaultSAXOutputProcessor', TypeInfo(JNI.Elgin.Daruma.JSAXOutputter_DefaultSAXOutputProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStAXEventOutputter', TypeInfo(JNI.Elgin.Daruma.JStAXEventOutputter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStAXEventOutputter_1', TypeInfo(JNI.Elgin.Daruma.JStAXEventOutputter_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractStAXEventProcessor', TypeInfo(JNI.Elgin.Daruma.JAbstractStAXEventProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStAXEventOutputter_DefaultStAXEventProcessor', TypeInfo(JNI.Elgin.Daruma.JStAXEventOutputter_DefaultStAXEventProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStAXStreamOutputter', TypeInfo(JNI.Elgin.Daruma.JStAXStreamOutputter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStAXStreamOutputter_1', TypeInfo(JNI.Elgin.Daruma.JStAXStreamOutputter_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractStAXStreamProcessor', TypeInfo(JNI.Elgin.Daruma.JAbstractStAXStreamProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStAXStreamOutputter_DefaultStAXStreamProcessor', TypeInfo(JNI.Elgin.Daruma.JStAXStreamOutputter_DefaultStAXStreamProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLOutputter', TypeInfo(JNI.Elgin.Daruma.JXMLOutputter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLOutputter_1', TypeInfo(JNI.Elgin.Daruma.JXMLOutputter_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractXMLOutputProcessor', TypeInfo(JNI.Elgin.Daruma.JAbstractXMLOutputProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLOutputter_DefaultXMLProcessor', TypeInfo(JNI.Elgin.Daruma.JXMLOutputter_DefaultXMLProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractDOMOutputProcessor_1', TypeInfo(JNI.Elgin.Daruma.JAbstractDOMOutputProcessor_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JWalker', TypeInfo(JNI.Elgin.Daruma.JWalker));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractFormattedWalker', TypeInfo(JNI.Elgin.Daruma.JAbstractFormattedWalker));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractFormattedWalker_1', TypeInfo(JNI.Elgin.Daruma.JAbstractFormattedWalker_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractFormattedWalker_2', TypeInfo(JNI.Elgin.Daruma.JAbstractFormattedWalker_2));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractFormattedWalker_MultiText', TypeInfo(JNI.Elgin.Daruma.JAbstractFormattedWalker_MultiText));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractFormattedWalker_Trim', TypeInfo(JNI.Elgin.Daruma.JAbstractFormattedWalker_Trim));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractOutputProcessor_1', TypeInfo(JNI.Elgin.Daruma.JAbstractOutputProcessor_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractSAXOutputProcessor_1', TypeInfo(JNI.Elgin.Daruma.JAbstractSAXOutputProcessor_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractStAXEventProcessor_1', TypeInfo(JNI.Elgin.Daruma.JAbstractStAXEventProcessor_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractStAXEventProcessor_AttIterator', TypeInfo(JNI.Elgin.Daruma.JAbstractStAXEventProcessor_AttIterator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractStAXEventProcessor_NSIterator', TypeInfo(JNI.Elgin.Daruma.JAbstractStAXEventProcessor_NSIterator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractStAXStreamProcessor_1', TypeInfo(JNI.Elgin.Daruma.JAbstractStAXStreamProcessor_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractXMLOutputProcessor_1', TypeInfo(JNI.Elgin.Daruma.JAbstractXMLOutputProcessor_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDOMOutputProcessor', TypeInfo(JNI.Elgin.Daruma.JDOMOutputProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFormatStack', TypeInfo(JNI.Elgin.Daruma.JFormatStack));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JFormatStack_1', TypeInfo(JNI.Elgin.Daruma.JFormatStack_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXOutputProcessor', TypeInfo(JNI.Elgin.Daruma.JSAXOutputProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXTarget', TypeInfo(JNI.Elgin.Daruma.JSAXTarget));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXTarget_SAXLocator', TypeInfo(JNI.Elgin.Daruma.JSAXTarget_SAXLocator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStAXEventProcessor', TypeInfo(JNI.Elgin.Daruma.JStAXEventProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JStAXStreamProcessor', TypeInfo(JNI.Elgin.Daruma.JStAXStreamProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JWalkerNORMALIZE', TypeInfo(JNI.Elgin.Daruma.JWalkerNORMALIZE));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JWalkerNORMALIZE_1', TypeInfo(JNI.Elgin.Daruma.JWalkerNORMALIZE_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JWalkerPRESERVE', TypeInfo(JNI.Elgin.Daruma.JWalkerPRESERVE));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JWalkerPRESERVE_1', TypeInfo(JNI.Elgin.Daruma.JWalkerPRESERVE_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JWalkerTRIM', TypeInfo(JNI.Elgin.Daruma.JWalkerTRIM));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JWalkerTRIM_1', TypeInfo(JNI.Elgin.Daruma.JWalkerTRIM_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JWalkerTRIM_FULL_WHITE', TypeInfo(JNI.Elgin.Daruma.JWalkerTRIM_FULL_WHITE));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JWalkerTRIM_FULL_WHITE_1', TypeInfo(JNI.Elgin.Daruma.JWalkerTRIM_FULL_WHITE_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLOutputProcessor', TypeInfo(JNI.Elgin.Daruma.JXMLOutputProcessor));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMResult', TypeInfo(JNI.Elgin.Daruma.JJDOMResult));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLFilterImpl', TypeInfo(JNI.Elgin.Daruma.JXMLFilterImpl));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMResult_DocumentBuilder', TypeInfo(JNI.Elgin.Daruma.JJDOMResult_DocumentBuilder));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMResult_FragmentHandler', TypeInfo(JNI.Elgin.Daruma.JJDOMResult_FragmentHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMSource', TypeInfo(JNI.Elgin.Daruma.JJDOMSource));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMSource_DocumentReader', TypeInfo(JNI.Elgin.Daruma.JJDOMSource_DocumentReader));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JInputSource', TypeInfo(JNI.Elgin.Daruma.JInputSource));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMSource_JDOMInputSource', TypeInfo(JNI.Elgin.Daruma.JJDOMSource_JDOMInputSource));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXSLTransformException', TypeInfo(JNI.Elgin.Daruma.JXSLTransformException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXSLTransformer', TypeInfo(JNI.Elgin.Daruma.JXSLTransformer));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNamespaceStack', TypeInfo(JNI.Elgin.Daruma.JNamespaceStack));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNamespaceStack_1', TypeInfo(JNI.Elgin.Daruma.JNamespaceStack_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNamespaceStack_BackwardWalker', TypeInfo(JNI.Elgin.Daruma.JNamespaceStack_BackwardWalker));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNamespaceStack_EmptyIterable', TypeInfo(JNI.Elgin.Daruma.JNamespaceStack_EmptyIterable));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNamespaceStack_ForwardWalker', TypeInfo(JNI.Elgin.Daruma.JNamespaceStack_ForwardWalker));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNamespaceStack_NamespaceIterable', TypeInfo(JNI.Elgin.Daruma.JNamespaceStack_NamespaceIterable));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jxpath_XPath', TypeInfo(JNI.Elgin.Daruma.Jxpath_XPath));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXPath_XPathString', TypeInfo(JNI.Elgin.Daruma.JXPath_XPathString));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXPathBuilder', TypeInfo(JNI.Elgin.Daruma.JXPathBuilder));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXPathDiagnostic', TypeInfo(JNI.Elgin.Daruma.JXPathDiagnostic));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jxpath_XPathExpression', TypeInfo(JNI.Elgin.Daruma.Jxpath_XPathExpression));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.Jxpath_XPathFactory', TypeInfo(JNI.Elgin.Daruma.Jxpath_XPathFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXPathHelper', TypeInfo(JNI.Elgin.Daruma.JXPathHelper));
  //TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMCoreNavigator', TypeInfo(JNI.Elgin.Daruma.JJDOMCoreNavigator));
  //TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOM2Navigator', TypeInfo(JNI.Elgin.Daruma.JJDOM2Navigator));
  //TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMNavigator', TypeInfo(JNI.Elgin.Daruma.JJDOMNavigator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJDOMXPath', TypeInfo(JNI.Elgin.Daruma.JJDOMXPath));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractXPathCompiled', TypeInfo(JNI.Elgin.Daruma.JAbstractXPathCompiled));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJaxenCompiled', TypeInfo(JNI.Elgin.Daruma.JJaxenCompiled));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JJaxenXPathFactory', TypeInfo(JNI.Elgin.Daruma.JJaxenXPathFactory));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNamespaceContainer', TypeInfo(JNI.Elgin.Daruma.JNamespaceContainer));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractXPathCompiled_1', TypeInfo(JNI.Elgin.Daruma.JAbstractXPathCompiled_1));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAbstractXPathCompiled_NamespaceComparator', TypeInfo(JNI.Elgin.Daruma.JAbstractXPathCompiled_NamespaceComparator));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXPathDiagnosticImpl', TypeInfo(JNI.Elgin.Daruma.JXPathDiagnosticImpl));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNode', TypeInfo(JNI.Elgin.Daruma.JNode));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAttr', TypeInfo(JNI.Elgin.Daruma.JAttr));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCharacterData', TypeInfo(JNI.Elgin.Daruma.JCharacterData));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JText', TypeInfo(JNI.Elgin.Daruma.JText));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JCDATASection', TypeInfo(JNI.Elgin.Daruma.JCDATASection));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JComment', TypeInfo(JNI.Elgin.Daruma.JComment));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDOMConfiguration', TypeInfo(JNI.Elgin.Daruma.JDOMConfiguration));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDOMImplementation', TypeInfo(JNI.Elgin.Daruma.JDOMImplementation));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDOMStringList', TypeInfo(JNI.Elgin.Daruma.JDOMStringList));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDocument', TypeInfo(JNI.Elgin.Daruma.JDocument));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDocumentFragment', TypeInfo(JNI.Elgin.Daruma.JDocumentFragment));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDocumentType', TypeInfo(JNI.Elgin.Daruma.JDocumentType));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JElement', TypeInfo(JNI.Elgin.Daruma.JElement));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEntityReference', TypeInfo(JNI.Elgin.Daruma.JEntityReference));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNamedNodeMap', TypeInfo(JNI.Elgin.Daruma.JNamedNodeMap));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JNodeList', TypeInfo(JNI.Elgin.Daruma.JNodeList));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JProcessingInstruction', TypeInfo(JNI.Elgin.Daruma.JProcessingInstruction));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JTypeInfo', TypeInfo(JNI.Elgin.Daruma.JTypeInfo));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JUserDataHandler', TypeInfo(JNI.Elgin.Daruma.JUserDataHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLSInput', TypeInfo(JNI.Elgin.Daruma.JLSInput));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLSResourceResolver', TypeInfo(JNI.Elgin.Daruma.JLSResourceResolver));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAttributeList', TypeInfo(JNI.Elgin.Daruma.JAttributeList));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JAttributes', TypeInfo(JNI.Elgin.Daruma.JAttributes));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JContentHandler', TypeInfo(JNI.Elgin.Daruma.JContentHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDTDHandler', TypeInfo(JNI.Elgin.Daruma.JDTDHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDocumentHandler', TypeInfo(JNI.Elgin.Daruma.JDocumentHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JEntityResolver', TypeInfo(JNI.Elgin.Daruma.JEntityResolver));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JHandlerBase', TypeInfo(JNI.Elgin.Daruma.JHandlerBase));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JParser', TypeInfo(JNI.Elgin.Daruma.JParser));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXException', TypeInfo(JNI.Elgin.Daruma.JSAXException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JSAXParseException', TypeInfo(JNI.Elgin.Daruma.JSAXParseException));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLReader', TypeInfo(JNI.Elgin.Daruma.JXMLReader));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JXMLFilter', TypeInfo(JNI.Elgin.Daruma.JXMLFilter));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JDeclHandler', TypeInfo(JNI.Elgin.Daruma.JDeclHandler));
  TRegTypes.RegisterType('JNI.Elgin.Daruma.JLexicalHandler', TypeInfo(JNI.Elgin.Daruma.JLexicalHandler));
end;

initialization
  RegisterTypes;
end.

