using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Android.App;
using Android.OS;
using Android.Widget;
using Com.Elgin.E1.DisplayPIX4;
using Java.Math;

namespace M8
{
    public class Pix4Service
    {
        private readonly List<Produto> carrinho = new List<Produto>();
        private readonly Activity mActivity;

        public Pix4Service(Activity activityRef)
        {
            mActivity = activityRef;
            PIX4.SetActivity(mActivity);
        }

        public void AbreConexaoDisplay()
        {
            int result = PIX4.AbreConexaoDisplay();

            string message;
            switch (result)
            {
                case 0:
                    message = "Conexão com o dispositivo PIX4 bem sucedida!";
                    break;
                case -12:
                    message = "Dispositivo não existe!";
                    break;
                case 13:
                    message = "Permissão negada!";
                    break;
                case -14:
                    message = "Erro desconhecido!";
                    break;
                case -19:
                    message = "Dispositivo removido inesperadamente!";
                    break;
                case -1:
                    message = "Conexão mal sucedida";
                    break;
                default:
                    throw new Exception("Outro valor não é esperado.");
            }

            Toast.MakeText(mActivity, message, ToastLength.Long).Show();
        }

        public int InicializaDisplay()
        {
            return PIX4.InicializaDisplay();
        }

        public int ReinicializaDisplay()
        {
            return PIX4.ReinicializaDisplay();
        }

        public int DesconectarDisplay()
        {
            return PIX4.DesconectarDisplay();
        }

        public int ObtemVersãoFirmware()
        {
            return PIX4.ObtemVersaoFirmware();
        }

        private int ApresentaImagemProdutoDisplay(Produto produto)
        {
            return PIX4.ApresentaImagemDisplay(produto.FileName, 0, 0, 0);
        }

        public void ApresentaQrCodeLinkGihtub(Framework framework)
        {
            // Refresh no display.
            InicializaDisplay();

            string message = "Visite o exemplo do framework de desenvolvimento  mobile: " + framework.Nome + " através do QR code acima!";
            string separador = "────────────────────────────────";

            string msgPart1 = message.Substring(0, 26);
            string msgPart2 = message.Substring(26, 26);
            string msgPart3 = message.Substring(52, 25);
            string msgPart4 = message[77..];

            PIX4.ApresentaQrCode(framework.GithubLink, 200, 80, 50);
            PIX4.ApresentaTextoColorido(separador, 5, 20, 340, 0, "#005344");
            PIX4.ApresentaTextoColorido(msgPart1, 6, 20, 360, 0, "#005344");
            PIX4.ApresentaTextoColorido(msgPart2, 7, 20, 390, 0, "#005344");
            PIX4.ApresentaTextoColorido(msgPart3, 8, 20, 420, 0, "#005344");
            PIX4.ApresentaTextoColorido(msgPart4, 9, 22, 450, 0, "#005344");
        }

        // Apresenta, utilizando a função "ApresentaTextoColorido", rótulo com as informações do produto e quantidades adicionadas.
        public void AdicionaProdutoApresenta(Produto produto)
        {
            carrinho.Add(produto);

            // Número de produtos do mesmo tipo do produto recém adicionado.
            carrinho.Where(product => product == produto);
            int produtosDesteProduto = carrinho.Where(product => product == produto).Count();

            // Formatação de cada linha do rótulo inferior que será mostrado.

            string separador = "────────────────────────────────";
            string nomePreco = string.Format("{0, 16} {1, 9}", "Item: " + produto.Nome, "R$: " + produto.Preco);
            string qtdTotal = string.Format("{0, 9} {1, 16}", "Qtd: " + produtosDesteProduto, "Total R$: " + new BigDecimal(produto.Preco).Multiply(new BigDecimal(produtosDesteProduto.ToString())));

            // Refresh no display.
            InicializaDisplay();

            ApresentaImagemProdutoDisplay(produto);
            PIX4.ApresentaTextoColorido(separador, 17, 22, 400, 0, "#005344");
            PIX4.ApresentaTextoColorido(nomePreco, 18, 20, 420, 0, "#005344");
            PIX4.ApresentaTextoColorido(qtdTotal, 19, 20, 450, 0, "#005344");
        }

        // Present the list of products.
        public void ApresentaListaCompras()
        {
            // Refresh the display.
            this.InicializaDisplay();

            foreach (Produto produto in carrinho)
            {
                PIX4.ApresentaListaCompras(produto.Nome, produto.Preco);
            }
        }

        // Loads the images on the device for later presentation. It is performed on another thread as this process may take a while.
        public void CarregarImagens()
        {
            // Used only to show the Toast when the configuration is finished.
            var mHandler = new Handler(Looper.MainLooper) { };

            new Thread(() =>
            {
                var imagesPath = "/sdcard/Download/";

                mHandler.Post(() => Toast.MakeText(mActivity, "O carregamento das imagens começou, aguarde até a mensagem de término do carregamento!", ToastLength.Long).Show());
                foreach (Produto produto in Produto.values)
                {
                    int result = PIX4.CarregaImagemDisplay(produto.FileName, imagesPath + produto.FileName, 320, 480);

                    mHandler.Post(() => Toast.MakeText(mActivity, (result == 0) ? ("A imagem do produto: " + produto.Nome + " carregou com sucesso!") : ("Ocorreu um erro no carregamento da imagem do produto: " + produto.Nome + "!\n Tente novamente!"), ToastLength.Short).Show());
                }
                mHandler.Post(() => Toast.MakeText(mActivity, "O carregamento das imagens dos produtos terminou !", ToastLength.Long).Show());
            }).Start();
        }
    }
}
