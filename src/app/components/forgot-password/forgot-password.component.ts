import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  message: string | null = null;
  isSuccess: boolean = false;
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.resetPasswordForm.get('email');
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.authService.requestPasswordReset(this.resetPasswordForm.value.email).subscribe(response => {
        this.message = response.success ? 'Reset link sent to your email!' : 'Failed to send reset link.';
        this.isSuccess = response.success;
      });
    }
  }
}
