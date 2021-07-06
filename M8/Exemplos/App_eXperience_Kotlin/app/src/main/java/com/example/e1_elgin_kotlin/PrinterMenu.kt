package com.example.e1_elgin_kotlin

import android.app.AlertDialog
import android.content.Context
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.RadioButton
import android.widget.RadioGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.content.res.AppCompatResources
import java.util.regex.Pattern

class PrinterMenu : AppCompatActivity() {
    lateinit var radioGroupConnectPrinterIE: RadioGroup
    lateinit var radioButtonConnectPrinterIntern: RadioButton
    var context: Context = this

    lateinit var buttonStatusPrinter: Button
    lateinit var buttonStatusGaveta: Button
    lateinit var buttonAbrirGaveta: Button
    lateinit var editTextInputIP: EditText

    companion object{
        lateinit var printer: Printer
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_printer_menu)

        printer = Printer(this)
        printer.printerInternalImpStart()

        val buttonPrinterTextSelect = findViewById<Button>(R.id.buttonPrinterTextSelect)
        val buttonPrinterBarCodeSelect = findViewById<Button>(R.id.buttonPrinterBarCodeSelect)
        val buttonPrinterImageSelect = findViewById<Button>(R.id.buttonPrinterImageSelect)

        radioGroupConnectPrinterIE = findViewById(R.id.radioGroupConnectPrinterIE)
        radioButtonConnectPrinterIntern = findViewById(R.id.radioButtonConnectPrinterIntern)

        buttonStatusPrinter = findViewById(R.id.buttonStatus)
        buttonStatusGaveta = findViewById(R.id.buttonStatusGaveta)
        buttonAbrirGaveta = findViewById(R.id.buttonAbrirGaveta)

        editTextInputIP = findViewById(R.id.editTextInputIP)
        editTextInputIP!!.setText("192.168.0.31:9100")

        radioButtonConnectPrinterIntern.isChecked = true
        radioGroupConnectPrinterIE.setOnCheckedChangeListener { _, checkedId ->
            if (checkedId == R.id.radioButtonConnectPrinterIntern)
                printer.printerInternalImpStart()

            if (checkedId == R.id.radioButtonConnectPrinterExtern) {
                if (isIpValid(editTextInputIP.text.toString())) {
                    connectExternPrinter(editTextInputIP.text.toString())
                } else {
                    alertMessageStatus("Digite um IP válido.")
                    radioButtonConnectPrinterIntern.isChecked = true
                }
            }
            println()
        }

        showPrinterTextScreen()

        buttonPrinterTextSelect.backgroundTintList = AppCompatResources.getColorStateList(
                context,
                R.color.azul
        )

        buttonPrinterTextSelect?.setOnClickListener() {
            buttonPrinterTextSelect.backgroundTintList = AppCompatResources.getColorStateList(
                    context,
                    R.color.azul
            )
            buttonPrinterBarCodeSelect.backgroundTintList = AppCompatResources.getColorStateList(
                    context,
                    R.color.black
            )
            buttonPrinterImageSelect.backgroundTintList = AppCompatResources.getColorStateList(
                    context,
                    R.color.black
            )
            showPrinterTextScreen()
        }

        buttonPrinterBarCodeSelect?.setOnClickListener() {
            buttonPrinterTextSelect.backgroundTintList = AppCompatResources.getColorStateList(
                    context,
                    R.color.black
            )
            buttonPrinterBarCodeSelect.backgroundTintList = AppCompatResources.getColorStateList(
                    context,
                    R.color.azul
            )
            buttonPrinterImageSelect.backgroundTintList = AppCompatResources.getColorStateList(
                    context,
                    R.color.black
            )
            showPrinterBarCodeScreen()
        }

        buttonPrinterImageSelect?.setOnClickListener() {
            buttonPrinterTextSelect.backgroundTintList = AppCompatResources.getColorStateList(
                    context,
                    R.color.black
            )
            buttonPrinterBarCodeSelect.backgroundTintList = AppCompatResources.getColorStateList(
                    context,
                    R.color.black
            )
            buttonPrinterImageSelect.backgroundTintList = AppCompatResources.getColorStateList(
                    context,
                    R.color.azul
            )
            showPrinterImageScreen()
        }

        buttonStatusPrinter.setOnClickListener(){ statusPrinter() }

        buttonStatusGaveta.setOnClickListener { statusGaveta() }

        buttonAbrirGaveta.setOnClickListener { abrirGaveta() }
    }

    private fun connectExternPrinter(ip: String) {
        val ipAndPort = ip.split(":").toTypedArray()
        val result = printer.printerExternalImpStart(ipAndPort[0], ipAndPort[1].toInt())
    }

    private fun showPrinterTextScreen() {
        val fragmentText = FragmentPrinterText()
        val transaction = supportFragmentManager.beginTransaction()
        transaction.replace(R.id.containerFragments, fragmentText)
        transaction.commit()
    }

    private fun showPrinterImageScreen() {
        val fragmentImage = FragmentPrinterImage()
        val transaction = supportFragmentManager.beginTransaction()
        transaction.replace(R.id.containerFragments, fragmentImage)
        transaction.commit()
    }

    private fun showPrinterBarCodeScreen() {
        val fragmentBarCode = FragmentPrinterBarCode()
        val transaction = supportFragmentManager.beginTransaction()
        transaction.replace(R.id.containerFragments, fragmentBarCode)
        transaction.commit()
    }

    private fun statusPrinter() {
        var statusPrinter = ""

        val resultStatus = printer.statusSensorPapel()
        statusPrinter = if (resultStatus == 5) {
            "Papel está presente e não está próximo do fim!"
        } else if (resultStatus == 6) {
            "Papel próximo do fim!"
        } else if (resultStatus == 7) {
            "Papel ausente!"
        } else {
            "Status Desconhecido!"
        }

        alertMessageStatus(statusPrinter)
    }

    private fun statusGaveta() {
        var statusPrinter = ""

        val resultStatus = printer.statusGaveta()
        println("GAVETA: " + resultStatus)

        statusPrinter = if (resultStatus == 1) {
            "Gaveta aberta!"
        } else if (resultStatus == 2) {
            "Gaveta fechada!"
        } else {
            "Status Desconhecido!"
        }

        alertMessageStatus(statusPrinter)
    }

    private fun abrirGaveta(): Int {
        return printer.abrirGaveta()
    }

    private fun alertMessageStatus(messageAlert: String?) {
        val alertDialog = AlertDialog.Builder(printer.mActivity).create()
        alertDialog.setTitle("Alert")
        alertDialog.setMessage(messageAlert)
        alertDialog.setButton(
                AlertDialog.BUTTON_NEUTRAL, "OK"
        ) { dialog, which -> dialog.dismiss() }
        alertDialog.show()
    }

    private fun isIpValid(ip: String?): Boolean {
        val pattern =
                Pattern.compile("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$")
        val matcher = pattern.matcher(ip)
        return matcher.matches()
    }
}

