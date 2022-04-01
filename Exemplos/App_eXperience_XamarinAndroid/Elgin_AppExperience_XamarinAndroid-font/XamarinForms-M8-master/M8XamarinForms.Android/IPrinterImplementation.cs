using Android.App;
using Android.Content;
using Android.Util;
using Java.Util.Regex;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Xamarin.Forms;

using Pattern = Java.Util.Regex.Pattern;

[assembly: Dependency(typeof(M8XamarinForms.Droid.IPrinterImplementation))]
namespace M8XamarinForms.Droid
{
    class IPrinterImplementation : IPrinter
    {
        public int PrinterInternalImpStart()
        {
            return MainActivity.printer.PrinterInternalImpStart();
        }

        public int PrinterExternalImpStartByIP(string model, string ip, int port)
        {
            return MainActivity.printer.PrinterExternalImpStartByIP(model, ip, port);
        }

        public int PrinterExternalImpStartByUSB(string model)
        {
            return MainActivity.printer.PrinterExternalImpStartByUSB(model);
        }

        public void PrinterStop()
        {
            MainActivity.printer.PrinterStop();
        }

        public int AvancaLinhas(int linesNumber)
        {
            return MainActivity.printer.AvancaLinhas(linesNumber);
        }

        public void JumpLine()
        {
            MainActivity.printer.JumpLine();
        }

        public int CutPaper(int cut)
        {
            return MainActivity.printer.CutPaper(cut);
        }

        public int ImprimeBarCode(Dictionary<string,string> parametros)
        {
            return MainActivity.printer.ImprimeBarCode(parametros);
        }

        public int ImprimeQR_CODE(Dictionary<string,string> parametros)
        {
            return MainActivity.printer.ImprimeQR_CODE(parametros);
        }

        public int ImprimeXMLNFCe(Dictionary<string,string> parametros)
        {
            return MainActivity.printer.ImprimeXMLNFCe(parametros);
        }

        public int ImprimeXMLSAT(Dictionary<string,string> parametros)
        {
            return MainActivity.printer.ImprimeXMLSAT(parametros);
        }

        public int StatusGaveta()
        {
            return MainActivity.printer.StatusGaveta();
        }

        public int AbrirGaveta()
        {
            return MainActivity.printer.AbrirGaveta();
        }

        public int StatusSensorPapel()
        {
            return MainActivity.printer.StatusSensorPapel();
        }

        public int ImprimeCupomTEF(Dictionary<string,string> parametros)
        {
            return MainActivity.printer.ImprimeCupomTEF(parametros);
        }

        public int ImprimeTexto(Dictionary<string,string> parametros)
        {
            return MainActivity.printer.ImprimeTexto(parametros);
        }

        public int ImprimeImagem(Stream bitmap)
        {
            return MainActivity.printer.ImprimeImagem(bitmap);
        }

        public int ImprimeImagemPadrao()
        {
            return MainActivity.printer.ImprimeImagemPadrao();
        }

        public void TestArg()
        {
            Dictionary<string, string> args;
            args = new Dictionary<string, string>
            {
                { "key", "hey" }
            };
            MessagingCenter.Send(Xamarin.Forms.Application.Current, "Tef_Message", args);
        }

        public void TestArg2()
        {
            Dictionary<string, string> args;
            args = new Dictionary<string, string>
            {
                { "key", "ops" }
            };
            MessagingCenter.Send(Xamarin.Forms.Application.Current, "Tef_Message", args);
        }

        public void TestAndroidAlert(string alertMessage)
        {
            MainActivity.Alert("Alert", alertMessage);
        }

        public bool IsIpValid(string ip)
        {
            Pattern pattern = Pattern.Compile("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$");
            Matcher matcher = pattern.Matcher(ip);
            return matcher.Matches();
        }

        public Task<Stream> GetImageStreamAsync()
        {
            var activity = (MainActivity) Forms.Context;
            ActivityResultListener listener = new ActivityResultListener(activity);

            const int RequestBarCode = 1000;
            Intent cameraIntent = new Intent(Intent.ActionPick);

            cameraIntent.SetType("image/*");
            activity.StartActivityForResult(cameraIntent, RequestBarCode);

            return listener.Task;
        }

        private class ActivityResultListener
        {
            private TaskCompletionSource<Stream> Complete = new TaskCompletionSource<Stream>();
            public Task<Stream> Task { get { return Complete.Task; } }

            public ActivityResultListener(MainActivity activity)
            {
                // subscribe to activity results
                activity.ActivityResult += OnActivityResult;
            }

            private void OnActivityResult(int requestCode, Result resultCode, Intent data)
            {
                // unsubscribe from activity results
                var activity = (MainActivity)Forms.Context;
                activity.ActivityResult -= OnActivityResult;

                Log.Debug("ON LOAD IMAGE", "request: " + requestCode + " result: " + resultCode.ToString());
                // process result
                if (requestCode != 1000 || (resultCode.ToString() != "2" && resultCode != Result.Ok) || data == null)
                    Complete.TrySetResult(null);
                else
                {
                    Android.Net.Uri uri = data.Data;
                    Stream stream = ((MainActivity)Forms.Context).ContentResolver.OpenInputStream(uri);
                    Complete.SetResult(stream);
                }
            }
        }
    }
}