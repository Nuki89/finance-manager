import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartComponent } from './base-chart.component';


@Component({
  selector: 'app-pie-chart',
  standalone: true,
  template: `<canvas #chartCanvas></canvas>`,
  styles: [`
    canvas {
      max-width: 100%;
      height: 330px;
      margin: auto;
    }
  `]
})
export class PieChartComponent extends BaseChartComponent {
  protected getChartConfig(): ChartConfiguration {
    return {
      type: 'pie',
      data: this.data,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    };
  }
}
