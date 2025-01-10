import { Component } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { AuthService } from '../../services/auth.service';

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
      name: 'Carlington Community Health Centre',
      pincode: 'K1Z 5Z8',
      language: 'en',
      years: 5,
      province: 'Ontario',
      type: 'in-person',
      territory: 'North',
      lat: 45.3936,
      lng: -75.7446,
      contact: 613-722-4000,
      address: {
        street: '900 Merivale Rd',
        city: 'Ottawa',
        state: 'Ontario',
        country: 'Canada',
        postalCode: 'K1Z 5Z8'
      }
    },
    {
      id: 2,
      name: 'Centretown Community Health Centre',
      pincode: 'K2P 2N6',
      language: 'fr',
      years: 3,
      province: 'Quebec',
      type: 'virtual',
      territory: 'East',
      lat: 45.4134,
      lng: -75.6939,
      contact: 1234567890,
      address: {
        street: '420 Cooper St',
        city: 'Ottawa',
        state: 'Ontario',
        country: 'Canada',
        postalCode: 'K2P 2N6'
      }
    },
    {
      id: 3,
      name: 'NROCRC Community Resource Centre',
      pincode: 'K2G 4V3',
      language: 'fr',
      years: 3,
      province: 'Quebec',
      type: 'virtual',
      territory: 'East',
      lat: 45.4134,
      lng: -75.6939,
      contact: 613-596-5626,
      address: {
        street: '1547 Merivale Rd',
        city: 'Ottawa',
        state: 'Ontario',
        country: 'Canada',
        postalCode: 'K2G 4V3'
      }
    }
    // Add more clinics
  ];
  filteredClinics: Clinic[] = [...this.clinics];

  constructor(private authService: AuthService) {}

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

  logout():void {
    this.authService.logout();
  }
}
