import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TypeContentStepEnum } from './models/type-content-step.enum';
import { IContent, IContentItem, IStep } from './models/stepper.interface';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit, OnChanges {
  // Input properties
  @Input() steps: IStep[] = [];
  @Input() contents: IContent = { steps: [] };

  // Enums
  typeContentStepEnum = TypeContentStepEnum;

  // Form groups
  stepForms: FormGroup[] = [];

  // Arrays
  selectedHabits: number[] = [];
  selectedHoursNotifications: number[] = [];

  // Booleans
  showConfirmButtonCloseSetup: boolean = false;

  // Active contents
  activeContents: IContentItem[] = [];
  activeIndex = 0;

  constructor(private fb: FormBuilder, private router: Router, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initForms();
    this.setActiveAndUpdateActiveContents(0);
    this.updateActiveContents();
  }

  ngOnChanges() {
    this.updateActiveContents();
  }

  //#region GESTIONE DEL FORM

  // Initialize form groups for each step
  initForms(): void {
    this.contents.steps.forEach((step) => {
      const formControls: { [key: string]: any } = {};
      const iconBlockIds: any = [];
      const iconBlockTextIds: any = [];

      step.forEach(question => {
        switch (question.type) {
          case this.typeContentStepEnum.ICON_BLOCK:
            iconBlockIds.push(question.id);
            break;
          case this.typeContentStepEnum.TEXT_BLOCK:
            iconBlockTextIds.push(question.id);
            break;
          case this.typeContentStepEnum.TEXT_WITH_ICON_NO_FORM:
            // Do nothing, skip form control creation
            break;
          default:
            formControls[`${question.name}`] = question.required ? [null, Validators.required] : [null];
          }
      });

      this.addFormControlForIconBlocks(formControls, iconBlockIds, 'step_2_selectedHabits');
      this.addFormControlForIconBlocks(formControls, iconBlockTextIds, 'step_3_selectedHoursNotifications');
      this.stepForms.push(this.fb.group(formControls));
    });
  }

  // Add form control for icon blocks
  addFormControlForIconBlocks(formControls: { [key: string]: any }, iconBlockIds: any[], controlName: string): void {
    if (iconBlockIds.length > 0) {
      formControls[controlName] = [[], Validators.required];
    }
  }

  //#endregion



  //#region GESTIONE DELLO STEPPER

  // Set active step and update active contents
  setActiveAndUpdateActiveContents(index: number) {
    this.steps.forEach((step, i) => {
      step.active = i === index;
    });
    this.updateActiveContents();
  }

  // Update active contents based on active step
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

  // Go to the next step and submit the form
  nextStepAndSubmit(): void {
    const currentStepForm = this.stepForms[this.activeIndex];
    currentStepForm.markAllAsTouched();
    currentStepForm.updateValueAndValidity();
    if (currentStepForm.valid) {
      if (this.activeIndex < this.contents.steps.length - 1) {
        this.setActiveAndUpdateActiveContents(this.activeIndex + 1);
        this.showConfirmButtonCloseSetup = this.activeIndex === this.contents.steps.length - 1;

        //Invio i dati al server
        console.log(currentStepForm.value);
      }
    }
  }

  // Go to the previous step
  prevStep(): void {
    if (this.activeIndex > 0) {
      this.setActiveAndUpdateActiveContents(this.activeIndex - 1);
    }
    const currentStepForm = this.stepForms[this.activeIndex];
    currentStepForm.updateValueAndValidity();
  }

  // Navigate to home after subscription
  goToHomeAfterSubscription(): void {
    this.router.navigate(['/tabs/tab1']);
  }

  //#endregion


  //#region GESTIONE DELLA SELEZIONE DEGLI ELEMENTI IN BLOCCO

  // Toggle selection for icon blocks or text blocks
  toggleSelection(id: number, stepIndex: number) {
    const controlStep2 = this.stepForms[stepIndex].get('step_2_selectedHabits');
    const controlStep3 = this.stepForms[stepIndex].get('step_3_selectedHoursNotifications');
    if (controlStep2) {
      this.toggleSelectionStep2(id, controlStep2);
    } else if (controlStep3) {
      this.toggleSelectionStep3(id, controlStep3);
    }
  }

  // Toggle selection for icon blocks in step 2
  toggleSelectionStep2(id: number, controlStep2: any) {
    let updatedValue = [...controlStep2.value];
    const currentIndex = updatedValue.indexOf(id);
    if (currentIndex === -1) {
      updatedValue.push(id);
    } else {
      updatedValue.splice(currentIndex, 1);
    }
    controlStep2.setValue(updatedValue);
    this.selectedHabits = [...updatedValue];
    this.cdRef.detectChanges();
  }

  // Toggle selection for text blocks in step 3
  toggleSelectionStep3(id: number, controlStep3: any) {
    let updatedValue = [...controlStep3.value];
    const currentIndex = updatedValue.indexOf(id);
    if (currentIndex === -1) {
      updatedValue.push(id);
    } else {
      updatedValue.splice(currentIndex, 1);
    }
    controlStep3.setValue(updatedValue);
    this.selectedHoursNotifications = [...updatedValue];
    this.cdRef.detectChanges();
  }

  // Check if an item is selected
  isSelected(id: number, type: string): boolean {
    const isSelected =
      type === this.typeContentStepEnum.ICON_BLOCK ? this.selectedHabits.includes(id) :
        type === this.typeContentStepEnum.TEXT_BLOCK ? this.selectedHoursNotifications.includes(id) : false;
    return isSelected;
  }
  //#endregion
}

