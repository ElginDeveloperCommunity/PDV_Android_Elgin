package com.elgin.intent_digital_hub.InputMasks;

import android.text.Editable;
import android.text.TextWatcher;
import android.widget.EditText;

import java.lang.ref.WeakReference;
import java.math.BigDecimal;
import java.text.NumberFormat;

/**
 * Mascára criada para formatação de valores monetários
 */

public class InputMaskMoney implements TextWatcher {

    //Referência necessária para atribuir valor ao campo em questão
    private final WeakReference<EditText> editTextWeakReference;

    //Váriavél sentinela utilizada para impedir loop em caso de a mudança ter sido feita pelo própio TextWatcher
    boolean _ignore = false;


    public InputMaskMoney(EditText editText) {
        System.out.println(editText.getText().toString());
        this.editTextWeakReference = new WeakReference<EditText>(editText);
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {
    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {
    }

    @Override
    public void afterTextChanged(Editable editable) {
        //Atualiza a referência ao EditText definido no método construtor
        EditText editText = editTextWeakReference.get();

        //Impedir erro de null pointer exception caso string vazia / impedir loop caso a própia classe tenha causado uma alteração no editText.
        String newValue = editable.toString().trim();
        if (_ignore) return;

        //Transforma casas decimais em valor inteiro
        String newValueInIntenger = newValue.replaceAll("[,.]", "");

        //Transforma o novo valor em BigDecimal
        BigDecimal newValueInBigDecimal = new BigDecimal(newValueInIntenger);
        //Seta a escala de precisão para duas casas decimais somente
        newValueInBigDecimal = newValueInBigDecimal.setScale(2);
        //Divide o valor por 100, para obtermos novamente as casas decimais
        newValueInBigDecimal = newValueInBigDecimal.divide(new BigDecimal("100"));

        //Formatando o valor para o formato de moeda
        String newValueFormattedInCurrency = NumberFormat.getCurrencyInstance().format(newValueInBigDecimal);
        //Removendo o símbolo da moeda (é possível que o símbolo da moeda contenha caracteres que precisam ser escapados, por esta razão são agrupados no regex)
        String newValueInCurrencyClean = newValueFormattedInCurrency.replaceAll("[" + NumberFormat.getCurrencyInstance().getCurrency().getSymbol() + "]", "");

        //Previne o loop
        _ignore = true;
        //Atualiza o campo com o valor tratado
        editText.setText(newValueInCurrencyClean);
        //Define o cursor de inserção para a ultima posição
        editText.setSelection(newValueInCurrencyClean.length());

        //Permite que o TextWatcher observe uma mudança novamente
        _ignore = false;
    }
}
