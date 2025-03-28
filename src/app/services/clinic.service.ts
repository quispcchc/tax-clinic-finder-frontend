import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clinic } from '../models/clinic.model';
import { User } from '../models/user.model';
import { UserCreate } from '../models/user-create.modal';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  private API_URL = environment.apiUrl;
  private apiUrl = `${this.API_URL}`;

  constructor(private http: HttpClient) {}

  getTaxClinics(): Observable<Clinic[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Clinic[]>(`${this.apiUrl}/tax-clinics`, { headers });
  }

  updateAppointmentAvailability(data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(`${this.apiUrl}/update-availability/${data.id}`, data, { headers });
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

  addTaxClinic(clinic: Clinic): Observable<Clinic> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<Clinic>(`${this.apiUrl}/create-clinic`, clinic, { headers });
  }

  updateTaxClinic(id: number, clinic: Clinic): Observable<Clinic> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<Clinic>(`${this.apiUrl}/${id}`, clinic, { headers });
  }

  deleteTaxClinic(clinicId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.apiUrl}/${clinicId}`, { headers });
  }

  saveFilteredData(filterData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.post<any>(`${this.apiUrl}/save-filters`, filterData, { headers });
  }

  updateFilteredData(id: any, filterData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put<any>(`${this.apiUrl}/update-filters/${id}`, filterData, { headers });
  }

  exportClinicData(exportType: string, startDate?: string, endDate?: string): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    let params: any = { exportType };
    if (exportType === 'byDate' && startDate && endDate) {
      params = { ...params, startDate, endDate };
    }
  
    return this.http.get<any[]>(`${this.apiUrl}/export-logs`, { headers, params });
  }
  
}
