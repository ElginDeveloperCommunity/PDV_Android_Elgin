import 'package:flutter/services.dart';

class PrinterService {
  final _platform = const MethodChannel('samples.flutter.elgin/ElginServices');

  Future<int> _sendFunctionToAndroid(Map<String, dynamic> args) async {
    return await _platform.invokeMethod("printer", {"args": args});
  }

  Future<int> sendPrinterText({
    String text = "Elgin Dev",
    String align = "Esquerda",
    bool isBold = true,
    bool isUnderline = false,
    String font = "FONT A",
    int fontSize = 4,
  }) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['text'] = text;
    mapParam['align'] = align;
    mapParam['isBold'] = isBold;
    mapParam['isUnderline'] = isUnderline;
    mapParam['font'] = font;
    mapParam['fontSize'] = fontSize;
    mapParam['typePrinter'] = "printerText";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> sendPrinterBarCode({
    String barCodeType = "EAN 8",
    String align = "Esquerda",
    String text = "Elgin Dev",
    int height = 120,
    int width = 4,
  }) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['barCodeType'] = barCodeType;
    mapParam['text'] = text;
    mapParam['height'] = height;
    mapParam['align'] = align;
    mapParam['width'] = width;
    mapParam['typePrinter'] = "printerBarCode";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> sendPrinterQrCode({
    int qrSize = 4,
    String text = "Elgin Dev",
    String align = "Esquerda",
  }) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['qrSize'] = qrSize;
    mapParam['align'] = align;
    mapParam['text'] = text;
    mapParam['typePrinter'] = "printerQrCode";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> sendPrinterImage(
    {
      required String pathImage
    }
  ) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = "printerImage";
    mapParam['pathImage'] = pathImage;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> sendPrinterNFCe(String xmlNFCe, int indexcsc, String csc, int param) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['xmlNFCe'] = xmlNFCe;
    mapParam['indexcsc'] = indexcsc;
    mapParam['csc'] = csc;
    mapParam['param'] = param;
    mapParam['typePrinter'] = "printerNFCe";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> sendPrinterSAT(String xmlSAT, int param) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['xmlSAT'] = xmlSAT;
    mapParam['param'] = param;
    mapParam['typePrinter'] = "printerSAT";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> getStatusPrinter() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = "printerStatus";

    int codeReturn = await _sendFunctionToAndroid(mapParam);

    if (codeReturn == 5)
      return "papel está presente e não está próximo do fim!";
    else if (codeReturn == 6)
      return "Papel próximo do fim!";
    else if (codeReturn == 7)
      return "Papel ausente!";
    else
      return "Status Desconhecido!";
  }

  Future<String> getStatusGaveta() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = "gavetaStatus";

    int codeReturn = await _sendFunctionToAndroid(mapParam);

    if (codeReturn == 1)
      return "Gaveta aberta!";
    else if (codeReturn == 2)
      return "Gaveta fechada!";
    else
      return "Status Desconhecido!";
  }

  Future<int> printerCupomTEF(String base64) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['base64'] = base64;
    mapParam['typePrinter'] = "printerCupomTEF";

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> connectExternalImpByIP(
    {
      required String model,
      required String ip,
      required int port
    }
  )
   async {
    Map<String, dynamic> mapParam = new Map();
    
    mapParam['model'] = model;
    mapParam['ip'] = ip;
    mapParam['port'] = port;

    mapParam['typePrinter'] = "printerConnectExternalByIP";

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> connectExternalImpByUSB(
    {
      required String model
    }
  )
   async {
    Map<String, dynamic> mapParam = new Map();
    
    mapParam['model'] = model;

    mapParam['typePrinter'] = "printerConnectExternalByUSB";
    
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> connectInternalImp() async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['typePrinter'] = "printerConnectInternal";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> sendOpenGaveta() async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['typePrinter'] = "abrirGaveta";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> jumpLine(int quant) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['quant'] = quant;
    mapParam['typePrinter'] = "jumpLine";
    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> cutPaper(int quant) async {
    Map<String, dynamic> mapParam = new Map();
    mapParam['quant'] = quant;
    mapParam['typePrinter'] = "cutPaper";
    return await _sendFunctionToAndroid(mapParam);
  }
}
