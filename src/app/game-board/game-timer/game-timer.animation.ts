import {animate, animation, keyframes, style} from "@angular/animations";

export const flickerAnimation = animation([
  animate('{{ timing }}', keyframes([
    style({ opacity: 1 }),
    style({ opacity: 0.2 }),
    style({ opacity: 0.9 }),
    style({ opacity: 0.2 }),
    style({ opacity: 1 })
  ]))
], {params: {timing: '0.2s'}});
