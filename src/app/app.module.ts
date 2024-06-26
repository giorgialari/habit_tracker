import { LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Importazioni necessarie per la localizzazione
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';


// Registrazione della localizzazione italiana
registerLocaleData(localeIt);
@NgModule({
  declarations: [	AppComponent   ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      animated: true, // Abilita/Disabilita tutte le animazioni di navigazione
    }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'it-IT' }  // Imposta la localizzazione italiana
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
