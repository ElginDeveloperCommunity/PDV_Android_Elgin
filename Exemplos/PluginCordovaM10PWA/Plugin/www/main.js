var exec = require('cordova/exec');

//Printer Functions

exports.AbreConexaoImpressora = function (params, success, error){
    exec(success, error, 'MainActivity', 'AbreConexaoImpressora', [params]);
}

exports.FechaConexaoImpressora = function (success, error){
    exec(success, error, 'MainActivity', 'FechaConexaoImpressora');
}

exports.AvancaPapel = function (params, success, error){
    exec(success, error, 'MainActivity', 'AvancaPapel', [params]);
}

exports.Corte = function (params, success, error){
    exec(success, error, 'MainActivity', 'Corte', [params]);
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

exports.AbreGavetaElgin = function (success, error){
    exec(success, error, 'MainActivity', 'AbreGavetaElgin');
}

exports.StatusImpressora = function (params, success, error){
    exec(success, error, 'MainActivity', 'StatusImpressora', [params]);
}


//CUSTOM METHOD
exports.imprimeImagem = function (params, success, error){
    exec(success, error, 'MainActivity', 'ImprimeImagem', [params]);
}


