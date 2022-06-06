package com.elginm8;

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
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);

    Log.d("DEBUG", String.valueOf(requestCode));
    if (requestCode == ToastModules.REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
      Log.v("DEBUG", "Permission: " + permissions[0] + "was " + grantResults[0]);
      //A permissão necessária acabou de ser garantida, continue com a operação

      ToastModules.configurateXmlNfce();
    } else if (requestCode == ToastModules.REQUEST_CODE_WRITE_EXTERNAL_STORAGE) {
      Toast.makeText(this, "É necessário garantir a permissão de armazenamento para a montagem da NFCe a ser enviada!", Toast.LENGTH_LONG).show();
    }
  }
}
