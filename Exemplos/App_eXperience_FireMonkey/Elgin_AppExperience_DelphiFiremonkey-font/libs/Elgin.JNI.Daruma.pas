
unit Elgin.JNI.Daruma;

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
  JPrinterManager_PrinterManagerListener = interface;//br.com.daruma.framework.mobile.PrinterManager$PrinterManagerListener
  JDarumaMobile = interface;//br.com.daruma.framework.mobile.DarumaMobile
  JDarumaMobile_1 = interface;//br.com.daruma.framework.mobile.DarumaMobile$1
  JDarumaMobile_2 = interface;//br.com.daruma.framework.mobile.DarumaMobile$2
  JDarumaMobile_3 = interface;//br.com.daruma.framework.mobile.DarumaMobile$3
  JDarumaMobile_4 = interface;//br.com.daruma.framework.mobile.DarumaMobile$4
  JITraceListener = interface;//br.com.daruma.framework.mobile.log.listeners.ITraceListener
  JDarumaMobile_LogMemoria = interface;//br.com.daruma.framework.mobile.DarumaMobile$LogMemoria
  JPrinterManager = interface;//br.com.daruma.framework.mobile.PrinterManager
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
  Jdarumamobile_BuildConfig = interface;//daruma.com.br.darumamobile.BuildConfig
  JDataInput = interface;//java.io.DataInput
  JFilterInputStream = interface;//java.io.FilterInputStream
  JDataInputStream = interface;//java.io.DataInputStream
  JVoid = interface;//java.lang.Void
  JVector = interface;//java.util.Vector

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

  JPrinterManager_PrinterManagerListenerClass = interface(IJavaClass)
    ['{04B318EB-FA51-41F1-9C88-13418687E364}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/PrinterManager$PrinterManagerListener')]
  JPrinterManager_PrinterManagerListener = interface(IJavaInstance)
    ['{3B350AC5-AE3C-4975-AFDA-A0B8DD588F3F}']
    procedure onServiceConnected; cdecl;
  end;
  TJPrinterManager_PrinterManagerListener = class(TJavaGenericImport<JPrinterManager_PrinterManagerListenerClass, JPrinterManager_PrinterManagerListener>) end;

  JDarumaMobileClass = interface(JPrinterManager_PrinterManagerListenerClass)
    ['{8BDEAF4C-DAE5-4972-906C-41816FC2DE8A}']
    {class} function _GetnumInstances: Integer; cdecl;
    {class} procedure _SetnumInstances(Value: Integer); cdecl;
    {class} function _GetsatNativo: JSatNativo; cdecl;
    {class} procedure _SetsatNativo(Value: JSatNativo); cdecl;
    {class} function inicializar(string_: JString): JDarumaMobile; cdecl; overload;
    {class} function inicializar(context: JContext; string_: JString): JDarumaMobile; cdecl; overload;
    {class} function inicializar(string_: JString; string_1: JString): JDarumaMobile; cdecl; overload;
    {class} function inicializar(context: JContext; string_: JString; string_1: JString): JDarumaMobile; cdecl; overload;
    {class} function init(context: JContext; string_: JString; string_1: JString): JDarumaMobile; cdecl;//Deprecated
    {class} function isSatNativo: Boolean; cdecl;
    {class} function retornaDispositivosBluetooth: JList; cdecl;
    {class} function retornaVersao: JString; cdecl;
    {class} property numInstances: Integer read _GetnumInstances write _SetnumInstances;
    {class} property satNativo: JSatNativo read _GetsatNativo write _SetsatNativo;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/DarumaMobile')]
  JDarumaMobile = interface(JPrinterManager_PrinterManagerListener)
    ['{63C5420E-8334-49C5-9663-54120086E0BA}']
    function ImprimeCodBarras(string_: JString; string_1: JString; string_2: JString; string_3: JString): Integer; cdecl;
    function RegAlterarValor_NFCe(string_: JString; string_1: JString): Integer; cdecl; overload;
    function RegAlterarValor_NFCe(string_: JString; string_1: JString; b: Boolean): Integer; cdecl; overload;
    function RegAlterarValor_NFSe(string_: JString; string_1: JString): Integer; cdecl;
    function RegAlterarValor_SAT(string_: JString; string_1: JString): Integer; cdecl;
    function RegPersistirXML_NFCe: Integer; cdecl;
    function RegRetornarValor_NFSe(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    function RegRetornarValor_SAT(string_: JString; c: TJavaArray<Char>): Integer; cdecl;
    procedure TEF; cdecl;
    procedure TEF_M10; cdecl;
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
    function eImprimirBMPTecToy(string_: JString): Integer; cdecl;
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

  JDarumaMobile_1Class = interface(JHandlerClass)
    ['{0728CEF2-80B1-4F9D-8A6C-7884E489234E}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/DarumaMobile$1')]
  JDarumaMobile_1 = interface(JHandler)
    ['{9B1F952D-01AA-4387-8AB1-38EC787B2DD3}']
    procedure handleMessage(message: JMessage); cdecl;
  end;
  TJDarumaMobile_1 = class(TJavaGenericImport<JDarumaMobile_1Class, JDarumaMobile_1>) end;

  JDarumaMobile_2Class = interface(JRunnableClass)
    ['{84DDD46F-1D67-4D3E-9E39-FDD8FCDC741E}']
    {class} function _Getthis: JDarumaMobile; cdecl;
    {class} property this: JDarumaMobile read _Getthis;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/DarumaMobile$2')]
  JDarumaMobile_2 = interface(JRunnable)
    ['{A1BADE50-FAB8-42A8-9725-FAC2249E66A8}']
    procedure run; cdecl;
  end;
  TJDarumaMobile_2 = class(TJavaGenericImport<JDarumaMobile_2Class, JDarumaMobile_2>) end;

  JDarumaMobile_3Class = interface(JRunnableClass)
    ['{33A02BE5-9B88-4FD4-BA9E-42C8A0E85DAB}']
    {class} function _Getvalctg: Boolean; cdecl;
    {class} property valctg: Boolean read _Getvalctg;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/DarumaMobile$3')]
  JDarumaMobile_3 = interface(JRunnable)
    ['{ECC5FACA-BC2D-48FA-9A8C-0E38331DDD50}']
    procedure run; cdecl;
  end;
  TJDarumaMobile_3 = class(TJavaGenericImport<JDarumaMobile_3Class, JDarumaMobile_3>) end;

  JDarumaMobile_4Class = interface(JRunnableClass)
    ['{BD4D1036-92F2-4DDF-8048-6D7434A3A3EA}']
    {class} function _Getthis: JDarumaMobile; cdecl;
    {class} property this: JDarumaMobile read _Getthis;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/DarumaMobile$4')]
  JDarumaMobile_4 = interface(JRunnable)
    ['{FA3BDE76-47A2-43CB-97F0-D5290A8F1E5A}']
    procedure run; cdecl;
  end;
  TJDarumaMobile_4 = class(TJavaGenericImport<JDarumaMobile_4Class, JDarumaMobile_4>) end;

  JITraceListenerClass = interface(IJavaClass)
    ['{D2612849-5563-4D24-865D-CFA26822C366}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/log/listeners/ITraceListener')]
  JITraceListener = interface(IJavaInstance)
    ['{D02EC9BE-C7C0-40DE-BE57-94A3C31155AF}']
    function check(i: Integer; string_: JString): Boolean; cdecl;
    procedure traceOcurred(i: Integer; string_: JString; string_1: JString; date: JDate); cdecl;
  end;
  TJITraceListener = class(TJavaGenericImport<JITraceListenerClass, JITraceListener>) end;

  JDarumaMobile_LogMemoriaClass = interface(JITraceListenerClass)
    ['{6E0413C3-2A82-4A66-8C2A-31F48EB84936}']
    {class} function _Getthis: JDarumaMobile; cdecl;
    {class} property this: JDarumaMobile read _Getthis;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/DarumaMobile$LogMemoria')]
  JDarumaMobile_LogMemoria = interface(JITraceListener)
    ['{CA380CC3-8E56-47DA-9CC4-7F26746F472D}']
    function check(i: Integer; string_: JString): Boolean; cdecl;
    procedure traceOcurred(i: Integer; string_: JString; string_1: JString; date: JDate); cdecl;
  end;
  TJDarumaMobile_LogMemoria = class(TJavaGenericImport<JDarumaMobile_LogMemoriaClass, JDarumaMobile_LogMemoria>) end;

  JPrinterManagerClass = interface(JObjectClass)
    ['{9A66D8D7-C8B3-4BBD-93D7-99C888CDCF4A}']
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
    ['{08A07C65-0A60-4E5F-8A0E-D09E3F486EEB}']
    function hasXChengPrinter(context: JContext): Boolean; cdecl;
  end;
  TJPrinterManager = class(TJavaGenericImport<JPrinterManagerClass, JPrinterManager>) end;

  JThreadPoolManagerClass = interface(JObjectClass)
    ['{ED5D5839-DAB6-40A2-BBE1-371DFC4A54A3}']
    {class} function getInstance: JThreadPoolManager; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/ThreadPoolManager')]
  JThreadPoolManager = interface(JObject)
    ['{4B4FCC76-BD26-4DCE-AFCC-CA5AF06B51E6}']
    procedure executeTask(runnable: JRunnable); cdecl;
  end;
  TJThreadPoolManager = class(TJavaGenericImport<JThreadPoolManagerClass, JThreadPoolManager>) end;

  JZXingLibConfigClass = interface(JSerializableClass)
    ['{EBD31D75-C8D1-48AA-B320-FD06230315BC}']
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
    ['{7C95B0B9-5145-4831-B480-594764AC7750}']
    function _GetcopyToClipboard: Boolean; cdecl;
    procedure _SetcopyToClipboard(Value: Boolean); cdecl;
    function _GetreverseImage: Boolean; cdecl;
    procedure _SetreverseImage(Value: Boolean); cdecl;
    property copyToClipboard: Boolean read _GetcopyToClipboard write _SetcopyToClipboard;
    property reverseImage: Boolean read _GetreverseImage write _SetreverseImage;
  end;
  TJZXingLibConfig = class(TJavaGenericImport<JZXingLibConfigClass, JZXingLibConfig>) end;

  JDarumaConfigScannerClass = interface(JZXingLibConfigClass)
    ['{35881C97-39D5-43AD-B1F1-9529E0BF0206}']
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
    ['{1D9948A5-DEFF-4560-9CC3-113C4C84E918}']
    function _GettrataExcecao: Boolean; cdecl;
    procedure _SettrataExcecao(Value: Boolean); cdecl;
    procedure defineConfiguracao(string_: JString; string_1: JString); cdecl;
    function isTrataExcecao: Boolean; cdecl;
    property trataExcecao: Boolean read _GettrataExcecao write _SettrataExcecao;
  end;
  TJDarumaConfigScanner = class(TJavaGenericImport<JDarumaConfigScannerClass, JDarumaConfigScanner>) end;

  JDarumaDecoderClass = interface(JObjectClass)
    ['{414A49E3-6CF1-491B-BCAB-8C65CC0D8FB0}']
    {class} function init(darumaScanner: JDarumaScanner; darumaConfigScanner: JDarumaConfigScanner): JDarumaDecoder; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/DarumaDecoder')]
  JDarumaDecoder = interface(JObject)
    ['{FC4D922C-1D2F-427E-9CCE-67BCB05BEF12}']
    function getHandler: JHandler; cdecl;
    //procedure handleDecode(result: Jzxing_Result; bitmap: JBitmap); cdecl;
    function isDecoding: Boolean; cdecl;
    procedure startDecoding; cdecl;
    procedure stopDecoding; cdecl;
  end;
  TJDarumaDecoder = class(TJavaGenericImport<JDarumaDecoderClass, JDarumaDecoder>) end;

  JDarumaScanResultClass = interface(JObjectClass)
    ['{F8088DFC-4499-44E2-994B-5B038F5CCE31}']
    {class} function init(string_: JString; string_1: JString): JDarumaScanResult; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/DarumaScanResult')]
  JDarumaScanResult = interface(JObject)
    ['{10E8D522-0545-4BA3-A6CA-37A0B111AC74}']
    function getContents: JString; cdecl;
    function getFormatName: JString; cdecl;
    function toString: JString; cdecl;
  end;
  TJDarumaScanResult = class(TJavaGenericImport<JDarumaScanResultClass, JDarumaScanResult>) end;

  JISendHandlerClass = interface(IJavaClass)
    ['{4894040C-80B6-4599-8D3A-C6C107025DC2}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/ISendHandler')]
  JISendHandler = interface(IJavaInstance)
    ['{83710271-66BA-43A8-87E5-0796C6318E4F}']
    function getHandler: JHandler; cdecl;
  end;
  TJISendHandler = class(TJavaGenericImport<JISendHandlerClass, JISendHandler>) end;

  JDarumaScannerClass = interface(JISendHandlerClass)
    ['{FF85EF4B-72CA-4C9D-8E64-BD4E1A9F243A}']
    {class} function inicializar(activity: JActivity; frameLayout: JFrameLayout): JDarumaScanner; cdecl; overload;//Deprecated
    {class} function inicializar(activity: JActivity; frameLayout: JFrameLayout; string_: JString): JDarumaScanner; cdecl; overload;
    {class} function inicializar(activity: JActivity; frameLayout: JFrameLayout; string_: JString; string_1: JString): JDarumaScanner; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/DarumaScanner')]
  JDarumaScanner = interface(JISendHandler)
    ['{64BE5C81-CCE5-4211-AA81-E664D777C591}']
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
    ['{34CF9E79-8714-4871-9FC7-EEDB89ECC630}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/DarumaScannerHandler')]
  JDarumaScannerHandler = interface(JHandler)
    ['{ED741E00-DA24-4EF5-8CF9-A5D37EC78661}']
    procedure handleMessage(message: JMessage); cdecl;
    procedure quitSynchronously; cdecl;
  end;
  TJDarumaScannerHandler = class(TJavaGenericImport<JDarumaScannerHandlerClass, JDarumaScannerHandler>) end;

  JDarumaScannerHandler_StateClass = interface(JEnumClass)
    ['{DD750522-158C-4BFE-B13D-E773FD9FF9A1}']
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
    ['{806973CB-44E6-4C6D-A62C-635E5A994279}']
  end;
  TJDarumaScannerHandler_State = class(TJavaGenericImport<JDarumaScannerHandler_StateClass, JDarumaScannerHandler_State>) end;

  JBeepManagerClass = interface(JObjectClass)
    ['{91043296-847E-41A9-AFA0-B8769376D1FC}']
    {class} function init(activity: JActivity; i: Integer; zXingLibConfig: JZXingLibConfig): JBeepManager; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/BeepManager')]
  JBeepManager = interface(JObject)
    ['{51481F98-310F-4C86-91FF-E9E355443046}']
    procedure playBeepSoundAndVibrate; cdecl;
    procedure updatePrefs; cdecl;
  end;
  TJBeepManager = class(TJavaGenericImport<JBeepManagerClass, JBeepManager>) end;

  JBeepManager_1Class = interface(JMediaPlayer_OnCompletionListenerClass)
    ['{505230A9-9923-429F-99BA-81E57B8440B0}']
    {class} function init: JBeepManager_1; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/BeepManager$1')]
  JBeepManager_1 = interface(JMediaPlayer_OnCompletionListener)
    ['{FB1F7CD7-E5F7-472E-AE12-477C692113D7}']
    procedure onCompletion(mediaPlayer: JMediaPlayer); cdecl;
  end;
  TJBeepManager_1 = class(TJavaGenericImport<JBeepManager_1Class, JBeepManager_1>) end;

//  JDecodeAsyncTaskClass = interface(JAsyncTaskClass)
//    ['{061E8C3A-E91D-4F1E-83DF-E31A0A322621}']
//    {class} function _GetBARCODE_BITMAP: JString; cdecl;
//    {class} //function init(iSendHandler: JISendHandler; vector: JVector; string_: JString; resultPointCallback: JResultPointCallback): JDecodeAsyncTask; cdecl;
//    {class} property BARCODE_BITMAP: JString read _GetBARCODE_BITMAP;
//  end;

//  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/DecodeAsyncTask')]
//  JDecodeAsyncTask = interface(JAsyncTask)
//    ['{324F4F7F-1FE2-49F0-A130-08ED7AF03E56}']
//    function getHandler: JHandler; cdecl;
//  end;
//  TJDecodeAsyncTask = class(TJavaGenericImport<JDecodeAsyncTaskClass, JDecodeAsyncTask>) end;

  JDecodeFormatManagerClass = interface(JObjectClass)
    ['{29DFB2D2-6A45-4D22-AB04-86141C3F46F8}']
    {class} function parseDecodeFormats(intent: JIntent): JVector; cdecl; overload;//Deprecated
    {class} function parseDecodeFormats(uri: Jnet_Uri): JVector; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/DecodeFormatManager')]
  JDecodeFormatManager = interface(JObject)
    ['{56AF3EB9-DD63-478B-AA91-C09A58E260E7}']
  end;
  TJDecodeFormatManager = class(TJavaGenericImport<JDecodeFormatManagerClass, JDecodeFormatManager>) end;

  JDecodeHandlerClass = interface(JHandlerClass)
    ['{5809BA6D-6418-453F-B226-51B7F4C8E460}']
    {class} function init(iSendHandler: JISendHandler; hashtable: JHashtable): JDecodeHandler; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/DecodeHandler')]
  JDecodeHandler = interface(JHandler)
    ['{27EFA162-EFD3-4AB9-99F0-A14157089939}']
    procedure handleMessage(message: JMessage); cdecl;
  end;
  TJDecodeHandler = class(TJavaGenericImport<JDecodeHandlerClass, JDecodeHandler>) end;

  JDecodeThreadClass = interface(JThreadClass)
    ['{897659F1-AE7A-4EFF-AC54-D77968DFBF18}']
    {class} function _GetBARCODE_BITMAP: JString; cdecl;
    {class} //function init(iSendHandler: JISendHandler; vector: JVector; string_: JString; resultPointCallback: JResultPointCallback): JDecodeThread; cdecl;
    {class} property BARCODE_BITMAP: JString read _GetBARCODE_BITMAP;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/DecodeThread')]
  JDecodeThread = interface(JThread)
    ['{6FA540D4-C3D3-4B0D-9284-370AE67219D3}']
    function getHandler: JHandler; cdecl;
    procedure run; cdecl;
  end;
  TJDecodeThread = class(TJavaGenericImport<JDecodeThreadClass, JDecodeThread>) end;

  JFinishListenerClass = interface(JDialogInterface_OnClickListenerClass)
    ['{12180301-186C-4716-B5FB-E011C50E78D8}']
    {class} function init(activity: JActivity): JFinishListener; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/FinishListener')]
  JFinishListener = interface(JDialogInterface_OnClickListener)
    ['{76C62C10-4681-464B-BC50-28CE93D97D48}']
    procedure onCancel(dialogInterface: JDialogInterface); cdecl;
    procedure onClick(dialogInterface: JDialogInterface; i: Integer); cdecl;
    procedure run; cdecl;
  end;
  TJFinishListener = class(TJavaGenericImport<JFinishListenerClass, JFinishListener>) end;

  JInactivityTimerClass = interface(JObjectClass)
    ['{B1D0E912-56A9-48B4-8533-1C4734A41CC2}']
    {class} function init(activity: JActivity): JInactivityTimer; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/InactivityTimer')]
  JInactivityTimer = interface(JObject)
    ['{5D1678B3-0F5D-468B-9804-9FB2A880D78C}']
    procedure onActivity; cdecl;
    procedure onPause; cdecl;
    procedure onResume; cdecl;
    procedure shutdown; cdecl;
  end;
  TJInactivityTimer = class(TJavaGenericImport<JInactivityTimerClass, JInactivityTimer>) end;

  JInactivityTimer_1Class = interface(JObjectClass)
    ['{E61113FF-6B8D-4B3A-98E2-401A47CD43CD}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/InactivityTimer$1')]
  JInactivityTimer_1 = interface(JObject)
    ['{74A4E9B1-B801-4C5C-83A7-B616141B58D3}']
  end;
  TJInactivityTimer_1 = class(TJavaGenericImport<JInactivityTimer_1Class, JInactivityTimer_1>) end;

  JInactivityTimer_DaemonThreadFactoryClass = interface(JThreadFactoryClass)
    ['{30E44BA8-D56B-44A5-B96D-358847627961}']
    {class} function newThread(runnable: JRunnable): JThread; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/InactivityTimer$DaemonThreadFactory')]
  JInactivityTimer_DaemonThreadFactory = interface(JThreadFactory)
    ['{2C10D4A7-B6A1-47F2-A0B8-A8D5BC766B84}']
  end;
  TJInactivityTimer_DaemonThreadFactory = class(TJavaGenericImport<JInactivityTimer_DaemonThreadFactoryClass, JInactivityTimer_DaemonThreadFactory>) end;

  JInactivityTimer_PowerStatusReceiverClass = interface(JBroadcastReceiverClass)
    ['{3E6F7F38-2A14-4AA4-89E2-46D6F5C1446A}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/InactivityTimer$PowerStatusReceiver')]
  JInactivityTimer_PowerStatusReceiver = interface(JBroadcastReceiver)
    ['{BAFAD766-4443-452F-9167-203C7B1052D3}']
    procedure onReceive(context: JContext; intent: JIntent); cdecl;
  end;
  TJInactivityTimer_PowerStatusReceiver = class(TJavaGenericImport<JInactivityTimer_PowerStatusReceiverClass, JInactivityTimer_PowerStatusReceiver>) end;

  JIntentsClass = interface(JObjectClass)
    ['{F6D25DA0-67B0-49BF-9A35-DBFE4FC027B3}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/Intents')]
  JIntents = interface(JObject)
    ['{9088D7A9-D888-499E-97E9-BDC33D086ECD}']
  end;
  TJIntents = class(TJavaGenericImport<JIntentsClass, JIntents>) end;

  JIntents_ScanClass = interface(JObjectClass)
    ['{4D11F060-B68A-4DB3-91AA-33C873203705}']
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
    ['{1BCEE584-2AA4-49B9-97C2-0AD05CFAC7E4}']
  end;
  TJIntents_Scan = class(TJavaGenericImport<JIntents_ScanClass, JIntents_Scan>) end;

  // br.com.daruma.framework.mobile.camera.dependencies.ViewfinderResultPointCallback
  JViewfinderViewClass = interface(JViewClass)
    ['{F7BC8A7B-ED1A-4BA4-AC12-DB21A3D26D3D}']
    {class} function init(context: JContext): JViewfinderView; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/ViewfinderView')]
  JViewfinderView = interface(JView)
    ['{5F35973C-7E4B-4EC7-A49C-614213DA72CA}']
    //procedure addPossibleResultPoint(resultPoint: JResultPoint); cdecl;
    procedure drawResultBitmap(bitmap: JBitmap); cdecl;
    procedure drawViewfinder; cdecl;
    procedure onDraw(canvas: JCanvas); cdecl;
  end;
  TJViewfinderView = class(TJavaGenericImport<JViewfinderViewClass, JViewfinderView>) end;

  JAutoFocusCallbackClass = interface(JCamera_AutoFocusCallbackClass)
    ['{2266213B-95B2-420B-9AC6-3A59B4ECA47B}']
    {class} function init: JAutoFocusCallback; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/camera/AutoFocusCallback')]
  JAutoFocusCallback = interface(JCamera_AutoFocusCallback)
    ['{2D9AFD68-7D27-40D9-BC1E-1CACA7CF928F}']
    procedure onAutoFocus(b: Boolean; camera: JCamera); cdecl;
  end;
  TJAutoFocusCallback = class(TJavaGenericImport<JAutoFocusCallbackClass, JAutoFocusCallback>) end;

  JCameraConfigurationManagerClass = interface(JObjectClass)
    ['{E8E834F4-314F-48A2-BA4D-CDB2ECD96FFA}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/camera/CameraConfigurationManager')]
  JCameraConfigurationManager = interface(JObject)
    ['{E8B3FEAF-1EC6-4114-A4D6-DCBB6C3D6E51}']
  end;
  TJCameraConfigurationManager = class(TJavaGenericImport<JCameraConfigurationManagerClass, JCameraConfigurationManager>) end;

  Jcamera_CameraManagerClass = interface(JObjectClass)
    ['{451257CD-3B0D-42BD-B4A0-850589FFF60F}']
    {class} function _GetSDK_INT: Integer; cdecl;
    {class} function &get: Jcamera_CameraManager; cdecl;
    {class} property SDK_INT: Integer read _GetSDK_INT;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/camera/CameraManager')]
  Jcamera_CameraManager = interface(JObject)
    ['{0FFA4A1C-5ED0-4895-AA3C-476652C8AC5F}']
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
    ['{88A88233-72E6-4610-9828-EDD5ADA02C7D}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/camera/FlashlightManager')]
  JFlashlightManager = interface(JObject)
    ['{571C6DCC-19D4-4C9F-86A0-B448E2EA46AE}']
  end;
  TJFlashlightManager = class(TJavaGenericImport<JFlashlightManagerClass, JFlashlightManager>) end;

  // br.com.daruma.framework.mobile.camera.dependencies.camera.PlanarYUVLuminanceSource
  JPreviewCallbackClass = interface(JCamera_PreviewCallbackClass)
    ['{35677533-FBDD-4D4B-80A7-A1026194F23A}']
    {class} function init(cameraConfigurationManager: JCameraConfigurationManager; b: Boolean): JPreviewCallback; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/camera/dependencies/camera/PreviewCallback')]
  JPreviewCallback = interface(JCamera_PreviewCallback)
    ['{24743FD8-1E2E-4235-86AC-FEB145968691}']
    procedure onPreviewFrame(b: TJavaArray<Byte>; camera: JCamera); cdecl;
  end;
  TJPreviewCallback = class(TJavaGenericImport<JPreviewCallbackClass, JPreviewCallback>) end;

  JIVariaveisScanerClass = interface(JObjectClass)
    ['{80DED72F-B5DC-4168-9566-9B7CA2195510}']
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
    ['{1E531ED3-42BB-4310-8F7E-9A7855183AE0}']
  end;
  TJIVariaveisScaner = class(TJavaGenericImport<JIVariaveisScanerClass, JIVariaveisScaner>) end;

  JAComunicacaoClass = interface(JObjectClass)
    ['{C77261F2-DC9E-4E20-B4D2-CA139C20A731}']
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
    ['{4DA6842F-C2C6-46D1-96C5-0053B2632184}']
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
    ['{57D44FEC-4DE5-4091-8DA0-16AB7D8B2B46}']
    {class} function init(string_: JString): Jexception_DarumaException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/exception/DarumaException')]
  Jexception_DarumaException = interface(JRuntimeException)
    ['{CBCC601D-AD10-44E4-9A81-0358528BCC37}']
  end;
  TJexception_DarumaException = class(TJavaGenericImport<Jexception_DarumaExceptionClass, Jexception_DarumaException>) end;

  Jexception_DarumaComunicacaoExceptionClass = interface(Jexception_DarumaExceptionClass)
    ['{3C33E21E-E268-47CA-A85C-D3626EED9218}']
    {class} function init(string_: JString): Jexception_DarumaComunicacaoException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/exception/DarumaComunicacaoException')]
  Jexception_DarumaComunicacaoException = interface(Jexception_DarumaException)
    ['{2DB9F16D-4DAF-4C61-A692-E347045204DD}']
  end;
  TJexception_DarumaComunicacaoException = class(TJavaGenericImport<Jexception_DarumaComunicacaoExceptionClass, Jexception_DarumaComunicacaoException>) end;

  JDarumaECFExceptionClass = interface(Jexception_DarumaExceptionClass)
    ['{AC525B2F-D6A8-42E4-B9D5-F0ED780F4605}']
    {class} function init(i: Integer; string_: JString): JDarumaECFException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/exception/DarumaECFException')]
  JDarumaECFException = interface(Jexception_DarumaException)
    ['{91691AD8-4149-4157-91DD-BDBDEEBD2AB2}']
    function getCode: Integer; cdecl;
  end;
  TJDarumaECFException = class(TJavaGenericImport<JDarumaECFExceptionClass, JDarumaECFException>) end;

  JBluetoothDarumaClass = interface(JAComunicacaoClass)
    ['{7045F3B4-52DF-4417-86A2-95771FF6AD72}']
    {class} function init(context: JContext; map: JMap): JBluetoothDaruma; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/BluetoothDaruma')]
  JBluetoothDaruma = interface(JAComunicacao)
    ['{3A4061A8-EF3D-4615-A25E-4D80796A9ABA}']
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
    ['{5555558E-519F-43A6-83EA-F410D34A56B0}']
    {class} function _Getthis: JBluetoothDaruma; cdecl;
    {class} function init(bluetoothDaruma: JBluetoothDaruma; dataInputStream: JDataInputStream): JBluetoothDaruma_ReadTask; cdecl;
    {class} property this: JBluetoothDaruma read _Getthis;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/BluetoothDaruma$ReadTask')]
  JBluetoothDaruma_ReadTask = interface(JRunnable)
    ['{B6E91EB3-7D41-4FCA-8584-EB8C59C9E202}']
    procedure run; cdecl;
  end;
  TJBluetoothDaruma_ReadTask = class(TJavaGenericImport<JBluetoothDaruma_ReadTaskClass, JBluetoothDaruma_ReadTask>) end;

  JComunicacaoNaoImplClass = interface(JAComunicacaoClass)
    ['{297106C9-DB3E-4FA5-8AFD-6D58B10D4A78}']
    {class} function init: JComunicacaoNaoImpl; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/ComunicacaoNaoImpl')]
  JComunicacaoNaoImpl = interface(JAComunicacao)
    ['{7F0E1F80-6896-48EB-A4AE-2355CB73E12E}']
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
    ['{DB17697D-340D-40D5-B813-44998759BCF5}']
    {class} function init(context: JContext; map: JMap): JSerialDaruma; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/SerialDaruma')]
  JSerialDaruma = interface(JAComunicacao)
    ['{583CF784-A103-4DCD-89A1-A92F9EFD711D}']
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
    ['{AE44D424-40CB-46EC-A961-900594C75C4D}']
    {class} function init(context: JContext; map: JMap): JSocketDaruma; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/SocketDaruma')]
  JSocketDaruma = interface(JAComunicacao)
    ['{BAD75283-6FD4-44A2-84D2-64A39B9D0341}']
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
    ['{53E5CF74-9211-4B47-80A9-6F288BB83CCC}']
    {class} function init(context: JContext; map: JMap): JUsbDaruma; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/comunicacao/impl/UsbDaruma')]
  JUsbDaruma = interface(JAComunicacao)
    ['{062AECD1-5719-495D-BB15-19E2DC6508B6}']
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
    ['{B35FC804-C19B-4240-B002-7EBE64192741}']
    {class} function _GetFECHAMENTO_AUTOMATICO: JConstantesFramework; cdecl;
    {class} function _GetNOME: JConstantesFramework; cdecl;
    {class} function valueOf(string_: JString): JConstantesFramework; cdecl;
    {class} function values: TJavaObjectArray<JConstantesFramework>; cdecl;//Deprecated
    {class} property FECHAMENTO_AUTOMATICO: JConstantesFramework read _GetFECHAMENTO_AUTOMATICO;
    {class} property NOME: JConstantesFramework read _GetNOME;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/constantes/ConstantesFramework')]
  JConstantesFramework = interface(JEnum)
    ['{7C11C1FB-694B-428E-BDCA-1C01E6E73F3B}']
  end;
  TJConstantesFramework = class(TJavaGenericImport<JConstantesFrameworkClass, JConstantesFramework>) end;

  JConstantesGenericoClass = interface(JEnumClass)
    ['{1AE5C17D-DA2C-487E-945D-BD3B6CFBD687}']
    {class} function _GetNOME: JConstantesGenerico; cdecl;
    {class} function valueOf(string_: JString): JConstantesGenerico; cdecl;
    {class} function values: TJavaObjectArray<JConstantesGenerico>; cdecl;
    {class} property NOME: JConstantesGenerico read _GetNOME;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/constantes/ConstantesGenerico')]
  JConstantesGenerico = interface(JEnum)
    ['{7D382F67-E490-4602-BF73-B05365A2F948}']
    function getTagNome: JIConstantesComunicacao; cdecl;
  end;
  TJConstantesGenerico = class(TJavaGenericImport<JConstantesGenericoClass, JConstantesGenerico>) end;

  JConstantesSocketClass = interface(JEnumClass)
    ['{75767722-BB5F-40E9-A417-16FB65DFCEF8}']
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
    ['{13956BAB-C42E-4598-8089-2162DBE1B9EC}']
    function getTagNome: JIConstantesComunicacao; cdecl;
  end;
  TJConstantesSocket = class(TJavaGenericImport<JConstantesSocketClass, JConstantesSocket>) end;

  JIConstantesComunicacaoClass = interface(IJavaClass)
    ['{B480255C-A05B-4F80-82B3-EC14FE96E202}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/constantes/IConstantesComunicacao')]
  JIConstantesComunicacao = interface(IJavaInstance)
    ['{E1BEF833-3B64-46BD-B062-B0A21C09727F}']
    function getTagNome: JIConstantesComunicacao; cdecl;
  end;
  TJIConstantesComunicacao = class(TJavaGenericImport<JIConstantesComunicacaoClass, JIConstantesComunicacao>) end;

  JDarumaCheckedExceptionClass = interface(JExceptionClass)
    ['{E36B22AD-A295-4854-A2AD-0360310566AE}']
    {class} function init(i: Integer; string_: JString): JDarumaCheckedException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaCheckedException')]
  JDarumaCheckedException = interface(JException)
    ['{82A468E0-CEB4-48B3-A45F-57E306884BDC}']
    function getCode: Integer; cdecl;
  end;
  TJDarumaCheckedException = class(TJavaGenericImport<JDarumaCheckedExceptionClass, JDarumaCheckedException>) end;

  JDarumaExceptionClass = interface(JRuntimeExceptionClass)
    ['{9083A55A-2CBB-4793-BE87-E5BE65700F4A}']
    {class} function init(string_: JString): JDarumaException; cdecl; overload;
    {class} function init(i: Integer; string_: JString): JDarumaException; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaException')]
  JDarumaException = interface(JRuntimeException)
    ['{D8FAA6D9-8384-4893-8B07-07C84849E4BD}']
    function getCode: Integer; cdecl;
  end;
  TJDarumaException = class(TJavaGenericImport<JDarumaExceptionClass, JDarumaException>) end;

  JDarumaComunicacaoExceptionClass = interface(JDarumaExceptionClass)
    ['{828E0A4E-DA5A-487B-953C-82A98667B010}']
    {class} function init(string_: JString): JDarumaComunicacaoException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaComunicacaoException')]
  JDarumaComunicacaoException = interface(JDarumaException)
    ['{6C46F7FC-C5CB-4F5F-9012-7F46B184AC3C}']
  end;
  TJDarumaComunicacaoException = class(TJavaGenericImport<JDarumaComunicacaoExceptionClass, JDarumaComunicacaoException>) end;

  Jexception_DarumaECFExceptionClass = interface(JDarumaExceptionClass)
    ['{9768EBE6-FD16-4ADC-BE42-2BDAE7183C19}']
    {class} function init(i: Integer; string_: JString): Jexception_DarumaECFException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaECFException')]
  Jexception_DarumaECFException = interface(JDarumaException)
    ['{A42C1C2E-F390-4E27-886C-CA18F4B98690}']
    function getCode: Integer; cdecl;
  end;
  TJexception_DarumaECFException = class(TJavaGenericImport<Jexception_DarumaECFExceptionClass, Jexception_DarumaECFException>) end;

  JDarumaSatExceptionClass = interface(JDarumaExceptionClass)
    ['{BA2F5581-971A-484D-A04F-85E9A94B2A1D}']
    {class} function init(i: Integer; string_: JString): JDarumaSatException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaSatException')]
  JDarumaSatException = interface(JDarumaException)
    ['{FA0DBE20-15EA-4728-9AAB-FB2A5E988E21}']
    function getCode: Integer; cdecl;
  end;
  TJDarumaSatException = class(TJavaGenericImport<JDarumaSatExceptionClass, JDarumaSatException>) end;

  JDarumaScanExceptionClass = interface(JDarumaExceptionClass)
    ['{0ECADCEB-48D0-4015-A094-A79AE47890A7}']
    {class} function init(string_: JString): JDarumaScanException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaScanException')]
  JDarumaScanException = interface(JDarumaException)
    ['{59A8D034-9AFD-4606-B95F-E0848BF5B8DD}']
  end;
  TJDarumaScanException = class(TJavaGenericImport<JDarumaScanExceptionClass, JDarumaScanException>) end;

  JDarumaWebServiceExceptionClass = interface(JDarumaExceptionClass)
    ['{3EADFB90-3181-45C9-A18C-6560A900FF86}']
    {class} function init(string_: JString): JDarumaWebServiceException; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/exception/DarumaWebServiceException')]
  JDarumaWebServiceException = interface(JDarumaException)
    ['{72849648-45C6-497F-97EA-FB756ACD5351}']
  end;
  TJDarumaWebServiceException = class(TJavaGenericImport<JDarumaWebServiceExceptionClass, JDarumaWebServiceException>) end;

  Jgne_UtilsClass = interface(JObjectClass)
    ['{FA66EE2B-0C72-4583-B7B6-7220BCBF83D7}']
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
    {class} function _GetpersistenciaMemoria_flag: Boolean; cdecl;
    {class} procedure _SetpersistenciaMemoria_flag(Value: Boolean); cdecl;
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
    {class} //function gravarArquivoXml(string_: JString; document: Jjdom2_Document; context: JContext): JString; cdecl; overload;
    {class} //function gravarArquivoXml(element: Jjdom2_Element; string_: JString; context: JContext): JString; cdecl; overload;
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
    {class} property persistenciaMemoria_flag: Boolean read _GetpersistenciaMemoria_flag write _SetpersistenciaMemoria_flag;
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
    ['{A21E8E2B-9499-49E9-885F-0FBFDF58CA1C}']
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
    ['{C936DA0E-3FE9-4815-A9E1-78B06F17EDF0}']
    {class} function init: JBMP; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/BMP')]
  JBMP = interface(Jgne_Utils)
    ['{735FBEB3-6418-4A2E-A94F-72B5EA37A9D8}']
    function fnCarregarLogoBMP(string_: JString; b: TJavaArray<Byte>): Integer; cdecl;
    function fnGerarQrcodeBMP(string_: JString): JBitmap; cdecl;
    function getBitsImageData(bitmap: JBitmap): JBitSet; cdecl;
  end;
  TJBMP = class(TJavaGenericImport<JBMPClass, JBMP>) end;

  JOp_XmlConsultaClass = interface(JObjectClass)
    ['{F02F6868-8FE8-40F4-89C4-80EED5A749EF}']
    {class} //function _GetChaveAcesso: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveAcesso(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCnpjEmissor: Jjdom2_Element; cdecl;
    {class} //procedure _SetCnpjEmissor(Value: Jjdom2_Element); cdecl;
    {class} //function _GetDataEmissaoFinal: Jjdom2_Element; cdecl;
    {class} //procedure _SetDataEmissaoFinal(Value: Jjdom2_Element); cdecl;
    {class} //function _GetNumeroFinal: Jjdom2_Element; cdecl;
    {class} //procedure _SetNumeroFinal(Value: Jjdom2_Element); cdecl;
    {class} //function _GetSerie: Jjdom2_Element; cdecl;
    {class} //procedure _SetSerie(Value: Jjdom2_Element); cdecl;
    {class} //function _GetVersao: Jjdom2_Element; cdecl;
    {class} //procedure _SetVersao(Value: Jjdom2_Element); cdecl;
    {class} //function _GettpAmb: Jjdom2_Element; cdecl;
    {class} //procedure _SettpAmb(Value: Jjdom2_Element); cdecl;
    {class} function init: JOp_XmlConsulta; cdecl;//Deprecated
    {class} //property ChaveAcesso: Jjdom2_Element read _GetChaveAcesso write _SetChaveAcesso;
    {class} //property CnpjEmissor: Jjdom2_Element read _GetCnpjEmissor write _SetCnpjEmissor;
    {class} //property DataEmissaoFinal: Jjdom2_Element read _GetDataEmissaoFinal write _SetDataEmissaoFinal;
    {class} //property NumeroFinal: Jjdom2_Element read _GetNumeroFinal write _SetNumeroFinal;
    {class} //property Serie: Jjdom2_Element read _GetSerie write _SetSerie;
    {class} //property Versao: Jjdom2_Element read _GetVersao write _SetVersao;
    {class} //property tpAmb: Jjdom2_Element read _GettpAmb write _SettpAmb;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/Op_XmlConsulta')]
  JOp_XmlConsulta = interface(JObject)
    ['{F825D1D1-4FCE-4203-A77C-3B887CBFE688}']
    function gerarXmlConsulta(context: JContext): JString; cdecl;
    function preencherXmlConsultaNFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; context: JContext): JString; cdecl;
  end;
  TJOp_XmlConsulta = class(TJavaGenericImport<JOp_XmlConsultaClass, JOp_XmlConsulta>) end;

  JPersistenciaClass = interface(Jgne_UtilsClass)
    ['{E355E2D5-9CA3-4CB8-B5C1-50AD8AB36FB0}']
    {class} function init: JPersistencia; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/Persistencia')]
  JPersistencia = interface(Jgne_Utils)
    ['{D673A914-21CF-4604-95BC-05735CFB7E55}']
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
    ['{31A24B75-F4A7-4C50-93DF-D97B56337215}']
    {class} function init: JPersistenciaAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/PersistenciaAuxiliar')]
  JPersistenciaAuxiliar = interface(Jgne_Utils)
    ['{D4E8BC70-9392-441F-A004-73AEDA33F8D1}']
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
    ['{5A16D49C-E145-44A3-9CA5-DA117179D538}']
    {class} function init: JProcessos; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/Processos')]
  JProcessos = interface(Jgne_Utils)
    ['{84C2581D-081B-4337-99A9-D6B41799AFAD}']
    procedure cancelar(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure gerarDescAcrescItem(string_: JString; string_1: JString; string_2: JString; context: JContext); cdecl;
    function separarValorTag(string_: JString; string_1: JString): JString; cdecl;
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJProcessos = class(TJavaGenericImport<JProcessosClass, JProcessos>) end;

  JTagsClass = interface(Jgne_UtilsClass)
    ['{6936A767-C983-4A39-AEF5-11B968FD96DA}']
    {class} function init: JTags; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/Tags')]
  JTags = interface(Jgne_Utils)
    ['{506CDFA0-E6A1-4800-A77A-877EA29A42FC}']
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
  end;
  TJTags = class(TJavaGenericImport<JTagsClass, JTags>) end;

  JFormatacaoClass = interface(JObjectClass)
    ['{77875949-9736-4AB9-A7DC-F4C45F11B847}']
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
    ['{6746BB6E-ACF5-419A-B493-B23604129005}']
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
    ['{EF6EA7B1-54FA-4B19-B057-525B3705B837}']
    {class} function init(context: JContext): JDaruma; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Daruma')]
  JDaruma = interface(JFormatacao)
    ['{2E877C25-A5CB-4F05-9C44-F0409DF44608}']
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
    ['{2D6FEEAD-3A0C-48B4-8F93-80A6390E79EC}']
    {class} function init(context: JContext): JDaruma_2100; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Daruma_2100')]
  JDaruma_2100 = interface(JFormatacao)
    ['{AE2B36F9-7C6B-40A0-93C0-B875D451ECBB}']
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
    ['{5E1BE766-1760-47DC-8951-D163B58C875C}']
    {class} function init(context: JContext): JDaruma_250; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Daruma_250')]
  JDaruma_250 = interface(JFormatacao)
    ['{218D9103-1000-4729-BEB4-0A925FD525B1}']
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
    ['{3B4A4FD5-88B6-42DF-838B-0F63B3CC4FD5}']
    {class} function init(context: JContext): JDaruma_350; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Daruma_350')]
  JDaruma_350 = interface(JFormatacao)
    ['{39B399E8-DDA7-40FB-85B8-175141DA0EA6}']
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
    ['{6B9209A3-5DB3-4251-BCCB-B520C31D83F7}']
    {class} function init(context: JContext): JDascom; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Dascom')]
  JDascom = interface(JFormatacao)
    ['{3F4926A4-D33C-4F0D-812A-AB509DA2F8E9}']
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
    ['{BF98CB48-929E-4220-8A90-E3A9A7903AD5}']
    {class} function init(context: JContext): JDatec_250; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Datec_250')]
  JDatec_250 = interface(JFormatacao)
    ['{6101788A-D250-429D-A6A0-1039FD50954E}']
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
    ['{5DFE7449-6244-4008-B2E8-D86F1AE058A2}']
    {class} function init(context: JContext): JDatec_350; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Datec_350')]
  JDatec_350 = interface(JFormatacao)
    ['{0CE1726D-DC89-4501-8213-E604A66360C7}']
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
    ['{6ADC45E8-B278-46E0-8A96-0C717CE12232}']
    {class} function init(context: JContext): JEPSON; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/EPSON')]
  JEPSON = interface(JFormatacao)
    ['{258D683E-04DC-403C-91DE-0FE668002D58}']
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
    ['{D0F0FD20-DB0E-4020-AFA6-B8E1790A8746}']
    {class} function init(context: JContext): JFormatacaoAscii; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/FormatacaoAscii')]
  JFormatacaoAscii = interface(JFormatacao)
    ['{FF3CE345-E522-4AB1-BD9F-9632C5027330}']
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
    ['{255B5F8B-4C73-44E9-B051-76C82B980CC3}']
    {class} function init(context: JContext): JM10; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/M10')]
  JM10 = interface(JFormatacao)
    ['{47504843-6F93-46FB-97F9-AE5B4B2C0CE7}']
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
    ['{10BE211D-D6CE-4C8F-A28A-15C6B510D9AA}']
    {class} function init(context: JContext): JNonus; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/imp/Nonus')]
  JNonus = interface(JFormatacao)
    ['{1B7228AA-E008-448D-A00E-061764925285}']
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
    ['{8017A3D0-8301-4B3B-9899-2E1E34C39A9A}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/AberturaNfce')]
  JAberturaNfce = interface(JPersistencia)
    ['{DBAEECF7-4987-468A-9A92-1994B3055BD3}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJAberturaNfce = class(TJavaGenericImport<JAberturaNfceClass, JAberturaNfce>) end;

  JAcrescimoClass = interface(JProcessosClass)
    ['{6D1ACE85-07E2-4C5C-B643-BB4EA87623EF}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Acrescimo')]
  JAcrescimo = interface(JProcessos)
    ['{6DD6E8A6-BE14-40E9-8EDA-9D70E7995CB2}']
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJAcrescimo = class(TJavaGenericImport<JAcrescimoClass, JAcrescimo>) end;

  JConfiguraCofinsAliqClass = interface(JPersistenciaClass)
    ['{210EBDDB-6CF6-4DEB-8348-BC246BA0CDD2}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCofinsAliq')]
  JConfiguraCofinsAliq = interface(JPersistencia)
    ['{4FA3035B-2980-4191-911A-3E92B9FAD701}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCofinsAliq = class(TJavaGenericImport<JConfiguraCofinsAliqClass, JConfiguraCofinsAliq>) end;

  JConfiguraCofinsNTClass = interface(JPersistenciaClass)
    ['{F9B3F35F-5A9B-40C5-B57A-AEDF76231365}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCofinsNT')]
  JConfiguraCofinsNT = interface(JPersistencia)
    ['{C55E88BF-BA66-4897-95F4-CAB0E19DFC46}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCofinsNT = class(TJavaGenericImport<JConfiguraCofinsNTClass, JConfiguraCofinsNT>) end;

  JConfiguraCofinsOutrClass = interface(JPersistenciaClass)
    ['{C66068E2-83A1-4A9C-811F-C90661E38151}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCofinsOutr')]
  JConfiguraCofinsOutr = interface(JPersistencia)
    ['{9B4FB5DF-ECF3-4B31-A9FC-E244A1B383D5}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCofinsOutr = class(TJavaGenericImport<JConfiguraCofinsOutrClass, JConfiguraCofinsOutr>) end;

  JConfiguraCofinsQtdeClass = interface(JPersistenciaClass)
    ['{36940274-9F26-4D8D-9B22-82AC43122271}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCofinsQtde')]
  JConfiguraCofinsQtde = interface(JPersistencia)
    ['{718D6D11-8AED-4555-A09D-A231762FB838}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCofinsQtde = class(TJavaGenericImport<JConfiguraCofinsQtdeClass, JConfiguraCofinsQtde>) end;

  JConfiguraCofinsSnClass = interface(JPersistenciaClass)
    ['{038B3F25-9902-4D42-8B1A-D120747FCD03}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCofinsSn')]
  JConfiguraCofinsSn = interface(JPersistencia)
    ['{77268140-7E31-449C-9BA7-F8EC49307739}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCofinsSn = class(TJavaGenericImport<JConfiguraCofinsSnClass, JConfiguraCofinsSn>) end;

  JConfiguraCombustivelClass = interface(JPersistenciaClass)
    ['{21849130-5020-4155-B353-51D9A6B266CD}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraCombustivel')]
  JConfiguraCombustivel = interface(JPersistencia)
    ['{121F1705-EFC8-4F1E-81BB-5A119C84D3A8}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraCombustivel = class(TJavaGenericImport<JConfiguraCombustivelClass, JConfiguraCombustivel>) end;

  JConfiguraICMS00Class = interface(JPersistenciaClass)
    ['{89E7B52C-CF87-417E-B068-E5F6AFAF5688}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS00')]
  JConfiguraICMS00 = interface(JPersistencia)
    ['{29A249E0-FFB9-4F1F-9614-2DA8B415C0BE}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS00 = class(TJavaGenericImport<JConfiguraICMS00Class, JConfiguraICMS00>) end;

  JConfiguraICMS10Class = interface(JPersistenciaClass)
    ['{4ABEDC63-0DD5-4EE6-8F83-02170957E425}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS10')]
  JConfiguraICMS10 = interface(JPersistencia)
    ['{5D9DF2D5-0B5B-4ECD-85BC-7138423E84D9}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS10 = class(TJavaGenericImport<JConfiguraICMS10Class, JConfiguraICMS10>) end;

  JConfiguraICMS20Class = interface(JPersistenciaClass)
    ['{DA54452C-FBDC-4625-BDE6-E1746286631E}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS20')]
  JConfiguraICMS20 = interface(JPersistencia)
    ['{1D1580E3-A0B3-453A-BA9F-A02280C40F93}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS20 = class(TJavaGenericImport<JConfiguraICMS20Class, JConfiguraICMS20>) end;

  JConfiguraICMS30Class = interface(JPersistenciaClass)
    ['{ABDCE0A5-6A4A-41AF-8774-997FFB04A8DD}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS30')]
  JConfiguraICMS30 = interface(JPersistencia)
    ['{7AA4C38D-164C-4FFC-AFC1-CDD6554EDA7B}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS30 = class(TJavaGenericImport<JConfiguraICMS30Class, JConfiguraICMS30>) end;

  JConfiguraICMS40Class = interface(JPersistenciaClass)
    ['{BF9ABCE7-720A-4D5F-BAF1-18F8087EF265}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS40')]
  JConfiguraICMS40 = interface(JPersistencia)
    ['{20B3CB22-2031-436C-A881-E511901682D0}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS40 = class(TJavaGenericImport<JConfiguraICMS40Class, JConfiguraICMS40>) end;

  JConfiguraICMS51Class = interface(JPersistenciaClass)
    ['{16D29C55-8457-4266-8A2A-53FC0FF1CA04}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS51')]
  JConfiguraICMS51 = interface(JPersistencia)
    ['{50CDCD9B-F631-4EA8-AD09-01FB69B55504}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS51 = class(TJavaGenericImport<JConfiguraICMS51Class, JConfiguraICMS51>) end;

  JConfiguraICMS60Class = interface(JPersistenciaClass)
    ['{1E0D435B-3CB8-4F8C-82F9-CFF4D3A4B0BF}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS60')]
  JConfiguraICMS60 = interface(JPersistencia)
    ['{6117267A-7DD6-4FFF-B437-952B42761084}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS60 = class(TJavaGenericImport<JConfiguraICMS60Class, JConfiguraICMS60>) end;

  JConfiguraICMS70Class = interface(JPersistenciaClass)
    ['{049D3FA5-E6A4-4F3B-897E-C9C72AAA9D1B}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS70')]
  JConfiguraICMS70 = interface(JPersistencia)
    ['{8D5066D1-0B64-4FC7-AB2F-7B7EA0527BD9}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS70 = class(TJavaGenericImport<JConfiguraICMS70Class, JConfiguraICMS70>) end;

  JConfiguraICMS90Class = interface(JPersistenciaClass)
    ['{AAAD94FE-9F05-440A-940B-C8CEC2B5847B}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMS90')]
  JConfiguraICMS90 = interface(JPersistencia)
    ['{D51F1B9A-6968-4A21-9005-AB3F33977C7D}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMS90 = class(TJavaGenericImport<JConfiguraICMS90Class, JConfiguraICMS90>) end;

  JConfiguraICMSPartClass = interface(JPersistenciaClass)
    ['{2B1E0847-C169-43DE-B548-81EDA94714D6}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSPart')]
  JConfiguraICMSPart = interface(JPersistencia)
    ['{E88A788B-F9BC-43F1-956A-337C4297C0EB}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSPart = class(TJavaGenericImport<JConfiguraICMSPartClass, JConfiguraICMSPart>) end;

  JConfiguraICMSSN101Class = interface(JPersistenciaClass)
    ['{433B4040-33D2-449B-B94B-F5A5769FB988}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN101')]
  JConfiguraICMSSN101 = interface(JPersistencia)
    ['{A86FB0BF-D5B2-4496-9C6B-2F79A1144281}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN101 = class(TJavaGenericImport<JConfiguraICMSSN101Class, JConfiguraICMSSN101>) end;

  JConfiguraICMSSN102Class = interface(JPersistenciaClass)
    ['{370C7882-3645-4FE0-B4B5-807A27916491}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN102')]
  JConfiguraICMSSN102 = interface(JPersistencia)
    ['{C1973B97-833F-4A64-8E81-2261471F4AD5}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN102 = class(TJavaGenericImport<JConfiguraICMSSN102Class, JConfiguraICMSSN102>) end;

  JConfiguraICMSSN201Class = interface(JPersistenciaClass)
    ['{180D3B90-4D79-40F1-8799-20BCA662005A}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN201')]
  JConfiguraICMSSN201 = interface(JPersistencia)
    ['{EBD24B7B-CD25-4D55-BE8B-9A8D46BEE5A8}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN201 = class(TJavaGenericImport<JConfiguraICMSSN201Class, JConfiguraICMSSN201>) end;

  JConfiguraICMSSN202Class = interface(JPersistenciaClass)
    ['{8876D62A-19DE-4B46-98F7-E2A38376FAA7}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN202')]
  JConfiguraICMSSN202 = interface(JPersistencia)
    ['{750909DF-468E-4C23-8F3C-8BED953631F8}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN202 = class(TJavaGenericImport<JConfiguraICMSSN202Class, JConfiguraICMSSN202>) end;

  JConfiguraICMSSN500Class = interface(JPersistenciaClass)
    ['{47605E78-28AD-4DB5-8869-9C1EC1AEE654}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN500')]
  JConfiguraICMSSN500 = interface(JPersistencia)
    ['{D4E8E688-8E7B-4755-B267-FB98995139FE}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN500 = class(TJavaGenericImport<JConfiguraICMSSN500Class, JConfiguraICMSSN500>) end;

  JConfiguraICMSSN900Class = interface(JPersistenciaClass)
    ['{49AB8617-4C09-41AD-9819-986CB38E7C23}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSSN900')]
  JConfiguraICMSSN900 = interface(JPersistencia)
    ['{45F49679-D1A6-4A62-A631-E1D586651D2B}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSSN900 = class(TJavaGenericImport<JConfiguraICMSSN900Class, JConfiguraICMSSN900>) end;

  JConfiguraICMSSTClass = interface(JPersistenciaClass)
    ['{FC31DF0E-1B5D-4D5D-B77A-1055E9B8C9DC}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraICMSST')]
  JConfiguraICMSST = interface(JPersistencia)
    ['{DE1C25B1-282E-4903-A3C8-10579B2D0B74}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraICMSST = class(TJavaGenericImport<JConfiguraICMSSTClass, JConfiguraICMSST>) end;

  JConfiguraLeiImpostoClass = interface(JPersistenciaClass)
    ['{074C6ABD-4B30-42A5-BA50-C95D282D7D6B}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraLeiImposto')]
  JConfiguraLeiImposto = interface(JPersistencia)
    ['{A4D2FA78-8B37-48EC-83F4-10A60E6B0C42}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraLeiImposto = class(TJavaGenericImport<JConfiguraLeiImpostoClass, JConfiguraLeiImposto>) end;

  JConfiguraPisAliqClass = interface(JPersistenciaClass)
    ['{812172BD-4DC2-4A68-8ED3-B9D6A3BB6B22}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraPisAliq')]
  JConfiguraPisAliq = interface(JPersistencia)
    ['{A081ED7F-9D17-4FA8-97C1-EB8D58313259}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraPisAliq = class(TJavaGenericImport<JConfiguraPisAliqClass, JConfiguraPisAliq>) end;

  JConfiguraPisNTClass = interface(JPersistenciaClass)
    ['{FEE83C65-9CE0-474E-89CB-4B3DCED46DD3}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraPisNT')]
  JConfiguraPisNT = interface(JPersistencia)
    ['{F29335BA-3094-4E03-9A3C-6AA5D24116A3}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraPisNT = class(TJavaGenericImport<JConfiguraPisNTClass, JConfiguraPisNT>) end;

  JConfiguraPisOutrClass = interface(JPersistenciaClass)
    ['{953B05D5-19BC-43F4-9B38-8A39B34AD5D8}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraPisOutr')]
  JConfiguraPisOutr = interface(JPersistencia)
    ['{7F65C239-0DF2-4831-871F-1134879F7592}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraPisOutr = class(TJavaGenericImport<JConfiguraPisOutrClass, JConfiguraPisOutr>) end;

  JConfiguraPisQtdeClass = interface(JPersistenciaClass)
    ['{C27162BA-E1CB-406E-97E1-087ED811026C}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraPisQtde')]
  JConfiguraPisQtde = interface(JPersistencia)
    ['{15B327B1-C4B6-47D4-8DA0-CA49DF0D2AFD}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraPisQtde = class(TJavaGenericImport<JConfiguraPisQtdeClass, JConfiguraPisQtde>) end;

  JConfiguraPisSnClass = interface(JPersistenciaClass)
    ['{7A4A7FB3-E656-481C-A07D-4EDC6C6DC959}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/ConfiguraPisSn')]
  JConfiguraPisSn = interface(JPersistencia)
    ['{A73E6CF2-8442-4528-AD21-8567B9EC5928}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJConfiguraPisSn = class(TJavaGenericImport<JConfiguraPisSnClass, JConfiguraPisSn>) end;

  JDescontosClass = interface(JProcessosClass)
    ['{4EDA5D62-30D5-48BA-B3C0-18EBC2886E85}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Descontos')]
  JDescontos = interface(JProcessos)
    ['{102381E1-7ABE-40A5-9C81-76498BFCD241}']
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJDescontos = class(TJavaGenericImport<JDescontosClass, JDescontos>) end;

  JEncerramentoClass = interface(JPersistenciaClass)
    ['{46EDBCEA-94F3-42E6-8BDA-56FBFCC32423}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Encerramento')]
  JEncerramento = interface(JPersistencia)
    ['{E36BFAE4-41CA-4E4A-B6C1-D994A84445EF}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJEncerramento = class(TJavaGenericImport<JEncerramentoClass, JEncerramento>) end;

  JIdentificarConsumidorClass = interface(JProcessosClass)
    ['{D042EA22-1CA4-414C-A1F0-ADFF7E20A545}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/IdentificarConsumidor')]
  JIdentificarConsumidor = interface(JProcessos)
    ['{78DA2321-DFFF-4EB3-8DA4-0D95E8390C60}']
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJIdentificarConsumidor = class(TJavaGenericImport<JIdentificarConsumidorClass, JIdentificarConsumidor>) end;

  Jnfce_ItemClass = interface(JProcessosClass)
    ['{39E4EB9A-C2D3-4F4B-BF9E-6405B0B5E1AF}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Item')]
  Jnfce_Item = interface(JProcessos)
    ['{CD0158FA-0809-4054-9B59-01CD3CCAA15A}']
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJnfce_Item = class(TJavaGenericImport<Jnfce_ItemClass, Jnfce_Item>) end;

  JOp_XmlRetornoClass = interface(Jgne_UtilsClass)
    ['{B09BD606-3149-49A0-ABD4-1FF3549FCCAD}']
    {class} function _GetretIde: JArrayList; cdecl;
    {class} procedure armazenarDigestValueEChave(string_: JString; string_1: JString; context: JContext); cdecl;
    {class} function init: JOp_XmlRetorno; cdecl;//Deprecated
    {class} property retIde: JArrayList read _GetretIde;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Op_XmlRetorno')]
  JOp_XmlRetorno = interface(Jgne_Utils)
    ['{EFAE804C-D89F-4E91-966C-885555EC3E25}']
    procedure lerXMlVendaDaruma(string_: JString; string_1: JString; context: JContext); cdecl;
    function preencherInfoRetWS(string_: JString; context: JContext): Integer; cdecl;
  end;
  TJOp_XmlRetorno = class(TJavaGenericImport<JOp_XmlRetornoClass, JOp_XmlRetorno>) end;

  Jnfce_LayoutClass = interface(JOp_XmlRetornoClass)
    ['{91B158FD-29E2-4533-B6E1-663FBF1B56E8}']
    {class} function _Getimpressora: Integer; cdecl;
    {class} function init: Jnfce_Layout; cdecl;//Deprecated
    {class} property impressora: Integer read _Getimpressora;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Layout')]
  Jnfce_Layout = interface(JOp_XmlRetorno)
    ['{F9EC8945-36B9-4BEA-8679-FA29735F69EA}']
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
    ['{7D0536BD-BA14-4B55-97D0-863358036D90}']
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
    ['{4F6A2C19-597E-4524-AD5E-48A675369B56}']
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
    ['{B327F59D-620E-4183-B066-3D139CD73985}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Pagamento')]
  JPagamento = interface(JProcessos)
    ['{9FEEBEA1-FA7A-4278-A082-530635DFE511}']
    procedure estornarPagamento(string_: JString; string_1: JString; string_2: JString; context: JContext); cdecl;
    procedure substituirTag(string_: JString; string_1: JString; context: JContext); cdecl;
    procedure substituirTagCancela(string_: JString; context: JContext); cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJPagamento = class(TJavaGenericImport<JPagamentoClass, JPagamento>) end;

  JPagarClass = interface(JPersistenciaClass)
    ['{3AA56819-F00B-43B3-96E3-FB4F1AEF97CD}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Pagar')]
  JPagar = interface(JPersistencia)
    ['{55B0A13B-5FBD-438D-BF9C-F979804139EA}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJPagar = class(TJavaGenericImport<JPagarClass, JPagar>) end;

  JPagarComCartaoClass = interface(JPersistenciaClass)
    ['{719121CF-24B4-430A-8CC5-A4BF1190250C}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/PagarComCartao')]
  JPagarComCartao = interface(JPersistencia)
    ['{8378238C-2649-4157-82AC-95BBDD8BEEBA}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJPagarComCartao = class(TJavaGenericImport<JPagarComCartaoClass, JPagarComCartao>) end;

  JTiposNFCeClass = interface(JObjectClass)
    ['{412C6E2D-3B1B-4D64-A40E-030D1CAE50C9}']
    {class} function init: JTiposNFCe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/TiposNFCe')]
  JTiposNFCe = interface(JObject)
    ['{54780830-4452-4F2C-8ECD-BC9AD9B63E76}']
  end;
  TJTiposNFCe = class(TJavaGenericImport<JTiposNFCeClass, JTiposNFCe>) end;

  JTotalizacaoClass = interface(JPersistenciaClass)
    ['{560327C3-7653-4360-B286-D64C4FAC01EB}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Totalizacao')]
  JTotalizacao = interface(JPersistencia)
    ['{B52B7B5B-2DEB-4A5A-B2AF-4AB3FD2A7890}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJTotalizacao = class(TJavaGenericImport<JTotalizacaoClass, JTotalizacao>) end;

  JTransportadoraClass = interface(JPersistenciaClass)
    ['{24CB8ACA-808E-4CAA-A5CD-9050A865B70D}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/Transportadora')]
  JTransportadora = interface(JPersistencia)
    ['{37A2BB30-4935-4055-AF39-15AEE8DEDC4B}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJTransportadora = class(TJavaGenericImport<JTransportadoraClass, JTransportadora>) end;

  JVendeItemClass = interface(JPersistenciaClass)
    ['{472A265D-BCD4-42CD-B9C1-B7CC34CC6C60}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/VendeItem')]
  JVendeItem = interface(JPersistencia)
    ['{F4C2A2F6-7F7F-4A15-BFD8-CF2B6F314221}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJVendeItem = class(TJavaGenericImport<JVendeItemClass, JVendeItem>) end;

  JVendeItemCompletoClass = interface(JPersistenciaClass)
    ['{4C143B19-222E-4F8B-974A-0CE4D6C2CF81}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/VendeItemCompleto')]
  JVendeItemCompleto = interface(JPersistencia)
    ['{AAC886A4-1A9D-4CAF-8631-E4D066571FB0}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJVendeItemCompleto = class(TJavaGenericImport<JVendeItemCompletoClass, JVendeItemCompleto>) end;

  JObjetosClass = interface(JObjectClass)
    ['{AB3CDAB4-2081-4020-AD65-CE5FB01EF3AC}']
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
    ['{8559E6C7-2E63-4108-AE2E-BE4A327D3885}']
  end;
  TJObjetos = class(TJavaGenericImport<JObjetosClass, JObjetos>) end;

  JOp_XmlAuxiliarClass = interface(JObjectClass)
    ['{F279E3F8-1766-4C1A-9CFB-7BDC449A253F}']
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
    ['{80F33D1C-5DA7-4EB1-A7FB-561C6B5593C8}']
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
    ['{539A14B0-BDC0-4B9D-96D2-DBD49C1BA8EB}']
    {class} function init: JOp_XmlCanc; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Op_XmlCanc')]
  JOp_XmlCanc = interface(JObject)
    ['{4B982EA7-28F5-4EC7-AF20-04B77F036371}']
    //function fnLerXmlCanc(string_: JString; context: JContext): Jjdom2_Document; cdecl;
    function gerarXmlcancelamento(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; b: Boolean; context: JContext): JString; cdecl;
    //function separarInfo(document: Jjdom2_Document): TJavaObjectArray<JString>; cdecl;
  end;
  TJOp_XmlCanc = class(TJavaGenericImport<JOp_XmlCancClass, JOp_XmlCanc>) end;

  Jxml_Op_XmlConsultaClass = interface(JObjectClass)
    ['{A6EEF21F-E4B6-4238-80B1-DDF5D2EBAD5C}']
    {class} function init: Jxml_Op_XmlConsulta; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Op_XmlConsulta')]
  Jxml_Op_XmlConsulta = interface(JObject)
    ['{85213979-0120-41EF-A7E7-5100DCD35665}']
    function gerarXmlConsulta(context: JContext): JString; cdecl;
    function preencherXmlConsultaNFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; context: JContext): JString; cdecl;
  end;
  TJxml_Op_XmlConsulta = class(TJavaGenericImport<Jxml_Op_XmlConsultaClass, Jxml_Op_XmlConsulta>) end;

  JOp_XmlContingenciaClass = interface(JObjectClass)
    ['{56A7C951-1F88-4285-B057-C02B8263483D}']
    {class} function init(context: JContext): JOp_XmlContingencia; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Op_XmlContingencia')]
  JOp_XmlContingencia = interface(JObject)
    ['{2DA6ACF6-FDF7-4BAE-8C28-A0569232294F}']
    function _Getgs_cont: JElementosXMLContingencia; cdecl;
    procedure _Setgs_cont(Value: JElementosXMLContingencia); cdecl;
    function lerXMlVendaCont(string_: JString; c: TJavaArray<Char>; c1: TJavaArray<Char>; string_1: JString): JString; cdecl;
    procedure sepraraInfoXML(string_: JString; c: TJavaArray<Char>; c1: TJavaArray<Char>; c2: TJavaArray<Char>); cdecl;
    property gs_cont: JElementosXMLContingencia read _Getgs_cont write _Setgs_cont;
  end;
  TJOp_XmlContingencia = class(TJavaGenericImport<JOp_XmlContingenciaClass, JOp_XmlContingencia>) end;

  JOp_XmlInutilizacaoClass = interface(JOp_XmlAuxiliarClass)
    ['{4EC8F801-29B2-46DD-BA42-21B22FC37182}']
    {class} function init: JOp_XmlInutilizacao; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Op_XmlInutilizacao')]
  JOp_XmlInutilizacao = interface(JOp_XmlAuxiliar)
    ['{D3E2E6E2-7967-45C8-A438-D2DE073214DF}']
    function gerarXmlInutilizacao(string_: JString; string_1: JString; string_2: JString; string_3: JString; context: JContext): JString; cdecl;
    procedure preencherXml(string_: JString; string_1: JString; string_2: JString; string_3: JString; context: JContext); cdecl;
  end;
  TJOp_XmlInutilizacao = class(TJavaGenericImport<JOp_XmlInutilizacaoClass, JOp_XmlInutilizacao>) end;

  JXml_ElementosEnvioNFCeClass = interface(Jgne_UtilsClass)
    ['{C8FF91C7-2EB9-4709-AC35-8348F7E8406C}']
    {class} function init: JXml_ElementosEnvioNFCe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/Xml_ElementosEnvioNFCe')]
  JXml_ElementosEnvioNFCe = interface(Jgne_Utils)
    ['{AC55B500-D692-46BA-A6A2-C0F51F2BBFB0}']
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
    ['{8938AEEE-3C61-4A37-A263-36FF8873E899}']
    {class} function init: JAux_XmlAvisoServ; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/auxiliar/Aux_XmlAvisoServ')]
  JAux_XmlAvisoServ = interface(JTags)
    ['{23872B4F-620F-4D52-821B-C78190134347}']
    function getDias: JString; cdecl;
    function getEmail: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setDias(string_: JString); cdecl;
    procedure setEmail(string_: JString); cdecl;
  end;
  TJAux_XmlAvisoServ = class(TJavaGenericImport<JAux_XmlAvisoServClass, JAux_XmlAvisoServ>) end;

  JAux_XmlIdeClass = interface(JTagsClass)
    ['{9E725D29-588B-4C72-8788-3BBF0862FCA5}']
    {class} function init: JAux_XmlIde; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/auxiliar/Aux_XmlIde')]
  JAux_XmlIde = interface(JTags)
    ['{406FFE27-6D26-46AB-8995-150F271394D2}']
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
    ['{ED421C83-E932-42DE-8F4B-9384BB916D64}']
    {class} function init: JAux_XmlInfIntermed; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/auxiliar/Aux_XmlInfIntermed')]
  JAux_XmlInfIntermed = interface(JTags)
    ['{FBD15C9B-4EE5-492A-BCA3-F4C45900A370}']
    function getCNPJ: JString; cdecl;
    function getIdCadIntTran: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCNPJ(string_: JString); cdecl;
    procedure setIdCadIntTran(string_: JString); cdecl;
  end;
  TJAux_XmlInfIntermed = class(TJavaGenericImport<JAux_XmlInfIntermedClass, JAux_XmlInfIntermed>) end;

  JAux_XmlNfceClass = interface(JTagsClass)
    ['{7DDB588D-DFC6-451C-8B6A-6C86422F5E11}']
    {class} function init: JAux_XmlNfce; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/auxiliar/Aux_XmlNfce')]
  JAux_XmlNfce = interface(JTags)
    ['{E084D43F-37A1-4E3D-91FF-5DF4C04ECA2D}']
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
    ['{6993BF05-D5E7-4D5E-A0B1-6F5199CE8D4D}']
    {class} function init: JAux_XmlTransp; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/auxiliar/Aux_XmlTransp')]
  JAux_XmlTransp = interface(JTags)
    ['{99FDBE59-D98A-4AD1-ABBE-B52599AED626}']
    function getModFrete: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setModFrete(string_: JString); cdecl;
  end;
  TJAux_XmlTransp = class(TJavaGenericImport<JAux_XmlTranspClass, JAux_XmlTransp>) end;

  JACClass = interface(JTagsClass)
    ['{D26C8503-52D4-4F38-A40B-4FD215BA115A}']
    {class} function init: JAC; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/AC')]
  JAC = interface(JTags)
    ['{3C20557B-FB92-4002-AD54-785199C3079C}']
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
    ['{7CAD2E42-B947-43D5-B999-8B504638A420}']
    {class} function init: JAL; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/AL')]
  JAL = interface(JTags)
    ['{0C6CBE06-8127-4E1E-A79E-57A9D6A92F3F}']
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
    ['{9073C29D-E032-4EFB-B594-451CB8B8E18D}']
    {class} function init: JAM; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/AM')]
  JAM = interface(JTags)
    ['{BA68BA62-F410-4FDE-B8AE-30295D713556}']
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
    ['{1F4FF9EE-703A-4E74-8C9A-1464EE79EDD0}']
    {class} function init: JAP; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/AP')]
  JAP = interface(JTags)
    ['{D9D8FBFB-D399-4FF2-98E7-DEC588590052}']
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
    ['{7293B524-6A8A-436A-8E1F-794A20D512A9}']
    {class} function init: JBA; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/BA')]
  JBA = interface(JTags)
    ['{1D45AA1F-C151-4220-9AAB-E3DF9FC0281F}']
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
    ['{CBBCBF72-9C2B-449C-BD77-E27657F02568}']
    {class} function init: JCE; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CE')]
  JCE = interface(JTags)
    ['{5E726185-E5E2-4A58-8233-B2C8E24DE27D}']
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
    ['{A38D58CA-6F45-4C70-93F7-1304EB20A42C}']
    {class} function _GetvCIDE: JString; cdecl;
    {class} procedure _SetvCIDE(Value: JString); cdecl;
    {class} function init: JCideAuxiliar; cdecl;//Deprecated
    {class} property vCIDE: JString read _GetvCIDE write _SetvCIDE;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CideAuxiliar')]
  JCideAuxiliar = interface(JTags)
    ['{CF75EA7D-92C6-427C-BEF3-05EC817CDE08}']
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
    ['{3AD0A941-FD13-40FD-9E6C-DFE3D838BD45}']
    {class} function _GetpCOFINS: JString; cdecl;
    {class} procedure _SetpCOFINS(Value: JString); cdecl;
    {class} function _GetvCOFINS: JString; cdecl;
    {class} procedure _SetvCOFINS(Value: JString); cdecl;
    {class} function init: JCofinsAliqAuxiliar; cdecl;//Deprecated
    {class} property pCOFINS: JString read _GetpCOFINS write _SetpCOFINS;
    {class} property vCOFINS: JString read _GetvCOFINS write _SetvCOFINS;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsAliqAuxiliar')]
  JCofinsAliqAuxiliar = interface(JTags)
    ['{A377B9E7-496E-4957-9D27-5361E46B4050}']
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
    ['{866C9301-E4F4-4FEB-BAC3-EE4E0C9F4738}']
    {class} function init: JCofinsNtAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsNtAuxiliar')]
  JCofinsNtAuxiliar = interface(JTags)
    ['{C0CDCCD6-B47A-4789-A102-070DF3E61792}']
    function getCST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJCofinsNtAuxiliar = class(TJavaGenericImport<JCofinsNtAuxiliarClass, JCofinsNtAuxiliar>) end;

  JCofinsOutrAuxiliarClass = interface(JTagsClass)
    ['{132ABFD5-6194-4664-B170-6C91A55BB633}']
    {class} function _GetpCOFINS: JString; cdecl;
    {class} procedure _SetpCOFINS(Value: JString); cdecl;
    {class} function _GetqBCProd: JString; cdecl;
    {class} procedure _SetqBCProd(Value: JString); cdecl;
    {class} function _GetvAliqProd: JString; cdecl;
    {class} procedure _SetvAliqProd(Value: JString); cdecl;
    {class} function init: JCofinsOutrAuxiliar; cdecl;//Deprecated
    {class} property pCOFINS: JString read _GetpCOFINS write _SetpCOFINS;
    {class} property qBCProd: JString read _GetqBCProd write _SetqBCProd;
    {class} property vAliqProd: JString read _GetvAliqProd write _SetvAliqProd;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsOutrAuxiliar')]
  JCofinsOutrAuxiliar = interface(JTags)
    ['{FABB6745-E811-4820-AB5D-49055ED8D865}']
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
    ['{6D0962C0-3C84-4D02-B824-FEAEBC2F8882}']
    {class} function _GetvAliqProd: JString; cdecl;
    {class} procedure _SetvAliqProd(Value: JString); cdecl;
    {class} function _GetvCOFINS: JString; cdecl;
    {class} procedure _SetvCOFINS(Value: JString); cdecl;
    {class} function init: JCofinsQtdeAuxiliar; cdecl;//Deprecated
    {class} property vAliqProd: JString read _GetvAliqProd write _SetvAliqProd;
    {class} property vCOFINS: JString read _GetvCOFINS write _SetvCOFINS;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsQtdeAuxiliar')]
  JCofinsQtdeAuxiliar = interface(JTags)
    ['{36CC0361-DC21-4792-93A7-C615F49F1BEF}']
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
    ['{8D35DF0B-FB81-449E-B42E-9E3018A489FD}']
    {class} function init: JCofinsSnAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsSnAuxiliar')]
  JCofinsSnAuxiliar = interface(JTags)
    ['{E5408BF1-805C-4332-AA58-BA792A7296DF}']
    function getCST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJCofinsSnAuxiliar = class(TJavaGenericImport<JCofinsSnAuxiliarClass, JCofinsSnAuxiliar>) end;

  JCofinsStAuxiliarClass = interface(JTagsClass)
    ['{42F19B0C-CA3A-449A-BDB9-863A256D5EF9}']
    {class} function _GetqBCProd: JString; cdecl;
    {class} procedure _SetqBCProd(Value: JString); cdecl;
    {class} function _GetvAliqProd: JString; cdecl;
    {class} procedure _SetvAliqProd(Value: JString); cdecl;
    {class} function _GetvCOFINS: JString; cdecl;
    {class} procedure _SetvCOFINS(Value: JString); cdecl;
    {class} function init: JCofinsStAuxiliar; cdecl;
    {class} property qBCProd: JString read _GetqBCProd write _SetqBCProd;
    {class} property vAliqProd: JString read _GetvAliqProd write _SetvAliqProd;
    {class} property vCOFINS: JString read _GetvCOFINS write _SetvCOFINS;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CofinsStAuxiliar')]
  JCofinsStAuxiliar = interface(JTags)
    ['{567AAEAB-5C72-4AFC-AAA2-7F68E6B7303A}']
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
    ['{F33CD68B-9E44-4C38-B838-EC84ACD11C00}']
    {class} function _GetCODIF: JString; cdecl;
    {class} procedure _SetCODIF(Value: JString); cdecl;
    {class} function _GetUFCons: JString; cdecl;
    {class} procedure _SetUFCons(Value: JString); cdecl;
    {class} function _GetpGLP: JString; cdecl;
    {class} procedure _SetpGLP(Value: JString); cdecl;
    {class} function _GetpGNi: JString; cdecl;
    {class} procedure _SetpGNi(Value: JString); cdecl;
    {class} function _GetpGNn: JString; cdecl;
    {class} procedure _SetpGNn(Value: JString); cdecl;
    {class} function _GetqTemp: JString; cdecl;
    {class} procedure _SetqTemp(Value: JString); cdecl;
    {class} function init: JCombAuxiliar; cdecl;
    {class} property CODIF: JString read _GetCODIF write _SetCODIF;
    {class} property UFCons: JString read _GetUFCons write _SetUFCons;
    {class} property pGLP: JString read _GetpGLP write _SetpGLP;
    {class} property pGNi: JString read _GetpGNi write _SetpGNi;
    {class} property pGNn: JString read _GetpGNn write _SetpGNn;
    {class} property qTemp: JString read _GetqTemp write _SetqTemp;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/CombAuxiliar')]
  JCombAuxiliar = interface(JTags)
    ['{E6EA6F4B-B36C-4CC8-984E-31FF47E771F1}']
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
    ['{45A861EE-79C3-4D24-8153-0B2EE96EA805}']
    {class} function init: JConfiguracaoAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ConfiguracaoAuxiliar')]
  JConfiguracaoAuxiliar = interface(JTags)
    ['{9BF19D67-7CAD-491B-AC34-BCDC69ABC87C}']
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
    ['{A7E00F5B-2FEE-417C-83E2-79D0F7DE5E87}']
    {class} function init: JDF; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/DF')]
  JDF = interface(JTags)
    ['{33B02A22-442F-4B7F-980A-78D93BB73856}']
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
    ['{EEEFC00D-4E5C-4F57-B2B5-BF9D84C375F6}']
    {class} function init: JES; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ES')]
  JES = interface(JTags)
    ['{F519188A-56CF-4EC5-B3A5-1EF678B7B687}']
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
    ['{4AE60691-14C0-4477-90EC-C761D81A6074}']
    {class} //function _Getserie: Jjdom2_Element; cdecl;
    {class} //procedure _Setserie(Value: Jjdom2_Element); cdecl;
    {class} function init: JElementosXMLContingencia; cdecl;//Deprecated
    {class} //property serie: Jjdom2_Element read _Getserie write _Setserie;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ElementosXMLContingencia')]
  JElementosXMLContingencia = interface(JObject)
    ['{BB2A7F1B-C33E-4D79-9001-42529506189A}']
    //function _GetSubstituirDocumento: Jjdom2_Element; cdecl;
    //procedure _SetSubstituirDocumento(Value: Jjdom2_Element); cdecl;
    //function _GetnNF: Jjdom2_Element; cdecl;
    //procedure _SetnNF(Value: Jjdom2_Element); cdecl;
    procedure vinculaXml; cdecl;
    //property SubstituirDocumento: Jjdom2_Element read _GetSubstituirDocumento write _SetSubstituirDocumento;
    //property nNF: Jjdom2_Element read _GetnNF write _SetnNF;
  end;
  TJElementosXMLContingencia = class(TJavaGenericImport<JElementosXMLContingenciaClass, JElementosXMLContingencia>) end;

  JElementosXMlInutilizacaoClass = interface(JObjectClass)
    ['{62D1C8B4-DBCD-478B-A18A-6D52D2461EC4}']
    {class} //function _Getambiente: Jjdom2_Element; cdecl;
    {class} //procedure _Setambiente(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcnpjEmissor: Jjdom2_Element; cdecl;
    {class} //procedure _SetcnpjEmissor(Value: Jjdom2_Element); cdecl;
    {class} //function _Getjustificativa: Jjdom2_Element; cdecl;
    {class} //procedure _Setjustificativa(Value: Jjdom2_Element); cdecl;
    {class} //function _GetnumeroFinal: Jjdom2_Element; cdecl;
    {class} //procedure _SetnumeroFinal(Value: Jjdom2_Element); cdecl;
    {class} //function _Getserie: Jjdom2_Element; cdecl;
    {class} //procedure _Setserie(Value: Jjdom2_Element); cdecl;
    {class} //function _Getversao: Jjdom2_Element; cdecl;
    {class} //procedure _Setversao(Value: Jjdom2_Element); cdecl;
    {class} function init: JElementosXMlInutilizacao; cdecl;
    {class} //property ambiente: Jjdom2_Element read _Getambiente write _Setambiente;
    {class} //property cnpjEmissor: Jjdom2_Element read _GetcnpjEmissor write _SetcnpjEmissor;
    {class} //property justificativa: Jjdom2_Element read _Getjustificativa write _Setjustificativa;
    {class} //property numeroFinal: Jjdom2_Element read _GetnumeroFinal write _SetnumeroFinal;
    {class} //property serie: Jjdom2_Element read _Getserie write _Setserie;
    {class} //property versao: Jjdom2_Element read _Getversao write _Setversao;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ElementosXMlInutilizacao')]
  JElementosXMlInutilizacao = interface(JObject)
    ['{0AA1C99F-D62A-4350-84B4-AF5564BABF06}']
    //function _Getinutilizacao: Jjdom2_Element; cdecl;
    //procedure _Setinutilizacao(Value: Jjdom2_Element); cdecl;
    //function _GetmodeloDocumento: Jjdom2_Element; cdecl;
    //procedure _SetmodeloDocumento(Value: Jjdom2_Element); cdecl;
    //function _GetnumeroInicial: Jjdom2_Element; cdecl;
    //procedure _SetnumeroInicial(Value: Jjdom2_Element); cdecl;
    procedure vinculaXml; cdecl;
    //property inutilizacao: Jjdom2_Element read _Getinutilizacao write _Setinutilizacao;
    //property modeloDocumento: Jjdom2_Element read _GetmodeloDocumento write _SetmodeloDocumento;
    //property numeroInicial: Jjdom2_Element read _GetnumeroInicial write _SetnumeroInicial;
  end;
  TJElementosXMlInutilizacao = class(TJavaGenericImport<JElementosXMlInutilizacaoClass, JElementosXMlInutilizacao>) end;

  JElementosXmlAuxiliarClass = interface(JObjectClass)
    ['{E080103F-5031-4163-9A86-5CB042F14F0C}']
    {class} //function _GetAC: Jjdom2_Element; cdecl;
    {class} //procedure _SetAC(Value: Jjdom2_Element); cdecl;
    {class} //function _GetAL: Jjdom2_Element; cdecl;
    {class} //procedure _SetAL(Value: Jjdom2_Element); cdecl;
    {class} //function _GetAM: Jjdom2_Element; cdecl;
    {class} //procedure _SetAM(Value: Jjdom2_Element); cdecl;
    {class} //function _GetAP: Jjdom2_Element; cdecl;
    {class} //procedure _SetAP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetAVISO_SERV: Jjdom2_Element; cdecl;
    {class} //procedure _SetAVISO_SERV(Value: Jjdom2_Element); cdecl;
    {class} //function _GetAjustarValorFPgto: Jjdom2_Element; cdecl;
    {class} //procedure _SetAjustarValorFPgto(Value: Jjdom2_Element); cdecl;
    {class} //function _GetArredondarTruncar: Jjdom2_Element; cdecl;
    {class} //procedure _SetArredondarTruncar(Value: Jjdom2_Element); cdecl;
    {class} //function _GetAvisoContingencia: Jjdom2_Element; cdecl;
    {class} //procedure _SetAvisoContingencia(Value: Jjdom2_Element); cdecl;
    {class} //function _GetBA: Jjdom2_Element; cdecl;
    {class} //procedure _SetBA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCE: Jjdom2_Element; cdecl;
    {class} //procedure _SetCE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCEP: Jjdom2_Element; cdecl;
    {class} //procedure _SetCEP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCEST: Jjdom2_Element; cdecl;
    {class} //procedure _SetCEST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCFOP: Jjdom2_Element; cdecl;
    {class} //procedure _SetCFOP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCIDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetCIDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCNPJ: Jjdom2_Element; cdecl;
    {class} //procedure _SetCNPJ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCNPJFab: Jjdom2_Element; cdecl;
    {class} //procedure _SetCNPJFab(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCNPJ_Intermed: Jjdom2_Element; cdecl;
    {class} //procedure _SetCNPJ_Intermed(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCODIF: Jjdom2_Element; cdecl;
    {class} //procedure _SetCODIF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCOFINS: Jjdom2_Element; cdecl;
    {class} //procedure _SetCOFINS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCOFINSALIQ: Jjdom2_Element; cdecl;
    {class} //procedure _SetCOFINSALIQ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCOFINSNT: Jjdom2_Element; cdecl;
    {class} //procedure _SetCOFINSNT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCOFINSOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetCOFINSOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCOFINSQTDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetCOFINSQTDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCOFINSST: Jjdom2_Element; cdecl;
    {class} //procedure _SetCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCOMB: Jjdom2_Element; cdecl;
    {class} //procedure _SetCOMB(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCPF: Jjdom2_Element; cdecl;
    {class} //procedure _SetCPF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCRT: Jjdom2_Element; cdecl;
    {class} //procedure _SetCRT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSOSN102: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSOSN102(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSOSNSN101: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSOSNSN101(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSOSNSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSOSNSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSOSNSN202: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSOSNSN202(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSOSNSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSOSNSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSOSNSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSOSNSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCST: Jjdom2_Element; cdecl;
    {class} //procedure _SetCST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCST10: Jjdom2_Element; cdecl;
    {class} //procedure _SetCST10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCST20: Jjdom2_Element; cdecl;
    {class} //procedure _SetCST20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCST30: Jjdom2_Element; cdecl;
    {class} //procedure _SetCST30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCST40: Jjdom2_Element; cdecl;
    {class} //procedure _SetCST40(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCST51: Jjdom2_Element; cdecl;
    {class} //procedure _SetCST51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCST60: Jjdom2_Element; cdecl;
    {class} //procedure _SetCST60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCST70: Jjdom2_Element; cdecl;
    {class} //procedure _SetCST70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCST90: Jjdom2_Element; cdecl;
    {class} //procedure _SetCST90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSTALIQ: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSTALIQ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSTCOFINOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSTCOFINOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSTCOFINSALIQ: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSTCOFINSALIQ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSTCOFINSNT: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSTCOFINSNT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSTCOFINSQTDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSTCOFINSQTDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSTPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSTPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSTPISOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSTPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSTQTDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSTQTDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSTSNT: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSTSNT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCSTST: Jjdom2_Element; cdecl;
    {class} //procedure _SetCSTST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoAC: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoAC(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoAL: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoAL(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoAM: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoAM(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoAP: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoAP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoBA: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoBA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoCE: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoCE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoDF: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoDF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoES: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoES(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoGO: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoGO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoMA: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoMA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoMG: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoMG(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoMS: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoMS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoMT: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoMT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoPA: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoPA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoPB: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoPB(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoPE: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoPE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoPI: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoPI(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoPR: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoPR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoRJ: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoRJ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoRN: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoRN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoRO: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoRO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoRR: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoRR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoRS: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoRS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoSC: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoSC(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoSE: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoSE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoSP: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoSP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConHomoTO: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConHomoTO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdAC: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdAC(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdAL: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdAL(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdAM: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdAM(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdAP: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdAP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdBA: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdBA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdCE: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdCE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdDF: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdDF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdES: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdES(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdGO: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdGO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdMA: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdMA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdMG: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdMG(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdMS: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdMS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdMT: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdMT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdPA: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdPA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdPB: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdPB(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdPE: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdPE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdPI: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdPI(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdPR: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdPR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdRJ: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdRJ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdRN: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdRN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdRO: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdRO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdRR: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdRR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdRS: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdRS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdSC: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdSC(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdSE: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdSE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdSP: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdSP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetChaveConProdTO: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaveConProdTO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetCodImpressaoSEFAZ: Jjdom2_Element; cdecl;
    {class} //procedure _SetCodImpressaoSEFAZ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetColunasArquivo: Jjdom2_Element; cdecl;
    {class} //procedure _SetColunasArquivo(Value: Jjdom2_Element); cdecl;
    {class} //function _GetDF: Jjdom2_Element; cdecl;
    {class} //procedure _SetDF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEMAIL: Jjdom2_Element; cdecl;
    {class} //procedure _SetEMAIL(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEMIT: Jjdom2_Element; cdecl;
    {class} //procedure _SetEMIT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetENDEREMIT: Jjdom2_Element; cdecl;
    {class} //procedure _SetENDEREMIT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetES: Jjdom2_Element; cdecl;
    {class} //procedure _SetES(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEmissaoOffLine: Jjdom2_Element; cdecl;
    {class} //procedure _SetEmissaoOffLine(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEmpCO: Jjdom2_Element; cdecl;
    {class} //procedure _SetEmpCO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEmpPK: Jjdom2_Element; cdecl;
    {class} //procedure _SetEmpPK(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEnderecoServidor: Jjdom2_Element; cdecl;
    {class} //procedure _SetEnderecoServidor(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEstadoCFe: Jjdom2_Element; cdecl;
    {class} //procedure _SetEstadoCFe(Value: Jjdom2_Element); cdecl;
    {class} //function _GetGO: Jjdom2_Element; cdecl;
    {class} //procedure _SetGO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetHabilitar: Jjdom2_Element; cdecl;
    {class} //procedure _SetHabilitar(Value: Jjdom2_Element); cdecl;
    {class} //function _GetHabilitarSAT: Jjdom2_Element; cdecl;
    {class} //procedure _SetHabilitarSAT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMS: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMS00: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMS00(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMS10: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMS10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMS20: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMS20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMS30: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMS30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMS40: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMS40(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMS51: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMS51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMS60: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMS60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMS70: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMS70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMS90: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMS90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMSPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMSPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMSSN101: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMSSN101(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMSSN102: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMSSN102(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMSSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMSSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMSSN202: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMSSN202(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMSSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMSSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMSSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMSSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetICMSST: Jjdom2_Element; cdecl;
    {class} //procedure _SetICMSST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetIDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetIDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetIE: Jjdom2_Element; cdecl;
    {class} //procedure _SetIE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetIM: Jjdom2_Element; cdecl;
    {class} //procedure _SetIM(Value: Jjdom2_Element); cdecl;
    {class} //function _GetIMPOSTO: Jjdom2_Element; cdecl;
    {class} //procedure _SetIMPOSTO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetISSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetISSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetImpressaoCompleta: Jjdom2_Element; cdecl;
    {class} //procedure _SetImpressaoCompleta(Value: Jjdom2_Element); cdecl;
    {class} //function _GetImprimir: Jjdom2_Element; cdecl;
    {class} //procedure _SetImprimir(Value: Jjdom2_Element); cdecl;
    {class} //function _GetLEIDOIMPOSTO: Jjdom2_Element; cdecl;
    {class} //procedure _SetLEIDOIMPOSTO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetLayoutImpressao: Jjdom2_Element; cdecl;
    {class} //procedure _SetLayoutImpressao(Value: Jjdom2_Element); cdecl;
    {class} //function _GetLocalArquivoNCM: Jjdom2_Element; cdecl;
    {class} //procedure _SetLocalArquivoNCM(Value: Jjdom2_Element); cdecl;
    {class} //function _GetLocalArquivos: Jjdom2_Element; cdecl;
    {class} //procedure _SetLocalArquivos(Value: Jjdom2_Element); cdecl;
    {class} //function _GetLocalLogo: Jjdom2_Element; cdecl;
    {class} //procedure _SetLocalLogo(Value: Jjdom2_Element); cdecl;
    {class} //function _GetMA: Jjdom2_Element; cdecl;
    {class} //procedure _SetMA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetMED: Jjdom2_Element; cdecl;
    {class} //procedure _SetMED(Value: Jjdom2_Element); cdecl;
    {class} //function _GetMG: Jjdom2_Element; cdecl;
    {class} //procedure _SetMG(Value: Jjdom2_Element); cdecl;
    {class} //function _GetMSGPROMOCIONAL: Jjdom2_Element; cdecl;
    {class} //procedure _SetMSGPROMOCIONAL(Value: Jjdom2_Element); cdecl;
    {class} //function _GetMT: Jjdom2_Element; cdecl;
    {class} //procedure _SetMT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetMod: Jjdom2_Element; cdecl;
    {class} //procedure _SetMod(Value: Jjdom2_Element); cdecl;
    {class} //function _GetModelo: Jjdom2_Element; cdecl;
    {class} //procedure _SetModelo(Value: Jjdom2_Element); cdecl;
    {class} //function _GetMsgLeiDoImposto: Jjdom2_Element; cdecl;
    {class} //procedure _SetMsgLeiDoImposto(Value: Jjdom2_Element); cdecl;
    {class} //function _GetNCM: Jjdom2_Element; cdecl;
    {class} //procedure _SetNCM(Value: Jjdom2_Element); cdecl;
    {class} //function _GetNFCE: Jjdom2_Element; cdecl;
    {class} //procedure _SetNFCE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetNT: Jjdom2_Element; cdecl;
    {class} //procedure _SetNT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetNaoReenvioCont: Jjdom2_Element; cdecl;
    {class} //procedure _SetNaoReenvioCont(Value: Jjdom2_Element); cdecl;
    {class} //function _GetNro: Jjdom2_Element; cdecl;
    {class} //procedure _SetNro(Value: Jjdom2_Element); cdecl;
    {class} //function _GetNumeracaoAutomatica: Jjdom2_Element; cdecl;
    {class} //procedure _SetNumeracaoAutomatica(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPA: Jjdom2_Element; cdecl;
    {class} //procedure _SetPA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPB: Jjdom2_Element; cdecl;
    {class} //procedure _SetPB(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPE: Jjdom2_Element; cdecl;
    {class} //procedure _SetPE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPI: Jjdom2_Element; cdecl;
    {class} //procedure _SetPI(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPIS: Jjdom2_Element; cdecl;
    {class} //procedure _SetPIS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPISALIQ: Jjdom2_Element; cdecl;
    {class} //procedure _SetPISALIQ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPISNT: Jjdom2_Element; cdecl;
    {class} //procedure _SetPISNT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPISOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPISQTDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetPISQTDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPISST: Jjdom2_Element; cdecl;
    {class} //procedure _SetPISST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPR: Jjdom2_Element; cdecl;
    {class} //procedure _SetPR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPROD: Jjdom2_Element; cdecl;
    {class} //procedure _SetPROD(Value: Jjdom2_Element); cdecl;
    {class} //function _GetPorta: Jjdom2_Element; cdecl;
    {class} //procedure _SetPorta(Value: Jjdom2_Element); cdecl;
    {class} //function _GetQrcodeBMP: Jjdom2_Element; cdecl;
    {class} //procedure _SetQrcodeBMP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetQtdLinhas: Jjdom2_Element; cdecl;
    {class} //procedure _SetQtdLinhas(Value: Jjdom2_Element); cdecl;
    {class} //function _GetRJ: Jjdom2_Element; cdecl;
    {class} //procedure _SetRJ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetRN: Jjdom2_Element; cdecl;
    {class} //procedure _SetRN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetRO: Jjdom2_Element; cdecl;
    {class} //procedure _SetRO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetRR: Jjdom2_Element; cdecl;
    {class} //procedure _SetRR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetRS: Jjdom2_Element; cdecl;
    {class} //procedure _SetRS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetRangeCtg: Jjdom2_Element; cdecl;
    {class} //procedure _SetRangeCtg(Value: Jjdom2_Element); cdecl;
    {class} //function _GetSC: Jjdom2_Element; cdecl;
    {class} //procedure _SetSC(Value: Jjdom2_Element); cdecl;
    {class} //function _GetSE: Jjdom2_Element; cdecl;
    {class} //procedure _SetSE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetSP: Jjdom2_Element; cdecl;
    {class} //procedure _SetSP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetSalvarDanfePDF: Jjdom2_Element; cdecl;
    {class} //procedure _SetSalvarDanfePDF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetSalvarXMLPDF: Jjdom2_Element; cdecl;
    {class} //procedure _SetSalvarXMLPDF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetSenha: Jjdom2_Element; cdecl;
    {class} //procedure _SetSenha(Value: Jjdom2_Element); cdecl;
    {class} //function _GetSeparadorArquivo: Jjdom2_Element; cdecl;
    {class} //procedure _SetSeparadorArquivo(Value: Jjdom2_Element); cdecl;
    {class} //function _GetSerie: Jjdom2_Element; cdecl;
    {class} //procedure _SetSerie(Value: Jjdom2_Element); cdecl;
    {class} //function _GetSerieContingencia: Jjdom2_Element; cdecl;
    {class} //procedure _SetSerieContingencia(Value: Jjdom2_Element); cdecl;
    {class} //function _GetServidorSMTP: Jjdom2_Element; cdecl;
    {class} //procedure _SetServidorSMTP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetTO: Jjdom2_Element; cdecl;
    {class} //procedure _SetTO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetTRANSP: Jjdom2_Element; cdecl;
    {class} //procedure _SetTRANSP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetTipoNF: Jjdom2_Element; cdecl;
    {class} //procedure _SetTipoNF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetTitulo: Jjdom2_Element; cdecl;
    {class} //procedure _SetTitulo(Value: Jjdom2_Element); cdecl;
    {class} //function _GetToken: Jjdom2_Element; cdecl;
    {class} //procedure _SetToken(Value: Jjdom2_Element); cdecl;
    {class} //function _GetUF: Jjdom2_Element; cdecl;
    {class} //procedure _SetUF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetUFCons: Jjdom2_Element; cdecl;
    {class} //procedure _SetUFCons(Value: Jjdom2_Element); cdecl;
    {class} //function _GetUFSTPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetUFSTPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetURLS: Jjdom2_Element; cdecl;
    {class} //procedure _SetURLS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetValidadeServ: Jjdom2_Element; cdecl;
    {class} //procedure _SetValidadeServ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetVersaoQRCode: Jjdom2_Element; cdecl;
    {class} //procedure _SetVersaoQRCode(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcBarra: Jjdom2_Element; cdecl;
    {class} //procedure _SetcBarra(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcBarraTrib: Jjdom2_Element; cdecl;
    {class} //procedure _SetcBarraTrib(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcBenef: Jjdom2_Element; cdecl;
    {class} //procedure _SetcBenef(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcEAN: Jjdom2_Element; cdecl;
    {class} //procedure _SetcEAN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcEANTrib: Jjdom2_Element; cdecl;
    {class} //procedure _SetcEANTrib(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcListServSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetcListServSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcMun: Jjdom2_Element; cdecl;
    {class} //procedure _SetcMun(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcMunFG: Jjdom2_Element; cdecl;
    {class} //procedure _SetcMunFG(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcMunFgSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetcMunFgSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcMunSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetcMunSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcNF: Jjdom2_Element; cdecl;
    {class} //procedure _SetcNF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcPaisSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetcPaisSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcProdANP: Jjdom2_Element; cdecl;
    {class} //procedure _SetcProdANP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcProdANVISA: Jjdom2_Element; cdecl;
    {class} //procedure _SetcProdANVISA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcServicoSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetcServicoSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetcUF: Jjdom2_Element; cdecl;
    {class} //procedure _SetcUF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetchaveAcesso: Jjdom2_Element; cdecl;
    {class} //procedure _SetchaveAcesso(Value: Jjdom2_Element); cdecl;
    {class} //function _GetctgNNF: Jjdom2_Element; cdecl;
    {class} //procedure _SetctgNNF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetctgSerie: Jjdom2_Element; cdecl;
    {class} //procedure _SetctgSerie(Value: Jjdom2_Element); cdecl;
    {class} //function _GetdFab: Jjdom2_Element; cdecl;
    {class} //procedure _SetdFab(Value: Jjdom2_Element); cdecl;
    {class} //function _GetdVal: Jjdom2_Element; cdecl;
    {class} //procedure _SetdVal(Value: Jjdom2_Element); cdecl;
    {class} //function _Getdias: Jjdom2_Element; cdecl;
    {class} //procedure _Setdias(Value: Jjdom2_Element); cdecl;
    {class} //function _Getemail: Jjdom2_Element; cdecl;
    {class} //procedure _Setemail(Value: Jjdom2_Element); cdecl;
    {class} //function _GetfinNfe: Jjdom2_Element; cdecl;
    {class} //procedure _SetfinNfe(Value: Jjdom2_Element); cdecl;
    {class} //function _GethistoricoXML: Jjdom2_Element; cdecl;
    {class} //procedure _SethistoricoXML(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoAL: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoAL(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoAM: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoAM(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoAP: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoAP(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoBA: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoBA(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoCE: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoCE(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoDF: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoDF(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoES: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoES(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoGO: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoGO(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoMA: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoMA(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoMG: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoMG(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoMS: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoMS(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoMT: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoMT(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoPA: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoPA(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoPB: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoPB(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoPE: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoPE(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoPI: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoPI(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoPR: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoPR(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoRJ: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoRJ(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoRN: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoRN(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoRO: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoRO(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoRR: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoRR(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoRS: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoRS(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoSC: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoSC(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoSE: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoSE(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoSP: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoSP(Value: Jjdom2_Element); cdecl;
    {class} //function _GethomoTO: Jjdom2_Element; cdecl;
    {class} //procedure _SethomoTO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetidCadIntTran: Jjdom2_Element; cdecl;
    {class} //procedure _SetidCadIntTran(Value: Jjdom2_Element); cdecl;
    {class} //function _GetidDest: Jjdom2_Element; cdecl;
    {class} //procedure _SetidDest(Value: Jjdom2_Element); cdecl;
    {class} //function _GetidToken: Jjdom2_Element; cdecl;
    {class} //procedure _SetidToken(Value: Jjdom2_Element); cdecl;
    {class} //function _Getimpressora: Jjdom2_Element; cdecl;
    {class} //procedure _Setimpressora(Value: Jjdom2_Element); cdecl;
    {class} //function _GetindEscala: Jjdom2_Element; cdecl;
    {class} //procedure _SetindEscala(Value: Jjdom2_Element); cdecl;
    {class} //function _GetindFinal: Jjdom2_Element; cdecl;
    {class} //procedure _SetindFinal(Value: Jjdom2_Element); cdecl;
    {class} //function _GetindISSSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetindISSSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetindIncentivoSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetindIncentivoSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetindIntermed: Jjdom2_Element; cdecl;
    {class} //procedure _SetindIntermed(Value: Jjdom2_Element); cdecl;
    {class} //function _GetindPag: Jjdom2_Element; cdecl;
    {class} //procedure _SetindPag(Value: Jjdom2_Element); cdecl;
    {class} //function _GetindPres: Jjdom2_Element; cdecl;
    {class} //procedure _SetindPres(Value: Jjdom2_Element); cdecl;
    {class} //function _GetindTot: Jjdom2_Element; cdecl;
    {class} //procedure _SetindTot(Value: Jjdom2_Element); cdecl;
    {class} //function _GetinfIntermed: Jjdom2_Element; cdecl;
    {class} //procedure _SetinfIntermed(Value: Jjdom2_Element); cdecl;
    {class} //function _GetinfRespTec: Jjdom2_Element; cdecl;
    {class} //procedure _SetinfRespTec(Value: Jjdom2_Element); cdecl;
    {class} //function _GetirtCNPJ: Jjdom2_Element; cdecl;
    {class} //procedure _SetirtCNPJ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetirtCSRT: Jjdom2_Element; cdecl;
    {class} //procedure _SetirtCSRT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetirtFone: Jjdom2_Element; cdecl;
    {class} //procedure _SetirtFone(Value: Jjdom2_Element); cdecl;
    {class} //function _Getirtemail: Jjdom2_Element; cdecl;
    {class} //procedure _Setirtemail(Value: Jjdom2_Element); cdecl;
    {class} //function _GetirtidCSRT: Jjdom2_Element; cdecl;
    {class} //procedure _SetirtidCSRT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetirtxContato: Jjdom2_Element; cdecl;
    {class} //procedure _SetirtxContato(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBC: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBC(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBC10: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBC10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBC20: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBC20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBC51: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBC51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBC70: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBC70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBC90: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBC90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBCPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBCPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBCSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBCSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBCST10: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBCST10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBCST30: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBCST30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBCST70: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBCST70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBCST90: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBCST90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBCSTPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBCSTPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBCSTSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBCSTSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBCSTSN202: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBCSTSN202(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodBCSTSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodBCSTSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmodFrete: Jjdom2_Element; cdecl;
    {class} //procedure _SetmodFrete(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmotDesICMS20: Jjdom2_Element; cdecl;
    {class} //procedure _SetmotDesICMS20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmotDesICMS30: Jjdom2_Element; cdecl;
    {class} //procedure _SetmotDesICMS30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmotDesICMS40: Jjdom2_Element; cdecl;
    {class} //procedure _SetmotDesICMS40(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmotDesICMS70: Jjdom2_Element; cdecl;
    {class} //procedure _SetmotDesICMS70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetmotDesICMS90: Jjdom2_Element; cdecl;
    {class} //procedure _SetmotDesICMS90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetnLote: Jjdom2_Element; cdecl;
    {class} //procedure _SetnLote(Value: Jjdom2_Element); cdecl;
    {class} //function _GetnNF: Jjdom2_Element; cdecl;
    {class} //procedure _SetnNF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetnProcessoSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetnProcessoSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetnatOP: Jjdom2_Element; cdecl;
    {class} //procedure _SetnatOP(Value: Jjdom2_Element); cdecl;
    {class} //function _Getorig: Jjdom2_Element; cdecl;
    {class} //procedure _Setorig(Value: Jjdom2_Element); cdecl;
    {class} //function _Getorig10: Jjdom2_Element; cdecl;
    {class} //procedure _Setorig10(Value: Jjdom2_Element); cdecl;
    {class} //function _Getorig20: Jjdom2_Element; cdecl;
    {class} //procedure _Setorig20(Value: Jjdom2_Element); cdecl;
    {class} //function _Getorig202: Jjdom2_Element; cdecl;
    {class} //procedure _Setorig202(Value: Jjdom2_Element); cdecl;
    {class} //function _Getorig30: Jjdom2_Element; cdecl;
    {class} //procedure _Setorig30(Value: Jjdom2_Element); cdecl;
    {class} //function _Getorig40: Jjdom2_Element; cdecl;
    {class} //procedure _Setorig40(Value: Jjdom2_Element); cdecl;
    {class} //function _Getorig51: Jjdom2_Element; cdecl;
    {class} //procedure _Setorig51(Value: Jjdom2_Element); cdecl;
    {class} //function _Getorig60: Jjdom2_Element; cdecl;
    {class} //procedure _Setorig60(Value: Jjdom2_Element); cdecl;
    {class} //function _Getorig70: Jjdom2_Element; cdecl;
    {class} //procedure _Setorig70(Value: Jjdom2_Element); cdecl;
    {class} //function _Getorig90: Jjdom2_Element; cdecl;
    {class} //procedure _Setorig90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetorigPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetorigPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetorigSN101: Jjdom2_Element; cdecl;
    {class} //procedure _SetorigSN101(Value: Jjdom2_Element); cdecl;
    {class} //function _GetorigSN102: Jjdom2_Element; cdecl;
    {class} //procedure _SetorigSN102(Value: Jjdom2_Element); cdecl;
    {class} //function _GetorigSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetorigSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetorigSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetorigSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetorigSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetorigSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetorigST: Jjdom2_Element; cdecl;
    {class} //procedure _SetorigST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpBCOpPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetpBCOpPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpCOFINSCOFINSALIQ: Jjdom2_Element; cdecl;
    {class} //procedure _SetpCOFINSCOFINSALIQ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpCOFINSCOFINSOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetpCOFINSCOFINSOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpCOFINSCOFINSST: Jjdom2_Element; cdecl;
    {class} //procedure _SetpCOFINSCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpCredSNSN101: Jjdom2_Element; cdecl;
    {class} //procedure _SetpCredSNSN101(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpCredSNSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetpCredSNSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpCredSNSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetpCredSNSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpDif51: Jjdom2_Element; cdecl;
    {class} //procedure _SetpDif51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCP: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCP10: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCP10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCP20: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCP20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCP51: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCP51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCP70: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCP70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCP90: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCP90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCPST10: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCPST10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCPST30: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCPST30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCPST70: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCPST70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCPST90: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCPST90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCPSTRet60: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCPSTRet60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCPSTRetSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCPSTRetSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCPSTSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCPSTSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCPSTSN202: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCPSTSN202(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpFCPSTSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetpFCPSTSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpGLP: Jjdom2_Element; cdecl;
    {class} //procedure _SetpGLP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpGNi: Jjdom2_Element; cdecl;
    {class} //procedure _SetpGNi(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpGNn: Jjdom2_Element; cdecl;
    {class} //procedure _SetpGNn(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMS: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMS10: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMS10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMS20: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMS20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMS51: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMS51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMS70: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMS70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMS90: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMS90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSEfet60: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSEfet60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSEfetSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSEfetSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSST10: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSST10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSST30: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSST30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSST70: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSST70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSST90: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSST90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSSTPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSSTPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSSTSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSSTSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSSTSN202: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSSTSN202(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpICMSSTSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetpICMSSTSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpMVAST10: Jjdom2_Element; cdecl;
    {class} //procedure _SetpMVAST10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpMVAST30: Jjdom2_Element; cdecl;
    {class} //procedure _SetpMVAST30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpMVAST70: Jjdom2_Element; cdecl;
    {class} //procedure _SetpMVAST70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpMVAST90: Jjdom2_Element; cdecl;
    {class} //procedure _SetpMVAST90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpMVASTPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetpMVASTPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpMVASTSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetpMVASTSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpMVASTSN202: Jjdom2_Element; cdecl;
    {class} //procedure _SetpMVASTSN202(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpMVASTSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetpMVASTSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpPISALIQ: Jjdom2_Element; cdecl;
    {class} //procedure _SetpPISALIQ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpPISPISOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetpPISPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpPISPISST: Jjdom2_Element; cdecl;
    {class} //procedure _SetpPISPISST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBC20: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBC20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBC51: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBC51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBC70: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBC70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBC90: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBC90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCEfet60: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCEfet60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCEfetSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCEfetSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCST10: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCST10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCST30: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCST30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCST70: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCST70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCST90: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCST90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCSTPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCSTPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCSTSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCSTSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCSTSN202: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCSTSN202(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpRedBCSTSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetpRedBCSTSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpST60: Jjdom2_Element; cdecl;
    {class} //procedure _SetpST60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetpSTSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetpSTSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodAC: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodAC(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodAL: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodAL(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodAP: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodAP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodBA: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodBA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodCE: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodCE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodDF: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodDF(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodES: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodES(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodGO: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodGO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodMA: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodMA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodMG: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodMG(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodMS: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodMS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodMT: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodMT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodPA: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodPA(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodPB: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodPB(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodPE: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodPE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodPI: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodPI(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodPR: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodPR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodRJ: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodRJ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodRN: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodRN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodRO: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodRO(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodRS: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodRS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodSC: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodSC(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodSE: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodSE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodSP: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodSP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetprodTO: Jjdom2_Element; cdecl;
    {class} //procedure _SetprodTO(Value: Jjdom2_Element); cdecl;
    {class} //function _Getprotocolo: Jjdom2_Element; cdecl;
    {class} //procedure _Setprotocolo(Value: Jjdom2_Element); cdecl;
    {class} //function _GetqBCProd: Jjdom2_Element; cdecl;
    {class} //procedure _SetqBCProd(Value: Jjdom2_Element); cdecl;
    {class} //function _GetqBCProdCOFINSOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetqBCProdCOFINSOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetqBCProdCOFINSQTDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetqBCProdCOFINSQTDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetqBCProdCOFINSST: Jjdom2_Element; cdecl;
    {class} //procedure _SetqBCProdCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetqBCProdPISOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetqBCProdPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetqBCProdPISST: Jjdom2_Element; cdecl;
    {class} //procedure _SetqBCProdPISST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetqBCProdQTDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetqBCProdQTDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetqLote: Jjdom2_Element; cdecl;
    {class} //procedure _SetqLote(Value: Jjdom2_Element); cdecl;
    {class} //function _GetqTemp: Jjdom2_Element; cdecl;
    {class} //procedure _SetqTemp(Value: Jjdom2_Element); cdecl;
    {class} //function _GettpEmis: Jjdom2_Element; cdecl;
    {class} //procedure _SettpEmis(Value: Jjdom2_Element); cdecl;
    {class} //function _GettpImp: Jjdom2_Element; cdecl;
    {class} //procedure _SettpImp(Value: Jjdom2_Element); cdecl;
    {class} //function _GettpNF: Jjdom2_Element; cdecl;
    {class} //procedure _SettpNF(Value: Jjdom2_Element); cdecl;
    {class} //function _GettrocoNFCe: Jjdom2_Element; cdecl;
    {class} //procedure _SettrocoNFCe(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvAliqProd: Jjdom2_Element; cdecl;
    {class} //procedure _SetvAliqProd(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvAliqProdCOFINSOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetvAliqProdCOFINSOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvAliqProdCOFINSST: Jjdom2_Element; cdecl;
    {class} //procedure _SetvAliqProdCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvAliqProdCONFISQTDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetvAliqProdCONFISQTDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvAliqProdPISOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetvAliqProdPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvAliqProdPISST: Jjdom2_Element; cdecl;
    {class} //procedure _SetvAliqProdPISST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvAliqProdQTDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetvAliqProdQTDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvAliqSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetvAliqSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBC: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBC(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBC10: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBC10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBC20: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBC20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBC51: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBC51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBC70: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBC70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBC90: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBC90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCALIQ: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCALIQ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCCOFINOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCCOFINOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCCOFINSALIQ: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCCOFINSALIQ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCCOFINSST: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCEfet60: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCEfet60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCEfetSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCEfetSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCP10: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCP10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCP20: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCP20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCP51: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCP51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCP70: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCP70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCP90: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCP90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCPST10: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCPST10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCPST30: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCPST30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCPST70: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCPST70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCPST90: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCPST90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCPSTRet60: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCPSTRet60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCPSTRetSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCPSTRetSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCPSTSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCPSTSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCPSTSN202: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCPSTSN202(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCFCPSTSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCFCPSTSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCPISOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCPISST: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCPISST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCST10: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCST10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCST30: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCST30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCST70: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCST70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCST90: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCST90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCSTDestST: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCSTDestST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCSTPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCSTPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCSTRet60: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCSTRet60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCSTRetSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCSTRetSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCSTRetST: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCSTRetST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCSTSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCSTSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCSTSN202: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCSTSN202(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvBCSTSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetvBCSTSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvCIDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetvCIDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvCOFINSCOFINSALIQ: Jjdom2_Element; cdecl;
    {class} //procedure _SetvCOFINSCOFINSALIQ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvCOFINSCOFINSQTDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetvCOFINSCOFINSQTDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvCOFINSCOFINSST: Jjdom2_Element; cdecl;
    {class} //procedure _SetvCOFINSCOFINSST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvCONFISCONFISOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetvCONFISCONFISOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvCredICMSSNSN101: Jjdom2_Element; cdecl;
    {class} //procedure _SetvCredICMSSNSN101(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvCredICMSSNSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetvCredICMSSNSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvCredICMSSNSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetvCredICMSSNSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvDeducaoSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetvDeducaoSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvDescCondSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetvDescCondSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvDescIncondSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetvDescIncondSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCP: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCP(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCP10: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCP10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCP20: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCP20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCP51: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCP51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCP70: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCP70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCP90: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCP90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCPST10: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCPST10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCPST30: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCPST30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCPST90: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCPST90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCPSTRet60: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCPSTRet60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCPSTRetSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCPSTRetSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCPSTSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCPSTSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCPSTSN202: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCPSTSN202(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvFCPSTSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetvFCPSTSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMS: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMS(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMS10: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMS10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMS20: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMS20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMS51: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMS51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMS70: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMS70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMS90: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMS90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSDeson20: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSDeson20(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSDeson30: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSDeson30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSDeson40: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSDeson40(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSDeson70: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSDeson70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSDeson90: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSDeson90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSDif: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSDif(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSEfet60: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSEfet60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSEfetSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSEfetSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSOp51: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSOp51(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSST10: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSST10(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSST30: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSST30(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSST70: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSST70(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSST90: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSST90(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSSTDestST: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSSTDestST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSSTPART: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSSTPART(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSSTRet60: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSSTRet60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSSTRetSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSSTRetSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSSTRetST: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSSTRetST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSSTSN201: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSSTSN201(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSSTSN202: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSSTSN202(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSSTSN900: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSSTSN900(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSSubstituto60: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSSubstituto60(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvICMSSubstitutoSN500: Jjdom2_Element; cdecl;
    {class} //procedure _SetvICMSSubstitutoSN500(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvISSQNSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetvISSQNSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvISSRetSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetvISSRetSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvOutroSQN: Jjdom2_Element; cdecl;
    {class} //procedure _SetvOutroSQN(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvPISALIQ: Jjdom2_Element; cdecl;
    {class} //procedure _SetvPISALIQ(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvPISPISOUTR: Jjdom2_Element; cdecl;
    {class} //procedure _SetvPISPISOUTR(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvPISPISST: Jjdom2_Element; cdecl;
    {class} //procedure _SetvPISPISST(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvPISQTDE: Jjdom2_Element; cdecl;
    {class} //procedure _SetvPISQTDE(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvPMC: Jjdom2_Element; cdecl;
    {class} //procedure _SetvPMC(Value: Jjdom2_Element); cdecl;
    {class} //function _GetvPart: Jjdom2_Element; cdecl;
    {class} //procedure _SetvPart(Value: Jjdom2_Element); cdecl;
    {class} //function _GetverProc: Jjdom2_Element; cdecl;
    {class} //procedure _SetverProc(Value: Jjdom2_Element); cdecl;
    {class} //function _GetversaoNT: Jjdom2_Element; cdecl;
    {class} //procedure _SetversaoNT(Value: Jjdom2_Element); cdecl;
    {class} //function _GetxBairro: Jjdom2_Element; cdecl;
    {class} //procedure _SetxBairro(Value: Jjdom2_Element); cdecl;
    {class} //function _GetxJust: Jjdom2_Element; cdecl;
    {class} //procedure _SetxJust(Value: Jjdom2_Element); cdecl;
    {class} //function _GetxLgr: Jjdom2_Element; cdecl;
    {class} //procedure _SetxLgr(Value: Jjdom2_Element); cdecl;
    {class} //function _GetxMun: Jjdom2_Element; cdecl;
    {class} //procedure _SetxMun(Value: Jjdom2_Element); cdecl;
    {class} //function _GetxNome: Jjdom2_Element; cdecl;
    {class} //procedure _SetxNome(Value: Jjdom2_Element); cdecl;
    {class} function init: JElementosXmlAuxiliar; cdecl;//Deprecated
    {class} //property AC: Jjdom2_Element read _GetAC write _SetAC;
    {class} //property AL: Jjdom2_Element read _GetAL write _SetAL;
    {class} //property AM: Jjdom2_Element read _GetAM write _SetAM;
    {class} //property AP: Jjdom2_Element read _GetAP write _SetAP;
    {class} //property AVISO_SERV: Jjdom2_Element read _GetAVISO_SERV write _SetAVISO_SERV;
    {class} //property AjustarValorFPgto: Jjdom2_Element read _GetAjustarValorFPgto write _SetAjustarValorFPgto;
    {class} //property ArredondarTruncar: Jjdom2_Element read _GetArredondarTruncar write _SetArredondarTruncar;
    {class} //property AvisoContingencia: Jjdom2_Element read _GetAvisoContingencia write _SetAvisoContingencia;
    {class} //property BA: Jjdom2_Element read _GetBA write _SetBA;
    {class} //property CE: Jjdom2_Element read _GetCE write _SetCE;
    {class} //property CEP: Jjdom2_Element read _GetCEP write _SetCEP;
    {class} //property CEST: Jjdom2_Element read _GetCEST write _SetCEST;
    {class} //property CFOP: Jjdom2_Element read _GetCFOP write _SetCFOP;
    {class} //property CIDE: Jjdom2_Element read _GetCIDE write _SetCIDE;
    {class} //property CNPJ: Jjdom2_Element read _GetCNPJ write _SetCNPJ;
    {class} //property CNPJFab: Jjdom2_Element read _GetCNPJFab write _SetCNPJFab;
    {class} //property CNPJ_Intermed: Jjdom2_Element read _GetCNPJ_Intermed write _SetCNPJ_Intermed;
    {class} //property CODIF: Jjdom2_Element read _GetCODIF write _SetCODIF;
    {class} //property COFINS: Jjdom2_Element read _GetCOFINS write _SetCOFINS;
    {class} //property COFINSALIQ: Jjdom2_Element read _GetCOFINSALIQ write _SetCOFINSALIQ;
    {class} //property COFINSNT: Jjdom2_Element read _GetCOFINSNT write _SetCOFINSNT;
    {class} //property COFINSOUTR: Jjdom2_Element read _GetCOFINSOUTR write _SetCOFINSOUTR;
    {class} //property COFINSQTDE: Jjdom2_Element read _GetCOFINSQTDE write _SetCOFINSQTDE;
    {class} //property COFINSST: Jjdom2_Element read _GetCOFINSST write _SetCOFINSST;
    {class} //property COMB: Jjdom2_Element read _GetCOMB write _SetCOMB;
    {class} //property CPF: Jjdom2_Element read _GetCPF write _SetCPF;
    {class} //property CRT: Jjdom2_Element read _GetCRT write _SetCRT;
    {class} //property CSOSN102: Jjdom2_Element read _GetCSOSN102 write _SetCSOSN102;
    {class} //property CSOSNSN101: Jjdom2_Element read _GetCSOSNSN101 write _SetCSOSNSN101;
    {class} //property CSOSNSN201: Jjdom2_Element read _GetCSOSNSN201 write _SetCSOSNSN201;
    {class} //property CSOSNSN202: Jjdom2_Element read _GetCSOSNSN202 write _SetCSOSNSN202;
    {class} //property CSOSNSN500: Jjdom2_Element read _GetCSOSNSN500 write _SetCSOSNSN500;
    {class} //property CSOSNSN900: Jjdom2_Element read _GetCSOSNSN900 write _SetCSOSNSN900;
    {class} //property CST: Jjdom2_Element read _GetCST write _SetCST;
    {class} //property CST10: Jjdom2_Element read _GetCST10 write _SetCST10;
    {class} //property CST20: Jjdom2_Element read _GetCST20 write _SetCST20;
    {class} //property CST30: Jjdom2_Element read _GetCST30 write _SetCST30;
    {class} //property CST40: Jjdom2_Element read _GetCST40 write _SetCST40;
    {class} //property CST51: Jjdom2_Element read _GetCST51 write _SetCST51;
    {class} //property CST60: Jjdom2_Element read _GetCST60 write _SetCST60;
    {class} //property CST70: Jjdom2_Element read _GetCST70 write _SetCST70;
    {class} //property CST90: Jjdom2_Element read _GetCST90 write _SetCST90;
    {class} //property CSTALIQ: Jjdom2_Element read _GetCSTALIQ write _SetCSTALIQ;
    {class} //property CSTCOFINOUTR: Jjdom2_Element read _GetCSTCOFINOUTR write _SetCSTCOFINOUTR;
    {class} //property CSTCOFINSALIQ: Jjdom2_Element read _GetCSTCOFINSALIQ write _SetCSTCOFINSALIQ;
    {class} //property CSTCOFINSNT: Jjdom2_Element read _GetCSTCOFINSNT write _SetCSTCOFINSNT;
    {class} //property CSTCOFINSQTDE: Jjdom2_Element read _GetCSTCOFINSQTDE write _SetCSTCOFINSQTDE;
    {class} //property CSTPART: Jjdom2_Element read _GetCSTPART write _SetCSTPART;
    {class} //property CSTPISOUTR: Jjdom2_Element read _GetCSTPISOUTR write _SetCSTPISOUTR;
    {class} //property CSTQTDE: Jjdom2_Element read _GetCSTQTDE write _SetCSTQTDE;
    {class} //property CSTSNT: Jjdom2_Element read _GetCSTSNT write _SetCSTSNT;
    {class} //property CSTST: Jjdom2_Element read _GetCSTST write _SetCSTST;
    {class} //property ChaveConHomoAC: Jjdom2_Element read _GetChaveConHomoAC write _SetChaveConHomoAC;
    {class} //property ChaveConHomoAL: Jjdom2_Element read _GetChaveConHomoAL write _SetChaveConHomoAL;
    {class} //property ChaveConHomoAM: Jjdom2_Element read _GetChaveConHomoAM write _SetChaveConHomoAM;
    {class} //property ChaveConHomoAP: Jjdom2_Element read _GetChaveConHomoAP write _SetChaveConHomoAP;
    {class} //property ChaveConHomoBA: Jjdom2_Element read _GetChaveConHomoBA write _SetChaveConHomoBA;
    {class} //property ChaveConHomoCE: Jjdom2_Element read _GetChaveConHomoCE write _SetChaveConHomoCE;
    {class} //property ChaveConHomoDF: Jjdom2_Element read _GetChaveConHomoDF write _SetChaveConHomoDF;
    {class} //property ChaveConHomoES: Jjdom2_Element read _GetChaveConHomoES write _SetChaveConHomoES;
    {class} //property ChaveConHomoGO: Jjdom2_Element read _GetChaveConHomoGO write _SetChaveConHomoGO;
    {class} //property ChaveConHomoMA: Jjdom2_Element read _GetChaveConHomoMA write _SetChaveConHomoMA;
    {class} //property ChaveConHomoMG: Jjdom2_Element read _GetChaveConHomoMG write _SetChaveConHomoMG;
    {class} //property ChaveConHomoMS: Jjdom2_Element read _GetChaveConHomoMS write _SetChaveConHomoMS;
    {class} //property ChaveConHomoMT: Jjdom2_Element read _GetChaveConHomoMT write _SetChaveConHomoMT;
    {class} //property ChaveConHomoPA: Jjdom2_Element read _GetChaveConHomoPA write _SetChaveConHomoPA;
    {class} //property ChaveConHomoPB: Jjdom2_Element read _GetChaveConHomoPB write _SetChaveConHomoPB;
    {class} //property ChaveConHomoPE: Jjdom2_Element read _GetChaveConHomoPE write _SetChaveConHomoPE;
    {class} //property ChaveConHomoPI: Jjdom2_Element read _GetChaveConHomoPI write _SetChaveConHomoPI;
    {class} //property ChaveConHomoPR: Jjdom2_Element read _GetChaveConHomoPR write _SetChaveConHomoPR;
    {class} //property ChaveConHomoRJ: Jjdom2_Element read _GetChaveConHomoRJ write _SetChaveConHomoRJ;
    {class} //property ChaveConHomoRN: Jjdom2_Element read _GetChaveConHomoRN write _SetChaveConHomoRN;
    {class} //property ChaveConHomoRO: Jjdom2_Element read _GetChaveConHomoRO write _SetChaveConHomoRO;
    {class} //property ChaveConHomoRR: Jjdom2_Element read _GetChaveConHomoRR write _SetChaveConHomoRR;
    {class} //property ChaveConHomoRS: Jjdom2_Element read _GetChaveConHomoRS write _SetChaveConHomoRS;
    {class} //property ChaveConHomoSC: Jjdom2_Element read _GetChaveConHomoSC write _SetChaveConHomoSC;
    {class} //property ChaveConHomoSE: Jjdom2_Element read _GetChaveConHomoSE write _SetChaveConHomoSE;
    {class} //property ChaveConHomoSP: Jjdom2_Element read _GetChaveConHomoSP write _SetChaveConHomoSP;
    {class} //property ChaveConHomoTO: Jjdom2_Element read _GetChaveConHomoTO write _SetChaveConHomoTO;
    {class} //property ChaveConProdAC: Jjdom2_Element read _GetChaveConProdAC write _SetChaveConProdAC;
    {class} //property ChaveConProdAL: Jjdom2_Element read _GetChaveConProdAL write _SetChaveConProdAL;
    {class} //property ChaveConProdAM: Jjdom2_Element read _GetChaveConProdAM write _SetChaveConProdAM;
    {class} //property ChaveConProdAP: Jjdom2_Element read _GetChaveConProdAP write _SetChaveConProdAP;
    {class} //property ChaveConProdBA: Jjdom2_Element read _GetChaveConProdBA write _SetChaveConProdBA;
    {class} //property ChaveConProdCE: Jjdom2_Element read _GetChaveConProdCE write _SetChaveConProdCE;
    {class} //property ChaveConProdDF: Jjdom2_Element read _GetChaveConProdDF write _SetChaveConProdDF;
    {class} //property ChaveConProdES: Jjdom2_Element read _GetChaveConProdES write _SetChaveConProdES;
    {class} //property ChaveConProdGO: Jjdom2_Element read _GetChaveConProdGO write _SetChaveConProdGO;
    {class} //property ChaveConProdMA: Jjdom2_Element read _GetChaveConProdMA write _SetChaveConProdMA;
    {class} //property ChaveConProdMG: Jjdom2_Element read _GetChaveConProdMG write _SetChaveConProdMG;
    {class} //property ChaveConProdMS: Jjdom2_Element read _GetChaveConProdMS write _SetChaveConProdMS;
    {class} //property ChaveConProdMT: Jjdom2_Element read _GetChaveConProdMT write _SetChaveConProdMT;
    {class} //property ChaveConProdPA: Jjdom2_Element read _GetChaveConProdPA write _SetChaveConProdPA;
    {class} //property ChaveConProdPB: Jjdom2_Element read _GetChaveConProdPB write _SetChaveConProdPB;
    {class} //property ChaveConProdPE: Jjdom2_Element read _GetChaveConProdPE write _SetChaveConProdPE;
    {class} //property ChaveConProdPI: Jjdom2_Element read _GetChaveConProdPI write _SetChaveConProdPI;
    {class} //property ChaveConProdPR: Jjdom2_Element read _GetChaveConProdPR write _SetChaveConProdPR;
    {class} //property ChaveConProdRJ: Jjdom2_Element read _GetChaveConProdRJ write _SetChaveConProdRJ;
    {class} //property ChaveConProdRN: Jjdom2_Element read _GetChaveConProdRN write _SetChaveConProdRN;
    {class} //property ChaveConProdRO: Jjdom2_Element read _GetChaveConProdRO write _SetChaveConProdRO;
    {class} //property ChaveConProdRR: Jjdom2_Element read _GetChaveConProdRR write _SetChaveConProdRR;
    {class} //property ChaveConProdRS: Jjdom2_Element read _GetChaveConProdRS write _SetChaveConProdRS;
    {class} //property ChaveConProdSC: Jjdom2_Element read _GetChaveConProdSC write _SetChaveConProdSC;
    {class} //property ChaveConProdSE: Jjdom2_Element read _GetChaveConProdSE write _SetChaveConProdSE;
    {class} //property ChaveConProdSP: Jjdom2_Element read _GetChaveConProdSP write _SetChaveConProdSP;
    {class} //property ChaveConProdTO: Jjdom2_Element read _GetChaveConProdTO write _SetChaveConProdTO;
    {class} //property CodImpressaoSEFAZ: Jjdom2_Element read _GetCodImpressaoSEFAZ write _SetCodImpressaoSEFAZ;
    {class} //property ColunasArquivo: Jjdom2_Element read _GetColunasArquivo write _SetColunasArquivo;
    {class} //property DF: Jjdom2_Element read _GetDF write _SetDF;
    {class} //property EMAIL: Jjdom2_Element read _GetEMAIL write _SetEMAIL;
    {class} //property EMIT: Jjdom2_Element read _GetEMIT write _SetEMIT;
    {class} //property ENDEREMIT: Jjdom2_Element read _GetENDEREMIT write _SetENDEREMIT;
    {class} //property ES: Jjdom2_Element read _GetES write _SetES;
    {class} //property EmissaoOffLine: Jjdom2_Element read _GetEmissaoOffLine write _SetEmissaoOffLine;
    {class} //property EmpCO: Jjdom2_Element read _GetEmpCO write _SetEmpCO;
    {class} //property EmpPK: Jjdom2_Element read _GetEmpPK write _SetEmpPK;
    {class} //property EnderecoServidor: Jjdom2_Element read _GetEnderecoServidor write _SetEnderecoServidor;
    {class} //property EstadoCFe: Jjdom2_Element read _GetEstadoCFe write _SetEstadoCFe;
    {class} //property GO: Jjdom2_Element read _GetGO write _SetGO;
    {class} //property Habilitar: Jjdom2_Element read _GetHabilitar write _SetHabilitar;
    {class} //property HabilitarSAT: Jjdom2_Element read _GetHabilitarSAT write _SetHabilitarSAT;
    {class} //property ICMS: Jjdom2_Element read _GetICMS write _SetICMS;
    {class} //property ICMS00: Jjdom2_Element read _GetICMS00 write _SetICMS00;
    {class} //property ICMS10: Jjdom2_Element read _GetICMS10 write _SetICMS10;
    {class} //property ICMS20: Jjdom2_Element read _GetICMS20 write _SetICMS20;
    {class} //property ICMS30: Jjdom2_Element read _GetICMS30 write _SetICMS30;
    {class} //property ICMS40: Jjdom2_Element read _GetICMS40 write _SetICMS40;
    {class} //property ICMS51: Jjdom2_Element read _GetICMS51 write _SetICMS51;
    {class} //property ICMS60: Jjdom2_Element read _GetICMS60 write _SetICMS60;
    {class} //property ICMS70: Jjdom2_Element read _GetICMS70 write _SetICMS70;
    {class} //property ICMS90: Jjdom2_Element read _GetICMS90 write _SetICMS90;
    {class} //property ICMSPART: Jjdom2_Element read _GetICMSPART write _SetICMSPART;
    {class} //property ICMSSN101: Jjdom2_Element read _GetICMSSN101 write _SetICMSSN101;
    {class} //property ICMSSN102: Jjdom2_Element read _GetICMSSN102 write _SetICMSSN102;
    {class} //property ICMSSN201: Jjdom2_Element read _GetICMSSN201 write _SetICMSSN201;
    {class} //property ICMSSN202: Jjdom2_Element read _GetICMSSN202 write _SetICMSSN202;
    {class} //property ICMSSN500: Jjdom2_Element read _GetICMSSN500 write _SetICMSSN500;
    {class} //property ICMSSN900: Jjdom2_Element read _GetICMSSN900 write _SetICMSSN900;
    {class} //property ICMSST: Jjdom2_Element read _GetICMSST write _SetICMSST;
    {class} //property IDE: Jjdom2_Element read _GetIDE write _SetIDE;
    {class} //property IE: Jjdom2_Element read _GetIE write _SetIE;
    {class} //property IM: Jjdom2_Element read _GetIM write _SetIM;
    {class} //property IMPOSTO: Jjdom2_Element read _GetIMPOSTO write _SetIMPOSTO;
    {class} //property ISSQN: Jjdom2_Element read _GetISSQN write _SetISSQN;
    {class} //property ImpressaoCompleta: Jjdom2_Element read _GetImpressaoCompleta write _SetImpressaoCompleta;
    {class} //property Imprimir: Jjdom2_Element read _GetImprimir write _SetImprimir;
    {class} //property LEIDOIMPOSTO: Jjdom2_Element read _GetLEIDOIMPOSTO write _SetLEIDOIMPOSTO;
    {class} //property LayoutImpressao: Jjdom2_Element read _GetLayoutImpressao write _SetLayoutImpressao;
    {class} //property LocalArquivoNCM: Jjdom2_Element read _GetLocalArquivoNCM write _SetLocalArquivoNCM;
    {class} //property LocalArquivos: Jjdom2_Element read _GetLocalArquivos write _SetLocalArquivos;
    {class} //property LocalLogo: Jjdom2_Element read _GetLocalLogo write _SetLocalLogo;
    {class} //property MA: Jjdom2_Element read _GetMA write _SetMA;
    {class} //property MED: Jjdom2_Element read _GetMED write _SetMED;
    {class} //property MG: Jjdom2_Element read _GetMG write _SetMG;
    {class} //property MSGPROMOCIONAL: Jjdom2_Element read _GetMSGPROMOCIONAL write _SetMSGPROMOCIONAL;
    {class} //property MT: Jjdom2_Element read _GetMT write _SetMT;
    {class} //property &Mod: Jjdom2_Element read _GetMod write _SetMod;
    {class} //property Modelo: Jjdom2_Element read _GetModelo write _SetModelo;
    {class} //property MsgLeiDoImposto: Jjdom2_Element read _GetMsgLeiDoImposto write _SetMsgLeiDoImposto;
    {class} //property NCM: Jjdom2_Element read _GetNCM write _SetNCM;
    {class} //property NFCE: Jjdom2_Element read _GetNFCE write _SetNFCE;
    {class} //property NT: Jjdom2_Element read _GetNT write _SetNT;
    {class} //property NaoReenvioCont: Jjdom2_Element read _GetNaoReenvioCont write _SetNaoReenvioCont;
    {class} //property Nro: Jjdom2_Element read _GetNro write _SetNro;
    {class} //property NumeracaoAutomatica: Jjdom2_Element read _GetNumeracaoAutomatica write _SetNumeracaoAutomatica;
    {class} //property PA: Jjdom2_Element read _GetPA write _SetPA;
    {class} //property PB: Jjdom2_Element read _GetPB write _SetPB;
    {class} //property PE: Jjdom2_Element read _GetPE write _SetPE;
    {class} //property PI: Jjdom2_Element read _GetPI write _SetPI;
    {class} //property PIS: Jjdom2_Element read _GetPIS write _SetPIS;
    {class} //property PISALIQ: Jjdom2_Element read _GetPISALIQ write _SetPISALIQ;
    {class} //property PISNT: Jjdom2_Element read _GetPISNT write _SetPISNT;
    {class} //property PISOUTR: Jjdom2_Element read _GetPISOUTR write _SetPISOUTR;
    {class} //property PISQTDE: Jjdom2_Element read _GetPISQTDE write _SetPISQTDE;
    {class} //property PISST: Jjdom2_Element read _GetPISST write _SetPISST;
    {class} //property PR: Jjdom2_Element read _GetPR write _SetPR;
    {class} //property PROD: Jjdom2_Element read _GetPROD write _SetPROD;
    {class} //property Porta: Jjdom2_Element read _GetPorta write _SetPorta;
    {class} //property QrcodeBMP: Jjdom2_Element read _GetQrcodeBMP write _SetQrcodeBMP;
    {class} //property QtdLinhas: Jjdom2_Element read _GetQtdLinhas write _SetQtdLinhas;
    {class} //property RJ: Jjdom2_Element read _GetRJ write _SetRJ;
    {class} //property RN: Jjdom2_Element read _GetRN write _SetRN;
    {class} //property RO: Jjdom2_Element read _GetRO write _SetRO;
    {class} //property RR: Jjdom2_Element read _GetRR write _SetRR;
    {class} //property RS: Jjdom2_Element read _GetRS write _SetRS;
    {class} //property RangeCtg: Jjdom2_Element read _GetRangeCtg write _SetRangeCtg;
    {class} //property SC: Jjdom2_Element read _GetSC write _SetSC;
    {class} //property SE: Jjdom2_Element read _GetSE write _SetSE;
    {class} //property SP: Jjdom2_Element read _GetSP write _SetSP;
    {class} //property SalvarDanfePDF: Jjdom2_Element read _GetSalvarDanfePDF write _SetSalvarDanfePDF;
    {class} //property SalvarXMLPDF: Jjdom2_Element read _GetSalvarXMLPDF write _SetSalvarXMLPDF;
    {class} //property Senha: Jjdom2_Element read _GetSenha write _SetSenha;
    {class} //property SeparadorArquivo: Jjdom2_Element read _GetSeparadorArquivo write _SetSeparadorArquivo;
    {class} //property Serie: Jjdom2_Element read _GetSerie write _SetSerie;
    {class} //property SerieContingencia: Jjdom2_Element read _GetSerieContingencia write _SetSerieContingencia;
    {class} //property ServidorSMTP: Jjdom2_Element read _GetServidorSMTP write _SetServidorSMTP;
    {class} //property &TO: Jjdom2_Element read _GetTO write _SetTO;
    {class} //property TRANSP: Jjdom2_Element read _GetTRANSP write _SetTRANSP;
    {class} //property TipoNF: Jjdom2_Element read _GetTipoNF write _SetTipoNF;
    {class} //property Titulo: Jjdom2_Element read _GetTitulo write _SetTitulo;
    {class} //property Token: Jjdom2_Element read _GetToken write _SetToken;
    {class} //property UF: Jjdom2_Element read _GetUF write _SetUF;
    {class} //property UFCons: Jjdom2_Element read _GetUFCons write _SetUFCons;
    {class} //property UFSTPART: Jjdom2_Element read _GetUFSTPART write _SetUFSTPART;
    {class} //property URLS: Jjdom2_Element read _GetURLS write _SetURLS;
    {class} //property ValidadeServ: Jjdom2_Element read _GetValidadeServ write _SetValidadeServ;
    {class} //property VersaoQRCode: Jjdom2_Element read _GetVersaoQRCode write _SetVersaoQRCode;
    {class} //property cBarra: Jjdom2_Element read _GetcBarra write _SetcBarra;
    {class} //property cBarraTrib: Jjdom2_Element read _GetcBarraTrib write _SetcBarraTrib;
    {class} //property cBenef: Jjdom2_Element read _GetcBenef write _SetcBenef;
    {class} //property cEAN: Jjdom2_Element read _GetcEAN write _SetcEAN;
    {class} //property cEANTrib: Jjdom2_Element read _GetcEANTrib write _SetcEANTrib;
    {class} //property cListServSQN: Jjdom2_Element read _GetcListServSQN write _SetcListServSQN;
    {class} //property cMun: Jjdom2_Element read _GetcMun write _SetcMun;
    {class} //property cMunFG: Jjdom2_Element read _GetcMunFG write _SetcMunFG;
    {class} //property cMunFgSQN: Jjdom2_Element read _GetcMunFgSQN write _SetcMunFgSQN;
    {class} //property cMunSQN: Jjdom2_Element read _GetcMunSQN write _SetcMunSQN;
    {class} //property cNF: Jjdom2_Element read _GetcNF write _SetcNF;
    {class} //property cPaisSQN: Jjdom2_Element read _GetcPaisSQN write _SetcPaisSQN;
    {class} //property cProdANP: Jjdom2_Element read _GetcProdANP write _SetcProdANP;
    {class} //property cProdANVISA: Jjdom2_Element read _GetcProdANVISA write _SetcProdANVISA;
    {class} //property cServicoSQN: Jjdom2_Element read _GetcServicoSQN write _SetcServicoSQN;
    {class} //property cUF: Jjdom2_Element read _GetcUF write _SetcUF;
    {class} //property chaveAcesso: Jjdom2_Element read _GetchaveAcesso write _SetchaveAcesso;
    {class} //property ctgNNF: Jjdom2_Element read _GetctgNNF write _SetctgNNF;
    {class} //property ctgSerie: Jjdom2_Element read _GetctgSerie write _SetctgSerie;
    {class} //property dFab: Jjdom2_Element read _GetdFab write _SetdFab;
    {class} //property dVal: Jjdom2_Element read _GetdVal write _SetdVal;
    {class} //property dias: Jjdom2_Element read _Getdias write _Setdias;
    {class} //property email: Jjdom2_Element read _Getemail write _Setemail;
    {class} //property finNfe: Jjdom2_Element read _GetfinNfe write _SetfinNfe;
    {class} //property historicoXML: Jjdom2_Element read _GethistoricoXML write _SethistoricoXML;
    {class} //property homoAL: Jjdom2_Element read _GethomoAL write _SethomoAL;
    {class} //property homoAM: Jjdom2_Element read _GethomoAM write _SethomoAM;
    {class} //property homoAP: Jjdom2_Element read _GethomoAP write _SethomoAP;
    {class} //property homoBA: Jjdom2_Element read _GethomoBA write _SethomoBA;
    {class} //property homoCE: Jjdom2_Element read _GethomoCE write _SethomoCE;
    {class} //property homoDF: Jjdom2_Element read _GethomoDF write _SethomoDF;
    {class} //property homoES: Jjdom2_Element read _GethomoES write _SethomoES;
    {class} //property homoGO: Jjdom2_Element read _GethomoGO write _SethomoGO;
    {class} //property homoMA: Jjdom2_Element read _GethomoMA write _SethomoMA;
    {class} //property homoMG: Jjdom2_Element read _GethomoMG write _SethomoMG;
    {class} //property homoMS: Jjdom2_Element read _GethomoMS write _SethomoMS;
    {class} //property homoMT: Jjdom2_Element read _GethomoMT write _SethomoMT;
    {class} //property homoPA: Jjdom2_Element read _GethomoPA write _SethomoPA;
    {class} //property homoPB: Jjdom2_Element read _GethomoPB write _SethomoPB;
    {class} //property homoPE: Jjdom2_Element read _GethomoPE write _SethomoPE;
    {class} //property homoPI: Jjdom2_Element read _GethomoPI write _SethomoPI;
    {class} //property homoPR: Jjdom2_Element read _GethomoPR write _SethomoPR;
    {class} //property homoRJ: Jjdom2_Element read _GethomoRJ write _SethomoRJ;
    {class} //property homoRN: Jjdom2_Element read _GethomoRN write _SethomoRN;
    {class} //property homoRO: Jjdom2_Element read _GethomoRO write _SethomoRO;
    {class} //property homoRR: Jjdom2_Element read _GethomoRR write _SethomoRR;
    {class} //property homoRS: Jjdom2_Element read _GethomoRS write _SethomoRS;
    {class} //property homoSC: Jjdom2_Element read _GethomoSC write _SethomoSC;
    {class} //property homoSE: Jjdom2_Element read _GethomoSE write _SethomoSE;
    {class} //property homoSP: Jjdom2_Element read _GethomoSP write _SethomoSP;
    {class} //property homoTO: Jjdom2_Element read _GethomoTO write _SethomoTO;
    {class} //property idCadIntTran: Jjdom2_Element read _GetidCadIntTran write _SetidCadIntTran;
    {class} //property idDest: Jjdom2_Element read _GetidDest write _SetidDest;
    {class} //property idToken: Jjdom2_Element read _GetidToken write _SetidToken;
    {class} //property impressora: Jjdom2_Element read _Getimpressora write _Setimpressora;
    {class} //property indEscala: Jjdom2_Element read _GetindEscala write _SetindEscala;
    {class} //property indFinal: Jjdom2_Element read _GetindFinal write _SetindFinal;
    {class} //property indISSSQN: Jjdom2_Element read _GetindISSSQN write _SetindISSSQN;
    {class} //property indIncentivoSQN: Jjdom2_Element read _GetindIncentivoSQN write _SetindIncentivoSQN;
    {class} //property indIntermed: Jjdom2_Element read _GetindIntermed write _SetindIntermed;
    {class} //property indPag: Jjdom2_Element read _GetindPag write _SetindPag;
    {class} //property indPres: Jjdom2_Element read _GetindPres write _SetindPres;
    {class} //property indTot: Jjdom2_Element read _GetindTot write _SetindTot;
    {class} //property infIntermed: Jjdom2_Element read _GetinfIntermed write _SetinfIntermed;
    {class} //property infRespTec: Jjdom2_Element read _GetinfRespTec write _SetinfRespTec;
    {class} //property irtCNPJ: Jjdom2_Element read _GetirtCNPJ write _SetirtCNPJ;
    {class} //property irtCSRT: Jjdom2_Element read _GetirtCSRT write _SetirtCSRT;
    {class} //property irtFone: Jjdom2_Element read _GetirtFone write _SetirtFone;
    {class} //property irtemail: Jjdom2_Element read _Getirtemail write _Setirtemail;
    {class} //property irtidCSRT: Jjdom2_Element read _GetirtidCSRT write _SetirtidCSRT;
    {class} //property irtxContato: Jjdom2_Element read _GetirtxContato write _SetirtxContato;
    {class} //property modBC: Jjdom2_Element read _GetmodBC write _SetmodBC;
    {class} //property modBC10: Jjdom2_Element read _GetmodBC10 write _SetmodBC10;
    {class} //property modBC20: Jjdom2_Element read _GetmodBC20 write _SetmodBC20;
    {class} //property modBC51: Jjdom2_Element read _GetmodBC51 write _SetmodBC51;
    {class} //property modBC70: Jjdom2_Element read _GetmodBC70 write _SetmodBC70;
    {class} //property modBC90: Jjdom2_Element read _GetmodBC90 write _SetmodBC90;
    {class} //property modBCPART: Jjdom2_Element read _GetmodBCPART write _SetmodBCPART;
    {class} //property modBCSN900: Jjdom2_Element read _GetmodBCSN900 write _SetmodBCSN900;
    {class} //property modBCST10: Jjdom2_Element read _GetmodBCST10 write _SetmodBCST10;
    {class} //property modBCST30: Jjdom2_Element read _GetmodBCST30 write _SetmodBCST30;
    {class} //property modBCST70: Jjdom2_Element read _GetmodBCST70 write _SetmodBCST70;
    {class} //property modBCST90: Jjdom2_Element read _GetmodBCST90 write _SetmodBCST90;
    {class} //property modBCSTPART: Jjdom2_Element read _GetmodBCSTPART write _SetmodBCSTPART;
    {class} //property modBCSTSN201: Jjdom2_Element read _GetmodBCSTSN201 write _SetmodBCSTSN201;
    {class} //property modBCSTSN202: Jjdom2_Element read _GetmodBCSTSN202 write _SetmodBCSTSN202;
    {class} //property modBCSTSN900: Jjdom2_Element read _GetmodBCSTSN900 write _SetmodBCSTSN900;
    {class} //property modFrete: Jjdom2_Element read _GetmodFrete write _SetmodFrete;
    {class} //property motDesICMS20: Jjdom2_Element read _GetmotDesICMS20 write _SetmotDesICMS20;
    {class} //property motDesICMS30: Jjdom2_Element read _GetmotDesICMS30 write _SetmotDesICMS30;
    {class} //property motDesICMS40: Jjdom2_Element read _GetmotDesICMS40 write _SetmotDesICMS40;
    {class} //property motDesICMS70: Jjdom2_Element read _GetmotDesICMS70 write _SetmotDesICMS70;
    {class} //property motDesICMS90: Jjdom2_Element read _GetmotDesICMS90 write _SetmotDesICMS90;
    {class} //property nLote: Jjdom2_Element read _GetnLote write _SetnLote;
    {class} //property nNF: Jjdom2_Element read _GetnNF write _SetnNF;
    {class} //property nProcessoSQN: Jjdom2_Element read _GetnProcessoSQN write _SetnProcessoSQN;
    {class} //property natOP: Jjdom2_Element read _GetnatOP write _SetnatOP;
    {class} //property orig: Jjdom2_Element read _Getorig write _Setorig;
    {class} //property orig10: Jjdom2_Element read _Getorig10 write _Setorig10;
    {class} //property orig20: Jjdom2_Element read _Getorig20 write _Setorig20;
    {class} //property orig202: Jjdom2_Element read _Getorig202 write _Setorig202;
    {class} //property orig30: Jjdom2_Element read _Getorig30 write _Setorig30;
    {class} //property orig40: Jjdom2_Element read _Getorig40 write _Setorig40;
    {class} //property orig51: Jjdom2_Element read _Getorig51 write _Setorig51;
    {class} //property orig60: Jjdom2_Element read _Getorig60 write _Setorig60;
    {class} //property orig70: Jjdom2_Element read _Getorig70 write _Setorig70;
    {class} //property orig90: Jjdom2_Element read _Getorig90 write _Setorig90;
    {class} //property origPART: Jjdom2_Element read _GetorigPART write _SetorigPART;
    {class} //property origSN101: Jjdom2_Element read _GetorigSN101 write _SetorigSN101;
    {class} //property origSN102: Jjdom2_Element read _GetorigSN102 write _SetorigSN102;
    {class} //property origSN201: Jjdom2_Element read _GetorigSN201 write _SetorigSN201;
    {class} //property origSN500: Jjdom2_Element read _GetorigSN500 write _SetorigSN500;
    {class} //property origSN900: Jjdom2_Element read _GetorigSN900 write _SetorigSN900;
    {class} //property origST: Jjdom2_Element read _GetorigST write _SetorigST;
    {class} //property pBCOpPART: Jjdom2_Element read _GetpBCOpPART write _SetpBCOpPART;
    {class} //property pCOFINSCOFINSALIQ: Jjdom2_Element read _GetpCOFINSCOFINSALIQ write _SetpCOFINSCOFINSALIQ;
    {class} //property pCOFINSCOFINSOUTR: Jjdom2_Element read _GetpCOFINSCOFINSOUTR write _SetpCOFINSCOFINSOUTR;
    {class} //property pCOFINSCOFINSST: Jjdom2_Element read _GetpCOFINSCOFINSST write _SetpCOFINSCOFINSST;
    {class} //property pCredSNSN101: Jjdom2_Element read _GetpCredSNSN101 write _SetpCredSNSN101;
    {class} //property pCredSNSN201: Jjdom2_Element read _GetpCredSNSN201 write _SetpCredSNSN201;
    {class} //property pCredSNSN900: Jjdom2_Element read _GetpCredSNSN900 write _SetpCredSNSN900;
    {class} //property pDif51: Jjdom2_Element read _GetpDif51 write _SetpDif51;
    {class} //property pFCP: Jjdom2_Element read _GetpFCP write _SetpFCP;
    {class} //property pFCP10: Jjdom2_Element read _GetpFCP10 write _SetpFCP10;
    {class} //property pFCP20: Jjdom2_Element read _GetpFCP20 write _SetpFCP20;
    {class} //property pFCP51: Jjdom2_Element read _GetpFCP51 write _SetpFCP51;
    {class} //property pFCP70: Jjdom2_Element read _GetpFCP70 write _SetpFCP70;
    {class} //property pFCP90: Jjdom2_Element read _GetpFCP90 write _SetpFCP90;
    {class} //property pFCPST10: Jjdom2_Element read _GetpFCPST10 write _SetpFCPST10;
    {class} //property pFCPST30: Jjdom2_Element read _GetpFCPST30 write _SetpFCPST30;
    {class} //property pFCPST70: Jjdom2_Element read _GetpFCPST70 write _SetpFCPST70;
    {class} //property pFCPST90: Jjdom2_Element read _GetpFCPST90 write _SetpFCPST90;
    {class} //property pFCPSTRet60: Jjdom2_Element read _GetpFCPSTRet60 write _SetpFCPSTRet60;
    {class} //property pFCPSTRetSN500: Jjdom2_Element read _GetpFCPSTRetSN500 write _SetpFCPSTRetSN500;
    {class} //property pFCPSTSN201: Jjdom2_Element read _GetpFCPSTSN201 write _SetpFCPSTSN201;
    {class} //property pFCPSTSN202: Jjdom2_Element read _GetpFCPSTSN202 write _SetpFCPSTSN202;
    {class} //property pFCPSTSN900: Jjdom2_Element read _GetpFCPSTSN900 write _SetpFCPSTSN900;
    {class} //property pGLP: Jjdom2_Element read _GetpGLP write _SetpGLP;
    {class} //property pGNi: Jjdom2_Element read _GetpGNi write _SetpGNi;
    {class} //property pGNn: Jjdom2_Element read _GetpGNn write _SetpGNn;
    {class} //property pICMS: Jjdom2_Element read _GetpICMS write _SetpICMS;
    {class} //property pICMS10: Jjdom2_Element read _GetpICMS10 write _SetpICMS10;
    {class} //property pICMS20: Jjdom2_Element read _GetpICMS20 write _SetpICMS20;
    {class} //property pICMS51: Jjdom2_Element read _GetpICMS51 write _SetpICMS51;
    {class} //property pICMS70: Jjdom2_Element read _GetpICMS70 write _SetpICMS70;
    {class} //property pICMS90: Jjdom2_Element read _GetpICMS90 write _SetpICMS90;
    {class} //property pICMSEfet60: Jjdom2_Element read _GetpICMSEfet60 write _SetpICMSEfet60;
    {class} //property pICMSEfetSN500: Jjdom2_Element read _GetpICMSEfetSN500 write _SetpICMSEfetSN500;
    {class} //property pICMSPART: Jjdom2_Element read _GetpICMSPART write _SetpICMSPART;
    {class} //property pICMSSN900: Jjdom2_Element read _GetpICMSSN900 write _SetpICMSSN900;
    {class} //property pICMSST10: Jjdom2_Element read _GetpICMSST10 write _SetpICMSST10;
    {class} //property pICMSST30: Jjdom2_Element read _GetpICMSST30 write _SetpICMSST30;
    {class} //property pICMSST70: Jjdom2_Element read _GetpICMSST70 write _SetpICMSST70;
    {class} //property pICMSST90: Jjdom2_Element read _GetpICMSST90 write _SetpICMSST90;
    {class} //property pICMSSTPART: Jjdom2_Element read _GetpICMSSTPART write _SetpICMSSTPART;
    {class} //property pICMSSTSN201: Jjdom2_Element read _GetpICMSSTSN201 write _SetpICMSSTSN201;
    {class} //property pICMSSTSN202: Jjdom2_Element read _GetpICMSSTSN202 write _SetpICMSSTSN202;
    {class} //property pICMSSTSN900: Jjdom2_Element read _GetpICMSSTSN900 write _SetpICMSSTSN900;
    {class} //property pMVAST10: Jjdom2_Element read _GetpMVAST10 write _SetpMVAST10;
    {class} //property pMVAST30: Jjdom2_Element read _GetpMVAST30 write _SetpMVAST30;
    {class} //property pMVAST70: Jjdom2_Element read _GetpMVAST70 write _SetpMVAST70;
    {class} //property pMVAST90: Jjdom2_Element read _GetpMVAST90 write _SetpMVAST90;
    {class} //property pMVASTPART: Jjdom2_Element read _GetpMVASTPART write _SetpMVASTPART;
    {class} //property pMVASTSN201: Jjdom2_Element read _GetpMVASTSN201 write _SetpMVASTSN201;
    {class} //property pMVASTSN202: Jjdom2_Element read _GetpMVASTSN202 write _SetpMVASTSN202;
    {class} //property pMVASTSN900: Jjdom2_Element read _GetpMVASTSN900 write _SetpMVASTSN900;
    {class} //property pPISALIQ: Jjdom2_Element read _GetpPISALIQ write _SetpPISALIQ;
    {class} //property pPISPISOUTR: Jjdom2_Element read _GetpPISPISOUTR write _SetpPISPISOUTR;
    {class} //property pPISPISST: Jjdom2_Element read _GetpPISPISST write _SetpPISPISST;
    {class} //property pRedBC20: Jjdom2_Element read _GetpRedBC20 write _SetpRedBC20;
    {class} //property pRedBC51: Jjdom2_Element read _GetpRedBC51 write _SetpRedBC51;
    {class} //property pRedBC70: Jjdom2_Element read _GetpRedBC70 write _SetpRedBC70;
    {class} //property pRedBC90: Jjdom2_Element read _GetpRedBC90 write _SetpRedBC90;
    {class} //property pRedBCEfet60: Jjdom2_Element read _GetpRedBCEfet60 write _SetpRedBCEfet60;
    {class} //property pRedBCEfetSN500: Jjdom2_Element read _GetpRedBCEfetSN500 write _SetpRedBCEfetSN500;
    {class} //property pRedBCPART: Jjdom2_Element read _GetpRedBCPART write _SetpRedBCPART;
    {class} //property pRedBCSN900: Jjdom2_Element read _GetpRedBCSN900 write _SetpRedBCSN900;
    {class} //property pRedBCST10: Jjdom2_Element read _GetpRedBCST10 write _SetpRedBCST10;
    {class} //property pRedBCST30: Jjdom2_Element read _GetpRedBCST30 write _SetpRedBCST30;
    {class} //property pRedBCST70: Jjdom2_Element read _GetpRedBCST70 write _SetpRedBCST70;
    {class} //property pRedBCST90: Jjdom2_Element read _GetpRedBCST90 write _SetpRedBCST90;
    {class} //property pRedBCSTPART: Jjdom2_Element read _GetpRedBCSTPART write _SetpRedBCSTPART;
    {class} //property pRedBCSTSN201: Jjdom2_Element read _GetpRedBCSTSN201 write _SetpRedBCSTSN201;
    {class} //property pRedBCSTSN202: Jjdom2_Element read _GetpRedBCSTSN202 write _SetpRedBCSTSN202;
    {class} //property pRedBCSTSN900: Jjdom2_Element read _GetpRedBCSTSN900 write _SetpRedBCSTSN900;
    {class} //property pST60: Jjdom2_Element read _GetpST60 write _SetpST60;
    {class} //property pSTSN500: Jjdom2_Element read _GetpSTSN500 write _SetpSTSN500;
    {class} //property prodAC: Jjdom2_Element read _GetprodAC write _SetprodAC;
    {class} //property prodAL: Jjdom2_Element read _GetprodAL write _SetprodAL;
    {class} //property prodAP: Jjdom2_Element read _GetprodAP write _SetprodAP;
    {class} //property prodBA: Jjdom2_Element read _GetprodBA write _SetprodBA;
    {class} //property prodCE: Jjdom2_Element read _GetprodCE write _SetprodCE;
    {class} //property prodDF: Jjdom2_Element read _GetprodDF write _SetprodDF;
    {class} //property prodES: Jjdom2_Element read _GetprodES write _SetprodES;
    {class} //property prodGO: Jjdom2_Element read _GetprodGO write _SetprodGO;
    {class} //property prodMA: Jjdom2_Element read _GetprodMA write _SetprodMA;
    {class} //property prodMG: Jjdom2_Element read _GetprodMG write _SetprodMG;
    {class} //property prodMS: Jjdom2_Element read _GetprodMS write _SetprodMS;
    {class} //property prodMT: Jjdom2_Element read _GetprodMT write _SetprodMT;
    {class} //property prodPA: Jjdom2_Element read _GetprodPA write _SetprodPA;
    {class} //property prodPB: Jjdom2_Element read _GetprodPB write _SetprodPB;
    {class} //property prodPE: Jjdom2_Element read _GetprodPE write _SetprodPE;
    {class} //property prodPI: Jjdom2_Element read _GetprodPI write _SetprodPI;
    {class} //property prodPR: Jjdom2_Element read _GetprodPR write _SetprodPR;
    {class} //property prodRJ: Jjdom2_Element read _GetprodRJ write _SetprodRJ;
    {class} //property prodRN: Jjdom2_Element read _GetprodRN write _SetprodRN;
    {class} //property prodRO: Jjdom2_Element read _GetprodRO write _SetprodRO;
    {class} //property prodRS: Jjdom2_Element read _GetprodRS write _SetprodRS;
    {class} //property prodSC: Jjdom2_Element read _GetprodSC write _SetprodSC;
    {class} //property prodSE: Jjdom2_Element read _GetprodSE write _SetprodSE;
    {class} //property prodSP: Jjdom2_Element read _GetprodSP write _SetprodSP;
    {class} //property prodTO: Jjdom2_Element read _GetprodTO write _SetprodTO;
    {class} //property protocolo: Jjdom2_Element read _Getprotocolo write _Setprotocolo;
    {class} //property qBCProd: Jjdom2_Element read _GetqBCProd write _SetqBCProd;
    {class} //property qBCProdCOFINSOUTR: Jjdom2_Element read _GetqBCProdCOFINSOUTR write _SetqBCProdCOFINSOUTR;
    {class} //property qBCProdCOFINSQTDE: Jjdom2_Element read _GetqBCProdCOFINSQTDE write _SetqBCProdCOFINSQTDE;
    {class} //property qBCProdCOFINSST: Jjdom2_Element read _GetqBCProdCOFINSST write _SetqBCProdCOFINSST;
    {class} //property qBCProdPISOUTR: Jjdom2_Element read _GetqBCProdPISOUTR write _SetqBCProdPISOUTR;
    {class} //property qBCProdPISST: Jjdom2_Element read _GetqBCProdPISST write _SetqBCProdPISST;
    {class} //property qBCProdQTDE: Jjdom2_Element read _GetqBCProdQTDE write _SetqBCProdQTDE;
    {class} //property qLote: Jjdom2_Element read _GetqLote write _SetqLote;
    {class} //property qTemp: Jjdom2_Element read _GetqTemp write _SetqTemp;
    {class} //property tpEmis: Jjdom2_Element read _GettpEmis write _SettpEmis;
    {class} //property tpImp: Jjdom2_Element read _GettpImp write _SettpImp;
    {class} //property tpNF: Jjdom2_Element read _GettpNF write _SettpNF;
    {class} //property trocoNFCe: Jjdom2_Element read _GettrocoNFCe write _SettrocoNFCe;
    {class} //property vAliqProd: Jjdom2_Element read _GetvAliqProd write _SetvAliqProd;
    {class} //property vAliqProdCOFINSOUTR: Jjdom2_Element read _GetvAliqProdCOFINSOUTR write _SetvAliqProdCOFINSOUTR;
    {class} //property vAliqProdCOFINSST: Jjdom2_Element read _GetvAliqProdCOFINSST write _SetvAliqProdCOFINSST;
    {class} //property vAliqProdCONFISQTDE: Jjdom2_Element read _GetvAliqProdCONFISQTDE write _SetvAliqProdCONFISQTDE;
    {class} //property vAliqProdPISOUTR: Jjdom2_Element read _GetvAliqProdPISOUTR write _SetvAliqProdPISOUTR;
    {class} //property vAliqProdPISST: Jjdom2_Element read _GetvAliqProdPISST write _SetvAliqProdPISST;
    {class} //property vAliqProdQTDE: Jjdom2_Element read _GetvAliqProdQTDE write _SetvAliqProdQTDE;
    {class} //property vAliqSQN: Jjdom2_Element read _GetvAliqSQN write _SetvAliqSQN;
    {class} //property vBC: Jjdom2_Element read _GetvBC write _SetvBC;
    {class} //property vBC10: Jjdom2_Element read _GetvBC10 write _SetvBC10;
    {class} //property vBC20: Jjdom2_Element read _GetvBC20 write _SetvBC20;
    {class} //property vBC51: Jjdom2_Element read _GetvBC51 write _SetvBC51;
    {class} //property vBC70: Jjdom2_Element read _GetvBC70 write _SetvBC70;
    {class} //property vBC90: Jjdom2_Element read _GetvBC90 write _SetvBC90;
    {class} //property vBCALIQ: Jjdom2_Element read _GetvBCALIQ write _SetvBCALIQ;
    {class} //property vBCCOFINOUTR: Jjdom2_Element read _GetvBCCOFINOUTR write _SetvBCCOFINOUTR;
    {class} //property vBCCOFINSALIQ: Jjdom2_Element read _GetvBCCOFINSALIQ write _SetvBCCOFINSALIQ;
    {class} //property vBCCOFINSST: Jjdom2_Element read _GetvBCCOFINSST write _SetvBCCOFINSST;
    {class} //property vBCEfet60: Jjdom2_Element read _GetvBCEfet60 write _SetvBCEfet60;
    {class} //property vBCEfetSN500: Jjdom2_Element read _GetvBCEfetSN500 write _SetvBCEfetSN500;
    {class} //property vBCFCP10: Jjdom2_Element read _GetvBCFCP10 write _SetvBCFCP10;
    {class} //property vBCFCP20: Jjdom2_Element read _GetvBCFCP20 write _SetvBCFCP20;
    {class} //property vBCFCP51: Jjdom2_Element read _GetvBCFCP51 write _SetvBCFCP51;
    {class} //property vBCFCP70: Jjdom2_Element read _GetvBCFCP70 write _SetvBCFCP70;
    {class} //property vBCFCP90: Jjdom2_Element read _GetvBCFCP90 write _SetvBCFCP90;
    {class} //property vBCFCPST10: Jjdom2_Element read _GetvBCFCPST10 write _SetvBCFCPST10;
    {class} //property vBCFCPST30: Jjdom2_Element read _GetvBCFCPST30 write _SetvBCFCPST30;
    {class} //property vBCFCPST70: Jjdom2_Element read _GetvBCFCPST70 write _SetvBCFCPST70;
    {class} //property vBCFCPST90: Jjdom2_Element read _GetvBCFCPST90 write _SetvBCFCPST90;
    {class} //property vBCFCPSTRet60: Jjdom2_Element read _GetvBCFCPSTRet60 write _SetvBCFCPSTRet60;
    {class} //property vBCFCPSTRetSN500: Jjdom2_Element read _GetvBCFCPSTRetSN500 write _SetvBCFCPSTRetSN500;
    {class} //property vBCFCPSTSN201: Jjdom2_Element read _GetvBCFCPSTSN201 write _SetvBCFCPSTSN201;
    {class} //property vBCFCPSTSN202: Jjdom2_Element read _GetvBCFCPSTSN202 write _SetvBCFCPSTSN202;
    {class} //property vBCFCPSTSN900: Jjdom2_Element read _GetvBCFCPSTSN900 write _SetvBCFCPSTSN900;
    {class} //property vBCPART: Jjdom2_Element read _GetvBCPART write _SetvBCPART;
    {class} //property vBCPISOUTR: Jjdom2_Element read _GetvBCPISOUTR write _SetvBCPISOUTR;
    {class} //property vBCPISST: Jjdom2_Element read _GetvBCPISST write _SetvBCPISST;
    {class} //property vBCSN900: Jjdom2_Element read _GetvBCSN900 write _SetvBCSN900;
    {class} //property vBCSQN: Jjdom2_Element read _GetvBCSQN write _SetvBCSQN;
    {class} //property vBCST10: Jjdom2_Element read _GetvBCST10 write _SetvBCST10;
    {class} //property vBCST30: Jjdom2_Element read _GetvBCST30 write _SetvBCST30;
    {class} //property vBCST70: Jjdom2_Element read _GetvBCST70 write _SetvBCST70;
    {class} //property vBCST90: Jjdom2_Element read _GetvBCST90 write _SetvBCST90;
    {class} //property vBCSTDestST: Jjdom2_Element read _GetvBCSTDestST write _SetvBCSTDestST;
    {class} //property vBCSTPART: Jjdom2_Element read _GetvBCSTPART write _SetvBCSTPART;
    {class} //property vBCSTRet60: Jjdom2_Element read _GetvBCSTRet60 write _SetvBCSTRet60;
    {class} //property vBCSTRetSN500: Jjdom2_Element read _GetvBCSTRetSN500 write _SetvBCSTRetSN500;
    {class} //property vBCSTRetST: Jjdom2_Element read _GetvBCSTRetST write _SetvBCSTRetST;
    {class} //property vBCSTSN201: Jjdom2_Element read _GetvBCSTSN201 write _SetvBCSTSN201;
    {class} //property vBCSTSN202: Jjdom2_Element read _GetvBCSTSN202 write _SetvBCSTSN202;
    {class} //property vBCSTSN900: Jjdom2_Element read _GetvBCSTSN900 write _SetvBCSTSN900;
    {class} //property vCIDE: Jjdom2_Element read _GetvCIDE write _SetvCIDE;
    {class} //property vCOFINSCOFINSALIQ: Jjdom2_Element read _GetvCOFINSCOFINSALIQ write _SetvCOFINSCOFINSALIQ;
    {class} //property vCOFINSCOFINSQTDE: Jjdom2_Element read _GetvCOFINSCOFINSQTDE write _SetvCOFINSCOFINSQTDE;
    {class} //property vCOFINSCOFINSST: Jjdom2_Element read _GetvCOFINSCOFINSST write _SetvCOFINSCOFINSST;
    {class} //property vCONFISCONFISOUTR: Jjdom2_Element read _GetvCONFISCONFISOUTR write _SetvCONFISCONFISOUTR;
    {class} //property vCredICMSSNSN101: Jjdom2_Element read _GetvCredICMSSNSN101 write _SetvCredICMSSNSN101;
    {class} //property vCredICMSSNSN201: Jjdom2_Element read _GetvCredICMSSNSN201 write _SetvCredICMSSNSN201;
    {class} //property vCredICMSSNSN900: Jjdom2_Element read _GetvCredICMSSNSN900 write _SetvCredICMSSNSN900;
    {class} //property vDeducaoSQN: Jjdom2_Element read _GetvDeducaoSQN write _SetvDeducaoSQN;
    {class} //property vDescCondSQN: Jjdom2_Element read _GetvDescCondSQN write _SetvDescCondSQN;
    {class} //property vDescIncondSQN: Jjdom2_Element read _GetvDescIncondSQN write _SetvDescIncondSQN;
    {class} //property vFCP: Jjdom2_Element read _GetvFCP write _SetvFCP;
    {class} //property vFCP10: Jjdom2_Element read _GetvFCP10 write _SetvFCP10;
    {class} //property vFCP20: Jjdom2_Element read _GetvFCP20 write _SetvFCP20;
    {class} //property vFCP51: Jjdom2_Element read _GetvFCP51 write _SetvFCP51;
    {class} //property vFCP70: Jjdom2_Element read _GetvFCP70 write _SetvFCP70;
    {class} //property vFCP90: Jjdom2_Element read _GetvFCP90 write _SetvFCP90;
    {class} //property vFCPST10: Jjdom2_Element read _GetvFCPST10 write _SetvFCPST10;
    {class} //property vFCPST30: Jjdom2_Element read _GetvFCPST30 write _SetvFCPST30;
    {class} //property vFCPST90: Jjdom2_Element read _GetvFCPST90 write _SetvFCPST90;
    {class} //property vFCPSTRet60: Jjdom2_Element read _GetvFCPSTRet60 write _SetvFCPSTRet60;
    {class} //property vFCPSTRetSN500: Jjdom2_Element read _GetvFCPSTRetSN500 write _SetvFCPSTRetSN500;
    {class} //property vFCPSTSN201: Jjdom2_Element read _GetvFCPSTSN201 write _SetvFCPSTSN201;
    {class} //property vFCPSTSN202: Jjdom2_Element read _GetvFCPSTSN202 write _SetvFCPSTSN202;
    {class} //property vFCPSTSN900: Jjdom2_Element read _GetvFCPSTSN900 write _SetvFCPSTSN900;
    {class} //property vICMS: Jjdom2_Element read _GetvICMS write _SetvICMS;
    {class} //property vICMS10: Jjdom2_Element read _GetvICMS10 write _SetvICMS10;
    {class} //property vICMS20: Jjdom2_Element read _GetvICMS20 write _SetvICMS20;
    {class} //property vICMS51: Jjdom2_Element read _GetvICMS51 write _SetvICMS51;
    {class} //property vICMS70: Jjdom2_Element read _GetvICMS70 write _SetvICMS70;
    {class} //property vICMS90: Jjdom2_Element read _GetvICMS90 write _SetvICMS90;
    {class} //property vICMSDeson20: Jjdom2_Element read _GetvICMSDeson20 write _SetvICMSDeson20;
    {class} //property vICMSDeson30: Jjdom2_Element read _GetvICMSDeson30 write _SetvICMSDeson30;
    {class} //property vICMSDeson40: Jjdom2_Element read _GetvICMSDeson40 write _SetvICMSDeson40;
    {class} //property vICMSDeson70: Jjdom2_Element read _GetvICMSDeson70 write _SetvICMSDeson70;
    {class} //property vICMSDeson90: Jjdom2_Element read _GetvICMSDeson90 write _SetvICMSDeson90;
    {class} //property vICMSDif: Jjdom2_Element read _GetvICMSDif write _SetvICMSDif;
    {class} //property vICMSEfet60: Jjdom2_Element read _GetvICMSEfet60 write _SetvICMSEfet60;
    {class} //property vICMSEfetSN500: Jjdom2_Element read _GetvICMSEfetSN500 write _SetvICMSEfetSN500;
    {class} //property vICMSOp51: Jjdom2_Element read _GetvICMSOp51 write _SetvICMSOp51;
    {class} //property vICMSPART: Jjdom2_Element read _GetvICMSPART write _SetvICMSPART;
    {class} //property vICMSSN900: Jjdom2_Element read _GetvICMSSN900 write _SetvICMSSN900;
    {class} //property vICMSST10: Jjdom2_Element read _GetvICMSST10 write _SetvICMSST10;
    {class} //property vICMSST30: Jjdom2_Element read _GetvICMSST30 write _SetvICMSST30;
    {class} //property vICMSST70: Jjdom2_Element read _GetvICMSST70 write _SetvICMSST70;
    {class} //property vICMSST90: Jjdom2_Element read _GetvICMSST90 write _SetvICMSST90;
    {class} //property vICMSSTDestST: Jjdom2_Element read _GetvICMSSTDestST write _SetvICMSSTDestST;
    {class} //property vICMSSTPART: Jjdom2_Element read _GetvICMSSTPART write _SetvICMSSTPART;
    {class} //property vICMSSTRet60: Jjdom2_Element read _GetvICMSSTRet60 write _SetvICMSSTRet60;
    {class} //property vICMSSTRetSN500: Jjdom2_Element read _GetvICMSSTRetSN500 write _SetvICMSSTRetSN500;
    {class} //property vICMSSTRetST: Jjdom2_Element read _GetvICMSSTRetST write _SetvICMSSTRetST;
    {class} //property vICMSSTSN201: Jjdom2_Element read _GetvICMSSTSN201 write _SetvICMSSTSN201;
    {class} //property vICMSSTSN202: Jjdom2_Element read _GetvICMSSTSN202 write _SetvICMSSTSN202;
    {class} //property vICMSSTSN900: Jjdom2_Element read _GetvICMSSTSN900 write _SetvICMSSTSN900;
    {class} //property vICMSSubstituto60: Jjdom2_Element read _GetvICMSSubstituto60 write _SetvICMSSubstituto60;
    {class} //property vICMSSubstitutoSN500: Jjdom2_Element read _GetvICMSSubstitutoSN500 write _SetvICMSSubstitutoSN500;
    {class} //property vISSQNSQN: Jjdom2_Element read _GetvISSQNSQN write _SetvISSQNSQN;
    {class} //property vISSRetSQN: Jjdom2_Element read _GetvISSRetSQN write _SetvISSRetSQN;
    {class} //property vOutroSQN: Jjdom2_Element read _GetvOutroSQN write _SetvOutroSQN;
    {class} //property vPISALIQ: Jjdom2_Element read _GetvPISALIQ write _SetvPISALIQ;
    {class} //property vPISPISOUTR: Jjdom2_Element read _GetvPISPISOUTR write _SetvPISPISOUTR;
    {class} //property vPISPISST: Jjdom2_Element read _GetvPISPISST write _SetvPISPISST;
    {class} //property vPISQTDE: Jjdom2_Element read _GetvPISQTDE write _SetvPISQTDE;
    {class} //property vPMC: Jjdom2_Element read _GetvPMC write _SetvPMC;
    {class} //property vPart: Jjdom2_Element read _GetvPart write _SetvPart;
    {class} //property verProc: Jjdom2_Element read _GetverProc write _SetverProc;
    {class} //property versaoNT: Jjdom2_Element read _GetversaoNT write _SetversaoNT;
    {class} //property xBairro: Jjdom2_Element read _GetxBairro write _SetxBairro;
    {class} //property xJust: Jjdom2_Element read _GetxJust write _SetxJust;
    {class} //property xLgr: Jjdom2_Element read _GetxLgr write _SetxLgr;
    {class} //property xMun: Jjdom2_Element read _GetxMun write _SetxMun;
    {class} //property xNome: Jjdom2_Element read _GetxNome write _SetxNome;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ElementosXmlAuxiliar')]
  JElementosXmlAuxiliar = interface(JObject)
    ['{75C52550-F522-44BB-83E6-1746EE425128}']
    //function _GetCONFIGURACAO: Jjdom2_Element; cdecl;
    //procedure _SetCONFIGURACAO(Value: Jjdom2_Element); cdecl;
    //function _GetCancInutilizaAutomatico: Jjdom2_Element; cdecl;
    //procedure _SetCancInutilizaAutomatico(Value: Jjdom2_Element); cdecl;
    //function _GetConta: Jjdom2_Element; cdecl;
    //procedure _SetConta(Value: Jjdom2_Element); cdecl;
    //function _GetEmpCK: Jjdom2_Element; cdecl;
    //procedure _SetEmpCK(Value: Jjdom2_Element); cdecl;
    //function _GetFRAMEWORKGNE: Jjdom2_Element; cdecl;
    //procedure _SetFRAMEWORKGNE(Value: Jjdom2_Element); cdecl;
    //function _GetMS: Jjdom2_Element; cdecl;
    //procedure _SetMS(Value: Jjdom2_Element); cdecl;
    //function _GetTipoAmbiente: Jjdom2_Element; cdecl;
    //procedure _SetTipoAmbiente(Value: Jjdom2_Element); cdecl;
    //function _GetdescANP: Jjdom2_Element; cdecl;
    //procedure _SetdescANP(Value: Jjdom2_Element); cdecl;
    //function _GethomoAC: Jjdom2_Element; cdecl;
    //procedure _SethomoAC(Value: Jjdom2_Element); cdecl;
    //function _GetprodAM: Jjdom2_Element; cdecl;
    //procedure _SetprodAM(Value: Jjdom2_Element); cdecl;
    //function _GetprodRR: Jjdom2_Element; cdecl;
    //procedure _SetprodRR(Value: Jjdom2_Element); cdecl;
    //function _GeturlQRCode: Jjdom2_Element; cdecl;
    //procedure _SeturlQRCode(Value: Jjdom2_Element); cdecl;
    //function _GetvFCPST70: Jjdom2_Element; cdecl;
    //procedure _SetvFCPST70(Value: Jjdom2_Element); cdecl;
    procedure vinculaxml; cdecl;
    //property CONFIGURACAO: Jjdom2_Element read _GetCONFIGURACAO write _SetCONFIGURACAO;
    //property CancInutilizaAutomatico: Jjdom2_Element read _GetCancInutilizaAutomatico write _SetCancInutilizaAutomatico;
    //property Conta: Jjdom2_Element read _GetConta write _SetConta;
    //property EmpCK: Jjdom2_Element read _GetEmpCK write _SetEmpCK;
    //property FRAMEWORKGNE: Jjdom2_Element read _GetFRAMEWORKGNE write _SetFRAMEWORKGNE;
    //property MS: Jjdom2_Element read _GetMS write _SetMS;
    //property TipoAmbiente: Jjdom2_Element read _GetTipoAmbiente write _SetTipoAmbiente;
    //property descANP: Jjdom2_Element read _GetdescANP write _SetdescANP;
    //property homoAC: Jjdom2_Element read _GethomoAC write _SethomoAC;
    //property prodAM: Jjdom2_Element read _GetprodAM write _SetprodAM;
    //property prodRR: Jjdom2_Element read _GetprodRR write _SetprodRR;
    //property urlQRCode: Jjdom2_Element read _GeturlQRCode write _SeturlQRCode;
    //property vFCPST70: Jjdom2_Element read _GetvFCPST70 write _SetvFCPST70;
  end;
  TJElementosXmlAuxiliar = class(TJavaGenericImport<JElementosXmlAuxiliarClass, JElementosXmlAuxiliar>) end;

  JElementosXmlCancelamentoClass = interface(JObjectClass)
    ['{C919ED2D-873A-45BA-B774-6AF4D6EB3525}']
    {class} //function _GetChaAcesso: Jjdom2_Element; cdecl;
    {class} //procedure _SetChaAcesso(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEveDesc: Jjdom2_Element; cdecl;
    {class} //procedure _SetEveDesc(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEveDh: Jjdom2_Element; cdecl;
    {class} //procedure _SetEveDh(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEveFusoHorario: Jjdom2_Element; cdecl;
    {class} //procedure _SetEveFusoHorario(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEveTp: Jjdom2_Element; cdecl;
    {class} //procedure _SetEveTp(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEvedet: Jjdom2_Element; cdecl;
    {class} //procedure _SetEvedet(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEvenProt: Jjdom2_Element; cdecl;
    {class} //procedure _SetEvenProt(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEvento: Jjdom2_Element; cdecl;
    {class} //procedure _SetEvento(Value: Jjdom2_Element); cdecl;
    {class} //function _GetEvexJust: Jjdom2_Element; cdecl;
    {class} //procedure _SetEvexJust(Value: Jjdom2_Element); cdecl;
    {class} //function _GetNtfCnpjEmissor: Jjdom2_Element; cdecl;
    {class} //procedure _SetNtfCnpjEmissor(Value: Jjdom2_Element); cdecl;
    {class} //function _GetNtfSerie: Jjdom2_Element; cdecl;
    {class} //procedure _SetNtfSerie(Value: Jjdom2_Element); cdecl;
    {class} //function _GetVersao: Jjdom2_Element; cdecl;
    {class} //procedure _SetVersao(Value: Jjdom2_Element); cdecl;
    {class} //function _GettpAmb: Jjdom2_Element; cdecl;
    {class} //procedure _SettpAmb(Value: Jjdom2_Element); cdecl;
    {class} function init: JElementosXmlCancelamento; cdecl;//Deprecated
    {class} //property ChaAcesso: Jjdom2_Element read _GetChaAcesso write _SetChaAcesso;
    {class} //property EveDesc: Jjdom2_Element read _GetEveDesc write _SetEveDesc;
    {class} //property EveDh: Jjdom2_Element read _GetEveDh write _SetEveDh;
    {class} //property EveFusoHorario: Jjdom2_Element read _GetEveFusoHorario write _SetEveFusoHorario;
    {class} //property EveTp: Jjdom2_Element read _GetEveTp write _SetEveTp;
    {class} //property Evedet: Jjdom2_Element read _GetEvedet write _SetEvedet;
    {class} //property EvenProt: Jjdom2_Element read _GetEvenProt write _SetEvenProt;
    {class} //property Evento: Jjdom2_Element read _GetEvento write _SetEvento;
    {class} //property EvexJust: Jjdom2_Element read _GetEvexJust write _SetEvexJust;
    {class} //property NtfCnpjEmissor: Jjdom2_Element read _GetNtfCnpjEmissor write _SetNtfCnpjEmissor;
    {class} //property NtfSerie: Jjdom2_Element read _GetNtfSerie write _SetNtfSerie;
    {class} //property Versao: Jjdom2_Element read _GetVersao write _SetVersao;
    {class} //property tpAmb: Jjdom2_Element read _GettpAmb write _SettpAmb;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ElementosXmlCancelamento')]
  JElementosXmlCancelamento = interface(JObject)
    ['{13A3975C-F58B-4AD2-BC66-ED643836BA95}']
    //function _GetEnvioEvento: Jjdom2_Element; cdecl;
    //procedure _SetEnvioEvento(Value: Jjdom2_Element); cdecl;
    //function _GetEveInf: Jjdom2_Element; cdecl;
    //procedure _SetEveInf(Value: Jjdom2_Element); cdecl;
    //function _GetEvenSeq: Jjdom2_Element; cdecl;
    //procedure _SetEvenSeq(Value: Jjdom2_Element); cdecl;
    //function _GetModeloDocumento: Jjdom2_Element; cdecl;
    //procedure _SetModeloDocumento(Value: Jjdom2_Element); cdecl;
    //function _GetNtfNumero: Jjdom2_Element; cdecl;
    //procedure _SetNtfNumero(Value: Jjdom2_Element); cdecl;
    //function retirarElemento(element: Jjdom2_Element): Boolean; cdecl;
    procedure vincularXml(b: Boolean); cdecl;
    //property EnvioEvento: Jjdom2_Element read _GetEnvioEvento write _SetEnvioEvento;
    //property EveInf: Jjdom2_Element read _GetEveInf write _SetEveInf;
    //property EvenSeq: Jjdom2_Element read _GetEvenSeq write _SetEvenSeq;
    //property ModeloDocumento: Jjdom2_Element read _GetModeloDocumento write _SetModeloDocumento;
    //property NtfNumero: Jjdom2_Element read _GetNtfNumero write _SetNtfNumero;
  end;
  TJElementosXmlCancelamento = class(TJavaGenericImport<JElementosXmlCancelamentoClass, JElementosXmlCancelamento>) end;

  JEmailClass = interface(JTagsClass)
    ['{5EF14869-1B71-4EEE-B013-2897134DED86}']
    {class} function init: JEmail; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Email')]
  JEmail = interface(JTags)
    ['{0765FC20-6E4C-413F-B2CD-8B69373DBA13}']
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
    ['{E1CDE51C-046E-49BA-803E-E1ED480E0DFB}']
    {class} function _GetCRT: JString; cdecl;
    {class} procedure _SetCRT(Value: JString); cdecl;
    {class} function _GetIE: JString; cdecl;
    {class} procedure _SetIE(Value: JString); cdecl;
    {class} function _GetxNome: JString; cdecl;
    {class} procedure _SetxNome(Value: JString); cdecl;
    {class} function init: JEmitAuxiliar; cdecl;
    {class} property CRT: JString read _GetCRT write _SetCRT;
    {class} property IE: JString read _GetIE write _SetIE;
    {class} property xNome: JString read _GetxNome write _SetxNome;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/EmitAuxiliar')]
  JEmitAuxiliar = interface(JTags)
    ['{F592DCEE-63FE-4C10-973E-E6B726CD119E}']
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
    ['{A01626D1-A525-44F0-BC3B-F4DDE9442AAA}']
    {class} function _GetCEP: JString; cdecl;
    {class} procedure _SetCEP(Value: JString); cdecl;
    {class} function _GetcMun: JString; cdecl;
    {class} procedure _SetcMun(Value: JString); cdecl;
    {class} function _GetxBairro: JString; cdecl;
    {class} procedure _SetxBairro(Value: JString); cdecl;
    {class} function _GetxMun: JString; cdecl;
    {class} procedure _SetxMun(Value: JString); cdecl;
    {class} function init: JEnderEmitAuxiliar; cdecl;//Deprecated
    {class} property CEP: JString read _GetCEP write _SetCEP;
    {class} property cMun: JString read _GetcMun write _SetcMun;
    {class} property xBairro: JString read _GetxBairro write _SetxBairro;
    {class} property xMun: JString read _GetxMun write _SetxMun;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/EnderEmitAuxiliar')]
  JEnderEmitAuxiliar = interface(JTags)
    ['{B47C5BAC-267E-493D-92E3-024CA5A5E2D1}']
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
    ['{355489C6-1A53-4B1D-9DF2-AC24FB5DB83C}']
    {class} function init: JGO; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/GO')]
  JGO = interface(JTags)
    ['{90D0A988-5195-4E80-B8E3-A2A95320ED9C}']
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
    ['{D73043E7-03F9-4700-A506-FD8A274049A8}']
    {class} function _GetmodBC: JString; cdecl;
    {class} procedure _SetmodBC(Value: JString); cdecl;
    {class} function _GetpFCP: JString; cdecl;
    {class} procedure _SetpFCP(Value: JString); cdecl;
    {class} function _GetpICMS: JString; cdecl;
    {class} procedure _SetpICMS(Value: JString); cdecl;
    {class} function _GetvBC: JString; cdecl;
    {class} procedure _SetvBC(Value: JString); cdecl;
    {class} function _GetvFCP: JString; cdecl;
    {class} procedure _SetvFCP(Value: JString); cdecl;
    {class} function init: JIcms00Auxiliar; cdecl;//Deprecated
    {class} property modBC: JString read _GetmodBC write _SetmodBC;
    {class} property pFCP: JString read _GetpFCP write _SetpFCP;
    {class} property pICMS: JString read _GetpICMS write _SetpICMS;
    {class} property vBC: JString read _GetvBC write _SetvBC;
    {class} property vFCP: JString read _GetvFCP write _SetvFCP;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms00Auxiliar')]
  JIcms00Auxiliar = interface(JTags)
    ['{FF812EAE-55BF-4355-975B-D2E273A3AA69}']
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
    ['{D4A57E5F-9681-4EE7-A351-75783655D44E}']
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
    ['{5FC5E0F2-3333-4333-9F06-9AB63B4B443A}']
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
    ['{7DB9DF5F-2CEA-4D7A-A0BD-78B56752E690}']
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
    ['{969E5EA3-96AA-494D-B9EC-B86BAF33AFDF}']
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
    ['{3BFA4733-3C0D-409C-8B57-0105291AA4D0}']
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
    ['{4A3629EE-D737-41DC-BB2D-F474A8B198E4}']
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
    ['{F6E57203-67E1-416A-A3C8-28A77E330A70}']
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
    ['{31277494-762E-460B-90D1-97F3A77942BD}']
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
    ['{9A6374D2-51F5-4D28-BDF0-076AF8BB9A6D}']
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
    ['{FA0A54BF-D2EF-41DE-963D-FB0DEC3C9E03}']
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
    ['{8781E60C-CD08-45B7-928F-C77C4BB39E35}']
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
    ['{68CF0242-4B7A-48BD-878B-BABD244B8ABB}']
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
    ['{513BEC32-2870-47AD-BA32-1F611BDCE285}']
    {class} function _GetmodBC: JString; cdecl;
    {class} procedure _SetmodBC(Value: JString); cdecl;
    {class} function _GetmodBCST: JString; cdecl;
    {class} procedure _SetmodBCST(Value: JString); cdecl;
    {class} function _GetmotDesICMS: JString; cdecl;
    {class} procedure _SetmotDesICMS(Value: JString); cdecl;
    {class} function _GetpFCP: JString; cdecl;
    {class} procedure _SetpFCP(Value: JString); cdecl;
    {class} function _GetpFCPST: JString; cdecl;
    {class} procedure _SetpFCPST(Value: JString); cdecl;
    {class} function _GetpICMSST: JString; cdecl;
    {class} procedure _SetpICMSST(Value: JString); cdecl;
    {class} function _GetpMVAST: JString; cdecl;
    {class} procedure _SetpMVAST(Value: JString); cdecl;
    {class} function _GetpRedBC: JString; cdecl;
    {class} procedure _SetpRedBC(Value: JString); cdecl;
    {class} function _GetpRedBCST: JString; cdecl;
    {class} procedure _SetpRedBCST(Value: JString); cdecl;
    {class} function _GetvBC: JString; cdecl;
    {class} procedure _SetvBC(Value: JString); cdecl;
    {class} function _GetvBCFCP: JString; cdecl;
    {class} procedure _SetvBCFCP(Value: JString); cdecl;
    {class} function _GetvBCFCPST: JString; cdecl;
    {class} procedure _SetvBCFCPST(Value: JString); cdecl;
    {class} function _GetvFCPST: JString; cdecl;
    {class} procedure _SetvFCPST(Value: JString); cdecl;
    {class} function _GetvICMS: JString; cdecl;
    {class} procedure _SetvICMS(Value: JString); cdecl;
    {class} function _GetvICMSDeson: JString; cdecl;
    {class} procedure _SetvICMSDeson(Value: JString); cdecl;
    {class} function _GetvICMSST: JString; cdecl;
    {class} procedure _SetvICMSST(Value: JString); cdecl;
    {class} function init: JIcms70Auxiliar; cdecl;//Deprecated
    {class} property modBC: JString read _GetmodBC write _SetmodBC;
    {class} property modBCST: JString read _GetmodBCST write _SetmodBCST;
    {class} property motDesICMS: JString read _GetmotDesICMS write _SetmotDesICMS;
    {class} property pFCP: JString read _GetpFCP write _SetpFCP;
    {class} property pFCPST: JString read _GetpFCPST write _SetpFCPST;
    {class} property pICMSST: JString read _GetpICMSST write _SetpICMSST;
    {class} property pMVAST: JString read _GetpMVAST write _SetpMVAST;
    {class} property pRedBC: JString read _GetpRedBC write _SetpRedBC;
    {class} property pRedBCST: JString read _GetpRedBCST write _SetpRedBCST;
    {class} property vBC: JString read _GetvBC write _SetvBC;
    {class} property vBCFCP: JString read _GetvBCFCP write _SetvBCFCP;
    {class} property vBCFCPST: JString read _GetvBCFCPST write _SetvBCFCPST;
    {class} property vFCPST: JString read _GetvFCPST write _SetvFCPST;
    {class} property vICMS: JString read _GetvICMS write _SetvICMS;
    {class} property vICMSDeson: JString read _GetvICMSDeson write _SetvICMSDeson;
    {class} property vICMSST: JString read _GetvICMSST write _SetvICMSST;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms70Auxiliar')]
  JIcms70Auxiliar = interface(JTags)
    ['{712DC9F3-FD6A-4CB1-B657-CED61A2D3DD0}']
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
    ['{9D799E38-2DB7-4A0C-8D3B-792F00E7493D}']
    {class} function init: JIcms90Auxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/Icms90Auxiliar')]
  JIcms90Auxiliar = interface(JTags)
    ['{0F8695B9-4ACF-40DD-99C9-DB9C3E9480AB}']
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
    ['{6F713C0E-D426-4F66-976D-4B9033AB16E2}']
    {class} function init: JIcmsPartAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsPartAuxiliar')]
  JIcmsPartAuxiliar = interface(JTags)
    ['{E32C976A-DF87-4886-BB00-49B75C4BE725}']
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
    ['{8DEDE598-78EF-4DE8-99AD-DE8580490CD2}']
    {class} function init: JIcmsSn101Auxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn101Auxiliar')]
  JIcmsSn101Auxiliar = interface(JTags)
    ['{80D06169-423E-42B0-ABA5-B630D480E382}']
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
    ['{90C620CD-DF47-4CE1-9F74-BFED02060BF4}']
    {class} function init: JIcmsSn102Auxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn102Auxiliar')]
  JIcmsSn102Auxiliar = interface(JTags)
    ['{94AF755D-2516-43EE-8FEC-98F2A1E1522A}']
    function getCSOSN: JString; cdecl;
    function getorig: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCSOSN(string_: JString); cdecl;
    procedure setorig(string_: JString); cdecl;
  end;
  TJIcmsSn102Auxiliar = class(TJavaGenericImport<JIcmsSn102AuxiliarClass, JIcmsSn102Auxiliar>) end;

  JIcmsSn201AuxiliarClass = interface(JTagsClass)
    ['{F64B2CBD-0F3A-4F04-AC67-FFA7BA1C37DB}']
    {class} function init: JIcmsSn201Auxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn201Auxiliar')]
  JIcmsSn201Auxiliar = interface(JTags)
    ['{97AD5700-BEE5-49A7-AA30-49B9ADE6ECEC}']
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
    ['{5E043783-941B-432C-AF01-2D1917DEB25F}']
    {class} function init: JIcmsSn202Auxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn202Auxiliar')]
  JIcmsSn202Auxiliar = interface(JTags)
    ['{27E08818-85F8-424B-A875-9BD2B65B35AF}']
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
    ['{B5F70A73-EB88-4C3D-895B-F4D40D36A54E}']
    {class} function init: JIcmsSn500Auxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn500Auxiliar')]
  JIcmsSn500Auxiliar = interface(JTags)
    ['{8D9A7F8D-44F2-4D75-A299-72D79A2C4919}']
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
    ['{FD75CB97-09D4-4472-BEF1-30772B3F1A65}']
    {class} function _GetpCredSN: JString; cdecl;
    {class} procedure _SetpCredSN(Value: JString); cdecl;
    {class} function _GetpFCPST: JString; cdecl;
    {class} procedure _SetpFCPST(Value: JString); cdecl;
    {class} function _GetpICMSST: JString; cdecl;
    {class} procedure _SetpICMSST(Value: JString); cdecl;
    {class} function _GetvCredICMSSN: JString; cdecl;
    {class} procedure _SetvCredICMSSN(Value: JString); cdecl;
    {class} function _GetvFCPST: JString; cdecl;
    {class} procedure _SetvFCPST(Value: JString); cdecl;
    {class} function _GetvICMSST: JString; cdecl;
    {class} procedure _SetvICMSST(Value: JString); cdecl;
    {class} function init: JIcmsSn900Auxiliar; cdecl;//Deprecated
    {class} property pCredSN: JString read _GetpCredSN write _SetpCredSN;
    {class} property pFCPST: JString read _GetpFCPST write _SetpFCPST;
    {class} property pICMSST: JString read _GetpICMSST write _SetpICMSST;
    {class} property vCredICMSSN: JString read _GetvCredICMSSN write _SetvCredICMSSN;
    {class} property vFCPST: JString read _GetvFCPST write _SetvFCPST;
    {class} property vICMSST: JString read _GetvICMSST write _SetvICMSST;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsSn900Auxiliar')]
  JIcmsSn900Auxiliar = interface(JTags)
    ['{0C6E2F10-D77D-41F8-9639-A73DF22BCE97}']
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
    ['{440F1191-8B58-4C87-938E-5C849B17E73D}']
    {class} function _GetvBCSTDest: JString; cdecl;
    {class} procedure _SetvBCSTDest(Value: JString); cdecl;
    {class} function _GetvBCSTRet: JString; cdecl;
    {class} procedure _SetvBCSTRet(Value: JString); cdecl;
    {class} function _GetvICMSSTRet: JString; cdecl;
    {class} procedure _SetvICMSSTRet(Value: JString); cdecl;
    {class} function init: JIcmsStAuxiliar; cdecl;//Deprecated
    {class} property vBCSTDest: JString read _GetvBCSTDest write _SetvBCSTDest;
    {class} property vBCSTRet: JString read _GetvBCSTRet write _SetvBCSTRet;
    {class} property vICMSSTRet: JString read _GetvICMSSTRet write _SetvICMSSTRet;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IcmsStAuxiliar')]
  JIcmsStAuxiliar = interface(JTags)
    ['{943DD145-B387-40CC-ADE5-E8E9842BE35C}']
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
    ['{50F12276-7B83-4133-A65B-2775FB5CE85D}']
    {class} function init: JInfRespTecAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/InfRespTecAuxiliar')]
  JInfRespTecAuxiliar = interface(JTags)
    ['{BA926845-F0B7-4E94-975C-20D4592B413E}']
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
    ['{20CB7C83-D3C9-4EA1-A1FB-4660F74E9832}']
    {class} function _GetcListServ: JString; cdecl;
    {class} procedure _SetcListServ(Value: JString); cdecl;
    {class} function _GetcMun: JString; cdecl;
    {class} procedure _SetcMun(Value: JString); cdecl;
    {class} function _GetcMunFG: JString; cdecl;
    {class} procedure _SetcMunFG(Value: JString); cdecl;
    {class} function _GetcServico: JString; cdecl;
    {class} procedure _SetcServico(Value: JString); cdecl;
    {class} function _GetindISS: JString; cdecl;
    {class} procedure _SetindISS(Value: JString); cdecl;
    {class} function _GetindIncentivo: JString; cdecl;
    {class} procedure _SetindIncentivo(Value: JString); cdecl;
    {class} function _GetnProcesso: JString; cdecl;
    {class} procedure _SetnProcesso(Value: JString); cdecl;
    {class} function _GetvDescCond: JString; cdecl;
    {class} procedure _SetvDescCond(Value: JString); cdecl;
    {class} function _GetvDescIncond: JString; cdecl;
    {class} procedure _SetvDescIncond(Value: JString); cdecl;
    {class} function _GetvISSQN: JString; cdecl;
    {class} procedure _SetvISSQN(Value: JString); cdecl;
    {class} function _GetvOutro: JString; cdecl;
    {class} procedure _SetvOutro(Value: JString); cdecl;
    {class} function init: JIssQnAuxiliar; cdecl;//Deprecated
    {class} property cListServ: JString read _GetcListServ write _SetcListServ;
    {class} property cMun: JString read _GetcMun write _SetcMun;
    {class} property cMunFG: JString read _GetcMunFG write _SetcMunFG;
    {class} property cServico: JString read _GetcServico write _SetcServico;
    {class} property indISS: JString read _GetindISS write _SetindISS;
    {class} property indIncentivo: JString read _GetindIncentivo write _SetindIncentivo;
    {class} property nProcesso: JString read _GetnProcesso write _SetnProcesso;
    {class} property vDescCond: JString read _GetvDescCond write _SetvDescCond;
    {class} property vDescIncond: JString read _GetvDescIncond write _SetvDescIncond;
    {class} property vISSQN: JString read _GetvISSQN write _SetvISSQN;
    {class} property vOutro: JString read _GetvOutro write _SetvOutro;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/IssQnAuxiliar')]
  JIssQnAuxiliar = interface(JTags)
    ['{73FB2CF9-D5E5-4CB2-A796-AFAB910356D7}']
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
    ['{52C05B8E-F00D-423E-A29F-82CA6C714A0A}']
    {class} function init: JLeiImposto; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/LeiImposto')]
  JLeiImposto = interface(JTags)
    ['{57302E97-39B0-4A02-9DEB-F1806A2FE8FD}']
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
    ['{FC4BFD08-1699-4FC4-AAD3-3AC968FDCB71}']
    {class} function init: JMA; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MA')]
  JMA = interface(JTags)
    ['{630E1246-5389-4BED-845A-7281040FDA00}']
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
    ['{5854BA57-CA00-4C5D-89BC-67FCE5140D22}']
    {class} function init: JMG; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MG')]
  JMG = interface(JTags)
    ['{4E11D0C5-4DFB-42E8-9BDD-40CCB9231398}']
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
    ['{D66A7E23-3966-46D5-A4F8-C47A9C4FA73E}']
    {class} function init: JMS; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MS')]
  JMS = interface(JTags)
    ['{B6EFBF20-6156-47E5-8DB5-43FC6C88DF6B}']
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
    ['{61368331-3A1A-41F3-967E-5826EEC1CC38}']
    {class} function init: JMT; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MT')]
  JMT = interface(JTags)
    ['{78AEEECF-7F29-4908-AE34-15DD37FFA341}']
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
    ['{CFE7AE73-BC07-41E4-869D-108736B421B6}']
    {class} function _GetdFab: JString; cdecl;
    {class} procedure _SetdFab(Value: JString); cdecl;
    {class} function _GetdVal: JString; cdecl;
    {class} procedure _SetdVal(Value: JString); cdecl;
    {class} function _GetqLote: JString; cdecl;
    {class} procedure _SetqLote(Value: JString); cdecl;
    {class} function init: JMedAuxiliar; cdecl;//Deprecated
    {class} property dFab: JString read _GetdFab write _SetdFab;
    {class} property dVal: JString read _GetdVal write _SetdVal;
    {class} property qLote: JString read _GetqLote write _SetqLote;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MedAuxiliar')]
  JMedAuxiliar = interface(JTags)
    ['{B8B3FFFE-F3B8-4894-957D-3CA4F59F6589}']
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
    ['{9F592227-66D8-4BC9-A45F-108293D9021E}']
    {class} function init: JMsgPromocional; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/MsgPromocional')]
  JMsgPromocional = interface(JTags)
    ['{D532FFA3-AD85-4EF7-A0B9-6656EDE3CC24}']
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
    ['{6E4F60A6-D8BA-4DB3-9839-141C2632C465}']
    {class} function init: JNT; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/NT')]
  JNT = interface(JTags)
    ['{484FEE3C-6C54-4AD2-B588-8EF71E766E80}']
    function getVersaoNT: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setVersaoNT(string_: JString); cdecl;
  end;
  TJNT = class(TJavaGenericImport<JNTClass, JNT>) end;

  JPAClass = interface(JTagsClass)
    ['{38D234A2-A8C2-4A6E-90D4-98528AFF1140}']
    {class} function init: JPA; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PA')]
  JPA = interface(JTags)
    ['{450B7D0A-8262-47D3-B767-2477EAD0D55A}']
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
    ['{DE7C20C2-1ECA-4794-A8D8-B50955709122}']
    {class} function init: JPB; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PB')]
  JPB = interface(JTags)
    ['{5798E51E-5FB4-4A94-8B15-86967DE6C37B}']
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
    ['{DC743D78-C581-4509-A02C-60E6DC0711D0}']
    {class} function init: JPE; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PE')]
  JPE = interface(JTags)
    ['{8D55CE0C-4581-4B7C-9796-1B9C8C6F5A92}']
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
    ['{03233034-46FF-4D3B-BB5C-7AC862C66CC5}']
    {class} function init: JPI; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PI')]
  JPI = interface(JTags)
    ['{A2AD36A9-D4DF-4FBA-8676-85A92B1C705C}']
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
    ['{D9BBE3FB-2D9B-4E45-A2B9-241E6BBA1C7C}']
    {class} function init: JPR; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PR')]
  JPR = interface(JTags)
    ['{1931A62F-B2C6-4ED5-A917-5CE77F3EA207}']
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
    ['{A1F6B131-1258-4F15-8609-D1630C4EFF2D}']
    {class} function init: JPisAliqAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisAliqAuxiliar')]
  JPisAliqAuxiliar = interface(JTags)
    ['{0D2937D7-E1B0-4BB1-8988-957879174F69}']
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
    ['{303F57BE-8E54-4505-BCD9-CD2C47748574}']
    {class} function init: JPisNtAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisNtAuxiliar')]
  JPisNtAuxiliar = interface(JTags)
    ['{C3777CE5-F004-4E08-8DEB-684D6B25402D}']
    function getCST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJPisNtAuxiliar = class(TJavaGenericImport<JPisNtAuxiliarClass, JPisNtAuxiliar>) end;

  JPisOutrAuxiliarClass = interface(JTagsClass)
    ['{64D40275-0596-48A8-878B-B9212718DF59}']
    {class} function init: JPisOutrAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisOutrAuxiliar')]
  JPisOutrAuxiliar = interface(JTags)
    ['{DB0922C4-9C4E-4A83-8E10-0DCC5CC3DFBC}']
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
    ['{4FB2B84C-F139-4BB7-8F63-2F6E1AD23FAA}']
    {class} function init: JPisQtdeAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisQtdeAuxiliar')]
  JPisQtdeAuxiliar = interface(JTags)
    ['{489C704B-47F8-4F88-8472-A7D98EF04FB9}']
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
    ['{555D1B40-648D-4C4C-ACBE-FB6723C9D692}']
    {class} function init: JPisSnAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisSnAuxiliar')]
  JPisSnAuxiliar = interface(JTags)
    ['{2B2F2302-1877-408B-8ED9-BA153341407E}']
    function getCST: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJPisSnAuxiliar = class(TJavaGenericImport<JPisSnAuxiliarClass, JPisSnAuxiliar>) end;

  JPisStAuxiliarClass = interface(JTagsClass)
    ['{BB55D7A7-7B28-42A2-BF71-5184E73157B3}']
    {class} function init: JPisStAuxiliar; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/PisStAuxiliar')]
  JPisStAuxiliar = interface(JTags)
    ['{1E8901D5-B2DE-4F78-8543-568B31715CA2}']
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
    ['{D0270359-86B9-42AB-AFA6-8E4D8AFD60BC}']
    {class} function init: JProdAuxiliar; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/ProdAuxiliar')]
  JProdAuxiliar = interface(JTags)
    ['{4AF7A133-A42F-4A2C-AD3D-DE3F3A0C8A44}']
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
    ['{E055978E-0EFF-434D-B736-B4F46C809D9A}']
    {class} function init: JRJ; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/RJ')]
  JRJ = interface(JTags)
    ['{0F15DB8B-0757-4930-AFCE-F871B68B5388}']
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
    ['{D0B29268-8543-4DCC-827F-B0194B81C9FB}']
    {class} function init: JRN; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/RN')]
  JRN = interface(JTags)
    ['{A4B2C14B-8962-4EDB-9CF4-7110D8C78394}']
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
    ['{48865CC9-EF66-4428-A0ED-7F7F70970BEE}']
    {class} function init: JRO; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/RO')]
  JRO = interface(JTags)
    ['{C6D27890-4D20-4EFC-91EF-31F43C583FF7}']
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
    ['{971FE347-EAC6-4A5D-827F-EEAB489A7D20}']
    {class} function init: JRR; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/RR')]
  JRR = interface(JTags)
    ['{CEC4F1BC-972D-4AA4-BFD0-8F9E2C0D5041}']
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
    ['{423395C6-D36B-484E-BBED-9901574EF219}']
    {class} function init: JRS; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/RS')]
  JRS = interface(JTags)
    ['{9366DFC6-2DE4-40BF-BBC0-97A3D1843742}']
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
    ['{1D256AA1-71D2-4A5B-8D93-850AB2C19BF5}']
    {class} function init: JSC; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/SC')]
  JSC = interface(JTags)
    ['{02DB4775-2E45-4C4B-B7E0-19C6CDAA1805}']
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
    ['{1C73DD17-F5C3-44CA-96A5-932293D47849}']
    {class} function init: JSE; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/SE')]
  JSE = interface(JTags)
    ['{A703BDB9-041B-44BD-9CB2-509FFF42AB1E}']
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
    ['{3DB0320E-8061-4DA3-9927-8563E1AA42B4}']
    {class} function init: JSP; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/SP')]
  JSP = interface(JTags)
    ['{B1DDD4CD-5FDD-4BFD-8504-A5598F57BC3D}']
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
    ['{4C60BE01-6E4E-4659-BFD7-5EA8AC0089EC}']
    {class} function init: JTO; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfce/xml/classes/TO')]
  JTO = interface(JTags)
    ['{2FB935FB-445F-44FE-91E2-6DFF9D7EE22A}']
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
    ['{5C082850-13E9-45FA-8710-4507CE0EEC05}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/AberturaNfse')]
  JAberturaNfse = interface(JPersistencia)
    ['{57B6844E-17F4-4048-9734-2A04DC268634}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJAberturaNfse = class(TJavaGenericImport<JAberturaNfseClass, JAberturaNfse>) end;

  JEncerrarNFSeClass = interface(JPersistenciaClass)
    ['{3B382BAA-1B56-4901-A277-5025863D6DC8}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/EncerrarNFSe')]
  JEncerrarNFSe = interface(JPersistencia)
    ['{3DA3823A-7071-45B2-8310-A0D2A4B04CDF}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJEncerrarNFSe = class(TJavaGenericImport<JEncerrarNFSeClass, JEncerrarNFSe>) end;

  Jxml_Op_XmlRetornoClass = interface(Jgne_UtilsClass)
    ['{543DBFA1-81A7-4367-A346-F169E4CE50D5}']
    {class} function _GetretNFse: JHashMap; cdecl;
    {class} function _GetretServicos: JHashMap; cdecl;
    {class} function init: Jxml_Op_XmlRetorno; cdecl;//Deprecated
    {class} property retNFse: JHashMap read _GetretNFse;
    {class} property retServicos: JHashMap read _GetretServicos;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Op_XmlRetorno')]
  Jxml_Op_XmlRetorno = interface(Jgne_Utils)
    ['{C62CC95E-868D-4F70-94D5-4A65C189213F}']
  end;
  TJxml_Op_XmlRetorno = class(TJavaGenericImport<Jxml_Op_XmlRetornoClass, Jxml_Op_XmlRetorno>) end;

  Jnfse_LayoutClass = interface(Jxml_Op_XmlRetornoClass)
    ['{9CBF246A-C757-40A6-A511-F42337D7B134}']
    {class} function init: Jnfse_Layout; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/Layout')]
  Jnfse_Layout = interface(Jxml_Op_XmlRetorno)
    ['{8DF9B489-045B-4B4D-9814-B0163E000B0D}']
    function _Getformat: JFormatacao; cdecl;
    procedure _Setformat(Value: JFormatacao); cdecl;
    procedure inicializaProcesso(string_: JString; string_1: JString; string_2: JString; context: JContext); cdecl;
    property format: JFormatacao read _Getformat write _Setformat;
  end;
  TJnfse_Layout = class(TJavaGenericImport<Jnfse_LayoutClass, Jnfse_Layout>) end;

  JNFSeClass = interface(Jgne_UtilsClass)
    ['{2D119503-7A07-47FA-877B-5A74C1088379}']
    {class} function _GetxmlAuxi: Jxml_Op_XmlAuxiliar; cdecl;
    {class} procedure _SetxmlAuxi(Value: Jxml_Op_XmlAuxiliar); cdecl;
    {class} function init(context: JContext): JNFSe; cdecl;
    {class} property xmlAuxi: Jxml_Op_XmlAuxiliar read _GetxmlAuxi write _SetxmlAuxi;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/NFSe')]
  JNFSe = interface(Jgne_Utils)
    ['{CA3BAFAB-7DAD-4A98-B1BB-E15B1B1D0A4F}']
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
    ['{AE108402-F55F-462D-92B6-8D3A57AA894A}']
    {class} function init: JTiposNFSe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/TiposNFSe')]
  JTiposNFSe = interface(JObject)
    ['{57320D76-21B3-4CA1-85BE-E1B797A54167}']
  end;
  TJTiposNFSe = class(TJavaGenericImport<JTiposNFSeClass, JTiposNFSe>) end;

  JVendeServNFSeClass = interface(JPersistenciaClass)
    ['{A7F26CDE-0320-4B24-AE9B-09B6AEB42004}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/VendeServNFSe')]
  JVendeServNFSe = interface(JPersistencia)
    ['{1D7A2A43-DE26-4EE0-9097-91F48FB71654}']
    function gerarPersistencia(string_: JString; context: JContext): JString; cdecl;
    procedure verificaMaquina(context: JContext); cdecl;
  end;
  TJVendeServNFSe = class(TJavaGenericImport<JVendeServNFSeClass, JVendeServNFSe>) end;

  Jxml_ElementosXmlAuxiliarClass = interface(JObjectClass)
    ['{64FE695E-41A7-495A-90A2-AE362C4A6CDF}']
    {class} //function _GetCnae: Jjdom2_Element; cdecl;
    {class} //function _GetPrestador: Jjdom2_Element; cdecl;
    {class} //function _GetaliqIss: Jjdom2_Element; cdecl;
    {class} //function _GetcMun: Jjdom2_Element; cdecl;
    {class} //function _Getcnpj: Jjdom2_Element; cdecl;
    {class} //function _Getcpf: Jjdom2_Element; cdecl;
    {class} //function _Getemail: Jjdom2_Element; cdecl;
    {class} //function _GetenderPrest: Jjdom2_Element; cdecl;
    {class} //function _GethistoricoXML: Jjdom2_Element; cdecl;
    {class} //function _Getie: Jjdom2_Element; cdecl;
    {class} //function _Getim: Jjdom2_Element; cdecl;
    {class} //function _GetimpressaoCompleta: Jjdom2_Element; cdecl;
    {class} //function _GetiteListServ: Jjdom2_Element; cdecl;
    {class} //function _GetlocalArquivos: Jjdom2_Element; cdecl;
    {class} //function _Getnro: Jjdom2_Element; cdecl;
    {class} //function _Getstatus: Jjdom2_Element; cdecl;
    {class} //function _GettimeoutRet: Jjdom2_Element; cdecl;
    {class} //function _GettpAmb: Jjdom2_Element; cdecl;
    {class} //function _GettpEnd: Jjdom2_Element; cdecl;
    {class} //function _Gettribut: Jjdom2_Element; cdecl;
    {class} //function _GettributMun: Jjdom2_Element; cdecl;
    {class} //function _Getuf: Jjdom2_Element; cdecl;
    {class} //function _GetxBairro: Jjdom2_Element; cdecl;
    {class} //function _GetxFant: Jjdom2_Element; cdecl;
    {class} //function _GetxLgr: Jjdom2_Element; cdecl;
    {class} //function _GetxNome: Jjdom2_Element; cdecl;
    {class} //function _Getxml: Jjdom2_Element; cdecl;
    {class} function init: Jxml_ElementosXmlAuxiliar; cdecl;//Deprecated
    {class} //property Cnae: Jjdom2_Element read _GetCnae;
    {class} //property Prestador: Jjdom2_Element read _GetPrestador;
    {class} //property aliqIss: Jjdom2_Element read _GetaliqIss;
    {class} //property cMun: Jjdom2_Element read _GetcMun;
    {class} //property cnpj: Jjdom2_Element read _Getcnpj;
    {class} //property cpf: Jjdom2_Element read _Getcpf;
    {class} //property email: Jjdom2_Element read _Getemail;
    {class} //property enderPrest: Jjdom2_Element read _GetenderPrest;
    {class} //property historicoXML: Jjdom2_Element read _GethistoricoXML;
    {class} //property ie: Jjdom2_Element read _Getie;
    {class} //property im: Jjdom2_Element read _Getim;
    {class} //property impressaoCompleta: Jjdom2_Element read _GetimpressaoCompleta;
    {class} //property iteListServ: Jjdom2_Element read _GetiteListServ;
    {class} //property localArquivos: Jjdom2_Element read _GetlocalArquivos;
    {class} //property nro: Jjdom2_Element read _Getnro;
    {class} //property status: Jjdom2_Element read _Getstatus;
    {class} //property timeoutRet: Jjdom2_Element read _GettimeoutRet;
    {class} //property tpAmb: Jjdom2_Element read _GettpAmb;
    {class} //property tpEnd: Jjdom2_Element read _GettpEnd;
    {class} //property tribut: Jjdom2_Element read _Gettribut;
    {class} //property tributMun: Jjdom2_Element read _GettributMun;
    {class} //property uf: Jjdom2_Element read _Getuf;
    {class} //property xBairro: Jjdom2_Element read _GetxBairro;
    {class} //property xFant: Jjdom2_Element read _GetxFant;
    {class} //property xLgr: Jjdom2_Element read _GetxLgr;
    {class} //property xNome: Jjdom2_Element read _GetxNome;
    {class} //property xml: Jjdom2_Element read _Getxml;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/ElementosXmlAuxiliar')]
  Jxml_ElementosXmlAuxiliar = interface(JObject)
    ['{E36AE72C-8A7C-490C-8AA2-91170342B1EE}']
    procedure vinculaXml; cdecl;
  end;
  TJxml_ElementosXmlAuxiliar = class(TJavaGenericImport<Jxml_ElementosXmlAuxiliarClass, Jxml_ElementosXmlAuxiliar>) end;

  JElementosXmlConsultaClass = interface(JObjectClass)
    ['{2C20DBAC-6AE9-40CA-B546-1B0A96C099D3}']
    {class} //function _GetchaAcesso: Jjdom2_Element; cdecl;
    {class} //function _GetcnpjEmissor: Jjdom2_Element; cdecl;
    {class} //function _GetdataEmiFinal: Jjdom2_Element; cdecl;
    {class} //function _GetnumFinal: Jjdom2_Element; cdecl;
    {class} //function _Getserie: Jjdom2_Element; cdecl;
    {class} //function _GettpAmb: Jjdom2_Element; cdecl;
    {class} //function _Getversao: Jjdom2_Element; cdecl;
    {class} function init: JElementosXmlConsulta; cdecl;//Deprecated
    {class} //property chaAcesso: Jjdom2_Element read _GetchaAcesso;
    {class} //property cnpjEmissor: Jjdom2_Element read _GetcnpjEmissor;
    {class} //property dataEmiFinal: Jjdom2_Element read _GetdataEmiFinal;
    {class} //property numFinal: Jjdom2_Element read _GetnumFinal;
    {class} //property serie: Jjdom2_Element read _Getserie;
    {class} //property tpAmb: Jjdom2_Element read _GettpAmb;
    {class} //property versao: Jjdom2_Element read _Getversao;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/ElementosXmlConsulta')]
  JElementosXmlConsulta = interface(JObject)
    ['{E3687C35-82A0-4314-84B7-ABD143729880}']
    procedure vinculaXml; cdecl;
  end;
  TJElementosXmlConsulta = class(TJavaGenericImport<JElementosXmlConsultaClass, JElementosXmlConsulta>) end;

  JEnderPrestClass = interface(JTagsClass)
    ['{823DDFDE-B6A7-4997-AB1E-EEF7F0E164C9}']
    {class} function _GetcMun: JString; cdecl;
    {class} function _Getcep: JString; cdecl;
    {class} function _Getemail: JString; cdecl;
    {class} function _Getnro: JString; cdecl;
    {class} function _GetxBairro: JString; cdecl;
    {class} function init: JEnderPrest; cdecl;//Deprecated
    {class} property cMun: JString read _GetcMun;
    {class} property cep: JString read _Getcep;
    {class} property email: JString read _Getemail;
    {class} property nro: JString read _Getnro;
    {class} property xBairro: JString read _GetxBairro;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/EnderPrest')]
  JEnderPrest = interface(JTags)
    ['{30E60A85-0ED6-4C2E-ABEA-966B02353455}']
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
    ['{3AE1F5A8-3E7C-446D-BDFC-258217532E53}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/NfseAuxiliar')]
  JNfseAuxiliar = interface(JTags)
    ['{D542D770-BD62-41DD-A441-95868DAEAA34}']
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
    ['{FA380543-0D30-44AA-B2D4-BBCF8CF6F2F9}']
    {class} function getInstance(i: Integer): JObject; cdecl;
    {class} function init: Jxml_Objetos; cdecl;
    {class} procedure renovarGsDanfe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Objetos')]
  Jxml_Objetos = interface(JObject)
    ['{210FE135-1F2E-4177-A73D-4C423D87B599}']
  end;
  TJxml_Objetos = class(TJavaGenericImport<Jxml_ObjetosClass, Jxml_Objetos>) end;

  Jxml_Op_XmlAuxiliarClass = interface(JObjectClass)
    ['{F1C8C7D1-3647-47E3-ABDF-29F73B93BE5C}']
    {class} function _Geto_ep: JEnderPrest; cdecl;
    {class} function _Geto_p: JPrestador; cdecl;
    {class} function _Getobj_nfse: Jxml_ElementosXmlAuxiliar; cdecl;
    {class} procedure _Setobj_nfse(Value: Jxml_ElementosXmlAuxiliar); cdecl;
    {class} function escolherObj(string_: JString): JTags; cdecl;
    {class} function init: Jxml_Op_XmlAuxiliar; cdecl;//Deprecated
    {class} procedure lerXmlAuxiliar; cdecl;
    {class} procedure registrarInfoXmlAuxiliar(context: JContext); cdecl;
    {class} property o_ep: JEnderPrest read _Geto_ep;
    {class} property o_p: JPrestador read _Geto_p;
    {class} property obj_nfse: Jxml_ElementosXmlAuxiliar read _Getobj_nfse write _Setobj_nfse;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Op_XmlAuxiliar')]
  Jxml_Op_XmlAuxiliar = interface(JObject)
    ['{55BE1250-F012-45C1-B766-547AB0D0FEDA}']
    procedure GerarXmlAuxiliar(context: JContext); cdecl;
    procedure maquinaStatus(string_: JString); cdecl;
  end;
  TJxml_Op_XmlAuxiliar = class(TJavaGenericImport<Jxml_Op_XmlAuxiliarClass, Jxml_Op_XmlAuxiliar>) end;

  Jnfse_xml_Op_XmlConsultaClass = interface(Jxml_Op_XmlAuxiliarClass)
    ['{61D6A67B-A75C-48BB-BC7B-DB659B80C27D}']
    {class} function init: Jnfse_xml_Op_XmlConsulta; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Op_XmlConsulta')]
  Jnfse_xml_Op_XmlConsulta = interface(Jxml_Op_XmlAuxiliar)
    ['{8A05D63A-8989-47BF-96BA-150B1CC1F275}']
    function gerarXmlConsulta(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString): JString; cdecl;
    procedure preencherXmlConsultaNFCe(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString); cdecl;
  end;
  TJnfse_xml_Op_XmlConsulta = class(TJavaGenericImport<Jnfse_xml_Op_XmlConsultaClass, Jnfse_xml_Op_XmlConsulta>) end;

  JPrestadorClass = interface(JTagsClass)
    ['{75D3B5F8-9314-46E9-9D82-CCC9606C8EE0}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Prestador')]
  JPrestador = interface(JTags)
    ['{2E08BA74-1BAE-4B3B-8F3E-9F959A83ADD3}']
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
    ['{ADA99E4A-9B25-4982-821C-44ACBA57C0AB}']
    {class} function _Getdiscriminacao: JString; cdecl;
    {class} //function _Getenvio: Jjdom2_Element; cdecl;
    {class} //function _GetmodeloDocumento: Jjdom2_Element; cdecl;
    {class} function _GettotalIssRetido: Double; cdecl;
    {class} function _GettotaldescCond: Double; cdecl;
    {class} function _GettotaldescInc: Double; cdecl;
    {class} function _GettotalvalBaseCalc: Double; cdecl;
    {class} function _GettotalvalCSLL: Double; cdecl;
    {class} function _GettotalvalCofins: Double; cdecl;
    {class} function _GettotalvalINSS: Double; cdecl;
    {class} function _GettotalvalLiq: Double; cdecl;
    {class} function _GettotalvalPis: Double; cdecl;
    {class} function init: JXml_ElementosEnvioNFSe; cdecl;//Deprecated
    {class} property discriminacao: JString read _Getdiscriminacao;
    {class} //property envio: Jjdom2_Element read _Getenvio;
    {class} //property modeloDocumento: Jjdom2_Element read _GetmodeloDocumento;
    {class} property totalIssRetido: Double read _GettotalIssRetido;
    {class} property totaldescCond: Double read _GettotaldescCond;
    {class} property totaldescInc: Double read _GettotaldescInc;
    {class} property totalvalBaseCalc: Double read _GettotalvalBaseCalc;
    {class} property totalvalCSLL: Double read _GettotalvalCSLL;
    {class} property totalvalCofins: Double read _GettotalvalCofins;
    {class} property totalvalINSS: Double read _GettotalvalINSS;
    {class} property totalvalLiq: Double read _GettotalvalLiq;
    {class} property totalvalPis: Double read _GettotalvalPis;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/nfse/xml/Xml_ElementosEnvioNFSe')]
  JXml_ElementosEnvioNFSe = interface(JObject)
    ['{FAD49079-C572-4EB7-954E-B234D0E80BBF}']
    procedure vinculaAbertura; cdecl;
    procedure vinculaTot(string_: TJavaObjectArray<JString>; string_1: TJavaObjectArray<JString>); cdecl;
    procedure vinculaVenda(string_: TJavaObjectArray<JString>); cdecl;
  end;
  TJXml_ElementosEnvioNFSe = class(TJavaGenericImport<JXml_ElementosEnvioNFSeClass, JXml_ElementosEnvioNFSe>) end;

  JInterface_SatClass = interface(Jgne_UtilsClass)
    ['{F5D2B08B-F3A1-40C2-B382-52A23C962B90}']
    {class} function init: JInterface_Sat; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/Interface_Sat')]
  JInterface_Sat = interface(Jgne_Utils)
    ['{757FBE96-AC19-468A-936E-DA2FBE5B72C2}']
    function ConsultarStatusOperacional: Integer; cdecl;
    function abreComunicacao(context: JContext): Boolean; cdecl;
    function cancelaUltimaVenda(string_: JString): JString; cdecl;
    function enviaDados(string_: JString; i: Integer): JString; cdecl;
    function numeroSessao(context: JContext): Integer; cdecl;
  end;
  TJInterface_Sat = class(TJavaGenericImport<JInterface_SatClass, JInterface_Sat>) end;

  Jsat_DarumaClass = interface(JInterface_SatClass)
    ['{A362C2CD-7ADD-4FF4-846F-BF098E614EBE}']
    {class} function init(context: JContext): Jsat_Daruma; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/Daruma')]
  Jsat_Daruma = interface(JInterface_Sat)
    ['{36C6648A-ED22-4659-B540-830225F78D59}']
    function ConsultarStatusOperacional: Integer; cdecl;
    function abreComunicacao(context: JContext): Boolean; cdecl;
    function cancelaUltimaVenda(string_: JString): JString; cdecl;
    function enviaDados(string_: JString; i: Integer): JString; cdecl;
  end;
  TJsat_Daruma = class(TJavaGenericImport<Jsat_DarumaClass, Jsat_Daruma>) end;

  Jsat_xml_Op_XmlRetornoClass = interface(Jgne_UtilsClass)
    ['{E51EE563-4061-42F0-96DC-9403108037A1}']
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
    ['{D6BD7492-ABDA-4335-BE3C-2BE7E9B86C10}']
    function _GetvTroco: JString; cdecl;
    procedure _SetvTroco(Value: JString); cdecl;
    property vTroco: JString read _GetvTroco write _SetvTroco;
  end;
  TJsat_xml_Op_XmlRetorno = class(TJavaGenericImport<Jsat_xml_Op_XmlRetornoClass, Jsat_xml_Op_XmlRetorno>) end;

  Jsat_LayoutClass = interface(Jsat_xml_Op_XmlRetornoClass)
    ['{98118E15-468C-44D9-A829-B444F5F37FC4}']
    {class} function init: Jsat_Layout; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/Layout')]
  Jsat_Layout = interface(Jsat_xml_Op_XmlRetorno)
    ['{598EE8B4-6F6E-4B60-A949-D9913B054B6C}']
    function _Getformat: JFormatacao; cdecl;
    procedure _Setformat(Value: JFormatacao); cdecl;
    procedure inicializaProcesso(string_: JString; string_1: JString; i: Integer; context: JContext); cdecl;
    procedure xmlCancelamento(stringBuffer: JStringBuffer; context: JContext); cdecl;
    property format: JFormatacao read _Getformat write _Setformat;
  end;
  TJsat_Layout = class(TJavaGenericImport<Jsat_LayoutClass, Jsat_Layout>) end;

  JParseNFCe_2_SATClass = interface(JObjectClass)
    ['{7F30FEFD-B3D7-458A-B22B-2AAE9EA0C208}']
    {class} function init: JParseNFCe_2_SAT; cdecl;
    {class} function parseNFCe2Sat(string_: JString; context: JContext): JString; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/ParseNFCe_2_SAT')]
  JParseNFCe_2_SAT = interface(JObject)
    ['{717BA5F9-4482-4950-8689-2F3F4CEE2CD6}']
  end;
  TJParseNFCe_2_SAT = class(TJavaGenericImport<JParseNFCe_2_SATClass, JParseNFCe_2_SAT>) end;

  JSatClass = interface(Jgne_UtilsClass)
    ['{24216D92-7E1B-4F75-A9DF-0D7EDDF1CE79}']
    {class} function _GetxmlAuxi: Jsat_xml_Op_XmlAuxiliar; cdecl;
    {class} procedure _SetxmlAuxi(Value: Jsat_xml_Op_XmlAuxiliar); cdecl;
    {class} function init(context: JContext): JSat; cdecl;
    {class} property xmlAuxi: Jsat_xml_Op_XmlAuxiliar read _GetxmlAuxi write _SetxmlAuxi;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/Sat')]
  JSat = interface(Jgne_Utils)
    ['{09527A7D-6351-4E00-966E-72958B35A390}']
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
    ['{022D1DF2-95C3-417F-B883-5F9F0D9CA0AD}']
    {class} function init(context: JContext): JSatCr; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/SatCr')]
  JSatCr = interface(JInterface_Sat)
    ['{31674391-0BA9-4647-9334-195D92F460AB}']
    function ConsultarStatusOperacional: Integer; cdecl;
    function abreComunicacao(context: JContext): Boolean; cdecl;
    function cancelaUltimaVenda(string_: JString): JString; cdecl;
    function enviaDados(string_: JString; i: Integer): JString; cdecl;
  end;
  TJSatCr = class(TJavaGenericImport<JSatCrClass, JSatCr>) end;

  // br.com.daruma.framework.mobile.gne.sat.SatCrComunicacao
  JSatCrComunicacao_UsbPermissionClass = interface(JEnumClass)
    ['{C4C48875-DC69-4D41-B8C5-02953ACE9940}']
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
    ['{32EFAF88-4028-42F2-A485-BA7AD2F15C4D}']
  end;
  TJSatCrComunicacao_UsbPermission = class(TJavaGenericImport<JSatCrComunicacao_UsbPermissionClass, JSatCrComunicacao_UsbPermission>) end;

  JUranoClass = interface(JInterface_SatClass)
    ['{2B1D04AD-9125-45C1-BDF2-10D6EEEAFFCD}']
    {class} function init(context: JContext): JUrano; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/Urano')]
  JUrano = interface(JInterface_Sat)
    ['{0C950F32-7894-48EF-899C-58A8A49EEA65}']
    function ConsultarStatusOperacional: Integer; cdecl;
    function abreComunicacao(context: JContext): Boolean; cdecl;
    function cancelaUltimaVenda(string_: JString): JString; cdecl;
    function enviaDados(string_: JString; i: Integer): JString; cdecl;
  end;
  TJUrano = class(TJavaGenericImport<JUranoClass, JUrano>) end;

  JCONFIGURACAOClass = interface(JTagsClass)
    ['{7E240894-CA3E-4270-B30E-50D521444EE4}']
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
    ['{7B20D803-DFB4-478B-90C4-6DD912EDD987}']
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
    ['{CDBC9371-CADC-4E9F-BC40-70B5F9D3C9AB}']
    {class} function _GetpszIM: JString; cdecl;
    {class} function _GetpszIndRatISSQN: JString; cdecl;
    {class} function _GetpszcRegTribISSQN: JString; cdecl;
    {class} property pszIM: JString read _GetpszIM;
    {class} property pszIndRatISSQN: JString read _GetpszIndRatISSQN;
    {class} property pszcRegTribISSQN: JString read _GetpszcRegTribISSQN;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/EMIT')]
  JEMIT = interface(JTags)
    ['{9CC3302A-3771-44F9-9C98-6C8975863FEE}']
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
    ['{EBB898C8-3185-4FF5-AA07-B85D638110F6}']
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
    ['{E43109CA-657F-4AE1-858F-9A95F5533A34}']
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
    ['{FD7CD0BE-AAF6-40E4-9FC1-3AA650E41C23}']
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/ISSQN')]
  JISSQN = interface(JTags)
    ['{A82ADDDD-F229-49D7-9823-D6EDFCA2250B}']
    function getcNatOp: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setcNatOp(string_: JString); cdecl;
  end;
  TJISSQN = class(TJavaGenericImport<JISSQNClass, JISSQN>) end;

  Jsat_xml_ObjetosClass = interface(JObjectClass)
    ['{33C77882-F2E1-422F-847A-2D04BC20719F}']
    {class} function getInstance(i: Integer): JObject; cdecl;
    {class} function init: Jsat_xml_Objetos; cdecl;
    {class} procedure renovarGsDanfe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/Objetos')]
  Jsat_xml_Objetos = interface(JObject)
    ['{E4D3CB76-C1E3-408B-ADB7-C6106263BEA2}']
  end;
  TJsat_xml_Objetos = class(TJavaGenericImport<Jsat_xml_ObjetosClass, Jsat_xml_Objetos>) end;

  Jsat_xml_Op_XmlAuxiliarClass = interface(JObjectClass)
    ['{E338AD20-BAD1-4EC9-98C5-AB3C0F6EDD28}']
    {class} function escolherObj(string_: JString): JTags; cdecl;
    {class} procedure fnGravarValorXML(context: JContext); cdecl;
    {class} function init: Jsat_xml_Op_XmlAuxiliar; cdecl;
    {class} procedure lerXmlAuxiliar(context: JContext); cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/Op_XmlAuxiliar')]
  Jsat_xml_Op_XmlAuxiliar = interface(JObject)
    ['{014523CF-627D-4530-981E-FBFEBD6610CD}']
    procedure GerarXmlAuxiliar(context: JContext); cdecl;
  end;
  TJsat_xml_Op_XmlAuxiliar = class(TJavaGenericImport<Jsat_xml_Op_XmlAuxiliarClass, Jsat_xml_Op_XmlAuxiliar>) end;

  JPRODClass = interface(JTagsClass)
    ['{3F6E2E8F-922A-4887-9DD7-F91AA9C84A1F}']
    {class} function init: JPROD; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/PROD')]
  JPROD = interface(JTags)
    ['{FB0DC004-A279-4FEF-8031-BBE3A41340A3}']
    function getIndRegra: JString; cdecl;
    function getUrlQRCode: JString; cdecl;
    procedure inserirTag(string_: JString; string_1: JString); cdecl;
    function pesquisarTag(string_: JString): TJavaArray<Char>; cdecl;
    procedure setIndRegra(string_: JString); cdecl;
    procedure setUrlQRCode(string_: JString); cdecl;
  end;
  TJPROD = class(TJavaGenericImport<JPRODClass, JPROD>) end;

  JXml_ElementosAuxClass = interface(JObjectClass)
    ['{1D464F70-649E-4CDE-B442-883E5E053DB4}']
    {class} //function _GetCNPJEmit: Jjdom2_Element; cdecl;
    {class} //function _GetCNPJIden: Jjdom2_Element; cdecl;
    {class} //function _GetCPFDest: Jjdom2_Element; cdecl;
    {class} //function _GetConcentrador: Jjdom2_Element; cdecl;
    {class} //function _GetCopiaSeguranca: Jjdom2_Element; cdecl;
    {class} //function _GetDataHoraEmissao: Jjdom2_Element; cdecl;
    {class} //function _GetEMIT: Jjdom2_Element; cdecl;
    {class} //function _GetEnviarXML: Jjdom2_Element; cdecl;
    {class} //function _GetIEEmit: Jjdom2_Element; cdecl;
    {class} //function _GetIMEmit: Jjdom2_Element; cdecl;
    {class} //function _GetIMPOSTO: Jjdom2_Element; cdecl;
    {class} //function _GetISSQN: Jjdom2_Element; cdecl;
    {class} //function _GetImpressora: Jjdom2_Element; cdecl;
    {class} //function _GetPROD: Jjdom2_Element; cdecl;
    {class} //function _GetVersaoDadosEnt: Jjdom2_Element; cdecl;
    {class} //function _GetcNatOp: Jjdom2_Element; cdecl;
    {class} //function _GetcRegTribISSQN: Jjdom2_Element; cdecl;
    {class} //function _GetcodigoDeAtivacao: Jjdom2_Element; cdecl;
    {class} //function _GetindRatISSQN: Jjdom2_Element; cdecl;
    {class} //function _GetindRegra: Jjdom2_Element; cdecl;
    {class} //function _GetmarcaSAT: Jjdom2_Element; cdecl;
    {class} //function _GetnNF: Jjdom2_Element; cdecl;
    {class} //function _GetnSerie: Jjdom2_Element; cdecl;
    {class} //function _GetnumeroCaixa: Jjdom2_Element; cdecl;
    {class} //function _GetnumeroSessao: Jjdom2_Element; cdecl;
    {class} //function _GetsignAC: Jjdom2_Element; cdecl;
    {class} //function _GetvTotalCfe: Jjdom2_Element; cdecl;
    {class} function init: JXml_ElementosAux; cdecl;//Deprecated
    {class} //property CNPJEmit: Jjdom2_Element read _GetCNPJEmit;
    {class} //property CNPJIden: Jjdom2_Element read _GetCNPJIden;
    {class} //property CPFDest: Jjdom2_Element read _GetCPFDest;
    {class} //property Concentrador: Jjdom2_Element read _GetConcentrador;
    {class} //property CopiaSeguranca: Jjdom2_Element read _GetCopiaSeguranca;
    {class} //property DataHoraEmissao: Jjdom2_Element read _GetDataHoraEmissao;
    {class} //property EMIT: Jjdom2_Element read _GetEMIT;
    {class} //property EnviarXML: Jjdom2_Element read _GetEnviarXML;
    {class} //property IEEmit: Jjdom2_Element read _GetIEEmit;
    {class} //property IMEmit: Jjdom2_Element read _GetIMEmit;
    {class} //property IMPOSTO: Jjdom2_Element read _GetIMPOSTO;
    {class} //property ISSQN: Jjdom2_Element read _GetISSQN;
    {class} //property Impressora: Jjdom2_Element read _GetImpressora;
    {class} //property PROD: Jjdom2_Element read _GetPROD;
    {class} //property VersaoDadosEnt: Jjdom2_Element read _GetVersaoDadosEnt;
    {class} //property cNatOp: Jjdom2_Element read _GetcNatOp;
    {class} //property cRegTribISSQN: Jjdom2_Element read _GetcRegTribISSQN;
    {class} //property codigoDeAtivacao: Jjdom2_Element read _GetcodigoDeAtivacao;
    {class} //property indRatISSQN: Jjdom2_Element read _GetindRatISSQN;
    {class} //property indRegra: Jjdom2_Element read _GetindRegra;
    {class} //property marcaSAT: Jjdom2_Element read _GetmarcaSAT;
    {class} //property nNF: Jjdom2_Element read _GetnNF;
    {class} //property nSerie: Jjdom2_Element read _GetnSerie;
    {class} //property numeroCaixa: Jjdom2_Element read _GetnumeroCaixa;
    {class} //property numeroSessao: Jjdom2_Element read _GetnumeroSessao;
    {class} //property signAC: Jjdom2_Element read _GetsignAC;
    {class} //property vTotalCfe: Jjdom2_Element read _GetvTotalCfe;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/gne/sat/xml/Xml_ElementosAux')]
  JXml_ElementosAux = interface(JObject)
    ['{78C02582-0C5D-4560-96EA-711CA58FE84A}']
    procedure fnAdicionarTagsXML; cdecl;
  end;
  TJXml_ElementosAux = class(TJavaGenericImport<JXml_ElementosAuxClass, JXml_ElementosAux>) end;

  JDarumaLoggerClass = interface(JObjectClass)
    ['{E456175E-BD6A-49B6-9328-9418B34C581C}']
    {class} function getReference: JDarumaLogger; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/log/DarumaLogger')]
  JDarumaLogger = interface(JObject)
    ['{D45D43CB-620A-49AD-8F6D-879CA7D6832F}']
    procedure addTraceListener(iTraceListener: JITraceListener); cdecl;
    function getTraceListeners: JList; cdecl;
    procedure log(i: Integer; string_: JString; string_1: JString); cdecl;
    procedure removeAllTraceListeners; cdecl;
    function removeTraceListener(iTraceListener: JITraceListener): Boolean; cdecl;
    procedure setActive(b: Boolean); cdecl;
  end;
  TJDarumaLogger = class(TJavaGenericImport<JDarumaLoggerClass, JDarumaLogger>) end;

  JDarumaLogger_LoggerDispatcherTraceClass = interface(JRunnableClass)
    ['{0D146F45-9F7F-414C-9DB7-031915725490}']
    {class} function _GetlogMessage: JString; cdecl;
    {class} procedure _SetlogMessage(Value: JString); cdecl;
    {class} function init(darumaLogger: JDarumaLogger; i: Integer; string_: JString; string_1: JString): JDarumaLogger_LoggerDispatcherTrace; cdecl;//Deprecated
    {class} property logMessage: JString read _GetlogMessage write _SetlogMessage;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/log/DarumaLogger$LoggerDispatcherTrace')]
  JDarumaLogger_LoggerDispatcherTrace = interface(JRunnable)
    ['{F8B180AE-515E-4ACD-940B-3C8FF01C80AF}']
    procedure run; cdecl;
  end;
  TJDarumaLogger_LoggerDispatcherTrace = class(TJavaGenericImport<JDarumaLogger_LoggerDispatcherTraceClass, JDarumaLogger_LoggerDispatcherTrace>) end;

  JDarumaLoggerConstClass = interface(IJavaClass)
    ['{7CE10263-4610-41A2-B6EB-6560274B678C}']
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
    ['{D93F0093-36FD-4C66-93F4-89C4806DBA6A}']
  end;
  TJDarumaLoggerConst = class(TJavaGenericImport<JDarumaLoggerConstClass, JDarumaLoggerConst>) end;

  JPersistenciaJSONClass = interface(JObjectClass)
    ['{BA84AEB3-98E6-4F98-9959-0BA68AE42249}']
    {class} function carrega(context: JContext): JInfCFe; cdecl;
    {class} procedure excluiPersistencia(context: JContext); cdecl;
    {class} function init: JPersistenciaJSON; cdecl;
    {class} procedure persiste(infCFe: JInfCFe); cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/PersistenciaJSON')]
  JPersistenciaJSON = interface(JObject)
    ['{FEDD70B8-D26F-4834-8763-DFB36C4B2BA5}']
  end;
  TJPersistenciaJSON = class(TJavaGenericImport<JPersistenciaJSONClass, JPersistenciaJSON>) end;

  JPersistenciaXMLClass = interface(JObjectClass)
    ['{4D02E905-2401-40AF-A375-9C3619131631}']
    {class} function carrega(context: JContext): JSAT_Framework_XML; cdecl;
    {class} function init: JPersistenciaXML; cdecl;
    {class} procedure persiste(sAT_Framework_XML: JSAT_Framework_XML); cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/PersistenciaXML')]
  JPersistenciaXML = interface(JObject)
    ['{807DEEBF-6758-41CC-8438-1D0FE62AE4F3}']
  end;
  TJPersistenciaXML = class(TJavaGenericImport<JPersistenciaXMLClass, JPersistenciaXML>) end;

  JSatNativoClass = interface(JObjectClass)
    ['{FBCD7B96-8BB9-48CF-824E-A012C37E68AF}']
    {class} function init(context: JContext): JSatNativo; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/SatNativo')]
  JSatNativo = interface(JObject)
    ['{BA8F9A4B-6215-4104-8D21-C3AD9D7909EE}']
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
    ['{F9A9FC3E-5187-49F3-B5E1-CAF2E5267A73}']
    {class} function init(string_: JString; string_1: JString): JDescAcrEntr; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/DescAcrEntr')]
  JDescAcrEntr = interface(JObject)
    ['{E6AB2589-A20E-410E-90F9-F8638105A334}']
    function getvAcresSubtot: JString; cdecl;
    function getvDescSubtot: JString; cdecl;
    procedure setvAcresSubtot(string_: JString); cdecl;
    procedure setvDescSubtot(string_: JString); cdecl;
  end;
  TJDescAcrEntr = class(TJavaGenericImport<JDescAcrEntrClass, JDescAcrEntr>) end;

  JDestClass = interface(JObjectClass)
    ['{A455B70E-1892-4C98-94FA-9248CAC16FE0}']
    {class} function init(string_: JString; string_1: JString): JDest; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Dest')]
  JDest = interface(JObject)
    ['{11A24E8C-599E-4017-8FF0-68D901609DAE}']
  end;
  TJDest = class(TJavaGenericImport<JDestClass, JDest>) end;

  JDetClass = interface(JObjectClass)
    ['{BA73C8A6-9239-46C1-A10C-A8938BDFABB1}']
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString; i: Integer): JDet; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Det')]
  JDet = interface(JObject)
    ['{EC16B3C7-5413-4D26-B032-A64B768F1525}']
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
    ['{738888FB-D216-4195-94C7-42E5CBBD9A69}']
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString): JelementosCFe_Emit; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Emit')]
  JelementosCFe_Emit = interface(JObject)
    ['{223631B7-8E39-46A7-9071-0C9304F8A174}']
  end;
  TJelementosCFe_Emit = class(TJavaGenericImport<JelementosCFe_EmitClass, JelementosCFe_Emit>) end;

  JEntregaClass = interface(JObjectClass)
    ['{1A8C2264-EB01-42EC-B130-784FDF10C211}']
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString): JEntrega; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Entrega')]
  JEntrega = interface(JObject)
    ['{C7826664-481B-493E-8B78-9178206EDB36}']
  end;
  TJEntrega = class(TJavaGenericImport<JEntregaClass, JEntrega>) end;

  JIdeClass = interface(JObjectClass)
    ['{B6DCEF21-2C1F-4A82-9BBD-400B5665A0D4}']
    {class} function init(string_: JString; string_1: JString; string_2: JString): JIde; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Ide')]
  JIde = interface(JObject)
    ['{D8E9F1EB-F6B7-4F2B-95D4-0E5EB25C4408}']
  end;
  TJIde = class(TJavaGenericImport<JIdeClass, JIde>) end;

  JInfAdicClass = interface(JObjectClass)
    ['{FBFF238D-1B9E-4DF1-9669-41E22667464E}']
    {class} function init(string_: JString): JInfAdic; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/InfAdic')]
  JInfAdic = interface(JObject)
    ['{2044D777-CB1F-47BF-A29F-DAEDEA998A0D}']
  end;
  TJInfAdic = class(TJavaGenericImport<JInfAdicClass, JInfAdic>) end;

  JInfCFeClass = interface(JObjectClass)
    ['{319E95BD-934B-4DEF-9DE6-51EEA9AB3A85}']
    {class} function init: JInfCFe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/InfCFe')]
  JInfCFe = interface(JObject)
    ['{BE7AFD87-F48B-4897-81B0-3EE4ECC7D8F9}']
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
    ['{DF5471D4-F448-4717-8379-0088FF1939D5}']
    {class} function init(string_: JString; string_1: JString; string_2: JString): JMeioDePagamento; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/MeioDePagamento')]
  JMeioDePagamento = interface(JObject)
    ['{2EF241FC-A47D-4C39-953E-CE89210B4FCF}']
    function getcAdmC: JString; cdecl;
    function getcMP: JString; cdecl;
    function getvMP: JString; cdecl;
    procedure setcAdmC(string_: JString); cdecl;
    procedure setcMP(string_: JString); cdecl;
    procedure setvMP(string_: JString); cdecl;
  end;
  TJMeioDePagamento = class(TJavaGenericImport<JMeioDePagamentoClass, JMeioDePagamento>) end;

  JPgtoClass = interface(JObjectClass)
    ['{717E0E08-4B33-4DE1-A70E-554B3B637824}']
    {class} function init: JPgto; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Pgto')]
  JPgto = interface(JObject)
    ['{F6E0D2EE-9191-4E73-BF05-1DE403C771E7}']
    procedure add(meioDePagamento: JMeioDePagamento); cdecl;
    function getPagamentosEfetuados: Integer; cdecl;
    function getTotalPago: JString; cdecl;
    procedure remove(i: Integer); cdecl;
    procedure removeUltimo; cdecl;
    procedure setTotalPago(string_: JString); cdecl;
  end;
  TJPgto = class(TJavaGenericImport<JPgtoClass, JPgto>) end;

  JelementosCFe_ProdClass = interface(JObjectClass)
    ['{14F78953-2755-41DC-8267-CFD1CB099A91}']
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString): JelementosCFe_Prod; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Prod')]
  JelementosCFe_Prod = interface(JObject)
    ['{5A8C2AF7-18E2-4BBA-8F5C-4A50D74B5E06}']
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
    ['{926748E6-25A8-47AE-AA1A-9B786F26BB49}']
    {class} function init(string_: JString; descAcrEntr: JDescAcrEntr): JTotal; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/elementosCFe/Total')]
  JTotal = interface(JObject)
    ['{401DD43E-D715-4ADE-BD82-1DD1F1DCFFC3}']
    function getvCFe: JString; cdecl;
    procedure setvCFe(string_: JString); cdecl;
  end;
  TJTotal = class(TJavaGenericImport<JTotalClass, JTotal>) end;

  JCofinsClass = interface(JObjectClass)
    ['{B152F2E0-A9D7-424E-BFDA-AE2AC187DA97}']
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
    ['{3D898450-D4D3-416E-BCD3-782395484896}']
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
    ['{4E5D422A-AD80-414F-A61F-510F8B452B22}']
    {class} function init: JCofinsaliq; cdecl; overload;
    {class} function init(b: Boolean): JCofinsaliq; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JCofinsaliq; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinsaliq')]
  JCofinsaliq = interface(JObject)
    ['{440BAC2E-5DD3-4057-8DCE-9C7D95F96078}']
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
    ['{CE10993C-76A6-48A9-85A0-2DADC68BA6D0}']
    {class} function init: JCofinsnt; cdecl; overload;
    {class} function init(b: Boolean): JCofinsnt; cdecl; overload;
    {class} function init(string_: JString): JCofinsnt; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinsnt')]
  JCofinsnt = interface(JObject)
    ['{EE549F75-0E6D-482E-9D22-24E518F6267E}']
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJCofinsnt = class(TJavaGenericImport<JCofinsntClass, JCofinsnt>) end;

  JCofinsoutrClass = interface(JObjectClass)
    ['{3E151501-4E25-4B71-A00D-91E9E060004E}']
    {class} function init: JCofinsoutr; cdecl; overload;
    {class} function init(b: Boolean): JCofinsoutr; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JCofinsoutr; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinsoutr')]
  JCofinsoutr = interface(JObject)
    ['{F26A3D71-DAD6-4C9F-82D2-3678079EA51E}']
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
    ['{E7198242-29A0-4BFC-9721-D31A365AF4E6}']
    {class} function init: JCofinsqtde; cdecl; overload;
    {class} function init(b: Boolean): JCofinsqtde; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JCofinsqtde; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinsqtde')]
  JCofinsqtde = interface(JObject)
    ['{34A75425-ED1F-42A4-B156-F52FD41D663E}']
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
    ['{250071EE-F9C4-43DC-AD7F-8E844F126A26}']
    {class} function init: JCofinssn; cdecl; overload;
    {class} function init(string_: JString): JCofinssn; cdecl; overload;
    {class} function init(b: Boolean): JCofinssn; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinssn')]
  JCofinssn = interface(JObject)
    ['{8DAF75FB-D418-4FF5-BD68-4FAE6477D0A5}']
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJCofinssn = class(TJavaGenericImport<JCofinssnClass, JCofinssn>) end;

  JCofinsstClass = interface(JObjectClass)
    ['{ABE16515-0938-49B3-9875-306BFC82FD3A}']
    {class} function init: JCofinsst; cdecl; overload;
    {class} function init(b: Boolean): JCofinsst; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JCofinsst; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Cofinsst')]
  JCofinsst = interface(JObject)
    ['{39CD5E47-786B-470F-A9B2-360B1019D47D}']
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
    ['{B637210E-B2A2-4A49-802D-3CE0F3298F68}']
    {class} function init: JIcms; cdecl; overload;
    {class} function init(icms00: JIcms00): JIcms; cdecl; overload;
    {class} function init(icms40: JIcms40): JIcms; cdecl; overload;
    {class} function init(icmssn102: JIcmssn102): JIcms; cdecl; overload;
    {class} function init(b: Boolean): JIcms; cdecl; overload;
    {class} function init(icmssn900: JIcmssn900): JIcms; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Icms')]
  JIcms = interface(JObject)
    ['{E12F0DFD-5F36-4FC6-993E-323499B07500}']
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
    ['{56B41FBE-E86F-4B1C-A0DB-491B773B9690}']
    {class} function init: JIcms00; cdecl; overload;
    {class} function init(b: Boolean): JIcms00; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JIcms00; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Icms00')]
  JIcms00 = interface(JObject)
    ['{00701BDD-D87E-4418-89A6-E3F321D7A16D}']
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
    ['{D07249B0-7ED6-4ABE-812B-473295D3A34A}']
    {class} function init: JIcms40; cdecl; overload;
    {class} function init(b: Boolean): JIcms40; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JIcms40; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Icms40')]
  JIcms40 = interface(JObject)
    ['{F9F7092A-7B73-4428-8289-2ED3D673A94C}']
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    function getOrig: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
    procedure setOrig(string_: JString); cdecl;
  end;
  TJIcms40 = class(TJavaGenericImport<JIcms40Class, JIcms40>) end;

  JIcmssn102Class = interface(JObjectClass)
    ['{4C1DA653-04FF-40AB-A196-681845C59B10}']
    {class} function init: JIcmssn102; cdecl; overload;
    {class} function init(b: Boolean): JIcmssn102; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JIcmssn102; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Icmssn102')]
  JIcmssn102 = interface(JObject)
    ['{098A00C2-AF93-47CE-8F9D-60DEF3FB0029}']
    procedure completaXml; cdecl;
    function getCSOSN: JString; cdecl;
    function getOrig: JString; cdecl;
    procedure setCSOSN(string_: JString); cdecl;
    procedure setOrig(string_: JString); cdecl;
  end;
  TJIcmssn102 = class(TJavaGenericImport<JIcmssn102Class, JIcmssn102>) end;

  JIcmssn900Class = interface(JObjectClass)
    ['{2356631F-745D-4EEA-8F31-F4A998F90C02}']
    {class} function init: JIcmssn900; cdecl; overload;
    {class} function init(b: Boolean): JIcmssn900; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JIcmssn900; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Icmssn900')]
  JIcmssn900 = interface(JObject)
    ['{DC9F7B50-F96A-486D-ADBA-92D635A35F14}']
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
    ['{649F1744-9058-488B-A9DC-9DBE8F2F9707}']
    {class} function init: Jimpostos_Issqn; cdecl; overload;
    {class} function init(b: Boolean): Jimpostos_Issqn; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString): Jimpostos_Issqn; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Issqn')]
  Jimpostos_Issqn = interface(JObject)
    ['{72A39776-D379-49C4-A074-B5BB2247A809}']
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
    ['{A2FDE1E2-F4D3-411A-8C9C-7BB1AEBEA6E6}']
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
    ['{F0866667-500E-41EB-813B-B2627362A16B}']
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
    ['{3B7F600E-2E92-4058-9C72-716AD2B56A17}']
    {class} function init: JPisaliq; cdecl; overload;
    {class} function init(b: Boolean): JPisaliq; cdecl; overload;
    {class} function init(string_: JString): JPisaliq; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JPisaliq; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pisaliq')]
  JPisaliq = interface(JObject)
    ['{FF041159-73A3-4DA4-A3F5-524A8993EC50}']
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
    ['{8A4BAE09-B6FA-4BD7-861C-4A91F0511259}']
    {class} function init: JPisnt; cdecl; overload;
    {class} function init(b: Boolean): JPisnt; cdecl; overload;
    {class} function init(string_: JString): JPisnt; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pisnt')]
  JPisnt = interface(JObject)
    ['{2A7FE83C-8CC6-4FE0-941F-11D85A92B090}']
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJPisnt = class(TJavaGenericImport<JPisntClass, JPisnt>) end;

  JPisoutrClass = interface(JObjectClass)
    ['{DB8FC9E1-A6C5-4F8E-AE87-937559862464}']
    {class} function init: JPisoutr; cdecl; overload;
    {class} function init(b: Boolean): JPisoutr; cdecl; overload;
    {class} function init(string_: JString; string_1: JString; string_2: JString): JPisoutr; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pisoutr')]
  JPisoutr = interface(JObject)
    ['{EC532BD4-1370-47DC-9709-5DCBF5C549D1}']
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
    ['{E7B58472-F3B5-4B35-B807-C58AFB5EEB81}']
    {class} function init: JPisqtde; cdecl; overload;
    {class} function init(b: Boolean): JPisqtde; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JPisqtde; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pisqtde')]
  JPisqtde = interface(JObject)
    ['{0CBA635C-5A35-4AEC-8231-71C178F6FF7D}']
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
    ['{A8135877-CB52-4862-9D3A-56613112BF73}']
    {class} function init: JPissn; cdecl; overload;
    {class} function init(string_: JString): JPissn; cdecl; overload;
    {class} function init(b: Boolean): JPissn; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pissn')]
  JPissn = interface(JObject)
    ['{10B68949-0888-4452-BB57-0D6CF13F84A2}']
    procedure completaXml; cdecl;
    function getCST: JString; cdecl;
    procedure setCST(string_: JString); cdecl;
  end;
  TJPissn = class(TJavaGenericImport<JPissnClass, JPissn>) end;

  JPisstClass = interface(JObjectClass)
    ['{3E1180B7-4378-4A42-A22D-5FD948EBC208}']
    {class} function init: JPisst; cdecl; overload;
    {class} function init(b: Boolean): JPisst; cdecl; overload;
    {class} function init(string_: JString; string_1: JString): JPisst; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/impostos/Pisst')]
  JPisst = interface(JObject)
    ['{619EEAD9-7749-4943-B4C0-69B0734846CD}']
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
    ['{EBD843BF-1596-41D3-B190-BD107A509B51}']
    {class} function init: JxmlConfiguracao_Configuracao; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/Configuracao')]
  JxmlConfiguracao_Configuracao = interface(JObject)
    ['{9D6FE6FC-1F3F-45E4-88CD-84E20627B8AA}']
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
    ['{EB9EF63E-1C0B-48F9-A33A-6081C536DDB0}']
    {class} function init: JxmlConfiguracao_Emit; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/Emit')]
  JxmlConfiguracao_Emit = interface(JObject)
    ['{35C811D4-B420-40B5-ACAB-31CD7B0CCC49}']
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
    ['{13C099C1-9838-4933-8313-00E5EEF6E002}']
    {class} function init: JIdentificacaoCFe; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/IdentificacaoCFe')]
  JIdentificacaoCFe = interface(JObject)
    ['{B7924AAB-D747-40BD-9D98-1A49D37E13F7}']
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
    ['{D9A17F95-E107-4CBA-98E0-253C9DFAC27B}']
    {class} function init: JImposto; cdecl; overload;
    {class} function init(b: Boolean): JImposto; cdecl; overload;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/Imposto')]
  JImposto = interface(JObject)
    ['{4F77B22E-BAD4-4030-91F1-5F857B08CF9F}']
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
    ['{481E930B-FC77-4EB8-A318-69E16F042621}']
    {class} function init: JxmlConfiguracao_Prod; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/Prod')]
  JxmlConfiguracao_Prod = interface(JObject)
    ['{A028A521-DD0E-4465-9D34-C663B083E8EF}']
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
    ['{378247B0-0F50-45D8-9870-0C07E1D2A728}']
    {class} function init: JSAT_Framework_XML; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/sat/xmlConfiguracao/SAT_Framework_XML')]
  JSAT_Framework_XML = interface(JObject)
    ['{88EA403A-1D02-433A-92A6-EDD76E717DA4}']
    procedure RegAlterarValor_SAT(string_: JString; string_1: JString); cdecl;
    function RegRetornarValor_SAT(string_: JString): JString; cdecl;
    procedure completaXml; cdecl;
  end;
  TJSAT_Framework_XML = class(TJavaGenericImport<JSAT_Framework_XMLClass, JSAT_Framework_XML>) end;

  JComunicacaoWSClass = interface(Jgne_UtilsClass)
    ['{EEA967B4-791E-4CB6-B004-2D9869B5D8EF}']
    {class} function init: JComunicacaoWS; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/ComunicacaoWS')]
  JComunicacaoWS = interface(Jgne_Utils)
    ['{1990F1CE-223F-430A-AF26-EDF6FB682C60}']
    function fnEnviarXmlSat(string_: JString; context: JContext; i: Integer): Integer; cdecl;
  end;
  TJComunicacaoWS = class(TJavaGenericImport<JComunicacaoWSClass, JComunicacaoWS>) end;

  JITServiceWsClass = interface(JObjectClass)
    ['{D38B73E2-C7C1-43A8-93E1-D4874B1FE49E}']
    {class} function getInstancia: JITServiceWs; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/ITServiceWs')]
  JITServiceWs = interface(JObject)
    ['{3E31E996-4D54-4442-9630-75699CEF2DC8}']
    function enviarDadosEmissao(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; context: JContext): Integer; cdecl;
    function enviarDadosEmissaoCtg(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; context: JContext): Integer; cdecl;
    function verificarWs(string_: JString; string_1: JString; string_2: JString; context: JContext): Integer; cdecl;
  end;
  TJITServiceWs = class(TJavaGenericImport<JITServiceWsClass, JITServiceWs>) end;

  JTrustedManagerManipulatorClass = interface(JX509TrustManagerClass)
    ['{A5A178FB-9D87-4A56-B3BE-B607D82E7409}']
    {class} procedure allowAllSSL; cdecl;
    {class} function init: JTrustedManagerManipulator; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/TrustedManagerManipulator')]
  JTrustedManagerManipulator = interface(JX509TrustManager)
    ['{E160E8C9-33C7-44D7-BCBC-ECDD1AF6FDDA}']
    procedure checkClientTrusted(x509Certificate: TJavaObjectArray<JX509Certificate>; string_: JString); cdecl;
    procedure checkServerTrusted(x509Certificate: TJavaObjectArray<JX509Certificate>; string_: JString); cdecl;
    function getAcceptedIssuers: TJavaObjectArray<JX509Certificate>; cdecl;
    function isClientTrusted(x509Certificate: TJavaObjectArray<JX509Certificate>): Boolean; cdecl;
    function isServerTrusted(x509Certificate: TJavaObjectArray<JX509Certificate>): Boolean; cdecl;
  end;
  TJTrustedManagerManipulator = class(TJavaGenericImport<JTrustedManagerManipulatorClass, JTrustedManagerManipulator>) end;

  JTrustedManagerManipulator_1Class = interface(JHostnameVerifierClass)
    ['{CC95C01E-3B17-4F58-A11C-CD3F875D1DDB}']
    {class} function init: JTrustedManagerManipulator_1; cdecl;//Deprecated
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/TrustedManagerManipulator$1')]
  JTrustedManagerManipulator_1 = interface(JHostnameVerifier)
    ['{D8EB776B-6164-4074-89F9-70394C3E9E7B}']
    function verify(string_: JString; sSLSession: JSSLSession): Boolean; cdecl;
  end;
  TJTrustedManagerManipulator_1 = class(TJavaGenericImport<JTrustedManagerManipulator_1Class, JTrustedManagerManipulator_1>) end;

  JDadosConsultaClass = interface(JObjectClass)
    ['{7B16F643-A84B-42D7-9F49-A1B326D6D5D3}']
    {class} function init(string_: JString; string_1: JString; string_2: JString): JDadosConsulta; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/modelo/DadosConsulta')]
  JDadosConsulta = interface(JObject)
    ['{F3EA1D70-BEF8-49CB-AC60-43ED243FAD93}']
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
    ['{50DD7881-F1C9-4269-B8E2-133EB7E22533}']
    {class} function init(string_: JString; string_1: JString; string_2: JString; string_3: JString; string_4: JString; string_5: JString; string_6: JString; string_7: JString; string_8: JString; string_9: JString; string_10: JString; string_11: JString): JInfoEmissao; cdecl;
  end;

  [JavaSignature('br/com/daruma/framework/mobile/webservice/modelo/InfoEmissao')]
  JInfoEmissao = interface(JObject)
    ['{E0FF05B2-F792-4823-9A9D-9EFB99992F25}']
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

  Jdarumamobile_BuildConfigClass = interface(JObjectClass)
    ['{46AA37A9-5082-413A-9C37-101130429738}']
    {class} function _GetBUILD_TYPE: JString; cdecl;
    {class} function _GetDEBUG: Boolean; cdecl;
    {class} function _GetLIBRARY_PACKAGE_NAME: JString; cdecl;
    {class} function init: Jdarumamobile_BuildConfig; cdecl;//Deprecated
    {class} property BUILD_TYPE: JString read _GetBUILD_TYPE;
    {class} property DEBUG: Boolean read _GetDEBUG;
    {class} property LIBRARY_PACKAGE_NAME: JString read _GetLIBRARY_PACKAGE_NAME;
  end;

  [JavaSignature('daruma/com/br/darumamobile/BuildConfig')]
  Jdarumamobile_BuildConfig = interface(JObject)
    ['{13CD2FB2-EF7D-4576-A97A-568307D9A545}']
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

implementation

procedure RegisterTypes;
begin
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAnimator', TypeInfo(Elgin.JNI.Daruma.JAnimator));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAnimator_AnimatorListener', TypeInfo(Elgin.JNI.Daruma.JAnimator_AnimatorListener));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAnimator_AnimatorPauseListener', TypeInfo(Elgin.JNI.Daruma.JAnimator_AnimatorPauseListener));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JKeyframe', TypeInfo(Elgin.JNI.Daruma.JKeyframe));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JLayoutTransition', TypeInfo(Elgin.JNI.Daruma.JLayoutTransition));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JLayoutTransition_TransitionListener', TypeInfo(Elgin.JNI.Daruma.JLayoutTransition_TransitionListener));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPropertyValuesHolder', TypeInfo(Elgin.JNI.Daruma.JPropertyValuesHolder));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JStateListAnimator', TypeInfo(Elgin.JNI.Daruma.JStateListAnimator));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTimeInterpolator', TypeInfo(Elgin.JNI.Daruma.JTimeInterpolator));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTypeConverter', TypeInfo(Elgin.JNI.Daruma.JTypeConverter));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTypeEvaluator', TypeInfo(Elgin.JNI.Daruma.JTypeEvaluator));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JValueAnimator', TypeInfo(Elgin.JNI.Daruma.JValueAnimator));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JValueAnimator_AnimatorUpdateListener', TypeInfo(Elgin.JNI.Daruma.JValueAnimator_AnimatorUpdateListener));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JUsbAccessory', TypeInfo(Elgin.JNI.Daruma.JUsbAccessory));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JUsbConfiguration', TypeInfo(Elgin.JNI.Daruma.JUsbConfiguration));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JUsbDevice', TypeInfo(Elgin.JNI.Daruma.JUsbDevice));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JUsbDeviceConnection', TypeInfo(Elgin.JNI.Daruma.JUsbDeviceConnection));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JUsbEndpoint', TypeInfo(Elgin.JNI.Daruma.JUsbEndpoint));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JUsbInterface', TypeInfo(Elgin.JNI.Daruma.JUsbInterface));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JUsbManager', TypeInfo(Elgin.JNI.Daruma.JUsbManager));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JUsbRequest', TypeInfo(Elgin.JNI.Daruma.JUsbRequest));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPathMotion', TypeInfo(Elgin.JNI.Daruma.JPathMotion));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JScene', TypeInfo(Elgin.JNI.Daruma.JScene));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTransition', TypeInfo(Elgin.JNI.Daruma.JTransition));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTransition_EpicenterCallback', TypeInfo(Elgin.JNI.Daruma.JTransition_EpicenterCallback));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTransition_TransitionListener', TypeInfo(Elgin.JNI.Daruma.JTransition_TransitionListener));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTransitionManager', TypeInfo(Elgin.JNI.Daruma.JTransitionManager));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTransitionPropagation', TypeInfo(Elgin.JNI.Daruma.JTransitionPropagation));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTransitionValues', TypeInfo(Elgin.JNI.Daruma.JTransitionValues));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JInterpolator', TypeInfo(Elgin.JNI.Daruma.JInterpolator));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JToolbar_LayoutParams', TypeInfo(Elgin.JNI.Daruma.JToolbar_LayoutParams));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPrinterManager_PrinterManagerListener', TypeInfo(Elgin.JNI.Daruma.JPrinterManager_PrinterManagerListener));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaMobile', TypeInfo(Elgin.JNI.Daruma.JDarumaMobile));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaMobile_1', TypeInfo(Elgin.JNI.Daruma.JDarumaMobile_1));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaMobile_2', TypeInfo(Elgin.JNI.Daruma.JDarumaMobile_2));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaMobile_3', TypeInfo(Elgin.JNI.Daruma.JDarumaMobile_3));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaMobile_4', TypeInfo(Elgin.JNI.Daruma.JDarumaMobile_4));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JITraceListener', TypeInfo(Elgin.JNI.Daruma.JITraceListener));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaMobile_LogMemoria', TypeInfo(Elgin.JNI.Daruma.JDarumaMobile_LogMemoria));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPrinterManager', TypeInfo(Elgin.JNI.Daruma.JPrinterManager));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JThreadPoolManager', TypeInfo(Elgin.JNI.Daruma.JThreadPoolManager));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JZXingLibConfig', TypeInfo(Elgin.JNI.Daruma.JZXingLibConfig));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaConfigScanner', TypeInfo(Elgin.JNI.Daruma.JDarumaConfigScanner));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaDecoder', TypeInfo(Elgin.JNI.Daruma.JDarumaDecoder));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaScanResult', TypeInfo(Elgin.JNI.Daruma.JDarumaScanResult));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JISendHandler', TypeInfo(Elgin.JNI.Daruma.JISendHandler));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaScanner', TypeInfo(Elgin.JNI.Daruma.JDarumaScanner));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaScannerHandler', TypeInfo(Elgin.JNI.Daruma.JDarumaScannerHandler));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaScannerHandler_State', TypeInfo(Elgin.JNI.Daruma.JDarumaScannerHandler_State));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JBeepManager', TypeInfo(Elgin.JNI.Daruma.JBeepManager));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JBeepManager_1', TypeInfo(Elgin.JNI.Daruma.JBeepManager_1));
//  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDecodeAsyncTask', TypeInfo(Elgin.JNI.Daruma.JDecodeAsyncTask));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDecodeFormatManager', TypeInfo(Elgin.JNI.Daruma.JDecodeFormatManager));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDecodeHandler', TypeInfo(Elgin.JNI.Daruma.JDecodeHandler));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDecodeThread', TypeInfo(Elgin.JNI.Daruma.JDecodeThread));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JFinishListener', TypeInfo(Elgin.JNI.Daruma.JFinishListener));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JInactivityTimer', TypeInfo(Elgin.JNI.Daruma.JInactivityTimer));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JInactivityTimer_1', TypeInfo(Elgin.JNI.Daruma.JInactivityTimer_1));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JInactivityTimer_DaemonThreadFactory', TypeInfo(Elgin.JNI.Daruma.JInactivityTimer_DaemonThreadFactory));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JInactivityTimer_PowerStatusReceiver', TypeInfo(Elgin.JNI.Daruma.JInactivityTimer_PowerStatusReceiver));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIntents', TypeInfo(Elgin.JNI.Daruma.JIntents));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIntents_Scan', TypeInfo(Elgin.JNI.Daruma.JIntents_Scan));
  //TRegTypes.RegisterType('Elgin.JNI.Daruma.JViewfinderResultPointCallback', TypeInfo(Elgin.JNI.Daruma.JViewfinderResultPointCallback));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JViewfinderView', TypeInfo(Elgin.JNI.Daruma.JViewfinderView));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAutoFocusCallback', TypeInfo(Elgin.JNI.Daruma.JAutoFocusCallback));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCameraConfigurationManager', TypeInfo(Elgin.JNI.Daruma.JCameraConfigurationManager));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jcamera_CameraManager', TypeInfo(Elgin.JNI.Daruma.Jcamera_CameraManager));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JFlashlightManager', TypeInfo(Elgin.JNI.Daruma.JFlashlightManager));
  //TRegTypes.RegisterType('Elgin.JNI.Daruma.JPlanarYUVLuminanceSource', TypeInfo(Elgin.JNI.Daruma.JPlanarYUVLuminanceSource));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPreviewCallback', TypeInfo(Elgin.JNI.Daruma.JPreviewCallback));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIVariaveisScaner', TypeInfo(Elgin.JNI.Daruma.JIVariaveisScaner));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAComunicacao', TypeInfo(Elgin.JNI.Daruma.JAComunicacao));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jexception_DarumaException', TypeInfo(Elgin.JNI.Daruma.Jexception_DarumaException));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jexception_DarumaComunicacaoException', TypeInfo(Elgin.JNI.Daruma.Jexception_DarumaComunicacaoException));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaECFException', TypeInfo(Elgin.JNI.Daruma.JDarumaECFException));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JBluetoothDaruma', TypeInfo(Elgin.JNI.Daruma.JBluetoothDaruma));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JBluetoothDaruma_ReadTask', TypeInfo(Elgin.JNI.Daruma.JBluetoothDaruma_ReadTask));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JComunicacaoNaoImpl', TypeInfo(Elgin.JNI.Daruma.JComunicacaoNaoImpl));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JSerialDaruma', TypeInfo(Elgin.JNI.Daruma.JSerialDaruma));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JSocketDaruma', TypeInfo(Elgin.JNI.Daruma.JSocketDaruma));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JUsbDaruma', TypeInfo(Elgin.JNI.Daruma.JUsbDaruma));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConstantesFramework', TypeInfo(Elgin.JNI.Daruma.JConstantesFramework));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConstantesGenerico', TypeInfo(Elgin.JNI.Daruma.JConstantesGenerico));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConstantesSocket', TypeInfo(Elgin.JNI.Daruma.JConstantesSocket));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIConstantesComunicacao', TypeInfo(Elgin.JNI.Daruma.JIConstantesComunicacao));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaCheckedException', TypeInfo(Elgin.JNI.Daruma.JDarumaCheckedException));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaException', TypeInfo(Elgin.JNI.Daruma.JDarumaException));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaComunicacaoException', TypeInfo(Elgin.JNI.Daruma.JDarumaComunicacaoException));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jexception_DarumaECFException', TypeInfo(Elgin.JNI.Daruma.Jexception_DarumaECFException));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaSatException', TypeInfo(Elgin.JNI.Daruma.JDarumaSatException));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaScanException', TypeInfo(Elgin.JNI.Daruma.JDarumaScanException));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaWebServiceException', TypeInfo(Elgin.JNI.Daruma.JDarumaWebServiceException));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jgne_Utils', TypeInfo(Elgin.JNI.Daruma.Jgne_Utils));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JBMP', TypeInfo(Elgin.JNI.Daruma.JBMP));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JOp_XmlConsulta', TypeInfo(Elgin.JNI.Daruma.JOp_XmlConsulta));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPersistencia', TypeInfo(Elgin.JNI.Daruma.JPersistencia));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPersistenciaAuxiliar', TypeInfo(Elgin.JNI.Daruma.JPersistenciaAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JProcessos', TypeInfo(Elgin.JNI.Daruma.JProcessos));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTags', TypeInfo(Elgin.JNI.Daruma.JTags));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JFormatacao', TypeInfo(Elgin.JNI.Daruma.JFormatacao));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDaruma', TypeInfo(Elgin.JNI.Daruma.JDaruma));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDaruma_2100', TypeInfo(Elgin.JNI.Daruma.JDaruma_2100));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDaruma_250', TypeInfo(Elgin.JNI.Daruma.JDaruma_250));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDaruma_350', TypeInfo(Elgin.JNI.Daruma.JDaruma_350));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDascom', TypeInfo(Elgin.JNI.Daruma.JDascom));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDatec_250', TypeInfo(Elgin.JNI.Daruma.JDatec_250));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDatec_350', TypeInfo(Elgin.JNI.Daruma.JDatec_350));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JEPSON', TypeInfo(Elgin.JNI.Daruma.JEPSON));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JFormatacaoAscii', TypeInfo(Elgin.JNI.Daruma.JFormatacaoAscii));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JM10', TypeInfo(Elgin.JNI.Daruma.JM10));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JNonus', TypeInfo(Elgin.JNI.Daruma.JNonus));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAberturaNfce', TypeInfo(Elgin.JNI.Daruma.JAberturaNfce));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAcrescimo', TypeInfo(Elgin.JNI.Daruma.JAcrescimo));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraCofinsAliq', TypeInfo(Elgin.JNI.Daruma.JConfiguraCofinsAliq));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraCofinsNT', TypeInfo(Elgin.JNI.Daruma.JConfiguraCofinsNT));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraCofinsOutr', TypeInfo(Elgin.JNI.Daruma.JConfiguraCofinsOutr));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraCofinsQtde', TypeInfo(Elgin.JNI.Daruma.JConfiguraCofinsQtde));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraCofinsSn', TypeInfo(Elgin.JNI.Daruma.JConfiguraCofinsSn));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraCombustivel', TypeInfo(Elgin.JNI.Daruma.JConfiguraCombustivel));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMS00', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMS00));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMS10', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMS10));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMS20', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMS20));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMS30', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMS30));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMS40', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMS40));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMS51', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMS51));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMS60', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMS60));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMS70', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMS70));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMS90', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMS90));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMSPart', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMSPart));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMSSN101', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMSSN101));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMSSN102', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMSSN102));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMSSN201', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMSSN201));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMSSN202', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMSSN202));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMSSN500', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMSSN500));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMSSN900', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMSSN900));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraICMSST', TypeInfo(Elgin.JNI.Daruma.JConfiguraICMSST));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraLeiImposto', TypeInfo(Elgin.JNI.Daruma.JConfiguraLeiImposto));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraPisAliq', TypeInfo(Elgin.JNI.Daruma.JConfiguraPisAliq));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraPisNT', TypeInfo(Elgin.JNI.Daruma.JConfiguraPisNT));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraPisOutr', TypeInfo(Elgin.JNI.Daruma.JConfiguraPisOutr));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraPisQtde', TypeInfo(Elgin.JNI.Daruma.JConfiguraPisQtde));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguraPisSn', TypeInfo(Elgin.JNI.Daruma.JConfiguraPisSn));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDescontos', TypeInfo(Elgin.JNI.Daruma.JDescontos));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JEncerramento', TypeInfo(Elgin.JNI.Daruma.JEncerramento));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIdentificarConsumidor', TypeInfo(Elgin.JNI.Daruma.JIdentificarConsumidor));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jnfce_Item', TypeInfo(Elgin.JNI.Daruma.Jnfce_Item));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JOp_XmlRetorno', TypeInfo(Elgin.JNI.Daruma.JOp_XmlRetorno));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jnfce_Layout', TypeInfo(Elgin.JNI.Daruma.Jnfce_Layout));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JNFCe', TypeInfo(Elgin.JNI.Daruma.JNFCe));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPagamento', TypeInfo(Elgin.JNI.Daruma.JPagamento));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPagar', TypeInfo(Elgin.JNI.Daruma.JPagar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPagarComCartao', TypeInfo(Elgin.JNI.Daruma.JPagarComCartao));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTiposNFCe', TypeInfo(Elgin.JNI.Daruma.JTiposNFCe));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTotalizacao', TypeInfo(Elgin.JNI.Daruma.JTotalizacao));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTransportadora', TypeInfo(Elgin.JNI.Daruma.JTransportadora));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JVendeItem', TypeInfo(Elgin.JNI.Daruma.JVendeItem));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JVendeItemCompleto', TypeInfo(Elgin.JNI.Daruma.JVendeItemCompleto));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JObjetos', TypeInfo(Elgin.JNI.Daruma.JObjetos));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JOp_XmlAuxiliar', TypeInfo(Elgin.JNI.Daruma.JOp_XmlAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JOp_XmlCanc', TypeInfo(Elgin.JNI.Daruma.JOp_XmlCanc));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jxml_Op_XmlConsulta', TypeInfo(Elgin.JNI.Daruma.Jxml_Op_XmlConsulta));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JOp_XmlContingencia', TypeInfo(Elgin.JNI.Daruma.JOp_XmlContingencia));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JOp_XmlInutilizacao', TypeInfo(Elgin.JNI.Daruma.JOp_XmlInutilizacao));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JXml_ElementosEnvioNFCe', TypeInfo(Elgin.JNI.Daruma.JXml_ElementosEnvioNFCe));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAux_XmlAvisoServ', TypeInfo(Elgin.JNI.Daruma.JAux_XmlAvisoServ));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAux_XmlIde', TypeInfo(Elgin.JNI.Daruma.JAux_XmlIde));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAux_XmlInfIntermed', TypeInfo(Elgin.JNI.Daruma.JAux_XmlInfIntermed));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAux_XmlNfce', TypeInfo(Elgin.JNI.Daruma.JAux_XmlNfce));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAux_XmlTransp', TypeInfo(Elgin.JNI.Daruma.JAux_XmlTransp));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAC', TypeInfo(Elgin.JNI.Daruma.JAC));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAL', TypeInfo(Elgin.JNI.Daruma.JAL));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAM', TypeInfo(Elgin.JNI.Daruma.JAM));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAP', TypeInfo(Elgin.JNI.Daruma.JAP));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JBA', TypeInfo(Elgin.JNI.Daruma.JBA));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCE', TypeInfo(Elgin.JNI.Daruma.JCE));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCideAuxiliar', TypeInfo(Elgin.JNI.Daruma.JCideAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinsAliqAuxiliar', TypeInfo(Elgin.JNI.Daruma.JCofinsAliqAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinsNtAuxiliar', TypeInfo(Elgin.JNI.Daruma.JCofinsNtAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinsOutrAuxiliar', TypeInfo(Elgin.JNI.Daruma.JCofinsOutrAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinsQtdeAuxiliar', TypeInfo(Elgin.JNI.Daruma.JCofinsQtdeAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinsSnAuxiliar', TypeInfo(Elgin.JNI.Daruma.JCofinsSnAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinsStAuxiliar', TypeInfo(Elgin.JNI.Daruma.JCofinsStAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCombAuxiliar', TypeInfo(Elgin.JNI.Daruma.JCombAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JConfiguracaoAuxiliar', TypeInfo(Elgin.JNI.Daruma.JConfiguracaoAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDF', TypeInfo(Elgin.JNI.Daruma.JDF));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JES', TypeInfo(Elgin.JNI.Daruma.JES));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JElementosXMLContingencia', TypeInfo(Elgin.JNI.Daruma.JElementosXMLContingencia));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JElementosXMlInutilizacao', TypeInfo(Elgin.JNI.Daruma.JElementosXMlInutilizacao));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JElementosXmlAuxiliar', TypeInfo(Elgin.JNI.Daruma.JElementosXmlAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JElementosXmlCancelamento', TypeInfo(Elgin.JNI.Daruma.JElementosXmlCancelamento));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JEmail', TypeInfo(Elgin.JNI.Daruma.JEmail));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JEmitAuxiliar', TypeInfo(Elgin.JNI.Daruma.JEmitAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JEnderEmitAuxiliar', TypeInfo(Elgin.JNI.Daruma.JEnderEmitAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JGO', TypeInfo(Elgin.JNI.Daruma.JGO));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms00Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcms00Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms10Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcms10Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms20Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcms20Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms30Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcms30Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms40Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcms40Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms51Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcms51Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms60Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcms60Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms70Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcms70Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms90Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcms90Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcmsPartAuxiliar', TypeInfo(Elgin.JNI.Daruma.JIcmsPartAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcmsSn101Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcmsSn101Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcmsSn102Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcmsSn102Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcmsSn201Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcmsSn201Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcmsSn202Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcmsSn202Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcmsSn500Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcmsSn500Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcmsSn900Auxiliar', TypeInfo(Elgin.JNI.Daruma.JIcmsSn900Auxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcmsStAuxiliar', TypeInfo(Elgin.JNI.Daruma.JIcmsStAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JInfRespTecAuxiliar', TypeInfo(Elgin.JNI.Daruma.JInfRespTecAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIssQnAuxiliar', TypeInfo(Elgin.JNI.Daruma.JIssQnAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JLeiImposto', TypeInfo(Elgin.JNI.Daruma.JLeiImposto));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JMA', TypeInfo(Elgin.JNI.Daruma.JMA));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JMG', TypeInfo(Elgin.JNI.Daruma.JMG));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JMS', TypeInfo(Elgin.JNI.Daruma.JMS));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JMT', TypeInfo(Elgin.JNI.Daruma.JMT));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JMedAuxiliar', TypeInfo(Elgin.JNI.Daruma.JMedAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JMsgPromocional', TypeInfo(Elgin.JNI.Daruma.JMsgPromocional));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JNT', TypeInfo(Elgin.JNI.Daruma.JNT));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPA', TypeInfo(Elgin.JNI.Daruma.JPA));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPB', TypeInfo(Elgin.JNI.Daruma.JPB));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPE', TypeInfo(Elgin.JNI.Daruma.JPE));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPI', TypeInfo(Elgin.JNI.Daruma.JPI));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPR', TypeInfo(Elgin.JNI.Daruma.JPR));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPisAliqAuxiliar', TypeInfo(Elgin.JNI.Daruma.JPisAliqAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPisNtAuxiliar', TypeInfo(Elgin.JNI.Daruma.JPisNtAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPisOutrAuxiliar', TypeInfo(Elgin.JNI.Daruma.JPisOutrAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPisQtdeAuxiliar', TypeInfo(Elgin.JNI.Daruma.JPisQtdeAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPisSnAuxiliar', TypeInfo(Elgin.JNI.Daruma.JPisSnAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPisStAuxiliar', TypeInfo(Elgin.JNI.Daruma.JPisStAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JProdAuxiliar', TypeInfo(Elgin.JNI.Daruma.JProdAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JRJ', TypeInfo(Elgin.JNI.Daruma.JRJ));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JRN', TypeInfo(Elgin.JNI.Daruma.JRN));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JRO', TypeInfo(Elgin.JNI.Daruma.JRO));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JRR', TypeInfo(Elgin.JNI.Daruma.JRR));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JRS', TypeInfo(Elgin.JNI.Daruma.JRS));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JSC', TypeInfo(Elgin.JNI.Daruma.JSC));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JSE', TypeInfo(Elgin.JNI.Daruma.JSE));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JSP', TypeInfo(Elgin.JNI.Daruma.JSP));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTO', TypeInfo(Elgin.JNI.Daruma.JTO));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JAberturaNfse', TypeInfo(Elgin.JNI.Daruma.JAberturaNfse));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JEncerrarNFSe', TypeInfo(Elgin.JNI.Daruma.JEncerrarNFSe));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jxml_Op_XmlRetorno', TypeInfo(Elgin.JNI.Daruma.Jxml_Op_XmlRetorno));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jnfse_Layout', TypeInfo(Elgin.JNI.Daruma.Jnfse_Layout));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JNFSe', TypeInfo(Elgin.JNI.Daruma.JNFSe));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTiposNFSe', TypeInfo(Elgin.JNI.Daruma.JTiposNFSe));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JVendeServNFSe', TypeInfo(Elgin.JNI.Daruma.JVendeServNFSe));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jxml_ElementosXmlAuxiliar', TypeInfo(Elgin.JNI.Daruma.Jxml_ElementosXmlAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JElementosXmlConsulta', TypeInfo(Elgin.JNI.Daruma.JElementosXmlConsulta));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JEnderPrest', TypeInfo(Elgin.JNI.Daruma.JEnderPrest));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JNfseAuxiliar', TypeInfo(Elgin.JNI.Daruma.JNfseAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jxml_Objetos', TypeInfo(Elgin.JNI.Daruma.Jxml_Objetos));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jxml_Op_XmlAuxiliar', TypeInfo(Elgin.JNI.Daruma.Jxml_Op_XmlAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jnfse_xml_Op_XmlConsulta', TypeInfo(Elgin.JNI.Daruma.Jnfse_xml_Op_XmlConsulta));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPrestador', TypeInfo(Elgin.JNI.Daruma.JPrestador));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JXml_ElementosEnvioNFSe', TypeInfo(Elgin.JNI.Daruma.JXml_ElementosEnvioNFSe));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JInterface_Sat', TypeInfo(Elgin.JNI.Daruma.JInterface_Sat));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jsat_Daruma', TypeInfo(Elgin.JNI.Daruma.Jsat_Daruma));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jsat_xml_Op_XmlRetorno', TypeInfo(Elgin.JNI.Daruma.Jsat_xml_Op_XmlRetorno));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jsat_Layout', TypeInfo(Elgin.JNI.Daruma.Jsat_Layout));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JParseNFCe_2_SAT', TypeInfo(Elgin.JNI.Daruma.JParseNFCe_2_SAT));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JSat', TypeInfo(Elgin.JNI.Daruma.JSat));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JSatCr', TypeInfo(Elgin.JNI.Daruma.JSatCr));
  //TRegTypes.RegisterType('Elgin.JNI.Daruma.JSatCrComunicacao', TypeInfo(Elgin.JNI.Daruma.JSatCrComunicacao));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JSatCrComunicacao_UsbPermission', TypeInfo(Elgin.JNI.Daruma.JSatCrComunicacao_UsbPermission));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JUrano', TypeInfo(Elgin.JNI.Daruma.JUrano));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCONFIGURACAO', TypeInfo(Elgin.JNI.Daruma.JCONFIGURACAO));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JEMIT', TypeInfo(Elgin.JNI.Daruma.JEMIT));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIDENTIFICACAO_CFE', TypeInfo(Elgin.JNI.Daruma.JIDENTIFICACAO_CFE));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JISSQN', TypeInfo(Elgin.JNI.Daruma.JISSQN));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jsat_xml_Objetos', TypeInfo(Elgin.JNI.Daruma.Jsat_xml_Objetos));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jsat_xml_Op_XmlAuxiliar', TypeInfo(Elgin.JNI.Daruma.Jsat_xml_Op_XmlAuxiliar));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPROD', TypeInfo(Elgin.JNI.Daruma.JPROD));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JXml_ElementosAux', TypeInfo(Elgin.JNI.Daruma.JXml_ElementosAux));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaLogger', TypeInfo(Elgin.JNI.Daruma.JDarumaLogger));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaLogger_LoggerDispatcherTrace', TypeInfo(Elgin.JNI.Daruma.JDarumaLogger_LoggerDispatcherTrace));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDarumaLoggerConst', TypeInfo(Elgin.JNI.Daruma.JDarumaLoggerConst));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPersistenciaJSON', TypeInfo(Elgin.JNI.Daruma.JPersistenciaJSON));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPersistenciaXML', TypeInfo(Elgin.JNI.Daruma.JPersistenciaXML));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JSatNativo', TypeInfo(Elgin.JNI.Daruma.JSatNativo));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDescAcrEntr', TypeInfo(Elgin.JNI.Daruma.JDescAcrEntr));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDest', TypeInfo(Elgin.JNI.Daruma.JDest));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDet', TypeInfo(Elgin.JNI.Daruma.JDet));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JelementosCFe_Emit', TypeInfo(Elgin.JNI.Daruma.JelementosCFe_Emit));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JEntrega', TypeInfo(Elgin.JNI.Daruma.JEntrega));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIde', TypeInfo(Elgin.JNI.Daruma.JIde));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JInfAdic', TypeInfo(Elgin.JNI.Daruma.JInfAdic));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JInfCFe', TypeInfo(Elgin.JNI.Daruma.JInfCFe));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JMeioDePagamento', TypeInfo(Elgin.JNI.Daruma.JMeioDePagamento));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPgto', TypeInfo(Elgin.JNI.Daruma.JPgto));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JelementosCFe_Prod', TypeInfo(Elgin.JNI.Daruma.JelementosCFe_Prod));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTotal', TypeInfo(Elgin.JNI.Daruma.JTotal));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofins', TypeInfo(Elgin.JNI.Daruma.JCofins));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinsaliq', TypeInfo(Elgin.JNI.Daruma.JCofinsaliq));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinsnt', TypeInfo(Elgin.JNI.Daruma.JCofinsnt));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinsoutr', TypeInfo(Elgin.JNI.Daruma.JCofinsoutr));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinsqtde', TypeInfo(Elgin.JNI.Daruma.JCofinsqtde));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinssn', TypeInfo(Elgin.JNI.Daruma.JCofinssn));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JCofinsst', TypeInfo(Elgin.JNI.Daruma.JCofinsst));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms', TypeInfo(Elgin.JNI.Daruma.JIcms));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms00', TypeInfo(Elgin.JNI.Daruma.JIcms00));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcms40', TypeInfo(Elgin.JNI.Daruma.JIcms40));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcmssn102', TypeInfo(Elgin.JNI.Daruma.JIcmssn102));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIcmssn900', TypeInfo(Elgin.JNI.Daruma.JIcmssn900));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jimpostos_Issqn', TypeInfo(Elgin.JNI.Daruma.Jimpostos_Issqn));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPis', TypeInfo(Elgin.JNI.Daruma.JPis));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPisaliq', TypeInfo(Elgin.JNI.Daruma.JPisaliq));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPisnt', TypeInfo(Elgin.JNI.Daruma.JPisnt));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPisoutr', TypeInfo(Elgin.JNI.Daruma.JPisoutr));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPisqtde', TypeInfo(Elgin.JNI.Daruma.JPisqtde));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPissn', TypeInfo(Elgin.JNI.Daruma.JPissn));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JPisst', TypeInfo(Elgin.JNI.Daruma.JPisst));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JxmlConfiguracao_Configuracao', TypeInfo(Elgin.JNI.Daruma.JxmlConfiguracao_Configuracao));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JxmlConfiguracao_Emit', TypeInfo(Elgin.JNI.Daruma.JxmlConfiguracao_Emit));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JIdentificacaoCFe', TypeInfo(Elgin.JNI.Daruma.JIdentificacaoCFe));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JImposto', TypeInfo(Elgin.JNI.Daruma.JImposto));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JxmlConfiguracao_Prod', TypeInfo(Elgin.JNI.Daruma.JxmlConfiguracao_Prod));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JSAT_Framework_XML', TypeInfo(Elgin.JNI.Daruma.JSAT_Framework_XML));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JComunicacaoWS', TypeInfo(Elgin.JNI.Daruma.JComunicacaoWS));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JITServiceWs', TypeInfo(Elgin.JNI.Daruma.JITServiceWs));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTrustedManagerManipulator', TypeInfo(Elgin.JNI.Daruma.JTrustedManagerManipulator));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JTrustedManagerManipulator_1', TypeInfo(Elgin.JNI.Daruma.JTrustedManagerManipulator_1));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDadosConsulta', TypeInfo(Elgin.JNI.Daruma.JDadosConsulta));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JInfoEmissao', TypeInfo(Elgin.JNI.Daruma.JInfoEmissao));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.Jdarumamobile_BuildConfig', TypeInfo(Elgin.JNI.Daruma.Jdarumamobile_BuildConfig));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDataInput', TypeInfo(Elgin.JNI.Daruma.JDataInput));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JFilterInputStream', TypeInfo(Elgin.JNI.Daruma.JFilterInputStream));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JDataInputStream', TypeInfo(Elgin.JNI.Daruma.JDataInputStream));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JVoid', TypeInfo(Elgin.JNI.Daruma.JVoid));
  TRegTypes.RegisterType('Elgin.JNI.Daruma.JVector', TypeInfo(Elgin.JNI.Daruma.JVector));
end;

initialization
  RegisterTypes;
end.

