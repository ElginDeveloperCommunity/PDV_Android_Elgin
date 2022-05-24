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
        private Context mContext;

        //Variavel utilizada para a verificação de se a conexão atual é por impressora interna ou não
        public bool isPrinterInternSelected;

        public Printer()
        {
            //mActivity = activity;
            //Termica.SetContext(mActivity);
        }

        public void SetActivity(Context context)
        {
            mContext = context;

            Termica.SetContext(context);
        }
        public int PrinterInternalImpStart()
        {
            PrinterStop();
            int result = Termica.AbreConexaoImpressora(6, "M8", "", 0);

            if (result == 0) isPrinterInternSelected = true;

            return result;
        }

        public int PrinterExternalImpStartByIP(string model, string ip, int port)
        {
            PrinterStop();
            try {
                int result = Termica.AbreConexaoImpressora(3, model, ip, port);

                if (result == 0) isPrinterInternSelected = false;

                return result;
            }
            catch (Exception)
            {
                return PrinterInternalImpStart();
            }
        }

        public int PrinterExternalImpStartByUSB(string model)
        {
            PrinterStop();
            try
            {
                int result = Termica.AbreConexaoImpressora(1, model, "USB", 0);

                if (result == 0) isPrinterInternSelected = false;

                return result;
            }
            catch (Exception)
            {
                return PrinterInternalImpStart();
            }
        }

        public void PrinterStop()
        {
            Termica.FechaConexaoImpressora();
        }

        public int AvancaLinhas(int linesNumber)
        {
            Log.Debug("PRINTER", "Antes de avançar " + linesNumber + " linhas");
            return Termica.AvancaPapel(linesNumber);
            Log.Debug("PRINTER", "Depois de avançar " + linesNumber + " linhas");
        }

        public void JumpLine()
        {
            int quant;
            //Se a impressão for por impressora externa, 5 é o suficiente; 15 caso contrário
            Log.Debug("PRINTER", "É impressora interna: " + isPrinterInternSelected);
            if (!isPrinterInternSelected) { quant = 5; }
            else quant = 15;

            AvancaLinhas(quant);
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

        public int ImprimeXMLNFCe(Dictionary<string, object> map)
        {
            string xml = (string)map["xmlNFCe"];
            int indexcsc = (int)map["indexcsc"];
            string csc = (string)map["csc"];
            int param = (int)map["param"];
            return Termica.ImprimeXMLNFCe(xml, indexcsc, csc, param);
        }

        public int ImprimeXMLSAT(Dictionary<string, object> map)
        {
            string xml = (string)map["xmlSAT"];
            int param = (int)map["param"];
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
            string base64 = dictionary["base64"]; 

            return Termica.ImprimeCupomTEF(base64);
        }

        public int ImprimeTexto(Dictionary<string, string> dictionary)
        {
            string text = dictionary["text"];
            string align = dictionary["align"];
            string font = dictionary["font"];
            int fontSize = int.Parse(dictionary["fontSize"]);
            bool isBold = Convert.ToBoolean(dictionary["isBold"]);
            bool isUnderline = Convert.ToBoolean(dictionary["isUnderline"]);

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

            int result;
            //Verifica se o método de impressão atual é por impressora interna ou externa e utiliza a função adequada para cada um
            if (isPrinterInternSelected) result = Termica.ImprimeBitmap(bitmap);
            else
            {
                result = Termica.ImprimeImagem(bitmap);
            }
            return result;
        }

        public int ImprimeImagem(Stream stream)
        {
            int result;

            Bitmap bitmap = BitmapFactory.DecodeStream(stream);

            //Verifica se o método de impressão atual é por impressora interna ou externa e utiliza a função adequada para cada um
            if (isPrinterInternSelected) result = Termica.ImprimeBitmap(bitmap);
            else
            {
                result = Termica.ImprimeImagem(bitmap);
            }
            return result;
        }

        public string CarregarArquivo(string nomeArquivo)
        {
            var stream = mContext.Resources.OpenRawResource(mContext.Resources.GetIdentifier(nomeArquivo, "raw", mContext.PackageName));
            string conteudoArquivo = "";
            using (var reader = new StreamReader(stream))
            {
                conteudoArquivo = reader.ReadToEnd();
            }
            return conteudoArquivo;
        }

    }

}