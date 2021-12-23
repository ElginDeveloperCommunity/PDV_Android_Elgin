package com.example.e1_kotlin_r

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.DialogInterface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import android.widget.AdapterView.OnItemSelectedListener
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import java.util.HashMap


class FragmentPrinterBarCode :Fragment() {
    //DECLARE EDIT TEXT
    lateinit var editTextInputBarCode: EditText

    //DECLARE SPINNER
    lateinit var spinnerBarCodeType: Spinner
    lateinit var spinnerBarCodeWidth: Spinner
    lateinit var spinnerBarCodeHeight: Spinner

    //DECLARE RADIO BUTTONS
    lateinit var radioGroupAlignBarCode: RadioGroup
    lateinit var buttonRadioAlignCenter: RadioButton

    //DECLARE CHECKBOX
    var checkBoxIsCutPaperBarCode: CheckBox? = null

    //DECLARE TEXTVIEW
    var textViewWidth: TextView? = null
    var textViewHeight: TextView? = null

    //DECLARE BUTTONS
    lateinit var buttonPrinterBarCode: Button

    //DECLARE VALUES CONFIGS
    var typeOfBarCode = "EAN 8"
    var typAlignOfBarCode = "Centralizado"
    var widthOfBarCode = 1
    var heightOfBarCode = 20
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val v: View =
            inflater.inflate(R.layout.activity_printer_bar_code, container, false)

        //INIT EDIT TEXT
        editTextInputBarCode = v.findViewById(R.id.editTextInputBarCode)
        editTextInputBarCode.setText("40170725")
        textViewWidth = v.findViewById(R.id.textViewWidth)
        textViewHeight = v.findViewById(R.id.textViewHeight)


        //INIT RADIOS, SPINNER AND BUTTONS
        spinnerBarCodeType = v.findViewById(R.id.spinnerBarCodeType)
        buttonRadioAlignCenter = v.findViewById(R.id.radioButtonBarCodeAlignCenter)
        spinnerBarCodeWidth = v.findViewById(R.id.spinnerBarCodeWidth)
        spinnerBarCodeHeight = v.findViewById(R.id.spinnerBarCodeHeight)
        checkBoxIsCutPaperBarCode = v.findViewById(R.id.checkBoxCutPaper)
        buttonPrinterBarCode = v.findViewById(R.id.buttonPrintBarCode)

        //CONFIGS FONT FAMILY
        spinnerBarCodeType.setOnItemSelectedListener(object : OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {}
            override fun onItemSelected(adapter: AdapterView<*>, v: View, i: Int, lng: Long) {
                typeOfBarCode = adapter.getItemAtPosition(i).toString()
                setTypeCodeMessage(typeOfBarCode)
            }
        })

        //CONFIGS ALIGN BAR CODE
        buttonRadioAlignCenter.setChecked(true)
        radioGroupAlignBarCode = v.findViewById(R.id.radioGroupAlignBarCode)
        radioGroupAlignBarCode.setOnCheckedChangeListener(RadioGroup.OnCheckedChangeListener { group, checkedId ->
            when (checkedId) {
                R.id.radioButtonBarCodeAlignLeft -> {
                    typAlignOfBarCode = "Esquerda"
                    println(typAlignOfBarCode)
                }
                R.id.radioButtonBarCodeAlignCenter -> {
                    typAlignOfBarCode = "Centralizado"
                    println(typAlignOfBarCode)
                }
                R.id.radioButtonBarCodeAlignRight -> {
                    typAlignOfBarCode = "Direita"
                    println(typAlignOfBarCode)
                }
            }
        })

        //CONFIGS WIDTH BAR CODE
        spinnerBarCodeWidth.setOnItemSelectedListener(object : OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {}
            override fun onItemSelected(adapter: AdapterView<*>, v: View, i: Int, lng: Long) {
                widthOfBarCode = adapter.getItemAtPosition(i).toString().toInt()
            }
        })

        //CONFIGS HEIGHT BAR CODE
        spinnerBarCodeHeight.setOnItemSelectedListener(object : OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {}
            override fun onItemSelected(adapter: AdapterView<*>, v: View, i: Int, lng: Long) {
                heightOfBarCode = adapter.getItemAtPosition(i).toString().toInt()
            }
        })

        //BUTTON PRINT BAR CODE CLICKED
        buttonPrinterBarCode.setOnClickListener(View.OnClickListener {
            if (typeOfBarCode == "QR CODE") {
                sendPrinterQrCode()
            } else {
                sendPrinterBarCode()
            }
        })
        return v
    }

    fun setTypeCodeMessage(typeActual: String?) {
        textViewWidth!!.text = "WIDTH"
        textViewHeight!!.visibility = View.VISIBLE
        spinnerBarCodeHeight!!.visibility = View.VISIBLE
        when (typeActual) {
            "EAN 8" -> editTextInputBarCode!!.setText("40170725")
            "EAN 13" -> editTextInputBarCode!!.setText("0123456789012")
            "QR CODE" -> {
                textViewWidth!!.text = "SQUARE"
                textViewHeight!!.visibility = View.INVISIBLE
                spinnerBarCodeHeight!!.visibility = View.INVISIBLE
                editTextInputBarCode!!.setText("ELGIN DEVELOPERS COMMUNITY")
            }
            "UPC-A" -> editTextInputBarCode!!.setText("123601057072")
            "CODE 39" -> editTextInputBarCode!!.setText("CODE39")
            "ITF" -> editTextInputBarCode!!.setText("05012345678900")
            "CODE BAR" -> editTextInputBarCode!!.setText("A3419500A")
            "CODE 93" -> editTextInputBarCode!!.setText("CODE93")
            "CODE 128" -> editTextInputBarCode!!.setText("{C1233")
        }
    }

    fun sendPrinterBarCode() {
        val mapValues: MutableMap<String?, Any?> = HashMap()
        if (editTextInputBarCode!!.text.toString() == "") {
            alertMessage()
        } else {
            mapValues["barCodeType"] = typeOfBarCode
            mapValues["text"] = editTextInputBarCode!!.text.toString()
            mapValues["height"] = heightOfBarCode
            mapValues["width"] = widthOfBarCode
            mapValues["align"] = typAlignOfBarCode
            val result = PrinterMenu.printer.imprimeBarCode(mapValues)
            println("RESULT BAR CODE: $result")
            jumpLine()
            if (checkBoxIsCutPaperBarCode!!.isChecked) cutPaper()
        }
    }

    fun sendPrinterQrCode() {
        val mapValues: MutableMap<String?, Any?> = HashMap()
        if (editTextInputBarCode!!.text.toString() == "") {
            alertMessage()
        } else {
            mapValues["qrSize"] = widthOfBarCode
            mapValues["text"] = editTextInputBarCode!!.text.toString()
            mapValues["align"] = typAlignOfBarCode
            PrinterMenu.printer.imprimeQR_CODE(mapValues)
            jumpLine()
            if (checkBoxIsCutPaperBarCode!!.isChecked) cutPaper()
        }
    }

    fun jumpLine() {
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["quant"] = 10
        PrinterMenu.printer.AvancaLinhas(mapValues)
    }

    fun cutPaper() {
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["quant"] = 10
        PrinterMenu.printer.cutPaper(mapValues)
    }

    fun alertMessage() {
        val alertDialog = AlertDialog.Builder(PrinterMenu.printer.mActivity).create()
        alertDialog.setTitle("Alert")
        alertDialog.setMessage("Campo código vazio.")
        alertDialog.setButton(
            AlertDialog.BUTTON_NEUTRAL, "OK"
        ) { dialog, which -> dialog.dismiss() }
        alertDialog.show()
    }
}