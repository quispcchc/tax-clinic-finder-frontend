import { Component } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ClinicService } from '../../services/clinic.service';

@Component({
  selector: 'app-export-client-data',
  standalone: false,

  templateUrl: './export-client-data.component.html',
  styleUrl: './export-client-data.component.scss',
})
export class ExportClientDataComponent {
  currentLanguage: string;
  exportType: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  isFormValid: boolean = false;

  popupMessage: string = '';
  popupVisible: boolean = false;
  popupType: 'success' | 'error' = 'success';

  constructor(
    private languageService: LanguageService,
    private clinicService: ClinicService
  ) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  validateForm(): void {
    if (this.exportType === 'byDate') {
      this.isFormValid = !!(this.startDate && this.endDate);
    } else if (this.exportType === 'all') {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    }
  }

  exportData(): void {
    if (!this.isFormValid) return;

    const start = this.startDate || undefined;
    const end = this.endDate || undefined;

    this.clinicService.exportClinicData(this.exportType!, start, end).subscribe(
      (data) => {
        if (data.length > 0) {
          this.downloadCSV(data);
        } else {
          alert('No data found for the selected range.');
          this.showPopup('No data found for the selected range.', 'error');
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.showPopup(error.error.message, 'error');
      }
    );
  }

  downloadCSV(data: any[]): void {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clinic_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  convertToCSV(data: any[]): string {
    if (!data.length) return '';

    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map((row) => Object.values(row).join(',')).join('\n');
    return header + rows;
  }

  clearForm(): void {
    this.exportType = null;
    this.startDate = null;
    this.endDate = null;
    this.isFormValid = false;
  }

  showPopup(message: string, type: 'success' | 'error') {
    this.popupMessage = message;
    this.popupType = type;
    this.popupVisible = true;
  }

  closePopup() {
    this.popupVisible = false;
  }
}
