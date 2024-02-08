import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScalingService {
  private scaleSubject = new BehaviorSubject<number>(1);

  constructor() {
  }

  getScale(): Observable<number> {
    return this.scaleSubject.asObservable();
  }

  updateScale(newScale: number) {
    this.scaleSubject.next(newScale);
  }
}
