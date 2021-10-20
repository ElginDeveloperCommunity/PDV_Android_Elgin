import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShipayPageRoutingModule } from './shipay-routing.module';

import { ShipayPage } from './shipay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShipayPageRoutingModule
  ],
  declarations: [ShipayPage]
})
export class ShipayPageModule {}
