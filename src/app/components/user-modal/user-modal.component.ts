import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-modal',
  standalone: false,

  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss',
})
export class UserModalComponent {
  @Input() isOpen: boolean = false;
  @Input() user: User = {
    id: 0,
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    designation: '',
    role: '',
    password: '',
  };
  @Input() isEditMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  formFields: { label: string; key: keyof User; type: string; placeholder: string }[] = [
    { label: 'First Name', key: 'firstname', type: 'text', placeholder: 'Enter First Name' },
    { label: 'Last Name', key: 'lastname', type: 'text', placeholder: 'Enter Last Name'  },
    { label: 'User Name', key: 'username', type: 'text', placeholder: 'Enter User Name'  },
    { label: 'Email', key: 'email', type: 'email', placeholder: 'Enter Email'  },
    { label: 'Designation', key: 'designation', type: 'text', placeholder: 'Enter Designation'  },
    { label: 'Role', key: 'role', type: 'text', placeholder: 'Enter Role'  },
    { label: 'Password', key: 'password', type: 'password', placeholder: 'Enter Password'  }
  ];

  onSave() {
    if (Object.values(this.user).every(field => 
      typeof field === 'string' ? field.trim() !== '' : field !== null && field !== undefined
    )) {
      this.save.emit(this.user);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
