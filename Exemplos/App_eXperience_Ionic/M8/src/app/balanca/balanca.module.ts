import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BalancaPageRoutingModule } from './balanca-routing.module';

import { BalancaPage } from './balanca.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalancaPageRoutingModule
  ],
  declarations: [BalancaPage]
})
export class BalancaPageModule {}
