
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

const TOKEN_KEY = 'accessToken'; 

/**
 * Functional Http Interceptor to add the Authorization token from localStorage
 * to outgoing requests.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,        
  next: HttpHandlerFn            
): Observable<HttpEvent<unknown>> => { 

  // 1. Get the token from localStorage
  const authToken = localStorage.getItem(TOKEN_KEY);

  // 2. Check if the token exists
  if (authToken) {
    // 3. Clone the request to add the new header.
    // Requests are immutable, so we must clone them.
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // 4. Pass the cloned request with the header to the next handler
    console.log('AuthInterceptor (functional): Added Authorization header', clonedReq.url); // Optional logging
    return next(clonedReq); // Call the next handler with the modified request

  } else {
    // 5. If no token, pass the original request without modification
    console.log('AuthInterceptor (functional): No token found, passing original request', req.url); // Optional logging
    return next(req); // Call the next handler with the original request
  }
};

