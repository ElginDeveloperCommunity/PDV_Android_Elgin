import { Component, OnInit } from '@angular/core';
import { m8Plugin } from 'capacitor-elgin-m8';


@Component({
  selector: 'app-printer-text-tab',
  templateUrl: './printer-text-tab.page.html',
  styleUrls: ['./printer-text-tab.page.scss'],
})
export class PrinterTextTabPage implements OnInit {

  message? : string = "ELGIN DEVELOPER COMMUNITY";
  alignment? : string = "Centralizado";
  font? : string = "FONT A";
  fontSize? : number = 17;
  isBold? : boolean = false;
  isUnderline? : boolean = false;
  cutPaper? : boolean = true;


  xmlSatPath? : string = "../../assets/xmlsat.xml";
  xmlNfcePath? : string = "../../assets/xmlnfce.xml";

  xmlSat? : string;
  xmlNfce? : string;

  constructor() { }

  
  ngOnInit() {
    this.saveReadXmlSatTextToString("file//" + this.xmlSatPath);
    this.saveReadXmlNfceTextToString("file//" + this.xmlNfcePath);
  }

  alinhamentoRadioChange?(event){
    this.alignment = event.detail['value'];
  }

  fontListChange?(event){
    this.font = event.detail['value'];
  }

  fontsizeListChange?(event){
    this.fontSize = parseInt(event.detail['value']);
  }

  async printText?(){
    if(this.message == "") alert("Campo de texto vazio!");
    else{
      await m8Plugin.printText({
        message: this.message,
        alignment : this.alignment,
        font: this.font,
        fontSize: this.fontSize,
        isBold: this.isBold,
        isUnderline: this.isUnderline,
        cutPaper: this.cutPaper
      })
        .then( sucessResponse => { console.log(sucessResponse["response"]) } , 
               failureResponse => { console.log(failureResponse) }
        );  
    }
    
   
    
  }

  async printXmlSAT?(){
    await m8Plugin.printXmlSat( { 
        xmlSAT: this.xmlSat,
        cutPaper: this.cutPaper
      } )
        .then( sucessResponse => { console.log(sucessResponse["response"]) } ,
         failureResponse =>  { console.log(failureResponse) }
        );
  }

  async printXmlNFCE?(){
    await m8Plugin.printXmlNFCe( {
      xmlNFCe: this.xmlNfce,
      cutPaper: this.cutPaper
    })
      .then( sucessResponse => { console.log(sucessResponse["response"]) } ,
      failureResponse => { console.log(failureResponse) }
      );
  }

  async saveReadXmlSatTextToString?(xmlSatPath: string){
    await fetch(xmlSatPath)
      .then(response => response.text())
      .then(text => { this.xmlSat = text } );
  }

  async saveReadXmlNfceTextToString?(xmlNfcePath: string){
    await fetch(xmlNfcePath)
      .then(response => response.text())
      .then(text => { this.xmlNfce = text } );
  }


}
