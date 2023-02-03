package com.elgin.flutter_m8;

import static java.util.Objects.*;

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
import com.elgin.flutter_m8.Pix4.Framework;
import com.elgin.flutter_m8.Pix4.Pix4ImagesStorageService;
import com.elgin.flutter_m8.Pix4.Pix4Service;
import com.elgin.flutter_m8.Pix4.Produto;
import com.elgin.flutter_m8.TefEnums.Acao;
import com.elgin.flutter_m8.TefEnums.FormaFinanciamento;
import com.elgin.flutter_m8.TefEnums.FormaPagamento;
import com.elgin.flutter_m8.TefEnums.TEF;

import org.apache.commons.lang3.NotImplementedException;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
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

    //Intent para o TEF M-SITEF.
    final Intent intentToMsitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");
    final int REQUEST_CODE_MSITEF = 4321;

    private Pix4Service pix4ServiceObj;

    //Intent para o TEF ELGIN.
    final Intent intentToElginTef = new Intent("com.elgin.e1.digitalhub.TEF");
    final int REQUEST_CODE_ELGINTEF = 1234;

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

            Map<String, Object> params = call.argument("args");

            //requireNonNull(params, "Parãmetros nulos!");

            switch (call.method) {
                case "TEF":
                    //Captura o tipo de TEF selecionado.
                    TEF tefSelecionado = TEF.fromRotulo((String) params.get("opcaoTef"));

                    //Captura o tipo de Acao a ser realizada.
                    Acao acaoSelecionada = Acao.fromRotulo((String) params.get("acaoTef"));

                    //Repassa os parâmetros para o filtro do tipo de tef / acao;
                    startActionTEF(tefSelecionado, acaoSelecionada, params);
                    break;
                case "printer":
                    formatActionPrinter(params);
                    break;
                case "sat":
                    formatActionSat(params);
                    break;
                case "balanca":
                    formatActionBalanca(params);
                    break;
                case "bridge":
                    formatActionBridge(params);
                    break;
                case "NFCE":
                    formatActionNFCE(params);
                    break;
                case "pix4":
                    formatActionPix4(params);
                    break;
                case "askExternalStoragePermission":
                    askWriteExternalStoragePermission();
                    break;
                default:
                    throw new NotImplementedException("A ação enviada não possuí implementação!");
            }
        });
    }

    // Pede a permissão de acesso ao diretório externo
    private void askWriteExternalStoragePermission() {
        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_CODE_WRITE_EXTERNAL_STORAGE);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_DENIED) {
            // Envia a resposta da requisição de volta ao Flutter
            resultFlutter.success(false);
        } else if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            resultFlutter.success(true);
        }
    }


    private void formatActionPix4(Map<String, Object> params) {
        if (pix4ServiceObj == null) {
            pix4ServiceObj = new Pix4Service(this);
        }

        switch ((String) requireNonNull(params.get("acao"))) {
            case "OpenDisplayConnection":
                pix4ServiceObj.abreConexaoDisplay();
                break;
            case "ExecuteStoreImage":
                final Pix4ImagesStorageService storageService = new Pix4ImagesStorageService(this);
                storageService.executeStoreImages();
                break;
            case "LoadImagesOnPix4":
                pix4ServiceObj.carregarImagens();
                break;
            case "AddProductAndShowImage":
                final Produto produtoToBeAdded = Produto.fromName((String) requireNonNull(params.get("produto")));
                pix4ServiceObj.adicionaProdutoApresenta(produtoToBeAdded);
                break;
            case "ShowQrCodeFramework":
                final Framework frameworkToBeShowed = Framework.fromName((String) requireNonNull(params.get("framework")));
                pix4ServiceObj.apresentaQrCodeLinkGihtub(frameworkToBeShowed);
                break;
            case "ShowShoppingList":
                pix4ServiceObj.apresentaListaCompras();
                break;
            default:
                throw new NotImplementedException("Ação não encontrada para o módulo PIX4!!!");
        }

        resultFlutter.success("success");
    }

    private void startActionTEF(TEF tefSelecionado, Acao acaoSelecionada, Map<String, Object> params) {
        switch (tefSelecionado) {
            case PAY_GO:
                runPayGo(acaoSelecionada, params);
                break;
            case M_SITEF:
                runMsitef(acaoSelecionada, params);
                break;
            case ELGIN_TEF:
                runElginTef(acaoSelecionada, params);
                break;
        }
    }

    public void runPayGo(Acao acaoSelecionada, Map<String, Object> params) {
        switch (acaoSelecionada) {
            case VENDA:
                paygo.efetuaTransacao(Operacoes.VENDA, params);
                break;
            case CANCELAMENTO:
                paygo.efetuaTransacao(Operacoes.CANCELAMENTO, params);
                break;
            case CONFIGURACAO:
                paygo.efetuaTransacao(Operacoes.ADMINISTRATIVA, params);
                break;
        }
    }


    public void runMsitef(Acao acaoSelecionada, Map<String, Object> params) {
        //Parâmetros de configuração do M-Sitef.
        intentToMsitef.putExtra("empresaSitef", "00000000");

        final String enderecoSitef = (String) params.get("enderecoSitef");

        assert enderecoSitef != null;
        intentToMsitef.putExtra("enderecoSitef", enderecoSitef);
        intentToMsitef.putExtra("operador", "0001");
        intentToMsitef.putExtra("data", "20200324");
        intentToMsitef.putExtra("hora", "130358");
        intentToMsitef.putExtra("numeroCupom", String.valueOf(new Random().nextInt(99999)));

        final String valor = (String) params.get("valor");

        assert valor != null;
        intentToMsitef.putExtra("valor", valor);

        intentToMsitef.putExtra("CNPJ_CPF", "03654119000176");
        intentToMsitef.putExtra("comExterna", "0");

        switch (acaoSelecionada) {
            case VENDA:
                final FormaPagamento formaPagamentoSelecionada = FormaPagamento.fromRotulo((String) params.get("formaPagamento"));

                intentToMsitef.putExtra("modalidade", getSelectedPaymentCode(formaPagamentoSelecionada));

                switch (formaPagamentoSelecionada) {
                    case CREDITO:

                        final String numParcelas = (String) params.get("numParcelas");

                        assert numParcelas != null;
                        intentToMsitef.putExtra("numParcelas", numParcelas);

                        final FormaFinanciamento formaFinanciamentoSelecionada = FormaFinanciamento.fromRotulo((String) params.get("formaFinanciamento"));
                        switch (formaFinanciamentoSelecionada) {
                            case A_VISTA:
                                intentToMsitef.putExtra("transacoesHabilitadas", "26");
                                break;
                            case LOJA:
                                intentToMsitef.putExtra("transacoesHabilitadas", "27");
                                break;
                            case ADM:
                                intentToMsitef.putExtra("transacoesHabilitadas", "28");
                                break;
                        }
                        break;
                    case DEBITO:
                        intentToMsitef.putExtra("transacoesHabilitadas", "16");
                        intentToMsitef.putExtra("numParcelas", "");
                        break;
                }
                break;
            case CANCELAMENTO:
                intentToMsitef.putExtra("modalidade", "200");
                intentToMsitef.putExtra("transacoesHabilitadas", "");
                intentToMsitef.putExtra("isDoubleValidation", "0");
                intentToMsitef.putExtra("restricoes", "");
                intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm");
                break;
            case CONFIGURACAO:
                intentToMsitef.putExtra("modalidade", "110");
                intentToMsitef.putExtra("isDoubleValidation", "0");
                intentToMsitef.putExtra("restricoes", "");
                intentToMsitef.putExtra("transacoesHabilitadas", "");
                intentToMsitef.putExtra("caminhoCertificadoCA", "ca_cert_perm");
                intentToMsitef.putExtra("restricoes", "transacoesHabilitadas=16;26;27");
                break;
        }
        startActivityForResult(intentToMsitef, REQUEST_CODE_MSITEF);
    }


    //Còdigo para a forma de pagamento selecionada.
    public String getSelectedPaymentCode(FormaPagamento formaPagamentoSelecionada) {
        switch (formaPagamentoSelecionada) {
            case CREDITO:
                return "3";
            case DEBITO:
                return "2";
            default: //case "Todos"
                return "0";
        }
    }

    public void runElginTef(Acao acaoSelecionada, Map<String, Object> params) {
        final String valor = (String) params.get("valor");

        assert valor != null;
        intentToElginTef.putExtra("valor", valor);

        switch (acaoSelecionada) {
            case VENDA:
                final FormaPagamento formaPagamentoSelecionada = FormaPagamento.fromRotulo((String) params.get("formaPagamento"));

                intentToElginTef.putExtra("modalidade", getSelectedPaymentCode(formaPagamentoSelecionada));

                switch (formaPagamentoSelecionada) {
                    case CREDITO:
                        final String numParcelas = (String) params.get("numParcelas");

                        assert numParcelas != null;
                        intentToElginTef.putExtra("numParcelas", numParcelas);

                        final FormaFinanciamento formaFinanciamentoSelecionada = FormaFinanciamento.fromRotulo((String) params.get("formaFinanciamento"));
                        switch (formaFinanciamentoSelecionada) {
                            case A_VISTA:
                                intentToElginTef.putExtra("transacoesHabilitadas", "26");
                                break;
                            case LOJA:
                                intentToElginTef.putExtra("transacoesHabilitadas", "27");
                                Log.d("AQUI", "being called!");
                                break;
                            case ADM:
                                intentToElginTef.putExtra("transacoesHabilitadas", "28");
                                break;
                        }
                        break;
                    case DEBITO:
                        intentToElginTef.putExtra("transacoesHabilitadas", "16");
                        intentToElginTef.putExtra("numParcelas", "");
                        break;
                }
                break;
            case CANCELAMENTO:
                intentToElginTef.putExtra("modalidade", "200");

                //Data do dia de hoje, usada como um dos parâmetros necessário para o cancelamento de transação no TEF Elgin.
                Date todayDate = new Date();

                //Objeto capaz de formatar a date para o formato aceito pelo Elgin TEF ("aaaaMMdd") (20220923).
                SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyyMMdd");

                final String todayDateAsString = dateFormatter.format(todayDate);

                intentToElginTef.putExtra("data", todayDateAsString);


                final String ultimoNSU = (String) params.get("ultimoNSU");
                assert ultimoNSU != null;

                intentToElginTef.putExtra("NSU_SITEF", ultimoNSU);
                break;
        }


        Bundle bundle = intentToElginTef.getExtras();
        if (bundle != null) {
            for (String key : bundle.keySet()) {
                Log.e("MADARA", key + " : " + (bundle.get(key) != null ? bundle.get(key) : "NULL"));
            }
        }
        startActivityForResult(intentToElginTef, REQUEST_CODE_ELGINTEF);
    }

    public void formatActionBridge(Map map) {
        try {

            String action = (String) map.get("typeBridge");

            String bridgeReturn = "";

            switch (requireNonNull(action)) {
                case "IniciaVendaDebito": {
                    int idTransacao = (int) map.get("idTransacao");
                    String pdv = (String) map.get("pdv");
                    String valorTotal = (String) map.get("valorTotal");

                    bridgeReturn = bridgeService.IniciaVendaDebito(idTransacao, pdv, valorTotal);
                    resultFlutter.success(bridgeReturn);

                    break;
                }
                case "IniciaVendaCredito": {
                    int idTransacao = (int) map.get("idTransacao");
                    String pdv = (String) map.get("pdv");
                    String valorTotal = (String) map.get("valorTotal");
                    int tipoFinanciamento = (int) map.get("tipoFinanciamento");
                    int numeroParcelas = (int) map.get("numeroParcelas");

                    bridgeReturn = bridgeService.IniciaVendaCredito(idTransacao, pdv, valorTotal, tipoFinanciamento, numeroParcelas);
                    resultFlutter.success(bridgeReturn);

                    break;
                }
                case "IniciaCancelamentoVenda": {
                    int idTransacao = (int) map.get("idTransacao");
                    String pdv = (String) map.get("pdv");
                    String valorTotal = (String) map.get("valorTotal");
                    String dataHora = (String) map.get("dataHora");
                    String nsu = (String) map.get("nsu");

                    bridgeReturn = bridgeService.IniciaCancelamentoVenda(idTransacao, pdv, valorTotal, dataHora, nsu);
                    resultFlutter.success(bridgeReturn);

                    break;
                }
                case "IniciaOperacaoAdministrativa": {
                    int idTransacao = (int) map.get("idTransacao");
                    String pdv = (String) map.get("pdv");
                    int operacao = (int) map.get("operacao");

                    bridgeReturn = bridgeService.IniciaOperacaoAdministrativa(idTransacao, pdv, operacao);
                    resultFlutter.success(bridgeReturn);
                    break;
                }
                case "ImprimirCupomNfce": {
                    String xml = (String) map.get("xml");
                    int indexcsc = (int) map.get("indexcsc");
                    String csc = (String) map.get("csc");

                    bridgeReturn = bridgeService.ImprimirCupomNfce(xml, indexcsc, csc);
                    resultFlutter.success(bridgeReturn);
                    break;
                }
                case "ImprimirCupomSat": {
                    String xml = (String) map.get("xml");

                    bridgeReturn = bridgeService.ImprimirCupomSat(xml);
                    resultFlutter.success(bridgeReturn);
                    break;
                }
                case "ImprimirCupomSatCancelamento": {
                    String xml = (String) map.get("xml");
                    String assQRCode = (String) map.get("assQRCode");

                    bridgeReturn = bridgeService.ImprimirCupomSatCancelamento(xml, assQRCode);
                    resultFlutter.success(bridgeReturn);
                    break;
                }
                case "SetSenha": {
                    String senha = (String) map.get("senha");
                    Boolean habilitada = (Boolean) map.get("habilitada");

                    bridgeReturn = bridgeService.SetSenha(senha, habilitada);
                    resultFlutter.success(bridgeReturn);
                    break;
                }
                case "ConsultarStatus":
                    bridgeReturn = bridgeService.ConsultarStatus();
                    resultFlutter.success(bridgeReturn);

                    break;
                case "GetTimeout":
                    bridgeReturn = bridgeService.GetTimeout();
                    resultFlutter.success(bridgeReturn);
                    break;
                case "ConsultarUltimaTransacao": {
                    String pdv = (String) map.get("pdv");

                    bridgeReturn = bridgeService.ConsultarUltimaTransacao(pdv);
                    resultFlutter.success(bridgeReturn);
                    break;
                }
                case "SetSenharServer": {
                    String senha = (String) map.get("senha");
                    Boolean habilitada = (Boolean) map.get("habilitada");

                    bridgeReturn = bridgeService.SetSenhaServer(senha, habilitada);
                    resultFlutter.success(bridgeReturn);
                    break;
                }
                case "SetTimeout":
                    int timeout = (int) map.get("timeout");

                    bridgeReturn = bridgeService.SetTimeout(timeout);
                    resultFlutter.success(bridgeReturn);
                    break;
                case "GetServer":
                    bridgeReturn = bridgeService.GetServer();
                    resultFlutter.success(bridgeReturn);
                    break;
                case "SetServer":
                    String ipTerminal = (String) map.get("ipTerminal");
                    int portaTransacao = (int) map.get("portaTransacao");
                    int portaStatus = (int) map.get("portaStatus");

                    bridgeReturn = bridgeService.SetServer(ipTerminal, portaTransacao, portaStatus);
                    resultFlutter.success(bridgeReturn);
                    break;
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

    private void formatActionNFCE(Map map) {
        final String typeNFCE = (String) map.get("typeNFCE");
        Log.d("DEBUG", typeNFCE);

        if (typeNFCE.equals(FunctionsNfce.CONFIGURATE_XML_NFCE.name())) configurateXmlNfce();
        else sendSaleNfce(map);
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
        try {
            it4rObj.configurarXmlNfce();
            resultFlutter.success("Success");
        } catch (DarumaException e) {
            e.printStackTrace();
            resultFlutter.success("Error");
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

        //Os TEFs MSitef e TEF Elgin possuem o mesmo retorno.
        if (requestCode == REQUEST_CODE_MSITEF || requestCode == REQUEST_CODE_ELGINTEF) {


            //Se resultCode da intent for OK então a transação obteve sucesso.
            //Caso o resultCode da intent for de atividade cancelada e a data estiver diferente de nulo, é possível obter um retorno também.
            if (resultCode == RESULT_OK || (resultCode == RESULT_CANCELED && data != null)) {

                //O campos são os mesmos para ambos os TEFs.
                final String COD_AUTORIZACAO = data.getStringExtra("COD_AUTORIZACAO");
                final String VIA_ESTABELECIMENTO = data.getStringExtra("VIA_ESTABELECIMENTO");
                final String COMP_DADOS_CONF = data.getStringExtra("COMP_DADOS_CONF");
                final String BANDEIRA = data.getStringExtra("BANDEIRA");
                final String NUM_PARC = data.getStringExtra("NUM_PARC");
                final String RELATORIO_TRANS = data.getStringExtra("RELATORIO_TRANS");
                final String REDE_AUT = data.getStringExtra("REDE_AUT");
                final String NSU_SITEF = data.getStringExtra("NSU_SITEF");
                final String VIA_CLIENTE = data.getStringExtra("VIA_CLIENTE");
                final String TIPO_PARC = data.getStringExtra("TIPO_PARC");
                final String CODRESP = data.getStringExtra("CODRESP");
                final String NSU_HOST = data.getStringExtra("NSU_HOST");

                Log.d("MADARA", COD_AUTORIZACAO + " " + VIA_ESTABELECIMENTO + " " + VIA_CLIENTE + " " + NSU_HOST);

                //Se o código de resposta estiver nulo ou tiver valor inteiro inferior a 0, a transação não ocorreu como esperado.
                if (CODRESP == null || Integer.parseInt(CODRESP) < 0) {
                    resultFlutter.success("transaction_error");
                } else {

                    //Cria o JSON com todos os retornos, insere todos os campos e envia de volta ao Flutter em String.
                    JSONObject returnJsonObject = new JSONObject();

                    try {
                        returnJsonObject.put("COD_AUTORIZACAO", COD_AUTORIZACAO);
                        returnJsonObject.put("VIA_ESTABELECIMENTO", VIA_ESTABELECIMENTO);
                        returnJsonObject.put("COMP_DADOS_CONF", COMP_DADOS_CONF);
                        returnJsonObject.put("BANDEIRA", BANDEIRA);
                        returnJsonObject.put("NUM_PARC", NUM_PARC);
                        returnJsonObject.put("RELATORIO_TRANS", RELATORIO_TRANS);
                        returnJsonObject.put("REDE_AUT", REDE_AUT);
                        returnJsonObject.put("NSU_SITEF", NSU_SITEF);
                        returnJsonObject.put("VIA_CLIENTE", VIA_CLIENTE);
                        returnJsonObject.put("TIPO_PARC", TIPO_PARC);
                        returnJsonObject.put("CODRESP", CODRESP);
                        returnJsonObject.put("NSU_HOST", NSU_HOST);

                        resultFlutter.success(returnJsonObject.toString());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        }

//        if (requestCode == 4321) {
//            if (resultCode == RESULT_OK || resultCode == RESULT_CANCELED && data != null) {
//                resultFlutter.success(bundleToJson(data));
//            } else {
//                resultFlutter.notImplemented();
//            }
//        }
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

    public enum FunctionsNfce {CONFIGURATE_XML_NFCE, SEND_SALE_NFCE}
}
