import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `<canvas #chartCanvas></canvas>`,
  styles: [`
    canvas {
      max-width: 100%;
      margin: auto;
    }
  `]
})
export class BarChartComponent implements OnInit {
  @Input() data: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] } = {
    labels: [],
    datasets: [],
  };
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.renderChart();
  }

  renderChart() {
    const config: ChartConfiguration = {
      type: 'bar',
      data: this.data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    new Chart(this.chartCanvas.nativeElement, config);
  }
}
