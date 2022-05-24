using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class NFCEPage : ContentPage
    {
        IIt4r it4rService = DependencyService.Get<IIt4r>();
        IPrinter printerService = DependencyService.Get<IPrinter>();

        public NFCEPage()
        {
            InitializeComponent();

            printerService.PrinterInternalImpStart();

            productNameEntry.Text = "CAFE";

            productPriceEntry.Text = "R$ 8.00";
            productPriceEntry.TextChanged += OnFinancialTextChanged;

            //Função que configura NFC-e para a emissão, após a sua execução ocorrer corretamente o botão para o envio da NFc-e deve ser habilitado
            btnConfigurateNfce.Clicked += async delegate
            {
                if (await IsStoragePermissionGranted()) { 
                    try
                    {
                        it4rService.ConfigurarXmlNfce();
                        DependencyService.Get<IMessage>().LongAlert("NFC-e configurada com sucesso!");
                        btnSendNfceSale.IsEnabled = true;
                        btnSendNfceSale.BackgroundColor = Color.FromHex("#0069A5");
                    }
                    catch (Exception e)
                    {
                        DependencyService.Get<IMessage>().LongAlert("Erro na configuração de NFC-e");
                        btnSendNfceSale.IsEnabled = false;
                        btnSendNfceSale.BackgroundColor = Color.LightGray;
                        Console.WriteLine(e.Message);
                    }
                }
            };

            //Função do envio de venda NFC-e, essa função configura a venda com os dados da tela e em seguida tenta emitir a nota e por ultimo faz impressão da nota (Caso tenha ocorrido algum erro durante a emissão da nota é feita a impressão da nota em contingência).
            btnSendNfceSale.Clicked += delegate
            {
                //É feita uma venda antes da venda antes para que a nossa venda não seja omitida, isso é necessário em servidor de homologação
                PreSale();

                // Formatando Valor
                string cleanValue = productPriceEntry.Text.Replace("R$", "").Trim();

                //Configuramos a venda com os dados da tela
                try
                {
                    it4rService.VenderItem(productNameEntry.Text, cleanValue, "123456789012");
                }
                catch (Exception e)
                {
                    DependencyService.Get<IMessage>().LongAlert("Erro na configuração de venda");
                    Console.WriteLine(e.Message);
                    return;
                }

                //Encerramos a venda emitiando a nota para o servidor
                try
                {
                    it4rService.EncerrarVenda(cleanValue, "Dinheiro");
                    DisplayAlert("NFC-e", "NFC -e emitida com sucesso!", "OK");
                }
                catch (Exception e)
                {
                    DisplayAlert("NFC-e", "Erro ao emitir NFC-e online, a impressão será da nota em contigência!", "OK");
                    Console.WriteLine(e.Message);
                }

                //Se a o tempo de emissão calculado for diferente de 0 então a nota não foi emitida em contigência offline, e o tempo de emissão calculado será exposto na tela
                if (it4rService.GetTimeElapsedInLastEmission() != 0)
                    lblCronometerValue.Text = string.Format("{0} SEGUNDOS", it4rService.GetTimeElapsedInLastEmission() / 1000);
                else
                    lblCronometerValue.Text = "";

                //Expõe o número da nota emitida
                lblLastNfceNumber.Text = it4rService.GetNumeroNota();
                //Expões a série emitida
                lblLastNfceSerie.Text = it4rService.GetNumeroSerie();

                //Impressão da NFC-e
                Dictionary<string, object> mapValues = new Dictionary<string, object>();

                mapValues["xmlNFCe"] = it4rService.GetTextOfFile();
                mapValues["indexcsc"] = 1;
                mapValues["csc"] = "1A451E99-0FE0-4C13-B97E-67D698FFBC37";
                mapValues["param"] = 0;

                printerService.ImprimeXMLNFCe(mapValues);
                printerService.CutPaper(5);
            };
        }

        //Como no App_Experience é feita uma venda em ambiente de homologação, e uma nota emitida nesse ambiente sempre aparece com a primeira compra emitida, será feita uma venda com valor nulo para que a venda feita na aplicação não seja omitida
        public void PreSale()
        {
            try
            {
                it4rService.VenderItem("I", "0.00", "123456789011");
            }
            catch (Exception e)
            {
                DependencyService.Get<IMessage>().LongAlert("Erro na configuração de venda");
                Console.WriteLine(e.Message);
                return;
            }
        }

        public async Task<bool> IsStoragePermissionGranted()
        {
            var writeExternalStoragePermission = DependencyService.Get<IWriteExternalStoragePermission>();
            var status = await writeExternalStoragePermission.CheckStatusAsync();

            if (status != PermissionStatus.Granted)
            {
                status = await writeExternalStoragePermission.RequestAsync();
            }
            return status == PermissionStatus.Granted;
        }

        private void OnFinancialTextChanged(object sender, TextChangedEventArgs e)
        {
            var entry = (Entry)sender;

            var amt = e.NewTextValue.Replace("R$", "").Trim();

            if (decimal.TryParse(amt, out decimal num))
            {
                // Init our number
                if (string.IsNullOrEmpty(e.OldTextValue))
                {
                    num = num / 100;
                }
                // Shift decimal to right if added a decimal digit
                else if (num.DecimalDigits() > 2 && !e.IsDeletion())
                {
                    num = num * 10;
                }
                // Shift decimal to left if deleted a decimal digit
                else if (num.DecimalDigits() < 2 && e.IsDeletion())
                {
                    num = num / 10;
                }

                entry.Text = num.ToString("C");
            }
            else
            {
                entry.Text = e.OldTextValue;
            }
        }
    }
}