import { Component, OnInit } from '@angular/core';
import { m8Plugin } from 'capacitor-elgin-m8';

@Component({
  selector: 'app-sat',
  templateUrl: './sat.page.html',
  styleUrls: ['./sat.page.scss'],
})
export class SatPage implements OnInit {
  satReturn : string = "";
  satModel : string = "SMART SAT";
  codeActivation : string = "123456789";

  constructor() { }

  xmlenviadadosvendasat : string = "../../assets/xmlenviadadosvendasat.xml";
  xmlSatGo : string = "../../assets/satgo3.xml";

  xmlcancelarultimavendasat : string = "../../assets/xmlcancelarultimavendasat.xml";

  xmlToBeSent = "";



  async ngOnInit() {
    await this.saveReadXmlSatEnviarVendaSATSMARTToString(this.xmlenviadadosvendasat);
    await this.saveReadXmlSatEnviarVendaSATGOToString(this.xmlSatGo);
    await this.saveReadXmlSatCancelarVendaToString(this.xmlcancelarultimavendasat);
    
    this.xmlToBeSent = this.xmlenviadadosvendasat;
  }

  satModelRadioChange(event){
    this.satModel = event.detail['value'];

    if(this.satModel == "SMART SAT"){
      this.xmlToBeSent = this.xmlenviadadosvendasat;
    } 
    else{
      this.xmlToBeSent = this.xmlSatGo;
    }

  }

  async sendConsultarSAT(){
    await m8Plugin.sendConsultarSAT().then(
     sucessResult => this.satReturn = sucessResult["satReturn"], 
      failureResult => console.log(failureResult)
    );
  }

  async sendStatusOperacionalSAT(){
    await m8Plugin.sendStatusOperacionalSAT({
      codeAtivacao : this.codeActivation
    }).then(
      sucessResult => this.satReturn = sucessResult["satReturn"] ,
      failureResult => console.log(failureResult)
    );
  }

  async sendEnviarVendasSAT(){
    await m8Plugin.sendEnviarVendasSAT(
      {
        codeAtivacao : this.codeActivation ,
        stringXMLSat : this.xmlToBeSent
      }
      ).then( sucessResult => this.satReturn = sucessResult["satReturn"] ,
        failureResult => console.log(failureResult)
      );
  }

  async sendCancelarVendaSAT(){
    await m8Plugin.sendCancelarVendaSAT(
      {
        codeAtivacao : this.codeActivation , 
        stringXMLCancelamentoSat : this.xmlToBeSent
      }
      ).then( sucessResult => this.satReturn = sucessResult["satReturn"] ,
        failureResult => console.log(failureResult)
      );
  }

  async sendAtivarSAT(){
    await m8Plugin.sendAtivarSAT({
      codeAtivacao : this.codeActivation
    }).then(
      sucessResult => this.satReturn = sucessResult["satReturn"] ,
      failureResult => console.log(failureResult)
    );
  }

  async sendAssociarSAT(){
    await m8Plugin.sendAssociarSAT({
      codeAtivacao : this.codeActivation
    }).then(
      sucessResult => this.satReturn = sucessResult["satReturn"] ,
      failureResult => console.log(failureResult)
    );
  }

  async saveReadXmlSatEnviarVendaSATSMARTToString?(xmlenviadadosvendasat: string){
    await fetch(xmlenviadadosvendasat)
      .then(response => response.text())
      .then(text => { this.xmlenviadadosvendasat = text } );
  }

  async saveReadXmlSatEnviarVendaSATGOToString?(xmlSatGo: string){
    await fetch(xmlSatGo)
      .then(response => response.text())
      .then(text => { this.xmlSatGo = text } );
  }

  async saveReadXmlSatCancelarVendaToString?(xmlcancelarultimavendasat : string){
    await fetch(xmlcancelarultimavendasat)
      .then(response => response.text())
      .then(text => { this.xmlcancelarultimavendasat = text } );
  }

}
