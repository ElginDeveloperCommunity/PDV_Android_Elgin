package com.elgin.elginexperience.NFCE;

import android.Manifest;
import android.app.AlertDialog;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.elgin.elginexperience.InputMasks.InputMaskMoney;
import com.elgin.elginexperience.R;
import com.elgin.elginexperience.Services.PrinterService;

import java.io.File;
import java.io.FileInputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import br.com.daruma.framework.mobile.DarumaMobile;
import br.com.daruma.framework.mobile.exception.DarumaException;

public class NfcePage extends AppCompatActivity {

    //Código da intent de request de permissão para escrever dados no diretório externo
    private static final int REQUEST_CODE_WRITE_EXTERNAL_STORAGE = 1234;
    //Printer Object
    public static PrinterService printerInstance;
    private final It4r it4rObj = new It4r(DarumaMobile.inicializar(this, "@FRAMEWORK(LOGMEMORIA=200;TRATAEXCECAO=TRUE;TIMEOUTWS=8000;SATNATIVO=FALSE);@SOCKET(HOST=192.168.210.94;PORT=9100;)"));
    Button buttonConfigurateNfce, buttonSendNfceSale;
    EditText editTextProductName, editTextProductPrice;
    TextView textViewLasfNfceNumber, textViewLastNfceSerie, textViewCronometerValue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_nfce_page);

        printerInstance = new PrinterService(this);
        printerInstance.printerInternalImpStart();

        editTextProductName = findViewById(R.id.editTextProductName);
        editTextProductPrice = findViewById(R.id.editTextProductPrice);

        buttonConfigurateNfce = findViewById(R.id.buttonConfigurateNfce);
        buttonSendNfceSale = findViewById(R.id.buttonSendNfceSale);

        textViewLasfNfceNumber = findViewById(R.id.textViewLasfNfceNumber);
        textViewLastNfceSerie = findViewById(R.id.textViewLastNfceSerie);
        textViewCronometerValue = findViewById(R.id.textViewCronometerValue);

        editTextProductName.setText("CAFE");

        editTextProductPrice.addTextChangedListener(new InputMaskMoney(editTextProductPrice));

        editTextProductPrice.setText("8.00");

        buttonConfigurateNfce.setOnClickListener(v -> configurateNfce());

        buttonSendNfceSale.setOnClickListener(v -> sendSaleNfce(editTextProductName.getText().toString(), editTextProductPrice.getText().toString()));

    }

    //Função que configura NFC-e para a emissão, após a sua execução ocorrer corretamente o botão para o envio da NFc-e deve ser habilitado
    public void configurateNfce() {
        if (isStoragePermissionGranted()) {
            try {
                it4rObj.configurarXmlNfce();
                Toast.makeText(this, "NFC-e configurada com sucesso!", Toast.LENGTH_LONG).show();
                buttonSendNfceSale.setEnabled(true);
            } catch (DarumaException e) {
                Toast.makeText(this, "Erro na configuração de NFC-e", Toast.LENGTH_LONG).show();
                buttonSendNfceSale.setEnabled(false);
                e.printStackTrace();
            }
        }
    }

    //Função do envio de venda NFC-e, essa função configura a venda com os dados da tela e em seguida tenta emitir a nota e por ultimo faz impressão da nota (Caso tenha ocorrido algum erro durante a emissão da nota é feita a impressão da nota em contingência).
    public void sendSaleNfce(String productName, String productPrice) {
        //É feita uma venda antes da venda antes para que a nossa venda não seja omitida, isso é necessário em servidor de homologação
        preSale();

        //Configuramos a venda com os dados da tela
        try {
            it4rObj.venderItem(productName, formatPrice(productPrice), "123456789012");
        } catch (DarumaException e) {
            Toast.makeText(this, "Erro na configuração de venda", Toast.LENGTH_LONG).show();
            e.printStackTrace();
            return;
        }

        //Encerramos a venda emitiando a nota para o servidor
        try {
            it4rObj.encerrarVenda(formatPrice(productPrice), "Dinheiro");
            alertMessageStatus("NFC-e emitida com sucesso!");
        } catch (DarumaException e) {
            alertMessageStatus("Erro ao emitir NFC-e online, a impressão será da nota em contigência!");
            e.printStackTrace();
        }

        //Se a o tempo de emissão calculado for diferente de 0 então a nota não foi emitida em contigência offline, e o tempo de emissão calculado será exposto na tela
        if (it4rObj.getTimeElapsedInLastEmission().get() != 0)
            textViewCronometerValue.setText(String.format("%s SEGUNDOS", it4rObj.getTimeElapsedInLastEmission().get() / 1000));
        else
            textViewCronometerValue.setText("");

        //Expõe o número da nota emitida
        textViewLasfNfceNumber.setText(it4rObj.getNumeroNota());
        //Expões a série emitida
        textViewLastNfceSerie.setText(it4rObj.getNumeroSerie());

        //Impressão da NFC-e
        final Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("xmlNFCe", getTextOfFile());
        mapValues.put("indexcsc", 1);
        mapValues.put("csc", "1A451E99-0FE0-4C13-B97E-67D698FFBC37");
        mapValues.put("param", 0);

        //Prepara o corte
        mapValues.put("quant", 5);

        printerInstance.imprimeXMLNFCe(mapValues);
        printerInstance.cutPaper(mapValues);
    }

    //Como no App_Experience é feita uma venda em ambiente de homologação, e uma nota emitida nesse ambiente sempre aparece com a primeira compra emitida, será feita uma venda com valor nulo para que a venda feita na aplicação não seja omitida
    public void preSale() {
        try {
            it4rObj.venderItem("I", "0.00", "123456789011");
        } catch (DarumaException e) {
            Toast.makeText(this, "Erro na configuração de venda" + e.getMessage(), Toast.LENGTH_LONG).show();
            e.printStackTrace();
            return;
        }
    }

    //Desliga a impressora após sair da página
    @Override
    protected void onDestroy() {
        super.onDestroy();
        printerInstance.printerStop();
    }

    //Checa se a permissão para escrever arquivos em diretórios externos foi garantida, se não tiver ; peça novamente
    public boolean isStoragePermissionGranted() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                Log.v("DEBUG", "A permissão está garantida!");
                return true;
            } else {
                Log.v("DEBUG", "A permissão está negada!");
                //Pedindo permissão
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_CODE_WRITE_EXTERNAL_STORAGE);
                return false;
            }
        } else { //A permissão é automaticamente concecida em sdk > 23 na instalação
            Log.v("DEBUG", "A permissão está garantida!");
            return true;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        Log.d("DEBUG", String.valueOf(requestCode));
        if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            Log.v("DEBUG", "Permission: " + permissions[0] + "was " + grantResults[0]);
            //A permissão necessária acabou de ser garantida, continue com a operação

            configurateNfce();
        } else if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE) {
            Toast.makeText(this, "É necessário garantir a permissão de armazenamento para a montagem da NFCe a ser enviada!", Toast.LENGTH_LONG).show();
        }
    }

    //Função que lê o xml que representa a nota NFC-e emitida e retorna uma String com o conteúdo
    private String getTextOfFile() {
        String strFile = "";

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            strFile = getApplication().getExternalFilesDir(null).getPath() + "//IT4R//EnvioWS.xml";
        } else {
            strFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/EnvioWS.xml";
        }

        String strFileContent = "";
        File file = new File(strFile);

        if (file.exists()) {
            FileInputStream fis2 = null;
            try {
                fis2 = new FileInputStream(file);
                char current;
                while (fis2.available() > 0) {
                    current = ((char) fis2.read());
                    strFileContent = strFileContent + String.valueOf(current);
                }

            } catch (Exception e) {
                Log.d("TourGuide", e.toString());
            } finally {
                if (fis2 != null) try {
                    fis2.close();
                } catch (Exception e) {

                }
            }
        }
        return strFileContent;
    }

    public void alertMessageStatus(String messageAlert) {
        AlertDialog alertDialog = new AlertDialog.Builder(this).create();
        alertDialog.setTitle("NFC-e");
        alertDialog.setMessage(messageAlert);
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                (dialog, which) -> dialog.dismiss());
        alertDialog.show();
    }

    //Função que formata o preço do produto para o formato esperado na venda de itens uma vez que o formato esperado é de [0-9]+.00
    public String formatPrice(String productPrice) {
        //Valor do campo formatado para a criação do BigDecimal formatado
        String valueFormatted = productPrice.replaceAll(",", "\\.").trim();

        BigDecimal actualValueInBigDecimal;
        try {
            actualValueInBigDecimal = new BigDecimal(valueFormatted);
        } catch (NumberFormatException e) {
            //Se o número for maior que 999, a mask irá colocar um "." a mais, estas ocorrências devem ser removidas antes da comparação
            String[] valueSplitted = valueFormatted.split("\\.");
            List<String> thousandsUnit = new ArrayList<>(Arrays.asList(valueSplitted));

            StringBuilder valueWithoutThousandsComma = new StringBuilder();

            for (int i = 0; i < thousandsUnit.size() - 1; i++)
                valueWithoutThousandsComma.append(thousandsUnit.get(i));

            valueWithoutThousandsComma.append(".").append(thousandsUnit.get(thousandsUnit.size() - 1));

            actualValueInBigDecimal = new BigDecimal(valueWithoutThousandsComma.toString());
        }

        return String.valueOf(actualValueInBigDecimal);
    }
}