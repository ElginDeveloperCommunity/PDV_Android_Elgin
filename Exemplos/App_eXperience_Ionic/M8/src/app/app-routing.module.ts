import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'codbar',
    loadChildren: () => import('./codbar/codbar.module').then( m => m.CodbarPageModule)
  },
  {
    path: 'printer',
    loadChildren: () => import('./printer/printer.module').then( m => m.PrinterPageModule)
  },
  {
    path: 'printer-text-tab',
    loadChildren: () => import('./printer-text-tab/printer-text-tab.module').then( m => m.PrinterTextTabPageModule)
  },
  {
    path: 'printer-codbar-tab',
    loadChildren: () => import('./printer-codbar-tab/printer-codbar-tab.module').then( m => m.PrinterCodbarTabPageModule)
  },
  {
    path: 'printer-image-tab',
    loadChildren: () => import('./printer-image-tab/printer-image-tab.module').then( m => m.PrinterImageTabPageModule)
  },
  {
    path: 'tef',
    loadChildren: () => import('./tef/tef.module').then( m => m.TefPageModule)
  },
  {
    path: 'sat',
    loadChildren: () => import('./sat/sat.module').then( m => m.SatPageModule)
  },
  {
    path: 'balanca',
    loadChildren: () => import('./balanca/balanca.module').then( m => m.BalancaPageModule)
  },
  {
    path: 'shipay',
    loadChildren: () => import('./shipay/shipay.module').then( m => m.ShipayPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
