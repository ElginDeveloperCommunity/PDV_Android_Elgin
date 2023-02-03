import 'package:flutter/services.dart';
import 'package:flutter_m8/Struct/enums.dart';

//Enumerator usado para formatar qual função deverá ser utilizada na parte nativa da aplicação
enum FunctionsBridge
  {
    IniciaVendaDebito,
    IniciaVendaCredito,
    IniciaCancelamentoVenda,
    IniciaOperacaoAdministrativa,
    ImprimirCupomNfce,
    ImprimirCupomSat,
    ImprimirCupomSatCancelamento,
    SetSenha,
    ConsultarStatus,
    GetTimeout,
    ConsultarUltimaTransacao,
    SetSenharServer,
    SetTimeout,
    GetServer,
    SetServer
  }

class BridgeService{

  final _platform = const MethodChannel('samples.flutter.elgin/ElginServices');

  Future<String> _sendFunctionToAndroid(Map<String, dynamic> args) async {
    return await _platform.invokeMethod("bridge", {"args": args});
  }

  Future<String> iniciaVendaDebito(
    {
      required int idTransacao,
      required String pdv,
      required String valorTotal 
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.IniciaVendaDebito.name;

    mapParam['idTransacao'] = idTransacao;
    mapParam['pdv'] = pdv;
    mapParam['valorTotal'] = valorTotal;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> iniciaVendaCredito(
    {
      required int idTransacao,
      required String pdv,
      required String valorTotal,
      required InstallmentMethod tipoFinanciamento,
      required int numeroParcelas
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.IniciaVendaCredito.name;

    mapParam['idTransacao'] = idTransacao;
    mapParam['pdv'] = pdv;
    mapParam['valorTotal'] = valorTotal;
    mapParam['tipoFinanciamento'] = tipoFinanciamento.correspondingValue();
    mapParam['numeroParcelas'] = numeroParcelas;

    return await _sendFunctionToAndroid(mapParam);
  }

    /// @param dataHora deve ser enviado no formato dd/mm/aa
    /// @param nsu é a ref da transação a ser cancelada
   Future<String> iniciaCancelamentoVenda(
    {
      required int idTransacao,
      required String pdv,
      required String valorTotal,
      required String dataHora,
      required String nsu
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.IniciaCancelamentoVenda.name;

    mapParam['idTransacao'] = idTransacao;
    mapParam['pdv'] = pdv;
    mapParam['valorTotal'] = valorTotal;
    mapParam['dataHora'] = dataHora;
    mapParam['nsu'] = nsu;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> iniciaOperacaoAdministrativa(
    {
      required int idTransacao,
      required String pdv,
      required int operacao 
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.IniciaOperacaoAdministrativa.name;

    mapParam['idTransacao'] = idTransacao;
    mapParam['pdv'] = pdv;
    mapParam['operacao'] = operacao;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> imprimirCupomNfce(
    {
      required String xml,
      required int indexcsc,
      required String csc
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.ImprimirCupomNfce.name;

    mapParam['xml'] = xml;
    mapParam['indexcsc'] = indexcsc;
    mapParam['csc'] = csc;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> imprimirCupomSat(
    {
      required String xml
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.ImprimirCupomSat.name;

    mapParam['xml'] = xml;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> imprimirCupomSatCancelamento(
    {
      required String xml,
      required String assQRCode
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.ImprimirCupomSatCancelamento.name;

    mapParam['xml'] = xml;
    mapParam['assQRCode'] = assQRCode;

    return await _sendFunctionToAndroid(mapParam);
  }
  
  /// @param habilitada define se o Bridge irá tentar validar o terminal ou não a senha passada em @param senha
  Future<String> setSenha(
    {
      required String senha,
      required bool habilitada
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.SetSenha.name;

    mapParam['senha'] = senha;
    mapParam['habilitada'] = habilitada;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> consultarStatus() 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.ConsultarStatus.name;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> getTimeout() 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.GetTimeout.name;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> consultarUltimaTransacao(
    {
      required String pdv
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.ConsultarUltimaTransacao.name;

    mapParam['pdv'] = pdv;

    return await _sendFunctionToAndroid(mapParam);
  }

  //Configura a senha no terminal POS, para a exclusão de senha o @param senha deve ser passado uma String limpa ("") e o bool como falso, sinalizando o desligamento da senha
  Future<String> setSenhaServer(
    {
      required String senha,
      required bool habilitada
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.SetSenharServer.name;

    mapParam['senha'] = senha;
    mapParam['habilitada'] = habilitada;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> setTimeout(
    {
      required int timeout
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.SetTimeout.name;

    mapParam['timeout'] = timeout;

    return await _sendFunctionToAndroid(mapParam);
  }

  
  Future<String> getServer() 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.GetServer.name;

    return await _sendFunctionToAndroid(mapParam);
  }

  Future<String> setServer(
    {
      required String ipTerminal,
      required int portaTransacao,
      required int portaStatus 
    }
  ) 
  async{
    Map<String, dynamic> mapParam = new Map();

    mapParam['typeBridge'] = FunctionsBridge.SetServer.name;

    mapParam['ipTerminal'] = ipTerminal;
    mapParam['portaTransacao'] = portaTransacao;
    mapParam['portaStatus'] = portaStatus;

    return await _sendFunctionToAndroid(mapParam);
  }


}