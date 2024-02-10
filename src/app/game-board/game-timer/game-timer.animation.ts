import {animate, animation, keyframes, style, transition, trigger, useAnimation} from "@angular/animations";

const flicker = animation([
  animate('{{ timing }}', keyframes([
    style({ opacity: 1 }),
    style({ opacity: 0.2 }),
    style({ opacity: 0.9 }),
    style({ opacity: 0.2 }),
    style({ opacity: 1 })
  ]))
], {params: {timing: '0.25s'}});

export const flickerAnimation = trigger('flicker', [
  transition('* <=> *', useAnimation(flicker, {
    params: {timing: '0.25s'}
  }))
]);
