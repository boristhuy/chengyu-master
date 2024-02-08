import {Component, OnDestroy} from '@angular/core';
import {
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
import {AsyncPipe, NgIf} from "@angular/common";
import {GameScoreService} from "./game-score.service";

@Component({
  selector: 'app-game-score',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  animations: [],
  templateUrl: './game-score.component.html',
  styleUrl: './game-score.component.scss'
})
export class GameScoreComponent implements OnDestroy {
  scoreUpdated$ = new ReplaySubject<void>(1);
  scoreUpdatedSubscription!: Subscription;
  scoreDisplayed$: Observable<number>;

  constructor(private gameScoreService: GameScoreService) {
    this.scoreDisplayed$ = this.gameScoreService.gameScore$.pipe(
      pairwise(),
      switchMap(([previousScore, currentScore]) => {
        return this.animateScoreDisplayed(previousScore, currentScore).pipe(
        )
      }),
      startWith(0),
    );
  }

  animateScoreDisplayed(previousScore: number, currentScore: number) {
    const animationDuration = 500;
    const animationSteps = 50;
    const animationStepDuration = animationDuration / animationSteps;

    return interval(animationStepDuration).pipe(
      take(animationSteps),
      map(step => Math.round(previousScore + (step * (currentScore - previousScore) / animationSteps))),
      endWith(currentScore)
    );
  }

  ngOnDestroy(): void {
    if (this.scoreUpdatedSubscription) {
      this.scoreUpdatedSubscription.unsubscribe();
    }
  }

}
