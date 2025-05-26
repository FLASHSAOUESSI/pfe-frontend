import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  ForgetPasswordRequest,
  RegisterRequest,
  SetPasswordRequest,
  VerificationRequest,
} from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpclient = inject(HttpClient);
  private readonly API_URL = 'http://localhost:9090/api/auth';

  register(request: RegisterRequest) {
    return this.httpclient.post(`${this.API_URL}/register`, request);
  }

  login(email: string, password: string) {
    localStorage.removeItem('accessToken');
    return this.httpclient
      .post(`${this.API_URL}/login`, {
        email: email,
        password: password,
      })
      .pipe(
        tap((res: any) => {
          localStorage.setItem('accessToken', res.token);
        })
      );
  }

  sendVerficationCode(request: VerificationRequest) {
    return this.httpclient.post(`${this.API_URL}/verify`, request);
  }

  setpassword(request: SetPasswordRequest) {
    return this.httpclient.post(`${this.API_URL}/set-password`, request);
  }

  forgotpassword(request: ForgetPasswordRequest) {
    return this.httpclient.post(`${this.API_URL}/forgot-password`, request);
  }

  changePassword(password: string, confirmPassword: string, code: string) {
    return this.httpclient.post(`${this.API_URL}/change-password`, {
      code: code,
      password: password,
      confirmPassword: confirmPassword,
    });
  }
  verifyCode(code: string): Observable<boolean> {
    return this.httpclient.post<boolean>(`${this.API_URL}/verify-code`, {
      code: code,
    });
  }

  logout() {
    localStorage.removeItem('accessToken');
  }
}
