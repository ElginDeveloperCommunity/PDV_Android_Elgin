using Android;
using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.OS;
using Android.Runtime;
using Android.Util;
using Android.Widget;
using AndroidX.Core.App;
using BR.Com.Daruma.Framework.Mobile;
using BR.Com.Daruma.Framework.Mobile.Exception;
using Java.IO;
using Java.Math;
using System;
using System.Collections.Generic;
using System.Text;
using Environment = Android.OS.Environment;

namespace M8
{
    [Activity(Label = "NFCE")]
    public class NFCE : Activity
    {
        //Código da intent de request de permissão para escrever dados no diretório externo
        private static int REQUEST_CODE_WRITE_EXTERNAL_STORAGE = 1234;

        //Printer Object
        public static Printer printerInstance;

        private It4r it4rObj;
        Button buttonConfigurateNfce, buttonSendNfceSale;
        EditText editTextProductName, editTextProductPrice;
        TextView textViewLasfNfceNumber, textViewLastNfceSerie, textViewCronometerValue;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.nfce);

            it4rObj = new It4r(DarumaMobile.Inicializar(this, "@FRAMEWORK(LOGMEMORIA=200;TRATAEXCECAO=TRUE;TIMEOUTWS=8000;SATNATIVO=FALSE);@SOCKET(HOST=192.168.210.94;PORT=9100;)"));

            printerInstance = new Printer(this);
            printerInstance.PrinterInternalImpStart();

            editTextProductName = FindViewById<EditText>(Resource.Id.editTextProductName);
            editTextProductPrice = FindViewById<EditText>(Resource.Id.editTextProductPrice);

            buttonConfigurateNfce = FindViewById<Button>(Resource.Id.buttonConfigurateNfce);
            buttonSendNfceSale = FindViewById<Button>(Resource.Id.buttonSendNfceSale);

            textViewLasfNfceNumber = FindViewById<TextView>(Resource.Id.textViewLasfNfceNumber);
            textViewLastNfceSerie = FindViewById<TextView>(Resource.Id.textViewLastNfceSerie);
            textViewCronometerValue = FindViewById<TextView>(Resource.Id.textViewCronometerValue);

            editTextProductName.Text = "CAFE";

            editTextProductPrice.AddTextChangedListener(new InputMaskMoney(editTextProductPrice));

            editTextProductPrice.Text = "8.00";

            buttonConfigurateNfce.Click += delegate { ConfigurateNfce(); };

            buttonSendNfceSale.Click += delegate { SendSaleNfce(editTextProductName.Text, editTextProductPrice.Text); };
        }

        //Função que configura NFC-e para a emissão, após a sua execução ocorrer corretamente o botão para o envio da NFc-e deve ser habilitado
        public void ConfigurateNfce()
        {
            if (IsStoragePermissionGranted())
            {
                try
                {
                    it4rObj.ConfigurarXmlNfce();
                    Toast.MakeText(this, "NFC-e configurada com sucesso!", ToastLength.Long).Show();
                    buttonSendNfceSale.Enabled = true;
                }
                catch (DarumaException e)
                {
                    Toast.MakeText(this, "Erro na configuração de NFC-e", ToastLength.Long).Show();
                    buttonSendNfceSale.Enabled = false;
                    e.PrintStackTrace();
                }
            }
        }

        //Função do envio de venda NFC-e, essa função configura a venda com os dados da tela e em seguida tenta emitir a nota e por ultimo faz impressão da nota (Caso tenha ocorrido algum erro durante a emissão da nota é feita a impressão da nota em contingência).
        public void SendSaleNfce(string productName, string productPrice)
        {
            //É feita uma venda antes da venda antes para que a nossa venda não seja omitida, isso é necessário em servidor de homologação
            PreSale();

            //Configuramos a venda com os dados da tela
            try
            {
                it4rObj.VenderItem(productName, FormatPrice(productPrice), "123456789012");
            }
            catch (DarumaException e)
            {
                Toast.MakeText(this, "Erro na configuração de venda", ToastLength.Long).Show();
                e.PrintStackTrace();
                return;
            }

            //Encerramos a venda emitiando a nota para o servidor
            try
            {
                it4rObj.EncerrarVenda(FormatPrice(productPrice), "Dinheiro");
                AlertMessageStatus("NFC-e emitida com sucesso!");
            }
            catch (DarumaException e)
            {
                AlertMessageStatus("Erro ao emitir NFC-e online, a impressão será da nota em contigência!");
                e.PrintStackTrace();
            }

            //Se a o tempo de emissão calculado for diferente de 0 então a nota não foi emitida em contigência offline, e o tempo de emissão calculado será exposto na tela

            if (it4rObj.GetTimeElapsedInLastEmission().Get() != 0)
                textViewCronometerValue.Text = string.Format("{0} SEGUNDOS", it4rObj.GetTimeElapsedInLastEmission().Get() / 1000);
            else
                textViewCronometerValue.Text = "";

            //Expõe o número da nota emitida
            textViewLasfNfceNumber.Text = it4rObj.GetNumeroNota();
            //Expões a série emitida
            textViewLastNfceSerie.Text = it4rObj.GetNumeroSerie();

            //Impressão da NFC-e
            Dictionary<string, string> mapValues = new Dictionary<string, string>();

            mapValues["xmlNFCe"] = GetTextOfFile();
            mapValues["indexcsc"] = "1";
            mapValues["csc"] = "1A451E99-0FE0-4C13-B97E-67D698FFBC37";
            mapValues["param"] = "0";

            printerInstance.ImprimeXMLNFCe(mapValues);
            printerInstance.CutPaper(5);
        }

        //Como no App_Experience é feita uma venda em ambiente de homologação, e uma nota emitida nesse ambiente sempre aparece com a primeira compra emitida, será feita uma venda com valor nulo para que a venda feita na aplicação não seja omitida
        public void PreSale()
        {
            try
            {
                it4rObj.VenderItem("I", "0.00", "123456789011");
            }
            catch (DarumaException e)
            {
                Toast.MakeText(this, "Erro na configuração de venda" + e.Message, ToastLength.Long).Show();
                e.PrintStackTrace();
                return;
            }
        }

        //Desliga a impressora após sair da página
        protected override void OnDestroy()
        {
            base.OnDestroy();
            printerInstance.PrinterStop();
        }

        //Checa se a permissão para escrever arquivos em diretórios externos foi garantida, se não tiver ; peça novamente
        public bool IsStoragePermissionGranted()
        {
            if (Build.VERSION.SdkInt >= BuildVersionCodes.M)
            {
                if (CheckSelfPermission(Manifest.Permission.WriteExternalStorage) == Permission.Granted)
                {
                    Log.Verbose("DEBUG", "A permissão está garantida!");
                    return true;
                }
                else
                {
                    Log.Verbose("DEBUG", "A permissão está negada!");
                    //Pedindo permissão
                    ActivityCompat.RequestPermissions(this, new string[] { Manifest.Permission.WriteExternalStorage }, REQUEST_CODE_WRITE_EXTERNAL_STORAGE);
                    return false;
                }
            }
            else
            { //A permissão é automaticamente concecida em sdk > 23 na instalação
                Log.Verbose("DEBUG", "A permissão está garantida!");
                return true;
            }
        }

        public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Permission[] grantResults)
        {
            base.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            Log.Debug("DEBUG", requestCode.ToString());
            if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.Length > 0 && grantResults[0] == Permission.Granted)
            {
                Log.Verbose("DEBUG", "Permission: " + permissions[0] + "was " + grantResults[0]);
                //A permissão necessária acabou de ser garantida, continue com a operação

                ConfigurateNfce();
            }
            else if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE)
            {
                Toast.MakeText(this, "É necessário garantir a permissão de armazenamento para a montagem da NFCe a ser enviada!", ToastLength.Long).Show();
            }
        }

        //Função que lê o xml que representa a nota NFC-e emitida e retorna uma String com o conteúdo
        private string GetTextOfFile()
        {
            string strFile;
            if (Build.VERSION.SdkInt >= BuildVersionCodes.R)
            {
                strFile = Application.GetExternalFilesDir(null).Path + "//IT4R//EnvioWS.xml";
            }
            else
            {
                strFile = Environment.ExternalStorageDirectory.AbsolutePath + "/EnvioWS.xml";
            }

            string strFileContent = "";
            File file = new File(strFile);

            if (file.Exists())
            {
                FileInputStream fis2 = null;
                try
                {
                    fis2 = new FileInputStream(file);
                    char current;
                    while (fis2.Available() > 0)
                    {
                        current = ((char)fis2.Read());
                        strFileContent = strFileContent + current;
                    }

                }
                catch (Exception e)
                {
                    Log.Debug("TourGuide", e.ToString());
                }
                finally
                {
                    if (fis2 != null) try
                        {
                            fis2.Close();
                        }
                        catch (Exception e)
                        {
                            Log.Debug("TourGuide", e.ToString());
                        }
                }
            }
            return strFileContent;
        }

        //Função que formata o preço do produto para o formato esperado na venda de itens uma vez que o formato esperado é de [0-9]+.00
        public string FormatPrice(string productPrice)
        {
            //Valor do campo formatado para a criação do BigDecimal formatado
            string valueFormatted = productPrice.Replace(",", ".").Trim();

            BigDecimal actualValueInBigDecimal;
            try
            {
                actualValueInBigDecimal = new BigDecimal(valueFormatted);
            }
            catch (Java.Lang.NumberFormatException e)
            {
                e.PrintStackTrace();
                //Se o número for maior que 999, a mask irá colocar um "." a mais, estas ocorrências devem ser removidas antes da comparação
                string[] valueSplitted = valueFormatted.Split("\\.");
                List<string> thousandsUnit = new List<string>(valueSplitted);

                StringBuilder valueWithoutThousandsComma = new StringBuilder();

                for (int i = 0; i < thousandsUnit.Count - 1; i++)
                    valueWithoutThousandsComma.Append(thousandsUnit[i]);

                valueWithoutThousandsComma.Append(".").Append(thousandsUnit[thousandsUnit.Count - 1]);

                actualValueInBigDecimal = new BigDecimal(valueWithoutThousandsComma.ToString());
            }

            return actualValueInBigDecimal.ToPlainString();
        }

        public void AlertMessageStatus(string messageAlert)
        {
            AlertDialog alertDialog = new AlertDialog.Builder(this).Create();
            alertDialog.SetTitle("NFC-e");
            alertDialog.SetMessage(messageAlert);
            alertDialog.SetButton((int)DialogButtonType.Neutral, "OK", (c, ev) =>
            {
                ((IDialogInterface)c).Dispose();
            });
            alertDialog.Show();
        }
    }
}