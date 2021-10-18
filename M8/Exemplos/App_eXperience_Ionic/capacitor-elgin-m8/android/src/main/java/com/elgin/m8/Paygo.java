package com.elgin.m8;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

import br.com.setis.interfaceautomacao.Cartoes;
import br.com.setis.interfaceautomacao.Confirmacoes;
import br.com.setis.interfaceautomacao.DadosAutomacao;
import br.com.setis.interfaceautomacao.Financiamentos;
import br.com.setis.interfaceautomacao.ModalidadesPagamento;
import br.com.setis.interfaceautomacao.Operacoes;
import br.com.setis.interfaceautomacao.EntradaTransacao;
import br.com.setis.interfaceautomacao.Personalizacao;
import br.com.setis.interfaceautomacao.SaidaTransacao;
import br.com.setis.interfaceautomacao.StatusTransacao;
import br.com.setis.interfaceautomacao.Transacoes;
import br.com.setis.interfaceautomacao.Versoes;
import br.com.setis.interfaceautomacao.ViasImpressao;

public class Paygo {
    private Activity mainActivity;

    private SaidaTransacao mSaidaTransacao;
    private DadosAutomacao mDadosAutomacao;
    private Transacoes mTransacoes;
    private Confirmacoes mConfirmacao;
    private EntradaTransacao mEntradaTransacao = null;
    private Personalizacao mPersonalizacao;
    private Versoes versoes;
    private Handler mHandler;

    private static PluginCall paygoCall;

    public Paygo(Activity activity){
        mainActivity = activity;
        IniciaClassesInterface(false, false, false, false);
        mHandler = new Handler();
    }

    public void setPluginCall(PluginCall call){
        paygoCall = call;
    }

    private final Runnable mostraJanelaResultado = new Runnable() {//region
        public void run() {
            Map<String, Object> mapValues = new HashMap<>();

            String retorno = mSaidaTransacao.obtemMensagemResultado();
            String via_cliente = "";


            if(mSaidaTransacao.obtemInformacaoConfirmacao()) {
                mConfirmacao.informaStatusTransacao(StatusTransacao.CONFIRMADO_AUTOMATICO);
                mTransacoes.confirmaTransacao(mConfirmacao);

                ViasImpressao vias = mSaidaTransacao.obtemViasImprimir();
                System.out.println("VIAS: " + vias.equals("VIA_NENHUMA"));

                //Imprime a via do cliente
                if ( vias == ViasImpressao.VIA_CLIENTE || vias == ViasImpressao.VIA_CLIENTE_E_ESTABELECIMENTO) {
                    via_cliente = mSaidaTransacao.obtemComprovanteGraficoPortador();
                }

                mapValues.put("retorno", retorno);
                mapValues.put("via_cliente", via_cliente);

                optionsReturnPaygo(mapValues);
            }
        }
    };

    public static void optionsReturnPaygo(Map map){
        Map<String, Object> mapValues = new HashMap<>();

        if(map.get("retorno").equals("Transacao autorizada")){
            String imageViaBase64 = (String) map.get("via_cliente");

           // byte[] decodedString = Base64.decode(imageViaBase64, Base64.DEFAULT);
          //  Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
           // imageViewViaPaygo.setImageBitmap(decodedByte);

            mapValues.put("quant", 10);
            mapValues.put("base64", imageViaBase64);

            JSObject ret = new JSObject();
            ret.put("via_cliente", imageViaBase64.replaceAll("\\s",""));

            m8PluginPlugin.printerInstance.imprimeCupomTEF(mapValues);
            m8PluginPlugin.printerInstance.AvancaLinhas(mapValues);
            m8PluginPlugin.printerInstance.cutPaper(mapValues);


            paygoCall.resolve(ret);
        }else{
            m8PluginPlugin.alertMessageStatus("Alert", map.get("retorno").toString());
            paygoCall.reject("PayGoError: " + map.get("retorno").toString());
        }

    }



    public void mostraResultadoTransacao(){
        String retorno = "";
        retorno = mSaidaTransacao.obtemMensagemResultado();

        if(mSaidaTransacao.obtemInformacaoConfirmacao()) {
            mConfirmacao.informaStatusTransacao(StatusTransacao.CONFIRMADO_AUTOMATICO);
            mTransacoes.confirmaTransacao(mConfirmacao);

            ViasImpressao vias = mSaidaTransacao.obtemViasImprimir();
            System.out.println("VIAS: " + vias.equals("VIA_NENHUMA"));

            //Imprime a via do cliente
            if ( vias == ViasImpressao.VIA_CLIENTE || vias == ViasImpressao.VIA_CLIENTE_E_ESTABELECIMENTO) {
                String via_cliente = mSaidaTransacao.obtemComprovanteGraficoPortador();
                retorno = via_cliente;
            }
        }
    }


    public void efetuaTransacao(Operacoes operacao, Map map){
        mEntradaTransacao = new EntradaTransacao(operacao, "1");

        if(!operacao.equals(Operacoes.ADMINISTRATIVA)){
            String valor = (String) map.get("valor");
            int parcelas = (Integer) map.get("parcelas");
            String formaPagamento = (String) map.get("formaPagamento");
            String tipoParcelamento = (String) map.get("tipoParcelamento");

            mEntradaTransacao.informaValorTotal(valor);

            if (operacao.equals(Operacoes.VENDA)) {
                mEntradaTransacao.informaDocumentoFiscal("1000");
            }

            mEntradaTransacao.informaModalidadePagamento(ModalidadesPagamento.PAGAMENTO_CARTAO);

            if(formaPagamento.equals("Crédito")){
                mEntradaTransacao.informaTipoCartao(Cartoes.CARTAO_CREDITO);
                mEntradaTransacao.informaNumeroParcelas(parcelas);

            }else if(formaPagamento.equals("Débito")){
                mEntradaTransacao.informaTipoCartao(Cartoes.CARTAO_DEBITO);
                mEntradaTransacao.informaNumeroParcelas(parcelas);

            }else{
                mEntradaTransacao.informaTipoCartao(Cartoes.CARTAO_DESCONHECIDO);
            }

            if(tipoParcelamento.equals("Loja")){
                mEntradaTransacao.informaTipoFinanciamento(Financiamentos.PARCELADO_ESTABELECIMENTO);

            }else if(tipoParcelamento.equals("Adm")){
                mEntradaTransacao.informaTipoFinanciamento(Financiamentos.PARCELADO_EMISSOR);

            }else{
                mEntradaTransacao.informaTipoFinanciamento(Financiamentos.A_VISTA);
            }

            mEntradaTransacao.informaNomeProvedor("DEMO");
            mEntradaTransacao.informaCodigoMoeda("986");
        }

        mConfirmacao = new Confirmacoes();

        new Thread(() -> {
            try {
                mDadosAutomacao.obtemPersonalizacaoCliente();
                mSaidaTransacao = mTransacoes.realizaTransacao(mEntradaTransacao);

                if(mSaidaTransacao == null)
                    return;

                mConfirmacao.informaIdentificadorConfirmacaoTransacao(
                        mSaidaTransacao.obtemIdentificadorConfirmacaoTransacao()
                );

                mEntradaTransacao = null;
            } catch (Exception e) {
                System.out.println("Exception" + e);
            }finally {
                mEntradaTransacao = null;
                if(mSaidaTransacao != null) {
                    mHandler.post(mostraJanelaResultado);
                }
            }
        }).start();
    }

    private void IniciaClassesInterface( boolean suportaViasDiferenciadas, boolean suportaViasReduzidas, boolean troco, boolean desconto ) {
        String versaoAutomacao;
        try {
            versaoAutomacao = mainActivity.getPackageManager().getPackageInfo(
                    mainActivity.getPackageName(), 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            versaoAutomacao = "Indisponivel";
        }

        mPersonalizacao = setPersonalizacao(false);

        mDadosAutomacao = new DadosAutomacao("Automacao Demo", versaoAutomacao,"SETIS",
                troco, desconto, suportaViasDiferenciadas, suportaViasReduzidas, true, mPersonalizacao);

        mTransacoes = Transacoes.obtemInstancia(mDadosAutomacao, mainActivity);
        versoes = mTransacoes.obtemVersoes();
    }

    private Personalizacao setPersonalizacao(boolean isInverse) {
        Personalizacao.Builder pb = new Personalizacao.Builder();

        try {
            if (isInverse) {
                pb.informaCorFonte( "#000000" );
                pb.informaCorFonteTeclado("#000000");
                pb.informaCorFundoCaixaEdicao("#FFFFFF");
                pb.informaCorFundoTela("#F4F4F4");
                pb.informaCorFundoTeclado("#F4F4F4");
                pb.informaCorFundoToolbar("#2F67F4");
                pb.informaCorTextoCaixaEdicao("#000000");
                pb.informaCorTeclaPressionadaTeclado("#e1e1e1");
                pb.informaCorTeclaLiberadaTeclado("#dedede");
                pb.informaCorSeparadorMenu("#2F67F4");
            }
        } catch (IllegalArgumentException e) {
            Toast.makeText(mainActivity, "Verifique valores de\nconfiguração", Toast.LENGTH_SHORT).show();
        }
        return pb.build();
    }
}
