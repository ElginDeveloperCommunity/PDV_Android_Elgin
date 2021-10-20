import { Component, OnInit } from '@angular/core';
import { m8Plugin } from 'capacitor-elgin-m8';

@Component({
  selector: 'app-printer-image-tab',
  templateUrl: './printer-image-tab.page.html',
  styleUrls: ['./printer-image-tab.page.scss'],
})
export class PrinterImageTabPage implements OnInit {
  picToView? = "/assets/elginlogo.png";
  cutPaper? : boolean = false;
  constructor() { }

  ngOnInit() {
  }

  async ngOnDestroy(){
    await m8Plugin.resetDefaultImage();
  }

  async chooseImage?(){
    await m8Plugin.chooseImage().then(
      sucess =>  {  this.picToView = "data:image/png;base64," + sucess["imageAsBase64"];   }  ,
      error => alert(error)
    );
  }

  async printSelectedImage(){
    await m8Plugin.printImage({
      cutPaper: this.cutPaper
    })
    .then( sucessResult => { console.log(sucessResult["response"])} ,
      failureResult => { console.log("error"); }
    )
  }
}
