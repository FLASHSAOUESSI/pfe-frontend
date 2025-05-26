import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { GovernorateTimeSeriesDto } from '../../../services/statistics.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
  colors: string[];
};

@Component({
  selector: 'app-time-series-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="chart-controls">
      <button
        class="chart-type-button"
        [class.active]="chartType === 'line'"
        (click)="changeChartType('line')"
      >
        <i class="fas fa-chart-line"></i> Ligne
      </button>
      <button
        class="chart-type-button"
        [class.active]="chartType === 'bar'"
        (click)="changeChartType('bar')"
      >
        <i class="fas fa-chart-bar"></i> Barres
      </button>
    </div>
    <div class="chart-container" *ngIf="chartOptions">
      <apx-chart
        [series]="chartOptions.series"
        [chart]="chartOptions.chart"
        [xaxis]="chartOptions.xaxis"
        [yaxis]="chartOptions.yaxis"
        [dataLabels]="chartOptions.dataLabels"
        [grid]="chartOptions.grid"
        [stroke]="chartOptions.stroke"
        [title]="chartOptions.title"
        [legend]="chartOptions.legend"
        [tooltip]="chartOptions.tooltip"
        [markers]="chartOptions.markers"
        [colors]="chartOptions.colors"
        [responsive]="chartOptions.responsive"
      ></apx-chart>
    </div>
  `,
  styleUrls: ['./time-series-chart.component.css'],
})
export class TimeSeriesChartComponent implements OnChanges, OnDestroy {
  @Input() timeSeries: GovernorateTimeSeriesDto[] = [];

  chartType: 'line' | 'bar' = 'line';
  public chartOptions!: Partial<ChartOptions>;

  constructor() {}

  changeChartType(type: 'line' | 'bar'): void {
    if (this.chartType === type) return;
    this.chartType = type;
    this.prepareChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['timeSeries'] &&
      this.timeSeries &&
      this.timeSeries.length > 0
    ) {
      this.prepareChartData();
    }
  }

  ngOnDestroy(): void {
    // ApexCharts does not require manual destruction
  }

  private prepareChartData(): void {
    if (!this.timeSeries || this.timeSeries.length === 0) {
      this.chartOptions = {
        series: [],
        chart: { type: this.chartType, height: 350 },
        xaxis: { categories: [] },
      };
      return;
    }

    const allMonths = new Set<string>();
    this.timeSeries.forEach((gov) => {
      if (gov.monthlyData) {
        Object.keys(gov.monthlyData).forEach((month) => allMonths.add(month));
      }
    });
    const sortedMonths = Array.from(allMonths).sort(); // Basic sort, consider chronological if format allows

    const top5Governorates = this.timeSeries
      .slice() // Create a shallow copy before sorting to avoid mutating the input array
      .sort((a, b) => {
        const aTotal = Object.values(a.monthlyData || {}).reduce(
          (sum, val) => sum + (val || 0),
          0
        );
        const bTotal = Object.values(b.monthlyData || {}).reduce(
          (sum, val) => sum + (val || 0),
          0
        );
        return bTotal - aTotal;
      })
      .slice(0, 5);

    const colors = [
      '#4CAF50',
      '#2196F3',
      '#FFC107',
      '#FF5722',
      '#9C27B0',
      '#E91E63',
      '#00BCD4',
    ];

    const series: ApexAxisChartSeries = top5Governorates.map((gov, index) => {
      return {
        name: gov.name,
        data: sortedMonths.map((month) => gov.monthlyData?.[month] || 0),
      };
    });

    this.chartOptions = {
      series: series,
      chart: {
        height: 400,
        type: this.chartType,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      colors: colors.slice(0, series.length),
      dataLabels: {
        enabled: this.chartType === 'bar', // Enable for bar, disable for line for clarity
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758'],
        },
      },
      stroke: {
        curve: 'smooth',
        width: this.chartType === 'line' ? 3 : 0,
      },
      title: {
        text: 'Évolution mensuelle par gouvernorat (Top 5)',
        align: 'center',
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: {
        size: this.chartType === 'line' ? 5 : 0,
        hover: {
          size: 7,
        },
      },
      xaxis: {
        categories: sortedMonths,
        title: {
          text: 'Mois',
        },
      },
      yaxis: {
        title: {
          text: "Nombre d'entreprises",
        },
        min: 0,
        labels: {
          formatter: function (val) {
            return val.toFixed(0);
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (val) {
            return val !== undefined ? val.toFixed(0) + ' entreprises' : 'N/A';
          },
        },
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: 'bottom',
              offsetY: 10,
              offsetX: 0,
            },
          },
        },
      ],
    };
  }
}
