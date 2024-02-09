import {animate, style, transition, trigger} from "@angular/animations";

export const gameBoardAnimation = [
  trigger('gameLoad', [
    transition(':enter', [
      style({transform: 'scale(0.9)', opacity: 0}), // Start at 90% size and fully transparent
      animate('0.25s ease-out', style({transform: 'scale(1)', opacity: 1})) // Grow to full size and fade in
    ])
  ])
]
