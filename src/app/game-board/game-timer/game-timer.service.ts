import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, map, ReplaySubject, skip, Subscription, tap, timer} from "rxjs";

@Injectable()
export class GameTimerService implements OnDestroy {

  private timerValueSubject = new BehaviorSubject<GameTimerData>({timeLeft: 0, duration: 0});
  public readonly timerValue$ = this.timerValueSubject.asObservable().pipe(
    skip(1),
    distinctUntilChanged((previous, current) => previous.timeLeft === current.timeLeft)
  );

  private timerExpiredSubject = new ReplaySubject(1);
  public readonly timerExpired$ = this.timerExpiredSubject.asObservable();

  private timerSubscription!: Subscription;

  constructor() {
  }

  startTimer(duration: number) {
    this.stopTimer();

    const timer$ = timer(0, 1000).pipe(map(elapsed => duration - elapsed));

    this.timerSubscription = timer$.pipe(
      tap(timeLeft => {
        this.timerValueSubject.next({timeLeft, duration});

        if (timeLeft < 0) {
          this.timerExpiredSubject.next(true);
          this.stopTimer();
        }
      })
    ).subscribe();
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  getTimeLeft() {
    return this.timerValueSubject.value.timeLeft;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}

export interface GameTimerData {
  timeLeft: number;
  duration: number;
}
