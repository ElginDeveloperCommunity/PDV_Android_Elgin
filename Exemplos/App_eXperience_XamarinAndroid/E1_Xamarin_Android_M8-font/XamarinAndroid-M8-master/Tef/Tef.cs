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



namespace M8
{
    [Activity(Label = "Tef")]
    public class Tef : Activity
    {
        private static Context context;
        //Intent MSiTef
        Intent intentToMsitef; 

        //BUTTONS TYPE TEF
        Button buttonMsitefOption;
        Button buttonPaygoOption;

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


        //IMAGE VIEW VIA PAYGO
        static ImageView imageViewViaPaygo;

        static TextView textViewViaMsitef;
        String viaClienteMsitef;

        //INIT DEFAULT OPTIONS
        String selectedPaymentMethod = "Crédito";
        String selectedInstallmentsMethod = "Avista";
        String selectedTefType = "PayGo";

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
            textViewViaMsitef = FindViewById<TextView>(Resource.Id.textViewViaMsitef);

            //MSitef
            intentToMsitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");

            //Setando atividade da Impressora
            Printer.SetActivity(this);

            //Inicializando Impressora Interna
            Printer.PrinterInternalImpStart();

            //Inicializando Paygo
            PayGo.setActivity(this);

            //INIT BUTTONS TYPE TEF
            buttonMsitefOption = FindViewById<Button>(Resource.Id.buttonMsitefOption);
            buttonPaygoOption = FindViewById<Button>(Resource.Id.buttonPaygoOption);

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
            buttonAvistaOption = FindViewById<Button>(Resource.Id.buttonAvistaOption);

            //INIT BUTTONS ACTIONS TEF
            buttonSendTransaction = FindViewById<Button>(Resource.Id.buttonSendTransactionTEF);
            buttonCancelTransaction = FindViewById<Button>(Resource.Id.buttonCancelTransactionTEF);
            buttonConfigsTransaction = FindViewById<Button>(Resource.Id.buttonConfigsTEF);



            //SELECT INITIALS OPTIONS
            buttonPaygoOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
            buttonCreditOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
            buttonAvistaOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);

            //INIT DEFAULT INPUTS
            editTextValueTEF.Text = "2000";
            editTextInstallmentsTEF.Text = "1";
            editTextIpTEF.Text = "192.168.0.31";

            editTextIpTEF.Enabled = false;
            editTextIpTEF.FocusableInTouchMode = false;
            textViewViaMsitef.Visibility = ViewStates.Invisible;

            //SELECT OPTION M-SITEF
            buttonMsitefOption.Click += delegate
            {
                selectedTefType = "M-Sitef";

                buttonMsitefOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
                buttonPaygoOption.BackgroundTintList = GetColorStateList(Resource.Color.black);

                editTextIpTEF.Enabled = true;
                editTextIpTEF.FocusableInTouchMode = true;
                buttonAvistaOption.Enabled = false;

                if (selectedInstallmentsMethod.Equals("Avista"))
                {
                    selectedInstallmentsMethod = "Crédito";
                    buttonAvistaOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                    buttonStoreOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);
                }
                textViewViaMsitef.Visibility = ViewStates.Visible;

                buttonAvistaOption.Visibility = ViewStates.Invisible;
                imageViewViaPaygo.Visibility = ViewStates.Invisible;
            };

            //SELECT OPTION PAYGO
            buttonPaygoOption.Click += delegate
            {
                selectedTefType = "PayGo";

                buttonMsitefOption.BackgroundTintList = GetColorStateList(Resource.Color.black);
                buttonPaygoOption.BackgroundTintList = GetColorStateList(Resource.Color.verde);

                editTextIpTEF.Enabled = false;
                editTextIpTEF.FocusableInTouchMode = false;
                buttonAvistaOption.Enabled = true;

                buttonAvistaOption.Visibility = ViewStates.Visible;
                textViewViaMsitef.Visibility = ViewStates.Invisible;
                imageViewViaPaygo.Visibility = ViewStates.Visible;
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

        public void StartActionTef(String action)
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

        public void SendPaygoParams(String action)
        {
            Dictionary<String, String> dictionaryValues = new Dictionary<string, string>();

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

        public static void OptionsReturnPaygo(Dictionary<String, String> dictionary)
        {
            Dictionary<String, String> dictionaryValues = new Dictionary<string, string>();

            if (((String)dictionary["retorno"]).Equals("Transacao autorizada"))
            {
                String imageViaBase64 = (String)dictionary["via_cliente"];

                byte[] decodedString = Base64.Decode(imageViaBase64, Base64Flags.Default);
                Bitmap decodedByte = BitmapFactory.DecodeByteArray(decodedString, 0, decodedString.Length);
                imageViewViaPaygo.SetImageBitmap(decodedByte);

               
                dictionaryValues.Add("quant", "10");
                dictionaryValues.Add("base64", imageViaBase64);

                if (print)
                {
                    Printer.ImprimeCupomTEF(dictionaryValues);
                    Printer.AvancaLinhas(10);
                    Printer.CutPaper(10);

                    print = false;
                }   
                
                Alert("Alert", (String) dictionary["retorno"]);
            }
            else
            {
                Alert("Alert", (String)dictionary["retorno"]);
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

        public void SendSitefParams(String action)
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

        public String PaymentToYourCode(String payment)
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
                    if( Int32.Parse(sitefReturn.CODRESP) < 0 && sitefReturn.CODAUTORIZACAO.Equals(""))
                    {
                        Alert("Alerta", "Ocorreu um erro durante a transação.");
                    }
                    else
                    {
                        viaClienteMsitef = sitefReturn.VIACLIENTE;

                        textViewViaMsitef.Text = viaClienteMsitef;

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
       
        public void PrintViaClienteMsitef(String viaCliente)
        {
            Dictionary <String, String> parametros = new Dictionary<string, string>();

            parametros.Add("text", viaCliente);
            parametros.Add("align", "Centralizado");
            parametros.Add("font", "FONT B");
            parametros.Add("fontSize", "0");
            parametros.Add("isBold", "false");
            parametros.Add("isUnderline", "false");

            Printer.ImprimeTexto(parametros);
            Printer.AvancaLinhas(10);
            Printer.CutPaper(10);
        }

        public static void Alert(String titleAlert, String message)
        {
            Android.App.AlertDialog AlertDialog = new Android.App.AlertDialog.Builder(context).Create();
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

        public static bool IsValueNotEmpty(String inputTextValue)
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

        public static bool IsInstallmentEmptyOrLessThanZero(String inputTextInstallment)
        {
            if (inputTextInstallment.Equals(""))
            {
                return false;
            }
            else
            {
                if (Int32.Parse(inputTextInstallment) <= 0)
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