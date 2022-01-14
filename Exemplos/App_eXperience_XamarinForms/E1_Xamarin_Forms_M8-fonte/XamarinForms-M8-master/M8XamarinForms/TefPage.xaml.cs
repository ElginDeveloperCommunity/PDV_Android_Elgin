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
        private const string V = " ";
        private const string V1 = " ";
        private const string V2 = " ";
        private string ip;
        private string selectedPayment = V;
        private string selectedInstallment = V1;
        string selectedTefMeth = V2;

        string viaClienteMSitef;
        private Android.Graphics.Bitmap viaClientePaygo;

        public TefPage()
        {
            InitializeComponent();
            returnImage.Source = " ";
            ipEntry.IsEnabled = true;
            selectedTefMeth = "M-SITEF";
            valorEntry.Text = "100";
            parcelasEntry.Text = "1";
            ipEntry.Text = "192.168.0.31";
            selectedPayment = "Crédito";
            selectedInstallment = "Loja";

            msitefButton.BorderColor = Color.FromHex("23F600");
            CREDITO.BorderColor = Color.FromHex("23F600");
            inCashInstall.BorderColor = Color.FromHex("23F600");

            //Sempre que uma atividade de venda chegar ao final a via do cliente será atualizada!


            //A via retorno do msitef é uma string 
            MessagingCenter.Subscribe<Application, string>(Application.Current, "MSitef_viaCliente", (n_sender, resposta) =>
            {
                viaClienteMSitef = resposta;
            });

            //A via retorn do paygo é um bitmap
            MessagingCenter.Subscribe<Application, Android.Graphics.Bitmap>(Application.Current, "Paygo_viaCliente", (n_sender, resposta) =>
            {
                viaClientePaygo = resposta;
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
            else
            {
                parametros.Add("action", "SALE");

                parametros.Add("valor", valor);
                parametros.Add("parcelas", parcelas);
                parametros.Add("formaPagamento", selectedPayment);
                parametros.Add("tipoParcelamento", selectedInstallment);

                DependencyService.Get<ITef>().SetPrintTrue();
                DependencyService.Get<ITef>().SendPaygoParams(parametros);
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
            else
            {
                parametros.Add("action", "CANCEL");

                parametros.Add("valor", valor);
                parametros.Add("parcelas", parcelas);
                parametros.Add("formaPagamento", selectedPayment);
                parametros.Add("tipoParcelamento", selectedInstallment);

                DependencyService.Get<ITef>().SetPrintFalse();
                DependencyService.Get<ITef>().SendPaygoParams(parametros);
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

        private void ClearAll(object sender, EventArgs e)
        {
            returnImage.IsVisible = false;
            valorEntry.Text = " ";

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
                    break;
                case "Débito":
                    DEBITO.BorderColor = Color.FromHex("23F600");
                    ALL.BorderColor = Color.Black;
                    CREDITO.BorderColor = Color.Black;
                    break;
                case "Todos":
                    ALL.BorderColor = Color.FromHex("23F600");
                    CREDITO.BorderColor = Color.Black;
                    DEBITO.BorderColor = Color.Black;
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
                    break;
                case "Adm":
                    admInstall.BorderColor = Color.FromHex("23F600");
                    inCashInstall.BorderColor = Color.Black;
                    storeInstall.BorderColor = Color.Black;
                    break;
                case "A vista":
                    inCashInstall.BorderColor = Color.FromHex("23F600");
                    storeInstall.BorderColor = Color.Black;
                    admInstall.BorderColor = Color.Black;
                    break;
            }
        }

        private void SetTefMeth(object sender, EventArgs e)
        {
            selectedTefMeth = (sender as Button).Text;
            switch (selectedTefMeth)
            {
                case "M-SITEF":
                    msitefButton.BorderColor = Color.FromHex("23F600");
                    paygoButton.BorderColor = Color.Black;
                    ipEntry.IsEnabled = true;
                    ip = ipEntry.Text;
                    break;
                case "PayGo":
                    paygoButton.BorderColor = Color.FromHex("23F600");
                    msitefButton.BorderColor = Color.Black;
                    ipEntry.IsEnabled = false;
                    ip = " ";
                    break;
            }
        }
    }  
}