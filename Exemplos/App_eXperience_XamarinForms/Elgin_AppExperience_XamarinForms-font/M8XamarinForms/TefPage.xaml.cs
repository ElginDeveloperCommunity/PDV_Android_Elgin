using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{
    [XamlCompilation(XamlCompilationOptions.Compile)]

    public partial class TefPage : ContentPage
    {
        private string selectedTefMeth = "PAYGO";
        private string selectedPayment = "Crédito";
        private string selectedInstallment = "Loja";
        private string lastElginTefNSU = "";

        public TefPage()
        {
            InitializeComponent();
            returnImage.Source = " ";
            ipEntry.IsEnabled = true;
            selectedTefMeth = "PAYGO";
            valorEntry.Text = "100";
            parcelasEntry.Text = "1";
            ipEntry.Text = "192.168.0.31";
            selectedPayment = "Crédito";
            selectedInstallment = "Loja";

            paygoButton.BorderColor = Color.FromHex("23F600");
            CREDITO.BorderColor = Color.FromHex("23F600");
            inCashInstall.BorderColor = Color.FromHex("23F600");

            //Sempre que uma atividade de venda chegar ao final a via do cliente será atualizada!

            //A via retorno do msitef e tefElgin é uma string 
            MessagingCenter.Subscribe<Application, Tuple<string, string>> (Application.Current, "MSitef_viaCliente", (n_sender, resposta) =>
            {
                Console.WriteLine("MSitef_viaCliente");
                Console.WriteLine("VIA CLIENTE " + resposta.Item1);
                Console.WriteLine("NSU_SITEF " + resposta.Item2);
                Console.WriteLine("=============");
                textViewViaTef.Text = resposta.Item1;
                lastElginTefNSU = resposta.Item2;
            });

            //A via retorn do paygo é uma imagem/bitmap recebida como Stream
            MessagingCenter.Subscribe<Application, MemoryStream>(Application.Current, "Paygo_viaCliente", (n_sender, resposta) =>
            {
                returnImage.Source = ImageSource.FromStream(() => resposta);
            });
        }

        private void SendTransactionTEF(object sender, EventArgs e)
        {
            var valor = valorEntry.Text;
            var parcelas = parcelasEntry.Text;
            var ip = ipEntry.Text;

            Dictionary<string, string> parametros = new Dictionary<string, string>();

            if (selectedTefMeth == "M-SITEF")
            {
                parametros.Add("acao", "SALE");
                parametros.Add("ipTef", ip);
                parametros.Add("valor", valor);
                parametros.Add("metodoPagamento", selectedPayment);
                parametros.Add("parcelas", parcelas);

               
                DependencyService.Get<ITef>().SetPrintTrue();
                DependencyService.Get<ITef>().SendSitefParams(parametros);

            }
            else if (selectedTefMeth == "PAYGO")
            {
                parametros.Add("action", "SALE");

                parametros.Add("valor", valor);
                parametros.Add("parcelas", parcelas);
                parametros.Add("formaPagamento", selectedPayment);
                parametros.Add("tipoParcelamento", selectedInstallment);

                DependencyService.Get<ITef>().SetPrintTrue();
                DependencyService.Get<ITef>().SendPaygoParams(parametros);
            }
            else
            {
                parametros.Add("acao", "SALE");

                parametros.Add("valor", valor);
                parametros.Add("parcelas", parcelas);
                parametros.Add("metodoPagamento", selectedPayment);
                parametros.Add("metodoParcelamento", selectedInstallment);

                DependencyService.Get<ITef>().SetPrintTrue();
                DependencyService.Get<ITef>().SendTefElginParams(parametros);
            }
        }

        private void CancelTransactionTEF(object sender, EventArgs e)
        {
            var valor = valorEntry.Text;
            var parcelas = parcelasEntry.Text;
            var ip = ipEntry.Text;

            Dictionary<string, string> parametros = new Dictionary<string, string>();

            if (selectedTefMeth == "M-SITEF")
            {
                parametros.Add("acao", "CANCEL");
                parametros.Add("ipTef", ip);
                parametros.Add("valor", valor);
                parametros.Add("metodoPagamento", selectedPayment);
                parametros.Add("parcelas", parcelas);


                DependencyService.Get<ITef>().SetPrintFalse();
                DependencyService.Get<ITef>().SendSitefParams(parametros);

            }
            else if (selectedTefMeth == "PAYGO")
            {
                parametros.Add("action", "CANCEL");

                parametros.Add("valor", valor);
                parametros.Add("parcelas", parcelas);
                parametros.Add("formaPagamento", selectedPayment);
                parametros.Add("tipoParcelamento", selectedInstallment);

                DependencyService.Get<ITef>().SetPrintFalse();
                DependencyService.Get<ITef>().SendPaygoParams(parametros);
            }
            else
            {
                if (lastElginTefNSU == null)
                {
                    DisplayAlert("Alert", "É necessário realizar uma transação antres para realizar o cancelamento no TEF ELGIN!", "OK");
                    return;
                }
                parametros.Add("acao", "CANCEL");

                parametros.Add("valor", valor);
                parametros.Add("lastElginTefNSU", lastElginTefNSU);

                DependencyService.Get<ITef>().SetPrintFalse();
                DependencyService.Get<ITef>().SendTefElginParams(parametros);
            }
        }

        private void ConfigTEF(object sender, EventArgs e)
        {
            var valor = valorEntry.Text;
            var parcelas = parcelasEntry.Text;
            var ip = ipEntry.Text;

            Dictionary<string, string> parametros = new Dictionary<string, string>();

            if (selectedTefMeth == "M-SITEF")
            {
                parametros.Add("acao", "CONFIGS");
                parametros.Add("ipTef", ip);
                parametros.Add("valor", valor);
                parametros.Add("metodoPagamento", selectedPayment);
                parametros.Add("parcelas", parcelas);


                DependencyService.Get<ITef>().SetPrintFalse();
                DependencyService.Get<ITef>().SendSitefParams(parametros);

            }
            else
            {
                parametros.Add("action", "CONFIGS");

                parametros.Add("valor", valor);
                parametros.Add("parcelas", parcelas);
                parametros.Add("formaPagamento", selectedPayment);
                parametros.Add("tipoParcelamento", selectedInstallment);

                DependencyService.Get<ITef>().SetPrintFalse();
                DependencyService.Get<ITef>().SendPaygoParams(parametros);
            }
        }

        private void SetPaymentMeth(object sender, EventArgs e)
        {
            //Deixando em CamelCase
            string refactor = (sender as Button).Text;
            selectedPayment = refactor[0] + refactor.Substring(1).ToLower();

            switch (selectedPayment)
            {
                case "Crédito":
                    CREDITO.BorderColor = Color.FromHex("23F600");
                    DEBITO.BorderColor = Color.Black;
                    ALL.BorderColor = Color.Black;
                    containerParcelas.IsVisible = true;
                    containerInstallments.IsVisible = true;
                    break;
                case "Débito":
                    DEBITO.BorderColor = Color.FromHex("23F600");
                    ALL.BorderColor = Color.Black;
                    CREDITO.BorderColor = Color.Black;
                    containerParcelas.IsVisible = false;
                    containerInstallments.IsVisible = false;
                    break;
                case "Todos":
                    ALL.BorderColor = Color.FromHex("23F600");
                    CREDITO.BorderColor = Color.Black;
                    DEBITO.BorderColor = Color.Black;
                    containerParcelas.IsVisible = true;
                    containerInstallments.IsVisible = true;
                    break;
            }
        }

        private void SetInstallmentMeth(object sender, EventArgs e)
        {
            //Deixando em CamelCase
            string refactor = (sender as Button).Text;
            selectedInstallment = refactor[0] + refactor.Substring(1).ToLower();

            switch (selectedInstallment)
            {
                case "Loja":
                    storeInstall.BorderColor = Color.FromHex("23F600");
                    inCashInstall.BorderColor = Color.Black;
                    admInstall.BorderColor = Color.Black;
                    parcelasEntry.Text = "2";
                    parcelasEntry.IsEnabled = true;
                    break;
                case "Adm":
                    admInstall.BorderColor = Color.FromHex("23F600");
                    inCashInstall.BorderColor = Color.Black;
                    storeInstall.BorderColor = Color.Black;
                    parcelasEntry.Text = "2";
                    parcelasEntry.IsEnabled = true;
                    break;
                case "A vista":
                    inCashInstall.BorderColor = Color.FromHex("23F600");
                    storeInstall.BorderColor = Color.Black;
                    admInstall.BorderColor = Color.Black;
                    parcelasEntry.Text = "1";
                    parcelasEntry.IsEnabled = false;
                    break;
            }
        }

        private void SetTefMeth(object sender, EventArgs e)
        {
            selectedTefMeth = (sender as Button).Text;
            switch (selectedTefMeth)
            {
                case "PAYGO":
                    paygoButton.BorderColor = Color.FromHex("23F600");
                    msitefButton.BorderColor = Color.Black;
                    tefelginButton.BorderColor = Color.Black;
                    ipEntry.IsEnabled = false;
                    inCashInstall.IsVisible = true;
                    ALL.IsVisible = true;
                    configButton.IsVisible = true;
                    break;
                case "M-SITEF":
                    msitefButton.BorderColor = Color.FromHex("23F600");
                    paygoButton.BorderColor = Color.Black;
                    tefelginButton.BorderColor = Color.Black;
                    ipEntry.IsEnabled = true;
                    inCashInstall.IsVisible = false;
                    ALL.IsVisible = true;
                    configButton.IsVisible = true;
                    break;
                case "TEF ELGIN":
                    tefelginButton.BorderColor = Color.FromHex("23F600");
                    paygoButton.BorderColor = Color.Black;
                    msitefButton.BorderColor = Color.Black;
                    ipEntry.IsEnabled = false;
                    inCashInstall.IsVisible = true;
                    ALL.IsVisible = false;
                    configButton.IsVisible = false;
                    break;
            }
        }
    }  
}