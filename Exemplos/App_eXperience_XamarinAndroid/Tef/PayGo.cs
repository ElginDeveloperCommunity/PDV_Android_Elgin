using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using BR.Com.Setis.Interfaceautomacao;
using Android.Content.PM;

using System.Threading;

namespace M8
{
    class PayGo
    {
        private static Activity mainActivity;

        private static SaidaTransacao mSaidaTransacao;
        private static DadosAutomacao mDadosAutomacao;
        private static Transacoes mTransacoes;
        private static Confirmacoes mConfirmacao;
        private static EntradaTransacao mEntradaTransacao = null;
        private static Personalizacao mPersonalizacao;
        private static Versoes versoes;
        private static Handler mHandler;

       

        public PayGo()
        {
        }

        public static void setActivity(Activity activity)
        {
            mainActivity = activity;
            IniciaClassesInterface(false, false, false, false);
#pragma warning disable CS0618 // O tipo ou membro é obsoleto
            mHandler = new Handler();
#pragma warning restore CS0618 // O tipo ou membro é obsoleto
        }
        private static readonly Java.Lang.Runnable mostraJanelaResultado = new Java.Lang.Runnable(new Action(delegate
        {
            Dictionary<String, String> mapValues = new Dictionary<string, string>();

            String retorno = mSaidaTransacao.ObtemMensagemResultado();
            String via_cliente = "";


            if (mSaidaTransacao.ObtemInformacaoConfirmacao())
            {
                mConfirmacao.InformaStatusTransacao(StatusTransacao.ConfirmadoAutomatico);
                mTransacoes.ConfirmaTransacao(mConfirmacao);



                ViasImpressao vias = mSaidaTransacao.ObtemViasImprimir();
                Console.WriteLine("VIAS: " + vias.Equals("VIA_NENHUMA"));

                //Imprime a via do cliente
                if (vias == ViasImpressao.ViaCliente || vias == ViasImpressao.ViaClienteEEstabelecimento)
                {
                    via_cliente = mSaidaTransacao.ObtemComprovanteGraficoPortador();
                }

                mapValues.Add("retorno", retorno);
                mapValues.Add("via_cliente", via_cliente);



                Tef.OptionsReturnPaygo(mapValues);
            }
        }));

        public void mostraResultadoTransacao()
        {
            String retorno = "";
            retorno = mSaidaTransacao.ObtemMensagemResultado();

            if (mSaidaTransacao.ObtemInformacaoConfirmacao())
            {
                mConfirmacao.InformaStatusTransacao(StatusTransacao.ConfirmadoAutomatico);
                mTransacoes.ConfirmaTransacao(mConfirmacao);

                ViasImpressao vias = mSaidaTransacao.ObtemViasImprimir();
                Console.WriteLine("VIAS: " + vias.Equals("VIA_NENHUMA"));

                //Imprime a via do cliente
                if (vias == ViasImpressao.ViaCliente || vias == ViasImpressao.ViaClienteEEstabelecimento)
                {
                    String via_cliente = mSaidaTransacao.ObtemComprovanteGraficoPortador();
                    retorno = via_cliente;
                }
            }
        }





        public static void efetuaTransacao(Operacoes operacao, Dictionary<String, String> dictionary)
        {
            mEntradaTransacao = new EntradaTransacao(operacao, "1");
            
            if (!operacao.Equals(Operacoes.Administrativa))
            {
                String valor = (String)dictionary["valor"];
                int parcelas = Int32.Parse(dictionary["parcelas"]);
                String formaPagamento = (String)dictionary["formaPagamento"];
                String tipoParcelamento = (String)dictionary["tipoParcelamento"];

                mEntradaTransacao.InformaValorTotal(valor);

                if (operacao.Equals(Operacoes.Venda))
                {
                    mEntradaTransacao.InformaDocumentoFiscal("1000");
                }

                mEntradaTransacao.InformaModalidadePagamento(ModalidadesPagamento.PagamentoCartao);

                if (formaPagamento.Equals("Crédito"))
                {
                    mEntradaTransacao.InformaTipoCartao(Cartoes.CartaoCredito);
                    mEntradaTransacao.InformaNumeroParcelas(parcelas);

                }
                else if (formaPagamento.Equals("Débito"))
                {
                    mEntradaTransacao.InformaTipoCartao(Cartoes.CartaoDebito);
                    mEntradaTransacao.InformaNumeroParcelas(parcelas);

                }
                else
                {
                    mEntradaTransacao.InformaTipoCartao(Cartoes.CartaoDesconhecido);
                }

                if (tipoParcelamento.Equals("Loja"))
                {
                    mEntradaTransacao.InformaTipoFinanciamento(Financiamentos.ParceladoEstabelecimento);

                }
                else if (tipoParcelamento.Equals("Adm"))
                {
                    mEntradaTransacao.InformaTipoFinanciamento(Financiamentos.ParceladoEmissor);
                }
                else
                {
                    mEntradaTransacao.InformaTipoFinanciamento(Financiamentos.AVista);
                }

                mEntradaTransacao.InformaNomeProvedor("DEMO");
                mEntradaTransacao.InformaCodigoMoeda("986");
            }

            mConfirmacao = new Confirmacoes();
            
            new Thread( ()=> {
            try
            {
                mDadosAutomacao.ObtemPersonalizacaoCliente();
                mSaidaTransacao = mTransacoes.RealizaTransacao(mEntradaTransacao);

                if (mSaidaTransacao == null)
                    return;

                mConfirmacao.InformaIdentificadorConfirmacaoTransacao(
                        mSaidaTransacao.ObtemIdentificadorConfirmacaoTransacao()
                );

                mEntradaTransacao = null;
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception" + e);
            }
            finally
            {
                mEntradaTransacao = null;
                if (mSaidaTransacao != null)
                {
                    mHandler.Post(mostraJanelaResultado);
                }
          
          }
        }).Start();
    }





    private static void IniciaClassesInterface(bool suportaViasDiferenciadas, bool suportaViasReduzidas, bool troco, bool desconto)
        {
            System.String versaoAutomacao;
            try
            {
                //versaoAutomacao = mainActivity.getPackageManager().getPackageInfo(
                       // mainActivity.getPackageName(), 0).versionName;
                versaoAutomacao = mainActivity.PackageManager.GetPackageInfo(mainActivity.PackageName, 0).VersionName;
            }
            catch (PackageManager.NameNotFoundException e)
            {
                Console.WriteLine("Exception" + e);
                versaoAutomacao = "Indisponivel";
            }

            mPersonalizacao = setPersonalizacao(false);

            mDadosAutomacao = new DadosAutomacao("Automacao Demo", versaoAutomacao, "SETIS",
                    troco, desconto, suportaViasDiferenciadas, suportaViasReduzidas, true, mPersonalizacao);

            mTransacoes = Transacoes.ObtemInstancia(mDadosAutomacao, mainActivity);
            versoes = mTransacoes.ObtemVersoes();
        }
        private static Personalizacao setPersonalizacao(bool isInverse)
        {
            Personalizacao.Builder pb = new Personalizacao.Builder();
            
            try
            {
                if (isInverse)
                {
                    pb.InformaCorFonte("#000000");
                    pb.InformaCorFonteTeclado("#000000");
                    pb.InformaCorFundoCaixaEdicao("#FFFFFF");
                    pb.InformaCorFundoTela("#F4F4F4");
                    pb.InformaCorFundoTeclado("#F4F4F4");
                    pb.InformaCorFundoToolbar("#2F67F4");
                    pb.InformaCorTextoCaixaEdicao("#000000");
                    pb.InformaCorTeclaPressionadaTeclado("#e1e1e1");
                    pb.InformaCorTeclaLiberadaTeclado("#dedede");
                    pb.InformaCorSeparadorMenu("#2F67F4");
                }
            }
            catch (Java.Lang.IllegalArgumentException)
            {
                Toast.MakeText(mainActivity, "Verifique valores de\nconfiguração", ToastLength.Short).Show();
            }
            return pb.Build();
        }
    }
}