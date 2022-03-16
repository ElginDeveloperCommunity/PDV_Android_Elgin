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
                int printTextResult = DependencyService.Get<IPrinter>().ImprimeTexto(parametros);
                int avancaLinhas = DependencyService.Get<IPrinter>().AvancaLinhas(10);
            }

            if (isCutPaper.IsChecked)
            {
                int cutPaperResult = DependencyService.Get<IPrinter>().CutPaper(10);
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

            int imprimirXMLNFCe = DependencyService.Get<IPrinter>().ImprimeXMLNFCe(parametros);
            int avancaLinhas = DependencyService.Get<IPrinter>().AvancaLinhas(10);
            int cutPaperResult = DependencyService.Get<IPrinter>().CutPaper(10);
        }

        private void DoPrinterSat(object sender, EventArgs e)
        {
            parametros = new Dictionary<string, string>
            {
                { "param", "0" }
            };
            int imprimirXMLSAT = DependencyService.Get<IPrinter>().ImprimeXMLSAT(parametros);
            int avancaLinhas = DependencyService.Get<IPrinter>().AvancaLinhas(10);
            int cutPaperResult = DependencyService.Get<IPrinter>().CutPaper(10);
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
            else {
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