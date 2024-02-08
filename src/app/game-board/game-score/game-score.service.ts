import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, scan} from "rxjs";

@Injectable()
export class GameScoreService implements OnDestroy {
  private gameScoreSubject = new BehaviorSubject(0);
  gameScore$ = this.gameScoreSubject.asObservable().pipe(
    scan((acc, value) => acc + value)
  );

  constructor() { }

  computeScore(basePoint: number, timeLeft: number): void {
    const timeBonus = this.computeTimeBonus(timeLeft);
    const score = basePoint + timeBonus;

    this.gameScoreSubject.next(score);
  }



  private computeTimeBonus(remainingTime: number): number {
    return remainingTime * 10;
  }

  ngOnDestroy(): void {

  }
}
