import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  /**
   * Decodes a JWT token
   * @param token The JWT token to decode
   * @returns The decoded token or null if invalid
   */
  decodeToken(token: string): any {
    if (!token) {
      return null;
    }

    try {
      // JWT token is split into three parts: header.payload.signature
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  /**
   * Checks if the current user has the admin role
   * @returns boolean indicating if user is admin
   */
  isAdmin(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return false;
    }

    const decodedToken = this.decodeToken(token);
    if (!decodedToken) {
      return false;
    }

    return (
      decodedToken.roles &&
      Array.isArray(decodedToken.roles) &&
      decodedToken.roles.includes('ROLE_ADMIN')
    );
  }

  /**
   * Gets the current user email from the JWT token
   * @returns The user email or null if not available
   */
  getUserEmail(): string | null {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return null;
    }

    const decodedToken = this.decodeToken(token);
    return decodedToken?.sub || null;
  }

  /**
   * Checks if the token is expired
   * @returns boolean indicating if token is expired
   */
  isTokenExpired(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return true;
    }

    const decodedToken = this.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }

    // exp is in seconds, Date.now() is in milliseconds
    return decodedToken.exp * 1000 < Date.now();
  }
}
