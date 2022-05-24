using Android.App;
using Android.OS;
using Android.Views;
using Android.Views.InputMethods;
using Android.Widget;

namespace M8
{
    [Activity(Label = "CodigoDeBarras")]
    public class CodigoDeBarras : Activity
    {
        TextView editSucessMessage1, editSucessMessage2, editSucessMessage3, editSucessMessage4, editSucessMessage5, editSucessMessage6, editSucessMessage7, editSucessMessage8, editSucessMessage9, editSucessMessage10;
        ImageView imageField1, imageField2, imageField3, imageField4, imageField5, imageField6, imageField7, imageField8, imageField9, imageField10;
        EditText editCodbar1, editCodbar2, editCodbar3, editCodbar4, editCodbar5, editCodbar6, editCodbar7, editCodbar8, editCodbar9, editCodbar10;

        Button btniniciarLeitura, btnLimparCampos;

       
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.codigo_de_barras);

            //Edits
            editSucessMessage1 = FindViewById<TextView>(Resource.Id.editSucessMessage1);
            editSucessMessage2 = FindViewById<TextView>(Resource.Id.editSucessMessage2);
            editSucessMessage3= FindViewById<TextView>(Resource.Id.editSucessMessage3);
            editSucessMessage4 = FindViewById<TextView>(Resource.Id.editSucessMessage4);
            editSucessMessage5 = FindViewById<TextView>(Resource.Id.editSucessMessage5);
            editSucessMessage6 = FindViewById<TextView>(Resource.Id.editSucessMessage6);
            editSucessMessage7 = FindViewById<TextView>(Resource.Id.editSucessMessage7);
            editSucessMessage8 = FindViewById<TextView>(Resource.Id.editSucessMessage8);
            editSucessMessage9 = FindViewById<TextView>(Resource.Id.editSucessMessage9);
            editSucessMessage10 = FindViewById<TextView>(Resource.Id.editSucessMessage10);

            //ImageViews
            imageField1 = FindViewById<ImageView>(Resource.Id.imageField1);
            imageField2 = FindViewById<ImageView>(Resource.Id.imageField2);
            imageField3 = FindViewById<ImageView>(Resource.Id.imageField3);
            imageField4 = FindViewById<ImageView>(Resource.Id.imageField4);
            imageField5 = FindViewById<ImageView>(Resource.Id.imageField5);
            imageField6 = FindViewById<ImageView>(Resource.Id.imageField6);
            imageField7 = FindViewById<ImageView>(Resource.Id.imageField7);
            imageField8 = FindViewById<ImageView>(Resource.Id.imageField8);
            imageField9 = FindViewById<ImageView>(Resource.Id.imageField9);
            imageField10 = FindViewById<ImageView>(Resource.Id.imageField10);

            //Edittexts
            editCodbar1 = FindViewById<EditText>(Resource.Id.editCodbar1);
            editCodbar2 = FindViewById<EditText>(Resource.Id.editCodbar2);
            editCodbar3 = FindViewById<EditText>(Resource.Id.editCodbar3);
            editCodbar4 = FindViewById<EditText>(Resource.Id.editCodbar4);
            editCodbar5 = FindViewById<EditText>(Resource.Id.editCodbar5);
            editCodbar6 = FindViewById<EditText>(Resource.Id.editCodbar6);
            editCodbar7 = FindViewById<EditText>(Resource.Id.editCodbar7);
            editCodbar8 = FindViewById<EditText>(Resource.Id.editCodbar8);
            editCodbar9 = FindViewById<EditText>(Resource.Id.editCodbar9);
            editCodbar10 = FindViewById<EditText>(Resource.Id.editCodbar10);

            //Buttons
            btniniciarLeitura = FindViewById<Button>(Resource.Id.buttonIniciarLeitura);
            btnLimparCampos = FindViewById<Button>(Resource.Id.buttonLimparCampos);

            //Tornar invisivel todas as notificações de leitura inicialmente
            TurnAllLinesInvisible();

            //Desabilitar o Focus em todas as Edits
            DisableFocusOnAllEditViews();

            //Atribuir a funcionalidade de todas as views
            InitViewsFunc();
        }

        public void hideKeyboard(EditText e)
        {
            var inputManager = (InputMethodManager)GetSystemService(InputMethodService);
            inputManager.HideSoftInputFromWindow(e.WindowToken, HideSoftInputFlags.None);
        }

        public void TurnLineViewsVisible(ImageView imageView, TextView textView)
        {
            imageView.Visibility = ViewStates.Visible;
            textView.Visibility = ViewStates.Visible;
        }

        public void TurnLineViewsInvisible(ImageView imageView, TextView textView)
        {
            imageView.Visibility = ViewStates.Invisible;
            textView.Visibility = ViewStates.Invisible;
        }


        public void InitViewsFunc()
        {
            btniniciarLeitura.Click += delegate
            {
                editCodbar1.FocusableInTouchMode = true;
                editCodbar1.RequestFocus();
            };

            btnLimparCampos.Click += delegate
            {
                editCodbar1.Text = "";
                editCodbar2.Text = "";
                editCodbar3.Text = "";
                editCodbar4.Text = "";
                editCodbar5.Text = "";
                editCodbar6.Text = "";
                editCodbar7.Text = "";
                editCodbar8.Text = "";
                editCodbar9.Text = "";
                editCodbar10.Text = "";

                DisableFocusOnAllEditViews();
                TurnAllLinesInvisible();
            };

            //Se o campo 10 contem algo, desabilite os EditTexts para evitar loop nos campos.
            editCodbar1.FocusChange += delegate
            {
                if (editCodbar10.Text != "") DisableFocusOnAllEditViews();
            };
            
            editCodbar1.TextChanged += delegate
            {
                TurnLineViewsVisible(imageField1, editSucessMessage1);
                editCodbar2.FocusableInTouchMode = true;
                hideKeyboard(editCodbar1);
            };

            editCodbar2.TextChanged += delegate
            {
                TurnLineViewsVisible(imageField2, editSucessMessage2);
                editCodbar3.FocusableInTouchMode = true;
                hideKeyboard(editCodbar2);
            };

            editCodbar3.TextChanged += delegate
            {
                TurnLineViewsVisible(imageField3, editSucessMessage3);
                editCodbar4.FocusableInTouchMode = true;
                hideKeyboard(editCodbar3);
            };

            editCodbar4.TextChanged += delegate
            {
                TurnLineViewsVisible(imageField4, editSucessMessage4);
                editCodbar5.FocusableInTouchMode = true;
                hideKeyboard(editCodbar4);
            };

            editCodbar5.TextChanged += delegate
            {
                TurnLineViewsVisible(imageField5, editSucessMessage5);
                editCodbar6.FocusableInTouchMode = true;
                hideKeyboard(editCodbar5);
            };

            editCodbar6.TextChanged += delegate
            {
                TurnLineViewsVisible(imageField6, editSucessMessage6);
                editCodbar7.FocusableInTouchMode = true;
                hideKeyboard(editCodbar6);
            };

            editCodbar7.TextChanged += delegate
            {
                TurnLineViewsVisible(imageField7, editSucessMessage7);
                editCodbar8.FocusableInTouchMode = true;
                hideKeyboard(editCodbar7);
            };

            editCodbar8.TextChanged += delegate
            {
                TurnLineViewsVisible(imageField8, editSucessMessage8);
                editCodbar9.FocusableInTouchMode = true;
                hideKeyboard(editCodbar8);
            };

            editCodbar9.TextChanged += delegate
            {
                TurnLineViewsVisible(imageField9, editSucessMessage9);
                editCodbar10.FocusableInTouchMode = true;
                hideKeyboard(editCodbar9);
            };

            editCodbar10.AfterTextChanged += delegate
            {
                TurnLineViewsVisible(imageField10, editSucessMessage10);
                hideKeyboard(editCodbar10);
            };
        }
        public void DisableFocusOnAllEditViews()
        {
            editCodbar1.Focusable = false;
            editCodbar2.Focusable = false;
            editCodbar3.Focusable = false;
            editCodbar4.Focusable= false;
            editCodbar5.Focusable = false;
            editCodbar6.Focusable = false;
            editCodbar7.Focusable = false;
            editCodbar8.Focusable = false;
            editCodbar9.Focusable = false;
            editCodbar10.Focusable = false;
        }
        public void TurnAllLinesInvisible()
        {
            TurnLineViewsInvisible(imageField1,editSucessMessage1);
            TurnLineViewsInvisible(imageField2, editSucessMessage2);
            TurnLineViewsInvisible(imageField3, editSucessMessage3);
            TurnLineViewsInvisible(imageField4, editSucessMessage4);
            TurnLineViewsInvisible(imageField5, editSucessMessage5);
            TurnLineViewsInvisible(imageField6, editSucessMessage6);
            TurnLineViewsInvisible(imageField7, editSucessMessage7);
            TurnLineViewsInvisible(imageField8, editSucessMessage8);
            TurnLineViewsInvisible(imageField9, editSucessMessage9);
            TurnLineViewsInvisible(imageField10, editSucessMessage10);
        }
    }
}