package com.elgin.elginexperience.Services.Pix4;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import com.elgin.e1.DisplayPIX4.PIX4;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import br.com.daruma.framework.mobile.sat.elementosCFe.Prod;

final public class Pix4Service {

    private final List<Produto> carrinho = new ArrayList<>();

    private final Activity mActivity;

    public Pix4Service(Activity activityRef) {
        mActivity = activityRef;
        PIX4.setActivity(mActivity);
    }

    public void abreConexaoDisplay() {
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

    public int inicializaDisplay() {
        return PIX4.InicializaDisplay();
    }

    public int reinicializaDisplay() {
        return PIX4.ReinicializaDisplay();
    }

    public int desconectarDisplay() {
        return PIX4.DesconectarDisplay();
    }

    public int obtemVersãoFirmware() {
        return PIX4.ObtemVersaoFirmware();
    }

    // Apresenta uma imagem no display, para o app-experience as imagens estão todas na mesma dimensão e serão colocadas na mesma posição.
    public int apresentaImagemProdutoDisplay(Produto produto) {
        return PIX4.ApresentaImagemDisplay(produto.fileName, 0, 0, 0);
    }

    // Apresenta um QRCode na tela do dispostivo, para o app-experience todos os códigos terão o mesmo tamanho e estarão nas mesma posição.
    public void apresentaQrCodeLinkGihtub(Framework framework) {
        // Refresh no display.
        this.inicializaDisplay();

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
    public void adicionaProdutoApresenta(Produto produto) {
        carrinho.add(produto);

        // Número de produtos do mesmo tipo do produto recém adicionado.
        final int produtosDesteProduto = (int) carrinho.stream().filter(product -> product == produto).count();

        // Formatação de cada linha do rótulo inferior que será mostrado.

        final String separador = "────────────────────────────────";
        final String nomePreco = String.format("%-16s %9s", "Item: " + produto.nome, "R$: " + produto.preco);
        final String qtdTotal = String.format("%-9s %16s", "Qtd: " + produtosDesteProduto, "Total R$: " + new BigDecimal(produto.preco).multiply(new BigDecimal(String.valueOf(produtosDesteProduto))));

        // Refresh no display.
        this.inicializaDisplay();

        this.apresentaImagemProdutoDisplay(produto);
        PIX4.ApresentaTextoColorido(separador, 17, 22, 400, 0, "#005344");
        PIX4.ApresentaTextoColorido(nomePreco, 18, 20, 420, 0, "#005344");
        PIX4.ApresentaTextoColorido(qtdTotal, 19, 20, 450, 0, "#005344");
    }

    // Apresenta a lista de produtos.
    public void apresentaListaCompras() {
        // Refresh no display.
        this.inicializaDisplay();

        for (Produto produto : carrinho) {
            PIX4.ApresentaListaCompras(produto.nome, produto.preco);
        }
    }

    // Carrega as imagens no dipositivo, para apresentação posterior. É realizado em outra thread pois este processo pode demorar um pouco.
    public void carregarImagens() {
        // Usado apenas para mostrar o Toast quando a configuração terminar.
        final Handler mHandler = new Handler(Looper.getMainLooper()) {};

        new Thread(() -> {
            final String imagesPath = "/sdcard/Download/";

            mHandler.post(() -> Toast.makeText(mActivity," O carregamento das imagens começou, aguarde até a mensagem de término do carregamento!", Toast.LENGTH_LONG).show());
            for (Produto produto : Produto.values()) {
                int result = PIX4.CarregaImagemDisplay(produto.fileName, imagesPath + produto.fileName, 320, 480);

                mHandler.post(() -> Toast.makeText(mActivity, (result == 0) ? ("A imagem do produto: " + produto.nome + " carregou com sucesso!") : ("Ocorreu um erro no carregamento da imagem do produto: " + produto.nome + "!\n Tente novamente!"), Toast.LENGTH_SHORT).show());
            }
            mHandler.post(() -> Toast.makeText(mActivity, "O carregamento das imagens dos produtos terminou !", Toast.LENGTH_LONG).show());
        }).start();
    }

}
