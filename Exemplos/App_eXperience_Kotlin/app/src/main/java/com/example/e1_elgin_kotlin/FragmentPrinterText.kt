package com.example.e1_elgin_kotlin

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStream
import java.io.InputStreamReader
import java.util.*

class FragmentPrinterText : Fragment() {
    lateinit var buttonPrinter: Button
    lateinit var buttonPrinterXMLNFCe: Button
    lateinit var buttonPrinterXMLSAT: Button

    lateinit var radioGroupAlign: RadioGroup
    lateinit var buttonRadioCenter: RadioButton

    lateinit var editTextInputMessage: EditText

    lateinit var spinnerFontFamily: Spinner
    lateinit var spinnerFontSize: Spinner

    lateinit var checkBoxIsBold: CheckBox
    lateinit var checkBoxIsUnderLine: CheckBox
    lateinit var checkBoxIsCutPaper: CheckBox

    var typeOfAlignment:String = "Centralizado"
    var typeOfFontFamily:String = "FONT A"
    var typeOfFontSize:Int = 17

    var xmlNFCe:String = "xmlnfce"
    var xmlSAT:String = "xmlsat"

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {

        val view = inflater.inflate(R.layout.activity_fragment_printer_text, container, false)

        radioGroupAlign = view.findViewById(R.id.radioGroupAlign)
        buttonRadioCenter = view.findViewById(R.id.radioButtonCenter)
        spinnerFontFamily = view.findViewById(R.id.spinnerFontFamily)
        spinnerFontSize = view.findViewById(R.id.spinnerFontSize)
        checkBoxIsBold = view.findViewById(R.id.checkBoxBold)
        checkBoxIsUnderLine = view.findViewById(R.id.checkBoxUnderline)
        checkBoxIsCutPaper = view.findViewById(R.id.checkBoxCutPaper)

        editTextInputMessage = view.findViewById(R.id.editTextInputMessage)
        editTextInputMessage.setText("ELGIN DEVELOPERS COMMUNITY")

        buttonPrinter = view.findViewById(R.id.buttonPrinterText)
        buttonPrinterXMLNFCe = view.findViewById(R.id.buttonPrinterNFCe)
        buttonPrinterXMLSAT = view.findViewById(R.id.buttonPrinterSAT)

        buttonRadioCenter.isChecked = true
        radioGroupAlign.setOnCheckedChangeListener { group, checkedId ->
            if (checkedId == R.id.radioButtonLeft)
                typeOfAlignment = "Esquerda"

            if (checkedId == R.id.radioButtonCenter)
                typeOfAlignment = "Centralizado"

            if (checkedId == R.id.radioButtonRight)
                typeOfAlignment = "Direita"
            println(typeOfAlignment)
        }

        spinnerFontFamily.onItemSelectedListener = object: AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                    parent: AdapterView<*>?,
                    view: View?,
                    position: Int,
                    id: Long
            ) {
                typeOfFontFamily = parent?.getItemAtPosition(position).toString()
                println(typeOfFontFamily)
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                TODO("Not yet implemented")
            }
        }

        spinnerFontSize.onItemSelectedListener = object: AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                    parent: AdapterView<*>?,
                    view: View?,
                    position: Int,
                    id: Long
            ) {
                var fontSize = parent?.getItemAtPosition(position).toString()
                typeOfFontSize = fontSize.toInt()
                println(typeOfFontSize)
            }
            override fun onNothingSelected(parent: AdapterView<*>?) {
                TODO("Not yet implemented")
            }
        }

        buttonPrinter.setOnClickListener() {
            printText()
        }

        buttonPrinterXMLNFCe.setOnClickListener(){
            printXmlNFCe()
        }

        buttonPrinterXMLSAT.setOnClickListener(){
            printXmlSAT()
        }

        return view
    }

    private fun printText() {
        val mapValues: MutableMap<String, Any> = HashMap()

        if (editTextInputMessage.text.toString() == "") {
            alertMessageStatus("Alert", "Campo Mensagem vazio.")
        } else {
            mapValues["text"] = editTextInputMessage.text.toString()
            mapValues["align"] = typeOfAlignment
            mapValues["font"] = typeOfFontFamily
            mapValues["fontSize"] = typeOfFontSize
            mapValues["isBold"] = checkBoxIsBold.isChecked
            mapValues["isUnderline"] = checkBoxIsUnderLine.isChecked

            PrinterMenu.printer.imprimeTexto(mapValues)

            jumpLine()
            if (checkBoxIsCutPaper.isChecked) cutPaper()
        }
    }

    @Throws(IOException::class)
    private fun printXmlNFCe() {
        val stringXMLNFCe: String

        val ins: InputStream = context?.resources?.openRawResource(
                requireContext().resources.getIdentifier(
                        xmlNFCe,
                        "raw",
                        requireContext().packageName
                )
        ) !!

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
        mapValues["indexcsc"] = 1
        mapValues["csc"] = "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES"
        mapValues["param"] = 0

        PrinterMenu.printer.imprimeXMLNFCe(mapValues)

        jumpLine()
        if (checkBoxIsCutPaper.isChecked) cutPaper()
    }

    @Throws(IOException::class)
    private fun printXmlSAT() {
        val stringXMLSat: String

        val ins: InputStream = context?.resources?.openRawResource(
                requireContext().resources.getIdentifier(
                        xmlSAT,
                        "raw",
                        requireContext().packageName
                )
        )!!

        val br = BufferedReader(InputStreamReader(ins))
        val sb = java.lang.StringBuilder()
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
        mapValues["param"] = 0

        PrinterMenu.printer.imprimeXMLSAT(mapValues)

        jumpLine()
        if (checkBoxIsCutPaper.isChecked) cutPaper()
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