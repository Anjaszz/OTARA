/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-user-circle',
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
        d="M4.26753 14.8364C5.96056 13.8795 7.9165 13.3333 10 13.3333C12.0835 13.3333 14.0394 13.8795 15.7325 14.8364M12.5 8.33333C12.5 9.71405 11.3807 10.8333 10 10.8333C8.61929 10.8333 7.5 9.71405 7.5 8.33333C7.5 6.95262 8.61929 5.83333 10 5.83333C11.3807 5.83333 12.5 6.95262 12.5 8.33333ZM17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
        [attr.stroke]="color" 
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class UserCircleIcon {
  @Input() size: string = '20';
  @Input() color: string = '#8993A5';
}
