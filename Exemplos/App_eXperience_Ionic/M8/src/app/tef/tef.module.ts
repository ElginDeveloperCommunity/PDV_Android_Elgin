import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TefPageRoutingModule } from './tef-routing.module';

import { TefPage } from './tef.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TefPageRoutingModule
  ],
  declarations: [TefPage]
})
export class TefPageModule {}
