import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
declare var cordova: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  m8Plugin : any;

  xmlSatPath? : string = "../../assets/xmlsat.xml";
  xmlNfcePath? : string = "../../assets/xmlnfce.xml";

  xmlSat? : string;
  xmlNfce? : string;

  constructor(public platform: Platform)
  {
    this.platform.ready().then(() => {
      this.m8Plugin = cordova.plugins.elgin.minipdv;
    });
  }

  async ngOnInit(){
    await this.saveReadXmlSatTextToString("file//" + this.xmlSatPath);
    await this.saveReadXmlNfceTextToString("file//" + this.xmlNfcePath);
  }

  async inicializarImpressora(){
    await this.m8Plugin.AbreConexaoImpressora(
      {
        tipo : 6 ,
        modelo : "M8" ,
        conexao : "" ,
        parametro : 0
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );
  }

  async inicializarImpressoraExterna(){
    await this.m8Plugin.AbreConexaoImpressora(
      {
        tipo : 3 ,
        modelo : "I9" ,
        conexao : "192.168.0.34" ,
        parametro : 9100
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    )
  }

  async testarDesligamentoImpressora(){
    await this.m8Plugin.FechaConexaoImpressora( 
      (suc) => alert(suc) ,
      (err) => alert(err)
    );
  }

  async testarImpressao(){ 
    await this.m8Plugin.ImpressaoTexto(
      {
        dados : "Hello World" ,
        posicao : 1,
        stilo : 0,
        tamanho : 17
      },
      (success) => alert(success) ,
      (error) => alert(error)
    );
    //Avança papel para garantir a visualizaçã da impressao
    await this.m8Plugin.AvancaPapel(
      {
        linhas : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

    //Corta o papel
    await this.m8Plugin.Corte(
      {
        avanco : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );
  }

  async testarImpressaoBarCode(){
    await this.m8Plugin.DefinePosicao(
      {
        posicao : 0
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    )

    await this.m8Plugin.ImpressaoCodigoBarras(
      {
        tipo : 3 ,
        dados : "40170725" ,
        altura : 120 ,
        largura : 6 ,
        HRI : 4
      },
      (suc) => alert(suc) ,
      (err) => alert(err) 
      
    );

    await this.m8Plugin.AvancaPapel(
      {
        linhas : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

    await this.m8Plugin.Corte(
      {
        avanco : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );
  }

  async testarImpressaoQRCode(){

    await this.m8Plugin.DefinePosicao(
      {
        posicao : 1
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    )

    await this.m8Plugin.ImpressaoQRCode(
      {
        dados : "Hello World" ,
        tamanho : 6 ,
        nivelCorrecao : 2
      } ,
      (suc) => alert(suc) ,
      (err) => alert(err)
    )

    await this.m8Plugin.AvancaPapel(
      {
        linhas : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

    await this.m8Plugin.Corte(
      {
        avanco : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );
  }

  async testarImpressaoXMLNFCe(){
    await this.m8Plugin.ImprimeXMLNFCe(
      {
        dados : this.xmlNfce ,
        indexcsc : 1 , 
        csc : "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES" ,
        param : 0
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

    await this.m8Plugin.AvancaPapel(
      {
        linhas : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

    await this.m8Plugin.Corte(
      {
        avanco : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

  }

  async testarImpressaoXMLSAT(){
    this.m8Plugin.ImprimeXMLSAT(
      {
        dados : this.xmlSat ,
        param : 0
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

    await this.m8Plugin.AvancaPapel(
      {
        linhas : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

    await this.m8Plugin.Corte(
      {
        avanco : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );
  }

  async testarStatusSensorPapel(){
    await this.m8Plugin.StatusImpressora(
      {
        param : 3
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    )
  }

  async testarSelecionarEImprimir(){
    await this.m8Plugin.imprimeImagem(
      {
        cutPaper : true
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
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
  };

}
