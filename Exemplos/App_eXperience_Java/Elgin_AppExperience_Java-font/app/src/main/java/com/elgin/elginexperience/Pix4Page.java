package com.elgin.elginexperience;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.Button;
import android.widget.LinearLayout;

import static com.elgin.elginexperience.Services.Pix4.Produto.*;
import static com.elgin.elginexperience.Services.Pix4.Framework.*;

import com.elgin.elginexperience.Services.Pix4.Pix4ImagesStorageService;
import com.elgin.elginexperience.Services.Pix4.Pix4Service;

public class Pix4Page extends AppCompatActivity {

    // Objeto com implementação do uso do PIX 4.
    private Pix4Service pix4Obj;

    // Objeto que contém a lógica de salvamento das imagens que serão carregadas dentro do dispositivo e, posteriormente, carregado no PIX4.
    private Pix4ImagesStorageService pix4ImagesStorageService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pix4_page);

        pix4ImagesStorageService = new Pix4ImagesStorageService(this);
        pix4ImagesStorageService.executeStoreImages();

        pix4Obj = new Pix4Service(this);
        pix4Obj.abreConexaoDisplay();

        initQrCodeViews();

        initProductViews();

        initActionButtons();
    }

    private void initQrCodeViews() {
        final LinearLayout buttonJava, buttonDelphi, buttonFlutter, buttonXamarinAndrod, buttonXamarinForms, buttonReactNative, buttonKotlin, buttonIonic;

        buttonJava = findViewById(R.id.buttonJava);
        buttonDelphi = findViewById(R.id.buttonDelphi);
        buttonFlutter = findViewById(R.id.buttonFlutter);
        buttonXamarinAndrod = findViewById(R.id.buttonXamarinAndroid);
        buttonXamarinForms = findViewById(R.id.buttonXamarinForms);
        buttonReactNative = findViewById(R.id.buttonReactNative);
        buttonKotlin = findViewById(R.id.buttonKotlin);
        buttonIonic = findViewById(R.id.buttonIonic);

        buttonJava.setOnClickListener(v -> pix4Obj.apresentaQrCodeLinkGihtub(JAVA));
        buttonDelphi.setOnClickListener(v -> pix4Obj.apresentaQrCodeLinkGihtub(DELPHI));
        buttonFlutter.setOnClickListener(v -> pix4Obj.apresentaQrCodeLinkGihtub(FLUTTER));
        buttonXamarinAndrod.setOnClickListener(v -> pix4Obj.apresentaQrCodeLinkGihtub(XAMARIN_ANDROID));
        buttonXamarinForms.setOnClickListener(v -> pix4Obj.apresentaQrCodeLinkGihtub(XAMARIN_FORMS));
        buttonReactNative.setOnClickListener(v -> pix4Obj.apresentaQrCodeLinkGihtub(REACT_NATIVE));
        buttonKotlin.setOnClickListener(v -> pix4Obj.apresentaQrCodeLinkGihtub(KOTLIN));
        buttonIonic.setOnClickListener(v -> pix4Obj.apresentaQrCodeLinkGihtub(IONIC));
    }

    private void initProductViews() {
        final LinearLayout buttonAbacaxi, buttonBanana, buttonChocolote, buttonDetergente, buttonErvilha, buttonFeijao, buttonGoiabada, buttonHamburguer, buttonIogurte, buttonJaca;

        buttonAbacaxi = findViewById(R.id.buttonAbacaxi);
        buttonBanana = findViewById(R.id.buttonBanana);
        buttonChocolote = findViewById(R.id.buttonChocolate);
        buttonDetergente = findViewById(R.id.buttonDetergente);
        buttonErvilha = findViewById(R.id.buttonErvilha);
        buttonFeijao = findViewById(R.id.buttonFeijao);
        buttonGoiabada = findViewById(R.id.buttonGoiabada);
        buttonHamburguer = findViewById(R.id.buttonHamburguer);
        buttonIogurte = findViewById(R.id.buttonIogurte);
        buttonJaca = findViewById(R.id.buttonJaca);

        buttonAbacaxi.setOnClickListener(v -> pix4Obj.adicionaProdutoApresenta(ABACAXI));
        buttonBanana.setOnClickListener(v -> pix4Obj.adicionaProdutoApresenta(BANANA));
        buttonChocolote.setOnClickListener(v -> pix4Obj.adicionaProdutoApresenta(CHOCOLATE));
        buttonDetergente.setOnClickListener(v -> pix4Obj.adicionaProdutoApresenta(DETERGENTE));
        buttonErvilha.setOnClickListener(v -> pix4Obj.adicionaProdutoApresenta(ERVILHA));
        buttonFeijao.setOnClickListener(v -> pix4Obj.adicionaProdutoApresenta(FEIJAO));
        buttonGoiabada.setOnClickListener(v -> pix4Obj.adicionaProdutoApresenta(GOIABADA));
        buttonHamburguer.setOnClickListener(v -> pix4Obj.adicionaProdutoApresenta(HAMBURGUER));
        buttonIogurte.setOnClickListener(v -> pix4Obj.adicionaProdutoApresenta(IOGURTE));
        buttonJaca.setOnClickListener(v -> pix4Obj.adicionaProdutoApresenta(JACA));
    }

    private void initActionButtons() {
        Button buttonShowShoppingList = findViewById(R.id.buttonShowShoppingList);
        buttonShowShoppingList.setOnClickListener(v -> pix4Obj.apresentaListaCompras());

        Button buttonLoadImages = findViewById(R.id.buttonLoadImagesOnPIX4);
        buttonLoadImages.setOnClickListener(v -> pix4Obj.carregarImagens());
    }
}