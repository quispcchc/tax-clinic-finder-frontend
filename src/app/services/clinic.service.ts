import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clinic } from '../models/clinic.model';
import { User } from '../models/user.model';
import { UserCreate } from '../models/user-create.modal';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  private apiUrl = 'http://localhost:3000/api/tax-clinics';

  constructor(private http: HttpClient) {}

  getTaxClinics(): Observable<Clinic[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Clinic[]>(this.apiUrl, { headers });
  }

  updateAppointmentAvailability(data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(`${this.apiUrl}/${data.id}`, data, { headers });
  }

  getUsers(): Observable<User[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }

  addUser(user: UserCreate): Observable<User> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<User>(`${this.apiUrl}/create-user`, user, { headers });
  }

  updateUser(user: User): Observable<User> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user, { headers });
  }

  deleteUser(userId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`, { headers });
  }
}
