import { Component, OnInit } from '@angular/core';
import { m8Plugin } from 'capacitor-elgin-m8';

@Component({
  selector: 'app-tef',
  templateUrl: './tef.page.html',
  styleUrls: ['./tef.page.scss'],
})


export class TefPage implements OnInit {
  tefSelected: string = "paygo";
  picToView = "";
  tefReturn = "";
  
  green = "#38e121";
  black = "black";

  value = "2000";
  installmentsNumber = "1";
  ip = "192.168.0.16";

  paymentMethod = "Crédito";
  installmentMethod = "AVista"

  regexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

  isPaygoSelected : boolean = true;
  isMSitefSelected : boolean = false;

  mSitefBorder = this.black;
  paygoBorder = this.green;

  //PaygoImageBoolean
  wasPaygoRan : boolean = false;

  //paymentMethods
  creditBorder = this.green;
  debitBorder = this.black;
  allBorder = this.black;

  //installmentMethods
  storeBorder = this.black;
  admBorder = this.black;
  avistaBorder = this.green;

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


  selectMSitef(){
    this.mSitefBorder = this.green;
    this.paygoBorder = this.black;
    this.isMSitefSelected = true;
    this.isPaygoSelected = false;

    if(this.avistaBorder == this.green){
      this.avistaBorder = this.black;
      this.storeBorder = this.green;
    } 
  }

  selectPaygo(){
    this.mSitefBorder = this.black;
    this.paygoBorder = this.green;
    this.isMSitefSelected = false;
    this.isPaygoSelected = true;
  }

  //paymentMethods

  selectCredit(){
    this.paymentMethod = "Crédito";
    this.creditBorder = this.green;
    this.debitBorder = this.black;
    this.allBorder = this.black;
  }

  selectDebit(){
    this.paymentMethod = "Débito";
    this.creditBorder = this.black;
    this.debitBorder = this.green;
    this.allBorder = this.black;
  }

  selectAll(){
    this.paymentMethod = "Todos";
    this.creditBorder = this.black;
    this.debitBorder = this.black;
    this.allBorder = this.green;
  }

  //installmentMethods

  selectStore(){
    this.installmentMethod = "Loja";
    this.storeBorder = this.green;
    this.admBorder = this.black;
    this.avistaBorder = this.black;
  }

  selectAdm(){
    this.installmentMethod = "Adm";
    this.storeBorder = this.black;
    this.admBorder = this.green;
    this.avistaBorder = this.black;
  }

  selectAVista(){
    this.installmentMethod = "AVista";
    this.storeBorder = this.black;
    this.admBorder = this.black;
    this.avistaBorder = this.green;
  }

  async sendTransaction(){
    if(this.isMSitefSelected){
      if(this.regexp.test(this.ip) == false){
        alert("Insira um IP válido para o servidor do M-Sitef!");
      }
      else{
        await m8Plugin.sendSitefParams( {
          action: "SALE",
          ip: this.ip,
          value: this.value,
          paymentMethod: this.paymentMethod,
          installments: this.installmentsNumber
        })
        .then( sucessResult => this.tefReturn = this.tefReturn + sucessResult["VIA_CLIENTE"], 
          failureResult => alert(failureResult)
        );
      }
    }
    else{
      await m8Plugin.sendPaygoParams( {
        action: "SALE",
        valor: this.value,
        parcelas: 1,
        formaPagamento: this.paymentMethod,
        tipoParcelamento: this.installmentMethod
      })
      .then( sucessResult => { this.wasPaygoRan = true;
         this.picToView = "data:image/png;base64," + sucessResult["via_cliente"]; } ,
        failureResult => alert(failureResult)
      );
    }
    
  }

  async cancelTransaction(){
    if(this.isMSitefSelected){
      if(this.regexp.test(this.ip) == false){
        alert("Insira um IP válido para o servidor do M-Sitef!");
      }
      else{
        await m8Plugin.sendSitefParams( {
          action: "CANCEL",
          ip: this.ip,
          value: this.value,
          paymentMethod: this.paymentMethod,
          installments: this.installmentsNumber
        })
        .then( sucessResult => this.tefReturn = this.tefReturn + sucessResult["VIA_CLIENTE"], 
          failureResult => alert(failureResult)
        );
      }
    }
    else{
      await m8Plugin.sendPaygoParams( {
        action: "CANCEL",
        valor: this.value,
        parcelas: parseInt(this.installmentsNumber),
        formaPagamento: this.paymentMethod,
        tipoParcelamento: this.installmentMethod
      })
      .then( sucessResult => { this.wasPaygoRan = true;
        this.picToView = "data:image/png;base64," + sucessResult["via_cliente"]; } ,
        failureResult => alert(failureResult)
      );
    }
  }

  async configuration(){
    if(this.isMSitefSelected){
      if(this.regexp.test(this.ip) == false){
        alert("Insira um IP válido para o servidor do M-Sitef!");
      }
      else{
        await m8Plugin.sendSitefParams( {
          action: "CONFIGS",
          ip: this.ip,
          value: this.value,
          paymentMethod: this.paymentMethod,
          installments: this.installmentsNumber
        })
        .then( sucessResult => this.tefReturn = this.tefReturn + sucessResult["VIA_CLIENTE"], 
          failureResult => alert(failureResult)
        );
        }
      }
    else{
      await m8Plugin.sendPaygoParams( {
        action: "CONFIGS",
        valor: this.value,
        parcelas: parseInt(this.installmentsNumber),
        formaPagamento: this.paymentMethod,
        tipoParcelamento: this.installmentMethod
      })
      .then( sucessResult => this.picToView = "data:image/png;base64," + sucessResult["via_cliente"] ,
        failureResult => alert(failureResult)
      );
    }
  }

  

}
