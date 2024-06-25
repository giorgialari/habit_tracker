import { Pipe, PipeTransform } from '@angular/core';
import { KnobService } from '../services/knob.service';

@Pipe({
  name: 'calculateKnobColor',
})
export class CalculateKnobColorPipe implements PipeTransform {
  constructor(private knobService: KnobService) {}

  transform(eventsOfDay: any): any {
    let weightedCompleted = 0;
    let totalGoal = 0;

    if (Array.isArray(eventsOfDay)) {
      eventsOfDay.forEach((event: any) => {
        const actualGoalNormalized = Math.min(event.actualGoal, event.goal);
        weightedCompleted += actualGoalNormalized;
        totalGoal += event.goal;
      });

      let finalPercentage =
        totalGoal > 0 ? (weightedCompleted / totalGoal) * 100 : 0;
      Math.round(finalPercentage);

      return this.knobService.calculateColor(Math.round(finalPercentage), 100);
    } else {
      const actualGoalNormalized = Math.min(
        eventsOfDay.actualGoal,
        eventsOfDay.goal
      );
      weightedCompleted += actualGoalNormalized;
      totalGoal += eventsOfDay.goal;

      let finalPercentage =
        totalGoal > 0 ? (weightedCompleted / totalGoal) * 100 : 0;
      Math.round(finalPercentage);

      return this.knobService.calculateColor(Math.round(finalPercentage), 100);
    }
  }
}
