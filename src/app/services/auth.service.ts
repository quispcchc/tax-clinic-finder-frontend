import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { FormControl } from '@angular/forms';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = environment.apiUrl;

  private loginUrl = `${this.API_URL}/login`; 
  private resetPasswordUrl = `${this.API_URL}/reset-password`;
  private resetPasswordWithTokenUrl = `${this.API_URL}/reset-password`;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string, userName: string, userRole: string, userEmail: string }>(this.loginUrl, { email, password })
      .pipe(
        map(response => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('first_name', response.userName);
            localStorage.setItem('role', response.userRole);
            localStorage.setItem('email', response.userEmail);
          }
          return true;
        }),
        catchError(() => of(false))
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('first_name');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      localStorage.removeItem('accessible_tabs');
      localStorage.removeItem('accessible_forms');
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  // Request password reset link
  requestPasswordReset(email: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(this.resetPasswordUrl, { email })
      .pipe(
        catchError(() => of({ success: false }))
      );
  }

  // Reset password with the provided token
  resetPasswordWithToken(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.resetPasswordWithTokenUrl}/${token}`, { password: newPassword })
      .pipe(
        catchError(() => of({ message: 'Failed to reset password' }))
      );
  }

  // Validate password
  passwordValidator(control: FormControl) {
    const passwordInput = control?.value;
    const errorObj = { 
      pattern: { 
        invalid: false,
        special: false,
        uppercase: false,
        lowercase: false,
        number: false 
      }
    };

    if (passwordInput?.length >= 6) {

      let pattern = /[$@$!%*#?&]/;

      if (!pattern.test(passwordInput)) {
        errorObj.pattern.invalid = true;
        errorObj.pattern.special = true;
      };

      pattern = /[A-Z]/;

      if (!pattern.test(passwordInput)) {
        errorObj.pattern.invalid = true;
        errorObj.pattern.uppercase = true;
      };

      pattern = /[a-z]/;

      if (!pattern.test(passwordInput)) {
        errorObj.pattern.invalid = true;
        errorObj.pattern.lowercase = true;
      };

      pattern = /[0-9]/;

      if (!pattern.test(passwordInput)) {
        errorObj.pattern.invalid = true;
        errorObj.pattern.number = true;
      };

    }

    if (errorObj.pattern.invalid === false) return null;
    return errorObj;
  }

}