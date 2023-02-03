package com.elgin.flutter_m8;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.widget.Toast;

import com.elgin.flutter_m8.TefEnums.FormaFinanciamento;
import com.elgin.flutter_m8.TefEnums.FormaPagamento;

import java.io.File;
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

    public Paygo(Activity activity) {
        mainActivity = activity;
        IniciaClassesInterface(false, false, false, false);
        mHandler = new Handler();
    }

    private final Runnable mostraJanelaResultado = new Runnable() {//region
        public void run() {
            JSONObject dataJson = new JSONObject();

            String retorno = mSaidaTransacao.obtemMensagemResultado();
            String via_cliente = "";


            if (mSaidaTransacao.obtemInformacaoConfirmacao()) {
                mConfirmacao.informaStatusTransacao(StatusTransacao.CONFIRMADO_AUTOMATICO);
                mTransacoes.confirmaTransacao(mConfirmacao);

                ViasImpressao vias = mSaidaTransacao.obtemViasImprimir();
                System.out.println("VIAS: " + vias.equals("VIA_NENHUMA"));

                //Imprime a via do cliente
                if (vias == ViasImpressao.VIA_CLIENTE || vias == ViasImpressao.VIA_CLIENTE_E_ESTABELECIMENTO) {
                    via_cliente = mSaidaTransacao.obtemComprovanteGraficoPortador();
                }

                try {
                    dataJson.put("retorno", retorno);
                    dataJson.put("via_cliente", via_cliente);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                MainActivity.resultFlutter.success(dataJson.toString());
            }
        }
    };

//    public void mostraResultadoTransacao(){
//        String retorno = "";
//        retorno = mSaidaTransacao.obtemMensagemResultado();
//
//        if(mSaidaTransacao.obtemInformacaoConfirmacao()) {
//            mConfirmacao.informaStatusTransacao(StatusTransacao.CONFIRMADO_AUTOMATICO);
//            mTransacoes.confirmaTransacao(mConfirmacao);
//
//            ViasImpressao vias = mSaidaTransacao.obtemViasImprimir();
//            System.out.println("VIAS: " + vias.equals("VIA_NENHUMA"));
//
//            //Imprime a via do cliente
//            if ( vias == ViasImpressao.VIA_CLIENTE || vias == ViasImpressao.VIA_CLIENTE_E_ESTABELECIMENTO) {
//                String via_cliente = mSaidaTransacao.obtemComprovanteGraficoPortador();
//                retorno = via_cliente;
//            }
//
//            MainActivity.resultFlutter.success(retorno);
//        }
//    }


    public void efetuaTransacao(Operacoes operacao, Map<String, Object> params) {
        mEntradaTransacao = new EntradaTransacao(operacao, "1");

        if (!operacao.equals(Operacoes.ADMINISTRATIVA)) {
            final String valor = (String) params.get("valor");
            final int parcelas = (Integer) params.get("parcelas");
            final FormaPagamento formaPagamentoSelecionada = FormaPagamento.fromRotulo((String) params.get("formaPagamento"));
            final FormaFinanciamento formaFinanciamentoSelecionada = FormaFinanciamento.fromRotulo((String) params.get("formaFinanciamento"));

            mEntradaTransacao.informaValorTotal(valor);

            if (operacao.equals(Operacoes.VENDA)) {
                mEntradaTransacao.informaDocumentoFiscal("1000");
            }

            mEntradaTransacao.informaModalidadePagamento(ModalidadesPagamento.PAGAMENTO_CARTAO);

            switch (formaPagamentoSelecionada) {
                case CREDITO:
                    mEntradaTransacao.informaTipoCartao(Cartoes.CARTAO_CREDITO);
                    mEntradaTransacao.informaNumeroParcelas(parcelas);
                    break;
                case DEBITO:
                    mEntradaTransacao.informaTipoCartao(Cartoes.CARTAO_DEBITO);
                    mEntradaTransacao.informaNumeroParcelas(parcelas);
                    break;
                case TODOS:
                    mEntradaTransacao.informaTipoCartao(Cartoes.CARTAO_DESCONHECIDO);
                    break;
            }

            switch (formaFinanciamentoSelecionada) {
                case LOJA:
                    mEntradaTransacao.informaTipoFinanciamento(Financiamentos.PARCELADO_ESTABELECIMENTO);
                    break;
                case ADM:
                    mEntradaTransacao.informaTipoFinanciamento(Financiamentos.PARCELADO_EMISSOR);
                    break;
                case A_VISTA:
                    mEntradaTransacao.informaTipoFinanciamento(Financiamentos.A_VISTA);
                    break;
            }

            mEntradaTransacao.informaNomeProvedor("DEMO");
            mEntradaTransacao.informaCodigoMoeda("986");
        }

        mConfirmacao = new Confirmacoes();

        new Thread(() -> {
            try {
                mDadosAutomacao.obtemPersonalizacaoCliente();
                mSaidaTransacao = mTransacoes.realizaTransacao(mEntradaTransacao);

                if (mSaidaTransacao == null)
                    return;

                mConfirmacao.informaIdentificadorConfirmacaoTransacao(
                        mSaidaTransacao.obtemIdentificadorConfirmacaoTransacao()
                );

                mEntradaTransacao = null;
            } catch (Exception e) {
                System.out.println("Exception" + e);
            } finally {
                mEntradaTransacao = null;
                if (mSaidaTransacao != null) {
                    mHandler.post(mostraJanelaResultado);
                }
            }
        }).start();
    }

    private void IniciaClassesInterface(boolean suportaViasDiferenciadas, boolean suportaViasReduzidas, boolean troco, boolean desconto) {
        String versaoAutomacao;
        try {
            versaoAutomacao = mainActivity.getPackageManager().getPackageInfo(
                    mainActivity.getPackageName(), 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            versaoAutomacao = "Indisponivel";
        }

        mPersonalizacao = setPersonalizacao(false);

        mDadosAutomacao = new DadosAutomacao("Automacao Demo", versaoAutomacao, "SETIS",
                troco, desconto, suportaViasDiferenciadas, suportaViasReduzidas, true, mPersonalizacao);

        mTransacoes = Transacoes.obtemInstancia(mDadosAutomacao, mainActivity);
        versoes = mTransacoes.obtemVersoes();
    }

    private Personalizacao setPersonalizacao(boolean isInverse) {
        Personalizacao.Builder pb = new Personalizacao.Builder();

        try {
            if (isInverse) {
                pb.informaCorFonte("#000000");
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