using Android.App;
using Android.Graphics;
using Android.OS;
using Android.Util;
using Android.Views;
using Android.Widget;
using AndroidX.AppCompat.Content.Res;
using AndroidX.AppCompat.Widget;
using AndroidX.Core.Content;
using AndroidX.Core.Content.Resources;
using Java.Net;
using Java.Text;
using Java.Util;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net.Http;
using Xamarin.Essentials;

namespace M8
{
    [Activity(Label = "CarteiraDigital")]
    public class CarteiraDigital : Activity
    {
        EditText editTextValueShipay;

        LinearLayout layoutWalletOptions;

        Button btnShipayProvider, btnEnviarTransacao, btnCancelarTransacao, btnPixOrDeepLink, btnStatusTransacao;

        View responseContainer;

        TextView textValorVenda;
        TextView textDataVenda;
        TextView textStatusVenda;
        TextView textCarteiraVenda;

        ImageView imgQrCode;

        ShipayClient shipayClient;
        private string accessToken;
        private string orderId;

        private string formattedDate = "";
        private string valor = "";
        private string selectedWallet = "shipay-pagador";
        private string status = "";

        private OrderResponse orderResponse = null;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.carteira_digital);

            shipayClient = new ShipayClient();

            btnShipayProvider = FindViewById<Button>(Resource.Id.buttonShipayOption);
            layoutWalletOptions = FindViewById<LinearLayout>(Resource.Id.layoutWalletOptions);

            editTextValueShipay = FindViewById<EditText>(Resource.Id.editTextInputValueShipay);

            btnEnviarTransacao = FindViewById<Button>(Resource.Id.buttonEnviarTransacao);
            btnCancelarTransacao = FindViewById<Button>(Resource.Id.buttonCancelarTransacao);
            btnPixOrDeepLink = FindViewById<Button>(Resource.Id.buttonPixOrDeepLink);
            btnStatusTransacao = FindViewById<Button>(Resource.Id.buttonStatusTransacao);

            responseContainer = FindViewById<View>(Resource.Id.responseContainer);

            textValorVenda = FindViewById<TextView>(Resource.Id.textValorVenda);
            textDataVenda = FindViewById<TextView>(Resource.Id.textDataVenda);
            textStatusVenda = FindViewById<TextView>(Resource.Id.textStatusVenda);
            textCarteiraVenda = FindViewById<TextView>(Resource.Id.textCarteiraVenda);

            imgQrCode = FindViewById<ImageView>(Resource.Id.imgQrCode);

            Authenticate();

            btnEnviarTransacao.Click += delegate {
                CreateOrder();
            };

            btnCancelarTransacao.Click += delegate
            {
                CancelOrder();
            };

            btnPixOrDeepLink.Click += delegate
            {
                if (orderResponse.wallet == "mercadopago")
                {
                    OpenDeepLink(orderResponse.deepLink);
                }
                else if (orderResponse.wallet == "pix")
                {
                    CopyPixCode(orderResponse.qrCodeText);
                }
            };

            btnStatusTransacao.Click += delegate
            {
                GetOrderStatus();
            };
        }

        protected async void Authenticate()
        {
            try
            {
                AuthenticationRequest request = new AuthenticationRequest
                {
                    accessKey = "HV8R8xc28hQbX4fq_jaK1A",
                    clientId = "8HMB1egUeKI-h9s4I3gU_w1R6kYifrUfZRrauhvjvX9y2bVoBdpoH7vVm3FZOfFejKB-rEIRjVHBEQxrW93iE40ljPwcVEgfZnKN5SvObHxHvXrgfg87A7aUOeWroajczHNt6KUOwB4-YH90RidhzIJhQ0GEjKwpQt93XJeC1XE",
                    secretKey = "ZBD0yR5ybNuHPKqvH0YEiL-hXzfsd4mbot5NuZQ75ZqpMFVuTN__mkFnbl7E6QbXYhVlohnBQ7GQaoLckrrmAA"
                };
                AuthenticationResponse response = await shipayClient.Authenticate(request);
                Log.Info("AUTH", response.accessToken + " " + response.refreshToken);
                accessToken = response.accessToken;

                GetWallets();
            }
            catch (UnknownHostException e)
            {
                e.PrintStackTrace();
                AlertDialog.Builder alert = new AlertDialog.Builder(this);
                //define o titulo e mensagem a exibir no dialogo
                alert.SetTitle("ERRO");
                alert.SetMessage("" + e.Message);
                //define o botão positivo
                alert.SetPositiveButton("OK", (senderAlert, args) => { });
                alert.Show();
            }
        }

        protected async void GetWallets()
        {
            WalletsResponse response = await shipayClient.GetWallets();
            Log.Info("WALLETS", "" + response.wallets.Count);
            
            List<AppCompatButton> walletOptions = new List<AppCompatButton>(response.wallets.Count);
            foreach (Wallet wallet in response.wallets) {
                AppCompatButton buttonWalletOption = new AppCompatButton(this);

                //Dimensões
                float scale = Resources.DisplayMetrics.Density;
                buttonWalletOption.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, (int)(30 * scale));
                buttonWalletOption.SetPadding(20, 0, 20, 0);

                // Borda
                buttonWalletOption.Background = ContextCompat.GetDrawable(this, Resource.Drawable.box);
                buttonWalletOption.SupportBackgroundTintList = (AppCompatResources.GetColorStateList(this, Resource.Color.black));
                if (wallet.name=="shipay-pagador")
                {
                    buttonWalletOption.SupportBackgroundTintList = AppCompatResources.GetColorStateList(this, Resource.Color.verde);
                }

                // Texto
                buttonWalletOption.SetTextSize(ComplexUnitType.Sp, 14);
                buttonWalletOption.SetTextColor(new Color(ContextCompat.GetColor(this, Resource.Color.black)));
                buttonWalletOption.Text = wallet.name;

                // Fonte do texto
                Typeface typeface = ResourcesCompat.GetFont(this, Resource.Font.robotobold);
                buttonWalletOption.Typeface = typeface;

                buttonWalletOption.Click += delegate  {
                    // Colocar na cor verde & set wallet selecionada
                    buttonWalletOption.SupportBackgroundTintList = AppCompatResources.GetColorStateList(this, Resource.Color.verde);
                    selectedWallet = wallet.name;

                    // Colocar outros botões na cor preto
                    foreach (AppCompatButton button in walletOptions)
                    {
                        if (button != buttonWalletOption)
                        {
                            button.SupportBackgroundTintList = AppCompatResources.GetColorStateList(this, Resource.Color.black);
                        }
                    }
                };

                btnEnviarTransacao.Enabled = true;

                layoutWalletOptions.AddView(buttonWalletOption);
                walletOptions.Add(buttonWalletOption);
            }
        }

        protected async void CreateOrder()
        {
            if (string.IsNullOrEmpty(editTextValueShipay.Text))
            {
                AlertDialog.Builder alert = new AlertDialog.Builder(this);
                //define o titulo e mensagem a exibir no dialogo
                alert.SetTitle("ERRO");
                alert.SetMessage("Campo VALOR não pode estar vazio");
                //define o botão positivo
                alert.SetPositiveButton("OK", (senderAlert, args) => { });
                alert.Show();
                return;
            }
            OrderRequest request = new OrderRequest
            {
                orderRef = "shipaypag-stg-005",
                wallet = selectedWallet,
                total = float.Parse(editTextValueShipay.Text, CultureInfo.InvariantCulture)
            };
            Log.Info("NEW ORDER", "" + request.total);

            OrderItem item = new OrderItem
            {
                itemTitle = "Cerveja Heineken",
                unitPrice = float.Parse(editTextValueShipay.Text, CultureInfo.InvariantCulture),
                quantity = 1
            };

            Buyer buyer = new Buyer
            {
                firstName = "Shipay",
                lastName = "PDV",
                cpf = "000.000.000-00",
                email = "shipaypagador@shipay.com.br",
                phone = "+55 11 99999-9999"
            };

            request.items = new List<OrderItem>
            {
                item
            };

            request.buyer = buyer;

            try
            {
                SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                string formattedDate = formatter.Format(new Date());

                OrderResponse response = await shipayClient.CreateOrder(request);
                Log.Info("NEW ORDER", response.orderId);
                Log.Info("NEW ORDER", response.qrCode);

                // Load Qr Code
                string cleanImage = response.qrCode.Replace("data:image/png;base64,", "").Replace("data:image/jpeg;base64,", "");
                byte[] decodedString = Android.Util.Base64.Decode(cleanImage, Base64Flags.Default);
                Bitmap bitMap = BitmapFactory.DecodeByteArray(decodedString, 0, decodedString.Length);
                imgQrCode.SetImageBitmap(bitMap);

                textValorVenda.Text = $"Valor:\t\t\t\t\t\t\t\t\t{"R$ " + editTextValueShipay.Text}";
                textDataVenda.Text = $"Data:\t\t\t\t\t\t\t\t\t\t{formattedDate}";
                textStatusVenda.Text = $"Status:\t\t\t\t\t\t\t\t\t{GetFormattedStatus(response.status)}";
                textCarteiraVenda.Text = $"Carteira:\t\t\t\t\t\t\t\t{response.wallet}";

                orderId = response.orderId;
                valor = "R$ " + editTextValueShipay.Text;
                this.formattedDate = formattedDate;
                status = GetFormattedStatus(response.status);

                responseContainer.Visibility = ViewStates.Visible;
                orderResponse = response;

                if (orderResponse.wallet == "pix")
                {
                    btnPixOrDeepLink.Text = "COPIAR PIX";
                    btnPixOrDeepLink.Visibility = ViewStates.Visible;
                }
                else if (orderResponse.wallet == "mercadopago")
                {
                    btnPixOrDeepLink.Text = "ABRIR MERCADO PAGO";
                    btnPixOrDeepLink.Visibility = ViewStates.Visible;
                }
                else
                {
                    btnPixOrDeepLink.Visibility = ViewStates.Invisible;
                }

                responseContainer.Visibility = ViewStates.Visible;

                btnCancelarTransacao.Enabled = true;
                btnStatusTransacao.Enabled = true;
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("CREATE ORDER ERROR: " + e.Message);
            }
        }

        private async void CopyPixCode(string pixCode)
        {
            await Clipboard.SetTextAsync(pixCode);
            Toast.MakeText(this, "PIX COPIADO!", ToastLength.Long).Show();
            Log.Info("PIX COPIADO", pixCode);
        }

        private async void OpenDeepLink(string deepLink)
        {
            Log.Info("ABRINDO MERCADO PAGO", deepLink);
            if (!await Launcher.TryOpenAsync(deepLink))
            {
                await Browser.OpenAsync(deepLink);
            }
        }

        protected void CancelOrder()
        {
            if (status == "Cancelado" || status == "Devolvido")
            {
                AlertDialog.Builder alertErro = new AlertDialog.Builder(this);
                //define o titulo e mensagem a exibir no dialogo
                alertErro.SetTitle("ERRO");
                alertErro.SetMessage("Transação já foi cancelada");
                //define o botão positivo
                alertErro.SetPositiveButton("OK", (senderAlert, args) => { });
                alertErro.Show();
                return;
            }
            AlertDialog.Builder alert = new AlertDialog.Builder(this);
            //define o titulo e mensagem a exibir no dialogo
            alert.SetTitle("Cancelar transação");
            alert.SetMessage("Tem certeza de que quer cancelar a transação?");
            //define o botão positivo
            alert.SetPositiveButton("Sim", async (senderAlert, args) =>
            {
                CancelOrderResponse response = await shipayClient.CancelOrder(orderId);
                Log.Info("CANCEL", response.status);
                status = GetFormattedStatus(response.status);
                textStatusVenda.Text = $"Status:\t\t\t\t\t\t\t\t\t{GetFormattedStatus(response.status)}";
            });
            alert.SetNegativeButton("Não", (senderAlert, args) => {});
            alert.Show();
        }

        protected async void GetOrderStatus()
        {
            OrderStatusResponse response = await shipayClient.GetOrderStatus(orderId);
            status = GetFormattedStatus(response.status);
            textStatusVenda.Text = $"Status:\t\t\t\t\t\t\t\t\t{GetFormattedStatus(response.status)}";
            Toast.MakeText(this, "STATUS: " + status, ToastLength.Long).Show();
        }

        protected string GetFormattedStatus(string status) {
            return status switch
            {
                "approved" => "Aprovado",
                "expired" => "Expirado",
                "cancelled" => "Cancelado",
                "refunded" => "Devolvido",
                "pending" => "Pendente",
                "refund_pending" => "Estorno Pendente",
                _ => "Desconhecido",
            };
        }
    }
}