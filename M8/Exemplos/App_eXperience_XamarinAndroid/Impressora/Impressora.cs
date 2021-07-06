using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;

using Android.App;
using Android.Support.V4.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Java.Util.Regex;


namespace M8
{
   [Activity(Label="Impressora")]
    public class Impressora : FragmentActivity
    {
        //Tela Impressora
        Button btnPrintText, btnPrintBarcode, btnPrintImage, btnPrinterStatus, btnStatusGaveta, btnAbrirGaveta;
        RadioButton radioImpExterna, radioImpInterna;
        EditText editIp;

        public static Activity impressoraActivity;
       

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            impressoraActivity = this;
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
            radioImpExterna = FindViewById<RadioButton>(Resource.Id.radioImpExterna);
            radioImpInterna = FindViewById<RadioButton>(Resource.Id.radioImpInterna);

            //EditTexts
            editIp = FindViewById<EditText>(Resource.Id.editIp);
            editIp.Text = "192.168.0.31:9100";

            //Setando atividade da Impressora
            Printer.setActivity(this);
           
            //Atribuição do estado inicial da tela
            initialState();

            //Atribuição funcionalidade das Views
            initViewsFunc();

        }   



        private void initialState()
        {
            var fragment = new FragmentPrinterText();

            //Fragment Inicial
           
           
            this.SupportFragmentManager.BeginTransaction().Add(Resource.Id.impressoraFragment, fragment, "FragmentImpressora").Commit();
            
            //Views selecionadas Inicialmente - Tela da Impressora
            btnPrintText.BackgroundTintList = GetColorStateList(Resource.Color.azul);
            radioImpInterna.Checked = true;

            //Inicializando Impressora Interna
            Printer.printerInternalImpStart();

        }

        private void initViewsFunc()
        {
            btnPrintText.Click += delegate
            {
                blackoutButtons();
                btnPrintText.BackgroundTintList = GetColorStateList(Resource.Color.azul);
                var fragment = new FragmentPrinterText();
                this.SupportFragmentManager.BeginTransaction().Replace(Resource.Id.impressoraFragment, fragment, "FragmentImpressora").Commit();
            };

            btnPrintBarcode.Click += delegate
            {
                blackoutButtons();
                btnPrintBarcode.BackgroundTintList = GetColorStateList(Resource.Color.azul);
                var fragment = new FragmentPrinterBarCode();
                this.SupportFragmentManager.BeginTransaction().Replace(Resource.Id.impressoraFragment, fragment, "FragmentImpressora").Commit();
            };

            btnPrintImage.Click += delegate
            {
                blackoutButtons();
                btnPrintImage.BackgroundTintList = GetColorStateList(Resource.Color.azul);
                var fragment = new FragmentPrinterImage();
                this.SupportFragmentManager.BeginTransaction().Replace(Resource.Id.impressoraFragment, fragment, "FragmentImpressora").Commit();
            };

            btnPrinterStatus.Click += delegate
            {
                int statusSensorPapel = Printer.statusSensorPapel();

                if (statusSensorPapel == 5) alert("Papel está presente e não está próximo do fim!");

                else if (statusSensorPapel == 6) alert("Papel próximo do fim!");

                else if (statusSensorPapel == 7) alert("Papel ausente!");

                else alert("Status Desconhecido!");
            };

            btnStatusGaveta.Click += delegate
            {
                int statusGaveta = Printer.statusGaveta();

                if (statusGaveta == 1) alert("Gaveta aberta!");

                else if (statusGaveta == 2) alert("Gaveta fechada!");

                else alert("Status Desconhecido!");
            };

            btnAbrirGaveta.Click += delegate
            {
                int resultadoAbrirGaveta = Printer.abrirGaveta();
                Console.WriteLine("ResultadoAbrirGaveta: " + resultadoAbrirGaveta);
            };

            btnAbrirGaveta.Click += delegate
            {
                Printer.statusGaveta();
            };

            radioImpExterna.CheckedChange += (s, e) =>
            {
                if (radioImpExterna.Checked == true && isIpValid(editIp.Text) == true )
                {
                    //Separando Ip e Porta para iniciar a imp Externa
                    int dividerIndex = editIp.Text.IndexOf(':');
                    string ip = editIp.Text.Substring(0, dividerIndex);
                    string port = editIp.Text.Substring(dividerIndex + 1);

                    Dictionary<string,string> IPdictionary = new Dictionary<string, string>();
                    IPdictionary.Add("ip", ip);
                    IPdictionary.Add("port", port);
                   
                    
                    radioImpInterna.Checked = false;
                    radioImpExterna.Checked = true;
                    Printer.printerExternalImpStart(IPdictionary);
                }
                else if(radioImpExterna.Checked == true && isIpValid(editIp.Text) == false)
                {
                    radioImpInterna.Checked = true;
                    radioImpExterna.Checked = false;
                    alert("Digite um endereço e porta IP válido!");
                }
               
            };

            radioImpInterna.CheckedChange += (s, e) =>
            {
                if(radioImpExterna.Checked == false || radioImpInterna.Checked == true)
                {
                    radioImpInterna.Checked = true;
                    Printer.printerInternalImpStart();
                }
                else
                {
                    radioImpInterna.Checked = false;
                }
            };

           
        }

        //Escurecer botões ao toque
        private void blackoutButtons()
        {
            btnPrintText.BackgroundTintList = GetColorStateList(Resource.Color.black);
            btnPrintBarcode.BackgroundTintList = GetColorStateList(Resource.Color.black);
            btnPrintImage.BackgroundTintList = GetColorStateList(Resource.Color.black);
            btnPrinterStatus.BackgroundTintList = GetColorStateList(Resource.Color.black);
        }

        public static bool isIpValid(string ipserver)
        {
            Console.WriteLine(ipserver);
            Java.Util.Regex.Pattern p = Java.Util.Regex.Pattern.Compile(@"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\:\d{1,5}\b");
           
            Matcher m = p.Matcher(ipserver);
            bool b = m.Matches();
            
            return b;
        }

        //Alert
        private void alert(String message)
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