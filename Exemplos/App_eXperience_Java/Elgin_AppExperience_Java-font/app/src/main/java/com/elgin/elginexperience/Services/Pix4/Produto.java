package com.elgin.elginexperience.Services.Pix4;

import com.elgin.elginexperience.R;

public enum Produto {
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

    final String nome; // Nome do produto. Será utilizado na tela do PIX 4.
    final String preco; // Preço do produto. Será utilizado na tela do PIX 4.

    /* O nome do arquivo, este parâmetro é utilizado para o salvamento da imagem do produto (localizadas em res/drawable) dentro do Minipdv. As imagens serão salva com este nome dentro do diretório /Download/.
     * Também é utilizado para o carregamento da imagem dentro do PIX 4, para que seja possível mostrar a imagem no dispositivo é necessário, primeiramente, carregar no dispositivo (com a função PIX4.CarregaImagemDisplay)
     * passando uma String que será utilizada para referênciar a imagem salva na hora do carregamento com (PIX4.ApresentaImagemDisplay()).
     * Exemplo: PIX4.CarregaImagemDisplay("P1.jpg") executada, para que a imagem carregada seja mostrada na tela deve ser passado exatamente a mesma String no carregamento, PIX4.ApresentaImagemDisplay("P1.jpg"). */
    final String fileName;

    final int fileImageResId; // Id do resource que sera carregado como bitmap, salvo como imagem no Minipdv e depois carregado, a partir da referência da localização onde foi salvo no Minipdv, para dentro do PIX 4.

    Produto(String preco, String fileName, int fileImageResId) {
        this.nome = this.name();
        this.preco = preco;
        this.fileName = fileName;
        this.fileImageResId = fileImageResId;
    }

}