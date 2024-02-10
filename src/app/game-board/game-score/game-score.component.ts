import {Component, Input} from '@angular/core';
import {BehaviorSubject, endWith, interval, map, Observable, pairwise, startWith, switchMap, take} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";

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
