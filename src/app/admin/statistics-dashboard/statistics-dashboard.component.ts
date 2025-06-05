import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgApexchartsModule } from 'ng-apexcharts';
import { JwtService } from '../../services/jwt.service';
import {
  ConsolidatedStatisticsDto,
  GovernorateRankingDto,
  GovernorateStatDto,
  GovernorateTimeSeriesDto,
  StatisticsService,
} from '../../services/statistics.service';
import { GovernorateRankingsChartComponent } from '../charts/governorate-rankings-chart/governorate-rankings-chart.component';
import { StatusDistributionChartComponent } from '../charts/status-distribution-chart/status-distribution-chart.component';
import { TimeSeriesChartComponent } from '../charts/time-series-chart/time-series-chart.component';
import { AdminNavbarComponent } from '../shared/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    StatusDistributionChartComponent,
    GovernorateRankingsChartComponent,
    TimeSeriesChartComponent,
    NgApexchartsModule,
    AdminNavbarComponent
  ],
  templateUrl: './statistics-dashboard.component.html',
  styleUrls: ['./statistics-dashboard.component.css'],
})
export class StatisticsDashboardComponent implements OnInit {
  private readonly statisticsService = inject(StatisticsService);
  private readonly toast = inject(HotToastService);
  private readonly jwtService = inject(JwtService);

  isUserAdmin: boolean = false;
  userEmail: string | null = null;

  // Loading states
  isLoading: boolean = false;
  isLoadingGovStats: boolean = false;
  isLoadingTimeSeries: boolean = false;
  isLoadingRankings: boolean = false;

  // Error states
  error: string | null = null;

  // Data containers
  consolidatedStats: ConsolidatedStatisticsDto | null = null;
  governorateStats: GovernorateStatDto[] = [];
  topGovernorates: GovernorateRankingDto[] = [];
  timeSeries: GovernorateTimeSeriesDto[] = [];

  // Display options
  selectedMetric: string = 'total';

  // Metrics options
  metricOptions = [
    { value: 'total', label: 'Total des entreprises' },
    { value: 'validated', label: 'Entreprises validées' },
    { value: 'pending', label: 'Entreprises en attente' },
    { value: 'rejected', label: 'Entreprises rejetées' },
  ];

  constructor() {
    this.isUserAdmin = this.jwtService.isAdmin();
    this.userEmail = this.jwtService.getUserEmail();
  }

  ngOnInit(): void {
    this.loadConsolidatedStats();
    this.loadGovernorateStats();
    this.loadRankings();
    this.loadTimeSeries();
  }

  loadConsolidatedStats(): void {
    this.isLoading = true;
    this.statisticsService.getConsolidatedStatistics().subscribe({
      next: (data) => {
        this.consolidatedStats = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des statistiques consolidées';
        this.toast.error(this.error);
        this.isLoading = false;
      },
    });
  }

  loadGovernorateStats(): void {
    this.isLoadingGovStats = true;
    this.statisticsService.getAllGovernorateStatistics().subscribe({
      next: (data) => {
        this.governorateStats = data;
        this.isLoadingGovStats = false;
      },
      error: (err) => {
        this.error =
          'Erreur lors du chargement des statistiques par gouvernorat';
        this.toast.error(this.error);
        this.isLoadingGovStats = false;
      },
    });
  }

  loadRankings(): void {
    this.isLoadingRankings = true;
    this.statisticsService
      .getGovernorateRankings(this.selectedMetric)
      .subscribe({
        next: (data) => {
          this.topGovernorates = data.slice(0, 10); // Top 10
          this.isLoadingRankings = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des classements';
          this.toast.error(this.error);
          this.isLoadingRankings = false;
        },
      });
  }

  loadTimeSeries(): void {
    this.isLoadingTimeSeries = true;
    this.statisticsService.getGovernorateTimeSeries().subscribe({
      next: (data) => {
        this.timeSeries = data;
        this.isLoadingTimeSeries = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des séries temporelles';
        this.toast.error(this.error);
        this.isLoadingTimeSeries = false;
      },
    });
  }

  onMetricChange(): void {
    this.loadRankings();
  }

  // Helper function to get metric label
  getMetricLabel(): string {
    const found = this.metricOptions.find(
      (option) => option.value === this.selectedMetric
    );
    return found ? found.label : 'Total des entreprises';
  }

  // Helper function to convert object to array of key-value pairs
  objectToArray(
    obj: Record<string, number> | undefined
  ): { key: string; value: number }[] {
    if (!obj) return [];
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }

  // Helper function to calculate percentage
  calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  // Helper function to get color for status
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'validated':
        return 'green';
      case 'pending':
        return 'orange';
      case 'rejected':
        return 'red';
      default:
        return 'blue';
    }
  }

  // Helper function to get trend icon
  getTrendIcon(value: number): string {
    if (value > 0) return 'fas fa-arrow-up text-success';
    if (value < 0) return 'fas fa-arrow-down text-danger';
    return 'fas fa-minus text-muted';
  }
}
