using Android;
using Android.App;
using Android.Content.PM;
using Android.OS;
using Android.Runtime;
using Android.Support.V4.App;
using Android.Support.V7.App;
using Android.Widget;
using System;

namespace M8
{
    [Activity(Label = "@string/app_name", Theme = "@style/Theme.AppCompat.Light.NoActionBar", MainLauncher = true)]
    public class MainActivity : AppCompatActivity
    {
        LinearLayout btnE1Bridge, btnNfce, btnImpressora, btnCodigoDeBarras, btnTef, btnCarteiraDigital, btnSat, btnBalanca, btnPix4;

        private const int REQUEST_CODE_WRITE_EXTERNAL_STORAGE = 1;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            Xamarin.Essentials.Platform.Init(this, savedInstanceState);
            // Set our view from the "main" layout resource
            SetContentView(Resource.Layout.activity_main);

            InitViews();
            AskWriteExternalStoragePermission();
        }

        private void AskWriteExternalStoragePermission()
        {
            ActivityCompat.RequestPermissions(this, new string[] { Manifest.Permission.WriteExternalStorage }, REQUEST_CODE_WRITE_EXTERNAL_STORAGE);
        }

        public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Android.Content.PM.Permission[] grantResults)
        {
            Xamarin.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            base.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            //Impede que a aplicação continue caso a permissão seja negada, uma vez que vários módulos dependem da permissão de acesso ao armazenamento
            if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.Length > 0 && grantResults[0] == Permission.Denied)
            {
                Toast.MakeText(this, "É necessário conceder a permissão para várias funcionalidades da aplicação!", ToastLength.Long).Show();
                CloseApplication();
            }
        }

        //Força o fechamento da aplicação
        private void CloseApplication()
        {
            if (Build.VERSION.SdkInt >= BuildVersionCodes.JellyBean)
                FinishAffinity();
            else
                Finish();
        }
    

    public void GoToActivity(Type myActivity)
        {
            StartActivity(myActivity);
        }

        private void InitViews()
        {
            btnE1Bridge = FindViewById<LinearLayout>(Resource.Id.buttonE1Bridge);
            btnNfce = FindViewById<LinearLayout>(Resource.Id.buttonNfce);
            btnImpressora = FindViewById<LinearLayout>(Resource.Id.buttonPrinterOption);
            btnCodigoDeBarras = FindViewById<LinearLayout>(Resource.Id.buttonBarCodeReaderOption);
            btnBalanca = FindViewById<LinearLayout>(Resource.Id.buttonBalancaOption);
            btnTef = FindViewById<LinearLayout>(Resource.Id.buttonTefOption);
            btnCarteiraDigital = FindViewById<LinearLayout>(Resource.Id.buttonShipay);
            btnSat = FindViewById<LinearLayout>(Resource.Id.buttonSAT);
            btnPix4 = FindViewById<LinearLayout>(Resource.Id.buttonPix4);

            btnE1Bridge.Click += delegate
            {
                GoToActivity(typeof(E1Bridge));
            };

            btnNfce.Click += delegate
            {
                GoToActivity(typeof(NFCE));
            };

            btnImpressora.Click += delegate
            {
                GoToActivity(typeof(Impressora));
            };

            btnCodigoDeBarras.Click += delegate
            {
                GoToActivity(typeof(CodigoDeBarras));
            };

            btnBalanca.Click += delegate
            {
                GoToActivity(typeof(BalancaPage));
            };

            btnTef.Click += delegate
            {
                GoToActivity(typeof(Tef));
            };

            btnCarteiraDigital.Click += delegate
            {
                GoToActivity(typeof(CarteiraDigital));
            };

            btnSat.Click += delegate
            {
                GoToActivity(typeof(SatPage));
            };

            btnPix4.Click += delegate
            {
                GoToActivity(typeof(Pix4Page));
            };
        }
    }
}