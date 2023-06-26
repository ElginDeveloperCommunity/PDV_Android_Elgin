package com.example.e1_kotlin_r.Services.Pix4

import android.app.Activity
import android.os.Handler
import android.os.Looper
import android.widget.Toast
import com.elgin.e1.display.E1_Display
import com.example.e1_kotlin_r.Pix4Page
import java.math.BigDecimal

class Pix4Service(val mActivity: Activity) {

    private val carrinho: MutableList<Produto> = ArrayList()

    init {
        E1_Display.init(mActivity, E1_Display.DisplayDevices.AUTO)
    }

    fun inicializaDisplay(): Int {
        return E1_Display.InicializaDisplay()
    }

    fun reinicializaDisplay(): Int {
        return E1_Display.ReinicializaDisplay()
    }

    fun desconectarDisplay(): Int {
        return E1_Display.DesconectarDisplay()
    }

    fun obtemVersãoFirmware(): Int {
        return E1_Display.ObtemVersaoFirmware()
    }

    // Apresenta uma imagem no display, para o app-experience as imagens estão todas na mesma dimensão e serão colocadas na mesma posição.
    fun apresentaImagemProdutoDisplay(produto: Produto): Int {
        return E1_Display.ApresentaImagemDisplay(produto.fileName, 0, 0, 0)
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
        E1_Display.ApresentaQrCode(framework.githubLink, 200, 80, 50)
        E1_Display.ApresentaTextoColorido(separador, 5, 20, 340, 0, "#005344")
        E1_Display.ApresentaTextoColorido(msgPart1, 6, 20, 360, 0, "#005344")
        E1_Display.ApresentaTextoColorido(msgPart2, 7, 20, 390, 0, "#005344")
        E1_Display.ApresentaTextoColorido(msgPart3, 8, 20, 420, 0, "#005344")
        E1_Display.ApresentaTextoColorido(msgPart4, 9, 22, 450, 0, "#005344")
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
        E1_Display.ApresentaTextoColorido(separador, 17, 22, 400, 0, "#005344")
        E1_Display.ApresentaTextoColorido(nomePreco, 18, 20, 420, 0, "#005344")
        E1_Display.ApresentaTextoColorido(qtdTotal, 19, 20, 450, 0, "#005344")
    }

    // Apresenta a lista de produtos.
    fun apresentaListaCompras() {
        // Refresh no display.
        inicializaDisplay()
        for (produto in carrinho) {
            E1_Display.ApresentaListaCompras(produto.name, produto.preco)
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
                val result = E1_Display.CarregaImagemDisplay(
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