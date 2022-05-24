using System;
using Android.App;
using Android.Support.V4.App;
using Android.Content;
using Android.OS;
using Android.Widget;
using Java.Util.Regex;
using System.Collections.Generic;
using Android.Util;

namespace M8
{
   [Activity(Label="Impressora")]
    public class Impressora : FragmentActivity
    {
        public static Printer printerService;
        public string selectedPrinterModel;

        private string EXTERNAL_PRINTER_MODEL_I9 = "i9";
        private string EXTERNAL_PRINTER_MODEL_I8 = "i8";

        //Tela Impressora
        Button btnPrintText, btnPrintBarcode, btnPrintImage, btnPrinterStatus, btnStatusGaveta, btnAbrirGaveta;
        RadioGroup radioGroupConnectPrinterIE;
        RadioButton radioImpInterna;
        EditText editIp;

        public static Context mContext;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            mContext = this;

            // Create your application here
            SetContentView(Resource.Layout.impressora_xml);

            //Atribuição das Views - Tela Impressora

            // Buttons
            btnPrintText = FindViewById<Button>(Resource.Id.btnPrintText);
            btnPrintBarcode = FindViewById<Button>(Resource.Id.btnPrintBarcode);
            btnPrintImage = FindViewById<Button>(Resource.Id.btnPrintImage);
            btnPrinterStatus = FindViewById<Button>(Resource.Id.btnPrinterStatus);
            btnStatusGaveta = FindViewById<Button>(Resource.Id.btnStatusGaveta);
            btnAbrirGaveta = FindViewById<Button>(Resource.Id.btnAbrirGaveta);

            //Radios
            radioGroupConnectPrinterIE = FindViewById<RadioGroup>(Resource.Id.radioGroupConnectPrinterIE);
            radioImpInterna = FindViewById<RadioButton>(Resource.Id.radioImpInterna);

            //EditTexts
            editIp = FindViewById<EditText>(Resource.Id.editIp);
            editIp.Text = "192.168.0.103:9100";
           
            //Atribuição do estado inicial da tela
            InitialState();

            //Atribuição funcionalidade das Views
            InitViewsFunc();

        }   

        private void InitialState()
        {
            var fragment = new FragmentPrinterText();

            //Fragment Inicial
            SupportFragmentManager.BeginTransaction().Add(Resource.Id.impressoraFragment, fragment, "FragmentImpressora").Commit();
            
            //Views selecionadas Inicialmente - Tela da Impressora
            btnPrintText.BackgroundTintList = GetColorStateList(Resource.Color.azul);
            radioImpInterna.Checked = true;

            //Inicializa a impressora interna selecionada inicialmente e ajusta a variavel de controle booleana que verifica se a impressora interna esta em uso
            printerService = new Printer(this);
            printerService.PrinterInternalImpStart();

        }

        private void InitViewsFunc()
        {
            btnPrintText.Click += delegate
            {
                BlackoutButtons();
                btnPrintText.BackgroundTintList = GetColorStateList(Resource.Color.azul);
                var fragment = new FragmentPrinterText();
                SupportFragmentManager.BeginTransaction().Replace(Resource.Id.impressoraFragment, fragment, "FragmentImpressora").Commit();
            };

            btnPrintBarcode.Click += delegate
            {
                BlackoutButtons();
                btnPrintBarcode.BackgroundTintList = GetColorStateList(Resource.Color.azul);
                var fragment = new FragmentPrinterBarCode();
                SupportFragmentManager.BeginTransaction().Replace(Resource.Id.impressoraFragment, fragment, "FragmentImpressora").Commit();
            };

            btnPrintImage.Click += delegate
            {
                BlackoutButtons();
                btnPrintImage.BackgroundTintList = GetColorStateList(Resource.Color.azul);
                var fragment = new FragmentPrinterImage();
                SupportFragmentManager.BeginTransaction().Replace(Resource.Id.impressoraFragment, fragment, "FragmentImpressora").Commit();
            };

            btnPrinterStatus.Click += delegate
            {
                int statusSensorPapel = printerService.StatusSensorPapel();

                if (statusSensorPapel == 5) Alert("Papel está presente e não está próximo do fim!");

                else if (statusSensorPapel == 6) Alert("Papel próximo do fim!");

                else if (statusSensorPapel == 7) Alert("Papel ausente!");

                else Alert("Status Desconhecido!");
            };

            btnStatusGaveta.Click += delegate
            {
                int statusGaveta = printerService.StatusGaveta();

                if (statusGaveta == 1) Alert("Gaveta aberta!");

                else if (statusGaveta == 2) Alert("Gaveta fechada!");

                else Alert("Status Desconhecido!");
            };

            btnAbrirGaveta.Click += delegate
            {
                int resultadoAbrirGaveta = printerService.AbrirGaveta();
                Console.WriteLine("ResultadoAbrirGaveta: " + resultadoAbrirGaveta);
            };

            btnAbrirGaveta.Click += delegate
            {
                printerService.StatusGaveta();
            };

            radioGroupConnectPrinterIE.CheckedChange += (s, e) =>
            {
                string EXTERNAL_CONNECTION_METHOD_USB = "USB";
                string EXTERNAL_CONNECTION_METHOD_IP = "IP";

                switch (e.CheckedId)
                {
                    case Resource.Id.radioImpInterna:
                        printerService.PrinterInternalImpStart();
                    break;

                    case Resource.Id.radioImpExternaIP:
                        if (IsIpValid(editIp.Text))
                        {
                            //Invoca o alertDialog que permite a escolha do modelo de impressora antes da tentativa de iniciar a conexão por IP
                            AlertDialogSetSelectedPrinterModelThenConnect(EXTERNAL_CONNECTION_METHOD_IP);
                        }
                        else
                        {
                            //Se não foi possível validar o ip antes da chama da função, retorne para a conexão com impressora interna
                            Alert("Digite um IP válido.");
                            radioImpInterna.Checked = true;
                        }
                        break;

                    case Resource.Id.radioImpExternaUSB:
                        //Invoca o alertDialog que permite a escolha do modelo de impressora antes da tentativa de iniciar a conexão por IP
                        AlertDialogSetSelectedPrinterModelThenConnect(EXTERNAL_CONNECTION_METHOD_USB);
                        break;
                }
            };
        }

        public static void JumpLine()
        {
            int quant;
            //Se a impressão for por impressora externa, 5 é o suficiente; 15 caso contrário
            Log.Debug("PRINTER", "É impressora interna: " + printerService.isPrinterInternSelected);
            if (!printerService.isPrinterInternSelected) { quant = 5; }
            else quant = 15;

            printerService.AvancaLinhas(quant);
        }

        //Escurecer botões ao toque
        private void BlackoutButtons()
        {
            btnPrintText.BackgroundTintList = GetColorStateList(Resource.Color.black);
            btnPrintBarcode.BackgroundTintList = GetColorStateList(Resource.Color.black);
            btnPrintImage.BackgroundTintList = GetColorStateList(Resource.Color.black);
            btnPrinterStatus.BackgroundTintList = GetColorStateList(Resource.Color.black);
        }

        public static bool IsIpValid(string ipserver)
        {
            Console.WriteLine(ipserver);
            Java.Util.Regex.Pattern p = Java.Util.Regex.Pattern.Compile(@"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\:\d{1,5}\b");
           
            Matcher m = p.Matcher(ipserver);
            bool b = m.Matches();
            
            return b;
        }

        public void ConnectExternPrinterByIP(string ip)
        {
            string[] ipAndPort = ip.Split(":");

            // Ao informar um IP inválido, o retorno da função pode demorar e parecer que a aplicação travou,
            // mas a respota chega eventualmente.
            // Não é possível usar async/await pois para isso o método da lib Termica.AbreConexaoImpressora
            // não retorna uma Task
            int result = printerService.PrinterExternalImpStartByIP(selectedPrinterModel, ipAndPort[0], int.Parse(ipAndPort[1]));
            Console.WriteLine("RESULT EXTERN - IP: " + result);

            if (result != 0)
            {
                Alert("A tentativa de conexão por IP não foi bem sucedida!");
                printerService.PrinterInternalImpStart();
                radioImpInterna.Checked = true;
            }

        }

        public void ConnectExternPrinterByUSB(string model)
        {
            int result = printerService.PrinterExternalImpStartByUSB(model);
            Console.WriteLine("RESULT EXTERN - USB: " + result);

            if (result != 0)
            {
                Alert("A tentativa de conexão por USB não foi bem sucedida!");
                printerService.PrinterInternalImpStart();
                radioImpInterna.Checked = true;
            }
        }

        //Dialogo usado para escolher definir o modelo de impressora externa que sera estabelecida a conexao
        public void AlertDialogSetSelectedPrinterModelThenConnect(string externalConnectionMethod)
        {
            string[] operations = { EXTERNAL_PRINTER_MODEL_I9, EXTERNAL_PRINTER_MODEL_I8 };

            AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
            builder.SetTitle("Selecione o modelo de impressora a ser conectado");

            //Tornando o dialógo não-cancelável
            builder.SetCancelable(false);

            builder.SetNegativeButton("CANCELAR", (c, ev) =>
            {
                ((IDialogInterface)c).Dismiss();
                //Se a opção de cancelamento tiver sido escolhida, retorne sempre à opção de impressão por impressora interna
                printerService.PrinterInternalImpStart();
                radioImpInterna.Checked = true;
                ((IDialogInterface)c).Dismiss();
            });


            builder.SetItems(operations, (c, ev) => {
                //Envia o parâmetro escolhido para a função que atualiza o modelo de impressora selecionado
                SetSelectedPrinterModel(ev.Which);

                //inicializa depois da seleção do modelo a conexão de impressora, levando em contra o parâmetro que define se a conexão deve ser via IP ou USB
                if (externalConnectionMethod.Equals("USB"))
                {
                    ConnectExternPrinterByUSB(selectedPrinterModel);
                }
                else ConnectExternPrinterByIP(editIp.Text);
            });
            builder.Show();
        }
        public void SetSelectedPrinterModel(int whichSelected)
        {
            if (whichSelected == 0) selectedPrinterModel = EXTERNAL_PRINTER_MODEL_I9;
            else selectedPrinterModel = EXTERNAL_PRINTER_MODEL_I8;
        }

        //Alert
        private void Alert(string message)
        {
            Android.App.AlertDialog alertDialog = new Android.App.AlertDialog.Builder(this).Create();
            alertDialog.SetTitle("Alerta");
            alertDialog.SetMessage(message);
            alertDialog.SetButton("OK", delegate
            {
                alertDialog.Dismiss();
            });
            alertDialog.Show();
        }
    }
}