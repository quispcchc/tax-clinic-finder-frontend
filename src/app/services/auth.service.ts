import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { FormControl } from '@angular/forms';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.apiUrl;

  private loginUrl = `${this.API_URL}/auth/login`;
  private resetPasswordUrl = `${this.API_URL}/auth/reset-password`;
  private resetPasswordWithTokenUrl = `${this.API_URL}/auth/reset-password`;
  private changePasswordUrl = `${this.API_URL}/auth/change-password`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<{
        token: string;
        id: string;
        firstname: string;
        lastname: string;
        username: string;
        role: string;
        designation: string;
        email: string;
      }>(this.loginUrl, { email, password })
      .pipe(
        map((response) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem(
              'userProfile',
              JSON.stringify({
                username: response.username,
                firstname: response.firstname,
                lastname: response.lastname,
                userEmail: response.email,
                userRole: response.role,
                userDesignation: response.designation,
                userId: response.id,
              })
            );
            localStorage.setItem('userRole', response.role);
            localStorage.setItem('userEmail', response.email);
          }
          return true;
        }),
        catchError(() => of(false))
      );
  }

  changePassword(
    userId: any,
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(
      `${this.changePasswordUrl}/${userId}`,
      {
        currentPassword,
        newPassword,
      },
      { headers }
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  requestPasswordReset(email: string): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(this.resetPasswordUrl, { email })
      .pipe(catchError(() => of({ success: false })));
  }

  resetPasswordWithToken(
    token: string,
    newPassword: string
  ): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.resetPasswordWithTokenUrl}/${token}`, {
        password: newPassword,
      })
      .pipe(catchError(() => of({ message: 'Failed to reset password' })));
  }

  passwordValidator(control: FormControl) {
    const passwordInput = control?.value;
    const errorObj = {
      pattern: {
        invalid: false,
        special: false,
        uppercase: false,
        lowercase: false,
        number: false,
      },
    };

    if (passwordInput?.length >= 6) {
      let pattern = /[$@$!%*#?&]/;

      if (!pattern.test(passwordInput)) {
        errorObj.pattern.invalid = true;
        errorObj.pattern.special = true;
      }

      pattern = /[A-Z]/;

      if (!pattern.test(passwordInput)) {
        errorObj.pattern.invalid = true;
        errorObj.pattern.uppercase = true;
      }

      pattern = /[a-z]/;

      if (!pattern.test(passwordInput)) {
        errorObj.pattern.invalid = true;
        errorObj.pattern.lowercase = true;
      }

      pattern = /[0-9]/;

      if (!pattern.test(passwordInput)) {
        errorObj.pattern.invalid = true;
        errorObj.pattern.number = true;
      }
    }

    if (errorObj.pattern.invalid === false) return null;
    return errorObj;
  }
}
