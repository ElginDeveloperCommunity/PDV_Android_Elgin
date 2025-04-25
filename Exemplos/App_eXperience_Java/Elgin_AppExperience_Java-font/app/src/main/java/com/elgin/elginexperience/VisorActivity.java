package com.elgin.elginexperience;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;

public class VisorActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_visor);

        // Adiciona o FragmentVisor ao container
        FragmentVisor visorFragment = new FragmentVisor();
        getFragmentManager().beginTransaction()
                .replace(R.id.containerVisor, visorFragment)
                .commit();
    }
} 