package com.elginm8.Pix4;

public class Produto {
    public String nome;
    public String preco;
    public String assetFileName;
    public String outputFileName;

    public Produto(String nome, String preco, String assetFileName, String outputFileName) {
        this.nome = nome;
        this.preco = preco;
        this.assetFileName = assetFileName;
        this.outputFileName = outputFileName;
    }

    public static Produto[] values() {
        Produto productList[] = new Produto[]{
                new Produto("ABACAXI", "7.00", "pix4_image_abacaxi", "P1.jpg"),
                new Produto("BANANA", "7.00", "pix4_image_banana", "P2.jpg"),
                new Produto("CHOCOLATE", "7.00", "pix4_image_chocolate", "P3.jpg"),
                new Produto("DETERGENTE", "7.00", "pix4_image_detergente", "P4.jpg"),
                new Produto("ERVILHA", "7.00", "pix4_image_ervilha", "P5.jpg"),
                new Produto("FEIJAO", "7.00", "pix4_image_feijao", "P6.jpg"),
                new Produto("GOIABADA", "7.00", "pix4_image_goiabada", "P7.jpg"),
                new Produto("HAMBURGUER", "7.00", "pix4_image_hamburguer", "P8.jpg"),
                new Produto("IOGURTE", "7.00", "pix4_image_iogurte", "P9.jpg"),
                new Produto("JACA", "7.00", "pix4_image_jaca", "P10.jpg")
        };
        return productList;
    }
}
