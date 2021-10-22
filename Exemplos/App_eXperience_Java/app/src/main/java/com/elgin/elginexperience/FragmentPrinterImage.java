package com.elgin.elginexperience;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.app.Fragment;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.Toast;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import static android.app.Activity.RESULT_OK;

public class FragmentPrinterImage extends Fragment {
    //DECLARE IMAGE VIEW
    ImageView imageView;

    //DECLARE BUTTONS
    Button buttonSelectImage;
    Button buttonPrintImage;

    //DECLARE CHECKBOX
    CheckBox checkBoxCutPaperImage;

    //PATH OF IMAGE
    Bitmap bitmap;
    String pathImage = "";

    //NAME OF PATH AND FILE IMAGE DEFAULT
    public static String NAME_IMAGE = "elgin";
    public static String DEF_TYPE = "drawable";

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_fragment_printer_image, container, false);

        //INIT IMAGE VIEW
        imageView = view.findViewById(R.id.previewImgDefault);

        //INIT BUTTONS
        buttonSelectImage = view.findViewById(R.id.buttonSelectImage);
        buttonPrintImage = view.findViewById(R.id.buttonPrintImage);

        //INIT CHECKBOX
        checkBoxCutPaperImage = view.findViewById(R.id.checkBoxCutPaperPrintImage);

        buttonSelectImage.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.M)
            @Override
            public void onClick(View v) {
                startGallery();
            }
        });

        buttonPrintImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendPrinterImage();
            }
        });

        return view;
    }

    private void startGallery() {
        Intent cameraIntent = new Intent(Intent.ACTION_PICK);

        cameraIntent.setType("image/*");

        startActivityForResult(cameraIntent, 1000);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(resultCode == RESULT_OK) {
            if(requestCode == 1000){
                Uri returnUri = data.getData();

                Bitmap bitmapImage = null;
                try {
                    bitmapImage = MediaStore.Images.Media.getBitmap(getActivity().getContentResolver(), returnUri);
                    setBitmap(bitmapImage);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                imageView.setImageBitmap(bitmapImage);
            }
        }else {
            Toast.makeText(MainActivity.context, "You haven't picked Image",Toast.LENGTH_LONG).show();
        }
    }

    public void setBitmap(Bitmap bitmapFileSelected){
        bitmap = bitmapFileSelected;
    }

    public void sendPrinterImage(){
        if(bitmap != null){
            PrinterMenu.printer.imprimeImagem(bitmap);
        }else{
            int id = 0;

            id = MainActivity.context.getApplicationContext().getResources().getIdentifier(
                    NAME_IMAGE,
                    DEF_TYPE,
                    MainActivity.context.getApplicationContext().getPackageName()
            );
            System.out.println("id: " + id);

            bitmap = BitmapFactory.decodeResource(MainActivity.context.getApplicationContext().getResources(), id);

            PrinterMenu.printer.imprimeImagem(bitmap);
        }

        jumpLine();
        if (checkBoxCutPaperImage.isChecked()) cutPaper();
    }

    public static String getPath(Context context, Uri uri ) {
        String result = null;
        String[] proj = { MediaStore.Images.Media.DATA };
        Cursor cursor = context.getContentResolver( ).query( uri, proj, null, null, null );
        if(cursor != null){
            if ( cursor.moveToFirst( ) ) {
                int column_index = cursor.getColumnIndexOrThrow( proj[0] );
                result = cursor.getString( column_index );
            }
            cursor.close( );
        }
        if(result == null) {
            result = "Not found";
        }
        return result;
    }

    public void jumpLine(){
        Map<String, Object> mapValues = new HashMap<>();
        mapValues.put("quant", 10);
        PrinterMenu.printer.AvancaLinhas(mapValues);
    }

    public void cutPaper(){
        Map<String, Object> mapValues = new HashMap<>();
        mapValues.put("quant", 10);
        PrinterMenu.printer.cutPaper(mapValues);
    }
}