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

        public static void setActivity(Activity activity)
        {
            mActivity = activity;
            Termica.SetContext(mActivity);
        }
        public static int printerInternalImpStart()
        {
            printerStop();
            int result = Termica.AbreConexaoImpressora(6, "M8", "", 0);
            return result;
        }

        public static int printerExternalImpStart(Dictionary<string,string> dictionary)
        {
            printerStop();
            String ip = (String)dictionary["ip"];
            int port = Int32.Parse(dictionary["port"]);
            try
            {
                int result = Termica.AbreConexaoImpressora(3, "I9", ip, port);
        
                return result;
            }
            catch (Exception e)
            {
                return printerInternalImpStart();
            }
        }

        public static void printerStop()
        {
            Termica.FechaConexaoImpressora();
        }

        public static int AvancaLinhas(int linesNumber)
        {
            return Termica.AvancaPapel(linesNumber);
        }

        public static int cutPaper(int cut)
        {
            return Termica.Corte(cut);
        }

        public static int imprimeTexto(Dictionary<string, string> dictionary)
        {
            String text = (String) dictionary["text"];
            String align = (String) dictionary["align"];
            String font = (String) dictionary["font"];
            int fontSize = (int) Int32.Parse(dictionary["fontSize"]);
            Boolean isBold = (Boolean) Convert.ToBoolean(dictionary["isBold"]);
            Boolean isUnderline = (Boolean) Convert.ToBoolean(dictionary["isUnderline"]);
            
            int result;

            int alignValue = 0;
            int styleValue = 0;

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

        private static int codeOfBarCode(String barCodeName)
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

        public static int imprimeBarCode(Dictionary<string, string> dictionary)
        {

            int barCodeType = codeOfBarCode((String)dictionary["barCodeType"]);
            String text = (String) dictionary["text"];
            int height = (int) Int32.Parse(dictionary["height"]);
            int width = (int) Int32.Parse(dictionary["width"]);
            String align = (String) dictionary["align"];

           
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

        public static int imprimeQR_CODE(Dictionary<string, string> dictionary)
        {
            int size = (int) Int32.Parse(dictionary["qrSize"]);
            String text = (String) dictionary["text"];
            String align = (String) dictionary["align"];

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

        public static int imprimeImagem(Dictionary<string, string> dictionary)
        {
            String pathImage = (String)dictionary["pathImage"];
            Boolean isBase64 = (Boolean)Convert.ToBoolean(dictionary["isBase64"]);

            int result;

            File mSaveBit = new File(pathImage); // Your image file

            Bitmap bitmap;

            if (pathImage.Equals("elgin"))
            {
                int id = 0;

               
                id = mActivity.ApplicationContext.Resources.GetIdentifier(pathImage, "drawable", mActivity.ApplicationContext.PackageName);
                System.Console.WriteLine("id: " + id);

                bitmap = BitmapFactory.DecodeResource(mActivity.ApplicationContext.Resources, id);
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
                    String filePath = mSaveBit.Path;
                    bitmap = BitmapFactory.DecodeFile(filePath);
                }
            }

            result = Termica.ImprimeBitmap(bitmap);

            return result;
        }

        public static int imprimeXMLNFCe(Dictionary<string, string> dictionary)
        {
            String xmlNFCe = (String)dictionary["xmlNFCe"];
            int indexcsc = (int) Int32.Parse(dictionary["indexcsc"]);
            String csc = (String) dictionary["csc"];
            int param = (int)Int32.Parse(dictionary["param"]);
            return Termica.ImprimeXMLNFCe(xmlNFCe, indexcsc, csc, param);
        }

        public static int imprimeXMLSAT(Dictionary<string, string> dictionary)
        {
            String xml = (String) dictionary["xmlSAT"];
            int param = (int)Int32.Parse(dictionary["param"]);
            return Termica.ImprimeXMLSAT(xml, param);
        }

        public static int statusGaveta()
        {
            return Termica.StatusImpressora(1);
        }

        public static int abrirGaveta()
        { 
            return Termica.AbreGavetaElgin(); 
        }

        public static int statusSensorPapel()
        {
            return Termica.StatusImpressora(3);
        }

        public static int imprimeCupomTEF(Dictionary<string, string> dictionary)
        {
            String base64 = (String)dictionary["base64"]; 

            return Termica.ImprimeCupomTEF(base64);
        }

    }
}