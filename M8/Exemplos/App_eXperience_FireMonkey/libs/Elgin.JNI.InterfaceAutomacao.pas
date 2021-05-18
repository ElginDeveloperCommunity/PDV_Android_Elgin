
unit Elgin.JNI.InterfaceAutomacao;

interface

uses
  Androidapi.JNIBridge,
  Androidapi.JNI.App,
  Androidapi.JNI.GraphicsContentViewText,
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
  JAplicacaoNaoInstaladaExcecao = interface;//br.com.setis.interfaceautomacao.AplicacaoNaoInstaladaExcecao
  Jinterfaceautomacao_BuildConfig = interface;//br.com.setis.interfaceautomacao.BuildConfig
  JCartoes = interface;//br.com.setis.interfaceautomacao.Cartoes
  JComunicacaoServico = interface;//br.com.setis.interfaceautomacao.ComunicacaoServico
  JComunicacaoServico_IncomingHandler = interface;//br.com.setis.interfaceautomacao.ComunicacaoServico$IncomingHandler
  JConfirmacao = interface;//br.com.setis.interfaceautomacao.Confirmacao
  JConfirmacoes = interface;//br.com.setis.interfaceautomacao.Confirmacoes
  JDadosAutomacao = interface;//br.com.setis.interfaceautomacao.DadosAutomacao
  JEntradaTransacao = interface;//br.com.setis.interfaceautomacao.EntradaTransacao
  JFinanciamentos = interface;//br.com.setis.interfaceautomacao.Financiamentos
  JGlobalDefs = interface;//br.com.setis.interfaceautomacao.GlobalDefs
  JIdentificacaoPortadorCarteira = interface;//br.com.setis.interfaceautomacao.IdentificacaoPortadorCarteira
  JModalidadesPagamento = interface;//br.com.setis.interfaceautomacao.ModalidadesPagamento
  JModalidadesTransacao = interface;//br.com.setis.interfaceautomacao.ModalidadesTransacao
  JOperacoes = interface;//br.com.setis.interfaceautomacao.Operacoes
  JPersonalizacao = interface;//br.com.setis.interfaceautomacao.Personalizacao
  JPersonalizacao_1 = interface;//br.com.setis.interfaceautomacao.Personalizacao$1
  JPersonalizacao_Builder = interface;//br.com.setis.interfaceautomacao.Personalizacao$Builder
  JProvedores = interface;//br.com.setis.interfaceautomacao.Provedores
  JQuedaConexaoTerminalExcecao = interface;//br.com.setis.interfaceautomacao.QuedaConexaoTerminalExcecao
  JSaidaTransacao = interface;//br.com.setis.interfaceautomacao.SaidaTransacao
  JSenderActivity = interface;//br.com.setis.interfaceautomacao.SenderActivity
  JStatusTransacao = interface;//br.com.setis.interfaceautomacao.StatusTransacao
  JTerminal = interface;//br.com.setis.interfaceautomacao.Terminal
  JTerminalDesconectadoExcecao = interface;//br.com.setis.interfaceautomacao.TerminalDesconectadoExcecao
  JTerminalNaoConfiguradoExcecao = interface;//br.com.setis.interfaceautomacao.TerminalNaoConfiguradoExcecao
  JTransacao = interface;//br.com.setis.interfaceautomacao.Transacao
  JTransacaoPendenteDados = interface;//br.com.setis.interfaceautomacao.TransacaoPendenteDados
  JTransacoes = interface;//br.com.setis.interfaceautomacao.Transacoes
  JTransacoes_1 = interface;//br.com.setis.interfaceautomacao.Transacoes$1
  JTransacoes_TransacaoResultReceiver = interface;//br.com.setis.interfaceautomacao.Transacoes$TransacaoResultReceiver
  JVersoes = interface;//br.com.setis.interfaceautomacao.Versoes
  JViasImpressao = interface;//br.com.setis.interfaceautomacao.ViasImpressao
  JCustomization = interface;//br.com.setis.interfaceautomacao.espec.Customization
  JTransactionInput = interface;//br.com.setis.interfaceautomacao.espec.TransactionInput
  JTransactionOutput = interface;//br.com.setis.interfaceautomacao.espec.TransactionOutput
  JDateParser = interface;//br.com.setis.interfaceautomacao.parser.DateParser
  JEnumType = interface;//br.com.setis.interfaceautomacao.parser.EnumType
  JInputParser = interface;//br.com.setis.interfaceautomacao.parser.InputParser
  JOutputParser = interface;//br.com.setis.interfaceautomacao.parser.OutputParser
  Jparser_ParseException = interface;//br.com.setis.interfaceautomacao.parser.ParseException
  JUriArrayFieldName = interface;//br.com.setis.interfaceautomacao.parser.UriArrayFieldName
  Jparser_UriClass = interface;//br.com.setis.interfaceautomacao.parser.UriClass
  JUriCustomizeFieldName = interface;//br.com.setis.interfaceautomacao.parser.UriCustomizeFieldName
  JUriDateFieldName = interface;//br.com.setis.interfaceautomacao.parser.UriDateFieldName
  JUriEnumFieldName = interface;//br.com.setis.interfaceautomacao.parser.UriEnumFieldName
  JUriFileFieldName = interface;//br.com.setis.interfaceautomacao.parser.UriFileFieldName
  JUriMethodName = interface;//br.com.setis.interfaceautomacao.parser.UriMethodName
  JUriObjectFieldName = interface;//br.com.setis.interfaceautomacao.parser.UriObjectFieldName
  JUriPrimitiveFieldName = interface;//br.com.setis.interfaceautomacao.parser.UriPrimitiveFieldName

// ===== Interface declarations =====

  JAnimatorClass = interface(JObjectClass)
    ['{3F76A5DF-389E-4BD3-9861-04C5B00CEADE}']
    {class} function init: JAnimator; cdecl;
    {class} procedure addListener(listener: JAnimator_AnimatorListener); cdecl;
    {class} procedure &end; cdecl;
    {class} function getDuration: Int64; cdecl;
    {class} function getInterpolator: JTimeInterpolator; cdecl;
    {class} function isRunning: Boolean; cdecl;//Deprecated
    {class} function isStarted: Boolean; cdecl;//Deprecated
    {class} procedure pause; cdecl;//Deprecated
    {class} procedure resume; cdecl;//Deprecated
    {class} function setDuration(duration: Int64): JAnimator; cdecl;//Deprecated
    {class} procedure setInterpolator(value: JTimeInterpolator); cdecl;//Deprecated
    {class} procedure setupStartValues; cdecl;//Deprecated
    {class} procedure start; cdecl;//Deprecated
  end;

  [JavaSignature('android/animation/Animator')]
  JAnimator = interface(JObject)
    ['{FA13E56D-1B6D-4A3D-8327-9E5BA785CF21}']
    procedure addPauseListener(listener: JAnimator_AnimatorPauseListener); cdecl;
    procedure cancel; cdecl;
    function clone: JAnimator; cdecl;
    function getListeners: JArrayList; cdecl;//Deprecated
    function getStartDelay: Int64; cdecl;//Deprecated
    function isPaused: Boolean; cdecl;//Deprecated
    procedure removeAllListeners; cdecl;//Deprecated
    procedure removeListener(listener: JAnimator_AnimatorListener); cdecl;//Deprecated
    procedure removePauseListener(listener: JAnimator_AnimatorPauseListener); cdecl;//Deprecated
    procedure setStartDelay(startDelay: Int64); cdecl;//Deprecated
    procedure setTarget(target: JObject); cdecl;//Deprecated
    procedure setupEndValues; cdecl;//Deprecated
  end;
  TJAnimator = class(TJavaGenericImport<JAnimatorClass, JAnimator>) end;

  JAnimator_AnimatorListenerClass = interface(IJavaClass)
    ['{5ED6075A-B997-469C-B8D9-0AA8FB7E4798}']
    {class} procedure onAnimationEnd(animation: JAnimator); cdecl;
    {class} procedure onAnimationRepeat(animation: JAnimator); cdecl;
  end;

  [JavaSignature('android/animation/Animator$AnimatorListener')]
  JAnimator_AnimatorListener = interface(IJavaInstance)
    ['{E2DE8DD6-628B-4D84-AA46-8A1E3F00FF13}']
    procedure onAnimationCancel(animation: JAnimator); cdecl;
    procedure onAnimationStart(animation: JAnimator); cdecl;
  end;
  TJAnimator_AnimatorListener = class(TJavaGenericImport<JAnimator_AnimatorListenerClass, JAnimator_AnimatorListener>) end;

  JAnimator_AnimatorPauseListenerClass = interface(IJavaClass)
    ['{CB0DC3F0-63BC-4284-ADD0-2ED367AE11E5}']
    {class} procedure onAnimationPause(animation: JAnimator); cdecl;
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
    {class} function clone: JKeyframe; cdecl;//Deprecated
    {class} function getFraction: Single; cdecl;//Deprecated
    {class} function getInterpolator: JTimeInterpolator; cdecl;//Deprecated
    {class} function ofFloat(fraction: Single; value: Single): JKeyframe; cdecl; overload;
    {class} function ofFloat(fraction: Single): JKeyframe; cdecl; overload;
    {class} function ofInt(fraction: Single; value: Integer): JKeyframe; cdecl; overload;
    {class} function ofInt(fraction: Single): JKeyframe; cdecl; overload;
    {class} function ofObject(fraction: Single; value: JObject): JKeyframe; cdecl; overload;
    {class} function ofObject(fraction: Single): JKeyframe; cdecl; overload;
    {class} procedure setFraction(fraction: Single); cdecl;
    {class} procedure setInterpolator(interpolator: JTimeInterpolator); cdecl;
  end;

  [JavaSignature('android/animation/Keyframe')]
  JKeyframe = interface(JObject)
    ['{9D0687A4-669E-440F-8290-154739405019}']
    function getType: Jlang_Class; cdecl;
    function getValue: JObject; cdecl;
    function hasValue: Boolean; cdecl;
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
    {class} procedure addTransitionListener(listener: JLayoutTransition_TransitionListener); cdecl;//Deprecated
    {class} procedure disableTransitionType(transitionType: Integer); cdecl;//Deprecated
    {class} procedure enableTransitionType(transitionType: Integer); cdecl;//Deprecated
    {class} function getInterpolator(transitionType: Integer): JTimeInterpolator; cdecl;//Deprecated
    {class} function getStagger(transitionType: Integer): Int64; cdecl;//Deprecated
    {class} function getStartDelay(transitionType: Integer): Int64; cdecl;//Deprecated
    {class} function isChangingLayout: Boolean; cdecl;//Deprecated
    {class} function isRunning: Boolean; cdecl;//Deprecated
    {class} function isTransitionTypeEnabled(transitionType: Integer): Boolean; cdecl;//Deprecated
    {class} procedure setAnimator(transitionType: Integer; animator: JAnimator); cdecl;
    {class} procedure setDuration(duration: Int64); cdecl; overload;
    {class} procedure setDuration(transitionType: Integer; duration: Int64); cdecl; overload;
    {class} procedure showChild(parent: JViewGroup; child: JView); cdecl; overload;//Deprecated
    {class} procedure showChild(parent: JViewGroup; child: JView; oldVisibility: Integer); cdecl; overload;
    {class} property APPEARING: Integer read _GetAPPEARING;
    {class} property CHANGE_APPEARING: Integer read _GetCHANGE_APPEARING;
    {class} property CHANGE_DISAPPEARING: Integer read _GetCHANGE_DISAPPEARING;
    {class} property CHANGING: Integer read _GetCHANGING;
    {class} property DISAPPEARING: Integer read _GetDISAPPEARING;
  end;

  [JavaSignature('android/animation/LayoutTransition')]
  JLayoutTransition = interface(JObject)
    ['{42450BEE-EBF2-4954-B9B7-F8DAE7DF0EC1}']
    procedure addChild(parent: JViewGroup; child: JView); cdecl;//Deprecated
    function getAnimator(transitionType: Integer): JAnimator; cdecl;//Deprecated
    function getDuration(transitionType: Integer): Int64; cdecl;//Deprecated
    function getTransitionListeners: JList; cdecl;//Deprecated
    procedure hideChild(parent: JViewGroup; child: JView); cdecl; overload;//Deprecated
    procedure hideChild(parent: JViewGroup; child: JView; newVisibility: Integer); cdecl; overload;//Deprecated
    procedure removeChild(parent: JViewGroup; child: JView); cdecl;
    procedure removeTransitionListener(listener: JLayoutTransition_TransitionListener); cdecl;
    procedure setAnimateParentHierarchy(animateParentHierarchy: Boolean); cdecl;
    procedure setInterpolator(transitionType: Integer; interpolator: JTimeInterpolator); cdecl;
    procedure setStagger(transitionType: Integer; duration: Int64); cdecl;
    procedure setStartDelay(transitionType: Integer; delay: Int64); cdecl;
  end;
  TJLayoutTransition = class(TJavaGenericImport<JLayoutTransitionClass, JLayoutTransition>) end;

  JLayoutTransition_TransitionListenerClass = interface(IJavaClass)
    ['{9FA6F1EC-8EDB-4A05-AF58-B55A525AE114}']
    {class} procedure endTransition(transition: JLayoutTransition; container: JViewGroup; view: JView; transitionType: Integer); cdecl;
    {class} procedure startTransition(transition: JLayoutTransition; container: JViewGroup; view: JView; transitionType: Integer); cdecl;
  end;

  [JavaSignature('android/animation/LayoutTransition$TransitionListener')]
  JLayoutTransition_TransitionListener = interface(IJavaInstance)
    ['{0FBE048F-FCDA-4692-B6F1-DE0F07FAE885}']
  end;
  TJLayoutTransition_TransitionListener = class(TJavaGenericImport<JLayoutTransition_TransitionListenerClass, JLayoutTransition_TransitionListener>) end;

  JPropertyValuesHolderClass = interface(JObjectClass)
    ['{36C77AFF-9C3F-42B6-88F3-320FE8CF9B25}']
    {class} function getPropertyName: JString; cdecl;
    {class} function ofMultiFloat(propertyName: JString; values: TJavaBiArray<Single>): JPropertyValuesHolder; cdecl; overload;
    {class} function ofMultiFloat(propertyName: JString; path: JPath): JPropertyValuesHolder; cdecl; overload;
    {class} function ofMultiInt(propertyName: JString; values: TJavaBiArray<Integer>): JPropertyValuesHolder; cdecl; overload;
    {class} function ofMultiInt(propertyName: JString; path: JPath): JPropertyValuesHolder; cdecl; overload;
    {class} function ofObject(propertyName: JString; converter: JTypeConverter; path: JPath): JPropertyValuesHolder; cdecl; overload;
    {class} function ofObject(property_: JProperty; converter: JTypeConverter; path: JPath): JPropertyValuesHolder; cdecl; overload;
  end;

  [JavaSignature('android/animation/PropertyValuesHolder')]
  JPropertyValuesHolder = interface(JObject)
    ['{12B4ABFD-CBCA-4636-AF2D-C386EF895DC3}']
    function clone: JPropertyValuesHolder; cdecl;
    procedure setConverter(converter: JTypeConverter); cdecl;//Deprecated
    procedure setEvaluator(evaluator: JTypeEvaluator); cdecl;//Deprecated
    procedure setProperty(property_: JProperty); cdecl;//Deprecated
    procedure setPropertyName(propertyName: JString); cdecl;//Deprecated
    function toString: JString; cdecl;//Deprecated
  end;
  TJPropertyValuesHolder = class(TJavaGenericImport<JPropertyValuesHolderClass, JPropertyValuesHolder>) end;

  JStateListAnimatorClass = interface(JObjectClass)
    ['{109E4067-E218-47B1-93EB-65B8916A98D8}']
    {class} function init: JStateListAnimator; cdecl;
    {class} procedure addState(specs: TJavaArray<Integer>; animator: JAnimator); cdecl;
    {class} function clone: JStateListAnimator; cdecl;
  end;

  [JavaSignature('android/animation/StateListAnimator')]
  JStateListAnimator = interface(JObject)
    ['{CA2A9587-26AA-4DC2-8DFF-A1305A37608F}']
    procedure jumpToCurrentState; cdecl;
  end;
  TJStateListAnimator = class(TJavaGenericImport<JStateListAnimatorClass, JStateListAnimator>) end;

  JTimeInterpolatorClass = interface(IJavaClass)
    ['{1E682A1C-9102-461D-A3CA-5596683F1D66}']
  end;

  [JavaSignature('android/animation/TimeInterpolator')]
  JTimeInterpolator = interface(IJavaInstance)
    ['{639F8A83-7D9B-49AF-A19E-96B27E46D2AB}']
    function getInterpolation(input: Single): Single; cdecl;//Deprecated
  end;
  TJTimeInterpolator = class(TJavaGenericImport<JTimeInterpolatorClass, JTimeInterpolator>) end;

  JTypeConverterClass = interface(JObjectClass)
    ['{BE2DD177-6D79-4B0C-B4F5-4E4CD9D7436D}']
    {class} function init(fromClass: Jlang_Class; toClass: Jlang_Class): JTypeConverter; cdecl;
    {class} function convert(value: JObject): JObject; cdecl;//Deprecated
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
    function evaluate(fraction: Single; startValue: JObject; endValue: JObject): JObject; cdecl;//Deprecated
  end;
  TJTypeEvaluator = class(TJavaGenericImport<JTypeEvaluatorClass, JTypeEvaluator>) end;

  JValueAnimatorClass = interface(JAnimatorClass)
    ['{FF3B71ED-5A33-45B0-8500-7672B0B98E2C}']
    {class} function _GetINFINITE: Integer; cdecl;
    {class} function _GetRESTART: Integer; cdecl;
    {class} function _GetREVERSE: Integer; cdecl;
    {class} function init: JValueAnimator; cdecl;
    {class} procedure cancel; cdecl;//Deprecated
    {class} function clone: JValueAnimator; cdecl;//Deprecated
    {class} function getAnimatedValue(propertyName: JString): JObject; cdecl; overload;//Deprecated
    {class} function getCurrentPlayTime: Int64; cdecl;//Deprecated
    {class} function getDuration: Int64; cdecl;//Deprecated
    {class} function getFrameDelay: Int64; cdecl;
    {class} function getRepeatMode: Integer; cdecl;
    {class} function getStartDelay: Int64; cdecl;
    {class} function getValues: TJavaObjectArray<JPropertyValuesHolder>; cdecl;
    {class} procedure removeUpdateListener(listener: JValueAnimator_AnimatorUpdateListener); cdecl;
    {class} procedure resume; cdecl;
    {class} procedure reverse; cdecl;
    {class} procedure setEvaluator(value: JTypeEvaluator); cdecl;
    {class} procedure setFrameDelay(frameDelay: Int64); cdecl;
    {class} procedure setRepeatCount(value: Integer); cdecl;//Deprecated
    {class} procedure setRepeatMode(value: Integer); cdecl;//Deprecated
    {class} function toString: JString; cdecl;//Deprecated
    {class} property INFINITE: Integer read _GetINFINITE;
    {class} property RESTART: Integer read _GetRESTART;
    {class} property REVERSE: Integer read _GetREVERSE;
  end;

  [JavaSignature('android/animation/ValueAnimator')]
  JValueAnimator = interface(JAnimator)
    ['{70F92B14-EFD4-4DC7-91DE-6617417AE194}']
    procedure addUpdateListener(listener: JValueAnimator_AnimatorUpdateListener); cdecl;//Deprecated
    procedure &end; cdecl;//Deprecated
    function getAnimatedFraction: Single; cdecl;//Deprecated
    function getAnimatedValue: JObject; cdecl; overload;//Deprecated
    function getInterpolator: JTimeInterpolator; cdecl;
    function getRepeatCount: Integer; cdecl;
    function isRunning: Boolean; cdecl;
    function isStarted: Boolean; cdecl;
    procedure pause; cdecl;
    procedure removeAllUpdateListeners; cdecl;
    procedure setCurrentFraction(fraction: Single); cdecl;
    procedure setCurrentPlayTime(playTime: Int64); cdecl;
    function setDuration(duration: Int64): JValueAnimator; cdecl;
    procedure setInterpolator(value: JTimeInterpolator); cdecl;//Deprecated
    procedure setStartDelay(startDelay: Int64); cdecl;//Deprecated
    procedure start; cdecl;//Deprecated
  end;
  TJValueAnimator = class(TJavaGenericImport<JValueAnimatorClass, JValueAnimator>) end;

  JValueAnimator_AnimatorUpdateListenerClass = interface(IJavaClass)
    ['{9CA50CBF-4462-4445-82CD-13CE985E2DE4}']
  end;

  [JavaSignature('android/animation/ValueAnimator$AnimatorUpdateListener')]
  JValueAnimator_AnimatorUpdateListener = interface(IJavaInstance)
    ['{0F883491-52EF-4A40-B7D2-FC23E11E46FE}']
    procedure onAnimationUpdate(animation: JValueAnimator); cdecl;
  end;
  TJValueAnimator_AnimatorUpdateListener = class(TJavaGenericImport<JValueAnimator_AnimatorUpdateListenerClass, JValueAnimator_AnimatorUpdateListener>) end;

  JPathMotionClass = interface(JObjectClass)
    ['{E1CD1A94-115C-492C-A490-37F0E72956EB}']
    {class} function init: JPathMotion; cdecl; overload;
    {class} function init(context: JContext; attrs: JAttributeSet): JPathMotion; cdecl; overload;
  end;

  [JavaSignature('android/transition/PathMotion')]
  JPathMotion = interface(JObject)
    ['{BDC08353-C9FB-42D7-97CC-C35837D2F536}']
    function getPath(startX: Single; startY: Single; endX: Single; endY: Single): JPath; cdecl;//Deprecated
  end;
  TJPathMotion = class(TJavaGenericImport<JPathMotionClass, JPathMotion>) end;

  JSceneClass = interface(JObjectClass)
    ['{8B9120CA-AEEA-4DE3-BDC9-15CFD23A7B07}']
    {class} function init(sceneRoot: JViewGroup): JScene; cdecl; overload;
    {class} function init(sceneRoot: JViewGroup; layout: JView): JScene; cdecl; overload;
    {class} function init(sceneRoot: JViewGroup; layout: JViewGroup): JScene; cdecl; overload;//Deprecated
    {class} function getSceneForLayout(sceneRoot: JViewGroup; layoutId: Integer; context: JContext): JScene; cdecl;
    {class} function getSceneRoot: JViewGroup; cdecl;
    {class} procedure setEnterAction(action: JRunnable); cdecl;
  end;

  [JavaSignature('android/transition/Scene')]
  JScene = interface(JObject)
    ['{85A60B99-5837-4F1F-A344-C627DD586B82}']
    procedure enter; cdecl;
    procedure exit; cdecl;
    procedure setExitAction(action: JRunnable); cdecl;
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
    {class} function addListener(listener: JTransition_TransitionListener): JTransition; cdecl;
    {class} function addTarget(targetId: Integer): JTransition; cdecl; overload;
    {class} function addTarget(targetName: JString): JTransition; cdecl; overload;
    {class} procedure captureEndValues(transitionValues: JTransitionValues); cdecl;//Deprecated
    {class} procedure captureStartValues(transitionValues: JTransitionValues); cdecl;//Deprecated
    {class} function clone: JTransition; cdecl;//Deprecated
    {class} function excludeChildren(type_: Jlang_Class; exclude: Boolean): JTransition; cdecl; overload;//Deprecated
    {class} function excludeTarget(targetId: Integer; exclude: Boolean): JTransition; cdecl; overload;//Deprecated
    {class} function excludeTarget(targetName: JString; exclude: Boolean): JTransition; cdecl; overload;//Deprecated
    {class} function getDuration: Int64; cdecl;//Deprecated
    {class} function getEpicenter: JRect; cdecl;//Deprecated
    {class} function getEpicenterCallback: JTransition_EpicenterCallback; cdecl;//Deprecated
    {class} function getPropagation: JTransitionPropagation; cdecl;//Deprecated
    {class} function getStartDelay: Int64; cdecl;//Deprecated
    {class} function getTargetIds: JList; cdecl;//Deprecated
    {class} function getTransitionProperties: TJavaObjectArray<JString>; cdecl;
    {class} function getTransitionValues(view: JView; start: Boolean): JTransitionValues; cdecl;
    {class} function isTransitionRequired(startValues: JTransitionValues; endValues: JTransitionValues): Boolean; cdecl;
    {class} function removeTarget(target: JView): JTransition; cdecl; overload;
    {class} function removeTarget(target: Jlang_Class): JTransition; cdecl; overload;
    {class} function setDuration(duration: Int64): JTransition; cdecl;
    {class} procedure setPathMotion(pathMotion: JPathMotion); cdecl;
    {class} procedure setPropagation(transitionPropagation: JTransitionPropagation); cdecl;
    {class} function setStartDelay(startDelay: Int64): JTransition; cdecl;
    {class} property MATCH_ID: Integer read _GetMATCH_ID;
    {class} property MATCH_INSTANCE: Integer read _GetMATCH_INSTANCE;
    {class} property MATCH_ITEM_ID: Integer read _GetMATCH_ITEM_ID;
    {class} property MATCH_NAME: Integer read _GetMATCH_NAME;
  end;

  [JavaSignature('android/transition/Transition')]
  JTransition = interface(JObject)
    ['{C2F8200F-1C83-40AE-8C5B-C0C8BFF17F88}']
    function addTarget(targetType: Jlang_Class): JTransition; cdecl; overload;//Deprecated
    function addTarget(target: JView): JTransition; cdecl; overload;//Deprecated
    function canRemoveViews: Boolean; cdecl;//Deprecated
    function createAnimator(sceneRoot: JViewGroup; startValues: JTransitionValues; endValues: JTransitionValues): JAnimator; cdecl;//Deprecated
    function excludeChildren(targetId: Integer; exclude: Boolean): JTransition; cdecl; overload;//Deprecated
    function excludeChildren(target: JView; exclude: Boolean): JTransition; cdecl; overload;//Deprecated
    function excludeTarget(target: JView; exclude: Boolean): JTransition; cdecl; overload;//Deprecated
    function excludeTarget(type_: Jlang_Class; exclude: Boolean): JTransition; cdecl; overload;//Deprecated
    function getInterpolator: JTimeInterpolator; cdecl;//Deprecated
    function getName: JString; cdecl;//Deprecated
    function getPathMotion: JPathMotion; cdecl;//Deprecated
    function getTargetNames: JList; cdecl;
    function getTargetTypes: JList; cdecl;
    function getTargets: JList; cdecl;
    function removeListener(listener: JTransition_TransitionListener): JTransition; cdecl;
    function removeTarget(targetId: Integer): JTransition; cdecl; overload;
    function removeTarget(targetName: JString): JTransition; cdecl; overload;
    procedure setEpicenterCallback(epicenterCallback: JTransition_EpicenterCallback); cdecl;
    function setInterpolator(interpolator: JTimeInterpolator): JTransition; cdecl;
    function toString: JString; cdecl;
  end;
  TJTransition = class(TJavaGenericImport<JTransitionClass, JTransition>) end;

  JTransition_EpicenterCallbackClass = interface(JObjectClass)
    ['{8141257A-130B-466C-A08D-AA3A00946F4C}']
    {class} function init: JTransition_EpicenterCallback; cdecl;
    {class} function onGetEpicenter(transition: JTransition): JRect; cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/Transition$EpicenterCallback')]
  JTransition_EpicenterCallback = interface(JObject)
    ['{CE004917-266F-4076-8913-F23184824FBA}']
  end;
  TJTransition_EpicenterCallback = class(TJavaGenericImport<JTransition_EpicenterCallbackClass, JTransition_EpicenterCallback>) end;

  JTransition_TransitionListenerClass = interface(IJavaClass)
    ['{D5083752-E8A6-46DF-BE40-AE11073C387E}']
    {class} procedure onTransitionPause(transition: JTransition); cdecl;//Deprecated
    {class} procedure onTransitionResume(transition: JTransition); cdecl;//Deprecated
    {class} procedure onTransitionStart(transition: JTransition); cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/Transition$TransitionListener')]
  JTransition_TransitionListener = interface(IJavaInstance)
    ['{C32BE107-6E05-4898-AF0A-FAD970D66E29}']
    procedure onTransitionCancel(transition: JTransition); cdecl;//Deprecated
    procedure onTransitionEnd(transition: JTransition); cdecl;//Deprecated
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
    {class} procedure transitionTo(scene: JScene); cdecl;
  end;

  [JavaSignature('android/transition/TransitionManager')]
  JTransitionManager = interface(JObject)
    ['{FF5E1210-1F04-4F81-9CAC-3D7A5C4E972B}']
    procedure setTransition(scene: JScene; transition: JTransition); cdecl; overload;
    procedure setTransition(fromScene: JScene; toScene: JScene; transition: JTransition); cdecl; overload;
  end;
  TJTransitionManager = class(TJavaGenericImport<JTransitionManagerClass, JTransitionManager>) end;

  JTransitionPropagationClass = interface(JObjectClass)
    ['{A881388A-C877-4DD9-9BAD-1BA4F56133EE}']
    {class} function init: JTransitionPropagation; cdecl;
    {class} function getStartDelay(sceneRoot: JViewGroup; transition: JTransition; startValues: JTransitionValues; endValues: JTransitionValues): Int64; cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/TransitionPropagation')]
  JTransitionPropagation = interface(JObject)
    ['{7595B7EF-6BCE-4281-BC67-335E2FB6C091}']
    procedure captureValues(transitionValues: JTransitionValues); cdecl;//Deprecated
    function getPropagationProperties: TJavaObjectArray<JString>; cdecl;//Deprecated
  end;
  TJTransitionPropagation = class(TJavaGenericImport<JTransitionPropagationClass, JTransitionPropagation>) end;

  JTransitionValuesClass = interface(JObjectClass)
    ['{3BF98CFA-6A4D-4815-8D42-15E97C916D91}']
    {class} function _Getvalues: JMap; cdecl;
    {class} function init: JTransitionValues; cdecl;
    {class} function hashCode: Integer; cdecl;//Deprecated
    {class} function toString: JString; cdecl;//Deprecated
    {class} property values: JMap read _Getvalues;
  end;

  [JavaSignature('android/transition/TransitionValues')]
  JTransitionValues = interface(JObject)
    ['{178E09E6-D32C-48A9-ADCF-8CCEA804052A}']
    function _Getview: JView; cdecl;
    function equals(other: JObject): Boolean; cdecl;//Deprecated
    property view: JView read _Getview;
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

  JAplicacaoNaoInstaladaExcecaoClass = interface(JExceptionClass)
    ['{C704E9F6-71D5-43B7-A317-553BF35864F3}']
    {class} function init: JAplicacaoNaoInstaladaExcecao; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/AplicacaoNaoInstaladaExcecao')]
  JAplicacaoNaoInstaladaExcecao = interface(JException)
    ['{C762C0C0-F287-4EE9-A4D6-93B2928D7C68}']
  end;
  TJAplicacaoNaoInstaladaExcecao = class(TJavaGenericImport<JAplicacaoNaoInstaladaExcecaoClass, JAplicacaoNaoInstaladaExcecao>) end;

  Jinterfaceautomacao_BuildConfigClass = interface(JObjectClass)
    ['{D3380523-22AC-4AB0-9AC5-70C0CCE758B1}']
    {class} function _GetBUILD_TYPE: JString; cdecl;
    {class} function _GetDEBUG: Boolean; cdecl;
    {class} function _GetLIBRARY_PACKAGE_NAME: JString; cdecl;
    {class} function _GetVERSION_CODE: Integer; cdecl;
    {class} function _GetVERSION_NAME: JString; cdecl;
    {class} function init: Jinterfaceautomacao_BuildConfig; cdecl;
    {class} property BUILD_TYPE: JString read _GetBUILD_TYPE;
    {class} property DEBUG: Boolean read _GetDEBUG;
    {class} property LIBRARY_PACKAGE_NAME: JString read _GetLIBRARY_PACKAGE_NAME;
    {class} property VERSION_CODE: Integer read _GetVERSION_CODE;
    {class} property VERSION_NAME: JString read _GetVERSION_NAME;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/BuildConfig')]
  Jinterfaceautomacao_BuildConfig = interface(JObject)
    ['{F7952D87-6CDC-4E04-A77F-58AA33327B13}']
  end;
  TJinterfaceautomacao_BuildConfig = class(TJavaGenericImport<Jinterfaceautomacao_BuildConfigClass, Jinterfaceautomacao_BuildConfig>) end;

  JCartoesClass = interface(JEnumClass)
    ['{C1CC0630-C43C-4DEF-958D-29A989E4A45B}']
    {class} function _GetCARTAO_CREDITO: JCartoes; cdecl;
    {class} function _GetCARTAO_DEBITO: JCartoes; cdecl;
    {class} function _GetCARTAO_DESCONHECIDO: JCartoes; cdecl;
    {class} function _GetCARTAO_FROTA: JCartoes; cdecl;
    {class} function _GetCARTAO_PRIVATELABEL: JCartoes; cdecl;
    {class} function _GetCARTAO_VOUCHER: JCartoes; cdecl;
    {class} function obtemCartao(P1: Integer): JCartoes; cdecl;
    {class} function valueOf(P1: JString): JCartoes; cdecl;
    {class} function values: TJavaObjectArray<JCartoes>; cdecl;
    {class} property CARTAO_CREDITO: JCartoes read _GetCARTAO_CREDITO;
    {class} property CARTAO_DEBITO: JCartoes read _GetCARTAO_DEBITO;
    {class} property CARTAO_DESCONHECIDO: JCartoes read _GetCARTAO_DESCONHECIDO;
    {class} property CARTAO_FROTA: JCartoes read _GetCARTAO_FROTA;
    {class} property CARTAO_PRIVATELABEL: JCartoes read _GetCARTAO_PRIVATELABEL;
    {class} property CARTAO_VOUCHER: JCartoes read _GetCARTAO_VOUCHER;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Cartoes')]
  JCartoes = interface(JEnum)
    ['{2E3D1BE3-942C-4935-899E-8A953235EF23}']
    function obtemTipoCartao: Integer; cdecl;
  end;
  TJCartoes = class(TJavaGenericImport<JCartoesClass, JCartoes>) end;

  JComunicacaoServicoClass = interface(JIntentServiceClass)
    ['{CC00579F-3350-476A-8B88-754C6D057CC9}']
    {class} function init: JComunicacaoServico; cdecl;
    {class} procedure setfTransInic(P1: Boolean); cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/ComunicacaoServico')]
  JComunicacaoServico = interface(JIntentService)
    ['{6B0E8760-FAF4-4784-B083-5E854317E0D7}']
    function onBind(P1: JIntent): JIBinder; cdecl;
    procedure onHandleIntent(P1: JIntent); cdecl;
    function onStartCommand(P1: JIntent; P2: Integer; P3: Integer): Integer; cdecl;
    function onUnbind(P1: JIntent): Boolean; cdecl;
    procedure retornoCliente(P1: Integer; P2: JString; P3: JString); cdecl;
  end;
  TJComunicacaoServico = class(TJavaGenericImport<JComunicacaoServicoClass, JComunicacaoServico>) end;

  JComunicacaoServico_IncomingHandlerClass = interface(JHandlerClass)
    ['{04C60A19-A7B3-457A-9BF0-6D94EAB6546F}']
    {class} function init(P1: JComunicacaoServico; P2: JComunicacaoServico): JComunicacaoServico_IncomingHandler; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/ComunicacaoServico$IncomingHandler')]
  JComunicacaoServico_IncomingHandler = interface(JHandler)
    ['{4306D46D-B419-4CE8-B07A-9B29296DF555}']
    procedure handleMessage(P1: JMessage); cdecl;
  end;
  TJComunicacaoServico_IncomingHandler = class(TJavaGenericImport<JComunicacaoServico_IncomingHandlerClass, JComunicacaoServico_IncomingHandler>) end;

  JConfirmacaoClass = interface(JSerializableClass)
    ['{269538CB-6ED0-45C9-89F0-71FFE737BB08}']
    {class} function init: JConfirmacao; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Confirmacao')]
  JConfirmacao = interface(JSerializable)
    ['{B51EFC3E-7C9B-452E-8913-A70F34740716}']
    function informaStatusTransacao(P1: JStatusTransacao): JConfirmacao; cdecl;
    function obtemStatusTransacao: JStatusTransacao; cdecl;
  end;
  TJConfirmacao = class(TJavaGenericImport<JConfirmacaoClass, JConfirmacao>) end;

  JConfirmacoesClass = interface(JConfirmacaoClass)
    ['{E707CA97-3916-4A31-9774-9A8207DFD47C}']
    {class} function init: JConfirmacoes; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Confirmacoes')]
  JConfirmacoes = interface(JConfirmacao)
    ['{719A10FA-D484-44C0-9C6B-A739FB92FADE}']
    function informaIdentificadorConfirmacaoTransacao(P1: JString): JConfirmacoes; cdecl;
    function obtemIdentificadorTransacao: JString; cdecl;
  end;
  TJConfirmacoes = class(TJavaGenericImport<JConfirmacoesClass, JConfirmacoes>) end;

  JDadosAutomacaoClass = interface(JSerializableClass)
    ['{A871830A-EB64-4EF2-980C-44E37173674A}']
    {class} function init(P1: JString; P2: JString; P3: JString; P4: Boolean; P5: Boolean; P6: Boolean; P7: Boolean): JDadosAutomacao; cdecl; overload;
    {class} function init(P1: JString; P2: JString; P3: JString; P4: Boolean; P5: Boolean; P6: Boolean; P7: Boolean; P8: JPersonalizacao): JDadosAutomacao; cdecl; overload;
    {class} function init(P1: JString; P2: JString; P3: JString; P4: Boolean; P5: Boolean; P6: Boolean; P7: Boolean; P8: Boolean; P9: JPersonalizacao): JDadosAutomacao; cdecl; overload;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/DadosAutomacao')]
  JDadosAutomacao = interface(JSerializable)
    ['{F6E4FCA9-FF28-4F57-9D7D-1EC4BA42F6D3}']
    function obtemEmpresaAutomacao: JString; cdecl;
    function obtemNomeAutomacao: JString; cdecl;
    function obtemPersonalizacaoCliente: JPersonalizacao; cdecl;
    function obtemVersaoAutomacao: JString; cdecl;
    function suportaAbatimentoSaldoVoucher: Boolean; cdecl;
    function suportaDesconto: Boolean; cdecl;
    function suportaTroco: Boolean; cdecl;
    function suportaViaReduzida: Boolean; cdecl;
    function suportaViasDiferneciadas: Boolean; cdecl;
  end;
  TJDadosAutomacao = class(TJavaGenericImport<JDadosAutomacaoClass, JDadosAutomacao>) end;

  JEntradaTransacaoClass = interface(JSerializableClass)
    ['{2A1EEBEC-4F97-4994-8626-FA211D59185A}']
    {class} function init(P1: JOperacoes; P2: JString): JEntradaTransacao; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/EntradaTransacao')]
  JEntradaTransacao = interface(JSerializable)
    ['{CCD2D352-6466-4013-ACF5-FFAFC6BB77AB}']
    function informaCodigoAutorizacaoOriginal(P1: JString): JEntradaTransacao; cdecl;
    function informaCodigoMoeda(P1: JString): JEntradaTransacao; cdecl;
    function informaDadosAdicionaisAutomacao1(P1: JString): JEntradaTransacao; cdecl;
    function informaDadosAdicionaisAutomacao2(P1: JString): JEntradaTransacao; cdecl;
    function informaDadosAdicionaisAutomacao3(P1: JString): JEntradaTransacao; cdecl;
    function informaDadosAdicionaisAutomacao4(P1: JString): JEntradaTransacao; cdecl;
    function informaDataHoraTransacaoOriginal(P1: JDate): JEntradaTransacao; cdecl;
    function informaDataPredatado(P1: JDate): JEntradaTransacao; cdecl;
    function informaDocumentoFiscal(P1: JString): JEntradaTransacao; cdecl;
    function informaEstabelecimentoCNPJouCPF(P1: JString): JEntradaTransacao; cdecl;
    function informaModalidadePagamento(P1: JModalidadesPagamento): JEntradaTransacao; cdecl;
    function informaNomeProvedor(P1: JString): JEntradaTransacao; cdecl;
    function informaNsuTransacaoOriginal(P1: JString): JEntradaTransacao; cdecl;
    function informaNumeroFatura(P1: JString): JEntradaTransacao; cdecl;
    function informaNumeroParcelas(P1: Integer): JEntradaTransacao; cdecl;
    function informaNumeroTelefone(P1: JString): JEntradaTransacao; cdecl;
    function informaProvedor(P1: JProvedores): JEntradaTransacao; cdecl;
    function informaTaxaEmbarque(P1: JString): JEntradaTransacao; cdecl;
    function informaTaxaServico(P1: JString): JEntradaTransacao; cdecl;
    function informaTipoCartao(P1: JCartoes): JEntradaTransacao; cdecl;
    function informaTipoFinanciamento(P1: JFinanciamentos): JEntradaTransacao; cdecl;
    function informaValorTotal(P1: JString): JEntradaTransacao; cdecl;
    function obtemCodigoAutorizacaoOriginal: JString; cdecl;
    function obtemCodigoMoeda: JString; cdecl;
    function obtemDadosAdicionaisAutomacao1: JString; cdecl;
    function obtemDadosAdicionaisAutomacao2: JString; cdecl;
    function obtemDadosAdicionaisAutomacao3: JString; cdecl;
    function obtemDadosAdicionaisAutomacao4: JString; cdecl;
    function obtemDataHoraTransacaoOriginal: JDate; cdecl;
    function obtemDataPredatado: JDate; cdecl;
    function obtemDocumentoFiscal: JString; cdecl;
    function obtemEstabelecimentoCNPJouCPF: JString; cdecl;
    function obtemIdTransacaoAutomacao: JString; cdecl;
    function obtemModalidadePagamento: JModalidadesPagamento; cdecl;
    function obtemNomeProvedor: JString; cdecl;
    function obtemNsuTransacaoOriginal: JString; cdecl;
    function obtemNumeroFatura: JString; cdecl;
    function obtemNumeroParcelas: Integer; cdecl;
    function obtemNumeroTelefone: JString; cdecl;
    function obtemOperacao: JOperacoes; cdecl;
    function obtemProvedor: JProvedores; cdecl;
    function obtemTaxaEmbarque: JString; cdecl;
    function obtemTaxaServico: JString; cdecl;
    function obtemTipoCartao: JCartoes; cdecl;
    function obtemTipoFinanciamento: JFinanciamentos; cdecl;
    function obtemValorTotal: JString; cdecl;
  end;
  TJEntradaTransacao = class(TJavaGenericImport<JEntradaTransacaoClass, JEntradaTransacao>) end;

  JFinanciamentosClass = interface(JEnumClass)
    ['{1264D144-8B9C-4A90-825E-C480546EADB8}']
    {class} function _GetA_VISTA: JFinanciamentos; cdecl;
    {class} function _GetCREDITO_EMISSOR: JFinanciamentos; cdecl;
    {class} function _GetFINANCIAMENTO_NAO_DEFINIDO: JFinanciamentos; cdecl;
    {class} function _GetPARCELADO_EMISSOR: JFinanciamentos; cdecl;
    {class} function _GetPARCELADO_ESTABELECIMENTO: JFinanciamentos; cdecl;
    {class} function _GetPRE_DATADO: JFinanciamentos; cdecl;
    {class} function obtemFinanciamento(P1: Integer): JFinanciamentos; cdecl;
    {class} function valueOf(P1: JString): JFinanciamentos; cdecl;
    {class} function values: TJavaObjectArray<JFinanciamentos>; cdecl;
    {class} property A_VISTA: JFinanciamentos read _GetA_VISTA;
    {class} property CREDITO_EMISSOR: JFinanciamentos read _GetCREDITO_EMISSOR;
    {class} property FINANCIAMENTO_NAO_DEFINIDO: JFinanciamentos read _GetFINANCIAMENTO_NAO_DEFINIDO;
    {class} property PARCELADO_EMISSOR: JFinanciamentos read _GetPARCELADO_EMISSOR;
    {class} property PARCELADO_ESTABELECIMENTO: JFinanciamentos read _GetPARCELADO_ESTABELECIMENTO;
    {class} property PRE_DATADO: JFinanciamentos read _GetPRE_DATADO;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Financiamentos')]
  JFinanciamentos = interface(JEnum)
    ['{D245D63F-2135-4F80-9B3F-B4CD6366EE30}']
    function obtemCodigoFinanciamento: Integer; cdecl;
  end;
  TJFinanciamentos = class(TJavaGenericImport<JFinanciamentosClass, JFinanciamentos>) end;

  JGlobalDefsClass = interface(IJavaClass)
    ['{D3875A19-82AB-44A1-AB61-6DDA5D2C090D}']
    {class} function _GetAPP_URI: JString; cdecl;
    {class} function _GetCLIENTE_NAO_CONFIGURADO: Integer; cdecl;
    {class} function _GetCLIENTE_NAO_INSTALADO: Integer; cdecl;
    {class} function _GetCONFIRMACAO_EXTRA: JString; cdecl;
    {class} function _GetCONFIRM_URI: JString; cdecl;
    {class} function _GetDADOS_EXTRA: JString; cdecl;
    {class} function _GetENTRADA_EXTRA: JString; cdecl;
    {class} function _GetPAYMENT_URI: JString; cdecl;
    {class} function _GetPENDENCIA_EXTRA: JString; cdecl;
    {class} function _GetPERSONALIZACAO: JString; cdecl;
    {class} function _GetRESOLVE_URI: JString; cdecl;
    {class} property APP_URI: JString read _GetAPP_URI;
    {class} property CLIENTE_NAO_CONFIGURADO: Integer read _GetCLIENTE_NAO_CONFIGURADO;
    {class} property CLIENTE_NAO_INSTALADO: Integer read _GetCLIENTE_NAO_INSTALADO;
    {class} property CONFIRMACAO_EXTRA: JString read _GetCONFIRMACAO_EXTRA;
    {class} property CONFIRM_URI: JString read _GetCONFIRM_URI;
    {class} property DADOS_EXTRA: JString read _GetDADOS_EXTRA;
    {class} property ENTRADA_EXTRA: JString read _GetENTRADA_EXTRA;
    {class} property PAYMENT_URI: JString read _GetPAYMENT_URI;
    {class} property PENDENCIA_EXTRA: JString read _GetPENDENCIA_EXTRA;
    {class} property PERSONALIZACAO: JString read _GetPERSONALIZACAO;
    {class} property RESOLVE_URI: JString read _GetRESOLVE_URI;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/GlobalDefs')]
  JGlobalDefs = interface(IJavaInstance)
    ['{342AAA45-E884-4EED-B601-EE6E1A2961D5}']
  end;
  TJGlobalDefs = class(TJavaGenericImport<JGlobalDefsClass, JGlobalDefs>) end;

  JIdentificacaoPortadorCarteiraClass = interface(JEnumClass)
    ['{430C1797-A6E5-4D1C-B3E1-74A13FAA9575}']
    {class} function _GetCPF: JIdentificacaoPortadorCarteira; cdecl;
    {class} function _GetOUTROS: JIdentificacaoPortadorCarteira; cdecl;
    {class} function _GetQRCODE: JIdentificacaoPortadorCarteira; cdecl;
    {class} function obtemIdentificador(P1: Integer): JIdentificacaoPortadorCarteira; cdecl; overload;
    {class} function valueOf(P1: JString): JIdentificacaoPortadorCarteira; cdecl;
    {class} function values: TJavaObjectArray<JIdentificacaoPortadorCarteira>; cdecl;
    {class} property CPF: JIdentificacaoPortadorCarteira read _GetCPF;
    {class} property OUTROS: JIdentificacaoPortadorCarteira read _GetOUTROS;
    {class} property QRCODE: JIdentificacaoPortadorCarteira read _GetQRCODE;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/IdentificacaoPortadorCarteira')]
  JIdentificacaoPortadorCarteira = interface(JEnum)
    ['{2718B458-A609-48F9-8B64-A3A1B745BF89}']
    function obtemIdentificador: Integer; cdecl; overload;
  end;
  TJIdentificacaoPortadorCarteira = class(TJavaGenericImport<JIdentificacaoPortadorCarteiraClass, JIdentificacaoPortadorCarteira>) end;

  JModalidadesPagamentoClass = interface(JEnumClass)
    ['{43ECBFB9-7292-4EB8-9D61-B8C9FE4BE47C}']
    {class} function _GetPAGAMENTO_CARTAO: JModalidadesPagamento; cdecl;
    {class} function _GetPAGAMENTO_CARTEIRA_VIRTUAL: JModalidadesPagamento; cdecl;
    {class} function _GetPAGAMENTO_CHEQUE: JModalidadesPagamento; cdecl;
    {class} function _GetPAGAMENTO_DINHEIRO: JModalidadesPagamento; cdecl;
    {class} function valueOf(P1: JString): JModalidadesPagamento; cdecl;
    {class} function values: TJavaObjectArray<JModalidadesPagamento>; cdecl;
    {class} property PAGAMENTO_CARTAO: JModalidadesPagamento read _GetPAGAMENTO_CARTAO;
    {class} property PAGAMENTO_CARTEIRA_VIRTUAL: JModalidadesPagamento read _GetPAGAMENTO_CARTEIRA_VIRTUAL;
    {class} property PAGAMENTO_CHEQUE: JModalidadesPagamento read _GetPAGAMENTO_CHEQUE;
    {class} property PAGAMENTO_DINHEIRO: JModalidadesPagamento read _GetPAGAMENTO_DINHEIRO;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/ModalidadesPagamento')]
  JModalidadesPagamento = interface(JEnum)
    ['{D3CDA29C-0BF2-4759-B3BA-C7844698AA7E}']
  end;
  TJModalidadesPagamento = class(TJavaGenericImport<JModalidadesPagamentoClass, JModalidadesPagamento>) end;

  JModalidadesTransacaoClass = interface(JEnumClass)
    ['{CE7E26CB-93CA-43AB-ADE7-A199B1AB5F94}']
    {class} function _GetOFF: JModalidadesTransacao; cdecl;
    {class} function _GetON: JModalidadesTransacao; cdecl;
    {class} function valueOf(P1: JString): JModalidadesTransacao; cdecl;
    {class} function values: TJavaObjectArray<JModalidadesTransacao>; cdecl;
    {class} property OFF: JModalidadesTransacao read _GetOFF;
    {class} property ON: JModalidadesTransacao read _GetON;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/ModalidadesTransacao')]
  JModalidadesTransacao = interface(JEnum)
    ['{BAA17DD7-698A-4E64-8275-D258440707F1}']
  end;
  TJModalidadesTransacao = class(TJavaGenericImport<JModalidadesTransacaoClass, JModalidadesTransacao>) end;

  JOperacoesClass = interface(JEnumClass)
    ['{D53DAFC8-949B-4674-A9CA-44F47CF94E57}']
    {class} function _GetADMINISTRATIVA: JOperacoes; cdecl;
    {class} function _GetCANCELAMENTO: JOperacoes; cdecl;
    {class} function _GetCANCELAMENTO_PAGAMENTOCONTA: JOperacoes; cdecl;
    {class} function _GetCANCELAMENTO_PREAUTORIZACAO: JOperacoes; cdecl;
    {class} function _GetCONFIGURACAO: JOperacoes; cdecl;
    {class} function _GetCONSULTA_CHEQUE: JOperacoes; cdecl;
    {class} function _GetCONSULTA_SALDO: JOperacoes; cdecl;
    {class} function _GetDOACAO: JOperacoes; cdecl;
    {class} function _GetEXIBE_PDC: JOperacoes; cdecl;
    {class} function _GetFECHAMENTO: JOperacoes; cdecl;
    {class} function _GetGARANTIA_CHEQUE: JOperacoes; cdecl;
    {class} function _GetINSTALACAO: JOperacoes; cdecl;
    {class} function _GetMANUTENCAO: JOperacoes; cdecl;
    {class} function _GetOPERACAO_DESCONHECIDA: JOperacoes; cdecl;
    {class} function _GetPAGAMENTO_CONTA: JOperacoes; cdecl;
    {class} function _GetPREAUTORIZACAO: JOperacoes; cdecl;
    {class} function _GetRECARGA_CELULAR: JOperacoes; cdecl;
    {class} function _GetREIMPRESSAO: JOperacoes; cdecl;
    {class} function _GetRELATORIO_DETALHADO: JOperacoes; cdecl;
    {class} function _GetRELATORIO_RESUMIDO: JOperacoes; cdecl;
    {class} function _GetRELATORIO_SINTETICO: JOperacoes; cdecl;
    {class} function _GetSAQUE: JOperacoes; cdecl;
    {class} function _GetTESTE_COMUNICACAO: JOperacoes; cdecl;
    {class} function _GetVENDA: JOperacoes; cdecl;
    {class} function _GetVERSAO: JOperacoes; cdecl;
    {class} function obtemOperacao(P1: Integer): JOperacoes; cdecl;
    {class} function valueOf(P1: JString): JOperacoes; cdecl;
    {class} function values: TJavaObjectArray<JOperacoes>; cdecl;
    {class} property ADMINISTRATIVA: JOperacoes read _GetADMINISTRATIVA;
    {class} property CANCELAMENTO: JOperacoes read _GetCANCELAMENTO;
    {class} property CANCELAMENTO_PAGAMENTOCONTA: JOperacoes read _GetCANCELAMENTO_PAGAMENTOCONTA;
    {class} property CANCELAMENTO_PREAUTORIZACAO: JOperacoes read _GetCANCELAMENTO_PREAUTORIZACAO;
    {class} property CONFIGURACAO: JOperacoes read _GetCONFIGURACAO;
    {class} property CONSULTA_CHEQUE: JOperacoes read _GetCONSULTA_CHEQUE;
    {class} property CONSULTA_SALDO: JOperacoes read _GetCONSULTA_SALDO;
    {class} property DOACAO: JOperacoes read _GetDOACAO;
    {class} property EXIBE_PDC: JOperacoes read _GetEXIBE_PDC;
    {class} property FECHAMENTO: JOperacoes read _GetFECHAMENTO;
    {class} property GARANTIA_CHEQUE: JOperacoes read _GetGARANTIA_CHEQUE;
    {class} property INSTALACAO: JOperacoes read _GetINSTALACAO;
    {class} property MANUTENCAO: JOperacoes read _GetMANUTENCAO;
    {class} property OPERACAO_DESCONHECIDA: JOperacoes read _GetOPERACAO_DESCONHECIDA;
    {class} property PAGAMENTO_CONTA: JOperacoes read _GetPAGAMENTO_CONTA;
    {class} property PREAUTORIZACAO: JOperacoes read _GetPREAUTORIZACAO;
    {class} property RECARGA_CELULAR: JOperacoes read _GetRECARGA_CELULAR;
    {class} property REIMPRESSAO: JOperacoes read _GetREIMPRESSAO;
    {class} property RELATORIO_DETALHADO: JOperacoes read _GetRELATORIO_DETALHADO;
    {class} property RELATORIO_RESUMIDO: JOperacoes read _GetRELATORIO_RESUMIDO;
    {class} property RELATORIO_SINTETICO: JOperacoes read _GetRELATORIO_SINTETICO;
    {class} property SAQUE: JOperacoes read _GetSAQUE;
    {class} property TESTE_COMUNICACAO: JOperacoes read _GetTESTE_COMUNICACAO;
    {class} property VENDA: JOperacoes read _GetVENDA;
    {class} property VERSAO: JOperacoes read _GetVERSAO;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Operacoes')]
  JOperacoes = interface(JEnum)
    ['{7E3CD7C1-71C0-4AF0-A1F3-0D1C373C1436}']
    function obtemTagOperacao: Integer; cdecl;
  end;
  TJOperacoes = class(TJavaGenericImport<JOperacoesClass, JOperacoes>) end;

  JPersonalizacaoClass = interface(JSerializableClass)
    ['{625E0A07-F806-4AA0-8230-8E8FE7F9ECAF}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Personalizacao')]
  JPersonalizacao = interface(JSerializable)
    ['{94B1F40E-72A9-4CDA-91C9-E3328301DC6A}']
    function obtemCorFonte: JString; cdecl;
    function obtemCorFonteTeclado: JString; cdecl;
    function obtemCorFundoCaixaEdicao: JString; cdecl;
    function obtemCorFundoTeclado: JString; cdecl;
    function obtemCorFundoTela: JString; cdecl;
    function obtemCorFundoToolbar: JString; cdecl;
    function obtemCorSeparadorMenu: JString; cdecl;
    function obtemCorTeclaLiberadaTeclado: JString; cdecl;
    function obtemCorTeclaPressionadaTeclado: JString; cdecl;
    function obtemCorTextoCaixaEdicao: JString; cdecl;
    function obtemFonte: JFile; cdecl;
    function obtemIconeToolbar: JFile; cdecl;
  end;
  TJPersonalizacao = class(TJavaGenericImport<JPersonalizacaoClass, JPersonalizacao>) end;

  JPersonalizacao_1Class = interface(JObjectClass)
    ['{F2407508-70D9-47C1-8652-BCD15DD7B8A6}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Personalizacao$1')]
  JPersonalizacao_1 = interface(JObject)
    ['{E33B574A-5A74-4429-9262-CD4D513DDAAE}']
  end;
  TJPersonalizacao_1 = class(TJavaGenericImport<JPersonalizacao_1Class, JPersonalizacao_1>) end;

  JPersonalizacao_BuilderClass = interface(JObjectClass)
    ['{0D0CF626-0825-41ED-8593-3F6F5F5D9D5D}']
    {class} function init: JPersonalizacao_Builder; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Personalizacao$Builder')]
  JPersonalizacao_Builder = interface(JObject)
    ['{15F3E300-7B7C-4315-A7F5-2B6B2040694D}']
    function build: JPersonalizacao; cdecl;
    function informaCorFonte(P1: JString): JPersonalizacao_Builder; cdecl;
    function informaCorFonteTeclado(P1: JString): JPersonalizacao_Builder; cdecl;
    function informaCorFundoCaixaEdicao(P1: JString): JPersonalizacao_Builder; cdecl;
    function informaCorFundoTeclado(P1: JString): JPersonalizacao_Builder; cdecl;
    function informaCorFundoTela(P1: JString): JPersonalizacao_Builder; cdecl;
    function informaCorFundoToolbar(P1: JString): JPersonalizacao_Builder; cdecl;
    function informaCorSeparadorMenu(P1: JString): JPersonalizacao_Builder; cdecl;
    function informaCorTeclaLiberadaTeclado(P1: JString): JPersonalizacao_Builder; cdecl;
    function informaCorTeclaPressionadaTeclado(P1: JString): JPersonalizacao_Builder; cdecl;
    function informaCorTextoCaixaEdicao(P1: JString): JPersonalizacao_Builder; cdecl;
    function informaFonte(P1: JFile): JPersonalizacao_Builder; cdecl;
    function informaIconeToolbar(P1: JFile): JPersonalizacao_Builder; cdecl;
  end;
  TJPersonalizacao_Builder = class(TJavaGenericImport<JPersonalizacao_BuilderClass, JPersonalizacao_Builder>) end;

  JProvedoresClass = interface(JEnumClass)
    ['{8B759C12-4DEE-4B6A-81B8-34CB7B7FD837}']
    {class} function _GetACCORD: JProvedores; cdecl;
    {class} function _GetALGORIX: JProvedores; cdecl;
    {class} function _GetAMEX: JProvedores; cdecl;
    {class} function _GetBANCREDCARD: JProvedores; cdecl;
    {class} function _GetBANESE: JProvedores; cdecl;
    {class} function _GetBANRISUL: JProvedores; cdecl;
    {class} function _GetCIELO: JProvedores; cdecl;
    {class} function _GetCONDUCTOR: JProvedores; cdecl;
    {class} function _GetCOOPERCRED: JProvedores; cdecl;
    {class} function _GetCREDISHOP: JProvedores; cdecl;
    {class} function _GetELAVON: JProvedores; cdecl;
    {class} function _GetFANCARD: JProvedores; cdecl;
    {class} function _GetFILLIP: JProvedores; cdecl;
    {class} function _GetFIRSTDATA: JProvedores; cdecl;
    {class} function _GetGETNET: JProvedores; cdecl;
    {class} function _GetHIPERCARD: JProvedores; cdecl;
    {class} function _GetLIBERCARD: JProvedores; cdecl;
    {class} function _GetM4U: JProvedores; cdecl;
    {class} function _GetMUXX: JProvedores; cdecl;
    {class} function _GetNEUS: JProvedores; cdecl;
    {class} function _GetORGCARD: JProvedores; cdecl;
    {class} function _GetPOLICARD: JProvedores; cdecl;
    {class} function _GetPREMMIA: JProvedores; cdecl;
    {class} function _GetPREPAG: JProvedores; cdecl;
    {class} function _GetPROVEDOR_DESCONHECIDO: JProvedores; cdecl;
    {class} function _GetREDECARD: JProvedores; cdecl;
    {class} function _GetREPOM: JProvedores; cdecl;
    {class} function _GetRV: JProvedores; cdecl;
    {class} function _GetSENFF: JProvedores; cdecl;
    {class} function _GetTECPOINT: JProvedores; cdecl;
    {class} function _GetTICKETCAR: JProvedores; cdecl;
    {class} function _GetTRICARD: JProvedores; cdecl;
    {class} function _GetVALECARD: JProvedores; cdecl;
    {class} function _GetVERYCARD: JProvedores; cdecl;
    {class} function obtemProvedor(P1: JString): JProvedores; cdecl;
    {class} function valueOf(P1: JString): JProvedores; cdecl;
    {class} function values: TJavaObjectArray<JProvedores>; cdecl;
    {class} property ACCORD: JProvedores read _GetACCORD;
    {class} property ALGORIX: JProvedores read _GetALGORIX;
    {class} property AMEX: JProvedores read _GetAMEX;
    {class} property BANCREDCARD: JProvedores read _GetBANCREDCARD;
    {class} property BANESE: JProvedores read _GetBANESE;
    {class} property BANRISUL: JProvedores read _GetBANRISUL;
    {class} property CIELO: JProvedores read _GetCIELO;
    {class} property CONDUCTOR: JProvedores read _GetCONDUCTOR;
    {class} property COOPERCRED: JProvedores read _GetCOOPERCRED;
    {class} property CREDISHOP: JProvedores read _GetCREDISHOP;
    {class} property ELAVON: JProvedores read _GetELAVON;
    {class} property FANCARD: JProvedores read _GetFANCARD;
    {class} property FILLIP: JProvedores read _GetFILLIP;
    {class} property FIRSTDATA: JProvedores read _GetFIRSTDATA;
    {class} property GETNET: JProvedores read _GetGETNET;
    {class} property HIPERCARD: JProvedores read _GetHIPERCARD;
    {class} property LIBERCARD: JProvedores read _GetLIBERCARD;
    {class} property M4U: JProvedores read _GetM4U;
    {class} property MUXX: JProvedores read _GetMUXX;
    {class} property NEUS: JProvedores read _GetNEUS;
    {class} property ORGCARD: JProvedores read _GetORGCARD;
    {class} property POLICARD: JProvedores read _GetPOLICARD;
    {class} property PREMMIA: JProvedores read _GetPREMMIA;
    {class} property PREPAG: JProvedores read _GetPREPAG;
    {class} property PROVEDOR_DESCONHECIDO: JProvedores read _GetPROVEDOR_DESCONHECIDO;
    {class} property REDECARD: JProvedores read _GetREDECARD;
    {class} property REPOM: JProvedores read _GetREPOM;
    {class} property RV: JProvedores read _GetRV;
    {class} property SENFF: JProvedores read _GetSENFF;
    {class} property TECPOINT: JProvedores read _GetTECPOINT;
    {class} property TICKETCAR: JProvedores read _GetTICKETCAR;
    {class} property TRICARD: JProvedores read _GetTRICARD;
    {class} property VALECARD: JProvedores read _GetVALECARD;
    {class} property VERYCARD: JProvedores read _GetVERYCARD;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Provedores')]
  JProvedores = interface(JEnum)
    ['{F5772CBE-B4B3-482D-BF30-5334E24ADD9E}']
  end;
  TJProvedores = class(TJavaGenericImport<JProvedoresClass, JProvedores>) end;

  JQuedaConexaoTerminalExcecaoClass = interface(JRuntimeExceptionClass)
    ['{B623B28D-F233-4621-A070-C441E3082CF2}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/QuedaConexaoTerminalExcecao')]
  JQuedaConexaoTerminalExcecao = interface(JRuntimeException)
    ['{245891FF-09C9-428F-AF09-08D4A165800A}']
  end;
  TJQuedaConexaoTerminalExcecao = class(TJavaGenericImport<JQuedaConexaoTerminalExcecaoClass, JQuedaConexaoTerminalExcecao>) end;

  JSaidaTransacaoClass = interface(JSerializableClass)
    ['{94848F0F-A7E2-4A9B-A6C4-991588BBB777}']
    {class} function init: JSaidaTransacao; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/SaidaTransacao')]
  JSaidaTransacao = interface(JSerializable)
    ['{E46377BB-1D9F-4261-B347-7F2F5E804800}']
    function comprovanteGraficoDisponivel: Boolean; cdecl;
    function existeTransacaoPendente: Boolean; cdecl;
    function informaAidCartao(P1: JString): JSaidaTransacao; cdecl;
    function informaCodigoAutorizacao(P1: JString): JSaidaTransacao; cdecl;
    function informaCodigoAutorizacaoOriginal(P1: JString): JSaidaTransacao; cdecl;
    function informaCodigoMoeda(P1: JString): JSaidaTransacao; cdecl;
    function informaCodigoRespostaProvedor(P1: JString): JSaidaTransacao; cdecl;
    function informaComprovanteCompleto(P1: JList): JSaidaTransacao; cdecl;
    function informaComprovanteDiferenciadoLoja(P1: JList): JSaidaTransacao; cdecl;
    function informaComprovanteDiferenciadoPortador(P1: JList): JSaidaTransacao; cdecl;
    function informaComprovanteGraficoLojista(P1: JString): JSaidaTransacao; cdecl;
    function informaComprovanteGraficoPortador(P1: JString): JSaidaTransacao; cdecl;
    function informaComprovanteReduzidoPortador(P1: JList): JSaidaTransacao; cdecl;
    procedure informaDadosTransacaoPendente(P1: JTransacaoPendenteDados); cdecl;
    function informaDataHoraTransacao(P1: JDate): JSaidaTransacao; cdecl;
    function informaDataHoraTransacaoOriginal(P1: JDate): JSaidaTransacao; cdecl;
    function informaDataPredatado(P1: JDate): JSaidaTransacao; cdecl;
    function informaDocumentoFiscal(P1: JString): JSaidaTransacao; cdecl;
    function informaExisteComprovanteGrafico(P1: Boolean): JSaidaTransacao; cdecl;
    procedure informaExisteTransacaoPendente(P1: Boolean); cdecl;
    procedure informaIdentificacaoPortadorCarteira(P1: JIdentificacaoPortadorCarteira); cdecl;
    function informaIdentificadorConfirmacaoTransacao(P1: JString): JSaidaTransacao; cdecl;
    function informaIdentificadorEstabelecimento(P1: JString): JSaidaTransacao; cdecl;
    function informaIdentificadorPontoCaptura(P1: JString): JSaidaTransacao; cdecl;
    function informaIdentificadorTransacaoAutomacao(P1: JString): JSaidaTransacao; cdecl;
    function informaMensagemResultado(P1: JString): JSaidaTransacao; cdecl;
    procedure informaModalidadePagamento(P1: JModalidadesPagamento); cdecl;
    procedure informaModalidadeTransacao(P1: JModalidadesTransacao); cdecl;
    function informaModoEntradaCartao(P1: JString): JSaidaTransacao; cdecl;
    function informaModoVerificacaoSenha(P1: JString): JSaidaTransacao; cdecl;
    function informaNomeCartao(P1: JString): JSaidaTransacao; cdecl;
    function informaNomeCartaoPadrao(P1: JString): JSaidaTransacao; cdecl;
    function informaNomeEstabelecimento(P1: JString): JSaidaTransacao; cdecl;
    function informaNomePortadorCartao(P1: JString): JSaidaTransacao; cdecl;
    function informaNomeProvedor(P1: JString): JSaidaTransacao; cdecl;
    function informaNsuHost(P1: JString): JSaidaTransacao; cdecl;
    function informaNsuHostOriginal(P1: JString): JSaidaTransacao; cdecl;
    function informaNsuLocal(P1: JString): JSaidaTransacao; cdecl;
    function informaNsuLocalOriginal(P1: JString): JSaidaTransacao; cdecl;
    function informaNumeroParcelas(P1: Integer): JSaidaTransacao; cdecl;
    function informaOperacao(P1: JOperacoes): JSaidaTransacao; cdecl;
    function informaPanMascarado(P1: JString): JSaidaTransacao; cdecl;
    function informaPanMascaradoPadrao(P1: JString): JSaidaTransacao; cdecl;
    function informaProvedor(P1: JProvedores): JSaidaTransacao; cdecl;
    function informaRequerConfirmacao(P1: Boolean): JSaidaTransacao; cdecl;
    function informaResultadoTransacao(P1: Integer): JSaidaTransacao; cdecl;
    function informaSaldoVoucher(P1: JString): JSaidaTransacao; cdecl;
    function informaTipoCartao(P1: JCartoes): JSaidaTransacao; cdecl;
    function informaTipoFinanciamento(P1: JFinanciamentos): JSaidaTransacao; cdecl;
    procedure informaUniqueID(P1: JString); cdecl;
    function informaValorDesconto(P1: JString): JSaidaTransacao; cdecl;
    function informaValorDevido(P1: JString): JSaidaTransacao; cdecl;
    function informaValorOriginal(P1: JString): JSaidaTransacao; cdecl;
    function informaValorTotal(P1: JString): JSaidaTransacao; cdecl;
    function informaValorTroco(P1: JString): JSaidaTransacao; cdecl;
    function informaViasImprimir(P1: JViasImpressao): JSaidaTransacao; cdecl;
    function obtemAidCartao: JString; cdecl;
    function obtemCodigoAutorizacao: JString; cdecl;
    function obtemCodigoAutorizacaoOriginal: JString; cdecl;
    function obtemCodigoMoeda: JString; cdecl;
    function obtemCodigoRespostaProvedor: JString; cdecl;
    function obtemComprovanteCompleto: JList; cdecl;
    function obtemComprovanteDiferenciadoLoja: JList; cdecl;
    function obtemComprovanteDiferenciadoPortador: JList; cdecl;
    function obtemComprovanteGraficoLojista: JString; cdecl;
    function obtemComprovanteGraficoPortador: JString; cdecl;
    function obtemComprovanteReduzidoPortador: JList; cdecl;
    function obtemDadosTransacaoPendente: JTransacaoPendenteDados; cdecl;
    function obtemDataHoraTransacao: JDate; cdecl;
    function obtemDataHoraTransacaoOriginal: JDate; cdecl;
    function obtemDataPredatado: JDate; cdecl;
    function obtemDocumentoFiscal: JString; cdecl;
    function obtemIdentificacaoPortadorCarteira: JIdentificacaoPortadorCarteira; cdecl;
    function obtemIdentificadorConfirmacaoTransacao: JString; cdecl;
    function obtemIdentificadorEstabelecimento: JString; cdecl;
    function obtemIdentificadorPontoCaptura: JString; cdecl;
    function obtemIdentificadorTransacaoAutomacao: JString; cdecl;
    function obtemInformacaoConfirmacao: Boolean; cdecl;
    function obtemMensagemResultado: JString; cdecl;
    function obtemModalidadePagamento: JModalidadesPagamento; cdecl;
    function obtemModalidadeTransacao: JModalidadesTransacao; cdecl;
    function obtemModoEntradaCartao: JString; cdecl;
    function obtemModoVerificacaoSenha: JString; cdecl;
    function obtemNomeCartao: JString; cdecl;
    function obtemNomeCartaoPadrao: JString; cdecl;
    function obtemNomeEstabelecimento: JString; cdecl;
    function obtemNomePortadorCartao: JString; cdecl;
    function obtemNomeProvedor: JString; cdecl;
    function obtemNsuHost: JString; cdecl;
    function obtemNsuHostOriginal: JString; cdecl;
    function obtemNsuLocal: JString; cdecl;
    function obtemNsuLocalOriginal: JString; cdecl;
    function obtemNumeroParcelas: Integer; cdecl;
    function obtemOperacao: JOperacoes; cdecl;
    function obtemPanMascarado: JString; cdecl;
    function obtemPanMascaradoPadrao: JString; cdecl;
    function obtemProvedor: JProvedores; cdecl;
    function obtemResultadoTransacao: Integer; cdecl;
    function obtemSaldoVoucher: JString; cdecl;
    function obtemTipoCartao: JCartoes; cdecl;
    function obtemTipoFinanciamento: JFinanciamentos; cdecl;
    function obtemUniqueID: JString; cdecl;
    function obtemValorDesconto: JString; cdecl;
    function obtemValorDevido: JString; cdecl;
    function obtemValorOriginal: JString; cdecl;
    function obtemValorTotal: JString; cdecl;
    function obtemValorTroco: JString; cdecl;
    function obtemViasImprimir: JViasImpressao; cdecl;
  end;
  TJSaidaTransacao = class(TJavaGenericImport<JSaidaTransacaoClass, JSaidaTransacao>) end;

  JSenderActivityClass = interface(JActivityClass)
    ['{B8AE64CA-1A62-472B-903D-619B9B3E6E21}']
    {class} function init: JSenderActivity; cdecl;
    {class} function obtemDadosTransacao: JSaidaTransacao; cdecl;
    {class} function obtemVersoes: JVersoes; cdecl;
    {class} function saidaDisponivel: Boolean; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/SenderActivity')]
  JSenderActivity = interface(JActivity)
    ['{3F53F24F-E4CD-498E-887A-C42B2FDF27EC}']
  end;
  TJSenderActivity = class(TJavaGenericImport<JSenderActivityClass, JSenderActivity>) end;

  JStatusTransacaoClass = interface(JEnumClass)
    ['{496633A2-0D44-494D-B022-D0D7BBABB915}']
    {class} function _GetCONFIRMADO_AUTOMATICO: JStatusTransacao; cdecl;
    {class} function _GetCONFIRMADO_MANUAL: JStatusTransacao; cdecl;
    {class} function _GetDESFEITO_ERRO_IMPRESSAO_AUTOMATICO: JStatusTransacao; cdecl;
    {class} function _GetDESFEITO_LIBERACAO_MERCADORIA: JStatusTransacao; cdecl;
    {class} function _GetDESFEITO_MANUAL: JStatusTransacao; cdecl;
    {class} function _GetSTATUS_TRANSACAO_NAO_DEFINIDO: JStatusTransacao; cdecl;
    {class} function valueOf(P1: JString): JStatusTransacao; cdecl;
    {class} function values: TJavaObjectArray<JStatusTransacao>; cdecl;
    {class} property CONFIRMADO_AUTOMATICO: JStatusTransacao read _GetCONFIRMADO_AUTOMATICO;
    {class} property CONFIRMADO_MANUAL: JStatusTransacao read _GetCONFIRMADO_MANUAL;
    {class} property DESFEITO_ERRO_IMPRESSAO_AUTOMATICO: JStatusTransacao read _GetDESFEITO_ERRO_IMPRESSAO_AUTOMATICO;
    {class} property DESFEITO_LIBERACAO_MERCADORIA: JStatusTransacao read _GetDESFEITO_LIBERACAO_MERCADORIA;
    {class} property DESFEITO_MANUAL: JStatusTransacao read _GetDESFEITO_MANUAL;
    {class} property STATUS_TRANSACAO_NAO_DEFINIDO: JStatusTransacao read _GetSTATUS_TRANSACAO_NAO_DEFINIDO;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/StatusTransacao')]
  JStatusTransacao = interface(JEnum)
    ['{678E20E1-68E6-4A84-8E46-C23B95001EDD}']
  end;
  TJStatusTransacao = class(TJavaGenericImport<JStatusTransacaoClass, JStatusTransacao>) end;

  JTerminalClass = interface(JObjectClass)
    ['{8457D269-A3E9-4093-910B-90E558B77D05}']
    {class} function init: JTerminal; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Terminal')]
  JTerminal = interface(JObject)
    ['{FCD44691-9E62-41A7-83BB-BD799901BABE}']
    function obtemEnderecoMAC: JString; cdecl;
    function obtemModeloTerminal: JString; cdecl;
    function obtemNumeroSerie: JString; cdecl;
    function obtemVersaoAplicacaoTerminal: JString; cdecl;
  end;
  TJTerminal = class(TJavaGenericImport<JTerminalClass, JTerminal>) end;

  JTerminalDesconectadoExcecaoClass = interface(JExceptionClass)
    ['{1585F767-DEF0-4224-A579-2C04DDE37CD0}']
    {class} function init: JTerminalDesconectadoExcecao; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/TerminalDesconectadoExcecao')]
  JTerminalDesconectadoExcecao = interface(JException)
    ['{B991DEB8-E060-49BC-9F30-89404B73FAF7}']
  end;
  TJTerminalDesconectadoExcecao = class(TJavaGenericImport<JTerminalDesconectadoExcecaoClass, JTerminalDesconectadoExcecao>) end;

  JTerminalNaoConfiguradoExcecaoClass = interface(JExceptionClass)
    ['{037E69F9-CD18-47B7-B9CE-742FA90B3AF0}']
    {class} function init: JTerminalNaoConfiguradoExcecao; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/TerminalNaoConfiguradoExcecao')]
  JTerminalNaoConfiguradoExcecao = interface(JException)
    ['{C86D6AE5-ED88-44E3-B529-76949456F52E}']
  end;
  TJTerminalNaoConfiguradoExcecao = class(TJavaGenericImport<JTerminalNaoConfiguradoExcecaoClass, JTerminalNaoConfiguradoExcecao>) end;

  JTransacaoClass = interface(IJavaClass)
    ['{5CB81FFD-90AB-4357-B563-ED5ABF05750B}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Transacao')]
  JTransacao = interface(IJavaInstance)
    ['{ADDF6DE9-1944-4673-A588-C74C1C21DA5F}']
    procedure confirmaTransacao(P1: JConfirmacao); cdecl;
    function realizaTransacao(P1: JEntradaTransacao): JSaidaTransacao; cdecl;
    procedure resolvePendencia(P1: JTransacaoPendenteDados; P2: JConfirmacao); cdecl;
  end;
  TJTransacao = class(TJavaGenericImport<JTransacaoClass, JTransacao>) end;

  JTransacaoPendenteDadosClass = interface(JSerializableClass)
    ['{970B0DC4-96C2-4DDE-8F22-E8716007D11D}']
    {class} function init: JTransacaoPendenteDados; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/TransacaoPendenteDados')]
  JTransacaoPendenteDados = interface(JSerializable)
    ['{F01FAB79-47EC-471D-83E2-7DC33488A922}']
    procedure informaIdentificadorEstabelecimento(P1: JString); cdecl;
    procedure informaNomeProvedor(P1: JString); cdecl;
    procedure informaNsuHost(P1: JString); cdecl;
    procedure informaNsuLocal(P1: JString); cdecl;
    procedure informaNsuTransacao(P1: JString); cdecl;
    procedure informaProvedor(P1: JProvedores); cdecl;
    function obtemIdentificadorEstabelecimento: JString; cdecl;
    function obtemNomeProvedor: JString; cdecl;
    function obtemNsuHost: JString; cdecl;
    function obtemNsuLocal: JString; cdecl;
    function obtemNsuTransacao: JString; cdecl;
    function obtemProvedor: JProvedores; cdecl;
    function toString: JString; cdecl;
  end;
  TJTransacaoPendenteDados = class(TJavaGenericImport<JTransacaoPendenteDadosClass, JTransacaoPendenteDados>) end;

  JTransacoesClass = interface(JTransacaoClass)
    ['{727E46C6-33A5-4E4F-8E6C-B7D381B458F9}']
    {class} function obtemInstancia(P1: JDadosAutomacao; P2: JContext): JTransacoes; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Transacoes')]
  JTransacoes = interface(JTransacao)
    ['{EE661455-A9F7-4B5F-94D1-54DE392F3807}']
    procedure confirmaTransacao(P1: JConfirmacao); cdecl;
    function obtemVersoes: JVersoes; cdecl;
    function realizaTransacao(P1: JEntradaTransacao): JSaidaTransacao; cdecl;
    procedure resolvePendencia(P1: JTransacaoPendenteDados; P2: JConfirmacao); cdecl;
  end;
  TJTransacoes = class(TJavaGenericImport<JTransacoesClass, JTransacoes>) end;

  JTransacoes_1Class = interface(JObjectClass)
    ['{8C34DA53-0C6B-427E-8491-A957895AD8AB}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Transacoes$1')]
  JTransacoes_1 = interface(JObject)
    ['{AA831B74-EB2C-4BFA-8B09-8CD4D6F1681C}']
  end;
  TJTransacoes_1 = class(TJavaGenericImport<JTransacoes_1Class, JTransacoes_1>) end;

  JTransacoes_TransacaoResultReceiverClass = interface(JResultReceiverClass)
    ['{546FC2FE-1965-49A8-B395-F08DC46D7090}']
    {class} function init(P1: JTransacoes; P2: JHandler; P3: JTransacoes_1): JTransacoes_TransacaoResultReceiver; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Transacoes$TransacaoResultReceiver')]
  JTransacoes_TransacaoResultReceiver = interface(JResultReceiver)
    ['{D2255CCB-0351-40D3-A118-AC63CF6B6C48}']
    procedure onReceiveResult(P1: Integer; P2: JBundle); cdecl;
  end;
  TJTransacoes_TransacaoResultReceiver = class(TJavaGenericImport<JTransacoes_TransacaoResultReceiverClass, JTransacoes_TransacaoResultReceiver>) end;

  JVersoesClass = interface(JObjectClass)
    ['{A9C67844-2FD5-47A8-A7A3-39169C05BB85}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/Versoes')]
  JVersoes = interface(JObject)
    ['{3A7E5283-C782-47D1-AA4F-BAD5AD233B91}']
    function obtemVersaoApk: JMap; cdecl;
    function obtemVersaoBiblioteca: JString; cdecl;
  end;
  TJVersoes = class(TJavaGenericImport<JVersoesClass, JVersoes>) end;

  JViasImpressaoClass = interface(JEnumClass)
    ['{613BF0B6-2988-4C1E-9077-25F3F75FF4E1}']
    {class} function _GetVIA_CLIENTE: JViasImpressao; cdecl;
    {class} function _GetVIA_CLIENTE_E_ESTABELECIMENTO: JViasImpressao; cdecl;
    {class} function _GetVIA_ESTABELECIMENTO: JViasImpressao; cdecl;
    {class} function _GetVIA_NENHUMA: JViasImpressao; cdecl;
    {class} function obtemViaImpressao(P1: Integer): JViasImpressao; cdecl;
    {class} function valueOf(P1: JString): JViasImpressao; cdecl;
    {class} function values: TJavaObjectArray<JViasImpressao>; cdecl;
    {class} property VIA_CLIENTE: JViasImpressao read _GetVIA_CLIENTE;
    {class} property VIA_CLIENTE_E_ESTABELECIMENTO: JViasImpressao read _GetVIA_CLIENTE_E_ESTABELECIMENTO;
    {class} property VIA_ESTABELECIMENTO: JViasImpressao read _GetVIA_ESTABELECIMENTO;
    {class} property VIA_NENHUMA: JViasImpressao read _GetVIA_NENHUMA;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/ViasImpressao')]
  JViasImpressao = interface(JEnum)
    ['{861F8398-3103-405B-8E15-69F8362EE27F}']
    function obtemTipoViaImpressao: Integer; cdecl;
  end;
  TJViasImpressao = class(TJavaGenericImport<JViasImpressaoClass, JViasImpressao>) end;

  JCustomizationClass = interface(IJavaClass)
    ['{D5008A7B-E7AC-4892-9AC4-948F28079373}']
    {class} function _GetEDITBOX_BACKGROUND_COLOR: JString; cdecl;
    {class} function _GetEDITBOX_COLOR_TEXT: JString; cdecl;
    {class} function _GetFONT: JString; cdecl;
    {class} function _GetFONT_COLOR: JString; cdecl;
    {class} function _GetKEYBOARD_BACKGROUND_COLOR: JString; cdecl;
    {class} function _GetKEYBOARD_FONT_COLOR: JString; cdecl;
    {class} function _GetMENU_SEPARATOR_COLOR: JString; cdecl;
    {class} function _GetPRESSED_KEY_COLOR: JString; cdecl;
    {class} function _GetRELEASED_KEY_COLOR: JString; cdecl;
    {class} function _GetSCREEN_BACKGROUND_COLOR: JString; cdecl;
    {class} function _GetTOOLBAR_BACKGROUND: JString; cdecl;
    {class} function _GetTOOLBAR_ICON: JString; cdecl;
    {class} property EDITBOX_BACKGROUND_COLOR: JString read _GetEDITBOX_BACKGROUND_COLOR;
    {class} property EDITBOX_COLOR_TEXT: JString read _GetEDITBOX_COLOR_TEXT;
    {class} property FONT: JString read _GetFONT;
    {class} property FONT_COLOR: JString read _GetFONT_COLOR;
    {class} property KEYBOARD_BACKGROUND_COLOR: JString read _GetKEYBOARD_BACKGROUND_COLOR;
    {class} property KEYBOARD_FONT_COLOR: JString read _GetKEYBOARD_FONT_COLOR;
    {class} property MENU_SEPARATOR_COLOR: JString read _GetMENU_SEPARATOR_COLOR;
    {class} property PRESSED_KEY_COLOR: JString read _GetPRESSED_KEY_COLOR;
    {class} property RELEASED_KEY_COLOR: JString read _GetRELEASED_KEY_COLOR;
    {class} property SCREEN_BACKGROUND_COLOR: JString read _GetSCREEN_BACKGROUND_COLOR;
    {class} property TOOLBAR_BACKGROUND: JString read _GetTOOLBAR_BACKGROUND;
    {class} property TOOLBAR_ICON: JString read _GetTOOLBAR_ICON;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/espec/Customization')]
  JCustomization = interface(IJavaInstance)
    ['{4594103F-A647-4C3A-BEF0-DE4D86D62C77}']
  end;
  TJCustomization = class(TJavaGenericImport<JCustomizationClass, JCustomization>) end;

  JTransactionInputClass = interface(IJavaClass)
    ['{B0D129AD-188E-4AF6-B109-433BFB76FB82}']
    {class} function _GetACQUIRER: JString; cdecl;
    {class} function _GetADD_POSDATA1: JString; cdecl;
    {class} function _GetADD_POSDATA2: JString; cdecl;
    {class} function _GetADD_POSDATA3: JString; cdecl;
    {class} function _GetADD_POSDATA4: JString; cdecl;
    {class} function _GetAMOUNT: JString; cdecl;
    {class} function _GetBOARDING_TAX: JString; cdecl;
    {class} function _GetCARD_TYPE: JString; cdecl;
    {class} function _GetCURRENCY_CODE: JString; cdecl;
    {class} function _GetFIN_TYPE: JString; cdecl;
    {class} function _GetFISCAL_DOC: JString; cdecl;
    {class} function _GetINPUT: JString; cdecl;
    {class} function _GetINSTALLMENTS: JString; cdecl;
    {class} function _GetINVOICE_NUMBER: JString; cdecl;
    {class} function _GetOPERATION: JString; cdecl;
    {class} function _GetORIG_AUTHCODE: JString; cdecl;
    {class} function _GetORIG_DATETIME: JString; cdecl;
    {class} function _GetORIG_NSU: JString; cdecl;
    {class} function _GetPAY_MODE: JString; cdecl;
    {class} function _GetPOSTDATED_DATE: JString; cdecl;
    {class} function _GetPOS_ID: JString; cdecl;
    {class} function _GetSERVICE_TAX: JString; cdecl;
    {class} function _GetTAX_ID: JString; cdecl;
    {class} function _GetTEL_NUMBER: JString; cdecl;
    {class} property ACQUIRER: JString read _GetACQUIRER;
    {class} property ADD_POSDATA1: JString read _GetADD_POSDATA1;
    {class} property ADD_POSDATA2: JString read _GetADD_POSDATA2;
    {class} property ADD_POSDATA3: JString read _GetADD_POSDATA3;
    {class} property ADD_POSDATA4: JString read _GetADD_POSDATA4;
    {class} property AMOUNT: JString read _GetAMOUNT;
    {class} property BOARDING_TAX: JString read _GetBOARDING_TAX;
    {class} property CARD_TYPE: JString read _GetCARD_TYPE;
    {class} property CURRENCY_CODE: JString read _GetCURRENCY_CODE;
    {class} property FIN_TYPE: JString read _GetFIN_TYPE;
    {class} property FISCAL_DOC: JString read _GetFISCAL_DOC;
    {class} property INPUT: JString read _GetINPUT;
    {class} property INSTALLMENTS: JString read _GetINSTALLMENTS;
    {class} property INVOICE_NUMBER: JString read _GetINVOICE_NUMBER;
    {class} property OPERATION: JString read _GetOPERATION;
    {class} property ORIG_AUTHCODE: JString read _GetORIG_AUTHCODE;
    {class} property ORIG_DATETIME: JString read _GetORIG_DATETIME;
    {class} property ORIG_NSU: JString read _GetORIG_NSU;
    {class} property PAY_MODE: JString read _GetPAY_MODE;
    {class} property POSTDATED_DATE: JString read _GetPOSTDATED_DATE;
    {class} property POS_ID: JString read _GetPOS_ID;
    {class} property SERVICE_TAX: JString read _GetSERVICE_TAX;
    {class} property TAX_ID: JString read _GetTAX_ID;
    {class} property TEL_NUMBER: JString read _GetTEL_NUMBER;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/espec/TransactionInput')]
  JTransactionInput = interface(IJavaInstance)
    ['{75EC7AEC-4170-4D4D-A536-9C30FEC3572C}']
  end;
  TJTransactionInput = class(TJavaGenericImport<JTransactionInputClass, JTransactionInput>) end;

  JTransactionOutputClass = interface(IJavaClass)
    ['{21C0B3EE-EA25-4F4E-A97A-4D4FCCF83FB1}']
    {class} function _GetAMOUNT: JString; cdecl;
    {class} function _GetAUTHORIZATION_CODE: JString; cdecl;
    {class} function _GetBALANCE_VOUCHER: JString; cdecl;
    {class} function _GetCARD_AID: JString; cdecl;
    {class} function _GetCARD_ENTRANCE_MODE: JString; cdecl;
    {class} function _GetCARD_HOLDER_NAME: JString; cdecl;
    {class} function _GetCARD_NAME: JString; cdecl;
    {class} function _GetCARD_TYPE: JString; cdecl;
    {class} function _GetCHANGE: JString; cdecl;
    {class} function _GetCONFIRM_TRANSACTION_IDENTIFIER: JString; cdecl;
    {class} function _GetCURRENCY_CODE: JString; cdecl;
    {class} function _GetDATE_TIME_ORIGINAL_TRANSACTION: JString; cdecl;
    {class} function _GetDATE_TIME_TRANSACTION: JString; cdecl;
    {class} function _GetDIFFERENTIATED_HOLDER_VOUCHER: JString; cdecl;
    {class} function _GetDIFFERENTIATED_SHOP_VOUCHER: JString; cdecl;
    {class} function _GetDISCOUNT: JString; cdecl;
    {class} function _GetDUE_AMOUNT: JString; cdecl;
    {class} function _GetESTABLISHMENT_IDENTIFIER: JString; cdecl;
    {class} function _GetESTABLISHMENT_NAME: JString; cdecl;
    {class} function _GetFINANCING_TYPE: JString; cdecl;
    {class} function _GetFISCAL_DOCUMENT: JString; cdecl;
    {class} function _GetFULL_VOUCHER: JString; cdecl;
    {class} function _GetGRAPHIC_RECEIPT_EXISTS: JString; cdecl;
    {class} function _GetHOLDER_GRAPHIC_RECEIPT: JString; cdecl;
    {class} function _GetMASKED_PAN: JString; cdecl;
    {class} function _GetNETWORK_RESPONSE: JString; cdecl;
    {class} function _GetNSU_ORIGINAL_TRANSACTION: JString; cdecl;
    {class} function _GetNUMBER_OF_INSTALLMENTS: JString; cdecl;
    {class} function _GetONOFF: JString; cdecl;
    {class} function _GetOPERATION: JString; cdecl;
    {class} function _GetORIGINAL_AUTHORIZATION_CODE: JString; cdecl;
    {class} function _GetORIGINAL_TERMINAL_NSU: JString; cdecl;
    {class} function _GetORIGINAL_VALUE: JString; cdecl;
    {class} function _GetOUTPUT: JString; cdecl;
    {class} function _GetPASSWORD_VERIFICATION_MODE: JString; cdecl;
    {class} function _GetPAY_MODE: JString; cdecl;
    {class} function _GetPENDING_TRANSACTION_DATA: JString; cdecl;
    {class} function _GetPENDING_TRANSACTION_EXISTS: JString; cdecl;
    {class} function _GetPOINT_OF_SALE_IDENTIFIER: JString; cdecl;
    {class} function _GetPREDATED_DATE: JString; cdecl;
    {class} function _GetPRINT_RECEIPTS: JString; cdecl;
    {class} function _GetPROVIDER: JString; cdecl;
    {class} function _GetPROVIDER_NAME: JString; cdecl;
    {class} function _GetREDUCED_HOLDER_VOUCHER: JString; cdecl;
    {class} function _GetREQUIRES_CONFIRMATION: JString; cdecl;
    {class} function _GetRESULT_MESSAGE: JString; cdecl;
    {class} function _GetSTANDARD_CARD_NAME: JString; cdecl;
    {class} function _GetSTANDARD_MASKED_PAN: JString; cdecl;
    {class} function _GetSTORE_KEEPER_GRAPHIC_RECEIPT: JString; cdecl;
    {class} function _GetTERMINAL_NSU: JString; cdecl;
    {class} function _GetTRANSACTION_IDENTIFIER: JString; cdecl;
    {class} function _GetTRANSACTION_NSU: JString; cdecl;
    {class} function _GetTRANSACTION_RESULT: JString; cdecl;
    {class} function _GetUNIQUE_ID: JString; cdecl;
    {class} function _GetWALLET_USER_ID: JString; cdecl;
    {class} property AMOUNT: JString read _GetAMOUNT;
    {class} property AUTHORIZATION_CODE: JString read _GetAUTHORIZATION_CODE;
    {class} property BALANCE_VOUCHER: JString read _GetBALANCE_VOUCHER;
    {class} property CARD_AID: JString read _GetCARD_AID;
    {class} property CARD_ENTRANCE_MODE: JString read _GetCARD_ENTRANCE_MODE;
    {class} property CARD_HOLDER_NAME: JString read _GetCARD_HOLDER_NAME;
    {class} property CARD_NAME: JString read _GetCARD_NAME;
    {class} property CARD_TYPE: JString read _GetCARD_TYPE;
    {class} property CHANGE: JString read _GetCHANGE;
    {class} property CONFIRM_TRANSACTION_IDENTIFIER: JString read _GetCONFIRM_TRANSACTION_IDENTIFIER;
    {class} property CURRENCY_CODE: JString read _GetCURRENCY_CODE;
    {class} property DATE_TIME_ORIGINAL_TRANSACTION: JString read _GetDATE_TIME_ORIGINAL_TRANSACTION;
    {class} property DATE_TIME_TRANSACTION: JString read _GetDATE_TIME_TRANSACTION;
    {class} property DIFFERENTIATED_HOLDER_VOUCHER: JString read _GetDIFFERENTIATED_HOLDER_VOUCHER;
    {class} property DIFFERENTIATED_SHOP_VOUCHER: JString read _GetDIFFERENTIATED_SHOP_VOUCHER;
    {class} property DISCOUNT: JString read _GetDISCOUNT;
    {class} property DUE_AMOUNT: JString read _GetDUE_AMOUNT;
    {class} property ESTABLISHMENT_IDENTIFIER: JString read _GetESTABLISHMENT_IDENTIFIER;
    {class} property ESTABLISHMENT_NAME: JString read _GetESTABLISHMENT_NAME;
    {class} property FINANCING_TYPE: JString read _GetFINANCING_TYPE;
    {class} property FISCAL_DOCUMENT: JString read _GetFISCAL_DOCUMENT;
    {class} property FULL_VOUCHER: JString read _GetFULL_VOUCHER;
    {class} property GRAPHIC_RECEIPT_EXISTS: JString read _GetGRAPHIC_RECEIPT_EXISTS;
    {class} property HOLDER_GRAPHIC_RECEIPT: JString read _GetHOLDER_GRAPHIC_RECEIPT;
    {class} property MASKED_PAN: JString read _GetMASKED_PAN;
    {class} property NETWORK_RESPONSE: JString read _GetNETWORK_RESPONSE;
    {class} property NSU_ORIGINAL_TRANSACTION: JString read _GetNSU_ORIGINAL_TRANSACTION;
    {class} property NUMBER_OF_INSTALLMENTS: JString read _GetNUMBER_OF_INSTALLMENTS;
    {class} property ONOFF: JString read _GetONOFF;
    {class} property OPERATION: JString read _GetOPERATION;
    {class} property ORIGINAL_AUTHORIZATION_CODE: JString read _GetORIGINAL_AUTHORIZATION_CODE;
    {class} property ORIGINAL_TERMINAL_NSU: JString read _GetORIGINAL_TERMINAL_NSU;
    {class} property ORIGINAL_VALUE: JString read _GetORIGINAL_VALUE;
    {class} property OUTPUT: JString read _GetOUTPUT;
    {class} property PASSWORD_VERIFICATION_MODE: JString read _GetPASSWORD_VERIFICATION_MODE;
    {class} property PAY_MODE: JString read _GetPAY_MODE;
    {class} property PENDING_TRANSACTION_DATA: JString read _GetPENDING_TRANSACTION_DATA;
    {class} property PENDING_TRANSACTION_EXISTS: JString read _GetPENDING_TRANSACTION_EXISTS;
    {class} property POINT_OF_SALE_IDENTIFIER: JString read _GetPOINT_OF_SALE_IDENTIFIER;
    {class} property PREDATED_DATE: JString read _GetPREDATED_DATE;
    {class} property PRINT_RECEIPTS: JString read _GetPRINT_RECEIPTS;
    {class} property PROVIDER: JString read _GetPROVIDER;
    {class} property PROVIDER_NAME: JString read _GetPROVIDER_NAME;
    {class} property REDUCED_HOLDER_VOUCHER: JString read _GetREDUCED_HOLDER_VOUCHER;
    {class} property REQUIRES_CONFIRMATION: JString read _GetREQUIRES_CONFIRMATION;
    {class} property RESULT_MESSAGE: JString read _GetRESULT_MESSAGE;
    {class} property STANDARD_CARD_NAME: JString read _GetSTANDARD_CARD_NAME;
    {class} property STANDARD_MASKED_PAN: JString read _GetSTANDARD_MASKED_PAN;
    {class} property STORE_KEEPER_GRAPHIC_RECEIPT: JString read _GetSTORE_KEEPER_GRAPHIC_RECEIPT;
    {class} property TERMINAL_NSU: JString read _GetTERMINAL_NSU;
    {class} property TRANSACTION_IDENTIFIER: JString read _GetTRANSACTION_IDENTIFIER;
    {class} property TRANSACTION_NSU: JString read _GetTRANSACTION_NSU;
    {class} property TRANSACTION_RESULT: JString read _GetTRANSACTION_RESULT;
    {class} property UNIQUE_ID: JString read _GetUNIQUE_ID;
    {class} property WALLET_USER_ID: JString read _GetWALLET_USER_ID;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/espec/TransactionOutput')]
  JTransactionOutput = interface(IJavaInstance)
    ['{2D3CF798-A2DC-4C14-BD00-E66FAB93A27D}']
  end;
  TJTransactionOutput = class(TJavaGenericImport<JTransactionOutputClass, JTransactionOutput>) end;

  JDateParserClass = interface(JObjectClass)
    ['{A63FDF7C-1B87-4BD3-9D17-F867DCB11A76}']
    {class} function date2String(P1: JDate): JString; cdecl;
    {class} function init: JDateParser; cdecl;
    {class} function string2Date(P1: JString): JDate; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/DateParser')]
  JDateParser = interface(JObject)
    ['{649DE438-E219-47B5-ABB2-47E16F090C3F}']
  end;
  TJDateParser = class(TJavaGenericImport<JDateParserClass, JDateParser>) end;

  JEnumTypeClass = interface(JObjectClass)
    ['{F7E3591E-50BB-447D-815E-F47D446720DD}']
    {class} function _GetTYPE_NAME: Integer; cdecl;
    {class} function _GetTYPE_ORDINAL: Integer; cdecl;
    {class} function _GetTYPE_VALUE: Integer; cdecl;
    {class} function init: JEnumType; cdecl;
    {class} property TYPE_NAME: Integer read _GetTYPE_NAME;
    {class} property TYPE_ORDINAL: Integer read _GetTYPE_ORDINAL;
    {class} property TYPE_VALUE: Integer read _GetTYPE_VALUE;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/EnumType')]
  JEnumType = interface(JObject)
    ['{1EF9B6F7-20EF-4EF3-8240-BF3DC5ECC448}']
  end;
  TJEnumType = class(TJavaGenericImport<JEnumTypeClass, JEnumType>) end;

  JInputParserClass = interface(JObjectClass)
    ['{8906F83E-7BA9-4626-97DB-1FF8C841F944}']
    {class} function init(P1: JString; P2: JString): JInputParser; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/InputParser')]
  JInputParser = interface(JObject)
    ['{8F3B917E-6F01-446C-9ECF-2C66EC72544E}']
    procedure addObject(P1: JObject); cdecl;
    procedure addParameter(P1: JString; P2: JString); cdecl;
    procedure addPath(P1: JString); cdecl;
    function toString: JString; cdecl;
  end;
  TJInputParser = class(TJavaGenericImport<JInputParserClass, JInputParser>) end;

  JOutputParserClass = interface(JObjectClass)
    ['{ADE85753-19E0-4863-9147-8A143972C676}']
    {class} function init(P1: JString): JOutputParser; cdecl;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/OutputParser')]
  JOutputParser = interface(JObject)
    ['{95ADAFAC-FFD2-44DB-AD38-7C869E9D9C72}']
    function getObject(P1: Jlang_Class): JObject; cdecl; overload;
    function getObject(P1: Jlang_Class; P2: JObject): JObject; cdecl; overload;
  end;
  TJOutputParser = class(TJavaGenericImport<JOutputParserClass, JOutputParser>) end;

  Jparser_ParseExceptionClass = interface(JExceptionClass)
    ['{F2940B09-CBEA-4BD0-A432-4569D8051119}']
    {class} function init: Jparser_ParseException; cdecl; overload;
    {class} function init(P1: JThrowable): Jparser_ParseException; cdecl; overload;
    {class} function init(P1: JString): Jparser_ParseException; cdecl; overload;
    {class} function init(P1: JString; P2: JThrowable): Jparser_ParseException; cdecl; overload;
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/ParseException')]
  Jparser_ParseException = interface(JException)
    ['{138DC007-EEE4-476A-8F22-DA2B46436127}']
  end;
  TJparser_ParseException = class(TJavaGenericImport<Jparser_ParseExceptionClass, Jparser_ParseException>) end;

  JUriArrayFieldNameClass = interface(JAnnotationClass)
    ['{8100FD2B-6D6E-49B1-9A74-145844BC769C}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/UriArrayFieldName')]
  JUriArrayFieldName = interface(JAnnotation)
    ['{98ED5FCE-C61A-46AB-B78D-A44679916427}']
    function value: JString; cdecl;
  end;
  TJUriArrayFieldName = class(TJavaGenericImport<JUriArrayFieldNameClass, JUriArrayFieldName>) end;

  Jparser_UriClassClass = interface(JAnnotationClass)
    ['{60D284BB-E37A-4BE4-AB37-84CA9EF08285}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/UriClass')]
  Jparser_UriClass = interface(JAnnotation)
    ['{32A1E313-17F0-444D-9A96-9069AF4FEC43}']
    function value: JString; cdecl;
  end;
  TJparser_UriClass = class(TJavaGenericImport<Jparser_UriClassClass, Jparser_UriClass>) end;

  JUriCustomizeFieldNameClass = interface(JAnnotationClass)
    ['{0154F42F-D606-4DC6-A8B8-B3559CAD162F}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/UriCustomizeFieldName')]
  JUriCustomizeFieldName = interface(JAnnotation)
    ['{EBCCF7C8-9F25-4059-8BB9-7EE521FC0716}']
    function value: JString; cdecl;
  end;
  TJUriCustomizeFieldName = class(TJavaGenericImport<JUriCustomizeFieldNameClass, JUriCustomizeFieldName>) end;

  JUriDateFieldNameClass = interface(JAnnotationClass)
    ['{56E7BCFF-FA6D-462A-8472-AF608AD0E72A}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/UriDateFieldName')]
  JUriDateFieldName = interface(JAnnotation)
    ['{6AB3486F-37AC-4FB6-BAC6-4C5A197EA000}']
    function value: JString; cdecl;
  end;
  TJUriDateFieldName = class(TJavaGenericImport<JUriDateFieldNameClass, JUriDateFieldName>) end;

  JUriEnumFieldNameClass = interface(JAnnotationClass)
    ['{58217AA4-5E21-419D-9FCF-5B3A3E526280}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/UriEnumFieldName')]
  JUriEnumFieldName = interface(JAnnotation)
    ['{E822B658-F9BD-4DCC-AFA1-79D0E718BE76}']
    function value: JString; cdecl;
  end;
  TJUriEnumFieldName = class(TJavaGenericImport<JUriEnumFieldNameClass, JUriEnumFieldName>) end;

  JUriFileFieldNameClass = interface(JAnnotationClass)
    ['{398EAABE-C3F9-44A9-801C-3887296AECB1}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/UriFileFieldName')]
  JUriFileFieldName = interface(JAnnotation)
    ['{8C6BEFC1-0C46-4C5E-B5EF-87F62B873903}']
    function value: JString; cdecl;
  end;
  TJUriFileFieldName = class(TJavaGenericImport<JUriFileFieldNameClass, JUriFileFieldName>) end;

  JUriMethodNameClass = interface(JAnnotationClass)
    ['{14D42E09-4150-45AF-8B17-943698C145F3}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/UriMethodName')]
  JUriMethodName = interface(JAnnotation)
    ['{A06B0DEB-1269-41EF-AA54-C5A32D47987D}']
    function json: TJavaObjectArray<Jparser_UriClass>; cdecl;
  end;
  TJUriMethodName = class(TJavaGenericImport<JUriMethodNameClass, JUriMethodName>) end;

  JUriObjectFieldNameClass = interface(JAnnotationClass)
    ['{312A4D87-AB0A-4A9A-8B5E-E1E901422E00}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/UriObjectFieldName')]
  JUriObjectFieldName = interface(JAnnotation)
    ['{AA0E10A2-9B06-437D-9DD5-D17D7048D1C0}']
    function value: JString; cdecl;
  end;
  TJUriObjectFieldName = class(TJavaGenericImport<JUriObjectFieldNameClass, JUriObjectFieldName>) end;

  JUriPrimitiveFieldNameClass = interface(JAnnotationClass)
    ['{86D238E4-1348-4E01-812C-971D600054E8}']
  end;

  [JavaSignature('br/com/setis/interfaceautomacao/parser/UriPrimitiveFieldName')]
  JUriPrimitiveFieldName = interface(JAnnotation)
    ['{4B71C2E7-6BDD-466A-8A57-C2095E7C4EE5}']
    function value: JString; cdecl;
  end;
  TJUriPrimitiveFieldName = class(TJavaGenericImport<JUriPrimitiveFieldNameClass, JUriPrimitiveFieldName>) end;

implementation

procedure RegisterTypes;
begin
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JAnimator', TypeInfo(Elgin.JNI.InterfaceAutomacao.JAnimator));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JAnimator_AnimatorListener', TypeInfo(Elgin.JNI.InterfaceAutomacao.JAnimator_AnimatorListener));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JAnimator_AnimatorPauseListener', TypeInfo(Elgin.JNI.InterfaceAutomacao.JAnimator_AnimatorPauseListener));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JKeyframe', TypeInfo(Elgin.JNI.InterfaceAutomacao.JKeyframe));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JLayoutTransition', TypeInfo(Elgin.JNI.InterfaceAutomacao.JLayoutTransition));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JLayoutTransition_TransitionListener', TypeInfo(Elgin.JNI.InterfaceAutomacao.JLayoutTransition_TransitionListener));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JPropertyValuesHolder', TypeInfo(Elgin.JNI.InterfaceAutomacao.JPropertyValuesHolder));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JStateListAnimator', TypeInfo(Elgin.JNI.InterfaceAutomacao.JStateListAnimator));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTimeInterpolator', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTimeInterpolator));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTypeConverter', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTypeConverter));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTypeEvaluator', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTypeEvaluator));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JValueAnimator', TypeInfo(Elgin.JNI.InterfaceAutomacao.JValueAnimator));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JValueAnimator_AnimatorUpdateListener', TypeInfo(Elgin.JNI.InterfaceAutomacao.JValueAnimator_AnimatorUpdateListener));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JPathMotion', TypeInfo(Elgin.JNI.InterfaceAutomacao.JPathMotion));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JScene', TypeInfo(Elgin.JNI.InterfaceAutomacao.JScene));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransition', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransition));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransition_EpicenterCallback', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransition_EpicenterCallback));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransition_TransitionListener', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransition_TransitionListener));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransitionManager', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransitionManager));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransitionPropagation', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransitionPropagation));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransitionValues', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransitionValues));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JInterpolator', TypeInfo(Elgin.JNI.InterfaceAutomacao.JInterpolator));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JToolbar_LayoutParams', TypeInfo(Elgin.JNI.InterfaceAutomacao.JToolbar_LayoutParams));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JAplicacaoNaoInstaladaExcecao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JAplicacaoNaoInstaladaExcecao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.Jinterfaceautomacao_BuildConfig', TypeInfo(Elgin.JNI.InterfaceAutomacao.Jinterfaceautomacao_BuildConfig));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JCartoes', TypeInfo(Elgin.JNI.InterfaceAutomacao.JCartoes));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JComunicacaoServico', TypeInfo(Elgin.JNI.InterfaceAutomacao.JComunicacaoServico));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JComunicacaoServico_IncomingHandler', TypeInfo(Elgin.JNI.InterfaceAutomacao.JComunicacaoServico_IncomingHandler));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JConfirmacao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JConfirmacao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JConfirmacoes', TypeInfo(Elgin.JNI.InterfaceAutomacao.JConfirmacoes));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JDadosAutomacao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JDadosAutomacao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JEntradaTransacao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JEntradaTransacao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JFinanciamentos', TypeInfo(Elgin.JNI.InterfaceAutomacao.JFinanciamentos));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JGlobalDefs', TypeInfo(Elgin.JNI.InterfaceAutomacao.JGlobalDefs));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JIdentificacaoPortadorCarteira', TypeInfo(Elgin.JNI.InterfaceAutomacao.JIdentificacaoPortadorCarteira));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JModalidadesPagamento', TypeInfo(Elgin.JNI.InterfaceAutomacao.JModalidadesPagamento));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JModalidadesTransacao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JModalidadesTransacao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JOperacoes', TypeInfo(Elgin.JNI.InterfaceAutomacao.JOperacoes));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JPersonalizacao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JPersonalizacao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JPersonalizacao_1', TypeInfo(Elgin.JNI.InterfaceAutomacao.JPersonalizacao_1));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JPersonalizacao_Builder', TypeInfo(Elgin.JNI.InterfaceAutomacao.JPersonalizacao_Builder));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JProvedores', TypeInfo(Elgin.JNI.InterfaceAutomacao.JProvedores));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JQuedaConexaoTerminalExcecao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JQuedaConexaoTerminalExcecao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JSaidaTransacao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JSaidaTransacao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JSenderActivity', TypeInfo(Elgin.JNI.InterfaceAutomacao.JSenderActivity));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JStatusTransacao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JStatusTransacao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTerminal', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTerminal));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTerminalDesconectadoExcecao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTerminalDesconectadoExcecao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTerminalNaoConfiguradoExcecao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTerminalNaoConfiguradoExcecao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransacao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransacao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransacaoPendenteDados', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransacaoPendenteDados));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransacoes', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransacoes));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransacoes_1', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransacoes_1));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransacoes_TransacaoResultReceiver', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransacoes_TransacaoResultReceiver));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JVersoes', TypeInfo(Elgin.JNI.InterfaceAutomacao.JVersoes));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JViasImpressao', TypeInfo(Elgin.JNI.InterfaceAutomacao.JViasImpressao));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JCustomization', TypeInfo(Elgin.JNI.InterfaceAutomacao.JCustomization));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransactionInput', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransactionInput));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JTransactionOutput', TypeInfo(Elgin.JNI.InterfaceAutomacao.JTransactionOutput));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JDateParser', TypeInfo(Elgin.JNI.InterfaceAutomacao.JDateParser));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JEnumType', TypeInfo(Elgin.JNI.InterfaceAutomacao.JEnumType));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JInputParser', TypeInfo(Elgin.JNI.InterfaceAutomacao.JInputParser));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JOutputParser', TypeInfo(Elgin.JNI.InterfaceAutomacao.JOutputParser));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.Jparser_ParseException', TypeInfo(Elgin.JNI.InterfaceAutomacao.Jparser_ParseException));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JUriArrayFieldName', TypeInfo(Elgin.JNI.InterfaceAutomacao.JUriArrayFieldName));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.Jparser_UriClass', TypeInfo(Elgin.JNI.InterfaceAutomacao.Jparser_UriClass));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JUriCustomizeFieldName', TypeInfo(Elgin.JNI.InterfaceAutomacao.JUriCustomizeFieldName));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JUriDateFieldName', TypeInfo(Elgin.JNI.InterfaceAutomacao.JUriDateFieldName));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JUriEnumFieldName', TypeInfo(Elgin.JNI.InterfaceAutomacao.JUriEnumFieldName));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JUriFileFieldName', TypeInfo(Elgin.JNI.InterfaceAutomacao.JUriFileFieldName));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JUriMethodName', TypeInfo(Elgin.JNI.InterfaceAutomacao.JUriMethodName));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JUriObjectFieldName', TypeInfo(Elgin.JNI.InterfaceAutomacao.JUriObjectFieldName));
  TRegTypes.RegisterType('Elgin.JNI.InterfaceAutomacao.JUriPrimitiveFieldName', TypeInfo(Elgin.JNI.InterfaceAutomacao.JUriPrimitiveFieldName));
end;

initialization
  RegisterTypes;
end.

