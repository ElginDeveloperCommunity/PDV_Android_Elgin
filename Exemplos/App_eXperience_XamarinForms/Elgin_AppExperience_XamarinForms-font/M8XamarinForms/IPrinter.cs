using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace M8XamarinForms
{
    public interface IPrinter
    {

        int PrinterInternalImpStart();

        int PrinterExternalImpStart(Dictionary<string,string> parametros);

        void PrinterStop();

        int AvancaLinhas(int linesNumber);

        int CutPaper(int cut);

        int ImprimeBarCode(Dictionary<string,string> parametros);

        int ImprimeQR_CODE(Dictionary<string,string> parametros);

        int ImprimeImagem(Stream bitmap);

        int ImprimeImagemPadrao();

        int ImprimeXMLNFCe(Dictionary<string,string> parametros);

        int ImprimeXMLSAT(Dictionary<string,string> parametros);

        int StatusGaveta();

        int AbrirGaveta();

        int StatusSensorPapel();

        int ImprimeCupomTEF(Dictionary<string,string> parametros);

        int ImprimeTexto(Dictionary<string,string> parametros);

        void TestArg();

        void TestArg2();

        void TestAndroidAlert(string alert);

        bool IsIpValid(string ip);

        Task<Stream> GetImageStreamAsync();
    }
}
