import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalancaPage } from './balanca.page';

const routes: Routes = [
  {
    path: '',
    component: BalancaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalancaPageRoutingModule {}
