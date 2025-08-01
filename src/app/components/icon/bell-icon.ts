/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'bell-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.4999 14.1667H16.6666L15.4958 12.9959C15.1783 12.6784 14.9999 12.2477 14.9999 11.7987V9.16667C14.9999 6.98964 13.6086 5.13757 11.6666 4.45118V4.16667C11.6666 3.24619 10.9204 2.5 9.99992 2.5C9.07944 2.5 8.33325 3.24619 8.33325 4.16667V4.45118C6.39126 5.13757 4.99992 6.98964 4.99992 9.16667V11.7987C4.99992 12.2477 4.82154 12.6784 4.50403 12.9959L3.33325 14.1667H7.49992M12.4999 14.1667V15C12.4999 16.3807 11.3806 17.5 9.99992 17.5C8.61921 17.5 7.49992 16.3807 7.49992 15V14.1667M12.4999 14.1667H7.49992"
        [attr.stroke]="color"
       [attr.stroke-width]="stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class BellIconComponent {
  @Input() size: string = '20';
  @Input() color: string = '#44546F';
  @Input() stroke: string = '2';
}
