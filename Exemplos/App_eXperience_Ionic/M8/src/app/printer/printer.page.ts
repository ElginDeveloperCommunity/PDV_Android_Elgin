import { Component, OnInit } from '@angular/core';
import { PrinterCodbarTabPage } from '../printer-codbar-tab/printer-codbar-tab.page';
//import { TestPage } from '../test/test.page';
import { PrinterTextTabPage } from '../printer-text-tab/printer-text-tab.page';
import { PrinterImageTabPage } from '../printer-image-tab/printer-image-tab.page';
import { m8Plugin } from 'capacitor-elgin-m8';

@Component({
  selector: 'app-printer',
  templateUrl: './printer.page.html',
  styleUrls: ['./printer.page.scss'],
})
export class PrinterPage implements OnInit {
  rootPage = PrinterTextTabPage;
  
  Ip: string = "192.168.0.19:9100"
  printerMethod = "Interna";

  regexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\:\d{1,5}$/;
  isExternalSelectable = false;

  constructor() { }

  async ngOnInit() {
    await m8Plugin.printerInternalImpStart().then(
      sucessResult => { console.log(sucessResult["response"]); } ,
     failureResult => { alert("Erro ao inicilizar a impressora" + failureResult); }
    );
  }

  async ngOnDestroy(){
    await m8Plugin.printerStop();
  }

  goToPrinterTextTab(){
    this.rootPage = PrinterTextTabPage;
  }

  async goToPrinterCodbarTab(){
    this.rootPage = PrinterCodbarTabPage;
    var result;
   
  }

  async goToPrinterImageTab(){
    this.rootPage = PrinterImageTabPage;
  }

  async debug(){
    await m8Plugin.chooseImage();
  }

  async onIpInserted(){
    var regexTest: boolean;
    regexTest = this.regexp.test(this.Ip);

    if( regexTest == true){
      this.isExternalSelectable = false;
    }
    else{
      this.isExternalSelectable = true;
      this.printerMethod = "Interna";
      alert("Insira um IP válido para habilitar a seleção de impressão por Impressora Externa!");
    }
  }

  onIpChanged(){
    var regexTest: boolean;
    regexTest = this.regexp.test(this.Ip);
    
    if(regexTest == true) this.isExternalSelectable = false;
    else{
      this.isExternalSelectable = true;
    }
  }

  async radioGroupChange(event){
    if(event.detail['value'] == 'Externa'){
      await m8Plugin.printerExternalImpStart( {
        Ip: this.Ip
      }).then(
        sucessResult => { console.log(sucessResult["response"]); } ,
       failureResult => { alert("Erro ao inicilizar a impressora Externa" + failureResult); }
      );
    }
    else{
      await m8Plugin.printerInternalImpStart().then(
        sucessResult => { console.log(sucessResult["response"]); } ,
       failureResult => { alert("Erro ao inicilizar a impressora" + failureResult); }
      );
    }
  }


  async printerStatus(){
    await m8Plugin.printerStatus()
    .then( Response => alert(Response["response"]));
  }

  async drawerStatus(){
    await m8Plugin.drawerStatus()
    .then( Response => alert(Response["response"]));
  }

  async openDrawer(){
    await m8Plugin.openDrawer()
    .then( Response => console.log(Response["response"]));
    
  }

}
