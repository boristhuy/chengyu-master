import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {chengyuAnimations} from "./chengyu.animation";

@Component({
  selector: 'app-chengyu',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf
  ],
  animations: chengyuAnimations,
  templateUrl: './chengyu.component.html'
})
export class ChengyuComponent {
  @Input()
  hanzis: string[] | null = [];

  @Input()
  correctChengyu: boolean = false;

  @Input()
  incorrectChengyu: boolean = false;

  @Output()
  correctAnimationDone = new EventEmitter<void>();

  @Output()
  incorrectAnimationDone = new EventEmitter<void>();
}
