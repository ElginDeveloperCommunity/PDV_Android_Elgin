using Java.IO;
using Java.Lang;
using System;
using System.Collections.Generic;
using System.IO;


using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using StringBuilder = Java.Lang.StringBuilder;
using IOException = Java.IO.IOException;
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

            if (TypeModelSat.Equals("smartSAT"))
            {
                xmlEnviaDadosVenda = "xmlenviadadosvendasat";
            }
            else
            {
                xmlEnviaDadosVenda = "satgo3";
            }

            Stream ins = Android.App.Application.Context.Resources.OpenRawResource(
                    Android.App.Application.Context.Resources.GetIdentifier(
                            xmlEnviaDadosVenda,
                            "raw",
                            Android.App.Application.Context.PackageName

                    )
            );

            BufferedReader br = new BufferedReader(new InputStreamReader(ins));
            StringBuilder sb = new StringBuilder();
            string line = null;

            try
            {
                line = br.ReadLine();
            }
            catch (IOException ex)
            {
                ex.PrintStackTrace();
            }

            while (line != null)
            {
                sb.Append(line);
                sb.Append(JavaSystem.LineSeparator());
                line = br.ReadLine();
            }
            stringXMLSat = sb.ToString();

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

            Stream ins = Android.App.Application.Context.Resources.OpenRawResource(
                        Android.App.Application.Context.Resources.GetIdentifier(
                                xmlCancelamento,
                                "raw",
                                Android.App.Application.Context.PackageName
                        )
                );

            BufferedReader br = new BufferedReader(new InputStreamReader(ins));
            StringBuilder sb = new StringBuilder();
            string line = null;

            try
            {
                line = br.ReadLine();
            }
            catch (IOException ex)
            {
                ex.PrintStackTrace();
            }

            while (line != null)
            {
                sb.Append(line);
                sb.Append(JavaSystem.LineSeparator());
                line = br.ReadLine();
            }
            stringXMLSat = sb.ToString();
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