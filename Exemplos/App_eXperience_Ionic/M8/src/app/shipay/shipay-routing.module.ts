import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShipayPage } from './shipay.page';

const routes: Routes = [
  {
    path: '',
    component: ShipayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShipayPageRoutingModule {}
