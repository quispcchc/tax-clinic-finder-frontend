import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clinic } from '../models/clinic.model';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  // private apiUrl = 'http://localhost:3000/api/clinics';

  // constructor(private http: HttpClient) {}

  // getFilteredClinics(filters: any): Observable<Clinic[]> {
  //   return this.http.post<Clinic[]>(`${this.apiUrl}/filter`, filters);
  // }

  private apiUrl = "http://localhost:3000/api/clinics"; // Update with your backend URL

  constructor(private http: HttpClient) {}

  getClinics(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
