using Xamarin.Forms;
using System.Globalization;
using System.Linq;

namespace M8XamarinForms
{
    public static class InputMaskMoney
    {
        public static int DecimalDigits(this decimal n)
        {
            return n.ToString(CultureInfo.InvariantCulture)
                    .SkipWhile(c => c != '.')
                    .Skip(1)
                    .Count();
        }

        public static bool IsDeletion(this TextChangedEventArgs e)
        {
            return !string.IsNullOrEmpty(e.OldTextValue) && e.OldTextValue.Length > e.NewTextValue.Length;
        }
    }
}
