/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-office',
  standalone: true,
  template: `
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.8333 17.5V4.16667C15.8333 3.24619 15.0871 2.5 14.1667 2.5H5.83333C4.91286 2.5 4.16667 3.24619 4.16667 4.16667V17.5M15.8333 17.5L17.5 17.5M15.8333 17.5H11.6667M4.16667 17.5L2.5 17.5M4.16667 17.5H8.33333M7.5 5.83331H8.33333M7.5 9.16665H8.33333M11.6667 5.83331H12.5M11.6667 9.16665H12.5M8.33333 17.5V13.3333C8.33333 12.8731 8.70643 12.5 9.16667 12.5H10.8333C11.2936 12.5 11.6667 12.8731 11.6667 13.3333V17.5M8.33333 17.5H11.6667"
        [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class OfficeIcon {
  @Input() color: string = '#8993A5';
}
