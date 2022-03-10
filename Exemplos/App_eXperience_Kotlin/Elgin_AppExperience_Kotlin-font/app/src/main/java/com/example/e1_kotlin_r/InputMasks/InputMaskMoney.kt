package com.example.e1_kotlin_r.InputMasks

import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText
import java.lang.ref.WeakReference
import java.math.BigDecimal
import java.text.NumberFormat


class InputMaskMoney(editText: EditText) : TextWatcher {
    //Referência necessária para atribuir valor ao campo em questão
    private val editTextWeakReference: WeakReference<EditText>

    //Váriavél sentinela utilizada para impedir loop em caso de a mudança ter sido feita pelo própio TextWatcher
    var _ignore = false
    override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
    override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {}
    override fun afterTextChanged(editable: Editable) {
        //Atualiza a referência ao EditText definido no método construtor
        val editText = editTextWeakReference.get()

        //Impedir erro de null pointer exception caso string vazia / impedir loop caso a própia classe tenha causado uma alteração no editText.
        val newValue = editable.toString().trim { it <= ' ' }
        if (_ignore) return

        //Transforma casas decimais em valor inteiro
        val newValueInIntenger = newValue.replace("[,.]".toRegex(), "")

        //Transforma o novo valor em BigDecimal
        var newValueInBigDecimal = BigDecimal(newValueInIntenger)
        //Seta a escala de precisão para duas casas decimais somente
        newValueInBigDecimal = newValueInBigDecimal.setScale(2)
        //Divide o valor por 100, para obtermos novamente as casas decimais
        newValueInBigDecimal = newValueInBigDecimal.divide(BigDecimal("100"))

        //Formatando o valor para o formato de moeda
        val newValueFormattedInCurrency =
            NumberFormat.getCurrencyInstance().format(newValueInBigDecimal)
        //Removendo o símbolo da moeda (é possível que o símbolo da moeda contenha caracteres que precisam ser escapados, por esta razão são agrupados no regex)
        val newValueInCurrencyClean = newValueFormattedInCurrency.replace(
            "[" + NumberFormat.getCurrencyInstance().currency.symbol + "]".toRegex(),
            ""
        )

        //Previne o loop
        _ignore = true
        //Atualiza o campo com o valor tratado
        editText!!.setText(newValueInCurrencyClean)
        //Define o cursor de inserção para a ultima posição
        editText.setSelection(newValueInCurrencyClean.length)

        //Permite que o TextWatcher observe uma mudança novamente
        _ignore = false
    }

    init {
        println(editText.text.toString())
        editTextWeakReference = WeakReference(editText)
    }
}
