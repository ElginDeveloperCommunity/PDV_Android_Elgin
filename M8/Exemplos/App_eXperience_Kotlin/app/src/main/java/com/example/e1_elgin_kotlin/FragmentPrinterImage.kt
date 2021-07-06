package com.example.e1_elgin_kotlin

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.provider.MediaStore
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.CheckBox
import android.widget.ImageView
import androidx.fragment.app.Fragment
import java.io.IOException
import java.util.*

class FragmentPrinterImage : Fragment() {
    lateinit var imageView: ImageView

    lateinit var buttonSelectImage: Button
    lateinit var buttonPrintImage: Button

    lateinit var checkBoxCutPaperImage: CheckBox

    var bitmap: Bitmap? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.activity_fragment_printer_image, container, false)

        imageView = view!!.findViewById(R.id.previewImgDefault)
        buttonSelectImage = view.findViewById(R.id.buttonSelectImage)
        buttonPrintImage = view.findViewById(R.id.buttonPrintImage)
        checkBoxCutPaperImage = view.findViewById(R.id.checkBoxCutPaperPrintImage)

        buttonSelectImage.setOnClickListener { startGallery() }
        buttonPrintImage.setOnClickListener { sendPrinterImage() }

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
                            MediaStore.Images.Media.getBitmap(requireActivity().contentResolver, returnUri)
                    setBitmap(bitmapImage)
                } catch (e: IOException) {
                    e.printStackTrace()
                }
                imageView.setImageBitmap(bitmapImage)
            }
        } else {
//            Toast.makeText(MainActivity.context, "You haven't picked Image", Toast.LENGTH_LONG)
//                .show()
        }
    }

    @JvmName("setBitmap1")
    fun setBitmap(bitmapFileSelected: Bitmap) {
        bitmap = bitmapFileSelected
    }

    private fun sendPrinterImage() {
        if (bitmap != null) {
            PrinterMenu.printer.imprimeImagem(bitmap)
        } else {
            var id = 0
            id = context?.applicationContext?.resources?.getIdentifier(
                    "elgin",
                    "drawable",
                    requireContext().applicationContext.packageName
            )!!

            bitmap = BitmapFactory.decodeResource(
                    requireContext().applicationContext.resources, id
            )

            PrinterMenu.printer.imprimeImagem(bitmap)
        }

        jumpLine()
        if (checkBoxCutPaperImage.isChecked) cutPaper()
    }

    private fun jumpLine() {
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["quant"] = 10
        PrinterMenu.printer.AvancaLinhas(mapValues)
    }

    private fun cutPaper() {
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["quant"] = 10
        PrinterMenu.printer.cutPaper(mapValues)
    }
}