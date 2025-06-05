import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Investigator } from './enquete.component';

@Injectable({
  providedIn: 'root'
})
export class EnqueteService {

  private readonly httpclient = inject(HttpClient)
  private readonly API_URL= "http://localhost:9090/api/enquetes"

  create(request:any): Observable<any>{
    const token =localStorage.getItem("accessToken")
    console.log(token)
   return this.httpclient.post<any>(`${this.API_URL}`, request)
  }
  
  

  getAll():Observable<any>{
    return this.httpclient.get<any>(`${this.API_URL}`)
  }

}












































































