using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Util;
using Android.Views;
using Android.Widget;
using Com.Elgin.E1.Impressora;
using Java.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace M8
{
    class Printer
    {
        private static Activity mActivity;

        public Printer()
        {

        }

        public static void SetActivity(Activity activity)
        {
            mActivity = activity;
            Termica.SetContext(mActivity);
        }
        public static int PrinterInternalImpStart()
        {
            PrinterStop();
            int result = Termica.AbreConexaoImpressora(6, "M8", "", 0);
            return result;
        }

        public static int PrinterExternalImpStart(Dictionary<string, string> dictionary)
        {
            PrinterStop();
            string ip = dictionary["ip"];
            int port = int.Parse(dictionary["port"]);
            try
            {
                int result = Termica.AbreConexaoImpressora(3, "I9", ip, port);

                return result;
            }
            catch (Exception)
            {
                return PrinterInternalImpStart();
            }
        }

        public static void PrinterStop()
        {
            Termica.FechaConexaoImpressora();
        }

        public static int AvancaLinhas(int linesNumber)
        {
            return Termica.AvancaPapel(linesNumber);
        }

        public static int CutPaper(int cut)
        {
            return Termica.Corte(cut);
        }

        public static int ImprimeTexto(Dictionary<string, string> dictionary)
        {
            string text = dictionary["text"];
            string align = dictionary["align"];
            string font = dictionary["font"];
            int fontSize = int.Parse(dictionary["fontSize"]);
            bool isBold = Convert.ToBoolean(dictionary["isBold"]);
            bool isUnderline = Convert.ToBoolean(dictionary["isUnderline"]);

            int result;
            int styleValue = 0;

            int alignValue;
            // ALINHAMENTO VALUE
            if (align.Equals("Esquerda"))
            {
                alignValue = 0;
            }
            else if (align.Equals("Centralizado"))
            {
                alignValue = 1;
            }
            else
            {
                alignValue = 2;
            }
            //STILO VALUE
            if (font.Equals("FONT B"))
            {
                styleValue += 1;
            }
            if (isUnderline)
            {
                styleValue += 2;
            }
            if (isBold)
            {
                styleValue += 8;
            }

            result = Termica.ImpressaoTexto(text, alignValue, styleValue, fontSize);
            return result;
        }

        private static int CodeOfBarCode(string barCodeName)
        {
            if (barCodeName.Equals("UPC-A"))
                return 0;
            else if (barCodeName.Equals("UPC-E"))
                return 1;
            else if (barCodeName.Equals("EAN 13") || barCodeName.Equals("JAN 13"))
                return 2;

            else if (barCodeName.Equals("EAN 8") || barCodeName.Equals("JAN 8"))
                return 3;
            else if (barCodeName.Equals("CODE 39"))
                return 4;
            else if (barCodeName.Equals("ITF"))
                return 5;
            else if (barCodeName.Equals("CODE BAR"))
                return 6;
            else if (barCodeName.Equals("CODE 93"))
                return 7;
            else if (barCodeName.Equals("CODE 128"))
                return 8;
            else return 0;
        }

        public static int ImprimeBarCode(Dictionary<string, string> dictionary)
        {
            int barCodeType = CodeOfBarCode(dictionary["barCodeType"]);
            string text = dictionary["text"];
            int height = int.Parse(dictionary["height"]);
            int width = int.Parse(dictionary["width"]);
            string align = dictionary["align"];

            int hri = 4; // NO PRINT
            int result;
            int alignValue;

            if (align.Equals("Esquerda"))
            {
                alignValue = 0;
            }
            else if (align.Equals("Centralizado"))
            {
                alignValue = 1;
            }
            else
            {
                alignValue = 2;
            }

            Termica.DefinePosicao(alignValue);

            result = Termica.ImpressaoCodigoBarras(barCodeType, text, height, width, hri);
            return result;
        }

        public static int ImprimeQR_CODE(Dictionary<string, string> dictionary)
        {
            int size = int.Parse(dictionary["qrSize"]);
            string text = dictionary["text"];
            string align = dictionary["align"];

            int nivelCorrecao = 2;
            int result;
            int alignValue;

            if (align.Equals("Esquerda"))
            {
                alignValue = 0;
            }
            else if (align.Equals("Centralizado"))
            {
                alignValue = 1;
            }
            else
            {
                alignValue = 2;
            }

            Termica.DefinePosicao(alignValue);

            result = Termica.ImpressaoQRCode(text, size, nivelCorrecao);
            return result;
        }

        public static int ImprimeImagem(Dictionary<string, string> dictionary)
        {
            string pathImage = (string)dictionary["pathImage"];
            bool isBase64 = (bool)Convert.ToBoolean(dictionary["isBase64"]);

            int result;

            File mSaveBit = new File(pathImage); // Your image file

            Bitmap bitmap;

            if (pathImage.Equals("elgin"))
            {
                int id = mActivity.ApplicationContext.Resources.GetIdentifier(pathImage, "drawable", mActivity.ApplicationContext.PackageName);
                System.Console.WriteLine("id: " + id);
                // alert(id.ToString());

                bitmap = BitmapFactory.DecodeResource(mActivity.ApplicationContext.Resources, id);
            }
            else
            {
                if (isBase64)
                {
                    byte[] decodedString = Base64.Decode(pathImage, Base64Flags.Default);
                    bitmap = BitmapFactory.DecodeByteArray(decodedString, 0, decodedString.Length);

                }
                else
                {
                    string filePath = mSaveBit.Path;
                    bitmap = BitmapFactory.DecodeFile(filePath);
                }
            }

            result = Termica.ImprimeBitmap(bitmap);

            return result;
        }

        public static int ImprimeXMLNFCe(Dictionary<string, string> dictionary)
        {
            string xmlNFCe = dictionary["xmlNFCe"];
            int indexcsc = int.Parse(dictionary["indexcsc"]);
            string csc = dictionary["csc"];
            int param = int.Parse(dictionary["param"]);
            return Termica.ImprimeXMLNFCe(xmlNFCe, indexcsc, csc, param);
        }

        public static int ImprimeXMLSAT(Dictionary<string, string> dictionary)
        {
            string xml = dictionary["xmlSAT"];
            int param = int.Parse(dictionary["param"]);
            return Termica.ImprimeXMLSAT(xml, param);
        }

        public static int StatusGaveta()
        {
            return Termica.StatusImpressora(1);
        }

        public static int AbrirGaveta()
        {
            return Termica.AbreGavetaElgin();
        }

        public static int StatusSensorPapel()
        {
            return Termica.StatusImpressora(3);
        }

        public static int ImprimeCupomTEF(Dictionary<string, string> dictionary)
        {
            string base64 = dictionary["base64"];

            return Termica.ImprimeCupomTEF(base64);
        }

        private static void Alert(string message)
        {
            AlertDialog alertDialog = new AlertDialog.Builder(Impressora.impressoraActivity).Create();
            alertDialog.SetTitle("Alerta");
            alertDialog.SetMessage(message);
            alertDialog.SetButton("OK", delegate
            {
                alertDialog.Dismiss();
            });
            alertDialog.Show();
        }
    }
}