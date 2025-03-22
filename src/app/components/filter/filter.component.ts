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
    lowIncome?: string;
    postalCodesServe?: string;
    serviceDeliveryModes: {
      inPerson?: boolean;
      virtual?: boolean;
      byAppointment?: boolean;
      walkIn?: boolean;
      dropOff?: boolean;
    };
    wheelchairAccessible?: boolean;
    supportedTaxYears?: string;
    provinces: {
      ontario?: boolean;
      quebec?: boolean;
      anyOtherProvince?: boolean;
    };
    otherProvince?: string,
    specialTaxCases: {
      rentalIncome?: boolean;
      selfEmployment?: boolean;
      incomeOver?: boolean;
      deceasedPerson?: boolean;
      employmentExpenses?: boolean;
      capitalGains?: boolean;
      largerIncome?: boolean;
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
      lgbtq?: boolean;
      ruralPopulation?: boolean;
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
    lowIncome: '',
    postalCodesServe: '',
    serviceDeliveryModes: {
      inPerson: false,
      virtual: false,
      byAppointment: false,
      walkIn: false,
      dropOff: false,
    },
    wheelchairAccessible: false,
    supportedTaxYears: '',
    provinces: {
      ontario: false,
      quebec: false,
      anyOtherProvince: false
    },
    specialTaxCases: {
      rentalIncome: false,
      selfEmployment: false,
      incomeOver: false,
      deceasedPerson: false,
      employmentExpenses: false,
      capitalGains: false,
      largerIncome: false
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
      lgbtq: false,
      ruralPopulation: false
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
      lowIncome: '',
      postalCodesServe: '',
      serviceDeliveryModes: {
        inPerson: false,
        virtual: false,
        byAppointment: false,
        walkIn: false,
        dropOff: false,
      },
      wheelchairAccessible: false,
      supportedTaxYears: '',
      provinces: {
        ontario: false,
        quebec: false,
        anyOtherProvince: false
      },
      specialTaxCases: {
        rentalIncome: false,
        selfEmployment: false,
        incomeOver: false,
        deceasedPerson: false,
        employmentExpenses: false,
        capitalGains: false,
        largerIncome: false
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
        lgbtq: false,
        ruralPopulation: false
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

  closeFilterSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
