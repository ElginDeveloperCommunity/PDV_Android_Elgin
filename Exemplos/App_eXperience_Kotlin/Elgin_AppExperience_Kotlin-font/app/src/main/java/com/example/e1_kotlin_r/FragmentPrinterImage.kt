package com.example.e1_kotlin_r
import android.app.Activity
import android.app.Fragment
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.CheckBox
import android.widget.ImageView
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity


import java.io.IOException
import java.util.HashMap

class FragmentPrinterImage : Fragment() {
    //DECLARE IMAGE VIEW
    var imageView: ImageView? = null

    //DECLARE BUTTONS
    lateinit var buttonSelectImage: Button
    lateinit var buttonPrintImage: Button

    //DECLARE CHECKBOX
    var checkBoxCutPaperImage: CheckBox? = null

    //PATH OF IMAGE
    var bitmap1: Bitmap? = null
    var pathImage = ""
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view: View =
            inflater.inflate(R.layout.activity_fragment_printer_image, container, false)

        //INIT IMAGE VIEW
        imageView = view.findViewById(R.id.previewImgDefault)

        //INIT BUTTONS
        buttonSelectImage = view.findViewById(R.id.buttonSelectImage)
        buttonPrintImage = view.findViewById(R.id.buttonPrintImage)

        //INIT CHECKBOX
        checkBoxCutPaperImage = view.findViewById(R.id.checkBoxCutPaperPrintImage)
        buttonSelectImage.setOnClickListener(View.OnClickListener { startGallery() })
        buttonPrintImage.setOnClickListener(View.OnClickListener { sendPrinterImage() })
        return view
    }

    private fun startGallery() {
        val cameraIntent = Intent(Intent.ACTION_PICK)
        cameraIntent.type = "image/*"
        startActivityForResult(cameraIntent, 1000)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (resultCode == Activity.RESULT_OK) {
            if (requestCode == 1000) {
                val returnUri = data?.data
                var bitmapImage: Bitmap? = null
                try {
                    bitmapImage =
                        MediaStore.Images.Media.getBitmap(activity?.contentResolver, returnUri)
                    setBitmap(bitmapImage)
                } catch (e: IOException) {
                    e.printStackTrace()
                }
                imageView!!.setImageBitmap(bitmapImage)
            }
        } else {
            Toast.makeText(activity, "You haven't picked Image", Toast.LENGTH_LONG)
                .show()
        }
    }

    fun setBitmap(bitmapFileSelected: Bitmap?) {
        bitmap1 = bitmapFileSelected
    }

    fun sendPrinterImage() {
        if (bitmap1 != null) {
            PrinterMenu.printer?.imprimeImagem(bitmap1)
        } else {
            var id = 0
            id = activity.applicationContext.resources.getIdentifier(
                NAME_IMAGE,
                DEF_TYPE,
                activity.applicationContext.packageName
            )
            println("id: $id")
            bitmap1 = BitmapFactory.decodeResource(
                activity.applicationContext.resources,
                id
            )
            PrinterMenu.printer?.imprimeImagem(bitmap1)
        }
        jumpLine()
        if (checkBoxCutPaperImage!!.isChecked) cutPaper()
    }

    fun jumpLine() {
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["quant"] = 10
        PrinterMenu.printer?.AvancaLinhas(mapValues)
    }

    fun cutPaper() {
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["quant"] = 10
        PrinterMenu.printer?.cutPaper(mapValues)
    }

    companion object {
        //NAME OF PATH AND FILE IMAGE DEFAULT
        var NAME_IMAGE = "elgin"
        var DEF_TYPE = "drawable"
        fun getPath(context: Context, uri: Uri?): String {
            var result: String? = null
            val proj = arrayOf(MediaStore.Images.Media.DATA)
            val cursor = context.contentResolver.query(uri!!, proj, null, null, null)
            if (cursor != null) {
                if (cursor.moveToFirst()) {
                    val column_index = cursor.getColumnIndexOrThrow(proj[0])
                    result = cursor.getString(column_index)
                }
                cursor.close()
            }
            if (result == null) {
                result = "Not found"
            }
            return result
        }
    }
}