import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-clinic-list',
  standalone: false,
  templateUrl: './clinic-list.component.html',
  styleUrls: ['./clinic-list.component.scss'],
})
export class ClinicListComponent implements OnInit {
  @Input() clinics: Clinic[] = [];
  @Input() language!: string;
  @Input() isSidebarOpen: boolean = true;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() clinicSelected = new EventEmitter<Clinic>();
  @Output() assignClinic = new EventEmitter<Clinic>();
  @Output() unassignClinic = new EventEmitter<Clinic>();
  @Input() isNewClient: boolean = false;

  showModal: boolean = false;
  selectedClinic: Clinic | undefined;
  filteredClinics: Clinic[] = [];

  ngOnInit() {
    this.sortClinics();
  }

  ngOnChanges() {
    this.sortClinics();
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

  toggleFilterSidebar() {
    this.toggleSidebarEvent.emit();
  }

  openModal(clinic: Clinic): void {
    this.selectedClinic = clinic;
    this.showModal = true;
    this.clinicSelected.emit(clinic);
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedClinic = undefined;
  }

  onAssignClinic(clinic: Clinic) {
    this.assignClinic.emit(clinic);
    this.closeModal();
  }

  onUnassignClinic(clinic: Clinic) {
    this.unassignClinic.emit(clinic);
    this.closeModal();
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
