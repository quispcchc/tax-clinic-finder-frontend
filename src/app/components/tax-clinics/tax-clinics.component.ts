import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-tax-clinics',
  standalone: false,
  templateUrl: './tax-clinics.component.html',
  styleUrl: './tax-clinics.component.scss',
})
export class TaxClinicsComponent {
  @Input() clinics: Clinic[] = [];
  @Input() language!: string;

  searchTerm: string = '';
  filteredClinics: Clinic[] = [];
  showModal: boolean = false;
  selectedClinic: Clinic | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clinics'] && changes['clinics'].currentValue) {
      
      this.sortClinics();
      this.filterClinics();
    }
  }

  sortClinics() {
    this.clinics.sort((a, b) => {
      if (
        a.appointmentAvailability === 'Yes' &&
        b.appointmentAvailability !== 'Yes'
      ) {
        return -1;
      } else if (
        b.appointmentAvailability === 'Yes' &&
        a.appointmentAvailability !== 'Yes'
      ) {
        return 1;
      }
      return 0;
    });
    this.filteredClinics = [...this.clinics];
  }

  filterClinics(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredClinics = this.clinics.filter((clinic) =>
      clinic.organizationName.toLowerCase().includes(term)
    );
  }

  openModal(clinic: Clinic): void {
    this.selectedClinic = clinic;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedClinic = undefined;
  }

  getDotColor(appointmentAvailability: string): string {
    switch (appointmentAvailability) {
      case 'Yes':
        return 'green';
      case 'No':
        return 'red';
      case 'Not Sure':
        return 'orange';
      default:
        return 'gray';
    }
  }
}
