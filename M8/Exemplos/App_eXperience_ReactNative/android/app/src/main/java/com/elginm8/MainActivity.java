package com.elginm8;

import com.facebook.react.ReactActivity;

import android.os.Bundle;

import android.app.Activity;

import com.elginm8.PayGo;
import com.elginm8.Printer;

public class MainActivity extends ReactActivity {

  Activity activity;
  public static Printer printer;
  public static PayGo payGo;

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
  }
}
