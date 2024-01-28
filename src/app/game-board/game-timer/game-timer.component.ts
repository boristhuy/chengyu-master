import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {
  BehaviorSubject,
  map,
  Observable,
  scan, shareReplay,
  startWith,
  Subject,
  Subscription,
  switchMap,
  takeUntil, tap,
  timer
} from "rxjs";

@Component({
  selector: 'chengyu-game-timer',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './game-timer.component.html',
  styleUrl: './game-timer.component.css'
})
export class GameTimerComponent implements OnInit, OnDestroy {
  private timerSubscription!: Subscription;

  private restartSubject: Subject<void> = new Subject<void>();
  private stopSubject: Subject<void> = new Subject<void>();

  timer$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  timerDisplay$!: Observable<string>;

  ngOnInit(): void {
    const timer$ = this.restartSubject.pipe(
      // Start the timer immediately without waiting for the first restart event
      startWith(0),
      switchMap(() => timer(0, 1000).pipe(
        // Start with -1 so the first emitted value is 0 after incrementing
        scan((acc) => acc + 1, -1),
        takeUntil(this.stopSubject),
      )),
      shareReplay(1)
    );

    this.timerDisplay$ = timer$.pipe(
      map(seconds => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
      })
    );

    this.timerSubscription = timer$.subscribe(this.timer$);
  }

  restartTimer(): void {
    this.restartSubject.next();
  }

  stopTimer(): void {
    this.stopSubject.next();
  }

  private padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

}
