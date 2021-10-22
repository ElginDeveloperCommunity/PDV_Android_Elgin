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
    [Activity(Label = "Sat")]
    public class Sat : Activity
    {
        TextView retornoSat;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.sat);

            retornoSat = FindViewById<TextView>(Resource.Id.textViewRetornoSat);
            retornoSat.MovementMethod = new Android.Text.Method.ScrollingMovementMethod();

        }
    }
}