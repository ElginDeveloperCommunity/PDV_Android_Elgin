import 'package:flutter/services.dart';

//Funções da impressora
enum PrinterFunctions {
  PRINTER_TEXT,
  PRINTER_BAR_CODE,
  PRINTER_QR_CODE,
  PRINTER_IMAGE,
  PRINTER_NFCE,
  PRINTER_SAT,
  PRINTER_STATUS,
  GAVETA_STATUS,
  PRINTER_CUPOM_TEF,
  PRINTER_CONNECT_EXTERNAL,
  PRINTER_CONNECT_INTERNAL,
  ABRIR_GAVETA,
  JUMP_LINE,
  CUT_PAPER
}

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

    mapParam['typePrinter'] = PrinterFunctions.PRINTER_TEXT.name;

    mapParam['text'] = text;
    mapParam['align'] = align;
    mapParam['isBold'] = isBold;
    mapParam['isUnderline'] = isUnderline;
    mapParam['font'] = font;
    mapParam['fontSize'] = fontSize;

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

    mapParam['typePrinter'] = PrinterFunctions.PRINTER_BAR_CODE.name;

    mapParam['barCodeType'] = barCodeType;
    mapParam['text'] = text;
    mapParam['height'] = height;
    mapParam['align'] = align;
    mapParam['width'] = width;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> sendPrinterQrCode({
    int qrSize = 4,
    String text = "Elgin Dev",
    String align = "Esquerda",
  }) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = PrinterFunctions.PRINTER_QR_CODE.name;

    mapParam['qrSize'] = qrSize;
    mapParam['align'] = align;
    mapParam['text'] = text;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> sendPrinterImage(String pathImage, bool isBase64) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = PrinterFunctions.PRINTER_IMAGE.name;

    mapParam['pathImage'] = pathImage;
    mapParam['isBase64'] = isBase64;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> sendPrinterNFCe(
      String xmlNFCe, int indexcsc, String csc, int param) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = PrinterFunctions.PRINTER_NFCE.name;

    mapParam['xmlNFCe'] = xmlNFCe;
    mapParam['indexcsc'] = indexcsc;
    mapParam['csc'] = csc;
    mapParam['param'] = param;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> sendPrinterSAT(String xmlSAT, int param) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = PrinterFunctions.PRINTER_SAT.name;

    mapParam['xmlSAT'] = xmlSAT;
    mapParam['param'] = param;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> getStatusPrinter() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = PrinterFunctions.PRINTER_STATUS.name;

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

    mapParam['typePrinter'] = PrinterFunctions.GAVETA_STATUS.name;

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

    mapParam['typePrinter'] = PrinterFunctions.PRINTER_CUPOM_TEF.name;

    mapParam['base64'] = base64;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> connectExternalImp(String ip, int port) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = PrinterFunctions.PRINTER_CONNECT_EXTERNAL.name;

    mapParam['ip'] = ip;
    mapParam['port'] = port;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> connectInternalImp() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = PrinterFunctions.PRINTER_CONNECT_INTERNAL.name;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> sendOpenGaveta() async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = PrinterFunctions.ABRIR_GAVETA.name;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> jumpLine(int quant) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = PrinterFunctions.JUMP_LINE.name;

    mapParam['quant'] = quant;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<int> cutPaper(int quant) async {
    Map<String, dynamic> mapParam = new Map();

    mapParam['typePrinter'] = PrinterFunctions.CUT_PAPER.name;

    mapParam['quant'] = quant;

    return await _sendFunctionToAndroid(mapParam);
  }
}
