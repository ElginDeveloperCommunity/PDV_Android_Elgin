using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

[assembly: Xamarin.Forms.Dependency(typeof(M8XamarinForms.Droid.IPrinterImplementation))]
namespace M8XamarinForms.Droid
{
    class IPrinterImplementation : IPrinter
    {
        public int PrinterInternalImpStart()
        {
            return MainActivity.printer.PrinterInternalImpStart();
        }

        public int PrinterExternalImpStart(Dictionary<string,string> parametros)
        {
            return MainActivity.printer.PrinterExternalImpStart(parametros);
        }

        public void PrinterStop()
        {
            MainActivity.printer.PrinterStop();
        }

        public int AvancaLinhas(int linesNumber)
        {
            return MainActivity.printer.AvancaLinhas(linesNumber);
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

        public int ImprimeImagem(Dictionary<string,string> parametros)
        {
            return MainActivity.printer.ImprimeImagem(parametros);
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

        public int ImprimeImagem(Bitmap bitmap)
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
            args = new Dictionary<string, string>();
            args.Add("key", "hey");
            Xamarin.Forms.MessagingCenter.Send(Xamarin.Forms.Application.Current, "Tef_Message", args);
        }

        public void TestArg2()
        {
            Dictionary<string, string> args;
            args = new Dictionary<string, string>();
            args.Add("key", "ops");
            Xamarin.Forms.MessagingCenter.Send(Xamarin.Forms.Application.Current, "Tef_Message", args);
        }

        public void TestAndroidAlert(string alertMessage)
        {
            MainActivity.Alert("Alert", alertMessage);
        }
    }
}