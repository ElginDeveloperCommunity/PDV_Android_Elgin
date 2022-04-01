using System;
using System.Collections.Generic;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class PrinterPage : ContentPage
    {
        Dictionary<string, string> parametros;
        public string selectedPrinterModel;

        private string EXTERNAL_PRINTER_MODEL_I9 = "i9";
        private string EXTERNAL_PRINTER_MODEL_I8 = "i8";

        public PrinterPage()
        {
            InitializeComponent();

            //Iniciando impressora interna
            int internalPrinterStartResult = DependencyService.Get<IPrinter>().PrinterInternalImpStart();
            internalPrinterRadio.IsChecked = true;

            fontFamilyPicker.Items.Add("FONT A");
            fontFamilyPicker.Items.Add("FONT B");
            fontSizePicker.Items.Add("17");
            fontSizePicker.Items.Add("34");
            fontSizePicker.Items.Add("51");
            fontSizePicker.Items.Add("68");

            textEntry.Text = "ELGIN DEVELOPERS COMMUNITY";
            alignEsq.IsChecked = true;
            fontFamilyPicker.SelectedIndex = 0;
            fontSizePicker.SelectedIndex = 0;
            isCutPaper.IsChecked = false;

            MessagingCenter.Subscribe<Application, Dictionary<string,string> >(Application.Current, "Tef_Message", (n_sender, resposta) =>
            {
                DisplayAlert("titulo", resposta["key"], "que");
            });
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
                default:
                    break;
            }
        }

        private void DoPrinterText(object sender, EventArgs e)
        {
            parametros = new Dictionary<string, string>();

            string align = " ";

            if (alignEsq.IsChecked)
            {
                align = "Esquerda";
            }
            if (alignCent.IsChecked)
            {
                align = "Centralizado";
            }
            if (alignDir.IsChecked)
            {
                align = "Direita";
            }

            string selectedFontFamily = fontFamilyPicker.Items[fontFamilyPicker.SelectedIndex];
            string selectedFontSize = fontSizePicker.Items[fontSizePicker.SelectedIndex];
            string varText = textEntry.Text;

            parametros.Add("text", varText);
            parametros.Add("align", align);
            parametros.Add("font", selectedFontFamily);
            parametros.Add("fontSize", selectedFontSize);
            if (isBold.IsChecked) parametros.Add("isBold", "true");
            else parametros.Add("isBold", "false");

            if (isSub.IsChecked) parametros.Add("isUnderline", "true");
            else parametros.Add("isUnderline", "false");

            if (textEntry.Text.Equals(""))
            {
                DisplayAlert("Entrada Vazia", "Por favor, insira uma entrada de texto", "OK");
            }
            else
            {
                DependencyService.Get<IPrinter>().ImprimeTexto(parametros);
                DependencyService.Get<IPrinter>().JumpLine();
            }

            if (isCutPaper.IsChecked)
            {
                DependencyService.Get<IPrinter>().CutPaper(1);
            }

        }

        private void DoPrinterNfce(object sender, EventArgs e)
        {
            parametros = new Dictionary<string, string>
            {
                { "indexcsc", "1" },
                { "csc", "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES" },
                { "param", "0" }
            };

            DependencyService.Get<IPrinter>().ImprimeXMLNFCe(parametros);
            DependencyService.Get<IPrinter>().JumpLine();
            DependencyService.Get<IPrinter>().CutPaper(1);
        }

        private void DoPrinterSat(object sender, EventArgs e)
        {
            parametros = new Dictionary<string, string>
            {
                { "param", "0" }
            };
            DependencyService.Get<IPrinter>().ImprimeXMLSAT(parametros);
            DependencyService.Get<IPrinter>().JumpLine();
            DependencyService.Get<IPrinter>().CutPaper(1);
        }
        
        private void DoPrinterStatus(object sender, EventArgs e)
        {
            int statusImpressora = DependencyService.Get<IPrinter>().StatusSensorPapel();
            switch (statusImpressora) {
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
            int openGaveta = DependencyService.Get<IPrinter>().AbrirGaveta();
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
            
            if (option == null) {
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