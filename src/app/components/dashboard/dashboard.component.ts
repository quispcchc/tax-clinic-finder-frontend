import { Component } from '@angular/core';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  clinics: Clinic[] = [
    {
      id: 1,
      name: 'Clinic A',
      pincode: '12345',
      language: 'en',
      years: 5,
      province: 'Ontario',
      type: 'in-person',
      territory: 'North',
      lat: 40.73061,
      lng: -73.935242,
      contact: 1234567890,
      address: {
        street: '123 Main St',
        city: 'Ottawa',
        state: 'Ontario',
        country: 'Canada',
        postalCode: 'K1A 0B1'
      }
    },
    {
      id: 2,
      name: 'Clinic B',
      pincode: '67890',
      language: 'fr',
      years: 3,
      province: 'Quebec',
      type: 'virtual',
      territory: 'East',
      lat: 40.650002,
      lng: -73.949997,
      contact: 1234567890,
      address: {
        street: '123 Main St',
        city: 'Ottawa',
        state: 'Ontario',
        country: 'Canada',
        postalCode: 'K1A 0B1'
      }
    }
    // Add more clinics
  ];
  filteredClinics: Clinic[] = [...this.clinics];

  constructor() {}

  applyFilters(filters: { [key: string]: any }) {
    this.filteredClinics = this.clinics.filter((clinic) => {
      const matchesPincode = filters['pincode'] ? clinic.pincode.includes(filters['pincode']) : true;
      const matchesLanguage = filters['language'] ? clinic.language === filters['language'] : true;
      const matchesYears = filters['years'] ? clinic.years >= filters['years'] : true;
      const matchesProvince = filters['province'] ? clinic.province.toLowerCase().includes(filters['province'].toLowerCase()) : true;
      const matchesType = filters['type'] ? clinic.type === filters['type'] : true;
      const matchesTerritory = filters['territory'] ? clinic.territory.toLowerCase().includes(filters['territory'].toLowerCase()) : true;

      return (
        matchesPincode &&
        matchesLanguage &&
        matchesYears &&
        matchesProvince &&
        matchesType &&
        matchesTerritory
      );
    });
  }
}
