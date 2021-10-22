import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SatPageRoutingModule } from './sat-routing.module';

import { SatPage } from './sat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SatPageRoutingModule
  ],
  declarations: [SatPage]
})
export class SatPageModule {}
