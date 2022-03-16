using System;

using Android.App;
using Android.Content.PM;
using Android.Runtime;
using Android.OS;
using Android.Content;

namespace M8XamarinForms.Droid
{
    [Activity(Label = "M8XamarinForms", Icon = "@mipmap/icon", Theme = "@style/MainTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize )]
    public class MainActivity : Xamarin.Forms.Platform.Android.FormsAppCompatActivity
    {
        //Objeto do tipo impressora que será usado para impressão
        public static Printer printer;

        //Sitef Intent
        public static Intent intentToMsitef;

        //Context da atividade
        public static MainActivity mContext;

        //Tef instance
        ITefImplementation tef;

        public event Action<int, Result, Intent> ActivityResult;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            //Instanciando Impressora
            printer = new Printer();
            printer.SetActivity(this,this);

            //Iniciando o Paygo com a atividade principal do Android
            PayGo.setActivity(this);

            Xamarin.Essentials.Platform.Init(this, savedInstanceState);
            Xamarin.Forms.Forms.Init(this, savedInstanceState);

            tef = new ITefImplementation();

            mContext = this;
            intentToMsitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");

            LoadApplication(new App());
        }
        public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Permission[] grantResults)
        {
            Xamarin.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            base.OnRequestPermissionsResult(requestCode, permissions, grantResults);
        }

        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            tef.OnTefActivityResult(requestCode, resultCode, data);

            if (ActivityResult != null)
                ActivityResult(requestCode, resultCode, data);
        }

        public static void Alert(string titleAlert, string message)
        {
            Android.App.AlertDialog AlertDialog = new Android.App.AlertDialog.Builder(mContext).Create();
            AlertDialog.SetTitle(titleAlert);
            AlertDialog.SetMessage(message);
            AlertDialog.SetButton("OK", delegate
            {
                AlertDialog.Dismiss();
            });
            AlertDialog.Show();
        }
    }
}