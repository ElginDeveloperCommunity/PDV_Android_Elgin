using Android.Widget;
using Android.Text;
using Java.Lang;
using Java.Lang.Ref;
using Java.Math;
using Java.Text;
using Android.Util;
using System.Text.RegularExpressions;

namespace M8
{
    class InputMaskMoney : Object, ITextWatcher
    {
        private WeakReference editTextWeakReference;

        //Váriavél sentinela utilizada para impedir loop em caso de a mudança ter sido feita pelo própio TextWatcher
        bool _ignore = false;

        public InputMaskMoney(EditText editText)
        {
            editTextWeakReference = new WeakReference(editText);
        }

        public void AfterTextChanged(IEditable editable)
        {//Atualiza a referência ao EditText definido no método construtor
            EditText editText = (EditText) editTextWeakReference.Get();

            //Impedir erro de null pointer exception caso string vazia / impedir loop caso a própia classe tenha causado uma alteração no editText.
            string newValue = editable.ToString().Trim();
            if (_ignore) return;

            //Transforma casas decimais em valor inteiro
            string newValueInIntenger = Regex.Replace(newValue, "[,.]", "");

            //Transforma o novo valor em BigDecimal
            BigDecimal newValueInBigDecimal = new BigDecimal(newValueInIntenger);
            //Seta a escala de precisão para duas casas decimais somente
            newValueInBigDecimal = newValueInBigDecimal.SetScale(2);
            //Divide o valor por 100, para obtermos novamente as casas decimais
            newValueInBigDecimal = newValueInBigDecimal.Divide(new BigDecimal("100"));

            //Formatando o valor para o formato de moeda
            string newValueFormattedInCurrency = NumberFormat.CurrencyInstance.Format(newValueInBigDecimal);
            //Removendo o símbolo da moeda (é possível que o símbolo da moeda contenha caracteres que precisam ser escapados, por esta razão são agrupados no regex)
            string newValueInCurrencyClean = Regex.Replace(newValueFormattedInCurrency, "[" + NumberFormat.CurrencyInstance.Currency.Symbol + "]", "");

            //Previne o loop
            _ignore = true;
            //Atualiza o campo com o valor tratado
            editText.Text = newValueInCurrencyClean;
            //Define o cursor de inserção para a ultima posição
            editText.SetSelection(newValueInCurrencyClean.Length);

            //Permite que o TextWatcher observe uma mudança novamente
            _ignore = false;
        }

        void ITextWatcher.BeforeTextChanged(ICharSequence s, int start, int count, int after)
        {
        }

        void ITextWatcher.OnTextChanged(ICharSequence s, int start, int before, int count)
        {
        }
    }
}