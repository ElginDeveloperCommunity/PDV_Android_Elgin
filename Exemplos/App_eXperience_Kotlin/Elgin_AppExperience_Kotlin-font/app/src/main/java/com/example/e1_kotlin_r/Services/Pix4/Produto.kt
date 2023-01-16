package com.example.e1_kotlin_r.Services.Pix4

import com.example.e1_kotlin_r.R

enum class Produto(val preco: String, val fileName: String, val fileImageResId: Int) {
    ABACAXI("7.00", "P1.jpg", R.drawable.pix4_image_abacaxi),
    BANANA("8.50", "P2.jpg", R.drawable.pix4_image_banana),
    CHOCOLATE("10.00", "P3.jpg", R.drawable.pix4_image_chocolate),
    DETERGENTE("6.00", "P4.jpg", R.drawable.pix4_image_detergente),
    ERVILHA("4.00", "P5.jpg", R.drawable.pix4_image_ervilha),
    FEIJAO("8.00", "P6.jpg", R.drawable.pix4_image_feijao),
    GOIABADA("9.00", "P7.jpg", R.drawable.pix4_image_goiabada),
    HAMBURGUER("14.00", "P8.jpg", R.drawable.pix4_image_hamburguer),
    IOGURTE("11.00", "P9.jpg", R.drawable.pix4_image_iogurte),
    JACA("9.00", "P10.jpg", R.drawable.pix4_image_jaca);
}