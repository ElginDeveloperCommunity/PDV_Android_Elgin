import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { PrinterTextTabPageModule } from './printer-text-tab/printer-text-tab.module';
import { PrinterCodbarTabPageModule } from './printer-codbar-tab/printer-codbar-tab.module';


// import { ShipayTabPageModule } from './shipay/shipay.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, PrinterTextTabPageModule, PrinterCodbarTabPageModule, HttpClientModule, ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
