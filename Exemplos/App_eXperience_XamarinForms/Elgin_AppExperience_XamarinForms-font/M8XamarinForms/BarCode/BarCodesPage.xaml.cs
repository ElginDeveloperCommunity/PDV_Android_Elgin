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
    public partial class BarCodesPage : ContentPage
    {
        bool isTyping = false;

        public BarCodesPage()
        {
            InitializeComponent();

            //INIT IMAGE VIEWS AND SET INVISIBLE
            imageViewCodeBar1.IsVisible = false;
            imageViewCodeBar2.IsVisible = false;
            imageViewCodeBar3.IsVisible = false;
            imageViewCodeBar4.IsVisible = false;
            imageViewCodeBar5.IsVisible = false;
            imageViewCodeBar6.IsVisible = false;
            imageViewCodeBar7.IsVisible = false;
            imageViewCodeBar8.IsVisible = false;
            imageViewCodeBar9.IsVisible = false;
            imageViewCodeBar10.IsVisible = false;


            //INIT TEXT VIEWS AND SET INVISIBLE
            textViewCodeBar1.IsVisible = false;
            textViewCodeBar2.IsVisible = false;
            textViewCodeBar3.IsVisible = false;
            textViewCodeBar4.IsVisible = false;
            textViewCodeBar5.IsVisible = false;
            textViewCodeBar6.IsVisible = false;
            textViewCodeBar7.IsVisible = false;
            textViewCodeBar8.IsVisible = false;
            textViewCodeBar9.IsVisible = false;
            textViewCodeBar10.IsVisible = false;

            buttonInitRead.Clicked += delegate {
                editTextCodeBar1.Focus();
            };

            buttonCleanAllInputs.Clicked += delegate {
                editTextCodeBar1.Text = "";
                editTextCodeBar2.Text = "";
                editTextCodeBar3.Text = "";
                editTextCodeBar4.Text = "";
                editTextCodeBar5.Text = "";
                editTextCodeBar6.Text = "";
                editTextCodeBar7.Text = "";
                editTextCodeBar8.Text = "";
                editTextCodeBar9.Text = "";
                editTextCodeBar10.Text = "";

                editTextCodeBar1.Unfocus();
                editTextCodeBar2.Unfocus();
                editTextCodeBar3.Unfocus();
                editTextCodeBar4.Unfocus();
                editTextCodeBar5.Unfocus();
                editTextCodeBar6.Unfocus();
                editTextCodeBar7.Unfocus();
                editTextCodeBar8.Unfocus();
                editTextCodeBar9.Unfocus();
                editTextCodeBar10.Unfocus();
            };

            editTextCodeBar1.TextChanged += async delegate (object sender, TextChangedEventArgs e) {
                if (string.IsNullOrEmpty(e.NewTextValue))
                {
                    imageViewCodeBar1.IsVisible = false;
                    textViewCodeBar1.IsVisible = false;
                }
                else
                {
                    imageViewCodeBar1.IsVisible = true;
                    textViewCodeBar1.IsVisible = true;
                }
                FocusNextInput(editTextCodeBar2);
            };

            editTextCodeBar2.TextChanged += delegate (object sender, TextChangedEventArgs e) {
                if (string.IsNullOrEmpty(e.NewTextValue))
                {
                    imageViewCodeBar2.IsVisible = false;
                    textViewCodeBar2.IsVisible = false;
                }
                else
                {
                    imageViewCodeBar2.IsVisible = true;
                    textViewCodeBar2.IsVisible = true;
                }
                FocusNextInput(editTextCodeBar3);
            };

            editTextCodeBar3.TextChanged += delegate (object sender, TextChangedEventArgs e) {
                if (string.IsNullOrEmpty(e.NewTextValue))
                {
                    imageViewCodeBar3.IsVisible = false;
                    textViewCodeBar3.IsVisible = false;
                }
                else
                {
                    imageViewCodeBar3.IsVisible = true;
                    textViewCodeBar3.IsVisible = true;
                }
                FocusNextInput(editTextCodeBar4);
            };

            editTextCodeBar4.TextChanged += delegate (object sender, TextChangedEventArgs e) {
                if (string.IsNullOrEmpty(e.NewTextValue))
                {
                    imageViewCodeBar4.IsVisible = false;
                    textViewCodeBar4.IsVisible = false;
                }
                else
                {
                    imageViewCodeBar4.IsVisible = true;
                    textViewCodeBar4.IsVisible = true;
                }
                FocusNextInput(editTextCodeBar5);
            };

            editTextCodeBar5.TextChanged += delegate (object sender, TextChangedEventArgs e) {
                if (string.IsNullOrEmpty(e.NewTextValue))
                {
                    imageViewCodeBar5.IsVisible = false;
                    textViewCodeBar5.IsVisible = false;
                }
                else
                {
                    imageViewCodeBar5.IsVisible = true;
                    textViewCodeBar5.IsVisible = true;
                }
                FocusNextInput(editTextCodeBar6);
            };

            editTextCodeBar6.TextChanged += delegate (object sender, TextChangedEventArgs e) {
                if (string.IsNullOrEmpty(e.NewTextValue))
                {
                    imageViewCodeBar6.IsVisible = false;
                    textViewCodeBar6.IsVisible = false;
                }
                else
                {
                    imageViewCodeBar6.IsVisible = true;
                    textViewCodeBar6.IsVisible = true;
                }
                FocusNextInput(editTextCodeBar7);
            };

            editTextCodeBar7.TextChanged += delegate (object sender, TextChangedEventArgs e) {
                if (string.IsNullOrEmpty(e.NewTextValue))
                {
                    imageViewCodeBar7.IsVisible = false;
                    textViewCodeBar7.IsVisible = false;
                }
                else
                {
                    imageViewCodeBar7.IsVisible = true;
                    textViewCodeBar7.IsVisible = true;
                }
                FocusNextInput(editTextCodeBar8);
            };

            editTextCodeBar8.TextChanged += delegate (object sender, TextChangedEventArgs e) {
                if (string.IsNullOrEmpty(e.NewTextValue))
                {
                    imageViewCodeBar8.IsVisible = false;
                    textViewCodeBar8.IsVisible = false;
                }
                else
                {
                    imageViewCodeBar8.IsVisible = true;
                    textViewCodeBar8.IsVisible = true;
                }
                FocusNextInput(editTextCodeBar9);
            };

            editTextCodeBar9.TextChanged += delegate (object sender, TextChangedEventArgs e) {
                if (string.IsNullOrEmpty(e.NewTextValue))
                {
                    imageViewCodeBar9.IsVisible = false;
                    textViewCodeBar9.IsVisible = false;
                }
                else
                {
                    imageViewCodeBar9.IsVisible = true;
                    textViewCodeBar9.IsVisible = true;
                }
                FocusNextInput(editTextCodeBar10);
            };

            editTextCodeBar10.TextChanged += delegate (object sender, TextChangedEventArgs e) {
                if (string.IsNullOrEmpty(e.NewTextValue))
                {
                    imageViewCodeBar10.IsVisible = false;
                    textViewCodeBar10.IsVisible = false;
                }
                else
                {
                    imageViewCodeBar10.IsVisible = true;
                    textViewCodeBar10.IsVisible = true;
                }
            };

            async void FocusNextInput(Entry nextEntry) {
                if (isTyping) return;
                isTyping = true;
                await Task.Delay(3000);
                isTyping = false;
                nextEntry.Focus();
            }
        }
    }
}