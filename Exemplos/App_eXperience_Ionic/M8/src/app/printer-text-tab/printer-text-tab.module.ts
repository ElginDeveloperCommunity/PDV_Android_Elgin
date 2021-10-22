import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrinterTextTabPageRoutingModule } from './printer-text-tab-routing.module';

import { PrinterTextTabPage } from './printer-text-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrinterTextTabPageRoutingModule
  ],
  declarations: [PrinterTextTabPage]
})
export class PrinterTextTabPageModule {}
