package com.example.e1_kotlin_r

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import com.example.e1_kotlin_r.Services.Pix4.Framework
import com.example.e1_kotlin_r.Services.Pix4.Pix4ImagesStorageService
import com.example.e1_kotlin_r.Services.Pix4.Pix4Service
import com.example.e1_kotlin_r.Services.Pix4.Produto

class Pix4Page : AppCompatActivity() {

    // Objeto com implementação do uso do PIX 4.
    private var pix4Obj: Pix4Service? = null

    // Objeto que contém a lógica de salvamento das imagens que serão carregadas dentro do dispositivo e, posteriormente, carregado no PIX4.
    private var pix4ImagesStorageService: Pix4ImagesStorageService? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pix4_page)

        pix4ImagesStorageService = Pix4ImagesStorageService(this)
        pix4ImagesStorageService!!.executeStoreImages()

        pix4Obj = Pix4Service(this)
        pix4Obj!!.abreConexaoDisplay()

        initQrCodeViews()

        initProductViews()

        initActionButtons()
    }

    private fun initQrCodeViews() {
        val buttonJava: LinearLayout
        val buttonDelphi: LinearLayout
        val buttonFlutter: LinearLayout
        val buttonXamarinAndrod: LinearLayout
        val buttonXamarinForms: LinearLayout
        val buttonReactNative: LinearLayout
        val buttonKotlin: LinearLayout
        val buttonIonic: LinearLayout
        buttonJava = findViewById(R.id.buttonJava)
        buttonDelphi = findViewById(R.id.buttonDelphi)
        buttonFlutter = findViewById(R.id.buttonFlutter)
        buttonXamarinAndrod = findViewById(R.id.buttonXamarinAndroid)
        buttonXamarinForms = findViewById(R.id.buttonXamarinForms)
        buttonReactNative = findViewById(R.id.buttonReactNative)
        buttonKotlin = findViewById(R.id.buttonKotlin)
        buttonIonic = findViewById(R.id.buttonIonic)
        buttonJava.setOnClickListener { v: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.JAVA
            )
        }
        buttonDelphi.setOnClickListener { v: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.DELPHI
            )
        }
        buttonFlutter.setOnClickListener { v: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.FLUTTER
            )
        }
        buttonXamarinAndrod.setOnClickListener { v: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.XAMARIN_ANDROID
            )
        }
        buttonXamarinForms.setOnClickListener { v: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.XAMARIN_FORMS
            )
        }
        buttonReactNative.setOnClickListener { v: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.REACT_NATIVE
            )
        }
        buttonKotlin.setOnClickListener { v: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.KOTLIN
            )
        }
        buttonIonic.setOnClickListener { v: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.IONIC
            )
        }
    }

    private fun initProductViews() {
        val buttonAbacaxi: LinearLayout
        val buttonBanana: LinearLayout
        val buttonChocolote: LinearLayout
        val buttonDetergente: LinearLayout
        val buttonErvilha: LinearLayout
        val buttonFeijao: LinearLayout
        val buttonGoiabada: LinearLayout
        val buttonHamburguer: LinearLayout
        val buttonIogurte: LinearLayout
        val buttonJaca: LinearLayout
        buttonAbacaxi = findViewById(R.id.buttonAbacaxi)
        buttonBanana = findViewById(R.id.buttonBanana)
        buttonChocolote = findViewById(R.id.buttonChocolate)
        buttonDetergente = findViewById(R.id.buttonDetergente)
        buttonErvilha = findViewById(R.id.buttonErvilha)
        buttonFeijao = findViewById(R.id.buttonFeijao)
        buttonGoiabada = findViewById(R.id.buttonGoiabada)
        buttonHamburguer = findViewById(R.id.buttonHamburguer)
        buttonIogurte = findViewById(R.id.buttonIogurte)
        buttonJaca = findViewById(R.id.buttonJaca)
        buttonAbacaxi.setOnClickListener { v: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.ABACAXI
            )
        }
        buttonBanana.setOnClickListener { v: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.BANANA
            )
        }
        buttonChocolote.setOnClickListener { v: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.CHOCOLATE
            )
        }
        buttonDetergente.setOnClickListener { v: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.DETERGENTE
            )
        }
        buttonErvilha.setOnClickListener { v: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.ERVILHA
            )
        }
        buttonFeijao.setOnClickListener { v: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.FEIJAO
            )
        }
        buttonGoiabada.setOnClickListener { v: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.GOIABADA
            )
        }
        buttonHamburguer.setOnClickListener { v: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.HAMBURGUER
            )
        }
        buttonIogurte.setOnClickListener { v: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.IOGURTE
            )
        }
        buttonJaca.setOnClickListener { v: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.JACA
            )
        }
    }

    private fun initActionButtons() {
        val buttonShowShoppingList = findViewById<Button>(R.id.buttonShowShoppingList)
        buttonShowShoppingList.setOnClickListener { v: View? -> pix4Obj!!.apresentaListaCompras() }
        val buttonLoadImages = findViewById<Button>(R.id.buttonLoadImagesOnPIX4)
        buttonLoadImages.setOnClickListener { v: View? -> pix4Obj!!.carregarImagens() }
    }
}