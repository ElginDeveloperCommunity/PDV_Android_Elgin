package com.elgin.intent_digital_hub.Printer;

import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.content.res.AppCompatResources;
import androidx.fragment.app.FragmentTransaction;

import com.elgin.intent_digital_hub.ActivityUtils;
import com.elgin.intent_digital_hub.IntentDigitalHubService.IntentDigitalHubCommandStarter;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.AbreConexaoImpressora;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.AbreGavetaElgin;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.FechaConexaoImpressora;
import com.elgin.intent_digital_hub.IntentDigitalHubService.TERMICA.StatusImpressora;
import com.elgin.intent_digital_hub.Printer.Fragments.PrinterBarCodeFragment;
import com.elgin.intent_digital_hub.Printer.Fragments.PrinterImageFragment;
import com.elgin.intent_digital_hub.Printer.Fragments.PrinterTextFragment;
import com.elgin.intent_digital_hub.R;
import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/*
    Nas funções da impressora é recomendado que utilize a concatenção dos JSON de comandos, enviando um só comundo, por se tratar de processamento em hardware o processo assíncrono deve ser levado em consideração.
 */
public class PrinterActivity extends AppCompatActivity {

    public final static int IMPRESSAO_TEXTO_REQUESTCODE = 8;
    public final static int IMPRIME_XML_NFCE_REQUESTCODE = 9;
    public final static int IMPRIME_XML_SAT_REQUESTCODE = 10;
    public final static int IMPRESSAO_CODIGO_BARRAS_REQUESTCODE = 11;
    public final static int OPEN_GALLERY_FOR_IMAGE_SELECTION_REQUESTCODE = 12;
    public final static int IMPRIME_IMAGEM_REQUESTCODE = 13;
    private final static int ABRE_CONEXAO_IMPRESSORA_REQUESTCODE = 1;
    private final static int ABRE_CONEXAO_IMPRESSORA_USB_REQUESTCODE = 2;
    private final static int ABRE_CONEXAO_IMPRESSORA_IP_REQUESTCODE = 3;
    private final static int FECHA_CONEXAO_IMPRESSORA_REQUESTCDOE = 4;
    private final static int STATUS_IMPRESSORA_REQUESTCODE = 5;
    private final static int STATUS_IMPRESSORA_STATUS_GAVETA_REQUESTCODE = 6;
    private final static int ABRE_GAVETA_ELGIN_REQUESTCODE = 7;
    private final static String EXTERNAL_CONNECTION_METHOD_USB = "USB";
    private final static String EXTERNAL_CONNECTION_METHOD_IP = "IP";

    private final String EXTERNAL_PRINTER_MODEL_I9 = "i9";
    private final String EXTERNAL_PRINTER_MODEL_I8 = "i8";
    private String selectedPrinterModel;
    private Button buttonPrinterTextSelected;
    private Button buttonPrinterBarCodeSelected;
    private Button buttonPrinterImageSelected;
    private Button buttonStatusPrinter;
    private Button buttonStatusGaveta;
    private Button buttonAbrirGaveta;
    private RadioGroup radioGroupConnectPrinterIE;
    private RadioButton radioButtonConnectPrinterIntern;
    private EditText editTextInputIP;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_printer);

        //Inicia a impressora interna ao abrir da tela
        connectInternPrinter();

        //Atualiza Fragment
        switchToPrinterTextFragment();

        editTextInputIP = findViewById(R.id.editTextInputIP);
        buttonPrinterTextSelected = findViewById(R.id.buttonPrinterTextSelect);
        buttonPrinterImageSelected = findViewById(R.id.buttonPrinterImageSelect);
        buttonPrinterBarCodeSelected = findViewById(R.id.buttonPrinterBarCodeSelect);
        buttonStatusPrinter = findViewById(R.id.buttonStatus);
        buttonStatusGaveta = findViewById(R.id.buttonStatusGaveta);
        buttonAbrirGaveta = findViewById(R.id.buttonAbrirGaveta);
        radioButtonConnectPrinterIntern = findViewById(R.id.radioButtonConnectPrinterIntern);
        radioGroupConnectPrinterIE = findViewById(R.id.radioGroupConnectPrinterIE);

        //Atualiza a borda selecionada inicialmente
        updateSelectedScreenButtonBorder("Text");

        radioButtonConnectPrinterIntern.setChecked(true);
        editTextInputIP.setText("192.168.0.103:9100");

        buttonPrinterTextSelected.setOnClickListener(v -> {
            updateSelectedScreenButtonBorder("Text");
            switchToPrinterTextFragment();
        });
        buttonPrinterBarCodeSelected.setOnClickListener(v -> {
            updateSelectedScreenButtonBorder("Barcode");
            switchToPrinterBarCodeFragment();
        });
        buttonPrinterImageSelected.setOnClickListener(v -> {
            updateSelectedScreenButtonBorder("Image");
            switchToPrinterImageFragment();
        });

        radioGroupConnectPrinterIE.setOnCheckedChangeListener(this::onRadioConnectPrinterIEChanged);

        buttonStatusPrinter.setOnClickListener(v -> statusPrinter());

        buttonStatusGaveta.setOnClickListener(v -> statusDrawer());

        buttonAbrirGaveta.setOnClickListener(v -> openDrawer());
    }

    private void updateSelectedScreenButtonBorder(String screenSelected) {
        buttonPrinterTextSelected.setBackgroundTintList(AppCompatResources.getColorStateList(this,
                screenSelected.equals("Text") ? R.color.azul : R.color.black));
        buttonPrinterBarCodeSelected.setBackgroundTintList(AppCompatResources.getColorStateList(this,
                screenSelected.equals("Barcode") ? R.color.azul : R.color.black));
        buttonPrinterImageSelected.setBackgroundTintList(AppCompatResources.getColorStateList(this,
                screenSelected.equals("Image") ? R.color.azul : R.color.black));
    }

    private void switchToPrinterTextFragment() {
        PrinterTextFragment printerTextFragment = new PrinterTextFragment();
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.containerFragments, printerTextFragment);
        transaction.commit();
    }

    private void switchToPrinterBarCodeFragment() {
        PrinterBarCodeFragment printerBarCodeFragment = new PrinterBarCodeFragment();
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.containerFragments, printerBarCodeFragment);
        transaction.commit();
    }

    private void switchToPrinterImageFragment() {
        //Cria a logo que será impressa dentro do diretório da aplicação
        Bitmap elgin_logo_default_print_image = BitmapFactory.decodeResource(this.getResources(), R.drawable.elgin_logo_default_print_image);

        storeImage(elgin_logo_default_print_image);

        PrinterImageFragment printerImageFragment = new PrinterImageFragment();
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.containerFragments, printerImageFragment);
        transaction.commit();
    }


    //Validação de IP
    private boolean isIpValid(String ip) {
        Pattern pattern = Pattern.compile("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$");

        Matcher matcher = pattern.matcher(ip);

        return matcher.matches();
    }

    private void onRadioConnectPrinterIEChanged(RadioGroup grouo, int checkedId) {
        switch (checkedId) {
            case R.id.radioButtonConnectPrinterIntern:
                connectInternPrinter();
                break;

            case R.id.radioButtonConnectPrinterExternByIP:
                if (isIpValid(editTextInputIP.getText().toString())) {
                    //Invoca o alertDialog que permite a escolha do modelo de impressora antes da tentativa de iniciar a conexão por IP
                    alertDialogSetSelectedPrinterModelThenConnect(EXTERNAL_CONNECTION_METHOD_IP);
                } else {
                    //Se não foi possível validar o ip antes da chamada da função, retorne para a conexão com impressora interna
                    radioButtonConnectPrinterIntern.setChecked(true);
                    connectInternPrinter();
                }
                break;

            case R.id.radioButtonConnectPrinterExternByUSB:
                //Invoca o alertDialog que permite a escolha do modelo de impressora antes da tentativa de iniciar a conexão por IP
                alertDialogSetSelectedPrinterModelThenConnect(EXTERNAL_CONNECTION_METHOD_USB);
                break;

        }
    }

    //Dialogo usado para escolher definir o modelo de impressora externa que sera estabelecida a conexao
    public void alertDialogSetSelectedPrinterModelThenConnect(String externalConnectionMethod) {
        String[] operations = {EXTERNAL_PRINTER_MODEL_I9, EXTERNAL_PRINTER_MODEL_I8};

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Selecione o modelo de impressora a ser conectado");

        //Tornando o dialógo não-cancelável
        builder.setCancelable(false);

        builder.setNegativeButton("CANCELAR", (dialog, which) -> {
            //Se a opção de cancelamento tiver sido escolhida, retorne sempre à opção de impressão por impressora interna
            radioButtonConnectPrinterIntern.setChecked(true);

            AbreConexaoImpressora abreConexaoImpressoraCommand = new AbreConexaoImpressora(6, "M8", "", 0);

            IntentDigitalHubCommandStarter.startHubCommandActivity(this, abreConexaoImpressoraCommand, ABRE_CONEXAO_IMPRESSORA_REQUESTCODE);
            dialog.dismiss();
        });

        builder.setItems(operations, (dialog, which) -> {
            //Envia o parâmetro escolhido para a função que atualiza o modelo de impressora selecionado
            setSelectedPrinterModel(which);

            //inicializa depois da seleção do modelo a conexão de impressora, levando em conta o parâmetro que define se a conexão deve ser via IP ou USB
            if (externalConnectionMethod.equals("USB"))
                connectExternPrinterByUSB();
            else
                connectExternPrinterByIP();
        });
        builder.show();
    }

    private void setSelectedPrinterModel(int whichSelected) {
        this.selectedPrinterModel = whichSelected == 0 ? EXTERNAL_PRINTER_MODEL_I9 : EXTERNAL_PRINTER_MODEL_I8;
    }

    private void connectInternPrinter() {
        AbreConexaoImpressora abreConexaoImpressoraCommand = new AbreConexaoImpressora(6, "M8", "", 0);
        IntentDigitalHubCommandStarter.startHubCommandActivity(this, abreConexaoImpressoraCommand, ABRE_CONEXAO_IMPRESSORA_REQUESTCODE);
    }

    private void connectExternPrinterByIP() {
        String ip = editTextInputIP.getText().toString();
        String[] ipAndPort = ip.split(":");

        AbreConexaoImpressora abreConexaoImpressoraCommand = new AbreConexaoImpressora(3, selectedPrinterModel, ipAndPort[0], Integer.parseInt(ipAndPort[1]));

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, abreConexaoImpressoraCommand, ABRE_CONEXAO_IMPRESSORA_IP_REQUESTCODE);
    }

    private void connectExternPrinterByUSB() {
        AbreConexaoImpressora abreConexaoImpressoraCommand = new AbreConexaoImpressora(1, selectedPrinterModel, "USB", 0);

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, abreConexaoImpressoraCommand, ABRE_CONEXAO_IMPRESSORA_USB_REQUESTCODE);
    }

    private void statusPrinter() {
        StatusImpressora statusImpressoraCommand = new StatusImpressora(3);

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, statusImpressoraCommand, STATUS_IMPRESSORA_REQUESTCODE);
    }

    private void statusDrawer() {
        StatusImpressora statusImpressoraCommand = new StatusImpressora(1);

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, statusImpressoraCommand, STATUS_IMPRESSORA_STATUS_GAVETA_REQUESTCODE);
    }

    private void openDrawer() {
        AbreGavetaElgin abreGavetaElginCommand = new AbreGavetaElgin();

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, abreGavetaElginCommand, ABRE_GAVETA_ELGIN_REQUESTCODE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        //Se o resultado for OK
        Log.d("resultCode", String.valueOf(resultCode));
        if (resultCode == RESULT_OK) {
            //Resultado da intent de seleção de imagem
            if (requestCode == OPEN_GALLERY_FOR_IMAGE_SELECTION_REQUESTCODE) {
                /**
                 * Cria um bitmap através do URI da imagem selecionada da galeria, e através dele cria e salva uma imagem em Android/data/applicationPackage/files/ImageToPrint.jpg, que será utilizada na impressão de imagem por PATH
                 */
                Uri returnUri = data.getData();
                Bitmap bitmapImage = null;

                try {
                    bitmapImage = MediaStore.Images.Media.getBitmap(this.getContentResolver(), returnUri);
                } catch (IOException e) {
                    e.printStackTrace();
                }

                //Atualiza a view pela imagem selecionada na galeria
                PrinterImageFragment.imageView.setImageBitmap(bitmapImage);

                //Salva a imagem dentro do diretório da aplicação
                storeImage(bitmapImage);
            }
            //Código de retorno digital hub
            else {
                final String retorno = data.getStringExtra("retorno");
                Log.d("retorno", retorno);
                //O retorno é sempre um JSONArray, no App_Experience apenas um comando é dado por vez, portanto o JSONArray de retorno sempre terá somente um JSON.
                try {
                    JSONArray jsonArray = new JSONArray(retorno);
                    JSONObject jsonObjectReturn = jsonArray.getJSONObject(0);

                    //Caso as conexões por impressora externa não obtiverem sucesso, a conexão deve ser retornada a por impressora interna
                    switch (requestCode) {
                        case ABRE_CONEXAO_IMPRESSORA_REQUESTCODE:
                            AbreConexaoImpressora abreConexaoImpressoraReturn = new Gson().fromJson(jsonObjectReturn.toString(), AbreConexaoImpressora.class);
                            break;
                        //Caso o comando seja conexão por impressora externa (interna ou usb)
                        case ABRE_CONEXAO_IMPRESSORA_USB_REQUESTCODE:
                        case ABRE_CONEXAO_IMPRESSORA_IP_REQUESTCODE:
                            abreConexaoImpressoraReturn = new Gson().fromJson(jsonObjectReturn.toString(), AbreConexaoImpressora.class);

                            //Se a conexão não obtiver sucesso, retorne a impressora interna
                            if (abreConexaoImpressoraReturn.getResultado() != 0) {
                                ActivityUtils.showAlertMessage(this, "Alerta", "A tentativa de conexão por USB não foi bem sucedida");
                                radioButtonConnectPrinterIntern.setChecked(true);
                                connectInternPrinter();
                            }
                            break;
                        //Comandos advindos dos fragments ; não possuem retorno em tela
                        case FECHA_CONEXAO_IMPRESSORA_REQUESTCDOE:
                        case IMPRESSAO_TEXTO_REQUESTCODE:
                        case IMPRIME_XML_NFCE_REQUESTCODE:
                        case IMPRIME_XML_SAT_REQUESTCODE:
                        case IMPRESSAO_CODIGO_BARRAS_REQUESTCODE:
                        case IMPRIME_IMAGEM_REQUESTCODE:
                            break;
                        case STATUS_IMPRESSORA_REQUESTCODE:
                            StatusImpressora statusImpressoraReturn = new Gson().fromJson(jsonObjectReturn.toString(), StatusImpressora.class);

                            String statusPrinter = "";

                            switch (statusImpressoraReturn.getResultado()) {
                                case 5:
                                    statusPrinter = "Papel está presente e não está próximo do fim!";
                                    break;
                                case 6:
                                    statusPrinter = "Papel próximo do fim!";
                                    break;
                                case 7:
                                    statusPrinter = "Papel ausente!";
                                    break;
                                default:
                                    statusPrinter = "Status Desconhecido!";
                            }

                            ActivityUtils.showAlertMessage(this, "Alert", statusPrinter);
                            break;
                        case STATUS_IMPRESSORA_STATUS_GAVETA_REQUESTCODE:
                            statusImpressoraReturn = new Gson().fromJson(jsonObjectReturn.toString(), StatusImpressora.class);

                            String statusGaveta = "";

                            switch (statusImpressoraReturn.getResultado()) {
                                case 1:
                                    statusGaveta = "Gaveta aberta!";
                                    break;
                                case 2:
                                    statusGaveta = "Gaveta fechada";
                                    break;
                                default:
                                    statusGaveta = "Status Desconhecido!";
                            }

                            ActivityUtils.showAlertMessage(this, "Alert", statusGaveta);
                            break;
                        case ABRE_GAVETA_ELGIN_REQUESTCODE:
                            break;
                        default:
                            ActivityUtils.showAlertMessage(this, "Alerta", "O comando " + requestCode + " não foi encontrado!");
                            break;
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    ActivityUtils.showAlertMessage(this, "Alerta", "O retorno não está no formato esperado!");
                }
            }
        } else {
            ActivityUtils.showAlertMessage(this, "Alerta", "O comando não foi bem sucedido!");
        }
    }

    //Desliga a impressora após sair da página
    @Override
    protected void onDestroy() {
        super.onDestroy();

        FechaConexaoImpressora fechaConexaoImpressoraCommand = new FechaConexaoImpressora();

        IntentDigitalHubCommandStarter.startHubCommandActivity(this, fechaConexaoImpressoraCommand, FECHA_CONEXAO_IMPRESSORA_REQUESTCDOE);
    }

    /**
     * Salva uma copia da imagem enviada como bitmap por parametro dentro do diretorio do dispostivo, para a impressao via comando ImprimeImagem
     */

    private void storeImage(Bitmap image) {
        File pictureFile = getCreatedImage();

        //Salva a imagem
        try {
            FileOutputStream fos = new FileOutputStream(pictureFile);
            image.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.close();
        } catch (FileNotFoundException e) {
            Log.e("Error", "Arquivo não encontrado: " + e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            Log.e("Error", "Erro ao acessar o arquivo: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Cria a imagem que será salva no diretório da aplicação
     */

    private File getCreatedImage() {
        String rootDirectoryPATH = ActivityUtils.getRootDirectoryPATH(this);

        // A imagem a ser impressa sempre tera o mesmo nome para que a impressão ache o ultimo arquivo salvo
        File mediaFile;
        String mImageName = "ImageToPrint.jpg";
        mediaFile = new File(rootDirectoryPATH + File.separator + mImageName);
        return mediaFile;
    }
}