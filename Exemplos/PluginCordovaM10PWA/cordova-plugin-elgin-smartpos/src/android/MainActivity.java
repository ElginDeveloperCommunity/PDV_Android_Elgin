package plugin;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.graphics.Bitmap;
import android.content.Context;
import android.util.Log;
import android.widget.Toast;
import android.net.Uri;
import android.content.Intent;
import android.provider.MediaStore;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;

import androidx.annotation.NonNull;

import static android.app.Activity.RESULT_OK;

import javax.security.auth.callback.Callback;

import java.util.HashMap;
import java.util.Map;

//Funções Térmica da E1
import com.elgin.e1.Impressora.Termica;

//Funções da ElginPay da E1
import com.elgin.e1.Pagamento.ElginPay;

public class MainActivity extends CordovaPlugin {

    //Cordova->Java Params
    private Activity mActivity;
    private Context mContext;
    private CordovaWebView webView;
    
    //Intents CODES
    private static int REQ_CODE_SELECAOIMAGEM = 1234;

    //CallbacksOnActivityResult
    private CallbackContext selecionarImagemCallbackContext;

    /**
     * CallbackContext que guardará a ultimo chamado ao ElginPay
     * e invocará um retorno 'CallbackContext.sendPluginResult(pluginResult)' somente quando
     * o handler que observa a transação executar.
     */

    CallbackContext elginpayCallbackContext;

    //Objeto da ElginPay necessário para o uso das funções de pagamento
    ElginPay pagamento = new ElginPay();

    //Handler que será enviado para observar o término da transação
    //usado para capturar a saida da transação
    
    private Handler mHandler = new Handler(Looper.getMainLooper()){
        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);
            String saida = (String) msg.obj;

            Log.d("DEBUG", saida);

            //PluginResult que capturará o resultado do ElginPay e enviará de volta como o resultado do meu Callback
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, saida);
            pluginResult.setKeepCallback(true);

            elginpayCallbackContext.sendPluginResult(pluginResult);
        }
    };


    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        this.webView = webView;
        //Capturando a atividade do Cordova.
        mActivity = cordova.getActivity();
        mContext = cordova.getActivity().getApplicationContext();

        //Nullificando o objeto de callback
        elginpayCallbackContext = null; 

        //Inicializa a impressora
        Termica.setContext(mActivity);
    }

    /**
     * Função chamada no Java quando o Javascript executa uma chamada.
     * 
     * @param action    A ação a ser executada.
     * @param args  o JSONArray de argumentos do Plugin.
     * @param callbackContext   O callback que retornará ao JavasScript.
     * @return  true se uma ação válida tiver sido encontrada, false caso contrário.
     */

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
      
        /**
         * Funções ElginPay
         */

        if(action.equals("iniciaVendaDebito")){
            try{
                JSONObject params = args.getJSONObject(0);

                String valorTotal = params.getString("valorTotal");

                //O callbackcontext referente à transação ElginPay receberá o callback atual para lidar com o retorno corretamente.
                elginpayCallbackContext = callbackContext;

                pagamento.iniciaVendaDebito(valorTotal, mActivity, mHandler);
            }catch (Exception e){
                callbackContext.error("iniciaVendaDebito error: " + e.toString());
            }
            return true;
        }

        else if(action.equals("iniciaVendaCredito")){
            try{
                JSONObject params = args.getJSONObject(0);

                String valorTotal = params.getString("valorTotal");
                int tipoFinanciamento = params.getInt("tipoFinanciamento");
                int numeroParcelas = params.getInt("numeroParcelas");

                //O callbackcontext referente à transação ElginPay receberá o callback atual para lidar com o retorno corretamente.
                elginpayCallbackContext = callbackContext;

                pagamento.iniciaVendaCredito(valorTotal, tipoFinanciamento, numeroParcelas, mActivity, mHandler);
            }catch (Exception e){
                callbackContext.error("iniciaVendaCredito error: " + e.toString());
            }
            return true;
        }

        else if(action.equals("iniciaCancelamentoVenda")){
            try{
                JSONObject params = args.getJSONObject(0);

                String valorTotal = params.getString("valorTotal");
                String ref = params.getString("ref");
                String data = params.getString("data");

                //O callbackcontext referente à transação ElginPay receberá o callback atual para lidar com o retorno corretamente.
                elginpayCallbackContext = callbackContext;

                pagamento.iniciaCancelamentoVenda(valorTotal, ref, data, mActivity, mHandler); 
            }catch (Exception e){
                callbackContext.error("iniciaCancelamentoVenda error: " + e.toString());
            }
            return true;
        }

        else if(action.equals("iniciaOperacaoAdministrativa")){
            try{
                //O callbackcontext referente à transação ElginPay receberá o callback atual para lidar com o retorno corretamente.
                elginpayCallbackContext = callbackContext;

                pagamento.iniciaOperacaoAdministrativa(mActivity, mHandler);
            }catch (Exception e){
                callbackContext.error("iniciaOperacaoAdministrativa error: " + e.toString());
            }
            return true;
        }

        //Fim - Funções ElginPay




        /**
         * 
         * Funções da Impressora
         */

        else if(action.equals("AbreConexaoImpressora")){
            try{
                JSONObject params = args.getJSONObject(0);

                int tipo = params.getInt("tipo");
                String modelo = params.getString("modelo");
                String conexao = params.getString("conexao");
                int parametro = params.getInt("parametro");

                int result = Termica.AbreConexaoImpressora(tipo, modelo, conexao, parametro);

                callbackContext.success(result);
            }catch (Exception e){
                callbackContext.error("AbreConexaoImpressora error: " + e.toString());
            }
            return true;
        }

        else if(action.equals("FechaConexaoImpressora")){
            try{
                int result = Termica.FechaConexaoImpressora();

                callbackContext.success(result);
            } catch (Exception e){
                callbackContext.error("FechaConexaoImpressora error: " + e.toString());
            }
            return true;
        }

        else if(action.equals("AvancaPapel")){
            try{
                JSONObject params = args.getJSONObject(0);

                int linhas = params.getInt("linhas");

                int result = Termica.AvancaPapel(linhas);

                callbackContext.success(result);
            }catch (Exception e){
                callbackContext.error("AvancaPapel error: " + e.toString());
            }
            return true;
        }

        else if(action.equals("ImpressaoTexto")){
           try{
                JSONObject params = args.getJSONObject(0);

                String dados = params.getString("dados");
                int posicao = params.getInt("posicao");
                int stilo = params.getInt("stilo");
                int tamanho = params.getInt("tamanho");

                int result = Termica.ImpressaoTexto(dados, posicao, stilo, tamanho);

                callbackContext.success(result);
           }catch (Exception e){
               callbackContext.error("ImpressaoTexto error: " + e.toString());
           }
           return true;
        }

        else if(action.equals("ImpressaoCodigoBarras")){
            try{
                JSONObject params = args.getJSONObject(0);

                int tipo = params.getInt("tipo");
                String dados = params.getString("dados");
                int altura = params.getInt("altura");
                int largura = params.getInt("largura");
                int HRI = params.getInt("HRI");

                int result = Termica.ImpressaoCodigoBarras(tipo, dados, altura, largura, HRI);

                callbackContext.success(result);
            }catch (Exception e){
                callbackContext.error("ImpressaoCodigoBarras error: " + e.toString());
            }
            return true;
        }

        else if (action.equals("DefinePosicao")){
            try{
                JSONObject params = args.getJSONObject(0);

                int posicao = params.getInt("posicao");

                int result = Termica.DefinePosicao(posicao);

                callbackContext.success(result);
            }catch (Exception e){
                callbackContext.error("DefinePosicao error: " + e.toString());
            }
            return true;
        }

        else if(action.equals("ImpressaoQRCode")){
            try{
                JSONObject params = args.getJSONObject(0);

                String dados = params.getString("dados");
                int tamanho = params.getInt("tamanho");
                int nivelCorrecao = params.getInt("nivelCorrecao");

                int result = Termica.ImpressaoQRCode(dados, tamanho, nivelCorrecao);

                callbackContext.success(result) ;
            }catch (Exception e){
                callbackContext.error("ImpressaoQRCode error: " + e.toString());
            }
            return true;
        }

        else if(action.equals("ImprimeXMLNFCe")){
            try{
                JSONObject params = args.getJSONObject(0);

                String dados = params.getString("dados");
                int indexcsc = params.getInt("indexcsc");
                String csc = params.getString("csc");
                int param = params.getInt("param");

                int result = Termica.ImprimeXMLNFCe(dados, indexcsc, csc, param);

                callbackContext.success(result);
            }catch (Exception e){
                callbackContext.error("ImprimeXMLNFCe error: " + e.toString()); 
            }
            return true;
        }

        else if(action.equals("ImprimeXMLSAT")){
            try{
                JSONObject params = args.getJSONObject(0);

                String dados = params.getString("dados");
                int param = params.getInt("param");

                int result = Termica.ImprimeXMLSAT(dados, param);

                callbackContext.success(result);

            }catch (Exception e){
                callbackContext.error("ImprimeXMLSAT error: " + e.toString());
            }
            return true;
        }

        else if(action.equals("StatusImpressora")){
            try{
                JSONObject params = args.getJSONObject(0);

                int param = params.getInt("param");

                int result = Termica.StatusImpressora(param);

                callbackContext.success(result);
            }catch (Exception e){
                callbackContext.error("StatusImpressora error: " + e.toString());
            }
            return true;
        }

        else if(action.equals("ImprimeImagem")){
            try{
                Intent intent = new Intent((Intent.ACTION_PICK));
                intent.setType("image/*");

                this.selecionarImagemCallbackContext = callbackContext;

                cordova.setActivityResultCallback(this);
                cordova.getActivity().startActivityForResult(intent, REQ_CODE_SELECAOIMAGEM);

            }catch (Exception e){
                callbackContext.error("ImprimirImagem error: " + e.toString());
            }
            return true;
        }


        //Método não encontrado
        return false;
    } 


    //Override no Activity Resulta da CordovaActivity para lidar com situações reladionadas à intents
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data){
        JSONObject resultadoJson = new JSONObject();

        if(resultCode == RESULT_OK){
            if(requestCode == this.REQ_CODE_SELECAOIMAGEM){
                Uri returnUri = data.getData();

                Bitmap bitmapImage = null;

                try{
                   
                    bitmapImage = MediaStore.Images.Media.getBitmap(cordova.getActivity().getContentResolver(), returnUri);
                    
                    int result = Termica.ImprimeBitmap(bitmapImage);
                    Termica.AvancaPapel(10);
                        
                    this.selecionarImagemCallbackContext.success(result);
                }catch (Exception e){
                    this.selecionarImagemCallbackContext.error("selecionarImagem error: " + e.toString());
                }
            }
        }else{
            Toast.makeText(mContext, "You haven't a picked Image", Toast.LENGTH_LONG).show();
        }
    }
}
