package com.elgin.flutter_m8;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.elgin.flutter_m8.NFCE.It4r;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import br.com.daruma.framework.mobile.DarumaMobile;
import br.com.daruma.framework.mobile.exception.DarumaException;
import br.com.setis.interfaceautomacao.Operacoes;
import io.flutter.embedding.android.FlutterActivity;
import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.plugin.common.BinaryMessenger;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugins.GeneratedPluginRegistrant;

public class MainActivity extends FlutterActivity {
    public static MethodChannel.Result resultFlutter;

    Bundle bundle = new Bundle();
    Printer printer;
    Balanca balanca;
    Paygo paygo;
    ServiceSat serviceSat;
    Activity activity;
    //Objeto da classe E1BridgeService para uso das funções Bridge
    E1BridgeService bridgeService;
    Intent intentSitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");
    private It4r it4rObj;
    private String CHANNEL = "samples.flutter.elgin/ElginServices";
    //Código da intent de request de permissão para escrever dados no diretório externo, utilizado na NFCE
    private static final int REQUEST_CODE_WRITE_EXTERNAL_STORAGE = 1234;

    @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
        GeneratedPluginRegistrant.registerWith(flutterEngine);

        activity = this;
        printer = new Printer(activity);
        paygo = new Paygo(activity);
        balanca = new Balanca(activity);
        serviceSat = new ServiceSat(activity);

        it4rObj = new It4r(DarumaMobile.inicializar(this, "@FRAMEWORK(LOGMEMORIA=200;TRATAEXCECAO=TRUE;TIMEOUTWS=8000;SATNATIVO=FALSE);@SOCKET(HOST=192.168.210.94;PORT=9100;)"));

        //Intanciando objeto da classe E1BridgeService
        bridgeService = new E1BridgeService();


        BinaryMessenger binaryMessenger = flutterEngine.getDartExecutor().getBinaryMessenger();
        new MethodChannel(binaryMessenger, CHANNEL).setMethodCallHandler((call, result) -> {
            bundle = new Bundle();
            resultFlutter = result;
            if (call.method.equals("mSitef")) {
                runMsitef(call);
            }
            if (call.method.equals("printer")) {
                HashMap map = call.argument("args");
                formatActionPrinter(map);
            }
            if (call.method.equals("sat")) {
                Map map = call.argument("args");
                formatActionSat(map);
            }
            if (call.method.equals("paygo")) {
                Map map = call.argument("args");
                runPayGo(map);
            }
            if (call.method.equals("balanca")) {
                Map map = call.argument("args");
                formatActionBalanca(map);
            }
            if (call.method.equals("bridge")) {
                Map map = call.argument("args");
                formatActionBridge(map);
            }

            if (call.method.equals("NFCE")) {
                Log.d("MANO", "OXE");
                Map map = call.argument("args");
                formatActionNFCE(map);
            }
        });
    }

    public void formatActionBridge(Map map) {
        try {
            Log.d("MADARA", map.toString());

            String action = (String) map.get("typeBridge");

            String bridgeReturn = "";

            if (action.equals("IniciaVendaDebito")) {
                int idTransacao = (int) map.get("idTransacao");
                String pdv = (String) map.get("pdv");
                String valorTotal = (String) map.get("valorTotal");

                bridgeReturn = bridgeService.IniciaVendaDebito(idTransacao, pdv, valorTotal);
                resultFlutter.success(bridgeReturn);

            } else if (action.equals("IniciaVendaCredito")) {
                int idTransacao = (int) map.get("idTransacao");
                String pdv = (String) map.get("pdv");
                String valorTotal = (String) map.get("valorTotal");
                int tipoFinanciamento = (int) map.get("tipoFinanciamento");
                int numeroParcelas = (int) map.get("numeroParcelas");

                bridgeReturn = bridgeService.IniciaVendaCredito(idTransacao, pdv, valorTotal, tipoFinanciamento, numeroParcelas);
                resultFlutter.success(bridgeReturn);

            } else if (action.equals("IniciaCancelamentoVenda")) {
                int idTransacao = (int) map.get("idTransacao");
                String pdv = (String) map.get("pdv");
                String valorTotal = (String) map.get("valorTotal");
                String dataHora = (String) map.get("dataHora");
                String nsu = (String) map.get("nsu");

                bridgeReturn = bridgeService.IniciaCancelamentoVenda(idTransacao, pdv, valorTotal, dataHora, nsu);
                resultFlutter.success(bridgeReturn);

            } else if (action.equals("IniciaOperacaoAdministrativa")) {
                int idTransacao = (int) map.get("idTransacao");
                String pdv = (String) map.get("pdv");
                int operacao = (int) map.get("operacao");

                bridgeReturn = bridgeService.IniciaOperacaoAdministrativa(idTransacao, pdv, operacao);
                resultFlutter.success(bridgeReturn);
            } else if (action.equals("ImprimirCupomNfce")) {
                String xml = (String) map.get("xml");
                int indexcsc = (int) map.get("indexcsc");
                String csc = (String) map.get("csc");

                bridgeReturn = bridgeService.ImprimirCupomNfce(xml, indexcsc, csc);
                resultFlutter.success(bridgeReturn);
            } else if (action.equals("ImprimirCupomSat")) {
                String xml = (String) map.get("xml");

                bridgeReturn = bridgeService.ImprimirCupomSat(xml);
                resultFlutter.success(bridgeReturn);
            } else if (action.equals("ImprimirCupomSatCancelamento")) {
                String xml = (String) map.get("xml");
                String assQRCode = (String) map.get("assQRCode");

                bridgeReturn = bridgeService.ImprimirCupomSatCancelamento(xml, assQRCode);
                resultFlutter.success(bridgeReturn);
            } else if (action.equals("SetSenha")) {
                String senha = (String) map.get("senha");
                Boolean habilitada = (Boolean) map.get("habilitada");

                bridgeReturn = bridgeService.SetSenha(senha, habilitada);
                resultFlutter.success(bridgeReturn);
            } else if (action.equals("ConsultarStatus")) {
                bridgeReturn = bridgeService.ConsultarStatus();
                resultFlutter.success(bridgeReturn);

            } else if (action.equals("GetTimeout")) {
                bridgeReturn = bridgeService.GetTimeout();
                resultFlutter.success(bridgeReturn);
            } else if (action.equals("ConsultarUltimaTransacao")) {
                String pdv = (String) map.get("pdv");

                bridgeReturn = bridgeService.ConsultarUltimaTransacao(pdv);
                resultFlutter.success(bridgeReturn);
            } else if (action.equals("SetSenharServer")) {
                String senha = (String) map.get("senha");
                Boolean habilitada = (Boolean) map.get("habilitada");

                bridgeReturn = bridgeService.SetSenhaServer(senha, habilitada);
                resultFlutter.success(bridgeReturn);
            } else if (action.equals("SetTimeout")) {
                int timeout = (int) map.get("timeout");

                bridgeReturn = bridgeService.SetTimeout(timeout);
                resultFlutter.success(bridgeReturn);
            } else if (action.equals("GetServer")) {
                bridgeReturn = bridgeService.GetServer();
                resultFlutter.success(bridgeReturn);
            } else if (action.equals("SetServer")) {
                String ipTerminal = (String) map.get("ipTerminal");
                int portaTransacao = (int) map.get("portaTransacao");
                int portaStatus = (int) map.get("portaStatus");

                bridgeReturn = bridgeService.SetServer(ipTerminal, portaTransacao, portaStatus);
                resultFlutter.success(bridgeReturn);
            }


        } catch (Exception e) {
            e.printStackTrace();
            resultFlutter.notImplemented();
        }
    }

    public void formatActionSat(Map map) {
        String resultSat = "...";

        if (Objects.equals(map.get("typeSatCommand"), "ativarSat")) {
            resultSat = serviceSat.ativarSAT(map);
        } else if (Objects.equals(map.get("typeSatCommand"), "associarSat")) {
            resultSat = serviceSat.associarAssinatura(map);
        } else if (Objects.equals(map.get("typeSatCommand"), "consultarSat")) {
            resultSat = serviceSat.consultarSAT(map);
        } else if (Objects.equals(map.get("typeSatCommand"), "statusOperacionalSat")) {
            resultSat = serviceSat.statusOperacional(map);
        } else if (Objects.equals(map.get("typeSatCommand"), "enviarVendaSat")) {
            resultSat = serviceSat.enviarVenda(map);
        } else if (Objects.equals(map.get("typeSatCommand"), "cancelarVendaSat")) {
            resultSat = serviceSat.cancelarVenda(map);
        } else if (Objects.equals(map.get("typeSatCommand"), "extrairLogSat")) {
            resultSat = serviceSat.extrairLog(map);
        } else {
            resultFlutter.notImplemented();
            return;
        }

        resultFlutter.success(resultSat);
    }

    public void formatActionBalanca(Map map) {
        String result = "...";
        if (Objects.equals(map.get("typeOption"), "configBalanca")) {
            result = balanca.configBalanca(map);
        } else if (Objects.equals(map.get("typeOption"), "lerPesoBalanca")) {
            result = balanca.lerPesoBalanca();
        } else {
            resultFlutter.notImplemented();
            return;
        }
        resultFlutter.success(result);
    }

    public void formatActionPrinter(Map map) {
        int result = -1;
        Log.d("MADARA", map.toString());
        if (Objects.equals(map.get("typePrinter"), "printerText")) {
            result = printer.imprimeTexto(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerCupomTEF")) {
            result = printer.imprimeCupomTEF(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerBarCode")) {
            result = printer.imprimeBarCode(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerQrCode")) {
            result = printer.imprimeQR_CODE(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerImage")) {
            result = printer.imprimeImagem(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerNFCe")) {
            result = printer.imprimeXMLNFCe(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerSAT")) {
            result = printer.imprimeXMLSAT(map);

        } else if (Objects.equals(map.get("typePrinter"), "jumpLine")) {
            result = printer.AvancaLinhas(map);

        } else if (Objects.equals(map.get("typePrinter"), "gavetaStatus")) {
            result = printer.statusGaveta();

        } else if (Objects.equals(map.get("typePrinter"), "abrirGaveta")) {
            result = printer.abrirGaveta();

        } else if (Objects.equals(map.get("typePrinter"), "printerStatus")) {
            result = printer.statusSensorPapel();

        } else if (Objects.equals(map.get("typePrinter"), "cutPaper")) {
            result = printer.cutPaper(map);

        } else if (Objects.equals(map.get("typePrinter"), "printerConnectExternalByIP")) {
            String model = (String) map.get("model");
            String ip = (String) map.get("ip");
            int port = (int) map.get("port");
            result = printer.printerExternalImpStartByIP(model, ip, port);
        } else if ((Objects.equals(map.get("typePrinter"), "printerConnectExternalByUSB"))) {
            String model = (String) map.get("model");

            result = printer.printerExternalImpStartByUSB(model);
        } else if (Objects.equals(map.get("typePrinter"), "printerConnectInternal")) {
            result = printer.printerInternalImpStart();
        } else if (Objects.equals(map.get("typePrinter"), "printerStop")) {
            printer.printerStop();
        } else {
            resultFlutter.notImplemented();
            return;
        }
        resultFlutter.success(result);
    }

    public void runPayGo(Map map) {
        if (Objects.equals(map.get("typeOption"), "VENDA")) {
            paygo.efetuaTransacao(Operacoes.VENDA, map);

        } else if (Objects.equals(map.get("typeOption"), "CANCELAMENTO")) {
            paygo.efetuaTransacao(Operacoes.CANCELAMENTO, map);

        } else {
            paygo.efetuaTransacao(Operacoes.ADMINISTRATIVA, map);
        }
    }

    public void runMsitef(MethodCall call) {
        Map<String, String> map = call.argument("args");
        for (String key : map.keySet()) {
            if (map.get(key).equals("")) map.put(key, null);
            bundle.putString(key, map.get(key));
        }
        intentSitef.putExtras(bundle);
        startActivityForResult(intentSitef, 4321);
    }

    public String bundleToJson(Intent dataSitef) {
        JSONObject json = new JSONObject();
        Bundle bundle = dataSitef.getExtras();
        Set<String> keys = bundle.keySet();
        for (String key : keys) {
            try {
                json.put(key, JSONObject.wrap(bundle.get(key)));
            } catch (JSONException e) {
            }
        }
        return json.toString();
    }

    private void formatActionNFCE(Map map) {
        final String typeNFCE = (String) map.get("typeNFCE");
        Log.d("DEBUG", typeNFCE);

        if (typeNFCE.equals(FunctionsNfce.CONFIGURATE_XML_NFCE.name()))
            configurateXmlNfce();
        else
            sendSaleNfce(map);
    }

    private void sendSaleNfce(Map map) {
        final String productName = (String) map.get("productName");
        final String productPrice = (String) map.get("productPrice");

        //É feita uma venda antes da venda antes para que a nossa venda não seja omitida, isso é necessário em servidor de homologação
        preSale();

        //Configuramos a venda com os dados da tela
        try {
            it4rObj.venderItem(productName, productPrice, "123456789012");
        } catch (DarumaException e) {
            //Toast.makeText(this, "Erro na configuração de venda", Toast.LENGTH_LONG).show();
            e.printStackTrace();
            resultFlutter.success("ERROR_SALE_CONFIGURATION");
            return;
        }

        //Uma váriavel sentinela é utilizada para controlar se a nota já foi emitida em contigência e então não devera ser emitido um channel.success() novamente..
        boolean wasIssuedInContigency = false;

        //Encerramos a venda emitiando a nota para o servidor
        try {
            it4rObj.encerrarVenda(productPrice, "Dinheiro");
        } catch (DarumaException e) {
            wasIssuedInContigency = true;
            resultFlutter.success("SUCCESS_CONTINGENCY" + "|" + it4rObj.getNumeroNota() + "|" + it4rObj.getNumeroSerie());
            e.printStackTrace();
        }

        String elapsedTimeInSeconds = String.valueOf(it4rObj.getTimeElapsedInLastEmission().get() / 1000);
        if (!wasIssuedInContigency)
            resultFlutter.success(elapsedTimeInSeconds + "|" + it4rObj.getNumeroNota() + "|" + it4rObj.getNumeroSerie());

        //Impressão da NFC-e
        final Map<String, Object> mapValues = new HashMap<>();

        mapValues.put("xmlNFCe", getTextOfFile());
        mapValues.put("indexcsc", 1);
        mapValues.put("csc", "1A451E99-0FE0-4C13-B97E-67D698FFBC37");
        mapValues.put("param", 0);
        mapValues.put("quant", 5);

        printer.imprimeXMLNFCe(mapValues);
        printer.cutPaper(mapValues);
    }

    private void preSale() {
        try {
            it4rObj.venderItem("I", "0.00", "123456789011");
        } catch (DarumaException e) {
            Toast.makeText(this, "Erro na configuração de venda" + e.getMessage(), Toast.LENGTH_LONG).show();
            e.printStackTrace();
            return;
        }
    }

    private void configurateXmlNfce() {
        if (isStoragePermissionGranted()) {
            try {
                it4rObj.configurarXmlNfce();
                resultFlutter.success("Success");
            } catch (DarumaException e) {
                e.printStackTrace();
                resultFlutter.success("Error");
            }
        }
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

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 4321) {
            if (resultCode == RESULT_OK || resultCode == RESULT_CANCELED && data != null) {
                resultFlutter.success(bundleToJson(data));
            } else {
                resultFlutter.notImplemented();
            }
        }
        if (requestCode == 3) {
            if (data.getStringExtra("retorno").equals("0")) {
                if (data.getStringExtra("erro") != null) {
                    resultFlutter.success(data.getStringExtra("erro"));
                } else {
                    System.out.println("RETORNO: " + data.getStringExtra("mensagem"));
                    resultFlutter.success("ERRO");
                }
            } else {
                resultFlutter.success(data.getStringExtra("mensagem"));
            }
        }
    }
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        Log.d("DEBUG", String.valueOf(requestCode));
        if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            Log.v("DEBUG", "Permission: " + permissions[0] + "was " + grantResults[0]);
            //A permissão necessária acabou de ser garantida, continue com a operação

            configurateXmlNfce();
        } else if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE) {
            Toast.makeText(this, "É necessário garantir a permissão de armazenamento para a montagem da NFCe a ser enviada!", Toast.LENGTH_LONG).show();
        }
    }

    public
    enum FunctionsNfce {CONFIGURATE_XML_NFCE, SEND_SALE_NFCE}
}
