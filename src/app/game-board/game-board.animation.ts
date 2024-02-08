import {animate, keyframes, style, transition, trigger} from "@angular/animations";

export const gameBoardAnimation = [
  trigger('charSelected', [
    transition(':enter', [
      style({opacity: 0, transform: 'scale(0.8)'}),
      animate('0.3s ease-out', style({opacity: 1, transform: 'scale(1.05)'})),
      animate('0.1s ease-out', style({transform: 'scale(1)'})),
    ]),
  ]),
  trigger('correctChengyu', [
    transition('* => correct', [
      animate('0.5s ease-out', keyframes([
        style({opacity: 0, transform: 'scale(1)', offset: 0}),
        style({opacity: 1, transform: 'scale(1.2)', offset: 0.3}),
        style({opacity: 1, transform: 'scale(1)', offset: 0.6}),
        style({opacity: 0, transform: 'scale(1)', offset: 1})
      ]))
    ])
  ]),
  trigger('incorrectChengyu', [
    transition('* => incorrect', [
      animate('.25s', keyframes([
        style({transform: 'translateX(0)', opacity: 1, offset: 0}),
        style({transform: 'translateX(10px)', opacity: 1, offset: 0.15}),
        style({transform: 'translateX(-10px)', opacity: 1, offset: 0.3}),
        style({transform: 'translateX(10px)', opacity: 1, offset: 0.45}),
        style({transform: 'translateX(0)', opacity: 1, offset: 0.6}),
        style({transform: 'translateX(0)', opacity: 0, offset: 1})
      ]))
    ])
  ]),
  trigger('gameLoad', [
    transition(':enter', [
      style({ transform: 'scale(0.9)', opacity: 0 }), // Start at 90% size and fully transparent
      animate('0.25s ease-out', style({ transform: 'scale(1)', opacity: 1 })) // Grow to full size and fade in
    ])
  ])
]
