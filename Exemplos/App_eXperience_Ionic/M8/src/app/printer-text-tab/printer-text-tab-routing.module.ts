import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrinterTextTabPage } from './printer-text-tab.page';

const routes: Routes = [
  {
    path: '',
    component: PrinterTextTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrinterTextTabPageRoutingModule {}
