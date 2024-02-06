import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {
  BehaviorSubject,
  delay,
  endWith,
  finalize,
  interval,
  map,
  Observable,
  pairwise,
  ReplaySubject,
  startWith,
  Subscription,
  switchMap,
  take,
  tap
} from "rxjs";
import {AsyncPipe, DecimalPipe, NgIf} from "@angular/common";

@Component({
  selector: 'chengyu-game-score',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DecimalPipe
  ],
  animations: [],
  templateUrl: './game-score.component.html',
  styleUrl: './game-score.component.scss'
})
export class GameScoreComponent implements OnDestroy {
  scoreSource$ = new BehaviorSubject<number>(0);
  scoreUpdated$ = new ReplaySubject<void>(1);
  scoreUpdatedSubscription!: Subscription;
  scoreDisplayed$: Observable<number>;

  @Input() set score(value: number) {
    this.scoreSource$.next(value);
  }

  @Output()
  scoreUpdated = new EventEmitter<void>();

  constructor() {
    this.scoreDisplayed$ = this.scoreSource$.pipe(
      pairwise(),
      switchMap(([previousScore, currentScore]) => {
        return this.animateScoreDisplayed(previousScore, currentScore).pipe(
          finalize(() => this.scoreUpdated$.next())
        )
      }),
      startWith(0),
    );

    this.scoreUpdatedSubscription = this.scoreUpdated$.pipe(
      delay(500),
      tap(_ => this.scoreUpdated.next())
    ).subscribe();
  }

  animateScoreDisplayed(previousScore: number, currentScore: number) {
    const animationDuration = 500;
    const animationSteps = 50;
    const animationStepDuration = animationDuration / animationSteps;

    return interval(animationStepDuration).pipe(
      take(animationSteps),
      map(step => previousScore + (step * (currentScore - previousScore) / animationSteps)),
      endWith(currentScore)
    );
  }

  ngOnDestroy(): void {
    if (this.scoreUpdatedSubscription) {
      this.scoreUpdatedSubscription.unsubscribe();
    }
  }

}
