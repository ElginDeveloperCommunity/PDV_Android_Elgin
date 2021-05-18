import 'dart:math';
import 'package:flutter_m8/Struct/enums.dart';
import 'package:flutter_m8/services/services_tef/sitefController.dart';

class SitefFormat {
  Map<String, dynamic> formatSitefEntrysToJsonf({
    required SitefEntrys mSitefEntrys,
    required FunctionSitef mFunctionSitef,
  }) {
    Map<String, String> mapMsiTef = Map();
    mapMsiTef["empresaSitef"] = "00000000";
    mapMsiTef["enderecoSitef"] = mSitefEntrys.ip;
    mapMsiTef["operador"] = "0001";
    mapMsiTef["data"] = "20200324";
    mapMsiTef["hora"] = "130358";
    mapMsiTef["numeroCupom"] = new Random().nextInt(9999999).toString();
    mapMsiTef["valor"] = mSitefEntrys.value;
    mapMsiTef["CNPJ_CPF"] = "03654119000176";
    mapMsiTef["comExterna"] = "0";

    if (mFunctionSitef == FunctionSitef.SALE) {
      mapMsiTef.addAll(_formatSale(sitefEntrys: mSitefEntrys));
    }

    if (mFunctionSitef == FunctionSitef.CONFIGS) {
      mapMsiTef.addAll(_formatConfigs());
    }

    if (mFunctionSitef == FunctionSitef.CANCELL) {
      mapMsiTef.addAll(_formatCancel());
    }
    return mapMsiTef;
  }

  String _paymentToYourCode(String payment) {
    switch (payment) {
      case "Crédito":
        return "3";
      case "Débito":
        return "2";
      case "Todos":
        return "0";
      default:
        return "0";
    }
  }

  Map<String, String> _formatSale({required SitefEntrys sitefEntrys}) {
    Map<String, String> mapMsiTef = Map();
    mapMsiTef["modalidade"] = _paymentToYourCode(sitefEntrys.paymentMethod);
    if (sitefEntrys.paymentMethod == "Crédito") {
      if (sitefEntrys.numberInstallments == 1 || sitefEntrys.numberInstallments == 0) {
        mapMsiTef["transacoesHabilitadas"] = "26";
        mapMsiTef["numParcelas"] = "";
      } else if (sitefEntrys.installmentsMethod == "Loja") {
        mapMsiTef["transacoesHabilitadas"] = "27";
      } else if (sitefEntrys.installmentsMethod == "Adm") {
        mapMsiTef["transacoesHabilitadas"] = "28";
      }
      mapMsiTef["numParcelas"] = sitefEntrys.numberInstallments.toString();
    }
    if (sitefEntrys.paymentMethod == "Débito") {
      mapMsiTef["transacoesHabilitadas"] = "16";
      mapMsiTef["numParcelas"] = "";
    }
    if (sitefEntrys.paymentMethod == "Todos") {
      mapMsiTef["restricoes"] = "transacoesHabilitadas=16";
      mapMsiTef["transacoesHabilitadas"] = "";
      mapMsiTef["numParcelas"] = "";
    }
    return mapMsiTef;
  }

  Map<String, String> _formatCancel() {
    Map<String, String> mapMsiTef = Map();
    mapMsiTef["modalidade"] = "200";
    mapMsiTef["transacoesHabilitadas"] = "";
    mapMsiTef["isDoubleValidation"] = "0";
    mapMsiTef["restricoes"] = "";
    mapMsiTef["caminhoCertificadoCA"] = "ca_cert_perm";
    return mapMsiTef;
  }

  Map<String, String> _formatConfigs() {
    Map<String, String> mapMsiTef = Map();
    mapMsiTef["modalidade"] = "110";
    mapMsiTef["isDoubleValidation"] = "0";
    mapMsiTef["restricoes"] = "";
    mapMsiTef["transacoesHabilitadas"] = "";
    mapMsiTef["caminhoCertificadoCA"] = "ca_cert_perm";
    mapMsiTef["restricoes"] = "transacoesHabilitadas=16;26;27";
    return mapMsiTef;
  }
}
