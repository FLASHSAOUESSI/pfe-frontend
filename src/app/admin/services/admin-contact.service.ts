import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactMessage } from '../models/contact-message';
import { JwtService } from '../../services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AdminContactService {
  private apiUrl = `${environment.apiUrl}/api/contact`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.jwtService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtenir tous les messages
  getAllMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Obtenir les messages non répondus
  getUnrespondedMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.apiUrl}/unresponded`, {
      headers: this.getHeaders()
    });
  }

  // Répondre à un message
  respondToMessage(messageId: number, responseText: string): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(
      `${this.apiUrl}/${messageId}/respond`,
      responseText,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.jwtService.getToken()}`,
          'Content-Type': 'text/plain'
        })
      }
    );
  }
}
