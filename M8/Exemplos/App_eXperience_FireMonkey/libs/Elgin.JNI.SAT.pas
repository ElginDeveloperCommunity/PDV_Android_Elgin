
unit Elgin.JNI.SAT;

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
  Jelgin_BuildConfig = interface;//br.com.elgin.BuildConfig
  JElginSAT = interface;//br.com.elgin.sat.ElginSAT
  //JElginSATMainActivity = interface;//br.com.elgin.sat.ElginSATMainActivity
  JElginSATMainActivity_1 = interface;//br.com.elgin.sat.ElginSATMainActivity$1
  JElginSATMainActivity_2 = interface;//br.com.elgin.sat.ElginSATMainActivity$2
  JSatJni = interface;//br.com.elgin.sat.SatJni
  JUSBService = interface;//br.com.elgin.sat.USBService
  //JUSBService_1 = interface;//br.com.elgin.sat.USBService$1
  JUSBService_2 = interface;//br.com.elgin.sat.USBService$2
  JUSBService_ConnectionThread = interface;//br.com.elgin.sat.USBService$ConnectionThread
  JUSBService_UsbBinder = interface;//br.com.elgin.sat.USBService$UsbBinder
  JUSBController = interface;//br.com.elgin.usb.USBController

// ===== Interface declarations =====

  JAnimatorClass = interface(JObjectClass)
    ['{3F76A5DF-389E-4BD3-9861-04C5B00CEADE}']
    {class} function init: JAnimator; cdecl;//Deprecated
    {class} procedure addListener(listener: JAnimator_AnimatorListener); cdecl;
    {class} procedure addPauseListener(listener: JAnimator_AnimatorPauseListener); cdecl;
    {class} procedure cancel; cdecl;
    {class} function getInterpolator: JTimeInterpolator; cdecl;
    {class} function getListeners: JArrayList; cdecl;
    {class} function isStarted: Boolean; cdecl;
    {class} procedure pause; cdecl;
    {class} procedure removeAllListeners; cdecl;
    {class} function setDuration(duration: Int64): JAnimator; cdecl;
    {class} procedure setInterpolator(value: JTimeInterpolator); cdecl;
    {class} procedure setStartDelay(startDelay: Int64); cdecl;
    {class} procedure start; cdecl;//Deprecated
  end;

  [JavaSignature('android/animation/Animator')]
  JAnimator = interface(JObject)
    ['{FA13E56D-1B6D-4A3D-8327-9E5BA785CF21}']
    function clone: JAnimator; cdecl;
    procedure &end; cdecl;
    function getDuration: Int64; cdecl;
    function getStartDelay: Int64; cdecl;
    function isPaused: Boolean; cdecl;
    function isRunning: Boolean; cdecl;
    procedure removeListener(listener: JAnimator_AnimatorListener); cdecl;
    procedure removePauseListener(listener: JAnimator_AnimatorPauseListener); cdecl;
    procedure resume; cdecl;
    procedure setTarget(target: JObject); cdecl;//Deprecated
    procedure setupEndValues; cdecl;//Deprecated
    procedure setupStartValues; cdecl;//Deprecated
  end;
  TJAnimator = class(TJavaGenericImport<JAnimatorClass, JAnimator>) end;

  JAnimator_AnimatorListenerClass = interface(IJavaClass)
    ['{5ED6075A-B997-469C-B8D9-0AA8FB7E4798}']
    {class} procedure onAnimationEnd(animation: JAnimator); cdecl;//Deprecated
    {class} procedure onAnimationRepeat(animation: JAnimator); cdecl;//Deprecated
    {class} procedure onAnimationStart(animation: JAnimator); cdecl;//Deprecated
  end;

  [JavaSignature('android/animation/Animator$AnimatorListener')]
  JAnimator_AnimatorListener = interface(IJavaInstance)
    ['{E2DE8DD6-628B-4D84-AA46-8A1E3F00FF13}']
    procedure onAnimationCancel(animation: JAnimator); cdecl;//Deprecated
  end;
  TJAnimator_AnimatorListener = class(TJavaGenericImport<JAnimator_AnimatorListenerClass, JAnimator_AnimatorListener>) end;

  JAnimator_AnimatorPauseListenerClass = interface(IJavaClass)
    ['{CB0DC3F0-63BC-4284-ADD0-2ED367AE11E5}']
    {class} procedure onAnimationPause(animation: JAnimator); cdecl;//Deprecated
  end;

  [JavaSignature('android/animation/Animator$AnimatorPauseListener')]
  JAnimator_AnimatorPauseListener = interface(IJavaInstance)
    ['{43C9C106-65EA-4A7D-A958-FAB9E43FA4A6}']
    procedure onAnimationResume(animation: JAnimator); cdecl;
  end;
  TJAnimator_AnimatorPauseListener = class(TJavaGenericImport<JAnimator_AnimatorPauseListenerClass, JAnimator_AnimatorPauseListener>) end;

  JKeyframeClass = interface(JObjectClass)
    ['{D383116E-5CCF-48D8-9EA1-B26FBF24BA39}']
    {class} function init: JKeyframe; cdecl;//Deprecated
    {class} function clone: JKeyframe; cdecl;
    {class} function getFraction: Single; cdecl;
    {class} function getInterpolator: JTimeInterpolator; cdecl;
    {class} function ofFloat(fraction: Single; value: Single): JKeyframe; cdecl; overload;//Deprecated
    {class} function ofFloat(fraction: Single): JKeyframe; cdecl; overload;//Deprecated
    {class} function ofInt(fraction: Single; value: Integer): JKeyframe; cdecl; overload;//Deprecated
    {class} function ofInt(fraction: Single): JKeyframe; cdecl; overload;//Deprecated
    {class} function ofObject(fraction: Single; value: JObject): JKeyframe; cdecl; overload;//Deprecated
    {class} function ofObject(fraction: Single): JKeyframe; cdecl; overload;//Deprecated
    {class} procedure setFraction(fraction: Single); cdecl;//Deprecated
    {class} procedure setInterpolator(interpolator: JTimeInterpolator); cdecl;//Deprecated
  end;

  [JavaSignature('android/animation/Keyframe')]
  JKeyframe = interface(JObject)
    ['{9D0687A4-669E-440F-8290-154739405019}']
    function getType: Jlang_Class; cdecl;//Deprecated
    function getValue: JObject; cdecl;//Deprecated
    function hasValue: Boolean; cdecl;//Deprecated
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
    {class} procedure addTransitionListener(listener: JLayoutTransition_TransitionListener); cdecl;
    {class} procedure disableTransitionType(transitionType: Integer); cdecl;
    {class} procedure enableTransitionType(transitionType: Integer); cdecl;
    {class} function getStagger(transitionType: Integer): Int64; cdecl;
    {class} function getStartDelay(transitionType: Integer): Int64; cdecl;
    {class} function isChangingLayout: Boolean; cdecl;
    {class} function isRunning: Boolean; cdecl;
    {class} function isTransitionTypeEnabled(transitionType: Integer): Boolean; cdecl;
    {class} procedure setAnimator(transitionType: Integer; animator: JAnimator); cdecl;//Deprecated
    {class} procedure setDuration(duration: Int64); cdecl; overload;//Deprecated
    {class} procedure setDuration(transitionType: Integer; duration: Int64); cdecl; overload;//Deprecated
    {class} procedure showChild(parent: JViewGroup; child: JView); cdecl; overload;//Deprecated
    {class} procedure showChild(parent: JViewGroup; child: JView; oldVisibility: Integer); cdecl; overload;//Deprecated
    {class} property APPEARING: Integer read _GetAPPEARING;
    {class} property CHANGE_APPEARING: Integer read _GetCHANGE_APPEARING;
    {class} property CHANGE_DISAPPEARING: Integer read _GetCHANGE_DISAPPEARING;
    {class} property CHANGING: Integer read _GetCHANGING;
    {class} property DISAPPEARING: Integer read _GetDISAPPEARING;
  end;

  [JavaSignature('android/animation/LayoutTransition')]
  JLayoutTransition = interface(JObject)
    ['{42450BEE-EBF2-4954-B9B7-F8DAE7DF0EC1}']
    procedure addChild(parent: JViewGroup; child: JView); cdecl;
    function getAnimator(transitionType: Integer): JAnimator; cdecl;
    function getDuration(transitionType: Integer): Int64; cdecl;
    function getInterpolator(transitionType: Integer): JTimeInterpolator; cdecl;
    function getTransitionListeners: JList; cdecl;
    procedure hideChild(parent: JViewGroup; child: JView); cdecl; overload;//Deprecated
    procedure hideChild(parent: JViewGroup; child: JView; newVisibility: Integer); cdecl; overload;
    procedure removeChild(parent: JViewGroup; child: JView); cdecl;//Deprecated
    procedure removeTransitionListener(listener: JLayoutTransition_TransitionListener); cdecl;//Deprecated
    procedure setAnimateParentHierarchy(animateParentHierarchy: Boolean); cdecl;//Deprecated
    procedure setInterpolator(transitionType: Integer; interpolator: JTimeInterpolator); cdecl;//Deprecated
    procedure setStagger(transitionType: Integer; duration: Int64); cdecl;//Deprecated
    procedure setStartDelay(transitionType: Integer; delay: Int64); cdecl;//Deprecated
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
    {class} function getDuration: Int64; cdecl;//Deprecated
    {class} function getFrameDelay: Int64; cdecl;//Deprecated
    {class} function getStartDelay: Int64; cdecl;//Deprecated
    {class} function getValues: TJavaObjectArray<JPropertyValuesHolder>; cdecl;//Deprecated
    {class} function isRunning: Boolean; cdecl;//Deprecated
    {class} procedure resume; cdecl;
    {class} procedure reverse; cdecl;
    {class} procedure setCurrentFraction(fraction: Single); cdecl;
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
    procedure addUpdateListener(listener: JValueAnimator_AnimatorUpdateListener); cdecl;//Deprecated
    procedure cancel; cdecl;//Deprecated
    function clone: JValueAnimator; cdecl;//Deprecated
    function getAnimatedValue: JObject; cdecl; overload;//Deprecated
    function getAnimatedValue(propertyName: JString): JObject; cdecl; overload;//Deprecated
    function getCurrentPlayTime: Int64; cdecl;//Deprecated
    function getInterpolator: JTimeInterpolator; cdecl;//Deprecated
    function getRepeatCount: Integer; cdecl;//Deprecated
    function getRepeatMode: Integer; cdecl;//Deprecated
    function isStarted: Boolean; cdecl;//Deprecated
    procedure pause; cdecl;
    procedure removeAllUpdateListeners; cdecl;
    procedure removeUpdateListener(listener: JValueAnimator_AnimatorUpdateListener); cdecl;
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
    procedure onAnimationUpdate(animation: JValueAnimator); cdecl;
  end;
  TJValueAnimator_AnimatorUpdateListener = class(TJavaGenericImport<JValueAnimator_AnimatorUpdateListenerClass, JValueAnimator_AnimatorUpdateListener>) end;

  JPathMotionClass = interface(JObjectClass)
    ['{E1CD1A94-115C-492C-A490-37F0E72956EB}']
    {class} function init: JPathMotion; cdecl; overload;//Deprecated
    {class} function init(context: JContext; attrs: JAttributeSet): JPathMotion; cdecl; overload;//Deprecated
  end;

  [JavaSignature('android/transition/PathMotion')]
  JPathMotion = interface(JObject)
    ['{BDC08353-C9FB-42D7-97CC-C35837D2F536}']
    function getPath(startX: Single; startY: Single; endX: Single; endY: Single): JPath; cdecl;
  end;
  TJPathMotion = class(TJavaGenericImport<JPathMotionClass, JPathMotion>) end;

  JSceneClass = interface(JObjectClass)
    ['{8B9120CA-AEEA-4DE3-BDC9-15CFD23A7B07}']
    {class} function init(sceneRoot: JViewGroup): JScene; cdecl; overload;//Deprecated
    {class} function init(sceneRoot: JViewGroup; layout: JView): JScene; cdecl; overload;//Deprecated
    {class} function init(sceneRoot: JViewGroup; layout: JViewGroup): JScene; cdecl; overload;//Deprecated
    {class} procedure exit; cdecl;//Deprecated
    {class} function getSceneForLayout(sceneRoot: JViewGroup; layoutId: Integer; context: JContext): JScene; cdecl;//Deprecated
    {class} function getSceneRoot: JViewGroup; cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/Scene')]
  JScene = interface(JObject)
    ['{85A60B99-5837-4F1F-A344-C627DD586B82}']
    procedure enter; cdecl;//Deprecated
    procedure setEnterAction(action: JRunnable); cdecl;//Deprecated
    procedure setExitAction(action: JRunnable); cdecl;//Deprecated
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
    {class} function addListener(listener: JTransition_TransitionListener): JTransition; cdecl;
    {class} function addTarget(targetId: Integer): JTransition; cdecl; overload;
    {class} function canRemoveViews: Boolean; cdecl;
    {class} procedure captureEndValues(transitionValues: JTransitionValues); cdecl;
    {class} procedure captureStartValues(transitionValues: JTransitionValues); cdecl;
    {class} function excludeChildren(target: JView; exclude: Boolean): JTransition; cdecl; overload;
    {class} function excludeChildren(type_: Jlang_Class; exclude: Boolean): JTransition; cdecl; overload;
    {class} function excludeTarget(targetId: Integer; exclude: Boolean): JTransition; cdecl; overload;
    {class} function getDuration: Int64; cdecl;
    {class} function getEpicenter: JRect; cdecl;
    {class} function getEpicenterCallback: JTransition_EpicenterCallback; cdecl;
    {class} function getPathMotion: JPathMotion; cdecl;//Deprecated
    {class} function getPropagation: JTransitionPropagation; cdecl;//Deprecated
    {class} function getStartDelay: Int64; cdecl;//Deprecated
    {class} function getTargets: JList; cdecl;//Deprecated
    {class} function getTransitionProperties: TJavaObjectArray<JString>; cdecl;//Deprecated
    {class} function getTransitionValues(view: JView; start: Boolean): JTransitionValues; cdecl;//Deprecated
    {class} function removeTarget(targetName: JString): JTransition; cdecl; overload;//Deprecated
    {class} function removeTarget(target: JView): JTransition; cdecl; overload;//Deprecated
    {class} function removeTarget(target: Jlang_Class): JTransition; cdecl; overload;//Deprecated
    {class} procedure setPathMotion(pathMotion: JPathMotion); cdecl;//Deprecated
    {class} procedure setPropagation(transitionPropagation: JTransitionPropagation); cdecl;//Deprecated
    {class} property MATCH_ID: Integer read _GetMATCH_ID;
    {class} property MATCH_INSTANCE: Integer read _GetMATCH_INSTANCE;
    {class} property MATCH_ITEM_ID: Integer read _GetMATCH_ITEM_ID;
    {class} property MATCH_NAME: Integer read _GetMATCH_NAME;
  end;

  [JavaSignature('android/transition/Transition')]
  JTransition = interface(JObject)
    ['{C2F8200F-1C83-40AE-8C5B-C0C8BFF17F88}']
    function addTarget(targetName: JString): JTransition; cdecl; overload;
    function addTarget(targetType: Jlang_Class): JTransition; cdecl; overload;
    function addTarget(target: JView): JTransition; cdecl; overload;
    function clone: JTransition; cdecl;
    function createAnimator(sceneRoot: JViewGroup; startValues: JTransitionValues; endValues: JTransitionValues): JAnimator; cdecl;
    function excludeChildren(targetId: Integer; exclude: Boolean): JTransition; cdecl; overload;
    function excludeTarget(targetName: JString; exclude: Boolean): JTransition; cdecl; overload;
    function excludeTarget(target: JView; exclude: Boolean): JTransition; cdecl; overload;
    function excludeTarget(type_: Jlang_Class; exclude: Boolean): JTransition; cdecl; overload;
    function getInterpolator: JTimeInterpolator; cdecl;//Deprecated
    function getName: JString; cdecl;//Deprecated
    function getTargetIds: JList; cdecl;//Deprecated
    function getTargetNames: JList; cdecl;//Deprecated
    function getTargetTypes: JList; cdecl;//Deprecated
    function isTransitionRequired(startValues: JTransitionValues; endValues: JTransitionValues): Boolean; cdecl;//Deprecated
    function removeListener(listener: JTransition_TransitionListener): JTransition; cdecl;//Deprecated
    function removeTarget(targetId: Integer): JTransition; cdecl; overload;//Deprecated
    function setDuration(duration: Int64): JTransition; cdecl;//Deprecated
    procedure setEpicenterCallback(epicenterCallback: JTransition_EpicenterCallback); cdecl;//Deprecated
    function setInterpolator(interpolator: JTimeInterpolator): JTransition; cdecl;//Deprecated
    function setStartDelay(startDelay: Int64): JTransition; cdecl;
    function toString: JString; cdecl;
  end;
  TJTransition = class(TJavaGenericImport<JTransitionClass, JTransition>) end;

  JTransition_EpicenterCallbackClass = interface(JObjectClass)
    ['{8141257A-130B-466C-A08D-AA3A00946F4C}']
    {class} function init: JTransition_EpicenterCallback; cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/Transition$EpicenterCallback')]
  JTransition_EpicenterCallback = interface(JObject)
    ['{CE004917-266F-4076-8913-F23184824FBA}']
    function onGetEpicenter(transition: JTransition): JRect; cdecl;
  end;
  TJTransition_EpicenterCallback = class(TJavaGenericImport<JTransition_EpicenterCallbackClass, JTransition_EpicenterCallback>) end;

  JTransition_TransitionListenerClass = interface(IJavaClass)
    ['{D5083752-E8A6-46DF-BE40-AE11073C387E}']
    {class} procedure onTransitionEnd(transition: JTransition); cdecl;
    {class} procedure onTransitionPause(transition: JTransition); cdecl;
    {class} procedure onTransitionResume(transition: JTransition); cdecl;
  end;

  [JavaSignature('android/transition/Transition$TransitionListener')]
  JTransition_TransitionListener = interface(IJavaInstance)
    ['{C32BE107-6E05-4898-AF0A-FAD970D66E29}']
    procedure onTransitionCancel(transition: JTransition); cdecl;
    procedure onTransitionStart(transition: JTransition); cdecl;
  end;
  TJTransition_TransitionListener = class(TJavaGenericImport<JTransition_TransitionListenerClass, JTransition_TransitionListener>) end;

  JTransitionManagerClass = interface(JObjectClass)
    ['{4160EFA0-3499-4964-817E-46497BB5B957}']
    {class} function init: JTransitionManager; cdecl;//Deprecated
    {class} procedure beginDelayedTransition(sceneRoot: JViewGroup); cdecl; overload;//Deprecated
    {class} procedure beginDelayedTransition(sceneRoot: JViewGroup; transition: JTransition); cdecl; overload;//Deprecated
    {class} procedure endTransitions(sceneRoot: JViewGroup); cdecl;//Deprecated
    {class} procedure go(scene: JScene); cdecl; overload;//Deprecated
    {class} procedure go(scene: JScene; transition: JTransition); cdecl; overload;//Deprecated
    {class} procedure transitionTo(scene: JScene); cdecl;//Deprecated
  end;

  [JavaSignature('android/transition/TransitionManager')]
  JTransitionManager = interface(JObject)
    ['{FF5E1210-1F04-4F81-9CAC-3D7A5C4E972B}']
    procedure setTransition(scene: JScene; transition: JTransition); cdecl; overload;//Deprecated
    procedure setTransition(fromScene: JScene; toScene: JScene; transition: JTransition); cdecl; overload;//Deprecated
  end;
  TJTransitionManager = class(TJavaGenericImport<JTransitionManagerClass, JTransitionManager>) end;

  JTransitionPropagationClass = interface(JObjectClass)
    ['{A881388A-C877-4DD9-9BAD-1BA4F56133EE}']
    {class} function init: JTransitionPropagation; cdecl;//Deprecated
    {class} function getStartDelay(sceneRoot: JViewGroup; transition: JTransition; startValues: JTransitionValues; endValues: JTransitionValues): Int64; cdecl;
  end;

  [JavaSignature('android/transition/TransitionPropagation')]
  JTransitionPropagation = interface(JObject)
    ['{7595B7EF-6BCE-4281-BC67-335E2FB6C091}']
    procedure captureValues(transitionValues: JTransitionValues); cdecl;
    function getPropagationProperties: TJavaObjectArray<JString>; cdecl;
  end;
  TJTransitionPropagation = class(TJavaGenericImport<JTransitionPropagationClass, JTransitionPropagation>) end;

  JTransitionValuesClass = interface(JObjectClass)
    ['{3BF98CFA-6A4D-4815-8D42-15E97C916D91}']
    {class} function _Getview: JView; cdecl;
    {class} function init: JTransitionValues; cdecl;//Deprecated
    {class} function equals(other: JObject): Boolean; cdecl;
    {class} property view: JView read _Getview;
  end;

  [JavaSignature('android/transition/TransitionValues')]
  JTransitionValues = interface(JObject)
    ['{178E09E6-D32C-48A9-ADCF-8CCEA804052A}']
    function _Getvalues: JMap; cdecl;
    function hashCode: Integer; cdecl;
    function toString: JString; cdecl;
    property values: JMap read _Getvalues;
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

  Jelgin_BuildConfigClass = interface(JObjectClass)
    ['{32C032E7-5AEA-44EF-9F83-07A6D13B30BD}']
    {class} function _GetBUILD_TYPE: JString; cdecl;
    {class} function _GetDEBUG: Boolean; cdecl;
    {class} function _GetLIBRARY_PACKAGE_NAME: JString; cdecl;
    {class} function _GetVERSION_CODE: Integer; cdecl;
    {class} function _GetVERSION_NAME: JString; cdecl;
    {class} function init: Jelgin_BuildConfig; cdecl;
    {class} property BUILD_TYPE: JString read _GetBUILD_TYPE;
    {class} property DEBUG: Boolean read _GetDEBUG;
    {class} property LIBRARY_PACKAGE_NAME: JString read _GetLIBRARY_PACKAGE_NAME;
    {class} property VERSION_CODE: Integer read _GetVERSION_CODE;
    {class} property VERSION_NAME: JString read _GetVERSION_NAME;
  end;

  [JavaSignature('br/com/elgin/BuildConfig')]
  Jelgin_BuildConfig = interface(JObject)
    ['{1DEF2FB2-0707-47A2-992B-B1BF887B9EEA}']
  end;
  TJelgin_BuildConfig = class(TJavaGenericImport<Jelgin_BuildConfigClass, Jelgin_BuildConfig>) end;

  JElginSATClass = interface(JObjectClass)
    ['{04A74673-BBFC-438D-AAEA-3D7857E92586}']
    {class} function AssociarAssinatura(P1: Integer; P2: JString; P3: JString; P4: JString): JString; cdecl;
    {class} function AtivarSAT(P1: Integer; P2: Integer; P3: JString; P4: JString; P5: Integer): JString; cdecl;
    {class} function AtualizarSoftwareSAT(P1: Integer; P2: JString): JString; cdecl;
    {class} function BloquearSAT(P1: Integer; P2: JString): JString; cdecl;
    {class} function CancelarUltimaVenda(P1: Integer; P2: JString; P3: JString; P4: JString): JString; cdecl;
    {class} function ComunicarCertificadoICPBRASIL(P1: Integer; P2: JString; P3: JString): JString; cdecl;
    {class} function ConfigurarInterfaceDeRede(P1: Integer; P2: JString; P3: JString): JString; cdecl;
    {class} function ConsultarNumeroSessao(P1: Integer; P2: JString; P3: Integer): JString; cdecl;
    {class} function ConsultarSAT(P1: Integer): JString; cdecl;
    {class} function ConsultarStatusOperacional(P1: Integer; P2: JString): JString; cdecl;
    {class} function ConsultarUltimaSessaoFiscal(P1: Integer; P2: JString): JString; cdecl;
    {class} function DefinePortaSAT(P1: JString): Integer; cdecl;
    {class} function DefineVersaoProtocolo(P1: Integer): Integer; cdecl;
    {class} function DesbloquearSAT(P1: Integer; P2: JString): JString; cdecl;
    {class} function EnviarDadosVenda(P1: Integer; P2: JString; P3: JString): JString; cdecl;
    {class} function ExtrairLogs(P1: Integer; P2: JString): JString; cdecl;
    {class} function TesteFimAFim(P1: Integer; P2: JString; P3: JString): JString; cdecl;
    {class} function TrocarCodigoDeAtivacao(P1: Integer; P2: JString; P3: Integer; P4: JString; P5: JString): JString; cdecl;
    {class} function init: JElginSAT; cdecl;
  end;

  [JavaSignature('br/com/elgin/sat/ElginSAT')]
  JElginSAT = interface(JObject)
    ['{0903B59A-3430-4852-A77C-7D8E5EDB167B}']
  end;
  TJElginSAT = class(TJavaGenericImport<JElginSATClass, JElginSAT>) end;

  // br.com.elgin.sat.ElginSATMainActivity
  JElginSATMainActivity_1Class = interface(JBroadcastReceiverClass)
    ['{513A7A06-6F03-4349-83DD-13FE4A63B608}']
    {class} //function init(P1: JElginSATMainActivity): JElginSATMainActivity_1; cdecl;
  end;

  [JavaSignature('br/com/elgin/sat/ElginSATMainActivity$1')]
  JElginSATMainActivity_1 = interface(JBroadcastReceiver)
    ['{D9B53139-A1B4-4991-A865-272302E7D647}']
    procedure onReceive(P1: JContext; P2: JIntent); cdecl;
  end;
  TJElginSATMainActivity_1 = class(TJavaGenericImport<JElginSATMainActivity_1Class, JElginSATMainActivity_1>) end;

  JElginSATMainActivity_2Class = interface(JServiceConnectionClass)
    ['{912BF358-01E7-4F53-856E-64E3B45ED240}']
    {class} //function init(P1: JElginSATMainActivity): JElginSATMainActivity_2; cdecl;
  end;

  [JavaSignature('br/com/elgin/sat/ElginSATMainActivity$2')]
  JElginSATMainActivity_2 = interface(JServiceConnection)
    ['{49071B78-D451-4711-A7BD-D543D41D7DE7}']
    procedure onServiceConnected(P1: JComponentName; P2: JIBinder); cdecl;
    procedure onServiceDisconnected(P1: JComponentName); cdecl;
  end;
  TJElginSATMainActivity_2 = class(TJavaGenericImport<JElginSATMainActivity_2Class, JElginSATMainActivity_2>) end;

  JSatJniClass = interface(JObjectClass)
    ['{EA5A5724-61AD-4AEA-854F-6ECBD1D2E68C}']
    {class} function AssociarAssinatura(P1: Integer; P2: JString; P3: JString; P4: JString): JString; cdecl;
    {class} function AtivarSAT(P1: Integer; P2: Integer; P3: JString; P4: JString; P5: Integer): JString; cdecl;
    {class} function AtualizarSoftwareSAT(P1: Integer; P2: JString): JString; cdecl;
    {class} function BloquearSAT(P1: Integer; P2: JString): JString; cdecl;
    {class} function CancelarUltimaVenda(P1: Integer; P2: JString; P3: JString; P4: JString): JString; cdecl;
    {class} function ComunicarCertificadoICPBRASIL(P1: Integer; P2: JString; P3: JString): JString; cdecl;
    {class} function ConfigurarInterfaceDeRede(P1: Integer; P2: JString; P3: JString): JString; cdecl;
    {class} function ConsultarNumeroSessao(P1: Integer; P2: JString; P3: Integer): JString; cdecl;
    {class} function ConsultarSAT(P1: Integer): JString; cdecl;
    {class} function ConsultarStatusOperacional(P1: Integer; P2: JString): JString; cdecl;
    {class} function ConsultarUltimaSessaoFiscal(P1: Integer; P2: JString): JString; cdecl;
    {class} function DefinePortaSAT(P1: JString): Integer; cdecl;
    {class} function DefineVersaoProtocolo(P1: Integer): Integer; cdecl;
    {class} function DesbloquearSAT(P1: Integer; P2: JString): JString; cdecl;
    {class} function EnviarDadosVenda(P1: Integer; P2: JString; P3: JString): JString; cdecl;
    {class} function ExtrairLogs(P1: Integer; P2: JString): JString; cdecl;
    {class} function TesteFimAFim(P1: Integer; P2: JString; P3: JString): JString; cdecl;
    {class} function TrocarCodigoDeAtivacao(P1: Integer; P2: JString; P3: Integer; P4: JString; P5: JString): JString; cdecl;
    {class} function xx: JString; cdecl;
  end;

  [JavaSignature('br/com/elgin/sat/SatJni')]
  JSatJni = interface(JObject)
    ['{A127E1E1-EBC4-40AE-A992-965E4A23D534}']
  end;
  TJSatJni = class(TJavaGenericImport<JSatJniClass, JSatJni>) end;

  JUSBServiceClass = interface(JServiceClass)
    ['{DB8DAB43-053F-4760-9652-92F1D94AADD2}']
    {class} function _GetACTION_CDC_DRIVER_NOT_WORKING: JString; cdecl;
    {class} function _GetACTION_NO_USB: JString; cdecl;
    {class} function _GetACTION_USB_ATTACHED: JString; cdecl;
    {class} function _GetACTION_USB_DETACHED: JString; cdecl;
    {class} function _GetACTION_USB_DEVICE_NOT_WORKING: JString; cdecl;
    {class} function _GetACTION_USB_DISCONNECTED: JString; cdecl;
    {class} function _GetACTION_USB_NOT_SUPPORTED: JString; cdecl;
    {class} function _GetACTION_USB_PERMISSION_GRANTED: JString; cdecl;
    {class} function _GetACTION_USB_PERMISSION_NOT_GRANTED: JString; cdecl;
    {class} function _GetACTION_USB_READY: JString; cdecl;
    {class} function _GetMESSAGE_FROM_SERIAL_PORT: Integer; cdecl;
    {class} function _GetisServiceConnected: Boolean; cdecl;
    {class} function init: JUSBService; cdecl;
    {class} property ACTION_CDC_DRIVER_NOT_WORKING: JString read _GetACTION_CDC_DRIVER_NOT_WORKING;
    {class} property ACTION_NO_USB: JString read _GetACTION_NO_USB;
    {class} property ACTION_USB_ATTACHED: JString read _GetACTION_USB_ATTACHED;
    {class} property ACTION_USB_DETACHED: JString read _GetACTION_USB_DETACHED;
    {class} property ACTION_USB_DEVICE_NOT_WORKING: JString read _GetACTION_USB_DEVICE_NOT_WORKING;
    {class} property ACTION_USB_DISCONNECTED: JString read _GetACTION_USB_DISCONNECTED;
    {class} property ACTION_USB_NOT_SUPPORTED: JString read _GetACTION_USB_NOT_SUPPORTED;
    {class} property ACTION_USB_PERMISSION_GRANTED: JString read _GetACTION_USB_PERMISSION_GRANTED;
    {class} property ACTION_USB_PERMISSION_NOT_GRANTED: JString read _GetACTION_USB_PERMISSION_NOT_GRANTED;
    {class} property ACTION_USB_READY: JString read _GetACTION_USB_READY;
    {class} property MESSAGE_FROM_SERIAL_PORT: Integer read _GetMESSAGE_FROM_SERIAL_PORT;
    {class} property isServiceConnected: Boolean read _GetisServiceConnected;
  end;

  [JavaSignature('br/com/elgin/sat/USBService')]
  JUSBService = interface(JService)
    ['{443BE9F8-5ECB-4CC6-A7E4-6C8155A13084}']
    function onBind(P1: JIntent): JIBinder; cdecl;
    procedure onCreate; cdecl;
    procedure onDestroy; cdecl;
    function onStartCommand(P1: JIntent; P2: Integer; P3: Integer): Integer; cdecl;
    procedure setHandler(P1: JHandler); cdecl;
    procedure write(P1: TJavaArray<Byte>); cdecl;
  end;
  TJUSBService = class(TJavaGenericImport<JUSBServiceClass, JUSBService>) end;

  // br.com.elgin.sat.USBService$1
  JUSBService_2Class = interface(JBroadcastReceiverClass)
    ['{6F9507A2-AE72-493D-A916-D14782120FAD}']
    {class} function init(P1: JUSBService): JUSBService_2; cdecl;
  end;

  [JavaSignature('br/com/elgin/sat/USBService$2')]
  JUSBService_2 = interface(JBroadcastReceiver)
    ['{9F413951-DAEA-49DA-A24D-4B4214D02FD4}']
    procedure onReceive(P1: JContext; P2: JIntent); cdecl;
  end;
  TJUSBService_2 = class(TJavaGenericImport<JUSBService_2Class, JUSBService_2>) end;

  JUSBService_ConnectionThreadClass = interface(JThreadClass)
    ['{B3727623-1C18-45C4-B4EC-53E05A97883F}']
    {class} //function init(P1: JUSBService; P2: JUSBService_1): JUSBService_ConnectionThread; cdecl;
  end;

  [JavaSignature('br/com/elgin/sat/USBService$ConnectionThread')]
  JUSBService_ConnectionThread = interface(JThread)
    ['{BC925695-B030-49A9-AF17-6F3F84E34E44}']
    procedure run; cdecl;
  end;
  TJUSBService_ConnectionThread = class(TJavaGenericImport<JUSBService_ConnectionThreadClass, JUSBService_ConnectionThread>) end;

  JUSBService_UsbBinderClass = interface(JBinderClass)
    ['{2514D925-948A-42EC-BE47-FEB6E431736D}']
    {class} function init(P1: JUSBService): JUSBService_UsbBinder; cdecl;
  end;

  [JavaSignature('br/com/elgin/sat/USBService$UsbBinder')]
  JUSBService_UsbBinder = interface(JBinder)
    ['{D5FB476F-43B9-47AA-9255-05ADA4694811}']
    function getService: JUSBService; cdecl;
  end;
  TJUSBService_UsbBinder = class(TJavaGenericImport<JUSBService_UsbBinderClass, JUSBService_UsbBinder>) end;

  JUSBControllerClass = interface(JObjectClass)
    ['{B36855B7-5934-4682-8684-5F13739998B4}']
    {class} function _Getbytes: JList; cdecl;
    {class} function _Getdata: JString; cdecl;
    {class} function _GetmaxTimeoutInSeconds: Integer; cdecl;
    {class} function _GetusbService: JUSBService; cdecl;
    {class} procedure _SetusbService(Value: JUSBService); cdecl;
    {class} function init: JUSBController; cdecl;
    {class} property bytes: JList read _Getbytes;
    {class} property data: JString read _Getdata;
    {class} property maxTimeoutInSeconds: Integer read _GetmaxTimeoutInSeconds;
    {class} property usbService: JUSBService read _GetusbService write _SetusbService;
  end;

  [JavaSignature('br/com/elgin/usb/USBController')]
  JUSBController = interface(JObject)
    ['{958ED8A9-4617-4C4C-8022-5A1CFE09635E}']
    function sendBytes(P1: TJavaArray<Byte>; P2: Integer; P3: Integer): TJavaArray<Byte>; cdecl;
    function sendData(P1: TJavaArray<Byte>; P2: Integer; P3: Integer): JString; cdecl;
  end;
  TJUSBController = class(TJavaGenericImport<JUSBControllerClass, JUSBController>) end;

implementation

procedure RegisterTypes;
begin
  TRegTypes.RegisterType('Elgin.JNI.SAT.JAnimator', TypeInfo(Elgin.JNI.SAT.JAnimator));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JAnimator_AnimatorListener', TypeInfo(Elgin.JNI.SAT.JAnimator_AnimatorListener));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JAnimator_AnimatorPauseListener', TypeInfo(Elgin.JNI.SAT.JAnimator_AnimatorPauseListener));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JKeyframe', TypeInfo(Elgin.JNI.SAT.JKeyframe));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JLayoutTransition', TypeInfo(Elgin.JNI.SAT.JLayoutTransition));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JLayoutTransition_TransitionListener', TypeInfo(Elgin.JNI.SAT.JLayoutTransition_TransitionListener));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JPropertyValuesHolder', TypeInfo(Elgin.JNI.SAT.JPropertyValuesHolder));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JStateListAnimator', TypeInfo(Elgin.JNI.SAT.JStateListAnimator));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JTimeInterpolator', TypeInfo(Elgin.JNI.SAT.JTimeInterpolator));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JTypeConverter', TypeInfo(Elgin.JNI.SAT.JTypeConverter));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JTypeEvaluator', TypeInfo(Elgin.JNI.SAT.JTypeEvaluator));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JValueAnimator', TypeInfo(Elgin.JNI.SAT.JValueAnimator));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JValueAnimator_AnimatorUpdateListener', TypeInfo(Elgin.JNI.SAT.JValueAnimator_AnimatorUpdateListener));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JPathMotion', TypeInfo(Elgin.JNI.SAT.JPathMotion));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JScene', TypeInfo(Elgin.JNI.SAT.JScene));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JTransition', TypeInfo(Elgin.JNI.SAT.JTransition));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JTransition_EpicenterCallback', TypeInfo(Elgin.JNI.SAT.JTransition_EpicenterCallback));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JTransition_TransitionListener', TypeInfo(Elgin.JNI.SAT.JTransition_TransitionListener));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JTransitionManager', TypeInfo(Elgin.JNI.SAT.JTransitionManager));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JTransitionPropagation', TypeInfo(Elgin.JNI.SAT.JTransitionPropagation));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JTransitionValues', TypeInfo(Elgin.JNI.SAT.JTransitionValues));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JInterpolator', TypeInfo(Elgin.JNI.SAT.JInterpolator));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JToolbar_LayoutParams', TypeInfo(Elgin.JNI.SAT.JToolbar_LayoutParams));
  TRegTypes.RegisterType('Elgin.JNI.SAT.Jelgin_BuildConfig', TypeInfo(Elgin.JNI.SAT.Jelgin_BuildConfig));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JElginSAT', TypeInfo(Elgin.JNI.SAT.JElginSAT));
  //TRegTypes.RegisterType('Elgin.JNI.SAT.JElginSATMainActivity', TypeInfo(Elgin.JNI.SAT.JElginSATMainActivity));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JElginSATMainActivity_1', TypeInfo(Elgin.JNI.SAT.JElginSATMainActivity_1));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JElginSATMainActivity_2', TypeInfo(Elgin.JNI.SAT.JElginSATMainActivity_2));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JSatJni', TypeInfo(Elgin.JNI.SAT.JSatJni));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JUSBService', TypeInfo(Elgin.JNI.SAT.JUSBService));
  //TRegTypes.RegisterType('Elgin.JNI.SAT.JUSBService_1', TypeInfo(Elgin.JNI.SAT.JUSBService_1));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JUSBService_2', TypeInfo(Elgin.JNI.SAT.JUSBService_2));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JUSBService_ConnectionThread', TypeInfo(Elgin.JNI.SAT.JUSBService_ConnectionThread));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JUSBService_UsbBinder', TypeInfo(Elgin.JNI.SAT.JUSBService_UsbBinder));
  TRegTypes.RegisterType('Elgin.JNI.SAT.JUSBController', TypeInfo(Elgin.JNI.SAT.JUSBController));
end;

initialization
  RegisterTypes;
end.

