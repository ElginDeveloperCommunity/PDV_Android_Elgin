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
        public string selectedPrinterModel;

        private string EXTERNAL_PRINTER_MODEL_I9 = "i9";
        private string EXTERNAL_PRINTER_MODEL_I8 = "i8";

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
          
            DependencyService.Get<IPrinter>().JumpLine();

            if (isCutPaper.IsChecked)
            {
                DependencyService.Get<IPrinter>().CutPaper(1);
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
            RadioButton rb = sender as RadioButton;
            if (!rb.IsChecked) return;

            string EXTERNAL_CONNECTION_METHOD_USB = "USB";
            string EXTERNAL_CONNECTION_METHOD_IP = "IP";

            var conection = ipEntry.Text;

            if (rb == internalPrinterRadio)
            {
                DependencyService.Get<IPrinter>().PrinterInternalImpStart();
            }
            else if (rb == externalPrinterUsbRadio)
            {
                //Invoca o alertDialog que permite a escolha do modelo de impressora antes da tentativa de iniciar a conexão por IP
                AlertDialogSetSelectedPrinterModelThenConnect(EXTERNAL_CONNECTION_METHOD_USB);
            }
            else if (rb == externalPrinterIpRadio)
            {
                if (IsIpValid(conection))
                {
                    //Invoca o alertDialog que permite a escolha do modelo de impressora antes da tentativa de iniciar a conexão por IP
                    AlertDialogSetSelectedPrinterModelThenConnect(EXTERNAL_CONNECTION_METHOD_IP);
                }
                else
                {
                    DisplayAlert("Entrada Inválida", "Por favor, insira um IP válido", "OK");
                    internalPrinterRadio.IsChecked = true;
                }
            }
        }

        public void ConnectExternPrinterByIP(string ip)
        {
            string[] ipAndPort = ip.Split(':');

            // Ao informar um IP inválido, o retorno da função pode demorar e parecer que a aplicação travou,
            // mas a respota chega eventualmente.
            // Não é possível usar async/await pois para isso o método da lib Termica.AbreConexaoImpressora
            // não retorna uma Task
            int result = DependencyService.Get<IPrinter>().PrinterExternalImpStartByIP(selectedPrinterModel, ipAndPort[0], int.Parse(ipAndPort[1]));
            Console.WriteLine("RESULT EXTERN - IP: " + result);

            if (result != 0)
            {
                DisplayAlert("Alerta", "A tentativa de conexão por IP não foi bem sucedida!", "OK");
                DependencyService.Get<IPrinter>().PrinterInternalImpStart();
                internalPrinterRadio.IsChecked = true;
            }

        }

        public void ConnectExternPrinterByUSB(string model)
        {
            int result = DependencyService.Get<IPrinter>().PrinterExternalImpStartByUSB(model);
            Console.WriteLine("RESULT EXTERN - USB: " + result);

            if (result != 0)
            {
                DisplayAlert("Alerta", "A tentativa de conexão por USB não foi bem sucedida!", "OK");
                DependencyService.Get<IPrinter>().PrinterInternalImpStart();
                internalPrinterRadio.IsChecked = true;
            }
        }

        public async void AlertDialogSetSelectedPrinterModelThenConnect(string externalConnectionMethod)
        {
            string[] models = { EXTERNAL_PRINTER_MODEL_I9, EXTERNAL_PRINTER_MODEL_I8 };
            string option = await DisplayActionSheet("Selecione o modelo de impressora a ser conectado", "CANCELAR", null, models);

            if (option == null)
            {
                DependencyService.Get<IPrinter>().PrinterInternalImpStart();
                internalPrinterRadio.IsChecked = true;
                return;
            }

            // Atualiza o modelo de impressora selecionado
            selectedPrinterModel = option;


            //inicializa depois da seleção do modelo a conexão de impressora, levando em contra o parâmetro que define se a conexão deve ser via IP ou USB
            if (externalConnectionMethod.Equals("USB"))
            {
                ConnectExternPrinterByUSB(selectedPrinterModel);
            }
            else ConnectExternPrinterByIP(ipEntry.Text);
        }
    }
}