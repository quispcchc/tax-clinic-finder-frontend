import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm!: FormGroup;
    errorMessage: string | null = null;

    constructor(private fb: FormBuilder,
        private authService: AuthService,
        private router: Router) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6),
                this.authService.passwordValidator.bind(this)
            ]]
        });

        this.loginForm.get('email')?.valueChanges.subscribe(() => {
            this.clearError();
        });

        this.loginForm.get('password')?.valueChanges.subscribe(() => {
            this.clearError();
        });
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;

            this.authService.login(email, password).subscribe(success => {
                if (success) {
                    this.router.navigate(['/filter']);
                    this.loginForm.reset();
                } else {
                    this.errorMessage = 'Invalid email or password';
                }
            });
        }
    }

    clearError() {
        this.errorMessage = null;
    }

    resetPassword() {
        this.router.navigate(['/forgot-password']);
    }
}
