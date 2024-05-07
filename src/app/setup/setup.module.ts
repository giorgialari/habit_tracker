import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SetupComponent } from './setup.component';

import { ButtonModule } from 'primeng/button';
import { StepperComponent } from './stepper/stepper.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessagesModule } from 'primeng/messages';
import { SetupRoutingModule } from './setup-routing.module';


@NgModule({
  declarations: [SetupComponent, StepperComponent],
  exports: [SetupComponent, StepperComponent],
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    MessagesModule,
    SetupRoutingModule
  ],
})
export class SetupComponentModule { }
