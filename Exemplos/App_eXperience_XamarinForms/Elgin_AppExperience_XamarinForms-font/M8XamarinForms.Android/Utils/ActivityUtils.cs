using Android.App;
using Java.Lang;
using Xamarin.Forms;

[assembly: Dependency(typeof(M8XamarinForms.Droid.ActivityUtilsService))]
namespace M8XamarinForms.Droid
{
    class ActivityUtilsService : IActivityUtils
    {
        void IActivityUtils.Quit()
        {
            ((Activity)Forms.Context).FinishAffinity(); JavaSystem.Exit(0);
        }
    }
}