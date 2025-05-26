import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';

export interface Governorate {
  id: number;
  name: string;
  code: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class GovernorateService {
  private readonly httpClient = inject(HttpClient);
  private readonly API_URL = 'http://localhost:9090/api/governorates';

  /**
   * Get all governorates from the API
   * @returns Observable of governorate array
   */
  getAllGovernorates(): Observable<Governorate[]> {
    return this.httpClient.get<Governorate[]>(this.API_URL).pipe(
      retry(2), // Retry failed requests up to 2 times
      catchError((error) => {
        console.error('Error fetching governorates:', error);
        return throwError(
          () =>
            new Error('Failed to load governorates. Please try again later.')
        );
      })
    );
  }

  /**
   * Get a governorate by ID
   * @param id The governorate ID
   * @returns Observable of a single governorate
   */
  getGovernorate(id: number): Observable<Governorate> {
    return this.httpClient.get<Governorate>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching governorate with ID ${id}:`, error);
        return throwError(
          () => new Error('Failed to load governorate details.')
        );
      })
    );
  }
}
