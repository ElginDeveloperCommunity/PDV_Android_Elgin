package com.elginm8;

import com.facebook.react.ReactActivity;

import com.rnfs.RNFSPackage;

import android.os.Bundle;

import android.app.Activity;

public class MainActivity extends ReactActivity {

  Activity activity;
  public static Printer printer;
  public static PayGo payGo;
  public static ServiceSat serviceSat;
  public static Balanca balanca;
  public static BridgeService bridge;

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
  }
}
