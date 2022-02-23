var exec = require('cordova/exec');

exports.coolMethod = function (params, success, error) {
    exec(success, error, 'MainActivity', 'coolMethod', [params]);
};

//Funções do ElginPay

exports.iniciaVendaDebito = function (params, success, error){
    exec(success, error, 'MainActivity', 'iniciaVendaDebito', [params]);
}

exports.iniciaVendaCredito = function (params, success, error){
    exec(success, error, 'MainActivity', 'iniciaVendaCredito', [params]);
}

exports.iniciaCancelamentoVenda = function (params, success, error){
    exec(success, error, 'MainActivity', 'iniciaCancelamentoVenda', [params]);
}

exports.iniciaOperacaoAdministrativa = function (params, success, error){
    exec(success, error, 'MainActivity', 'iniciaOperacaoAdministrativa', [params]);
}

//Funções da Impressora

exports.AbreConexaoImpressora = function (params, success, error){
    exec(success, error, 'MainActivity', 'AbreConexaoImpressora', [params]);
}

exports.FechaConexaoImpressora = function (success, error){
    exec(success, error, 'MainActivity', 'FechaConexaoImpressora');
}

exports.AvancaPapel = function (params, success, error){
    exec(success, error, 'MainActivity', 'AvancaPapel', [params]);
}

exports.ImpressaoTexto = function (params, success, error){
    exec(success, error, 'MainActivity', 'ImpressaoTexto', [params]);
}

exports.ImpressaoCodigoBarras = function (params, success, error){
    exec(success, error, 'MainActivity', 'ImpressaoCodigoBarras', [params]);
}

exports.DefinePosicao = function (params, success, error){
    exec(success, error, 'MainActivity', 'DefinePosicao', [params]);
}

exports.ImpressaoQRCode = function (params, success, error){
    exec(success, error, 'MainActivity', 'ImpressaoQRCode', [params]);
}

exports.ImprimeXMLNFCe = function (params, success, error){
    exec(success, error, 'MainActivity', 'ImprimeXMLNFCe', [params]);
}

exports.ImprimeXMLSAT = function (params, success, error){
    exec(success, error, 'MainActivity', 'ImprimeXMLSAT', [params]);
}

exports.StatusImpressora = function (params, success, error){
    exec(success, error, 'MainActivity', 'StatusImpressora', [params]);
}

//Método extra
exports.imprimeImagem = function (success, error){
    exec(success, error, 'MainActivity', 'ImprimeImagem');
}