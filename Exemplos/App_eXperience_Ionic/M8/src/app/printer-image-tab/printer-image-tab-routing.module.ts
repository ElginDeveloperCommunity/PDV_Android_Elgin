import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrinterImageTabPage } from './printer-image-tab.page';

const routes: Routes = [
  {
    path: '',
    component: PrinterImageTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrinterImageTabPageRoutingModule {}
