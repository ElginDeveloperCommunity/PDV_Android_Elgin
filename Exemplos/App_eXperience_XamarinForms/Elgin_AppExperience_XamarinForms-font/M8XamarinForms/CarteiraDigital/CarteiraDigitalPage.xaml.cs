using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class CarteiraDigitalPage : ContentPage
    {
        private readonly ShipayClient shipayClient;
        private string accessToken;
        private string selectedWallet = "shipay-pagador";
        private string status = "";
        private string orderId;

        private OrderResponse orderResponse = null;

        public CarteiraDigitalPage()
        {
            InitializeComponent();
            btnShipayProvider.BorderColor = Color.FromHex("23F600");

            shipayClient = new ShipayClient();
            Authenticate();
        }

        private async void Authenticate()
        {
            AuthenticationRequest request = new AuthenticationRequest
            {
                accessKey = "HV8R8xc28hQbX4fq_jaK1A",
                clientId = "8HMB1egUeKI-h9s4I3gU_w1R6kYifrUfZRrauhvjvX9y2bVoBdpoH7vVm3FZOfFejKB-rEIRjVHBEQxrW93iE40ljPwcVEgfZnKN5SvObHxHvXrgfg87A7aUOeWroajczHNt6KUOwB4-YH90RidhzIJhQ0GEjKwpQt93XJeC1XE",
                secretKey = "ZBD0yR5ybNuHPKqvH0YEiL-hXzfsd4mbot5NuZQ75ZqpMFVuTN__mkFnbl7E6QbXYhVlohnBQ7GQaoLckrrmAA"
            };
            AuthenticationResponse response = await shipayClient.authenticate(request);
            accessToken = response.accessToken;

            GetWallets();
        }

        private async void GetWallets()
        {
            WalletsResponse response = await shipayClient.getWallets();

            List<Button> walletOptions = new List<Button>(response.wallets.Count);
            foreach (Wallet wallet in response.wallets)
            {
                Button buttonWalletOption = new Button();

                //Dimensões
                buttonWalletOption.SetDynamicResource(StyleProperty, "carteiraDigitalSelectionButton");
                buttonWalletOption.Padding = new Thickness(20, 0, 20, 0);

                // Borda
                if (wallet.name == "shipay-pagador")
                {
                    buttonWalletOption.BorderColor = Color.FromHex("23F600");
                }

                // Texto
                buttonWalletOption.Text = wallet.name;

                buttonWalletOption.Clicked += delegate {
                    // Colocar na cor verde & set wallet selecionada
                    buttonWalletOption.BorderColor = Color.FromHex("23F600");
                    selectedWallet = wallet.name;

                    // Colocar outros botões na cor preto
                    foreach (Button button in walletOptions)
                    {
                        if (button != buttonWalletOption)
                        {
                            button.BorderColor = Color.Black;
                        }
                    }
                };

                carteiraDigitalWalletOptionsStack.Children.Add(buttonWalletOption);
                walletOptions.Add(buttonWalletOption);
            }

            btnEnviarTransacao.IsEnabled = true;
        }

        private async void CreateOrder(object sender, EventArgs e)
        {
            OrderRequest request = new OrderRequest
            {
                orderRef = "shipaypag-stg-005",
                wallet = selectedWallet,
                total = float.Parse(valorEntry.Text)
            };

            OrderItem item = new OrderItem
            {
                itemTitle = "Cerveja Heineken",
                unitPrice = float.Parse(valorEntry.Text),
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

            string formattedDate = DateTime.Now.ToString();

            OrderResponse response = await shipayClient.createOrder(request);
            System.Diagnostics.Debug.WriteLine(response.status);

            // Load Qr Code
            string cleanImage = response.qrCode.Replace("data:image/png;base64,", "").Replace("data:image/jpeg;base64,", "");
            byte[] decodedString = Convert.FromBase64String(cleanImage);
            imgQrCode.Source= ImageSource.FromStream(() => new MemoryStream(decodedString));
            System.Diagnostics.Debug.WriteLine(cleanImage);
            textValorVenda.Text = $"Valor:\t\t\t\t\t\t\t\t\t\t{"R$ " + valorEntry.Text}";
            textDataVenda.Text = $"Data:\t\t\t\t\t\t\t\t\t\t{formattedDate}";
            textStatusVenda.Text = $"Status:\t\t\t\t\t\t\t\t\t{GetFormattedStatus(response.status)}";
            textCarteiraVenda.Text = $"Carteira:\t\t\t\t\t\t\t\t{response.wallet}";
            status = GetFormattedStatus(response.status);

            orderId = response.orderId;

            responseTextContainer.IsVisible = true;

            btnCancelarTransacao.IsEnabled = true;
            btnStatusTransacao.IsEnabled = true;

            orderResponse = response;

            if (orderResponse.wallet == "pix")
            {
                btnPixOrDeepLink.Text = "COPIAR PIX";
                btnPixOrDeepLink.IsVisible = true;
            }
            else if (orderResponse.wallet == "mercadopago")
            {
                btnPixOrDeepLink.Text = "ABRIR MERCADO PAGO";
                btnPixOrDeepLink.IsVisible = true;
            }
            else
            {
                btnPixOrDeepLink.IsVisible = false;
            }
        }

        private async void CancelOrder(object sender, EventArgs e)
        {
            if (status == "Cancelado" || status == "Devolvido")
            {
                await DisplayAlert("ERRO", "Transação já foi cancelada", "OK");
                return;
            }

            bool answer = await DisplayAlert("Cancelar transação", "Tem certeza de que quer cancelar a transação?", "Sim", "Não");
            if (answer)
            {
                CancelOrderResponse response = await shipayClient.cancelOrder(orderId);
                textStatusVenda.Text = $"Status:\t\t\t\t\t\t\t\t\t{GetFormattedStatus(response.status)}";
            }
        }

        protected void GetPixOrDeepLink(object sender, EventArgs e)
        {
            if (orderResponse.wallet == "mercadopago")
            {
                OpenDeepLink(orderResponse.deepLink);
            }
            else if (orderResponse.wallet == "pix")
            {
                CopyPixCode(orderResponse.qrCodeText);
            }
        }

        private async void CopyPixCode(string pixCode)
        {
            Console.WriteLine("PIX COPIADO: {0}", pixCode);
            await Clipboard.SetTextAsync(pixCode);
            DependencyService.Get<IMessage>().LongAlert("PIX COPIADO!");
        }

        private async void OpenDeepLink(string deepLink)
        {
            Console.WriteLine("ABRINDO MERCADO PAGO: {0}", deepLink);
            if (!await Launcher.TryOpenAsync(deepLink))
            {
                await Browser.OpenAsync(deepLink);
            }
        }

        protected async void GetOrderStatus(object sender, EventArgs e)
        {
            OrderStatusResponse response = await shipayClient.getOrderStatus(orderId);
            textStatusVenda.Text = $"Status:\t\t\t\t\t\t\t\t\t{GetFormattedStatus(response.status)}";
            Console.WriteLine("GET STATUS: {0}", status);
            status = GetFormattedStatus(response.status);
            DependencyService.Get<IMessage>().LongAlert("STATUS: " + status);
        }

        protected string GetFormattedStatus(string status)
        {
            switch (status)
            {
                case "approved": return "Aprovado";
                case "expired": return "Expirado";
                case "cancelled": return "Cancelado";
                case "refunded": return "Devolvido";
                case "pending": return "Pendente";
                case "refund_pending": return "Estorno Pendente";
                default: return "Desconhecido";
            };
        }
    }
}