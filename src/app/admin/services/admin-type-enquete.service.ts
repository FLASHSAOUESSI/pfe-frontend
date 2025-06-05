import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TypeEnquete {
  id: number;
  annee: number;
  periodicite: string;
  session: string;
  statut: 'enable' | 'disable';
}

@Injectable({
  providedIn: 'root'
})
export class AdminTypeEnqueteService {
  private apiUrl = 'http://localhost:9090/api/type-enquete';

  constructor(private http: HttpClient) { }

  getAllTypes(): Observable<TypeEnquete[]> {
    return this.http.get<TypeEnquete[]>(this.apiUrl);
  }

  getTypeById(id: number): Observable<TypeEnquete> {
    return this.http.get<TypeEnquete>(`${this.apiUrl}/${id}`);
  }

  addType(type: Partial<TypeEnquete>): Observable<TypeEnquete> {
    return this.http.post<TypeEnquete>(this.apiUrl, type);
  }

  updateType(id: number, type: Partial<TypeEnquete>): Observable<TypeEnquete> {
    return this.http.put<TypeEnquete>(`${this.apiUrl}/${id}`, type);
  }

  deleteTypeEnquete(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
}
