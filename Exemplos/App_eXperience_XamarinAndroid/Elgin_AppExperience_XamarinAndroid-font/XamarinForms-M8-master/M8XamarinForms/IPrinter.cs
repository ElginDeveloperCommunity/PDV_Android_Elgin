using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace M8XamarinForms
{
    public interface IPrinter
    {

        int PrinterInternalImpStart();

        int PrinterExternalImpStartByIP(string model, string ip, int port);

        int PrinterExternalImpStartByUSB(string model);

        void PrinterStop();

        int AvancaLinhas(int linesNumber);

        void JumpLine();

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
