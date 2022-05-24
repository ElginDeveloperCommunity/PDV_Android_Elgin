using System.Collections.Generic;
using Xamarin.Forms;

[assembly: Dependency(typeof(M8XamarinForms.Droid.ReadWriteStoragePermission))]
namespace M8XamarinForms.Droid
{
    public class ReadWriteStoragePermission : Xamarin.Essentials.Permissions.BasePlatformPermission, IWriteExternalStoragePermission
    {
        public override (string androidPermission, bool isRuntime)[] RequiredPermissions => new List<(string androidPermission, bool isRuntime)>
        {
        (Android.Manifest.Permission.WriteExternalStorage, true)
        }.ToArray();
    }
}