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

        initQrCodeViews()

        initProductViews()

        initActionButtons()
    }

    private fun initQrCodeViews() {
        val buttonJava: LinearLayout = findViewById(R.id.buttonJava)
        val buttonDelphi: LinearLayout = findViewById(R.id.buttonDelphi)
        val buttonFlutter: LinearLayout = findViewById(R.id.buttonFlutter)
        val buttonXamarinAndroid: LinearLayout = findViewById(R.id.buttonXamarinAndroid)
        val buttonXamarinForms: LinearLayout = findViewById(R.id.buttonXamarinForms)
        val buttonReactNative: LinearLayout = findViewById(R.id.buttonReactNative)
        val buttonKotlin: LinearLayout = findViewById(R.id.buttonKotlin)
        val buttonIonic: LinearLayout = findViewById(R.id.buttonIonic)
        buttonJava.setOnClickListener {
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.JAVA
            )
        }
        buttonDelphi.setOnClickListener { _: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.DELPHI
            )
        }
        buttonFlutter.setOnClickListener {
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.FLUTTER
            )
        }
        buttonXamarinAndroid.setOnClickListener { _: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.XAMARIN_ANDROID
            )
        }
        buttonXamarinForms.setOnClickListener { _: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.XAMARIN_FORMS
            )
        }
        buttonReactNative.setOnClickListener { _: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.REACT_NATIVE
            )
        }
        buttonKotlin.setOnClickListener { _: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.KOTLIN
            )
        }
        buttonIonic.setOnClickListener { _: View? ->
            pix4Obj!!.apresentaQrCodeLinkGihtub(
                Framework.IONIC
            )
        }
    }

    private fun initProductViews() {
        val buttonAbacaxi: LinearLayout = findViewById(R.id.buttonAbacaxi)
        val buttonBanana: LinearLayout = findViewById(R.id.buttonBanana)
        val buttonChocolote: LinearLayout = findViewById(R.id.buttonChocolate)
        val buttonDetergente: LinearLayout = findViewById(R.id.buttonDetergente)
        val buttonErvilha: LinearLayout = findViewById(R.id.buttonErvilha)
        val buttonFeijao: LinearLayout = findViewById(R.id.buttonFeijao)
        val buttonGoiabada: LinearLayout = findViewById(R.id.buttonGoiabada)
        val buttonHamburguer: LinearLayout = findViewById(R.id.buttonHamburguer)
        val buttonIogurte: LinearLayout = findViewById(R.id.buttonIogurte)
        val buttonJaca: LinearLayout = findViewById(R.id.buttonJaca)
        buttonAbacaxi.setOnClickListener { _: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.ABACAXI
            )
        }
        buttonBanana.setOnClickListener { _: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.BANANA
            )
        }
        buttonChocolote.setOnClickListener { _: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.CHOCOLATE
            )
        }
        buttonDetergente.setOnClickListener { _: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.DETERGENTE
            )
        }
        buttonErvilha.setOnClickListener { _: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.ERVILHA
            )
        }
        buttonFeijao.setOnClickListener { _: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.FEIJAO
            )
        }
        buttonGoiabada.setOnClickListener { _: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.GOIABADA
            )
        }
        buttonHamburguer.setOnClickListener { _: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.HAMBURGUER
            )
        }
        buttonIogurte.setOnClickListener { _: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.IOGURTE
            )
        }
        buttonJaca.setOnClickListener { _: View? ->
            pix4Obj!!.adicionaProdutoApresenta(
                Produto.JACA
            )
        }
    }

    private fun initActionButtons() {
        val buttonShowShoppingList = findViewById<Button>(R.id.buttonShowShoppingList)
        buttonShowShoppingList.setOnClickListener { _: View? -> pix4Obj!!.apresentaListaCompras() }
        val buttonLoadImages = findViewById<Button>(R.id.buttonLoadImagesOnPIX4)
        buttonLoadImages.setOnClickListener { _: View? -> pix4Obj!!.carregarImagens() }
    }
}