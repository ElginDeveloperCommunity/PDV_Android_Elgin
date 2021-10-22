using Android.Support.V4.App;
using Android.OS;
using Android.Views;
using Android.Widget;
using Android.Graphics;
using System;
using System.Collections.Generic;
using Xamarin.Essentials;

namespace M8
{

    public class FragmentPrinterText : Fragment
    {
        EditText editMensagem;
        RadioButton radioEsquerda, radioCentralizado, radioDireita;
        Spinner spinnerFontFamily, spinnerFontSize;
        CheckBox checkboxNegrito, checkboxSublinhado, checkboxCutPaper;
        Button btnImprimirTexto, btnNFCE, btnSAT;

        private string nomeXmlSat = "xmlsat";
        private string nomeXmlNFCE = "xmlnfce";
        private string xmlSat;
        private string xmlNFCE;

        Dictionary<string, string> parametros;

        public override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            // Create your fragment here
           
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);
            // Use this to return your custom view for this Fragment
            View fragmentView = inflater.Inflate(Resource.Layout.fragmentprintertext, container, false);

            xmlSat = CarregarArquivo(nomeXmlSat);
            xmlNFCE = CarregarArquivo(nomeXmlNFCE);
           
            //Atribuição das Views - FragmentPrinterText

            //EditTexts
            editMensagem = fragmentView.FindViewById<EditText>(Resource.Id.editMensagem);

            //Radios
            radioEsquerda = fragmentView.FindViewById<RadioButton>(Resource.Id.radioEsquerda);
            radioCentralizado = fragmentView.FindViewById<RadioButton>(Resource.Id.radioCentralizado);
            radioDireita = fragmentView.FindViewById<RadioButton>(Resource.Id.radioDireita);

            //Spinners
            spinnerFontFamily = fragmentView.FindViewById<Spinner>(Resource.Id.spinnerFontFamily);
            spinnerFontSize = fragmentView.FindViewById<Spinner>(Resource.Id.spinnerFontSize);

            //Checkboxes
            checkboxNegrito = fragmentView.FindViewById<CheckBox>(Resource.Id.checkboxNegrito);
            checkboxSublinhado = fragmentView.FindViewById<CheckBox>(Resource.Id.checkboxSublinhado);
            checkboxCutPaper = fragmentView.FindViewById<CheckBox>(Resource.Id.checkboxCutPaper);

            //Buttons
            btnImprimirTexto = fragmentView.FindViewById<Button>(Resource.Id.btnImprimirTexto);
            btnNFCE = fragmentView.FindViewById<Button>(Resource.Id.btnNFCE);
            btnSAT = fragmentView.FindViewById<Button>(Resource.Id.btnSAT);

            InitialState();


            InitViewsFunc();
            
          

            return fragmentView;
        }

        private void InitialState()
        {
            editMensagem.Text = "ELGIN DEVELOPER COMMUNITY";
            radioCentralizado.Checked = true;
            spinnerFontFamily.SetSelection(0);
            spinnerFontSize.SetSelection(0);
        }
        private void InitViewsFunc()
        {
           


            btnImprimirTexto.Click += delegate
            {
                if (editMensagem.Text == "")
                {
                    alert("Campo mensagem vazio!");
                }
                else
                {
                    parametros = new Dictionary<string, string>();

                    parametros.Add("text", editMensagem.Text);

                    if (radioEsquerda.Checked == true) parametros.Add("align", "Esquerda");
                    else if (radioCentralizado.Checked == true) parametros.Add("align", "Centralizado");
                    else parametros.Add("align", "Direita");


                    if (spinnerFontFamily.SelectedItem.ToString() == "Fonte A") parametros.Add("font", "FONT A");
                    else parametros.Add("font", "FONT B");

                    parametros.Add("fontSize", spinnerFontSize.SelectedItem.ToString());

                    if (checkboxNegrito.Checked == true) parametros.Add("isBold", "true");
                    else parametros.Add("isBold", "false");

                    if (checkboxSublinhado.Checked == true) parametros.Add("isUnderline", "true");
                    else parametros.Add("isUnderline", "false");


                    Printer.imprimeTexto(parametros);
                    Printer.AvancaLinhas(10);
                    if (checkboxCutPaper.Checked) Printer.cutPaper(10);

                    
                }

            };

            btnNFCE.Click += delegate
            {
                parametros = new Dictionary<string, string>();

                parametros.Add("xmlNFCe", xmlNFCE);
                parametros.Add("indexcsc", "1");
                parametros.Add("csc", "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES");
                parametros.Add("param", "0");
                Printer.imprimeXMLNFCe(parametros);
                Printer.AvancaLinhas(10);
                if (checkboxCutPaper.Checked) Printer.cutPaper(10);
            };

            btnSAT.Click += delegate
            {
                parametros = new Dictionary<string, string>();

                parametros.Add("xmlSAT",xmlSat);
                parametros.Add("param","0");
                Printer.imprimeXMLSAT(parametros);
                Printer.AvancaLinhas(10);
                if (checkboxCutPaper.Checked) Printer.cutPaper(10);
            };
        }

        private void alert(String message)
        {
            Android.App.AlertDialog alertDialog = new Android.App.AlertDialog.Builder(Impressora.impressoraActivity).Create();
            alertDialog.SetTitle("Alerta");
            alertDialog.SetMessage(message);
            alertDialog.SetButton("OK", delegate
            {
                alertDialog.Dismiss();
            });
            alertDialog.Show();
        }

        protected string CarregarArquivo(string nomeArquivo)
        {
            var stream = this.Context.Resources.OpenRawResource(this.Context.Resources.GetIdentifier(nomeArquivo, "raw", this.Context.PackageName));
            string conteudoArquivo = "";
            using (var reader = new System.IO.StreamReader(stream))
            {
                conteudoArquivo = reader.ReadToEnd();
            }
            return conteudoArquivo;

        }
    }


}