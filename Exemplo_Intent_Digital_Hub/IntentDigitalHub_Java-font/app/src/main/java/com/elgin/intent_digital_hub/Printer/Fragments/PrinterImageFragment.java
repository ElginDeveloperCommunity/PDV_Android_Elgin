package com.elgin.intent_digital_hub.Printer.Fragments;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;

import androidx.fragment.app.Fragment;

import com.elgin.intent_digital_hub.ActivityUtils;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommand;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommandStarter;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.AvancaPapel;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.Corte;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.ImprimeImagem;
import com.elgin.intent_digital_hub.Printer.PrinterActivity;
import com.elgin.intent_digital_hub.R;

import java.util.ArrayList;
import java.util.List;

public class PrinterImageFragment extends Fragment {
    public static ImageView imageView;
    private String pathOfLastSelectedImage;
    private Button buttonSelectImage;
    private Button buttonPrintImage;
    private CheckBox checkBoxCutPaperImage;
    private Activity PrinterActivityReference;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_printer_image, container, false);

        //Captura a referência da atividade onde o fragment é utilizado
        PrinterActivityReference = getActivity();

        //Atribui o path da ultima imagem selecionada, sempre em Android/data/com.elgin.intent_digital_hub/files/ImageToPrint.jpg
        pathOfLastSelectedImage = "/Android/data/" + PrinterActivityReference.getApplicationContext().getPackageName() + "/Files" + "/ImageToPrint.jpg";

        imageView = v.findViewById(R.id.previewImgDefault);

        buttonSelectImage = v.findViewById(R.id.buttonSelectImage);
        buttonPrintImage = v.findViewById(R.id.buttonPrintImage);

        checkBoxCutPaperImage = v.findViewById(R.id.checkBoxCutPaperPrintImage);

        buttonSelectImage.setOnClickListener(this::buttonSelectImageFunction);

        buttonPrintImage.setOnClickListener(this::buttonPrintImageFunction);

        return v;
    }

    private void buttonSelectImageFunction(View v) {
        Intent cameraIntent = new Intent(Intent.ACTION_PICK);

        cameraIntent.setType("image/*");

        PrinterActivityReference.startActivityForResult(cameraIntent, PrinterActivity.OPEN_GALLERY_FOR_IMAGE_SELECTION_REQUESTCODE);
    }

    private void buttonPrintImageFunction(View v) {
        List<IntentDigitalHubCommand> termicaCommands = new ArrayList<>();

        final String path = pathOfLastSelectedImage;

        ImprimeImagem imprimeImagemCommand = new ImprimeImagem(path);

        termicaCommands.add(imprimeImagemCommand);

        AvancaPapel avancaPapelCommand = new AvancaPapel(10);

        termicaCommands.add(avancaPapelCommand);

        if (checkBoxCutPaperImage.isChecked()) {
            Corte corteCommand = new Corte(0);

            termicaCommands.add(corteCommand);
        }

        IntentDigitalHubCommandStarter.startHubCommandActivity(PrinterActivityReference, termicaCommands, PrinterActivity.IMPRIME_IMAGEM_REQUESTCODE);
    }
}