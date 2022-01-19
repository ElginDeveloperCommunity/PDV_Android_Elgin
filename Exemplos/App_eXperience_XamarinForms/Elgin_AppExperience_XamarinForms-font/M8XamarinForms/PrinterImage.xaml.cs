using Android.Graphics;
using Java.Util.Regex;
using System;
using System.Collections.Generic;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{

    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class PrinterImage : ContentPage
    {
        Bitmap selectedImageBitmap;
        FileResult photo;
        bool isImageselected;
        Dictionary<string, string> parametros;
        public PrinterImage()
        {
            InitializeComponent();
           
            isImageselected = false;
            //Iniciando impressora interna
            int internalPrinterStartResult = DependencyService.Get<IPrinter>().PrinterInternalImpStart();
            internalPrinterRadio.IsChecked = true;
            isCutPaper.IsChecked = false;
            
            displayImage.Source = "elgin.jpg";
            
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

        private async void openSelectionImage(object sender, EventArgs e)
        {
            try
            {
                isImageselected = true;
                photo = await MediaPicker.PickPhotoAsync();
                selectedImageBitmap = BitmapFactory.DecodeFile(photo.FullPath);
                displayImage.Source = photo.FullPath;
            }
            catch (Exception)
            {
                await DisplayAlert("Erro na seleção", "Nenhuma Imagem foi selecionada", "OK");
            }
        }

        private void doPrinterImage(object sender, EventArgs e)
        {


            if (isImageselected)
            {
                int imprimirImagem = DependencyService.Get<IPrinter>().ImprimeImagem(selectedImageBitmap);
            }
            else
            {
                int imprimirImagem = DependencyService.Get<IPrinter>().ImprimeImagemPadrao();
            }
          
            int avancaLinhas = DependencyService.Get<IPrinter>().AvancaLinhas(10);
            if (isCutPaper.IsChecked)
            {
                int cutPaperResult = DependencyService.Get<IPrinter>().CutPaper(10);
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