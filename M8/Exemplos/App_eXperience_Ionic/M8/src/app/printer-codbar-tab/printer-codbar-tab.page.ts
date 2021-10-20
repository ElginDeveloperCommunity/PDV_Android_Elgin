import { Component, OnInit } from '@angular/core';
import { m8Plugin } from 'capacitor-elgin-m8';

@Component({
  selector: 'app-printer-codbar-tab',
  templateUrl: './printer-codbar-tab.page.html',
  styleUrls: ['./printer-codbar-tab.page.scss'],
})
export class PrinterCodbarTabPage implements OnInit {

  code? : string = "40170725";
  barcodeType? : string = "EAN 8";
  alignment? : string = "Centralizado";
  width? : number = 6;
  height? : number = 120;
  cutPaper? : boolean = false;

  isQrCodeNotSelected? : boolean = true;

  constructor() { }

  ngOnInit() {

  }

  codebarTypeListChange?(event){
    this.barcodeType = event.detail['value'];
    this.isQrCodeNotSelected = true;
    if(this.barcodeType == "EAN 8") this.code = "40170725";
    else if (this.barcodeType == "EAN 13") this.code = "0123456789012";
    else if (this.barcodeType == "QR CODE"){
      this.code = "ELGIN DEVELOPERS COMMUNITY";
      this.isQrCodeNotSelected = false;
    }
    else if (this.barcodeType == "UPC-A") this.code = "123601057072";
    else if (this.barcodeType == "UPC-E") this.code = "1234567";
    else if (this.barcodeType == "CODE 39") this.code = "*ABC123*";
    else if (this.barcodeType == "ITF") this.code = "05012345678900";
    else if (this.barcodeType == "CODE BAR") this.code = "A3419500A";
    else if (this.barcodeType == "CODE 93") this.code = "ABC123456789";
    else if (this.barcodeType == "CODE 128") this.code = "{C1233";
  }

  alinhamentoRadioChange?(event){
    this.alignment = event.detail['value'];
  }

  widthListChange?(event){
    this.width = parseInt(event.detail['value']);
  }

  heightListChange?(event){
    this.height = parseInt(event.detail['value']);
  }

  async printBarcode?(){
    if(this.code == "") alert("Campo de texto vazio!");
    else{
      await m8Plugin.printBarcode({
        barCodeType: this.barcodeType,
        code: this.code,
        height: this.height,
        width: this.width,
        alignment: this.alignment,
        cutPaper: this.cutPaper
      })
      .then(  sucessResponse => { console.log(sucessResponse["response"]); } ,
      failureResponse =>  { console.log(failureResponse) } );
      }
    }
    

  
}
