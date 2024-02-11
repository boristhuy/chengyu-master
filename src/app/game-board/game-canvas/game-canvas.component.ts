import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ScalingService} from "../../common/scaling.service";
import {Subscription, tap} from "rxjs";

@Component({
  selector: 'app-game-canvas',
  standalone: true,
  imports: [],
  templateUrl: './game-canvas.component.html'
})
export class GameCanvasComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvasElement')
  canvasElement!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  width = 300;
  height = 300;

  scale!: number;
  scaleSubscription!: Subscription;


  constructor(private scalingService: ScalingService) {
  }

  ngOnInit() {
    this.scaleSubscription = this.scalingService.getScale().pipe(
      tap(scale => this.scale = scale)
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasElement.nativeElement.getContext('2d')!;
  }

  ngOnDestroy() {
    this.scaleSubscription.unsubscribe();
  }

  drawLine(startElement: HTMLElement, endElement: HTMLElement): void {
    const startElementRect = startElement.getBoundingClientRect();
    const endElementRect = endElement.getBoundingClientRect();

    // Calculate the center positions
    const startX = startElementRect.left + startElementRect.width / 2;
    const startY = startElementRect.top + startElementRect.height / 2;
    const endX = endElementRect.left + endElementRect.width / 2;
    const endY = endElementRect.top + endElementRect.height / 2;

    const canvasRect = this.canvasElement.nativeElement.getBoundingClientRect();

    const canvasStartX = (startX - canvasRect.left) / this.scale;
    const canvasStartY = (startY - canvasRect.top) / this.scale;
    const canvasEndX = (endX - canvasRect.left) / this.scale;
    const canvasEndY = (endY - canvasRect.top) / this.scale;

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#759BF8FF';
    this.ctx.lineWidth = 2.5;
    this.ctx.moveTo(canvasStartX, canvasStartY);
    this.ctx.lineTo(canvasEndX, canvasEndY);
    this.ctx.stroke();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
