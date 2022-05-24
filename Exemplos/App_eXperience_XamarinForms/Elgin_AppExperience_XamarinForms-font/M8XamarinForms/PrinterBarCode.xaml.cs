using System;
using System.Collections.Generic;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class PrinterBarCode : ContentPage
    {
        Dictionary<string, string> parametros;
        public string selectedPrinterModel;

        private string EXTERNAL_PRINTER_MODEL_I9 = "i9";
        private string EXTERNAL_PRINTER_MODEL_I8 = "i8";

        private string metodoConexao;

        private IPrinter printerService = DependencyService.Get<IPrinter>();

        public PrinterBarCode(string metodoConexao)
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

        private async void OpenPrinterOption(object sender, EventArgs e)
        {
            var btn = (Button)sender;

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

        private void DoPrinterBarCode(object sender, EventArgs e)
        {

            if (codeEntry.Text == "") 
            {
                DisplayAlert("Campo Vazio", "A entrada do Código de Barras está vazio, insira um valor", "OK");
            }
            else{
                if(barCodeType.Items[barCodeType.SelectedIndex]=="QR CODE")
                {
                    DoPrinterQrCode();
                }
                else
                {
                    DoPrinterBarcodeDefault();
                }
            }


        }

        private void DoPrinterBarcodeDefault()
        {
            parametros = new Dictionary<string, string>();

            string codeString = codeEntry.Text;
            string selectedBarCodeType = barCodeType.Items[barCodeType.SelectedIndex];
            string align = " ";
            string selectedHeigth = heigthPicker.Items[heigthPicker.SelectedIndex];
            string selectedWidth = widthPicker.Items[widthPicker.SelectedIndex];
            bool isCutPaperCheck = isCutPaper.IsChecked;

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

            printerService.ImprimeBarCode(parametros);
            printerService.JumpLine();
            printerService.JumpLine();

            if (isCutPaperCheck)
            {
                printerService.CutPaper(1);
            }

        }

        private void DoPrinterQrCode()
        {
            parametros = new Dictionary<string, string>();
            string selectedWidth = widthPicker.Items[widthPicker.SelectedIndex];
            string codeString = codeEntry.Text;
            string align = " ";

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

            printerService.ImprimeQR_CODE(parametros);
            printerService.JumpLine();
            printerService.JumpLine();

            if (isCutPaper.IsChecked)
            {
                printerService.CutPaper(1);
            }
        }

        private void SetTypeCodeMessage(object sender, EventArgs e)
        {
            heigthStack.IsVisible = barCodeType.Items[barCodeType.SelectedIndex]!="QR CODE";

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

        public bool IsIpValid(string ip)
        {
            return printerService.IsIpValid(ip);
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
            string[] models = { EXTERNAL_PRINTER_MODEL_I9, EXTERNAL_PRINTER_MODEL_I8 };
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