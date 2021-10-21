package com.elgin.elginexperience;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

public class BarCodeReader extends AppCompatActivity {
    //DECLARE BUTTONS
    Button buttonInitRead;
    Button buttonCleanAllInputs;

    //DECLARE EDIT TEXTS
    EditText editTextCodeBar1;
    EditText editTextCodeBar2;
    EditText editTextCodeBar3;
    EditText editTextCodeBar4;
    EditText editTextCodeBar5;
    EditText editTextCodeBar6;
    EditText editTextCodeBar7;
    EditText editTextCodeBar8;
    EditText editTextCodeBar9;
    EditText editTextCodeBar10;

    //DECLARE IMAGE VIEWS
    ImageView imageViewCodeBar1;
    ImageView imageViewCodeBar2;
    ImageView imageViewCodeBar3;
    ImageView imageViewCodeBar4;
    ImageView imageViewCodeBar5;
    ImageView imageViewCodeBar6;
    ImageView imageViewCodeBar7;
    ImageView imageViewCodeBar8;
    ImageView imageViewCodeBar9;
    ImageView imageViewCodeBar10;

    //DECLARE TEXTS VIEWS
    TextView textViewCodeBar1;
    TextView textViewCodeBar2;
    TextView textViewCodeBar3;
    TextView textViewCodeBar4;
    TextView textViewCodeBar5;
    TextView textViewCodeBar6;
    TextView textViewCodeBar7;
    TextView textViewCodeBar8;
    TextView textViewCodeBar9;
    TextView textViewCodeBar10;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bar_code_reader);
        //INIT BUTTONS
        buttonInitRead = findViewById(R.id.buttonInitRead);
        buttonCleanAllInputs = findViewById(R.id.buttonCleanAllInputs);

        //INIT EDIT TEXTS
        editTextCodeBar1 = findViewById(R.id.editTextCodeBar1);
        editTextCodeBar2 = findViewById(R.id.editTextCodeBar2);
        editTextCodeBar3 = findViewById(R.id.editTextCodeBar3);
        editTextCodeBar4 = findViewById(R.id.editTextCodeBar4);
        editTextCodeBar5 = findViewById(R.id.editTextCodeBar5);
        editTextCodeBar6 = findViewById(R.id.editTextCodeBar6);
        editTextCodeBar7 = findViewById(R.id.editTextCodeBar7);
        editTextCodeBar8 = findViewById(R.id.editTextCodeBar8);
        editTextCodeBar9 = findViewById(R.id.editTextCodeBar9);
        editTextCodeBar10 = findViewById(R.id.editTextCodeBar10);

        //INIT IMAGE VIEWS AND SET INVISIBLE
        imageViewCodeBar1 = findViewById(R.id.imageViewCodeBar1);
        imageViewCodeBar1.setVisibility(View.GONE);
        imageViewCodeBar2 = findViewById(R.id.imageViewCodeBar2);
        imageViewCodeBar2.setVisibility(View.GONE);
        imageViewCodeBar3 = findViewById(R.id.imageViewCodeBar3);
        imageViewCodeBar3.setVisibility(View.GONE);
        imageViewCodeBar4 = findViewById(R.id.imageViewCodeBar4);
        imageViewCodeBar4.setVisibility(View.GONE);
        imageViewCodeBar5 = findViewById(R.id.imageViewCodeBar5);
        imageViewCodeBar5.setVisibility(View.GONE);
        imageViewCodeBar6 = findViewById(R.id.imageViewCodeBar6);
        imageViewCodeBar6.setVisibility(View.GONE);
        imageViewCodeBar7 = findViewById(R.id.imageViewCodeBar7);
        imageViewCodeBar7.setVisibility(View.GONE);
        imageViewCodeBar8 = findViewById(R.id.imageViewCodeBar8);
        imageViewCodeBar8.setVisibility(View.GONE);
        imageViewCodeBar9 = findViewById(R.id.imageViewCodeBar9);
        imageViewCodeBar9.setVisibility(View.GONE);
        imageViewCodeBar10 = findViewById(R.id.imageViewCodeBar10);
        imageViewCodeBar10.setVisibility(View.GONE);


        //INIT TEXT VIEWS AND SET INVISIBLE
        textViewCodeBar1 = findViewById(R.id.textViewCodeBar1);
        textViewCodeBar1.setVisibility(View.GONE);
        textViewCodeBar2 = findViewById(R.id.textViewCodeBar2);
        textViewCodeBar2.setVisibility(View.GONE);
        textViewCodeBar3 = findViewById(R.id.textViewCodeBar3);
        textViewCodeBar3.setVisibility(View.GONE);
        textViewCodeBar4 = findViewById(R.id.textViewCodeBar4);
        textViewCodeBar4.setVisibility(View.GONE);
        textViewCodeBar5 = findViewById(R.id.textViewCodeBar5);
        textViewCodeBar5.setVisibility(View.GONE);
        textViewCodeBar6 = findViewById(R.id.textViewCodeBar6);
        textViewCodeBar6.setVisibility(View.GONE);
        textViewCodeBar7 = findViewById(R.id.textViewCodeBar7);
        textViewCodeBar7.setVisibility(View.GONE);
        textViewCodeBar8 = findViewById(R.id.textViewCodeBar8);
        textViewCodeBar8.setVisibility(View.GONE);
        textViewCodeBar9 = findViewById(R.id.textViewCodeBar9);
        textViewCodeBar9.setVisibility(View.GONE);
        textViewCodeBar10 = findViewById(R.id.textViewCodeBar10);
        textViewCodeBar10.setVisibility(View.GONE);

        buttonInitRead.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                editTextCodeBar1.requestFocus();
            }
        });

        buttonCleanAllInputs.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                editTextCodeBar1.setText("");
                editTextCodeBar2.setText("");
                editTextCodeBar3.setText("");
                editTextCodeBar4.setText("");
                editTextCodeBar5.setText("");
                editTextCodeBar6.setText("");
                editTextCodeBar7.setText("");
                editTextCodeBar8.setText("");
                editTextCodeBar9.setText("");
                editTextCodeBar10.setText("");

                editTextCodeBar1.clearFocus();
                editTextCodeBar2.clearFocus();
                editTextCodeBar3.clearFocus();
                editTextCodeBar4.clearFocus();
                editTextCodeBar5.clearFocus();
                editTextCodeBar6.clearFocus();
                editTextCodeBar7.clearFocus();
                editTextCodeBar8.clearFocus();
                editTextCodeBar9.clearFocus();
                editTextCodeBar10.clearFocus();
            }
        });

        editTextCodeBar1.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void afterTextChanged(Editable s) {
                if(s.toString().isEmpty()){
                    imageViewCodeBar1.setVisibility(View.GONE);
                    textViewCodeBar1.setVisibility(View.GONE);
                }
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(!s.toString().isEmpty()){
                    imageViewCodeBar1.setVisibility(View.VISIBLE);
                    textViewCodeBar1.setVisibility(View.VISIBLE);
                }
            }
        });

        editTextCodeBar2.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void afterTextChanged(Editable s) {
                if(s.toString().isEmpty()){
                    imageViewCodeBar2.setVisibility(View.GONE);
                    textViewCodeBar2.setVisibility(View.GONE);
                }
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(!s.toString().isEmpty()){
                    imageViewCodeBar2.setVisibility(View.VISIBLE);
                    textViewCodeBar2.setVisibility(View.VISIBLE);
                }
            }
        });

        editTextCodeBar3.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void afterTextChanged(Editable s) {
                if(s.toString().isEmpty()){
                    imageViewCodeBar3.setVisibility(View.GONE);
                    textViewCodeBar3.setVisibility(View.GONE);
                }
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(!s.toString().isEmpty()){
                    imageViewCodeBar3.setVisibility(View.VISIBLE);
                    textViewCodeBar3.setVisibility(View.VISIBLE);
                }
            }
        });

        editTextCodeBar4.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void afterTextChanged(Editable s) {
                if(s.toString().isEmpty()){
                    imageViewCodeBar4.setVisibility(View.GONE);
                    textViewCodeBar4.setVisibility(View.GONE);
                }
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(!s.toString().isEmpty()){
                    imageViewCodeBar4.setVisibility(View.VISIBLE);
                    textViewCodeBar4.setVisibility(View.VISIBLE);
                }
            }
        });

        editTextCodeBar5.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void afterTextChanged(Editable s) {
                if(s.toString().isEmpty()){
                    imageViewCodeBar5.setVisibility(View.GONE);
                    textViewCodeBar5.setVisibility(View.GONE);
                }
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(!s.toString().isEmpty()){
                    imageViewCodeBar5.setVisibility(View.VISIBLE);
                    textViewCodeBar5.setVisibility(View.VISIBLE);
                }
            }
        });

        editTextCodeBar6.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void afterTextChanged(Editable s) {
                if(s.toString().isEmpty()){
                    imageViewCodeBar6.setVisibility(View.GONE);
                    textViewCodeBar6.setVisibility(View.GONE);
                }
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(!s.toString().isEmpty()){
                    imageViewCodeBar6.setVisibility(View.VISIBLE);
                    textViewCodeBar6.setVisibility(View.VISIBLE);
                }
            }
        });

        editTextCodeBar7.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void afterTextChanged(Editable s) {
                if(s.toString().isEmpty()){
                    imageViewCodeBar7.setVisibility(View.GONE);
                    textViewCodeBar7.setVisibility(View.GONE);
                }
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(!s.toString().isEmpty()){
                    imageViewCodeBar7.setVisibility(View.VISIBLE);
                    textViewCodeBar7.setVisibility(View.VISIBLE);
                }
            }
        });

        editTextCodeBar8.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void afterTextChanged(Editable s) {
                if(s.toString().isEmpty()){
                    imageViewCodeBar8.setVisibility(View.GONE);
                    textViewCodeBar8.setVisibility(View.GONE);
                }
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(!s.toString().isEmpty()){
                    imageViewCodeBar8.setVisibility(View.VISIBLE);
                    textViewCodeBar8.setVisibility(View.VISIBLE);
                }
            }
        });

        editTextCodeBar9.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void afterTextChanged(Editable s) {
                if(s.toString().isEmpty()){
                    imageViewCodeBar9.setVisibility(View.GONE);
                    textViewCodeBar9.setVisibility(View.GONE);
                }
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(!s.toString().isEmpty()){
                    imageViewCodeBar9.setVisibility(View.VISIBLE);
                    textViewCodeBar9.setVisibility(View.VISIBLE);
                }
            }
        });

        editTextCodeBar10.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void afterTextChanged(Editable s) {
                if(s.toString().isEmpty()){
                    imageViewCodeBar10.setVisibility(View.GONE);
                    textViewCodeBar10.setVisibility(View.GONE);
                }
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(!s.toString().isEmpty()){
                    imageViewCodeBar10.setVisibility(View.VISIBLE);
                    textViewCodeBar10.setVisibility(View.VISIBLE);
                }
            }
        });
    }
}