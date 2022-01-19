using Java.Util.Regex;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using Android.App;

namespace M8XamarinForms
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class PrinterBarCode : ContentPage
    {
        
        Dictionary<string, string> parametros;
        public PrinterBarCode()
        {
            InitializeComponent();
            //Iniciando impressora interna
            int internalPrinterStartResult = DependencyService.Get<IPrinter>().PrinterInternalImpStart();
            internalPrinterRadio.IsChecked = true;
            

            

            barCodeType.Items.Add("EAN 8");
            barCodeType.Items.Add("EAN 13");
            barCodeType.Items.Add("QR CODE");
            barCodeType.Items.Add("UPC-A");
            barCodeType.Items.Add("UPC-E");
            barCodeType.Items.Add("CODE 39");
            barCodeType.Items.Add("ITF");
            barCodeType.Items.Add("CODE BAR");
            barCodeType.Items.Add("CODE 93");
            barCodeType.Items.Add("CODE 128");

            heigthPicker.Items.Add("20");
            heigthPicker.Items.Add("60");
            heigthPicker.Items.Add("120");
            heigthPicker.Items.Add("200");

            widthPicker.Items.Add("1");
            widthPicker.Items.Add("2");
            widthPicker.Items.Add("3");
            widthPicker.Items.Add("4");
            widthPicker.Items.Add("5");
            widthPicker.Items.Add("6");

            codeEntry.Text = "40170725";
            barCodeType.SelectedIndex = 0;
            alignEsq.IsChecked = true;
            widthPicker.SelectedIndex = 0;
            heigthPicker.SelectedIndex = 0;
           
            isCutPaper.IsChecked = false;

        }


        async void openPrinterOption(object sender, EventArgs e)
        {
            var btn = (Button)sender;

            switch (btn.Text)
            {
                case "IMPRESSÃO DE TEXTO":
                    await Navigation.PushAsync(new PrinterPage());
                    Navigation.RemovePage(this);
                    break;
                case "IMPRESSÃO DE CÓDIGO DE BARRAS":
                    await Navigation.PushAsync(new PrinterBarCode());
                    Navigation.RemovePage(this);
                    break;
                case "IMPRESSÃO DE IMAGEM":
                    await Navigation.PushAsync(new PrinterImage());
                    Navigation.RemovePage(this);
                    break;


            }

        }

        private void doPrinterBarCode(object sender, EventArgs e)
        {

            if (codeEntry.Text == "") 
            {
                DisplayAlert("Campo Vazio", "A entrada do Código de Barras está vazio, insira um valor", "OK");
            }
            else{
                if(barCodeType.Items[barCodeType.SelectedIndex]=="QR CODE")
                {
                    doPrinterQrCode();
                }
                else
                {
                    doPrinterBarcodeDefault();
                }
            }


        }

        private void doPrinterBarcodeDefault()
        {
            parametros = new Dictionary<string, string>();

            var codeString = codeEntry.Text;
            var selectedBarCodeType = barCodeType.Items[barCodeType.SelectedIndex];
            var align = " ";
            var selectedHeigth = heigthPicker.Items[heigthPicker.SelectedIndex];
            var selectedWidth = widthPicker.Items[widthPicker.SelectedIndex];
            var isCutPaperCheck = isCutPaper.IsChecked;

            if (alignEsq.IsChecked)
            {
                align = "Esquerda";
            }
            else if (alignCent.IsChecked)
            {
                align = "Centralizado";
            }
            else if(alignDir.IsChecked)
            {
                align = "Direita";
            }

            parametros.Add("barCodeType", selectedBarCodeType);
            parametros.Add("text", codeString);
            parametros.Add("height", selectedHeigth);
            parametros.Add("width", selectedWidth);
            parametros.Add("align", align);

            int printCodeResult = DependencyService.Get<IPrinter>().ImprimeBarCode(parametros);
            int avancaLinhas = DependencyService.Get<IPrinter>().AvancaLinhas(10);

            if(isCutPaper.IsChecked)
            {
                int cutPaperResult = DependencyService.Get<IPrinter>().CutPaper(10);
            }

           

        }

        private void doPrinterQrCode()
        {
            parametros = new Dictionary<string, string>();
            var selectedWidth = widthPicker.Items[widthPicker.SelectedIndex];
            var codeString = codeEntry.Text;
            var align = " ";

            if (alignEsq.IsChecked)
            {
                align = "Esquerda";
            }
            else if (alignCent.IsChecked)
            {
                align = "Centralizado";
            }
            else if (alignDir.IsChecked)
            {
                align = "Direita";
            }

            parametros.Add("qrSize", selectedWidth);
            parametros.Add("text", codeString);
            parametros.Add("align", align);

            int printCodeResult = DependencyService.Get<IPrinter>().ImprimeQR_CODE(parametros);
            int avancaLinhas = DependencyService.Get<IPrinter>().AvancaLinhas(10);

            if (isCutPaper.IsChecked)
            {
                int cutPaperResult = DependencyService.Get<IPrinter>().CutPaper(10);
            }
        }

        private void setTypeCodeMessage(object sender, EventArgs e)
        {
            if(barCodeType.Items[barCodeType.SelectedIndex]=="QR CODE")
            {
                heigthStack.IsVisible = false;
            }
            else
            {
                heigthStack.IsVisible = true;
            }
            switch (barCodeType.Items[barCodeType.SelectedIndex])
            {
                case "EAN 8":
                    codeEntry.Text = "40170725";
                    break;
                case "EAN 13":
                    codeEntry.Text = "0123456789012";
                    break;
                case "QR CODE":
                    codeEntry.Text = "ELGIN DEVELOPERS COMMUNITY";
                    break;
                case "UPC-A":
                    codeEntry.Text = "123601057072";
                    break;
                case "UPC-E":
                    codeEntry.Text = "1234567";
                    break;
                case "CODE 39":
                    codeEntry.Text = "*ABC123*";
                    break;
                case "ITF":
                    codeEntry.Text = "05012345678900";
                    break;
                case "CODE BAR":
                    codeEntry.Text = "A3419500A";                 
                    break;
                case "CODE 93":
                    codeEntry.Text = "ABC123456789";
                    break;
                case "CODE 128":
                    codeEntry.Text = "{C1233";
                    break;


            }
        }

        private void doPrinterStatus(object sender, EventArgs e)
        {
            int statusImpressora = DependencyService.Get<IPrinter>().StatusSensorPapel();
            switch (statusImpressora)
            {
                case 5:
                    DisplayAlert("Status da Impressora", "Papel está presente e não está próximo do fim!", "OK");
                    break;
                case 6:
                    DisplayAlert("Status da Impressora", "Papel está próximo do fim!", "OK");
                    break;
                case 7:
                    DisplayAlert("Status da Impressora", "Papel ausente!", "OK");
                    break;
                default:
                    DisplayAlert("Status da Impressora", "Status Desconhecido", "OK");
                    break;
            }
        }
        private void doGavetaStatus(object sender, EventArgs e)
        {
            int statusGaveta = DependencyService.Get<IPrinter>().StatusGaveta();
            switch (statusGaveta)
            {
                case 1:
                    DisplayAlert("Status da Impressora", "Gaveta aberta!", "OK");
                    break;
                case 2:
                    DisplayAlert("Status da Impressora", "Gaveta fechada!", "OK");
                    break;
                default:
                    DisplayAlert("Status da Impressora", "Status Desconhecido", "OK");
                    break;
            }
        }

        private void doOpenGaveta(object sender, EventArgs e)
        {
            int openGaveta = DependencyService.Get<IPrinter>().AbrirGaveta();
        }

        public static bool IsIpValid(string ipserver)
        {
            Console.WriteLine(ipserver);
            Java.Util.Regex.Pattern p = Java.Util.Regex.Pattern.Compile(@"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\:\d{1,5}\b");

            Matcher m = p.Matcher(ipserver);
            bool b = m.Matches();

            return b;
        }
        private void printerConectionChanged(object sender, CheckedChangedEventArgs e)
        {
            parametros = new Dictionary<string, string>();

            var conection = ipEntry.Text;
            string[] entrada = conection.Split(':');
            var ip = entrada[0];
            var porta = entrada[1];

            parametros.Add("ip", ip);
            parametros.Add("port", porta);


            if (internalPrinterRadio.IsChecked)
            {
                int internalPrinterStartResult = DependencyService.Get<IPrinter>().PrinterInternalImpStart();

            }
            else
            {
                if (IsIpValid(conection))
                {
                    var externalPrinterConection = DependencyService.Get<IPrinter>().PrinterExternalImpStart(parametros);
                }
                else
                {
                    DisplayAlert("Entrada Inválida", "Por favor, insira uma entrada válida", "OK");
                    internalPrinterRadio.IsChecked = true;
                }


            }

        }
    }
}