/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'reset-icon',
  standalone: true,
  template: `
   <svg  [attr.width]="size" 
   [attr.height]="size"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15"  [attr.stroke]="color"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  `
})
export class ResetIconComponent {
  @Input() size: string = '24';  // Default size
  @Input() color: string = '#3815FF';  // Default color
}