import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

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
export class BarChartComponent implements OnInit, OnChanges {
  @Input() data!: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] };

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.chart) {
      this.updateChart(); 
    }
  }

  renderChart() {
    const config: ChartConfiguration = {
      type: 'bar',
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: { beginAtZero: true, title: { display: true, text: 'Month' } },
          y: { beginAtZero: true, title: { display: true, text: 'Amount €' } }, 
        },
      },
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }

  updateChart() {
    if (this.chart) {
      this.chart.data = this.data; 
      this.chart.update();
    }
  }
}


// import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { Chart, ChartConfiguration, registerables } from 'chart.js';

// @Component({
//   selector: 'app-bar-chart',
//   standalone: true,
//   template: `<canvas #chartCanvas></canvas>`,
//   styles: [`
//     canvas {
//       max-width: 100%;
//       height: 350px;
//       margin: auto;
//     }
//   `]
// })
// export class BarChartComponent implements OnInit {
//   @Input() data: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] } = {
//     labels: [],
//     datasets: [],
//   };
//   @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

//   constructor() {
//     Chart.register(...registerables);
//   }

//   ngOnInit() {
//     this.renderChart();
//   }

//   renderChart() {
//     const config: ChartConfiguration = {
//       type: 'bar',
//       data: this.data,
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: 'top',
//           },
//         },
//         scales: {
//           x: {
//             beginAtZero: true,
//           },
//           y: {
//             beginAtZero: true,
//           },
//         },
//       },
//     };

//     new Chart(this.chartCanvas.nativeElement, config);
//   }
// }
