package com.example.e1_elgin_kotlin

import java.io.BufferedReader
import java.io.DataOutputStream
import java.io.InputStreamReader
import java.io.UnsupportedEncodingException
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

class APIShipay {

    fun APIShipPay() {}

    fun executeRequest(
        targetURL: String?,
        method: String?,
        parameters: Map<String?, String?>
    ): String? {
        var con: HttpURLConnection? = null
        return try {
            //Create connection
            val url = URL(targetURL)
            con = url.openConnection() as HttpURLConnection
            con.requestMethod = method

            //Send request
            con!!.doOutput = true
            val out = DataOutputStream(con.outputStream)
            out.writeBytes(ParameterStringBuilder.getParamsString(parameters))
            out.flush()
            out.close()

            //Get Response
            val status = con.responseCode
            val `in` = BufferedReader(
                InputStreamReader(con.inputStream)
            )
            var inputLine: String?
            val content = StringBuilder()
            while (`in`.readLine().also { inputLine = it } != null) {
                content.append(inputLine)
            }
            `in`.close()
            content.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            null
        } finally {
            con?.disconnect()
        }
    }

    fun executeGET(targetURL: String?, parameters: Map<String?, String?>): String? {
        return executeRequest(targetURL, "GET", parameters)
    }

    fun executePOST(targetURL: String?, parameters: Map<String?, String?>): String? {
        return executeRequest(targetURL, "POST", parameters)
    }

    private object ParameterStringBuilder {
        @Throws(UnsupportedEncodingException::class)
        fun getParamsString(params: Map<String?, String?>): String {
            val result = StringBuilder()
            for ((key, value) in params) {
                result.append(URLEncoder.encode(key, "UTF-8"))
                result.append("=")
                result.append(URLEncoder.encode(value, "UTF-8"))
                result.append("&")
            }
            val resultString = result.toString()
            return if (resultString.length > 0) resultString.substring(
                0,
                resultString.length - 1
            ) else resultString
        }
    }
}
