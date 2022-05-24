using Android.App;
using Android.OS;
using Android.Support.V7.App;
using Android.Runtime;
using Android.Widget;
using System;

namespace M8
{
    [Activity(Label = "@string/app_name", Theme = "@style/Theme.AppCompat.Light.NoActionBar", MainLauncher = true)]
    public class MainActivity : AppCompatActivity
    {
        LinearLayout btnE1Bridge, btnNfce, btnImpressora, btnCodigoDeBarras, btnTef, btnCarteiraDigital, btnSat, btnBalanca;
        
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            Xamarin.Essentials.Platform.Init(this, savedInstanceState);
            // Set our view from the "main" layout resource
            SetContentView(Resource.Layout.activity_main);

            InitViews();
        }
        public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Android.Content.PM.Permission[] grantResults)
        {
            Xamarin.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            base.OnRequestPermissionsResult(requestCode, permissions, grantResults);
        }

        public void GoToActivity(Type myActivity)
        {
            StartActivity(myActivity);
        }

        private void InitViews()
        {
            btnE1Bridge = FindViewById<LinearLayout>(Resource.Id.btnE1Bridge);
            btnNfce = FindViewById<LinearLayout>(Resource.Id.btnNfce);
            btnImpressora = FindViewById<LinearLayout>(Resource.Id.btnImpressora);
            btnCodigoDeBarras = FindViewById<LinearLayout>(Resource.Id.btnCodigoBarras);
            btnBalanca = FindViewById<LinearLayout>(Resource.Id.btnBalanca);
            btnTef = FindViewById<LinearLayout>(Resource.Id.btnTEF);
            btnCarteiraDigital = FindViewById<LinearLayout>(Resource.Id.btnCarteiraDigital);
            btnSat = FindViewById<LinearLayout>(Resource.Id.btnSAT);

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
        }


    }
}