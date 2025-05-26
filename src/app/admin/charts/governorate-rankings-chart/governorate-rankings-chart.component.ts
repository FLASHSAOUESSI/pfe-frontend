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
  ApexPlotOptions,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { GovernorateRankingDto } from '../../../services/statistics.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  legend: ApexLegend;
  grid: ApexGrid;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-governorate-rankings-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="chart-controls">
      <button
        class="chart-type-button"
        [class.active]="barOrientation === 'horizontal'"
        (click)="changeOrientation('horizontal')"
      >
        <i class="fas fa-bars"></i> Horizontal
      </button>
      <button
        class="chart-type-button"
        [class.active]="barOrientation === 'vertical'"
        (click)="changeOrientation('vertical')"
      >
        <i class="fas fa-grip-lines-vertical"></i> Vertical
      </button>
    </div>
    <div class="chart-container" *ngIf="chartOptions">
      <apx-chart
        [series]="chartOptions.series"
        [chart]="chartOptions.chart"
        [dataLabels]="chartOptions.dataLabels"
        [plotOptions]="chartOptions.plotOptions"
        [xaxis]="chartOptions.xaxis"
        [yaxis]="chartOptions.yaxis"
        [title]="chartOptions.title"
        [legend]="chartOptions.legend"
        [grid]="chartOptions.grid"
        [tooltip]="chartOptions.tooltip"
        [responsive]="chartOptions.responsive"
      ></apx-chart>
    </div>
  `,
  styleUrls: ['./governorate-rankings-chart.component.css'],
})
export class GovernorateRankingsChartComponent implements OnChanges, OnDestroy {
  @Input() governorates: GovernorateRankingDto[] = [];
  @Input() metricLabel: string = 'Total des entreprises';

  barOrientation: 'horizontal' | 'vertical' = 'horizontal';
  public chartOptions!: Partial<ChartOptions>;

  constructor() {}

  changeOrientation(orientation: 'horizontal' | 'vertical'): void {
    if (this.barOrientation === orientation) return;
    this.barOrientation = orientation;
    this.prepareChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['governorates'] || changes['metricLabel']) &&
      this.governorates &&
      this.governorates.length > 0
    ) {
      this.prepareChartData();
    }
  }

  ngOnDestroy(): void {
    // ApexCharts does not require manual destruction
  }

  private prepareChartData(): void {
    if (!this.governorates || this.governorates.length === 0) {
      this.chartOptions = {
        series: [],
        chart: { type: 'bar', height: 350 },
        xaxis: { categories: [] },
      };
      return;
    }

    const categories = this.governorates.map((gov) => gov.name);
    const seriesData = this.governorates.map((gov) => gov.value);

    this.chartOptions = {
      series: [
        {
          name: this.metricLabel,
          data: seriesData,
        },
      ],
      chart: {
        type: 'bar',
        height:
          350 +
          (this.barOrientation === 'horizontal'
            ? this.governorates.length * 10
            : 0), // Adjust height for horizontal bars
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: this.barOrientation === 'horizontal',
          columnWidth: this.barOrientation === 'vertical' ? '70%' : undefined,
          barHeight: this.barOrientation === 'horizontal' ? '70%' : undefined,
          dataLabels: {
            position: this.barOrientation === 'horizontal' ? 'top' : 'center',
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: this.barOrientation === 'horizontal' ? 20 : 0,
        style: {
          fontSize: '12px',
          colors: [this.barOrientation === 'horizontal' ? '#304758' : '#fff'],
        },
      },
      xaxis: {
        categories: categories,
        title: {
          text:
            this.barOrientation === 'vertical'
              ? 'Gouvernorats'
              : this.metricLabel,
        },
        labels: {
          show: this.barOrientation === 'vertical',
        },
      },
      yaxis: {
        title: {
          text:
            this.barOrientation === 'horizontal'
              ? 'Gouvernorats'
              : this.metricLabel,
        },
        labels: {
          show: this.barOrientation === 'horizontal',
        },
      },
      title: {
        text: `Top Gouvernorats par ${this.metricLabel}`,
        align: 'center',
      },
      legend: {
        show: false, // Series name is in tooltip and title
      },
      grid: {
        borderColor: '#f1f1f1',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      tooltip: {
        y: {
          formatter: (val) => {
            return val + ' entreprises';
          },
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height:
                300 +
                (this.barOrientation === 'horizontal'
                  ? this.governorates.length * 8
                  : 0),
            },
            plotOptions: {
              bar: {
                horizontal: this.barOrientation === 'horizontal', // Keep orientation logic
              },
            },
            dataLabels: {
              enabled: false, // Hide data labels on smaller screens for horizontal
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            // Further adjustments for very small screens if needed
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              labels: {
                show: this.barOrientation === 'vertical', // Only show x-axis labels if vertical
              },
            },
            yaxis: {
              labels: {
                show: this.barOrientation === 'horizontal', // Only show y-axis labels if horizontal
              },
            },
          },
        },
      ],
    };
  }
}
