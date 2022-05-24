package com.example.e1_kotlin_r.Services

import android.content.Context
import android.widget.Toast

import android.os.Environment
import android.util.Base64
import android.util.Log

import br.com.elgin.Sat

import br.com.elgin.DeviceInfo

import br.com.elgin.SatInitializer
import java.io.File
import java.io.FileWriter
import java.lang.Exception
import java.util.*


class SatService(context: Context) {
    private val contextSat: Context

    //Diretório Raiz da aplicação
    var BASE_ROOT_DIR: String
    private val SATLOG_ARCHIVE_NAME = "SatLog.txt"
    fun ativarSAT(map: Map<*, *>): String {
        var retorno = "..."
        val numSessao = map["numSessao"] as Int
        val subComando = map["subComando"] as Int
        val codeAtivacao = map["codeAtivacao"] as String?
        val cnpj = map["cnpj"] as String?
        val cUF = map["cUF"] as Int
        retorno = Sat.ativarSat(numSessao, subComando, codeAtivacao, cnpj, cUF)
        mostrarRetorno(retorno)
        return retorno
    }

    fun associarAssinatura(map: Map<*, *>): String {
        var retorno = "..."
        val numSessao = map["numSessao"] as Int
        val codeAtivacao = map["codeAtivacao"] as String?
        val cnpjSh = map["cnpjSh"] as String?
        val assinaturaAC = map["assinaturaAC"] as String?
        retorno = Sat.associarAssinatura(numSessao, codeAtivacao, cnpjSh, assinaturaAC)
        mostrarRetorno(retorno)
        return retorno
    }

    fun consultarSAT(map: Map<*, *>): String {
        var result = "..."
        val numSessao = map["numSessao"] as Int
        result = Sat.consultarSat(numSessao)
        mostrarRetorno(result)
        return result
    }

    fun statusOperacional(map: Map<*, *>): String {
        var retorno = "..."
        val numSessao = map["numSessao"] as Int
        val codeAtivacao = map["codeAtivacao"] as String?
        retorno = Sat.consultarStatusOperacional(numSessao, codeAtivacao)
        mostrarRetorno(retorno)
        return retorno
    }

    fun enviarVenda(map: Map<*, *>): String {
        var retorno = "..."
        val numSessao = map["numSessao"] as Int
        val codeAtivacao = map["codeAtivacao"] as String?
        val xmlSale = map["xmlSale"] as String?
        retorno = Sat.enviarDadosVenda(numSessao, codeAtivacao, xmlSale)
        mostrarRetorno(retorno)
        return retorno
    }

    fun cancelarVenda(map: Map<*, *>): String {
        var retorno = "..."
        val numSessao = map["numSessao"] as Int
        val codeAtivacao = map["codeAtivacao"] as String?
        val cFeNumber = map["cFeNumber"] as String?
        val xmlCancelamento = map["xmlCancelamento"] as String?
        retorno = Sat.cancelarUltimaVenda(numSessao, codeAtivacao, cFeNumber, xmlCancelamento)
        mostrarRetorno(retorno)
        return retorno
    }

    fun deviceInfo(): String {
        val retorno = "..."
        val deviceInfo: Optional<DeviceInfo> = Sat.getDeviceInfo()
        System.out.println(deviceInfo)
        return "aaa"
    }

    private fun mostrarRetorno(retorno: String) {
        Toast.makeText(contextSat, String.format("Retorno: %s", retorno), Toast.LENGTH_LONG).show()
    }

    fun extrairLog(map: Map<*, *>): Boolean {
        val numSessao = map["numSessao"] as Int
        val codeAtivacao = map["codeAtivacao"] as String?
        var extractedLog = ""
        extractedLog = Sat.extrairLogs(numSessao, codeAtivacao)

        //Se o sat não estiver conectado ou algum outro problema tiver ocorrido, o retorno de Sat.extrairLogs()  será 'DeviceNotFound' e função não foi bem sucedida!
        if (extractedLog == "DeviceNotFound") {
            mostrarRetorno(extractedLog)
            return false
        }

        //O texto a ser salvo está na 6° posição ao separar a String por '|'
        val extractedLogInArray = extractedLog.split("|")
        Log.d("DEBUG", extractedLogInArray[0])

        //O texto a ser salvo está em base64 e deve ser decodificado antes de ser salvo no arquivo .txt
        val byteArrayWithStringConverted = Base64.decode(extractedLogInArray[5], Base64.DEFAULT)
        val logtoBeSavedInStorage = String(byteArrayWithStringConverted)

        //Tenta criar o dir ROOT onde a aplicação irá conseguir salvar o arquivo do logsat
        createRootDirectory(contextSat)
        writeFileOnStorage(SATLOG_ARCHIVE_NAME, logtoBeSavedInStorage)
        return true
    }

    //Função que cria o diretório root da aplicação (com.packagename) localizado em Android/data
    //diretório que será utilizado para salvar o arquivo de log do sat
    private fun createRootDirectory(ctx: Context): Boolean {
        // Constant, copied here: private static final String BASE_DIR = "/Android/data/";
        val dataDir = storagePathToAbsolutePath(BASE_ROOT_DIR)
        Log.d("MADARA", dataDir)
        Log.d("MADARA", storagePathToAbsolutePath(BASE_ROOT_DIR))
        val f = File(dataDir)
        return f.mkdirs()
    }

    private fun writeFileOnStorage(fileNameWithExtension: String, textToWrite: String) {
        Log.d("MADARA", "oi2")
        val file = File(storagePathToAbsolutePath(BASE_ROOT_DIR), "files")
        if (!file.exists()) {
            Log.d("MADARA", "oi3")
            file.mkdir()
        }
        try {
            Log.d("MADARA", "oi4")
            val gpxfile = File(file, fileNameWithExtension)
            val writer = FileWriter(gpxfile)
            writer.append(textToWrite)
            writer.flush()
            writer.close()
            Toast.makeText(contextSat, "Saved your text in " + gpxfile.getPath(), Toast.LENGTH_LONG)
                .show()
        } catch (e: Exception) {
            Log.d("MADARA", e.toString())
            e.printStackTrace()
        }
    }

    @JvmName("getBASE_ROOT_DIR1")
    fun getBASE_ROOT_DIR(): String {

        return BASE_ROOT_DIR
    }




    companion object {
        lateinit var satInitializer: SatInitializer

        //Função que retorna o PATH absoluto do storage do Android, utilizada para criar o diretório root caso não exista
        //e para prover o PATH correto onde escrever o logSAT extraído
        private fun storagePathToAbsolutePath(pathFromStorageRoot: String): String {
            val buffer = StringBuffer(255)
            buffer.append(Environment.getExternalStorageDirectory().absolutePath)
            if (pathFromStorageRoot[0] != '/') {
                buffer.append('/')
            }
            buffer.append(pathFromStorageRoot)
            return buffer.toString()
        }
    }

    init {
        satInitializer = SatInitializer()
        contextSat = context
        BASE_ROOT_DIR = "/Android/data/" + contextSat.getPackageName().toString() + "/"
    }
}