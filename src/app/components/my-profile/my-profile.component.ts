import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-profile',
  standalone: false,

  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit {
  userProfile: any = {};
  currentLanguage: string;
  isChangePassword = false;
  passwordForm!: FormGroup;
  passwordError: string = '';
  userInitials: string = '';
  showPassword: boolean = false;

  passwordVisibility = {
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  };

  popupMessage: string = '';
  popupVisible: boolean = false;
  popupType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    private authService: AuthService
  ) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  ngOnInit(): void {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      this.userProfile = JSON.parse(storedProfile);
    }

    this.setUserInitials();

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.authService.passwordValidator.bind(this),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMismatchValidator() }
    );
  }

  setUserInitials() {
    const firstName = this.userProfile.firstname || '';
    const lastName = this.userProfile.lastname || '';
    this.userInitials = (
      firstName.charAt(0) + lastName.charAt(0)
    ).toUpperCase();
  }

  toggleChangePassword(): void {
    this.isChangePassword = !this.isChangePassword;
    this.passwordError = '';
    this.passwordForm.reset();
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordError = 'Please fill out all fields correctly.';
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.passwordError = 'Passwords do not match!';
      return;
    }

    this.authService.changePassword(this.userProfile.userId, currentPassword, newPassword).subscribe(
      () => {
        this.passwordError = '';
        this.isChangePassword = !this.isChangePassword;
        this.showPopup('Password Changed successfully!', 'success');
      },
      (error) => {
        this.passwordError = error?.error?.message || 'Error changing password.';
      }
    );
  }

  passwordMismatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('newPassword');
      const confirmPassword = control.get('confirmPassword');
  
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  togglePasswordVisibility(field: 'currentPassword' | 'newPassword' | 'confirmPassword'): void {
    this.passwordVisibility[field] = !this.passwordVisibility[field];
  }

  logout(): void {
    this.authService.logout();
  }

  showPopup(message: string, type: 'success' | 'error') {
    this.popupMessage = message;
    this.popupType = type;
    this.popupVisible = true;
  }

  closePopup() {
    this.popupVisible = false;
  }
}
