package com.elgin.e1.testee1intentservice;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.Random;

public class MainActivity extends AppCompatActivity {

    private Context mContext;

    // REQUEST CODES
    //////////////////////////////////////////////////
    private int requestCodeScanner      = 0;
    private int requestCodeImpressora   = 1;
    private int requestCodeEtiqueta     = 2;
    private int requestCodeSAT          = 3;
    private int requestCodePagamento    = 4;
    private int requestCodeCancelamento = 5;
    private int requestCodeReimpEstab   = 6;
    private int requestCodeReimpCliente = 7;
    private int requestCodeBalanca      = 8;

    // CONFIGURACAO DA IMPRESSORA DE ETIQUETAS / SAT
    //////////////////////////////////////////////////
    private final String TIPO           = "3";
    private final String MODELO         = "L42PRO";
    private final String CONEXAO        = "192.168.10.98";
    private final String PARAM          = "9100";
    private final String COD_ATIVACAO   = "00000000"; // CodAtivacao do SAT

    // ALGUNS JSONs...
    //////////////////////////////////////////////////
    private final String OPEN_SMART     = "{\"Modulo\": \"Impressor\",\"Comando\": [{\"Funcao\": \"AbreConexaoImpressora\",\"Parametros\": [{\"tipo\": 5,\"modelo\": \"SmartPOS\",\"conexao\": \"\",\"parametro\": 0}]}]}";
    private final String OPEN_M8        = "{\"Modulo\": \"Impressor\",\"Comando\": [{\"Funcao\": \"AbreConexaoImpressora\",\"Parametros\": [{\"tipo\": 6,\"modelo\": \"M8\",\"conexao\": \"\",\"parametro\": 0}]}]}";
    private final String PRINT_TEXTO    = "{\"Modulo\": \"Impressor\",\"Comando\": [{\"Funcao\": \"ImpressaoTexto\",\"Parametros\": [{\"dados\": \"Teste Impressao\\n\",\"posicao\": 2,\"stilo\": 8,\"tamanho\": 17}]}]}";
    private final String PRINT_QR       = "{\"Modulo\": \"Impressor\",\"Comando\": [{\"Funcao\": \"ImpressaoQRCode\",\"Parametros\": [{\"dados\": \"Teste QRCode\",\"tamanho\": 4,\"nivelCorrecao\": 3}]}]}";
    private final String CLOSE          = "{\"Modulo\": \"Impressor\",\"Comando\": [{\"Funcao\": \"FechaConexaoImpressora\",\"Parametros\": [{}]}]}";

    private final String TESTE          = String.format("{\"Modulo\": \"Etiqueta\",\"Comando\": [{\"Funcao\": \"Teste\",\"Parametros\": [{\"tipo\": %s,\"modelo\": \"%s\",\"conexao\": \"%s\",\"param\": %s}]}]}", TIPO, MODELO, CONEXAO, PARAM);
    private final String ET_1           = String.format("{\"Modulo\": \"Etiqueta\",\"Comando\": [{\"Funcao\": \"Limpa\",\"Parametros\": [{\"keepProps\": 0}]},{\"Funcao\": \"GerarBox\",\"Parametros\": [{\"coordY\": 5,\"coordX\": 100,\"comprimento\": 813,\"altura\": 267,\"grosBordasH\": 5,\"grosBordasV\": 5}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 1,\"multH\": 2,\"multV\": 5,\"coordY\": 155,\"coordX\": 117,\"texto\" : \"ARROZ 5KG\"}]},{\"Funcao\": \"GerarBarCode1D\",\"Parametros\": [{\"rotacao\": 1,\"tipo\": 3,\"largBarrasL\": 6,\"largBarrasE\": 3,\"altura\": 100,\"coordY\": 35,\"coordX\": 290,\"codigo\": \"123456\",\"exibirStr\": 0}]},{\"Funcao\": \"Imprime\",\"Parametros\": [{\"tipo\": %s,\"modelo\": \"%s\",\"conexao\": \"%s\",\"param\": %s}]}]}", TIPO, MODELO, CONEXAO, PARAM);
    private final String ET_2           = String.format("{\"Modulo\": \"Etiqueta\",\"Comando\": [{\"Funcao\": \"Limpa\",\"Parametros\": [{\"keepProps\": 0}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 2,\"multH\": 1,\"multV\": 1,\"coordY\": 196,\"coordX\": 10,\"texto\" : \"1234567890 PRODUTO TE\"}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 2,\"multH\": 1,\"multV\": 1,\"coordY\": 171,\"coordX\": 10,\"texto\" : \"STE VENDE DE MAIS EST\"}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 2,\"multH\": 1,\"multV\": 1,\"coordY\": 146,\"coordX\": 10,\"texto\" : \"E PRODUTO DE TESTE 01\"}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 4,\"multH\": 1,\"multV\": 1,\"coordY\": 95,\"coordX\": 10,\"texto\" : \"R$ 9499,99\"}]},{\"Funcao\": \"GerarBarCode1D\",\"Parametros\": [{\"rotacao\": 1,\"tipo\": 4,\"largBarrasL\": 1,\"largBarrasE\": 2,\"altura\": 65,\"coordY\": 0,\"coordX\": 10,\"codigo\": \"789456\",\"exibirStr\": 1}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 2,\"multH\": 1,\"multV\": 1,\"coordY\": 196,\"coordX\": 360,\"texto\" : \"1234567890 PRODUTO TE\"}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 2,\"multH\": 1,\"multV\": 1,\"coordY\": 171,\"coordX\": 360,\"texto\" : \"STE VENDE DE MAIS EST\"}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 2,\"multH\": 1,\"multV\": 1,\"coordY\": 146,\"coordX\": 360,\"texto\" : \"E PRODUTO DE TESTE 01\"}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 4,\"multH\": 1,\"multV\": 1,\"coordY\": 95,\"coordX\": 360,\"texto\" : \"R$ 9499,99\"}]},{\"Funcao\": \"GerarBarCode1D\",\"Parametros\": [{\"rotacao\": 1,\"tipo\": 4,\"largBarrasL\": 1,\"largBarrasE\": 2,\"altura\": 65,\"coordY\": 0,\"coordX\": 360,\"codigo\": \"789456\",\"exibirStr\": 1}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 2,\"multH\": 1,\"multV\": 1,\"coordY\": 196,\"coordX\": 710,\"texto\" : \"1234567890 PRODUTO TE\"}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 2,\"multH\": 1,\"multV\": 1,\"coordY\": 171,\"coordX\": 710,\"texto\" : \"STE VENDE DE MAIS EST\"}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 2,\"multH\": 1,\"multV\": 1,\"coordY\": 146,\"coordX\": 710,\"texto\" : \"E PRODUTO DE TESTE 01\"}]},{\"Funcao\": \"GerarTexto\",\"Parametros\": [{\"rotacao\": 1,\"fonte\": 4,\"multH\": 1,\"multV\": 1,\"coordY\": 95,\"coordX\": 710,\"texto\" : \"R$ 9499,99\"}]},{\"Funcao\": \"GerarBarCode1D\",\"Parametros\": [{\"rotacao\": 1,\"tipo\": 4,\"largBarrasL\": 1,\"largBarrasE\": 2,\"altura\": 65,\"coordY\": 0,\"coordX\": 710,\"codigo\": \"789456\",\"exibirStr\": 1}]},{\"Funcao\": \"Imprime\",\"Parametros\": [{\"tipo\": %s,\"modelo\": \"%s\",\"conexao\": \"%s\",\"param\": %s}]}]}", TIPO, MODELO, CONEXAO, PARAM);

    private final String CONSULTA       = "{\"Modulo\": \"SAT\",\"Comando\": [{\"Funcao\": \"ConsultarSat\",\"Parametros\": [{\"numSessao\": __NUM_SESSAO__}]}]}";
    private final String STATUS_OPER    = String.format("{\"Modulo\": \"SAT\",\"Comando\": [{\"Funcao\": \"ConsultarStatusOperacional\",\"Parametros\": [{\"numSessao\": __NUM_SESSAO__,\"codAtivacao\": \"%s\"}]}]}", COD_ATIVACAO);
    private final String VENDA          = String.format("{\"Modulo\": \"SAT\",\"Comando\": [{\"Funcao\": \"EnviarDadosVenda\",\"Parametros\": [{\"numSessao\": __NUM_SESSAO__,\"codAtivacao\": \"%s\",\"dadosVenda\": \"<?xml version=\\\"1.0\\\"?> <CFe> <infCFe versaoDadosEnt=\\\"0.07\\\"> <ide><CNPJ>16716114000172</CNPJ><signAC>SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT</signAC><numeroCaixa>001</numeroCaixa> </ide><emit><CNPJ>14200166000166</CNPJ><IE>111111111111</IE><indRatISSQN>N</indRatISSQN></emit><dest></dest><det nItem=\\\"1\\\"> <prod> <cProd>00000000000001</cProd> <xProd>PRODUTO NFCE 1</xProd> <NCM>94034000</NCM> <CFOP>5102</CFOP> <uCom>UN</uCom> <qCom>1.0000</qCom> <vUnCom>3.51</vUnCom> <indRegra>T</indRegra> </prod> <imposto> <ICMS><ICMS00><Orig>0</Orig><CST>00</CST><pICMS>7.00</pICMS></ICMS00> </ICMS><PIS><PISAliq><CST>01</CST><vBC>6.51</vBC><pPIS>0.0165</pPIS></PISAliq> </PIS> <COFINS><COFINSAliq><CST>01</CST><vBC>6.51</vBC><pCOFINS>0.0760</pCOFINS></COFINSAliq> </COFINS> </imposto> </det> <total><DescAcrEntr><vDescSubtot>0.51</vDescSubtot></DescAcrEntr><vCFeLei12741>0.56</vCFeLei12741></total><pgto> <MP> <cMP>01</cMP> <vMP>6.51</vMP> </MP></pgto><infAdic> <infCpl>Trib aprox R$ 0,36 federal, R$ 1,24 estadual e R$ 0,00 municipal&lt;br&gt;CAIXA: 001 OPERADOR: ROOT</infCpl></infAdic></infCFe></CFe>\"}]}]}", COD_ATIVACAO);

    private final String BALANCA        = "{\"Modulo\": \"Balanca\",\"Comando\": [{\"Funcao\": \"ConfigurarModeloBalanca\",\"Parametros\": [{\"modeloBalanca\": 1}]},{\"Funcao\": \"ObterModeloBalanca\",\"Parametros\": [{}]}]}";


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mContext = this.getApplicationContext();


        Button btnScanner = findViewById(R.id.btnScanner);
        final EditText txtEnviar = findViewById(R.id.txtEnviar);
        Button btnEnviarImp = findViewById(R.id.btnEnviarImp);
        Button btnEnviarEt = findViewById(R.id.btnEnviarEt);
        Button btnEnviarSAT = findViewById(R.id.btnEnviarSAT);

        Button btnSmart = findViewById(R.id.btnSmart);
        Button btnM8 = findViewById(R.id.btnM8);
        Button btnTexto = findViewById(R.id.btnTexto);
        Button btnQR = findViewById(R.id.btnQR);
        Button btnFecha = findViewById(R.id.btnFecha);

        Button btnTeste = findViewById(R.id.btnTeste);
        Button btnEt1 = findViewById(R.id.btnEt1);
        Button btnEt2 = findViewById(R.id.btnEt2);

        Button btnConsulta = findViewById(R.id.btnConsulta);
        Button btnStatusOper = findViewById(R.id.btnStatusOper);
        Button btnVenda = findViewById(R.id.btnVenda);

        Button btnPagDeb = findViewById(R.id.btnPagDeb);
        Button btnCanc = findViewById(R.id.btnCanc);
//        Button btnReimpEst = findViewById(R.id.btnReimpEst);
//        Button btnReimpCli = findViewById(R.id.btnReimpCli);

        Button btnBalanca = findViewById(R.id.btnBalanca);


        btnScanner.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent iScanner = new Intent("com.elgin.e1.intentservice.LEITOR");
                startActivityForResult(iScanner, requestCodeScanner);
            }
        });

        btnEnviarImp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(txtEnviar.getText().toString(), requestCodeImpressora, false);
            }
        });

        btnEnviarEt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(txtEnviar.getText().toString(), requestCodeEtiqueta, false);
            }
        });

        btnEnviarSAT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(txtEnviar.getText().toString(), requestCodeSAT, false);
            }
        });


        btnSmart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(OPEN_SMART, requestCodeImpressora, true);
            }
        });

        btnM8.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(OPEN_M8, requestCodeImpressora, true);
            }
        });

        btnTexto.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(PRINT_TEXTO, requestCodeImpressora, true);
            }
        });

        btnQR.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(PRINT_QR, requestCodeImpressora, true);
            }
        });

        btnFecha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(CLOSE, requestCodeImpressora, true);
            }
        });


        btnTeste.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(TESTE, requestCodeEtiqueta, true);
            }
        });

        btnEt1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(ET_1, requestCodeEtiqueta, true);
            }
        });

        btnEt2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(ET_2, requestCodeEtiqueta, true);
            }
        });


        btnConsulta.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(putNumSessao(CONSULTA), requestCodeSAT, true);
            }
        });

        btnStatusOper.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(putNumSessao(STATUS_OPER), requestCodeSAT, true);
            }
        });

        btnVenda.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(putNumSessao(VENDA), requestCodeSAT, true);
            }
        });


        btnPagDeb.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                // DEBITO
                String entradatransacao = String.format("{\"operacao\":1,\"identificadortransacaoautomacao\":\"%s\",\"tipocartao\":2,\"valortotal\":1.00}", Integer.toString(new Random().nextInt(100)));

                // CREDITO
                //String entradatransacao = String.format("{\"operacao\":1,\"identificadortransacaoautomacao\":\"%s\",\"tipocartao\":1,\"tipofinanciamento\":1,\"valortotal\":1.00}", Integer.toString(new Random().nextInt(100)));

                // CREDITO PARCELADO
                //String entradatransacao = String.format("{\"operacao\":1,\"identificadortransacaoautomacao\":\"%s\",\"tipocartao\":1,\"tipofinanciamento\":2,\"numeroparcelas\":3,\"valortotal\":3.00}", Integer.toString(new Random().nextInt(100)));

                String dadosautomacao = "{\"nomeautomacao\":\"ELGIN S/A\",\"versaoautomacao\":\"1.0\",\"empresaautomacao\":\"Empresa Elgin\",\"suportatroco\":false,\"suportadesconto\":false,\"suportaviasdiferenciadas\":true,\"suportaviareduzida\":false,\"suportaabatimentosaldovoucher\":false}";
                String personalizacao = "{\"corfundotela\":\"#0099CC\",\"corfundotoolbar\":\"#F6F6F6\",\"corfonte\":\"#F6F6F6\"}";

                Intent intentPagamento = new Intent("com.elgin.e1.intentservice.PAGAMENTO");

                intentPagamento.putExtra("acao", "1");
                intentPagamento.putExtra("entradatransacao", entradatransacao);
                intentPagamento.putExtra("dadosautomacao", dadosautomacao);
                intentPagamento.putExtra("personalizacao", personalizacao);

                startActivityForResult(intentPagamento, requestCodePagamento);
            }
        });

        btnCanc.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                String entradatransacao = String.format("{\"operacao\":4,\"identificadortransacaoautomacao\":\"%s\",\"tipocartao\":1,\"tipofinanciamento\":1,\"valortotal\":1.00}", Integer.toString(new Random().nextInt(100)));
                String dadosautomacao = "{\"nomeautomacao\":\"ELGIN S/A\",\"versaoautomacao\":\"1.0\",\"empresaautomacao\":\"Empresa Elgin\",\"suportatroco\":false,\"suportadesconto\":false,\"suportaviasdiferenciadas\":true,\"suportaviareduzida\":false,\"suportaabatimentosaldovoucher\":false}";
                String personalizacao = "{\"corfundotela\":\"#0099CC\",\"corfundotoolbar\":\"#F6F6F6\",\"corfonte\":\"#F6F6F6\"}";

                Intent intentPagamento = new Intent("com.elgin.e1.intentservice.PAGAMENTO");

                intentPagamento.putExtra("acao", "2");
                intentPagamento.putExtra("entradatransacao", entradatransacao);
                intentPagamento.putExtra("dadosautomacao", dadosautomacao);
                intentPagamento.putExtra("personalizacao", personalizacao);

                startActivityForResult(intentPagamento, requestCodeCancelamento);
            }
        });

//        btnReimpEst.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//
//                Intent intentPagamento = new Intent("com.elgin.e1.intentservice.PAGAMENTO");
//                intentPagamento.putExtra("acao", "3");
//                startActivityForResult(intentPagamento, requestCodeReimpEstab);
//            }
//        });
//
//        btnReimpCli.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//
//                Intent intentPagamento = new Intent("com.elgin.e1.intentservice.PAGAMENTO");
//                intentPagamento.putExtra("acao", "4");
//                startActivityForResult(intentPagamento, requestCodeReimpCliente);
//            }
//        });


        btnBalanca.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myPrinterAction(BALANCA, requestCodeBalanca, true);
                //myPrinterAction(txtEnviar.getText().toString(), requestCodeBalanca, false);
            }
        });
    }


    private void myPrinterAction(String text, int modulo, boolean json) {

        Intent iPrinter;
        if (modulo == requestCodeImpressora) {
            iPrinter = new Intent("com.elgin.e1.intentservice.IMPRESSAO");
        } else if (modulo == requestCodeEtiqueta) {
            iPrinter = new Intent("com.elgin.e1.intentservice.ETIQUETA");
        } else if (modulo == requestCodeSAT) {
            iPrinter = new Intent("com.elgin.e1.intentservice.SAT");
        } else if (modulo == requestCodeBalanca) {
            iPrinter = new Intent("com.elgin.e1.intentservice.BALANCA");
        } else {
            iPrinter = null;
        }

        if (json) {
            text = text.replace("\n", " ");
            text = text.replace("\t", "");

            iPrinter.putExtra("direta", text);

        } else {
            String fileName = text.isEmpty() ? "Download/arquivo.json" : text;
            File file = new File(Environment.getExternalStorageDirectory(), fileName);

            try {
                iPrinter.putExtra("arquivo", file.getCanonicalPath());
            } catch (IOException e) {
                Toast.makeText(mContext, e.getMessage(), Toast.LENGTH_SHORT).show();
                e.printStackTrace();
                return;
            }
        }

//        if (modulo == requestCodeSAT) {
//            Intent iService = new Intent("br.com.elgin.sat.SERVICO");
//            iService.setPackage(this.getPackageName());
//            startService(iService);
//        }
        startActivityForResult(iPrinter, modulo);
    }


    private String putNumSessao(String JSON) {
        return JSON.replace("__NUM_SESSAO__", Integer.toString(new Random().nextInt(1_000_000)));
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {

        super.onActivityResult(requestCode, resultCode, data);

        String mensagem = "";
        if (requestCode == requestCodeScanner) {

            if (resultCode == RESULT_OK) {
                if (data.getStringExtra("retorno").equals("0")) {
                    mensagem = "Erro na leitura.";
                } else {
                    mensagem = String.format(
                            "Leitura realizada com sucesso:\n\nTipo: %s\nCódigo: %s",
                            data.getStringExtra("tipo"),
                            data.getStringExtra("codigobarras")
                    );
                }
            } else {
                mensagem = "Leitura cancelada.";
            }

        } else if (requestCode == requestCodeImpressora) {

            if (data.getStringExtra("retorno").equals("0")) {
                mensagem = (!data.hasExtra("erro"))?"Erro na impressão.":"Erro na impressão:\n\n" + data.getStringExtra("erro");
            } else {
                mensagem = "Impressão realizada com sucesso.";
            }

        } else if (requestCode == requestCodeEtiqueta) {

            if (data.getStringExtra("retorno").equals("0")) {
                mensagem = (!data.hasExtra("erro"))?"Erro na impressão.":"Erro na impressão:\n\n" + data.getStringExtra("erro");
            } else {
                mensagem = "Impressão realizada com sucesso.";
                if (data.hasExtra("mensagem")) {
                    mensagem += "\n" + data.getStringExtra("mensagem");
                }
            }

        } else if (requestCode == requestCodeSAT) {

            if (data.getStringExtra("retorno").equals("0")) {
                mensagem = (!data.hasExtra("erro"))?"Erro no SAT.":"Erro no SAT:\n\n" + data.getStringExtra("erro");
            } else {
                mensagem = data.getStringExtra("mensagem");
            }

        } else if (requestCode == requestCodePagamento || requestCode == requestCodeCancelamento) {

            String aux;
            JSONObject saidaTransacao;

            if (resultCode == RESULT_OK) {
                if (data.getStringExtra("retorno").equals("1")) {
                    aux = data.getStringExtra("mensagem");

                    try {
                        saidaTransacao = new JSONObject(data.getStringExtra("saidatransacao"));

                        if (requestCode == requestCodePagamento) {
                            mensagem = "Autorizada (" + aux + "):\n\n" + saidaTransacao.getString("comprovanteDiferenciadoLoja");
                        } else {
                            mensagem = "Autorizada (" + aux + "):\n\n" + data.getStringExtra("saidatransacao");
                        }
                    } catch (JSONException | NullPointerException e) {
                        e.printStackTrace();
                        mensagem = "Erro ao parsear JSON de saída";
                    }
                } else {
                    aux = data.getStringExtra("erro");
                }

                if (data.getStringExtra("retorno").equals("0")) {
                    mensagem = "Erro na transação:\n\n" + aux;
                }
            } else {
                mensagem = "Pagamento cancelado!";
            }

        } else if (requestCode == requestCodeReimpEstab || requestCode == requestCodeReimpCliente) {

            if (resultCode == RESULT_OK) {
                if (data.getStringExtra("retorno").equals("1")) {
                    mensagem = "Impressão realizada com sucesso!";
                } else {
                    mensagem = "Erro:\n\n" + data.getStringExtra("erro");
                }
            }

        } else if (requestCode == requestCodeBalanca) {

            if (data.getStringExtra("retorno").equals("0")) {
                mensagem = (!data.hasExtra("erro")) ? "Erro ao consultar balança." : "Erro ao consultar balança:\n\n" + data.getStringExtra("erro");
            } else {
                mensagem = "Balança consultada com sucesso.";
                if (data.hasExtra("mensagem")) {
                    mensagem += "\n" + data.getStringExtra("mensagem");
                }
            }

        }

        // EXIBE ALERTA
        AlertDialog alertDialog = new AlertDialog.Builder(MainActivity.this).create();
        alertDialog.setMessage(mensagem);
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });

        alertDialog.show();
    }
}
