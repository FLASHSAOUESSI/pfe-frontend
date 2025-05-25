import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Investigator } from './enquete.component';

@Injectable({
  providedIn: 'root'
})
export class InvestigateurService {

  private readonly httpclient = inject(HttpClient)
  private readonly API_URL= "http://localhost:9090/api/investigateurs"

  findCurrentInvestiagor(): Observable<Investigator>{
   return this.httpclient.get<Investigator>(`${this.API_URL}/me`)
  }


}
