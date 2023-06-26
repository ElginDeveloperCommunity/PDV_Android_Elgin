part of './pix4.dart';

enum Framework {
  JAVA,
  DELPHI,
  FLUTTER,
  XAMARIN_ANDROID,
  XAMARIN_FORMS,
  REACT_NATIVE,
  KOTLIN,
  IONIC
}

extension FrameworkEnumExtension on Framework {
  String get nameForButton {
    switch (this) {
      case Framework.XAMARIN_ANDROID:
        return 'X. Android';
      case Framework.XAMARIN_FORMS:
        return 'X. Forms';
      case Framework.REACT_NATIVE:
        return 'R. Native';
      default:
        // ignore: sdk_version_since
        return '${this.name[0].toUpperCase()}${this.name.substring(1).toLowerCase()}';
    }
  }

  String get asset {
    switch (this) {
      case Framework.JAVA:
        return 'assets/images/pix4_java.png';
      case Framework.DELPHI:
        return 'assets/images/pix4_delphi.png';
      case Framework.FLUTTER:
        return 'assets/images/pix4_flutter.png';
      case Framework.XAMARIN_ANDROID:
        return 'assets/images/pix4_xamarin_android.png';
      case Framework.XAMARIN_FORMS:
        return 'assets/images/pix4_xamarin_forms.png';
      case Framework.REACT_NATIVE:
        return 'assets/images/pix4_react_native.png';
      case Framework.KOTLIN:
        return 'assets/images/pix4_kotlin.png';
      case Framework.IONIC:
        return 'assets/images/pix4_ionic.png';
    }
  }
}
