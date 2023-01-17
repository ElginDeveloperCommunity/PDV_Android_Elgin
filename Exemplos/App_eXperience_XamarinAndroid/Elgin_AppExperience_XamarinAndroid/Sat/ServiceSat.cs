using Android.Content;
using Android.Widget;
using System.Collections.Generic;
using BR.Com.Elgin;
using Android.Util;
using Java.Lang;
using Android.OS;
using Java.IO;

namespace M8
{
    class ServiceSat
    {
        private readonly Context contextSat;
        public static SatInitializer satInitializer;

        //Diretório Raiz da aplicação
        private string BASE_ROOT_DIR;

        private const string SATLOG_ARCHIVE_NAME = "SatLog.txt";

        public ServiceSat(Context context)
        {
            satInitializer = new SatInitializer();
            contextSat = context;

            BASE_ROOT_DIR = "/Android/data/" + contextSat.PackageName + "/";
        }

        public string AtivarSAT(Dictionary<string, object> map)
        {
            int numSessao = (int)map["numSessao"];
            int subComando = (int)map["subComando"];
            string codeAtivacao = (string)map["codeAtivacao"];
            string cnpj = (string)map["cnpj"];
            int cUF = (int) map["cUF"];
            string retorno = Sat.AtivarSat(numSessao, subComando, codeAtivacao, cnpj, cUF);
            MostrarRetorno(retorno);
            return retorno;
        }

        public string AssociarAssinatura(Dictionary<string, object> map)
        {
            int numSessao = (int)map["numSessao"];
            string codeAtivacao = (string)map["codeAtivacao"];
            string cnpjSh = (string) map["cnpjSh"];
            string assinaturaAC = (string)map["assinaturaAC"];

            string retorno = Sat.AssociarAssinatura(numSessao, codeAtivacao, cnpjSh, assinaturaAC);
            MostrarRetorno(retorno);
            return retorno;
        }

        public string ConsultarSAT(Dictionary<string, object> map)
        {
            int numSessao = (int) map["numSessao"];

            string result = Sat.ConsultarSat(numSessao);
            MostrarRetorno(result);
            return result;
        }

        public string StatusOperacional(Dictionary<string, object> map)
        {
            int numSessao = (int)map["numSessao"];
            string codeAtivacao = (string)map["codeAtivacao"];

            string retorno = Sat.ConsultarStatusOperacional(numSessao, codeAtivacao);
            MostrarRetorno(retorno);
            return retorno;
        }

        public string EnviarVenda(Dictionary<string, object> map)
        {
            int numSessao = (int) map["numSessao"];
            string codeAtivacao = (string) map["codeAtivacao"];
            string xmlSale = (string) map["xmlSale"];

            string retorno = Sat.EnviarDadosVenda(numSessao, codeAtivacao, xmlSale);
            MostrarRetorno(retorno);
            return retorno;
        }

        public string CancelarVenda(Dictionary<string, object> map)
        {
            int numSessao = (int) map["numSessao"];
            string codeAtivacao = (string)map["codeAtivacao"];
            string cFeNumber = (string)map["cFeNumber"];
            string xmlCancelamento = (string) map["xmlCancelamento"];

            string retorno = Sat.CancelarUltimaVenda(numSessao, codeAtivacao, cFeNumber, xmlCancelamento);
            MostrarRetorno(retorno);
            return retorno;
        }

        private void MostrarRetorno(string retorno)
        {
            Toast.MakeText(contextSat, string.Format("Retorno: {0}", retorno), ToastLength.Long).Show();
        }

        public bool ExtrairLog(Dictionary<string,object> map)
        {
            int numSessao = (int)map["numSessao"];
            string codeAtivacao = (string)map["codeAtivacao"];

            string extractedLog = Sat.ExtrairLogs(numSessao, codeAtivacao);

            //Se o sat não estiver conectado ou algum outro problema tiver ocorrido, o retorno de Sat.extrairLogs()  será 'DeviceNotFound' e função não foi bem sucedida!
            if (extractedLog.Equals("DeviceNotFound"))
            {
                MostrarRetorno(extractedLog);
                return false;
            }

            //O texto a ser salvo está na 6° posição ao separar a String por '|'
            string[] extractedLogInArray = extractedLog.Split("|");

            //O texto a ser salvo está em base64 e deve ser decodificado antes de ser salvo no arquivo .txt
            byte[] byteArrayWithStringConverted = Base64.Decode(extractedLogInArray[5], Base64Flags.Default);

            String logtoBeSavedInStorage = new String(byteArrayWithStringConverted);

            //Tenta criar o dir ROOT onde a aplicação irá conseguir salvar o arquivo do logsat
            CreateRootDirectory(contextSat);
            WriteFileOnStorage(SATLOG_ARCHIVE_NAME, logtoBeSavedInStorage);

            return true;
        }

        //Função que retorna o PATH absoluto do storage do Android, utilizada para criar o diretório root caso não exista
        //e para prover o PATH correto onde escrever o logSAT extraído
        private static string StoragePathToAbsolutePath(string pathFromStorageRoot)
        {
            StringBuffer buffer = new StringBuffer(255);

            buffer.Append(Environment.ExternalStorageDirectory.AbsolutePath);

            if (pathFromStorageRoot[0] != '/')
            {
                buffer.Append('/');
            }

            buffer.Append(pathFromStorageRoot);

            return buffer.ToString();
        }

        //Função que cria o diretório root da aplicação (com.packagename) localizado em Android/data
        //diretório que será utilizado para salvar o arquivo de log do sat
        private bool CreateRootDirectory(Context ctx)
        {
            // Constant, copied here: private static final String BASE_DIR = "/Android/data/";
            string dataDir = StoragePathToAbsolutePath(BASE_ROOT_DIR);
            Log.Debug("MADARA", dataDir);
            Log.Debug("MADARA", StoragePathToAbsolutePath(BASE_ROOT_DIR));
            File f = new File(dataDir);
            return f.Mkdirs();
        }

        private void WriteFileOnStorage(string fileNameWithExtension, String textToWrite)
        {
            File file = new File(StoragePathToAbsolutePath(BASE_ROOT_DIR), "files");
            if (!file.Exists())
            {
                file.Mkdir();
            }

            try
            {
                File gpxfile = new File(file, fileNameWithExtension);
                FileWriter writer = new FileWriter(gpxfile);
                writer.Append(textToWrite);
                writer.Flush();
                writer.Close();

                Toast.MakeText(contextSat, "Saved your text in " + gpxfile.Path, ToastLength.Long).Show();
            }
            catch (Exception e)
            {
                e.PrintStackTrace();
            }
        }

        public string GetBASE_ROOT_DIR()
        {
            return BASE_ROOT_DIR;
        }
    }
}