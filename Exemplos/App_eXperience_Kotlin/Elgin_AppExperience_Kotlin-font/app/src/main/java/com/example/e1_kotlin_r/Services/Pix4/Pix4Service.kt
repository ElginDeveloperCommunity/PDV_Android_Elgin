package com.example.e1_kotlin_r.Services.Pix4

import android.app.Activity
import android.os.Handler
import android.os.Looper
import android.widget.Toast
import com.elgin.e1.DisplayPIX4.PIX4
import com.example.e1_kotlin_r.Pix4Page
import java.math.BigDecimal

class Pix4Service(val mActivity: Activity) {

    private val carrinho: MutableList<Produto> = ArrayList()

    init {
        PIX4.setActivity(mActivity)
    }

    fun abreConexaoDisplay() {
        val result = PIX4.AbreConexaoDisplay()
        val message: String
        message = when (result) {
            0 -> "Conexão com o dispositivo PIX4 bem sucedida!"
            -12 -> "Dispositivo não existe!"
            13 -> "Permissão negada!"
            -14 -> "Erro desconhecido!"
            -19 -> "Dispositivo removido inesperadamente!"
            -1 -> "Conexão mal sucedida"
            else -> throw AssertionError(result) // Outro valor não é esperado.
        }
        Toast.makeText(mActivity, message, Toast.LENGTH_LONG).show()
    }

    fun inicializaDisplay(): Int {
        return PIX4.InicializaDisplay()
    }

    fun reinicializaDisplay(): Int {
        return PIX4.ReinicializaDisplay()
    }

    fun desconectarDisplay(): Int {
        return PIX4.DesconectarDisplay()
    }

    fun obtemVersãoFirmware(): Int {
        return PIX4.ObtemVersaoFirmware()
    }

    // Apresenta uma imagem no display, para o app-experience as imagens estão todas na mesma dimensão e serão colocadas na mesma posição.
    fun apresentaImagemProdutoDisplay(produto: Produto): Int {
        return PIX4.ApresentaImagemDisplay(produto.fileName, 0, 0, 0)
    }

    // Apresenta um QRCode na tela do dispostivo, para o app-experience todos os códigos terão o mesmo tamanho e estarão nas mesma posição.
    fun apresentaQrCodeLinkGihtub(framework: Framework) {
        // Refresh no display.
        inicializaDisplay()
        val message =
            "Visite o exemplo do framework de desenvolvimento  mobile: " + framework.name + " através do QR code acima!"
        val separador = "────────────────────────────────"
        val msgPart1 = String.format("%-26s", message.substring(0, 26))
        val msgPart2 = String.format("%-26s", message.substring(26, 52))
        val msgPart3 = String.format("%-26s", message.substring(52, 77))
        val msgPart4 = String.format("%-26s", message.substring(77))
        PIX4.ApresentaQrCode(framework.githubLink, 200, 80, 50)
        PIX4.ApresentaTextoColorido(separador, 5, 20, 340, 0, "#005344")
        PIX4.ApresentaTextoColorido(msgPart1, 6, 20, 360, 0, "#005344")
        PIX4.ApresentaTextoColorido(msgPart2, 7, 20, 390, 0, "#005344")
        PIX4.ApresentaTextoColorido(msgPart3, 8, 20, 420, 0, "#005344")
        PIX4.ApresentaTextoColorido(msgPart4, 9, 22, 450, 0, "#005344")
    }

    // Apresenta, utilizando a função "ApresentaTextoColorido", rótulo com as informações do produto e quantidades adicionadas.
    fun adicionaProdutoApresenta(produto: Produto) {
        carrinho.add(produto)

        // Número de produtos do mesmo tipo do produto recém adicionado.
        val produtosDesteProduto =
            carrinho.stream().filter { product: Produto -> product === produto }.count().toInt()

        // Formatação de cada linha do rótulo inferior que será mostrado.
        val separador = "────────────────────────────────"
        val nomePreco =
            java.lang.String.format("%-16s %9s", "Item: " + produto.name, "R$: " + produto.preco)
        val qtdTotal = String.format(
            "%-9s %16s",
            "Qtd: $produtosDesteProduto",
            "Total R$: " + BigDecimal(produto.preco).multiply(BigDecimal(produtosDesteProduto.toString()))
        )

        // Refresh no display.
        inicializaDisplay()
        apresentaImagemProdutoDisplay(produto)
        PIX4.ApresentaTextoColorido(separador, 17, 22, 400, 0, "#005344")
        PIX4.ApresentaTextoColorido(nomePreco, 18, 20, 420, 0, "#005344")
        PIX4.ApresentaTextoColorido(qtdTotal, 19, 20, 450, 0, "#005344")
    }

    // Apresenta a lista de produtos.
    fun apresentaListaCompras() {
        // Refresh no display.
        inicializaDisplay()
        for (produto in carrinho) {
            PIX4.ApresentaListaCompras(produto.name, produto.preco)
        }
    }

    // Carrega as imagens no dipositivo, para apresentação posterior. É realizado em outra thread pois este processo pode demorar um pouco.
    fun carregarImagens() {
        // Usado apenas para mostrar o Toast quando a configuração terminar.
        val mHandler: Handler = object : Handler(Looper.getMainLooper()) {}
        Thread {
            val imagesPath = "/sdcard/Download/"
            mHandler.post {
                Toast.makeText(
                    mActivity,
                    " O carregamento das imagens começou, aguarde até a mensagem de término do carregamento!",
                    Toast.LENGTH_LONG
                ).show()
            }
            for (produto in Produto.values()) {
                val result = PIX4.CarregaImagemDisplay(
                    produto.fileName, imagesPath + produto.fileName, 320, 480
                )
                mHandler.post {
                    Toast.makeText(
                        mActivity,
                        if (result == 0) "A imagem do produto: " + produto.name.toString() + " carregou com sucesso!" else """Ocorreu um erro no carregamento da imagem do produto: ${produto.name.toString()}!
 Tente novamente!""",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            mHandler.post {
                Toast.makeText(
                    mActivity,
                    "O carregamento das imagens dos produtos terminou !",
                    Toast.LENGTH_LONG
                ).show()
            }
        }.start()
    }

}