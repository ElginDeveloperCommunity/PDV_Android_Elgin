using Android.Support.V4.App;
using Android.OS;
using Android.Views;
using Android.Widget;
using Xamarin.Essentials;
using System.Drawing;
using Android.Graphics;
using System.Collections.Generic;
using System;

namespace M8
{
    public class FragmentPrinterImage : Fragment
    {
        ImageView previewImage;
        CheckBox checkboxcutPaper;
        Button selecionar, imprimir;

        Android.Graphics.Bitmap bitmap;
        FileResult photo;

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
            // return inflater.Inflate(Resource.Layout.YourFragment, container, false);
            View fragmentView = inflater.Inflate(Resource.Layout.fragmentprinterimage, container, false);

            previewImage = fragmentView.FindViewById<ImageView>(Resource.Id.imageviewPreview);

            //Checkbox
            checkboxcutPaper = fragmentView.FindViewById<CheckBox>(Resource.Id.checkboxCutPaperImage);

            //Button
            selecionar = fragmentView.FindViewById<Button>(Resource.Id.btnSelecionar);
            imprimir = fragmentView.FindViewById<Button>(Resource.Id.btnImprimirImagem);

            InitViewsFunc();

            return fragmentView;
        }

        private void InitViewsFunc()
        {
            selecionar.Click += async delegate
            {
                try
                {
                    photo = await MediaPicker.PickPhotoAsync();
                    bitmap = BitmapFactory.DecodeFile(photo.FullPath);
                    previewImage.SetImageBitmap(bitmap);
                }catch(NullReferenceException)
                {
                    alert("Nenhuma imagem selecionada!");
                }catch(Exception e)
                {
                    Console.WriteLine("Err: " + e.ToString());
                }
            };

            imprimir.Click += delegate
            {
                parametros = new Dictionary<string, string>();
               
               if (photo == null || photo.FullPath == "")
               {
                    parametros.Add("pathImage", "elgin");
               }
                else
                {
                    parametros.Add("pathImage", photo.FullPath);
                }
                parametros.Add("isBase64", "false");
                Printer.imprimeImagem(parametros);
                Printer.AvancaLinhas(10);
                if (checkboxcutPaper.Checked) Printer.cutPaper(10);
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
    }
}