using BR.Com.Daruma.Framework.Mobile;

namespace M8
{
    public abstract class It4rAbstract
    {
        protected DarumaMobile dmf;

        protected It4rAbstract(DarumaMobile dmfObject)
        {
            dmf = dmfObject;
        }

        public abstract void VenderItem(string descricao, string valor, string Codigo);

        public abstract void EncerrarVenda(string valorTotal, string formaPagamento);

        public abstract void ConfigurarXmlNfce();
    }
}