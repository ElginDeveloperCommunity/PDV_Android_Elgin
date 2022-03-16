using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Util;
using Com.Elgin.E1.Impressora;
using Java.IO;
using System;
using System.Collections.Generic;
using System.IO;


namespace M8XamarinForms
{
    public class Printer
    {
        private Activity mActivity;
        private Context mContext;
        private const string nomeXmlSat = "xmlsat";
        private const string nomeXmlNFCE = "xmlnfce";
        public string xmlSat;
        public string xmlNFCE;

        public Printer()
        {
            //mActivity = activity;
            //Termica.SetContext(mActivity);
        }

        public void SetActivity(Activity activity,Context context)
        {
            mActivity = activity;
            mContext = context;

            xmlSat = CarregarArquivo(nomeXmlSat);
            xmlNFCE = CarregarArquivo(nomeXmlNFCE);

            Termica.SetContext(activity);
        }
        public int PrinterInternalImpStart()
        {
            PrinterStop();
            int result = Termica.AbreConexaoImpressora(6, "M8", "", 0);
            return result;
        }

        public int PrinterExternalImpStart(Dictionary<string,string> dictionary)
        {
            PrinterStop();
            string ip = dictionary["ip"];
            int port = int.Parse(dictionary["port"]);
            try
            {
                int result = Termica.AbreConexaoImpressora(3, "I9", ip, port);
                return result;
            }
            catch (Exception e)
            {
                System.Console.WriteLine("exception: " + e);
                return PrinterInternalImpStart();
            }
        }

        public void PrinterStop()
        {
            Termica.FechaConexaoImpressora();
        }

        public int AvancaLinhas(int linesNumber)
        {
            return Termica.AvancaPapel(linesNumber);
        }

        public int CutPaper(int cut)
        {
            return Termica.Corte(cut);
        }

        private int CodeOfBarCode(String barCodeName)
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

        public int ImprimeBarCode(Dictionary<string, string> dictionary)
        {

            int barCodeType = CodeOfBarCode((String)dictionary["barCodeType"]);
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

        public int ImprimeQR_CODE(Dictionary<string, string> dictionary)
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

        public int ImprimeXMLNFCe(Dictionary<string, string> dictionary)
        {
            //String xmlNFCe = (String)dictionary["xmlNFCe"];
            String xmlNFCe = this.xmlNFCE;
            int indexcsc = (int)Int32.Parse(dictionary["indexcsc"]);
            String csc = (String)dictionary["csc"];
            int param = (int)Int32.Parse(dictionary["param"]);
            return Termica.ImprimeXMLNFCe(xmlNFCe, indexcsc, csc, param);
        }

        public int ImprimeXMLSAT(Dictionary<string, string> dictionary)
        {
            //String xml = (String) dictionary["xmlSAT"];
            String xml = this.xmlSat;
            int param = (int)Int32.Parse(dictionary["param"]);
            return Termica.ImprimeXMLSAT(xml, param);
        }

        public int StatusGaveta()
        {
            return Termica.StatusImpressora(1);
        }

        public int AbrirGaveta()
        {
            return Termica.AbreGavetaElgin();
        }

        public int StatusSensorPapel()
        {
            return Termica.StatusImpressora(3);
        }

        public int ImprimeCupomTEF(Dictionary<string, string> dictionary)
        {
            String base64 = (String)dictionary["base64"]; 

            return Termica.ImprimeCupomTEF(base64);
        }

        public int ImprimeTexto(Dictionary<string, string> dictionary)
        {
            String text = (String) dictionary["text"];
            String align = (String) dictionary["align"];
            String font = (String) dictionary["font"];
            int fontSize = (int) Int32.Parse(dictionary["fontSize"]);
            Boolean isBold = (Boolean) Convert.ToBoolean(dictionary["isBold"]);
            Boolean isUnderline = (Boolean) Convert.ToBoolean(dictionary["isUnderline"]);
          

            int result;
            int styleValue = 0;


            // ALINHAMENTO VALUE
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

            // ESTILO VALUE
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

        public int ImprimeImagemPadrao()
        {
            Bitmap bitmap;
            int id = mContext.ApplicationContext.Resources.GetIdentifier("elgin_logo_default_print_image", "drawable", mContext.ApplicationContext.PackageName);
            bitmap = BitmapFactory.DecodeResource(mContext.ApplicationContext.Resources, id);

            return Termica.ImprimeBitmap(bitmap);
        }

        public int ImprimeImagem(Stream stream)
        {
            int result;

            Bitmap bitmap = BitmapFactory.DecodeStream(stream);
            result = Termica.ImprimeBitmap(bitmap);
            return result;
        }

        protected string CarregarArquivo(string nomeArquivo)
        {
            var stream = mContext.Resources.OpenRawResource(this.mContext.Resources.GetIdentifier(nomeArquivo, "raw", mContext.PackageName));
            string conteudoArquivo = "";
            using (var reader = new StreamReader(stream))
            {
                conteudoArquivo = reader.ReadToEnd();
            }
            return conteudoArquivo;

        }

    }

}