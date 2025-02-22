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
  isPostalCodeValid: boolean = true;

  filters: {
    appointmentType?: string;
    postalCodesServe?: string;
    serviceDeliveryModes: {
      inPerson?: boolean;
      virtual?: boolean;
      byAppointment?: boolean;
      walkIn?: boolean;
      dropOff?: boolean;
    };
    wheelchairAccessible?: string;
    supportedTaxYears: {
      currentYear?: boolean;
      currentLastYears?: boolean;
      multipleYears?: boolean;
    };
    provinces: { [key: string]: boolean };
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
    accessDocuments: {
      allDocuments?: boolean;
      someDocuments?: boolean;
      noDocuments?: boolean;
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
    appointmentType: '',
    postalCodesServe: '',
    serviceDeliveryModes: {
      inPerson: false,
      virtual: false,
      byAppointment: false,
      walkIn: false,
      dropOff: false,
    },
    wheelchairAccessible: '',
    supportedTaxYears: {
      currentYear: false,
      currentLastYears: false,
      multipleYears: false,
    },
    provinces: {
      Ontario: false,
      Quebec: false,
      Other: false,
    },
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
    accessDocuments: {
      allDocuments: false,
      someDocuments: false,
      noDocuments: false,
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
      appointmentType: '',
      postalCodesServe: '',
      serviceDeliveryModes: {
        inPerson: false,
        virtual: false,
        byAppointment: false,
        walkIn: false,
        dropOff: false,
      },
      wheelchairAccessible: '',
      supportedTaxYears: {
        currentYear: false,
        currentLastYears: false,
        multipleYears: false,
      },
      provinces: {
        Ontario: false,
        Quebec: false,
        Other: false,
      },
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
      accessDocuments: {
        allDocuments: false,
        someDocuments: false,
        noDocuments: false,
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

  closeFilterSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
