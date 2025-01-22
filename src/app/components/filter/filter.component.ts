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
    appointmentType?: string;
    supportedTaxYears: {
      lastYear?: boolean;
      lastTwoYears?: boolean;
      lastThreeYears?: boolean;
      all?: boolean;
    };
    provinces: { [key: string]: boolean };
    specialTaxCases: {
      selfEmployed?: boolean;
      deceased?: boolean;
      bankruptcy?: boolean;
      imprisoned?: boolean;
    };
    incomeLevelRestrictions: {
      hasRestriction?: boolean;
      incomeLevel?: string;
    };
    languageOptions: {
      french?: boolean;
      english?: boolean;
      arabic?: boolean;
      other?: boolean;
      otherLanguage?: string;
    };
    serviceDeliveryModes: {
      inPerson?: boolean;
      virtual?: boolean;
      byAppointment?: boolean;
      walkIn?: boolean;
    };
    clientCategories: {
      newcomers?: boolean;
      students?: boolean;
      indigenousClients?: boolean;
    };
    catchmentArea: {
      hasCatchmentArea?: boolean;
      postalCode?: string;
    };
    appointmentBooking: {
      onlineAppointment?: boolean;
      call?: boolean;
      inPerson?: boolean;
    };
    serviceDays: {
      weekdays?: boolean;
      weekends?: boolean;
    };
    serviceHours: {
      workHours?: boolean;
      afterHours?: boolean;
    };
  } = {
    appointmentType: '',
    supportedTaxYears: {
      lastYear: false,
      lastTwoYears: false,
      lastThreeYears: false,
      all: false,
    },
    provinces: {
      AB: false,
      BC: false,
      MB: false,
      NB: false,
      ON: false
    },
    specialTaxCases: {
      selfEmployed: false,
      deceased: false,
      bankruptcy: false,
      imprisoned: false,
    },
    incomeLevelRestrictions: {
      hasRestriction: false,
      incomeLevel: '',
    },
    languageOptions: {
      french: false,
      english: false,
      arabic: false,
      other: false,
      otherLanguage: '',
    },
    serviceDeliveryModes: {
      inPerson: false,
      virtual: false,
      byAppointment: false,
      walkIn: false,
    },
    clientCategories: {
      newcomers: false,
      students: false,
      indigenousClients: false,
    },
    catchmentArea: {
      hasCatchmentArea: false,
      postalCode: '',
    },
    appointmentBooking: {
      onlineAppointment: false,
      call: false,
      inPerson: false,
    },
    serviceDays: {
      weekdays: false,
      weekends: false,
    },
    serviceHours: {
      workHours: false,
      afterHours: false,
    }
  };

  constructor() {}

  applyFilters() {
    this.filterChange.emit(this.filters);
  }

  closeFilterSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
