import { HttpEvent, HttpHandlerFn, HttpRequest, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('authToken') || '';

  // Clone the request and add the Authorization header if the token exists
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });

  // Pass the modified request to the next handler
  return next(clonedRequest);
};