import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  endWith,
  filter,
  finalize,
  interval,
  map,
  Observable,
  pairwise,
  share,
  startWith,
  switchMap,
  take,
  timer
} from "rxjs";
import {animate, keyframes, style, transition, trigger} from "@angular/animations";
import {AsyncPipe, DecimalPipe, NgIf} from "@angular/common";

@Component({
  selector: 'chengyu-game-score',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DecimalPipe
  ],
  animations: [
    trigger('scoreAdded', [
      transition(':enter', [
        animate('1s ease-out', keyframes([
          style({opacity: 0, transform: 'scale(0.5)', offset: 0}),
          style({opacity: 1, transform: 'scale(1.5)', offset: 0.5}),
          style({opacity: 1, transform: 'scale(1)', offset: 0.75}),
        ]))
      ])
    ]),
  ],
  templateUrl: './game-score.component.html',
  styleUrl: './game-score.component.scss'
})
export class GameScoreComponent {
  private scoreSource$ = new BehaviorSubject<number>(0);
  scoreAdded$: Observable<number>;
  scoreDisplayed$: Observable<number>;

  @Input() set score(value: number) {
    this.scoreSource$.next(value);
  }

  @Output() scoreUpdated = new EventEmitter<void>();

  constructor() {
    this.scoreAdded$ = this.scoreSource$.pipe(
      pairwise(),
      switchMap(([previousScore, currentScore]) => {
        const scoreAdded = currentScore - previousScore;
        // Emit scoreAdded immediately, then emit 0 after 1 second
        return timer(1000).pipe(
          map(() => 0),
          startWith(scoreAdded)
        )
      }),
      startWith(0),
      share(),
    );

    this.scoreDisplayed$ = combineLatest([this.scoreAdded$, this.scoreSource$.pipe(pairwise())]).pipe(
      filter(([scoreAdded, _]) => scoreAdded === 0),
      map(([_, scorePair]) => scorePair),
      switchMap(([previousScore, currentScore]) => {
        return this.animateScoreDisplayed(previousScore, currentScore).pipe(
          finalize(() => this.scoreUpdated.next())
        )
      }),
      startWith(0),
    );
  }

  private animateScoreDisplayed(previousScore: number, currentScore: number) {
    const animationDuration = 500;
    const animationSteps = 50;
    const animationStepDuration = animationDuration / animationSteps;

    return interval(animationStepDuration).pipe(
      take(animationSteps),
      map(step => previousScore + (step * (currentScore - previousScore) / animationSteps)),
      endWith(currentScore)
    );
  }
}
