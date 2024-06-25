import { NgModule } from '@angular/core';
import { CalculateKnobValuePipe } from '../pipes/calculate-knob-value.pipe';
import { CalculateKnobColorPipe } from '../pipes/calculate-knob-color.pipe';
import { FormatNumberPipe } from '../pipes/format-number.pipe';

@NgModule({
  imports: [],
  declarations: [
    CalculateKnobValuePipe,
    CalculateKnobColorPipe,
    FormatNumberPipe,
  ],
  exports: [CalculateKnobValuePipe, CalculateKnobColorPipe, FormatNumberPipe],
})
export class SharedModule {}
