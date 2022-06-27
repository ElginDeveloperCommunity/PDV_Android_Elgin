package com.elgin.intent_digital_hub.Printer.Fragments;

import static android.widget.AdapterView.OnItemSelectedListener;

import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;

import androidx.fragment.app.Fragment;

import com.elgin.intent_digital_hub.ActivityUtils;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommand;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommandStarter;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.AvancaPapel;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.Corte;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.ImpressaoTexto;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.ImprimeXMLNFCe;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.ImprimeXMLSAT;
import com.elgin.intent_digital_hub.Printer.PrinterActivity;
import com.elgin.intent_digital_hub.R;

import java.util.ArrayList;
import java.util.List;

public class PrinterTextFragment extends Fragment {
    private final String XML_EXTENSION = ".xml";
    private final String XML_NFCE_ARCHIVE_NAME = "xmlnfce";
    private final String XML_SAT_ARCHIVE_NAME = "xmlsat";
    private Activity PrinterActivityReference;
    private Button buttonPrinter;
    private Button buttonPrinterXMLNFCe;
    private Button buttonPrinterXMLSAT;
    private RadioGroup radioGroupAlign;
    private RadioButton buttonRadioCenter;
    private EditText editTextInputMessage;
    private Spinner spinnerFontFamily;
    private Spinner spinnerselectedFontSize;
    private CheckBox checkBoxIsBold;
    private CheckBox checkBoxIsUnderLine;
    private CheckBox checkBoxIsCutPaper;
    private Alignment selectedAlignment = Alignment.CENTRO;
    private FontFamily selectedFontFamily = FontFamily.FONT_A;
    private int selectedFontSize = 17;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_printer_text, container, false);

        PrinterActivityReference = getActivity();

        editTextInputMessage = v.findViewById(R.id.editTextInputMessage);
        editTextInputMessage.setText("ELGIN DEVELOPERS COMMUNITY");

        radioGroupAlign = v.findViewById(R.id.radioGroupAlign);
        buttonRadioCenter = v.findViewById(R.id.radioButtonCenter);
        spinnerFontFamily = v.findViewById(R.id.spinnerFontFamily);
        spinnerselectedFontSize = v.findViewById(R.id.spinnerFontSize);
        checkBoxIsBold = v.findViewById(R.id.checkBoxBold);
        checkBoxIsUnderLine = v.findViewById(R.id.checkBoxUnderline);
        checkBoxIsCutPaper = v.findViewById(R.id.checkBoxCutPaper);
        buttonPrinter = v.findViewById(R.id.buttonPrinterText);
        buttonPrinterXMLNFCe = v.findViewById(R.id.buttonPrinterNFCe);
        buttonPrinterXMLSAT = v.findViewById(R.id.buttonPrinterSAT);

        //Funcionalidade Radio Alinhamento
        buttonRadioCenter.setChecked(true);
        radioGroupAlign = v.findViewById(R.id.radioGroupAlign);
        radioGroupAlign.setOnCheckedChangeListener((group, checkedId) -> {
            switch (checkedId) {
                case R.id.radioButtonLeft:
                    selectedAlignment = Alignment.ESQUERDA;
                    break;
                case R.id.radioButtonCenter:
                    selectedAlignment = Alignment.CENTRO;
                    break;
                case R.id.radioButtonRight:
                    selectedAlignment = Alignment.DIREITA;
                    break;
            }
        });

        //Funcionalidade do Spinner de seleção de fonte
        spinnerFontFamily.setOnItemSelectedListener(new OnItemSelectedListener() {
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }

            @Override
            public void onItemSelected(AdapterView adapter, View v, int i, long lng) {
                selectedFontFamily = (i == 0) ? FontFamily.FONT_A : FontFamily.FONT_B;
            }
        });

        spinnerselectedFontSize.setOnItemSelectedListener(new OnItemSelectedListener() {
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }

            @Override
            public void onItemSelected(AdapterView adapter, View v, int i, long lng) {
                selectedFontSize = Integer.parseInt(adapter.getItemAtPosition(i).toString());
            }
        });

        buttonPrinter.setOnClickListener(this::buttonPrinterFunction);

        buttonPrinterXMLNFCe.setOnClickListener(this::buttonPrinterXMLNFCeFunction);

        buttonPrinterXMLSAT.setOnClickListener(this::buttonPrinterXMlSATFunction);

        return v;
    }


    private void buttonPrinterFunction(View v) {
        if (editTextInputMessage.getText().toString().isEmpty())
            ActivityUtils.showAlertMessage(PrinterActivityReference, "Alerta", "Campo mensagem vazio!");
        else {
            final int posicao = selectedAlignment.getAlignmentValue();

            final int stilo = getStiloValue();

            ImpressaoTexto impressaoTextoCommand = new ImpressaoTexto(editTextInputMessage.getText().toString(),
                    posicao,
                    stilo,
                    selectedFontSize);

            AvancaPapel avancaPapelCommand = new AvancaPapel(10);

            List<IntentDigitalHubCommand> termicaCommands = new ArrayList<>();

            termicaCommands.add(impressaoTextoCommand);
            termicaCommands.add(avancaPapelCommand);

            if (checkBoxIsCutPaper.isChecked()) {
                Corte corteCommand = new Corte(0);

                termicaCommands.add(corteCommand);
            }

            IntentDigitalHubCommandStarter.startHubCommandActivity(PrinterActivityReference, termicaCommands, PrinterActivity.IMPRESSAO_TEXTO_REQUESTCODE);
        }
    }

    /**
     * Calcula o valor do estilo de acordo com a parametrização definida
     */
    
    private int getStiloValue() {
        int stilo = 0;

        if (selectedFontFamily == FontFamily.FONT_B)
            stilo += 1;
        if (checkBoxIsUnderLine.isChecked())
            stilo += 2;
        if (checkBoxIsBold.isChecked())
            stilo += 8;

        return stilo;
    }

    private void buttonPrinterXMLNFCeFunction(View v) {
        //O impressão dos XMLs será feita por PATH, por isso é necessário salvar o XMl do projeto dentro do diretório da aplicação, para depois referenciá-lo
        ActivityUtils.loadXMLFileAndStoreItOnApplicationRootDir(PrinterActivityReference, XML_NFCE_ARCHIVE_NAME);

        final String dados = ActivityUtils.getFilePathForIDH(PrinterActivityReference, XML_NFCE_ARCHIVE_NAME + XML_EXTENSION);

        final int indexcsc = 1;

        final String csc = "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES";

        final int param = 0;

        ImprimeXMLNFCe imprimeXMLNFCeCommand = new ImprimeXMLNFCe(dados, indexcsc, csc, param);

        AvancaPapel avancaPapelCommand = new AvancaPapel(10);

        List<IntentDigitalHubCommand> termicaCommands = new ArrayList<>();

        termicaCommands.add(imprimeXMLNFCeCommand);
        termicaCommands.add(avancaPapelCommand);

        if (checkBoxIsCutPaper.isChecked()) {
            Corte corteCommand = new Corte(0);

            termicaCommands.add(corteCommand);
        }

        IntentDigitalHubCommandStarter.startHubCommandActivity(PrinterActivityReference, termicaCommands, PrinterActivity.IMPRIME_XML_NFCE_REQUESTCODE);
    }

    private void buttonPrinterXMlSATFunction(View v) {
        //O impressão dos XMLs será feita por PATH, por isso é necessário salvar o XMl do projeto dentro do diretório da aplicação, para depois referenciar seu caminho
        ActivityUtils.loadXMLFileAndStoreItOnApplicationRootDir(PrinterActivityReference, XML_SAT_ARCHIVE_NAME);

        final String dados = ActivityUtils.getFilePathForIDH(PrinterActivityReference, XML_SAT_ARCHIVE_NAME + XML_EXTENSION);

        final int param = 0;

        ImprimeXMLSAT imprimeXMLSATCommand = new ImprimeXMLSAT(dados, param);

        AvancaPapel avancaPapelCommand = new AvancaPapel(10);

        List<IntentDigitalHubCommand> termicaCommands = new ArrayList<>();

        termicaCommands.add(imprimeXMLSATCommand);
        termicaCommands.add(avancaPapelCommand);

        if (checkBoxIsCutPaper.isChecked()) {
            Corte corteCommand = new Corte(0);

            termicaCommands.add(corteCommand);
        }

        IntentDigitalHubCommandStarter.startHubCommandActivity(PrinterActivityReference, termicaCommands, PrinterActivity.IMPRESSAO_TEXTO_REQUESTCODE);
    }

    /**
     * Tipos alinhamento e seus respectivos valores para o comando
     */

    private enum Alignment {
        ESQUERDA(0), CENTRO(1), DIREITA(2);

        private final int alignmentValue;

        Alignment(int alignmentValue) {
            this.alignmentValue = alignmentValue;
        }

        public int getAlignmentValue() {
            return alignmentValue;
        }
    }

    /**
     * Fontes disponíveis para impressão
     */

    private enum FontFamily {
        FONT_A, FONT_B
    }
}