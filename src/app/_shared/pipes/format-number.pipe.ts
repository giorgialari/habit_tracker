import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
})
export class FormatNumberPipe implements PipeTransform {
  transform(number: any, args?: any): any {
    return Number(number).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }
}
