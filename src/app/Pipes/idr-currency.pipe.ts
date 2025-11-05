import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idrCurrency',
  standalone: true
})
export class IdrCurrencyPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Convert to number if string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
      return '';
    }

    // Format with dot (.) as thousand separator
    return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
