namespace M8XamarinForms
{
    public interface IPix4
    {
        void AbreConexaoDisplay();

        int InicializaDisplay();

        int ReinicializaDisplay();

        int DesconectarDisplay();

        int ObtemVersãoFirmware();

        int ApresentaImagemProdutoDisplay(Produto produto);

        void ApresentaQrCodeLinkGihtub(Framework framework);

        void AdicionaProdutoApresenta(Produto produto);

        void ApresentaListaCompras();

        void CarregarImagens();

        void ExecuteStoreImages();
    }
}
