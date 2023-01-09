package com.elginm8.Pix4;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import com.elgin.e1.DisplayPIX4.PIX4;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Pix4Service {

    private static final List<Produto> carrinho = new ArrayList<>();
    private static Activity mActivity;

    public Pix4Service(Activity activityRef) {
        mActivity = activityRef;
        PIX4.setActivity(mActivity);
    }

    public static void abreConexaoDisplay() {
        int result =  PIX4.AbreConexaoDisplay();

        final String message;
        switch (result) {
            case 0:
                message = "Conexão com o dispositivo PIX4 bem sucedida!";
                break;
            case -12:
                message= "Dispositivo não existe!";
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
                throw new AssertionError(result); // Outro valor não é esperado.
        }

        Toast.makeText(mActivity, message, Toast.LENGTH_LONG).show();
    }

    public static int inicializaDisplay() {
        return PIX4.InicializaDisplay();
    }

    public static int reinicializaDisplay() {
        return PIX4.ReinicializaDisplay();
    }

    public static int desconectarDisplay() {
        return PIX4.DesconectarDisplay();
    }

    public static int obtemVersãoFirmware() {
        return PIX4.ObtemVersaoFirmware();
    }

    // Apresenta uma imagem no display, para o app-experience as imagens estão todas na mesma dimensão e serão colocadas na mesma posição.
    public static int apresentaImagemProdutoDisplay(Produto produto) {
        return PIX4.ApresentaImagemDisplay(produto.outputFileName, 0, 0, 0);
    }

    // Apresenta um QRCode na tela do dispostivo, para o app-experience todos os códigos terão o mesmo tamanho e estarão nas mesma posição.
    public static void apresentaQrCodeLinkGihtub(Framework framework) {
        // Refresh no display.
        inicializaDisplay();

        final String message = "Visite o exemplo do framework de desenvolvimento  mobile: " + framework.nome + " através do QR code acima!";
        final String separador = "────────────────────────────────";

        final String msgPart1 = String.format("%-26s", message.substring(0, 26));
        final String msgPart2 = String.format("%-26s", message.substring(26, 52));
        final String msgPart3 = String.format("%-26s", message.substring(52, 77));
        final String msgPart4 = String.format("%-26s", message.substring(77));

        PIX4.ApresentaQrCode(framework.githubLink, 200, 80, 50);
        PIX4.ApresentaTextoColorido(separador, 5, 20, 340, 0, "#005344");
        PIX4.ApresentaTextoColorido(msgPart1, 6, 20, 360, 0, "#005344");
        PIX4.ApresentaTextoColorido(msgPart2, 7, 20, 390, 0, "#005344");
        PIX4.ApresentaTextoColorido(msgPart3, 8, 20, 420, 0, "#005344");
        PIX4.ApresentaTextoColorido(msgPart4, 9, 22, 450, 0, "#005344");
    }

    // Apresenta, utilizando a função "ApresentaTextoColorido", rótulo com as informações do produto e quantidades adicionadas.
    public static void adicionaProdutoApresenta(Produto produto) {
        carrinho.add(produto);

        // Número de produtos do mesmo tipo do produto recém adicionado.
        long count = 0L;
        for (Produto product : carrinho) {
            if (product == produto) {
                count++;
            }
        }
        final int produtosDesteProduto = (int) count;

        // Formatação de cada linha do rótulo inferior que será mostrado.

        final String separador = "────────────────────────────────";
        final String nomePreco = String.format("%-16s %9s", "Item: " + produto.nome, "R$: " + produto.preco);
        final String qtdTotal = String.format("%-9s %16s", "Qtd: " + produtosDesteProduto, "Total R$: " + new BigDecimal(produto.preco).multiply(new BigDecimal(String.valueOf(produtosDesteProduto))));

        // Refresh no display.
        inicializaDisplay();

        apresentaImagemProdutoDisplay(produto);
        PIX4.ApresentaTextoColorido(separador, 17, 22, 400, 0, "#005344");
        PIX4.ApresentaTextoColorido(nomePreco, 18, 20, 420, 0, "#005344");
        PIX4.ApresentaTextoColorido(qtdTotal, 19, 20, 450, 0, "#005344");
    }

    // Apresenta a lista de produtos.
    public static void apresentaListaCompras() {
        // Refresh no display.
        inicializaDisplay();

        for (Produto produto : carrinho) {
            PIX4.ApresentaListaCompras(produto.nome, produto.preco);
        }
    }

    // Carrega as imagens no dipositivo, para apresentação posterior. É realizado em outra thread pois este processo pode demorar um pouco.
    public static void carregarImagens() {
        // Usado apenas para mostrar o Toast quando a configuração terminar.
        final Handler mHandler = new Handler(Looper.getMainLooper()) {};

        new Thread(() -> {
            final String imagesPath = "/sdcard/Download/";

            mHandler.post(() -> Toast.makeText(mActivity," O carregamento das imagens começou, aguarde até a mensagem de término do carregamento!", Toast.LENGTH_LONG).show());
            for (Produto produto : Produto.values()) {
                int result = PIX4.CarregaImagemDisplay(produto.outputFileName, imagesPath + produto.outputFileName, 320, 480);

                mHandler.post(() -> Toast.makeText(mActivity, (result == 0) ? ("A imagem do produto: " + produto.nome + " carregou com sucesso!") : ("Ocorreu um erro no carregamento da imagem do produto: " + produto.nome + "!\n Tente novamente!"), Toast.LENGTH_SHORT).show());
            }
            mHandler.post(() -> Toast.makeText(mActivity, "O carregamento das imagens dos produtos terminou !", Toast.LENGTH_LONG).show());
        }).start();
    }

    // Salva as imagens dos produtos, presentes em res/drawable, dentro do diretório Downloads do dispositivo.
    // É necessário para que, posteriamente, sejam carregadas dentro do dispositivo PIX4, já que as imagens só são carregadas no dispositivo através de referências para arquivos internos do M10.
    public static void executeStoreImages() {
        for (Produto produto : Produto.values()) {
            // Carrega a imagem do produto como Bitmap.
            final Bitmap produtoImageBitmap = BitmapFactory.decodeStream(mActivity.getResources().openRawResource(mActivity.getResources().getIdentifier(produto.assetFileName, "drawable", mActivity.getPackageName())));

            // A imagem deve ser salva com as especificações máximas do dispositivo, para isso é a configuração no bitmap.
            final Bitmap bitmapFormatted = formatBitmapForPix4(produtoImageBitmap);

            storeImageWith72Dpi(bitmapFormatted, produto.outputFileName);
        }
    }

    // As especificações máximas de uma imagem para o funcionamento correto para o PIX4 é de 320 x 480.
    private static Bitmap formatBitmapForPix4(Bitmap bitmap) {
        return Bitmap.createScaledBitmap(bitmap, 320, 480, false);
    }

    // Salva um bitmap como imagem .jpg no diretório Downloads do dispotivo.
    // No momento o PIX 4 via biblioteca android só possuí suporte a imagens com no máximo 72 DPI, por isto as imagens são modificadas para serem salvas contendo esta especifícação.
    private static void storeImageWith72Dpi(Bitmap image, String fileName) {
        // Diretório.
        final String downloadsDirPath = "/storage/emulated/0/Download/";
        // Cria o arquivo no diretório.
        final File pictureFile = new File(downloadsDirPath + fileName);

        // Salva o bitmap como imagem no diretório.
        try {
            FileOutputStream fos = new FileOutputStream(pictureFile);

            ByteArrayOutputStream imageByteArray = new ByteArrayOutputStream();
            image.compress(Bitmap.CompressFormat.JPEG, 30, imageByteArray);
            byte[] imageData = imageByteArray.toByteArray();

            setDpi(imageData, 72);

            fos.write(imageData);
            fos.close();
        } catch (FileNotFoundException e) {
            Log.e("Error", "Arquivo não encontrado: " + e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            Log.e("Error", "Erro ao acessar o arquivo: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void setDpi(byte[] imageData, int dpi) {
        imageData[13] = 1;
        imageData[14] = (byte) (dpi >> 8);
        imageData[15] = (byte) (dpi & 0xff);
        imageData[16] = (byte) (dpi >> 8);
        imageData[17] = (byte) (dpi & 0xff);
    }
}
