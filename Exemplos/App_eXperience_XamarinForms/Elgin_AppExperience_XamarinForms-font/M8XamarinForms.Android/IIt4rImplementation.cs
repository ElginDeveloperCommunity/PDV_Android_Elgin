using System;
using System.Threading;
using Java.Util.Concurrent.Atomic;
using BR.Com.Daruma.Framework.Mobile;
using BR.Com.Daruma.Framework.Mobile.Exception;
using System.Text.RegularExpressions;
using Android.Util;
using Xamarin.Forms;
using Android.OS;
using Environment = Android.OS.Environment;
using Java.IO;

[assembly: Dependency(typeof(M8XamarinForms.Droid.It4r))]
namespace M8XamarinForms.Droid
{
    class It4r : IIt4r
    {
        protected DarumaMobile dmf;

        //Valor utilizado para guardar o valor do tempo de emissão
        private static AtomicLong timeElapsedInLastEmission = new AtomicLong(0);
        //Obtejo utilizada para verificar se houve alguma exceção nas threads que executam as funções DarumaMobile
        private static volatile DarumaException capturedException = null;

        public It4r()
        {
            dmf = DarumaMobile.Inicializar((MainActivity)Forms.Context, "@FRAMEWORK(LOGMEMORIA=200;TRATAEXCECAO=TRUE;TIMEOUTWS=8000;SATNATIVO=FALSE);@SOCKET(HOST=192.168.210.94;PORT=9100;)");
        }

        public void VenderItem(string descricao, string valor, string codigo)
        {
            Thread sellItemThread = new Thread(new ThreadStart(() => {
                try
                {
                    if (dmf.RCFVerificarStatus_NFCe() < 2)
                        dmf.ACFAbrir_NFCe("", "", "", "", "", "", "", "", "");

                    dmf.ACFConfICMS00_NFCe("0", "00", "3", "17.50");
                    dmf.ACFConfPisAliq_NFCe("01", "10.00");
                    dmf.ACFConfCofinsAliq_NFCe("01", "10.00");
                    dmf.ACFVenderCompleto_NFCe("17.50", "1.00", valor, "D$", "0.00", codigo, "21050010", "5102", "UN", descricao, "CEST=2300100;cEAN=SEM GTIN;cEANTrib=SEM GTIN;");
                }
                catch (DarumaException darumaException)
                {
                    darumaException.PrintStackTrace();
                    capturedException = darumaException;
                }
            }));

            sellItemThread.Start();

            try
            {
                sellItemThread.Join();
            }
            catch (Java.Lang.InterruptedException e)
            {
                e.PrintStackTrace();
            }

            if (capturedException != null)
                ThrowExceptionAndResetCapture();
        }

        public void EncerrarVenda(string valorTotal, string formaPagamento)
        {
            Thread finishSaleThread = new Thread(new ThreadStart(() => {
                try
                {
                    if (float.Parse(valorTotal) < 0.01f)
                    {
                        throw new Java.Lang.IllegalArgumentException("Valor não aceito para o encerramento de venda!");
                    }
                    dmf.ACFTotalizar_NFCe("D$", "0.00");
                    dmf.ACFEfetuarPagamento_NFCe(formaPagamento, valorTotal);

                    timeElapsedInLastEmission = new AtomicLong(0);
                    long startTime = GetCurrentMillis();

                    dmf.TCFEncerrar_NFCe("ELGIN DEVELOPERS COMMUNITY");

                    long endTime = GetCurrentMillis();

                    timeElapsedInLastEmission = new AtomicLong(endTime - startTime);

                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\EstadoCFe", "0");
                }
                catch (DarumaException darumaException)
                {
                    darumaException.PrintStackTrace();
                    capturedException = darumaException;
                }
            }));

            finishSaleThread.Start();

            try
            {
                finishSaleThread.Join();
            }
            catch (Java.Lang.InterruptedException e)
            {
                e.PrintStackTrace();
            }

            if (capturedException != null)
                ThrowExceptionAndResetCapture();
        }

        public long GetCurrentMillis()
        {
            DateTime Jan1970 = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            TimeSpan javaSpan = DateTime.UtcNow - Jan1970;
            return (long)javaSpan.TotalMilliseconds;
        }

        public void ConfigurarXmlNfce()
        {
            Thread configurateXmlNfceThread = new Thread(new ThreadStart(() => {
                try
                {
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\EmpPK", "YPxRwGxIbpWZtwhuC0m+Wg==", false);
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\EmpCK", "eKdz2fcZg9ZMt3DrfF/KSIVoH59Ca6nN", false);
                    dmf.RegAlterarValor_NFCe("IDE\\cUF", "43", false);
                    dmf.RegAlterarValor_NFCe("EMIT\\CNPJ", "06354976000149", false);
                    dmf.RegAlterarValor_NFCe("EMIT\\IE", "1470049241", false);
                    dmf.RegAlterarValor_NFCe("EMIT\\xNome", "ITFast", false);
                    dmf.RegAlterarValor_NFCe("EMIT\\ENDEREMIT\\UF", "RS", false);
                    dmf.RegAlterarValor_NFCe("EMIT\\CRT", "3", false);
                    dmf.RegAlterarValor_NFCe("EMIT\\CRT", "3", false);
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\TipoAmbiente", "2", false);
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\Impressora", "EPSON", false);
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\AvisoContingencia", "1", false);
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\ImpressaoCompleta", "2", false);
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\NumeracaoAutomatica", "1", false);
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\HabilitarSAT", "0", false);
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\IdToken", "000001", false);
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\Token", "1A451E99-0FE0-4C13-B97E-67D698FFBC37", false);
                    dmf.RegAlterarValor_NFCe("IDE\\Serie", "133", false);
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\NT\\VersaoNT", "400", false);
                    dmf.RegAlterarValor_NFCe("CONFIGURACAO\\EstadoCFe", "0", false);
                    dmf.RegPersistirXML_NFCe();

                    AdjustNfceNumber();
                }
                catch (DarumaException darumaException)
                {
                    darumaException.PrintStackTrace();
                    capturedException = darumaException;
                }
            }));

            configurateXmlNfceThread.Start();

            try
            {
                configurateXmlNfceThread.Join();
            }
            catch (Java.Lang.InterruptedException e)
            {
                e.PrintStackTrace();
            }

            if (capturedException != null)
                ThrowExceptionAndResetCapture();
        }

        private void ThrowExceptionAndResetCapture()
        {
            DarumaException lastException = capturedException;
            capturedException = null;
            throw lastException;
        }

        public string GetNumeroNota()
        {
            char[] numeroNota = new char[50];
            dmf.RInfoEstendida_NFCe("2", numeroNota);

            return new string(numeroNota).Trim();
        }

        public string GetNumeroSerie()
        {
            char[] serieNota = new char[50];
            dmf.RInfoEstendida_NFCe("5", serieNota);

            return new string(serieNota).Trim();
        }

        //Função que lê o xml que representa a nota NFC-e emitida e retorna uma String com o conteúdo
        public string GetTextOfFile()
        {
            string strFile;
            if (Build.VERSION.SdkInt >= BuildVersionCodes.R)
            {
                strFile = Forms.Context.GetExternalFilesDir(null).Path + "//IT4R//EnvioWS.xml";
            }
            else
            {
                strFile = Environment.ExternalStorageDirectory.AbsolutePath + "/EnvioWS.xml";
            }

            string strFileContent = "";
            File file = new File(strFile);

            if (file.Exists())
            {
                FileInputStream fis2 = null;
                try
                {
                    fis2 = new FileInputStream(file);
                    char current;
                    while (fis2.Available() > 0)
                    {
                        current = ((char)fis2.Read());
                        strFileContent = strFileContent + current;
                    }

                }
                catch (Exception e)
                {
                    Log.Debug("TourGuide", e.ToString());
                }
                finally
                {
                    if (fis2 != null) try
                        {
                            fis2.Close();
                        }
                        catch (Exception e)
                        {
                            Log.Debug("TourGuide", e.ToString());
                        }
                }
            }
            return strFileContent;
        }

        public long GetTimeElapsedInLastEmission()
        {
            return timeElapsedInLastEmission.Get();
        }

        //Função que busca a informação da nota mais alta pra série já escrita NFC-e para envio em cache, impedindo erro de duplicidade de NFC-e
        public void AdjustNfceNumber()
        {
            char[] retorno = new char[50];
            dmf.RRetornarInformacao_NFCe("NUM", "0", "0", "133", "", "9", retorno);
            string retornoAjustado = new string(retorno).Trim();
            string notaMaisAlta = Regex.Replace(retornoAjustado, "\\D+", "");
            int notaMaisAltaInt = int.Parse(notaMaisAlta) + 1;
            string proximaNota = notaMaisAltaInt.ToString();

            dmf.RegAlterarValor_NFCe("IDE\\nNF", proximaNota);
            dmf.RegPersistirXML_NFCe();
        }
    }
}