import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  template: `<canvas #chartCanvas></canvas>`,
  styles: [`
    canvas {
      max-width: 100%;
      margin: auto;
    }
  `]
})
export class PieChartComponent implements OnInit {
  @Input() data: { name: string; value: number }[] = [];
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.renderChart();
  }

  renderChart() {
    const labels = this.data.map(item => item.name);
    const values = this.data.map(item => item.value);

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    };

    new Chart(this.chartCanvas.nativeElement, config);
  }
}
