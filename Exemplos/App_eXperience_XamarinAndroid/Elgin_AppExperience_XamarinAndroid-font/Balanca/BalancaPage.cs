using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace M8
{
    [Activity(Label = "BalancaPage")]
    public class BalancaPage : Activity
    {
        private static Context mContext;

        public Balanca balanca;

        TextView textReturnValueBalanca;

        RadioGroup radioGroupModels;
        RadioButton radioButtonDP30CK;

        Spinner spinnerProtocols;

        Button buttonConfigurarBalanca;
        Button buttonLerPeso;

        string typeModel = "DP30CK";
        string typeProtocol = "PROTOCOL 0";

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.balanca_page);

            mContext = this;

            balanca = new Balanca(this);

            textReturnValueBalanca = FindViewById<TextView>(Resource.Id.textReturnValueBalanca);
            radioButtonDP30CK = FindViewById<RadioButton>(Resource.Id.radioButtonDP30CK);
            spinnerProtocols = FindViewById<Spinner>(Resource.Id.spinnerProtocols);
            buttonConfigurarBalanca = FindViewById<Button>(Resource.Id.buttonConfigurarBalanca);
            buttonLerPeso = FindViewById<Button>(Resource.Id.buttonLerPeso);

            //CONFIGS MODEL BALANÇA
            radioButtonDP30CK.Checked = true;
            radioGroupModels = FindViewById<RadioGroup>(Resource.Id.radioGroupModels);
            
            radioGroupModels.CheckedChange += (s, e) =>
            {
                switch (e.CheckedId)
                {
                    case Resource.Id.radioButtonDP30CK:
                        typeModel = "DP30CK";
                        break;
                    case Resource.Id.radioButtonSA110:
                        typeModel = "SA110";
                        break;
                    case Resource.Id.radioButtonDPSC:
                        typeModel = "DPSC";
                        break;
                }
            };

            spinnerProtocols.SetSelection(0);

            //CONFIGS PROTOCOLS
            spinnerProtocols.ItemSelected += (s, e) =>
            {
                typeProtocol = spinnerProtocols.SelectedItem.ToString();
            };

            buttonConfigurarBalanca.Click += delegate
            {
                Dictionary<string, Object> mapValues = new Dictionary<string, Object>();

                mapValues.Add("model", typeModel);
                mapValues.Add("protocol", typeProtocol);

                balanca.ConfigBalanca(mapValues);
            };

            buttonLerPeso.Click += delegate
            {
                string retorno = balanca.LerPesoBalanca();
                textReturnValueBalanca.Text = retorno;
            };

        }

        public static void Alert(String titleAlert, String message)
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