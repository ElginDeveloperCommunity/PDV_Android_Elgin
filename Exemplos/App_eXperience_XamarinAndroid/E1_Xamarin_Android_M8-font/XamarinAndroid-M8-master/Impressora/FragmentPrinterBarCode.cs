using Android.Support.V4.App;
using Android.OS;
using Android.Views;
using Android.Widget;
using System.Collections.Generic;

namespace M8
{
    public class FragmentPrinterBarCode : Fragment
    {
        EditText editCodigo;
        Spinner spinnerTipoCodigo, spinnerHeight, spinnerWidth;
        RadioButton radioEsquerda, radioCentralizado, radioDireita;
        CheckBox checkboxCutPaper;
        Button btnImprimirCodbar;

        Dictionary<string, string> parametros;

        TextView textviewHeigth;

        public override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your fragment here
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);
            // Use this to return your custom view for this Fragment
            View fragmentView = inflater.Inflate(Resource.Layout.fragmentprinterbarcode, container, false);

            //EditTexts
            editCodigo = fragmentView.FindViewById<EditText>(Resource.Id.editCodigo);

            //Spinners
            spinnerTipoCodigo = fragmentView.FindViewById<Spinner>(Resource.Id.spinnerTipoCodigo);
            spinnerHeight = fragmentView.FindViewById<Spinner>(Resource.Id.spinnerHeight);
            spinnerWidth = fragmentView.FindViewById<Spinner>(Resource.Id.spinnerWidth);

            //Radios
            radioEsquerda = fragmentView.FindViewById<RadioButton>(Resource.Id.radioEsquerdaBarcode);
            radioCentralizado = fragmentView.FindViewById<RadioButton>(Resource.Id.radioCentralizadoBarcode);
            radioDireita = fragmentView.FindViewById<RadioButton>(Resource.Id.radioDireitaBarcode);

            //Checkboxes
            checkboxCutPaper = fragmentView.FindViewById<CheckBox>(Resource.Id.checkboxCutPaperBarcode);

            //Buttons
            btnImprimirCodbar = fragmentView.FindViewById<Button>(Resource.Id.btnImprimirBarcode);

            textviewHeigth = fragmentView.FindViewById<TextView>(Resource.Id.textViewHeight);

            InitialState();

            InitViewsFunc();


            return fragmentView;
        }

        private void InitialState()
        {
            editCodigo.Text = "40170725";
            radioCentralizado.Checked = true;
            spinnerTipoCodigo.SetSelection(0);
            spinnerHeight.SetSelection(2);
            spinnerWidth.SetSelection(5);
            
        }

        private void InitViewsFunc()
        {
            spinnerTipoCodigo.ItemSelected += delegate
            {
                spinnerHeight.Visibility = ViewStates.Visible;
                textviewHeigth.Visibility = ViewStates.Visible;
                if (spinnerTipoCodigo.SelectedItem.ToString() == "EAN 8") editCodigo.Text = "40170725";
                else if (spinnerTipoCodigo.SelectedItem.ToString() == "EAN 13") editCodigo.Text = "0123456789012";
                else if (spinnerTipoCodigo.SelectedItem.ToString() == "QR Code")
                {
                    editCodigo.Text = "ELGIN DEVELOPERS COMMUNITY";
                    spinnerHeight.Visibility = ViewStates.Invisible;
                    textviewHeigth.Visibility = ViewStates.Invisible;
                }
                else if (spinnerTipoCodigo.SelectedItem.ToString() == "UPC-A") editCodigo.Text = "123601057072";
                else if (spinnerTipoCodigo.SelectedItem.ToString() == "UPC-E") editCodigo.Text = "1234567";
                else if (spinnerTipoCodigo.SelectedItem.ToString() == "CODE 39") editCodigo.Text = "*ABC123*";
                else if (spinnerTipoCodigo.SelectedItem.ToString() == "ITF") editCodigo.Text = "05012345678900";
                else if (spinnerTipoCodigo.SelectedItem.ToString() == "CODE BAR") editCodigo.Text = "A3419500A";
                else if (spinnerTipoCodigo.SelectedItem.ToString() == "CODE 93") editCodigo.Text = "ABC123456789";
                else editCodigo.Text = "{C1233";
            };

            btnImprimirCodbar.Click += delegate
            {
                parametros = new Dictionary<string, string>();
                if (spinnerTipoCodigo.SelectedItem.ToString() == "QR Code")
                {
                  
                    parametros.Add("qrSize", spinnerWidth.SelectedItem.ToString());
                    parametros.Add("text", editCodigo.Text);

                    if (radioEsquerda.Checked == true) parametros.Add("align", "Esquerda");
                    else if (radioCentralizado.Checked == true) parametros.Add("align", "Centralizado");

                    else parametros.Add("align", "Direita");

                    Printer.ImprimeQR_CODE(parametros);
                    Printer.AvancaLinhas(10);
                    if (checkboxCutPaper.Checked) Printer.CutPaper(10);
                }
                else
                {
                    parametros.Add("barCodeType", spinnerTipoCodigo.SelectedItem.ToString());
                    parametros.Add("text", editCodigo.Text);
                    parametros.Add("height", spinnerHeight.SelectedItem.ToString());
                    parametros.Add("width", spinnerWidth.SelectedItem.ToString());

                    if (radioEsquerda.Checked == true) parametros.Add("align", "Esquerda");
                    else if (radioCentralizado.Checked == true) parametros.Add("align", "Centralizado");
                    else parametros.Add("align", "Direita");

                    Printer.ImprimeBarCode(parametros);
                    Printer.AvancaLinhas(10);
                    if (checkboxCutPaper.Checked) Printer.CutPaper(10);
                }

            };


        }
    }
}