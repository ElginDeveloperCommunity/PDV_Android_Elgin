using M8XamarinForms.Kiosk;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class KioskPage : ContentPage
    {
        private static IKiosk kioskServiceObj = DependencyService.Get<IKiosk>();

        public KioskPage()
        {
            InitializeComponent();
            ViewsAssignment();
        }

        protected override bool OnBackButtonPressed()
        {
            kioskServiceObj.ResetKioskMode();
            return true;
        }

        private void ViewsAssignment()
        {
            switchNavigationBar.Toggled += delegate (object obj, ToggledEventArgs args) {
                kioskServiceObj.ExecuteKioskOperation(KioskConfig.BARRA_NAVEGACAO, args.Value);
            };

            switchStatusBar.Toggled += delegate (object obj, ToggledEventArgs args) {
                kioskServiceObj.ExecuteKioskOperation(KioskConfig.BARRA_STATUS, args.Value);
            };

            switchPowerButton.Toggled += delegate (object obj, ToggledEventArgs args) {
                kioskServiceObj.ExecuteKioskOperation(KioskConfig.BOTAO_POWER, args.Value);
            };

            buttonBack.Clicked += async delegate
            {
                kioskServiceObj.ResetKioskMode();
                await Navigation.PopAsync();
            };

            buttonFullKioskMode.Clicked += delegate { SetFullKioskMode(); };
        }

        // Ao forçar o "descheque" de todos os switches, todos os callbacks serão executados, logo, todas as operações de kiosk disponíveis serão executadas.
        private void SetFullKioskMode()
        {
            switchNavigationBar.IsToggled = false;
            switchStatusBar.IsToggled = false;
            switchPowerButton.IsToggled = false;
        }
    }
}