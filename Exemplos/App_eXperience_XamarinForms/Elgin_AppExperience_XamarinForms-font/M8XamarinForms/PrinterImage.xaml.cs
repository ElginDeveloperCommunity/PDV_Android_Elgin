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
        private string EXTERNAL_PRINTER_MODEL_I7_PLUS = "i7 Plus";

        private string EXTERNAL_CONNECTION_METHOD_USB = "USB";
        private string EXTERNAL_CONNECTION_METHOD_IP = "IP";

        private string metodoConexao;

        private IPrinter printerService = DependencyService.Get<IPrinter>();

        public PrinterImage(string metodoConexao)
        {
            InitializeComponent();

            //Iniciando impressora
            this.metodoConexao = metodoConexao;
            if (metodoConexao == "interna")
            {
                printerService.PrinterInternalImpStart();
                internalPrinterRadio.IsChecked = true;
            }
            else if (metodoConexao == "externaIp")
            {
                externalPrinterIpRadio.IsChecked = true;
            }
            else if (metodoConexao == "externaUsb")
            {
                externalPrinterUsbRadio.IsChecked = true;
            }

            internalPrinterRadio.CheckedChanged += PrinterConectionChanged;
            externalPrinterIpRadio.CheckedChanged += PrinterConectionChanged;
            externalPrinterUsbRadio.CheckedChanged += PrinterConectionChanged;

            isCutPaper.IsChecked = false;
            
            displayImage.Source = "elgin_logo_default_print_image.jpg";
        }

        async void OpenPrinterOption(object sender, EventArgs e)
        {
            Button btn = (Button)sender;

            switch (btn.Text)
            {
                case "IMPRESSÃO DE TEXTO":
                    await Navigation.PushAsync(new PrinterPage(metodoConexao));
                    Navigation.RemovePage(this);
                    break;
                case "IMPRESSÃO DE CÓDIGO DE BARRAS":
                    await Navigation.PushAsync(new PrinterBarCode(metodoConexao));
                    Navigation.RemovePage(this);
                    break;
                case "IMPRESSÃO DE IMAGEM":
                    await Navigation.PushAsync(new PrinterImage(metodoConexao));
                    Navigation.RemovePage(this);
                    break;
            }
        }

        private async void OpenSelectionImage(object sender, EventArgs e)
        {
            Stream imageStream = await printerService.GetImageStreamAsync();
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
                Console.WriteLine("ImprimeImagem: FIM {0}", printerService.ImprimeImagem(selectedImage).ToString());
            }
            else
            {
                //printerInstance.imprimeImagem(bitmap);
                Console.WriteLine("ImprimeImagemPadrao: FIM {0}", printerService.ImprimeImagemPadrao().ToString());
            }

            printerService.JumpLine();
            printerService.JumpLine();

            if (isCutPaper.IsChecked)
            {
                printerService.CutPaper(1);
            }
        }

        private void DoPrinterStatus(object sender, EventArgs e)
        {
            int statusImpressora = printerService.StatusSensorPapel();
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
            int statusGaveta = printerService.StatusGaveta();
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
            printerService.AbrirGaveta();
        }

        public bool IsIpValid(string ipserver)
        {
            return printerService.IsIpValid(ipserver);
        }

        private void PrinterConectionChanged(object sender, CheckedChangedEventArgs e)
        {
            RadioButton rb = sender as RadioButton;
            if (!rb.IsChecked) return;

            var conection = ipEntry.Text;

            if (rb == internalPrinterRadio)
            {
                printerService.PrinterInternalImpStart();
                metodoConexao = "interna";
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
                    metodoConexao = "interna";
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
            metodoConexao = "externaIp";
            int result = printerService.PrinterExternalImpStartByIP(selectedPrinterModel, ipAndPort[0], int.Parse(ipAndPort[1]));
            Console.WriteLine("RESULT EXTERN - IP: " + result);

            if (result != 0)
            {
                DisplayAlert("Alerta", "A tentativa de conexão por IP não foi bem sucedida!", "OK");
                printerService.PrinterInternalImpStart();
                internalPrinterRadio.IsChecked = true;
                metodoConexao = "interna";
            }
        }

        public void ConnectExternPrinterByUSB(string model)
        {
            metodoConexao = "externaUsb";
            int result = printerService.PrinterExternalImpStartByUSB(model);
            Console.WriteLine("RESULT EXTERN - USB: " + result);

            if (result != 0)
            {
                DisplayAlert("Alerta", "A tentativa de conexão por USB não foi bem sucedida!", "OK");
                printerService.PrinterInternalImpStart();
                internalPrinterRadio.IsChecked = true;
                metodoConexao = "interna";
            }
        }

        public async void AlertDialogSetSelectedPrinterModelThenConnect(string externalConnectionMethod)
        {
            string[] models = { EXTERNAL_PRINTER_MODEL_I9, EXTERNAL_PRINTER_MODEL_I8, EXTERNAL_PRINTER_MODEL_I7_PLUS };
            if (externalConnectionMethod == EXTERNAL_CONNECTION_METHOD_IP)
            {
                models = models[..2];
            }
            string option = await DisplayActionSheet("Selecione o modelo de impressora a ser conectado", "CANCELAR", null, models);

            if (option == null)
            {
                printerService.PrinterInternalImpStart();
                internalPrinterRadio.IsChecked = true;
                metodoConexao = "interna";
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