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
    const priority: Record<string, number> = { 'Yes': 1, 'No': 2, 'Might be available soon': 3 };
  
    this.clinics.sort((a, b) => {
      const priorityA = priority[a.appointmentAvailability] ?? 4;
      const priorityB = priority[b.appointmentAvailability] ?? 4;
  
      return priorityA - priorityB;
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
      case 'Might be available soon':
        return 'orange';
      default:
        return 'gray';
    }
  }
}
