using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Util;
using Android.Views;
using Android.Widget;
using BR.Com.Setis.Interfaceautomacao;
using Java.Util;
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
        //Intent MSiTef
        Intent intentToMsitef;

        //Intent para o TEF ELGIN.
        Intent intentToElginTef;

        int REQUEST_CODE_ELGINTEF = 1234;

        //Ultima referência de venda, necessária para o cancelamento de venda no TEF ELGIN.
        String lastElginTefNSU = "";

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
        Button buttonAvistaOption;

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

        //INIT DEFAULT OPTIONS
        string selectedPaymentMethod = "Crédito";
        string selectedInstallmentsMethod = "Avista";
        string selectedTefType = "PayGo";

        //forPrint
        public static bool print = false;
     
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

            //MSitef
            intentToMsitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");

            //TEF
            intentToElginTef = new Intent("com.elgin.e1.digitalhub.TEF");

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
            buttonAvistaOption = FindViewById<Button>(Resource.Id.buttonCashOption);

            //INIT BUTTONS ACTIONS TEF
            buttonSendTransaction = FindViewById<Button>(Resource.Id.buttonSendTransactionTEF);
            buttonCancelTransaction = FindViewById<Button>(Resource.Id.buttonCancelTransactionTEF);
            buttonConfigsTransaction = FindViewById<Button>(Resource.Id.buttonConfigsTEF);

            linearLayoutNumberOfInstallmentsTEF = FindViewById<LinearLayout>(Resource.Id.linearLayoutNumberOfInstallmentsTEF);
            linearLayoutInstallmentsMethodsTEF = FindViewById<LinearLayout>(Resource.Id.linearLayoutInstallmentsMethodsTEF);

            //SELECT INITIALS OPTIONS
            buttonPaygoOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
            buttonCreditOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
            buttonAvistaOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);

            //INIT DEFAULT INPUTS
            editTextValueTEF.AddTextChangedListener(new InputMaskMoney(editTextValueTEF));
            editTextValueTEF.Text = "2000";
            editTextInstallmentsTEF.Text = "1";
            editTextIpTEF.Text = "192.168.0.31";

            editTextIpTEF.Enabled = false;
            editTextIpTEF.FocusableInTouchMode = false;
            textViewViaTef.Visibility = ViewStates.Invisible;

            //SELECT OPTION M-SITEF
            buttonMsitefOption.Click += delegate
            {
                selectedTefType = "M-Sitef";

                buttonMsitefOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
                buttonPaygoOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonElginTefOption.BackgroundTintList = GetColorStateList(Resource.Color.black);

                editTextIpTEF.Enabled = true;
                editTextIpTEF.FocusableInTouchMode = true;
                buttonAvistaOption.Enabled = false;

                buttonVoucherOption.Enabled = true;
                buttonVoucherOption.Visibility = ViewStates.Visible;

                buttonConfigsTransaction.Enabled = true;
                buttonConfigsTransaction.Visibility = ViewStates.Visible;

                if (selectedInstallmentsMethod.Equals("Avista"))
                {
                    selectedInstallmentsMethod = "Crédito";
                    buttonAvistaOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                    buttonStoreOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
                }
                textViewViaTef.Visibility = ViewStates.Visible;

                buttonAvistaOption.Visibility = ViewStates.Invisible;
                imageViewViaPaygo.Visibility = ViewStates.Invisible;
            };

            //SELECT OPTION TEF
            buttonElginTefOption.Click += delegate
            {
                selectedTefType = "Tef";

                buttonMsitefOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonElginTefOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
                buttonPaygoOption.BackgroundTintList = GetColorStateList(Resource.Color.black);

                editTextIpTEF.Enabled = false;
                editTextIpTEF.FocusableInTouchMode = false;
                buttonAvistaOption.Enabled = true;
                textViewViaTef.Visibility = ViewStates.Visible;
                buttonConfigsTransaction.Enabled = false;
                buttonConfigsTransaction.Visibility = ViewStates.Invisible;
                buttonVoucherOption.Enabled = false;
                buttonVoucherOption.Visibility = ViewStates.Invisible;

                buttonAvistaOption.Visibility = ViewStates.Visible;
                imageViewViaPaygo.Visibility = ViewStates.Invisible;
            };

            //SELECT OPTION PAYGO
            buttonPaygoOption.Click += delegate
            {
                selectedTefType = "PayGo";

                buttonMsitefOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonPaygoOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
                buttonElginTefOption.BackgroundTintList = GetColorStateList(Resource.Color.black);

                editTextIpTEF.Enabled = false;
                editTextIpTEF.FocusableInTouchMode = false;
                buttonAvistaOption.Enabled = true;

                buttonConfigsTransaction.Enabled = true;
                buttonConfigsTransaction.Visibility = ViewStates.Visible;

                buttonAvistaOption.Visibility = ViewStates.Visible;
                textViewViaTef.Visibility = ViewStates.Invisible;
                imageViewViaPaygo.Visibility = ViewStates.Visible;

                buttonVoucherOption.Enabled = true;
                buttonVoucherOption.Visibility = ViewStates.Visible;
            };


            //SELECT OPTION CREDIT PAYMENT
            buttonCreditOption.Click += delegate
            {
                selectedPaymentMethod = "Crédito";

                buttonCreditOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
                buttonDebitOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonVoucherOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
            };

            //SELECT OPTION DEBIT PAYMENT
            buttonDebitOption.Click += delegate
            {
                selectedPaymentMethod = "Débito";

                buttonCreditOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonDebitOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
                buttonVoucherOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
            };

            //SELECT OPTION VOUCHER PAYMENT
            buttonVoucherOption.Click += delegate
            {
                selectedPaymentMethod = "Todos";

                buttonCreditOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonDebitOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonVoucherOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
            };

            //SELECT OPTION STORE INSTALLMENT
            buttonStoreOption.Click += delegate
            {
                selectedInstallmentsMethod = "Loja";

                buttonStoreOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
                buttonAdmOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonAvistaOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
            };

            //SELECT OPTION ADM INSTALLMENT
            buttonAdmOption.Click += delegate
            {
                selectedInstallmentsMethod = "Adm";

                buttonStoreOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonAdmOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
                buttonAvistaOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
            };

            //SELECT OPTION AVISTA INSTALLMENT
            buttonAvistaOption.Click += delegate
            {
                selectedInstallmentsMethod = "Avista";

                buttonStoreOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonAdmOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonAvistaOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
            };

            //SELECT BUTTON SEND TRANSACTION
            buttonSendTransaction.Click += delegate
            {
               if (IsEntriesValid()) StartActionTef("SALE");
            };

            //SELECT BUTTON CANCEL TRANSACTION
            buttonCancelTransaction.Click += delegate
            {
                if (IsEntriesValid()) StartActionTef("CANCEL");
            };

            //SELECT BUTTON CONFIGS TRANSACTION
            buttonConfigsTransaction.Click += delegate
            {
                if (IsEntriesValid()) StartActionTef("CONFIGS");
            };
        }

        public void StartActionTef(string action)
        {
            if (selectedTefType.Equals("M-Sitef"))
            {
                if (action != "CONFIGS") print = true;
                SendSitefParams(action);
            }
            else
            {
                if (action.Equals("SALE")) print = true;
                SendPaygoParams(action);
            }
        }
        //Retorna o valor monetário inserido, de maneira limpa. (Os TEFs devem receber o valor em centavos, 2000 para 20 reais, por exemplo).
        private String getTextValueTEFClean()
        {
            //As vírgulas e pontos inseridas pelas máscaras são retiradas.
            return editTextValueTEF.Text.Replace(",", "").Replace("\\.", "");
        }
        public void SendPaygoParams(string action)
        {
            Dictionary<string, string> dictionaryValues = new Dictionary<string, string>();

            if (action.Equals("SALE") || action.Equals("CANCEL"))
            {
                dictionaryValues.Add("valor", editTextValueTEF.Text);
                dictionaryValues.Add("parcelas", editTextInstallmentsTEF.Text);
                dictionaryValues.Add("formaPagamento", selectedPaymentMethod);
                dictionaryValues.Add("tipoParcelamento", selectedInstallmentsMethod );
                if (action.Equals("SALE"))
                {
                    PayGo.efetuaTransacao(Operacoes.Venda, dictionaryValues);
                }
                else if (action.Equals("CANCEL"))
                {
                    PayGo.efetuaTransacao(Operacoes.Cancelamento, dictionaryValues);
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
                    if (selectedTefType.Equals("M-Sitef"))
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
        public String getSelectedPaymentCode()
        {
            switch (selectedPaymentMethod)
            {
                case "CREDITO":
                    return "3";
                case "DEBITO":
                    return "2";
                default: //case "Todos"
                    return "0";
            }
        }
        public void SendSitefParams(string action)
        {
            //PARAMS DEFAULT TO ALL ACTION M-SITEF
            intentToMsitef.PutExtra("empresaSitef", "00000000");
            intentToMsitef.PutExtra("enderecoSitef", editTextIpTEF.Text);
            intentToMsitef.PutExtra("operador", "0001");
            intentToMsitef.PutExtra("data", "20200324");
            intentToMsitef.PutExtra("hora", "130358");
            intentToMsitef.PutExtra("numeroCupom", (new Random().Next(99999).ToString()));
            intentToMsitef.PutExtra("valor", editTextValueTEF.Text);
            intentToMsitef.PutExtra("CNPJ_CPF", "03654119000176");
            intentToMsitef.PutExtra("comExterna", "0");

           
            if (action.Equals("SALE"))
            {
                intentToMsitef.PutExtra("modalidade", PaymentToYourCode(selectedPaymentMethod));

                if (selectedPaymentMethod.Equals("Crédito"))
                {
                    if (editTextInstallmentsTEF.Text.Equals("0") || editTextInstallmentsTEF.Text.Equals("1"))
                    {
                        intentToMsitef.PutExtra("transacoesHabilitadas", "26");
                        intentToMsitef.PutExtra("numParcelas", "");
                    }
                    else if (selectedPaymentMethod.Equals("Loja"))
                    {
                        intentToMsitef.PutExtra("transacoesHabilitadas", "27");
                    }
                    else if (selectedPaymentMethod.Equals("Adm"))
                    {
                        intentToMsitef.PutExtra("transacoesHabilitadas", "28");
                    }
                    intentToMsitef.PutExtra("numParcelas", editTextInstallmentsTEF.Text);
                }

                if (selectedPaymentMethod.Equals("Débito"))
                {
                    intentToMsitef.PutExtra("transacoesHabilitadas", "16");
                    intentToMsitef.PutExtra("numParcelas", "");
                }

                if (selectedPaymentMethod.Equals("Todos"))
                {
                    intentToMsitef.PutExtra("restricoes", "transacoesHabilitadas=16");
                    intentToMsitef.PutExtra("transacoesHabilitadas", "");
                    intentToMsitef.PutExtra("numParcelas", "");
                }
            }

            if (action.Equals("CANCEL"))
            {
                intentToMsitef.PutExtra("modalidade", "200");
                intentToMsitef.PutExtra("transacoesHabilitadas", "");
                intentToMsitef.PutExtra("isDoubleValidation", "0");
                intentToMsitef.PutExtra("restricoes", "");
                intentToMsitef.PutExtra("caminhoCertificadoCA", "ca_cert_perm");
            }

            if (action.Equals("CONFIGS"))
            {
                intentToMsitef.PutExtra("modalidade", "110");
                intentToMsitef.PutExtra("isDoubleValidation", "0");
                intentToMsitef.PutExtra("restricoes", "");
                intentToMsitef.PutExtra("transacoesHabilitadas", "");
                intentToMsitef.PutExtra("caminhoCertificadoCA", "ca_cert_perm");
                intentToMsitef.PutExtra("restricoes", "transacoesHabilitadas=16;26;27");
            }

            StartActivityForResult(intentToMsitef, 4321);
        }

        private void sendElginTefParams(String action)
        {
            //Configura o valor da transação.
            intentToElginTef.PutExtra("valor", getTextValueTEFClean());

            switch (action)
            {
                case ("VENDA"):
                    intentToElginTef.PutExtra("modalidade", getSelectedPaymentCode());
                    switch (selectedPaymentMethod)
                    {
                        case "CREDITO":
                            intentToElginTef.PutExtra("numParcelas", editTextInstallmentsTEF.Text);
                            switch (selectedInstallmentsMethod)
                            {
                                case "A_VISTA":
                                    intentToElginTef.PutExtra("transacoesHabilitadas", "26");
                                    break;
                                case "LOJA":
                                    intentToElginTef.PutExtra("transacoesHabilitadas", "27");
                                    break;
                                case "ADM":
                                    intentToElginTef.PutExtra("transacoesHabilitadas", "28");
                                    break;
                            }
                            break;
                        case "DEBITO":
                            intentToElginTef.PutExtra("transacoesHabilitadas", "16");
                            intentToElginTef.PutExtra("numParcelas", "");
                            break;
                    }
                    break;
                case "CANCELAMENTO":
                    if (lastElginTefNSU.Equals(""))
                    {
                        Alert("Alert", "É necessário realizar uma transação antres para realizar o cancelamento no TEF ELGIN!");
                        return;
                    }

                    intentToElginTef.PutExtra("modalidade", "200");

                    //Data do dia de hoje, usada como um dos parâmetros necessário para o cancelamento de transação no TEF Elgin.
                    DateTime todayDate = DateTime.Now;

                    //Objeto capaz de formatar a date para o formato aceito pelo Elgin TEF ("aaaaMMdd") (20220923).
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
            switch (payment)
            {
                case "Crédito":
                    return "3";
                case "Débito":
                    return "2";
                case "Todos":
                    return "0";
                default:
                    return "0";
            }
        }

        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);
            if(requestCode == 4321)
            {
                if( (resultCode == Result.Ok || resultCode == Result.Canceled) && data != null)
                {
                    SitefReturn sitefReturn = null;
                    sitefReturn = FillMsitefReturnObject(data);
                    if(int.Parse(sitefReturn.CODRESP) < 0 && sitefReturn.CODAUTORIZACAO.Equals(""))
                    {
                        Alert("Alerta", "Ocorreu um erro durante a transação.");
                    }
                    else
                    {
                        viaClienteMsitef = sitefReturn.VIACLIENTE;

                        textViewViaTef.Text = viaClienteMsitef;

                        if(print)
                        {
                            PrintViaClienteMsitef(sitefReturn.VIACLIENTE);
                            print = false;
                        }
                        

                        Alert("Alerta", "Ação realizada com sucesso.");
                    }
                    
                }
                else Alert("Alerta", "Ocorreu um erro durante a transação.");
            }
        }

        private SitefReturn FillMsitefReturnObject(Intent receiveResult)
        {
            try
            {
                SitefReturn sitefReturn = new SitefReturn();

                sitefReturn.CODAUTORIZACAO = receiveResult.GetStringExtra("COD_AUTORIZACAO");
                sitefReturn.VIAESTABELECIMENTO = receiveResult.GetStringExtra("VIA_ESTABELECIMENTO");
                sitefReturn.COMPDADOSCONF = receiveResult.GetStringExtra("COMP_DADOS_CONF");
                sitefReturn.BANDEIRA = receiveResult.GetStringExtra("BANDEIRA");
                sitefReturn.NUMPARC = receiveResult.GetStringExtra("NUM_PARC");
                sitefReturn.CODTRANS = receiveResult.GetStringExtra("CODTRANS");
                sitefReturn.REDEAUT = receiveResult.GetStringExtra("REDE_AUT");
                sitefReturn.NSUSITEF = receiveResult.GetStringExtra("NSU_SITEF");
                sitefReturn.VIACLIENTE = receiveResult.GetStringExtra("VIA_CLIENTE");
                sitefReturn.VLTROCO = receiveResult.GetStringExtra("VLTROCO");
                sitefReturn.TIPOPARC = receiveResult.GetStringExtra("TIPO_PARC");
                sitefReturn.CODRESP = receiveResult.GetStringExtra("CODRESP");
                sitefReturn.NSUHOST = receiveResult.GetStringExtra("NSU_HOST");
                return sitefReturn;
            }
            catch (ArgumentNullException ex)
            {
                Console.WriteLine("Exception" + ex);
                throw;
            }
        }
       
        public void PrintViaClienteMsitef(string viaCliente)
        {
            Dictionary <string, string> parametros = new Dictionary<string, string>();

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
            if (inputTextValue.Equals(""))
            {
                return false;
            }
            else
            {
                return true;
            }
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