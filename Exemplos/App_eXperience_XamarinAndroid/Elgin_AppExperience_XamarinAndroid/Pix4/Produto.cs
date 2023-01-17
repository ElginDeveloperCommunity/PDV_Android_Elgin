using System;

namespace M8
{
    public class Produto
    {
        Produto(string nome, string preco, int fileImageResId,  string fileName)
        {
            Nome = nome;
            Preco = preco;
            FileImageResId = fileImageResId;
            FileName = fileName;
        }

        public string Nome { get; private set; }
        public string Preco { get; private set; }
        public int FileImageResId { get; private set; }
        public string FileName { get; private set; }

        public static Produto ABACAXI = new Produto("ABACAXI", "7.00", Resource.Drawable.pix4_image_abacaxi, "P1.jpg");
        public static Produto BANANA = new Produto("BANANA", "7.00", Resource.Drawable.pix4_image_banana, "P2.jpg");
        public static Produto CHOCOLATE = new Produto("CHOCOLATE", "7.00", Resource.Drawable.pix4_image_chocolate, "P3.jpg");
        public static Produto DETERGENTE = new Produto("DETERGENTE", "7.00", Resource.Drawable.pix4_image_detergente, "P4.jpg");
        public static Produto ERVILHA = new Produto("ERVILHA", "7.00", Resource.Drawable.pix4_image_ervilha, "P5.jpg");
        public static Produto FEIJAO = new Produto("FEIJAO", "7.00", Resource.Drawable.pix4_image_feijao, "P6.jpg");
        public static Produto GOIABADA = new Produto("GOIABADA", "7.00", Resource.Drawable.pix4_image_goiabada, "P7.jpg");
        public static Produto HAMBURGUER = new Produto("HAMBURGUER", "7.00", Resource.Drawable.pix4_image_hamburguer, "P8.jpg");
        public static Produto IOGURTE = new Produto("IOGURTE", "7.00", Resource.Drawable.pix4_image_iogurte, "P9.jpg");
        public static Produto JACA = new Produto("JACA", "7.00", Resource.Drawable.pix4_image_jaca, "P10.jpg");

        public static Produto[] values = new Produto[] { ABACAXI, BANANA, CHOCOLATE, DETERGENTE, ERVILHA, FEIJAO, GOIABADA, HAMBURGUER, IOGURTE, JACA };
    }
}