using Xamarin.Forms;
using Com.Elgin.E1.DisplayPIX4;
using Android.Widget;
using Android.App;
using System;
using System.Linq;
using System.Collections.Generic;
using Java.Math;
using System.Threading;
using Android.OS;
using Android.Graphics;
using Android.Content.Res;
using System.IO;
using Android.Util;
using Java.IO;
using FileNotFoundException = Java.IO.FileNotFoundException;
using IOException = Java.IO.IOException;
using File = System.IO.File;

[assembly: Dependency(typeof(M8XamarinForms.Droid.IPix4Implementation))]
namespace M8XamarinForms.Droid
{
    class IPix4Implementation : IPix4
    {
        private Activity mActivity;

        private List<Produto> carrinho = new List<Produto>();

        public IPix4Implementation()
        {
            mActivity = (MainActivity)Forms.Context;
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
                    throw new Exception(result + ""); // Outro valor não é esperado.
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

        // Apresenta uma imagem no display, para o app-experience as imagens estão todas na mesma dimensão e serão colocadas na mesma posição.
        public int ApresentaImagemProdutoDisplay(Produto produto)
        {
            return PIX4.ApresentaImagemDisplay(produto.OutputFileName, 0, 0, 0);
        }

        // Apresenta um QRCode na tela do dispostivo, para o app-experience todos os códigos terão o mesmo tamanho e estarão nas mesma posição.
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

        // Apresenta a lista de produtos.
        public void ApresentaListaCompras()
        {
            // Refresh no display.
            InicializaDisplay();

            foreach (Produto produto in carrinho)
            {
                PIX4.ApresentaListaCompras(produto.Nome, produto.Preco);
            }
        }

        // Carrega as imagens no dipositivo, para apresentação posterior. É realizado em outra thread pois este processo pode demorar um pouco.
        public void CarregarImagens()
        {
            // Usado apenas para mostrar o Toast quando a configuração terminar.
            Handler mHandler = new Handler(Looper.MainLooper) { };

            Thread t = new Thread(() =>
            {
                string imagesPath = "/sdcard/Download/";

                mHandler.Post(delegate
                {
                    Toast.MakeText(mActivity, " O carregamento das imagens começou, aguarde até a mensagem de término do carregamento!", ToastLength.Long).Show();
                });

                foreach (Produto produto in Produto.ALL_VALUES)
                {
                    int result = PIX4.CarregaImagemDisplay(produto.OutputFileName, imagesPath + produto.OutputFileName, 320, 480);

                    mHandler.Post(delegate
                    {
                        Toast.MakeText(mActivity, (result == 0) ? ("A imagem do produto: " + produto.Nome + " carregou com sucesso!") : ("Ocorreu um erro no carregamento da imagem do produto: " + produto.Nome + "!\n Tente novamente!"), ToastLength.Long).Show();
                    });
                }

                mHandler.Post(delegate
                {
                    Toast.MakeText(mActivity, "O carregamento das imagens dos produtos terminou !", ToastLength.Long).Show();
                });
            });
            t.Start();
        }

        // Salva as imagens dos produtos, presentes em res/drawable, dentro do diretório Downloads do dispositivo.
        // É necessário para que, posteriamente, sejam carregadas dentro do dispositivo PIX4, já que as imagens só são carregadas no dispositivo através de referências para arquivos internos do M10.
        public void ExecuteStoreImages()
        {
            foreach (Produto produto in Produto.ALL_VALUES)
            {

                Stream istr;
                Bitmap produtoImageBitmap = null;
                try
                {
                    // Carrega a imagem do produto como Bitmap.
                    istr = mActivity.Resources.OpenRawResource(mActivity.Resources.GetIdentifier(produto.AssetFileName, "drawable", mActivity.PackageName));

                    produtoImageBitmap = BitmapFactory.DecodeStream(istr);

                    // A imagem deve ser salva com as especificações máximas do dispositivo, para isso é a configuração no bitmap.
                    Bitmap bitmapFormatted = FormatBitmapForPix4(produtoImageBitmap);

                    StoreImageWith72Dpi(bitmapFormatted, produto.OutputFileName);
                }
                catch (IOException e)
                {
                    Log.Error("Error", "Erro ao acessar o arquivo: " + e.Message);
                    Log.Error("Error", e.StackTrace);
                }
            }
        }

        // As especificações máximas de uma imagem para o funcionamento correto para o PIX4 é de 320 x 480.
        private Bitmap FormatBitmapForPix4(Bitmap bitmap)
        {
            return Bitmap.CreateScaledBitmap(bitmap, 320, 480, false);
        }

        // Salva um bitmap como imagem .jpg no diretório Downloads do dispotivo.
        // No momento o PIX 4 via biblioteca android só possuí suporte a imagens com no máximo 72 DPI, por isto as imagens são modificadas para serem salvas contendo esta especifícação.
        private void StoreImageWith72Dpi(Bitmap image, string fileName)
        {
            // Diretório.
            string downloadsDirPath = "/storage/emulated/0/Download/";

            // Cria o arquivo no diretório.
            string fullPath = downloadsDirPath + fileName;

            // Salva o bitmap como imagem no diretório.
            try
            {
                if (File.Exists(fullPath))
                {
                    return;
                }
                Stream fos = new FileStream(fullPath, FileMode.Create);

                MemoryStream imageByteArray = new MemoryStream();
                image.Compress(Bitmap.CompressFormat.Jpeg, 30, imageByteArray);
                byte[] imageData = imageByteArray.ToArray();

                SetDpi(imageData, 72);

                fos.Write(imageData);
                fos.Close();
            }
            catch (FileNotFoundException e)
            {
                Log.Error("Error", "Arquivo não encontrado: " + e.Message);
                Log.Error("Error", e.StackTrace);
            }
            catch (IOException e)
            {
                Log.Error("Error", "Erro ao acessar o arquivo: " + e.Message);
                Log.Error("Error", e.StackTrace);
            }
        }

        private void SetDpi(byte[] imageData, int dpi)
        {
            imageData[13] = 1;
            imageData[14] = (byte)(dpi >> 8);
            imageData[15] = (byte)(dpi & 0xff);
            imageData[16] = (byte)(dpi >> 8);
            imageData[17] = (byte)(dpi & 0xff);
        }
    }
}