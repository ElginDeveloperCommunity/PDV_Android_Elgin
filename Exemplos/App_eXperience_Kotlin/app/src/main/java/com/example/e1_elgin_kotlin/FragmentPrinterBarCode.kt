package com.example.e1_elgin_kotlin

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import android.widget.AdapterView.OnItemSelectedListener
import androidx.fragment.app.Fragment
import java.util.*

class FragmentPrinterBarCode : Fragment() {
    lateinit var editTextInputBarCode: EditText

    lateinit var spinnerBarCodeType: Spinner
    lateinit var spinnerBarCodeWidth: Spinner
    lateinit var spinnerBarCodeHeight: Spinner

    lateinit var radioGroupAlignBarCode: RadioGroup
    lateinit var buttonRadioAlignCenter: RadioButton

    lateinit var checkBoxIsCutPaperBarCode: CheckBox

    lateinit var buttonPrinterBarCode: Button

    var typeOfBarCode: String = "EAN 8"
    var typAlignOfBarCode: String = "Centralizado"
    var widthOfBarCode: Int = 1
    var heightOfBarCode: Int = 20

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.activity_fragment_printer_bar_code, container, false)

        editTextInputBarCode = view.findViewById(R.id.editTextInputBarCode)
        editTextInputBarCode.setText("40170725")

        spinnerBarCodeType = view.findViewById(R.id.spinnerBarCodeType)
        radioGroupAlignBarCode = view.findViewById(R.id.radioGroupAlignBarCode)
        buttonRadioAlignCenter = view.findViewById(R.id.radioButtonBarCodeAlignCenter)
        spinnerBarCodeWidth = view.findViewById(R.id.spinnerBarCodeWidth)
        spinnerBarCodeHeight = view.findViewById(R.id.spinnerBarCodeHeight)
        checkBoxIsCutPaperBarCode = view.findViewById(R.id.checkBoxCutPaper)
        buttonPrinterBarCode = view.findViewById(R.id.buttonPrintBarCode)

        spinnerBarCodeType.onItemSelectedListener = object : OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {}

            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                typeOfBarCode = parent.getItemAtPosition(position).toString()
                setTypeCodeMessage(typeOfBarCode)
            }
        }

        buttonRadioAlignCenter.isChecked = true
        radioGroupAlignBarCode.setOnCheckedChangeListener { _, checkedId ->
            if (checkedId == R.id.radioButtonBarCodeAlignLeft)
                typAlignOfBarCode = "Esquerda"

            if (checkedId == R.id.radioButtonBarCodeAlignCenter)
                typAlignOfBarCode = "Centralizado"

            if (checkedId == R.id.radioButtonBarCodeAlignRight)
                typAlignOfBarCode = "Direita"
        }

        spinnerBarCodeWidth.onItemSelectedListener = object: OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                val barCodeWidth = parent?.getItemAtPosition(position).toString()
                widthOfBarCode = barCodeWidth.toInt()
                println(widthOfBarCode)
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                TODO("Not yet implemented")
            }
        }

        spinnerBarCodeHeight.onItemSelectedListener = object: OnItemSelectedListener {
            override fun onItemSelected(
                    parent: AdapterView<*>?,
                    view: View?,
                    position: Int,
                    id: Long
            ) {
                val barCodeHeight = parent?.getItemAtPosition(position).toString()
                heightOfBarCode = barCodeHeight.toInt()
            }
            override fun onNothingSelected(parent: AdapterView<*>?) {
                TODO("Not yet implemented")
            }
        }

        buttonPrinterBarCode.setOnClickListener(){
            if (typeOfBarCode == "QR CODE") {
                sendPrinterQrCode()
            } else {
                sendPrinterBarCode()
            }
        }

        return view
    }

    fun setTypeCodeMessage(typeActual: String?) {
        when (typeActual) {
            "EAN 8" -> editTextInputBarCode.setText("40170725")
            "EAN 13" -> editTextInputBarCode.setText("0123456789012")
            "QR CODE" -> editTextInputBarCode.setText("ELGIN DEVELOPERS COMMUNITY")
            "UPC-A" -> editTextInputBarCode.setText("123601057072")
            "UPC-E" -> editTextInputBarCode.setText("654321")
            "CODE 39" -> editTextInputBarCode.setText("*ABC123*")
            "ITF" -> editTextInputBarCode.setText("05012345678900")
            "CODE BAR" -> editTextInputBarCode.setText("A3419500A")
            "CODE 93" -> editTextInputBarCode.setText("ABC123456789")
            "CODE 128" -> editTextInputBarCode.setText("{C1233")
        }
    }

    private fun sendPrinterBarCode() {
        val mapValues: MutableMap<String?, Any?> = HashMap()

        if (editTextInputBarCode.text.toString() == "") {
            alertMessageStatus("Alert", "Campo código vazio.")
        } else {
            mapValues["barCodeType"] = typeOfBarCode
            mapValues["text"] = editTextInputBarCode.text.toString()
            mapValues["height"] = heightOfBarCode
            mapValues["width"] = widthOfBarCode
            mapValues["align"] = typAlignOfBarCode

            PrinterMenu.printer.imprimeBarCode(mapValues)

            jumpLine()
            if (checkBoxIsCutPaperBarCode.isChecked) cutPaper()
        }
    }

    private fun sendPrinterQrCode() {
        val mapValues: MutableMap<String?, Any?> = HashMap()

        if (editTextInputBarCode.text.toString() == "") {
            alertMessageStatus("Alert", "Campo código vazio.")
        } else {
            mapValues["qrSize"] = widthOfBarCode
            mapValues["text"] = editTextInputBarCode.text.toString()
            mapValues["align"] = typAlignOfBarCode

            PrinterMenu.printer.imprimeQR_CODE(mapValues)

            jumpLine()
            if (checkBoxIsCutPaperBarCode!!.isChecked) cutPaper()
        }
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

    private fun alertMessageStatus(titleAlert: String, messageAlert: String) {
        val alertDialog = AlertDialog.Builder(context)

        alertDialog.setTitle(titleAlert)
        alertDialog.setMessage(messageAlert)
        alertDialog.setPositiveButton("OK"){ dialog, which -> dialog.dismiss()}
        alertDialog.create()
        alertDialog.show()
    }
}