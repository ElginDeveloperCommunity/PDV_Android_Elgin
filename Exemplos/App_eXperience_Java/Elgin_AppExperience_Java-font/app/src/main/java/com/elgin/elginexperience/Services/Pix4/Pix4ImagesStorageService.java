package com.elgin.elginexperience.Services.Pix4;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

final public class Pix4ImagesStorageService {
    private final Context mContext;

    public Pix4ImagesStorageService(Context mContext) {
        this.mContext = mContext;
    }

    // Salva as imagens dos produtos, presentes em res/drawable, dentro do diretório Downloads do dispositivo.
    // É necessário para que, posteriamente, sejam carregadas dentro do dispositivo PIX4, já que as imagens só são carregadas no dispositivo através de referências para arquivos internos do M10.
    public void executeStoreImages() {
        for (Produto produto : Produto.values()) {
            // Carrega a imagem do produto como Bitmap.
            final Bitmap produtoImageBitmap = BitmapFactory.decodeResource(mContext.getResources(), produto.fileImageResId);

            // A imagem deve ser salva com as especificações máximas do dispositivo, para isso é a configuração no bitmap.
            final Bitmap bitmapFormatted = formatBitmapForPix4(produtoImageBitmap);

            storeImageWith72Dpi(bitmapFormatted, produto.fileName);
        }
    }

    // As especificações máximas de uma imagem para o funcionamento correto para o PIX4 é de 320 x 480.
    private Bitmap formatBitmapForPix4(Bitmap bitmap) {
        return Bitmap.createScaledBitmap(bitmap, 320, 480, false);
    }

    // Salva um bitmap como imagem .jpg no diretório Downloads do dispotivo.
    // No momento o PIX 4 via biblioteca android só possuí suporte a imagens com no máximo 72 DPI, por isto as imagens são modificadas para serem salvas contendo esta especifícação.
    private void storeImageWith72Dpi(Bitmap image, String fileName) {
        // Diretório.
        final String downloadsDirPath = "/storage/emulated/0/Download/";
        // Cria o arquivo no diretório.
        final File pictureFile = new File(downloadsDirPath + fileName);

        // Salva o bitmap como imagem no diretório.
        try {
            FileOutputStream fos = new FileOutputStream(pictureFile);

            ByteArrayOutputStream imageByteArray = new ByteArrayOutputStream();
            image.compress(Bitmap.CompressFormat.JPEG, 30, imageByteArray);
            byte[] imageData = imageByteArray.toByteArray();

            setDpi(imageData, 72);

            fos.write(imageData);
            fos.close();
        } catch (FileNotFoundException e) {
            Log.e("Error", "Arquivo não encontrado: " + e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            Log.e("Error", "Erro ao acessar o arquivo: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void setDpi(byte[] imageData, int dpi) {
        imageData[13] = 1;
        imageData[14] = (byte) (dpi >> 8);
        imageData[15] = (byte) (dpi & 0xff);
        imageData[16] = (byte) (dpi >> 8);
        imageData[17] = (byte) (dpi & 0xff);
    }

}
