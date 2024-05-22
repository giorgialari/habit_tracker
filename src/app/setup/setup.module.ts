import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// PrimeNG modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessagesModule } from 'primeng/messages';
import { InputNumberModule } from 'primeng/inputnumber';


// Custom components
import { SetupComponent } from './setup.component';
import { StepperComponent } from './stepper/stepper.component';

// Routing module
import { SetupRoutingModule } from './setup-routing.module';
import { CalendarModule } from 'primeng/calendar';

const angularModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  IonicModule
];

const primeNGModules = [
  ButtonModule,
  InputTextModule,
  InputNumberModule,
  FloatLabelModule,
  MessagesModule,
  CalendarModule
];

const customModules = [
  SetupRoutingModule
];

@NgModule({
  declarations: [SetupComponent, StepperComponent],
  exports: [SetupComponent, StepperComponent],
  imports: [
    ...angularModules,
    ...primeNGModules,
    ...customModules
  ],
})
export class SetupComponentModule { }
