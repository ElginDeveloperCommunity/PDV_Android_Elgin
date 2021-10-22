import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor( private router: Router) {}


  goToCodbar(){
    this.router.navigate(['codbar']);
  }

  goToPrinter(){
    this.router.navigate(['printer']);
  }

  goToTef(){
    this.router.navigate(['tef']);
  }

  goToSat(){
    this.router.navigate(['sat']);
  }

  goToBalanca(){
    this.router.navigate(['balanca']);
  }

  goToShipay(){
    this.router.navigate(['shipay']);
  }
}
