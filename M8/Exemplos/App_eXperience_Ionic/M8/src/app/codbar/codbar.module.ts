import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodbarPageRoutingModule } from './codbar-routing.module';

import { CodbarPage } from './codbar.page';

import { HideKeyboardModule } from 'hide-keyboard';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HideKeyboardModule,
    IonicModule,
    CodbarPageRoutingModule
  ],
  declarations: [CodbarPage]
})
export class CodbarPageModule {}
