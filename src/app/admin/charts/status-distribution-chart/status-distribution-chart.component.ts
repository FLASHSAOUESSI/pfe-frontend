import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ConsolidatedStatisticsDto } from '../../../services/statistics.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  colors: string[];
};

@Component({
  selector: 'app-status-distribution-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="chart-controls">
      <button
        class="chart-type-button"
        [class.active]="chartType === 'donut'"
        (click)="changeChartType('donut')"
      >
        <i class="fas fa-circle-notch"></i> Anneau
      </button>
      <button
        class="chart-type-button"
        [class.active]="chartType === 'pie'"
        (click)="changeChartType('pie')"
      >
        <i class="fas fa-chart-pie"></i> Camembert
      </button>
    </div>
    <div class="chart-container" *ngIf="chartOptions">
      <apx-chart
        [series]="chartOptions.series"
        [chart]="chartOptions.chart"
        [labels]="chartOptions.labels"
        [title]="chartOptions.title"
        [responsive]="chartOptions.responsive"
        [dataLabels]="chartOptions.dataLabels"
        [legend]="chartOptions.legend"
        [tooltip]="chartOptions.tooltip"
        [colors]="chartOptions.colors"
      ></apx-chart>
    </div>
  `,
  styleUrls: ['./status-distribution-chart.component.css'],
})
export class StatusDistributionChartComponent implements OnChanges, OnDestroy {
  @Input() stats: ConsolidatedStatisticsDto | null = null;

  chartType: 'donut' | 'pie' = 'donut';
  public chartOptions!: Partial<ChartOptions>;

  constructor() {}

  changeChartType(type: 'donut' | 'pie'): void {
    if (this.chartType === type) return;
    this.chartType = type;
    this.prepareChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stats'] && this.stats) {
      this.prepareChartData();
    }
  }

  ngOnDestroy(): void {
    // ApexCharts does not require manual destruction of chart instances like Chart.js
  }

  private prepareChartData(): void {
    if (!this.stats || !this.stats.statusDistribution) {
      this.chartOptions = {
        series: [],
        chart: { type: this.chartType, height: 350 },
        labels: [],
      }; // Basic empty chart
      return;
    }

    const statusData = Object.entries(this.stats.statusDistribution);
    const labels = statusData.map(([key, _]) => key);
    const series = statusData.map(([_, value]) => value);
    const colors = ['#4CAF50', '#FF9800', '#F44336', '#2196F3']; // Validated, Pending, Rejected, Other

    this.chartOptions = {
      series: series,
      chart: {
        type: this.chartType,
        height: 350,
        toolbar: {
          show: true,
        },
      },
      labels: labels,
      colors: colors.slice(0, series.length),
      title: {
        text: 'Distribution par statut',
        align: 'center',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts: any) {
          const seriesIndex = opts.seriesIndex;
          const seriesName = opts.w.globals.labels[seriesIndex];
          // Calculate percentage
          const total = opts.w.globals.seriesTotals.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage = (
            (opts.w.globals.series[seriesIndex] / total) *
            100
          ).toFixed(1);
          return seriesName + ': ' + val + ' (' + percentage + '%)';
        },
      },
      tooltip: {
        y: {
          formatter: function (val: number, opts?: any) {
            const seriesIndex = opts.seriesIndex;
            const seriesName = opts.w.globals.labels[seriesIndex];
            // Calculate percentage
            const total = opts.w.globals.seriesTotals.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = (
              (opts.w.globals.series[seriesIndex] / total) *
              100
            ).toFixed(1);
            return seriesName + ': ' + val + ' (' + percentage + '%)';
          },
        },
      },
    };
  }
}
