import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe, DOCUMENT, NgStyle} from "@angular/common";
import {Subscription} from "rxjs";
import {ScalingService} from "./common/scaling.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private scaleSubscription!: Subscription;

  constructor(private scalingService: ScalingService, @Inject(DOCUMENT) private document: Document) {
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScale();
  }

  ngOnInit() {
    this.checkScale();

    this.scaleSubscription = this.scalingService.getScale().subscribe(scale => {
      this.document.body.style.setProperty('--app-scale', `${scale}`);
    });
  }

  ngOnDestroy() {
    if (this.scaleSubscription) {
      this.scaleSubscription.unsubscribe();
    }

    this.document.body.style.removeProperty('--app-scale');
  }

  checkScale() {
    const height = window.innerHeight;
    let newScale: number;

    if (height < 800) {
      newScale = 0.85;
    } else {
      newScale = 1;
    }

    this.scalingService.updateScale(newScale);
  }
}
