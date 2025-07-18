/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'email-icon',
  standalone: true,
  template: `
    <svg
    [attr.width]="size" 
    [attr.height]="size" 
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z"
        [attr.stroke]="color" 
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class EmailIcon {
  @Input() size: string = '24'; 
  @Input() color: string = '#3815FF';
}
