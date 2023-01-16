package com.example.e1_kotlin_r.Services.Pix4

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import com.example.e1_kotlin_r.Pix4Page
import java.io.*

class Pix4ImagesStorageService(val mContext: Context) {

    // Salva as imagens dos produtos, presentes em res/drawable, dentro do diretório Downloads do dispositivo.
    // É necessário para que, posteriamente, sejam carregadas dentro do dispositivo PIX4, já que as imagens só são carregadas no dispositivo através de referências para arquivos internos do M10.
    fun executeStoreImages() {
        for (produto in Produto.values()) {
            // Carrega a imagem do produto como Bitmap.
            val produtoImageBitmap =
                BitmapFactory.decodeResource(mContext!!.resources, produto.fileImageResId)

            // A imagem deve ser salva com as especificações máximas do dispositivo, para isso é a configuração no bitmap.
            val bitmapFormatted = formatBitmapForPix4(produtoImageBitmap)
            storeImageWith72Dpi(bitmapFormatted, produto.fileName)
        }
    }

    // As especificações máximas de uma imagem para o funcionamento correto para o PIX4 é de 320 x 480.
    private fun formatBitmapForPix4(bitmap: Bitmap): Bitmap {
        return Bitmap.createScaledBitmap(bitmap, 320, 480, false)
    }

    // Salva um bitmap como imagem .jpg no diretório Downloads do dispotivo.
    // No momento o PIX 4 via biblioteca android só possuí suporte a imagens com no máximo 72 DPI, por isto as imagens são modificadas para serem salvas contendo esta especifícação.
    private fun storeImageWith72Dpi(image: Bitmap, fileName: String?) {
        // Diretório.
        val downloadsDirPath = "/storage/emulated/0/Download/"
        // Cria o arquivo no diretório.
        val pictureFile = File(downloadsDirPath + fileName)

        // Salva o bitmap como imagem no diretório.
        try {
            val fos = FileOutputStream(pictureFile)
            val imageByteArray = ByteArrayOutputStream()
            image.compress(Bitmap.CompressFormat.JPEG, 30, imageByteArray)
            val imageData = imageByteArray.toByteArray()
            setDpi(imageData, 72)
            fos.write(imageData)
            fos.close()
        } catch (e: FileNotFoundException) {
            Log.e("Error", "Arquivo não encontrado: " + e.message)
            e.printStackTrace()
        } catch (e: IOException) {
            Log.e("Error", "Erro ao acessar o arquivo: " + e.message)
            e.printStackTrace()
        }
    }

    private fun setDpi(imageData: ByteArray, dpi: Int) {
        imageData[13] = 1
        imageData[14] = (dpi shr 8).toByte()
        imageData[15] = (dpi and 0xff).toByte()
        imageData[16] = (dpi shr 8).toByte()
        imageData[17] = (dpi and 0xff).toByte()
    }
}