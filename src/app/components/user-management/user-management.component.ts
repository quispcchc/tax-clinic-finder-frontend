import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../../services/clinic.service';
import { User } from '../../models/user.model';
import { UserCreate } from '../../models/user-create.modal';

@Component({
  selector: 'app-user-management',
  standalone: false,

  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';

  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedUser: User = { id: 0, firstname: '', lastname: '', username: '', email: '', designation: '', role: '', password: '' };

  constructor(private clinicService: ClinicService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.clinicService.getUsers().subscribe(
      (data: any[]) => {
        this.users = data.map((user) => ({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          email: user.email,
          password: user.password,
          designation: user.designation,
          role: user.role,
        }));

        this.filteredUsers = [...this.users];
        console.log('the users details are....', this.filteredUsers);
      },
      (error) => {
        console.error('Failed to load Users:', error);
      }
    );
  }

  filterUsers() {
    this.filteredUsers = this.users.filter((user) =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  openAddUserModal() {
    this.selectedUser = {
      id: 0,
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      designation: '',
      role: '',
      password: '',
    };
    this.isEditMode = false;
    this.isModalOpen = true;
  }

  openEditUserModal(user: User) {
    this.selectedUser = { ...user };
    this.isEditMode = true;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = {
      id: 0,
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      designation: '',
      role: '',
      password: '',
    };
  }

  saveUser(user: User) {
    if (this.isEditMode) {
      this.clinicService.updateUser(user).subscribe(
        (updatedUser) => {
          this.users = this.users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
          this.filteredUsers = [...this.users];
          this.closeModal();
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    } else {
      const { ...userToCreate }: UserCreate = user;
      
      this.clinicService.addUser(userToCreate).subscribe(
        (newUser) => {
          this.users.push(newUser);
          this.filteredUsers = [...this.users];
          this.closeModal();
        },
        (error) => {
          console.error('Error adding user:', error);
        }
      );
    }
  }

  confirmDelete(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.clinicService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter((user) => user.id !== userId);
          this.filteredUsers = [...this.users];
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }
}
