using Android.Content;
using Android.Graphics;
using Java.IO;
using System.IO;
using Bitmap = Android.Graphics.Bitmap;
using File = Java.IO.File;

namespace M8
{
    public sealed class Pix4ImagesStorageService
    {
        private readonly Context mContext;

        public Pix4ImagesStorageService(Context mContext)
        {
            this.mContext = mContext;
        }

        // Saves the product images, present in res/drawable, inside the device's Downloads directory.
        // It is necessary so that they can subsequently be loaded into the PIX4 device, since images are only loaded onto the device through references to M10 internal files.
        public void ExecuteStoreImages()
        {
            foreach (Produto produto in Produto.values)
            {
                // Load the product image as a Bitmap.
                var produtoImageBitmap = BitmapFactory.DecodeResource(mContext.Resources, produto.FileImageResId);

                // The image must be saved with the device's maximum specifications, for this is the configuration in the bitmap.
                var bitmapFormatted = FormatBitmapForPix4(produtoImageBitmap);

                StoreImageWith72Dpi(bitmapFormatted, produto.FileName);
            }
        }

        // The maximum specifications for an image for proper functioning for the PIX4 is 320 x 480.
        private Bitmap FormatBitmapForPix4(Bitmap bitmap)
        {
            return Bitmap.CreateScaledBitmap(bitmap, 320, 480, false);
        }

        // Saves a bitmap as a .jpg image in the device's Downloads directory.
        // At the moment the PIX 4 via android library only supports images with a maximum of 72 DPI, so the images are modified to be saved containing this specification.
        private void StoreImageWith72Dpi(Bitmap image, string fileName)
        {
            // Directory.
            const string downloadsDirPath = "/storage/emulated/0/Download/";
            // Create the file in the directory.
            var pictureFile = new File(downloadsDirPath + fileName);

            // Save the bitmap as an image in the directory.
            try
            {
                var fos = new FileOutputStream(pictureFile);

                var imageByteArray = new MemoryStream();
                image.Compress(Bitmap.CompressFormat.Jpeg, 30, imageByteArray);
                var imageData = imageByteArray.ToArray();

                SetDpi(imageData, 72);

                fos.Write(imageData);
                fos.Close();
            }
            catch (Java.IO.FileNotFoundException e)
            {
                System.Console.Error.WriteLine("Error: File not found: {0}", e.Message);
                e.PrintStackTrace();
            }
            catch (Java.IO.IOException e)
            {
                System.Console.Error.WriteLine("Error: Failed to access file: {0}", e.Message);
                e.PrintStackTrace();
            }
        }

        private void SetDpi(byte[] imageData, int dpi)
        {
            imageData[13] = 1;
            imageData[14] = (byte)(dpi >> 8);
            imageData[15] = (byte)(dpi & 0xff);
            imageData[16] = (byte)(dpi >> 8);
            imageData[17] = (byte)(dpi & 0xff);
        }
    }
}

