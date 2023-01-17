using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Util;
using Android.Views;
using Android.Widget;
using BR.Com.Setis.Interfaceautomacao;
using Java.Util.Regex;

using System;
using System.Collections.Generic;
using System.Globalization;
using Random = System.Random;

namespace M8
{
    [Activity(Label = "Tef")]
    public class Tef : Activity
    {
        private static Context context;
        //Intent para o TEF M-SITEF.
        readonly Intent intentToMsitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");
        readonly int REQUEST_CODE_MSITEF = 4321;

        //Intent para o TEF ELGIN.
        readonly Intent intentToElginTef = new Intent("com.elgin.e1.digitalhub.TEF");
        readonly int REQUEST_CODE_ELGINTEF = 1234;

        //Ultima referência de venda, necessária para o cancelamento de venda no TEF ELGIN.
        string lastElginTefNSU = "";

        //BUTTONS TYPE TEF
        Button buttonMsitefOption;
        Button buttonPaygoOption;
        Button buttonElginTefOption;

        //EDIT TEXTs
        EditText editTextValueTEF;
        EditText editTextInstallmentsTEF;
        EditText editTextIpTEF;

        //BUTTONS TYPE OF PAYMENTS
        Button buttonCreditOption;
        Button buttonDebitOption;
        Button buttonVoucherOption;

        //BUTTONS TYPE OF INSTALLMENTS
        Button buttonStoreOption;
        Button buttonAdmOption;
        Button buttonCashOption;

        //BUTTONS ACTIONS TEF
        Button buttonSendTransaction;
        Button buttonCancelTransaction;
        Button buttonConfigsTransaction;

        //Captura o layout referente aos botoões de financiamento, para aplicar a lógica de sumir estas opções caso o pagamento por débito seja selecionado.
        private LinearLayout linearLayoutInstallmentsMethodsTEF;

        //Captura o layout referente ao campo de "número de parcelas", para aplicar a loǵica de sumir este campo caso o pagamento por débito seja selecionado.
        private LinearLayout linearLayoutNumberOfInstallmentsTEF;

        //IMAGE VIEW VIA PAYGO
        static ImageView imageViewViaPaygo;

        //TextView Via TEFs
        static TextView textViewViaTef;
        string viaClienteMsitef;

        //forPrint
        public static bool print = false;

        //TEFs de pagamento disponíveis.
        public enum TEF
        {
            PAY_GO, M_SITEF, ELGIN_TEF
        }

        //Formas de pagamento disponíveis.
        public enum FormaPagamento
        {
            CREDITO, DEBITO, TODOS
        }

        //Formas de financiamento disponíveis.
        public enum FormaFinanciamento
        {
            LOJA, ADM, A_VISTA
        }

        //Ações disponíveis, correspondente aos botões na tela.
        public enum Acao
        {
            VENDA, CANCELAMENTO, CONFIGURACAO
        }

        //Opções selecionadas ao abrir da tela.
        private TEF opcaoTefSelecionada;
        private FormaPagamento formaPagamentoSelecionada;
        private FormaFinanciamento formaFinanciamentoSelecionada;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.tef);

            context = this;

            //INIT IMAGE VIEW VIA PAYGO
            imageViewViaPaygo = FindViewById<ImageView>(Resource.Id.imageViewViaPaygo);

            //INIT TEXT VIEW VIA MSITEF
            textViewViaTef = FindViewById<TextView>(Resource.Id.textViewViaTef);

            //Inicializando Impressora Interna
            Impressora.printerService = new Printer(this);
            Impressora.printerService.PrinterInternalImpStart();

            //Inicializando Paygo
            PayGo.setActivity(this);

            //INIT BUTTONS TYPE TEF
            buttonMsitefOption = FindViewById<Button>(Resource.Id.buttonMsitefOption);
            buttonPaygoOption = FindViewById<Button>(Resource.Id.buttonPaygoOption);
            buttonElginTefOption = FindViewById<Button>(Resource.Id.buttonElginTefOption);
            //INIT EDIT TEXTs
            editTextValueTEF = FindViewById<EditText>(Resource.Id.editTextInputValueTEF);
            editTextInstallmentsTEF = FindViewById<EditText>(Resource.Id.editTextInputInstallmentsTEF);
            editTextIpTEF = FindViewById<EditText>(Resource.Id.editTextInputIPTEF);

            //INIT BUTTONS TYPES PAYMENTS
            buttonCreditOption = FindViewById<Button>(Resource.Id.buttonCreditOption);
            buttonDebitOption = FindViewById<Button>(Resource.Id.buttonDebitOption);
            buttonVoucherOption = FindViewById<Button>(Resource.Id.buttonVoucherOption);

            //INIT BUTTONS TYPE INSTALLMENTS
            buttonStoreOption = FindViewById<Button>(Resource.Id.buttonStoreOption);
            buttonAdmOption = FindViewById<Button>(Resource.Id.buttonAdmOption);
            buttonCashOption = FindViewById<Button>(Resource.Id.buttonCashOption);

            //INIT BUTTONS ACTIONS TEF
            buttonSendTransaction = FindViewById<Button>(Resource.Id.buttonSendTransactionTEF);
            buttonCancelTransaction = FindViewById<Button>(Resource.Id.buttonCancelTransactionTEF);
            buttonConfigsTransaction = FindViewById<Button>(Resource.Id.buttonConfigsTEF);

            linearLayoutNumberOfInstallmentsTEF = FindViewById<LinearLayout>(Resource.Id.linearLayoutNumberOfInstallmentsTEF);
            linearLayoutInstallmentsMethodsTEF = FindViewById<LinearLayout>(Resource.Id.linearLayoutInstallmentsMethodsTEF);

            //SELECT INITIALS OPTIONS
            buttonPaygoOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
            buttonCreditOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
            buttonCashOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);

            //INIT DEFAULT INPUTS
            editTextValueTEF.AddTextChangedListener(new InputMaskMoney(editTextValueTEF));
            editTextValueTEF.Text = "2000";
            editTextInstallmentsTEF.Text = "1";
            editTextIpTEF.Text = "192.168.0.31";

            // Aplica regras iniciais da tela.
            InitialBusinessRule();


            //SELECT OPTION PAYGO
            buttonPaygoOption.Click += delegate
            {
                UpdateTEFMethodBusinessRule(TEF.PAY_GO);
            };


            //SELECT OPTION M-SITEF
            buttonMsitefOption.Click += delegate
            {
                UpdateTEFMethodBusinessRule(TEF.M_SITEF);
            };

            //SELECT OPTION TEF
            buttonElginTefOption.Click += delegate
            {
                UpdateTEFMethodBusinessRule(TEF.ELGIN_TEF);
            };

            

            //SELECT OPTION CREDIT PAYMENT
            buttonCreditOption.Click += delegate
            {
                UpdatePaymentMethodBusinessRule(FormaPagamento.CREDITO);
            };

            //SELECT OPTION DEBIT PAYMENT
            buttonDebitOption.Click += delegate
            {
                UpdatePaymentMethodBusinessRule(FormaPagamento.DEBITO);
            };

            //SELECT OPTION VOUCHER PAYMENT
            buttonVoucherOption.Click += delegate
            {
                UpdatePaymentMethodBusinessRule(FormaPagamento.TODOS);
            };

            //SELECT OPTION STORE INSTALLMENT
            buttonStoreOption.Click += delegate
            {
                UpdateInstallmentMethodBusinessRule(FormaFinanciamento.LOJA);
            };

            //SELECT OPTION ADM INSTALLMENT
            buttonAdmOption.Click += delegate
            {
                UpdateInstallmentMethodBusinessRule(FormaFinanciamento.ADM);
            };

            //SELECT OPTION AVISTA INSTALLMENT
            buttonCashOption.Click += delegate
            {
                UpdateInstallmentMethodBusinessRule(FormaFinanciamento.A_VISTA);
            };

            //SELECT BUTTON SEND TRANSACTION
            buttonSendTransaction.Click += delegate
            {
                if (IsEntriesValid())
                {
                    StartActionTef(Acao.VENDA);
                }
            };

            //SELECT BUTTON CANCEL TRANSACTION
            buttonCancelTransaction.Click += delegate
            {
                if (IsEntriesValid())
                {
                    StartActionTef(Acao.CANCELAMENTO);
                }
            };

            //SELECT BUTTON CONFIGS TRANSACTION
            buttonConfigsTransaction.Click += delegate
            {
                if (IsEntriesValid())
                {
                    StartActionTef(Acao.CONFIGURACAO);
                }
            };
        }

        // Aplica as escolhas iniciais ao abrir da tela.
        private void InitialBusinessRule()
        {
            // TEF escolhido inicialmente é o PayGo.
            UpdateTEFMethodBusinessRule(TEF.PAY_GO);
        }

        // Atualiza as regras e decoração de tela, de acordo com o TEF selecionado.
        private void UpdateTEFMethodBusinessRule(TEF opcaoTefSelecionada)
        {
            // Atualiza a váriavel de controle.
            this.opcaoTefSelecionada = opcaoTefSelecionada;

            // 1.Apenas o TEF M-Sitef possuí configuração de IP.
            editTextIpTEF.Enabled = opcaoTefSelecionada == TEF.M_SITEF;
            editTextIpTEF.FocusableInTouchMode = opcaoTefSelecionada == TEF.M_SITEF;

            // 2.M-Sitef não possuí pagamento a vista via crédito.
            buttonCashOption.Visibility = (opcaoTefSelecionada == TEF.M_SITEF ? ViewStates.Invisible : ViewStates.Visible);

            // 3.A opção "todos" não está disponível para o TEF ELGIN.
            buttonVoucherOption.Visibility = (opcaoTefSelecionada == TEF.ELGIN_TEF ? ViewStates.Invisible : ViewStates.Visible);

            // 4.Os TEFS M-Sitef e TEF ELGIN possuem retorno textual(TextView), enquanto o PayGo retorna uma Imagem(ImageView).
            textViewViaTef.Visibility = ((opcaoTefSelecionada == TEF.M_SITEF || opcaoTefSelecionada == TEF.ELGIN_TEF) ? ViewStates.Visible : ViewStates.Gone);
            imageViewViaPaygo.Visibility = (opcaoTefSelecionada == TEF.PAY_GO ? ViewStates.Visible : ViewStates.Gone);

            // 5.O TEF ELGIN ainda não possuí a opçaõ "configuração".
            buttonConfigsTransaction.Visibility = (opcaoTefSelecionada == TEF.ELGIN_TEF ? ViewStates.Invisible : ViewStates.Visible);

            // 6.Atualiza a decoração da opção TEF selecionada.
            buttonPaygoOption.BackgroundTintList = GetColorStateList(opcaoTefSelecionada == TEF.PAY_GO ? Resource.Color.verde : Resource.Color.black);
            buttonMsitefOption.BackgroundTintList = GetColorStateList(opcaoTefSelecionada == TEF.M_SITEF ? Resource.Color.verde : Resource.Color.black);
            buttonElginTefOption.BackgroundTintList = GetColorStateList(opcaoTefSelecionada == TEF.ELGIN_TEF ? Resource.Color.verde : Resource.Color.black);

            // 7.Sempre que um novo TEF for selecionado, a configuração de pagamento será atualizada para pagamento via crédito e parcelamento via loja.
            UpdatePaymentMethodBusinessRule(FormaPagamento.CREDITO);
            UpdateInstallmentMethodBusinessRule(FormaFinanciamento.LOJA);
        }

        // Atualiza as regras e decoração de tela, de acordo com a forma de pagamento selecionada.
        private void UpdatePaymentMethodBusinessRule(FormaPagamento formaPagamentoSelecionada)
        {
            // Atualiza a váriavel de controle.
            this.formaPagamentoSelecionada = formaPagamentoSelecionada;

            // 1.Caso a opção de débito seja seleciona, o campo "número de parcelas" devem sumir, caso a opção selecionada seja a de crédito, o campo deve reaparecer.
            linearLayoutNumberOfInstallmentsTEF.Visibility = (formaPagamentoSelecionada == FormaPagamento.DEBITO ? ViewStates.Invisible : ViewStates.Visible);

            // 2.Caso a opção de débito seja selecionada, os botões "tipos de parcelamento" devem sumir, caso a opção de crédito seja selecionada, devem reaparecer.
            linearLayoutInstallmentsMethodsTEF.Visibility = (formaPagamentoSelecionada == FormaPagamento.DEBITO ? ViewStates.Invisible : ViewStates.Visible);

            // 3.Muda a coloração da borda dos botões de formas de pagamento, conforme o método seleciondo.
            buttonCreditOption.BackgroundTintList = GetColorStateList(formaPagamentoSelecionada == FormaPagamento.CREDITO ? Resource.Color.verde : Resource.Color.black);
            buttonDebitOption.BackgroundTintList = GetColorStateList(formaPagamentoSelecionada == FormaPagamento.DEBITO ? Resource.Color.verde : Resource.Color.black);
            buttonVoucherOption.BackgroundTintList = GetColorStateList(formaPagamentoSelecionada == FormaPagamento.TODOS ? Resource.Color.verde : Resource.Color.black);
        }

        // Atualiza as regras e decoração de tela, de acordo com a forma de parcelamento selecionada.
        private void UpdateInstallmentMethodBusinessRule(FormaFinanciamento formaFinanciamentoSelecionada)
        {
            // Atualiza a variável de controle.
            this.formaFinanciamentoSelecionada = formaFinanciamentoSelecionada;

            // 1. Caso a forma de parcelamento selecionada seja a vista, o campo "número de parcelas" deve ser "travado" em "1", caso contrário o campo deve ser destravado e inserido "2", pois é o minimo de parcelas para as outras modalidades.
            editTextInstallmentsTEF.Enabled = (formaFinanciamentoSelecionada != FormaFinanciamento.A_VISTA);
            editTextInstallmentsTEF.Text = (formaFinanciamentoSelecionada == FormaFinanciamento.A_VISTA ? "1" : "2");

            // 2. Muda a coloração da borda dos botões de formas de parcelamento, conforme o método seleciondo.
            buttonStoreOption.BackgroundTintList = GetColorStateList(formaFinanciamentoSelecionada == FormaFinanciamento.LOJA ? Resource.Color.verde : Resource.Color.black);
            buttonAdmOption.BackgroundTintList = GetColorStateList(formaFinanciamentoSelecionada == FormaFinanciamento.ADM ? Resource.Color.verde : Resource.Color.black);
            buttonCashOption.BackgroundTintList = GetColorStateList(formaFinanciamentoSelecionada == FormaFinanciamento.A_VISTA ? Resource.Color.verde : Resource.Color.black);
        }

        public void StartActionTef(Acao acao)
        {
            switch (opcaoTefSelecionada)
            {
                case TEF.PAY_GO:
                    SendPaygoParams(acao);
                    break;
                case TEF.M_SITEF:
                    SendMSitefParams(acao);
                    break;
                case TEF.ELGIN_TEF:
                    SendElginTefParams(acao);
                    break;
            }
        }
        //Retorna o valor monetário inserido, de maneira limpa. (Os TEFs devem receber o valor em centavos, 2000 para 20 reais, por exemplo).
        private string GetTextValueTEFClean()
        {
            //As vírgulas e pontos inseridas pelas máscaras são retiradas.
            return editTextValueTEF.Text.Replace(",", "").Replace("\\.", "");
        }
        public void SendPaygoParams(Acao acao)
        {
            Dictionary<string, object> dictionaryValues = new Dictionary<string, object>();

            // Se for uma venda ou cancelamento, deve ser feito a configuração a seguir para a classe que lidará com o pagamento via paygo.
            if (acao != Acao.CONFIGURACAO)
            {
                dictionaryValues.Add("valor", editTextValueTEF.Text);
                dictionaryValues.Add("parcelas", editTextInstallmentsTEF.Text);
                dictionaryValues.Add("formaPagamento", formaPagamentoSelecionada);
                dictionaryValues.Add("tipoParcelamento", formaFinanciamentoSelecionada);

                switch (acao)
                {
                    case Acao.VENDA:
                        PayGo.efetuaTransacao(Operacoes.Venda, dictionaryValues);
                        break;
                    case Acao.CANCELAMENTO:
                        PayGo.efetuaTransacao(Operacoes.Cancelamento, dictionaryValues);
                        break;
                }
            }
            else
            {
                PayGo.efetuaTransacao(Operacoes.Administrativa, dictionaryValues);
            }
        }

        public static void OptionsReturnPaygo(Dictionary<string, string> dictionary)
        {
            Dictionary<string, string> dictionaryValues = new Dictionary<string, string>();

            if ((dictionary["retorno"]).Equals("Transacao autorizada"))
            {
                string imageViaBase64 = dictionary["via_cliente"];

                byte[] decodedString = Android.Util.Base64.Decode(imageViaBase64, Base64Flags.Default);
                Bitmap decodedByte = BitmapFactory.DecodeByteArray(decodedString, 0, decodedString.Length);
                imageViewViaPaygo.SetImageBitmap(decodedByte);


                dictionaryValues.Add("quant", "10");
                dictionaryValues.Add("base64", imageViaBase64);

                if (print)
                {
                    Impressora.printerService.ImprimeCupomTEF(dictionaryValues);
                    Impressora.JumpLine();
                    Impressora.printerService.CutPaper(1);

                    print = false;
                }

                Alert("Alert", dictionary["retorno"]);
            }
            else
            {
                Alert("Alert", dictionary["retorno"]);
            }
        }

        public bool IsEntriesValid()
        {
            if (IsValueNotEmpty(editTextValueTEF.Text))
            {
                if (IsInstallmentEmptyOrLessThanZero(editTextInstallmentsTEF.Text))
                {
                    if (opcaoTefSelecionada == TEF.M_SITEF) // Somente se o TEF escolhido for MSitef é necessário validar o IP.
                    {
                        if (IsIpTefValid(editTextIpTEF.Text))
                        {
                            return true;
                        }
                        else
                        {
                            Alert("Alerta", "Verifique seu endereço IP.");
                            return false;
                        }
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    Alert("Alerta", "Digite um número de parcelas válido maior que 0.");
                    return false;
                }
            }
            else
            {
                Alert("Alerta", "Verifique a entrada de valor de pagamento!");
                return false;
            }
        }
        public string GetSelectedPaymentCode()
        {
            return formaPagamentoSelecionada switch
            {
                FormaPagamento.CREDITO => "3",
                FormaPagamento.DEBITO => "2",
                // Case TODOS.
                _ => "0",
            };
        }
        public void SendMSitefParams(Acao acao)
        {
            // Parâmetros de configuração do M-Sitef.
            intentToMsitef.PutExtra("empresaSitef", "00000000");
            intentToMsitef.PutExtra("enderecoSitef", editTextIpTEF.Text);
            intentToMsitef.PutExtra("operador", "0001");
            intentToMsitef.PutExtra("data", "20200324");
            intentToMsitef.PutExtra("hora", "130358");
            intentToMsitef.PutExtra("numeroCupom", (new Random().Next(99999).ToString()));
            intentToMsitef.PutExtra("valor", GetTextValueTEFClean());
            intentToMsitef.PutExtra("CNPJ_CPF", "03654119000176");
            intentToMsitef.PutExtra("comExterna", "0");

            switch (acao)
            {
                case Acao.VENDA:
                    intentToMsitef.PutExtra("modalidade", GetSelectedPaymentCode());

                    switch (formaPagamentoSelecionada)
                    {
                        case FormaPagamento.CREDITO:
                            intentToMsitef.PutExtra("numParcelas", editTextInstallmentsTEF.Text.ToString());
                            switch (formaFinanciamentoSelecionada)
                            {
                                case FormaFinanciamento.LOJA:
                                    intentToMsitef.PutExtra("transacoesHabilitadas", "26");
                                    break;
                                case FormaFinanciamento.ADM:
                                    intentToMsitef.PutExtra("transacoesHabilitadas", "27");
                                    break;
                                case FormaFinanciamento.A_VISTA:
                                    intentToMsitef.PutExtra("transacoesHabilitadas", "28");
                                    break;
                            }
                            break;
                        case FormaPagamento.DEBITO:
                            intentToMsitef.PutExtra("transacoesHabilitadas", "16");
                            intentToMsitef.PutExtra("numParcelas", "");
                            break;
                    }
                    break;
                case Acao.CANCELAMENTO:
                    intentToMsitef.PutExtra("modalidade", "200");
                    intentToMsitef.PutExtra("transacoesHabilitadas", "");
                    intentToMsitef.PutExtra("isDoubleValidation", "0");
                    intentToMsitef.PutExtra("restricoes", "");
                    intentToMsitef.PutExtra("caminhoCertificadoCA", "ca_cert_perm");
                    break;
                case Acao.CONFIGURACAO:
                    intentToMsitef.PutExtra("modalidade", "110");
                    intentToMsitef.PutExtra("isDoubleValidation", "0");
                    intentToMsitef.PutExtra("restricoes", "");
                    intentToMsitef.PutExtra("transacoesHabilitadas", "");
                    intentToMsitef.PutExtra("caminhoCertificadoCA", "ca_cert_perm");
                    intentToMsitef.PutExtra("restricoes", "transacoesHabilitadas=16;26;27");
                    break;
            }

            StartActivityForResult(intentToMsitef, 4321);
        }

        private void SendElginTefParams(Acao acao)
        {
            // Configura o valor da transação.
            intentToElginTef.PutExtra("valor", GetTextValueTEFClean());


            switch (acao)
            {
                case Acao.VENDA:
                    intentToElginTef.PutExtra("modalidade", GetSelectedPaymentCode());

                    switch (formaPagamentoSelecionada)
                    {
                        case FormaPagamento.CREDITO:
                            intentToElginTef.PutExtra("numParcelas", editTextInstallmentsTEF.Text);

                            switch (formaFinanciamentoSelecionada)
                            {
                                case FormaFinanciamento.LOJA:
                                    intentToElginTef.PutExtra("transacoesHabilitadas", "27");
                                    break;
                                case FormaFinanciamento.ADM:
                                    intentToElginTef.PutExtra("transacoesHabilitadas", "28");
                                    break;
                                case FormaFinanciamento.A_VISTA:
                                    intentToElginTef.PutExtra("transacoesHabilitadas", "26");
                                    break;
                            }
                            break;
                        case FormaPagamento.DEBITO:
                            intentToElginTef.PutExtra("transacoesHabilitadas", "16");
                            intentToElginTef.PutExtra("numParcelas", "");
                            break;
                    }
                    break;
                case Acao.CANCELAMENTO:
                    if (lastElginTefNSU.Equals(""))
                    {
                        Alert("Alert", "É necessário realizar uma transação antres para realizar o cancelamento no TEF ELGIN!");
                        return;
                    }

                    intentToElginTef.PutExtra("modalidade", "200");

                    // Data do dia de hoje, usada como um dos parâmetros necessário para o cancelamento de transação no TEF Elgin.
                    DateTime todayDate = DateTime.Now;

                    // Objeto capaz de formatar a date para o formato aceito pelo Elgin TEF ("aaaaMMdd") (20220923).
                    var formatInfo = new CultureInfo("ja-JP").DateTimeFormat;
                    formatInfo.DateSeparator = "";

                    intentToElginTef.PutExtra("data", todayDate.ToString());
                    intentToElginTef.PutExtra("NSU_SITEF", lastElginTefNSU);
                    break;
            }

            StartActivityForResult(intentToElginTef, REQUEST_CODE_ELGINTEF);
        }

        public string PaymentToYourCode(string payment)
        {
            return payment switch
            {
                "Crédito" => "3",
                "Débito" => "2",
                "Todos" => "0",
                _ => "0",
            };
        }

        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);
            // Os TEFs MSitef e TEF Elgin possuem o mesmo retorno.
            if (requestCode == REQUEST_CODE_MSITEF || requestCode == REQUEST_CODE_ELGINTEF)
            {

                // Se resultCode da intent for OK então a transação obteve sucesso.
                // Caso o resultCode da intent for de atividade cancelada e a data estiver diferente de nulo, é possível obter um retorno também.
                if (resultCode == Result.Ok || (resultCode == Result.Canceled && data != null))
                {

                    // O campos são os mesmos para ambos os TEFs.
                    string COD_AUTORIZACAO = data.GetStringExtra("COD_AUTORIZACAO");
                    string VIA_ESTABELECIMENTO = data.GetStringExtra("VIA_ESTABELECIMENTO");
                    string COMP_DADOS_CONF = data.GetStringExtra("COMP_DADOS_CONF");
                    string BANDEIRA = data.GetStringExtra("BANDEIRA");
                    string NUM_PARC = data.GetStringExtra("NUM_PARC");
                    string RELATORIO_TRANS = data.GetStringExtra("RELATORIO_TRANS");
                    string REDE_AUT = data.GetStringExtra("REDE_AUT");
                    string NSU_SITEF = data.GetStringExtra("NSU_SITEF");
                    string VIA_CLIENTE = data.GetStringExtra("VIA_CLIENTE");
                    string TIPO_PARC = data.GetStringExtra("TIPO_PARC");
                    string CODRESP = data.GetStringExtra("CODRESP");
                    string NSU_HOST = data.GetStringExtra("NSU_HOST");

                    //Se o código de resposta estiver nulo ou tiver valor inteiro inferior a 0, a transação não ocorreu como esperado.
                    if (CODRESP == null || int.Parse(CODRESP) < 0)
                    {
                        Alert("Alerta", "Ocorreu um erro durante a transação.");
                    }
                    else
                    {
                        // Atualiza a via cliente com a via atual recebida.
                        this.viaClienteMsitef = VIA_CLIENTE;

                        // Atualiza a caixa de visualização na tela com a via do cliente.
                        textViewViaTef.Text = viaClienteMsitef;

                        // Atualiza o NSU de cancelamento de acordo, necessário para o cancelamento, caso requisitado, desta ultima venda.
                        this.lastElginTefNSU = NSU_SITEF;

                        // Se a via não estiver nula, significando uma operação com completo sucesso, é feita a impressão da via.
                        if (viaClienteMsitef != null)
                        {
                            PrintViaClienteMsitef(viaClienteMsitef);
                        }

                        // Alerta na tela o sucesso da operação.
                        Alert("Alerta", "Ação realizada com sucesso.");
                    }
                }
                else
                {
                    Alert("Alerta", "Ocorreu um erro durante a transação.");
                }
            }
        }

        public void PrintViaClienteMsitef(string viaCliente)
        {
            Dictionary<string, string> parametros = new Dictionary<string, string>();

            parametros.Add("text", viaCliente);
            parametros.Add("align", "Centralizado");
            parametros.Add("font", "FONT B");
            parametros.Add("fontSize", "0");
            parametros.Add("isBold", "false");
            parametros.Add("isUnderline", "false");

            Impressora.printerService.ImprimeTexto(parametros);
            Impressora.JumpLine();
            Impressora.printerService.CutPaper(1);
        }

        public static void Alert(string titleAlert, string message)
        {
            AlertDialog AlertDialog = new AlertDialog.Builder(context).Create();
            AlertDialog.SetTitle(titleAlert);
            AlertDialog.SetMessage(message);
            AlertDialog.SetButton("OK", delegate
            {
                AlertDialog.Dismiss();
            });
            AlertDialog.Show();
        }

        public static bool IsIpTefValid(string ipserver)
        {
            Console.WriteLine(ipserver);
            Java.Util.Regex.Pattern p = Java.Util.Regex.Pattern.Compile(@"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b");

            Matcher m = p.Matcher(ipserver);
            bool b = m.Matches();

            return b;
        }

        public static bool IsValueNotEmpty(string inputTextValue)
        {
            return !inputTextValue.Equals("");
        }

        public static bool IsInstallmentEmptyOrLessThanZero(string inputTextInstallment)
        {
            if (inputTextInstallment.Equals(""))
            {
                return false;
            }
            else
            {
                if (int.Parse(inputTextInstallment) <= 0)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }

    }
}