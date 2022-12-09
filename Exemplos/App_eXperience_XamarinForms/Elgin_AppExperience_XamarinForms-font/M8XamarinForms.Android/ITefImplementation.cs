using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Util;
using Android.Views;
using Android.Widget;
using BR.Com.Setis.Interfaceautomacao;
using Java.Text;
using Java.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

[assembly: Xamarin.Forms.Dependency(typeof(M8XamarinForms.Droid.ITefImplementation))]
namespace M8XamarinForms.Droid
{
    class ITefImplementation : ITef
    {
        //MSITEF IMPLEMENTATION
        public static bool print;
        string viaClienteMsitef;
        ///  Defines mSitef
        private static readonly int REQ_CODE_MSITEF = 4321;
        private static readonly int REQUEST_CODE_ELGINTEF = 1234;
        /// Fim Defines mSitef

        public void SetPrintTrue()
        {
            print = true;
        }

        public void SetPrintFalse()
        {
            print = false;
        }

        public void SendSitefParams(Dictionary<string,string> parametros)
        {
            Intent intentToMsitef;
            intentToMsitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");

            string acao = parametros["acao"];
            string ipTef = parametros["ipTef"];
            string valor = parametros["valor"];
            string metodoPagamento = parametros["metodoPagamento"];
            string parcelas = parametros["parcelas"];

            //this.print = (Boolean)Convert.ToBoolean(parametros["print"]);

            //PARAMS DEFAULT TO ALL ACTION M-SITEF
            intentToMsitef.PutExtra("empresaSitef", "00000000");
            intentToMsitef.PutExtra("enderecoSitef", ipTef);
            intentToMsitef.PutExtra("operador", "0001");
            intentToMsitef.PutExtra("data", "20200324");
            intentToMsitef.PutExtra("hora", "130358");
            intentToMsitef.PutExtra("numeroCupom", new System.Random().Next(99999).ToString());
            intentToMsitef.PutExtra("valor", valor);
            intentToMsitef.PutExtra("CNPJ_CPF", "03654119000176");
            intentToMsitef.PutExtra("comExterna", "0");


            if (acao.Equals("SALE"))
            {
                intentToMsitef.PutExtra("modalidade", PaymentToYourCode(metodoPagamento));

                if (metodoPagamento.Equals("Crédito"))
                {
                    if (parcelas.Equals("0") || parcelas.Equals("1"))
                    {
                        intentToMsitef.PutExtra("transacoesHabilitadas", "26");
                        intentToMsitef.PutExtra("numParcelas", "");
                    }
                    else if (metodoPagamento.Equals("Loja"))
                    {
                        intentToMsitef.PutExtra("transacoesHabilitadas", "27");
                    }
                    else if (metodoPagamento.Equals("Adm"))
                    {
                        intentToMsitef.PutExtra("transacoesHabilitadas", "28");
                    }
                    intentToMsitef.PutExtra("numParcelas", parcelas);
                }

                if (metodoPagamento.Equals("Débito"))
                {
                    intentToMsitef.PutExtra("transacoesHabilitadas", "16");
                    intentToMsitef.PutExtra("numParcelas", "");
                }

                if (metodoPagamento.Equals("Todos"))
                {
                    intentToMsitef.PutExtra("restricoes", "transacoesHabilitadas=16");
                    intentToMsitef.PutExtra("transacoesHabilitadas", "");
                    intentToMsitef.PutExtra("numParcelas", "");
                }
            }

            if (acao.Equals("CANCEL"))
            {
                intentToMsitef.PutExtra("modalidade", "200");
                intentToMsitef.PutExtra("transacoesHabilitadas", "");
                intentToMsitef.PutExtra("isDoubleValidation", "0");
                intentToMsitef.PutExtra("restricoes", "");
                intentToMsitef.PutExtra("caminhoCertificadoCA", "ca_cert_perm");
            }

            if (acao.Equals("CONFIGS"))
            {
                intentToMsitef.PutExtra("modalidade", "110");
                intentToMsitef.PutExtra("isDoubleValidation", "0");
                intentToMsitef.PutExtra("restricoes", "");
                intentToMsitef.PutExtra("transacoesHabilitadas", "");
                intentToMsitef.PutExtra("caminhoCertificadoCA", "ca_cert_perm");
                intentToMsitef.PutExtra("restricoes", "transacoesHabilitadas=16;26;27");
            }

            MainActivity.mContext.StartActivityForResult(intentToMsitef, REQ_CODE_MSITEF);
        }

        private string PaymentToYourCode(string payment)
        {
            return payment switch
            {
                "Crédito" => "3",
                "Débito" => "2",
                "Todos" => "0",
                _ => "0",
            };
        }

        public void OnTefActivityResult(int requestCode, Result resultCode, Intent data)
        {
            if(requestCode == REQ_CODE_MSITEF || requestCode == REQUEST_CODE_ELGINTEF)
            {
                if ((resultCode == Result.Ok || resultCode == Result.Canceled) && data != null)
                {
                    string CODRESP = data.GetStringExtra("CODRESP");
                    string CODAUTORIZACAO = data.GetStringExtra("COD_AUTORIZACAO");

                    string VIA_ESTABELECIMENTO = data.GetStringExtra("VIA_ESTABELECIMENTO");
                    string COMP_DADOS_CONF = data.GetStringExtra("COMP_DADOS_CONF");
                    string BANDEIRA = data.GetStringExtra("BANDEIRA");
                    string NUM_PARC = data.GetStringExtra("NUM_PARC");
                    string RELATORIO_TRANS = data.GetStringExtra("RELATORIO_TRANS");
                    string REDE_AUT = data.GetStringExtra("REDE_AUT");
                    string NSU_SITEF = data.GetStringExtra("NSU_SITEF");
                    string VIA_CLIENTE = data.GetStringExtra("VIA_CLIENTE");
                    string TIPO_PARC = data.GetStringExtra("TIPO_PARC");
                    string NSU_HOT = data.GetStringExtra("NSU_HOST");

                    if (CODRESP == null || int.Parse(CODRESP) < 0)
                    {
                        MainActivity.Alert("Alerta", "Ocorreu um erro durante a transação.");
                    }
                    else
                    {
                        Log.Debug("RESULT TEF", " " + VIA_CLIENTE);
                        Log.Debug("RESULT TEF", " " + NSU_SITEF);
                        Log.Debug("RESULT TEF", "==============");
                        viaClienteMsitef = VIA_CLIENTE;

                        Tuple<string, string> intentData = new Tuple<string, string>(VIA_CLIENTE, NSU_SITEF);
                        Xamarin.Forms.MessagingCenter.Send(Xamarin.Forms.Application.Current, "MSitef_viaCliente", intentData);
                        if (print)
                        {
                            PrintViaClienteMsitef(viaClienteMsitef);
                            print = false;
                        }

                        MainActivity.Alert("Alerta", "Ação realizada com sucesso.");
                    }
                }
                else MainActivity.Alert("Alerta", "Ocorreu um erro durante a transação");
            }
        }

        public void PrintViaClienteMsitef(string viaCliente)
        {
            Dictionary<string, string> parametros = new Dictionary<string, string>
            {
                { "text", viaCliente },
                { "align", "Centralizado" },
                { "font", "FONT B" },
                { "fontSize", "0" },
                { "isBold", "false" },
                { "isUnderline", "false" }
            };

            MainActivity.printer.ImprimeTexto(parametros);
            MainActivity.printer.JumpLine();
            MainActivity.printer.CutPaper(1);
        }

        //PAYGO IMPLEMENTATION
        public void SendPaygoParams(Dictionary<string, string> parametros)
        {
            
            if (parametros["action"].Equals("SALE") || parametros["action"].Equals("CANCEL"))
            {
                if (parametros["action"].Equals("SALE")) PayGo.efetuaTransacao(Operacoes.Venda, parametros);
                else PayGo.efetuaTransacao(Operacoes.Cancelamento, parametros);
            }
            else PayGo.efetuaTransacao(Operacoes.Administrativa, parametros);
        }

        //TEF ELGIN IMPLEMENTATION
        public void SendTefElginParams(Dictionary<string, string> parametros)
        {
            Intent intentToElginTef;
            intentToElginTef = new Intent("com.elgin.e1.digitalhub.TEF");

            string acao = parametros["acao"];

            string valor = parametros["valor"];
            intentToElginTef.PutExtra("valor", valor);

            if (acao.Equals("SALE"))
            {
                string metodoPagamento = parametros["metodoPagamento"];
                string formaFinanciamentoSelecionada = parametros["metodoParcelamento"];

                intentToElginTef.PutExtra("modalidade", PaymentToYourCode(metodoPagamento));

                switch (metodoPagamento)
                {
                    case "Crédito":
                        string parcelas = parametros["parcelas"];
                        intentToElginTef.PutExtra("numParcelas", parcelas);
                        switch (formaFinanciamentoSelecionada)
                        {
                            case "A vista":
                                intentToElginTef.PutExtra("transacoesHabilitadas", "26");
                                break;
                            case "Loja":
                                intentToElginTef.PutExtra("transacoesHabilitadas", "27");
                                break;
                            case "Adm":
                                intentToElginTef.PutExtra("transacoesHabilitadas", "28");
                                break;
                        }
                        break;
                    case "Débito":
                        intentToElginTef.PutExtra("transacoesHabilitadas", "16");
                        intentToElginTef.PutExtra("numParcelas", "");
                        break;
                }
            }

            if (acao.Equals("CANCEL"))
            {
                string lastElginTefNSU = parametros["lastElginTefNSU"];

                intentToElginTef.PutExtra("modalidade", "200");

                //Data do dia de hoje, usada como um dos parâmetros necessário para o cancelamento de transação no TEF Elgin.
                Date todayDate = new Date();

                //Objeto capaz de formatar a date para o formato aceito pelo Elgin TEF ("aaaaMMdd") (20220923).
                SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyyMMdd");

                string todayDateAsString = dateFormatter.Format(todayDate);

                intentToElginTef.PutExtra("data", todayDateAsString);
                intentToElginTef.PutExtra("NSU_SITEF", lastElginTefNSU);
            }

            MainActivity.mContext.StartActivityForResult(intentToElginTef, REQUEST_CODE_ELGINTEF);
        }
    }
}