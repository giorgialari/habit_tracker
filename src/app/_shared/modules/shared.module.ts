import { NgModule } from '@angular/core';
import { CalculateKnobValuePipe } from '../pipes/calculate-knob-value.pipe';
import { CalculateKnobColorPipe } from '../pipes/calculate-knob-color.pipe';
import { FormatNumberPipe } from '../pipes/format-number.pipe';
import { TruncatePipe } from '../pipes/truncate.pipe';

@NgModule({
  imports: [],
  declarations: [
    CalculateKnobValuePipe,
    CalculateKnobColorPipe,
    FormatNumberPipe,
    TruncatePipe
  ],
  exports: [CalculateKnobValuePipe, CalculateKnobColorPipe, FormatNumberPipe, TruncatePipe],
})
export class SharedModule {}
