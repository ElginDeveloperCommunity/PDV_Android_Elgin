using Android.Content;
using Android.OS;
using Android.Views.InputMethods;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;

[assembly: ExportRenderer(typeof(M8XamarinForms.BarCodesEntry), typeof(M8XamarinForms.Droid.BarCodesEntryRenderer))]
namespace M8XamarinForms.Droid
{
    class BarCodesEntryRenderer : EntryRenderer
    {
        public BarCodesEntryRenderer(Context context) : base(context)
        {
        }
        protected override void OnElementChanged(ElementChangedEventArgs<Entry> e)
        {
            base.OnElementChanged(e);
            if (Control != null)
            {
                Control.Click += (sender, evt) =>
                {
                    new Handler(Looper.MainLooper).Post(delegate
                    {
                        var imm = (InputMethodManager)Control.Context.GetSystemService(Context.InputMethodService);
                        var result = imm.HideSoftInputFromWindow(Control.WindowToken, 0);
                    });
                };

                Control.FocusChange += (sender, evt) =>
                {
                    new Handler(Looper.MainLooper).Post(delegate
                    {
                        var imm = (InputMethodManager)Control.Context.GetSystemService(Context.InputMethodService);
                        var result = imm.HideSoftInputFromWindow(Control.WindowToken, 0);
                    });
                };
            }
        }
    }
}