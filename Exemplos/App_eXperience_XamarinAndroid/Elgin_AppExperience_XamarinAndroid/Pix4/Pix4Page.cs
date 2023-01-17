using Android.App;
using Android.Widget;
using Android.OS;

using static M8.Framework;
using static M8.Produto;

namespace M8
{
    [Activity(Label = "Pix4Page")]
    public class Pix4Page : Activity
    {
        private Pix4Service pix4Obj;
        private Pix4ImagesStorageService pix4ImagesStorageService;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.activity_pix4_page);

            pix4ImagesStorageService = new Pix4ImagesStorageService(this);
            pix4ImagesStorageService.ExecuteStoreImages();

            pix4Obj = new Pix4Service(this);
            pix4Obj.AbreConexaoDisplay();

            InitQrCodeViews();
            InitProductViews();
            InitActionButtons();
        }

        private void InitQrCodeViews()
        {
            LinearLayout buttonJava = FindViewById<LinearLayout>(Resource.Id.buttonJava);
            LinearLayout buttonDelphi = FindViewById<LinearLayout>(Resource.Id.buttonDelphi);
            LinearLayout buttonFlutter = FindViewById<LinearLayout>(Resource.Id.buttonFlutter);
            LinearLayout buttonXamarinAndroid = FindViewById<LinearLayout>(Resource.Id.buttonXamarinAndroid);
            LinearLayout buttonXamarinForms = FindViewById<LinearLayout>(Resource.Id.buttonXamarinForms);
            LinearLayout buttonReactNative = FindViewById<LinearLayout>(Resource.Id.buttonReactNative);
            LinearLayout buttonKotlin = FindViewById<LinearLayout>(Resource.Id.buttonKotlin);
            LinearLayout buttonIonic = FindViewById<LinearLayout>(Resource.Id.buttonIonic);

            buttonJava.Click += (sender, e) => pix4Obj.ApresentaQrCodeLinkGihtub(JAVA);
            buttonDelphi.Click += (sender, e) => pix4Obj.ApresentaQrCodeLinkGihtub(DELPHI);
            buttonFlutter.Click += (sender, e) => pix4Obj.ApresentaQrCodeLinkGihtub(FLUTTER);
            buttonXamarinAndroid.Click += (sender, e) => pix4Obj.ApresentaQrCodeLinkGihtub(XAMARIN_ANDROID);
            buttonXamarinForms.Click += (sender, e) => pix4Obj.ApresentaQrCodeLinkGihtub(XAMARIN_FORMS);
            buttonReactNative.Click += (sender, e) => pix4Obj.ApresentaQrCodeLinkGihtub(REACT_NATIVE);
            buttonKotlin.Click += (sender, e) => pix4Obj.ApresentaQrCodeLinkGihtub(KOTLIN);
            buttonIonic.Click += (sender, e) => pix4Obj.ApresentaQrCodeLinkGihtub(IONIC);
        }

        private void InitProductViews()
        {
            LinearLayout buttonAbacaxi = FindViewById<LinearLayout>(Resource.Id.buttonAbacaxi);
            LinearLayout buttonBanana = FindViewById<LinearLayout>(Resource.Id.buttonBanana);
            LinearLayout buttonChocolote = FindViewById<LinearLayout>(Resource.Id.buttonChocolate);
            LinearLayout buttonDetergente = FindViewById<LinearLayout>(Resource.Id.buttonDetergente);
            LinearLayout buttonErvilha = FindViewById<LinearLayout>(Resource.Id.buttonErvilha);
            LinearLayout buttonFeijao = FindViewById<LinearLayout>(Resource.Id.buttonFeijao);
            LinearLayout buttonGoiabada = FindViewById<LinearLayout>(Resource.Id.buttonGoiabada);
            LinearLayout buttonHamburguer = FindViewById<LinearLayout>(Resource.Id.buttonHamburguer);
            LinearLayout buttonIogurte = FindViewById<LinearLayout>(Resource.Id.buttonIogurte);
            LinearLayout buttonJaca = FindViewById<LinearLayout>(Resource.Id.buttonJaca);

            buttonAbacaxi.Click += (sender, e) => pix4Obj.AdicionaProdutoApresenta(ABACAXI);
            buttonBanana.Click += (sender, e) => pix4Obj.AdicionaProdutoApresenta(BANANA);
            buttonChocolote.Click += (sender, e) => pix4Obj.AdicionaProdutoApresenta(CHOCOLATE);
            buttonDetergente.Click += (sender, e) => pix4Obj.AdicionaProdutoApresenta(DETERGENTE);
            buttonErvilha.Click += (sender, e) => pix4Obj.AdicionaProdutoApresenta(ERVILHA);
            buttonFeijao.Click += (sender, e) => pix4Obj.AdicionaProdutoApresenta(FEIJAO);
            buttonGoiabada.Click += (sender, e) => pix4Obj.AdicionaProdutoApresenta(GOIABADA);
            buttonHamburguer.Click += (sender, e) => pix4Obj.AdicionaProdutoApresenta(HAMBURGUER);
            buttonIogurte.Click += (sender, e) => pix4Obj.AdicionaProdutoApresenta(IOGURTE);
            buttonJaca.Click += (sender, e) => pix4Obj.AdicionaProdutoApresenta(JACA);
        }

        private void InitActionButtons()
        {
            Button buttonShowShoppingList = FindViewById<Button>(Resource.Id.buttonShowShoppingList);
            buttonShowShoppingList.Click += (sender, e) => pix4Obj.ApresentaListaCompras();

            Button buttonLoadImages = FindViewById<Button>(Resource.Id.buttonLoadImagesOnPIX4);
            buttonLoadImages.Click += (sender, e) => pix4Obj.CarregarImagens();
        }

    }
}

