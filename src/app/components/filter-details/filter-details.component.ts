import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-details',
  standalone: false,
  
  templateUrl: './filter-details.component.html',
  styleUrl: './filter-details.component.scss'
})
export class FilterDetailsComponent {
  @Input() currentFilters: any; 
  @Input() isNewClient: boolean = false;
  @Input() isSidebarOpen: boolean = true;
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(private translateService: TranslateService) {}

  toggleFilterSidebar() {
    this.toggleSidebarEvent.emit();
  }

  hasSelectedTaxCases(): boolean {
    const cases = this.currentFilters?.specialTaxCases;
    return cases?.rentalIncome || cases?.selfEmployment || cases?.incomeOver || 
           cases?.deceasedPerson || cases?.employmentExpenses || cases?.capitalGains || 
           cases?.largerIncome;
  }

  getSelectedTaxCases(): string {
    const cases = [];
    const taxCases = this.currentFilters?.specialTaxCases;
    if (taxCases?.rentalIncome) cases.push('FILTERS.RENTAL_INCOME');
    if (taxCases?.selfEmployment) cases.push('FILTERS.SELF_EMPLOYMENT');
    if (taxCases?.incomeOver) cases.push('FILTERS.INCOME_OVER');
    if (taxCases?.deceasedPerson) cases.push('FILTERS.DECEASED_PERSON');
    if (taxCases?.employmentExpenses) cases.push('FILTERS.EMPLOYMENT_EXPENSES');
    if (taxCases?.capitalGains) cases.push('FILTERS.CAPITAL_GAINS');
    if (taxCases?.largerIncome) cases.push('FILTERS.LARGER_INCOME');
    return cases.map(key => this.translateService.instant(key)).join(', ');
  }

  hasSelectedProvinces(): boolean {
    return this.currentFilters?.provinces?.ontario || 
           this.currentFilters?.provinces?.quebec || 
           this.currentFilters?.provinces?.anyOtherProvince;
  }

  getSelectedProvinces(): string {
    const provinces = [];
    if (this.currentFilters?.provinces?.ontario) provinces.push('FILTERS.ONTARIO');
    if (this.currentFilters?.provinces?.quebec) provinces.push('FILTERS.QUEBEC');
    if (this.currentFilters?.provinces?.anyOtherProvince) provinces.push('FILTERS.OTHER_PROVINCES');
    return provinces.map(key => this.translateService.instant(key)).join(', ');
  }

  hasSelectedServiceDeliveryModes(): boolean {
    return this.currentFilters?.serviceDeliveryModes?.inPerson || 
           this.currentFilters?.serviceDeliveryModes?.virtual || 
           this.currentFilters?.serviceDeliveryModes?.dropOff;
  }

  getServiceDeliveryModes(): string {
    const modes = [];
    if (this.currentFilters?.serviceDeliveryModes?.inPerson) modes.push('FILTERS.IN_PERSON');
    if (this.currentFilters?.serviceDeliveryModes?.virtual) modes.push('FILTERS.VIRTUAL');
    if (this.currentFilters?.serviceDeliveryModes?.dropOff) modes.push('FILTERS.DROP_OFF');
    return modes.map(key => this.translateService.instant(key)).join(', ');
  }

  hasSelectedModeOfService(): boolean {
    return this.currentFilters?.modeOfService?.byAppointment || 
           this.currentFilters?.modeOfService?.walkIn;
  }

  getModeOfService(): string {
    const modes = [];
    if (this.currentFilters?.modeOfService?.byAppointment) modes.push('FILTERS.BY_APPOINTMENT');
    if (this.currentFilters?.modeOfService?.walkIn) modes.push('FILTERS.WALK_IN');
    return modes.map(key => this.translateService.instant(key)).join(', ');
  }

  hasSelectedServiceHours(): boolean {
    return this.currentFilters?.serviceHours?.daytime || 
           this.currentFilters?.serviceHours?.evening;
  }

  getSelectedServiceHours(): string {
    const hours = [];
    if (this.currentFilters?.serviceHours?.daytime) hours.push('FILTERS.DAYTIME');
    if (this.currentFilters?.serviceHours?.evening) hours.push('FILTERS.EVENING');
    return hours.map(key => this.translateService.instant(key)).join(', ');
  }

  hasSelectedServiceDays(): boolean {
    return this.currentFilters?.serviceDays?.weekdays || 
           this.currentFilters?.serviceDays?.weekends;
  }

  getSelectedServiceDays(): string {
    const days = [];
    if (this.currentFilters?.serviceDays?.weekdays) days.push('FILTERS.WEEKDAYS');
    if (this.currentFilters?.serviceDays?.weekends) days.push('FILTERS.WEEKENDS');
    return days.map(key => this.translateService.instant(key)).join(', ');
  }

  hasSelectedLanguages(): boolean {
    const langs = this.currentFilters?.languageOptions;
    return langs?.french || langs?.english || langs?.arabic || langs?.other;
  }

  getSelectedLanguages(): string {
    const languages = [];
    const langs = this.currentFilters?.languageOptions;
    if (langs?.french) languages.push('FILTERS.FRENCH');
    if (langs?.english) languages.push('FILTERS.ENGLISH');
    if (langs?.arabic) languages.push('FILTERS.ARABIC');
    if (langs?.other && langs?.otherLanguage) languages.push(langs.otherLanguage);
    return languages.map(key => this.translateService.instant(key)).join(', ');
  }

  hasSelectedClientCategories(): boolean {
    const cats = this.currentFilters?.clientCategories;
    return cats?.newcomers || cats?.students || cats?.indigenousClients || 
           cats?.seniors || cats?.disabilities || cats?.lgbtq || cats?.ruralPopulation;
  }

  getSelectedClientCategories(): string {
    const categories = [];
    const cats = this.currentFilters?.clientCategories;
    if (cats?.newcomers) categories.push('FILTERS.NEWCOMERS');
    if (cats?.students) categories.push('FILTERS.STUDENTS');
    if (cats?.indigenousClients) categories.push('FILTERS.INDIGENOUS');
    if (cats?.seniors) categories.push('FILTERS.SENIORS');
    if (cats?.disabilities) categories.push('FILTERS.DISABILITIES');
    if (cats?.lgbtq) categories.push('FILTERS.2SLGBTQI+');
    if (cats?.ruralPopulation) categories.push('FILTERS.RURAL_POPULATION');
    return categories.map(key => this.translateService.instant(key)).join(', ');
  }
}
