import { Component, ElementRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-base-chart',
  standalone: true,
  template: `<canvas #chartCanvas></canvas>`,
  styles: [`
    canvas {
      max-width: 100%;
      height: 100%;
      margin: auto;
    }
  `]
})
export abstract class BaseChartComponent implements OnInit, OnChanges {
  @Input() data: any;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  protected chart!: Chart;

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

  protected abstract getChartConfig(): ChartConfiguration;

  public renderChart() {
    const config = this.getChartConfig();
    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }

  public updateChart() {
    this.chart.data = this.data;
    this.chart.update();
  }
}
