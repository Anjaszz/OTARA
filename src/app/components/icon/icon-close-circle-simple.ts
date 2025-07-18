import { Component } from '@angular/core';

@Component({
    selector: 'ic-close-circle-simple',
    template: `
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7.5 2.5L2.5 7.5M2.5 2.5L7.5 7.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    `,
    standalone: true,
})
export class IconCloseCircleSimple {}
