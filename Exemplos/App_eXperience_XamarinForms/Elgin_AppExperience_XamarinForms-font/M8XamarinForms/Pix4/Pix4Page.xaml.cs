using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace M8XamarinForms
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Pix4Page : ContentPage
    {
        IPix4 pix4Service = DependencyService.Get<IPix4>();

        public Pix4Page()
        {
            InitializeComponent();

            pix4Service.ExecuteStoreImages();

            pix4Service.AbreConexaoDisplay();

            InitQrCodeViews();

            InitProductViews();

            InitActionButtons();

            //btnAbc.GestureRecognizers.Add(new TapGestureRecognizer
            //{
            //    NumberOfTapsRequired = 1,
            //    TappedCallback = o => pix4Obj.apresentaQrCodeLinkGihtub
            //});
        }

        private void InitQrCodeViews()
        {
            btnJava.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.ApresentaQrCodeLinkGihtub(Framework.JAVA))
            });
            btnDelphi.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.ApresentaQrCodeLinkGihtub(Framework.DELPHI))
            });
            btnFlutter.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.ApresentaQrCodeLinkGihtub(Framework.FLUTTER))
            });
            btnXamarinAndroid.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.ApresentaQrCodeLinkGihtub(Framework.XAMARIN_ANDROID))
            });
            btnXamarinForms.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.ApresentaQrCodeLinkGihtub(Framework.XAMARIN_FORMS))
            });
            btnReactNative.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.ApresentaQrCodeLinkGihtub(Framework.REACT_NATIVE))
            });
            btnKotlin.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.ApresentaQrCodeLinkGihtub(Framework.KOTLIN))
            });
            btnIonic.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.ApresentaQrCodeLinkGihtub(Framework.IONIC))
            });
        }

        private void InitProductViews() {
            btnAbacaxi.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.AdicionaProdutoApresenta(Produto.ABACAXI))
            });
            btnBanana.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.AdicionaProdutoApresenta(Produto.BANANA))
            });
            btnChocolate.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.AdicionaProdutoApresenta(Produto.CHOCOLATE))
            });
            btnDetergente.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.AdicionaProdutoApresenta(Produto.DETERGENTE))
            });
            btnErvilha.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.AdicionaProdutoApresenta(Produto.ERVILHA))
            });
            btnFeijao.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.AdicionaProdutoApresenta(Produto.FEIJAO))
            });
            btnGoiabada.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.AdicionaProdutoApresenta(Produto.GOIABADA))
            });
            btnHamburguer.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.AdicionaProdutoApresenta(Produto.HAMBURGUER))
            });
            btnIogurte.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.AdicionaProdutoApresenta(Produto.IOGURTE))
            });
            btnJaca.GestureRecognizers.Add(new TapGestureRecognizer
            {
                NumberOfTapsRequired = 1,
                Command = new Command(execute: () => pix4Service.AdicionaProdutoApresenta(Produto.JACA))
            });
        }

        private void InitActionButtons() {
            btnShowShoppingList.Clicked += delegate
            {
                pix4Service.ApresentaListaCompras();
            };
            btnLoadImages.Clicked += delegate
            {
                pix4Service.CarregarImagens();
            };
        }
    }
}