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

  private ctx!: CanvasRenderingContext2D;

  width = 275;
  height = 275;

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
    this.ctx.strokeStyle = '#ed7a75';
    this.ctx.lineWidth = 5;
    this.ctx.moveTo(canvasStartX, canvasStartY);
    this.ctx.lineTo(canvasEndX, canvasEndY);
    this.ctx.stroke();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
