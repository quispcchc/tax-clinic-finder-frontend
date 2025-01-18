import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isPasswordVisible: boolean = false;
  currentLanguage: string = 'en';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    if (storedEmail && storedPassword) {
      this.loginForm.patchValue({
        email: storedEmail,
        password: storedPassword,
        rememberMe: true,
      });
    }

    this.loginForm.valueChanges.subscribe(() => this.clearError());
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;

      this.authService.login(email, password).subscribe(
        (success) => {
          if (success) {
            if (rememberMe) {
              localStorage.setItem('email', email);
              localStorage.setItem('password', password);
            } else {
              localStorage.removeItem('email');
              localStorage.removeItem('password');
            }

            this.router.navigate(['/dashboard']);
            this.loginForm.reset();
          } else {
            this.errorMessage = 'Invalid email or password';
          }
        },
        (error) => {
          this.errorMessage = error?.message || 'An unexpected error occurred';
        }
      );
    }
  }

  clearError(): void {
    this.errorMessage = null;
  }

  resetPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  switchLanguage(language: string): void {
    this.languageService.setLanguage(language);
  }
}
