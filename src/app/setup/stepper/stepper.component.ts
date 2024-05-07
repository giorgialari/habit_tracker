import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { IContent, IContentItem, IStep } from './models/stepper.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit, OnChanges {
  @Input() steps: IStep[] = [];
  @Input() contents: IContent = { steps: [] };
  stepForms: FormGroup[] = [];
  selectedHabits: number[] = [];

  activeContents: IContentItem[] = [];
  activeIndex = 0;

  constructor(private fb: FormBuilder, private router: Router, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initForms();
    this.setActiveAndUpdateActiveContents(0);
    this.updateActiveContents();
  }
  initForms(): void {
    this.contents.steps.forEach((step, stepIndex) => {
      const formControls: { [key: string]: any } = {};
      // Raccogliamo gli ID iniziali per il controllo degli icon-block
      const iconBlockIds = [];

      step.forEach(question => {
        if (question.type === 'icon-block') {
          // Aggiungi solo l'id al controllo icon-block
          iconBlockIds.push(question.id);
        } else {
          // Per gli altri tipi, usiamo una singola stringa
          formControls['item-' + question.id] = question.required ? ['', Validators.required] : [''];
        }
      });

      // Creiamo un singolo controllo form per gestire tutti gli id degli icon-block
      if (iconBlockIds.length > 0) {
        formControls['selectedItems'] = [[], Validators.required]; // Aggiungi validazione se necessario
      }

      const formGroup = this.fb.group(formControls);
      this.stepForms.push(formGroup);
    });
  }

  ngOnChanges() {
    this.updateActiveContents();
  }

  setActiveAndUpdateActiveContents(index: number) {
    this.steps.forEach((step, i) => {
      step.active = i === index;
    });
    this.updateActiveContents();
  }

  updateActiveContents() {
    this.activeIndex = -1;
    for (let i = this.steps.length - 1; i >= 0; i--) {
      if (this.steps[i].active) {
        this.activeIndex = i;
        break;
      }
    }
    this.activeContents = this.contents?.steps[this.activeIndex] || [];
  }

  nextStepAndSubmit(): void {
    const currentStepForm = this.stepForms[this.activeIndex];
    currentStepForm.markAllAsTouched(); // Contrassegna tutti i campi come "touched"
    currentStepForm.updateValueAndValidity(); // Aggiorna la validità del form
    if (currentStepForm.valid) {
      if (this.activeIndex < this.contents.steps.length - 1) {
        this.setActiveAndUpdateActiveContents(this.activeIndex + 1);
        //TODO: inviare i dati al server
        //quando arrivo all'ultimo step, navigo alla home
        if (this.activeIndex === this.contents.steps.length - 1) {
          this.router.navigate(['/tabs/tab1']);
        }
      }
    }
  }

  prevStep(): void {
    if (this.activeIndex > 0) {
      this.setActiveAndUpdateActiveContents(this.activeIndex - 1);
    }
    const currentStepForm = this.stepForms[this.activeIndex];
    currentStepForm.updateValueAndValidity(); // Aggiorna la validità del form
  }


  toggleSelection(id: number, stepIndex: number) {
    const control = this.stepForms[stepIndex].get('selectedItems');
    if (!control) {
      return;
    }
    let updatedValue = [...control.value];
    const currentIndex = updatedValue.indexOf(id);
    if (currentIndex === -1) {
      updatedValue.push(id);
    } else {
      updatedValue.splice(currentIndex, 1);
    }
    control.setValue(updatedValue);
    this.selectedHabits = [...updatedValue]; // Assicurati che selectedHabits sia aggiornato
    console.log('Selected Habits:', this.selectedHabits); // Aggiungi per debug
    this.cdRef.detectChanges();
  }


  isSelected(id: number): boolean {
    const isSelected = this.selectedHabits.includes(id);
    console.log(`Is Selected for ${id}:`, isSelected);
    return isSelected;
  }


}

