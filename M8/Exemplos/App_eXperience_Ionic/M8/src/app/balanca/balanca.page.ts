import { Component, OnInit } from '@angular/core';
import { m8Plugin } from '../../../../capacitor-elgin-m8/dist/esm';

@Component({
  selector: 'app-balanca',
  templateUrl: './balanca.page.html',
  styleUrls: ['./balanca.page.scss'],
})
export class BalancaPage implements OnInit {
  model : string = "DP30CK";
  protocol : string = "PROTOCOL 0";

  balancaReturn : string = "";

  constructor() { }

  ngOnInit() {
  }

  modelRadioChange(event){
    this.model = event.detail['value'];
  }

  protocolRadioChange(event){
    this.protocol = event.detail['value'];
  }

  async sendConfigBalanca(){
    await m8Plugin.sendConfigBalanca({
      model : this.model ,
      protocol : this.protocol
    });
  }

  async sendLerPesoBalanca(){
    await m8Plugin.sendLerPesoBalanca()
    .then( sucessResult => this.balancaReturn = sucessResult["balancaReturn"] , 
      failureResult => console.log(failureResult)
    );
  }


}
