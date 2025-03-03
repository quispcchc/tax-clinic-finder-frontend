import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,

  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  message: string | null = null;
  isSuccess: boolean = false;
  loginForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.resetPasswordForm.get('email');
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.authService
        .requestPasswordReset(this.resetPasswordForm.value.email)
        .subscribe(
          (response) => {
            if (response.success) {
              this.successMessage = response.message || 'RESET_PASSWORD_SUCCESS';
              this.errorMessage = '';
              this.isSuccess = true;
            } else {
              this.errorMessage = response.message || 'RESET_PASSWORD_FAILURE';
              this.successMessage = '';
              this.isSuccess = false;
            }
          },
          (error) => {
            this.errorMessage = 'ERROR_PROCESSING_REQUEST';
            this.successMessage = '';
            this.isSuccess = false;
          }
        );
    }
  }
}
