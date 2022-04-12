package com.elgin.flutter_m8;


import android.content.Context;
import android.content.res.AssetManager;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.elgin.e1.Pagamento.ElginPay;


import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import br.com.setis.interfaceautomacao.Confirmacoes;
import br.com.setis.interfaceautomacao.EntradaTransacao;
import br.com.setis.interfaceautomacao.ModalidadesPagamento;
import br.com.setis.interfaceautomacao.Operacoes;
import br.com.setis.interfaceautomacao.Personalizacao;
import br.com.setis.interfaceautomacao.SaidaTransacao;
import br.com.setis.interfaceautomacao.Transacoes;
import io.flutter.plugin.common.MethodChannel;

public class ElginPayService {


    private Context context;
    MethodChannel methodChannel;
    ElginPay pagamento = new ElginPay();


    //USADO PARA ENVIAR E PROCESSAR MENSAGENS
    private Handler handler = new Handler(Looper.getMainLooper()){
        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);
            String retornoTransacao = "";
            retornoTransacao = (String) msg.obj;
            Map<String, Object> args = new HashMap<String, Object>();

            args.put("saida", retornoTransacao);
            methodChannel.invokeMethod("elginpayConcluido", args);
        }
    };

    public ElginPayService(Context c){
        context = c;
    }

    public void iniciaVendaDebito(String valor){
        Toast.makeText(context, "Débito", Toast.LENGTH_LONG).show();

        pagamento.iniciaVendaDebito(valor, context, handler);
    }

    public void iniciaVendaCredito(String valor, int tipoFinanciamento, int numeroParcelas)
    {
        Toast.makeText(context, "Crédito", Toast.LENGTH_LONG).show();

        pagamento.iniciaVendaCredito(valor, tipoFinanciamento, numeroParcelas, context, handler);
    }

    public void iniciaCancelamentoVenda(String valor, String saleRef, String date)
    {
        Toast.makeText(context, "Cancelamento", Toast.LENGTH_LONG).show();


        pagamento.iniciaCancelamentoVenda(valor, saleRef, date, context, handler);
    }

    public void iniciaOperacaoAdministrativa()
    {
        Toast.makeText(context, "Administrativa", Toast.LENGTH_LONG).show();

        pagamento.iniciaOperacaoAdministrativa(context, handler);
    }


    private File createFileFromInputStream(InputStream inputStream) {

        try{
            File f = new File("sdcard/logo2.png");
            OutputStream outputStream = new FileOutputStream(f);
            byte buffer[] = new byte[1024];
            int length = 0;

            while((length=inputStream.read(buffer)) > 0) {
                outputStream.write(buffer,0,length);
            }

            outputStream.close();
            inputStream.close();

            return f;
        }catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    private Personalizacao obterPersonalizacao(){
        //Processo de personalização do layout
        Personalizacao.Builder pb = new Personalizacao.Builder();
        String corDestaque = "#FED20B"; // AMARELO
        String corPrimaria = "#050609"; // PRETO
        String corSecundaria = "#808080";

        pb.informaCorFonte(corDestaque);
        pb.informaCorFonteTeclado(corPrimaria);
        pb.informaCorFundoToolbar(corDestaque);
        pb.informaCorFundoTela(corPrimaria);
        pb.informaCorTeclaLiberadaTeclado(corDestaque);
        pb.informaCorTeclaPressionadaTeclado(corSecundaria);
        pb.informaCorFundoTeclado(corPrimaria);
        pb.informaCorTextoCaixaEdicao(corDestaque);
        pb.informaCorSeparadorMenu(corDestaque);

        try {
            AssetManager am = context.getAssets();
            InputStream inputStream = am.open("logo.png");
            File file = createFileFromInputStream(inputStream);
            pb.informaIconeToolbar(file);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return pb.build();
    }

    //Métodos de customização

    //Aplica o layout do batpay ao objeto de pagamento
    public void setCustomLayoutOn(){
        this.pagamento.setPersonalizacao(obterPersonalizacao());
    }

    //Aplica um layout padrão ao objeto de pagamento
    public void setCustomLayoutOff(){
        this.pagamento.setPersonalizacao(new Personalizacao.Builder().build());
    }
}
