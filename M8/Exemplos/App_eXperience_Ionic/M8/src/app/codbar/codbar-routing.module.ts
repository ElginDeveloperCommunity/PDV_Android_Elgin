import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodbarPage } from './codbar.page';

const routes: Routes = [
  {
    path: '',
    component: CodbarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodbarPageRoutingModule {}
