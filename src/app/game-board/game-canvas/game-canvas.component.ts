import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'chengyu-game-canvas',
  standalone: true,
  imports: [],
  templateUrl: './game-canvas.component.html',
  styleUrl: './game-canvas.component.css'
})
export class GameCanvasComponent implements AfterViewInit {

  @ViewChild('canvasElement')
  canvasElement!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  width = 300;
  height = 300;

  ngAfterViewInit(): void {
    this.ctx = this.canvasElement.nativeElement.getContext('2d')!;
  }

  drawLine(startX: number, startY: number, endX: number, endY: number): void {
    const rect = this.canvasElement.nativeElement.getBoundingClientRect();

    const canvasStartX = startX - rect.left;
    const canvasStartY = startY - rect.top;
    const canvasEndX = endX - rect.left;
    const canvasEndY = endY - rect.top;

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#ff6680';
    this.ctx.lineWidth = 6;
    this.ctx.moveTo(canvasStartX, canvasStartY);
    this.ctx.lineTo(canvasEndX, canvasEndY);
    this.ctx.stroke();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
