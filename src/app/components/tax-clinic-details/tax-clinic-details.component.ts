import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-tax-clinic-details',
  standalone: false,
  
  templateUrl: './tax-clinic-details.component.html',
  styleUrl: './tax-clinic-details.component.scss'
})
export class TaxClinicDetailsComponent {
  @Input() clinic: Clinic | undefined;
  @Output() closeModal = new EventEmitter<void>();

  close(): void {
    this.closeModal.emit();
  }
}
