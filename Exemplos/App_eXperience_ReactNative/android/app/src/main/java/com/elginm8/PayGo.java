package com.elginm8;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.widget.Toast;

import java.io.File;
import java.util.Map;

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

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.elginm8.ToastModules;

public class PayGo {
    private static Activity mainActivity;

    private static SaidaTransacao mSaidaTransacao;
    private static DadosAutomacao mDadosAutomacao;
    private static Transacoes mTransacoes;
    private static Confirmacoes mConfirmacao;
    private static EntradaTransacao mEntradaTransacao = null;
    private Personalizacao mPersonalizacao;
    private Versoes versoes;
    private static Handler mHandler; 

    public PayGo(Activity activity){
        mainActivity = activity;
        IniciaClassesInterface(false, false, false, false);
        mHandler = new Handler();
    }

    public static void mostraResultadoTransacao(){
        WritableMap result = Arguments.createMap();

        String retorno = mSaidaTransacao.obtemMensagemResultado();

        result.putString("resultPaygo", retorno);

        if(mSaidaTransacao.obtemInformacaoConfirmacao()) {
            mConfirmacao.informaStatusTransacao(StatusTransacao.CONFIRMADO_AUTOMATICO);
            mTransacoes.confirmaTransacao(mConfirmacao);

            ViasImpressao vias = mSaidaTransacao.obtemViasImprimir();
            System.out.println("VIAS: " + vias.equals("VIA_NENHUMA"));

            //Imprime a via do cliente
            if ( vias == ViasImpressao.VIA_CLIENTE || vias == ViasImpressao.VIA_CLIENTE_E_ESTABELECIMENTO) {
                String via_cliente = mSaidaTransacao.obtemComprovanteGraficoPortador();
            
                result.putString("resultPaygoSale", via_cliente);                            
            }

            ToastModules.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("eventResultPaygo", result); 
        }
    }
    

    public static void efetuaTransacao(Operacoes operacao, ReadableMap map){
        mEntradaTransacao = new EntradaTransacao(operacao, "1");

        if(!operacao.equals(Operacoes.ADMINISTRATIVA)){
            String valor = (String) map.getString("valor");
            int parcelas = (Integer) map.getInt("parcelas");
            String formaPagamento = (String) map.getString("formaPagamento");
            String tipoParcelamento = (String) map.getString("tipoParcelamento");

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
                    // mHandler.post(mostraResultadoTransacao);
                    mostraResultadoTransacao();
                    //seta a flag p/ mostrar os dados da ultima transacao após o proximo onresume
                    // é feita no onResume da aplicação para evitar crashes.
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
