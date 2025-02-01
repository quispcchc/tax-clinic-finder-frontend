import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../../services/clinic.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: false,
  
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit{

  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';
  
  constructor(private clinicService: ClinicService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.clinicService.getUsers().subscribe(
      (data: any[]) => {
        this.users = data.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password,
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
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
