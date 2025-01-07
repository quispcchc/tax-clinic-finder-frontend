import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {

  @Output() filterChange = new EventEmitter<{ [key: string]: any }>();

  filters: {
    pincode?: string;
    language?: string;
    years?: number;
    province?: string;
    type?: string;
    territory?: string;
  } = {
    pincode: '',
    language: '',
    years: 0,
    province: '',
    type: '',
    territory: ''
  };

  constructor() {}

  applyFilters() {
    this.filterChange.emit(this.filters);
  }
}
