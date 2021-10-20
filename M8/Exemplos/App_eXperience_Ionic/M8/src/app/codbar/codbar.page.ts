import { Component, OnInit, ViewChild } from '@angular/core';
import { KeyboardEventDetail } from '@ionic/core';

@Component({
  selector: 'app-codbar',
  templateUrl: './codbar.page.html',
  styleUrls: ['./codbar.page.scss'],
})
export class CodbarPage implements OnInit {

  actualField: number = 1;
  codbarFields: string[] = ["", "", "", "", "", "", "", "", "", ""]
  fieldRead: boolean[] = [false, false, false, false, false, false, false, false, false, false]
 
  @ViewChild('codbarInput1', {static: false}) codbarInput1: { setFocus: () => void; };
  @ViewChild('codbarInput2', {static: false}) codbarInput2: { setFocus: () => void; };
  @ViewChild('codbarInput3', {static: false}) codbarInput3: { setFocus: () => void; };
  @ViewChild('codbarInput4', {static: false}) codbarInput4: { setFocus: () => void; };
  @ViewChild('codbarInput5', {static: false}) codbarInput5: { setFocus: () => void; };
  @ViewChild('codbarInput6', {static: false}) codbarInput6: { setFocus: () => void; };
  @ViewChild('codbarInput7', {static: false}) codbarInput7: { setFocus: () => void; };
  @ViewChild('codbarInput8', {static: false}) codbarInput8: { setFocus: () => void; };
  @ViewChild('codbarInput9', {static: false}) codbarInput9: { setFocus: () => void; };
  @ViewChild('codbarInput10', {static: false}) codbarInput10: { setFocus: () => void; };




  constructor() { }

  ngOnInit() {
  }

  
  async onCodbarInserted1(){
    this.fieldRead[0] = true;
    await this.codbarInput2.setFocus( );
    this.actualField++;
  }

  async onCodbarInserted2(){
    this.fieldRead[1] = true;
    await this.codbarInput3.setFocus( );
    this.actualField++;
  }

  async onCodbarInserted3(){
    this.fieldRead[2] = true;
    await this.codbarInput4.setFocus( );
    this.actualField++;
  }

  async onCodbarInserted4(){
    this.fieldRead[3] = true;
    await this.codbarInput5.setFocus( );
    this.actualField++;
  }

  async onCodbarInserted5(){
    this.fieldRead[4] = true;
    await this.codbarInput6.setFocus( );
    this.actualField++;
  }

  async onCodbarInserted6(){
    this.fieldRead[5] = true;
    await this.codbarInput7.setFocus( );
    this.actualField++;
  }

  async onCodbarInserted7(){
    this.fieldRead[6] = true;
    await this.codbarInput8.setFocus( );
    this.actualField++;
  }

  async onCodbarInserted8(){
    this.fieldRead[7] = true;
    await this.codbarInput9.setFocus( );
    this.actualField++;
  }

  async onCodbarInserted9(){
    this.fieldRead[8] = true;
    await this.codbarInput10.setFocus( );
    this.actualField++;
  }

  async onCodbarInserted10(){
    this.fieldRead[9] = true;
    this.actualField = 1;
  }




 

  async initiateReading(){
   
    if(this.actualField == 1) this.codbarInput1.setFocus();
    else if(this.actualField == 2) this.codbarInput2.setFocus();
    else if(this.actualField == 3) this.codbarInput3.setFocus();
    else if(this.actualField == 4) this.codbarInput4.setFocus();
    else if(this.actualField == 5) this.codbarInput5.setFocus();
    else if(this.actualField == 6) this.codbarInput6.setFocus();
    else if(this.actualField == 7) this.codbarInput7.setFocus();
    else if(this.actualField == 8) this.codbarInput8.setFocus();
    else if(this.actualField == 9) this.codbarInput9.setFocus();
    else if(this.actualField == 10) this.codbarInput10.setFocus();
  }
    



  clearAllFields(){
    var i;
    
    for(i = 0; i < 10; i++){
      this.codbarFields[i] = "";
    }
    
  }
}
