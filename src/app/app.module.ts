import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Importazioni necessarie per la localizzazione
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';


// Registrazione della localizzazione italiana
registerLocaleData(localeIt);
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, { provide: LOCALE_ID, useValue: 'it-IT' }  // Imposta la localizzazione italiana
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
