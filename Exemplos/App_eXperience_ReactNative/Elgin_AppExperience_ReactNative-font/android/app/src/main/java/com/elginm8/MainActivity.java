package com.elginm8;

import com.elginm8.Pix4.Pix4Service;
import com.facebook.react.ReactActivity;

import com.elginm8.NFCE.It4r;

import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;

import android.app.Activity;
import android.util.Log;
import android.widget.Toast;

import br.com.daruma.framework.mobile.DarumaMobile;

public class MainActivity extends ReactActivity {

  Activity activity;
  public static Printer printer;
  public static PayGo payGo;
  public static ServiceSat serviceSat;
  public static Balanca balanca;
  public static BridgeService bridge;
  public static It4r it4rObj;
  public static Context mContext;
  public static Pix4Service pix4Service;
  public static KioskService kioskService;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */


  @Override
  protected String getMainComponentName() {
    return "elginm8";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState){
    super.onCreate(savedInstanceState);
    activity = this;

    printer = new Printer(activity);
    payGo = new PayGo(activity);
    serviceSat = new ServiceSat(activity);
    balanca = new Balanca(activity);
    bridge = new BridgeService(activity);
    it4rObj = new It4r(DarumaMobile.inicializar(this, "@FRAMEWORK(LOGMEMORIA=200;TRATAEXCECAO=TRUE;TIMEOUTWS=8000;SATNATIVO=FALSE);@SOCKET(HOST=192.168.210.94;PORT=9100;)"));
    pix4Service = new Pix4Service(activity);
    kioskService = new KioskService(activity);
  }
}
