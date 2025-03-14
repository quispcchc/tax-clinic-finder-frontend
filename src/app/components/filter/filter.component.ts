import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<{ filters: any, isNewClient: boolean }>();
  @Input() language!: string;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Input() isSidebarOpen: boolean = false;
  @Input() isNewClient: boolean = false;
  @Output() isNewClientChange = new EventEmitter<boolean>();
  isPostalCodeValid: boolean = true;

  filters: {
    postalCodesServe?: string;
    serviceDeliveryModes: {
      inPerson?: boolean;
      virtual?: boolean;
      byAppointment?: boolean;
      walkIn?: boolean;
      dropOff?: boolean;
    };
    wheelchairAccessible?: string;
    supportedTaxYears?: string;
    provinces?: string;
    otherProvince?: string,
    specialTaxCases: {
      rentalIncome?: boolean;
      selfEmployment?: boolean;
      incomeOver?: boolean;
      deceasedPerson?: boolean;
      employmentExpenses?: boolean;
      capitalGains?: boolean;
      largerIncome?: boolean;
      other?:boolean;
      otherSpecialTaxCases?: string;
    };
    languageOptions: {
      french?: boolean;
      english?: boolean;
      arabic?: boolean;
      other?: boolean;
      otherLanguage?: string;
    };
    clientCategories: {
      newcomers?: boolean;
      students?: boolean;
      indigenousClients?: boolean;
      seniors?: boolean;
      disabilities?: boolean;
      languageSpecific?: boolean;
      other?: boolean;
      otherClientCategory?: string;
    };
    serviceDays: {
      weekdays?: boolean;
      weekends?: boolean;
    };
    serviceHours: {
      daytime?: boolean;
      evening?: boolean;
    };
  } = {
    postalCodesServe: '',
    serviceDeliveryModes: {
      inPerson: false,
      virtual: false,
      byAppointment: false,
      walkIn: false,
      dropOff: false,
    },
    wheelchairAccessible: '',
    supportedTaxYears: '',
    provinces: '',
    otherProvince: '',
    specialTaxCases: {
      rentalIncome: false,
      selfEmployment: false,
      incomeOver: false,
      deceasedPerson: false,
      employmentExpenses: false,
      capitalGains: false,
      largerIncome: false,
      other: false,
      otherSpecialTaxCases: '',
    },
    languageOptions: {
      french: false,
      english: false,
      arabic: false,
      other: false,
      otherLanguage: '',
    },
    clientCategories: {
      newcomers: false,
      students: false,
      indigenousClients: false,
      seniors: false,
      disabilities: false,
      languageSpecific: false,
      other: false,
      otherClientCategory: ''
    },
    serviceDays: {
      weekdays: false,
      weekends: false,
    },
    serviceHours: {
      daytime: false,
      evening: false,
    },
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isNewClient']) {
      this.isNewClient = changes['isNewClient'].currentValue;
    }
  }

  validatePostalCode(postalCode: string): boolean {
    return postalCode.length === 6;
  }

  onPostalCodeChange(postalCode: string | undefined) {
    const code = postalCode || '';
    this.isPostalCodeValid = this.validatePostalCode(code);
  }

  applyFilters() {
    if (!this.isPostalCodeValid) {
      return;
    }
    this.toggleSidebarEvent.emit();
    this.filterChange.emit({
      filters: this.filters,
      isNewClient: this.isNewClient,
    });
  }

  resetFilters() {
    this.filters = {
      postalCodesServe: '',
      serviceDeliveryModes: {
        inPerson: false,
        virtual: false,
        byAppointment: false,
        walkIn: false,
        dropOff: false,
      },
      wheelchairAccessible: '',
      supportedTaxYears: '',
      provinces: '',
      otherProvince: '',
      specialTaxCases: {
        rentalIncome: false,
        selfEmployment: false,
        incomeOver: false,
        deceasedPerson: false,
        employmentExpenses: false,
        capitalGains: false,
        largerIncome: false,
        other: false,
        otherSpecialTaxCases: '',
      },
      languageOptions: {
        french: false,
        english: false,
        arabic: false,
        other: false,
        otherLanguage: '',
      },
      clientCategories: {
        newcomers: false,
        students: false,
        indigenousClients: false,
        seniors: false,
        disabilities: false,
        languageSpecific: false,
        other: false,
        otherClientCategory: ''
      },
      serviceDays: {
        weekdays: false,
        weekends: false,
      },
      serviceHours: {
        daytime: false,
        evening: false,
      },
    };
    this.isPostalCodeValid = true;
    this.filterChange.emit({ filters: null, isNewClient: this.isNewClient });
  }

  onToggleChange() {
    this.isNewClientChange.emit(this.isNewClient);
  }

  onOtherLanguageToggle() {
    if (!this.filters.languageOptions.other) {
      this.filters.languageOptions.otherLanguage = '';
    }
  }

  onOtherSpecialTaxCasesToggle() {
    if (!this.filters.specialTaxCases.other) {
      this.filters.specialTaxCases.otherSpecialTaxCases = '';
    }
  }

  onClientCategoriesToggle() {
    if (!this.filters.clientCategories.other) {
      this.filters.clientCategories.otherClientCategory = '';
    }
  }

  onProvinceChange() {
    if (this.filters.provinces !== 'Other') {
      this.filters.otherProvince = '';
    }
  }

  onOtherProvinceInput() {
    if (this.filters.provinces !== 'Other') {
      this.filters.provinces = 'Other'; 
    }
  }

  closeFilterSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
