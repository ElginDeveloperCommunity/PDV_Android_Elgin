package com.elgin.elginexperience;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import android.app.Fragment;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toast;

import java.io.IOException;

import static android.app.Activity.RESULT_OK;

import com.elgin.elginexperience.Services.Pix4.displayService;

public class FragmentVisor extends Fragment {
    //DECLARE IMAGE VIEW
    ImageView imageView;

    //DECLARE BUTTONS
    Button buttonSelectImage;
    Button buttonTestText;
    Button buttonTestQRCode;
    Button buttonTestImage;

    //DECLARE EDIT TEXTS
    EditText editTextTexto;
    EditText editTextTamanhoFonte;
    EditText editTextPosicaoVertical;
    EditText editTextPosicaoHorizontal;
    EditText editTextQRCode;
    EditText editTextTamanhoQR;
    EditText editTextPosicaoYQR;
    EditText editTextPosicaoXQR;

    //DECLARE SPINNERS
    Spinner spinnerAlinhamento;
    Spinner spinnerCor;

    private displayService display;

    //PATH OF IMAGE
    Bitmap bitmap;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_fragment_visor, container, false);

        display = new displayService(getActivity(),"Tpro");
        display.inicializaDisplay();

        //INIT IMAGE VIEW
        imageView = view.findViewById(R.id.previewImgDefault);
        
        // Inicializar a imagem padrão
        bitmap = ((android.graphics.drawable.BitmapDrawable) imageView.getDrawable()).getBitmap();

        //INIT BUTTONS
        buttonSelectImage = view.findViewById(R.id.buttonSelectImage);
        buttonTestText = view.findViewById(R.id.buttonTestText);
        buttonTestQRCode = view.findViewById(R.id.buttonTestQRCode);
        buttonTestImage = view.findViewById(R.id.buttonTestImage);

        //INIT EDIT TEXTS
        editTextTexto = view.findViewById(R.id.editTextTexto);
        editTextTamanhoFonte = view.findViewById(R.id.editTextTamanhoFonte);
        editTextPosicaoVertical = view.findViewById(R.id.editTextPosicaoVertical);
        editTextPosicaoHorizontal = view.findViewById(R.id.editTextPosicaoHorizontal);
        editTextQRCode = view.findViewById(R.id.editTextQRCode);
        editTextTamanhoQR = view.findViewById(R.id.editTextTamanhoQR);
        editTextPosicaoYQR = view.findViewById(R.id.editTextPosicaoYQR);
        editTextPosicaoXQR = view.findViewById(R.id.editTextPosicaoXQR);

        //INIT SPINNERS
        spinnerAlinhamento = view.findViewById(R.id.spinnerAlinhamento);
        spinnerCor = view.findViewById(R.id.spinnerCor);

        //SETUP ALINHAMENTO SPINNER
        String[] alinhamentos = {"Esquerda", "Centro", "Direita"};
        ArrayAdapter<String> adapterAlinhamento = new ArrayAdapter<>(getActivity(), android.R.layout.simple_spinner_item, alinhamentos);
        adapterAlinhamento.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerAlinhamento.setAdapter(adapterAlinhamento);
        spinnerAlinhamento.setSelection(1); // Centro por padrão

        //SETUP COR SPINNER
        String[] cores = {"#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#000000"};
        String[] coresNomes = {"Vermelho", "Verde", "Azul", "Amarelo", "Preto"};
        ArrayAdapter<String> adapterCor = new ArrayAdapter<>(getActivity(), android.R.layout.simple_spinner_item, coresNomes);
        adapterCor.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerCor.setAdapter(adapterCor);
        spinnerCor.setSelection(0); // Vermelho por padrão

        //SET DEFAULT VALUES
        editTextTexto.setText("Teste de Texto");
        editTextTamanhoFonte.setText("50");
        editTextPosicaoVertical.setText("100");
        editTextPosicaoHorizontal.setText("0");
        editTextQRCode.setText("https://www.elgin.com.br");
        editTextTamanhoQR.setText("200");
        editTextPosicaoYQR.setText("80");
        editTextPosicaoXQR.setText("50");

        buttonSelectImage.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.M)
            @Override
            public void onClick(View v) {
                startGallery();
            }
        });

        buttonTestText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    String texto = editTextTexto.getText().toString();
                    int alinhamento = spinnerAlinhamento.getSelectedItemPosition();
                    int tamanhoFonte = Integer.parseInt(editTextTamanhoFonte.getText().toString());
                    int posicaoVertical = Integer.parseInt(editTextPosicaoVertical.getText().toString());
                    int posicaoHorizontal = Integer.parseInt(editTextPosicaoHorizontal.getText().toString());
                    
                    // Usar o índice do spinner para pegar o código hexadecimal correto
                    String cor = cores[spinnerCor.getSelectedItemPosition()];

                    display.inicializaDisplay();
                    display.ApresentaTextoColorido(texto, alinhamento, tamanhoFonte, posicaoVertical, posicaoHorizontal, cor);
                } catch (NumberFormatException e) {
                    Toast.makeText(getActivity(), "Preencha todos os campos numéricos corretamente", Toast.LENGTH_SHORT).show();
                }
            }
        });

        buttonTestQRCode.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    String conteudo = editTextQRCode.getText().toString();
                    int tamanho = Integer.parseInt(editTextTamanhoQR.getText().toString());
                    int posicaoY = Integer.parseInt(editTextPosicaoYQR.getText().toString());
                    int posicaoX = Integer.parseInt(editTextPosicaoXQR.getText().toString());

                    display.ApresentaQrCode(conteudo, tamanho, posicaoY, posicaoX);
                } catch (NumberFormatException e) {
                    Toast.makeText(getActivity(), "Preencha todos os campos numéricos corretamente", Toast.LENGTH_SHORT).show();
                }
            }
        });

        buttonTestImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                display.ApresentaImagemDisplay(bitmap);
            }
        });

        return view;
    }

    private void startGallery() {
        Intent cameraIntent = new Intent(Intent.ACTION_PICK);
        cameraIntent.setType("image/*");
        startActivityForResult(cameraIntent, 1000);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(resultCode == RESULT_OK) {
            if(requestCode == 1000){
                Uri returnUri = data.getData();
                Bitmap bitmapImage = null;
                try {
                    bitmapImage = MediaStore.Images.Media.getBitmap(getActivity().getContentResolver(), returnUri);
                    setBitmap(bitmapImage);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                imageView.setImageBitmap(bitmapImage);
            }
        } else {
            Toast.makeText(MainActivity.context, "Você não selecionou uma imagem", Toast.LENGTH_LONG).show();
        }
    }

    public void setBitmap(Bitmap bitmapFileSelected){
        bitmap = bitmapFileSelected;
    }
} 