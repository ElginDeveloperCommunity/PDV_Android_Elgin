using System;
using Xamarin.Forms;
using System.Threading.Tasks;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            MainPage = new NavigationPage(new MainPage());
        }

        protected override void OnStart()
        {
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
           
        }

        
    }
}
