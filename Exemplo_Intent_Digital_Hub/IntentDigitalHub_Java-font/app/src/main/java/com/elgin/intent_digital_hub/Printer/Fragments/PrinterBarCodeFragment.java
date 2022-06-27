package com.elgin.intent_digital_hub.Printer.Fragments;

import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.fragment.app.Fragment;

import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommand;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommandStarter;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.AvancaPapel;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.Corte;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.DefinePosicao;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.ImpressaoCodigoBarras;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.ImpressaoQRCode;
import com.elgin.intent_digital_hub.Printer.PrinterActivity;
import com.elgin.intent_digital_hub.R;

import java.util.ArrayList;
import java.util.List;


public class PrinterBarCodeFragment extends Fragment {

    private Activity PrinterActivityReference;

    private EditText editTextInputBarCode;

    private Spinner spinnerBarCodeType;
    private Spinner spinnerBarCodeWidth;
    private Spinner spinnerBarCodeHeight;

    private RadioGroup radioGroupAlignBarCode;
    private RadioButton buttonRadioAlignCenter;

    private CheckBox checkBoxIsCutPaperBarCode;

    private TextView textViewWidth, textViewHeight;

    private Button buttonPrinterBarCode;

    private BarcodeType selectedBarcodeType = BarcodeType.EAN_8;
    private Alignment selectedAlignment = Alignment.CENTRO;

    private int widthOfBarCode = 1;
    private int heightOfBarCode = 20;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View v = inflater.inflate(R.layout.fragment_printer_bar_code, container, false);

        PrinterActivityReference = getActivity();

        editTextInputBarCode = v.findViewById(R.id.editTextInputBarCode);
        editTextInputBarCode.setText("40170725");

        textViewWidth = v.findViewById(R.id.textViewWidth);
        textViewHeight = v.findViewById(R.id.textViewHeight);

        spinnerBarCodeType = v.findViewById(R.id.spinnerBarCodeType);
        buttonRadioAlignCenter = v.findViewById(R.id.radioButtonBarCodeAlignCenter);
        spinnerBarCodeWidth = v.findViewById(R.id.spinnerBarCodeWidth);
        spinnerBarCodeHeight = v.findViewById(R.id.spinnerBarCodeHeight);
        checkBoxIsCutPaperBarCode = v.findViewById(R.id.checkBoxCutPaper);
        buttonPrinterBarCode = v.findViewById(R.id.buttonPrintBarCode);

        spinnerBarCodeType.setOnItemSelectedListener(new OnItemSelectedListener() {
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }

            @Override
            public void onItemSelected(AdapterView adapter, View v, int i, long lng) {
                setSelectedBarcodeType(i);
            }
        });

        //Funcionalidade Radio Alinhamento
        buttonRadioAlignCenter.setChecked(true);
        radioGroupAlignBarCode = v.findViewById(R.id.radioGroupAlignBarCode);
        radioGroupAlignBarCode.setOnCheckedChangeListener((group, checkedId) -> {
            switch (checkedId) {
                case R.id.radioButtonBarCodeAlignLeft:
                    selectedAlignment = Alignment.ESQUERDA;
                    break;
                case R.id.radioButtonBarCodeAlignCenter:
                    selectedAlignment = Alignment.CENTRO;
                    break;
                case R.id.radioButtonBarCodeAlignRight:
                    selectedAlignment = Alignment.DIREITA;
                    break;
            }
        });

        spinnerBarCodeWidth.setOnItemSelectedListener(new OnItemSelectedListener() {
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }

            @Override
            public void onItemSelected(AdapterView adapter, View v, int i, long lng) {
                widthOfBarCode = Integer.parseInt(adapter.getItemAtPosition(i).toString());
            }
        });

        spinnerBarCodeHeight.setOnItemSelectedListener(new OnItemSelectedListener() {
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }

            @Override
            public void onItemSelected(AdapterView adapter, View v, int i, long lng) {
                heightOfBarCode = Integer.parseInt(adapter.getItemAtPosition(i).toString());
            }
        });

        buttonPrinterBarCode.setOnClickListener(this::buttonPrinterBarCodeFunction);

        return v;
    }

    //Aplica o tipo de código de barras selecionado
    private void setSelectedBarcodeType(int selectedIndex) {
        //Se o tipo de código escolhido não fo QR_CODE, é possível selecionar widht e height separadamente, caso contrário apenas a opção SQUARE deve ser disponibilizada
        textViewWidth.setText("WIDTH");
        textViewHeight.setVisibility(View.VISIBLE);
        spinnerBarCodeHeight.setVisibility(View.VISIBLE);

        if (selectedIndex == 2) {
            textViewWidth.setText("SQUARE");
            textViewHeight.setVisibility(View.INVISIBLE);
            spinnerBarCodeHeight.setVisibility(View.INVISIBLE);
        }

        //O enumerator está na mesma ordem que o índice do spinner, portanto pode-se atribuir diretamente:
        selectedBarcodeType = BarcodeType.values()[selectedIndex];

        //O texto de mensagem a ser transformada em código de barras recebe o padrão para o tipo escolhido
        editTextInputBarCode.setText(selectedBarcodeType.getDefaultBarcodeMessage());
    }

    private void buttonPrinterBarCodeFunction(View v) {
        //A lista de comandos da impressão
        List<IntentDigitalHubCommand> termicaCommandList = new ArrayList<>();

        //O comando de alinhamento para os códigos são chamados através de DefinePosicao()
        final int posicao = selectedAlignment.getAlignmentValue();

        DefinePosicao definePosicaoCommand = new DefinePosicao(posicao);

        //Adiciona o comando de define posição
        termicaCommandList.add(definePosicaoCommand);

        //Para a impressão de QR_CODE existe uma função específica
        if (selectedBarcodeType == BarcodeType.QR_CODE) {
            final String dados = editTextInputBarCode.getText().toString();

            final int tamanho = widthOfBarCode;

            final int nivelCorrecao = 2;

            ImpressaoQRCode impressaoQRCodeCommand = new ImpressaoQRCode(dados,
                    tamanho,
                    nivelCorrecao);

            termicaCommandList.add(impressaoQRCodeCommand);
        } else {
            final int tipo = selectedBarcodeType.getBarcodeTypeValue();

            final String dados = editTextInputBarCode.getText().toString();

            final int altura = heightOfBarCode;

            final int largura = widthOfBarCode;

            //Não imprimir valor abaixo do código
            final int HRI = 4;

            ImpressaoCodigoBarras impressaoCodigoBarrasCommand = new ImpressaoCodigoBarras(tipo,
                    dados,
                    altura,
                    largura,
                    HRI);

            termicaCommandList.add(impressaoCodigoBarrasCommand);
        }

        AvancaPapel avancaPapelCommand = new AvancaPapel(10);

        termicaCommandList.add(avancaPapelCommand);

        if (checkBoxIsCutPaperBarCode.isChecked()) {
            Corte corteCommand = new Corte(0);

            termicaCommandList.add(corteCommand);
        }

        IntentDigitalHubCommandStarter.startHubCommandActivity(PrinterActivityReference, termicaCommandList, PrinterActivity.IMPRESSAO_CODIGO_BARRAS_REQUESTCODE);
    }

    /**
     * Valores do código de barra para a impressão de código de barras, de acordo com a documentação
     */

    private enum BarcodeType {
        EAN_8(3, "40170725"),
        EAN_13(2, "0123456789012"),
        //O código QR_CODE possui sua função própia, por isto seu valor-código para as funções não é utilizado
        QR_CODE(null, "ELGIN DEVELOPERS COMMUNITY"),
        UPC_A(0, "123601057072"),
        CODE_39(4, "CODE39"),
        ITF(5, "05012345678900"),
        CODE_BAR(6, "A3419500A"),
        CODE_93(7, "CODE93"),
        CODE_128(8, "{C1233");

        //Código utilizado para a identificação do tipo de código de barras, de acordo com a documentação
        final private Integer barcodeTypeValue;

        //String utilizada como mensagem-exemplo ao se selecionar um novo tipo de código para a impresão
        final private String defaultBarcodeMessage;

        BarcodeType(Integer barcodeTypeValue, String defaultBarcodeMessage) {
            this.barcodeTypeValue = barcodeTypeValue;
            this.defaultBarcodeMessage = defaultBarcodeMessage;
        }

        public Integer getBarcodeTypeValue() {
            return barcodeTypeValue;
        }

        public String getDefaultBarcodeMessage() {
            return defaultBarcodeMessage;
        }
    }

    //Valores de alinhamento para a impressão de código de barras
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

}