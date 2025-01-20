import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-clinic-list',
  standalone: false,
  templateUrl: './clinic-list.component.html',
  styleUrls: ['./clinic-list.component.scss']
})
export class ClinicListComponent {

  @Input() clinics: Clinic[] = [];
  @Input() language!: string;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Input() isSidebarOpen: boolean = true;
  
  showModal: boolean = false;
  selectedClinic: Clinic | undefined;


  toggleFilterSidebar() {
    this.toggleSidebarEvent.emit();
  }

  openModal(clinic: Clinic): void {
    this.selectedClinic = clinic;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedClinic = undefined;
  }
}
