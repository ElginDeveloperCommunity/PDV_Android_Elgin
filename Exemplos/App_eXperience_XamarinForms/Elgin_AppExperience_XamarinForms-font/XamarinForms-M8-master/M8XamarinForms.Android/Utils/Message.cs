using Android.Widget;
using Xamarin.Forms;
using Application = Android.App.Application;

[assembly: Dependency(typeof(M8XamarinForms.Droid.MessageService))]
namespace M8XamarinForms.Droid
{
    class MessageService : IMessage
    {
        void IMessage.LongAlert(string message)
        {
            Toast.MakeText(Application.Context, message, ToastLength.Long).Show();
        }

        void IMessage.ShortAlert(string message)
        {
            Toast.MakeText(Application.Context, message, ToastLength.Short).Show();
        }
    }
}