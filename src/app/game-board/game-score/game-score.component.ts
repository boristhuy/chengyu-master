import {Component, Input} from '@angular/core';
import {BehaviorSubject, endWith, interval, map, Observable, pairwise, startWith, switchMap, take} from "rxjs";
import {AsyncPipe, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-game-score',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgStyle
  ],
  animations: [],
  templateUrl: './game-score.component.html'
})
export class GameScoreComponent {

  @Input() set score(score: number) {
    this.scoreDisplayedSubject.next(score);
  }

  scoreDisplayedSubject = new BehaviorSubject<number>(0);
  scoreDisplayed$: Observable<number> = this.scoreDisplayedSubject.asObservable().pipe(
    startWith(0),
    pairwise(),
    switchMap(([previousScore, currentScore]) => {
      return this.animateScoreDisplayed(previousScore, currentScore).pipe(
      )
    })
  );

  progress$: Observable<number> = this.scoreDisplayedSubject.asObservable().pipe(
    startWith(0),
    map(score => Math.min(100, score / 500 * 100))
  )

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

}
