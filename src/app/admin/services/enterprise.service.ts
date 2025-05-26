import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Enterprise,
  EnterpriseDashboardDto,
  EnterpriseStatus,
  EnterpriseStatusUpdateDto,
} from '../models/enterprise.model';

@Injectable({
  providedIn: 'root',
})
export class EnterpriseService {
  private httpClient = inject(HttpClient);
  private readonly API_URL = 'http://localhost:9090';

  // Get all enterprises
  getAllEnterprises(): Observable<Enterprise[]> {
    return this.httpClient.get<Enterprise[]>(`${this.API_URL}/api/entreprises`);
  }

  // Get enterprises by status
  getEnterprisesByStatus(status: EnterpriseStatus): Observable<Enterprise[]> {
    return this.httpClient.get<Enterprise[]>(
      `${this.API_URL}/api/admin/gestion/entreprises/status/${status}`
    );
  }

  // Get pending enterprises
  getPendingEnterprises(): Observable<Enterprise[]> {
    return this.httpClient.get<Enterprise[]>(
      `${this.API_URL}/api/admin/gestion/entreprises/pending`
    );
  }

  // Get enterprise by ID
  getEnterpriseById(id: number): Observable<Enterprise> {
    return this.httpClient.get<Enterprise>(
      `${this.API_URL}/api/entreprises/${id}`
    );
  }

  // Update enterprise status
  updateEnterpriseStatus(
    id: number,
    status: EnterpriseStatus
  ): Observable<EnterpriseStatusUpdateDto> {
    return this.httpClient.put<EnterpriseStatusUpdateDto>(
      `${this.API_URL}/api/admin/gestion/entreprises/${id}/status?status=${status}`,
      {}
    );
  }

  // Update enterprise details
  updateEnterprise(id: number, enterprise: Enterprise): Observable<Enterprise> {
    return this.httpClient.put<Enterprise>(
      `${this.API_URL}/api/entreprises/${id}`,
      enterprise
    );
  }

  // Delete enterprise
  deleteEnterprise(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.API_URL}/api/entreprises/${id}`
    );
  }

  // Get dashboard statistics
  getDashboard(): Observable<EnterpriseDashboardDto> {
    return this.httpClient.get<EnterpriseDashboardDto>(
      `${this.API_URL}/api/admin/gestion/dashboard`
    );
  }
}
