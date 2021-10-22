import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrinterImageTabPageRoutingModule } from './printer-image-tab-routing.module';

import { PrinterImageTabPage } from './printer-image-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrinterImageTabPageRoutingModule
  ],
  declarations: [PrinterImageTabPage]
})
export class PrinterImageTabPageModule {}
