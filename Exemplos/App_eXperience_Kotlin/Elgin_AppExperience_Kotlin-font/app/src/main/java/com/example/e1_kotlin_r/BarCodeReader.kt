package com.example.e1_kotlin_r

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class BarCodeReader : AppCompatActivity() {
    private lateinit var buttonInitRead: Button
    private lateinit var buttonCleanAllInputs: Button

    private lateinit var editTextCodeBar1: EditText
    private lateinit var editTextCodeBar2: EditText
    private lateinit var editTextCodeBar3: EditText
    private lateinit var editTextCodeBar4: EditText
    private lateinit var editTextCodeBar5: EditText
    private lateinit var editTextCodeBar6: EditText
    private lateinit var editTextCodeBar7: EditText
    private lateinit var editTextCodeBar8: EditText
    private lateinit var editTextCodeBar9: EditText
    private lateinit var editTextCodeBar10: EditText

    lateinit var imageViewCodeBar1: ImageView
    lateinit var imageViewCodeBar2: ImageView
    lateinit var imageViewCodeBar3: ImageView
    lateinit var imageViewCodeBar4: ImageView
    lateinit var imageViewCodeBar5: ImageView
    lateinit var imageViewCodeBar6: ImageView
    lateinit var imageViewCodeBar7: ImageView
    lateinit var imageViewCodeBar8: ImageView
    lateinit var imageViewCodeBar9: ImageView
    lateinit var imageViewCodeBar10: ImageView

    lateinit var textViewCodeBar1: TextView
    lateinit var textViewCodeBar2: TextView
    lateinit var textViewCodeBar3: TextView
    lateinit var textViewCodeBar4: TextView
    lateinit var textViewCodeBar5: TextView
    lateinit var textViewCodeBar6: TextView
    lateinit var textViewCodeBar7: TextView
    lateinit var textViewCodeBar8: TextView
    lateinit var textViewCodeBar9: TextView
    lateinit var textViewCodeBar10: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_bar_code_reader)

        buttonInitRead = findViewById(R.id.buttonInitRead)
        buttonCleanAllInputs = findViewById(R.id.buttonCleanAllInputs)

        editTextCodeBar1 = findViewById(R.id.editTextCodeBar1)
        editTextCodeBar2 = findViewById(R.id.editTextCodeBar2)
        editTextCodeBar3 = findViewById(R.id.editTextCodeBar3)
        editTextCodeBar4 = findViewById(R.id.editTextCodeBar4)
        editTextCodeBar5 = findViewById(R.id.editTextCodeBar5)
        editTextCodeBar6 = findViewById(R.id.editTextCodeBar6)
        editTextCodeBar7 = findViewById(R.id.editTextCodeBar7)
        editTextCodeBar8 = findViewById(R.id.editTextCodeBar8)
        editTextCodeBar9 = findViewById(R.id.editTextCodeBar9)
        editTextCodeBar10 = findViewById(R.id.editTextCodeBar10)

        imageViewCodeBar1 = findViewById(R.id.imageViewCodeBar1)
        imageViewCodeBar1.visibility = View.GONE
        imageViewCodeBar2 = findViewById(R.id.imageViewCodeBar2)
        imageViewCodeBar2.visibility = View.GONE
        imageViewCodeBar3 = findViewById(R.id.imageViewCodeBar3)
        imageViewCodeBar3.visibility = View.GONE
        imageViewCodeBar4 = findViewById(R.id.imageViewCodeBar4)
        imageViewCodeBar4.visibility = View.GONE
        imageViewCodeBar5 = findViewById(R.id.imageViewCodeBar5)
        imageViewCodeBar5.visibility = View.GONE
        imageViewCodeBar6 = findViewById(R.id.imageViewCodeBar6)
        imageViewCodeBar6.visibility = View.GONE
        imageViewCodeBar7 = findViewById(R.id.imageViewCodeBar7)
        imageViewCodeBar7.visibility = View.GONE
        imageViewCodeBar8 = findViewById(R.id.imageViewCodeBar8)
        imageViewCodeBar8.visibility = View.GONE
        imageViewCodeBar9 = findViewById(R.id.imageViewCodeBar9)
        imageViewCodeBar9.visibility = View.GONE
        imageViewCodeBar10 = findViewById(R.id.imageViewCodeBar10)
        imageViewCodeBar10.visibility = View.GONE

        textViewCodeBar1 = findViewById(R.id.textViewCodeBar1)
        textViewCodeBar1.visibility = View.GONE
        textViewCodeBar2 = findViewById(R.id.textViewCodeBar2)
        textViewCodeBar2.visibility = View.GONE
        textViewCodeBar3 = findViewById(R.id.textViewCodeBar3)
        textViewCodeBar3.visibility = View.GONE
        textViewCodeBar4 = findViewById(R.id.textViewCodeBar4)
        textViewCodeBar4.visibility = View.GONE
        textViewCodeBar5 = findViewById(R.id.textViewCodeBar5)
        textViewCodeBar5.visibility = View.GONE
        textViewCodeBar6 = findViewById(R.id.textViewCodeBar6)
        textViewCodeBar6.visibility = View.GONE
        textViewCodeBar7 = findViewById(R.id.textViewCodeBar7)
        textViewCodeBar7.visibility = View.GONE
        textViewCodeBar8 = findViewById(R.id.textViewCodeBar8)
        textViewCodeBar8.visibility = View.GONE
        textViewCodeBar9 = findViewById(R.id.textViewCodeBar9)
        textViewCodeBar9.visibility = View.GONE
        textViewCodeBar10 = findViewById(R.id.textViewCodeBar10)
        textViewCodeBar10.visibility = View.GONE

        buttonInitRead.setOnClickListener {
            editTextCodeBar1.requestFocus()

        }

        buttonCleanAllInputs.setOnClickListener {
            editTextCodeBar1.setText("")
            editTextCodeBar2.setText("")
            editTextCodeBar3.setText("")
            editTextCodeBar4.setText("")
            editTextCodeBar5.setText("")
            editTextCodeBar6.setText("")
            editTextCodeBar7.setText("")
            editTextCodeBar8.setText("")
            editTextCodeBar9.setText("")
            editTextCodeBar10.setText("")
            editTextCodeBar1.clearFocus()
            editTextCodeBar2.clearFocus()
            editTextCodeBar3.clearFocus()
            editTextCodeBar4.clearFocus()
            editTextCodeBar5.clearFocus()
            editTextCodeBar6.clearFocus()
            editTextCodeBar7.clearFocus()
            editTextCodeBar8.clearFocus()
            editTextCodeBar9.clearFocus()
            editTextCodeBar10.clearFocus()
        }

        editTextCodeBar1.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable) {
                if (s.toString().isEmpty()) {
                    imageViewCodeBar1.visibility = View.GONE
                    textViewCodeBar1.visibility = View.GONE
                }
            }

            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                if (s.toString().isNotEmpty()) {
                    imageViewCodeBar1.visibility = View.VISIBLE
                    textViewCodeBar1.visibility = View.VISIBLE
                }
            }
        })

        editTextCodeBar2.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable) {
                if (s.toString().isEmpty()) {
                    imageViewCodeBar2.visibility = View.GONE
                    textViewCodeBar2.visibility = View.GONE
                }
            }

            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                if (s.toString().isNotEmpty()) {
                    imageViewCodeBar2.visibility = View.VISIBLE
                    textViewCodeBar2.visibility = View.VISIBLE
                }
            }
        })

        editTextCodeBar3.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable) {
                if (s.toString().isEmpty()) {
                    imageViewCodeBar3.visibility = View.GONE
                    textViewCodeBar3.visibility = View.GONE
                }
            }

            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                if (s.toString().isNotEmpty()) {
                    imageViewCodeBar3.visibility = View.VISIBLE
                    textViewCodeBar3.visibility = View.VISIBLE
                }
            }
        })

        editTextCodeBar4.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable) {
                if (s.toString().isEmpty()) {
                    imageViewCodeBar4.visibility = View.GONE
                    textViewCodeBar4.visibility = View.GONE
                }
            }

            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                if (s.toString().isNotEmpty()) {
                    imageViewCodeBar4.visibility = View.VISIBLE
                    textViewCodeBar4.visibility = View.VISIBLE
                }
            }
        })

        editTextCodeBar5.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable) {
                if (s.toString().isEmpty()) {
                    imageViewCodeBar5.visibility = View.GONE
                    textViewCodeBar5.visibility = View.GONE
                }
            }

            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                if (s.toString().isNotEmpty()) {
                    imageViewCodeBar5.visibility = View.VISIBLE
                    textViewCodeBar5.visibility = View.VISIBLE
                }
            }
        })

        editTextCodeBar6.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable) {
                if (s.toString().isEmpty()) {
                    imageViewCodeBar6.visibility = View.GONE
                    textViewCodeBar6.visibility = View.GONE
                }
            }

            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                if (s.toString().isNotEmpty()) {
                    imageViewCodeBar6.visibility = View.VISIBLE
                    textViewCodeBar6.visibility = View.VISIBLE
                }
            }
        })

        editTextCodeBar7.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable) {
                if (s.toString().isEmpty()) {
                    imageViewCodeBar7.visibility = View.GONE
                    textViewCodeBar7.visibility = View.GONE
                }
            }

            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                if (s.toString().isNotEmpty()) {
                    imageViewCodeBar7.visibility = View.VISIBLE
                    textViewCodeBar7.visibility = View.VISIBLE
                }
            }
        })

        editTextCodeBar8.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable) {
                if (s.toString().isEmpty()) {
                    imageViewCodeBar8.visibility = View.GONE
                    textViewCodeBar8.visibility = View.GONE
                }
            }

            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                if (s.toString().isNotEmpty()) {
                    imageViewCodeBar8.visibility = View.VISIBLE
                    textViewCodeBar8.visibility = View.VISIBLE
                }
            }
        })

        editTextCodeBar9.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable) {
                if (s.toString().isEmpty()) {
                    imageViewCodeBar9.visibility = View.GONE
                    textViewCodeBar9.visibility = View.GONE
                }
            }

            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                if (s.toString().isNotEmpty()) {
                    imageViewCodeBar9.visibility = View.VISIBLE
                    textViewCodeBar9.visibility = View.VISIBLE
                }
            }
        })

        editTextCodeBar10.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable) {
                if (s.toString().isEmpty()) {
                    imageViewCodeBar10.visibility = View.GONE
                    textViewCodeBar10.visibility = View.GONE
                }
            }

            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                if (s.toString().isNotEmpty()) {
                    imageViewCodeBar10.visibility = View.VISIBLE
                    textViewCodeBar10.visibility = View.VISIBLE
                }
            }
        })
    }
}