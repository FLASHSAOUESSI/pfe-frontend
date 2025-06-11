import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtService } from '../../services/jwt.service';
import { TypeEnquete } from './admin-type-enquete.service';

export interface Enterprise {
  id: number;
  name: string;
  address: string;
  email: string;
  fax: string;
  status: string;
  governorateId: number;
  governorateName: string;
  responsablesCount: number;
}

export interface Enquete {
  id: number;
  nomSociale: string;
  adresse: string;
  telephone: string;
  fax: string;
  nomRepondant: string;
  mailRepondant: string;
  brancheActivite: string;
  exportatrice: boolean;
  situation1erTrimestre: string;
  situationFuture: string;
  effectifs1erTrimestre: string;
  effectifsFutur: string;
  identifiantStat: string;
  diffAutre: string;
  variaisonSaisoniere: boolean;
  situation2emeTrimestre: string;
  effectifs2emeTrimestre: string;
  prixMatieres1erTrimestre: string;
  prixMatieres2emeTrimestre: string;
  prixMatieresFutur: string;
  pleineCapacite: boolean;
  tauxUtilisationCapacite: number;
  avoirDifficultes: boolean;
  diffApprovisionnement: boolean;
  diffPieces: boolean;
  diffTresorerie: boolean;
  dateCreation: Date;
  status: 'COMPLETED' | 'INCOMPLETE';
  type_enquete?: TypeEnquete;
  typeEnquete?: TypeEnquete;
  enterprise?: Enterprise;
}

@Injectable({
  providedIn: 'root',
})
export class AdminEnqueteService {
  private apiUrl = `${environment.apiUrl}/api/admin/enquetes`;

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  private getHeaders(): HttpHeaders {
    const token = this.jwtService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Obtenir toutes les enquêtes
  getAllEnquetes(): Observable<Enquete[]> {
    return this.http.get<Enquete[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  // Obtenir une enquête par son ID
  getEnqueteById(id: number): Observable<Enquete> {
    return this.http.get<Enquete>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Analyser le statut d'une enquête
  analyzeEnqueteStatus(enquete: Enquete): 'COMPLETED' | 'INCOMPLETE' {
    // Liste des champs obligatoires à vérifier
    const requiredFields = [
      'nomSociale',
      'adresse',
      'telephone',
      'nomRepondant',
      'mailRepondant',
      'brancheActivite',
      'situation1erTrimestre',
      'situation2emeTrimestre',
      'situationFuture',
      'effectifs1erTrimestre',
      'effectifs2emeTrimestre',
      'effectifsFutur',
      'pleineCapacite',
      'tauxUtilisationCapacite',
    ];

    // Vérifie si tous les champs obligatoires sont remplis
    const isComplete = requiredFields.every((field) => {
      const value = enquete[field as keyof Enquete];
      return value !== null && value !== undefined && value !== '';
    });

    return isComplete ? 'COMPLETED' : 'INCOMPLETE';
  }

  // Mettre à jour le statut d'une enquête
  updateEnqueteStatus(
    id: number,
    status: 'COMPLETED' | 'INCOMPLETE'
  ): Observable<Enquete> {
    return this.http.patch<Enquete>(
      `${this.apiUrl}/${id}/status`,
      { status },
      {
        headers: this.getHeaders(),
      }
    );
  }
}
