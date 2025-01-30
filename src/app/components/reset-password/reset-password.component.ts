import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token: string | null = null;
  message: string | null = null;
  isSuccess: boolean = false;
  isPasswordUpdated: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.authService.passwordValidator.bind(this),
        ],
      ],
    });

    this.route.paramMap.subscribe((params) => {
      this.token = params.get('token');
    });
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token) {
      this.authService
        .resetPasswordWithToken(
          this.token,
          this.resetPasswordForm.value.password
        )
        .subscribe(
          (response) => {
            this.message = response.message;
            this.isSuccess = this.message === 'Password has been reset';
            this.isPasswordUpdated = this.isSuccess;
          },
          (error) => {
            this.message = 'An error occurred while resetting the password.';
            this.isSuccess = false;
          }
        );
    }
  }

  returnToLogin = () => {
    this.router.navigateByUrl('/login');
  };
}
