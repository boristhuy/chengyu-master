import {Component, HostListener} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe, NgStyle} from "@angular/common";
import {Observable} from "rxjs";
import {ScalingService} from "./common/scaling.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  scale$: Observable<number>;

  constructor(private scalingService: ScalingService) {
    this.scale$ = this.scalingService.getScale();

    this.checkScale();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScale();
  }

  checkScale() {
    const height = window.innerHeight;
    let newScale: number;

    if (height < 800) {
      newScale = 0.8;
    } else {
      newScale = 1;
    }

    this.scalingService.updateScale(newScale);
  }
}
