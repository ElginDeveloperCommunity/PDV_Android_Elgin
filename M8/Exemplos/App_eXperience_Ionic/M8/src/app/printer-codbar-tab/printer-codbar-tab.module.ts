import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrinterCodbarTabPageRoutingModule } from './printer-codbar-tab-routing.module';

import { PrinterCodbarTabPage } from './printer-codbar-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrinterCodbarTabPageRoutingModule
  ],
  declarations: [PrinterCodbarTabPage]
})
export class PrinterCodbarTabPageModule {}
