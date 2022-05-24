namespace M8XamarinForms
{
    public interface IIt4r
    {
        void VenderItem(string descricao, string valor, string Codigo);

        void EncerrarVenda(string valorTotal, string formaPagamento);

        void ConfigurarXmlNfce();

        string GetNumeroNota();

        string GetNumeroSerie();

        long GetTimeElapsedInLastEmission();

        string GetTextOfFile();
    }
}
