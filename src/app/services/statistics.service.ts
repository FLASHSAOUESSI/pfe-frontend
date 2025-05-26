import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';

// Interface for Consolidated Statistics
export interface ConsolidatedStatisticsDto {
  totalEnterprises: number;
  validatedEnterprises: number;
  pendingEnterprises: number;
  rejectedEnterprises: number;
  totalGovernorates: number;
  governorateWithMostEnterprises: string;
  governorateWithHighestValidationRate: string;
  statusDistribution: Record<string, number>;
  governorateDistribution: Record<string, number>;
  topGovernorates: GovernorateRankingDto[];
  averageGrowthRate: number;
  monthlyGrowthRates: Record<string, number>;
}

// Interface for Governorate Rankings
export interface GovernorateRankingDto {
  id: number;
  name: string;
  ranking: number;
  value: number;
}

// Interface for Governorate Statistics
export interface GovernorateStatDto {
  id: number;
  name: string;
  totalEnterprises: number;
  validatedEnterprises: number;
  pendingEnterprises: number;
  rejectedEnterprises: number;
}

// Interface for Detailed Governorate Statistics
export interface DetailedGovernorateStatDto extends GovernorateStatDto {
  validationRate: number;
  rejectionRate: number;
  pendingRate: number;
  nationalAverageComparison: number;
  regionalRanking: number;
  monthlyGrowth: Record<string, number>;
  enterpriseDensity: number;
  statusDistribution: EnterpriseDistributionDto[];
}

// Interface for Enterprise Distribution
export interface EnterpriseDistributionDto {
  status: string;
  count: number;
  percentage: number;
}

// Interface for Governorate Time Series
export interface GovernorateTimeSeriesDto {
  id: number;
  name: string;
  monthlyData: Record<string, number>;
  growthRate: number;
}

// Interface for Governorate Evaluation
export interface GovernorateEvaluationDto {
  id: number;
  name: string;
  enterpriseCount: number;
  validationRate: number;
  overallStatus: string;
  growthRate: number;
  growthTrend: string;
  performanceScore: number;
}

// Interface for Governorate Comparison
export interface GovernorateComparisonDto {
  firstGovernorate: DetailedGovernorateStatDto;
  secondGovernorate: DetailedGovernorateStatDto;
  totalEnterpriseDifference: number;
  validatedEnterpriseDifference: number;
  validationRateDifference: number;
  firstToSecondRatio: number;
  statusDifferences: Record<string, number>;
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private readonly httpClient = inject(HttpClient);
  private readonly API_URL = 'http://localhost:9090/api/governorates';

  // Get consolidated statistics for the dashboard
  getConsolidatedStatistics(): Observable<ConsolidatedStatisticsDto> {
    return this.httpClient
      .get<ConsolidatedStatisticsDto>(`${this.API_URL}/statistics/consolidated`)
      .pipe(
        retry(2),
        catchError((error) => {
          console.error('Error fetching consolidated statistics:', error);
          return throwError(
            () =>
              new Error(
                'Failed to load consolidated statistics. Please try again later.'
              )
          );
        })
      );
  }

  // Get basic statistics for all governorates
  getAllGovernorateStatistics(): Observable<GovernorateStatDto[]> {
    return this.httpClient
      .get<GovernorateStatDto[]>(`${this.API_URL}/statistics`)
      .pipe(
        retry(2),
        catchError((error) => {
          console.error('Error fetching governorate statistics:', error);
          return throwError(
            () =>
              new Error(
                'Failed to load governorate statistics. Please try again later.'
              )
          );
        })
      );
  }

  // Get detailed statistics for all governorates
  getDetailedGovernorateStatistics(): Observable<DetailedGovernorateStatDto[]> {
    return this.httpClient
      .get<DetailedGovernorateStatDto[]>(`${this.API_URL}/statistics/detailed`)
      .pipe(
        retry(2),
        catchError((error) => {
          console.error(
            'Error fetching detailed governorate statistics:',
            error
          );
          return throwError(
            () =>
              new Error(
                'Failed to load detailed governorate statistics. Please try again later.'
              )
          );
        })
      );
  }

  // Get detailed statistics for a specific governorate
  getDetailedGovernorateStatisticsById(
    id: number
  ): Observable<DetailedGovernorateStatDto> {
    return this.httpClient
      .get<DetailedGovernorateStatDto>(
        `${this.API_URL}/${id}/statistics/detailed`
      )
      .pipe(
        retry(2),
        catchError((error) => {
          console.error(
            `Error fetching detailed statistics for governorate ${id}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                'Failed to load detailed governorate statistics. Please try again later.'
              )
          );
        })
      );
  }

  // Get time series data for all governorates
  getGovernorateTimeSeries(): Observable<GovernorateTimeSeriesDto[]> {
    return this.httpClient
      .get<GovernorateTimeSeriesDto[]>(`${this.API_URL}/time-series`)
      .pipe(
        retry(2),
        catchError((error) => {
          console.error('Error fetching governorate time series:', error);
          return throwError(
            () =>
              new Error(
                'Failed to load governorate time series. Please try again later.'
              )
          );
        })
      );
  }

  // Get time series data for a specific governorate
  getGovernorateTimeSeriesById(
    id: number
  ): Observable<GovernorateTimeSeriesDto> {
    return this.httpClient
      .get<GovernorateTimeSeriesDto>(`${this.API_URL}/${id}/time-series`)
      .pipe(
        retry(2),
        catchError((error) => {
          console.error(
            `Error fetching time series for governorate ${id}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                'Failed to load governorate time series. Please try again later.'
              )
          );
        })
      );
  }

  // Get evaluations for all governorates
  getGovernorateEvaluations(): Observable<GovernorateEvaluationDto[]> {
    return this.httpClient
      .get<GovernorateEvaluationDto[]>(`${this.API_URL}/evaluations`)
      .pipe(
        retry(2),
        catchError((error) => {
          console.error('Error fetching governorate evaluations:', error);
          return throwError(
            () =>
              new Error(
                'Failed to load governorate evaluations. Please try again later.'
              )
          );
        })
      );
  }

  // Get evaluation for a specific governorate
  getGovernorateEvaluationById(
    id: number
  ): Observable<GovernorateEvaluationDto> {
    return this.httpClient
      .get<GovernorateEvaluationDto>(`${this.API_URL}/${id}/evaluation`)
      .pipe(
        retry(2),
        catchError((error) => {
          console.error(
            `Error fetching evaluation for governorate ${id}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                'Failed to load governorate evaluation. Please try again later.'
              )
          );
        })
      );
  }

  // Get governorate rankings by metric (default is 'total')
  getGovernorateRankings(
    metric: string = 'total'
  ): Observable<GovernorateRankingDto[]> {
    return this.httpClient
      .get<GovernorateRankingDto[]>(`${this.API_URL}/rankings?metric=${metric}`)
      .pipe(
        retry(2),
        catchError((error) => {
          console.error(
            `Error fetching governorate rankings for metric ${metric}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                'Failed to load governorate rankings. Please try again later.'
              )
          );
        })
      );
  }

  // Compare two governorates
  compareGovernorates(
    firstId: number,
    secondId: number
  ): Observable<GovernorateComparisonDto> {
    return this.httpClient
      .get<GovernorateComparisonDto>(
        `${this.API_URL}/compare?firstId=${firstId}&secondId=${secondId}`
      )
      .pipe(
        retry(2),
        catchError((error) => {
          console.error(
            `Error comparing governorates ${firstId} and ${secondId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                'Failed to load governorate comparison. Please try again later.'
              )
          );
        })
      );
  }
}
