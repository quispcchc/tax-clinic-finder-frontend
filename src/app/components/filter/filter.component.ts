import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<{ [key: string]: any }>();
  @Input() language!: string;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Input() isSidebarOpen: boolean = false;

  filters: {
    appointmentAvailability?: string;
    supportedTaxYears?: string;
    pincode?: string;
    language?: string;
    years?: number;
    province?: string;
    type?: string;
  } = {
    appointmentAvailability: '',
    supportedTaxYears: '',
    pincode: '',
    language: '',
    years: 0,
    province: '',
    type: '',
  };

  constructor() {}

  applyFilters() {
    this.filterChange.emit(this.filters);
  }

  closeFilterSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
