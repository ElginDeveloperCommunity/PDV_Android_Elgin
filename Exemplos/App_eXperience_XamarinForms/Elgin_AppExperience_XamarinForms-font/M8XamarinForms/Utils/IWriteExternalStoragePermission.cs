using System.Threading.Tasks;
using Xamarin.Essentials;

namespace M8XamarinForms
{
    public interface IWriteExternalStoragePermission
    {
        Task<PermissionStatus> CheckStatusAsync();

        Task<PermissionStatus> RequestAsync();
    }
}
