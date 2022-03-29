package com.example.e1_kotlin_r

import android.app.AlertDialog
import android.app.Fragment
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import android.widget.AdapterView.OnItemSelectedListener

import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.lang.StringBuilder
import java.util.HashMap

class FragmentPrinterText : Fragment() {
    //DECLARE BUTTONS
    lateinit var buttonPrinter: Button
    lateinit var buttonPrinterXMLNFCe: Button
    lateinit var buttonPrinterXMLSAT: Button

    //DECLARE RADIO BUTTONS
    lateinit var radioGroupAlign: RadioGroup
    lateinit var buttonRadioCenter: RadioButton

    //DECLARE EDIT TEXT
    lateinit var editTextInputMessage: EditText

    //DECLARE SPINNER
    lateinit var spinnerFontFamily: Spinner
    lateinit var spinnerFontSize: Spinner

    //DECLARE CHECKBOX
    var checkBoxIsBold: CheckBox? = null
    lateinit var checkBoxIsUnderLine: CheckBox
    var checkBoxIsCutPaper: CheckBox? = null
    var typeOfAlignment = "Centralizado"
    var typeOfFontFamily = "FONT A"
    var typeOfFontSize = 17
    var xmlNFCe = "xmlnfce"
    var xmlSAT = "xmlsat"
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val v: View = inflater.inflate(R.layout.activity_fragment_printer_text, container, false)

        //INIT EDIT TEXT
        editTextInputMessage = v.findViewById(R.id.editTextInputMessage)
        editTextInputMessage.setText("ELGIN DEVELOPERS COMMUNITY")

        //INIT RADIOS, SPINNER AND BUTTONS
        radioGroupAlign = v.findViewById(R.id.radioGroupAlign)
        buttonRadioCenter = v.findViewById(R.id.radioButtonCenter)
        spinnerFontFamily = v.findViewById(R.id.spinnerFontFamily)
        spinnerFontSize = v.findViewById(R.id.spinnerFontSize)
        checkBoxIsBold = v.findViewById(R.id.checkBoxBold)
        checkBoxIsUnderLine = v.findViewById(R.id.checkBoxUnderline)
        checkBoxIsCutPaper = v.findViewById(R.id.checkBoxCutPaper)
        buttonPrinter = v.findViewById(R.id.buttonPrinterText)
        buttonPrinterXMLNFCe = v.findViewById(R.id.buttonPrinterNFCe)
        buttonPrinterXMLSAT = v.findViewById(R.id.buttonPrinterSAT)

        //BUTTON PRINT TEXT CLICKED
        buttonPrinter.setOnClickListener(View.OnClickListener { printText() })

        //BUTTON PRINT XML NFCe
        buttonPrinterXMLNFCe.setOnClickListener(View.OnClickListener {
            try {
                printXmlNFCe()
            } catch (e: IOException) {
                e.printStackTrace()
            }
        })

        //BUTTON PRINT XML NFCe
        buttonPrinterXMLSAT.setOnClickListener(View.OnClickListener {
            try {
                printXmlSAT()
            } catch (e: IOException) {
                e.printStackTrace()
            }
        })

        //CONFIGS ALIGN TEXT
        buttonRadioCenter.setChecked(true)
        radioGroupAlign = v.findViewById(R.id.radioGroupAlign)
        radioGroupAlign.setOnCheckedChangeListener(RadioGroup.OnCheckedChangeListener { group, checkedId ->
            when (checkedId) {
                R.id.radioButtonLeft -> typeOfAlignment = "Esquerda"
                R.id.radioButtonCenter -> typeOfAlignment = "Centralizado"
                R.id.radioButtonRight -> typeOfAlignment = "Direita"
            }
        })

        //CONFIGS FONT FAMILY
        spinnerFontFamily.setOnItemSelectedListener(object : OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {}
            override fun onItemSelected(adapter: AdapterView<*>, v: View, i: Int, lng: Long) {
                typeOfFontFamily = adapter.getItemAtPosition(i).toString()
                println(
                    "FONT FAMILY: " + typeOfFontFamily + " " + checkBoxIsUnderLine.isChecked()
                        .toString()
                )
            }
        })

        //CONFIGS FONT SIZE
        spinnerFontSize.setOnItemSelectedListener(object : OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {}
            override fun onItemSelected(adapter: AdapterView<*>, v: View, i: Int, lng: Long) {
                typeOfFontSize = adapter.getItemAtPosition(i).toString().toInt()
            }
        })
        return v
    }

    fun printText() {
        val mapValues: MutableMap<String?, Any?> = HashMap()
        if (editTextInputMessage!!.text.toString() == "") {
            alertMessage()
        } else {
            mapValues["text"] = editTextInputMessage!!.text.toString()
            mapValues["align"] = typeOfAlignment
            mapValues["font"] = typeOfFontFamily
            mapValues["fontSize"] = typeOfFontSize
            mapValues["isBold"] = checkBoxIsBold!!.isChecked
            mapValues["isUnderline"] = checkBoxIsUnderLine!!.isChecked
            PrinterMenu.printer?.imprimeTexto(mapValues)
            jumpLine()
            if (checkBoxIsCutPaper!!.isChecked) cutPaper()
        }
    }

    @Throws(IOException::class)
    fun printXmlNFCe() {
        val stringXMLNFCe: String
        val ins = MainActivity.context!!.resources.openRawResource(
            MainActivity.context!!.resources.getIdentifier(
                xmlNFCe,
                "raw",
                MainActivity.context!!.packageName
            )
        )
        val br = BufferedReader(InputStreamReader(ins))
        val sb = StringBuilder()
        var line: String? = null
        try {
            line = br.readLine()
        } catch (e: IOException) {
            e.printStackTrace()
        }
        while (line != null) {
            sb.append(line)
            sb.append(System.lineSeparator())
            line = br.readLine()
        }
        stringXMLNFCe = sb.toString()
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["xmlNFCe"] = stringXMLNFCe
        mapValues["indexcsc"] = INDEXCSC
        mapValues["csc"] = CSC
        mapValues["param"] = PARAM
        PrinterMenu.printer?.imprimeXMLNFCe(mapValues)
        println("XML NFCE: $stringXMLNFCe")
        jumpLine()
        if (checkBoxIsCutPaper!!.isChecked) cutPaper()
    }

    @Throws(IOException::class)
    fun printXmlSAT() {
        val stringXMLSat: String
        val ins = MainActivity.context!!.resources.openRawResource(
            MainActivity.context!!.resources.getIdentifier(
                xmlSAT,
                "raw",
                MainActivity.context!!.packageName
            )
        )
        val br = BufferedReader(InputStreamReader(ins))
        val sb = StringBuilder()
        var line: String? = null
        try {
            line = br.readLine()
        } catch (e: IOException) {
            e.printStackTrace()
        }
        while (line != null) {
            sb.append(line)
            sb.append(System.lineSeparator())
            line = br.readLine()
        }
        stringXMLSat = sb.toString()
        val mapValues: MutableMap<String?, Any?> = HashMap()
        mapValues["xmlSAT"] = stringXMLSat
        mapValues["param"] = PARAM
        PrinterMenu.printer?.imprimeXMLSAT(mapValues)
        jumpLine()
        if (checkBoxIsCutPaper!!.isChecked) cutPaper()
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

    fun alertMessage() {
        val alertDialog = AlertDialog.Builder(PrinterMenu.printer?.mActivity ?:context).create()
        alertDialog.setTitle("Alert")
        alertDialog.setMessage("Campo Mensagem vazio.")
        alertDialog.setButton(
            AlertDialog.BUTTON_NEUTRAL, "OK"
        ) { dialog, which -> dialog.dismiss() }
        alertDialog.show()
    }

    companion object {
        //PARAMS DEFAULT TO PRINT XML NFCe AND SAT
        var INDEXCSC = 1
        var CSC = "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES"
        var PARAM = 0
    }
}