import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrinterCodbarTabPage } from './printer-codbar-tab.page';

const routes: Routes = [
  {
    path: '',
    component: PrinterCodbarTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrinterCodbarTabPageRoutingModule {}
