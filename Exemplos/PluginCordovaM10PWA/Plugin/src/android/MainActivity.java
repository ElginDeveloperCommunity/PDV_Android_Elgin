package plugin;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;

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

import static android.app.Activity.RESULT_OK;

import java.util.HashMap;
import java.util.Map;

//Elgin Plugins
import com.elgin.e1.Impressora.Termica;

import javax.security.auth.callback.Callback;


public class MainActivity extends CordovaPlugin {

    //Cordova/Java Params
    private Activity mActivity;
    private Context mContext;
    private CordovaWebView webView;

    //Intents CODES
    private static int REQ_CODE_SELECAOIMAGEM = 1234;

    //CallbacksOnActivityResult
    private CallbackContext selecionarImagemCallbackContext;

    //cutPaper boolean for resultActivity
    private boolean cutPaper = false;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        this.webView = webView;
        mActivity = cordova.getActivity();
        mContext = cordova.getActivity().getApplicationContext();

        //Initialize printer
        Termica.setContext(mActivity);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        if(action.equals("AbreConexaoImpressora")){
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
        }

        else if(action.equals("FechaConexaoImpressora")){
            try{
                int result = Termica.FechaConexaoImpressora();

                callbackContext.success(result);
            } catch (Exception e){
                callbackContext.error("FechaConexaoImpressora error: " + e.toString());
            }
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
        }

        else if(action.equals("Corte")){
            try{
                JSONObject params = args.getJSONObject(0);

                int avanco = params.getInt("avanco");

                int result = Termica.Corte(avanco);

                callbackContext.success(result);
            }catch (Exception e){
                callbackContext.error("Corte error: " + e.toString());
            }
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

        else if(action.equals("AbreGavetaElgin")){
            try{
                int result = Termica.AbreGavetaElgin();

                callbackContext.success(result);
            } catch (Exception e){
                callbackContext.error("AbreGavetaElgin error: " + e.toString());
            }
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
                JSONObject params = args.getJSONObject(0);

                if(params.getBoolean("cutPaper")) this.cutPaper = true;
                else this.cutPaper = false;

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

        //could not find a method
        return false;
    }

    //Activity Result

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
                    if(cutPaper) Termica.Corte(10);
                        
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
