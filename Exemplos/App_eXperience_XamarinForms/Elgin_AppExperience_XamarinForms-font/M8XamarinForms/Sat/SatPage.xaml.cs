using System;
using System.Collections.Generic;


using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using System.Text.RegularExpressions;

namespace M8XamarinForms
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class SatPage : ContentPage
    {
        public string TypeModelSat { get; set; } = "smartSAT";
        string cfeCancelamento = "";

        public SatPage()
        {
            InitializeComponent();

            //CONFIGS MODEL BALANÇA
            radioSmartSAT.IsChecked = true;
        }

        string xmlEnviaDadosVenda = "xmlenviadadosvendasat";
        readonly string xmlCancelamento = "cancelamentosatgo";

        public void SendConsultarSAT(object sender, EventArgs e)
        {
            Dictionary<string, object> mapValues = new Dictionary<string, object>
            {
                ["numSessao"] = GetNumeroSessao()
            };

            string retorno = DependencyService.Get<ISat>().ConsultarSAT(mapValues);
            txtRetornoSat.Text = retorno;
        }

        public void SendStatusOperacionalSAT(object sender, EventArgs e)
        {
            Dictionary<string, object> mapValues = new Dictionary<string, object>
            {
                ["numSessao"] = GetNumeroSessao(),
                ["codeAtivacao"] = entryCodigoAtivacao.Text
            };

            string retorno = DependencyService.Get<ISat>().StatusOperacional(mapValues);
            txtRetornoSat.Text = retorno;
        }

        public async void SendEnviarVendasSAT(object sender, EventArgs e)
        {
            string stringXMLSat;

            cfeCancelamento = "";
            stringXMLSat = DependencyService.Get<ISat>().CarregarArquivo(xmlEnviaDadosVenda);

            Dictionary<string, object> mapValues = new Dictionary<string, object>
            {
                ["numSessao"] = GetNumeroSessao(),
                ["codeAtivacao"] = entryCodigoAtivacao.Text,
                ["xmlSale"] = stringXMLSat
            };

            string retorno = DependencyService.Get<ISat>().EnviarVenda(mapValues);

            IList<string> newRetorno = Regex.Split(retorno, "\\|");
            if (newRetorno.Count > 8)
            {
                cfeCancelamento = newRetorno[8];
            }

            txtRetornoSat.Text = retorno;
        }

        public void SendCancelarVendaSAT(object sender, EventArgs e)
        {
            string stringXMLSat;

            stringXMLSat = DependencyService.Get<ISat>().CarregarArquivo(xmlCancelamento);
            stringXMLSat = stringXMLSat.Replace("novoCFe", cfeCancelamento);

            Dictionary<string, object> mapValues = new Dictionary<string, object>
            {
                ["numSessao"] = GetNumeroSessao(),
                ["codeAtivacao"] = entryCodigoAtivacao.Text,
                ["xmlCancelamento"] = stringXMLSat,
                ["cFeNumber"] = cfeCancelamento
            };

            string retorno = DependencyService.Get<ISat>().CancelarVenda(mapValues);
            txtRetornoSat.Text = retorno;
        }

        private int GetNumeroSessao()
        {
            return new Random().Next(1_000_000);
        }

        public void SendAtivarSAT(object sender, EventArgs e)
        {
            Dictionary<string, object> mapValues = new Dictionary<string, object>
            {
                ["numSessao"] = GetNumeroSessao(),
                ["subComando"] = 2,
                ["codeAtivacao"] = entryCodigoAtivacao.Text,
                ["cnpj"] = "14200166000166",
                ["cUF"] = 15
            };

            string retorno = DependencyService.Get<ISat>().AtivarSAT(mapValues);
            txtRetornoSat.Text = retorno;
        }

        public void SendAssociarSAT(object sender, EventArgs e)
        {
            Dictionary<string, object> mapValues = new Dictionary<string, object>
            {
                ["numSessao"] = GetNumeroSessao(),
                ["codeAtivacao"] = entryCodigoAtivacao.Text,
                ["cnpjSh"] = "16716114000172",
                ["assinaturaAC"] = "SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT"
            };

            string retorno = DependencyService.Get<ISat>().AssociarAssinatura(mapValues);
            txtRetornoSat.Text = retorno;
        }
    }
}