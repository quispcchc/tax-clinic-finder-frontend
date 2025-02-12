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

  filters: {
    appointmentType?: string;
    serviceDeliveryModes: {
      inPerson?: boolean;
      virtual?: boolean;
      byAppointment?: boolean;
      walkIn?: boolean;
      dropOff?: boolean;
    };
    wheelchairAccessible?: string;
    servePeopleFrom?: string;
    otherServePeopleFrom?: string;
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
    };
    accessDocuments: {
      allDocuments?: boolean;
      someDocuments?: boolean;
      noDocuments?: boolean;
    };
    appointmentBooking: {
      onlineAppointment?: boolean;
      phone?: boolean;
      inPerson?: boolean;
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
    serviceDeliveryModes: {
      inPerson: false,
      virtual: false,
      byAppointment: false,
      walkIn: false,
      dropOff: false,
    },
    wheelchairAccessible: '',
    servePeopleFrom: '',
    otherServePeopleFrom: '',
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
    },
    accessDocuments: {
      allDocuments: false,
      someDocuments: false,
      noDocuments: false,
    },
    appointmentBooking: {
      onlineAppointment: false,
      phone: false,
      inPerson: false,
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

  applyFilters() {
    this.toggleSidebarEvent.emit();
    this.filterChange.emit({
      filters: this.filters,
      isNewClient: this.isNewClient,
    });
  }

  resetFilters() {
    this.filters = {
      appointmentType: '',
      serviceDeliveryModes: {
        inPerson: false,
        virtual: false,
        byAppointment: false,
        walkIn: false,
        dropOff: false,
      },
      wheelchairAccessible: '',
      servePeopleFrom: '',
      otherServePeopleFrom: '',
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
      },
      accessDocuments: {
        allDocuments: false,
        someDocuments: false,
        noDocuments: false,
      },
      appointmentBooking: {
        onlineAppointment: false,
        phone: false,
        inPerson: false,
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
    this.filterChange.emit({
      filters: this.filters,
      isNewClient: this.isNewClient
    });
  }

  closeFilterSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
