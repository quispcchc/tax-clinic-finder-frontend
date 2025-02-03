import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { User } from '../../models/user.model';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-user-modal',
  standalone: false,

  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss',
})
export class UserModalComponent {
  @Input() isOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  userForm: FormGroup;

  formFields: {
    label: string;
    key: keyof User;
    type: string;
    placeholder: string;
  }[] = [
    {
      label: 'First Name',
      key: 'firstname',
      type: 'text',
      placeholder: 'Enter First Name',
    },
    {
      label: 'Last Name',
      key: 'lastname',
      type: 'text',
      placeholder: 'Enter Last Name',
    },
    {
      label: 'User Name',
      key: 'username',
      type: 'text',
      placeholder: 'Enter User Name',
    },
    { label: 'Email', key: 'email', type: 'email', placeholder: 'Enter Email' },
    {
      label: 'Designation',
      key: 'designation',
      type: 'text',
      placeholder: 'Enter Designation',
    },
    { label: 'Role', key: 'role', type: 'text', placeholder: 'Select Role' },
  ];

  constructor(private fb: FormBuilder) {
    this.userForm = this.createForm();
  }

  createForm(): FormGroup {
    const formGroup = this.fb.group({
      id: [this.user?.id || ''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      designation: ['', Validators.required],
      role: ['', Validators.required],
      password: [
        '',
        this.isEditMode ? null : [Validators.required, this.passwordValidator()],
      ],
    });

    return formGroup;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.userForm.patchValue(this.user);
    }

    if (this.isEditMode) {
      // Remove password field in edit mode
      this.formFields = this.formFields.filter(
        (field) => field.key !== 'password'
      );
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      // Add password field in add mode
      if (!this.formFields.some((field) => field.key === 'password')) {
        this.formFields.push({
          label: 'Password',
          key: 'password',
          type: 'password',
          placeholder: 'Enter Password',
        });
      }
      this.userForm
        .get('password')
        ?.setValidators([Validators.required, this.passwordValidator()]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordInput = control?.value;

      if (!passwordInput) return null;

      const errorObj: any = {
        pattern: {
          invalid: false,
          special: false,
          uppercase: false,
          lowercase: false,
          number: false,
        },
      };

      if (passwordInput.length >= 6) {
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordInput))
          errorObj.pattern.special = true;
        if (!/[A-Z]/.test(passwordInput)) errorObj.pattern.uppercase = true;
        if (!/[a-z]/.test(passwordInput)) errorObj.pattern.lowercase = true;
        if (!/[0-9]/.test(passwordInput)) errorObj.pattern.number = true;

        errorObj.pattern.invalid =
          errorObj.pattern.special ||
          errorObj.pattern.uppercase ||
          errorObj.pattern.lowercase ||
          errorObj.pattern.number;
      }

      return errorObj.pattern.invalid ? errorObj : null;
    };
  }

  onSave() {
    if (this.userForm.valid) {
      const formValue = this.isEditMode
        ? this.userForm.value
        : { ...this.userForm.value, id: undefined };

      this.save.emit(formValue);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
