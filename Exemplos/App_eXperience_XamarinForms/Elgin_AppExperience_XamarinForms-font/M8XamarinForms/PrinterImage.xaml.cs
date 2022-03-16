using System;
using System.IO;
using System.Collections.Generic;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{

    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class PrinterImage : ContentPage
    {
        Stream selectedImage;

        public PrinterImage()
        {
            InitializeComponent();
           
            //Iniciando impressora interna
            DependencyService.Get<IPrinter>().PrinterInternalImpStart();
            internalPrinterRadio.IsChecked = true;
            isCutPaper.IsChecked = false;
            
            displayImage.Source = "elgin_logo_default_print_image.jpg";
        }

        async void OpenPrinterOption(object sender, EventArgs e)
        {
            Button btn = (Button)sender;

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

        private async void OpenSelectionImage(object sender, EventArgs e)
        {
            Stream imageStream = await DependencyService.Get<IPrinter>().GetImageStreamAsync();
            if (imageStream != null)
            {
                selectedImage = new MemoryStream();
                imageStream.CopyTo(selectedImage);

                // RESETAR STREAMS
                selectedImage.Position = 0;
                imageStream.Position = 0;

                displayImage.Source = ImageSource.FromStream(() => imageStream);
            }
        }

        private void DoPrinterImage(object sender, EventArgs e)
        {
            if (selectedImage != null)
            {
                //printerInstance.imprimeImagem(bitmap);
                selectedImage.Position = 0;
                Console.WriteLine("ImprimeImagem: FIM {0}", DependencyService.Get<IPrinter>().ImprimeImagem(selectedImage).ToString());
            }
            else
            {
                //printerInstance.imprimeImagem(bitmap);
                Console.WriteLine("ImprimeImagemPadrao: FIM {0}", DependencyService.Get<IPrinter>().ImprimeImagemPadrao().ToString());
            }
          
            DependencyService.Get<IPrinter>().AvancaLinhas(10);

            if (isCutPaper.IsChecked)
            {
                DependencyService.Get<IPrinter>().CutPaper(10);
            }
        }

        private void DoPrinterStatus(object sender, EventArgs e)
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
        private void DoGavetaStatus(object sender, EventArgs e)
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

        private void DoOpenGaveta(object sender, EventArgs e)
        {
            DependencyService.Get<IPrinter>().AbrirGaveta();
        }

        public static bool IsIpValid(string ipserver)
        {
            return DependencyService.Get<IPrinter>().IsIpValid(ipserver);
        }

        private void PrinterConectionChanged(object sender, CheckedChangedEventArgs e)
        {
            Dictionary<string, string>  parametros = new Dictionary<string, string>();

            string conection = ipEntry.Text;
            string[] entrada = conection.Split(':');
            string ip = entrada[0];
            string porta = entrada[1];

            parametros.Add("ip", ip);
            parametros.Add("port", porta);


            if (internalPrinterRadio.IsChecked)
            {
                DependencyService.Get<IPrinter>().PrinterInternalImpStart();
            }
            else
            {
                if (IsIpValid(conection))
                {
                    DependencyService.Get<IPrinter>().PrinterExternalImpStart(parametros);
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