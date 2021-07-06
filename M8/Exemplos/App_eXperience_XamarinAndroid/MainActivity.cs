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
        Button btnImpressora, btnCodigoDeBarras, btnTef, btnSat;
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
            btnImpressora = FindViewById<Button>(Resource.Id.botaoImpressora);
            btnCodigoDeBarras = FindViewById<Button>(Resource.Id.botaoCodigoBarras);
            btnTef = FindViewById<Button>(Resource.Id.botaoTEF);
            btnSat = FindViewById<Button>(Resource.Id.botaoSat);

            btnImpressora.Click += delegate
            {
                GoToActivity(typeof(Impressora));
            };

            btnCodigoDeBarras.Click += delegate
            {
                GoToActivity(typeof(CodigoDeBarras));
            };

            btnTef.Click += delegate
            {
                GoToActivity(typeof(Tef));
            };

            btnSat.Click += delegate
            {
                GoToActivity(typeof(Sat));
            };
        }


    }
}