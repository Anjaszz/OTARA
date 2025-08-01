// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-circle',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.82805 23.7383C9.53689 22.2072 12.6664 21.3333 16 21.3333C19.3336 21.3333 22.4631 22.2072 25.172 23.7383M20 13.3333C20 15.5425 18.2091 17.3333 16 17.3333C13.7909 17.3333 12 15.5425 12 13.3333C12 11.1242 13.7909 9.33333 16 9.33333C18.2091 9.33333 20 11.1242 20 13.3333ZM28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
        [attr.stroke]="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class UserCircleComponent {
  @Input() size: string = '32'; // Default size
  @Input() color: string = '#8993A5'; // Default color
}
