using System;
using System.Collections.Generic;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class BalancaPage : ContentPage
    {
        string typeModel = "DP30CK";
        string typeProtocol = "PROTOCOL 0";

        public BalancaPage()
        {
            InitializeComponent();

            buttonConfigurarBalanca.Clicked += delegate {
                Dictionary<string, object> mapValues = new Dictionary<string, object>
                {
                    { "model", typeModel },
                    { "protocol", typeProtocol }
                };

                DependencyService.Get<IBalanca>().ConfigBalanca(mapValues);
            };
            buttonLerPeso.Clicked += delegate {
                string retorno = DependencyService.Get<IBalanca>().LerPesoBalanca();
                textReturnValueBalanca.Text = retorno;
            };
        }

        protected void OnModelChanged(object sender, CheckedChangedEventArgs e)
        {
            typeModel = e.Value.ToString();
        }

        private void PckProtocolo_SelectedIndexChanged(object sender, EventArgs e)
        {
            string itemSelecionado = pckProtocols.Items[pckProtocols.SelectedIndex];
            typeProtocol = itemSelecionado;
        }
    }
}