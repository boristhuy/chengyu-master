import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ScalingService} from "../../common/scaling.service";
import {Subscription, tap} from "rxjs";

@Component({
  selector: 'chengyu-game-canvas',
  standalone: true,
  imports: [],
  templateUrl: './game-canvas.component.html',
  styleUrl: './game-canvas.component.css'
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

  drawLine(startX: number, startY: number, endX: number, endY: number): void {
    const rect = this.canvasElement.nativeElement.getBoundingClientRect();

    const canvasStartX = (startX - rect.left) / this.scale;
    const canvasStartY = (startY - rect.top) / this.scale;
    const canvasEndX = (endX - rect.left) / this.scale;
    const canvasEndY = (endY - rect.top) / this.scale;

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#f6c48e';
    this.ctx.lineWidth = 6;
    this.ctx.moveTo(canvasStartX, canvasStartY);
    this.ctx.lineTo(canvasEndX, canvasEndY);
    this.ctx.stroke();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
