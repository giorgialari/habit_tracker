import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateKnobValue'
})
export class CalculateKnobValuePipe implements PipeTransform {
  transform(eventsOfDay: any[]): number {
    let weightedCompleted = 0;
    let totalGoal = 0;

    eventsOfDay.forEach(event => {
      const actualGoalNormalized = Math.min(event.actualGoal, event.goal);
      weightedCompleted += actualGoalNormalized;
      totalGoal += event.goal;
    });

    let finalPercentage = totalGoal > 0 ? (weightedCompleted / totalGoal) * 100 : 0;
    return Math.round(finalPercentage);
  }
}
