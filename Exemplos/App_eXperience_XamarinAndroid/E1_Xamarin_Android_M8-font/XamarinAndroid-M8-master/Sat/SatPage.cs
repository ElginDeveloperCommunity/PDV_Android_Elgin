using Android.App;
using Android.OS;
using Android.Widget;
using System.Collections.Generic;
using System.IO;
using Java.IO;
using Java.Lang;
using Java.Util;
using IOException = Java.IO.IOException;
using StringBuilder = Java.Lang.StringBuilder;
using Random = System.Random;
using System.Text.RegularExpressions;

namespace M8
{
    [Activity(Label = "Sat")]
    public class SatPage : Activity
    {
        ServiceSat serviceSat;
        TextView retornoSat;

        EditText editTextInputCodeAtivacao;
        RadioGroup radioGroupModelsSAT;
        RadioButton radioButtonSMARTSAT;

        Button buttonConsultarSAT;
        Button buttonStatusOperacionalSAT;
        Button buttonRealizarVendaSAT;
        Button buttonCancelamentoSAT;
        Button buttonAtivarSAT;
        Button buttonAssociarSAT;

        string xmlEnviaDadosVenda = "xmlenviadadosvendasat";
        readonly string xmlCancelamento = "cancelamentosatgo";

        string cfeCancelamento = "";
        string typeModelSAT = "SMART SAT";

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.sat);
            serviceSat = new ServiceSat(this);

            retornoSat = FindViewById<TextView>(Resource.Id.textRetorno);
            retornoSat.MovementMethod = new Android.Text.Method.ScrollingMovementMethod();

            radioButtonSMARTSAT = FindViewById<RadioButton>(Resource.Id.radioButtonSMARTSAT);
            editTextInputCodeAtivacao = FindViewById<EditText>(Resource.Id.editTextInputCodeAtivacao);
            editTextInputCodeAtivacao.Text = "123456789";

            buttonConsultarSAT = FindViewById<Button>(Resource.Id.buttonConsultarSAT);
            buttonStatusOperacionalSAT = FindViewById<Button>(Resource.Id.buttonStatusOperacionalSAT);
            buttonRealizarVendaSAT = FindViewById<Button>(Resource.Id.buttonRealizarVendaSAT);
            buttonCancelamentoSAT = FindViewById<Button>(Resource.Id.buttonCancelamentoSAT);
            buttonAtivarSAT = FindViewById<Button>(Resource.Id.buttonAtivarSAT);
            buttonAssociarSAT = FindViewById<Button>(Resource.Id.buttonAssociarSAT);

            //CONFIGS MODEL BALANÇA
            radioButtonSMARTSAT.Checked = true;
            radioGroupModelsSAT = FindViewById<RadioGroup>(Resource.Id.radioGroupModelsSAT);
            radioGroupModelsSAT.CheckedChange += delegate (object sender, RadioGroup.CheckedChangeEventArgs e)
            {
                switch (e.CheckedId)
                {
                    case Resource.Id.radioButtonSMARTSAT:
                        typeModelSAT = "SMART SAT";
                        break;
                    case Resource.Id.radioButtonSATGO:
                        typeModelSAT = "SATGO";
                        break;
                }
            };

            buttonConsultarSAT.Click += delegate
            {
                SendConsultarSAT();
            };

            buttonStatusOperacionalSAT.Click += delegate
            {
                SendStatusOperacionalSAT();
            };

            buttonRealizarVendaSAT.Click += delegate
            {
                try
                {
                    SendEnviarVendasSAT();
                }
                catch (IOException e)
                {
                    e.PrintStackTrace();
                }

            };

            buttonCancelamentoSAT.Click += delegate
            {
                try
                {
                    SendCancelarVendaSAT();
                }
                catch (IOException e)
                {
                    e.PrintStackTrace();
                }

            };

            buttonAtivarSAT.Click += delegate
            {
                SendAtivarSAT();
            };

            buttonAssociarSAT.Click += delegate
            {
                SendAssociarSAT();
            };
        }

        public void SendConsultarSAT()
        {
            Dictionary<string, object> mapValues = new Dictionary<string, object>
            {
                ["numSessao"] = GetNumeroSessao()
            };

            string retorno = serviceSat.ConsultarSAT(mapValues);
            retornoSat.Text = retorno;
        }

        public void SendStatusOperacionalSAT()
        {
            Dictionary<string, object> mapValues = new Dictionary<string, object>
            {
                ["numSessao"] = GetNumeroSessao(),
                ["codeAtivacao"] = editTextInputCodeAtivacao.Text
            };

            string retorno = serviceSat.StatusOperacional(mapValues);
            retornoSat.Text = retorno;
        }

        public void SendEnviarVendasSAT()
        {
            string stringXMLSat;

            cfeCancelamento = "";

            if (typeModelSAT.Equals("SMART SAT"))
            {
                xmlEnviaDadosVenda = "xmlenviadadosvendasat";
            }
            else
            {
                xmlEnviaDadosVenda = "satgo3";
            }


            Stream ins = Resources.OpenRawResource(
                    Resources.GetIdentifier(
                            xmlEnviaDadosVenda,
                            "raw",
                            PackageName

                    )
            );

            BufferedReader br = new BufferedReader(new InputStreamReader(ins));
            StringBuilder sb = new StringBuilder();
            string line = null;

            try
            {
                line = br.ReadLine();
            }
            catch (IOException e)
            {
                e.PrintStackTrace();
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
                ["codeAtivacao"] = editTextInputCodeAtivacao.Text,
                ["xmlSale"] = stringXMLSat
            };

            string retorno = serviceSat.EnviarVenda(mapValues);

            IList<string> newRetorno = Regex.Split(retorno, "\\|");

            if (newRetorno.Count > 8)
            {
                cfeCancelamento = newRetorno[8];
            }

            retornoSat.Text = retorno;
        }

        public void SendCancelarVendaSAT()
        {
            try
            {
                string stringXMLSat;

                Stream ins = Resources.OpenRawResource(
                            Resources.GetIdentifier(
                                    xmlCancelamento,
                                    "raw",
                                    PackageName
                            )
                    );

                BufferedReader br = new BufferedReader(new InputStreamReader(ins));
                StringBuilder sb = new StringBuilder();
                string line = null;

                try
                {
                    line = br.ReadLine();
                }
                catch (IOException e)
                {
                    e.PrintStackTrace();
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
                    ["codeAtivacao"] = editTextInputCodeAtivacao.Text,
                    ["xmlCancelamento"] = stringXMLSat,
                    ["cFeNumber"] = cfeCancelamento
                };

                string retorno = serviceSat.CancelarVenda(mapValues);
                retornoSat.Text = retorno;
            }
            catch (Exception e)
            {
                AlertDialog alertDialog = new AlertDialog.Builder(this).Create();
                alertDialog.SetTitle("Alerta");
                alertDialog.SetMessage("ERRO: " + e.Message);
                alertDialog.SetButton("OK", delegate
                {
                    alertDialog.Dismiss();
                });
                alertDialog.Show();
            }

        }

        private int GetNumeroSessao()
        {
            return new Random().Next(1_000_000);
        }

        public void SendAtivarSAT()
        {
            Dictionary<string, object> mapValues = new Dictionary<string, object>
            {
                ["numSessao"] = GetNumeroSessao(),
                ["subComando"] = 2,
                ["codeAtivacao"] = editTextInputCodeAtivacao.Text,
                ["cnpj"] = "14200166000166",
                ["cUF"] = 15
            };

            string retorno = serviceSat.AtivarSAT(mapValues);
            retornoSat.Text = retorno;
        }

        public void SendAssociarSAT()
        {
            Dictionary<string, object> mapValues = new Dictionary<string, object>
            {
                ["numSessao"] = GetNumeroSessao(),
                ["codeAtivacao"] = editTextInputCodeAtivacao.Text,
                ["cnpjSh"] = "16716114000172",
                ["assinaturaAC"] = "SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT"
            };

            string retorno = serviceSat.AssociarAssinatura(mapValues);
            retornoSat.Text = retorno;
        }
    }
}