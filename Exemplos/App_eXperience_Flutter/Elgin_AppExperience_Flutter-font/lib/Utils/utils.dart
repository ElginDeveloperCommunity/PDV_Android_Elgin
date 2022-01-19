class Utils {
  static bool validaIp(String ipServer) {
    RegExp regExp = new RegExp(
      r"^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$",
      caseSensitive: false,
      multiLine: false,
    );
    if (regExp.allMatches(ipServer).isEmpty) return false;
    return true;
  }

  static bool validaIpWithPort(String ipServer) {
    RegExp regExp = new RegExp(
      r"^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$",
      caseSensitive: false,
      multiLine: false,
    );
    if (regExp.allMatches(ipServer).isEmpty) return false;
    return true;
  }

  static String validaEntradasSitef(String value, String ip, int numParcelas) {
    if (value.isEmpty || int.parse(value) <= 0) {
      return "Verifique a entrada de valor de pagamento!";
    }
    if (!validaIp(ip)) {
      return "Digite um IP valido.\nExemplo: 192.168.0.31";
    }
    if (numParcelas <= 0) {
      return "Digite um número de parcelas valido, maior que 0";
    }
    return "";
  }
}
