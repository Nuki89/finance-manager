import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartComponent } from './base-chart.component';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `<canvas #chartCanvas></canvas>`,
  styles: [`
    canvas {
      max-width: 100%;
      height: 350px;
      margin: auto;
    }
  `]
})
export class BarChartComponent extends BaseChartComponent {
  protected getChartConfig(): ChartConfiguration {
    return {
      type: 'bar',
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
        },
        scales: {
          x: { beginAtZero: true, title: { display: true, text: 'Month' } },
          y: { beginAtZero: true, title: { display: true, text: 'Amount €' } }, 
        },
      },
    };
  }
}
