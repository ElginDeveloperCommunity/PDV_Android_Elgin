import { ShipayService, Auth, Order } from './../service/shipay.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-shipay',
  templateUrl: './shipay.page.html',
  styleUrls: ['./shipay.page.scss'],
})

export class ShipayPage implements OnInit {
  satReturn : string = ""
  value = "";
  green = "#38e121";
  date = new Date().toLocaleString();

  // Authentication
  accessKeyShipay = "HV8R8xc28hQbX4fq_jaK1A";
	secretKeyShipay = "ZBD0yR5ybNuHPKqvH0YEiL-hXzfsd4mbot5NuZQ75ZqpMFVuTN__mkFnbl7E6QbXYhVlohnBQ7GQaoLckrrmAA";
	clientIdShipay  = "8HMB1egUeKI-h9s4I3gU_w1R6kYifrUfZRrauhvjvX9y2bVoBdpoH7vVm3FZOfFejKB-rEIRjVHBEQxrW93iE40ljPwcVEgfZnKN5SvObHxHvXrgfg87A7aUOeWroajczHNt6KUOwB4-YH90RidhzIJhQ0GEjKwpQt93XJeC1XE"

  acessTokenShipay:string = "";
  refreshTokenShipay:string = "";

  // Order
  orderRefShipay = "shipaypag-stg-"; // random number
  walletShipay    = "shipay-pagador";
  totalShipay     = 4.99;
  itemsShipay     = [
        {
            "item_title": "Cerveja Heineken",
            "unit_price": 2.00,
            "quantity": 1
        },
        {
            "item_title": "Cachaca 52",
            "unit_price": 1.99,
            "quantity": 1
        },
        {
            "item_title": "Cerveja Samba",
            "unit_price": 1.00,
            "quantity": 1
        }
    ];

  deepLinkShipay:string = "";
  orderIdShipay:string = "";
  qrCodeShipay:string = "";
  qrCodeTextShipay:string = "";
  statusShipay:string = "";


  shipayBorder = this.green;

  constructor(
    private shipayService: ShipayService,
    public alertController: AlertController) {
  }


  ngOnInit() {
    let body = new Auth();

    body.access_key = this.accessKeyShipay;
    body.secret_key  =this.secretKeyShipay;
    body.client_id   =this.clientIdShipay;

    this.authenticationShipay(body);

    setInterval(()=>{
      if(this.orderIdShipay !== ''){
        this.getStatusOrder();
      }
    }, 1000);
  }


  authenticationShipay(body: Auth){
    this.shipayService.auth(body).subscribe((res) => {
      this.acessTokenShipay   = res.access_token;
      this.refreshTokenShipay = res.refresh_token;
    });
  }

  switchString(text:string){
    switch (text) {
      case "approved":
        return "Aprovado";
      case "expired":
        return "Expirado";
      case "cancelled":
        return "Cancelado";
      case "refunded":
        return "Devolvido";
      case "pending":
        return "Pendente";
      default:
        return "Desconhecido";
    }
  };

  async sendParamsOrderShipay(){
    let order = new Order();

    order.order_ref = this.orderRefShipay;
    order.wallet    = this.walletShipay;
    order.total     = this.totalShipay;
    order.items     = this.itemsShipay;

    this.shipayService.order(order, this.acessTokenShipay).subscribe((res) =>{
      this.deepLinkShipay = res.deep_link;
      this.orderIdShipay = res.order_id;
      this.qrCodeShipay = res.qr_code;
      this.qrCodeTextShipay = res.qr_code_text;
      this.statusShipay = this.switchString(res.status);
    });
  };

  async getStatusOrder(){
    this.shipayService.status(this.orderIdShipay, this.acessTokenShipay).subscribe((res) => {
      this.statusShipay = this.switchString(res.status)
    });
  }

  async deleteOrder(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirma!',
      message: 'Deseja cancelar o pedido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // do nothing
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.shipayService.cancel_order(this.orderIdShipay, this.acessTokenShipay).subscribe((res => {
            }))
          }
        }
      ]
    });

    alert.present();
  }

  // implementar os wallets
}
